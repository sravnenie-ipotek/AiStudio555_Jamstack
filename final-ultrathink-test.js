const { chromium } = require('playwright');

async function finalUltrathinkTest() {
    console.log('🎯 FINAL ULTRATHINK TEST - FAQ Complete Check\n');

    const browser = await chromium.launch({ headless: false, slowMo: 1000 });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1280, height: 1024 });

    await page.goto('http://localhost:3005/he/courses.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    // Scroll to FAQ
    await page.locator('section.faq').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);

    // Check everything
    console.log('🔍 FAQ SECTION STATUS:');

    const faqVisible = await page.locator('section.faq').isVisible();
    console.log(`✓ Section visible: ${faqVisible ? '✅ YES' : '❌ NO'}`);

    const titleText = await page.locator('section.faq h2.section-title').textContent();
    console.log(`✓ Title text: "${titleText}"`);
    console.log(`  ${titleText === 'שאלות נפוצות' ? '✅ CORRECT' : '❌ WRONG (should be "שאלות נפוצות")'}`);

    const descText = await page.locator('section.faq .faq-section-description-text').textContent();
    console.log(`✓ Description: "${descText.substring(0, 50)}..."`);

    const tabCount = await page.locator('section.faq .w-tab-link').count();
    console.log(`✓ FAQ tabs: ${tabCount}`);

    // Check all FAQ questions
    console.log('\n📋 FAQ QUESTIONS:');
    const expectedQuestions = [
        'ש: האם אוכל להתחיל ללמוד מאפס ללא ניסיון קודם?',
        'ש: האם יש הגבלות גיל להרשמה?',
        'ש: אילו מסלולי קריירה אוכל לפתח לאחר השלמת הקורסים?',
        'ש: האם פורמט הלמידה מקוון לחלוטין או שיש רכיבים לא מקוונים?',
        'ש: האם אתם מספקים סיוע בהשמה לעבודה לאחר סיום הקורס?',
        'ש: מהן אפשרויות התשלום והאם קיים סיוע כספי?'
    ];

    for (let i = 0; i < Math.min(tabCount, 6); i++) {
        const question = await page.locator('section.faq .faq-question').nth(i).textContent();
        const isCorrect = question === expectedQuestions[i];
        console.log(`${i + 1}. ${isCorrect ? '✅' : '❌'} "${question.substring(0, 40)}..."`);
    }

    // Test interaction
    console.log('\n🎭 INTERACTION TEST:');
    const firstTab = page.locator('section.faq .w-tab-link').first();
    await firstTab.click();
    await page.waitForTimeout(500);

    const isActive = await firstTab.evaluate(el => el.classList.contains('w--current'));
    console.log(`✓ First tab clickable: ${isActive ? '✅ YES' : '❌ NO'}`);

    // Check image and ticker
    const imageVisible = await page.locator('section.faq .faq-image').isVisible();
    console.log(`✓ Image visible: ${imageVisible ? '✅ YES' : '❌ NO'}`);

    const tickerVisible = await page.locator('section.faq .faq-ticker-wrapper').isVisible();
    console.log(`✓ Ticker animation: ${tickerVisible ? '✅ YES' : '❌ NO'}`);

    // Take final screenshot
    await page.screenshot({
        path: 'ultrathink-final-result.png',
        fullPage: true
    });

    console.log('\n📸 Final screenshot: ultrathink-final-result.png');
    console.log('✅ ULTRATHINK TEST COMPLETE!');

    await browser.close();
}

finalUltrathinkTest().catch(console.error);