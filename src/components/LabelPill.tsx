import { X, MoreVertical } from 'lucide-react';

type LabelLike = { name: string; color: string };

const SIZE_CLASSES = {
  sm: 'px-2 py-1 text-[11px] gap-2',
  xs: 'px-1 text-[10px] gap-1',
} as const;

const ICON_CLASSES = {
  sm: 'size-3',
  xs: 'size-2.5',
} as const;

export type LabelPillAction = 'remove' | 'menu';

export function LabelPill({
  label,
  size = 'sm',
  className = '',
  action,
}: {
  label: LabelLike;
  size?: keyof typeof SIZE_CLASSES;
  className?: string;
  action?: LabelPillAction;
}) {
  const isRemove = action === 'remove';
  const isMenu = action === 'menu';

  const destructiveStyles = isRemove
    ? 'group-hover:bg-status-cancelled/10 group-hover:ring-1 group-hover:ring-inset group-hover:ring-status-cancelled/30 group-hover:text-status-cancelled'
    : '';

  const menuStyles = isMenu
    ? 'group-hover:bg-surface-hover group-hover:text-fg'
    : '';

  const classes = `inline-flex items-center rounded-full bg-surface-inset text-fg-muted max-w-full min-w-0 transition-all duration-200 ${SIZE_CLASSES[size]} ${destructiveStyles} ${menuStyles} ${className}`;

  return (
    <span className={classes}>
      <span className="relative size-1.5 shrink-0">
        <span
          className={`absolute inset-0 rounded-full transition-opacity duration-200 ${
            isRemove ? 'group-hover:opacity-0' : ''
          }`}
          style={{ backgroundColor: `#${label.color}` }}
        />
        {isRemove && (
          <span className="absolute inset-0 rounded-full bg-status-cancelled opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        )}
      </span>
      <span className="truncate">{label.name}</span>
      {isRemove && (
        <X
          aria-hidden
          className={`${ICON_CLASSES[size]} shrink-0 text-fg-subtle transition-all duration-200 group-hover:text-status-cancelled group-hover:scale-125`}
          strokeWidth={2}
        />
      )}
      {isMenu && (
        <MoreVertical
          aria-hidden
          className={`${ICON_CLASSES[size]} shrink-0 text-fg-subtle transition-colors duration-200 group-hover:text-fg`}
          strokeWidth={2}
        />
      )}
    </span>
  );
}
