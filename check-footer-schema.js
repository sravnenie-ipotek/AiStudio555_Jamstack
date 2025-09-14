/**
 * Check Footer Database Schema
 * Inspect the actual structure of footer-related tables
 */

const { Client } = require('pg');

async function checkFooterSchema() {
  let client;

  try {
    const dbConfig = {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    };

    console.log('🔍 Connecting to database to inspect schema...');

    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable not set');
    }

    client = new Client(dbConfig);
    await client.connect();

    console.log('✅ Connected to database');

    // Check what tables exist
    console.log('\n📋 Available tables:');
    const tables = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name LIKE '%footer%'
      ORDER BY table_name
    `);

    if (tables.rows.length === 0) {
      console.log('No footer tables found. Let me check all tables:');
      const allTables = await client.query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        ORDER BY table_name
      `);
      console.table(allTables.rows);
    } else {
      console.table(tables.rows);

      // Check schema for each footer table
      for (const table of tables.rows) {
        console.log(`\n📊 Schema for table '${table.table_name}':`);
        const schema = await client.query(`
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns
          WHERE table_name = $1
          AND table_schema = 'public'
          ORDER BY ordinal_position
        `, [table.table_name]);
        console.table(schema.rows);

        // Show sample data
        console.log(`\n📄 Sample data from '${table.table_name}':`);
        try {
          const sample = await client.query(`SELECT * FROM ${table.table_name} LIMIT 3`);
          console.table(sample.rows);
        } catch (e) {
          console.log(`Error reading sample data: ${e.message}`);
        }
      }
    }

  } catch (error) {
    console.error('❌ Error checking schema:', error);
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

// Run the check
checkFooterSchema().catch(console.error);