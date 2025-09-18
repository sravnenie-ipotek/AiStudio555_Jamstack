/**
 * Mobile-First Global Language Manager
 * Optimized for 80% mobile users with connection intelligence
 * Blocks UI during switches, aggressive caching, minimal data usage
 */

class MobileLanguageManager {
    constructor() {
        // Core mobile-optimized settings
        this.supportedLocales = ['en', 'ru', 'he'];
        this.currentLocale = this.getInitialLocale();
        this.isLoading = false;
        this.abortController = null;

        // Mobile-first performance settings
        this.apiBaseUrl = window.location.hostname === 'localhost'
            ? 'http://localhost:1337'
            : 'https://aistudio555jamstack-production.up.railway.app';

        // Connection intelligence
        this.connectionQuality = this.detectConnectionQuality();
        this.timeouts = this.getTimeoutsByConnection();

        // Aggressive mobile-optimized caching
        this.cache = this.initializeMobileCache();

        // Initialize immediately
        this.init();
    }

    /**
     * CONNECTION INTELLIGENCE - Mobile First
     */
    detectConnectionQuality() {
        if (!navigator.connection) return 'medium';

        const conn = navigator.connection;

        // Respect user's data saver choice (most important for mobile)
        if (conn.saveData) return 'minimal';

        // Connection-based classification
        if (conn.effectiveType === '4g' && conn.downlink > 10) return 'fast';
        if (conn.effectiveType === '3g' || conn.downlink > 1.5) return 'medium';
        return 'slow';
    }

    getTimeoutsByConnection() {
        const timeouts = {
            'fast': { api: 3000, fallback: 5000 },
            'medium': { api: 5000, fallback: 8000 },
            'slow': { api: 8000, fallback: 12000 },
            'minimal': { api: 10000, fallback: 15000 }
        };
        return timeouts[this.connectionQuality];
    }

    /**
     * MOBILE-OPTIMIZED CACHE SYSTEM
     */
    initializeMobileCache() {
        const cache = {
            storage: sessionStorage, // Survives page reloads, auto-cleanup
            data: new Map(),
            maxSize: this.getMaxCacheSize(),
            lruOrder: [] // Least Recently Used tracking
        };

        // Load existing cache from session storage
        try {
            const stored = sessionStorage.getItem('langCache');
            if (stored) {
                const parsed = JSON.parse(stored);
                cache.data = new Map(parsed.data);
                cache.lruOrder = parsed.lruOrder || [];
            }
        } catch (e) {
            console.warn('Failed to load language cache:', e);
        }

        return cache;
    }

    getMaxCacheSize() {
        // Memory-aware cache sizing for mobile
        const deviceMemory = navigator.deviceMemory || 4;

        if (this.connectionQuality === 'minimal') return 1; // Data saver mode
        if (deviceMemory < 2) return 1; // Low-end devices
        if (deviceMemory < 4) return 2; // Mid-range devices
        return 2; // High-end devices (still conservative for mobile)
    }

    /**
     * INITIALIZATION - Mobile Performance Optimized
     */
    init() {
        // Set initial state immediately (no delay)
        this.setInitialLanguageState();

        // Attach event listeners with mobile optimizations
        this.attachMobileLanguageSwitchers();
        this.attachNavigationInterception();

        // Preconnect to API for faster requests (mobile optimization)
        this.preconnectAPI();

        // Load content if dynamic content exists
        if (this.shouldLoadContent()) {
            this.loadPageContent(this.currentLocale, false);
        }

        // Handle browser navigation (skip language changes in history)
        this.attachHistoryHandling();
    }

    preconnectAPI() {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = this.apiBaseUrl;
        document.head.appendChild(link);
    }

    /**
     * LOCALE DETECTION - URL First, Then Storage
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

    getLocaleFromURL() {
        const params = new URLSearchParams(window.location.search);
        const locale = params.get('locale');
        return locale && this.supportedLocales.includes(locale) ? locale : null;
    }

    /**
     * MOBILE-OPTIMIZED UI STATE MANAGEMENT
     */
    setInitialLanguageState() {
        // Update language pills immediately
        const pills = document.querySelectorAll('.lang-pill, .mobile-lang-pill');
        pills.forEach(pill => {
            const lang = pill.textContent.toLowerCase();
            pill.classList.toggle('active', lang === this.currentLocale);
        });

        // Handle RTL for Hebrew (critical for mobile layout)
        this.updateRTLState();

        // Update document language attribute
        document.documentElement.setAttribute('lang', this.currentLocale);
    }

    updateRTLState() {
        if (this.currentLocale === 'he') {
            document.documentElement.setAttribute('dir', 'rtl');
            document.body.classList.add('rtl');
        } else {
            document.documentElement.setAttribute('dir', 'ltr');
            document.body.classList.remove('rtl');
        }
    }

    /**
     * BLOCKING LANGUAGE SWITCHERS - Prevent Race Conditions
     */
    attachMobileLanguageSwitchers() {
        // Override existing setActivePill with mobile-optimized version
        window.setActivePill = (element) => {
            if (this.isLoading) return; // Block until current operation completes

            const lang = element.textContent.toLowerCase();
            this.switchLanguageBlocking(lang, element);
        };
    }

    /**
     * BLOCKING LANGUAGE SWITCH - Mobile First UX
     */
    async switchLanguageBlocking(locale, clickedElement) {
        if (!this.supportedLocales.includes(locale) || locale === this.currentLocale) {
            return;
        }

        // BLOCK UI immediately to prevent race conditions
        this.isLoading = true;
        this.showLoadingState(clickedElement);
        this.disableAllLanguagePills();

        try {
            // Load content with mobile optimizations
            await this.loadPageContent(locale, true);

            // Update everything globally
            this.currentLocale = locale;
            this.updateGlobalLanguageState(locale);

            // Cache for next time
            localStorage.setItem('preferred_locale', locale);

            // Success feedback
            this.showSuccessFeedback(clickedElement);

        } catch (error) {
            console.error('Language switch failed:', error);
            this.handleLanguageSwitchError(clickedElement);
        } finally {
            // Always re-enable UI
            this.isLoading = false;
            this.hideLoadingState();
            this.enableAllLanguagePills();
        }
    }

    /**
     * MOBILE LOADING STATES - Simple Spinner
     */
    showLoadingState(element) {
        // Add simple loading class for CSS animation
        element.classList.add('loading');

        // Create simple spinner if needed
        if (!element.querySelector('.spinner')) {
            const spinner = document.createElement('div');
            spinner.className = 'spinner';
            element.appendChild(spinner);
        }
    }

    hideLoadingState() {
        document.querySelectorAll('.lang-pill, .mobile-lang-pill').forEach(pill => {
            pill.classList.remove('loading');
            const spinner = pill.querySelector('.spinner');
            if (spinner) spinner.remove();
        });
    }

    disableAllLanguagePills() {
        document.querySelectorAll('.lang-pill, .mobile-lang-pill').forEach(pill => {
            pill.style.pointerEvents = 'none';
            pill.style.opacity = '0.6';
        });
    }

    enableAllLanguagePills() {
        document.querySelectorAll('.lang-pill, .mobile-lang-pill').forEach(pill => {
            pill.style.pointerEvents = '';
            pill.style.opacity = '';
        });
    }

    showSuccessFeedback(element) {
        element.classList.add('success');
        setTimeout(() => element.classList.remove('success'), 500);
    }

    handleLanguageSwitchError(element) {
        // Show error state
        element.classList.add('error');
        setTimeout(() => element.classList.remove('error'), 2000);

        // Fall back to English
        if (this.currentLocale !== 'en') {
            setTimeout(() => this.switchLanguageBlocking('en', element), 1000);
        }
    }

    /**
     * AGGRESSIVE MOBILE CACHING SYSTEM
     */
    async loadPageContent(locale, isUserTriggered = false) {
        // Check cache first (mobile priority)
        const cached = this.getCachedContent(locale);
        if (cached) {
            this.updatePageContent(cached, locale);
            this.markCacheAsUsed(locale);
            return;
        }

        // Cancel any previous request
        if (this.abortController) {
            this.abortController.abort();
        }
        this.abortController = new AbortController();

        const pageName = this.getCurrentPageName();
        const endpoint = this.getAPIEndpoint(pageName, locale);

        if (!endpoint) return;

        try {
            const url = `${this.apiBaseUrl}${endpoint}`;
            const timeout = isUserTriggered ? this.timeouts.api : this.timeouts.fallback;

            // Mobile-optimized fetch with timeout
            const response = await this.fetchWithTimeout(url, timeout);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();

            // Cache aggressively for mobile
            this.setCachedContent(locale, data);

            // Update page content
            this.updatePageContent(data, locale);

        } catch (error) {
            if (error.name === 'AbortError') return; // Request was cancelled

            console.error('Failed to load content:', error);

            // Mobile fallback strategy
            if (locale !== 'en') {
                await this.loadPageContent('en', false); // Fallback to English
            }
        }
    }

    async fetchWithTimeout(url, timeout) {
        return Promise.race([
            fetch(url, { signal: this.abortController.signal }),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Request timeout')), timeout)
            )
        ]);
    }

    /**
     * MOBILE CACHE OPERATIONS - LRU with Compression
     */
    getCachedContent(locale) {
        if (!this.cache.data.has(locale)) return null;

        // Mark as recently used
        this.markCacheAsUsed(locale);

        return this.cache.data.get(locale);
    }

    setCachedContent(locale, data) {
        // Evict least recently used if cache is full
        if (this.cache.data.size >= this.cache.maxSize && !this.cache.data.has(locale)) {
            const lru = this.cache.lruOrder.shift();
            this.cache.data.delete(lru);
        }

        // Store in cache
        this.cache.data.set(locale, data);
        this.markCacheAsUsed(locale);

        // Persist to session storage (mobile optimization)
        this.persistCache();
    }

    markCacheAsUsed(locale) {
        // Remove from current position
        this.cache.lruOrder = this.cache.lruOrder.filter(l => l !== locale);
        // Add to end (most recently used)
        this.cache.lruOrder.push(locale);
    }

    persistCache() {
        try {
            const toStore = {
                data: Array.from(this.cache.data.entries()),
                lruOrder: this.cache.lruOrder
            };
            sessionStorage.setItem('langCache', JSON.stringify(toStore));
        } catch (e) {
            console.warn('Failed to persist cache:', e);
        }
    }

    /**
     * GLOBAL STATE UPDATE - Whole Site Changes
     */
    updateGlobalLanguageState(locale) {
        // Update URL (for sharing and SEO)
        this.updateURL(locale);

        // Update all language pills
        this.setInitialLanguageState();

        // Update all navigation links
        this.updateAllNavigationLinks(locale);
    }

    updateURL(locale) {
        const url = new URL(window.location);

        if (locale === 'en') {
            url.searchParams.delete('locale'); // Keep URLs clean for English
        } else {
            url.searchParams.set('locale', locale);
        }

        // Update without adding to history (skip language changes as requested)
        history.replaceState({ locale }, '', url);
    }

    updateAllNavigationLinks(locale) {
        // Update all internal links to preserve language
        document.querySelectorAll('a[href]').forEach(link => {
            if (this.isInternalLink(link)) {
                this.addLocaleToLink(link, locale);
            }
        });
    }

    /**
     * NAVIGATION INTERCEPTION - Just-in-Time Link Updates
     */
    attachNavigationInterception() {
        document.addEventListener('click', (event) => {
            const link = event.target.closest('a');
            if (!link || !this.isInternalLink(link)) return;

            // Add locale parameter just-in-time
            this.addLocaleToLink(link, this.currentLocale);
        });
    }

    isInternalLink(link) {
        if (!link.href) return false;

        const url = new URL(link.href, window.location);
        return url.origin === window.location.origin &&
               url.pathname.endsWith('.html');
    }

    addLocaleToLink(link, locale) {
        if (locale === 'en') return; // Keep English URLs clean

        const url = new URL(link.href);
        url.searchParams.set('locale', locale);
        link.href = url.toString();
    }

    /**
     * BROWSER HISTORY HANDLING
     */
    attachHistoryHandling() {
        window.addEventListener('popstate', (e) => {
            const locale = this.getLocaleFromURL() || 'en';
            if (locale !== this.currentLocale) {
                this.currentLocale = locale;
                this.setInitialLanguageState();

                if (this.shouldLoadContent()) {
                    this.loadPageContent(locale, false);
                }
            }
        });
    }

    /**
     * PAGE CONTENT UPDATES
     */
    shouldLoadContent() {
        return document.querySelector('[data-dynamic-content]') !== null;
    }

    getCurrentPageName() {
        if (document.body.dataset.page) {
            return document.body.dataset.page;
        }

        const path = window.location.pathname;
        if (path.includes('home') || path === '/' || path === '/backups/newDesign/') return 'home';
        if (path.includes('courses')) return 'courses';
        if (path.includes('teachers')) return 'teachers';
        if (path.includes('blog')) return 'blog';

        return 'home';
    }

    getAPIEndpoint(pageName, locale) {
        const endpoints = {
            'home': `/api/nd/home-page?locale=${locale}`,
            'courses': `/api/nd/courses?locale=${locale}`,
            'teachers': `/api/nd/teachers?locale=${locale}`,
            'blog': `/api/nd/blog?locale=${locale}`
        };
        return endpoints[pageName] || null;
    }

    updatePageContent(data, locale) {
        // Update all elements with data-i18n attributes
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.dataset.i18n;
            const value = this.getNestedValue(data.data, key);

            if (value) {
                if (element.tagName === 'IMG') {
                    element.src = value;
                } else {
                    element.textContent = value;
                }
            }
        });

        // Update RTL state
        this.updateRTLState();

        // Dispatch global language change event
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { locale, data }
        }));
    }

    getNestedValue(obj, path) {
        return path.split('.').reduce((curr, prop) => {
            return curr?.[prop];
        }, obj);
    }
}

// Initialize mobile-first language manager globally
const mobileLanguageManager = new MobileLanguageManager();

// Export for external use
window.MobileLanguageManager = MobileLanguageManager;
window.mobileLanguageManager = mobileLanguageManager;

// Add mobile-optimized CSS
if (!document.getElementById('mobile-language-styles')) {
    const styles = document.createElement('style');
    styles.id = 'mobile-language-styles';
    styles.textContent = `
        /* Mobile-First Language Switching Styles */
        .lang-pill, .mobile-lang-pill {
            transition: opacity 0.2s ease, transform 0.1s ease;
            position: relative;
            overflow: hidden;
        }

        .lang-pill.loading, .mobile-lang-pill.loading {
            opacity: 0.8;
            transform: scale(0.95);
        }

        .lang-pill.success, .mobile-lang-pill.success {
            transform: scale(1.05);
        }

        .lang-pill.error, .mobile-lang-pill.error {
            background-color: #ff4444 !important;
            color: white !important;
        }

        /* Simple Mobile Spinner */
        .spinner {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 12px;
            height: 12px;
            margin: -6px 0 0 -6px;
            border: 2px solid transparent;
            border-top-color: currentColor;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        /* RTL Support */
        [dir="rtl"] {
            text-align: right;
        }

        [dir="rtl"] .spinner {
            animation-direction: reverse;
        }

        /* Mobile Optimizations */
        @media (max-width: 768px) {
            .lang-pill, .mobile-lang-pill {
                min-height: 44px; /* Apple's minimum touch target */
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
    `;
    document.head.appendChild(styles);
}