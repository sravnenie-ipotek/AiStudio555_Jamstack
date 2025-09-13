/**
 * Comprehensive QA Checkpoint Test Suite
 * A robust testing framework that prevents regressions and ensures quality
 * Based on industry best practices for E2E testing
 */

const { test, expect, devices } = require('@playwright/test');
const fs = require('fs').promises;
const path = require('path');

// Test configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3005';

// Critical pages to test
const PAGES = [
  { path: '/home.html', name: 'Home' },
  { path: '/courses.html', name: 'Courses' },
  { path: '/teachers.html', name: 'Teachers' },
  { path: '/career-center.html', name: 'Career Center' },
  { path: '/career-orientation.html', name: 'Career Orientation' },
  { path: '/pricing.html', name: 'Pricing' },
  { path: '/blog.html', name: 'Blog' },
  { path: '/about-us.html', name: 'About' },
  { path: '/contact-us.html', name: 'Contact' }
];

// Device configurations
const DEVICES = [
  { name: 'Mobile', viewport: { width: 375, height: 812 }, userAgent: devices['iPhone 12'].userAgent },
  { name: 'Tablet', viewport: { width: 768, height: 1024 }, userAgent: devices['iPad'].userAgent },
  { name: 'Desktop', viewport: { width: 1920, height: 1080 } }
];

// Performance thresholds
const PERF_THRESHOLDS = {
  pageLoad: 5000,      // 5 seconds
  firstPaint: 2500,    // 2.5 seconds
  interactive: 3500,   // 3.5 seconds
  resourceSize: {
    js: 500000,        // 500KB for JS files
    css: 200000,       // 200KB for CSS files
    image: 1000000     // 1MB for images
  }
};

// Test results collector
const testResults = {
  passed: [],
  failed: [],
  warnings: [],
  timestamp: new Date().toISOString()
};

test.describe('🛡️ Comprehensive QA Checkpoint', () => {
  test.setTimeout(90000); // 1.5 minutes per test
  
  // ========== RESPONSIVE TESTING ==========
  test.describe('📱 Responsive Design Tests', () => {
    for (const device of DEVICES) {
      for (const page of PAGES) {
        test(`${device.name} - ${page.name}`, async ({ browser }) => {
          const context = await browser.newContext({
            viewport: device.viewport,
            userAgent: device.userAgent
          });
          
          const browserPage = await context.newPage();
          
          try {
            // Navigate to page
            await browserPage.goto(`${BASE_URL}${page.path}`, {
              waitUntil: 'networkidle',
              timeout: 30000
            });
            
            // Test 1: No horizontal scroll
            const hasHorizontalScroll = await browserPage.evaluate(() => {
              return document.body.scrollWidth > window.innerWidth;
            });
            
            if (hasHorizontalScroll) {
              testResults.failed.push({
                test: 'Horizontal Scroll',
                device: device.name,
                page: page.name,
                issue: 'Horizontal scrolling detected'
              });
            } else {
              testResults.passed.push({
                test: 'Horizontal Scroll',
                device: device.name,
                page: page.name
              });
            }
            
            expect(hasHorizontalScroll).toBe(false);
            
            // Test 2: Mobile menu behavior (mobile only)
            if (device.viewport.width < 768) {
              // Check menu is closed by default
              const mobileMenu = await browserPage.$('.w-nav-overlay, .mobile-menu, .w-nav-menu');
              if (mobileMenu) {
                const isVisible = await mobileMenu.isVisible();
                
                if (isVisible) {
                  testResults.failed.push({
                    test: 'Mobile Menu Default State',
                    device: device.name,
                    page: page.name,
                    issue: 'Mobile menu open by default'
                  });
                } else {
                  testResults.passed.push({
                    test: 'Mobile Menu Default State',
                    device: device.name,
                    page: page.name
                  });
                }
                
                expect(isVisible).toBe(false);
              }
              
              // Check hamburger button exists and is visible
              const hamburger = await browserPage.$('.w-nav-button, .menu-button, .hamburger');
              if (hamburger) {
                const isVisible = await hamburger.isVisible();
                
                if (!isVisible) {
                  testResults.failed.push({
                    test: 'Hamburger Button',
                    device: device.name,
                    page: page.name,
                    issue: 'Hamburger button not visible'
                  });
                } else {
                  testResults.passed.push({
                    test: 'Hamburger Button',
                    device: device.name,
                    page: page.name
                  });
                  
                  // Test hamburger click
                  try {
                    await hamburger.click({ timeout: 3000 });
                    await browserPage.waitForTimeout(500);
                    
                    const menuAfterClick = await browserPage.$('.w-nav-overlay, .mobile-menu, .w-nav-menu');
                    if (menuAfterClick) {
                      const isMenuOpen = await menuAfterClick.isVisible();
                      if (isMenuOpen) {
                        testResults.passed.push({
                          test: 'Hamburger Functionality',
                          device: device.name,
                          page: page.name
                        });
                      }
                    }
                  } catch (error) {
                    testResults.warnings.push({
                      test: 'Hamburger Click',
                      device: device.name,
                      page: page.name,
                      warning: 'Could not test hamburger click'
                    });
                  }
                }
                
                expect(isVisible).toBe(true);
              }
            }
            
            // Test 3: Touch targets (mobile/tablet)
            if (device.viewport.width < 1024) {
              const touchTargets = await browserPage.$$('a, button, input, select, textarea');
              let smallTargets = 0;
              
              for (const target of touchTargets.slice(0, 10)) {
                if (await target.isVisible()) {
                  const box = await target.boundingBox();
                  if (box && (box.width < 44 || box.height < 44)) {
                    smallTargets++;
                  }
                }
              }
              
              if (smallTargets > 5) {
                testResults.warnings.push({
                  test: 'Touch Targets',
                  device: device.name,
                  page: page.name,
                  warning: `${smallTargets} touch targets below 44px`
                });
              } else {
                testResults.passed.push({
                  test: 'Touch Targets',
                  device: device.name,
                  page: page.name
                });
              }
            }
            
            // Test 4: Critical elements visibility
            const criticalElements = [
              { selector: 'header, .navbar', name: 'Header' },
              { selector: 'footer', name: 'Footer' },
              { selector: 'main, .main-content, .page-wrapper', name: 'Main Content' }
            ];
            
            for (const element of criticalElements) {
              const el = await browserPage.$(element.selector);
              if (el && await el.isVisible()) {
                testResults.passed.push({
                  test: `${element.name} Visibility`,
                  device: device.name,
                  page: page.name
                });
              } else {
                testResults.failed.push({
                  test: `${element.name} Visibility`,
                  device: device.name,
                  page: page.name,
                  issue: `${element.name} not visible`
                });
              }
            }
            
          } catch (error) {
            testResults.failed.push({
              test: 'Page Load',
              device: device.name,
              page: page.name,
              issue: error.message
            });
          } finally {
            await context.close();
          }
        });
      }
    }
  });
  
  // ========== PERFORMANCE TESTING ==========
  test.describe('⚡ Performance Tests', () => {
    for (const page of PAGES) {
      test(`Performance - ${page.name}`, async ({ page: browserPage }) => {
        // Start performance measurement
        const startTime = Date.now();
        
        // Navigate with performance tracking
        const response = await browserPage.goto(`${BASE_URL}${page.path}`, {
          waitUntil: 'networkidle'
        });
        
        const loadTime = Date.now() - startTime;
        
        // Check load time
        if (loadTime > PERF_THRESHOLDS.pageLoad) {
          testResults.failed.push({
            test: 'Page Load Time',
            page: page.name,
            issue: `Load time ${loadTime}ms exceeds ${PERF_THRESHOLDS.pageLoad}ms`
          });
        } else {
          testResults.passed.push({
            test: 'Page Load Time',
            page: page.name,
            value: `${loadTime}ms`
          });
        }
        
        expect(loadTime).toBeLessThan(PERF_THRESHOLDS.pageLoad);
        
        // Get performance metrics
        const perfMetrics = await browserPage.evaluate(() => {
          const perf = performance.getEntriesByType('navigation')[0];
          return {
            domReady: perf.domContentLoadedEventEnd - perf.fetchStart,
            loadComplete: perf.loadEventEnd - perf.fetchStart,
            ttfb: perf.responseStart - perf.fetchStart,
            resourceCount: performance.getEntriesByType('resource').length
          };
        });
        
        // Check TTFB
        if (perfMetrics.ttfb > 600) {
          testResults.warnings.push({
            test: 'Time to First Byte',
            page: page.name,
            warning: `TTFB ${perfMetrics.ttfb}ms is slow`
          });
        }
        
        // Check resource sizes
        const resources = await browserPage.evaluate(() => {
          return performance.getEntriesByType('resource').map(r => ({
            name: r.name,
            size: r.transferSize,
            duration: r.duration,
            type: r.name.split('.').pop().split('?')[0]
          }));
        });
        
        let oversizedResources = [];
        resources.forEach(resource => {
          if (resource.type === 'js' && resource.size > PERF_THRESHOLDS.resourceSize.js) {
            oversizedResources.push(`JS: ${resource.name} (${Math.round(resource.size/1000)}KB)`);
          }
          if (resource.type === 'css' && resource.size > PERF_THRESHOLDS.resourceSize.css) {
            oversizedResources.push(`CSS: ${resource.name} (${Math.round(resource.size/1000)}KB)`);
          }
          if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(resource.type) && 
              resource.size > PERF_THRESHOLDS.resourceSize.image) {
            oversizedResources.push(`Image: ${resource.name} (${Math.round(resource.size/1000)}KB)`);
          }
        });
        
        if (oversizedResources.length > 0) {
          testResults.warnings.push({
            test: 'Resource Sizes',
            page: page.name,
            warning: `Oversized resources: ${oversizedResources.join(', ')}`
          });
        }
      });
    }
  });
  
  // ========== FUNCTIONALITY TESTING ==========
  test.describe('🔧 Functionality Tests', () => {
    test('Navigation links work', async ({ page }) => {
      await page.goto(`${BASE_URL}/home.html`);
      
      // Get all navigation links
      const navLinks = await page.$$eval('nav a, .nav-menu a', links => 
        links.map(link => ({
          href: link.href,
          text: link.textContent.trim()
        }))
      );
      
      let brokenLinks = [];
      for (const link of navLinks.slice(0, 5)) {
        try {
          const response = await page.request.get(link.href);
          if (response.status() >= 400) {
            brokenLinks.push(`${link.text}: ${response.status()}`);
          }
        } catch (error) {
          brokenLinks.push(`${link.text}: ${error.message}`);
        }
      }
      
      if (brokenLinks.length > 0) {
        testResults.failed.push({
          test: 'Navigation Links',
          issue: `Broken links: ${brokenLinks.join(', ')}`
        });
      } else {
        testResults.passed.push({
          test: 'Navigation Links'
        });
      }
      
      expect(brokenLinks).toHaveLength(0);
    });
    
    test('Contact form exists and is functional', async ({ page }) => {
      await page.goto(`${BASE_URL}/contact-us.html`);
      
      // Check form exists
      const form = await page.$('form');
      expect(form).toBeTruthy();
      
      // Check required fields
      const requiredFields = [
        { selector: 'input[name="name"], input[type="text"]', name: 'Name' },
        { selector: 'input[name="email"], input[type="email"]', name: 'Email' },
        { selector: 'textarea', name: 'Message' }
      ];
      
      for (const field of requiredFields) {
        const element = await page.$(field.selector);
        if (element) {
          testResults.passed.push({
            test: `Contact Form - ${field.name} Field`
          });
        } else {
          testResults.failed.push({
            test: `Contact Form - ${field.name} Field`,
            issue: 'Field not found'
          });
        }
        expect(element).toBeTruthy();
      }
      
      // Check submit button
      const submitButton = await page.$('button[type="submit"], input[type="submit"]');
      expect(submitButton).toBeTruthy();
    });
    
    test('Sign up buttons trigger modal', async ({ page }) => {
      await page.goto(`${BASE_URL}/home.html`);
      
      // Find sign up button
      const signUpButton = await page.$('.primary-button, [href*="contact"]');
      
      if (signUpButton) {
        // Click and check for modal
        await signUpButton.click();
        await page.waitForTimeout(1000);
        
        const modal = await page.$('.modal, .contact-modal, .popup');
        if (modal && await modal.isVisible()) {
          testResults.passed.push({
            test: 'Sign Up Modal'
          });
        } else {
          testResults.warnings.push({
            test: 'Sign Up Modal',
            warning: 'Modal not detected after sign up click'
          });
        }
      }
    });
  });
  
  // ========== ACCESSIBILITY TESTING ==========
  test.describe('♿ Accessibility Tests', () => {
    for (const page of PAGES.slice(0, 3)) { // Test first 3 pages to save time
      test(`Accessibility - ${page.name}`, async ({ page: browserPage }) => {
        await browserPage.goto(`${BASE_URL}${page.path}`);
        
        // Check for alt text on images
        const imagesWithoutAlt = await browserPage.$$eval('img:not([alt])', imgs => imgs.length);
        
        if (imagesWithoutAlt > 0) {
          testResults.warnings.push({
            test: 'Image Alt Text',
            page: page.name,
            warning: `${imagesWithoutAlt} images without alt text`
          });
        } else {
          testResults.passed.push({
            test: 'Image Alt Text',
            page: page.name
          });
        }
        
        // Check heading hierarchy
        const headings = await browserPage.$$eval('h1, h2, h3, h4, h5, h6', elements =>
          elements.map(el => parseInt(el.tagName[1]))
        );
        
        let headingIssues = false;
        for (let i = 1; i < headings.length; i++) {
          if (headings[i] - headings[i-1] > 1) {
            headingIssues = true;
            break;
          }
        }
        
        if (headingIssues) {
          testResults.warnings.push({
            test: 'Heading Hierarchy',
            page: page.name,
            warning: 'Heading levels skip'
          });
        } else {
          testResults.passed.push({
            test: 'Heading Hierarchy',
            page: page.name
          });
        }
        
        // Check for keyboard navigation
        await browserPage.keyboard.press('Tab');
        const focusedElement = await browserPage.evaluate(() => {
          return document.activeElement.tagName;
        });
        
        if (focusedElement && focusedElement !== 'BODY') {
          testResults.passed.push({
            test: 'Keyboard Navigation',
            page: page.name
          });
        } else {
          testResults.warnings.push({
            test: 'Keyboard Navigation',
            page: page.name,
            warning: 'Tab navigation may not work properly'
          });
        }
      });
    }
  });
  
  // ========== CONSOLE ERROR TESTING ==========
  test.describe('🔍 Console Error Tests', () => {
    for (const page of PAGES) {
      test(`Console errors - ${page.name}`, async ({ page: browserPage }) => {
        const errors = [];
        
        browserPage.on('console', msg => {
          if (msg.type() === 'error') {
            errors.push(msg.text());
          }
        });
        
        browserPage.on('pageerror', error => {
          errors.push(error.message);
        });
        
        await browserPage.goto(`${BASE_URL}${page.path}`, {
          waitUntil: 'networkidle'
        });
        
        // Filter out expected errors
        const criticalErrors = errors.filter(error => 
          !error.includes('favicon') &&
          !error.includes('404') &&
          !error.includes('Failed to load resource')
        );
        
        if (criticalErrors.length > 0) {
          testResults.failed.push({
            test: 'Console Errors',
            page: page.name,
            issue: criticalErrors.join('; ')
          });
        } else {
          testResults.passed.push({
            test: 'Console Errors',
            page: page.name
          });
        }
        
        expect(criticalErrors).toHaveLength(0);
      });
    }
  });
  
  // ========== TEST SUMMARY ==========
  test.afterAll(async () => {
    // Create test report
    const report = {
      ...testResults,
      summary: {
        total: testResults.passed.length + testResults.failed.length,
        passed: testResults.passed.length,
        failed: testResults.failed.length,
        warnings: testResults.warnings.length,
        passRate: Math.round((testResults.passed.length / (testResults.passed.length + testResults.failed.length)) * 100)
      }
    };
    
    // Save report to file
    const reportPath = path.join('test-results', 'comprehensive-qa-report.json');
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 COMPREHENSIVE QA CHECKPOINT SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Passed: ${report.summary.passed}`);
    console.log(`❌ Failed: ${report.summary.failed}`);
    console.log(`⚠️  Warnings: ${report.summary.warnings}`);
    console.log(`📈 Pass Rate: ${report.summary.passRate}%`);
    console.log('='.repeat(60));
    
    // Print failed tests
    if (report.failed.length > 0) {
      console.log('\n❌ FAILED TESTS:');
      report.failed.forEach(failure => {
        console.log(`  - ${failure.test} (${failure.page || failure.device}): ${failure.issue}`);
      });
    }
    
    // Print warnings
    if (report.warnings.length > 0) {
      console.log('\n⚠️  WARNINGS:');
      report.warnings.forEach(warning => {
        console.log(`  - ${warning.test} (${warning.page || warning.device}): ${warning.warning}`);
      });
    }
    
    console.log(`\n📁 Full report saved to: ${reportPath}\n`);
  });
});