/**
 * Quick test script for new API endpoints
 */

const axios = require('axios');

const API_BASE = 'http://localhost:3000';

async function testAPI(endpoint, description) {
  try {
    console.log(`\n🔍 Testing ${description}:`);
    const response = await axios.get(`${API_BASE}${endpoint}`);
    const data = response.data;
    const fieldCount = Object.keys(data).length;
    console.log(`✅ ${endpoint}: Working (${response.status}) - has ${fieldCount} fields`);
    
    if (fieldCount === 0) {
      console.log('⚠️  Warning: Empty response');
    } else {
      console.log(`   Sample fields: ${Object.keys(data).slice(0, 3).join(', ')}`);
    }
    
    return true;
  } catch (error) {
    console.log(`❌ ${endpoint}: Failed - ${error.message}`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Error: ${JSON.stringify(error.response.data, null, 2)}`);
    }
    return false;
  }
}

async function runTests() {
  console.log('🎯 TESTING NEW API ENDPOINTS');
  console.log('='.repeat(50));
  
  const endpoints = [
    { path: '/api/site-settings', desc: 'Site Settings' },
    { path: '/api/navigation-menu', desc: 'Navigation Menu' },
    { path: '/api/statistics', desc: 'Statistics' },
    { path: '/api/button-texts', desc: 'Button Texts' },
    { path: '/api/company-logos', desc: 'Company Logos' }
  ];
  
  let successCount = 0;
  
  for (const endpoint of endpoints) {
    const success = await testAPI(endpoint.path, endpoint.desc);
    if (success) successCount++;
    await new Promise(resolve => setTimeout(resolve, 500)); // Small delay
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`📊 RESULTS: ${successCount}/${endpoints.length} endpoints working`);
  
  if (successCount === endpoints.length) {
    console.log('🎉 ALL APIS WORKING!');
  } else {
    console.log('⚠️  Some APIs need fixes');
  }
}

// Run if called directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testAPI, runTests };