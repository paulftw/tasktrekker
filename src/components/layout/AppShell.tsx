import Link from 'next/link';
import { Suspense, type ReactNode } from 'react';
import { CreateIssueLauncher } from '@/components/modals/CreateIssueLauncher';
import { CurrentUserMenu } from './CurrentUserMenu';
import { RealtimeIndicator } from '@/components/shared/RealtimeIndicator';
import { UserAvatar } from '@/components/shared/UserAvatar';

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
    <header className="shell-pad h-[46px] border-b border-line flex items-center gap-[10px] shrink-0">
      <Link href="/" className="flex items-center gap-1.5 rounded hover:opacity-80 transition-opacity">
        <div
          aria-hidden
          className="size-[18px] rounded-[5px] grid place-items-center text-white shrink-0"
          style={{
            background:
              'linear-gradient(135deg, var(--color-accent) 0%, oklch(0.72 0.12 calc(var(--accent-h) + 40)) 100%)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
          }}
        >
          <svg viewBox="0 0 32 32" className="size-[12px]" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
            <path d="M5 23 L12 12 L16 17 L21 7 L27 23" />
          </svg>
        </div>
        <span className="text-[13px] font-semibold">TaskTrekker</span>
      </Link>
      <div className="ml-auto flex items-center gap-1.5">
        <RealtimeIndicator />
        <Suspense fallback={<UserAvatar user={null} size={22} />}>
          <CurrentUserMenu />
        </Suspense>
        <CreateIssueLauncher />
      </div>
    </header>
  );
}
