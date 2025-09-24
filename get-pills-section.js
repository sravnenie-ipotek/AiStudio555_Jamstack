const { chromium } = require('playwright');

async function getPillsSection() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
    
    try {
        await page.goto('http://localhost:3005/pricing.html?locale=he', { waitUntil: 'networkidle' });
        await page.waitForTimeout(3000);
        
        // Look for the section with "Invest in Future" title
        await page.evaluate(() => {
            const sections = Array.from(document.querySelectorAll('*')).filter(el => 
                el.textContent && el.textContent.includes('Invest in Future')
            );
            if (sections.length > 0) {
                sections[0].scrollIntoView({ behavior: 'instant', block: 'start' });
            }
        });
        
        await page.waitForTimeout(1000);
        
        // Take screenshot of the area with title and pills
        await page.screenshot({ 
            path: '/tmp/invest-future-section.png',
            clip: { x: 0, y: 400, width: 1920, height: 400 }
        });
        
        console.log('Invest in Future section screenshot saved');
        
    } finally {
        await browser.close();
    }
}

getPillsSection();
