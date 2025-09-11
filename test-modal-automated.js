// Automated test to verify modal functionality
const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    // Test pages
    const pages = [
        'http://localhost:3005/home.html',
        'http://localhost:3005/pricing.html',
        'http://localhost:3005/blog.html'
    ];
    
    for (const url of pages) {
        console.log(`\nTesting: ${url}`);
        await page.goto(url, { waitUntil: 'networkidle2' });
        
        // Check if modal functions exist
        const modalExists = await page.evaluate(() => {
            return {
                showModal: typeof window.showModal === 'function',
                hideModal: typeof window.hideModal === 'function',
                resetModalToForm: typeof window.resetModalToForm === 'function'
            };
        });
        
        console.log('Modal functions:', modalExists);
        
        // Find and click Sign Up button
        const signUpButton = await page.$('a[href*="sign-up"]');
        if (signUpButton) {
            // Check if click is prevented
            const prevented = await page.evaluate(() => {
                const button = document.querySelector('a[href*="sign-up"]');
                let prevented = false;
                button.addEventListener('click', (e) => {
                    prevented = e.defaultPrevented;
                }, { once: true });
                button.click();
                return prevented;
            });
            
            console.log('Sign Up button found, click prevented:', prevented);
            
            // Check if modal is visible
            const modalVisible = await page.evaluate(() => {
                const modal = document.getElementById('contactModal');
                return modal && modal.style.display !== 'none';
            });
            
            console.log('Modal visible:', modalVisible);
        } else {
            console.log('No Sign Up button found');
        }
    }
    
    await browser.close();
})();
