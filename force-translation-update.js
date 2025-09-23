const puppeteer = require('puppeteer');

async function forceTranslationUpdate() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    console.log('🔧 Force Translation Update Test\n');

    await page.goto('http://localhost:3005/home.html?locale=ru', { waitUntil: 'networkidle2' });

    // Wait for language manager to load
    await page.waitForTimeout(3000);

    const result = await page.evaluate(() => {
        // Force update the testimonials title manually
        const element = document.querySelector('[data-i18n="testimonials.content.content.title"]');

        if (!element) {
            return { error: 'Element not found' };
        }

        const beforeText = element.textContent;

        // Get the translation from language manager
        const lm = window.languageManager;
        if (!lm) {
            return { error: 'Language manager not found' };
        }

        const cachedData = lm.contentCache['ru'];
        if (!cachedData) {
            return { error: 'No cached data' };
        }

        const translation = lm.getTranslation(cachedData.data, 'testimonials.content.content.title', 'ru');

        if (!translation) {
            return { error: 'No translation found' };
        }

        // Force update the DOM
        console.log('🔧 Forcing DOM update...');
        element.innerHTML = translation;
        element.textContent = translation;

        const afterText = element.textContent;

        return {
            beforeText,
            afterText,
            translation,
            updateWorked: afterText === translation
        };
    });

    console.log('🔧 Force Update Results:');
    console.log(`Before: "${result.beforeText}"`);
    console.log(`Translation: "${result.translation}"`);
    console.log(`After: "${result.afterText}"`);
    console.log(`Update Worked: ${result.updateWorked ? '✅' : '❌'}`);

    if (result.error) {
        console.log('❌ Error:', result.error);
    }

    // Wait a moment and check if it got overwritten
    await page.waitForTimeout(2000);

    const finalCheck = await page.evaluate(() => {
        const element = document.querySelector('[data-i18n="testimonials.content.content.title"]');
        return {
            finalText: element?.textContent,
            stillRussian: element?.textContent && /[а-я]/i.test(element.textContent)
        };
    });

    console.log(`\nFinal Check (after 2s): "${finalCheck.finalText}"`);
    console.log(`Still Russian: ${finalCheck.stillRussian ? '✅' : '❌'}`);

    await browser.close();

    return result.updateWorked && finalCheck.stillRussian;
}

forceTranslationUpdate().catch(console.error);