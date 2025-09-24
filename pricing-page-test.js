const { chromium } = require('playwright');

async function testPricingPage() {
    console.log('🔵 QA TEST: Pricing Page Translation Verification\n');
    
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
        viewport: { width: 1280, height: 720 }
    });
    const page = await context.newPage();
    
    // Enable console logging
    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log('❌ Console Error:', msg.text());
        }
    });
    
    try {
        console.log('🔍 Loading pricing page...');
        await page.goto('http://localhost:3005/pricing.html', { 
            waitUntil: 'networkidle',
            timeout: 10000 
        });
        
        // Wait for language manager to load
        await page.waitForTimeout(2000);
        
        console.log('\n📋 TEST RESULTS:\n');
        
        // Test 1: Hebrew Tab Labels Fix
        console.log('1️⃣ Testing Hebrew Tab Labels Fix');
        console.log('   Switching to Hebrew (HE)...');
        
        await page.click('a[href="#he"]');
        await page.waitForTimeout(1500);
        
        // Check if Hebrew tab labels are correct
        const monthlyTabHe = await page.textContent('.monthly-tab, [data-i18n*="monthly"]').catch(() => 'Not found');
        const yearlyTabHe = await page.textContent('.yearly-tab, [data-i18n*="yearly"]').catch(() => 'Not found');
        
        console.log('   Monthly tab text (HE):', monthlyTabHe);
        console.log('   Yearly tab text (HE):', yearlyTabHe);
        
        // Test 2: Main Navigation Translation
        console.log('\n2️⃣ Testing Main Navigation Translation');
        
        const languages = [
            { code: 'en', name: 'English', expectedHome: 'Home', expectedCourses: 'Courses', expectedPricing: 'Pricing' },
            { code: 'ru', name: 'Russian', expectedHome: 'Главная', expectedCourses: 'Курсы', expectedPricing: 'Цены' },
            { code: 'he', name: 'Hebrew', expectedHome: 'בית', expectedCourses: 'קורסים', expectedPricing: 'מחירים' }
        ];
        
        for (const lang of languages) {
            console.log(`   Testing ${lang.name} (${lang.code})...`);
            
            await page.click(`a[href="#${lang.code}"]`);
            await page.waitForTimeout(1000);
            
            const navItems = await page.$$eval('.navbar a, .nav-link', elements => 
                elements.map(el => el.textContent.trim())
            ).catch(() => []);
            
            console.log(`   Navigation items (${lang.code}):`, navItems.slice(0, 5));
        }
        
        // Test 3: Breadcrumb Navigation
        console.log('\n3️⃣ Testing Breadcrumb Navigation');
        
        for (const lang of languages) {
            await page.click(`a[href="#${lang.code}"]`);
            await page.waitForTimeout(1000);
            
            const breadcrumbs = await page.$$eval('.breadcrumb, .breadcrumbs', 
                elements => elements.map(el => el.textContent.trim())
            ).catch(() => []);
            
            console.log(`   Breadcrumbs (${lang.code}):`, breadcrumbs);
        }
        
        // Test 4: Overall Stability
        console.log('\n4️⃣ Testing Overall Stability');
        
        // Test language switching
        console.log('   Testing language switching...');
        await page.click('a[href="#en"]');
        await page.waitForTimeout(500);
        await page.click('a[href="#ru"]');
        await page.waitForTimeout(500);
        await page.click('a[href="#he"]');
        await page.waitForTimeout(500);
        
        // Check RTL for Hebrew
        const bodyDir = await page.getAttribute('body', 'dir');
        const htmlDir = await page.getAttribute('html', 'dir');
        
        console.log('   HTML dir attribute:', htmlDir);
        console.log('   Body dir attribute:', bodyDir);
        
        // Test 5: Race Condition Improvements
        console.log('\n5️⃣ Testing Race Condition Improvements');
        console.log('   Testing rapid language switching HE ↔ RU...');
        
        for (let i = 0; i < 3; i++) {
            await page.click('a[href="#he"]');
            await page.waitForTimeout(200);
            await page.click('a[href="#ru"]');
            await page.waitForTimeout(200);
        }
        
        // Final check on Hebrew
        await page.click('a[href="#he"]');
        await page.waitForTimeout(1000);
        
        console.log('\n🏁 TEST SUMMARY COMPLETE');
        
        // Take screenshot for visual verification
        await page.screenshot({ 
            path: '/Users/michaelmishayev/Desktop/newCode/pricing-test-result.png', 
            fullPage: true 
        });
        console.log('📸 Screenshot saved: pricing-test-result.png');
        
    } catch (error) {
        console.log('❌ Test failed with error:', error.message);
    } finally {
        await browser.close();
    }
}

testPricingPage();
