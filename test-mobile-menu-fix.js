/**
 * Test Mobile Menu Fix
 * Tests that Hebrew mobile menu initializes properly and can be toggled
 */

const { chromium } = require('playwright');

async function testMobileMenuFix() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 375, height: 667 }, // Mobile viewport
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
  });

  const page = await context.newPage();

  // Test Hebrew home page
  console.log('🧪 Testing Hebrew mobile menu fix...');

  try {
    await page.goto('http://localhost:3005/he/home.html');

    // Wait for scripts to load
    await page.waitForTimeout(2000);

    // Check if menu is initially closed
    const menuVisible = await page.isVisible('.w-nav-menu');
    const bodyHasOpenClass = await page.evaluate(() => {
      return document.body.classList.contains('w--nav-menu-open');
    });

    console.log('✅ Initial menu state:');
    console.log(`   Menu visible: ${menuVisible}`);
    console.log(`   Body has open class: ${bodyHasOpenClass}`);

    // Check if hamburger button exists and is visible
    const hamburgerExists = await page.isVisible('.w-nav-button');
    console.log(`   Hamburger button visible: ${hamburgerExists}`);

    if (hamburgerExists) {
      // Try clicking hamburger button
      await page.click('.w-nav-button');
      await page.waitForTimeout(500);

      // Check if menu opens
      const menuOpenAfterClick = await page.evaluate(() => {
        return document.body.classList.contains('w--nav-menu-open');
      });

      console.log(`   Menu opens on click: ${menuOpenAfterClick}`);

      if (menuOpenAfterClick) {
        // Try closing menu by clicking hamburger again
        await page.click('.w-nav-button');
        await page.waitForTimeout(500);

        const menuClosedAfterSecondClick = await page.evaluate(() => {
          return !document.body.classList.contains('w--nav-menu-open');
        });

        console.log(`   Menu closes on second click: ${menuClosedAfterSecondClick}`);

        if (menuClosedAfterSecondClick) {
          console.log('🎉 SUCCESS: Mobile menu works correctly!');
        } else {
          console.log('❌ FAILED: Menu does not close properly');
        }
      } else {
        console.log('❌ FAILED: Menu does not open on hamburger click');
      }
    } else {
      console.log('❌ FAILED: Hamburger button not visible on mobile');
    }

    // Check console errors
    const logs = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        logs.push(msg.text());
      }
    });

    if (logs.length > 0) {
      console.log('⚠️  Console errors found:');
      logs.forEach(log => console.log(`   ${log}`));
    }

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  } finally {
    await browser.close();
  }
}

testMobileMenuFix().catch(console.error);