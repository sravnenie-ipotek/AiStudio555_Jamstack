const { chromium } = require('playwright');

async function debugLanguageSwitchers() {
    console.log('🔍 DEBUG: Language Switcher Elements Detection');
    console.log('Testing URL: http://localhost:3005/en/home.html');
    console.log('================================================================');

    const browser = await chromium.launch({ headless: false, slowMo: 2000 });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1920, height: 1080 });

    try {
        await page.goto('http://localhost:3005/en/home.html', {
            waitUntil: 'networkidle',
            timeout: 30000
        });

        await page.waitForTimeout(5000);

        // Debug all language-related elements
        const languageElements = await page.evaluate(() => {
            // Find all elements with language-related IDs or classes
            const selectors = [
                '#language-switcher',
                '.language-switcher',
                '[id*="language"]',
                '[class*="language"]',
                '[class*="lang"]',
                'select',
                '[onchange*="switchLanguage"]',
                '*:contains("English")',
                '*:contains("Russian")',
                '*:contains("עברית")'
            ];

            const results = [];

            // Check each selector
            selectors.forEach(selector => {
                try {
                    const elements = document.querySelectorAll(selector);
                    elements.forEach((el, index) => {
                        const rect = el.getBoundingClientRect();
                        results.push({
                            selector: selector,
                            index: index,
                            tagName: el.tagName,
                            id: el.id,
                            className: el.className,
                            textContent: el.textContent.trim().substring(0, 50),
                            innerHTML: el.innerHTML.substring(0, 100),
                            visible: rect.width > 0 && rect.height > 0,
                            position: {
                                x: rect.x,
                                y: rect.y,
                                width: rect.width,
                                height: rect.height
                            },
                            parent: el.parentElement ? el.parentElement.tagName + (el.parentElement.className ? '.' + el.parentElement.className : '') : null
                        });
                    });
                } catch (e) {
                    // Selector might not be valid (like :contains)
                }
            });

            // Special check for all elements containing language text
            const allElements = document.querySelectorAll('*');
            allElements.forEach(el => {
                const text = el.textContent.trim();
                if ((text.includes('English') || text.includes('Russian') || text.includes('עברית') || text.includes('Русский')) &&
                    text.length < 200 && el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE') {

                    const rect = el.getBoundingClientRect();
                    if (rect.width > 0 && rect.height > 0) {
                        results.push({
                            selector: 'text-search',
                            index: 0,
                            tagName: el.tagName,
                            id: el.id,
                            className: el.className,
                            textContent: text.substring(0, 50),
                            innerHTML: el.innerHTML.substring(0, 100),
                            visible: true,
                            position: {
                                x: rect.x,
                                y: rect.y,
                                width: rect.width,
                                height: rect.height
                            },
                            parent: el.parentElement ? el.parentElement.tagName + (el.parentElement.className ? '.' + el.parentElement.className : '') : null
                        });
                    }
                }
            });

            return results;
        });

        console.log('🔍 Found Language-Related Elements:');
        console.log('================================================================');

        languageElements.forEach((element, i) => {
            console.log(`\n${i + 1}. ${element.tagName} (${element.selector})`);
            console.log(`   ID: ${element.id || 'none'}`);
            console.log(`   Class: ${element.className || 'none'}`);
            console.log(`   Text: "${element.textContent}"`);
            console.log(`   Visible: ${element.visible ? '✅' : '❌'}`);
            console.log(`   Position: x:${Math.round(element.position.x)}, y:${Math.round(element.position.y)}, w:${Math.round(element.position.width)}, h:${Math.round(element.position.height)}`);
            console.log(`   Parent: ${element.parent || 'unknown'}`);
            if (element.innerHTML && element.innerHTML.length > 10) {
                console.log(`   HTML: ${element.innerHTML}`);
            }
        });

        // Check specifically for overlapping elements
        const visibleLanguageElements = languageElements.filter(el => el.visible);
        console.log('\n🔍 Checking for Overlapping Elements:');
        console.log('================================================================');

        for (let i = 0; i < visibleLanguageElements.length; i++) {
            for (let j = i + 1; j < visibleLanguageElements.length; j++) {
                const el1 = visibleLanguageElements[i];
                const el2 = visibleLanguageElements[j];

                // Check if elements overlap
                const overlap = !(el1.position.x + el1.position.width < el2.position.x ||
                                 el2.position.x + el2.position.width < el1.position.x ||
                                 el1.position.y + el1.position.height < el2.position.y ||
                                 el2.position.y + el2.position.height < el1.position.y);

                if (overlap) {
                    console.log(`⚠️  OVERLAP DETECTED:`);
                    console.log(`   Element 1: ${el1.tagName}#${el1.id} - "${el1.textContent}"`);
                    console.log(`   Element 2: ${el2.tagName}#${el2.id} - "${el2.textContent}"`);
                    console.log(`   Position 1: ${Math.round(el1.position.x)},${Math.round(el1.position.y)} ${Math.round(el1.position.width)}x${Math.round(el1.position.height)}`);
                    console.log(`   Position 2: ${Math.round(el2.position.x)},${Math.round(el2.position.y)} ${Math.round(el2.position.width)}x${Math.round(el2.position.height)}`);
                }
            }
        }

        // Take screenshot for reference
        const screenshotPath = '/Users/michaelmishayev/Desktop/newCode/debug-language-switchers.png';
        await page.screenshot({ path: screenshotPath, fullPage: false });
        console.log(`\n📸 Screenshot saved: ${screenshotPath}`);

    } catch (error) {
        console.error('❌ Debug failed:', error.message);
    } finally {
        await browser.close();
    }
}

debugLanguageSwitchers().catch(console.error);