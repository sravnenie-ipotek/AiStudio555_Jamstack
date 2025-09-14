const { chromium } = require('playwright');

async function testFAQFinal() {
    console.log('🎯 Final FAQ Visibility Test\n');

    const browser = await chromium.launch({ headless: false, slowMo: 800 });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1280, height: 1024 });

    await page.goto('http://localhost:3005/he/courses.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Check FAQ section visibility
    const faqSection = await page.locator('section.faq');
    const isFaqVisible = await faqSection.isVisible();
    console.log(`FAQ section visible: ${isFaqVisible ? '✅ YES' : '❌ NO'}`);

    if (isFaqVisible) {
        // Scroll to FAQ
        await faqSection.scrollIntoViewIfNeeded();
        await page.waitForTimeout(1000);

        // Check main title
        const mainTitle = await page.locator('h2:has-text("שאלות נפוצות")');
        const titleVisible = await mainTitle.isVisible();
        console.log(`Main title visible: ${titleVisible ? '✅ YES' : '❌ NO'}`);

        // Check accordion items
        const faqItems = await page.locator('.faq-accordion-item-wrapper').count();
        console.log(`FAQ items found: ${faqItems}`);

        // Test first FAQ interaction
        if (faqItems > 0) {
            console.log('🎭 Testing FAQ interaction...');
            const firstItem = page.locator('.w-tab-link').first();
            await firstItem.click();
            await page.waitForTimeout(1000);
            console.log('✅ Clicked first FAQ item');
        }

        // Take screenshot
        await page.screenshot({
            path: 'faq-final-test.png',
            fullPage: true
        });
        console.log('📸 Screenshot saved: faq-final-test.png');
    }

    console.log('\n✅ Test complete! Browser will stay open.');
    console.log('Press Ctrl+C to close when done.');

    // Keep browser open
    await new Promise(() => {});
}

testFAQFinal().catch(console.error);