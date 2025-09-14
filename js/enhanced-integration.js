/**
 * Enhanced Integration for AI Studio
 * Hybrid approach: Static translations + Dynamic API content
 * Works for both local and production environments
 */

class EnhancedIntegration {
    constructor() {
        // Environment detection
        this.isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        this.API_BASE = this.isLocal
            ? 'http://localhost:3000/api'
            : 'https://aistudio555jamstack-production.up.railway.app/api';

        // Language detection
        this.currentLanguage = this.detectLanguage();

        // Load translations config
        this.loadTranslationsConfig();

        console.log('🚀 Enhanced Integration initialized');
        console.log(`📍 Environment: ${this.isLocal ? 'LOCAL' : 'PRODUCTION'}`);
        console.log(`🌍 Language: ${this.currentLanguage}`);
        console.log(`🔗 API: ${this.API_BASE}`);
    }

    detectLanguage() {
        // Check URL path for language folder
        const pathParts = window.location.pathname.split('/').filter(p => p);
        const pathLang = pathParts.find(part => ['en', 'ru', 'he'].includes(part));

        if (pathLang) {
            localStorage.setItem('preferredLanguage', pathLang);
            return pathLang;
        }

        // Check localStorage
        const storedLang = localStorage.getItem('preferredLanguage');
        if (storedLang && ['en', 'ru', 'he'].includes(storedLang)) {
            return storedLang;
        }

        // Default to English
        return 'en';
    }

    loadTranslationsConfig() {
        // Load the translations configuration
        const script = document.createElement('script');
        script.src = '/js/translations-config.js';
        script.onload = () => {
            console.log('✅ Translations config loaded');
            this.applyStaticTranslations();
        };
        document.head.appendChild(script);
    }

    applyStaticTranslations() {
        // Apply static translations immediately for better UX
        const lang = this.currentLanguage;

        // Banner section
        const bannerSubtitle = document.querySelector('.banner-subtitle');
        const bannerHeading = document.querySelector('.banner-heading');
        const bannerDescription = document.querySelector('.banner-description-text');

        if (typeof TRANSLATIONS !== 'undefined') {
            // Apply banner translations
            if (bannerSubtitle) {
                bannerSubtitle.textContent = TRANSLATIONS.banner.subtitle[lang] || TRANSLATIONS.banner.subtitle.en;
            }
            if (bannerHeading) {
                bannerHeading.textContent = TRANSLATIONS.banner.title[lang] || TRANSLATIONS.banner.title.en;
            }
            if (bannerDescription) {
                bannerDescription.textContent = TRANSLATIONS.banner.description[lang] || TRANSLATIONS.banner.description.en;
            }

            // Apply navigation translations
            this.applyNavigationTranslations(lang);

            // Apply button translations
            this.applyButtonTranslations(lang);

            console.log(`✅ Static translations applied for ${lang}`);
        }
    }

    applyNavigationTranslations(lang) {
        // Navigation links
        const navMappings = {
            'Home': TRANSLATIONS.nav.home[lang],
            'Courses': TRANSLATIONS.nav.courses[lang],
            'Teachers': TRANSLATIONS.nav.teachers[lang],
            'Career Services': TRANSLATIONS.nav.careerServices[lang],
            'Career Orientation': TRANSLATIONS.nav.careerOrientation[lang],
            'Career Center': TRANSLATIONS.nav.careerCenter[lang],
            'Pricing': TRANSLATIONS.nav.pricing[lang],
            'Blog': TRANSLATIONS.nav.blog ? TRANSLATIONS.nav.blog[lang] : 'Blog'
        };

        // Update nav links
        document.querySelectorAll('.nav-link, .dropdown-toggle-text-block, .dropdown-menu-text-link-block div').forEach(link => {
            const text = link.textContent.trim();
            if (navMappings[text]) {
                link.textContent = navMappings[text];
            }
        });
    }

    applyButtonTranslations(lang) {
        // Sign Up buttons
        document.querySelectorAll('.primary-button-text-block').forEach(button => {
            if (button.textContent.includes('Sign Up')) {
                button.textContent = TRANSLATIONS.buttons.signUpToday[lang] || TRANSLATIONS.buttons.signUpToday.en;
            }
        });
    }

    async initialize() {
        try {
            // Apply static translations first (immediate)
            this.applyStaticTranslations();

            // Then try to load dynamic content from API
            const apiAvailable = await this.checkAPIStatus();

            if (apiAvailable) {
                await this.loadDynamicContent();
            } else {
                console.log('⚠️ API not available, using static translations only');
            }

            // Set up language switcher
            this.setupLanguageSwitcher();

            return true;
        } catch (error) {
            console.error('❌ Integration error:', error);
            return false;
        }
    }

    async checkAPIStatus() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

            const response = await fetch(`${this.API_BASE}/status`, {
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                console.log('✅ API is available');
                return true;
            }
        } catch (error) {
            console.log('⚠️ API check failed:', error.message);
        }
        return false;
    }

    async loadDynamicContent() {
        const currentPath = window.location.pathname;
        const pageName = currentPath.split('/').pop()?.replace('.html', '') || 'home';

        console.log(`🔄 Loading dynamic content for: ${pageName}`);

        try {
            switch (pageName) {
                case 'home':
                case 'index':
                    await this.loadHomeContent();
                    break;
                case 'courses':
                    await this.loadCoursesContent();
                    break;
                case 'teachers':
                    await this.loadTeachersContent();
                    break;
                default:
                    console.log(`ℹ️ No dynamic loader for: ${pageName}`);
            }
        } catch (error) {
            console.error('❌ Failed to load dynamic content:', error);
        }
    }

    async loadHomeContent() {
        try {
            const response = await fetch(`${this.API_BASE}/home-page?locale=${this.currentLanguage}`);
            if (!response.ok) throw new Error('Failed to fetch home content');

            const data = await response.json();

            if (data.hero) {
                this.updateHomeHero(data.hero);
            }

            console.log('✅ Dynamic home content loaded');
        } catch (error) {
            console.log('⚠️ Using static content for home page');
        }
    }

    updateHomeHero(heroData) {
        if (!heroData) return;

        // Update with correct selectors
        const bannerSubtitle = document.querySelector('.banner-subtitle');
        const bannerHeading = document.querySelector('.banner-heading, h1.banner-heading');
        const bannerDescription = document.querySelector('.banner-description-text, p.banner-description-text');

        if (bannerSubtitle && heroData.subtitle) {
            bannerSubtitle.textContent = heroData.subtitle;
        }

        if (bannerHeading && heroData.title) {
            bannerHeading.textContent = heroData.title;
        }

        if (bannerDescription && heroData.description) {
            bannerDescription.textContent = heroData.description;
        }

        console.log('✅ Hero section updated from API');
    }

    async loadCoursesContent() {
        try {
            const response = await fetch(`${this.API_BASE}/courses?locale=${this.currentLanguage}`);
            if (!response.ok) throw new Error('Failed to fetch courses');

            const data = await response.json();

            if (data.data && data.data.length > 0) {
                this.updateCoursesGrid(data.data);
                console.log(`✅ Loaded ${data.data.length} courses from API`);
            }
        } catch (error) {
            console.log('⚠️ Using static courses content');
        }
    }

    async loadTeachersContent() {
        try {
            const response = await fetch(`${this.API_BASE}/teachers?locale=${this.currentLanguage}`);
            if (!response.ok) throw new Error('Failed to fetch teachers');

            const data = await response.json();

            if (data.data && data.data.length > 0) {
                this.updateTeachersGrid(data.data);
                console.log(`✅ Loaded ${data.data.length} teachers from API`);
            }
        } catch (error) {
            console.log('⚠️ Using static teachers content');
        }
    }

    updateCoursesGrid(courses) {
        // Implementation for updating courses grid
        console.log('📚 Updating courses grid...');
    }

    updateTeachersGrid(teachers) {
        // Implementation for updating teachers grid
        console.log('👨‍🏫 Updating teachers grid...');
    }

    setupLanguageSwitcher() {
        // Listen for language change events
        document.addEventListener('languageChanged', (event) => {
            const newLang = event.detail.locale;
            console.log(`🌐 Language changed to: ${newLang}`);

            // Update current language
            this.currentLanguage = newLang;

            // Reapply translations
            this.applyStaticTranslations();

            // Reload dynamic content if API is available
            this.loadDynamicContent();
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.enhancedIntegration = new EnhancedIntegration();
        window.enhancedIntegration.initialize();
    });
} else {
    window.enhancedIntegration = new EnhancedIntegration();
    window.enhancedIntegration.initialize();
}