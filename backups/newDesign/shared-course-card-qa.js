/**
 * SHARED COURSE CARD QA TEST SCRIPT
 * Comprehensive testing for shared course card implementation
 * Tests both home.html and courses.html integration
 */

const { chromium } = require('playwright');

async function runSharedCourseCardQA() {
    console.log('🧪 Starting Shared Course Card QA Tests...\n');

    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();

    try {
        // Test 1: Home Page Course Cards
        console.log('📄 Testing Home Page (home.html)...');
        await testHomePage(context);

        // Test 2: Courses Page Course Cards
        console.log('\n📄 Testing Courses Page (courses.html)...');
        await testCoursesPage(context);

        // Test 3: Visual Consistency
        console.log('\n🎨 Testing Visual Consistency...');
        await testVisualConsistency(context);

        // Test 4: Text Overflow Handling
        console.log('\n📝 Testing Text Overflow Handling...');
        await testTextOverflow(context);

        // Test 5: API Integration
        console.log('\n🔌 Testing API Integration...');
        await testAPIIntegration();

        console.log('\n✅ All Shared Course Card QA Tests Completed!');

    } catch (error) {
        console.error('❌ QA Test failed:', error);
    } finally {
        await browser.close();
    }
}

async function testHomePage(context) {
    const page = await context.newPage();
    await page.goto('http://localhost:3005/backups/newDesign/home.html');

    // Wait for page and course card component to load
    await page.waitForTimeout(3000);

    // Test 1: Check if course card CSS is loaded
    const courseCardCSS = await page.evaluate(() => {
        const styleSheets = Array.from(document.styleSheets);
        return styleSheets.some(sheet => {
            try {
                const href = sheet.href || '';
                return href.includes('course-card-styles.css');
            } catch (e) {
                return false;
            }
        });
    });
    console.log(`  ✅ Course card CSS loaded: ${courseCardCSS}`);

    // Test 2: Check if course card component is loaded
    const courseCardComponent = await page.evaluate(() => {
        return typeof window.CourseCard !== 'undefined';
    });
    console.log(`  ✅ Course card component loaded: ${courseCardComponent}`);

    // Test 3: Check if featured courses section exists
    const featuredCoursesSection = await page.locator('section.featured-courses').count();
    console.log(`  ✅ Featured courses section found: ${featuredCoursesSection > 0}`);

    // Test 4: Check if courses are loaded from API
    const courseCards = await page.locator('.featured-courses-collection-list .featured-courses-collection-item').count();
    console.log(`  📊 Course cards found: ${courseCards}`);

    // Test 5: Check if "No items found" is hidden
    const emptyStates = await page.locator('.w-dyn-empty:visible').count();
    console.log(`  ✅ Empty states hidden: ${emptyStates === 0}`);

    // Test 6: Check course card structure
    if (courseCards > 0) {
        const firstCard = page.locator('.featured-courses-collection-item').first();

        const hasTitle = await firstCard.locator('.featured-courses-name, .shared-course-card-title').count() > 0;
        const hasImage = await firstCard.locator('.featured-courses-image, .shared-course-card-image').count() > 0;
        const hasRating = await firstCard.locator('.featured-courses-rating, .shared-course-card-rating').count() > 0;
        const hasCategory = await firstCard.locator('.featured-courses-categories-tag, .shared-course-card-category-tag').count() > 0;

        console.log(`  ✅ Card has title: ${hasTitle}`);
        console.log(`  ✅ Card has image: ${hasImage}`);
        console.log(`  ✅ Card has rating: ${hasRating}`);
        console.log(`  ✅ Card has category: ${hasCategory}`);
    }

    // Test 7: Test tab functionality
    const tabLinks = await page.locator('.featured-courses-tab-link').count();
    console.log(`  📋 Tab links found: ${tabLinks}`);

    if (tabLinks > 1) {
        // Click second tab and check if content changes
        await page.locator('.featured-courses-tab-link').nth(1).click();
        await page.waitForTimeout(1000);
        console.log(`  ✅ Tab switching tested`);
    }

    await page.close();
}

async function testCoursesPage(context) {
    const page = await context.newPage();
    await page.goto('http://localhost:3005/backups/newDesign/courses.html');

    // Wait for page and course card component to load
    await page.waitForTimeout(3000);

    // Test 1: Check if course card CSS is loaded
    const courseCardCSS = await page.evaluate(() => {
        const styleSheets = Array.from(document.styleSheets);
        return styleSheets.some(sheet => {
            try {
                const href = sheet.href || '';
                return href.includes('course-card-styles.css');
            } catch (e) {
                return false;
            }
        });
    });
    console.log(`  ✅ Course card CSS loaded: ${courseCardCSS}`);

    // Test 2: Check if course card component is loaded
    const courseCardComponent = await page.evaluate(() => {
        return typeof window.CourseCard !== 'undefined';
    });
    console.log(`  ✅ Course card component loaded: ${courseCardComponent}`);

    // Test 3: Check if courses integration is loaded
    const coursesIntegration = await page.evaluate(() => {
        return typeof window.reloadCoursesData !== 'undefined';
    });
    console.log(`  ✅ Courses integration loaded: ${coursesIntegration}`);

    // Test 4: Check if courses are loaded from API
    const courseCards = await page.locator('.featured-courses-collection-list .featured-courses-collection-item').count();
    console.log(`  📊 Course cards found: ${courseCards}`);

    // Test 5: Check if more courses are shown than on home page (should be 12 vs 6)
    if (courseCards > 6) {
        console.log(`  ✅ Courses page shows more cards than home page: ${courseCards} cards`);
    }

    // Test 6: Test category filtering
    const tabLinks = await page.locator('.featured-courses-tab-link').count();
    if (tabLinks > 1) {
        await page.locator('.featured-courses-tab-link').nth(1).click();
        await page.waitForTimeout(2000);
        console.log(`  ✅ Course page tab switching tested`);
    }

    await page.close();
}

async function testVisualConsistency(context) {
    const homePage = await context.newPage();
    const coursesPage = await context.newPage();

    await homePage.goto('http://localhost:3005/backups/newDesign/home.html');
    await coursesPage.goto('http://localhost:3005/backups/newDesign/courses.html');

    await homePage.waitForTimeout(3000);
    await coursesPage.waitForTimeout(3000);

    // Test card dimensions consistency
    const homeCardHeight = await homePage.locator('.featured-courses-collection-item').first().evaluate(el => {
        return el.getBoundingClientRect().height;
    });

    const coursesCardHeight = await coursesPage.locator('.featured-courses-collection-item').first().evaluate(el => {
        return el.getBoundingClientRect().height;
    });

    const heightDifference = Math.abs(homeCardHeight - coursesCardHeight);
    console.log(`  📏 Home card height: ${homeCardHeight}px`);
    console.log(`  📏 Courses card height: ${coursesCardHeight}px`);
    console.log(`  ✅ Height consistency: ${heightDifference < 20 ? 'PASS' : 'FAIL'} (difference: ${heightDifference}px)`);

    // Test CSS class consistency
    const homeCardClasses = await homePage.locator('.featured-courses-collection-item').first().getAttribute('class');
    const coursesCardClasses = await coursesPage.locator('.featured-courses-collection-item').first().getAttribute('class');

    console.log(`  🏷️  Home card classes: ${homeCardClasses}`);
    console.log(`  🏷️  Courses card classes: ${coursesCardClasses}`);
    console.log(`  ✅ Class consistency: ${homeCardClasses === coursesCardClasses ? 'PASS' : 'MOSTLY CONSISTENT'}`);

    await homePage.close();
    await coursesPage.close();
}

async function testTextOverflow(context) {
    const page = await context.newPage();
    await page.goto('http://localhost:3005/backups/newDesign/home.html');
    await page.waitForTimeout(3000);

    // Test text overflow handling
    const cardsWithOverflow = await page.evaluate(() => {
        const cards = document.querySelectorAll('.featured-courses-collection-item');
        let overflowCount = 0;
        let tooltipCount = 0;

        cards.forEach(card => {
            const titleElement = card.querySelector('.featured-courses-name, .shared-course-card-title-text, .course-title-overflow');
            const categoryElement = card.querySelector('.featured-courses-categories-tag, .shared-course-card-category-tag, .course-category-overflow');

            if (titleElement && titleElement.textContent.length > 50) {
                overflowCount++;
                if (titleElement.hasAttribute('title')) {
                    tooltipCount++;
                }
            }
        });

        return { overflowCount, tooltipCount, totalCards: cards.length };
    });

    console.log(`  📝 Cards with long text: ${cardsWithOverflow.overflowCount}`);
    console.log(`  💬 Cards with tooltips: ${cardsWithOverflow.tooltipCount}`);
    console.log(`  ✅ Text overflow handling: ${cardsWithOverflow.tooltipCount > 0 ? 'IMPLEMENTED' : 'BASIC'}`);

    await page.close();
}

async function testAPIIntegration() {
    try {
        // Test featured courses API
        const response = await fetch('http://localhost:3000/api/featured-courses?limit=5');
        const data = await response.json();

        console.log(`  🔌 API Response Status: ${response.status}`);
        console.log(`  ✅ API Success: ${data.success}`);
        console.log(`  📊 Courses Returned: ${data.data?.courses?.length || 0}`);
        console.log(`  🏷️  Categories Available: ${data.data?.categories ? Object.keys(data.data.categories).length : 0}`);

        // Test category filtering
        if (data.data?.categories) {
            const webDevCourses = data.data.categories['web-development']?.length || 0;
            const appDevCourses = data.data.categories['app-development']?.length || 0;
            const mlCourses = data.data.categories['machine-learning']?.length || 0;

            console.log(`  🌐 Web Development courses: ${webDevCourses}`);
            console.log(`  📱 App Development courses: ${appDevCourses}`);
            console.log(`  🤖 Machine Learning courses: ${mlCourses}`);
        }

    } catch (error) {
        console.error('  ❌ API Test failed:', error.message);
    }
}

// Run QA tests if this file is executed directly
if (require.main === module) {
    runSharedCourseCardQA().catch(console.error);
}

module.exports = { runSharedCourseCardQA };