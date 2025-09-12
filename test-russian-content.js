#!/usr/bin/env node

/**
 * Test Russian Content Display
 * Verifies that Russian content is properly loaded and displayed
 */

const axios = require('axios');
const cheerio = require('cheerio');

async function testRussianContent() {
    console.log('🧪 Testing Russian Content Display...\n');
    
    try {
        // Test 1: Check if Russian page loads
        console.log('📄 Loading Russian page...');
        const response = await axios.get('https://www.aistudio555.com/dist/ru/index.html');
        const $ = cheerio.load(response.data);
        
        console.log('✅ Russian page loaded successfully');
        
        // Test 2: Check if strapi-integration.js is included
        const hasStrapi = response.data.includes('strapi-integration.js');
        console.log(`📜 Strapi integration script: ${hasStrapi ? '✅ Found' : '❌ Missing'}`);
        
        // Test 3: Check current content (should be English initially)
        const currentTitle = $('.section-title.featured-courses').text().trim();
        console.log(`🏷️  Current section title: "${currentTitle}"`);
        
        // Test 4: Check HTML language attribute
        const htmlLang = $('html').attr('lang');
        console.log(`🌍 HTML lang attribute: "${htmlLang}"`);
        
        // Test 5: Check if locale detection code is present
        const hasLocaleDetection = response.data.includes('getLocale()') && 
                                   response.data.includes('pathParts.find');
        console.log(`🔍 Locale detection code: ${hasLocaleDetection ? '✅ Found' : '❌ Missing'}`);
        
        // Test 6: Check console logging
        const hasConsoleLogging = response.data.includes('🌍 Detected locale:');
        console.log(`📊 Enhanced debugging: ${hasConsoleLogging ? '✅ Present' : '❌ Missing'}`);
        
        // Test 7: Verify API endpoint structure
        console.log('\n🔌 Testing API endpoint...');
        const apiResponse = await axios.get('https://aistudio555jamstack-production.up.railway.app/api/home-page?locale=ru');
        const apiData = apiResponse.data;
        
        console.log('📦 Russian API response keys:', Object.keys(apiData).join(', '));
        
        if (apiData.heroTitle) {
            console.log(`🏆 Russian hero title: "${apiData.heroTitle}"`);
        }
        
        if (apiData.featuredCoursesTitle) {
            console.log(`📚 Russian courses title: "${apiData.featuredCoursesTitle}"`);
        } else {
            console.log('⚠️  No featuredCoursesTitle in API response');
            // Check for other possible keys
            const possibleKeys = Object.keys(apiData).filter(key => 
                key.toLowerCase().includes('course') || 
                key.toLowerCase().includes('popular') ||
                key.toLowerCase().includes('feature')
            );
            console.log('📋 Course-related keys found:', possibleKeys);
        }
        
        console.log('\n' + '='.repeat(60));
        console.log('📊 RUSSIAN CONTENT TEST SUMMARY:');
        console.log('='.repeat(60));
        
        const checks = [
            { name: 'Russian page loads', status: true },
            { name: 'Strapi integration script', status: hasStrapi },
            { name: 'HTML lang attribute', status: htmlLang === 'ru' },
            { name: 'Locale detection code', status: hasLocaleDetection },
            { name: 'Enhanced debugging', status: hasConsoleLogging },
            { name: 'Russian API content', status: !!apiData.heroTitle }
        ];
        
        checks.forEach(check => {
            console.log(`${check.status ? '✅' : '❌'} ${check.name}`);
        });
        
        const passedChecks = checks.filter(c => c.status).length;
        console.log(`\nOverall: ${passedChecks}/${checks.length} checks passed`);
        
        if (passedChecks === checks.length) {
            console.log('🎉 All systems ready! Russian content should work.');
            console.log('\n💡 To see Russian content:');
            console.log('1. Visit https://www.aistudio555.com/dist/ru/index.html');
            console.log('2. Open browser console (F12)'); 
            console.log('3. Look for "🌍 Detected locale: ru" message');
            console.log('4. Content should automatically change to Russian');
        } else {
            console.log('⚠️  Some issues found. Check the failed items above.');
        }
        
        console.log('='.repeat(60));
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        return false;
    }
    
    return true;
}

// Run the test
testRussianContent().then(success => {
    process.exit(success ? 0 : 1);
}).catch(error => {
    console.error('Test error:', error);
    process.exit(1);
});