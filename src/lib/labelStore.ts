import { ConnectionHandler, type RecordProxy, type RecordSourceSelectorProxy } from 'relay-runtime';

const ROOT_LABEL_COLLECTION_ARGS = [
  { first: 100, orderBy: [{ name: 'AscNullsLast' }] },
  { orderBy: [{ name: 'AscNullsLast' }] },
] as const;

function getRootLabelConnections(store: RecordSourceSelectorProxy) {
  const root = store.getRoot();
  return ROOT_LABEL_COLLECTION_ARGS.flatMap(args => {
    const connection = root.getLinkedRecord('labelsCollection', args);
    return connection ? [connection] : [];
  });
}

function createLabelEdge(
  store: RecordSourceSelectorProxy,
  connection: RecordProxy,
  labelRecord: RecordProxy,
): RecordProxy {
  const edgeId = `client:${connection.getDataID()}:label-edge:${labelRecord.getDataID()}`;
  const existingEdge = store.get(edgeId);
  if (existingEdge) {
    existingEdge.setLinkedRecord(labelRecord, 'node');
    return existingEdge;
  }

  const edge = store.create(edgeId, 'labelsEdge');
  edge.setLinkedRecord(labelRecord, 'node');
  edge.setValue(`cursor:${labelRecord.getDataID()}`, 'cursor');
  return edge;
}

function sortLabelEdges(edges: ReadonlyArray<RecordProxy>) {
  return [...edges].sort((left, right) => {
    const leftName = (left.getLinkedRecord('node')?.getValue('name') as string | null | undefined) ?? '';
    const rightName = (right.getLinkedRecord('node')?.getValue('name') as string | null | undefined) ?? '';
    return leftName.localeCompare(rightName, undefined, { sensitivity: 'base' });
  });
}

export function upsertRootLabel(store: RecordSourceSelectorProxy, labelRecord: RecordProxy) {
  for (const connection of getRootLabelConnections(store)) {
    const edges = connection.getLinkedRecords('edges') ?? [];
    const nextEdges = edges.filter(edge => edge.getLinkedRecord('node')?.getDataID() !== labelRecord.getDataID());
    nextEdges.push(createLabelEdge(store, connection, labelRecord));
    connection.setLinkedRecords(sortLabelEdges(nextEdges), 'edges');
  }
}

export function removeRootLabel(store: RecordSourceSelectorProxy, labelNumber: number) {
  for (const connection of getRootLabelConnections(store)) {
    const edges = connection.getLinkedRecords('edges') ?? [];
    connection.setLinkedRecords(
      edges.filter(edge => edge.getLinkedRecord('node')?.getValue('number') !== labelNumber),
      'edges',
    );
  }
}

export function removeIssueLabelConnectionEdge(
  store: RecordSourceSelectorProxy,
  issueNodeId: string,
  connectionKey: string,
  labelNumber: number,
) {
  const issue = store.get(issueNodeId);
  if (!issue) return;
  const connection = ConnectionHandler.getConnection(issue, connectionKey);
  if (!connection) return;
  const edges = connection.getLinkedRecords('edges') ?? [];

  for (const edge of edges) {
    const node = edge.getLinkedRecord('node');
    const label = node?.getLinkedRecord('labels');
    if (label?.getValue('number') === labelNumber && node) {
      ConnectionHandler.deleteNode(connection, node.getDataID());
      return;
    }
  }
}
