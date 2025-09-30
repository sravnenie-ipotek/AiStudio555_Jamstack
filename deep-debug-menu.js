const { chromium } = require('playwright');

(async () => {
  console.log('🔍 DEEP DEBUG: Menu Opening Investigation\n');

  const browser = await chromium.launch({
    headless: false,
    slowMo: 1000,
    devtools: true // Open devtools for manual inspection
  });

  const context = await browser.newContext({
    viewport: { width: 375, height: 667 }
  });
  const page = await context.newPage();

  try {
    await page.goto('http://localhost:3000/en/career-orientation.html?locale=he');
    await page.waitForTimeout(3000);

    console.log('📱 Page loaded, analyzing menu structure...\n');

    // Deep analysis function
    const analyzeMenuState = async (label) => {
      const state = await page.evaluate(() => {
        const navbar = document.querySelector('.navbar, .w-nav');
        const menuButton = document.querySelector('.menu-button, .w-nav-button');
        const navMenu = document.querySelector('.nav-menu, .w-nav-menu');

        const getComputedStyleProps = (element, props) => {
          if (!element) return null;
          const computed = window.getComputedStyle(element);
          const result = {};
          props.forEach(prop => {
            result[prop] = computed.getPropertyValue(prop);
          });
          return result;
        };

        return {
          navbar: {
            exists: !!navbar,
            classes: navbar ? navbar.className : 'NOT FOUND',
            hasWebflowClasses: navbar ? navbar.classList.contains('w--open') : false
          },
          menuButton: {
            exists: !!menuButton,
            classes: menuButton ? menuButton.className : 'NOT FOUND',
            hasOpenClass: menuButton ? menuButton.classList.contains('w--open') : false,
            styles: getComputedStyleProps(menuButton, ['display', 'visibility', 'opacity', 'z-index'])
          },
          navMenu: {
            exists: !!navMenu,
            classes: navMenu ? navMenu.className : 'NOT FOUND',
            styles: getComputedStyleProps(navMenu, [
              'display', 'visibility', 'opacity', 'position', 'transform',
              'left', 'right', 'top', 'bottom', 'z-index', 'max-height',
              'overflow', 'width', 'height'
            ]),
            boundingBox: navMenu ? {
              x: navMenu.getBoundingClientRect().x,
              y: navMenu.getBoundingClientRect().y,
              width: navMenu.getBoundingClientRect().width,
              height: navMenu.getBoundingClientRect().height,
              visible: navMenu.getBoundingClientRect().width > 0 && navMenu.getBoundingClientRect().height > 0
            } : null
          },
          webflowReady: typeof window.Webflow !== 'undefined' && window.Webflow.ready
        };
      });

      console.log(`🔍 ${label}:`);
      console.log(`   Navbar: ${state.navbar.exists ? '✅' : '❌'} | Classes: ${state.navbar.classes}`);
      console.log(`   Button: ${state.menuButton.exists ? '✅' : '❌'} | w--open: ${state.menuButton.hasOpenClass ? '✅' : '❌'}`);
      console.log(`   Menu exists: ${state.navMenu.exists ? '✅' : '❌'}`);

      if (state.navMenu.exists) {
        console.log(`   Menu display: ${state.navMenu.styles.display}`);
        console.log(`   Menu visibility: ${state.navMenu.styles.visibility}`);
        console.log(`   Menu opacity: ${state.navMenu.styles.opacity}`);
        console.log(`   Menu position: ${state.navMenu.styles.position}`);
        console.log(`   Menu transform: ${state.navMenu.styles.transform}`);
        console.log(`   Menu z-index: ${state.navMenu.styles.zIndex}`);
        console.log(`   Menu bounding box: ${JSON.stringify(state.navMenu.boundingBox)}`);
      }

      console.log(`   Webflow ready: ${state.webflowReady ? '✅' : '❌'}\n`);
      return state;
    };

    // 1. Analyze initial state
    const beforeState = await analyzeMenuState('BEFORE CLICK');

    // 2. Click the menu button
    const menuButton = await page.$('.menu-button, .w-nav-button');
    if (menuButton) {
      console.log('🖱️ Clicking menu button...\n');
      await menuButton.click();
      await page.waitForTimeout(1000); // Wait for animation

      // 3. Analyze after click
      const afterState = await analyzeMenuState('AFTER CLICK');

      // 4. Take screenshots
      await page.screenshot({ path: 'debug-before-click.png' });
      console.log('📸 Screenshot saved: debug-before-click.png\n');

      // 5. Check if Webflow is managing the menu correctly
      console.log('🔧 Testing Webflow nav methods...');
      const webflowTest = await page.evaluate(() => {
        if (window.Webflow && window.Webflow.ready) {
          const nav = document.querySelector('.w-nav');
          if (nav) {
            // Try to get Webflow's nav instance
            return {
              hasWebflowNav: true,
              navElement: nav.outerHTML.substring(0, 200) + '...',
              webflowMethods: Object.keys(window.Webflow).filter(key => typeof window.Webflow[key] === 'function')
            };
          }
        }
        return { hasWebflowNav: false };
      });

      console.log('Webflow nav test:', webflowTest);

      // 6. Check for CSS conflicts
      console.log('\n🎨 Checking for CSS conflicts...');
      const cssConflicts = await page.evaluate(() => {
        const navMenu = document.querySelector('.nav-menu, .w-nav-menu');
        if (!navMenu) return null;

        // Get all CSS rules that might affect the menu
        const rules = [];
        for (let sheet of document.styleSheets) {
          try {
            for (let rule of sheet.cssRules || sheet.rules) {
              if (rule.selectorText && (
                rule.selectorText.includes('.nav-menu') ||
                rule.selectorText.includes('.w-nav-menu') ||
                rule.selectorText.includes('.w-nav')
              )) {
                rules.push({
                  selector: rule.selectorText,
                  styles: rule.style.cssText
                });
              }
            }
          } catch (e) {
            // Skip external stylesheets
          }
        }
        return rules;
      });

      console.log('CSS rules affecting nav menu:');
      cssConflicts?.forEach(rule => {
        console.log(`   ${rule.selector}: ${rule.styles}`);
      });

      // 7. Final diagnostic
      console.log('\n🏁 DIAGNOSTIC SUMMARY:');
      console.log(`Button responds to click: ${afterState.menuButton.hasOpenClass ? '✅ YES' : '❌ NO'}`);
      console.log(`Menu visible after click: ${afterState.navMenu.boundingBox?.visible ? '✅ YES' : '❌ NO'}`);
      console.log(`Webflow functioning: ${afterState.webflowReady ? '✅ YES' : '❌ NO'}`);

      if (afterState.menuButton.hasOpenClass && !afterState.navMenu.boundingBox?.visible) {
        console.log('\n🎯 ISSUE IDENTIFIED: Button works but menu not visible!');
        console.log('   This is likely a CSS positioning/visibility issue.');
      }

    } else {
      console.log('❌ Menu button not found!');
    }

  } catch (error) {
    console.error('❌ Error during debug:', error);
  } finally {
    // Keep browser open for manual inspection
    console.log('\n🔍 Browser kept open for manual inspection...');
    // Don't close browser automatically - user can inspect manually
    // await browser.close();
  }
})();