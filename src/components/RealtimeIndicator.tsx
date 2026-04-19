'use client';

import { useRealtimeStatus, type RealtimeStatus } from '@/lib/realtimeStatus';

const CONFIG: Record<RealtimeStatus, { label: string; color: string; pulse: boolean }> = {
  connected: {
    label: 'Live',
    color: 'var(--color-status-done)',
    pulse: true,
  },
  connecting: {
    label: 'Connecting',
    color: 'var(--color-status-in-progress)',
    pulse: false,
  },
  error: {
    label: 'Offline',
    color: 'var(--color-status-cancelled)',
    pulse: false,
  },
};

export function RealtimeIndicator() {
  const status = useRealtimeStatus();
  const cfg = CONFIG[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 pl-2 pr-2.5 py-1 rounded-full bg-bg-inset border border-border text-[11px] text-text-secondary"
      title={`Realtime: ${cfg.label}`}
    >
      <span
        className={`block size-[7px] rounded-full ${cfg.pulse ? 'shell-rt-dot' : ''}`}
        style={{ background: cfg.color }}
      />
      {cfg.label}
    </span>
  );
}
