'use client';

import { graphql, useMutation } from 'react-relay';
import { toast } from 'sonner';
import { Dropdown } from './Dropdown';
import { UserAvatar } from './UserAvatar';
import type { AssigneePickerUpdateMutation } from '@/__generated__/AssigneePickerUpdateMutation.graphql';

const mutation = graphql`
  mutation AssigneePickerUpdateMutation($number: Int!, $assignee_id: UUID) {
    updateissuesCollection(set: { assignee_id: $assignee_id }, filter: { number: { eq: $number } }, atMost: 1) {
      records {
        nodeId
        assignee_id
        users {
          nodeId
          id
          name
          avatar_url
        }
      }
    }
  }
`;

type User = {
  readonly nodeId: string;
  readonly id: string;
  readonly name: string;
  readonly avatar_url?: string | null;
};

export function AssigneePicker({
  nodeId,
  number,
  assigneeId,
  assignee,
  users,
}: {
  nodeId: string;
  number: number;
  assigneeId: string | null;
  assignee: { name: string; avatar_url?: string | null } | null | undefined;
  users: ReadonlyArray<User>;
}) {
  const [commit, isInFlight] = useMutation<AssigneePickerUpdateMutation>(mutation);

  function onSelect(user: User | null) {
    const nextId = user?.id ?? null;
    if (nextId === assigneeId) return;
    commit({
      variables: { number, assignee_id: nextId },
      optimisticResponse: {
        updateissuesCollection: {
          records: [
            {
              nodeId,
              assignee_id: nextId,
              users: user
                ? {
                    nodeId: user.nodeId,
                    id: user.id,
                    name: user.name,
                    avatar_url: user.avatar_url ?? null,
                  }
                : null,
            },
          ],
        },
      },
      onError: err => {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        toast.error('Failed to update assignee', { description: msg });
        console.error('Assignee update failed:', err);
      },
    });
  }

  const label = assignee ? assignee.name : 'Unassigned';

  return (
    <Dropdown>
      <Dropdown.Trigger
        disabled={isInFlight}
        aria-label={`Assignee: ${label}. Click to change.`}
        className={`flex items-center gap-1.5 px-1.5 py-[3px] -ml-1.5 rounded-[5px] text-[12.5px] hover:bg-surface-hover transition-colors disabled:opacity-60 cursor-pointer max-w-full min-w-0 ${
          assignee ? 'text-fg' : 'text-fg-subtle'
        }`}
      >
        <UserAvatar user={assignee ?? null} size={18} />
        <span className="truncate">{label}</span>
      </Dropdown.Trigger>

      <Dropdown.Menu align="end" className="min-w-48 w-64 max-w-[calc(100vw-2rem)]">
        <Dropdown.Item onClick={() => onSelect(null)} className={assigneeId === null ? 'font-medium' : ''}>
          <UserAvatar user={null} size={18} />
          <span className="truncate">Unassigned</span>
        </Dropdown.Item>
        {users.map(u => (
          <Dropdown.Item
            key={u.nodeId}
            onClick={() => onSelect(u)}
            className={u.id === assigneeId ? 'font-medium' : ''}
          >
            <UserAvatar user={u} size={18} />
            <span className="truncate">{u.name}</span>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
