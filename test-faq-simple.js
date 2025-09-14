const { chromium } = require('playwright');

async function testFAQSimple() {
    console.log('🎯 Simple FAQ Test\n');

    const browser = await chromium.launch({ headless: false, slowMo: 800 });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1280, height: 1024 });

    await page.goto('http://localhost:3005/he/courses.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Check FAQ section visibility
    const faqSection = await page.locator('section.faq');
    console.log(`FAQ section visible: ${await faqSection.isVisible() ? '✅ YES' : '❌ NO'}`);

    // Scroll to FAQ
    await faqSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    // Check specific FAQ title within FAQ section
    const faqTitle = faqSection.locator('h2:has-text("שאלות נפוצות")');
    console.log(`FAQ title "שאלות נפוצות" visible: ${await faqTitle.isVisible() ? '✅ YES' : '❌ NO'}`);

    // Check w-tabs system
    const wTabs = faqSection.locator('.w-tabs');
    console.log(`W-tabs system visible: ${await wTabs.isVisible() ? '✅ YES' : '❌ NO'}`);

    // Count FAQ tabs
    const tabCount = await faqSection.locator('.w-tab-link').count();
    console.log(`FAQ tabs found: ${tabCount}`);

    // Test first FAQ interaction
    if (tabCount > 0) {
        console.log('\n🎭 Testing FAQ interaction...');
        const firstTab = faqSection.locator('.w-tab-link').first();

        const isVisible = await firstTab.isVisible();
        console.log(`First FAQ tab visible: ${isVisible ? '✅ YES' : '❌ NO'}`);

        if (isVisible) {
            // Get first question text
            const questionText = await firstTab.locator('.faq-question').textContent();
            console.log(`First question: ${questionText.substring(0, 50)}...`);

            // Click first tab
            await firstTab.click();
            await page.waitForTimeout(500);
            console.log('✅ Clicked first FAQ tab');

            // Check if it becomes current
            const isCurrent = await firstTab.evaluate(el => el.classList.contains('w--current'));
            console.log(`First tab now active: ${isCurrent ? '✅ YES' : '❌ NO'}`);
        }
    }

    // Take screenshot
    await page.screenshot({
        path: 'faq-simple-test.png',
        fullPage: true
    });
    console.log('\n📸 Screenshot saved: faq-simple-test.png');

    console.log('\n✅ Test complete! Browser will stay open for manual inspection.');
    console.log('Press Ctrl+C to close when done.');

    // Keep browser open
    await new Promise(() => {});
}

testFAQSimple().catch(console.error);