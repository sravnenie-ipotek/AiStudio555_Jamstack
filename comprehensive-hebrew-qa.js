const puppeteer = require('puppeteer');

async function runHebrewQATest() {
    console.log('Starting Hebrew QA Test for career-center.html');
    
    const browser = await puppeteer.launch({ 
        headless: false,
        devtools: true
    });
    
    const page = await browser.newPage();
    
    const testResults = {
        pageLoad: false,
        scriptLoad: false,
        apiCall: false,
        hebrewContent: false,
        translationElements: 0,
        errors: []
    };
    
    try {
        console.log('1. Loading career-center.html with Hebrew locale...');
        await page.goto('http://localhost:3005/career-center.html?locale=he', {
            waitUntil: 'networkidle0',
            timeout: 30000
        });
        testResults.pageLoad = true;
        console.log('Page loaded successfully');
        
        await page.waitForTimeout(3000);
        
        console.log('2. Checking unified-language-manager...');
        const managerStatus = await page.evaluate(() => {
            return {
                exists: typeof window.unifiedLanguageManager !== 'undefined',
                currentLocale: window.unifiedLanguageManager ? window.unifiedLanguageManager.currentLocale : null
            };
        });
        
        testResults.scriptLoad = managerStatus.exists;
        console.log('Manager exists:', managerStatus.exists);
        console.log('Current locale:', managerStatus.currentLocale);
        
        console.log('3. Testing API endpoint...');
        const apiResponse = await page.evaluate(async () => {
            try {
                const response = await fetch('http://localhost:1337/api/nd/career-center-platform-page?locale=he');
                const data = await response.json();
                return {
                    status: response.status,
                    heroTitle: data.data.sections.hero.title
                };
            } catch (e) {
                return { error: e.message };
            }
        });
        
        testResults.apiCall = apiResponse.status === 200;
        console.log('API status:', apiResponse.status);
        console.log('Hero title from API:', apiResponse.heroTitle);
        
        console.log('4. Checking Hebrew content in DOM...');
        const hebrewCheck = await page.evaluate(() => {
            const body = document.body.textContent;
            return body.includes('פלטפורמת') || body.includes('דף הבית');
        });
        
        testResults.hebrewContent = hebrewCheck;
        console.log('Hebrew content found:', hebrewCheck);
        
        console.log('5. Counting data-i18n elements...');
        const i18nCount = await page.evaluate(() => {
            return document.querySelectorAll('[data-i18n]').length;
        });
        
        testResults.translationElements = i18nCount;
        console.log('Translation elements found:', i18nCount);
        
    } catch (error) {
        testResults.errors.push(error.message);
        console.error('Test failed:', error.message);
    }
    
    console.log('\nTEST RESULTS:');
    console.log('=============');
    console.log('Page Load:', testResults.pageLoad ? 'PASS' : 'FAIL');
    console.log('Script Load:', testResults.scriptLoad ? 'PASS' : 'FAIL');
    console.log('API Call:', testResults.apiCall ? 'PASS' : 'FAIL');
    console.log('Hebrew Content:', testResults.hebrewContent ? 'PASS' : 'FAIL');
    console.log('Translation Elements:', testResults.translationElements);
    
    await browser.close();
    return testResults;
}

runHebrewQATest().catch(console.error);
