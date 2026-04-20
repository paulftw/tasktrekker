import { Suspense } from 'react';
import { act, render, screen } from '@testing-library/react';
import { RelayEnvironmentProvider, graphql, useLazyLoadQuery } from 'react-relay';
import { MockPayloadGenerator, createMockEnvironment } from 'relay-test-utils';
import { describe, expect, it } from 'vitest';
import { IssueSidebar } from './IssueSidebar';
import type { IssueSidebarTestQuery } from '@/__generated__/IssueSidebarTestQuery.graphql';

const testQuery = graphql`
  query IssueSidebarTestQuery @relay_test_operation {
    issuesCollection(first: 1) {
      edges {
        node {
          ...IssueSidebar_issue
        }
      }
    }
    ...IssueSidebar_query
  }
`;

function TestWrapper() {
  const data = useLazyLoadQuery<IssueSidebarTestQuery>(testQuery, {});
  const issue = data.issuesCollection?.edges[0]?.node;

  if (!issue) return null;

  return <IssueSidebar issue={issue} query={data} />;
}

describe('IssueSidebar', () => {
  it('renders properties and labels without crashing', async () => {
    const environment = createMockEnvironment();

    render(
      <RelayEnvironmentProvider environment={environment}>
        <Suspense fallback="Loading...">
          <TestWrapper />
        </Suspense>
      </RelayEnvironmentProvider>,
    );

    await act(async () => {
      environment.mock.resolveMostRecentOperation(operation =>
        MockPayloadGenerator.generate(operation, {
          issues() {
            return {
              nodeId: 'issues:1',
              number: 1,
              status: 'in_progress',
              priority: 'high',
              created_at: '2026-04-20T10:00:00Z',
            };
          },
          labels() {
            return {
              nodeId: 'labels:1',
              number: 1,
              name: 'Bug',
              color: 'ef4444',
            };
          },
        }),
      );
    });

    // Verify properties
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Priority')).toBeInTheDocument();
    expect(screen.getByText('Assignee')).toBeInTheDocument();

    // Verify it doesn't crash and renders the label picker button
    expect(screen.getByRole('button', { name: /^add label$/i })).toBeInTheDocument();
  });
});
