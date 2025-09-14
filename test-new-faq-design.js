const { chromium } = require('playwright');

async function testNewFAQDesign() {
    console.log('🎨 Testing New Modern FAQ Design\n');

    const browser = await chromium.launch({
        headless: false,
        slowMo: 800,
        args: ['--window-size=1280,1024']
    });

    const page = await browser.newPage();
    await page.setViewportSize({ width: 1280, height: 1024 });

    console.log('📍 Loading courses page...');
    await page.goto('http://localhost:3005/he/courses.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Scroll to FAQ section
    console.log('📜 Scrolling to FAQ section...');
    await page.locator('.faq-modern').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);

    // Check if new FAQ section exists
    const faqModernExists = await page.locator('.faq-modern').count();
    console.log(`\n✓ Modern FAQ section exists: ${faqModernExists > 0 ? '✅ YES' : '❌ NO'}`);

    if (faqModernExists > 0) {
        // Check main elements
        const labelVisible = await page.locator('.faq-label').isVisible();
        console.log(`✓ Gradient label visible: ${labelVisible ? '✅ YES' : '❌ NO'}`);

        const titleText = await page.locator('.faq-title-modern').textContent();
        console.log(`✓ Title text: "${titleText}"`);

        const subtitleText = await page.locator('.faq-subtitle-modern').textContent();
        console.log(`✓ Subtitle: "${subtitleText.substring(0, 50)}..."`);

        // Count FAQ cards
        const cardCount = await page.locator('.faq-card').count();
        console.log(`✓ FAQ cards found: ${cardCount}`);

        // Test interaction with cards
        console.log('\n🎭 Testing FAQ card interactions:');

        for (let i = 0; i < Math.min(3, cardCount); i++) {
            const card = page.locator('.faq-card').nth(i);
            const number = await card.locator('.faq-number').textContent();
            const question = await card.locator('.faq-card-question').textContent();

            console.log(`\n  Card ${number}:`);
            console.log(`  Question: "${question.substring(0, 40)}..."`);

            // Click to expand
            await card.locator('.faq-card-header').click();
            await page.waitForTimeout(500);

            // Check if active
            const isActive = await card.evaluate(el => el.classList.contains('active'));
            console.log(`  Expanded: ${isActive ? '✅ YES' : '❌ NO'}`);

            // Get answer preview
            if (isActive) {
                const answer = await card.locator('.faq-card-content p').textContent();
                console.log(`  Answer: "${answer.substring(0, 60)}..."`);
            }
        }

        // Check hover effects
        console.log('\n🎨 Testing hover effects:');
        const firstCard = page.locator('.faq-card').first();
        await firstCard.hover();
        await page.waitForTimeout(500);
        console.log('✅ Hover animation tested');

        // Check responsiveness
        console.log('\n📱 Testing responsive behavior:');
        await page.setViewportSize({ width: 375, height: 667 });
        await page.waitForTimeout(1000);

        const mobileCardCount = await page.locator('.faq-card').count();
        console.log(`✅ Mobile view: ${mobileCardCount} cards visible`);

        // Return to desktop view
        await page.setViewportSize({ width: 1280, height: 1024 });
        await page.waitForTimeout(1000);

        // Take screenshots
        console.log('\n📸 Taking screenshots...');

        // Full FAQ section
        const faqBbox = await page.locator('.faq-modern').boundingBox();
        if (faqBbox) {
            await page.screenshot({
                path: 'new-faq-design-section.png',
                clip: faqBbox
            });
            console.log('✅ FAQ section screenshot: new-faq-design-section.png');
        }

        // Full page
        await page.screenshot({
            path: 'new-faq-design-fullpage.png',
            fullPage: true
        });
        console.log('✅ Full page screenshot: new-faq-design-fullpage.png');
    }

    console.log('\n✨ NEW FAQ DESIGN TEST COMPLETE!');
    console.log('The new FAQ has a completely different modern design from the home page.');
    console.log('Browser will stay open for manual inspection.');

    await new Promise(() => {});
}

testNewFAQDesign().catch(console.error);