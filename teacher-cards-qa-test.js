/**
 * QA Test Suite for Teacher Cards Dual-System Translation
 */

console.log('🧪 STARTING TEACHER CARDS DUAL-SYSTEM TRANSLATION TEST');
console.log('======================================================');

const BASE_URL = 'http://localhost:3005';
const API_URL = 'http://localhost:3000';
const TEST_LANGUAGES = ['en', 'ru', 'he'];

const testResults = { total: 0, passed: 0, failed: 0, issues: [] };

function passTest(test, message) {
    testResults.passed++;
    console.log(`✅ ${test}: ${message || 'PASSED'}`);
}

function failTest(test, message) {
    testResults.failed++;
    console.log(`❌ ${test}: ${message}`);
}

async function testAPIEndpoints() {
    testResults.total++;
    console.log('\n🔍 TEST 1: API Endpoint Validation');
    
    try {
        for (const locale of TEST_LANGUAGES) {
            const response = await fetch(`${API_URL}/api/nd/teachers?locale=${locale}`);
            
            if (!response.ok) {
                failTest('API_ENDPOINT', `Failed to fetch teachers for ${locale}: ${response.status}`);
                continue;
            }
            
            const data = await response.json();
            
            if (!data.success || !Array.isArray(data.data)) {
                failTest('API_DATA_STRUCTURE', `Invalid API response structure for ${locale}`);
                continue;
            }
            
            passTest('API_ENDPOINT', `${locale.toUpperCase()} API valid with ${data.data.length} teachers`);
        }
    } catch (error) {
        failTest('API_ENDPOINT', `API test failed: ${error.message}`);
    }
}

async function testFrontendServer() {
    testResults.total++;
    console.log('\n🔍 TEST 2: Frontend Server Availability');
    
    try {
        const response = await fetch(`${BASE_URL}/teachers.html`);
        
        if (!response.ok) {
            failTest('FRONTEND_SERVER', `Frontend server not accessible: ${response.status}`);
            return;
        }
        
        const html = await response.text();
        
        const requiredScripts = ['teacher-card.js', 'unified-language-manager.js'];
        
        for (const script of requiredScripts) {
            if (!html.includes(script)) {
                failTest('SCRIPT_LOADING', `Missing required script: ${script}`);
                continue;
            }
        }
        
        if (!html.includes('main-blog-collection-list teachers-grid')) {
            failTest('HTML_STRUCTURE', 'Missing teacher cards container');
            return;
        }
        
        passTest('FRONTEND_SERVER', 'Frontend server and page structure valid');
        
    } catch (error) {
        failTest('FRONTEND_SERVER', `Frontend test failed: ${error.message}`);
    }
}

function generateReport() {
    console.log('\n📊 TEACHER CARDS TEST REPORT');
    console.log('==============================');
    console.log(`Total Tests: ${testResults.total}`);
    console.log(`✅ Passed: ${testResults.passed}`);
    console.log(`❌ Failed: ${testResults.failed}`);
    
    const successRate = testResults.total > 0 ? ((testResults.passed / testResults.total) * 100).toFixed(1) : 0;
    console.log(`Success Rate: ${successRate}%`);
    
    console.log('\n🎯 MANUAL TEST CHECKLIST:');
    console.log('- Navigate to http://localhost:3005/teachers.html');
    console.log('- Test language switching with EN/RU/HE pills');  
    console.log('- Verify teacher cards load with photos and names');
    console.log('- Check console for JavaScript errors');
    console.log('- Confirm UI labels (Courses/Students/Years) translate');
    console.log('- Verify teacher names/bios show in selected language');
}

async function runAllTests() {
    await testAPIEndpoints();
    await testFrontendServer();
    generateReport();
}

runAllTests().catch(console.error);
