const { chromium } = require('playwright');

async function testResponsiveViews() {
    const browser = await chromium.launch({
        headless: false, // Show browser for debugging
        slowMo: 1000 // Slow down for observation
    });

    const context = await browser.newContext();
    const page = await context.newPage();

    // Track console messages and errors
    const consoleMessages = [];
    const networkErrors = [];

    page.on('console', msg => {
        consoleMessages.push(`${msg.type()}: ${msg.text()}`);
        console.log(`Console ${msg.type()}: ${msg.text()}`);
    });

    page.on('response', response => {
        if (response.status() >= 400) {
            networkErrors.push(`${response.status()}: ${response.url()}`);
            console.log(`Network Error ${response.status()}: ${response.url()}`);
        }
    });

    try {
        console.log('Testing http://localhost:3005/en/home.html');

        // Navigate to the page
        await page.goto('http://localhost:3005/en/home.html', {
            waitUntil: 'networkidle',
            timeout: 30000
        });

        // Wait for page to fully load
        await page.waitForTimeout(3000);

        console.log('\n=== DESKTOP VIEW TEST (1200px) ===');

        // Set desktop viewport
        await page.setViewportSize({ width: 1200, height: 800 });
        await page.waitForTimeout(2000);

        // Take desktop screenshot
        await page.screenshot({
            path: '/Users/michaelmishayev/Desktop/newCode/desktop-view.png',
            fullPage: true
        });

        // Check language selector visibility and position on desktop
        const desktopLangSelector = await page.locator('.language-selector, .language-dropdown, [class*="language"]').first();
        const desktopLangSelectorVisible = await desktopLangSelector.isVisible().catch(() => false);
        console.log(`Desktop language selector visible: ${desktopLangSelectorVisible}`);

        if (desktopLangSelectorVisible) {
            const boundingBox = await desktopLangSelector.boundingBox();
            console.log(`Desktop language selector position: ${JSON.stringify(boundingBox)}`);
        }

        // Check for language dropdown
        const languageDropdown = await page.locator('.dropdown-list, .language-dropdown-menu, [class*="dropdown"]').first();
        const dropdownExists = await languageDropdown.count() > 0;
        console.log(`Language dropdown exists: ${dropdownExists}`);

        // Try to click language selector to test dropdown
        if (desktopLangSelectorVisible) {
            try {
                await desktopLangSelector.click();
                await page.waitForTimeout(1000);
                const dropdownVisible = await languageDropdown.isVisible().catch(() => false);
                console.log(`Language dropdown opens on click: ${dropdownVisible}`);

                // Take screenshot with dropdown open
                await page.screenshot({
                    path: '/Users/michaelmishayev/Desktop/newCode/desktop-dropdown.png'
                });
            } catch (error) {
                console.log(`Error testing language dropdown: ${error.message}`);
            }
        }

        console.log('\n=== MOBILE VIEW TEST (375px) ===');

        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });
        await page.waitForTimeout(2000);

        // Take mobile screenshot
        await page.screenshot({
            path: '/Users/michaelmishayev/Desktop/newCode/mobile-view.png',
            fullPage: true
        });

        // Check if language selector is hidden on mobile
        const mobileLangSelectorVisible = await desktopLangSelector.isVisible().catch(() => false);
        console.log(`Mobile language selector visible: ${mobileLangSelectorVisible}`);

        // Check for hamburger menu
        const hamburgerMenu = await page.locator('.hamburger, .menu-toggle, .mobile-menu-toggle, [class*="hamburger"], [class*="menu-button"]');
        const hamburgerExists = await hamburgerMenu.count() > 0;
        console.log(`Hamburger menu exists: ${hamburgerExists}`);

        if (hamburgerExists && await hamburgerMenu.first().isVisible()) {
            try {
                console.log('Opening hamburger menu...');
                await hamburgerMenu.first().click();
                await page.waitForTimeout(2000);

                // Take screenshot with mobile menu open
                await page.screenshot({
                    path: '/Users/michaelmishayev/Desktop/newCode/mobile-menu-open.png',
                    fullPage: true
                });

                // Check for language selector in mobile menu
                const mobileLangInMenu = await page.locator('.mobile-menu .language-selector, .menu-overlay .language-selector, [class*="mobile"] [class*="language"]').first();
                const mobileLangInMenuVisible = await mobileLangInMenu.isVisible().catch(() => false);
                console.log(`Language selector in mobile menu: ${mobileLangInMenuVisible}`);

            } catch (error) {
                console.log(`Error testing mobile menu: ${error.message}`);
            }
        }

        console.log('\n=== CONSOLE ERRORS SUMMARY ===');
        console.log('Console Messages:');
        consoleMessages.forEach(msg => console.log(`  ${msg}`));

        console.log('\nNetwork Errors:');
        networkErrors.forEach(err => console.log(`  ${err}`));

        console.log('\n=== TEST COMPLETE ===');
        console.log('Screenshots saved:');
        console.log('- desktop-view.png');
        console.log('- desktop-dropdown.png');
        console.log('- mobile-view.png');
        console.log('- mobile-menu-open.png');

    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        await browser.close();
    }
}

testResponsiveViews();