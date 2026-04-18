"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "@/lib/ErrorBoundary";
import { IssueList } from "@/components/IssueList";

export default function Home() {
  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen text-text-muted">
            Loading...
          </div>
        }
      >
        <IssueList />
      </Suspense>
    </ErrorBoundary>
  );
}
