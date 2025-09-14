const { chromium } = require('playwright');

async function testLanguageSwitcher() {
    console.log('🌐 QA TEST: Language Switcher Functionality');
    console.log('Testing URLs: Hebrew, English, Russian home pages');
    console.log('Viewport: 1920x1080 (Desktop)');
    console.log('================================================================');

    const browser = await chromium.launch({ headless: false, slowMo: 1500 });

    const languages = [
        { code: 'he', url: 'http://localhost:3005/he/home.html', name: 'Hebrew' },
        { code: 'en', url: 'http://localhost:3005/en/home.html', name: 'English' },
        { code: 'ru', url: 'http://localhost:3005/ru/home.html', name: 'Russian' }
    ];

    const results = {};

    for (const lang of languages) {
        console.log(`\n📍 Testing ${lang.name} (${lang.code})...`);
        console.log(`   URL: ${lang.url}`);

        const page = await browser.newPage();
        await page.setViewportSize({ width: 1920, height: 1080 });

        const jsErrors = [];
        page.on('pageerror', error => jsErrors.push(error.toString()));

        try {
            await page.goto(lang.url, {
                waitUntil: 'networkidle',
                timeout: 30000
            });

            await page.waitForTimeout(3000);

            // Check if language switcher exists
            const languageSwitcher = await page.evaluate(() => {
                const switcher = document.getElementById('language-switcher');
                const select = document.getElementById('languageSelect');

                if (!switcher || !select) {
                    return { exists: false, selectedValue: null, optionCount: 0 };
                }

                const selectedValue = select.value;
                const options = Array.from(select.options).map(opt => ({
                    value: opt.value,
                    text: opt.text,
                    selected: opt.selected
                }));

                const rect = switcher.getBoundingClientRect();
                const isVisible = rect.width > 0 && rect.height > 0;

                return {
                    exists: true,
                    isVisible: isVisible,
                    selectedValue: selectedValue,
                    optionCount: options.length,
                    options: options,
                    position: {
                        top: rect.top,
                        right: rect.right,
                        bottom: rect.bottom,
                        left: rect.left
                    }
                };
            });

            // Test switching to a different language (but don't actually navigate)
            let switchTest = null;
            if (languageSwitcher.exists) {
                // Find a different language to test switch to
                const targetLang = lang.code === 'en' ? 'ru' : 'en';

                switchTest = await page.evaluate((targetCode) => {
                    const select = document.getElementById('languageSelect');
                    if (!select) return { canSwitch: false, error: 'Select not found' };

                    // Check if the target language exists in options
                    const targetOption = Array.from(select.options).find(opt => opt.value === targetCode);
                    if (!targetOption) return { canSwitch: false, error: 'Target language not available' };

                    // Test if switchLanguage function exists
                    const switchFunctionExists = typeof window.switchLanguage === 'function';

                    return {
                        canSwitch: true,
                        switchFunctionExists: switchFunctionExists,
                        targetLanguageAvailable: !!targetOption,
                        targetLanguageText: targetOption ? targetOption.text : null
                    };
                }, targetLang);
            }

            results[lang.code] = {
                name: lang.name,
                languageSwitcher: languageSwitcher,
                switchTest: switchTest,
                jsErrors: jsErrors,
                jsErrorCount: jsErrors.length
            };

            console.log(`   🔍 Language Switcher: ${languageSwitcher.exists ? '✅ EXISTS' : '❌ MISSING'}`);
            if (languageSwitcher.exists) {
                console.log(`   👁️  Switcher Visible: ${languageSwitcher.isVisible ? '✅ VISIBLE' : '❌ HIDDEN'}`);
                console.log(`   📋 Selected Language: ${languageSwitcher.selectedValue}`);
                console.log(`   🔢 Language Options: ${languageSwitcher.optionCount}`);
                console.log(`   📊 Options: ${languageSwitcher.options.map(opt => `${opt.value}:${opt.text}${opt.selected ? ' (selected)' : ''}`).join(', ')}`);

                if (switchTest) {
                    console.log(`   🔄 Switch Function: ${switchTest.switchFunctionExists ? '✅ EXISTS' : '❌ MISSING'}`);
                    console.log(`   🎯 Can Switch: ${switchTest.canSwitch ? '✅ YES' : '❌ NO'}`);
                }
            }
            console.log(`   🚨 JS Errors: ${jsErrors.length}`);

            if (jsErrors.length > 0) {
                console.log(`   ⚠️  JS Error Details:`);
                jsErrors.forEach((error, i) => {
                    console.log(`      ${i+1}. ${error.substring(0, 100)}...`);
                });
            }

            // Take screenshot
            const screenshotPath = `/Users/michaelmishayev/Desktop/newCode/${lang.code}-language-switcher-test.png`;
            await page.screenshot({ path: screenshotPath, fullPage: false });
            console.log(`   📸 Screenshot: ${screenshotPath}`);

        } catch (error) {
            console.error(`   ❌ Test failed for ${lang.name}: ${error.message}`);
            results[lang.code] = {
                name: lang.name,
                error: error.message,
                languageSwitcher: { exists: false },
                switchTest: null,
                jsErrors: [],
                jsErrorCount: 999
            };
        }

        await page.close();
    }

    await browser.close();

    console.log('\n================================================================');
    console.log('📋 FINAL RESULTS SUMMARY:');
    console.log('================================================================');

    let allPassed = true;
    for (const [code, result] of Object.entries(results)) {
        const hasLanguageSwitcher = result.languageSwitcher && result.languageSwitcher.exists && result.languageSwitcher.isVisible;
        const hasSwitchFunction = result.switchTest && result.switchTest.switchFunctionExists;
        const noJsErrors = result.jsErrorCount === 0;

        const status = hasLanguageSwitcher && hasSwitchFunction && noJsErrors;
        const statusIcon = status ? '✅ PASS' : '❌ FAIL';
        allPassed = allPassed && status;

        console.log(`${result.name} (${code}): ${statusIcon}`);
        console.log(`  └ Language Switcher Exists: ${hasLanguageSwitcher ? '✅' : '❌'}`);
        console.log(`  └ Switch Function Exists: ${hasSwitchFunction ? '✅' : '❌'}`);
        console.log(`  └ No JS Errors: ${noJsErrors ? '✅' : '❌ (' + result.jsErrorCount + ')'}`);

        if (result.languageSwitcher && result.languageSwitcher.exists) {
            console.log(`  └ Selected Language: ${result.languageSwitcher.selectedValue}`);
            console.log(`  └ Available Options: ${result.languageSwitcher.optionCount}`);
        }
        console.log('');
    }

    console.log('================================================================');
    console.log(`🎯 OVERALL RESULT: ${allPassed ? '✅ ALL LANGUAGES PASS' : '❌ SOME LANGUAGES FAILED'}`);
    console.log('================================================================');

    return results;
}

testLanguageSwitcher().catch(console.error);