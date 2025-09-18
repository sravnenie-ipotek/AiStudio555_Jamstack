#!/usr/bin/env node

const express = require('express');
const fs = require('fs');

// Database connection setup
let queryDatabase;

// Force Railway connection for assessment (we need production data)
if (process.env.DATABASE_URL || process.env.RAILWAY_DATABASE_URL) {
  console.log('🚀 Connecting to Railway PostgreSQL database...');

  const dbUrl = process.env.DATABASE_URL || process.env.RAILWAY_DATABASE_URL;

  if (!dbUrl) {
    console.error('❌ No DATABASE_URL found. Set your Railway database URL as environment variable.');
    console.log('💡 Run: export DATABASE_URL="your_railway_postgres_url"');
    process.exit(1);
  }

  const { Pool } = require('pg');
  const pool = new Pool({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
  });

  queryDatabase = async (query, params = []) => {
    try {
      const result = await pool.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('PostgreSQL Query Error:', error);
      throw error;
    }
  };
} else {
  console.error('❌ This assessment requires access to the production Railway database.');
  console.log('💡 Set DATABASE_URL environment variable with your Railway PostgreSQL connection string.');
  console.log('💡 Run: export DATABASE_URL="postgresql://username:password@host:port/database"');
  process.exit(1);
}

async function performDataAssessment() {
  console.log('\n📊 COMPREHENSIVE DATA ASSESSMENT FOR ND_ MIGRATION');
  console.log('=' .repeat(80));

  const assessment = {
    inventory: {},
    schemas: {},
    risks: {},
    duplicates: {},
    migrationOrder: []
  };

  // 1. DATA INVENTORY CHECK
  console.log('\n1️⃣  DATA INVENTORY CHECK');
  console.log('-'.repeat(40));

  const legacyTables = [
    'home_pages',
    'blog_posts',
    'courses',
    'teachers',
    'about_pages',
    'contact_pages',
    'career_orientation_pages',
    'career_center_pages'
  ];

  const ndTables = [
    'nd_home',
    'nd_courses',
    'nd_menu',
    'nd_footer',
    'nd_pricing_page',
    'nd_teachers_page',
    'nd_career_center_platform_page',
    'nd_teachers',
    'nd_home_page',
    'nd_about_page',
    'nd_contact_page',
    'nd_career_orientation_page',
    'nd_career_center_page'
  ];

  // Check legacy tables
  for (const table of legacyTables) {
    try {
      const result = await queryDatabase(`SELECT COUNT(*) as count FROM ${table}`);
      const count = result[0].count;
      assessment.inventory[table] = {
        exists: true,
        records: count,
        type: 'legacy'
      };
      console.log(`✅ ${table}: ${count} records`);
    } catch (error) {
      assessment.inventory[table] = {
        exists: false,
        records: 0,
        type: 'legacy',
        error: error.message
      };
      console.log(`❌ ${table}: Table doesn't exist or error - ${error.message}`);
    }
  }

  console.log('\n📋 ND_ TABLES STATUS:');
  // Check nd_ tables
  for (const table of ndTables) {
    try {
      const result = await queryDatabase(`SELECT COUNT(*) as count FROM ${table}`);
      const count = result[0].count;
      assessment.inventory[table] = {
        exists: true,
        records: count,
        type: 'nd_'
      };
      console.log(`✅ ${table}: ${count} records`);
    } catch (error) {
      assessment.inventory[table] = {
        exists: false,
        records: 0,
        type: 'nd_',
        error: error.message
      };
      console.log(`❌ ${table}: Table doesn't exist - ${error.message}`);
    }
  }

  // 2. SCHEMA COMPARISON
  console.log('\n2️⃣  SCHEMA COMPARISON');
  console.log('-'.repeat(40));

  // Get table schemas (PostgreSQL vs SQLite have different approaches)
  try {
    let schemaQuery;
    if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost')) {
      // PostgreSQL schema query
      schemaQuery = `
        SELECT table_name, column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND (table_name LIKE '%pages' OR table_name LIKE 'courses' OR table_name LIKE 'teachers' OR table_name LIKE 'blog_posts' OR table_name LIKE 'nd_%')
        ORDER BY table_name, ordinal_position
      `;
    } else {
      // SQLite schema query
      schemaQuery = `
        SELECT name as table_name FROM sqlite_master
        WHERE type='table'
        AND (name LIKE '%pages' OR name LIKE 'courses' OR name LIKE 'teachers' OR name LIKE 'blog_posts' OR name LIKE 'nd_%')
      `;
    }

    const schemaResults = await queryDatabase(schemaQuery);
    console.log(`📋 Found ${schemaResults.length} relevant tables/columns in schema`);

    // Group by table for comparison
    const tableSchemas = {};
    for (const row of schemaResults) {
      if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost')) {
        // PostgreSQL result structure
        const tableName = row.table_name;
        if (!tableSchemas[tableName]) {
          tableSchemas[tableName] = [];
        }
        tableSchemas[tableName].push({
          column: row.column_name,
          type: row.data_type,
          nullable: row.is_nullable
        });
      } else {
        // SQLite - need individual PRAGMA queries for each table
        const tableName = row.table_name;
        try {
          const columns = await queryDatabase(`PRAGMA table_info(${tableName})`);
          tableSchemas[tableName] = columns.map(col => ({
            column: col.name,
            type: col.type,
            nullable: col.notnull === 0
          }));
        } catch (err) {
          console.log(`⚠️  Could not get schema for ${tableName}: ${err.message}`);
        }
      }
    }

    assessment.schemas = tableSchemas;

    // Identify potential schema mismatches
    const legacyToNdMapping = {
      'home_pages': ['nd_home', 'nd_home_page'],
      'courses': ['nd_courses'],
      'teachers': ['nd_teachers', 'nd_teachers_page'],
      'blog_posts': ['nd_blog_posts'],
      'about_pages': ['nd_about_page'],
      'contact_pages': ['nd_contact_page'],
      'career_orientation_pages': ['nd_career_orientation_page'],
      'career_center_pages': ['nd_career_center_page', 'nd_career_center_platform_page']
    };

    console.log('\n🔍 SCHEMA COMPARISON RESULTS:');
    for (const [legacy, ndVariants] of Object.entries(legacyToNdMapping)) {
      if (tableSchemas[legacy]) {
        console.log(`\n📋 ${legacy} (${tableSchemas[legacy].length} columns)`);

        for (const ndTable of ndVariants) {
          if (tableSchemas[ndTable]) {
            const legacyColumns = new Set(tableSchemas[legacy].map(c => c.column));
            const ndColumns = new Set(tableSchemas[ndTable].map(c => c.column));

            const onlyInLegacy = [...legacyColumns].filter(c => !ndColumns.has(c));
            const onlyInNd = [...ndColumns].filter(c => !legacyColumns.has(c));

            console.log(`  ↔️  ${ndTable} (${tableSchemas[ndTable].length} columns)`);
            if (onlyInLegacy.length > 0) {
              console.log(`    ⚠️  Columns only in legacy: ${onlyInLegacy.join(', ')}`);
            }
            if (onlyInNd.length > 0) {
              console.log(`    ℹ️  Columns only in nd_: ${onlyInNd.join(', ')}`);
            }
            if (onlyInLegacy.length === 0 && onlyInNd.length === 0) {
              console.log(`    ✅ Schemas match perfectly`);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error(`❌ Schema comparison failed: ${error.message}`);
  }

  // 3. RISK ASSESSMENT
  console.log('\n3️⃣  RISK ASSESSMENT');
  console.log('-'.repeat(40));

  const riskFactors = [];

  // High-volume tables (highest risk)
  const highVolumeTables = Object.entries(assessment.inventory)
    .filter(([name, info]) => info.type === 'legacy' && info.records > 100)
    .sort((a, b) => b[1].records - a[1].records);

  if (highVolumeTables.length > 0) {
    console.log('🔥 HIGH VOLUME TABLES (>100 records):');
    highVolumeTables.forEach(([name, info]) => {
      console.log(`  📊 ${name}: ${info.records} records - HIGH RISK`);
      riskFactors.push(`${name} has ${info.records} records - data loss risk`);
    });
  }

  // Check API usage patterns from server.js grep results
  const criticalTables = ['home_pages', 'courses', 'teachers', 'career_orientation_pages', 'career_center_pages'];
  console.log('\n🔗 API USAGE ANALYSIS:');

  criticalTables.forEach(table => {
    const info = assessment.inventory[table];
    if (info && info.exists) {
      console.log(`  🚨 ${table}: CRITICAL - Heavy API usage (${info.records} records)`);
      riskFactors.push(`${table} is heavily used in API endpoints`);
    }
  });

  // Check for existing nd_ tables with data
  const existingNdTables = Object.entries(assessment.inventory)
    .filter(([name, info]) => info.type === 'nd_' && info.exists && info.records > 0);

  if (existingNdTables.length > 0) {
    console.log('\n⚠️  ND_ TABLES WITH EXISTING DATA:');
    existingNdTables.forEach(([name, info]) => {
      console.log(`  📋 ${name}: ${info.records} records - CONFLICT RISK`);
      riskFactors.push(`${name} already has ${info.records} records - potential conflicts`);
    });
  }

  assessment.risks = riskFactors;

  // 4. DUPLICATE DETECTION
  console.log('\n4️⃣  DUPLICATE DETECTION');
  console.log('-'.repeat(40));

  const duplicateChecks = [];

  // Check for overlapping IDs between legacy and nd_ tables
  const mappings = {
    'home_pages': 'nd_home',
    'courses': 'nd_courses',
    'teachers': 'nd_teachers'
  };

  for (const [legacy, nd] of Object.entries(mappings)) {
    const legacyInfo = assessment.inventory[legacy];
    const ndInfo = assessment.inventory[nd];

    if (legacyInfo?.exists && ndInfo?.exists && ndInfo.records > 0) {
      try {
        const legacyIds = await queryDatabase(`SELECT id FROM ${legacy} ORDER BY id`);
        const ndIds = await queryDatabase(`SELECT id FROM ${nd} ORDER BY id`);

        const legacyIdSet = new Set(legacyIds.map(r => r.id));
        const ndIdSet = new Set(ndIds.map(r => r.id));

        const overlapping = [...legacyIdSet].filter(id => ndIdSet.has(id));

        if (overlapping.length > 0) {
          console.log(`⚠️  ${legacy} ↔️ ${nd}: ${overlapping.length} overlapping IDs`);
          duplicateChecks.push(`${legacy}/${nd} have ${overlapping.length} overlapping IDs: ${overlapping.slice(0, 10).join(', ')}`);
        } else {
          console.log(`✅ ${legacy} ↔️ ${nd}: No ID conflicts`);
        }
      } catch (error) {
        console.log(`❌ Could not check IDs for ${legacy}/${nd}: ${error.message}`);
      }
    }
  }

  assessment.duplicates = duplicateChecks;

  // 5. MIGRATION ORDER RECOMMENDATION
  console.log('\n5️⃣  MIGRATION ORDER RECOMMENDATION');
  console.log('-'.repeat(40));

  const migrationOrder = [];

  // Sort tables by risk level (lowest risk first)
  const tablesByRisk = Object.entries(assessment.inventory)
    .filter(([name, info]) => info.type === 'legacy' && info.exists)
    .sort((a, b) => a[1].records - b[1].records);

  console.log('📋 RECOMMENDED MIGRATION SEQUENCE:');

  tablesByRisk.forEach(([tableName, info], index) => {
    const riskLevel = info.records > 100 ? 'HIGH' : info.records > 10 ? 'MEDIUM' : 'LOW';
    const priority = info.records < 10 ? 'SAFE TO START' : criticalTables.includes(tableName) ? 'CRITICAL - BACKUP FIRST' : 'MODERATE RISK';

    console.log(`  ${index + 1}. ${tableName} (${info.records} records) - ${riskLevel} RISK - ${priority}`);

    migrationOrder.push({
      table: tableName,
      records: info.records,
      risk: riskLevel,
      priority: priority,
      order: index + 1
    });
  });

  assessment.migrationOrder = migrationOrder;

  // 6. FINAL SUMMARY AND BLOCKERS
  console.log('\n6️⃣  CRITICAL ISSUES & BLOCKERS');
  console.log('-'.repeat(40));

  const blockers = [];

  // Check for critical blockers
  if (highVolumeTables.length > 0) {
    blockers.push(`HIGH VOLUME DATA: ${highVolumeTables.length} tables have >100 records`);
  }

  if (existingNdTables.length > 0) {
    blockers.push(`EXISTING ND_ DATA: ${existingNdTables.length} nd_ tables already contain data`);
  }

  if (duplicateChecks.length > 0) {
    blockers.push(`ID CONFLICTS: ${duplicateChecks.length} potential duplicate ID issues`);
  }

  // Check for missing nd_ table structures
  const missingNdTables = [];
  const expectedNdTables = {
    'home_pages': 'nd_home_page',
    'blog_posts': 'nd_blog_posts',
    'about_pages': 'nd_about_page',
    'contact_pages': 'nd_contact_page'
  };

  for (const [legacy, expected] of Object.entries(expectedNdTables)) {
    if (assessment.inventory[legacy]?.exists && !assessment.inventory[expected]?.exists) {
      missingNdTables.push(expected);
    }
  }

  if (missingNdTables.length > 0) {
    blockers.push(`MISSING ND_ TABLES: ${missingNdTables.join(', ')} need to be created`);
  }

  console.log(blockers.length > 0 ? '🚨 CRITICAL BLOCKERS FOUND:' : '✅ NO CRITICAL BLOCKERS');
  blockers.forEach((blocker, i) => {
    console.log(`  ${i + 1}. ${blocker}`);
  });

  // Save detailed report
  const reportData = {
    timestamp: new Date().toISOString(),
    database: process.env.DATABASE_URL ? 'PostgreSQL (Railway)' : 'SQLite (Local)',
    summary: {
      total_legacy_tables: Object.values(assessment.inventory).filter(t => t.type === 'legacy' && t.exists).length,
      total_legacy_records: Object.values(assessment.inventory).filter(t => t.type === 'legacy' && t.exists).reduce((sum, t) => sum + t.records, 0),
      total_nd_tables: Object.values(assessment.inventory).filter(t => t.type === 'nd_' && t.exists).length,
      total_nd_records: Object.values(assessment.inventory).filter(t => t.type === 'nd_' && t.exists).reduce((sum, t) => sum + t.records, 0),
      risk_factors: riskFactors.length,
      duplicate_issues: duplicateChecks.length,
      critical_blockers: blockers.length
    },
    ...assessment,
    blockers: blockers,
    recommendation: blockers.length > 0 ? 'DO NOT PROCEED - Resolve blockers first' : 'SAFE TO PROCEED with caution'
  };

  fs.writeFileSync('/Users/michaelmishayev/Desktop/newCode/migration-assessment-report.json', JSON.stringify(reportData, null, 2));

  console.log('\n' + '='.repeat(80));
  console.log('📋 ASSESSMENT COMPLETE');
  console.log('='.repeat(80));
  console.log(`📊 Total Legacy Records: ${reportData.summary.total_legacy_records}`);
  console.log(`📋 Total ND_ Records: ${reportData.summary.total_nd_records}`);
  console.log(`⚠️  Risk Factors: ${reportData.summary.risk_factors}`);
  console.log(`🚨 Critical Blockers: ${reportData.summary.critical_blockers}`);
  console.log(`💡 Recommendation: ${reportData.recommendation}`);
  console.log('\n📁 Detailed report saved to: migration-assessment-report.json');

  if (blockers.length > 0) {
    console.log('\n🛑 DO NOT PROCEED WITH MIGRATION UNTIL BLOCKERS ARE RESOLVED!');
    process.exit(1);
  } else {
    console.log('\n✅ Assessment complete - Ready for careful migration');
    process.exit(0);
  }
}

// Run assessment
performDataAssessment().catch(error => {
  console.error('💥 Assessment failed:', error);
  process.exit(1);
});