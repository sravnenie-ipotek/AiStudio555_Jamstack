const { test, expect } = require('@playwright/test');

test.describe('Strapi v4 Working Tests', () => {
  test('Admin panel loads without errors', async ({ page }) => {
    const consoleErrors = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('http://localhost:1337/admin');
    await page.waitForTimeout(2000);

    // Check no critical errors
    const criticalErrors = consoleErrors.filter(e => 
      !e.includes('favicon') && 
      !e.includes('401') &&  // Expected for non-authenticated
      !e.includes('400')     // Expected for token renewal
    );
    
    expect(criticalErrors).toHaveLength(0);
    console.log('✅ No critical console errors');
  });

  test('API responds correctly', async ({ request }) => {
    const response = await request.get('http://localhost:1337/admin/init');
    expect(response.ok()).toBeTruthy();
    console.log('✅ API is responding');
  });

  test('Admin panel shows registration page', async ({ page }) => {
    await page.goto('http://localhost:1337/admin');
    
    // Should redirect to register-admin for first time
    await page.waitForURL('**/auth/register-admin', { timeout: 5000 });
    
    // Check form fields exist
    await expect(page.locator('input[name="firstname"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    
    console.log('✅ Admin registration page loads correctly');
  });

  test('No 500 errors', async ({ page }) => {
    const response = await page.goto('http://localhost:1337/admin');
    expect(response.status()).toBeLessThan(500);
    console.log(`✅ Admin panel returns status: ${response.status()}`);
  });

  test('Static assets load', async ({ page }) => {
    await page.goto('http://localhost:1337/admin');
    
    // Check if main JS files are loaded
    const mainScript = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('script')).some(
        script => script.src.includes('main')
      );
    });
    
    expect(mainScript).toBeTruthy();
    console.log('✅ Static assets loading correctly');
  });
});

console.log('🚀 Running Strapi v4 tests...');