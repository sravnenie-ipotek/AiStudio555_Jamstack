const { chromium } = require('playwright');

async function diagnoseMenuWidth() {
    console.log('🔬 DIAGNOSING: Menu Width Constraints');
    console.log('=====================================\n');

    const browser = await chromium.launch({ headless: false, slowMo: 1000 });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1920, height: 1080 });

    await page.goto('http://localhost:3005/en/home.html', {
        waitUntil: 'domcontentloaded',
        timeout: 10000
    });

    await page.waitForTimeout(2000);

    const widthAnalysis = await page.evaluate(() => {
        const container = document.querySelector('.container');
        const navbarContent = document.querySelector('.navbar-content');
        const navMenu = document.querySelector('.nav-menu');
        const langSwitcher = document.getElementById('language-switcher');
        const primaryButton = document.querySelector('.primary-button-wrapper');

        const getElementInfo = (element, name) => {
            if (!element) return { name, exists: false };

            const rect = element.getBoundingClientRect();
            const style = window.getComputedStyle(element);

            return {
                name,
                exists: true,
                rect: {
                    x: Math.round(rect.x),
                    width: Math.round(rect.width),
                    right: Math.round(rect.right)
                },
                style: {
                    width: style.width,
                    maxWidth: style.maxWidth,
                    minWidth: style.minWidth,
                    display: style.display,
                    position: style.position,
                    overflow: style.overflow
                }
            };
        };

        return {
            container: getElementInfo(container, 'Container'),
            navbarContent: getElementInfo(navbarContent, 'Navbar Content'),
            navMenu: getElementInfo(navMenu, 'Nav Menu'),
            langSwitcher: getElementInfo(langSwitcher, 'Language Switcher'),
            primaryButton: getElementInfo(primaryButton, 'Primary Button'),
            viewportWidth: window.innerWidth
        };
    });

    console.log('📏 Width Analysis:');
    console.log('==================');
    console.log(`Viewport: ${widthAnalysis.viewportWidth}px`);

    Object.values(widthAnalysis).forEach(element => {
        if (element.exists) {
            console.log(`\n${element.name}:`);
            console.log(`  Position: x=${element.rect.x}px, width=${element.rect.width}px, right=${element.rect.right}px`);
            console.log(`  CSS: width=${element.style.width}, maxWidth=${element.style.maxWidth}`);
            console.log(`  Display: ${element.style.display}, Position: ${element.style.position}`);
        }
    });

    // Check if language switcher is outside nav menu bounds
    if (widthAnalysis.navMenu.exists && widthAnalysis.langSwitcher.exists) {
        const menuRight = widthAnalysis.navMenu.rect.right;
        const switcherX = widthAnalysis.langSwitcher.rect.x;
        const isOutside = switcherX >= menuRight;

        console.log('\n🎯 The Problem:');
        console.log('===============');
        console.log(`Nav Menu ends at: ${menuRight}px`);
        console.log(`Language Switcher starts at: ${switcherX}px`);
        console.log(`Language Switcher is ${isOutside ? 'OUTSIDE' : 'INSIDE'} the nav menu bounds`);

        if (isOutside) {
            console.log(`Gap: ${switcherX - menuRight}px - This is the UX bug!`);
            console.log('❌ Language switcher appears as separate UI element');
        }
    }

    await page.screenshot({
        path: '/Users/michaelmishayev/Desktop/newCode/menu-width-debug.png',
        fullPage: false
    });
    console.log('\n📸 Width debug screenshot saved');

    await page.waitForTimeout(2000);
    await browser.close();
}

diagnoseMenuWidth().catch(console.error);