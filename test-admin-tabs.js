/**
 * TEST ADMIN PANEL TABS
 * ULTRATHINK systematic check of each tab and API endpoint
 */

// Expected API endpoints for each tab
const TAB_ENDPOINTS = {
    'home-page': '/api/home-page',
    'courses': '/api/courses',
    'teachers': '/api/teachers',
    'career-services': '/api/career-center-page',
    'career-orientation': '/api/career-orientation-page',
    'pricing-plans': '/api/pricing-plans',
    'blog-posts': '/api/blog-posts',
    'about-page': '/api/about-page',
    'contact-page': '/api/contact-page'
};

// Test each endpoint
async function testAllEndpoints() {
    const BASE_URL = 'https://aistudio555jamstack-production.up.railway.app';
    
    console.log('🔍 ULTRATHINK ADMIN PANEL API TEST');
    console.log('='.repeat(50));
    
    for (const [tab, endpoint] of Object.entries(TAB_ENDPOINTS)) {
        try {
            const url = `${BASE_URL}${endpoint}?locale=en`;
            const response = await fetch(url);
            const status = response.status;
            
            if (status === 200) {
                console.log(`✅ ${tab.padEnd(20)} → ${endpoint.padEnd(30)} [${status}] SUCCESS`);
            } else {
                console.log(`❌ ${tab.padEnd(20)} → ${endpoint.padEnd(30)} [${status}] FAILED`);
            }
        } catch (error) {
            console.log(`❌ ${tab.padEnd(20)} → ${endpoint.padEnd(30)} [ERROR] ${error.message}`);
        }
    }
    
    console.log('='.repeat(50));
    console.log('📊 Test complete');
}

// Run if called directly
if (require.main === module) {
    testAllEndpoints()
        .then(() => process.exit(0))
        .catch(err => {
            console.error('Test failed:', err);
            process.exit(1);
        });
}

module.exports = { testAllEndpoints };