// Test script for production Career Services loading
// Run this in browser console on: https://aistudio555jamstack-production.up.railway.app/content-admin-comprehensive.html

console.log('🔍 Testing Career Services Loading in Production...');

// Test the API endpoint first
async function testAPIEndpoint() {
    console.log('📡 Testing API endpoint...');
    try {
        const response = await fetch('/api/career-orientation-page?locale=en');
        const data = await response.json();
        console.log('✅ API Response:', data);
        
        if (data.data && data.data.attributes) {
            const attrs = data.data.attributes;
            console.log(`📊 Found ${Object.keys(attrs).length} attributes`);
            console.log('Sample fields:');
            console.log('  heroMainTitle:', attrs.heroMainTitle);
            console.log('  heroSubtitle:', attrs.heroSubtitle);
            console.log('  problemsMainTitle:', attrs.problemsMainTitle);
            console.log('  solutionsMainTitle:', attrs.solutionsMainTitle);
            return attrs;
        } else {
            console.log('❌ No data.attributes found');
            return null;
        }
    } catch (error) {
        console.error('❌ API Error:', error);
        return null;
    }
}

// Test field population
async function testFieldPopulation() {
    console.log('🎯 Testing field population...');
    
    const attrs = await testAPIEndpoint();
    if (!attrs) return;
    
    // Test field existence and population
    const testFields = [
        { id: 'hero_main_title', apiField: 'heroMainTitle' },
        { id: 'hero_subtitle', apiField: 'heroSubtitle' },
        { id: 'hero_description', apiField: 'heroDescription' },
        { id: 'problems_main_title', apiField: 'problemsMainTitle' },
        { id: 'solutions_main_title', apiField: 'solutionsMainTitle' }
    ];
    
    console.log('🔧 Testing field mapping...');
    testFields.forEach(field => {
        const element = document.getElementById(field.id);
        const value = attrs[field.apiField];
        
        if (element) {
            console.log(`✅ Field ${field.id} exists in DOM`);
            if (value) {
                element.value = value;
                console.log(`  Set to: "${value}"`);
            } else {
                console.log(`  ⚠️ No API value for ${field.apiField}`);
            }
        } else {
            console.log(`❌ Field ${field.id} NOT FOUND in DOM`);
        }
    });
}

// Test the actual loadCareerServices function
async function testLoadCareerServicesFunction() {
    console.log('🚀 Testing loadCareerServices function...');
    
    if (typeof loadCareerServices === 'function') {
        console.log('✅ loadCareerServices function exists');
        try {
            await loadCareerServices();
            console.log('✅ loadCareerServices executed successfully');
        } catch (error) {
            console.error('❌ loadCareerServices failed:', error);
        }
    } else if (typeof loadCareerOrientationPage === 'function') {
        console.log('✅ loadCareerOrientationPage function exists (alternative name)');
        try {
            await loadCareerOrientationPage();
            console.log('✅ loadCareerOrientationPage executed successfully');
        } catch (error) {
            console.error('❌ loadCareerOrientationPage failed:', error);
        }
    } else {
        console.log('❌ No loading function found');
        console.log('Available functions:', Object.getOwnPropertyNames(window).filter(name => name.includes('career') || name.includes('load')));
    }
}

// Run all tests
async function runAllTests() {
    console.log('🧪 Starting comprehensive Career Services loading tests...');
    console.log('═══════════════════════════════════════════');
    
    await testFieldPopulation();
    console.log('─────────────────────────────────────────────');
    await testLoadCareerServicesFunction();
    
    console.log('═══════════════════════════════════════════');
    console.log('✅ Test complete! Check field values above.');
}

// Auto-run tests
runAllTests();