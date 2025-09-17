/**
 * ND COURSES PAGE INTEGRATION
 * Integrates courses.html with the featured courses API using shared course cards
 * Updated to use shared course card component for consistency
 */

(function() {
    'use strict';

    console.log('🎯 ND Courses Integration Loading...');

    // Configuration
    const API_BASE_URL = window.location.hostname === 'localhost'
        ? 'http://localhost:1337'
        : 'https://aistudio555jamstack-production.up.railway.app';

    // Get current language from URL or default to 'en'
    function getCurrentLocale() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('locale') || urlParams.get('lang') || 'en';
    }

    // Main function to load courses data
    async function loadCoursesData() {
        try {
            console.log('📡 Loading courses data from featured courses API...');

            const locale = getCurrentLocale();
            const response = await fetch(`${API_BASE_URL}/api/nd/courses?locale=${locale}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch courses: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Courses data loaded:', data);

            // Populate the courses with shared card component
            if (data.success && data.data) {
                // Wrap courses array in expected format
                const coursesData = {
                    courses: Array.isArray(data.data) ? data.data : [data.data]
                };
                await populateCoursesSection(coursesData);
                // Extract unique categories from courses
                const categories = [...new Set(data.data.map(c => c.category).filter(Boolean))];
                setupCoursesTabFiltering(categories);
            } else if (Array.isArray(data)) {
                // Handle direct array response
                const coursesData = { courses: data };
                await populateCoursesSection(coursesData);
                const categories = [...new Set(data.map(c => c.category).filter(Boolean))];
                setupCoursesTabFiltering(categories);
            } else {
                console.warn('⚠️ No courses data found in database');
                // Don't show anything if no data
            }

        } catch (error) {
            console.error('❌ Error loading courses data:', error);
            // Don't show anything if API fails
        }
    }

    // Populate all courses sections
    async function populateCoursesSection(coursesData) {
        console.log('🎯 Populating courses sections with shared card component...');

        const courses = coursesData.courses || [];
        console.log(`📚 ${courses.length} courses available`);

        // Find all tab content containers
        const tabContainers = document.querySelectorAll('.featured-courses-tab-pane .featured-courses-collection-list');

        for (const container of tabContainers) {
            // Clear existing placeholder content
            container.innerHTML = '';

            // Populate with all courses initially (filtering will happen via tabs)
            for (const course of courses.slice(0, 12)) { // Show more courses on courses page
                const courseCard = await createCourseCardForCoursesPage(course);
                container.appendChild(courseCard);
            }

            // Hide the "No items found" message
            const emptyState = container.parentElement.querySelector('.w-dyn-empty');
            if (emptyState) {
                emptyState.style.display = 'none';
            }
        }

        console.log('✅ Courses sections populated with shared cards');
    }

    // Create course card using shared component
    async function createCourseCardForCoursesPage(course) {
        // Always try to use shared course card component first
        if (window.CourseCard && window.CourseCard.create) {
            try {
                console.log('🎯 Using shared course card component for:', course.title);
                const sharedCard = await window.CourseCard.create(course, {
                    customClass: 'featured-courses-collection-item',
                    showFullDescription: true
                });
                console.log('✅ Shared card created successfully');
                return sharedCard;
            } catch (error) {
                console.error('❌ Shared card component failed:', error);
            }
        } else {
            console.warn('⚠️ Shared course card component not available');
        }

        // Fallback to original featured course card structure
        console.log('🔄 Using fallback card for:', course.title);
        return createFallbackCourseCard(course);
    }

    // Fallback course card (same structure as featured courses)
    function createFallbackCourseCard(course) {
        const courseItem = document.createElement('div');
        courseItem.className = 'featured-courses-collection-item w-dyn-item';
        courseItem.setAttribute('role', 'listitem');

        // Get category color
        const categoryColor = getCourseColorByCategory(course.category);

        courseItem.innerHTML = `
            <div class="featured-courses-single" style="background-color: rgb(4,25,63)">
                <a href="${course.url || '#'}" class="featured-courses-image-link w-inline-block">
                    <img loading="lazy"
                         src="${course.image || 'images/placeholder.jpg'}"
                         alt="${course.title}"
                         class="featured-courses-image">
                </a>
                <div class="featured-courses-typography">
                    <div class="featured-courses-name-wrap">
                        <a href="${course.url || '#'}" class="featured-courses-name course-title-overflow">
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
                            <a href="${course.url || '#'}"
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
                <div class="featured-courses-categories-tag course-category-overflow"
                     style="background-color: ${categoryColor}; color: rgb(255,255,255)">
                    ${course.category}
                </div>
            </div>
        `;

        // Add text overflow handling
        setupTextOverflowForCard(courseItem);

        return courseItem;
    }

    // Setup course tab filtering for courses page
    function setupCoursesTabFiltering(categoriesData) {
        console.log('⚙️ Setting up courses tab filtering...');

        const tabLinks = document.querySelectorAll('.featured-courses-tab-link');
        const tabPanes = document.querySelectorAll('.featured-courses-tab-pane');

        tabLinks.forEach((tabLink, index) => {
            tabLink.addEventListener('click', async (e) => {
                e.preventDefault();

                // Get tab category
                let category = 'all';
                const tabText = tabLink.textContent.trim().toLowerCase();

                if (tabText.includes('web')) category = 'web-development';
                else if (tabText.includes('app')) category = 'app-development';
                else if (tabText.includes('machine')) category = 'machine-learning';
                else if (tabText.includes('cloud')) category = 'cloud-computing';

                // Filter and populate the active tab
                const filteredCourses = categoriesData[category] || [];
                console.log(`🔍 Filtering to category "${category}": ${filteredCourses.length} courses`);

                // Find the corresponding tab pane
                const targetPane = tabPanes[index];
                if (targetPane) {
                    const container = targetPane.querySelector('.featured-courses-collection-list');
                    if (container) {
                        // Show loading state
                        container.innerHTML = '<div style="padding: 40px; text-align: center; color: white;">Loading courses...</div>';

                        // Populate filtered courses
                        container.innerHTML = '';
                        for (const course of filteredCourses.slice(0, 12)) {
                            const courseCard = await createCourseCardForCoursesPage(course);
                            container.appendChild(courseCard);
                        }

                        // Show empty state if no courses
                        const emptyState = targetPane.querySelector('.w-dyn-empty');
                        if (emptyState) {
                            if (filteredCourses.length === 0) {
                                emptyState.style.display = 'block';
                                emptyState.innerHTML = '<div style="padding: 40px; text-align: center; color: #666;">No courses found in this category.</div>';
                            } else {
                                emptyState.style.display = 'none';
                            }
                        }
                    }
                }
            });
        });

        console.log('✅ Courses tab filtering setup complete');
    }

    // Helper function to setup text overflow for cards
    function setupTextOverflowForCard(cardElement) {
        const titleElement = cardElement.querySelector('.course-title-overflow');
        if (titleElement && titleElement.textContent.length > 60) {
            titleElement.setAttribute('title', titleElement.textContent);
            titleElement.style.overflow = 'hidden';
            titleElement.style.textOverflow = 'ellipsis';
            titleElement.style.display = '-webkit-box';
            titleElement.style.webkitLineClamp = '2';
            titleElement.style.webkitBoxOrient = 'vertical';
        }

        const categoryElement = cardElement.querySelector('.course-category-overflow');
        if (categoryElement && categoryElement.textContent.length > 15) {
            categoryElement.setAttribute('title', categoryElement.textContent);
        }
    }

    // Helper function to generate star rating
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

    // Helper function to get course color by category
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

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadCoursesData);
    } else {
        loadCoursesData();
    }

    // Expose functions globally for debugging
    window.reloadCoursesData = loadCoursesData;

    console.log('📦 ND Courses Integration loaded with shared course cards');

})();