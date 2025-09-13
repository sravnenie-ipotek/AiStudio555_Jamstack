#!/usr/bin/env node

/**
 * COMPREHENSIVE TRANSLATION FIX
 * Adds all missing translation fields for Hebrew, Russian, and English
 */

const COMPLETE_TRANSLATIONS = {
  en: {
    // Navigation
    nav_home: "Home",
    nav_courses: "Courses",
    nav_teachers: "Teachers",
    nav_blog: "Blog",
    nav_career_center: "Career Center",
    nav_about: "About Us",
    nav_contact: "Contact",
    nav_pricing: "Pricing",
    
    // Hero Section - INCLUDING MISSING FIELD
    hero_expert_led: "Expert-Led Learning",
    hero_title: "Master AI and Technology",
    hero_subtitle: "Transform your career with expert-led courses",
    hero_description: "Here you can elevate your tech career with expert-led courses. Whether you're just starting out or aiming to advance your skills, our hands-on, practical training is designed for you.",
    
    // Buttons
    btn_sign_up_today: "Sign Up Today",
    btn_learn_more: "Learn More",
    btn_view_all_courses: "View All Courses",
    btn_get_started: "Get Started",
    btn_contact_us: "Contact Us",
    btn_enroll_now: "Enroll Now",
    btn_start_learning: "Start Learning",
    btn_explore_courses: "Explore Courses",
    
    // Section Titles
    featured_courses_title: "Featured Courses",
    featured_courses_subtitle: "Explore Our Most Popular Courses",
    about_title: "About AI Studio",
    about_subtitle: "Your Path to Success",
    testimonials_title: "Student Success Stories",
    testimonials_subtitle: "What Our Students Say",
    
    // Forms
    form_label_email: "Email",
    form_label_name: "Name",
    form_label_phone: "Phone",
    form_label_message: "Message",
    form_placeholder_email: "Enter your email",
    form_placeholder_name: "Enter your name",
    form_placeholder_phone: "Enter your phone",
    form_placeholder_message: "Enter your message",
    
    // Footer
    footer_copyright: "© 2025 AI Studio. All rights reserved",
    footer_privacy: "Privacy Policy",
    footer_terms: "Terms of Service",
    footer_contact_title: "Contact",
    footer_links_title: "Quick Links",
    footer_social_title: "Follow Us"
  },
  ru: {
    // Navigation
    nav_home: "Главная",
    nav_courses: "Курсы",
    nav_teachers: "Преподаватели",
    nav_blog: "Блог",
    nav_career_center: "Карьерный центр",
    nav_about: "О нас",
    nav_contact: "Контакты",
    nav_pricing: "Цены",
    
    // Hero Section - INCLUDING MISSING FIELD
    hero_expert_led: "Обучение с экспертами",
    hero_title: "Освойте ИИ и технологии",
    hero_subtitle: "Трансформируйте карьеру с курсами от экспертов",
    hero_description: "Здесь вы можете продвинуть свою IT-карьеру с курсами от экспертов. Независимо от того, только начинаете ли вы или хотите развить свои навыки, наше практическое обучение разработано для вас.",
    
    // Buttons
    btn_sign_up_today: "Записаться сегодня",
    btn_learn_more: "Узнать больше",
    btn_view_all_courses: "Посмотреть все курсы",
    btn_get_started: "Начать",
    btn_contact_us: "Связаться с нами",
    btn_enroll_now: "Записаться сейчас",
    btn_start_learning: "Начать обучение",
    btn_explore_courses: "Изучить курсы",
    
    // Section Titles
    featured_courses_title: "Популярные курсы",
    featured_courses_subtitle: "Изучите наши самые популярные курсы",
    about_title: "О AI Studio",
    about_subtitle: "Ваш путь к успеху",
    testimonials_title: "Истории успеха студентов",
    testimonials_subtitle: "Что говорят наши студенты",
    
    // Forms
    form_label_email: "Электронная почта",
    form_label_name: "Имя",
    form_label_phone: "Телефон",
    form_label_message: "Сообщение",
    form_placeholder_email: "Введите ваш email",
    form_placeholder_name: "Введите ваше имя",
    form_placeholder_phone: "Введите ваш телефон",
    form_placeholder_message: "Введите ваше сообщение",
    
    // Footer
    footer_copyright: "© 2025 AI Studio. Все права защищены",
    footer_privacy: "Политика конфиденциальности",
    footer_terms: "Условия использования",
    footer_contact_title: "Контакты",
    footer_links_title: "Быстрые ссылки",
    footer_social_title: "Мы в соцсетях"
  },
  he: {
    // Navigation
    nav_home: "בית",
    nav_courses: "קורסים",
    nav_teachers: "מורים",
    nav_blog: "בלוג",
    nav_career_center: "מרכז קריירה",
    nav_about: "אודות",
    nav_contact: "צור קשר",
    nav_pricing: "מחירים",
    
    // Hero Section - INCLUDING MISSING FIELD
    hero_expert_led: "למידה בהובלת מומחים",
    hero_title: "שלטו ב-AI וטכנולוגיה",
    hero_subtitle: "שנו את הקריירה שלכם עם קורסים מומחים",
    hero_description: "כאן תוכלו לקדם את הקריירה הטכנולוגית שלכם עם קורסים בהובלת מומחים. בין אם אתם רק מתחילים או שואפים לשפר את הכישורים שלכם, ההכשרה המעשית שלנו מיועדת עבורכם.",
    
    // Buttons
    btn_sign_up_today: "הירשמו היום",
    btn_learn_more: "למידע נוסף",
    btn_view_all_courses: "צפו בכל הקורסים",
    btn_get_started: "התחילו",
    btn_contact_us: "צרו קשר",
    btn_enroll_now: "הירשמו עכשיו",
    btn_start_learning: "התחילו ללמוד",
    btn_explore_courses: "גלו קורסים",
    
    // Section Titles
    featured_courses_title: "קורסים מובילים",
    featured_courses_subtitle: "גלו את הקורסים הפופולריים שלנו",
    about_title: "אודות AI Studio",
    about_subtitle: "הדרך שלכם להצלחה",
    testimonials_title: "סיפורי הצלחה של סטודנטים",
    testimonials_subtitle: "מה הסטודנטים שלנו אומרים",
    
    // Forms
    form_label_email: "אימייל",
    form_label_name: "שם",
    form_label_phone: "טלפון",
    form_label_message: "הודעה",
    form_placeholder_email: "הכניסו את האימייל שלכם",
    form_placeholder_name: "הכניסו את השם שלכם",
    form_placeholder_phone: "הכניסו את הטלפון שלכם",
    form_placeholder_message: "הכניסו את ההודעה שלכם",
    
    // Footer
    footer_copyright: "© 2025 AI Studio. כל הזכויות שמורות",
    footer_privacy: "מדיניות פרטיות",
    footer_terms: "תנאי שימוש",
    footer_contact_title: "צור קשר",
    footer_links_title: "קישורים מהירים",
    footer_social_title: "עקבו אחרינו"
  }
};

async function applyTranslations(locale, translations) {
  const API_URL = 'https://aistudio555jamstack-production.up.railway.app/api/force-all-translations';
  
  console.log(`\n🌐 Applying ${locale.toUpperCase()} translations...`);
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-migration-token': 'ultrathink-2024'
      },
      body: JSON.stringify({
        action: 'force_all_translations',
        locale: locale,
        translations: translations
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log(`✅ ${locale.toUpperCase()}: Successfully applied ${Object.keys(translations).length} translations`);
    } else {
      console.log(`❌ ${locale.toUpperCase()}: Failed - ${result.error || 'Unknown error'}`);
    }
    
    return result;
  } catch (error) {
    console.log(`❌ ${locale.toUpperCase()}: Error - ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function fixAllTranslations() {
  console.log('🔧 COMPREHENSIVE TRANSLATION FIX');
  console.log('=' .repeat(60));
  console.log('Adding all missing translation fields for all languages');
  
  // Apply translations for each language
  for (const [locale, translations] of Object.entries(COMPLETE_TRANSLATIONS)) {
    await applyTranslations(locale, translations);
  }
  
  console.log('\n' + '=' .repeat(60));
  console.log('📊 Verification:');
  
  // Verify the changes
  for (const locale of ['en', 'ru', 'he']) {
    const response = await fetch(`https://aistudio555jamstack-production.up.railway.app/api/home-page?locale=${locale}`);
    const data = await response.json();
    const attrs = data.data?.attributes || {};
    
    console.log(`\n${locale.toUpperCase()}:`);
    console.log(`  navHome: ${attrs.navHome || 'NOT FOUND'}`);
    console.log(`  heroExpertLed: ${attrs.heroExpertLed || 'NOT FOUND'}`);
    console.log(`  btnSignUpToday: ${attrs.btnSignUpToday || 'NOT FOUND'}`);
  }
  
  console.log('\n✅ Fix complete! All translations should now be in the database.');
  console.log('📝 Note: The API endpoint needs to be updated to return these new fields.');
}

fixAllTranslations().catch(console.error);