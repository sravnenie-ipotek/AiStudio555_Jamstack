// Playwright Translation Scanner
// Analyzes what content is not translated when switching to Russian

const { chromium } = require('playwright');

async function scanUntranslatedContent() {
    console.log('🔍 Scanning for untranslated content...');

    const browser = await chromium.launch({ headless: false, slowMo: 1000 });
    const page = await browser.newPage();

    try {
        // Load English version first
        console.log('📄 Loading English version...');
        await page.goto('http://localhost:3005/home.html');
        await page.waitForTimeout(3000);

        // Get all text content in English
        console.log('📝 Extracting English text content...');
        const englishContent = await page.evaluate(() => {
            const textElements = [];

            function extractText(element, path = '') {
                // Skip script, style, and hidden elements
                if (['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(element.tagName)) return;
                if (element.style.display === 'none' || element.style.visibility === 'hidden') return;

                // Get direct text content (not from children)
                const directText = Array.from(element.childNodes)
                    .filter(node => node.nodeType === Node.TEXT_NODE)
                    .map(node => node.textContent.trim())
                    .filter(text => text.length > 2) // Filter out short text like spaces
                    .join(' ').trim();

                if (directText) {
                    textElements.push({
                        text: directText,
                        element: element.tagName,
                        path: path + ' > ' + element.tagName.toLowerCase(),
                        hasDataI18n: element.hasAttribute('data-i18n'),
                        dataI18nValue: element.getAttribute('data-i18n') || null,
                        className: element.className || '',
                        id: element.id || ''
                    });
                }

                // Recursively check children
                Array.from(element.children).forEach((child, index) => {
                    extractText(child, path + ' > ' + element.tagName.toLowerCase() + `[${index}]`);
                });
            }

            extractText(document.body);
            return textElements;
        });

        console.log(`📊 Found ${englishContent.length} text elements in English`);

        // Switch to Russian
        console.log('🔄 Switching to Russian...');

        // Click Russian language pill
        try {
            await page.click('.lang-pill:has-text("RU")', { force: true });
        } catch (e) {
            await page.click('.mobile-lang-pill:has-text("RU")', { force: true });
        }

        await page.waitForTimeout(4000); // Wait for translation

        // Get all text content in Russian
        console.log('📝 Extracting Russian text content...');
        const russianContent = await page.evaluate(() => {
            const textElements = [];

            function extractText(element, path = '') {
                if (['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(element.tagName)) return;
                if (element.style.display === 'none' || element.style.visibility === 'hidden') return;

                const directText = Array.from(element.childNodes)
                    .filter(node => node.nodeType === Node.TEXT_NODE)
                    .map(node => node.textContent.trim())
                    .filter(text => text.length > 2)
                    .join(' ').trim();

                if (directText) {
                    textElements.push({
                        text: directText,
                        element: element.tagName,
                        path: path + ' > ' + element.tagName.toLowerCase(),
                        hasDataI18n: element.hasAttribute('data-i18n'),
                        dataI18nValue: element.getAttribute('data-i18n') || null,
                        className: element.className || '',
                        id: element.id || ''
                    });
                }

                Array.from(element.children).forEach((child, index) => {
                    extractText(child, path + ' > ' + element.tagName.toLowerCase() + `[${index}]`);
                });
            }

            extractText(document.body);
            return textElements;
        });

        console.log(`📊 Found ${russianContent.length} text elements in Russian`);

        // Compare and find untranslated content
        console.log('🔍 Analyzing translation differences...');

        const untranslated = [];
        const translated = [];

        // Create maps for easier comparison
        const englishMap = new Map();
        const russianMap = new Map();

        englishContent.forEach((item, index) => {
            englishMap.set(index, item);
        });

        russianContent.forEach((item, index) => {
            russianMap.set(index, item);
        });

        // Compare texts
        for (let i = 0; i < Math.max(englishContent.length, russianContent.length); i++) {
            const engItem = englishMap.get(i);
            const rusItem = russianMap.get(i);

            if (engItem && rusItem) {
                if (engItem.text === rusItem.text) {
                    // Text didn't change - likely untranslated
                    untranslated.push({
                        text: engItem.text,
                        element: engItem.element,
                        className: engItem.className,
                        hasDataI18n: engItem.hasDataI18n,
                        dataI18nValue: engItem.dataI18nValue,
                        reason: 'Text unchanged between EN and RU'
                    });
                } else {
                    // Text changed - translated
                    translated.push({
                        english: engItem.text,
                        russian: rusItem.text,
                        element: engItem.element,
                        className: engItem.className,
                        hasDataI18n: engItem.hasDataI18n,
                        dataI18nValue: engItem.dataI18nValue
                    });
                }
            }
        }

        // Results
        console.log('\\n🎯 TRANSLATION ANALYSIS RESULTS:');
        console.log(`✅ Translated elements: ${translated.length}`);
        console.log(`❌ Untranslated elements: ${untranslated.length}`);
        console.log(`📊 Translation rate: ${Math.round((translated.length / (translated.length + untranslated.length)) * 100)}%`);

        console.log('\\n✅ SUCCESSFULLY TRANSLATED:');
        translated.slice(0, 10).forEach((item, index) => {
            console.log(`  ${index + 1}. EN: "${item.english}"`);
            console.log(`     RU: "${item.russian}"`);
            console.log(`     Element: ${item.element}, data-i18n: ${item.dataI18nValue || 'none'}`);
            console.log('');
        });

        if (translated.length > 10) {
            console.log(`  ... and ${translated.length - 10} more translated elements`);
        }

        console.log('\\n❌ UNTRANSLATED CONTENT (needs data-i18n attributes):');
        untranslated.slice(0, 20).forEach((item, index) => {
            console.log(`  ${index + 1}. "${item.text}"`);
            console.log(`     Element: ${item.element}`);
            console.log(`     Class: ${item.className || 'none'}`);
            console.log(`     Has data-i18n: ${item.hasDataI18n}`);
            console.log(`     Reason: ${item.reason}`);
            console.log('');
        });

        if (untranslated.length > 20) {
            console.log(`  ... and ${untranslated.length - 20} more untranslated elements`);
        }

        console.log('\\n📋 SUMMARY FOR FIXES:');
        console.log('Elements that need data-i18n attributes:');

        // Group by element type
        const elementGroups = {};
        untranslated.forEach(item => {
            const key = `${item.element} (class: ${item.className || 'none'})`;
            if (!elementGroups[key]) elementGroups[key] = [];
            elementGroups[key].push(item.text);
        });

        Object.entries(elementGroups).forEach(([elementType, texts]) => {
            console.log(`\\n🔸 ${elementType}:`);
            texts.slice(0, 5).forEach(text => {
                console.log(`   - "${text}"`);
            });
            if (texts.length > 5) {
                console.log(`   ... and ${texts.length - 5} more`);
            }
        });

    } catch (error) {
        console.error('❌ Error during scanning:', error);
    }

    await browser.close();
}

scanUntranslatedContent().catch(console.error);