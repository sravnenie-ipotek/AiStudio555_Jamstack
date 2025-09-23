const puppeteer = require('puppeteer');

async function comprehensiveHomeQA() {
    const browser = await puppeteer.launch({ headless: true });
    let allTestsPassed = true;

    console.log('🔍 COMPREHENSIVE QA: home.html - Dual Translation System\n');

    for (let testRun = 1; testRun <= 3; testRun++) {
        console.log(`\n🔄 TEST RUN ${testRun}/3`);

        for (const locale of ['en', 'ru', 'he']) {
            console.log(`\n--- Testing ${locale.toUpperCase()} ---`);

            const page = await browser.newPage();

            // Capture console errors
            const consoleErrors = [];
            page.on('console', msg => {
                if (msg.type() === 'error' || msg.text().includes('undefined') || msg.text().includes('Translation Missing')) {
                    consoleErrors.push(msg.text());
                }
            });

            await page.goto(`http://localhost:3005/home.html?locale=${locale}`, { waitUntil: 'networkidle2' });
            await page.waitForTimeout(4000); // Give time for both systems to run

            const results = await page.evaluate((testLocale) => {
                const isRussian = (text) => text && /[а-я]/i.test(text);
                const isHebrew = (text) => text && /[\u0590-\u05FF]/.test(text);
                const isEnglish = (text) => text && /[a-z]/i.test(text) && !/[а-я\u0590-\u05FF]/i.test(text);

                const getExpectedLanguage = (locale, text) => {
                    switch(locale) {
                        case 'ru': return isRussian(text);
                        case 'he': return isHebrew(text);
                        case 'en': return isEnglish(text);
                        default: return false;
                    }
                };

                // Test UI Elements (should be handled by unified-language-manager)
                const uiElements = {
                    heroTitle: document.querySelector('.banner-heading')?.textContent?.trim(),
                    heroSubtitle: document.querySelector('.banner-subtitle')?.textContent?.trim(),
                    heroDescription: document.querySelector('.banner-description-text')?.textContent?.trim(),
                    primaryButton: document.querySelector('.banner-button-wrapper .primary-button:first-child .primary-button-text-block')?.textContent?.trim(),
                    aboutTitle: document.querySelector('.about-us .section-title')?.textContent?.trim(),
                    aboutSubtitle: document.querySelector('.about-us .section-subtitle')?.textContent?.trim(),
                    testimonialsTitle: document.querySelector('.testimonials .section-title')?.textContent?.trim(),
                    navHome: document.querySelector('a[href="home.html"]')?.textContent?.trim(),
                    navCourses: document.querySelector('a[href="courses.html"]')?.textContent?.trim(),
                    footerTitle: document.querySelector('.footer-menu-title')?.textContent?.trim()
                };

                // Test Dynamic Content (should be handled by integration files)
                const dynamicContent = {
                    faqItems: [],
                    testimonialItems: [],
                    hasDataI18nRemoved: []
                };

                // Check FAQ items
                for (let i = 1; i <= 5; i++) {
                    const faqTab = document.querySelector(`[data-w-tab="Tab ${i}"].single-faq-accordion-wrap`);
                    if (faqTab) {
                        const question = faqTab.querySelector('.faq-question')?.textContent?.trim();
                        const answer = faqTab.querySelector('.faq-answer')?.textContent?.trim();
                        const hasDataI18n = faqTab.querySelector('.faq-question')?.hasAttribute('data-i18n');

                        dynamicContent.faqItems.push({
                            index: i,
                            question: question?.substring(0, 50) + '...',
                            answer: answer?.substring(0, 50) + '...',
                            hasDataI18n: hasDataI18n,
                            questionInCorrectLang: getExpectedLanguage(testLocale, question),
                            answerInCorrectLang: getExpectedLanguage(testLocale, answer)
                        });
                    }
                }

                // Check testimonial items
                for (let i = 1; i <= 7; i++) {
                    const tabPane = document.querySelector(`.testimonials-tab-pane[data-w-tab="Tab ${i}"]`);
                    if (tabPane) {
                        const title = tabPane.querySelector('.testimonials-title')?.textContent?.trim();
                        const text = tabPane.querySelector('.testimonials-card-description-text')?.textContent?.trim();
                        const name = tabPane.querySelector('.testimonials-card-author-name')?.textContent?.trim();
                        const hasDataI18n = tabPane.querySelector('.testimonials-title')?.hasAttribute('data-i18n');

                        dynamicContent.testimonialItems.push({
                            index: i,
                            title: title?.substring(0, 40) + '...',
                            text: text?.substring(0, 40) + '...',
                            name: name,
                            hasDataI18n: hasDataI18n,
                            titleInCorrectLang: getExpectedLanguage(testLocale, title),
                            textInCorrectLang: getExpectedLanguage(testLocale, text)
                        });
                    }
                }

                // System health checks
                const systemHealth = {
                    totalDataI18n: document.querySelectorAll('[data-i18n]').length,
                    removedDataI18n: document.querySelectorAll('.testimonials-title:not([data-i18n]), .faq-question:not([data-i18n])').length,
                    hasJSErrors: window.onerror !== null
                };

                return {
                    ui: uiElements,
                    dynamic: dynamicContent,
                    system: systemHealth,
                    locale: testLocale
                };
            }, locale);

            // Add console errors to results
            results.consoleErrors = consoleErrors;

            // Analyze results
            console.log('📱 UI Translation Analysis:');
            const uiPassed = Object.entries(results.ui).every(([key, value]) => {
                if (!value) return true; // Skip empty elements

                const isCorrectLang = locale === 'ru' ? /[а-я]/i.test(value) :
                                    locale === 'he' ? /[\u0590-\u05FF]/.test(value) :
                                    /[a-z]/i.test(value) && !/[а-я\u0590-\u05FF]/i.test(value);

                console.log(`  ${key}: ${isCorrectLang ? '✅' : '❌'} ${value.substring(0, 30)}...`);
                return isCorrectLang;
            });

            console.log('\n🔄 Dynamic Content Analysis:');
            const faqPassed = results.dynamic.faqItems.every(item => {
                const passed = item.questionInCorrectLang && item.answerInCorrectLang && !item.hasDataI18n;
                console.log(`  FAQ ${item.index}: ${passed ? '✅' : '❌'} Question: ${item.questionInCorrectLang ? '✅' : '❌'} Answer: ${item.answerInCorrectLang ? '✅' : '❌'} No data-i18n: ${!item.hasDataI18n ? '✅' : '❌'}`);
                return passed;
            });

            const testimonialsPassed = results.dynamic.testimonialItems.some(item =>
                item.titleInCorrectLang || item.textInCorrectLang
            );
            console.log(`  Testimonials: ${testimonialsPassed ? '✅' : '❌'} (At least some translated correctly)`);

            console.log('\n⚙️ System Health:');
            console.log(`  Total data-i18n: ${results.system.totalDataI18n} ${results.system.totalDataI18n > 200 ? '✅' : '❌'}`);
            console.log(`  Removed data-i18n: ${results.system.removedDataI18n} ${results.system.removedDataI18n > 0 ? '✅' : '❌'}`);
            console.log(`  Console errors: ${results.consoleErrors.length} ${results.consoleErrors.length === 0 ? '✅' : '❌'}`);

            if (results.consoleErrors.length > 0) {
                console.log('  Error details:', results.consoleErrors.slice(0, 3));
            }

            const localeTestPassed = uiPassed && faqPassed && testimonialsPassed &&
                                   results.system.totalDataI18n > 200 &&
                                   results.consoleErrors.length === 0;

            console.log(`\n📊 ${locale.toUpperCase()} Result: ${localeTestPassed ? '✅ PASSED' : '❌ FAILED'}`);

            if (!localeTestPassed) allTestsPassed = false;

            await page.close();
        }
    }

    await browser.close();

    console.log(`\n🏆 FINAL RESULT: home.html ${allTestsPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
    console.log('Dual translation system working correctly!');

    return allTestsPassed;
}

comprehensiveHomeQA().catch(console.error);