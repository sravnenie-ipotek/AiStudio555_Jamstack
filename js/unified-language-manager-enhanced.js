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
            ? 'http://localhost:1337'
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

        // Load content for current language if needed
        if (this.shouldLoadContent()) {
            console.log('[LanguageManager] Loading content for locale:', this.currentLocale);
            this.loadPageContent(this.currentLocale);
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
        // Priority: URL > localStorage > browser > default
        const urlLocale = this.getLocaleFromURL();
        if (urlLocale) return urlLocale;

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
        return document.querySelector('[data-dynamic-content]') !== null;
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

            // Update UI state
            this.setInitialLanguageState();

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
            console.log('No dynamic content endpoint for this page');
            return;
        }

        try {
            const url = `${this.apiBaseUrl}${endpoint}`;
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

            // Try fallback to English if not already
            if (locale !== 'en') {
                console.log('Falling back to English content');
                await this.loadPageContent('en');
            }
        }
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
            'career-center': `/api/nd/career-center-platform-page?locale=${locale}`,
            'career-orientation': `/api/nd/career-orientation-page?locale=${locale}`
        };

        return endpoints[pageName] || null;
    }

    /**
     * Update page content with localized data
     */
    updatePageContent(data, locale) {
        console.log('[LanguageManager] Updating page content for locale:', locale);
        console.log('[LanguageManager] Available data sections:', Object.keys(data.data || {}));

        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.dataset.i18n;
            const value = this.getTranslation(data.data, key, locale);

            if (value) {
                this.translationStats.success++;
                if (element.tagName === 'IMG') {
                    element.src = value;
                    element.alt = this.getTranslation(data.data, `${key}_alt`, locale) || '';
                } else if (element.tagName === 'A') {
                    if (element.dataset.i18nHref) {
                        element.href = this.getTranslation(data.data, element.dataset.i18nHref, locale);
                    }
                    if (element.dataset.i18nText) {
                        element.textContent = this.getTranslation(data.data, element.dataset.i18nText, locale);
                    } else {
                        element.innerHTML = value;
                    }
                } else {
                    element.innerHTML = value;
                }
            } else {
                this.translationStats.failed++;
                console.warn(`[Translation Missing] ${key}`);
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
        // Try exact path first
        let value = this.getExactPath(data, key);
        if (value) return value;

        // Try mapped path
        const mappedPaths = this.getComprehensiveMappings(key);
        for (const path of mappedPaths) {
            value = this.getExactPath(data, path);
            if (value) {
                this.translationStats.fallback++;
                return value;
            }
        }

        // Try local translations as last resort
        return this.getLocalizedText(key, locale);
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

        // NAVIGATION MAPPINGS
        const navMappings = {
            'navigation.content.items.0.text': ['navigation.content.content.home', 'navigation.content.home', 'navigation.home'],
            'navigation.content.items.1.text': ['navigation.content.content.courses', 'navigation.content.courses', 'navigation.courses'],
            'navigation.content.items.2.text': ['navigation.content.content.teachers', 'navigation.content.teachers', 'navigation.teachers'],
            'navigation.content.items.3.text': ['navigation.content.content.blog', 'navigation.content.blog', 'navigation.blog'],
            'navigation.content.items.4.text': ['navigation.content.content.about_us', 'navigation.content.about_us', 'navigation.about_us'],
            'navigation.content.items.6.text': ['navigation.content.content.pricing', 'navigation.content.pricing', 'navigation.pricing'],
            'navigation.content.career.orientation': ['navigation.content.content.career_orientation', 'navigation.content.career_orientation', 'navigation.career_orientation'],
            'navigation.content.career.center': ['navigation.content.content.career_center', 'navigation.content.career_center', 'navigation.career_center']
        };

        // UI ELEMENTS MAPPINGS
        const uiMappings = {
            'ui.content.buttons.sign_up_today': ['ui_elements.content.buttons.sign_up_today', 'ui_elements.content.content.buttons.sign_up_today', 'ui.buttons.sign_up_today', 'misc.content.sign_up_today'],
            'ui.content.buttons.course_details': ['ui_elements.content.buttons.course_details', 'ui_elements.content.content.buttons.course_details', 'ui.buttons.course_details'],
            'ui.content.buttons.explore_courses': ['ui_elements.content.buttons.browse_courses', 'ui_elements.content.content.buttons.check_out_courses', 'ui.buttons.explore_courses'],
            'ui.content.buttons.uncover_all_courses': ['ui_elements.content.buttons.view_courses', 'ui.buttons.uncover_all_courses', 'misc.content.view_courses'],
            'ui.content.buttons.get_in_touch': ['ui_elements.content.buttons.get_in_touch', 'ui.buttons.get_in_touch', 'misc.content.contact_us'],
            'ui.content.messages.no_items': ['ui.messages.no_items', 'misc.content.no_items_found', 'cart.content.content.no_items_found']
        };

        // HERO SECTION MAPPINGS
        const heroMappings = {
            'hero.content.button_primary': ['hero.content.cta_text_1', 'ui_elements.content.buttons.get_in_touch', 'hero.content.button_primary'],
            'hero.content.button_secondary': ['hero.content.cta_text_2', 'ui_elements.content.buttons.check_out_courses', 'hero.content.button_secondary'],
            'hero.content.subtitle': ['hero.content.subtitle', 'hero.content.expert_led']
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

        // FEATURES/ABOUT MAPPINGS
        const featuresMappings = {
            'features.content.subtitle': ['features.content.subtitle', 'about.content.subtitle', 'stats.content.mentor.title'],
            'features.content.title': ['features.content.title', 'features.content.content.title'],
            'features.content.description': ['features.content.description', 'features.content.content.description']
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

        // Check all mapping collections
        const allMappings = Object.assign({},
            navMappings,
            uiMappings,
            heroMappings,
            cartMappings,
            featuresMappings,
            courseCategoriesMappings,
            coursesMappings,
            statsMappings
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
                'testimonials.author1.name': 'David Kim',
                'testimonials.author2.name': 'Tariq Ahmed',
                'testimonials.author3.name': 'Nadia Khan',
                'footer.company.zohacous': 'Zohacous'
            },
            ru: {
                learnMore: 'Узнать больше',
                readMore: 'Читать далее',
                loading: 'Загрузка...',
                error: 'Ошибка загрузки контента',
                'navigation.blog': 'Блог',
                'testimonials.author1.name': 'Давид Ким',
                'testimonials.author2.name': 'Тарик Ахмед',
                'testimonials.author3.name': 'Надия Хан',
                'footer.company.zohacous': 'Зохакус'
            },
            he: {
                learnMore: 'למד עוד',
                readMore: 'קרא עוד',
                loading: 'טוען...',
                error: 'שגיאה בטעינת תוכן',
                'navigation.blog': 'בלוג',
                'testimonials.author1.name': 'דיוויד קים',
                'testimonials.author2.name': 'טאריק אחמד',
                'testimonials.author3.name': 'נדיה חאן',
                'footer.company.zohacous': 'זוהקוס'
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