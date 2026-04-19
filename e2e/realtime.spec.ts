import { expect, test } from '@playwright/test';

// Two-session realtime: window A changes status, window B reflects it without
// reload. Two browser contexts = two independent Supabase Realtime clients on
// the same page. Proves the channel subscription is live and the refetch hook
// pipes the change into the Relay store.

test('realtime: status change in window A propagates to window B', async ({ browser }) => {
  const ctxA = await browser.newContext();
  const ctxB = await browser.newContext();
  const pageA = await ctxA.newPage();
  const pageB = await ctxB.newPage();

  await pageA.goto('/');
  const firstLink = pageA.locator("a[href^='/issues/']").first();
  await expect(firstLink).toBeVisible();
  const href = await firstLink.getAttribute('href');
  if (!href) throw new Error('no issue link on list');

  await Promise.all([pageA.goto(href), pageB.goto(href)]);

  const buttonA = pageA.getByRole('button', {
    name: /status:.*click to change/i,
  });
  const buttonB = pageB.getByRole('button', {
    name: /status:.*click to change/i,
  });
  await expect(buttonA).toBeVisible();
  await expect(buttonB).toBeVisible();

  // Give both clients' realtime channels a moment to subscribe before A
  // commits the mutation. Without this, B can miss the broadcast.
  await pageB.waitForTimeout(1500);

  const initial = (await buttonB.getAttribute('aria-label')) ?? '';
  const target = /in progress/i.test(initial) ? 'Todo' : 'In Progress';

  await buttonA.click();
  await pageA
    .locator('[role="menu"]')
    .getByRole('menuitem', { name: new RegExp(`^${target}$`, 'i') })
    .click();

  await expect(buttonB).toHaveAttribute('aria-label', new RegExp(`status:\\s*${target}\\.`, 'i'), { timeout: 10_000 });

  await ctxA.close();
  await ctxB.close();
});

test('realtime: add comment in window A propagates to window B', async ({ browser }) => {
  const ctxA = await browser.newContext();
  const ctxB = await browser.newContext();
  const pageA = await ctxA.newPage();
  const pageB = await ctxB.newPage();

  await pageA.goto('/');
  const firstLink = pageA.locator("a[href^='/issues/']").first();
  await expect(firstLink).toBeVisible();
  const href = await firstLink.getAttribute('href');
  if (!href) throw new Error('no issue link on list');

  await Promise.all([pageA.goto(href), pageB.goto(href)]);

  const inputA = pageA.locator('textarea[placeholder="Leave a comment..."]');
  await expect(inputA).toBeVisible();

  // Give both clients' realtime channels a moment to subscribe
  await pageB.waitForTimeout(1500);

  const stamp = `Realtime Comment ${Date.now()}`;
  await inputA.fill(stamp);
  await pageA.getByRole('button', { name: 'Comment' }).click();

  // Wait for it to appear in A
  const newCommentA = pageA.getByText(stamp);
  await expect(newCommentA).toBeVisible();

  // Assert it propagates to B
  const newCommentB = pageB.getByText(stamp);
  await expect(newCommentB).toBeVisible({ timeout: 10_000 });

  await ctxA.close();
  await ctxB.close();
});
