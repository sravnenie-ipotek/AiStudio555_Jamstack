/**
 * Section Renderer for TeachMeSkills-style Layout
 * 
 * This file provides functions to dynamically render page sections
 * based on the scraped structure from TeachMeSkills.by
 */

// Section type definitions based on crawl results
const SECTION_TYPES = {
  HERO_BANNER: 'hero_banner',
  COURSE_GRID: 'course_grid',
  FEATURES: 'features_grid',
  STATISTICS: 'statistics',
  TESTIMONIALS: 'testimonials',
  INSTRUCTORS: 'instructors',
  PROCESS_STEPS: 'process_steps',
  CTA: 'cta',
  FAQ: 'faq',
  PROMO_BANNER: 'promo_banner',
  PARTNERS_LOGOS: 'partners_logos',
  FOOTER: 'footer'
};

// Main section renderer
class SectionRenderer {
  constructor(strapiUrl = 'http://localhost:3000') {
    this.strapiUrl = strapiUrl;
    this.apiToken = '6ba76f584778637fd308f48aac27461c08af957ef205a3281c444c32859f229d923a1984ec93b9564b26db3c10e68f2ccca8983e27ec9b42483e3b8f6faca7a2a52f9b586357c4f94ad37792a7b0f271c164f661e03e4af725cf24708fd5967db6d2431c7afb9be47082538f62ab7b49cad7c68cd290f0c429b3706fbb8df2dc';
  }

  // Render a complete page based on section configuration
  async renderPage(sectionConfig) {
    const sections = [];
    
    for (const section of sectionConfig) {
      const html = await this.renderSection(section.type, section.props || {});
      sections.push(html);
    }
    
    return sections.join('\n');
  }

  // Main section rendering dispatcher
  async renderSection(type, props = {}) {
    switch(type) {
      case SECTION_TYPES.HERO_BANNER:
        return this.renderHeroBanner(props);
      
      case SECTION_TYPES.COURSE_GRID:
        return await this.renderCourseGrid(props);
      
      case SECTION_TYPES.FEATURES:
        return this.renderFeatures(props);
      
      case SECTION_TYPES.STATISTICS:
        return this.renderStatistics(props);
      
      case SECTION_TYPES.TESTIMONIALS:
        return await this.renderTestimonials(props);
      
      case SECTION_TYPES.INSTRUCTORS:
        return await this.renderInstructors(props);
      
      case SECTION_TYPES.PROCESS_STEPS:
        return this.renderProcessSteps(props);
      
      case SECTION_TYPES.CTA:
        return this.renderCTA(props);
      
      case SECTION_TYPES.FAQ:
        return this.renderFAQ(props);
      
      case SECTION_TYPES.PROMO_BANNER:
        return this.renderPromoBanner(props);
      
      case SECTION_TYPES.PARTNERS_LOGOS:
        return this.renderPartners(props);
      
      case SECTION_TYPES.FOOTER:
        return this.renderFooter(props);
      
      default:
        return `<!-- Unknown section type: ${type} -->`;
    }
  }

  // Individual section renderers using Webflow patterns
  
  renderHeroBanner(props) {
    return `
      <section class="section hero-enhanced">
        <div class="container">
          <div data-w-id="hero-content-${Date.now()}" style="opacity:0" class="preview-banner-typography">
            <div class="section-subtitle-wrapper center-align">
              <div class="banner-subtitle-line left"></div>
              <div class="section-subtitle">Expert-Led Learning</div>
              <div class="banner-subtitle-line right"></div>
            </div>
            <div class="preview-banner-heading-description">
              <h1 class="preview-banner-heading">${props.title || 'Master IT Skills Online'}</h1>
              <p class="preview-banner-description">${props.subtitle || 'Start your tech career with industry experts and build real-world projects'}</p>
            </div>
            <div class="preview-banner-button-wrapper">
              <a href="/courses.html" data-w-id="hero-btn-primary-${Date.now()}" class="primary-button course-cta w-inline-block">
                <div class="primary-button-text-wrap">
                  <div style="transform:translate3d(0, 0%, 0)" class="primary-button-text-block">Browse Courses</div>
                  <div style="transform:translate3d(0, 250%, 0)" class="primary-button-text-block is-text-absolute">Browse Courses</div>
                </div>
              </a>
              <a href="/contact-us.html" data-w-id="hero-btn-secondary-${Date.now()}" class="primary-button secondary w-inline-block">
                <div class="primary-button-text-wrap">
                  <div style="transform:translate3d(0, 0%, 0)" class="primary-button-text-block">Free Consultation</div>
                  <div style="transform:translate3d(0, 250%, 0)" class="primary-button-text-block is-text-absolute">Free Consultation</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  async renderCourseGrid(props) {
    const courses = await this.fetchCourses(props.limit || 8, props.featured);
    
    return `
      <section class="section course-showcase">
        <div class="container">
          <div data-w-id="course-grid-title-${Date.now()}" style="opacity:0" class="section-title-wrapper align-center">
            <div class="section-subtitle-wrapper center-align">
              <div class="banner-subtitle-line left"></div>
              <div class="section-subtitle">Featured Courses</div>
              <div class="banner-subtitle-line right"></div>
            </div>
            <h2 class="section-title featured-courses">${props.title || 'Enhance Your Skills With Curated Courses'}</h2>
            <p class="section-description-text featured-courses">Dive into our expertly curated selection of courses, designed to equip you with the skills needed to excel in your career.</p>
          </div>
          <div data-w-id="course-grid-content-${Date.now()}" style="opacity:0" class="featured-courses-content">
            <div class="w-layout-grid featured-courses-collection-list">
              ${courses.map((course, index) => `
                <div data-w-id="course-card-${index}-${Date.now()}" style="background-color:#04193f" class="featured-courses-single course-card-enhanced">
                  <a href="/detail_courses.html?id=${course.id}" class="featured-courses-image-link w-inline-block">
                    <img loading="lazy" src="${course.thumbnail || '/images/course-placeholder.jpg'}" alt="${course.title}" class="featured-courses-image">
                  </a>
                  <div class="featured-courses-typography">
                    <div class="featured-courses-name-wrap">
                      <a href="/detail_courses.html?id=${course.id}" class="featured-courses-name">${course.title}</a>
                      <div class="featured-courses-rating">
                        <div class="featured-courses-rating-icon-wrapper">
                          <img loading="lazy" src="images/Featured-Courses-Rating-Icon.svg" alt="" class="featured-courses-rating-icon">
                          <img loading="lazy" src="images/Featured-Courses-Rating-Icon.svg" alt="" class="featured-courses-rating-icon">
                          <img loading="lazy" src="images/Featured-Courses-Rating-Icon.svg" alt="" class="featured-courses-rating-icon">
                          <img loading="lazy" src="images/Featured-Courses-Rating-Icon.svg" alt="" class="featured-courses-rating-icon">
                          <img loading="lazy" src="images/Featured-Courses-Rating-Icon.svg" alt="" class="featured-courses-rating-icon">
                        </div>
                        <div class="featured-courses-rating-text">${course.rating || '4.8'} (${course.reviews || '120'} reviews)</div>
                      </div>
                      <div class="courses-video-session-time-wrap">
                        <div class="courses-video-session-time">
                          <img loading="lazy" src="images/Courses-Video-Session--Time-Icon.svg" alt="" class="courses-video-session-time-icon">
                          <div class="courses-video-session-time-text">${course.duration || '8'} weeks</div>
                        </div>
                        <div class="courses-video-session-time">
                          <img loading="lazy" src="images/Courses-Video-Session--Time-Icon2.svg" alt="" class="courses-video-session-time-icon">
                          <div class="courses-video-session-time-text">${course.lessons || '24'} lessons</div>
                        </div>
                      </div>
                      <div class="featured-courses-button-wrapper">
                        <a href="/detail_courses.html?id=${course.id}" data-w-id="course-btn-${index}-${Date.now()}" style="background-color:rgba(255,255,255,0);color:rgb(255,255,255)" class="primary-button secondary w-inline-block">
                          <div class="primary-button-text-wrap">
                            <div style="transform:translate3d(0, 0%, 0)" class="primary-button-text-block">Course Details</div>
                            <div style="transform:translate3d(0, 250%, 0)" class="primary-button-text-block is-text-absolute">Course Details</div>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div style="background-color:${this.getCategoryColor(course.category)};color:rgb(255,255,255)" class="featured-courses-categories-tag course-category-tag ${(course.category || '').toLowerCase()}">${course.category || 'Programming'}</div>
                </div>
              `).join('')}
            </div>
            <div class="text-center" style="margin-top: 48px;">
              <a href="/courses.html" data-w-id="view-all-courses-${Date.now()}" class="primary-button w-inline-block">
                <div class="primary-button-text-wrap">
                  <div style="transform:translate3d(0, 0%, 0)" class="primary-button-text-block">View All Courses</div>
                  <div style="transform:translate3d(0, 250%, 0)" class="primary-button-text-block is-text-absolute">View All Courses</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  renderFeatures(props) {
    const features = props.features || [
      { icon: '🎓', title: 'Expert Instructors', description: 'Learn from industry professionals' },
      { icon: '💼', title: 'Career Support', description: 'Job placement assistance included' },
      { icon: '🚀', title: 'Practical Projects', description: 'Build real-world applications' },
      { icon: '⏰', title: 'Flexible Schedule', description: 'Learn at your own pace' }
    ];
    
    return `
      <section class="features-section">
        <div class="container">
          <h2>Why Choose Our Platform</h2>
          <div class="features-grid">
            ${features.map(feature => `
              <div class="feature-card">
                <div class="feature-icon">${feature.icon}</div>
                <h3>${feature.title}</h3>
                <p>${feature.description}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }

  renderStatistics(props) {
    const stats = props.stats || [
      { number: '5000+', label: 'Students' },
      { number: '50+', label: 'Courses' },
      { number: '85%', label: 'Employment Rate' },
      { number: '100+', label: 'Partner Companies' }
    ];
    
    return `
      <section class="statistics-section">
        <div class="container">
          <div class="stats-grid">
            ${stats.map(stat => `
              <div class="stat-item">
                <div class="stat-number">${stat.number}</div>
                <div class="stat-label">${stat.label}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }

  async renderTestimonials(props) {
    const testimonials = await this.fetchTestimonials(props.limit || 3);
    
    return `
      <section class="testimonials-section">
        <div class="container">
          <h2>Student Success Stories</h2>
          <div class="testimonials-grid">
            ${testimonials.map(testimonial => `
              <div class="testimonial-card">
                <div class="testimonial-content">
                  <p>"${testimonial.review}"</p>
                </div>
                <div class="testimonial-author">
                  <strong>${testimonial.student_name}</strong>
                  <span>${testimonial.course_name}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }

  async renderInstructors(props) {
    const instructors = await this.fetchInstructors(props.limit || 4);
    
    return `
      <section class="section instructor-showcase">
        <div class="container">
          <div data-w-id="instructor-title-${Date.now()}" style="opacity:0" class="section-title-wrapper align-center">
            <div class="section-subtitle-wrapper center-align">
              <div class="banner-subtitle-line left"></div>
              <div class="section-subtitle">Expert Instructors</div>
              <div class="banner-subtitle-line right"></div>
            </div>
            <h2 class="section-title featured-courses">Learn From Industry Professionals</h2>
            <p class="section-description-text featured-courses">Our instructors bring years of real-world experience and are passionate about sharing their knowledge with the next generation of tech professionals.</p>
          </div>
          <div data-w-id="instructor-grid-${Date.now()}" style="opacity:0" class="instructor-grid-enhanced animate-stagger">
            ${instructors.map((instructor, index) => `
              <div class="instructor-card-enhanced">
                <div class="instructor-avatar-enhanced">
                  <img src="${instructor.photo || '/images/instructor-placeholder.jpg'}" alt="${instructor.name}">
                </div>
                <h3 class="instructor-name">${instructor.name}</h3>
                <p class="instructor-title">${instructor.specialty}</p>
                <p class="instructor-experience">${instructor.experience_years} years experience</p>
                <div class="instructor-social">
                  <a href="#" class="instructor-social-link">💼</a>
                  <a href="#" class="instructor-social-link">🐦</a>
                </div>
              </div>
            `).join('')}
          </div>
          <div class="text-center" style="margin-top: 48px;">
            <a href="/teachers.html" data-w-id="meet-instructors-${Date.now()}" class="primary-button instructor-cta w-inline-block">
              <div class="primary-button-text-wrap">
                <div style="transform:translate3d(0, 0%, 0)" class="primary-button-text-block">Meet All Instructors</div>
                <div style="transform:translate3d(0, 250%, 0)" class="primary-button-text-block is-text-absolute">Meet All Instructors</div>
              </div>
            </a>
          </div>
        </div>
      </section>
    `;
  }

  renderProcessSteps(props) {
    const steps = props.steps || [
      { number: '1', title: 'Choose Your Path', description: 'Select from our courses' },
      { number: '2', title: 'Learn & Practice', description: 'Study with expert guidance' },
      { number: '3', title: 'Build Projects', description: 'Create portfolio pieces' },
      { number: '4', title: 'Get Hired', description: 'Land your dream job' }
    ];
    
    return `
      <section class="process-section">
        <div class="container">
          <h2>Your Journey to Success</h2>
          <div class="process-steps">
            ${steps.map(step => `
              <div class="process-step">
                <div class="step-number">${step.number}</div>
                <h3>${step.title}</h3>
                <p>${step.description}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }

  renderCTA(props) {
    return `
      <section class="cta-section">
        <div class="container">
          <div class="cta-content">
            <h2>${props.title || 'Ready to Start Your IT Career?'}</h2>
            <p>${props.subtitle || 'Join thousands of successful graduates'}</p>
            <div class="cta-buttons">
              <a href="/courses" class="btn btn-primary btn-lg">Get Started</a>
              <a href="/contact" class="btn btn-outline btn-lg">Contact Us</a>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  renderFAQ(props) {
    const faqs = props.faqs || [
      { question: 'What prerequisites do I need?', answer: 'Most courses start from basics.' },
      { question: 'How long are the courses?', answer: 'Courses range from 8-16 weeks.' },
      { question: 'Is job placement guaranteed?', answer: 'We provide career support and assistance.' }
    ];
    
    return `
      <section class="faq-section">
        <div class="container">
          <h2>Frequently Asked Questions</h2>
          <div class="faq-list">
            ${faqs.map((faq, index) => `
              <div class="faq-item">
                <button class="faq-question" onclick="toggleFAQ(${index})">
                  ${faq.question}
                  <span class="faq-icon">+</span>
                </button>
                <div class="faq-answer" id="faq-${index}">
                  <p>${faq.answer}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }

  renderPromoBanner(props) {
    return `
      <section class="promo-banner">
        <div class="container">
          <div class="promo-content">
            <h3>${props.title || 'Limited Time Offer!'}</h3>
            <p>${props.text || 'Get 20% off on all courses this month'}</p>
            <a href="${props.link || '/courses'}" class="btn btn-promo">Claim Offer</a>
          </div>
        </div>
      </section>
    `;
  }

  renderPartners(props) {
    const partners = props.partners || [
      'Company 1', 'Company 2', 'Company 3', 'Company 4'
    ];
    
    return `
      <section class="partners-section">
        <div class="container">
          <h2>Our Partners</h2>
          <div class="partners-grid">
            ${partners.map(partner => `
              <div class="partner-logo">
                <img src="/images/partners/${partner.toLowerCase().replace(' ', '-')}.png" 
                     alt="${partner}" 
                     onerror="this.src='/images/partner-placeholder.png'">
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }

  renderFooter(props) {
    return `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-column">
              <h4>Courses</h4>
              <ul>
                <li><a href="/courses">All Courses</a></li>
                <li><a href="/courses?category=frontend">Frontend</a></li>
                <li><a href="/courses?category=backend">Backend</a></li>
                <li><a href="/courses?category=mobile">Mobile</a></li>
              </ul>
            </div>
            <div class="footer-column">
              <h4>Company</h4>
              <ul>
                <li><a href="/about">About Us</a></li>
                <li><a href="/teachers">Our Team</a></li>
                <li><a href="/career-center">Career Center</a></li>
                <li><a href="/blog">Blog</a></li>
              </ul>
            </div>
            <div class="footer-column">
              <h4>Support</h4>
              <ul>
                <li><a href="/contact">Contact</a></li>
                <li><a href="/faq">FAQ</a></li>
                <li><a href="/terms">Terms</a></li>
                <li><a href="/privacy">Privacy</a></li>
              </ul>
            </div>
            <div class="footer-column">
              <h4>Connect</h4>
              <div class="social-links">
                <a href="#" aria-label="Facebook">📘</a>
                <a href="#" aria-label="Twitter">🐦</a>
                <a href="#" aria-label="LinkedIn">💼</a>
                <a href="#" aria-label="YouTube">📺</a>
              </div>
            </div>
          </div>
          <div class="footer-bottom">
            <p>&copy; 2024 AI Studio E-Learning. All rights reserved.</p>
          </div>
        </div>
      </footer>
    `;
  }

  // Helper methods - Using Zohacous Style Guide Colors
  getCategoryColor(category) {
    const colors = {
      'frontend': '#0080ff',
      'backend': '#050f2c',
      'mobile': '#04193f',
      'ai': '#ffd659',
      'design': '#05051a',
      'programming': '#0080ff'
    };
    return colors[(category || '').toLowerCase()] || '#0080ff';
  }

  // API fetch methods
  async fetchCourses(limit = 8, featured = false) {
    try {
      const query = featured ? '?filters[featured][$eq]=true&' : '?';
      const response = await fetch(`${this.strapiUrl}/api/courses${query}pagination[limit]=${limit}`, {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`
        }
      });
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching courses:', error);
      // Return mock data for development
      return Array(limit).fill(null).map((_, i) => ({
        id: i + 1,
        title: `Course ${i + 1}`,
        category: 'Programming',
        duration: 8,
        price: 499
      }));
    }
  }

  async fetchTestimonials(limit = 3) {
    try {
      const response = await fetch(`${this.strapiUrl}/api/testimonials?pagination[limit]=${limit}`, {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`
        }
      });
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      // Return mock data
      return [
        { student_name: 'John Doe', course_name: 'Web Development', review: 'Excellent course!' },
        { student_name: 'Jane Smith', course_name: 'Data Science', review: 'Life-changing experience!' },
        { student_name: 'Mike Johnson', course_name: 'Mobile Dev', review: 'Got hired immediately!' }
      ];
    }
  }

  async fetchInstructors(limit = 4) {
    try {
      const response = await fetch(`${this.strapiUrl}/api/instructors?pagination[limit]=${limit}`, {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`
        }
      });
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching instructors:', error);
      // Return mock data
      return Array(limit).fill(null).map((_, i) => ({
        name: `Instructor ${i + 1}`,
        specialty: 'Full Stack Development',
        experience_years: 5 + i
      }));
    }
  }
}

// Homepage configuration based on TeachMeSkills.by
const HOMEPAGE_SECTIONS = [
  { type: 'hero_banner', props: { title: 'Learn IT Skills From Industry Experts' } },
  { type: 'course_grid', props: { featured: true, limit: 8 } },
  { type: 'features_grid', props: {} },
  { type: 'statistics', props: {} },
  { type: 'process_steps', props: {} },
  { type: 'testimonials', props: { limit: 3 } },
  { type: 'instructors', props: { limit: 4 } },
  { type: 'cta', props: {} },
  { type: 'footer', props: {} }
];

// Courses page configuration
const COURSES_PAGE_SECTIONS = [
  { type: 'hero_banner', props: { title: 'Browse All Courses', subtitle: 'Find your perfect learning path' } },
  { type: 'course_grid', props: { limit: 12 } },
  { type: 'cta', props: { title: 'Need Help Choosing?' } },
  { type: 'footer', props: {} }
];

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SectionRenderer, HOMEPAGE_SECTIONS, COURSES_PAGE_SECTIONS };
}

// Initialize on page load if in browser
if (typeof window !== 'undefined') {
  window.SectionRenderer = SectionRenderer;
  window.HOMEPAGE_SECTIONS = HOMEPAGE_SECTIONS;
  window.COURSES_PAGE_SECTIONS = COURSES_PAGE_SECTIONS;
  
  // Auto-render if element exists
  document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('dynamic-sections');
    if (container) {
      const renderer = new SectionRenderer();
      const pageSections = window.PAGE_SECTIONS || HOMEPAGE_SECTIONS;
      const html = await renderer.renderPage(pageSections);
      container.innerHTML = html;
    }
  });
}