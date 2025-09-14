const { chromium } = require('playwright');

async function debugLanguageSelector() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Collect all console messages
    const logs = [];
    page.on('console', msg => {
        logs.push(`${msg.type()}: ${msg.text()}`);
        console.log(`${msg.type()}: ${msg.text()}`);
    });

    try {
        await page.goto('http://localhost:3005/en/home.html', { waitUntil: 'networkidle' });
        await page.waitForTimeout(3000);

        console.log('\n=== LANGUAGE SELECTOR DEBUG ===');

        // 1. Check if language switcher gets created by JavaScript
        const dynamicSwitcher = await page.$('#language-switcher');
        console.log(`Dynamic language switcher created: ${!!dynamicSwitcher}`);

        if (dynamicSwitcher) {
            const switcherVisible = await dynamicSwitcher.isVisible();
            const switcherBox = await dynamicSwitcher.boundingBox();
            console.log(`Dynamic switcher visible: ${switcherVisible}`);
            console.log(`Dynamic switcher position: ${JSON.stringify(switcherBox)}`);
        }

        // 2. Check for any language selector elements in navbar
        const navbarLangSelectors = await page.$$('.navbar .language-selector, .navbar [class*="language"], .nav-menu [class*="language"]');
        console.log(`Language selectors in navbar: ${navbarLangSelectors.length}`);

        // 3. Check all elements that might be language-related
        const allLangElements = await page.$$('[class*="language"], [id*="language"], [data-language]');
        console.log(`Total language-related elements: ${allLangElements.length}`);

        for (let i = 0; i < allLangElements.length; i++) {
            const element = allLangElements[i];
            const classList = await element.getAttribute('class');
            const id = await element.getAttribute('id');
            const visible = await element.isVisible();
            console.log(`  Element ${i + 1}: class="${classList}" id="${id}" visible=${visible}`);
        }

        // 4. Check if the JavaScript function switchLanguage exists
        const hasCreateLanguageSwitcher = await page.evaluate(() => {
            return typeof createLanguageSwitcher === 'function';
        });
        console.log(`createLanguageSwitcher function exists: ${hasCreateLanguageSwitcher}`);

        const hasSwitchLanguage = await page.evaluate(() => {
            return typeof switchLanguage === 'function';
        });
        console.log(`switchLanguage function exists: ${hasSwitchLanguage}`);

        // 5. Check if the JavaScript actually creates the switcher
        const switcherExists = await page.evaluate(() => {
            return document.getElementById('language-switcher') !== null;
        });
        console.log(`Language switcher element exists in DOM: ${switcherExists}`);

        // 6. Try to manually trigger the createLanguageSwitcher function
        if (hasCreateLanguageSwitcher) {
            console.log('Attempting to manually create language switcher...');
            await page.evaluate(() => {
                createLanguageSwitcher();
            });
            await page.waitForTimeout(1000);

            const switcherAfterCreate = await page.$('#language-switcher');
            console.log(`Switcher after manual creation: ${!!switcherAfterCreate}`);

            if (switcherAfterCreate) {
                const visibleAfterCreate = await switcherAfterCreate.isVisible();
                console.log(`Switcher visible after manual creation: ${visibleAfterCreate}`);
            }
        }

        // 7. Take screenshots
        console.log('\n=== TAKING SCREENSHOTS ===');

        // Desktop view
        await page.setViewportSize({ width: 1200, height: 800 });
        await page.waitForTimeout(1000);
        await page.screenshot({
            path: '/Users/michaelmishayev/Desktop/newCode/debug-desktop.png',
            fullPage: true
        });

        // Mobile view
        await page.setViewportSize({ width: 375, height: 667 });
        await page.waitForTimeout(1000);
        await page.screenshot({
            path: '/Users/michaelmishayev/Desktop/newCode/debug-mobile.png',
            fullPage: true
        });

        // Check mobile menu
        const hamburger = await page.$('.hamburger, .menu-toggle, .mobile-menu-toggle, [class*="hamburger"], [class*="menu-button"], .w-nav-button');
        if (hamburger) {
            console.log('Found hamburger menu, clicking...');
            await hamburger.click();
            await page.waitForTimeout(1000);
            await page.screenshot({
                path: '/Users/michaelmishayev/Desktop/newCode/debug-mobile-menu.png',
                fullPage: true
            });

            // Check for language selector in mobile menu
            const mobileLangSelector = await page.$('.w-nav-overlay [class*="language"], .mobile-menu [class*="language"]');
            console.log(`Language selector in mobile menu: ${!!mobileLangSelector}`);
        }

        console.log('\n=== NAVBAR STRUCTURE ===');
        const navbarContent = await page.$eval('.navbar-content, .navbar', el => el.outerHTML);
        console.log('First 500 chars of navbar HTML:');
        console.log(navbarContent.substring(0, 500));

    } catch (error) {
        console.error('Debug failed:', error);
    } finally {
        await browser.close();
    }
}

debugLanguageSelector();