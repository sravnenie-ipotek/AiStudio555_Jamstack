#!/usr/bin/env node

const { Client } = require('pg');

async function updateLocalFAQComplete() {
  console.log('🚀 Updating local PostgreSQL with complete FAQ translations...');

  const client = new Client({
    connectionString: 'postgresql://projectdes:localpassword@localhost:5432/projectdes_dev'
  });

  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL');

    // Complete FAQ data with titles and improved answers
    const faqData = {
      "faq_1_title": "קורסים מוצעים",
      "faq_1_question": "אילו קורסים אתם מציעים?",
      "faq_1_answer": "אנו מציעים קורסים מקיפים בפיתוח בינה מלאכותית, למידת מכונה, מדע הנתונים, פיתוח אפליקציות ווב, פיתוח אפליקציות מובייל, מחשוב ענן, אבטחת סייבר ועוד. כל הקורסים מעוצבים עם 85% עבודה מעשית ופרויקטים מהעולם האמיתי.",

      "faq_2_title": "משך הקורסים",
      "faq_2_question": "כמה זמן לוקח להשלים קורס?",
      "faq_2_answer": "משך הקורס משתנה בין 3-6 חודשים, תלוי בקורס ובקצב הלמידה שלך. אנו מציעים אפשרויות גמישות ללמידה במשרה מלאה או חלקית כדי להתאים ללוח הזמנים שלך.",

      "faq_3_title": "תעודות והסמכה",
      "faq_3_question": "האם אתם מספקים תעודות?",
      "faq_3_answer": "כן, עם השלמת הקורס בהצלחה, תקבל תעודת סיום מוכרת בתעשייה המאשרת את כישוריך ומוכנותך לשוק העבודה.",

      "faq_4_title": "תמיכה בקריירה",
      "faq_4_question": "איזו תמיכה בקריירה אתם מציעים?",
      "faq_4_answer": "אנו מספקים תמיכה מקיפה בקריירה כולל סקירת קורות חיים, הכנה לראיונות, חיבורים עם מעסיקים, הכוונה בחיפוש עבודה וגישה למרכז הקריירה שלנו עם משרות בלעדיות.",

      "faq_5_title": "דרישות קדם",
      "faq_5_question": "האם יש דרישות קדם?",
      "faq_5_answer": "רוב הקורסים שלנו מתחילים מהבסיס ואינם דורשים ניסיון קודם. קורסים מתקדמים עשויים לדרוש ידע בסיסי בתכנות או מתמטיקה, אשר מצוין בתיאור הקורס.",

      "faq_6_title": "למידה בקצב אישי",
      "faq_6_question": "האם אוכל ללמוד בקצב שלי?",
      "faq_6_answer": "בהחלט! הקורסים שלנו מתוכננים להיות גמישים. אתה יכול ללמוד בקצב שלך עם גישה 24/7 לחומרי הקורס, הקלטות וידאו ותמיכת מדריכים."
    };

    console.log('Updating all FAQ fields...');
    let updateCount = 0;

    for (const [field, value] of Object.entries(faqData)) {
      try {
        // Add column if it doesn't exist
        await client.query(`
          ALTER TABLE home_pages
          ADD COLUMN IF NOT EXISTS ${field} TEXT
        `);

        // Update the field
        await client.query(`
          UPDATE home_pages
          SET ${field} = $1, updated_at = NOW()
          WHERE locale = 'he'
        `, [value]);

        updateCount++;
        console.log(`✅ Updated: ${field}`);
      } catch (error) {
        console.error(`❌ Failed to update ${field}:`, error.message);
      }
    }

    console.log(`\n🎉 Successfully updated ${updateCount} FAQ fields!`);

    // Verify the complete FAQ data
    console.log('\n📊 Verifying complete FAQ data...');
    const result = await client.query(`
      SELECT
        faq_1_title, faq_1_question, faq_1_answer,
        faq_2_title, faq_2_question,
        faq_3_title, faq_3_question
      FROM home_pages
      WHERE locale = 'he'
    `);

    if (result.rows.length > 0) {
      const row = result.rows[0];
      console.log('✅ FAQ data verified:');
      console.log('  1.', row.faq_1_title);
      console.log('     Q:', row.faq_1_question);
      console.log('     A:', row.faq_1_answer?.substring(0, 50) + '...');
      console.log('  2.', row.faq_2_title);
      console.log('     Q:', row.faq_2_question);
      console.log('  3.', row.faq_3_title);
      console.log('     Q:', row.faq_3_question);
      console.log('\n🎯 FAQ titles are now specific instead of generic!');
    }

  } catch (error) {
    console.error('❌ Update failed:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n✅ PostgreSQL connection closed');
    console.log('\n🔄 Now restart your server or refresh your browser to see changes!');
  }
}

// Run the update
updateLocalFAQComplete();