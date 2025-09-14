/**
 * Fix Footer Navigation Settings
 * Updates database to show navigation in footer for all locales
 */

const { Client } = require('pg');

async function fixFooterNavigation() {
  let client;

  try {
    // Use same database configuration as server.js
    const dbConfig = {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    };

    console.log('🔧 Connecting to database to fix footer navigation settings...');

    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable not set');
    }

    client = new Client(dbConfig);
    await client.connect();

    console.log('✅ Connected to database');

    // Check current settings
    console.log('\n📊 Current footer settings:');
    const currentSettings = await client.query(
      'SELECT locale, show_navigation, show_social_links, show_contact_info, show_company_info FROM footer_content ORDER BY locale'
    );
    console.table(currentSettings.rows);

    // Update show_navigation to true for all records
    console.log('\n🔄 Updating show_navigation to true...');
    const updateResult = await client.query(
      'UPDATE footer_content SET show_navigation = true WHERE show_navigation = false OR show_navigation IS NULL'
    );

    console.log(`✅ Updated ${updateResult.rowCount} records`);

    // Verify the update
    console.log('\n📊 Updated footer settings:');
    const updatedSettings = await client.query(
      'SELECT locale, show_navigation, show_social_links, show_contact_info, show_company_info FROM footer_content ORDER BY locale'
    );
    console.table(updatedSettings.rows);

    console.log('\n🎉 Footer navigation fix completed successfully!');
    console.log('💡 The footer should now display navigation items on all language pages.');

  } catch (error) {
    console.error('❌ Error fixing footer navigation:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.end();
      console.log('🔐 Database connection closed');
    }
  }
}

// Load environment variables if .env file exists
if (require('fs').existsSync('.env')) {
  require('dotenv').config();
}

// Run the fix
fixFooterNavigation().catch(console.error);