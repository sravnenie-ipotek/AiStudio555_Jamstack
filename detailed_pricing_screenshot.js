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
    
    // Wait for page to be fully loaded and translations to apply
    await page.waitForTimeout(3000);
    
    // Check if pricing tabs exist and are visible
    const tabsExist = await page.locator('.pricing-plan-tabs').count();
    console.log('Pricing tabs found:', tabsExist);
    
    if (tabsExist > 0) {
      const tabsVisible = await page.locator('.pricing-plan-tabs').isVisible();
      console.log('Pricing tabs visible:', tabsVisible);
      
      const tabsMenu = await page.locator('.pricing-plan-tabs-menu').count();
      console.log('Pricing tabs menu found:', tabsMenu);
      
      if (tabsMenu > 0) {
        const menuVisible = await page.locator('.pricing-plan-tabs-menu').isVisible();
        console.log('Pricing tabs menu visible:', menuVisible);
        
        // Get computed styles
        const menuStyles = await page.locator('.pricing-plan-tabs-menu').evaluate(el => {
          const styles = window.getComputedStyle(el);
          return {
            display: styles.display,
            visibility: styles.visibility,
            opacity: styles.opacity,
            position: styles.position,
            top: styles.top,
            left: styles.left,
            transform: styles.transform,
            zIndex: styles.zIndex,
            backgroundColor: styles.backgroundColor
          };
        });
        console.log('Menu styles:', JSON.stringify(menuStyles, null, 2));
      }
    }
    
    // Scroll to the pricing section
    await page.locator('.section.affordable-plan').scrollIntoView();
    await page.waitForTimeout(1000);
    
    // Take screenshot of the pricing section specifically
    const pricingSection = page.locator('.section.affordable-plan');
    if (await pricingSection.count() > 0) {
      await pricingSection.screenshot({ 
        path: '/Users/michaelmishayev/Desktop/newCode/pricing_section_detailed.png' 
      });
      console.log('Pricing section screenshot saved');
    }
    
    // Take a screenshot with the pricing tabs area highlighted
    await page.screenshot({ 
      path: '/Users/michaelmishayev/Desktop/newCode/pricing_with_tabs_area.png',
      clip: { x: 0, y: 300, width: 1200, height: 800 }
    });
    console.log('Pricing tabs area screenshot saved');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
