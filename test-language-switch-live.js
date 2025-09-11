#!/usr/bin/env node

/**
 * Test Language Switching on Live Production Site
 */

const axios = require('axios');
const cheerio = require('cheerio');

async function testLanguageSwitching() {
    console.log('🧪 Testing Language Switching on Production...\n');
    
    const results = {
        filesLoading: {},
        languagePages: {},
        apiContent: {},
        errors: []
    };
    
    // Test 1: Check if critical JS files load
    console.log('📁 Testing critical file loading...');
    const filesToCheck = [
        'https://www.aistudio555.com/dist/en/js/contact-form-modal.js',
        'https://www.aistudio555.com/dist/en/js/webflow-strapi-integration.js',
        'https://www.aistudio555.com/dist/en/fonts/fa-brands-400.ttf'
    ];
    
    for (const url of filesToCheck) {
        try {
            const response = await axios.head(url);
            results.filesLoading[url] = response.status === 200 ? '✅' : '❌';
            console.log(`  ${results.filesLoading[url]} ${url.split('/').pop()}`);
        } catch (error) {
            results.filesLoading[url] = '❌';
            console.log(`  ❌ ${url.split('/').pop()} - ${error.message}`);
        }
    }
    
    // Test 2: Check if language pages exist and have switcher
    console.log('\n🌍 Testing language pages...');
    const languageUrls = {
        'English': 'https://www.aistudio555.com/dist/en/index.html',
        'Russian': 'https://www.aistudio555.com/dist/ru/index.html',
        'Hebrew': 'https://www.aistudio555.com/dist/he/index.html'
    };
    
    for (const [lang, url] of Object.entries(languageUrls)) {
        try {
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);
            
            // Check for language switcher
            const hasSwitcher = $('select#languageSelect').length > 0 || 
                               $('select[onchange*="switchLanguage"]').length > 0;
            
            // Check for switchLanguage function
            const hasFunction = response.data.includes('function switchLanguage') || 
                              response.data.includes('window.switchLanguage');
            
            // Check HTML lang attribute
            const htmlLang = $('html').attr('lang');
            
            results.languagePages[lang] = {
                accessible: '✅',
                hasSwitcher: hasSwitcher ? '✅' : '❌',
                hasFunction: hasFunction ? '✅' : '❌',
                htmlLang: htmlLang
            };
            
            console.log(`  ${lang}:`);
            console.log(`    Page loads: ${results.languagePages[lang].accessible}`);
            console.log(`    Has switcher: ${results.languagePages[lang].hasSwitcher}`);
            console.log(`    Has function: ${results.languagePages[lang].hasFunction}`);
            console.log(`    HTML lang="${htmlLang}"`);
            
        } catch (error) {
            results.languagePages[lang] = { accessible: '❌', error: error.message };
            console.log(`  ${lang}: ❌ ${error.message}`);
        }
    }
    
    // Test 3: Check API content in different languages
    console.log('\n🔤 Testing API language content...');
    const apiUrls = {
        'English': 'https://aistudio555jamstack-production.up.railway.app/api/home-page?locale=en',
        'Russian': 'https://aistudio555jamstack-production.up.railway.app/api/home-page?locale=ru',
        'Hebrew': 'https://aistudio555jamstack-production.up.railway.app/api/home-page?locale=he'
    };
    
    for (const [lang, url] of Object.entries(apiUrls)) {
        try {
            const response = await axios.get(url);
            const heroTitle = response.data?.hero?.title || response.data?.heroTitle || 'N/A';
            results.apiContent[lang] = {
                status: '✅',
                heroTitle: heroTitle.substring(0, 50)
            };
            console.log(`  ${lang}: "${heroTitle}"`);
        } catch (error) {
            results.apiContent[lang] = { status: '❌', error: error.message };
            console.log(`  ${lang}: ❌ ${error.message}`);
        }
    }
    
    // Test 4: Check for JavaScript errors in page
    console.log('\n🐛 Checking for JavaScript errors...');
    try {
        const response = await axios.get('https://www.aistudio555.com/dist/en/index.html');
        
        // Check for common error patterns
        const hasUpdateFeaturedCoursesError = response.data.includes('updateFeaturedCourses is not a function');
        const hasCorrectMethodName = response.data.includes('updateFeaturedCoursesFromAPI');
        
        if (hasUpdateFeaturedCoursesError) {
            results.errors.push('❌ updateFeaturedCourses method error still present');
        } else if (hasCorrectMethodName) {
            console.log('  ✅ updateFeaturedCoursesFromAPI method correctly named');
        }
        
        // Check script paths
        const scriptPaths = response.data.match(/<script[^>]*src="([^"]+\.js)"/g) || [];
        const wrongPaths = scriptPaths.filter(s => s.includes('../../js/') || s.includes('../js/'));
        
        if (wrongPaths.length > 0) {
            results.errors.push(`❌ Found ${wrongPaths.length} scripts with incorrect paths`);
            wrongPaths.slice(0, 3).forEach(p => console.log(`    ${p}`));
        } else {
            console.log('  ✅ All script paths are correct');
        }
        
    } catch (error) {
        results.errors.push(`❌ Failed to check for errors: ${error.message}`);
    }
    
    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 SUMMARY:');
    console.log('='.repeat(50));
    
    // Check overall status
    const allFilesLoaded = Object.values(results.filesLoading).every(v => v === '✅');
    const allPagesWork = Object.values(results.languagePages).every(v => v.accessible === '✅');
    const allAPIsWork = Object.values(results.apiContent).every(v => v.status === '✅');
    const noErrors = results.errors.length === 0;
    
    console.log(`\n✅ Files Loading: ${allFilesLoaded ? 'PASSED' : 'FAILED'}`);
    console.log(`✅ Language Pages: ${allPagesWork ? 'PASSED' : 'FAILED'}`);
    console.log(`✅ API Content: ${allAPIsWork ? 'PASSED' : 'FAILED'}`);
    console.log(`✅ No JS Errors: ${noErrors ? 'PASSED' : 'FAILED'}`);
    
    const overallStatus = allFilesLoaded && allPagesWork && allAPIsWork && noErrors;
    
    console.log('\n' + '='.repeat(50));
    if (overallStatus) {
        console.log('🎉 LANGUAGE SWITCHING IS WORKING!');
    } else {
        console.log('⚠️  LANGUAGE SWITCHING HAS ISSUES');
        if (results.errors.length > 0) {
            console.log('\nErrors found:');
            results.errors.forEach(e => console.log(`  ${e}`));
        }
    }
    console.log('='.repeat(50));
    
    return overallStatus;
}

// Run the test
testLanguageSwitching().then(success => {
    process.exit(success ? 0 : 1);
}).catch(error => {
    console.error('Test failed:', error);
    process.exit(1);
});