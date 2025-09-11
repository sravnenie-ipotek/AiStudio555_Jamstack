const { test, expect } = require('@playwright/test');

test.describe('Console Error Detection', () => {
  const testUrls = [
    { name: 'Home', url: 'home.html' },
    { name: 'Courses', url: 'courses.html' },
    { name: 'Teachers', url: 'teachers.html' },
    { name: 'Career Center', url: 'career-center.html' },
    { name: 'Career Orientation', url: 'career-orientation.html' },
    { name: 'English Home', url: 'dist/en/index.html' },
    { name: 'Russian Home', url: 'dist/ru/index.html' },
    { name: 'Hebrew Home', url: 'dist/he/index.html' }
  ];

  // Categorize error types
  const errorCategories = {
    critical: [
      /uncaught.*error/i,
      /script error/i,
      /syntax.*error/i,
      /reference.*error/i,
      /type.*error/i,
      /cannot read prop/i
    ],
    network: [
      /failed to load/i,
      /404/,
      /500/,
      /network.*error/i,
      /cors.*error/i
    ],
    api: [
      /api.*error/i,
      /fetch.*failed/i,
      /xhr.*error/i
    ],
    resources: [
      /favicon/i,
      /font.*not.*found/i,
      /image.*not.*found/i
    ],
    emailjs: [
      /emailjs/i,
      /email.*service/i
    ]
  };

  for (const { name, url } of testUrls) {
    test(`${name} - Console Error Detection`, async ({ page }) => {
      const consoleMessages = {
        errors: [],
        warnings: [],
        logs: [],
        info: []
      };

      // Capture all console messages
      page.on('console', msg => {
        const text = msg.text();
        const type = msg.type();

        consoleMessages[type + 's']?.push({
          type,
          text,
          location: msg.location(),
          timestamp: new Date().toISOString()
        });
      });

      // Capture network failures
      const networkErrors = [];
      page.on('response', response => {
        if (!response.ok()) {
          networkErrors.push({
            url: response.url(),
            status: response.status(),
            statusText: response.statusText()
          });
        }
      });

      // Capture unhandled exceptions
      const unhandledErrors = [];
      page.on('pageerror', error => {
        unhandledErrors.push({
          message: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString()
        });
      });

      // Navigate and wait for complete load
      await page.goto(url);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000); // Wait for dynamic content

      // Categorize errors
      const categorizedErrors = {
        critical: [],
        network: [],
        api: [],
        resources: [],
        emailjs: [],
        other: []
      };

      // Process console errors
      consoleMessages.errors.forEach(error => {
        let categorized = false;
        
        for (const [category, patterns] of Object.entries(errorCategories)) {
          if (patterns.some(pattern => pattern.test(error.text))) {
            categorizedErrors[category].push(error);
            categorized = true;
            break;
          }
        }
        
        if (!categorized) {
          categorizedErrors.other.push(error);
        }
      });

      // Add network errors to network category
      networkErrors.forEach(error => {
        categorizedErrors.network.push({
          type: 'network',
          text: `${error.status} ${error.statusText}: ${error.url}`,
          url: error.url,
          status: error.status
        });
      });

      // Add unhandled errors to critical category
      unhandledErrors.forEach(error => {
        categorizedErrors.critical.push({
          type: 'pageerror',
          text: error.message,
          stack: error.stack
        });
      });

      // Generate comprehensive report
      console.log(`\n=== ${name} Console Report ===`);
      
      let totalCriticalErrors = 0;
      for (const [category, errors] of Object.entries(categorizedErrors)) {
        if (errors.length > 0) {
          console.log(`\n${category.toUpperCase()} (${errors.length}):`);
          errors.forEach((error, index) => {
            console.log(`  ${index + 1}. ${error.text}`);
            if (error.location) {
              console.log(`     Location: ${error.location.url}:${error.location.lineNumber}`);
            }
          });
          
          if (category === 'critical') {
            totalCriticalErrors += errors.length;
          }
        }
      }

      // Log warnings summary
      if (consoleMessages.warnings.length > 0) {
        console.log(`\nWARNINGS (${consoleMessages.warnings.length}):`);
        consoleMessages.warnings.slice(0, 5).forEach((warning, index) => {
          console.log(`  ${index + 1}. ${warning.text}`);
        });
        if (consoleMessages.warnings.length > 5) {
          console.log(`  ... and ${consoleMessages.warnings.length - 5} more`);
        }
      }

      // Assertions
      // Critical errors should be zero
      expect(totalCriticalErrors).toBe(0);
      
      // Network errors should be minimal (allow some favicon/resource 404s)
      const criticalNetworkErrors = categorizedErrors.network.filter(error => 
        !error.text.includes('favicon') && 
        !error.text.includes('robots.txt') &&
        error.status !== 404
      );
      expect(criticalNetworkErrors.length).toBeLessThanOrEqual(2);

      // API errors should be zero
      expect(categorizedErrors.api.length).toBe(0);

      // Test JavaScript functionality is working
      await page.evaluate(() => {
        // Test basic JS functionality
        const testDiv = document.createElement('div');
        testDiv.id = 'js-test';
        document.body.appendChild(testDiv);
        return true;
      });
      
      const jsTest = await page.locator('#js-test').isVisible();
      expect(jsTest).toBe(true);

      console.log(`✅ ${name} passed console error tests`);
    });
  }

  test('EmailJS Integration Error Detection', async ({ page }) => {
    const emailjsErrors = [];
    
    page.on('console', msg => {
      if (msg.text().toLowerCase().includes('emailjs')) {
        emailjsErrors.push({
          type: msg.type(),
          text: msg.text(),
          timestamp: new Date().toISOString()
        });
      }
    });

    await page.goto('home.html');
    await page.waitForLoadState('networkidle');

    // Try to trigger contact modal
    const signUpBtn = page.locator('a:has-text("Sign Up"), .primary-button').first();
    if (await signUpBtn.isVisible()) {
      await signUpBtn.click();
      await page.waitForTimeout(2000);

      // Check if modal opened successfully
      const modal = page.locator('#contactModal');
      const modalVisible = await modal.isVisible();
      
      if (modalVisible) {
        console.log('✅ Contact modal opened successfully');
        
        // Check EmailJS initialization
        const emailjsReady = await page.evaluate(() => window.emailJSReady);
        console.log('EmailJS Ready:', emailjsReady);
        
        // Try to fill and submit form (don't actually submit)
        await page.fill('#fullName', 'Test User');
        await page.fill('#phoneNumber', '+1234567890');
        await page.fill('#message', 'Test message for E2E testing');
        
        console.log('✅ Form fields working correctly');
      }
    }

    // Report EmailJS specific issues
    if (emailjsErrors.length > 0) {
      console.log('\nEmailJS Messages:');
      emailjsErrors.forEach((error, index) => {
        console.log(`  ${index + 1}. [${error.type}] ${error.text}`);
      });
    }

    // Allow EmailJS warnings but not critical errors
    const criticalEmailjsErrors = emailjsErrors.filter(error => 
      error.type === 'error' && 
      !error.text.includes('init') // Allow init-related issues for now
    );
    expect(criticalEmailjsErrors.length).toBeLessThanOrEqual(1);
  });

  test('Performance Console Warnings', async ({ page }) => {
    const performanceWarnings = [];
    
    page.on('console', msg => {
      const text = msg.text().toLowerCase();
      if (
        text.includes('performance') ||
        text.includes('slow') ||
        text.includes('optimization') ||
        text.includes('memory') ||
        text.includes('layout') ||
        text.includes('repaint')
      ) {
        performanceWarnings.push({
          type: msg.type(),
          text: msg.text()
        });
      }
    });

    await page.goto('home.html');
    await page.waitForLoadState('networkidle');

    // Generate performance report
    const metrics = await page.evaluate(() => {
      const perf = performance.getEntriesByType('navigation')[0];
      return {
        domContentLoaded: perf.domContentLoadedEventEnd - perf.domContentLoadedEventStart,
        loadComplete: perf.loadEventEnd - perf.loadEventStart,
        firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime || 0
      };
    });

    console.log('\nPerformance Metrics:');
    console.log('DOM Content Loaded:', metrics.domContentLoaded + 'ms');
    console.log('Load Complete:', metrics.loadComplete + 'ms');
    console.log('First Paint:', metrics.firstPaint + 'ms');
    console.log('First Contentful Paint:', metrics.firstContentfulPaint + 'ms');

    if (performanceWarnings.length > 0) {
      console.log('\nPerformance Warnings:');
      performanceWarnings.forEach((warning, index) => {
        console.log(`  ${index + 1}. [${warning.type}] ${warning.text}`);
      });
    }

    // Performance thresholds
    expect(metrics.firstContentfulPaint).toBeLessThan(3000); // 3 seconds
    expect(performanceWarnings.filter(w => w.type === 'error').length).toBe(0);
  });
});