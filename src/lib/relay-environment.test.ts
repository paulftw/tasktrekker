import { createOperationDescriptor, getRequest } from 'relay-runtime';
import { describe, expect, it } from 'vitest';
import StatusPickerUpdateMutationNode from '@/__generated__/StatusPickerUpdateMutation.graphql';
import { createRelayEnvironment } from './relay-environment';

// Regression pin for README "Problem 5": the Relay runtime normalizer must key
// records by their `nodeId` field (pg_graphql's global ID), not by their path
// in the response. If `getDataID` is removed or broken, a mutation response is
// stored under a synthetic path and subscribed fragments never see the update.
//
// Invariant: after commitPayload processes a response containing a record with
// `nodeId: X`, the store holds that record at key X. Exercises the real
// normalizer against the real Environment factory, so any regression in the
// `getDataID` wiring fails this test.

describe('createRelayEnvironment / getDataID', () => {
  it('keys normalized records by their nodeId', () => {
    const env = createRelayEnvironment();
    const request = getRequest(StatusPickerUpdateMutationNode);
    const operation = createOperationDescriptor(request, {
      number: 1,
      status: 'done',
    });

    env.commitPayload(operation, {
      updateissuesCollection: {
        records: [{ nodeId: 'issues:1', status: 'done' }],
      },
    });

    const stored = env.getStore().getSource().get('issues:1');
    expect(stored).toBeDefined();
    expect(stored?.status).toBe('done');
  });

  it('does not collide records from different payload paths that share a nodeId', () => {
    const env = createRelayEnvironment();
    const request = getRequest(StatusPickerUpdateMutationNode);
    const first = createOperationDescriptor(request, { number: 1, status: 'todo' });
    const second = createOperationDescriptor(request, { number: 1, status: 'done' });

    env.commitPayload(first, {
      updateissuesCollection: { records: [{ nodeId: 'issues:1', status: 'todo' }] },
    });
    env.commitPayload(second, {
      updateissuesCollection: { records: [{ nodeId: 'issues:1', status: 'done' }] },
    });

    const stored = env.getStore().getSource().get('issues:1');
    expect(stored?.status).toBe('done');
  });
});
