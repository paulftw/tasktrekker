import {
  Circle,
  CircleCheck,
  CircleDashed,
  CircleDot,
  CircleX,
  type LucideIcon,
} from "lucide-react";
import type { IssueStatus } from "@/types/enums";

const CONFIG: Record<
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

export function StatusIcon({
  status,
  className = "",
}: {
  status: IssueStatus;
  className?: string;
}) {
  const { icon: Icon, label, className: color } = CONFIG[status];
  return (
    <Icon className={`size-4 ${color}${className ? ` ${className}` : ""}`} aria-label={label}>
      <title>{label}</title>
    </Icon>
  );
}
