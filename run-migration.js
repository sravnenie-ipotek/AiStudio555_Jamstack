#!/usr/bin/env node

/**
 * Migration Runner for FAQ JSON Implementation
 * Runs the 008-add-faq-json-columns.sql migration
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Database configuration
let dbConfig;

if (process.env.DATABASE_URL) {
  const isLocal = process.env.DATABASE_URL.includes('localhost') || process.env.NODE_ENV === 'development';
  dbConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: isLocal ? false : { rejectUnauthorized: false }
  };
} else {
  console.error('❌ DATABASE_URL not found');
  process.exit(1);
}

async function runMigration() {
  const client = new Client(dbConfig);

  try {
    console.log('🔌 Connecting to database...');
    await client.connect();

    const isProduction = !process.env.DATABASE_URL.includes('localhost');
    console.log(`🌍 Environment: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);

    // Read migration file
    const migrationPath = path.join(__dirname, 'migrations', '008-add-faq-json-columns.sql');

    if (!fs.existsSync(migrationPath)) {
      throw new Error(`Migration file not found: ${migrationPath}`);
    }

    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📝 Running FAQ JSON migration...');
    console.log('Migration file:', migrationPath);

    // Execute migration
    await client.query(migrationSQL);

    console.log('✅ Migration completed successfully!');

    // Verify the migration worked
    console.log('\n🔍 Verifying migration...');

    try {
      // Check if faq_items column was added
      const result = await client.query(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'home_pages'
        AND column_name = 'faq_items'
      `);

      if (result.rows.length > 0) {
        console.log('✅ faq_items column added to home_pages table');
        console.log('   Data type:', result.rows[0].data_type);
      } else {
        console.log('⚠️ faq_items column not found (might be using SQLite)');
      }

      // Check if any FAQ data was migrated
      const faqData = await client.query(`
        SELECT id, locale, faq_items
        FROM home_pages
        WHERE faq_items IS NOT NULL
        LIMIT 3
      `);

      if (faqData.rows.length > 0) {
        console.log(`✅ Found ${faqData.rows.length} records with FAQ JSON data`);
        faqData.rows.forEach(row => {
          const items = typeof row.faq_items === 'string' ? JSON.parse(row.faq_items) : row.faq_items;
          console.log(`   Locale ${row.locale}: ${items?.length || 0} FAQ items`);
        });
      } else {
        console.log('ℹ️  No JSON FAQ data found (migration may need to populate data)');
      }

    } catch (verifyError) {
      console.log('⚠️ Verification failed (but migration may still be successful):', verifyError.message);
    }

    console.log('\n🚀 Migration deployment complete!');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);

    // Check if it's because the column already exists
    if (error.message.includes('already exists') || error.message.includes('duplicate column')) {
      console.log('ℹ️  Migration may have already been applied');

      // Still try to verify
      try {
        const result = await client.query(`
          SELECT COUNT(*) as count
          FROM information_schema.columns
          WHERE table_name = 'home_pages'
          AND column_name = 'faq_items'
        `);

        if (result.rows[0].count > 0) {
          console.log('✅ faq_items column exists - migration is already applied');
        }
      } catch (e) {
        console.log('Unable to verify column existence');
      }
    } else {
      throw error;
    }
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

// Run migration
runMigration().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});