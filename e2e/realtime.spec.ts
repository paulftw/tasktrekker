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

test('realtime: label add/remove in window A propagates to window B', async ({ browser }) => {
  const ctxA = await browser.newContext();
  const ctxB = await browser.newContext();
  const pageA = await ctxA.newPage();
  const pageB = await ctxB.newPage();

  // Navigate to the first issue's detail page in both windows.
  await pageA.goto('/');
  const firstLink = pageA.locator("a[href^='/issues/']").first();
  await expect(firstLink).toBeVisible();
  const href = await firstLink.getAttribute('href');
  if (!href) throw new Error('no issue link on list');

  await Promise.all([pageA.goto(href), pageB.goto(href)]);

  // Wait for both pages to fully load the sidebar.
  const addLabelA = pageA.getByRole('button', { name: /^add label$/i });
  await expect(addLabelA).toBeVisible();
  await expect(pageB.getByRole('button', { name: /^add label$/i })).toBeVisible();

  // Give B's realtime channel time to subscribe.
  await pageB.waitForTimeout(1500);

  // --- Phase 1: Add a label in A, assert it appears in B ---

  // Open the label picker and grab the first available (unselected) label.
  // Skip the "Create new label" action item.
  await addLabelA.click();
  const labelItems = pageA.locator('[role="menuitem"]').filter({ hasNotText: /create new label/i });
  const firstLabelItem = labelItems.first();
  await expect(firstLabelItem).toBeVisible();
  const labelName = (await firstLabelItem.textContent())?.trim();
  if (!labelName) throw new Error('no available label to add');

  // Escape regex special chars in the label name for safe use in RegExp.
  const escaped = labelName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  await firstLabelItem.click();

  // The label pill should appear in A's sidebar.
  const pillA = pageA.getByRole('button', { name: new RegExp(`label:\\s*${escaped}`, 'i') });
  await expect(pillA).toBeVisible();

  // Assert it propagates to B (via Supabase Realtime → refetch).
  const pillB = pageB.getByRole('button', { name: new RegExp(`label:\\s*${escaped}`, 'i') });
  await expect(pillB).toBeVisible({ timeout: 10_000 });

  // --- Phase 2: Remove the label in A, assert it disappears from B ---

  // Click the pill to open its dropdown, then click "Remove label".
  await pillA.click();
  const removeItem = pageA.getByRole('menuitem', { name: /remove label/i });
  await expect(removeItem).toBeVisible();
  await removeItem.click();

  // The pill should disappear from A.
  await expect(pillA).not.toBeVisible();

  // Assert it disappears from B (via Supabase Realtime → refetch).
  await expect(pillB).not.toBeVisible({ timeout: 10_000 });

  await ctxA.close();
  await ctxB.close();
});
