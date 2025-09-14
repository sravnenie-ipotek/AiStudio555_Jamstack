#!/usr/bin/env node

const { chromium } = require('playwright');

async function testSimpleVerification() {
    console.log('🎯 Simple Verification: Hebrew FAQ Translation');

    const browser = await chromium.launch({
        headless: false,
        slowMo: 500
    });

    const page = await browser.newPage();

    try {
        console.log('\n📱 Loading Hebrew page...');
        await page.goto('http://localhost:3005/he/index.html');
        await page.waitForLoadState('networkidle');

        // Wait for auto-translation
        console.log('⏳ Waiting for auto-translation (7 seconds)...');
        await page.waitForTimeout(7000);

        // Check for any FAQ-related elements
        const faqElements = await page.evaluate(() => {
            const allElements = [];

            // Check for various FAQ selectors
            const selectors = [
                '.faq-question',
                '[class*="faq"]',
                'h3:contains("שלטו ב-AI וטכנולוגיה")',
                '*:contains("קורסים מוצעים")',
                '*:contains("משך הקורסים")'
            ];

            // Manual search for FAQ content
            const allFAQElements = [];
            document.querySelectorAll('*').forEach(el => {
                const text = el.textContent ? el.textContent.trim() : '';
                if (text === 'קורסים מוצעים' ||
                    text === 'משך הקורסים' ||
                    text === 'תעודות והסמכה' ||
                    text === 'תמיכה בקריירה' ||
                    text === 'דרישות קדם' ||
                    text === 'למידה בקצב אישי' ||
                    text === 'שלטו ב-AI וטכנולוגיה') {
                    allFAQElements.push({
                        tag: el.tagName,
                        class: el.className || 'no-class',
                        text: text,
                        isTranslated: text !== 'שלטו ב-AI וטכנולוגיה'
                    });
                }
            });

            return allFAQElements;
        });

        console.log('\n📋 FAQ-Related Elements Found:');
        faqElements.forEach((el, i) => {
            console.log(`  ${i + 1}. ${el.tag}.${el.class}: "${el.text}" ${el.isTranslated ? '✅' : '❌'}`);
        });

        const translatedElements = faqElements.filter(el => el.isTranslated);
        const genericElements = faqElements.filter(el => !el.isTranslated);

        console.log('\n🎯 VERIFICATION RESULTS:');
        console.log(`- Total FAQ Elements Found: ${faqElements.length}`);
        console.log(`- Translated FAQ Elements: ${translatedElements.length}`);
        console.log(`- Generic Placeholders Remaining: ${genericElements.length}`);
        console.log(`- Translation Success: ${translatedElements.length > 0 ? 'YES ✅' : 'NO ❌'}`);

        if (translatedElements.length > 0) {
            console.log('\n🎉 SUCCESS: Auto-translation is working!');
            console.log('   Hebrew FAQ titles are being automatically replaced.');
        }

        if (genericElements.length > 0) {
            console.log('\n⚠️  Some generic placeholders still remain:');
            genericElements.forEach(el => {
                console.log(`   - ${el.tag}.${el.class}: "${el.text}"`);
            });
        }

        await page.screenshot({ path: 'simple-verification.png' });

    } catch (error) {
        console.error('❌ Error:', error);
    }

    await browser.close();
    console.log('\n✅ Simple verification completed!');
}

testSimpleVerification().catch(console.error);