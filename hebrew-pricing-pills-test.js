const { chromium } = require('playwright');

async function testHebrewPricingPills() {
    console.log('🎯 HEBREW PRICING PILLS POSITIONING TEST');
    console.log('========================================');
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 300
    });
    
    const page = await browser.newPage({ 
        viewport: { width: 1920, height: 1080 } 
    });
    
    const results = {
        pillsVisible: false,
        pillsCentered: false,
        noTextOverlap: false,
        hebrewTranslation: { monthly: false, yearly: false },
        pillFunctionality: { monthly: false, yearly: false },
        visualPositioning: {}
    };
    
    try {
        // Step 1: Navigate to pricing page
        console.log('📄 1. Navigating to pricing page...');
        await page.goto('http://localhost:3005/pricing.html', { 
            waitUntil: 'networkidle',
            timeout: 30000
        });
        await page.waitForTimeout(2000);
        
        // Step 2: Switch to Hebrew
        console.log('🌐 2. Switching to Hebrew language...');
        await page.click('.lang-pill[data-locale="he"]');
        await page.waitForTimeout(3000);
        
        // Verify Hebrew is active
        const htmlDir = await page.getAttribute('html', 'dir');
        const hebrewActive = await page.getAttribute('.lang-pill[data-locale="he"]', 'class');
        console.log('   ✓ HTML dir:', htmlDir);
        console.log('   ✓ Hebrew pill active:', hebrewActive && hebrewActive.includes('active'));
        
        // Step 3: Locate and analyze pricing pills
        console.log('📊 3. Analyzing pricing pills positioning...');
        
        // Find all tab links
        const tabLinks = await page.locator('.pricing-plan-tab-link').all();
        console.log('   ✓ Found', tabLinks.length, 'pricing tab links');
        
        if (tabLinks.length >= 2) {
            results.pillsVisible = true;
            
            // Get text content and positioning
            const monthlyElement = tabLinks[0];
            const yearlyElement = tabLinks[1];
            
            const monthlyText = await monthlyElement.textContent();
            const yearlyText = await yearlyElement.textContent();
            
            console.log('   ✓ Monthly text:', monthlyText);
            console.log('   ✓ Yearly text:', yearlyText);
            
            // Check Hebrew content
            results.hebrewTranslation.monthly = /[א-ת]/.test(monthlyText || '');
            results.hebrewTranslation.yearly = /[א-ת]/.test(yearlyText || '');
            
            // Get bounding boxes for positioning analysis
            const monthlyBox = await monthlyElement.boundingBox();
            const yearlyBox = await yearlyElement.boundingBox();
            
            results.visualPositioning = {
                monthly: monthlyBox,
                yearly: yearlyBox,
                overlap: false,
                alignment: 'unknown'
            };
            
            if (monthlyBox && yearlyBox) {
                // Check for overlap
                const overlap = !(monthlyBox.x + monthlyBox.width < yearlyBox.x || 
                                yearlyBox.x + yearlyBox.width < monthlyBox.x ||
                                monthlyBox.y + monthlyBox.height < yearlyBox.y || 
                                yearlyBox.y + yearlyBox.height < monthlyBox.y);
                
                results.visualPositioning.overlap = overlap;
                results.noTextOverlap = !overlap;
                
                // Check if pills are reasonably centered (within parent container)
                const containerElement = await page.locator('.pricing-plan-tab-menu').first();
                const containerBox = await containerElement.boundingBox();
                
                if (containerBox) {
                    const containerCenter = containerBox.x + containerBox.width / 2;
                    const pillsCenter = (monthlyBox.x + monthlyBox.width/2 + yearlyBox.x + yearlyBox.width/2) / 2;
                    const centerDiff = Math.abs(containerCenter - pillsCenter);
                    
                    results.pillsCentered = centerDiff < 50; // Within 50px tolerance
                    
                    console.log('   ✓ Container center:', containerCenter.toFixed(0));
                    console.log('   ✓ Pills center:', pillsCenter.toFixed(0));
                    console.log('   ✓ Center difference:', centerDiff.toFixed(0) + 'px');
                }
                
                console.log('   ✓ Monthly pill position:', monthlyBox.x.toFixed(0) + ', ' + monthlyBox.y.toFixed(0));
                console.log('   ✓ Yearly pill position:', yearlyBox.x.toFixed(0) + ', ' + yearlyBox.y.toFixed(0));
                console.log('   ✓ Pills overlapping:', overlap);
            }
        }
        
        // Step 4: Test pill functionality
        console.log('🔄 4. Testing pill switching functionality...');
        
        try {
            // Test Monthly -> Yearly
            await page.click('.pricing-plan-tab-link[data-w-tab="Tab 2"]');
            await page.waitForTimeout(1000);
            
            const yearlyActiveClass = await page.getAttribute('.pricing-plan-tab-link[data-w-tab="Tab 2"]', 'class');
            results.pillFunctionality.yearly = yearlyActiveClass && yearlyActiveClass.includes('w--current');
            
            // Test Yearly -> Monthly
            await page.click('.pricing-plan-tab-link[data-w-tab="Tab 1"]');
            await page.waitForTimeout(1000);
            
            const monthlyActiveClass = await page.getAttribute('.pricing-plan-tab-link[data-w-tab="Tab 1"]', 'class');
            results.pillFunctionality.monthly = monthlyActiveClass && monthlyActiveClass.includes('w--current');
            
            console.log('   ✓ Yearly pill switching:', results.pillFunctionality.yearly);
            console.log('   ✓ Monthly pill switching:', results.pillFunctionality.monthly);
        } catch (e) {
            console.log('   ❌ Error testing pill functionality:', e.message);
        }
        
        // Step 5: Take focused screenshot of pricing section
        console.log('📸 5. Taking focused screenshot of pricing section...');
        
        const pricingSection = await page.locator('.pricing-wrapper, .section-pricing').first();
        if (await pricingSection.count() > 0) {
            await pricingSection.screenshot({ 
                path: '/Users/michaelmishayev/Desktop/newCode/hebrew-pricing-pills-focused.png'
            });
            console.log('   ✓ Focused screenshot saved: hebrew-pricing-pills-focused.png');
        }
        
        // Full page screenshot for context
        await page.screenshot({ 
            path: '/Users/michaelmishayev/Desktop/newCode/hebrew-pricing-pills-full.png',
            fullPage: true 
        });
        console.log('   ✓ Full page screenshot saved: hebrew-pricing-pills-full.png');
        
    } catch (error) {
        console.error('❌ Test execution failed:', error.message);
    }
    
    // Generate detailed report
    console.log('');
    console.log('📋 DETAILED TEST REPORT');
    console.log('======================');
    console.log('');
    
    // Visual Positioning Analysis
    console.log('📐 VISUAL POSITIONING:');
    console.log('   Pills Visible:', results.pillsVisible ? '✅ YES' : '❌ NO');
    console.log('   Pills Centered:', results.pillsCentered ? '✅ YES' : '⚠️  NO');
    console.log('   No Text Overlap:', results.noTextOverlap ? '✅ YES' : '❌ OVERLAP DETECTED');
    console.log('');
    
    // Translation Analysis
    console.log('🌐 TRANSLATION ACCURACY:');
    console.log('   Monthly Tab Hebrew:', results.hebrewTranslation.monthly ? '✅ YES' : '❌ NO');
    console.log('   Yearly Tab Hebrew:', results.hebrewTranslation.yearly ? '✅ YES' : '❌ NO');
    console.log('');
    
    // Functionality Analysis
    console.log('⚡ FUNCTIONALITY:');
    console.log('   Monthly Tab Switching:', results.pillFunctionality.monthly ? '✅ WORKS' : '❌ BROKEN');
    console.log('   Yearly Tab Switching:', results.pillFunctionality.yearly ? '✅ WORKS' : '❌ BROKEN');
    console.log('');
    
    // Overall Assessment
    const criticalIssues = [];
    const minorIssues = [];
    
    if (!results.pillsVisible) criticalIssues.push('Pills not visible');
    if (!results.noTextOverlap) criticalIssues.push('Text overlap detected');
    if (!results.pillFunctionality.monthly || !results.pillFunctionality.yearly) criticalIssues.push('Tab switching broken');
    
    if (!results.pillsCentered) minorIssues.push('Pills not centered');
    if (!results.hebrewTranslation.monthly || !results.hebrewTranslation.yearly) minorIssues.push('Missing Hebrew translations');
    
    console.log('🎯 OVERALL ASSESSMENT:');
    if (criticalIssues.length === 0) {
        console.log('   Status: ✅ FUNCTIONAL');
        console.log('   The pricing pills work correctly in Hebrew mode');
    } else {
        console.log('   Status: ❌ ISSUES DETECTED');
        console.log('   Critical issues found:', criticalIssues.join(', '));
    }
    
    if (minorIssues.length > 0) {
        console.log('   Minor issues:', minorIssues.join(', '));
    }
    
    console.log('');
    console.log('🔍 MANUAL VERIFICATION CHECKLIST:');
    console.log('   □ Pills appear centered in the pricing section');
    console.log('   □ Monthly/Yearly text is fully Hebrew');
    console.log('   □ No text overlaps with other elements');
    console.log('   □ Clicking switches between Monthly/Yearly plans');
    console.log('   □ Active pill is visually distinct');
    console.log('   □ RTL layout looks natural');
    
    await browser.close();
    
    return results;
}

// Run the test
testHebrewPricingPills().catch(console.error);
