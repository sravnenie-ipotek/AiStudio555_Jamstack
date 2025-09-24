const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.setViewportSize({ width: 1200, height: 800 });
  
  try {
    await page.goto('http://localhost:3005/pricing.html?locale=he', { 
      waitUntil: 'networkidle',
      timeout: 10000 
    });
    
    await page.waitForTimeout(3000);
    
    // Check the first pricing tabs section
    const firstTabsVisible = await page.locator('.pricing-plan-tabs').first().isVisible();
    console.log('First pricing tabs visible:', firstTabsVisible);
    
    // Check if tabs menu is visible in the first section
    const firstMenuVisible = await page.locator('.pricing-plan-tabs-menu').first().isVisible();
    console.log('First tabs menu visible:', firstMenuVisible);
    
    // Get position info
    const menuPosition = await page.locator('.pricing-plan-tabs-menu').first().boundingBox();
    console.log('Menu position:', menuPosition);
    
    // Check computed styles of the tabs menu
    const styles = await page.locator('.pricing-plan-tabs-menu').first().evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        display: computed.display,
        visibility: computed.visibility,
        opacity: computed.opacity,
        background: computed.background,
        height: el.offsetHeight,
        width: el.offsetWidth
      };
    });
    console.log('Tabs menu styles:', JSON.stringify(styles, null, 2));
    
    // Take a focused screenshot of the pricing section
    await page.locator('.section.affordable-plan').first().screenshot({ 
      path: '/Users/michaelmishayev/Desktop/newCode/focused_pricing_section.png' 
    });
    console.log('Focused pricing section screenshot taken');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
