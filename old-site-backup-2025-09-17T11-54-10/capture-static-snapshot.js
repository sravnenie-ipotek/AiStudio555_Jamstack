const { chromium } = require('playwright');

async function captureSnapshot() {
    console.log('📸 Taking snapshot of static home.html...');

    const browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage({
        viewport: { width: 1920, height: 1080 }
    });

    await page.goto('http://localhost:8082/nd/home.html', {
        waitUntil: 'domcontentloaded',
        timeout: 10000
    });

    // Quick screenshot
    await page.screenshot({
        path: 'nd-static-before.png',
        fullPage: false
    });

    console.log('✅ Screenshot saved: nd-static-before.png');

    await browser.close();
}

captureSnapshot().catch(console.error);