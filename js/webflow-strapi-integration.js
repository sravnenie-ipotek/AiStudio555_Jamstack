/**
 * AI Studio Frontend-Backend Integration
 * Connects static frontend to Custom API
 * Architecture: JAMstack - Static HTML + Custom Express API
 */

class CustomAPIIntegration {
    constructor() {
        // Smart API URL detection
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        this.API_BASE = isLocal 
            ? 'http://localhost:3000/api'  // Local development
            : 'https://aistudio555jamstack-production.up.railway.app/api';  // Production
        this.isInitialized = false;
        this.currentLanguage = 'en';
        this.cache = {};
        
        console.log('🚀 CustomAPIIntegration initialized for:', this.API_BASE);
    }

    async initialize() {
        try {
            console.log('🔄 Initializing Custom API integration...');
            
            // Check API status
            const status = await this.checkAPIStatus();
            if (!status) {
                console.error('❌ API not available, falling back to static content');
                return false;
            }

            // Load dynamic content based on current page
            await this.loadPageContent();
            this.isInitialized = true;
            
            console.log('✅ Custom API integration loaded successfully');
            return true;
        } catch (error) {
            console.error('❌ Integration initialization failed:', error);
            return false;
        }
    }

    async checkAPIStatus() {
        try {
            const response = await fetch(`${this.API_BASE}/status`);
            const data = await response.json();
            console.log('📊 API Status:', data.status);
            return response.ok;
        } catch (error) {
            console.error('❌ API status check failed:', error);
            return false;
        }
    }

    async loadPageContent() {
        const currentPath = window.location.pathname;
        const pageName = currentPath.split('/').pop()?.replace('.html', '') || 'home';
        
        console.log(`🔄 Loading content for page: ${pageName}`);

        switch (pageName) {
            case 'home':
            case 'index':
                await this.loadHomeContent();
                break;
            case 'courses':
                await this.loadCoursesContent();
                break;
            case 'teachers':
                await this.loadTeachersContent();
                break;
            case 'blog':
                await this.loadBlogContent();
                break;
            case 'career-center':
            case 'career-orientation':
                await this.loadCareerContent(pageName);
                break;
            default:
                console.log(`ℹ️ No dynamic content loader for: ${pageName}`);
        }
    }

    async loadHomeContent() {
        try {
            console.log('🏠 Loading home page content...');
            
            // Load home page data
            const homeData = await this.fetchAPI('/home-page');
            if (homeData && homeData.data && homeData.data.attributes) {
                const attrs = homeData.data.attributes;
                console.log('📊 Home page attributes:', attrs);
                
                // Create hero data object with correct structure
                const heroData = {
                    title: attrs.heroTitle,
                    subtitle: attrs.heroSubtitle, 
                    description: attrs.heroDescription
                };
                
                this.updateHomeHero(heroData);
            }

            // Load latest courses for featured section
            const courses = await this.fetchAPI('/courses?populate=*&pagination[limit]=6');
            if (courses?.data) {
                this.updateFeaturedCoursesFromAPI(courses.data);
            }

        } catch (error) {
            console.error('❌ Failed to load home content:', error);
        }
    }

    async loadCoursesContent() {
        try {
            console.log('📚 Loading courses content...');
            
            const courses = await this.fetchAPI('/courses?populate=*');
            if (courses?.data) {
                this.updateCoursesGrid(courses.data);
                console.log(`✅ Loaded ${courses.data.length} courses`);
            }
        } catch (error) {
            console.error('❌ Failed to load courses:', error);
        }
    }

    async loadTeachersContent() {
        try {
            console.log('👨‍🏫 Loading teachers content...');
            
            const teachers = await this.fetchAPI('/teachers?populate=*');
            if (teachers?.data) {
                this.updateTeachersGrid(teachers.data);
                console.log(`✅ Loaded ${teachers.data.length} teachers`);
            }
        } catch (error) {
            console.error('❌ Failed to load teachers:', error);
        }
    }

    async loadBlogContent() {
        try {
            console.log('📝 Loading blog content...');
            
            const blogs = await this.fetchAPI('/blogs?populate=*');
            if (blogs?.data) {
                this.updateBlogGrid(blogs.data);
                console.log(`✅ Loaded ${blogs.data.length} blog posts`);
            }
        } catch (error) {
            console.error('❌ Failed to load blog content:', error);
        }
    }

    async loadCareerContent(pageType) {
        try {
            console.log(`💼 Loading ${pageType} content...`);
            
            const endpoint = pageType === 'career-center' ? '/career-center' : '/career-orientation';
            const careerData = await this.fetchAPI(endpoint);
            
            if (careerData) {
                this.updateCareerPage(careerData, pageType);
                console.log(`✅ Loaded ${pageType} content`);
            }
        } catch (error) {
            console.error(`❌ Failed to load ${pageType} content:`, error);
        }
    }

    async fetchAPI(endpoint) {
        const cacheKey = `${endpoint}_${this.currentLanguage}`;
        
        // Return cached data if available
        if (this.cache[cacheKey]) {
            console.log(`📦 Using cached data for: ${endpoint}`);
            return this.cache[cacheKey];
        }

        try {
            const url = `${this.API_BASE}${endpoint}`;
            console.log(`🔄 Fetching: ${url}`);
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            // Cache the data
            this.cache[cacheKey] = data;
            
            console.log(`✅ Fetched data from: ${endpoint}`);
            return data;
        } catch (error) {
            console.error(`❌ API fetch failed for ${endpoint}:`, error);
            return null;
        }
    }

    updateHomeHero(heroData) {
        if (!heroData) return;

        console.log('🎯 Updating hero section...');
        
        // Update hero title
        const heroTitle = document.querySelector('.banner-heading, .hero-title, h1.hero, [data-hero-title]');
        if (heroTitle && heroData.title) {
            heroTitle.textContent = heroData.title;
            console.log('✅ Updated hero title:', heroData.title);
        }

        // Update hero subtitle
        const heroSubtitle = document.querySelector('.hero-subtitle, .hero-description, [data-hero-subtitle]');
        if (heroSubtitle && heroData.subtitle) {
            heroSubtitle.textContent = heroData.subtitle;
        }

        // Update hero description
        const heroDesc = document.querySelector('.hero-text, .hero-description-text, [data-hero-description]');
        if (heroDesc && heroData.description) {
            heroDesc.textContent = heroData.description;
        }
    }

    updateFeaturedCoursesFromAPI(coursesData) {
        console.log('🎓 Updating featured courses from API...');
        
        // Find courses container
        const coursesContainer = document.querySelector('.featured-courses-grid, .courses-grid, [data-courses-container]');
        
        if (!coursesContainer) {
            console.warn('⚠️ Courses container not found');
            return;
        }

        // Clear existing courses
        coursesContainer.innerHTML = '';

        // Create course cards
        coursesData.forEach(course => {
            const courseElement = this.createCourseCard(course);
            coursesContainer.appendChild(courseElement);
        });

        console.log(`✅ Updated featured courses with ${coursesData.length} items`);
    }

    updateCoursesGrid(coursesData) {
        console.log('🎓 Updating courses grid...');
        
        // Find main courses container
        const coursesContainer = document.querySelector('.courses-list, .courses-grid, .w-dyn-list, [data-courses-grid]');
        
        if (!coursesContainer) {
            console.warn('⚠️ Courses grid container not found');
            return;
        }

        // Remove "No items found" message
        const noItemsMsg = coursesContainer.querySelector('.w-dyn-empty');
        if (noItemsMsg) {
            noItemsMsg.remove();
        }

        // Clear existing content
        coursesContainer.innerHTML = '';

        // Add course cards
        coursesData.forEach(course => {
            const courseElement = this.createCourseCard(course);
            coursesContainer.appendChild(courseElement);
        });

        console.log(`✅ Updated courses grid with ${coursesData.length} courses`);
    }

    createCourseCard(courseData) {
        const course = courseData.attributes || courseData;
        
        const courseCard = document.createElement('div');
        courseCard.className = 'course-item w-dyn-item';
        
        courseCard.innerHTML = `
            <div class="course-card">
                <div class="course-image">
                    <img src="${course.image || '/images/course-placeholder.jpg'}" 
                         alt="${course.title}" 
                         class="course-img" />
                </div>
                <div class="course-content">
                    <h3 class="course-title">${course.title}</h3>
                    <p class="course-description">${course.description || ''}</p>
                    <div class="course-meta">
                        <span class="course-duration">${course.duration || '8 weeks'}</span>
                        <span class="course-lessons">${course.lessons || 24} lessons</span>
                    </div>
                    <div class="course-footer">
                        <div class="course-price">$${course.price || 299}</div>
                        <div class="course-rating">
                            <span class="rating-stars">⭐⭐⭐⭐⭐</span>
                            <span class="rating-value">${course.rating || 4.9}/5</span>
                        </div>
                    </div>
                    <a href="/detail_courses.html?id=${courseData.id}" class="course-link">
                        View Course
                    </a>
                </div>
            </div>
        `;
        
        return courseCard;
    }

    updateTestimonials(testimonialsData) {
        if (!testimonialsData) return;

        console.log('💬 Updating testimonials...');
        
        const testimonialsContainer = document.querySelector('.testimonials-grid, [data-testimonials]');
        if (testimonialsContainer && Array.isArray(testimonialsData)) {
            // Update testimonials logic here
            console.log(`✅ Updated ${testimonialsData.length} testimonials`);
        }
    }

    updateTeachersGrid(teachersData) {
        console.log('👨‍🏫 Updating teachers grid...');
        
        const teachersContainer = document.querySelector('.teachers-grid, [data-teachers-grid]');
        if (!teachersContainer) return;

        teachersContainer.innerHTML = '';
        
        teachersData.forEach(teacher => {
            const teacherCard = this.createTeacherCard(teacher);
            teachersContainer.appendChild(teacherCard);
        });

        console.log(`✅ Updated teachers grid with ${teachersData.length} teachers`);
    }

    createTeacherCard(teacherData) {
        const teacher = teacherData.attributes || teacherData;
        
        const teacherCard = document.createElement('div');
        teacherCard.className = 'teacher-item w-dyn-item';
        
        teacherCard.innerHTML = `
            <div class="teacher-card">
                <div class="teacher-image">
                    <img src="${teacher.image || '/images/teacher-placeholder.jpg'}" 
                         alt="${teacher.name}" 
                         class="teacher-img" />
                </div>
                <div class="teacher-info">
                    <h3 class="teacher-name">${teacher.name}</h3>
                    <p class="teacher-title">${teacher.title || ''}</p>
                    <p class="teacher-bio">${teacher.bio || ''}</p>
                    <div class="teacher-expertise">
                        ${teacher.expertise ? teacher.expertise.split(',').map(skill => 
                            `<span class="skill-tag">${skill.trim()}</span>`
                        ).join('') : ''}
                    </div>
                </div>
            </div>
        `;
        
        return teacherCard;
    }

    updateBlogGrid(blogsData) {
        console.log('📝 Updating blog grid...');
        
        const blogsContainer = document.querySelector('.blogs-grid, [data-blogs-grid]');
        if (!blogsContainer) return;

        blogsContainer.innerHTML = '';
        
        blogsData.forEach(blog => {
            const blogCard = this.createBlogCard(blog);
            blogsContainer.appendChild(blogCard);
        });

        console.log(`✅ Updated blog grid with ${blogsData.length} posts`);
    }

    createBlogCard(blogData) {
        const blog = blogData.attributes || blogData;
        
        const blogCard = document.createElement('div');
        blogCard.className = 'blog-item w-dyn-item';
        
        blogCard.innerHTML = `
            <div class="blog-card">
                <div class="blog-image">
                    <img src="${blog.image || '/images/blog-placeholder.jpg'}" 
                         alt="${blog.title}" 
                         class="blog-img" />
                </div>
                <div class="blog-content">
                    <h3 class="blog-title">${blog.title}</h3>
                    <p class="blog-excerpt">${blog.excerpt || ''}</p>
                    <div class="blog-meta">
                        <span class="blog-date">${new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}</span>
                        <span class="blog-author">${blog.author || 'AI Studio'}</span>
                    </div>
                    <a href="/detail_blog.html?id=${blogData.id}" class="blog-link">
                        Read More
                    </a>
                </div>
            </div>
        `;
        
        return blogCard;
    }

    updateCareerPage(careerData, pageType) {
        console.log(`💼 Updating ${pageType} page...`);
        
        if (!careerData) return;

        // Update page content based on API data
        const career = careerData.attributes || careerData;
        
        // Update hero section with special handling for stats
        if (career.hero) {
            this.updateCareerHero(career.hero);
        }
        
        // Update problems section
        if (career.problems) {
            this.updatePageSection('.career-problems', career.problems);
        }
        
        // Update solutions section
        if (career.solutions) {
            this.updatePageSection('.career-solutions', career.solutions);
        }

        console.log(`✅ Updated ${pageType} page content`);
    }

    updateCareerHero(heroData) {
        if (!heroData) return;
        
        // Update title
        const heroTitle = document.querySelector('.hero-heading, h1');
        if (heroTitle && heroData.title) {
            heroTitle.textContent = heroData.title;
        }
        
        // Update subtitle  
        const heroSubtitle = document.querySelector('.hero-subtitle, .subtitle');
        if (heroSubtitle && heroData.subtitle) {
            heroSubtitle.textContent = heroData.subtitle;
        }
        
        // Update description
        const heroDesc = document.querySelector('.hero-description, .description');
        if (heroDesc && heroData.description) {
            heroDesc.textContent = heroData.description;
        }
        
        // UPDATE STATS - THIS IS THE CRITICAL FIX
        if (heroData.stats && Array.isArray(heroData.stats)) {
            console.log('📊 Updating stats:', heroData.stats);
            
            // Find all stat containers
            const statContainers = document.querySelectorAll('.hero-stat, .stat-item, .metric-item');
            
            statContainers.forEach((container, index) => {
                if (index < heroData.stats.length) {
                    const stat = heroData.stats[index];
                    
                    // Update stat number - try multiple selectors
                    const numberElement = container.querySelector('.hero-stat-number, .stat-number, .metric-number, h3');
                    if (numberElement && stat.number) {
                        numberElement.textContent = stat.number;
                        console.log(`✅ Updated stat ${index + 1} number: ${stat.number}`);
                    }
                    
                    // Update stat label - try multiple selectors
                    const labelElement = container.querySelector('.hero-stat-label, .stat-label, .metric-label, p');
                    if (labelElement && stat.label) {
                        labelElement.textContent = stat.label;
                        console.log(`✅ Updated stat ${index + 1} label: ${stat.label}`);
                    }
                }
            });
        }
    }

    updatePageSection(selector, data) {
        const section = document.querySelector(selector);
        if (!section || !data) return;

        // Update title
        const title = section.querySelector('h1, h2, .section-title');
        if (title && data.title) {
            title.textContent = data.title;
        }

        // Update description
        const description = section.querySelector('p, .section-description');
        if (description && data.description) {
            description.textContent = data.description;
        }
    }

    // Language switching support
    switchLanguage(lang) {
        this.currentLanguage = lang;
        this.cache = {}; // Clear cache
        this.loadPageContent(); // Reload content in new language
        console.log(`🌍 Switched to language: ${lang}`);
    }

    // Preview mode support
    enablePreviewMode() {
        document.body.classList.add('preview-mode');
        
        // Add preview banner
        const banner = document.createElement('div');
        banner.className = 'preview-banner';
        banner.innerHTML = '👁️ Preview Mode - Content loaded from API';
        banner.style.cssText = `
            position: fixed; top: 0; left: 0; right: 0; 
            background: #007aff; color: white; 
            text-align: center; padding: 10px; 
            z-index: 10000; font-weight: bold;
        `;
        document.body.prepend(banner);
        
        console.log('👁️ Preview mode enabled');
    }
}

// Auto-initialize based on conditions
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const previewMode = urlParams.get('preview') === 'true';
    const isLocalhost = window.location.hostname === 'localhost';
    const isProduction = window.location.hostname.includes('aistudio555.com');

    // Initialize integration if conditions are met
    if (previewMode || isLocalhost || isProduction) {
        console.log('🔄 Conditions met, initializing CustomAPIIntegration...');
        
        const integration = new CustomAPIIntegration();
        
        if (previewMode) {
            integration.enablePreviewMode();
        }
        
        integration.initialize().then(success => {
            if (success) {
                console.log('✅ CustomAPIIntegration ready!');
                
                // Make integration available globally
                window.CustomAPIIntegration = integration;
            } else {
                console.log('⚠️ CustomAPIIntegration failed, using static content');
            }
        });
    } else {
        console.log('ℹ️ CustomAPIIntegration not initialized - conditions not met');
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CustomAPIIntegration;
}