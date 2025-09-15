/**
 * Webflow Safety Patch
 * Prevents null reference errors in Webflow's minified code
 */

(function() {
  // Store original methods
  const originalQuerySelector = document.querySelector;
  const originalQuerySelectorAll = document.querySelectorAll;

  // Override querySelector with null-safe version
  document.querySelector = function(selector) {
    try {
      return originalQuerySelector.call(this, selector);
    } catch (e) {
      console.warn('Selector error caught:', selector, e);
      return null;
    }
  };

  // Override querySelectorAll with null-safe version
  document.querySelectorAll = function(selector) {
    try {
      return originalQuerySelectorAll.call(this, selector);
    } catch (e) {
      console.warn('Selector error caught:', selector, e);
      return [];
    }
  };

  // Add safety check for childElementCount access
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        const nodes = mutation.addedNodes;
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          if (node && node.nodeType === 1) { // Element node
            // Ensure childElementCount is accessible
            if (!node.hasOwnProperty('childElementCount')) {
              Object.defineProperty(node, 'childElementCount', {
                get: function() {
                  return this.children ? this.children.length : 0;
                }
              });
            }
          }
        }
      }
    });
  });

  // Start observing when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  } else {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
})();