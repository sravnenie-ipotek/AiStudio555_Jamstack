const { chromium } = require('playwright');

async function test() {
    console.log('🔵 QA TEST: Pricing Page Verification');
    
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        await page.goto('http://localhost:3005/pricing.html');
        await page.waitForTimeout(3000);
        
        console.log('1. Testing Hebrew tab labels...');
        await page.click('[data-locale="he"]');
        await page.waitForTimeout(2000);
        
        const tabs = await page.$$eval('.tab-link', els => els.map(el => el.textContent.trim()));
        console.log('Tab texts:', tabs);
        
        const hasHebrew = tabs.some(t => t.includes('חודשי') || t.includes('שנתי'));
        const hasRussian = tabs.some(t => t.includes('Ежемесячно'));
        
        console.log(hasHebrew ? '✅ Hebrew found' : '❌ No Hebrew');
        console.log(hasRussian ? '❌ Russian found' : '✅ No Russian');
        
        console.log('\n2. Testing RTL...');
        const dir = await page.getAttribute('html', 'dir');
        console.log('HTML dir:', dir);
        
        console.log('\n3. Testing navigation...');
        const nav = await page.$$eval('.navbar a', els => els.map(el => el.textContent.trim()).slice(0, 3));
        console.log('Hebrew nav:', nav);
        
        await page.screenshot({ path: 'pricing-test.png', fullPage: true });
        console.log('\nScreenshot saved: pricing-test.png');
        
    } catch (error) {
        console.log('Error:', error.message);
    } finally {
        await browser.close();
    }
}

test();
