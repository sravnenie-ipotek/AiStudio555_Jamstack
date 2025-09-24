/**
 * Shared Teacher Card Component
 *
 * This component follows WorkingLogic.md dual-system architecture:
 * - System 1: Uses unified-language-manager.js for UI translations via data-i18n
 * - System 2: Handles dynamic teacher content from API, then removes data-i18n
 *
 * Features:
 * - Multi-language support (EN/RU/HE)
 * - Dynamic teacher data loading from API
 * - Professional photo generation with fallbacks
 * - Statistics display (rating, experience, courses, students)
 * - Skills/expertise tags
 * - RTL support for Hebrew
 * - Accessibility compliant
 */

class SharedTeacherCard {
    constructor() {
        this.API_BASE_URL = window.location.hostname === 'localhost'
            ? 'http://localhost:3000'
            : 'https://aistudio555jamstack-production.up.railway.app';

        this.currentLocale = 'en';
        this.teachers = [];
        this.initialized = false;

        // Bind methods
        this.init = this.init.bind(this);
        this.loadTeachers = this.loadTeachers.bind(this);
        this.renderCards = this.renderCards.bind(this);
        this.generateCard = this.generateCard.bind(this);
        this.handleLanguageChange = this.handleLanguageChange.bind(this);
    }

    /**
     * Initialize the teacher card component
     */
    async init() {
        if (this.initialized) {
            console.log('🔄 [TeacherCard] Already initialized');
            return;
        }

        console.log('🚀 [TeacherCard] Initializing teacher card component...');

        try {
            // Wait for unified language manager to be ready (System 1)
            await this.waitForLanguageManager();

            // Get current locale
            this.currentLocale = this.getCurrentLocale();

            // Load CSS if not already loaded
            this.loadCSS();

            // Load teachers data from API
            await this.loadTeachers();

            // Listen for language changes
            this.setupLanguageListener();

            // Mark as initialized
            this.initialized = true;

            console.log('✅ [TeacherCard] Component initialized successfully');

        } catch (error) {
            console.error('❌ [TeacherCard] Failed to initialize:', error);
        }
    }

    /**
     * Wait for unified language manager to be available
     */
    async waitForLanguageManager() {
        return new Promise((resolve) => {
            if (window.UnifiedLanguageManager) {
                resolve();
            } else {
                const checkInterval = setInterval(() => {
                    if (window.UnifiedLanguageManager) {
                        clearInterval(checkInterval);
                        resolve();
                    }
                }, 100);
            }
        });
    }

    /**
     * Get current locale from language manager or localStorage
     */
    getCurrentLocale() {
        if (window.UnifiedLanguageManager && window.UnifiedLanguageManager.currentLocale) {
            return window.UnifiedLanguageManager.currentLocale;
        }

        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('locale') ||
               localStorage.getItem('preferred_locale') ||
               'en';
    }

    /**
     * Load CSS if not already loaded
     */
    loadCSS() {
        const cssId = 'shared-teacher-card-css';
        if (!document.getElementById(cssId)) {
            const link = document.createElement('link');
            link.id = cssId;
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = 'shared/components/teacher-card/teacher-card.css';
            document.head.appendChild(link);
            console.log('✅ [TeacherCard] CSS loaded');
        }
    }

    /**
     * Load teachers from API
     */
    async loadTeachers() {
        try {
            console.log(`🔄 [TeacherCard] Loading teachers for locale: ${this.currentLocale}`);

            const response = await fetch(`${this.API_BASE_URL}/api/nd/teachers?locale=${this.currentLocale}`);
            const data = await response.json();

            if (data.success && data.data) {
                this.teachers = data.data;
                console.log(`✅ [TeacherCard] Loaded ${this.teachers.length} teachers`);

                // Render cards if container exists
                this.renderCards();
            } else {
                console.warn('⚠️ [TeacherCard] No teachers found in API response');
            }

        } catch (error) {
            console.error('❌ [TeacherCard] Error loading teachers:', error);
        }
    }

    /**
     * Render teacher cards to container
     */
    renderCards(containerSelector = '.main-blog-collection-list') {
        const container = document.querySelector(containerSelector);
        if (!container) {
            console.warn(`⚠️ [TeacherCard] Container '${containerSelector}' not found`);
            return;
        }

        console.log(`🔄 [TeacherCard] Rendering ${this.teachers.length} teacher cards...`);

        // Clear existing content
        container.innerHTML = '';

        // Add loading state
        container.classList.add('loading-teachers');

        // Generate and append cards
        this.teachers.forEach((teacher, index) => {
            const cardWrapper = document.createElement('div');
            cardWrapper.className = 'teacher-card-wrapper main-blog-collection-list-item';
            cardWrapper.innerHTML = this.generateCard(teacher, index);
            container.appendChild(cardWrapper);
        });

        // Remove loading state
        container.classList.remove('loading-teachers');

        // DUAL-SYSTEM: Remove data-i18n from dynamic content after render
        setTimeout(() => {
            this.removeDynamicDataI18n();
        }, 200);

        console.log('✅ [TeacherCard] Cards rendered successfully');
    }

    /**
     * Generate a single teacher card HTML
     */
    generateCard(teacher, index) {
        // Get localized content based on current locale
        const name = this.getLocalizedField(teacher, 'full_name');
        const title = this.getLocalizedField(teacher, 'professional_title');
        const company = this.getLocalizedField(teacher, 'company');
        const bio = this.getLocalizedField(teacher, 'bio');

        // Get photo URL with fallback
        const photoUrl = this.generatePhotoUrl(teacher, index);
        const fallbackUrl = this.generateAvatarUrl(name);

        // Get statistics (with defaults)
        const stats = teacher.statistics || {};
        const rating = stats.rating || 4.8;
        const yearsExp = stats.years_experience || 5;
        const coursesCount = teacher.courses_taught ? teacher.courses_taught.length : 3;
        const studentsCount = stats.students_taught || 338;

        // Get skills
        const skills = teacher.skills || ['Teaching', 'AI', 'Development'];
        const displaySkills = skills.slice(0, 4);

        // Create teacher detail URL
        const detailUrl = `teacher-detail.html?id=${teacher.id}&locale=${this.currentLocale}`;

        return `
            <div class="shared-teacher-card" data-teacher-id="${teacher.id}" role="article" aria-label="${name} profile">
                <div class="teacher-card-header">
                    <span class="teacher-badge" data-i18n="teacher.card.badge">AI EXPERT</span>
                    <div class="teacher-avatar-wrapper">
                        <img src="${photoUrl}"
                             loading="lazy"
                             alt="${name}"
                             class="teacher-avatar"
                             onerror="this.onerror=null; this.src='${fallbackUrl}'">
                    </div>
                    <h3 class="teacher-name">${name}</h3>
                    <div class="teacher-title">${title}</div>
                    <div class="teacher-company">${company}</div>
                </div>

                <div class="teacher-skills" role="list" aria-label="Skills">
                    ${displaySkills.map(skill =>
                        `<span class="teacher-skill-tag" role="listitem">${skill}</span>`
                    ).join('')}
                </div>

                <div class="teacher-stats" role="grid" aria-label="Teacher statistics">
                    <div class="teacher-stat" role="gridcell">
                        <span class="stat-value">${rating}</span>
                        <div class="stat-label">⭐</div>
                    </div>
                    <div class="teacher-stat" role="gridcell">
                        <span class="stat-value">${yearsExp}</span>
                        <div class="stat-label" data-i18n="teacher.card.years">YEARS</div>
                    </div>
                    <div class="teacher-stat" role="gridcell">
                        <span class="stat-value">${coursesCount}</span>
                        <div class="stat-label" data-i18n="teacher.card.courses">COURSES</div>
                    </div>
                    <div class="teacher-stat" role="gridcell">
                        <span class="stat-value">${studentsCount}</span>
                        <div class="stat-label" data-i18n="teacher.card.students">STUDENTS</div>
                    </div>
                </div>

                <div class="teacher-bio">
                    <p class="teacher-bio-text">${this.truncateBio(bio, 120)}</p>
                </div>

                <div class="teacher-card-footer">
                    <a href="${detailUrl}"
                       class="teacher-view-btn"
                       aria-label="View ${name} profile">
                        <span data-i18n="teacher.card.viewProfile">View Profile</span>
                        <span class="btn-arrow">→</span>
                    </a>
                </div>
            </div>
        `;
    }

    /**
     * Get localized field from teacher object
     */
    getLocalizedField(teacher, fieldName) {
        const localizedField = `${fieldName}_${this.currentLocale}`;

        // For English, try base field first
        if (this.currentLocale === 'en') {
            return teacher[fieldName] || teacher[localizedField] || '';
        }

        // For other languages, try localized field first, then fallback to base
        return teacher[localizedField] || teacher[fieldName] || '';
    }

    /**
     * Truncate bio text to specified length
     */
    truncateBio(text, maxLength) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    }

    /**
     * Generate photo URL with fallbacks
     */
    generatePhotoUrl(teacher, index) {
        // Use profile image if available
        if (teacher.profile_image_url) {
            return teacher.profile_image_url;
        }

        // Use Unsplash professional photos
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
     * Remove data-i18n attributes from dynamic content (DUAL-SYSTEM compliance)
     */
    removeDynamicDataI18n() {
        const dynamicSelectors = [
            '.teacher-name',
            '.teacher-title',
            '.teacher-company',
            '.teacher-bio-text',
            '.teacher-skill-tag'
        ];

        dynamicSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element.hasAttribute('data-i18n')) {
                    console.log(`🔄 [DUAL-SYSTEM] Removing data-i18n from: ${element.getAttribute('data-i18n')}`);
                    element.removeAttribute('data-i18n');
                }
            });
        });

        console.log('✅ [DUAL-SYSTEM] Removed data-i18n from dynamic teacher content');
    }

    /**
     * Setup language change listener
     */
    setupLanguageListener() {
        window.addEventListener('languageChanged', async (event) => {
            console.log('🌍 [TeacherCard] Language changed to:', event.detail.locale);

            this.currentLocale = event.detail.locale;

            // Reload teachers for new language
            await this.loadTeachers();
        });
    }

    /**
     * Handle language change
     */
    async handleLanguageChange(newLocale) {
        if (newLocale === this.currentLocale) return;

        console.log(`🌍 [TeacherCard] Switching from ${this.currentLocale} to ${newLocale}`);

        this.currentLocale = newLocale;
        await this.loadTeachers();
    }

    /**
     * Add click analytics
     */
    addClickAnalytics() {
        document.addEventListener('click', (event) => {
            const card = event.target.closest('.shared-teacher-card');
            if (card) {
                const teacherId = card.dataset.teacherId;
                const teacherName = card.querySelector('.teacher-name')?.textContent;

                // Analytics tracking
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'teacher_card_click', {
                        teacher_id: teacherId,
                        teacher_name: teacherName,
                        locale: this.currentLocale
                    });
                }

                console.log('📊 [TeacherCard] Card clicked:', { teacherId, teacherName });
            }
        });
    }

    /**
     * Show loading state
     */
    showLoading(containerSelector = '.main-blog-collection-list') {
        const container = document.querySelector(containerSelector);
        if (container) {
            container.innerHTML = `
                <div class="teacher-cards-loading">
                    <div class="loading-spinner"></div>
                    <p data-i18n="teacher.loading">Loading teachers...</p>
                </div>
            `;
        }
    }

    /**
     * Show error state
     */
    showError(containerSelector = '.main-blog-collection-list') {
        const container = document.querySelector(containerSelector);
        if (container) {
            container.innerHTML = `
                <div class="teacher-cards-error">
                    <p data-i18n="teacher.error">Unable to load teachers. Please try again later.</p>
                </div>
            `;
        }
    }

    /**
     * Show no teachers message
     */
    showNoTeachers(containerSelector = '.main-blog-collection-list') {
        const container = document.querySelector(containerSelector);
        if (container) {
            container.innerHTML = `
                <div class="teacher-cards-empty">
                    <p data-i18n="teacher.noTeachers">No teachers available at this time.</p>
                </div>
            `;
        }
    }

    /**
     * Refresh teacher cards (public method)
     */
    async refresh() {
        console.log('🔄 [TeacherCard] Refreshing teacher cards...');
        await this.loadTeachers();
    }

    /**
     * Destroy component
     */
    destroy() {
        console.log('🗑️ [TeacherCard] Destroying teacher card component...');

        // Remove event listeners
        window.removeEventListener('languageChanged', this.handleLanguageChange);

        // Reset state
        this.initialized = false;
        this.teachers = [];

        console.log('✅ [TeacherCard] Component destroyed');
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure other systems are ready
    setTimeout(() => {
        console.log('🚀 [TeacherCard] Auto-initializing teacher card component...');

        if (!window.sharedTeacherCard) {
            window.sharedTeacherCard = new SharedTeacherCard();
            window.sharedTeacherCard.init();
        }
    }, 300);
});

// Export for manual usage
window.SharedTeacherCard = SharedTeacherCard;

console.log('📦 [TeacherCard] Shared teacher card component loaded');