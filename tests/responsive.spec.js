const { test, expect } = require('@playwright/test');

// Test configuration
const baseUrl = 'http://localhost:3005';
const testPages = [
  'home.html',
  'courses.html', 
  'teachers.html',
  'career-center.html',
  'career-orientation.html'
];

const viewports = {
  desktop: [
    { name: 'Desktop-1920x1080', width: 1920, height: 1080 },
    { name: 'Desktop-1440x900', width: 1440, height: 900 },
    { name: 'Desktop-1366x768', width: 1366, height: 768 }
  ],
  tablet: [
    { name: 'iPad-768x1024', width: 768, height: 1024 },
    { name: 'iPadAir-820x1180', width: 820, height: 1180 },
    { name: 'iPadLandscape-1024x768', width: 1024, height: 768 }
  ],
  mobile: [
    { name: 'iPhone678-375x667', width: 375, height: 667 },
    { name: 'iPhone12Pro-390x844', width: 390, height: 844 },
    { name: 'iPhone11ProMax-414x896', width: 414, height: 896 }
  ]
};

// Utility function to wait for page load and animations
async function waitForPageReady(page) {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000); // Wait for any CSS animations
}

// Utility function to check for horizontal scrolling
async function checkHorizontalScrolling(page, viewport) {
  const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
  const clientWidth = await page.evaluate(() => document.body.clientWidth);
  
  return {
    hasHorizontalScroll: scrollWidth > clientWidth,
    scrollWidth,
    clientWidth,
    viewport: viewport.name
  };
}

// Test menu functionality
async function testMenuFunctionality(page, viewport, pageName) {
  const isMobile = viewport.width <= 768;
  
  if (isMobile) {
    // Test mobile hamburger menu
    const hamburgerButton = page.locator('[data-testid="hamburger"], .hamburger, .menu-toggle, .nav-toggle').first();
    const mobileMenu = page.locator('[data-testid="mobile-menu"], .mobile-menu, .nav-menu-mobile, .menu-overlay').first();
    
    if (await hamburgerButton.isVisible()) {
      // Test hamburger button click
      await hamburgerButton.click();
      await page.waitForTimeout(500); // Wait for animation
      
      // Check if mobile menu is visible
      const isMenuVisible = await mobileMenu.isVisible();
      
      // Take screenshot of open mobile menu
      await page.screenshot({
        path: `test-results/screenshots/${viewport.name}-${pageName}-menu-open.png`,
        fullPage: true
      });
      
      // Test menu items visibility and clickability
      const menuItems = await page.locator('.nav-link, .menu-item, .mobile-menu a').all();
      const menuItemsData = [];
      
      for (const item of menuItems) {
        const isVisible = await item.isVisible();
        const text = await item.textContent();
        const href = await item.getAttribute('href');
        
        menuItemsData.push({
          text: text?.trim(),
          href,
          isVisible,
          isClickable: isVisible
        });
      }
      
      // Close menu
      if (isMenuVisible) {
        await hamburgerButton.click();
        await page.waitForTimeout(500);
      }
      
      return {
        type: 'mobile',
        hamburgerVisible: await hamburgerButton.isVisible(),
        menuOpensCorrectly: isMenuVisible,
        menuItems: menuItemsData
      };
    }
  } else {
    // Test desktop menu
    const desktopMenu = page.locator('.navbar, .nav, .main-nav, .header-nav').first();
    const menuItems = await page.locator('.nav-link, .menu-item, .navbar a').all();
    const menuItemsData = [];
    
    for (const item of menuItems) {
      const isVisible = await item.isVisible();
      const text = await item.textContent();
      const href = await item.getAttribute('href');
      
      menuItemsData.push({
        text: text?.trim(),
        href,
        isVisible,
        isClickable: isVisible
      });
    }
    
    // Check for dropdown menus
    const dropdowns = await page.locator('.dropdown, .submenu, .nav-dropdown').all();
    const dropdownData = [];
    
    for (const dropdown of dropdowns) {
      const trigger = dropdown.locator('.dropdown-toggle, .submenu-toggle').first();
      if (await trigger.isVisible()) {
        await trigger.hover();
        await page.waitForTimeout(300);
        
        const dropdownMenu = dropdown.locator('.dropdown-menu, .submenu-items').first();
        const isDropdownVisible = await dropdownMenu.isVisible();
        
        dropdownData.push({
          isVisible: isDropdownVisible,
          itemCount: await dropdownMenu.locator('a, .dropdown-item').count()
        });
      }
    }
    
    return {
      type: 'desktop',
      menuVisible: await desktopMenu.isVisible(),
      menuItems: menuItemsData,
      dropdowns: dropdownData
    };
  }
  
  return { type: 'unknown' };
}

// Main test suite
test.describe('Responsive Design Tests', () => {
  
  // Test each page at each viewport size
  for (const category in viewports) {
    for (const viewport of viewports[category]) {
      for (const pageName of testPages) {
        
        test(`${viewport.name} - ${pageName} - Layout and Menu Tests`, async ({ page }) => {
          // Set viewport
          await page.setViewportSize({ width: viewport.width, height: viewport.height });
          
          // Navigate to page
          await page.goto(`${baseUrl}/${pageName}`);
          await waitForPageReady(page);
          
          // Take full page screenshot
          await page.screenshot({
            path: `test-results/screenshots/${viewport.name}-${pageName}-full.png`,
            fullPage: true
          });
          
          // Check for horizontal scrolling
          const scrollCheck = await checkHorizontalScrolling(page, viewport);
          
          // Test menu functionality
          const menuTest = await testMenuFunctionality(page, viewport, pageName);
          
          // Take screenshot of menu area
          const menuSelector = viewport.width <= 768 ? 
            '.hamburger, .menu-toggle, .nav-toggle' : 
            '.navbar, .nav, .main-nav, .header-nav';
          
          const menuElement = page.locator(menuSelector).first();
          if (await menuElement.isVisible()) {
            await menuElement.screenshot({
              path: `test-results/screenshots/${viewport.name}-${pageName}-menu.png`
            });
          }
          
          // Test touch events on mobile viewports
          let touchTest = null;
          if (viewport.width <= 768) {
            touchTest = await testTouchEvents(page);
          }
          
          // Assertions
          expect(scrollCheck.hasHorizontalScroll).toBeFalsy();
          expect(menuTest.type).not.toBe('unknown');
          
          // Log results
          console.log(`\n=== ${viewport.name} - ${pageName} Results ===`);
          console.log('Horizontal Scroll Check:', scrollCheck);
          console.log('Menu Test:', menuTest);
          if (touchTest) console.log('Touch Test:', touchTest);
        });
      }
    }
  }
});

// Test touch events on mobile
async function testTouchEvents(page) {
  const touchElements = await page.locator('button, .btn, .nav-link, .menu-item').all();
  const results = [];
  
  for (let i = 0; i < Math.min(touchElements.length, 5); i++) {
    const element = touchElements[i];
    const isVisible = await element.isVisible();
    
    if (isVisible) {
      try {
        await element.tap();
        await page.waitForTimeout(200);
        results.push({ element: i, touchResponsive: true });
      } catch (error) {
        results.push({ element: i, touchResponsive: false, error: error.message });
      }
    }
  }
  
  return results;
}

// Test suite for menu animations
test.describe('Menu Animation Tests', () => {
  
  const mobileViewports = viewports.mobile;
  
  for (const viewport of mobileViewports) {
    test(`${viewport.name} - Menu Animation Performance`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(`${baseUrl}/home.html`);
      await waitForPageReady(page);
      
      const hamburger = page.locator('[data-testid="hamburger"], .hamburger, .menu-toggle, .nav-toggle').first();
      const mobileMenu = page.locator('[data-testid="mobile-menu"], .mobile-menu, .nav-menu-mobile, .menu-overlay').first();
      
      if (await hamburger.isVisible()) {
        // Measure animation performance
        const startTime = Date.now();
        
        // Open menu
        await hamburger.click();
        await page.waitForSelector('.mobile-menu:visible, .nav-menu-mobile:visible, .menu-overlay:visible', { timeout: 2000 });
        
        const openTime = Date.now() - startTime;
        
        // Take screenshot during animation
        await page.screenshot({
          path: `test-results/screenshots/${viewport.name}-animation-open.png`,
          fullPage: true
        });
        
        await page.waitForTimeout(300); // Let animation complete
        
        const closeStartTime = Date.now();
        
        // Close menu
        await hamburger.click();
        await page.waitForSelector('.mobile-menu:not(:visible), .nav-menu-mobile:not(:visible), .menu-overlay:not(:visible)', { timeout: 2000 });
        
        const closeTime = Date.now() - closeStartTime;
        
        console.log(`\n=== ${viewport.name} Animation Performance ===`);
        console.log(`Menu open time: ${openTime}ms`);
        console.log(`Menu close time: ${closeTime}ms`);
        
        // Animation should complete within reasonable time
        expect(openTime).toBeLessThan(1000);
        expect(closeTime).toBeLessThan(1000);
      }
    });
  }
});

// Test overlay behavior
test.describe('Menu Overlay Tests', () => {
  
  const mobileViewports = viewports.mobile;
  
  for (const viewport of mobileViewports) {
    for (const pageName of testPages) {
      
      test(`${viewport.name} - ${pageName} - Overlay Behavior`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto(`${baseUrl}/${pageName}`);
        await waitForPageReady(page);
        
        const hamburger = page.locator('[data-testid="hamburger"], .hamburger, .menu-toggle, .nav-toggle').first();
        const overlay = page.locator('.menu-overlay, .mobile-overlay, .nav-overlay').first();
        
        if (await hamburger.isVisible()) {
          // Open menu
          await hamburger.click();
          await page.waitForTimeout(500);
          
          // Check if overlay exists and is visible
          const overlayVisible = await overlay.isVisible();
          
          if (overlayVisible) {
            // Test clicking overlay to close menu
            await overlay.click();
            await page.waitForTimeout(500);
            
            const menuStillOpen = await page.locator('.mobile-menu:visible, .nav-menu-mobile:visible').first().isVisible();
            
            console.log(`\n=== ${viewport.name} - ${pageName} Overlay Test ===`);
            console.log(`Overlay visible: ${overlayVisible}`);
            console.log(`Menu closes on overlay click: ${!menuStillOpen}`);
            
            // Take screenshot
            await page.screenshot({
              path: `test-results/screenshots/${viewport.name}-${pageName}-overlay-test.png`,
              fullPage: true
            });
          }
        }
      });
    }
  }
});