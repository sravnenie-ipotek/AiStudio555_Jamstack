/**
 * DEEP TRANSLATION GAP DIAGNOSIS
 * Systematic investigation of why production has less translation coverage than local
 */

const { chromium } = require('playwright');
const fetch = require('node-fetch');

async function diagnoseTranslationGap() {
    console.log('🔍 DEEP TRANSLATION GAP DIAGNOSIS');
    console.log('==================================');
    console.log('Investigating why production has less translation coverage than local...\\n');

    const browser = await chromium.launch({
        headless: false,
        slowMo: 100
    });

    const context = await browser.newContext({
        viewport: { width: 1280, height: 720 }
    });

    // STEP 1: Compare API responses in detail
    console.log('📊 STEP 1: Detailed API Response Comparison');
    console.log('-'.repeat(50));

    const apiComparison = {};
    const locales = ['ru', 'en', 'he'];

    for (const locale of locales) {
        console.log(`\\nAnalyzing ${locale.toUpperCase()} locale...`);

        try {
            // Local API
            const localResponse = await fetch(`http://localhost:3000/api/nd/home-page?locale=${locale}`);
            const localData = await localResponse.json();

            // Production API
            const prodResponse = await fetch(`https://aistudio555jamstack-production.up.railway.app/api/nd/home-page?locale=${locale}`);
            const prodData = await prodResponse.json();

            apiComparison[locale] = {
                local: {
                    success: localData.success,
                    sectionsCount: localData.data ? Object.keys(localData.data).length : 0,
                    sections: localData.data ? Object.keys(localData.data) : [],
                    sampleContent: {}
                },
                production: {
                    success: prodData.success,
                    sectionsCount: prodData.data ? Object.keys(prodData.data).length : 0,
                    sections: prodData.data ? Object.keys(prodData.data) : [],
                    sampleContent: {}
                }
            };

            // Sample key content for comparison
            const keyToCheck = ['hero', 'features', 'pricing', 'testimonials'];
            for (const key of keyToCheck) {
                if (localData.data?.[key]) {
                    apiComparison[locale].local.sampleContent[key] = {
                        hasContent: !!localData.data[key].content,
                        hasTitle: !!localData.data[key].content?.title,
                        titlePreview: localData.data[key].content?.title?.substring(0, 50) || 'No title'
                    };
                }
                if (prodData.data?.[key]) {
                    apiComparison[locale].production.sampleContent[key] = {
                        hasContent: !!prodData.data[key].content,
                        hasTitle: !!prodData.data[key].content?.title,
                        titlePreview: prodData.data[key].content?.title?.substring(0, 50) || 'No title'
                    };
                }
            }

            console.log(`  Local: ${apiComparison[locale].local.sectionsCount} sections`);
            console.log(`  Prod: ${apiComparison[locale].production.sectionsCount} sections`);
            console.log(`  Match: ${apiComparison[locale].local.sectionsCount === apiComparison[locale].production.sectionsCount ? '✅' : '❌'}`);
        } catch (error) {
            console.error(`  ❌ Error comparing ${locale}:`, error.message);
        }
    }

    // STEP 2: Browser-level translation analysis
    console.log('\\n🌐 STEP 2: Browser Translation Mechanism Analysis');
    console.log('-'.repeat(50));

    const translationAnalysis = {
        local: {},
        production: {}
    };

    // Test LOCAL
    console.log('\\nTesting LOCAL translation mechanism...');
    const localPage = await context.newPage();

    // Capture console messages
    const localConsoleMessages = [];
    localPage.on('console', msg => {
        localConsoleMessages.push({
            type: msg.type(),
            text: msg.text(),
            timestamp: Date.now()
        });
    });

    await localPage.goto('http://localhost:3005/home.html', {
        waitUntil: 'networkidle'
    });

    // Wait for page to load completely
    await localPage.waitForTimeout(3000);

    // Switch to Russian
    await localPage.evaluate(() => {
        const ruPill = document.querySelector('.lang-pill:nth-child(2)');
        if (ruPill) {
            console.log('Clicking Russian pill...');
            ruPill.click();
        }
    });

    await localPage.waitForTimeout(5000); // Give more time for translation

    translationAnalysis.local = await localPage.evaluate(() => {
        const results = {
            scriptLoading: {
                unifiedManagerExists: typeof window.languageManager !== 'undefined',
                i18nextExists: typeof window.i18next !== 'undefined',
                currentLocale: window.languageManager?.currentLocale || 'unknown',
                translationDataKeys: window.languageManager?.translationData ? Object.keys(window.languageManager.translationData).length : 0
            },
            domAnalysis: {
                totalElements: document.querySelectorAll('[data-i18n]').length,
                russianElements: 0,
                englishElements: 0,
                sampleTranslations: []
            },
            apiDataCheck: {
                hasApiData: typeof window.apiData !== 'undefined',
                sections: window.apiData ? Object.keys(window.apiData).length : 0
            }
        };

        // Analyze translation coverage
        const elements = document.querySelectorAll('[data-i18n]');
        Array.from(elements).forEach(el => {
            const text = el.textContent.trim();
            const hasRussian = /[а-яА-Я]/.test(text);

            if (hasRussian) {
                results.domAnalysis.russianElements++;
                if (results.domAnalysis.sampleTranslations.length < 10) {
                    results.domAnalysis.sampleTranslations.push({
                        key: el.dataset.i18n,
                        text: text.substring(0, 50)
                    });
                }
            } else {
                results.domAnalysis.englishElements++;
            }
        });

        results.domAnalysis.translationPercentage = Math.round(
            (results.domAnalysis.russianElements / results.domAnalysis.totalElements) * 100
        );

        return results;
    });

    await localPage.close();

    // Test PRODUCTION
    console.log('\\nTesting PRODUCTION translation mechanism...');
    const prodPage = await context.newPage();

    const prodConsoleMessages = [];
    prodPage.on('console', msg => {
        prodConsoleMessages.push({
            type: msg.type(),
            text: msg.text(),
            timestamp: Date.now()
        });
    });

    await prodPage.goto('https://www.aistudio555.com/ru/?locale=ru', {
        waitUntil: 'networkidle'
    });

    await prodPage.waitForTimeout(5000);

    translationAnalysis.production = await prodPage.evaluate(() => {
        const results = {
            scriptLoading: {
                unifiedManagerExists: typeof window.languageManager !== 'undefined',
                i18nextExists: typeof window.i18next !== 'undefined',
                currentLocale: window.languageManager?.currentLocale || 'unknown',
                translationDataKeys: window.languageManager?.translationData ? Object.keys(window.languageManager.translationData).length : 0
            },
            domAnalysis: {
                totalElements: document.querySelectorAll('[data-i18n]').length,
                russianElements: 0,
                englishElements: 0,
                sampleTranslations: []
            },
            apiDataCheck: {
                hasApiData: typeof window.apiData !== 'undefined',
                sections: window.apiData ? Object.keys(window.apiData).length : 0
            }
        };

        // Analyze translation coverage
        const elements = document.querySelectorAll('[data-i18n]');
        Array.from(elements).forEach(el => {
            const text = el.textContent.trim();
            const hasRussian = /[а-яА-Я]/.test(text);

            if (hasRussian) {
                results.domAnalysis.russianElements++;
                if (results.domAnalysis.sampleTranslations.length < 10) {
                    results.domAnalysis.sampleTranslations.push({
                        key: el.dataset.i18n,
                        text: text.substring(0, 50)
                    });
                }
            } else {
                results.domAnalysis.englishElements++;
            }
        });

        results.domAnalysis.translationPercentage = Math.round(
            (results.domAnalysis.russianElements / results.domAnalysis.totalElements) * 100
        );

        return results;
    });

    await prodPage.close();
    await browser.close();

    // STEP 3: Detailed Comparison Report
    console.log('\\n');
    console.log('=' .repeat(80));
    console.log('🧠 ULTRATHINK ANALYSIS RESULTS');
    console.log('=' .repeat(80));

    console.log('\\n📊 API DATA COMPARISON');
    console.log('-'.repeat(50));
    for (const locale of locales) {
        if (apiComparison[locale]) {
            console.log(`\\n${locale.toUpperCase()} Locale:`);
            console.log(`  Sections: Local ${apiComparison[locale].local.sectionsCount} | Prod ${apiComparison[locale].production.sectionsCount}`);

            // Check for content differences
            const localSections = new Set(apiComparison[locale].local.sections);
            const prodSections = new Set(apiComparison[locale].production.sections);

            const onlyLocal = [...localSections].filter(s => !prodSections.has(s));
            const onlyProd = [...prodSections].filter(s => !localSections.has(s));

            if (onlyLocal.length > 0) {
                console.log(`  ❌ Only in Local: ${onlyLocal.join(', ')}`);
            }
            if (onlyProd.length > 0) {
                console.log(`  ❌ Only in Prod: ${onlyProd.join(', ')}`);
            }
            if (onlyLocal.length === 0 && onlyProd.length === 0) {
                console.log(`  ✅ Sections match perfectly`);
            }
        }
    }

    console.log('\\n🌐 BROWSER TRANSLATION ANALYSIS');
    console.log('-'.repeat(50));

    console.log('\\nLOCAL Environment:');
    console.log(`  Total elements: ${translationAnalysis.local.domAnalysis.totalElements}`);
    console.log(`  Russian elements: ${translationAnalysis.local.domAnalysis.russianElements}`);
    console.log(`  Translation coverage: ${translationAnalysis.local.domAnalysis.translationPercentage}%`);
    console.log(`  Script status: Manager ${translationAnalysis.local.scriptLoading.unifiedManagerExists ? '✅' : '❌'} | i18next ${translationAnalysis.local.scriptLoading.i18nextExists ? '✅' : '❌'}`);
    console.log(`  Current locale: ${translationAnalysis.local.scriptLoading.currentLocale}`);
    console.log(`  Translation keys: ${translationAnalysis.local.scriptLoading.translationDataKeys}`);

    console.log('\\nPRODUCTION Environment:');
    console.log(`  Total elements: ${translationAnalysis.production.domAnalysis.totalElements}`);
    console.log(`  Russian elements: ${translationAnalysis.production.domAnalysis.russianElements}`);
    console.log(`  Translation coverage: ${translationAnalysis.production.domAnalysis.translationPercentage}%`);
    console.log(`  Script status: Manager ${translationAnalysis.production.scriptLoading.unifiedManagerExists ? '✅' : '❌'} | i18next ${translationAnalysis.production.scriptLoading.i18nextExists ? '✅' : '❌'}`);
    console.log(`  Current locale: ${translationAnalysis.production.scriptLoading.currentLocale}`);
    console.log(`  Translation keys: ${translationAnalysis.production.scriptLoading.translationDataKeys}`);

    // STEP 4: Root Cause Analysis
    console.log('\\n');
    console.log('=' .repeat(80));
    console.log('🎯 ROOT CAUSE ANALYSIS');
    console.log('=' .repeat(80));

    const issues = [];

    // Compare translation coverage
    const coverageDiff = translationAnalysis.local.domAnalysis.translationPercentage - translationAnalysis.production.domAnalysis.translationPercentage;
    if (coverageDiff > 10) {
        issues.push(`❌ MAJOR: Translation coverage gap of ${coverageDiff}%`);
    }

    // Compare script loading
    if (translationAnalysis.local.scriptLoading.unifiedManagerExists && !translationAnalysis.production.scriptLoading.unifiedManagerExists) {
        issues.push('❌ CRITICAL: Unified Language Manager not loaded on production');
    }

    // Compare translation data keys
    const keysDiff = translationAnalysis.local.scriptLoading.translationDataKeys - translationAnalysis.production.scriptLoading.translationDataKeys;
    if (keysDiff > 0) {
        issues.push(`❌ Translation data keys: Local has ${keysDiff} more keys than production`);
    }

    // Compare DOM elements
    const elementsDiff = translationAnalysis.local.domAnalysis.totalElements - translationAnalysis.production.domAnalysis.totalElements;
    if (Math.abs(elementsDiff) > 0) {
        issues.push(`❌ DOM structure differs: ${elementsDiff} element difference`);
    }

    if (issues.length === 0) {
        console.log('✅ No major issues detected. The environments are technically similar.');
        console.log('   Translation coverage difference may be due to timing or data mapping.');
    } else {
        console.log('❌ ISSUES IDENTIFIED:');
        issues.forEach(issue => console.log(`  ${issue}`));
    }

    // Console message analysis
    console.log('\\n📝 CONSOLE MESSAGE ANALYSIS');
    console.log('-'.repeat(50));

    console.log(`\\nLocal console messages: ${localConsoleMessages.length}`);
    const localErrors = localConsoleMessages.filter(m => m.type === 'error');
    if (localErrors.length > 0) {
        console.log('  Errors:');
        localErrors.forEach(err => console.log(`    ${err.text}`));
    }

    console.log(`\\nProduction console messages: ${prodConsoleMessages.length}`);
    const prodErrors = prodConsoleMessages.filter(m => m.type === 'error');
    if (prodErrors.length > 0) {
        console.log('  Errors:');
        prodErrors.forEach(err => console.log(`    ${err.text}`));
    }

    console.log('\\n💡 RECOMMENDED ACTIONS:');
    if (coverageDiff > 10) {
        console.log('1. 🔧 Check translation data synchronization between environments');
        console.log('2. 🔧 Verify unified-language-manager.js loading correctly on production');
        console.log('3. 🔧 Compare API responses for missing translation mappings');
    }
    if (translationAnalysis.production.scriptLoading.translationDataKeys < translationAnalysis.local.scriptLoading.translationDataKeys) {
        console.log('4. 🔧 Investigate why production has fewer translation keys available');
    }

    return {
        apiComparison,
        translationAnalysis,
        coverageDiff,
        issues,
        consoleMessages: {
            local: localConsoleMessages,
            production: prodConsoleMessages
        }
    };
}

// Run if executed directly
if (require.main === module) {
    diagnoseTranslationGap()
        .then(result => {
            console.log('\\n✅ Deep translation gap diagnosis complete!');
            console.log(`Coverage difference: ${result.coverageDiff}%`);
            console.log(`Issues found: ${result.issues.length}`);
        })
        .catch(error => {
            console.error('❌ Diagnosis failed:', error);
            process.exit(1);
        });
}

module.exports = diagnoseTranslationGap;