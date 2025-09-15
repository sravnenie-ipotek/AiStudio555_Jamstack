/**
 * MASTER-CLASS DATABASE-DRIVEN FOOTER LOADER
 *
 * Replaces hardcoded footer HTML with database-driven content
 * Features: Multi-level caching, fallback systems, performance monitoring
 * Architecture: Master-class DBA and performance optimization
 */

class MasterFooterLoader {
    constructor(options = {}) {
        // Configuration with master-class defaults
        this.config = {
            apiBase: options.apiBase || 'https://aistudio555jamstack-production.up.railway.app',
            localApiBase: options.localApiBase || 'http://localhost:3000',
            timeout: options.timeout || 5000,
            maxRetries: options.maxRetries || 2,
            cacheTimeout: options.cacheTimeout || 3600000, // 1 hour
            fallbackEnabled: options.fallbackEnabled !== false,
            enablePerformanceMonitoring: options.enablePerformanceMonitoring !== false,
            enableDebugLogging: options.enableDebugLogging || false
        };

        // Performance monitoring
        this.metrics = {
            apiCalls: 0,
            cacheHits: 0,
            fallbackActivations: 0,
            averageLoadTime: 0,
            totalLoadTime: 0,
            errors: []
        };

        // Multi-level cache system
        this.memoryCache = new Map();
        this.cacheKeys = {
            FOOTER_DATA: 'footerData',
            LAST_UPDATE: 'lastUpdate',
            PERFORMANCE: 'performanceMetrics'
        };

        // API detection
        this.apiEndpoint = this.detectApiEndpoint();

        // Initialize fallback data
        this.staticFallback = this.initializeFallbackData();

        // Performance observer
        if (this.config.enablePerformanceMonitoring) {
            this.initializePerformanceMonitoring();
        }

        this.log('🚀 MasterFooterLoader initialized', 'info');
    }

    /**
     * Detect which API endpoint to use (production or local)
     */
    detectApiEndpoint() {
        const hostname = window.location.hostname;
        const currentPort = window.location.port;
        const isDevelopment = hostname === 'localhost' || hostname === '127.0.0.1';

        let endpoint;
        if (currentPort === '3005') {
            // Frontend on Python server (3005), API on Express (4005)
            endpoint = 'http://localhost:4005';
        } else if (currentPort === '4005') {
            // Accessing directly via Express server
            endpoint = 'http://localhost:4005';
        } else if (isDevelopment) {
            // Default local setup - use port 4005
            endpoint = 'http://localhost:4005';
        } else {
            // Production
            endpoint = this.config.apiBase;
        }

        this.log(`🌐 API Endpoint detected: ${endpoint} (${isDevelopment ? 'development' : 'production'})`, 'info');
        return endpoint;
    }

    /**
     * Initialize fallback data structure matching current footer
     */
    initializeFallbackData() {
        return {
            en: {
                companyName: 'AI Studio',
                companyDescription: 'Elevate tech career with expert-led courses. If you\'re just aiming to advance skills, practical training is designed.',
                contactEmail: 'contact@aistudio555.com',
                navigation: {
                    main: {
                        title: 'Menu',
                        items: [
                            { text: 'Home', url: 'home.html', visible: true },
                            { text: 'Courses', url: 'courses.html', visible: true },
                            { text: 'Teachers', url: 'teachers.html', visible: true },
                            { text: 'Pricing', url: 'pricing.html', visible: true }
                        ]
                    },
                    career_services: {
                        title: 'Career Services',
                        items: [
                            { text: 'Career Orientation', url: 'career-orientation.html', visible: true },
                            { text: 'Career Center', url: 'career-center.html', visible: true }
                        ]
                    }
                },
                socialLinks: [
                    { platform: 'facebook', url: 'https://www.facebook.com/', tooltip: 'Facebook' },
                    { platform: 'twitter', url: 'https://twitter.com/', tooltip: 'Twitter' },
                    { platform: 'instagram', url: 'https://www.instagram.com/', tooltip: 'Instagram' },
                    { platform: 'youtube', url: 'https://youtube.com/', tooltip: 'YouTube' }
                ],
                newsletter: {
                    title: 'Subscribe to Newsletter',
                    placeholder: 'Enter email to subscribe',
                    buttonText: 'Subscribe',
                    successMessage: 'Thank you! Your submission has been received!',
                    errorMessage: 'Oops! Something went wrong while submitting the form.'
                }
            },
            ru: {
                companyName: 'AI Studio',
                companyDescription: 'Поднимите свою технологическую карьеру с курсами от экспертов. Практическое обучение разработано для тех, кто стремится улучшить свои навыки.',
                contactEmail: 'contact@aistudio555.com',
                navigation: {
                    main: {
                        title: 'Меню',
                        items: [
                            { text: 'Главная', url: 'home.html', visible: true },
                            { text: 'Курсы', url: 'courses.html', visible: true },
                            { text: 'Преподаватели', url: 'teachers.html', visible: true },
                            { text: 'Цены', url: 'pricing.html', visible: true }
                        ]
                    },
                    career_services: {
                        title: 'Карьерные Услуги',
                        items: [
                            { text: 'Карьерная Ориентация', url: 'career-orientation.html', visible: true },
                            { text: 'Карьерный Центр', url: 'career-center.html', visible: true }
                        ]
                    }
                },
                socialLinks: [
                    { platform: 'facebook', url: 'https://www.facebook.com/', tooltip: 'Facebook' },
                    { platform: 'twitter', url: 'https://twitter.com/', tooltip: 'Twitter' },
                    { platform: 'instagram', url: 'https://www.instagram.com/', tooltip: 'Instagram' },
                    { platform: 'youtube', url: 'https://youtube.com/', tooltip: 'YouTube' }
                ],
                newsletter: {
                    title: 'Подписаться на рассылку',
                    placeholder: 'Введите email для подписки',
                    buttonText: 'Подписаться',
                    successMessage: 'Спасибо! Ваша заявка принята!',
                    errorMessage: 'Упс! Что-то пошло не так при отправке формы.'
                }
            },
            he: {
                companyName: 'AI Studio',
                companyDescription: 'העלה את הקריירה הטכנולוגית שלך עם קורסים בהדרכת מומחים. הכשרה מעשית מיועדת למי שמטרתו לקדם כישורים.',
                contactEmail: 'contact@aistudio555.com',
                navigation: {
                    main: {
                        title: 'תפריט',
                        items: [
                            { text: 'בית', url: 'home.html', visible: true },
                            { text: 'קורסים', url: 'courses.html', visible: true },
                            { text: 'מורים', url: 'teachers.html', visible: true },
                            { text: 'תמחור', url: 'pricing.html', visible: true }
                        ]
                    },
                    career_services: {
                        title: 'שירותי קריירה',
                        items: [
                            { text: 'כיוון קריירה', url: 'career-orientation.html', visible: true },
                            { text: 'מרכז קריירה', url: 'career-center.html', visible: true }
                        ]
                    }
                },
                socialLinks: [
                    { platform: 'facebook', url: 'https://www.facebook.com/', tooltip: 'Facebook' },
                    { platform: 'twitter', url: 'https://twitter.com/', tooltip: 'Twitter' },
                    { platform: 'instagram', url: 'https://www.instagram.com/', tooltip: 'Instagram' },
                    { platform: 'youtube', url: 'https://youtube.com/', tooltip: 'YouTube' }
                ],
                newsletter: {
                    title: 'הרשמה לניוזלטר',
                    placeholder: 'הכנס אימייל להרשמה',
                    buttonText: 'הרשמה',
                    successMessage: 'תודה! הטופס נשלח בהצלחה!',
                    errorMessage: 'אופס! משהו השתבש בשליחת הטופס.'
                }
            }
        };
    }

    /**
     * Initialize performance monitoring
     */
    initializePerformanceMonitoring() {
        // Performance observer for measuring load times
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.name.includes('footer-api')) {
                        this.metrics.totalLoadTime += entry.duration;
                        this.metrics.averageLoadTime = this.metrics.totalLoadTime / this.metrics.apiCalls;
                    }
                }
            });
            observer.observe({ entryTypes: ['measure'] });
        }
    }

    /**
     * Master method to load footer with full error handling
     */
    async loadFooter(locale = 'en', containerId = 'dynamic-footer-container') {
        const startTime = performance.now();

        try {
            this.log(`🦶 Loading footer for locale: ${locale}`, 'info');

            // Try cache first
            const cachedData = this.getCachedFooterData(locale);
            if (cachedData) {
                this.metrics.cacheHits++;
                this.log('✅ Cache hit - rendering from cache', 'debug');
                await this.renderFooter(cachedData, containerId);
                this.recordPerformance(startTime, 'cache');
                return;
            }

            // Try API
            const footerData = await this.fetchFooterFromAPI(locale);
            if (footerData) {
                this.cacheFooterData(locale, footerData);
                await this.renderFooter(footerData, containerId);
                this.recordPerformance(startTime, 'api');
                this.log('✅ Footer loaded from database API', 'info');
                return;
            }

            throw new Error('API failed - activating fallback');

        } catch (error) {
            this.handleError(error);
            await this.activateFallback(locale, containerId);
            this.recordPerformance(startTime, 'fallback');
        }
    }

    /**
     * Fetch footer data from API with retry logic
     */
    async fetchFooterFromAPI(locale) {
        this.metrics.apiCalls++;

        for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
            try {
                performance.mark('footer-api-start');

                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

                const response = await fetch(`${this.apiEndpoint}/api/footer-content?locale=${locale}`, {
                    signal: controller.signal,
                    headers: {
                        'Accept': 'application/json',
                        'Cache-Control': 'public, max-age=3600'
                    }
                });

                clearTimeout(timeoutId);
                performance.mark('footer-api-end');
                performance.measure('footer-api-call', 'footer-api-start', 'footer-api-end');

                if (!response.ok) {
                    throw new Error(`API response ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                this.log(`✅ API success (attempt ${attempt})`, 'debug');
                return this.transformAPIData(data, locale);

            } catch (error) {
                this.log(`❌ API attempt ${attempt} failed: ${error.message}`, 'warn');

                if (attempt === this.config.maxRetries) {
                    throw error;
                }

                // Exponential backoff
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
            }
        }
    }

    /**
     * Transform API data to consistent internal format
     */
    transformAPIData(apiData, locale) {
        try {
            const attributes = apiData.data?.attributes || apiData;

            return {
                locale: locale,
                companyName: attributes.company_name || 'AI Studio',
                companyDescription: attributes.company_description || this.staticFallback[locale]?.companyDescription,
                contactEmail: attributes.contact_email || 'contact@aistudio555.com',
                navigation: attributes.navigation || this.staticFallback[locale]?.navigation,
                socialLinks: attributes.social_links || this.staticFallback[locale]?.socialLinks,
                newsletter: {
                    title: attributes.newsletter_title || this.staticFallback[locale]?.newsletter.title,
                    placeholder: attributes.newsletter_placeholder || this.staticFallback[locale]?.newsletter.placeholder,
                    buttonText: attributes.newsletter_button_text || this.staticFallback[locale]?.newsletter.buttonText,
                    successMessage: attributes.newsletter_success_message || this.staticFallback[locale]?.newsletter.successMessage,
                    errorMessage: attributes.newsletter_error_message || this.staticFallback[locale]?.newsletter.errorMessage
                }
            };
        } catch (error) {
            this.log(`⚠️ API data transformation failed: ${error.message}`, 'warn');
            throw new Error('Invalid API data format');
        }
    }

    /**
     * Render footer HTML dynamically
     */
    async renderFooter(footerData, containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`Footer container '${containerId}' not found`);
        }

        const html = this.generateFooterHTML(footerData);
        container.innerHTML = html;

        // Reattach event handlers
        await this.attachEventHandlers(container, footerData);

        this.log('🎨 Footer HTML rendered successfully', 'debug');
    }

    /**
     * Generate complete footer HTML
     */
    generateFooterHTML(data) {
        const navigation = data.navigation || {};
        const socialLinks = data.socialLinks || [];
        const newsletter = data.newsletter || {};

        return `
        <div class="container">
            <div class="footer-content">
                <div data-w-id="6ab616f4-e8bf-402d-a96f-e34ee9f6b187" class="footer-top-content">
                    <div class="footer-details-content">
                        <a href="home.html" class="footer-logo-link w-inline-block">
                            <img loading="lazy" src="images/Logo.svg" alt="${data.companyName}" class="footer-logo-image">
                        </a>
                        <div class="footer-description-text-wrapper">
                            <p class="footer-description-text">${data.companyDescription}</p>
                        </div>
                        <div class="footer-social-media-wrapper">
                            ${this.generateSocialLinksHTML(socialLinks)}
                        </div>
                        <div class="footer-details-gmail">Contact: <span class="footer-details-gmail-text">${data.contactEmail}</span></div>
                        <div class="footer-details-form-wrapper">
                            ${this.generateNewsletterHTML(newsletter)}
                        </div>
                    </div>
                    <div class="footer-menu-wrapper">
                        <div class="w-layout-grid footer-menu-grid">
                            ${this.generateNavigationHTML(navigation)}
                            ${this.generateContactInfoHTML(data)}
                        </div>
                    </div>
                </div>
                ${this.generateFooterBottomHTML(data)}
            </div>
        </div>`;
    }

    /**
     * Generate navigation menus HTML
     */
    generateNavigationHTML(navigation) {
        let html = '';

        // Main navigation
        if (navigation.main) {
            html += `
            <div class="footer-menu-single">
                <div class="footer-menu-title-wrapper">
                    <h4 class="footer-menu-title">${navigation.main.title}</h4>
                    <div class="footer-menu-title-line"></div>
                </div>
                <div class="footer-menu-list-wrapper">
                    <ul role="list" class="footer-menu-list">
                        ${navigation.main.items.map(item => `
                        <li class="footer-menu-list-item">
                            <a href="${item.url}" class="footer-menu-text-link">${item.text}</a>
                        </li>
                        `).join('')}
                    </ul>
                </div>
            </div>`;
        }

        // Career Services navigation
        if (navigation.career_services) {
            html += `
            <div class="footer-menu-single">
                <div class="footer-menu-title-wrapper">
                    <h4 class="footer-menu-title">${navigation.career_services.title}</h4>
                    <div class="footer-menu-title-line"></div>
                </div>
                <div class="footer-menu-list-wrapper">
                    <ul role="list" class="footer-menu-list">
                        ${navigation.career_services.items.map(item => `
                        <li class="footer-menu-list-item">
                            <a href="${item.url}" class="footer-menu-text-link">${item.text}</a>
                        </li>
                        `).join('')}
                    </ul>
                </div>
            </div>`;
        }

        return html;
    }

    /**
     * Generate social links HTML
     */
    generateSocialLinksHTML(socialLinks) {
        return socialLinks.map(link => `
            <a href="${link.url}" target="_blank" class="footer-social-media-link w-inline-block" title="${link.tooltip || link.platform}">
                <div class="footer-social-media-icon"></div>
                <div class="footer-social-media-circel"></div>
            </a>
        `).join('');
    }

    /**
     * Generate newsletter form HTML
     */
    generateNewsletterHTML(newsletter) {
        return `
        <div class="footer-details-form-block w-form">
            <form id="email-form" name="email-form" data-name="Email Form" method="get" class="footer-details-form">
                <label for="email-2" class="footer-details-form-text">${newsletter.title}</label>
                <div class="footer-details-form-single">
                    <input class="footer-details-form-input-field w-input" maxlength="256" name="email-2"
                           data-name="Email 2" placeholder="${newsletter.placeholder}" type="email" id="email-2" required="">
                    <input type="submit" data-wait="" class="footer-details-form-submit-button w-button" value="">
                </div>
            </form>
            <div class="w-form-done">
                <div>${newsletter.successMessage}</div>
            </div>
            <div class="w-form-fail">
                <div>${newsletter.errorMessage}</div>
            </div>
        </div>`;
    }

    /**
     * Generate contact info HTML
     */
    generateContactInfoHTML(data) {
        return `
        <div class="footer-menu-single">
            <div class="footer-menu-title-wrapper mt40">
                <h4 class="footer-menu-title">Contact</h4>
                <div class="footer-menu-title-line"></div>
            </div>
            <div class="footer-contact-details">
                <div class="footer-contact-details-single">
                    <img loading="lazy" src="images/Footer-Contact-Details-Icon1.svg" alt="" class="footer-contact-details-icon">
                    <div class="footer-contact-details-text">(000) 012 3456 7890</div>
                </div>
                <div class="footer-contact-details-single">
                    <img loading="lazy" src="images/Footer-Contact-Details-Icon2.svg" alt="" class="footer-contact-details-icon">
                    <div class="footer-contact-details-text">${data.contactEmail}</div>
                </div>
                <div class="footer-contact-details-single">
                    <img loading="lazy" src="images/Footer-Contact-Details-Icon3.svg" alt="" class="footer-contact-details-icon">
                    <div class="footer-contact-details-text">1234 Valencia, Suite, SF, CA</div>
                </div>
            </div>
        </div>`;
    }

    /**
     * Generate footer bottom HTML
     */
    generateFooterBottomHTML(data) {
        return `
        <div class="footer-bottom-content">
            <div class="footer-information-wrapper">
                <div class="footer-information-text">
                    © Copyright - <a href="home.html" class="footer-information-text-link">${data.companyName}</a> |
                    Designed by <a href="https://zohaflow.webflow.io" target="_blank" class="footer-information-text-link">Zohaflow</a> -
                    <a href="template-pages/license.html" class="footer-information-text-link">Licensing</a>
                    Powered by <a href="https://webflow.com/" target="_blank" class="footer-information-text-link">Webflow</a>
                </div>
            </div>
        </div>`;
    }

    /**
     * Attach event handlers after rendering
     */
    async attachEventHandlers(container, footerData) {
        // Newsletter form handler
        const form = container.querySelector('#email-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleNewsletterSubmit(e, footerData));
        }

        // Social link click tracking
        const socialLinks = container.querySelectorAll('.footer-social-media-link');
        socialLinks.forEach(link => {
            link.addEventListener('click', (e) => this.trackSocialClick(e));
        });

        // Reactivate Webflow forms if available
        if (window.Webflow && typeof window.Webflow.ready === 'function') {
            window.Webflow.ready();
        }

        this.log('🔗 Event handlers attached successfully', 'debug');
    }

    /**
     * Handle newsletter form submission
     */
    async handleNewsletterSubmit(event, footerData) {
        event.preventDefault();

        const form = event.target;
        const email = form.querySelector('#email-2').value;

        this.log(`📧 Newsletter signup attempt: ${email}`, 'debug');

        // Here you would integrate with your existing EmailJS system
        // For now, show success message
        const successDiv = form.parentNode.querySelector('.w-form-done');
        const errorDiv = form.parentNode.querySelector('.w-form-fail');

        try {
            // Simulate EmailJS integration
            await new Promise(resolve => setTimeout(resolve, 1000));

            form.style.display = 'none';
            successDiv.style.display = 'block';
            errorDiv.style.display = 'none';

            this.log('✅ Newsletter signup successful', 'info');
        } catch (error) {
            errorDiv.style.display = 'block';
            successDiv.style.display = 'none';
            this.log(`❌ Newsletter signup failed: ${error.message}`, 'error');
        }
    }

    /**
     * Track social media link clicks
     */
    trackSocialClick(event) {
        const link = event.currentTarget;
        const platform = link.title || 'unknown';

        this.log(`🔗 Social click: ${platform}`, 'debug');

        // Add analytics tracking here if needed
    }

    /**
     * Activate fallback system
     */
    async activateFallback(locale, containerId) {
        this.metrics.fallbackActivations++;

        const fallbackData = this.staticFallback[locale] || this.staticFallback.en;

        this.log(`🛡️ Activating fallback for locale: ${locale}`, 'warn');

        await this.renderFooter(fallbackData, containerId);

        // Cache fallback for future use
        this.cacheFooterData(locale, fallbackData, 300000); // 5 minute cache
    }

    /**
     * Cache footer data with TTL
     */
    cacheFooterData(locale, data, customTTL = null) {
        const ttl = customTTL || this.config.cacheTimeout;
        const cacheEntry = {
            data: data,
            timestamp: Date.now(),
            ttl: ttl
        };

        // Memory cache
        this.memoryCache.set(`${this.cacheKeys.FOOTER_DATA}_${locale}`, cacheEntry);

        // localStorage cache
        try {
            localStorage.setItem(`masterFooter_${locale}`, JSON.stringify(cacheEntry));
            this.log(`💾 Footer data cached for locale: ${locale}`, 'debug');
        } catch (error) {
            this.log(`⚠️ localStorage cache failed: ${error.message}`, 'warn');
        }
    }

    /**
     * Get cached footer data
     */
    getCachedFooterData(locale) {
        const cacheKey = `${this.cacheKeys.FOOTER_DATA}_${locale}`;

        // Try memory cache first
        let cacheEntry = this.memoryCache.get(cacheKey);

        // Try localStorage if memory cache miss
        if (!cacheEntry) {
            try {
                const stored = localStorage.getItem(`masterFooter_${locale}`);
                if (stored) {
                    cacheEntry = JSON.parse(stored);
                    // Restore to memory cache
                    this.memoryCache.set(cacheKey, cacheEntry);
                }
            } catch (error) {
                this.log(`⚠️ Cache read error: ${error.message}`, 'warn');
            }
        }

        // Check if cache is still valid
        if (cacheEntry) {
            const age = Date.now() - cacheEntry.timestamp;
            if (age < cacheEntry.ttl) {
                return cacheEntry.data;
            } else {
                // Cache expired - clean up
                this.memoryCache.delete(cacheKey);
                try {
                    localStorage.removeItem(`masterFooter_${locale}`);
                } catch (error) {
                    // Ignore cleanup errors
                }
            }
        }

        return null;
    }

    /**
     * Record performance metrics
     */
    recordPerformance(startTime, method) {
        const duration = performance.now() - startTime;
        this.metrics.totalLoadTime += duration;
        this.metrics.averageLoadTime = this.metrics.totalLoadTime / (this.metrics.apiCalls + this.metrics.cacheHits + this.metrics.fallbackActivations);

        this.log(`⚡ Performance: ${method} took ${duration.toFixed(2)}ms`, 'debug');
    }

    /**
     * Handle errors with logging and metrics
     */
    handleError(error) {
        this.metrics.errors.push({
            message: error.message,
            timestamp: new Date().toISOString(),
            stack: error.stack
        });

        this.log(`❌ Error: ${error.message}`, 'error');

        // Keep only last 10 errors
        if (this.metrics.errors.length > 10) {
            this.metrics.errors = this.metrics.errors.slice(-10);
        }
    }

    /**
     * Get performance metrics
     */
    getPerformanceMetrics() {
        return {
            ...this.metrics,
            cacheHitRate: this.metrics.cacheHits / (this.metrics.apiCalls + this.metrics.cacheHits) || 0,
            errorRate: this.metrics.errors.length / (this.metrics.apiCalls + this.metrics.fallbackActivations) || 0
        };
    }

    /**
     * Logger with levels
     */
    log(message, level = 'info') {
        if (!this.config.enableDebugLogging && level === 'debug') {
            return;
        }

        const timestamp = new Date().toISOString().slice(11, 23);
        const emoji = {
            info: 'ℹ️',
            warn: '⚠️',
            error: '❌',
            debug: '🐛'
        };

        console.log(`${emoji[level]} [${timestamp}] MasterFooterLoader: ${message}`);
    }

    /**
     * Clear all caches
     */
    clearCache() {
        this.memoryCache.clear();

        // Clear localStorage entries
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('masterFooter_')) {
                localStorage.removeItem(key);
            }
        });

        this.log('🧹 All caches cleared', 'info');
    }

    /**
     * Health check method
     */
    async healthCheck() {
        try {
            const response = await fetch(`${this.apiEndpoint}/api/footer-health`);
            const health = await response.json();

            this.log(`💊 Health check: ${health.status}`, health.status === 'healthy' ? 'info' : 'warn');
            return health;
        } catch (error) {
            this.log(`💊 Health check failed: ${error.message}`, 'error');
            return { status: 'unhealthy', error: error.message };
        }
    }
}

// Global initialization
window.MasterFooterLoader = MasterFooterLoader;

// Auto-initialize on DOM ready if footer container exists
document.addEventListener('DOMContentLoaded', () => {
    const footerContainer = document.getElementById('dynamic-footer-container');
    if (footerContainer && !window.masterFooterLoaderInstance) {
        // Detect current language
        const locale = document.documentElement.lang ||
                      localStorage.getItem('preferredLanguage') ||
                      'en';

        // Create instance with performance monitoring enabled
        window.masterFooterLoaderInstance = new MasterFooterLoader({
            enableDebugLogging: true,
            enablePerformanceMonitoring: true
        });

        // Load footer
        window.masterFooterLoaderInstance.loadFooter(locale)
            .then(() => {
                console.log('✅ MasterFooterLoader: Footer loaded successfully on page load');
            })
            .catch(error => {
                console.error('❌ MasterFooterLoader: Failed to load footer on page load:', error);
            });
    }
});

// Language change event listener
document.addEventListener('languageChanged', (event) => {
    if (window.masterFooterLoaderInstance) {
        const newLocale = event.detail.locale;
        window.masterFooterLoaderInstance.loadFooter(newLocale)
            .then(() => {
                console.log(`✅ MasterFooterLoader: Footer updated for language: ${newLocale}`);
            })
            .catch(error => {
                console.error(`❌ MasterFooterLoader: Failed to update footer for language ${newLocale}:`, error);
            });
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MasterFooterLoader;
}