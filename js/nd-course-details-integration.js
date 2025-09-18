/**
 * COURSE DETAILS PAGE INTEGRATION
 * Connects detail_courses.html to the nd_courses API endpoint
 * Handles dynamic content population and preview mode
 */

(function() {
    'use strict';

    // API Configuration
    const API_BASE = window.location.hostname === 'localhost'
        ? 'http://localhost:1337'
        : 'https://aistudio555jamstack-production.up.railway.app';

    // Extract URL parameters
    function getUrlParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            id: params.get('id'),
            preview: params.get('preview') === 'true'
        };
    }

    // Fetch course data from API
    async function fetchCourseData(courseId, preview = false) {
        try {
            const url = `${API_BASE}/api/courses/${courseId}${preview ? '?preview=true' : ''}`;
            console.log('🔍 Fetching course:', url);

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch course: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Course data received:', data);

            // Handle wrapped API response format
            if (data.success && data.data) {
                return data.data;
            }
            return data;
        } catch (error) {
            console.error('❌ Error fetching course:', error);
            return null;
        }
    }

    // Generate star rating HTML
    function generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        let starsHtml = '';

        for (let i = 0; i < 5; i++) {
            const opacity = i < fullStars ? '1' : '0.3';
            starsHtml += `<img src="images/Featured-Courses-Rating-Icon.svg"
                             alt="Star"
                             style="opacity: ${opacity}; width: 16px; height: 16px; display: inline-block; margin-right: 2px;">`;
        }

        return starsHtml;
    }

    // Format price display
    function formatPrice(price, oldPrice) {
        if (!price || price === 0) {
            return '<span>Free</span>';
        }

        let html = `<span>$${price}</span>`;
        if (oldPrice && oldPrice > price) {
            html = `<span style="text-decoration: line-through; opacity: 0.7; margin-right: 8px;">$${oldPrice}</span>${html}`;
        }
        return html;
    }

    // Populate course details
    function populateCourseDetails(course) {
        console.log('📝 Populating course details...');

        // Hero Section
        const heroTitle = document.querySelector('.courses-single-hero-heading');
        if (heroTitle) heroTitle.textContent = course.title || '';

        const heroDescription = document.querySelector('.courses-single-hero-paragraph');
        if (heroDescription) heroDescription.textContent = course.short_description || course.description || '';

        // Breadcrumb
        const breadcrumb = document.querySelector('.breadcrumbs-name');
        if (breadcrumb) breadcrumb.textContent = course.title || '';

        // Main Content Area
        const mainTitle = document.querySelector('.courses-single-content-heading');
        if (mainTitle) mainTitle.textContent = course.title || '';

        const mainDescription = document.querySelector('.courses-single-content-paragraph');
        if (mainDescription) mainDescription.textContent = course.description || '';

        // Course Image
        const courseImage = document.querySelector('.courses-single-image');
        if (courseImage && course.thumbnail_url) {
            courseImage.src = course.thumbnail_url;
            courseImage.alt = course.title || '';
        }

        // Video (if available)
        const videoFrame = document.querySelector('.courses-single-video iframe');
        if (videoFrame && course.video_url) {
            videoFrame.src = course.video_url;
        }

        // Rating
        const ratingContainer = document.querySelector('.courses-single-rating-icon-wrapper');
        if (ratingContainer && course.rating) {
            ratingContainer.innerHTML = generateStarRating(course.rating);
        }

        const ratingText = document.querySelector('.courses-single-rating-text');
        if (ratingText) {
            ratingText.textContent = `${course.rating || 5.0} (${course.reviews_count || 0} reviews)`;
        }

        // Price
        const priceElement = document.querySelector('.courses-single-price-text');
        if (priceElement) {
            priceElement.innerHTML = formatPrice(course.price, course.old_price);
        }

        // Meta Information
        const durationElement = document.querySelector('.courses-single-meta-text:nth-of-type(1)');
        if (durationElement) durationElement.textContent = course.duration || '8 weeks';

        const lessonsElement = document.querySelector('.courses-single-meta-text:nth-of-type(2)');
        if (lessonsElement) lessonsElement.textContent = `${course.lessons_count || 0} Lessons`;

        const levelElement = document.querySelector('.courses-single-meta-text:nth-of-type(3)');
        if (levelElement) levelElement.textContent = course.level || 'All Levels';

        const categoryElement = document.querySelector('.courses-single-categories-tag');
        if (categoryElement) {
            categoryElement.textContent = course.category || 'General';
            // Apply category color
            const categoryColor = getCategoryColor(course.category);
            categoryElement.style.backgroundColor = categoryColor;
        }

        // Instructor Information
        const instructorName = document.querySelector('.courses-single-instructor-name');
        if (instructorName) instructorName.textContent = course.instructor || 'Expert Instructor';

        const instructorBio = document.querySelector('.courses-single-instructor-bio');
        if (instructorBio) instructorBio.textContent = course.instructor_bio || 'Experienced professional with years of industry expertise.';

        const instructorImage = document.querySelector('.courses-single-instructor-image');
        if (instructorImage && course.instructor_image) {
            instructorImage.src = course.instructor_image;
            instructorImage.alt = course.instructor || '';
        }

        // Course Objectives
        if (course.objectives) {
            const objectivesContainer = document.querySelector('.courses-single-objectives-list');
            if (objectivesContainer) {
                const objectives = course.objectives.split(',').map(obj => obj.trim());
                objectivesContainer.innerHTML = objectives.map(obj =>
                    `<li class="courses-single-objectives-item">
                        <img src="images/Courses-Single-Check-Icon.svg" alt="✓" class="courses-single-objectives-icon">
                        <span>${obj}</span>
                    </li>`
                ).join('');
            }
        }

        // Course Requirements
        if (course.requirements) {
            const requirementsContainer = document.querySelector('.courses-single-requirements-list');
            if (requirementsContainer) {
                const requirements = course.requirements.split(',').map(req => req.trim());
                requirementsContainer.innerHTML = requirements.map(req =>
                    `<li class="courses-single-requirements-item">${req}</li>`
                ).join('');
            }
        }

        // Lessons/Curriculum
        if (course.lessons) {
            const lessonsContainer = document.querySelector('.courses-single-curriculum-list, .courses-single-lessons-list');
            if (lessonsContainer) {
                try {
                    const lessons = typeof course.lessons === 'string' ? JSON.parse(course.lessons) : course.lessons;
                    if (Array.isArray(lessons)) {
                        lessonsContainer.innerHTML = lessons.map((lesson, index) =>
                            `<div class="courses-single-lesson-item">
                                <div class="courses-single-lesson-number">${index + 1}</div>
                                <div class="courses-single-lesson-content">
                                    <div class="courses-single-lesson-title">${lesson.title || lesson}</div>
                                    ${lesson.duration ? `<div class="courses-single-lesson-duration">${lesson.duration}</div>` : ''}
                                </div>
                            </div>`
                        ).join('');
                    }
                } catch (e) {
                    console.warn('Could not parse lessons:', e);
                    // Fallback: treat as comma-separated string
                    if (typeof course.lessons === 'string') {
                        const lessonsList = course.lessons.split(',').map(l => l.trim());
                        lessonsContainer.innerHTML = lessonsList.map((lesson, index) =>
                            `<div class="courses-single-lesson-item">
                                <div class="courses-single-lesson-number">${index + 1}</div>
                                <div class="courses-single-lesson-title">${lesson}</div>
                            </div>`
                        ).join('');
                    }
                }
            }
        }

        // Features
        if (course.features) {
            const featuresContainer = document.querySelector('.courses-single-features-list');
            if (featuresContainer) {
                const features = course.features.split(',').map(f => f.trim());
                featuresContainer.innerHTML = features.map(feature =>
                    `<div class="courses-single-feature-item">
                        <img src="images/Courses-Single-Feature-Icon.svg" alt="✓" class="courses-single-feature-icon">
                        <span>${feature}</span>
                    </div>`
                ).join('');
            }
        }

        // Students Enrolled
        const studentsElement = document.querySelector('.courses-single-students-count');
        if (studentsElement) {
            studentsElement.textContent = `${course.students_enrolled || 0} students enrolled`;
        }

        // Remove empty state placeholders
        const emptyStates = document.querySelectorAll('.w-dyn-bind-empty, .w-dyn-empty');
        emptyStates.forEach(el => {
            el.style.display = 'none';
        });

        // Show content areas
        const contentAreas = document.querySelectorAll('.w-dyn-hide-empty');
        contentAreas.forEach(el => {
            el.style.display = 'block';
        });

        console.log('✅ Course details populated successfully');
    }

    // Get category color
    function getCategoryColor(category) {
        if (!category) return '#667eea';

        const cat = category.toLowerCase();
        if (cat.includes('web')) return '#667eea';
        if (cat.includes('app') || cat.includes('mobile')) return '#f093fb';
        if (cat.includes('machine') || cat.includes('ml') || cat.includes('ai')) return '#4facfe';
        if (cat.includes('cloud')) return '#43e97b';
        if (cat.includes('data')) return '#ff6b6b';
        if (cat.includes('design')) return '#feca57';

        return '#667eea';
    }

    // Show error message
    function showError(message) {
        console.error('❌ Error:', message);

        // Find or create error container
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

        // Hide after 5 seconds
        setTimeout(() => {
            errorContainer.style.display = 'none';
        }, 5000);
    }

    // Initialize on page load
    async function init() {
        console.log('🚀 Initializing Course Details Page...');

        const params = getUrlParams();

        if (!params.id) {
            showError('No course ID provided in URL');
            return;
        }

        // Show loading state
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'course-loading';
        loadingIndicator.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 18px;
            color: #667eea;
            z-index: 9999;
        `;
        loadingIndicator.textContent = 'Loading course details...';
        document.body.appendChild(loadingIndicator);

        // Fetch and populate course data
        const courseData = await fetchCourseData(params.id, params.preview);

        // Remove loading indicator
        loadingIndicator.remove();

        if (courseData) {
            populateCourseDetails(courseData);

            // Update page title
            document.title = `${courseData.title || 'Course'} - AI Studio`;

            // Add enrollment button handlers
            const enrollButtons = document.querySelectorAll('.courses-single-enroll-button, .primary-button');
            enrollButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    // Open contact modal or navigate to enrollment
                    console.log('Enrollment clicked for course:', courseData.id);
                    // You can trigger the contact form modal here
                    if (window.openContactModal) {
                        window.openContactModal();
                    }
                });
            });
        } else {
            showError('Failed to load course details. Please try again.');
        }
    }

    // Start initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose functions globally for debugging
    window.ndCourseDetails = {
        fetchCourseData,
        populateCourseDetails,
        init
    };

})();