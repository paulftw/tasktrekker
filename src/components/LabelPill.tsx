import { X } from 'lucide-react';

type LabelLike = { name: string; color: string };

const SIZE_CLASSES = {
  sm: 'px-2 py-0.5 text-[10.5px] gap-1.5',
  xs: 'px-1.5 py-px text-[10px] gap-1',
} as const;

const REMOVE_ICON_CLASSES = {
  sm: 'size-3',
  xs: 'size-2.5',
} as const;

export function LabelPill({
  label,
  size = 'sm',
  className = '',
  onRemove,
  disabled = false,
  showRemoveIcon = onRemove !== undefined,
}: {
  label: LabelLike;
  size?: keyof typeof SIZE_CLASSES;
  className?: string;
  onRemove?: () => void;
  disabled?: boolean;
  showRemoveIcon?: boolean;
}) {
  const classes = `inline-flex items-center rounded-full bg-bg-inset text-text-secondary max-w-full min-w-0 ${SIZE_CLASSES[size]} ${className}`;
  const contents = (
    <>
      <span className="size-1.5 rounded-full shrink-0" style={{ backgroundColor: `#${label.color}` }} />
      <span className="truncate">{label.name}</span>
      {showRemoveIcon && (
        <X aria-hidden className={`${REMOVE_ICON_CLASSES[size]} shrink-0 text-text-muted`} strokeWidth={2} />
      )}
    </>
  );

  if (onRemove) {
    return (
      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        aria-label={`Remove label ${label.name}`}
        className={`${classes} border-0 cursor-pointer appearance-none transition-colors hover:bg-bg-hover hover:text-text disabled:cursor-default disabled:opacity-60`}
      >
        {contents}
      </button>
    );
  }

  return (
    <span className={classes}>{contents}</span>
  );
}
