#!/usr/bin/env node

const { Client } = require('pg');

async function updateComprehensiveHebrew() {
  console.log('🚀 Updating PostgreSQL with comprehensive Hebrew translations...');

  const client = new Client({
    connectionString: 'postgresql://projectdes:localpassword@localhost:5432/projectdes_dev'
  });

  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL');

    // All the new comprehensive Hebrew translations
    const newHebrewTranslations = {
      // Navigation Dropdown (CRITICAL)
      "nav_career_orientation": "הכוונה מקצועית",
      "nav_career_center": "מרכז קריירה",

      // Primary Action Buttons
      "btn_start_career_assessment": "התחל את הערכת הקריירה שלך ב-AI",
      "btn_schedule_consultation": "קבע ייעוץ חינם",
      "btn_submit_application": "שלח בקשה",
      "btn_view_schedule": "צפה בלוח זמנים",
      "btn_get_started_today": "התחל היום",
      "btn_apply_now": "הגש בקשה עכשיו",
      "btn_book_now": "הזמן עכשיו",
      "btn_try_free": "נסה חינם",
      "btn_download": "הורד",
      "btn_watch": "צפה",

      // Extended Form Fields
      "form_label_full_name": "שם מלא",
      "form_label_email_address": "כתובת אימייל",
      "form_label_phone_number": "מספר טלפון",
      "form_placeholder_full_name": "הכנס את שמך המלא",
      "form_placeholder_email_address": "האימייל.שלך@דוגמה.com",
      "form_placeholder_phone_israel": "+972 XX-XXX-XXXX",
      "form_option_complete_beginner": "מתחיל לחלוטין",

      // Newsletter & Subscription
      "newsletter_title": "הישאר מעודכן עם AI Studio",
      "newsletter_description": "קבל את המאמרים, המדריכים ותובנות התעשייה העדכניים ישירות לתיבת הדואר שלך",
      "newsletter_subscribe": "הירשם לניוזלטר",
      "newsletter_placeholder": "הכנס את כתובת האימייל שלך",
      "newsletter_btn_subscribe": "הירשם עכשיו",
      "newsletter_btn_enter_email": "הכנס אימייל להירשמות",

      // Footer Content
      "footer_blog_single": "פוסט בלוג",
      "footer_license": "רישיון",
      "footer_copyright": "© זכויות יוצרים",
      "footer_designed_by": "עוצב על ידי",
      "footer_powered_by": "רישוי מופעל על ידי Webflow",

      // Error Messages & System Text
      "error_general": "סליחה, הייתה שגיאה. אנא נסה שוב או צור איתנו קשר ישירות.",
      "error_form_submission": "אופס! משהו השתבש בעת שליחת הטופס.",
      "msg_please_wait_loading": "אנא המתן...",
      "success_consultation": "הצלחה! ניצור איתך קשר תוך 24 שעות לתיאום הייעוץ החינם שלך.",

      // Authentication Pages
      "auth_sign_up_title": "הירשם לחשבון שלך",
      "auth_sign_up_google": "הירשם עם Google",
      "auth_sign_up_facebook": "הירשם עם Facebook",
      "auth_terms_agree": "אני מסכים לכל התנאים וההגבלות",
      "auth_sign_up_btn": "הירשם",
      "auth_sign_in_title": "התחבר לחשבון שלך",
      "auth_no_account": "אין לך חשבון? הירשם",
      "auth_have_account": "יש לך חשבון? התחבר",
      "auth_forgot_password": "שכחת סיסמה?",
      "auth_reset_password": "איפוס סיסמה",

      // Career Assessment & Orientation
      "career_assessment_title": "הערכת קריירה ב-AI",
      "career_consultation_title": "ייעוץ קריירה חינם",
      "career_orientation_title": "הכוונה מקצועית",
      "career_center_title": "מרכז קריירה",

      // Course Content
      "courses_view_all": "צפה בכל הקורסים",
      "courses_level_beginner": "מתחיל",
      "courses_level_intermediate": "בינוני",
      "courses_level_advanced": "מתקדם",
      "courses_duration": "משך הקורס",
      "courses_format": "פורמט הקורס",
      "courses_certificate": "תעודה",

      // Blog Content
      "blog_read_more": "קרא עוד",
      "blog_share": "שתף",
      "blog_category": "קטגוריה",
      "blog_date": "תאריך",
      "blog_author": "מחבר",
      "blog_related_posts": "פוסטים קשורים",

      // Pricing Content
      "pricing_title": "מחירון",
      "pricing_monthly": "חודשי",
      "pricing_yearly": "שנתי",
      "pricing_per_month": "לחודש",
      "pricing_per_year": "לשנה",
      "pricing_popular": "פופולרי",
      "pricing_choose_plan": "בחר תוכנית",

      // Teachers/Instructors
      "teachers_title": "המדריכים שלנו",
      "teachers_experience": "ניסיון",
      "teachers_specialization": "התמחות",
      "teachers_linkedin": "לינקדאין",
      "teachers_contact": "צור קשר עם המדריך",

      // General Content
      "about_us": "אודותינו",
      "our_mission": "המשימה שלנו",
      "our_vision": "החזון שלנו",
      "our_values": "הערכים שלנו",
      "why_choose_us": "למה לבחור בנו",
      "our_approach": "הגישה שלנו",
      "success_stories": "סיפורי הצלחה",

      // Contact & Communication
      "contact_us": "צור קשר",
      "get_in_touch": "יצירת קשר",
      "send_message": "שלח הודעה",
      "call_us": "התקשר אלינו",
      "email_us": "שלח לנו אימייל",
      "office_hours": "שעות פעילות",
      "response_time": "זמן תגובה",

      // Learning & Education
      "start_learning": "התחל ללמוד",
      "continue_learning": "המשך ללמוד",
      "learning_path": "מסלול למידה",
      "skill_level": "רמת כישורים",
      "prerequisites": "דרישות קדם",
      "learning_objectives": "יעדי למידה",
      "hands_on_practice": "תרגול מעשי",

      // Technology & Skills
      "artificial_intelligence": "בינה מלאכותית",
      "machine_learning": "למידת מכונה",
      "data_science": "מדע הנתונים",
      "web_development": "פיתוח ווב",
      "mobile_development": "פיתוח אפליקציות",
      "cloud_computing": "מחשוב ענן",
      "cybersecurity": "אבטחת סייבר",

      // Status & Progress
      "in_progress": "בתהליך",
      "completed": "הושלם",
      "not_started": "לא התחיל",
      "available": "זמין",
      "coming_soon": "בקרוב",
      "updated": "עודכן",

      // Meta Content
      "page_title_career_orientation": "הכוונה מקצועית - פלטפורמת הלמידה AI Studio",
      "page_title_career_center": "מרכז קריירה - פלטפורמת הלמידה AI Studio",
      "page_title_courses": "קורסים - פלטפורמת הלמידה AI Studio",
      "page_title_teachers": "מרצים - פלטפורמת הלמידה AI Studio",
      "page_title_blog": "בלוג - פלטפורמת הלמידה AI Studio",
      "page_title_pricing": "מחירון - פלטפורמת הלמידה AI Studio"
    };

    // Update each field
    console.log(`Updating ${Object.keys(newHebrewTranslations).length} new Hebrew translation fields...`);
    let updateCount = 0;

    for (const [field, value] of Object.entries(newHebrewTranslations)) {
      try {
        // First check if column exists
        const columnCheck = await client.query(`
          SELECT column_name
          FROM information_schema.columns
          WHERE table_name = 'home_pages'
          AND column_name = $1
        `, [field]);

        if (columnCheck.rows.length === 0) {
          // Add column if it doesn't exist
          console.log(`Adding column: ${field}`);
          await client.query(`
            ALTER TABLE home_pages
            ADD COLUMN ${field} TEXT
          `);
        }

        // Update the field
        await client.query(`
          UPDATE home_pages
          SET ${field} = $1, updated_at = NOW()
          WHERE locale = 'he'
        `, [value]);

        updateCount++;
        if (updateCount % 10 === 0) {
          console.log(`✅ Updated ${updateCount} fields...`);
        }
      } catch (error) {
        console.error(`❌ Failed to update ${field}:`, error.message);
      }
    }

    console.log(`\n🎉 Successfully updated ${updateCount} comprehensive Hebrew translation fields!`);

    // Verify critical translations
    console.log('\n📊 Verifying critical translations...');
    const result = await client.query(`
      SELECT
        nav_career_orientation,
        nav_career_center,
        btn_start_career_assessment,
        error_general,
        newsletter_title
      FROM home_pages
      WHERE locale = 'he'
    `);

    if (result.rows.length > 0) {
      const row = result.rows[0];
      console.log('✅ Critical translations verified:');
      console.log('  - Navigation Career Orientation:', row.nav_career_orientation);
      console.log('  - Navigation Career Center:', row.nav_career_center);
      console.log('  - Career Assessment Button:', row.btn_start_career_assessment?.substring(0, 30) + '...');
      console.log('  - Error Message:', row.error_general?.substring(0, 30) + '...');
      console.log('  - Newsletter Title:', row.newsletter_title);
    }

  } catch (error) {
    console.error('❌ Update failed:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n✅ PostgreSQL connection closed');
  }
}

// Run the update
updateComprehensiveHebrew();