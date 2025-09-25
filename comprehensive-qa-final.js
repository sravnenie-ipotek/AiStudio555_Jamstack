const puppeteer = require('puppeteer');
const fs = require('fs');

async function comprehensiveHebrewQA() {
    console.log('🔵 COMPREHENSIVE HEBREW QA VALIDATION');
    console.log('=====================================');
    
    const results = {
        tests: [],
        issues: [],
        recommendations: []
    };
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    // Test 1: API Endpoint Validation
    console.log('\n1. 🔍 Testing API Endpoints for Hebrew Content');
    console.log('-'.repeat(50));
    
    const endpoints = [
        'home-page',
        'career-center-platform-page', 
        'courses-page',
        'pricing-page'
    ];
    
    for (const endpoint of endpoints) {
        try {
            console.log(`Testing: /api/nd/${endpoint}?locale=he`);
            
            const response = await fetch(`http://localhost:3000/api/nd/${endpoint}?locale=he`);
            const data = await response.json();
            
            const hasHebrewContent = JSON.stringify(data).includes('שלטו') || 
                                   JSON.stringify(data).includes('פלטפורמת') || 
                                   JSON.stringify(data).includes('דף הבית');
                                   
            const status = response.status === 200 ? 'PASS' : 'FAIL';
            const hebrewStatus = hasHebrewContent ? 'HAS HEBREW' : 'NO HEBREW';
            
            console.log(`  Status: ${status} - Content: ${hebrewStatus}`);
            
            results.tests.push({
                test: `API ${endpoint}`,
                status: status,
                hasHebrew: hasHebrewContent,
                details: `HTTP ${response.status}`
            });
            
            if (!hasHebrewContent && response.status === 200) {
                results.issues.push(`${endpoint} returns English content for Hebrew locale`);
            }
            
        } catch (error) {
            console.log(`  Status: FAIL - Error: ${error.message}`);
            results.issues.push(`${endpoint} API call failed: ${error.message}`);
        }
    }
    
    // Test 2: Page Loading and Translation Manager
    console.log('\n2. 🌐 Testing Page Loading and Translation Manager');
    console.log('-'.repeat(50));
    
    try {
        await page.goto('http://localhost:3005/career-center.html?locale=he', {
            waitUntil: 'networkidle2',
            timeout: 15000
        });
        
        console.log('✅ Page loaded successfully');
        
        await page.waitForTimeout(3000);
        
        const managerStatus = await page.evaluate(() => {
            return {
                exists: typeof window.unifiedLanguageManager !== 'undefined',
                currentLocale: window.unifiedLanguageManager?.currentLocale,
                translationsCount: Object.keys(window.unifiedLanguageManager?.translations || {}).length,
                apiBaseUrl: window.unifiedLanguageManager?.apiBaseUrl
            };
        });
        
        console.log(`Language Manager: ${managerStatus.exists ? 'LOADED' : 'MISSING'}`);
        console.log(`Current Locale: ${managerStatus.currentLocale}`);
        console.log(`Translations Count: ${managerStatus.translationsCount}`);
        console.log(`API Base URL: ${managerStatus.apiBaseUrl}`);
        
        results.tests.push({
            test: 'Language Manager',
            status: managerStatus.exists ? 'PASS' : 'FAIL',
            details: `Locale: ${managerStatus.currentLocale}, Translations: ${managerStatus.translationsCount}`
        });
        
        if (managerStatus.translationsCount === 0) {
            results.issues.push('Language manager loaded but has no translations');
        }
        
    } catch (error) {
        console.log('❌ Page loading failed:', error.message);
        results.issues.push('Page loading failed');
    }
    
    // Test 3: Hebrew Content in DOM
    console.log('\n3. 📄 Analyzing Hebrew Content in DOM');
    console.log('-'.repeat(50));
    
    const domAnalysis = await page.evaluate(() => {
        const hebrewElements = [];
        const i18nElements = [];
        
        document.querySelectorAll('*').forEach(el => {
            const text = el.textContent || '';
            if (text && /[\u0590-\u05FF]/.test(text)) {
                hebrewElements.push({
                    tag: el.tagName,
                    text: text.substring(0, 80),
                    hasDataI18n: el.hasAttribute('data-i18n'),
                    className: el.className
                });
            }
            
            if (el.hasAttribute('data-i18n')) {
                i18nElements.push({
                    key: el.getAttribute('data-i18n'),
                    text: text.substring(0, 50),
                    hasHebrew: /[\u0590-\u05FF]/.test(text)
                });
            }
        });
        
        return {
            hebrewElementsCount: hebrewElements.length,
            i18nElementsCount: i18nElements.length,
            hebrewSamples: hebrewElements.slice(0, 3),
            i18nSamples: i18nElements.slice(0, 5),
            translatedElements: i18nElements.filter(el => el.hasHebrew).length
        };
    });
    
    console.log(`Hebrew Elements Found: ${domAnalysis.hebrewElementsCount}`);
    console.log(`Data-i18n Elements: ${domAnalysis.i18nElementsCount}`);
    console.log(`Translated Elements: ${domAnalysis.translatedElements}`);
    
    console.log('\nHebrew Content Samples:');
    domAnalysis.hebrewSamples.forEach((el, i) => {
        console.log(`  ${i+1}. ${el.tag}: "${el.text}"`);
        console.log(`     Has data-i18n: ${el.hasDataI18n}`);
    });
    
    results.tests.push({
        test: 'Hebrew Content in DOM',
        status: domAnalysis.hebrewElementsCount > 0 ? 'PASS' : 'FAIL',
        details: `${domAnalysis.hebrewElementsCount} Hebrew elements, ${domAnalysis.translatedElements} translated`
    });
    
    // Test 4: RTL Styling Check
    console.log('\n4. 🎨 Checking RTL Styling');
    console.log('-'.repeat(50));
    
    const rtlCheck = await page.evaluate(() => {
        const html = document.documentElement;
        const body = document.body;
        
        return {
            htmlDir: html.getAttribute('dir'),
            htmlLang: html.getAttribute('lang'),
            bodyClasses: body.className,
            computedDirection: window.getComputedStyle(html).direction
        };
    });
    
    console.log(`HTML dir: ${rtlCheck.htmlDir}`);
    console.log(`HTML lang: ${rtlCheck.htmlLang}`);
    console.log(`Body classes: ${rtlCheck.bodyClasses}`);
    console.log(`Computed direction: ${rtlCheck.computedDirection}`);
    
    const rtlPass = rtlCheck.htmlDir === 'rtl' || rtlCheck.bodyClasses.includes('rtl');
    results.tests.push({
        test: 'RTL Styling',
        status: rtlPass ? 'PASS' : 'FAIL',
        details: `dir="${rtlCheck.htmlDir}", classes="${rtlCheck.bodyClasses}"`
    });
    
    await browser.close();
    
    // Final Analysis
    console.log('\n📋 COMPREHENSIVE QA RESULTS');
    console.log('============================');
    
    results.tests.forEach(test => {
        const status = test.status === 'PASS' ? '✅' : '❌';
        console.log(`${status} ${test.test}: ${test.status} (${test.details})`);
    });
    
    if (results.issues.length > 0) {
        console.log('\n⚠️  CRITICAL ISSUES FOUND:');
        results.issues.forEach((issue, i) => {
            console.log(`  ${i+1}. ${issue}`);
        });
        
        console.log('\n🔧 RECOMMENDATIONS:');
        
        // Generate recommendations based on issues
        if (results.issues.some(i => i.includes('career-center-platform-page'))) {
            console.log('  1. Create Hebrew translations for career-center-platform-page in database');
            console.log('  2. Check server.js endpoint for career center Hebrew support');
        }
        
        if (results.issues.some(i => i.includes('no translations'))) {
            console.log('  3. Verify API endpoint response format matches expected structure');
            console.log('  4. Check unified-language-manager.js translation loading logic');
        }
        
        console.log('  5. Test with working Hebrew endpoint (home-page) to verify system works');
        console.log('  6. Add missing Hebrew content to database tables');
    }
    
    // Summary
    const passedTests = results.tests.filter(t => t.status === 'PASS').length;
    const totalTests = results.tests.length;
    
    console.log(`\n🎯 SUMMARY: ${passedTests}/${totalTests} tests passed`);
    
    if (passedTests === totalTests && results.issues.length === 0) {
        console.log('🎉 All tests passed! Hebrew translations are working correctly.');
    } else {
        console.log('⚠️  Issues found that need to be addressed for full Hebrew support.');
    }
    
    // Save detailed results
    fs.writeFileSync('qa-results.json', JSON.stringify({
        timestamp: new Date().toISOString(),
        results: results,
        summary: { passed: passedTests, total: totalTests, issues: results.issues.length }
    }, null, 2));
    
    console.log('\n📄 Detailed results saved to qa-results.json');
}

// Run the comprehensive QA
comprehensiveHebrewQA().catch(console.error);
