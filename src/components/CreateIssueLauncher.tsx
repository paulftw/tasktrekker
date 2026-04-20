'use client';

import { Suspense, useEffect, useState } from 'react';
import { graphql, usePreloadedQuery, useQueryLoader } from 'react-relay';
import type { PreloadedQuery } from 'react-relay';
import { Plus } from 'lucide-react';
import { CreateIssueModal } from './CreateIssueModal';
import type { CreateIssueLauncherQuery } from '@/__generated__/CreateIssueLauncherQuery.graphql';

const query = graphql`
  query CreateIssueLauncherQuery {
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

function isEditableTarget(target: EventTarget | null) {
  const element = target instanceof HTMLElement ? target : null;
  if (!element) return false;
  if (element.isContentEditable) return true;
  return Boolean(element.closest('input, textarea, select, [contenteditable="true"]'));
}

export function CreateIssueLauncher() {
  const [open, setOpen] = useState(false);
  const [queryRef, loadQuery, disposeQuery] = useQueryLoader<CreateIssueLauncherQuery>(query);

  useEffect(() => {
    loadQuery({}, { fetchPolicy: 'store-or-network' });
    return disposeQuery;
  }, [disposeQuery, loadQuery]);

  function openModal() {
    if (queryRef == null) {
      loadQuery({}, { fetchPolicy: 'store-or-network' });
    }
    setOpen(true);
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (open) return;
      if (event.defaultPrevented || event.repeat) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key.toLowerCase() !== 'c') return;
      if (isEditableTarget(event.target)) return;
      event.preventDefault();
      if (queryRef == null) {
        loadQuery({}, { fetchPolicy: 'store-or-network' });
      }
      setOpen(true);
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [loadQuery, open, queryRef]);

  return (
    <>
      <NewIssueButton onClick={openModal} />

      {open && queryRef != null && (
        <Suspense fallback={null}>
          <CreateIssueLauncherModal queryRef={queryRef} onClose={() => setOpen(false)} />
        </Suspense>
      )}
    </>
  );
}

function CreateIssueLauncherModal({
  queryRef,
  onClose,
}: {
  queryRef: PreloadedQuery<CreateIssueLauncherQuery>;
  onClose: () => void;
}) {
  const data = usePreloadedQuery<CreateIssueLauncherQuery>(query, queryRef);
  const users = data.usersCollection?.edges.map(edge => edge.node) ?? [];
  const labels = data.labelsCollection?.edges.map(edge => edge.node) ?? [];

  return <CreateIssueModal open onClose={onClose} users={users} labels={labels} />;
}

function NewIssueButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md text-[12px] font-medium text-white cursor-pointer transition-all hover:brightness-110"
      style={{ background: 'var(--color-accent)' }}
    >
      <Plus className="size-[13px]" strokeWidth={2} />
      New issue
    </button>
  );
}
