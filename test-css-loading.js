const { chromium } = require('playwright');

async function testCSSLoading() {
    console.log('🔵 QA TEST: CSS Loading Verification');
    console.log('Testing URL: http://localhost:3005/he/home.html');
    console.log('================================================================');
    
    const browser = await chromium.launch({ headless: false, slowMo: 500 });
    const page = await browser.newPage();
    
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    const networkErrors = [];
    page.on('response', response => {
        if (response.url().includes('.css') && !response.ok()) {
            networkErrors.push(response.status() + ' - ' + response.url());
        }
    });
    
    try {
        await page.goto('http://localhost:3005/he/home.html', { waitUntil: 'networkidle' });
        
        console.log('📍 Checking CSS file loading...');
        
        const stylesheets = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
            return links.map(link => ({
                href: link.href,
                status: 'loaded',
                exists: true
            }));
        });
        
        console.log('📋 Loaded Stylesheets:');
        stylesheets.forEach((css, i) => {
            const filename = css.href.split('/').pop();
            console.log('  ' + (i+1) + '. ' + filename + ' - ' + css.href);
        });
        
        if (networkErrors.length > 0) {
            console.log('🚨 CSS Loading Errors:');
            networkErrors.forEach((error, i) => {
                console.log('  ' + (i+1) + '. ' + error);
            });
        }
        
        console.log('📍 Manually applying CSS fix...');
        
        await page.addStyleTag({
            content: `
                @media screen and (min-width: 992px) {
                    .w-nav-menu,
                    .nav-menu.w-nav-menu,
                    nav .w-nav-menu,
                    .navbar .w-nav-menu,
                    .w-nav .w-nav-menu,
                    body .w-nav-menu,
                    html .w-nav-menu {
                        display: flex !important;
                        visibility: visible !important;
                        opacity: 1 !important;
                        position: static !important;
                        align-items: center !important;
                        gap: 20px !important;
                    }
                    
                    .w-nav-button {
                        display: none !important;
                    }
                }
            `
        });
        
        await page.waitForTimeout(1000);
        
        const afterCSS = await page.evaluate(() => {
            const navMenu = document.querySelector('.nav-menu') || document.querySelector('.w-nav-menu');
            if (!navMenu) return { error: 'Still no nav menu found' };
            
            const computed = window.getComputedStyle(navMenu);
            const rect = navMenu.getBoundingClientRect();
            
            return {
                display: computed.display,
                visibility: computed.visibility,
                opacity: computed.opacity,
                width: rect.width,
                height: rect.height,
                isVisible: rect.width > 0 && rect.height > 0
            };
        });
        
        console.log('📋 After Manual CSS Application:');
        Object.entries(afterCSS).forEach(([key, value]) => {
            console.log('  └ ' + key + ': ' + value);
        });
        
        const screenshotPath = '/Users/michaelmishayev/Desktop/newCode/hebrew-desktop-css-test.png';
        await page.screenshot({ path: screenshotPath, fullPage: false });
        console.log('📸 Screenshot saved:', screenshotPath);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        await browser.close();
    }
}

testCSSLoading().catch(console.error);
