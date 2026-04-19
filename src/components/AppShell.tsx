import { Plus } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { RealtimeIndicator } from './RealtimeIndicator';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="w-full max-w-[1120px] mx-auto flex flex-col flex-1 min-h-0">
        <Topbar />
        {children}
      </div>
    </div>
  );
}

function Topbar() {
  return (
    <header className="shell-pad h-[46px] border-b border-border flex items-center gap-[10px] shrink-0">
      <Link href="/" className="flex items-center gap-1.5 rounded hover:opacity-80 transition-opacity">
        <div
          aria-hidden
          className="size-[18px] rounded-[5px] grid place-items-center text-white font-bold text-[10px] shrink-0"
          style={{
            background:
              'linear-gradient(135deg, var(--color-accent) 0%, oklch(0.72 0.12 calc(var(--accent-h) + 40)) 100%)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
          }}
        >
          T
        </div>
        <span className="text-[13px] font-semibold tracking-tight">TaskTrekker</span>
      </Link>
      <div className="ml-auto flex items-center gap-1.5">
        <RealtimeIndicator />
        <button
          type="button"
          disabled
          aria-disabled="true"
          title="New issue — not yet implemented"
          className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md text-[12px] font-medium text-white opacity-60 cursor-not-allowed"
          style={{ background: 'var(--color-accent)' }}
        >
          <Plus className="size-[13px]" strokeWidth={2} />
          New issue
        </button>
      </div>
    </header>
  );
}
