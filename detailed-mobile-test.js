const { chromium } = require('playwright');

(async () => {
  console.log('Starting detailed mobile menu test...');
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Set mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('http://localhost:3005/he/index.html');
  await page.waitForLoadState('networkidle');

  // Look for different hamburger menu selectors
  console.log('Looking for hamburger menu with different selectors...');

  const selectors = [
    '.w-nav-button',
    '[data-nav-menu-open]',
    '.navbar-menu-button',
    '.menu-button',
    '.hamburger',
    '.nav-menu-button',
    '.w-nav-menu-button'
  ];

  let hamburgerFound = false;
  let workingSelector = '';

  for (const selector of selectors) {
    const element = page.locator(selector);
    const isVisible = await element.isVisible().catch(() => false);
    console.log(`Selector '${selector}': visible = ${isVisible}`);
    if (isVisible && !hamburgerFound) {
      hamburgerFound = true;
      workingSelector = selector;
    }
  }

  if (hamburgerFound) {
    console.log(`Found hamburger menu with selector: ${workingSelector}`);
    const hamburgerMenu = page.locator(workingSelector);
    const boundingBox = await hamburgerMenu.boundingBox();
    console.log('Hamburger menu position:', boundingBox);

    // Test clicking the hamburger menu
    console.log('Clicking hamburger menu...');
    await hamburgerMenu.click();
    await page.waitForTimeout(1500);

    // Take screenshot with menu open
    await page.screenshot({
      path: 'hebrew-mobile-menu-open-correct.png'
    });

    // Check if navigation menu is visible
    const navMenuSelectors = ['.w-nav-menu', '.nav-menu', '.navigation-menu', '.mobile-menu'];
    for (const navSelector of navMenuSelectors) {
      const navMenu = page.locator(navSelector);
      const isNavVisible = await navMenu.isVisible().catch(() => false);
      console.log(`Nav menu '${navSelector}': visible = ${isNavVisible}`);
    }
  } else {
    console.log('No hamburger menu found with standard selectors');
  }

  // Check for language selector in different ways
  console.log('\nLooking for language selector...');
  const langSelectors = [
    '[data-dropdown="language-selector"]',
    '.language-selector',
    '.lang-selector',
    '.dropdown-toggle'
  ];

  for (const selector of langSelectors) {
    const element = page.locator(selector);
    const isVisible = await element.isVisible().catch(() => false);
    console.log(`Language selector '${selector}': visible = ${isVisible}`);
  }

  // Check the current page state
  const pageState = await page.evaluate(() => {
    return {
      bodyWidth: document.body.scrollWidth,
      viewportWidth: window.innerWidth,
      hasHorizontalScroll: document.body.scrollWidth > window.innerWidth,
      rtlDirection: document.documentElement.dir || document.body.dir
    };
  });
  console.log('\nPage state:', pageState);

  await browser.close();
  console.log('Detailed test completed!');
})();