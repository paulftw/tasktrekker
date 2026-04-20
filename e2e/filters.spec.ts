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

test('label filter options are searchable', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const labelTrigger = page.getByRole('button', { name: /^Label/i });
  await expect(labelTrigger).toBeVisible();
  await labelTrigger.click();

  const labelMenu = page.locator('[role="menu"]');
  await expect(labelMenu).toBeVisible();

  const searchInput = page.getByRole('textbox', { name: 'Search labels' });
  await expect(searchInput).toBeFocused();
  await searchInput.fill('doc');

  await expect(labelMenu.getByRole('menuitemcheckbox', { name: 'docs' })).toBeVisible();
  await expect(labelMenu.getByRole('menuitemcheckbox', { name: 'bug' })).toHaveCount(0);

  await labelMenu.getByRole('menuitemcheckbox', { name: 'docs' }).click();
  await expect(page).toHaveURL(/\?.*label=docs/);
  await expect(page.getByRole('button', { name: /^docs/i })).toBeVisible();
});

// Known flake in full-suite runs: pagination.spec.ts seeds 21+ unassigned
// issues newer than the seed, pushing Alice's 2 seeded issues off the first
// page (page size 20). Filter logic is correct — passes in isolation and when
// pagination.spec.ts is excluded. Real fix is pagination-spec cleanup.
test('assignee filter supports unassigned and selected users together', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const assigneeTrigger = page.getByRole('button', { name: /^Assignee/i });
  await expect(assigneeTrigger).toBeVisible();
  await assigneeTrigger.click();

  const assigneeMenu = page.locator('[role="menu"]');
  await expect(assigneeMenu).toBeVisible();

  await assigneeMenu.getByRole('menuitemcheckbox', { name: 'Unassigned' }).click();
  await expect(page).toHaveURL(/\?.*assignee=unassigned/);

  const issueLinks = page.locator('a[href^="/issues/"]');
  const totalAfterUnassigned = await issueLinks.count();
  expect(totalAfterUnassigned).toBeGreaterThan(0);
  for (let i = 0; i < totalAfterUnassigned; i++) {
    await expect(issueLinks.nth(i)).toHaveAccessibleName(/Unassigned/);
  }

  const searchInput = page.getByRole('textbox', { name: 'Search assignees' });
  await searchInput.fill('alice');
  await assigneeMenu.getByRole('menuitemcheckbox', { name: 'Alice Johnson' }).click();

  const totalAfterBoth = await issueLinks.count();
  expect(totalAfterBoth).toBeGreaterThanOrEqual(totalAfterUnassigned);
  await expect(page.getByRole('link', { name: /Alice Johnson/ }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: /Unassigned/ }).first()).toBeVisible();
  for (let i = 0; i < totalAfterBoth; i++) {
    await expect(issueLinks.nth(i)).toHaveAccessibleName(/Alice Johnson|Unassigned/);
  }
});

test('assignee filter shows assigned to me shortcut only before searching', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  const assigneeTrigger = page.getByRole('button', { name: /^Assignee/i });
  await expect(assigneeTrigger).toBeVisible();
  await assigneeTrigger.click();

  const assigneeMenu = page.locator('[role="menu"]');
  await expect(assigneeMenu).toBeVisible();

  const searchInput = page.getByRole('textbox', { name: 'Search assignees' });
  const assignedToMe = assigneeMenu.getByRole('menuitemcheckbox', { name: 'Assigned to me' });
  const assigneeItems = assigneeMenu.getByRole('menuitemcheckbox');
  const specialSeparator = assigneeMenu.getByRole('separator');

  await expect(assignedToMe).toBeVisible();
  await expect(assigneeItems.first()).toContainText('Assigned to me');
  await expect(assigneeItems.nth(1)).toContainText('Unassigned');
  await expect(specialSeparator).toBeVisible();

  await searchInput.fill('ali');
  await expect(assignedToMe).toHaveCount(0);
  await expect(specialSeparator).toHaveCount(0);
  await expect(assigneeMenu.getByRole('menuitemcheckbox', { name: 'Alice Johnson' })).toBeVisible();

  await searchInput.clear();
  await assignedToMe.click();
  await expect(page).toHaveURL(/\?.*assignee=/);
  await expect(page.getByRole('link', { name: /Alice Johnson/ }).first()).toBeVisible();
});
