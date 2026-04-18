"use client";

import { graphql, useMutation } from "react-relay";
import { toast } from "sonner";
import { Dropdown } from "./Dropdown";
import type { IssuePriority } from "@/types/enums";
import type { PriorityPickerUpdateMutation } from "@/__generated__/PriorityPickerUpdateMutation.graphql";
import { SELECTABLE_PRIORITIES, PRIORITY_CONFIG } from "./PriorityIcon";

const mutation = graphql`
  mutation PriorityPickerUpdateMutation($number: Int!, $priority: issue_priority!) {
    updateissuesCollection(
      set: { priority: $priority }
      filter: { number: { eq: $number } }
    ) {
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
      onError: (err) => {
        const msg = err instanceof Error ? err.message : "Unknown error";
        toast.error("Failed to update priority", { description: msg });
        console.error("Priority update failed:", err);
      },
    });
  }

  return (
    <Dropdown className="w-full">
      <Dropdown.Trigger
        disabled={isInFlight}
        aria-label={`Priority: ${current.label}. Click to change.`}
        className="w-full flex items-center gap-2 rounded px-1.5 py-1 -ml-1.5 hover:bg-bg-hover transition-colors disabled:opacity-60"
      >
        <CurrentIcon className={`size-4 ${current.className}`} />
        <span className="text-sm text-text flex-1 text-left">{current.label}</span>
      </Dropdown.Trigger>
      
      <Dropdown.Menu className="min-w-40 w-full top-full left-0 mt-1">
        {SELECTABLE_PRIORITIES.map((value) => {
          const { icon: Icon, label, className: color } = PRIORITY_CONFIG[value];
          const isCurrent = value === priority;
          return (
            <Dropdown.Item
              key={value}
              onClick={() => onSelect(value)}
              className={isCurrent ? "font-medium" : ""}
            >
              <Icon className={`size-4 ${color}`} />
              <span className="flex-1 text-left">{label}</span>
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
}
