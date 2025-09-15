const playwright = require('playwright');

(async () => {
    console.log('🔵 QA Testing: Hebrew Menu Issues Diagnosis');
    console.log('===============================================\n');

    const browser = await playwright.chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    // Set viewport for desktop testing
    await page.setViewportSize({ width: 1280, height: 720 });
    
    try {
        console.log('📍 Navigating to Hebrew courses page...');
        await page.goto('http://localhost:3005/he/courses.html');
        
        // Wait for menu to load
        await page.waitForSelector('#shared-menu-container', { timeout: 10000 });
        await page.waitForTimeout(2000); // Allow menu to fully render
        
        console.log('\n🔍 ISSUE 1: Double Menu Diagnosis');
        console.log('=====================================');
        
        // Check for multiple navigation elements
        const navElements = await page.$$eval('nav', navs => 
            navs.map((nav, index) => ({
                index,
                id: nav.id || 'no-id',
                className: nav.className || 'no-class',
                visible: nav.offsetHeight > 0,
                innerHTML: nav.innerHTML.substring(0, 100) + '...'
            }))
        );
        
        console.log(`Found ${navElements.length} <nav> elements:`);
        navElements.forEach(nav => {
            console.log(`  Nav ${nav.index}: id="${nav.id}", class="${nav.className}", visible=${nav.visible}`);
        });
        
        // Check for multiple menu containers
        const menuContainers = await page.$$eval('[class*="menu"], [class*="nav"], [id*="menu"], [id*="nav"]', elements =>
            elements.map((el, index) => ({
                index,
                tag: el.tagName.toLowerCase(),
                id: el.id || 'no-id',
                className: el.className || 'no-class',
                visible: el.offsetHeight > 0,
                position: {
                    top: el.offsetTop,
                    height: el.offsetHeight
                }
            }))
        );
        
        console.log(`\nFound ${menuContainers.length} menu-related elements:`);
        menuContainers.forEach(container => {
            if (container.visible) {
                console.log(`  ${container.tag}: id="${container.id}", class="${container.className}"`);
                console.log(`    Position: top=${container.position.top}px, height=${container.position.height}px`);
            }
        });
        
        // Check for duplicate shared-menu-container content
        const sharedMenuContent = await page.$eval('#shared-menu-container', el => ({
            innerHTML: el.innerHTML.length,
            childCount: el.children.length,
            hasMultipleNavs: el.querySelectorAll('nav').length > 1
        }));
        
        console.log(`\nShared Menu Container Analysis:`);
        console.log(`  HTML Length: ${sharedMenuContent.innerHTML} characters`);
        console.log(`  Child Elements: ${sharedMenuContent.childCount}`);
        console.log(`  Multiple Navs Inside: ${sharedMenuContent.hasMultipleNavs}`);
        
        console.log('\n🔍 ISSUE 2: Career Dropdown Positioning Diagnosis');
        console.log('==================================================');
        
        // Find the Career Services button
        const careerButton = await page.$('[class*="dropdown"]:has-text("שירותי קריירה"), a:has-text("שירותי קריירה")');
        if (!careerButton) {
            console.log('❌ Career Services button not found');
        } else {
            console.log('✅ Career Services button found');
            
            // Get button position before click
            const buttonPosition = await careerButton.boundingBox();
            console.log(`Button position: x=${buttonPosition.x}, y=${buttonPosition.y}, width=${buttonPosition.width}, height=${buttonPosition.height}`);
            
            // Click the button to open dropdown
            await careerButton.click();
            await page.waitForTimeout(500);
            
            // Find the dropdown menu
            const dropdown = await page.$('.dropdown-list, [class*="dropdown-list"], [class*="dropdown-menu"]');
            if (!dropdown) {
                console.log('❌ Dropdown menu not found after click');
                
                // Check for any new elements that appeared
                const newElements = await page.$$eval('[style*="display: block"], [style*="visibility: visible"]', elements =>
                    elements.map(el => ({
                        tag: el.tagName.toLowerCase(),
                        className: el.className,
                        position: el.getBoundingClientRect()
                    }))
                );
                console.log('Elements that became visible after click:', newElements);
            } else {
                console.log('✅ Dropdown menu found');
                
                const dropdownPosition = await dropdown.boundingBox();
                console.log(`Dropdown position: x=${dropdownPosition.x}, y=${dropdownPosition.y}, width=${dropdownPosition.width}, height=${dropdownPosition.height}`);
                
                // Calculate the distance between button and dropdown
                const horizontalDistance = Math.abs(dropdownPosition.x - buttonPosition.x);
                const verticalDistance = dropdownPosition.y - (buttonPosition.y + buttonPosition.height);
                
                console.log(`Distance Analysis:`);
                console.log(`  Horizontal offset: ${horizontalDistance}px`);
                console.log(`  Vertical gap: ${verticalDistance}px`);
                
                if (horizontalDistance > 50) {
                    console.log('⚠️  ISSUE: Dropdown is horizontally misaligned (should be <50px offset)');
                }
                if (verticalDistance > 10) {
                    console.log('⚠️  ISSUE: Dropdown is too far vertically (should be <10px gap)');
                }
                
                // Check CSS styles affecting positioning
                const dropdownStyles = await dropdown.evaluate(el => {
                    const styles = window.getComputedStyle(el);
                    return {
                        position: styles.position,
                        top: styles.top,
                        left: styles.left,
                        right: styles.right,
                        transform: styles.transform,
                        zIndex: styles.zIndex
                    };
                });
                
                console.log('Dropdown CSS styles:', dropdownStyles);
            }
        }
        
        console.log('\n🔍 JavaScript Console Errors Check');
        console.log('===================================');
        
        // Check for JavaScript errors
        const errors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
            }
        });
        
        // Reload to catch any initialization errors
        await page.reload();
        await page.waitForTimeout(3000);
        
        if (errors.length > 0) {
            console.log('❌ JavaScript errors found:');
            errors.forEach((error, index) => {
                console.log(`  ${index + 1}. ${error}`);
            });
        } else {
            console.log('✅ No JavaScript errors detected');
        }
        
        console.log('\n🔍 Script Loading Analysis');
        console.log('===========================');
        
        // Check which scripts are loaded
        const scripts = await page.$$eval('script[src]', scripts =>
            scripts.map(script => ({
                src: script.src,
                loaded: script.complete !== false
            }))
        );
        
        const menuScripts = scripts.filter(script => 
            script.src.includes('menu') || script.src.includes('nav')
        );
        
        console.log('Menu-related scripts:');
        menuScripts.forEach(script => {
            console.log(`  ${script.loaded ? '✅' : '❌'} ${script.src}`);
        });
        
        // Take a screenshot for visual inspection
        await page.screenshot({ 
            path: '/Users/michaelmishayev/Desktop/newCode/hebrew-menu-issues-diagnosis.png',
            fullPage: true 
        });
        console.log('\n📸 Screenshot saved: hebrew-menu-issues-diagnosis.png');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        await browser.close();
    }
})();
