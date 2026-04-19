'use client';

import { graphql, useMutation } from 'react-relay';
import { ConnectionHandler, type RecordSourceSelectorProxy } from 'relay-runtime';
import { toast } from 'sonner';
import { Check, Plus } from 'lucide-react';
import { Dropdown } from './Dropdown';
import type { LabelsPickerAddMutation } from '@/__generated__/LabelsPickerAddMutation.graphql';
import type { LabelsPickerRemoveMutation } from '@/__generated__/LabelsPickerRemoveMutation.graphql';

// Connection key must match @connection(key: ...) in IssueSidebar_issue.
// Updaters below write into that connection on add/remove so the sidebar
// re-renders without needing a full refetch.
const CONNECTION_KEY = 'IssueSidebar_issue__issue_labelsCollection';

const addMutation = graphql`
  mutation LabelsPickerAddMutation($issue_id: Int!, $label_id: Int!) {
    insertIntoissue_labelsCollection(objects: [{ issue_id: $issue_id, label_id: $label_id }]) {
      records {
        nodeId
        issue_id
        label_id
        labels {
          nodeId
          number
          name
          color
        }
      }
    }
  }
`;

const removeMutation = graphql`
  mutation LabelsPickerRemoveMutation($issue_id: Int!, $label_id: Int!) {
    deleteFromissue_labelsCollection(filter: { issue_id: { eq: $issue_id }, label_id: { eq: $label_id } }, atMost: 1) {
      records {
        nodeId
      }
    }
  }
`;

type Label = {
  readonly nodeId: string;
  readonly number: number;
  readonly name: string;
  readonly color: string;
};

function removeEdgeByLabelNumber(store: RecordSourceSelectorProxy, issueNodeId: string, labelNumber: number) {
  const issue = store.get(issueNodeId);
  if (!issue) return;
  const conn = ConnectionHandler.getConnection(issue, CONNECTION_KEY);
  if (!conn) return;
  const edges = conn.getLinkedRecords('edges') ?? [];
  for (const edge of edges) {
    const node = edge.getLinkedRecord('node');
    const lbl = node?.getLinkedRecord('labels');
    if (lbl?.getValue('number') === labelNumber && node) {
      ConnectionHandler.deleteNode(conn, node.getDataID());
      return;
    }
  }
}

export function LabelsPicker({
  issueNodeId,
  issueNumber,
  labels,
  selected,
}: {
  issueNodeId: string;
  issueNumber: number;
  labels: ReadonlyArray<Label>;
  selected: ReadonlyArray<Label>;
}) {
  const [add, adding] = useMutation<LabelsPickerAddMutation>(addMutation);
  const [remove, removing] = useMutation<LabelsPickerRemoveMutation>(removeMutation);
  const busy = adding || removing;
  const selectedNumbers = new Set(selected.map(l => l.number));
  const unselected = labels.filter(l => !selectedNumbers.has(l.number));

  function addLabel(label: Label) {
    if (busy) return;
    add({
      variables: { issue_id: issueNumber, label_id: label.number },
      updater: store => {
        const issue = store.get(issueNodeId);
        if (!issue) return;
        const conn = ConnectionHandler.getConnection(issue, CONNECTION_KEY);
        if (!conn) return;
        const payload = store.getRootField('insertIntoissue_labelsCollection');
        const records = payload?.getLinkedRecords('records') ?? [];
        for (const rec of records) {
          const edge = ConnectionHandler.createEdge(store, conn, rec, 'issue_labelsEdge');
          ConnectionHandler.insertEdgeAfter(conn, edge);
        }
      },
      onError: err => {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        toast.error('Failed to add label', { description: msg });
        console.error('Label add failed:', err);
      },
    });
  }

  function removeLabel(label: Label) {
    if (busy) return;
    remove({
      variables: { issue_id: issueNumber, label_id: label.number },
      optimisticUpdater: store => removeEdgeByLabelNumber(store, issueNodeId, label.number),
      updater: store => removeEdgeByLabelNumber(store, issueNodeId, label.number),
      onError: err => {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        toast.error('Failed to remove label', { description: msg });
        console.error('Label remove failed:', err);
      },
    });
  }

  return (
    <div className="flex flex-wrap gap-1 items-center">
      {selected.map(l => (
        <RemovableLabel key={l.nodeId} label={l} onRemove={() => removeLabel(l)} disabled={busy} />
      ))}
      <Dropdown>
        <Dropdown.Trigger
          disabled={busy}
          aria-label="Add label"
          className="inline-flex items-center gap-1 h-[22px] px-2 rounded-full text-[10.5px] text-text-muted border border-dashed border-border hover:text-text hover:border-text-muted transition-colors disabled:opacity-60 cursor-pointer"
        >
          <Plus className="size-2.5" strokeWidth={2.5} />
          <span>Add label</span>
        </Dropdown.Trigger>

        <Dropdown.Menu align="end" className="min-w-52 w-64 max-w-[calc(100vw-2rem)] max-h-64 overflow-auto">
          {unselected.length === 0 ? (
            <div className="px-2.5 py-1.5 text-sm text-text-muted">
              {labels.length === 0 ? 'No labels available' : 'All labels added'}
            </div>
          ) : (
            unselected.map(l => (
              <Dropdown.Item key={l.nodeId} onClick={() => addLabel(l)}>
                <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: `#${l.color}` }} />
                <span className="flex-1 truncate text-left">{l.name}</span>
              </Dropdown.Item>
            ))
          )}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

function RemovableLabel({ label, onRemove, disabled }: { label: Label; onRemove: () => void; disabled: boolean }) {
  return (
    <Dropdown>
      <Dropdown.Trigger
        disabled={disabled}
        aria-label={`Label: ${label.name}. Click to remove.`}
        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10.5px] bg-bg-inset text-text-secondary hover:bg-bg-hover transition-colors disabled:opacity-60 cursor-pointer max-w-full min-w-0"
      >
        <span className="size-1.5 rounded-full shrink-0" style={{ backgroundColor: `#${label.color}` }} />
        <span className="truncate">{label.name}</span>
      </Dropdown.Trigger>
      <Dropdown.Menu className="min-w-44 w-56 max-w-[calc(100vw-2rem)]">
        <Dropdown.Item onClick={onRemove}>
          <span className="flex-1 truncate text-left">Remove {label.name}</span>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
