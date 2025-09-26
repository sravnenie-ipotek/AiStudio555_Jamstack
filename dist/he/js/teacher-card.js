/**
 * Shared Teacher Card Component - Using Dual-System Translation Architecture
 *
 * Following WorkingLogic.md dual-system architecture:
 * - System 1 (Unified Language Manager): UI labels (Years, Courses, Students)
 * - System 2 (Dynamic Content): Teacher names, titles, bios from localized API
 * - Removes data-i18n from dynamic content to prevent conflicts
 * - unified-language-manager.js handles UI translations only
 */

class SharedTeacherCard {
    constructor() {
        this.API_BASE_URL = window.location.hostname === 'localhost'
            ? 'http://localhost:3000'
            : 'https://aistudio555jamstack-production.up.railway.app';

        this.teachers = [];
        this.initialized = false;
        this.rendering = false;

        // Debug counters to track loops
        this.renderCount = 0;
        this.initCount = 0;
        this.instanceId = Date.now() + Math.random();

        console.log(`🎯 [SharedTeacherCard-${this.instanceId}] NEW INSTANCE created with unified language manager...`);

        // Auto-initialize after DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }

        // Listen for language changes to update teacher cards dynamically
        this.setupLanguageListener();
    }

    /**
     * Setup language change listener for dynamic updates
     */
    setupLanguageListener() {
        console.log(`🌍 [SharedTeacherCard-${this.instanceId}] Setting up language change listener...`);

        window.addEventListener('languageChanged', (event) => {
            const newLocale = event.detail?.locale;
            console.log(`🔄 [SharedTeacherCard-${this.instanceId}] Language changed to: ${newLocale}`);

            // Only refresh if we're initialized to avoid race conditions
            if (this.initialized && !this.rendering) {
                console.log(`📊 [SharedTeacherCard-${this.instanceId}] Refreshing teacher cards for new locale...`);
                this.refresh();
            } else {
                console.log(`⏳ [SharedTeacherCard-${this.instanceId}] Skipping refresh - not ready (initialized: ${this.initialized}, rendering: ${this.rendering})`);
            }
        });

        console.log(`✅ [SharedTeacherCard-${this.instanceId}] Language listener setup complete`);
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

            // Load teacher data from API (English-only)
            await this.loadTeachers();

            // Render teacher cards with data-i18n attributes
            this.renderTeachers();

            // DUAL-SYSTEM: Remove data-i18n from dynamic content after rendering
            setTimeout(() => {
                this.removeDynamicDataI18n();
            }, 200);

            this.initialized = true;
            console.log('✅ [SharedTeacherCard] Initialization complete');

        } catch (error) {
            console.error('❌ [SharedTeacherCard] Initialization failed:', error);
            this.initialized = false; // Reset on failure
        }
    }

    /**
     * Load teachers from API (Localized data - System 2 of dual-system architecture)
     */
    async loadTeachers() {
        try {
            // Get current locale for dynamic content loading (System 2)
            const currentLocale = this.getCurrentLocale();
            console.log(`🌍 [SharedTeacherCard] Loading teachers with locale: ${currentLocale} (Dual-System Architecture)`);

            // Load localized data - dynamic content (System 2)
            const response = await fetch(`${this.API_BASE_URL}/api/nd/teachers?locale=${currentLocale}`);
            const data = await response.json();

            if (data.success && Array.isArray(data.data)) {
                this.teachers = data.data;
                console.log(`✅ [SharedTeacherCard] Loaded ${this.teachers.length} teachers (English-only)`);
            } else {
                console.warn('⚠️ [SharedTeacherCard] API returned error or invalid data:', data);
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
                // Hide loading state
                const loadingState = document.querySelector('.teachers-loading-state');
                if (loadingState) {
                    loadingState.style.display = 'none';
                }

                // Clear existing content
                const existingCards = container.querySelectorAll('.shared-teacher-card, .teacher-card-wrapper');
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

        // Get English teacher data only (translations via data-i18n attributes)
        const name = teacher.full_name || teacher.name || 'Teacher Name';
        const title = teacher.professional_title || teacher.title || 'Professional Title';
        const company = teacher.company || 'Company';
        const bio = teacher.bio || 'Teacher biography goes here.';
        const photo = this.getTeacherPhoto(teacher);
        const skills = teacher.skills || [];
        const stats = teacher.statistics || {};

        // Create the card HTML with data-i18n attributes for translations
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

                <!-- Teacher Info Content -->
                <div class="teacher-info">
                    <!-- Header Section -->
                    <div class="teacher-header">
                        <h3 class="teacher-name" title="${name}">${name}</h3>
                        <div class="teacher-title" title="${title}">${title}</div>
                        <div class="teacher-company" title="${company}">${company}</div>
                    </div>

                    <!-- Bio Section (fixed height) -->
                    <div class="teacher-bio-section">
                        <p class="teacher-bio" title="${bio}">${this.truncateText(bio, 100)}</p>
                    </div>

                    <!-- Skills Section (consistent across all cards) -->
                    <div class="teacher-skills-section">
                        ${skills && skills.length > 0 ? `
                            <div class="teacher-skills">
                                ${skills.slice(0, 3).map(skill =>
                                    `<span class="teacher-skill-tag" title="${skill}">${this.truncateText(skill, 15)}</span>`
                                ).join('')}
                                ${skills.length > 3 ? `<span class="teacher-skill-more">+${skills.length - 3}</span>` : ''}
                            </div>
                        ` : `
                            <div class="teacher-skills">
                                <span class="teacher-skill-tag">Teaching</span>
                                <span class="teacher-skill-tag">Education</span>
                                <span class="teacher-skill-tag">Mentoring</span>
                            </div>
                        `}
                    </div>

                    <!-- Stats Footer (consistent across all cards) -->
                    <div class="teacher-footer">
                        <div class="teacher-stats">
                            <div class="stat-item">
                                <div class="stat-value">${stats.courses_count || '3'}</div>
                                <div class="stat-label" data-i18n="teacher.stats.courses">Courses</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-value">${stats.students_taught || '500'}</div>
                                <div class="stat-label" data-i18n="teacher.stats.students">Students</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-value">${stats.years_experience || '5'}+</div>
                                <div class="stat-label" data-i18n="teacher.stats.years">Years</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Keep data-i18n attributes for unified language manager to handle translations
        // No need to remove data-i18n - unified language manager will handle all translations

        // Add click handler
        const card = wrapper.querySelector('.shared-teacher-card');
        card.addEventListener('click', () => this.handleTeacherClick(teacher));

        return wrapper;
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
     * Handle teacher card click - Navigate to teacher details page
     */
    handleTeacherClick(teacher) {
        console.log('🎯 [SharedTeacherCard] Teacher clicked:', teacher.full_name);

        // Get current locale from unified language manager or URL
        const currentLocale = this.getCurrentLocale();

        // Navigate to teacher details page
        const detailsUrl = `teacher-details.html?id=${teacher.id}&locale=${currentLocale}`;
        console.log('🔗 [SharedTeacherCard] Navigating to:', detailsUrl);

        window.location.href = detailsUrl;
    }

    /**
     * Get current locale from unified language manager or URL
     */
    getCurrentLocale() {
        // Check for the correct language manager instance
        if (window.languageManager && window.languageManager.currentLocale) {
            return window.languageManager.currentLocale;
        }

        // Fallback to checking URL params and localStorage
        const urlParams = new URLSearchParams(window.location.search);
        const urlLocale = urlParams.get('locale');
        const savedLocale = localStorage.getItem('selectedLanguage') || localStorage.getItem('preferred_locale');

        return urlLocale || savedLocale || 'en';
    }

    /**
     * Remove data-i18n attributes from dynamic content (DUAL-SYSTEM compliance)
     * As per WorkingLogic.md: Integration files remove data-i18n after updating content
     */
    removeDynamicDataI18n() {
        const dynamicSelectors = [
            '.teacher-name',
            '.teacher-title',
            '.teacher-company',
            '.teacher-bio',
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
     * Show teacher details modal with drill-down information
     */
    showTeacherModal(teacher) {
        // Create modal backdrop
        const modalBackdrop = document.createElement('div');
        modalBackdrop.className = 'teacher-modal-backdrop';
        modalBackdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        // Get teacher data
        const name = teacher.full_name || teacher.name || 'Teacher';
        const title = teacher.professional_title || teacher.title || 'Professional';
        const company = teacher.company || 'Company';
        const bio = teacher.bio || 'No biography available.';
        const photo = this.getTeacherPhoto(teacher);
        const skills = teacher.skills || [];
        const stats = teacher.statistics || {};
        const courses = teacher.courses_taught || [];

        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.className = 'teacher-modal-content';
        modalContent.style.cssText = `
            background: linear-gradient(135deg, #050f2c 0%, #0a1940 100%);
            border-radius: 20px;
            padding: 0;
            max-width: 800px;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            border: 1px solid rgba(102, 126, 234, 0.3);
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            transform: scale(0.9);
            transition: transform 0.3s ease;
        `;

        modalContent.innerHTML = `
            <div class="teacher-modal-header" style="position: relative; height: 200px; background: linear-gradient(45deg, #667eea, #764ba2); border-radius: 20px 20px 0 0; overflow: hidden;">
                <div class="teacher-modal-close" style="position: absolute; top: 15px; right: 15px; width: 40px; height: 40px; background: rgba(0,0,0,0.5); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; color: white; font-size: 20px; transition: background 0.3s ease; z-index: 1;">
                    ×
                </div>
                <div class="teacher-modal-photo" style="position: absolute; left: 40px; top: 120px; width: 160px; height: 160px; border-radius: 50%; overflow: hidden; border: 6px solid white; box-shadow: 0 10px 30px rgba(0,0,0,0.3); z-index: 1;">
                    <img src="${photo}" alt="${name}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div class="teacher-modal-rating" style="position: absolute; top: 15px; left: 15px; background: rgba(0,0,0,0.7); backdrop-filter: blur(10px); padding: 8px 15px; border-radius: 25px; color: #ffd659; font-weight: 600; z-index: 1;">
                    ⭐ ${stats.rating || '4.8'}
                </div>
            </div>

            <div class="teacher-modal-body" style="padding: 80px 40px 40px 40px; color: white;">
                <div class="teacher-modal-intro" style="margin-left: 180px; margin-bottom: 40px;">
                    <h2 style="font-size: 28px; font-weight: 700; margin: 0 0 10px 0; color: white;" data-i18n="instructor_grid.content.instructors.${teacher.id - 1}.name">${name}</h2>
                    <div style="font-size: 18px; color: #a0a7ff; margin-bottom: 5px;" data-i18n="instructor_grid.content.instructors.${teacher.id - 1}.expertise">${title}</div>
                    <div style="font-size: 14px; color: rgba(255,255,255,0.6);" data-i18n="instructor_grid.content.instructors.${teacher.id - 1}.company">${company}</div>
                </div>

                <div class="teacher-modal-stats" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; margin-bottom: 40px;">
                    <div style="text-align: center; padding: 20px; background: rgba(255,255,255,0.05); border-radius: 12px;">
                        <div style="font-size: 24px; font-weight: 700; color: #ffd659; margin-bottom: 5px;">${stats.courses_count || '3'}</div>
                        <div style="font-size: 12px; color: rgba(255,255,255,0.6); text-transform: uppercase;" data-i18n="teacher.stats.courses">Courses</div>
                    </div>
                    <div style="text-align: center; padding: 20px; background: rgba(255,255,255,0.05); border-radius: 12px;">
                        <div style="font-size: 24px; font-weight: 700; color: #ffd659; margin-bottom: 5px;">${stats.students_taught || '500'}</div>
                        <div style="font-size: 12px; color: rgba(255,255,255,0.6); text-transform: uppercase;" data-i18n="teacher.stats.students">Students</div>
                    </div>
                    <div style="text-align: center; padding: 20px; background: rgba(255,255,255,0.05); border-radius: 12px;">
                        <div style="font-size: 24px; font-weight: 700; color: #ffd659; margin-bottom: 5px;">${stats.years_experience || '5'}+</div>
                        <div style="font-size: 12px; color: rgba(255,255,255,0.6); text-transform: uppercase;" data-i18n="teacher.stats.years">Years</div>
                    </div>
                    <div style="text-align: center; padding: 20px; background: rgba(255,255,255,0.05); border-radius: 12px;">
                        <div style="font-size: 24px; font-weight: 700; color: #ffd659; margin-bottom: 5px;">${stats.completion_rate || '95'}%</div>
                        <div style="font-size: 12px; color: rgba(255,255,255,0.6); text-transform: uppercase;" data-i18n="teacher.stats.completion">Completion</div>
                    </div>
                </div>

                <div class="teacher-modal-section" style="margin-bottom: 30px;">
                    <h3 style="font-size: 20px; font-weight: 600; color: #667eea; margin-bottom: 15px;" data-i18n="teacher.modal.about">About</h3>
                    <p style="line-height: 1.6; color: rgba(255,255,255,0.8); margin: 0;" data-i18n="instructor_grid.content.instructors.${teacher.id - 1}.bio">${bio}</p>
                </div>

                ${skills.length > 0 ? `
                <div class="teacher-modal-section" style="margin-bottom: 30px;">
                    <h3 style="font-size: 20px; font-weight: 600; color: #667eea; margin-bottom: 15px;" data-i18n="teacher.modal.skills">Expertise</h3>
                    <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                        ${skills.map((skill, index) => `
                            <span style="padding: 8px 16px; background: rgba(255, 214, 89, 0.15); border: 1px solid rgba(255, 214, 89, 0.4); border-radius: 20px; font-size: 14px; color: #ffd659; font-weight: 500;" data-i18n="instructor_grid.content.instructors.${teacher.id - 1}.specialties.${index}">${skill}</span>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

                ${courses.length > 0 ? `
                <div class="teacher-modal-section" style="margin-bottom: 20px;">
                    <h3 style="font-size: 20px; font-weight: 600; color: #667eea; margin-bottom: 15px;" data-i18n="teacher.modal.courses">Courses Taught</h3>
                    <div style="display: grid; gap: 15px;">
                        ${courses.slice(0, 3).map(course => `
                            <div style="padding: 15px 20px; background: rgba(255,255,255,0.03); border-radius: 12px; border-left: 4px solid #667eea;">
                                <div style="font-weight: 600; color: white; margin-bottom: 5px;">${course.name || 'Course Name'}</div>
                                <div style="font-size: 13px; color: rgba(255,255,255,0.6); margin-bottom: 8px;">⭐ ${course.rating || '4.8'} • ${course.students || '500'} students</div>
                                <div style="font-size: 12px; color: rgba(255,255,255,0.5);">${course.completion_rate || '95'}% completion rate</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

                <div class="teacher-modal-actions" style="display: flex; gap: 15px; justify-content: center; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
                    <button class="teacher-contact-btn" style="padding: 12px 30px; background: linear-gradient(45deg, #667eea, #764ba2); border: none; border-radius: 25px; color: white; font-weight: 600; cursor: pointer; transition: transform 0.3s ease;" data-i18n="teacher.modal.contact">Contact Teacher</button>
                    <button class="teacher-courses-btn" style="padding: 12px 30px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.3); border-radius: 25px; color: white; font-weight: 600; cursor: pointer; transition: all 0.3s ease;" data-i18n="teacher.modal.view_courses">View Courses</button>
                </div>
            </div>
        `;

        // Add event listeners
        const closeBtn = modalContent.querySelector('.teacher-modal-close');
        closeBtn.addEventListener('click', () => this.closeModal(modalBackdrop));

        // Close on backdrop click
        modalBackdrop.addEventListener('click', (e) => {
            if (e.target === modalBackdrop) {
                this.closeModal(modalBackdrop);
            }
        });

        // Action buttons
        const contactBtn = modalContent.querySelector('.teacher-contact-btn');
        const coursesBtn = modalContent.querySelector('.teacher-courses-btn');

        contactBtn?.addEventListener('click', () => {
            console.log('Contact teacher:', teacher.full_name);
            // Could open contact form or mailto link
            if (teacher.contact_info?.email) {
                window.location.href = `mailto:${teacher.contact_info.email}`;
            }
        });

        coursesBtn?.addEventListener('click', () => {
            console.log('View courses by:', teacher.full_name);
            // Could navigate to courses page filtered by this teacher
            window.location.href = 'courses.html?instructor=' + encodeURIComponent(teacher.full_name);
        });

        // Append to body
        modalBackdrop.appendChild(modalContent);
        document.body.appendChild(modalBackdrop);

        // Animate in
        requestAnimationFrame(() => {
            modalBackdrop.style.opacity = '1';
            modalContent.style.transform = 'scale(1)';
        });

        // Close on Escape key
        this.escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeModal(modalBackdrop);
            }
        };
        document.addEventListener('keydown', this.escapeHandler);
    }

    /**
     * Close teacher modal
     */
    closeModal(modalBackdrop) {
        modalBackdrop.style.opacity = '0';
        const modalContent = modalBackdrop.querySelector('.teacher-modal-content');
        modalContent.style.transform = 'scale(0.9)';

        setTimeout(() => {
            document.body.removeChild(modalBackdrop);
            document.removeEventListener('keydown', this.escapeHandler);
        }, 300);
    }


    /**
     * Public method to refresh teachers (now handles language changes)
     */
    async refresh() {
        console.log(`🔄 [SharedTeacherCard-${this.instanceId}] Refreshing teacher cards...`);

        await this.loadTeachers();
        this.renderTeachers();

        // DUAL-SYSTEM: Remove data-i18n from dynamic content after refresh
        setTimeout(() => {
            this.removeDynamicDataI18n();
        }, 200);

        console.log(`✅ [SharedTeacherCard-${this.instanceId}] Teacher cards refreshed successfully`);
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