const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function testLanguageSelector() {
  console.log('🚀 Starting Language Selector Test...\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Enable console logging to capture errors
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  const testResults = {
    desktop: {
      languageSelectorVisible: false,
      languageSelectorInNavbar: false,
      languageSelectorPosition: '',
      consoleErrors: [],
      screenshot: ''
    },
    mobile: {
      desktopLanguageSelectorHidden: false,
      mobileLanguageSelectorInMenu: false,
      hamburgerMenuWorks: false,
      consoleErrors: [],
      screenshot: ''
    }
  };

  try {
    // Test Desktop View (1200px width)
    console.log('🖥️  Testing Desktop View (1200px width)...');
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('http://localhost:3005/en/home.html');
    await page.waitForLoadState('networkidle');

    // Wait for any dynamic content to load
    await page.waitForTimeout(2000);

    // Check if language selector exists and is visible
    const languageSelector = await page.locator('#language-switcher').first();
    testResults.desktop.languageSelectorVisible = await languageSelector.isVisible();

    // Check if language selector is positioned in/near navbar
    if (testResults.desktop.languageSelectorVisible) {
      const selectorBox = await languageSelector.boundingBox();
      const navbar = await page.locator('.navbar').first();
      const navbarBox = await navbar.boundingBox();

      if (selectorBox && navbarBox) {
        // Check if selector is positioned within or near the navbar area
        const isInNavbarArea = selectorBox.y <= (navbarBox.y + navbarBox.height + 50);
        testResults.desktop.languageSelectorInNavbar = isInNavbarArea;
        testResults.desktop.languageSelectorPosition = `Top: ${selectorBox.y}, Right: ${1200 - selectorBox.x - selectorBox.width}`;
      }
    }

    // Capture console errors
    testResults.desktop.consoleErrors = [...consoleErrors];

    // Take desktop screenshot
    await page.screenshot({ path: '/Users/michaelmishayev/Desktop/newCode/desktop-test-screenshot.png', fullPage: false });
    testResults.desktop.screenshot = '/Users/michaelmishayev/Desktop/newCode/desktop-test-screenshot.png';
    console.log('✅ Desktop screenshot saved: desktop-test-screenshot.png');

    // Test language switching on desktop
    if (testResults.desktop.languageSelectorVisible) {
      console.log('🔄 Testing desktop language switching...');
      const select = await page.locator('#language-switcher select').first();
      await select.selectOption('he');
      await page.waitForTimeout(1000);

      // Check if URL changed
      const currentUrl = page.url();
      console.log(`   Current URL after switching: ${currentUrl}`);
    }

    // Test Mobile View (375px width)
    console.log('\n📱 Testing Mobile View (375px width)...');
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3005/en/home.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Clear previous console errors
    consoleErrors.length = 0;

    // Check if desktop language selector is hidden on mobile
    const desktopSelector = await page.locator('#language-switcher').first();
    const isSelectorHidden = !(await desktopSelector.isVisible()) ||
                            await desktopSelector.evaluate(el => {
                              const style = window.getComputedStyle(el);
                              return style.display === 'none' || style.visibility === 'hidden';
                            });
    testResults.mobile.desktopLanguageSelectorHidden = isSelectorHidden;

    // Test hamburger menu functionality
    const hamburgerButton = await page.locator('.menu-button, .w-nav-button').first();
    const hamburgerExists = await hamburgerButton.isVisible();

    if (hamburgerExists) {
      console.log('🍔 Testing hamburger menu...');
      await hamburgerButton.click();
      await page.waitForTimeout(500);

      const mobileMenu = await page.locator('.w-nav-overlay, .nav-menu').first();
      testResults.mobile.hamburgerMenuWorks = await mobileMenu.isVisible();

      // Look for language selector in mobile menu
      if (testResults.mobile.hamburgerMenuWorks) {
        // Check for any language-related elements in the mobile menu
        const mobileLangElements = await page.locator('.w-nav-overlay .language-selector, .nav-menu .language-selector, .w-nav-overlay [id*="language"], .nav-menu [id*="language"]').all();
        testResults.mobile.mobileLanguageSelectorInMenu = mobileLangElements.length > 0;
      }
    }

    // Capture mobile console errors
    testResults.mobile.consoleErrors = [...consoleErrors];

    // Take mobile screenshot
    await page.screenshot({ path: '/Users/michaelmishayev/Desktop/newCode/mobile-test-screenshot.png', fullPage: false });
    testResults.mobile.screenshot = '/Users/michaelmishayev/Desktop/newCode/mobile-test-screenshot.png';
    console.log('✅ Mobile screenshot saved: mobile-test-screenshot.png');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }

  return testResults;
}

// Run the test and output results
(async () => {
  const results = await testLanguageSelector();

  console.log('\n📊 TEST RESULTS SUMMARY');
  console.log('========================');

  console.log('\n🖥️  DESKTOP VIEW (1200px):');
  console.log(`   ✓ Language selector visible: ${results.desktop.languageSelectorVisible ? '✅ YES' : '❌ NO'}`);
  console.log(`   ✓ Language selector in navbar area: ${results.desktop.languageSelectorInNavbar ? '✅ YES' : '❌ NO'}`);
  console.log(`   ✓ Position: ${results.desktop.languageSelectorPosition}`);
  console.log(`   ✓ Console errors: ${results.desktop.consoleErrors.length === 0 ? '✅ NONE' : '❌ ' + results.desktop.consoleErrors.length + ' errors'}`);
  if (results.desktop.consoleErrors.length > 0) {
    results.desktop.consoleErrors.forEach(error => console.log(`      - ${error}`));
  }

  console.log('\n📱 MOBILE VIEW (375px):');
  console.log(`   ✓ Desktop language selector hidden: ${results.mobile.desktopLanguageSelectorHidden ? '✅ YES' : '❌ NO'}`);
  console.log(`   ✓ Hamburger menu works: ${results.mobile.hamburgerMenuWorks ? '✅ YES' : '❌ NO'}`);
  console.log(`   ✓ Mobile language selector in menu: ${results.mobile.mobileLanguageSelectorInMenu ? '✅ YES' : '❌ NO'}`);
  console.log(`   ✓ Console errors: ${results.mobile.consoleErrors.length === 0 ? '✅ NONE' : '❌ ' + results.mobile.consoleErrors.length + ' errors'}`);
  if (results.mobile.consoleErrors.length > 0) {
    results.mobile.consoleErrors.forEach(error => console.log(`      - ${error}`));
  }

  console.log('\n📷 Screenshots saved:');
  console.log(`   🖥️  Desktop: desktop-test-screenshot.png`);
  console.log(`   📱 Mobile: mobile-test-screenshot.png`);

  process.exit(0);
})();