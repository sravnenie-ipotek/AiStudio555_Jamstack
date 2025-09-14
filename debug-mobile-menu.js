/**
 * Debug Mobile Menu Scripts
 * Check what scripts are running and interfering
 */

const { chromium } = require('playwright');

async function debugMobileMenu() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 375, height: 667 }
  });

  const page = await context.newPage();

  try {
    console.log('🔍 Debugging Hebrew mobile menu...');
    await page.goto('http://localhost:3005/he/home.html');
    await page.waitForTimeout(2000);

    // Check what scripts are loaded
    const scripts = await page.evaluate(() => {
      const scriptTags = Array.from(document.querySelectorAll('script[src]'));
      return scriptTags.map(s => s.src);
    });

    console.log('📜 Loaded scripts:');
    scripts.forEach(script => {
      if (script.includes('mobile-menu') || script.includes('menu')) {
        console.log(`   ✅ ${script}`);
      }
    });

    // Check console messages
    const logs = [];
    page.on('console', msg => {
      logs.push(`${msg.type()}: ${msg.text()}`);
    });

    // Trigger the menu and capture logs
    console.log('🖱️  Testing menu interaction...');
    await page.click('.w-nav-button', { force: true });
    await page.waitForTimeout(1000);

    console.log('📝 Console logs:');
    logs.forEach(log => {
      if (log.includes('menu') || log.includes('Menu')) {
        console.log(`   ${log}`);
      }
    });

    // Check current state
    const debugInfo = await page.evaluate(() => {
      return {
        bodyClasses: document.body.className,
        menuDisplay: window.getComputedStyle(document.querySelector('.w-nav-menu')).display,
        overlayDisplay: window.getComputedStyle(document.querySelector('.w-nav-overlay') || document.createElement('div')).display,
        hamburgerExists: !!document.querySelector('.w-nav-button'),
        debugFunctions: !!window.mobileMenuDebug
      };
    });

    console.log('🔍 Debug info:');
    console.log(`   Body classes: ${debugInfo.bodyClasses}`);
    console.log(`   Menu display: ${debugInfo.menuDisplay}`);
    console.log(`   Overlay display: ${debugInfo.overlayDisplay}`);
    console.log(`   Hamburger exists: ${debugInfo.hamburgerExists}`);
    console.log(`   Debug functions: ${debugInfo.debugFunctions}`);

    // Try manual close
    if (debugInfo.debugFunctions) {
      console.log('🔧 Trying manual close...');
      await page.evaluate(() => {
        window.mobileMenuDebug.closeMenu();
      });
      await page.waitForTimeout(500);

      const afterManualClose = await page.evaluate(() => {
        return document.body.classList.contains('w--nav-menu-open');
      });

      console.log(`   Menu closed manually: ${!afterManualClose}`);
    }

  } catch (error) {
    console.error('❌ Debug error:', error.message);
  } finally {
    await browser.close();
  }
}

debugMobileMenu().catch(console.error);