/**
 * Test Menu Visibility on Load
 */

const { chromium } = require('playwright');

async function testMenuVisibility() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 375, height: 667 }
  });

  const page = await context.newPage();

  try {
    console.log('🧪 Testing menu visibility on Hebrew courses page...');

    await page.goto('http://localhost:3005/he/courses.html');
    await page.waitForTimeout(3000); // Wait longer for all scripts to load

    // Check computed styles
    const menuStyles = await page.evaluate(() => {
      const menu = document.querySelector('.w-nav-menu');
      if (!menu) return null;

      const styles = window.getComputedStyle(menu);
      return {
        display: styles.display,
        visibility: styles.visibility,
        opacity: styles.opacity,
        position: styles.position,
        zIndex: styles.zIndex
      };
    });

    console.log('📱 Menu computed styles:', menuStyles);

    // Check body classes
    const bodyClasses = await page.evaluate(() => {
      return document.body.className;
    });

    console.log('📱 Body classes:', bodyClasses);

    // Check if menu is actually visible in viewport
    const isMenuVisible = await page.evaluate(() => {
      const menu = document.querySelector('.w-nav-menu');
      if (!menu) return false;

      const rect = menu.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 &&
             rect.top < window.innerHeight && rect.bottom > 0;
    });

    console.log('📱 Menu visible in viewport:', isMenuVisible);

    if (isMenuVisible) {
      console.log('❌ PROBLEM: Menu is visible on page load!');
    } else {
      console.log('✅ GOOD: Menu is hidden on page load');
    }

  } catch (error) {
    console.error('❌ Test error:', error.message);
  } finally {
    await browser.close();
  }
}

testMenuVisibility().catch(console.error);