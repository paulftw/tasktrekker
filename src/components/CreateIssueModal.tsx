'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { graphql, useMutation, useRelayEnvironment } from 'react-relay';
import { Search, X } from 'lucide-react';
import { toast } from 'sonner';
import { Dropdown } from './Dropdown';
import { LabelEditorDialog } from './LabelEditorDialog';
import { LabelsField } from './LabelsField';
import { PriorityIcon, PRIORITY_CONFIG, SELECTABLE_PRIORITIES } from './PriorityIcon';
import { ShortcutTextarea } from './ShortcutTextarea';
import { StatusIcon, STATUS_CONFIG, SELECTABLE_STATUSES } from './StatusIcon';
import { UserAvatar } from './UserAvatar';
import { issueDescriptionSchema, issueTitleSchema } from '@/lib/validation';
import { usePlatformEditorHint } from '@/lib/usePlatformEditorHint';
import type { IssuePriority, IssueStatus } from '@/types/enums';
import type { CreateIssueModalAddLabelsMutation } from '@/__generated__/CreateIssueModalAddLabelsMutation.graphql';
import type { CreateIssueModalCreateMutation } from '@/__generated__/CreateIssueModalCreateMutation.graphql';

type User = {
  readonly nodeId: string;
  readonly id: string;
  readonly name: string;
  readonly avatar_url?: string | null;
};

type Label = {
  readonly nodeId: string;
  readonly number: number;
  readonly name: string;
  readonly color: string;
};

const createIssueMutation = graphql`
  mutation CreateIssueModalCreateMutation($objects: [issuesInsertInput!]!) {
    insertIntoissuesCollection(objects: $objects) {
      records {
        nodeId
        number
      }
    }
  }
`;

const addLabelsMutation = graphql`
  mutation CreateIssueModalAddLabelsMutation($objects: [issue_labelsInsertInput!]!) {
    insertIntoissue_labelsCollection(objects: $objects) {
      affectedCount
    }
  }
`;

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
    <div className="flex items-center gap-1.5 px-2 py-1.5 -mt-1 mb-1 border-b border-border-muted">
      <Search size={12} className="text-text-muted shrink-0" />
      <input
        ref={inputRef}
        type="text"
        aria-label={ariaLabel}
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
        className="flex-1 bg-transparent border-0 outline-none text-[12.5px] text-text placeholder:text-text-muted min-w-0"
      />
    </div>
  );
}

export function CreateIssueModal({
  open,
  onClose,
  users,
  labels,
  initialStatus = 'todo',
}: {
  open: boolean;
  onClose: () => void;
  users: ReadonlyArray<User>;
  labels: ReadonlyArray<Label>;
  initialStatus?: IssueStatus;
}) {
  const router = useRouter();
  const environment = useRelayEnvironment();
  const editorHint = usePlatformEditorHint('create');
  const titleRef = useRef<HTMLInputElement>(null);
  const assigneeInputRef = useRef<HTMLInputElement>(null);
  const [createIssue] = useMutation<CreateIssueModalCreateMutation>(createIssueMutation);
  const [addLabels] = useMutation<CreateIssueModalAddLabelsMutation>(addLabelsMutation);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<IssueStatus>(initialStatus);
  const [priority, setPriority] = useState<IssuePriority>('medium');
  const [assigneeId, setAssigneeId] = useState<string | null>(null);
  const [selectedLabelNumbers, setSelectedLabelNumbers] = useState<number[]>([]);
  const [labelDialogOpen, setLabelDialogOpen] = useState(false);
  const [assigneeQuery, setAssigneeQuery] = useState('');
  const [titleError, setTitleError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setTitle('');
    setDescription('');
    setStatus(initialStatus);
    setPriority('medium');
    setAssigneeId(null);
    setSelectedLabelNumbers([]);
    setLabelDialogOpen(false);
    setAssigneeQuery('');
    setTitleError(null);
    setDescriptionError(null);
    titleRef.current?.focus();
  }, [open, initialStatus]);

  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  const selectedAssignee = users.find(user => user.id === assigneeId) ?? null;
  const selectedLabels = useMemo(
    () => labels.filter(label => selectedLabelNumbers.includes(label.number)),
    [labels, selectedLabelNumbers],
  );

  const normalizedAssigneeQuery = assigneeQuery.trim().toLowerCase();
  const filteredUsers = normalizedAssigneeQuery
    ? users.filter(user => user.name.toLowerCase().includes(normalizedAssigneeQuery))
    : users;

  if (!open) return null;

  function addLabel(labelNumber: number) {
    setSelectedLabelNumbers(current => (current.includes(labelNumber) ? current : [...current, labelNumber]));
  }

  function removeLabel(labelNumber: number) {
    setSelectedLabelNumbers(current => current.filter(number => number !== labelNumber));
  }

  function createIssueRecord(input: {
    title: string;
    description: string;
    status: IssueStatus;
    priority: IssuePriority;
    assignee_id: string | null;
  }) {
    return new Promise<number>((resolve, reject) => {
      createIssue({
        variables: {
          objects: [input],
        },
        onCompleted: response => {
          const number = response.insertIntoissuesCollection?.records[0]?.number;
          if (typeof number === 'number') resolve(number);
          else reject(new Error('Issue creation returned no issue number.'));
        },
        onError: reject,
      });
    });
  }

  function addIssueLabels(issueNumber: number) {
    return new Promise<void>((resolve, reject) => {
      addLabels({
        variables: {
          objects: selectedLabelNumbers.map(labelNumber => ({
            issue_id: issueNumber,
            label_id: labelNumber,
          })),
        },
        onCompleted: () => resolve(),
        onError: reject,
      });
    });
  }

  async function submit() {
    if (isSubmitting) return;

    const parsedTitle = issueTitleSchema.safeParse(title);
    const parsedDescription = issueDescriptionSchema.safeParse(description);

    setTitleError(parsedTitle.success ? null : (parsedTitle.error.issues[0]?.message ?? 'Invalid title'));
    setDescriptionError(
      parsedDescription.success ? null : (parsedDescription.error.issues[0]?.message ?? 'Invalid description'),
    );

    if (!parsedTitle.success || !parsedDescription.success) return;

    setIsSubmitting(true);

    try {
      const issueNumber = await createIssueRecord({
        title: parsedTitle.data,
        description: parsedDescription.data,
        status,
        priority,
        assignee_id: assigneeId,
      });
      if (selectedLabelNumbers.length > 0) {
        try {
          await addIssueLabels(issueNumber);
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Unknown error';
          toast.error('Issue created, but labels failed to save', { description: msg });
          console.error('Issue label insert failed:', err);
        }
      }

      const store = environment.getStore() as { invalidateStore?: () => void };
      store.invalidateStore?.();
      onClose();
      router.push(`/issues/${issueNumber}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      toast.error('Failed to create issue', { description: msg });
      console.error('Issue create failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="modal-overlay"
      onMouseDown={event => {
        if (event.target === event.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-issue-title"
        className="modal"
        onKeyDown={event => {
          if (event.defaultPrevented) return;
          if (event.key === 'Escape') {
            event.preventDefault();
            if (!isSubmitting) onClose();
            return;
          }
          if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
            event.preventDefault();
            void submit();
          }
        }}
      >
        <div className="modal-head">
          <span id="create-issue-title">New issue</span>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close"
            className="ml-auto inline-flex size-[22px] items-center justify-center rounded-[6px] text-text-muted transition-colors hover:bg-bg-hover hover:text-text disabled:opacity-50"
          >
            <X size={12} />
          </button>
        </div>

        <div className="modal-body">
          <input
            ref={titleRef}
            type="text"
            value={title}
            onChange={event => {
              setTitle(event.target.value);
              if (titleError) setTitleError(null);
            }}
            disabled={isSubmitting}
            placeholder="Issue title"
            aria-label="Issue title"
            aria-invalid={titleError !== null}
            className="title"
          />
          <ShortcutTextarea
            value={description}
            onChange={event => {
              setDescription(event.target.value);
              if (descriptionError) setDescriptionError(null);
            }}
            onSubmitShortcut={() => {
              void submit();
            }}
            onCancelShortcut={() => {
              if (!isSubmitting) onClose();
            }}
            disabled={isSubmitting}
            placeholder="Add description…"
            aria-label="Issue description"
            aria-invalid={descriptionError !== null}
            className="desc"
            rows={2}
            autoGrow
          />
          {(titleError || descriptionError) && (
            <div className="mt-2 space-y-1">
              {titleError && (
                <p role="alert" className="text-[12px] text-status-cancelled">
                  {titleError}
                </p>
              )}
              {descriptionError && (
                <p role="alert" className="text-[12px] text-status-cancelled">
                  {descriptionError}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="modal-chips">
          <Dropdown>
            <Dropdown.Trigger asChild>
              <button type="button" className="chip solid" disabled={isSubmitting}>
                <span className="chip-icon">
                  <StatusIcon status={status} size={12} />
                </span>
                <span>{STATUS_CONFIG[status].label}</span>
              </button>
            </Dropdown.Trigger>
            <Dropdown.Menu className="min-w-44">
              {SELECTABLE_STATUSES.map(value => (
                <Dropdown.Item key={value} onClick={() => setStatus(value)}>
                  <StatusIcon status={value} size={14} />
                  <span>{STATUS_CONFIG[value].label}</span>
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown>
            <Dropdown.Trigger asChild>
              <button type="button" className="chip solid" disabled={isSubmitting}>
                <span className="chip-icon">
                  <PriorityIcon priority={priority} size={12} />
                </span>
                <span>{PRIORITY_CONFIG[priority].label}</span>
              </button>
            </Dropdown.Trigger>
            <Dropdown.Menu className="min-w-44">
              {SELECTABLE_PRIORITIES.map(value => (
                <Dropdown.Item key={value} onClick={() => setPriority(value)}>
                  <PriorityIcon priority={value} size={14} />
                  <span>{PRIORITY_CONFIG[value].label}</span>
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown
            onOpenChange={nextOpen => {
              if (!nextOpen) setAssigneeQuery('');
            }}
          >
            <Dropdown.Trigger asChild>
              <button type="button" className="chip solid" disabled={isSubmitting}>
                <span className="chip-icon">
                  <UserAvatar user={selectedAssignee} size={14} />
                </span>
                <span>{selectedAssignee ? selectedAssignee.name : 'Unassigned'}</span>
              </button>
            </Dropdown.Trigger>
            <Dropdown.Menu
              className="w-56"
              onOpenAutoFocus={event => {
                event.preventDefault();
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
              <Dropdown.Item onClick={() => setAssigneeId(null)} className={assigneeId === null ? 'font-medium' : ''}>
                <UserAvatar user={null} size={18} />
                <span>Unassigned</span>
              </Dropdown.Item>
              {filteredUsers.map(user => (
                <Dropdown.Item
                  key={user.nodeId}
                  onClick={() => setAssigneeId(user.id)}
                  className={user.id === assigneeId ? 'font-medium' : ''}
                >
                  <UserAvatar user={user} size={18} />
                  <span className="truncate">{user.name}</span>
                </Dropdown.Item>
              ))}
              {filteredUsers.length === 0 && <div className="px-2.5 py-2 text-[12px] text-text-muted">No matches</div>}
            </Dropdown.Menu>
          </Dropdown>

          <LabelsField
            labels={labels}
            selected={selectedLabels}
            onAddLabel={label => addLabel(label.number)}
            onRemoveLabel={label => removeLabel(label.number)}
            onCreateLabel={() => setLabelDialogOpen(true)}
            removeMode="instant"
            disabled={isSubmitting}
          />
        </div>

        <div className="modal-foot">
          <span className="hint">{editorHint}</span>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="inline-flex h-8 items-center rounded-md border border-border bg-transparent px-3 text-[12px] font-medium text-text transition-colors hover:bg-bg-hover disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              void submit();
            }}
            disabled={!title.trim() || isSubmitting}
            className="inline-flex h-8 items-center rounded-md border border-transparent px-3 text-[12px] font-medium text-white transition-all disabled:cursor-not-allowed disabled:opacity-50"
            style={{ background: 'var(--color-accent)' }}
          >
            {isSubmitting ? 'Creating…' : 'Create issue'}
          </button>
        </div>
      </div>

      <LabelEditorDialog
        open={labelDialogOpen}
        mode="create"
        onClose={() => setLabelDialogOpen(false)}
        onCreated={label => addLabel(label.number)}
      />
    </div>
  );
}
