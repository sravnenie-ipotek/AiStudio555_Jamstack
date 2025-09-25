/**
 * COURSE DETAILS PAGE INTEGRATION
 * Connects detail_courses.html to the nd_courses API endpoint
 * Handles dynamic content population and preview mode
 */

(function() {
    'use strict';

    // API Configuration
    const API_BASE = window.location.hostname === 'localhost'
        ? 'http://localhost:3000'
        : 'https://aistudio555jamstack-production.up.railway.app';

    // Static course images mapping by category
    const COURSE_IMAGES = {
        'Web Development': 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80',
        'App Development': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
        'Machine Learning': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
        'Data Science': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
        'Programming': 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&q=80',
        'AI & ML': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
        'Cloud Computing': 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80',
        'Mobile Dev': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
        'DevOps': 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&q=80',
        'default': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80'
    };

    // Get static image for course based on category
    function getStaticCourseImage(category) {
        return COURSE_IMAGES[category] || COURSE_IMAGES['default'];
    }

    // Extract URL parameters
    function getUrlParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            id: params.get('id'),
            preview: params.get('preview') === 'true',
            locale: params.get('locale') || localStorage.getItem('preferred_locale') || 'en'
        };
    }

    // Fetch course data from API
    async function fetchCourseData(courseId, preview = false, locale = 'en') {
        try {
            const url = `${API_BASE}/api/nd/courses/${courseId}?locale=${locale}${preview ? '&preview=true' : ''}`;
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

        // Course Name and Description - Webflow Structure
        const courseName = document.querySelector('.course-details-name');
        if (courseName) {
            courseName.textContent = course.title || '';
            courseName.removeAttribute('data-i18n'); // Prevent language manager interference
            console.log('✅ Set course name to:', course.title);
        }

        const courseDescriptionText = document.querySelector('.course-details-description-text');
        if (courseDescriptionText) {
            courseDescriptionText.textContent = course.short_description || course.description || '';
            courseDescriptionText.removeAttribute('data-i18n'); // Prevent language manager interference
            console.log('✅ Set course description to:', course.short_description || course.description);
        }

        // Author Information - Webflow Structure
        const authorName = document.querySelector('.course-details-author-name');
        if (authorName) {
            authorName.textContent = course.instructor || 'Expert Instructor';
            authorName.removeAttribute('data-i18n');
        }

        const authorBio = document.querySelector('.course-details-author-bio');
        if (authorBio) {
            authorBio.textContent = course.instructor_bio || 'Experienced professional with years of industry expertise and a passion for teaching.';
            authorBio.removeAttribute('data-i18n');
        }

        const authorImage = document.querySelector('.courses-single-author-image');
        if (authorImage) {
            authorImage.src = course.instructor_image || 'images/default-instructor.jpg';
            authorImage.alt = course.instructor || 'Instructor';
        }

        // Short Categories - Webflow Structure
        const shortCategoriesText = document.querySelector('.course-details-short-categories-text');
        if (shortCategoriesText) {
            shortCategoriesText.textContent = course.category || 'General';
            shortCategoriesText.removeAttribute('data-i18n');
        }

        // Show course details content with opacity animation
        const courseDetailsContent = document.querySelector('.course-details-content');
        if (courseDetailsContent) {
            courseDetailsContent.style.opacity = '1';
            courseDetailsContent.classList.add('visible');
            console.log('✅ Course details content made visible');
        }

        // Breadcrumb
        const breadcrumb = document.querySelector('.course-breadcrumb-title');
        if (breadcrumb) {
            breadcrumb.textContent = course.title || '';
        }

        // Main Content Area - Custom Structure
        const fullDescription = document.querySelector('.course-full-description');
        if (fullDescription) {
            fullDescription.textContent = course.description || '';
        }

        const curriculumDescription = document.querySelector('.course-curriculum-description');
        if (curriculumDescription) {
            curriculumDescription.textContent = `This ${course.lessons_count || 0}-lesson course covers all aspects of ${course.title || 'the subject'}.`;
        }

        // Rating
        const ratingContainer = document.querySelector('.course-rating-stars');
        if (ratingContainer && course.rating) {
            ratingContainer.innerHTML = generateStarRating(course.rating);
        }

        const ratingText = document.querySelector('.course-rating-text');
        if (ratingText) {
            ratingText.textContent = `${course.rating || 5.0} (${course.reviews_count || 0} reviews)`;
        }

        // Course meta information
        const instructorElement = document.querySelector('.course-instructor');
        if (instructorElement) instructorElement.textContent = course.instructor || 'Expert Instructor';

        const durationElement = document.querySelector('.course-duration');
        if (durationElement) durationElement.textContent = course.duration || '8 weeks';

        // Sidebar price - Webflow Structure
        const currentPriceElement = document.querySelector('.courses-single-current-price');
        if (currentPriceElement) currentPriceElement.textContent = `$${course.price || '99.99'}`;

        const oldPriceElement = document.querySelector('.courses-single-old-price');
        if (oldPriceElement && course.old_price) {
            oldPriceElement.textContent = `$${course.old_price}`;
            oldPriceElement.style.textDecoration = 'line-through';
        }

        const lessonsCountElement = document.querySelector('.course-lessons-count');
        if (lessonsCountElement) lessonsCountElement.textContent = course.lessons_count || '0';

        const studentsCountElement = document.querySelector('.course-students-count');
        if (studentsCountElement) studentsCountElement.textContent = course.students_count || '0';

        const levelElement = document.querySelector('.course-level');
        if (levelElement) levelElement.textContent = course.level || 'All Levels';

        // Category tag - Webflow Structure
        const categoryTag = document.querySelector('.courses-single-category-tag');
        if (categoryTag) categoryTag.textContent = course.category || 'General';

        // Instructor info (sidebar)
        const instructorNameElement = document.querySelector('.instructor-name');
        if (instructorNameElement) instructorNameElement.textContent = course.instructor || 'Expert Instructor';

        const instructorImageElement = document.querySelector('.instructor-image');
        if (instructorImageElement) {
            instructorImageElement.src = course.instructor_image || 'images/default-instructor.jpg';
            instructorImageElement.alt = course.instructor || 'Instructor';
        }

        const instructorBioElement = document.querySelector('.instructor-bio');
        if (instructorBioElement) {
            instructorBioElement.textContent = course.instructor_bio || 'Experienced professional with years of industry expertise and a passion for teaching.';
        }

        // Course video/image thumbnail - Webflow Structure
        const courseThumbnail = document.querySelector('.courses-single-video-thumbnail');
        if (courseThumbnail) {
            const thumbnailUrl = course.image || getStaticCourseImage(course.category);
            courseThumbnail.src = thumbnailUrl;
            courseThumbnail.alt = course.title || 'Course';
        }

        // Course Objectives (What You'll Learn)
        if (course.what_you_learn && course.what_you_learn.length > 0) {
            const objectivesContainer = document.querySelector('.course-objectives-list');
            if (objectivesContainer) {
                const objectives = Array.isArray(course.what_you_learn) ? course.what_you_learn : course.what_you_learn.split(',').map(obj => obj.trim());
                objectivesContainer.innerHTML = objectives.map(obj =>
                    `<div class="course-objective-item">
                        <span class="checkmark">✓</span>
                        <span>${obj}</span>
                    </div>`
                ).join('');
            }
        }

        // Course Requirements
        if (course.requirements && course.requirements.length > 0) {
            const requirementsContainer = document.querySelector('.course-requirements-list');
            if (requirementsContainer) {
                const requirements = Array.isArray(course.requirements) ? course.requirements : course.requirements.split(',').map(req => req.trim());
                requirementsContainer.innerHTML = requirements.map(req =>
                    `<div class="course-requirement-item">${req}</div>`
                ).join('');
            }
        }

        // Lessons/Curriculum
        if (course.syllabus && course.syllabus.length > 0) {
            const lessonsContainer = document.querySelector('.course-lessons-container');
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

        // Features - Webflow Structure
        if (course.features && course.features.length > 0) {
            const featuresContainer = document.querySelector('.courses-single-features');
            if (featuresContainer) {
                // Handle both array and string formats
                const features = Array.isArray(course.features)
                    ? course.features
                    : course.features.split(',').map(f => f.trim());

                featuresContainer.innerHTML = features.map(feature =>
                    `<div class="courses-single-feature-item">
                        <div class="courses-single-feature-icon"></div>
                        <div class="courses-single-feature-text">${feature}</div>
                    </div>`
                ).join('');
            }
        } else {
            // Default features if none provided
            const featuresContainer = document.querySelector('.courses-single-features');
            if (featuresContainer) {
                const defaultFeatures = [
                    'Lifetime access',
                    'Certificate of completion',
                    'Expert instructor support',
                    'Mobile learning'
                ];
                featuresContainer.innerHTML = defaultFeatures.map(feature =>
                    `<div class="courses-single-feature-item">
                        <div class="courses-single-feature-icon"></div>
                        <div class="courses-single-feature-text">${feature}</div>
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
        console.log('🔍 Found content areas to show:', contentAreas.length);
        contentAreas.forEach(el => {
            el.style.display = 'block';
            console.log('✅ Showing content area:', el.className);
        });

        // Also ensure main sections are visible
        const mainSections = document.querySelectorAll('.course-overview-section, .course-objectives-section, .course-curriculum-section, .course-requirements-section');
        console.log('🔍 Found main sections:', mainSections.length);
        mainSections.forEach(section => {
            section.style.display = 'block';
            section.style.opacity = '1';
            section.style.visibility = 'visible';
            console.log('✅ Ensuring section is visible:', section.className);
        });

        // Course guarantee
        const guaranteeTextElement = document.querySelector('.course-guarantee-text');
        if (guaranteeTextElement) {
            guaranteeTextElement.textContent = '30-day money-back guarantee';
        }

        // CTA section
        const ctaTitleElement = document.querySelector('.course-cta-title');
        if (ctaTitleElement) {
            ctaTitleElement.textContent = `Ready to start ${course.title}?`;
        }

        const ctaDescriptionElement = document.querySelector('.course-cta-description');
        if (ctaDescriptionElement) {
            ctaDescriptionElement.textContent = `Join thousands of students who have already mastered ${course.category} with our comprehensive course.`;
        }

        // Ensure all content is visible in Webflow structure
        // (courseDetailsContent already declared above)

        // Remove any hiding classes and ensure visibility
        const allElements = document.querySelectorAll('.courses-single *');
        allElements.forEach(el => {
            if (el.classList.contains('w-dyn-hide-empty') || el.style.opacity === '0' || el.style.display === 'none') {
                el.style.display = 'block';
                el.style.opacity = '1';
                el.style.visibility = 'visible';
                el.classList.remove('w-dyn-hide-empty');
            }
        });

        console.log('✅ Custom shared course details component populated successfully');

        // Sync absolute text elements after populating content
        setTimeout(syncAbsoluteTextElements, 100);
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

    // Fetch page UI translations
    async function fetchPageTranslations(locale) {
        try {
            const url = `${API_BASE}/api/nd/course-details-page?locale=${locale}`;
            console.log('🔍 Fetching page translations:', url);

            const response = await fetch(url);
            if (!response.ok) {
                console.warn('Failed to fetch page translations');
                return null;
            }

            const data = await response.json();
            if (data.success && data.data) {
                return data.data;
            }
            return data;
        } catch (error) {
            console.error('Error fetching page translations:', error);
            return null;
        }
    }

    // Apply page translations with smart duplication prevention
    function applyPageTranslations(translations) {
        if (!translations) return;

        console.log('📝 Applying page translations with duplication prevention...');

        // Get current locale for special handling
        const params = getUrlParams();
        const locale = params.locale;

        // CRITICAL: Handle button translations individually to prevent duplication
        const buttonTranslations = {
            'ui.content.buttons.sign_up_today': locale === 'he' ? 'הירשם היום' : (locale === 'ru' ? 'Записаться сегодня' : 'Sign Up Today'),
            'ui_elements.buttons.enroll_now': locale === 'he' ? 'הירשם עכשיו' : (locale === 'ru' ? 'Записаться сейчас' : 'Enroll Now'),
            'cta.start_learning': locale === 'he' ? 'התחל ללמוד' : (locale === 'ru' ? 'Начать обучение' : 'Start Learning'),
            'cta.browse_courses': locale === 'he' ? 'עיין בקורסים' : (locale === 'ru' ? 'Просмотреть курсы' : 'Browse Courses'),
            'cta.get_in_touch': locale === 'he' ? 'צור קשר' : (locale === 'ru' ? 'Связаться' : 'Get in Touch'),
            'cta.check_out_courses': locale === 'he' ? 'הצג קורסים' : (locale === 'ru' ? 'Посмотреть курсы' : 'Check Out Courses')
        };

        // Apply button translations carefully - only to normal text elements first
        Object.entries(buttonTranslations).forEach(([key, translation]) => {
            const elements = document.querySelectorAll(`[data-i18n="${key}"]:not(.is-text-absolute)`);
            elements.forEach(element => {
                const currentText = element.textContent.trim();

                // Only translate if it's not already translated
                if (!currentText.match(/[\u0590-\u05FF\u0400-\u04FF]/)) {
                    element.textContent = translation;
                    element.removeAttribute('data-i18n');
                    console.log(`✅ Translated button: ${key} -> ${translation}`);
                }
            });
        });

        // Apply other page translations (non-button elements)
        document.querySelectorAll('[data-i18n]').forEach(element => {
            // Skip button elements - already handled above
            if (element.closest('.primary-button') || element.classList.contains('primary-button-text-block')) {
                return;
            }

            const key = element.getAttribute('data-i18n');

            // Skip if already translated
            if (locale === 'he' && element.textContent && element.textContent.match(/[\u0590-\u05FF]/)) {
                return;
            }
            if (locale === 'ru' && element.textContent && element.textContent.match(/[\u0400-\u04FF]/)) {
                return;
            }

            const keys = key.split('.');
            let value = translations;

            for (const k of keys) {
                if (value && value[k]) {
                    if (value[k].content && typeof value[k].content === 'object') {
                        value = value[k].content;
                    } else {
                        value = value[k];
                    }
                } else {
                    break;
                }
            }

            if (value && typeof value === 'string') {
                element.textContent = value;
                element.removeAttribute('data-i18n');
            } else if (value && value.content && typeof value.content === 'string') {
                element.textContent = value.content;
                element.removeAttribute('data-i18n');
            } else if (value && typeof value === 'object' && keys[keys.length - 1] in value) {
                element.textContent = value[keys[keys.length - 1]];
                element.removeAttribute('data-i18n');
            }
        });

        // Set RTL for Hebrew
        if (locale === 'he') {
            document.documentElement.setAttribute('dir', 'rtl');
            document.documentElement.setAttribute('lang', 'he');
        } else {
            document.documentElement.setAttribute('dir', 'ltr');
            document.documentElement.setAttribute('lang', locale);
        }

        // Sync absolute text elements with translated text (with duplication prevention)
        setTimeout(() => syncAbsoluteTextElements(), 100);
    }

    // Function to sync absolute text elements (for animation effects)
    function syncAbsoluteTextElements() {
        // Find all buttons with animation text elements
        const buttons = document.querySelectorAll('.primary-button, .w-inline-block');

        buttons.forEach(button => {
            const normalText = button.querySelector('.primary-button-text-block:not(.is-text-absolute)');
            const absoluteText = button.querySelector('.primary-button-text-block.is-text-absolute');

            if (normalText && absoluteText && normalText.textContent.trim()) {
                // Only sync if the normal text has content and is different from absolute text
                const normalContent = normalText.textContent.trim();
                const absoluteContent = absoluteText.textContent.trim();

                if (normalContent && normalContent !== absoluteContent) {
                    // Preserve existing transform styles when updating text
                    const existingTransform = absoluteText.style.transform;
                    absoluteText.textContent = normalContent;

                    // Restore the transform if it was changed
                    if (existingTransform && !absoluteText.style.transform) {
                        absoluteText.style.transform = existingTransform;
                    }

                    console.log('✅ Synced button text:', normalContent);
                }
            }
        });

        // Ensure proper positioning for Hebrew RTL buttons
        const rtlButtons = document.querySelectorAll('[dir="rtl"] .primary-button, body[dir="rtl"] .primary-button');
        rtlButtons.forEach(button => {
            const textWrap = button.querySelector('.primary-button-text-wrap');
            if (textWrap) {
                textWrap.style.overflow = 'hidden';
                textWrap.style.height = '1.2em';
                textWrap.style.position = 'relative';
            }
        });

        console.log('🔄 Synced absolute text elements for all buttons with transform preservation');
    }

    // Initialize on page load
    async function init() {
        console.log('🚀 Initializing Course Details Page...');

        const params = getUrlParams();

        // Use locale from URL parameters (with fallbacks)
        const locale = params.locale;
        console.log('🌍 Using locale:', locale);

        // Update localStorage for consistency
        localStorage.setItem('preferred_locale', locale);

        // IMPORTANT: Wait for unified language manager to complete first
        // This ensures UI translations are applied before we load dynamic content
        if (window.languageManager && window.languageManager.initialized) {
            console.log('⏳ Waiting for language manager to complete...');
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        // Fetch and apply page translations (for elements not handled by unified manager)
        const translations = await fetchPageTranslations(locale);
        if (translations) {
            applyPageTranslations(translations);
        }

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
        const courseData = await fetchCourseData(params.id, params.preview, locale);

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

        // Add event listener for language changes
        window.addEventListener('languageChanged', () => {
            // Wait for translation to complete, then sync absolute text
            setTimeout(syncAbsoluteTextElements, 100);
        });

        // Also listen for DOM mutations to catch any translation changes
        const observer = new MutationObserver((mutations) => {
            let shouldSync = false;
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    // Check if any button text was changed
                    const target = mutation.target;
                    if (target.classList && (target.classList.contains('primary-button-text-block') ||
                        target.closest('.primary-button-text-block'))) {
                        shouldSync = true;
                    }
                }
            });

            if (shouldSync) {
                setTimeout(syncAbsoluteTextElements, 50);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
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