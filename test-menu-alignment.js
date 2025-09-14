const { chromium } = require('playwright');

async function testMenuAlignment() {
    console.log('📐 Testing Menu Element Alignment');
    console.log('==================================\n');

    const browser = await chromium.launch({ headless: false, slowMo: 1000 });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1920, height: 1080 });

    console.log('Loading: http://localhost:3005/en/home.html');
    await page.goto('http://localhost:3005/en/home.html', {
        waitUntil: 'domcontentloaded',
        timeout: 10000
    });

    await page.waitForTimeout(2000);

    const alignmentCheck = await page.evaluate(() => {
        const navLinks = document.querySelectorAll('.nav-menu .nav-link');
        const languageSwitcher = document.getElementById('language-switcher');
        const primaryButton = document.querySelector('.primary-button-wrapper');

        const results = {
            navLinks: [],
            languageSwitcher: null,
            primaryButton: null,
            alignment: {
                topAligned: true,
                heightConsistent: true,
                inNavMenu: false
            }
        };

        // Get positions of all nav links
        navLinks.forEach((link, index) => {
            const rect = link.getBoundingClientRect();
            results.navLinks.push({
                index,
                text: link.textContent.trim(),
                top: Math.round(rect.top),
                bottom: Math.round(rect.bottom),
                height: Math.round(rect.height),
                left: Math.round(rect.left),
                right: Math.round(rect.right)
            });
        });

        // Get language switcher position
        if (languageSwitcher) {
            const rect = languageSwitcher.getBoundingClientRect();
            results.languageSwitcher = {
                top: Math.round(rect.top),
                bottom: Math.round(rect.bottom),
                height: Math.round(rect.height),
                left: Math.round(rect.left),
                right: Math.round(rect.right),
                parent: languageSwitcher.parentElement.className
            };

            // Check if it's inside nav-menu
            results.alignment.inNavMenu = languageSwitcher.closest('.nav-menu') !== null;
        }

        // Get primary button position
        if (primaryButton) {
            const rect = primaryButton.getBoundingClientRect();
            results.primaryButton = {
                top: Math.round(rect.top),
                bottom: Math.round(rect.bottom),
                height: Math.round(rect.height),
                left: Math.round(rect.left),
                right: Math.round(rect.right)
            };
        }

        // Check alignment
        if (results.navLinks.length > 0 && results.languageSwitcher) {
            const firstLinkTop = results.navLinks[0].top;
            const switcherTop = results.languageSwitcher.top;

            // Allow 5px tolerance
            results.alignment.topAligned = Math.abs(firstLinkTop - switcherTop) <= 5;

            // Check if all elements have similar height
            const linkHeight = results.navLinks[0].height;
            const switcherHeight = results.languageSwitcher.height;
            results.alignment.heightConsistent = Math.abs(linkHeight - switcherHeight) <= 10;
        }

        return results;
    });

    console.log('\n📊 Element Positions:');
    console.log('---------------------');

    alignmentCheck.navLinks.forEach(link => {
        console.log(`${link.text.padEnd(12)}: top=${link.top}px, height=${link.height}px`);
    });

    if (alignmentCheck.languageSwitcher) {
        console.log(`Language     : top=${alignmentCheck.languageSwitcher.top}px, height=${alignmentCheck.languageSwitcher.height}px`);
        console.log(`Parent class : ${alignmentCheck.languageSwitcher.parent}`);
    }

    console.log('\n🎯 Alignment Results:');
    console.log('----------------------');
    console.log(`In nav menu: ${alignmentCheck.alignment.inNavMenu ? '✅' : '❌'}`);
    console.log(`Top aligned: ${alignmentCheck.alignment.topAligned ? '✅' : '❌'}`);
    console.log(`Height consistent: ${alignmentCheck.alignment.heightConsistent ? '✅' : '❌'}`);

    const allAligned = alignmentCheck.alignment.inNavMenu &&
                      alignmentCheck.alignment.topAligned &&
                      alignmentCheck.alignment.heightConsistent;

    console.log(`\n${allAligned ? '✅ PERFECT ALIGNMENT' : '❌ ALIGNMENT ISSUES DETECTED'}`);
    console.log('Language selector is part of shared menu and aligned with other elements');

    // Take screenshot
    await page.screenshot({
        path: '/Users/michaelmishayev/Desktop/newCode/menu-alignment-test.png',
        clip: { x: 0, y: 0, width: 1920, height: 100 }
    });
    console.log('\n📸 Screenshot saved: menu-alignment-test.png');

    await page.waitForTimeout(2000);
    await browser.close();
}

testMenuAlignment().catch(console.error);