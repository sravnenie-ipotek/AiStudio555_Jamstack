/**
 * Simple Mobile Menu Test
 * Just check if menu starts closed and hamburger is visible
 */

const { chromium } = require('playwright');

async function testMobileMenuSimple() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 375, height: 667 }
  });

  const page = await context.newPage();

  try {
    console.log('🧪 Testing Hebrew mobile menu state...');
    await page.goto('http://localhost:3005/he/home.html');
    await page.waitForTimeout(2000);

    // Check initial state
    const bodyHasOpenClass = await page.evaluate(() => {
      return document.body.classList.contains('w--nav-menu-open');
    });

    const hamburgerVisible = await page.isVisible('.w-nav-button');
    const menuDisplayStyle = await page.evaluate(() => {
      const menu = document.querySelector('.w-nav-menu');
      return menu ? window.getComputedStyle(menu).display : 'none';
    });

    console.log('📱 Mobile menu state:');
    console.log(`   Body has open class: ${bodyHasOpenClass}`);
    console.log(`   Hamburger visible: ${hamburgerVisible}`);
    console.log(`   Menu display: ${menuDisplayStyle}`);

    // Force click hamburger with coordinates
    if (hamburgerVisible) {
      const hamburgerBox = await page.locator('.w-nav-button').boundingBox();
      if (hamburgerBox) {
        const x = hamburgerBox.x + hamburgerBox.width / 2;
        const y = hamburgerBox.y + hamburgerBox.height / 2;

        console.log(`   Clicking at (${x}, ${y})`);
        await page.mouse.click(x, y);
        await page.waitForTimeout(1000);

        const menuOpenAfterClick = await page.evaluate(() => {
          return document.body.classList.contains('w--nav-menu-open');
        });

        console.log(`   Menu opens on click: ${menuOpenAfterClick}`);

        if (menuOpenAfterClick) {
          // Try closing with another click
          await page.mouse.click(x, y);
          await page.waitForTimeout(1000);

          const menuClosedAgain = await page.evaluate(() => {
            return !document.body.classList.contains('w--nav-menu-open');
          });

          console.log(`   Menu closes on second click: ${menuClosedAgain}`);

          if (!bodyHasOpenClass && hamburgerVisible && menuOpenAfterClick && menuClosedAgain) {
            console.log('🎉 SUCCESS: Mobile menu works correctly!');
            console.log('✅ Menu starts closed');
            console.log('✅ Hamburger button visible');
            console.log('✅ Menu can be opened');
            console.log('✅ Menu can be closed');
          } else {
            console.log('⚠️  Partial success - some issues remain');
          }
        }
      }
    }

  } catch (error) {
    console.error('❌ Test error:', error.message);
  } finally {
    await browser.close();
  }
}

testMobileMenuSimple().catch(console.error);