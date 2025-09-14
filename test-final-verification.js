#!/usr/bin/env node

const { chromium } = require('playwright');

async function testFinalVerification() {
    console.log('🎯 Final Verification: Hebrew FAQ Auto-Translation');

    const browser = await chromium.launch({
        headless: false,
        slowMo: 500
    });

    const context = await browser.newContext({
        viewport: { width: 1200, height: 800 }
    });

    const page = await context.newPage();

    try {
        console.log('\n📱 Loading Hebrew page...');
        await page.goto('http://localhost:3005/he/index.html');
        await page.waitForLoadState('networkidle');

        // Wait for auto-translation to complete (includes all delays)
        console.log('⏳ Waiting for complete auto-translation (5 seconds)...');
        await page.waitForTimeout(5000);

        // Get final FAQ state
        const faqResults = await page.evaluate(() => {
            const faqs = document.querySelectorAll('.faq-question');
            return {
                count: faqs.length,
                titles: Array.from(faqs).map((el, i) => ({
                    index: i + 1,
                    text: el.textContent.trim(),
                    isTranslated: el.textContent.trim() !== 'שלטו ב-AI וטכנולוגיה'
                }))
            };
        });

        console.log('\n📋 FINAL FAQ TRANSLATION RESULTS:');
        faqResults.titles.forEach(faq => {
            console.log(`  ${faq.index}. "${faq.text}" ${faq.isTranslated ? '✅ TRANSLATED' : '❌ GENERIC'}`);
        });

        const translatedCount = faqResults.titles.filter(f => f.isTranslated).length;
        const successRate = Math.round((translatedCount / faqResults.count) * 100);

        await page.screenshot({
            path: 'final-verification-hebrew-faq.png',
            clip: { x: 0, y: 1500, width: 1200, height: 800 }  // Focus on FAQ section
        });

        console.log('\n🎯 FINAL VERIFICATION RESULTS:');
        console.log(`- Total FAQ Questions: ${faqResults.count}`);
        console.log(`- Successfully Translated: ${translatedCount}`);
        console.log(`- Success Rate: ${successRate}%`);
        console.log(`- Status: ${successRate === 100 ? 'PERFECT SUCCESS ✅' : successRate > 80 ? 'SUCCESS ✅' : 'NEEDS WORK ❌'}`);
        console.log(`- Screenshot: final-verification-hebrew-faq.png`);

        if (successRate === 100) {
            console.log('\n🎉 CELEBRATION: Hebrew FAQ auto-translation is working PERFECTLY!');
            console.log('   All FAQ titles are automatically translated from generic placeholders');
            console.log('   to specific Hebrew titles when the page loads.');
        }

    } catch (error) {
        console.error('❌ Verification error:', error);
    }

    await browser.close();
    console.log('\n✅ Final verification completed!');
}

testFinalVerification().catch(console.error);