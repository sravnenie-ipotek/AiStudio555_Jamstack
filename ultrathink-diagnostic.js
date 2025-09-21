/**
 * ULTRATHINK Diagnostic Tool
 * Deep investigation of remaining issues:
 * 1. shared/shared-cards.css error
 * 2. Translation not working
 */

const { chromium } = require('playwright');

async function ultrathinkDiagnostic() {
    console.log('🧠 ULTRATHINK DIAGNOSTIC: Deep investigation...');

    const browser = await chromium.launch({
        headless: false,
        slowMo: 500
    });

    const context = await browser.newContext({
        viewport: { width: 1280, height: 720 }
    });

    const page = await context.newPage();

    const allRequests = [];
    const errors = [];
    const apiCalls = [];

    // Capture ALL network requests
    page.on('request', request => {
        allRequests.push({
            url: request.url(),
            method: request.method(),
            resourceType: request.resourceType()
        });

        // Track API calls specifically
        if (request.url().includes('/api/')) {
            console.log(`🌐 API Request: ${request.method()} ${request.url()}`);
            apiCalls.push(request.url());
        }
    });

    page.on('response', response => {
        const url = response.url();
        if (url.includes('shared-cards.css')) {
            console.log(`🔍 SHARED-CARDS.CSS: ${response.status()} - ${url}`);
            console.log(`   Content-Type: ${response.headers()['content-type']}`);
        }

        if (url.includes('/api/')) {
            console.log(`📡 API Response: ${response.status()} - ${url}`);
        }
    });

    page.on('console', msg => {
        if (msg.type() === 'error') {
            errors.push(msg.text());
            if (msg.text().includes('shared-cards') || msg.text().includes('API') || msg.text().includes('translation')) {
                console.log('❌ Critical Error:', msg.text());
            }
        } else if (msg.type() === 'log' && msg.text().includes('Language')) {
            console.log('📝 Language Log:', msg.text());
        }
    });

    try {
        console.log('\n🎯 PHASE 1: Testing /en/?locale=ru# URL...');
        await page.goto('https://www.aistudio555.com/en/?locale=ru#', {
            waitUntil: 'networkidle',
            timeout: 30000
        });

        await page.waitForTimeout(3000);

        // INVESTIGATION 1: Find where shared-cards.css is referenced
        console.log('\n🔍 INVESTIGATION 1: Locating shared-cards.css references...');

        const stylesheetLinks = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(link => ({
                href: link.href,
                element: link.outerHTML
            }));
        });

        console.log('📄 All stylesheet links:');
        stylesheetLinks.forEach(link => {
            if (link.href.includes('shared-cards') || link.href.includes('shared/')) {
                console.log(`   🔗 PROBLEMATIC: ${link.href}`);
                console.log(`      HTML: ${link.element}`);
            } else {
                console.log(`   ✅ OK: ${link.href}`);
            }
        });

        // INVESTIGATION 2: Check HTML source for hardcoded references
        console.log('\n🔍 INVESTIGATION 2: Checking HTML source...');
        const htmlContent = await page.content();

        const sharedReferences = [];
        const lines = htmlContent.split('\n');
        lines.forEach((line, index) => {
            if (line.includes('shared/shared-cards') || line.includes('shared/components')) {
                sharedReferences.push({
                    lineNumber: index + 1,
                    content: line.trim()
                });
            }
        });

        if (sharedReferences.length > 0) {
            console.log('🚨 Found hardcoded shared/ references:');
            sharedReferences.forEach(ref => {
                console.log(`   Line ${ref.lineNumber}: ${ref.content}`);
            });
        } else {
            console.log('✅ No hardcoded shared/ references found in HTML');
        }

        // INVESTIGATION 3: Check current page language and content
        console.log('\n🔍 INVESTIGATION 3: Translation system status...');

        const languageState = await page.evaluate(() => {
            return {
                currentLocale: localStorage.getItem('preferred_locale'),
                urlParams: new URLSearchParams(window.location.search).get('locale'),
                documentLang: document.documentElement.getAttribute('lang'),
                documentDir: document.documentElement.getAttribute('dir'),
                setActivePillExists: typeof window.setActivePill === 'function',
                languageManagerExists: typeof window.languageManager === 'object',
                activePill: document.querySelector('.lang-pill.active')?.textContent
            };
        });

        console.log('🌍 Language State:');
        Object.entries(languageState).forEach(([key, value]) => {
            console.log(`   ${key}: ${value}`);
        });

        // INVESTIGATION 4: Test API endpoints directly
        console.log('\n🔍 INVESTIGATION 4: Testing API endpoints...');

        const testEndpoints = [
            'https://aistudio555jamstack-production.up.railway.app/api/nd/home-page?locale=en',
            'https://aistudio555jamstack-production.up.railway.app/api/nd/home-page?locale=ru',
            'https://aistudio555jamstack-production.up.railway.app/api/nd/home-page?locale=he'
        ];

        for (const endpoint of testEndpoints) {
            try {
                const response = await page.evaluate(async (url) => {
                    const res = await fetch(url);
                    return {
                        status: res.status,
                        statusText: res.statusText,
                        contentType: res.headers.get('content-type'),
                        hasData: res.status === 200
                    };
                }, endpoint);

                console.log(`📡 ${endpoint}`);
                console.log(`   Status: ${response.status} ${response.statusText}`);
                console.log(`   Content-Type: ${response.contentType}`);
                console.log(`   Has Data: ${response.hasData}`);
            } catch (error) {
                console.log(`❌ ${endpoint} - Error: ${error.message}`);
            }
        }

        // INVESTIGATION 5: Check for translation elements
        console.log('\n🔍 INVESTIGATION 5: Translation elements status...');

        const translationElements = await page.evaluate(() => {
            const elements = document.querySelectorAll('[data-i18n]');
            return Array.from(elements).slice(0, 10).map(el => ({
                tag: el.tagName,
                i18nKey: el.getAttribute('data-i18n'),
                content: el.textContent.substring(0, 50),
                hasContent: el.textContent.trim().length > 0
            }));
        });

        console.log('🏷️ Translation elements (first 10):');
        translationElements.forEach(el => {
            console.log(`   ${el.tag}[data-i18n="${el.i18nKey}"] = "${el.content}..." (${el.hasContent ? 'has content' : 'empty'})`);
        });

        // INVESTIGATION 6: Test language switching functionality
        console.log('\n🔍 INVESTIGATION 6: Testing language switching...');

        const langPills = await page.locator('.lang-pill').count();
        if (langPills > 0) {
            console.log(`Found ${langPills} language pills`);

            // Try clicking RU pill
            console.log('🎯 Clicking RU pill...');
            await page.click('.lang-pill:nth-child(2)');
            await page.waitForTimeout(2000);

            const afterClick = await page.evaluate(() => ({
                activePill: document.querySelector('.lang-pill.active')?.textContent,
                currentLocale: localStorage.getItem('preferred_locale'),
                someTranslatedText: document.querySelector('[data-i18n]')?.textContent
            }));

            console.log('After RU click:', afterClick);
        }

        // Take comprehensive screenshot
        await page.screenshot({
            path: '/Users/michaelmishayev/Desktop/newCode/ultrathink-diagnostic.png',
            fullPage: true
        });

        console.log('\n📊 ULTRATHINK ANALYSIS COMPLETE');
        console.log('================================');

        await browser.close();

        return {
            sharedCardsReferences: sharedReferences.length,
            apiCallsMade: apiCalls.length,
            errorsFound: errors.length,
            languageState,
            translationElementsFound: translationElements.length,
            details: {
                sharedReferences,
                apiCalls,
                errors: errors.slice(0, 5), // First 5 errors
                stylesheetLinks: stylesheetLinks.filter(l => l.href.includes('shared')),
                translationElements: translationElements.slice(0, 5)
            }
        };

    } catch (error) {
        console.error('❌ Diagnostic failed:', error);
        await browser.close();
        return { error: error.message };
    }
}

ultrathinkDiagnostic().then(result => {
    console.log('\n🧠 ULTRATHINK CONCLUSIONS:');
    console.log('==========================');

    if (result.sharedCardsReferences > 0) {
        console.log('🔥 FOUND IT: Still has hardcoded shared-cards.css references!');
        console.log(`   Number of references: ${result.sharedCardsReferences}`);
        console.log('   ACTION NEEDED: Fix HTML files');
    }

    if (result.apiCallsMade === 0) {
        console.log('🚨 NO API CALLS: Translation system not triggering API requests');
        console.log('   ACTION NEEDED: Check language manager initialization');
    }

    if (result.translationElementsFound === 0) {
        console.log('🚨 NO TRANSLATION ELEMENTS: data-i18n attributes missing');
        console.log('   ACTION NEEDED: Check HTML structure');
    }

    console.log(`\n📈 Summary: ${result.sharedCardsReferences} shared refs, ${result.apiCallsMade} API calls, ${result.errorsFound} errors`);
}).catch(console.error);