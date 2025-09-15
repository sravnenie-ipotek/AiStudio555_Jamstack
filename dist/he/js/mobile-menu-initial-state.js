/**
 * Mobile Menu Initial State Fix
 * Ensures mobile menu is closed on page load
 */

(function() {
  'use strict';

  // Function to ensure menu is closed
  function ensureMenuClosed() {
    // Remove any classes that might open the menu
    document.documentElement.classList.remove('w--nav-menu-open');
    document.body.classList.remove('w--nav-menu-open');

    // Find all nav elements and ensure they're closed
    const navElements = document.querySelectorAll('.w-nav');
    navElements.forEach(nav => {
      nav.classList.remove('w--open');
      nav.classList.remove('w--nav-menu-open');
    });

    // Find all nav overlays and hide them
    const overlays = document.querySelectorAll('.w-nav-overlay');
    overlays.forEach(overlay => {
      overlay.style.display = 'none';
      overlay.classList.remove('w--nav-menu-open');
    });

    // Find all nav menus and set their visibility based on screen size
    const menus = document.querySelectorAll('.w-nav-menu');
    menus.forEach(menu => {
      if (window.innerWidth <= 991) {
        // Mobile/tablet - hide menu
        menu.style.display = 'none';
        menu.style.opacity = '0';
        menu.style.visibility = 'hidden';
      } else {
        // Desktop - ensure menu is visible
        menu.style.display = 'flex';
        menu.style.opacity = '1';
        menu.style.visibility = 'visible';
      }
    });

    console.log('✅ Mobile menu initial state: CLOSED');
  }

  // Function to reposition language selector
  function repositionLanguageSelector() {
    const languageSelector = document.getElementById('language-switcher');
    if (!languageSelector) return;

    // Only reposition on mobile/tablet
    if (window.innerWidth <= 991) {
      const isRTL = document.documentElement.dir === 'rtl';

      // Update positioning
      languageSelector.style.position = 'fixed';
      languageSelector.style.top = window.innerWidth <= 479 ? '15px' : '20px';

      if (isRTL) {
        languageSelector.style.left = window.innerWidth <= 479 ? '60px' : '70px';
        languageSelector.style.right = 'auto';
      } else {
        languageSelector.style.right = window.innerWidth <= 479 ? '60px' : '70px';
        languageSelector.style.left = 'auto';
      }

      languageSelector.style.zIndex = '9999';

      console.log('✅ Language selector repositioned next to hamburger');
    }
  }

  // Initialize hamburger button functionality
  function initializeHamburgerButton() {
    const hamburgerButtons = document.querySelectorAll('.w-nav-button');

    hamburgerButtons.forEach(button => {
      // Remove any existing listeners to prevent duplicates
      const newButton = button.cloneNode(true);
      button.parentNode.replaceChild(newButton, button);

      // Add click listener
      newButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        const html = document.documentElement;
        const body = document.body;
        const nav = this.closest('.w-nav');
        const menu = nav ? nav.querySelector('.w-nav-menu') : null;
        const overlay = nav ? nav.querySelector('.w-nav-overlay') : null;

        // Toggle menu state
        const isOpen = html.classList.contains('w--nav-menu-open');

        if (isOpen) {
          // Close menu
          html.classList.remove('w--nav-menu-open');
          body.classList.remove('w--nav-menu-open');
          if (nav) nav.classList.remove('w--open');

          if (menu) {
            menu.style.display = 'none';
            menu.style.opacity = '0';
            menu.style.visibility = 'hidden';
          }

          if (overlay) {
            overlay.style.display = 'none';
          }

          console.log('📱 Menu closed');
        } else {
          // Open menu
          html.classList.add('w--nav-menu-open');
          body.classList.add('w--nav-menu-open');
          if (nav) nav.classList.add('w--open');

          if (menu) {
            menu.style.display = 'block';
            menu.style.opacity = '1';
            menu.style.visibility = 'visible';
          }

          if (overlay) {
            overlay.style.display = 'block';
          }

          console.log('📱 Menu opened');
        }
      });
    });
  }

  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      ensureMenuClosed();
      repositionLanguageSelector();
      initializeHamburgerButton();
    });
  } else {
    // DOM already loaded
    ensureMenuClosed();
    repositionLanguageSelector();
    initializeHamburgerButton();
  }

  // Also run after a short delay to override any async scripts (but not if menu is actively being used)
  setTimeout(function() {
    if (!document.body.classList.contains('w--nav-menu-open')) {
      ensureMenuClosed();
    }
    repositionLanguageSelector();
  }, 100);

  // Run again after Webflow initializes (but not if menu is actively being used)
  setTimeout(function() {
    if (!document.body.classList.contains('w--nav-menu-open')) {
      ensureMenuClosed();
    }
    repositionLanguageSelector();
  }, 500);

  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      repositionLanguageSelector();
      if (window.innerWidth > 991) {
        // On desktop, ensure mobile menu classes are removed
        document.documentElement.classList.remove('w--nav-menu-open');
        document.body.classList.remove('w--nav-menu-open');
      } else {
        // On mobile, ensure menu is closed after resize
        ensureMenuClosed();
      }
    }, 250);
  });

  // Disabled aggressive MutationObserver to prevent interference with user interactions
  // The mobile-menu-toggle-fix.js script will handle menu state management
  //
  // Original observer caused menu to close immediately after user clicked to open it
  // Keeping this commented out to allow proper menu functionality

  // Track hamburger clicks
  document.addEventListener('click', function(e) {
    if (e.target.closest('.w-nav-button')) {
      window.userClickedHamburger = true;
      setTimeout(function() {
        window.userClickedHamburger = false;
      }, 1000);
    }
  });

})();