const { chromium } = require('playwright');

async function testHebrewFinalVerification() {
    console.log('🔵 QA TEST: Hebrew Desktop Navigation - FINAL VERIFICATION');
    console.log('Testing URL: http://localhost:3005/he/home.html');
    console.log('Viewport: 1920x1080 (Desktop)');
    console.log('================================================================');
    
    const browser = await chromium.launch({ headless: false, slowMo: 1000 });
    const page = await browser.newPage();
    
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    const consoleMessages = [];
    const jsErrors = [];
    const networkErrors = [];
    
    page.on('console', msg => consoleMessages.push({ type: msg.type(), text: msg.text() }));
    page.on('pageerror', error => jsErrors.push(error.toString()));
    page.on('response', response => {
        if (response.url().includes('desktop-menu-force-visible.css')) {
            networkErrors.push({
                url: response.url(),
                status: response.status(),
                statusText: response.statusText()
            });
        }
    });
    
    try {
        console.log('📍 Step 1: Loading page...');
        await page.goto('http://localhost:3005/he/home.html', { 
            waitUntil: 'networkidle',
            timeout: 30000 
        });
        
        await page.waitForTimeout(3000);
        
        console.log('📍 Step 2: Verifying CSS loading...');
        
        if (networkErrors.length > 0) {
            console.log('📋 Desktop Menu CSS Loading:');
            networkErrors.forEach((error, i) => {
                console.log('  ' + (i+1) + '. ' + error.status + ' - ' + error.url);
            });
        }
        
        console.log('📍 Step 3: Checking navigation visibility...');
        
        const navCheck = await page.evaluate(() => {
            const navbar = document.querySelector('.navbar');
            const navMenu = document.querySelector('.nav-menu') || document.querySelector('.w-nav-menu');
            const navLinks = document.querySelectorAll('.nav-link');
            const hamburger = document.querySelector('.w-nav-button');
            
            let navMenuInfo = null;
            if (navMenu) {
                const computed = window.getComputedStyle(navMenu);
                const rect = navMenu.getBoundingClientRect();
                navMenuInfo = {
                    display: computed.display,
                    visibility: computed.visibility,
                    opacity: computed.opacity,
                    position: computed.position,
                    width: rect.width,
                    height: rect.height,
                    isVisible: rect.width > 0 && rect.height > 0 && computed.visibility !== 'hidden' && computed.display !== 'none'
                };
            }
            
            return {
                hasNavbar: !!navbar,
                hasNavMenu: !!navMenu,
                linkCount: navLinks.length,
                hasHamburger: !!hamburger,
                hamburgerVisible: hamburger ? hamburger.offsetWidth > 0 && hamburger.offsetHeight > 0 : false,
                navMenuInfo: navMenuInfo,
                viewportWidth: window.innerWidth
            };
        });
        
        console.log('🔍 Navigation Analysis:');
        console.log('  └ Has navbar:', navCheck.hasNavbar ? '✅' : '❌');
        console.log('  └ Has nav menu:', navCheck.hasNavMenu ? '✅' : '❌');
        console.log('  └ Navigation links:', navCheck.linkCount);
        console.log('  └ Has hamburger button:', navCheck.hasHamburger ? '✅' : '❌');
        console.log('  └ Hamburger visible:', navCheck.hamburgerVisible ? '❌ BAD' : '✅ GOOD');
        console.log('  └ Viewport width:', navCheck.viewportWidth + 'px');
        
        if (navCheck.navMenuInfo) {
            console.log('📊 Nav Menu Details:');
            Object.entries(navCheck.navMenuInfo).forEach(([key, value]) => {
                const status = key === 'isVisible' ? (value ? '✅ GOOD' : '❌ BAD') : value;
                console.log('  └ ' + key + ':', status);
            });
        }
        
        console.log('📍 Step 4: Testing menu item functionality...');
        
        if (navCheck.navMenuInfo && navCheck.navMenuInfo.isVisible) {
            const linkTest = await page.evaluate(() => {
                const links = Array.from(document.querySelectorAll('.nav-link'));
                return links.slice(0, 3).map(link => ({
                    text: link.textContent.trim(),
                    href: link.getAttribute('href'),
                    isClickable: link.offsetWidth > 0 && link.offsetHeight > 0
                }));
            });
            
            console.log('🔗 Navigation Links:');
            linkTest.forEach((link, i) => {
                console.log('  ' + (i+1) + '. "' + link.text + '" → ' + link.href + ' (' + (link.isClickable ? '✅ Clickable' : '❌ Not clickable') + ')');
            });
        }
        
        console.log('📍 Step 5: Checking language selector...');
        
        const langSelector = await page.evaluate(() => {
            const selectors = document.querySelectorAll('.language-selector, [class*="language"], [class*="lang"], .dropdown');
            return {
                count: selectors.length,
                found: Array.from(selectors).slice(0, 3).map(el => ({
                    className: el.className,
                    text: el.textContent.trim().substring(0, 50),
                    visible: el.offsetWidth > 0 && el.offsetHeight > 0
                }))
            };
        });
        
        console.log('🌐 Language Selector:');
        console.log('  └ Elements found:', langSelector.count);
        langSelector.found.forEach((el, i) => {
            console.log('  ' + (i+1) + '. ' + el.className + ' - "' + el.text + '" (' + (el.visible ? '✅ Visible' : '❌ Hidden') + ')');
        });
        
        console.log('📍 Step 6: Final screenshot...');
        
        const screenshotPath = '/Users/michaelmishayev/Desktop/newCode/hebrew-desktop-final-test.png';
        await page.screenshot({ path: screenshotPath, fullPage: false });
        console.log('📸 Screenshot saved:', screenshotPath);
        
        console.log('📍 Step 7: 5-second persistence test...');
        await page.waitForTimeout(5000);
        
        const persistenceCheck = await page.evaluate(() => {
            const navMenu = document.querySelector('.nav-menu') || document.querySelector('.w-nav-menu');
            if (!navMenu) return { stillExists: false };
            
            const computed = window.getComputedStyle(navMenu);
            const rect = navMenu.getBoundingClientRect();
            
            return {
                stillExists: true,
                stillVisible: rect.width > 0 && rect.height > 0 && computed.display !== 'none' && computed.visibility !== 'hidden'
            };
        });
        
        console.log('🔄 Persistence Check:', persistenceCheck.stillVisible ? '✅ PASS' : '❌ FAIL');
        
        console.log('================================================================');
        console.log('📋 FINAL RESULTS SUMMARY:');
        console.log('  └ Desktop Navigation Menu:', navCheck.navMenuInfo && navCheck.navMenuInfo.isVisible ? '✅ PASS' : '❌ FAIL');
        console.log('  └ Menu Persistence:', persistenceCheck.stillVisible ? '✅ PASS' : '❌ FAIL');
        console.log('  └ Navigation Links:', navCheck.linkCount > 0 ? '✅ PASS' : '❌ FAIL');
        console.log('  └ Mobile Button Hidden:', !navCheck.hamburgerVisible ? '✅ PASS' : '❌ FAIL');
        console.log('  └ Language Selector:', langSelector.count > 0 ? '✅ PASS' : '❌ FAIL');
        console.log('  └ JavaScript Errors:', jsErrors.length === 0 ? '✅ PASS' : '❌ FAIL (' + jsErrors.length + ' errors)');
        
        if (jsErrors.length > 0) {
            console.log('🚨 JavaScript Errors:');
            jsErrors.forEach((error, i) => {
                console.log('  ' + (i+1) + '. ' + error);
            });
        }
        
        const enhancedIntegrationErrors = consoleMessages.filter(msg => 
            msg.text.includes('enhanced-integration') && msg.type === 'error'
        );
        
        if (enhancedIntegrationErrors.length > 0) {
            console.log('🔧 Enhanced Integration Issues:');
            enhancedIntegrationErrors.forEach((msg, i) => {
                console.log('  ' + (i+1) + '. ' + msg.text);
            });
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        await browser.close();
    }
}

testHebrewFinalVerification().catch(console.error);
