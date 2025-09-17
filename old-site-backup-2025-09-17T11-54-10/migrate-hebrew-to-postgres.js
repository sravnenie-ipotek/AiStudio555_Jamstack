#!/usr/bin/env node

const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function migrateHebrewTranslations() {
  console.log('🚀 Starting Hebrew translations migration to PostgreSQL...');

  // Use the actual PostgreSQL container credentials
  const client = new Client({
    connectionString: 'postgresql://projectdes:localpassword@localhost:5432/projectdes_dev'
  });

  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL');

    // Hebrew translations data (only what we added)
    const hebrewTranslations = {
      // Why Choose Us Description (the missing one)
      "why_choose_description": "מספקים הכשרה מעשית ומנטורינג מהעולם האמיתי, אנו שואפים לגשר על הפער בין ידע תיאורטי ליישום מעשי, תוך הבטחה שכל סטודנט יוכל ליישם את כישוריו בביטחון.",

      // FAQ Section
      "faq_title": "שלטו ב-AI וטכנולוגיה",
      "faq_subtitle": "שאלות נפוצות",

      // FAQ Questions & Answers
      "faq_1_question": "אילו קורסים אתם מציעים?",
      "faq_1_answer": "אנו מציעים קורסים מקיפים בפיתוח AI, למידת מכונה, מדע הנתונים, פיתוח ווב, פיתוח אפליקציות, מחשוב ענן, אבטחת סייבר ועוד. כל הקורסים מתוכננים עם 85% עבודה מעשית ופרויקטים מהעולם האמיתי.",

      "faq_2_question": "כמה זמן לוקח להשלים קורס?",
      "faq_2_answer": "משך הקורס משתנה בין 3-6 חודשים, תלוי בקורס ובקצב הלמידה שלך. אנו מציעים אפשרויות גמישות ללמידה במשרה מלאה או חלקית כדי להתאים ללוח הזמנים שלך.",

      "faq_3_question": "האם אתם מספקים תעודות?",
      "faq_3_answer": "כן, עם השלמת הקורס בהצלחה, תקבל תעודת סיום מוכרת בתעשייה המאשרת את כישוריך ומוכנותך לשוק העבודה.",

      "faq_4_question": "איזו תמיכה בקריירה אתם מציעים?",
      "faq_4_answer": "אנו מספקים תמיכה מקיפה בקריירה כולל סקירת קורות חיים, הכנה לראיונות, חיבורים עם מעסיקים, הכוונה בחיפוש עבודה וגישה למרכז הקריירה שלנו עם משרות בלעדיות.",

      "faq_5_question": "האם יש דרישות קדם?",
      "faq_5_answer": "רוב הקורסים שלנו מתחילים מהבסיס ואינם דורשים ניסיון קודם. קורסים מתקדמים עשויים לדרוש ידע בסיסי בתכנות או מתמטיקה, אשר מצוין בתיאור הקורס.",

      "faq_6_question": "האם אוכל ללמוד בקצב שלי?",
      "faq_6_answer": "בהחלט! הקורסים שלנו מתוכננים להיות גמישים. אתה יכול ללמוד בקצב שלך עם גישה 24/7 לחומרי הקורס, הקלטות וידאו ותמיכת מדריכים.",

      // Testimonials/Feedbacks
      "testimonial_1_name": "מרים כהן",
      "testimonial_1_date": "29 באוגוסט ב-Google",
      "testimonial_1_text": "סיימתי את קורס פיתוח Android. היה מאוד נוח שהוא התקיים אונליין. החומר מוצג בצורה ברורה ומובנית. הגישה המעשית עזרה לי למצוא עבודה מיד לאחר הסיום.",
      "testimonial_1_course": "פיתוח Android",
      "testimonial_1_rating": "5",

      "testimonial_2_name": "אלכסנדר לוי",
      "testimonial_2_date": "29 באוגוסט ב-Yandex",
      "testimonial_2_text": "סיימתי הכשרת Data Science. המדריך מקסים סטפנוביץ' מצוין. הצגה נהדרת של נושאים מורכבים, תמיד מוכן לעזור בשאלות. הקורס נתן לי כישורים מעשיים שאני משתמש בהם מדי יום בעבודה.",
      "testimonial_2_course": "Data Science",
      "testimonial_2_rating": "5",

      "testimonial_3_name": "איגור טרוחנוביץ'",
      "testimonial_3_date": "28 באוגוסט ב-Yandex",
      "testimonial_3_text": "סיימתי אוטומציה ב-JavaScript. הקורס מעולה עם הרבה פרקטיקה. המדריכים מקצועיים ותומכים. עכשיו אני עובד כמפתח אוטומציה בחברת הייטק מובילה.",
      "testimonial_3_course": "JavaScript Automation",
      "testimonial_3_rating": "5",

      "testimonial_4_name": "שרה רוזנברג",
      "testimonial_4_date": "27 באוגוסט ב-LinkedIn",
      "testimonial_4_text": "הקורס למידת מכונה היה מדהים! השילוב של תיאוריה ופרקטיקה היה מושלם. הפרויקטים האמיתיים עזרו לי להבין את החומר לעומק ולהתכונן לעבודה בתעשייה.",
      "testimonial_4_course": "Machine Learning",
      "testimonial_4_rating": "5",

      "testimonial_5_name": "דוד מזרחי",
      "testimonial_5_date": "26 באוגוסט ב-Facebook",
      "testimonial_5_text": "קורס פיתוח Full Stack מעולה! למדתי המון טכנולוגיות חדשות ורלוונטיות. התמיכה של המדריכים היתה יוצאת מן הכלל. ממליץ בחום לכל מי שרוצה להיכנס לתחום.",
      "testimonial_5_course": "Full Stack Development",
      "testimonial_5_rating": "5",

      // Read More button
      "btn_read_more": "קרא עוד",

      // Testimonials Section Title
      "testimonials_section_title": "מה הסטודנטים שלנו אומרים",
      "testimonials_section_subtitle": "סיפורי הצלחה מבוגרי התוכנית"
    };

    // Check if Hebrew locale exists in home_pages table
    const checkResult = await client.query(
      "SELECT id FROM home_pages WHERE locale = 'he'"
    );

    if (checkResult.rows.length === 0) {
      // Create Hebrew locale entry if it doesn't exist
      console.log('Creating Hebrew locale entry...');
      await client.query(`
        INSERT INTO home_pages (locale, title, created_at, updated_at)
        VALUES ('he', 'AI Studio - פלטפורמת למידה', NOW(), NOW())
        ON CONFLICT (locale) DO NOTHING
      `);
    }

    // Update each field
    let successCount = 0;
    let failCount = 0;
    const errors = [];

    for (const [field, value] of Object.entries(hebrewTranslations)) {
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
          console.log(`Adding missing column: ${field}`);
          await client.query(`
            ALTER TABLE home_pages
            ADD COLUMN ${field} VARCHAR(500)
          `);
        }

        // Update the field
        await client.query(`
          UPDATE home_pages
          SET ${field} = $1, updated_at = NOW()
          WHERE locale = 'he'
        `, [value]);

        successCount++;
        console.log(`✅ Updated: ${field}`);
      } catch (error) {
        failCount++;
        errors.push({ field, error: error.message });
        console.error(`❌ Failed to update ${field}:`, error.message);
      }
    }

    console.log('\n📊 Migration Summary:');
    console.log(`✅ Successfully migrated: ${successCount} fields`);
    console.log(`❌ Failed: ${failCount} fields`);

    if (errors.length > 0) {
      console.log('\n⚠️ Errors:');
      errors.forEach(e => console.log(`  - ${e.field}: ${e.error}`));
    }

    console.log('\n🎉 Hebrew translations migration completed!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run the migration
migrateHebrewTranslations();