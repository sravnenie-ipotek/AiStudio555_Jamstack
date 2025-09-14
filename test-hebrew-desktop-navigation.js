const { chromium } = require('playwright');

async function testHebrewDesktopNavigation() {
    console.log('🔵 QA TEST: Hebrew Desktop Navigation Verification');
    console.log('Testing URL: http://localhost:3005/he/home.html');
    console.log('Viewport: 1920x1080 (Desktop)');
    console.log('================================================================');
    
    const browser = await chromium.launch({ headless: false, slowMo: 1000 });
    const page = await browser.newPage();
    
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    const consoleMessages = [];
    const jsErrors = [];
    
    page.on('console', msg => {
        consoleMessages.push({
            type: msg.type(),
            text: msg.text()
        });
    });
    
    page.on('pageerror', error => {
        jsErrors.push(error.toString());
    });
    
    try {
        console.log('📍 Step 1: Loading Hebrew homepage...');
        await page.goto('http://localhost:3005/he/home.html', { 
            waitUntil: 'networkidle',
            timeout: 30000 
        });
        
        await page.waitForTimeout(3000);
        
        console.log('📍 Step 2: Checking navigation menu...');
        
        const navbar = page.locator('.navbar, nav, [class*="nav"]').first();
        const navLinks = page.locator('nav a, .navbar a, [class*="nav"] a');
        const languageSelector = page.locator('.language-selector, [class*="language"], [class*="lang"], .dropdown');
        
        const hasNavbar = await navbar.count() > 0;
        const linkCount = await navLinks.count();
        const hasLangSelector = await languageSelector.count() > 0;
        
        console.log('🔍 Navigation Elements:');
        console.log('  └ Navbar container:', hasNavbar ? '✅ FOUND' : '❌ NOT FOUND');
        console.log('  └ Navigation links:', linkCount, 'found');
        console.log('  └ Language selector:', hasLangSelector ? '✅ FOUND' : '❌ NOT FOUND');
        
        let isVisible = false;
        if (hasNavbar) {
            isVisible = await navbar.isVisible();
            console.log('  └ Menu visibility:', isVisible ? '✅ VISIBLE' : '❌ HIDDEN');
        }
        
        console.log('📍 Step 3: Testing clickability...');
        
        const allNavLinks = await navLinks.all();
        let clickableLinks = 0;
        
        for (let i = 0; i < Math.min(allNavLinks.length, 5); i++) {
            try {
                const link = allNavLinks[i];
                const href = await link.getAttribute('href');
                const text = await link.textContent();
                const isEnabled = await link.isEnabled();
                
                console.log('  └ Link', i+1 + ':', '"' + (text || '').trim() + '"', 'href:', href, isEnabled ? '✅' : '❌');
                if (isEnabled) clickableLinks++;
            } catch (e) {
                console.log('  └ Link', i+1 + ':', 'Error -', e.message);
            }
        }
        
        console.log('📍 Step 4: Screenshot and persistence test...');
        
        const screenshotPath = '/Users/michaelmishayev/Desktop/newCode/hebrew-desktop-nav-test.png';
        await page.screenshot({ path: screenshotPath, fullPage: false });
        console.log('📸 Screenshot saved:', screenshotPath);
        
        await page.waitForTimeout(5000);
        const stillVisible = hasNavbar ? await navbar.isVisible() : false;
        
        console.log('================================================================');
        console.log('📋 FINAL RESULTS:');
        console.log('  └ Navigation Menu:', (hasNavbar && isVisible) ? '✅ PASS' : '❌ FAIL');
        console.log('  └ Menu Persistence:', stillVisible ? '✅ PASS' : '❌ FAIL');
        console.log('  └ Clickable Links:', clickableLinks + '/' + Math.min(allNavLinks.length, 5));
        console.log('  └ JavaScript Errors:', jsErrors.length);
        
        if (jsErrors.length > 0) {
            console.log('🚨 JavaScript Errors:');
            jsErrors.forEach((error, i) => {
                console.log('  ' + (i+1) + '.', error);
            });
        }
        
        const importantMessages = consoleMessages.filter(msg => 
            msg.text.includes('enhanced-integration') || 
            msg.text.includes('error') || 
            msg.text.includes('Failed') ||
            msg.type === 'error'
        );
        
        if (importantMessages.length > 0) {
            console.log('📢 Important Console Messages:');
            importantMessages.forEach((msg, i) => {
                console.log('  ' + (i+1) + '.', '[' + msg.type.toUpperCase() + ']', msg.text);
            });
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        await browser.close();
    }
}

testHebrewDesktopNavigation().catch(console.error);
