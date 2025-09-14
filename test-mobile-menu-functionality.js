const { chromium } = require('playwright');
const path = require('path');

async function testMobileMenu() {
    console.log('🔍 Testing Mobile Menu Functionality...\n');

    const browser = await chromium.launch({
        headless: false,  // Show browser for visual debugging
        slowMo: 1000     // Add delay between actions
    });

    const context = await browser.newContext({
        viewport: { width: 375, height: 667 }, // iPhone 6/7/8 size
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Mobile/15E148 Safari/604.1'
    });

    const page = await context.newPage();

    try {
        // Navigate to the English homepage
        console.log('📱 Navigating to http://localhost:3005/en/home.html');
        await page.goto('http://localhost:3005/en/home.html');
        await page.waitForLoadState('networkidle');

        // Take initial screenshot
        console.log('📸 Taking initial screenshot (menu should be closed)');
        await page.screenshot({
            path: 'mobile-menu-initial.png',
            fullPage: false // Just the viewport
        });

        // Check if mobile menu is hidden by default
        console.log('\n🔍 Step 1: Checking if mobile menu is hidden by default...');

        // Look for the mobile menu elements
        const mobileNav = await page.$('.w-nav-menu');
        const mobileNavVisible = await mobileNav?.isVisible();
        console.log(`Mobile nav element exists: ${!!mobileNav}`);
        console.log(`Mobile nav visible: ${mobileNavVisible}`);

        // Check the hamburger button
        console.log('\n🔍 Step 2: Checking hamburger button visibility and functionality...');

        const hamburgerButton = await page.$('.w-nav-button');
        const hamburgerVisible = await hamburgerButton?.isVisible();
        console.log(`Hamburger button exists: ${!!hamburgerButton}`);
        console.log(`Hamburger button visible: ${hamburgerVisible}`);

        if (hamburgerButton) {
            const buttonBox = await hamburgerButton.boundingBox();
            console.log(`Hamburger button position: x=${buttonBox?.x}, y=${buttonBox?.y}, width=${buttonBox?.width}, height=${buttonBox?.height}`);
        }

        // Check language selector
        console.log('\n🔍 Step 3: Checking language selector visibility...');

        const languageSelectors = [
            '.language-selector',
            '.language-switcher',
            '[class*="language"]',
            '.w-dropdown'
        ];

        let languageSelectorFound = false;
        for (const selector of languageSelectors) {
            const element = await page.$(selector);
            if (element) {
                const isVisible = await element.isVisible();
                console.log(`Language selector (${selector}): exists=${!!element}, visible=${isVisible}`);
                if (isVisible) {
                    languageSelectorFound = true;
                    const box = await element.boundingBox();
                    console.log(`Position: x=${box?.x}, y=${box?.y}, width=${box?.width}, height=${box?.height}`);
                }
            }
        }

        if (!languageSelectorFound) {
            console.log('❌ No visible language selector found');
        }

        // Test hamburger button click to open menu
        console.log('\n🔍 Step 4: Testing hamburger button click to open menu...');

        if (hamburgerButton && hamburgerVisible) {
            console.log('🖱️  Clicking hamburger button to open menu...');
            await hamburgerButton.click();
            await page.waitForTimeout(500); // Wait for animation

            // Check if menu opened
            const mobileNavAfterClick = await page.$('.w-nav-menu');
            const mobileNavVisibleAfterClick = await mobileNavAfterClick?.isVisible();
            console.log(`Mobile nav visible after click: ${mobileNavVisibleAfterClick}`);

            // Take screenshot of open menu
            console.log('📸 Taking screenshot with menu open');
            await page.screenshot({
                path: 'mobile-menu-open.png',
                fullPage: false
            });

            // Test closing the menu
            console.log('\n🔍 Step 5: Testing hamburger button click to close menu...');
            console.log('🖱️  Clicking hamburger button again to close menu...');
            await hamburgerButton.click();
            await page.waitForTimeout(500); // Wait for animation

            const mobileNavAfterSecondClick = await page.$('.w-nav-menu');
            const mobileNavVisibleAfterSecondClick = await mobileNavAfterSecondClick?.isVisible();
            console.log(`Mobile nav visible after second click: ${mobileNavVisibleAfterSecondClick}`);

            // Take screenshot of closed menu
            console.log('📸 Taking final screenshot (menu should be closed again)');
            await page.screenshot({
                path: 'mobile-menu-closed-final.png',
                fullPage: false
            });

        } else {
            console.log('❌ Cannot test menu functionality - hamburger button not found or not visible');
        }

        // Additional debugging - check all navigation elements
        console.log('\n🔍 Additional Debugging: All navigation elements...');

        const navElements = await page.$$eval('[class*="nav"], [class*="menu"], [class*="toggle"], [class*="hamburger"]', elements => {
            return elements.map(el => ({
                tagName: el.tagName,
                className: el.className,
                id: el.id,
                visible: el.offsetWidth > 0 && el.offsetHeight > 0,
                display: getComputedStyle(el).display,
                visibility: getComputedStyle(el).visibility
            }));
        });

        console.log('Navigation elements found:');
        navElements.forEach((el, i) => {
            console.log(`  ${i + 1}. ${el.tagName}.${el.className} (id: ${el.id})`);
            console.log(`     visible: ${el.visible}, display: ${el.display}, visibility: ${el.visibility}`);
        });

    } catch (error) {
        console.error('❌ Error during testing:', error);

        // Take error screenshot
        await page.screenshot({
            path: 'mobile-menu-error.png',
            fullPage: true
        });
    }

    await browser.close();
    console.log('\n✅ Mobile menu testing completed. Check the generated screenshots.');
}

testMobileMenu().catch(console.error);