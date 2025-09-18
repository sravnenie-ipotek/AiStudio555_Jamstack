/**
 * TEACHERS PAGE INTEGRATION
 * Integrates teachers.html with the teachers API using static profile images
 * NO FACE GENERATION - Uses professional abstract images only
 */

(function() {
    'use strict';

    console.log('👨‍🏫 Teachers Integration Loading...');
    console.log('📍 Current URL:', window.location.href);

    // Configuration
    const API_BASE_URL = window.location.hostname === 'localhost'
        ? 'http://localhost:3000'
        : 'https://aistudio555jamstack-production.up.railway.app';

    console.log('🔧 API Base URL:', API_BASE_URL);

    // Static teacher images mapping - NO FACES!
    function getStaticTeacherImage(teacher) {
        const staticImages = {
            30: "images/teacher-30-dr.-sarah-chen.jpg",      // Dr. Sarah Chen
            31: "images/teacher-31-dr.-michael-rodriguez.jpg", // Dr. Michael Rodriguez
            32: "images/teacher-32-dr.-elena-petrov.jpg",    // Dr. Elena Petrov
            33: "images/teacher-33-david-kim.jpg",           // David Kim
            34: "images/teacher-34-anna-kowalski.jpg",       // Anna Kowalski
            35: "images/teacher-35-dr.-james-wilson.jpg",    // Dr. James Wilson
            36: "images/teacher-36-maria-santos.jpg",        // Maria Santos
            37: "images/teacher-37-alex-thompson.jpg",       // Alex Thompson
            38: "images/teacher-38-lisa-zhang.jpg",          // Lisa Zhang
            39: "images/teacher-39-robert-johnson.jpg",      // Robert Johnson
            40: "images/teacher-40-sofia-andersson.jpg",     // Sofia Andersson
            41: "images/teacher-41-raj-patel.jpg",           // Raj Patel
            42: "images/teacher-42-jennifer-wu.jpg",         // Jennifer Wu
            43: "images/teacher-43-marcus-brown.jpg",        // Marcus Brown
            44: "images/teacher-44-sarah-kim.jpg",           // Sarah Kim
            45: "images/teacher-45-emma-davis.jpg"           // Emma Davis
        };

        return staticImages[teacher.id] || 'images/placeholder.jpg';
    }

    // Get current language from URL or default to 'en'
    function getCurrentLocale() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('locale') || urlParams.get('lang') || 'en';
    }

    // Main function to load teachers data
    async function loadTeachersData() {
        try {
            console.log('📡 Loading teachers data from API...');

            const locale = getCurrentLocale();
            const response = await fetch(`${API_BASE_URL}/api/nd/teachers?locale=${locale}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch teachers: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Teachers data loaded:', data);

            // Populate the teachers section
            if (data.data && Array.isArray(data.data)) {
                await populateTeachersSection(data.data);
            } else {
                console.warn('⚠️ No teachers data found in database');
            }

        } catch (error) {
            console.error('❌ Error loading teachers data:', error);

            // Show error state
            const loadingElement = document.getElementById('teachers-loading');
            const errorElement = document.getElementById('teachers-error');

            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
            if (errorElement) {
                errorElement.style.display = 'block';
            }
        }
    }

    // Populate teachers section
    async function populateTeachersSection(teachers) {
        console.log('👨‍🏫 Populating teachers section with static images...');

        const teachersContainer = document.querySelector('.main-blog-collection-list');
        const loadingElement = document.getElementById('teachers-loading');
        const errorElement = document.getElementById('teachers-error');

        if (!teachersContainer) {
            console.error('❌ Teachers container not found');
            if (errorElement) {
                errorElement.style.display = 'block';
            }
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
            return;
        }

        console.log(`📚 ${teachers.length} teachers available`);

        if (teachers.length === 0) {
            console.warn('⚠️ No teachers found');
            if (errorElement) {
                errorElement.style.display = 'block';
            }
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
            return;
        }

        // Clear existing content
        teachersContainer.innerHTML = '';

        // Create teacher cards
        for (const teacherData of teachers) {
            // Handle both new API format and legacy format
            const teacher = {
                id: teacherData.id,
                name: teacherData.full_name || teacherData.name,
                title: teacherData.professional_title || teacherData.title,
                company: teacherData.company,
                bio: teacherData.bio,
                category: teacherData.category || teacherData.professional_title || 'Expert',
                experience: teacherData.statistics?.years_experience ? `${teacherData.statistics.years_experience}+ years` : '5+ years',
                profile_image_url: teacherData.profile_image_url
            };

            const teacherCard = createTeacherCard(teacher);
            teachersContainer.appendChild(teacherCard);
        }

        // Show the container and hide loading
        teachersContainer.style.display = 'block';
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }

        console.log('✅ Teachers section populated with static images');
    }

    // Create teacher card element
    function createTeacherCard(teacher) {
        const teacherItem = document.createElement('div');
        teacherItem.className = 'main-blog-collection-list-item';
        teacherItem.setAttribute('role', 'listitem');

        // Get category color
        const categoryColor = getCategoryColor(teacher.category);

        teacherItem.innerHTML = `
            <div class="main-blog-single">
                <a href="detail_teacher.html?id=${teacher.id}" class="main-blog-image-link w-inline-block">
                    <img src="${teacher.profile_image_url || getStaticTeacherImage(teacher)}"
                         loading="lazy"
                         alt="${teacher.name} - ${teacher.title}"
                         class="main-blog-image"
                         style="width: 100%; height: 260px; object-fit: cover;">
                </a>
                <div class="main-blog-typography">
                    <div class="blog-card-categories-author">
                        <div class="blog-card-categories-wrap">
                            <div class="blog-card-categories-flex">
                                <div class="blog-card-categories-circel"></div>
                                <div class="blog-card-categories-name">${getCategoryDisplayName(teacher.category)}</div>
                            </div>
                        </div>
                        <div class="blog-card-author-name-icon">
                            <img src="images/Blog-Card-Author-Icon.svg" loading="lazy" alt="" class="blog-card-author-icon">
                            <div class="blog-card-author-name">${teacher.name}</div>
                        </div>
                    </div>
                    <a href="detail_teacher.html?id=${teacher.id}" class="blog-post-name">${teacher.name} - ${teacher.title}</a>
                    <div class="main-blog-line"></div>
                    <p class="main-blog-description-text">${teacher.bio || 'Experienced professional in their field.'}</p>
                    <div class="blog-card-link-wrap">
                        <a href="detail_teacher.html?id=${teacher.id}" class="blog-card-link w-inline-block">
                            <div class="blog-card-link-text">View Profile</div>
                            <div class="blog-card-link-arrow"></div>
                        </a>
                    </div>
                </div>
            </div>
        `;

        // Add text overflow handling
        setupTextOverflowForTeacher(teacherItem);

        return teacherItem;
    }

    // Helper function to setup text overflow for teacher cards
    function setupTextOverflowForTeacher(cardElement) {
        const nameElement = cardElement.querySelector('.teacher-name-overflow');
        if (nameElement && nameElement.textContent.length > 25) {
            nameElement.setAttribute('title', nameElement.textContent);
            nameElement.style.overflow = 'hidden';
            nameElement.style.textOverflow = 'ellipsis';
            nameElement.style.whiteSpace = 'nowrap';
        }

        const bioElement = cardElement.querySelector('.teacher-bio-overflow');
        if (bioElement && bioElement.textContent.length > 120) {
            bioElement.setAttribute('title', bioElement.textContent);
            bioElement.style.overflow = 'hidden';
            bioElement.style.textOverflow = 'ellipsis';
            bioElement.style.display = '-webkit-box';
            bioElement.style.webkitLineClamp = '3';
            bioElement.style.webkitBoxOrient = 'vertical';
        }
    }

    // Get category color
    function getCategoryColor(category) {
        if (!category) return '#667eea';

        const cat = category.toLowerCase();
        if (cat.includes('machine') || cat.includes('ai')) return '#4facfe';
        if (cat.includes('development') || cat.includes('engineering')) return '#11998e';
        if (cat.includes('data') || cat.includes('analytics')) return '#ff6b6b';
        if (cat.includes('cloud') || cat.includes('devops')) return '#43e97b';
        if (cat.includes('design') || cat.includes('ui')) return '#feca57';
        if (cat.includes('management') || cat.includes('product')) return '#667eea';

        return '#667eea'; // default blue
    }

    // Get category display name
    function getCategoryDisplayName(category) {
        if (!category) return 'Expert';

        const cat = category.toLowerCase();

        // Check for keywords in professional title or category
        if (cat.includes('machine') || cat.includes('ai') || cat.includes('ml')) return 'AI & Machine Learning';
        if (cat.includes('development') || cat.includes('stack') || cat.includes('web') || cat.includes('frontend') || cat.includes('backend')) return 'Web Development';
        if (cat.includes('data') || cat.includes('analytics') || cat.includes('science')) return 'Data Science';
        if (cat.includes('career') || cat.includes('transition') || cat.includes('coach')) return 'Career Development';
        if (cat.includes('cloud') || cat.includes('devops') || cat.includes('infrastructure')) return 'Cloud & DevOps';
        if (cat.includes('design') || cat.includes('ui') || cat.includes('ux')) return 'Design';
        if (cat.includes('management') || cat.includes('leadership') || cat.includes('product')) return 'Leadership';

        const displayNames = {
            'machine-learning': 'AI & ML',
            'development': 'Development',
            'data-analytics': 'Data Science',
            'cloud-devops': 'Cloud & DevOps',
            'design': 'Design',
            'management': 'Leadership'
        };

        return displayNames[category] || category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadTeachersData);
    } else {
        loadTeachersData();
    }

    // Expose functions globally for debugging
    window.reloadTeachersData = loadTeachersData;

    console.log('📦 Teachers Integration loaded with static profile images');

})();