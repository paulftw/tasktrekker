"use client";

import { Suspense, use } from "react";
import { ErrorBoundary } from "@/lib/ErrorBoundary";
import { IssueDetail, IssueNotFound } from "@/components/IssueDetail";

export default function IssuePage({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const { number: raw } = use(params);
  const number = Number.parseInt(raw, 10);
  const valid = Number.isInteger(number) && number > 0;

  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen text-text-muted">
            Loading...
          </div>
        }
      >
        {valid ? <IssueDetail number={number} /> : <IssueNotFound />}
      </Suspense>
    </ErrorBoundary>
  );
}
