const puppeteer = require('puppeteer');

async function runCompleteHebrewTest() {
    console.log('🔍 Complete Hebrew Translation Test for Pricing Page');
    console.log('==================================================\n');

    let browser;
    try {
        // Launch browser
        browser = await puppeteer.launch({ 
            headless: false,
            devtools: true,
            defaultViewport: { width: 1200, height: 800 }
        });
        
        const page = await browser.newPage();
        
        // Collect console logs
        const consoleLogs = [];
        page.on('console', msg => {
            const text = msg.text();
            consoleLogs.push(text);
            console.log('CONSOLE:', text);
        });

        // Collect network requests
        const apiCalls = [];
        page.on('request', request => {
            const url = request.url();
            if (url.includes('api/nd/pricing-page')) {
                apiCalls.push(url);
                console.log('API Call:', url);
            }
        });

        console.log('1️⃣ INITIAL LOAD TEST');
        console.log('====================');
        
        // Step 1: Load pricing page
        console.log('📂 Opening http://localhost:3005/pricing.html...');
        await page.goto('http://localhost:3005/pricing.html', { 
            waitUntil: 'domcontentloaded',
            timeout: 30000 
        });
        console.log('✅ Page loaded successfully\n');

        // Wait for scripts to initialize
        await page.waitForTimeout(3000);

        // Step 2: Check initial state
        console.log('2️⃣ INITIAL STATE CHECK');
        console.log('======================');
        
        const initialState = await page.evaluate(() => {
            return {
                hasLanguageManager: typeof window.LanguageManager !== 'undefined',
                hasLanguageManagerInstance: typeof window.languageManager !== 'undefined',
                activePill: document.querySelector('.lang-pill.active, .mobile-lang-pill.active')?.textContent,
                monthlyTabText: document.querySelector('[data-i18n="pricing.content.plans.monthly.name"]')?.textContent,
                yearlyTabText: document.querySelector('[data-i18n="pricing.content.plans.annual.name"]')?.textContent,
                heroTitle: document.querySelector('[data-i18n="pricing.content.hero.title"]')?.textContent,
                dataI18nCount: document.querySelectorAll('[data-i18n]').length
            };
        });

        console.log('Language Manager loaded:', initialState.hasLanguageManager);
        console.log('Language Manager instance:', initialState.hasLanguageManagerInstance);
        console.log('Active language pill:', initialState.activePill);
        console.log('Monthly tab text:', initialState.monthlyTabText);
        console.log('Yearly tab text:', initialState.yearlyTabText);
        console.log('Hero title:', initialState.heroTitle);
        console.log('Elements with data-i18n:', initialState.dataI18nCount);
        console.log('');

        // Step 3: Hebrew switch test
        console.log('3️⃣ HEBREW TRANSLATION TEST');
        console.log('==========================');
        
        console.log('🔄 Clicking Hebrew (HE) language button...');
        
        // Find and click Hebrew button
        const hebrewButton = await page.$('.lang-pill[data-locale="he"], .mobile-lang-pill[data-locale="he"]');
        if (hebrewButton) {
            await hebrewButton.click();
            console.log('✅ Hebrew button clicked');
        } else {
            console.log('❌ Hebrew button not found');
            return;
        }

        // Wait for translation to complete
        console.log('⏳ Waiting for translation to complete...');
        await page.waitForTimeout(5000);

        // Step 4: Check translation results
        console.log('4️⃣ TRANSLATION RESULTS');
        console.log('======================');
        
        const hebrewState = await page.evaluate(() => {
            return {
                isRTL: document.documentElement.getAttribute('dir') === 'rtl',
                htmlLang: document.documentElement.getAttribute('lang'),
                activePill: document.querySelector('.lang-pill.active, .mobile-lang-pill.active')?.textContent,
                monthlyTabText: document.querySelector('[data-i18n="pricing.content.plans.monthly.name"]')?.textContent,
                yearlyTabText: document.querySelector('[data-i18n="pricing.content.plans.annual.name"]')?.textContent,
                heroTitle: document.querySelector('[data-i18n="pricing.content.hero.title"]')?.textContent,
                exploreButton: document.querySelector('[data-i18n="misc.content.explore_plans"]')?.textContent,
                pricingPeriods: Array.from(document.querySelectorAll('.pricing-pack-text')).map(el => el.textContent),
                dataI18nElementsStillPresent: document.querySelectorAll('[data-i18n]').length,
                
                // Check for Hebrew text presence
                hasHebrewText: document.body.textContent.includes('חודשי') || document.body.textContent.includes('שנתי')
            };
        });

        console.log('RTL layout applied:', hebrewState.isRTL);
        console.log('HTML lang attribute:', hebrewState.htmlLang);
        console.log('Active language pill:', hebrewState.activePill);
        console.log('Monthly tab text:', hebrewState.monthlyTabText);
        console.log('Yearly tab text:', hebrewState.yearlyTabText);
        console.log('Hero title:', hebrewState.heroTitle);
        console.log('Explore button text:', hebrewState.exploreButton);
        console.log('Pricing periods:', hebrewState.pricingPeriods);
        console.log('data-i18n elements still present:', hebrewState.dataI18nElementsStillPresent);
        console.log('Page contains Hebrew text:', hebrewState.hasHebrewText);

        // Take screenshot
        await page.screenshot({ path: 'hebrew-pricing-debug.png', fullPage: true });
        console.log('\n📸 Screenshot saved: hebrew-pricing-debug.png');

        // Step 7: Final summary
        console.log('\n📊 FINAL SUMMARY');
        console.log('================');
        
        const issues = [];
        const successes = [];

        if (hebrewState.isRTL) successes.push('RTL layout applied');
        else issues.push('RTL layout not applied');

        if (hebrewState.activePill === 'HE') successes.push('Language pill updated');
        else issues.push('Language pill not updated');

        if (hebrewState.hasHebrewText) successes.push('Hebrew text found on page');
        else issues.push('No Hebrew text found on page');

        if (hebrewState.monthlyTabText && hebrewState.monthlyTabText.includes('חודשי')) successes.push('Monthly tab translated');
        else issues.push('Monthly tab not translated: ' + hebrewState.monthlyTabText);

        if (hebrewState.yearlyTabText && hebrewState.yearlyTabText.includes('שנתי')) successes.push('Yearly tab translated');  
        else issues.push('Yearly tab not translated: ' + hebrewState.yearlyTabText);

        if (apiCalls.length > 0) successes.push('API calls made');
        else issues.push('No API calls detected');

        console.log('✅ SUCCESSES:');
        successes.forEach(success => console.log('   -', success));

        console.log('❌ ISSUES:');
        issues.forEach(issue => console.log('   -', issue));

        const successRate = (successes.length / (successes.length + issues.length)) * 100;
        console.log('Success Rate:', successRate.toFixed(1) + '%');

    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Check if puppeteer is available, install if needed
async function ensurePuppeteer() {
    try {
        require('puppeteer');
        return true;
    } catch (error) {
        console.log('Installing puppeteer...');
        const { execSync } = require('child_process');
        try {
            execSync('npm install puppeteer', { stdio: 'inherit' });
            return true;
        } catch (installError) {
            console.log('❌ Failed to install puppeteer:', installError.message);
            return false;
        }
    }
}

// Main execution
(async () => {
    const puppeteerReady = await ensurePuppeteer();
    if (!puppeteerReady) {
        console.log('❌ Cannot run test without Puppeteer');
        process.exit(1);
    }
    
    await runCompleteHebrewTest();
})();
