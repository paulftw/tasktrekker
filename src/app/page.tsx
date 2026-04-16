"use client";

import { Suspense } from "react";
import { graphql, useLazyLoadQuery } from "react-relay";
import { ErrorBoundary } from "@/lib/ErrorBoundary";
import type { pageIssuesQuery } from "@/__generated__/pageIssuesQuery.graphql";

const IssuesQuery = graphql`
  query pageIssuesQuery($first: Int!) {
    issuesCollection(first: $first, orderBy: [{ created_at: DescNullsLast }]) {
      edges {
        node {
          nodeId
          title
          status
          priority
        }
      }
    }
  }
`;

function IssueList() {
  const data = useLazyLoadQuery<pageIssuesQuery>(IssuesQuery, { first: 20 });

  const edges = data.issuesCollection?.edges ?? [];

  return (
    <div className="w-full max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-semibold mb-6">Issues</h1>
      {edges.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">No issues yet.</p>
      ) : (
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg divide-y divide-zinc-200 dark:divide-zinc-800">
        {edges.map(({ node }) => (
          <div key={node.nodeId} className="flex items-center gap-4 px-4 py-3">
            <span className="text-xs font-medium uppercase px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
              {node.status.replaceAll("_", " ")}
            </span>
            <span className="text-xs font-medium uppercase px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
              {node.priority}
            </span>
            <span className="flex-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {node.title}
            </span>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen text-zinc-400">
            Loading...
          </div>
        }
      >
        <IssueList />
      </Suspense>
    </ErrorBoundary>
  );
}
