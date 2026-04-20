import { expect, test } from '@playwright/test';
import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

test('issue list infinite scroll loads more issues', async ({ page }) => {
  const prefix = `PaginationTest_${Date.now()}`;

  // Create more than IssueList's page size (30) so the second page exists.
  const newIssues = Array.from({ length: 31 }).map((_, i) => ({
    title: `${prefix} Issue ${i + 1}`,
    description: 'Test issue for pagination',
    status: 'todo',
    priority: 'low',
  }));

  const { error } = await supabase.from('issues').insert(newIssues);
  expect(error).toBeNull();

  await page.goto('/');
  // Wait for the issue list to load
  await page.waitForSelector('.shell-pad');

  // Wait for the first issue to be rendered
  await expect(page.getByText(`${prefix} Issue 1`).first()).toBeVisible();

  // Scroll the trigger into view
  const trigger = page.locator('.h-4.w-full');
  await trigger.scrollIntoViewIfNeeded();

  // All 31 test-created issues should be visible after scrolling past the
  // first page boundary (page size 30 + cursor-paginated next page).
  await expect(async () => {
    const count = await page.getByText(new RegExp(`${prefix} Issue \\d+`)).count();
    expect(count).toBeGreaterThanOrEqual(31);
  }).toPass({ timeout: 10_000 });
});

test('comment list load more button loads older comments', async ({ page }) => {
  const prefix = `PaginationTest_${Date.now()}`;

  // Create an issue
  const { data: issue, error: issueError } = await supabase
    .from('issues')
    .insert({
      title: `${prefix} Comment Pagination`,
      description: 'Test issue for comment pagination',
      status: 'todo',
      priority: 'low',
    })
    .select()
    .single();
    
  expect(issueError).toBeNull();

  // We need an author for comments. Let's fetch the first user.
  const { data: users, error: usersError } = await supabase.from('users').select('id').limit(1);
  expect(usersError).toBeNull();
  if (!users || users.length === 0) throw new Error('No users available for comment pagination test');
  const authorId = users[0].id;

  // Exceed IssueComments' page size (30) by one so a second page exists.
  const newComments = Array.from({ length: 31 }).map((_, i) => ({
    issue_id: issue.id,
    author_id: authorId,
    body: `${prefix} Comment ${i + 1}`,
  }));

  const { error: commentsError } = await supabase.from('comments').insert(newComments);
  expect(commentsError).toBeNull();

  await page.goto(`/issues/${issue.id}`);

  // Exactly one page's worth of comments should be visible initially.
  await expect(page.getByText(new RegExp(`${prefix} Comment \\d+`))).toHaveCount(30);

  const loadMoreBtn = page.getByRole('button', { name: 'Load more comments' });
  await expect(loadMoreBtn).toBeVisible();

  await loadMoreBtn.click();

  // After clicking, all 31 should be visible.
  await expect(page.getByText(new RegExp(`${prefix} Comment \\d+`))).toHaveCount(31);
});
