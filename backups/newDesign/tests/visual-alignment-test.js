const { chromium } = require('playwright');

async function visualAlignmentTest() {
  console.log('🔍 Running visual alignment verification...');

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Test mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('http://localhost:3005/backups/newDesign/home.html');

  // Wait for page to load
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(3000);

  // Take screenshot before fix
  await page.screenshot({
    path: 'mobile-alignment-AFTER-fix.png',
    fullPage: true
  });

  console.log('📸 Screenshot saved: mobile-alignment-AFTER-fix.png');

  // Test specific elements for center alignment
  const elementsToCheck = [
    { selector: '.section-title', name: 'Section Title' },
    { selector: '.section-description-text', name: 'Description Text' },
    { selector: '.about-us-section-title-wrapper h2', name: 'About Us Title' },
    { selector: '.why-choose-us-section-title', name: 'Why Choose Us Title' }
  ];

  console.log('\n🎯 Checking text alignment for key elements:');

  for (const element of elementsToCheck) {
    try {
      const locator = page.locator(element.selector).first();
      if (await locator.isVisible()) {
        const textAlign = await locator.evaluate(el => window.getComputedStyle(el).textAlign);
        const text = await locator.textContent();

        console.log(`✅ ${element.name}: ${textAlign} - "${text?.trim().substring(0, 30)}..."`);
      } else {
        console.log(`⚠️  ${element.name}: Not visible`);
      }
    } catch (error) {
      console.log(`❌ ${element.name}: Error - ${error.message}`);
    }
  }

  // Test different viewport sizes
  const viewports = [
    { name: 'iPhone-375', width: 375, height: 667 },
    { name: 'iPhone-390', width: 390, height: 844 },
    { name: 'iPad-768', width: 768, height: 1024 }
  ];

  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: `mobile-alignment-${viewport.name}-AFTER-fix.png`,
      fullPage: true
    });

    console.log(`📸 Screenshot saved: mobile-alignment-${viewport.name}-AFTER-fix.png`);
  }

  await browser.close();
  console.log('\n✅ Visual alignment test completed! Check the screenshots to verify centering.');
}

// Run the test
visualAlignmentTest().catch(console.error);