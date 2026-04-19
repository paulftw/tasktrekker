import { expect, test } from '@playwright/test';

test('filters update URL and issue list', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Wait for the issue list to load
  const priorityTrigger = page.getByRole('button', { name: /^Priority/i });
  await expect(priorityTrigger).toBeVisible();

  // Click the Priority filter trigger
  await priorityTrigger.click();

  // Click the High priority checkbox
  const priorityMenu = page.locator('[role="menu"]');
  await expect(priorityMenu).toBeVisible();
  await priorityMenu.getByRole('menuitemcheckbox', { name: 'High' }).click();

  // It should update the URL
  await expect(page).toHaveURL(/\?.*priority=high/);

  // Now test Labels
  const labelTrigger = page.getByRole('button', { name: /^Label/i });
  await expect(labelTrigger).toBeVisible();

  await labelTrigger.click();
  
  // Click the first label
  const labelMenu = page.locator('[role="menu"]');
  await expect(labelMenu).toBeVisible();
  const firstLabel = labelMenu.getByRole('menuitemcheckbox').first();
  const labelName = await firstLabel.textContent() || '';
  await firstLabel.click();

  await expect(page).toHaveURL(new RegExp(`label=${encodeURIComponent(labelName.trim())}`, 'i'));
  
  // Close label menu
  await page.keyboard.press('Escape');

  // Now test Status
  const statusTrigger = page.getByRole('button', { name: /^Status/i });
  await expect(statusTrigger).toBeVisible();

  await statusTrigger.click();

  // Click 'Todo' and 'In Progress'
  const statusMenu = page.locator('[role="menu"]');
  await expect(statusMenu).toBeVisible();
  await statusMenu.getByRole('menuitemcheckbox', { name: 'Todo' }).click();
  await expect(page).toHaveURL(/\?.*status=todo/);
  await statusMenu.getByRole('menuitemcheckbox', { name: 'In Progress' }).click();
  await expect(page).toHaveURL(/\?.*status=todo&status=in_progress/);
  
  // Close the menu by pressing Escape
  await page.keyboard.press('Escape');

  // Check URL
  await expect(page).toHaveURL(/\?.*status=todo/);
  await expect(page).toHaveURL(/\?.*status=in_progress/);

  // Assert that 'Backlog', 'Done', 'Cancelled' sections are hidden
  await expect(page.getByRole('button', { name: 'Backlog' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Done' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Cancelled' })).toHaveCount(0);
  
  // Assert 'Todo' and 'In Progress' sections are visible
  await expect(page.getByRole('button', { name: 'Todo' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'In Progress' })).toBeVisible();
});
