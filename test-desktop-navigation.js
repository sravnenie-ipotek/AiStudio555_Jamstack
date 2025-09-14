const { chromium } = require('playwright');

async function testDesktopNavigation() {
    console.log('🔵 Starting Desktop Navigation Test...');
    
    const browser = await chromium.launch({ 
        headless: false,
        args: ['--no-sandbox', '--disable-dev-shm-usage']
    });
    
    const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 }
    });
    
    const page = await context.newPage();
    const jsErrors = [];
    
    // Enable console and error logging
    page.on('console', msg => {
        const type = msg.type();
        const text = msg.text();
        if (type === 'error') {
            jsErrors.push(text);
            console.log('❌ Console error:', text);
        }
    });
    
    page.on('pageerror', error => {
        jsErrors.push(error.message);
        console.log('❌ Page Error:', error.message);
    });
    
    try {
        console.log('📍 Navigating to http://localhost:3005/home.html');
        await page.goto('http://localhost:3005/home.html', { 
            waitUntil: 'networkidle', 
            timeout: 30000 
        });
        
        console.log('⏱️  Waiting 3 seconds for full load...');
        await page.waitForTimeout(3000);
        
        // Take initial screenshot
        await page.screenshot({ 
            path: 'desktop-navigation-initial.png', 
            fullPage: false 
        });
        console.log('📸 Initial screenshot: desktop-navigation-initial.png');
        
        // TEST 1: Navigation menu visibility
        console.log('\n🔍 TEST 1: Desktop navigation menu visibility');
        
        const navSelectors = [
            'nav',
            '.navbar', 
            '.nav',
            '[role="navigation"]',
            '.w-nav',
            '#nav'
        ];
        
        let navFound = false;
        let navElement = null;
        
        for (const selector of navSelectors) {
            try {
                navElement = page.locator(selector).first();
                if (await navElement.isVisible()) {
                    navFound = true;
                    console.log(`✅ Found visible nav: ${selector}`);
                    break;
                }
            } catch (e) {
                // Continue to next selector
            }
        }
        
        console.log(`Navigation menu visible: ${navFound ? '✅ PASS' : '❌ FAIL'}`);
        
        // TEST 2: Language selector
        console.log('\n🔍 TEST 2: Language selector visibility');
        
        const langSelectors = [
            '.language-selector',
            '#language-selector', 
            '[class*="lang"]',
            'select[name*="lang"]',
            '.dropdown.language'
        ];
        
        let langFound = false;
        for (const selector of langSelectors) {
            try {
                if (await page.locator(selector).first().isVisible()) {
                    langFound = true;
                    console.log(`✅ Found language selector: ${selector}`);
                    break;
                }
            } catch (e) {
                // Continue
            }
        }
        
        console.log(`Language selector visible: ${langFound ? '✅ PASS' : '❌ FAIL'}`);
        
        // TEST 3: Menu items clickability
        console.log('\n🔍 TEST 3: Menu items clickability');
        
        const menuItems = await page.locator('nav a, .navbar a, .nav a, .w-nav a').all();
        let clickableCount = 0;
        
        for (let i = 0; i < Math.min(menuItems.length, 10); i++) {
            try {
                const item = menuItems[i];
                const isVisible = await item.isVisible();
                const href = await item.getAttribute('href');
                const text = (await item.textContent() || '').trim();
                
                if (isVisible && href && text) {
                    clickableCount++;
                    console.log(`  ✅ "${text}" -> ${href}`);
                }
            } catch (e) {
                // Skip this item
            }
        }
        
        console.log(`Clickable menu items: ${clickableCount} ${clickableCount >= 3 ? '✅ PASS' : '❌ FAIL'}`);
        
        // TEST 4: Check for menu-related errors
        console.log('\n🔍 TEST 4: JavaScript errors');
        
        const menuErrors = jsErrors.filter(error => 
            error.toLowerCase().includes('menu') || 
            error.toLowerCase().includes('nav') ||
            error.toLowerCase().includes('dropdown')
        );
        
        console.log(`Menu-related JS errors: ${menuErrors.length} ${menuErrors.length === 0 ? '✅ PASS' : '❌ FAIL'}`);
        
        if (menuErrors.length > 0) {
            menuErrors.forEach(error => console.log(`  ❌ ${error}`));
        }
        
        // TEST 5: Menu stability
        console.log('\n🔍 TEST 5: Menu stability test');
        
        await page.waitForTimeout(2000);
        const stable1 = navFound && await navElement.isVisible().catch(() => false);
        
        await page.waitForTimeout(3000);
        const stable2 = navFound && await navElement.isVisible().catch(() => false);
        
        console.log(`Menu visible after 2s: ${stable1 ? '✅' : '❌'}`);
        console.log(`Menu visible after 5s: ${stable2 ? '✅' : '❌'}`);
        console.log(`Menu stability: ${stable1 && stable2 ? '✅ PASS' : '❌ FAIL'}`);
        
        // Final screenshot
        await page.screenshot({ 
            path: 'desktop-navigation-final.png', 
            fullPage: true 
        });
        console.log('📸 Final screenshot: desktop-navigation-final.png');
        
        // SUMMARY
        console.log('\n📊 TEST RESULTS SUMMARY:');
        console.log(`1. Navigation menu visible: ${navFound ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`2. Language selector visible: ${langFound ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`3. Menu items clickable (≥3): ${clickableCount >= 3 ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`4. No menu JS errors: ${menuErrors.length === 0 ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`5. Menu stable: ${stable1 && stable2 ? '✅ PASS' : '❌ FAIL'}`);
        
        const overallPass = navFound && langFound && clickableCount >= 3 && menuErrors.length === 0 && stable1 && stable2;
        console.log(`\n🎯 OVERALL: ${overallPass ? '✅ PASS - Desktop navigation working correctly' : '❌ FAIL - Issues detected'}`);
        
    } catch (error) {
        console.error('❌ Test failed:', error);
        await page.screenshot({ path: 'test-error.png' });
    } finally {
        await browser.close();
    }
}

testDesktopNavigation().catch(console.error);
