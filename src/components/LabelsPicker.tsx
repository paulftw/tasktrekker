'use client';

import { graphql, useMutation } from 'react-relay';
import { ConnectionHandler, type RecordSourceSelectorProxy } from 'relay-runtime';
import { toast } from 'sonner';
import { LabelsField } from './LabelsField';
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
    <LabelsField
      labels={labels}
      selected={selected}
      onAddLabel={addLabel}
      onRemoveLabel={removeLabel}
      removeMode="confirm"
      disabled={busy}
      menuAlign="end"
    />
  );
}
