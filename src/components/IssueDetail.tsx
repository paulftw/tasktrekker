'use client';

import { graphql, useLazyLoadQuery } from 'react-relay';
import { useRealtimeRefetch } from '@/lib/useRealtimeRefetch';
import { IssueHeader } from './IssueHeader';
import { IssueDescription } from './IssueDescription';
import { IssueSidebar } from './IssueSidebar';
import { IssueComments } from './IssueComments';
import type { IssueDetailQuery } from '@/__generated__/IssueDetailQuery.graphql';

const query = graphql`
  query IssueDetailQuery($number: Int!) {
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
    ...IssueSidebar_query
    ...IssueComments_query
  }
`;

export function IssueNotFound() {
  return (
    <div className="shell-pad py-10">
      <p className="text-[13px] text-text-muted">Issue not found.</p>
    </div>
  );
}

export function IssueDetail({ number }: { number: number }) {
  const data = useLazyLoadQuery<IssueDetailQuery>(query, { number });
  useRealtimeRefetch(
    `issue-${number}`,
    [
      { table: 'issues', filter: `id=eq.${number}` },
      { table: 'comments', filter: `issue_id=eq.${number}` },
      { table: 'issue_labels', filter: `issue_id=eq.${number}` },
    ],
    query,
    { number },
  );
  const issue = data.issuesCollection?.edges[0]?.node;

  if (!issue) return <IssueNotFound />;

  return (
    <div className="shell-pad py-8 flex-1 overflow-auto">
      <div className="flex gap-12">
        <div className="flex-1 min-w-0 space-y-6">
          <IssueHeader issue={issue} />
          <IssueDescription issue={issue} />
          <hr className="border-border-muted" />
          <IssueComments issue={issue} query={data} />
        </div>
        <div className="w-60 flex-shrink-0">
          <IssueSidebar issue={issue} query={data} />
        </div>
      </div>
    </div>
  );
}
