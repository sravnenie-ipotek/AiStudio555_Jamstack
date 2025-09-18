const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Track network failures
    const failures = [];
    page.on('response', response => {
      if (!response.ok()) {
        failures.push({
          url: response.url(),
          status: response.status()
        });
      }
    });
    
    // Navigate to the page
    await page.goto('http://localhost:3005/home.html', { 
      waitUntil: 'domcontentloaded',
      timeout: 15000 
    });
    
    // Wait for potential dynamic loading
    await page.waitForTimeout(2000);
    
    // Check language switcher
    const result = await page.evaluate(() => {
      const switcher = document.querySelector('.language-switchers');
      const styles = switcher ? window.getComputedStyle(switcher) : null;
      
      return {
        exists: !!switcher,
        display: styles ? styles.display : 'N/A',
        visibility: styles ? styles.visibility : 'N/A',
        opacity: styles ? styles.opacity : 'N/A',
        innerText: switcher ? switcher.innerText.substring(0, 50) : 'N/A'
      };
    });
    
    console.log('Language Switcher Status:', JSON.stringify(result, null, 2));
    console.log('Network Failures:', failures.length);
    
    if (failures.length > 0) {
      console.log('Failed Resources:');
      failures.forEach(f => console.log(`  ${f.status}: ${f.url}`));
    }
    
    await browser.close();
    
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
