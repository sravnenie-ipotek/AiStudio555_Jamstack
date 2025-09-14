#!/usr/bin/env node

const { chromium } = require('playwright');

async function testFixValidation() {
    console.log('🔍 Testing UI Translator Fix - Auto-Trigger Validation');

    const browser = await chromium.launch({
        headless: false,
        slowMo: 1000
    });

    const context = await browser.newContext({
        viewport: { width: 1200, height: 800 }
    });

    const page = await context.newPage();

    // Capture console messages
    const consoleMessages = [];
    page.on('console', msg => {
        consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
    });

    try {
        console.log('\\n📱 Testing Port 3005 AFTER Fix...');
        await page.goto('http://localhost:3005/he/index.html');
        await page.waitForLoadState('networkidle');

        // Wait longer for UI translator to auto-trigger
        console.log('⏳ Waiting for AUTO-TRANSLATION (no manual trigger)...');
        await page.waitForTimeout(8000); // Longer wait to ensure auto-trigger completes

        // Check FAQ titles WITHOUT manual triggering
        const faqTitles = await page.$$eval('.faq-question', elements =>
            elements.map((el, index) => ({
                index: index + 1,
                text: el.textContent.trim(),
                isTranslated: el.textContent.trim() !== 'שלטו ב-AI וטכנולוגיה'
            }))
        );

        console.log('\\n📋 FAQ Titles (AUTO-TRANSLATION ONLY):');
        faqTitles.forEach(faq => {
            console.log(`  ${faq.index}. "${faq.text}" ${faq.isTranslated ? '✅ Translated' : '❌ Still Generic'}`);
        });

        // Count results
        const translatedCount = faqTitles.filter(f => f.isTranslated).length;
        const totalCount = faqTitles.length;

        // Check for JavaScript errors
        const jsErrors = consoleMessages.filter(msg => msg.includes('error') || msg.includes('Error'));

        console.log('\\n🚨 JavaScript Errors:');
        if (jsErrors.length === 0) {
            console.log('  ✅ No JavaScript errors detected!');
        } else {
            jsErrors.forEach(error => console.log(`  ❌ ${error}`));
        }

        // Check for translation activity
        const translationLogs = consoleMessages.filter(msg =>
            msg.includes('FAQ') || msg.includes('Translation') || msg.includes('UI Translator')
        );

        console.log('\\n📝 Translation Activity:');
        if (translationLogs.length > 0) {
            translationLogs.slice(-10).forEach(log => console.log(`  ${log}`));
        } else {
            console.log('  ⚠️ No translation activity detected');
        }

        await page.screenshot({ path: 'fix-validation-test.png' });

        console.log('\\n🎯 FINAL RESULTS:');
        console.log(`- FAQ Titles Translated: ${translatedCount}/${totalCount}`);
        console.log(`- Auto-Translation Working: ${translatedCount > 0 ? 'YES ✅' : 'NO ❌'}`);
        console.log(`- JavaScript Errors: ${jsErrors.length === 0 ? 'None ✅' : jsErrors.length + ' ❌'}`);
        console.log(`- Translation Logs: ${translationLogs.length}`);

        if (translatedCount === totalCount && jsErrors.length === 0) {
            console.log('\\n🎉 SUCCESS: Auto-translation is now working perfectly!');
        } else if (translatedCount > 0) {
            console.log('\\n⚠️ PARTIAL: Some translation is working but needs improvement');
        } else {
            console.log('\\n❌ FAILED: Auto-translation is still not working');
        }

    } catch (error) {
        console.error('❌ Error:', error);
        await page.screenshot({ path: 'fix-validation-error.png' });
    }

    await browser.close();
    console.log('\\n✅ Fix validation completed!');
}

testFixValidation().catch(console.error);