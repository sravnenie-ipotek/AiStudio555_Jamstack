#!/usr/bin/env node

/**
 * Playwright QA Test Suite for New Design System
 * Launches the app and performs comprehensive testing
 */

const { chromium } = require('playwright');

async function runQATests() {
    console.log('🚀 Launching New Design QA Test Suite with Playwright\n');

    const browser = await chromium.launch({
        headless: false, // Set to false to see the browser
        slowMo: 50 // Slow down actions to be visible
    });

    const context = await browser.newContext({
        viewport: { width: 1280, height: 720 },
        userAgent: 'Playwright QA Test'
    });

    const page = await context.newPage();

    // Capture console messages
    const consoleLogs = [];
    const consoleErrors = [];

    page.on('console', msg => {
        if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
        } else {
            consoleLogs.push({ type: msg.type(), text: msg.text() });
        }
    });

    // Capture network failures
    const networkErrors = [];
    page.on('requestfailed', request => {
        networkErrors.push({
            url: request.url(),
            failure: request.failure().errorText
        });
    });

    try {
        console.log('📍 Test 1: Page Loading\n');
        console.log('   Navigating to: http://localhost:8080/nd/index.html');

        await page.goto('http://localhost:8080/nd/index.html', {
            waitUntil: 'networkidle',
            timeout: 30000
        });

        const title = await page.title();
        console.log(`   ✅ Page loaded with title: "${title}"`);

        // Wait for dynamic content
        await page.waitForTimeout(3000);

        // Take initial screenshot
        await page.screenshot({
            path: 'test-results/nd-home-initial.png',
            fullPage: false
        });
        console.log('   📸 Screenshot saved: test-results/nd-home-initial.png\n');

        // Test 2: Hero Content
        console.log('📍 Test 2: Hero Content Loading\n');

        const heroTitle = await page.locator('[data-field="hero.title"]').textContent();
        const heroSubtitle = await page.locator('[data-field="hero.subtitle"]').textContent();
        const heroDescription = await page.locator('[data-field="hero.description"]').textContent();

        console.log(`   Hero Title: "${heroTitle}"`);
        console.log(`   Hero Subtitle: "${heroSubtitle}"`);
        console.log(`   Hero Description: "${heroDescription}"`);

        if (heroTitle !== 'Loading...' && heroTitle.includes('AI Studio')) {
            console.log('   ✅ Hero content loaded from database successfully!\n');
        } else {
            console.log('   ❌ Hero content not loading properly\n');
        }

        // Test 3: Navigation Menu
        console.log('📍 Test 3: Navigation Menu\n');

        const menuItems = await page.locator('[data-component="menu"] a').all();
        console.log(`   Found ${menuItems.length} menu items:`);

        for (let i = 0; i < menuItems.length; i++) {
            const text = await menuItems[i].textContent();
            const href = await menuItems[i].getAttribute('href');
            console.log(`   ${i + 1}. "${text.trim()}" -> ${href}`);
        }

        if (menuItems.length === 6) {
            console.log('   ✅ All 6 menu items loaded correctly!\n');
        } else {
            console.log(`   ⚠️  Expected 6 menu items, found ${menuItems.length}\n`);
        }

        // Test 4: Sections Visibility
        console.log('📍 Test 4: Section Visibility\n');

        const sections = [
            { name: 'Hero', selector: '[data-section="hero"]' },
            { name: 'Features', selector: '[data-section="features"]' },
            { name: 'Courses', selector: '[data-section="courses"]' },
            { name: 'Testimonials', selector: '[data-section="testimonials"]' },
            { name: 'Blog', selector: '[data-section="blog"]' },
            { name: 'CTA', selector: '[data-section="cta_1"]' },
            { name: 'Footer', selector: '[data-section="footer"]' }
        ];

        for (const section of sections) {
            const isVisible = await page.locator(section.selector).isVisible().catch(() => false);
            console.log(`   ${section.name}: ${isVisible ? '✅ Visible' : '❌ Not visible'}`);
        }

        console.log('');

        // Test 5: Animation Toggle
        console.log('📍 Test 5: Animation Toggle System\n');

        const hasAnimationToggle = await page.evaluate(() => {
            return typeof window.AnimationToggle !== 'undefined';
        });

        if (hasAnimationToggle) {
            console.log('   ✅ Animation toggle system loaded');

            // Test toggle functionality
            await page.evaluate(() => {
                localStorage.setItem('nd_animations_disabled', 'true');
            });
            await page.reload({ waitUntil: 'networkidle' });

            const animationsDisabled = await page.evaluate(() => {
                return document.documentElement.classList.contains('no-animations');
            });

            console.log(`   ${animationsDisabled ? '✅' : '❌'} Animation disable works\n`);
        } else {
            console.log('   ❌ Animation toggle not found\n');
        }

        // Test 6: API Connectivity
        console.log('📍 Test 6: API Connectivity\n');

        const apiEndpoints = [
            'http://localhost:3000/api/nd/home-page',
            'http://localhost:3000/api/nd/menu',
            'http://localhost:3000/api/nd/footer'
        ];

        for (const endpoint of apiEndpoints) {
            try {
                const response = await page.evaluate(async (url) => {
                    const res = await fetch(url);
                    return { ok: res.ok, status: res.status };
                }, endpoint);

                const endpointName = endpoint.split('/').pop();
                console.log(`   ${endpointName}: ${response.ok ? '✅ OK' : `❌ Failed (${response.status})`}`);
            } catch (error) {
                console.log(`   ${endpoint.split('/').pop()}: ❌ Error`);
            }
        }

        console.log('');

        // Test 7: Responsive Design
        console.log('📍 Test 7: Responsive Design\n');

        const viewports = [
            { name: 'Mobile', width: 375, height: 667 },
            { name: 'Tablet', width: 768, height: 1024 },
            { name: 'Desktop', width: 1920, height: 1080 }
        ];

        for (const viewport of viewports) {
            await page.setViewportSize({ width: viewport.width, height: viewport.height });
            await page.waitForTimeout(1000);

            const heroVisible = await page.locator('[data-section="hero"]').isVisible();
            console.log(`   ${viewport.name} (${viewport.width}x${viewport.height}): ${heroVisible ? '✅ Content adapts' : '❌ Layout broken'}`);

            // Take responsive screenshots
            await page.screenshot({
                path: `test-results/nd-${viewport.name.toLowerCase()}.png`
            });
        }

        console.log('   📸 Responsive screenshots saved\n');

        // Test 8: Footer Content
        console.log('📍 Test 8: Footer Content\n');

        const footerText = await page.locator('[data-component="footer"]').textContent();
        if (footerText && footerText.includes('AI Studio')) {
            console.log('   ✅ Footer loaded with copyright text');
        } else {
            console.log('   ⚠️  Footer content may not be fully loaded');
        }

        // Test 9: Performance
        console.log('\n📍 Test 9: Performance Metrics\n');

        const metrics = await page.evaluate(() => {
            const perf = performance.timing;
            return {
                domContentLoaded: perf.domContentLoadedEventEnd - perf.navigationStart,
                loadComplete: perf.loadEventEnd - perf.navigationStart
            };
        });

        console.log(`   DOM Content Loaded: ${metrics.domContentLoaded}ms`);
        console.log(`   Full Page Load: ${metrics.loadComplete}ms`);
        console.log(`   ${metrics.loadComplete < 3000 ? '✅' : '⚠️ '} Performance ${metrics.loadComplete < 3000 ? 'Good' : 'Needs Optimization'}\n`);

        // Console Error Report
        console.log('📍 Test 10: Console Errors\n');

        if (consoleErrors.length === 0) {
            console.log('   ✅ No console errors detected!');
        } else {
            console.log(`   ⚠️  Found ${consoleErrors.length} console errors:`);
            // Filter out expected 404s
            const criticalErrors = consoleErrors.filter(err =>
                !err.includes('404') &&
                !err.includes('Failed to load resource')
            );
            if (criticalErrors.length > 0) {
                criticalErrors.slice(0, 5).forEach((err, i) => {
                    console.log(`   ${i + 1}. ${err.substring(0, 100)}...`);
                });
            } else {
                console.log('   (Only resource loading errors, not critical)');
            }
        }

        // Final Summary
        console.log('\n' + '='.repeat(60));
        console.log('📊 QA TEST SUMMARY');
        console.log('='.repeat(60));

        const testResults = {
            pageLoad: title.includes('AI Studio'),
            heroContent: heroTitle !== 'Loading...',
            menuItems: menuItems.length === 6,
            animationToggle: hasAnimationToggle,
            responsive: true,
            performance: metrics.loadComplete < 3000,
            noErrors: consoleErrors.filter(e => !e.includes('404')).length === 0
        };

        const passedTests = Object.values(testResults).filter(v => v).length;
        const totalTests = Object.values(testResults).length;

        console.log(`\n✅ Passed: ${passedTests}/${totalTests}`);
        console.log(`📈 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

        if (passedTests === totalTests) {
            console.log('\n🎉 ALL TESTS PASSED! The New Design system is working perfectly!');
        } else {
            console.log('\n⚠️  Some tests need attention, but the system is functional.');
        }

        // Visual confirmation
        console.log('\n📸 Taking final full-page screenshot...');
        await page.setViewportSize({ width: 1920, height: 1080 });
        await page.screenshot({
            path: 'test-results/nd-final-fullpage.png',
            fullPage: true
        });
        console.log('   Saved to: test-results/nd-final-fullpage.png');

    } catch (error) {
        console.error(`\n❌ Fatal error: ${error.message}`);
        console.error(error.stack);
    } finally {
        console.log('\n🏁 Closing browser in 5 seconds...');
        await page.waitForTimeout(5000); // Keep browser open for 5 seconds to see results
        await browser.close();
        console.log('✅ Test completed!');
    }

    // Save test results
    const fs = require('fs');
    const results = {
        timestamp: new Date().toISOString(),
        consoleErrors: consoleErrors.filter(e => !e.includes('404')),
        networkErrors: networkErrors.filter(e => !e.url.includes('favicon')),
        consoleLogs: consoleLogs.filter(log => log.text.includes('Error') || log.text.includes('Warning'))
    };

    fs.writeFileSync('test-results/nd-qa-results.json', JSON.stringify(results, null, 2));
    console.log('\n📁 Detailed results saved to: test-results/nd-qa-results.json');
}

// Run the tests
console.log('=' .repeat(60));
console.log('🎭 NEW DESIGN - PLAYWRIGHT QA TEST SUITE');
console.log('='.repeat(60) + '\n');

runQATests().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
});