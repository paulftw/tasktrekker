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
  
  // We create 21 issues to ensure we exceed the 20 items limit
  const newIssues = Array.from({ length: 21 }).map((_, i) => ({
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

  // Verify that the 21st issue is loaded eventually
  // Note: we created them in bulk, the ordering by created_at might be arbitrary if timestamps are identical
  // However, pg_graphql will return 20, and the 21st will be on page 2.
  // We can just verify that 21 instances of the prefix exist in the page.
  await expect(async () => {
    const count = await page.getByText(new RegExp(`${prefix} Issue \\d+`)).count();
    expect(count).toBeGreaterThanOrEqual(21);
  }).toPass({ timeout: 5000 });
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
  const authorId = users[0].id;

  // Create 11 comments
  const newComments = Array.from({ length: 11 }).map((_, i) => ({
    issue_id: issue.id,
    author_id: authorId,
    body: `${prefix} Comment ${i + 1}`,
  }));

  const { error: commentsError } = await supabase.from('comments').insert(newComments);
  expect(commentsError).toBeNull();

  await page.goto(`/issues/${issue.id}`);

  // Exactly 10 comments should be visible initially (our page size)
  await expect(page.getByText(new RegExp(`${prefix} Comment \\d+`))).toHaveCount(10);

  const loadMoreBtn = page.getByRole('button', { name: 'Load more comments' });
  await expect(loadMoreBtn).toBeVisible();
  
  await loadMoreBtn.click();
  
  // All 11 comments should become visible
  await expect(page.getByText(new RegExp(`${prefix} Comment \\d+`))).toHaveCount(11);
});
