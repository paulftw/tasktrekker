"use client";

import { useEffect, useRef, useState } from "react";
import { graphql, useMutation } from "react-relay";
import { toast } from "sonner";
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
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [commit, isInFlight] = useMutation<StatusPickerUpdateMutation>(mutation);

  useEffect(() => {
    if (!open) return;
    const onMouseDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open]);

  const current = STATUS_CONFIG[status];
  const CurrentIcon = current.icon;

  function onSelect(next: IssueStatus) {
    setOpen(false);
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
    <div ref={ref} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={isInFlight}
        aria-label={`Status: ${current.label}. Click to change.`}
        className="inline-flex items-center justify-center rounded p-0.5 hover:bg-bg-hover transition-colors disabled:opacity-60"
      >
        <CurrentIcon className={`size-4 ${current.className}`} />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full mt-1 z-10 min-w-40 rounded-md border border-border bg-bg-overlay shadow-lg py-1"
        >
          {SELECTABLE_STATUSES.map((value) => {
            const { icon: Icon, label, className: color } = STATUS_CONFIG[value];
            const isCurrent = value === status;
            return (
              <button
                key={value}
                type="button"
                role="menuitem"
                onClick={() => onSelect(value)}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 text-sm text-text hover:bg-bg-hover transition-colors ${
                  isCurrent ? "font-medium" : ""
                }`}
              >
                <Icon className={`size-4 ${color}`} />
                {label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
