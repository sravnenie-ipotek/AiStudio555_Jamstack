#!/usr/bin/env node

/**
 * Manual migration runner for career_orientation_pages
 * Run this to add missing columns to the database
 */

const { Client } = require('pg');

async function runMigration() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/aistudio',
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Create table if not exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS career_orientation_pages (
        id SERIAL PRIMARY KEY,
        locale VARCHAR(10) NOT NULL DEFAULT 'en',
        title TEXT,
        subtitle TEXT,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table created/verified');

    // Add columns one by one to avoid errors
    const columns = [
      'hero_title TEXT',
      'hero_subtitle TEXT',
      'hero_description TEXT',
      'hero_main_title TEXT',
      'hero_stat1_number TEXT',
      'hero_stat1_label TEXT',
      'hero_stat1_value TEXT',
      'hero_stat2_number TEXT',
      'hero_stat2_label TEXT',
      'hero_stat2_value TEXT',
      'hero_stat3_number TEXT',
      'hero_stat3_label TEXT',
      'hero_stat3_value TEXT',
      'hero_cta_text TEXT',
      'hero_cta_link TEXT',
      'hero_badge_text TEXT',
      'hero_visible BOOLEAN DEFAULT true',
      'problems_main_title TEXT',
      'problems_subtitle TEXT',
      'problems_description TEXT',
      'problem1_icon TEXT',
      'problem1_title TEXT',
      'problem1_description TEXT',
      'problem1_stat TEXT',
      'problem1_stat_label TEXT',
      'problem2_icon TEXT',
      'problem2_title TEXT',
      'problem2_description TEXT',
      'problem2_stat TEXT',
      'problem2_stat_label TEXT',
      'problems_visible BOOLEAN DEFAULT true',
      'solutions_main_title TEXT',
      'solutions_subtitle TEXT',
      'solution1_icon TEXT',
      'solution1_title TEXT',
      'solution1_description TEXT',
      'solution1_feature1 TEXT',
      'solution1_feature2 TEXT',
      'solution1_feature3 TEXT',
      'solution1_feature4 TEXT',
      'solution1_benefit TEXT',
      'solutions_visible BOOLEAN DEFAULT true',
      'process_main_title TEXT',
      'process_subtitle TEXT',
      'process_title TEXT',
      'process_step1_title TEXT',
      'process_step1_description TEXT',
      'process_step1_duration TEXT',
      'process_step2_title TEXT',
      'process_step2_description TEXT',
      'process_step2_duration TEXT',
      'process_step3_title TEXT',
      'process_step3_description TEXT',
      'process_step3_duration TEXT',
      'process_visible BOOLEAN DEFAULT true',
      'career_paths_main_title TEXT',
      'career_paths_subtitle TEXT',
      'career_path1_title TEXT',
      'career_path1_description TEXT',
      'career_path1_salary_range TEXT',
      'career_path1_growth_rate TEXT',
      'career_path1_top_skills TEXT',
      'career_paths_visible BOOLEAN DEFAULT true',
      'expert_name TEXT',
      'expert_title TEXT',
      'expert_credentials TEXT',
      'expert_background TEXT',
      'expert_description TEXT',
      'expert_quote TEXT',
      'expert_linkedin TEXT',
      'expert_twitter TEXT',
      'expert_visible BOOLEAN DEFAULT true',
      'partners_main_title TEXT',
      'partners_subtitle TEXT',
      'partners_title TEXT',
      'partner1_name TEXT',
      'partner1_description TEXT',
      'partner2_name TEXT',
      'partner2_description TEXT',
      'partner3_name TEXT',
      'partner3_description TEXT',
      'partners_visible BOOLEAN DEFAULT true',
      'assessment_main_title TEXT',
      'assessment_subtitle TEXT',
      'assessment_description TEXT',
      'assessment_visible BOOLEAN DEFAULT true',
      'cta_main_title TEXT',
      'cta_subtitle TEXT',
      'cta_description TEXT',
      'cta_button_text TEXT',
      'cta_button_link TEXT',
      'cta_visible BOOLEAN DEFAULT true'
    ];

    for (const column of columns) {
      const [colName] = column.split(' ');
      try {
        await client.query(`ALTER TABLE career_orientation_pages ADD COLUMN IF NOT EXISTS ${column}`);
        console.log(`✅ Added column: ${colName}`);
      } catch (err) {
        if (err.message.includes('already exists')) {
          console.log(`⏭️  Column already exists: ${colName}`);
        } else {
          console.error(`❌ Error adding ${colName}:`, err.message);
        }
      }
    }

    // Insert default row if empty
    const result = await client.query('SELECT COUNT(*) FROM career_orientation_pages WHERE locale = $1', ['en']);
    if (result.rows[0].count === '0') {
      await client.query(`
        INSERT INTO career_orientation_pages (locale, title, hero_main_title)
        VALUES ('en', 'Career Orientation', 'Discover Your Tech Career Path')
      `);
      console.log('✅ Added default content');
    }

    console.log('\n🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run if called directly
if (require.main === module) {
  runMigration();
}

module.exports = { runMigration };