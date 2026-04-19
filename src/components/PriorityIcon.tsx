import type { ComponentType, SVGProps } from 'react';
import type { IssuePriority } from '@/types/enums';

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const SignalLow: IconComponent = props => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="3" y="16" width="3" height="5" rx="0.75" fill="currentColor" />
    <rect x="9" y="12" width="3" height="9" rx="0.75" fill="currentColor" opacity="0.3" />
    <rect x="15" y="8" width="3" height="13" rx="0.75" fill="currentColor" opacity="0.3" />
  </svg>
);

const SignalMedium: IconComponent = props => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="3" y="16" width="3" height="5" rx="0.75" fill="currentColor" />
    <rect x="9" y="12" width="3" height="9" rx="0.75" fill="currentColor" />
    <rect x="15" y="8" width="3" height="13" rx="0.75" fill="currentColor" opacity="0.3" />
  </svg>
);

const SignalHigh: IconComponent = props => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="3" y="16" width="3" height="5" rx="0.75" fill="currentColor" />
    <rect x="9" y="12" width="3" height="9" rx="0.75" fill="currentColor" />
    <rect x="15" y="8" width="3" height="13" rx="0.75" fill="currentColor" />
  </svg>
);

const Urgent: IconComponent = props => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="4" fill="currentColor" />
    <path d="M12 8v5" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="16" r="1.1" fill="white" />
  </svg>
);

export const PRIORITY_CONFIG: Record<IssuePriority, { icon: IconComponent; label: string; className: string }> = {
  urgent: { icon: Urgent, label: 'Urgent', className: 'text-priority-urgent' },
  high: { icon: SignalHigh, label: 'High', className: 'text-priority-high' },
  medium: { icon: SignalMedium, label: 'Medium', className: 'text-priority-medium' },
  low: { icon: SignalLow, label: 'Low', className: 'text-priority-low' },
  '%future added value': {
    icon: SignalLow,
    label: 'Unknown',
    className: 'text-priority-low',
  },
};

export const SELECTABLE_PRIORITIES: IssuePriority[] = ['urgent', 'high', 'medium', 'low'];

export function PriorityIcon({
  priority,
  size = 14,
  className = '',
}: {
  priority: IssuePriority;
  size?: number;
  className?: string;
}) {
  const { icon: Icon, label, className: color } = PRIORITY_CONFIG[priority];
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
