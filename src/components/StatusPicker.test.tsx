import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RelayEnvironmentProvider } from 'react-relay';
import { createMockEnvironment } from 'relay-test-utils';
import { describe, expect, it } from 'vitest';
import { StatusPicker } from './StatusPicker';

// Invariant: selecting a status commits StatusPickerUpdateMutation with
// { number, status: <chosen> } matching the clicked option. Pins the contract
// between StatusPicker and the GraphQL mutation so the two can't drift silently.

describe('StatusPicker', () => {
  it('commits the mutation with the chosen status', async () => {
    const environment = createMockEnvironment();
    const user = userEvent.setup();

    render(
      <RelayEnvironmentProvider environment={environment}>
        <StatusPicker nodeId="issues:1" number={7} status="todo" />
      </RelayEnvironmentProvider>,
    );

    await user.click(screen.getByRole('button', { name: /status: todo/i }));
    await user.click(screen.getByRole('menuitem', { name: /in progress/i }));

    const op = environment.mock.getMostRecentOperation();
    expect(op.fragment.node.name).toBe('StatusPickerUpdateMutation');
    expect(op.request.variables).toEqual({ number: 7, status: 'in_progress' });
  });

  it('does not commit when the selected status equals the current one', async () => {
    const environment = createMockEnvironment();
    const user = userEvent.setup();

    render(
      <RelayEnvironmentProvider environment={environment}>
        <StatusPicker nodeId="issues:1" number={7} status="todo" />
      </RelayEnvironmentProvider>,
    );

    await user.click(screen.getByRole('button', { name: /status: todo/i }));
    await user.click(screen.getByRole('menuitem', { name: /^todo$/i }));

    expect(environment.mock.getAllOperations()).toHaveLength(0);
  });
});
