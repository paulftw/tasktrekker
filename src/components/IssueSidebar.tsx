"use client";

import { graphql, useFragment } from "react-relay";
import { PriorityPicker } from "./PriorityPicker";
import type { IssueSidebar_issue$key } from "@/__generated__/IssueSidebar_issue.graphql";

const fragment = graphql`
  fragment IssueSidebar_issue on issues {
    nodeId
    number
    priority
    assignee: users {
      name
      avatar_url
    }
    issue_labelsCollection(first: 20) {
      edges {
        node {
          labels {
            nodeId
            name
            color
          }
        }
      }
    }
  }
`;

export function IssueSidebar({ issue }: { issue: IssueSidebar_issue$key }) {
  const data = useFragment(fragment, issue);
  const { assignee } = data;
  const labels =
    data.issue_labelsCollection?.edges
      .map((e) => e.node.labels)
      .filter((l): l is NonNullable<typeof l> => l !== null) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xs font-medium text-text-muted uppercase tracking-wide mb-2">
          Priority
        </h3>
        <PriorityPicker
          nodeId={data.nodeId}
          number={data.number}
          priority={data.priority}
        />
      </div>
      <div>
        <h3 className="text-xs font-medium text-text-muted uppercase tracking-wide mb-2">
          Assignee
        </h3>
        {assignee ? (
          <div className="flex items-center gap-2">
            <div className="size-6 rounded-full bg-bg-active flex items-center justify-center text-xs font-medium text-text-secondary">
              {assignee.name.charAt(0)}
            </div>
            <span className="text-sm text-text">{assignee.name}</span>
          </div>
        ) : (
          <p className="text-sm text-text-muted">Unassigned</p>
        )}
      </div>
      <div>
        <h3 className="text-xs font-medium text-text-muted uppercase tracking-wide mb-2">
          Labels
        </h3>
        {labels.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {labels.map((label) => (
              <span
                key={label.nodeId}
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-bg-inset text-text-secondary"
              >
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: `#${label.color}` }}
                />
                {label.name}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-muted">No labels</p>
        )}
      </div>
    </div>
  );
}
