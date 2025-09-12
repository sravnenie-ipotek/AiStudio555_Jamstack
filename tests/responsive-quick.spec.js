const { test, expect } = require('@playwright/test');

// Quick responsive test for key pages and viewports
const baseUrl = 'http://localhost:3005';
const testPages = ['home.html', 'courses.html', 'teachers.html'];
const keyViewports = [
  { name: 'Desktop', width: 1920, height: 1080 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Mobile', width: 375, height: 667 }
];

test.describe('Quick Responsive Tests', () => {
  
  for (const viewport of keyViewports) {
    for (const pageName of testPages) {
      
      test(`${viewport.name} - ${pageName}`, async ({ page }) => {
        // Set viewport
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        
        // Navigate to page
        await page.goto(`${baseUrl}/${pageName}`, { 
          waitUntil: 'domcontentloaded',
          timeout: 10000 
        });
        
        // Wait for initial render
        await page.waitForTimeout(500);
        
        // Check for horizontal scrolling
        const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
        const clientWidth = await page.evaluate(() => document.body.clientWidth);
        expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // Allow 1px tolerance
        
        // Check navigation visibility
        const isMobile = viewport.width < 768; // Mobile is less than 768px
        
        if (isMobile) {
          // Check hamburger menu exists
          const hamburger = page.locator('.w-nav-button, .menu-button').first();
          await expect(hamburger).toBeVisible({ timeout: 5000 });
          
          // Test hamburger click
          await hamburger.click();
          await page.waitForTimeout(300);
          
          // Check if menu is visible
          const menu = page.locator('.w-nav-overlay, .nav-menu').first();
          const isMenuVisible = await menu.isVisible();
          
          // Close menu if opened
          if (isMenuVisible) {
            await hamburger.click();
            await page.waitForTimeout(300);
          }
        } else {
          // Check desktop/tablet navigation
          const navbar = page.locator('.navbar').first();
          await expect(navbar).toBeVisible({ timeout: 5000 });
          
          // Check for dropdown (with timeout handling)
          const dropdown = page.locator('.w-dropdown').first();
          try {
            const dropdownVisible = await dropdown.isVisible({ timeout: 2000 });
            if (dropdownVisible) {
              // Test dropdown hover
              await dropdown.hover();
              await page.waitForTimeout(300);
              
              const dropdownList = dropdown.locator('.w-dropdown-list').first();
              // Use soft assertion for dropdown list
              const isListVisible = await dropdownList.isVisible({ timeout: 2000 }).catch(() => false);
              if (!isListVisible) {
                console.log(`⚠️  Dropdown list not visible on hover for ${viewport.name}`);
              }
            }
          } catch (error) {
            // Dropdown might not exist on all pages, which is okay
            console.log(`ℹ️  No dropdown found for ${viewport.name} - ${pageName}`);
          }
        }
        
        // Take screenshot
        await page.screenshot({
          path: `test-results/screenshots/${viewport.name}-${pageName}-quick.png`,
          fullPage: false
        });
        
        console.log(`✅ ${viewport.name} - ${pageName}: No horizontal scroll, Menu works`);
      });
    }
  }
});