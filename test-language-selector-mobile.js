const { chromium } = require('playwright');

async function testLanguageSelectorMobile() {
    console.log('🌐 Testing Language Selector on Mobile...\n');

    const browser = await chromium.launch({
        headless: false,
        slowMo: 1000
    });

    const context = await browser.newContext({
        viewport: { width: 375, height: 667 },
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15'
    });

    const page = await context.newPage();

    try {
        console.log('📱 Navigating to http://localhost:3005/en/home.html');
        await page.goto('http://localhost:3005/en/home.html');
        await page.waitForLoadState('networkidle');

        // Wait for JavaScript to load language selector
        await page.waitForTimeout(2000);

        console.log('🔍 Checking for language selector creation...');

        // Check if language switcher was created by JavaScript
        const languageSwitcher = await page.$('#language-switcher');
        console.log(`Language switcher exists: ${!!languageSwitcher}`);

        if (languageSwitcher) {
            const isVisible = await languageSwitcher.isVisible();
            console.log(`Language switcher visible: ${isVisible}`);

            const boundingBox = await languageSwitcher.boundingBox();
            if (boundingBox) {
                console.log(`Position: x=${boundingBox.x}, y=${boundingBox.y}, width=${boundingBox.width}, height=${boundingBox.height}`);
            }

            // Check the select element inside
            const selectElement = await page.$('#language-switcher select');
            if (selectElement) {
                const selectVisible = await selectElement.isVisible();
                const selectStyles = await selectElement.evaluate(el => {
                    const computed = getComputedStyle(el);
                    return {
                        background: computed.background,
                        color: computed.color,
                        border: computed.border,
                        display: computed.display,
                        visibility: computed.visibility,
                        opacity: computed.opacity,
                        zIndex: computed.zIndex
                    };
                });
                console.log(`Select element visible: ${selectVisible}`);
                console.log('Select element styles:', selectStyles);

                // Test the dropdown options
                const options = await page.$$eval('#language-switcher select option', opts =>
                    opts.map(opt => ({ value: opt.value, text: opt.textContent }))
                );
                console.log('Available language options:', options);
            }
        }

        // Take screenshot showing language selector position
        console.log('📸 Taking screenshot focusing on navigation area');
        await page.screenshot({
            path: 'mobile-language-selector-test.png',
            clip: { x: 0, y: 0, width: 375, height: 200 }
        });

        // Test hamburger menu opening with language selector
        console.log('\n🔍 Testing hamburger + language selector interaction...');

        const hamburgerButton = await page.$('.w-nav-button');
        if (hamburgerButton) {
            console.log('🖱️  Opening mobile menu...');
            await hamburgerButton.click();
            await page.waitForTimeout(1000);

            // Check language selector visibility after menu opens
            if (languageSwitcher) {
                const isVisibleAfterMenu = await languageSwitcher.isVisible();
                console.log(`Language selector visible after opening menu: ${isVisibleAfterMenu}`);

                const boundingBoxAfterMenu = await languageSwitcher.boundingBox();
                if (boundingBoxAfterMenu) {
                    console.log(`New position: x=${boundingBoxAfterMenu.x}, y=${boundingBoxAfterMenu.y}`);
                }
            }

            // Take screenshot with menu open
            await page.screenshot({
                path: 'mobile-menu-with-language-selector.png',
                fullPage: false
            });
        }

        // Test language selector functionality
        console.log('\n🌐 Testing language switching...');

        const selectElement = await page.$('#languageSelect');
        if (selectElement) {
            // Try switching to Russian
            console.log('🔄 Switching to Russian...');
            await selectElement.selectOption('ru');
            await page.waitForTimeout(2000);

            // Check if URL changed
            const currentURL = page.url();
            console.log(`Current URL after switch: ${currentURL}`);
        }

        // Check for any JavaScript errors
        const jsErrors = await page.evaluate(() => {
            return window.jsErrors || [];
        });

        if (jsErrors.length > 0) {
            console.log('⚠️  JavaScript errors found:', jsErrors);
        }

    } catch (error) {
        console.error('❌ Error during testing:', error);

        await page.screenshot({
            path: 'mobile-language-selector-error.png',
            fullPage: true
        });
    }

    await browser.close();
    console.log('\n✅ Language selector mobile testing completed.');
}

testLanguageSelectorMobile().catch(console.error);