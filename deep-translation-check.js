/**
 * DEEP TRANSLATION CHECK
 * Analyze why UI translation differs despite same API data
 */

const fetch = require('node-fetch');
const { chromium } = require('playwright');

async function deepTranslationCheck() {
    console.log('🔍 DEEP TRANSLATION CHECK');
    console.log('=========================');
    console.log('Analyzing why UI translation differs despite same API data...\n');

    // First, check API content structure
    console.log('📊 STEP 1: Comparing API Content Structure');
    console.log('-'.repeat(50));

    const apiChecks = [
        { locale: 'ru', section: 'pricing', field: 'content.title' },
        { locale: 'ru', section: 'faq', field: 'content.title' },
        { locale: 'ru', section: 'testimonials', field: 'content' },
        { locale: 'ru', section: 'process', field: 'content.title' },
        { locale: 'ru', section: 'awards', field: 'content' }
    ];

    for (const check of apiChecks) {
        console.log(`\nChecking ${check.section}.${check.field} in ${check.locale.toUpperCase()}:`);

        try {
            // Local API
            const localResponse = await fetch(`http://localhost:3000/api/nd/home-page?locale=${check.locale}`);
            const localData = await localResponse.json();

            // Production API
            const prodResponse = await fetch(`https://aistudio555jamstack-production.up.railway.app/api/nd/home-page?locale=${check.locale}`);
            const prodData = await prodResponse.json();

            // Navigate to the field
            const fieldPath = check.field.split('.');
            let localValue = localData.data?.[check.section];
            let prodValue = prodData.data?.[check.section];

            for (const path of fieldPath) {
                localValue = localValue?.[path];
                prodValue = prodValue?.[path];
            }

            console.log(`  Local: ${localValue ? (typeof localValue === 'string' ? localValue.substring(0, 50) : 'Object with ' + Object.keys(localValue).length + ' keys') : 'MISSING'}`);
            console.log(`  Prod:  ${prodValue ? (typeof prodValue === 'string' ? prodValue.substring(0, 50) : 'Object with ' + Object.keys(prodValue).length + ' keys') : 'MISSING'}`);

            if (JSON.stringify(localValue) === JSON.stringify(prodValue)) {
                console.log(`  Status: ✅ MATCH`);
            } else {
                console.log(`  Status: ❌ DIFFERENT`);
                if (localValue && !prodValue) {
                    console.log(`  Issue: Content exists in local but missing in production`);
                } else if (!localValue && prodValue) {
                    console.log(`  Issue: Content exists in production but missing in local`);
                } else {
                    console.log(`  Issue: Content structure differs`);
                }
            }
        } catch (error) {
            console.error(`  Error: ${error.message}`);
        }
    }

    // Check browser console for translation errors
    console.log('\n📱 STEP 2: Checking Browser Console for Translation Errors');
    console.log('-'.repeat(50));

    const browser = await chromium.launch({
        headless: false,
        slowMo: 100
    });

    const context = await browser.newContext({
        viewport: { width: 1280, height: 720 }
    });

    // Monitor console messages
    const consoleMessages = {
        local: [],
        production: []
    };

    // Test local
    console.log('\nTesting LOCAL translation mechanism...');
    const localPage = await context.newPage();

    localPage.on('console', msg => {
        if (msg.type() === 'error' || msg.text().includes('translation') || msg.text().includes('i18n')) {
            consoleMessages.local.push({
                type: msg.type(),
                text: msg.text()
            });
        }
    });

    await localPage.goto('http://localhost:3005/home.html?locale=ru', {
        waitUntil: 'networkidle'
    });

    // Switch language via pills
    await localPage.evaluate(() => {
        const ruPill = document.querySelector('.lang-pill:nth-child(2)');
        if (ruPill) ruPill.click();
    });

    await localPage.waitForTimeout(3000);

    // Check if unified-language-manager is loaded
    const localScriptCheck = await localPage.evaluate(() => {
        return {
            unifiedManagerLoaded: typeof window.languageManager !== 'undefined',
            i18nextLoaded: typeof window.i18next !== 'undefined',
            currentLocale: window.languageManager?.currentLocale,
            translationKeys: window.languageManager?.translationData ? Object.keys(window.languageManager.translationData).length : 0
        };
    });

    console.log('Local script status:', localScriptCheck);

    // Test production
    console.log('\nTesting PRODUCTION translation mechanism...');
    const prodPage = await context.newPage();

    prodPage.on('console', msg => {
        if (msg.type() === 'error' || msg.text().includes('translation') || msg.text().includes('i18n')) {
            consoleMessages.production.push({
                type: msg.type(),
                text: msg.text()
            });
        }
    });

    await prodPage.goto('https://www.aistudio555.com/ru/?locale=ru', {
        waitUntil: 'networkidle'
    });

    // Check if unified-language-manager is loaded
    const prodScriptCheck = await prodPage.evaluate(() => {
        return {
            unifiedManagerLoaded: typeof window.languageManager !== 'undefined',
            i18nextLoaded: typeof window.i18next !== 'undefined',
            currentLocale: window.languageManager?.currentLocale,
            translationKeys: window.languageManager?.translationData ? Object.keys(window.languageManager.translationData).length : 0
        };
    });

    console.log('Production script status:', prodScriptCheck);

    // Check specific translation application
    console.log('\n🔧 STEP 3: Checking Translation Application');
    console.log('-'.repeat(50));

    // Check if translations are actually being applied
    const localTranslationCheck = await localPage.evaluate(() => {
        const results = {};

        // Check specific elements
        const checks = [
            'hero.title',
            'hero.subtitle',
            'features.title',
            'pricing.title',
            'faq.title',
            'testimonials.title'
        ];

        for (const key of checks) {
            const element = document.querySelector(`[data-i18n="${key}"]`);
            if (element) {
                results[key] = {
                    exists: true,
                    text: element.textContent.trim().substring(0, 50),
                    hasRussian: /[а-яА-Я]/.test(element.textContent)
                };
            } else {
                results[key] = { exists: false };
            }
        }

        return results;
    });

    const prodTranslationCheck = await prodPage.evaluate(() => {
        const results = {};

        // Check specific elements
        const checks = [
            'hero.title',
            'hero.subtitle',
            'features.title',
            'pricing.title',
            'faq.title',
            'testimonials.title'
        ];

        for (const key of checks) {
            const element = document.querySelector(`[data-i18n="${key}"]`);
            if (element) {
                results[key] = {
                    exists: true,
                    text: element.textContent.trim().substring(0, 50),
                    hasRussian: /[а-яА-Я]/.test(element.textContent)
                };
            } else {
                results[key] = { exists: false };
            }
        }

        return results;
    });

    console.log('\nLocal Translation Application:');
    for (const [key, value] of Object.entries(localTranslationCheck)) {
        if (value.exists) {
            console.log(`  ${key}: ${value.hasRussian ? '✅ Translated' : '❌ Not translated'} - "${value.text}"`);
        } else {
            console.log(`  ${key}: ⚠️ Element not found`);
        }
    }

    console.log('\nProduction Translation Application:');
    for (const [key, value] of Object.entries(prodTranslationCheck)) {
        if (value.exists) {
            console.log(`  ${key}: ${value.hasRussian ? '✅ Translated' : '❌ Not translated'} - "${value.text}"`);
        } else {
            console.log(`  ${key}: ⚠️ Element not found`);
        }
    }

    // Console errors
    if (consoleMessages.local.length > 0) {
        console.log('\n⚠️ Local Console Messages:');
        consoleMessages.local.forEach(msg => {
            console.log(`  ${msg.type}: ${msg.text}`);
        });
    }

    if (consoleMessages.production.length > 0) {
        console.log('\n⚠️ Production Console Messages:');
        consoleMessages.production.forEach(msg => {
            console.log(`  ${msg.type}: ${msg.text}`);
        });
    }

    await browser.close();

    // Final analysis
    console.log('\n');
    console.log('=' .repeat(60));
    console.log('🧠 ULTRATHINK ANALYSIS');
    console.log('=' .repeat(60));

    const issues = [];

    // Check script loading
    if (localScriptCheck.unifiedManagerLoaded && !prodScriptCheck.unifiedManagerLoaded) {
        issues.push('❌ Unified Language Manager not loaded on production');
    }
    if (localScriptCheck.translationKeys > prodScriptCheck.translationKeys) {
        issues.push(`❌ Production has fewer translation keys (${prodScriptCheck.translationKeys} vs ${localScriptCheck.translationKeys})`);
    }

    // Check translation application
    let localTranslated = 0;
    let prodTranslated = 0;

    for (const value of Object.values(localTranslationCheck)) {
        if (value.exists && value.hasRussian) localTranslated++;
    }
    for (const value of Object.values(prodTranslationCheck)) {
        if (value.exists && value.hasRussian) prodTranslated++;
    }

    if (localTranslated > prodTranslated) {
        issues.push(`❌ Production translating fewer elements (${prodTranslated} vs ${localTranslated})`);
    }

    if (issues.length === 0) {
        console.log('✅ Translation mechanism working identically in both environments');
    } else {
        console.log('❌ ISSUES FOUND:');
        issues.forEach(issue => {
            console.log(`  ${issue}`);
        });

        console.log('\n💡 ROOT CAUSE ANALYSIS:');
        console.log('The API has the same 26 sections, but the translation application differs.');
        console.log('This suggests the JavaScript translation mechanism is not fully utilizing');
        console.log('the available API data on production.');

        console.log('\n🔧 RECOMMENDED FIX:');
        console.log('1. Ensure unified-language-manager.js is properly loaded on production');
        console.log('2. Check that the translation data mapping is complete');
        console.log('3. Verify that all data-i18n keys match between API and HTML');
        console.log('4. Consider re-deploying the frontend assets');
    }

    return {
        localScriptCheck,
        prodScriptCheck,
        localTranslated,
        prodTranslated,
        issues
    };
}

// Run if executed directly
if (require.main === module) {
    deepTranslationCheck()
        .then(result => {
            console.log('\n✅ Deep translation check complete!');
            if (result.issues.length === 0) {
                console.log('🎉 Translation mechanism working perfectly!');
            } else {
                console.log(`⚠️ Found ${result.issues.length} issues to resolve`);
            }
        })
        .catch(error => {
            console.error('❌ Check failed:', error);
            process.exit(1);
        });
}

module.exports = deepTranslationCheck;