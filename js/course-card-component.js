/**
 * SHARED COURSE CARD COMPONENT
 * Unified course card generator for consistent UI/UX across all pages
 * Based on featured-courses structure with text overflow handling
 */

(function() {
    'use strict';

    // Embedded template HTML for reliability (no external fetch needed)
    const courseCardTemplate = `
<div role="listitem" class="shared-course-card-item w-dyn-item">
    <div data-w-id="{{DATA_W_ID}}" style="background-color: rgb(4,25,63)" class="shared-course-card">
        <a href="{{COURSE_URL}}" class="shared-course-card-image-link w-inline-block">
            <img loading="lazy" src="{{COURSE_IMAGE}}" alt="{{COURSE_TITLE}}" class="shared-course-card-image">
        </a>
        <div class="shared-course-card-content">
            <div class="shared-course-card-content-wrap">
                <a href="{{COURSE_URL}}" class="shared-course-card-title">
                    <span class="shared-course-card-title-text">{{COURSE_TITLE}}</span>
                    <div class="shared-course-card-title-tooltip">{{COURSE_TITLE}}</div>
                </a>
                <div class="shared-course-card-rating">
                    <div class="shared-course-card-rating-stars">{{COURSE_RATING_STARS}}</div>
                    <div class="shared-course-card-rating-text">{{COURSE_RATING}} ({{COURSE_REVIEWS_COUNT}})</div>
                </div>
                <div class="shared-course-card-meta-wrap">
                    <div class="shared-course-card-meta-item">
                        <img loading="lazy" src="images/Courses-Video-Session--Time-Icon.svg" alt="Lessons" class="shared-course-card-meta-icon">
                        <div class="shared-course-card-meta-text">{{COURSE_LESSONS_COUNT}} Lessons</div>
                    </div>
                    <div class="shared-course-card-meta-item">
                        <img loading="lazy" src="images/Courses-Video-Session--Time-Icon2.svg" alt="Duration" class="shared-course-card-meta-icon">
                        <div class="shared-course-card-meta-text">{{COURSE_DURATION}}</div>
                    </div>
                </div>
                <div class="shared-course-card-button-wrapper">
                    <a href="{{COURSE_URL}}" data-w-id="{{DATA_W_ID}}-button" style="background-color: rgba(255,255,255,0); color: rgb(255,255,255)" class="shared-course-card-button primary-button secondary w-inline-block">
                        <div class="primary-button-text-wrap">
                            <div class="primary-button-text-block">{{COURSE_BUTTON_TEXT}}</div>
                            <div class="primary-button-text-block is-text-absolute">{{COURSE_BUTTON_TEXT}}</div>
                        </div>
                    </a>
                </div>
            </div>
        </div>
        <div class="shared-course-card-category-tag" style="background-color: {{COURSE_CATEGORY_COLOR}}; color: rgb(255,255,255)">{{COURSE_CATEGORY}}</div>
    </div>
</div>`;

    /**
     * Initialize the course card component (always succeeds with embedded template)
     */
    async function initCourseCardComponent() {
        console.log('✅ Course card template ready (embedded)');
        return true;
    }

    /**
     * Create a course card element from course data
     * @param {Object} course - Course data object
     * @param {Object} options - Additional options for customization
     * @returns {HTMLElement} - Complete course card element
     */
    async function createCourseCard(course, options = {}) {
        // Initialize component (always succeeds with embedded template)
        await initCourseCardComponent();

        try {
            // Generate unique data-w-id for animations
            const dataWId = `course-card-${course.id || Math.random().toString(36).substr(2, 9)}`;

            // Get button text based on locale
            const locale = localStorage.getItem('preferred_locale') || 'en';
            const buttonTexts = {
                'en': 'Course Details',
                'ru': 'Детали Курса',
                'he': 'פרטי הקורס'
            };

            // Prepare course data with fallbacks
            const courseData = {
                COURSE_ID: course.id || 0,
                COURSE_TITLE: course.title || 'Untitled Course',
                COURSE_IMAGE: course.image || 'images/placeholder.jpg',
                COURSE_URL: course.url || `detail_courses.html?id=${course.id || 0}`,
                COURSE_RATING: course.rating || '5.0',
                COURSE_RATING_STARS: generateStarRating(course.rating || 5),
                COURSE_REVIEWS_COUNT: course.reviews_count || 0,
                COURSE_LESSONS_COUNT: course.lessons_count || 0,
                COURSE_DURATION: course.duration || '8 weeks',
                COURSE_CATEGORY: course.category || 'General',
                COURSE_CATEGORY_COLOR: getCourseColorByCategory(course.category),
                COURSE_INSTRUCTOR: course.instructor || 'Expert Instructor',
                COURSE_PRICE: course.price ? `$${course.price}` : 'Free',
                COURSE_BUTTON_TEXT: buttonTexts[locale] || buttonTexts['en'],
                DATA_W_ID: dataWId
            };

            // Apply custom options
            if (options.customColor) courseData.COURSE_CATEGORY_COLOR = options.customColor;
            if (options.customUrl) courseData.COURSE_URL = options.customUrl;

            // Replace template variables
            let cardHtml = courseCardTemplate;
            Object.keys(courseData).forEach(key => {
                const regex = new RegExp(`{{${key}}}`, 'g');
                cardHtml = cardHtml.replace(regex, courseData[key]);
            });

            // Create DOM element
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = cardHtml.trim();
            const cardElement = tempDiv.firstChild;

            // Setup text overflow detection and tooltips
            setupTextOverflowHandling(cardElement);

            return cardElement;

        } catch (error) {
            console.error('❌ Error creating course card:', error);
            return createFallbackCourseCard(course, options);
        }
    }

    /**
     * Create a fallback course card when template fails to load
     * Uses the existing featured-courses structure
     */
    function createFallbackCourseCard(course, options = {}) {
        const courseItem = document.createElement('div');
        courseItem.className = 'featured-courses-collection-item w-dyn-item';
        courseItem.setAttribute('role', 'listitem');

        // Get category color based on course category
        const categoryColor = getCourseColorByCategory(course.category);

        courseItem.innerHTML = `
            <div class="featured-courses-single" style="background-color: rgb(4,25,63)">
                <a href="${course.url || `detail_courses.html?id=${course.id || 0}`}" class="featured-courses-image-link w-inline-block">
                    <img loading="lazy"
                         src="${course.image || 'images/placeholder.jpg'}"
                         alt="${course.title}"
                         class="featured-courses-image">
                </a>
                <div class="featured-courses-typography">
                    <div class="featured-courses-name-wrap">
                        <a href="${course.url || `detail_courses.html?id=${course.id || 0}`}" class="featured-courses-name course-title-overflow">
                            ${course.title}
                        </a>
                        <div class="featured-courses-rating">
                            <div class="featured-courses-rating-icon-wrapper">
                                ${generateStarRating(course.rating || 5)}
                            </div>
                            <div class="featured-courses-rating-text">
                                ${course.rating || '5.0'} (${course.reviews_count || 0})
                            </div>
                        </div>
                        <div class="courses-video-session-time-wrap">
                            <div class="courses-video-session-time">
                                <img loading="lazy" src="images/Courses-Video-Session--Time-Icon.svg" alt="" class="courses-video-session-time-icon">
                                <div class="courses-video-session-time-text">
                                    ${course.lessons_count || 0} Lessons
                                </div>
                            </div>
                            <div class="courses-video-session-time">
                                <img loading="lazy" src="images/Courses-Video-Session--Time-Icon2.svg" alt="" class="courses-video-session-time-icon">
                                <div class="courses-video-session-time-text">
                                    ${course.duration || '8 weeks'}
                                </div>
                            </div>
                        </div>
                        <div class="featured-courses-button-wrapper">
                            <a href="${course.url || `detail_courses.html?id=${course.id || 0}`}"
                               class="primary-button secondary w-inline-block"
                               style="background-color: rgba(255,255,255,0); color: rgb(255,255,255)">
                                <div class="primary-button-text-wrap">
                                    <div class="primary-button-text-block">Course Details</div>
                                    <div class="primary-button-text-block is-text-absolute">Course Details</div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="featured-courses-categories-tag"
                     style="background-color: ${categoryColor}; color: rgb(255,255,255)">
                    ${course.category}
                </div>
            </div>
        `;

        // Add text overflow handling for fallback
        setupTextOverflowHandling(courseItem);

        return courseItem;
    }

    /**
     * Setup text overflow detection and tooltip handling
     */
    function setupTextOverflowHandling(cardElement) {
        // Handle title overflow (for both new template and fallback)
        const titleElement = cardElement.querySelector('.shared-course-card-title-text, .course-title-overflow, .featured-courses-name');
        if (titleElement && titleElement.textContent) {
            // Check if text is too long for the container
            const maxChars = 60; // Approximate character limit for 2 lines
            if (titleElement.textContent.length > maxChars) {
                titleElement.setAttribute('title', titleElement.textContent);

                // Add overflow class for CSS styling
                titleElement.classList.add('text-overflow');
            }
        }

        // Handle category tag overflow
        const categoryTag = cardElement.querySelector('.shared-course-card-category-tag, .featured-courses-categories-tag');
        if (categoryTag && categoryTag.textContent) {
            const maxCategoryChars = 15; // Max chars for category tag
            if (categoryTag.textContent.length > maxCategoryChars) {
                categoryTag.setAttribute('title', categoryTag.textContent);
                categoryTag.classList.add('text-overflow');
            }
        }
    }

    /**
     * Generate star rating HTML
     */
    function generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        let starsHtml = '';

        for (let i = 0; i < 5; i++) {
            const opacity = i < fullStars ? '1' : '0.3';
            starsHtml += `<img loading="lazy"
                             src="images/Featured-Courses-Rating-Icon.svg"
                             alt="Star ${i + 1}"
                             class="featured-courses-rating-icon"
                             style="opacity: ${opacity}">`;
        }

        return starsHtml;
    }

    /**
     * Get course color by category
     */
    function getCourseColorByCategory(category) {
        if (!category) return '#667eea';

        const cat = category.toLowerCase();
        if (cat.includes('web')) return '#667eea';
        if (cat.includes('app') || cat.includes('mobile')) return '#f093fb';
        if (cat.includes('machine') || cat.includes('ml') || cat.includes('ai')) return '#4facfe';
        if (cat.includes('cloud')) return '#43e97b';
        if (cat.includes('data') || cat.includes('analytics')) return '#ff6b6b';
        if (cat.includes('design') || cat.includes('ui')) return '#feca57';

        return '#667eea'; // default blue
    }

    /**
     * Create multiple course cards and append to container
     */
    async function populateCoursesContainer(container, courses, options = {}) {
        if (!container) {
            console.error('❌ Container not found for course cards');
            return;
        }

        console.log(`🎯 Creating ${courses.length} course cards...`);

        // Clear existing content
        container.innerHTML = '';

        // Add shared grid class if not present
        if (!container.classList.contains('shared-course-cards-grid')) {
            container.classList.add('shared-course-cards-grid');
        }

        // Create cards
        for (const course of courses) {
            const courseCard = await createCourseCard(course, options);
            container.appendChild(courseCard);
        }

        console.log(`✅ ${courses.length} course cards created successfully`);
    }

    // Expose functions globally
    window.CourseCard = {
        create: createCourseCard,
        populate: populateCoursesContainer,
        init: initCourseCardComponent
    };

    console.log('📦 Shared Course Card Component loaded');

})();