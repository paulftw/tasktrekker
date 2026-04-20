'use client';

import { graphql, useMutation } from 'react-relay';
import { toast } from 'sonner';
import { Dropdown } from './Dropdown';
import type { IssueStatus } from '@/types/enums';
import type { StatusPickerUpdateMutation } from '@/__generated__/StatusPickerUpdateMutation.graphql';
import { ISSUE_STATUSES, STATUS_CONFIG } from './StatusIcon';

const mutation = graphql`
  mutation StatusPickerUpdateMutation($number: Int!, $status: issue_status!) {
    updateissuesCollection(set: { status: $status }, filter: { number: { eq: $number } }, atMost: 1) {
      records {
        nodeId
        status
      }
    }
  }
`;

export function StatusPicker({ nodeId, number, status }: { nodeId: string; number: number; status: IssueStatus }) {
  const [commit, isInFlight] = useMutation<StatusPickerUpdateMutation>(mutation);

  const current = STATUS_CONFIG[status];
  const CurrentIcon = current.icon;

  function onSelect(next: IssueStatus) {
    if (next === status) return;
    commit({
      variables: { number, status: next },
      optimisticResponse: {
        updateissuesCollection: {
          records: [{ nodeId, status: next }],
        },
      },
      onError: err => {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        toast.error('Failed to update status', { description: msg });
        console.error('Status update failed:', err);
      },
    });
  }

  return (
    <Dropdown>
      <Dropdown.Trigger
        disabled={isInFlight}
        aria-label={`Status: ${current.label}. Click to change.`}
        className="inline-flex items-center gap-1.5 px-1.5 py-[3px] -ml-1.5 rounded-[5px] text-[12.5px] text-fg hover:bg-surface-hover transition-colors disabled:opacity-60 cursor-pointer"
      >
        <CurrentIcon width={14} height={14} className={current.className} />
        <span>{current.label}</span>
      </Dropdown.Trigger>

      <Dropdown.Menu className="min-w-40">
        {ISSUE_STATUSES.map(value => {
          const { icon: Icon, label, className: color } = STATUS_CONFIG[value];
          const isCurrent = value === status;
          return (
            <Dropdown.Item key={value} onClick={() => onSelect(value)} className={isCurrent ? 'font-medium' : ''}>
              <Icon width={14} height={14} className={color} />
              {label}
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
}
