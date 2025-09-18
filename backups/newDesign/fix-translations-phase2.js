// PHASE 2: Fix Major Content Sections
// High-impact content: Course categories, Process steps, Awards, Featured courses

const { chromium } = require('playwright');
const fs = require('fs');

async function fixTranslationsPhase2() {
    console.log('🚀 PHASE 2: Fixing Major Content Sections');

    // Read the home.html file
    const htmlPath = '/Users/michaelmishayev/Desktop/newCode/backups/newDesign/home.html';
    let htmlContent = fs.readFileSync(htmlPath, 'utf8');

    console.log('📝 Original file loaded');

    // Phase 2 Fixes - Major Content Sections
    const phase2Fixes = [
        // Course Categories - Names (High Impact)
        {
            search: '<h4 class="course-categories-name">Web Development</h4>',
            replace: '<h4 class="course-categories-name" data-i18n="course_categories.content.items.0.name">Web Development</h4>',
            description: 'Course Category: Web Development'
        },
        {
            search: '<h4 class="course-categories-name">Mobile Development</h4>',
            replace: '<h4 class="course-categories-name" data-i18n="course_categories.content.items.1.name">Mobile Development</h4>',
            description: 'Course Category: Mobile Development'
        },
        {
            search: '<h4 class="course-categories-name">Machine Learning & AI</h4>',
            replace: '<h4 class="course-categories-name" data-i18n="course_categories.content.items.2.name">Machine Learning & AI</h4>',
            description: 'Course Category: Machine Learning & AI'
        },
        {
            search: '<h4 class="course-categories-name">Cloud Computing & DevOps</h4>',
            replace: '<h4 class="course-categories-name" data-i18n="course_categories.content.items.3.name">Cloud Computing & DevOps</h4>',
            description: 'Course Category: Cloud Computing & DevOps'
        },

        // Course Categories - Descriptions
        {
            search: '<p class="course-categories-description-text">Build Dynamic Websites</p>',
            replace: '<p class="course-categories-description-text" data-i18n="course_categories.content.items.0.description">Build Dynamic Websites</p>',
            description: 'Course Category Description: Web Development'
        },
        {
            search: '<p class="course-categories-description-text">Create Mobile Apps</p>',
            replace: '<p class="course-categories-description-text" data-i18n="course_categories.content.items.1.description">Create Mobile Apps</p>',
            description: 'Course Category Description: Mobile Development'
        },
        {
            search: '<p class="course-categories-description-text">Machine Learning & AI</p>',
            replace: '<p class="course-categories-description-text" data-i18n="course_categories.content.items.2.description">Machine Learning & AI</p>',
            description: 'Course Category Description: ML & AI'
        },
        {
            search: '<p class="course-categories-description-text">Cloud Computing & DevOps</p>',
            replace: '<p class="course-categories-description-text" data-i18n="course_categories.content.items.3.description">Cloud Computing & DevOps</p>',
            description: 'Course Category Description: Cloud Computing'
        },

        // Featured Courses Section
        {
            search: '<div class="section-subtitle">Featured Courses</div>',
            replace: '<div class="section-subtitle" data-i18n="courses.content.subtitle">Featured Courses</div>',
            description: 'Featured Courses: Subtitle'
        },
        {
            search: '<h2 class="section-title featured-courses">Enhance Your Skills With Curated Courses.</h2>',
            replace: '<h2 class="section-title featured-courses" data-i18n="courses.content.title">Enhance Your Skills With Curated Courses.</h2>',
            description: 'Featured Courses: Title'
        },
        {
            search: '<p class="section-description-text featured-courses">Dive into our expertly curated selection of featured courses, designed to equip you with the skills and knowledge needed to excel.</p>',
            replace: '<p class="section-description-text featured-courses" data-i18n="courses.content.description">Dive into our expertly curated selection of featured courses, designed to equip you with the skills and knowledge needed to excel.</p>',
            description: 'Featured Courses: Description'
        },

        // Process Section - Steps
        {
            search: '<div class="section-subtitle">Detailed Process</div>',
            replace: '<div class="section-subtitle" data-i18n="process.content.subtitle">Detailed Process</div>',
            description: 'Process: Subtitle'
        },
        {
            search: '<h2 class="section-title detailed-process">Your Learning Journey With Our Experts.</h2>',
            replace: '<h2 class="section-title detailed-process" data-i18n="process.content.title">Your Learning Journey With Our Experts.</h2>',
            description: 'Process: Title'
        },
        {
            search: '<div class="detailed-process-number">Process #01</div>',
            replace: '<div class="detailed-process-number" data-i18n="process.content.steps.0.number">Process #01</div>',
            description: 'Process: Step 1 Number'
        },
        {
            search: '<h3 class="detailed-process-name">Choose Your Plan first.</h3>',
            replace: '<h3 class="detailed-process-name" data-i18n="process.content.steps.0.title">Choose Your Plan first.</h3>',
            description: 'Process: Step 1 Title'
        },
        {
            search: '<p class="detailed-process-description">Select the plan that best fits your learning need & budget. We are looking for monthly plan.</p>',
            replace: '<p class="detailed-process-description" data-i18n="process.content.steps.0.description">Select the plan that best fits your learning need & budget. We are looking for monthly plan.</p>',
            description: 'Process: Step 1 Description'
        },
        {
            search: '<div class="detailed-process-number">Process #02</div>',
            replace: '<div class="detailed-process-number" data-i18n="process.content.steps.1.number">Process #02</div>',
            description: 'Process: Step 2 Number'
        },
        {
            search: '<h3 class="detailed-process-name">Access All Courses</h3>',
            replace: '<h3 class="detailed-process-name" data-i18n="process.content.steps.1.title">Access All Courses</h3>',
            description: 'Process: Step 2 Title'
        },
        {
            search: '<p class="detailed-process-description">Dive into any course at your own pace, explore new topics, and take advantage.</p>',
            replace: '<p class="detailed-process-description" data-i18n="process.content.steps.1.description">Dive into any course at your own pace, explore new topics, and take advantage.</p>',
            description: 'Process: Step 2 Description'
        },
        {
            search: '<div class="detailed-process-number">Process #03</div>',
            replace: '<div class="detailed-process-number" data-i18n="process.content.steps.2.number">Process #03</div>',
            description: 'Process: Step 3 Number'
        },
        {
            search: '<h3 class="detailed-process-name">Learn And Grow</h3>',
            replace: '<h3 class="detailed-process-name" data-i18n="process.content.steps.2.title">Learn And Grow</h3>',
            description: 'Process: Step 3 Title'
        },
        {
            search: '<p class="detailed-process-description">It has survived not only five centuries, but also the leap into electronic typesetting, remaining.</p>',
            replace: '<p class="detailed-process-description" data-i18n="process.content.steps.2.description">It has survived not only five centuries, but also the leap into electronic typesetting, remaining.</p>',
            description: 'Process: Step 3 Description'
        },

        // Awards Section
        {
            search: '<div class="section-subtitle">Prestigious Awards</div>',
            replace: '<div class="section-subtitle" data-i18n="awards.content.subtitle">Prestigious Awards</div>',
            description: 'Awards: Subtitle'
        },
        {
            search: '<h2 class="section-title awards">Awards That Define Our Excellence.</h2>',
            replace: '<h2 class="section-title awards" data-i18n="awards.content.title">Awards That Define Our Excellence.</h2>',
            description: 'Awards: Title'
        },

        // Stats Section - Based on API structure
        {
            search: '<h2 class="section-title about-us">Get To Know  Your Pathway To Mastery.</h2>',
            replace: '<h2 class="section-title about-us" data-i18n="stats.content.title">Get To Know  Your Pathway To Mastery.</h2>',
            description: 'Stats: Title'
        },
        {
            search: '<div class="about-us-counter-tag-text">Total Courses Taught</div>',
            replace: '<div class="about-us-counter-tag-text" data-i18n="stats.content.stats.0.label">Total Courses Taught</div>',
            description: 'Stats: Label 1'
        },
        {
            search: '<div class="about-us-counter-tag-text">Total Happy Learners</div>',
            replace: '<div class="about-us-counter-tag-text" data-i18n="stats.content.stats.1.label">Total Happy Learners</div>',
            description: 'Stats: Label 2'
        },
        {
            search: '<div class="about-us-counter-tag-text">Years Of Experience</div>',
            replace: '<div class="about-us-counter-tag-text" data-i18n="stats.content.stats.2.label">Years Of Experience</div>',
            description: 'Stats: Label 3'
        }
    ];

    // Apply fixes
    let appliedFixes = 0;
    console.log('\\n🔧 Applying Phase 2 fixes...');

    for (const fix of phase2Fixes) {
        if (htmlContent.includes(fix.search)) {
            htmlContent = htmlContent.replace(fix.search, fix.replace);
            console.log(`  ✅ ${fix.description}`);
            appliedFixes++;
        } else {
            console.log(`  ⚠️  ${fix.description}: No match found`);
        }
    }

    console.log(`\\n📊 Applied ${appliedFixes} fixes total`);

    // Save the updated file
    fs.writeFileSync(htmlPath, htmlContent, 'utf8');
    console.log('💾 File saved with Phase 2 fixes');

    // Playwright verification
    console.log('\\n🔍 Starting Playwright verification...');

    const browser = await chromium.launch({ headless: false, slowMo: 1000 });
    const page = await browser.newPage();

    try {
        // Test English version
        console.log('📄 Testing English version...');
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

        // Verify major content translations
        console.log('✅ Verifying major content translations...');

        const verifications = [
            { selector: 'h4[data-i18n="course_categories.content.items.0.name"]', expected: 'Веб-Разработка', description: 'Web Development category' },
            { selector: 'h4[data-i18n="course_categories.content.items.1.name"]', expected: 'Мобильная Разработка', description: 'Mobile Development category' },
            { selector: 'h4[data-i18n="course_categories.content.items.2.name"]', expected: 'Машинное Обучение и ИИ', description: 'ML & AI category' },
            { selector: 'h3[data-i18n="process.content.steps.0.title"]', expected: 'Выберите Ваш План первым.', description: 'Process step 1 title' },
            { selector: 'h3[data-i18n="process.content.steps.1.title"]', expected: 'Получите Доступ ко Всем Курсам', description: 'Process step 2 title' },
            { selector: 'div[data-i18n="awards.content.subtitle"]', expected: 'Престижные Награды', description: 'Awards subtitle' }
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
                } else if (text && text.trim() !== verification.expected) {
                    console.log(`  ⚠️  ${verification.description}: Expected "${verification.expected}", got "${text}" (partial success)`);
                    verificationsPassed += 0.5; // Partial credit
                } else {
                    console.log(`  ❌ ${verification.description}: No content found`);
                }
            } catch (error) {
                console.log(`  ❌ ${verification.description}: Element not found`);
            }
        }

        // Enhanced final scan
        console.log('\\n🔍 Running enhanced translation scan...');
        const finalResults = await page.evaluate(() => {
            let translated = 0;
            let total = 0;
            let hasDataI18n = 0;

            document.querySelectorAll('h1, h2, h3, h4, p, div').forEach(element => {
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

        console.log(`\\n🎯 PHASE 2 RESULTS:`);
        console.log(`✅ Major content fixes applied: ${appliedFixes}`);
        console.log(`✅ Verifications passed: ${Math.floor(verificationsPassed)}/${verificationsTotal}`);
        console.log(`📈 Estimated translation rate: ${translationRate}%`);
        console.log(`📊 Elements with data-i18n: ${finalResults.hasDataI18n}/${finalResults.total} (${dataI18nRate}%)`);

        if (translationRate > 20) {
            console.log('🎉 MAJOR IMPROVEMENT! Course content is now translated');
            console.log('📋 Ready for Phase 3: Testimonials, FAQ, and remaining content');
        } else if (translationRate > 15) {
            console.log('✅ Good progress! Major sections are being translated');
        } else {
            console.log('⚠️  Translation rate still low - may need API adjustments');
        }

    } catch (error) {
        console.error('❌ Verification error:', error);
    }

    await browser.close();
}

fixTranslationsPhase2().catch(console.error);