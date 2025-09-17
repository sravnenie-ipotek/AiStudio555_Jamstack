const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({
        headless: false,
        devtools: true  // Open with DevTools to see network requests
    });

    const context = await browser.newContext({
        // Force fresh context without cache
        bypassCSP: true,
        ignoreHTTPSErrors: true
    });

    try {
        console.log('🚀 Playwright Test - Checking Courses Display\n');
        console.log('=' .repeat(60));

        // Test 1: Check backups/newDesign/courses.html
        console.log('\n📋 TEST 1: COURSES PAGE (backups/newDesign/courses.html)');
        const coursesPage = await context.newPage();

        // Clear any cache
        await coursesPage.evaluate(() => {
            if ('caches' in window) {
                caches.keys().then(names => {
                    names.forEach(name => caches.delete(name));
                });
            }
        });

        // Listen for console messages
        coursesPage.on('console', msg => {
            const text = msg.text();
            if (text.includes('ND Courses') || text.includes('Found') || text.includes('Error')) {
                console.log(`   🖥️ Console: ${text}`);
            }
        });

        // Listen for network failures
        coursesPage.on('requestfailed', request => {
            console.log(`   ❌ Request failed: ${request.url()}`);
            console.log(`      Failure: ${request.failure().errorText}`);
        });

        // Listen for successful API calls
        coursesPage.on('response', response => {
            if (response.url().includes('/api/nd/courses')) {
                console.log(`   ✅ API Response: ${response.url()} - Status: ${response.status()}`);
            }
        });

        console.log('   🔄 Loading page...');
        await coursesPage.goto('http://localhost:3005/backups/newDesign/courses.html', {
            waitUntil: 'networkidle'
        });

        // Wait for potential courses to load
        await coursesPage.waitForTimeout(3000);

        // Check for "No items found" message
        const noItemsCount = await coursesPage.locator('.w-dyn-empty:visible').count();
        console.log(`   📊 "No items found" messages visible: ${noItemsCount}`);

        // Check for course items
        const courseItems = await coursesPage.locator('.featured-courses-collection-item').count();
        console.log(`   📚 Course items found: ${courseItems}`);

        // Check what's in the course collection lists
        const collectionLists = await coursesPage.locator('.featured-courses-collection-list').count();
        console.log(`   📦 Collection lists found: ${collectionLists}`);

        // Get HTML of first collection list to see what's there
        if (collectionLists > 0) {
            const firstListHTML = await coursesPage.locator('.featured-courses-collection-list').first().innerHTML();
            if (firstListHTML.trim().length === 0) {
                console.log('   ⚠️ Collection list is empty!');
            } else if (firstListHTML.includes('featured-courses-item-title')) {
                const titles = await coursesPage.locator('.featured-courses-item-title').allTextContents();
                console.log(`   ✅ Courses loaded: ${titles.join(', ')}`);
            }
        }

        // Take screenshot
        await coursesPage.screenshot({
            path: 'playwright-courses-page.png',
            fullPage: true
        });
        console.log('   📸 Screenshot: playwright-courses-page.png');

        // Test 2: Check admin panel
        console.log('\n📋 TEST 2: ADMIN PANEL (admin-nd.html)');
        const adminPage = await context.newPage();

        // Listen for console messages
        adminPage.on('console', msg => {
            const text = msg.text();
            if (text.includes('courses') || text.includes('Loading') || text.includes('Error')) {
                console.log(`   🖥️ Console: ${text}`);
            }
        });

        // Listen for network failures
        adminPage.on('requestfailed', request => {
            if (request.url().includes('/api/')) {
                console.log(`   ❌ API Request failed: ${request.url()}`);
                console.log(`      Error: ${request.failure().errorText}`);
            }
        });

        console.log('   🔄 Loading admin page...');
        await adminPage.goto('http://localhost:3005/admin-nd.html', {
            waitUntil: 'networkidle'
        });

        await adminPage.waitForTimeout(1000);

        // Click on Courses tab
        console.log('   🔄 Clicking Courses tab...');
        await adminPage.click('button[data-tab="courses"]');
        await adminPage.waitForTimeout(2000);

        // Count courses in admin
        const adminCourseCount = await adminPage.locator('#coursesList > div > div').count();
        console.log(`   📚 Admin courses count: ${adminCourseCount}`);

        // Get course titles from admin
        if (adminCourseCount > 0) {
            const adminTitles = await adminPage.locator('#coursesList h4').allTextContents();
            const cleanTitles = adminTitles.map(t => t.split('⭐')[0].split('👁️')[0].trim());
            console.log(`   ✅ Admin courses: ${cleanTitles.join(', ')}`);
        }

        // Take screenshot
        await adminPage.screenshot({
            path: 'playwright-admin-courses.png',
            fullPage: false
        });
        console.log('   📸 Screenshot: playwright-admin-courses.png');

        // Test 3: Direct API test
        console.log('\n📋 TEST 3: DIRECT API TEST');
        const apiPage = await context.newPage();

        const apiResponse = await apiPage.evaluate(async () => {
            try {
                const response = await fetch('http://localhost:3000/api/nd/courses?locale=en');
                const data = await response.json();
                return {
                    success: data.success,
                    count: data.data ? data.data.length : 0,
                    courses: data.data ? data.data.map(c => c.title) : []
                };
            } catch (error) {
                return { error: error.message };
            }
        });

        if (apiResponse.error) {
            console.log(`   ❌ API Error: ${apiResponse.error}`);
        } else {
            console.log(`   ✅ API Success: ${apiResponse.success}`);
            console.log(`   📊 API Courses: ${apiResponse.count}`);
            if (apiResponse.courses.length > 0) {
                console.log(`   📚 Titles: ${apiResponse.courses.join(', ')}`);
            }
        }

        // Summary
        console.log('\n' + '=' .repeat(60));
        console.log('📊 SUMMARY:');
        console.log(`   Courses Page: ${courseItems} courses displayed`);
        console.log(`   Admin Panel: ${adminCourseCount} courses displayed`);
        console.log(`   API Direct: ${apiResponse.count || 0} courses available`);

        if (courseItems === 0 && apiResponse.count > 0) {
            console.log('\n⚠️ ISSUE: API has courses but page not displaying them');
            console.log('   Possible causes:');
            console.log('   1. JavaScript not executing (check console errors)');
            console.log('   2. DOM selectors not matching');
            console.log('   3. Script loading issues');
        }

    } catch (error) {
        console.error('\n❌ Test Error:', error.message);
    } finally {
        console.log('\n🔄 Keeping browser open for inspection...');
        console.log('   Check the DevTools Network tab for failed requests');
        console.log('   Check the Console for JavaScript errors');
        console.log('   Press Ctrl+C to close when done');

        // Keep browser open for debugging
        await new Promise(resolve => {
            process.on('SIGINT', () => {
                console.log('\n👋 Closing browser...');
                resolve();
            });
        });

        await browser.close();
    }
})();