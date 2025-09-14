/**
 * Translations Configuration for AI Studio
 * This file contains all static translations for the site
 * Used as fallback when API is unavailable and for immediate display
 */

const TRANSLATIONS = {
  // Banner/Hero Section
  banner: {
    subtitle: {
      en: "Expert-Led Learning",
      he: "למידה בהובלת מומחים",
      ru: "Обучение под руководством экспертов"
    },
    heading: {
      en: "Unlock Potential With Proven Courses.",
      he: "שלטון ב-AI וטכנולוגיה",
      ru: "Раскройте потенциал с проверенными курсами."
    },
    description: {
      en: "Here you can elevate your tech career with expert-led courses. whether you're just starting out or aiming to advance your skills, our hands-on, practical training is designed.",
      he: "כאן תוכלו לקדם את הקריירה הטכנולוגית שלכם עם קורסים בהנחיית מומחים. בין אם אתם רק מתחילים או שואפים לשפר את כישוריכם, ההכשרה המעשית שלנו מתוכננת במיוחד.",
      ru: "Здесь вы можете поднять свою карьеру в технологиях с помощью курсов под руководством экспертов. Независимо от того, только начинаете или стремитесь улучшить свои навыки, наше практическое обучение разработано специально."
    }
  },

  // Navigation
  navigation: {
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
      he: "מרצים",
      ru: "Преподаватели"
    },
    careerServices: {
      en: "Career Services",
      he: "שירותי קריירה",
      ru: "Карьерные услуги"
    },
    careerOrientation: {
      en: "Career Orientation",
      he: "הכוונה תעסוקתית",
      ru: "Профориентация"
    },
    careerCenter: {
      en: "Career Center",
      he: "מרכז קריירה",
      ru: "Карьерный центр"
    },
    pricing: {
      en: "Pricing",
      he: "מחירון",
      ru: "Цены"
    },
    blog: {
      en: "Blog",
      he: "בלוג",
      ru: "Блог"
    }
  },

  // Buttons & CTAs
  buttons: {
    signUpToday: {
      en: "Sign Up Today",
      he: "הרשמה היום",
      ru: "Зарегистрироваться сегодня"
    },
    learnMore: {
      en: "Learn More",
      he: "למידע נוסף",
      ru: "Узнать больше"
    },
    getStarted: {
      en: "Get Started",
      he: "התחל עכשיו",
      ru: "Начать"
    },
    contactUs: {
      en: "Contact Us",
      he: "צור קשר",
      ru: "Связаться с нами"
    },
    enrollNow: {
      en: "Enroll Now",
      he: "הרשם עכשיו",
      ru: "Записаться сейчас"
    }
  },

  // Section Titles
  sections: {
    featuredCourses: {
      title: {
        en: "Most Popular IT Courses To Advance Your Career.",
        he: "הקורסים הפופולריים ביותר בתחום ה-IT לקידום הקריירה שלך.",
        ru: "Самые популярные IT-курсы для продвижения вашей карьеры."
      },
      subtitle: {
        en: "Most Popular IT Courses",
        he: "הקורסים הפופולריים ביותר",
        ru: "Самые популярные IT-курсы"
      },
      description: {
        en: "Dive into our expertly curated selection of featured courses, designed to equip you with the skills and knowledge needed to excel.",
        he: "צללו למבחר הקורסים המובחרים שלנו, שנאספו בקפידה על ידי מומחים ונועדו להקנות לכם את הכישורים והידע הדרושים להצטיין.",
        ru: "Погрузитесь в наш экспертно подобранный выбор рекомендуемых курсов, разработанных для того, чтобы дать вам навыки и знания, необходимые для успеха."
      }
    },
    testimonials: {
      title: {
        en: "Student Success Stories",
        he: "סיפורי הצלחה של סטודנטים",
        ru: "Истории успеха студентов"
      },
      subtitle: {
        en: "What Our Students Say",
        he: "מה הסטודנטים שלנו אומרים",
        ru: "Что говорят наши студенты"
      }
    },
    faq: {
      title: {
        en: "Frequently Asked Questions",
        he: "שאלות נפוצות",
        ru: "Часто задаваемые вопросы"
      },
      subtitle: {
        en: "Got Questions? We've Got Answers",
        he: "יש לכם שאלות? יש לנו תשובות",
        ru: "Есть вопросы? У нас есть ответы"
      }
    }
  },

  // Footer
  footer: {
    copyright: {
      en: "© 2024 AI Studio. All rights reserved.",
      he: "© 2024 AI Studio. כל הזכויות שמורות.",
      ru: "© 2024 AI Studio. Все права защищены."
    },
    privacyPolicy: {
      en: "Privacy Policy",
      he: "מדיניות פרטיות",
      ru: "Политика конфиденциальности"
    },
    termsOfService: {
      en: "Terms of Service",
      he: "תנאי שימוש",
      ru: "Условия использования"
    }
  }
};

/**
 * Helper function to get translation by key and language
 * @param {string} key - Translation key (e.g., 'banner.subtitle')
 * @param {string} lang - Language code (en, he, ru)
 * @returns {string} - Translated text or fallback to English
 */
function getTranslation(key, lang = 'en') {
  const keys = key.split('.');
  let translation = TRANSLATIONS;

  for (const k of keys) {
    if (translation[k]) {
      translation = translation[k];
    } else {
      console.warn(`Translation key not found: ${key}`);
      return '';
    }
  }

  // Return the translation for the specified language, fallback to English
  return translation[lang] || translation['en'] || '';
}

/**
 * Apply translations to DOM elements with data-translate attribute
 * @param {string} lang - Language code to apply
 */
function applyTranslations(lang = 'en') {
  const elements = document.querySelectorAll('[data-translate]');

  elements.forEach(element => {
    const key = element.getAttribute('data-translate');
    const translation = getTranslation(key, lang);

    if (translation) {
      element.textContent = translation;
    }
  });

  console.log(`✅ Applied ${lang} translations to ${elements.length} elements`);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TRANSLATIONS, getTranslation, applyTranslations };
}