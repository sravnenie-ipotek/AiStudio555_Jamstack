const { chromium } = require('playwright');

async function verifyFAQVisible() {
    console.log('✅ VERIFYING FAQ VISIBILITY FIX\n');

    const browser = await chromium.launch({ headless: false, slowMo: 500 });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1280, height: 1024 });

    await page.goto('http://localhost:3005/he/courses.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Scroll to FAQ
    await page.locator('section.faq').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    // Check visibility
    const faqVisible = await page.locator('section.faq').isVisible();
    const titleVisible = await page.locator('section.faq .faq-section-title-wrapper').isVisible();
    const contentVisible = await page.locator('section.faq .faq-content').isVisible();
    const titleText = await page.locator('section.faq h2.section-title').textContent();

    console.log(`FAQ Section visible: ${faqVisible ? '✅ YES' : '❌ NO'}`);
    console.log(`Title wrapper visible: ${titleVisible ? '✅ YES' : '❌ NO'}`);
    console.log(`Content wrapper visible: ${contentVisible ? '✅ YES' : '❌ NO'}`);
    console.log(`Title text: "${titleText}"`);

    // Check opacity
    const titleOpacity = await page.locator('section.faq .faq-section-title-wrapper').evaluate(el => window.getComputedStyle(el).opacity);
    const contentOpacity = await page.locator('section.faq .faq-content').evaluate(el => window.getComputedStyle(el).opacity);

    console.log(`Title opacity: ${titleOpacity}`);
    console.log(`Content opacity: ${contentOpacity}`);

    // Test FAQ interaction
    const firstTab = page.locator('section.faq .w-tab-link').first();
    await firstTab.click();
    await page.waitForTimeout(500);

    const firstQuestion = await firstTab.locator('.faq-question').textContent();
    console.log(`\nFirst FAQ question: "${firstQuestion}"`);

    // Take screenshot
    await page.screenshot({
        path: 'faq-visible-verification.png',
        fullPage: true
    });

    console.log('\n📸 Screenshot saved: faq-visible-verification.png');
    console.log('✅ Verification complete! Check browser.');

    await browser.close();
}

verifyFAQVisible().catch(console.error);