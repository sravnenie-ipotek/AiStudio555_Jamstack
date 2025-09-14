const { chromium } = require('playwright');

async function checkFAQ() {
    console.log('🔍 Checking FAQ section on Hebrew courses page...\n');

    const browser = await chromium.launch({
        headless: false,
        slowMo: 500
    });

    const page = await browser.newPage();
    await page.setViewportSize({ width: 1920, height: 1080 });

    console.log('📍 Navigating to: http://localhost:3005/he/courses.html');
    await page.goto('http://localhost:3005/he/courses.html', {
        waitUntil: 'networkidle',
        timeout: 30000
    });

    // Wait for page to fully load
    await page.waitForTimeout(2000);

    // Check for FAQ section
    console.log('\n🔍 Searching for FAQ section...');

    // Check multiple possible FAQ selectors
    const faqSelectors = [
        '.section.faqs',
        '.faq-section',
        '.w-tabs[data-w-id*="faq"]',
        '[id*="faq"]',
        '.faq-container',
        '.faq-item',
        'h2:has-text("שאלות נפוצות")',
        'h2:has-text("FAQ")',
        'section:has-text("שאלות נפוצות")'
    ];

    for (const selector of faqSelectors) {
        const element = await page.locator(selector).first();
        const count = await page.locator(selector).count();
        if (count > 0) {
            console.log(`✅ Found FAQ element with selector: ${selector} (${count} instances)`);
            const isVisible = await element.isVisible();
            console.log(`   Visibility: ${isVisible ? '✅ VISIBLE' : '❌ HIDDEN'}`);

            if (isVisible) {
                const boundingBox = await element.boundingBox();
                if (boundingBox) {
                    console.log(`   Position: top=${boundingBox.y}, left=${boundingBox.x}`);
                    console.log(`   Size: ${boundingBox.width}x${boundingBox.height}`);
                }
            }
        }
    }

    // Check for Hebrew FAQ questions
    console.log('\n🔍 Searching for Hebrew FAQ questions...');
    const hebrewQuestions = [
        'האם אוכל להתחיל ללמוד מאפס',
        'האם יש הגבלות גיל',
        'אילו מסלולי קריירה',
        'האם פורמט הלמידה',
        'האם אתם מספקים סיוע',
        'מהן אפשרויות התשלום'
    ];

    for (const question of hebrewQuestions) {
        const element = await page.locator(`text="${question}"`).first();
        const exists = await element.count() > 0;
        if (exists) {
            console.log(`✅ Found Hebrew FAQ question: "${question.substring(0, 30)}..."`);
            const isVisible = await element.isVisible();
            console.log(`   Visibility: ${isVisible ? '✅ VISIBLE' : '❌ HIDDEN'}`);
        } else {
            console.log(`❌ NOT FOUND: "${question.substring(0, 30)}..."`);
        }
    }

    // Scroll to bottom to check if FAQ is at the bottom
    console.log('\n📜 Scrolling to bottom of page...');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);

    // Check for FAQ section after scrolling
    const faqAfterScroll = await page.locator('h2:has-text("שאלות נפוצות")').first();
    if (await faqAfterScroll.count() > 0) {
        const isVisible = await faqAfterScroll.isVisible();
        console.log(`\n✅ FAQ title "שאלות נפוצות" found after scrolling`);
        console.log(`   Visibility: ${isVisible ? '✅ VISIBLE' : '❌ HIDDEN'}`);

        if (isVisible) {
            // Take screenshot of FAQ section
            const faqSection = await page.locator('.section.faqs').first();
            if (await faqSection.count() > 0) {
                await faqSection.screenshot({ path: 'faq-section-screenshot.png' });
                console.log('📸 Screenshot saved: faq-section-screenshot.png');
            }
        }
    }

    // Check page source for FAQ content
    console.log('\n📄 Checking page source for FAQ content...');
    const pageContent = await page.content();
    const hasFAQTitle = pageContent.includes('שאלות נפוצות');
    const hasFAQQuestion = pageContent.includes('האם אוכל להתחיל ללמוד מאפס');
    const hasFAQClass = pageContent.includes('class="section faqs"') || pageContent.includes('faq-section');

    console.log(`   Has FAQ title in source: ${hasFAQTitle ? '✅ YES' : '❌ NO'}`);
    console.log(`   Has FAQ question in source: ${hasFAQQuestion ? '✅ YES' : '❌ NO'}`);
    console.log(`   Has FAQ class in source: ${hasFAQClass ? '✅ YES' : '❌ NO'}`);

    // Check console errors
    const errors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') {
            errors.push(msg.text());
        }
    });

    if (errors.length > 0) {
        console.log('\n⚠️ Console errors detected:');
        errors.forEach(err => console.log(`   - ${err}`));
    }

    // Take full page screenshot
    await page.screenshot({ path: 'full-page-screenshot.png', fullPage: true });
    console.log('\n📸 Full page screenshot saved: full-page-screenshot.png');

    console.log('\n✅ Check complete!');

    // Keep browser open for manual inspection
    console.log('🔍 Browser will remain open for manual inspection...');
    console.log('   Press Ctrl+C to close');

    // Wait indefinitely
    await new Promise(() => {});
}

checkFAQ().catch(console.error);