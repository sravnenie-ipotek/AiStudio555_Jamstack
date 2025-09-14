const { chromium } = require('playwright');

async function testFixedFAQ() {
    console.log('🔍 Testing Fixed FAQ Section\n');

    const browser = await chromium.launch({
        headless: false,
        slowMo: 1000
    });

    const page = await browser.newPage();
    await page.setViewportSize({ width: 1280, height: 1024 });

    console.log('📍 Navigating to Hebrew courses page...');
    await page.goto('http://localhost:3005/he/courses.html', {
        waitUntil: 'networkidle'
    });

    // Scroll to FAQ section
    console.log('📜 Scrolling to FAQ section...');
    await page.locator('section.faq').scrollIntoViewIfNeeded();
    await page.waitForTimeout(3000); // Wait for animations

    // Test FAQ interaction
    console.log('🎯 Testing FAQ accordion interaction...');

    // Click first FAQ item
    const firstFAQ = page.locator('.single-faq-accordion-wrap').first();
    await firstFAQ.click();
    await page.waitForTimeout(1000);

    // Click second FAQ item
    const secondFAQ = page.locator('.single-faq-accordion-wrap').nth(1);
    await secondFAQ.click();
    await page.waitForTimeout(1000);

    // Check if questions are visible and clickable
    const faqQuestions = [
        'האם אוכל להתחיל ללמוד מאפס ללא ניסיון קודם?',
        'האם יש הגבלות גיל להרשמה?',
        'אילו מסלולי קריירה אוכל לפתח',
        'האם פורמט הלמידה מקוון לחלוטין',
        'האם אתם מספקים סיוע בהשמה לעבודה',
        'מהן אפשרויות התשלום'
    ];

    console.log('\n📋 Checking Hebrew FAQ questions:');
    for (let i = 0; i < faqQuestions.length; i++) {
        const question = faqQuestions[i];
        const element = await page.locator(`text*="${question}"`).first();
        const isVisible = await element.isVisible();
        const isClickable = await element.isEnabled();

        console.log(`${i + 1}. ${question.substring(0, 30)}...`);
        console.log(`   Visible: ${isVisible ? '✅' : '❌'} | Clickable: ${isClickable ? '✅' : '❌'}`);

        if (isVisible && isClickable) {
            await element.click();
            await page.waitForTimeout(500);
        }
    }

    // Take screenshot
    await page.screenshot({
        path: 'faq-fixed-test.png',
        fullPage: true
    });

    console.log('\n📸 Screenshot saved: faq-fixed-test.png');
    console.log('\n✅ FAQ test complete! Browser will stay open for manual inspection.');
    console.log('Press Ctrl+C to close when done.');

    // Keep browser open
    await new Promise(() => {});
}

testFixedFAQ().catch(console.error);