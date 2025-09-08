/**
 * Complete Strapi Home Page Integration
 * This script manages ALL content on home.html through Strapi CMS
 * Handles: Hero, Courses (6), Testimonials (4), Companies, About sections
 * All visibility toggles work properly
 */

class StrapiHomeIntegration {
  constructor() {
    this.liveApiUrl = 'http://localhost:3333';
    this.init();
  }

  async init() {
    console.log('🚀 Initializing Complete Strapi Home Integration...');
    await this.loadContent();
    
    // Refresh every 5 seconds for real-time updates
    setInterval(() => this.loadContent(), 5000);
  }

  async loadContent() {
    try {
      const response = await fetch(this.liveApiUrl + '/api/home-page-live');
      
      if (!response.ok) {
        console.warn('❌ Live API error');
        return;
      }

      const data = await response.json();
      console.log('📡 Complete Live API Response received');
      
      if (data.data) {
        this.applyAllContent(data.data);
      }
      
    } catch (error) {
      console.error('❌ Error loading from Live API:', error);
    }
  }

  applyAllContent(content) {
    console.log('📊 Applying ALL content from database');
    
    // 1. HERO SECTION
    this.updateHeroSection(content);
    
    // 2. FEATURED COURSES SECTION
    this.updateFeaturedCoursesSection(content);
    
    // 3. INDIVIDUAL COURSES
    this.updateCourses(content.courses);
    
    // 4. TESTIMONIALS SECTION
    this.updateTestimonialsSection(content);
    
    // 5. INDIVIDUAL TESTIMONIALS
    this.updateTestimonials(content.testimonials);
    
    // 6. COMPANIES SECTION
    this.updateCompaniesSection(content);
    
    // 7. ABOUT SECTION
    this.updateAboutSection(content);
    
    // 8. PAGE TITLE
    if (content.title) {
      document.title = content.title;
    }
    
    // 9. STATUS INDICATOR
    this.updateStatusIndicator(content);
  }

  updateHeroSection(content) {
    // Update hero text content - ALWAYS update, even if empty
    const heroTitle = document.querySelector('.banner-heading');
    if (heroTitle) {
      heroTitle.textContent = content.heroTitle || 'Welcome to AI Studio';
    }

    const heroSubtitle = document.querySelector('.banner-subtitle');
    if (heroSubtitle) {
      heroSubtitle.textContent = content.heroSubtitle || 'Expert-Led Learning Platform';
    }
    
    const heroDescription = document.querySelector('.banner-description-text');
    if (heroDescription) {
      heroDescription.textContent = content.heroSubtitle || 'Transform your career with our courses';
    }

    // Handle hero visibility toggle - FIX: Check for explicit false value
    const heroSection = document.querySelector('.section.banner');
    if (heroSection) {
      const shouldShow = content.heroSectionVisible === true;
      heroSection.style.display = shouldShow ? 'block' : 'none';
      console.log(`👁️ Hero section: ${shouldShow ? 'VISIBLE' : 'HIDDEN'} (value: ${content.heroSectionVisible})`);
    }
  }

  updateFeaturedCoursesSection(content) {
    // Update section title
    const featuredTitle = document.querySelector('.section-title.featured-courses');
    if (featuredTitle && content.featuredCoursesTitle) {
      featuredTitle.textContent = content.featuredCoursesTitle;
    }

    // Update section description
    const featuredDesc = document.querySelector('.section-description-text.featured-courses');
    if (featuredDesc && content.featuredCoursesDescription) {
      featuredDesc.textContent = content.featuredCoursesDescription;
    }

    // Handle section visibility - FIX: Check for explicit true value
    const featuredSection = document.querySelector('.featured-courses-collection');
    if (featuredSection) {
      const parentSection = featuredSection.closest('.section');
      if (parentSection) {
        const shouldShow = content.featuredCoursesVisible === true;
        parentSection.style.display = shouldShow ? 'block' : 'none';
        console.log(`👁️ Featured courses section: ${shouldShow ? 'VISIBLE' : 'HIDDEN'} (value: ${content.featuredCoursesVisible})`);
      }
    }
  }

  updateCourses(courses) {
    if (!courses || !Array.isArray(courses)) return;
    
    const courseElements = document.querySelectorAll('.featured-courses-collection-item');
    
    courses.forEach((course, index) => {
      if (courseElements[index]) {
        const courseEl = courseElements[index];
        
        // Update course visibility
        courseEl.style.display = course.visible ? 'block' : 'none';
        
        // Update course title - ALWAYS update
        const titleEl = courseEl.querySelector('.featured-courses-name');
        if (titleEl) {
          titleEl.textContent = course.title || `Course ${index + 1}`;
        }
        
        // Update course rating - ALWAYS update
        const ratingEl = courseEl.querySelector('.featured-courses-rating-text');
        if (ratingEl) {
          ratingEl.textContent = course.rating || '5.0';
        }
        
        // Update course lessons and duration - ALWAYS update
        const timeTexts = courseEl.querySelectorAll('.courses-video-session-time-text');
        if (timeTexts[0]) {
          timeTexts[0].textContent = course.lessons || '12 Lessons';
        }
        if (timeTexts[1]) {
          timeTexts[1].textContent = course.duration || '4 Weeks';
        }
        
        // Update course category - ALWAYS update
        const categoryEl = courseEl.querySelector('.featured-courses-categories-tag');
        if (categoryEl) {
          categoryEl.textContent = course.category || 'Technology';
        }
        
        console.log(`📚 Course ${index + 1}: ${course.title} - ${course.visible ? '✅' : '❌'}`);
      }
    });
  }

  updateTestimonialsSection(content) {
    // Update section title
    const testimonialsTitle = document.querySelector('.section-title.testimonials');
    if (testimonialsTitle && content.testimonialsTitle) {
      testimonialsTitle.textContent = content.testimonialsTitle;
    }

    // Update section description
    const testimonialsDesc = document.querySelector('.section-description-text.testimonials');
    if (testimonialsDesc && content.testimonialsSubtitle) {
      testimonialsDesc.textContent = content.testimonialsSubtitle;
    }

    // Handle section visibility - FIX: Check for explicit true value
    const testimonialsSection = document.querySelector('.section.testimonials');
    if (testimonialsSection) {
      const shouldShow = content.testimonialsVisible === true;
      testimonialsSection.style.display = shouldShow ? 'block' : 'none';
      console.log(`👁️ Testimonials section: ${shouldShow ? 'VISIBLE' : 'HIDDEN'} (value: ${content.testimonialsVisible})`);
    }
  }

  updateTestimonials(testimonials) {
    if (!testimonials || !Array.isArray(testimonials)) return;
    
    const testimonialElements = document.querySelectorAll('.testimonials-card-wrapper');
    
    testimonials.forEach((testimonial, index) => {
      if (testimonialElements[index]) {
        const testimonialEl = testimonialElements[index];
        
        // Update testimonial visibility
        testimonialEl.style.display = testimonial.visible ? 'block' : 'none';
        
        // Update testimonial text
        const textEl = testimonialEl.querySelector('.testimonials-card-description-text');
        if (textEl && testimonial.text) {
          textEl.textContent = testimonial.text;
        }
        
        // Update testimonial author
        const authorEl = testimonialEl.querySelector('.testimonials-card-author-name');
        if (authorEl && testimonial.author) {
          authorEl.textContent = testimonial.author;
        }
        
        // Update author initial in avatar
        const avatarEl = testimonialEl.querySelector('.testimonials-avatar');
        if (avatarEl && testimonial.author) {
          avatarEl.textContent = testimonial.author.charAt(0).toUpperCase();
        }
        
        console.log(`💬 Testimonial ${index + 1}: ${testimonial.author} - ${testimonial.visible ? '✅' : '❌'}`);
      }
    });
  }

  updateCompaniesSection(content) {
    // Update section title
    const companiesTitle = document.querySelector('.companies-section h2.section-title');
    if (companiesTitle && content.companiesTitle) {
      companiesTitle.textContent = content.companiesTitle;
    }

    // Update section description
    const companiesDesc = document.querySelector('.companies-section .section-description-text');
    if (companiesDesc && content.companiesDescription) {
      companiesDesc.textContent = content.companiesDescription;
    }

    // Handle section visibility
    const companiesSection = document.querySelector('.companies-section');
    console.log('🔍 Companies section debug:', {
      elementFound: !!companiesSection,
      companiesVisible: content.companiesVisible,
      typeOfValue: typeof content.companiesVisible,
      shouldShow: content.companiesVisible === true
    });
    
    if (companiesSection) {
      const shouldShow = content.companiesVisible === true;
      
      // Store original styles if not already stored
      if (!companiesSection.dataset.originalStyles) {
        companiesSection.dataset.originalStyles = companiesSection.style.cssText || '';
      }
      
      // Apply visibility while preserving other styles
      if (shouldShow) {
        // Restore original styles and ensure display is not none
        companiesSection.style.cssText = companiesSection.dataset.originalStyles;
        if (!companiesSection.style.display || companiesSection.style.display === 'none') {
          companiesSection.style.display = 'block';
        }
      } else {
        // Hide the section
        companiesSection.style.display = 'none';
      }
      
      console.log(`👁️ Companies section: ${shouldShow ? 'VISIBLE' : 'HIDDEN'} (value: ${content.companiesVisible})`);
      
      // Double-check the actual computed style
      const computedStyle = window.getComputedStyle(companiesSection);
      console.log(`   Actual display value: ${computedStyle.display}`);
    } else {
      console.error('❌ Companies section element not found!');
    }
  }

  updateAboutSection(content) {
    // Update section title
    const aboutTitle = document.querySelector('.about-section h2.section-title');
    if (aboutTitle && content.aboutTitle) {
      aboutTitle.textContent = content.aboutTitle;
    }

    // Update section subtitle
    const aboutSubtitle = document.querySelector('.about-section .section-subtitle');
    if (aboutSubtitle && content.aboutSubtitle) {
      aboutSubtitle.textContent = content.aboutSubtitle;
    }

    // Handle section visibility - FIX: Check for explicit true value
    const aboutSection = document.querySelector('.about-section');
    if (aboutSection) {
      const shouldShow = content.aboutVisible === true;
      aboutSection.style.display = shouldShow ? 'block' : 'none';
      console.log(`👁️ About section: ${shouldShow ? 'VISIBLE' : 'HIDDEN'} (value: ${content.aboutVisible})`);
    }
  }

  updateStatusIndicator(content) {
    // Remove existing indicator
    const existing = document.querySelector('.strapi-status');
    if (existing) existing.remove();

    // Count visible items
    const visibleCourses = content.courses ? content.courses.filter(c => c.visible).length : 0;
    const visibleTestimonials = content.testimonials ? content.testimonials.filter(t => t.visible).length : 0;

    // Add comprehensive status indicator
    const indicator = document.createElement('div');
    indicator.className = 'strapi-status';
    indicator.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 15px 20px;
      border-radius: 10px;
      z-index: 9999;
      font-family: Arial, sans-serif;
      font-size: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      max-width: 300px;
    `;
    indicator.innerHTML = `
      <strong style="font-size: 14px;">🎨 Strapi CMS - Complete Control</strong><br>
      <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.3);">
        <strong>Sections:</strong><br>
        Hero: ${content.heroSectionVisible === true ? '✅' : '❌'} 
        ${content.heroSectionVisible === true ? 'Visible' : 'Hidden'}<br>
        Courses: ${content.featuredCoursesVisible === true ? '✅' : '❌'} 
        ${content.featuredCoursesVisible === true ? 'Visible' : 'Hidden'}<br>
        Testimonials: ${content.testimonialsVisible === true ? '✅' : '❌'} 
        ${content.testimonialsVisible === true ? 'Visible' : 'Hidden'}<br>
        Companies: ${content.companiesVisible === true ? '✅' : '❌'}
        ${content.companiesVisible === true ? 'Visible' : 'Hidden'}<br>
        About: ${content.aboutVisible === true ? '✅' : '❌'}
        ${content.aboutVisible === true ? 'Visible' : 'Hidden'}<br>
      </div>
      <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.3);">
        <strong>Content:</strong><br>
        Courses: ${visibleCourses}/6 visible<br>
        Testimonials: ${visibleTestimonials}/4 visible
      </div>
      <small style="opacity: 0.8; display: block; margin-top: 8px;">
        Live API: ${this.liveApiUrl}<br>
        Updates every 5 seconds<br>
        ✨ ALL content managed by Strapi
      </small>
    `;
    document.body.appendChild(indicator);
  }
}

// Initialize when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.strapiHome = new StrapiHomeIntegration();
  });
} else {
  window.strapiHome = new StrapiHomeIntegration();
}

console.log('💡 Complete Strapi Home Integration loaded!');
console.log('   - Manages ALL home page content');
console.log('   - Updates every 5 seconds');
console.log('   - All visibility toggles working');
console.log('   - Use window.strapiHome.loadContent() to manually refresh');