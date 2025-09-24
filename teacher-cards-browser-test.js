/**
 * Browser Test for Teacher Cards Dual-System Translation
 */

const { chromium } = require('playwright');

async function runBrowserTest() {
    console.log('🌐 STARTING BROWSER TEST FOR TEACHER CARDS');
    console.log('============================================');
    
    let browser;
    try {
        browser = await chromium.launch({ headless: false });
        const page = await browser.newPage();
        
        page.setDefaultTimeout(10000);
        
        console.log('📍 Navigating to teachers page...');
        await page.goto('http://localhost:3005/teachers.html');
        
        console.log('⏳ Waiting for page to load...');
        await page.waitForSelector('.lang-pill', { timeout: 5000 });
        
        const langPills = await page.$$('.lang-pill');
        console.log(`✅ Found ${langPills.length} language pills`);
        
        console.log('⏳ Waiting for teacher cards to load...');
        try {
            await page.waitForSelector('.shared-teacher-card', { timeout: 8000 });
            const teacherCards = await page.$$('.shared-teacher-card');
            console.log(`✅ Found ${teacherCards.length} teacher cards loaded`);
        } catch (error) {
            console.log('⚠️ Teacher cards not found, checking loading state...');
        }
        
        console.log('\n🔄 Testing language switching...');
        
        const languages = ['en', 'ru', 'he'];
        
        for (const lang of languages) {
            console.log(`\n🌍 Testing ${lang.toUpperCase()} language...`);
            
            const langPill = await page.$(`[data-locale="${lang}"]`);
            if (langPill) {
                await langPill.click();
                console.log(`✅ Clicked ${lang.toUpperCase()} language pill`);
                
                await page.waitForTimeout(2000);
                
                const cards = await page.$$('.shared-teacher-card');
                if (cards.length > 0) {
                    console.log(`✅ ${cards.length} teacher cards visible in ${lang.toUpperCase()}`);
                    
                    const teacherNames = await page.$$eval('.teacher-name', 
                        elements => elements.slice(0, 3).map(el => el.textContent.trim()));
                    
                    if (teacherNames.length > 0) {
                        console.log(`✅ Teacher names: ${teacherNames.join(', ')}`);
                    }
                }
            }
        }
        
        console.log('\n✅ BROWSER TEST COMPLETED');
        console.log('\n📋 MANUAL VERIFICATION CHECKLIST:');
        console.log('- [ ] Teacher cards are visible with photos');
        console.log('- [ ] Language pills switch UI labels');
        console.log('- [ ] Teacher names/bios change with language');
        console.log('- [ ] Hebrew shows RTL text direction');
        console.log('- [ ] No undefined errors in console');
        console.log('\n⏸️  Browser kept open for manual inspection...');
        
        // Keep browser open
        await new Promise(resolve => {
            process.on('SIGINT', () => {
                console.log('\n👋 Closing browser...');
                browser.close().then(resolve);
            });
        });
        
    } catch (error) {
        console.error('❌ Browser test failed:', error.message);
        if (browser) await browser.close();
    }
}

runBrowserTest().catch(console.error);
