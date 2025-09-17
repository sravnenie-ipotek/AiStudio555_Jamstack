/**
 * Language Preference Detection System
 * Automatically detects user's preferred language and redirects from root URLs
 * to the appropriate language-prefixed version
 */

(function() {
    'use strict';

    // Configuration
    const SUPPORTED_LANGUAGES = ['en', 'he', 'ru'];
    const DEFAULT_LANGUAGE = 'en';
    const STORAGE_KEY = 'preferred_language';

    // Pages that need language routing
    const PAGES_TO_ROUTE = [
        'home.html',
        'index.html',
        'courses.html',
        'teachers.html',
        'career-center.html',
        'career-orientation.html',
        'blog.html',
        'about.html',
        'contact.html'
    ];

    /**
     * Detect user's language preference from multiple sources
     */
    function detectUserLanguage() {
        // 1. Check localStorage for saved preference
        const savedLanguage = localStorage.getItem(STORAGE_KEY);
        if (savedLanguage && SUPPORTED_LANGUAGES.includes(savedLanguage)) {
            console.log('🎯 Using saved language preference:', savedLanguage);
            return savedLanguage;
        }

        // 2. Check URL parameters for explicit language selection
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang') || urlParams.get('locale');
        if (urlLang && SUPPORTED_LANGUAGES.includes(urlLang)) {
            console.log('🔗 Using URL parameter language:', urlLang);
            saveLanguagePreference(urlLang);
            return urlLang;
        }

        // 3. Check browser language settings
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang) {
            // Extract language code (e.g., 'en-US' -> 'en')
            const langCode = browserLang.split('-')[0].toLowerCase();

            // Map browser languages to our supported languages
            const languageMap = {
                'en': 'en',
                'he': 'he',
                'iw': 'he', // Hebrew alternative code
                'ru': 'ru',
                'uk': 'ru', // Ukrainian users might prefer Russian version
                'be': 'ru'  // Belarusian users might prefer Russian version
            };

            const mappedLang = languageMap[langCode];
            if (mappedLang) {
                console.log('🌐 Browser language detected:', browserLang, '→', mappedLang);
                return mappedLang;
            }
        }

        // 4. Default to English
        console.log('📌 Using default language:', DEFAULT_LANGUAGE);
        return DEFAULT_LANGUAGE;
    }

    /**
     * Save language preference to localStorage
     */
    function saveLanguagePreference(language) {
        try {
            localStorage.setItem(STORAGE_KEY, language);
            console.log('💾 Saved language preference:', language);
        } catch (e) {
            console.warn('Could not save language preference:', e);
        }
    }

    /**
     * Get current page path and check if it needs routing
     */
    function getCurrentPageInfo() {
        const path = window.location.pathname;
        const pathParts = path.split('/').filter(Boolean);

        // Check if already has language prefix
        const hasLanguagePrefix = pathParts.length > 0 &&
            (pathParts[0] === 'dist' || SUPPORTED_LANGUAGES.includes(pathParts[0]));

        // Extract page name
        const pageName = pathParts[pathParts.length - 1] || 'index.html';

        return {
            path,
            pathParts,
            hasLanguagePrefix,
            pageName,
            needsRouting: !hasLanguagePrefix && PAGES_TO_ROUTE.includes(pageName)
        };
    }

    /**
     * Build the correct language-prefixed URL
     */
    function buildLanguageUrl(language, pageName) {
        // Check if we're in development or production
        const isDevelopment = window.location.hostname === 'localhost' ||
                             window.location.hostname === '127.0.0.1';

        if (isDevelopment) {
            // Development: use language folders directly
            return `/${language}/${pageName}`;
        } else {
            // Production: use dist folder structure
            return `/dist/${language}/${pageName}`;
        }
    }

    /**
     * Perform the language routing
     */
    function performLanguageRouting() {
        const pageInfo = getCurrentPageInfo();

        // Only route if we're on a root page without language prefix
        if (!pageInfo.needsRouting) {
            // If we're already on a language-prefixed page, save that preference
            if (pageInfo.hasLanguagePrefix) {
                const currentLang = pageInfo.pathParts[0] === 'dist' ?
                    pageInfo.pathParts[1] : pageInfo.pathParts[0];
                if (SUPPORTED_LANGUAGES.includes(currentLang)) {
                    saveLanguagePreference(currentLang);
                }
            }
            return;
        }

        console.log('🚀 Language routing needed for:', pageInfo.pageName);

        // Detect user's preferred language
        const preferredLanguage = detectUserLanguage();

        // Build the target URL
        const targetUrl = buildLanguageUrl(preferredLanguage, pageInfo.pageName);

        // Preserve query parameters and hash
        const queryString = window.location.search;
        const hash = window.location.hash;
        const fullUrl = targetUrl + queryString + hash;

        console.log('🔄 Redirecting to:', fullUrl);

        // Perform the redirect
        window.location.replace(fullUrl);
    }

    /**
     * Monitor language switches and save preference
     */
    function monitorLanguageSwitches() {
        // Watch for clicks on language switcher
        document.addEventListener('click', function(e) {
            const target = e.target.closest('a');
            if (!target) return;

            const href = target.getAttribute('href');
            if (!href) return;

            // Check if this is a language switch link
            for (const lang of SUPPORTED_LANGUAGES) {
                if (href.includes(`/${lang}/`) || href.includes(`dist/${lang}/`)) {
                    saveLanguagePreference(lang);
                    console.log('🔄 Language switch detected:', lang);
                    break;
                }
            }
        });
    }

    /**
     * Initialize the language preference detection system
     */
    function initialize() {
        console.log('🌍 Language Preference Detector v1.0.0 initializing...');

        // Perform routing if needed
        performLanguageRouting();

        // Monitor for language switches
        monitorLanguageSwitches();

        // Expose API for other scripts
        window.LanguagePreference = {
            detect: detectUserLanguage,
            save: saveLanguagePreference,
            getCurrentLanguage: function() {
                const pageInfo = getCurrentPageInfo();
                if (pageInfo.hasLanguagePrefix) {
                    const lang = pageInfo.pathParts[0] === 'dist' ?
                        pageInfo.pathParts[1] : pageInfo.pathParts[0];
                    if (SUPPORTED_LANGUAGES.includes(lang)) {
                        return lang;
                    }
                }
                return detectUserLanguage();
            },
            getSupportedLanguages: () => SUPPORTED_LANGUAGES,
            clearPreference: () => {
                localStorage.removeItem(STORAGE_KEY);
                console.log('🗑️ Language preference cleared');
            }
        };

        console.log('✅ Language Preference Detector ready');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();