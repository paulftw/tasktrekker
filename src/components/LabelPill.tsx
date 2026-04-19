type LabelLike = { name: string; color: string };

const SIZE_CLASSES = {
  sm: 'px-2 py-0.5 text-[10.5px] gap-1.5',
  xs: 'px-1.5 py-px text-[10px] gap-1',
} as const;

export function LabelPill({
  label,
  size = 'sm',
  className = '',
}: {
  label: LabelLike;
  size?: keyof typeof SIZE_CLASSES;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-bg-inset text-text-secondary max-w-full min-w-0 ${SIZE_CLASSES[size]} ${className}`}
    >
      <span className="size-1.5 rounded-full shrink-0" style={{ backgroundColor: `#${label.color}` }} />
      <span className="truncate">{label.name}</span>
    </span>
  );
}
