#!/usr/bin/env node

/**
 * RAILWAY DATABASE SYNC SCRIPT
 * Synchronizes local PostgreSQL database to Railway with duplicate prevention
 * Uses CREATE TABLE IF NOT EXISTS and INSERT ON CONFLICT strategies
 */

require('dotenv').config();
const { Client } = require('pg');
const fs = require('fs');

// Local database configuration
const localConfig = {
  connectionString: 'postgresql://postgres:postgres@localhost:5432/aistudio_db',
  ssl: false
};

// Railway database configuration
const railwayConfig = {
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:wQ7R2R6CtBP1NRPB9PgwPt7CBZfpRqmU@junction.proxy.rlwy.net:22159/railway',
  ssl: { rejectUnauthorized: false }
};

console.log('🔄 RAILWAY DATABASE SYNC SCRIPT');
console.log('================================');

async function queryLocal(query, params = []) {
  const client = new Client(localConfig);
  try {
    await client.connect();
    const result = await client.query(query, params);
    return result.rows;
  } catch (error) {
    console.error('Local DB error:', error.message);
    throw error;
  } finally {
    await client.end();
  }
}

async function queryRailway(query, params = []) {
  const client = new Client(railwayConfig);
  try {
    await client.connect();
    const result = await client.query(query, params);
    return result.rows;
  } catch (error) {
    console.error('Railway DB error:', error.message);
    throw error;
  } finally {
    await client.end();
  }
}

async function getTableSchema(tableName) {
  console.log(`📋 Getting schema for table: ${tableName}`);

  const schemaQuery = `
    SELECT
      column_name,
      data_type,
      is_nullable,
      column_default,
      character_maximum_length,
      numeric_precision,
      numeric_scale
    FROM information_schema.columns
    WHERE table_name = $1
    AND table_schema = 'public'
    ORDER BY ordinal_position;
  `;

  return await queryLocal(schemaQuery, [tableName]);
}

async function getTableConstraints(tableName) {
  const constraintQuery = `
    SELECT
      tc.constraint_name,
      tc.constraint_type,
      kcu.column_name,
      ccu.table_name AS foreign_table_name,
      ccu.column_name AS foreign_column_name
    FROM information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    LEFT JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
    WHERE tc.table_name = $1
    AND tc.table_schema = 'public';
  `;

  return await queryLocal(constraintQuery, [tableName]);
}

function buildCreateTableSQL(tableName, columns, constraints) {
  let sql = `CREATE TABLE IF NOT EXISTS ${tableName} (\n`;

  // Add columns
  const columnDefinitions = columns.map(col => {
    let def = `  ${col.column_name} `;

    // Data type
    if (col.data_type === 'character varying' && col.character_maximum_length) {
      def += `VARCHAR(${col.character_maximum_length})`;
    } else if (col.data_type === 'numeric' && col.numeric_precision) {
      def += `NUMERIC(${col.numeric_precision}${col.numeric_scale ? `,${col.numeric_scale}` : ''})`;
    } else {
      def += col.data_type.toUpperCase();
    }

    // Nullable
    if (col.is_nullable === 'NO') {
      def += ' NOT NULL';
    }

    // Default value
    if (col.column_default) {
      if (col.column_default.includes('nextval')) {
        // Handle sequences
        def += ` DEFAULT ${col.column_default}`;
      } else if (!col.column_default.includes('::')) {
        def += ` DEFAULT ${col.column_default}`;
      }
    }

    return def;
  });

  sql += columnDefinitions.join(',\n');

  // Add constraints
  const primaryKeys = constraints.filter(c => c.constraint_type === 'PRIMARY KEY');
  if (primaryKeys.length > 0) {
    const pkColumns = primaryKeys.map(pk => pk.column_name).join(', ');
    sql += `,\n  PRIMARY KEY (${pkColumns})`;
  }

  sql += '\n);';

  return sql;
}

function buildInsertSQL(tableName, columns, data) {
  if (data.length === 0) return null;

  const columnNames = columns.map(col => col.column_name);
  const placeholders = columnNames.map((_, i) => `$${i + 1}`).join(', ');

  // Determine primary key for ON CONFLICT
  let onConflictClause = '';
  if (columnNames.includes('id')) {
    const updateColumns = columnNames
      .filter(col => col !== 'id')
      .map(col => `${col} = EXCLUDED.${col}`)
      .join(', ');
    onConflictClause = `ON CONFLICT (id) DO UPDATE SET ${updateColumns}`;
  } else {
    onConflictClause = 'ON CONFLICT DO NOTHING';
  }

  return `
    INSERT INTO ${tableName} (${columnNames.join(', ')})
    VALUES (${placeholders})
    ${onConflictClause};
  `;
}

async function syncTable(tableName) {
  console.log(`\n🔄 Syncing table: ${tableName}`);
  console.log('=' .repeat(50));

  try {
    // Get table schema and data from local
    const columns = await getTableSchema(tableName);
    const constraints = await getTableConstraints(tableName);

    if (columns.length === 0) {
      console.log(`⚠️ Table ${tableName} not found in local database`);
      return;
    }

    // Create table structure on Railway
    const createSQL = buildCreateTableSQL(tableName, columns, constraints);
    console.log(`📝 Creating table structure...`);

    // Execute in a transaction block for Railway
    const createCommand = `
      DO $$
      BEGIN
        ${createSQL}

        -- Create sequences if needed
        ${columns
          .filter(col => col.column_default && col.column_default.includes('nextval'))
          .map(col => {
            const seqName = col.column_default.match(/nextval\('([^']+)'/)?.[1];
            return seqName ? `CREATE SEQUENCE IF NOT EXISTS ${seqName};` : '';
          })
          .filter(Boolean)
          .join('\n        ')}
      END $$;
    `;

    // For now, let's generate the SQL files instead of executing directly
    // since Railway connections are blocked
    return { tableName, createCommand, columns };

  } catch (error) {
    console.error(`❌ Error syncing ${tableName}:`, error.message);
    return null;
  }
}

async function generateSyncSQL() {
  console.log(`📋 Getting list of all local tables...`);

  const tablesQuery = `
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `;

  const tables = await queryLocal(tablesQuery);
  console.log(`Found ${tables.length} tables to sync`);

  let syncSQL = `-- RAILWAY DATABASE SYNC SCRIPT
-- Generated: ${new Date().toISOString()}
-- Tables: ${tables.length}

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

`;

  const syncResults = [];

  for (const table of tables) {
    const result = await syncTable(table.table_name);
    if (result) {
      syncSQL += `\n-- ========================================\n`;
      syncSQL += `-- TABLE: ${result.tableName}\n`;
      syncSQL += `-- ========================================\n`;
      syncSQL += result.createCommand + '\n';
      syncResults.push(result);
    }
  }

  // Save SQL to file
  fs.writeFileSync('railway-sync.sql', syncSQL);
  console.log(`\n✅ Sync SQL generated: railway-sync.sql`);

  return syncResults;
}

async function generateDataSync() {
  console.log(`\n📦 Generating data sync statements...`);

  const tablesQuery = `
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `;

  const tables = await queryLocal(tablesQuery);
  let dataSQL = `-- RAILWAY DATA SYNC SCRIPT
-- Generated: ${new Date().toISOString()}

`;

  for (const table of tables) {
    console.log(`📦 Processing data for: ${table.table_name}`);

    try {
      // Get row count first
      const countResult = await queryLocal(`SELECT COUNT(*) as count FROM ${table.table_name}`);
      const rowCount = parseInt(countResult[0].count);

      if (rowCount === 0) {
        console.log(`  ⚠️ No data in ${table.table_name}`);
        continue;
      }

      console.log(`  📊 ${rowCount} rows to sync`);

      // Get columns
      const columns = await getTableSchema(table.table_name);
      const columnNames = columns.map(col => col.column_name);

      // Get data
      const data = await queryLocal(`SELECT * FROM ${table.table_name} ORDER BY ${columnNames.includes('id') ? 'id' : columnNames[0]}`);

      dataSQL += `\n-- Data for ${table.table_name} (${rowCount} rows)\n`;

      // Generate INSERT statements with ON CONFLICT
      let onConflictClause;
      if (columnNames.includes('id')) {
        const updateCols = columnNames.filter(col => col !== 'id').map(col => `${col} = EXCLUDED.${col}`);
        onConflictClause = updateCols.length > 0 ? `ON CONFLICT (id) DO UPDATE SET ${updateCols.join(', ')}` : 'ON CONFLICT (id) DO NOTHING';
      } else {
        onConflictClause = 'ON CONFLICT DO NOTHING';
      }

      for (const row of data) {
        const values = columnNames.map(col => {
          const val = row[col];
          if (val === null) return 'NULL';
          if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
          if (typeof val === 'boolean') return val ? 'true' : 'false';
          if (val instanceof Date) return `'${val.toISOString()}'`;
          return val;
        });

        dataSQL += `INSERT INTO ${table.table_name} (${columnNames.join(', ')}) VALUES (${values.join(', ')}) ${onConflictClause};\n`;
      }

    } catch (error) {
      console.error(`  ❌ Error processing ${table.table_name}:`, error.message);
    }
  }

  fs.writeFileSync('railway-data-sync.sql', dataSQL);
  console.log(`✅ Data sync SQL generated: railway-data-sync.sql`);
}

async function main() {
  const operation = process.argv[2];

  console.log(`⏰ Started at: ${new Date().toISOString()}\n`);

  try {
    switch (operation) {
      case 'schema':
        await generateSyncSQL();
        break;

      case 'data':
        await generateDataSync();
        break;

      case 'full':
        await generateSyncSQL();
        await generateDataSync();
        break;

      default:
        console.log(`
📖 Usage: node railway-sync-script.js [operation]

Operations:
  schema  - Generate table structure sync SQL
  data    - Generate data sync SQL with duplicate prevention
  full    - Generate both schema and data sync SQL

Files generated:
  railway-sync.sql      - Table structures with CREATE TABLE IF NOT EXISTS
  railway-data-sync.sql - Data with INSERT ON CONFLICT handling

The generated SQL files can then be executed on Railway via their platform.
        `);
        process.exit(1);
    }

    console.log(`\n✅ Sync script completed successfully!`);
    console.log(`⏰ Finished at: ${new Date().toISOString()}`);

  } catch (error) {
    console.error(`\n❌ Sync script failed:`, error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}