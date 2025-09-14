/**
 * Test Hebrew Courses Page Mobile Menu
 */

const { chromium } = require('playwright');

async function testCoursesPage() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 375, height: 667 }
  });

  const page = await context.newPage();

  try {
    console.log('🧪 Testing Hebrew courses page mobile menu...');

    await page.goto('http://localhost:3005/he/courses.html');
    await page.waitForTimeout(2000);

    // Check how many hamburger buttons exist
    const hamburgerCount = await page.evaluate(() => {
      return document.querySelectorAll('.w-nav-button').length;
    });

    console.log(`📱 Found ${hamburgerCount} hamburger button(s)`);

    if (hamburgerCount === 1) {
      // Test the functionality
      const bodyHasOpenClass = await page.evaluate(() => {
        return document.body.classList.contains('w--nav-menu-open');
      });

      console.log(`   Initial menu state: ${bodyHasOpenClass ? 'open' : 'closed'}`);

      // Click hamburger
      await page.click('.w-nav-button', { force: true });
      await page.waitForTimeout(500);

      const menuOpenAfterClick = await page.evaluate(() => {
        return document.body.classList.contains('w--nav-menu-open');
      });

      console.log(`   Menu after click: ${menuOpenAfterClick ? 'open' : 'closed'}`);

      if (menuOpenAfterClick) {
        // Click again to close
        await page.click('.w-nav-button', { force: true });
        await page.waitForTimeout(500);

        const menuClosedAfterSecondClick = await page.evaluate(() => {
          return !document.body.classList.contains('w--nav-menu-open');
        });

        console.log(`   Menu after second click: ${menuClosedAfterSecondClick ? 'closed' : 'open'}`);

        if (!bodyHasOpenClass && menuOpenAfterClick && menuClosedAfterSecondClick) {
          console.log('🎉 SUCCESS: Hebrew courses page mobile menu works correctly!');
        } else {
          console.log('❌ FAILED: Menu functionality issues');
        }
      } else {
        console.log('❌ FAILED: Menu doesn\'t open on click');
      }
    } else {
      console.log('❌ FAILED: Multiple hamburger buttons detected');
    }

  } catch (error) {
    console.error('❌ Test error:', error.message);
  } finally {
    await browser.close();
  }
}

testCoursesPage().catch(console.error);