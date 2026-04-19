'use client';

import { useSyncExternalStore } from 'react';

export type RealtimeStatus = 'connecting' | 'connected' | 'error';

const channelStatuses = new Map<string, RealtimeStatus>();
const listeners = new Set<() => void>();
let snapshot: RealtimeStatus = 'connecting';

function aggregate(): RealtimeStatus {
  const values = Array.from(channelStatuses.values());
  if (values.length === 0) return 'connecting';
  if (values.some(s => s === 'connected')) return 'connected';
  if (values.some(s => s === 'error')) return 'error';
  return 'connecting';
}

function recompute() {
  const next = aggregate();
  if (next !== snapshot) {
    snapshot = next;
    for (const l of listeners) l();
  }
}

export function setChannelStatus(key: string, status: RealtimeStatus) {
  channelStatuses.set(key, status);
  recompute();
}

export function clearChannelStatus(key: string) {
  channelStatuses.delete(key);
  recompute();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function getSnapshot() {
  return snapshot;
}

function getServerSnapshot(): RealtimeStatus {
  return 'connecting';
}

export function useRealtimeStatus(): RealtimeStatus {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
