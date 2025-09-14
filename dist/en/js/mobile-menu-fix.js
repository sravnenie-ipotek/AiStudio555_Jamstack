/**
 * Mobile Menu Fix - Ensures proper mobile menu behavior
 * Fixes: Menu closed by default, Sign up button availability, Hamburger visibility
 */

(function() {
  'use strict';

  // Wait for DOM to be ready
  function domReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  domReady(function() {
    // CRITICAL: Ensure mobile menu is closed on page load
    function ensureMenuClosed() {
      // Remove any open menu classes on load
      document.documentElement.classList.remove('w--nav-menu-open');
      document.body.classList.remove('w--nav-menu-open');
      
      // Find all nav overlays and ensure they're hidden
      const overlays = document.querySelectorAll('.w-nav-overlay');
      overlays.forEach(overlay => {
        overlay.style.display = 'none';
        overlay.style.visibility = 'hidden';
        overlay.style.opacity = '0';
        overlay.classList.remove('w--nav-menu-open');
      });
      
      // Find all mobile menus and ensure they're hidden
      const menus = document.querySelectorAll('.w-nav-menu');
      menus.forEach(menu => {
        menu.style.display = 'none';
        menu.classList.remove('w--nav-menu-open');
      });
      
      // Reset Webflow nav state
      const navs = document.querySelectorAll('.w-nav');
      navs.forEach(nav => {
        nav.classList.remove('w--nav-menu-open');
        if (nav.dataset.navMenuOpen) {
          delete nav.dataset.navMenuOpen;
        }
      });
    }

    // Ensure sign up buttons remain clickable
    function protectButtons() {
      const buttons = document.querySelectorAll(
        '.primary-button, .navbar-button-wrapper button, ' +
        '[href*="contact"], [href*="#contact"], .button, .btn, ' +
        '.primary-button-wrapper, .sign-up-button'
      );
      
      buttons.forEach(button => {
        // Ensure button is always clickable
        button.style.pointerEvents = 'auto';
        button.style.position = 'relative';
        button.style.zIndex = '1000';
        button.style.visibility = 'visible';
        button.style.opacity = '1';
        
        // Remove any blocking overlays
        button.addEventListener('mousedown', function(e) {
          e.stopPropagation();
        }, true);
        
        button.addEventListener('touchstart', function(e) {
          e.stopPropagation();
        }, true);
        
        // Ensure click events work
        button.addEventListener('click', function(e) {
          // Allow the click to proceed
          e.stopPropagation();
        }, true);
      });
    }

    // Ensure hamburger menu button is visible and functional
    function fixHamburgerButton() {
      const hamburgers = document.querySelectorAll(
        '.w-nav-button, .nav-menu-button-wrapper, .menu-button'
      );
      
      hamburgers.forEach(hamburger => {
        // Make hamburger visible
        hamburger.style.display = 'block';
        hamburger.style.visibility = 'visible';
        hamburger.style.opacity = '1';
        hamburger.style.position = 'relative';
        hamburger.style.zIndex = '9999';
        hamburger.style.pointerEvents = 'auto';
        hamburger.style.cursor = 'pointer';
        
        // Ensure minimum touch target size
        hamburger.style.minWidth = '44px';
        hamburger.style.minHeight = '44px';
        
        // Add click handler if needed
        if (!hamburger.hasAttribute('data-mobile-fix-applied')) {
          hamburger.setAttribute('data-mobile-fix-applied', 'true');
          
          hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const nav = hamburger.closest('.w-nav');
            const overlay = document.querySelector('.w-nav-overlay');
            const menu = document.querySelector('.w-nav-menu');
            
            if (nav) {
              // Toggle menu state
              const isOpen = nav.classList.contains('w--nav-menu-open');
              
              if (isOpen) {
                // Close menu
                nav.classList.remove('w--nav-menu-open');
                document.documentElement.classList.remove('w--nav-menu-open');
                document.body.classList.remove('w--nav-menu-open');
                
                if (overlay) {
                  overlay.style.display = 'none';
                  overlay.style.visibility = 'hidden';
                  overlay.style.opacity = '0';
                }
                
                if (menu) {
                  menu.style.display = 'none';
                }
              } else {
                // Open menu
                nav.classList.add('w--nav-menu-open');
                document.documentElement.classList.add('w--nav-menu-open');
                document.body.classList.add('w--nav-menu-open');
                
                if (overlay) {
                  overlay.style.display = 'block';
                  overlay.style.visibility = 'visible';
                  overlay.style.opacity = '1';
                }
                
                if (menu) {
                  menu.style.display = 'block';
                }
              }
            }
          });
        }
      });
    }

    // Fix horizontal scrolling
    function fixHorizontalScroll() {
      // Set viewport meta tag if not present
      let viewport = document.querySelector('meta[name="viewport"]');
      if (!viewport) {
        viewport = document.createElement('meta');
        viewport.name = 'viewport';
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';
        document.head.appendChild(viewport);
      }
      
      // Prevent horizontal scroll
      document.body.style.overflowX = 'hidden';
      document.documentElement.style.overflowX = 'hidden';
      
      // Fix wide elements
      const allElements = document.querySelectorAll('*');
      const viewportWidth = window.innerWidth;
      
      allElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.width > viewportWidth || rect.right > viewportWidth) {
          el.style.maxWidth = '100vw';
          el.style.overflowX = 'hidden';
        }
      });
    }

    // Apply all fixes
    function applyMobileFixes() {
      ensureMenuClosed();
      protectButtons();
      fixHamburgerButton();
      fixHorizontalScroll();
    }

    // Apply fixes immediately
    applyMobileFixes();

    // Reapply fixes after a short delay to catch any dynamic content
    setTimeout(applyMobileFixes, 100);
    setTimeout(applyMobileFixes, 500);
    setTimeout(applyMobileFixes, 1000);
    setTimeout(applyMobileFixes, 2000);

    // Monitor for dynamic content changes
    if (window.MutationObserver) {
      let debounceTimer;
      const observer = new MutationObserver(function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(function() {
          protectButtons();
          fixHamburgerButton();
        }, 100);
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style']
      });
    }

    // Reapply fixes on window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(applyMobileFixes, 250);
    });

    // Ensure menu is closed when navigating
    window.addEventListener('pageshow', ensureMenuClosed);
    window.addEventListener('load', ensureMenuClosed);
    
    // Handle back/forward navigation
    window.addEventListener('popstate', ensureMenuClosed);
  });
})();