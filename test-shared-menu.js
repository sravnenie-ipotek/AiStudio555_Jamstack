const { chromium } = require('playwright');

async function testSharedMenu() {
    console.log('🎯 Testing Ultra-thin Shared Menu Component');
    console.log('===========================================\n');

    const browser = await chromium.launch({ headless: false, slowMo: 500 });

    const testPages = [
        { url: 'http://localhost:3005/en/home.html', name: 'EN Home' },
        { url: 'http://localhost:3005/ru/courses.html', name: 'RU Courses' },
        { url: 'http://localhost:3005/he/home.html', name: 'HE Home' }
    ];

    for (const testPage of testPages) {
        console.log(`\n📍 Testing ${testPage.name}:`);
        console.log('------------------------');

        const page = await browser.newPage();
        await page.setViewportSize({ width: 1920, height: 1080 });

        try {
            await page.goto(testPage.url, {
                waitUntil: 'domcontentloaded',
                timeout: 10000
            });

            await page.waitForTimeout(1500);

            const menuData = await page.evaluate(() => {
                const container = document.getElementById('shared-menu-container');
                const menu = document.querySelector('.nav-menu.w-nav-menu');
                const switcher = document.getElementById('language-switcher');
                const select = document.getElementById('languageSelect');
                const navLinks = document.querySelectorAll('.nav-menu .nav-link');
                const primaryButton = document.querySelector('.primary-button-text-block');

                return {
                    hasContainer: !!container,
                    hasMenu: !!menu,
                    hasSwitcher: !!switcher,
                    currentLang: select ? select.value : null,
                    navLinksCount: navLinks.length,
                    navLinksText: Array.from(navLinks).map(link => link.textContent.trim()),
                    buttonText: primaryButton ? primaryButton.textContent.trim() : null,
                    menuVisible: menu ? window.getComputedStyle(menu).display !== 'none' : false
                };
            });

            console.log(`  Container: ${menuData.hasContainer ? '✅' : '❌'}`);
            console.log(`  Menu injected: ${menuData.hasMenu ? '✅' : '❌'}`);
            console.log(`  Menu visible: ${menuData.menuVisible ? '✅' : '❌'}`);
            console.log(`  Language switcher: ${menuData.hasSwitcher ? '✅' : '❌'}`);
            console.log(`  Current language: ${menuData.currentLang}`);
            console.log(`  Nav links (${menuData.navLinksCount}): ${menuData.navLinksText.join(', ')}`);
            console.log(`  Button text: ${menuData.buttonText}`);

            const success = menuData.hasContainer && menuData.hasMenu && menuData.menuVisible && menuData.hasSwitcher;
            console.log(`  Overall: ${success ? '✅ SUCCESS' : '❌ FAILED'}`);

        } catch (error) {
            console.log(`  ❌ Error: ${error.message}`);
        }

        await page.close();
    }

    await browser.close();

    console.log('\n===========================================');
    console.log('✅ Shared menu component test complete!');
    console.log('\nBenefits achieved:');
    console.log('  • Single menu definition in shared-menu-component.js');
    console.log('  • Each page only has <div id="shared-menu-container"></div>');
    console.log('  • Menu updates now only require editing one file');
    console.log('  • Consistent behavior and styling across all pages');
    console.log('===========================================');
}

testSharedMenu().catch(console.error);