const { chromium } = require('playwright');

async function testHebrewPricingPillsSimple() {
    console.log('🎯 SIMPLE HEBREW PRICING PILLS TEST');
    console.log('===================================');
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 500
    });
    
    const page = await browser.newPage({ 
        viewport: { width: 1920, height: 1080 } 
    });
    
    try {
        // Step 1: Navigate to pricing page
        console.log('📄 1. Loading pricing page...');
        await page.goto('http://localhost:3005/pricing.html', { 
            waitUntil: 'networkidle',
            timeout: 30000
        });
        await page.waitForTimeout(2000);
        
        // Step 2: Switch to Hebrew
        console.log('🌐 2. Switching to Hebrew...');
        await page.click('.lang-pill[data-locale="he"]');
        await page.waitForTimeout(4000);
        
        // Verify Hebrew mode
        const htmlDir = await page.getAttribute('html', 'dir');
        const htmlLang = await page.getAttribute('html', 'lang');
        console.log('   ✓ HTML direction:', htmlDir);
        console.log('   ✓ HTML language:', htmlLang);
        
        // Step 3: Check Monthly/Yearly pills specifically
        console.log('📊 3. Analyzing Monthly/Yearly pills...');
        
        // Wait for content to load
        await page.waitForSelector('.pricing-plan-tab-link', { timeout: 10000 });
        
        // Get all tab links
        const monthlyTab = await page.locator('.pricing-plan-tab-link').first();
        const yearlyTab = await page.locator('.pricing-plan-tab-link').nth(1);
        
        // Get text content
        const monthlyText = await monthlyTab.textContent();
        const yearlyText = await yearlyTab.textContent();
        
        console.log('   ✓ Monthly tab text:', monthlyText?.trim());
        console.log('   ✓ Yearly tab text:', yearlyText?.trim());
        
        // Check for Hebrew characters
        const monthlyHebrew = /[א-ת]/.test(monthlyText || '');
        const yearlyHebrew = /[א-ת]/.test(yearlyText || '');
        
        console.log('   ✓ Monthly has Hebrew:', monthlyHebrew);
        console.log('   ✓ Yearly has Hebrew:', yearlyHebrew);
        
        // Step 4: Test tab functionality
        console.log('🔄 4. Testing tab switching...');
        
        // Click Yearly tab
        console.log('   • Clicking Yearly tab...');
        await yearlyTab.click();
        await page.waitForTimeout(2000);
        
        // Check if yearly is now active
        const yearlyClass = await yearlyTab.getAttribute('class');
        const yearlyActive = yearlyClass?.includes('w--current') || false;
        
        console.log('   ✓ Yearly tab active after click:', yearlyActive);
        
        // Click Monthly tab
        console.log('   • Clicking Monthly tab...');
        await monthlyTab.click();
        await page.waitForTimeout(2000);
        
        // Check if monthly is now active
        const monthlyClass = await monthlyTab.getAttribute('class');
        const monthlyActive = monthlyClass?.includes('w--current') || false;
        
        console.log('   ✓ Monthly tab active after click:', monthlyActive);
        
        // Step 5: Visual positioning check
        console.log('📐 5. Checking visual positioning...');
        
        const monthlyBox = await monthlyTab.boundingBox();
        const yearlyBox = await yearlyTab.boundingBox();
        
        if (monthlyBox && yearlyBox) {
            // Check if pills are horizontally aligned
            const heightDiff = Math.abs(monthlyBox.y - yearlyBox.y);
            const aligned = heightDiff < 5; // Within 5px tolerance
            
            // Check if they don't overlap
            const noOverlap = monthlyBox.x + monthlyBox.width < yearlyBox.x || 
                             yearlyBox.x + yearlyBox.width < monthlyBox.x;
            
            console.log('   ✓ Monthly position: (' + monthlyBox.x.toFixed(0) + ', ' + monthlyBox.y.toFixed(0) + ')');
            console.log('   ✓ Yearly position: (' + yearlyBox.x.toFixed(0) + ', ' + yearlyBox.y.toFixed(0) + ')');
            console.log('   ✓ Pills aligned horizontally:', aligned);
            console.log('   ✓ No text overlap:', noOverlap);
        }
        
        // Step 6: Take final screenshot
        console.log('📸 6. Taking screenshots...');
        
        // Focus on the pricing section
        await page.locator('.section-pricing').first().screenshot({ 
            path: '/Users/michaelmishayev/Desktop/newCode/hebrew-pills-section-final.png'
        });
        
        // Full page
        await page.screenshot({ 
            path: '/Users/michaelmishayev/Desktop/newCode/hebrew-pills-full-final.png',
            fullPage: true 
        });
        
        console.log('   ✓ Screenshots saved');
        
        // Step 7: Generate report
        console.log('');
        console.log('📋 TEST RESULTS SUMMARY');
        console.log('======================');
        console.log('');
        
        console.log('🌐 LANGUAGE SETUP:');
        console.log('   Hebrew Mode Active: ' + (htmlDir === 'rtl' ? '✅ YES' : '❌ NO'));
        console.log('   RTL Layout Applied: ' + (htmlDir === 'rtl' ? '✅ YES' : '❌ NO'));
        console.log('');
        
        console.log('📊 TRANSLATION QUALITY:');
        console.log('   Monthly Tab Hebrew: ' + (monthlyHebrew ? '✅ YES (' + monthlyText?.trim() + ')' : '❌ NO'));
        console.log('   Yearly Tab Hebrew: ' + (yearlyHebrew ? '✅ YES (' + yearlyText?.trim() + ')' : '❌ NO'));
        console.log('');
        
        console.log('⚡ FUNCTIONALITY:');
        console.log('   Monthly Tab Switching: ' + (monthlyActive ? '✅ WORKS' : '❌ BROKEN'));
        console.log('   Yearly Tab Switching: ' + (yearlyActive ? '✅ WORKS' : '❌ BROKEN'));
        console.log('');
        
        console.log('📐 VISUAL LAYOUT:');
        if (monthlyBox && yearlyBox) {
            const aligned = Math.abs(monthlyBox.y - yearlyBox.y) < 5;
            const noOverlap = monthlyBox.x + monthlyBox.width < yearlyBox.x || 
                             yearlyBox.x + yearlyBox.width < monthlyBox.x;
            
            console.log('   Pills Horizontally Aligned: ' + (aligned ? '✅ YES' : '⚠️  NO'));
            console.log('   No Text Overlap: ' + (noOverlap ? '✅ YES' : '❌ OVERLAP'));
        } else {
            console.log('   Position Analysis: ❌ COULD NOT MEASURE');
        }
        console.log('');
        
        // Overall assessment
        const allGood = htmlDir === 'rtl' && monthlyHebrew && yearlyHebrew && 
                       monthlyActive && yearlyActive;
        
        console.log('🎯 OVERALL STATUS:');
        if (allGood) {
            console.log('   ✅ ALL TESTS PASSED');
            console.log('   The Hebrew pricing pills are working correctly!');
        } else {
            console.log('   ⚠️  SOME ISSUES DETECTED');
            console.log('   Manual verification recommended for full functionality');
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
    
    await browser.close();
}

testHebrewPricingPillsSimple().catch(console.error);
