/**
 * Teachers Database Loader
 * Direct integration to load teachers from database
 * This is a targeted fix for the teachers page
 */

(function() {
  'use strict';
      // Make container visible (remove opacity:0)
      console.log('👁️ Making container visible...');
      container.style.opacity = '1';
      container.style.visibility = 'visible';
      container.style.display = 'block';
      
      // Extra visibility debugging
      console.log('👁️ Container visibility after update:');
      console.log('- opacity:', container.style.opacity);
      console.log('- visibility:', container.style.visibility);
      console.log('- display:', container.style.display);
      console.log('- innerHTML length:', container.innerHTML.length);
      console.log('- children count:', container.children.length);

      // Trigger any Webflow animations
      if (window.Webflow) {
        window.Webflow.ready();
        window.Webflow.require('ix2').init();
      }

      console.log('🎉 Teachers loaded successfully!');ole.log('📚 Teachers DB Loader: Initializing...');

  // Configuration
  const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : 'https://aistudio555jamstack-production.up.railway.app/api';

  // Detect current language from URL
  function detectLanguage() {
    const pathParts = window.location.pathname.split('/');
    const lang = pathParts.find(part => ['en', 'ru', 'he'].includes(part));
    return lang || 'en';
  }

  // Create teacher card HTML
  function createTeacherCard(teacher) {
    const attrs = teacher.attributes || teacher;
    const category = attrs.category || 'all';
    const specialties = attrs.specialties ? attrs.specialties.split(',').map(s => s.trim()) : [];
    const currentLang = detectLanguage();

    // Category labels in Hebrew
    const categoryLabels = {
      'machine-learning': 'למידת מכונה',
      'deep-learning': 'למידה עמוקה',
      'data-science': 'מדע הנתונים',
      'python': 'פיתוח Python',
      'web-development': 'פיתוח אתרים',
      'cloud-computing': 'מחשוב ענן',
      'devops': 'DevOps',
      'business-intelligence': 'Business Intelligence',
      'product-management': 'ניהול מוצר',
      'ux-ui-design': 'עיצוב UX/UI',
      'all': 'כללי'
    };

    // For Hebrew page with enhanced design
    if (document.querySelector('.instructor-grid-enhanced')) {
      return `
        <div class="instructor-card-enhanced" data-category="${category}">
          <div class="instructor-category-badge">${categoryLabels[category] || attrs.role || 'מומחה'}</div>
          <div class="instructor-avatar-enhanced">
            <img src="${attrs.image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face'}"
                 alt="${attrs.name}"
                 onerror="this.src='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face'">
          </div>
          <h3 class="instructor-name">${attrs.name}</h3>
          <p class="instructor-title">${attrs.title || attrs.role || 'מומחה בתחום הטכנולוגיה'}</p>
          <p class="instructor-experience">${attrs.experience || 'ניסיון מקצועי רב'}</p>
          <p class="instructor-bio">${attrs.bio || 'מומחה מקצועי עם ניסיון עשיר בתחום הטכנולוגיה והחדשנות'}</p>
          <div class="instructor-specialties">
            ${specialties.length > 0 ? specialties.map(s => `<span class="specialty-tag">${s}</span>`).join('') :
              '<span class="specialty-tag">AI/ML</span><span class="specialty-tag">Python</span><span class="specialty-tag">Data Science</span>'}
          </div>
          <div class="instructor-social">
            ${attrs.linkedin_url ? `<a href="${attrs.linkedin_url}" target="_blank" class="instructor-social-link">💼</a>` : '<a href="#" class="instructor-social-link">💼</a>'}
            ${attrs.twitter_url ? `<a href="${attrs.twitter_url}" target="_blank" class="instructor-social-link">🐦</a>` : '<a href="#" class="instructor-social-link">🐦</a>'}
          </div>
        </div>
      `;
    }

    // For standard teacher grid
    return `
      <div class="teacher-item w-dyn-item">
        <div class="teacher-card">
          <div class="teacher-image">
            <img src="${attrs.image_url || '/images/teacher-placeholder.jpg'}"
                 alt="${attrs.name}"
                 class="teacher-img" />
          </div>
          <div class="teacher-info">
            <h3 class="teacher-name">${attrs.name}</h3>
            <p class="teacher-title">${attrs.title || ''}</p>
            <p class="teacher-bio">${attrs.bio || ''}</p>
          </div>
        </div>
      </div>
    `;
  }

  // Setup category filtering
  function setupCategoryFiltering() {
    const filterButtons = document.querySelectorAll('.category-filter-btn');

    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Update active state
        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        // Get filter value
        const filterValue = this.getAttribute('data-filter');

        // Filter teacher cards
        const cards = document.querySelectorAll('.instructor-card-enhanced');
        cards.forEach(card => {
          if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
            card.style.display = 'block';
            // Add animation
            card.style.animation = 'fadeIn 0.5s ease';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // Load teachers from API
  async function loadTeachers() {
    const currentLang = detectLanguage();
    console.log(`📚 Loading teachers for language: ${currentLang}`);

    try {
      // Find the container
      const container = document.querySelector('.instructor-grid-enhanced, #instructors-grid, .teachers-grid');

      if (!container) {
        console.error('❌ No teacher container found on page');
        return;
      }

      console.log('✅ Found container:', container.className || container.id);

      // Fetch teachers from API
      const response = await fetch(`${API_BASE}/teachers?locale=${currentLang}`);

      if (!response.ok) {
        throw new Error(`API responded with ${response.status}`);
      }

      const data = await response.json();
      console.log(`📚 Received ${data.data?.length || 0} teachers from API`);

      if (!data.data || data.data.length === 0) {
        console.warn('⚠️ No teachers returned from API');
        return;
      }

      // Clear existing content
      console.log('🗑️ Clearing existing content...');
      container.innerHTML = '';

      // Add new teacher cards
      console.log('➕ Adding teacher cards...');
      data.data.forEach((teacher, index) => {
        const cardHTML = createTeacherCard(teacher);
        container.insertAdjacentHTML('beforeend', cardHTML);
        console.log(`✅ Added teacher ${index + 1}: ${teacher.attributes.name}`);
      });

      // Setup category filtering after loading
      setupCategoryFiltering();

      // Make container visible after content loads
      container.style.opacity = '1';
      container.style.visibility = 'visible';

      // Trigger any Webflow animations
      if (window.Webflow) {
        window.Webflow.ready();
        window.Webflow.require('ix2').init();
      }

      console.log('🎉 Teachers loaded successfully and container made visible!');

      // Check if content is in Hebrew
      const hasHebrew = /[\u0590-\u05FF]/.test(container.textContent);
      console.log(`📝 Content language check - Has Hebrew: ${hasHebrew}`);

    } catch (error) {
      console.error('❌ Failed to load teachers:', error);

      // Detailed error logging
      if (error.message.includes('fetch')) {
        console.error('Network error - check if API server is running');
      }
    }
  }

  // Initialize when DOM is ready
  function initialize() {
    // Check if we're on a teachers page
    const isTeachersPage = window.location.pathname.includes('teachers');

    if (!isTeachersPage) {
      console.log('📚 Not a teachers page, skipping initialization');
      return;
    }

    console.log('📚 Teachers page detected, loading content...');

    // Load teachers immediately
    loadTeachers();

    // Also expose function globally for manual testing
    window.loadTeachersFromDB = loadTeachers;
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    // DOM already loaded
    initialize();
  }

  // Also try after a delay to ensure everything is ready
  setTimeout(initialize, 1000);

})();