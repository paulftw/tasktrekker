import { expect, test } from '@playwright/test';

// Golden path: list page renders, clicking an issue navigates to detail,
// changing status via the picker persists and the icon reflects it. Proves
// the end-to-end wiring — Relay fetch, route param parsing, mutation commit,
// optimistic update, store re-read — without asserting any specific seed row.

test('list → issue detail → change status', async ({ page }) => {
  await page.goto('/');

  const firstIssueLink = page.locator("a[href^='/issues/']").first();
  await expect(firstIssueLink).toBeVisible();
  await firstIssueLink.click();
  await page.waitForURL(/\/issues\/\d+/);

  const statusButton = page.getByRole('button', {
    name: /status:.*click to change/i,
  });
  await expect(statusButton).toBeVisible();

  const initialLabel = (await statusButton.getAttribute('aria-label')) ?? '';
  const initialStatus =
    initialLabel
      .match(/status:\s*([^.]+)\./i)?.[1]
      ?.trim()
      .toLowerCase() ?? '';

  const target = initialStatus === 'in progress' ? 'Todo' : 'In Progress';
  const targetItem = page.getByRole('menuitem', { name: new RegExp(`^${target}$`, 'i') });

  for (let attempt = 0; attempt < 3; attempt += 1) {
    await statusButton.click();
    try {
      await expect(targetItem).toBeVisible({ timeout: 2_000 });
      break;
    } catch (error) {
      if (attempt === 2) throw error;
    }
  }

  await targetItem.click();

  await expect(statusButton).toHaveAttribute('aria-label', new RegExp(`status:\\s*${target}\\.`, 'i'));
});

test('list → issue detail → add comment', async ({ page }) => {
  await page.goto('/');

  const firstIssueLink = page.locator("a[href^='/issues/']").first();
  await expect(firstIssueLink).toBeVisible();
  await firstIssueLink.click();
  await page.waitForURL(/\/issues\/\d+/);

  const commentInput = page.locator('textarea[placeholder="Leave a comment..."]');
  await expect(commentInput).toBeVisible();

  const stamp = `E2E Comment ${Date.now()}`;
  await commentInput.fill(stamp);

  const commentButton = page.getByRole('button', { name: 'Comment' });
  await commentButton.click();

  // Wait for it to appear in the comments list
  const newComment = page.getByText(stamp);
  await expect(newComment).toBeVisible();
});
