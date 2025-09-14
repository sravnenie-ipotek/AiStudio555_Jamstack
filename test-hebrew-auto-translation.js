#!/usr/bin/env node

const { chromium } = require('playwright');

async function testHebrewAutoTranslation() {
    console.log('🔍 Testing Hebrew Auto-Translation on Page Load');

    const browser = await chromium.launch({
        headless: false,
        slowMo: 1000
    });

    const context = await browser.newContext({
        viewport: { width: 1200, height: 800 }
    });

    const page = await context.newPage();

    // Capture all console messages including errors
    const consoleMessages = [];
    page.on('console', msg => {
        consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
    });

    page.on('pageerror', error => {
        consoleMessages.push(`[ERROR] ${error.message}`);
    });

    try {
        console.log('\n📱 Loading Hebrew page...');
        await page.goto('http://localhost:3005/he/index.html');
        await page.waitForLoadState('networkidle');

        // Wait for potential auto-translation
        console.log('⏳ Waiting for auto-translation (15 seconds)...');
        await page.waitForTimeout(15000);

        // Check current FAQ state
        const faqState = await page.evaluate(() => {
            const faqs = document.querySelectorAll('.faq-question');
            return {
                count: faqs.length,
                titles: Array.from(faqs).map((el, i) => ({
                    index: i + 1,
                    text: el.textContent.trim(),
                    isGeneric: el.textContent.trim() === 'שלטו ב-AI וטכנולוגיה'
                }))
            };
        });

        console.log('\n📋 FAQ Status AFTER Auto-Wait:');
        faqState.titles.forEach(faq => {
            console.log(`  ${faq.index}. "${faq.text}" ${faq.isGeneric ? '❌ Generic' : '✅ Translated'}`);
        });

        // Check if UI Translator auto-triggered
        const translatorStatus = await page.evaluate(() => {
            return {
                exists: typeof window.UITranslator !== 'undefined',
                autoTriggered: window._autoTranslationTriggered || false,
                locale: window.location.pathname.includes('/he/') ? 'he' : 'unknown'
            };
        });

        console.log('\n🔧 UI Translator Status:');
        console.log(`- Exists: ${translatorStatus.exists}`);
        console.log(`- Auto-Triggered: ${translatorStatus.autoTriggered}`);
        console.log(`- Detected Locale: ${translatorStatus.locale}`);

        // Show translation-related console messages
        const translationLogs = consoleMessages.filter(msg =>
            msg.includes('UI Translator') || msg.includes('FAQ') ||
            msg.includes('Translation') || msg.includes('Hebrew') ||
            msg.includes('locale') || msg.includes('he')
        );

        console.log('\n📝 Translation Console Messages:');
        if (translationLogs.length === 0) {
            console.log('❌ No translation messages found!');
        } else {
            translationLogs.forEach(msg => console.log(`  ${msg}`));
        }

        // Show JavaScript errors
        const errorLogs = consoleMessages.filter(msg =>
            msg.includes('[ERROR]') || msg.includes('error') || msg.includes('Error')
        );

        console.log('\n🚨 JavaScript Errors:');
        if (errorLogs.length === 0) {
            console.log('✅ No JavaScript errors');
        } else {
            errorLogs.forEach(msg => console.log(`  ${msg}`));
        }

        // Test manual trigger to verify it works
        console.log('\n🔄 Testing manual translation trigger...');
        const manualResult = await page.evaluate(async () => {
            if (window.UITranslator) {
                try {
                    const translator = new window.UITranslator();
                    await translator.translatePage();
                    return { success: true, message: 'Manual trigger successful' };
                } catch (error) {
                    return { success: false, error: error.message };
                }
            }
            return { success: false, error: 'UITranslator not found' };
        });

        console.log(`Manual Trigger Result: ${manualResult.success ? '✅' : '❌'} ${manualResult.message || manualResult.error}`);

        if (manualResult.success) {
            await page.waitForTimeout(3000);

            // Check FAQ state after manual trigger
            const faqStateAfter = await page.evaluate(() => {
                const faqs = document.querySelectorAll('.faq-question');
                return Array.from(faqs).map((el, i) => ({
                    index: i + 1,
                    text: el.textContent.trim(),
                    isGeneric: el.textContent.trim() === 'שלטו ב-AI וטכנולוגיה'
                }));
            });

            console.log('\n📋 FAQ Status AFTER Manual Trigger:');
            faqStateAfter.forEach(faq => {
                console.log(`  ${faq.index}. "${faq.text}" ${faq.isGeneric ? '❌ Still Generic' : '✅ Translated'}`);
            });
        }

        await page.screenshot({ path: 'hebrew-auto-translation-test.png', fullPage: false });

        const genericCount = faqState.titles.filter(f => f.isGeneric).length;
        console.log('\n📊 Final Results:');
        console.log(`- FAQ Elements Found: ${faqState.count}`);
        console.log(`- Still Generic: ${genericCount}/${faqState.count}`);
        console.log(`- Auto-Translation Working: ${genericCount === 0 ? 'YES ✅' : 'NO ❌'}`);
        console.log(`- Manual Translation Working: ${manualResult.success ? 'YES ✅' : 'NO ❌'}`);
        console.log(`- Console Messages: ${consoleMessages.length}`);

    } catch (error) {
        console.error('❌ Error during test:', error);
    }

    await browser.close();
    console.log('\n✅ Hebrew auto-translation test completed!');
}

testHebrewAutoTranslation().catch(console.error);