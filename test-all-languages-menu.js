const { chromium } = require('playwright');

async function testAllLanguagesMenu() {
    console.log('🔵 QA TEST: Desktop Navigation Menu - ALL LANGUAGES');
    console.log('Testing URLs: Hebrew, English, Russian');
    console.log('Viewport: 1920x1080 (Desktop)');
    console.log('================================================================');

    const browser = await chromium.launch({ headless: false, slowMo: 1000 });

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
        const networkErrors = [];

        page.on('pageerror', error => jsErrors.push(error.toString()));
        page.on('response', response => {
            if (!response.ok() && response.url().includes('.css')) {
                networkErrors.push({
                    url: response.url(),
                    status: response.status()
                });
            }
        });

        try {
            await page.goto(lang.url, {
                waitUntil: 'networkidle',
                timeout: 30000
            });

            await page.waitForTimeout(3000);

            // Check navigation visibility
            const navCheck = await page.evaluate(() => {
                const navbar = document.querySelector('.navbar');
                const navMenu = document.querySelector('.nav-menu') || document.querySelector('.w-nav-menu');
                const navLinks = document.querySelectorAll('.nav-link');
                const hamburger = document.querySelector('.w-nav-button');

                let navMenuInfo = null;
                if (navMenu) {
                    const computed = window.getComputedStyle(navMenu);
                    const rect = navMenu.getBoundingClientRect();
                    navMenuInfo = {
                        display: computed.display,
                        visibility: computed.visibility,
                        opacity: computed.opacity,
                        width: rect.width,
                        height: rect.height,
                        isVisible: rect.width > 0 && rect.height > 0 && computed.visibility !== 'hidden' && computed.display !== 'none'
                    };
                }

                return {
                    hasNavbar: !!navbar,
                    hasNavMenu: !!navMenu,
                    linkCount: navLinks.length,
                    hasHamburger: !!hamburger,
                    hamburgerVisible: hamburger ? hamburger.offsetWidth > 0 && hamburger.offsetHeight > 0 : false,
                    navMenuInfo: navMenuInfo,
                    viewportWidth: window.innerWidth
                };
            });

            // Take screenshot
            const screenshotPath = `/Users/michaelmishayev/Desktop/newCode/${lang.code}-desktop-test.png`;
            await page.screenshot({ path: screenshotPath, fullPage: false });

            // Persistence test
            await page.waitForTimeout(2000);

            const persistenceCheck = await page.evaluate(() => {
                const navMenu = document.querySelector('.nav-menu') || document.querySelector('.w-nav-menu');
                if (!navMenu) return { stillExists: false };

                const computed = window.getComputedStyle(navMenu);
                const rect = navMenu.getBoundingClientRect();

                return {
                    stillExists: true,
                    stillVisible: rect.width > 0 && rect.height > 0 && computed.display !== 'none' && computed.visibility !== 'hidden'
                };
            });

            results[lang.code] = {
                name: lang.name,
                hasNavMenu: navCheck.navMenuInfo && navCheck.navMenuInfo.isVisible,
                menuPersistent: persistenceCheck.stillVisible,
                linkCount: navCheck.linkCount,
                hamburgerHidden: !navCheck.hamburgerVisible,
                jsErrorCount: jsErrors.length,
                cssErrorCount: networkErrors.length,
                screenshot: screenshotPath,
                jsErrors: jsErrors,
                cssErrors: networkErrors
            };

            console.log(`   🔍 Navigation Menu: ${navCheck.navMenuInfo && navCheck.navMenuInfo.isVisible ? '✅ VISIBLE' : '❌ HIDDEN'}`);
            console.log(`   🔄 Menu Persistence: ${persistenceCheck.stillVisible ? '✅ PASS' : '❌ FAIL'}`);
            console.log(`   🔗 Navigation Links: ${navCheck.linkCount}`);
            console.log(`   📱 Mobile Button Hidden: ${!navCheck.hamburgerVisible ? '✅ PASS' : '❌ FAIL'}`);
            console.log(`   🚨 JS Errors: ${jsErrors.length}`);
            console.log(`   📋 CSS Errors: ${networkErrors.length}`);
            console.log(`   📸 Screenshot: ${screenshotPath}`);

            if (jsErrors.length > 0) {
                console.log(`   ⚠️  JS Error Details:`);
                jsErrors.forEach((error, i) => {
                    console.log(`      ${i+1}. ${error.substring(0, 100)}...`);
                });
            }

            if (networkErrors.length > 0) {
                console.log(`   ⚠️  CSS Error Details:`);
                networkErrors.forEach((error, i) => {
                    console.log(`      ${i+1}. ${error.status} - ${error.url}`);
                });
            }

        } catch (error) {
            console.error(`   ❌ Test failed for ${lang.name}: ${error.message}`);
            results[lang.code] = {
                name: lang.name,
                error: error.message,
                hasNavMenu: false,
                menuPersistent: false,
                linkCount: 0,
                hamburgerHidden: false,
                jsErrorCount: 999,
                cssErrorCount: 999
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
        const status = result.hasNavMenu && result.menuPersistent && result.linkCount > 0 && result.hamburgerHidden && result.jsErrorCount === 0;
        const statusIcon = status ? '✅ PASS' : '❌ FAIL';
        allPassed = allPassed && status;

        console.log(`${result.name} (${code}): ${statusIcon}`);
        console.log(`  └ Menu Visible: ${result.hasNavMenu ? '✅' : '❌'}`);
        console.log(`  └ Menu Persistent: ${result.menuPersistent ? '✅' : '❌'}`);
        console.log(`  └ Links Count: ${result.linkCount} ${result.linkCount > 0 ? '✅' : '❌'}`);
        console.log(`  └ Mobile Hidden: ${result.hamburgerHidden ? '✅' : '❌'}`);
        console.log(`  └ No JS Errors: ${result.jsErrorCount === 0 ? '✅' : '❌ (' + result.jsErrorCount + ')'}`);
        console.log(`  └ No CSS Errors: ${result.cssErrorCount === 0 ? '✅' : '❌ (' + result.cssErrorCount + ')'}`);
        if (result.screenshot) {
            console.log(`  └ Screenshot: ${result.screenshot}`);
        }
        console.log('');
    }

    console.log('================================================================');
    console.log(`🎯 OVERALL RESULT: ${allPassed ? '✅ ALL LANGUAGES PASS' : '❌ SOME LANGUAGES FAILED'}`);
    console.log('================================================================');

    return results;
}

testAllLanguagesMenu().catch(console.error);