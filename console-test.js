const { chromium } = require('playwright');

async function checkConsoleOutput() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    // Capture console logs
    const logs = [];
    page.on('console', msg => {
        logs.push(`${msg.type()}: ${msg.text()}`);
    });
    
    try {
        await page.goto('http://localhost:3005/pricing.html');
        await page.waitForTimeout(1000);
        
        // Switch to Hebrew
        await page.locator('.lang-pill[data-locale="he"]').first().click();
        await page.waitForTimeout(3000);
        
        console.log('Console output during Hebrew translation:');
        logs.forEach(log => {
            if (log.includes('Translation') || log.includes('plans') || log.includes('Hebrew')) {
                console.log(log);
            }
        });
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await browser.close();
    }
}

checkConsoleOutput().catch(console.error);
