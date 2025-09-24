/**
 * Shared Teacher Card Component - Following WorkingLogic.md Dual-System Architecture
 *
 * System 1: UI translations via data-i18n attributes (handled by unified-language-manager.js)
 * System 2: Dynamic teacher content from nd_teachers API
 *
 * This component handles ONLY System 2 (dynamic content) and removes data-i18n
 * attributes after updating to prevent conflicts with System 1
 */

class SharedTeacherCard {
    constructor() {
        this.API_BASE_URL = window.location.hostname === 'localhost'
            ? 'http://localhost:3000'
            : 'https://aistudio555jamstack-production.up.railway.app';

        this.currentLocale = this.detectLanguage();
        this.teachers = [];
        this.initialized = false;
        this.listenersAttached = false;
        this.rendering = false;
        this.changingLanguage = false;

        // Debug counters to track loops
        this.renderCount = 0;
        this.initCount = 0;
        this.instanceId = Date.now() + Math.random();

        console.log(`🎯 [SharedTeacherCard-${this.instanceId}] NEW INSTANCE created with dual-system architecture...`);

        // Auto-initialize after DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    /**
     * Detect current language from URL params or localStorage
     */
    detectLanguage() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('locale') ||
               localStorage.getItem('preferred_locale') ||
               'en';
    }

    /**
     * Initialize the component
     */
    async init() {
        this.initCount++;
        console.log(`🚀 [SharedTeacherCard-${this.instanceId}] Init attempt #${this.initCount}`);

        // Prevent multiple initializations
        if (this.initialized) {
            console.log(`ℹ️ [SharedTeacherCard-${this.instanceId}] Already initialized, skipping init #${this.initCount}`);
            return;
        }

        try {
            console.log(`🚀 [SharedTeacherCard-${this.instanceId}] Starting initialization #${this.initCount}...`);

            // Find teacher containers
            const containers = document.querySelectorAll('.main-blog-collection-list, .teacher-grid, .instructors-grid');

            if (containers.length === 0) {
                console.log('ℹ️ [SharedTeacherCard] No teacher containers found, skipping initialization');
                return;
            }

            // Load teacher data from API (System 2)
            await this.loadTeachers();

            // Render teacher cards
            this.renderTeachers();

            // Set up language change listeners
            this.setupLanguageListeners();

            this.initialized = true;
            console.log('✅ [SharedTeacherCard] Initialization complete');

        } catch (error) {
            console.error('❌ [SharedTeacherCard] Initialization failed:', error);
            this.initialized = false; // Reset on failure
        }
    }

    /**
     * Load teachers from API (System 2 - Dynamic Content)
     */
    async loadTeachers() {
        try {
            console.log(`🌍 [SharedTeacherCard] Loading teachers for locale: ${this.currentLocale}`);

            const response = await fetch(`${this.API_BASE_URL}/api/nd/teachers?locale=${this.currentLocale}`);
            const data = await response.json();

            if (data.success) {
                this.teachers = data.data;
                console.log(`✅ [SharedTeacherCard] Loaded ${this.teachers.length} teachers`);
            } else {
                console.warn('⚠️ [SharedTeacherCard] API returned error:', data.message);
                this.teachers = [];
            }

        } catch (error) {
            console.error('❌ [SharedTeacherCard] Failed to load teachers:', error);
            this.teachers = [];
        }
    }

    /**
     * Render teacher cards in all containers
     */
    renderTeachers() {
        this.renderCount++;
        console.log(`🎨 [SharedTeacherCard-${this.instanceId}] Render attempt #${this.renderCount}`);

        // Prevent rendering loops
        if (this.rendering) {
            console.log(`⚠️ [SharedTeacherCard-${this.instanceId}] Already rendering, skipping render #${this.renderCount} to prevent loop`);
            return;
        }

        this.rendering = true;

        try {
            console.log(`🎨 [SharedTeacherCard-${this.instanceId}] Starting render #${this.renderCount}...`);
            const containers = document.querySelectorAll('.main-blog-collection-list, .teacher-grid, .instructors-grid');

            containers.forEach(container => {
                // Clear existing content (but preserve any loading states)
                const existingCards = container.querySelectorAll('.shared-teacher-card');
                existingCards.forEach(card => card.remove());

                if (this.teachers.length === 0) {
                    container.innerHTML = this.createEmptyState();
                    return;
                }

                // Create cards for each teacher
                this.teachers.forEach((teacher, index) => {
                    const cardElement = this.createTeacherCard(teacher, index);
                    container.appendChild(cardElement);
                });

                console.log(`✅ [SharedTeacherCard] Rendered ${this.teachers.length} cards in container`);
            });
        } finally {
            this.rendering = false;
        }
    }

    /**
     * Create a teacher card element (System 2 - Dynamic Content)
     */
    createTeacherCard(teacher, index) {
        // Create wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'teacher-card-wrapper main-blog-collection-list-item';

        // Get localized teacher data
        const name = this.getLocalizedField(teacher, 'full_name');
        const title = this.getLocalizedField(teacher, 'professional_title');
        const company = this.getLocalizedField(teacher, 'company');
        const bio = this.getLocalizedField(teacher, 'bio');
        const photo = this.getTeacherPhoto(teacher);
        const skills = teacher.skills || [];
        const stats = teacher.statistics || {};

        // Create the card HTML
        wrapper.innerHTML = `
            <div class="shared-teacher-card" data-teacher-id="${teacher.id}">
                <!-- Teacher Photo -->
                <div class="teacher-photo-wrapper">
                    <img src="${photo}"
                         alt="${name}"
                         class="teacher-photo"
                         loading="lazy"
                         onerror="if(!this.errorHandled){this.errorHandled=true;this.src='images/About-Me-Image.jpg';}">
                    <div class="teacher-rating-badge">
                        <span class="rating-star">⭐</span>
                        <span class="rating-value">${stats.rating || '4.8'}</span>
                    </div>
                </div>

                <!-- Teacher Info -->
                <div class="teacher-info">
                    <h3 class="teacher-name">${name}</h3>
                    <div class="teacher-title">${title}</div>
                    <div class="teacher-company">${company}</div>

                    <!-- Bio (truncated) -->
                    <p class="teacher-bio">${this.truncateText(bio, 120)}</p>

                    <!-- Skills -->
                    <div class="teacher-skills">
                        ${skills.slice(0, 3).map(skill =>
                            `<span class="teacher-skill-tag">${skill}</span>`
                        ).join('')}
                        ${skills.length > 3 ? `<span class="teacher-skill-more">+${skills.length - 3}</span>` : ''}
                    </div>

                    <!-- Stats -->
                    <div class="teacher-stats">
                        <div class="stat-item">
                            <span class="stat-value">${stats.courses_count || '0'}</span>
                            <span class="stat-label" data-i18n="teacher.stats.courses">Courses</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${stats.students_taught || '0'}</span>
                            <span class="stat-label" data-i18n="teacher.stats.students">Students</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${stats.years_experience || '0'}+</span>
                            <span class="stat-label" data-i18n="teacher.stats.years">Years</span>
                        </div>
                    </div>

                    <!-- Action Button -->
                    <button class="teacher-contact-btn" data-i18n="teacher.button.contact">
                        Contact Teacher
                    </button>
                </div>
            </div>
        `;

        // CRITICAL: Remove data-i18n from dynamic content to prevent System 1 conflicts
        // This follows WorkingLogic.md rule: "Remove data-i18n attributes after updating"
        const dynamicElements = wrapper.querySelectorAll('.teacher-name, .teacher-title, .teacher-company, .teacher-bio, .teacher-skill-tag');
        dynamicElements.forEach(element => {
            element.removeAttribute('data-i18n');
        });

        // Add click handler
        const card = wrapper.querySelector('.shared-teacher-card');
        card.addEventListener('click', () => this.handleTeacherClick(teacher));

        return wrapper;
    }

    /**
     * Get localized field from teacher data
     */
    getLocalizedField(teacher, fieldName) {
        const localizedField = `${fieldName}_${this.currentLocale}`;
        const englishField = `${fieldName}_en`;
        const fallbackField = fieldName;

        return teacher[localizedField] ||
               teacher[englishField] ||
               teacher[fallbackField] ||
               '';
    }

    /**
     * Get teacher photo with fallbacks
     */
    getTeacherPhoto(teacher) {
        return teacher.profile_image_url ||
               'images/About-Me-Image.jpg'; // Use existing image as fallback
    }

    /**
     * Truncate text to specified length
     */
    truncateText(text, maxLength) {
        if (!text || text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    }

    /**
     * Create empty state when no teachers found
     */
    createEmptyState() {
        return `
            <div class="teachers-empty-state">
                <div class="empty-state-icon">👨‍🏫</div>
                <h3 data-i18n="teacher.empty.title">No Teachers Found</h3>
                <p data-i18n="teacher.empty.description">We're working on adding more instructors. Please check back soon!</p>
            </div>
        `;
    }

    /**
     * Handle teacher card click
     */
    handleTeacherClick(teacher) {
        console.log('🎯 [SharedTeacherCard] Teacher clicked:', teacher.full_name);

        // For now, show teacher details in a simple alert
        // This could be enhanced to show a modal or navigate to teacher detail page
        const name = this.getLocalizedField(teacher, 'full_name');
        const title = this.getLocalizedField(teacher, 'professional_title');
        const bio = this.getLocalizedField(teacher, 'bio');

        alert(`${name}\n${title}\n\n${bio}`);
    }

    /**
     * Handle language change events
     */
    async handleLanguageChange(newLocale) {
        if (newLocale === this.currentLocale) return;

        // Prevent multiple simultaneous language changes
        if (this.changingLanguage) {
            console.log('⚠️ [SharedTeacherCard] Language change already in progress, skipping');
            return;
        }

        this.changingLanguage = true;

        try {
            console.log(`🌍 [SharedTeacherCard] Language changed: ${this.currentLocale} → ${newLocale}`);

            this.currentLocale = newLocale;

            // Reload teacher data for new locale
            await this.loadTeachers();

            // Re-render cards
            this.renderTeachers();

            console.log('✅ [SharedTeacherCard] Language change complete');
        } finally {
            this.changingLanguage = false;
        }
    }

    /**
     * Set up language change listeners
     */
    setupLanguageListeners() {
        // Prevent duplicate event listeners
        if (this.listenersAttached) {
            console.log('ℹ️ [SharedTeacherCard] Event listeners already attached, skipping');
            return;
        }

        // Listen for custom language change events
        this.languageChangeHandler = (event) => {
            if (event.detail && event.detail.locale) {
                this.handleLanguageChange(event.detail.locale);
            }
        };
        window.addEventListener('languageChanged', this.languageChangeHandler);

        // Listen for URL parameter changes
        this.popstateHandler = () => {
            const newLocale = this.detectLanguage();
            this.handleLanguageChange(newLocale);
        };
        window.addEventListener('popstate', this.popstateHandler);

        this.listenersAttached = true;
        console.log('✅ [SharedTeacherCard] Event listeners attached');
    }

    /**
     * Public method to refresh teachers
     */
    async refresh() {
        await this.loadTeachers();
        this.renderTeachers();
    }

    /**
     * Public method to get current teachers
     */
    getTeachers() {
        return this.teachers;
    }
}

// Singleton pattern to prevent multiple instances
console.log('🔍 [SharedTeacherCard] Checking singleton status...');
if (!window.sharedTeacherCard) {
    console.log('🆕 [SharedTeacherCard] Creating new singleton instance...');
    // Auto-initialize when script loads
    const sharedTeacherCard = new SharedTeacherCard();

    // Make it globally available
    window.sharedTeacherCard = sharedTeacherCard;

    console.log(`✅ [SharedTeacherCard] Component loaded and ready - Instance ID: ${sharedTeacherCard.instanceId}`);
} else {
    console.log(`ℹ️ [SharedTeacherCard] Component already exists - Existing Instance ID: ${window.sharedTeacherCard.instanceId}`);
    console.log('⚠️ [SharedTeacherCard] SCRIPT LOADED MULTIPLE TIMES - This could cause issues!');
}