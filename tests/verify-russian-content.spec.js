const { test, expect } = require('@playwright/test');

test.describe('Russian Content Verification', () => {
  test('should display updated Russian content on production site', async ({ page }) => {
    console.log('🔍 Testing Russian content on production site...');
    
    // Navigate to Russian home page
    await page.goto('https://www.aistudio555.com/ru/home.html');
    
    // Wait for the hero section to load
    await page.waitForSelector('.banner-heading', { timeout: 10000 });
    
    // Check if the hero title contains our updated text
    const heroTitle = await page.textContent('h1.banner-heading');
    console.log('Hero Title found:', heroTitle);
    
    // Verify the title contains Russian text (it should now be updated via API)
    expect(heroTitle).toContain('Освойте ИИ и технологии');
    
    // Check the subtitle
    const heroSubtitle = await page.textContent('.banner-subtitle');
    console.log('Hero Subtitle found:', heroSubtitle);
    
    // Verify subtitle contains our update
    expect(heroSubtitle).toContain('Трансформируйте карьеру');
    
    // Check featured courses section title if visible
    const featuredTitle = await page.textContent('.featured-courses h2.section-title').catch(() => null);
    if (featuredTitle) {
      console.log('Featured Courses Title:', featuredTitle);
      expect(featuredTitle).toContain('Популярные курсы');
    }
    
    // Check About section title if visible
    const aboutTitle = await page.textContent('.about-us h2.section-title').catch(() => null);
    if (aboutTitle) {
      console.log('About Title:', aboutTitle);
      expect(aboutTitle).toContain('О AI Studio');
    }
    
    console.log('✅ All Russian content verified successfully!');
  });
  
  test('should update content via admin panel and verify', async ({ page }) => {
    const timestamp = Date.now();
    const testText = `Тест ${timestamp}`;
    
    console.log('📝 Testing admin panel save and verify...');
    
    // First, update via admin panel API directly
    const response = await page.request.put(
      'https://aistudio555jamstack-production.up.railway.app/api/home-page/2',
      {
        data: {
          heroSubtitle: testText
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    expect(response.status()).toBe(200);
    console.log('✅ Content updated via API');
    
    // Wait a moment for changes to propagate
    await page.waitForTimeout(2000);
    
    // Now verify on the website
    await page.goto('https://www.aistudio555.com/ru/home.html');
    await page.waitForSelector('.banner-subtitle', { timeout: 10000 });
    
    const subtitle = await page.textContent('.banner-subtitle');
    console.log('Subtitle after update:', subtitle);
    
    expect(subtitle).toContain(testText);
    console.log('✅ Updated content appears on website!');
  });
});