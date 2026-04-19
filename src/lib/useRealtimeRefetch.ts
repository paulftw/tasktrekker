'use client';

import { useEffect } from 'react';
import { fetchQuery, useRelayEnvironment } from 'react-relay';
import type { GraphQLTaggedNode, Variables } from 'relay-runtime';
import { getSupabaseClient } from './supabase-client';
import { clearChannelStatus, setChannelStatus } from './realtimeStatus';

// Bridges Supabase Realtime events into the Relay store via refetch. On any
// matching postgres_change, re-runs the route's query against the network;
// Relay normalizes by getDataID (nodeId) so every subscriber to the affected
// records re-renders. Refetch beats hand-patching the store from raw row
// payloads — the raw rows speak SQL column names (`id`) while the store
// speaks pg_graphql shapes (`number`, encoded `nodeId`, scalar coercions).

export type RealtimeFilter = {
  table: 'issues' | 'comments';
  filter?: string;
};

export function useRealtimeRefetch<TVars extends Variables>(
  channelName: string,
  filters: ReadonlyArray<RealtimeFilter>,
  query: GraphQLTaggedNode,
  variables: TVars,
) {
  const env = useRelayEnvironment();
  const filtersKey = JSON.stringify(filters);
  const variablesKey = JSON.stringify(variables);

  useEffect(() => {
    const supabase = getSupabaseClient();
    const channel = supabase.channel(channelName);

    for (const f of filters) {
      channel.on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: f.table,
          ...(f.filter ? { filter: f.filter } : {}),
        },
        () => {
          fetchQuery(env, query, variables, {
            fetchPolicy: 'network-only',
          }).subscribe({});
        },
      );
    }

    setChannelStatus(channelName, 'connecting');
    channel.subscribe(status => {
      if (status === 'SUBSCRIBED') setChannelStatus(channelName, 'connected');
      else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') setChannelStatus(channelName, 'error');
      else if (status === 'CLOSED') setChannelStatus(channelName, 'connecting');
    });

    return () => {
      supabase.removeChannel(channel);
      clearChannelStatus(channelName);
    };
    // filters/variables are tracked via their JSON keys so callers can pass
    // fresh literals each render without re-subscribing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [env, channelName, query, filtersKey, variablesKey]);
}
