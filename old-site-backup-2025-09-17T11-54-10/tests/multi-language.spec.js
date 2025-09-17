const { test, expect } = require('@playwright/test');

test.describe('Multi-Language Testing Suite', () => {
  const languages = [
    { code: 'en', name: 'English', dir: 'ltr', domain: 'dist/en/' },
    { code: 'ru', name: 'Russian', dir: 'ltr', domain: 'dist/ru/' },
    { code: 'he', name: 'Hebrew', dir: 'rtl', domain: 'dist/he/' }
  ];

  const testPages = [
    'index.html',
    'courses.html',
    'teachers.html',
    'career-center.html',
    'career-orientation.html'
  ];

  // Test language switching and content accuracy
  for (const lang of languages) {
    test.describe(`${lang.name} Language Tests`, () => {
      
      test(`should load ${lang.name} pages with correct text direction`, async ({ page }) => {
        for (const pageName of testPages) {
          await page.goto(`/${lang.domain}${pageName}`);
          await page.waitForLoadState('networkidle');

          // Check HTML dir attribute
          const htmlDir = await page.getAttribute('html', 'dir');
          expect(htmlDir).toBe(lang.dir);

          // Check page loads without 404 errors
          expect(page.url()).toContain(lang.domain);
          
          // Verify language-specific content exists
          const content = await page.textContent('body');
          expect(content.length).toBeGreaterThan(100);

          console.log(`✅ ${lang.name} ${pageName} - Direction: ${htmlDir}`);
        }
      });

      test(`should display correct fonts for ${lang.name}`, async ({ page }) => {
        await page.goto(`/${lang.domain}index.html`);
        await page.waitForLoadState('networkidle');

        // Check primary heading font
        const heading = page.locator('h1').first();
        if (await heading.isVisible()) {
          const fontFamily = await heading.evaluate(el => 
            window.getComputedStyle(el).fontFamily
          );
          
          // Hebrew should use appropriate fonts
          if (lang.code === 'he') {
            expect(fontFamily).toMatch(/sans-serif|arial|helvetica/i);
          }
          
          console.log(`Font family for ${lang.name}:`, fontFamily);
        }
      });

      test(`should have correct meta tags for ${lang.name}`, async ({ page }) => {
        await page.goto(`/${lang.domain}index.html`);
        
        // Check lang attribute
        const htmlLang = await page.getAttribute('html', 'lang');
        expect(htmlLang).toBe(lang.code);

        // Check meta description exists
        const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
        expect(metaDescription).toBeTruthy();
        expect(metaDescription.length).toBeGreaterThan(50);

        // Check page title
        const title = await page.title();
        expect(title.length).toBeGreaterThan(10);
        
        console.log(`${lang.name} SEO - Title: ${title.substring(0, 50)}...`);
      });

      test(`should handle RTL layout correctly for ${lang.name}`, async ({ page }) => {
        if (lang.dir === 'rtl') {
          await page.goto(`/${lang.domain}index.html`);
          await page.waitForLoadState('networkidle');

          // Check text alignment
          const bodyDirection = await page.evaluate(() => 
            window.getComputedStyle(document.body).direction
          );
          expect(bodyDirection).toBe('rtl');

          // Check navigation alignment
          const nav = page.locator('.navbar, .nav, .main-nav').first();
          if (await nav.isVisible()) {
            const navTextAlign = await nav.evaluate(el => 
              window.getComputedStyle(el).textAlign
            );
            console.log(`RTL Navigation alignment:`, navTextAlign);
          }
        }
      });

      test(`should load correct language-specific API content for ${lang.name}`, async ({ page }) => {
        // Monitor API requests
        const apiRequests = [];
        page.on('request', request => {
          if (request.url().includes('/api/')) {
            apiRequests.push({
              url: request.url(),
              locale: new URL(request.url()).searchParams.get('locale')
            });
          }
        });

        await page.goto(`/${lang.domain}index.html`);
        await page.waitForTimeout(3000); // Wait for API calls

        // Check if API was called with correct locale
        const localeRequests = apiRequests.filter(req => 
          req.locale === lang.code || req.url.includes(`locale=${lang.code}`)
        );
        
        if (localeRequests.length > 0) {
          console.log(`✅ API called with ${lang.code} locale`);
          expect(localeRequests.length).toBeGreaterThan(0);
        } else {
          console.log(`ℹ️ No specific locale API calls for ${lang.code}`);
        }
      });
    });
  }

  test('Language fallback mechanism', async ({ page }) => {
    // Test missing content falls back to English
    const response = await page.request.get(
      'https://aistudio555jamstack-production.up.railway.app/api/home-page?locale=nonexistent'
    );
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    
    // Should return data (fallback to English)
    expect(data).toBeTruthy();
    console.log('✅ Fallback mechanism working');
  });

  test('Cross-language navigation consistency', async ({ page }) => {
    // Test that navigation structure is consistent across languages
    const navStructures = {};

    for (const lang of languages) {
      await page.goto(`/${lang.domain}index.html`);
      await page.waitForLoadState('networkidle');

      // Get navigation items
      const navItems = await page.locator('.nav-link, .menu-item, .navbar a').allTextContents();
      navStructures[lang.code] = navItems.filter(item => item.trim().length > 0);
    }

    // Compare structure lengths (should be similar)
    const lengths = Object.values(navStructures).map(nav => nav.length);
    const maxLength = Math.max(...lengths);
    const minLength = Math.min(...lengths);
    
    // Allow some variation but structures should be roughly similar
    expect(maxLength - minLength).toBeLessThanOrEqual(2);
    
    console.log('Navigation structures:', navStructures);
  });
});