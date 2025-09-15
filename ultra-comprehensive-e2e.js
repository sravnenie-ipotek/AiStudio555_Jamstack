const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'http://localhost:3005';
const PRODUCTION_URL = 'https://www.aistudio555.com';
const USE_PRODUCTION = process.env.USE_PROD === 'true';
const CURRENT_URL = USE_PRODUCTION ? PRODUCTION_URL : BASE_URL;

// Test Pages Configuration (Focused set for faster execution)
const TEST_PAGES = process.env.FULL_TEST === 'true' ? {
    // Main pages
    'home': '/home.html',
    'courses': '/courses.html',
    'teachers': '/teachers.html',
    'career-center': '/career-center.html',
    'career-orientation': '/career-orientation.html',
    'blog': '/blog.html',

    // Language versions - English
    'courses-en': '/dist/en/courses.html',
    'career-center-en': '/dist/en/career-center.html',

    // Language versions - Russian
    'home-ru': '/dist/ru/home.html',
    'courses-ru': '/dist/ru/courses.html',

    // Language versions - Hebrew
    'home-he': '/dist/he/home.html',
    'courses-he': '/dist/he/courses.html'
} : {
    // Quick test set - even smaller for responsive testing
    'home': '/home.html',
    'courses': '/courses.html'
};

// Language Detection Patterns
const LANGUAGE_PATTERNS = {
    en: /[a-zA-Z]/,
    ru: /[\u0400-\u04FF]/,
    he: /[\u0590-\u05FF]/
};

// Test Result Storage
let testResults = {
    summary: {
        total: 0,
        passed: 0,
        failed: 0,
        warnings: 0,
        skipped: 0,
        timestamp: new Date().toISOString(),
        duration: 0
    },
    pages: {},
    globalTests: {}
};

// Utility Functions
function getLanguageFromPath(path) {
    if (path.includes('/en/')) return 'en';
    if (path.includes('/ru/')) return 'ru';
    if (path.includes('/he/')) return 'he';
    return 'default';
}

function detectLanguage(text) {
    if (LANGUAGE_PATTERNS.he.test(text)) return 'he';
    if (LANGUAGE_PATTERNS.ru.test(text)) return 'ru';
    if (LANGUAGE_PATTERNS.en.test(text)) return 'en';
    return 'unknown';
}

function createTestResult(status, message, details = null) {
    return {
        status,
        message,
        details,
        timestamp: new Date().toISOString()
    };
}

// Enhanced Test Functions
async function testDropdownMenus(page, pageUrl) {
    const results = {};

    try {
        // Find all Webflow dropdown triggers (updated selectors)
        const dropdownTriggers = await page.locator('.w-dropdown-toggle, .dropdown-toggle, .menu-dropdown-wrapper .w-dropdown-toggle').all();

        if (dropdownTriggers.length === 0) {
            return createTestResult('warning', 'No dropdown triggers found', { count: 0 });
        }

        for (let i = 0; i < dropdownTriggers.length; i++) {
            const trigger = dropdownTriggers[i];
            const triggerText = await trigger.textContent();

            try {
                // Hover over dropdown trigger
                await trigger.hover();
                await page.waitForTimeout(1000); // Increased wait time

                // Check multiple possible dropdown list selectors
                const dropdownSelectors = [
                    '.w-dropdown-list',
                    '.dropdown-column-wrapper-3',
                    '.dropdown-list',
                    '.nav-dropdown-list'
                ];

                let dropdownFound = false;
                let dropdownItems = [];

                for (const selector of dropdownSelectors) {
                    const dropdownList = page.locator(selector).first();
                    const isVisible = await dropdownList.isVisible();

                    if (isVisible) {
                        dropdownFound = true;

                        // Get dropdown items
                        const items = await dropdownList.locator('a, .dropdown-menu-text-link-block').all();

                        for (const item of items) {
                            const text = await item.textContent();
                            const href = await item.getAttribute('href');
                            if (text && text.trim()) {
                                dropdownItems.push({ text: text.trim(), href });
                            }
                        }
                        break;
                    }
                }

                if (dropdownFound) {
                    results[`dropdown_${i + 1}`] = createTestResult('pass',
                        `Dropdown "${triggerText?.trim()}" opens correctly`,
                        { items: dropdownItems, count: dropdownItems.length }
                    );
                } else {
                    // Try clicking instead of hovering
                    await trigger.click();
                    await page.waitForTimeout(500);

                    let clickDropdownFound = false;
                    for (const selector of dropdownSelectors) {
                        const dropdownList = page.locator(selector).first();
                        const isVisible = await dropdownList.isVisible();
                        if (isVisible) {
                            clickDropdownFound = true;
                            break;
                        }
                    }

                    if (clickDropdownFound) {
                        results[`dropdown_${i + 1}`] = createTestResult('pass',
                            `Dropdown "${triggerText?.trim()}" opens on click`,
                            { openMethod: 'click' }
                        );
                    } else {
                        results[`dropdown_${i + 1}`] = createTestResult('fail',
                            `Dropdown "${triggerText?.trim()}" does not open on hover or click`
                        );
                    }
                }

                // Move mouse away to close dropdown
                await page.mouse.move(10, 10);
                await page.waitForTimeout(300);

            } catch (error) {
                results[`dropdown_${i + 1}`] = createTestResult('fail',
                    `Error testing dropdown "${triggerText?.trim()}": ${error.message}`
                );
            }
        }

        const passedCount = Object.values(results).filter(r => r.status === 'pass').length;
        const status = passedCount > 0 ? 'pass' : 'fail';

        return createTestResult(status, `Tested ${dropdownTriggers.length} dropdowns (${passedCount} working)`, results);

    } catch (error) {
        return createTestResult('fail', `Dropdown test failed: ${error.message}`);
    }
}

async function testNavigationConsistency(page, pageUrl) {
    try {
        // Get all navigation elements
        const navElements = await page.evaluate(() => {
            const navLinks = Array.from(document.querySelectorAll('nav a, .nav a, .navbar a, .navigation a'));
            const dropdownLinks = Array.from(document.querySelectorAll('.dropdown-list a, .nav-dropdown-list a'));

            return {
                mainNav: navLinks.map(link => ({
                    text: link.textContent?.trim(),
                    href: link.href,
                    classes: link.className
                })),
                dropdownNav: dropdownLinks.map(link => ({
                    text: link.textContent?.trim(),
                    href: link.href,
                    classes: link.className
                }))
            };
        });

        const expectedLanguage = getLanguageFromPath(pageUrl);
        let languageConsistency = true;
        const inconsistentItems = [];

        // Check language consistency
        [...navElements.mainNav, ...navElements.dropdownNav].forEach((item, index) => {
            if (item.text) {
                const detectedLang = detectLanguage(item.text);
                if (expectedLanguage !== 'default' && detectedLang !== expectedLanguage && detectedLang !== 'unknown') {
                    languageConsistency = false;
                    inconsistentItems.push({
                        text: item.text,
                        expected: expectedLanguage,
                        detected: detectedLang
                    });
                }
            }
        });

        return createTestResult(
            languageConsistency ? 'pass' : 'fail',
            languageConsistency
                ? `Navigation language consistent (${expectedLanguage})`
                : `Navigation language inconsistencies found`,
            {
                mainNavCount: navElements.mainNav.length,
                dropdownNavCount: navElements.dropdownNav.length,
                expectedLanguage,
                inconsistencies: inconsistentItems
            }
        );

    } catch (error) {
        return createTestResult('fail', `Navigation consistency test failed: ${error.message}`);
    }
}

async function testFooterPresence(page) {
    try {
        const footerElements = await page.locator('footer, .footer, [class*="footer"]').all();

        if (footerElements.length === 0) {
            return createTestResult('fail', 'No footer found on page');
        }

        // Check if footer is visible and has content
        const footerVisible = await footerElements[0].isVisible();
        const footerContent = await footerElements[0].textContent();
        const hasContent = footerContent && footerContent.trim().length > 10;

        if (!footerVisible) {
            return createTestResult('fail', 'Footer exists but is not visible');
        }

        if (!hasContent) {
            return createTestResult('warning', 'Footer exists but appears to have minimal content');
        }

        // Check for common footer elements
        const footerLinks = await footerElements[0].locator('a').count();
        const socialLinks = await footerElements[0].locator('[href*="facebook"], [href*="twitter"], [href*="linkedin"], [href*="instagram"]').count();

        return createTestResult('pass', 'Footer found and validated', {
            visible: footerVisible,
            contentLength: footerContent?.length,
            linkCount: footerLinks,
            socialLinkCount: socialLinks
        });

    } catch (error) {
        return createTestResult('fail', `Footer test failed: ${error.message}`);
    }
}

async function testLanguageSwitching(page, pageUrl) {
    try {
        // Find language switcher elements - updated selectors for actual implementation
        const languageSelectors = await page.locator('#language-switcher-nav, .language-nav-select, select[onchange*="switchLanguage"]').all();
        const languageButtons = await page.locator('[data-language], .language-switcher button, .lang-switch, [class*="lang-btn"]').all();

        const allSwitchers = [...languageSelectors, ...languageButtons];

        if (allSwitchers.length === 0) {
            return createTestResult('skip', 'No language switcher found');
        }

        const results = {};
        let testedCount = 0;

        // Test select dropdowns
        for (let i = 0; i < languageSelectors.length; i++) {
            const selector = languageSelectors[i];
            testedCount++;

            try {
                // Get all options
                const options = await selector.locator('option').all();
                const optionValues = [];

                for (const option of options) {
                    const value = await option.getAttribute('value');
                    const text = await option.textContent();
                    optionValues.push({ value, text: text?.trim() });
                }

                // Test switching to Russian if available
                const russianOption = options.find(async (opt) => {
                    const value = await opt.getAttribute('value');
                    return value === 'ru';
                });

                if (russianOption) {
                    await selector.selectOption('ru');
                    await page.waitForTimeout(2000);

                    const newUrl = page.url();
                    const urlChanged = newUrl !== pageUrl;

                    results[`select_${i + 1}`] = createTestResult('pass',
                        `Language selector tested (${optionValues.length} languages)`,
                        {
                            urlChanged,
                            newUrl,
                            currentValue: 'ru',
                            availableLanguages: optionValues
                        }
                    );
                } else {
                    results[`select_${i + 1}`] = createTestResult('pass',
                        `Language selector found but no Russian option`,
                        { availableLanguages: optionValues }
                    );
                }

            } catch (error) {
                results[`select_${i + 1}`] = createTestResult('fail',
                    `Language selector test failed: ${error.message}`
                );
            }
        }

        // Test language buttons
        for (let i = 0; i < languageButtons.length; i++) {
            const button = languageButtons[i];
            const buttonText = await button.textContent();
            testedCount++;

            try {
                await button.click();
                await page.waitForTimeout(1000);

                const newUrl = page.url();
                const urlChanged = newUrl !== pageUrl;

                results[`button_${i + 1}`] = createTestResult('pass',
                    `Language button "${buttonText?.trim()}" clicked`,
                    { urlChanged, newUrl }
                );

            } catch (error) {
                results[`button_${i + 1}`] = createTestResult('fail',
                    `Language button "${buttonText?.trim()}" failed: ${error.message}`
                );
            }
        }

        const status = testedCount > 0 ? 'pass' : 'skip';
        const message = testedCount > 0
            ? `Tested ${testedCount} language switchers`
            : 'No language switchers found';

        return createTestResult(status, message, results);

    } catch (error) {
        return createTestResult('fail', `Language switching test failed: ${error.message}`);
    }
}

async function testLanguageMixing(page, pageUrl) {
    try {
        const expectedLanguage = getLanguageFromPath(pageUrl);

        if (expectedLanguage === 'default') {
            return createTestResult('skip', 'Not a localized page');
        }

        // Get all text content
        const textElements = await page.evaluate(() => {
            const elements = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, a, button'));
            return elements.map(el => ({
                text: el.textContent?.trim(),
                tagName: el.tagName.toLowerCase(),
                className: el.className
            })).filter(item => item.text && item.text.length > 3);
        });

        const mixingIssues = [];
        const technicalTerms = ['AI', 'ML', 'API', 'URL', 'HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Studio', 'Email'];

        textElements.forEach((element, index) => {
            const detectedLang = detectLanguage(element.text);
            const isTechnicalTerm = technicalTerms.some(term => element.text.includes(term));

            if (detectedLang !== expectedLanguage && detectedLang !== 'unknown' && !isTechnicalTerm) {
                mixingIssues.push({
                    text: element.text.substring(0, 50) + (element.text.length > 50 ? '...' : ''),
                    expected: expectedLanguage,
                    detected: detectedLang,
                    element: element.tagName
                });
            }
        });

        const hasIssues = mixingIssues.length > 0;
        const severity = mixingIssues.length > 5 ? 'fail' : 'warning';

        return createTestResult(
            hasIssues ? severity : 'pass',
            hasIssues
                ? `Language mixing detected (${mixingIssues.length} issues)`
                : `No language mixing detected for ${expectedLanguage}`,
            {
                expectedLanguage,
                issuesFound: mixingIssues.length,
                issues: mixingIssues.slice(0, 10), // Limit to first 10 issues
                totalTextElements: textElements.length
            }
        );

    } catch (error) {
        return createTestResult('fail', `Language mixing test failed: ${error.message}`);
    }
}

async function testEmailSending(page) {
    try {
        // Look for contact forms and "Sign Up Today" buttons
        const contactForms = await page.locator('form, .contact-form, .modal-form').all();
        const signUpButtons = await page.locator('button, .btn, a').filter({ hasText: /sign up|contact|get started/i }).all();

        const results = {};
        let testedForms = 0;

        // Test contact forms
        for (let i = 0; i < contactForms.length && i < 3; i++) {  // Limit to 3 forms
            const form = contactForms[i];

            try {
                // Check if form is visible
                const isVisible = await form.isVisible();
                if (!isVisible) continue;

                // Look for email/name inputs
                const emailInput = form.locator('input[type="email"], input[name*="email"], input[placeholder*="email" i]');
                const nameInput = form.locator('input[name*="name"], input[placeholder*="name" i]');
                const submitButton = form.locator('button[type="submit"], input[type="submit"], .submit-btn');

                const hasEmailInput = await emailInput.count() > 0;
                const hasNameInput = await nameInput.count() > 0;
                const hasSubmitButton = await submitButton.count() > 0;

                if (hasEmailInput && hasSubmitButton) {
                    // Fill form with test data
                    await emailInput.first().fill('test@aistudio555.com');
                    if (hasNameInput) {
                        await nameInput.first().fill('Test User');
                    }

                    // Check if EmailJS is loaded
                    const emailJSLoaded = await page.evaluate(() => {
                        return typeof window.emailjs !== 'undefined';
                    });

                    results[`form_${i + 1}`] = createTestResult('pass',
                        `Contact form ${i + 1} structure valid`,
                        {
                            hasEmailInput,
                            hasNameInput,
                            hasSubmitButton,
                            emailJSLoaded
                        }
                    );
                    testedForms++;
                } else {
                    results[`form_${i + 1}`] = createTestResult('warning',
                        `Form ${i + 1} missing required elements`
                    );
                }

            } catch (error) {
                results[`form_${i + 1}`] = createTestResult('fail',
                    `Form ${i + 1} test error: ${error.message}`
                );
            }
        }

        // Test "Sign Up Today" modal functionality
        let modalTested = false;
        for (let i = 0; i < signUpButtons.length && i < 3; i++) {
            const button = signUpButtons[i];
            const buttonText = await button.textContent();

            if (buttonText && buttonText.toLowerCase().includes('sign up')) {
                try {
                    await button.click();
                    await page.waitForTimeout(1000);

                    // Check if modal appeared
                    const modal = page.locator('.modal, .popup, .contact-modal').first();
                    const modalVisible = await modal.isVisible();

                    if (modalVisible) {
                        results.signUpModal = createTestResult('pass',
                            'Sign Up modal opens correctly',
                            { buttonText: buttonText.trim() }
                        );
                        modalTested = true;

                        // Close modal
                        const closeBtn = modal.locator('.close, .modal-close, [data-dismiss]').first();
                        if (await closeBtn.isVisible()) {
                            await closeBtn.click();
                        }
                        break;
                    }
                } catch (error) {
                    results.signUpModal = createTestResult('warning',
                        `Sign Up button test error: ${error.message}`
                    );
                }
            }
        }

        if (!modalTested && signUpButtons.length > 0) {
            results.signUpModal = createTestResult('warning',
                'Sign Up buttons found but modal not tested'
            );
        }

        const status = testedForms > 0 || modalTested ? 'pass' : 'skip';
        const message = testedForms > 0
            ? `Email functionality tested (${testedForms} forms)`
            : 'No testable email forms found';

        return createTestResult(status, message, results);

    } catch (error) {
        return createTestResult('fail', `Email sending test failed: ${error.message}`);
    }
}

async function testResponsiveDesign(page, pageUrl) {
    try {
        const results = {};

        // Comprehensive viewport testing
        const viewports = [
            { width: 320, height: 568, name: 'mobile-small', device: 'iPhone SE' },
            { width: 375, height: 667, name: 'mobile-medium', device: 'iPhone 8' },
            { width: 414, height: 896, name: 'mobile-large', device: 'iPhone 11 Pro Max' },
            { width: 768, height: 1024, name: 'tablet-portrait', device: 'iPad' },
            { width: 1024, height: 768, name: 'tablet-landscape', device: 'iPad Landscape' },
            { width: 1200, height: 800, name: 'desktop-small', device: 'Small Desktop' },
            { width: 1440, height: 900, name: 'desktop-medium', device: 'Medium Desktop' },
            { width: 1920, height: 1080, name: 'desktop-large', device: 'Large Desktop' }
        ];

        for (const viewport of viewports) {
            try {
                await page.setViewportSize(viewport);
                await page.waitForTimeout(1000); // Allow layout to settle

                // Test 1: Layout integrity
                const layoutTest = await page.evaluate(() => {
                    const body = document.body;
                    const hasHorizontalScroll = body.scrollWidth > window.innerWidth;
                    const hasVerticalOverflow = body.scrollHeight > window.innerHeight * 3; // Reasonable limit

                    // Check if content fits
                    const contentWidth = Math.max(
                        document.documentElement.scrollWidth,
                        document.documentElement.offsetWidth,
                        document.documentElement.clientWidth
                    );

                    return {
                        hasHorizontalScroll,
                        hasVerticalOverflow,
                        contentWidth,
                        viewportWidth: window.innerWidth,
                        aspectRatio: window.innerWidth / window.innerHeight,
                        devicePixelRatio: window.devicePixelRatio || 1
                    };
                });

                // Test 2: Navigation responsiveness
                const navTest = await page.evaluate(() => {
                    const navElements = document.querySelectorAll('nav, .navbar, .navigation');
                    const hamburgerMenus = document.querySelectorAll('.hamburger, .menu-toggle, .nav-toggle, [data-toggle="nav"]');
                    const dropdowns = document.querySelectorAll('.dropdown, .nav-dropdown');

                    // Check if navigation is collapsed on mobile
                    const navCollapsed = Array.from(navElements).some(nav => {
                        const style = getComputedStyle(nav);
                        return style.display === 'none' || style.visibility === 'hidden';
                    });

                    return {
                        navElementCount: navElements.length,
                        hamburgerMenuCount: hamburgerMenus.length,
                        dropdownCount: dropdowns.length,
                        navCollapsed,
                        hasMobileNav: hamburgerMenus.length > 0
                    };
                });

                // Test 3: Touch target sizes (mobile only)
                let touchTargetTest = { status: 'skip', note: 'Not mobile viewport' };
                if (viewport.width <= 768) {
                    touchTargetTest = await page.evaluate(() => {
                        const interactiveElements = document.querySelectorAll('button, a, input, select, [onclick], [role="button"]');
                        const minTouchSize = 44; // Apple/Android guideline
                        const smallTargets = [];

                        interactiveElements.forEach((element, index) => {
                            const rect = element.getBoundingClientRect();
                            if (rect.width > 0 && rect.height > 0) {
                                if (rect.width < minTouchSize || rect.height < minTouchSize) {
                                    smallTargets.push({
                                        element: element.tagName.toLowerCase(),
                                        size: `${Math.round(rect.width)}x${Math.round(rect.height)}`,
                                        text: element.textContent?.trim().substring(0, 30) || 'No text'
                                    });
                                }
                            }
                        });

                        return {
                            totalInteractiveElements: interactiveElements.length,
                            smallTargets: smallTargets.slice(0, 10), // Limit results
                            smallTargetCount: smallTargets.length,
                            status: smallTargets.length === 0 ? 'pass' : 'warning'
                        };
                    });
                }

                // Test 4: Text readability
                const textTest = await page.evaluate(() => {
                    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div');
                    const minFontSize = 16; // Accessibility guideline for mobile
                    const tinyText = [];

                    textElements.forEach(element => {
                        if (element.textContent && element.textContent.trim().length > 10) {
                            const style = getComputedStyle(element);
                            const fontSize = parseFloat(style.fontSize);
                            if (fontSize < minFontSize && style.display !== 'none') {
                                tinyText.push({
                                    fontSize: Math.round(fontSize),
                                    text: element.textContent.trim().substring(0, 50)
                                });
                            }
                        }
                    });

                    return {
                        tinyTextCount: tinyText.length,
                        tinyText: tinyText.slice(0, 5),
                        status: tinyText.length > 10 ? 'warning' : 'pass'
                    };
                });

                // Test 5: Image scaling
                const imageTest = await page.evaluate(() => {
                    const images = document.querySelectorAll('img');
                    const oversizedImages = [];
                    const aspectRatioIssues = [];

                    images.forEach(img => {
                        const rect = img.getBoundingClientRect();
                        if (rect.width > 0 && rect.height > 0) {
                            // Check if image overflows container
                            if (rect.width > window.innerWidth) {
                                oversizedImages.push({
                                    src: img.src.split('/').pop(),
                                    size: `${Math.round(rect.width)}x${Math.round(rect.height)}`,
                                    naturalSize: `${img.naturalWidth}x${img.naturalHeight}`
                                });
                            }

                            // Check aspect ratio preservation
                            if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                                const originalRatio = img.naturalWidth / img.naturalHeight;
                                const displayRatio = rect.width / rect.height;
                                const ratioDiff = Math.abs(originalRatio - displayRatio) / originalRatio;

                                if (ratioDiff > 0.1) { // 10% tolerance
                                    aspectRatioIssues.push({
                                        src: img.src.split('/').pop(),
                                        originalRatio: Math.round(originalRatio * 100) / 100,
                                        displayRatio: Math.round(displayRatio * 100) / 100
                                    });
                                }
                            }
                        }
                    });

                    return {
                        totalImages: images.length,
                        oversizedCount: oversizedImages.length,
                        oversizedImages: oversizedImages.slice(0, 3),
                        aspectRatioIssues: aspectRatioIssues.slice(0, 3),
                        status: oversizedImages.length > 0 ? 'warning' : 'pass'
                    };
                });

                // Test 6: Language-specific responsive issues
                const languageTest = await page.evaluate((url) => {
                    const isRTL = document.dir === 'rtl' || document.documentElement.dir === 'rtl' ||
                                 getComputedStyle(document.body).direction === 'rtl';
                    const isHebrewPage = url.includes('/he/');

                    // Check for text overflow in different languages
                    const longTextElements = Array.from(document.querySelectorAll('button, .btn, nav a')).filter(el => {
                        return el.textContent && el.textContent.trim().length > 15;
                    });

                    const overflowingText = longTextElements.filter(el => {
                        const rect = el.getBoundingClientRect();
                        return rect.width > 0 && el.scrollWidth > rect.width + 2; // 2px tolerance
                    }).map(el => ({
                        text: el.textContent.trim().substring(0, 30),
                        element: el.tagName.toLowerCase()
                    }));

                    return {
                        isRTL,
                        isHebrewPage,
                        rtlCorrect: !isHebrewPage || isRTL,
                        longTextElements: longTextElements.length,
                        overflowingText: overflowingText.slice(0, 3),
                        status: (!isHebrewPage || isRTL) && overflowingText.length === 0 ? 'pass' : 'warning'
                    };
                }, pageUrl);

                // Compile viewport results
                const viewportResult = {
                    viewport,
                    layout: layoutTest,
                    navigation: navTest,
                    touchTargets: touchTargetTest,
                    text: textTest,
                    images: imageTest,
                    language: languageTest
                };

                // Determine overall status for this viewport
                const hasLayoutIssues = layoutTest.hasHorizontalScroll;
                const hasTouchIssues = touchTargetTest.status === 'warning';
                const hasTextIssues = textTest.status === 'warning';
                const hasImageIssues = imageTest.status === 'warning';
                const hasLanguageIssues = languageTest.status === 'warning';

                const issueCount = [hasLayoutIssues, hasTouchIssues, hasTextIssues, hasImageIssues, hasLanguageIssues].filter(Boolean).length;
                const viewportStatus = issueCount === 0 ? 'pass' : issueCount >= 3 ? 'fail' : 'warning';

                results[viewport.name] = createTestResult(viewportStatus,
                    `${viewport.device} (${viewport.width}x${viewport.height})`,
                    viewportResult
                );

            } catch (error) {
                results[viewport.name] = createTestResult('fail',
                    `Responsive test failed for ${viewport.device}: ${error.message}`
                );
            }
        }

        // Overall responsive assessment
        const passedViewports = Object.values(results).filter(r => r.status === 'pass').length;
        const totalViewports = Object.keys(results).length;
        const overallStatus = passedViewports >= totalViewports * 0.75 ? 'pass' :
                            passedViewports >= totalViewports * 0.5 ? 'warning' : 'fail';

        return createTestResult(overallStatus,
            `Responsive design tested across ${totalViewports} viewports (${passedViewports} passed)`,
            results
        );

    } catch (error) {
        return createTestResult('fail', `Responsive design test failed: ${error.message}`);
    }
}

async function testMobileInteractions(page) {
    try {
        // Set mobile viewport for testing
        await page.setViewportSize({ width: 375, height: 667 });
        await page.waitForTimeout(1000);

        const results = {};

        // Test 1: Hamburger menu functionality
        try {
            const hamburgerMenus = await page.locator('.hamburger, .menu-toggle, .nav-toggle, [data-toggle="nav"], .mobile-menu-toggle').all();

            if (hamburgerMenus.length > 0) {
                const hamburger = hamburgerMenus[0];

                // Check if hamburger is visible on mobile
                const isVisible = await hamburger.isVisible();

                if (isVisible) {
                    // Try to click hamburger menu
                    await hamburger.click();
                    await page.waitForTimeout(500);

                    // Check if mobile menu appeared
                    const mobileMenu = page.locator('.mobile-menu, .nav-mobile, .hamburger-menu, [data-menu="mobile"]').first();
                    const menuOpened = await mobileMenu.isVisible();

                    results.hamburgerMenu = createTestResult(
                        menuOpened ? 'pass' : 'fail',
                        menuOpened ? 'Hamburger menu opens mobile navigation' : 'Hamburger menu does not open navigation'
                    );

                    // Close menu if it opened
                    if (menuOpened) {
                        await hamburger.click();
                        await page.waitForTimeout(300);
                    }
                } else {
                    results.hamburgerMenu = createTestResult('warning', 'Hamburger menu not visible on mobile');
                }
            } else {
                results.hamburgerMenu = createTestResult('skip', 'No hamburger menu found');
            }
        } catch (error) {
            results.hamburgerMenu = createTestResult('fail', `Hamburger menu test failed: ${error.message}`);
        }

        // Test 2: Mobile dropdown behavior
        try {
            const mobileDropdowns = await page.locator('.w-dropdown-toggle, .dropdown-toggle').all();
            let mobileDropdownCount = 0;

            for (let i = 0; i < Math.min(mobileDropdowns.length, 3); i++) {
                const dropdown = mobileDropdowns[i];
                const isVisible = await dropdown.isVisible();

                if (isVisible) {
                    mobileDropdownCount++;

                    // Test touch interaction
                    await dropdown.tap();
                    await page.waitForTimeout(500);

                    const dropdownList = page.locator('.w-dropdown-list, .dropdown-list').first();
                    const dropdownOpened = await dropdownList.isVisible();

                    results[`mobileDropdown_${i + 1}`] = createTestResult(
                        dropdownOpened ? 'pass' : 'warning',
                        dropdownOpened ? 'Mobile dropdown responds to tap' : 'Mobile dropdown may not respond to tap'
                    );

                    // Close dropdown
                    if (dropdownOpened) {
                        await page.mouse.click(10, 10);
                        await page.waitForTimeout(300);
                    }
                }
            }

            if (mobileDropdownCount === 0) {
                results.mobileDropdowns = createTestResult('skip', 'No mobile dropdowns found');
            }
        } catch (error) {
            results.mobileDropdowns = createTestResult('fail', `Mobile dropdown test failed: ${error.message}`);
        }

        // Test 3: Mobile form usability
        try {
            const formInputs = await page.locator('input[type="email"], input[type="text"], input[type="tel"], textarea').all();

            if (formInputs.length > 0) {
                const input = formInputs[0];
                const isVisible = await input.isVisible();

                if (isVisible) {
                    // Check if input is properly sized for mobile
                    const inputBox = await input.boundingBox();

                    if (inputBox) {
                        const isTouchFriendly = inputBox.height >= 44; // Apple/Android guideline
                        const hasProperSpacing = inputBox.width > 200; // Reasonable minimum

                        // Test focus behavior
                        await input.focus();
                        await page.waitForTimeout(300);

                        const isFocused = await page.evaluate((selector) => {
                            const el = document.querySelector(selector);
                            return document.activeElement === el;
                        }, await input.evaluate(el => el.tagName.toLowerCase()));

                        results.mobileForm = createTestResult(
                            isTouchFriendly && hasProperSpacing && isFocused ? 'pass' : 'warning',
                            `Mobile form usability: ${isTouchFriendly ? 'touch-friendly' : 'too small'}, ${hasProperSpacing ? 'adequate width' : 'too narrow'}, ${isFocused ? 'focusable' : 'focus issues'}`,
                            {
                                touchFriendly: isTouchFriendly,
                                properSpacing: hasProperSpacing,
                                focusable: isFocused,
                                inputSize: inputBox
                            }
                        );
                    } else {
                        results.mobileForm = createTestResult('warning', 'Could not measure form input size');
                    }
                } else {
                    results.mobileForm = createTestResult('skip', 'No visible form inputs on mobile');
                }
            } else {
                results.mobileForm = createTestResult('skip', 'No form inputs found');
            }
        } catch (error) {
            results.mobileForm = createTestResult('fail', `Mobile form test failed: ${error.message}`);
        }

        // Test 4: Mobile language switcher
        try {
            const languageSelectors = await page.locator('#language-switcher-nav, .language-nav-select').all();

            if (languageSelectors.length > 0) {
                const selector = languageSelectors[0];
                const isVisible = await selector.isVisible();
                const isUsable = await selector.isEnabled();

                if (isVisible && isUsable) {
                    const selectorBox = await selector.boundingBox();
                    const isTouchFriendly = selectorBox && selectorBox.height >= 44;

                    results.mobileLanguageSwitcher = createTestResult(
                        isTouchFriendly ? 'pass' : 'warning',
                        `Mobile language switcher: ${isVisible ? 'visible' : 'hidden'}, ${isUsable ? 'usable' : 'disabled'}, ${isTouchFriendly ? 'touch-friendly' : 'too small'}`
                    );
                } else {
                    results.mobileLanguageSwitcher = createTestResult('warning', 'Language switcher not accessible on mobile');
                }
            } else {
                results.mobileLanguageSwitcher = createTestResult('skip', 'No language switcher found');
            }
        } catch (error) {
            results.mobileLanguageSwitcher = createTestResult('fail', `Mobile language switcher test failed: ${error.message}`);
        }

        // Overall mobile interaction assessment
        const passedTests = Object.values(results).filter(r => r.status === 'pass').length;
        const totalTests = Object.keys(results).length;
        const overallStatus = passedTests >= totalTests * 0.7 ? 'pass' :
                            passedTests >= totalTests * 0.4 ? 'warning' : 'fail';

        return createTestResult(overallStatus,
            `Mobile interactions tested: ${passedTests}/${totalTests} passed`,
            results
        );

    } catch (error) {
        return createTestResult('fail', `Mobile interactions test failed: ${error.message}`);
    }
}

async function testPagePerformance(page) {
    try {
        // Measure page load time
        const performanceData = await page.evaluate(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            return {
                loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                totalTime: perfData.loadEventEnd - perfData.fetchStart,
                resourceCount: performance.getEntriesByType('resource').length
            };
        });

        // Check for console errors
        const consoleErrors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
            }
        });

        // Check image loading
        const imageStats = await page.evaluate(() => {
            const images = Array.from(document.querySelectorAll('img'));
            const loaded = images.filter(img => img.complete && img.naturalWidth > 0);
            const broken = images.filter(img => !img.complete || img.naturalWidth === 0);

            return {
                total: images.length,
                loaded: loaded.length,
                broken: broken.length,
                brokenSrcs: broken.map(img => img.src).slice(0, 5)
            };
        });

        const status = performanceData.loadTime > 5000 || consoleErrors.length > 3 ? 'warning' : 'pass';

        return createTestResult(status, 'Performance metrics collected', {
            ...performanceData,
            consoleErrors: consoleErrors.slice(0, 5),
            imageStats
        });

    } catch (error) {
        return createTestResult('fail', `Performance test failed: ${error.message}`);
    }
}

// Main Testing Function
async function runUltraComprehensiveTest() {
    console.log('🚀 ULTRA COMPREHENSIVE E2E TEST STARTING...');
    console.log(`📍 Testing ${USE_PRODUCTION ? 'PRODUCTION' : 'LOCAL'}: ${CURRENT_URL}`);

    const startTime = Date.now();
    const browser = await chromium.launch({
        headless: process.env.HEADLESS !== 'false',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        for (const [pageName, pagePath] of Object.entries(TEST_PAGES)) {
            console.log(`\n🧪 Testing page: ${pageName}`);

            const context = await browser.newContext({
                viewport: { width: 1920, height: 1080 }
            });
            const page = await context.newPage();
            const fullUrl = `${CURRENT_URL}${pagePath}`;

            try {
                // Navigate to page
                const response = await page.goto(fullUrl, {
                    waitUntil: 'networkidle',
                    timeout: 30000
                });

                if (!response || response.status() >= 400) {
                    console.log(`   ❌ Page not accessible: ${response?.status()}`);
                    testResults.pages[pageName] = {
                        url: fullUrl,
                        accessible: false,
                        status: response?.status(),
                        tests: {}
                    };
                    continue;
                }

                console.log(`   ✅ Page loaded: ${response.status()}`);

                // Initialize page test results
                testResults.pages[pageName] = {
                    url: fullUrl,
                    accessible: true,
                    status: response.status(),
                    tests: {}
                };

                // Run all tests
                const tests = [
                    { name: 'dropdownMenus', fn: testDropdownMenus },
                    { name: 'navigationConsistency', fn: testNavigationConsistency },
                    { name: 'footerPresence', fn: testFooterPresence },
                    { name: 'languageSwitching', fn: testLanguageSwitching },
                    { name: 'languageMixing', fn: testLanguageMixing },
                    { name: 'emailSending', fn: testEmailSending },
                    { name: 'responsiveDesign', fn: testResponsiveDesign },
                    { name: 'mobileInteractions', fn: testMobileInteractions },
                    { name: 'performance', fn: testPagePerformance }
                ];

                for (const test of tests) {
                    try {
                        console.log(`      🔍 ${test.name}...`);
                        const result = await test.fn(page, fullUrl);
                        testResults.pages[pageName].tests[test.name] = result;

                        // Update summary
                        testResults.summary.total++;
                        if (result.status === 'pass') testResults.summary.passed++;
                        else if (result.status === 'fail') testResults.summary.failed++;
                        else if (result.status === 'warning') testResults.summary.warnings++;
                        else testResults.summary.skipped++;

                        const icon = result.status === 'pass' ? '✅' :
                                   result.status === 'fail' ? '❌' :
                                   result.status === 'warning' ? '⚠️' : '⏭️';
                        console.log(`         ${icon} ${result.message}`);

                    } catch (error) {
                        console.log(`         ❌ Test error: ${error.message}`);
                        testResults.pages[pageName].tests[test.name] = createTestResult('fail',
                            `Test execution failed: ${error.message}`
                        );
                        testResults.summary.total++;
                        testResults.summary.failed++;
                    }
                }

            } catch (error) {
                console.log(`   ❌ Page error: ${error.message}`);
                testResults.pages[pageName] = {
                    url: fullUrl,
                    accessible: false,
                    error: error.message,
                    tests: {}
                };
            } finally {
                await context.close();
            }
        }

    } finally {
        await browser.close();
    }

    testResults.summary.duration = Date.now() - startTime;
    console.log('\n🏁 ULTRA COMPREHENSIVE TEST COMPLETED');

    return testResults;
}

// HTML Report Generator
function generateHTMLReport(results) {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ultra Comprehensive E2E Test Report</title>
    <style>
        * { box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(45deg, #2c3e50, #3498db);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 2.5em;
            font-weight: 300;
        }
        .header .subtitle {
            margin-top: 10px;
            opacity: 0.9;
            font-size: 1.1em;
        }
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 30px;
            background: #f8f9fa;
        }
        .summary-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transition: transform 0.2s;
        }
        .summary-card:hover {
            transform: translateY(-2px);
        }
        .summary-card .number {
            font-size: 2.5em;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .summary-card .label {
            color: #666;
            font-size: 0.9em;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .passed .number { color: #27ae60; }
        .failed .number { color: #e74c3c; }
        .warnings .number { color: #f39c12; }
        .skipped .number { color: #95a5a6; }

        .pages-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 20px;
            padding: 30px;
        }
        .page-card {
            background: white;
            border-radius: 8px;
            border: 1px solid #e9ecef;
            overflow: hidden;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .page-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        }
        .page-header {
            background: #2c3e50;
            color: white;
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .page-title {
            font-weight: 600;
            font-size: 1.1em;
        }
        .page-status {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.8em;
            font-weight: bold;
        }
        .status-accessible { background: #27ae60; color: white; }
        .status-error { background: #e74c3c; color: white; }

        .page-content {
            padding: 20px;
        }
        .test-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #f0f0f0;
        }
        .test-item:last-child {
            border-bottom: none;
        }
        .test-name {
            font-weight: 500;
            color: #2c3e50;
        }
        .test-result {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .test-status {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8em;
            font-weight: bold;
        }
        .status-pass { background: #d4edda; color: #155724; }
        .status-fail { background: #f8d7da; color: #721c24; }
        .status-warning { background: #fff3cd; color: #856404; }
        .status-skip { background: #e2e3e5; color: #495057; }

        .test-details {
            margin-top: 8px;
            padding: 8px 12px;
            background: #f8f9fa;
            border-radius: 4px;
            font-size: 0.85em;
            color: #666;
            display: none;
        }
        .test-item:hover .test-details {
            display: block;
        }

        /* Responsive test specific styling */
        .viewport-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 8px;
            margin: 8px 0;
        }
        .viewport-card {
            background: white;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 8px;
            font-size: 0.8em;
        }
        .viewport-header {
            font-weight: bold;
            margin-bottom: 4px;
            color: #2c3e50;
        }
        .viewport-status {
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 0.75em;
            font-weight: bold;
        }
        .status-pass { background: #d4edda; color: #155724; }
        .status-warning { background: #fff3cd; color: #856404; }
        .status-fail { background: #f8d7da; color: #721c24; }

        .mobile-test-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 6px;
            margin: 6px 0;
        }
        .mobile-test-item {
            background: #f8f9fa;
            border-radius: 4px;
            padding: 6px;
            font-size: 0.75em;
            border-left: 3px solid #ddd;
        }
        .mobile-test-item.pass { border-left-color: #28a745; }
        .mobile-test-item.warning { border-left-color: #ffc107; }
        .mobile-test-item.fail { border-left-color: #dc3545; }

        .footer {
            text-align: center;
            padding: 20px;
            color: #666;
            border-top: 1px solid #e9ecef;
            background: #f8f9fa;
        }

        .progress-bar {
            width: 100%;
            height: 6px;
            background: #e9ecef;
            border-radius: 3px;
            margin: 20px 0;
            overflow: hidden;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(45deg, #27ae60, #2ecc71);
            transition: width 1s ease;
        }

        @media (max-width: 768px) {
            body { padding: 10px; }
            .header { padding: 20px; }
            .header h1 { font-size: 2em; }
            .summary, .pages-grid { padding: 20px; }
            .pages-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧪 Ultra Comprehensive E2E Test Report</h1>
            <div class="subtitle">
                ${USE_PRODUCTION ? '🌐 Production' : '🏠 Local'} •
                ${new Date(results.summary.timestamp).toLocaleString()} •
                Duration: ${Math.round(results.summary.duration / 1000)}s
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${Math.round((results.summary.passed / results.summary.total) * 100)}%"></div>
            </div>
        </div>

        <div class="summary">
            <div class="summary-card passed">
                <div class="number">${results.summary.passed}</div>
                <div class="label">Passed</div>
            </div>
            <div class="summary-card failed">
                <div class="number">${results.summary.failed}</div>
                <div class="label">Failed</div>
            </div>
            <div class="summary-card warnings">
                <div class="number">${results.summary.warnings}</div>
                <div class="label">Warnings</div>
            </div>
            <div class="summary-card skipped">
                <div class="number">${results.summary.skipped}</div>
                <div class="label">Skipped</div>
            </div>
        </div>

        <div class="pages-grid">
            ${Object.entries(results.pages).map(([pageName, pageData]) => `
                <div class="page-card">
                    <div class="page-header">
                        <div class="page-title">${pageName}</div>
                        <div class="page-status ${pageData.accessible ? 'status-accessible' : 'status-error'}">
                            ${pageData.accessible ? `${pageData.status || 200}` : 'Error'}
                        </div>
                    </div>
                    <div class="page-content">
                        ${pageData.error ? `
                            <div style="color: #e74c3c; font-weight: 500;">❌ ${pageData.error}</div>
                        ` : ''}
                        ${Object.entries(pageData.tests || {}).map(([testName, testResult]) => `
                            <div class="test-item">
                                <div class="test-name">${testName}</div>
                                <div class="test-result">
                                    <span class="test-status status-${testResult.status}">
                                        ${testResult.status.toUpperCase()}
                                    </span>
                                </div>
                                ${testResult.message ? `
                                    <div class="test-details">
                                        <strong>Message:</strong> ${testResult.message}<br>
                                        ${testName === 'responsiveDesign' && testResult.details ? `
                                            <div class="viewport-grid">
                                                ${Object.entries(testResult.details).map(([viewportName, viewportResult]) => `
                                                    <div class="viewport-card">
                                                        <div class="viewport-header">${viewportResult.details?.viewport?.device || viewportName}</div>
                                                        <span class="viewport-status status-${viewportResult.status}">${viewportResult.status.toUpperCase()}</span>
                                                        <div style="margin-top: 4px; font-size: 0.7em;">
                                                            ${viewportResult.details?.viewport?.width}×${viewportResult.details?.viewport?.height}
                                                        </div>
                                                    </div>
                                                `).join('')}
                                            </div>
                                        ` : testName === 'mobileInteractions' && testResult.details ? `
                                            <div class="mobile-test-grid">
                                                ${Object.entries(testResult.details).map(([testKey, testValue]) => `
                                                    <div class="mobile-test-item ${testValue.status}">
                                                        <strong>${testKey}:</strong><br>
                                                        ${testValue.message || testValue.status}
                                                    </div>
                                                `).join('')}
                                            </div>
                                        ` : testResult.details ? `<strong>Details:</strong> ${JSON.stringify(testResult.details, null, 2).substring(0, 200)}...` : ''}
                                    </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="footer">
            <p>Generated by Ultra Comprehensive E2E Test Suite</p>
            <p>AI Studio E-Learning Platform • Test Coverage: ${Object.keys(results.pages).length} pages</p>
        </div>
    </div>
</body>
</html>`;

    return html;
}

// Export and Run
if (require.main === module) {
    runUltraComprehensiveTest()
        .then(results => {
            // Generate HTML report
            const htmlReport = generateHTMLReport(results);
            const reportPath = path.join(__dirname, 'ultra-e2e-test-report.html');

            fs.writeFileSync(reportPath, htmlReport);
            console.log(`\n📊 HTML Report generated: ${reportPath}`);

            // Generate JSON report
            const jsonReportPath = path.join(__dirname, 'ultra-e2e-test-results.json');
            fs.writeFileSync(jsonReportPath, JSON.stringify(results, null, 2));
            console.log(`📄 JSON Report generated: ${jsonReportPath}`);

            // Console summary
            const successRate = Math.round((results.summary.passed / results.summary.total) * 100);
            console.log(`\n🎯 FINAL RESULTS:`);
            console.log(`   Success Rate: ${successRate}%`);
            console.log(`   ✅ Passed: ${results.summary.passed}`);
            console.log(`   ❌ Failed: ${results.summary.failed}`);
            console.log(`   ⚠️  Warnings: ${results.summary.warnings}`);
            console.log(`   ⏭️  Skipped: ${results.summary.skipped}`);
            console.log(`   📊 Total Tests: ${results.summary.total}`);
            console.log(`   ⏱️  Duration: ${Math.round(results.summary.duration / 1000)}s`);

            process.exit(results.summary.failed > 0 ? 1 : 0);
        })
        .catch(error => {
            console.error('❌ Test suite failed:', error);
            process.exit(1);
        });
}

module.exports = { runUltraComprehensiveTest, generateHTMLReport };