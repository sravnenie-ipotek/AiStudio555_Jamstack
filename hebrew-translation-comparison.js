const https = require('https');
const http = require('http');

function makeRequest(url) {
    return new Promise((resolve, reject) => {
        const isHttps = url.startsWith('https:');
        const client = isHttps ? https : http;
        
        client.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve(jsonData);
                } catch (e) {
                    resolve({ error: 'Invalid JSON', rawData: data.substring(0, 200) });
                }
            });
        }).on('error', reject);
    });
}

async function testHebrewTranslations() {
    console.log('🧪 Hebrew Translation Test Results');
    console.log('=================================\n');

    // Test 1: Local API Hebrew content
    console.log('1. LOCAL API TEST:');
    try {
        const localData = await makeRequest('http://localhost:3000/api/nd/home-page?locale=he');
        if (localData.success && localData.data) {
            const stats = localData.data.stats?.content?.content?.stats;
            const yearsLabel = stats?.[2]?.label;
            const navigation = localData.data.navigation?.content?.items;
            
            console.log('✅ Local API responds with Hebrew content');
            console.log('   - Years label:', yearsLabel || 'NOT FOUND');
            console.log('   - Navigation items count:', navigation?.length || 0);
            console.log('   - Has Hebrew buttons:', !!localData.data.ui_elements?.content?.content?.buttons);
            console.log('   - Hero title:', localData.data.hero?.content?.content?.title || 'NOT FOUND');
        } else {
            console.log('❌ Local API failed or returned no data');
        }
    } catch (error) {
        console.log('❌ Local API error:', error.message);
    }

    console.log('\n2. PRODUCTION API TEST:');
    try {
        const prodData = await makeRequest('https://aistudio555jamstack-production.up.railway.app/api/nd/home-page?locale=he');
        if (prodData.success && prodData.data) {
            const stats = prodData.data.stats?.content?.content?.stats;
            const yearsLabel = stats?.[2]?.label;
            const navigation = prodData.data.navigation?.content?.items;
            
            console.log('✅ Production API responds with Hebrew content');
            console.log('   - Years label:', yearsLabel || 'NOT FOUND');
            console.log('   - Navigation items count:', navigation?.length || 0);
            console.log('   - Has Hebrew buttons:', !!prodData.data.ui_elements?.content?.content?.buttons);
            console.log('   - Hero title:', prodData.data.hero?.content?.content?.title || 'NOT FOUND');
        } else {
            console.log('❌ Production API failed or returned no data');
        }
    } catch (error) {
        console.log('❌ Production API error:', error.message);
    }

    console.log('\n3. FRONTEND COMPARISON:');
    console.log('Local Development: http://localhost:3005/home.html?locale=he');
    console.log('Production Site: https://www.aistudio555.com/en/?locale=he');
    
    console.log('\n📋 KEY HEBREW ELEMENTS TO CHECK:');
    console.log('   • "שנות ניסיון" (Years of Experience)');
    console.log('   • "מנטורית מומחית בטכנולוגיה" (Expert Mentor in Technology)');
    console.log('   • Hebrew language pill (HE) should be active');
    console.log('   • RTL direction should be applied (dir="rtl")');
    console.log('   • Navigation menu should be in Hebrew');
    
    console.log('\n🔍 MANUAL TESTING INSTRUCTIONS:');
    console.log('1. Open browser console (F12)');
    console.log('2. Visit: http://localhost:3005/home.html?locale=he');
    console.log('3. Look for: [LanguageManager] Enhanced Version 3.0 Initializing...');
    console.log('4. Check if Hebrew content loads');
    console.log('5. Click Hebrew (HE) language pill');
    console.log('6. Compare with production site behavior');
    
    console.log('\n✅ TEST COMPLETE - Check browser console for LanguageManager logs');
}

testHebrewTranslations().catch(console.error);
