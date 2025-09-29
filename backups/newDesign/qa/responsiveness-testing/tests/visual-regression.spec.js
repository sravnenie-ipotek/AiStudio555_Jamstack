// @ts-check
const { test, expect } = require('@playwright/test');
const testPages = require('../config/test-pages.json');
const fs = require('fs-extra');
const path = require('path');

/**
 * Visual Regression Testing Suite
 * Captures screenshots and compares them against baseline images
 */

const VISUAL_THRESHOLD = 0.01; // 1% difference threshold

test.describe('Visual Regression Tests', () => {
  test.describe.configure({ mode: 'parallel' });

  // Test critical pages at key breakpoints
  const criticalTests = [
    { page: 'Home', path: '/home.html', viewports: [
      { width: 1920, height: 1080, name: 'desktop' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 375, height: 667, name: 'mobile' }
    ]},
    { page: 'Courses', path: '/courses.html', viewports: [
      { width: 1920, height: 1080, name: 'desktop' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 375, height: 667, name: 'mobile' }
    ]},
    { page: 'Pricing', path: '/pricing.html', viewports: [
      { width: 1920, height: 1080, name: 'desktop' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 375, height: 667, name: 'mobile' }
    ]}
  ];

  criticalTests.forEach(({ page: pageName, path: pagePath, viewports }) => {
    viewports.forEach(viewport => {
      test(`Visual: ${pageName} - ${viewport.name} (${viewport.width}x${viewport.height})`, async ({ page }) => {
        // Set viewport
        await page.setViewportSize({ width: viewport.width, height: viewport.height });

        // Navigate to page
        await page.goto(pagePath, { waitUntil: 'networkidle' });

        // Wait for animations and lazy-loaded content
        await page.waitForTimeout(2000);

        // Hide dynamic content that changes frequently
        await page.evaluate(() => {
          // Hide timestamps, random numbers, etc.
          const dynamicSelectors = ['.timestamp', '.random-content', '.date-display'];
          dynamicSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
              el.style.visibility = 'hidden';
            });
          });
        });

        // Create directory structure for screenshots
        const baselineDir = path.join('screenshots', 'baseline', pageName.toLowerCase());
        const currentDir = path.join('screenshots', 'current', pageName.toLowerCase());
        const diffDir = path.join('screenshots', 'diff', pageName.toLowerCase());

        await fs.ensureDir(baselineDir);
        await fs.ensureDir(currentDir);
        await fs.ensureDir(diffDir);

        const screenshotName = `${viewport.name}-${viewport.width}x${viewport.height}.png`;
        const baselinePath = path.join(baselineDir, screenshotName);
        const currentPath = path.join(currentDir, screenshotName);

        // Take screenshot
        await page.screenshot({
          path: currentPath,
          fullPage: true,
          animations: 'disabled'
        });

        // If baseline doesn't exist, create it
        if (!await fs.pathExists(baselinePath)) {
          await fs.copy(currentPath, baselinePath);
          console.log(`📸 Created baseline for ${pageName} - ${viewport.name}`);
        } else {
          // Compare with baseline using Playwright's built-in comparison
          await expect(page).toHaveScreenshot(screenshotName, {
            fullPage: true,
            maxDiffPixelRatio: VISUAL_THRESHOLD,
            animations: 'disabled'
          });
        }
      });
    });
  });

  // Test specific components across viewports
  test.describe('Component Visual Tests', () => {
    const componentTests = [
      { name: 'Navigation', selector: '.navbar', page: '/home.html' },
      { name: 'Pricing Table', selector: '.pricing-plan-content', page: '/home.html' },
      { name: 'Course Card', selector: '.course-card:first-child', page: '/courses.html' },
      { name: 'Footer', selector: '.footer', page: '/home.html' }
    ];

    componentTests.forEach(({ name, selector, page: pagePath }) => {
      test(`Component: ${name}`, async ({ page }) => {
        // Test at multiple viewports
        const viewports = [
          { width: 1920, height: 1080, name: 'desktop' },
          { width: 375, height: 667, name: 'mobile' }
        ];

        for (const viewport of viewports) {
          await page.setViewportSize({ width: viewport.width, height: viewport.height });
          await page.goto(pagePath, { waitUntil: 'networkidle' });
          await page.waitForTimeout(1000);

          const element = await page.locator(selector).first();

          if (await element.count() > 0) {
            const screenshotDir = path.join('screenshots', 'components', name.toLowerCase().replace(/\s+/g, '-'));
            await fs.ensureDir(screenshotDir);

            await element.screenshot({
              path: path.join(screenshotDir, `${viewport.name}.png`)
            });
          }
        }
      });
    });
  });

  // Test language switching visual consistency
  test('Language Switching Visual Consistency', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/home.html', { waitUntil: 'networkidle' });

    const languages = ['EN', 'RU', 'HE'];
    const screenshotDir = path.join('screenshots', 'languages');
    await fs.ensureDir(screenshotDir);

    for (const lang of languages) {
      // Click language pill
      const langPill = page.locator(`.lang-pill:has-text("${lang}")`);
      if (await langPill.count() > 0) {
        await langPill.click();
        await page.waitForTimeout(2000); // Wait for translation to complete

        await page.screenshot({
          path: path.join(screenshotDir, `home-${lang.toLowerCase()}.png`),
          fullPage: false, // Just viewport for consistency
          clip: { x: 0, y: 0, width: 1920, height: 1080 }
        });
      }
    }
  });

  // Test dark mode if available
  test('Dark Mode Visual Test', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/home.html', { waitUntil: 'networkidle' });

    // Check if dark mode toggle exists
    const darkModeToggle = page.locator('.dark-mode-toggle, .theme-toggle, [data-theme-toggle]');

    if (await darkModeToggle.count() > 0) {
      // Light mode screenshot
      await page.screenshot({
        path: path.join('screenshots', 'theme', 'light-mode.png'),
        fullPage: false
      });

      // Toggle to dark mode
      await darkModeToggle.click();
      await page.waitForTimeout(1000);

      // Dark mode screenshot
      await page.screenshot({
        path: path.join('screenshots', 'theme', 'dark-mode.png'),
        fullPage: false
      });
    }
  });
});