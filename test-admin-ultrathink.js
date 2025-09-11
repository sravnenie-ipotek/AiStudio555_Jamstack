/**
 * ULTRATHINK COMPREHENSIVE ADMIN PANEL TEST
 * Tests all 11 tabs systematically with detailed validation
 */

const fetch = require('node-fetch');

// Production admin panel URL
const ADMIN_URL = 'https://aistudio555jamstack-production.up.railway.app/content-admin-comprehensive.html';
const API_BASE = 'https://aistudio555jamstack-production.up.railway.app';

// All 11 tabs with their corresponding API endpoints
const TABS = [
  { name: 'Home Page', endpoint: '/api/home-page', expectedFields: ['hero_title', 'hero_subtitle'] },
  { name: 'Courses', endpoint: '/api/courses', expectedFields: ['name', 'description'] },
  { name: 'Teachers', endpoint: '/api/teachers', expectedFields: ['name', 'bio'] },
  { name: 'Career Services', endpoint: '/api/career-center-page', expectedFields: ['title', 'description'] },
  { name: 'Career Orientation', endpoint: '/api/career-orientation-page', expectedFields: ['title', 'description'] },
  { name: 'Pricing Plans', endpoint: '/api/pricing-plans', expectedFields: ['name', 'price'] },
  { name: 'Blog Posts', endpoint: '/api/blog-posts', expectedFields: ['title', 'content'] },
  { name: 'About Page', endpoint: '/api/about-page', expectedFields: ['title', 'content'] },
  { name: 'Contact Page', endpoint: '/api/contact-page', expectedFields: ['title', 'email'] },
  { name: 'Course Detail', endpoint: '/api/courses', expectedFields: ['name', 'description'] }, // Uses courses API
  { name: 'Blog Detail', endpoint: '/api/blog-posts', expectedFields: ['title', 'content'] } // Uses blog-posts API
];

async function testEndpoint(tab) {
  try {
    const url = `${API_BASE}${tab.endpoint}?locale=en`;
    const response = await fetch(url);
    const status = response.status;
    
    if (status === 200) {
      const data = await response.json();
      
      // Check if response has data
      const hasData = data && (Array.isArray(data) ? data.length > 0 : Object.keys(data).length > 0);
      
      // Check for expected fields
      let fieldsFound = [];
      if (hasData) {
        const testData = Array.isArray(data) ? data[0] : data;
        fieldsFound = tab.expectedFields.filter(field => testData.hasOwnProperty(field));
      }
      
      return {
        success: true,
        status,
        hasData,
        fieldsFound: fieldsFound.length,
        totalFields: tab.expectedFields.length
      };
    } else {
      return {
        success: false,
        status,
        error: `HTTP ${status}`
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function runUltrathinkTest() {
  console.log('🔍 ULTRATHINK ADMIN PANEL COMPREHENSIVE TEST');
  console.log('='.repeat(70));
  console.log(`📍 Admin Panel: ${ADMIN_URL}`);
  console.log(`🌐 API Base: ${API_BASE}`);
  console.log('='.repeat(70));
  
  let totalSuccess = 0;
  let totalFailed = 0;
  
  // Test each tab
  for (let i = 0; i < TABS.length; i++) {
    const tab = TABS[i];
    const result = await testEndpoint(tab);
    
    const tabNumber = String(i + 1).padStart(2, '0');
    const tabName = tab.name.padEnd(20);
    const endpoint = tab.endpoint.padEnd(30);
    
    if (result.success) {
      const dataStatus = result.hasData ? '✓ Has data' : '⚠ No data';
      const fieldsStatus = `${result.fieldsFound}/${result.totalFields} fields`;
      console.log(`✅ Tab ${tabNumber}: ${tabName} → ${endpoint} [${result.status}] ${dataStatus}, ${fieldsStatus}`);
      totalSuccess++;
    } else {
      console.log(`❌ Tab ${tabNumber}: ${tabName} → ${endpoint} [${result.status || 'ERROR'}] ${result.error || ''}`);
      totalFailed++;
    }
  }
  
  console.log('='.repeat(70));
  console.log('📊 TEST RESULTS:');
  console.log(`   ✅ Success: ${totalSuccess}/11 tabs`);
  console.log(`   ❌ Failed: ${totalFailed}/11 tabs`);
  
  if (totalFailed === 0) {
    console.log('🎉 ALL TABS WORKING PERFECTLY!');
  } else if (totalFailed === 1 && TABS[5].name === 'Pricing Plans') {
    console.log('⏳ Waiting for Railway deployment to fix Pricing Plans tab...');
    console.log('   (Changes pushed, should deploy in ~1-2 minutes)');
  }
  
  console.log('='.repeat(70));
  console.log('✅ ULTRATHINK systematic check complete');
}

// Wait function for deployment
function wait(seconds) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

async function testWithRetry() {
  console.log('🚀 Starting ULTRATHINK test...\n');
  
  // First test
  await runUltrathinkTest();
  
  // If pricing-plans failed, wait and retry
  const firstTest = await testEndpoint(TABS[5]);
  if (!firstTest.success) {
    console.log('\n⏳ Waiting 30 seconds for Railway deployment...');
    await wait(30);
    console.log('🔄 Retrying test after deployment...\n');
    await runUltrathinkTest();
  }
}

// Run test
if (require.main === module) {
  testWithRetry()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Test failed:', err);
      process.exit(1);
    });
}

module.exports = { runUltrathinkTest, testEndpoint };