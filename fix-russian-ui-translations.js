#!/usr/bin/env node

/**
 * URGENT FIX: Update Russian UI translations in production database
 * This script directly updates the home_pages table with proper Russian UI translations
 */

const { Pool } = require('pg');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:Thinkpad123@junction.proxy.rlwy.net:48608/railway',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Complete Russian UI translations
const RUSSIAN_UI_TRANSLATIONS = {
  navHome: 'Главная',
  navCourses: 'Курсы',
  navTeachers: 'Преподаватели', 
  navBlog: 'Блог',
  navCareerCenter: 'Карьерный центр',
  navAbout: 'О нас',
  navContact: 'Контакты',
  navPricing: 'Тарифы',
  btnSignUpToday: 'Записаться сегодня',
  btnLearnMore: 'Узнать больше',
  btnViewAllCourses: 'Посмотреть все курсы',
  btnGetStarted: 'Начать',
  btnContactUs: 'Связаться с нами',
  btnEnrollNow: 'Записаться сейчас',
  btnStartLearning: 'Начать обучение',
  btnExploreCourses: 'Изучить курсы',
  btnViewDetails: 'Подробнее',
  btnBookConsultation: 'Записаться на консультацию',
  btnDownloadBrochure: 'Скачать брошюру',
  btnWatchDemo: 'Посмотреть демо',
  btnFreeTrial: 'Бесплатная пробная версия',
  formLabelEmail: 'Электронная почта',
  formLabelName: 'Имя',
  formLabelPhone: 'Телефон',
  formLabelMessage: 'Сообщение',
  formLabelSubject: 'Тема',
  formPlaceholderEmail: 'Введите ваш email',
  formPlaceholderName: 'Введите ваше имя',
  formPlaceholderPhone: 'Введите ваш телефон',
  formPlaceholderMessage: 'Введите ваше сообщение',
  formBtnSubmit: 'Отправить',
  formBtnSubscribe: 'Подписаться',
  formBtnSend: 'Отправить сообщение',
  statsCoursesLabel: 'Курсы',
  statsLearnersLabel: 'Студенты',
  statsYearsLabel: 'Лет',
  statsSuccessRateLabel: 'Успеха',
  statsCountriesLabel: 'Страны',
  statsInstructorsLabel: 'Экспертов',
  msgLoading: 'Загрузка...',
  msgError: 'Произошла ошибка. Попробуйте еще раз.',
  msgSuccess: 'Успех!',
  msgFormSuccess: 'Спасибо! Мы свяжемся с вами в ближайшее время.',
  msgSubscribeSuccess: 'Успешно подписались на рассылку!',
  msgNoCourses: 'Курсы в данный момент недоступны',
  msgComingSoon: 'Скоро',
  msgEnrollmentClosed: 'Запись закрыта',
  msgLimitedSeats: 'Ограниченное количество мест',
  uiSearchPlaceholder: 'Поиск курсов...',
  uiFilterAll: 'Все',
  uiSortBy: 'Сортировать по',
  uiViewMode: 'Вид',
  uiGridView: 'Сетка',
  uiListView: 'Список',
  uiReadMore: 'Читать далее',
  uiShowLess: 'Скрыть',
  uiBackToTop: 'Наверх',
  uiShare: 'Поделиться',
  uiPrint: 'Печать'
};

async function updateRussianUITranslations() {
  try {
    console.log('🔄 Updating Russian UI translations...');
    
    // Build the SET clause dynamically
    const setClauses = [];
    const values = [];
    let paramIndex = 1;
    
    for (const [field, value] of Object.entries(RUSSIAN_UI_TRANSLATIONS)) {
      setClauses.push(`${field.toLowerCase().replace(/([A-Z])/g, '_$1')} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }
    
    const query = `
      UPDATE home_pages 
      SET ${setClauses.join(', ')}, 
          updated_at = CURRENT_TIMESTAMP
      WHERE locale = 'ru'
    `;
    
    console.log('Executing query with', values.length, 'parameters...');
    
    const result = await pool.query(query, values);
    
    if (result.rowCount > 0) {
      console.log('✅ Successfully updated Russian UI translations!');
      console.log('Rows affected:', result.rowCount);
      
      // Verify the update
      const verifyQuery = `
        SELECT nav_home, btn_sign_up_today, nav_courses 
        FROM home_pages 
        WHERE locale = 'ru'
      `;
      
      const verifyResult = await pool.query(verifyQuery);
      if (verifyResult.rows.length > 0) {
        console.log('🔍 Verification - Sample Russian translations:');
        console.log('nav_home:', verifyResult.rows[0].nav_home);
        console.log('btn_sign_up_today:', verifyResult.rows[0].btn_sign_up_today);
        console.log('nav_courses:', verifyResult.rows[0].nav_courses);
      }
      
    } else {
      console.log('⚠️ No rows were updated. Russian home page record may not exist.');
    }
    
  } catch (error) {
    console.error('❌ Error updating Russian UI translations:', error);
  }
}

async function main() {
  try {
    await updateRussianUITranslations();
  } catch (error) {
    console.error('❌ Script failed:', error);
  } finally {
    await pool.end();
  }
}

main();