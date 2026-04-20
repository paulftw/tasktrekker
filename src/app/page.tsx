'use client';

import { Suspense } from 'react';
import { ErrorBoundary } from '@/lib/ErrorBoundary';
import { AppShell } from '@/components/layout/AppShell';
import { IssueList } from '@/components/issue-list/IssueList';

export default function Home() {
  return (
    <ErrorBoundary>
      <AppShell>
        <Suspense fallback={<div className="flex-1 flex items-center justify-center text-fg-subtle">Loading...</div>}>
          <IssueList />
        </Suspense>
      </AppShell>
    </ErrorBoundary>
  );
}
