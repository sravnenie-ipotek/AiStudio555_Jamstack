#!/usr/bin/env node

/**
 * TEMPORARY ADMIN SCRIPT
 * This script executes database operations that require direct access
 * Run with: node temp-admin-script.js [operation]
 * Operations: list-tables, drop-all-tables, restore-local-backup
 */

require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');

// Use Railway PostgreSQL connection
const dbConfig = {
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:wQ7R2R6CtBP1NRPB9PgwPt7CBZfpRqmU@junction.proxy.rlwy.net:22159/railway',
  ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false }
};

async function queryDatabase(query, params = []) {
  const client = new Client(dbConfig);
  try {
    await client.connect();
    const result = await client.query(query, params);
    return result.rows;
  } catch (error) {
    console.error('PostgreSQL error:', error.message);
    throw error;
  } finally {
    await client.end();
  }
}

async function listTables() {
  console.log('📊 Listing all tables in Railway database...');
  const tables = await queryDatabase(`
    SELECT table_name,
           (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
    FROM information_schema.tables t
    WHERE table_schema = 'public'
    ORDER BY table_name
  `);

  console.log(`Found ${tables.length} tables:`);
  for (const table of tables) {
    // Get row count for each table
    try {
      const count = await queryDatabase(`SELECT COUNT(*) as count FROM ${table.table_name}`);
      console.log(`  - ${table.table_name}: ${count[0].count} rows, ${table.column_count} columns`);
    } catch (e) {
      console.log(`  - ${table.table_name}: (error getting count), ${table.column_count} columns`);
    }
  }

  return tables;
}

async function dropAllTables() {
  console.log('🗑️ Dropping all tables from Railway database...');

  // First, get all tables
  const tables = await queryDatabase(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name
  `);

  console.log(`Found ${tables.length} tables to drop`);

  // Drop each table
  for (const table of tables) {
    try {
      await queryDatabase(`DROP TABLE IF EXISTS ${table.table_name} CASCADE`);
      console.log(`  ✅ Dropped table: ${table.table_name}`);
    } catch (error) {
      console.error(`  ❌ Failed to drop ${table.table_name}: ${error.message}`);
    }
  }

  // Verify all tables are gone
  const remaining = await queryDatabase(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
  `);

  if (remaining.length === 0) {
    console.log('✅ All tables successfully dropped!');
  } else {
    console.log(`⚠️ ${remaining.length} tables still remain:`, remaining.map(t => t.table_name));
  }
}

async function restoreLocalBackup() {
  console.log('📦 Restoring local backup to Railway database...');

  const backupFile = 'local_postgres_backup_20250926_103929.sql';

  if (!fs.existsSync(backupFile)) {
    throw new Error(`Backup file not found: ${backupFile}`);
  }

  console.log(`Reading backup file: ${backupFile}`);
  const backupContent = fs.readFileSync(backupFile, 'utf8');

  // Split into individual statements
  const statements = backupContent
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt && !stmt.startsWith('--') && stmt !== '');

  console.log(`Found ${statements.length} SQL statements to execute`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    try {
      await queryDatabase(statement);
      successCount++;
      if (i % 50 === 0) {
        console.log(`  Processed ${i}/${statements.length} statements...`);
      }
    } catch (error) {
      errorCount++;
      if (error.message.includes('already exists')) {
        // Ignore "already exists" errors
        console.log(`  ⚠️ Statement ${i}: already exists (ignored)`);
      } else {
        console.error(`  ❌ Statement ${i} failed: ${error.message}`);
      }
    }
  }

  console.log(`✅ Restoration complete: ${successCount} successful, ${errorCount} errors`);
}

async function main() {
  const operation = process.argv[2];

  console.log('🚀 Railway Database Admin Script');
  console.log('================================');

  try {
    switch (operation) {
      case 'list-tables':
        await listTables();
        break;
      case 'drop-all-tables':
        await dropAllTables();
        break;
      case 'restore-local-backup':
        await restoreLocalBackup();
        break;
      default:
        console.log('Available operations:');
        console.log('  node temp-admin-script.js list-tables');
        console.log('  node temp-admin-script.js drop-all-tables');
        console.log('  node temp-admin-script.js restore-local-backup');
        process.exit(1);
    }
  } catch (error) {
    console.error('❌ Operation failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}