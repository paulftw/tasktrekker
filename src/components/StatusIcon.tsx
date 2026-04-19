import type { ComponentType, SVGProps } from 'react';
import type { IssueStatus } from '@/types/enums';

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const CircleDashed: IconComponent = props => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle
      cx="12"
      cy="12"
      r="9.25"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeDasharray="2.6 2.6"
    />
  </svg>
);

const CircleRing: IconComponent = props => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="12" cy="12" r="9.25" stroke="currentColor" strokeWidth="1.75" />
  </svg>
);

const CircleDot: IconComponent = props => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle
      cx="12"
      cy="12"
      r="9.25"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeDasharray="0.01 4.2"
      strokeLinecap="round"
    />
    <circle cx="12" cy="12" r="4" fill="currentColor" />
  </svg>
);

const CircleCheck: IconComponent = props => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="12" cy="12" r="10" />
    <path
      d="M7.5 12.2l3.2 3.2 6-6.2"
      stroke="white"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CircleX: IconComponent = props => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M8.5 8.5l7 7M15.5 8.5l-7 7" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// This could go in a "business logic" layer. But it's small enough and used in two places.
// Most common problem with this shortcut - test or module needing config only also brings in React and icons.
export const STATUS_CONFIG: Record<IssueStatus, { icon: IconComponent; label: string; className: string }> = {
  backlog: { icon: CircleDashed, label: 'Backlog', className: 'text-status-backlog' },
  todo: { icon: CircleRing, label: 'Todo', className: 'text-status-todo' },
  in_progress: { icon: CircleDot, label: 'In Progress', className: 'text-status-in-progress' },
  done: { icon: CircleCheck, label: 'Done', className: 'text-status-done' },
  cancelled: { icon: CircleX, label: 'Cancelled', className: 'text-status-cancelled' },
  '%future added value': { icon: CircleDashed, label: 'Unknown', className: 'text-status-backlog' },
};

export const SELECTABLE_STATUSES: IssueStatus[] = ['in_progress', 'todo', 'backlog', 'done', 'cancelled'];

export function StatusIcon({
  status,
  size = 14,
  className = '',
}: {
  status: IssueStatus;
  size?: number;
  className?: string;
}) {
  const { icon: Icon, label, className: color } = STATUS_CONFIG[status];
  return (
    <Icon
      width={size}
      height={size}
      className={`${color}${className ? ` ${className}` : ''}`}
      role="img"
      aria-label={label}
    >
      <title>{label}</title>
    </Icon>
  );
}
