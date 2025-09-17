// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Strapi CMS Setup', () => {
  test('Strapi admin panel is accessible', async ({ page }) => {
    await page.goto('/admin');
    
    // Check if admin panel loads
    await expect(page).toHaveTitle(/Strapi Admin/);
    
    // Check for login form or admin dashboard
    const loginForm = page.locator('form[action*="login"]');
    const dashboard = page.locator('[data-testid="dashboard"]');
    
    // Either login form or dashboard should be visible
    const isLoginVisible = await loginForm.isVisible().catch(() => false);
    const isDashboardVisible = await dashboard.isVisible().catch(() => false);
    
    expect(isLoginVisible || isDashboardVisible).toBeTruthy();
  });
  
  test('API endpoints are accessible', async ({ request }) => {
    // Test main API endpoint
    const apiResponse = await request.get('/api');
    expect(apiResponse.ok()).toBeTruthy();
    
    // Test page-sections endpoint
    const sectionsResponse = await request.get('/api/page-sections');
    expect(sectionsResponse.ok()).toBeTruthy();
    
    const data = await sectionsResponse.json();
    expect(data).toHaveProperty('data');
    expect(data).toHaveProperty('meta');
  });
  
  test('PostgreSQL database connection works', async ({ request }) => {
    // This endpoint should work if DB is connected
    const response = await request.get('/api/page-sections?pagination[limit]=1');
    expect(response.ok()).toBeTruthy();
  });
  
  test('CORS headers are properly configured', async ({ request }) => {
    const response = await request.get('/api', {
      headers: {
        'Origin': 'http://localhost:3000'
      }
    });
    
    expect(response.ok()).toBeTruthy();
    expect(response.headers()['access-control-allow-origin']).toBeTruthy();
  });
});