'use client';

import type { ReactNode } from 'react';
import { graphql, useFragment } from 'react-relay';
import { StatusPicker } from './StatusPicker';
import { PriorityPicker } from './PriorityPicker';
import { AssigneePicker } from './AssigneePicker';
import { LabelsPicker } from './LabelsPicker';
import type { IssueSidebar_issue$key } from '@/__generated__/IssueSidebar_issue.graphql';
import type { IssueSidebar_query$key } from '@/__generated__/IssueSidebar_query.graphql';

const issueFragment = graphql`
  fragment IssueSidebar_issue on issues {
    nodeId
    number
    status
    priority
    created_at
    assignee_id
    assignee: users {
      nodeId
      id
      name
      avatar_url
    }
    issue_labelsCollection(first: 100) @connection(key: "IssueSidebar_issue__issue_labelsCollection") {
      edges {
        node {
          nodeId
          labels {
            nodeId
            number
            name
            color
          }
        }
      }
    }
  }
`;

const queryFragment = graphql`
  fragment IssueSidebar_query on Query {
    usersCollection(first: 100, orderBy: [{ name: AscNullsLast }]) {
      edges {
        node {
          nodeId
          id
          name
          avatar_url
        }
      }
    }
    labelsCollection(first: 100, orderBy: [{ name: AscNullsLast }]) {
      edges {
        node {
          nodeId
          number
          name
          color

        }
      }
    }
  }
`;

const DATE_FORMAT = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
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
    <div className="grid items-center gap-2 py-1" style={{ gridTemplateColumns: '80px minmax(0,1fr)' }}>
      <div className="text-[11.5px] text-text-muted tracking-[0.02em]">{label}</div>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function IssueSidebar({ issue, query }: { issue: IssueSidebar_issue$key; query: IssueSidebar_query$key }) {
  const data = useFragment(issueFragment, issue);
  const queryData = useFragment(queryFragment, query);

  const users = queryData.usersCollection?.edges.map(e => e.node) ?? [];
  const allLabels = queryData.labelsCollection?.edges.map(edge => edge.node) ?? [];
  const labels =
    data.issue_labelsCollection?.edges.map(e => e.node.labels).filter((l): l is NonNullable<typeof l> => l !== null) ??
    [];

  return (
    <div>
      <SectionHead>Properties</SectionHead>
      <PropertyRow label="Status">
        <StatusPicker nodeId={data.nodeId} number={data.number} status={data.status} />
      </PropertyRow>
      <PropertyRow label="Priority">
        <PriorityPicker nodeId={data.nodeId} number={data.number} priority={data.priority} />
      </PropertyRow>
      <PropertyRow label="Assignee">
        <AssigneePicker
          nodeId={data.nodeId}
          number={data.number}
          assigneeId={data.assignee_id ?? null}
          assignee={data.assignee}
          users={users}
        />
      </PropertyRow>
      <PropertyRow label="Created">{DATE_FORMAT.format(new Date(data.created_at))}</PropertyRow>

      <SectionHead>Labels</SectionHead>
      <LabelsPicker issueNodeId={data.nodeId} issueNumber={data.number} labels={allLabels} selected={labels} />
    </div>
  );
}
