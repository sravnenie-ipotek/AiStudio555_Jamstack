const puppeteer = require('puppeteer');

async function comprehensivePageTranslationTest() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    console.log('🚀 Comprehensive Page Translation Test - All Pages, All Languages\n');

    const testPages = [
        'home.html',
        'courses.html',
        'pricing.html',
        'blog.html',
        'teachers.html',
        'career-center.html',
        'career-orientation.html'
    ];

    const testLanguages = ['ru', 'he'];
    const results = {};

    for (const lang of testLanguages) {
        console.log(`\n🌐 === TESTING ${lang.toUpperCase()} LANGUAGE ===`);
        results[lang] = {};

        for (const pageName of testPages) {
            console.log(`\n📄 Testing ${pageName} in ${lang}...`);

            try {
                await page.goto(`http://localhost:3005/${pageName}?locale=${lang}`, {
                    waitUntil: 'networkidle2',
                    timeout: 10000
                });
                await page.waitForTimeout(3000);

                const pageResult = await page.evaluate((currentLang) => {
                    // Helper function to detect if text is in the target language
                    function isInTargetLanguage(text, language) {
                        if (!text || text.length < 2) return true; // Skip very short text

                        // Russian detection
                        if (language === 'ru') {
                            return /[а-яё]/i.test(text);
                        }

                        // Hebrew detection
                        if (language === 'he') {
                            return /[\u0590-\u05FF]/.test(text);
                        }

                        return false;
                    }

                    // Get all text elements with data-i18n attributes
                    const dataI18nElements = document.querySelectorAll('[data-i18n]');
                    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, button, a');

                    const issues = [];
                    let translatedCount = 0;
                    let totalCount = 0;

                    // Test data-i18n elements
                    dataI18nElements.forEach(element => {
                        const text = element.textContent.trim();
                        const dataI18n = element.getAttribute('data-i18n');

                        if (text.length > 2 && !/^[\d\s\-\+\.\,\(\)\[\]$€£¥%]+$/.test(text)) {
                            totalCount++;

                            if (isInTargetLanguage(text, currentLang)) {
                                translatedCount++;
                            } else {
                                // Check if it's English text that should be translated
                                if (/^[a-zA-Z\s\.\,\!\?\-\:\;\'\"]+$/.test(text)) {
                                    issues.push({
                                        type: 'untranslated_data_i18n',
                                        text: text.substring(0, 80),
                                        dataI18n: dataI18n,
                                        element: element.tagName.toLowerCase()
                                    });
                                }
                            }
                        }
                    });

                    // Test prominent text elements without data-i18n
                    const prominentSelectors = [
                        '.banner-heading', '.section-title', '.course-title',
                        '.testimonial-text', '.faq-question', '.footer-description-text',
                        '.pricing-plan-title', '.blog-title', '.teacher-name',
                        '.course-card-title', '.button-text', '.nav-link'
                    ];

                    prominentSelectors.forEach(selector => {
                        const elements = document.querySelectorAll(selector);
                        elements.forEach(element => {
                            if (!element.hasAttribute('data-i18n')) {
                                const text = element.textContent.trim();
                                if (text.length > 2 && /^[a-zA-Z\s\.\,\!\?\-\:\;\'\"]+$/.test(text)) {
                                    issues.push({
                                        type: 'missing_data_i18n',
                                        text: text.substring(0, 80),
                                        selector: selector,
                                        element: element.tagName.toLowerCase()
                                    });
                                }
                            }
                        });
                    });

                    // Check for English fallbacks in key areas
                    const keySelectors = {
                        'Start Learning': '[data-i18n*="start_learning"]',
                        'Browse Courses': '[data-i18n*="browse_courses"]',
                        'FAQ': '[data-i18n*="faq"]',
                        'Footer Description': '[data-i18n="footer.content.description"]',
                        'Testimonials': '[data-i18n*="testimonial"]',
                        'Pricing': '[data-i18n*="pricing"]'
                    };

                    const keyAreaResults = {};
                    Object.entries(keySelectors).forEach(([name, selector]) => {
                        const elements = document.querySelectorAll(selector);
                        const working = Array.from(elements).filter(el =>
                            isInTargetLanguage(el.textContent, currentLang)
                        ).length;
                        const total = elements.length;
                        keyAreaResults[name] = { working, total };
                    });

                    return {
                        translatedCount,
                        totalCount,
                        issues: issues.slice(0, 10), // Limit to first 10 issues
                        keyAreas: keyAreaResults,
                        totalIssues: issues.length
                    };
                }, lang);

                results[lang][pageName] = pageResult;

                // Log immediate results
                const successRate = pageResult.totalCount > 0 ?
                    Math.round((pageResult.translatedCount / pageResult.totalCount) * 100) : 100;

                console.log(`  📊 Success Rate: ${successRate}% (${pageResult.translatedCount}/${pageResult.totalCount})`);
                console.log(`  ⚠️  Total Issues: ${pageResult.totalIssues}`);

                // Show key areas status
                Object.entries(pageResult.keyAreas).forEach(([area, result]) => {
                    const status = result.working === result.total ? '✅' : '❌';
                    console.log(`  ${status} ${area}: ${result.working}/${result.total}`);
                });

                if (pageResult.issues.length > 0) {
                    console.log(`  🔍 Sample Issues:`);
                    pageResult.issues.slice(0, 3).forEach(issue => {
                        console.log(`    - ${issue.type}: "${issue.text}"`);
                    });
                }

            } catch (error) {
                console.log(`  ❌ Error testing ${pageName}: ${error.message}`);
                results[lang][pageName] = { error: error.message };
            }
        }
    }

    // Generate summary report
    console.log('\n\n📋 === COMPREHENSIVE SUMMARY REPORT ===\n');

    testLanguages.forEach(lang => {
        console.log(`🌐 ${lang.toUpperCase()} LANGUAGE SUMMARY:`);

        let totalPages = 0;
        let workingPages = 0;
        let totalIssues = 0;

        testPages.forEach(pageName => {
            const result = results[lang][pageName];
            if (result && !result.error) {
                totalPages++;
                const successRate = result.totalCount > 0 ?
                    Math.round((result.translatedCount / result.totalCount) * 100) : 100;
                if (successRate >= 90) workingPages++;
                totalIssues += result.totalIssues || 0;

                const status = successRate >= 90 ? '✅' : successRate >= 70 ? '⚠️' : '❌';
                console.log(`  ${status} ${pageName}: ${successRate}% (${result.totalIssues || 0} issues)`);
            }
        });

        console.log(`  📊 Overall: ${workingPages}/${totalPages} pages working well`);
        console.log(`  🔍 Total Issues Found: ${totalIssues}\n`);
    });

    // Show critical issues that need immediate attention
    console.log('🚨 CRITICAL ISSUES REQUIRING ATTENTION:\n');

    testLanguages.forEach(lang => {
        testPages.forEach(pageName => {
            const result = results[lang][pageName];
            if (result && result.issues) {
                const criticalIssues = result.issues.filter(issue =>
                    issue.type === 'untranslated_data_i18n' && issue.text.length > 10
                );

                if (criticalIssues.length > 0) {
                    console.log(`❌ ${lang.toUpperCase()} ${pageName}:`);
                    criticalIssues.forEach(issue => {
                        console.log(`  - "${issue.text}" (${issue.dataI18n})`);
                    });
                    console.log('');
                }
            }
        });
    });

    await browser.close();
    return results;
}

comprehensivePageTranslationTest().catch(console.error);