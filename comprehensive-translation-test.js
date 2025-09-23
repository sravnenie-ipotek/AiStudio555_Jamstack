const puppeteer = require('puppeteer');

async function comprehensiveTranslationTest() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    console.log('🚀 Comprehensive Translation Test for Home Page Elements\n');

    await page.goto('http://localhost:3005/home.html?locale=ru', { waitUntil: 'networkidle2' });
    await page.waitForTimeout(3000);

    const results = await page.evaluate(() => {
        // Test 1: Start Learning & Browse Courses elements
        const startLearningElements = Array.from(document.querySelectorAll('[data-i18n*="start_learning"]')).slice(0, 3);
        const browseCourseElements = Array.from(document.querySelectorAll('[data-i18n*="browse_courses"]')).slice(0, 3);

        // Test 2: FAQ elements
        const faqTitle = document.querySelector('[data-i18n="faq.content.title"]');
        const faqSubtitle = document.querySelector('[data-i18n="faq.content.subtitle"]');

        // Test 3: CTA elements (Start Learning Today section)
        const ctaSubtitle = document.querySelector('[data-i18n="cta.content.content.content.subtitle"]');
        const ctaTitle = document.querySelector('[data-i18n="cta.content.content.content.title"]');
        const ctaDescription = document.querySelector('[data-i18n="cta.content.content.content.description"]');

        // Test 4: FAQ questions and answers
        const faqQuestions = Array.from(document.querySelectorAll('[data-i18n*="faq.content.content.items"]')).slice(0, 3);

        return {
            startLearning: startLearningElements.map(el => ({
                text: el.textContent,
                dataI18n: el.getAttribute('data-i18n'),
                isRussian: /начать|обучени/i.test(el.textContent)
            })),
            browseCourses: browseCourseElements.map(el => ({
                text: el.textContent,
                dataI18n: el.getAttribute('data-i18n'),
                isRussian: /просмотр|курс/i.test(el.textContent)
            })),
            faq: {
                title: {
                    text: faqTitle?.textContent || '',
                    isRussian: /ответ|вопрос/i.test(faqTitle?.textContent || ''),
                    found: !!faqTitle
                },
                subtitle: {
                    text: faqSubtitle?.textContent || '',
                    isRussian: /часто|вопрос/i.test(faqSubtitle?.textContent || ''),
                    found: !!faqSubtitle
                }
            },
            cta: {
                subtitle: {
                    text: ctaSubtitle?.textContent || '',
                    isRussian: /начните|учиться|сегодня/i.test(ctaSubtitle?.textContent || ''),
                    found: !!ctaSubtitle
                },
                title: {
                    text: ctaTitle?.textContent || '',
                    isRussian: /откройте|мир|возможност/i.test(ctaTitle?.textContent || ''),
                    found: !!ctaTitle
                },
                description: {
                    text: ctaDescription?.textContent.substring(0, 50) || '',
                    isRussian: /трансформировать|карьеру|потенциал/i.test(ctaDescription?.textContent || ''),
                    found: !!ctaDescription
                }
            },
            faqQuestions: faqQuestions.map(el => ({
                text: el.textContent.substring(0, 50),
                dataI18n: el.getAttribute('data-i18n'),
                isRussian: /какие|как|есть|предлагаете/i.test(el.textContent)
            }))
        };
    });

    console.log('📝 START LEARNING ELEMENTS:');
    results.startLearning.forEach((item, i) => {
        const status = item.isRussian ? '✅' : '❌';
        console.log(`  ${status} Element ${i + 1}: "${item.text}" (${item.dataI18n})`);
    });

    console.log('\n📚 BROWSE COURSES ELEMENTS:');
    results.browseCourses.forEach((item, i) => {
        const status = item.isRussian ? '✅' : '❌';
        console.log(`  ${status} Element ${i + 1}: "${item.text}" (${item.dataI18n})`);
    });

    console.log('\n❓ FAQ ELEMENTS:');
    const faqTitleStatus = results.faq.title.isRussian ? '✅' : '❌';
    const faqSubtitleStatus = results.faq.subtitle.isRussian ? '✅' : '❌';
    console.log(`  ${faqTitleStatus} FAQ Title: "${results.faq.title.text}"`);
    console.log(`  ${faqSubtitleStatus} FAQ Subtitle: "${results.faq.subtitle.text}"`);

    console.log('\n🎯 CTA SECTION (Start Learning Today):');
    const ctaSubtitleStatus = results.cta.subtitle.isRussian ? '✅' : '❌';
    const ctaTitleStatus = results.cta.title.isRussian ? '✅' : '❌';
    const ctaDescriptionStatus = results.cta.description.isRussian ? '✅' : '❌';
    console.log(`  ${ctaSubtitleStatus} CTA Subtitle: "${results.cta.subtitle.text}"`);
    console.log(`  ${ctaTitleStatus} CTA Title: "${results.cta.title.text}"`);
    console.log(`  ${ctaDescriptionStatus} CTA Description: "${results.cta.description.text}..."`);

    console.log('\n❓ FAQ QUESTIONS:');
    results.faqQuestions.forEach((item, i) => {
        const status = item.isRussian ? '✅' : '❌';
        console.log(`  ${status} Question ${i + 1}: "${item.text}..." (${item.dataI18n})`);
    });

    // Overall assessment
    const startLearningFixed = results.startLearning.every(item => item.isRussian);
    const browseCoursesFixed = results.browseCourses.every(item => item.isRussian);
    const faqFixed = results.faq.title.isRussian && results.faq.subtitle.isRussian;
    const ctaFixed = results.cta.subtitle.isRussian && results.cta.title.isRussian && results.cta.description.isRussian;
    const faqQuestionsFixed = results.faqQuestions.length > 0 && results.faqQuestions.every(item => item.isRussian);

    const allFixed = startLearningFixed && browseCoursesFixed && faqFixed && ctaFixed;

    console.log('\n📊 SUMMARY:');
    console.log(`  📚 Start Learning buttons: ${startLearningFixed ? 'FIXED' : 'NEEDS FIX'}`);
    console.log(`  🔍 Browse Courses buttons: ${browseCoursesFixed ? 'FIXED' : 'NEEDS FIX'}`);
    console.log(`  ❓ FAQ section: ${faqFixed ? 'FIXED' : 'NEEDS FIX'}`);
    console.log(`  🎯 CTA section: ${ctaFixed ? 'FIXED' : 'NEEDS FIX'}`);
    console.log(`  ❓ FAQ Questions: ${faqQuestionsFixed ? 'FIXED' : 'NEEDS FIX'}`);

    console.log(`\n${allFixed ? '✅ ALL MAJOR TRANSLATIONS FIXED!' : '❌ Some translations still need fixes'}`);

    await browser.close();
    return allFixed;
}

comprehensiveTranslationTest().catch(console.error);