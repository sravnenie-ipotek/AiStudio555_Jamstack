const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    try {
        console.log('🔍 INVESTIGATING: Pricing Text Mismatch\n');
        console.log('=' .repeat(60));

        // Step 1: Check what's actually in the database
        console.log('\n📊 STEP 1: Database Content Check');
        console.log('-'.repeat(40));

        await page.goto('http://localhost:3000/api/nd/pricing-page?locale=en');
        await page.waitForTimeout(1000);

        const apiResponse = await page.textContent('body');
        const data = JSON.parse(apiResponse);
        const sections = data?.data?.attributes?.sections || {};

        console.log('Hero title:', sections.hero?.title || 'N/A');
        console.log('Hero subtitle:', sections.hero?.subtitle || 'N/A');
        console.log('Plans description:', sections.plans?.description || 'N/A');

        // Step 2: Check admin search
        console.log('\n🔍 STEP 2: Admin Search Results');
        console.log('-'.repeat(40));

        await page.goto('http://localhost:3005/admin-nd.html');
        await page.waitForTimeout(2000);

        // Search for the text that should be there
        const searchBox = page.locator('input[placeholder*="Search"]');
        await searchBox.fill('Choose the plan that fits your learning goals');
        await page.waitForTimeout(1000);

        const searchResults = await page.locator('.pricing-content, #pricingContent, .content-section').isVisible();
        console.log('Search finds "Choose the plan...": ', searchResults ? '✅ Found' : '❌ Not found');

        // Clear search
        await searchBox.clear();
        await page.waitForTimeout(500);

        // Step 3: Check pricing page content
        console.log('\n🌐 STEP 3: Pricing Page Analysis');
        console.log('-'.repeat(40));

        await page.goto('http://localhost:3005/backups/newDesign/pricing.html');
        await page.waitForTimeout(3000);

        // Check hero section
        const heroTitle = await page.locator('.inner-banner-title').textContent();
        const sectionTitle = await page.locator('.section-title').first().textContent();
        const sectionSubtitle = await page.locator('.section-subtitle').first().textContent();

        console.log('Actual hero title:', `"${heroTitle}"`);
        console.log('Actual section title:', `"${sectionTitle}"`);
        console.log('Actual section subtitle:', `"${sectionSubtitle}"`);

        // Check for the specific text
        const pageText = await page.textContent('body');
        const hasChooseText = pageText.includes('Choose the plan that fits your learning goals');
        console.log('Page contains "Choose the plan...": ', hasChooseText ? '✅ Yes' : '❌ No');

        // Step 4: Check pricing tabs and their content
        console.log('\n📋 STEP 4: Pricing Tabs Content');
        console.log('-'.repeat(40));

        // Monthly tab
        const monthlyTab = page.locator('.pricing-plan-tab-link:has-text("Monthly")');
        await monthlyTab.click();
        await page.waitForTimeout(1000);

        const monthlyPeriods = await page.locator('.pricing-pack-text').allTextContents();
        console.log('Monthly tab periods:', monthlyPeriods.slice(0, 3));

        // Yearly tab
        const yearlyTab = page.locator('.pricing-plan-tab-link:has-text("Yearly")');
        await yearlyTab.click();
        await page.waitForTimeout(1000);

        const yearlyPeriods = await page.locator('.pricing-pack-text').allTextContents();
        console.log('Yearly tab periods:', yearlyPeriods.slice(0, 3));

        // Step 5: Check integration script behavior
        console.log('\n🔧 STEP 5: Integration Script Analysis');
        console.log('-'.repeat(40));

        // Check console logs
        await page.goto('http://localhost:3005/backups/newDesign/pricing.html');
        await page.waitForTimeout(2000);

        // Look for integration logs
        const logs = [];
        page.on('console', msg => logs.push(msg.text()));

        await page.reload();
        await page.waitForTimeout(3000);

        console.log('Integration logs:');
        logs.filter(log => log.includes('Updated')).slice(0, 5).forEach(log => {
            console.log('  ', log);
        });

        // Summary
        console.log('\n' + '=' .repeat(60));
        console.log('🔍 MISMATCH ANALYSIS:');

        if (heroTitle !== sections.hero?.title) {
            console.log('❌ ISSUE: Hero title mismatch');
            console.log(`   Database: "${sections.hero?.title}"`);
            console.log(`   Page: "${heroTitle}"`);
        }

        if (sectionTitle !== sections.hero?.subtitle) {
            console.log('❌ ISSUE: Section title mismatch');
            console.log(`   Database: "${sections.hero?.subtitle}"`);
            console.log(`   Page: "${sectionTitle}"`);
        }

        console.log('\n💡 RECOMMENDATIONS:');
        console.log('1. Check if integration script is loading properly');
        console.log('2. Verify API endpoints are responding correctly');
        console.log('3. Check browser console for JavaScript errors');

    } catch (error) {
        console.error('\n❌ Investigation Error:', error.message);
    } finally {
        console.log('\n🔄 Investigation complete.');
        await page.waitForTimeout(2000);
        await browser.close();
    }
})();