'use client';

import { graphql, useFragment } from 'react-relay';
import { DescriptionEditor } from './DescriptionEditor';
import type { IssueDescription_issue$key } from '@/__generated__/IssueDescription_issue.graphql';

const fragment = graphql`
  fragment IssueDescription_issue on issues {
    nodeId
    number
    description
  }
`;

export function IssueDescription({ issue }: { issue: IssueDescription_issue$key }) {
  const data = useFragment(fragment, issue);

  return (
    <div>
      <h2 className="text-sm font-medium text-fg-muted mb-2">Description</h2>
      <DescriptionEditor nodeId={data.nodeId} number={data.number} description={data.description} />
    </div>
  );
}
