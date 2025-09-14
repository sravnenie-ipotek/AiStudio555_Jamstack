/**
 * Test Hebrew Home Page Specifically
 */

const { chromium } = require('playwright');

async function testHomePage() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 375, height: 667 }
  });

  const page = await context.newPage();

  try {
    console.log('🧪 Testing Hebrew home page mobile menu...');

    await page.goto('http://localhost:3005/he/home.html');
    await page.waitForTimeout(3000);

    const menuState = await page.evaluate(() => {
      const menu = document.querySelector('.w-nav-menu');
      const styles = menu ? window.getComputedStyle(menu) : null;

      return {
        menuExists: !!menu,
        display: styles ? styles.display : 'none',
        visibility: styles ? styles.visibility : 'hidden',
        opacity: styles ? styles.opacity : '0',
        position: styles ? styles.position : 'static',
        bodyClass: document.body.className,
        hamburgerExists: !!document.querySelector('.w-nav-button')
      };
    });

    console.log('📱 Hebrew home page menu state:', menuState);

    const isProperlyHidden =
      menuState.display === 'none' &&
      menuState.visibility === 'hidden' &&
      menuState.opacity === '0';

    if (isProperlyHidden) {
      console.log('✅ SUCCESS: Hebrew home page mobile menu is properly hidden!');
    } else {
      console.log('❌ ISSUE: Menu still has visibility problems');
    }

    // Test hamburger click
    if (menuState.hamburgerExists) {
      console.log('🖱️  Testing hamburger button...');
      await page.click('.w-nav-button', { force: true });
      await page.waitForTimeout(500);

      const afterClick = await page.evaluate(() => {
        return {
          bodyHasOpenClass: document.body.classList.contains('w--nav-menu-open'),
          menuDisplay: window.getComputedStyle(document.querySelector('.w-nav-menu')).display
        };
      });

      console.log('📱 After hamburger click:', afterClick);
    }

  } catch (error) {
    console.error('❌ Test error:', error.message);
  } finally {
    await browser.close();
  }
}

testHomePage().catch(console.error);