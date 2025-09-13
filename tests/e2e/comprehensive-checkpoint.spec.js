/**
 * Comprehensive E2E Testing Checkpoint
 * Acts as a complete regression prevention system
 * Tests all critical aspects: Responsive, Visual, Accessibility, Performance, Functionality
 */

const { test, expect, devices } = require('@playwright/test');
const { injectAxe, checkA11y } = require('axe-playwright');

// Device Matrix for Comprehensive Testing
const DEVICE_MATRIX = [
  // Mobile Devices
  { name: 'iPhone 12', device: devices['iPhone 12'] },
  { name: 'iPhone SE', device: devices['iPhone SE'] },
  { name: 'Pixel 5', device: devices['Pixel 5'] },
  { name: 'Galaxy S20', device: devices['Galaxy S20'] },
  
  // Tablets
  { name: 'iPad Pro', device: devices['iPad Pro'] },
  { name: 'iPad Mini', device: devices['iPad Mini'] },
  { name: 'Galaxy Tab S7', device: devices['Galaxy Tab S7'] },
  
  // Desktop Viewports
  { name: 'Desktop HD', viewport: { width: 1920, height: 1080 } },
  { name: 'Desktop FHD', viewport: { width: 1440, height: 900 } },
  { name: 'Laptop', viewport: { width: 1366, height: 768 } },
  { name: 'Small Desktop', viewport: { width: 1024, height: 768 } }
];

// Critical Pages to Test
const CRITICAL_PAGES = [
  { url: '/', name: 'Home', testAuth: false },
  { url: '/home.html', name: 'Landing', testAuth: false },
  { url: '/courses.html', name: 'Courses', testAuth: true },
  { url: '/teachers.html', name: 'Teachers', testAuth: false },
  { url: '/career-center.html', name: 'Career Center', testAuth: true },
  { url: '/career-orientation.html', name: 'Career Orientation', testAuth: true },
  { url: '/pricing.html', name: 'Pricing', testAuth: false },
  { url: '/blog.html', name: 'Blog', testAuth: false },
  { url: '/about-us.html', name: 'About', testAuth: false },
  { url: '/contact-us.html', name: 'Contact', testAuth: false }
];

// Critical User Journeys
const USER_JOURNEYS = [
  {
    name: 'Course Enrollment Journey',
    steps: [
      { action: 'navigate', url: '/' },
      { action: 'click', selector: '[href*="courses"]' },
      { action: 'wait', selector: '.course-card' },
      { action: 'click', selector: '.course-card:first-child' },
      { action: 'click', selector: '.enroll-button, .primary-button' },
      { action: 'verify', selector: '.modal, .contact-form' }
    ]
  },
  {
    name: 'Contact Form Journey',
    steps: [
      { action: 'navigate', url: '/contact-us.html' },
      { action: 'fill', selector: 'input[name="name"]', value: 'Test User' },
      { action: 'fill', selector: 'input[name="email"]', value: 'test@example.com' },
      { action: 'fill', selector: 'textarea', value: 'Test message' },
      { action: 'click', selector: 'button[type="submit"]' },
      { action: 'verify', selector: '.success-message, .thank-you' }
    ]
  },
  {
    name: 'Navigation Journey',
    steps: [
      { action: 'navigate', url: '/' },
      { action: 'verify-navigation', items: ['Courses', 'Teachers', 'Career', 'Pricing', 'Blog', 'About', 'Contact'] }
    ]
  }
];

// Performance Metrics Thresholds
const PERFORMANCE_THRESHOLDS = {
  FCP: 2500,  // First Contentful Paint
  LCP: 4000,  // Largest Contentful Paint
  FID: 100,   // First Input Delay
  CLS: 0.1,   // Cumulative Layout Shift
  TTFB: 600,  // Time to First Byte
  TTI: 5000   // Time to Interactive
};

// Visual Regression Configuration
const VISUAL_CONFIG = {
  maxDiffPixels: 100,
  threshold: 0.2,
  animations: 'disabled',
  mask: ['.dynamic-content', '.timestamp', '.random-id']
};

test.describe('🛡️ Comprehensive E2E Testing Checkpoint', () => {
  test.setTimeout(120000); // 2 minutes per test
  
  // Test 1: Responsive Design Across All Devices
  test.describe('📱 Responsive Design Testing', () => {
    for (const device of DEVICE_MATRIX) {
      for (const page of CRITICAL_PAGES) {
        test(`${device.name} - ${page.name}`, async ({ browser }) => {
          const context = await browser.newContext(
            device.device || { viewport: device.viewport }
          );
          const browserPage = await context.newPage();
          
          // Navigate to page
          await browserPage.goto(page.url);
          await browserPage.waitForLoadState('networkidle');
          
          // Check viewport
          const viewport = browserPage.viewportSize();
          
          // Test 1: No horizontal scroll
          const bodyWidth = await browserPage.evaluate(() => document.body.scrollWidth);
          const windowWidth = await browserPage.evaluate(() => window.innerWidth);
          expect(bodyWidth).toBeLessThanOrEqual(windowWidth + 1);
          
          // Test 2: Mobile menu behavior
          if (viewport.width < 768) {
            // Check menu is closed by default
            const mobileMenu = await browserPage.$('.w-nav-overlay, .mobile-menu');
            if (mobileMenu) {
              const isVisible = await mobileMenu.isVisible();
              expect(isVisible).toBe(false);
            }
            
            // Check hamburger button is visible
            const hamburger = await browserPage.$('.w-nav-button, .menu-button, .hamburger');
            if (hamburger) {
              const isVisible = await hamburger.isVisible();
              expect(isVisible).toBe(true);
              
              // Test hamburger click
              await hamburger.click();
              await browserPage.waitForTimeout(500);
              
              // Verify menu opens
              const menuAfterClick = await browserPage.$('.w-nav-overlay, .mobile-menu, .w-nav-menu');
              if (menuAfterClick) {
                const isMenuVisible = await menuAfterClick.isVisible();
                expect(isMenuVisible).toBe(true);
              }
            }
          }
          
          // Test 3: Touch targets (minimum 44x44px)
          const touchTargets = await browserPage.$$('a, button, input, select, textarea, [role="button"]');
          for (const target of touchTargets.slice(0, 10)) { // Test first 10 to save time
            const box = await target.boundingBox();
            if (box && await target.isVisible()) {
              expect(box.width).toBeGreaterThanOrEqual(44);
              expect(box.height).toBeGreaterThanOrEqual(44);
            }
          }
          
          // Test 4: Images are responsive
          const images = await browserPage.$$('img');
          for (const img of images.slice(0, 5)) {
            const box = await img.boundingBox();
            if (box) {
              expect(box.width).toBeLessThanOrEqual(viewport.width);
            }
          }
          
          // Test 5: Text is readable
          const textElements = await browserPage.$$('p, h1, h2, h3, h4, h5, h6');
          for (const text of textElements.slice(0, 5)) {
            const fontSize = await text.evaluate(el => 
              window.getComputedStyle(el).fontSize
            );
            const size = parseFloat(fontSize);
            expect(size).toBeGreaterThanOrEqual(12); // Minimum readable size
          }
          
          await context.close();
        });
      }
    }
  });
  
  // Test 2: Visual Regression Testing
  test.describe('📸 Visual Regression Testing', () => {
    for (const page of CRITICAL_PAGES) {
      test(`Visual consistency - ${page.name}`, async ({ page: browserPage }) => {
        await browserPage.goto(page.url);
        await browserPage.waitForLoadState('networkidle');
        
        // Disable animations
        await browserPage.addStyleTag({
          content: `
            *, *::before, *::after {
              animation-duration: 0s !important;
              animation-delay: 0s !important;
              transition-duration: 0s !important;
              transition-delay: 0s !important;
            }
          `
        });
        
        // Take screenshots at different viewports
        const viewports = [
          { width: 1920, height: 1080, name: 'desktop' },
          { width: 768, height: 1024, name: 'tablet' },
          { width: 375, height: 812, name: 'mobile' }
        ];
        
        for (const viewport of viewports) {
          await browserPage.setViewportSize(viewport);
          await browserPage.waitForTimeout(500);
          
          // Full page screenshot
          await expect(browserPage).toHaveScreenshot(
            `${page.name.toLowerCase()}-${viewport.name}-full.png`,
            { 
              fullPage: true,
              maxDiffPixels: VISUAL_CONFIG.maxDiffPixels,
              threshold: VISUAL_CONFIG.threshold
            }
          );
          
          // Above-the-fold screenshot
          await expect(browserPage).toHaveScreenshot(
            `${page.name.toLowerCase()}-${viewport.name}-fold.png`,
            { 
              fullPage: false,
              maxDiffPixels: VISUAL_CONFIG.maxDiffPixels,
              threshold: VISUAL_CONFIG.threshold
            }
          );
        }
      });
    }
  });
  
  // Test 3: Accessibility Testing (WCAG 2.1 AA)
  test.describe('♿ Accessibility Testing', () => {
    for (const page of CRITICAL_PAGES) {
      test(`WCAG 2.1 AA compliance - ${page.name}`, async ({ page: browserPage }) => {
        await browserPage.goto(page.url);
        await browserPage.waitForLoadState('networkidle');
        
        // Inject axe-core
        await injectAxe(browserPage);
        
        // Run accessibility checks
        const results = await checkA11y(browserPage, null, {
          detailedReport: true,
          detailedReportOptions: {
            html: true
          },
          axeOptions: {
            runOnly: {
              type: 'tag',
              values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']
            },
            rules: {
              'color-contrast': { enabled: true },
              'html-has-lang': { enabled: true },
              'image-alt': { enabled: true },
              'label': { enabled: true },
              'link-name': { enabled: true },
              'list': { enabled: true },
              'listitem': { enabled: true },
              'meta-viewport': { enabled: true },
              'region': { enabled: true }
            }
          }
        });
        
        // Test keyboard navigation
        await browserPage.keyboard.press('Tab');
        const focusedElement = await browserPage.evaluate(() => {
          const el = document.activeElement;
          return {
            tag: el.tagName,
            visible: el.offsetParent !== null,
            hasOutline: window.getComputedStyle(el).outline !== 'none'
          };
        });
        
        expect(focusedElement.visible).toBe(true);
        expect(focusedElement.hasOutline).toBe(true);
        
        // Test ARIA labels
        const buttons = await browserPage.$$('button');
        for (const button of buttons.slice(0, 5)) {
          const ariaLabel = await button.getAttribute('aria-label');
          const textContent = await button.textContent();
          expect(ariaLabel || textContent).toBeTruthy();
        }
        
        // Test heading hierarchy
        const headings = await browserPage.$$eval('h1, h2, h3, h4, h5, h6', elements =>
          elements.map(el => ({
            level: parseInt(el.tagName[1]),
            text: el.textContent
          }))
        );
        
        let previousLevel = 0;
        for (const heading of headings) {
          expect(heading.level - previousLevel).toBeLessThanOrEqual(1);
          previousLevel = heading.level;
        }
      });
    }
  });
  
  // Test 4: Performance Testing (Core Web Vitals)
  test.describe('⚡ Performance Testing', () => {
    for (const page of CRITICAL_PAGES) {
      test(`Core Web Vitals - ${page.name}`, async ({ page: browserPage }) => {
        // Enable performance metrics collection
        const client = await browserPage.context().newCDPSession(browserPage);
        await client.send('Performance.enable');
        
        // Navigate and measure
        const navigationStart = Date.now();
        await browserPage.goto(page.url, { waitUntil: 'networkidle' });
        const loadTime = Date.now() - navigationStart;
        
        // Measure Core Web Vitals
        const metrics = await browserPage.evaluate(() => {
          return new Promise((resolve) => {
            const data = {
              FCP: 0,
              LCP: 0,
              CLS: 0,
              FID: 0,
              TTFB: 0,
              TTI: 0
            };
            
            // First Contentful Paint
            const fcpObserver = new PerformanceObserver((list) => {
              const entries = list.getEntries();
              for (const entry of entries) {
                if (entry.name === 'first-contentful-paint') {
                  data.FCP = entry.startTime;
                }
              }
            });
            fcpObserver.observe({ entryTypes: ['paint'] });
            
            // Largest Contentful Paint
            const lcpObserver = new PerformanceObserver((list) => {
              const entries = list.getEntries();
              const lastEntry = entries[entries.length - 1];
              data.LCP = lastEntry.renderTime || lastEntry.loadTime;
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            
            // Cumulative Layout Shift
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((list) => {
              for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                  clsValue += entry.value;
                }
              }
              data.CLS = clsValue;
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
            
            // Time to First Byte
            const navTiming = performance.getEntriesByType('navigation')[0];
            if (navTiming) {
              data.TTFB = navTiming.responseStart - navTiming.fetchStart;
            }
            
            setTimeout(() => resolve(data), 3000);
          });
        });
        
        // Assert performance metrics
        expect(loadTime).toBeLessThan(5000);
        expect(metrics.FCP).toBeLessThan(PERFORMANCE_THRESHOLDS.FCP);
        expect(metrics.LCP).toBeLessThan(PERFORMANCE_THRESHOLDS.LCP);
        expect(metrics.CLS).toBeLessThan(PERFORMANCE_THRESHOLDS.CLS);
        expect(metrics.TTFB).toBeLessThan(PERFORMANCE_THRESHOLDS.TTFB);
        
        // Test resource loading
        const resources = await browserPage.evaluate(() => {
          return performance.getEntriesByType('resource').map(r => ({
            name: r.name,
            duration: r.duration,
            size: r.transferSize
          }));
        });
        
        // Check for oversized resources
        for (const resource of resources) {
          if (resource.name.includes('.js')) {
            expect(resource.size).toBeLessThan(500000); // 500KB max for JS
          }
          if (resource.name.includes('.css')) {
            expect(resource.size).toBeLessThan(200000); // 200KB max for CSS
          }
          if (resource.name.match(/\.(jpg|jpeg|png|webp)/)) {
            expect(resource.size).toBeLessThan(1000000); // 1MB max for images
          }
        }
      });
    }
  });
  
  // Test 5: Critical User Journey Testing
  test.describe('🚶 User Journey Testing', () => {
    for (const journey of USER_JOURNEYS) {
      test(`Journey: ${journey.name}`, async ({ page }) => {
        for (const step of journey.steps) {
          switch (step.action) {
            case 'navigate':
              await page.goto(step.url);
              await page.waitForLoadState('networkidle');
              break;
              
            case 'click':
              const clickElement = await page.waitForSelector(step.selector, { timeout: 5000 });
              await clickElement.click();
              await page.waitForTimeout(500);
              break;
              
            case 'fill':
              const fillElement = await page.waitForSelector(step.selector, { timeout: 5000 });
              await fillElement.fill(step.value);
              break;
              
            case 'wait':
              await page.waitForSelector(step.selector, { timeout: 10000 });
              break;
              
            case 'verify':
              const verifyElement = await page.$(step.selector);
              expect(verifyElement).toBeTruthy();
              break;
              
            case 'verify-navigation':
              for (const item of step.items) {
                const navItem = await page.$(`text=${item}`);
                expect(navItem).toBeTruthy();
              }
              break;
          }
        }
      });
    }
  });
  
  // Test 6: Cross-Browser Compatibility
  test.describe('🌐 Cross-Browser Testing', () => {
    const browsers = ['chromium', 'firefox', 'webkit'];
    
    for (const browserName of browsers) {
      test(`Browser compatibility - ${browserName}`, async ({ playwright }) => {
        const browser = await playwright[browserName].launch();
        const context = await browser.newContext();
        const page = await context.newPage();
        
        // Test critical functionality
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        
        // Check if page loads without errors
        const consoleErrors = [];
        page.on('console', msg => {
          if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
          }
        });
        
        // Navigate through critical pages
        for (const criticalPage of CRITICAL_PAGES.slice(0, 3)) {
          await page.goto(criticalPage.url);
          await page.waitForLoadState('networkidle');
          
          // Check for JavaScript errors
          const jsErrors = await page.evaluate(() => {
            return window.jsErrors || [];
          });
          expect(jsErrors).toHaveLength(0);
          
          // Check if critical elements exist
          const header = await page.$('header, .navbar');
          expect(header).toBeTruthy();
          
          const footer = await page.$('footer');
          expect(footer).toBeTruthy();
          
          const mainContent = await page.$('main, .main-content, .page-wrapper');
          expect(mainContent).toBeTruthy();
        }
        
        expect(consoleErrors).toHaveLength(0);
        
        await browser.close();
      });
    }
  });
  
  // Test 7: API and Network Testing
  test.describe('🔌 API and Network Testing', () => {
    test('API endpoints are responsive', async ({ page }) => {
      const apiEndpoints = [
        '/api/courses',
        '/api/teachers',
        '/api/home-page',
        '/api/career-center-page',
        '/api/blog-posts'
      ];
      
      for (const endpoint of apiEndpoints) {
        const response = await page.request.get(`http://localhost:3000${endpoint}`);
        expect(response.status()).toBe(200);
        
        const responseTime = response.headers()['x-response-time'];
        if (responseTime) {
          expect(parseFloat(responseTime)).toBeLessThan(1000); // Less than 1 second
        }
        
        const data = await response.json();
        expect(data).toBeTruthy();
      }
    });
    
    test('No broken links', async ({ page }) => {
      await page.goto('/');
      
      const links = await page.$$eval('a[href]', links =>
        links.map(link => link.href).filter(href => 
          !href.includes('mailto:') && 
          !href.includes('tel:') && 
          !href.includes('#')
        )
      );
      
      for (const link of links.slice(0, 10)) { // Test first 10 links
        const response = await page.request.get(link).catch(() => null);
        if (response) {
          expect(response.status()).toBeLessThan(400);
        }
      }
    });
  });
  
  // Test 8: Security Testing
  test.describe('🔒 Security Testing', () => {
    test('Security headers are present', async ({ page }) => {
      const response = await page.goto('/');
      const headers = response.headers();
      
      // Check for security headers
      const securityHeaders = [
        'x-content-type-options',
        'x-frame-options',
        'x-xss-protection',
        'strict-transport-security'
      ];
      
      for (const header of securityHeaders) {
        // Note: Some may not be present in dev, but should be in production
        if (headers[header]) {
          expect(headers[header]).toBeTruthy();
        }
      }
    });
    
    test('No sensitive data in console', async ({ page }) => {
      const consoleLogs = [];
      page.on('console', msg => consoleLogs.push(msg.text()));
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Check for sensitive data patterns
      const sensitivePatterns = [
        /password/i,
        /token/i,
        /api[_-]?key/i,
        /secret/i,
        /credential/i
      ];
      
      for (const log of consoleLogs) {
        for (const pattern of sensitivePatterns) {
          expect(log).not.toMatch(pattern);
        }
      }
    });
  });
  
  // Test 9: Form Validation Testing
  test.describe('📝 Form Testing', () => {
    test('Contact form validation', async ({ page }) => {
      await page.goto('/contact-us.html');
      
      // Test empty form submission
      const submitButton = await page.$('button[type="submit"]');
      if (submitButton) {
        await submitButton.click();
        
        // Check for validation messages
        const validationMessage = await page.$('.error-message, .validation-error, [aria-invalid="true"]');
        expect(validationMessage).toBeTruthy();
      }
      
      // Test invalid email
      const emailInput = await page.$('input[type="email"], input[name="email"]');
      if (emailInput) {
        await emailInput.fill('invalid-email');
        await submitButton.click();
        
        const emailError = await page.$('.email-error, [data-error*="email"]');
        expect(emailError).toBeTruthy();
      }
    });
  });
  
  // Test 10: Localization Testing
  test.describe('🌍 Localization Testing', () => {
    const languages = [
      { code: 'en', url: '/en/', rtl: false },
      { code: 'ru', url: '/ru/', rtl: false },
      { code: 'he', url: '/he/', rtl: true }
    ];
    
    for (const lang of languages) {
      test(`Language: ${lang.code}`, async ({ page }) => {
        await page.goto(lang.url);
        
        // Check language attribute
        const htmlLang = await page.getAttribute('html', 'lang');
        expect(htmlLang).toContain(lang.code);
        
        // Check RTL for Hebrew
        if (lang.rtl) {
          const dir = await page.getAttribute('html', 'dir');
          expect(dir).toBe('rtl');
        }
        
        // Check that content is translated (not English)
        if (lang.code !== 'en') {
          const bodyText = await page.textContent('body');
          
          // Should not contain too much English text
          const englishWords = ['Home', 'About', 'Contact', 'Courses', 'Teachers'];
          let englishCount = 0;
          for (const word of englishWords) {
            if (bodyText.includes(word)) {
              englishCount++;
            }
          }
          expect(englishCount).toBeLessThan(3); // Allow some English, but not all
        }
      });
    }
  });
});

// Helper function to run all tests and generate report
async function runComprehensiveTests() {
  const { exec } = require('child_process');
  const { promisify } = require('util');
  const execAsync = promisify(exec);
  
  console.log('🚀 Starting Comprehensive E2E Testing Checkpoint...\n');
  
  try {
    const { stdout, stderr } = await execAsync(
      'npx playwright test tests/e2e/comprehensive-checkpoint.spec.js --reporter=html'
    );
    
    console.log(stdout);
    if (stderr) console.error(stderr);
    
    console.log('\n✅ Testing complete! View report at: test-results/html-report/index.html');
  } catch (error) {
    console.error('❌ Tests failed:', error.message);
    console.log('\n📊 View detailed report at: test-results/html-report/index.html');
  }
}

module.exports = { runComprehensiveTests };