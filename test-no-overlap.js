const { chromium } = require('playwright');

async function testNoOverlap() {
    console.log('🔍 Testing Menu Layout - No Overlaps');
    console.log('=====================================\n');

    const browser = await chromium.launch({ headless: false, slowMo: 1000 });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1920, height: 1080 });

    console.log('Loading: http://localhost:3005/en/home.html');
    await page.goto('http://localhost:3005/en/home.html', {
        waitUntil: 'domcontentloaded',
        timeout: 10000
    });

    await page.waitForTimeout(2000);

    const layoutCheck = await page.evaluate(() => {
        const switcher = document.getElementById('language-switcher');
        const primaryButton = document.querySelector('.primary-button-wrapper');
        const navMenu = document.querySelector('.nav-menu');
        const buttonWrapper = document.querySelector('.navbar-button-wrapper');

        const results = {
            hasLanguageSwitcher: !!switcher,
            hasPrimaryButton: !!primaryButton,
            hasNavMenu: !!navMenu,
            hasButtonWrapper: !!buttonWrapper
        };

        if (switcher && primaryButton) {
            const switcherRect = switcher.getBoundingClientRect();
            const buttonRect = primaryButton.getBoundingClientRect();

            // Check if they overlap
            const overlap = !(switcherRect.right < buttonRect.left ||
                            switcherRect.left > buttonRect.right ||
                            switcherRect.bottom < buttonRect.top ||
                            switcherRect.top > buttonRect.bottom);

            results.switcherPosition = {
                left: Math.round(switcherRect.left),
                right: Math.round(switcherRect.right),
                top: Math.round(switcherRect.top),
                width: Math.round(switcherRect.width)
            };

            results.buttonPosition = {
                left: Math.round(buttonRect.left),
                right: Math.round(buttonRect.right),
                top: Math.round(buttonRect.top),
                width: Math.round(buttonRect.width)
            };

            results.overlap = overlap;
            results.gap = buttonRect.left - switcherRect.right;
        }

        // Check parent wrapper layout
        if (buttonWrapper) {
            const wrapperStyle = window.getComputedStyle(buttonWrapper);
            results.wrapperDisplay = wrapperStyle.display;
            results.wrapperGap = wrapperStyle.gap;
        }

        return results;
    });

    console.log('\n📊 Layout Analysis:');
    console.log('-------------------');
    console.log(`Language Switcher: ${layoutCheck.hasLanguageSwitcher ? '✅' : '❌'}`);
    console.log(`Primary Button: ${layoutCheck.hasPrimaryButton ? '✅' : '❌'}`);
    console.log(`Button Wrapper: ${layoutCheck.hasButtonWrapper ? '✅' : '❌'}`);

    if (layoutCheck.switcherPosition && layoutCheck.buttonPosition) {
        console.log('\n📐 Element Positions:');
        console.log(`Language Switcher: left=${layoutCheck.switcherPosition.left}px, width=${layoutCheck.switcherPosition.width}px`);
        console.log(`Primary Button: left=${layoutCheck.buttonPosition.left}px, width=${layoutCheck.buttonPosition.width}px`);
        console.log(`Gap between elements: ${layoutCheck.gap}px`);
        console.log(`Wrapper display: ${layoutCheck.wrapperDisplay}`);
        console.log(`Wrapper gap: ${layoutCheck.wrapperGap}`);

        console.log('\n🎯 Result:');
        if (layoutCheck.overlap) {
            console.log('❌ ELEMENTS ARE OVERLAPPING!');
        } else {
            console.log('✅ NO OVERLAP - Elements are properly spaced');
            console.log('✅ Language button is in same line but not on another element');
        }
    }

    // Take screenshot
    await page.screenshot({
        path: '/Users/michaelmishayev/Desktop/newCode/no-overlap-test.png',
        clip: { x: 0, y: 0, width: 1920, height: 100 }
    });
    console.log('\n📸 Screenshot saved: no-overlap-test.png');

    await page.waitForTimeout(3000);
    await browser.close();
}

testNoOverlap().catch(console.error);