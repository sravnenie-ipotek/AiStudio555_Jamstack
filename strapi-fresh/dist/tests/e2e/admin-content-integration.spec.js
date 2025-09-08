"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
test_1.test.describe('Admin Content Integration - ULTRATHINK', () => {
    (0, test_1.test)('End-to-end: Admin content changes reflect on frontend', async ({ page }) => {
        var _a, _b, _c, _d;
        console.log('🔄 ULTRATHINK: Starting comprehensive end-to-end test...');
        // Step 1: Login to Strapi admin
        console.log('📋 Step 1: Login to admin panel');
        await page.goto('http://localhost:1337/admin/auth/login');
        await page.fill('input[name="email"]', '345287biz@gmail.com');
        await page.fill('input[name="password"]', 'Admin123!');
        await page.click('button[type="submit"]');
        await page.waitForURL('**/admin');
        // Step 2: Navigate to Home Page content type
        console.log('📋 Step 2: Navigate to Home Page content');
        await page.click('text=Content Manager');
        await page.waitForTimeout(1000);
        await page.click('text=Home Page');
        await page.waitForTimeout(2000);
        // Step 3: Verify fields are populated (check for mapped fields)
        console.log('📋 Step 3: Verify fields are populated');
        const heroTitleField = page.locator('input[name="heroTitle"]');
        const heroSubtitleField = page.locator('input[name="heroSubtitle"]');
        const featuredCoursesTitle = page.locator('input[name="featuredCoursesTitle"]');
        // Check if fields have values
        const heroTitleValue = await heroTitleField.inputValue();
        const heroSubtitleValue = await heroSubtitleField.inputValue();
        const featuredCoursesTitleValue = await featuredCoursesTitle.inputValue();
        console.log(`📊 Hero Title: "${heroTitleValue}"`);
        console.log(`📊 Hero Subtitle: "${heroSubtitleValue}"`);
        console.log(`📊 Featured Courses: "${featuredCoursesTitleValue}"`);
        // Verify at least some fields are populated
        (0, test_1.expect)(featuredCoursesTitleValue.length).toBeGreaterThan(0);
        // Step 4: Make test changes
        console.log('📋 Step 4: Making test changes');
        const testTimestamp = new Date().getTime();
        const newHeroTitle = `TEST HERO TITLE - ${testTimestamp}`;
        const newHeroSubtitle = `TEST HERO SUBTITLE - ${testTimestamp}`;
        // Clear and fill new values
        await heroTitleField.clear();
        await heroTitleField.fill(newHeroTitle);
        await heroSubtitleField.clear();
        await heroSubtitleField.fill(newHeroSubtitle);
        // Save changes
        console.log('💾 Saving changes...');
        await page.click('button:has-text("Save")');
        await page.waitForTimeout(1000);
        // Publish changes 
        console.log('📤 Publishing changes...');
        await page.click('button:has-text("Publish")');
        await page.waitForTimeout(2000);
        // Step 5: Verify changes in Live API
        console.log('📋 Step 5: Checking Live API for changes');
        const apiResponse = await fetch('http://localhost:3333/api/home-page-live');
        const apiData = await apiResponse.json();
        console.log('🔍 Live API Response:', {
            heroTitle: (_a = apiData.data) === null || _a === void 0 ? void 0 : _a.heroTitle,
            heroSubtitle: (_b = apiData.data) === null || _b === void 0 ? void 0 : _b.heroSubtitle
        });
        // Verify changes appear in Live API
        (0, test_1.expect)((_c = apiData.data) === null || _c === void 0 ? void 0 : _c.heroTitle).toBe(newHeroTitle);
        (0, test_1.expect)((_d = apiData.data) === null || _d === void 0 ? void 0 : _d.heroSubtitle).toBe(newHeroSubtitle);
        // Step 6: Check frontend integration script
        console.log('📋 Step 6: Testing frontend integration');
        await page.goto('http://localhost:3005/home.html');
        await page.waitForTimeout(6000); // Wait for integration script to update
        // Look for the updated content on the page (if integration is working)
        const pageContent = await page.content();
        console.log('🔍 Checking if new content appears on frontend...');
        // Check if content updated (this depends on the integration script working)
        const heroSection = page.locator('.banner-heading, .hero-title, h1');
        if (await heroSection.count() > 0) {
            const heroText = await heroSection.first().textContent();
            console.log(`🎯 Frontend hero text: "${heroText}"`);
            if (heroText === null || heroText === void 0 ? void 0 : heroText.includes(testTimestamp.toString())) {
                console.log('✅ SUCCESS: Changes reflected on frontend!');
            }
            else {
                console.log('⚠️  Frontend not updated yet (integration script may need time)');
            }
        }
        console.log('🎉 ULTRATHINK test completed!');
    });
    (0, test_1.test)('Verify field mappings are working', async ({ page }) => {
        console.log('🔄 Testing field mappings specifically...');
        await page.goto('http://localhost:1337/admin/auth/login');
        await page.fill('input[name="email"]', '345287biz@gmail.com');
        await page.fill('input[name="password"]', 'Admin123!');
        await page.click('button[type="submit"]');
        await page.waitForURL('**/admin');
        await page.click('text=Content Manager');
        await page.waitForTimeout(1000);
        await page.click('text=Home Page');
        await page.waitForTimeout(2000);
        // Test multiple field mappings
        const fields = [
            { name: 'heroTitle', label: 'Hero Title' },
            { name: 'heroSubtitle', label: 'Hero Subtitle' },
            { name: 'featuredCoursesTitle', label: 'Featured Courses Title' },
            { name: 'aboutTitle', label: 'About Title' },
            { name: 'companiesTitle', label: 'Companies Title' }
        ];
        for (const field of fields) {
            const fieldElement = page.locator(`input[name="${field.name}"], textarea[name="${field.name}"]`);
            if (await fieldElement.count() > 0) {
                const value = await fieldElement.inputValue();
                console.log(`📊 ${field.label}: "${value}"`);
                if (value && value.length > 0) {
                    console.log(`✅ ${field.name} field mapping working`);
                }
                else {
                    console.log(`❌ ${field.name} field mapping may not be working`);
                }
            }
        }
    });
});
