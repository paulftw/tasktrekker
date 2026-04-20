'use client';

import { Suspense, use } from 'react';
import { ErrorBoundary } from '@/lib/ErrorBoundary';
import { AppShell } from '@/components/layout/AppShell';
import { IssueDetail, IssueNotFound } from '@/components/issue-detail/IssueDetail';

export default function IssuePage({ params }: { params: Promise<{ number: string }> }) {
  const { number: raw } = use(params);
  const number = Number.parseInt(raw, 10);
  const valid = Number.isInteger(number) && number > 0;

  return (
    <ErrorBoundary>
      <AppShell>
        <Suspense fallback={<div className="flex-1 flex items-center justify-center text-fg-subtle">Loading...</div>}>
          {valid ? <IssueDetail number={number} /> : <IssueNotFound />}
        </Suspense>
      </AppShell>
    </ErrorBoundary>
  );
}
