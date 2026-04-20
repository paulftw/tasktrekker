'use client';

import { graphql, useLazyLoadQuery, usePaginationFragment } from 'react-relay';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useRealtimeRefetch } from '@/lib/useRealtimeRefetch';
import { parsePriority, parseStatuses } from '@/lib/urlFilters';
import { StatusIcon, STATUS_CONFIG, ISSUE_STATUSES } from '@/components/shared/StatusIcon';
import { PriorityIcon } from '@/components/shared/PriorityIcon';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { LabelPill } from '@/components/shared/LabelPill';
import { FilterBar } from './FilterBar';
import type { IssueStatus, IssuePriority } from '@/types/enums';
import type { IssueListQuery } from '@/__generated__/IssueListQuery.graphql';

// Page size is pinned to 30 because pg_graphql caps collection pagination at
// that many rows per request by default. Raising it would require a table
// comment like @graphql({"max_rows": N}) applied to the demo Supabase.
const fragment = graphql`
  fragment IssueList_query on Query
  @refetchable(queryName: "IssueListPaginationQuery")
  @argumentDefinitions(
    first: { type: "Int", defaultValue: 30 }
    cursor: { type: "Cursor" }
    filter: { type: "issuesFilter" }
  ) {
    issuesCollection(first: $first, after: $cursor, filter: $filter, orderBy: [{ created_at: DescNullsLast }])
    @connection(key: "IssueList_query_issuesCollection", filters: ["filter"]) {
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
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const query = graphql`
  query IssueListQuery($first: Int!, $cursor: Cursor, $filter: issuesFilter) {
    ...IssueList_query @arguments(first: $first, cursor: $cursor, filter: $filter)
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
  }
`;

const DEFAULT_COLLAPSED: IssueStatus[] = ['done', 'cancelled'];
const ISSUE_PAGE_SIZE = 30;

import type { IssueList_query$data, IssueList_query$key } from '@/__generated__/IssueList_query.graphql';
import type { IssueListPaginationQuery } from '@/__generated__/IssueListPaginationQuery.graphql';

type IssueEdges = NonNullable<NonNullable<IssueList_query$data['issuesCollection']>['edges']>;
type Issue = NonNullable<IssueEdges[number]>['node'];

export function IssueList() {
  const searchParams = useSearchParams();
  const selectedPriority = parsePriority(searchParams);
  const selectedStatuses = new Set(parseStatuses(searchParams));
  const selectedLabels = new Set(searchParams.getAll('label'));
  const selectedAssignees = new Set(searchParams.getAll('assignee'));

  const filter: Record<string, unknown> = {};
  if (selectedPriority) filter.priority = { eq: selectedPriority };
  if (selectedStatuses.size > 0) filter.status = { in: Array.from(selectedStatuses) };
  if (selectedAssignees.size > 0) {
    const includesUnassigned = selectedAssignees.has('unassigned');
    const userIds = Array.from(selectedAssignees).filter(id => id !== 'unassigned');
    if (includesUnassigned && userIds.length > 0) {
      filter.or = [{ assignee_id: { is: 'NULL' } }, { assignee_id: { in: userIds } }];
    } else if (includesUnassigned) {
      filter.assignee_id = { is: 'NULL' };
    } else {
      filter.assignee_id = { in: userIds };
    }
  }

  const vars = {
    first: ISSUE_PAGE_SIZE,
    filter: Object.keys(filter).length > 0 ? filter : null,
  };

  const queryData = useLazyLoadQuery<IssueListQuery>(query, vars);
  useRealtimeRefetch('issues-list', [{ table: 'issues' }, { table: 'issue_labels' }], query, vars);

  return <IssueListContent queryData={queryData} selectedPriority={selectedPriority} selectedStatuses={selectedStatuses} selectedLabels={selectedLabels} selectedAssignees={selectedAssignees} />;
}

function IssueListContent({
  queryData,
  selectedPriority,
  selectedStatuses,
  selectedLabels,
  selectedAssignees,
}: {
  queryData: IssueListQuery['response'];
  selectedPriority: IssuePriority | null;
  selectedStatuses: Set<IssueStatus>;
  selectedLabels: Set<string>;
  selectedAssignees: Set<string>;
}) {
  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment<IssueListPaginationQuery, IssueList_query$key>(
    fragment,
    queryData
  );

  let nodes: Issue[] = (data.issuesCollection?.edges ?? []).map((e) => (e as IssueEdges[number]).node);
  const labels = (queryData.labelsCollection?.edges ?? []).map((e) => e!.node);
  const users = (queryData.usersCollection?.edges ?? []).map((e) => e!.node);

  // KNOWN BUG: label filter runs client-side after pagination, so label matches
  // beyond page 1 are invisible — pages 1..N can come back empty while matches
  // exist further down. Correct fix is a server-side `issues_with_all_labels`
  // procedure or an EXISTS clause wired through a custom pg_graphql filter;
  // punted for the weekend. Do not rely on this past a single page of results.
  if (selectedLabels.size > 0) {
    nodes = nodes.filter(issue => {
      const issueLabelNames = new Set(
        issue.issue_labelsCollection?.edges
          .map((e) => e!.node.labels?.name)
          .filter(Boolean)
      );
      return Array.from(selectedLabels).every(label => issueLabelNames.has(label));
    });
  }

  const [collapsed, setCollapsed] = useState<Set<IssueStatus>>(() => new Set(DEFAULT_COLLAPSED));
  const [prevStatusesKey, setPrevStatusesKey] = useState(() => Array.from(selectedStatuses).sort().join(','));

  const currentStatusesKey = Array.from(selectedStatuses).sort().join(',');
  if (currentStatusesKey !== prevStatusesKey) {
    setPrevStatusesKey(currentStatusesKey);
    const prevSet = new Set(prevStatusesKey ? prevStatusesKey.split(',') : []);
    const added = Array.from(selectedStatuses).filter(s => !prevSet.has(s as IssueStatus));
    if (added.length > 0) {
      setCollapsed(c => {
        const next = new Set(c);
        added.forEach(s => next.delete(s as IssueStatus));
        return next;
      });
    }
  }

  function toggle(s: IssueStatus) {
    setCollapsed(prev => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  }

  const groups = new Map<IssueStatus, Issue[]>(ISSUE_STATUSES.map(s => [s, []]));
  for (const n of nodes) {
    const bucket = groups.get(n.status);
    if (bucket) bucket.push(n);
  }

  if (
    nodes.length === 0 &&
    !selectedPriority &&
    selectedLabels.size === 0 &&
    selectedStatuses.size === 0 &&
    selectedAssignees.size === 0
  ) {
    return (
      <div className="shell-pad py-20 text-center">
        <p className="text-sm text-fg-muted">No issues yet.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <FilterBar labels={labels} users={users} />
      <div className="flex-1 overflow-auto">
        {ISSUE_STATUSES.filter(s => selectedStatuses.size === 0 || selectedStatuses.has(s)).map(s => {
          const items = groups.get(s) ?? [];
          const isCollapsed = collapsed.has(s);
          const cfg = STATUS_CONFIG[s];
          return (
            <section key={s}>
              <button
                type="button"
                onClick={() => toggle(s)}
                className="shell-pad sticky top-0 z-[2] bg-surface-raised border-b border-line-muted h-8 w-full flex items-center gap-[10px] text-[12px] font-medium text-fg cursor-pointer"
                aria-expanded={!isCollapsed}
              >
                <span
                  className="w-[18px] inline-flex items-center justify-center text-fg-subtle transition-transform duration-[120ms]"
                  style={{ transform: isCollapsed ? 'rotate(-90deg)' : 'none' }}
                  aria-hidden
                >
                  <ChevronDown className="size-3" strokeWidth={2} />
                </span>
                <StatusIcon status={s} size={14} />
                <span>{cfg.label}</span>
                <span className="mono text-fg-subtle">{items.length}</span>
              </button>
              {!isCollapsed && items.length === 0 && (
                <div className="shell-pad py-2.5 text-[12px] text-fg-subtle">No issues</div>
              )}
              {!isCollapsed && items.map(issue => <IssueRow key={issue.nodeId} issue={issue} />)}
            </section>
          );
        })}
        
        {hasNext && (
          <InfiniteScrollTrigger
            onIntersect={() => {
              if (!isLoadingNext) loadNext(ISSUE_PAGE_SIZE);
            }}
          />
        )}
        {isLoadingNext && (
          <div className="shell-pad py-4 text-center text-[12px] text-fg-subtle">Loading more...</div>
        )}
      </div>
    </div>
  );
}

function InfiniteScrollTrigger({ onIntersect }: { onIntersect: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          onIntersect();
        }
      },
      { rootMargin: '100px' }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [onIntersect]);

  return <div ref={ref} className="h-4 w-full" aria-hidden />;
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
      className="shell-pad grid items-center gap-[10px] h-9 border-b border-line-muted hover:bg-surface-hover transition-colors"
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
        className="text-[13px] text-fg overflow-hidden whitespace-nowrap text-ellipsis"
        style={{ fontWeight: 450 }}
      >
        {issue.title}
      </span>
      <span className="hidden sm:flex items-center gap-1 max-w-[240px] overflow-hidden">
        {visible.map(l => (
          <LabelPill key={l.number} label={l} size="xs" />
        ))}
        {overflow > 0 && (
          <span className="inline-flex items-center rounded-full bg-surface-inset text-fg-muted px-1.5 py-px text-[10px]">
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
