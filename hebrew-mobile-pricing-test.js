const { chromium } = require('playwright');

async function testMobileHebrewPricing() {
    console.log('📱 MOBILE HEBREW PRICING TEST');
    console.log('=============================');
    
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: 375, height: 812 }, // iPhone X dimensions
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X)'
    });
    
    const page = await context.newPage();
    
    try {
        await page.goto('http://localhost:3005/pricing.html', { waitUntil: 'networkidle' });
        await page.click('.lang-pill[data-locale="he"]');
        await page.waitForTimeout(3000);
        
        // Check mobile layout
        const monthlyVisible = await page.isVisible('.pricing-plan-tab-link[data-w-tab="Tab 1"]');
        const yearlyVisible = await page.isVisible('.pricing-plan-tab-link[data-w-tab="Tab 2"]');
        
        console.log('📱 Mobile pills visible - Monthly:', monthlyVisible, 'Yearly:', yearlyVisible);
        
        if (monthlyVisible && yearlyVisible) {
            const monthlyText = await page.textContent('.pricing-plan-tab-link[data-w-tab="Tab 1"]');
            const yearlyText = await page.textContent('.pricing-plan-tab-link[data-w-tab="Tab 2"]');
            
            console.log('📱 Mobile Hebrew text - Monthly:', monthlyText?.trim(), 'Yearly:', yearlyText?.trim());
        }
        
        await page.screenshot({ 
            path: '/Users/michaelmishayev/Desktop/newCode/hebrew-mobile-pricing-final.png',
            fullPage: true 
        });
        
        console.log('📱 Mobile test completed - Screenshot saved');
        
    } catch (error) {
        console.error('❌ Mobile test failed:', error.message);
    }
    
    await browser.close();
}

testMobileHebrewPricing().catch(console.error);
