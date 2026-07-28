import { test, expect } from '@playwright/test';

test.describe('Application Form Visual & Step-by-Step E2E Tests', () => {
  test('Application form step 1 renders and matches visual snapshot', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("Start Application")');
    await page.waitForSelector('h1:has-text("Student Application Portal")');
    await expect(page).toHaveScreenshot('form-step1-visual.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.05,
    });
  });
});
