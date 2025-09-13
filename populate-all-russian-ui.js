#!/usr/bin/env node

/**
 * COMPREHENSIVE RUSSIAN UI TRANSLATION POPULATION
 * This script populates ALL UI fields with Russian translations via the API
 */

const COMPLETE_RUSSIAN_UI = {
  // Navigation
  navHome: { en: "Home", ru: "Главная" },
  navCourses: { en: "Courses", ru: "Курсы" },
  navTeachers: { en: "Teachers", ru: "Преподаватели" },
  navBlog: { en: "Blog", ru: "Блог" },
  navCareerCenter: { en: "Career Center", ru: "Карьерный центр" },
  navAbout: { en: "About Us", ru: "О нас" },
  navContact: { en: "Contact", ru: "Контакты" },
  navPricing: { en: "Pricing", ru: "Цены" },
  
  // Main Buttons
  btnSignUpToday: { en: "Sign Up Today", ru: "Записаться сегодня" },
  btnLearnMore: { en: "Learn More", ru: "Узнать больше" },
  btnViewAllCourses: { en: "View All Courses", ru: "Посмотреть все курсы" },
  btnGetStarted: { en: "Get Started", ru: "Начать" },
  btnContactUs: { en: "Contact Us", ru: "Связаться с нами" },
  btnEnrollNow: { en: "Enroll Now", ru: "Записаться сейчас" },
  btnStartLearning: { en: "Start Learning", ru: "Начать обучение" },
  btnExploreCourses: { en: "Explore Courses", ru: "Изучить курсы" },
  btnViewDetails: { en: "View Details", ru: "Подробнее" },
  btnBookConsultation: { en: "Book Consultation", ru: "Записаться на консультацию" },
  btnDownloadBrochure: { en: "Download Brochure", ru: "Скачать брошюру" },
  btnWatchDemo: { en: "Watch Demo", ru: "Посмотреть демо" },
  btnFreeTrial: { en: "Free Trial", ru: "Бесплатная версия" },
  
  // Form Labels  
  formLabelEmail: { en: "Email", ru: "Электронная почта" },
  formLabelName: { en: "Name", ru: "Имя" },
  formLabelPhone: { en: "Phone", ru: "Телефон" },
  formLabelMessage: { en: "Message", ru: "Сообщение" },
  formLabelSubject: { en: "Subject", ru: "Тема" },
  
  // Form Placeholders
  formPlaceholderEmail: { en: "Enter your email", ru: "Введите ваш email" },
  formPlaceholderName: { en: "Enter your name", ru: "Введите ваше имя" },
  formPlaceholderPhone: { en: "Enter your phone", ru: "Введите ваш телефон" },
  formPlaceholderMessage: { en: "Enter your message", ru: "Введите ваше сообщение" },
  
  // Form Buttons
  formBtnSubmit: { en: "Submit", ru: "Отправить" },
  formBtnSubscribe: { en: "Subscribe", ru: "Подписаться" },
  formBtnSend: { en: "Send Message", ru: "Отправить сообщение" },
  
  // Statistics Labels
  statsCoursesLabel: { en: "Courses", ru: "Курсы" },
  statsLearnersLabel: { en: "Learners", ru: "Студенты" },
  statsYearsLabel: { en: "Years", ru: "Лет опыта" },
  statsSuccessRateLabel: { en: "Success Rate", ru: "Успеха" },
  statsCountriesLabel: { en: "Countries", ru: "Страны" },
  statsInstructorsLabel: { en: "Expert Instructors", ru: "Экспертов" },
  
  // Statistics Numbers (keep same)
  statsCoursesNumber: { en: "125+", ru: "125+" },
  statsLearnersNumber: { en: "14,000+", ru: "14,000+" },
  statsYearsNumber: { en: "10+", ru: "10+" },
  statsSuccessRateNumber: { en: "95%", ru: "95%" },
  statsCountriesNumber: { en: "45+", ru: "45+" },
  statsInstructorsNumber: { en: "200+", ru: "200+" },
  
  // System Messages
  msgLoading: { en: "Loading...", ru: "Загрузка..." },
  msgError: { en: "An error occurred. Please try again.", ru: "Произошла ошибка. Попробуйте еще раз." },
  msgSuccess: { en: "Success!", ru: "Успех!" },
  msgFormSuccess: { en: "Thank you! We will contact you soon.", ru: "Спасибо! Мы свяжемся с вами в ближайшее время." },
  msgSubscribeSuccess: { en: "Successfully subscribed to newsletter!", ru: "Успешно подписались на рассылку!" },
  msgNoCourses: { en: "No courses available at the moment", ru: "Курсы в данный момент недоступны" },
  msgComingSoon: { en: "Coming Soon", ru: "Скоро" },
  msgEnrollmentClosed: { en: "Enrollment Closed", ru: "Запись закрыта" },
  msgLimitedSeats: { en: "Limited Seats Available", ru: "Ограниченное количество мест" },
  
  // UI Elements
  uiSearchPlaceholder: { en: "Search courses...", ru: "Поиск курсов..." },
  uiFilterAll: { en: "All", ru: "Все" },
  uiSortBy: { en: "Sort By", ru: "Сортировать по" },
  uiViewMode: { en: "View", ru: "Вид" },
  uiGridView: { en: "Grid", ru: "Сетка" },
  uiListView: { en: "List", ru: "Список" },
  uiReadMore: { en: "Read More", ru: "Читать далее" },
  uiShowLess: { en: "Show Less", ru: "Скрыть" },
  uiBackToTop: { en: "Back to Top", ru: "Наверх" },
  uiShare: { en: "Share", ru: "Поделиться" },
  uiPrint: { en: "Print", ru: "Печать" }
};

async function populateRussianUI() {
  const API_URL = 'https://aistudio555jamstack-production.up.railway.app/api/migrate-ui';
  
  console.log('🚀 Starting comprehensive Russian UI population...');
  console.log(`📊 Total fields to populate: ${Object.keys(COMPLETE_RUSSIAN_UI).length}`);
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-migration-token': 'ultrathink-2024'
      },
      body: JSON.stringify({
        action: 'migrate_ui_fields',
        fields: COMPLETE_RUSSIAN_UI
      })
    });
    
    const result = await response.json();
    
    if (response.ok && result.success) {
      console.log('✅ SUCCESS! Russian UI translations populated');
      console.log(`📊 Fields added/updated: ${result.fieldsAdded}`);
      
      // Verify by checking the API
      console.log('\n🔍 Verifying Russian translations...');
      const verifyResponse = await fetch('https://aistudio555jamstack-production.up.railway.app/api/home-page?locale=ru');
      const verifyData = await verifyResponse.json();
      
      if (verifyData.data && verifyData.data.attributes) {
        const attrs = verifyData.data.attributes;
        console.log('\n✅ Sample verification:');
        console.log(`  navHome: "${attrs.navHome}" (should be "Главная")`);
        console.log(`  navCourses: "${attrs.navCourses}" (should be "Курсы")`);
        console.log(`  btnSignUpToday: "${attrs.btnSignUpToday}" (should be "Записаться сегодня")`);
        
        const isRussian = attrs.navHome === 'Главная';
        if (isRussian) {
          console.log('\n🎉 RUSSIAN TRANSLATIONS ACTIVE!');
        } else {
          console.log('\n⚠️  Translations added but not yet showing as Russian');
        }
      }
      
    } else {
      console.error('❌ Migration failed:', result);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the script
populateRussianUI();