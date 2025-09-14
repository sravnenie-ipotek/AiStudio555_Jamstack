/**
 * Final Test - Hebrew Pages Mobile Menu
 */

const { chromium } = require('playwright');

async function testFinalHebrewPages() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 375, height: 667 }
  });

  const pages = ['he/home.html', 'he/courses.html', 'he/teachers.html', 'he/pricing.html'];
  let allGood = true;

  console.log('🧪 Final test - Hebrew mobile menu functionality...\n');

  for (const pagePath of pages) {
    const page = await context.newPage();

    try {
      console.log(`📄 Testing ${pagePath}...`);
      await page.goto(`http://localhost:3005/${pagePath}`);
      await page.waitForTimeout(2000);

      // Check initial state
      const initialState = await page.evaluate(() => {
        const menu = document.querySelector('.w-nav-menu');
        const styles = menu ? window.getComputedStyle(menu) : null;
        return {
          menuExists: !!menu,
          display: styles ? styles.display : 'none',
          visibility: styles ? styles.visibility : 'hidden',
          bodyHasOpenClass: document.body.classList.contains('w--nav-menu-open'),
          hamburgerVisible: !!document.querySelector('.w-nav-button')
        };
      });

      const isCorrect =
        initialState.menuExists &&
        initialState.display === 'none' &&
        initialState.visibility === 'hidden' &&
        !initialState.bodyHasOpenClass &&
        initialState.hamburgerVisible;

      if (isCorrect) {
        console.log(`   ✅ ${pagePath} - Mobile menu properly hidden on load`);
      } else {
        console.log(`   ❌ ${pagePath} - Issues: ${JSON.stringify(initialState)}`);
        allGood = false;
      }

    } catch (error) {
      console.log(`   ❌ ${pagePath} - Error: ${error.message}`);
      allGood = false;
    } finally {
      await page.close();
    }
  }

  console.log('\n' + '='.repeat(50));
  if (allGood) {
    console.log('🎉 SUCCESS: All Hebrew pages have properly hidden mobile menus!');
    console.log('✅ Mobile menu bug is completely fixed');
  } else {
    console.log('⚠️  Some pages still have issues');
  }
  console.log('='.repeat(50));

  await browser.close();
}

testFinalHebrewPages().catch(console.error);