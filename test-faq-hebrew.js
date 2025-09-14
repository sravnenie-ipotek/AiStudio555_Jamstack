const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false }); // Set to false to see the browser
  const page = await browser.newPage();

  try {
    console.log('📝 Testing FAQ Hebrew Translation...');

    // Navigate to Hebrew home page
    await page.goto('http://localhost:8080/he/home.html', {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });

    console.log('✅ Page loaded');

    // Wait for potential JavaScript translations to complete
    await page.waitForTimeout(3000);

    // Find all FAQ question elements
    const faqElements = await page.$$('.faq-question');
    console.log(`🔍 Found ${faqElements.length} FAQ question elements`);

    if (faqElements.length === 0) {
      console.log('❌ No FAQ elements found!');
      return;
    }

    // Check each FAQ question
    for (let i = 0; i < faqElements.length; i++) {
      const faqText = await faqElements[i].textContent();
      console.log(`FAQ ${i + 1}: "${faqText}"`);

      // Check if it's still the placeholder or actual Hebrew content
      if (faqText === 'שלטו ב-AI וטכנולוגיה') {
        console.log(`❌ FAQ ${i + 1}: Still showing Hebrew placeholder - NOT translated`);
      } else if (faqText.includes('FAQ & Answer')) {
        console.log(`❌ FAQ ${i + 1}: Showing generic "FAQ & Answer" - translation failed`);
      } else if (faqText.includes('אילו') || faqText.includes('כמה') || faqText.includes('איך')) {
        console.log(`✅ FAQ ${i + 1}: Showing proper Hebrew content - translation SUCCESS`);
      } else {
        console.log(`⚠️ FAQ ${i + 1}: Unexpected content - "${faqText}"`);
      }
    }

    // Additional check: Screenshot for visual verification
    await page.screenshot({
      path: '/Users/michaelmishayev/Desktop/newCode/faq-test-screenshot.png',
      fullPage: true
    });
    console.log('📸 Screenshot saved as faq-test-screenshot.png');

    // Check if API is being called
    let apiCalled = false;
    page.on('request', request => {
      if (request.url().includes('/api/home-page') && request.url().includes('locale=he')) {
        apiCalled = true;
        console.log('✅ API call detected:', request.url());
      }
    });

    // Refresh to see API calls
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    if (!apiCalled) {
      console.log('❌ No API call detected for Hebrew locale');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
})();