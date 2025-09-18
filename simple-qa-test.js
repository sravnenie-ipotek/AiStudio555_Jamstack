// Simple QA test for production course loading
const { chromium } = require('playwright');

async function runQA() {
  console.log('🎯 Starting Production QA Test for Course Loading...');

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Monitor console and network
  const consoleErrors = [];
  const apiCalls = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
      console.log('❌ Console Error:', msg.text());
    }
  });

  page.on('response', response => {
    if (response.url().includes('/api/')) {
      apiCalls.push({
        url: response.url(),
        status: response.status()
      });
      console.log(`📡 API: ${response.status()} ${response.url()}`);
    }
  });

  try {
    console.log('🌐 Navigating to https://www.aistudio555.com/en/');
    await page.goto('https://www.aistudio555.com/en/', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    console.log('⏳ Waiting 5 seconds for JavaScript to execute...');
    await page.waitForTimeout(5000);

    // Check for courses
    console.log('🔍 Checking for course content...');

    const courseCards = await page.locator('.course-card, .featured-courses-single, [data-course-id], .course-item, .collection-item').count();
    console.log(`📊 Course cards found: ${courseCards}`);

    const noItemsFound = await page.locator(':has-text("No items found")').count();
    console.log(`🚫 "No items found" text: ${noItemsFound}`);

    // Check for course titles/text content
    const courseText = await page.locator('text=/React|Python|Node|Development|Machine Learning/i').count();
    console.log(`📝 Course-related text found: ${courseText}`);

    // Check for loading indicators
    const loadingText = await page.locator('text=/Loading|Wait/i').count();
    console.log(`⏳ Loading indicators: ${loadingText}`);

    // Take screenshot
    await page.screenshot({ path: 'qa-production-result.png', fullPage: true });
    console.log('📸 Screenshot saved: qa-production-result.png');

    // Analysis
    console.log('\n📊 QA RESULTS:');
    console.log(`✅ Console errors: ${consoleErrors.length}`);
    console.log(`📡 API calls made: ${apiCalls.length}`);
    console.log(`📚 Course cards: ${courseCards}`);
    console.log(`🚫 "No items found": ${noItemsFound}`);
    console.log(`📝 Course content: ${courseText}`);

    // Check API calls
    const failedAPIs = apiCalls.filter(call => call.status >= 400);
    const courseAPIs = apiCalls.filter(call => call.url.includes('/api/courses'));

    console.log(`❌ Failed API calls: ${failedAPIs.length}`);
    console.log(`🎯 Course API calls: ${courseAPIs.length}`);

    if (courseAPIs.length > 0) {
      console.log('📡 Course API details:');
      courseAPIs.forEach(api => console.log(`   ${api.status} ${api.url}`));
    }

    // Final assessment
    console.log('\n🎯 ASSESSMENT:');
    if (noItemsFound < 2 && (courseCards > 0 || courseText > 0)) {
      console.log('✅ SUCCESS: Courses appear to be loading correctly!');
    } else {
      console.log('❌ ISSUE: Courses may not be loading properly');
    }

    if (failedAPIs.length === 0) {
      console.log('✅ SUCCESS: No failed API calls');
    } else {
      console.log('⚠️ WARNING: Some API calls failed');
      failedAPIs.forEach(api => console.log(`   ${api.status} ${api.url}`));
    }

  } catch (error) {
    console.error('❌ QA Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

runQA().catch(console.error);