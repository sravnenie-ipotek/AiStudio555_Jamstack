const { chromium } = require('playwright');

async function testDesktopMenuVisibility() {
    console.log('🔵 QA TEST: Desktop Menu Visibility Analysis');
    console.log('Testing URL: http://localhost:3005/he/home.html');
    console.log('================================================================');
    
    const browser = await chromium.launch({ headless: false, slowMo: 500 });
    const page = await browser.newPage();
    
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    const consoleMessages = [];
    page.on('console', msg => consoleMessages.push(msg.text()));
    page.on('pageerror', error => consoleMessages.push('ERROR: ' + error.toString()));
    
    try {
        await page.goto('http://localhost:3005/he/home.html', { waitUntil: 'networkidle' });
        await page.waitForTimeout(2000);
        
        console.log('📍 Step 1: Checking navbar structure...');
        
        const navbar = await page.$('.navbar');
        const navMenu = await page.$('.nav-menu');
        const navLinks = await page.$$('.nav-link');
        
        console.log('🔍 Navbar Elements:');
        console.log('  └ .navbar exists:', !!navbar);
        console.log('  └ .nav-menu exists:', !!navMenu);
        console.log('  └ .nav-link count:', navLinks.length);
        
        if (navbar) {
            const navbarStyles = await navbar.evaluate(el => {
                const computed = window.getComputedStyle(el);
                return {
                    display: computed.display,
                    visibility: computed.visibility,
                    opacity: computed.opacity,
                    position: computed.position,
                    zIndex: computed.zIndex,
                    height: computed.height,
                    width: computed.width
                };
            });
            
            console.log('📊 Navbar Computed Styles:');
            Object.entries(navbarStyles).forEach(([key, value]) => {
                console.log('  └', key + ':', value);
            });
        }
        
        if (navMenu) {
            const navMenuStyles = await navMenu.evaluate(el => {
                const computed = window.getComputedStyle(el);
                const rect = el.getBoundingClientRect();
                return {
                    display: computed.display,
                    visibility: computed.visibility,
                    opacity: computed.opacity,
                    position: computed.position,
                    top: rect.top,
                    left: rect.left,
                    width: rect.width,
                    height: rect.height,
                    inViewport: rect.top >= 0 && rect.left >= 0 && rect.bottom <= window.innerHeight && rect.right <= window.innerWidth
                };
            });
            
            console.log('📊 Nav Menu Computed Styles & Position:');
            Object.entries(navMenuStyles).forEach(([key, value]) => {
                console.log('  └', key + ':', value);
            });
        }
        
        console.log('📍 Step 2: Testing responsive breakpoint...');
        
        // Check if we're in mobile mode due to CSS media queries
        const isMobileLayout = await page.evaluate(() => {
            const navbar = document.querySelector('.navbar');
            if (!navbar) return 'navbar not found';
            
            // Check for mobile classes or styles
            const hasWebflowMenuButton = document.querySelector('.w-nav-button');
            const navMenuDisplay = window.getComputedStyle(document.querySelector('.nav-menu') || document.createElement('div')).display;
            
            return {
                hasMenuButton: !!hasWebflowMenuButton,
                navMenuDisplay: navMenuDisplay,
                viewportWidth: window.innerWidth,
                bodyWidth: document.body.offsetWidth
            };
        });
        
        console.log('📱 Mobile Layout Check:');
        Object.entries(isMobileLayout).forEach(([key, value]) => {
            console.log('  └', key + ':', value);
        });
        
        console.log('📍 Step 3: Force showing navigation...');
        
        // Try to force show the navigation
        await page.evaluate(() => {
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu) {
                navMenu.style.cssText += `
                    display: flex !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                    position: relative !important;
                    transform: none !important;
                `;
            }
            
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                navbar.style.cssText += `
                    display: block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                `;
            }
        });
        
        await page.waitForTimeout(1000);
        
        console.log('📍 Step 4: Screenshot after forcing visibility...');
        const screenshotPath = '/Users/michaelmishayev/Desktop/newCode/hebrew-desktop-nav-forced.png';
        await page.screenshot({ path: screenshotPath, fullPage: false });
        console.log('📸 Screenshot saved:', screenshotPath);
        
        // Final check
        const finalVisibility = await page.evaluate(() => {
            const navMenu = document.querySelector('.nav-menu');
            const navbar = document.querySelector('.navbar');
            
            return {
                navMenuVisible: navMenu ? navMenu.offsetWidth > 0 && navMenu.offsetHeight > 0 : false,
                navbarVisible: navbar ? navbar.offsetWidth > 0 && navbar.offsetHeight > 0 : false,
                navMenuRect: navMenu ? navMenu.getBoundingClientRect() : null,
                navbarRect: navbar ? navbar.getBoundingClientRect() : null
            };
        });
        
        console.log('📋 Final Visibility Check:');
        Object.entries(finalVisibility).forEach(([key, value]) => {
            console.log('  └', key + ':', typeof value === 'object' ? JSON.stringify(value, null, 4) : value);
        });
        
        console.log('================================================================');
        console.log('📢 Important Console Messages:');
        consoleMessages.filter(msg => 
            msg.includes('error') || 
            msg.includes('Enhanced') || 
            msg.includes('nav') ||
            msg.includes('menu')
        ).forEach((msg, i) => {
            console.log('  ' + (i+1) + '.', msg);
        });
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        await browser.close();
    }
}

testDesktopMenuVisibility().catch(console.error);
