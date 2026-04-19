'use client';

import { graphql, useLazyLoadQuery } from 'react-relay';
import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useRealtimeRefetch } from '@/lib/useRealtimeRefetch';
import { StatusIcon, STATUS_CONFIG } from './StatusIcon';
import { PriorityIcon } from './PriorityIcon';
import { UserAvatar } from './UserAvatar';
import { LabelPill } from './LabelPill';
import { FilterBar } from './FilterBar';
import type { IssueStatus, IssuePriority } from '@/types/enums';
import type { IssueListQuery } from '@/__generated__/IssueListQuery.graphql';

const query = graphql`
  query IssueListQuery($first: Int!, $filter: issuesFilter) {
    issuesCollection(first: $first, filter: $filter, orderBy: [{ created_at: DescNullsLast }]) {
      edges {
        node {
          nodeId
          number
          title
          status
          priority
          assignee: users {
            name
            avatar_url
          }
          issue_labelsCollection(first: 10) {
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
      }
    }
    labelsCollection(orderBy: [{ name: AscNullsLast }]) {
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

const GROUP_ORDER: IssueStatus[] = ['in_progress', 'todo', 'backlog', 'done', 'cancelled'];
const DEFAULT_COLLAPSED: IssueStatus[] = ['done', 'cancelled'];

type Issue = NonNullable<NonNullable<IssueListQuery['response']['issuesCollection']>['edges'][number]>['node'];

export function IssueList() {
  const searchParams = useSearchParams();
  const selectedPriority = searchParams.get('priority') as IssuePriority | null;
  const selectedStatuses = new Set(searchParams.getAll('status') as IssueStatus[]);
  const selectedLabels = new Set(searchParams.getAll('label'));

  const filter: any = {};
  if (selectedPriority) filter.priority = { eq: selectedPriority };
  if (selectedStatuses.size > 0) filter.status = { in: Array.from(selectedStatuses) };

  const vars = {
    first: 20,
    filter: Object.keys(filter).length > 0 ? filter : null,
  };

  const data = useLazyLoadQuery<IssueListQuery>(query, vars);
  useRealtimeRefetch('issues-list', [{ table: 'issues' }, { table: 'issue_labels' }], query, vars);

  let nodes: Issue[] = (data.issuesCollection?.edges ?? []).map(e => e.node);
  const labels = (data.labelsCollection?.edges ?? []).map(e => e.node);

  if (selectedLabels.size > 0) {
    nodes = nodes.filter(issue => {
      const issueLabelNames = new Set(
        issue.issue_labelsCollection?.edges
          .map(e => e.node.labels?.name)
          .filter(Boolean)
      );
      return Array.from(selectedLabels).every(label => issueLabelNames.has(label));
    });
  }

  const [collapsed, setCollapsed] = useState<Set<IssueStatus>>(() => new Set(DEFAULT_COLLAPSED));
  function toggle(s: IssueStatus) {
    setCollapsed(prev => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  }

  const groups = new Map<IssueStatus, Issue[]>(GROUP_ORDER.map(s => [s, []]));
  for (const n of nodes) {
    const bucket = groups.get(n.status);
    if (bucket) bucket.push(n);
  }

  if (nodes.length === 0 && !selectedPriority && selectedLabels.size === 0 && selectedStatuses.size === 0) {
    return (
      <div className="shell-pad py-20 text-center">
        <p className="text-sm text-text-secondary">No issues yet.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <FilterBar labels={labels} />
      <div className="flex-1 overflow-auto">
        {GROUP_ORDER.filter(s => selectedStatuses.size === 0 || selectedStatuses.has(s)).map(s => {
          const items = groups.get(s) ?? [];
        const isCollapsed = collapsed.has(s);
        const cfg = STATUS_CONFIG[s];
        return (
          <section key={s}>
            <button
              type="button"
              onClick={() => toggle(s)}
              className="shell-pad sticky top-0 z-[2] bg-bg-raised border-b border-border-muted h-8 w-full flex items-center gap-[10px] text-[12px] font-medium text-text cursor-pointer"
              aria-expanded={!isCollapsed}
            >
              <span
                className="w-[18px] inline-flex items-center justify-center text-text-muted transition-transform duration-[120ms]"
                style={{ transform: isCollapsed ? 'rotate(-90deg)' : 'none' }}
                aria-hidden
              >
                <ChevronDown className="size-3" strokeWidth={2} />
              </span>
              <StatusIcon status={s} size={14} />
              <span>{cfg.label}</span>
              <span className="mono text-text-muted">{items.length}</span>
            </button>
            {!isCollapsed && items.length === 0 && (
              <div className="shell-pad py-2.5 text-[12px] text-text-muted">No issues</div>
            )}
            {!isCollapsed && items.map(issue => <IssueRow key={issue.nodeId} issue={issue} />)}
          </section>
        );
      })}
      </div>
    </div>
  );
}

function IssueRow({ issue }: { issue: Issue }) {
  const labels =
    issue.issue_labelsCollection?.edges.map(e => e.node.labels).filter((l): l is NonNullable<typeof l> => l !== null) ??
    [];
  const visible = labels.slice(0, 3);
  const overflow = labels.length - visible.length;

  return (
    <Link
      href={`/issues/${issue.number}`}
      className="shell-pad grid items-center gap-[10px] h-9 border-b border-border-muted hover:bg-bg-hover transition-colors"
      style={{
        gridTemplateColumns: '18px 14px minmax(0,1fr) auto auto',
      }}
    >
      <span className="inline-flex items-center justify-center">
        <PriorityIcon priority={issue.priority} size={14} />
      </span>
      <span className="inline-flex items-center justify-center">
        <StatusIcon status={issue.status} size={14} />
      </span>
      <span
        className="text-[13px] text-text overflow-hidden whitespace-nowrap text-ellipsis"
        style={{ fontWeight: 450 }}
      >
        {issue.title}
      </span>
      <span className="hidden sm:flex items-center gap-1 max-w-[240px] overflow-hidden">
        {visible.map(l => (
          <LabelPill key={l.number} label={l} size="xs" />
        ))}
        {overflow > 0 && (
          <span className="inline-flex items-center rounded-full bg-bg-inset text-text-secondary px-1.5 py-px text-[10px]">
            +{overflow}
          </span>
        )}
      </span>
      <span className="inline-flex items-center justify-end">
        <UserAvatar user={issue.assignee} size={18} />
      </span>
    </Link>
  );
}
