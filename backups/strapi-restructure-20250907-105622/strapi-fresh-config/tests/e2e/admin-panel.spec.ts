import { test, expect } from '@playwright/test';

test.describe('Strapi Admin Panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:1337/admin');
  });

  test('should load admin panel without Vite errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('pageerror', error => {
      consoleErrors.push(error.message);
    });

    await page.waitForTimeout(3000);

    const viteErrors = consoleErrors.filter(error => 
      error.includes('504') || 
      error.includes('vite') || 
      error.includes('Failed to fetch')
    );

    expect(viteErrors).toHaveLength(0);
  });

  test('should display login form', async ({ page }) => {
    await expect(page.locator('form')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('input[name="email"], input[type="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"], input[type="password"]')).toBeVisible();
  });

  test('should have correct page title', async ({ page }) => {
    await expect(page).toHaveTitle(/Strapi/i, { timeout: 10000 });
  });

  test('should not have any network errors', async ({ page }) => {
    const failedRequests: string[] = [];
    
    page.on('requestfailed', request => {
      failedRequests.push(`${request.url()} - ${request.failure()?.errorText}`);
    });

    await page.waitForTimeout(3000);
    
    expect(failedRequests).toHaveLength(0);
  });

  test('should have responsive viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('form')).toBeVisible();
    
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('form')).toBeVisible();
  });
});