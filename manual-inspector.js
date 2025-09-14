/**
 * Manual Inspector for Language Selector Details
 */

const puppeteer = require('puppeteer');

async function inspectLanguageSelector() {
  console.log('🔍 Detailed Language Selector Inspection...\n');

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox']
    });

    const page = await browser.newPage();
    await page.goto('http://localhost:3005/en/home.html', { waitUntil: 'networkidle2' });

    // ===================
    // DESKTOP INSPECTION
    // ===================
    console.log('=== DESKTOP VIEW DETAILED INSPECTION ===');
    await page.setViewport({ width: 1200, height: 800 });
    await page.waitForTimeout(1500);

    const desktopDetails = await page.evaluate(() => {
      const results = {};

      // Language selector details
      const selector = document.getElementById('language-switcher');
      if (selector) {
        const rect = selector.getBoundingClientRect();
        const style = window.getComputedStyle(selector);

        results.languageSelector = {
          exists: true,
          position: { x: Math.round(rect.x), y: Math.round(rect.y) },
          size: { width: Math.round(rect.width), height: Math.round(rect.height) },
          display: style.display,
          zIndex: style.zIndex,
          positioning: style.position,
          right: style.right,
          top: style.top
        };

        // Check select element
        const select = selector.querySelector('select');
        if (select) {
          const selectStyle = window.getComputedStyle(select);
          results.languageSelector.select = {
            background: selectStyle.backgroundColor,
            color: selectStyle.color,
            border: selectStyle.border,
            padding: selectStyle.padding,
            borderRadius: selectStyle.borderRadius
          };

          // Get options
          results.languageSelector.options = Array.from(select.options).map(opt => ({
            value: opt.value,
            text: opt.textContent.trim()
          }));
        }
      } else {
        results.languageSelector = { exists: false };
      }

      // Navigation details
      const navbar = document.querySelector('.navbar-content, .w-nav');
      if (navbar) {
        const navRect = navbar.getBoundingClientRect();
        results.navbar = {
          position: { x: Math.round(navRect.x), y: Math.round(navRect.y) },
          size: { width: Math.round(navRect.width), height: Math.round(navRect.height) }
        };

        // Check if language selector is within navbar bounds
        if (results.languageSelector.exists) {
          const selectorRect = results.languageSelector.position;
          results.selectorInNavbar = (
            selectorRect.y >= results.navbar.position.y &&
            selectorRect.y <= (results.navbar.position.y + results.navbar.size.height)
          );
        }
      }

      // Navigation menu positioning
      const navMenu = document.querySelector('.nav-menu');
      if (navMenu) {
        const menuRect = navMenu.getBoundingClientRect();
        results.navMenu = {
          position: { x: Math.round(menuRect.x), y: Math.round(menuRect.y) },
          size: { width: Math.round(menuRect.width), height: Math.round(menuRect.height) }
        };

        // Check spacing between nav menu and language selector
        if (results.languageSelector.exists) {
          const selectorX = results.languageSelector.position.x;
          const menuRightEdge = results.navMenu.position.x + results.navMenu.size.width;
          results.spaceBetweenNavAndSelector = selectorX - menuRightEdge;
        }
      }

      return results;
    });

    console.log('🖥️  Desktop Language Selector:');
    if (desktopDetails.languageSelector.exists) {
      const ls = desktopDetails.languageSelector;
      console.log(`   ✅ Found at position: x=${ls.position.x}, y=${ls.position.y}`);
      console.log(`   📏 Size: ${ls.size.width}x${ls.size.height}`);
      console.log(`   🎨 Styling: ${ls.positioning} positioning, z-index: ${ls.zIndex}`);
      console.log(`   📍 CSS position: top=${ls.top}, right=${ls.right}`);

      if (ls.options) {
        console.log(`   🌍 Languages: ${ls.options.map(opt => opt.text).join(', ')}`);
      }

      if (desktopDetails.selectorInNavbar !== undefined) {
        console.log(`   🧭 Positioned within navbar: ${desktopDetails.selectorInNavbar ? 'Yes ✅' : 'No ❌'}`);
      }

      if (desktopDetails.spaceBetweenNavAndSelector !== undefined) {
        console.log(`   📐 Space from nav menu: ${desktopDetails.spaceBetweenNavAndSelector}px`);
      }
    } else {
      console.log('   ❌ NOT FOUND');
    }

    // ===================
    // MOBILE INSPECTION
    // ===================
    console.log('\n=== MOBILE VIEW DETAILED INSPECTION ===');
    await page.setViewport({ width: 375, height: 667 });
    await page.waitForTimeout(1500);

    const mobileDetails = await page.evaluate(() => {
      const results = {};

      // Check if desktop selector is hidden
      const desktopSelector = document.getElementById('language-switcher');
      if (desktopSelector) {
        const style = window.getComputedStyle(desktopSelector);
        const rect = desktopSelector.getBoundingClientRect();
        results.desktopSelectorHidden = {
          display: style.display,
          visible: rect.width > 0 && rect.height > 0,
          properlyHidden: style.display === 'none' || rect.width === 0
        };
      }

      // Hamburger button details
      const hamburger = document.querySelector('.w-nav-button');
      if (hamburger) {
        const rect = hamburger.getBoundingClientRect();
        const style = window.getComputedStyle(hamburger);
        results.hamburger = {
          exists: true,
          position: { x: Math.round(rect.x), y: Math.round(rect.y) },
          size: { width: Math.round(rect.width), height: Math.round(rect.height) },
          display: style.display,
          visible: rect.width > 0 && rect.height > 0
        };
      }

      // Menu state
      results.menuInitialState = {
        bodyHasOpenClass: document.body.classList.contains('w--nav-menu-open'),
        htmlHasOpenClass: document.documentElement.classList.contains('w--nav-menu-open')
      };

      return results;
    });

    console.log('📱 Mobile Desktop Selector Hidden:');
    if (mobileDetails.desktopSelectorHidden) {
      const ds = mobileDetails.desktopSelectorHidden;
      console.log(`   Display property: ${ds.display}`);
      console.log(`   Visible in viewport: ${ds.visible ? 'Yes ❌' : 'No ✅'}`);
      console.log(`   Properly hidden: ${ds.properlyHidden ? 'Yes ✅' : 'No ❌'}`);
    }

    console.log('\n🍔 Mobile Hamburger Button:');
    if (mobileDetails.hamburger && mobileDetails.hamburger.exists) {
      const hb = mobileDetails.hamburger;
      console.log(`   ✅ Found at position: x=${hb.position.x}, y=${hb.position.y}`);
      console.log(`   📏 Size: ${hb.size.width}x${hb.size.height}`);
      console.log(`   👁️  Visible: ${hb.visible ? 'Yes ✅' : 'No ❌'}`);
      console.log(`   🎨 Display: ${hb.display}`);
    } else {
      console.log('   ❌ NOT FOUND');
    }

    console.log('\n📱 Mobile Menu Initial State:');
    const menuState = mobileDetails.menuInitialState;
    console.log(`   Body has open class: ${menuState.bodyHasOpenClass ? 'Yes ❌' : 'No ✅'}`);
    console.log(`   HTML has open class: ${menuState.htmlHasOpenClass ? 'Yes ❌' : 'No ✅'}`);
    console.log(`   Menu starts closed: ${!menuState.bodyHasOpenClass && !menuState.htmlHasOpenClass ? 'Yes ✅' : 'No ❌'}`);

    // Test hamburger click
    if (mobileDetails.hamburger && mobileDetails.hamburger.exists) {
      console.log('\n🔄 Testing hamburger click...');
      await page.click('.w-nav-button');
      await page.waitForTimeout(800);

      const afterClick = await page.evaluate(() => {
        const results = {};

        // Menu state after click
        results.menuOpen = {
          bodyHasOpenClass: document.body.classList.contains('w--nav-menu-open'),
          htmlHasOpenClass: document.documentElement.classList.contains('w--nav-menu-open')
        };

        // Menu visibility
        const menu = document.querySelector('.w-nav-menu');
        if (menu) {
          const style = window.getComputedStyle(menu);
          const rect = menu.getBoundingClientRect();
          results.menuVisibility = {
            display: style.display,
            opacity: style.opacity,
            visibility: style.visibility,
            hasSize: rect.width > 0 && rect.height > 0
          };
        }

        // Look for mobile language selector
        const mobileSelector = document.querySelector('.mobile-language-selector, #mobile-language-select');
        if (mobileSelector) {
          const rect = mobileSelector.getBoundingClientRect();
          results.mobileLangSelector = {
            found: true,
            visible: rect.width > 0 && rect.height > 0,
            position: { x: Math.round(rect.x), y: Math.round(rect.y) }
          };

          // Check if it's a select element
          const select = mobileSelector.tagName === 'SELECT' ? mobileSelector : mobileSelector.querySelector('select');
          if (select) {
            results.mobileLangSelector.options = Array.from(select.options).map(opt => ({
              value: opt.value,
              text: opt.textContent.trim()
            }));
          }
        } else {
          results.mobileLangSelector = { found: false };
        }

        return results;
      });

      console.log('\n📱 After hamburger click:');
      const menuAfter = afterClick.menuOpen;
      console.log(`   Menu opened: ${menuAfter.bodyHasOpenClass || menuAfter.htmlHasOpenClass ? 'Yes ✅' : 'No ❌'}`);

      if (afterClick.menuVisibility) {
        const mv = afterClick.menuVisibility;
        console.log(`   Menu display: ${mv.display}`);
        console.log(`   Menu opacity: ${mv.opacity}`);
        console.log(`   Menu has size: ${mv.hasSize ? 'Yes ✅' : 'No ❌'}`);
      }

      console.log('\n🌍 Mobile Language Selector in Menu:');
      if (afterClick.mobileLangSelector.found) {
        const mls = afterClick.mobileLangSelector;
        console.log(`   ✅ Found at position: x=${mls.position.x}, y=${mls.position.y}`);
        console.log(`   👁️  Visible: ${mls.visible ? 'Yes ✅' : 'No ❌'}`);
        if (mls.options) {
          console.log(`   🌍 Languages: ${mls.options.map(opt => opt.text).join(', ')}`);
        }
      } else {
        console.log('   ❌ NOT FOUND in menu');
      }
    }

    console.log('\n🎉 Detailed inspection complete!');

  } catch (error) {
    console.error('❌ Inspection failed:', error.message);
  } finally {
    if (browser) await browser.close();
  }
}

inspectLanguageSelector();