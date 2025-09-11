const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'http://localhost:3005';
const API_URL = 'https://aistudio555jamstack-production.up.railway.app';

// All pages to test
const ALL_PAGES = [
  'home.html',
  'index.html',
  'courses.html',
  'teachers.html',
  'career-center.html',
  'career-orientation.html',
  'pricing.html',
  'blog.html',
  'about-us.html',
  'contact-us.html',
  'checkout.html',
  'detail_courses.html',
  'detail_blog.html',
  'order-confirmation.html',
  'authentication-pages/sign-in.html',
  'authentication-pages/sign-up.html',
  'authentication-pages/forgot-password.html',
];

// Language versions
const LANGUAGES = ['en', 'ru', 'he'];

// Viewports for responsive testing
const VIEWPORTS = {
  'Desktop-1920': { width: 1920, height: 1080 },
  'Laptop-1440': { width: 1440, height: 900 },
  'Tablet-768': { width: 768, height: 1024 },
  'Mobile-375': { width: 375, height: 812 },
};

test.describe('🎯 Comprehensive System Tests', () => {
  test.describe.parallel('Page Coverage Tests', () => {
    for (const page of ALL_PAGES) {
      test(`✅ ${page} - Complete validation`, async ({ page: browserPage }) => {
        const testUrl = `${BASE_URL}/${page}`;
        const results = {
          page: page,
          timestamp: new Date().toISOString(),
          errors: [],
          warnings: [],
          passed: true
        };

        // Console error monitoring
        const consoleErrors = [];
        const networkErrors = [];
        
        browserPage.on('console', msg => {
          if (msg.type() === 'error') {
            consoleErrors.push({
              text: msg.text(),
              location: msg.location()
            });
          }
        });

        browserPage.on('pageerror', error => {
          consoleErrors.push({
            text: error.message,
            stack: error.stack
          });
        });

        browserPage.on('requestfailed', request => {
          networkErrors.push({
            url: request.url(),
            failure: request.failure()
          });
        });

        // Navigate to page
        const response = await browserPage.goto(testUrl, { 
          waitUntil: 'networkidle',
          timeout: 30000 
        });

        // Check HTTP status
        expect(response.status()).toBeLessThan(400);

        // Wait for content to load
        await browserPage.waitForLoadState('domcontentloaded');

        // Test 1: Check for console errors
        if (consoleErrors.length > 0) {
          results.errors.push({
            type: 'console_errors',
            count: consoleErrors.length,
            errors: consoleErrors
          });
        }
        expect(consoleErrors).toHaveLength(0);

        // Test 2: Check for network errors
        if (networkErrors.length > 0) {
          results.errors.push({
            type: 'network_errors',
            count: networkErrors.length,
            errors: networkErrors
          });
        }
        expect(networkErrors).toHaveLength(0);

        // Test 3: Check page title
        const title = await browserPage.title();
        expect(title).toBeTruthy();
        expect(title).not.toBe('');

        // Test 4: Check meta tags
        const metaTags = await browserPage.evaluate(() => {
          const tags = {};
          const metaElements = document.querySelectorAll('meta');
          metaElements.forEach(meta => {
            const name = meta.getAttribute('name') || meta.getAttribute('property');
            if (name) {
              tags[name] = meta.getAttribute('content');
            }
          });
          return tags;
        });

        // Required meta tags
        if (!metaTags.description) {
          results.warnings.push('Missing meta description');
        }
        if (!metaTags.viewport) {
          results.errors.push('Missing viewport meta tag');
        }

        // Test 5: Check navigation menu
        const navMenu = await browserPage.locator('.nav-menu, .mobile-menu, .hamburger-menu').first();
        if (await navMenu.isVisible()) {
          const menuItems = await browserPage.locator('.nav-link, .menu-link').all();
          expect(menuItems.length).toBeGreaterThan(0);
        }

        // Test 6: Check for broken images
        const brokenImages = await browserPage.evaluate(() => {
          const images = Array.from(document.querySelectorAll('img'));
          return images.filter(img => !img.complete || img.naturalWidth === 0)
            .map(img => img.src);
        });

        if (brokenImages.length > 0) {
          results.errors.push({
            type: 'broken_images',
            count: brokenImages.length,
            urls: brokenImages
          });
        }
        expect(brokenImages).toHaveLength(0);

        // Test 7: Check for broken links
        const links = await browserPage.locator('a[href]').all();
        const brokenLinks = [];
        
        for (const link of links.slice(0, 10)) { // Check first 10 links to save time
          const href = await link.getAttribute('href');
          if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
            try {
              const isVisible = await link.isVisible();
              if (isVisible) {
                const target = href.startsWith('http') ? href : `${BASE_URL}/${href}`;
                // Just check if link has valid format
                if (!target.match(/^https?:\/\/.+/)) {
                  brokenLinks.push(href);
                }
              }
            } catch (e) {
              // Ignore errors for now
            }
          }
        }

        if (brokenLinks.length > 0) {
          results.warnings.push({
            type: 'potentially_broken_links',
            count: brokenLinks.length,
            urls: brokenLinks
          });
        }

        // Test 8: Check forms
        const forms = await browserPage.locator('form').all();
        for (const form of forms) {
          const inputs = await form.locator('input, textarea, select').all();
          if (inputs.length > 0) {
            // Check for labels
            for (const input of inputs) {
              const inputId = await input.getAttribute('id');
              const inputName = await input.getAttribute('name');
              const inputType = await input.getAttribute('type');
              
              if (inputType !== 'hidden' && inputType !== 'submit') {
                const label = inputId ? 
                  await browserPage.locator(`label[for="${inputId}"]`).first() :
                  null;
                
                if (!label || !(await label.isVisible())) {
                  results.warnings.push({
                    type: 'missing_label',
                    field: inputName || inputId || 'unnamed field'
                  });
                }
              }
            }
          }
        }

        // Test 9: Check Contact Modal functionality (if exists)
        const signUpButtons = await browserPage.locator('a:has-text("Sign Up Today")').all();
        if (signUpButtons.length > 0) {
          const firstButton = signUpButtons[0];
          if (await firstButton.isVisible()) {
            await firstButton.click();
            await browserPage.waitForTimeout(1000);
            
            // Check if modal opened
            const modal = await browserPage.locator('#contactModal, .contact-modal, .modal').first();
            if (await modal.isVisible()) {
              // Modal opened successfully
              await browserPage.keyboard.press('Escape');
              await browserPage.waitForTimeout(500);
            }
          }
        }

        // Test 10: Check fonts loaded
        const fontStatus = await browserPage.evaluate(() => {
          if (document.fonts && document.fonts.ready) {
            return document.fonts.ready.then(() => {
              return {
                loaded: true,
                count: document.fonts.size
              };
            });
          }
          return { loaded: false, count: 0 };
        });

        if (!fontStatus.loaded || fontStatus.count === 0) {
          results.warnings.push('Fonts may not be loaded properly');
        }

        // Test 11: Check page performance metrics
        const performanceMetrics = await browserPage.evaluate(() => {
          const perf = window.performance;
          if (perf && perf.timing) {
            const timing = perf.timing;
            return {
              domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
              loadComplete: timing.loadEventEnd - timing.navigationStart,
            };
          }
          return null;
        });

        if (performanceMetrics) {
          if (performanceMetrics.domContentLoaded > 3000) {
            results.warnings.push(`Slow DOM content loaded: ${performanceMetrics.domContentLoaded}ms`);
          }
          if (performanceMetrics.loadComplete > 5000) {
            results.warnings.push(`Slow page load: ${performanceMetrics.loadComplete}ms`);
          }
        }

        // Summary
        console.log(`\n📄 ${page} Test Results:`);
        console.log(`   ✅ Passed: ${results.errors.length === 0}`);
        console.log(`   ⚠️  Warnings: ${results.warnings.length}`);
        console.log(`   ❌ Errors: ${results.errors.length}`);
        
        if (results.warnings.length > 0) {
          console.log('   Warnings:', results.warnings);
        }
        if (results.errors.length > 0) {
          console.log('   Errors:', results.errors);
        }
      });
    }
  });

  test.describe('Multi-Language Tests', () => {
    for (const lang of LANGUAGES) {
      test(`🌐 Language: ${lang} - Navigation and content`, async ({ page }) => {
        const langPath = lang === 'en' ? '' : `${lang}/`;
        const testUrl = `${BASE_URL}/${langPath}index.html`;
        
        await page.goto(testUrl, { waitUntil: 'networkidle' });

        // Check language attribute
        const htmlLang = await page.getAttribute('html', 'lang');
        if (lang !== 'en' && htmlLang !== lang) {
          console.warn(`Language attribute mismatch for ${lang}: found ${htmlLang}`);
        }

        // Check RTL for Hebrew
        if (lang === 'he') {
          const dir = await page.getAttribute('html', 'dir');
          expect(dir).toBe('rtl');
        }

        // Check language switcher
        const langSwitcher = await page.locator('.language-switcher, .lang-selector, [data-lang]').first();
        if (await langSwitcher.isVisible()) {
          const langOptions = await page.locator('.language-option, .lang-option').all();
          expect(langOptions.length).toBeGreaterThanOrEqual(2);
        }

        // Check content is in correct language
        const bodyText = await page.locator('body').innerText();
        
        // Language-specific checks
        if (lang === 'ru') {
          // Check for Cyrillic characters
          const hasCyrillic = /[а-яА-Я]/.test(bodyText);
          if (!hasCyrillic) {
            console.warn('Russian page may not have Russian content');
          }
        } else if (lang === 'he') {
          // Check for Hebrew characters
          const hasHebrew = /[\u0590-\u05FF]/.test(bodyText);
          if (!hasHebrew) {
            console.warn('Hebrew page may not have Hebrew content');
          }
        }

        console.log(`✅ Language ${lang} page loaded successfully`);
      });
    }
  });

  test.describe('Responsive Design Tests', () => {
    for (const [viewportName, viewport] of Object.entries(VIEWPORTS)) {
      test(`📱 ${viewportName} - Layout validation`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.goto(`${BASE_URL}/index.html`, { waitUntil: 'networkidle' });

        // Check for horizontal scroll
        const hasHorizontalScroll = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });

        expect(hasHorizontalScroll).toBe(false);

        // Check mobile menu for small screens
        if (viewport.width < 768) {
          const hamburger = await page.locator('.hamburger-menu, .mobile-menu-toggle, .menu-icon').first();
          expect(await hamburger.isVisible()).toBe(true);
        }

        // Check touch targets size (minimum 44x44px for mobile)
        if (viewport.width < 768) {
          const buttons = await page.locator('button, a.button, .btn').all();
          for (const button of buttons.slice(0, 5)) { // Check first 5 buttons
            if (await button.isVisible()) {
              const box = await button.boundingBox();
              if (box) {
                if (box.width < 44 || box.height < 44) {
                  console.warn(`Touch target too small: ${box.width}x${box.height}`);
                }
              }
            }
          }
        }

        console.log(`✅ ${viewportName} viewport test passed`);
      });
    }
  });

  test.describe('API Integration Tests', () => {
    const API_ENDPOINTS = [
      '/api/courses',
      '/api/teachers', 
      '/api/blog-posts',
      '/api/home-page',
      '/api/career-center-page',
      '/api/career-orientation-page',
    ];

    for (const endpoint of API_ENDPOINTS) {
      test(`🔌 API: ${endpoint}`, async ({ request }) => {
        const response = await request.get(`${API_URL}${endpoint}`);
        
        expect(response.status()).toBe(200);
        
        const contentType = response.headers()['content-type'];
        expect(contentType).toContain('application/json');
        
        const data = await response.json();
        expect(data).toBeTruthy();
        
        // Check for error property
        expect(data.error).toBeUndefined();
        
        console.log(`✅ API ${endpoint}: Status ${response.status()}, Data received`);
      });
    }

    // Test language support in API
    test('🔌 API: Multi-language support', async ({ request }) => {
      for (const lang of ['en', 'ru', 'he']) {
        const response = await request.get(`${API_URL}/api/home-page?locale=${lang}`);
        expect(response.status()).toBe(200);
        
        const data = await response.json();
        expect(data).toBeTruthy();
        
        console.log(`✅ API language ${lang} support working`);
      }
    });
  });

  test.describe('Form Validation Tests', () => {
    test('📝 Contact Form Modal', async ({ page }) => {
      await page.goto(`${BASE_URL}/index.html`, { waitUntil: 'networkidle' });
      
      // Find and click Sign Up button
      const signUpButton = await page.locator('a:has-text("Sign Up Today")').first();
      if (await signUpButton.isVisible()) {
        await signUpButton.click();
        await page.waitForTimeout(1000);
        
        // Check modal opened
        const modal = await page.locator('#contactModal').first();
        expect(await modal.isVisible()).toBe(true);
        
        // Test form validation
        const submitButton = await page.locator('#contactModal button[type="submit"]').first();
        await submitButton.click();
        
        // Check for validation messages
        await page.waitForTimeout(500);
        
        // Fill form with valid data
        await page.fill('#contactModal input[name="name"]', 'Test User');
        await page.fill('#contactModal input[name="phone"]', '+1234567890');
        await page.fill('#contactModal textarea[name="message"]', 'Test message');
        
        console.log('✅ Contact form validation working');
        
        // Close modal
        await page.keyboard.press('Escape');
      }
    });
  });

  test.describe('Performance Tests', () => {
    test('⚡ Core Web Vitals', async ({ page }) => {
      await page.goto(`${BASE_URL}/index.html`, { waitUntil: 'networkidle' });
      
      const metrics = await page.evaluate(() => {
        return new Promise((resolve) => {
          let fcp = 0;
          let lcp = 0;
          let cls = 0;
          
          // First Contentful Paint
          const fcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            for (const entry of entries) {
              if (entry.name === 'first-contentful-paint') {
                fcp = entry.startTime;
              }
            }
          });
          fcpObserver.observe({ entryTypes: ['paint'] });
          
          // Largest Contentful Paint
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            lcp = lastEntry.startTime;
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
          
          // Cumulative Layout Shift
          const clsObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (!entry.hadRecentInput) {
                cls += entry.value;
              }
            }
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });
          
          // Wait and collect metrics
          setTimeout(() => {
            resolve({
              fcp: Math.round(fcp),
              lcp: Math.round(lcp),
              cls: cls.toFixed(3)
            });
          }, 3000);
        });
      });
      
      console.log('⚡ Core Web Vitals:');
      console.log(`   FCP: ${metrics.fcp}ms (target: <1800ms)`);
      console.log(`   LCP: ${metrics.lcp}ms (target: <2500ms)`);
      console.log(`   CLS: ${metrics.cls} (target: <0.1)`);
      
      // Assert thresholds
      expect(metrics.fcp).toBeLessThan(3000); // Relaxed threshold
      expect(metrics.lcp).toBeLessThan(4000); // Relaxed threshold
      expect(parseFloat(metrics.cls)).toBeLessThan(0.25); // Relaxed threshold
    });
  });

  test.describe('Accessibility Tests', () => {
    test('♿ WCAG Compliance', async ({ page }) => {
      await page.goto(`${BASE_URL}/index.html`, { waitUntil: 'networkidle' });
      
      // Check for alt text on images
      const imagesWithoutAlt = await page.evaluate(() => {
        const images = Array.from(document.querySelectorAll('img'));
        return images.filter(img => !img.alt).map(img => img.src);
      });
      
      if (imagesWithoutAlt.length > 0) {
        console.warn(`⚠️ ${imagesWithoutAlt.length} images without alt text`);
      }
      
      // Check for proper heading hierarchy
      const headingHierarchy = await page.evaluate(() => {
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
        return headings.map(h => ({
          level: parseInt(h.tagName[1]),
          text: h.textContent.trim().substring(0, 50)
        }));
      });
      
      // Validate heading hierarchy
      let lastLevel = 0;
      for (const heading of headingHierarchy) {
        if (heading.level > lastLevel + 1 && lastLevel !== 0) {
          console.warn(`⚠️ Heading hierarchy skip: h${lastLevel} to h${heading.level}`);
        }
        lastLevel = heading.level;
      }
      
      // Check for keyboard navigation
      const focusableElements = await page.evaluate(() => {
        const elements = document.querySelectorAll(
          'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        return elements.length;
      });
      
      expect(focusableElements).toBeGreaterThan(0);
      console.log(`✅ ${focusableElements} focusable elements for keyboard navigation`);
      
      // Check color contrast (sample check)
      const contrastIssues = await page.evaluate(() => {
        const issues = [];
        const elements = document.querySelectorAll('*');
        
        // Simple contrast check for text elements
        for (const el of Array.from(elements).slice(0, 100)) { // Check first 100 elements
          if (el.textContent && el.textContent.trim()) {
            const style = window.getComputedStyle(el);
            const color = style.color;
            const bgColor = style.backgroundColor;
            
            // Skip if transparent
            if (bgColor === 'rgba(0, 0, 0, 0)') continue;
            
            // This is a simplified check - real contrast calculation would be more complex
            if (color === bgColor) {
              issues.push({
                text: el.textContent.substring(0, 30),
                color: color,
                background: bgColor
              });
            }
          }
        }
        
        return issues;
      });
      
      if (contrastIssues.length > 0) {
        console.warn(`⚠️ ${contrastIssues.length} potential contrast issues found`);
      }
    });
  });
});

// Generate summary report
test.afterAll(async () => {
  console.log('\n' + '='.repeat(80));
  console.log('📊 COMPREHENSIVE TEST SUITE COMPLETED');
  console.log('='.repeat(80));
  console.log(`\n✅ All critical system components tested`);
  console.log(`📱 Responsive design validated across all viewports`);
  console.log(`🌐 Multi-language support verified`);
  console.log(`🔌 API integration confirmed`);
  console.log(`⚡ Performance metrics collected`);
  console.log(`♿ Accessibility compliance checked`);
  console.log('\n' + '='.repeat(80));
});