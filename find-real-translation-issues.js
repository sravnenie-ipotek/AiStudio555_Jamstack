const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    console.log('🔍 Finding REAL Translation Issues...\n');

    try {
        // First, get the actual content from the API
        console.log('📊 Checking API for Russian content...');
        const apiResponse = await fetch('http://localhost:3000/api/nd/home-page?locale=ru');
        const apiData = await apiResponse.json();

        // Find any English text in Russian API response
        const englishInRussian = [];

        function findEnglishText(obj, path = '') {
            for (let key in obj) {
                if (typeof obj[key] === 'string') {
                    // Check if text looks like English (has mostly Latin characters)
                    const text = obj[key];
                    const latinChars = (text.match(/[a-zA-Z]/g) || []).length;
                    const totalChars = text.replace(/[\s\d\W]/g, '').length;

                    if (totalChars > 3 && latinChars / totalChars > 0.8) {
                        englishInRussian.push({
                            path: `${path}.${key}`,
                            text: text
                        });
                    }
                } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                    findEnglishText(obj[key], path ? `${path}.${key}` : key);
                }
            }
        }

        findEnglishText(apiData.data);

        if (englishInRussian.length > 0) {
            console.log('\n❌ Found English text in Russian API:');
            englishInRussian.forEach(item => {
                console.log(`   Path: ${item.path}`);
                console.log(`   Text: "${item.text}"\n`);
            });
        } else {
            console.log('✅ No obvious English text in Russian API response\n');
        }

        // Now load the actual page and scan it
        await page.goto('http://localhost:3005/home.html?locale=ru');
        await page.waitForTimeout(5000);

        // Scan the actual page for English text
        console.log('🔍 Scanning actual page for English text...\n');

        const pageIssues = await page.evaluate(() => {
            const issues = [];
            const englishPattern = /^[a-zA-Z\s\.,!?\-'"]+$/;

            // Function to check if text is mostly English
            function isEnglishText(text) {
                if (!text || text.length < 3) return false;
                const cleanText = text.trim();
                const latinChars = (cleanText.match(/[a-zA-Z]/g) || []).length;
                const totalChars = cleanText.replace(/[\s\d\W]/g, '').length;
                return totalChars > 3 && latinChars / totalChars > 0.8;
            }

            // Scan all text nodes
            const walker = document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: function(node) {
                        // Skip script and style content
                        if (node.parentElement.tagName === 'SCRIPT' ||
                            node.parentElement.tagName === 'STYLE' ||
                            node.parentElement.tagName === 'NOSCRIPT') {
                            return NodeFilter.FILTER_REJECT;
                        }
                        return NodeFilter.FILTER_ACCEPT;
                    }
                }
            );

            let node;
            while (node = walker.nextNode()) {
                const text = node.textContent.trim();
                if (isEnglishText(text) && text.length > 10) {
                    const parent = node.parentElement;
                    const rect = parent.getBoundingClientRect();

                    issues.push({
                        text: text.substring(0, 100),
                        element: parent.tagName,
                        className: parent.className,
                        id: parent.id,
                        dataI18n: parent.getAttribute('data-i18n'),
                        visible: rect.width > 0 && rect.height > 0,
                        position: {
                            x: rect.x,
                            y: rect.y,
                            width: rect.width,
                            height: rect.height
                        }
                    });

                    // Highlight the element
                    parent.style.border = '3px solid red';
                    parent.style.backgroundColor = 'rgba(255, 255, 0, 0.3)';
                }
            }

            return issues;
        });

        if (pageIssues.length > 0) {
            console.log(`❌ Found ${pageIssues.length} English text elements on Russian page:\n`);

            // Group by visibility
            const visible = pageIssues.filter(i => i.visible);
            const hidden = pageIssues.filter(i => !i.visible);

            if (visible.length > 0) {
                console.log('🔴 VISIBLE English text (these are the real problems):');
                visible.forEach((issue, i) => {
                    console.log(`\n   ${i + 1}. "${issue.text}"`);
                    console.log(`      Element: <${issue.element}${issue.className ? '.' + issue.className : ''}>`);
                    console.log(`      Position: ${Math.round(issue.position.y)}px from top`);
                    if (issue.dataI18n) {
                        console.log(`      data-i18n: ${issue.dataI18n}`);
                    }
                });
            }

            if (hidden.length > 0) {
                console.log('\n⚠️ Hidden/Off-screen English text:');
                hidden.forEach(issue => {
                    console.log(`   - "${issue.text.substring(0, 50)}..."`);
                });
            }

            // Inject visual markers
            console.log('\n🎯 Injecting visual markers...');

            await page.evaluate((issues) => {
                // Create marker container
                const container = document.createElement('div');
                container.id = 'translation-markers';
                container.style.cssText = `
                    position: fixed;
                    top: 10px;
                    right: 10px;
                    background: white;
                    border: 2px solid red;
                    border-radius: 10px;
                    padding: 15px;
                    z-index: 99999;
                    max-width: 300px;
                    max-height: 400px;
                    overflow-y: auto;
                    box-shadow: 0 0 20px rgba(0,0,0,0.3);
                `;

                container.innerHTML = `
                    <h3 style="margin: 0 0 10px 0; color: red;">🔴 Translation Issues Found!</h3>
                    <div style="font-size: 12px; color: #666; margin-bottom: 10px;">
                        Click items to scroll to them
                    </div>
                `;

                const list = document.createElement('div');

                issues.forEach((issue, i) => {
                    if (issue.visible) {
                        const item = document.createElement('div');
                        item.style.cssText = `
                            background: #fff3cd;
                            border: 1px solid #ffc107;
                            border-radius: 5px;
                            padding: 8px;
                            margin: 5px 0;
                            cursor: pointer;
                            font-size: 12px;
                        `;
                        item.innerHTML = `
                            <strong>#${i + 1}</strong>: "${issue.text.substring(0, 30)}..."<br>
                            <span style="color: #666; font-size: 10px;">Position: ${Math.round(issue.position.y)}px</span>
                        `;

                        item.onclick = () => {
                            // Find and scroll to element
                            const elements = document.querySelectorAll('*');
                            for (let el of elements) {
                                if (el.textContent.includes(issue.text)) {
                                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    // Flash the element
                                    el.style.animation = 'flash 2s';
                                    setTimeout(() => {
                                        el.style.animation = '';
                                    }, 2000);
                                    break;
                                }
                            }
                        };

                        list.appendChild(item);
                    }
                });

                container.appendChild(list);
                document.body.appendChild(container);

                // Add flash animation
                const style = document.createElement('style');
                style.innerHTML = `
                    @keyframes flash {
                        0%, 50%, 100% { background-color: rgba(255, 255, 0, 0.3); }
                        25%, 75% { background-color: rgba(255, 0, 0, 0.5); }
                    }
                `;
                document.head.appendChild(style);
            }, pageIssues.filter(i => i.visible));

            // Take screenshot
            await page.screenshot({ path: 'real-translation-issues.png', fullPage: true });
            console.log('\n📸 Screenshot saved showing highlighted issues');

        } else {
            console.log('✅ No English text found on the Russian page!');
            console.log('   The page appears to be fully translated.');
        }

        // Also check for common translation issues
        console.log('\n🔍 Checking for other common issues...');

        const commonIssues = await page.evaluate(() => {
            const issues = [];

            // Check for Lorem Ipsum
            if (document.body.textContent.includes('Lorem ipsum')) {
                issues.push('Found Lorem Ipsum placeholder text');
            }

            // Check for untranslated buttons
            const buttons = document.querySelectorAll('button, .button, [class*="btn"]');
            buttons.forEach(btn => {
                const text = btn.textContent.trim();
                if (/^[A-Z][a-z]+(\s[A-Z][a-z]+)*$/.test(text)) {
                    issues.push(`Button with English text: "${text}"`);
                }
            });

            // Check for $ prices (should be ₽ for Russian)
            const priceElements = Array.from(document.querySelectorAll('*')).filter(el =>
                el.textContent.includes('$') && !el.querySelector('*')
            );
            if (priceElements.length > 0) {
                issues.push(`Found ${priceElements.length} elements with $ symbol (should be ₽ for Russian)`);
            }

            return issues;
        });

        if (commonIssues.length > 0) {
            console.log('\n⚠️ Common translation issues:');
            commonIssues.forEach(issue => {
                console.log(`   - ${issue}`);
            });
        }

    } catch (error) {
        console.error('❌ Error:', error);
    }

    console.log('\n✨ Analysis complete!');
    console.log('   - Red borders = English text on Russian page');
    console.log('   - Yellow background = Translation needed');
    console.log('   - Marker panel = Click to navigate to issues');
    console.log('\n⏸️ Browser stays open for inspection...');

    await page.waitForTimeout(60000);
    await browser.close();
})();