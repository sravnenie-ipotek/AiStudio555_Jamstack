const { chromium } = require('playwright');

async function testHebrewMobileMenu() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    // Set mobile viewport (375px width as requested)
    await page.setViewportSize({ width: 375, height: 667 });

    try {
        // Navigate to Hebrew index page
        await page.goto('http://localhost:3005/he/index.html');
        console.log('Page loaded successfully');

        // Wait for page to be fully loaded
        await page.waitForTimeout(3000);

        // Take initial screenshot
        await page.screenshot({
            path: 'hebrew-mobile-initial.png',
            fullPage: false
        });
        console.log('Initial screenshot taken');

        // Look for hamburger menu button - try multiple selectors
        const possibleSelectors = [
            '.menu-button',
            '.nav-menu-button',
            '[data-nav-menu-open]',
            '.hamburger',
            '.mobile-menu-button',
            '.nav-button',
            'button[aria-label*="menu"]',
            '.w-nav-button'
        ];

        let hamburgerButton = null;
        for (const selector of possibleSelectors) {
            try {
                hamburgerButton = await page.$(selector);
                if (hamburgerButton) {
                    console.log(`Found hamburger button with selector: ${selector}`);
                    break;
                }
            } catch (e) {
                // Continue to next selector
            }
        }

        if (hamburgerButton) {
            console.log('Clicking hamburger button...');
            await hamburgerButton.click();

            // Wait for menu animation
            await page.waitForTimeout(1500);

            // Take screenshot with menu open
            await page.screenshot({
                path: 'hebrew-mobile-menu-open.png',
                fullPage: false
            });
            console.log('Menu open screenshot taken: hebrew-mobile-menu-open.png');

            // Check menu visibility and properties
            const menuSelectors = ['.nav-menu', '.nav-overlay', '.menu-overlay', '.w-nav-overlay'];

            for (const selector of menuSelectors) {
                try {
                    const menu = await page.$(selector);
                    if (menu) {
                        const isVisible = await menu.isVisible();
                        const styles = await page.evaluate((element) => {
                            const computed = window.getComputedStyle(element);
                            return {
                                display: computed.display,
                                position: computed.position,
                                zIndex: computed.zIndex,
                                backgroundColor: computed.backgroundColor,
                                width: computed.width,
                                height: computed.height,
                                opacity: computed.opacity
                            };
                        }, menu);

                        console.log(`Menu (${selector}) - Visible: ${isVisible}`, styles);
                    }
                } catch (e) {
                    // Continue checking other selectors
                }
            }

            // Check for Hebrew menu items
            const menuItems = await page.$$('.nav-link, .w-nav-link, a[href*="he/"]');
            console.log(`Found ${menuItems.length} potential menu items`);

            for (let i = 0; i < Math.min(menuItems.length, 10); i++) {
                try {
                    const text = await menuItems[i].textContent();
                    const href = await menuItems[i].getAttribute('href');
                    console.log(`Menu item ${i + 1}: "${text}" -> ${href}`);
                } catch (e) {
                    console.log(`Could not get text for menu item ${i + 1}`);
                }
            }

        } else {
            console.log('Hamburger button not found. Looking for all buttons...');

            const allButtons = await page.$$('button, .button, [role="button"], .w-button');
            console.log(`Found ${allButtons.length} button-like elements`);

            for (let i = 0; i < Math.min(allButtons.length, 5); i++) {
                try {
                    const text = await allButtons[i].textContent();
                    const classes = await allButtons[i].getAttribute('class');
                    console.log(`Button ${i + 1}: "${text}" (classes: ${classes})`);
                } catch (e) {
                    console.log(`Could not analyze button ${i + 1}`);
                }
            }
        }

        // Take final screenshot
        await page.screenshot({
            path: 'hebrew-mobile-final.png',
            fullPage: true
        });

        console.log('Test completed. Screenshots saved.');

    } catch (error) {
        console.error('Error during test:', error);

        await page.screenshot({
            path: 'hebrew-mobile-error.png',
            fullPage: false
        });
    }

    await browser.close();
}

testHebrewMobileMenu().catch(console.error);