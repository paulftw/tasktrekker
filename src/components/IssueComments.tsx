"use client";

import { graphql, useFragment } from "react-relay";
import type { IssueComments_issue$key } from "@/__generated__/IssueComments_issue.graphql";

const fragment = graphql`
  fragment IssueComments_issue on issues {
    commentsCollection(first: 50, orderBy: [{ number: AscNullsLast }]) {
      edges {
        node {
          nodeId
          number
          body
          created_at
          author: users {
            name
          }
        }
      }
    }
  }
`;

const DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

export function IssueComments({ issue }: { issue: IssueComments_issue$key }) {
  const data = useFragment(fragment, issue);
  const comments = data.commentsCollection?.edges ?? [];

  return (
    <div>
      <h2 className="text-sm font-medium text-text-secondary mb-4">
        Activity
        {comments.length > 0 && (
          <span className="ml-1.5 text-text-muted">{comments.length}</span>
        )}
      </h2>
      {comments.length === 0 ? (
        <p className="text-sm text-text-muted italic">No comments yet.</p>
      ) : (
        <div className="space-y-4">
          {comments.map(({ node }) => (
            <div
              key={node.nodeId}
              id={`comment-${node.number}`}
              className="flex gap-3 scroll-mt-8"
            >
              <div className="size-6 rounded-full bg-bg-active flex-shrink-0 flex items-center justify-center text-xs font-medium text-text-secondary mt-0.5">
                {node.author.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-text">
                    {node.author.name}
                  </span>
                  <a
                    href={`#comment-${node.number}`}
                    className="text-xs text-text-muted hover:text-text-secondary transition-colors"
                  >
                    {DATE_FORMAT.format(new Date(node.created_at))}
                  </a>
                </div>
                <p className="text-sm text-text mt-1 whitespace-pre-wrap">
                  {node.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
