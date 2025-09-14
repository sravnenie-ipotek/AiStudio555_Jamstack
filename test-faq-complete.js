const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false }); // Set to false to see the browser
  const page = await browser.newPage();

  try {
    console.log('📝 Testing Complete FAQ Hebrew Translation (Titles + Answers)...');

    // Navigate to Hebrew home page
    await page.goto('http://localhost:8080/he/home.html', {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });

    console.log('✅ Page loaded');

    // Wait for potential JavaScript translations to complete
    await page.waitForTimeout(5000);

    // Test FAQ Titles
    console.log('\n🔍 TESTING FAQ TITLES...');
    const faqTitleElements = await page.$$('.faq-question');
    console.log(`🔍 Found ${faqTitleElements.length} FAQ title elements`);

    for (let i = 0; i < faqTitleElements.length; i++) {
      const faqText = await faqTitleElements[i].textContent();
      console.log(`FAQ ${i + 1} Title: "${faqText}"`);

      if (faqText.includes('אילו') || faqText.includes('כמה') || faqText.includes('איך') || faqText.includes('האם') || faqText.includes('מה')) {
        console.log(`✅ FAQ ${i + 1} Title: Properly translated to Hebrew`);
      } else {
        console.log(`❌ FAQ ${i + 1} Title: NOT translated to Hebrew`);
      }
    }

    // Test FAQ Answers by clicking on each FAQ
    console.log('\n🔍 TESTING FAQ ANSWERS...');
    const faqAnswerElements = await page.$$('.faq-answer');
    console.log(`🔍 Found ${faqAnswerElements.length} FAQ answer elements`);

    for (let i = 0; i < Math.min(faqTitleElements.length, 3); i++) {
      console.log(`\n📖 Testing FAQ ${i + 1} Answer...`);

      // Click on the FAQ question to expand the answer
      try {
        await faqTitleElements[i].click();
        await page.waitForTimeout(1000); // Wait for animation

        if (i < faqAnswerElements.length) {
          const answerText = await faqAnswerElements[i].textContent();
          console.log(`FAQ ${i + 1} Answer: "${answerText.substring(0, 50)}..."`);

          // Check if answer contains Hebrew characters
          const hasHebrew = /[\u0590-\u05FF]/.test(answerText);
          if (hasHebrew) {
            console.log(`✅ FAQ ${i + 1} Answer: Contains Hebrew text - translation SUCCESS`);
          } else {
            console.log(`❌ FAQ ${i + 1} Answer: Still in English - translation FAILED`);
          }
        }
      } catch (error) {
        console.log(`⚠️ FAQ ${i + 1}: Could not click or read answer - ${error.message}`);
      }
    }

    // Take screenshot for visual verification
    await page.screenshot({
      path: '/Users/michaelmishayev/Desktop/newCode/faq-complete-test-screenshot.png',
      fullPage: true
    });
    console.log('\n📸 Screenshot saved as faq-complete-test-screenshot.png');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
})();