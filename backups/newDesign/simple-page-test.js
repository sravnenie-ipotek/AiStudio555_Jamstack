const { chromium } = require('playwright');

async function simplePageTest() {
  console.log('🔍 Simple Page Test...');

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // Navigate to the page
    console.log('📍 Navigating to http://localhost:3005/backups/newDesign/teachers.html');
    const response = await page.goto('http://localhost:3005/backups/newDesign/teachers.html', {
      waitUntil: 'domcontentloaded'
    });

    console.log(`📊 Response status: ${response.status()}`);
    console.log(`🌐 Final URL: ${page.url()}`);

    // Wait a bit for page to load
    await page.waitForTimeout(2000);

    // Get the page title
    const title = await page.title();
    console.log(`📄 Page title: "${title}"`);

    // Check if main elements exist
    const bodyContent = await page.locator('body').innerHTML();
    console.log(`📏 Body content length: ${bodyContent.length} characters`);

    // Check for specific sections
    const hasMainBlog = bodyContent.includes('section main-blog') || bodyContent.includes('class="section main-blog"');
    const hasCollectionList = bodyContent.includes('main-blog-collection-list');
    const hasButtons = bodyContent.includes('View Profile') || bodyContent.includes('blog-card-link');

    console.log(`🏢 Has main-blog section: ${hasMainBlog}`);
    console.log(`📋 Has collection list: ${hasCollectionList}`);
    console.log(`🔘 Has View Profile buttons: ${hasButtons}`);

    // Take a screenshot
    await page.screenshot({
      path: 'simple-test.png',
      fullPage: true
    });
    console.log('📸 Screenshot saved: simple-test.png');

    console.log('✅ Simple test completed');

  } catch (error) {
    console.error('❌ Simple test failed:', error.message);
  } finally {
    await browser.close();
  }
}

simplePageTest().catch(console.error);