import {
  Circle,
  CircleCheck,
  CircleDashed,
  CircleDot,
  CircleX,
  type LucideIcon,
} from "lucide-react";
import type { IssueStatus } from "@/types/enums";

// This could go in a "business logic" layer. But it's small enough and used in two places.
// Most common problem with this shortcut - test or module needing config only also brings in React and icons.
export const STATUS_CONFIG: Record<
  IssueStatus,
  { icon: LucideIcon; label: string; className: string }
> = {
  backlog: { icon: CircleDashed, label: "Backlog", className: "text-status-backlog" },
  todo: { icon: Circle, label: "Todo", className: "text-status-todo" },
  in_progress: { icon: CircleDot, label: "In Progress", className: "text-status-in-progress" },
  done: { icon: CircleCheck, label: "Done", className: "text-status-done" },
  cancelled: { icon: CircleX, label: "Cancelled", className: "text-status-cancelled" },
  "%future added value": { icon: CircleDashed, label: "Unknown", className: "text-status-backlog" },
};

export const SELECTABLE_STATUSES: IssueStatus[] = [
  "backlog",
  "todo",
  "in_progress",
  "done",
  "cancelled",
];

export function StatusIcon({
  status,
  className = "",
}: {
  status: IssueStatus;
  className?: string;
}) {
  const { icon: Icon, label, className: color } = STATUS_CONFIG[status];
  return (
    <Icon className={`size-4 ${color}${className ? ` ${className}` : ""}`} aria-label={label}>
      <title>{label}</title>
    </Icon>
  );
}
