const puppeteer = require('puppeteer');

async function debugScriptOrder() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    console.log('🔍 Script Loading Order Debug\n');

    // Capture all console messages to see execution order
    const logs = [];
    page.on('console', msg => {
        const message = msg.text();
        logs.push({
            time: new Date().toISOString(),
            message: message
        });

        // Show key messages immediately
        if (message.includes('Enhanced Version 3.0 Initializing') ||
            message.includes('Starting home integration') ||
            message.includes('Loading content for locale') ||
            message.includes('Delayed start time')) {
            console.log(`[${new Date().toISOString()}] ${message}`);
        }
    });

    await page.goto('http://localhost:3005/home.html?locale=ru', { waitUntil: 'networkidle2' });

    // Wait for both systems to complete
    await page.waitForTimeout(8000);

    console.log('\n📋 EXECUTION ORDER ANALYSIS:');

    const languageManagerStart = logs.find(l => l.message.includes('Enhanced Version 3.0 Initializing'));
    const integrationStart = logs.find(l => l.message.includes('Starting home integration'));
    const languageContentLoad = logs.find(l => l.message.includes('Loading content for locale'));

    if (languageManagerStart) {
        console.log(`✅ Language Manager Started: ${languageManagerStart.time}`);
    } else {
        console.log('❌ Language Manager Start not detected');
    }

    if (integrationStart) {
        console.log(`✅ Integration Script Started: ${integrationStart.time}`);
    } else {
        console.log('❌ Integration Script Start not detected');
    }

    if (languageContentLoad) {
        console.log(`✅ Language Content Load: ${languageContentLoad.time}`);
    }

    // Check current state of testimonials title
    const testimonialsState = await page.evaluate(() => {
        const titleEl = document.querySelector('.testimonials .section-title');
        return {
            text: titleEl?.textContent?.trim(),
            hasDataI18n: titleEl?.hasAttribute('data-i18n'),
            dataI18nValue: titleEl?.getAttribute('data-i18n')
        };
    });

    console.log('\n🎭 Testimonials Title Final State:');
    console.log(`  Text: "${testimonialsState.text}"`);
    console.log(`  Has data-i18n: ${testimonialsState.hasDataI18n}`);
    console.log(`  data-i18n value: ${testimonialsState.dataI18nValue}`);

    // Check if cache busting worked
    const scripts = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('script[src]')).map(script => script.src);
    });

    console.log('\n📦 Loaded Scripts:');
    scripts.forEach(src => {
        if (src.includes('unified-language-manager') || src.includes('nd-home-integration')) {
            console.log(`  ${src}`);
        }
    });

    await browser.close();
}

debugScriptOrder().catch(console.error);