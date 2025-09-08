/**
 * MASTER STRAPI INTEGRATION SYSTEM
 * Complete CMS control for ALL website pages
 * 
 * Pages managed:
 * - Home (✅ Done)
 * - Courses
 * - About Us
 * - Contact Us
 * - Blog & Blog Details
 * - Pricing
 * - Teachers
 * - Career Center
 * - Authentication pages
 * - Checkout/Payment pages
 */

class StrapiMasterIntegration {
  constructor() {
    this.apiUrl = 'http://localhost:3334/api'; // Use Live API (following your working architecture)
    this.liveApiUrl = 'http://localhost:3334/api';
    this.currentPage = this.detectCurrentPage();
    this.refreshInterval = 5000; // 5 seconds
    
    console.log(`🚀 Strapi Master Integration - Page: ${this.currentPage} (Using Live API)`);
    this.init();
  }

  detectCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop().replace('.html', '');
    return filename || 'index';
  }

  async init() {
    // Route to appropriate page handler
    switch(this.currentPage) {
      case 'home':
      case 'index':
        await this.initHomePage();
        break;
      case 'courses':
        await this.initCoursesPage();
        break;
      case 'about-us':
        await this.initAboutPage();
        break;
      case 'contact-us':
        await this.initContactPage();
        break;
      case 'blog':
        await this.initBlogPage();
        break;
      case 'detail_blog':
        await this.initBlogDetailPage();
        break;
      case 'pricing':
        await this.initPricingPage();
        break;
      case 'teachers':
        await this.initTeachersPage();
        break;
      case 'career-center':
        await this.initCareerCenterPage();
        break;
      case 'detail_courses':
        await this.initCourseDetailPage();
        break;
      default:
        console.log(`📄 Page "${this.currentPage}" - No Strapi integration yet`);
    }

    // Add status indicator
    this.addStatusIndicator();
  }

  // ============== COURSES PAGE ==============
  async initCoursesPage() {
    console.log('📚 Initializing Courses Page Integration (Live API)');
    
    const loadCourses = async () => {
      try {
        const response = await fetch(`${this.apiUrl}/courses`);
        const data = await response.json();
        
        if (data.data) {
          this.renderCourses(data.data);
        }
      } catch (error) {
        console.error('Error loading courses:', error);
      }
    };

    await loadCourses();
    setInterval(loadCourses, this.refreshInterval);
  }

  renderCourses(courses) {
    // Find ALL course collection lists (multiple tabs)
    const coursesGrids = document.querySelectorAll('.featured-courses-collection-list');
    if (coursesGrids.length === 0) {
      console.error('❌ No .featured-courses-collection-list found');
      return;
    }

    // Hide all "No items found" messages
    const emptyMessages = document.querySelectorAll('.w-dyn-empty');
    emptyMessages.forEach(msg => msg.style.display = 'none');

    // Populate all tabs with courses
    coursesGrids.forEach((coursesGrid, index) => {
      // Clear existing courses
      coursesGrid.innerHTML = '';

      // Add courses to this tab
      courses.forEach(course => {
        const courseCard = this.createCourseCard(course);
        coursesGrid.appendChild(courseCard);
      });
    });

    console.log(`✅ Rendered ${courses.length} courses in ${coursesGrids.length} tabs`);
  }

  createCourseCard(course) {
    const div = document.createElement('div');
    div.className = 'featured-courses-collection-item';
    div.innerHTML = `
      <a href="/detail_courses.html?id=${course.id}" class="featured-courses-card-wrapper">
        <div class="featured-courses-card-image-wrapper">
          <img src="${course.attributes.image?.data?.attributes?.url || '/images/Demo-Image1.jpg'}" 
               alt="${course.attributes.title}" class="featured-courses-card-image">
          <div class="featured-courses-categories-tag">${course.attributes.category || 'Technology'}</div>
        </div>
        <div class="featured-courses-card-content-wrapper">
          <h3 class="featured-courses-name">${course.attributes.title}</h3>
          <div class="featured-courses-price">$${course.attributes.price || '99'}</div>
          <div class="featured-courses-rating">
            <span class="featured-courses-rating-text">${course.attributes.rating || '5.0'}</span>
            <div class="featured-courses-rating-stars">★★★★★</div>
          </div>
          <div class="courses-video-session-wrapper">
            <span class="courses-video-session-time-text">${course.attributes.lessons || '12'} Lessons</span>
            <span class="courses-video-session-time-text">${course.attributes.duration || '4 Weeks'}</span>
          </div>
        </div>
      </a>
    `;
    return div;
  }

  // ============== ABOUT US PAGE ==============
  async initAboutPage() {
    console.log('ℹ️ Initializing About Us Page Integration');
    
    const loadAboutContent = async () => {
      try {
        const response = await fetch(`${this.apiUrl}/about-page`);
        const data = await response.json();
        
        if (data.data) {
          this.renderAboutContent(data.data.attributes);
        }
      } catch (error) {
        console.error('Error loading about content:', error);
      }
    };

    await loadAboutContent();
    setInterval(loadAboutContent, this.refreshInterval);
  }

  renderAboutContent(content) {
    // Update hero section
    const heroTitle = document.querySelector('.about-hero-title');
    if (heroTitle) heroTitle.textContent = content.heroTitle || 'About AI Studio';

    const heroSubtitle = document.querySelector('.about-hero-subtitle');
    if (heroSubtitle) heroSubtitle.textContent = content.heroSubtitle || 'Transforming Education';

    // Update mission section
    const missionTitle = document.querySelector('.mission-title');
    if (missionTitle) missionTitle.textContent = content.missionTitle || 'Our Mission';

    const missionText = document.querySelector('.mission-description');
    if (missionText) missionText.textContent = content.missionDescription || '';

    // Update vision section
    const visionTitle = document.querySelector('.vision-title');
    if (visionTitle) visionTitle.textContent = content.visionTitle || 'Our Vision';

    const visionText = document.querySelector('.vision-description');
    if (visionText) visionText.textContent = content.visionDescription || '';

    // Update values
    if (content.values && Array.isArray(content.values)) {
      const valuesGrid = document.querySelector('.values-grid');
      if (valuesGrid) {
        valuesGrid.innerHTML = '';
        content.values.forEach(value => {
          const valueCard = document.createElement('div');
          valueCard.className = 'value-card';
          valueCard.innerHTML = `
            <div class="value-icon">${value.icon || '🎯'}</div>
            <h3 class="value-title">${value.title}</h3>
            <p class="value-description">${value.description}</p>
          `;
          valuesGrid.appendChild(valueCard);
        });
      }
    }

    console.log('✅ Updated About Us content');
  }

  // ============== CONTACT PAGE ==============
  async initContactPage() {
    console.log('📞 Initializing Contact Page Integration');
    
    const loadContactContent = async () => {
      try {
        const response = await fetch(`${this.apiUrl}/contact-page`);
        const data = await response.json();
        
        if (data.data) {
          this.renderContactContent(data.data.attributes);
        }
      } catch (error) {
        console.error('Error loading contact content:', error);
      }
    };

    await loadContactContent();
    setInterval(loadContactContent, this.refreshInterval);
  }

  renderContactContent(content) {
    // Update contact information
    const phoneElement = document.querySelector('.contact-phone');
    if (phoneElement) phoneElement.textContent = content.phone || '+1 234 567 8900';

    const emailElement = document.querySelector('.contact-email');
    if (emailElement) emailElement.textContent = content.email || 'info@aistudio.com';

    const addressElement = document.querySelector('.contact-address');
    if (addressElement) addressElement.textContent = content.address || '123 Main St, City, Country';

    // Update office hours
    const hoursElement = document.querySelector('.office-hours');
    if (hoursElement) hoursElement.textContent = content.officeHours || 'Mon-Fri 9:00 AM - 6:00 PM';

    console.log('✅ Updated Contact content');
  }

  // ============== BLOG PAGE ==============
  async initBlogPage() {
    console.log('📝 Initializing Blog Page Integration');
    
    const loadBlogPosts = async () => {
      try {
        const response = await fetch(`${this.apiUrl}/blog-posts`);
        const data = await response.json();
        
        if (data.data) {
          this.renderBlogPosts(data.data);
        }
      } catch (error) {
        console.error('Error loading blog posts:', error);
      }
    };

    await loadBlogPosts();
    setInterval(loadBlogPosts, this.refreshInterval);
  }

  renderBlogPosts(posts) {
    const blogGrid = document.querySelector('.blog-collection-list');
    if (!blogGrid) return;

    blogGrid.innerHTML = '';

    posts.forEach(post => {
      const postCard = this.createBlogCard(post);
      blogGrid.appendChild(postCard);
    });

    console.log(`✅ Rendered ${posts.length} blog posts`);
  }

  createBlogCard(post) {
    const div = document.createElement('div');
    div.className = 'blog-collection-item';
    div.innerHTML = `
      <a href="/detail_blog.html?id=${post.id}" class="blog-card-wrapper">
        <div class="blog-card-image-wrapper">
          <img src="${post.attributes.featuredImage?.data?.attributes?.url || '/images/Demo-Image2.jpg'}" 
               alt="${post.attributes.title}" class="blog-card-image">
          <div class="blog-category-tag">${post.attributes.category || 'Technology'}</div>
        </div>
        <div class="blog-card-content">
          <h3 class="blog-card-title">${post.attributes.title}</h3>
          <p class="blog-card-excerpt">${post.attributes.excerpt || ''}</p>
          <div class="blog-card-meta">
            <span class="blog-author">${post.attributes.author || 'Admin'}</span>
            <span class="blog-date">${new Date(post.attributes.publishedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </a>
    `;
    return div;
  }

  // ============== PRICING PAGE ==============
  async initPricingPage() {
    console.log('💰 Initializing Pricing Page Integration');
    
    const loadPricingPlans = async () => {
      try {
        const response = await fetch(`${this.apiUrl}/pricing-plans`);
        const data = await response.json();
        
        if (data.data) {
          this.renderPricingPlans(data.data);
        }
      } catch (error) {
        console.error('Error loading pricing plans:', error);
      }
    };

    await loadPricingPlans();
    setInterval(loadPricingPlans, this.refreshInterval);
  }

  renderPricingPlans(plans) {
    const pricingGrid = document.querySelector('.pricing-plans-grid');
    if (!pricingGrid) return;

    pricingGrid.innerHTML = '';

    plans.forEach(plan => {
      const planCard = this.createPricingCard(plan);
      pricingGrid.appendChild(planCard);
    });

    console.log(`✅ Rendered ${plans.length} pricing plans`);
  }

  createPricingCard(plan) {
    const div = document.createElement('div');
    div.className = `pricing-card ${plan.attributes.featured ? 'featured' : ''}`;
    div.innerHTML = `
      <div class="pricing-card-header">
        <h3 class="pricing-plan-name">${plan.attributes.name}</h3>
        <div class="pricing-amount">
          <span class="currency">$</span>
          <span class="price">${plan.attributes.price}</span>
          <span class="period">/${plan.attributes.period || 'month'}</span>
        </div>
        <p class="pricing-description">${plan.attributes.description || ''}</p>
      </div>
      <ul class="pricing-features">
        ${plan.attributes.features ? plan.attributes.features.map(feature => 
          `<li class="pricing-feature ${feature.included ? 'included' : 'not-included'}">
            ${feature.text}
          </li>`
        ).join('') : ''}
      </ul>
      <button class="pricing-cta-button ${plan.attributes.featured ? 'primary' : 'secondary'}">
        ${plan.attributes.ctaText || 'Get Started'}
      </button>
    `;
    return div;
  }

  // ============== TEACHERS PAGE ==============
  async initTeachersPage() {
    console.log('👨‍🏫 Initializing Teachers Page Integration');
    
    const loadTeachers = async () => {
      try {
        const response = await fetch(`${this.apiUrl}/teachers`);
        const data = await response.json();
        
        if (data.data) {
          this.renderTeachers(data.data);
        }
      } catch (error) {
        console.error('Error loading teachers:', error);
      }
    };

    await loadTeachers();
    setInterval(loadTeachers, this.refreshInterval);
  }

  renderTeachers(teachers) {
    const teachersGrid = document.querySelector('.teachers-grid');
    if (!teachersGrid) return;

    teachersGrid.innerHTML = '';

    teachers.forEach(teacher => {
      const teacherCard = this.createTeacherCard(teacher);
      teachersGrid.appendChild(teacherCard);
    });

    console.log(`✅ Rendered ${teachers.length} teachers`);
  }

  createTeacherCard(teacher) {
    const div = document.createElement('div');
    div.className = 'teacher-card';
    div.innerHTML = `
      <div class="teacher-image-wrapper">
        <img src="${teacher.attributes.photo?.data?.attributes?.url || '/images/About-Me-Image.jpg'}" 
             alt="${teacher.attributes.name}" class="teacher-image">
      </div>
      <div class="teacher-info">
        <h3 class="teacher-name">${teacher.attributes.name}</h3>
        <p class="teacher-role">${teacher.attributes.role || 'Instructor'}</p>
        <p class="teacher-bio">${teacher.attributes.bio || ''}</p>
        <div class="teacher-expertise">
          ${teacher.attributes.expertise ? teacher.attributes.expertise.map(skill => 
            `<span class="expertise-tag">${skill}</span>`
          ).join('') : ''}
        </div>
        <div class="teacher-social">
          ${teacher.attributes.linkedin ? `<a href="${teacher.attributes.linkedin}" target="_blank">LinkedIn</a>` : ''}
          ${teacher.attributes.twitter ? `<a href="${teacher.attributes.twitter}" target="_blank">Twitter</a>` : ''}
        </div>
      </div>
    `;
    return div;
  }

  // ============== CAREER CENTER PAGE ==============
  async initCareerCenterPage() {
    console.log('💼 Initializing Career Center Page Integration');
    
    const loadCareerContent = async () => {
      try {
        const [jobsResponse, resourcesResponse] = await Promise.all([
          fetch(`${this.apiUrl}/job-postings`),
          fetch(`${this.apiUrl}/career-resources`)
        ]);

        const jobsData = await jobsResponse.json();
        const resourcesData = await resourcesResponse.json();
        
        if (jobsData.data) {
          this.renderJobPostings(jobsData.data);
        }
        
        if (resourcesData.data) {
          this.renderCareerResources(resourcesData.data);
        }
      } catch (error) {
        console.error('Error loading career content:', error);
      }
    };

    await loadCareerContent();
    setInterval(loadCareerContent, this.refreshInterval);
  }

  renderJobPostings(jobs) {
    const jobsGrid = document.querySelector('.jobs-grid');
    if (!jobsGrid) return;

    jobsGrid.innerHTML = '';

    jobs.forEach(job => {
      const jobCard = document.createElement('div');
      jobCard.className = 'job-card';
      jobCard.innerHTML = `
        <h3 class="job-title">${job.attributes.title}</h3>
        <p class="job-company">${job.attributes.company}</p>
        <p class="job-location">${job.attributes.location}</p>
        <p class="job-type">${job.attributes.type}</p>
        <a href="${job.attributes.applyUrl}" class="apply-button" target="_blank">Apply Now</a>
      `;
      jobsGrid.appendChild(jobCard);
    });

    console.log(`✅ Rendered ${jobs.length} job postings`);
  }

  renderCareerResources(resources) {
    const resourcesGrid = document.querySelector('.resources-grid');
    if (!resourcesGrid) return;

    resourcesGrid.innerHTML = '';

    resources.forEach(resource => {
      const resourceCard = document.createElement('div');
      resourceCard.className = 'resource-card';
      resourceCard.innerHTML = `
        <h3 class="resource-title">${resource.attributes.title}</h3>
        <p class="resource-description">${resource.attributes.description}</p>
        <a href="${resource.attributes.downloadUrl}" class="download-button" target="_blank">Download</a>
      `;
      resourcesGrid.appendChild(resourceCard);
    });

    console.log(`✅ Rendered ${resources.length} career resources`);
  }

  // ============== COURSE DETAIL PAGE ==============
  async initCourseDetailPage() {
    console.log('📖 Initializing Course Detail Page Integration');
    
    const courseId = new URLSearchParams(window.location.search).get('id');
    if (!courseId) {
      console.error('No course ID provided');
      return;
    }

    const loadCourseDetail = async () => {
      try {
        const response = await fetch(`${this.apiUrl}/courses`);
        const data = await response.json();
        
        if (data.data) {
          this.renderCourseDetail(data.data);
        }
      } catch (error) {
        console.error('Error loading course detail:', error);
      }
    };

    await loadCourseDetail();
    setInterval(loadCourseDetail, this.refreshInterval);
  }

  renderCourseDetail(course) {
    // Update course title
    const courseTitle = document.querySelector('.course-detail-title');
    if (courseTitle) courseTitle.textContent = course.attributes.title;

    // Update course description
    const courseDescription = document.querySelector('.course-detail-description');
    if (courseDescription) courseDescription.innerHTML = course.attributes.description || '';

    // Update course meta
    const courseDuration = document.querySelector('.course-duration');
    if (courseDuration) courseDuration.textContent = course.attributes.duration || '4 Weeks';

    const courseLessons = document.querySelector('.course-lessons');
    if (courseLessons) courseLessons.textContent = `${course.attributes.lessons || '12'} Lessons`;

    const coursePrice = document.querySelector('.course-price');
    if (coursePrice) coursePrice.textContent = `$${course.attributes.price || '99'}`;

    // Update curriculum
    if (course.attributes.curriculum && Array.isArray(course.attributes.curriculum)) {
      const curriculumList = document.querySelector('.curriculum-list');
      if (curriculumList) {
        curriculumList.innerHTML = '';
        course.attributes.curriculum.forEach((lesson, index) => {
          const lessonItem = document.createElement('div');
          lessonItem.className = 'lesson-item';
          lessonItem.innerHTML = `
            <span class="lesson-number">${index + 1}</span>
            <span class="lesson-title">${lesson.title}</span>
            <span class="lesson-duration">${lesson.duration || '10 min'}</span>
          `;
          curriculumList.appendChild(lessonItem);
        });
      }
    }

    console.log('✅ Updated Course Detail content');
  }

  // ============== BLOG DETAIL PAGE ==============
  async initBlogDetailPage() {
    console.log('📄 Initializing Blog Detail Page Integration');
    
    const postId = new URLSearchParams(window.location.search).get('id');
    if (!postId) {
      console.error('No blog post ID provided');
      return;
    }

    const loadBlogDetail = async () => {
      try {
        const response = await fetch(`${this.apiUrl}/blog-posts`);
        const data = await response.json();
        
        if (data.data) {
          this.renderBlogDetail(data.data);
        }
      } catch (error) {
        console.error('Error loading blog detail:', error);
      }
    };

    await loadBlogDetail();
  }

  renderBlogDetail(post) {
    // Update blog title
    const blogTitle = document.querySelector('.blog-detail-title');
    if (blogTitle) blogTitle.textContent = post.attributes.title;

    // Update blog content
    const blogContent = document.querySelector('.blog-detail-content');
    if (blogContent) blogContent.innerHTML = post.attributes.content || '';

    // Update blog meta
    const blogAuthor = document.querySelector('.blog-author');
    if (blogAuthor) blogAuthor.textContent = post.attributes.author || 'Admin';

    const blogDate = document.querySelector('.blog-date');
    if (blogDate) blogDate.textContent = new Date(post.attributes.publishedAt).toLocaleDateString();

    // Update featured image
    const featuredImage = document.querySelector('.blog-featured-image');
    if (featuredImage && post.attributes.featuredImage?.data) {
      featuredImage.src = post.attributes.featuredImage.data.attributes.url;
    }

    console.log('✅ Updated Blog Detail content');
  }

  // ============== HOME PAGE (already integrated) ==============
  async initHomePage() {
    console.log('🏠 Home Page - Already integrated separately');
    // Home page uses existing strapi-home-integration.js
  }

  // ============== STATUS INDICATOR ==============
  addStatusIndicator() {
    // Remove existing indicator
    const existing = document.querySelector('.strapi-master-status');
    if (existing) existing.remove();

    // Add new indicator
    const indicator = document.createElement('div');
    indicator.className = 'strapi-master-status';
    indicator.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      z-index: 9999;
      font-family: Arial, sans-serif;
      font-size: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      cursor: pointer;
    `;
    indicator.innerHTML = `
      <strong>🎨 Strapi CMS Active</strong><br>
      <span style="font-size: 11px;">Page: ${this.currentPage}</span><br>
      <span style="font-size: 10px; opacity: 0.8;">Live updates every ${this.refreshInterval/1000}s</span>
    `;
    
    indicator.onclick = () => {
      window.open('http://localhost:1337/admin', '_blank');
    };
    
    document.body.appendChild(indicator);
  }
}

// Initialize when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.strapiMaster = new StrapiMasterIntegration();
  });
} else {
  window.strapiMaster = new StrapiMasterIntegration();
}

console.log('🎯 Strapi Master Integration System Loaded');
console.log('   Manages ALL website pages through Strapi CMS');
console.log('   Live updates every 5 seconds');
console.log('   Click status indicator to open Strapi Admin');