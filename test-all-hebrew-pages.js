/**
 * Test Mobile Menu Fix Across All Hebrew Pages
 */

const { chromium } = require('playwright');

async function testAllHebrewPages() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 375, height: 667 }
  });

  const hebrewPages = [
    'he/home.html',
    'he/courses.html',
    'he/teachers.html',
    'he/pricing.html',
    'he/career-center.html',
    'he/career-orientation.html',
    'he/blog.html'
  ];

  let allPassed = true;

  console.log('🧪 Testing mobile menu across all Hebrew pages...\n');

  for (const pagePath of hebrewPages) {
    const page = await context.newPage();

    try {
      console.log(`📄 Testing ${pagePath}...`);

      await page.goto(`http://localhost:3005/${pagePath}`);
      await page.waitForTimeout(2000);

      // Check initial state
      const bodyHasOpenClass = await page.evaluate(() => {
        return document.body.classList.contains('w--nav-menu-open');
      });

      const hamburgerVisible = await page.isVisible('.w-nav-button');

      if (!bodyHasOpenClass && hamburgerVisible) {
        // Test hamburger click
        const hamburgerBox = await page.locator('.w-nav-button').boundingBox();
        if (hamburgerBox) {
          const x = hamburgerBox.x + hamburgerBox.width / 2;
          const y = hamburgerBox.y + hamburgerBox.height / 2;

          await page.mouse.click(x, y);
          await page.waitForTimeout(500);

          const menuOpened = await page.evaluate(() => {
            return document.body.classList.contains('w--nav-menu-open');
          });

          if (menuOpened) {
            // Test closing
            await page.mouse.click(x, y);
            await page.waitForTimeout(500);

            const menuClosed = await page.evaluate(() => {
              return !document.body.classList.contains('w--nav-menu-open');
            });

            if (menuClosed) {
              console.log(`   ✅ ${pagePath} - Mobile menu works correctly`);
            } else {
              console.log(`   ❌ ${pagePath} - Menu doesn't close`);
              allPassed = false;
            }
          } else {
            console.log(`   ❌ ${pagePath} - Menu doesn't open`);
            allPassed = false;
          }
        }
      } else {
        console.log(`   ❌ ${pagePath} - Initial state wrong (open: ${bodyHasOpenClass}, hamburger: ${hamburgerVisible})`);
        allPassed = false;
      }

    } catch (error) {
      console.log(`   ❌ ${pagePath} - Error: ${error.message}`);
      allPassed = false;
    } finally {
      await page.close();
    }
  }

  console.log('\n' + '='.repeat(50));
  if (allPassed) {
    console.log('🎉 SUCCESS: Mobile menu works correctly on all Hebrew pages!');
  } else {
    console.log('⚠️  Some pages have issues with mobile menu functionality');
  }
  console.log('='.repeat(50));

  await browser.close();
}

testAllHebrewPages().catch(console.error);