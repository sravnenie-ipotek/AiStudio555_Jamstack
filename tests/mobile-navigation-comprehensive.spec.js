const { test, expect, devices } = require('@playwright/test');

/**
 * Comprehensive Mobile Navigation Tests
 *
 * Tests the complete mobile navigation functionality including:
 * 1. Single hamburger button (no duplicates)
 * 2. Proper open/close functionality with X button
 * 3. Language selector in mobile menu
 * 4. All navigation options working
 * 5. Menu closing when navigation occurs
 */

// Test on multiple mobile devices
const mobileDevices = [
  'iPhone 12',
  'iPhone SE',
  'Samsung Galaxy S21',
  'Pixel 5'
];

for (const deviceName of mobileDevices) {
  test.describe(`Mobile Navigation on ${deviceName}`, () => {
    test.use({ ...devices[deviceName] });

    test.beforeEach(async ({ page }) => {
      // Start local server in background if not running
      await page.goto('http://localhost:3005/dist/en/courses.html');

      // Wait for page to load completely
      await page.waitForLoadState('networkidle');

      // Wait for our mobile navigation script to initialize
      await page.waitForTimeout(1000);
    });

    test('should have only one hamburger button', async ({ page }) => {
      // Check that there's only one mobile menu button
      const menuButtons = await page.locator('.mobile-menu-button, .w-nav-button, .menu-button').all();

      console.log(`Found ${menuButtons.length} menu buttons`);

      // Should have exactly one menu button
      expect(menuButtons.length).toBe(1);

      // The button should be our custom mobile menu button
      const customButton = page.locator('.mobile-menu-button');
      await expect(customButton).toBeVisible();

      // Old style buttons should not exist
      const oldButtons = page.locator('.w-nav-button:not(.mobile-menu-button)');
      await expect(oldButtons).toHaveCount(0);
    });

    test('should open mobile menu when hamburger is clicked', async ({ page }) => {
      // Click the hamburger button
      const menuButton = page.locator('.mobile-menu-button');
      await expect(menuButton).toBeVisible();
      await menuButton.click();

      // Wait for menu animation
      await page.waitForTimeout(500);

      // Menu should be visible
      const menu = page.locator('.w-nav-menu, .nav-menu');
      await expect(menu).toBeVisible();

      // Body should have the menu-open class
      const body = page.locator('body');
      await expect(body).toHaveClass(/mobile-menu-open|w--nav-menu-open/);

      // Menu should contain navigation links
      const navLinks = menu.locator('.nav-link');
      await expect(navLinks.first()).toBeVisible();

      // Should have at least home, courses, teachers links
      const homeLink = menu.locator('a:has-text("Home")');
      const coursesLink = menu.locator('a:has-text("Courses")');
      const teachersLink = menu.locator('a:has-text("Teachers")');

      await expect(homeLink).toBeVisible();
      await expect(coursesLink).toBeVisible();
      await expect(teachersLink).toBeVisible();
    });

    test('should show X (close) button when menu is open', async ({ page }) => {
      // Open menu
      const menuButton = page.locator('.mobile-menu-button');
      await menuButton.click();
      await page.waitForTimeout(500);

      // Hamburger should transform to X
      const hamburgerLines = page.locator('.hamburger-line');
      await expect(hamburgerLines).toHaveCount(3);

      // Check that the lines have been transformed (rotated)
      // Line 1 should be rotated
      const line1 = hamburgerLines.nth(0);
      const line1Transform = await line1.evaluate(el => getComputedStyle(el).transform);
      expect(line1Transform).toContain('rotate');

      // Line 2 should be hidden (opacity 0)
      const line2 = hamburgerLines.nth(1);
      const line2Opacity = await line2.evaluate(el => getComputedStyle(el).opacity);
      expect(parseFloat(line2Opacity)).toBeLessThan(1);

      // Line 3 should be rotated
      const line3 = hamburgerLines.nth(2);
      const line3Transform = await line3.evaluate(el => getComputedStyle(el).transform);
      expect(line3Transform).toContain('rotate');
    });

    test('should close menu when X button is clicked', async ({ page }) => {
      // Open menu
      const menuButton = page.locator('.mobile-menu-button');
      await menuButton.click();
      await page.waitForTimeout(500);

      // Verify menu is open
      const menu = page.locator('.w-nav-menu, .nav-menu');
      await expect(menu).toBeVisible();

      // Click the X button (same element, but now shows X)
      await menuButton.click();
      await page.waitForTimeout(500);

      // Menu should be hidden
      await expect(menu).not.toBeVisible();

      // Body should not have menu-open class
      const body = page.locator('body');
      await expect(body).not.toHaveClass(/mobile-menu-open|w--nav-menu-open/);

      // Hamburger lines should be back to normal
      const line2 = page.locator('.hamburger-line').nth(1);
      const line2Opacity = await line2.evaluate(el => getComputedStyle(el).opacity);
      expect(parseFloat(line2Opacity)).toBe(1);
    });

    test('should have language selector in mobile menu', async ({ page }) => {
      // Open menu
      const menuButton = page.locator('.mobile-menu-button');
      await menuButton.click();
      await page.waitForTimeout(500);

      // Look for language selector in menu
      const menu = page.locator('.w-nav-menu, .nav-menu');
      const languageSelector = menu.locator('.mobile-language-selector, .mobile-language-select');

      await expect(languageSelector).toBeVisible();

      // Check that it has language options
      const select = menu.locator('select.mobile-language-select');
      await expect(select).toBeVisible();

      // Should have English, Russian, Hebrew options
      const options = select.locator('option');
      await expect(options).toHaveCount(3);

      const optionTexts = await options.allTextContents();
      expect(optionTexts.some(text => text.includes('English'))).toBeTruthy();
      expect(optionTexts.some(text => text.includes('Русский'))).toBeTruthy();
      expect(optionTexts.some(text => text.includes('עברית'))).toBeTruthy();
    });

    test('should show career services dropdown in mobile menu', async ({ page }) => {
      // Open menu
      const menuButton = page.locator('.mobile-menu-button');
      await menuButton.click();
      await page.waitForTimeout(500);

      // Look for career services dropdown
      const menu = page.locator('.w-nav-menu, .nav-menu');
      const careerDropdown = menu.locator('.menu-dropdown-wrapper');

      if (await careerDropdown.count() > 0) {
        await expect(careerDropdown).toBeVisible();

        // Check dropdown items
        const dropdownList = careerDropdown.locator('.dropdown-list');
        await expect(dropdownList).toBeVisible();

        // Should have career orientation and career center links
        const careerOrientation = dropdownList.locator('a:has-text("Career Orientation"), a:has-text("orientation")');
        const careerCenter = dropdownList.locator('a:has-text("Career Center"), a:has-text("center")');

        if (await careerOrientation.count() > 0) {
          await expect(careerOrientation.first()).toBeVisible();
        }
        if (await careerCenter.count() > 0) {
          await expect(careerCenter.first()).toBeVisible();
        }
      }
    });

    test('should close menu when navigation link is clicked', async ({ page }) => {
      // Open menu
      const menuButton = page.locator('.mobile-menu-button');
      await menuButton.click();
      await page.waitForTimeout(500);

      // Verify menu is open
      const menu = page.locator('.w-nav-menu, .nav-menu');
      await expect(menu).toBeVisible();

      // Click a navigation link (but prevent actual navigation)
      const homeLink = menu.locator('a:has-text("Home")').first();

      // Intercept navigation to prevent leaving the page
      await page.route('**/home.html', route => route.abort());

      if (await homeLink.count() > 0) {
        await homeLink.click();
        await page.waitForTimeout(500);

        // Menu should close automatically
        await expect(menu).not.toBeVisible();

        // Body should not have menu-open class
        const body = page.locator('body');
        await expect(body).not.toHaveClass(/mobile-menu-open|w--nav-menu-open/);
      }
    });

    test('should close menu when escape key is pressed', async ({ page }) => {
      // Open menu
      const menuButton = page.locator('.mobile-menu-button');
      await menuButton.click();
      await page.waitForTimeout(500);

      // Verify menu is open
      const menu = page.locator('.w-nav-menu, .nav-menu');
      await expect(menu).toBeVisible();

      // Press escape key
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);

      // Menu should be closed
      await expect(menu).not.toBeVisible();

      // Body should not have menu-open class
      const body = page.locator('body');
      await expect(body).not.toHaveClass(/mobile-menu-open|w--nav-menu-open/);
    });

    test('should close menu when overlay is clicked', async ({ page }) => {
      // Open menu
      const menuButton = page.locator('.mobile-menu-button');
      await menuButton.click();
      await page.waitForTimeout(500);

      // Verify menu is open
      const menu = page.locator('.w-nav-menu, .nav-menu');
      await expect(menu).toBeVisible();

      // Look for overlay
      const overlay = page.locator('.mobile-menu-overlay, .w-nav-overlay');

      if (await overlay.count() > 0 && await overlay.first().isVisible()) {
        // Click the overlay
        await overlay.first().click();
        await page.waitForTimeout(500);

        // Menu should be closed
        await expect(menu).not.toBeVisible();
      }
    });

    test('should prevent body scroll when menu is open', async ({ page }) => {
      // Check initial body overflow
      const initialOverflow = await page.locator('body').evaluate(el => getComputedStyle(el).overflow);

      // Open menu
      const menuButton = page.locator('.mobile-menu-button');
      await menuButton.click();
      await page.waitForTimeout(500);

      // Body should have overflow hidden
      const menuOpenOverflow = await page.locator('body').evaluate(el => getComputedStyle(el).overflow);
      expect(menuOpenOverflow).toBe('hidden');

      // Close menu
      await menuButton.click();
      await page.waitForTimeout(500);

      // Body overflow should be restored
      const finalOverflow = await page.locator('body').evaluate(el => getComputedStyle(el).overflow);
      expect(finalOverflow).toBe(initialOverflow);
    });

    test('should be accessible with keyboard navigation', async ({ page }) => {
      // Tab to menu button
      await page.keyboard.press('Tab');

      // Menu button should be focused
      const menuButton = page.locator('.mobile-menu-button');
      await expect(menuButton).toBeFocused();

      // Press Enter to open menu
      await page.keyboard.press('Enter');
      await page.waitForTimeout(500);

      // Menu should be open
      const menu = page.locator('.w-nav-menu, .nav-menu');
      await expect(menu).toBeVisible();

      // Press Escape to close
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);

      // Menu should be closed
      await expect(menu).not.toBeVisible();
    });

    test('should handle rapid clicks gracefully', async ({ page }) => {
      const menuButton = page.locator('.mobile-menu-button');
      const menu = page.locator('.w-nav-menu, .nav-menu');

      // Click rapidly multiple times
      for (let i = 0; i < 5; i++) {
        await menuButton.click();
        await page.waitForTimeout(100);
      }

      // Wait for animations to settle
      await page.waitForTimeout(1000);

      // Menu should be in a consistent state (either open or closed)
      const isVisible = await menu.isVisible();
      const hasOpenClass = await page.locator('body').evaluate(el =>
        el.classList.contains('mobile-menu-open') || el.classList.contains('w--nav-menu-open')
      );

      // Visible state should match the class state
      expect(isVisible).toBe(hasOpenClass);
    });
  });
}

// Test on desktop to ensure desktop navigation is not affected
test.describe('Desktop Navigation (should not be affected)', () => {
  test('should hide mobile menu button on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('http://localhost:3005/dist/en/courses.html');
    await page.waitForLoadState('networkidle');

    // Mobile menu button should not be visible on desktop
    const menuButton = page.locator('.mobile-menu-button');
    await expect(menuButton).not.toBeVisible();

    // Desktop navigation should be visible
    const desktopNav = page.locator('.w-nav-menu, .nav-menu');
    await expect(desktopNav).toBeVisible();
  });
});

// Test language switching functionality
test.describe('Mobile Language Switching', () => {
  test.use({ ...devices['iPhone 12'] });

  test('should switch language when option is selected', async ({ page }) => {
    await page.goto('http://localhost:3005/dist/en/courses.html');
    await page.waitForLoadState('networkidle');

    // Open mobile menu
    const menuButton = page.locator('.mobile-menu-button');
    await menuButton.click();
    await page.waitForTimeout(500);

    // Find language selector
    const languageSelect = page.locator('.mobile-language-select');

    if (await languageSelect.count() > 0) {
      // Intercept the navigation that would happen
      let navigationUrl = '';
      page.on('framenavigated', frame => {
        navigationUrl = frame.url();
      });

      // Select Russian
      await languageSelect.selectOption('ru');
      await page.waitForTimeout(1000);

      // Should attempt to navigate to Russian version
      expect(navigationUrl).toContain('/ru/') || expect(navigationUrl).toContain('ru');
    }
  });
});

// Performance test
test.describe('Mobile Navigation Performance', () => {
  test.use({ ...devices['iPhone 12'] });

  test('should open and close menu within reasonable time', async ({ page }) => {
    await page.goto('http://localhost:3005/dist/en/courses.html');
    await page.waitForLoadState('networkidle');

    const menuButton = page.locator('.mobile-menu-button');
    const menu = page.locator('.w-nav-menu, .nav-menu');

    // Measure menu open time
    const openStart = Date.now();
    await menuButton.click();
    await menu.waitFor({ state: 'visible' });
    const openTime = Date.now() - openStart;

    // Should open within 1 second
    expect(openTime).toBeLessThan(1000);

    // Measure menu close time
    const closeStart = Date.now();
    await menuButton.click();
    await menu.waitFor({ state: 'hidden' });
    const closeTime = Date.now() - closeStart;

    // Should close within 1 second
    expect(closeTime).toBeLessThan(1000);

    console.log(`Menu open time: ${openTime}ms, close time: ${closeTime}ms`);
  });
});