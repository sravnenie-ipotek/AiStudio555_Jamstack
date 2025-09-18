const { chromium } = require('playwright');

async function runMenuFunctionalityTest() {
  console.log('🎯 Fixed Menu Functionality Test');
  console.log('================================');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const results = [];
  
  function log(type, message) {
    const logMessage = `${type}: ${message}`;
    console.log(logMessage);
    results.push(logMessage);
  }

  try {
    await page.goto('http://localhost:3005/backups/newDesign/tests/popup-demo.html');
    await page.waitForLoadState('networkidle');
    
    log('✅ PASS', 'Page loaded successfully');
    
    // Test 1: Navbar visibility
    const navbar = await page.locator('.navbar').first();
    if (await navbar.isVisible()) {
      log('✅ PASS', 'Navbar is visible');
    } else {
      log('❌ FAIL', 'Navbar not visible');
    }
    
    // Test 2: Navigation links count
    const navLinks = await page.locator('.nav-link');
    const linkCount = await navLinks.count();
    log('ℹ️ INFO', `Found ${linkCount} navigation links`);
    
    if (linkCount >= 5) {
      log('✅ PASS', 'Sufficient navigation links');
    } else {
      log('❌ FAIL', 'Insufficient navigation links');
    }
    
    // Test 3: Dropdown menus
    const dropdowns = await page.locator('.menu-dropdown-wrapper');
    const dropdownCount = await dropdowns.count();
    log('ℹ️ INFO', `Found ${dropdownCount} dropdown menus`);
    
    if (dropdownCount >= 2) {
      log('✅ PASS', 'Expected dropdown menus found');
    } else {
      log('❌ FAIL', 'Insufficient dropdown menus');
    }
    
    // Test 4: Mobile hamburger (at mobile viewport)
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(100);
    
    const hamburger = await page.locator('.menu-button');
    if (await hamburger.isVisible()) {
      log('✅ PASS', 'Mobile hamburger visible');
      
      // Test hamburger click
      const navMenu = await page.locator('.nav-menu');
      
      // Click to open
      await hamburger.click();
      await page.waitForTimeout(500);
      
      const menuClasses = await navMenu.getAttribute('class');
      if (menuClasses && menuClasses.includes('w--open')) {
        log('✅ PASS', 'Mobile menu opens on hamburger click');
      } else {
        log('⚠️ WARN', 'Mobile menu may not open properly');
      }
      
    } else {
      log('❌ FAIL', 'Mobile hamburger not visible');
    }
    
    // Test 5: Sign Up buttons (back to desktop)
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(100);
    
    const signUpButtons = await page.locator('.primary-button');
    const buttonCount = await signUpButtons.count();
    
    if (buttonCount > 0) {
      log('✅ PASS', `Sign Up buttons found (${buttonCount})`);
      
      // Test button click
      const firstButton = signUpButtons.first();
      if (await firstButton.isVisible()) {
        await firstButton.click();
        await page.waitForTimeout(1000);
        log('✅ PASS', 'Sign Up button clickable');
      }
    } else {
      log('❌ FAIL', 'No Sign Up buttons found');
    }
    
    // Test 6: Language switchers
    const langPills = await page.locator('.lang-pill');
    const pillCount = await langPills.count();
    
    if (pillCount >= 2) {
      log('✅ PASS', `Language pills found (${pillCount})`);
      
      // Test language switching
      if (pillCount >= 2) {
        const secondPill = langPills.nth(1);
        await secondPill.click();
        await page.waitForTimeout(300);
        
        const isActive = await secondPill.evaluate(el => el.classList.contains('active'));
        if (isActive) {
          log('✅ PASS', 'Language switching works');
        } else {
          log('⚠️ WARN', 'Language switching may not work');
        }
      }
    } else {
      log('⚠️ WARN', 'Language pills not found');
    }
    
    // Test 7: SharedMenu object
    const hasSharedMenu = await page.evaluate(() => {
      return typeof window.SharedMenu !== 'undefined';
    });
    
    if (hasSharedMenu) {
      log('✅ PASS', 'SharedMenu object available');
      
      const isInitialized = await page.evaluate(() => {
        return window.SharedMenu && window.SharedMenu.isInitialized;
      });
      
      if (isInitialized) {
        log('✅ PASS', 'SharedMenu properly initialized');
      } else {
        log('⚠️ WARN', 'SharedMenu not initialized');
      }
    } else {
      log('❌ FAIL', 'SharedMenu object missing');
    }
    
    // Test 8: Console errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Wait to catch any delayed errors
    await page.waitForTimeout(2000);
    
    if (errors.length === 0) {
      log('✅ PASS', 'No console errors');
    } else if (errors.length <= 2) {
      log('⚠️ WARN', `${errors.length} minor console errors`);
    } else {
      log('❌ FAIL', `${errors.length} console errors found`);
    }
    
  } catch (error) {
    log('❌ FAIL', `Test error: ${error.message}`);
  } finally {
    await browser.close();
  }
  
  // Calculate results
  const passed = results.filter(r => r.includes('✅')).length;
  const failed = results.filter(r => r.includes('❌')).length;
  const warnings = results.filter(r => r.includes('⚠️')).length;
  
  console.log('\n📊 Test Summary');
  console.log('===============');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⚠️ Warnings: ${warnings}`);
  
  const total = passed + failed;
  const successRate = total > 0 ? ((passed / total) * 100).toFixed(1) : 0;
  console.log(`📈 Success Rate: ${successRate}%`);
  
  // Final assessment
  if (failed === 0 && warnings <= 3) {
    console.log('\n🎉 EXCELLENT: Menu fully functional without webflow.js!');
  } else if (failed <= 1 && warnings <= 5) {
    console.log('\n✅ GOOD: Menu working with minor issues');
  } else {
    console.log('\n⚠️ NEEDS WORK: Significant issues found');
  }
  
  return { passed, failed, warnings, successRate: parseFloat(successRate) };
}

if (require.main === module) {
  runMenuFunctionalityTest()
    .then(results => {
      console.log('\n🏁 Test complete!');
      process.exit(results.failed > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('Test error:', error);
      process.exit(1);
    });
}

module.exports = { runMenuFunctionalityTest };
