const { chromium } = require('playwright');

async function finalFAQTest() {
    console.log('🔍 Final FAQ Test - Hebrew Questions Check\n');

    const browser = await chromium.launch({ headless: false, slowMo: 1000 });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1280, height: 1024 });

    await page.goto('http://localhost:3005/he/courses.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Scroll to FAQ section
    console.log('📜 Scrolling to FAQ section...');
    await page.locator('section.faqs').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);

    // Check FAQ section visibility
    const faqSection = await page.locator('section.faqs');
    const isVisible = await faqSection.isVisible();
    console.log(`FAQ section visible: ${isVisible ? '✅ YES' : '❌ NO'}`);

    // Check Hebrew title
    const hebrewTitle = await page.locator('h2:has-text("שאלות נפוצות")');
    const titleVisible = await hebrewTitle.isVisible();
    console.log(`Hebrew title "שאלות נפוצות" visible: ${titleVisible ? '✅ YES' : '❌ NO'}`);

    // Check Hebrew FAQ questions
    const hebrewQuestions = [
        'האם אוכל להתחיל ללמוד מאפס ללא ניסיון קודם?',
        'האם יש הגבלות גיל להרשמה?',
        'אילו מסלולי קריירה אוכל לפתח',
        'האם פורמט הלמידה מקוון לחלוטין',
        'האם אתם מספקים סיוע בהשמה לעבודה',
        'מהן אפשרויות התשלום'
    ];

    console.log('\n🔍 Checking Hebrew FAQ questions:');
    for (const question of hebrewQuestions) {
        const element = await page.locator(`text*="${question}"`);
        const count = await element.count();
        const visible = count > 0 ? await element.first().isVisible() : false;
        const status = count > 0 && visible ? '✅ FOUND & VISIBLE' : count > 0 ? '⚠️ FOUND BUT HIDDEN' : '❌ NOT FOUND';
        console.log(`  ${question.substring(0, 40)}... - ${status}`);
    }

    // Take screenshot of FAQ section only
    const faqBbox = await faqSection.boundingBox();
    if (faqBbox) {
        await page.screenshot({
            path: 'faq-section-only.png',
            clip: faqBbox
        });
        console.log('\n📸 FAQ section screenshot saved: faq-section-only.png');
    }

    console.log('\n✅ Test complete! Browser will remain open for inspection.');
    console.log('Press Ctrl+C to close when done.');

    // Keep browser open for inspection
    await new Promise(() => {});
}

finalFAQTest().catch(console.error);