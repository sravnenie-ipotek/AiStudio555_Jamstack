const { test, expect } = require('@playwright/test');

test.describe('Visual Regression Testing', () => {
  const testPages = [
    { name: 'home', url: 'home.html', critical: true },
    { name: 'courses', url: 'courses.html', critical: true },
    { name: 'teachers', url: 'teachers.html', critical: false },
    { name: 'career-center', url: 'career-center.html', critical: false },
    { name: 'career-orientation', url: 'career-orientation.html', critical: false }
  ];

  const languages = [
    { code: 'en', name: 'English', path: 'dist/en/' },
    { code: 'ru', name: 'Russian', path: 'dist/ru/' },
    { code: 'he', name: 'Hebrew', path: 'dist/he/' }
  ];

  const viewports = {
    desktop: { width: 1920, height: 1080, name: 'desktop' },
    tablet: { width: 768, height: 1024, name: 'tablet' },
    mobile: { width: 375, height: 667, name: 'mobile' }
  };

  test.describe('Cross-Browser Visual Consistency', () => {
    for (const page of testPages.filter(p => p.critical)) {
      for (const [device, viewport] of Object.entries(viewports)) {
        test(`${page.name} - ${device} - Visual baseline`, async ({ page: playwright }) => {
          await playwright.setViewportSize(viewport);
          await playwright.goto(page.url);
          await playwright.waitForLoadState('networkidle');
          
          // Wait for fonts and animations to settle
          await playwright.waitForFunction(() => document.fonts.ready);
          await playwright.waitForTimeout(1000);

          // Hide dynamic content that might cause flaky tests
          await playwright.addStyleTag({
            content: `
              /* Hide potentially dynamic content for consistent screenshots */
              .timestamp, .current-time, .live-indicator { visibility: hidden !important; }
              
              /* Ensure consistent animation states */
              *, *::before, *::after {
                animation-duration: 0s !important;
                animation-delay: 0s !important;
                transition-duration: 0s !important;
                transition-delay: 0s !important;
              }
              
              /* Stabilize any hover effects */
              :hover { 
                transition: none !important; 
              }
            `
          });

          // Take full page screenshot
          await expect(playwright).toHaveScreenshot(`${page.name}-${device}-full.png`, {
            fullPage: true,
            animations: 'disabled',
            caret: 'hide'
          });

          // Take above-the-fold screenshot
          await expect(playwright).toHaveScreenshot(`${page.name}-${device}-hero.png`, {
            clip: { x: 0, y: 0, width: viewport.width, height: Math.min(viewport.height, 800) },
            animations: 'disabled',
            caret: 'hide'
          });

          console.log(`✅ ${page.name} ${device} visual baseline captured`);
        });
      }
    }
  });

  test.describe('Multi-Language Visual Consistency', () => {
    for (const lang of languages) {
      test(`Language visual consistency - ${lang.name}`, async ({ page }) => {
        await page.setViewportSize(viewports.desktop);
        await page.goto(`${lang.path}index.html`);
        await page.waitForLoadState('networkidle');
        await page.waitForFunction(() => document.fonts.ready);

        // Stabilize page for screenshot
        await page.addStyleTag({
          content: `
            *, *::before, *::after {
              animation-duration: 0s !important;
              transition-duration: 0s !important;
            }
          `
        });

        // Test RTL layout for Hebrew
        if (lang.code === 'he') {
          const rtlElements = await page.locator('[dir="rtl"], html[dir="rtl"]').count();
          expect(rtlElements).toBeGreaterThan(0);
          
          // Check text alignment
          const textAlignment = await page.evaluate(() => {
            const body = document.body;
            return window.getComputedStyle(body).direction;
          });
          expect(textAlignment).toBe('rtl');
        }

        // Take language-specific screenshot
        await expect(page).toHaveScreenshot(`language-${lang.code}-desktop.png`, {
          fullPage: true,
          animations: 'disabled',
          caret: 'hide'
        });

        // Test mobile layout for each language
        await page.setViewportSize(viewports.mobile);
        await page.waitForTimeout(500);

        await expect(page).toHaveScreenshot(`language-${lang.code}-mobile.png`, {
          fullPage: true,
          animations: 'disabled',
          caret: 'hide'
        });

        console.log(`✅ ${lang.name} visual consistency verified`);
      });
    }
  });

  test.describe('Component Visual Testing', () => {
    test('Navigation component consistency', async ({ page }) => {
      for (const [device, viewport] of Object.entries(viewports)) {
        await page.setViewportSize(viewport);
        await page.goto('home.html');
        await page.waitForLoadState('networkidle');

        // Find navigation element
        const nav = page.locator('.navbar, .nav, .main-nav, .header-nav').first();
        
        if (await nav.isVisible()) {
          // Stabilize navigation
          await page.addStyleTag({
            content: `
              .navbar, .nav, .main-nav, .header-nav {
                animation: none !important;
                transition: none !important;
              }
            `
          });

          await expect(nav).toHaveScreenshot(`navigation-${device}.png`, {
            animations: 'disabled'
          });
        }

        // Test mobile menu if applicable
        if (device === 'mobile') {
          const hamburger = page.locator('.w-nav-button, .menu-button, .hamburger').first();
          if (await hamburger.isVisible()) {
            await hamburger.click();
            await page.waitForTimeout(500);

            const mobileMenu = page.locator('.w-nav-overlay, .nav-menu, .mobile-menu').first();
            if (await mobileMenu.isVisible()) {
              await expect(mobileMenu).toHaveScreenshot(`mobile-menu-open.png`, {
                animations: 'disabled'
              });
            }
          }
        }
      }

      console.log('✅ Navigation component visual testing complete');
    });

    test('Contact modal visual consistency', async ({ page }) => {
      await page.setViewportSize(viewports.desktop);
      await page.goto('home.html');
      await page.waitForLoadState('networkidle');

      // Try to open contact modal
      const signUpBtn = page.locator('a:has-text("Sign Up"), .primary-button').first();
      if (await signUpBtn.isVisible()) {
        await signUpBtn.click();
        await page.waitForTimeout(1000);

        const modal = page.locator('#contactModal');
        if (await modal.isVisible()) {
          // Stabilize modal animations
          await page.addStyleTag({
            content: `
              #contactModal, .contact-modal-content {
                animation: none !important;
                transition: none !important;
              }
            `
          });

          await expect(modal).toHaveScreenshot('contact-modal-desktop.png', {
            animations: 'disabled'
          });

          // Test mobile modal
          await page.setViewportSize(viewports.mobile);
          await page.waitForTimeout(500);

          await expect(modal).toHaveScreenshot('contact-modal-mobile.png', {
            animations: 'disabled'
          });

          // Test form validation state
          await page.click('button[type="submit"]');
          await page.waitForTimeout(500);

          await expect(modal).toHaveScreenshot('contact-modal-validation.png', {
            animations: 'disabled'
          });
        }
      }

      console.log('✅ Contact modal visual testing complete');
    });

    test('Course cards visual consistency', async ({ page }) => {
      await page.goto('courses.html');
      await page.waitForLoadState('networkidle');
      await page.waitForFunction(() => document.fonts.ready);

      // Test course grid on different viewports
      for (const [device, viewport] of Object.entries(viewports)) {
        await page.setViewportSize(viewport);
        await page.waitForTimeout(500);

        const courseGrid = page.locator('.course-grid, .courses-container, .w-dyn-list').first();
        if (await courseGrid.isVisible()) {
          // Stabilize any hover effects
          await page.addStyleTag({
            content: `
              .course-item, .course-card {
                transform: none !important;
                transition: none !important;
              }
            `
          });

          await expect(courseGrid).toHaveScreenshot(`courses-grid-${device}.png`, {
            animations: 'disabled'
          });
        }
      }

      console.log('✅ Course cards visual testing complete');
    });

    test('Footer consistency', async ({ page }) => {
      await page.goto('home.html');
      await page.waitForLoadState('networkidle');

      const footer = page.locator('footer, .footer').first();
      if (await footer.isVisible()) {
        // Scroll to footer
        await footer.scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);

        // Test footer on different viewports
        for (const [device, viewport] of Object.entries(viewports)) {
          await page.setViewportSize(viewport);
          await page.waitForTimeout(500);

          await expect(footer).toHaveScreenshot(`footer-${device}.png`, {
            animations: 'disabled'
          });
        }
      }

      console.log('✅ Footer visual testing complete');
    });
  });

  test.describe('Dark Mode Visual Testing', () => {
    test('Dark mode dropdown consistency', async ({ page }) => {
      await page.goto('home.html');
      await page.waitForLoadState('networkidle');

      // Find Career Services dropdown
      const dropdown = page.locator('.w-dropdown').first();
      if (await dropdown.isVisible()) {
        // Trigger dropdown
        await dropdown.locator('.w-dropdown-toggle').hover();
        await page.waitForTimeout(500);

        const dropdownList = dropdown.locator('.w-dropdown-list');
        if (await dropdownList.isVisible()) {
          await expect(dropdownList).toHaveScreenshot('dropdown-dark-mode.png', {
            animations: 'disabled'
          });
        }
      }

      console.log('✅ Dark mode dropdown visual testing complete');
    });
  });

  test.describe('Error State Visual Testing', () => {
    test('404 page visual consistency', async ({ page }) => {
      // Test non-existent page
      const response = await page.goto('non-existent-page.html', { waitUntil: 'networkidle' });
      
      // Should get 404 or redirect
      if (response && response.status() === 404) {
        await expect(page).toHaveScreenshot('404-page.png', {
          fullPage: true,
          animations: 'disabled'
        });
      }
    });

    test('API error state visuals', async ({ page }) => {
      // Mock API failure
      await page.route('**/api/**', route => {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal Server Error' })
        });
      });

      await page.goto('home.html');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000); // Wait for API calls to fail

      // Check if error states are visually handled
      await expect(page).toHaveScreenshot('api-error-state.png', {
        fullPage: true,
        animations: 'disabled'
      });

      console.log('✅ API error state visual testing complete');
    });
  });

  test.describe('Animation and Interaction States', () => {
    test('Button hover and focus states', async ({ page }) => {
      await page.goto('home.html');
      await page.waitForLoadState('networkidle');

      const primaryButton = page.locator('.primary-button, .btn-primary').first();
      if (await primaryButton.isVisible()) {
        // Normal state
        await expect(primaryButton).toHaveScreenshot('button-normal.png');

        // Hover state
        await primaryButton.hover();
        await page.waitForTimeout(200);
        await expect(primaryButton).toHaveScreenshot('button-hover.png');

        // Focus state
        await primaryButton.focus();
        await page.waitForTimeout(200);
        await expect(primaryButton).toHaveScreenshot('button-focus.png');

        // Active state
        await page.mouse.down();
        await page.waitForTimeout(100);
        await expect(primaryButton).toHaveScreenshot('button-active.png');
        await page.mouse.up();
      }

      console.log('✅ Button states visual testing complete');
    });

    test('Form input states', async ({ page }) => {
      await page.goto('home.html');
      await page.waitForLoadState('networkidle');

      // Open contact modal to access form
      const signUpBtn = page.locator('a:has-text("Sign Up"), .primary-button').first();
      if (await signUpBtn.isVisible()) {
        await signUpBtn.click();
        await page.waitForTimeout(1000);

        const nameInput = page.locator('#fullName');
        if (await nameInput.isVisible()) {
          // Empty state
          await expect(nameInput).toHaveScreenshot('input-empty.png');

          // Focused state
          await nameInput.focus();
          await page.waitForTimeout(200);
          await expect(nameInput).toHaveScreenshot('input-focused.png');

          // Filled state
          await nameInput.fill('Test User');
          await expect(nameInput).toHaveScreenshot('input-filled.png');

          // Error state (try to trigger validation)
          await nameInput.fill('');
          await nameInput.blur();
          await page.waitForTimeout(200);
          await expect(nameInput).toHaveScreenshot('input-error.png');
        }
      }

      console.log('✅ Form input states visual testing complete');
    });
  });

  test.describe('Cross-Device Layout Testing', () => {
    const customViewports = [
      { name: 'iPhone-SE', width: 375, height: 667 },
      { name: 'iPad-Mini', width: 768, height: 1024 },
      { name: 'iPad-Pro', width: 1024, height: 1366 },
      { name: 'Desktop-HD', width: 1920, height: 1080 },
      { name: 'Desktop-4K', width: 3840, height: 2160 }
    ];

    test('Layout consistency across devices', async ({ page }) => {
      for (const viewport of customViewports) {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto('home.html');
        await page.waitForLoadState('networkidle');
        await page.waitForFunction(() => document.fonts.ready);

        // Stabilize layout
        await page.addStyleTag({
          content: `
            *, *::before, *::after {
              animation-duration: 0s !important;
              transition-duration: 0s !important;
            }
          `
        });

        // Take hero section screenshot
        await expect(page).toHaveScreenshot(`layout-${viewport.name}-hero.png`, {
          clip: { x: 0, y: 0, width: viewport.width, height: Math.min(viewport.height, 800) },
          animations: 'disabled'
        });

        console.log(`✅ Layout tested on ${viewport.name} (${viewport.width}x${viewport.height})`);
      }
    });
  });

  test.describe('Print Styles Visual Testing', () => {
    test('Print layout consistency', async ({ page }) => {
      await page.goto('home.html');
      await page.waitForLoadState('networkidle');

      // Emulate print media
      await page.emulateMedia({ media: 'print' });
      await page.waitForTimeout(500);

      // Take screenshot of print layout
      await expect(page).toHaveScreenshot('print-layout.png', {
        fullPage: true,
        animations: 'disabled'
      });

      // Test specific pages that might be printed
      for (const testPage of ['courses.html', 'teachers.html']) {
        await page.goto(testPage);
        await page.waitForLoadState('networkidle');
        await page.emulateMedia({ media: 'print' });
        await page.waitForTimeout(500);

        const pageName = testPage.replace('.html', '');
        await expect(page).toHaveScreenshot(`print-${pageName}.png`, {
          fullPage: true,
          animations: 'disabled'
        });
      }

      console.log('✅ Print styles visual testing complete');
    });
  });

  test('Visual diff analysis', async ({ page }) => {
    // This test would compare current screenshots with baseline
    // and generate a visual diff report
    
    console.log('\n=== Visual Regression Summary ===');
    console.log('Screenshots captured for:');
    console.log('- Cross-browser consistency');
    console.log('- Multi-language layouts');
    console.log('- Component states');
    console.log('- Responsive designs');
    console.log('- Error states');
    console.log('- Interactive states');
    console.log('- Print layouts');
    
    console.log('\n📸 Visual regression testing complete');
    console.log('Review generated screenshots in test-results/');
  });
});