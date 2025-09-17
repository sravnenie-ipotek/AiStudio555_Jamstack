/**
 * Webflow Safety Patch
 * Prevents null reference errors in Webflow's minified code and browser extensions
 */

(function() {
  // Wrap in try-catch to prevent any initialization errors
  try {
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
      if (document.body) {
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
      }
    });
  } else {
    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }

  // Global error handler to catch and suppress content.js errors
  window.addEventListener('error', function(event) {
    // Check if error is from content.js (usually browser extensions)
    if (event.filename && event.filename.includes('content.js')) {
      console.warn('Suppressed browser extension error:', event.message);
      event.preventDefault();
      return true;
    }

    // Check for childElementCount errors
    if (event.message && event.message.includes('childElementCount')) {
      console.warn('Suppressed childElementCount error:', event.message);
      event.preventDefault();
      return true;
    }
  });

  // Patch Element.prototype to add safe childElementCount
  if (typeof Element !== 'undefined' && Element.prototype) {
    const originalChildElementCount = Object.getOwnPropertyDescriptor(Element.prototype, 'childElementCount');
    if (originalChildElementCount) {
      Object.defineProperty(Element.prototype, 'childElementCount', {
        get: function() {
          try {
            if (!this || !this.children) return 0;
            return originalChildElementCount.get.call(this);
          } catch (e) {
            return 0;
          }
        },
        configurable: true
      });
    }
  }

  } catch (e) {
    console.warn('Webflow safety patch initialization error:', e);
  }
})();