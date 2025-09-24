const { chromium } = require('playwright');

async function testPricingPage() {
    console.log('🔵 QA TEST: Pricing Page Translation Verification\n');
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 500
    });
    const context = await browser.newContext({
        viewport: { width: 1280, height: 720 }
    });
    const page = await context.newPage();
    
    const errors = [];
    
    page.on('console', msg => {
        if (msg.type() === 'error') {
            errors.push(msg.text());
            console.log('Console Error:', msg.text());
        }
    });
    
    try {
        console.log('Loading pricing page...');
        await page.goto('http://localhost:3005/pricing.html', { 
            waitUntil: 'networkidle',
            timeout: 15000 
        });
        
        await page.waitForTimeout(3000);
        
        console.log('\nTEST RESULTS:\n');
        
        // Test 1: Hebrew Tab Labels Fix
        console.log('1. Testing Hebrew Tab Labels Fix');
        console.log('   Switching to Hebrew...');
        
        await page.click('[data-locale="he"]');
        await page.waitForTimeout(2000);
        
        const pricingTabs = await page.$$eval('.tab-link', elements => 
            elements.map(el => el.textContent.trim())
        ).catch(() => []);
        
        console.log('   Tab texts:', pricingTabs);
        
        const hasHebrew = pricingTabs.some(text => text.includes('חודשי') || text.includes('שנתי'));
        const hasRussian = pricingTabs.some(text => text.includes('Ежемесячно') || text.includes('Ежегодно'));
        
        if (hasHebrew && !hasRussian) {
            console.log('   ✅ PASS: Hebrew tabs correct, no Russian text');
        } else if (hasRussian) {
            console.log('   ❌ FAIL: Russian text found in Hebrew mode');
        } else {
            console.log('   ⚠️  PARTIAL: Manual verification needed');
        }
        
        // Test 2: Language switching
        console.log('\n2. Testing Language Switching');
        
        const langs = ['en', 'ru', 'he'];
        for (const lang of langs) {
            await page.click(`[data-locale="${lang}"]`);
            await page.waitForTimeout(1000);
            
            const navItems = await page.$$eval('.navbar a', elements => 
                elements.map(el => el.textContent.trim()).filter(t => t.length > 0).slice(0, 3)
            ).catch(() => []);
            
            console.log(`   ${lang.toUpperCase()} nav:`, navItems);
        }
        
        // Test 3: RTL Check
        console.log('\n3. Testing RTL Layout');
        
        await page.click('[data-locale="he"]');
        await page.waitForTimeout(1000);
        
        const htmlDir = await page.getAttribute('html', 'dir');
        console.log('   HTML dir:', htmlDir);
        
        if (htmlDir === 'rtl') {
            console.log('   ✅ PASS: RTL active');
        } else {
            console.log('   ⚠️  INFO: RTL not detected');
        }
        
        // Test 4: Console Errors
        console.log('\n4. Console Error Check');
        if (errors.length === 0) {
            console.log('   ✅ PASS: No errors');
        } else {
            console.log('   ❌ ISSUES:', errors.length, 'errors found');
        }
        
        // Test 5: Race Condition
        console.log('\n5. Race Condition Test');
        
        for (let i = 0; i < 3; i++) {
            await page.click('[data-locale="he"]');
            await page.waitForTimeout(200);
            await page.click('[data-locale="ru"]');
            await page.waitForTimeout(200);
        }
        
        await page.click('[data-locale="he"]');
        await page.waitForTimeout(2000);
        
        const finalTabs = await page.$$eval('.tab-link', elements => 
            elements.map(el => el.textContent.trim())
        ).catch(() => []);
        
        const stillHasRussian = finalTabs.some(text => text.includes('Ежемесячно'));
        
        if (!stillHasRussian) {
            console.log('   ✅ PASS: No Russian after rapid switching');
        } else {
            console.log('   ❌ FAIL: Russian text persists');
        }
        
        console.log('\nTEST COMPLETE');
        
        await page.screenshot({ 
            path: '/Users/michaelmishayev/Desktop/newCode/pricing-test-result.png', 
            fullPage: true 
        });
        console.log('Screenshot saved: pricing-test-result.png');
        
    } catch (error) {
        console.log('Test error:', error.message);
    } finally {
        await browser.close();
    }
}

testPricingPage();
