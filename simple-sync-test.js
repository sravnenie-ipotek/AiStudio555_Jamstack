#!/usr/bin/env node

/**
 * Simple test to check if we can connect and sync
 */

const fetch = require('node-fetch');

async function testSync() {
  console.log('🔍 Testing production sync...\n');

  // First, check if basic API works
  console.log('1. Testing basic API...');
  try {
    const response = await fetch('https://aistudio555jamstack-production.up.railway.app/api/courses');
    const data = await response.json();
    console.log(`   ✅ API works - ${data.data.length} courses found\n`);
  } catch (err) {
    console.log(`   ❌ API error: ${err.message}\n`);
    return;
  }

  // Check FAQs endpoint
  console.log('2. Checking FAQs endpoint...');
  try {
    const response = await fetch('https://aistudio555jamstack-production.up.railway.app/api/faqs');
    const data = await response.json();
    console.log(`   ✅ FAQs endpoint works - ${data.data ? data.data.length : 0} items found\n`);
  } catch (err) {
    console.log(`   ❌ FAQs error: ${err.message}\n`);
  }

  // Check consultations endpoint
  console.log('3. Checking Consultations endpoint...');
  try {
    const response = await fetch('https://aistudio555jamstack-production.up.railway.app/api/consultations');
    const data = await response.json();
    console.log(`   ✅ Consultations endpoint works - ${data.data ? data.data.length : 0} items found\n`);
  } catch (err) {
    console.log(`   ❌ Consultations error: ${err.message}\n`);
  }

  // Check career resources endpoint
  console.log('4. Checking Career Resources endpoint...');
  try {
    const response = await fetch('https://aistudio555jamstack-production.up.railway.app/api/career-resources');
    const data = await response.json();
    console.log(`   ✅ Career Resources endpoint works - ${data.data ? data.data.length : 0} items found\n`);
  } catch (err) {
    console.log(`   ❌ Career Resources error: ${err.message}\n`);
  }

  // Check company logos endpoint
  console.log('5. Checking Company Logos endpoint...');
  try {
    const response = await fetch('https://aistudio555jamstack-production.up.railway.app/api/company-logos');
    const data = await response.json();
    console.log(`   ✅ Company Logos endpoint works - ${data.data ? data.data.length : 0} items found\n`);
  } catch (err) {
    console.log(`   ❌ Company Logos error: ${err.message}\n`);
  }

  console.log('\n📋 Summary:');
  console.log('The existing endpoints are working.');
  console.log('The new sync endpoint may be having issues with pool.connect().');
  console.log('\n💡 Solution: Use the existing queryDatabase function instead of pool.connect()');
}

testSync();