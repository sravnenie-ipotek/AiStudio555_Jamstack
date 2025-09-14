#!/usr/bin/env node

const { chromium } = require('playwright');

async function testPort3005() {
    console.log('🔍 ULTRATHINK Investigation: Port 3005 vs Port 3000');

    const browser = await chromium.launch({
        headless: false,
        slowMo: 1000
    });

    const context = await browser.newContext({
        viewport: { width: 1200, height: 800 }
    });

    const page = await context.newPage();

    // Capture all console messages
    const consoleMessages = [];
    page.on('console', msg => {
        consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
    });

    // Capture network errors
    const networkErrors = [];
    page.on('requestfailed', request => {
        networkErrors.push(`Failed: ${request.url()}`);
    });

    try {
        console.log('\\n🔍 TESTING PORT 3005 (Static File Server)...');
        await page.goto('http://localhost:3005/he/index.html');
        await page.waitForLoadState('networkidle');

        // Wait for potential UI translator
        await page.waitForTimeout(5000);

        // Check if UI translator exists
        const translatorInfo = await page.evaluate(() => {
            return {
                exists: typeof window.UITranslator !== 'undefined',
                apiBase: window.UITranslator ? new window.UITranslator().apiBase : 'N/A',
                locale: window.UITranslator ? new window.UITranslator().currentLocale : 'N/A'
            };
        });

        console.log('🔧 UI Translator Status:');
        console.log(`  - Exists: ${translatorInfo.exists}`);
        console.log(`  - API Base: ${translatorInfo.apiBase}`);
        console.log(`  - Detected Locale: ${translatorInfo.locale}`);

        // Check FAQ titles
        const faqTitles = await page.$$eval('.faq-question', elements =>
            elements.map((el, index) => ({
                index: index + 1,
                text: el.textContent.trim(),
                isGeneric: el.textContent.trim() === 'שלטו ב-AI וטכנולוגיה'
            }))
        );

        console.log('\\n📋 FAQ Titles on Port 3005:');
        faqTitles.forEach(faq => {
            console.log(`  ${faq.index}. "${faq.text}" ${faq.isGeneric ? '❌ Generic' : '✅ Translated'}`);
        });

        // Test API call manually
        console.log('\\n🌐 Testing API Call from Port 3005...');
        const apiTest = await page.evaluate(async () => {
            try {
                const response = await fetch('http://localhost:3000/api/home-page?locale=he');
                const data = await response.json();
                return {
                    success: true,
                    status: response.status,
                    hasData: !!data.data,
                    faqTitles: {
                        faq1: data.data?.attributes?.faq1Title,
                        faq2: data.data?.attributes?.faq2Title,
                        faq3: data.data?.attributes?.faq3Title
                    }
                };
            } catch (error) {
                return { success: false, error: error.message };
            }
        });

        if (apiTest.success) {
            console.log('✅ API Call Success:');
            console.log(`  - Status: ${apiTest.status}`);
            console.log(`  - Has Data: ${apiTest.hasData}`);
            Object.entries(apiTest.faqTitles).forEach(([key, value]) => {
                console.log(`  - ${key}: ${value || 'NOT SET'}`);
            });
        } else {
            console.log('❌ API Call Failed:', apiTest.error);
        }

        // Force trigger UI translator
        console.log('\\n🔄 Manually Triggering UI Translator...');
        const translationResult = await page.evaluate(async () => {
            if (window.UITranslator) {
                try {
                    const translator = new window.UITranslator();
                    await translator.translatePage();
                    return { success: true, message: 'Translation triggered' };
                } catch (error) {
                    return { success: false, error: error.message };
                }
            }
            return { success: false, error: 'UITranslator not found' };
        });

        console.log('Translation Result:', translationResult);

        await page.waitForTimeout(3000);

        // Check FAQ titles again after manual trigger
        const faqTitlesAfter = await page.$$eval('.faq-question', elements =>
            elements.map((el, index) => ({
                index: index + 1,
                text: el.textContent.trim(),
                isGeneric: el.textContent.trim() === 'שלטו ב-AI וטכנולוגיה'
            }))
        );

        console.log('\\n📋 FAQ Titles AFTER Manual Translation:');
        faqTitlesAfter.forEach(faq => {
            console.log(`  ${faq.index}. "${faq.text}" ${faq.isGeneric ? '❌ Still Generic' : '✅ Translated'}`);
        });

        // Show console messages
        console.log('\\n📝 Console Messages:');
        consoleMessages.slice(-20).forEach(msg => console.log(`  ${msg}`));

        // Show network errors
        if (networkErrors.length > 0) {
            console.log('\\n🚨 Network Errors:');
            networkErrors.forEach(err => console.log(`  ${err}`));
        }

        await page.screenshot({ path: 'port-3005-investigation.png' });

        console.log('\\n📊 INVESTIGATION SUMMARY:');
        console.log(`- UI Translator Loaded: ${translatorInfo.exists ? 'Yes' : 'No'}`);
        console.log(`- API Accessible: ${apiTest.success ? 'Yes' : 'No'}`);
        console.log(`- FAQ Titles Translated: ${faqTitlesAfter.filter(f => !f.isGeneric).length}/${faqTitlesAfter.length}`);
        console.log(`- Console Messages: ${consoleMessages.length}`);
        console.log(`- Network Errors: ${networkErrors.length}`);

    } catch (error) {
        console.error('❌ Error:', error);
        await page.screenshot({ path: 'port-3005-error.png' });
    }

    await browser.close();
    console.log('\\n✅ Port 3005 investigation completed!');
}

testPort3005().catch(console.error);