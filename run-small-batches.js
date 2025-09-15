#!/usr/bin/env node

/**
 * Run small batch sync to make production same as local
 */

const fetch = require('node-fetch');

const BASE_URL = 'https://aistudio555jamstack-production.up.railway.app';
const SECRET_KEY = 'sync-2025-secure-key';

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runBatch(name, endpoint) {
  try {
    console.log(`\n📍 ${name}...`);
    const response = await fetch(`${BASE_URL}${endpoint}?key=${SECRET_KEY}`);
    const data = await response.json();

    if (data.success) {
      console.log(`   ✅ ${data.message}`);
      return true;
    } else {
      console.log(`   ❌ ${data.error || 'Unknown error'}`);
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Failed: ${error.message}`);
    return false;
  }
}

async function makeProductionSameAsLocal() {
  console.log('🚀 Making production database same as local...');
  console.log('   Target: ' + BASE_URL);
  console.log('   Waiting 30 seconds for deployment...\n');

  await delay(30000);

  const batches = [
    { name: 'Step 1: Fix consultations table', endpoint: '/api/sync-fix-consultations' },
    { name: 'Step 2: Add consultation services', endpoint: '/api/sync-add-consultation-services' },
    { name: 'Step 3: Add Russian FAQs', endpoint: '/api/sync-add-russian-faqs' },
    { name: 'Step 4: Add Hebrew FAQs', endpoint: '/api/sync-add-hebrew-faqs' },
    { name: 'Step 5: Add Russian resources', endpoint: '/api/sync-add-russian-resources' },
    { name: 'Step 6: Add Hebrew resources', endpoint: '/api/sync-add-hebrew-resources' }
  ];

  let success = 0;
  let failed = 0;

  for (const batch of batches) {
    const result = await runBatch(batch.name, batch.endpoint);
    if (result) success++;
    else failed++;

    // Wait 3 seconds between batches
    await delay(3000);
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 SYNC COMPLETE!');
  console.log('='.repeat(60));
  console.log(`✅ Successful: ${success}`);
  console.log(`❌ Failed: ${failed}`);

  if (success === batches.length) {
    console.log('\n🎉 SUCCESS! Production is now the same as local!');
  } else {
    console.log('\n⚠️  Some steps failed. Check the errors above.');
  }

  // Verify final state
  console.log('\n🔍 Verifying final state...');
  const verifyEndpoints = [
    { name: 'FAQs', endpoint: '/api/faqs' },
    { name: 'Consultations', endpoint: '/api/consultations' },
    { name: 'Career Resources', endpoint: '/api/career-resources' }
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

  console.log('\n✨ Production database sync complete!');
  console.log('📝 Expected counts:');
  console.log('   • FAQs: 12 items (4 EN + 4 RU + 4 HE)');
  console.log('   • Consultations: 0 items (contact form submissions)');
  console.log('   • Career Resources: 12 items (4 EN + 4 RU + 4 HE)');
  console.log('   • New table: consultation_services (3 service offerings)');
}

// Run the sync
makeProductionSameAsLocal().catch(err => {
  console.error('❌ Sync failed:', err);
  process.exit(1);
});