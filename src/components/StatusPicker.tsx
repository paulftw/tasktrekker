"use client";

import { graphql, useMutation } from "react-relay";
import { toast } from "sonner";
import { Dropdown } from "./Dropdown";
import type { IssueStatus } from "@/types/enums";
import type { StatusPickerUpdateMutation } from "@/__generated__/StatusPickerUpdateMutation.graphql";
import { SELECTABLE_STATUSES, STATUS_CONFIG } from "./StatusIcon";

const mutation = graphql`
  mutation StatusPickerUpdateMutation($number: Int!, $status: issue_status!) {
    updateissuesCollection(
      set: { status: $status }
      filter: { number: { eq: $number } }
      atMost: 1
    ) {
      records {
        nodeId
        status
      }
    }
  }
`;

export function StatusPicker({
  nodeId,
  number,
  status,
  className = "",
}: {
  nodeId: string;
  number: number;
  status: IssueStatus;
  className?: string;
}) {
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
      onError: (err) => {
        const msg = err instanceof Error ? err.message : "Unknown error";
        toast.error("Failed to update status", { description: msg });
        console.error("Status update failed:", err);
      },
    });
  }

  return (
    <Dropdown className={className}>
      <Dropdown.Trigger
        disabled={isInFlight}
        aria-label={`Status: ${current.label}. Click to change.`}
        className="inline-flex items-center justify-center rounded p-0.5 hover:bg-bg-hover transition-colors disabled:opacity-60"
      >
        <CurrentIcon className={`size-4 ${current.className}`} />
      </Dropdown.Trigger>
      
      <Dropdown.Menu className="left-0 top-full mt-1 min-w-40">
        {SELECTABLE_STATUSES.map((value) => {
          const { icon: Icon, label, className: color } = STATUS_CONFIG[value];
          const isCurrent = value === status;
          return (
            <Dropdown.Item
              key={value}
              onClick={() => onSelect(value)}
              className={isCurrent ? "font-medium" : ""}
            >
              <Icon className={`size-4 ${color}`} />
              {label}
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
}
