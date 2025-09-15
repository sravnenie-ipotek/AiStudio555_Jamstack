#!/usr/bin/env node

/**
 * Export local database data for syncing to production
 */

const { Client } = require('pg');
const fs = require('fs').promises;

const LOCAL_DB = {
  connectionString: 'postgresql://postgres:postgres@localhost:5432/aistudio_db'
};

async function exportLocalData() {
  const client = new Client(LOCAL_DB);

  try {
    console.log('🔄 Connecting to local database...');
    await client.connect();
    console.log('✅ Connected to local database');

    // Tables to export
    const tables = [
      'courses',
      'teachers',
      'blog_posts',
      'home_pages',
      'career_center_pages',
      'career_orientation_pages',
      'pricing_plans',
      'faqs',
      'company_logos',
      'consultations',
      'career_resources'
    ];

    const exportData = {};

    for (const table of tables) {
      try {
        console.log(`📁 Exporting ${table}...`);
        const result = await client.query(`SELECT * FROM ${table} ORDER BY id`);
        exportData[table] = result.rows;
        console.log(`   ✅ ${result.rows.length} rows exported`);
      } catch (err) {
        console.log(`   ⚠️  Table ${table} not found or error: ${err.message}`);
      }
    }

    // Save to file
    const filename = `local-db-export-${new Date().toISOString().split('T')[0]}.json`;
    await fs.writeFile(filename, JSON.stringify(exportData, null, 2));
    console.log(`\n✅ Data exported to ${filename}`);

    // Generate summary
    console.log('\n📊 Export Summary:');
    console.log('==================');
    Object.entries(exportData).forEach(([table, rows]) => {
      if (rows.length > 0) {
        console.log(`${table}: ${rows.length} rows`);
      }
    });

    return exportData;

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

// Run if called directly
if (require.main === module) {
  exportLocalData();
}

module.exports = { exportLocalData };