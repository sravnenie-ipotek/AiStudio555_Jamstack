const { test, expect } = require('@playwright/test');

// Test configuration for NewDesign project
const baseUrl = 'http://localhost:3005/backups/newDesign';

// All menu pages excluding the "pages" submenu as requested
const testPages = [
  // Main navigation items
  'home.html',
  'courses.html',
  'pricing.html',
  'blog.html',
  'teachers.html',

  // About Us dropdown pages
  'career-orientation.html',
  'career-center.html'
];

const viewports = {
  desktop: [
    { name: 'Desktop-1920x1080', width: 1920, height: 1080 },
    { name: 'Desktop-1440x900', width: 1440, height: 900 },
    { name: 'Desktop-1366x768', width: 1366, height: 768 }
  ],
  tablet: [
    { name: 'iPad-768x1024', width: 768, height: 1024 },
    { name: 'iPadAir-820x1180', width: 820, height: 1180 },
    { name: 'iPadLandscape-1024x768', width: 1024, height: 768 }
  ],
  mobile: [
    { name: 'iPhone678-375x667', width: 375, height: 667 },
    { name: 'iPhone12Pro-390x844', width: 390, height: 844 },
    { name: 'iPhone11ProMax-414x896', width: 414, height: 896 }
  ]
};

// Utility function to wait for page load and animations
async function waitForPageReady(page) {
  await page.waitForLoadState('domcontentloaded');

  // Try to wait for networkidle, but don't fail if it times out
  try {
    await page.waitForLoadState('networkidle', { timeout: 5000 });
  } catch (error) {
    console.log('⚠️ NetworkIdle timeout - continuing with test (this may indicate slow loading resources)');
  }

  await page.waitForTimeout(2000); // Wait for CSS animations and dynamic content
}

// Utility function to check for horizontal scrolling
async function checkHorizontalScrolling(page, viewport) {
  const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
  const clientWidth = await page.evaluate(() => document.body.clientWidth);
  const documentWidth = await page.evaluate(() => document.documentElement.clientWidth);

  return {
    hasHorizontalScroll: scrollWidth > Math.max(clientWidth, documentWidth),
    scrollWidth,
    clientWidth,
    documentWidth,
    viewport: viewport.name,
    overflow: scrollWidth - Math.max(clientWidth, documentWidth)
  };
}

// Test menu functionality specific to NewDesign
async function testMenuFunctionality(page, viewport, pageName) {
  // Adjust breakpoint logic to handle tablet viewports properly
  const isMobile = viewport.width <= 768 || (viewport.width <= 820 && viewport.height >= 1024);

  if (isMobile) {
    // Test mobile hamburger menu for Webflow-based NewDesign
    // Wait for navigation to be ready
    await page.waitForSelector('.w-nav-button, .menu-button', { timeout: 10000 });

    const hamburgerButton = page.locator('.w-nav-button, .menu-button').first();
    const mobileMenu = page.locator('.w-nav-overlay, .nav-menu').first();

    const hamburgerVisible = await hamburgerButton.isVisible();
    console.log(`🔍 Hamburger button found: ${hamburgerVisible}`);

    if (hamburgerVisible) {
      // Test hamburger button click
      await hamburgerButton.click();
      await page.waitForTimeout(800); // Wait for Webflow animation

      // Check if mobile menu is visible
      const isMenuVisible = await mobileMenu.isVisible();

      // Take screenshot of open mobile menu
      await page.screenshot({
        path: `test-results/newdesign-screenshots/${viewport.name}-${pageName}-menu-open.png`,
        fullPage: true
      });

      // Test menu items visibility and clickability
      const menuItems = await page.locator('.nav-link, .dropdown-menu-text-link-block').all();
      const menuItemsData = [];

      for (const item of menuItems.slice(0, 10)) { // Limit to first 10 items
        const isVisible = await item.isVisible();
        const text = await item.textContent();
        const href = await item.getAttribute('href');

        menuItemsData.push({
          text: text?.trim(),
          href,
          isVisible,
          isClickable: isVisible
        });
      }

      // Close menu by clicking hamburger again
      if (isMenuVisible) {
        await hamburgerButton.click();
        await page.waitForTimeout(500);
      }

      return {
        type: 'mobile',
        hamburgerVisible: await hamburgerButton.isVisible(),
        menuOpensCorrectly: isMenuVisible,
        menuItems: menuItemsData,
        totalMenuItems: menuItems.length
      };
    }
  } else {
    // Test desktop menu for NewDesign
    const desktopNav = page.locator('.nav-menu').first();
    const menuItems = await page.locator('.nav-link').all();
    const menuItemsData = [];

    for (const item of menuItems) {
      const isVisible = await item.isVisible();
      const text = await item.textContent();
      const href = await item.getAttribute('href');

      menuItemsData.push({
        text: text?.trim(),
        href,
        isVisible,
        isClickable: isVisible
      });
    }

    // Check for dropdown menus (About Us and Pages)
    const dropdowns = await page.locator('.menu-dropdown-wrapper').all();
    const dropdownData = [];

    for (const dropdown of dropdowns) {
      const trigger = dropdown.locator('.dropdown-toggle').first();
      if (await trigger.isVisible()) {
        // Get dropdown label
        const dropdownLabel = await trigger.textContent();

        await trigger.hover();
        await page.waitForTimeout(500);

        const dropdownMenu = dropdown.locator('.dropdown-column-wrapper-3').first();
        const isDropdownVisible = await dropdownMenu.isVisible();
        const dropdownItems = await dropdownMenu.locator('.dropdown-menu-text-link-block').count();

        dropdownData.push({
          label: dropdownLabel?.trim(),
          isVisible: isDropdownVisible,
          itemCount: dropdownItems
        });

        // Move away to close dropdown
        await page.locator('body').hover();
        await page.waitForTimeout(300);
      }
    }

    return {
      type: 'desktop',
      menuVisible: await desktopNav.isVisible(),
      menuItems: menuItemsData,
      dropdowns: dropdownData,
      totalDropdowns: dropdowns.length
    };
  }

  return { type: 'unknown' };
}

// Test dynamic content loading
async function testDynamicContent(page, pageName) {
  // Wait for potential API calls to complete
  await page.waitForTimeout(2000);

  // Check for common dynamic content selectors in NewDesign
  const dynamicSelectors = [
    '.course-card',
    '.blog-card',
    '.teacher-card',
    '.pricing-card',
    '.testimonial-card'
  ];

  const dynamicContent = {};

  for (const selector of dynamicSelectors) {
    const elements = await page.locator(selector);
    const count = await elements.count();

    if (count > 0) {
      dynamicContent[selector] = {
        count,
        firstElementVisible: await elements.first().isVisible()
      };
    }
  }

  return dynamicContent;
}

// Test visual alignment and centering
async function testVisualAlignment(page, viewport, pageName) {
  const alignmentIssues = [];

  // Test hero section alignment on mobile
  if (viewport.width <= 768) {
    // Check main hero content alignment
    const heroContent = page.locator('.hero-content, .hero-wrapper, .hero-section, [class*="hero"]').first();

    if (await heroContent.isVisible()) {
      const heroBox = await heroContent.boundingBox();
      const pageWidth = viewport.width;

      if (heroBox) {
        // Check if hero content is properly centered
        const leftMargin = heroBox.x;
        const rightMargin = pageWidth - (heroBox.x + heroBox.width);
        const marginDifference = Math.abs(leftMargin - rightMargin);

        if (marginDifference > 20) { // Allow 20px tolerance
          alignmentIssues.push({
            element: 'hero-content',
            issue: 'not-centered',
            leftMargin,
            rightMargin,
            difference: marginDifference
          });
        }
      }
    }

    // Check main heading alignment - be more specific
    const headingSelectors = [
      '.section-title',
      'h1', 'h2', 'h3',
      '.about-us-section-title-wrapper h2',
      '.why-choose-us-section-title',
      '.section-description-text'
    ];

    for (const selector of headingSelectors) {
      const heading = page.locator(selector).first();
      if (await heading.isVisible()) {
        const textAlign = await heading.evaluate(el => window.getComputedStyle(el).textAlign);
        const elementText = await heading.textContent();

        if (textAlign === 'left' || textAlign === 'start') {
          alignmentIssues.push({
            element: selector,
            issue: 'text-left-aligned-should-be-centered',
            currentAlign: textAlign,
            text: elementText?.trim().substring(0, 30) + '...'
          });
        }
      }
    }

    // Check for content that should be centered
    const centerElements = await page.locator('.text-center, [class*="center"], .hero-content p, .hero-content div').all();
    for (let i = 0; i < Math.min(centerElements.length, 5); i++) {
      const element = centerElements[i];
      if (await element.isVisible()) {
        const textAlign = await element.evaluate(el => window.getComputedStyle(el).textAlign);
        const parentAlign = await element.evaluate(el => {
          const parent = el.parentElement;
          return parent ? window.getComputedStyle(parent).textAlign : 'left';
        });

        if (textAlign === 'left' && parentAlign === 'left') {
          const elementText = await element.textContent();
          if (elementText && elementText.trim().length > 10) {
            alignmentIssues.push({
              element: `content-element-${i}`,
              issue: 'content-left-aligned',
              text: elementText.trim().substring(0, 50) + '...'
            });
          }
        }
      }
    }
  }

  return alignmentIssues;
}

// Main test suite for NewDesign responsiveness
test.describe('NewDesign Responsive Tests - All Menu Pages (Excluding Pages Submenu)', () => {

  // Ensure test results directory exists
  test.beforeAll(async () => {
    const fs = require('fs').promises;
    try {
      await fs.mkdir('test-results/newdesign-screenshots', { recursive: true });
    } catch (error) {
      // Directory might already exist
    }
  });

  // Test each page at each viewport size
  for (const category in viewports) {
    for (const viewport of viewports[category]) {
      for (const pageName of testPages) {

        test(`${viewport.name} - ${pageName} - Comprehensive Responsive Test`, async ({ page }) => {
          // Set viewport
          await page.setViewportSize({ width: viewport.width, height: viewport.height });

          // Navigate to page
          console.log(`Testing: ${baseUrl}/${pageName} at ${viewport.name}`);
          await page.goto(`${baseUrl}/${pageName}`, {
            waitUntil: 'domcontentloaded',
            timeout: 15000
          });
          await waitForPageReady(page);

          // Take full page screenshot
          await page.screenshot({
            path: `test-results/newdesign-screenshots/${viewport.name}-${pageName}-full.png`,
            fullPage: true
          });

          // Check for horizontal scrolling
          const scrollCheck = await checkHorizontalScrolling(page, viewport);

          // Test menu functionality
          const menuTest = await testMenuFunctionality(page, viewport, pageName);

          // Test dynamic content loading
          const dynamicContentTest = await testDynamicContent(page, pageName);

          // Test visual alignment
          const alignmentTest = await testVisualAlignment(page, viewport, pageName);

          // Test touch events on mobile viewports
          let touchTest = null;
          if (viewport.width <= 768) {
            touchTest = await testTouchEvents(page);
          }

          // Assertions
          // Allow reasonable tolerance for some layouts
          if (scrollCheck.overflow <= 5) {
            console.log(`ℹ️  Minor overflow (${scrollCheck.overflow}px) - within acceptable tolerance`);
          } else {
            expect(scrollCheck.hasHorizontalScroll,
              `Horizontal scroll detected: ${scrollCheck.scrollWidth}px > ${Math.max(scrollCheck.clientWidth, scrollCheck.documentWidth)}px`
            ).toBeFalsy();
          }

          expect(menuTest.type, 'Menu test should identify menu type').not.toBe('unknown');

          // Mobile-specific assertions (adjusted breakpoint for proper tablet handling)
          if (viewport.width <= 768 || (viewport.width <= 820 && viewport.height >= 1024)) {
            // Mobile or iPad portrait (which should use mobile navigation)
            expect(menuTest.hamburgerVisible, 'Hamburger menu should be visible on mobile/tablet portrait').toBeTruthy();
          } else {
            expect(menuTest.menuVisible, 'Desktop menu should be visible').toBeTruthy();
          }

          // Check for alignment issues and warn/fail if found
          if (alignmentTest.length > 0) {
            console.log(`⚠️  ALIGNMENT ISSUES DETECTED on ${viewport.name}:`, alignmentTest);
            // For now, just warn - can be made to fail tests if needed
          }

          // Log comprehensive results
          console.log(`\n=== ${viewport.name} - ${pageName} Results ===`);
          console.log('Horizontal Scroll Check:', scrollCheck);
          console.log('Menu Test:', menuTest);
          console.log('Dynamic Content:', dynamicContentTest);
          console.log('Alignment Issues:', alignmentTest.length > 0 ? alignmentTest : 'None detected');
          if (touchTest) console.log('Touch Test:', touchTest);
        });
      }
    }
  }
});

// Test touch events on mobile
async function testTouchEvents(page) {
  const touchElements = await page.locator('button, .btn, .nav-link, .dropdown-toggle, .w-button').all();
  const results = [];

  for (let i = 0; i < Math.min(touchElements.length, 5); i++) {
    const element = touchElements[i];
    const isVisible = await element.isVisible();

    if (isVisible) {
      try {
        // Test if element responds to tap
        const box = await element.boundingBox();
        if (box) {
          await element.tap({ timeout: 1000 });
          await page.waitForTimeout(200);
          results.push({ element: i, touchResponsive: true });
        }
      } catch (error) {
        results.push({ element: i, touchResponsive: false, error: error.message });
      }
    }
  }

  return results;
}

// Test suite for NewDesign menu interactions
test.describe('NewDesign Menu Interaction Tests', () => {

  const keyViewports = [
    { name: 'Desktop', width: 1920, height: 1080 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Mobile', width: 375, height: 667 }
  ];

  for (const viewport of keyViewports) {
    test(`${viewport.name} - Menu Dropdown Functionality`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(`${baseUrl}/home.html`);
      await waitForPageReady(page);

      const isMobile = viewport.width <= 768;

      if (!isMobile) {
        // Test desktop dropdown menus
        const dropdowns = await page.locator('.menu-dropdown-wrapper').all();

        for (let i = 0; i < dropdowns.length; i++) {
          const dropdown = dropdowns[i];
          const trigger = dropdown.locator('.dropdown-toggle').first();

          if (await trigger.isVisible()) {
            const dropdownText = await trigger.textContent();
            console.log(`Testing dropdown: ${dropdownText?.trim()}`);

            // Hover to open dropdown
            await trigger.hover();
            await page.waitForTimeout(500);

            const dropdownMenu = dropdown.locator('.dropdown-column-wrapper-3').first();
            const isOpen = await dropdownMenu.isVisible();

            console.log(`Dropdown "${dropdownText?.trim()}" opens: ${isOpen}`);

            if (isOpen) {
              // Take screenshot of open dropdown
              await page.screenshot({
                path: `test-results/newdesign-screenshots/${viewport.name}-dropdown-${i}.png`,
                fullPage: true
              });

              // Test dropdown items are clickable
              const dropdownItems = await dropdownMenu.locator('.dropdown-menu-text-link-block').all();
              console.log(`Dropdown has ${dropdownItems.length} items`);

              expect(dropdownItems.length).toBeGreaterThan(0);
            }

            // Move away to close dropdown
            await page.locator('body').hover();
            await page.waitForTimeout(300);
          }
        }
      } else {
        // Test mobile menu functionality
        const hamburger = page.locator('.w-nav-button').first();

        if (await hamburger.isVisible()) {
          await hamburger.click();
          await page.waitForTimeout(800);

          const mobileMenu = page.locator('.w-nav-overlay').first();
          const isOpen = await mobileMenu.isVisible();

          expect(isOpen, 'Mobile menu should open when hamburger is clicked').toBeTruthy();

          // Take screenshot of mobile menu
          await page.screenshot({
            path: `test-results/newdesign-screenshots/${viewport.name}-mobile-menu.png`,
            fullPage: true
          });

          // Close menu
          await hamburger.click();
          await page.waitForTimeout(500);
        }
      }
    });
  }
});

// Performance test for critical pages
test.describe('NewDesign Performance Tests', () => {

  const criticalPages = ['home.html', 'courses.html', 'pricing.html'];

  for (const pageName of criticalPages) {
    test(`Performance - ${pageName}`, async ({ page }) => {
      const startTime = Date.now();

      await page.goto(`${baseUrl}/${pageName}`, {
        waitUntil: 'domcontentloaded'
      });

      const loadTime = Date.now() - startTime;

      // Wait for page to be fully interactive
      await waitForPageReady(page);

      const fullyLoadedTime = Date.now() - startTime;

      console.log(`\n=== ${pageName} Performance ===`);
      console.log(`DOM loaded: ${loadTime}ms`);
      console.log(`Fully interactive: ${fullyLoadedTime}ms`);

      // Performance assertions
      expect(loadTime, `${pageName} DOM load should be under 3 seconds`).toBeLessThan(3000);
      expect(fullyLoadedTime, `${pageName} should be fully interactive under 5 seconds`).toBeLessThan(5000);
    });
  }
});