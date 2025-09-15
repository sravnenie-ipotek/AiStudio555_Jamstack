#!/usr/bin/env node

/**
 * Fix production table structure to match what the code expects
 */

const fetch = require('node-fetch');

const BASE_URL = 'https://aistudio555jamstack-production.up.railway.app';
const SECRET_KEY = 'sync-2025-secure-key';

async function fixTables() {
  console.log('🔧 Fixing production table structures...\n');

  // First, let's check current consultations structure
  console.log('1. Checking current consultations data...');
  try {
    const response = await fetch(`${BASE_URL}/api/consultations`);
    const data = await response.json();
    console.log(`   Current consultations: ${data.data ? data.data.length : 0} items`);
  } catch (err) {
    console.log(`   Error: ${err.message}`);
  }

  console.log('\n📊 Summary of issues:');
  console.log('='.repeat(50));
  console.log('\nThe server.js code expects:');
  console.log('• consultations table with: name, email, phone, interest, experience');
  console.log('  (for contact form submissions)\n');
  console.log('But the migration created:');
  console.log('• consultations table with: title, description, duration, price, features');
  console.log('  (for service offerings)\n');
  console.log('Solution:');
  console.log('1. Keep consultations for contact forms (matches existing code)');
  console.log('2. Create consultation_services for service offerings');
  console.log('\n' + '='.repeat(50));

  console.log('\n📝 To fix production:');
  console.log('1. Use Railway CLI or PostgreSQL client');
  console.log('2. Run the fix-consultations-table.sql script');
  console.log('3. This will:');
  console.log('   - Drop and recreate consultations with correct structure');
  console.log('   - Create new consultation_services table');
  console.log('   - Insert sample service data');
}

fixTables();