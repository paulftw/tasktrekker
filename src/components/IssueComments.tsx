"use client";

import { graphql, useFragment } from "react-relay";
import { UserAvatar } from "./UserAvatar";
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
      <h2 className="text-[11px] font-medium text-text-muted uppercase tracking-[0.04em] mb-3">
        Activity
        {comments.length > 0 && (
          <span className="ml-1.5 mono text-text-muted normal-case">
            {comments.length}
          </span>
        )}
      </h2>
      {comments.length === 0 ? (
        <p className="text-[13px] text-text-muted italic">No comments yet.</p>
      ) : (
        <div className="space-y-4">
          {comments.map(({ node }) => (
            <div
              key={node.nodeId}
              id={`comment-${node.number}`}
              className="flex gap-3 scroll-mt-8"
            >
              <UserAvatar user={node.author} size={24} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium text-text">
                    {node.author.name}
                  </span>
                  <a
                    href={`#comment-${node.number}`}
                    className="mono text-[11px] text-text-muted hover:text-text-secondary transition-colors"
                  >
                    {DATE_FORMAT.format(new Date(node.created_at))}
                  </a>
                </div>
                <p className="text-[13px] text-text mt-1 whitespace-pre-wrap leading-relaxed">
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
