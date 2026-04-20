'use client';

import { graphql, useMutation } from 'react-relay';
import { toast } from 'sonner';
import { Dropdown } from './Dropdown';
import type { IssuePriority } from '@/types/enums';
import type { PriorityPickerUpdateMutation } from '@/__generated__/PriorityPickerUpdateMutation.graphql';
import { SELECTABLE_PRIORITIES, PRIORITY_CONFIG } from './PriorityIcon';

const mutation = graphql`
  mutation PriorityPickerUpdateMutation($number: Int!, $priority: issue_priority!) {
    updateissuesCollection(set: { priority: $priority }, filter: { number: { eq: $number } }) {
      records {
        nodeId
        priority
      }
    }
  }
`;

export function PriorityPicker({
  nodeId,
  number,
  priority,
}: {
  nodeId: string;
  number: number;
  priority: IssuePriority;
}) {
  const [commit, isInFlight] = useMutation<PriorityPickerUpdateMutation>(mutation);

  const current = PRIORITY_CONFIG[priority];
  const CurrentIcon = current.icon;

  function onSelect(next: IssuePriority) {
    if (next === priority) return;
    commit({
      variables: { number, priority: next },
      optimisticResponse: {
        updateissuesCollection: {
          records: [{ nodeId, priority: next }],
        },
      },
      onError: err => {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        toast.error('Failed to update priority', { description: msg });
        console.error('Priority update failed:', err);
      },
    });
  }

  return (
    <Dropdown>
      <Dropdown.Trigger
        disabled={isInFlight}
        aria-label={`Priority: ${current.label}. Click to change.`}
        className="inline-flex items-center gap-1.5 px-1.5 py-[3px] -ml-1.5 rounded-[5px] text-[12.5px] text-fg hover:bg-surface-hover transition-colors disabled:opacity-60 cursor-pointer"
      >
        <CurrentIcon width={14} height={14} className={`${current.className} -translate-y-[0.5px]`} />
        <span>{current.label}</span>
      </Dropdown.Trigger>

      <Dropdown.Menu className="min-w-40">
        {SELECTABLE_PRIORITIES.map(value => {
          const { icon: Icon, label, className: color } = PRIORITY_CONFIG[value];
          const isCurrent = value === priority;
          return (
            <Dropdown.Item key={value} onClick={() => onSelect(value)} className={isCurrent ? 'font-medium' : ''}>
              <Icon width={14} height={14} className={color} />
              <span className="flex-1 text-left">{label}</span>
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
}
