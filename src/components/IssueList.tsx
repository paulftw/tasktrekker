"use client";

import { graphql, useLazyLoadQuery } from "react-relay";
import Link from "next/link";
import { useRealtimeRefetch } from "@/lib/useRealtimeRefetch";
import { StatusIcon } from "./StatusIcon";
import { PriorityIcon } from "./PriorityIcon";
import type { IssueListQuery } from "@/__generated__/IssueListQuery.graphql";

const query = graphql`
  query IssueListQuery($first: Int!) {
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

const VARS = { first: 20 } as const;

export function IssueList() {
  const data = useLazyLoadQuery<IssueListQuery>(query, VARS);
  useRealtimeRefetch("issues-list", [{ table: "issues" }], query, VARS);

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
