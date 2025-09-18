const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });
    
    // Navigate to the page
    await page.goto('http://localhost:3005/home.html', { 
      waitUntil: 'networkidle2',
      timeout: 15000 
    });
    
    // Wait for page to fully load
    await page.waitForTimeout(3000);
    
    // Take full page screenshot
    await page.screenshot({ 
      path: 'home-full-page.png',
      fullPage: false
    });
    
    // Take navbar screenshot
    await page.screenshot({ 
      path: 'home-navbar-area.png',
      clip: { x: 0, y: 0, width: 1200, height: 120 }
    });
    
    // Check elements in navbar area
    const navbarInfo = await page.evaluate(() => {
      const navbar = document.querySelector('.navbar');
      const navbarContent = document.querySelector('.navbar-content');
      const languageSwitchers = document.querySelector('.language-switchers');
      const navbarButton = document.querySelector('.navbar-button-wrapper');
      
      return {
        navbar: {
          exists: !!navbar,
          styles: navbar ? {
            display: window.getComputedStyle(navbar).display,
            position: window.getComputedStyle(navbar).position,
            zIndex: window.getComputedStyle(navbar).zIndex
          } : null
        },
        navbarContent: {
          exists: !!navbarContent,
          styles: navbarContent ? {
            display: window.getComputedStyle(navbarContent).display,
            justifyContent: window.getComputedStyle(navbarContent).justifyContent
          } : null
        },
        languageSwitchers: {
          exists: !!languageSwitchers,
          styles: languageSwitchers ? {
            display: window.getComputedStyle(languageSwitchers).display,
            visibility: window.getComputedStyle(languageSwitchers).visibility,
            opacity: window.getComputedStyle(languageSwitchers).opacity,
            position: window.getComputedStyle(languageSwitchers).position,
            zIndex: window.getComputedStyle(languageSwitchers).zIndex
          } : null,
          rect: languageSwitchers ? languageSwitchers.getBoundingClientRect() : null
        },
        navbarButton: {
          exists: !!navbarButton,
          styles: navbarButton ? {
            display: window.getComputedStyle(navbarButton).display
          } : null
        }
      };
    });
    
    console.log('Navbar Analysis:', JSON.stringify(navbarInfo, null, 2));
    
    console.log('Screenshots saved:');
    console.log('- home-full-page.png');
    console.log('- home-navbar-area.png');
    
    await browser.close();
    
  } catch (error) {
    console.error('Error:', error.message);
  }
})();
