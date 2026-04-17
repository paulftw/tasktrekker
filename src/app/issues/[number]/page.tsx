"use client";

import { Suspense, use } from "react";
import { graphql, useLazyLoadQuery } from "react-relay";
import { ErrorBoundary } from "@/lib/ErrorBoundary";
import { IssueHeader } from "@/components/IssueHeader";
import { IssueDescription } from "@/components/IssueDescription";
import { IssueSidebar } from "@/components/IssueSidebar";
import { IssueComments } from "@/components/IssueComments";
import type { pageIssueDetailQuery } from "@/__generated__/pageIssueDetailQuery.graphql";

const IssueDetailQuery = graphql`
  query pageIssueDetailQuery($number: Int!) {
    issuesCollection(filter: { number: { eq: $number } }, first: 1) {
      edges {
        node {
          nodeId
          ...IssueHeader_issue
          ...IssueDescription_issue
          ...IssueSidebar_issue
          ...IssueComments_issue
        }
      }
    }
  }
`;

function NotFound() {
  return (
    <div className="w-full max-w-4xl mx-auto p-8">
      <p className="text-sm text-text-muted">Issue not found.</p>
    </div>
  );
}

function IssueDetail({ number }: { number: number }) {
  const data = useLazyLoadQuery<pageIssueDetailQuery>(IssueDetailQuery, {
    number,
  });
  const issue = data.issuesCollection?.edges[0]?.node;

  if (!issue) return <NotFound />;

  return (
    <div className="w-full max-w-4xl mx-auto p-8">
      <IssueHeader issue={issue} />
      <div className="mt-8 flex gap-8">
        <div className="flex-1 min-w-0 space-y-8">
          <IssueDescription issue={issue} />
          <hr className="border-border" />
          <IssueComments issue={issue} />
        </div>
        <div className="w-56 flex-shrink-0">
          <IssueSidebar issue={issue} />
        </div>
      </div>
    </div>
  );
}

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
        {valid ? <IssueDetail number={number} /> : <NotFound />}
      </Suspense>
    </ErrorBoundary>
  );
}
