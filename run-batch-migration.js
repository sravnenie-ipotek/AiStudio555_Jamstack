#!/usr/bin/env node

/**
 * Run batch migrations in sequence with delays
 */

const fetch = require('node-fetch');

const BASE_URL = 'https://aistudio555jamstack-production.up.railway.app';
const SECRET_KEY = 'sync-2025-secure-key';

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runEndpoint(name, endpoint) {
  try {
    console.log(`\n📍 Running: ${name}...`);
    const response = await fetch(`${BASE_URL}${endpoint}?key=${SECRET_KEY}`);
    const data = await response.json();

    if (data.success) {
      console.log(`   ✅ ${data.message}`);
    } else {
      console.log(`   ❌ Error: ${data.error || 'Unknown error'}`);
    }

    return data.success;
  } catch (error) {
    console.log(`   ❌ Failed: ${error.message}`);
    return false;
  }
}

async function runBatchMigration() {
  console.log('🚀 Starting batch migration to production...');
  console.log('   Target: ' + BASE_URL);
  console.log('   Waiting 30 seconds for deployment to complete...\n');

  await delay(30000);

  const migrations = [
    { name: 'Step 1: Create Tables', endpoint: '/api/sync-create-tables' },
    { name: 'Step 2: Insert FAQs (batch 1)', endpoint: '/api/sync-faqs-batch1' },
    { name: 'Step 3: Insert FAQs (batch 2)', endpoint: '/api/sync-faqs-batch2' },
    { name: 'Step 4: Insert Consultations', endpoint: '/api/sync-consultations-batch' },
    { name: 'Step 5: Insert Resources (batch 1)', endpoint: '/api/sync-resources-batch1' },
    { name: 'Step 6: Insert Resources (batch 2)', endpoint: '/api/sync-resources-batch2' },
    { name: 'Step 7: Insert Company Logo', endpoint: '/api/sync-logo-batch' }
  ];

  let successCount = 0;
  let failCount = 0;

  for (const migration of migrations) {
    const success = await runEndpoint(migration.name, migration.endpoint);

    if (success) {
      successCount++;
    } else {
      failCount++;
    }

    // Wait 2 seconds between each request
    await delay(2000);
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 Migration Complete!');
  console.log('='.repeat(50));
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);

  // Verify final state
  console.log('\n🔍 Verifying final state...');

  const verifyEndpoints = [
    { name: 'FAQs', endpoint: '/api/faqs' },
    { name: 'Consultations', endpoint: '/api/consultations' },
    { name: 'Career Resources', endpoint: '/api/career-resources' },
    { name: 'Company Logos', endpoint: '/api/company-logos' }
  ];

  for (const verify of verifyEndpoints) {
    try {
      const response = await fetch(`${BASE_URL}${verify.endpoint}`);
      const data = await response.json();
      const count = data.data ? data.data.length : 0;
      console.log(`   ${verify.name}: ${count} items`);
    } catch (err) {
      console.log(`   ${verify.name}: Error checking`);
    }
  }

  console.log('\n✅ Migration process complete!');
}

// Run the migration
runBatchMigration().catch(err => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});