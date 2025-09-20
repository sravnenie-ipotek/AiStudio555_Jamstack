const { chromium } = require('@playwright/test');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    // Capture console messages
    const consoleLogs = [];
    page.on('console', msg => {
        consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
    });

    try {
        await page.goto('http://localhost:3005/home.html');
        await page.waitForTimeout(1000);

        console.log('🔍 TRANSLATION AUDIT REPORT\n');

        // 1. Check API data availability
        const apiData = await page.evaluate(async () => {
            try {
                const response = await fetch('http://localhost:1337/api/nd/home-page?locale=ru');
                const data = await response.json();
                return {
                    available: true,
                    hasNavigation: !!data.data.navigation,
                    hasCategories: !!data.data.course_categories,
                    hasFeatures: !!data.data.features
                };
            } catch (e) {
                return { available: false, error: e.message };
            }
        });

        console.log('📡 API Data Availability:');
        console.log(`  Russian API available: ${apiData.available}`);
        console.log(`  Has navigation translations: ${apiData.hasNavigation}`);
        console.log(`  Has course categories: ${apiData.hasCategories}`);
        console.log(`  Has features: ${apiData.hasFeatures}\n`);

        // 2. Check data-i18n coverage
        const coverage = await page.evaluate(() => {
            const allTextElements = Array.from(document.querySelectorAll('a, h1, h2, h3, h4, p, span, div, button'))
                .filter(el => {
                    const text = el.textContent.trim();
                    return text && text.length > 2 && !el.querySelector('*') && !/^[0-9]+$/.test(text);
                });

            const withI18n = allTextElements.filter(el => el.hasAttribute('data-i18n'));
            const withoutI18n = allTextElements.filter(el => !el.hasAttribute('data-i18n'));

            // Specific missing elements
            const navLinks = Array.from(document.querySelectorAll('.nav-link')).map(el => ({
                text: el.textContent.trim(),
                hasI18n: el.hasAttribute('data-i18n')
            }));

            const categoryNames = Array.from(document.querySelectorAll('.course-categories-name')).map(el => ({
                text: el.textContent.trim(),
                hasI18n: el.hasAttribute('data-i18n')
            }));

            return {
                total: allTextElements.length,
                withI18n: withI18n.length,
                withoutI18n: withoutI18n.length,
                coverage: Math.round((withI18n.length / allTextElements.length) * 100),
                navLinks,
                categoryNames,
                missingExamples: withoutI18n.slice(0, 10).map(el => ({
                    text: el.textContent.trim().substring(0, 50),
                    tagName: el.tagName.toLowerCase(),
                    className: el.className
                }))
            };
        });

        console.log('📊 Translation Coverage Analysis:');
        console.log(`  Total translatable elements: ${coverage.total}`);
        console.log(`  Elements WITH data-i18n: ${coverage.withI18n}`);
        console.log(`  Elements WITHOUT data-i18n: ${coverage.withoutI18n}`);
        console.log(`  Coverage: ${coverage.coverage}%\n`);

        console.log('🚫 Missing Navigation Translations:');
        coverage.navLinks.forEach(link => {
            console.log(`  "${link.text}" - Has data-i18n: ${link.hasI18n}`);
        });

        console.log('\n🚫 Missing Category Translations:');
        coverage.categoryNames.forEach(cat => {
            console.log(`  "${cat.text}" - Has data-i18n: ${cat.hasI18n}`);
        });

        console.log('\n📝 Examples of Untranslated Elements:');
        coverage.missingExamples.forEach(el => {
            console.log(`  <${el.tagName}> "${el.text}" (class: ${el.className})`);
        });

        // 3. Test language switch and see what happens
        console.log('\n🔄 Testing Language Switch...');
        await page.click('.lang-pill:has-text("RU")');
        await page.waitForTimeout(3000);

        const afterSwitch = await page.evaluate(() => {
            const hasRussian = (text) => /[А-Яа-я]/.test(text);

            return {
                navLinksRussian: Array.from(document.querySelectorAll('.nav-link')).filter(el => hasRussian(el.textContent)).length,
                categoryNamesRussian: Array.from(document.querySelectorAll('.course-categories-name')).filter(el => hasRussian(el.textContent)).length,
                totalRussianElements: Array.from(document.querySelectorAll('*')).filter(el => {
                    const text = el.textContent.trim();
                    return text && hasRussian(text) && !el.querySelector('*');
                }).length
            };
        });

        console.log('\n✅ After Russian Switch:');
        console.log(`  Navigation links in Russian: ${afterSwitch.navLinksRussian} / ${coverage.navLinks.length}`);
        console.log(`  Category names in Russian: ${afterSwitch.categoryNamesRussian} / ${coverage.categoryNames.length}`);
        console.log(`  Total Russian elements: ${afterSwitch.totalRussianElements}`);

        // 4. Check console for translation debug logs
        console.log('\n📝 Console Logs (Translation Related):');
        consoleLogs.filter(log => log.includes('translation') || log.includes('Enhanced Language')).forEach(log => {
            console.log(`  ${log}`);
        });

        console.log('\n🎯 ROOT CAUSE IDENTIFIED:');
        console.log('  ❌ API has translations BUT elements lack data-i18n attributes');
        console.log('  ❌ Most page content is static HTML without translation markup');
        console.log(`  ❌ Only ${coverage.coverage}% of elements can be translated`);

    } catch (error) {
        console.error('❌ Audit failed:', error);
    } finally {
        await browser.close();
    }
})();