'use client';

import { graphql, useLazyLoadQuery } from 'react-relay';
import { Dropdown } from './Dropdown';
import { UserAvatar } from './UserAvatar';
import type { CurrentUserMenuQuery } from '@/__generated__/CurrentUserMenuQuery.graphql';

// TODO: Replace with auth.uid() lookup once Supabase Auth lands.
// Matches the current-user fallback ordering used by FilterBar ("Assigned to me")
// and IssueComments (comment author) so all three resolve to the same user.
const query = graphql`
  query CurrentUserMenuQuery {
    usersCollection(first: 1, orderBy: [{ name: AscNullsLast }]) {
      edges {
        node {
          name
          avatar_url
        }
      }
    }
  }
`;

export function CurrentUserMenu() {
  const data = useLazyLoadQuery<CurrentUserMenuQuery>(query, {});
  const user = data.usersCollection?.edges[0]?.node ?? null;
  if (!user) return null;

  return (
    <Dropdown>
      <Dropdown.Trigger
        aria-label={`Current user: ${user.name}`}
        className="rounded-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
      >
        <UserAvatar user={user} size={22} />
      </Dropdown.Trigger>
      <Dropdown.Menu align="end" className="min-w-[200px] px-3 py-2">
        <div className="text-[12.5px] text-fg">You are {user.name}</div>
        <div className="text-[11px] text-fg-subtle mt-0.5">No auth in this demo</div>
      </Dropdown.Menu>
    </Dropdown>
  );
}
