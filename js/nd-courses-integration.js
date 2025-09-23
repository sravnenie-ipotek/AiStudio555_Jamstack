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

    // Course translations
    const COURSE_TRANSLATIONS = {
        ru: {
            'React & Redux Masterclass': {
                title: 'Мастер-класс React и Redux',
                description: 'Освойте React.js и Redux для создания масштабируемых одностраничных приложений'
            },
            'Node.js Backend Development': {
                title: 'Разработка Backend на Node.js',
                description: 'Станьте экспертом backend с Node.js, Express и MongoDB'
            },
            'Python for Data Science': {
                title: 'Python для Data Science',
                description: 'Раскройте мощь Python для анализа данных и машинного обучения'
            },
            'Web Development Bootcamp': {
                title: 'Веб-разработка Интенсив',
                description: 'Изучите современную веб-разработку с нуля до профессионального уровня'
            },
            'Data Science Fundamentals': {
                title: 'Основы Науки о Данных',
                description: 'Освойте анализ данных, машинное обучение и статистику'
            },
            'Advanced Python Programming': {
                title: 'Продвинутое Программирование на Python',
                description: 'Углубленное изучение Python для профессиональной разработки'
            },
            'Introduction to Machine Learning': {
                title: 'Введение в Машинное Обучение',
                description: 'Основы машинного обучения и искусственного интеллекта'
            },
            'Cloud Computing Essentials': {
                title: 'Основы Облачных Вычислений',
                description: 'Изучите AWS, Azure и Google Cloud Platform'
            },
            'Mobile App Development': {
                title: 'Разработка Мобильных Приложений',
                description: 'Создавайте приложения для iOS и Android'
            },
            'DevOps Fundamentals': {
                title: 'Основы DevOps',
                description: 'Изучите CI/CD, контейнеризацию и автоматизацию'
            },
            'UI/UX Design Principles': {
                title: 'Принципы UI/UX Дизайна',
                description: 'Проектирование пользовательских интерфейсов'
            }
        },
        he: {
            'React & Redux Masterclass': {
                title: 'מאסטר קלאס React ו-Redux',
                description: 'שלוט ב-React.js ו-Redux לבניית יישומי דף בודד ניתנים להרחבה'
            },
            'Node.js Backend Development': {
                title: 'פיתוח Backend עם Node.js',
                description: 'הפוך למומחה backend עם Node.js, Express ו-MongoDB'
            },
            'Python for Data Science': {
                title: 'Python למדעי הנתונים',
                description: 'גלה את הכוח של Python לניתוח נתונים ולמידת מכונה'
            },
            'Web Development Bootcamp': {
                title: 'מחנה אימונים לפיתוח אינטרנט',
                description: 'למד פיתוח אינטרנט מודרני מאפס ועד רמה מקצועית'
            },
            'Data Science Fundamentals': {
                title: 'יסודות מדע הנתונים',
                description: 'שלוט בניתוח נתונים, למידת מכונה וסטטיסטיקה'
            },
            'Advanced Python Programming': {
                title: 'תכנות Python מתקדם',
                description: 'לימוד מעמיק של Python לפיתוח מקצועי'
            },
            'Introduction to Machine Learning': {
                title: 'מבוא ללמידת מכונה',
                description: 'יסודות למידת מכונה ובינה מלאכותית'
            },
            'Cloud Computing Essentials': {
                title: 'יסודות מחשוב ענן',
                description: 'למד AWS, Azure ו-Google Cloud Platform'
            },
            'Mobile App Development': {
                title: 'פיתוח אפליקציות ניידות',
                description: 'צור אפליקציות ל-iOS ו-Android'
            },
            'DevOps Fundamentals': {
                title: 'יסודות DevOps',
                description: 'למד CI/CD, קונטיינרים ואוטומציה'
            },
            'UI/UX Design Principles': {
                title: 'עקרונות עיצוב UI/UX',
                description: 'עיצוב ממשקי משתמש'
            }
        }
    };

    // Get translated course data
    function getTranslatedCourse(course, locale) {
        if (locale === 'en') return course;

        const translations = COURSE_TRANSLATIONS[locale];
        if (!translations || !translations[course.title]) return course;

        const translated = translations[course.title];
        return {
            ...course,
            title: translated.title || course.title,
            description: translated.description || course.description
        };
    }

    // Get current language from URL or localStorage
    function getCurrentLocale() {
        const urlParams = new URLSearchParams(window.location.search);
        const urlLocale = urlParams.get('locale') || urlParams.get('lang');
        const savedLocale = localStorage.getItem('preferred_locale');
        return urlLocale || savedLocale || 'en';
    }

    // Main function to load courses data
    async function loadCoursesData() {
        try {
            console.log('📡 Loading courses data from featured courses API...');

            const locale = getCurrentLocale();
            console.log('🌍 Current locale detected:', locale);
            const response = await fetch(`${API_BASE_URL}/api/nd/courses?locale=${locale}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch courses: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Courses data loaded:', data);

            // Populate the courses with shared card component
            if (data.data && data.data.length > 0) {
                console.log(`✅ Found ${data.data.length} courses in API response`);
                console.log('📚 First course title:', data.data[0].title);

                // Transform API response to expected format
                const transformedCourses = data.data.map(course => {
                    // Always use static images from Unsplash since local images don't exist
                    const baseCourse = {
                        id: course.id,
                        title: course.title,
                        description: course.description,
                        category: course.category,
                        image: getStaticCourseImage(course.category), // Always use static image
                        price: course.price,
                        duration: course.duration,
                        lessons_count: course.lessons_count || course.lessons || 0,
                        rating: course.rating || '4.5',
                        reviews_count: course.reviews_count || Math.floor(Math.random() * 50) + 10,
                        url: `detail_courses.html?id=${course.id}&locale=${locale}`
                    };

                    // No need for client-side translation - API handles it
                    return baseCourse;
                });

                // Wrap courses array in expected format
                const coursesData = {
                    courses: transformedCourses
                };
                await populateCoursesSection(coursesData);
                // Pass the full courses data for filtering
                setupCoursesTabFiltering(transformedCourses);
            } else if (Array.isArray(data)) {
                // Handle direct array response
                const coursesData = { courses: data };
                await populateCoursesSection(coursesData);
                // Pass the full courses data for filtering
                setupCoursesTabFiltering(data);
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
        console.log('Course titles:', courses.map(c => c.title));

        // Find all tab content containers
        const tabContainers = document.querySelectorAll('.featured-courses-tab-pane .featured-courses-collection-list');
        console.log(`📦 Found ${tabContainers.length} tab containers`);

        if (tabContainers.length === 0) {
            console.error('❌ No course containers found! Looking for alternative selectors...');
            const altContainers = document.querySelectorAll('.featured-courses-collection-list');
            console.log(`🔍 Alternative search found ${altContainers.length} containers`);
        }

        for (const container of tabContainers) {
            console.log('Processing container:', container);
            // DUAL-SYSTEM: Preserve elements with data-i18n attributes before clearing
            const preservedElements = container.querySelectorAll('[data-i18n]');
            console.log(`🔄 [DUAL-SYSTEM] Preserving ${preservedElements.length} data-i18n elements`);

            // Clear existing placeholder content
            container.innerHTML = '';

            // Initially populate ALL tabs with ALL courses
            // Filtering will happen when tabs are clicked
            let coursesToShow = courses;

            // Populate with courses
            for (const course of coursesToShow.slice(0, 12)) { // Show more courses on courses page
                console.log(`Creating card for course: ${course.title}`);
                const courseCard = await createCourseCardForCoursesPage(course);
                console.log('Card created:', courseCard);
                container.appendChild(courseCard);
            }

            // DUAL-SYSTEM: After populating, remove data-i18n from dynamic content to prevent conflicts
            const dynamicElements = container.querySelectorAll('[data-i18n]');
            dynamicElements.forEach(element => {
                console.log(`🔄 [DUAL-SYSTEM] Removing data-i18n from dynamic element: ${element.getAttribute('data-i18n')}`);
                element.removeAttribute('data-i18n');
            });

            // Hide the "No items found" message
            const emptyState = container.parentElement.querySelector('.w-dyn-empty');
            if (emptyState) {
                emptyState.style.display = 'none';
            }

            // Ensure container is visible with proper grid layout
            container.style.display = 'grid';
            container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
            container.style.gap = '20px';
            container.style.opacity = '1';
            container.style.visibility = 'visible';

            // Also ensure parent elements are visible
            let parent = container.parentElement;
            while (parent && parent !== document.body) {
                if (parent.style.display === 'none') {
                    parent.style.display = '';
                }
                if (parent.style.opacity === '0') {
                    parent.style.opacity = '1';
                }
                parent = parent.parentElement;
            }
        }

        console.log('✅ Courses sections populated with shared cards');
    }

    // Create course card using shared component
    async function createCourseCardForCoursesPage(course) {
        // Always try to use shared course card component first
        if (window.CourseCard && window.CourseCard.create) {
            try {
                const sharedCard = await window.CourseCard.create(course, {
                    customClass: 'featured-courses-collection-item',
                    showFullDescription: true
                });
                return sharedCard;
            } catch (error) {
                console.error('❌ Shared card component failed:', error);
            }
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
                                    <div class="primary-button-text-block" data-i18n="buttons.course_details">Course Details</div>
                                    <div class="primary-button-text-block is-text-absolute" data-i18n="buttons.course_details">Course Details</div>
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
    function setupCoursesTabFiltering(allCourses) {
        console.log('⚙️ Setting up courses tab filtering...');
        console.log(`📚 Total courses available for filtering: ${allCourses.length}`);

        // Store courses data globally for tab filtering
        window.coursesData = allCourses;

        const tabLinks = document.querySelectorAll('.featured-courses-tab-link');
        const tabPanes = document.querySelectorAll('.featured-courses-tab-pane');

        tabLinks.forEach((tabLink, index) => {
            tabLink.addEventListener('click', async (e) => {
                // Don't prevent default - let Webflow handle tab switching
                // e.preventDefault();

                // Small delay to let Webflow switch tabs first
                setTimeout(async () => {
                    // Get tab category
                    const tabText = tabLink.textContent.trim().toLowerCase();
                    console.log(`🏷️ Tab clicked: "${tabText}"`);

                    // Filter courses based on tab selection
                    let filteredCourses = [];
                    if (tabText.includes('all') || tabText === 'הכל' || tabText === 'все') {
                        // Show all courses
                        filteredCourses = allCourses;
                } else if (tabText.includes('web') || tabText.includes('פיתוח אתרים') || tabText.includes('веб')) {
                    filteredCourses = allCourses.filter(c => c.category && c.category.toLowerCase().includes('web'));
                } else if (tabText.includes('app') || tabText.includes('פיתוח נייד') || tabText.includes('приложен')) {
                    filteredCourses = allCourses.filter(c => c.category && (c.category.toLowerCase().includes('app') || c.category.toLowerCase().includes('mobile')));
                } else if (tabText.includes('machine') || tabText.includes('למידת מכונה') || tabText.includes('машин')) {
                    filteredCourses = allCourses.filter(c => c.category && c.category.toLowerCase().includes('machine'));
                } else if (tabText.includes('cloud') || tabText.includes('מחשוב ענן') || tabText.includes('облач')) {
                    filteredCourses = allCourses.filter(c => c.category && c.category.toLowerCase().includes('cloud'));
                } else if (tabText.includes('data') || tabText.includes('נתונים') || tabText.includes('данн')) {
                    filteredCourses = allCourses.filter(c => c.category && c.category.toLowerCase().includes('data'));
                } else {
                    // Default to all if unknown category
                    filteredCourses = allCourses;
                }

                console.log(`🔍 Filtering result: ${filteredCourses.length} courses`);

                // Find the active tab pane (Webflow should have switched it)
                const targetPane = document.querySelector('.featured-courses-tab-pane.w--tab-active');
                if (targetPane) {
                    const container = targetPane.querySelector('.featured-courses-collection-list');
                    if (container) {
                        // Show loading state
                        container.innerHTML = '<div style="padding: 40px; text-align: center; color: white;">Loading courses...</div>';

                        // DUAL-SYSTEM: Preserve data-i18n elements before clearing for filtered courses
                        const preservedElements = container.querySelectorAll('[data-i18n]');
                        console.log(`🔄 [DUAL-SYSTEM] Filtering - Preserving ${preservedElements.length} data-i18n elements`);

                        // Populate filtered courses
                        container.innerHTML = '';
                        for (const course of filteredCourses.slice(0, 12)) {
                            const courseCard = await createCourseCardForCoursesPage(course);
                            container.appendChild(courseCard);
                        }

                        // DUAL-SYSTEM: After filtering, remove data-i18n from new dynamic content
                        const dynamicElements = container.querySelectorAll('[data-i18n]');
                        dynamicElements.forEach(element => {
                            console.log(`🔄 [DUAL-SYSTEM] Filtering - Removing data-i18n: ${element.getAttribute('data-i18n')}`);
                            element.removeAttribute('data-i18n');
                        });

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
                }, 100); // End of setTimeout
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

    // REMOVED: Navigation translation functions per WorkingLogic.md dual-system architecture
    // UI translations are handled by unified-language-manager.js (System 1)
    // This file should only handle dynamic course content (System 2)

    // Initialize when DOM is ready - ONLY load course data (System 2)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', async () => {
            // Small delay to ensure unified language manager (System 1) initializes first
            console.log('⏳ [Courses Integration] Waiting for page setup...');
            setTimeout(() => {
                console.log('🚀 [Courses Integration] Loading course data only (System 2)');
                loadCoursesData();
            }, 500);
        });
    } else {
        // Small delay to ensure unified language manager (System 1) initializes first
        console.log('⏳ [Courses Integration] Waiting for page setup...');
        setTimeout(() => {
            console.log('🚀 [Courses Integration] Loading course data only (System 2)');
            loadCoursesData();
        }, 500);
    }

    // Listen for language changes
    window.addEventListener('languageChanged', (event) => {
        console.log('🌍 [Courses] Language changed to:', event.detail.locale);

        // Update localStorage to ensure consistency
        localStorage.setItem('preferred_locale', event.detail.locale);

        // Clear any existing courses first
        const allContainers = document.querySelectorAll('.featured-courses-collection-list');
        allContainers.forEach(container => {
            container.innerHTML = '<div style="padding: 20px; text-align: center;">Loading courses...</div>';
        });

        // Reload courses with new locale
        setTimeout(() => {
            console.log('🔄 [Courses] Reloading courses for locale:', event.detail.locale);
            loadCoursesData();
        }, 500); // Small delay to let language manager finish
    });

    // Also listen for storage changes (when language is changed in another tab)
    window.addEventListener('storage', (event) => {
        if (event.key === 'preferred_locale' && event.newValue !== event.oldValue) {
            console.log('🌍 [Courses] Language changed in storage to:', event.newValue);
            setTimeout(() => {
                loadCoursesData();
            }, 500);
        }
    });

    // Expose functions globally for debugging
    window.reloadCoursesData = loadCoursesData;

    console.log('📦 ND Courses Integration loaded with shared course cards');

})();