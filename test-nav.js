const { chromium } = require('playwright');

async function testDesktopNavigation() {
    console.log('🔵 Starting Desktop Navigation Test...');
    
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
    const page = await context.newPage();
    const jsErrors = [];
    
    page.on('console', msg => {
        if (msg.type() === 'error') {
            jsErrors.push(msg.text());
            console.log('❌ Console error:', msg.text());
        }
    });
    
    try {
        await page.goto('http://localhost:3005/home.html', { waitUntil: 'networkidle' });
        await page.waitForTimeout(3000);
        
        await page.screenshot({ path: 'desktop-nav-test.png' });
        
        // Test navigation visibility
        const navVisible = await page.locator('nav, .navbar, .nav').first().isVisible().catch(() => false);
        console.log('Navigation visible:', navVisible ? '✅ PASS' : '❌ FAIL');
        
        // Test language selector
        const langVisible = await page.locator('.language-selector, #language-selector').first().isVisible().catch(() => false);
        console.log('Language selector:', langVisible ? '✅ PASS' : '❌ FAIL');
        
        // Test menu items
        const menuCount = await page.locator('nav a, .navbar a').count();
        console.log('Menu items found:', menuCount, menuCount >= 3 ? '✅ PASS' : '❌ FAIL');
        
        // Test stability
        await page.waitForTimeout(5000);
        const stillVisible = await page.locator('nav, .navbar, .nav').first().isVisible().catch(() => false);
        console.log('Menu stable after 5s:', stillVisible ? '✅ PASS' : '❌ FAIL');
        
        console.log('\n📊 SUMMARY:');
        console.log('Navigation:', navVisible ? '✅' : '❌');
        console.log('Language selector:', langVisible ? '✅' : '❌');
        console.log('Menu items:', menuCount >= 3 ? '✅' : '❌');
        console.log('Stability:', stillVisible ? '✅' : '❌');
        
    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        await browser.close();
    }
}

testDesktopNavigation();
