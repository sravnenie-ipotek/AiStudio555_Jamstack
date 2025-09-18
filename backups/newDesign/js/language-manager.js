/**
 * Language Manager for AI Studio
 * Handles dynamic language switching with intelligent caching and API integration
 */

class LanguageManager {
    constructor() {
        this.currentLocale = this.getInitialLocale();
        this.contentCache = {};
        this.isLoading = false;
        this.supportedLocales = ['en', 'ru', 'he'];
        this.apiBaseUrl = window.location.hostname === 'localhost'
            ? 'http://localhost:1337'
            : 'https://aistudio555jamstack-production.up.railway.app';

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
        // Set initial language state
        this.setInitialLanguageState();

        // Attach language switcher handlers
        this.attachLanguageSwitchers();

        // Load content for current language if needed
        if (this.shouldLoadContent()) {
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
        return this.supportedLocales.includes(locale) ? locale : null;
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

        // Determine which API endpoint to call based on current page
        const pageName = this.getCurrentPageName();
        const endpoint = this.getAPIEndpoint(pageName, locale);

        if (!endpoint) {
            console.log('No dynamic content endpoint for this page');
            return;
        }

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
            'courses': `/api/nd/courses?locale=${locale}`,
            'teachers': `/api/teachers?locale=${locale}`,
            'blog': `/api/blog-posts?locale=${locale}`,
            'career-center': `/api/career-center-page?locale=${locale}`,
            'career-orientation': `/api/career-orientation-page?locale=${locale}`
        };

        return endpoints[pageName] || null;
    }

    /**
     * Update page content with localized data
     */
    updatePageContent(data, locale) {
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.dataset.i18n;
            const value = this.getNestedValue(data, key);

            if (value) {
                if (element.tagName === 'IMG') {
                    element.src = value;
                    element.alt = this.getNestedValue(data, `${key}_alt`) || '';
                } else if (element.tagName === 'A') {
                    if (element.dataset.i18nHref) {
                        element.href = this.getNestedValue(data, element.dataset.i18nHref);
                    }
                    if (element.dataset.i18nText) {
                        element.textContent = this.getNestedValue(data, element.dataset.i18nText);
                    }
                } else {
                    element.innerHTML = value;
                }
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
            // Add RTL-specific classes if needed
            document.body.classList.add('rtl');
        } else {
            document.documentElement.setAttribute('dir', 'ltr');
            document.body.classList.remove('rtl');
        }
    }

    /**
     * Get nested value from object using dot notation
     */
    getNestedValue(obj, path) {
        return path.split('.').reduce((curr, prop) => {
            return curr?.[prop];
        }, obj);
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
     * Get localized text for common UI elements
     */
    getLocalizedText(key, locale) {
        const translations = {
            en: {
                learnMore: 'Learn More',
                readMore: 'Read More',
                loading: 'Loading...',
                error: 'Error loading content'
            },
            ru: {
                learnMore: 'Узнать больше',
                readMore: 'Читать далее',
                loading: 'Загрузка...',
                error: 'Ошибка загрузки контента'
            },
            he: {
                learnMore: 'למד עוד',
                readMore: 'קרא עוד',
                loading: 'טוען...',
                error: 'שגיאה בטעינת תוכן'
            }
        };

        return translations[locale]?.[key] || translations.en[key];
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