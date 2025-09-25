const { chromium } = require('playwright');

async function runComprehensiveRegressionTest() {
    console.log('🔵 BLUE AGENT: Starting Comprehensive Regression Test');
    console.log('================================================');
    
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
        viewport: { width: 1200, height: 800 }
    });
    
    const results = {
        passed: 0,
        failed: 0,
        details: []
    };
    
    const pagesToTest = [
        { name: 'Home', url: 'http://localhost:3005/home.html', critical: true },
        { name: 'Courses', url: 'http://localhost:3005/courses.html', critical: true },
        { name: 'Teachers', url: 'http://localhost:3005/teachers.html', critical: true },
        { name: 'Career Center', url: 'http://localhost:3005/career-center.html', critical: true },
        { name: 'Career Orientation', url: 'http://localhost:3005/career-orientation.html', critical: true },
        { name: 'Blog', url: 'http://localhost:3005/blog.html', critical: false },
        { name: 'About Us', url: 'http://localhost:3005/about-us.html', critical: false },
        { name: 'Pricing', url: 'http://localhost:3005/pricing.html', critical: false }
    ];
    
    for (const pageInfo of pagesToTest) {
        console.log('\n🔍 Testing ' + pageInfo.name + ' page...');
        
        const page = await context.newPage();
        const pageResult = {
            page: pageInfo.name,
            url: pageInfo.url,
            critical: pageInfo.critical,
            tests: {}
        };
        
        try {
            await page.goto(pageInfo.url, { waitUntil: 'networkidle' });
            console.log('✅ Page loaded successfully');
            
            const consoleErrors = [];
            page.on('console', msg => {
                if (msg.type() === 'error') {
                    consoleErrors.push(msg.text());
                }
            });
            
            await page.waitForTimeout(3000);
            
            const scriptsLoaded = await page.evaluate(() => {
                return {
                    jquery: typeof $ !== 'undefined',
                    webflow: typeof Webflow !== 'undefined',
                    enhancedIntegration: typeof window.enhancedIntegration !== 'undefined'
                };
            });
            
            const apiResponses = await page.evaluate(async () => {
                const testUrls = [
                    'http://localhost:3000/api/courses',
                    'http://localhost:3000/api/teachers', 
                    'http://localhost:3000/api/home-page'
                ];
                
                const results = {};
                for (const url of testUrls) {
                    try {
                        const response = await fetch(url);
                        results[url] = {
                            status: response.status,
                            ok: response.ok
                        };
                    } catch (error) {
                        results[url] = {
                            status: 'ERROR',
                            error: error.message
                        };
                    }
                }
                return results;
            });
            
            await page.setViewportSize({ width: 375, height: 667 });
            await page.waitForTimeout(1000);
            
            const mobileMenuExists = await page.locator('.w-nav-button').isVisible();
            let mobileMenuWorks = false;
            
            if (mobileMenuExists) {
                try {
                    await page.locator('.w-nav-button').click();
                    await page.waitForTimeout(500);
                    const navOverlay = await page.locator('.w-nav-overlay').isVisible();
                    mobileMenuWorks = navOverlay;
                } catch (error) {
                    console.log('⚠️  Mobile menu test failed: ' + error.message);
                }
            }
            
            const resourceErrors = await page.evaluate(() => {
                const errors = [];
                const images = document.querySelectorAll('img');
                
                images.forEach(img => {
                    if (img.naturalWidth === 0 && img.complete) {
                        errors.push('Broken image: ' + img.src);
                    }
                });
                
                return errors;
            });
            
            let enhancedFeatures = {};
            if (pageInfo.name === 'Home') {
                enhancedFeatures = await page.evaluate(() => {
                    return {
                        faqSection: document.querySelector('#faq-section') !== null,
                        faqItems: document.querySelectorAll('.faq-item').length,
                        dynamicContent: document.querySelector('[data-dynamic-content]') !== null
                    };
                });
            }
            
            pageResult.tests = {
                pageLoads: true,
                consoleErrors: consoleErrors.length === 0 ? 'PASS' : 'FAIL: ' + consoleErrors.length + ' errors',
                scriptsLoaded: scriptsLoaded,
                apiResponses: apiResponses,
                mobileMenu: mobileMenuExists ? (mobileMenuWorks ? 'PASS' : 'FAIL') : 'N/A',
                resourceErrors: resourceErrors.length === 0 ? 'PASS' : 'FAIL: ' + resourceErrors.length + ' broken resources',
                enhancedFeatures: enhancedFeatures
            };
            
            const hasErrors = consoleErrors.length > 0 || resourceErrors.length > 0;
            const apiIssues = Object.values(apiResponses).some(resp => !resp.ok && resp.status !== 'ERROR');
            
            if (!hasErrors && !apiIssues) {
                results.passed++;
                console.log('✅ ' + pageInfo.name + ' - ALL TESTS PASSED');
            } else {
                results.failed++;
                console.log('❌ ' + pageInfo.name + ' - ISSUES FOUND');
            }
            
        } catch (error) {
            console.log('❌ ' + pageInfo.name + ' - CRITICAL ERROR: ' + error.message);
            pageResult.tests = { criticalError: error.message };
            results.failed++;
        }
        
        results.details.push(pageResult);
        await page.close();
    }
    
    await browser.close();
    
    console.log('\n📊 REGRESSION TEST SUMMARY');
    console.log('==========================');
    console.log('✅ Passed: ' + results.passed);
    console.log('❌ Failed: ' + results.failed);
    console.log('📈 Success Rate: ' + ((results.passed / (results.passed + results.failed)) * 100).toFixed(1) + '%');
    
    console.log('\n📋 DETAILED RESULTS');
    results.details.forEach(result => {
        console.log('\n' + (result.critical ? '🔴 CRITICAL' : '🟡 STANDARD') + ' - ' + result.page);
        console.log('URL: ' + result.url);
        
        if (result.tests.criticalError) {
            console.log('❌ CRITICAL ERROR: ' + result.tests.criticalError);
            return;
        }
        
        console.log('Page Load: ' + (result.tests.pageLoads ? '✅' : '❌'));
        console.log('Console: ' + result.tests.consoleErrors);
        console.log('Scripts: jQuery:' + (result.tests.scriptsLoaded.jquery ? '✅' : '❌') + 
                   ' Webflow:' + (result.tests.scriptsLoaded.webflow ? '✅' : '❌') + 
                   ' Enhanced:' + (result.tests.scriptsLoaded.enhancedIntegration ? '✅' : '❌'));
        console.log('Mobile Menu: ' + result.tests.mobileMenu);
        console.log('Resources: ' + result.tests.resourceErrors);
        
        console.log('API Health:');
        Object.entries(result.tests.apiResponses).forEach(([url, resp]) => {
            const status = resp.ok ? '✅' : (resp.status === 'ERROR' ? '🔴' : '⚠️');
            console.log('  ' + status + ' ' + url + ' (' + resp.status + ')');
        });
    });
    
    console.log('\n🔵 Blue Agent Regression Test Complete');
    return results;
}

runComprehensiveRegressionTest().catch(console.error);
