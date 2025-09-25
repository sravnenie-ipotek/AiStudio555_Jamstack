const puppeteer = require('puppeteer');

async function findHebrewSource() {
    console.log('Finding source of Hebrew content in career-center.html');
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
        await page.goto('http://localhost:3005/career-center.html?locale=he', {
            waitUntil: 'networkidle2'
        });
        
        await page.waitForTimeout(2000);
        
        console.log('\n1. Finding Hebrew elements...');
        const hebrewElements = await page.evaluate(() => {
            const elements = [];
            document.querySelectorAll('*').forEach(el => {
                const text = el.textContent;
                if (text && /[\u0590-\u05FF]/.test(text)) {
                    elements.push({
                        tag: el.tagName,
                        text: text.substring(0, 100),
                        hasDataI18n: el.hasAttribute('data-i18n'),
                        dataI18nKey: el.getAttribute('data-i18n'),
                        id: el.id,
                        className: el.className
                    });
                }
            });
            return elements.slice(0, 10);
        });
        
        console.log('Hebrew elements found:');
        hebrewElements.forEach((el, index) => {
            console.log(index + 1 + ':', el.tag, el.hasDataI18n ? '(has data-i18n: ' + el.dataI18nKey + ')' : '(no data-i18n)');
            console.log('   Text:', el.text);
            console.log('   ID:', el.id || 'none');
            console.log('   Class:', el.className || 'none');
            console.log('---');
        });
        
        console.log('\n2. Checking translation manager state...');
        const managerState = await page.evaluate(() => {
            if (window.unifiedLanguageManager) {
                return {
                    currentLocale: window.unifiedLanguageManager.currentLocale,
                    hasTranslations: Object.keys(window.unifiedLanguageManager.translations || {}).length,
                    translationKeys: Object.keys(window.unifiedLanguageManager.translations || {}).slice(0, 5)
                };
            }
            return { notFound: true };
        });
        
        console.log('Language manager state:', managerState);
        
        console.log('\n3. Testing specific elements...');
        const breadcrumbTest = await page.evaluate(() => {
            const breadcrumb = document.querySelector('[data-i18n="breadcrumb.home"]');
            return {
                exists: !!breadcrumb,
                text: breadcrumb ? breadcrumb.textContent : null,
                originalText: breadcrumb ? breadcrumb.getAttribute('data-original') : null
            };
        });
        
        console.log('Breadcrumb test:', breadcrumbTest);
        
    } catch (error) {
        console.error('Error:', error.message);
    }
    
    await browser.close();
}

findHebrewSource().catch(console.error);
