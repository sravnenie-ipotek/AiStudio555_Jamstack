const { chromium } = require('playwright');

async function debugLanguageSelector() {
    console.log('🔍 Debugging Language Selector Display');
    console.log('=====================================\n');

    const browser = await chromium.launch({ headless: false, slowMo: 1000 });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1920, height: 1080 });

    await page.goto('http://localhost:3005/en/home.html', {
        waitUntil: 'domcontentloaded',
        timeout: 10000
    });

    await page.waitForTimeout(2000);

    const languageSelectorInfo = await page.evaluate(() => {
        const langSwitcher = document.getElementById('language-switcher');
        const currentLanguage = document.getElementById('currentLanguage');
        const dropdown = document.getElementById('languageDropdown');

        if (!langSwitcher) {
            return { error: 'Language switcher not found' };
        }

        const langRect = langSwitcher.getBoundingClientRect();
        const currentLangRect = currentLanguage ? currentLanguage.getBoundingClientRect() : null;

        // Get styles
        const langStyles = window.getComputedStyle(langSwitcher);
        const currentStyles = currentLanguage ? window.getComputedStyle(currentLanguage) : null;

        // Check menu alignment
        const navMenu = document.querySelector('.nav-menu');
        const allMenuItems = navMenu ? Array.from(navMenu.children) : [];
        const menuItemsY = allMenuItems.map(item => ({
            element: item.tagName + (item.id ? '#' + item.id : '') + (item.className ? '.' + item.className.split(' ')[0] : ''),
            y: Math.round(item.getBoundingClientRect().y),
            height: Math.round(item.getBoundingClientRect().height)
        }));

        return {
            langSwitcher: {
                innerHTML: langSwitcher.innerHTML.substring(0, 200) + '...',
                x: Math.round(langRect.x),
                y: Math.round(langRect.y),
                width: Math.round(langRect.width),
                height: Math.round(langRect.height),
                display: langStyles.display,
                position: langStyles.position,
                alignItems: langStyles.alignItems,
                lineHeight: langStyles.lineHeight,
                fontSize: langStyles.fontSize
            },
            currentLanguage: currentLangRect ? {
                text: currentLanguage.textContent,
                x: Math.round(currentLangRect.x),
                y: Math.round(currentLangRect.y),
                width: Math.round(currentLangRect.width),
                height: Math.round(currentLangRect.height),
                display: currentStyles.display,
                alignItems: currentStyles.alignItems,
                lineHeight: currentStyles.lineHeight,
                fontSize: currentStyles.fontSize
            } : null,
            dropdown: dropdown ? {
                display: dropdown.style.display,
                innerHTML: dropdown.innerHTML.substring(0, 100) + '...'
            } : null,
            menuAlignment: menuItemsY
        };
    });

    console.log('🎯 Language Selector Debug Info:');
    console.log('=================================');
    console.log('Language Switcher:', languageSelectorInfo.langSwitcher);
    console.log('\nCurrent Language Span:', languageSelectorInfo.currentLanguage);
    console.log('\nDropdown Info:', languageSelectorInfo.dropdown);

    console.log('\n📊 Menu Items Y-Alignment:');
    console.log('===========================');
    languageSelectorInfo.menuAlignment.forEach(item => {
        console.log(`${item.element.padEnd(25)} | Y: ${item.y}px | Height: ${item.height}px`);
    });

    // Check if all Y positions are aligned (within 5px tolerance)
    const yPositions = languageSelectorInfo.menuAlignment.map(item => item.y);
    const firstY = yPositions[0];
    const allAligned = yPositions.every(y => Math.abs(y - firstY) <= 5);

    console.log('\n🎯 ALIGNMENT RESULT:');
    console.log('====================');
    console.log(`All menu items aligned: ${allAligned ? '✅ YES' : '❌ NO'}`);
    console.log(`Y-position range: ${Math.min(...yPositions)}px to ${Math.max(...yPositions)}px`);

    // Take screenshot
    await page.screenshot({
        path: '/Users/michaelmishayev/Desktop/newCode/language-selector-debug.png',
        clip: { x: 0, y: 0, width: 1920, height: 100 }
    });
    console.log('\n📸 Screenshot saved: language-selector-debug.png');

    await page.waitForTimeout(3000);
    await browser.close();
}

debugLanguageSelector().catch(console.error);