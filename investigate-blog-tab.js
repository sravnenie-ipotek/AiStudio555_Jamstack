const { chromium } = require('playwright');

async function investigateBlogTab() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        console.log('🔍 Starting BlogNew tab investigation...\n');
        
        // Navigate to admin page
        await page.goto('http://localhost:3000/admin-nd.html');
        await page.waitForLoadState('networkidle');
        
        console.log('1. ✅ Page loaded');
        
        // Take initial screenshot
        await page.screenshot({ path: 'initial-page.png', fullPage: true });
        console.log('2. 📸 Initial screenshot saved');
        
        // Wait for tabs to be available
        await page.waitForSelector('.tab-content', { timeout: 10000 });
        
        // Click the BlogNew tab
        console.log('3. 🖱️ Clicking BlogNew tab...');
        await page.click('button:has-text("BlogNew")');
        
        // Wait a moment for any animations/transitions
        await page.waitForTimeout(2000);
        
        // Take screenshot after clicking tab
        await page.screenshot({ path: 'after-blog-click.png', fullPage: true });
        console.log('4. 📸 Screenshot after BlogNew click saved');
        
        // Investigate the blogNew element
        console.log('\n🔍 INVESTIGATING BLOGNEW ELEMENT:');
        
        const blogNewElement = await page.locator('#blogNew');
        
        // Check if element exists
        const exists = await blogNewElement.count() > 0;
        console.log(`   Element exists: ${exists}`);
        
        if (exists) {
            // Get bounding box
            const boundingBox = await blogNewElement.boundingBox();
            console.log(`   Bounding box:`, boundingBox);
            
            // Get computed styles
            const styles = await page.evaluate(() => {
                const element = document.getElementById('blogNew');
                if (!element) return null;
                
                const computed = window.getComputedStyle(element);
                return {
                    display: computed.display,
                    visibility: computed.visibility,
                    opacity: computed.opacity,
                    overflow: computed.overflow,
                    height: computed.height,
                    width: computed.width,
                    position: computed.position,
                    zIndex: computed.zIndex,
                    transform: computed.transform,
                    marginTop: computed.marginTop,
                    marginLeft: computed.marginLeft,
                    paddingTop: computed.paddingTop,
                    paddingLeft: computed.paddingLeft,
                    backgroundColor: computed.backgroundColor,
                    border: computed.border
                };
            });
            
            console.log('   Computed styles:', JSON.stringify(styles, null, 2));
            
            // Check parent elements
            console.log('\n🔍 INVESTIGATING PARENT ELEMENTS:');
            const parentInfo = await page.evaluate(() => {
                const element = document.getElementById('blogNew');
                if (!element) return null;
                
                const parents = [];
                let current = element.parentElement;
                let depth = 0;
                
                while (current && depth < 5) {
                    const computed = window.getComputedStyle(current);
                    parents.push({
                        tagName: current.tagName,
                        id: current.id,
                        className: current.className,
                        display: computed.display,
                        visibility: computed.visibility,
                        opacity: computed.opacity,
                        overflow: computed.overflow,
                        height: computed.height,
                        width: computed.width,
                        position: computed.position,
                        zIndex: computed.zIndex
                    });
                    current = current.parentElement;
                    depth++;
                }
                
                return parents;
            });
            
            console.log('   Parent elements:', JSON.stringify(parentInfo, null, 2));
            
            // Check DOM structure and content
            console.log('\n🔍 INVESTIGATING DOM CONTENT:');
            const domInfo = await page.evaluate(() => {
                const element = document.getElementById('blogNew');
                if (!element) return null;
                
                return {
                    innerHTML: element.innerHTML.substring(0, 500) + '...',
                    childElementCount: element.childElementCount,
                    hasContent: element.innerHTML.trim().length > 0,
                    scrollHeight: element.scrollHeight,
                    scrollWidth: element.scrollWidth,
                    offsetHeight: element.offsetHeight,
                    offsetWidth: element.offsetWidth,
                    clientHeight: element.clientHeight,
                    clientWidth: element.clientWidth
                };
            });
            
            console.log('   DOM info:', JSON.stringify(domInfo, null, 2));
            
            // Check for CSS classes that might be hiding content
            console.log('\n🔍 CHECKING FOR PROBLEMATIC CSS:');
            const cssIssues = await page.evaluate(() => {
                const element = document.getElementById('blogNew');
                if (!element) return null;
                
                const issues = [];
                
                // Check all CSS rules that might affect visibility
                const stylesheets = Array.from(document.styleSheets);
                
                for (const stylesheet of stylesheets) {
                    try {
                        const rules = Array.from(stylesheet.cssRules || stylesheet.rules || []);
                        for (const rule of rules) {
                            if (rule.selectorText && rule.selectorText.includes('blogNew')) {
                                issues.push({
                                    selector: rule.selectorText,
                                    cssText: rule.cssText
                                });
                            }
                        }
                    } catch (e) {
                        // Skip CORS-blocked stylesheets
                    }
                }
                
                return issues;
            });
            
            console.log('   CSS rules affecting blogNew:', JSON.stringify(cssIssues, null, 2));
            
            // Check if there are any tabs with active class
            console.log('\n🔍 CHECKING TAB STATE:');
            const tabState = await page.evaluate(() => {
                const tabButtons = Array.from(document.querySelectorAll('button[data-tab-target]'));
                const tabContents = Array.from(document.querySelectorAll('.tab-content'));
                
                return {
                    buttons: tabButtons.map(btn => ({
                        text: btn.textContent.trim(),
                        target: btn.getAttribute('data-tab-target'),
                        classes: btn.className,
                        active: btn.classList.contains('active')
                    })),
                    contents: tabContents.map(content => ({
                        id: content.id,
                        classes: content.className,
                        active: content.classList.contains('active'),
                        display: window.getComputedStyle(content).display,
                        visibility: window.getComputedStyle(content).visibility
                    }))
                };
            });
            
            console.log('   Tab state:', JSON.stringify(tabState, null, 2));
            
            // Try to force visibility and take another screenshot
            console.log('\n🔧 FORCING VISIBILITY TEST:');
            await page.evaluate(() => {
                const element = document.getElementById('blogNew');
                if (element) {
                    element.style.display = 'block';
                    element.style.visibility = 'visible';
                    element.style.opacity = '1';
                    element.style.height = 'auto';
                    element.style.width = 'auto';
                    element.style.position = 'relative';
                    element.style.zIndex = '999';
                    element.style.backgroundColor = 'red'; // Make it obvious
                    element.style.padding = '20px';
                    element.style.border = '3px solid blue';
                }
            });
            
            await page.waitForTimeout(1000);
            await page.screenshot({ path: 'forced-visibility.png', fullPage: true });
            console.log('   📸 Forced visibility screenshot saved');
            
            // Check dimensions after forcing visibility
            const forcedBoundingBox = await blogNewElement.boundingBox();
            console.log(`   Bounding box after forcing visibility:`, forcedBoundingBox);
        }
        
        console.log('\n✅ Investigation complete! Check the screenshots and logs above.');
        
    } catch (error) {
        console.error('❌ Error during investigation:', error);
    } finally {
        await browser.close();
    }
}

investigateBlogTab();
