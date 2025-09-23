const puppeteer = require('puppeteer');

async function debugTranslations() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    console.log('🔍 Translation Method Debug\n');

    await page.goto('http://localhost:3005/home.html?locale=ru', { waitUntil: 'networkidle2' });

    // Wait for language manager to load
    await page.waitForTimeout(3000);

    const debugResult = await page.evaluate(() => {
        // Check if language manager is available
        if (!window.languageManager) {
            return { error: 'Language manager not found' };
        }

        const lm = window.languageManager;

        // Test the exact same translation key that's failing
        const testKey = 'testimonials.content.content.title';

        // Get the API data that was cached
        const cachedData = lm.contentCache['ru'];

        if (!cachedData) {
            return { error: 'No cached data for ru locale' };
        }

        // Test the getTranslation method directly
        const translation = lm.getTranslation(cachedData.data, testKey, 'ru');

        // Also test the getComprehensiveMappings method
        const mappings = lm.getComprehensiveMappings(testKey);

        // Test each mapping path manually
        const mappingResults = mappings.map(path => {
            const value = lm.getExactPath(cachedData.data, path);
            return { path, value };
        });

        // Get the element that should be updated
        const element = document.querySelector('[data-i18n="testimonials.content.content.title"]');

        return {
            testKey,
            translation,
            elementExists: !!element,
            elementText: element?.textContent,
            dataStructure: Object.keys(cachedData.data || {}),
            mappings,
            mappingResults: mappingResults.slice(0, 5), // First 5 only
            localizedText: lm.getLocalizedText(testKey, 'ru')
        };
    });

    console.log('🔍 Translation Debug Results:');
    console.log('');
    console.log(`Test Key: ${debugResult.testKey}`);
    console.log(`Translation Result: "${debugResult.translation}"`);
    console.log(`Element Exists: ${debugResult.elementExists}`);
    console.log(`Element Text: "${debugResult.elementText}"`);
    console.log(`Localized Text Fallback: "${debugResult.localizedText}"`);
    console.log('');
    console.log('API Data Structure:', debugResult.dataStructure);
    console.log('');
    console.log('Mapping Attempts:');
    debugResult.mappingResults?.forEach(result => {
        console.log(`  "${result.path}" → "${result.value}"`);
    });

    if (debugResult.error) {
        console.log('❌ Error:', debugResult.error);
    }

    await browser.close();
}

debugTranslations().catch(console.error);