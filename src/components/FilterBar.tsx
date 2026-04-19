'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Dropdown } from './Dropdown';
import { PriorityIcon, SELECTABLE_PRIORITIES, PRIORITY_CONFIG, SignalHigh } from './PriorityIcon';
import type { IssuePriority } from '@/types/enums';
import { Tag, X } from 'lucide-react';
import { forwardRef } from 'react';

export type Label = {
  nodeId: string;
  number: number;
  name: string;
  color: string;
};

const FilterChip = forwardRef<
  HTMLButtonElement,
  {
    label: string;
    icon: React.ReactNode;
    value: boolean;
    placeholder: string;
    onClear: () => void;
  } & React.ComponentPropsWithoutRef<'button'>
>(({ label, icon, value, placeholder, onClear, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={`chip ${value ? 'solid' : ''}`}
      {...props}
    >
      {icon}
      {value ? label : placeholder}
      {value ? (
        <span
          className="remove"
          onClick={(e) => {
            e.stopPropagation();
          }}
          onPointerDown={(e) => {
            e.stopPropagation();
            onClear();
          }}
        >
          <X size={10} />
        </span>
      ) : (
        <span className="plus">+</span>
      )}
    </button>
  );
});
FilterChip.displayName = 'FilterChip';

export function FilterBar({ labels }: { labels: Label[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedPriority = searchParams.get('priority') as IssuePriority | null;
  const selectedLabels = new Set(searchParams.getAll('label'));

  function togglePriority(priority: IssuePriority) {
    const params = new URLSearchParams(searchParams.toString());
    if (selectedPriority === priority) {
      params.delete('priority');
    } else {
      params.set('priority', priority);
    }
    router.replace(`${pathname}?${params.toString()}`);
  }

  function toggleLabel(labelName: string) {
    const params = new URLSearchParams(searchParams.toString());
    const labels = params.getAll('label');
    params.delete('label');
    if (labels.includes(labelName)) {
      labels.filter(l => l !== labelName).forEach(l => params.append('label', l));
    } else {
      labels.forEach(l => params.append('label', l));
      params.append('label', labelName);
    }
    router.replace(`${pathname}?${params.toString()}`);
  }

  const priorityLabel = selectedPriority ? PRIORITY_CONFIG[selectedPriority].label : 'Priority';
  const selectedLabelObjects = Array.from(selectedLabels).map(name => labels.find(l => l.name === name)).filter(Boolean);
  const labelsLabel = selectedLabels.size > 1 ? `${selectedLabels.size} labels` : (selectedLabelObjects[0]?.name || 'Label');

  return (
    <div className="shell-pad py-3 border-b border-border-muted flex items-center gap-2">
      <Dropdown>
        <Dropdown.Trigger asChild>
          <FilterChip
            placeholder="Priority"
            label={priorityLabel}
            icon={
              selectedPriority ? (
                <PriorityIcon priority={selectedPriority} size={12} className="-translate-y-px" />
              ) : (
                <SignalHigh width={12} height={12} className="text-text-muted -translate-y-px" />
              )
            }
            value={!!selectedPriority}
            onClear={() => selectedPriority && togglePriority(selectedPriority)}
          />
        </Dropdown.Trigger>
        <Dropdown.Menu align="start" className="w-48">
          {SELECTABLE_PRIORITIES.map(p => (
            <Dropdown.CheckboxItem
              key={p}
              checked={selectedPriority === p}
              onCheckedChange={() => togglePriority(p)}
              closeOnSelect
            >
              <PriorityIcon priority={p} size={14} />
              <span>{PRIORITY_CONFIG[p].label}</span>
            </Dropdown.CheckboxItem>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      <Dropdown>
        <Dropdown.Trigger asChild>
          <FilterChip
            placeholder="Labels"
            label={labelsLabel}
            icon={
              selectedLabelObjects.length >= 2 ? (
                <div className="relative w-3 h-2 shrink-0">
                  <span className="absolute left-1 top-0 w-2 h-2 rounded-full" style={{ backgroundColor: `#${selectedLabelObjects[1]!.color}` }} />
                  <span className="absolute left-0 top-0 w-2 h-2 rounded-full z-10 ring-1 ring-bg-inset" style={{ backgroundColor: `#${selectedLabelObjects[0]!.color}` }} />
                </div>
              ) : selectedLabelObjects.length === 1 ? (
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: `#${selectedLabelObjects[0]!.color}` }} />
              ) : (
                <Tag size={12} className="text-text-muted" />
              )
            }
            value={selectedLabels.size > 0}
            onClear={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.delete('label');
              router.replace(`${pathname}?${params.toString()}`);
            }}
          />
        </Dropdown.Trigger>
        <Dropdown.Menu align="start" className="w-48">
          {labels.map(l => (
            <Dropdown.CheckboxItem
              key={l.nodeId}
              checked={selectedLabels.has(l.name)}
              onCheckedChange={() => toggleLabel(l.name)}
            >
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: `#${l.color}` }} />
              <span className="truncate">{l.name}</span>
            </Dropdown.CheckboxItem>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
