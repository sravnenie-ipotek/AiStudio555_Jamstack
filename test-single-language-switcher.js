const { chromium } = require('playwright');

async function testSingleLanguageSwitcher() {
    console.log('🧹 CLEAN TEST: Single Language Switcher');
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

            // Count unique language switcher elements
            const switcherCount = await page.evaluate(() => {
                // Count unique elements by different approaches
                const byId = document.getElementById('language-switcher');
                const bySelect = document.getElementById('languageSelect');
                const byClass = document.querySelectorAll('.mobile-language-selector');
                const byMobileId = document.getElementById('mobile-language-select');

                return {
                    mainSwitcher: !!byId,
                    mainSelect: !!bySelect,
                    mobileSelectors: byClass.length,
                    mobileSelect: !!byMobileId,
                    totalUniqueSwitchers: (byId ? 1 : 0) + (byMobileId ? 1 : 0) // Only count truly different switchers
                };
            });

            // Test functionality
            const functionalityTest = await page.evaluate(() => {
                const select = document.getElementById('languageSelect');
                if (!select) return { working: false, error: 'No languageSelect found' };

                const options = Array.from(select.options).map(opt => ({
                    value: opt.value,
                    text: opt.text,
                    selected: opt.selected
                }));

                return {
                    working: true,
                    switchFunction: typeof window.switchLanguage === 'function',
                    selectedValue: select.value,
                    optionsCount: options.length,
                    options: options
                };
            });

            results[lang.code] = {
                name: lang.name,
                switcherCount: switcherCount,
                functionality: functionalityTest,
                jsErrors: jsErrors,
                jsErrorCount: jsErrors.length
            };

            console.log(`   🔢 Total Language Switchers: ${switcherCount.totalUniqueSwitchers}`);
            console.log(`   🎯 Main Switcher (#language-switcher): ${switcherCount.mainSwitcher ? '✅ EXISTS' : '❌ MISSING'}`);
            console.log(`   🎯 Main Select (#languageSelect): ${switcherCount.mainSelect ? '✅ EXISTS' : '❌ MISSING'}`);
            console.log(`   📱 Mobile Selectors (.mobile-language-selector): ${switcherCount.mobileSelectors}`);
            console.log(`   📱 Mobile Select (#mobile-language-select): ${switcherCount.mobileSelect ? '❌ UNWANTED' : '✅ CLEAN'}`);
            console.log(`   🔄 Switch Function: ${functionalityTest.switchFunction ? '✅ EXISTS' : '❌ MISSING'}`);
            console.log(`   📋 Selected Language: ${functionalityTest.selectedValue || 'none'}`);
            console.log(`   🌐 Available Options: ${functionalityTest.optionsCount || 0}`);
            console.log(`   🚨 JS Errors: ${jsErrors.length}`);

            // Take screenshot
            const screenshotPath = `/Users/michaelmishayev/Desktop/newCode/${lang.code}-clean-switcher-test.png`;
            await page.screenshot({ path: screenshotPath, fullPage: false });
            console.log(`   📸 Screenshot: ${screenshotPath}`);

        } catch (error) {
            console.error(`   ❌ Test failed for ${lang.name}: ${error.message}`);
            results[lang.code] = {
                name: lang.name,
                error: error.message,
                switcherCount: { totalUniqueSwitchers: 0 },
                functionality: { working: false },
                jsErrors: [],
                jsErrorCount: 999
            };
        }

        await page.close();
    }

    await browser.close();

    console.log('\n================================================================');
    console.log('📋 FINAL CLEAN TEST RESULTS:');
    console.log('================================================================');

    let allPassed = true;
    for (const [code, result] of Object.entries(results)) {
        const hasOneSwitcher = result.switcherCount.totalUniqueSwitchers === 1;
        const switcherWorks = result.functionality.working && result.functionality.switchFunction;
        const noJsErrors = result.jsErrorCount === 0;
        const noMobileConflicts = !result.switcherCount.mobileSelect && result.switcherCount.mobileSelectors === 0;

        const status = hasOneSwitcher && switcherWorks && noJsErrors && noMobileConflicts;
        const statusIcon = status ? '✅ PASS' : '❌ FAIL';
        allPassed = allPassed && status;

        console.log(`${result.name} (${code}): ${statusIcon}`);
        console.log(`  └ Single Switcher Only: ${hasOneSwitcher ? '✅' : '❌'} (${result.switcherCount.totalUniqueSwitchers})`);
        console.log(`  └ No Mobile Conflicts: ${noMobileConflicts ? '✅' : '❌'}`);
        console.log(`  └ Functionality Works: ${switcherWorks ? '✅' : '❌'}`);
        console.log(`  └ No JS Errors: ${noJsErrors ? '✅' : '❌ (' + result.jsErrorCount + ')'}`);

        if (result.functionality.working) {
            console.log(`  └ Selected Language: ${result.functionality.selectedValue}`);
            console.log(`  └ Available Options: ${result.functionality.optionsCount}`);
        }
        console.log('');
    }

    console.log('================================================================');
    console.log(`🎯 OVERALL RESULT: ${allPassed ? '✅ ALL LANGUAGES CLEAN & WORKING' : '❌ SOME LANGUAGES HAVE ISSUES'}`);
    console.log('================================================================');

    return results;
}

testSingleLanguageSwitcher().catch(console.error);