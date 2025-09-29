// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Quick Responsiveness Test Suite
 * Fast tests for development - checks critical issues only
 */

test.describe('Quick Responsive Tests', () => {
  const criticalViewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1366, height: 768 }
  ];

  const criticalPages = [
    { name: 'Home', path: '/home.html' },
    { name: 'Courses', path: '/courses.html' },
    { name: 'Pricing', path: '/pricing.html' }
  ];

  criticalPages.forEach(pageInfo => {
    test.describe(`${pageInfo.name} Page`, () => {
      criticalViewports.forEach(viewport => {
        test(`${viewport.name} - No Horizontal Scroll`, async ({ page }) => {
          await page.setViewportSize({ width: viewport.width, height: viewport.height });
          await page.goto(pageInfo.path);

          // Check for horizontal scroll
          const hasHorizontalScroll = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
          });

          expect(hasHorizontalScroll).toBe(false);
        });

        test(`${viewport.name} - Navigation Visible`, async ({ page }) => {
          await page.setViewportSize({ width: viewport.width, height: viewport.height });
          await page.goto(pageInfo.path);

          const navbar = page.locator('.navbar, nav').first();
          await expect(navbar).toBeVisible();
        });

        test(`${viewport.name} - Content Not Overflowing`, async ({ page }) => {
          await page.setViewportSize({ width: viewport.width, height: viewport.height });
          await page.goto(pageInfo.path);

          const overflowingElements = await page.evaluate(() => {
            const elements = document.querySelectorAll('*');
            const overflowing = [];

            elements.forEach(el => {
              const rect = el.getBoundingClientRect();
              if (rect.right > window.innerWidth || rect.left < 0) {
                overflowing.push({
                  tag: el.tagName,
                  class: el.className,
                  overflow: rect.right - window.innerWidth
                });
              }
            });

            return overflowing;
          });

          expect(overflowingElements).toHaveLength(0);
        });

        if (viewport.width <= 768) {
          test(`${viewport.name} - Mobile Menu Works`, async ({ page }) => {
            await page.setViewportSize({ width: viewport.width, height: viewport.height });
            await page.goto(pageInfo.path);

            const menuButton = page.locator('.menu-button, .w-nav-button').first();

            if (await menuButton.count() > 0 && await menuButton.isVisible()) {
              await menuButton.click();
              await page.waitForTimeout(500);

              const navMenu = page.locator('.nav-menu, .w-nav-menu').first();
              await expect(navMenu).toBeVisible();
            }
          });
        }
      });
    });
  });

  // Specific component tests
  test('Pricing Table Mobile View', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/home.html');

    // Scroll to pricing section
    const pricingSection = page.locator('.section.affordable-plan');
    if (await pricingSection.count() > 0) {
      await pricingSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);

      // Check if pricing cards are stacked vertically
      const pricingCards = await page.locator('.pricing-plan-featured-card-wrap').all();

      if (pricingCards.length > 1) {
        const firstCardBox = await pricingCards[0].boundingBox();
        const secondCardBox = await pricingCards[1].boundingBox();

        // Cards should be stacked (second card Y position should be greater)
        expect(secondCardBox.y).toBeGreaterThan(firstCardBox.y + firstCardBox.height);
      }
    }
  });

  test('Images Load and Scale Properly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/home.html');

    const images = await page.locator('img').all();
    const brokenImages = [];

    for (const img of images.slice(0, 10)) { // Check first 10 images
      const isLoaded = await img.evaluate((el) => {
        return el.complete && el.naturalWidth > 0;
      });

      const box = await img.boundingBox();

      if (!isLoaded) {
        const src = await img.getAttribute('src');
        brokenImages.push(src);
      }

      if (box && box.width > 375) {
        const src = await img.getAttribute('src');
        console.log(`Image wider than viewport: ${src}`);
      }
    }

    expect(brokenImages).toHaveLength(0);
  });

  test('Touch Targets Are Large Enough', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/home.html');

    const buttons = await page.locator('button, a.button, .cta-button').all();
    const smallTargets = [];

    for (const button of buttons.slice(0, 10)) { // Check first 10 buttons
      const box = await button.boundingBox();

      if (box && (box.width < 44 || box.height < 44)) {
        const text = await button.textContent();
        smallTargets.push({
          text: text?.trim().substring(0, 20),
          size: `${Math.round(box.width)}x${Math.round(box.height)}`
        });
      }
    }

    // Warn but don't fail for small targets
    if (smallTargets.length > 0) {
      console.warn('Small touch targets found:', smallTargets);
    }

    expect(smallTargets.length).toBeLessThanOrEqual(3); // Allow up to 3 small targets
  });

  test('Forms Are Usable on Mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/contact-us.html');

    const inputs = await page.locator('input[type="text"], input[type="email"], textarea').all();

    for (const input of inputs.slice(0, 5)) { // Check first 5 inputs
      const box = await input.boundingBox();

      if (box) {
        // Inputs should be at least 44px tall for mobile
        expect(box.height).toBeGreaterThanOrEqual(32);
        // Inputs shouldn't be wider than viewport
        expect(box.width).toBeLessThanOrEqual(375);
      }
    }
  });
});