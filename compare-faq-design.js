const { chromium } = require('playwright');

async function compareFAQDesign() {
    console.log('🔍 ULTRATHINK: Comparing FAQ Design Between Home vs Courses\n');

    const browser = await chromium.launch({ headless: false, slowMo: 1000 });

    // Create two pages for comparison
    const homePage = await browser.newPage();
    const coursesPage = await browser.newPage();

    await homePage.setViewportSize({ width: 1280, height: 1024 });
    await coursesPage.setViewportSize({ width: 1280, height: 1024 });

    // Load both pages
    console.log('📍 Loading home page...');
    await homePage.goto('http://localhost:3005/he/home.html', { waitUntil: 'networkidle' });
    await homePage.waitForTimeout(2000);

    console.log('📍 Loading courses page...');
    await coursesPage.goto('http://localhost:3005/he/courses.html', { waitUntil: 'networkidle' });
    await coursesPage.waitForTimeout(2000);

    // Navigate to FAQ sections on both pages
    console.log('\n🎯 Scrolling to FAQ sections...');
    await homePage.locator('section.faq').scrollIntoViewIfNeeded();
    await coursesPage.locator('section.faq').scrollIntoViewIfNeeded();
    await homePage.waitForTimeout(1000);
    await coursesPage.waitForTimeout(1000);

    // Analyze FAQ structures
    console.log('\n📊 STRUCTURAL ANALYSIS:');

    // Check main containers
    const homeMainContainer = await homePage.locator('section.faq .container').count();
    const coursesMainContainer = await coursesPage.locator('section.faq .container').count();
    console.log(`Main containers - Home: ${homeMainContainer}, Courses: ${coursesMainContainer}`);

    // Check title wrappers
    const homeTitleWrapper = await homePage.locator('section.faq .faq-section-title-wrapper').count();
    const coursesTitleWrapper = await coursesPage.locator('section.faq .faq-section-title-wrapper').count();
    console.log(`Title wrappers - Home: ${homeTitleWrapper}, Courses: ${coursesTitleWrapper}`);

    // Check content structure
    const homeFaqContent = await homePage.locator('section.faq .faq-content').count();
    const coursesFaqContent = await coursesPage.locator('section.faq .faq-content').count();
    console.log(`FAQ content - Home: ${homeFaqContent}, Courses: ${coursesFaqContent}`);

    // Check image wrappers
    const homeImageWrapper = await homePage.locator('section.faq .faq-image-wrapper').count();
    const coursesImageWrapper = await coursesPage.locator('section.faq .faq-image-wrapper').count();
    console.log(`Image wrappers - Home: ${homeImageWrapper}, Courses: ${coursesImageWrapper}`);

    // Check ticker systems
    const homeTickerWrapper = await homePage.locator('section.faq .faq-ticker-wrapper').count();
    const coursesTickerWrapper = await coursesPage.locator('section.faq .faq-ticker-wrapper').count();
    console.log(`Ticker wrappers - Home: ${homeTickerWrapper}, Courses: ${coursesTickerWrapper}`);

    // Check w-tabs systems
    const homeWTabs = await homePage.locator('section.faq .w-tabs').count();
    const coursesWTabs = await coursesPage.locator('section.faq .w-tabs').count();
    console.log(`W-tabs systems - Home: ${homeWTabs}, Courses: ${coursesWTabs}`);

    // Check FAQ single content
    const homeFaqSingleContent = await homePage.locator('section.faq .faq-single-content').count();
    const coursesFaqSingleContent = await coursesPage.locator('section.faq .faq-single-content').count();
    console.log(`FAQ single content - Home: ${homeFaqSingleContent}, Courses: ${coursesFaqSingleContent}`);

    // Get CSS classes for main FAQ sections
    console.log('\n🎨 CSS CLASSES COMPARISON:');
    try {
        const homeFaqClasses = await homePage.locator('section.faq').getAttribute('class');
        const coursesFaqClasses = await coursesPage.locator('section.faq').getAttribute('class');
        console.log(`Home FAQ classes: "${homeFaqClasses}"`);
        console.log(`Courses FAQ classes: "${coursesFaqClasses}"`);
    } catch (e) {
        console.log('Error getting FAQ classes:', e.message);
    }

    // Check visibility states
    console.log('\n👁️ VISIBILITY COMPARISON:');
    const homeFaqVisible = await homePage.locator('section.faq').isVisible();
    const coursesFaqVisible = await coursesPage.locator('section.faq').isVisible();
    console.log(`FAQ visible - Home: ${homeFaqVisible ? '✅' : '❌'}, Courses: ${coursesFaqVisible ? '✅' : '❌'}`);

    // Check opacity styles
    try {
        const homeTitleOpacity = await homePage.locator('section.faq .faq-section-title-wrapper').getAttribute('style');
        const coursesTitleOpacity = await coursesPage.locator('section.faq .faq-section-title-wrapper').getAttribute('style');
        console.log(`Title opacity - Home: "${homeTitleOpacity}", Courses: "${coursesTitleOpacity}"`);

        const homeContentOpacity = await homePage.locator('section.faq .faq-content').getAttribute('style');
        const coursesContentOpacity = await coursesPage.locator('section.faq .faq-content').getAttribute('style');
        console.log(`Content opacity - Home: "${homeContentOpacity}", Courses: "${coursesContentOpacity}"`);
    } catch (e) {
        console.log('Error getting opacity styles:', e.message);
    }

    // Check layout positioning
    console.log('\n📐 LAYOUT ANALYSIS:');
    try {
        const homeLayout = await homePage.locator('section.faq').evaluate(el => {
            const rect = el.getBoundingClientRect();
            const style = window.getComputedStyle(el);
            return {
                width: rect.width,
                height: rect.height,
                display: style.display,
                position: style.position,
                padding: style.padding,
                margin: style.margin
            };
        });

        const coursesLayout = await coursesPage.locator('section.faq').evaluate(el => {
            const rect = el.getBoundingClientRect();
            const style = window.getComputedStyle(el);
            return {
                width: rect.width,
                height: rect.height,
                display: style.display,
                position: style.position,
                padding: style.padding,
                margin: style.margin
            };
        });

        console.log('Home layout:', JSON.stringify(homeLayout, null, 2));
        console.log('Courses layout:', JSON.stringify(coursesLayout, null, 2));
    } catch (e) {
        console.log('Error getting layout info:', e.message);
    }

    // Take side-by-side screenshots
    console.log('\n📸 Taking comparison screenshots...');

    // Screenshot home FAQ
    const homeFaqBbox = await homePage.locator('section.faq').boundingBox();
    if (homeFaqBbox) {
        await homePage.screenshot({
            path: 'home-faq-section.png',
            clip: homeFaqBbox
        });
    }

    // Screenshot courses FAQ
    const coursesFaqBbox = await coursesPage.locator('section.faq').boundingBox();
    if (coursesFaqBbox) {
        await coursesPage.screenshot({
            path: 'courses-faq-section.png',
            clip: coursesFaqBbox
        });
    }

    // Full page screenshots
    await homePage.screenshot({ path: 'home-full-page.png', fullPage: true });
    await coursesPage.screenshot({ path: 'courses-full-page.png', fullPage: true });

    console.log('\n📊 DETAILED COMPARISON COMPLETE!');
    console.log('Screenshots saved:');
    console.log('- home-faq-section.png (Home FAQ only)');
    console.log('- courses-faq-section.png (Courses FAQ only)');
    console.log('- home-full-page.png (Full home page)');
    console.log('- courses-full-page.png (Full courses page)');

    console.log('\n✅ Analysis complete! Browser will stay open for manual inspection.');
    console.log('Press Ctrl+C to close when done.');

    // Keep browser open for manual inspection
    await new Promise(() => {});
}

compareFAQDesign().catch(console.error);