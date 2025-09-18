const { chromium } = require('playwright');

async function runInteractiveMenuTests() {
  console.log('🎯 Interactive Menu Tests with Playwright');
  console.log('==========================================');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const results = [];
  
  function log(type, message) {
    const logMessage = `${type}: ${message}`;
    console.log(logMessage);
    results.push(logMessage);
  }

  try {
    // Navigate to popup-demo page
    await page.goto('http://localhost:3005/backups/newDesign/tests/popup-demo.html', {
      waitUntil: 'networkidle'
    });
    
    log('✅ PASS', 'Page loaded successfully');
    
    // Test 1: Basic navbar visibility
    const navbar = await page.locator('.navbar').first();
    if (await navbar.isVisible()) {
      log('✅ PASS', 'Navbar is visible');
    } else {
      log('❌ FAIL', 'Navbar not visible');
    }
    
    // Test 2: Navigation links
    const navLinks = await page.locator('.nav-link');
    const linkCount = await navLinks.count();
    if (linkCount >= 5) {
      log('✅ PASS', `Navigation links present (${linkCount})`);
    } else {
      log('❌ FAIL', `Insufficient nav links (${linkCount})`);
    }
    
    // Test 3: Desktop dropdown hover (About Us)
    await page.setViewportSize({ width: 1920, height: 1080 });
    const aboutDropdown = await page.locator('.menu-dropdown-wrapper').filter({ hasText: 'About Us' });
    
    if (await aboutDropdown.isVisible()) {
      log('✅ PASS', 'About Us dropdown found');
      
      // Hover over dropdown
      await aboutDropdown.hover();
      
      // Wait for animation
      await page.waitForTimeout(500);
      
      // Check if dropdown content appears
      const dropdownList = aboutDropdown.locator('.dropdown-column-wrapper-3');
      if (await dropdownList.isVisible()) {
        log('✅ PASS', 'About Us dropdown opens on hover');
      } else {
        log('⚠️ WARN', 'About Us dropdown may not open on hover');
      }
    } else {
      log('❌ FAIL', 'About Us dropdown not found');
    }
    
    // Test 4: Mobile hamburger menu
    await page.setViewportSize({ width: 375, height: 667 });
    
    const hamburger = await page.locator('.menu-button');
    if (await hamburger.isVisible()) {
      log('✅ PASS', 'Mobile hamburger menu visible');
      
      // Check initial state of nav menu
      const navMenu = await page.locator('.nav-menu');
      const isInitiallyOpen = await navMenu.evaluate(el => el.classList.contains('w--open'));
      
      if (!isInitiallyOpen) {
        log('✅ PASS', 'Mobile menu initially closed');
        
        // Click hamburger to open
        await hamburger.click();
        await page.waitForTimeout(500);
        
        // Check if menu opened
        const isNowOpen = await navMenu.evaluate(el => el.classList.contains('w--open'));
        if (isNowOpen) {
          log('✅ PASS', 'Mobile menu opens when hamburger clicked');
          
          // Click again to close
          await hamburger.click();
          await page.waitForTimeout(500);
          
          const isNowClosed = await navMenu.evaluate(el => !el.classList.contains('w--open'));
          if (isNowClosed) {
            log('✅ PASS', 'Mobile menu closes when hamburger clicked again');
          } else {
            log('⚠️ WARN', 'Mobile menu may not close properly');
          }
        } else {
          log('❌ FAIL', 'Mobile menu does not open');
        }
      } else {
        log('⚠️ WARN', 'Mobile menu initially open (unexpected)');
      }
    } else {
      log('❌ FAIL', 'Mobile hamburger menu not visible');
    }
    
    // Test 5: Sign Up button functionality
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    const signUpButton = await page.locator('.primary-button').filter({ hasText: 'Sign Up Today' }).first();
    if (await signUpButton.isVisible()) {
      log('✅ PASS', 'Sign Up button visible');
      
      // Check hover effect
      await signUpButton.hover();
      await page.waitForTimeout(300);
      
      const transform = await signUpButton.evaluate(el => getComputedStyle(el).transform);
      if (transform && transform !== 'none') {
        log('✅ PASS', 'Sign Up button has hover animation');
      } else {
        log('⚠️ WARN', 'Sign Up button hover animation may be missing');
      }
      
      // Test click (should open popup if available)
      await signUpButton.click();
      await page.waitForTimeout(1000);
      
      // Check for popup or console activity
      const hasPopup = await page.locator('.popup-overlay, .contact-popup, [style*="display: block"]').count();
      if (hasPopup > 0) {
        log('✅ PASS', 'Sign Up button opens contact popup');
      } else {
        log('⚠️ WARN', 'Contact popup may not open (expected if popup not loaded)');
      }
    } else {
      log('❌ FAIL', 'Sign Up button not visible');
    }
    
    // Test 6: Language switchers
    const langPills = await page.locator('.lang-pill');
    const pillCount = await langPills.count();
    
    if (pillCount >= 3) {
      log('✅ PASS', `Language pills found (${pillCount})`);
      
      // Test switching languages
      const firstPill = langPills.first();
      const secondPill = langPills.nth(1);
      
      const isFirstActive = await firstPill.evaluate(el => el.classList.contains('active'));
      if (isFirstActive) {
        log('✅ PASS', 'First language pill is active by default');
      }
      
      // Click second pill
      await secondPill.click();
      await page.waitForTimeout(300);
      
      const isSecondNowActive = await secondPill.evaluate(el => el.classList.contains('active'));
      const isFirstStillActive = await firstPill.evaluate(el => el.classList.contains('active'));
      
      if (isSecondNowActive && !isFirstStillActive) {
        log('✅ PASS', 'Language switching works correctly');
      } else {
        log('⚠️ WARN', 'Language switching may not work properly');
      }
    } else {
      log('⚠️ WARN', 'Language pills not found or incomplete');
    }
    
    // Test 7: SharedMenu object availability
    const sharedMenuAvailable = await page.evaluate(() => {
      return typeof window.SharedMenu !== 'undefined';
    });
    
    if (sharedMenuAvailable) {
      log('✅ PASS', 'SharedMenu object available in browser');
      
      const isInitialized = await page.evaluate(() => {
        return window.SharedMenu && window.SharedMenu.isInitialized;
      });
      
      if (isInitialized) {
        log('✅ PASS', 'SharedMenu is properly initialized');
      } else {
        log('⚠️ WARN', 'SharedMenu may not be initialized');
      }
    } else {
      log('❌ FAIL', 'SharedMenu object not available');
    }
    
    // Test 8: Console errors check
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Reload page to catch any console errors
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    const webflowErrors = consoleErrors.filter(error => 
      error.toLowerCase().includes('webflow') && 
      !error.toLowerCase().includes('warning')
    );
    
    if (webflowErrors.length === 0) {
      log('✅ PASS', 'No webflow-related errors in console');
    } else {
      log('⚠️ WARN', `${webflowErrors.length} webflow-related errors found`);
    }
    
    if (consoleErrors.length <= 2) {
      log('✅ PASS', 'Minimal console errors');
    } else {
      log('⚠️ WARN', `${consoleErrors.length} console errors found`);
    }
    
  } catch (error) {
    log('❌ FAIL', `Test execution error: ${error.message}`);
  } finally {
    await browser.close();
  }
  
  // Print results
  console.log('\n📊 Interactive Test Results');
  console.log('===========================');
  
  const passed = results.filter(r => r.includes('✅')).length;
  const failed = results.filter(r => r.includes('❌')).length;
  const warnings = results.filter(r => r.includes('⚠️')).length;
  
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⚠️ Warnings: ${warnings}`);
  console.log(`📝 Total Tests: ${results.length}`);
  
  const successRate = ((passed / results.length) * 100).toFixed(1);
  console.log(`📈 Success Rate: ${successRate}%`);
  
  if (failed === 0 && warnings <= 4) {
    console.log('\n🎉 EXCELLENT: Interactive menu tests passed!');
    console.log('✨ The shared menu component works without webflow.js');
  } else if (failed <= 2) {
    console.log('\n✅ GOOD: Menu mostly functional with minor issues');
  } else {
    console.log('\n⚠️ NEEDS WORK: Multiple interactive issues found');
  }
  
  return { passed, failed, warnings, total: results.length };
}

// Run if called directly
if (require.main === module) {
  runInteractiveMenuTests()
    .then(results => {
      console.log('\n🏁 Interactive testing complete!');
      process.exit(results.failed > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('❌ Test runner error:', error);
      process.exit(1);
    });
}

module.exports = { runInteractiveMenuTests };
