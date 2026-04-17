"use client";

import { graphql, useFragment } from "react-relay";
import type { IssueDescription_issue$key } from "@/__generated__/IssueDescription_issue.graphql";

const fragment = graphql`
  fragment IssueDescription_issue on issues {
    description
  }
`;

export function IssueDescription({
  issue,
}: {
  issue: IssueDescription_issue$key;
}) {
  const data = useFragment(fragment, issue);

  return (
    <div>
      <h2 className="text-sm font-medium text-text-secondary mb-2">
        Description
      </h2>
      {data.description ? (
        <p className="text-sm text-text whitespace-pre-wrap">
          {data.description}
        </p>
      ) : (
        <p className="text-sm text-text-muted italic">
          No description provided.
        </p>
      )}
    </div>
  );
}
