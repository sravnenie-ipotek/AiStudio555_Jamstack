const { chromium } = require('playwright');

async function testFixedPage() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('🧪 Testing teachers page with animation fix...');

  // Capture console messages
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('Webflow') || text.includes('Animated') || text.includes('Fixed')) {
      console.log(`📝 ${text}`);
    }
  });

  try {
    console.log('\n🌐 Loading page...');
    await page.goto('http://localhost:3005/en/teachers.html');

    console.log('\n⏱️  Waiting for animations...');
    await page.waitForTimeout(3000);

    // Check if elements are now visible
    const hiddenElements = await page.locator('[style*="opacity:0"], [style*="opacity: 0"]').count();
    const visibleInstructors = await page.locator('.instructor-card-enhanced:visible').count();
    const heroVisible = await page.locator('.hero-content-enhanced').isVisible();
    const gridVisible = await page.locator('#instructors-grid').isVisible();

    console.log(`\n📊 Results after fix:`);
    console.log(`   Hidden elements: ${hiddenElements}`);
    console.log(`   Visible instructor cards: ${visibleInstructors}`);
    console.log(`   Hero section visible: ${heroVisible}`);
    console.log(`   Instructor grid visible: ${gridVisible}`);

    // Check if instructor grid has proper opacity
    const gridOpacity = await page.locator('#instructors-grid').evaluate(el =>
      window.getComputedStyle(el).opacity
    );
    console.log(`   Grid opacity: ${gridOpacity}`);

    // Take screenshot
    await page.screenshot({ path: 'teachers-fixed-test.png', fullPage: true });
    console.log('\n📸 Screenshot saved as teachers-fixed-test.png');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }

  await browser.close();
}

testFixedPage();