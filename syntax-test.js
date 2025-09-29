const playwright = require('playwright');

async function testSyntax() {
    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    const jsErrors = [];
    
    page.on('pageerror', error => {
        jsErrors.push({
            message: error.message,
            line: error.lineNumber,
            column: error.columnNumber,
            stack: error.stack
        });
        console.error('JS ERROR:', error.message);
        console.error('LINE:', error.lineNumber, 'COLUMN:', error.columnNumber);
    });
    
    try {
        await page.goto('http://localhost:3005/admin-newdesign.html');
        await page.waitForTimeout(3000);
        
        console.log('Syntax errors found:', jsErrors.length);
        jsErrors.forEach(error => {
            console.log('ERROR:', error.message);
            console.log('LOCATION: Line', error.line, 'Column', error.column);
        });
        
    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        await browser.close();
    }
}

testSyntax().catch(console.error);
