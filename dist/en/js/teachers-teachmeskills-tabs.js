/**
 * Teachers TeachMeSkills-Style Tab Functionality
 * Simplified tab system matching TeachMeSkills.by design
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    ANIMATION_DURATION: 300,
    FADE_DURATION: 200
  };

  // DOM elements
  let tabButtons = [];
  let teacherCards = [];
  let isAnimating = false;

  // TeachMeSkills-style tab mappings
  const TAB_MAPPINGS = {
    'all': ['frontend', 'java', 'python', 'javascript', 'mobile', 'devops', 'qa', 'design', 'management'],
    'frontend': ['frontend'],
    'java': ['java'],
    'python': ['python'],
    'javascript': ['javascript'],
    'mobile': ['mobile'],
    'devops': ['devops'],
    'qa': ['qa'],
    'design': ['design'],
    'management': ['management']
  };

  /**
   * Initialize the TeachMeSkills-style tab functionality
   */
  function initTeachMeSkillsTabs() {
    // Cache DOM elements
    tabButtons = document.querySelectorAll('.teacher-tab-btn');
    teacherCards = document.querySelectorAll('.teacher-card-teachmeskills');

    if (tabButtons.length === 0 || teacherCards.length === 0) {
      console.warn('TeachMeSkills-style teacher tab elements not found');
      return;
    }

    // Set up event listeners
    setupTabListeners();

    // Initialize with 'all' tab active
    showCategory('all');

    console.log('TeachMeSkills-style teachers tab functionality initialized');
  }

  /**
   * Set up tab button click listeners
   */
  function setupTabListeners() {
    tabButtons.forEach(button => {
      button.addEventListener('click', handleTabClick);

      // Add hover effect
      button.addEventListener('mouseenter', () => {
        if (!button.classList.contains('active')) {
          button.style.borderColor = '#fbdc0c';
          button.style.color = '#fbdc0c';
        }
      });

      button.addEventListener('mouseleave', () => {
        if (!button.classList.contains('active')) {
          button.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          button.style.color = 'rgba(255, 255, 255, 0.8)';
        }
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
      tab.style.background = 'transparent';
      tab.style.color = 'rgba(255, 255, 255, 0.8)';
      tab.style.borderColor = 'rgba(255, 255, 255, 0.2)';
    });

    // Add active class to clicked tab
    activeTab.classList.add('active');
    activeTab.style.background = '#fbdc0c';
    activeTab.style.color = '#000';
    activeTab.style.borderColor = '#fbdc0c';
  }

  /**
   * Show teachers for specific category with animation
   */
  function showCategory(category) {
    if (isAnimating) return;

    isAnimating = true;
    const categoriesToShow = TAB_MAPPINGS[category] || [category];

    console.log(`Showing category: ${category}, categories to show:`, categoriesToShow);

    // Phase 1: Hide all cards
    teacherCards.forEach((card, index) => {
      card.style.transition = `opacity ${CONFIG.FADE_DURATION}ms ease, transform ${CONFIG.FADE_DURATION}ms ease`;
      card.classList.add('hidden');
      card.style.opacity = '0';
      card.style.transform = 'translateY(10px)';
    });

    // Phase 2: Show relevant cards after fade out
    setTimeout(() => {
      let visibleCount = 0;

      teacherCards.forEach((card, index) => {
        const cardCategory = card.dataset.category;
        const cardTab = card.dataset.tab;

        if (category === 'all' ||
            categoriesToShow.includes(cardCategory) ||
            categoriesToShow.includes(cardTab)) {

          // Show this card with staggered animation
          setTimeout(() => {
            card.classList.remove('hidden');
            card.classList.add('show');
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, visibleCount * 50); // Stagger by 50ms

          visibleCount++;
        } else {
          // Keep this card hidden
          card.classList.add('hidden');
          card.classList.remove('show');
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
        }
      });

      console.log(`Showing ${visibleCount} teachers for category: ${category}`);

      // Reset animation lock after all animations complete
      setTimeout(() => {
        isAnimating = false;
      }, visibleCount * 50 + CONFIG.ANIMATION_DURATION);

    }, CONFIG.FADE_DURATION);
  }

  /**
   * Load teachers from database and replace static content
   */
  async function loadTeachersFromDatabase() {
    try {
      const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3000/api'
        : 'https://aistudio555jamstack-production.up.railway.app/api';

      const currentLang = detectLanguage();
      console.log('Loading teachers from database for language:', currentLang);

      const response = await fetch(`${API_BASE}/teachers?locale=${currentLang}`);

      if (!response.ok) {
        throw new Error(`API responded with ${response.status}`);
      }

      const data = await response.json();
      console.log('Received teachers from database:', data.data?.length || 0);

      if (data.data && data.data.length > 0) {
        updateTeachersGrid(data.data);
        console.log('✅ Successfully loaded teachers from database');
      } else {
        console.log('⚠️ No teachers found in database, using static content');
      }

    } catch (error) {
      console.error('❌ Failed to load teachers from database:', error);
      console.log('📄 Using static teacher content');
    }
  }

  /**
   * Update the teachers grid with database data
   */
  function updateTeachersGrid(teachers) {
    const container = document.querySelector('.teachers-grid-teachmeskills');
    if (!container) return;

    // Clear existing content
    container.innerHTML = '';

    // Create cards from database data
    teachers.forEach(teacher => {
      const attrs = teacher.attributes || teacher;
      const category = mapCategoryToTeachMeSkills(attrs.category || attrs.specialization || 'frontend');

      const card = document.createElement('div');
      card.className = 'teacher-card-teachmeskills';
      card.dataset.category = category;
      card.dataset.tab = category;

      card.innerHTML = `
        <h3 class="teacher-name-teachmeskills">${attrs.name || 'Teacher Name'}</h3>
        <p class="teacher-role-teachmeskills">${attrs.title || attrs.role || 'Developer'}</p>
        <p class="teacher-experience-teachmeskills">${attrs.experience || 'Professional development experience'}</p>
      `;

      container.appendChild(card);
    });

    // Reinitialize tab functionality with new cards
    setTimeout(() => {
      initTeachMeSkillsTabs();
    }, 100);
  }

  /**
   * Map database categories to TeachMeSkills categories
   */
  function mapCategoryToTeachMeSkills(category) {
    const mappings = {
      'machine-learning': 'python',
      'data-science': 'python',
      'deep-learning': 'python',
      'ai': 'python',
      'web-development': 'frontend',
      'frontend': 'frontend',
      'backend': 'java',
      'full-stack': 'javascript',
      'mobile-development': 'mobile',
      'ios': 'mobile',
      'android': 'mobile',
      'cloud-computing': 'devops',
      'devops': 'devops',
      'testing': 'qa',
      'qa': 'qa',
      'ux-ui': 'design',
      'design': 'design',
      'management': 'management'
    };

    return mappings[category] || 'frontend';
  }

  /**
   * Detect current language from URL
   */
  function detectLanguage() {
    const pathParts = window.location.pathname.split('/');
    const lang = pathParts.find(part => ['en', 'ru', 'he'].includes(part));
    return lang || 'en';
  }

  /**
   * Initialize everything when DOM is ready
   */
  function initialize() {
    console.log('🎨 Initializing TeachMeSkills-style teachers page...');

    // Try to load from database first
    loadTeachersFromDatabase().then(() => {
      // If static content is still there, initialize tabs
      if (document.querySelectorAll('.teacher-card-teachmeskills').length > 0) {
        initTeachMeSkillsTabs();
      }
    });

    // Also initialize with static content immediately
    initTeachMeSkillsTabs();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

  // Expose public API
  window.TeachMeSkillsTabs = {
    showCategory,
    refresh: initTeachMeSkillsTabs,
    loadFromDatabase: loadTeachersFromDatabase
  };

})();