/**
 * ULTRATHINK PRODUCTION DIAGNOSTIC
 * Deep analysis of why production language switching might not be working
 * despite test results showing success
 */

const { chromium } = require('playwright');

async function ultrathinkProductionDiagnostic() {
    console.log('🧠 ULTRATHINK PRODUCTION DIAGNOSTIC...');
    console.log('=====================================');

    const browser = await chromium.launch({
        headless: false,
        slowMo: 1000
    });

    const context = await browser.newContext({
        viewport: { width: 1280, height: 720 }
    });

    const page = await context.newPage();

    const diagnostics = {
        networkRequests: [],
        consoleErrors: [],
        consoleWarnings: [],
        consoleLogs: [],
        failedRequests: [],
        apiCalls: [],
        cssLoads: [],
        jsLoads: [],
        domMutations: [],
        languageSwitchAttempts: []
    };

    // Comprehensive network monitoring
    page.on('request', request => {
        diagnostics.networkRequests.push({
            url: request.url(),
            method: request.method(),
            timestamp: Date.now()
        });
    });

    page.on('response', response => {
        const url = response.url();
        const status = response.status();

        if (url.includes('.css')) {
            diagnostics.cssLoads.push({ url, status, timestamp: Date.now() });
        }

        if (url.includes('.js')) {
            diagnostics.jsLoads.push({ url, status, timestamp: Date.now() });
        }

        if (url.includes('/api/')) {
            diagnostics.apiCalls.push({ url, status, timestamp: Date.now() });
        }

        if (status >= 400) {
            diagnostics.failedRequests.push({ url, status, timestamp: Date.now() });
        }
    });

    page.on('requestfailed', request => {
        diagnostics.failedRequests.push({
            url: request.url(),
            failure: request.failure(),
            timestamp: Date.now()
        });
    });

    // Console monitoring
    page.on('console', msg => {
        const text = msg.text();
        const type = msg.type();

        if (type === 'error') {
            diagnostics.consoleErrors.push({ text, timestamp: Date.now() });
        } else if (type === 'warning') {
            diagnostics.consoleWarnings.push({ text, timestamp: Date.now() });
        } else if (type === 'log') {
            diagnostics.consoleLogs.push({ text, timestamp: Date.now() });
        }
    });

    try {
        console.log('\n🌐 Testing Production URL: https://www.aistudio555.com/en/');
        await page.goto('https://www.aistudio555.com/en/', {
            waitUntil: 'networkidle',
            timeout: 30000
        });

        await page.waitForTimeout(5000);

        // Check current language state
        const initialState = await page.evaluate(() => {
            return {
                currentLang: localStorage.getItem('selectedLanguage') || 'unknown',
                pills: Array.from(document.querySelectorAll('.lang-pill')).map(pill => ({
                    text: pill.textContent.trim(),
                    isActive: pill.classList.contains('active'),
                    href: pill.href
                })),
                translationElements: document.querySelectorAll('[data-i18n]').length,
                bodyClasses: document.body.className,
                htmlDir: document.documentElement.getAttribute('dir'),
                currentURL: window.location.href
            };
        });

        console.log('\n📊 INITIAL STATE ANALYSIS:');
        console.log('Current language:', initialState.currentLang);
        console.log('Pills found:', initialState.pills.length);
        console.log('Active pill:', initialState.pills.find(p => p.isActive)?.text || 'none');
        console.log('Translation elements:', initialState.translationElements);
        console.log('Current URL:', initialState.currentURL);
        console.log('HTML dir:', initialState.htmlDir);

        // Test Russian language switch with detailed monitoring
        console.log('\n🎯 DETAILED RUSSIAN SWITCH TEST...');

        if (initialState.pills.length > 0) {
            // Click Russian pill (second one)
            console.log('Clicking RU pill...');
            const ruPillSelector = '.lang-pill:nth-child(2)';

            await page.click(ruPillSelector);
            diagnostics.languageSwitchAttempts.push({
                action: 'clicked_ru_pill',
                timestamp: Date.now()
            });

            await page.waitForTimeout(5000); // Give time for everything to load

            // Check what happened after click
            const afterRuClick = await page.evaluate(() => {
                return {
                    currentLang: localStorage.getItem('selectedLanguage'),
                    activePill: document.querySelector('.lang-pill.active')?.textContent?.trim(),
                    currentURL: window.location.href,
                    htmlDir: document.documentElement.getAttribute('dir'),
                    sampleTranslationText: document.querySelector('[data-i18n="hero.content.title"]')?.textContent?.trim(),
                    allPillStates: Array.from(document.querySelectorAll('.lang-pill')).map(pill => ({
                        text: pill.textContent.trim(),
                        isActive: pill.classList.contains('active'),
                        href: pill.href
                    }))
                };
            });

            console.log('\n📈 AFTER RU CLICK ANALYSIS:');
            console.log('Language in localStorage:', afterRuClick.currentLang);
            console.log('Active pill text:', afterRuClick.activePill);
            console.log('Current URL:', afterRuClick.currentURL);
            console.log('Sample translation:', afterRuClick.sampleTranslationText);
            console.log('All pill states:', afterRuClick.allPillStates);

            // Test Hebrew switch for RTL
            console.log('\n🎯 DETAILED HEBREW SWITCH TEST...');
            await page.click('.lang-pill:nth-child(3)');
            diagnostics.languageSwitchAttempts.push({
                action: 'clicked_he_pill',
                timestamp: Date.now()
            });

            await page.waitForTimeout(5000);

            const afterHeClick = await page.evaluate(() => {
                return {
                    currentLang: localStorage.getItem('selectedLanguage'),
                    activePill: document.querySelector('.lang-pill.active')?.textContent?.trim(),
                    htmlDir: document.documentElement.getAttribute('dir'),
                    bodyDir: document.body.getAttribute('dir'),
                    rtlApplied: document.documentElement.getAttribute('dir') === 'rtl'
                };
            });

            console.log('\n📈 AFTER HE CLICK ANALYSIS:');
            console.log('Language in localStorage:', afterHeClick.currentLang);
            console.log('Active pill text:', afterHeClick.activePill);
            console.log('HTML dir:', afterHeClick.htmlDir);
            console.log('Body dir:', afterHeClick.bodyDir);
            console.log('RTL applied:', afterHeClick.rtlApplied);
        }

        // Check for JavaScript errors that might be blocking functionality
        const jsCheck = await page.evaluate(() => {
            return {
                unifiedLanguageManagerExists: typeof window.LanguageManager !== 'undefined',
                emailJSExists: typeof window.emailjs !== 'undefined',
                jqueryExists: typeof window.$ !== 'undefined',
                globalErrors: window.errors || [],
                languageManagerInitialized: window.LanguageManager?.isInitialized || false
            };
        });

        console.log('\n🔍 JAVASCRIPT ENVIRONMENT CHECK:');
        console.log('LanguageManager exists:', jsCheck.unifiedLanguageManagerExists);
        console.log('LanguageManager initialized:', jsCheck.languageManagerInitialized);
        console.log('EmailJS exists:', jsCheck.emailJSExists);
        console.log('jQuery exists:', jsCheck.jqueryExists);

        // Test specific URL that user mentioned: https://www.aistudio555.com/en/?locale=ru#
        console.log('\n🎯 TESTING SPECIFIC PROBLEMATIC URL...');
        await page.goto('https://www.aistudio555.com/en/?locale=ru#', {
            waitUntil: 'networkidle',
            timeout: 30000
        });

        await page.waitForTimeout(5000);

        const urlParamTest = await page.evaluate(() => {
            return {
                urlParams: new URLSearchParams(window.location.search).get('locale'),
                currentLang: localStorage.getItem('selectedLanguage'),
                activePill: document.querySelector('.lang-pill.active')?.textContent?.trim(),
                translated: document.querySelector('[data-i18n="hero.content.title"]')?.textContent?.includes('русский') || false,
                currentURL: window.location.href
            };
        });

        console.log('\n📋 URL PARAMETER TEST RESULTS:');
        console.log('URL locale param:', urlParamTest.urlParams);
        console.log('LocalStorage lang:', urlParamTest.currentLang);
        console.log('Active pill:', urlParamTest.activePill);
        console.log('Content translated:', urlParamTest.translated);
        console.log('Final URL:', urlParamTest.currentURL);

        // Take screenshot for visual inspection
        await page.screenshot({
            path: '/Users/michaelmishayev/Desktop/newCode/ultrathink-production-analysis.png',
            fullPage: true
        });

        console.log('\n📊 COMPREHENSIVE DIAGNOSTIC RESULTS:');
        console.log('===================================');
        console.log(`🌐 Total network requests: ${diagnostics.networkRequests.length}`);
        console.log(`❌ Failed requests: ${diagnostics.failedRequests.length}`);
        console.log(`🚨 Console errors: ${diagnostics.consoleErrors.length}`);
        console.log(`⚠️ Console warnings: ${diagnostics.consoleWarnings.length}`);
        console.log(`🌐 API calls made: ${diagnostics.apiCalls.length}`);
        console.log(`📄 CSS files loaded: ${diagnostics.cssLoads.length}`);
        console.log(`📜 JS files loaded: ${diagnostics.jsLoads.length}`);

        if (diagnostics.failedRequests.length > 0) {
            console.log('\n❌ FAILED REQUESTS:');
            diagnostics.failedRequests.forEach(req => {
                console.log(`   ${req.status || 'FAILED'} - ${req.url}`);
                if (req.failure) console.log(`      Reason: ${req.failure.errorText}`);
            });
        }

        if (diagnostics.consoleErrors.length > 0) {
            console.log('\n🚨 CONSOLE ERRORS:');
            diagnostics.consoleErrors.forEach(error => {
                console.log(`   ❌ ${error.text}`);
            });
        }

        if (diagnostics.apiCalls.length > 0) {
            console.log('\n🌐 API CALLS MADE:');
            diagnostics.apiCalls.forEach(call => {
                const status = call.status === 200 ? '✅' : '❌';
                console.log(`   ${status} ${call.status} - ${call.url}`);
            });
        }

        await browser.close();

        // Analysis and conclusions
        const issues = [];
        if (diagnostics.consoleErrors.length > 0) issues.push('JavaScript errors detected');
        if (diagnostics.failedRequests.length > 0) issues.push('Network request failures');
        if (diagnostics.apiCalls.filter(c => c.status !== 200).length > 0) issues.push('API call failures');

        return {
            success: issues.length === 0,
            issues,
            diagnostics,
            initialState,
            jsCheck,
            urlParamTest
        };

    } catch (error) {
        console.error('❌ Diagnostic failed:', error);
        await browser.close();
        return { success: false, error: error.message, diagnostics };
    }
}

ultrathinkProductionDiagnostic().then(result => {
    console.log('\n🧠 ULTRATHINK PRODUCTION CONCLUSION:');
    console.log('===================================');

    if (result.success) {
        console.log('🎉 Production appears to be working correctly');
        console.log('✅ No critical issues detected');
        console.log('💡 If user reports issues, they might be:');
        console.log('   - Cache-related (hard refresh needed)');
        console.log('   - Browser-specific problems');
        console.log('   - Network connectivity issues');
        console.log('   - Testing different URLs than expected');
    } else {
        console.log('❌ Production issues detected:');
        if (result.issues) {
            result.issues.forEach(issue => console.log(`   - ${issue}`));
        }
        console.log('\n🔍 Detailed diagnostics available in result object');
    }

    if (result.error) {
        console.log(`💥 Test error: ${result.error}`);
    }
}).catch(console.error);