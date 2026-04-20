'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Trash2, X } from 'lucide-react';
import { graphql, useMutation, useRelayEnvironment } from 'react-relay';
import { toast } from 'sonner';
import { LabelPill } from './LabelPill';
import { removeIssueLabelConnectionEdge, removeRootLabel, upsertRootLabel } from '@/lib/labelStore';
import { labelColorSchema, labelNameSchema } from '@/lib/validation';
import type { LabelEditorDialogCreateMutation } from '@/__generated__/LabelEditorDialogCreateMutation.graphql';
import type { LabelEditorDialogDeleteMutation } from '@/__generated__/LabelEditorDialogDeleteMutation.graphql';
import type { LabelEditorDialogUpdateMutation } from '@/__generated__/LabelEditorDialogUpdateMutation.graphql';

export type EditableLabel = {
  readonly nodeId: string;
  readonly number: number;
  readonly name: string;
  readonly color: string;
};

type LabelEditorDialogProps = {
  open: boolean;
  mode: 'create' | 'edit';
  label?: EditableLabel | null;
  onClose: () => void;
  onCreated?: (label: EditableLabel) => void;
  onDeleted?: (label: EditableLabel) => void;
  issueNodeId?: string;
};

const ISSUE_LABELS_CONNECTION_KEY = 'IssueSidebar_issue__issue_labelsCollection';

const LABEL_COLOR_OPTIONS = [
  { name: 'Coral', value: 'ef4444' },
  { name: 'Orange', value: 'f97316' },
  { name: 'Amber', value: 'f59e0b' },
  { name: 'Gold', value: 'eab308' },
  { name: 'Lime', value: '84cc16' },
  { name: 'Green', value: '22c55e' },
  { name: 'Teal', value: '10b981' },
  { name: 'Mint', value: '14b8a6' },
  { name: 'Cyan', value: '06b6d4' },
  { name: 'Sky', value: '0ea5e9' },
  { name: 'Blue', value: '3b82f6' },
  { name: 'Indigo', value: '6366f1' },
  { name: 'Violet', value: '8b5cf6' },
  { name: 'Pink', value: 'ec4899' },
  { name: 'Rose', value: 'f43f5e' },
  { name: 'Slate', value: '64748b' },
] as const;

const createMutation = graphql`
  mutation LabelEditorDialogCreateMutation($objects: [labelsInsertInput!]!) {
    insertIntolabelsCollection(objects: $objects) {
      records {
        nodeId
        number
        name
        color
      }
    }
  }
`;

const updateMutation = graphql`
  mutation LabelEditorDialogUpdateMutation($number: Int!, $set: labelsUpdateInput!) {
    updatelabelsCollection(filter: { number: { eq: $number } }, set: $set, atMost: 1) {
      records {
        nodeId
        number
        name
        color
      }
    }
  }
`;

const deleteMutation = graphql`
  mutation LabelEditorDialogDeleteMutation($number: Int!) {
    deleteFromlabelsCollection(filter: { number: { eq: $number } }, atMost: 1) {
      records {
        nodeId
        number
      }
    }
  }
`;

const DEFAULT_COLOR = LABEL_COLOR_OPTIONS[6].value;


export function LabelEditorDialog({
  open,
  mode,
  label,
  onClose,
  onCreated,
  onDeleted,
  issueNodeId,
}: LabelEditorDialogProps) {
  if (!open) return null;

  const dialogKey = mode === 'edit' ? `edit:${label?.number ?? 'none'}` : 'create';
  return (
    <LabelEditorDialogInner
      key={dialogKey}
      mode={mode}
      label={label}
      onClose={onClose}
      onCreated={onCreated}
      onDeleted={onDeleted}
      issueNodeId={issueNodeId}
    />
  );
}

function LabelEditorDialogInner({
  mode,
  label,
  onClose,
  onCreated,
  onDeleted,
  issueNodeId,
}: Omit<LabelEditorDialogProps, 'open'>) {
  const environment = useRelayEnvironment();
  const nameRef = useRef<HTMLInputElement>(null);
  const [createLabel, creating] = useMutation<LabelEditorDialogCreateMutation>(createMutation);
  const [updateLabel, updating] = useMutation<LabelEditorDialogUpdateMutation>(updateMutation);
  const [deleteLabel, deleting] = useMutation<LabelEditorDialogDeleteMutation>(deleteMutation);

  const [name, setName] = useState(mode === 'edit' ? label?.name ?? '' : '');
  const [color, setColor] = useState<string>(mode === 'edit' ? label?.color ?? DEFAULT_COLOR : DEFAULT_COLOR);
  const [nameError, setNameError] = useState<string | null>(null);
  const busy = creating || updating || deleting;

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const previewLabel = useMemo(
    () => ({
      name: name.trim() || 'New label',
      color,
    }),
    [color, name],
  );
  function closeDialog() {
    if (!busy) onClose();
  }

  function createLabelRecord(input: { name: string; color: string }) {
    return new Promise<EditableLabel>((resolve, reject) => {
      createLabel({
        variables: { objects: [input] },
        updater: store => {
          const record = store.getRootField('insertIntolabelsCollection')?.getLinkedRecords('records')?.[0];
          if (record) upsertRootLabel(store, record);
        },
        onCompleted: response => {
          const record = response.insertIntolabelsCollection?.records[0];
          if (record) resolve(record);
          else reject(new Error('Label creation returned no label.'));
        },
        onError: reject,
      });
    });
  }

  function updateLabelRecord(number: number, input: { name: string; color: string }) {
    return new Promise<EditableLabel>((resolve, reject) => {
      updateLabel({
        variables: { number, set: input },
        updater: store => {
          const record = store.getRootField('updatelabelsCollection')?.getLinkedRecords('records')?.[0];
          if (record) upsertRootLabel(store, record);
        },
        onCompleted: response => {
          const record = response.updatelabelsCollection?.records[0];
          if (record) resolve(record);
          else reject(new Error('Label update returned no label.'));
        },
        onError: reject,
      });
    });
  }

  function deleteLabelRecord(currentLabel: EditableLabel) {
    return new Promise<void>((resolve, reject) => {
      deleteLabel({
        variables: { number: currentLabel.number },
        updater: store => {
          removeRootLabel(store, currentLabel.number);
          if (issueNodeId) {
            removeIssueLabelConnectionEdge(store, issueNodeId, ISSUE_LABELS_CONNECTION_KEY, currentLabel.number);
          }
          store.delete(currentLabel.nodeId);
        },
        onCompleted: () => resolve(),
        onError: reject,
      });
    });
  }

  async function submit() {
    if (busy) return;

    const parsedName = labelNameSchema.safeParse(name);
    const parsedColor = labelColorSchema.safeParse(color);

    setNameError(parsedName.success ? null : (parsedName.error.issues[0]?.message ?? 'Label name is required'));
    if (!parsedName.success || !parsedColor.success) return;

    try {
      if (mode === 'create') {
        const created = await createLabelRecord({ name: parsedName.data, color: parsedColor.data });
        (environment.getStore() as { invalidateStore?: () => void }).invalidateStore?.();
        onCreated?.(created);
      } else if (label) {
        await updateLabelRecord(label.number, { name: parsedName.data, color: parsedColor.data });
        (environment.getStore() as { invalidateStore?: () => void }).invalidateStore?.();
      }
      onClose();
    } catch (error) {
      const description = error instanceof Error ? error.message : 'Unknown error';
      toast.error(mode === 'create' ? 'Failed to create label' : 'Failed to save label', { description });
      console.error(mode === 'create' ? 'Label create failed:' : 'Label update failed:', error);
    }
  }

  async function handleDelete() {
    if (mode !== 'edit' || !label || busy) return;

    try {
      await deleteLabelRecord(label);
      (environment.getStore() as { invalidateStore?: () => void }).invalidateStore?.();
      onDeleted?.(label);
      onClose();
    } catch (error) {
      const description = error instanceof Error ? error.message : 'Unknown error';
      toast.error('Failed to delete label', { description });
      console.error('Label delete failed:', error);
    }
  }


  return (
    <div
      className="modal-overlay label-modal-overlay"
      onMouseDown={event => {
        if (event.target === event.currentTarget && !busy) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="label-editor-title"
        className="modal label-modal"
        onKeyDown={event => {
          if (event.defaultPrevented) return;
          if (event.key === 'Escape') {
            event.preventDefault();
            event.stopPropagation();
            closeDialog();
            return;
          }
          if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();
            void submit();
          }
        }}
      >
        <div className="modal-head">
          <span id="label-editor-title">{mode === 'create' ? 'Create new label' : 'Edit label'}</span>
          <button
            type="button"
            onClick={closeDialog}
            disabled={busy}
            aria-label="Close"
            className="ml-auto inline-flex size-[22px] items-center justify-center rounded-[6px] text-fg-subtle transition-colors hover:bg-surface-hover hover:text-fg disabled:opacity-50"
          >
            <X size={12} />
          </button>
        </div>

        <div className="modal-body label-modal-body">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="label-name" className="label-field-label">
                Name
              </label>
              <input
                ref={nameRef}
                id="label-name"
                type="text"
                value={name}
                onChange={event => {
                  setName(event.target.value);
                  if (nameError) setNameError(null);
                }}
                disabled={busy}
                placeholder="Label name"
                aria-invalid={nameError !== null}
                className="label-name-input"
              />
              {nameError && (
                <p role="alert" className="text-[12px] text-status-cancelled">
                  {nameError}
                </p>
              )}
            </div>

            <div className="space-y-2.5">
              <div className="label-field-label">Color</div>
              <div className="label-color-grid">
                {LABEL_COLOR_OPTIONS.map(option => {
                  const selected = option.value === color;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      aria-label={`Color ${option.name}`}
                      aria-pressed={selected}
                      onClick={() => setColor(option.value)}
                      disabled={busy}
                      className={`label-color-swatch ${selected ? 'is-selected' : ''}`}
                    >
                      <span className="label-color-dot flex items-center justify-center" style={{ backgroundColor: `#${option.value}` }}>
                        {selected && <Check className="size-[11px] text-white" strokeWidth={3} />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="label-preview-card">
              <div className="label-field-label">Preview</div>
              <LabelPill label={previewLabel} />
            </div>

            {mode === 'edit' && (
              <p className="text-[12px] leading-5 text-fg-muted">
                Deleting it removes the label from every issue.
              </p>
            )}
          </div>
        </div>

        <div className="modal-foot">
          {mode === 'edit' ? (
            <button
              type="button"
              onClick={() => {
                void handleDelete();
              }}
              disabled={busy}
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-transparent px-3 text-[12px] font-medium text-status-cancelled transition-colors hover:bg-surface-hover disabled:opacity-50"
            >
              <Trash2 className="size-3.5" strokeWidth={2} />
              Delete label
            </button>
          ) : (
            <span className="hint" />
          )}
          <button
            type="button"
            onClick={closeDialog}
            disabled={busy}
            className="ml-auto inline-flex h-8 items-center rounded-md border border-line bg-transparent px-3 text-[12px] font-medium text-fg transition-colors hover:bg-surface-hover disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              void submit();
            }}
            disabled={!name.trim() || busy}
            className="inline-flex h-8 items-center rounded-md border border-transparent px-3 text-[12px] font-medium text-white transition-all disabled:cursor-not-allowed disabled:opacity-50"
            style={{ background: 'var(--color-accent)' }}
          >
            {busy ? (mode === 'create' ? 'Creating…' : 'Saving…') : mode === 'create' ? 'Create label' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
