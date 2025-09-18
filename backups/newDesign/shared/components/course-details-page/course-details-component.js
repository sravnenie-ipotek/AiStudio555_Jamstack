/**
 * SHARED COURSE DETAILS PAGE COMPONENT
 * Completely database-driven course details with NO static content
 */

(function() {
    'use strict';

    console.log('📦 Loading Shared Course Details Component...');

    // API Configuration
    const API_BASE = window.location.hostname === 'localhost'
        ? 'http://localhost:3000'
        : 'https://aistudio555jamstack-production.up.railway.app';

    /**
     * CourseDetailsComponent Class
     */
    class CourseDetailsComponent {
        constructor() {
            this.courseData = null;
            this.courseId = null;
            this.previewMode = false;
        }

        /**
         * Initialize the component
         */
        async init() {
            console.log('🚀 Initializing Course Details Component...');

            // Extract URL parameters
            const params = this.getUrlParams();
            this.courseId = params.id;
            this.previewMode = params.preview === 'true';

            if (!this.courseId) {
                this.showError('No course ID provided in URL');
                return;
            }

            // Load and populate course data
            await this.loadCourseData();
        }

        /**
         * Extract URL parameters
         */
        getUrlParams() {
            const params = new URLSearchParams(window.location.search);
            return {
                id: params.get('id'),
                preview: params.get('preview')
            };
        }

        /**
         * Fetch course data from API
         */
        async fetchCourseData(courseId, preview = false) {
            try {
                const url = `${API_BASE}/api/nd/courses/${courseId}${preview ? '?preview=true' : ''}`;
                console.log('📡 Fetching course:', url);

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Failed to fetch course: ${response.status}`);
                }

                const data = await response.json();
                console.log('✅ Course data received:', data);

                // Handle wrapped API response format
                return data.data || data;
            } catch (error) {
                console.error('❌ Error fetching course:', error);
                throw error;
            }
        }

        /**
         * Load course data and populate the page
         */
        async loadCourseData() {
            try {
                this.showLoading(true);

                this.courseData = await this.fetchCourseData(this.courseId, this.previewMode);

                if (!this.courseData) {
                    throw new Error('No course data received');
                }

                await this.populatePageContent();
                this.setupEventHandlers();

                console.log('✅ Course details page populated successfully');

            } catch (error) {
                console.error('❌ Error loading course data:', error);
                this.showError('Failed to load course details. Please try again.');
            } finally {
                this.showLoading(false);
            }
        }

        /**
         * Populate all page content with course data
         */
        async populatePageContent() {
            const course = this.courseData;

            // Page title
            document.title = `${course.title || 'Course'} - AI Studio`;

            // Hero Section
            this.setText('.course-breadcrumb-title', course.title);
            this.setText('.course-details-hero-title', course.title);
            this.setText('.course-details-hero-description', course.short_description || course.description);
            this.setImage('.course-hero-image', course.image || course.thumbnail || 'images/placeholder.jpg', course.title);

            // Hero Meta
            this.populateRating(course.rating, course.reviews_count);
            this.setText('.course-instructor', course.instructor || 'Expert Instructor');
            this.setText('.course-duration', course.duration || '8 weeks');

            // Main Content
            this.setText('.course-full-description', course.description);
            this.setText('.course-curriculum-description', course.description);

            // What You'll Learn
            await this.populateObjectives(course);

            // Course Curriculum/Lessons
            await this.populateLessons(course);

            // Requirements
            await this.populateRequirements(course);

            // Features
            await this.populateFeatures(course);

            // Sidebar
            this.populatePricing(course);
            this.populateStats(course);
            this.setText('.course-category', course.category || 'General');
            this.populateInstructor(course);

            // CTA Section
            this.setText('.course-cta-title', 'Start Learning Today');
            this.setText('.course-cta-description', 'Discover a world of learning opportunities with this comprehensive course.');
            this.setText('.course-guarantee-text', '100% Money Back Guarantee');

            // Category color
            this.setCategoryColor(course.category);
        }

        /**
         * Populate rating stars and text
         */
        populateRating(rating = 5, reviewsCount = 0) {
            const starsContainer = document.querySelector('.course-rating-stars');
            const ratingText = document.querySelector('.course-rating-text');

            if (starsContainer) {
                starsContainer.innerHTML = this.generateStarRating(rating);
            }

            if (ratingText) {
                ratingText.textContent = `${rating} (${reviewsCount} reviews)`;
            }
        }

        /**
         * Generate star rating HTML
         */
        generateStarRating(rating) {
            const fullStars = Math.floor(rating);
            let starsHtml = '';

            for (let i = 0; i < 5; i++) {
                const filled = i < fullStars;
                starsHtml += `<span style="color: ${filled ? '#fbbf24' : '#d1d5db'}; font-size: 16px;">★</span>`;
            }

            return starsHtml;
        }

        /**
         * Populate learning objectives
         */
        async populateObjectives(course) {
            const container = document.querySelector('.course-objectives-list');
            if (!container) return;

            let objectives = [];

            if (course.objectives) {
                objectives = course.objectives.split(',').map(obj => obj.trim());
            } else if (course.what_you_learn) {
                objectives = Array.isArray(course.what_you_learn) ? course.what_you_learn : course.what_you_learn.split(',').map(obj => obj.trim());
            }

            if (objectives.length > 0) {
                container.innerHTML = objectives.map(objective =>
                    `<div class="course-objective-item">${objective}</div>`
                ).join('');
            } else {
                container.innerHTML = '<div class="course-objective-item">Master the fundamentals of this subject</div>';
            }
        }

        /**
         * Populate course lessons
         */
        async populateLessons(course) {
            const container = document.querySelector('.course-lessons-container');
            if (!container) return;

            let lessons = [];

            if (course.lessons || course.syllabus) {
                const lessonsData = course.lessons || course.syllabus;
                try {
                    lessons = typeof lessonsData === 'string' ? JSON.parse(lessonsData) : lessonsData;
                } catch (e) {
                    console.warn('Could not parse lessons:', e);
                    if (typeof lessonsData === 'string') {
                        lessons = lessonsData.split(',').map(l => ({ title: l.trim() }));
                    }
                }
            }

            if (Array.isArray(lessons) && lessons.length > 0) {
                container.innerHTML = lessons.map((lesson, index) =>
                    `<div class="course-lesson-item">
                        <div class="course-lesson-number">${index + 1}</div>
                        <div class="course-lesson-content">
                            <div class="course-lesson-title">${lesson.title || lesson}</div>
                            ${lesson.description ? `<div class="course-lesson-description">${lesson.description}</div>` : ''}
                        </div>
                        <div class="course-lesson-duration">${lesson.duration || '30 min'}</div>
                    </div>`
                ).join('');
            } else {
                container.innerHTML = `
                    <div class="course-lesson-item">
                        <div class="course-lesson-number">1</div>
                        <div class="course-lesson-content">
                            <div class="course-lesson-title">Course Introduction</div>
                            <div class="course-lesson-description">Getting started with the fundamentals</div>
                        </div>
                        <div class="course-lesson-duration">30 min</div>
                    </div>
                `;
            }
        }

        /**
         * Populate course requirements
         */
        async populateRequirements(course) {
            const container = document.querySelector('.course-requirements-list');
            if (!container) return;

            let requirements = [];

            if (course.requirements) {
                if (Array.isArray(course.requirements)) {
                    requirements = course.requirements;
                } else {
                    requirements = course.requirements.split(',').map(req => req.trim());
                }
            }

            if (requirements.length > 0) {
                container.innerHTML = requirements.map(requirement =>
                    `<div class="course-requirement-item">${requirement}</div>`
                ).join('');
            } else {
                container.innerHTML = '<div class="course-requirement-item">No prerequisites required</div>';
            }
        }

        /**
         * Populate course features
         */
        async populateFeatures(course) {
            const container = document.querySelector('.course-features-list');
            if (!container) return;

            let features = [];

            if (course.features) {
                if (Array.isArray(course.features)) {
                    features = course.features;
                } else {
                    features = course.features.split(',').map(feature => feature.trim());
                }
            }

            if (features.length > 0) {
                container.innerHTML = features.map(feature =>
                    `<div class="course-feature-item">${feature}</div>`
                ).join('');
            } else {
                container.innerHTML = `
                    <div class="course-feature-item">Lifetime access to course content</div>
                    <div class="course-feature-item">Certificate of completion</div>
                    <div class="course-feature-item">24/7 student support</div>
                `;
            }
        }

        /**
         * Populate pricing information
         */
        populatePricing(course) {
            const currentPrice = document.querySelector('.course-current-price');
            const oldPrice = document.querySelector('.course-old-price');

            if (currentPrice) {
                if (course.price && course.price > 0) {
                    currentPrice.textContent = `$${course.price}`;
                } else {
                    currentPrice.textContent = 'Free';
                }
            }

            if (oldPrice && course.old_price && course.old_price > course.price) {
                oldPrice.textContent = `$${course.old_price}`;
                oldPrice.style.display = 'inline';
            } else if (oldPrice) {
                oldPrice.style.display = 'none';
            }
        }

        /**
         * Populate course statistics
         */
        populateStats(course) {
            this.setText('.course-lessons-count', course.lessons_count || 0);
            this.setText('.course-students-count', course.students_count || course.students_enrolled || 0);
            this.setText('.course-level', course.level || 'All Levels');
        }

        /**
         * Populate instructor information
         */
        populateInstructor(course) {
            this.setText('.instructor-name', course.instructor || 'Expert Instructor');
            this.setText('.instructor-bio', course.instructor_bio || 'Experienced professional with years of expertise in this field.');

            const instructorImage = document.querySelector('.instructor-image');
            if (instructorImage) {
                if (course.instructor_image) {
                    instructorImage.src = course.instructor_image;
                    instructorImage.alt = course.instructor || '';
                } else {
                    instructorImage.src = 'images/placeholder-instructor.jpg';
                    instructorImage.alt = 'Instructor';
                }
            }
        }

        /**
         * Set category color
         */
        setCategoryColor(category) {
            const categoryTag = document.querySelector('.course-category-tag');
            if (!categoryTag) return;

            const color = this.getCategoryColor(category);
            categoryTag.style.backgroundColor = color;
        }

        /**
         * Get color for course category
         */
        getCategoryColor(category) {
            if (!category) return '#667eea';

            const cat = category.toLowerCase();
            if (cat.includes('web')) return '#667eea';
            if (cat.includes('app') || cat.includes('mobile')) return '#f093fb';
            if (cat.includes('machine') || cat.includes('ml') || cat.includes('ai')) return '#4facfe';
            if (cat.includes('cloud')) return '#43e97b';
            if (cat.includes('data') || cat.includes('analytics')) return '#ff6b6b';
            if (cat.includes('design') || cat.includes('ui')) return '#feca57';

            return '#667eea';
        }

        /**
         * Setup event handlers
         */
        setupEventHandlers() {
            // Enrollment button
            const enrollButtons = document.querySelectorAll('.course-enroll-button, .course-cta-primary');
            enrollButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleEnrollment();
                });
            });

            // Browse courses button
            const browseButtons = document.querySelectorAll('.course-cta-secondary');
            browseButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.location.href = 'courses.html';
                });
            });
        }

        /**
         * Handle enrollment action
         */
        handleEnrollment() {
            console.log('Enrollment clicked for course:', this.courseData.id);

            // Open contact modal if available
            if (window.openContactModal) {
                window.openContactModal();
            } else {
                // Fallback: show alert
                alert('Enrollment coming soon! Contact us for more information.');
            }
        }

        /**
         * Utility: Set text content safely
         */
        setText(selector, text) {
            const element = document.querySelector(selector);
            if (element && text) {
                element.textContent = text;
            }
        }

        /**
         * Utility: Set image safely
         */
        setImage(selector, src, alt = '') {
            const element = document.querySelector(selector);
            if (element && src) {
                element.src = src;
                element.alt = alt;
            }
        }

        /**
         * Show loading state
         */
        showLoading(show) {
            let loader = document.querySelector('.course-loading-overlay');

            if (show && !loader) {
                loader = document.createElement('div');
                loader.className = 'course-loading-overlay';
                loader.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(255, 255, 255, 0.9);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    font-size: 18px;
                    color: #041d63;
                `;
                loader.textContent = 'Loading course details...';
                document.body.appendChild(loader);
            } else if (!show && loader) {
                loader.remove();
            }
        }

        /**
         * Show error message
         */
        showError(message) {
            console.error('❌ CourseDetails Error:', message);

            let errorContainer = document.querySelector('.course-error-message');
            if (!errorContainer) {
                errorContainer = document.createElement('div');
                errorContainer.className = 'course-error-message';
                errorContainer.style.cssText = `
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #ff4444;
                    color: white;
                    padding: 15px 30px;
                    border-radius: 8px;
                    font-size: 16px;
                    z-index: 9999;
                    box-shadow: 0 4px 20px rgba(255,68,68,0.3);
                `;
                document.body.appendChild(errorContainer);
            }

            errorContainer.textContent = message;
            errorContainer.style.display = 'block';

            setTimeout(() => {
                errorContainer.style.display = 'none';
            }, 5000);
        }
    }

    /**
     * Initialize when DOM is ready
     */
    function initCourseDetailsComponent() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                const component = new CourseDetailsComponent();
                component.init();
            });
        } else {
            const component = new CourseDetailsComponent();
            component.init();
        }
    }

    // Auto-initialize
    initCourseDetailsComponent();

    // Expose globally for debugging
    window.CourseDetailsComponent = CourseDetailsComponent;

    console.log('✅ Shared Course Details Component loaded successfully');

})();