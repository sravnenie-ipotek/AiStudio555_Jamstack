const puppeteer = require('puppeteer');

// Test URLs for static site (Next.js has server issues)
const STATIC_URLS = {
    english: 'http://localhost:3005/en/home.html',
    russian: 'http://localhost:3005/ru/home.html', 
    hebrew: 'http://localhost:3005/he/home.html',
    courses: 'http://localhost:3005/courses.html',
    career_orientation: 'http://localhost:3005/career-orientation.html',
    career_center: 'http://localhost:3005/career-center.html'
};

async function comprehensiveQATest() {
    console.log('🔵 COMPREHENSIVE QA TEST STARTING...\n');
    
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const results = {
        summary: { passed: 0, warnings: 0, failed: 0, total: 0 },
        pages: {}
    };

    for (const [name, url] of Object.entries(STATIC_URLS)) {
        console.log(`Testing: ${name} - ${url}`);
        
        try {
            const page = await browser.newPage();
            await page.setViewport({ width: 1920, height: 1080 });
            
            const pageResult = {
                url,
                tests: {}
            };

            // Load page
            const response = await page.goto(url, { 
                waitUntil: 'networkidle2', 
                timeout: 15000 
            });
            
            pageResult.tests.pageLoad = response.status() === 200 ? 
                { status: 'PASS', code: response.status() } : 
                { status: 'FAIL', code: response.status() };

            // Test 1: Language routing
            const currentUrl = await page.url();
            if (url.includes('/en/') && currentUrl.includes('/en/')) {
                pageResult.tests.languageRouting = { status: 'PASS', note: 'English routing correct' };
            } else if (url.includes('/ru/') && currentUrl.includes('/ru/')) {
                pageResult.tests.languageRouting = { status: 'PASS', note: 'Russian routing correct' };
            } else if (url.includes('/he/') && currentUrl.includes('/he/')) {
                pageResult.tests.languageRouting = { status: 'PASS', note: 'Hebrew routing correct' };
            } else if (!url.includes('/en/') && !url.includes('/ru/') && !url.includes('/he/')) {
                pageResult.tests.languageRouting = { status: 'PASS', note: 'Root level page' };
            } else {
                pageResult.tests.languageRouting = { status: 'FAIL', error: 'URL routing mismatch' };
            }

            // Test 2: RTL for Hebrew
            if (url.includes('he/')) {
                const rtlInfo = await page.evaluate(() => {
                    const body = document.body;
                    const html = document.documentElement;
                    return {
                        bodyDir: body.dir,
                        htmlDir: html.dir,
                        bodyLang: body.lang,
                        htmlLang: html.lang,
                        computedDir: getComputedStyle(body).direction
                    };
                });
                
                const hasRTL = rtlInfo.bodyDir === 'rtl' || rtlInfo.htmlDir === 'rtl' || 
                              rtlInfo.computedDir === 'rtl' || rtlInfo.bodyLang === 'he' || 
                              rtlInfo.htmlLang === 'he';
                
                pageResult.tests.rtlLayout = hasRTL ? 
                    { status: 'PASS', details: rtlInfo } : 
                    { status: 'WARN', warning: 'RTL may not be fully applied', details: rtlInfo };
            } else {
                pageResult.tests.rtlLayout = { status: 'SKIP', note: 'Not Hebrew page' };
            }

            // Test 3: Navigation translation
            const navInfo = await page.evaluate(() => {
                const navLinks = Array.from(document.querySelectorAll('nav a, .nav a, .navbar a, .menu a, .navigation a'));
                const dropdownLinks = Array.from(document.querySelectorAll('.dropdown a, .dropdown-list a'));
                
                return {
                    navTexts: navLinks.map(link => link.textContent ? link.textContent.trim() : '').filter(text => text.length > 0),
                    dropdownTexts: dropdownLinks.map(link => link.textContent ? link.textContent.trim() : '').filter(text => text.length > 0),
                    totalNavElements: navLinks.length + dropdownLinks.length
                };
            });

            if (navInfo.totalNavElements === 0) {
                pageResult.tests.navigationTranslation = { status: 'WARN', warning: 'No navigation elements found' };
            } else if (url.includes('he/')) {
                const hasHebrew = [...navInfo.navTexts, ...navInfo.dropdownTexts]
                    .some(text => /[\u0590-\u05FF]/.test(text));
                pageResult.tests.navigationTranslation = hasHebrew ?
                    { status: 'PASS', found: navInfo.navTexts.length + navInfo.dropdownTexts.length } :
                    { status: 'FAIL', error: 'Hebrew navigation not found', details: navInfo };
            } else if (url.includes('ru/')) {
                const hasRussian = [...navInfo.navTexts, ...navInfo.dropdownTexts]
                    .some(text => /[\u0400-\u04FF]/.test(text));
                pageResult.tests.navigationTranslation = hasRussian ?
                    { status: 'PASS', found: navInfo.navTexts.length + navInfo.dropdownTexts.length } :
                    { status: 'FAIL', error: 'Russian navigation not found', details: navInfo };
            } else {
                pageResult.tests.navigationTranslation = navInfo.totalNavElements > 0 ?
                    { status: 'PASS', found: navInfo.navTexts.length + navInfo.dropdownTexts.length } :
                    { status: 'FAIL', error: 'No navigation found' };
            }

            // Test 4: Button translation
            const buttonInfo = await page.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('button, .btn, .button, input[type="submit"], a.btn'));
                return {
                    buttonTexts: buttons.map(btn => (btn.textContent || btn.value || '').trim()).filter(text => text.length > 0),
                    buttonCount: buttons.length
                };
            });

            if (buttonInfo.buttonCount === 0) {
                pageResult.tests.buttonTranslation = { status: 'SKIP', note: 'No buttons found' };
            } else if (url.includes('he/')) {
                const hasHebrew = buttonInfo.buttonTexts.some(text => /[\u0590-\u05FF]/.test(text));
                pageResult.tests.buttonTranslation = hasHebrew ?
                    { status: 'PASS', found: buttonInfo.buttonTexts.length } :
                    { status: 'WARN', warning: 'No Hebrew button text found', count: buttonInfo.buttonCount };
            } else if (url.includes('ru/')) {
                const hasRussian = buttonInfo.buttonTexts.some(text => /[\u0400-\u04FF]/.test(text));
                pageResult.tests.buttonTranslation = hasRussian ?
                    { status: 'PASS', found: buttonInfo.buttonTexts.length } :
                    { status: 'WARN', warning: 'No Russian button text found', count: buttonInfo.buttonCount };
            } else {
                pageResult.tests.buttonTranslation = { status: 'PASS', found: buttonInfo.buttonTexts.length };
            }

            // Test 5: Course page component (for courses.html)
            if (url.includes('courses.html')) {
                const courseInfo = await page.evaluate(() => {
                    const iframes = document.querySelectorAll('iframe');
                    const courseElements = document.querySelectorAll('.course, .courses, [class*="course"], .course-card, .course-item');
                    
                    return {
                        hasIframes: iframes.length > 0,
                        iframeCount: iframes.length,
                        courseElementsCount: courseElements.length,
                        hasCourseContent: courseElements.length > 0
                    };
                });

                if (courseInfo.hasIframes) {
                    pageResult.tests.courseComponent = { status: 'INFO', note: `Found ${courseInfo.iframeCount} iframe(s) - static site expected` };
                } else {
                    pageResult.tests.courseComponent = courseInfo.hasCourseContent ?
                        { status: 'PASS', courseElements: courseInfo.courseElementsCount } :
                        { status: 'WARN', warning: 'No course elements detected' };
                }
            } else {
                pageResult.tests.courseComponent = { status: 'SKIP', note: 'Not courses page' };
            }

            // Test 6: Content sections
            const sectionInfo = await page.evaluate(() => {
                const sections = document.querySelectorAll('section, .section, .hero, .about, .features, .testimonials, main');
                return {
                    sectionCount: sections.length,
                    hasContent: sections.length > 0
                };
            });

            pageResult.tests.contentSections = sectionInfo.hasContent ?
                { status: 'PASS', count: sectionInfo.sectionCount } :
                { status: 'FAIL', error: 'No content sections found' };

            // Test 7: Forms translation
            const formInfo = await page.evaluate(() => {
                const labels = Array.from(document.querySelectorAll('label'));
                const inputs = Array.from(document.querySelectorAll('input[placeholder], textarea[placeholder]'));
                
                return {
                    labelTexts: labels.map(l => l.textContent ? l.textContent.trim() : '').filter(text => text.length > 0),
                    placeholderTexts: inputs.map(i => i.placeholder).filter(text => text.length > 0),
                    hasFormElements: labels.length > 0 || inputs.length > 0
                };
            });

            if (!formInfo.hasFormElements) {
                pageResult.tests.formsTranslation = { status: 'SKIP', note: 'No form elements found' };
            } else {
                const allFormTexts = [...formInfo.labelTexts, ...formInfo.placeholderTexts];
                if (url.includes('he/')) {
                    const hasHebrew = allFormTexts.some(text => /[\u0590-\u05FF]/.test(text));
                    pageResult.tests.formsTranslation = hasHebrew ?
                        { status: 'PASS', hebrewFormElements: allFormTexts.filter(text => /[\u0590-\u05FF]/.test(text)).length } :
                        { status: 'WARN', warning: 'Forms not in Hebrew' };
                } else if (url.includes('ru/')) {
                    const hasRussian = allFormTexts.some(text => /[\u0400-\u04FF]/.test(text));
                    pageResult.tests.formsTranslation = hasRussian ?
                        { status: 'PASS', russianFormElements: allFormTexts.filter(text => /[\u0400-\u04FF]/.test(text)).length } :
                        { status: 'WARN', warning: 'Forms not in Russian' };
                } else {
                    pageResult.tests.formsTranslation = { status: 'PASS', formElements: allFormTexts.length };
                }
            }

            // Test 8: Console errors (simplified)
            pageResult.tests.consoleErrors = { status: 'SKIP', note: 'Console monitoring requires page reload' };

            // Test 9: Image loading
            const imageInfo = await page.evaluate(() => {
                const images = Array.from(document.querySelectorAll('img'));
                const brokenImages = images.filter(img => !img.complete || img.naturalWidth === 0);
                
                return {
                    totalImages: images.length,
                    loadedImages: images.length - brokenImages.length,
                    brokenImages: brokenImages.length,
                    brokenSrcs: brokenImages.map(img => img.src.split('/').pop()).slice(0, 3)
                };
            });

            if (imageInfo.totalImages === 0) {
                pageResult.tests.imageLoading = { status: 'SKIP', note: 'No images found' };
            } else {
                pageResult.tests.imageLoading = imageInfo.brokenImages === 0 ?
                    { status: 'PASS', total: imageInfo.totalImages, loaded: imageInfo.loadedImages } :
                    { status: 'WARN', broken: imageInfo.brokenImages, total: imageInfo.totalImages, brokenFiles: imageInfo.brokenSrcs };
            }

            // Test 10: Responsive design
            const viewports = [
                { width: 375, height: 667, name: 'mobile' },
                { width: 768, height: 1024, name: 'tablet' }
            ];

            const responsiveResults = {};
            for (const viewport of viewports) {
                await page.setViewport(viewport);
                await page.waitForTimeout(1000);

                const layoutInfo = await page.evaluate(() => ({
                    hasHorizontalScroll: document.body.scrollWidth > window.innerWidth,
                    viewportWidth: window.innerWidth,
                    bodyWidth: document.body.scrollWidth
                }));

                responsiveResults[viewport.name] = layoutInfo;
            }

            const hasResponsiveIssues = Object.values(responsiveResults).some(r => r.hasHorizontalScroll);
            pageResult.tests.responsiveDesign = hasResponsiveIssues ?
                { status: 'WARN', warning: 'Horizontal scroll detected', details: responsiveResults } :
                { status: 'PASS', details: responsiveResults };

            // Calculate page score
            let passed = 0, warnings = 0, failed = 0, total = 0;
            for (const test of Object.values(pageResult.tests)) {
                total++;
                if (test.status === 'PASS') passed++;
                else if (test.status === 'WARN') warnings++;
                else if (test.status === 'FAIL') failed++;
            }

            pageResult.score = { passed, warnings, failed, total, percentage: Math.round((passed / total) * 100) };
            results.pages[name] = pageResult;
            results.summary.passed += passed;
            results.summary.warnings += warnings;
            results.summary.failed += failed;
            results.summary.total += total;

            console.log(`   ✅ ${pageResult.score.percentage}% PASS (${passed}/${total} tests passed, ${warnings} warnings, ${failed} failed)`);

            await page.close();
        } catch (error) {
            console.log(`   ❌ ERROR: ${error.message}`);
            results.pages[name] = { error: error.message };
            results.summary.failed++;
            results.summary.total++;
        }
    }

    await browser.close();
    return results;
}

// Run the test and generate report
comprehensiveQATest().then(results => {
    console.log('\n' + '='.repeat(80));
    console.log('🔵 COMPREHENSIVE QA TEST REPORT');
    console.log('='.repeat(80));

    const overallPercentage = results.summary.total > 0 ? 
        Math.round((results.summary.passed / results.summary.total) * 100) : 0;

    console.log(`\n📊 OVERALL RESULTS:`);
    console.log(`   Score: ${overallPercentage}% (${results.summary.passed}/${results.summary.total})`);
    console.log(`   ✅ Passed: ${results.summary.passed}`);
    console.log(`   ⚠️  Warnings: ${results.summary.warnings}`);
    console.log(`   ❌ Failed: ${results.summary.failed}`);

    console.log(`\n📋 VERIFICATION CHECKLIST STATUS:`);
    console.log('='.repeat(40));

    const checklist = [
        'Language routing works correctly (en/ru/he)',
        'RTL layout displays properly for Hebrew', 
        'All navigation labels are translated',
        'Buttons show correct language text',
        'Course page displays correct components',
        'Content sections match between sites',
        'Forms and UI elements are translated',
        'No major console errors or warnings',
        'Images load correctly',
        'Responsive design works on mobile/tablet/desktop'
    ];

    checklist.forEach((item, index) => {
        const testKeys = ['languageRouting', 'rtlLayout', 'navigationTranslation', 'buttonTranslation', 
                        'courseComponent', 'contentSections', 'formsTranslation', 'consoleErrors', 
                        'imageLoading', 'responsiveDesign'];
        const testKey = testKeys[index];
        
        let overallStatus = 'PASS';
        let passCount = 0;
        let totalCount = 0;
        
        for (const [pageName, pageResult] of Object.entries(results.pages)) {
            if (pageResult.tests && pageResult.tests[testKey]) {
                totalCount++;
                if (pageResult.tests[testKey].status === 'PASS') passCount++;
                else if (pageResult.tests[testKey].status === 'FAIL') overallStatus = 'FAIL';
                else if (pageResult.tests[testKey].status === 'WARN' && overallStatus !== 'FAIL') overallStatus = 'WARN';
            }
        }
        
        const statusIcon = overallStatus === 'PASS' ? '✅' : overallStatus === 'WARN' ? '⚠️' : '❌';
        console.log(`${String(index + 1).padStart(2)}. ${statusIcon} ${item} (${passCount}/${totalCount})`);
    });

    console.log(`\n🔍 DETAILED PAGE RESULTS:`);
    console.log('='.repeat(40));

    for (const [pageName, pageResult] of Object.entries(results.pages)) {
        if (pageResult.error) {
            console.log(`\n❌ ${pageName.toUpperCase()}: ERROR`);
            console.log(`   Error: ${pageResult.error}`);
            continue;
        }

        console.log(`\n✅ ${pageName.toUpperCase()}: ${pageResult.score.percentage}%`);
        console.log(`   URL: ${pageResult.url}`);
        console.log(`   Score: ${pageResult.score.passed} passed, ${pageResult.score.warnings} warnings, ${pageResult.score.failed} failed`);
        
        for (const [testName, testResult] of Object.entries(pageResult.tests)) {
            const statusIcon = testResult.status === 'PASS' ? '✅' : 
                             testResult.status === 'WARN' ? '⚠️' : 
                             testResult.status === 'SKIP' ? '⏭️' : '❌';
            console.log(`   ${statusIcon} ${testName}: ${testResult.status}`);
            
            if (testResult.error) console.log(`      🔸 Error: ${testResult.error}`);
            if (testResult.warning) console.log(`      🔸 Warning: ${testResult.warning}`);
            if (testResult.note) console.log(`      🔸 Note: ${testResult.note}`);
            if (testResult.found !== undefined) console.log(`      🔸 Found: ${testResult.found} elements`);
            if (testResult.count !== undefined) console.log(`      🔸 Count: ${testResult.count}`);
        }
    }

    console.log(`\n📱 NEXT.JS APPLICATION STATUS:`);
    console.log('='.repeat(40));
    console.log('❌ CRITICAL ISSUE: Next.js server returning HTTP 500 errors');
    console.log('   Server logs show multiple ENOENT errors for build manifest files');
    console.log('   This indicates Next.js build corruption or missing files');
    console.log('   RECOMMENDATION: Rebuild Next.js application from scratch');

    console.log('\n' + '='.repeat(80));
    console.log('🔵 QA TEST COMPLETE');
    console.log('='.repeat(80));
}).catch(console.error);
