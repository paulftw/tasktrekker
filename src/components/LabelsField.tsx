'use client';

import { useMemo, useRef, useState } from 'react';
import { Pencil, Plus, Search, X } from 'lucide-react';
import { Dropdown } from './Dropdown';
import { LabelPill } from './LabelPill';

type Label = {
  readonly nodeId: string;
  readonly number: number;
  readonly name: string;
  readonly color: string;
};

function focusFirstMenuItem(container: HTMLElement | null) {
  const first = container?.querySelector<HTMLElement>('[role="menuitemcheckbox"],[role="menuitem"]');
  if (first) first.focus();
}

function SearchMenuInput({
  inputRef,
  value,
  onChange,
  onClear,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>;
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}) {
  return (
    <div className="flex items-center gap-1.5 px-2 py-1.5 -mt-1 mb-1 border-b border-line-muted">
      <Search size={12} className="text-fg-subtle shrink-0" />
      <input
        ref={inputRef}
        type="text"
        aria-label="Search labels"
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => {
          if (e.key.length === 1 || e.key === 'Backspace') e.stopPropagation();
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            focusFirstMenuItem(e.currentTarget.closest('[role="menu"]'));
          }
          if (e.key === 'Escape' && value) {
            e.preventDefault();
            e.stopPropagation();
            onClear();
          }
        }}
        placeholder="Search…"
        className="flex-1 bg-transparent border-0 outline-none text-[12.5px] text-fg placeholder:text-fg-subtle min-w-0"
      />
    </div>
  );
}

// TODO: multiple components in this file, review. LabelsField name could be better.
export function LabelsField({
  labels,
  selected,
  onAddLabel,
  onRemoveLabel,
  onCreateLabel,
  onEditLabel,
  removeMode,
  disabled = false,
  menuAlign = 'start',
}: {
  labels: ReadonlyArray<Label>;
  selected: ReadonlyArray<Label>;
  onAddLabel: (label: Label) => void;
  onRemoveLabel: (label: Label) => void;
  onCreateLabel?: () => void;
  onEditLabel?: (label: Label) => void;
  removeMode: 'instant' | 'confirm';
  disabled?: boolean;
  menuAlign?: 'start' | 'end';
}) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const selectedNumbers = useMemo(() => new Set(selected.map(label => label.number)), [selected]);
  const unselected = useMemo(
    () => labels.filter(label => !selectedNumbers.has(label.number)),
    [labels, selectedNumbers],
  );

  const normalizedQuery = query.trim().toLowerCase();
  const filteredLabels = normalizedQuery
    ? unselected.filter(label => label.name.toLowerCase().includes(normalizedQuery))
    : unselected;

  const emptyMessage =
    unselected.length === 0 ? (labels.length === 0 ? 'No labels available' : 'All labels added') : 'No matches';

  return (
    <div className="flex flex-wrap gap-1 items-center">
      {selected.map(label => (
        <SelectedLabel
          key={label.nodeId}
          label={label}
          onRemove={() => onRemoveLabel(label)}
          onEditLabel={onEditLabel}
          removeMode={removeMode}
          disabled={disabled}
        />
      ))}

      <Dropdown
        onOpenChange={open => {
          if (!open) setQuery('');
        }}
      >
        <Dropdown.Trigger
          disabled={disabled}
          aria-label="Add label"
          className="inline-flex items-center gap-1 h-[22px] px-2 rounded-full text-[10.5px] text-fg-subtle border border-dashed border-line hover:text-fg hover:border-fg-subtle transition-colors disabled:opacity-60 cursor-pointer"
        >
          <Plus className="size-2.5" strokeWidth={2.5} />
          <span>Add label</span>
        </Dropdown.Trigger>

        <Dropdown.Menu
          align={menuAlign}
          className="min-w-52 w-64 max-w-[calc(100vw-2rem)] max-h-64 overflow-hidden flex flex-col"
          onOpenAutoFocus={event => {
            event.preventDefault();
            inputRef.current?.focus();
          }}
        >
          {unselected.length > 0 && (
            <SearchMenuInput inputRef={inputRef} value={query} onChange={setQuery} onClear={() => setQuery('')} />
          )}

          {filteredLabels.length === 0 && normalizedQuery !== '' && (
            <div className="px-2.5 py-2 text-[12px] text-fg-subtle shrink-0">No matches</div>
          )}

          {onCreateLabel && (
            <div className="shrink-0">
              <Dropdown.Item onClick={onCreateLabel}>
                <Plus className="size-3.5 text-fg-subtle" strokeWidth={2} />
                <span>Create new label</span>
              </Dropdown.Item>
              {filteredLabels.length > 0 && <Dropdown.Separator />}
            </div>
          )}

          <div className="overflow-y-auto min-h-0">
            {filteredLabels.length > 0 ? (
              filteredLabels.map(label => (
                <Dropdown.Item key={label.nodeId} onClick={() => onAddLabel(label)}>
                  <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: `#${label.color}` }} />
                  <span className="flex-1 truncate text-left">{label.name}</span>
                </Dropdown.Item>
              ))
            ) : (
              normalizedQuery === '' &&
              !onCreateLabel && <div className="px-2.5 py-2 text-[12px] text-fg-subtle">{emptyMessage}</div>
            )}
          </div>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

// TODO: rename this component to something more descriptive.
function SelectedLabel({
  label,
  onRemove,
  onEditLabel,
  removeMode,
  disabled,
}: {
  label: Label;
  onRemove: () => void;
  onEditLabel?: (label: Label) => void;
  removeMode: 'instant' | 'confirm';
  disabled: boolean;
}) {
  if (removeMode === 'instant') {
    return (
      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        title={`Click to remove label ${label.name}`}
        aria-label={`Remove label ${label.name}`}
        className="group border-0 bg-transparent p-0 appearance-none cursor-pointer disabled:cursor-default disabled:opacity-60"
      >
        <LabelPill label={label} action="remove" />
      </button>
    );
  }

  return (
    <Dropdown>
      <Dropdown.Trigger asChild disabled={disabled}>
        <button
          type="button"
          aria-label={`Label: ${label.name}. Click for options.`}
          className="group max-w-full min-w-0 border-0 bg-transparent p-0 appearance-none cursor-pointer disabled:cursor-default disabled:opacity-60"
        >
          <LabelPill label={label} action="menu" />
        </button>
      </Dropdown.Trigger>
      <Dropdown.Menu className="min-w-44 w-56 max-w-[calc(100vw-2rem)]">
        {onEditLabel && (
          <Dropdown.Item onClick={() => onEditLabel(label)}>
            <Pencil className="size-3.5 text-fg-subtle" strokeWidth={2.2} />
            <span>Edit label</span>
          </Dropdown.Item>
        )}
        <Dropdown.Item
          onClick={onRemove}
          className="data-[highlighted]:!bg-status-cancelled/10"
        >
          <X className="size-3.5 text-status-cancelled opacity-80" strokeWidth={2.2} />
          <span>Remove label</span>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
