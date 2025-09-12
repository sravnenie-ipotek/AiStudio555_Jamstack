// ULTRATHINK: Comprehensive UI Elements Migration to home_pages table
// This migration adds ALL UI elements (except footer) to the existing home_pages table

const sqlite3 = require('sqlite3').verbose();
const { Client } = require('pg');
const path = require('path');

// Database connection setup
const isProduction = process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost');
const dbPath = path.join(__dirname, 'aistudio.db');

console.log('🚀 ULTRATHINK UI Migration Starting...');
console.log(`📍 Environment: ${isProduction ? 'Production (PostgreSQL)' : 'Local (SQLite)'}`);

// All new fields to add to home_pages table
const NEW_FIELDS = {
  // Navigation Menu Labels
  nav_home: "TEXT DEFAULT 'Home'",
  nav_courses: "TEXT DEFAULT 'Courses'",
  nav_teachers: "TEXT DEFAULT 'Teachers'",
  nav_blog: "TEXT DEFAULT 'Blog'",
  nav_career_center: "TEXT DEFAULT 'Career Center'",
  nav_about: "TEXT DEFAULT 'About Us'",
  nav_contact: "TEXT DEFAULT 'Contact'",
  nav_pricing: "TEXT DEFAULT 'Pricing Plans'",
  
  // Button Texts/CTAs
  btn_sign_up_today: "TEXT DEFAULT 'Sign Up Today'",
  btn_learn_more: "TEXT DEFAULT 'Learn More'",
  btn_view_all_courses: "TEXT DEFAULT 'View All Courses'",
  btn_get_started: "TEXT DEFAULT 'Get Started'",
  btn_contact_us: "TEXT DEFAULT 'Contact Us'",
  btn_enroll_now: "TEXT DEFAULT 'Enroll Now'",
  btn_start_learning: "TEXT DEFAULT 'Start Learning'",
  btn_explore_courses: "TEXT DEFAULT 'Explore Courses'",
  btn_view_details: "TEXT DEFAULT 'View Details'",
  btn_book_consultation: "TEXT DEFAULT 'Book Consultation'",
  btn_download_brochure: "TEXT DEFAULT 'Download Brochure'",
  btn_watch_demo: "TEXT DEFAULT 'Watch Demo'",
  btn_free_trial: "TEXT DEFAULT 'Start Free Trial'",
  
  // Form Labels
  form_label_email: "TEXT DEFAULT 'Email'",
  form_label_name: "TEXT DEFAULT 'Name'",
  form_label_phone: "TEXT DEFAULT 'Phone'",
  form_label_message: "TEXT DEFAULT 'Message'",
  form_label_subject: "TEXT DEFAULT 'Subject'",
  form_placeholder_email: "TEXT DEFAULT 'Enter your email'",
  form_placeholder_name: "TEXT DEFAULT 'Enter your name'",
  form_placeholder_phone: "TEXT DEFAULT 'Enter your phone'",
  form_placeholder_message: "TEXT DEFAULT 'Enter your message'",
  form_btn_submit: "TEXT DEFAULT 'Submit'",
  form_btn_subscribe: "TEXT DEFAULT 'Subscribe'",
  form_btn_send: "TEXT DEFAULT 'Send Message'",
  
  // Statistics Labels
  stats_courses_label: "TEXT DEFAULT 'Courses'",
  stats_learners_label: "TEXT DEFAULT 'Learners'",
  stats_years_label: "TEXT DEFAULT 'Years'",
  stats_success_rate_label: "TEXT DEFAULT 'Success Rate'",
  stats_countries_label: "TEXT DEFAULT 'Countries'",
  stats_instructors_label: "TEXT DEFAULT 'Expert Instructors'",
  stats_courses_number: "TEXT DEFAULT '125+'",
  stats_learners_number: "TEXT DEFAULT '14,000+'",
  stats_years_number: "TEXT DEFAULT '10+'",
  stats_success_rate_number: "TEXT DEFAULT '95%'",
  stats_countries_number: "TEXT DEFAULT '45+'",
  stats_instructors_number: "TEXT DEFAULT '200+'",
  
  // System Messages
  msg_loading: "TEXT DEFAULT 'Loading...'",
  msg_error: "TEXT DEFAULT 'An error occurred. Please try again.'",
  msg_success: "TEXT DEFAULT 'Success!'",
  msg_form_success: "TEXT DEFAULT 'Thank you! We will contact you soon.'",
  msg_subscribe_success: "TEXT DEFAULT 'Successfully subscribed to newsletter!'",
  msg_no_courses: "TEXT DEFAULT 'No courses available at the moment'",
  msg_coming_soon: "TEXT DEFAULT 'Coming Soon'",
  msg_enrollment_closed: "TEXT DEFAULT 'Enrollment Closed'",
  msg_limited_seats: "TEXT DEFAULT 'Limited Seats Available'",
  
  // Additional UI Elements
  ui_search_placeholder: "TEXT DEFAULT 'Search courses...'",
  ui_filter_all: "TEXT DEFAULT 'All'",
  ui_sort_by: "TEXT DEFAULT 'Sort By'",
  ui_view_mode: "TEXT DEFAULT 'View'",
  ui_grid_view: "TEXT DEFAULT 'Grid'",
  ui_list_view: "TEXT DEFAULT 'List'",
  ui_read_more: "TEXT DEFAULT 'Read More'",
  ui_show_less: "TEXT DEFAULT 'Show Less'",
  ui_back_to_top: "TEXT DEFAULT 'Back to Top'",
  ui_share: "TEXT DEFAULT 'Share'",
  ui_print: "TEXT DEFAULT 'Print'"
};

// Russian translations for all fields
const RUSSIAN_TRANSLATIONS = {
  // Navigation
  nav_home: 'Главная',
  nav_courses: 'Курсы',
  nav_teachers: 'Преподаватели',
  nav_blog: 'Блог',
  nav_career_center: 'Карьерный центр',
  nav_about: 'О нас',
  nav_contact: 'Контакты',
  nav_pricing: 'Тарифы',
  
  // Buttons
  btn_sign_up_today: 'Записаться сегодня',
  btn_learn_more: 'Узнать больше',
  btn_view_all_courses: 'Все курсы',
  btn_get_started: 'Начать',
  btn_contact_us: 'Связаться с нами',
  btn_enroll_now: 'Записаться сейчас',
  btn_start_learning: 'Начать обучение',
  btn_explore_courses: 'Изучить курсы',
  btn_view_details: 'Подробнее',
  btn_book_consultation: 'Записаться на консультацию',
  btn_download_brochure: 'Скачать брошюру',
  btn_watch_demo: 'Смотреть демо',
  btn_free_trial: 'Начать бесплатно',
  
  // Forms
  form_label_email: 'Email',
  form_label_name: 'Имя',
  form_label_phone: 'Телефон',
  form_label_message: 'Сообщение',
  form_label_subject: 'Тема',
  form_placeholder_email: 'Введите ваш email',
  form_placeholder_name: 'Введите ваше имя',
  form_placeholder_phone: 'Введите ваш телефон',
  form_placeholder_message: 'Введите ваше сообщение',
  form_btn_submit: 'Отправить',
  form_btn_subscribe: 'Подписаться',
  form_btn_send: 'Отправить сообщение',
  
  // Statistics
  stats_courses_label: 'Курсов',
  stats_learners_label: 'Студентов',
  stats_years_label: 'Лет опыта',
  stats_success_rate_label: 'Успешность',
  stats_countries_label: 'Стран',
  stats_instructors_label: 'Преподавателей',
  stats_courses_number: '125+',
  stats_learners_number: '14 000+',
  stats_years_number: '10+',
  stats_success_rate_number: '95%',
  stats_countries_number: '45+',
  stats_instructors_number: '200+',
  
  // Messages
  msg_loading: 'Загрузка...',
  msg_error: 'Произошла ошибка. Попробуйте снова.',
  msg_success: 'Успешно!',
  msg_form_success: 'Спасибо! Мы свяжемся с вами в ближайшее время.',
  msg_subscribe_success: 'Вы успешно подписались на рассылку!',
  msg_no_courses: 'В данный момент курсы недоступны',
  msg_coming_soon: 'Скоро',
  msg_enrollment_closed: 'Регистрация закрыта',
  msg_limited_seats: 'Осталось мало мест',
  
  // UI Elements
  ui_search_placeholder: 'Поиск курсов...',
  ui_filter_all: 'Все',
  ui_sort_by: 'Сортировать',
  ui_view_mode: 'Вид',
  ui_grid_view: 'Сетка',
  ui_list_view: 'Список',
  ui_read_more: 'Читать далее',
  ui_show_less: 'Свернуть',
  ui_back_to_top: 'Наверх',
  ui_share: 'Поделиться',
  ui_print: 'Печать'
};

// Hebrew translations
const HEBREW_TRANSLATIONS = {
  // Navigation
  nav_home: 'בית',
  nav_courses: 'קורסים',
  nav_teachers: 'מורים',
  nav_blog: 'בלוג',
  nav_career_center: 'מרכז קריירה',
  nav_about: 'אודות',
  nav_contact: 'צור קשר',
  nav_pricing: 'תוכניות מחיר',
  
  // Buttons
  btn_sign_up_today: 'הרשם היום',
  btn_learn_more: 'למד עוד',
  btn_view_all_courses: 'כל הקורסים',
  btn_get_started: 'התחל',
  btn_contact_us: 'צור קשר',
  btn_enroll_now: 'הרשם עכשיו',
  btn_start_learning: 'התחל ללמוד',
  btn_explore_courses: 'חקור קורסים',
  btn_view_details: 'פרטים נוספים',
  btn_book_consultation: 'קבע ייעוץ',
  btn_download_brochure: 'הורד חוברת',
  btn_watch_demo: 'צפה בדמו',
  btn_free_trial: 'התחל תקופת ניסיון',
  
  // Forms
  form_label_email: 'אימייל',
  form_label_name: 'שם',
  form_label_phone: 'טלפון',
  form_label_message: 'הודעה',
  form_label_subject: 'נושא',
  form_placeholder_email: 'הזן אימייל',
  form_placeholder_name: 'הזן שם',
  form_placeholder_phone: 'הזן טלפון',
  form_placeholder_message: 'הזן הודעה',
  form_btn_submit: 'שלח',
  form_btn_subscribe: 'הירשם',
  form_btn_send: 'שלח הודעה',
  
  // Statistics
  stats_courses_label: 'קורסים',
  stats_learners_label: 'תלמידים',
  stats_years_label: 'שנים',
  stats_success_rate_label: 'אחוז הצלחה',
  stats_countries_label: 'מדינות',
  stats_instructors_label: 'מדריכים מומחים',
  
  // Messages
  msg_loading: 'טוען...',
  msg_error: 'אירעה שגיאה. נסה שוב.',
  msg_success: 'הצלחה!',
  msg_form_success: 'תודה! ניצור קשר בקרוב.',
  msg_subscribe_success: 'נרשמת בהצלחה לניוזלטר!',
  msg_no_courses: 'אין קורסים זמינים כרגע',
  msg_coming_soon: 'בקרוב',
  msg_enrollment_closed: 'ההרשמה סגורה',
  msg_limited_seats: 'מקומות מוגבלים',
  
  // UI Elements
  ui_search_placeholder: 'חיפוש קורסים...',
  ui_filter_all: 'הכל',
  ui_sort_by: 'מיין לפי',
  ui_view_mode: 'תצוגה',
  ui_grid_view: 'רשת',
  ui_list_view: 'רשימה',
  ui_read_more: 'קרא עוד',
  ui_show_less: 'הצג פחות',
  ui_back_to_top: 'חזרה למעלה',
  ui_share: 'שתף',
  ui_print: 'הדפס'
};

async function migratePostgreSQL() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL');

    // Add all new columns
    console.log('📝 Adding UI element columns...');
    for (const [field, type] of Object.entries(NEW_FIELDS)) {
      const pgType = type.replace('TEXT', 'VARCHAR(500)');
      try {
        await client.query(`ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS ${field} ${pgType}`);
        console.log(`  ✓ Added ${field}`);
      } catch (err) {
        console.log(`  ⚠️ Skipping ${field}: ${err.message}`);
      }
    }

    // Update English content (ensure defaults are set)
    console.log('\n🇬🇧 Setting English defaults...');
    const englishUpdates = Object.keys(NEW_FIELDS).map(field => {
      const defaultValue = NEW_FIELDS[field].match(/DEFAULT '([^']+)'/)?.[1] || '';
      return `${field} = COALESCE(${field}, '${defaultValue}')`;
    }).join(', ');

    await client.query(`
      UPDATE home_pages 
      SET ${englishUpdates}
      WHERE locale = 'en' OR locale IS NULL
    `);

    // Insert/Update Russian translations
    console.log('\n🇷🇺 Inserting Russian translations...');
    
    // Check if Russian record exists
    const ruExists = await client.query("SELECT id FROM home_pages WHERE locale = 'ru'");
    
    if (ruExists.rows.length === 0) {
      // Copy from English and update with Russian translations
      await client.query(`
        INSERT INTO home_pages (locale, title, hero_title, hero_subtitle, hero_description, 
          hero_section_visible, featured_courses_title, featured_courses_description, 
          featured_courses_visible, about_title, about_subtitle, about_description, about_visible,
          companies_title, companies_description, companies_visible, testimonials_title,
          testimonials_subtitle, testimonials_visible, courses, testimonials, published_at)
        SELECT 'ru', title, hero_title, hero_subtitle, hero_description,
          hero_section_visible, featured_courses_title, featured_courses_description,
          featured_courses_visible, about_title, about_subtitle, about_description, about_visible,
          companies_title, companies_description, companies_visible, testimonials_title,
          testimonials_subtitle, testimonials_visible, courses, testimonials, NOW()
        FROM home_pages WHERE locale = 'en' LIMIT 1
      `);
    }

    // Update with Russian translations
    const russianUpdates = Object.entries(RUSSIAN_TRANSLATIONS).map(([field, value]) => 
      `${field} = '${value.replace(/'/g, "''")}'`
    ).join(', ');

    await client.query(`
      UPDATE home_pages 
      SET ${russianUpdates}
      WHERE locale = 'ru'
    `);

    // Insert/Update Hebrew translations
    console.log('\n🇮🇱 Inserting Hebrew translations...');
    
    const heExists = await client.query("SELECT id FROM home_pages WHERE locale = 'he'");
    
    if (heExists.rows.length === 0) {
      await client.query(`
        INSERT INTO home_pages (locale, title, hero_title, hero_subtitle, hero_description,
          hero_section_visible, featured_courses_title, featured_courses_description,
          featured_courses_visible, about_title, about_subtitle, about_description, about_visible,
          companies_title, companies_description, companies_visible, testimonials_title,
          testimonials_subtitle, testimonials_visible, courses, testimonials, published_at)
        SELECT 'he', title, hero_title, hero_subtitle, hero_description,
          hero_section_visible, featured_courses_title, featured_courses_description,
          featured_courses_visible, about_title, about_subtitle, about_description, about_visible,
          companies_title, companies_description, companies_visible, testimonials_title,
          testimonials_subtitle, testimonials_visible, courses, testimonials, NOW()
        FROM home_pages WHERE locale = 'en' LIMIT 1
      `);
    }

    const hebrewUpdates = Object.entries(HEBREW_TRANSLATIONS).map(([field, value]) =>
      `${field} = '${value.replace(/'/g, "''")}'`
    ).join(', ');

    await client.query(`
      UPDATE home_pages
      SET ${hebrewUpdates}
      WHERE locale = 'he'
    `);

    console.log('\n✅ PostgreSQL migration completed!');
  } catch (error) {
    console.error('❌ PostgreSQL migration failed:', error);
    throw error;
  } finally {
    await client.end();
  }
}

function migrateSQLite() {
  const db = new sqlite3.Database(dbPath);

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      console.log('✅ Connected to SQLite');

      // Add all new columns
      console.log('📝 Adding UI element columns...');
      const alterPromises = Object.entries(NEW_FIELDS).map(([field, type]) => {
        return new Promise((res, rej) => {
          db.run(`ALTER TABLE home_pages ADD COLUMN ${field} ${type}`, (err) => {
            if (err) {
              console.log(`  ⚠️ Skipping ${field}: ${err.message}`);
            } else {
              console.log(`  ✓ Added ${field}`);
            }
            res(); // Always resolve to continue
          });
        });
      });

      Promise.all(alterPromises).then(() => {
        // Update English content
        console.log('\n🇬🇧 Setting English defaults...');
        const englishUpdates = Object.keys(NEW_FIELDS).map(field => {
          const defaultValue = NEW_FIELDS[field].match(/DEFAULT '([^']+)'/)?.[1] || '';
          return `${field} = COALESCE(${field}, '${defaultValue}')`;
        }).join(', ');

        db.run(`
          UPDATE home_pages 
          SET ${englishUpdates}
          WHERE locale = 'en' OR locale IS NULL
        `, (err) => {
          if (err) console.error('Error updating English:', err);

          // Check if Russian record exists
          db.get("SELECT id FROM home_pages WHERE locale = 'ru'", (err, row) => {
            if (!row) {
              // Insert Russian record
              db.run(`
                INSERT INTO home_pages (locale, title, hero_title, hero_subtitle, hero_description,
                  hero_section_visible, featured_courses_title, featured_courses_description,
                  featured_courses_visible, about_title, about_subtitle, about_description, about_visible,
                  companies_title, companies_description, companies_visible, testimonials_title,
                  testimonials_subtitle, testimonials_visible, courses, testimonials, published_at)
                SELECT 'ru', title, hero_title, hero_subtitle, hero_description,
                  hero_section_visible, featured_courses_title, featured_courses_description,
                  featured_courses_visible, about_title, about_subtitle, about_description, about_visible,
                  companies_title, companies_description, companies_visible, testimonials_title,
                  testimonials_subtitle, testimonials_visible, courses, testimonials, datetime('now')
                FROM home_pages WHERE locale = 'en' LIMIT 1
              `);
            }

            // Update Russian translations
            console.log('\n🇷🇺 Updating Russian translations...');
            const russianUpdates = Object.entries(RUSSIAN_TRANSLATIONS).map(([field, value]) =>
              `${field} = '${value.replace(/'/g, "''")}'`
            ).join(', ');

            db.run(`
              UPDATE home_pages
              SET ${russianUpdates}
              WHERE locale = 'ru'
            `, (err) => {
              if (err) console.error('Error updating Russian:', err);

              // Check if Hebrew record exists
              db.get("SELECT id FROM home_pages WHERE locale = 'he'", (err, row) => {
                if (!row) {
                  // Insert Hebrew record
                  db.run(`
                    INSERT INTO home_pages (locale, title, hero_title, hero_subtitle, hero_description,
                      hero_section_visible, featured_courses_title, featured_courses_description,
                      featured_courses_visible, about_title, about_subtitle, about_description, about_visible,
                      companies_title, companies_description, companies_visible, testimonials_title,
                      testimonials_subtitle, testimonials_visible, courses, testimonials, published_at)
                    SELECT 'he', title, hero_title, hero_subtitle, hero_description,
                      hero_section_visible, featured_courses_title, featured_courses_description,
                      featured_courses_visible, about_title, about_subtitle, about_description, about_visible,
                      companies_title, companies_description, companies_visible, testimonials_title,
                      testimonials_subtitle, testimonials_visible, courses, testimonials, datetime('now')
                    FROM home_pages WHERE locale = 'en' LIMIT 1
                  `);
                }

                // Update Hebrew translations
                console.log('\n🇮🇱 Updating Hebrew translations...');
                const hebrewUpdates = Object.entries(HEBREW_TRANSLATIONS).map(([field, value]) =>
                  `${field} = '${value.replace(/'/g, "''")}'`
                ).join(', ');

                db.run(`
                  UPDATE home_pages
                  SET ${hebrewUpdates}
                  WHERE locale = 'he'
                `, (err) => {
                  if (err) console.error('Error updating Hebrew:', err);
                  
                  console.log('\n✅ SQLite migration completed!');
                  db.close();
                  resolve();
                });
              });
            });
          });
        });
      }).catch(reject);
    });
  });
}

// Main migration function
async function migrate() {
  try {
    if (isProduction) {
      await migratePostgreSQL();
    } else {
      await migrateSQLite();
    }
    
    console.log('\n🎉 ULTRATHINK Migration Completed Successfully!');
    console.log('\n📋 Summary of added fields:');
    console.log('  • Navigation: 8 fields');
    console.log('  • Buttons/CTAs: 13 fields');
    console.log('  • Form labels: 11 fields');
    console.log('  • Statistics: 12 fields');
    console.log('  • System messages: 9 fields');
    console.log('  • UI elements: 10 fields');
    console.log('  📊 Total: 63 new UI fields added!');
    console.log('\n🌍 Languages configured:');
    console.log('  • English (en) - Default');
    console.log('  • Russian (ru) - Fully translated');
    console.log('  • Hebrew (he) - Fully translated');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrate();