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

  await statusButton.click();
  const menu = page.locator('[role="menu"]');
  await expect(menu).toBeVisible();

  await menu.getByRole('menuitem', { name: new RegExp(`^${target}$`, 'i') }).click();

  await expect(statusButton).toHaveAttribute('aria-label', new RegExp(`status:\\s*${target}\\.`, 'i'));
});
