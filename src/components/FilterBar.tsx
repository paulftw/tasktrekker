'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Dropdown } from './Dropdown';
import { PriorityIcon, SELECTABLE_PRIORITIES, PRIORITY_CONFIG, SignalHigh } from './PriorityIcon';
import { StatusIcon, SELECTABLE_STATUSES, STATUS_CONFIG } from './StatusIcon';
import { UserAvatar } from './UserAvatar';
import type { IssuePriority, IssueStatus } from '@/types/enums';
import { Tag, X, UserCircle2, Search } from 'lucide-react';
import { forwardRef, useRef, useState } from 'react';

export type Label = {
  nodeId: string;
  number: number;
  name: string;
  color: string;
};

export type User = {
  nodeId: string;
  id: string;
  name: string;
  avatar_url?: string | null;
};

const UNASSIGNED = 'unassigned';
// TODO: Remove this fallback when authentication is implemented and use the real current user's ID.
const ASSIGNED_TO_ME = 'assigned-to-me';

function focusFirstMenuItem(container: HTMLElement | null) {
  const first = container?.querySelector<HTMLElement>('[role="menuitemcheckbox"],[role="menuitem"]');
  if (first) first.focus();
}

function SearchMenuInput({
  inputRef,
  value,
  onChange,
  onClear,
  ariaLabel,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>;
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  ariaLabel: string;
}) {
  return (
    <div className="flex items-center gap-1.5 px-2 py-1.5 -mt-1 mb-1 border-b border-line-muted">
      <Search size={12} className="text-fg-subtle shrink-0" />
      <input
        ref={inputRef}
        type="text"
        aria-label={ariaLabel}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => {
          // Block Radix typeahead on printable keys.
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

const FilterChip = forwardRef<
  HTMLButtonElement,
  {
    label: string;
    icon: React.ReactNode;
    active: boolean;
    placeholder: string;
    onClear: () => void;
  } & React.ComponentPropsWithoutRef<'button'>
>(({ label, icon, active, placeholder, onClear, ...props }, ref) => {
  return (
    <button ref={ref} className={`chip ${active ? 'solid' : ''}`} {...props}>
      <span aria-hidden className="chip-icon">
        {icon}
      </span>
      {active ? label : placeholder}
      {active ? (
        <span
          className="remove"
          onClick={e => {
            e.stopPropagation();
          }}
          onPointerDown={e => {
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

export function FilterBar({ labels, users }: { labels: Label[]; users: User[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedPriority = searchParams.get('priority') as IssuePriority | null;
  const selectedStatuses = new Set(searchParams.getAll('status') as IssueStatus[]);
  const selectedLabels = new Set(searchParams.getAll('label'));
  const selectedAssignees = new Set(searchParams.getAll('assignee'));
  const [labelQuery, setLabelQuery] = useState('');
  const labelInputRef = useRef<HTMLInputElement>(null);
  const [assigneeQuery, setAssigneeQuery] = useState('');
  const assigneeInputRef = useRef<HTMLInputElement>(null);
  const normalizedLabelQuery = labelQuery.trim().toLowerCase();
  const filteredLabels = normalizedLabelQuery
    ? labels.filter(label => label.name.toLowerCase().includes(normalizedLabelQuery))
    : labels;
  const normalizedAssigneeQuery = assigneeQuery.trim().toLowerCase();
  // TODO: Replace this seeded-user fallback with the authenticated user once auth exists.
  const currentUser = users[0] ?? null;
  const filteredUsers = normalizedAssigneeQuery
    ? users.filter(u => u.name.toLowerCase().includes(normalizedAssigneeQuery))
    : users.filter(u => u.id !== currentUser?.id);

  const STATUS_ORDER: IssueStatus[] = ['in_progress', 'todo', 'backlog', 'done', 'cancelled'];

  function togglePriority(priority: IssuePriority) {
    const params = new URLSearchParams(searchParams.toString());
    if (selectedPriority === priority) {
      params.delete('priority');
    } else {
      params.set('priority', priority);
    }
    router.replace(`${pathname}?${params.toString()}`);
  }

  function toggleStatus(status: IssueStatus) {
    const params = new URLSearchParams(searchParams.toString());
    const statuses = params.getAll('status');
    params.delete('status');
    if (statuses.includes(status)) {
      statuses.filter(s => s !== status).forEach(s => params.append('status', s));
    } else {
      statuses.forEach(s => params.append('status', s));
      params.append('status', status);
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

  function toggleAssignee(rawAssigneeId: string) {
    const assigneeId = rawAssigneeId === ASSIGNED_TO_ME ? currentUser?.id : rawAssigneeId;
    if (!assigneeId) return;
    const params = new URLSearchParams(searchParams.toString());
    const current = params.getAll('assignee');
    params.delete('assignee');
    if (current.includes(assigneeId)) {
      current.filter(a => a !== assigneeId).forEach(a => params.append('assignee', a));
    } else {
      current.forEach(a => params.append('assignee', a));
      params.append('assignee', assigneeId);
    }
    router.replace(`${pathname}?${params.toString()}`);
  }

  const priorityLabel = selectedPriority ? PRIORITY_CONFIG[selectedPriority].label : 'Priority';

  const selectedStatusObjects = STATUS_ORDER.filter(s => selectedStatuses.has(s)).map(s => STATUS_CONFIG[s]);
  const statusesLabel =
    selectedStatuses.size > 1 ? `${selectedStatuses.size} statuses` : selectedStatusObjects[0]?.label || 'Status';

  const selectedLabelObjects = Array.from(selectedLabels)
    .map(name => labels.find(l => l.name === name))
    .filter(Boolean);
  const labelsLabel =
    selectedLabels.size > 1 ? `${selectedLabels.size} labels` : selectedLabelObjects[0]?.name || 'Label';

  const selectedAssigneeObjects = Array.from(selectedAssignees)
    .map(id =>
      id === UNASSIGNED ? { nodeId: UNASSIGNED, id: UNASSIGNED, name: 'Unassigned' } : users.find(u => u.id === id),
    )
    .filter((u): u is User => Boolean(u));
  const assigneesLabel =
    selectedAssignees.size > 1 ? `${selectedAssignees.size} assignees` : selectedAssigneeObjects[0]?.name || 'Assignee';

  return (
    <div className="shell-pad py-2 border-b border-line-muted flex items-center gap-2">
      <Dropdown
        onOpenChange={open => {
          if (!open) setAssigneeQuery('');
        }}
      >
        <Dropdown.Trigger asChild>
          <FilterChip
            placeholder="Assignee"
            label={assigneesLabel}
            icon={
              selectedAssigneeObjects.length >= 2 ? (
                <div className="relative w-3.5 h-3 shrink-0">
                  <div className="absolute left-[6px] top-0 z-0">
                    <UserAvatar
                      user={selectedAssigneeObjects[1].id === UNASSIGNED ? null : selectedAssigneeObjects[1]}
                      size={12}
                    />
                  </div>
                  <div
                    className="absolute left-0 top-0 z-10 rounded-full"
                    style={{ backgroundColor: 'color-mix(in srgb, var(--color-surface-inset) 80%, transparent)' }}
                  >
                    <UserAvatar
                      user={selectedAssigneeObjects[0].id === UNASSIGNED ? null : selectedAssigneeObjects[0]}
                      size={12}
                    />
                  </div>
                </div>
              ) : selectedAssigneeObjects.length === 1 ? (
                <UserAvatar
                  user={selectedAssigneeObjects[0].id === UNASSIGNED ? null : selectedAssigneeObjects[0]}
                  size={12}
                />
              ) : (
                <UserCircle2 size={12} className="text-fg-subtle" />
              )
            }
            active={selectedAssignees.size > 0}
            onClear={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.delete('assignee');
              router.replace(`${pathname}?${params.toString()}`);
            }}
          />
        </Dropdown.Trigger>
        <Dropdown.Menu
          align="start"
          className="w-56"
          onOpenAutoFocus={e => {
            e.preventDefault();
            assigneeInputRef.current?.focus();
          }}
        >
          <SearchMenuInput
            inputRef={assigneeInputRef}
            value={assigneeQuery}
            onChange={setAssigneeQuery}
            onClear={() => setAssigneeQuery('')}
            ariaLabel="Search assignees"
          />
          {!normalizedAssigneeQuery && currentUser && (
            <>
              <Dropdown.CheckboxItem
                checked={selectedAssignees.has(currentUser.id)}
                onCheckedChange={() => toggleAssignee(ASSIGNED_TO_ME)}
              >
                <UserAvatar user={currentUser} size={14} />
                <span className="truncate">Assigned to me</span>
              </Dropdown.CheckboxItem>
              <Dropdown.CheckboxItem
                checked={selectedAssignees.has(UNASSIGNED)}
                onCheckedChange={() => toggleAssignee(UNASSIGNED)}
              >
                <UserAvatar user={null} size={14} />
                <span className="truncate">Unassigned</span>
              </Dropdown.CheckboxItem>
              {filteredUsers.length > 0 && <Dropdown.Separator />}
            </>
          )}
          {filteredUsers.map(u => (
            <Dropdown.CheckboxItem
              key={u.nodeId}
              checked={selectedAssignees.has(u.id)}
              onCheckedChange={() => toggleAssignee(u.id)}
            >
              <UserAvatar user={u} size={14} />
              <span className="truncate">{u.name}</span>
            </Dropdown.CheckboxItem>
          ))}
          {normalizedAssigneeQuery && filteredUsers.length === 0 && (
            <div className="px-2.5 py-2 text-[12px] text-fg-subtle">No matches</div>
          )}
        </Dropdown.Menu>
      </Dropdown>

      <div aria-hidden className="w-px h-[18px] bg-border mx-1" />

      <Dropdown>
        <Dropdown.Trigger asChild>
          <FilterChip
            placeholder="Status"
            label={statusesLabel}
            icon={
              selectedStatusObjects.length >= 2 ? (
                (() => {
                  const TopIcon = selectedStatusObjects[0].icon;
                  const bottomStatus = selectedStatusObjects.at(-1)!;
                  const BottomIcon = bottomStatus.icon;
                  return (
                    <div className="relative w-3.5 h-3 shrink-0">
                      <div className="absolute left-[6px] top-0 z-0">
                        <BottomIcon width={12} height={12} className={bottomStatus.className} />
                      </div>
                      <div
                        className="absolute left-0 top-0 z-10 rounded-full"
                        style={{ backgroundColor: 'color-mix(in srgb, var(--color-surface-inset) 80%, transparent)' }}
                      >
                        <TopIcon width={12} height={12} className={selectedStatusObjects[0].className} />
                      </div>
                    </div>
                  );
                })()
              ) : selectedStatusObjects.length === 1 ? (
                <StatusIcon status={STATUS_ORDER.find(s => selectedStatuses.has(s))!} size={12} />
              ) : (
                <StatusIcon status="backlog" size={12} />
              )
            }
            active={selectedStatuses.size > 0}
            onClear={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.delete('status');
              router.replace(`${pathname}?${params.toString()}`);
            }}
          />
        </Dropdown.Trigger>
        <Dropdown.Menu align="start" className="w-48">
          {SELECTABLE_STATUSES.map(s => (
            <Dropdown.CheckboxItem key={s} checked={selectedStatuses.has(s)} onCheckedChange={() => toggleStatus(s)}>
              <StatusIcon status={s} size={14} />
              <span>{STATUS_CONFIG[s].label}</span>
            </Dropdown.CheckboxItem>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      <Dropdown>
        <Dropdown.Trigger asChild>
          <FilterChip
            placeholder="Priority"
            label={priorityLabel}
            icon={
              selectedPriority ? (
                <PriorityIcon priority={selectedPriority} size={12} />
              ) : (
                <SignalHigh width={12} height={12} className="text-fg-subtle" />
              )
            }
            active={!!selectedPriority}
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

      <Dropdown
        onOpenChange={open => {
          if (!open) setLabelQuery('');
        }}
      >
        <Dropdown.Trigger asChild>
          <FilterChip
            placeholder="Labels"
            label={labelsLabel}
            icon={
              selectedLabelObjects.length >= 2 ? (
                <div className="relative w-3 h-2 shrink-0">
                  <span
                    className="absolute left-1 top-0 w-2 h-2 rounded-full"
                    style={{ backgroundColor: `#${selectedLabelObjects[1]!.color}` }}
                  />
                  <span
                    className="absolute left-0 top-0 w-2 h-2 rounded-full z-10 ring-1 ring-bg-inset"
                    style={{ backgroundColor: `#${selectedLabelObjects[0]!.color}` }}
                  />
                </div>
              ) : selectedLabelObjects.length === 1 ? (
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: `#${selectedLabelObjects[0]!.color}` }}
                />
              ) : (
                <Tag size={12} className="text-fg-subtle" />
              )
            }
            active={selectedLabels.size > 0}
            onClear={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.delete('label');
              router.replace(`${pathname}?${params.toString()}`);
            }}
          />
        </Dropdown.Trigger>
        <Dropdown.Menu
          align="start"
          className="w-56"
          onOpenAutoFocus={e => {
            e.preventDefault();
            labelInputRef.current?.focus();
          }}
        >
          <SearchMenuInput
            inputRef={labelInputRef}
            value={labelQuery}
            onChange={setLabelQuery}
            onClear={() => setLabelQuery('')}
            ariaLabel="Search labels"
          />
          {filteredLabels.map(l => (
            <Dropdown.CheckboxItem
              key={l.nodeId}
              checked={selectedLabels.has(l.name)}
              onCheckedChange={() => toggleLabel(l.name)}
            >
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: `#${l.color}` }} />
              <span className="truncate">{l.name}</span>
            </Dropdown.CheckboxItem>
          ))}
          {filteredLabels.length === 0 && <div className="px-2.5 py-2 text-[12px] text-fg-subtle">No matches</div>}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
