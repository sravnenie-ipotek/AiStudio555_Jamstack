/**
 * AI Studio Teacher Card Component
 * JavaScript functionality for the shared teacher card component
 */

(function() {
    'use strict';

    // Teacher Card Generator Class
    class AIStudioTeacherCard {
        constructor() {
            this.init();
        }

        init() {
            // Auto-apply shared card styling if not already loaded
            this.loadCSS();
        }

        /**
         * Load the shared CSS if not already loaded
         */
        loadCSS() {
            const cssId = 'ai-studio-teacher-card-css';
            if (!document.getElementById(cssId)) {
                const link = document.createElement('link');
                link.id = cssId;
                link.rel = 'stylesheet';
                link.type = 'text/css';
                link.href = '/css/ai-studio-teacher-card.css';
                document.head.appendChild(link);
            }
        }

        /**
         * Generate a teacher card HTML structure
         * @param {Object} teacher - Teacher data object
         * @param {number} index - Index for unique IDs and photo selection
         * @param {string} locale - Language locale (en, ru, he)
         * @returns {string} HTML string for the teacher card
         */
        generateCard(teacher, index = 0, locale = 'en') {
            // Get localized content
            const teacherName = teacher[`full_name_${locale}`] || teacher.full_name || 'Unknown Teacher';
            const teacherTitle = teacher[`professional_title_${locale}`] || teacher.professional_title || 'Expert Instructor';
            const teacherCompany = teacher[`company_${locale}`] || teacher.company || 'AI Studio';

            // Generate professional photo URL
            const photoUrl = this.generatePhotoUrl(teacher, index);
            const fallbackUrl = this.generateAvatarUrl(teacherName);

            // Get statistics
            const stats = teacher.statistics || {};
            const rating = stats.rating || 4.8;
            const yearsExp = stats.years_experience || 5;
            const coursesCount = stats.courses_count || 3;
            const studentsCount = stats.students_taught || 338;

            // Get skills
            const skills = teacher.skills || ['AI', 'Teaching', 'Research'];
            const displaySkills = Array.isArray(skills) ? skills.slice(0, 4) : ['AI', 'Teaching'];

            // Create teacher detail page URL
            const teacherDetailUrl = `teacher-detail.html?id=${teacher.id}&locale=${locale}`;

            // Get localized text
            const translations = this.getTranslations(locale);

            return `
                <div class="ai-teacher-card" data-teacher-id="${teacher.id}" role="article" aria-label="${teacherName} profile">
                    <div class="ai-teacher-header">
                        <span class="ai-teacher-badge" aria-label="AI Expert badge">AI EXPERT</span>
                        <img src="${photoUrl}"
                             loading="lazy"
                             alt="${teacherName}"
                             class="ai-teacher-avatar"
                             onerror="this.onerror=null; this.src='${fallbackUrl}'">
                        <h3 class="ai-teacher-name">${teacherName}</h3>
                        <div class="ai-teacher-title">${teacherTitle}</div>
                        <div class="ai-teacher-company">${teacherCompany}</div>
                    </div>

                    <div class="ai-expertise-tags" role="list" aria-label="Expertise areas">
                        ${displaySkills.map(skill =>
                            `<span class="ai-expertise-tag" role="listitem">${skill}</span>`
                        ).join('')}
                    </div>

                    <div class="ai-performance-grid" role="grid" aria-label="Teacher statistics">
                        <div class="ai-performance-item" role="gridcell">
                            <span class="ai-perf-value">${rating}</span>
                            <div class="ai-perf-label">⭐</div>
                        </div>
                        <div class="ai-performance-item" role="gridcell">
                            <span class="ai-perf-value">${yearsExp}</span>
                            <div class="ai-perf-label">${translations.years}</div>
                        </div>
                        <div class="ai-performance-item" role="gridcell">
                            <span class="ai-perf-value">${coursesCount}</span>
                            <div class="ai-perf-label">${translations.courses}</div>
                        </div>
                        <div class="ai-performance-item" role="gridcell">
                            <span class="ai-perf-value">${studentsCount}</span>
                            <div class="ai-perf-label">${translations.students}</div>
                        </div>
                    </div>

                    <div class="ai-teacher-cta">
                        <a href="${teacherDetailUrl}"
                           class="ai-view-btn"
                           aria-label="${translations.viewProfile} ${teacherName}">
                            ${translations.viewProfile} →
                        </a>
                    </div>
                </div>
            `;
        }

        /**
         * Generate professional photo URL using Unsplash
         * @param {Object} teacher - Teacher data
         * @param {number} index - Index for photo variation
         * @returns {string} Photo URL
         */
        generatePhotoUrl(teacher, index) {
            // Use profile image if available
            if (teacher.profile_image_url) {
                return teacher.profile_image_url;
            }

            // Use consistent Unsplash IDs for professional photos
            const unsplashIds = [
                'd1UPkiFd04A', 'WX4i1Jq_o0Y', 'jzY0KRJopEI', 'sibVwORYqs0',
                '2EF8lHdO3Y8', 'rDEOVtE7vOs', 'IF9TK5Uy-KI', '5yENR2BKGQs',
                'mEZ3PoFGs_k', 'iTuLdqSqAqg', 'ZHvM3XIOHoE', 'wojJy12BKqc'
            ];

            const photoId = unsplashIds[index % unsplashIds.length];
            return `https://images.unsplash.com/photo-${photoId}?w=400&h=400&fit=crop&q=80`;
        }

        /**
         * Generate avatar fallback URL
         * @param {string} fullName - Teacher's full name
         * @returns {string} Avatar URL
         */
        generateAvatarUrl(fullName) {
            const initials = fullName.split(' ')
                .map(name => name[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);

            const colors = ['667eea', '764ba2', '4facfe', '43e97b', 'fa709a', 'fee140'];
            const colorIndex = fullName.length % colors.length;
            const backgroundColor = colors[colorIndex];

            return `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&size=400&background=${backgroundColor}&color=ffffff&bold=true&font-size=0.4&format=svg`;
        }

        /**
         * Get localized translations
         * @param {string} locale - Language locale
         * @returns {Object} Translation object
         */
        getTranslations(locale) {
            const translations = {
                en: {
                    viewProfile: 'View Profile',
                    years: 'YEARS',
                    courses: 'COURSES',
                    students: 'STUDENTS'
                },
                ru: {
                    viewProfile: 'Посмотреть профиль',
                    years: 'ЛЕТ',
                    courses: 'КУРСОВ',
                    students: 'СТУДЕНТОВ'
                },
                he: {
                    viewProfile: 'צפה בפרופיל',
                    years: 'שנים',
                    courses: 'קורסים',
                    students: 'סטודנטים'
                }
            };

            return translations[locale] || translations.en;
        }

        /**
         * Render multiple teacher cards to a container
         * @param {Array} teachers - Array of teacher objects
         * @param {string|HTMLElement} container - Container selector or element
         * @param {string} locale - Language locale
         */
        renderCards(teachers, container, locale = 'en') {
            const containerElement = typeof container === 'string'
                ? document.querySelector(container)
                : container;

            if (!containerElement) {
                console.error('AI Studio Teacher Card: Container not found');
                return;
            }

            // Clear existing content
            containerElement.innerHTML = '';

            // Generate and append cards
            teachers.forEach((teacher, index) => {
                const cardHTML = this.generateCard(teacher, index, locale);
                const cardElement = document.createElement('div');
                cardElement.className = 'main-blog-collection-list-item';
                cardElement.innerHTML = cardHTML;
                containerElement.appendChild(cardElement);
            });

            // Add click handlers for analytics
            this.addClickHandlers(containerElement);
        }

        /**
         * Add click event handlers for analytics
         * @param {HTMLElement} container - Container element
         */
        addClickHandlers(container) {
            container.addEventListener('click', (event) => {
                const card = event.target.closest('.ai-teacher-card');
                if (card) {
                    const teacherId = card.dataset.teacherId;
                    const teacherName = card.querySelector('.ai-teacher-name')?.textContent;

                    // Analytics tracking (if available)
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'teacher_card_click', {
                            teacher_id: teacherId,
                            teacher_name: teacherName
                        });
                    }

                    // Console log for debugging
                    console.log('Teacher card clicked:', { teacherId, teacherName });
                }
            });
        }

        /**
         * Update existing cards with new data
         * @param {Array} teachers - Updated teacher data
         * @param {string} locale - Language locale
         */
        updateCards(teachers, locale = 'en') {
            const existingCards = document.querySelectorAll('.ai-teacher-card');

            existingCards.forEach((card, index) => {
                if (teachers[index]) {
                    const teacherId = card.dataset.teacherId;
                    const teacher = teachers.find(t => t.id == teacherId) || teachers[index];

                    // Update card content
                    const newCardHTML = this.generateCard(teacher, index, locale);
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = newCardHTML;
                    const newCard = tempDiv.firstElementChild;

                    // Replace the card
                    card.parentNode.replaceChild(newCard, card);
                }
            });
        }

        /**
         * Add loading state to cards
         * @param {string|HTMLElement} container - Container selector or element
         */
        showLoading(container) {
            const containerElement = typeof container === 'string'
                ? document.querySelector(container)
                : container;

            if (containerElement) {
                const cards = containerElement.querySelectorAll('.ai-teacher-card');
                cards.forEach(card => card.classList.add('loading'));
            }
        }

        /**
         * Remove loading state from cards
         * @param {string|HTMLElement} container - Container selector or element
         */
        hideLoading(container) {
            const containerElement = typeof container === 'string'
                ? document.querySelector(container)
                : container;

            if (containerElement) {
                const cards = containerElement.querySelectorAll('.ai-teacher-card');
                cards.forEach(card => card.classList.remove('loading'));
            }
        }
    }

    // Create global instance
    window.AIStudioTeacherCard = new AIStudioTeacherCard();

    // Export for module systems
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = AIStudioTeacherCard;
    }

})();