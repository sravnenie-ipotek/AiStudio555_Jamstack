/**
 * Teachers Page Integration
 * Fetches teacher data from API and creates interactive teacher cards with drill-down functionality
 * Uses AI Studio Teacher Card shared component
 */

(function() {
    'use strict';

    // Configuration
    const API_BASE_URL = window.location.hostname === 'localhost'
        ? 'http://localhost:3000'
        : 'https://aistudio555jamstack-production.up.railway.app';

    // Get current language from URL
    function getCurrentLocale() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('locale') || 'en';
    }

    // Generate professional photo URL based on teacher expertise
    function generateProfessionalPhotoUrl(teacher, index) {
        // Use specific professional photo keywords based on expertise
        const photoCategories = {
            'AI & Machine Learning Expert': 'woman,teacher,technology,professional',
            'Full-Stack Development Expert': 'man,developer,computer,professional',
            'Career Transition Coach': 'woman,mentor,business,professional',
            'Data Science Instructor': 'man,professor,data,professional'
        };

        const category = photoCategories[teacher.professional_title] || 'teacher,professional,business';

        // Use index to get different photos for each teacher
        const seeds = ['a1b2', 'c3d4', 'e5f6', 'g7h8'];
        const seed = seeds[index % seeds.length];

        return `${PHOTO_SERVICE_URL}${category}&sig=${seed}`;
    }

    // Generate avatar fallback URL
    function generateAvatarUrl(fullName) {
        const initials = fullName.split(' ')
            .map(name => name[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);

        const colors = ['667eea', '764ba2', '4facfe', '43e97b'];
        const colorIndex = fullName.length % colors.length;
        const backgroundColor = colors[colorIndex];

        return `${AVATAR_SERVICE_URL}?name=${encodeURIComponent(fullName)}&size=400&background=${backgroundColor}&color=ffffff&bold=true&font-size=0.4&format=svg`;
    }

    // Load teachers from API
    async function loadTeachers() {
        try {
            console.log('📚 Loading teachers from API...');
            const locale = getCurrentLocale();

            const response = await fetch(`${API_BASE_URL}/api/nd/teachers?locale=${locale}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch teachers: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Teachers data loaded:', data);

            if (data.success && data.data && data.data.length > 0) {
                renderTeacherCards(data.data);
            } else {
                console.warn('⚠️ No teachers found');
                showNoTeachersMessage();
            }

        } catch (error) {
            console.error('❌ Error loading teachers:', error);
            showErrorMessage();
        }
    }

    // Render teacher cards using shared component
    function renderTeacherCards(teachers) {
        const container = document.querySelector('.main-blog-collection-list');
        if (!container) {
            console.error('Container not found');
            return;
        }

        // Get current locale
        const locale = getCurrentLocale();

        // Use shared component to render cards
        if (window.AIStudioTeacherCard) {
            window.AIStudioTeacherCard.renderCards(teachers, container, locale);
            console.log(`✅ Rendered ${teachers.length} teacher cards using shared component`);
        } else {
            // Fallback to old method if shared component not loaded
            console.warn('⚠️ Shared component not loaded, using fallback method');
            renderTeacherCardsFallback(teachers, container, locale);
        }
    }

    // Fallback method for rendering teacher cards (legacy support)
    function renderTeacherCardsFallback(teachers, container, locale) {
        // Clear existing content
        container.innerHTML = '';

        // Create teacher cards using old method
        teachers.forEach((teacher, index) => {
            const card = createTeacherCard(teacher, index);
            container.appendChild(card);
        });

        console.log(`✅ Rendered ${teachers.length} teacher cards using fallback method`);
    }

    // Create individual teacher card (legacy method)
    function createTeacherCard(teacher, index) {
        const card = document.createElement('div');
        card.className = 'main-blog-collection-list-item';
        card.setAttribute('role', 'listitem');

        // Generate professional photo URL - use Unsplash with specific IDs for consistency
        const unsplashIds = ['d1UPkiFd04A', 'WX4i1Jq_o0Y', 'jzY0KRJopEI', 'sibVwORYqs0'];
        const photoUrl = `https://images.unsplash.com/photo-${unsplashIds[index % 4]}?w=400&h=400&fit=crop&q=80`;
        const fallbackUrl = generateAvatarUrl(teacher.full_name);

        // Get locale-specific content
        const locale = getCurrentLocale();

        // Get localized teacher data (if available in database)
        const teacherName = teacher[`full_name_${locale}`] || teacher.full_name;
        const teacherTitle = teacher[`professional_title_${locale}`] || teacher.professional_title;
        const teacherCompany = teacher[`company_${locale}`] || teacher.company;
        const teacherBio = teacher[`bio_${locale}`] || teacher.bio;
        const viewProfileText = getLocalizedText('view_profile', locale);
        const yearsExpText = getLocalizedText('years_experience', locale);
        const coursesText = getLocalizedText('courses', locale);
        const studentsText = getLocalizedText('students', locale);

        // Create teacher detail page URL
        const teacherDetailUrl = `teacher-detail.html?id=${teacher.id}&locale=${locale}`;

        card.innerHTML = `
            <div class="main-blog-single teacher-card shared-card-style" data-teacher-id="${teacher.id}">
                <!-- Teacher Professional Photo -->
                <a href="${teacherDetailUrl}" class="main-blog-image-link teacher-image-link w-inline-block">
                    <img src="${photoUrl}"
                         loading="lazy"
                         alt="${teacherName}"
                         class="main-blog-image teacher-photo"
                         onerror="this.onerror=null; this.src='${fallbackUrl}'">
                </a>

                <!-- Teacher Content -->
                <div class="main-blog-typography teacher-content">
                    <!-- Professional Info -->
                    <div class="teacher-header">
                        <h3 class="teacher-name">
                            <a href="${teacherDetailUrl}" class="teacher-name-link">
                                ${teacherName}
                            </a>
                        </h3>
                        <div class="teacher-title">${teacherTitle}</div>
                        <div class="teacher-company">${teacherCompany}</div>
                    </div>

                    <!-- Statistics -->
                    <div class="teacher-stats">
                        <div class="stat-item">
                            <span class="stat-value">${teacher.statistics?.rating || '4.8'}</span>
                            <span class="stat-label">⭐</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${teacher.statistics?.years_experience || 5}</span>
                            <span class="stat-label">${yearsExpText}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${teacher.statistics?.courses_count || 0}</span>
                            <span class="stat-label">${coursesText}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${teacher.statistics?.students_taught || 0}</span>
                            <span class="stat-label">${studentsText}</span>
                        </div>
                    </div>

                    <!-- Skills Tags -->
                    <div class="teacher-skills">
                        ${(teacher.skills || []).slice(0, 4).map(skill =>
                            `<span class="skill-tag">${skill}</span>`
                        ).join('')}
                    </div>

                    <!-- Bio -->
                    <p class="teacher-bio">
                        ${teacherBio || 'Experienced instructor passionate about teaching.'}
                    </p>

                    <!-- View Profile Button -->
                    <div class="blog-card-link-wrap teacher-profile-link">
                        <a href="${teacherDetailUrl}"
                           class="blog-card-link profile-button">
                            <div class="blog-card-link-text">${viewProfileText}</div>
                            <div class="blog-card-link-arrow profile-button-arrow">→</div>
                        </a>
                    </div>
                </div>
            </div>
        `;

        // Add hover effect
        const teacherCard = card.querySelector('.teacher-card');
        teacherCard.addEventListener('mouseenter', () => {
            teacherCard.style.transform = 'translateY(-5px)';
        });
        teacherCard.addEventListener('mouseleave', () => {
            teacherCard.style.transform = 'translateY(0)';
        });

        return card;
    }

    // Get localized text
    function getLocalizedText(key, locale) {
        const translations = {
            en: {
                view_profile: 'View Full Profile',
                years_experience: 'Years',
                courses: 'Courses',
                students: 'Students',
                no_teachers: 'No teachers available at this time.',
                error_loading: 'Error loading teachers. Please try again later.'
            },
            ru: {
                view_profile: 'Посмотреть профиль',
                years_experience: 'Лет опыта',
                courses: 'Курсов',
                students: 'Студентов',
                no_teachers: 'Преподаватели пока недоступны.',
                error_loading: 'Ошибка загрузки преподавателей. Попробуйте позже.'
            },
            he: {
                view_profile: 'צפה בפרופיל המלא',
                years_experience: 'שנים',
                courses: 'קורסים',
                students: 'סטודנטים',
                no_teachers: 'אין מורים זמינים כרגע.',
                error_loading: 'שגיאה בטעינת מורים. אנא נסה שוב מאוחר יותר.'
            }
        };

        return translations[locale]?.[key] || translations.en[key];
    }

    // Show no teachers message
    function showNoTeachersMessage() {
        const container = document.querySelector('.main-blog-collection-list');
        if (!container) return;

        const locale = getCurrentLocale();
        const message = getLocalizedText('no_teachers', locale);

        container.innerHTML = `
            <div class="empty-state">
                <p>${message}</p>
            </div>
        `;
    }

    // Show error message
    function showErrorMessage() {
        const container = document.querySelector('.main-blog-collection-list');
        if (!container) return;

        const locale = getCurrentLocale();
        const message = getLocalizedText('error_loading', locale);

        container.innerHTML = `
            <div class="error-state">
                <p>${message}</p>
            </div>
        `;
    }

    // Add CSS for teacher cards
    function addTeacherStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .teacher-card {
                background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
                border-radius: 12px;
                overflow: hidden;
                transition: all 0.3s ease;
                min-height: 600px;
                display: flex;
                flex-direction: column;
            }

            .teacher-card:hover {
                box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
            }

            .teacher-photo {
                width: 100%;
                height: 280px;
                object-fit: cover;
                object-position: center top;
                transition: transform 0.3s ease;
            }

            .teacher-image-link:hover .teacher-photo {
                transform: scale(1.05);
            }

            /* Shared Card Style */
            .shared-card-style {
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                transition: all 0.3s ease;
            }

            .shared-card-style:hover {
                transform: translateY(-8px);
                box-shadow: 0 12px 24px rgba(102, 126, 234, 0.3);
            }

            .teacher-content {
                padding: 24px;
                flex: 1;
                display: flex;
                flex-direction: column;
            }

            .teacher-header {
                margin-bottom: 16px;
            }

            .teacher-name {
                font-size: 24px;
                font-weight: 700;
                margin-bottom: 8px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }

            .teacher-name-link {
                text-decoration: none;
                color: inherit;
            }

            .teacher-title {
                font-size: 16px;
                color: #a0aec0;
                margin-bottom: 4px;
            }

            .teacher-company {
                font-size: 14px;
                color: #718096;
                font-style: italic;
            }

            .teacher-stats {
                display: flex;
                gap: 20px;
                margin: 20px 0;
                padding: 16px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
            }

            .stat-item {
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            .stat-value {
                font-size: 20px;
                font-weight: 700;
                color: #667eea;
                margin-bottom: 4px;
            }

            .stat-label {
                font-size: 12px;
                color: #a0aec0;
                text-transform: uppercase;
            }

            .teacher-skills {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin: 16px 0;
            }

            .skill-tag {
                padding: 4px 12px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 500;
            }

            .teacher-bio {
                font-size: 15px;
                line-height: 1.6;
                color: #a0aec0;
                margin-bottom: 20px;
                flex: 1;
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 4;
                -webkit-box-orient: vertical;
            }

            .teacher-profile-link {
                margin-top: auto;
            }

            .profile-button {
                display: inline-flex;
                align-items: center;
                padding: 12px 24px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white !important;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                transition: all 0.3s ease;
            }

            .profile-button:hover {
                background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
                transform: translateX(5px);
            }

            .profile-button-arrow {
                margin-left: 8px;
                transition: transform 0.3s ease;
            }

            .profile-button:hover .profile-button-arrow {
                transform: translateX(5px);
            }

            /* Responsive Grid Layout */
            .main-blog-collection-list {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                gap: 30px;
                padding: 20px 0;
            }

            /* Tablet View */
            @media screen and (max-width: 991px) {
                .main-blog-collection-list {
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 24px;
                }

                .teacher-card {
                    min-height: 550px;
                }

                .teacher-photo {
                    height: 240px;
                }
            }

            /* Mobile View */
            @media screen and (max-width: 767px) {
                .main-blog-collection-list {
                    grid-template-columns: 1fr;
                    gap: 20px;
                    padding: 15px;
                }

                .teacher-card {
                    min-height: auto;
                }

                .teacher-photo {
                    height: 220px;
                }

                .teacher-stats {
                    flex-wrap: wrap;
                    gap: 10px;
                }

                .stat-item {
                    flex: 1 1 45%;
                    min-width: 0;
                }

                .teacher-name {
                    font-size: 20px;
                }

                .teacher-title {
                    font-size: 14px;
                }

                .teacher-skills {
                    gap: 6px;
                }

                .skill-tag {
                    font-size: 11px;
                    padding: 3px 10px;
                }

                .teacher-content {
                    padding: 20px;
                }
            }

            /* Small Mobile View */
            @media screen and (max-width: 480px) {
                .teacher-photo {
                    height: 200px;
                }

                .stat-item {
                    flex: 1 1 100%;
                }

                .profile-button {
                    width: 100%;
                    text-align: center;
                    justify-content: center;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Load navigation data for translations (shared across all pages)
    async function loadNavigationData() {
        try {
            console.log('🧭 [Teachers] Fetching navigation data for translations...');

            // Get current locale
            const urlParams = new URLSearchParams(window.location.search);
            const urlLocale = urlParams.get('locale');
            const savedLocale = localStorage.getItem('preferred_locale');
            const currentLocale = urlLocale || savedLocale || 'en';

            // Fetch navigation data from home-page API
            const response = await fetch(`${API_BASE_URL}/api/nd/home-page?locale=${currentLocale}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ [Teachers] Navigation data received for translations');

            if (result.success && result.data) {
                // Direct translation of navigation elements
                directlyUpdateNavigationElements(result.data, currentLocale);
                console.log('🔄 [Teachers] Navigation translation data ready');
            }

        } catch (error) {
            console.error('❌ [Teachers] Error loading navigation data:', error);
        }
    }

    // Directly update navigation elements with translations
    function directlyUpdateNavigationElements(apiData, locale) {
        console.log('🎯 [Teachers] Directly updating navigation elements...');

        try {
            const navigation = apiData.navigation?.content?.content;
            if (!navigation) {
                console.warn('⚠️ [Teachers] No navigation data found in API response');
                return;
            }

            // Update Career Orientation
            const careerOrientationElements = document.querySelectorAll('[data-i18n="navigation.content.career.orientation"]');
            careerOrientationElements.forEach(element => {
                if (navigation.career_orientation) {
                    element.textContent = navigation.career_orientation;
                    console.log(`✅ [Teachers] Updated Career Orientation: "${navigation.career_orientation}"`);
                }
            });

            // Update Career Center
            const careerCenterElements = document.querySelectorAll('[data-i18n="navigation.content.career.center"]');
            careerCenterElements.forEach(element => {
                if (navigation.career_center) {
                    element.textContent = navigation.career_center;
                    console.log(`✅ [Teachers] Updated Career Center: "${navigation.career_center}"`);
                }
            });

            // Update Sign Up Today buttons
            const signUpButtons = apiData.ui_elements?.content?.content?.buttons?.sign_up_today;
            if (signUpButtons) {
                const signUpElements = document.querySelectorAll('[data-i18n="ui_elements.content.content.buttons.sign_up_today"]');
                signUpElements.forEach(element => {
                    element.textContent = signUpButtons;
                    console.log(`✅ [Teachers] Updated Sign Up Today: "${signUpButtons}"`);
                });
            }

            console.log('🎯 [Teachers] Direct navigation update complete');

        } catch (error) {
            console.error('❌ [Teachers] Error in direct navigation update:', error);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', async () => {
            await loadNavigationData(); // Load navigation for translations first
            addTeacherStyles();
            loadTeachers();
        });
    } else {
        (async () => {
            await loadNavigationData(); // Load navigation for translations first
            addTeacherStyles();
            loadTeachers();
        })();
    }

    // Expose function globally for debugging
    window.reloadTeachers = loadTeachers;

})();