/**
 * HEBREW TRANSLATION CHECK
 * Check why ?locale=he is not working
 */

const { chromium } = require('playwright');

async function hebrewTranslationCheck() {
    console.log('🔍 HEBREW TRANSLATION REGRESSION CHECK');
    console.log('====================================');
    console.log('Investigating why ?locale=he is not working...\n');

    const browser = await chromium.launch({
        headless: false,
        slowMo: 100
    });

    const context = await browser.newContext({
        viewport: { width: 1280, height: 720 }
    });

    // Monitor console messages
    const consoleMessages = [];

    console.log('🔍 Testing Hebrew translation with ?locale=he parameter...');
    const page = await context.newPage();

    page.on('console', msg => {
        consoleMessages.push({
            type: msg.type(),
            text: msg.text()
        });

        // Show relevant console messages immediately
        if (msg.text().includes('translation') || msg.text().includes('locale') ||
            msg.text().includes('he') || msg.text().includes('hebrew') ||
            msg.text().includes('RTL') || msg.type() === 'error') {
            console.log(`[CONSOLE ${msg.type().toUpperCase()}] ${msg.text()}`);
        }
    });

    // Test Hebrew with locale parameter
    await page.goto('http://localhost:3005/home.html?locale=he', {
        waitUntil: 'networkidle'
    });

    await page.waitForTimeout(3000);

    // Check what's happening with the language system
    const languageSystemCheck = await page.evaluate(() => {
        return {
            urlParams: window.location.search,
            urlHash: window.location.hash,
            documentDir: document.documentElement.getAttribute('dir'),
            documentLang: document.documentElement.lang,

            // Language Manager Status
            languageManagerLoaded: typeof window.languageManager !== 'undefined',
            currentLocale: window.languageManager?.currentLocale,
            translationData: window.languageManager?.translationData ?
                Object.keys(window.languageManager.translationData).length : 0,

            // RTL Detection
            rtlDetected: document.documentElement.getAttribute('dir') === 'rtl' ||
                        document.body.getAttribute('dir') === 'rtl' ||
                        document.documentElement.lang === 'he',

            // Check if simple awards animation RTL logic is active
            awardsStylesApplied: !!document.getElementById('simple-awards-styles'),

            // Sample text checks
            sampleTexts: {
                heroTitle: document.querySelector('[data-i18n*="hero"]')?.textContent?.substring(0, 50),
                heroSubtitle: document.querySelector('.hero-subtitle')?.textContent?.substring(0, 50),
                aboutTitle: document.querySelector('[data-i18n*="about"]')?.textContent?.substring(0, 50),
                testimonialsTitle: document.querySelector('.testimonials-title')?.textContent?.substring(0, 50)
            }
        };
    });

    console.log('\n📊 Language System Status:');
    console.log(`   URL Parameters: ${languageSystemCheck.urlParams}`);
    console.log(`   Document Dir: ${languageSystemCheck.documentDir || 'not set'}`);
    console.log(`   Document Lang: ${languageSystemCheck.documentLang || 'not set'}`);
    console.log(`   Language Manager: ${languageSystemCheck.languageManagerLoaded ? '✅ Loaded' : '❌ Not loaded'}`);
    console.log(`   Current Locale: ${languageSystemCheck.currentLocale || 'not set'}`);
    console.log(`   Translation Keys: ${languageSystemCheck.translationData}`);
    console.log(`   RTL Detected: ${languageSystemCheck.rtlDetected ? '✅ Yes' : '❌ No'}`);

    console.log('\n📝 Sample Text Check:');
    console.log(`   Hero Title: "${languageSystemCheck.sampleTexts.heroTitle}"`);
    console.log(`   Hero Subtitle: "${languageSystemCheck.sampleTexts.heroSubtitle}"`);
    console.log(`   About Title: "${languageSystemCheck.sampleTexts.aboutTitle}"`);
    console.log(`   Testimonial Title: "${languageSystemCheck.sampleTexts.testimonialsTitle}"`);

    // Check if Hebrew characters are present
    const hasHebrew = {
        hero: /[\u0590-\u05FF]/.test(languageSystemCheck.sampleTexts.heroTitle || ''),
        about: /[\u0590-\u05FF]/.test(languageSystemCheck.sampleTexts.aboutTitle || ''),
        testimonials: /[\u0590-\u05FF]/.test(languageSystemCheck.sampleTexts.testimonialsTitle || '')
    };

    console.log('\n🔤 Hebrew Characters Detected:');
    console.log(`   Hero: ${hasHebrew.hero ? '✅ Hebrew found' : '❌ No Hebrew'}`);
    console.log(`   About: ${hasHebrew.about ? '✅ Hebrew found' : '❌ No Hebrew'}`);
    console.log(`   Testimonials: ${hasHebrew.testimonials ? '✅ Hebrew found' : '❌ No Hebrew'}`);

    // Try manual language switching
    console.log('\n🔄 Testing manual language switching...');

    // Look for language pills/switcher
    const languageSwitcher = await page.evaluate(() => {
        const pills = document.querySelectorAll('.lang-pill');
        const hePill = Array.from(pills).find(pill =>
            pill.textContent.trim().toLowerCase().includes('he') ||
            pill.textContent.trim().toLowerCase().includes('עב')
        );

        if (hePill) {
            hePill.click();
            return { found: true, clicked: true };
        }

        return { found: false, pillsCount: pills.length };
    });

    console.log(`   Language pills: ${languageSwitcher.found ? 'Found and clicked Hebrew' : `${languageSwitcher.pillsCount} pills found, no Hebrew pill`}`);

    if (languageSwitcher.found) {
        await page.waitForTimeout(2000);

        // Check if switching worked
        const afterSwitch = await page.evaluate(() => ({
            currentLocale: window.languageManager?.currentLocale,
            documentDir: document.documentElement.getAttribute('dir'),
            heroTitle: document.querySelector('[data-i18n*="hero"]')?.textContent?.substring(0, 50)
        }));

        console.log(`   After switch - Locale: ${afterSwitch.currentLocale}, Dir: ${afterSwitch.documentDir}`);
        console.log(`   Hero title now: "${afterSwitch.heroTitle}"`);
    }

    // Test direct Hebrew URL
    console.log('\n🌐 Testing direct Hebrew URL...');
    try {
        await page.goto('http://localhost:3005/dist/he/home.html', { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);

        const hebrewPageCheck = await page.evaluate(() => ({
            url: window.location.href,
            documentDir: document.documentElement.getAttribute('dir'),
            documentLang: document.documentElement.lang,
            heroTitle: document.querySelector('h1, .hero-title, [data-i18n*="hero"]')?.textContent?.substring(0, 50),
            hasHebrewChars: /[\u0590-\u05FF]/.test(document.body.textContent)
        }));

        console.log(`   Hebrew page URL: ${hebrewPageCheck.url}`);
        console.log(`   Document Dir: ${hebrewPageCheck.documentDir}`);
        console.log(`   Document Lang: ${hebrewPageCheck.documentLang}`);
        console.log(`   Hero title: "${hebrewPageCheck.heroTitle}"`);
        console.log(`   Has Hebrew chars: ${hebrewPageCheck.hasHebrewChars ? '✅ Yes' : '❌ No'}`);

    } catch (error) {
        console.log(`   ❌ Hebrew page not accessible: ${error.message}`);
    }

    // Analysis
    console.log('\n');
    console.log('=' .repeat(60));
    console.log('🧠 ULTRATHINK ANALYSIS');
    console.log('=' .repeat(60));

    const issues = [];

    if (!languageSystemCheck.languageManagerLoaded) {
        issues.push('❌ Language Manager not loaded - unified-language-manager.js issue');
    }

    if (languageSystemCheck.urlParams.includes('locale=he') && languageSystemCheck.currentLocale !== 'he') {
        issues.push('❌ URL parameter ?locale=he not processed by language manager');
    }

    if (!hasHebrew.hero && !hasHebrew.about) {
        issues.push('❌ No Hebrew text visible - translation not applied');
    }

    if (!languageSystemCheck.rtlDetected) {
        issues.push('❌ RTL not detected - direction not set to right-to-left');
    }

    if (issues.length === 0) {
        console.log('✅ Hebrew translation working correctly!');
    } else {
        console.log('❌ HEBREW TRANSLATION REGRESSION FOUND:');
        issues.forEach(issue => {
            console.log(`  ${issue}`);
        });

        console.log('\n💡 ROOT CAUSE ANALYSIS:');
        console.log('The ?locale=he parameter is not being processed by the translation system.');
        console.log('This could be due to:');
        console.log('1. unified-language-manager.js not detecting URL parameters');
        console.log('2. Hebrew translation data not loaded');
        console.log('3. RTL logic interfering with translation application');
        console.log('4. Recent changes to awards animation affecting language detection');

        console.log('\n🔧 RECOMMENDED FIX:');
        console.log('1. Check unified-language-manager.js URL parameter parsing');
        console.log('2. Verify Hebrew translation data in API');
        console.log('3. Ensure RTL detection works with language switching');
        console.log('4. Test if awards animation RTL logic affects other components');
    }

    // Show recent console messages
    if (consoleMessages.length > 0) {
        console.log('\n📋 All Console Messages:');
        consoleMessages.forEach((msg, index) => {
            if (index < 10) { // Show first 10
                console.log(`   ${msg.type}: ${msg.text.substring(0, 100)}${msg.text.length > 100 ? '...' : ''}`);
            }
        });
        if (consoleMessages.length > 10) {
            console.log(`   ... and ${consoleMessages.length - 10} more messages`);
        }
    }

    await browser.close();
    return { languageSystemCheck, issues, hasHebrew };
}

// Run if executed directly
if (require.main === module) {
    hebrewTranslationCheck()
        .then(result => {
            console.log('\n✅ Hebrew translation check complete!');
            if (result.issues.length === 0) {
                console.log('🎉 Hebrew translation working perfectly!');
            } else {
                console.log(`⚠️ Found ${result.issues.length} issues to resolve`);
            }
        })
        .catch(error => {
            console.error('❌ Check failed:', error);
            process.exit(1);
        });
}

module.exports = hebrewTranslationCheck;