const { chromium } = require('playwright');

async function diagnoseBlankPage() {
    console.log('🔍 Diagnosing blank page issue...\n');

    const browser = await chromium.launch({
        headless: false,
        slowMo: 500
    });

    const page = await browser.newPage();

    // Capture all console messages
    const consoleMessages = [];
    const errors = [];
    const failedResources = [];

    page.on('console', msg => {
        consoleMessages.push(`${msg.type()}: ${msg.text()}`);
    });

    page.on('pageerror', error => {
        errors.push(error.toString());
    });

    page.on('requestfailed', request => {
        failedResources.push(`${request.method()} ${request.url()} - ${request.failure()?.errorText}`);
    });

    console.log('📍 Loading page: http://localhost:3005/he/courses.html');

    try {
        await page.goto('http://localhost:3005/he/courses.html', {
            waitUntil: 'networkidle',
            timeout: 30000
        });

        // Wait a bit for any dynamic content
        await page.waitForTimeout(3000);

        // Check basic page elements
        const title = await page.title();
        const bodyContent = await page.evaluate(() => document.body?.innerHTML?.length || 0);
        const hasNavigation = await page.locator('nav').count();
        const hasMain = await page.locator('main').count();
        const hasContent = await page.locator('section').count();

        console.log('\n📊 Page Analysis:');
        console.log(`Title: "${title}"`);
        console.log(`Body content length: ${bodyContent} characters`);
        console.log(`Navigation elements: ${hasNavigation}`);
        console.log(`Main content: ${hasMain}`);
        console.log(`Sections found: ${hasContent}`);

        // Check if CSS is loaded
        const stylesLoaded = await page.evaluate(() => {
            const styles = Array.from(document.styleSheets);
            return styles.length;
        });
        console.log(`Stylesheets loaded: ${stylesLoaded}`);

        // Check specific elements
        const elementsCheck = {
            'Banner section': await page.locator('.inner-banner').count(),
            'Category cards': await page.locator('.category-cards-section').count(),
            'Career section': await page.locator('.career-section').count(),
            'Featured courses': await page.locator('.featured-courses').count(),
            'FAQ section': await page.locator('.section.faq').count(),
            'Footer': await page.locator('footer, #dynamic-footer-container').count()
        };

        console.log('\n🔍 Element Detection:');
        for (const [element, count] of Object.entries(elementsCheck)) {
            console.log(`${element}: ${count > 0 ? '✅' : '❌'} (${count})`);
        }

        // Check for CSS issues
        const computedStyles = await page.evaluate(() => {
            const body = document.body;
            if (!body) return 'No body element';
            const styles = window.getComputedStyle(body);
            return {
                display: styles.display,
                visibility: styles.visibility,
                opacity: styles.opacity,
                backgroundColor: styles.backgroundColor
            };
        });

        console.log('\n🎨 Body Styles:');
        console.log(JSON.stringify(computedStyles, null, 2));

        // Report console messages
        if (consoleMessages.length > 0) {
            console.log('\n📱 Console Messages:');
            consoleMessages.forEach(msg => console.log(`  ${msg}`));
        }

        // Report errors
        if (errors.length > 0) {
            console.log('\n❌ JavaScript Errors:');
            errors.forEach(error => console.log(`  ${error}`));
        }

        // Report failed resources
        if (failedResources.length > 0) {
            console.log('\n🚫 Failed Resources:');
            failedResources.forEach(resource => console.log(`  ${resource}`));
        }

        // Take screenshot for visual inspection
        await page.screenshot({ path: 'blank-page-diagnosis.png', fullPage: true });
        console.log('\n📸 Screenshot saved: blank-page-diagnosis.png');

        console.log('\n✅ Diagnosis complete! Press Ctrl+C to close browser.');
        await new Promise(() => {});

    } catch (error) {
        console.error('\n❌ Error during diagnosis:', error);
    }
}

diagnoseBlankPage().catch(console.error);