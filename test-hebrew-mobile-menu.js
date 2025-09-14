const puppeteer = require('puppeteer');
const path = require('path');

async function testHebrewMobileMenu() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Set mobile viewport (375px width as requested)
    await page.setViewport({ width: 375, height: 667 });

    try {
        // Navigate to Hebrew index page
        await page.goto('http://localhost:3005/he/index.html', { waitUntil: 'networkidle2' });

        console.log('Page loaded successfully');

        // Wait for page to be fully loaded
        await page.waitForTimeout(2000);

        // Take initial screenshot
        await page.screenshot({
            path: 'hebrew-mobile-initial.png',
            fullPage: false
        });
        console.log('Initial screenshot taken');

        // Find and click the hamburger menu button
        const hamburgerButton = await page.$('.menu-button, .nav-menu-button, [data-nav-menu-open]');

        if (hamburgerButton) {
            console.log('Hamburger button found, clicking...');
            await hamburgerButton.click();

            // Wait for menu animation
            await page.waitForTimeout(1000);

            // Take screenshot with menu open
            await page.screenshot({
                path: 'hebrew-mobile-menu-open.png',
                fullPage: false
            });
            console.log('Menu open screenshot taken');

            // Check menu properties
            const menuOverlay = await page.$('.nav-menu-overlay, .nav-menu, .menu-overlay');
            if (menuOverlay) {
                const menuStyles = await page.evaluate((element) => {
                    const styles = window.getComputedStyle(element);
                    return {
                        display: styles.display,
                        position: styles.position,
                        zIndex: styles.zIndex,
                        backgroundColor: styles.backgroundColor,
                        width: styles.width,
                        height: styles.height,
                        top: styles.top,
                        left: styles.left
                    };
                }, menuOverlay);

                console.log('Menu overlay styles:', menuStyles);
            }

            // Check for menu items
            const menuItems = await page.$$('.nav-menu-list a, .nav-link');
            console.log(`Found ${menuItems.length} menu items`);

            for (let i = 0; i < menuItems.length; i++) {
                const text = await page.evaluate(el => el.textContent, menuItems[i]);
                console.log(`Menu item ${i + 1}: ${text}`);
            }

        } else {
            console.log('Hamburger button not found');
            // Try alternative selectors
            const buttons = await page.$$('button, .button, [role="button"]');
            console.log(`Found ${buttons.length} clickable elements`);
        }

    } catch (error) {
        console.error('Error:', error);

        // Take error screenshot
        await page.screenshot({
            path: 'hebrew-mobile-error.png',
            fullPage: false
        });
    }

    // Keep browser open for manual inspection
    console.log('Test complete. Browser will stay open for inspection...');
    await page.waitForTimeout(30000); // Wait 30 seconds

    await browser.close();
}

testHebrewMobileMenu().catch(console.error);