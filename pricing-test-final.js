const { chromium } = require('playwright');

async function testPricingPage() {
    console.log('🔵 QA TEST: Pricing Page Translation Verification');
    
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
        }
    });
    
    try {
        console.log('Loading pricing page...');
        await page.goto('http://localhost:3005/pricing.html', { 
            waitUntil: 'networkidle',
            timeout: 15000 
        });
        
        await page.waitForTimeout(3000);
        
        console.log('
=== TEST RESULTS ===
');
        
        // Test 1: Hebrew Tab Labels
        console.log('1. Hebrew Tab Labels Fix');
        await page.click('[data-locale="he"]');
        await page.waitForTimeout(2000);
        
        const tabTexts = await page.25482eval('.tab-link', els => 
            els.map(el => el.textContent.trim())
        ).catch(() => []);
        
        console.log('Tab texts:', tabTexts);
        
        const hasHebrew = tabTexts.some(t => t.includes('חודשי') || t.includes('שנתי'));
        const hasRussian = tabTexts.some(t => t.includes('Ежемесячно'));
        
        if (hasHebrew && !hasRussian) {
            console.log('✅ PASS: Hebrew tabs working correctly');
        } else if (hasRussian) {
            console.log('❌ FAIL: Russian text found in Hebrew mode');
        } else {
            console.log('⚠️ PARTIAL: Need manual verification');
        }
        
        // Test 2: RTL Layout
        console.log('
2. RTL Layout Test');
        const htmlDir = await page.getAttribute('html', 'dir');
        console.log('HTML dir attribute:', htmlDir);
        
        if (htmlDir === 'rtl') {
            console.log('✅ PASS: RTL layout active');
        } else {
            console.log('⚠️ INFO: RTL not in HTML attr');
        }
        
        // Test 3: Language Navigation
        console.log('
3. Language Navigation Test');
        const langs = ['en', 'ru', 'he'];
        for (const lang of langs) {
            await page.click('[data-locale="' + lang + '"]');
            await page.waitForTimeout(1000);
            
            const navItems = await page.25482eval('.navbar a', els => 
                els.map(el => el.textContent.trim()).filter(t => t.length > 0).slice(0, 3)
            ).catch(() => []);
            
            console.log(lang.toUpperCase() + ' navigation:', navItems);
        }
        
        // Test 4: Race Condition
        console.log('
4. Race Condition Test');
        for (let i = 0; i < 3; i++) {
            await page.click('[data-locale="he"]');
            await page.waitForTimeout(200);
            await page.click('[data-locale="ru"]');
            await page.waitForTimeout(200);
        }
        
        await page.click('[data-locale="he"]');
        await page.waitForTimeout(2000);
        
        const finalTabs = await page.25482eval('.tab-link', els => 
            els.map(el => el.textContent.trim())
        ).catch(() => []);
        
        const stillRussian = finalTabs.some(t => t.includes('Ежемесячно'));
        
        if (!stillRussian) {
            console.log('✅ PASS: Race condition fixed');
        } else {
            console.log('❌ FAIL: Russian text persists after switching');
        }
        
        // Test 5: Console Errors
        console.log('
5. Console Errors');
        if (errors.length === 0) {
            console.log('✅ PASS: No console errors');
        } else {
            console.log('❌ ISSUES: Found', errors.length, 'errors');
            errors.slice(0, 3).forEach(err => console.log('  -', err));
        }
        
        await page.screenshot({ 
            path: '/Users/michaelmishayev/Desktop/newCode/pricing-test-result.png', 
            fullPage: true 
        });
        console.log('
Screenshot saved: pricing-test-result.png');
        
    } catch (error) {
        console.log('Test failed:', error.message);
    } finally {
        await browser.close();
    }
}

testPricingPage();