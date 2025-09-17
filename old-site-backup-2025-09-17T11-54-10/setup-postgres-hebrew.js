#!/usr/bin/env node

const { Client } = require('pg');

async function setupPostgreSQL() {
  console.log('🚀 Setting up PostgreSQL with Hebrew translations...');

  const client = new Client({
    connectionString: 'postgresql://projectdes:localpassword@localhost:5432/projectdes_dev'
  });

  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL');

    // Create home_pages table if it doesn't exist
    console.log('Creating home_pages table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS home_pages (
        id SERIAL PRIMARY KEY,
        locale VARCHAR(10) UNIQUE NOT NULL,
        title VARCHAR(500),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),

        -- Why Choose Us fields
        why_choose_description VARCHAR(500),

        -- FAQ fields
        faq_title VARCHAR(500),
        faq_subtitle VARCHAR(500),
        faq_1_question VARCHAR(500),
        faq_1_answer VARCHAR(500),
        faq_2_question VARCHAR(500),
        faq_2_answer VARCHAR(500),
        faq_3_question VARCHAR(500),
        faq_3_answer VARCHAR(500),
        faq_4_question VARCHAR(500),
        faq_4_answer VARCHAR(500),
        faq_5_question VARCHAR(500),
        faq_5_answer VARCHAR(500),
        faq_6_question VARCHAR(500),
        faq_6_answer VARCHAR(500),

        -- Testimonials fields
        testimonial_1_name VARCHAR(500),
        testimonial_1_date VARCHAR(500),
        testimonial_1_text VARCHAR(500),
        testimonial_1_course VARCHAR(500),
        testimonial_1_rating VARCHAR(10),
        testimonial_2_name VARCHAR(500),
        testimonial_2_date VARCHAR(500),
        testimonial_2_text VARCHAR(500),
        testimonial_2_course VARCHAR(500),
        testimonial_2_rating VARCHAR(10),
        testimonial_3_name VARCHAR(500),
        testimonial_3_date VARCHAR(500),
        testimonial_3_text VARCHAR(500),
        testimonial_3_course VARCHAR(500),
        testimonial_3_rating VARCHAR(10),
        testimonial_4_name VARCHAR(500),
        testimonial_4_date VARCHAR(500),
        testimonial_4_text VARCHAR(500),
        testimonial_4_course VARCHAR(500),
        testimonial_4_rating VARCHAR(10),
        testimonial_5_name VARCHAR(500),
        testimonial_5_date VARCHAR(500),
        testimonial_5_text VARCHAR(500),
        testimonial_5_course VARCHAR(500),
        testimonial_5_rating VARCHAR(10),

        -- Button fields
        btn_read_more VARCHAR(500),

        -- Section titles
        testimonials_section_title VARCHAR(500),
        testimonials_section_subtitle VARCHAR(500)
      )
    `);
    console.log('✅ Table created or already exists');

    // Insert Hebrew locale entry
    console.log('Creating Hebrew locale entry...');
    await client.query(`
      INSERT INTO home_pages (locale, title)
      VALUES ('he', 'AI Studio - פלטפורמת למידה')
      ON CONFLICT (locale) DO NOTHING
    `);

    // Hebrew translations data
    const hebrewTranslations = {
      // Why Choose Us Description
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

      // Testimonials
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

      // Buttons
      "btn_read_more": "קרא עוד",

      // Section titles
      "testimonials_section_title": "מה הסטודנטים שלנו אומרים",
      "testimonials_section_subtitle": "סיפורי הצלחה מבוגרי התוכנית"
    };

    // Update Hebrew translations
    console.log('Updating Hebrew translations...');
    let updateCount = 0;

    for (const [field, value] of Object.entries(hebrewTranslations)) {
      try {
        await client.query(`
          UPDATE home_pages
          SET ${field} = $1, updated_at = NOW()
          WHERE locale = 'he'
        `, [value]);
        updateCount++;
        console.log(`✅ Updated: ${field}`);
      } catch (error) {
        // Column might not exist, try to add it
        try {
          console.log(`Adding column: ${field}`);
          await client.query(`ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS ${field} VARCHAR(500)`);

          // Try update again
          await client.query(`
            UPDATE home_pages
            SET ${field} = $1, updated_at = NOW()
            WHERE locale = 'he'
          `, [value]);
          updateCount++;
          console.log(`✅ Added and updated: ${field}`);
        } catch (addError) {
          console.error(`❌ Failed to update ${field}:`, addError.message);
        }
      }
    }

    console.log(`\n🎉 Successfully updated ${updateCount} Hebrew translation fields in PostgreSQL!`);

    // Verify the data
    console.log('\n📊 Verifying Hebrew data...');
    const result = await client.query(`
      SELECT locale, why_choose_description, faq_1_question, testimonial_1_name
      FROM home_pages
      WHERE locale = 'he'
    `);

    if (result.rows.length > 0) {
      console.log('✅ Hebrew data verified:');
      console.log('  - Locale:', result.rows[0].locale);
      console.log('  - Why Choose Description:', result.rows[0].why_choose_description?.substring(0, 50) + '...');
      console.log('  - FAQ 1 Question:', result.rows[0].faq_1_question);
      console.log('  - Testimonial 1 Name:', result.rows[0].testimonial_1_name);
    }

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n✅ PostgreSQL connection closed');
  }
}

// Run the setup
setupPostgreSQL();