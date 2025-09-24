const puppeteer = require('puppeteer');

async function testHebrewTranslation() {
    console.log('🔍 Testing Hebrew translation for courses page...');
    
    try {
        const browser = await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            defaultViewport: { width: 1200, height: 800 }
        });
        
        const page = await browser.newPage();
        
        // Go to courses page with Hebrew locale
        const url = 'http://localhost:3005/courses.html?locale=he';
        console.log(`📖 Opening: ${url}`);
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
        
        // Wait for language manager to load
        await page.waitForTimeout(3000);
        
        // Check if the hero title is translated
        const heroTitle = await page.$eval('.inner-banner-title', el => el.textContent.trim());
        console.log(`📝 Hero title text: "${heroTitle}"`);
        
        // Check if it contains Hebrew characters
        const hasHebrewChars = /[\u0590-\u05FF]/.test(heroTitle);
        console.log(`🔍 Contains Hebrew characters: ${hasHebrewChars}`);
        
        // Check for specific expected text
        const expectedHebrew = 'הקורסים שלנו';
        const isCorrectTranslation = heroTitle === expectedHebrew;
        console.log(`✅ Expected: "${expectedHebrew}"`);
        console.log(`✅ Matches expected: ${isCorrectTranslation}`);
        
        // Test results
        console.log('\n🎯 TEST RESULTS:');
        console.log(`  ✅ Page loaded successfully`);
        console.log(`  ${hasHebrewChars ? '✅' : '❌'} Hebrew characters detected`);
        console.log(`  ${isCorrectTranslation ? '✅' : '❌'} Correct translation displayed`);
        
        if (isCorrectTranslation) {
            console.log('\n🎉 SUCCESS: Hebrew translation is working correctly!');
        } else {
            console.log('\n⚠️  ISSUE: Translation not working as expected');
            console.log('   This could be due to:');
            console.log('   - API not responding');
            console.log('   - JavaScript not loading');
            console.log('   - Timing issues with translation load');
        }
        
        await browser.close();
        
    } catch (error) {
        console.error('❌ Error testing Hebrew translation:', error);
        process.exit(1);
    }
}

testHebrewTranslation();
