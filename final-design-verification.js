const { chromium } = require('playwright');

async function finalDesignVerification() {
    console.log('🎯 FINAL DESIGN VERIFICATION - Home vs Courses FAQ\n');

    const browser = await chromium.launch({ headless: false, slowMo: 1000 });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1280, height: 1024 });

    // Test Courses Page
    console.log('📍 Testing COURSES page...');
    await page.goto('http://localhost:3005/he/courses.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    // Scroll to FAQ section
    await page.locator('section.faq').scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);

    // Check FAQ visibility and animation
    const faqSection = await page.locator('section.faq');
    const isVisible = await faqSection.isVisible();
    console.log(`✅ FAQ section visible: ${isVisible}`);

    // Check Webflow animation styles
    const titleWrapper = await page.locator('section.faq .faq-section-title-wrapper');
    const contentWrapper = await page.locator('section.faq .faq-content');

    const titleStyle = await titleWrapper.getAttribute('style');
    const contentStyle = await contentWrapper.getAttribute('style');

    console.log(`📊 Title wrapper style: ${titleStyle}`);
    console.log(`📊 Content wrapper style: ${contentStyle}`);

    // Check if FAQ tabs are working
    const tabCount = await page.locator('section.faq .w-tab-link').count();
    console.log(`📋 FAQ tabs found: ${tabCount}`);

    if (tabCount > 0) {
        console.log('\n🎭 Testing FAQ interactions...');

        for (let i = 0; i < Math.min(3, tabCount); i++) {
            const tab = page.locator('section.faq .w-tab-link').nth(i);
            const question = await tab.locator('.faq-question').textContent();

            console.log(`🔍 Tab ${i + 1}: ${question.substring(0, 40)}...`);

            await tab.click();
            await page.waitForTimeout(800);

            const isActive = await tab.evaluate(el => el.classList.contains('w--current'));
            console.log(`   ${isActive ? '✅' : '❌'} Active state: ${isActive}`);
        }
    }

    // Check image loading
    const faqImage = page.locator('section.faq .faq-image');
    const imageVisible = await faqImage.isVisible();
    const imageSrc = await faqImage.getAttribute('src');
    console.log(`\n🖼️ FAQ image visible: ${imageVisible}`);
    console.log(`🖼️ Image source: ${imageSrc}`);

    // Check ticker animation
    const tickerWrapper = page.locator('section.faq .faq-ticker-wrapper');
    const tickerVisible = await tickerWrapper.isVisible();
    console.log(`🎪 Ticker animation visible: ${tickerVisible}`);

    // Take final screenshot
    const finalBbox = await faqSection.boundingBox();
    if (finalBbox) {
        await page.screenshot({
            path: 'final-faq-verification.png',
            clip: finalBbox
        });
        console.log('\n📸 Final verification screenshot: final-faq-verification.png');
    }

    // Full page screenshot
    await page.screenshot({
        path: 'final-courses-page.png',
        fullPage: true
    });

    // Now compare with home page briefly
    console.log('\n🏠 Quick comparison with HOME page...');
    await page.goto('http://localhost:3005/he/home.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    await page.locator('section.faq').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    const homeFaqVisible = await page.locator('section.faq').isVisible();
    const homeTabCount = await page.locator('section.faq .w-tab-link').count();

    console.log(`🏠 Home FAQ visible: ${homeFaqVisible}`);
    console.log(`🏠 Home FAQ tabs: ${homeTabCount}`);

    await page.screenshot({
        path: 'home-faq-comparison.png',
        fullPage: true
    });

    console.log('\n✨ VERIFICATION COMPLETE!');
    console.log('Screenshots saved:');
    console.log('- final-faq-verification.png (Courses FAQ section only)');
    console.log('- final-courses-page.png (Full courses page)');
    console.log('- home-faq-comparison.png (Home page for comparison)');

    console.log('\n✅ Ready for final inspection! Press Ctrl+C to close browser.');

    // Keep browser open
    await new Promise(() => {});
}

finalDesignVerification().catch(console.error);