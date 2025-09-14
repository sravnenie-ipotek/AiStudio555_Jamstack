const { chromium } = require('playwright');

async function testMenuSimple() {
    console.log('🔍 Simple Menu Visibility Test');
    console.log('==============================\n');

    const browser = await chromium.launch({ headless: false, slowMo: 1000 });

    // Test just EN courses page
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1920, height: 1080 });

    console.log('Loading EN courses page...');
    await page.goto('http://localhost:3005/en/courses.html', {
        waitUntil: 'domcontentloaded',
        timeout: 10000
    });

    // Wait for script to execute
    await page.waitForTimeout(3000);

    // Debug: Check what styles are applied
    const menuDebug = await page.evaluate(() => {
        const menu = document.querySelector('.nav-menu.w-nav-menu');
        if (!menu) return { exists: false };

        const computed = window.getComputedStyle(menu);
        const inlineStyle = menu.getAttribute('style');

        // Try to force it visible
        menu.style.display = 'flex';
        menu.style.visibility = 'visible';
        menu.style.opacity = '1';

        const afterForce = window.getComputedStyle(menu);

        return {
            exists: true,
            className: menu.className,
            inlineStyle: inlineStyle,
            computedBefore: {
                display: computed.display,
                visibility: computed.visibility,
                opacity: computed.opacity,
                position: computed.position
            },
            computedAfter: {
                display: afterForce.display,
                visibility: afterForce.visibility,
                opacity: afterForce.opacity,
                position: afterForce.position
            },
            hasUniversalScript: !!document.getElementById('universal-menu-responsive-styles'),
            hasSwitcher: !!document.getElementById('language-switcher')
        };
    });

    console.log('\nMenu Debug Info:');
    console.log(JSON.stringify(menuDebug, null, 2));

    // Check if universal script ran
    const scriptRan = await page.evaluate(() => {
        return {
            hasStyles: !!document.getElementById('universal-menu-responsive-styles'),
            hasSwitcher: !!document.getElementById('language-switcher'),
            switchFunction: typeof window.switchLanguage === 'function'
        };
    });

    console.log('\nScript Status:');
    console.log(JSON.stringify(scriptRan, null, 2));

    await page.waitForTimeout(5000); // Keep open to see

    await browser.close();
}

testMenuSimple().catch(console.error);