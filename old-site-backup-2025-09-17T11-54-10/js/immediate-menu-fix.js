/**
 * IMMEDIATE Menu Visibility Fix
 * Runs immediately without waiting for DOMContentLoaded
 * Prevents any JavaScript from hiding the desktop menu
 */

(function() {
  'use strict';

  function forceMenuVisible() {
    // Only on desktop
    if (window.innerWidth > 991) {
      const menus = document.querySelectorAll('.w-nav-menu');
      menus.forEach(menu => {
        menu.style.display = 'flex';
        menu.style.visibility = 'visible';
        menu.style.opacity = '1';
        menu.style.position = 'static';
        menu.style.transform = 'none';
        menu.style.left = 'auto';
        menu.style.right = 'auto';
        menu.style.top = 'auto';
        menu.style.bottom = 'auto';
        menu.style.width = 'auto';
        menu.style.height = 'auto';
        menu.style.background = 'transparent';
        menu.style.zIndex = 'auto';
        menu.style.pointerEvents = 'auto';
        menu.style.clip = 'auto';
        menu.style.clipPath = 'none';
      });

      console.log('🚀 IMMEDIATE: Desktop menu forced visible');
    }
  }

  // Run immediately
  forceMenuVisible();

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', forceMenuVisible);
  } else {
    forceMenuVisible();
  }

  // Run continuously every 100ms for the first 3 seconds to override any interference
  let attempts = 0;
  const maxAttempts = 30; // 3 seconds

  const intervalId = setInterval(function() {
    if (window.innerWidth > 991) {
      forceMenuVisible();
      attempts++;

      if (attempts >= maxAttempts) {
        clearInterval(intervalId);
        console.log('🚀 IMMEDIATE: Desktop menu protection complete');
      }
    }
  }, 100);

  // Override any future style changes with a MutationObserver
  if (window.MutationObserver && window.innerWidth > 991) {
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          const target = mutation.target;
          if (target.matches('.w-nav-menu') && window.innerWidth > 991) {
            // Re-apply desktop styles if something tried to change them
            setTimeout(forceMenuVisible, 0);
          }
        }
      });
    });

    // Start observing after DOM is ready
    function startObserving() {
      const menus = document.querySelectorAll('.w-nav-menu');
      menus.forEach(menu => {
        observer.observe(menu, { attributes: true, attributeFilter: ['style'] });
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', startObserving);
    } else {
      startObserving();
    }
  }

})();