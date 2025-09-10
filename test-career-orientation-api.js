// Test Career Orientation API endpoint
const API_URL = 'https://aistudio555jamstack-production.up.railway.app/api';

async function testCareerOrientationAPI() {
    console.log('🔍 Testing Career Orientation API endpoint...\n');
    
    const endpoints = [
        '/career-orientation-page',
        '/career-orientation-page?locale=en',
        '/career-orientation-pages',
        '/career-orientations'
    ];
    
    for (const endpoint of endpoints) {
        const url = API_URL + endpoint;
        console.log(`Testing: ${url}`);
        
        try {
            const response = await fetch(url);
            console.log(`  Status: ${response.status} ${response.statusText}`);
            
            if (response.ok) {
                const data = await response.json();
                console.log(`  ✅ Success! Data structure:`);
                console.log(`    - Has data: ${!!data.data}`);
                console.log(`    - Has attributes: ${!!(data.data && data.data.attributes)}`);
                
                if (data.data && data.data.attributes) {
                    const attrs = data.data.attributes;
                    console.log(`    - Sample fields:`);
                    console.log(`      • heroMainTitle: "${attrs.heroMainTitle || 'NOT SET'}"`);
                    console.log(`      • heroSubtitle: "${attrs.heroSubtitle || 'NOT SET'}"`);
                    console.log(`      • Total fields: ${Object.keys(attrs).length}`);
                }
                
                return data; // Return first successful response
            } else {
                const errorText = await response.text();
                console.log(`  ❌ Error: ${errorText.substring(0, 100)}...`);
            }
        } catch (error) {
            console.log(`  ❌ Network error: ${error.message}`);
        }
        console.log('');
    }
    
    console.log('❌ All endpoints failed. Career Orientation data may not be set up in Strapi.');
    return null;
}

// Run the test
testCareerOrientationAPI().then(data => {
    if (data) {
        console.log('\n✅ API is working! Career Orientation data is accessible.');
        console.log('Full response saved to: career-orientation-response.json');
        
        // Save response for debugging
        const fs = require('fs');
        fs.writeFileSync('career-orientation-response.json', JSON.stringify(data, null, 2));
    } else {
        console.log('\n⚠️ Career Orientation content needs to be created in Strapi admin panel.');
        console.log('Steps to fix:');
        console.log('1. Go to Strapi admin: https://aistudio555jamstack-production.up.railway.app/admin');
        console.log('2. Navigate to Content Manager → Career Orientation Page');
        console.log('3. Create a new entry with sample data');
        console.log('4. Save and Publish the entry');
    }
});