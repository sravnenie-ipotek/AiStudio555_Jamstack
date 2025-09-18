const { chromium } = require('playwright');

(async () => {
  console.log('🔍 Visual Navbar Comparison Test\n');
  console.log('Comparing navbars between:');
  console.log('- popup-demo.html');
  console.log('- courses.html\n');

  const browser = await chromium.launch({
    headless: false,
    devtools: true
  });

  // Open both pages side by side
  const context1 = await browser.newContext({
    viewport: { width: 1400, height: 900 }
  });
  const context2 = await browser.newContext({
    viewport: { width: 1400, height: 900 }
  });

  const page1 = await context1.newPage();
  const page2 = await context2.newPage();

  // Load pages
  console.log('📱 Testing Desktop View (1400px width)...');
  await page1.goto('http://localhost:3005/backups/newDesign/tests/popup-demo.html');
  await page2.goto('http://localhost:3005/backups/newDesign/courses.html');

  await page1.waitForTimeout(2000);

  // Take desktop screenshots
  await page1.screenshot({
    path: 'navbar-popup-demo-desktop.png',
    clip: { x: 0, y: 0, width: 1400, height: 120 }
  });

  await page2.screenshot({
    path: 'navbar-courses-desktop.png',
    clip: { x: 0, y: 0, width: 1400, height: 120 }
  });

  console.log('✅ Desktop screenshots saved');

  // Test mobile view
  console.log('\n📱 Testing Mobile View (375px width)...');
  await page1.setViewportSize({ width: 375, height: 800 });
  await page2.setViewportSize({ width: 375, height: 800 });

  await page1.waitForTimeout(1000);

  // Take mobile screenshots
  await page1.screenshot({
    path: 'navbar-popup-demo-mobile.png',
    clip: { x: 0, y: 0, width: 375, height: 120 }
  });

  await page2.screenshot({
    path: 'navbar-courses-mobile.png',
    clip: { x: 0, y: 0, width: 375, height: 120 }
  });

  console.log('✅ Mobile screenshots saved');

  // Check for language pills
  const langPills1 = await page1.$$('.lang-pill');
  const langPills2 = await page2.$$('.lang-pill');

  console.log('\n🌍 Language Switcher Check:');
  console.log(`popup-demo.html: ${langPills1.length} language pills found`);
  console.log(`courses.html: ${langPills2.length} language pills found`);

  // Check button text visibility
  const buttonText1 = await page1.$eval('.primary-button-wrapper.desktop .primary-button-text-block',
    el => window.getComputedStyle(el).opacity);
  console.log('\n📝 Button Text Visibility:');
  console.log(`popup-demo.html button text opacity: ${buttonText1}`);

  // Test mobile menu
  console.log('\n📱 Testing Mobile Menu Toggle...');
  const menuButton1 = await page1.$('.menu-button');
  if (menuButton1) {
    await menuButton1.click();
    await page1.waitForTimeout(500);
    const menuVisible = await page1.$eval('.nav-menu',
      el => el.classList.contains('w--open'));
    console.log(`Mobile menu opens: ${menuVisible ? '✅' : '❌'}`);
  }

  // Test language switcher
  console.log('\n🌍 Testing Language Switcher...');
  await page1.setViewportSize({ width: 1400, height: 900 });
  await page1.waitForTimeout(500);

  const ruPill = await page1.$('.lang-pill:nth-child(2)');
  if (ruPill) {
    await ruPill.click();
    await page1.waitForTimeout(200);
    const isActive = await page1.$eval('.lang-pill:nth-child(2)',
      el => el.classList.contains('active'));
    console.log(`Language switcher works: ${isActive ? '✅' : '❌'}`);
  }

  console.log('\n✨ Comparison complete!');
  console.log('Check the generated screenshots to visually compare the navbars.');
  console.log('\nPress Ctrl+C to close the browsers...');

  // Keep browsers open for manual inspection
  await new Promise(() => {});
})();