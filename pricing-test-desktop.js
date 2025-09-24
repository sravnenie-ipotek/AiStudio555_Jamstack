const { chromium } = require('playwright');

async function test() {
    console.log('QA TEST: Pricing Page Translation Verification');
    console.log('==========================================');
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 300
    });
    const page = await browser.newPage();
    
    try {
        console.log('Loading pricing page...');
        await page.goto('http://localhost:3005/pricing.html', { waitUntil: 'networkidle' });
        await page.waitForTimeout(3000);
        
        console.log('Page loaded successfully\n');
        
        // Test 1: Hebrew Tab Labels Fix
        console.log('TEST 1: Hebrew Tab Labels Fix');
        console.log('   Switching to Hebrew...');
        
        // Try desktop language pill first
        try {
            await page.click('.lang-pill[data-locale="he"]');
            console.log('   Clicked desktop Hebrew pill');
        } catch {
            await page.click('.mobile-lang-pill[data-locale="he"]');
            console.log('   Clicked mobile Hebrew pill');
        }
        
        await page.waitForTimeout(2500);
        
        const pricingTabs = await page.$$eval('.tab-link', elements => 
            elements.map(el => el.textContent.trim())
        ).catch(() => []);
        
        console.log('   Tab texts:', pricingTabs);
        
        const hasHebrew = pricingTabs.some(tab => 
            tab.includes('חודשי') || tab.includes('שנתי')
        );
        
        const hasRussian = pricingTabs.some(tab => 
            tab.includes('Ежемесячно') || tab.includes('Ежегодно')
        );
        
        if (hasHebrew && !hasRussian) {
            console.log('   ✅ PASS: Hebrew tabs working');
        } else if (hasRussian) {
            console.log('   ❌ FAIL: Russian text in Hebrew mode');
        } else {
            console.log('   ⚠️ PARTIAL: Need verification');
        }
        
        // Test 2: RTL Check
        console.log('\nTEST 2: RTL Layout');
        const htmlDir = await page.getAttribute('html', 'dir');
        console.log('   HTML dir:', htmlDir);
        
        if (htmlDir === 'rtl') {
            console.log('   ✅ PASS: RTL active');
        } else {
            console.log('   ⚠️ INFO: RTL not detected');
        }
        
        // Test 3: Race Condition
        console.log('\nTEST 3: Race Condition Test');
        for (let i = 0; i < 3; i++) {
            try {
                await page.click('.lang-pill[data-locale="he"]');
            } catch {
                await page.click('.mobile-lang-pill[data-locale="he"]');
            }
            await page.waitForTimeout(200);
            
            try {
                await page.click('.lang-pill[data-locale="ru"]');
            } catch {
                await page.click('.mobile-lang-pill[data-locale="ru"]');
            }
            await page.waitForTimeout(200);
        }
        
        // Final Hebrew check
        try {
            await page.click('.lang-pill[data-locale="he"]');
        } catch {
            await page.click('.mobile-lang-pill[data-locale="he"]');
        }
        await page.waitForTimeout(2000);
        
        const finalTabs = await page.$$eval('.tab-link', elements => 
            elements.map(el => el.textContent.trim())
        ).catch(() => []);
        
        const stillRussian = finalTabs.some(text => text.includes('Ежемесячно'));
        
        console.log('   Final tabs:', finalTabs);
        
        if (!stillRussian) {
            console.log('   ✅ PASS: No Russian after rapid switching');
        } else {
            console.log('   ❌ FAIL: Russian text persists');
        }
        
        // Screenshot
        await page.screenshot({ 
            path: '/Users/michaelmishayev/Desktop/newCode/pricing-test-final.png', 
            fullPage: true 
        });
        
        console.log('\nScreenshot saved: pricing-test-final.png');
        
    } catch (error) {
        console.log('Test error:', error.message);
    } finally {
        await browser.close();
    }
}

test();
