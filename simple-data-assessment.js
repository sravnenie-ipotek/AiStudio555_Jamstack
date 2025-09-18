#!/usr/bin/env node

// Simple Data Assessment - Using production connection pattern from server.js
const { Pool } = require('pg');

async function performAssessment() {
  console.log('\n📊 COMPREHENSIVE DATA ASSESSMENT FOR ND_ MIGRATION');
  console.log('=' .repeat(80));

  // Try to detect database connection from environment or Railway patterns
  let pool;
  let dbUrl = process.env.DATABASE_URL;

  // Check for common Railway patterns if DATABASE_URL isn't set
  if (!dbUrl) {
    console.log('⚠️  DATABASE_URL not found in environment.');
    console.log('💡 This assessment requires access to the production Railway database.');
    console.log('💡 Please set DATABASE_URL environment variable or run from Railway environment.');

    // Try to read from common config files or suggest manual setup
    console.log('\n🔧 To run this assessment:');
    console.log('1. Get your Railway database URL from the Railway dashboard');
    console.log('2. Export it: export DATABASE_URL="postgresql://..."');
    console.log('3. Re-run this script');

    process.exit(1);
  }

  console.log('🚀 Connecting to PostgreSQL database...');

  try {
    pool = new Pool({
      connectionString: dbUrl,
      ssl: dbUrl.includes('railway') ? { rejectUnauthorized: false } : false
    });

    // Test connection
    await pool.query('SELECT 1');
    console.log('✅ Database connection successful');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }

  const assessment = {
    timestamp: new Date().toISOString(),
    inventory: {},
    risks: [],
    duplicates: [],
    recommendations: []
  };

  // 1. DATA INVENTORY CHECK
  console.log('\n1️⃣  DATA INVENTORY CHECK');
  console.log('-'.repeat(50));

  const tablesToCheck = [
    // Legacy tables
    'home_pages',
    'blog_posts',
    'courses',
    'teachers',
    'about_pages',
    'contact_pages',
    'career_orientation_pages',
    'career_center_pages',

    // ND_ tables
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
    'nd_blog_posts',
    'nd_contact_page',
    'nd_career_orientation_page',
    'nd_career_center_page'
  ];

  for (const table of tablesToCheck) {
    try {
      const result = await pool.query(`SELECT COUNT(*) as count FROM ${table}`);
      const count = parseInt(result.rows[0].count);
      const isLegacy = !table.startsWith('nd_');

      assessment.inventory[table] = {
        exists: true,
        records: count,
        type: isLegacy ? 'legacy' : 'nd_',
        risk: count > 100 ? 'HIGH' : count > 10 ? 'MEDIUM' : 'LOW'
      };

      const icon = isLegacy ? '📊' : '🆕';
      const riskColor = count > 100 ? '🔥' : count > 10 ? '⚠️ ' : '✅';
      console.log(`${icon} ${table}: ${count} records ${riskColor}`);

    } catch (error) {
      assessment.inventory[table] = {
        exists: false,
        records: 0,
        type: table.startsWith('nd_') ? 'nd_' : 'legacy',
        error: error.message.includes('does not exist') ? 'missing' : 'error'
      };
      console.log(`❌ ${table}: Does not exist`);
    }
  }

  // 2. CRITICAL ANALYSIS
  console.log('\n2️⃣  CRITICAL ANALYSIS');
  console.log('-'.repeat(50));

  // High-volume legacy tables
  const highVolumeLegacy = Object.entries(assessment.inventory)
    .filter(([name, info]) => info.type === 'legacy' && info.exists && info.records > 50)
    .sort((a, b) => b[1].records - a[1].records);

  if (highVolumeLegacy.length > 0) {
    console.log('🔥 HIGH VOLUME LEGACY TABLES:');
    highVolumeLegacy.forEach(([name, info]) => {
      console.log(`   ${name}: ${info.records} records - MIGRATION RISK: ${info.risk}`);
      assessment.risks.push(`${name} has ${info.records} records - high data volume risk`);
    });
  }

  // ND_ tables with existing data
  const existingNdData = Object.entries(assessment.inventory)
    .filter(([name, info]) => info.type === 'nd_' && info.exists && info.records > 0);

  if (existingNdData.length > 0) {
    console.log('\n⚠️  ND_ TABLES WITH EXISTING DATA:');
    existingNdData.forEach(([name, info]) => {
      console.log(`   ${name}: ${info.records} records - POTENTIAL CONFLICTS`);
      assessment.risks.push(`${name} already contains ${info.records} records - conflict risk`);
    });
  }

  // Missing ND_ counterparts
  const legacyTablesWithoutNd = [];
  const legacyMappings = {
    'home_pages': ['nd_home', 'nd_home_page'],
    'courses': ['nd_courses'],
    'teachers': ['nd_teachers', 'nd_teachers_page'],
    'blog_posts': ['nd_blog_posts'],
    'about_pages': ['nd_about_page'],
    'contact_pages': ['nd_contact_page'],
    'career_orientation_pages': ['nd_career_orientation_page'],
    'career_center_pages': ['nd_career_center_page', 'nd_career_center_platform_page']
  };

  console.log('\n📋 LEGACY → ND_ TABLE MAPPING:');
  Object.entries(legacyMappings).forEach(([legacy, ndOptions]) => {
    const legacyInfo = assessment.inventory[legacy];
    if (legacyInfo?.exists) {
      const hasNdCounterpart = ndOptions.some(nd => assessment.inventory[nd]?.exists);
      if (hasNdCounterpart) {
        const ndTable = ndOptions.find(nd => assessment.inventory[nd]?.exists);
        const ndRecords = assessment.inventory[ndTable].records;
        console.log(`✅ ${legacy} (${legacyInfo.records}) → ${ndTable} (${ndRecords})`);

        if (ndRecords > 0) {
          assessment.duplicates.push(`${legacy}/${ndTable} both contain data`);
        }
      } else {
        console.log(`❌ ${legacy} (${legacyInfo.records}) → NO ND_ COUNTERPART`);
        legacyTablesWithoutNd.push(legacy);
        assessment.risks.push(`${legacy} has no nd_ counterpart table`);
      }
    }
  });

  // 3. ID CONFLICT DETECTION
  console.log('\n3️⃣  ID CONFLICT DETECTION');
  console.log('-'.repeat(50));

  const idConflictChecks = [
    ['home_pages', 'nd_home'],
    ['courses', 'nd_courses'],
    ['teachers', 'nd_teachers']
  ];

  for (const [legacy, nd] of idConflictChecks) {
    const legacyInfo = assessment.inventory[legacy];
    const ndInfo = assessment.inventory[nd];

    if (legacyInfo?.exists && ndInfo?.exists && ndInfo.records > 0) {
      try {
        const legacyIds = await pool.query(`SELECT id FROM ${legacy} ORDER BY id LIMIT 10`);
        const ndIds = await pool.query(`SELECT id FROM ${nd} ORDER BY id LIMIT 10`);

        const legacyIdSet = new Set(legacyIds.rows.map(r => r.id));
        const ndIdSet = new Set(ndIds.rows.map(r => r.id));

        const conflicts = [...legacyIdSet].filter(id => ndIdSet.has(id));

        if (conflicts.length > 0) {
          console.log(`⚠️  ${legacy} ↔️ ${nd}: ${conflicts.length} ID conflicts`);
          assessment.duplicates.push(`${legacy}/${nd} have ${conflicts.length} overlapping IDs`);
        } else {
          console.log(`✅ ${legacy} ↔️ ${nd}: No ID conflicts found`);
        }
      } catch (error) {
        console.log(`❌ Could not check IDs for ${legacy}/${nd}: ${error.message}`);
      }
    }
  }

  // 4. API USAGE IMPACT ANALYSIS
  console.log('\n4️⃣  API USAGE IMPACT ANALYSIS');
  console.log('-'.repeat(50));

  const apiCriticalTables = [
    'home_pages',    // Used in /api/home-page
    'courses',       // Used in /api/courses
    'teachers',      // Used in /api/teachers
    'career_orientation_pages', // Used in career API
    'career_center_pages'       // Used in career API
  ];

  console.log('🚨 TABLES WITH HIGH API USAGE:');
  apiCriticalTables.forEach(table => {
    const info = assessment.inventory[table];
    if (info?.exists) {
      console.log(`   ${table}: ${info.records} records - CRITICAL API DEPENDENCY`);
      assessment.risks.push(`${table} is critical for API functionality (${info.records} records)`);
    }
  });

  // 5. MIGRATION RECOMMENDATIONS
  console.log('\n5️⃣  MIGRATION RECOMMENDATIONS');
  console.log('-'.repeat(50));

  const totalRisks = assessment.risks.length;
  const totalConflicts = assessment.duplicates.length;
  const hasHighVolume = highVolumeLegacy.length > 0;
  const hasExistingNdData = existingNdData.length > 0;

  let recommendation;
  let migrationStrategy;

  if (totalRisks > 10 || hasHighVolume || hasExistingNdData) {
    recommendation = '🛑 DO NOT PROCEED - CRITICAL ISSUES FOUND';
    migrationStrategy = 'FULL ASSESSMENT AND PLANNING REQUIRED';
  } else if (totalRisks > 5) {
    recommendation = '⚠️  PROCEED WITH EXTREME CAUTION';
    migrationStrategy = 'STEP-BY-STEP MIGRATION WITH BACKUPS';
  } else {
    recommendation = '✅ PROCEED WITH STANDARD PRECAUTIONS';
    migrationStrategy = 'STAGED MIGRATION WITH MONITORING';
  }

  console.log(`📊 Risk Assessment: ${totalRisks} risks, ${totalConflicts} conflicts`);
  console.log(`💡 Recommendation: ${recommendation}`);
  console.log(`🔧 Strategy: ${migrationStrategy}`);

  // Generate migration order
  const migrationOrder = Object.entries(assessment.inventory)
    .filter(([name, info]) => info.type === 'legacy' && info.exists)
    .sort((a, b) => a[1].records - b[1].records) // Lowest risk first
    .map(([name, info], index) => ({
      order: index + 1,
      table: name,
      records: info.records,
      risk: info.risk,
      hasNdCounterpart: legacyMappings[name] ?
        legacyMappings[name].some(nd => assessment.inventory[nd]?.exists) : false
    }));

  console.log('\n📋 RECOMMENDED MIGRATION ORDER (lowest risk first):');
  migrationOrder.forEach(item => {
    const status = item.hasNdCounterpart ? '✅' : '❌';
    console.log(`   ${item.order}. ${item.table} (${item.records} records, ${item.risk} risk) ${status}`);
  });

  // 6. FINAL SUMMARY
  console.log('\n6️⃣  EXECUTIVE SUMMARY');
  console.log('=' .repeat(50));

  const summary = {
    total_legacy_tables: Object.values(assessment.inventory).filter(t => t.type === 'legacy' && t.exists).length,
    total_legacy_records: Object.values(assessment.inventory)
      .filter(t => t.type === 'legacy' && t.exists)
      .reduce((sum, t) => sum + t.records, 0),
    total_nd_tables: Object.values(assessment.inventory).filter(t => t.type === 'nd_' && t.exists).length,
    total_nd_records: Object.values(assessment.inventory)
      .filter(t => t.type === 'nd_' && t.exists)
      .reduce((sum, t) => sum + t.records, 0),
    high_risk_tables: highVolumeLegacy.length,
    existing_nd_data_tables: existingNdData.length,
    missing_nd_tables: legacyTablesWithoutNd.length,
    total_risks: totalRisks,
    recommendation: recommendation
  };

  console.log(`📊 Legacy Tables: ${summary.total_legacy_tables} (${summary.total_legacy_records} total records)`);
  console.log(`🆕 ND_ Tables: ${summary.total_nd_tables} (${summary.total_nd_records} total records)`);
  console.log(`🔥 High Risk Tables: ${summary.high_risk_tables}`);
  console.log(`⚠️  Existing ND_ Data: ${summary.existing_nd_data_tables} tables`);
  console.log(`❌ Missing ND_ Tables: ${summary.missing_nd_tables}`);
  console.log(`🚨 Total Risk Factors: ${summary.total_risks}`);

  // Save detailed report
  const reportPath = '/Users/michaelmishayev/Desktop/newCode/migration-assessment-report.json';
  const fullReport = {
    ...assessment,
    summary,
    migrationOrder,
    recommendation,
    strategy: migrationStrategy
  };

  require('fs').writeFileSync(reportPath, JSON.stringify(fullReport, null, 2));

  console.log(`\n💾 Detailed report saved to: migration-assessment-report.json`);
  console.log('\n' + '='.repeat(80));
  console.log(`🎯 FINAL RECOMMENDATION: ${recommendation}`);
  console.log('=' .repeat(80));

  if (totalRisks > 5 || hasExistingNdData) {
    console.log('\n🚨 CRITICAL ACTIONS REQUIRED BEFORE MIGRATION:');
    if (hasExistingNdData) {
      console.log('   1. Backup existing nd_ table data');
      console.log('   2. Decide on data merge vs. replacement strategy');
    }
    if (hasHighVolume) {
      console.log('   3. Create full database backup');
      console.log('   4. Plan for extended downtime during migration');
    }
    console.log('   5. Test migration on a database copy first');
    console.log('   6. Prepare rollback procedures');
  }

  await pool.end();

  return totalRisks < 5 && !hasExistingNdData ? 0 : 1;
}

// Run assessment
performAssessment()
  .then(exitCode => process.exit(exitCode))
  .catch(error => {
    console.error('\n💥 ASSESSMENT FAILED:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Verify DATABASE_URL is correct');
    console.log('   2. Check database connectivity');
    console.log('   3. Ensure proper permissions');
    process.exit(1);
  });