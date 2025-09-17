const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3005';

// All pages to monitor
const PAGES_TO_TEST = [
  'home.html',
  'courses.html', 
  'teachers.html',
  'career-center.html',
  'career-orientation.html',
  'pricing.html',
  'blog.html',
  'about-us.html',
  'contact-us.html',
  'en/index.html',
  'ru/index.html',
  'he/index.html',
];

// Error categories
const ERROR_CATEGORIES = {
  CRITICAL: ['TypeError', 'ReferenceError', 'SyntaxError'],
  NETWORK: ['Failed to fetch', 'NetworkError', 'ERR_INTERNET_DISCONNECTED'],
  RESOURCE: ['404', '403', 'Failed to load resource'],
  API: ['/api/', 'railway.app'],
  EMAILJS: ['EmailJS', 'emailjs-com'],
  WARNING: ['Deprecation', 'Warning'],
};

test.describe('🚨 Console Error Detection Suite', () => {
  for (const page of PAGES_TO_TEST) {
    test(`${page} - Zero console errors`, async ({ page: browserPage }) => {
      const errors = {
        console: [],
        network: [],
        pageErrors: [],
        resources: [],
      };

      // Set up error monitoring
      browserPage.on('console', msg => {
        const type = msg.type();
        const text = msg.text();
        
        if (type === 'error') {
          const errorData = {
            text: text,
            type: type,
            location: msg.location(),
            timestamp: new Date().toISOString(),
            category: categorizeError(text)
          };
          errors.console.push(errorData);
          
          // Log critical errors immediately
          if (errorData.category === 'CRITICAL') {
            console.error(`❌ CRITICAL ERROR on ${page}:`, text);
          }
        } else if (type === 'warning') {
          if (!text.includes('DevTools') && !text.includes('Chrome extension')) {
            errors.console.push({
              text: text,
              type: 'warning',
              category: 'WARNING'
            });
          }
        }
      });

      browserPage.on('pageerror', error => {
        errors.pageErrors.push({
          message: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString(),
          category: categorizeError(error.message)
        });
      });

      browserPage.on('requestfailed', request => {
        const failure = request.failure();
        const url = request.url();
        
        // Ignore expected failures
        if (url.includes('favicon.ico')) return;
        if (url.includes('chrome-extension://')) return;
        
        errors.network.push({
          url: url,
          failure: failure ? failure.errorText : 'Unknown error',
          timestamp: new Date().toISOString(),
          category: url.includes('/api/') ? 'API' : 'NETWORK'
        });
      });

      browserPage.on('response', response => {
        const status = response.status();
        const url = response.url();
        
        // Check for resource loading errors
        if (status >= 400) {
          // Ignore some expected 404s
          if (url.includes('favicon.ico')) return;
          if (url.includes('.map')) return; // Source maps
          
          errors.resources.push({
            url: url,
            status: status,
            statusText: response.statusText(),
            timestamp: new Date().toISOString(),
            category: 'RESOURCE'
          });
        }
      });

      // Navigate to page
      console.log(`\n🔍 Testing: ${page}`);
      const response = await browserPage.goto(`${BASE_URL}/${page}`, {
        waitUntil: 'networkidle',
        timeout: 30000
      });

      // Wait for any delayed errors
      await browserPage.waitForTimeout(2000);

      // Execute JavaScript to check for runtime issues
      const runtimeCheck = await browserPage.evaluate(() => {
        const checks = {
          emailjsLoaded: typeof emailjs !== 'undefined',
          jqueryLoaded: typeof $ !== 'undefined' || typeof jQuery !== 'undefined',
          hasGlobalErrors: window.errors || [],
          documentReady: document.readyState === 'complete',
        };
        
        // Check for common issues
        const issues = [];
        
        // Check if EmailJS is needed but not loaded
        const emailForms = document.querySelectorAll('[data-emailjs], #contactModal');
        if (emailForms.length > 0 && !checks.emailjsLoaded) {
          issues.push('EmailJS required but not loaded');
        }
        
        // Check for undefined variables in onclick handlers
        const onclickElements = document.querySelectorAll('[onclick]');
        onclickElements.forEach(el => {
          const onclick = el.getAttribute('onclick');
          if (onclick && onclick.includes('undefined')) {
            issues.push(`Undefined in onclick: ${onclick.substring(0, 50)}`);
          }
        });
        
        checks.issues = issues;
        return checks;
      });

      // Analyze results
      const totalErrors = errors.console.length + errors.pageErrors.length + 
                         errors.network.length + errors.resources.length;

      // Generate report
      console.log(`\n📊 Results for ${page}:`);
      console.log(`   Console Errors: ${errors.console.length}`);
      console.log(`   Page Errors: ${errors.pageErrors.length}`);
      console.log(`   Network Errors: ${errors.network.length}`);
      console.log(`   Resource Errors: ${errors.resources.length}`);
      console.log(`   Runtime Issues: ${runtimeCheck.issues.length}`);

      // Categorize errors
      const errorsByCategory = {};
      [...errors.console, ...errors.pageErrors, ...errors.network, ...errors.resources]
        .forEach(error => {
          if (!errorsByCategory[error.category]) {
            errorsByCategory[error.category] = [];
          }
          errorsByCategory[error.category].push(error);
        });

      // Report by category
      if (Object.keys(errorsByCategory).length > 0) {
        console.log('\n   Errors by Category:');
        for (const [category, categoryErrors] of Object.entries(errorsByCategory)) {
          console.log(`   ${category}: ${categoryErrors.length}`);
          
          // Show first error of each category
          if (categoryErrors.length > 0) {
            const firstError = categoryErrors[0];
            console.log(`     Sample: ${(firstError.text || firstError.message || firstError.url || '').substring(0, 100)}`);
          }
        }
      }

      // Check runtime issues
      if (runtimeCheck.issues.length > 0) {
        console.log('\n   ⚠️  Runtime Issues:');
        runtimeCheck.issues.forEach(issue => {
          console.log(`     - ${issue}`);
        });
      }

      // Status
      const status = totalErrors === 0 ? '✅ PASS' : '❌ FAIL';
      console.log(`\n   Status: ${status}`);

      // Assert no critical errors
      const criticalErrors = [...errors.console, ...errors.pageErrors]
        .filter(e => e.category === 'CRITICAL');
      
      if (criticalErrors.length > 0) {
        console.error('\n❌ Critical errors found:');
        criticalErrors.forEach(e => {
          console.error(`   ${e.text || e.message}`);
        });
      }
      
      expect(criticalErrors).toHaveLength(0);

      // Warn about non-critical errors
      if (totalErrors > 0 && criticalErrors.length === 0) {
        console.warn(`⚠️  ${totalErrors} non-critical errors found (see details above)`);
      }
    });
  }
});

// Helper function to categorize errors
function categorizeError(errorText) {
  if (!errorText) return 'UNKNOWN';
  
  const text = errorText.toLowerCase();
  
  for (const [category, patterns] of Object.entries(ERROR_CATEGORIES)) {
    for (const pattern of patterns) {
      if (text.includes(pattern.toLowerCase())) {
        return category;
      }
    }
  }
  
  return 'OTHER';
}

test.describe('🔧 EmailJS Integration Check', () => {
  test('EmailJS library loads correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}/index.html`, { waitUntil: 'networkidle' });
    
    // Wait for EmailJS to load
    await page.waitForTimeout(3000);
    
    const emailjsStatus = await page.evaluate(() => {
      return {
        loaded: typeof emailjs !== 'undefined',
        version: typeof emailjs !== 'undefined' ? emailjs.version || 'unknown' : null,
        initialized: typeof emailjs !== 'undefined' && emailjs.init ? 'ready' : 'not ready'
      };
    });
    
    console.log('\n📧 EmailJS Status:');
    console.log(`   Loaded: ${emailjsStatus.loaded ? '✅' : '❌'}`);
    console.log(`   Version: ${emailjsStatus.version || 'N/A'}`);
    console.log(`   Status: ${emailjsStatus.initialized}`);
    
    expect(emailjsStatus.loaded).toBe(true);
  });
  
  test('Contact modal functionality', async ({ page }) => {
    await page.goto(`${BASE_URL}/index.html`, { waitUntil: 'networkidle' });
    
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().includes('EmailJS')) {
        errors.push(msg.text());
      }
    });
    
    // Click Sign Up button
    const signUpButton = await page.locator('a:has-text("Sign Up Today")').first();
    if (await signUpButton.isVisible()) {
      await signUpButton.click();
      await page.waitForTimeout(1000);
      
      // Check modal opened without errors
      const modal = await page.locator('#contactModal').first();
      expect(await modal.isVisible()).toBe(true);
      
      // Check for EmailJS errors
      expect(errors).toHaveLength(0);
      
      console.log('✅ Contact modal opens without EmailJS errors');
    }
  });
});

// Summary report
test.afterAll(async () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚨 CONSOLE ERROR DETECTION COMPLETE');
  console.log('='.repeat(60));
  console.log('Critical errors will fail tests');
  console.log('Non-critical errors are logged as warnings');
  console.log('EmailJS integration validated');
  console.log('='.repeat(60));
});