// Simple local migration runner using existing server connection
const fs = require('fs');
const path = require('path');

async function runMigration() {
  try {
    console.log('🚀 Running FAQ JSON Migration...');

    // Import the database query function from our server or create a simple one
    let queryDatabase;

    // Try to use environment variable from the running server
    if (!process.env.DATABASE_URL && process.env.RAILWAY_ENVIRONMENT) {
      console.log('📍 Running in Railway environment');
    }

    // Use the same database configuration as the server
    const { Client } = require('pg');

    const dbConfig = {
      connectionString: process.env.DATABASE_URL || 'postgresql://aistudio_user:aistudio_dev_password_2024@localhost:5433/aistudio_db',
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    };

    const client = new Client(dbConfig);
    await client.connect();

    queryDatabase = async (query) => {
      const result = await client.query(query);
      return result.rows;
    };

    // Read migration file
    const migrationPath = path.join(__dirname, 'migrations', '008-add-faq-json-columns.sql');
    if (!fs.existsSync(migrationPath)) {
      throw new Error(`Migration file not found: ${migrationPath}`);
    }

    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📝 Executing migration SQL...');

    // Execute migration
    await client.query(migrationSQL);

    console.log('✅ Migration completed successfully!');

    // Verify the migration
    try {
      const columnCheck = await queryDatabase(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'home_pages'
        AND column_name = 'faq_items'
      `);

      if (columnCheck.length > 0) {
        console.log('✅ faq_items column verified in home_pages table');
      }

      const faqData = await queryDatabase(`
        SELECT id, locale, faq_items
        FROM home_pages
        WHERE faq_items IS NOT NULL
        LIMIT 3
      `);

      console.log(`📊 Found ${faqData.length} records with JSON FAQ data`);

    } catch (verifyError) {
      console.log('⚠️ Verification warning:', verifyError.message);
    }

    await client.end();
    console.log('🎉 Migration deployment complete!');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);

    if (error.message.includes('already exists') || error.message.includes('duplicate column')) {
      console.log('ℹ️  Migration may have already been applied - this is OK');
    } else {
      throw error;
    }
  }
}

// Run if called directly
if (require.main === module) {
  runMigration().catch(console.error);
}

module.exports = { runMigration };