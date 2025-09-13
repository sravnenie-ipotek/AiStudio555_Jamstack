/**
 * EMERGENCY FIX - Navigation and Footer
 * Fixes both missing navigation and footer container issues
 * ULTRATHINK CRITICAL FIX
 */

(function() {
  'use strict';
  
  console.log('🚨 EMERGENCY FIX: Loading critical patches...');
  
  // FIX 1: Ensure Footer Container Exists
  function ensureFooterContainer() {
    // Check if footer container exists
    let footerContainer = document.querySelector('.footer-dynamic');
    
    if (!footerContainer) {
      console.log('🔧 Creating missing footer container...');
      
      // Find where to insert footer (after main content, before scripts)
      const mainContent = document.querySelector('main') || 
                         document.querySelector('.main-wrapper') ||
                         document.querySelector('[role="main"]') ||
                         document.querySelector('.page-wrapper');
      
      // Create footer container
      footerContainer = document.createElement('div');
      footerContainer.className = 'footer-dynamic';
      footerContainer.id = 'secure-footer-container';
      footerContainer.style.cssText = 'width: 100%; position: relative; z-index: 1;';
      
      if (mainContent) {
        // Insert after main content
        mainContent.parentNode.insertBefore(footerContainer, mainContent.nextSibling);
      } else {
        // Fallback: insert before first script tag
        const firstScript = document.querySelector('script');
        if (firstScript) {
          firstScript.parentNode.insertBefore(footerContainer, firstScript);
        } else {
          // Last resort: append to body
          document.body.appendChild(footerContainer);
        }
      }
      
      console.log('✅ Footer container created');
    }
    
    return footerContainer;
  }
  
  // FIX 2: Force Navigation Visibility
  function fixNavigation() {
    const isMobile = window.innerWidth <= 991;
    console.log(`📱 Device: ${isMobile ? 'Mobile' : 'Desktop'} (${window.innerWidth}px)`);
    
    // Find navigation elements
    const navMenus = document.querySelectorAll('.nav-menu, .w-nav-menu');
    const hamburgers = document.querySelectorAll('.menu-button, .w-nav-button');
    
    if (!isMobile) {
      // DESKTOP: Force menu visible
      navMenus.forEach(menu => {
        menu.style.cssText = `
          display: flex !important;
          visibility: visible !important;
          opacity: 1 !important;
          position: static !important;
          flex-direction: row !important;
          align-items: center !important;
          gap: 20px !important;
        `;
      });
      
      // Hide hamburger on desktop
      hamburgers.forEach(btn => {
        btn.style.display = 'none !important';
      });
      
      console.log('✅ Desktop navigation fixed');
      
    } else {
      // MOBILE: Show hamburger, hide menu initially
      hamburgers.forEach(btn => {
        btn.style.cssText = `
          display: flex !important;
          visibility: visible !important;
          opacity: 1 !important;
          position: relative !important;
          z-index: 9999 !important;
          width: 44px !important;
          height: 44px !important;
          cursor: pointer !important;
        `;
        
        // Ensure hamburger icon is visible
        const icon = btn.querySelector('svg, .hamburger-menu-icon, [data-w-id]');
        if (icon) {
          icon.style.cssText = `
            display: block !important;
            width: 24px !important;
            height: 24px !important;
          `;
        }
        
        // Add basic hamburger if missing
        if (!btn.innerHTML || btn.innerHTML.trim() === '') {
          btn.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          `;
        }
      });
      
      // Hide menu initially on mobile (unless already open)
      if (!document.documentElement.classList.contains('w--nav-menu-open')) {
        navMenus.forEach(menu => {
          menu.style.display = 'none';
        });
      }
      
      console.log('✅ Mobile navigation fixed');
    }
    
    // Fix navigation links visibility
    const navLinks = document.querySelectorAll('.nav-link, .w-nav-link');
    navLinks.forEach(link => {
      link.style.cssText += `
        visibility: visible !important;
        opacity: 1 !important;
        display: inline-block !important;
      `;
    });
    
    // Fix language selector visibility
    const langButtons = document.querySelectorAll('.lang-btn, .language-toggle-wrapper button, [class*="language"] button');
    langButtons.forEach(btn => {
      btn.style.cssText += `
        color: #ffffff !important;
        background: rgba(255, 255, 255, 0.1) !important;
        border: 1px solid rgba(255, 255, 255, 0.3) !important;
        visibility: visible !important;
        opacity: 1 !important;
      `;
    });
  }
  
  // FIX 3: Setup Hamburger Toggle (Mobile)
  function setupHamburgerToggle() {
    const hamburgers = document.querySelectorAll('.menu-button, .w-nav-button');
    
    hamburgers.forEach(btn => {
      // Remove existing listeners first
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      
      newBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const menu = document.querySelector('.nav-menu, .w-nav-menu');
        const isOpen = document.documentElement.classList.contains('w--nav-menu-open');
        
        if (isOpen) {
          // Close menu
          document.documentElement.classList.remove('w--nav-menu-open');
          document.body.classList.remove('w--nav-menu-open');
          if (menu) menu.style.display = 'none';
        } else {
          // Open menu
          document.documentElement.classList.add('w--nav-menu-open');
          document.body.classList.add('w--nav-menu-open');
          if (menu) {
            menu.style.cssText = `
              display: flex !important;
              flex-direction: column !important;
              position: fixed !important;
              top: 80px !important;
              left: 0 !important;
              right: 0 !important;
              background: rgba(5, 5, 26, 0.98) !important;
              padding: 20px !important;
              z-index: 9998 !important;
              visibility: visible !important;
              opacity: 1 !important;
            `;
          }
        }
      });
    });
  }
  
  // FIX 4: Add Critical CSS
  function addCriticalCSS() {
    const style = document.createElement('style');
    style.textContent = `
      /* Emergency Navigation Fixes */
      @media screen and (min-width: 992px) {
        .nav-menu, .w-nav-menu {
          display: flex !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        .menu-button, .w-nav-button {
          display: none !important;
        }
      }
      
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
      }
      
      /* Footer container */
      .footer-dynamic {
        display: block !important;
        visibility: visible !important;
      }
      
      /* Language selector fix */
      .lang-btn, .language-toggle-wrapper button {
        color: #ffffff !important;
        background: rgba(255, 255, 255, 0.1) !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Initialize all fixes
  function initEmergencyFixes() {
    console.log('🚨 Applying emergency fixes...');
    
    // Apply fixes in order
    ensureFooterContainer();
    fixNavigation();
    
    if (window.innerWidth <= 991) {
      setupHamburgerToggle();
    }
    
    addCriticalCSS();
    
    console.log('✅ Emergency fixes applied');
  }
  
  // Run immediately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEmergencyFixes);
  } else {
    initEmergencyFixes();
  }
  
  // Reapply on resize
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      fixNavigation();
      if (window.innerWidth <= 991) {
        setupHamburgerToggle();
      }
    }, 250);
  });
  
  // Monitor for dynamic changes
  setTimeout(initEmergencyFixes, 100);
  setTimeout(initEmergencyFixes, 500);
  setTimeout(initEmergencyFixes, 1000);
  
})();