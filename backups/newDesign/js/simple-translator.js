/**
 * Simple Standalone Translation System for AI Studio
 * Works independently without API server dependency
 */

(function() {
    'use strict';

    // Simple Translation System
    window.simpleTranslator = {
        currentLocale: 'en',
        translations: {
            en: {
                'navigation.blog': 'Blog',
                'testimonials.author1.name': 'David Kim',
                'testimonials.author2.name': 'Tariq Ahmed',
                'testimonials.author3.name': 'Nadia Khan',
                'footer.company.zohacous': 'Zohacous'
            },
            ru: {
                'navigation.blog': 'Блог',
                'testimonials.author1.name': 'Давид Ким',
                'testimonials.author2.name': 'Тарик Ахмед',
                'testimonials.author3.name': 'Надия Хан',
                'footer.company.zohacous': 'Зохакус'
            },
            he: {
                'navigation.blog': 'בלוג',
                'testimonials.author1.name': 'דיוויד קים',
                'testimonials.author2.name': 'טאריק אחמד',
                'testimonials.author3.name': 'נדיה חאן',
                'footer.company.zohacous': 'זוהקוס'
            }
        },

        // Initialize the translator
        init() {
            // Get initial locale from URL, localStorage, or browser
            this.currentLocale = this.getInitialLocale();

            // Apply initial translations
            this.applyTranslations();

            // Update initial state
            this.updateLanguagePills(this.currentLocale);
            this.setDocumentAttributes(this.currentLocale);

            // Override the setActivePill function if it exists
            window.setActivePill = (element) => {
                const lang = element.textContent.toLowerCase();
                this.switchLanguage(lang);
            };

            console.log('✅ Simple Translator initialized for locale:', this.currentLocale);
        },

        // Get initial locale
        getInitialLocale() {
            // Priority: URL > localStorage > browser > default
            const urlParams = new URLSearchParams(window.location.search);
            const urlLocale = urlParams.get('locale');
            if (urlLocale && this.translations[urlLocale]) {
                return urlLocale;
            }

            const savedLocale = localStorage.getItem('preferred_locale');
            if (savedLocale && this.translations[savedLocale]) {
                return savedLocale;
            }

            const browserLocale = navigator.language.split('-')[0];
            if (this.translations[browserLocale]) {
                return browserLocale;
            }

            return 'en';
        },

        // Switch language
        switchLanguage(locale) {
            if (!this.translations[locale]) {
                console.warn(`Unsupported locale: ${locale}`);
                return;
            }

            console.log(`🌐 Switching to ${locale}`);
            this.currentLocale = locale;

            // Save preference
            localStorage.setItem('preferred_locale', locale);

            // Apply translations
            this.applyTranslations();

            // Update visual indicators
            this.updateLanguagePills(locale);

            // Set document attributes
            this.setDocumentAttributes(locale);

            // Update URL
            const url = new URL(window.location);
            url.searchParams.set('locale', locale);
            history.pushState({locale}, '', url);

            console.log(`✅ Language switched to ${locale}`);
        },

        // Apply translations to all data-i18n elements
        applyTranslations() {
            const elements = document.querySelectorAll('[data-i18n]');
            console.log(`🔄 Applying translations to ${elements.length} elements for locale: ${this.currentLocale}`);

            elements.forEach(element => {
                const key = element.getAttribute('data-i18n');
                const translation = this.translations[this.currentLocale]?.[key];

                if (translation) {
                    const oldText = element.textContent.trim();
                    element.textContent = translation;
                    console.log(`✅ ${key}: "${oldText}" → "${translation}"`);
                } else {
                    // Fallback to English if translation not found
                    const fallback = this.translations.en[key];
                    if (fallback && this.currentLocale !== 'en') {
                        element.textContent = fallback;
                        console.log(`⚠️ Using English fallback for ${key}: "${fallback}"`);
                    }
                }
            });
        },

        // Update language pill visual states
        updateLanguagePills(locale) {
            const pills = document.querySelectorAll('.lang-pill, .mobile-lang-pill');
            pills.forEach(pill => {
                const lang = pill.textContent.toLowerCase();
                if (lang === locale) {
                    pill.classList.add('active');
                } else {
                    pill.classList.remove('active');
                }
            });
        },

        // Set document attributes for RTL/LTR and language
        setDocumentAttributes(locale) {
            if (locale === 'he') {
                document.documentElement.setAttribute('dir', 'rtl');
                document.documentElement.setAttribute('lang', 'he');
            } else {
                document.documentElement.setAttribute('dir', 'ltr');
                document.documentElement.setAttribute('lang', locale);
            }
        }
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.simpleTranslator.init();
        });
    } else {
        window.simpleTranslator.init();
    }

    // Handle browser back/forward
    window.addEventListener('popstate', (e) => {
        if (e.state && e.state.locale) {
            window.simpleTranslator.switchLanguage(e.state.locale);
        }
    });

})();