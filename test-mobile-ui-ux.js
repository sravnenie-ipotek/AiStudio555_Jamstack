/**
 * Test Mobile Menu UI/UX Improvements
 */

const { chromium } = require('playwright');

async function testMobileUIUX() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 375, height: 667 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15'
  });

  const page = await context.newPage();

  try {
    console.log('🧪 Testing improved mobile menu UI/UX...\n');

    await page.goto('http://localhost:3005/he/courses.html');
    await page.waitForTimeout(2000);

    // 1. Check initial state
    console.log('📱 Initial State:');
    const initialState = await page.evaluate(() => {
      const menu = document.querySelector('.w-nav-menu');
      const hamburger = document.querySelector('.w-nav-button');
      return {
        menuHidden: menu ? window.getComputedStyle(menu).display === 'none' : false,
        hamburgerVisible: hamburger ? window.getComputedStyle(hamburger).display === 'block' : false
      };
    });
    console.log(`   Menu hidden: ${initialState.menuHidden ? '✅' : '❌'}`);
    console.log(`   Hamburger visible: ${initialState.hamburgerVisible ? '✅' : '❌'}`);

    // 2. Open menu
    console.log('\n🖱️  Opening menu...');
    await page.click('.w-nav-button');
    await page.waitForTimeout(500);

    // 3. Check menu items display
    const menuItemsInfo = await page.evaluate(() => {
      const menuOpen = document.body.classList.contains('w--nav-menu-open');
      const menuLinks = Array.from(document.querySelectorAll('.w-nav-menu .nav-link'));
      const linkStyles = menuLinks.map(link => {
        const styles = window.getComputedStyle(link);
        return {
          text: link.textContent.trim(),
          display: styles.display,
          padding: styles.padding,
          fontSize: styles.fontSize,
          borderBottom: styles.borderBottom
        };
      });

      return {
        menuOpen,
        linkCount: menuLinks.length,
        linkStyles: linkStyles.slice(0, 3) // Show first 3 for sample
      };
    });

    console.log(`   Menu opened: ${menuItemsInfo.menuOpen ? '✅' : '❌'}`);
    console.log(`   Menu items found: ${menuItemsInfo.linkCount}`);

    if (menuItemsInfo.linkStyles.length > 0) {
      console.log('\n📋 Menu Item Styling Sample:');
      menuItemsInfo.linkStyles.forEach(item => {
        console.log(`   "${item.text}":`);
        console.log(`      Display: ${item.display}`);
        console.log(`      Font size: ${item.fontSize}`);
        console.log(`      Padding: ${item.padding}`);
      });
    }

    // 4. Check dropdown functionality
    const dropdownInfo = await page.evaluate(() => {
      const dropdown = document.querySelector('.menu-dropdown-wrapper');
      if (!dropdown) return null;

      const toggle = dropdown.querySelector('.dropdown-toggle');
      const list = dropdown.querySelector('.dropdown-list');

      return {
        hasDropdown: true,
        toggleDisplay: toggle ? window.getComputedStyle(toggle).display : 'none',
        listDisplay: list ? window.getComputedStyle(list).display : 'none'
      };
    });

    if (dropdownInfo) {
      console.log('\n📂 Dropdown Menu:');
      console.log(`   Toggle visible: ${dropdownInfo.toggleDisplay !== 'none' ? '✅' : '❌'}`);
      console.log(`   Submenu display: ${dropdownInfo.listDisplay}`);
    }

    // 5. Test hamburger animation to X
    const hamburgerTransformed = await page.evaluate(() => {
      const icon = document.querySelector('.w-nav-button .w-icon-nav-menu');
      if (!icon) return false;

      const beforeEl = window.getComputedStyle(icon, '::before');
      return beforeEl.transform && beforeEl.transform !== 'none';
    });

    console.log(`\n🎨 Visual Effects:`);
    console.log(`   Hamburger → X animation: ${hamburgerTransformed ? '✅' : '⚠️ No animation detected'}`);

    // 6. Close menu
    await page.click('.w-nav-button');
    await page.waitForTimeout(500);

    const menuClosed = await page.evaluate(() => {
      return !document.body.classList.contains('w--nav-menu-open');
    });

    console.log(`   Menu closes properly: ${menuClosed ? '✅' : '❌'}`);

    // Summary
    console.log('\n' + '='.repeat(50));
    const allGood = initialState.menuHidden && initialState.hamburgerVisible &&
                    menuItemsInfo.menuOpen && menuClosed;

    if (allGood) {
      console.log('🎉 SUCCESS: Mobile menu UI/UX is working properly!');
    } else {
      console.log('⚠️  Some UI/UX issues remain');
    }
    console.log('='.repeat(50));

  } catch (error) {
    console.error('❌ Test error:', error.message);
  } finally {
    await browser.close();
  }
}

testMobileUIUX().catch(console.error);