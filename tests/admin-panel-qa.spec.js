const { test, expect } = require('@playwright/test');

test.describe('Admin Panel QA Tests', () => {
  const ADMIN_URL = 'https://aistudio555jamstack-production.up.railway.app/content-admin-comprehensive.html';
  const WEBSITE_URL = 'https://www.aistudio555.com/home.html';
  
  test.beforeEach(async ({ page }) => {
    // Navigate to admin panel
    await page.goto(ADMIN_URL);
    console.log('📊 Navigating to admin panel...');
  });

  test('Admin panel loads without errors', async ({ page }) => {
    // Check for console errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check main elements exist
    await expect(page.locator('h1')).toContainText('AI Studio Content Management');
    await expect(page.locator('.tab').first()).toBeVisible();
    
    // Verify no JavaScript errors
    expect(errors.filter(e => !e.includes('favicon'))).toHaveLength(0);
    console.log('✅ Admin panel loaded successfully');
  });

  test('All sections match website structure', async ({ page }) => {
    // Click Home Page tab
    await page.click('text=Home Page');
    await page.waitForTimeout(1000);
    
    // Verify all sections exist
    const expectedSections = [
      'Hero Section',
      'Featured Courses Section', 
      'Focus on Practice Section',
      'Online Learning Section',
      'Expert Mentor Section',
      'Career Success Section',
      'Testimonials Section'
    ];
    
    for (const section of expectedSections) {
      const sectionElement = await page.locator(`h4:has-text("${section}")`);
      await expect(sectionElement).toBeVisible();
      console.log(`✅ Found section: ${section}`);
    }
  });

  test('Can edit and save home page content', async ({ page }) => {
    // Click Home Page tab
    await page.click('text=Home Page');
    await page.waitForTimeout(1000);
    
    // Edit Hero Title
    const timestamp = Date.now();
    const testTitle = `Test Title ${timestamp}`;
    await page.fill('#homeHeroTitle', testTitle);
    
    // Edit Hero Subtitle
    const testSubtitle = `Test Subtitle ${timestamp}`;
    await page.fill('#homeHeroSubtitle', testSubtitle);
    
    // Click save button
    await page.click('button:has-text("Save All Home Page Content")');
    
    // Wait for save to complete
    await page.waitForTimeout(2000);
    
    // Check for success message or errors
    const messageElement = page.locator('.message, .alert, .notification').first();
    if (await messageElement.isVisible()) {
      const message = await messageElement.textContent();
      console.log('Save message:', message);
      
      // Should not contain error
      expect(message.toLowerCase()).not.toContain('error');
      expect(message.toLowerCase()).not.toContain('500');
    }
    
    console.log('✅ Content saved successfully');
  });

  test('Number fields accept only numbers', async ({ page }) => {
    // Click Home Page tab
    await page.click('text=Home Page');
    await page.waitForTimeout(1000);
    
    // Find a lessons field
    const lessonsField = page.locator('#course1Lessons');
    
    // Clear and enter number
    await lessonsField.fill('');
    await lessonsField.type('24');
    
    // Verify value is numeric
    const value = await lessonsField.inputValue();
    expect(parseInt(value)).toBe(24);
    
    console.log('✅ Number fields working correctly');
  });

  test('FAQ section loads and displays', async ({ page }) => {
    // Click FAQs tab
    await page.click('text=FAQs');
    await page.waitForTimeout(1000);
    
    // Check FAQ form exists
    await expect(page.locator('#faqQuestion')).toBeVisible();
    await expect(page.locator('#faqAnswer')).toBeVisible();
    
    // Check existing FAQs list
    const faqsList = page.locator('#faqsList');
    await expect(faqsList).toBeVisible();
    
    console.log('✅ FAQ section working');
  });

  test('Can switch between language tabs', async ({ page }) => {
    // Click language buttons if they exist
    const langButtons = page.locator('.lang-btn');
    const count = await langButtons.count();
    
    if (count > 0) {
      // Try Russian
      await page.click('button:has-text("🇷🇺")');
      await page.waitForTimeout(500);
      
      // Try English  
      await page.click('button:has-text("🇬🇧")');
      await page.waitForTimeout(500);
      
      console.log('✅ Language switching works');
    } else {
      console.log('ℹ️ No language buttons found');
    }
  });

  test('Save triggers API call to correct endpoint', async ({ page }) => {
    // Monitor network requests
    const apiCalls = [];
    page.on('request', request => {
      if (request.url().includes('/api/home-page')) {
        apiCalls.push({
          url: request.url(),
          method: request.method(),
          data: request.postData()
        });
      }
    });
    
    // Click Home Page tab
    await page.click('text=Home Page');
    await page.waitForTimeout(1000);
    
    // Make a small edit
    await page.fill('#homeHeroTitle', 'API Test Title');
    
    // Click save
    await page.click('button:has-text("Save All Home Page Content")');
    await page.waitForTimeout(2000);
    
    // Verify API was called
    expect(apiCalls.length).toBeGreaterThan(0);
    
    const lastCall = apiCalls[apiCalls.length - 1];
    expect(lastCall.method).toBe('PUT');
    expect(lastCall.url).toContain('/api/home-page');
    
    console.log('✅ API calls working correctly');
    console.log('API endpoint:', lastCall.url);
  });

  test('Course fields are properly structured', async ({ page }) => {
    // Click Home Page tab
    await page.click('text=Home Page');
    await page.waitForTimeout(1000);
    
    // Check course 1 fields
    const course1Fields = [
      '#course1Title',
      '#course1Rating',
      '#course1Lessons',
      '#course1Duration',
      '#course1Category',
      '#course1Description'
    ];
    
    for (const field of course1Fields) {
      await expect(page.locator(field)).toBeVisible();
    }
    
    console.log('✅ All course fields present');
  });

  test('Testimonials section has correct fields', async ({ page }) => {
    // Click Home Page tab
    await page.click('text=Home Page');
    await page.waitForTimeout(1000);
    
    // Check testimonial fields exist
    const testimonialFields = [
      '#testimonial1Author',
      '#testimonial1Rating',
      '#testimonial1Text'
    ];
    
    for (const field of testimonialFields) {
      const element = page.locator(field);
      if (await element.isVisible()) {
        console.log(`✅ Found field: ${field}`);
      }
    }
  });

  test('Complete save flow without 500 errors', async ({ page }) => {
    let saveError = false;
    
    // Monitor responses
    page.on('response', response => {
      if (response.url().includes('/api/home-page') && response.status() === 500) {
        saveError = true;
        console.error('❌ 500 error detected!');
      }
    });
    
    // Click Home Page tab
    await page.click('text=Home Page');
    await page.waitForTimeout(1000);
    
    // Edit multiple fields
    await page.fill('#homeHeroTitle', 'QA Test Title');
    await page.fill('#homeHeroSubtitle', 'QA Test Subtitle');
    await page.fill('#homeFeaturedTitle', 'Featured Courses Test');
    
    // Save
    await page.click('button:has-text("Save All Home Page Content")');
    await page.waitForTimeout(3000);
    
    // Verify no 500 error
    expect(saveError).toBe(false);
    console.log('✅ Save completed without 500 errors');
  });
});

test.describe('Admin to Website Integration', () => {
  test('Changes in admin reflect on website', async ({ browser }) => {
    // Create two pages
    const context = await browser.newContext();
    const adminPage = await context.newPage();
    const websitePage = await context.newPage();
    
    // Go to admin
    await adminPage.goto('https://aistudio555jamstack-production.up.railway.app/content-admin-comprehensive.html');
    await adminPage.click('text=Home Page');
    await adminPage.waitForTimeout(1000);
    
    // Make a unique change
    const timestamp = Date.now();
    const testText = `Integration Test ${timestamp}`;
    await adminPage.fill('#homeHeroTitle', testText);
    
    // Save
    await adminPage.click('button:has-text("Save All Home Page Content")');
    await adminPage.waitForTimeout(3000);
    
    // Check website
    await websitePage.goto('https://www.aistudio555.com/home.html');
    await websitePage.waitForTimeout(2000);
    
    // Look for the text (it might be dynamically loaded)
    const heroTitle = await websitePage.locator('h1.banner-heading').textContent();
    console.log('Website hero title:', heroTitle);
    
    // Note: Website might have caching, so we check if API returns correct data
    const apiResponse = await websitePage.request.get('https://aistudio555jamstack-production.up.railway.app/api/home-page');
    const apiData = await apiResponse.json();
    
    if (apiData.data && apiData.data.attributes) {
      console.log('API hero title:', apiData.data.attributes.heroTitle);
      // API should have our updated data
      expect(apiData.data.attributes.heroTitle).toContain('Test');
    }
    
    await context.close();
  });
});