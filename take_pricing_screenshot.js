const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Set viewport to desktop size
  await page.setViewportSize({ width: 1200, height: 800 });
  
  try {
    // Navigate to the Hebrew pricing page
    await page.goto('http://localhost:3005/pricing.html?locale=he', { 
      waitUntil: 'networkidle',
      timeout: 10000 
    });
    
    // Wait for page to be fully loaded
    await page.waitForTimeout(2000);
    
    // Take full page screenshot
    await page.screenshot({ 
      path: '/Users/michaelmishayev/Desktop/newCode/pricing_he_full.png',
      fullPage: true 
    });
    console.log('Full page screenshot saved as pricing_he_full.png');
    
    // Take screenshot of header area where pricing pills should be
    await page.screenshot({ 
      path: '/Users/michaelmishayev/Desktop/newCode/pricing_pills_focused.png',
      clip: { x: 0, y: 0, width: 1200, height: 600 }
    });
    console.log('Header area screenshot saved as pricing_pills_focused.png');
    
    // Get page title and URL for verification
    const title = await page.title();
    const url = page.url();
    console.log('Page title: ' + title);
    console.log('Page URL: ' + url);
    
  } catch (error) {
    console.error('Error taking screenshot: ' + error.message);
  } finally {
    await browser.close();
  }
})();
