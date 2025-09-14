/**
 * Mobile Menu Toggle Fix
 * Ensures hamburger button properly toggles menu visibility
 */

(function() {
  'use strict';

  // Initialize mobile menu system
  function initMobileMenu() {
    console.log('🔧 Initializing mobile menu system...');

    // Ensure menu starts in correct state based on screen size
    if (window.innerWidth <= 991) {
      closeMenu();
    } else {
      // On desktop, ensure menu is visible
      const menu = document.querySelector('.w-nav-menu');
      if (menu) {
        menu.style.display = 'flex';
        menu.style.opacity = '1';
        menu.style.visibility = 'visible';
      }
    }

    // Find or create hamburger button
    let hamburger = document.querySelector('.w-nav-button');

    if (!hamburger && window.innerWidth <= 991) {
      // Create hamburger if it doesn't exist
      hamburger = createHamburgerButton();
    }

    if (hamburger) {
      // Remove existing listeners
      const newHamburger = hamburger.cloneNode(true);
      hamburger.parentNode.replaceChild(newHamburger, hamburger);
      hamburger = newHamburger;

      // Add click handler with debounce
      let isToggling = false;
      hamburger.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        if (isToggling) return;
        isToggling = true;

        toggleMenu();

        setTimeout(() => {
          isToggling = false;
        }, 300);
      });

      console.log('✅ Hamburger button initialized');
    }

    // Handle clicks outside menu to close it
    document.addEventListener('click', function(e) {
      if (window.innerWidth <= 991) {
        const isMenuOpen = document.body.classList.contains('w--nav-menu-open');
        const clickedInMenu = e.target.closest('.w-nav-menu');
        const clickedHamburger = e.target.closest('.w-nav-button');

        if (isMenuOpen && !clickedInMenu && !clickedHamburger) {
          closeMenu();
        }
      }
    });

    // Handle escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && document.body.classList.contains('w--nav-menu-open')) {
        closeMenu();
      }
    });
  }

  // Create hamburger button if missing
  function createHamburgerButton() {
    const nav = document.querySelector('.w-nav, .navbar');
    if (!nav) return null;

    const button = document.createElement('button');
    button.className = 'w-nav-button';
    button.setAttribute('aria-label', 'Menu');
    button.innerHTML = '<div class="w-icon-nav-menu"><span></span></div>';

    nav.appendChild(button);
    return button;
  }

  // Toggle menu state
  function toggleMenu() {
    const isOpen = document.body.classList.contains('w--nav-menu-open');

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  // Open menu
  function openMenu() {
    console.log('📱 Opening menu...');

    // Add classes
    document.documentElement.classList.add('w--nav-menu-open');
    document.body.classList.add('w--nav-menu-open');

    // Find nav element
    const nav = document.querySelector('.w-nav');
    if (nav) {
      nav.classList.add('w--open');
    }

    // Show menu
    const menu = document.querySelector('.w-nav-menu');
    if (menu) {
      menu.style.display = 'block';
      menu.style.opacity = '1';
      menu.style.visibility = 'visible';

      // Ensure menu is visible and accessible
      setTimeout(() => {
        menu.style.display = 'block';
      }, 10);
    }

    // Show overlay
    const overlay = document.querySelector('.w-nav-overlay');
    if (overlay) {
      overlay.style.display = 'block';
    }

    console.log('✅ Menu opened');
  }

  // Close menu
  function closeMenu() {
    console.log('📱 Closing menu...');

    // Remove classes
    document.documentElement.classList.remove('w--nav-menu-open');
    document.body.classList.remove('w--nav-menu-open');

    // Find nav element
    const nav = document.querySelector('.w-nav');
    if (nav) {
      nav.classList.remove('w--open');
    }

    // Hide menu
    const menu = document.querySelector('.w-nav-menu');
    if (menu && window.innerWidth <= 991) {
      menu.style.display = 'none';
      menu.style.opacity = '0';
      menu.style.visibility = 'hidden';
    }

    // Hide overlay
    const overlay = document.querySelector('.w-nav-overlay');
    if (overlay) {
      overlay.style.display = 'none';
    }

    console.log('✅ Menu closed');
  }

  // Ensure menu visibility on resize
  function handleResize() {
    if (window.innerWidth > 991) {
      // Desktop - explicitly show menu
      const menu = document.querySelector('.w-nav-menu');
      if (menu) {
        menu.style.display = 'flex';
        menu.style.opacity = '1';
        menu.style.visibility = 'visible';
      }

      // Remove mobile menu classes
      document.documentElement.classList.remove('w--nav-menu-open');
      document.body.classList.remove('w--nav-menu-open');
    } else {
      // Mobile - ensure menu is closed
      if (!document.body.classList.contains('w--nav-menu-open')) {
        closeMenu();
      }
    }
  }

  // Check if menu element exists
  function checkMenuExists() {
    let menu = document.querySelector('.w-nav-menu');
    if (!menu) {
      console.warn('⚠️ No .w-nav-menu element found on page');

      // Try to find navigation items and create menu
      const navLinks = document.querySelectorAll('.nav-link');
      if (navLinks.length > 0) {
        const nav = document.querySelector('.w-nav, .navbar');
        if (nav) {
          const menuContainer = document.createElement('nav');
          menuContainer.className = 'w-nav-menu';
          menuContainer.role = 'navigation';

          navLinks.forEach(link => {
            menuContainer.appendChild(link.cloneNode(true));
          });

          nav.appendChild(menuContainer);
          console.log('✅ Created mobile menu container');
          menu = menuContainer;
        }
      }
    } else {
      console.log('✅ Menu element found');
    }

    // Skip mobile language selector - using inline desktop switcher instead
    // if (menu && !menu.querySelector('.mobile-language-selector')) {
    //   addLanguageSelector(menu);
    // }
  }

  // Add language selector to mobile menu
  function addLanguageSelector(menuElement) {
    // Detect current language
    const currentPath = window.location.pathname;
    let currentLang = 'en';
    if (currentPath.includes('/he/')) currentLang = 'he';
    else if (currentPath.includes('/ru/')) currentLang = 'ru';

    // Create language selector container
    const languageDiv = document.createElement('div');
    languageDiv.className = 'mobile-language-selector';
    languageDiv.style.cssText = 'padding: 15px 20px; border-top: 1px solid rgba(255,255,255,0.1); margin-top: auto;';

    // Create select element
    const select = document.createElement('select');
    select.id = 'mobile-language-select';
    select.style.cssText = `
      width: 100%;
      padding: 10px;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 5px;
      font-size: 16px;
      cursor: pointer;
      font-family: inherit;
    `;

    // Add options
    const languages = [
      { value: 'en', text: '🇬🇧 English' },
      { value: 'ru', text: '🇷🇺 Русский' },
      { value: 'he', text: '🇮🇱 עברית' }
    ];

    languages.forEach(lang => {
      const option = document.createElement('option');
      option.value = lang.value;
      option.textContent = lang.text;
      if (lang.value === currentLang) {
        option.selected = true;
      }
      select.appendChild(option);
    });

    // Add change handler
    select.addEventListener('change', function(e) {
      const selectedLang = e.target.value;
      const currentFile = currentPath.split('/').pop() || 'index.html';

      let newPath;
      if (selectedLang === 'en') {
        if (currentPath.includes('/he/') || currentPath.includes('/ru/')) {
          newPath = `/en/${currentFile}`;
        } else {
          newPath = `/${currentFile}`;
        }
      } else {
        newPath = `/${selectedLang}/${currentFile}`;
      }

      window.location.href = newPath;
    });

    languageDiv.appendChild(select);
    menuElement.appendChild(languageDiv);
    console.log('✅ Added language selector to mobile menu');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      checkMenuExists();
      initMobileMenu();
      handleResize();
    });
  } else {
    checkMenuExists();
    initMobileMenu();
    handleResize();
  }

  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(handleResize, 250);
  });

  // Re-initialize after a delay for dynamic content
  setTimeout(function() {
    checkMenuExists();
    initMobileMenu();
    handleResize();
  }, 500);

  // Export functions for debugging
  window.mobileMenuDebug = {
    openMenu: openMenu,
    closeMenu: closeMenu,
    toggleMenu: toggleMenu,
    checkMenuExists: checkMenuExists
  };

})();