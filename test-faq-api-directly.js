#!/usr/bin/env node

const { chromium } = require('playwright');

async function testFAQAPIDirectly() {
    console.log('🔍 Testing FAQ API directly...\n');

    const browser = await chromium.launch({
        headless: false,
        slowMo: 500
    });

    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        // Navigate to Hebrew homepage
        console.log('📱 Navigating to Hebrew homepage...');
        await page.goto('http://localhost:3005/he/home.html');
        await page.waitForLoadState('networkidle');

        // Test API directly through browser
        console.log('\n🌐 Testing API response...');
        const apiResponse = await page.evaluate(async () => {
            try {
                const response = await fetch('http://localhost:3000/api/home-page?locale=he');
                const data = await response.json();
                return {
                    success: true,
                    data: data.data?.attributes || {}
                };
            } catch (error) {
                return { success: false, error: error.message };
            }
        });

        if (apiResponse.success) {
            console.log('✅ API Response received');

            // Check FAQ titles
            const faqTitles = {
                faq1Title: apiResponse.data.faq1Title,
                faq2Title: apiResponse.data.faq2Title,
                faq3Title: apiResponse.data.faq3Title,
                faq4Title: apiResponse.data.faq4Title,
                faq5Title: apiResponse.data.faq5Title,
                faq6Title: apiResponse.data.faq6Title
            };

            console.log('\n📋 FAQ Titles from API:');
            Object.entries(faqTitles).forEach(([key, value]) => {
                console.log(`  ${key}: ${value || 'NOT SET'}`);
            });

            // Test if FAQ titles exist on page
            console.log('\n🔍 Current FAQ titles on page:');
            const pageFAQTitles = await page.$$eval('h1, h2, h3, h4, h5, h6', elements =>
                elements.map(el => ({
                    tagName: el.tagName,
                    text: el.textContent.trim(),
                    className: el.className
                })).filter(el =>
                    el.text === 'שלטו ב-AI וטכנולוגיה' ||
                    el.text.includes('קורסים') ||
                    el.text.includes('משך') ||
                    el.text.includes('תעודות')
                )
            );

            pageFAQTitles.slice(0, 10).forEach((title, index) => {
                console.log(`  ${index + 1}. ${title.tagName}: "${title.text}"`);
            });

            // Force trigger UI translator
            console.log('\n🔄 Manually triggering UI translator...');
            await page.evaluate(() => {
                if (window.UITranslator) {
                    console.log('🔧 Found UITranslator, running...');
                    const translator = new window.UITranslator();
                    translator.translatePage();
                } else {
                    console.log('❌ UITranslator not found');
                }
            });

            await page.waitForTimeout(3000);

            // Check titles again after translation
            console.log('\n🔍 FAQ titles after UI translator:');
            const afterTranslationTitles = await page.$$eval('h1, h2, h3, h4, h5, h6', elements =>
                elements.map(el => ({
                    tagName: el.tagName,
                    text: el.textContent.trim(),
                    className: el.className
                })).filter(el =>
                    el.text === 'שלטו ב-AI וטכנולוגיה' ||
                    el.text.includes('קורסים') ||
                    el.text.includes('משך') ||
                    el.text.includes('תעודות') ||
                    el.text.includes('תמיכה') ||
                    el.text.includes('דרישות') ||
                    el.text.includes('למידה')
                )
            );

            console.log(`Found ${afterTranslationTitles.length} FAQ-related titles after translation:`);
            afterTranslationTitles.slice(0, 15).forEach((title, index) => {
                console.log(`  ${index + 1}. ${title.tagName}: "${title.text}"`);
            });

            // Take screenshot
            await page.screenshot({
                path: 'faq-debug-screenshot.png',
                fullPage: false
            });
            console.log('\n📸 Screenshot saved: faq-debug-screenshot.png');

        } else {
            console.log('❌ API Error:', apiResponse.error);
        }

    } catch (error) {
        console.error('❌ Error during testing:', error);
        await page.screenshot({
            path: 'faq-debug-error.png',
            fullPage: true
        });
    }

    await browser.close();
    console.log('\n✅ FAQ API test completed!');
}

testFAQAPIDirectly().catch(console.error);