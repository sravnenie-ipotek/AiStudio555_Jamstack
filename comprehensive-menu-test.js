/**
 * Comprehensive Menu QA Test Runner
 */

function runMenuTests() {
  console.log('🎯 Comprehensive Menu QA Tests');
  console.log('===============================');
  
  const results = { passed: 0, failed: 0, warnings: 0 };

  function logResult(type, message) {
    console.log(`${type}: ${message}`);
    if (type === 'PASS') results.passed++;
    else if (type === 'FAIL') results.failed++;
    else if (type === 'WARN') results.warnings++;
  }

  // Test 1: Basic Structure
  console.log('\n1️⃣ Basic Menu Structure');
  try {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      logResult('PASS', 'Navbar found');
      const navLinks = document.querySelectorAll('.nav-link');
      if (navLinks.length >= 5) {
        logResult('PASS', `Navigation links found (${navLinks.length})`);
      } else {
        logResult('WARN', `Only ${navLinks.length} navigation links found`);
      }
    } else {
      logResult('FAIL', 'Navbar not found');
    }
  } catch (e) {
    logResult('FAIL', 'Structure test error: ' + e.message);
  }

  // Test 2: Dropdowns
  console.log('\n2️⃣ Dropdown Functionality');
  try {
    const dropdowns = document.querySelectorAll('.menu-dropdown-wrapper');
    if (dropdowns.length >= 2) {
      logResult('PASS', `Dropdown menus found (${dropdowns.length})`);
    } else {
      logResult('FAIL', 'Insufficient dropdown menus');
    }
  } catch (e) {
    logResult('FAIL', 'Dropdown test error: ' + e.message);
  }

  // Test 3: Mobile Menu
  console.log('\n3️⃣ Mobile Responsiveness');
  try {
    const hamburger = document.querySelector('.menu-button');
    const hamburgerLines = document.querySelectorAll('.hamburger-line');
    if (hamburger && hamburgerLines.length === 3) {
      logResult('PASS', 'Mobile hamburger menu configured');
    } else {
      logResult('FAIL', 'Mobile menu not properly configured');
    }
  } catch (e) {
    logResult('FAIL', 'Mobile test error: ' + e.message);
  }

  // Test 4: SharedMenu Object
  console.log('\n4️⃣ Webflow Independence');
  try {
    if (window.SharedMenu) {
      logResult('PASS', 'SharedMenu object available');
      if (window.SharedMenu.isInitialized) {
        logResult('PASS', 'SharedMenu initialized');
      } else {
        logResult('WARN', 'SharedMenu not initialized');
      }
    } else {
      logResult('FAIL', 'SharedMenu object missing');
    }
  } catch (e) {
    logResult('FAIL', 'Independence test error: ' + e.message);
  }

  // Test 5: Sign Up Buttons
  console.log('\n5️⃣ Sign Up Integration');
  try {
    const signUpButtons = document.querySelectorAll('.primary-button');
    if (signUpButtons.length > 0) {
      logResult('PASS', `Sign Up buttons found (${signUpButtons.length})`);
      
      let hasPopupHandler = false;
      for (let button of signUpButtons) {
        const onclick = button.getAttribute('onclick');
        if (onclick && onclick.includes('openContactPopup')) {
          hasPopupHandler = true;
          break;
        }
      }
      
      if (hasPopupHandler) {
        logResult('PASS', 'Contact popup integration found');
      } else {
        logResult('WARN', 'No contact popup handlers found');
      }
    } else {
      logResult('FAIL', 'No Sign Up buttons found');
    }
  } catch (e) {
    logResult('FAIL', 'Button test error: ' + e.message);
  }

  // Final Results
  console.log('\n📊 Final Results');
  console.log('================');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`⚠️ Warnings: ${results.warnings}`);
  
  const total = results.passed + results.failed;
  const rate = total > 0 ? (results.passed / total * 100).toFixed(1) : 0;
  console.log(`📈 Success Rate: ${rate}%`);
  
  if (results.failed === 0) {
    console.log('🎉 EXCELLENT: All tests passed!');
  } else if (results.failed <= 2) {
    console.log('✅ GOOD: Minor issues found');
  } else {
    console.log('⚠️ NEEDS WORK: Multiple failures');
  }
  
  return results;
}

// Auto-run
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(runMenuTests, 1000);
    });
  } else {
    setTimeout(runMenuTests, 1000);
  }
  
  window.runMenuTests = runMenuTests;
}
