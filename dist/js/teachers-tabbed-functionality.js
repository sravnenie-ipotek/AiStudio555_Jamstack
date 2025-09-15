/**
 * Teachers Tabbed Functionality
 * TeachMeSkills.by-inspired tab switching with smooth animations
 *
 * Features:
 * - Tab switching with active states
 * - Smooth card filtering animations
 * - Responsive tab behavior
 * - Contact teacher modal integration
 * - Analytics tracking for tab switches
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    ANIMATION_DURATION: 400,
    STAGGER_DELAY: 100,
    FADE_DURATION: 300
  };

  // DOM elements
  let tabButtons = [];
  let teacherCards = [];
  let isAnimating = false;

  // Tab category mappings
  const TAB_MAPPINGS = {
    'all': ['machine-learning', 'development', 'cloud-devops', 'data-analytics', 'design', 'management'],
    'machine-learning': ['machine-learning'],
    'development': ['development'],
    'cloud-devops': ['cloud-devops'],
    'data-analytics': ['data-analytics'],
    'design': ['design'],
    'management': ['management']
  };

  /**
   * Initialize the tabbed teachers functionality
   */
  function initTeachersTab() {
    // Cache DOM elements
    tabButtons = document.querySelectorAll('.teacher-tab-btn');
    teacherCards = document.querySelectorAll('.teacher-card-minimal');

    if (tabButtons.length === 0 || teacherCards.length === 0) {
      console.warn('Teachers tab elements not found');
      return;
    }

    // Set up event listeners
    setupTabListeners();
    setupContactButtonListeners();

    // Initialize with 'all' tab active
    showCategory('all');

    // Add keyboard navigation
    setupKeyboardNavigation();

    console.log('Teachers tabbed functionality initialized');
  }

  /**
   * Set up tab button click listeners
   */
  function setupTabListeners() {
    tabButtons.forEach(button => {
      button.addEventListener('click', handleTabClick);

      // Add hover analytics
      button.addEventListener('mouseenter', () => {
        trackEvent('tab_hover', button.dataset.category);
      });
    });
  }

  /**
   * Handle tab button clicks
   */
  function handleTabClick(event) {
    if (isAnimating) return;

    const clickedTab = event.currentTarget;
    const category = clickedTab.dataset.category;

    // Don't do anything if already active
    if (clickedTab.classList.contains('active')) return;

    // Track analytics
    trackEvent('tab_switch', category);

    // Update active state
    updateActiveTab(clickedTab);

    // Show cards for this category
    showCategory(category);
  }

  /**
   * Update active tab visual state
   */
  function updateActiveTab(activeTab) {
    // Remove active class from all tabs
    tabButtons.forEach(tab => {
      tab.classList.remove('active');
      tab.setAttribute('aria-selected', 'false');
    });

    // Add active class to clicked tab
    activeTab.classList.add('active');
    activeTab.setAttribute('aria-selected', 'true');
  }

  /**
   * Show teachers for specific category with animation
   */
  function showCategory(category) {
    if (isAnimating) return;

    isAnimating = true;
    const categoriesToShow = TAB_MAPPINGS[category] || [category];

    // Phase 1: Fade out all cards
    teacherCards.forEach((card, index) => {
      card.style.transition = `opacity ${CONFIG.FADE_DURATION}ms ease, transform ${CONFIG.FADE_DURATION}ms ease`;
      card.classList.add('hidden');
    });

    // Phase 2: After fade out, determine which cards to show
    setTimeout(() => {
      teacherCards.forEach((card, index) => {
        const cardCategory = card.dataset.category;
        const cardTab = card.dataset.tab;

        if (category === 'all' ||
            categoriesToShow.includes(cardCategory) ||
            categoriesToShow.includes(cardTab)) {

          // Show this card with staggered animation
          setTimeout(() => {
            card.classList.remove('hidden');
            card.classList.add('show', 'animate-in');
          }, index * CONFIG.STAGGER_DELAY);

        } else {
          // Keep this card hidden
          card.classList.add('hidden');
          card.classList.remove('show', 'animate-in');
        }
      });

      // Reset animation lock after all animations complete
      setTimeout(() => {
        isAnimating = false;

        // Clean up animation classes
        teacherCards.forEach(card => {
          card.classList.remove('animate-in');
        });
      }, teacherCards.length * CONFIG.STAGGER_DELAY + CONFIG.ANIMATION_DURATION);

    }, CONFIG.FADE_DURATION);

    // Update URL hash for deep linking (optional)
    if (category !== 'all') {
      window.history.replaceState(null, null, `#${category}`);
    } else {
      window.history.replaceState(null, null, window.location.pathname);
    }
  }

  /**
   * Set up contact teacher button listeners
   */
  function setupContactButtonListeners() {
    const contactButtons = document.querySelectorAll('.contact-teacher-btn');

    contactButtons.forEach(button => {
      button.addEventListener('click', handleContactTeacher);
    });
  }

  /**
   * Handle contact teacher button clicks
   */
  function handleContactTeacher(event) {
    event.preventDefault();

    const card = event.target.closest('.teacher-card-minimal');
    const teacherName = card.querySelector('.teacher-name-minimal').textContent;
    const teacherRole = card.querySelector('.teacher-role-minimal').textContent;

    // Track analytics
    trackEvent('contact_teacher', teacherName);

    // Check if contact modal functionality exists
    if (typeof window.openContactModal === 'function') {
      // Pre-fill modal with teacher info
      window.openContactModal({
        subject: `Inquiry about ${teacherName}`,
        message: `Hi, I'd like to learn more about courses taught by ${teacherName} (${teacherRole}).`
      });
    } else {
      // Fallback: scroll to contact form or open WhatsApp
      const whatsappMessage = encodeURIComponent(`Hi, I'd like to learn more about courses taught by ${teacherName} (${teacherRole}).`);
      const whatsappUrl = `https://wa.me/1234567890?text=${whatsappMessage}`;
      window.open(whatsappUrl, '_blank');
    }
  }

  /**
   * Set up keyboard navigation for accessibility
   */
  function setupKeyboardNavigation() {
    tabButtons.forEach((button, index) => {
      button.addEventListener('keydown', (event) => {
        let targetIndex = index;

        switch (event.key) {
          case 'ArrowRight':
          case 'ArrowDown':
            targetIndex = (index + 1) % tabButtons.length;
            event.preventDefault();
            break;
          case 'ArrowLeft':
          case 'ArrowUp':
            targetIndex = (index - 1 + tabButtons.length) % tabButtons.length;
            event.preventDefault();
            break;
          case 'Home':
            targetIndex = 0;
            event.preventDefault();
            break;
          case 'End':
            targetIndex = tabButtons.length - 1;
            event.preventDefault();
            break;
          default:
            return;
        }

        tabButtons[targetIndex].focus();
        tabButtons[targetIndex].click();
      });
    });
  }

  /**
   * Handle deep linking from URL hash
   */
  function handleDeepLinking() {
    const hash = window.location.hash.replace('#', '');

    if (hash && TAB_MAPPINGS[hash]) {
      const targetTab = document.querySelector(`[data-category="${hash}"]`);
      if (targetTab) {
        setTimeout(() => {
          targetTab.click();
        }, 100);
      }
    }
  }

  /**
   * Track analytics events
   */
  function trackEvent(event, data) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', event, {
        'custom_parameter': data,
        'page_title': 'Teachers Page'
      });
    }

    // Console log for debugging
    console.log(`Analytics Event: ${event}`, data);
  }

  /**
   * Add loading states and error handling
   */
  function addLoadingStates() {
    // Add loading class initially
    const grid = document.querySelector('.teachers-grid-minimal');
    if (grid) {
      grid.classList.add('loading');

      // Remove loading class after content is ready
      setTimeout(() => {
        grid.classList.remove('loading');
      }, 500);
    }
  }

  /**
   * Responsive behavior for mobile
   */
  function handleResponsive() {
    const handleResize = () => {
      // Reset animations on resize to prevent layout issues
      if (window.innerWidth <= 767) {
        teacherCards.forEach(card => {
          card.style.transition = 'none';
        });

        setTimeout(() => {
          teacherCards.forEach(card => {
            card.style.transition = '';
          });
        }, 100);
      }
    };

    window.addEventListener('resize', debounce(handleResize, 250));
  }

  /**
   * Debounce utility function
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Error handling for missing elements
   */
  function handleErrors() {
    window.addEventListener('error', (event) => {
      if (event.target.tagName === 'IMG') {
        // Handle missing teacher images
        const img = event.target;
        const card = img.closest('.teacher-card-minimal');
        if (card) {
          console.warn('Missing teacher image, using fallback');
          // Image already has onerror fallback in HTML
        }
      }
    });
  }

  /**
   * Initialize everything when DOM is ready
   */
  function initialize() {
    // Add ARIA attributes for accessibility
    const tabList = document.querySelector('.teacher-tabs-wrapper');
    if (tabList) {
      tabList.setAttribute('role', 'tablist');
      tabList.setAttribute('aria-label', 'Teacher categories');
    }

    tabButtons.forEach((button, index) => {
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
      button.setAttribute('tabindex', index === 0 ? '0' : '-1');
    });

    // Initialize functionality
    addLoadingStates();
    initTeachersTab();
    handleDeepLinking();
    handleResponsive();
    handleErrors();

    // Handle browser back/forward
    window.addEventListener('popstate', handleDeepLinking);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

  // Expose public API
  window.TeachersTab = {
    showCategory,
    refresh: initTeachersTab
  };

})();