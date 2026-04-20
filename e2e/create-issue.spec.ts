import { expect, test } from '@playwright/test';

// Create issue end-to-end: opens from the real topbar button, submits through
// the modal, navigates to the new detail route, and shows the created fields.

test('topbar new issue modal creates an issue and lands on detail', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  await page.getByRole('button', { name: 'New issue' }).click();

  const dialog = page.getByRole('dialog', { name: 'New issue' });
  await expect(dialog).toBeVisible();

  const title = `E2E Create Issue ${Date.now()}`;
  const description = `Created by Playwright at ${new Date().toISOString()}`;

  await dialog.getByRole('textbox', { name: 'Issue title' }).fill(title);
  await dialog.getByRole('textbox', { name: 'Issue description' }).fill(description);

  await dialog.getByRole('button', { name: 'Medium' }).click();
  await page.locator('[role="menu"]').getByRole('menuitem', { name: 'High' }).click();

  await dialog.getByRole('button', { name: 'Add label' }).click();
  const labelMenu = page.locator('[role="menu"]');
  await expect(labelMenu).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Search labels' })).toBeFocused();
  await labelMenu.getByRole('menuitem', { name: /bug/i }).click();

  await dialog.getByRole('button', { name: 'Create issue' }).click();

  await page.waitForURL(/\/issues\/\d+$/);

  await expect(page.getByRole('button', { name: 'Edit title' })).toContainText(title);
  await expect(page.getByRole('button', { name: 'Edit description' })).toContainText(description);
  await expect(page.getByRole('button', { name: /status:\s*todo\.\s*click to change\./i })).toBeVisible();
  await expect(page.getByRole('button', { name: /priority:\s*high\.\s*click to change\./i })).toBeVisible();
  await expect(page.getByRole('button', { name: /label:\s*bug\.\s*click for options\./i })).toBeVisible();

  await page.getByRole('button', { name: 'Add label' }).click();
  const sidebarLabelMenu = page.locator('[role="menu"]');
  const sidebarSearch = page.getByRole('textbox', { name: 'Search labels' });
  await expect(sidebarSearch).toBeFocused();
  await sidebarSearch.fill('feat');
  await sidebarLabelMenu.getByRole('menuitem', { name: /feature/i }).click();

  const featurePill = page.getByRole('button', { name: /label:\s*feature\.\s*click for options\./i });
  await expect(featurePill).toBeVisible();

  await featurePill.click();
  await page.locator('[role="menu"]').getByRole('menuitem', { name: /remove feature/i }).click();
  await expect(page.getByRole('button', { name: /label:\s*feature\.\s*click for options\./i })).toHaveCount(0);
});
