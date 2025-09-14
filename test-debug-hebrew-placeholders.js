#!/usr/bin/env node

const { chromium } = require('playwright');

async function debugHebrewPlaceholders() {
    console.log('🔍 Debug Test: Hebrew Placeholders Search');

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
        console.log('\n📱 Going to Hebrew page...');
        await page.goto('http://localhost:3005/he/index.html');
        await page.waitForLoadState('networkidle');

        // Wait for UI translator
        await page.waitForTimeout(5000);

        // Manual search for Hebrew placeholders
        console.log('\n🔍 Manual search for Hebrew placeholders...');
        const hebrewPlaceholderInfo = await page.evaluate(() => {
            const placeholders = [];
            const allElements = document.querySelectorAll('*');

            allElements.forEach(el => {
                const text = el.textContent ? el.textContent.trim() : '';
                if (text === 'שלטו ב-AI וטכנולוגיה') {
                    placeholders.push({
                        tag: el.tagName,
                        class: el.className || 'no-class',
                        text: text,
                        parent: el.parentElement ? el.parentElement.tagName : 'no-parent',
                        parentClass: el.parentElement ? (el.parentElement.className || 'no-parent-class') : 'no-parent-class',
                        childrenCount: el.childNodes.length,
                        hasTextNode: el.childNodes.length === 1 && el.firstChild?.nodeType === Node.TEXT_NODE
                    });
                }
            });

            return placeholders;
        });

        console.log('\n📋 Hebrew Placeholders Found:');
        hebrewPlaceholderInfo.forEach((info, i) => {
            console.log(`${i + 1}. ${info.tag}.${info.class}`);
            console.log(`   Text: "${info.text}"`);
            console.log(`   Parent: ${info.parent}.${info.parentClass}`);
            console.log(`   Children: ${info.childrenCount}, Has Text Node: ${info.hasTextNode}`);
        });

        // Check if UI Translator is working
        const translatorStatus = await page.evaluate(() => {
            return {
                exists: typeof window.UITranslator !== 'undefined',
                autoTriggerCalled: window._uiTranslatorCalled || false
            };
        });

        console.log('\n🔧 UI Translator Status:');
        console.log(`- Exists: ${translatorStatus.exists}`);
        console.log(`- Auto-Trigger Called: ${translatorStatus.autoTriggerCalled}`);

        // Show relevant console messages
        console.log('\n📝 Strategy 4 Related Console Messages:');
        const strategy4Messages = consoleMessages.filter(msg =>
            msg.includes('Strategy 4') || msg.includes('Aggressive') || msg.includes('Hebrew placeholder')
        );

        if (strategy4Messages.length === 0) {
            console.log('❌ No Strategy 4 logs found!');
        } else {
            strategy4Messages.forEach(msg => console.log(`  ${msg}`));
        }

        console.log('\n📝 All Translation Messages:');
        const translationMessages = consoleMessages.filter(msg =>
            msg.includes('❓ Updating FAQ') || msg.includes('📋 Available FAQ') ||
            msg.includes('Strategy') || msg.includes('✅ FAQ') || msg.includes('Hebrew')
        );
        translationMessages.forEach(msg => console.log(`  ${msg}`));

        await page.screenshot({ path: 'debug-hebrew-placeholders.png' });

        console.log('\n📊 Debug Results:');
        console.log(`- Hebrew Placeholders Found: ${hebrewPlaceholderInfo.length}`);
        console.log(`- UI Translator Exists: ${translatorStatus.exists}`);
        console.log(`- Strategy 4 Messages: ${strategy4Messages.length}`);
        console.log(`- Console Messages: ${consoleMessages.length}`);

    } catch (error) {
        console.error('❌ Error:', error);
    }

    await browser.close();
    console.log('\n✅ Debug test completed!');
}

debugHebrewPlaceholders().catch(console.error);