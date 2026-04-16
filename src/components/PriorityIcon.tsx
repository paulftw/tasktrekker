import {
  Signal,
  SignalHigh,
  SignalMedium,
  SignalLow,
  SignalZero,
  type LucideIcon,
} from "lucide-react";
import type { IssuePriority } from "@/types/enums";

const CONFIG: Record<
  IssuePriority,
  { icon: LucideIcon; label: string; className: string }
> = {
  urgent: { icon: Signal, label: "Urgent", className: "text-priority-urgent" },
  high: { icon: SignalHigh, label: "High", className: "text-priority-high" },
  medium: { icon: SignalMedium, label: "Medium", className: "text-priority-medium" },
  low: { icon: SignalLow, label: "Low", className: "text-priority-low" },
  none: { icon: SignalZero, label: "No priority", className: "text-priority-none" },
  "%future added value": { icon: SignalZero, label: "Unknown", className: "text-priority-none" },
};

export function PriorityIcon({
  priority,
  className = "",
}: {
  priority: IssuePriority;
  className?: string;
}) {
  const { icon: Icon, label, className: color } = CONFIG[priority];
  return (
    <Icon className={`size-4 ${color}${className ? ` ${className}` : ""}`} aria-label={label}>
      <title>{label}</title>
    </Icon>
  );
}
