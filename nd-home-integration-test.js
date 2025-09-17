const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function captureAndIntegrate() {
    console.log('🎬 Starting home.html database integration test...');

    const browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });

    const page = await context.newPage();

    // Step 1: Capture BEFORE state (static page)
    console.log('\n📸 Step 1: Capturing static page snapshot...');
    await page.goto('http://localhost:8082/nd/home.html', {
        waitUntil: 'networkidle',
        timeout: 30000
    });

    // Wait for all images to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Take screenshots
    await page.screenshot({
        path: 'nd-home-before-integration.png',
        fullPage: true
    });

    // Capture text content for comparison
    const beforeContent = {
        heroTitle: await page.textContent('h1.banner-heading').catch(() => ''),
        heroDescription: await page.textContent('p.banner-description-text').catch(() => ''),
        featuresTitle: await page.textContent('.choose-us .section-title').catch(() => ''),
        aboutTitle: await page.textContent('.about-us .section-title').catch(() => ''),
        coursesTitle: await page.textContent('.courses .section-title').catch(() => ''),
        testimonialTitle: await page.textContent('.testimonial .section-title').catch(() => ''),
        blogTitle: await page.textContent('.blog .section-title').catch(() => ''),
        ctaTitle: await page.textContent('.cta-banner-title').catch(() => ''),
        menuItemsCount: await page.locator('.nav-menu .nav-link').count(),
        featureCardsCount: await page.locator('.choose-us-card').count(),
        courseCardsCount: await page.locator('.courses-card').count()
    };

    console.log('✅ Before snapshot captured');
    console.log('📊 Content stats:', {
        menuItems: beforeContent.menuItemsCount,
        featureCards: beforeContent.featureCardsCount,
        courseCards: beforeContent.courseCardsCount
    });

    // Step 2: Check current database content
    console.log('\n🗄️ Step 2: Checking database content...');
    const apiResponse = await page.evaluate(async () => {
        try {
            const response = await fetch('http://localhost:3000/api/nd/home-page?locale=en');
            return await response.json();
        } catch (error) {
            return { error: error.message };
        }
    });

    if (apiResponse.error) {
        console.log('⚠️ API Error:', apiResponse.error);
        console.log('Make sure the server is running on port 3000');
    } else if (apiResponse.success) {
        console.log('✅ Database content available');
        const sections = Object.keys(apiResponse.data || {});
        console.log('📦 Available sections:', sections);
    }

    // Save the before state
    fs.writeFileSync('nd-home-before-content.json', JSON.stringify(beforeContent, null, 2));
    console.log('💾 Saved before content to nd-home-before-content.json');

    await browser.close();

    console.log('\n' + '='.repeat(60));
    console.log('📋 NEXT STEPS FOR INTEGRATION:');
    console.log('='.repeat(60));
    console.log('1. Add data attributes to home.html sections');
    console.log('2. Include nd-integration.js script');
    console.log('3. Test with database content');
    console.log('4. Run comparison test');
    console.log('\nStatic page snapshot saved. Ready for integration!');

    return beforeContent;
}

// Run the test
captureAndIntegrate()
    .then(content => {
        console.log('\n✅ Snapshot complete!');
        console.log('\n📊 Current static content summary:');
        console.log('- Hero Title:', content.heroTitle);
        console.log('- Menu Items:', content.menuItemsCount);
        console.log('- Feature Cards:', content.featureCardsCount);
        console.log('- Course Cards:', content.courseCardsCount);
        process.exit(0);
    })
    .catch(error => {
        console.error('❌ Error:', error);
        process.exit(1);
    });