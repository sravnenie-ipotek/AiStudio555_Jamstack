const { chromium } = require('playwright');

async function testMenuOverlap() {
    console.log('🔍 Testing Menu Elements for Overlap');
    console.log('=====================================\n');

    const browser = await chromium.launch({ headless: false, slowMo: 500 });

    const testPages = [
        { url: 'http://localhost:3005/en/home.html', name: 'EN Home' },
        { url: 'http://localhost:3005/en/courses.html', name: 'EN Courses' },
        { url: 'http://localhost:3005/ru/home.html', name: 'RU Home' },
        { url: 'http://localhost:3005/ru/courses.html', name: 'RU Courses' },
        { url: 'http://localhost:3005/he/home.html', name: 'HE Home' },
        { url: 'http://localhost:3005/he/courses.html', name: 'HE Courses' }
    ];

    for (const testPage of testPages) {
        console.log(`\n📍 Testing ${testPage.name}:`);
        console.log('----------------------------');

        const page = await browser.newPage();
        await page.setViewportSize({ width: 1920, height: 1080 });

        try {
            await page.goto(testPage.url, {
                waitUntil: 'domcontentloaded',
                timeout: 10000
            });

            await page.waitForTimeout(2000);

            // Check for overlapping elements
            const overlapCheck = await page.evaluate(() => {
                const results = {
                    hasMenu: false,
                    hasSwitcher: false,
                    hasPrimaryButton: false,
                    hasCart: false,
                    overlaps: [],
                    elementPositions: {}
                };

                // Get key elements
                const menu = document.querySelector('.nav-menu.w-nav-menu');
                const switcher = document.getElementById('language-switcher');
                const primaryButton = document.querySelector('.primary-button-wrapper.desktop');
                const cart = document.querySelector('.w-commerce-commercecartwrapper.navbar-cart');

                results.hasMenu = !!menu;
                results.hasSwitcher = !!switcher;
                results.hasPrimaryButton = !!primaryButton;
                results.hasCart = !!cart;

                // Function to check if two elements overlap
                function doElementsOverlap(el1, el2) {
                    if (!el1 || !el2) return false;

                    const rect1 = el1.getBoundingClientRect();
                    const rect2 = el2.getBoundingClientRect();

                    return !(rect1.right < rect2.left ||
                             rect1.left > rect2.right ||
                             rect1.bottom < rect2.top ||
                             rect1.top > rect2.bottom);
                }

                // Store positions for debugging
                if (menu) {
                    const menuRect = menu.getBoundingClientRect();
                    results.elementPositions.menu = {
                        left: Math.round(menuRect.left),
                        right: Math.round(menuRect.right),
                        top: Math.round(menuRect.top),
                        bottom: Math.round(menuRect.bottom)
                    };
                }

                if (switcher) {
                    const switcherRect = switcher.getBoundingClientRect();
                    results.elementPositions.switcher = {
                        left: Math.round(switcherRect.left),
                        right: Math.round(switcherRect.right),
                        top: Math.round(switcherRect.top),
                        bottom: Math.round(switcherRect.bottom)
                    };
                }

                if (primaryButton) {
                    const buttonRect = primaryButton.getBoundingClientRect();
                    results.elementPositions.primaryButton = {
                        left: Math.round(buttonRect.left),
                        right: Math.round(buttonRect.right),
                        top: Math.round(buttonRect.top),
                        bottom: Math.round(buttonRect.bottom)
                    };
                }

                if (cart) {
                    const cartRect = cart.getBoundingClientRect();
                    results.elementPositions.cart = {
                        left: Math.round(cartRect.left),
                        right: Math.round(cartRect.right),
                        top: Math.round(cartRect.top),
                        bottom: Math.round(cartRect.bottom)
                    };
                }

                // Check for overlaps
                if (switcher && primaryButton && doElementsOverlap(switcher, primaryButton)) {
                    results.overlaps.push('Language switcher overlaps with primary button');
                }

                if (switcher && cart && doElementsOverlap(switcher, cart)) {
                    results.overlaps.push('Language switcher overlaps with cart');
                }

                if (primaryButton && cart && doElementsOverlap(primaryButton, cart)) {
                    results.overlaps.push('Primary button overlaps with cart');
                }

                // Check if language switcher overlaps with nav links
                const navLinks = document.querySelectorAll('.nav-menu .nav-link');
                navLinks.forEach((link, index) => {
                    if (switcher && doElementsOverlap(switcher, link)) {
                        results.overlaps.push(`Language switcher overlaps with nav link ${index + 1}`);
                    }
                });

                return results;
            });

            // Display results
            console.log(`  Menu present: ${overlapCheck.hasMenu ? '✅' : '❌'}`);
            console.log(`  Language switcher: ${overlapCheck.hasSwitcher ? '✅' : '❌'}`);
            console.log(`  Primary button: ${overlapCheck.hasPrimaryButton ? '✅' : '❌'}`);
            console.log(`  Cart icon: ${overlapCheck.hasCart ? '❌ Still present' : '✅ Removed'}`);

            if (overlapCheck.overlaps.length > 0) {
                console.log(`  ❌ OVERLAPS DETECTED:`);
                overlapCheck.overlaps.forEach(overlap => {
                    console.log(`     - ${overlap}`);
                });
            } else {
                console.log(`  ✅ No overlaps detected`);
            }

            // Take screenshot
            const screenshotName = `${testPage.name.toLowerCase().replace(' ', '-')}-overlap-test.png`;
            await page.screenshot({
                path: `/Users/michaelmishayev/Desktop/newCode/${screenshotName}`,
                clip: { x: 0, y: 0, width: 1920, height: 100 }
            });
            console.log(`  📸 Screenshot: ${screenshotName}`);

        } catch (error) {
            console.log(`  ❌ Error: ${error.message}`);
        }

        await page.close();
    }

    await browser.close();

    console.log('\n=====================================');
    console.log('✅ Overlap testing complete!');
    console.log('=====================================');
}

testMenuOverlap().catch(console.error);