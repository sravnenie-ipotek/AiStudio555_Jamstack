const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('🔍 Testing English homepage footer...\n');

  // Navigate to English homepage
  await page.goto('http://localhost:3005/en/home.html');
  await page.waitForTimeout(3000); // Wait for dynamic content to load

  // Check for footer container
  const footerContainer = await page.$('#dynamic-footer-container');
  if (footerContainer) {
    console.log('✅ Footer container found: #dynamic-footer-container');
  } else {
    console.log('❌ Footer container NOT found: #dynamic-footer-container');

    // Check for alternative footer containers
    const footerContent = await page.$('.footer-content');
    if (footerContent) {
      console.log('⚠️  Found .footer-content but missing ID');
    }
  }

  // Check footer content
  const footerHTML = await page.$eval('.footer-content', el => el.innerHTML).catch(() => null);
  if (footerHTML) {
    console.log('\n📄 Footer HTML content:');
    console.log(footerHTML.substring(0, 500) + '...');

    // Check if it's still loading
    if (footerHTML.includes('Loading footer')) {
      console.log('\n⏳ Footer is still showing loading state');
    }
  }

  // Check console errors
  const consoleMessages = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleMessages.push(msg.text());
    }
  });

  // Reload to capture console errors
  await page.reload();
  await page.waitForTimeout(2000);

  if (consoleMessages.length > 0) {
    console.log('\n❌ Console errors found:');
    consoleMessages.forEach(msg => console.log('  - ' + msg));
  }

  // Check for MasterFooterLoader script
  const hasFooterLoader = await page.evaluate(() => {
    return typeof window.MasterFooterLoader !== 'undefined';
  });

  if (hasFooterLoader) {
    console.log('\n✅ MasterFooterLoader is loaded');
  } else {
    console.log('\n❌ MasterFooterLoader is NOT loaded');

    // Check if script tag exists
    const scriptExists = await page.$('script[src*="master-footer-loader"]');
    if (scriptExists) {
      console.log('⚠️  Script tag exists but MasterFooterLoader not initialized');
    } else {
      console.log('❌ master-footer-loader.js script tag is missing');
    }
  }

  // Take screenshot
  await page.screenshot({ path: 'en-footer-test.png', fullPage: false });
  console.log('\n📸 Screenshot saved as en-footer-test.png');

  await browser.close();
})();