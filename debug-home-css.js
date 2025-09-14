/**
 * Debug Home Page CSS Issues
 */

const { chromium } = require('playwright');

async function debugHomeCss() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 375, height: 667 }
  });

  const page = await context.newPage();

  try {
    console.log('🔍 Debugging Hebrew home page CSS...');

    await page.goto('http://localhost:3005/he/home.html');
    await page.waitForTimeout(3000);

    const cssDebug = await page.evaluate(() => {
      const menu = document.querySelector('.w-nav-menu');
      if (!menu) return null;

      return {
        // Check inline styles
        inlineStyle: menu.getAttribute('style'),

        // Check all classes on the menu
        classList: Array.from(menu.classList),

        // Check parent elements and their classes
        parentClasses: menu.parentElement ? Array.from(menu.parentElement.classList) : [],

        // Check if there are any style elements affecting this
        styleElements: Array.from(document.querySelectorAll('style')).map(style =>
          style.textContent.includes('.w-nav-menu') ?
          style.textContent.substring(0, 200) + '...' : null
        ).filter(Boolean),

        // Get all CSS rules that apply to this element
        appliedStyles: window.getComputedStyle(menu)
      };
    });

    console.log('🎨 CSS Debug Info:');
    console.log('Inline styles:', cssDebug.inlineStyle);
    console.log('Menu classes:', cssDebug.classList);
    console.log('Parent classes:', cssDebug.parentClasses);
    console.log('Relevant style elements:', cssDebug.styleElements.length);

    // Check if the shared-menu-component.js styles are being applied
    const sharedMenuStyles = await page.evaluate(() => {
      const sharedStyles = document.getElementById('shared-menu-styles');
      return {
        exists: !!sharedStyles,
        content: sharedStyles ? sharedStyles.textContent.includes('@media screen and (max-width: 991px)') : false
      };
    });

    console.log('Shared menu styles:', sharedMenuStyles);

  } catch (error) {
    console.error('❌ Debug error:', error.message);
  } finally {
    await browser.close();
  }
}

debugHomeCss().catch(console.error);