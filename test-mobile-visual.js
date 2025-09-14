/**
 * Visual Test for Mobile Menu
 */

const { chromium } = require('playwright');

async function testMobileVisual() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 375, height: 667 }
  });

  const page = await context.newPage();

  try {
    console.log('📱 Visual Mobile Menu Test\n');

    await page.goto('http://localhost:3005/he/courses.html');
    await page.waitForTimeout(2500);

    // Take screenshot of closed state
    await page.screenshot({ path: 'mobile-menu-closed.png' });
    console.log('📸 Screenshot saved: mobile-menu-closed.png');

    // Check hamburger button
    const hamburgerInfo = await page.evaluate(() => {
      const btn = document.querySelector('.w-nav-button');
      if (!btn) return null;

      const rect = btn.getBoundingClientRect();
      const styles = window.getComputedStyle(btn);

      return {
        visible: styles.display !== 'none' && styles.visibility !== 'hidden',
        position: `${rect.left}x${rect.top}`,
        size: `${rect.width}x${rect.height}`,
        zIndex: styles.zIndex
      };
    });

    console.log('\n🍔 Hamburger Button:');
    if (hamburgerInfo) {
      console.log(`   Visible: ${hamburgerInfo.visible ? '✅' : '❌'}`);
      console.log(`   Position: ${hamburgerInfo.position}`);
      console.log(`   Size: ${hamburgerInfo.size}`);
      console.log(`   Z-Index: ${hamburgerInfo.zIndex}`);
    } else {
      console.log('   ❌ Not found');
    }

    // Open menu
    await page.click('.w-nav-button', { force: true });
    await page.waitForTimeout(1000);

    // Take screenshot of open state
    await page.screenshot({ path: 'mobile-menu-open.png' });
    console.log('\n📸 Screenshot saved: mobile-menu-open.png');

    // Check menu layout
    const menuLayout = await page.evaluate(() => {
      const menu = document.querySelector('.w-nav-menu');
      if (!menu) return null;

      const menuItems = Array.from(menu.querySelectorAll('.nav-link, .menu-dropdown-wrapper, #language-switcher'));
      const styles = window.getComputedStyle(menu);

      return {
        display: styles.display,
        position: styles.position,
        background: styles.background,
        itemCount: menuItems.length,
        items: menuItems.slice(0, 5).map(item => ({
          text: item.textContent.trim().substring(0, 20),
          display: window.getComputedStyle(item).display,
          padding: window.getComputedStyle(item).padding
        }))
      };
    });

    console.log('\n📋 Menu Layout:');
    if (menuLayout) {
      console.log(`   Display: ${menuLayout.display}`);
      console.log(`   Position: ${menuLayout.position}`);
      console.log(`   Items: ${menuLayout.itemCount}`);
      console.log('\n   Menu Items:');
      menuLayout.items.forEach(item => {
        console.log(`   • "${item.text}" - ${item.display}, padding: ${item.padding}`);
      });
    }

    console.log('\n✅ Visual test complete - Check screenshots for UI quality');

  } catch (error) {
    console.error('❌ Test error:', error.message);
  } finally {
    await browser.close();
  }
}

testMobileVisual().catch(console.error);