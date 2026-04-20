'use client';

import { useState } from 'react';
import { graphql, useMutation } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';
import { toast } from 'sonner';
import { LabelEditorDialog, type EditableLabel } from '@/components/modals/LabelEditorDialog';
import { LabelsField } from '@/components/shared/LabelsField';
import { removeIssueLabelConnectionEdge } from '@/lib/labelStore';
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
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingLabel, setEditingLabel] = useState<EditableLabel | null>(null);
  const busy = adding || removing;

  function addLabel(label: { readonly number: number }) {
    if (busy) return;
    add({
      variables: { issue_id: issueNumber, label_id: label.number },
      updater: store => {
        const issue = store.get(issueNodeId);
        if (!issue) return;
        const connection = ConnectionHandler.getConnection(issue, CONNECTION_KEY);
        if (!connection) return;
        const payload = store.getRootField('insertIntoissue_labelsCollection');
        const records = payload?.getLinkedRecords('records') ?? [];
        for (const record of records) {
          const edge = ConnectionHandler.createEdge(store, connection, record, 'issue_labelsEdge');
          ConnectionHandler.insertEdgeAfter(connection, edge);
        }
      },
      onError: error => {
        const description = error instanceof Error ? error.message : 'Unknown error';
        toast.error('Failed to add label', { description });
        console.error('Label add failed:', error);
      },
    });
  }

  function removeLabel(label: Label) {
    if (busy) return;
    remove({
      variables: { issue_id: issueNumber, label_id: label.number },
      optimisticUpdater: store => removeIssueLabelConnectionEdge(store, issueNodeId, CONNECTION_KEY, label.number),
      updater: store => removeIssueLabelConnectionEdge(store, issueNodeId, CONNECTION_KEY, label.number),
      onError: error => {
        const description = error instanceof Error ? error.message : 'Unknown error';
        toast.error('Failed to remove label', { description });
        console.error('Label remove failed:', error);
      },
    });
  }

  return (
    <>
      <LabelsField
        labels={labels}
        selected={selected}
        onAddLabel={addLabel}
        onRemoveLabel={removeLabel}
        onCreateLabel={() => setCreateDialogOpen(true)}
        onEditLabel={label => setEditingLabel(label)}
        removeMode="confirm"
        disabled={busy}
        menuAlign="end"
      />

      <LabelEditorDialog
        open={createDialogOpen}
        mode="create"
        onClose={() => setCreateDialogOpen(false)}
        onCreated={created => addLabel(created)}
      />

      <LabelEditorDialog
        open={editingLabel !== null}
        mode="edit"
        label={editingLabel}
        issueNodeId={issueNodeId}
        onClose={() => setEditingLabel(null)}
        onDeleted={() => setEditingLabel(null)}
      />
    </>
  );
}
