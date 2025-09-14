const { chromium } = require('playwright');

async function testInlineLanguageSwitcher() {
    console.log('🌐 QA TEST: Inline Language Switcher Positioning');
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

            // Check language switcher positioning and menu structure
            const navStructure = await page.evaluate(() => {
                const navMenu = document.querySelector('.nav-menu');
                const languageSwitcher = document.getElementById('language-switcher');
                const navLinks = document.querySelectorAll('.nav-link');
                const dropdown = document.querySelector('.menu-dropdown-wrapper');
                const mobileButton = document.querySelector('.primary-button-wrapper.mobile');

                if (!navMenu || !languageSwitcher) {
                    return {
                        error: 'Missing navigation menu or language switcher',
                        hasNavMenu: !!navMenu,
                        hasLanguageSwitcher: !!languageSwitcher
                    };
                }

                // Get positioning info
                const navMenuRect = navMenu.getBoundingClientRect();
                const switcherRect = languageSwitcher.getBoundingClientRect();

                // Check if switcher is inside nav-menu
                const switcherInNavMenu = navMenu.contains(languageSwitcher);

                // Get all nav menu children in order
                const navChildren = Array.from(navMenu.children);
                const switcherIndex = navChildren.indexOf(languageSwitcher);
                const mobileButtonIndex = mobileButton ? navChildren.indexOf(mobileButton) : -1;

                // Check navigation items order
                const navItemsOrder = navChildren.map((child, index) => {
                    let type = 'unknown';
                    if (child.classList.contains('nav-link')) type = 'nav-link';
                    else if (child.classList.contains('menu-dropdown-wrapper')) type = 'dropdown';
                    else if (child.classList.contains('primary-button-wrapper')) type = 'mobile-button';
                    else if (child.id === 'language-switcher') type = 'language-switcher';

                    return {
                        index: index,
                        type: type,
                        text: child.textContent.trim().substring(0, 20),
                        className: child.className
                    };
                });

                return {
                    hasNavMenu: true,
                    hasLanguageSwitcher: true,
                    switcherInNavMenu: switcherInNavMenu,
                    switcherIndex: switcherIndex,
                    mobileButtonIndex: mobileButtonIndex,
                    switcherBeforeMobileButton: switcherIndex < mobileButtonIndex && mobileButtonIndex !== -1,
                    navItemsCount: navChildren.length,
                    navLinksCount: navLinks.length,
                    dropdownCount: dropdown ? 1 : 0,
                    navItemsOrder: navItemsOrder,
                    positioning: {
                        navMenu: { x: navMenuRect.x, y: navMenuRect.y, width: navMenuRect.width, height: navMenuRect.height },
                        switcher: { x: switcherRect.x, y: switcherRect.y, width: switcherRect.width, height: switcherRect.height },
                        switcherRelativeToNav: {
                            isInline: switcherRect.y >= navMenuRect.y && switcherRect.y <= navMenuRect.y + navMenuRect.height,
                            alignedHorizontally: Math.abs(switcherRect.y - navMenuRect.y) < 20
                        }
                    }
                };
            });

            // Test language switcher functionality
            const functionalityTest = await page.evaluate(() => {
                const select = document.getElementById('languageSelect');
                if (!select) return { hasFunctionality: false };

                const options = Array.from(select.options).map(opt => ({
                    value: opt.value,
                    text: opt.text,
                    selected: opt.selected
                }));

                return {
                    hasFunctionality: true,
                    switchFunctionExists: typeof window.switchLanguage === 'function',
                    selectedValue: select.value,
                    optionsCount: options.length,
                    options: options
                };
            });

            results[lang.code] = {
                name: lang.name,
                navStructure: navStructure,
                functionality: functionalityTest,
                jsErrors: jsErrors,
                jsErrorCount: jsErrors.length
            };

            console.log(`   🔍 Language Switcher in Nav Menu: ${navStructure.switcherInNavMenu ? '✅ YES' : '❌ NO'}`);
            console.log(`   📍 Switcher Position: Index ${navStructure.switcherIndex} of ${navStructure.navItemsCount} items`);
            console.log(`   📱 Before Mobile Button: ${navStructure.switcherBeforeMobileButton ? '✅ YES' : '❌ NO'}`);
            console.log(`   📊 Navigation Items: ${navStructure.navLinksCount} links, ${navStructure.dropdownCount} dropdowns`);

            if (navStructure.positioning) {
                console.log(`   🎯 Inline Positioning: ${navStructure.positioning.switcherRelativeToNav.isInline ? '✅ INLINE' : '❌ NOT INLINE'}`);
                console.log(`   📐 Horizontally Aligned: ${navStructure.positioning.switcherRelativeToNav.alignedHorizontally ? '✅ YES' : '❌ NO'}`);
            }

            console.log(`   🔄 Switch Function: ${functionalityTest.switchFunctionExists ? '✅ EXISTS' : '❌ MISSING'}`);
            console.log(`   🚨 JS Errors: ${jsErrors.length}`);

            if (navStructure.navItemsOrder) {
                console.log(`   📋 Navigation Order:`);
                navStructure.navItemsOrder.forEach(item => {
                    const icon = item.type === 'language-switcher' ? '🌐' :
                                 item.type === 'nav-link' ? '🔗' :
                                 item.type === 'dropdown' ? '📋' :
                                 item.type === 'mobile-button' ? '📱' : '❓';
                    console.log(`      ${item.index + 1}. ${icon} ${item.type} - "${item.text}"`);
                });
            }

            // Take screenshot
            const screenshotPath = `/Users/michaelmishayev/Desktop/newCode/${lang.code}-inline-switcher-test.png`;
            await page.screenshot({ path: screenshotPath, fullPage: false });
            console.log(`   📸 Screenshot: ${screenshotPath}`);

        } catch (error) {
            console.error(`   ❌ Test failed for ${lang.name}: ${error.message}`);
            results[lang.code] = {
                name: lang.name,
                error: error.message,
                navStructure: { error: error.message },
                functionality: { hasFunctionality: false },
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
        const navStructure = result.navStructure;
        const functionality = result.functionality;

        const isInline = navStructure.switcherInNavMenu &&
                        navStructure.positioning &&
                        navStructure.positioning.switcherRelativeToNav.isInline;
        const hasFunction = functionality.switchFunctionExists;
        const noJsErrors = result.jsErrorCount === 0;
        const correctOrder = navStructure.switcherBeforeMobileButton || navStructure.mobileButtonIndex === -1;

        const status = isInline && hasFunction && noJsErrors && correctOrder;
        const statusIcon = status ? '✅ PASS' : '❌ FAIL';
        allPassed = allPassed && status;

        console.log(`${result.name} (${code}): ${statusIcon}`);
        console.log(`  └ Switcher Inline: ${isInline ? '✅' : '❌'}`);
        console.log(`  └ Correct Order: ${correctOrder ? '✅' : '❌'}`);
        console.log(`  └ Switch Function: ${hasFunction ? '✅' : '❌'}`);
        console.log(`  └ No JS Errors: ${noJsErrors ? '✅' : '❌ (' + result.jsErrorCount + ')'}`);

        if (navStructure.switcherIndex !== undefined) {
            console.log(`  └ Position: ${navStructure.switcherIndex + 1}/${navStructure.navItemsCount}`);
        }
        console.log('');
    }

    console.log('================================================================');
    console.log(`🎯 OVERALL RESULT: ${allPassed ? '✅ ALL LANGUAGES PASS' : '❌ SOME LANGUAGES FAILED'}`);
    console.log('================================================================');

    return results;
}

testInlineLanguageSwitcher().catch(console.error);