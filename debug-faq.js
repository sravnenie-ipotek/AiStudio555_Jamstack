const { chromium } = require('playwright');

async function debugFAQ() {
    const browser = await chromium.launch({ headless: false, slowMo: 1000 });
    const page = await browser.newPage();

    await page.goto('http://localhost:3005/he/courses.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    // Check if section.faqs exists
    const faqSection = await page.locator('section.faqs').count();
    console.log(`FAQ section exists: ${faqSection > 0 ? '✅ YES' : '❌ NO'}`);

    if (faqSection > 0) {
        const isVisible = await page.locator('section.faqs').isVisible();
        console.log(`FAQ section visible: ${isVisible ? '✅ YES' : '❌ NO'}`);

        const bbox = await page.locator('section.faqs').boundingBox();
        console.log('FAQ section bounding box:', bbox);
    }

    // Check if any FAQ-related element exists
    const faqElements = await page.locator('[class*="faq"]').count();
    console.log(`FAQ-related elements found: ${faqElements}`);

    // Check specific elements
    const subtitle = await page.locator('text="FAQ & Answer"').count();
    console.log(`FAQ subtitle found: ${subtitle > 0 ? '✅ YES' : '❌ NO'}`);

    // Debug: Print all sections on page
    const sections = await page.locator('section').all();
    console.log(`\nAll sections on page: ${sections.length}`);
    for (let i = 0; i < sections.length; i++) {
        const className = await sections[i].getAttribute('class');
        console.log(`Section ${i}: ${className}`);
    }

    // Debug: Take screenshot
    await page.screenshot({ path: 'debug-faq.png', fullPage: true });
    console.log('\nScreenshot saved: debug-faq.png');

    await browser.close();
}

debugFAQ().catch(console.error);