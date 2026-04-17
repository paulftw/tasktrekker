"use client";

import { Suspense } from "react";
import { graphql, useLazyLoadQuery } from "react-relay";
import Link from "next/link";
import { ErrorBoundary } from "@/lib/ErrorBoundary";
import { StatusIcon } from "@/components/StatusIcon";
import { PriorityIcon } from "@/components/PriorityIcon";
import type { pageIssuesQuery } from "@/__generated__/pageIssuesQuery.graphql";

const IssuesQuery = graphql`
  query pageIssuesQuery($first: Int!) {
    issuesCollection(first: $first, orderBy: [{ created_at: DescNullsLast }]) {
      edges {
        node {
          nodeId
          number
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
        <p className="text-sm text-text-muted">No issues yet.</p>
      ) : (
      <div className="border border-border rounded-lg divide-y divide-border">
        {edges.map(({ node }) => (
          <Link
            key={node.nodeId}
            href={`/issues/${node.number}`}
            className="flex items-center gap-3 px-4 py-3 hover:bg-bg-hover transition-colors"
          >
            <StatusIcon status={node.status} />
            <span className="text-sm text-text-muted tabular-nums w-8">
              {node.number}
            </span>
            <span className="flex-1 text-sm font-medium text-text">
              {node.title}
            </span>
            <PriorityIcon priority={node.priority} />
          </Link>
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
