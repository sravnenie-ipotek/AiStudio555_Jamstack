const { chromium } = require('playwright');

async function testTeachersPage() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('🎭 Testing teachers page...');

  try {
    // Navigate to the teachers page
    await page.goto('http://localhost:3005/en/teachers.html');

    // Wait for page to load
    await page.waitForTimeout(3000);

    // Check for instructor cards
    const instructorCards = await page.locator('.instructor-card-enhanced').count();
    console.log(`📊 Found ${instructorCards} instructor cards`);

    // Check if any instructor names are visible
    const instructorNames = await page.locator('.instructor-name').allTextContents();
    console.log('👥 Instructor names found:', instructorNames.slice(0, 5));

    // Check for any error messages in console
    const consoleMessages = [];
    page.on('console', msg => consoleMessages.push(msg.text()));

    // Wait a bit more for any console messages
    await page.waitForTimeout(2000);

    console.log('🔍 Console messages:', consoleMessages.filter(msg =>
      msg.includes('error') || msg.includes('404') || msg.includes('Using static content')
    ));

    // Check if the page shows loading or empty state
    const pageText = await page.textContent('body');
    const hasContent = pageText.includes('Sarah Chen') || pageText.includes('Industry Experts');
    console.log(`📄 Page has static content: ${hasContent}`);

    // Take a screenshot
    await page.screenshot({ path: 'teachers-page-test.png', fullPage: true });
    console.log('📸 Screenshot saved as teachers-page-test.png');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }

  await browser.close();
}

testTeachersPage();