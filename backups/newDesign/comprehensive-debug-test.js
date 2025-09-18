const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({ 
      headless: false,
      defaultViewport: { width: 1200, height: 800 },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Capture all console messages
    const consoleMessages = [];
    page.on('console', msg => {
      consoleMessages.push({
        type: msg.type(),
        text: msg.text(),
        location: msg.location()
      });
    });
    
    // Capture all network activity
    const networkActivity = [];
    page.on('response', response => {
      networkActivity.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText(),
        ok: response.ok()
      });
    });
    
    console.log('Navigating to http://localhost:3005/home.html...');
    
    // Navigate to the page
    await page.goto('http://localhost:3005/home.html', { 
      waitUntil: 'networkidle0',
      timeout: 20000 
    });
    
    // Wait for everything to load
    await page.waitForTimeout(5000);
    
    // Filter for 404 errors
    const errors404 = networkActivity.filter(activity => activity.status === 404);
    
    console.log('\n=== CONSOLE MESSAGES ===');
    consoleMessages.forEach((msg, index) => {
      if (msg.type === 'error' || msg.text.includes('404') || msg.text.includes('Failed')) {
        console.log(index + 1 + '. [' + msg.type.toUpperCase() + '] ' + msg.text);
        if (msg.location && msg.location.url) {
          console.log('   Location: ' + msg.location.url + ':' + msg.location.lineNumber);
        }
      }
    });
    
    console.log('\n=== 404 NETWORK ERRORS ===');
    if (errors404.length === 0) {
      console.log('No 404 errors found in network activity.');
    } else {
      errors404.forEach((error, index) => {
        console.log(index + 1 + '. ' + error.status + ' ' + error.statusText);
        console.log('   URL: ' + error.url);
      });
    }
    
    // Check language switcher status
    const langSwitcherStatus = await page.evaluate(() => {
      const switcher = document.querySelector('.language-switchers');
      return {
        exists: !!switcher,
        visible: switcher ? window.getComputedStyle(switcher).display !== 'none' : false,
        html: switcher ? switcher.outerHTML.substring(0, 500) : null
      };
    });
    
    console.log('\n=== LANGUAGE SWITCHER STATUS ===');
    console.log('Exists:', langSwitcherStatus.exists);
    console.log('Visible:', langSwitcherStatus.visible);
    
    // Take final screenshot
    await page.screenshot({ 
      path: 'final-debug-screenshot.png',
      clip: { x: 0, y: 0, width: 1200, height: 120 }
    });
    
    console.log('\nScreenshot saved: final-debug-screenshot.png');
    console.log('\nBrowser will stay open for 10 seconds for manual inspection...');
    
    // Keep browser open for manual inspection
    await page.waitForTimeout(10000);
    
    await browser.close();
    
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
