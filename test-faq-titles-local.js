#!/usr/bin/env node

const { chromium } = require('playwright');

async function testFAQTitlesLocal() {
    console.log('🔍 Testing FAQ titles locally...\n');

    const browser = await chromium.launch({
        headless: false,
        slowMo: 1000
    });

    const context = await browser.newContext({
        viewport: { width: 1200, height: 800 }
    });

    const page = await context.newPage();

    try {
        // Navigate to Hebrew homepage
        console.log('📱 Navigating to Hebrew homepage...');
        await page.goto('http://localhost:3005/he/home.html');
        await page.waitForLoadState('networkidle');

        // Wait for UI translator to load
        console.log('⏳ Waiting for UI translator to complete...');
        await page.waitForTimeout(3000);

        // Check FAQ section
        console.log('\n🔍 Checking FAQ section...');

        // Look for FAQ titles
        const faqTitles = await page.$$eval('h1, h2, h3, h4, h5, h6', elements =>
            elements.map(el => ({
                tagName: el.tagName,
                text: el.textContent.trim(),
                className: el.className
            })).filter(el =>
                el.text.includes('AI') ||
                el.text.includes('קורסים') ||
                el.text.includes('משך') ||
                el.text.includes('תעודות') ||
                el.text.includes('תמיכה') ||
                el.text.includes('דרישות') ||
                el.text.includes('למידה')
            )
        );

        console.log('📋 FAQ-related titles found:');
        faqTitles.forEach((title, index) => {
            console.log(`  ${index + 1}. ${title.tagName}: "${title.text}"`);
        });

        // Check for generic "שלטו ב-AI וטכנולוגיה"
        const genericTitles = await page.$$eval('*', elements =>
            Array.from(elements).filter(el =>
                el.textContent.trim() === 'שלטו ב-AI וטכנולוגיה'
            ).map(el => ({
                tagName: el.tagName,
                className: el.className,
                parent: el.parentElement?.tagName
            }))
        );

        console.log('\n🔍 Generic "שלטו ב-AI וטכנולוגיה" titles still present:');
        if (genericTitles.length === 0) {
            console.log('✅ No generic titles found - all have been replaced!');
        } else {
            genericTitles.forEach((title, index) => {
                console.log(`  ${index + 1}. ${title.tagName} (class: ${title.className})`);
            });
        }

        // Check API response
        console.log('\n🌐 Testing API response...');
        const apiResponse = await page.evaluate(async () => {
            try {
                const response = await fetch('http://localhost:3000/api/home-page?locale=he');
                const data = await response.json();
                return {
                    success: true,
                    faqTitles: {
                        faq_1_title: data.data?.attributes?.faq_1_title,
                        faq_2_title: data.data?.attributes?.faq_2_title,
                        faq_3_title: data.data?.attributes?.faq_3_title
                    }
                };
            } catch (error) {
                return { success: false, error: error.message };
            }
        });

        if (apiResponse.success) {
            console.log('✅ API Response received:');
            Object.entries(apiResponse.faqTitles).forEach(([key, value]) => {
                console.log(`  ${key}: ${value || 'NOT SET'}`);
            });
        } else {
            console.log('❌ API Error:', apiResponse.error);
        }

        // Check console logs for translator activity
        console.log('\n🔍 Checking page console for translator activity...');
        const consoleLogs = [];
        page.on('console', msg => {
            if (msg.text().includes('FAQ') || msg.text().includes('✅')) {
                consoleLogs.push(msg.text());
            }
        });

        // Trigger translator manually
        await page.evaluate(() => {
            if (window.UITranslator) {
                const translator = new window.UITranslator();
                translator.translatePage();
            }
        });

        await page.waitForTimeout(2000);

        // Take final screenshot
        console.log('\n📸 Taking screenshot of FAQ section...');
        await page.screenshot({
            path: 'faq-test-screenshot.png',
            fullPage: false
        });

        console.log('\n📊 Test Results Summary:');
        console.log(`- FAQ-related titles found: ${faqTitles.length}`);
        console.log(`- Generic titles remaining: ${genericTitles.length}`);
        console.log(`- API response: ${apiResponse.success ? 'Success' : 'Failed'}`);
        console.log(`- Screenshot saved: faq-test-screenshot.png`);

        if (genericTitles.length === 0 && faqTitles.length > 0) {
            console.log('\n🎉 SUCCESS: FAQ titles have been successfully replaced!');
        } else {
            console.log('\n⚠️ ISSUE: Some FAQ titles may not have been updated properly');
        }

    } catch (error) {
        console.error('❌ Error during testing:', error);

        await page.screenshot({
            path: 'faq-test-error.png',
            fullPage: true
        });
    }

    await browser.close();
    console.log('\n✅ FAQ title test completed!');
}

testFAQTitlesLocal().catch(console.error);