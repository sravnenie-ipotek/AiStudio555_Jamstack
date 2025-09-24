/**
 * Enhanced Language Manager for AI Studio
 * Handles dynamic language switching with intelligent mapping and comprehensive fallbacks
 * Version: 3.0 - Complete Translation Fix
 */

class LanguageManager {
    constructor() {
        this.supportedLocales = ['en', 'ru', 'he'];
        this.currentLocale = this.getInitialLocale();
        this.contentCache = {};
        this.isLoading = false;
        this.apiBaseUrl = window.location.hostname === 'localhost'
            ? 'http://localhost:3000'
            : 'https://aistudio555jamstack-production.up.railway.app';

        // Track translation success rate for debugging
        this.translationStats = {
            success: 0,
            failed: 0,
            fallback: 0
        };

        // Initialize on DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    /**
     * Initialize language manager
     */
    init() {
        console.log('[LanguageManager] Enhanced Version 3.0 Initializing...');
        console.log('[LanguageManager] Current page:', this.getCurrentPageName());
        console.log('[LanguageManager] Initial locale:', this.currentLocale);

        // Remove any floating language-switcher with locale-selector
        this.removeFloatingLanguageSwitcher();

        // Set initial language state
        this.setInitialLanguageState();

        // Attach language switcher handlers
        this.attachLanguageSwitchers();

        // IMMEDIATE: Show navigation and UI elements (fix race condition)
        document.body.classList.add('language-ready');
        console.log('[LanguageManager] Navigation and UI elements revealed immediately');

        // Load content for current language if needed
        if (this.shouldLoadContent()) {
            console.log('[LanguageManager] Loading dynamic content for locale:', this.currentLocale);
            this.loadPageContent(this.currentLocale).then(() => {
                console.log('[LanguageManager] Dynamic content load complete');
            }).catch((error) => {
                console.warn('[LanguageManager] Dynamic content load failed:', error);
            });
        } else {
            console.log('[LanguageManager] No dynamic content to load');
        }

        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            const locale = this.getLocaleFromURL();
            if (locale && locale !== this.currentLocale) {
                this.switchLanguage(locale, false);
            }
        });
    }

    /**
     * Remove any floating language-switcher elements
     */
    removeFloatingLanguageSwitcher() {
        // Remove immediately if exists
        const removeSwitcher = () => {
            const switchers = document.querySelectorAll('.language-switcher');
            switchers.forEach(switcher => {
                // Check if it has the locale-selector or is positioned fixed
                if (switcher.querySelector('#locale-selector') ||
                    (switcher.style.position === 'fixed' && switcher.style.top === '20px')) {
                    switcher.remove();
                    console.log('[LanguageManager] Removed floating language-switcher');
                }
            });

            // Also check for any standalone locale-selector
            const selectors = document.querySelectorAll('#locale-selector');
            selectors.forEach(selector => {
                const parent = selector.closest('.language-switcher');
                if (parent) {
                    parent.remove();
                } else {
                    selector.remove();
                }
                console.log('[LanguageManager] Removed locale-selector');
            });
        };

        // Remove immediately
        removeSwitcher();

        // Set up observer to prevent re-addition
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        if (node.classList && node.classList.contains('language-switcher')) {
                            if (node.querySelector('#locale-selector') ||
                                (node.style.position === 'fixed' && node.style.top === '20px')) {
                                node.remove();
                                console.log('[LanguageManager] Prevented language-switcher addition');
                            }
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Also check after a delay in case it's added later
        setTimeout(removeSwitcher, 100);
        setTimeout(removeSwitcher, 500);
    }

    /**
     * Get initial locale from URL, localStorage, or browser
     */
    getInitialLocale() {
        // Priority: URL > localStorage > browser (first visit only) > default
        const urlLocale = this.getLocaleFromURL();
        if (urlLocale) {
            // URL parameter takes highest priority
            localStorage.setItem('preferred_locale', urlLocale);
            localStorage.setItem('locale_detection_complete', 'true');
            return urlLocale;
        }

        const savedLocale = localStorage.getItem('preferred_locale');
        const detectionComplete = localStorage.getItem('locale_detection_complete');

        if (savedLocale && this.supportedLocales.includes(savedLocale)) {
            // User has a saved preference
            return savedLocale;
        }

        // Browser detection ONLY on first visit (prevents race condition)
        if (!detectionComplete) {
            const browserLocale = navigator.language.split('-')[0];
            if (this.supportedLocales.includes(browserLocale)) {
                // Save the detected locale for future visits
                localStorage.setItem('preferred_locale', browserLocale);
                localStorage.setItem('locale_detection_complete', 'true');

                // Apply browser locale immediately but controlled
                if (browserLocale !== 'en') {
                    console.log(`[LanguageManager] Browser locale detected: ${browserLocale}, applying immediately`);
                    // Set a flag to indicate we're doing initial browser-based switch
                    this.isInitialBrowserSwitch = true;
                }
                return browserLocale; // Use detected locale
            }
            // Mark detection as complete even if no match
            localStorage.setItem('locale_detection_complete', 'true');
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

        // Set RTL for Hebrew or reset to LTR
        if (this.currentLocale === 'he') {
            document.documentElement.setAttribute('dir', 'rtl');
            document.documentElement.setAttribute('lang', 'he');
            document.body.classList.add('rtl-mode');
        } else {
            document.documentElement.setAttribute('dir', 'ltr');
            document.documentElement.setAttribute('lang', this.currentLocale);
            document.body.classList.remove('rtl-mode');
        }
    }

    /**
     * Attach click handlers to language switchers
     */
    attachLanguageSwitchers() {
        // Override the existing setActivePill function
        window.setActivePill = (element) => {
            // Use data-locale attribute if available, otherwise fall back to text content
            const locale = element.dataset.locale || element.textContent.toLowerCase();
            this.switchLanguage(locale);

            // Update visual state (original functionality)
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
     * Check if we should load content (for dynamic pages)
     */
    shouldLoadContent() {
        // Check if page has dynamic content areas
        return document.querySelector("[data-dynamic-content]") !== null || document.body.dataset.dynamicContent === "true";
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

            // Update UI state and force visual refresh
            this.setInitialLanguageState();

            // Force DOM refresh for Hebrew/RTL changes
            if (locale === 'he') {
                document.body.style.display = 'none';
                document.body.offsetHeight; // Trigger reflow
                document.body.style.display = '';
            }

            // Dispatch custom event
            window.dispatchEvent(new CustomEvent('languageChanged', {
                detail: { locale }
            }));

            // Log translation stats
            this.logTranslationStats();

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
        console.log('[LanguageManager] loadPageContent called with locale:', locale);

        // Reset translation stats
        this.translationStats = { success: 0, failed: 0, fallback: 0 };

        // Check cache first
        if (this.contentCache[locale]) {
            console.log('[LanguageManager] Using cached content for:', locale);
            this.updatePageContent(this.contentCache[locale], locale);
            return;
        }

        // Determine which API endpoint to call based on current page
        const pageName = this.getCurrentPageName();
        const endpoint = this.getAPIEndpoint(pageName, locale);

        console.log('[LanguageManager] Page name:', pageName);
        console.log('[LanguageManager] Endpoint:', endpoint);

        if (!endpoint) {
            console.log('No dynamic content endpoint for this page - applying local translations only');
            this.applyLocalTranslations(locale);
            return;
        }

        try {
            const url = `${this.apiBaseUrl}${endpoint}&_t=${Date.now()}`;
            console.log('[LanguageManager] Fetching from:', url);
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();

            // Cache the content
            this.contentCache[locale] = data;

            // Update page content
            this.updatePageContent(data, locale);

        } catch (error) {
            console.error('Error loading content:', error);

            console.log(`[LanguageManager] API failed for ${locale}, using local translations as fallback`);
            // Apply local translations when API fails
            this.applyLocalTranslations(locale);
        }
    }

    /**
     * Apply local translations when no API endpoint is available
     */
    applyLocalTranslations(locale) {
        console.log('[LanguageManager] Applying local translations for:', locale);

        // Update all elements with data-i18n attribute using local fallbacks
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.dataset.i18n;
            const value = this.getLocalizedText(key, locale);

            if (value) {
                element.textContent = value;
                this.translationStats.success++;
                console.log(`[Local Translation] ${key}: "${value}"`);
            } else {
                console.warn(`[Local Translation Missing] ${key}`);
                this.translationStats.failed++;
            }
        });

        // Handle placeholder translations
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.dataset.i18nPlaceholder;
            const value = this.getLocalizedText(key, locale);
            if (value) {
                element.placeholder = value;
                this.translationStats.success++;
                console.log(`[Local Translation Placeholder] ${key}: "${value}"`);
            } else {
                console.warn(`[Local Translation Placeholder Missing] ${key}`);
                this.translationStats.failed++;
            }
        });

        // Handle value translations (for buttons, submit inputs)
        document.querySelectorAll('[data-i18n-value]').forEach(element => {
            const key = element.dataset.i18nValue;
            const value = this.getLocalizedText(key, locale);
            if (value) {
                element.value = value;
                this.translationStats.success++;
                console.log(`[Local Translation Value] ${key}: "${value}"`);
            } else {
                console.warn(`[Local Translation Value Missing] ${key}`);
                this.translationStats.failed++;
            }
        });

        // Handle RTL for Hebrew
        if (locale === 'he') {
            document.documentElement.setAttribute('dir', 'rtl');
            document.body.classList.add('rtl');
        } else {
            document.documentElement.setAttribute('dir', 'ltr');
            document.body.classList.remove('rtl');
        }

        // Log translation stats
        this.logTranslationStats();
    }

    /**
     * Get current page name from URL or body class
     */
    getCurrentPageName() {
        // Try to get from body data attribute first
        if (document.body.dataset.page) {
            return document.body.dataset.page;
        }

        // Parse from pathname
        const path = window.location.pathname;
        if (path.includes('home') || path === '/' || path === '/backups/newDesign/') {
            return 'home';
        }
        if (path.includes('courses')) return 'courses';
        if (path.includes('pricing')) return 'pricing';
        if (path.includes('teachers')) return 'teachers';
        if (path.includes('blog')) return 'blog';
        if (path.includes('contact-us') || path.includes('contact')) return 'contact';
        if (path.includes('career-center')) return 'career-center';
        if (path.includes('career-orientation')) return 'career-orientation';

        return 'home'; // default
    }

    /**
     * Get API endpoint for page and locale
     */
    getAPIEndpoint(pageName, locale) {
        const endpoints = {
            'home': `/api/nd/home-page?locale=${locale}`,
            'courses': `/api/nd/courses-page?locale=${locale}`,
            'pricing': `/api/nd/pricing-page?locale=${locale}`,
            'course-details': `/api/nd/course-details-page?locale=${locale}`,
            'teachers': `/api/nd/teachers-page?locale=${locale}`,
            'blog': `/api/nd/blog-page?locale=${locale}`,
            'contact': `/api/nd/contact-page?locale=${locale}`,
            'career-center': `/api/nd/career-center-platform-page?locale=${locale}`,
            'career-orientation': `/api/career-orientation-page?locale=${locale}` // Fixed endpoint
        };

        return endpoints[pageName] || null;
    }

    /**
     * Update page content with localized data
     */
    updatePageContent(data, locale) {
        console.log('[LanguageManager] Updating page content for locale:', locale);
        console.log('[LanguageManager] Available data sections:', Object.keys(data.data || {}));

        // Handle pricing page structure (data.data.attributes.sections)
        let processedData = data.data;
        if (data.data && data.data.attributes && data.data.attributes.sections) {
            console.log('[LanguageManager] Processing pricing page structure');
            processedData = data.data.attributes.sections;
            console.log('[LanguageManager] Pricing sections:', Object.keys(processedData));

            // If sections are empty, apply local translations
            if (Object.keys(processedData).length === 0) {
                console.log('[LanguageManager] No API sections found, applying local translations');
                this.applyLocalTranslations(locale);
                return;
            }
        }
        // Transform array-based API responses (like teachers page) to object format
        else
        if (Array.isArray(data.data)) {
            console.log('[LanguageManager] Converting array-based data to object format');
            processedData = {};
            data.data.forEach(section => {
                if (section.section_name && section.content) {
                    processedData[section.section_name] = { content: section.content };
                }
            });
            console.log('[LanguageManager] Transformed data sections:', Object.keys(processedData));
        }

        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.dataset.i18n;
            const value = this.getTranslation(processedData, key, locale);

            // Debug critical elements - expanded for pricing page
            if (key === 'testimonials.content.content.title' || key.includes('faq.content') ||
                key.includes('pricing.content.hero') || key.includes('pricing.content.subtitle') ||
                key.includes('pricing.content.title') || key.includes('pricing.content.plans')) {
                console.log(`[DOM Update Debug] ${key}:`, {
                    hasValue: !!value,
                    value: value,
                    elementTag: element.tagName,
                    elementClass: element.className,
                    currentText: element.textContent?.substring(0, 50),
                    apiDataKeys: Object.keys(processedData || {})
                });
            }

            if (value && value.trim()) {  // More robust value check
                this.translationStats.success++;

                try {
                    if (element.tagName === 'IMG') {
                        element.src = value;
                        element.alt = this.getTranslation(processedData, `${key}_alt`, locale) || '';
                    } else if (element.tagName === 'A') {
                        if (element.dataset.i18nHref) {
                            element.href = this.getTranslation(processedData, element.dataset.i18nHref, locale);
                        }
                        if (element.dataset.i18nText) {
                            element.textContent = this.getTranslation(processedData, element.dataset.i18nText, locale);
                        } else {
                            // Use textContent for better reliability
                            element.textContent = value;
                        }
                    } else {
                        // Use textContent for better reliability and to avoid HTML injection issues
                        element.textContent = value;

                        // Debug critical elements
                        if (key === 'testimonials.content.content.title') {
                            console.log(`[DOM Update Success] ${key}: "${element.textContent}"`);
                        }
                    }
                } catch (error) {
                    console.error(`[DOM Update Error] ${key}:`, error);
                    this.translationStats.failed++;
                }
            } else {
                this.translationStats.failed++;
                console.warn(`[Translation Missing] ${key} - value: "${value}"`);
            }
        });

        // Update dynamic content areas
        document.querySelectorAll('[data-dynamic-content]').forEach(container => {
            const contentType = container.dataset.dynamicContent;

            switch(contentType) {
                case 'courses':
                    this.renderCourses(container, data.courses || data);
                    break;
                case 'teachers':
                    this.renderTeachers(container, data.teachers || data);
                    break;
                case 'blog':
                    this.renderBlogPosts(container, data.posts || data);
                    break;
                case 'testimonials':
                    this.renderTestimonials(container, data.testimonials || data);
                    break;
            }
        });

        // Handle RTL for Hebrew
        if (locale === 'he') {
            document.documentElement.setAttribute('dir', 'rtl');
            document.body.classList.add('rtl');
        } else {
            document.documentElement.setAttribute('dir', 'ltr');
            document.body.classList.remove('rtl');
        }

        // Log final stats
        this.logTranslationStats();
    }

    /**
     * Get translation with comprehensive fallback system
     */
    getTranslation(data, key, locale) {
        // Debug pricing elements specifically
        if (key.includes('pricing.content.hero') || key.includes('pricing.content.subtitle') || key.includes('pricing.content.title')) {
            console.log(`[Pricing Debug] Getting translation for: ${key}`);
            console.log(`[Pricing Debug] Available data structure:`, JSON.stringify(data, null, 2));
        }

        // Try exact path first
        let value = this.getExactPath(data, key);
        if (value) {
            if (key.includes('pricing.content')) {
                console.log(`[Pricing Debug] Found exact path for ${key}: "${value}"`);
            }
            return value;
        }

        // Try mapped path
        const mappedPaths = this.getComprehensiveMappings(key);
        if (key.includes('pricing.content')) {
            console.log(`[Pricing Debug] Trying mapped paths for ${key}:`, mappedPaths);
        }

        for (const path of mappedPaths) {
            value = this.getExactPath(data, path);
            if (value) {
                this.translationStats.fallback++;
                console.log(`[Translation Fallback] ${key} -> ${path}: "${value}"`);
                return value;
            }
        }

        // Log missing translation for debugging
        console.warn(`[Translation Missing] ${key} - tried paths:`, [key, ...mappedPaths]);

        // Try local translations as last resort
        const localValue = this.getLocalizedText(key, locale);
        if (localValue) {
            console.log(`[Translation Local] ${key}: "${localValue}"`);
            return localValue;
        }

        return null;
    }

    /**
     * Get exact path without any mapping
     */
    getExactPath(obj, path) {
        return path.split('.').reduce((curr, prop) => {
            return curr?.[prop];
        }, obj);
    }

    /**
     * Comprehensive mapping system for all known mismatches
     */
    getComprehensiveMappings(path) {
        const mappings = [];

        // NAVIGATION MAPPINGS - Handle quadruple nesting from API
        const navMappings = {
            'navigation.content.items.0.text': ['navigation.content.content.content.home', 'navigation.content.content.home', 'navigation.content.home', 'navigation.home'],
            'navigation.content.items.1.text': ['navigation.content.content.content.courses', 'navigation.content.content.courses', 'navigation.content.courses', 'navigation.courses'],
            'navigation.content.items.2.text': ['navigation.content.content.content.teachers', 'navigation.content.content.teachers', 'navigation.content.teachers', 'navigation.teachers'],
            'navigation.content.items.3.text': ['navigation.content.content.content.blog', 'navigation.content.content.blog', 'navigation.content.blog', 'navigation.blog'],
            'navigation.content.items.4.text': ['navigation.content.content.content.about_us', 'navigation.content.content.about_us', 'navigation.content.about_us', 'navigation.about_us'],
            'navigation.content.items.6.text': ['navigation.content.content.content.pricing', 'navigation.content.content.pricing', 'navigation.content.pricing', 'navigation.pricing'],
            'navigation.content.career.orientation': ['navigation.content.content.content.career_orientation', 'navigation.content.content.career_orientation', 'navigation.content.career_orientation', 'navigation.career_orientation'],
            'navigation.content.career.center': ['navigation.content.content.content.career_center', 'navigation.content.content.career_center', 'navigation.content.career_center', 'navigation.career_center']
        };

        // UI ELEMENTS MAPPINGS - Handle quadruple nested content structure
        const uiMappings = {
            'ui.content.buttons.sign_up_today': ['ui_elements.content.content.content.buttons.sign_up_today', 'ui.content.content.content.buttons.sign_up_today', 'ui_elements.content.content.buttons.sign_up_today', 'ui_elements.content.buttons.sign_up_today', 'ui.buttons.sign_up_today', 'misc.content.sign_up_today'],
            'ui.content.buttons.course_details': ['ui_elements.content.content.content.buttons.course_details', 'ui.content.content.content.buttons.course_details', 'ui_elements.content.content.buttons.course_details', 'ui_elements.content.buttons.course_details', 'ui.buttons.course_details'],
            'ui.content.buttons.explore_courses': ['ui_elements.content.content.content.buttons.explore_courses', 'ui.content.content.content.buttons.explore_courses', 'ui_elements.content.content.buttons.browse_courses', 'ui_elements.content.buttons.browse_courses', 'ui_elements.content.content.buttons.check_out_courses', 'ui.buttons.explore_courses'],
            'ui.content.buttons.uncover_all_courses': ['ui_elements.content.content.content.buttons.uncover_all_courses', 'ui.content.content.content.buttons.uncover_all_courses', 'ui_elements.content.buttons.view_courses', 'ui.buttons.uncover_all_courses', 'misc.content.view_courses'],
            'ui.content.buttons.get_in_touch': ['ui_elements.content.content.content.buttons.get_in_touch', 'ui.content.content.content.buttons.get_in_touch', 'ui_elements.content.content.buttons.get_in_touch', 'ui_elements.content.buttons.get_in_touch', 'ui.buttons.get_in_touch', 'misc.content.contact_us'],
            // Direct button mappings for courses page CTA
            'buttons.get_in_touch': ['ui_elements.content.content.buttons.get_in_touch', 'ui_elements.content.buttons.get_in_touch', 'ui.content.buttons.get_in_touch'],
            'buttons.check_out_courses': ['ui_elements.content.content.buttons.check_out_courses', 'ui_elements.content.buttons.check_out_courses', 'ui.content.buttons.check_out_courses'],
            'buttons.course_details': ['ui_elements.content.content.buttons.course_details', 'ui_elements.content.buttons.course_details', 'ui.content.buttons.course_details'],
            'buttons.browse_courses': ['ui_elements.content.content.buttons.browse_courses', 'ui_elements.content.buttons.browse_courses', 'ui.content.buttons.browse_courses'],
            'buttons.start_learning': ['ui_elements.content.content.buttons.start_learning', 'ui_elements.content.buttons.start_learning', 'ui.content.buttons.start_learning'],
            'buttons.sign_up_today': ['ui_elements.content.content.buttons.sign_up_today', 'ui_elements.content.buttons.sign_up_today', 'ui.content.buttons.sign_up_today'],
            'ui.content.buttons.read_more': ['ui_elements.content.content.content.buttons.read_more', 'ui.content.content.content.buttons.read_more', 'ui_elements.content.content.buttons.read_more', 'ui_elements.content.buttons.read_more', 'misc.content.read_more'],
            'ui.content.messages.no_items': ['ui.content.content.content.messages.no_items', 'ui.messages.no_items', 'misc.content.no_items_found', 'cart.content.content.no_items_found'],
            'ui.content.messages.no_courses_found': ['ui_elements.content.content.messages.no_courses_found', 'ui.messages.no_courses_found', 'misc.content.no_courses_found', 'courses.content.messages.no_courses_found'],
            'ui.content.messages.loading': ['ui.content.content.content.messages.loading', 'ui.messages.loading', 'misc.content.loading'],
            'ui.content.messages.error': ['ui.content.content.content.messages.error', 'ui.messages.error', 'misc.content.error'],
            'ui.content.languages.en': ['ui.content.content.content.languages.en', 'ui.languages.en'],
            'ui.content.languages.ru': ['ui.content.content.content.languages.ru', 'ui.languages.ru'],
            'ui.content.languages.he': ['ui.content.content.content.languages.he', 'ui.languages.he']
        };

        // HERO SECTION MAPPINGS - Handle quadruple nesting
        const heroMappings = {
            'hero.content.title': ['hero.content.content.content.title', 'hero.content.content.title', 'hero.content.title'],
            'hero.content.subtitle': ['hero.content.content.content.subtitle', 'hero.content.content.subtitle', 'hero.content.subtitle', 'hero.content.expert_led'],
            'hero.content.description': ['hero.content.content.content.description', 'hero.content.content.description', 'hero.content.description'],
            'hero.content.button_primary': ['hero.content.content.content.cta_text_1', 'hero.content.content.cta_text_1', 'hero.content.cta_text_1', 'ui_elements.content.buttons.get_in_touch', 'hero.content.button_primary'],
            'hero.content.button_secondary': ['hero.content.content.content.cta_text_2', 'hero.content.content.cta_text_2', 'hero.content.cta_text_2', 'ui_elements.content.buttons.check_out_courses', 'hero.content.button_secondary']
        };

        // CART MAPPINGS
        const cartMappings = {
            'cart.content.quantity_display': ['cart.quantity_display', 'cart.content.content.quantity'],
            'cart.content.content.title': ['cart.content.content.title', 'cart.content.title', 'cart.title'],
            'cart.content.content.subtotal': ['cart.content.content.subtotal', 'cart.content.subtotal', 'cart.subtotal'],
            'cart.content.content.continue_to_checkout': ['cart.content.content.continue_to_checkout', 'cart.content.continue_to_checkout', 'cart.continue_to_checkout'],
            'cart.content.content.no_items_found': ['cart.content.content.no_items_found', 'cart.content.content.cart_is_empty', 'misc.content.content.no_items'],
            'cart.content.errors.quantity_not_available': ['cart.content.errors.quantity_not_available', 'cart.errors.quantity_not_available', 'cart.content.content.quantity_not_available']
        };

        // FEATURES/ABOUT MAPPINGS - Handle quadruple nesting
        const featuresMappings = {
            'features.content.subtitle': ['features.content.content.content.subtitle', 'features.content.content.subtitle', 'features.content.subtitle', 'about.content.subtitle', 'stats.content.mentor.title'],
            'features.content.title': ['features.content.content.content.title', 'features.content.content.title', 'features.content.title'],
            'features.content.description': ['features.content.content.content.description', 'features.content.content.description', 'features.content.description'],
            // Add features items mappings with quadruple nesting
            'features.content.items.0.title': ['features.content.content.content.items.0.title', 'features.content.content.items.0.title', 'features.content.items.0.title', 'features.items.0.title'],
            'features.content.items.0.description': ['features.content.content.content.items.0.description', 'features.content.content.items.0.description', 'features.content.items.0.description', 'features.items.0.description'],
            'features.content.items.1.title': ['features.content.content.content.items.1.title', 'features.content.content.items.1.title', 'features.content.items.1.title', 'features.items.1.title'],
            'features.content.items.1.description': ['features.content.content.content.items.1.description', 'features.content.content.items.1.description', 'features.content.items.1.description', 'features.items.1.description'],
            'features.content.items.2.title': ['features.content.content.content.items.2.title', 'features.content.content.items.2.title', 'features.content.items.2.title', 'features.items.2.title'],
            'features.content.items.2.description': ['features.content.content.content.items.2.description', 'features.content.content.items.2.description', 'features.content.items.2.description', 'features.items.2.description']
        };

        // COURSE CATEGORIES MAPPINGS
        const courseCategoriesMappings = {
            'course_categories.content.subtitle': ['course_categories.content.subtitle', 'course_categories.content.content.subtitle'],
            'course_categories.content.title': ['course_categories.content.title', 'course_categories.content.content.title'],
            'course_categories.content.description': ['course_categories.content.description', 'course_categories.content.content.description'],
            'course_categories.content.items.0.name': ['course_categories.content.items.0.name', 'course_categories.content.content.items.0.name'],
            'course_categories.content.items.0.description': ['course_categories.content.items.0.description', 'course_categories.content.content.items.0.description'],
            'course_categories.content.items.3.name': ['course_categories.content.items.3.name', 'course_categories.content.content.items.3.name'],
            'course_categories.content.items.3.description': ['course_categories.content.items.3.description', 'course_categories.content.content.items.3.description'],
            'course_categories.content.items.4.name': ['course_categories.content.items.4.name', 'course_categories.content.content.items.4.name'],
            'course_categories.content.items.4.description': ['course_categories.content.items.4.description', 'course_categories.content.content.items.4.description'],
            'course_categories.content.items.5.name': ['course_categories.content.items.5.name', 'course_categories.content.content.items.5.name'],
            'course_categories.content.items.5.description': ['course_categories.content.items.5.description', 'course_categories.content.content.items.5.description']
        };

        // COURSES SECTION MAPPINGS
        const coursesMappings = {
            'courses.content.subtitle': ['featured_courses.content.subtitle', 'courses.content.subtitle'],
            'courses.content.title': ['featured_courses.content.title', 'courses.content.title'],
            'courses.content.description': ['featured_courses.content.description', 'courses.content.description'],
            'courses.content.filters.all': ['courses.content.content.filters.all', 'ui.content.labels.filter_all'],
            'courses.content.filters.web_development': ['courses.content.content.filters.web_development', 'ui.content.labels.filter_web_development'],
            'courses.content.filters.cloud_computing': ['courses.content.content.filters.cloud_computing', 'ui.content.labels.filter_cloud_computing']
        };

        // STATS MAPPINGS
        const statsMappings = {
            'stats.content.stats.0.label': ['stats.content.stats.0.label', 'stats.content.content.stats.0.label'],
            'stats.content.stats.1.label': ['stats.content.stats.1.label', 'stats.content.content.stats.1.label'],
            'stats.content.stats.2.label': ['stats.content.stats.2.label', 'stats.content.content.stats.2.label'],
            'stats.content.mentor.title': ['stats.content.mentor.title', 'stats.content.content.mentor.title'],
            'stats.content.mentor.name': ['stats.content.mentor.name', 'stats.content.content.mentor.name'],
            'stats.content.mentor.bio': ['stats.content.mentor.bio', 'stats.content.content.mentor.bio'],
            'stats.content.mentor.description': ['stats.content.mentor.description', 'stats.content.content.mentor.description']
        };

        // PRICING MAPPINGS - Extended for all pricing page elements
        const pricingMappings = {
            // Hero section
            'pricing.content.hero.title': ['hero.title', 'pricing.hero.title', 'pricing.content.content.hero.title'],
            'pricing.content.hero.subtitle': ['hero.subtitle', 'pricing.hero.subtitle', 'pricing.content.content.hero.subtitle'],
            'pricing.content.hero.description': ['hero.description', 'pricing.hero.description', 'pricing.content.content.hero.description'],

            // Plans section
            'pricing.content.plans.title': ['plans.title', 'pricing.plans.title', 'pricing.content.content.plans.title'],
            'pricing.content.plans.subtitle': ['plans.subtitle', 'pricing.plans.subtitle', 'pricing.content.content.plans.subtitle'],
            'pricing.content.plans.description': ['plans.description', 'pricing.plans.description', 'pricing.content.content.plans.description'],

            // Hero section additional mappings
            'pricing.content.subtitle': ['hero.subtitle', 'pricing.hero.subtitle', 'pricing.content.content.hero.subtitle'],
            'pricing.content.title': ['hero.description', 'pricing.hero.description', 'pricing.content.content.hero.description'],

            // CTA section mappings for pricing page
            'pricing.content.cta.title': ['cta.title', 'pricing.cta.title', 'pricing.content.content.cta.title'],
            'pricing.content.cta.subtitle': ['cta.subtitle', 'pricing.cta.subtitle', 'pricing.content.content.cta.subtitle'],
            'pricing.content.cta.description': ['cta.description', 'pricing.cta.description', 'pricing.content.content.cta.description'],
            'pricing.content.cta.button1': ['cta.button1', 'cta.button_text', 'pricing.cta.button_text', 'pricing.content.content.cta.button_text'],
            'pricing.content.cta.button2': ['cta.button2', 'cta.button_secondary_text', 'pricing.cta.button_secondary_text', 'pricing.content.content.cta.button_secondary_text'],

            // Track section
            'pricing.content.track.start_learning': ['misc.content.start_learning', 'pricing.track.start_learning'],
            'pricing.content.track.browse_courses': ['misc.content.browse_courses', 'pricing.track.browse_courses'],

            // Fixed API path mappings to match actual response structure (plans.plans.*)
            'pricing.content.plans.annual.period': ['plans.plans.annual.period', 'plans.content.plans.annual.period'],
            'pricing.content.plans.monthly.period': ['plans.plans.monthly.period', 'plans.content.plans.monthly.period'],
            'pricing.content.plans.annual.price': ['plans.plans.annual.price', 'pricing.content.plans.1.price', 'pricing.content.plans[1].price'],
            'pricing.content.plans.monthly.price': ['plans.plans.monthly.price', 'pricing.content.plans.0.price', 'pricing.content.plans[0].price'],
            'pricing.content.plans.annual.name': ['plans.plans.annual.name', 'pricing.content.plans.1.name', 'pricing.content.plans[1].name'],
            'pricing.content.plans.monthly.name': ['plans.plans.monthly.name', 'pricing.content.plans.0.name', 'pricing.content.plans[0].name']
        };

        // FAQ MAPPINGS - Handle quadruple nesting from API response
        const faqMappings = {
            'faq.content.content.items.0.question': ['faq.content.items.0.question', 'faq.content.content.items.0.question'],
            'faq.content.content.items.0.answer': ['faq.content.items.0.answer', 'faq.content.content.items.0.answer'],
            'faq.content.content.items.1.question': ['faq.content.items.1.question', 'faq.content.content.items.1.question'],
            'faq.content.content.items.1.answer': ['faq.content.items.1.answer', 'faq.content.content.items.1.answer'],
            'faq.content.content.items.2.question': ['faq.content.items.2.question', 'faq.content.content.items.2.question'],
            'faq.content.content.items.2.answer': ['faq.content.items.2.answer', 'faq.content.content.items.2.answer'],
            'faq.content.content.items.3.question': ['faq.content.items.3.question', 'faq.content.content.items.3.question'],
            'faq.content.content.items.3.answer': ['faq.content.items.3.answer', 'faq.content.content.items.3.answer'],
            'faq.content.content.items.4.question': ['faq.content.items.4.question', 'faq.content.content.items.4.question'],
            'faq.content.content.items.4.answer': ['faq.content.items.4.answer', 'faq.content.content.items.4.answer'],
            'faq.content.content.title': ['faq.content.title', 'faq.content.content.title'],
            'faq.content.content.subtitle': ['faq.content.subtitle', 'faq.content.content.subtitle']
        };

        // PROCESS/STEPS MAPPINGS - Handle quadruple nesting
        const processMappings = {
            'process.content.steps.0.number': ['process.content.content.content.steps.0.number', 'process.content.content.steps.0.number', 'process.content.steps.0.number'],
            'process.content.steps.0.title': ['process.content.content.content.steps.0.title', 'process.content.content.steps.0.title', 'process.content.steps.0.title'],
            'process.content.steps.0.details': ['process.content.content.content.steps.0.details', 'process.content.content.steps.0.details', 'process.content.steps.0.details'],
            'process.content.steps.1.number': ['process.content.content.content.steps.1.number', 'process.content.content.steps.1.number', 'process.content.steps.1.number'],
            'process.content.steps.1.title': ['process.content.content.content.steps.1.title', 'process.content.content.steps.1.title', 'process.content.steps.1.title'],
            'process.content.steps.1.description': ['process.content.content.content.steps.1.description', 'process.content.content.steps.1.description', 'process.content.steps.1.description'],
            'process.content.steps.2.number': ['process.content.content.content.steps.2.number', 'process.content.content.steps.2.number', 'process.content.steps.2.number'],
            'process.content.steps.2.title': ['process.content.content.content.steps.2.title', 'process.content.content.steps.2.title', 'process.content.steps.2.title'],
            'process.content.steps.2.description': ['process.content.content.content.steps.2.description', 'process.content.content.steps.2.description', 'process.content.steps.2.description']
        };

        // AWARDS MAPPINGS
        const awardsMappings = {
            'awards.content.content.items.0.title': ['awards.content.content.items.0.title', 'awards.content.items.0.title'],
            'awards.content.content.items.0.description': ['awards.content.content.items.0.description', 'awards.content.items.0.description'],
            'awards.content.content.items.1.title': ['awards.content.content.items.1.title', 'awards.content.items.1.title'],
            'awards.content.content.items.1.description': ['awards.content.content.items.1.description', 'awards.content.items.1.description'],
            'awards.content.content.items.2.title': ['awards.content.content.items.2.title', 'awards.content.items.2.title'],
            'awards.content.content.items.2.description': ['awards.content.content.items.2.description', 'awards.content.items.2.description'],
            'awards.content.content.items.3.title': ['awards.content.content.items.3.title', 'awards.content.items.3.title'],
            'awards.content.content.items.3.description': ['awards.content.content.items.3.description', 'awards.content.items.3.description']
        };

        // TESTIMONIALS MAPPINGS
        const testimonialsMappings = {
            'testimonials.content.title': ['testimonials.content.title', 'testimonials.title'],
            'testimonials.content.description': ['testimonials.content.description', 'testimonials.description'],
            'testimonials.content.content.title': ['testimonials.content.title', 'testimonials.title', 'testimonials_meta.content.content.title', 'testimonials_meta.content.title'],
            'testimonials.content.content.description': ['testimonials.content.description', 'testimonials.description', 'testimonials_meta.content.content.description', 'testimonials_meta.content.description'],
            'testimonials.content.content.subtitle': ['testimonials.content.subtitle', 'testimonials.subtitle'],
            'testimonials_data.content.items.0.title': ['testimonials_data.content.items.0.title', 'testimonials_data.items.0.title'],
            'testimonials_data.content.items.0.text': ['testimonials_data.content.items.0.text', 'testimonials_data.items.0.text'],
            'testimonials_data.content.items.0.author': ['testimonials_data.content.items.0.author', 'testimonials_data.items.0.author'],
            'testimonials_data.content.content.4.text': ['testimonials_data.content.content.content.4.text', 'testimonials_data.content.content.4.text', 'testimonials_data.content.4.text'],
            'testimonials_data.content.content.5.text': ['testimonials_data.content.content.content.5.text', 'testimonials_data.content.content.5.text', 'testimonials_data.content.5.text'],
            'testimonials_data.content.content.6.text': ['testimonials_data.content.content.content.6.text', 'testimonials_data.content.content.6.text', 'testimonials_data.content.6.text'],
            'testimonials_data.content.4.text': ['testimonials_data.content.4.text', 'testimonials_data.content.content.4.text'],
            'testimonials_data.content.5.text': ['testimonials_data.content.5.text', 'testimonials_data.content.content.5.text'],
            'testimonials_data.content.6.text': ['testimonials_data.content.6.text', 'testimonials_data.content.content.6.text']
        };

        // CONTACT MAPPINGS
        const contactMappings = {
            'contact.content.title': ['contact.content.title', 'contact.content.content.title'],
            'contact.content.description': ['contact.content.description', 'contact.content.content.description'],
            'contact.content.success_message': ['contact.content.success_message', 'contact.content.content.success_message'],
            'contact.content.error_message': ['contact.content.error_message', 'contact.content.content.error_message']
        };

        // FOOTER MENU ITEMS MAPPINGS - Handle triple nested content structure
        const footerMappings = {
            'footer.content.menus.0.items.3.text': ['footer.content.menus.0.items.3.text', 'footer.content.content.content.links.course_single'],
            'footer.content.menus.0.items.5.text': ['footer.content.menus.0.items.5.text', 'footer.content.content.content.links.pricing_single'],
            'footer.content.menus.0.items.7.text': ['footer.content.menus.0.items.7.text', 'footer.content.content.content.links.blog_single'],
            'footer.content.menus.2.items.0.text': ['footer.content.menus.2.items.0.text', 'footer.content.content.content.links.404_not_found'],
            'footer.content.menus.2.items.1.text': ['footer.content.menus.2.items.1.text', 'footer.content.content.content.links.password_protected'],
            'footer.content.menus.2.items.2.text': ['footer.content.menus.2.items.2.text', 'footer.content.content.content.links.changelog'],
            'footer.content.menus.2.items.3.text': ['footer.content.menus.2.items.3.text', 'footer.content.content.content.links.license'],
            'footer.content.menus.2.items.4.text': ['footer.content.menus.2.items.4.text', 'footer.content.content.content.links.style_guide'],
            'footer.content.menus.3.items.0.text': ['footer.content.menus.3.items.0.text', 'footer.content.content.content.links.sign_up'],
            'footer.content.menus.3.items.1.text': ['footer.content.menus.3.items.1.text', 'footer.content.content.content.links.sign_in'],
            'footer.content.menus.3.items.2.text': ['footer.content.menus.3.items.2.text', 'footer.content.content.content.links.forgot_password'],
            'footer.content.menus.3.items.3.text': ['footer.content.menus.3.items.3.text', 'footer.content.content.content.links.reset_password'],
            // Add newsletter and copyright mappings
            'footer.content.copyright': ['footer.content.copyright', 'footer.copyright', 'footer.content.content.copyright'],
            'footer.content.newsletter.label': ['footer.content.newsletter.label', 'footer.newsletter.label'],
            'footer.content.newsletter.placeholder': ['footer.content.newsletter.placeholder', 'footer.newsletter.placeholder'],
            'footer.content.newsletter.button': ['footer.content.newsletter.button', 'footer.newsletter.button'],
            'footer.content.newsletter.success': ['footer.content.newsletter.success', 'footer.newsletter.success'],
            'footer.content.newsletter.error': ['footer.content.newsletter.error', 'footer.newsletter.error'],
            // Add contact information mappings
            'footer.content.phone': ['footer.content.content.content.phone', 'footer.content.content.phone'],
            'footer.content.contact_email': ['footer.content.content.content.contact_email', 'footer.content.content.email'],
            'footer.content.contact_prefix': ['footer.content.content.content.contact_prefix', 'footer.content.content.contact_prefix'],
            'footer.content.address': ['footer.content.content.content.address', 'footer.content.content.address'],
            'footer.content.description': ['footer.content.content.description', 'footer.content.description']
        };

        // MISC/MISCELLANEOUS MAPPINGS - Handle triple nested content structure
        const miscMappings = {
            'misc.content.explore_plans': ['misc.content.content.content.explore_plans', 'misc.content.content.explore_plans'],
            'misc.content.read_more': ['misc.content.content.content.read_more', 'misc.content.content.read_more'],
            'misc.content.learn_more': ['misc.content.content.content.learn_more', 'misc.content.content.learn_more'],
            'misc.content.get_started': ['misc.content.content.content.get_started', 'misc.content.content.get_started'],
            'misc.content.contact_us': ['misc.content.content.content.contact_us', 'misc.content.content.contact_us'],
            'misc.content.sign_up_today': ['misc.content.content.content.sign_up_today', 'misc.content.content.sign_up_today'],
            'misc.content.start_learning': ['misc.content.content.content.start_learning', 'misc.content.content.start_learning'],
            'misc.content.view_courses': ['misc.content.content.content.view_courses', 'misc.content.content.view_courses'],
            'misc.content.enroll_now': ['misc.content.content.content.enroll_now', 'misc.content.content.enroll_now']
        };

        // Check all mapping collections
        const allMappings = Object.assign({},
            navMappings,
            uiMappings,
            heroMappings,
            cartMappings,
            featuresMappings,
            courseCategoriesMappings,
            coursesMappings,
            statsMappings,
            pricingMappings,
            faqMappings,
            processMappings,
            awardsMappings,
            testimonialsMappings,
            contactMappings,
            footerMappings,
            miscMappings
        );

        if (allMappings[path]) {
            mappings.push(...allMappings[path]);
        }

        // Generic fallback patterns
        // Remove extra 'content' levels
        if (path.includes('.content.content.')) {
            mappings.push(path.replace('.content.content.', '.content.'));
        }

        // Add double content level
        if (path.includes('.content.') && !path.includes('.content.content.')) {
            mappings.push(path.replace('.content.', '.content.content.'));
        }

        // Try without 'content' at all
        if (path.includes('.content.')) {
            mappings.push(path.replace('.content.', '.'));
        }

        return mappings;
    }

    /**
     * Get localized text for common UI elements
     */
    getLocalizedText(key, locale) {
        const translations = {
            en: {
                learnMore: 'Learn More',
                readMore: 'Read More',
                loading: 'Loading...',
                error: 'Error loading content',
                'navigation.blog': 'Blog',
                // Navigation fallback translations
                'navigation.content.items.0.text': 'Home',
                'navigation.content.items.1.text': 'Courses',
                'navigation.content.items.2.text': 'Teachers',
                'navigation.content.items.3.text': 'Blog',
                'navigation.content.items.4.text': 'About Us',
                'navigation.content.items.6.text': 'Pricing',
                'navigation.content.career.orientation': 'Career Orientation',
                'navigation.content.career.center': 'Career Center',
                // UI buttons
                'ui.content.buttons.sign_up_today': 'Sign Up Today',
                'ui.content.breadcrumb.home': 'Home',
                // Pricing page
                'pricing.content.plans.title': 'Invest in Future with Subscription Plans',
                'pricing.content.plans.description': 'Dive into a world of learning with diverse and extensive range of tech courses designed to cater to every interest.',
                'pricing.content.tabs.monthly': 'Monthly',
                'pricing.content.tabs.yearly': 'Yearly',
                // Contact page translations
                'contact.content.title': 'Contact Us',
                'contact.content.subtitle': 'Let\'s Talk',
                'contact.content.heading': 'Contact Me For Inquiries',
                'contact.content.description': 'If you have questions about my courses, need guidance on your learning path, or want to discuss collaboration opportunities, feel free to reach out.',
                'contact.content.page_title': 'Contact Us - AI Studio E-Learning Platform',
                'contact.content.details.email': 'info@aistudio555.com',
                'contact.content.details.phone': '+972 50 123 4567',
                'contact.content.details.linkedin': 'www.linkedin.com/aistudio555',
                'contact.content.details.facebook': 'www.facebook.com/aistudio555',
                'contact.content.form.name_label': 'Your Name *',
                'contact.content.form.name_placeholder': 'Enter Your Name',
                'contact.content.form.email_label': 'Email Address *',
                'contact.content.form.email_placeholder': 'Ex. emailaddress@email.com',
                'contact.content.form.subject_label': 'Subject *',
                'contact.content.form.subject_placeholder': 'Ex. Want Consultation',
                'contact.content.form.message_label': 'Your Message *',
                'contact.content.form.message_placeholder': 'Write what you want to share with us.',
                'contact.content.form.submit_button': 'Submit Now',
                'contact.content.form.success_message': 'Thank you! Your submission has been received!',
                'contact.content.form.error_message': 'Oops! Something went wrong while submitting the form.',
                // Track and CTA sections
                'track.content.start_learning': 'Start Learning',
                'track.content.browse_courses': 'Browse Courses',
                'cta.content.subtitle': 'Start Learning Today',
                'cta.content.title': 'Discover A World Of Learning Opportunities',
                'cta.content.description': 'Don\'t wait to transform your career and unlock your full potential. Join our community of passionate learners and gain access to a wide range of courses.',
                'cta.content.button_contact': 'Get In Touch',
                'cta.content.button_courses': 'Check Out Courses',
                // UI Language labels
                'ui.content.languages.en': 'EN',
                'ui.content.languages.ru': 'RU',
                'ui.content.languages.he': 'HE',
                // Button translations
                'misc.content.explore_plans': 'Explore Plans Features',
                'testimonials.author1.name': 'David Kim',
                'testimonials.author2.name': 'Tariq Ahmed',
                'testimonials.author3.name': 'Nadia Khan',
                'footer.company.zohacous': 'Zohacous',
                'testimonials.content.content.subtitle': 'Testimonials',
                'testimonials.content.content.title': 'What Our Students Say',
                // Awards section translations
                'awards.content.content.title': 'Awards That Define Our Excellence.',
                'awards.content.content.description': 'Dive into a world of learning with diverse & extensive range of tech courses designed to cater to every interest.',
                'awards.content.content.items.0.title': 'Online Mentorship Award',
                'awards.content.content.items.0.description': 'We are honored to be recognized with the prestigious online mentorship award, a testament to our unwavering commitment to delivering high-quality.',
                'awards.content.content.items.1.title': 'Class Mentorship Program',
                'awards.content.content.items.1.description': 'The Class Mentorship Program is designed to provide students with personalized guidance, academic support, and career development to enhance their learning.',
                'awards.content.content.items.2.title': 'Excellent Remote Learning',
                'awards.content.content.items.2.description': 'In today\'s digital age, remote learning has become an essential component of the educational experience. Whether for K-12, higher education.',
                'awards.content.content.items.3.title': 'Leader Technology Training',
                'awards.content.content.items.3.description': 'Leader Technology Training is designed to empower professionals with the skills and knowledge required to become proficient leaders.',

                // Pricing plans translations
                'pricing.content.plans.monthly.name': 'Monthly',
                'pricing.content.plans.annual.name': 'Yearly',
                'pricing.content.plans.monthly.period': 'Per Month',
                'pricing.content.plans.annual.period': 'Per Year',

                // Process help section
                'process.content.help.question': 'Still don\'t find out what you are looking for ??',
                'process.content.help.link': 'Drop a line here what are you looking for.'
            },
            ru: {
                learnMore: 'Узнать больше',
                readMore: 'Читать далее',
                loading: 'Загрузка...',
                error: 'Ошибка загрузки контента',
                'navigation.blog': 'Блог',
                // Navigation fallback translations
                'navigation.content.items.0.text': 'Главная',
                'navigation.content.items.1.text': 'Курсы',
                'navigation.content.items.2.text': 'Преподаватели',
                'navigation.content.items.3.text': 'Блог',
                'navigation.content.items.4.text': 'О нас',
                'navigation.content.items.6.text': 'Цены',
                'navigation.content.career.orientation': 'Профориентация',
                'navigation.content.career.center': 'Карьерный центр',
                // UI buttons
                'ui.content.buttons.sign_up_today': 'Зарегистрироваться',
                'ui.content.breadcrumb.home': 'Главная',
                // Pricing page
                'pricing.content.plans.title': 'Инвестируйте в будущее с планами подписки',
                'pricing.content.plans.description': 'Погрузитесь в мир обучения с разнообразными и обширными техническими курсами, созданными для удовлетворения любых интересов.',
                'pricing.content.tabs.monthly': 'Ежемесячно',
                'pricing.content.tabs.yearly': 'Ежегодно',
                // Contact page translations
                'contact.content.title': 'Свяжитесь с нами',
                'contact.content.subtitle': 'Давайте поговорим',
                'contact.content.heading': 'Свяжитесь со мной по вопросам',
                'contact.content.description': 'Если у вас есть вопросы о моих курсах, нужна помощь в выборе пути обучения или вы хотите обсудить возможности сотрудничества, не стесняйтесь обращаться.',
                'contact.content.page_title': 'Свяжитесь с нами - Платформа онлайн-обучения AI Studio',
                'contact.content.details.email': 'info@aistudio555.com',
                'contact.content.details.phone': '+972 50 123 4567',
                'contact.content.details.linkedin': 'www.linkedin.com/aistudio555',
                'contact.content.details.facebook': 'www.facebook.com/aistudio555',
                'contact.content.form.name_label': 'Ваше имя *',
                'contact.content.form.name_placeholder': 'Введите ваше имя',
                'contact.content.form.email_label': 'Адрес электронной почты *',
                'contact.content.form.email_placeholder': 'Например: email@example.com',
                'contact.content.form.subject_label': 'Тема *',
                'contact.content.form.subject_placeholder': 'Например: Нужна консультация',
                'contact.content.form.message_label': 'Ваше сообщение *',
                'contact.content.form.message_placeholder': 'Напишите, что вы хотите нам сообщить.',
                'contact.content.form.submit_button': 'Отправить',
                'contact.content.form.success_message': 'Спасибо! Ваша заявка получена!',
                'contact.content.form.error_message': 'Упс! Что-то пошло не так при отправке формы.',
                // Track and CTA sections
                'track.content.start_learning': 'Начать обучение',
                'track.content.browse_courses': 'Просмотреть курсы',
                'cta.content.subtitle': 'Начните учиться сегодня',
                'cta.content.title': 'Откройте мир возможностей обучения',
                'cta.content.description': 'Не ждите, чтобы трансформировать свою карьеру и раскрыть свой полный потенциал. Присоединяйтесь к нашему сообществу увлеченных учеников и получите доступ к широкому спектру курсов.',
                'cta.content.button_contact': 'Связаться',
                'cta.content.button_courses': 'Посмотреть курсы',
                // UI Language labels
                'ui.content.languages.en': 'EN',
                'ui.content.languages.ru': 'RU',
                'ui.content.languages.he': 'HE',
                // Button translations
                'misc.content.explore_plans': 'Исследуйте функции планов',
                'testimonials.author1.name': 'Давид Ким',
                'testimonials.author2.name': 'Тарик Ахмед',
                'testimonials.author3.name': 'Надия Хан',
                'footer.company.zohacous': 'Зохакус',
                'testimonials.content.content.subtitle': 'Отзывы',
                'testimonials.content.content.title': 'Ваш путь обучения с нашими экспертами',
                // Awards section translations
                'awards.content.content.title': 'Награды, определяющие наше совершенство.',
                'awards.content.content.description': 'Погрузитесь в мир обучения с разнообразным и обширным ассортиментом технических курсов, предназначенных для каждого интереса.',
                'awards.content.content.items.0.title': 'Награда за онлайн-наставничество',
                'awards.content.content.items.0.description': 'Признание за excellence в онлайн-наставничестве и поддержке студентов',
                'awards.content.content.items.1.title': 'Программа наставничества в классе',
                'awards.content.content.items.1.description': 'Лучшая программа наставничества для технических специалистов',
                'awards.content.content.items.2.title': 'Совершенство дистанционного обучения',
                'awards.content.content.items.2.description': 'Ведущие методологии дистанционного обучения',
                'awards.content.content.items.3.title': 'Лидер технического обучения',
                'awards.content.content.items.3.description': 'Награждённые программы технического обучения',

                // Pricing plans translations
                'pricing.content.plans.monthly.name': 'Ежемесячно',
                'pricing.content.plans.annual.name': 'Годовой',
                'pricing.content.plans.monthly.period': 'В месяц',
                'pricing.content.plans.annual.period': 'В год',

                // Process help section
                'process.content.help.question': 'Все еще не можете найти то, что ищете ??',
                'process.content.help.link': 'Сообщите нам, что вы ищете.'
            },
            he: {
                learnMore: 'למד עוד',
                readMore: 'קרא עוד',
                loading: 'טוען...',
                error: 'שגיאה בטעינת תוכן',
                'navigation.blog': 'בלוג',
                // Navigation fallback translations
                'navigation.content.items.0.text': 'בית',
                'navigation.content.items.1.text': 'קורסים',
                'navigation.content.items.2.text': 'מרצים',
                'navigation.content.items.3.text': 'בלוג',
                'navigation.content.items.4.text': 'אודותינו',
                'navigation.content.items.6.text': 'מחירים',
                'navigation.content.career.orientation': 'הכוונה מקצועית',
                'navigation.content.career.center': 'מרכז הקריירה',
                // UI buttons
                'ui.content.buttons.sign_up_today': 'הירשם היום',
                'ui.content.breadcrumb.home': 'בית',
                // Pricing page
                'pricing.content.plans.title': 'השקיעו בעתיד עם תוכניות מנוי',
                'pricing.content.plans.description': 'צללו לעולם של למידה עם מגוון רחב ומקיף של קורסים טכנולוגיים שנועדו לענות על כל תחום עניין.',
                'pricing.content.tabs.monthly': 'חודשי',
                'pricing.content.tabs.yearly': 'שנתי',
                // Contact page translations
                'contact.content.title': 'צור קשר',
                'contact.content.subtitle': 'בואו נדבר',
                'contact.content.heading': 'צור איתי קשר לבירורים',
                'contact.content.description': 'אם יש לך שאלות על הקורסים שלי, צריך הכוונה במסלול הלמידה שלך או רוצה לדון בהזדמנויות לשיתוף פעולה, אל תהסס לפנות.',
                'contact.content.page_title': 'צור קשר - פלטפורמת למידה מקוונת AI Studio',
                'contact.content.details.email': 'info@aistudio555.com',
                'contact.content.details.phone': '+972 50 123 4567',
                'contact.content.details.linkedin': 'www.linkedin.com/aistudio555',
                'contact.content.details.facebook': 'www.facebook.com/aistudio555',
                'contact.content.form.name_label': 'השם שלך *',
                'contact.content.form.name_placeholder': 'הכנס את שמך',
                'contact.content.form.email_label': 'כתובת דוא״ל *',
                'contact.content.form.email_placeholder': 'לדוגמה: email@example.com',
                'contact.content.form.subject_label': 'נושא *',
                'contact.content.form.subject_placeholder': 'לדוגמה: רוצה ייעוץ',
                'contact.content.form.message_label': 'ההודעה שלך *',
                'contact.content.form.message_placeholder': 'כתוב מה אתה רוצה לשתף איתנו.',
                'contact.content.form.submit_button': 'שלח כעת',
                'contact.content.form.success_message': 'תודה! הטופס נשלח בהצלחה!',
                'contact.content.form.error_message': 'אופס! משהו השתבש בשליחת הטופס.',
                // Track and CTA sections
                'track.content.start_learning': 'התחל ללמוד',
                'track.content.browse_courses': 'עיין בקורסים',
                'cta.content.subtitle': 'התחל ללמוד היום',
                'cta.content.title': 'גלה עולם של הזדמנויות למידה',
                'cta.content.description': 'אל תחכה לשנות את הקריירה שלך ולפתוח את הפוטנציאל המלא שלך. הצטרף לקהילת הלומדים הנלהבת שלנו וקבל גישה למגוון רחב של קורסים.',
                'cta.content.button_contact': 'צור קשר',
                'cta.content.button_courses': 'בדוק קורסים',
                // UI Language labels
                'ui.content.languages.en': 'EN',
                'ui.content.languages.ru': 'RU',
                'ui.content.languages.he': 'HE',

                // Footer translations
                'ui.content.footer.subscribe_newsletter': 'הירשם לניוזלטר',
                'ui.content.footer.email_placeholder': 'הכנס אימייל להרשמה',
                'ui.content.footer.subscribe_button': 'הירשם',
                // Button translations
                'misc.content.explore_plans': 'גלה תכונות התוכניות',
                'testimonials.author1.name': 'דיוויד קים',
                'testimonials.author2.name': 'טאריק אחמד',
                'testimonials.author3.name': 'נדיה חאן',
                'footer.company.zohacous': 'זוהקוס',
                'testimonials.content.content.subtitle': 'המלצות',
                'testimonials.content.content.title': 'מסע הלמידה שלך עם המומחים שלנו',
                // Awards section translations
                'awards.content.content.title': 'פרסים המגדירים את המצוינות שלנו.',
                'awards.content.content.description': 'צלול לתוך עולם של למידה עם מגוון נרחב של קורסי טכנולוגיה המיועדים לענות על כל עניין.',
                'awards.content.content.items.0.title': 'פרס חונכות מקוונת',
                'awards.content.content.items.0.description': 'הוכרה למצוינות בחונכות מקוונת ותמיכת סטודנטים',
                'awards.content.content.items.1.title': 'תוכנית חונכות כיתתית',
                'awards.content.content.items.1.description': 'תוכנית החונכות הטובה ביותר לאנשי מקצוע בתחום הטכנולוגיה',
                'awards.content.content.items.2.title': 'מצוינות בלמידה מרחוק',
                'awards.content.content.items.2.description': 'מובילים את הדרך במתודולוגיות למידה מרחוק',
                'awards.content.content.items.3.title': 'מנהיג הכשרה טכנולוגית',
                'awards.content.content.items.3.description': 'תוכניות הכשרה טכנולוגיות עטורות פרסים',

                // Pricing plans translations
                'pricing.content.plans.monthly.name': 'חודשי',
                'pricing.content.plans.annual.name': 'שנתי',
                'pricing.content.plans.monthly.period': 'לחודש',
                'pricing.content.plans.annual.period': 'לשנה',

                // Process help section
                'process.content.help.question': 'עדיין לא מוצא את מה שאתה מחפש ??',
                'process.content.help.link': 'שלח לנו קו כאן מה אתה מחפש.'
            }
        };

        return translations[locale]?.[key] || translations.en[key];
    }

    /**
     * Log translation statistics
     */
    logTranslationStats() {
        const total = this.translationStats.success + this.translationStats.failed;
        const successRate = total > 0 ? ((this.translationStats.success / total) * 100).toFixed(1) : 0;

        console.log('[Translation Stats]', {
            success: this.translationStats.success,
            failed: this.translationStats.failed,
            fallback: this.translationStats.fallback,
            successRate: `${successRate}%`
        });

        // Warn if success rate is low
        if (successRate < 80 && total > 10) {
            console.warn('[Translation Warning] Low success rate detected. Check API structure and mappings.');
        }
    }

    /**
     * Render courses dynamically
     */
    renderCourses(container, courses) {
        if (!Array.isArray(courses)) return;

        const html = courses.map(course => `
            <div class="course-card" data-course-id="${course.id}">
                <div class="course-image">
                    <img src="${course.image_url || '/images/course-placeholder.jpg'}"
                         alt="${course.title}">
                </div>
                <div class="course-content">
                    <h3 class="course-title">${course.title}</h3>
                    <p class="course-description">${course.short_description}</p>
                    <div class="course-meta">
                        <span class="course-duration">${course.duration}</span>
                        <span class="course-level">${course.level}</span>
                    </div>
                    <a href="${course.link || '#'}" class="course-link">
                        ${this.getLocalizedText('learnMore', this.currentLocale)}
                    </a>
                </div>
            </div>
        `).join('');

        container.innerHTML = html;
    }

    /**
     * Render teachers dynamically
     */
    renderTeachers(container, teachers) {
        if (!Array.isArray(teachers)) return;

        const html = teachers.map(teacher => `
            <div class="teacher-card">
                <img src="${teacher.photo_url || '/images/teacher-placeholder.jpg'}"
                     alt="${teacher.name}">
                <h3>${teacher.name}</h3>
                <p class="teacher-title">${teacher.title}</p>
                <p class="teacher-bio">${teacher.bio}</p>
            </div>
        `).join('');

        container.innerHTML = html;
    }

    /**
     * Render blog posts dynamically
     */
    renderBlogPosts(container, posts) {
        if (!Array.isArray(posts)) return;

        const html = posts.map(post => `
            <article class="blog-post">
                <div class="post-image">
                    <img src="${post.featured_image || '/images/blog-placeholder.jpg'}"
                         alt="${post.title}">
                </div>
                <div class="post-content">
                    <h3>${post.title}</h3>
                    <p class="post-excerpt">${post.excerpt}</p>
                    <div class="post-meta">
                        <span class="post-date">${this.formatDate(post.published_at)}</span>
                        <span class="post-author">${post.author}</span>
                    </div>
                    <a href="${post.link || '#'}" class="read-more">
                        ${this.getLocalizedText('readMore', this.currentLocale)}
                    </a>
                </div>
            </article>
        `).join('');

        container.innerHTML = html;
    }

    /**
     * Render testimonials dynamically
     */
    renderTestimonials(container, testimonials) {
        if (!Array.isArray(testimonials)) return;

        const html = testimonials.map(testimonial => `
            <div class="testimonial">
                <blockquote>${testimonial.text}</blockquote>
                <cite>
                    <strong>${testimonial.author}</strong>
                    <span>${testimonial.role}</span>
                </cite>
            </div>
        `).join('');

        container.innerHTML = html;
    }

    /**
     * Format date based on locale
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(this.currentLocale, options);
    }

    /**
     * Show loading state
     */
    showLoadingState() {
        this.isLoading = true;

        // Create or show loading overlay
        let overlay = document.getElementById('language-loading-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'language-loading-overlay';
            overlay.className = 'language-loading-overlay';
            overlay.innerHTML = `
                <div class="loading-spinner">
                    <div class="spinner"></div>
                    <p>${this.getLocalizedText('loading', this.currentLocale)}</p>
                </div>
            `;
            document.body.appendChild(overlay);
        }

        overlay.classList.add('visible');
    }

    /**
     * Hide loading state
     */
    hideLoadingState() {
        this.isLoading = false;

        const overlay = document.getElementById('language-loading-overlay');
        if (overlay) {
            overlay.classList.remove('visible');
        }
    }

    /**
     * Show error message
     */
    showError(message) {
        console.error(message);

        // Create toast notification
        const toast = document.createElement('div');
        toast.className = 'language-error-toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    /**
     * Preload content for other languages
     */
    async preloadLanguages() {
        const otherLocales = this.supportedLocales.filter(l => l !== this.currentLocale);

        for (const locale of otherLocales) {
            // Load in background with delay
            setTimeout(() => {
                this.loadPageContent(locale).catch(err => {
                    console.log(`Failed to preload ${locale}:`, err);
                });
            }, 5000 + Math.random() * 5000); // Stagger between 5-10 seconds
        }
    }
}

// Initialize language manager
const languageManager = new LanguageManager();

// Export for use in other scripts
window.LanguageManager = LanguageManager;
window.languageManager = languageManager;

// Add CSS for loading overlay and toast
if (!document.getElementById('language-manager-styles')) {
    const styles = document.createElement('style');
    styles.id = 'language-manager-styles';
    styles.textContent = `
        .language-loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease, visibility 0.3s ease;
        }

        .language-loading-overlay.visible {
            opacity: 1;
            visibility: visible;
        }

        .loading-spinner {
            text-align: center;
            color: white;
        }

        .spinner {
            width: 50px;
            height: 50px;
            margin: 0 auto 20px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-top-color: #ffd700;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .language-error-toast {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #ff4444;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 100000;
            animation: slideInUp 0.3s ease;
        }

        @keyframes slideInUp {
            from {
                transform: translateY(100%);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        /* RTL support */
        [dir="rtl"] .language-error-toast {
            right: auto;
            left: 20px;
        }

        [dir="rtl"] .lang-pill,
        [dir="rtl"] .mobile-lang-pill {
            direction: ltr;
        }
    `;
    document.head.appendChild(styles);
}