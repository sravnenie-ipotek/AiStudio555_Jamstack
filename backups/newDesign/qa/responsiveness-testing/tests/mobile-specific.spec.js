// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Mobile-Specific Testing Suite
 * Tests mobile-specific functionality and edge cases
 */

test.describe('Mobile-Specific Tests', () => {
  test.use({
    viewport: { width: 375, height: 667 },
    hasTouch: true,
    isMobile: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15'
  });

  test('Mobile Navigation Menu', async ({ page }) => {
    await page.goto('/home.html');

    // Menu button should be visible
    const menuButton = page.locator('.menu-button, .w-nav-button').first();
    await expect(menuButton).toBeVisible();

    // Click to open menu
    await menuButton.tap();
    await page.waitForTimeout(500);

    // Menu should be visible
    const navMenu = page.locator('.nav-menu, .w-nav-menu').first();
    await expect(navMenu).toBeVisible();

    // Menu links should be visible and clickable
    const menuLinks = await navMenu.locator('a').all();
    expect(menuLinks.length).toBeGreaterThan(0);

    // Check if menu items are stacked vertically
    if (menuLinks.length > 1) {
      const firstBox = await menuLinks[0].boundingBox();
      const secondBox = await menuLinks[1].boundingBox();

      // Items should be stacked vertically
      expect(secondBox.y).toBeGreaterThanOrEqual(firstBox.y + firstBox.height);
    }

    // Close menu
    await menuButton.tap();
    await page.waitForTimeout(500);
    await expect(navMenu).not.toBeVisible();
  });

  test('Touch Gestures - Swipe Carousel', async ({ page }) => {
    await page.goto('/home.html');

    // Find carousel/slider if exists
    const slider = page.locator('.w-slider, .swiper, .carousel').first();

    if (await slider.count() > 0) {
      const sliderBox = await slider.boundingBox();

      if (sliderBox) {
        // Simulate swipe gesture
        await page.touchscreen.tap(sliderBox.x + sliderBox.width / 2, sliderBox.y + sliderBox.height / 2);
        await page.touchscreen.swipe({
          start: { x: sliderBox.x + sliderBox.width - 50, y: sliderBox.y + sliderBox.height / 2 },
          end: { x: sliderBox.x + 50, y: sliderBox.y + sliderBox.height / 2 },
          steps: 10
        });

        await page.waitForTimeout(500);
        // Verify slide changed (implementation specific)
      }
    }
  });

  test('Virtual Keyboard Does Not Break Layout', async ({ page }) => {
    await page.goto('/contact-us.html');

    const input = page.locator('input[type="text"], input[type="email"]').first();

    if (await input.count() > 0) {
      // Get initial viewport height
      const initialHeight = await page.evaluate(() => window.innerHeight);

      // Focus input to trigger virtual keyboard
      await input.tap();
      await page.waitForTimeout(500);

      // Check if layout adjusts properly
      const afterFocusHeight = await page.evaluate(() => window.innerHeight);

      // Layout should either stay the same or adjust smoothly
      // (virtual keyboard simulation varies by environment)
      expect(afterFocusHeight).toBeLessThanOrEqual(initialHeight);

      // Check if input is still visible
      await expect(input).toBeInViewport();
    }
  });

  test('Orientation Change - Portrait to Landscape', async ({ page, context }) => {
    await page.goto('/home.html');

    // Portrait orientation
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    const portraitScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    expect(portraitScroll).toBe(false);

    // Landscape orientation
    await page.setViewportSize({ width: 667, height: 375 });
    await page.waitForTimeout(500);

    const landscapeScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });

    expect(landscapeScroll).toBe(false);

    // Check if navigation adjusts
    const navbar = page.locator('.navbar').first();
    await expect(navbar).toBeVisible();
  });

  test('Small Screen (320px width)', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/home.html');

    // No horizontal scroll
    const hasScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasScroll).toBe(false);

    // Text should be readable
    const headings = await page.locator('h1, h2, h3').all();

    for (const heading of headings.slice(0, 5)) {
      const fontSize = await heading.evaluate(el => {
        return parseInt(window.getComputedStyle(el).fontSize);
      });

      // Minimum readable font size
      expect(fontSize).toBeGreaterThanOrEqual(14);
    }
  });

  test('Mobile Performance - Page Load Time', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/home.html', {
      waitUntil: 'networkidle'
    });

    const loadTime = Date.now() - startTime;

    // Page should load within 5 seconds on mobile
    expect(loadTime).toBeLessThan(5000);

    // Check if critical content is visible
    const heroSection = page.locator('.hero-section, .hero, [class*="hero"]').first();
    if (await heroSection.count() > 0) {
      await expect(heroSection).toBeVisible();
    }
  });

  test('Mobile Forms - Input Types', async ({ page }) => {
    await page.goto('/contact-us.html');

    // Check email input has correct type
    const emailInput = page.locator('input[type="email"]').first();
    if (await emailInput.count() > 0) {
      const inputType = await emailInput.getAttribute('type');
      expect(inputType).toBe('email');
    }

    // Check phone input has correct type
    const phoneInput = page.locator('input[type="tel"], input[name*="phone"]').first();
    if (await phoneInput.count() > 0) {
      const inputType = await phoneInput.getAttribute('type');
      expect(['tel', 'text']).toContain(inputType);
    }

    // Check if autocomplete is set properly
    const nameInput = page.locator('input[name*="name"]').first();
    if (await nameInput.count() > 0) {
      const autocomplete = await nameInput.getAttribute('autocomplete');
      // Should have autocomplete for better UX
      expect(autocomplete).toBeTruthy();
    }
  });

  test('Mobile Pricing Table', async ({ page }) => {
    await page.goto('/home.html');

    // Navigate to pricing section
    const pricingSection = page.locator('.section.affordable-plan');
    if (await pricingSection.count() > 0) {
      await pricingSection.scrollIntoViewIfNeeded();

      // Check if mobile feature lists are visible
      const mobileFeatureLists = await page.locator('.mobile-feature-list').all();

      if (mobileFeatureLists.length > 0) {
        // Mobile-specific feature lists should be visible
        for (const list of mobileFeatureLists) {
          await expect(list).toBeVisible();
        }
      } else {
        // Check if pricing cards are stacked
        const pricingCards = await page.locator('.pricing-plan-featured-card-wrap').all();

        if (pricingCards.length > 1) {
          const firstBox = await pricingCards[0].boundingBox();
          const secondBox = await pricingCards[1].boundingBox();

          // Should be stacked vertically
          expect(secondBox.y).toBeGreaterThan(firstBox.y);
        }
      }
    }
  });

  test('Mobile Language Switcher', async ({ page }) => {
    await page.goto('/home.html');

    // Language pills should be accessible
    const langPills = await page.locator('.lang-pill').all();

    for (const pill of langPills) {
      const box = await pill.boundingBox();

      if (box) {
        // Should be large enough to tap
        expect(box.width).toBeGreaterThanOrEqual(40);
        expect(box.height).toBeGreaterThanOrEqual(32);
      }
    }

    // Test language switching
    const ruPill = page.locator('.lang-pill:has-text("RU")');
    if (await ruPill.count() > 0) {
      await ruPill.tap();
      await page.waitForTimeout(2000);

      // Check if content changed (look for Cyrillic characters)
      const hasRussian = await page.evaluate(() => {
        const text = document.body.textContent || '';
        return /[А-Яа-я]/.test(text);
      });

      expect(hasRussian).toBe(true);
    }
  });

  test('Mobile Footer Usability', async ({ page }) => {
    await page.goto('/home.html');

    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    const footer = page.locator('.footer, footer').first();
    if (await footer.count() > 0) {
      // Footer links should be accessible
      const footerLinks = await footer.locator('a').all();

      for (const link of footerLinks.slice(0, 5)) {
        const box = await link.boundingBox();

        if (box) {
          // Links should have adequate spacing for mobile
          expect(box.height).toBeGreaterThanOrEqual(32);
        }
      }
    }
  });
});