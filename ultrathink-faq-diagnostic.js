const { chromium } = require('playwright');

async function ultrathinkDiagnostic() {
    console.log('🧠 ULTRATHINK DIAGNOSTIC - Deep FAQ Analysis\n');
    console.log('=' .repeat(60));

    const browser = await chromium.launch({
        headless: false,
        slowMo: 500,
        devtools: true  // Open DevTools for deeper inspection
    });

    const page = await browser.newPage();
    await page.setViewportSize({ width: 1280, height: 1024 });

    // Enable console logging
    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log('❌ CONSOLE ERROR:', msg.text());
        }
    });

    page.on('pageerror', error => {
        console.log('❌ PAGE ERROR:', error.message);
    });

    console.log('📍 Loading courses page: http://localhost:3005/he/courses.html\n');
    await page.goto('http://localhost:3005/he/courses.html', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);

    // 1. CHECK IF FAQ SECTION EXISTS
    console.log('1️⃣ CHECKING FAQ SECTION EXISTENCE:');
    const faqExists = await page.locator('section.faq').count();
    console.log(`   FAQ section exists: ${faqExists > 0 ? '✅ YES' : '❌ NO'}`);

    if (faqExists === 0) {
        console.log('   ⚠️ CRITICAL: FAQ section not found in HTML!');
        return;
    }

    // 2. CHECK VISIBILITY
    console.log('\n2️⃣ CHECKING VISIBILITY:');
    const faqSection = page.locator('section.faq');
    const isVisible = await faqSection.isVisible();
    console.log(`   FAQ section visible: ${isVisible ? '✅ YES' : '❌ NO'}`);

    // 3. CHECK COMPUTED STYLES
    console.log('\n3️⃣ CHECKING COMPUTED STYLES:');
    const computedStyles = await faqSection.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return {
            display: styles.display,
            visibility: styles.visibility,
            opacity: styles.opacity,
            height: styles.height,
            overflow: styles.overflow,
            position: styles.position,
            zIndex: styles.zIndex
        };
    });
    console.log('   Computed styles:', JSON.stringify(computedStyles, null, 2));

    // 4. CHECK CHILD ELEMENTS OPACITY
    console.log('\n4️⃣ CHECKING CHILD ELEMENTS OPACITY:');

    const titleWrapper = page.locator('section.faq .faq-section-title-wrapper');
    const titleWrapperStyle = await titleWrapper.getAttribute('style');
    const titleWrapperComputed = await titleWrapper.evaluate(el => window.getComputedStyle(el).opacity);
    console.log(`   Title wrapper inline style: "${titleWrapperStyle}"`);
    console.log(`   Title wrapper computed opacity: ${titleWrapperComputed}`);

    const contentWrapper = page.locator('section.faq .faq-content');
    const contentWrapperStyle = await contentWrapper.getAttribute('style');
    const contentWrapperComputed = await contentWrapper.evaluate(el => window.getComputedStyle(el).opacity);
    console.log(`   Content wrapper inline style: "${contentWrapperStyle}"`);
    console.log(`   Content wrapper computed opacity: ${contentWrapperComputed}`);

    // 5. CHECK WEBFLOW ANIMATIONS
    console.log('\n5️⃣ CHECKING WEBFLOW ANIMATIONS:');
    const hasWebflowJS = await page.evaluate(() => {
        return typeof Webflow !== 'undefined';
    });
    console.log(`   Webflow JS loaded: ${hasWebflowJS ? '✅ YES' : '❌ NO'}`);

    if (hasWebflowJS) {
        const webflowReady = await page.evaluate(() => {
            return Webflow && Webflow.ready;
        });
        console.log(`   Webflow ready: ${webflowReady ? '✅ YES' : '❌ NO'}`);
    }

    // 6. SCROLL TO FAQ SECTION
    console.log('\n6️⃣ SCROLLING TO FAQ SECTION:');
    await faqSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);

    // Re-check opacity after scroll (Webflow might trigger on scroll)
    const titleOpacityAfterScroll = await titleWrapper.evaluate(el => window.getComputedStyle(el).opacity);
    const contentOpacityAfterScroll = await contentWrapper.evaluate(el => window.getComputedStyle(el).opacity);
    console.log(`   Title opacity after scroll: ${titleOpacityAfterScroll}`);
    console.log(`   Content opacity after scroll: ${contentOpacityAfterScroll}`);

    // 7. CHECK FAQ CONTENT
    console.log('\n7️⃣ CHECKING FAQ CONTENT:');
    const faqTitle = await page.locator('section.faq h2.section-title').textContent().catch(() => 'Not found');
    console.log(`   FAQ title text: "${faqTitle}"`);

    const tabCount = await page.locator('section.faq .w-tab-link').count();
    console.log(`   FAQ tabs count: ${tabCount}`);

    const firstQuestion = await page.locator('section.faq .faq-question').first().textContent().catch(() => 'Not found');
    console.log(`   First question: "${firstQuestion?.substring(0, 50)}..."`);

    // 8. FORCE VISIBILITY TEST
    console.log('\n8️⃣ FORCE VISIBILITY TEST:');
    console.log('   Attempting to force opacity: 1 via JavaScript...');

    await page.evaluate(() => {
        const titleWrapper = document.querySelector('section.faq .faq-section-title-wrapper');
        const contentWrapper = document.querySelector('section.faq .faq-content');

        if (titleWrapper) {
            titleWrapper.style.opacity = '1';
            titleWrapper.style.visibility = 'visible';
        }
        if (contentWrapper) {
            contentWrapper.style.opacity = '1';
            contentWrapper.style.visibility = 'visible';
        }
    });

    await page.waitForTimeout(1000);

    const visibleAfterForce = await faqSection.isVisible();
    console.log(`   FAQ visible after forcing opacity: ${visibleAfterForce ? '✅ YES' : '❌ NO'}`);

    // 9. CHECK FOR BLOCKING ELEMENTS
    console.log('\n9️⃣ CHECKING FOR BLOCKING ELEMENTS:');
    const blockingElements = await page.evaluate(() => {
        const faq = document.querySelector('section.faq');
        if (!faq) return 'FAQ not found';

        const rect = faq.getBoundingClientRect();
        const elementAtPoint = document.elementFromPoint(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2
        );

        if (elementAtPoint && !faq.contains(elementAtPoint)) {
            return {
                blocking: true,
                element: elementAtPoint.tagName,
                class: elementAtPoint.className
            };
        }
        return { blocking: false };
    });
    console.log('   Blocking elements:', JSON.stringify(blockingElements, null, 2));

    // 10. TAKE DIAGNOSTIC SCREENSHOTS
    console.log('\n🔟 TAKING DIAGNOSTIC SCREENSHOTS:');

    // Full page screenshot
    await page.screenshot({
        path: 'ultrathink-full-page.png',
        fullPage: true
    });
    console.log('   ✅ Full page: ultrathink-full-page.png');

    // FAQ section screenshot (if possible)
    try {
        const faqBbox = await faqSection.boundingBox();
        if (faqBbox) {
            await page.screenshot({
                path: 'ultrathink-faq-section.png',
                clip: faqBbox
            });
            console.log('   ✅ FAQ section: ultrathink-faq-section.png');
        }
    } catch (e) {
        console.log('   ❌ Could not capture FAQ section:', e.message);
    }

    // FINAL DIAGNOSIS
    console.log('\n' + '=' .repeat(60));
    console.log('🧠 ULTRATHINK DIAGNOSIS COMPLETE!');
    console.log('=' .repeat(60));

    if (!isVisible && titleOpacityAfterScroll === '0') {
        console.log('\n⚠️ PROBLEM IDENTIFIED: FAQ has opacity:0 and Webflow animations are not triggering.');
        console.log('💡 SOLUTION: Need to check Webflow JS integration or manually trigger animations.');
    } else if (!isVisible && computedStyles.display === 'none') {
        console.log('\n⚠️ PROBLEM IDENTIFIED: FAQ section has display:none.');
        console.log('💡 SOLUTION: Check CSS for conflicting styles.');
    } else if (!isVisible) {
        console.log('\n⚠️ PROBLEM IDENTIFIED: FAQ is hidden for unknown reason.');
        console.log('💡 SOLUTION: Check console errors and CSS conflicts.');
    } else {
        console.log('\n✅ FAQ appears to be visible. Check screenshots for visual confirmation.');
    }

    console.log('\n📊 Browser DevTools is open for manual inspection.');
    console.log('Press Ctrl+C to close when done.\n');

    // Keep browser open
    await new Promise(() => {});
}

ultrathinkDiagnostic().catch(console.error);