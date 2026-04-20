'use client';

import { useState, useRef } from 'react';
import { graphql, useFragment, usePaginationFragment, useMutation, ConnectionHandler } from 'react-relay';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { ShortcutTextarea } from '@/components/shared/ShortcutTextarea';
import { toast } from 'sonner';
import type { IssueComments_issue$key } from '@/__generated__/IssueComments_issue.graphql';
import type { IssueCommentsPaginationQuery } from '@/__generated__/IssueCommentsPaginationQuery.graphql';
import type { IssueComments_query$key } from '@/__generated__/IssueComments_query.graphql';
import { usePlatformEditorHint } from '@/lib/usePlatformEditorHint';
import type { IssueCommentsAddMutation } from '@/__generated__/IssueCommentsAddMutation.graphql';

// Capped at 30 to match pg_graphql's default collection page size (see the
// matching note in IssueList.tsx). Raising it requires a table-level
// @graphql({"max_rows": N}) directive applied to the demo Supabase.
const COMMENTS_PAGE_SIZE = 30;

const issueFragment = graphql`
  fragment IssueComments_issue on issues
  @refetchable(queryName: "IssueCommentsPaginationQuery")
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 30 }
    cursor: { type: "Cursor" }
  ) {
    nodeId
    number
    commentsCollection(first: $count, after: $cursor, orderBy: [{ number: AscNullsLast }])
      @connection(key: "IssueComments_issue__commentsCollection", filters: []) {
      edges {
        node {
          nodeId
          number
          body
          created_at
          author: users {
            name
            avatar_url
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

const queryFragment = graphql`
  fragment IssueComments_query on Query {
    # TODO: Remove this when authentication is implemented
    # We use the first user (alphabetical by name) as a fallback author for new comments.
    # Must match the FilterBar's "Assigned to me" resolution (IssueList query uses the same ordering)
    # so comment-author and assigned-to-me refer to the same person.
    firstUser: usersCollection(first: 1, orderBy: [{ name: AscNullsLast }]) {
      edges {
        node {
          id
        }
      }
    }
  }
`;

const addCommentMutation = graphql`
  mutation IssueCommentsAddMutation($connections: [ID!]!, $issue_id: Int!, $body: String!, $author_id: UUID!) {
    insertIntocommentsCollection(objects: [{ issue_id: $issue_id, body: $body, author_id: $author_id }]) {
      records @appendNode(connections: $connections, edgeTypeName: "commentsEdge") {
        nodeId
        number
        body
        created_at
        author: users {
          name
          avatar_url
        }
      }
    }
  }
`;

const DATE_FORMAT = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
});

export function IssueComments({ issue, query }: { issue: IssueComments_issue$key; query: IssueComments_query$key }) {
  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment<IssueCommentsPaginationQuery, IssueComments_issue$key>(
    issueFragment,
    issue
  );
  const queryData = useFragment(queryFragment, query);
  const [commit, isInFlight] = useMutation<IssueCommentsAddMutation>(addCommentMutation);
  const [body, setBody] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const editorHint = usePlatformEditorHint('comment');

  function handleCancel() {
    setBody('');
    textareaRef.current?.blur();
  }

  const comments = data.commentsCollection?.edges ?? [];
  // TODO: Remove this when authentication is implemented and use the real current user's ID
  const authorId = queryData.firstUser?.edges[0]?.node?.id;

  function submitComment() {
    if (!body.trim() || !authorId || isInFlight) return;

    const connectionId = ConnectionHandler.getConnectionID(data.nodeId, 'IssueComments_issue__commentsCollection');

    commit({
      variables: {
        connections: [connectionId],
        issue_id: data.number,
        body: body.trim(),
        author_id: authorId,
      },
      onCompleted: () => {
        setBody('');
      },
      onError: err => {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        toast.error('Failed to add comment', { description: msg });
        console.error('Add comment failed:', err);
      },
    });
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    submitComment();
  }

  return (
    <div>
      <h2 className="text-[11px] font-medium text-fg-subtle uppercase tracking-[0.04em] mb-3">
        Activity
        {comments.length > 0 && <span className="ml-1.5 mono text-fg-subtle normal-case">{comments.length}</span>}
      </h2>

      {comments.length === 0 ? (
        <p className="text-[13px] text-fg-subtle italic mb-6">No comments yet.</p>
      ) : (
        <div className="space-y-4 mb-6">
          {comments.map(({ node }) => (
            <div key={node.nodeId} id={`comment-${node.number}`} className="flex gap-3 scroll-mt-8">
              <UserAvatar user={node.author} size={24} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium text-fg">{node.author.name}</span>
                  <a
                    href={`#comment-${node.number}`}
                    className="mono text-[11px] text-fg-subtle hover:text-fg-muted transition-colors"
                  >
                    {DATE_FORMAT.format(new Date(node.created_at))}
                  </a>
                </div>
                <p className="text-[13px] text-fg mt-1 whitespace-pre-wrap leading-relaxed">{node.body}</p>
              </div>
            </div>
          ))}
          {hasNext && (
            <div className="pt-2 text-center">
              <button
                type="button"
                disabled={isLoadingNext}
                onClick={() => loadNext(COMMENTS_PAGE_SIZE)}
                className="px-4 py-2 bg-surface-raised text-fg-muted hover:text-fg border border-line-muted rounded-md text-[12px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingNext ? 'Loading...' : 'Load more comments'}
              </button>
            </div>
          )}
        </div>
      )}

      <form
        onSubmit={onSubmit}
        className="mt-5 border border-line rounded-lg bg-surface-raised transition-all focus-within:border-[var(--color-accent)] focus-within:ring-[3px] focus-within:ring-[color-mix(in_oklch,var(--color-accent)_15%,transparent)] focus-within:bg-surface"
      >
        <ShortcutTextarea
          ref={textareaRef}
          value={body}
          onChange={e => setBody(e.target.value)}
          onSubmitShortcut={submitComment}
          onCancelShortcut={handleCancel}
          placeholder="Leave a comment..."
          className="w-full min-h-[56px] px-3 py-2.5 border-0 bg-transparent outline-none focus:outline-none resize-none text-[13px] leading-relaxed"
          disabled={isInFlight}
        />
        <div className="flex items-center px-2 py-1.5 pl-3 border-t border-line-muted">
          {editorHint && <span className="text-[11px] text-fg-subtle mr-auto">{editorHint}</span>}
          <button
            type="submit"
            disabled={!body.trim() || isInFlight}
            className="px-3 py-1.5 bg-[var(--color-accent)] text-white border-transparent text-[12px] font-medium rounded-md hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
            style={{ opacity: !body.trim() || isInFlight ? 0.5 : 1 }}
          >
            Comment
          </button>
        </div>
      </form>
    </div>
  );
}
