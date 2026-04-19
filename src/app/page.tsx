'use client';

import { Suspense } from 'react';
import { ErrorBoundary } from '@/lib/ErrorBoundary';
import { AppShell } from '@/components/AppShell';
import { IssueList } from '@/components/IssueList';

export default function Home() {
  return (
    <ErrorBoundary>
      <AppShell>
        <Suspense fallback={<div className="flex-1 flex items-center justify-center text-text-muted">Loading...</div>}>
          <IssueList />
        </Suspense>
      </AppShell>
    </ErrorBoundary>
  );
}
