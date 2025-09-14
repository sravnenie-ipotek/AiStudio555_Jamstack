const { chromium } = require('playwright');

async function testUniversalMenu() {
    console.log('🧪 Testing Universal Menu Across All Pages');
    console.log('==========================================\n');

    const browser = await chromium.launch({ headless: false, slowMo: 500 });

    // Test pages for each language
    const testPages = [
        { lang: 'en', pages: ['home', 'courses', 'teachers', 'career-center', 'pricing'] },
        { lang: 'ru', pages: ['home', 'courses', 'teachers', 'career-center', 'pricing'] },
        { lang: 'he', pages: ['home', 'courses', 'teachers', 'career-center', 'pricing'] }
    ];

    const results = {};

    for (const { lang, pages } of testPages) {
        console.log(`\n📍 Testing ${lang.toUpperCase()} pages:`);
        console.log('--------------------------------');
        results[lang] = {};

        for (const pageName of pages) {
            const url = `http://localhost:3005/${lang}/${pageName}.html`;
            const page = await browser.newPage();
            await page.setViewportSize({ width: 1920, height: 1080 });

            try {
                await page.goto(url, {
                    waitUntil: 'networkidle',
                    timeout: 30000
                });

                await page.waitForTimeout(2000);

                // Test menu visibility
                const menuVisible = await page.evaluate(() => {
                    const menu = document.querySelector('.nav-menu.w-nav-menu');
                    if (!menu) return false;
                    const style = window.getComputedStyle(menu);
                    return style.display !== 'none' && style.visibility !== 'hidden';
                });

                // Test language switcher presence
                const hasSwitcher = await page.evaluate(() => {
                    return !!document.getElementById('language-switcher');
                });

                // Test language select functionality
                const selectDetails = await page.evaluate(() => {
                    const select = document.getElementById('languageSelect');
                    if (!select) return null;
                    return {
                        value: select.value,
                        optionsCount: select.options.length,
                        hasFunction: typeof window.switchLanguage === 'function'
                    };
                });

                // Count navigation links
                const navLinksCount = await page.evaluate(() => {
                    return document.querySelectorAll('.nav-menu .nav-link').length;
                });

                results[lang][pageName] = {
                    menuVisible,
                    hasSwitcher,
                    selectDetails,
                    navLinksCount,
                    success: menuVisible && hasSwitcher && selectDetails?.hasFunction
                };

                const status = results[lang][pageName].success ? '✅' : '❌';
                console.log(`  ${pageName.padEnd(20)} ${status} Menu: ${menuVisible ? '✓' : '✗'} | Switcher: ${hasSwitcher ? '✓' : '✗'} | Lang: ${selectDetails?.value || 'N/A'}`);

                // Take screenshot for verification
                await page.screenshot({
                    path: `/Users/michaelmishayev/Desktop/newCode/${lang}-${pageName}-menu-test.png`,
                    clip: { x: 0, y: 0, width: 1920, height: 100 }
                });

            } catch (error) {
                console.log(`  ${pageName.padEnd(20)} ❌ Error: ${error.message}`);
                results[lang][pageName] = {
                    error: error.message,
                    success: false
                };
            }

            await page.close();
        }
    }

    await browser.close();

    // Summary
    console.log('\n==========================================');
    console.log('📊 SUMMARY');
    console.log('==========================================');

    let allSuccess = true;
    for (const [lang, pages] of Object.entries(results)) {
        const successCount = Object.values(pages).filter(p => p.success).length;
        const totalCount = Object.keys(pages).length;
        const langSuccess = successCount === totalCount;
        allSuccess = allSuccess && langSuccess;

        console.log(`${lang.toUpperCase()}: ${langSuccess ? '✅' : '❌'} ${successCount}/${totalCount} pages working`);
    }

    console.log('\n==========================================');
    console.log(`OVERALL: ${allSuccess ? '✅ ALL PAGES HAVE CONSISTENT MENU' : '❌ SOME PAGES HAVE ISSUES'}`);
    console.log('==========================================');

    return results;
}

testUniversalMenu().catch(console.error);