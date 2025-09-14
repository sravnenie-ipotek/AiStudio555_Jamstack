#!/usr/bin/env node

const { chromium } = require('playwright');

async function testFAQDirect() {
    console.log('🔍 Testing FAQ titles with direct browser access...');

    const browser = await chromium.launch({
        headless: false,
        slowMo: 1000
    });

    const context = await browser.newContext({
        viewport: { width: 1200, height: 800 }
    });

    const page = await context.newPage();

    try {
        // Navigate to Hebrew homepage directly on the server
        console.log('📱 Navigating to Hebrew homepage via server...');
        await page.goto('http://localhost:3000/he/');
        await page.waitForLoadState('networkidle');

        // Wait longer for UI translator
        console.log('⏳ Waiting for UI translator to load and complete...');
        await page.waitForTimeout(5000);

        // Check if UI translator is loaded
        const translatorExists = await page.evaluate(() => {
            return typeof window.UITranslator !== 'undefined';
        });

        console.log('🔧 UI Translator exists:', translatorExists);

        // Manually trigger UI translator
        await page.evaluate(() => {
            if (window.UITranslator) {
                console.log('🔄 Manually triggering UI translator...');
                const translator = new window.UITranslator();
                translator.translatePage();
            }
        });

        await page.waitForTimeout(3000);

        // Check FAQ titles specifically
        console.log('\\n🔍 Checking FAQ titles after translation...');

        const faqTitles = await page.$$eval('.faq-question', elements =>
            elements.map((el, index) => ({
                index: index + 1,
                text: el.textContent.trim()
            }))
        );

        console.log('📋 FAQ Question Titles Found:');
        faqTitles.forEach(faq => {
            const isTranslated = faq.text !== 'שלטו ב-AI וטכנולוגיה';
            console.log(`  ${faq.index}. "${faq.text}" ${isTranslated ? '✅' : '❌'}`);
        });

        // Check API data in browser
        const apiData = await page.evaluate(async () => {
            try {
                const response = await fetch('http://localhost:3000/api/home-page?locale=he');
                const data = await response.json();
                return {
                    success: true,
                    faqTitles: {
                        faq1Title: data.data?.attributes?.faq1Title,
                        faq2Title: data.data?.attributes?.faq2Title,
                        faq3Title: data.data?.attributes?.faq3Title,
                        faq4Title: data.data?.attributes?.faq4Title,
                        faq5Title: data.data?.attributes?.faq5Title,
                        faq6Title: data.data?.attributes?.faq6Title,
                    }
                };
            } catch (error) {
                return { success: false, error: error.message };
            }
        });

        console.log('\\n🌐 API Data in browser:');
        if (apiData.success) {
            Object.entries(apiData.faqTitles).forEach(([key, value]) => {
                console.log(`  ${key}: ${value || 'NOT SET'}`);
            });
        } else {
            console.log('❌ API Error:', apiData.error);
        }

        // Take final screenshot
        await page.screenshot({
            path: 'faq-direct-test.png',
            fullPage: false
        });

        console.log('\\n📊 Results:');
        const translatedCount = faqTitles.filter(faq => faq.text !== 'שלטו ב-AI וטכנולוגיה').length;
        console.log(`- FAQ questions found: ${faqTitles.length}`);
        console.log(`- Successfully translated: ${translatedCount}`);
        console.log(`- Still generic: ${faqTitles.length - translatedCount}`);
        console.log(`- API working: ${apiData.success ? 'Yes' : 'No'}`);
        console.log(`- Screenshot: faq-direct-test.png`);

        if (translatedCount > 0) {
            console.log('\\n🎉 SUCCESS: FAQ titles are being translated!');
        } else {
            console.log('\\n❌ ISSUE: FAQ titles still need work');
        }

    } catch (error) {
        console.error('❌ Error during testing:', error);
        await page.screenshot({
            path: 'faq-direct-error.png',
            fullPage: true
        });
    }

    await browser.close();
    console.log('\\n✅ Direct FAQ test completed!');
}

testFAQDirect().catch(console.error);