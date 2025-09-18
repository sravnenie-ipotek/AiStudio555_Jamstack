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
        
        // Wait for tabs to be available (use the actual tab selector)
        await page.waitForSelector('.tab[data-tab="blogNew"]', { timeout: 10000 });
        
        // Take screenshot of initial state
        await page.screenshot({ path: 'before-click.png', fullPage: true });
        
        // Click the BlogNew tab
        console.log('3. 🖱️ Clicking BlogNew tab...');
        await page.click('.tab[data-tab="blogNew"]');
        
        // Wait a moment for any animations/transitions
        await page.waitForTimeout(3000);
        
        // Take screenshot after clicking tab
        await page.screenshot({ path: 'after-blog-click.png', fullPage: true });
        console.log('4. 📸 Screenshot after BlogNew click saved');
        
        // Run some of the debug functions already in the page
        console.log('\n🔧 Running built-in debug functions...');
        
        // Run the debug function that's already in the page
        await page.evaluate(() => {
            if (typeof window.debugBlogNewStatus === 'function') {
                window.debugBlogNewStatus();
            }
            if (typeof window.makeContentVisible === 'function') {
                window.makeContentVisible();
            }
            if (typeof window.debugVisibilityIssues === 'function') {
                window.debugVisibilityIssues();
            }
        });
        
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
            
            // Get all relevant elements and their properties
            const elementInfo = await page.evaluate(() => {
                const blogNew = document.getElementById('blogNew');
                const adminCard = document.querySelector('.admin-card');
                const tabs = document.querySelector('.tabs');
                
                if (!blogNew) return { error: 'blogNew element not found' };
                
                const getElementInfo = (el, name) => {
                    if (!el) return { name, exists: false };
                    
                    const computed = window.getComputedStyle(el);
                    const rect = el.getBoundingClientRect();
                    
                    return {
                        name,
                        exists: true,
                        tagName: el.tagName,
                        id: el.id,
                        className: el.className,
                        innerHTML: el.innerHTML.substring(0, 200) + '...',
                        computed: {
                            display: computed.display,
                            visibility: computed.visibility,
                            opacity: computed.opacity,
                            position: computed.position,
                            top: computed.top,
                            left: computed.left,
                            width: computed.width,
                            height: computed.height,
                            overflow: computed.overflow,
                            zIndex: computed.zIndex,
                            transform: computed.transform
                        },
                        rect: {
                            x: rect.x,
                            y: rect.y,
                            width: rect.width,
                            height: rect.height,
                            top: rect.top,
                            bottom: rect.bottom,
                            left: rect.left,
                            right: rect.right
                        },
                        dimensions: {
                            scrollHeight: el.scrollHeight,
                            scrollWidth: el.scrollWidth,
                            offsetHeight: el.offsetHeight,
                            offsetWidth: el.offsetWidth,
                            clientHeight: el.clientHeight,
                            clientWidth: el.clientWidth
                        }
                    };
                };
                
                return {
                    blogNew: getElementInfo(blogNew, 'blogNew'),
                    adminCard: getElementInfo(adminCard, 'adminCard'),
                    tabs: getElementInfo(tabs, 'tabs'),
                    parent: getElementInfo(blogNew.parentElement, 'parent'),
                    tableContainer: getElementInfo(blogNew.querySelector('.table-container'), 'tableContainer'),
                    table: getElementInfo(blogNew.querySelector('table'), 'table'),
                    tbody: getElementInfo(blogNew.querySelector('#blogNew-table-body'), 'tbody')
                };
            });
            
            console.log('   Element analysis:', JSON.stringify(elementInfo, null, 2));
            
            // Check what elements are actually visible on screen
            console.log('\n🔍 CHECKING VISIBLE ELEMENTS:');
            const visibleElements = await page.evaluate(() => {
                const elements = document.querySelectorAll('*');
                const visible = [];
                
                for (let el of elements) {
                    const rect = el.getBoundingClientRect();
                    if (rect.width > 0 && rect.height > 0 && 
                        rect.top >= 0 && rect.left >= 0 && 
                        rect.bottom <= window.innerHeight && rect.right <= window.innerWidth) {
                        const computed = window.getComputedStyle(el);
                        if (computed.display !== 'none' && computed.visibility !== 'hidden' && computed.opacity !== '0') {
                            visible.push({
                                tagName: el.tagName,
                                id: el.id,
                                className: el.className,
                                rect: {
                                    width: Math.round(rect.width),
                                    height: Math.round(rect.height),
                                    top: Math.round(rect.top),
                                    left: Math.round(rect.left)
                                }
                            });
                        }
                    }
                }
                
                return visible.filter(el => 
                    el.id.includes('blog') || 
                    el.className.includes('blog') || 
                    el.className.includes('tab') ||
                    el.className.includes('content')
                );
            });
            
            console.log('   Visible blog/tab related elements:', JSON.stringify(visibleElements, null, 2));
            
            // Try to scroll to the element
            console.log('\n🔧 SCROLLING TO ELEMENT:');
            await page.evaluate(() => {
                const blogNew = document.getElementById('blogNew');
                if (blogNew) {
                    blogNew.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
            
            await page.waitForTimeout(2000);
            await page.screenshot({ path: 'after-scroll.png', fullPage: true });
            console.log('   📸 Screenshot after scroll saved');
            
            // Final bounding box check
            const finalBoundingBox = await blogNewElement.boundingBox();
            console.log(`   Final bounding box:`, finalBoundingBox);
            
            // Try the nuclear option from the existing debug functions
            console.log('\n🚨 APPLYING NUCLEAR VISIBILITY FIX:');
            await page.evaluate(() => {
                // Run the nuclearVisibilityFix function if it exists
                if (typeof window.nuclearVisibilityFix === 'function') {
                    window.nuclearVisibilityFix();
                }
                
                // Manual nuclear fix
                const blogNew = document.getElementById('blogNew');
                if (blogNew) {
                    blogNew.style.cssText = `
                        display: block !important;
                        visibility: visible !important;
                        opacity: 1 !important;
                        position: relative !important;
                        z-index: 999 !important;
                        background: red !important;
                        min-height: 500px !important;
                        width: 100% !important;
                        padding: 20px !important;
                        margin: 20px 0 !important;
                        border: 5px solid blue !important;
                    `;
                    blogNew.classList.add('active');
                }
            });
            
            await page.waitForTimeout(2000);
            await page.screenshot({ path: 'nuclear-fix.png', fullPage: true });
            console.log('   📸 Nuclear fix screenshot saved');
            
            const nuclearBoundingBox = await blogNewElement.boundingBox();
            console.log(`   Nuclear fix bounding box:`, nuclearBoundingBox);
        }
        
        console.log('\n✅ Investigation complete! Check the screenshots and logs above.');
        
    } catch (error) {
        console.error('❌ Error during investigation:', error);
        await page.screenshot({ path: 'error-state.png', fullPage: true });
    } finally {
        await browser.close();
    }
}

investigateBlogTab();
