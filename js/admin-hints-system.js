/**
 * ADMIN HINTS SYSTEM
 * Provides contextual help and tooltips throughout the admin interface
 * Supports multiple languages and matches the selected admin language
 */

class AdminHintsSystem {
    constructor() {
        this.hints = {};
        this.currentLanguage = 'en';
        this.hintsLoaded = false;
        console.log('🎯 Initializing Admin Hints System...');
    }

    async init() {
        try {
            // Load hints data
            await this.loadHints();

            // Detect current language
            this.detectLanguage();

            // Apply hints to existing elements
            this.applyHints();

            // Set up language change listener
            this.setupLanguageListener();

            // Mark system as loaded
            document.body.classList.add('hint-system-loaded');

            console.log('✅ Admin Hints System loaded successfully');
        } catch (error) {
            console.error('❌ Failed to initialize Admin Hints System:', error);
        }
    }

    async loadHints() {
        try {
            const response = await fetch('/admin-hints.json');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            this.hints = await response.json();
            this.hintsLoaded = true;
            console.log('📚 Hints loaded for languages:', Object.keys(this.hints));
        } catch (error) {
            console.error('❌ Failed to load hints:', error);
            // Fallback to basic English hints
            this.hints = this.getDefaultHints();
            this.hintsLoaded = true;
        }
    }

    detectLanguage() {
        // Try to detect language from various sources
        const langSources = [
            () => document.documentElement.lang,
            () => document.querySelector('[data-language]')?.dataset.language,
            () => localStorage.getItem('admin-language'),
            () => navigator.language.split('-')[0],
            () => 'en' // fallback
        ];

        for (const source of langSources) {
            try {
                const lang = source();
                if (lang && this.hints[lang]) {
                    this.currentLanguage = lang;
                    console.log(`🌐 Language detected: ${lang}`);
                    return;
                }
            } catch (e) {
                continue;
            }
        }

        console.log(`🌐 Using default language: ${this.currentLanguage}`);
    }

    applyHints() {
        if (!this.hintsLoaded) return;

        // Apply section hints
        this.applySectionHints();

        // Apply button hints
        this.applyButtonHints();

        // Apply field hints
        this.applyFieldHints();

        // Apply toggle hints
        this.applyToggleHints();

        // Add tip cards
        this.addTipCards();
    }

    applySectionHints() {
        const currentHints = this.hints[this.currentLanguage] || this.hints.en;

        // Add hints to main section tabs
        const sections = {
            'home': 'button[data-tab="home"]',
            'courses': 'button[data-tab="courses"]',
            'teachers': 'button[data-tab="teachers"]',
            'footer': 'button[data-tab="footer"]'
        };

        Object.entries(sections).forEach(([sectionKey, selector]) => {
            const element = document.querySelector(selector);
            if (element && currentHints.sections[sectionKey]) {
                this.addHintToElement(element, currentHints.sections[sectionKey], 'section');
            }
        });

        // Add section descriptions
        this.addSectionDescriptions();
    }

    addSectionDescriptions() {
        const currentHints = this.hints[this.currentLanguage] || this.hints.en;

        // Add description to courses section
        const coursesContent = document.querySelector('#coursesContent');
        if (coursesContent && currentHints.sections.courses) {
            const description = this.createSectionDescription(currentHints.sections.courses);
            coursesContent.insertBefore(description, coursesContent.firstChild);
        }
    }

    applyButtonHints() {
        const currentHints = this.hints[this.currentLanguage] || this.hints.en;

        const buttonMappings = {
            'add_new_course': '.add-course-btn, #addCourseBtn',
            'edit_details': '.edit-course-btn, [onclick*="editCourse"]',
            'preview': '.preview-btn, [onclick*="preview"]',
            'delete': '.delete-btn, [onclick*="delete"]',
            'save': '.save-btn, [onclick*="save"]',
            'cancel': '.cancel-btn, [onclick*="cancel"]',
            'add_lesson': '.add-lesson-btn, [onclick*="addLesson"]'
        };

        Object.entries(buttonMappings).forEach(([hintKey, selectors]) => {
            const elements = document.querySelectorAll(selectors);
            elements.forEach(element => {
                if (currentHints.buttons[hintKey]) {
                    this.addHintToElement(element, currentHints.buttons[hintKey], 'button');
                }
            });
        });
    }

    applyFieldHints() {
        const currentHints = this.hints[this.currentLanguage] || this.hints.en;

        const fieldMappings = {
            'title': 'input[name="title"], #courseTitle',
            'description': 'textarea[name="description"], #courseDescription',
            'short_description': 'textarea[name="short_description"], #courseShortDescription',
            'price': 'input[name="price"], #coursePrice',
            'old_price': 'input[name="old_price"], #courseOldPrice',
            'category': 'select[name="category"], #courseCategory',
            'instructor': 'input[name="instructor"], #courseInstructor',
            'duration': 'input[name="duration"], #courseDuration',
            'level': 'select[name="level"], #courseLevel',
            'image': 'input[name="image"], #courseImage',
            'video_url': 'input[name="video_url"], #courseVideoUrl'
        };

        Object.entries(fieldMappings).forEach(([hintKey, selectors]) => {
            const elements = document.querySelectorAll(selectors);
            elements.forEach(element => {
                if (currentHints.fields[hintKey]) {
                    this.addFieldHint(element, currentHints.fields[hintKey]);
                }
            });
        });
    }

    applyToggleHints() {
        const currentHints = this.hints[this.currentLanguage] || this.hints.en;

        const toggleMappings = {
            'visible': '.visibility-toggle, [data-toggle="visible"]',
            'featured': '.featured-toggle, [data-toggle="featured"]',
            'published': '.published-toggle, [data-toggle="published"]'
        };

        Object.entries(toggleMappings).forEach(([hintKey, selectors]) => {
            const elements = document.querySelectorAll(selectors);
            elements.forEach(element => {
                if (currentHints.toggles[hintKey]) {
                    this.addToggleHint(element, currentHints.toggles[hintKey]);
                }
            });
        });
    }

    addTipCards() {
        const currentHints = this.hints[this.currentLanguage] || this.hints.en;

        // Add tip card to courses section
        const coursesContent = document.querySelector('#coursesContent');
        if (coursesContent && currentHints.tips) {
            const tipCard = this.createTipCard([
                currentHints.tips.auto_save,
                currentHints.tips.url_generation,
                currentHints.tips.best_practices
            ]);
            coursesContent.appendChild(tipCard);
        }
    }

    addHintToElement(element, hintText, type = 'default') {
        const hintIcon = this.createHintIcon(hintText, type);

        if (element.tagName === 'BUTTON' || element.classList.contains('btn')) {
            // For buttons, wrap in container
            if (!element.parentElement.classList.contains('button-with-hint')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'button-with-hint';
                element.parentNode.insertBefore(wrapper, element);
                wrapper.appendChild(element);
                wrapper.appendChild(hintIcon);
            }
        } else {
            // For other elements, add after
            element.parentNode.insertBefore(hintIcon, element.nextSibling);
        }
    }

    addFieldHint(element, hintText) {
        const label = element.closest('.form-group')?.querySelector('label') ||
                     document.querySelector(`label[for="${element.id}"]`);

        if (label) {
            const wrapper = document.createElement('div');
            wrapper.className = 'field-hint-wrapper';

            const hintIcon = this.createHintIcon(hintText, 'field');
            hintIcon.className += ' field-hint-icon';

            label.parentNode.insertBefore(wrapper, label);
            wrapper.appendChild(label);
            wrapper.appendChild(hintIcon);
        }
    }

    addToggleHint(element, hintText) {
        const wrapper = document.createElement('div');
        wrapper.className = 'toggle-with-hint';

        const labelWrapper = document.createElement('div');
        labelWrapper.className = 'toggle-label-with-hint';

        const hintIcon = this.createHintIcon(hintText, 'toggle');

        // Get the label BEFORE moving the element
        const label = element.nextElementSibling;

        // Check if label would create a circular reference
        if (label && (label === wrapper || label.contains(wrapper))) {
            console.warn('Skipping hint for element to avoid circular reference', element);
            return;
        }

        element.parentNode.insertBefore(wrapper, element);
        wrapper.appendChild(element);
        wrapper.appendChild(labelWrapper);

        if (label && label.tagName === 'SPAN') {
            labelWrapper.appendChild(label);
            labelWrapper.appendChild(hintIcon);
        }
    }

    createHintIcon(hintText, type = 'default') {
        const hintIcon = document.createElement('span');
        hintIcon.className = `hint-icon hint-${type}`;
        hintIcon.setAttribute('data-lang', this.currentLanguage);

        const tooltip = document.createElement('div');
        tooltip.className = 'hint-tooltip';
        tooltip.textContent = hintText;

        hintIcon.appendChild(tooltip);

        return hintIcon;
    }

    createSectionDescription(text) {
        const description = document.createElement('div');
        description.className = 'section-hint-description language-aware-hint';
        description.setAttribute('data-lang', this.currentLanguage);
        description.textContent = text;

        return description;
    }

    createTipCard(tips) {
        const card = document.createElement('div');
        card.className = 'admin-tip-card language-aware-hint';
        card.setAttribute('data-lang', this.currentLanguage);

        const title = document.createElement('h4');
        title.textContent = this.currentLanguage === 'he' ? 'עצות מועילות' :
                           this.currentLanguage === 'ru' ? 'Полезные советы' : 'Helpful Tips';

        const list = document.createElement('div');
        tips.forEach(tip => {
            const tipElement = document.createElement('p');
            tipElement.textContent = `• ${tip}`;
            list.appendChild(tipElement);
        });

        card.appendChild(title);
        card.appendChild(list);

        return card;
    }

    setupLanguageListener() {
        // Listen for language changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' &&
                    (mutation.attributeName === 'lang' || mutation.attributeName === 'data-language')) {
                    this.detectLanguage();
                    this.refreshHints();
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['lang', 'data-language']
        });

        // Listen for storage changes (if language is stored)
        window.addEventListener('storage', (e) => {
            if (e.key === 'admin-language') {
                this.detectLanguage();
                this.refreshHints();
            }
        });
    }

    refreshHints() {
        // Remove existing hints
        document.querySelectorAll('.hint-icon, .section-hint-description, .admin-tip-card').forEach(el => {
            el.remove();
        });

        // Remove hint wrappers
        document.querySelectorAll('.button-with-hint, .field-hint-wrapper, .toggle-with-hint').forEach(wrapper => {
            const child = wrapper.firstElementChild;
            if (child) {
                wrapper.parentNode.insertBefore(child, wrapper);
                wrapper.remove();
            }
        });

        // Reapply hints with new language
        setTimeout(() => this.applyHints(), 100);
    }

    setLanguage(language) {
        if (this.hints[language]) {
            this.currentLanguage = language;
            localStorage.setItem('admin-language', language);
            document.documentElement.setAttribute('data-language', language);
            this.refreshHints();
            console.log(`🌐 Language changed to: ${language}`);
        }
    }

    getDefaultHints() {
        return {
            en: {
                sections: {
                    courses: "Manage all your courses here. Use Quick Actions for fast edits.",
                    home: "Control your homepage content and layout.",
                    teachers: "Manage instructor profiles and information.",
                    footer: "Update footer content across your site."
                },
                buttons: {
                    add_new_course: "Create a new course",
                    edit_details: "Edit course details",
                    preview: "Preview how this looks to students",
                    delete: "Delete this item permanently"
                },
                toggles: {
                    visible: "Show/hide on your website",
                    featured: "Display in featured section",
                    published: "Make available for enrollment"
                },
                fields: {
                    title: "Course name displayed to students",
                    description: "Full course description",
                    price: "Course price (leave empty for free)"
                },
                tips: {
                    auto_save: "Changes save automatically every 30 seconds",
                    url_generation: "URLs are generated automatically",
                    best_practices: "Use clear titles and descriptions"
                }
            }
        };
    }
}

// Initialize the hints system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.adminHints = new AdminHintsSystem();
    window.adminHints.init();
});

// Expose globally for manual language switching
window.setAdminLanguage = (language) => {
    if (window.adminHints) {
        window.adminHints.setLanguage(language);
    }
};