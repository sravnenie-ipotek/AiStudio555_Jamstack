const { test, expect } = require('@playwright/test');

test.describe('Hebrew Mobile Responsiveness Test', () => {
  test('Check mobile viewport issues on he/index.html', async ({ page }) => {
    // Set mobile viewport (iPhone SE size - 375px width)
    await page.setViewportSize({ width: 375, height: 667 });

    console.log('Navigating to Hebrew homepage...');
    await page.goto('http://localhost:3005/he/index.html');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    console.log('Taking full page screenshot...');
    await page.screenshot({
      path: 'hebrew-mobile-full-page.png',
      fullPage: true,
      animations: 'disabled'
    });

    console.log('Taking viewport screenshot...');
    await page.screenshot({
      path: 'hebrew-mobile-viewport.png',
      animations: 'disabled'
    });

    // Test 1: Check for horizontal scrolling
    console.log('Checking for horizontal scrolling...');
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    console.log(`Scroll width: ${scrollWidth}, Client width: ${clientWidth}`);
    const hasHorizontalScroll = scrollWidth > clientWidth;
    console.log(`Has horizontal scroll: ${hasHorizontalScroll}`);

    // Test 2: Check hamburger menu visibility and position
    console.log('Checking hamburger menu...');
    const hamburgerMenu = page.locator('[data-w-id="6a8bc8e8-8c86-aa93-d065-7a9e42cb0aee"]');
    const isHamburgerVisible = await hamburgerMenu.isVisible();
    console.log(`Hamburger menu visible: ${isHamburgerVisible}`);

    if (isHamburgerVisible) {
      const hamburgerBox = await hamburgerMenu.boundingBox();
      console.log('Hamburger position:', hamburgerBox);
    }

    // Test 3: Check language selector visibility
    console.log('Checking language selector...');
    const languageSelector = page.locator('[data-dropdown="language-selector"]');
    const isLanguageSelectorVisible = await languageSelector.isVisible();
    console.log(`Language selector visible: ${isLanguageSelectorVisible}`);

    // Test 4: Test hamburger menu functionality
    if (isHamburgerVisible) {
      console.log('Testing hamburger menu click...');
      await hamburgerMenu.click();
      await page.waitForTimeout(1000); // Wait for animation

      console.log('Taking screenshot after hamburger click...');
      await page.screenshot({
        path: 'hebrew-mobile-menu-open.png',
        animations: 'disabled'
      });

      // Check if menu is open
      const navMenu = page.locator('.w-nav-menu');
      const isMenuOpen = await navMenu.isVisible();
      console.log(`Menu open after click: ${isMenuOpen}`);
    }

    // Test 5: Check for content overflow
    console.log('Checking content overflow...');
    const bodyOverflow = await page.evaluate(() => {
      const body = document.body;
      const computedStyle = window.getComputedStyle(body);
      return {
        overflowX: computedStyle.overflowX,
        overflowY: computedStyle.overflowY,
        width: body.offsetWidth,
        scrollWidth: body.scrollWidth
      };
    });
    console.log('Body overflow:', bodyOverflow);

    // Test 6: Check specific elements that might cause horizontal scroll
    console.log('Checking wide elements...');
    const wideElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const viewport = window.innerWidth;
      const wideOnes = [];

      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.width > viewport) {
          wideOnes.push({
            tag: el.tagName,
            class: el.className,
            width: Math.round(rect.width),
            right: Math.round(rect.right)
          });
        }
      });

      return wideOnes.slice(0, 10); // Limit to first 10 to avoid too much output
    });
    console.log('Elements wider than viewport:', wideElements);

    console.log('Mobile responsiveness test completed!');
  });
});