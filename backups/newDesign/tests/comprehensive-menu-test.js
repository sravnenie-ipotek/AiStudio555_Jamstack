/**
 * Comprehensive Menu QA Test Runner
 * Tests shared menu component functionality
 */

async function runMenuTests() {
  console.log('🎯 Comprehensive Menu QA Tests');
  console.log('===============================');
  
  const results = {
    passed: 0,
    failed: 0,
    warnings: 0,
    details: []
  };

  function log(type, message) {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${type}: ${message}`;
    console.log(logMessage);
    results.details.push(logMessage);
    
    if (type === 'PASS') results.passed++;
    else if (type === 'FAIL') results.failed++;
    else if (type === 'WARN') results.warnings++;
  }

  // Test 1: Basic Menu Structure
  console.log('\n1️⃣ Testing Basic Menu Structure');
  try {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      log('PASS', 'Navbar element found');
      
      const navLinks = document.querySelectorAll('.nav-link');
      log('INFO', `Found ${navLinks.length} navigation links`);
      
      if (navLinks.length >= 5) {
        log('PASS', 'Sufficient navigation links present');
      } else {
        log('WARN', 'Expected at least 5 navigation links');
      }
    } else {
      log('FAIL', 'Navbar element not found');
    }
  } catch (error) {
    log('FAIL', `Basic structure test error: ${error.message}`);
  }

  // Test 2: Dropdown Functionality
  console.log('\n2️⃣ Testing Dropdown Functionality');
  try {
    const dropdowns = document.querySelectorAll('.menu-dropdown-wrapper');
    log('INFO', `Found ${dropdowns.length} dropdown wrappers`);
    
    if (dropdowns.length >= 2) {
      log('PASS', 'Expected dropdown menus found');
      
      // Test About Us dropdown
      const aboutUsDropdown = Array.from(dropdowns).find(d => 
        d.textContent.toLowerCase().includes('about us')
      );
      
      if (aboutUsDropdown) {
        log('PASS', 'About Us dropdown found');
        
        const dropdownList = aboutUsDropdown.querySelector('.dropdown-column-wrapper-3');
        if (dropdownList) {
          log('PASS', 'About Us dropdown content found');
        } else {
          log('FAIL', 'About Us dropdown content missing');
        }
      } else {
        log('WARN', 'About Us dropdown not found');
      }
      
      // Test Pages dropdown
      const pagesDropdown = Array.from(dropdowns).find(d => 
        d.textContent.toLowerCase().includes('pages')
      );
      
      if (pagesDropdown) {
        log('PASS', 'Pages dropdown found');
      } else {
        log('WARN', 'Pages dropdown not found');
      }
      
    } else {
      log('FAIL', 'Insufficient dropdown menus found');
    }
  } catch (error) {
    log('FAIL', `Dropdown test error: ${error.message}`);
  }

  // Test 3: Mobile Responsiveness
  console.log('\n3️⃣ Testing Mobile Responsiveness');
  try {
    const hamburger = document.querySelector('.menu-button');
    if (hamburger) {
      log('PASS', 'Mobile hamburger menu found');
      
      const hamburgerIcon = document.querySelector('.hamburger-icon');
      if (hamburgerIcon) {
        log('PASS', 'Hamburger icon found');
        
        const hamburgerLines = document.querySelectorAll('.hamburger-line');
        if (hamburgerLines.length === 3) {
          log('PASS', 'Correct number of hamburger lines (3)');
        } else {
          log('FAIL', `Expected 3 hamburger lines, found ${hamburgerLines.length}`);
        }
      } else {
        log('FAIL', 'Hamburger icon not found');
      }
    } else {
      log('FAIL', 'Mobile hamburger menu not found');
    }
  } catch (error) {
    log('FAIL', `Mobile responsiveness test error: ${error.message}`);
  }

  // Test 4: Sign Up Buttons
  console.log('\n4️⃣ Testing Sign Up Buttons');
  try {
    const signUpButtons = document.querySelectorAll('.primary-button');
    log('INFO', `Found ${signUpButtons.length} Sign Up buttons`);
    
    if (signUpButtons.length > 0) {
      log('PASS', 'Sign Up buttons found');
      
      let hasClickHandler = false;
      signUpButtons.forEach((button, index) => {
        const onclick = button.getAttribute('onclick');
        if (onclick && onclick.includes('openContactPopup')) {
          hasClickHandler = true;
          log('PASS', `Button ${index + 1} has contact popup handler`);
        }
      });
      
      if (!hasClickHandler) {
        log('WARN', 'No Sign Up buttons have contact popup handlers');
      }
      
      // Test button structure
      const textWrappers = document.querySelectorAll('.primary-button-text-wrap');
      if (textWrappers.length > 0) {
        log('PASS', 'Button text animation structure found');
      } else {
        log('WARN', 'Button text animation structure missing');
      }
      
    } else {
      log('FAIL', 'No Sign Up buttons found');
    }
  } catch (error) {
    log('FAIL', `Sign Up buttons test error: ${error.message}`);
  }

  // Test 5: Language Switchers
  console.log('\n5️⃣ Testing Language Switchers');
  try {
    const langPills = document.querySelectorAll('.lang-pill');
    if (langPills.length >= 3) {
      log('PASS', `Language pills found (${langPills.length})`);
      
      // Check for active state
      const activePill = document.querySelector('.lang-pill.active');
      if (activePill) {
        log('PASS', 'Active language pill found');
      } else {
        log('WARN', 'No active language pill found');
      }
    } else {
      log('WARN', 'Language pills not found or incomplete');
    }
    
    const langDropdown = document.querySelector('.lang-dropdown');
    if (langDropdown) {
      log('PASS', 'Language dropdown found');
    } else {
      log('WARN', 'Language dropdown not found');
    }
    
    // Test language switcher functions
    if (typeof window.setActivePill === 'function') {
      log('PASS', 'setActivePill function available');
    } else {
      log('WARN', 'setActivePill function not found');
    }
    
  } catch (error) {
    log('FAIL', `Language switchers test error: ${error.message}`);
  }

  // Test 6: Webflow Independence
  console.log('\n6️⃣ Testing Webflow Independence');
  try {
    if (window.SharedMenu) {
      log('PASS', 'SharedMenu object found');
      
      if (window.SharedMenu.isInitialized) {
        log('PASS', 'SharedMenu is initialized');
      } else {
        log('WARN', 'SharedMenu not initialized');
      }
      
      // Test SharedMenu methods
      if (typeof window.SharedMenu.getCurrentPage === 'function') {
        const currentPage = window.SharedMenu.getCurrentPage();
        log('PASS', `getCurrentPage method works: ${currentPage}`);
      } else {
        log('FAIL', 'getCurrentPage method not found');
      }
      
    } else {
      log('FAIL', 'SharedMenu object not found - menu may depend on webflow.js');
    }
    
    // Check for custom classes (non-webflow)
    const customClasses = [
      'custom-nav',
      'custom-dropdown',
      'custom-nav-button'
    ];
    
    let customClassesFound = 0;
    customClasses.forEach(className => {
      if (document.querySelector(`.${className}`)) {
        customClassesFound++;
      }
    });
    
    if (customClassesFound >= 2) {
      log('PASS', `Custom classes implemented (${customClassesFound}/${customClasses.length})`);
    } else {
      log('WARN', `Limited custom classes found (${customClassesFound}/${customClasses.length})`);
    }
    
  } catch (error) {
    log('FAIL', `Webflow independence test error: ${error.message}`);
  }

  // Test 7: CSS Animations
  console.log('\n7️⃣ Testing CSS Animations');
  try {
    // Test hamburger animations
    const hamburgerLines = document.querySelectorAll('.hamburger-line');
    let animationConfigs = 0;
    hamburgerLines.forEach(line => {
      const styles = getComputedStyle(line);
      if (styles.transition && styles.transition.includes('transform')) {
        animationConfigs++;
      }
    });
    
    if (animationConfigs === hamburgerLines.length) {
      log('PASS', 'Hamburger animation styles configured');
    } else {
      log('WARN', 'Some hamburger lines missing animation styles');
    }
    
    // Test dropdown animations
    const dropdownLists = document.querySelectorAll('.dropdown-column-wrapper-3');
    let dropdownAnimations = 0;
    dropdownLists.forEach(dropdown => {
      const styles = getComputedStyle(dropdown);
      if (styles.transition) {
        dropdownAnimations++;
      }
    });
    
    if (dropdownAnimations > 0) {
      log('PASS', 'Dropdown animation styles found');
    } else {
      log('WARN', 'Dropdown animation styles not found');
    }
    
  } catch (error) {
    log('FAIL', `CSS animations test error: ${error.message}`);
  }

  // Test 8: Accessibility
  console.log('\n8️⃣ Testing Accessibility');
  try {
    // Check navbar role
    const navbarWithRole = document.querySelector('.navbar[role="banner"]');
    if (navbarWithRole) {
      log('PASS', 'Navbar has banner role');
    } else {
      log('WARN', 'Navbar missing banner role');
    }
    
    // Check navigation role
    const navWithRole = document.querySelector('nav[role="navigation"]');
    if (navWithRole) {
      log('PASS', 'Navigation has proper role');
    } else {
      log('WARN', 'Navigation missing role attribute');
    }
    
    // Check images for alt text
    const images = document.querySelectorAll('img');
    let missingAlt = 0;
    images.forEach(img => {
      if (!img.alt && !img.getAttribute('aria-hidden')) {
        missingAlt++;
      }
    });
    
    if (missingAlt === 0) {
      log('PASS', 'All images have alt text');
    } else {
      log('WARN', `${missingAlt} images missing alt text`);
    }
    
  } catch (error) {
    log('FAIL', `Accessibility test error: ${error.message}`);
  }

  // Print final results
  console.log('\n📊 Final QA Results');
  console.log('===================');
  console.log(`✅ Tests Passed: ${results.passed}`);
  console.log(`❌ Tests Failed: ${results.failed}`);
  console.log(`⚠️ Warnings: ${results.warnings}`);
  
  const totalTests = results.passed + results.failed;
  const successRate = totalTests > 0 ? (results.passed / totalTests * 100).toFixed(1) : 0;
  console.log(`📈 Success Rate: ${successRate}%`);
  
  if (results.failed === 0 && results.warnings <= 2) {
    console.log('🎉 OVERALL: EXCELLENT - Menu component is working correctly!');
  } else if (results.failed <= 2 && results.warnings <= 5) {
    console.log('✅ OVERALL: GOOD - Menu component working with minor issues');
  } else {
    console.log('⚠️ OVERALL: NEEDS ATTENTION - Several issues found');
  }
  
  return results;
}

// Auto-run the tests
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => runMenuTests(), 1000);
    });
  } else {
    setTimeout(() => runMenuTests(), 1000);
  }
  
  // Make function available globally
  window.runMenuTests = runMenuTests;
}
