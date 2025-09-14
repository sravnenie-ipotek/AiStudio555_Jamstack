const { chromium } = require('playwright');

async function testMenuQuick() {
    console.log('⚡ Quick Menu Test');
    console.log('==================\n');

    const browser = await chromium.launch({ headless: false });

    // Test just a few pages quickly
    const testPages = [
        'http://localhost:3005/en/home.html',
        'http://localhost:3005/en/courses.html',
        'http://localhost:3005/he/home.html'
    ];

    for (const url of testPages) {
        const page = await browser.newPage();
        await page.setViewportSize({ width: 1920, height: 1080 });

        try {
            await page.goto(url, {
                waitUntil: 'domcontentloaded',
                timeout: 5000
            });

            // Wait for script to run
            await page.waitForTimeout(1000);

            // Check menu visibility
            const result = await page.evaluate(() => {
                const menu = document.querySelector('.nav-menu.w-nav-menu');
                const switcher = document.getElementById('language-switcher');

                if (menu) {
                    const computed = window.getComputedStyle(menu);
                    return {
                        menuDisplay: computed.display,
                        menuVisible: computed.display !== 'none',
                        hasSwitcher: !!switcher
                    };
                }
                return { menuDisplay: 'not found', menuVisible: false, hasSwitcher: false };
            });

            const status = result.menuVisible && result.hasSwitcher ? '✅' : '❌';
            console.log(`${url.split('/').slice(-2).join('/')} ${status} Menu: ${result.menuDisplay}, Switcher: ${result.hasSwitcher ? '✓' : '✗'}`);

        } catch (error) {
            console.log(`${url.split('/').slice(-2).join('/')} ❌ Error: ${error.message}`);
        }

        await page.close();
    }

    await browser.close();
    console.log('\n✅ Test complete');
}

testMenuQuick().catch(console.error);