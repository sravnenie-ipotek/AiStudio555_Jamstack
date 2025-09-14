#!/usr/bin/env node

const { Client } = require('pg');

async function updateFAQTitles() {
  console.log('🚀 Updating FAQ titles with specific Hebrew translations...');

  const client = new Client({
    connectionString: 'postgresql://projectdes:localpassword@localhost:5432/projectdes_dev'
  });

  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL');

    // Specific FAQ titles instead of generic "שלטו ב-AI וטכנולוגיה"
    const faqTitles = {
      "faq_1_title": "קורסים מוצעים",
      "faq_2_title": "משך הקורסים",
      "faq_3_title": "תעודות והסמכה",
      "faq_4_title": "תמיכה בקריירה",
      "faq_5_title": "דרישות קדם",
      "faq_6_title": "למידה בקצב אישי"
    };

    console.log('Adding FAQ title columns and updating...');
    let updateCount = 0;

    for (const [field, value] of Object.entries(faqTitles)) {
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
        console.log(`✅ Updated: ${field} = ${value}`);
      } catch (error) {
        console.error(`❌ Failed to update ${field}:`, error.message);
      }
    }

    console.log(`\n🎉 Successfully updated ${updateCount} FAQ title fields!`);

    // Verify the data
    console.log('\n📊 Verifying FAQ titles...');
    const result = await client.query(`
      SELECT
        faq_1_title, faq_1_question,
        faq_2_title, faq_2_question,
        faq_3_title, faq_3_question
      FROM home_pages
      WHERE locale = 'he'
    `);

    if (result.rows.length > 0) {
      const row = result.rows[0];
      console.log('✅ FAQ titles verified:');
      console.log('  1.', row.faq_1_title, '-', row.faq_1_question);
      console.log('  2.', row.faq_2_title, '-', row.faq_2_question);
      console.log('  3.', row.faq_3_title, '-', row.faq_3_question);
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
updateFAQTitles();