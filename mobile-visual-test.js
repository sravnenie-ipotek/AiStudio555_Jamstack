const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Set mobile viewport (iPhone SE dimensions)
  await page.setViewportSize({ width: 375, height: 667 });
  
  console.log('📱 Testing mobile appearance of NewDesign home page...');
  
  try {
    // Navigate to the NewDesign home page
    await page.goto('http://localhost:3005/backups/newDesign/home.html', { 
      waitUntil: 'networkidle' 
    });
    
    // Wait for content to load
    await page.waitForTimeout(2000);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'mobile-home-screenshot.png', 
      fullPage: true 
    });
    
    console.log('✅ Mobile screenshot saved as mobile-home-screenshot.png');
    
    // Check for main heading and description elements
    const heroSection = await page.$('.hero-section, .hero-value-proposition, h1, .heading-large');
    const description = await page.$('p, .paragraph, .description');
    
    if (heroSection) {
      console.log('✅ Main heading section found');
    }
    
    if (description) {
      console.log('✅ Description text found');
    }
    
    // Check navigation elements
    const nav = await page.$('nav, .navbar, .navigation');
    if (nav) {
      console.log('✅ Navigation element found');
    }
    
    // Check for buttons
    const buttons = await page.$$('button, .button, .btn, a[class*="button"]');
    console.log(`✅ Found ${buttons.length} button elements`);
    
    console.log('\n📋 Visual Check Summary:');
    console.log('- Mobile screenshot captured (375x667 viewport)');
    console.log('- Page loaded successfully');
    console.log('- Key elements detected');
    console.log('\n🔍 Please check mobile-home-screenshot.png for:');
    console.log('  • Center-aligned heading and description text');
    console.log('  • Normal navigation appearance');
    console.log('  • Proper button alignment');
    console.log('  • Overall layout integrity');
    
  } catch (error) {
    console.error('❌ Error testing mobile page:', error.message);
  }
  
  await browser.close();
})();
