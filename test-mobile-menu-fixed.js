/**
 * Test Mobile Menu After Fixes
 */

const { chromium } = require('playwright');

async function testMobileMenuFixed() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 375, height: 667 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
  });

  const page = await context.newPage();

  console.log('🧪 Testing Mobile Menu After Fixes\n');

  try {
    // Test Hebrew page
    await page.goto('http://localhost:3005/he/home.html');
    await page.waitForTimeout(3000);

    console.log('📱 Initial State Check:');

    // 1. Check if menu is hidden on mobile
    const menuState = await page.evaluate(() => {
      const menu = document.querySelector('.w-nav-menu');
      if (!menu) return { exists: false };

      const styles = window.getComputedStyle(menu);
      return {
        exists: true,
        display: styles.display,
        visibility: styles.visibility,
        opacity: styles.opacity
      };
    });

    console.log(`   Menu exists: ${menuState.exists ? '✅' : '❌'}`);
    if (menuState.exists) {
      console.log(`   Display: ${menuState.display}`);
      console.log(`   Visibility: ${menuState.visibility}`);
      console.log(`   Opacity: ${menuState.opacity}`);

      const isHidden = menuState.display === 'none' ||
                       menuState.visibility === 'hidden' ||
                       menuState.opacity === '0';
      console.log(`   Menu hidden on mobile: ${isHidden ? '✅' : '❌'}`);
    }

    // 2. Check hamburger button
    const hamburgerState = await page.evaluate(() => {
      const btn = document.querySelector('.w-nav-button');
      if (!btn) return { exists: false };

      const styles = window.getComputedStyle(btn);
      const rect = btn.getBoundingClientRect();
      return {
        exists: true,
        display: styles.display,
        visibility: styles.visibility,
        position: `${rect.left}x${rect.top}`,
        size: `${rect.width}x${rect.height}`,
        visible: styles.display !== 'none' &&
                styles.visibility !== 'hidden' &&
                rect.width > 0 &&
                rect.height > 0
      };
    });

    console.log(`\n🍔 Hamburger Button:`);
    console.log(`   Exists: ${hamburgerState.exists ? '✅' : '❌'}`);
    if (hamburgerState.exists) {
      console.log(`   Display: ${hamburgerState.display}`);
      console.log(`   Visibility: ${hamburgerState.visibility}`);
      console.log(`   Position: ${hamburgerState.position}`);
      console.log(`   Size: ${hamburgerState.size}`);
      console.log(`   Is visible: ${hamburgerState.visible ? '✅' : '❌'}`);
    }

    // 3. Try to open menu
    if (hamburgerState.visible) {
      console.log(`\n🖱️  Testing Menu Toggle:`);

      await page.click('.w-nav-button', { force: true });
      await page.waitForTimeout(1000);

      const menuOpen = await page.evaluate(() => {
        return document.body.classList.contains('w--nav-menu-open');
      });

      console.log(`   Menu opened: ${menuOpen ? '✅' : '❌'}`);

      if (menuOpen) {
        // Check menu items
        const menuItems = await page.evaluate(() => {
          const items = document.querySelectorAll('.w-nav-menu .nav-link');
          return Array.from(items).map(item => ({
            text: item.textContent.trim(),
            display: window.getComputedStyle(item).display
          }));
        });

        console.log(`   Menu items: ${menuItems.length}`);
        menuItems.slice(0, 3).forEach(item => {
          console.log(`     - ${item.text} (${item.display})`);
        });

        // Close menu
        await page.click('.w-nav-button', { force: true });
        await page.waitForTimeout(1000);

        const menuClosed = await page.evaluate(() => {
          return !document.body.classList.contains('w--nav-menu-open');
        });

        console.log(`   Menu closed: ${menuClosed ? '✅' : '❌'}`);
      }
    }

    // Take screenshot
    await page.screenshot({ path: 'mobile-menu-test-fixed.png' });
    console.log('\n📸 Screenshot saved: mobile-menu-test-fixed.png');

    console.log('\n' + '='.repeat(50));
    console.log('✅ Mobile menu test complete!');

  } catch (error) {
    console.error('❌ Test error:', error.message);
  } finally {
    await browser.close();
  }
}

testMobileMenuFixed().catch(console.error);