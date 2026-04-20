import { Suspense, useEffect } from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RelayEnvironmentProvider, graphql, useLazyLoadQuery, useRelayEnvironment } from 'react-relay';
import { createMockEnvironment } from 'relay-test-utils';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { CreateIssueModal } from './CreateIssueModal';
import type { CreateIssueModalTestQuery } from '@/__generated__/CreateIssueModalTestQuery.graphql';

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock('@/lib/usePlatformEditorHint', () => ({
  usePlatformEditorHint: () => null,
}));

const testQuery = graphql`
  query CreateIssueModalTestQuery @relay_test_operation {
    usersCollection(first: 100) {
      edges {
        node {
          id
          name
          avatar_url
          nodeId
        }
      }
    }
    labelsCollection(first: 100, orderBy: [{ name: AscNullsLast }]) {
      edges {
        node {
          number
          name
          color
          nodeId
        }
      }
    }
  }
`;

function TestWrapper({ onClose }: { onClose: () => void }) {
  const environment = useRelayEnvironment();
  
  // Mock invalidateStore to prevent re-fetch suspension warnings in tests
  useEffect(() => {
    const store = environment.getStore();
    (store as any).invalidateStore = () => {};
  }, [environment]);

  const data = useLazyLoadQuery<CreateIssueModalTestQuery>(testQuery, {});
  const users = data.usersCollection?.edges.map(e => e.node) ?? [];
  const labels = data.labelsCollection?.edges.map(e => e.node) ?? [];

  return <CreateIssueModal open onClose={onClose} users={users} labels={labels} />;
}

async function renderModal() {
  const environment = createMockEnvironment();
  const onClose = vi.fn();

  render(
    <RelayEnvironmentProvider environment={environment}>
      <Suspense fallback="Loading...">
        <TestWrapper onClose={onClose} />
      </Suspense>
    </RelayEnvironmentProvider>,
  );

  await act(async () => {
    environment.mock.resolveMostRecentOperation(() => ({
      data: {
        usersCollection: {
          edges: [
            { node: { nodeId: 'users:1', id: 'u1', name: 'Ada Lovelace', avatar_url: null } },
            { node: { nodeId: 'users:2', id: 'u2', name: 'Grace Hopper', avatar_url: null } },
          ],
        },
        labelsCollection: {
          edges: [
            { node: { nodeId: 'labels:1', number: 1, name: 'Bug', color: 'ef4444' } },
            { node: { nodeId: 'labels:2', number: 2, name: 'Design', color: '10b981' } },
          ],
        },
      },
    }));
  });

  return { environment, onClose };
}

describe('CreateIssueModal', () => {
  beforeEach(() => {
    mockPush.mockReset();
  });

  afterEach(async () => {
    // Settle any pending Radix transitions or focus management
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
  });

  it('defaults assignee to unassigned and creates todo/medium issues', async () => {
    const { environment } = await renderModal();
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
    const { environment, onClose } = await renderModal();
    const user = userEvent.setup();

    await user.type(screen.getByRole('textbox', { name: /issue title/i }), 'Ship modal');
    await user.click(screen.getByRole('button', { name: /^add label$/i }));
    await user.click(screen.getByRole('menuitem', { name: /bug/i }));
    
    // Wait for dropdown to close and focus to settle
    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

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
    await renderModal();
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /^add label$/i }));
    await user.click(screen.getByRole('menuitem', { name: /bug/i }));
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /remove label bug/i })).toBeInTheDocument();
    });

    const removeLabelButton = screen.getByRole('button', { name: /remove label bug/i });
    await user.click(removeLabelButton);

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /remove label bug/i })).not.toBeInTheDocument();
    });
  });

  it('filters labels in the add label menu', async () => {
    await renderModal();
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /^add label$/i }));
    const searchInput = screen.getByRole('textbox', { name: 'Search labels' });
    await user.type(searchInput, 'des');

    expect(screen.getByRole('menuitem', { name: /design/i })).toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: /bug/i })).not.toBeInTheDocument();
    
    // Close menu and wait for cleanup
    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
  });

  it('creates a new label from the add-label menu and selects it', async () => {
    const { environment } = await renderModal();
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /^add label$/i }));
    await user.click(screen.getByRole('menuitem', { name: /create new label/i }));
    
    await waitFor(() => {
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/name/i), 'API');
    await user.click(screen.getByRole('button', { name: /color blue/i }));
    await user.click(screen.getByRole('button', { name: /create label/i }));

    const operation = environment.mock.getMostRecentOperation();
    expect(operation.fragment.node.name).toBe('LabelEditorDialogCreateMutation');
    expect(operation.request.variables).toEqual({
      objects: [{ name: 'API', color: '3b82f6' }],
    });

    await act(async () => {
      environment.mock.resolveMostRecentOperation(() => ({
        data: {
          insertIntolabelsCollection: {
            records: [{ nodeId: 'labels:3', number: 3, name: 'API', color: '3b82f6' }],
          },
        },
      }));
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /remove label api/i })).toBeInTheDocument();
    });
  });
});
