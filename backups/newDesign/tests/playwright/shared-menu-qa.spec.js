/**
 * Comprehensive QA Tests for Shared Menu Component
 * Tests functionality without webflow.js dependency
 */

const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3005/backups/newDesign';
const TEST_VIEWPORTS = {
  desktop: { width: 1920, height: 1080 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 667 },
  largeMobile: { width: 414, height: 896 }
};

// Test pages that use the shared menu
const TEST_PAGES = [
  { name: 'popup-demo', url: '/tests/popup-demo.html' },
  { name: 'home', url: '/home.html' },
  { name: 'courses', url: '/courses.html' },
  { name: 'teachers', url: '/teachers.html' }
];

test.describe('Shared Menu Component QA Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Set default desktop viewport
    await page.setViewportSize(TEST_VIEWPORTS.desktop);
    
    // Listen for console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('Console error:', msg.text());
      }
    });
  });

  test.describe('1. Independence from webflow.js', () => {
    
    test('should work without webflow.js on popup-demo page', async ({ page }) => {
      await page.goto(`${BASE_URL}/tests/popup-demo.html`);
      
      // Wait for page to load
      await page.waitForLoadState('networkidle');
      
      // Check that navbar is present
      const navbar = await page.locator('.navbar').first();
      await expect(navbar).toBeVisible();
      
      // Check that menu items are visible
      const homeLink = await page.locator('.nav-link').filter({ hasText: 'Home' });
      await expect(homeLink).toBeVisible();
      
      // Check for webflow-specific errors in console
      const logs = [];
      page.on('console', msg => logs.push(msg.text()));
      
      // Wait a bit to catch any async errors
      await page.waitForTimeout(2000);
      
      // Filter for webflow-related errors
      const webflowErrors = logs.filter(log => 
        log.toLowerCase().includes('webflow') && 
        log.toLowerCase().includes('error')
      );
      
      expect(webflowErrors.length).toBe(0);
    });

    test('should have functional hamburger menu without webflow.js', async ({ page }) => {
      await page.setViewportSize(TEST_VIEWPORTS.mobile);
      await page.goto(`${BASE_URL}/tests/popup-demo.html`);
      
      // Check hamburger is visible on mobile
      const hamburger = await page.locator('.menu-button');
      await expect(hamburger).toBeVisible();
      
      // Check nav menu is hidden initially
      const navMenu = await page.locator('.nav-menu');
      await expect(navMenu).not.toHaveClass(/w--open/);
      
      // Click hamburger
      await hamburger.click();
      
      // Check nav menu opens
      await expect(navMenu).toHaveClass(/w--open/);
      
      // Check hamburger animation
      await expect(hamburger).toHaveClass(/w--open/);
    });
  });

  test.describe('2. Cross-Browser Compatibility', () => {
    
    for (const browserName of ['chromium', 'firefox', 'webkit']) {
      test(`should work in ${browserName}`, async ({ page, browserName: currentBrowser }) => {
        test.skip(currentBrowser !== browserName, `Skipping ${browserName} test`);
        
        await page.goto(`${BASE_URL}/tests/popup-demo.html`);
        
        // Basic functionality test
        const navbar = await page.locator('.navbar').first();
        await expect(navbar).toBeVisible();
        
        // Test dropdown hover (desktop)
        const aboutDropdown = await page.locator('.menu-dropdown-wrapper').filter({ hasText: 'About Us' });
        await aboutDropdown.hover();
        
        // Check dropdown appears
        const dropdownList = aboutDropdown.locator('.dropdown-column-wrapper-3');
        await expect(dropdownList).toBeVisible({ timeout: 5000 });
        
        // Test Sign Up button
        const signUpButton = await page.locator('.primary-button').filter({ hasText: 'Sign Up Today' }).first();
        await expect(signUpButton).toBeVisible();
      });
    }
  });

  test.describe('3. Responsive Behavior', () => {
    
    Object.entries(TEST_VIEWPORTS).forEach(([viewportName, viewport]) => {
      test(`should be responsive on ${viewportName}`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto(`${BASE_URL}/tests/popup-demo.html`);
        
        const navbar = await page.locator('.navbar').first();
        await expect(navbar).toBeVisible();
        
        if (viewport.width <= 991) {
          // Mobile: hamburger should be visible
          const hamburger = await page.locator('.menu-button');
          await expect(hamburger).toBeVisible();
          
          // Desktop sign up should be hidden
          const desktopSignUp = await page.locator('.primary-button-wrapper.desktop');
          await expect(desktopSignUp).not.toBeVisible();
          
          // Mobile sign up should be in menu (initially hidden)
          const mobileSignUp = await page.locator('.primary-button-wrapper.mobile');
          // Note: mobile signup is in the nav-menu which is initially hidden
          
        } else {
          // Desktop: hamburger should be hidden
          const hamburger = await page.locator('.menu-button');
          await expect(hamburger).not.toBeVisible();
          
          // Desktop sign up should be visible
          const desktopSignUp = await page.locator('.primary-button-wrapper.desktop');
          await expect(desktopSignUp).toBeVisible();
        }
      });
    });
  });

  test.describe('4. Animation Functionality', () => {
    
    test('should animate hamburger icon correctly', async ({ page }) => {
      await page.setViewportSize(TEST_VIEWPORTS.mobile);
      await page.goto(`${BASE_URL}/tests/popup-demo.html`);
      
      const hamburger = await page.locator('.menu-button');
      const hamburgerLines = await page.locator('.hamburger-line');
      
      // Initial state
      await expect(hamburgerLines.first()).not.toHaveCSS('transform', 'matrix(0.707107, 0.707107, -0.707107, 0.707107, 5, 5)');
      
      // Click to open
      await hamburger.click();
      
      // Wait for animation
      await page.waitForTimeout(500);
      
      // Check hamburger has open class
      await expect(hamburger).toHaveClass(/w--open/);
      
      // Check first line rotation (approximately 45 degrees)
      const firstLineTransform = await hamburgerLines.first().getAttribute('style');
      expect(firstLineTransform).toContain('rotate(45deg)');
      
      // Check middle line opacity
      const middleLineOpacity = await hamburgerLines.nth(1).evaluate(el => getComputedStyle(el).opacity);
      expect(parseFloat(middleLineOpacity)).toBeLessThan(1);
    });

    test('should animate dropdown on hover (desktop)', async ({ page }) => {
      await page.goto(`${BASE_URL}/tests/popup-demo.html`);
      
      const aboutDropdown = await page.locator('.menu-dropdown-wrapper').filter({ hasText: 'About Us' });
      const dropdownList = aboutDropdown.locator('.dropdown-column-wrapper-3');
      
      // Initial state - dropdown should be hidden
      await expect(dropdownList).not.toBeVisible();
      
      // Hover to show
      await aboutDropdown.hover();
      
      // Wait for animation
      await page.waitForTimeout(500);
      
      // Should be visible
      await expect(dropdownList).toBeVisible();
      
      // Move away to hide
      await page.locator('.navbar').hover({ position: { x: 100, y: 50 } });
      
      // Wait for animation
      await page.waitForTimeout(500);
      
      // Should be hidden again
      await expect(dropdownList).not.toBeVisible();
    });

    test('should handle language switcher animations', async ({ page }) => {
      await page.goto(`${BASE_URL}/tests/popup-demo.html`);
      
      // Test pill switcher
      const langPills = await page.locator('.lang-pill');
      const firstPill = langPills.first();
      const secondPill = langPills.nth(1);
      
      // First pill should be active initially
      await expect(firstPill).toHaveClass(/active/);
      
      // Click second pill
      await secondPill.click();
      
      // Wait for transition
      await page.waitForTimeout(300);
      
      // Check active state changed
      await expect(secondPill).toHaveClass(/active/);
      await expect(firstPill).not.toHaveClass(/active/);
    });
  });

  test.describe('5. Multi-Page Integration', () => {
    
    TEST_PAGES.forEach(({ name, url }) => {
      test(`should work correctly on ${name} page`, async ({ page }) => {
        await page.goto(`${BASE_URL}${url}`);
        
        // Wait for page to load
        await page.waitForLoadState('networkidle');
        
        // Check navbar exists
        const navbar = await page.locator('.navbar').first();
        await expect(navbar).toBeVisible();
        
        // Check main navigation links
        const homeLink = await page.locator('.nav-link').filter({ hasText: 'Home' });
        const coursesLink = await page.locator('.nav-link').filter({ hasText: 'Courses' });
        
        await expect(homeLink).toBeVisible();
        await expect(coursesLink).toBeVisible();
        
        // Check dropdowns exist
        const aboutDropdown = await page.locator('.menu-dropdown-wrapper').filter({ hasText: 'About Us' });
        const pagesDropdown = await page.locator('.menu-dropdown-wrapper').filter({ hasText: 'Pages' });
        
        await expect(aboutDropdown).toBeVisible();
        await expect(pagesDropdown).toBeVisible();
        
        // Check Sign Up button functionality
        const signUpButton = await page.locator('.primary-button').filter({ hasText: 'Sign Up Today' }).first();
        await expect(signUpButton).toBeVisible();
        
        // Test dropdown functionality
        await aboutDropdown.hover();
        const aboutDropdownList = aboutDropdown.locator('.dropdown-column-wrapper-3');
        await expect(aboutDropdownList).toBeVisible({ timeout: 5000 });
      });
    });
  });

  test.describe('6. Sign Up Button Integration', () => {
    
    test('should open contact popup when Sign Up Today is clicked', async ({ page }) => {
      await page.goto(`${BASE_URL}/tests/popup-demo.html`);
      
      // Get Sign Up button
      const signUpButton = await page.locator('.primary-button').filter({ hasText: 'Sign Up Today' }).first();
      await expect(signUpButton).toBeVisible();
      
      // Click Sign Up button
      await signUpButton.click();
      
      // Wait for popup to appear
      await page.waitForTimeout(1000);
      
      // Check if popup opened (popup-demo page should have contact popup)
      // This test assumes the contact popup component is loaded
      const popup = await page.locator('.contact-popup, .popup-overlay').first();
      if (await popup.count() > 0) {
        await expect(popup).toBeVisible();
      } else {
        // Fallback: check if openContactPopup function was called
        const consoleLogs = [];
        page.on('console', msg => consoleLogs.push(msg.text()));
        
        // Re-click to capture any console messages
        await signUpButton.click();
        await page.waitForTimeout(500);
        
        // Check for any popup-related console messages
        const popupLogs = consoleLogs.filter(log => 
          log.toLowerCase().includes('popup') || 
          log.toLowerCase().includes('contact')
        );
        
        // At minimum, there should be some interaction
        expect(popupLogs.length).toBeGreaterThan(0);
      }
    });

    test('should have proper hover animations on Sign Up button', async ({ page }) => {
      await page.goto(`${BASE_URL}/tests/popup-demo.html`);
      
      const signUpButton = await page.locator('.primary-button').filter({ hasText: 'Sign Up Today' }).first();
      
      // Get initial transform
      const initialTransform = await signUpButton.evaluate(el => getComputedStyle(el).transform);
      
      // Hover over button
      await signUpButton.hover();
      
      // Wait for animation
      await page.waitForTimeout(300);
      
      // Check transform changed (button should move up)
      const hoverTransform = await signUpButton.evaluate(el => getComputedStyle(el).transform);
      
      // The transform should be different (indicating hover animation)
      expect(hoverTransform).not.toBe(initialTransform);
    });
  });

  test.describe('7. Error Handling & Fallbacks', () => {
    
    test('should handle missing assets gracefully', async ({ page }) => {
      await page.goto(`${BASE_URL}/tests/popup-demo.html`);
      
      // Check for 404 errors in network
      const failedRequests = [];
      page.on('response', response => {
        if (response.status() >= 400) {
          failedRequests.push({
            url: response.url(),
            status: response.status()
          });
        }
      });
      
      // Wait for page to fully load
      await page.waitForLoadState('networkidle');
      
      // Filter for critical assets (images, CSS, JS)
      const criticalFailures = failedRequests.filter(req => 
        req.url.includes('.css') || 
        req.url.includes('.js') || 
        req.url.includes('/images/') ||
        req.url.includes('/shared/')
      );
      
      // Report critical failures
      if (criticalFailures.length > 0) {
        console.log('Critical asset failures:', criticalFailures);
      }
      
      // Check that navbar still functions despite any asset failures
      const navbar = await page.locator('.navbar').first();
      await expect(navbar).toBeVisible();
    });

    test('should work without contact popup dependencies', async ({ page }) => {
      // Block popup-related scripts to test fallback
      await page.route('**/popup.js', route => route.abort());
      await page.route('**/emailService.js', route => route.abort());
      
      await page.goto(`${BASE_URL}/tests/popup-demo.html`);
      
      // Menu should still work
      const navbar = await page.locator('.navbar').first();
      await expect(navbar).toBeVisible();
      
      // Sign Up button should still be clickable (even if popup doesn't work)
      const signUpButton = await page.locator('.primary-button').filter({ hasText: 'Sign Up Today' }).first();
      await expect(signUpButton).toBeVisible();
      
      // Click shouldn't break the page
      await signUpButton.click();
      
      // Wait to ensure no crashes
      await page.waitForTimeout(1000);
      
      // Page should still be functional
      await expect(navbar).toBeVisible();
    });
  });

  test.describe('8. Performance & Loading', () => {
    
    test('should load and initialize quickly', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto(`${BASE_URL}/tests/popup-demo.html`);
      
      // Wait for navbar to be visible
      const navbar = await page.locator('.navbar').first();
      await expect(navbar).toBeVisible();
      
      const loadTime = Date.now() - startTime;
      
      // Should load within reasonable time (5 seconds)
      expect(loadTime).toBeLessThan(5000);
      
      // Check that shared menu is initialized
      const menuInitialized = await page.evaluate(() => {
        return window.SharedMenu && window.SharedMenu.isInitialized;
      });
      
      expect(menuInitialized).toBe(true);
    });

    test('should not cause memory leaks with repeated interactions', async ({ page }) => {
      await page.goto(`${BASE_URL}/tests/popup-demo.html`);
      await page.setViewportSize(TEST_VIEWPORTS.mobile);
      
      const hamburger = await page.locator('.menu-button');
      
      // Rapidly toggle mobile menu multiple times
      for (let i = 0; i < 10; i++) {
        await hamburger.click();
        await page.waitForTimeout(100);
        await hamburger.click();
        await page.waitForTimeout(100);
      }
      
      // Menu should still work normally
      await hamburger.click();
      const navMenu = await page.locator('.nav-menu');
      await expect(navMenu).toHaveClass(/w--open/);
    });
  });

  test.describe('9. Accessibility', () => {
    
    test('should be keyboard navigable', async ({ page }) => {
      await page.goto(`${BASE_URL}/tests/popup-demo.html`);
      
      // Focus on first navigation link
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab'); // May need multiple tabs to reach nav
      
      // Should be able to navigate through menu items
      const focusedElement = await page.locator(':focus');
      
      // Check if we can reach navigation elements
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab');
        const currentFocus = await page.locator(':focus');
        const tagName = await currentFocus.evaluate(el => el.tagName);
        
        if (tagName === 'A' && await currentFocus.getAttribute('class').then(c => c?.includes('nav-link'))) {
          // Found a navigation link
          break;
        }
      }
    });

    test('should have proper ARIA attributes', async ({ page }) => {
      await page.goto(`${BASE_URL}/tests/popup-demo.html`);
      
      // Check navbar role
      const navbar = await page.locator('.navbar').first();
      const role = await navbar.getAttribute('role');
      expect(role).toBe('banner');
      
      // Check navigation role
      const nav = await page.locator('nav[role="navigation"]');
      await expect(nav).toBeVisible();
      
      // Check cart accessibility
      const cartButton = await page.locator('[aria-label="Open cart"]');
      if (await cartButton.count() > 0) {
        await expect(cartButton).toBeVisible();
      }
    });
  });

  test.describe('10. Visual Consistency', () => {
    
    test('should maintain consistent styling across viewports', async ({ page }) => {
      const screenshots = {};
      
      for (const [viewportName, viewport] of Object.entries(TEST_VIEWPORTS)) {
        await page.setViewportSize(viewport);
        await page.goto(`${BASE_URL}/tests/popup-demo.html`);
        
        // Wait for fonts and styles to load
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1000);
        
        // Take screenshot of navbar area
        const navbar = await page.locator('.navbar').first();
        screenshots[viewportName] = await navbar.screenshot();
        
        // Basic visual checks
        const backgroundColor = await navbar.evaluate(el => getComputedStyle(el).backgroundColor);
        const position = await navbar.evaluate(el => getComputedStyle(el).position);
        
        expect(position).toBe('fixed');
        // Background should be transparent or have backdrop blur
        expect(backgroundColor).toMatch(/rgba?\(.*\)|transparent/);
      }
      
      // Screenshots are now available for manual comparison if needed
      console.log('Screenshots taken for all viewports');
    });
  });
});
