const { chromium } = require('playwright');

async function testPageDetailed() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('🔍 Detailed teachers page analysis...');

  // Capture console messages
  const consoleMessages = [];
  page.on('console', msg => {
    const text = msg.text();
    consoleMessages.push(`${msg.type()}: ${text}`);
    console.log(`📝 Console ${msg.type()}: ${text}`);
  });

  // Capture network failures
  page.on('response', response => {
    if (!response.ok()) {
      console.log(`🚫 Failed request: ${response.status()} ${response.url()}`);
    }
  });

  try {
    console.log('\n🌐 Navigating to page...');
    await page.goto('http://localhost:3005/en/teachers.html');

    console.log('\n⏱️  Waiting for initial load...');
    await page.waitForTimeout(2000);

    // Check if page has content
    const bodyText = await page.textContent('body');
    console.log(`\n📏 Total page text length: ${bodyText.length} characters`);

    // Check specific sections
    const heroSection = await page.locator('section.hero-enhanced').count();
    const instructorGrid = await page.locator('.instructor-grid-enhanced').count();
    const instructorCards = await page.locator('.instructor-card-enhanced').count();

    console.log(`\n📊 Section counts:`);
    console.log(`   Hero sections: ${heroSection}`);
    console.log(`   Instructor grids: ${instructorGrid}`);
    console.log(`   Instructor cards: ${instructorCards}`);

    // Check if sections are visible
    const heroVisible = await page.locator('section.hero-enhanced').isVisible();
    const gridVisible = await page.locator('.instructor-grid-enhanced').isVisible();

    console.log(`\n👁️  Visibility:`);
    console.log(`   Hero visible: ${heroVisible}`);
    console.log(`   Grid visible: ${gridVisible}`);

    // Check CSS/styling issues
    const gridOpacity = await page.locator('.instructor-grid-enhanced').getAttribute('style');
    console.log(`\n🎨 Grid styling: ${gridOpacity}`);

    // Check for loading states or empty content
    const loadingElements = await page.locator('[style*="opacity:0"]').count();
    console.log(`\n⏳ Elements with opacity:0: ${loadingElements}`);

    // Wait longer to see if content appears
    console.log('\n⏱️  Waiting longer for dynamic content...');
    await page.waitForTimeout(5000);

    // Check again after waiting
    const finalCardCount = await page.locator('.instructor-card-enhanced').count();
    const finalVisible = await page.locator('.instructor-grid-enhanced').isVisible();

    console.log(`\n📊 After 5 seconds:`);
    console.log(`   Cards: ${finalCardCount}`);
    console.log(`   Grid visible: ${finalVisible}`);

    // Check if JavaScript is working
    const jsWorking = await page.evaluate(() => {
      return typeof window !== 'undefined' && typeof document !== 'undefined';
    });
    console.log(`\n🔧 JavaScript working: ${jsWorking}`);

    // Take screenshot
    await page.screenshot({ path: 'teachers-detailed-test.png', fullPage: true });
    console.log('\n📸 Screenshot saved as teachers-detailed-test.png');

    console.log(`\n📋 Total console messages: ${consoleMessages.length}`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }

  await browser.close();
}

testPageDetailed();