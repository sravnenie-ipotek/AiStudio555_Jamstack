/**
 * Course Filters Translation Handler
 * Ensures course filter buttons are properly translated
 * Fixes the issue where course filter data-i18n attributes don't get translated
 */

(function() {
    'use strict';

    const filterTranslations = {
        'ru': {
            'featured_courses.content.content.filters.all': 'Все',
            'featured_courses.content.content.filters.web_dev': 'Веб-разработка',
            'featured_courses.content.content.filters.mobile_dev': 'Разработка Приложений',
            'featured_courses.content.content.filters.machine_learning': 'Машинное Обучение',
            'featured_courses.content.content.filters.cloud': 'Облачные Вычисления'
        },
        'he': {
            'featured_courses.content.content.filters.all': 'הכל',
            'featured_courses.content.content.filters.web_dev': 'פיתוח אתרים',
            'featured_courses.content.content.filters.mobile_dev': 'פיתוח אפליקציות',
            'featured_courses.content.content.filters.machine_learning': 'למידת מכונה',
            'featured_courses.content.content.filters.cloud': 'מחשוב ענן'
        },
        'en': {
            'featured_courses.content.content.filters.all': 'All',
            'featured_courses.content.content.filters.web_dev': 'Web Development',
            'featured_courses.content.content.filters.mobile_dev': 'App Development',
            'featured_courses.content.content.filters.machine_learning': 'Machine Learning',
            'featured_courses.content.content.filters.cloud': 'Cloud Computing'
        }
    };

    function translateCourseFilters(locale = 'en') {
        console.log(`🎯 [COURSE-FILTERS] Translating to: ${locale}`);

        const filterButtons = document.querySelectorAll('.featured-courses-tab-link div[data-i18n]');
        let translatedCount = 0;

        filterButtons.forEach(button => {
            const i18nPath = button.getAttribute('data-i18n');

            if (i18nPath && filterTranslations[locale] && filterTranslations[locale][i18nPath]) {
                const newText = filterTranslations[locale][i18nPath];
                const oldText = button.textContent.trim();

                if (oldText !== newText) {
                    button.textContent = newText;
                    translatedCount++;
                    console.log(`📝 [COURSE-FILTERS] "${oldText}" → "${newText}"`);
                }
            }
        });

        console.log(`✅ [COURSE-FILTERS] Translated ${translatedCount} filter buttons to ${locale}`);
        return translatedCount;
    }

    function getCurrentLocale() {
        // Get locale from URL params, localStorage, or default to 'en'
        const urlParams = new URLSearchParams(window.location.search);
        const urlLocale = urlParams.get('locale') || urlParams.get('lang');
        const savedLocale = localStorage.getItem('preferred_locale');
        return urlLocale || savedLocale || 'en';
    }

    function initCourseFiltersTranslation() {
        console.log('🚀 [COURSE-FILTERS] Initializing course filter translations...');

        // Translate to current locale
        const currentLocale = getCurrentLocale();
        translateCourseFilters(currentLocale);

        // Listen for language changes
        document.addEventListener('click', (e) => {
            const langPill = e.target.closest('.lang-pill');
            if (langPill) {
                const targetLang = langPill.textContent.trim().toLowerCase();
                let locale = 'en';

                if (targetLang === 'ru') locale = 'ru';
                else if (targetLang === 'he') locale = 'he';

                // Delay translation to ensure other systems have processed the language change
                setTimeout(() => {
                    translateCourseFilters(locale);
                }, 100);
            }
        });

        // Listen for custom language change events from unified language manager
        document.addEventListener('languageChanged', (e) => {
            if (e.detail && e.detail.locale) {
                setTimeout(() => {
                    translateCourseFilters(e.detail.locale);
                }, 100);
            }
        });

        console.log('✅ [COURSE-FILTERS] Course filter translation system ready');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCourseFiltersTranslation);
    } else {
        initCourseFiltersTranslation();
    }

    // Expose for manual use
    window.translateCourseFilters = translateCourseFilters;

})();