/**
 * Enhanced Language Manager for Home Page
 * Fixes Webflow compatibility issues during language switching
 * Works with nd_home database table structure
 */

class EnhancedLanguageManager {
    constructor() {
        this.supportedLocales = ['en', 'ru', 'he'];
        this.currentLocale = this.getInitialLocale();
        this.contentCache = {};
        this.isLoading = false;
        this.apiBaseUrl = window.location.hostname === 'localhost'
            ? 'http://localhost:1337'
            : 'https://aistudio555jamstack-production.up.railway.app';

        // Store Webflow state before modifications
        this.webflowState = {
            dropdowns: [],
            navState: null
        };

        // Initialize on DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    /**
     * Initialize language manager with Webflow preservation
     */
    init() {
        console.log('Enhanced Language Manager initializing...');

        // Set initial language state
        this.setInitialLanguageState();

        // Attach language switcher handlers
        this.attachLanguageSwitchers();

        // Load content for current language
        if (this.currentLocale !== 'en') {
            // Only load if not English (English is default in HTML)
            this.loadPageContent(this.currentLocale);
        }

        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            const locale = this.getLocaleFromURL();
            if (locale !== this.currentLocale) {
                this.switchLanguage(locale, false);
            }
        });
    }

    /**
     * Get initial locale from URL, localStorage, or browser
     */
    getInitialLocale() {
        const urlParams = new URLSearchParams(window.location.search);
        const urlLocale = urlParams.get('locale');
        if (urlLocale && this.supportedLocales.includes(urlLocale)) {
            return urlLocale;
        }

        const savedLocale = localStorage.getItem('preferred_locale');
        if (savedLocale && this.supportedLocales.includes(savedLocale)) {
            return savedLocale;
        }

        const browserLocale = navigator.language.split('-')[0];
        if (this.supportedLocales.includes(browserLocale)) {
            return browserLocale;
        }

        return 'en';
    }

    /**
     * Get locale from URL parameters
     */
    getLocaleFromURL() {
        const params = new URLSearchParams(window.location.search);
        const locale = params.get('locale');
        return locale && this.supportedLocales.includes(locale) ? locale : null;
    }

    /**
     * Set initial language state in UI
     */
    setInitialLanguageState() {
        // Update language pills
        const pills = document.querySelectorAll('.lang-pill, .mobile-lang-pill');
        pills.forEach(pill => {
            const lang = pill.textContent.toLowerCase();
            if (lang === this.currentLocale) {
                pill.classList.add('active');
            } else {
                pill.classList.remove('active');
            }
        });

        // Set RTL for Hebrew
        if (this.currentLocale === 'he') {
            document.documentElement.setAttribute('dir', 'rtl');
            document.documentElement.setAttribute('lang', 'he');
        } else {
            document.documentElement.setAttribute('dir', 'ltr');
            document.documentElement.setAttribute('lang', this.currentLocale);
        }
    }

    /**
     * Attach click handlers to language switchers
     */
    attachLanguageSwitchers() {
        // Override the existing setActivePill function
        window.setActivePill = (element) => {
            const lang = element.textContent.toLowerCase();
            this.switchLanguage(lang);

            // Update visual state
            const allPills = document.querySelectorAll('.lang-pill, .mobile-lang-pill');
            allPills.forEach(pill => pill.classList.remove('active'));

            // Set active on both desktop and mobile versions
            const pillText = element.textContent;
            document.querySelectorAll('.lang-pill, .mobile-lang-pill').forEach(pill => {
                if (pill.textContent === pillText) {
                    pill.classList.add('active');
                }
            });
        };
    }

    /**
     * Save Webflow component states before DOM updates
     */
    saveWebflowState() {
        // Save dropdown states
        this.webflowState.dropdowns = [];
        const openDropdowns = document.querySelectorAll('.w-dropdown-toggle.w--open');
        openDropdowns.forEach(dropdown => {
            const id = dropdown.getAttribute('data-w-id');
            if (id) {
                this.webflowState.dropdowns.push(id);
            }
        });

        // Save navigation state
        const navMenu = document.querySelector('.nav-menu, .w-nav-menu');
        if (navMenu) {
            this.webflowState.navState = {
                isOpen: navMenu.classList.contains('nav-open'),
                scrollPosition: window.scrollY
            };
        }
    }

    /**
     * Restore Webflow component states after DOM updates
     */
    restoreWebflowState() {
        // Restore dropdown states
        this.webflowState.dropdowns.forEach(id => {
            const dropdown = document.querySelector(`[data-w-id="${id}"]`);
            if (dropdown) {
                dropdown.classList.add('w--open');
                const list = dropdown.nextElementSibling;
                if (list && list.classList.contains('w-dropdown-list')) {
                    list.classList.add('w--open');
                }
            }
        });

        // Restore navigation state
        if (this.webflowState.navState) {
            const navMenu = document.querySelector('.nav-menu, .w-nav-menu');
            const menuButton = document.querySelector('.menu-button, .w-nav-button');

            if (navMenu && this.webflowState.navState.isOpen) {
                navMenu.classList.add('nav-open');
                if (menuButton) {
                    menuButton.classList.add('w--open');
                }
            }

            // Restore scroll position
            window.scrollTo(0, this.webflowState.navState.scrollPosition);
        }
    }

    /**
     * Reinitialize Webflow components safely
     */
    reinitializeWebflow() {
        if (window.Webflow) {
            try {
                // Save current state
                this.saveWebflowState();

                // Soft refresh - preserves most functionality
                window.Webflow.ready();

                // Reinitialize interactions if available
                if (window.Webflow.require) {
                    try {
                        const ix2 = window.Webflow.require('ix2');
                        if (ix2 && ix2.init) {
                            ix2.init();
                        }
                    } catch (e) {
                        console.log('IX2 reinitialization skipped:', e);
                    }
                }

                // Restore saved state
                setTimeout(() => {
                    this.restoreWebflowState();
                }, 100);

            } catch (error) {
                console.error('Error reinitializing Webflow:', error);
            }
        }
    }

    /**
     * Switch to a different language
     */
    async switchLanguage(locale, updateHistory = true) {
        if (!this.supportedLocales.includes(locale)) {
            console.warn(`Unsupported locale: ${locale}`);
            return;
        }

        if (locale === this.currentLocale && this.contentCache[locale]) {
            return; // Already in this language with content loaded
        }

        // Show loading state
        this.showLoadingState();

        try {
            // Save Webflow state before changes
            this.saveWebflowState();

            // Load content for new language
            await this.loadPageContent(locale);

            // Update current locale
            this.currentLocale = locale;

            // Save preference
            localStorage.setItem('preferred_locale', locale);

            // Update URL
            if (updateHistory) {
                const url = new URL(window.location);
                url.searchParams.set('locale', locale);
                history.pushState({locale}, '', url);
            }

            // Update UI state
            this.setInitialLanguageState();

            // Reinitialize Webflow components
            this.reinitializeWebflow();

            // Dispatch custom event
            window.dispatchEvent(new CustomEvent('languageChanged', {
                detail: { locale }
            }));

        } catch (error) {
            console.error('Error switching language:', error);
            this.showError('Failed to load content in selected language');
        } finally {
            this.hideLoadingState();
        }
    }

    /**
     * Load page content for a specific locale
     */
    async loadPageContent(locale) {
        // Check cache first
        if (this.contentCache[locale]) {
            this.updatePageContent(this.contentCache[locale], locale);
            return;
        }

        // Use nd_home API endpoint
        const endpoint = `/api/nd/home-page?locale=${locale}`;

        try {
            const response = await fetch(`${this.apiBaseUrl}${endpoint}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();

            // Cache the content
            this.contentCache[locale] = data;

            // Update page content
            this.updatePageContent(data, locale);

        } catch (error) {
            console.error('Error loading content:', error);

            // Try fallback to English if not already
            if (locale !== 'en') {
                console.log('Falling back to English content');
                await this.loadPageContent('en');
            }
        }
    }

    /**
     * Update page content with translations
     */
    updatePageContent(data, locale) {
        console.log('Updating page content for locale:', locale);
        console.log('API data structure:', data);

        // Handle the API response structure - data.data contains the sections directly
        if (data && data.data) {
            const sections = data.data;

            // Process each section
            Object.keys(sections).forEach(sectionKey => {
                const section = sections[sectionKey];
                if (section && section.content) {
                    this.updateSectionContent(sectionKey, section.content);
                }
            });

            // Update elements with data-i18n attributes
            const elements = document.querySelectorAll('[data-i18n]');
            console.log(`Found ${elements.length} elements with data-i18n attributes`);

            elements.forEach(element => {
                const key = element.getAttribute('data-i18n');
                // Pass data.data since that's where the sections are
                const translation = this.getTranslation(data.data, key);

                if (translation) {
                    // Preserve Webflow attributes
                    const webflowId = element.getAttribute('data-w-id');

                    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                        element.placeholder = translation;
                    } else {
                        // Update text content while preserving structure
                        if (element.children.length === 0) {
                            element.textContent = translation;
                        } else {
                            // Update only text nodes to preserve child elements
                            const walker = document.createTreeWalker(
                                element,
                                NodeFilter.SHOW_TEXT,
                                null,
                                false
                            );

                            let node;
                            while (node = walker.nextNode()) {
                                if (node.nodeValue.trim()) {
                                    node.nodeValue = translation;
                                    break;
                                }
                            }
                        }
                    }

                    // Restore Webflow ID if it was lost
                    if (webflowId) {
                        element.setAttribute('data-w-id', webflowId);
                    }
                }
            });
        }
    }

    /**
     * Update specific section content
     */
    updateSectionContent(sectionKey, content) {
        // Map section keys to their content updates
        switch(sectionKey) {
            case 'hero':
                this.updateHeroSection(content);
                break;
            case 'features':
                this.updateFeaturesSection(content);
                break;
            case 'testimonials':
                this.updateTestimonialsSection(content);
                break;
            case 'faq':
                this.updateFAQSection(content);
                break;
            // Add more sections as needed
        }
    }

    /**
     * Update hero section with proper Webflow preservation
     */
    updateHeroSection(content) {
        if (content.title) {
            const titleEl = document.querySelector('.banner-heading');
            if (titleEl) titleEl.textContent = content.title;
        }

        if (content.subtitle) {
            const subtitleEl = document.querySelector('.banner-subtitle');
            if (subtitleEl) subtitleEl.textContent = content.subtitle;
        }

        if (content.description) {
            const descEl = document.querySelector('.banner-description-text');
            if (descEl) descEl.textContent = content.description;
        }

        // Update buttons if they exist
        if (content.buttons && Array.isArray(content.buttons)) {
            content.buttons.forEach((button, index) => {
                const buttonEls = document.querySelectorAll('.banner-button-wrapper .primary-button');
                if (buttonEls[index]) {
                    const textBlocks = buttonEls[index].querySelectorAll('.primary-button-text-block');
                    textBlocks.forEach(block => {
                        block.textContent = button.text;
                    });
                }
            });
        }
    }

    /**
     * Update features section
     */
    updateFeaturesSection(content) {
        if (content.title) {
            const titleEl = document.querySelector('[data-i18n="features.content.title"]');
            if (titleEl) titleEl.textContent = content.title;
        }

        if (content.features && Array.isArray(content.features)) {
            content.features.forEach((feature, index) => {
                const featureEl = document.querySelector(`[data-i18n="features.content.features.${index}.title"]`);
                if (featureEl) featureEl.textContent = feature.title;

                const descEl = document.querySelector(`[data-i18n="features.content.features.${index}.description"]`);
                if (descEl) descEl.textContent = feature.description;
            });
        }
    }

    /**
     * Update testimonials section
     */
    updateTestimonialsSection(content) {
        if (content.title) {
            const titleEl = document.querySelector('[data-i18n="testimonials.content.title"]');
            if (titleEl) titleEl.textContent = content.title;
        }

        // Update individual testimonials
        if (content.testimonials && Array.isArray(content.testimonials)) {
            content.testimonials.forEach((testimonial, index) => {
                const quoteEl = document.querySelector(`[data-i18n="testimonials.content.testimonials.${index}.quote"]`);
                if (quoteEl) quoteEl.textContent = testimonial.quote;

                const nameEl = document.querySelector(`[data-i18n="testimonials.content.testimonials.${index}.name"]`);
                if (nameEl) nameEl.textContent = testimonial.name;
            });
        }
    }

    /**
     * Update FAQ section
     */
    updateFAQSection(content) {
        if (content.title) {
            const titleEl = document.querySelector('[data-i18n="faq.content.title"]');
            if (titleEl) titleEl.textContent = content.title;
        }

        // Update individual FAQs
        if (content.questions && Array.isArray(content.questions)) {
            content.questions.forEach((faq, index) => {
                const questionEl = document.querySelector(`[data-i18n="faq.content.questions.${index}.question"]`);
                if (questionEl) questionEl.textContent = faq.question;

                const answerEl = document.querySelector(`[data-i18n="faq.content.questions.${index}.answer"]`);
                if (answerEl) answerEl.textContent = faq.answer;
            });
        }
    }

    /**
     * Get translation from data object using dot notation path
     */
    getTranslation(data, path) {
        const keys = path.split('.');
        let value = data;

        console.log(`Looking for translation: ${path}`);

        for (const key of keys) {
            if (value && typeof value === 'object') {
                value = value[key];
            } else {
                console.log(`Translation not found for path: ${path} at key: ${key}`);
                return null;
            }
        }

        console.log(`Found translation for ${path}:`, value);
        return value;
    }

    /**
     * Show loading state
     */
    showLoadingState() {
        this.isLoading = true;

        // Add loading class to body
        document.body.classList.add('language-switching');

        // Show loading indicator if exists
        const loader = document.getElementById('language-loader');
        if (loader) {
            loader.style.display = 'block';
        }
    }

    /**
     * Hide loading state
     */
    hideLoadingState() {
        this.isLoading = false;

        // Remove loading class
        document.body.classList.remove('language-switching');

        // Hide loading indicator
        const loader = document.getElementById('language-loader');
        if (loader) {
            loader.style.display = 'none';
        }
    }

    /**
     * Show error message
     */
    showError(message) {
        console.error(message);

        // Show error notification if element exists
        const errorEl = document.getElementById('language-error');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.style.display = 'block';

            // Hide after 5 seconds
            setTimeout(() => {
                errorEl.style.display = 'none';
            }, 5000);
        }
    }
}

// Initialize the enhanced language manager
if (typeof window !== 'undefined') {
    console.log('Enhanced Language Manager loading...');
    try {
        window.enhancedLanguageManager = new EnhancedLanguageManager();
        window.enhancedLanguageManagerLoaded = true;
        console.log('Enhanced Language Manager loaded successfully!');
    } catch (error) {
        console.error('Failed to initialize Enhanced Language Manager:', error);
        console.error('Error stack:', error.stack);
    }
}
