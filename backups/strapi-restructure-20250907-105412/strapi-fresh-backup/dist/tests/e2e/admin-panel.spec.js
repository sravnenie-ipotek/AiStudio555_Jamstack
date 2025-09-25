"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
test_1.test.describe('Strapi Admin Panel', () => {
    test_1.test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000/admin');
    });
    (0, test_1.test)('should load admin panel without Vite errors', async ({ page }) => {
        const consoleErrors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
            }
        });
        page.on('pageerror', error => {
            consoleErrors.push(error.message);
        });
        await page.waitForTimeout(3000);
        const viteErrors = consoleErrors.filter(error => error.includes('504') ||
            error.includes('vite') ||
            error.includes('Failed to fetch'));
        (0, test_1.expect)(viteErrors).toHaveLength(0);
    });
    (0, test_1.test)('should display login form', async ({ page }) => {
        await (0, test_1.expect)(page.locator('form')).toBeVisible({ timeout: 10000 });
        await (0, test_1.expect)(page.locator('input[name="email"], input[type="email"]')).toBeVisible();
        await (0, test_1.expect)(page.locator('input[name="password"], input[type="password"]')).toBeVisible();
    });
    (0, test_1.test)('should have correct page title', async ({ page }) => {
        await (0, test_1.expect)(page).toHaveTitle(/Strapi/i, { timeout: 10000 });
    });
    (0, test_1.test)('should not have any network errors', async ({ page }) => {
        const failedRequests = [];
        page.on('requestfailed', request => {
            var _a;
            failedRequests.push(`${request.url()} - ${(_a = request.failure()) === null || _a === void 0 ? void 0 : _a.errorText}`);
        });
        await page.waitForTimeout(3000);
        (0, test_1.expect)(failedRequests).toHaveLength(0);
    });
    (0, test_1.test)('should have responsive viewport', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await (0, test_1.expect)(page.locator('form')).toBeVisible();
        await page.setViewportSize({ width: 1920, height: 1080 });
        await (0, test_1.expect)(page.locator('form')).toBeVisible();
    });
});
