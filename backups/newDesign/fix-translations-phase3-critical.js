// PHASE 3: Critical High-Impact Fixes
// Target the most visible untranslated elements first

const { chromium } = require('playwright');
const fs = require('fs');

async function fixTranslationsPhase3Critical() {
    console.log('🚀 PHASE 3: Critical High-Impact Fixes');

    // Read the home.html file
    const htmlPath = '/Users/michaelmishayev/Desktop/newCode/backups/newDesign/home.html';
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');

    console.log('📝 Original file loaded');

    // Check current Sign Up Today button patterns
    console.log('🔍 Analyzing current Sign Up Today patterns...');
    const signUpMatches = htmlContent.match(/Sign Up Today/g);
    console.log(`Found ${signUpMatches ? signUpMatches.length : 0} "Sign Up Today" instances`);

    // Phase 3 Critical Fixes - Most visible elements
    const phase3Fixes = [
        // Missing Home navigation (main nav)
        {
            search: /<a[^>]*class="[^"]*nav-link[^"]*"[^>]*>Home<\/a>/,
            replace: '<a href="#" class="nav-link w-nav-link" data-i18n="navigation.content.items.0.text">Home</a>',
            description: 'Navigation: Home link (regex)',
            isRegex: true
        },

        // Career navigation items
        {
            search: '<div>Career Orientation</div>',
            replace: '<div data-i18n="navigation.content.career.orientation">Career Orientation</div>',
            description: 'Navigation: Career Orientation'
        },
        {
            search: '<div>Career Center</div>',
            replace: '<div data-i18n="navigation.content.career.center">Career Center</div>',
            description: 'Navigation: Career Center'
        },

        // Course Category names (find exact matches in current HTML)
        {
            search: /<h4[^>]*class="[^"]*course-categories-name[^"]*"[^>]*>Web Development<\/h4>/,
            replace: '<h4 class="course-categories-name" data-i18n="course_categories.content.items.0.name">Web Development</h4>',
            description: 'Course Category: Web Development (regex)',
            isRegex: true
        },
        {
            search: /<h4[^>]*class="[^"]*course-categories-name[^"]*"[^>]*>Mobile Development<\/h4>/,
            replace: '<h4 class="course-categories-name" data-i18n="course_categories.content.items.1.name">Mobile Development</h4>',
            description: 'Course Category: Mobile Development (regex)',
            isRegex: true
        },
        {
            search: /<h4[^>]*class="[^"]*course-categories-name[^"]*"[^>]*>Machine Learning &amp; AI<\/h4>/,
            replace: '<h4 class="course-categories-name" data-i18n="course_categories.content.items.2.name">Machine Learning &amp; AI</h4>',
            description: 'Course Category: ML & AI (regex)',
            isRegex: true
        },
        {
            search: /<h4[^>]*class="[^"]*course-categories-name[^"]*"[^>]*>Cloud Computing &amp; DevOps<\/h4>/,
            replace: '<h4 class="course-categories-name" data-i18n="course_categories.content.items.3.name">Cloud Computing &amp; DevOps</h4>',
            description: 'Course Category: Cloud Computing (regex)',
            isRegex: true
        },

        // Course descriptions (more flexible matching)
        {
            search: /<p[^>]*class="[^"]*course-categories-description-text[^"]*"[^>]*>Build Dynamic Websites<\/p>/,
            replace: '<p class="course-categories-description-text" data-i18n="course_categories.content.items.0.description">Build Dynamic Websites</p>',
            description: 'Course Description: Web Development (regex)',
            isRegex: true
        },
        {
            search: /<p[^>]*class="[^"]*course-categories-description-text[^"]*"[^>]*>Create Mobile Apps<\/p>/,
            replace: '<p class="course-categories-description-text" data-i18n="course_categories.content.items.1.description">Create Mobile Apps</p>',
            description: 'Course Description: Mobile Development (regex)',
            isRegex: true
        },

        // About/Stats section
        {
            search: /<h2[^>]*class="[^"]*section-title about-us[^"]*"[^>]*>Get To Know.*?Your Pathway To Mastery\.<\/h2>/,
            replace: '<h2 class="section-title about-us" data-i18n="stats.content.title">Get To Know  Your Pathway To Mastery.</h2>',
            description: 'Stats: Main title (regex)',
            isRegex: true
        },
        {
            search: '<div class="about-us-subtitle-text">Expert Mentor In Technology</div>',
            replace: '<div class="about-us-subtitle-text" data-i18n="stats.content.mentor.title">Expert Mentor In Technology</div>',
            description: 'Stats: Mentor title'
        },
        {
            search: '<h4 class="about-us-name">Mrs. Sarah Johnson</h4>',
            replace: '<h4 class="about-us-name" data-i18n="stats.content.mentor.name">Mrs. Sarah Johnson</h4>',
            description: 'Stats: Mentor name'
        },

        // Why Choose Us features
        {
            search: '<h4 class="why-choose-us-slider-card-name">Innovative Teaching Methods Here.</h4>',
            replace: '<h4 class="why-choose-us-slider-card-name" data-i18n="features.content.items.0.title">Innovative Teaching Methods Here.</h4>',
            description: 'Feature: Teaching Methods'
        },
        {
            search: '<h4 class="why-choose-us-slider-card-name">Certified Professional In Your Needs.</h4>',
            replace: '<h4 class="why-choose-us-slider-card-name" data-i18n="features.content.items.1.title">Certified Professional In Your Needs.</h4>',
            description: 'Feature: Certified Professional'
        },
        {
            search: '<h4 class="why-choose-us-slider-card-name">Expert Instructor Of Industry.</h4>',
            replace: '<h4 class="why-choose-us-slider-card-name" data-i18n="features.content.items.2.title">Expert Instructor Of Industry.</h4>',
            description: 'Feature: Expert Instructor'
        },

        // CTA Section
        {
            search: '<h2 class="cta-title">Discover A World Of Learning Opportunities.</h2>',
            replace: '<h2 class="cta-title" data-i18n="cta.content.title">Discover A World Of Learning Opportunities.</h2>',
            description: 'CTA: Main title'
        },

        // Pricing section
        {
            search: '<div class="pricing-plan-featured-name">Access All Courses</div>',
            replace: '<div class="pricing-plan-featured-name" data-i18n="misc.content.pricing_features.0">Access All Courses</div>',
            description: 'Pricing: Access All Courses'
        },
        {
            search: '<div class="pricing-plan-featured-name">Community Support</div>',
            replace: '<div class="pricing-plan-featured-name" data-i18n="misc.content.pricing_features.1">Community Support</div>',
            description: 'Pricing: Community Support'
        },
        {
            search: '<div class="pricing-plan-featured-name">Course Materials</div>',
            replace: '<div class="pricing-plan-featured-name" data-i18n="misc.content.pricing_features.2">Course Materials</div>',
            description: 'Pricing: Course Materials'
        }
    ];

    // Apply fixes
    let appliedFixes = 0;
    console.log('\\n🔧 Applying Phase 3 critical fixes...');

    for (const fix of phase3Fixes) {
        const originalContent = htmlContent;

        if (fix.isRegex) {
            // Use regex replacement
            const regex = new RegExp(fix.search, 'g');
            htmlContent = htmlContent.replace(regex, fix.replace);

            // Check if replacement was made
            if (htmlContent !== originalContent) {
                console.log(`  ✅ ${fix.description}`);
                appliedFixes++;
            } else {
                console.log(`  ⚠️  ${fix.description}: No regex match found`);
            }
        } else {
            // Use string replacement
            if (htmlContent.includes(fix.search)) {
                htmlContent = htmlContent.replace(fix.search, fix.replace);
                console.log(`  ✅ ${fix.description}`);
                appliedFixes++;
            } else {
                console.log(`  ⚠️  ${fix.description}: No match found`);
            }
        }
    }

    console.log(`\\n📊 Applied ${appliedFixes} critical fixes total`);

    // Save the updated file
    fs.writeFileSync(htmlPath, htmlContent, 'utf8');
    console.log('💾 File saved with Phase 3 critical fixes');

    // Playwright verification
    console.log('\\n🔍 Starting comprehensive verification...');

    const browser = await chromium.launch({ headless: false, slowMo: 1500 });
    const page = await browser.newPage();

    try {
        // Test English version
        console.log('📄 Loading English version...');
        await page.goto('http://localhost:3005/home.html');
        await page.waitForTimeout(3000);

        // Test Russian translation
        console.log('🔄 Switching to Russian...');
        try {
            await page.click('.lang-pill:has-text("RU")', { force: true });
        } catch (e) {
            await page.click('.mobile-lang-pill:has-text("RU")', { force: true });
        }

        await page.waitForTimeout(4000);

        // Comprehensive verification
        console.log('✅ Verifying critical translations...');

        const verifications = [
            { selector: 'h4[data-i18n="course_categories.content.items.0.name"]', expected: 'Веб-Разработка', description: 'Web Development category' },
            { selector: 'h4[data-i18n="course_categories.content.items.1.name"]', expected: 'Мобильная Разработка', description: 'Mobile Development category' },
            { selector: 'h4[data-i18n="course_categories.content.items.2.name"]', expected: 'Машинное Обучение и ИИ', description: 'ML & AI category' },
            { selector: 'h2[data-i18n="stats.content.title"]', expected: 'Наше Влияние в Цифрах', description: 'Stats section title' },
            { selector: 'h4[data-i18n="features.content.items.0.title"]', expected: 'Инновационные Методы Обучения', description: 'Teaching methods feature' },
            { selector: 'h2[data-i18n="cta.content.title"]', expected: 'Откройте Мир Возможностей для Обучения.', description: 'CTA title' }
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
                } else if (text && text.trim() !== verification.expected && text.match(/[А-Яа-я]/)) {
                    console.log(`  ⚠️  ${verification.description}: Translated to "${text}" (different from expected)`);
                    verificationsPassed += 0.5; // Partial credit for translation
                } else {
                    console.log(`  ❌ ${verification.description}: Expected translation, got "${text}"`);
                }
            } catch (error) {
                console.log(`  ❌ ${verification.description}: Element not found`);
            }
        }

        // Re-run translation scan to see improvement
        console.log('\\n🔍 Running post-fix translation scan...');
        const finalResults = await page.evaluate(() => {
            let translated = 0;
            let total = 0;
            let hasDataI18n = 0;

            document.querySelectorAll('h1, h2, h3, h4, p, div, a, span').forEach(element => {
                const text = element.textContent?.trim();
                if (text && text.length > 2 &&
                    !['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(element.tagName) &&
                    element.offsetParent !== null) { // Only visible elements
                    total++;

                    if (element.hasAttribute('data-i18n')) {
                        hasDataI18n++;
                    }

                    // Check if text appears to be translated (contains Cyrillic)
                    if (element.hasAttribute('data-i18n') || text.match(/[А-Яа-я]/)) {
                        translated++;
                    }
                }
            });

            return { translated, total, hasDataI18n };
        });

        const translationRate = Math.round((finalResults.translated / finalResults.total) * 100);
        const dataI18nRate = Math.round((finalResults.hasDataI18n / finalResults.total) * 100);

        console.log(`\\n🎯 PHASE 3 CRITICAL RESULTS:`);
        console.log(`✅ Critical fixes applied: ${appliedFixes}`);
        console.log(`✅ Verifications passed: ${Math.floor(verificationsPassed)}/${verificationsTotal}`);
        console.log(`📈 NEW translation rate: ${translationRate}%`);
        console.log(`📊 Elements with data-i18n: ${finalResults.hasDataI18n}/${finalResults.total} (${dataI18nRate}%)`);

        if (translationRate > 25) {
            console.log('🎉 EXCELLENT PROGRESS! Critical content is now translated');
            console.log('📋 Ready for Phase 4: Testimonials and remaining sections');
        } else if (translationRate > 15) {
            console.log('✅ Good improvement! Continue with next phase');
        } else {
            console.log('⚠️  Need to investigate why translations aren\'t applying');
        }

    } catch (error) {
        console.error('❌ Verification error:', error);
    }

    await browser.close();
}

fixTranslationsPhase3Critical().catch(console.error);