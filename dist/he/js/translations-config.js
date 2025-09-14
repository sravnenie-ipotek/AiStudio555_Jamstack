/**
 * Translations Configuration for AI Studio
 * This file contains all static translations for the site
 * Used as fallback when API is unavailable and for immediate display
 */

// Use IIFE to prevent global scope pollution and duplicate declarations
(function() {
  'use strict';

  // Check if TRANSLATIONS already exists to prevent duplicate declaration
  if (typeof window.TRANSLATIONS !== 'undefined') {
    console.log('⚠️ TRANSLATIONS already defined, skipping re-declaration');
    return;
  }

  // Define TRANSLATIONS on window object
  window.TRANSLATIONS = {
    // Banner/Hero Section
    banner: {
      subtitle: {
        en: "Expert-Led Learning",
        he: "למידה בהובלת מומחים",
        ru: "Обучение под руководством экспертов"
      },
      title: {
        en: "Master AI Skills with Expert Guidance",
        he: "שלוט בכישורי AI עם הדרכת מומחים",
        ru: "Освойте навыки ИИ с экспертным руководством"
      },
      description: {
        en: "Transform your career with cutting-edge AI courses designed by industry leaders",
        he: "שנה את הקריירה שלך עם קורסי AI מתקדמים שעוצבו על ידי מובילי התעשייה",
        ru: "Преобразуйте свою карьеру с передовыми курсами ИИ от лидеров индустрии"
      },
      cta: {
        en: "Start Learning Today",
        he: "התחל ללמוד היום",
        ru: "Начните обучение сегодня"
      }
    },

    // Navigation
    nav: {
      home: {
        en: "Home",
        he: "בית",
        ru: "Главная"
      },
      courses: {
        en: "Courses",
        he: "קורסים",
        ru: "Курсы"
      },
      teachers: {
        en: "Teachers",
        he: "מורים",
        ru: "Преподаватели"
      },
      pricing: {
        en: "Pricing",
        he: "תמחור",
        ru: "Цены"
      },
      careerServices: {
        en: "Career Services",
        he: "שירותי קריירה",
        ru: "Карьерные услуги"
      },
      careerOrientation: {
        en: "Career Orientation",
        he: "כיוון קריירה",
        ru: "Карьерная ориентация"
      },
      careerCenter: {
        en: "Career Center",
        he: "מרכז קריירה",
        ru: "Карьерный центр"
      }
    },

    // Footer
    footer: {
      menu: {
        en: "Menu",
        he: "תפריט",
        ru: "Меню"
      },
      contact: {
        en: "Contact",
        he: "צור קשר",
        ru: "Контакты"
      },
      copyright: {
        en: "© Copyright - AI Studio",
        he: "© זכויות יוצרים - AI Studio",
        ru: "© Авторские права - AI Studio"
      },
      subscribe: {
        en: "Subscribe to Newsletter",
        he: "הירשם לניוזלטר",
        ru: "Подпишитесь на рассылку"
      }
    },

    // Common
    common: {
      learnMore: {
        en: "Learn More",
        he: "למד עוד",
        ru: "Узнать больше"
      },
      signUp: {
        en: "Sign Up Today",
        he: "הירשם היום",
        ru: "Зарегистрируйтесь сегодня"
      },
      getStarted: {
        en: "Get Started",
        he: "התחל",
        ru: "Начать"
      },
      viewAll: {
        en: "View All",
        he: "צפה בכל",
        ru: "Посмотреть все"
      }
    }
  };

  /**
   * Helper function to get translation by key and language
   * @param {string} key - Translation key (e.g., 'banner.subtitle')
   * @param {string} lang - Language code (en, he, ru)
   * @returns {string} - Translated text or fallback to English
   */
  window.getTranslation = function(key, lang = 'en') {
    const keys = key.split('.');
    let translation = window.TRANSLATIONS;

    for (const k of keys) {
      if (translation && translation[k]) {
        translation = translation[k];
      } else {
        return key; // Return key if translation not found
      }
    }

    // Return the translation for the specified language or fallback to English
    if (translation && typeof translation === 'object') {
      return translation[lang] || translation['en'] || key;
    }

    return translation || key;
  };

  /**
   * Apply translations to all elements with data-translate attribute
   * @param {string} lang - Language code (en, he, ru)
   */
  window.applyTranslations = function(lang = 'en') {
    const elements = document.querySelectorAll('[data-translate]');

    elements.forEach(element => {
      const key = element.getAttribute('data-translate');
      const translation = window.getTranslation(key, lang);

      if (translation && translation !== key) {
        element.textContent = translation;
      }
    });

    console.log(`✅ Applied ${lang} translations to ${elements.length} elements`);
  };

  // Export for use in other modules (Node.js compatibility)
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      TRANSLATIONS: window.TRANSLATIONS,
      getTranslation: window.getTranslation,
      applyTranslations: window.applyTranslations
    };
  }

})();