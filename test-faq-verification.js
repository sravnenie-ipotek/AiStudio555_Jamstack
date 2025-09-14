const { chromium } = require('playwright');

async function verifyFAQ() {
    console.log('🎯 FAQ Verification Test\n');

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

        // Check Hebrew title with exact selector
        const mainTitle = await page.locator('h2.section-title');
        const titleVisible = await mainTitle.isVisible();
        const titleText = await mainTitle.textContent();
        console.log(`Main title visible: ${titleVisible ? '✅ YES' : '❌ NO'}`);
        console.log(`Title text: "${titleText}"`);

        // Check w-tabs accordion system
        const wTabs = await page.locator('.w-tabs');
        const wTabsVisible = await wTabs.isVisible();
        console.log(`W-tabs container visible: ${wTabsVisible ? '✅ YES' : '❌ NO'}`);

        // Check FAQ tabs (w-tab-link)
        const faqTabs = await page.locator('.w-tab-link').count();
        console.log(`FAQ tab links found: ${faqTabs}`);

        // Check each FAQ question
        const questions = [
            'ש: האם אוכל להתחיל ללמוד מאפס ללא ניסיון קודם?',
            'ש: האם יש הגבלות גיל להרשמה?',
            'ש: אילו מסלולי קריירה אוכל לפתח לאחר השלמת הקורסים?',
            'ש: האם פורמט הלמידה מקוון לחלוטין או שיש רכיבים לא מקוונים?',
            'ש: האם אתם מספקים סיוע בהשמה לעבודה לאחר סיום הקורס?',
            'ש: מהן אפשרויות התשלום והאם קיים סיוע כספי?'
        ];

        console.log('\n📋 Checking Hebrew FAQ questions:');
        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];
            const element = await page.locator(`.faq-question:has-text("${question}")`);
            const count = await element.count();
            const visible = count > 0 ? await element.first().isVisible() : false;
            console.log(`${i + 1}. ${count > 0 && visible ? '✅' : '❌'} ${question.substring(0, 40)}...`);
        }

        // Test interaction
        console.log('\n🎭 Testing FAQ interaction...');
        if (faqTabs > 0) {
            const firstTab = page.locator('.w-tab-link').first();
            const firstTabVisible = await firstTab.isVisible();
            console.log(`First tab visible: ${firstTabVisible ? '✅ YES' : '❌ NO'}`);

            if (firstTabVisible) {
                await firstTab.click();
                await page.waitForTimeout(500);
                console.log('✅ Clicked first FAQ tab');

                // Check if tab is now current
                const hasCurrentClass = await firstTab.evaluate(el => el.classList.contains('w--current'));
                console.log(`First tab active: ${hasCurrentClass ? '✅ YES' : '❌ NO'}`);
            }
        }

        // Take screenshot
        await page.screenshot({
            path: 'faq-verification.png',
            fullPage: true
        });
        console.log('\n📸 Screenshot saved: faq-verification.png');
    }

    console.log('\n✅ Verification complete! Browser will stay open.');
    console.log('Press Ctrl+C to close when done.');

    // Keep browser open
    await new Promise(() => {});
}

verifyFAQ().catch(console.error);