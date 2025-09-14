/**
 * WEBFLOW ANIMATION FIX
 * Fixes opacity:0 elements that should be visible
 * This handles Webflow animations that aren't triggering properly
 */

(function() {
  'use strict';

  console.log('🎭 Webflow Animation Fix Loading...');

  function fixWebflowAnimations() {
    // Find all elements with data-w-id that have opacity:0
    const hiddenElements = document.querySelectorAll('[data-w-id][style*="opacity:0"], [data-w-id][style*="opacity: 0"]');

    console.log(`🔍 Found ${hiddenElements.length} hidden animated elements`);

    hiddenElements.forEach((element, index) => {
      // Add smooth transition
      element.style.transition = 'opacity 0.6s ease-in-out, transform 0.6s ease-in-out';

      // Animate in with stagger effect
      setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0px)';
        console.log(`✅ Animated element ${index + 1} with data-w-id: ${element.getAttribute('data-w-id')}`);
      }, index * 100); // Stagger by 100ms
    });

    // Special handling for instructor grid
    const instructorGrid = document.querySelector('#instructors-grid');
    if (instructorGrid && instructorGrid.style.opacity === '0') {
      setTimeout(() => {
        instructorGrid.style.transition = 'opacity 1s ease-in-out';
        instructorGrid.style.opacity = '1';
        console.log('✅ Fixed instructor grid visibility');
      }, 500);
    }
  }

  // Run after DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixWebflowAnimations);
  } else {
    fixWebflowAnimations();
  }

  // Also run after a short delay to catch any dynamic content
  setTimeout(fixWebflowAnimations, 1000);
  setTimeout(fixWebflowAnimations, 2000);

  console.log('🎭 Webflow Animation Fix Loaded');
})();