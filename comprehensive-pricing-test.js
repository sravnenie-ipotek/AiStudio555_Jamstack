const { chromium } = require('playwright');

async function testPricingPage() {
    console.log('🔵 Starting comprehensive pricing page test...\n');
    
    const browser = await chromium.launch({ headless: false, slowMo: 500 });
    const page = await browser.newPage();
    
    // Enable console logging to catch errors
    const consoleMessages = [];
    const errors = [];
    
    page.on('console', msg => {
        const msgType = msg.type();
        const msgText = msg.text();
        const message = msgType + ': ' + msgText;
        consoleMessages.push(message);
        console.log('Browser Console: ' + message);
    });
    
    page.on('pageerror', error => {
        errors.push(error.message);
        console.error('Page Error: ' + error.message);
    });
    
    try {
        console.log('1. Loading pricing page...');
        await page.goto('http://localhost:3005/pricing.html', { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);
        
        console.log('✅ Page loaded successfully\n');
        
        // Test 1: Check for console errors
        console.log('2. Checking for console errors...');
        const criticalErrors = consoleMessages.filter(msg => 
            msg.includes('error') || 
            msg.includes('failed') || 
            msg.includes('404') ||
            msg.includes('500')
        );
        
        if (criticalErrors.length > 0) {
            console.log('❌ Console errors found:');
            criticalErrors.forEach(error => console.log('   - ' + error));
        } else {
            console.log('✅ No critical console errors');
        }
        
        // Test 2: Verify language pills are visible and functional
        console.log('\n3. Testing language switching...');
        
        const langPills = await page.locator('.lang-pill').count();
        const mobileLangPills = await page.locator('.mobile-lang-pill').count();
        console.log('Language pills found: Desktop ' + langPills + ', Mobile ' + mobileLangPills);
        
        if (langPills >= 3) {
            console.log('✅ Language pills are present');
        } else {
            console.log('❌ Language pills missing or insufficient');
        }
        
        // Test language switching for each language
        const languages = [
            { locale: 'en', name: 'English' },
            { locale: 'ru', name: 'Russian' },
            { locale: 'he', name: 'Hebrew' }
        ];
        
        for (const lang of languages) {
            console.log('\n   Testing ' + lang.name + ' (' + lang.locale + ')...');
            
            // Click language pill
            await page.click('[data-locale="' + lang.locale + '"]');
            await page.waitForTimeout(1500);
            
            // Verify active state
            const activePill = await page.locator('.lang-pill.active, .mobile-lang-pill.active').textContent();
            if (activePill.includes(lang.locale.toUpperCase())) {
                console.log('   ✅ ' + lang.name + ' pill is active');
            } else {
                console.log('   ❌ ' + lang.name + ' pill not properly activated');
            }
            
            // Test RTL for Hebrew
            if (lang.locale === 'he') {
                const htmlDir = await page.getAttribute('html', 'dir');
                if (htmlDir === 'rtl') {
                    console.log('   ✅ Hebrew RTL applied correctly');
                } else {
                    console.log('   ❌ Hebrew RTL not applied');
                }
            }
            
            // Check for data-i18n attributes preservation
            const dataI18nElements = await page.locator('[data-i18n]').count();
            console.log('   Data-i18n elements preserved: ' + dataI18nElements);
            
            // Test tab labels translation
            try {
                const monthlyTab = await page.locator('[data-i18n="pricing.content.plans.monthly.name"]').textContent();
                const yearlyTab = await page.locator('[data-i18n="pricing.content.plans.annual.name"]').textContent();
                
                if (monthlyTab && yearlyTab) {
                    console.log('   ✅ Tab labels found: "' + monthlyTab + '" / "' + yearlyTab + '"');
                } else {
                    console.log('   ❌ Tab labels not found or not translated');
                }
            } catch (e) {
                console.log('   ❌ Error reading tab labels: ' + e.message);
            }
            
            // Test feature list translation
            const featureElements = await page.locator('[data-i18n*="pricing.content.features"]').count();
            if (featureElements > 0) {
                console.log('   ✅ Feature list elements found: ' + featureElements);
            } else {
                console.log('   ❌ Feature list elements missing');
            }
        }
        
        // Test 4: Monthly/Yearly tabs functionality
        console.log('\n4. Testing Monthly/Yearly tab switching...');
        
        // Click Monthly tab
        await page.click('[data-w-tab="Tab 1"]');
        await page.waitForTimeout(500);
        
        const monthlyActive = await page.locator('.pricing-plan-tab-link.w--current').count();
        const monthlyPeriodText = await page.locator('[data-i18n="pricing.content.plans.monthly.period"]').first().textContent();
        console.log('Monthly tab active: ' + (monthlyActive > 0) + ', Period text: "' + monthlyPeriodText + '"');
        
        // Click Yearly tab
        await page.click('[data-w-tab="Tab 2"]');
        await page.waitForTimeout(500);
        
        const yearlyActive = await page.locator('.pricing-plan-tab-link.w--current').count();
        const yearlyPeriodText = await page.locator('[data-i18n="pricing.content.plans.annual.period"]').first().textContent();
        console.log('Yearly tab active: ' + (yearlyActive > 0) + ', Period text: "' + yearlyPeriodText + '"');
        
        if (monthlyActive && yearlyActive) {
            console.log('✅ Tab switching works correctly');
        } else {
            console.log('❌ Tab switching not working properly');
        }
        
        // Test 5: System integration verification
        console.log('\n5. Verifying dual-system architecture...');
        
        // Check for unified-language-manager.js
        const hasUnifiedManager = consoleMessages.some(msg => 
            msg.includes('unified-language-manager') || 
            msg.includes('LanguageManager') ||
            msg.includes('language-ready')
        );
        
        // Check for nd-pricing-integration.js
        const hasPricingIntegration = consoleMessages.some(msg => 
            msg.includes('ND Pricing Integration') ||
            msg.includes('pricing data from database')
        );
        
        console.log('System 1 (Unified Language Manager): ' + (hasUnifiedManager ? '✅ Active' : '❌ Missing'));
        console.log('System 2 (Pricing Integration): ' + (hasPricingIntegration ? '✅ Active' : '❌ Missing'));
        
        // Test 6: Responsiveness check
        console.log('\n6. Testing responsive behavior...');
        
        // Test mobile view
        await page.setViewportSize({ width: 375, height: 667 });
        await page.waitForTimeout(1000);
        
        const mobileMenuVisible = await page.locator('.mobile-language-switchers').isVisible();
        const desktopMenuVisible = await page.locator('.lang-pills').isVisible();
        
        console.log('Mobile menu visible: ' + (mobileMenuVisible ? '✅' : '❌'));
        console.log('Desktop menu hidden: ' + (!desktopMenuVisible ? '✅' : '❌'));
        
        // Reset to desktop view
        await page.setViewportSize({ width: 1200, height: 800 });
        await page.waitForTimeout(500);
        
        // Final verification - screenshot
        await page.screenshot({ path: 'pricing-test-result.png', fullPage: true });
        console.log('\n📸 Screenshot saved as pricing-test-result.png');
        
        // Summary
        console.log('\n📊 TEST SUMMARY:');
        console.log('Total console messages: ' + consoleMessages.length);
        console.log('Critical errors: ' + criticalErrors.length);
        console.log('Page errors: ' + errors.length);
        
        const passedTests = [
            criticalErrors.length === 0,
            langPills >= 3,
            hasUnifiedManager,
            hasPricingIntegration,
            mobileMenuVisible
        ].filter(Boolean).length;
        
        console.log('Passed tests: ' + passedTests + '/5');
        
        if (passedTests >= 4) {
            console.log('🎉 OVERALL RESULT: PASS - Dual-system architecture working correctly');
        } else {
            console.log('⚠️  OVERALL RESULT: NEEDS ATTENTION - Some issues detected');
        }
        
    } catch (error) {
        console.error('❌ Test failed with error:', error);
    } finally {
        await browser.close();
    }
}

// Run the test
if (require.main === module) {
    testPricingPage().catch(console.error);
}

module.exports = { testPricingPage };
