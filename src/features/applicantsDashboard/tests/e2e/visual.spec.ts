import { test, expect } from '@playwright/test';

test.describe('Applicants Dashboard Visual & Layout Tests', () => {
  test('Dashboard loads and matches visual snapshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('h2:has-text("Applications Dashboard")');
    await expect(page).toHaveScreenshot('dashboard-visual.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.05,
    });
  });
});
