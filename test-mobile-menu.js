const { chromium } = require('playwright');

async function testMobileMenu() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 375, height: 667 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1'
  });

  const page = await context.newPage();

  try {
    console.log('🔍 Navigating to Hebrew site...');
    await page.goto('https://www.aistudio555.com/he', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    console.log('📱 Taking screenshot of initial mobile view...');
    await page.screenshot({
      path: '/Users/michaelmishayev/Desktop/newCode/mobile-menu-closed.png',
      fullPage: false
    });

    // Check if mobile menu is hidden by default
    const mobileMenu = await page.locator('.w-nav-menu');
    const isMenuVisible = await mobileMenu.isVisible();
    console.log('📋 Mobile menu visible by default:', isMenuVisible);

    // Check if hamburger button is visible
    const hamburgerButton = await page.locator('.w-nav-button');
    const isHamburgerVisible = await hamburgerButton.isVisible();
    console.log('🍔 Hamburger button visible:', isHamburgerVisible);

    if (isHamburgerVisible) {
      // Click hamburger to open menu
      console.log('🔄 Clicking hamburger button to open menu...');
      await hamburgerButton.click();
      await page.waitForTimeout(1000);

      // Take screenshot with menu open
      console.log('📱 Taking screenshot with menu open...');
      await page.screenshot({
        path: '/Users/michaelmishayev/Desktop/newCode/mobile-menu-open.png',
        fullPage: false
      });

      // Check if menu is now visible
      const isMenuOpenVisible = await mobileMenu.isVisible();
      console.log('📋 Mobile menu visible after click:', isMenuOpenVisible);

      // Click hamburger again to close menu
      console.log('🔄 Clicking hamburger button to close menu...');
      await hamburgerButton.click();
      await page.waitForTimeout(1000);

      const isMenuClosedAgain = await mobileMenu.isVisible();
      console.log('📋 Mobile menu visible after second click:', isMenuClosedAgain);
    }

    // Check language selector
    const languageSelector = await page.locator('.language-selector, .w-dropdown');
    const isLanguageSelectorVisible = await languageSelector.isVisible();
    console.log('🌐 Language selector visible:', isLanguageSelectorVisible);

    console.log('✅ Mobile menu test completed!');

  } catch (error) {
    console.error('❌ Error during mobile menu test:', error);
  }

  await browser.close();
}

testMobileMenu();