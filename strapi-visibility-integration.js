/**
 * Strapi Home Page Visibility Integration
 * 
 * This script connects your home.html frontend with Strapi CMS
 * to control section visibility based on the toggles you set in the admin panel
 */

class StrapiVisibilityIntegration {
  constructor() {
    this.strapiUrl = 'http://localhost:1337';
    this.homePageEndpoint = '/api/home-page?populate=*';
    this.sections = {
      hero: '.section.banner',
      featuredCourses: '.section.featured-courses', 
      practiceFocus: '.section.practice-focus',
      onlineLearning: '.section.online-learning',
      alumniReviews: '.section.alumni-reviews',
      faqSection: '.section.faq-section'
    };
    
    this.init();
  }

  async init() {
    console.log('🚀 Initializing Strapi Visibility Integration...');
    
    // Load visibility settings from Strapi
    await this.loadVisibilitySettings();
    
    // Set up real-time updates (optional)
    this.setupRealtimeUpdates();
  }

  async loadVisibilitySettings() {
    try {
      const response = await fetch(this.strapiUrl + this.homePageEndpoint);
      const data = await response.json();

      if (data.error && data.error.status === 404) {
        console.log('⚠️ No home page content found in Strapi. All sections will be visible by default.');
        console.log('📝 To control visibility:');
        console.log('   1. Go to Strapi Admin → Content Manager → Home Page');
        console.log('   2. Create/edit the home page entry');
        console.log('   3. Toggle visibility for each section');
        console.log('   4. Save and publish');
        return;
      }

      if (data.data && data.data.attributes) {
        this.applyVisibilitySettings(data.data.attributes);
        console.log('✅ Visibility settings applied successfully!');
      }
      
    } catch (error) {
      console.error('❌ Error loading visibility settings:', error);
      console.log('💡 Make sure:');
      console.log('   1. Strapi is running on http://localhost:1337');
      console.log('   2. Home Page API permissions are set to public');
      console.log('   3. You have created content in the Home Page single type');
    }
  }

  applyVisibilitySettings(settings) {
    console.log('📊 Applying visibility settings:', settings);
    
    // Hero Section
    if (settings.heroSectionVisible === false) {
      this.hideSection(this.sections.hero);
      console.log('   ❌ Hero section: Hidden');
    } else {
      this.showSection(this.sections.hero);
      console.log('   ✅ Hero section: Visible');
    }
    
    // Featured Courses Section
    if (settings.featuredCoursesVisible === false) {
      this.hideSection(this.sections.featuredCourses);
      console.log('   ❌ Featured Courses: Hidden');
    } else {
      this.showSection(this.sections.featuredCourses);
      console.log('   ✅ Featured Courses: Visible');
    }
    
    // Practice Focus Section
    if (settings.practiceFocusVisible === false) {
      this.hideSection(this.sections.practiceFocus);
      console.log('   ❌ Practice Focus: Hidden');
    } else {
      this.showSection(this.sections.practiceFocus);
      console.log('   ✅ Practice Focus: Visible');
    }
    
    // Online Learning Section
    if (settings.onlineLearningVisible === false) {
      this.hideSection(this.sections.onlineLearning);
      console.log('   ❌ Online Learning: Hidden');
    } else {
      this.showSection(this.sections.onlineLearning);
      console.log('   ✅ Online Learning: Visible');
    }
    
    // Alumni Reviews Section
    if (settings.alumniReviewsVisible === false) {
      this.hideSection(this.sections.alumniReviews);
      console.log('   ❌ Alumni Reviews: Hidden');
    } else {
      this.showSection(this.sections.alumniReviews);
      console.log('   ✅ Alumni Reviews: Visible');
    }
    
    // FAQ Section
    if (settings.faqSectionVisible === false) {
      this.hideSection(this.sections.faqSection);
      console.log('   ❌ FAQ Section: Hidden');
    } else {
      this.showSection(this.sections.faqSection);
      console.log('   ✅ FAQ Section: Visible');
    }
  }

  hideSection(selector) {
    const section = document.querySelector(selector);
    if (section) {
      section.style.display = 'none';
      section.setAttribute('data-strapi-hidden', 'true');
    }
  }

  showSection(selector) {
    const section = document.querySelector(selector);
    if (section) {
      section.style.display = '';
      section.removeAttribute('data-strapi-hidden');
    }
  }

  setupRealtimeUpdates() {
    // Poll for updates every 30 seconds (optional)
    // In production, you might want to use WebSockets instead
    if (this.enableRealtime) {
      setInterval(() => {
        console.log('🔄 Checking for visibility updates...');
        this.loadVisibilitySettings();
      }, 30000);
    }
  }

  // Manual refresh method
  async refresh() {
    console.log('🔄 Refreshing visibility settings...');
    await this.loadVisibilitySettings();
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.strapiVisibility = new StrapiVisibilityIntegration();
  });
} else {
  window.strapiVisibility = new StrapiVisibilityIntegration();
}

// Add manual controls to console
console.log('💡 Strapi Visibility Controls:');
console.log('   window.strapiVisibility.refresh() - Refresh visibility settings');
console.log('   window.strapiVisibility.hideSection(".section.banner") - Manually hide a section');
console.log('   window.strapiVisibility.showSection(".section.banner") - Manually show a section');