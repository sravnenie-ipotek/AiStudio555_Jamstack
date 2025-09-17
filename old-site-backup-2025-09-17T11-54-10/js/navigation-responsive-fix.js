/**
 * CRITICAL NAVIGATION RESPONSIVE FIX
 * Fixes desktop menu visibility, mobile hamburger, and language selector
 * ULTRATHINK SOLUTION
 */

(function() {
  'use strict';

  console.log('🔧 Navigation Responsive Fix Loading...');

  function initNavigationFix() {
    const isMobile = window.innerWidth <= 991;
    const isTablet = window.innerWidth > 991 && window.innerWidth <= 1200;
    const isDesktop = window.innerWidth > 1200;

    console.log(`📱 Device: ${isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'} (${window.innerWidth}px)`);

    // FIX 1: Desktop Navigation Visibility
    function fixDesktopNavigation() {
      if (!isMobile) {
        // Force desktop menu to be visible
        const navMenus = document.querySelectorAll('.nav-menu, .w-nav-menu');
        navMenus.forEach(menu => {
          menu.style.display = 'flex';
          menu.style.visibility = 'visible';
          menu.style.opacity = '1';
          menu.style.flexDirection = 'row';
          menu.style.alignItems = 'center';
          menu.style.gap = '20px';
          menu.style.position = 'static';
          console.log('✅ Desktop menu made visible');
        });

        // Hide hamburger on desktop
        const hamburgers = document.querySelectorAll('.menu-button, .w-nav-button');
        hamburgers.forEach(btn => {
          btn.style.display = 'none';
          console.log('✅ Hamburger hidden on desktop');
        });
      }
    }

    // FIX 2: Mobile Hamburger Menu
    function fixMobileHamburger() {
      if (isMobile) {
        // Hide desktop menu on mobile
        const navMenus = document.querySelectorAll('.nav-menu, .w-nav-menu');
        navMenus.forEach(menu => {
          // Initially hide the menu (it should be toggled by hamburger)
          if (!document.documentElement.classList.contains('w--nav-menu-open')) {
            menu.style.display = 'none';
          }
        });

        // Show and style hamburger button
        const hamburgers = document.querySelectorAll('.menu-button, .w-nav-button');
        hamburgers.forEach(btn => {
          btn.style.display = 'flex';
          btn.style.visibility = 'visible';
          btn.style.opacity = '1';
          btn.style.position = 'relative';
          btn.style.zIndex = '9999';
          btn.style.width = '44px';
          btn.style.height = '44px';
          btn.style.alignItems = 'center';
          btn.style.justifyContent = 'center';
          btn.style.cursor = 'pointer';
          btn.style.background = 'transparent';
          btn.style.border = 'none';
          btn.style.padding = '10px';
          
          // Ensure the hamburger icon is visible
          const icon = btn.querySelector('.hamburger-menu-icon, [data-w-id]');
          if (icon) {
            icon.style.display = 'block';
            icon.style.width = '24px';
            icon.style.height = '24px';
            icon.style.color = 'white';
            icon.style.fill = 'white';
            
            // If it's an SVG or Lottie, ensure it's visible
            const svgs = icon.querySelectorAll('svg, path, line');
            svgs.forEach(svg => {
              svg.style.stroke = 'white';
              svg.style.fill = 'white';
            });
          }

          // Add three-line hamburger if no icon exists
          if (!icon || !icon.children.length) {
            btn.innerHTML = `
              <div style="display: flex; flex-direction: column; gap: 4px; width: 24px;">
                <div style="height: 2px; background: white; width: 100%; transition: all 0.3s;"></div>
                <div style="height: 2px; background: white; width: 100%; transition: all 0.3s;"></div>
                <div style="height: 2px; background: white; width: 100%; transition: all 0.3s;"></div>
              </div>
            `;
          }

          console.log('✅ Hamburger button styled and visible');
        });

        // Setup hamburger click handling
        setupHamburgerToggle();
      }
    }

    // FIX 3: Language Selector Visibility
    function fixLanguageSelector() {
      const languageButtons = document.querySelectorAll('.language-toggle-wrapper button, .lang-btn, [class*="language"] button');
      
      languageButtons.forEach(btn => {
        // Ensure text is visible with proper contrast
        btn.style.color = '#ffffff';
        btn.style.background = 'rgba(255, 255, 255, 0.1)';
        btn.style.border = '1px solid rgba(255, 255, 255, 0.3)';
        btn.style.padding = '8px 16px';
        btn.style.borderRadius = '8px';
        btn.style.cursor = 'pointer';
        btn.style.transition = 'all 0.3s ease';
        btn.style.fontWeight = '500';
        btn.style.fontSize = '14px';
        
        // Hover state
        btn.addEventListener('mouseenter', function() {
          this.style.background = 'rgba(255, 255, 255, 0.2)';
          this.style.borderColor = 'rgba(255, 255, 255, 0.5)';
        });
        
        btn.addEventListener('mouseleave', function() {
          if (!this.classList.contains('active')) {
            this.style.background = 'rgba(255, 255, 255, 0.1)';
            this.style.borderColor = 'rgba(255, 255, 255, 0.3)';
          }
        });

        // Active state
        if (btn.classList.contains('active')) {
          btn.style.background = 'rgba(255, 214, 89, 0.2)';
          btn.style.borderColor = '#ffd659';
          btn.style.color = '#ffd659';
        }
      });

      console.log(`✅ Fixed ${languageButtons.length} language selector buttons`);
    }

    // Setup hamburger menu toggle
    function setupHamburgerToggle() {
      const hamburgers = document.querySelectorAll('.menu-button, .w-nav-button');
      
      hamburgers.forEach(btn => {
        // Remove existing listeners
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        // Add new click handler
        newBtn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          const nav = this.closest('.w-nav, nav');
          const menu = document.querySelector('.nav-menu, .w-nav-menu');
          const overlay = document.querySelector('.w-nav-overlay') || createOverlay();
          
          const isOpen = document.documentElement.classList.contains('w--nav-menu-open');
          
          if (isOpen) {
            // Close menu
            document.documentElement.classList.remove('w--nav-menu-open');
            document.body.classList.remove('w--nav-menu-open');
            if (nav) nav.classList.remove('w--nav-menu-open');
            
            if (menu) {
              menu.style.display = 'none';
              menu.classList.remove('w--nav-menu-open');
            }
            
            if (overlay) {
              overlay.style.display = 'none';
              overlay.style.opacity = '0';
            }
            
            console.log('📱 Mobile menu closed');
          } else {
            // Open menu
            document.documentElement.classList.add('w--nav-menu-open');
            document.body.classList.add('w--nav-menu-open');
            if (nav) nav.classList.add('w--nav-menu-open');
            
            if (menu) {
              menu.style.display = 'flex';
              menu.style.flexDirection = 'column';
              menu.style.position = 'fixed';
              menu.style.top = '80px';
              menu.style.left = '0';
              menu.style.right = '0';
              menu.style.background = 'rgba(5, 5, 26, 0.98)';
              menu.style.padding = '20px';
              menu.style.zIndex = '9998';
              menu.style.maxHeight = 'calc(100vh - 80px)';
              menu.style.overflowY = 'auto';
              menu.classList.add('w--nav-menu-open');
            }
            
            if (overlay) {
              overlay.style.display = 'block';
              overlay.style.opacity = '1';
            }
            
            console.log('📱 Mobile menu opened');
          }
        });
      });
    }

    // Create overlay if it doesn't exist
    function createOverlay() {
      let overlay = document.querySelector('.w-nav-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'w-nav-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.right = '0';
        overlay.style.bottom = '0';
        overlay.style.background = 'rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = '9997';
        overlay.style.display = 'none';
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.3s ease';
        
        document.body.appendChild(overlay);
        
        // Close menu when overlay is clicked
        overlay.addEventListener('click', function() {
          const hamburger = document.querySelector('.menu-button, .w-nav-button');
          if (hamburger) hamburger.click();
        });
      }
      return overlay;
    }

    // Apply all fixes
    fixDesktopNavigation();
    fixMobileHamburger();
    fixLanguageSelector();

    // Add responsive CSS rules
    const style = document.createElement('style');
    style.textContent = `
      /* Desktop Navigation (above 991px) */
      @media screen and (min-width: 992px) {
        .nav-menu, .w-nav-menu {
          display: flex !important;
          visibility: visible !important;
          opacity: 1 !important;
          position: static !important;
          flex-direction: row !important;
          align-items: center !important;
          gap: 20px !important;
          background: transparent !important;
        }
        
        .menu-button, .w-nav-button {
          display: none !important;
        }
        
        .w-nav-overlay {
          display: none !important;
        }
      }
      
      /* Mobile Navigation (991px and below) */
      @media screen and (max-width: 991px) {
        .menu-button, .w-nav-button {
          display: flex !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        
        .w--nav-menu-open .nav-menu,
        .w--nav-menu-open .w-nav-menu {
          display: flex !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        
        /* Language selector mobile fix */
        .language-toggle-wrapper button,
        .lang-btn {
          color: #ffffff !important;
          background: rgba(255, 255, 255, 0.1) !important;
          border: 1px solid rgba(255, 255, 255, 0.3) !important;
        }
      }
      
      /* Hamburger icon styling */
      .hamburger-menu-icon svg,
      .menu-button svg path {
        stroke: white !important;
        fill: white !important;
      }
    `;
    document.head.appendChild(style);
    
    console.log('✅ Navigation Responsive Fix Complete');
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigationFix);
  } else {
    initNavigationFix();
  }

  // Reinitialize on window resize
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initNavigationFix, 250);
  });

  // Reinitialize after dynamic content loads
  window.addEventListener('load', function() {
    setTimeout(initNavigationFix, 100);
  });

})();