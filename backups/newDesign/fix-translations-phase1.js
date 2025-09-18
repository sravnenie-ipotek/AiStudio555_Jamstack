// PHASE 1: Fix Navigation & Buttons - High Impact, Low Risk
// Uses Playwright to verify each change automatically

const { chromium } = require('playwright');
const fs = require('fs');

async function fixTranslationsPhase1() {
    console.log('🚀 PHASE 1: Fixing Navigation & Buttons with Playwright verification');

    // Read the home.html file
    const htmlPath = '/Users/michaelmishayev/Desktop/newCode/backups/newDesign/home.html';
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');

    console.log('📝 Original file loaded');

    // Phase 1 Fixes - Navigation & Buttons (High Impact)
    const phase1Fixes = [
        // Navigation Links
        {
            search: '<a href="#" class="nav-link w-nav-link">Home</a>',
            replace: '<a href="#" class="nav-link w-nav-link" data-i18n="navigation.content.items.0.text">Home</a>',
            description: 'Navigation: Home'
        },
        {
            search: '<a href="courses.html" class="nav-link w-nav-link">Courses</a>',
            replace: '<a href="courses.html" class="nav-link w-nav-link" data-i18n="navigation.content.items.1.text">Courses</a>',
            description: 'Navigation: Courses'
        },
        {
            search: '<a href="pricing.html" class="nav-link w-nav-link">Pricing</a>',
            replace: '<a href="pricing.html" class="nav-link w-nav-link" data-i18n="navigation.content.items.2.text">Pricing</a>',
            description: 'Navigation: Pricing'
        },
        {
            search: '<div class="dropdown-toggle-text-block">About Us</div>',
            replace: '<div class="dropdown-toggle-text-block" data-i18n="navigation.content.items.3.text">About Us</div>',
            description: 'Navigation: About Us'
        },
        {
            search: '<a href="blog.html" class="nav-link w-nav-link">Blog</a>',
            replace: '<a href="blog.html" class="nav-link w-nav-link" data-i18n="navigation.content.items.4.text">Blog</a>',
            description: 'Navigation: Blog'
        },
        {
            search: '<a href="teachers.html" class="nav-link w-nav-link">Teachers</a>',
            replace: '<a href="teachers.html" class="nav-link w-nav-link" data-i18n="navigation.content.items.5.text">Teachers</a>',
            description: 'Navigation: Teachers'
        },

        // Primary CTA Buttons - "Sign Up Today"
        {
            search: '<div class="primary-button-text-block">Sign Up Today</div>',
            replace: '<div class="primary-button-text-block" data-i18n="misc.content.buttons_global.0">Sign Up Today</div>',
            description: 'Button: Sign Up Today',
            replaceAll: true
        },
        {
            search: '<div class="primary-button-text-block is-text-absolute">Sign Up Today</div>',
            replace: '<div class="primary-button-text-block is-text-absolute" data-i18n="misc.content.buttons_global.0">Sign Up Today</div>',
            description: 'Button: Sign Up Today (absolute)',
            replaceAll: true
        },

        // Other Common Buttons
        {
            search: '<div class="primary-button-text-block">get in touch</div>',
            replace: '<div class="primary-button-text-block" data-i18n="misc.content.buttons_global.1">get in touch</div>',
            description: 'Button: get in touch',
            replaceAll: true
        },
        {
            search: '<div class="primary-button-text-block is-text-absolute">get in touch</div>',
            replace: '<div class="primary-button-text-block is-text-absolute" data-i18n="misc.content.buttons_global.1">get in touch</div>',
            description: 'Button: get in touch (absolute)',
            replaceAll: true
        },
        {
            search: '<div class="primary-button-text-block">Check Out Courses</div>',
            replace: '<div class="primary-button-text-block" data-i18n="misc.content.buttons_global.2">Check Out Courses</div>',
            description: 'Button: Check Out Courses',
            replaceAll: true
        },
        {
            search: '<div class="primary-button-text-block is-text-absolute">Check Out Courses</div>',
            replace: '<div class="primary-button-text-block is-text-absolute" data-i18n="misc.content.buttons_global.2">Check Out Courses</div>',
            description: 'Button: Check Out Courses (absolute)',
            replaceAll: true
        },
        {
            search: '<div class="primary-button-text-block">Discover Courses</div>',
            replace: '<div class="primary-button-text-block" data-i18n="misc.content.buttons_global.4">Discover Courses</div>',
            description: 'Button: Discover Courses',
            replaceAll: true
        },
        {
            search: '<div class="primary-button-text-block is-text-absolute">Discover Courses</div>',
            replace: '<div class="primary-button-text-block is-text-absolute" data-i18n="misc.content.buttons_global.4">Discover Courses</div>',
            description: 'Button: Discover Courses (absolute)',
            replaceAll: true
        }
    ];

    // Apply fixes
    let appliedFixes = 0;
    console.log('\\n🔧 Applying Phase 1 fixes...');

    for (const fix of phase1Fixes) {
        const originalContent = htmlContent;

        if (fix.replaceAll) {
            // Replace all instances
            const regex = new RegExp(escapeRegex(fix.search), 'g');
            htmlContent = htmlContent.replace(regex, fix.replace);

            // Count how many replacements were made
            const matches = originalContent.match(regex);
            const count = matches ? matches.length : 0;

            if (count > 0) {
                console.log(`  ✅ ${fix.description}: ${count} instances`);
                appliedFixes += count;
            } else {
                console.log(`  ⚠️  ${fix.description}: No matches found`);
            }
        } else {
            // Replace single instance
            if (htmlContent.includes(fix.search)) {
                htmlContent = htmlContent.replace(fix.search, fix.replace);
                console.log(`  ✅ ${fix.description}`);
                appliedFixes++;
            } else {
                console.log(`  ⚠️  ${fix.description}: No match found`);
            }
        }
    }

    console.log(`\\n📊 Applied ${appliedFixes} fixes total`);

    // Save the updated file
    fs.writeFileSync(htmlPath, htmlContent, 'utf8');
    console.log('💾 File saved with Phase 1 fixes');

    // Playwright verification
    console.log('\\n🔍 Starting Playwright verification...');

    const browser = await chromium.launch({ headless: false, slowMo: 1000 });
    const page = await browser.newPage();

    try {
        // Test English version
        console.log('📄 Testing English version...');
        await page.goto('http://localhost:3005/home.html');
        await page.waitForTimeout(2000);

        // Test Russian translation
        console.log('🔄 Switching to Russian...');
        try {
            await page.click('.lang-pill:has-text("RU")', { force: true });
        } catch (e) {
            await page.click('.mobile-lang-pill:has-text("RU")', { force: true });
        }

        await page.waitForTimeout(3000);

        // Verify key translations
        console.log('✅ Verifying translations...');

        const verifications = [
            { selector: 'a[data-i18n="navigation.content.items.0.text"]', expected: 'Главная', description: 'Home navigation' },
            { selector: 'a[data-i18n="navigation.content.items.1.text"]', expected: 'Курсы', description: 'Courses navigation' },
            { selector: 'a[data-i18n="navigation.content.items.2.text"]', expected: 'Цены', description: 'Pricing navigation' },
            { selector: 'div[data-i18n="navigation.content.items.3.text"]', expected: 'О нас', description: 'About Us navigation' },
            { selector: 'a[data-i18n="navigation.content.items.4.text"]', expected: 'Блог', description: 'Blog navigation' },
            { selector: 'div[data-i18n="misc.content.buttons_global.0"]:first', expected: 'Записаться Сегодня', description: 'Sign Up Today button' },
            { selector: 'div[data-i18n="misc.content.buttons_global.1"]:first', expected: 'связаться', description: 'Get in touch button' }
        ];

        let verificationsPassed = 0;
        let verificationsTotal = verifications.length;

        for (const verification of verifications) {
            try {
                const element = await page.locator(verification.selector).first();
                const text = await element.textContent();

                if (text && text.trim() === verification.expected) {
                    console.log(`  ✅ ${verification.description}: "${text}"`);
                    verificationsPassed++;
                } else {
                    console.log(`  ❌ ${verification.description}: Expected "${verification.expected}", got "${text}"`);
                }
            } catch (error) {
                console.log(`  ❌ ${verification.description}: Element not found`);
            }
        }

        console.log(`\\n🎯 PHASE 1 RESULTS:`);
        console.log(`✅ Fixes applied: ${appliedFixes}`);
        console.log(`✅ Verifications passed: ${verificationsPassed}/${verificationsTotal}`);
        console.log(`📈 Success rate: ${Math.round((verificationsPassed / verificationsTotal) * 100)}%`);

        if (verificationsPassed === verificationsTotal) {
            console.log('🎉 PHASE 1 COMPLETE - All navigation and buttons are now translated!');
        } else {
            console.log('⚠️  Some verifications failed - check the output above');
        }

    } catch (error) {
        console.error('❌ Verification error:', error);
    }

    await browser.close();
}

function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');
}

fixTranslationsPhase1().catch(console.error);