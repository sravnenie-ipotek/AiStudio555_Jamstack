/**
 * PRODUCTION NAVIGATION FIX
 * 
 * This script fixes navigation issues on the production site:
 * 1. Removes unwanted "Pages" menu item
 * 2. Fixes JavaScript null reference errors
 * 3. Ensures Career Services dropdown works correctly
 * 
 * Add this to career-orientation.html on production site
 */

(function() {
  'use strict';
  
  console.log('🔧 Production Navigation Fix Loading...');
  
  // Fix 1: Remove "Pages" menu item if it exists
  function removeUnwantedMenuItems() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', removeUnwantedMenuItems);
      return;
    }
    
    console.log('🔍 Checking for unwanted menu items...');
    
    // Find all nav links
    const navMenu = document.querySelector('.nav-menu, .w-nav-menu');
    if (!navMenu) {
      console.warn('⚠️ Navigation menu not found');
      return;
    }
    
    // Look for "Pages" menu item and remove it
    const navLinks = navMenu.querySelectorAll('.nav-link, .w-nav-link');
    navLinks.forEach(link => {
      const text = link.textContent.trim();
      if (text === 'Pages' || text === 'Blog') {
        console.log(`✂️ Removing unwanted menu item: ${text}`);
        
        // Check if it's a dropdown
        const dropdownWrapper = link.closest('.menu-dropdown-wrapper, .w-dropdown');
        if (dropdownWrapper) {
          dropdownWrapper.remove();
        } else {
          link.remove();
        }
      }
    });
    
    // Also check for dropdown toggles with "Pages" text
    const dropdownToggles = navMenu.querySelectorAll('.dropdown-toggle-text-block');
    dropdownToggles.forEach(toggle => {
      const text = toggle.textContent.trim();
      if (text === 'Pages' || text === 'Blog') {
        console.log(`✂️ Removing unwanted dropdown: ${text}`);
        const wrapper = toggle.closest('.menu-dropdown-wrapper, .w-dropdown');
        if (wrapper) {
          wrapper.remove();
        }
      }
    });
    
    console.log('✅ Navigation cleanup complete');
  }
  
  // Fix 2: Prevent null reference errors
  function preventNullErrors() {
    // Override problematic methods that might cause null errors
    const originalQuerySelector = document.querySelector.bind(document);
    const originalGetElementById = document.getElementById.bind(document);
    
    // Safe wrapper for querySelector
    document.querySelector = function(selector) {
      try {
        return originalQuerySelector(selector);
      } catch (e) {
        console.warn('Selector error caught:', selector, e);
        return null;
      }
    };
    
    // Safe wrapper for getElementById
    document.getElementById = function(id) {
      try {
        return originalGetElementById(id);
      } catch (e) {
        console.warn('GetElementById error caught:', id, e);
        return null;
      }
    };
    
    // Patch childElementCount access
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) { // Element node
              try {
                // Ensure childElementCount is accessible
                if (node.childElementCount === undefined) {
                  Object.defineProperty(node, 'childElementCount', {
                    get: function() {
                      return this.children ? this.children.length : 0;
                    }
                  });
                }
              } catch (e) {
                // Silently handle errors
              }
            }
          });
        }
      });
    });
    
    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    console.log('✅ Null error prevention initialized');
  }
  
  // Fix 3: Ensure Career Services dropdown works correctly
  function fixCareerServicesDropdown() {
    const dropdown = document.querySelector('.menu-dropdown-wrapper .dropdown-toggle-text-block');
    
    if (dropdown && dropdown.textContent.trim() === 'Career Services') {
      const wrapper = dropdown.closest('.menu-dropdown-wrapper');
      
      if (wrapper) {
        // Ensure proper structure
        const dropdownList = wrapper.querySelector('.dropdown-list, .w-dropdown-list');
        
        if (!dropdownList) {
          console.log('⚠️ Dropdown list missing, creating...');
          
          const newList = document.createElement('nav');
          newList.className = 'dropdown-list w-dropdown-list';
          newList.innerHTML = `
            <a href="/career-orientation.html" class="dropdown-menu-text-link-block w-inline-block">
              <div>Career Orientation</div>
            </a>
            <a href="/career-center.html" class="dropdown-menu-text-link-block w-inline-block">
              <div>Career Center</div>
            </a>
          `;
          wrapper.appendChild(newList);
        }
        
        // Ensure hover functionality
        wrapper.addEventListener('mouseenter', function() {
          const list = this.querySelector('.dropdown-list, .w-dropdown-list');
          if (list) {
            list.style.display = 'block';
            list.style.visibility = 'visible';
            list.style.opacity = '1';
          }
        });
        
        wrapper.addEventListener('mouseleave', function() {
          const list = this.querySelector('.dropdown-list, .w-dropdown-list');
          if (list) {
            setTimeout(() => {
              list.style.display = 'none';
              list.style.visibility = 'hidden';
              list.style.opacity = '0';
            }, 100);
          }
        });
        
        console.log('✅ Career Services dropdown fixed');
      }
    }
  }
  
  // Fix 4: Ensure correct navigation order
  function ensureNavigationOrder() {
    const navMenu = document.querySelector('.nav-menu, .w-nav-menu');
    if (!navMenu) return;
    
    // Expected order: Home, Courses, Teachers, Career Services, Pricing
    const expectedOrder = ['Home', 'Courses', 'Teachers', 'Career Services', 'Pricing'];
    
    // Get current items
    const currentItems = [];
    navMenu.childNodes.forEach(node => {
      if (node.nodeType === 1) { // Element node
        const text = node.textContent.trim().split('\n')[0].trim();
        if (text && !text.includes('Sign Up')) {
          currentItems.push({
            element: node,
            text: text
          });
        }
      }
    });
    
    // Check if order is correct
    let needsReorder = false;
    currentItems.forEach((item, index) => {
      if (!expectedOrder.includes(item.text) && item.text !== 'Pages' && item.text !== 'Blog') {
        // This is an expected item, check its position
        const expectedIndex = expectedOrder.indexOf(item.text);
        if (expectedIndex !== -1 && expectedIndex !== index) {
          needsReorder = true;
        }
      }
    });
    
    if (needsReorder) {
      console.log('🔄 Reordering navigation items...');
      
      // Create a document fragment to rebuild menu
      const fragment = document.createDocumentFragment();
      
      // Add items in correct order
      expectedOrder.forEach(expectedText => {
        const item = currentItems.find(i => i.text === expectedText);
        if (item) {
          fragment.appendChild(item.element);
        }
      });
      
      // Add any remaining items (like Sign Up button)
      currentItems.forEach(item => {
        if (!expectedOrder.includes(item.text) && item.text.includes('Sign Up')) {
          fragment.appendChild(item.element);
        }
      });
      
      // Clear menu and add reordered items
      while (navMenu.firstChild) {
        navMenu.removeChild(navMenu.firstChild);
      }
      navMenu.appendChild(fragment);
      
      console.log('✅ Navigation reordered correctly');
    }
  }
  
  // Initialize all fixes
  function initializeFixes() {
    console.log('🚀 Initializing production navigation fixes...');
    
    try {
      // Apply fixes in sequence
      preventNullErrors();        // First prevent errors
      removeUnwantedMenuItems();  // Then clean navigation
      fixCareerServicesDropdown(); // Fix dropdown
      ensureNavigationOrder();     // Ensure correct order
      
      console.log('✅ All production fixes applied successfully!');
      
    } catch (error) {
      console.error('❌ Error applying fixes:', error);
    }
  }
  
  // Run fixes when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFixes);
  } else {
    // DOM is already ready
    initializeFixes();
  }
  
  // Also run after a delay to catch any dynamic content
  setTimeout(initializeFixes, 1000);
  setTimeout(initializeFixes, 3000);
  
  // Monitor for dynamic changes
  const menuObserver = new MutationObserver((mutations) => {
    let hasNavChanges = false;
    
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        const target = mutation.target;
        if (target.classList && (target.classList.contains('nav-menu') || 
            target.classList.contains('w-nav-menu'))) {
          hasNavChanges = true;
        }
      }
    });
    
    if (hasNavChanges) {
      console.log('📝 Navigation changed, reapplying fixes...');
      removeUnwantedMenuItems();
      ensureNavigationOrder();
    }
  });
  
  // Start monitoring navigation changes
  const navMenu = document.querySelector('.nav-menu, .w-nav-menu');
  if (navMenu) {
    menuObserver.observe(navMenu, {
      childList: true,
      subtree: true
    });
  }
  
})();

console.log('💉 Production Navigation Fix Script Loaded - Ready to inject into production site');