const puppeteer = require('puppeteer');

async function debugDOMUpdate() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    console.log('🔍 DOM Update Debug - Capture All Logs\n');

    // Capture all console messages, especially DOM update debug logs
    const logs = [];
    page.on('console', msg => {
        const message = msg.text();
        logs.push(message);

        // Show DOM update related logs immediately
        if (message.includes('[DOM Update Debug]') ||
            message.includes('[DOM Update Success]') ||
            message.includes('[DOM Update Error]') ||
            message.includes('testimonials.content.content.title')) {
            console.log(`🔍 ${message}`);
        }
    });

    await page.goto('http://localhost:3005/home.html?locale=ru', { waitUntil: 'networkidle2' });

    // Wait for all systems to complete
    await page.waitForTimeout(8000);

    console.log('\n📋 RELEVANT LOG ANALYSIS:');

    // Filter and show only relevant logs
    const relevantLogs = logs.filter(log =>
        log.includes('testimonials.content.content.title') ||
        log.includes('[DOM Update') ||
        log.includes('Translation Fallback') ||
        log.includes('Translation Missing')
    );

    relevantLogs.forEach(log => {
        if (log.includes('testimonials.content.content.title')) {
            console.log(`🎭 ${log}`);
        } else if (log.includes('[DOM Update')) {
            console.log(`🔧 ${log}`);
        } else if (log.includes('Translation Fallback')) {
            console.log(`📞 ${log}`);
        } else if (log.includes('Translation Missing')) {
            console.log(`❌ ${log}`);
        }
    });

    // Check final element state
    const finalState = await page.evaluate(() => {
        const element = document.querySelector('[data-i18n="testimonials.content.content.title"]');
        return {
            exists: !!element,
            text: element?.textContent,
            hasDataI18n: element?.hasAttribute('data-i18n'),
            tagName: element?.tagName
        };
    });

    console.log('\n🎭 Final Element State:');
    console.log(`  Exists: ${finalState.exists}`);
    console.log(`  Text: "${finalState.text}"`);
    console.log(`  Has data-i18n: ${finalState.hasDataI18n}`);
    console.log(`  Tag: ${finalState.tagName}`);

    await browser.close();
}

debugDOMUpdate().catch(console.error);