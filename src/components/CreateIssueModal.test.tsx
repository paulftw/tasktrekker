import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RelayEnvironmentProvider } from 'react-relay';
import { createMockEnvironment } from 'relay-test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CreateIssueModal } from './CreateIssueModal';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock('@/lib/usePlatformEditorHint', () => ({
  usePlatformEditorHint: () => null,
}));

function renderModal() {
  const environment = createMockEnvironment();
  const onClose = vi.fn();

  render(
    <RelayEnvironmentProvider environment={environment}>
      <CreateIssueModal
        open
        onClose={onClose}
        users={[
          { nodeId: 'users:1', id: 'u1', name: 'Ada Lovelace', avatar_url: null },
          { nodeId: 'users:2', id: 'u2', name: 'Grace Hopper', avatar_url: null },
        ]}
        labels={[
          { nodeId: 'labels:1', number: 1, name: 'Bug', color: 'ef4444' },
          { nodeId: 'labels:2', number: 2, name: 'Design', color: '10b981' },
        ]}
      />
    </RelayEnvironmentProvider>,
  );

  return { environment, onClose };
}

describe('CreateIssueModal', () => {
  beforeEach(() => {
    mockPush.mockReset();
  });

  it('defaults assignee to unassigned and creates todo/medium issues', async () => {
    const { environment } = renderModal();
    const user = userEvent.setup();

    expect(screen.getByRole('button', { name: /unassigned/i })).toBeInTheDocument();

    await user.type(screen.getByRole('textbox', { name: /issue title/i }), 'Ship modal');
    await user.click(screen.getByRole('button', { name: /^create issue$/i }));

    const operation = environment.mock.getMostRecentOperation();
    expect(operation.fragment.node.name).toBe('CreateIssueModalCreateMutation');
    expect(operation.request.variables).toEqual({
      objects: [
        {
          title: 'Ship modal',
          description: '',
          status: 'todo',
          priority: 'medium',
          assignee_id: null,
        },
      ],
    });
  });

  it('creates label links after the issue insert resolves', async () => {
    const { environment, onClose } = renderModal();
    const user = userEvent.setup();

    await user.type(screen.getByRole('textbox', { name: /issue title/i }), 'Ship modal');
    await user.click(screen.getByRole('button', { name: /^add label$/i }));
    await user.click(screen.getByRole('menuitem', { name: /bug/i }));
    await user.click(screen.getByRole('button', { name: /^create issue$/i }));

    expect(environment.mock.getMostRecentOperation().fragment.node.name).toBe('CreateIssueModalCreateMutation');

    await act(async () => {
      environment.mock.resolveMostRecentOperation(() => ({
        data: {
          insertIntoissuesCollection: {
            records: [{ nodeId: 'issues:42', number: 42 }],
          },
        },
      }));
    });

    const labelsOperation = environment.mock.getMostRecentOperation();
    expect(labelsOperation.fragment.node.name).toBe('CreateIssueModalAddLabelsMutation');
    expect(labelsOperation.request.variables).toEqual({
      objects: [{ issue_id: 42, label_id: 1 }],
    });

    await act(async () => {
      environment.mock.resolveMostRecentOperation(() => ({
        data: {
          insertIntoissue_labelsCollection: {
            affectedCount: 1,
          },
        },
      }));
    });

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/issues/42');
  });

  it('removes a selected label by clicking the pill', async () => {
    renderModal();
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /^add label$/i }));
    await user.click(screen.getByRole('menuitem', { name: /bug/i }));

    const removeLabelButton = screen.getByRole('button', { name: /remove label bug/i });
    expect(removeLabelButton).toBeInTheDocument();

    await user.click(removeLabelButton);

    expect(screen.queryByRole('button', { name: /remove label bug/i })).not.toBeInTheDocument();
  });

  it('filters labels in the add label menu', async () => {
    renderModal();
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /^add label$/i }));
    const searchInput = screen.getByRole('textbox', { name: 'Search labels' });
    await user.type(searchInput, 'des');

    expect(screen.getByRole('menuitem', { name: /design/i })).toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: /bug/i })).not.toBeInTheDocument();
  });
});
