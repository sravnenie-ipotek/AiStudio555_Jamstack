const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Track failed requests with details
    const failures = [];
    page.on('response', response => {
      if (!response.ok()) {
        failures.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText()
        });
      }
    });
    
    // Navigate to the page
    await page.goto('http://localhost:3005/home.html', { 
      waitUntil: 'networkidle2',
      timeout: 15000 
    });
    
    console.log('=== 404 ERRORS FOUND ===');
    failures.forEach((failure, idx) => {
      console.log('Error ' + (idx + 1) + ': ' + failure.status + ' ' + failure.statusText);
      console.log('   URL: ' + failure.url);
      console.log('');
    });
    
    if (failures.length === 0) {
      console.log('No 404 errors found!');
    }
    
    await browser.close();
    
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
