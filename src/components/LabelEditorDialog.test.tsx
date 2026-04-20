import type { ComponentProps } from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RelayEnvironmentProvider } from 'react-relay';
import { createMockEnvironment } from 'relay-test-utils';
import { describe, expect, it, vi } from 'vitest';
import { LabelEditorDialog } from './LabelEditorDialog';

function renderDialog(props: Partial<ComponentProps<typeof LabelEditorDialog>> = {}) {
  const environment = createMockEnvironment();
  const onClose = vi.fn();

  render(
    <RelayEnvironmentProvider environment={environment}>
      <LabelEditorDialog open mode="create" onClose={onClose} {...props} />
    </RelayEnvironmentProvider>,
  );

  return { environment, onClose };
}

describe('LabelEditorDialog', () => {
  it('creates a label with the chosen name and palette color', async () => {
    const { environment } = renderDialog();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/name/i), 'API');
    await user.click(screen.getByRole('button', { name: /color blue/i }));
    await user.click(screen.getByRole('button', { name: /create label/i }));

    const operation = environment.mock.getMostRecentOperation();
    expect(operation.fragment.node.name).toBe('LabelEditorDialogCreateMutation');
    expect(operation.request.variables).toEqual({
      objects: [{ name: 'API', color: '3b82f6' }],
    });
  });

  it('updates a label name and color in edit mode', async () => {
    const { environment } = renderDialog({
      mode: 'edit',
      label: {
        nodeId: 'labels:1',
        number: 1,
        name: 'Bug',
        color: 'ef4444',
      },
    });
    const user = userEvent.setup();

    const input = screen.getByLabelText(/name/i);
    await user.clear(input);
    await user.type(input, 'Regression');
    await user.click(screen.getByRole('button', { name: /color teal/i }));
    await user.click(screen.getByRole('button', { name: /^save$/i }));

    const operation = environment.mock.getMostRecentOperation();
    expect(operation.fragment.node.name).toBe('LabelEditorDialogUpdateMutation');
    expect(operation.request.variables).toEqual({
      number: 1,
      set: { name: 'Regression', color: '10b981' },
    });
  });

  it('shows delete warning and deletes the label from edit mode', async () => {
    const { environment } = renderDialog({
      mode: 'edit',
      label: {
        nodeId: 'labels:1',
        number: 1,
        name: 'Bug',
        color: 'ef4444',
      },
    });
    const user = userEvent.setup();

    expect(screen.getByText('Deleting it removes the label from every issue.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /delete label/i }));

    const operation = environment.mock.getMostRecentOperation();
    expect(operation.fragment.node.name).toBe('LabelEditorDialogDeleteMutation');
    expect(operation.request.variables).toEqual({ number: 1 });

    await act(async () => {
      environment.mock.resolveMostRecentOperation(() => ({
        data: {
          deleteFromlabelsCollection: {
            records: [{ nodeId: 'labels:1', number: 1 }],
          },
        },
      }));
    });
  });
});
