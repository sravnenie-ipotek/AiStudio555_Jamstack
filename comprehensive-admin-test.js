const { chromium } = require('playwright');

async function testAdminPanel() {
  console.log('🔵 QA TESTER - COMPREHENSIVE ADMIN PANEL TEST');
  console.log('='.repeat(50));
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Track all console errors
  const consoleErrors = [];
  const jsErrors = [];
  
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  page.on('pageerror', (error) => {
    jsErrors.push(error.message);
  });

  try {
    console.log('1. 🌐 Page Load Test');
    console.log('-'.repeat(30));
    
    await page.goto('http://localhost:3005/admin-newdesign.html', { 
      waitUntil: 'networkidle',
      timeout: 10000 
    });
    
    const title = await page.title();
    console.log(`✅ Page loaded successfully: "${title}"`);
    
    // Wait for JavaScript to fully load
    await page.waitForTimeout(2000);
    
    console.log('\n2. 🐞 Console Errors Check');
    console.log('-'.repeat(30));
    
    if (consoleErrors.length === 0) {
      console.log('✅ NO console errors detected');
    } else {
      console.log(`❌ Found ${consoleErrors.length} console errors:`);
      consoleErrors.forEach((error, i) => {
        console.log(`   ${i + 1}. ${error}`);
      });
    }
    
    if (jsErrors.length === 0) {
      console.log('✅ NO JavaScript errors detected');
    } else {
      console.log(`❌ Found ${jsErrors.length} JavaScript errors:`);
      jsErrors.forEach((error, i) => {
        console.log(`   ${i + 1}. ${error}`);
      });
    }

    console.log('\n3. 🔒 SecurityUtils Test');
    console.log('-'.repeat(30));
    
    const securityUtilsLoaded = await page.evaluate(() => {
      return typeof window.SecurityUtils !== 'undefined';
    });
    
    if (securityUtilsLoaded) {
      console.log('✅ SecurityUtils is loaded and available');
      
      const securityUtilsFunctions = await page.evaluate(() => {
        return {
          hasSafeSetHTML: typeof SecurityUtils.safeSetHTML === 'function',
          hasSanitizeHTML: typeof SecurityUtils.sanitizeHTML === 'function',
          hasSafeEval: typeof SecurityUtils.safeEval === 'function'
        };
      });
      
      if (securityUtilsFunctions.hasSafeSetHTML) {
        console.log('✅ SecurityUtils.safeSetHTML function available');
      } else {
        console.log('❌ SecurityUtils.safeSetHTML function missing');
      }
      
      if (securityUtilsFunctions.hasSanitizeHTML) {
        console.log('✅ SecurityUtils.sanitizeHTML function available');
      } else {
        console.log('❌ SecurityUtils.sanitizeHTML function missing');
      }
      
    } else {
      console.log('❌ SecurityUtils is NOT loaded');
    }

    console.log('\n4. 🧼 DOMPurify Test');
    console.log('-'.repeat(30));
    
    const domPurifyLoaded = await page.evaluate(() => {
      return typeof window.DOMPurify !== 'undefined';
    });
    
    if (domPurifyLoaded) {
      console.log('✅ DOMPurify is loaded and available');
    } else {
      console.log('❌ DOMPurify is NOT loaded');
    }

    console.log('\n5. 🎯 Modal Testing');
    console.log('-'.repeat(30));
    
    // Check if "Add New Course" button exists
    const addCourseButton = await page.$('button:has-text("Add New Course"), .add-course-btn, [onclick*="course"], button[data-action="add-course"]');
    
    if (addCourseButton) {
      console.log('✅ "Add New Course" button found');
      
      // Try to click the button
      try {
        await addCourseButton.click();
        await page.waitForTimeout(1000);
        
        // Check if modal appeared
        const modal = await page.$('.modal, [role="dialog"], .popup, .overlay');
        if (modal) {
          console.log('✅ Modal opened successfully after button click');
        } else {
          console.log('⚠️  Button clicked but no modal detected (may be using different selector)');
        }
      } catch (error) {
        console.log(`⚠️  Button click failed: ${error.message}`);
      }
    } else {
      console.log('⚠️  "Add New Course" button not found (may use different text/selector)');
    }

    console.log('\n6. 📝 Form Elements Test');
    console.log('-'.repeat(30));
    
    const formElements = await page.evaluate(() => {
      const inputs = document.querySelectorAll('input').length;
      const textareas = document.querySelectorAll('textarea').length;
      const selects = document.querySelectorAll('select').length;
      const buttons = document.querySelectorAll('button').length;
      
      return { inputs, textareas, selects, buttons };
    });
    
    console.log(`✅ Found ${formElements.inputs} input fields`);
    console.log(`✅ Found ${formElements.textareas} textarea fields`);
    console.log(`✅ Found ${formElements.selects} select dropdowns`);
    console.log(`✅ Found ${formElements.buttons} buttons`);

    console.log('\n7. 🔗 API Connectivity Test');
    console.log('-'.repeat(30));
    
    // Test if admin panel can reach the API
    const apiTest = await page.evaluate(async () => {
      try {
        const response = await fetch('http://localhost:3000/api/courses');
        return {
          success: response.ok,
          status: response.status,
          error: null
        };
      } catch (error) {
        return {
          success: false,
          status: null,
          error: error.message
        };
      }
    });
    
    if (apiTest.success) {
      console.log(`✅ API connectivity successful (Status: ${apiTest.status})`);
    } else {
      console.log(`❌ API connectivity failed: ${apiTest.error || 'Unknown error'}`);
    }

    console.log('\n8. 🛡️ XSS Protection Test');
    console.log('-'.repeat(30));
    
    const xssTest = await page.evaluate(() => {
      if (typeof SecurityUtils !== 'undefined' && typeof SecurityUtils.safeSetHTML === 'function') {
        // Test if SecurityUtils properly sanitizes malicious content
        const testElement = document.createElement('div');
        const maliciousContent = '<script>alert("XSS")</script><p>Safe content</p>';
        
        try {
          SecurityUtils.safeSetHTML(testElement, maliciousContent);
          const result = testElement.innerHTML;
          const hasScript = result.includes('<script>');
          const hasSafeContent = result.includes('Safe content');
          
          return {
            tested: true,
            blocked_script: !hasScript,
            preserved_safe: hasSafeContent,
            result: result
          };
        } catch (error) {
          return {
            tested: false,
            error: error.message
          };
        }
      } else {
        return {
          tested: false,
          error: 'SecurityUtils not available'
        };
      }
    });
    
    if (xssTest.tested) {
      if (xssTest.blocked_script) {
        console.log('✅ XSS Protection: Malicious scripts blocked');
      } else {
        console.log('❌ XSS Protection: Malicious scripts NOT blocked');
      }
      
      if (xssTest.preserved_safe) {
        console.log('✅ XSS Protection: Safe content preserved');
      } else {
        console.log('❌ XSS Protection: Safe content damaged');
      }
    } else {
      console.log(`❌ XSS Protection test failed: ${xssTest.error}`);
    }

    console.log('\n9. 📊 Overall Assessment');
    console.log('-'.repeat(30));
    
    let score = 0;
    let totalTests = 8;
    
    // Page loads without critical errors
    if (consoleErrors.length === 0 && jsErrors.length === 0) score += 20;
    else if (consoleErrors.length < 3) score += 10;
    
    // SecurityUtils loaded
    if (securityUtilsLoaded) score += 15;
    
    // DOMPurify loaded
    if (domPurifyLoaded) score += 10;
    
    // Form elements present
    if (formElements.inputs > 0 && formElements.buttons > 0) score += 15;
    
    // API connectivity
    if (apiTest.success) score += 15;
    
    // XSS protection working
    if (xssTest.tested && xssTest.blocked_script) score += 15;
    
    // Basic functionality (buttons exist)
    if (addCourseButton) score += 10;
    
    console.log(`📊 ADMIN PANEL FUNCTIONALITY SCORE: ${score}%`);
    
    if (score >= 90) {
      console.log('🎉 EXCELLENT - Admin panel is fully functional');
    } else if (score >= 75) {
      console.log('✅ GOOD - Admin panel is mostly functional with minor issues');
    } else if (score >= 50) {
      console.log('⚠️  FAIR - Admin panel has significant issues but is usable');
    } else {
      console.log('❌ POOR - Admin panel has critical issues');
    }

    console.log('\n10. 🔍 Specific Syntax Error Check');
    console.log('-'.repeat(30));
    
    const syntaxErrorCheck = consoleErrors.find(error => 
      error.includes('missing ) after argument list') || 
      error.includes('Unexpected token') ||
      error.includes('SyntaxError')
    );
    
    if (!syntaxErrorCheck) {
      console.log('✅ NO "missing ) after argument list" errors detected');
      console.log('✅ NO syntax errors detected');
    } else {
      console.log(`❌ Syntax error found: ${syntaxErrorCheck}`);
    }

  } catch (error) {
    console.log(`❌ Test failed with error: ${error.message}`);
  } finally {
    await browser.close();
  }
}

testAdminPanel().catch(console.error);
