const { chromium } = require('playwright');

async function testCoursesMenu() {
    console.log('🔍 Testing EN Courses Page Menu');
    console.log('================================\n');

    const browser = await chromium.launch({ headless: false, slowMo: 500 });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1920, height: 1080 });

    console.log('Loading: http://localhost:3005/en/courses.html');

    await page.goto('http://localhost:3005/en/courses.html', {
        waitUntil: 'domcontentloaded',
        timeout: 10000
    });

    // Wait for scripts to execute
    await page.waitForTimeout(2000);

    // Check menu details
    const menuStatus = await page.evaluate(() => {
        const menu = document.querySelector('.nav-menu.w-nav-menu');
        const switcher = document.getElementById('language-switcher');
        const select = document.getElementById('languageSelect');
        const navLinks = document.querySelectorAll('.nav-menu .nav-link');

        if (!menu) return { menuExists: false };

        const computed = window.getComputedStyle(menu);

        return {
            menuExists: true,
            menuVisible: computed.display !== 'none' && computed.visibility !== 'hidden',
            display: computed.display,
            visibility: computed.visibility,
            opacity: computed.opacity,
            hasSwitcher: !!switcher,
            switcherValue: select ? select.value : null,
            navLinksCount: navLinks.length,
            navLinksText: Array.from(navLinks).map(link => link.textContent.trim())
        };
    });

    console.log('\n📊 Menu Status:');
    console.log('---------------');
    console.log(`Menu exists: ${menuStatus.menuExists ? '✅ YES' : '❌ NO'}`);

    if (menuStatus.menuExists) {
        console.log(`Menu visible: ${menuStatus.menuVisible ? '✅ YES' : '❌ NO'}`);
        console.log(`Display: ${menuStatus.display}`);
        console.log(`Visibility: ${menuStatus.visibility}`);
        console.log(`Opacity: ${menuStatus.opacity}`);
        console.log(`\nLanguage Switcher: ${menuStatus.hasSwitcher ? '✅ EXISTS' : '❌ MISSING'}`);
        console.log(`Current Language: ${menuStatus.switcherValue || 'N/A'}`);
        console.log(`\nNavigation Links (${menuStatus.navLinksCount}):`);
        menuStatus.navLinksText.forEach(link => console.log(`  - ${link}`));
    }

    // Take screenshot
    await page.screenshot({
        path: '/Users/michaelmishayev/Desktop/newCode/en-courses-menu-check.png',
        fullPage: false
    });
    console.log('\n📸 Screenshot saved: en-courses-menu-check.png');

    // Keep browser open for visual inspection
    console.log('\n⏸️  Keeping browser open for 5 seconds...');
    await page.waitForTimeout(5000);

    await browser.close();

    console.log('\n================================');
    console.log(`RESULT: ${menuStatus.menuExists && menuStatus.menuVisible ? '✅ MENU IS VISIBLE' : '❌ MENU ISSUE DETECTED'}`);
    console.log('================================');
}

testCoursesMenu().catch(console.error);