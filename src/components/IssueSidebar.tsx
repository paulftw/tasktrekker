"use client";

import type { ReactNode } from "react";
import { graphql, useFragment } from "react-relay";
import { StatusPicker } from "./StatusPicker";
import { PriorityPicker } from "./PriorityPicker";
import { UserAvatar } from "./UserAvatar";
import type { IssueSidebar_issue$key } from "@/__generated__/IssueSidebar_issue.graphql";

const fragment = graphql`
  fragment IssueSidebar_issue on issues {
    nodeId
    number
    status
    priority
    created_at
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

const DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function SectionHead({ children }: { children: ReactNode }) {
  return (
    <div className="text-[11px] font-medium text-text-muted uppercase tracking-[0.05em] pt-4 pb-1.5 mt-2.5 border-t border-border-muted first:pt-0 first:mt-0 first:border-t-0">
      {children}
    </div>
  );
}

function PropertyRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div
      className="grid items-center gap-2 py-1"
      style={{ gridTemplateColumns: "80px minmax(0,1fr)" }}
    >
      <div className="text-[11.5px] text-text-muted tracking-[0.02em]">{label}</div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function IssueSidebar({ issue }: { issue: IssueSidebar_issue$key }) {
  const data = useFragment(fragment, issue);
  const { assignee } = data;
  const labels =
    data.issue_labelsCollection?.edges
      .map((e) => e.node.labels)
      .filter((l): l is NonNullable<typeof l> => l !== null) ?? [];

  return (
    <div>
      <SectionHead>Properties</SectionHead>
      <PropertyRow label="Status">
        <StatusPicker
          nodeId={data.nodeId}
          number={data.number}
          status={data.status}
        />
      </PropertyRow>
      <PropertyRow label="Priority">
        <PriorityPicker
          nodeId={data.nodeId}
          number={data.number}
          priority={data.priority}
        />
      </PropertyRow>
      <PropertyRow label="Assignee">
        <div
          className={`inline-flex items-center gap-1.5 px-1.5 py-[3px] -ml-1.5 text-[12.5px] ${
            assignee ? "text-text" : "text-text-muted"
          }`}
        >
          <UserAvatar user={assignee ?? null} size={18} />
          <span>{assignee ? assignee.name : "Unassigned"}</span>
        </div>
      </PropertyRow>

      <SectionHead>Labels</SectionHead>
      {labels.length > 0 ? (
        <div className="flex flex-wrap gap-1">
          {labels.map((label) => (
            <span
              key={label.nodeId}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10.5px] bg-bg-inset text-text-secondary"
            >
              <span
                className="size-1.5 rounded-full"
                style={{ backgroundColor: `#${label.color}` }}
              />
              {label.name}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-[12px] text-text-muted">No labels</p>
      )}

      <SectionHead>Dates</SectionHead>
      <div className="flex justify-between text-[12px]">
        <span className="text-text-muted">Created</span>
        <span className="text-text-secondary">
          {DATE_FORMAT.format(new Date(data.created_at))}
        </span>
      </div>
    </div>
  );
}
