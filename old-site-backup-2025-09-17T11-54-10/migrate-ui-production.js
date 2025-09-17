// ULTRATHINK: Production migration via API call
// This script calls a special migration endpoint on the production server

const https = require('https');

const PRODUCTION_API = 'https://aistudio555jamstack-production.up.railway.app';

console.log('🚀 ULTRATHINK Production UI Migration');
console.log('📍 Target: ' + PRODUCTION_API);

// Create the migration payload
const migrationData = {
  action: 'migrate_ui_fields',
  fields: {
    // Navigation Menu Labels
    nav_home: { en: 'Home', ru: 'Главная', he: 'בית' },
    nav_courses: { en: 'Courses', ru: 'Курсы', he: 'קורסים' },
    nav_teachers: { en: 'Teachers', ru: 'Преподаватели', he: 'מורים' },
    nav_blog: { en: 'Blog', ru: 'Блог', he: 'בלוג' },
    nav_career_center: { en: 'Career Center', ru: 'Карьерный центр', he: 'מרכז קריירה' },
    nav_about: { en: 'About Us', ru: 'О нас', he: 'אודות' },
    nav_contact: { en: 'Contact', ru: 'Контакты', he: 'צור קשר' },
    nav_pricing: { en: 'Pricing Plans', ru: 'Тарифы', he: 'תוכניות מחיר' },
    
    // Button Texts/CTAs
    btn_sign_up_today: { en: 'Sign Up Today', ru: 'Записаться сегодня', he: 'הרשם היום' },
    btn_learn_more: { en: 'Learn More', ru: 'Узнать больше', he: 'למד עוד' },
    btn_view_all_courses: { en: 'View All Courses', ru: 'Все курсы', he: 'כל הקורסים' },
    btn_get_started: { en: 'Get Started', ru: 'Начать', he: 'התחל' },
    btn_contact_us: { en: 'Contact Us', ru: 'Связаться с нами', he: 'צור קשר' },
    btn_enroll_now: { en: 'Enroll Now', ru: 'Записаться сейчас', he: 'הרשם עכשיו' },
    btn_start_learning: { en: 'Start Learning', ru: 'Начать обучение', he: 'התחל ללמוד' },
    btn_explore_courses: { en: 'Explore Courses', ru: 'Изучить курсы', he: 'חקור קורסים' },
    btn_view_details: { en: 'View Details', ru: 'Подробнее', he: 'פרטים נוספים' },
    btn_book_consultation: { en: 'Book Consultation', ru: 'Записаться на консультацию', he: 'קבע ייעוץ' },
    btn_download_brochure: { en: 'Download Brochure', ru: 'Скачать брошюру', he: 'הורד חוברת' },
    btn_watch_demo: { en: 'Watch Demo', ru: 'Смотреть демо', he: 'צפה בדמו' },
    btn_free_trial: { en: 'Start Free Trial', ru: 'Начать бесплатно', he: 'התחל תקופת ניסיון' },
    
    // Form Labels
    form_label_email: { en: 'Email', ru: 'Email', he: 'אימייל' },
    form_label_name: { en: 'Name', ru: 'Имя', he: 'שם' },
    form_label_phone: { en: 'Phone', ru: 'Телефон', he: 'טלפון' },
    form_label_message: { en: 'Message', ru: 'Сообщение', he: 'הודעה' },
    form_label_subject: { en: 'Subject', ru: 'Тема', he: 'נושא' },
    form_placeholder_email: { en: 'Enter your email', ru: 'Введите ваш email', he: 'הזן אימייל' },
    form_placeholder_name: { en: 'Enter your name', ru: 'Введите ваше имя', he: 'הזן שם' },
    form_placeholder_phone: { en: 'Enter your phone', ru: 'Введите ваш телефон', he: 'הזן טלפון' },
    form_placeholder_message: { en: 'Enter your message', ru: 'Введите ваше сообщение', he: 'הזן הודעה' },
    form_btn_submit: { en: 'Submit', ru: 'Отправить', he: 'שלח' },
    form_btn_subscribe: { en: 'Subscribe', ru: 'Подписаться', he: 'הירשם' },
    form_btn_send: { en: 'Send Message', ru: 'Отправить сообщение', he: 'שלח הודעה' },
    
    // Statistics Labels
    stats_courses_label: { en: 'Courses', ru: 'Курсов', he: 'קורסים' },
    stats_learners_label: { en: 'Learners', ru: 'Студентов', he: 'תלמידים' },
    stats_years_label: { en: 'Years', ru: 'Лет опыта', he: 'שנים' },
    stats_success_rate_label: { en: 'Success Rate', ru: 'Успешность', he: 'אחוז הצלחה' },
    stats_countries_label: { en: 'Countries', ru: 'Стран', he: 'מדינות' },
    stats_instructors_label: { en: 'Expert Instructors', ru: 'Преподавателей', he: 'מדריכים מומחים' },
    stats_courses_number: { en: '125+', ru: '125+', he: '125+' },
    stats_learners_number: { en: '14,000+', ru: '14 000+', he: '14,000+' },
    stats_years_number: { en: '10+', ru: '10+', he: '10+' },
    stats_success_rate_number: { en: '95%', ru: '95%', he: '95%' },
    stats_countries_number: { en: '45+', ru: '45+', he: '45+' },
    stats_instructors_number: { en: '200+', ru: '200+', he: '200+' },
    
    // System Messages
    msg_loading: { en: 'Loading...', ru: 'Загрузка...', he: 'טוען...' },
    msg_error: { en: 'An error occurred. Please try again.', ru: 'Произошла ошибка. Попробуйте снова.', he: 'אירעה שגיאה. נסה שוב.' },
    msg_success: { en: 'Success!', ru: 'Успешно!', he: 'הצלחה!' },
    msg_form_success: { en: 'Thank you! We will contact you soon.', ru: 'Спасибо! Мы свяжемся с вами в ближайшее время.', he: 'תודה! ניצור קשר בקרוב.' },
    msg_subscribe_success: { en: 'Successfully subscribed to newsletter!', ru: 'Вы успешно подписались на рассылку!', he: 'נרשמת בהצלחה לניוזלטר!' },
    msg_no_courses: { en: 'No courses available at the moment', ru: 'В данный момент курсы недоступны', he: 'אין קורסים זמינים כרגע' },
    msg_coming_soon: { en: 'Coming Soon', ru: 'Скоро', he: 'בקרוב' },
    msg_enrollment_closed: { en: 'Enrollment Closed', ru: 'Регистрация закрыта', he: 'ההרשמה סגורה' },
    msg_limited_seats: { en: 'Limited Seats Available', ru: 'Осталось мало мест', he: 'מקומות מוגבלים' },
    
    // Additional UI Elements
    ui_search_placeholder: { en: 'Search courses...', ru: 'Поиск курсов...', he: 'חיפוש קורסים...' },
    ui_filter_all: { en: 'All', ru: 'Все', he: 'הכל' },
    ui_sort_by: { en: 'Sort By', ru: 'Сортировать', he: 'מיין לפי' },
    ui_view_mode: { en: 'View', ru: 'Вид', he: 'תצוגה' },
    ui_grid_view: { en: 'Grid', ru: 'Сетка', he: 'רשת' },
    ui_list_view: { en: 'List', ru: 'Список', he: 'רשימה' },
    ui_read_more: { en: 'Read More', ru: 'Читать далее', he: 'קרא עוד' },
    ui_show_less: { en: 'Show Less', ru: 'Свернуть', he: 'הצג פחות' },
    ui_back_to_top: { en: 'Back to Top', ru: 'Наверх', he: 'חזרה למעלה' },
    ui_share: { en: 'Share', ru: 'Поделиться', he: 'שתף' },
    ui_print: { en: 'Print', ru: 'Печать', he: 'הדפס' }
  }
};

// Make API call to trigger migration
const postData = JSON.stringify(migrationData);

const options = {
  hostname: 'aistudio555jamstack-production.up.railway.app',
  path: '/api/migrate-ui',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
    'X-Migration-Token': 'ultrathink-2024' // Simple auth token
  }
};

console.log('\n📡 Sending migration request...');

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('✅ Migration successful!');
      try {
        const response = JSON.parse(data);
        console.log('\n📊 Migration Results:');
        console.log(response);
      } catch (e) {
        console.log('Response:', data);
      }
    } else {
      console.error(`❌ Migration failed with status ${res.statusCode}`);
      console.error('Response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', error.message);
});

req.write(postData);
req.end();

console.log('\n⏳ Waiting for response...');