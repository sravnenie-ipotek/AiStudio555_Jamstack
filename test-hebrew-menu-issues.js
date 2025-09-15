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
        const navCount = await page.$$eval('nav', navs => navs.length);
        console.log(`Found ${navCount} <nav> elements`);
        
        if (navCount > 1) {
            const navElements = await page.$$eval('nav', navs => 
                navs.map((nav, i) => ({
                    index: i,
                    id: nav.id || 'no-id',
                    className: nav.className || 'no-class',
                    visible: nav.offsetHeight > 0,
                    top: nav.offsetTop,
                    height: nav.offsetHeight
                }))
            );
            
            navElements.forEach(nav => {
                console.log(`  Nav ${nav.index}: id="${nav.id}", visible=${nav.visible}, top=${nav.top}px`);
            });
        }
        
        // Check shared menu container content
        const menuInfo = await page.$eval('#shared-menu-container', el => ({
            childCount: el.children.length,
            hasMultipleNavs: el.querySelectorAll('nav').length > 1,
            innerHTML: el.innerHTML.substring(0, 200)
        }));
        
        console.log(`\nShared Menu Container Analysis:`);
        console.log(`  Child Elements: ${menuInfo.childCount}`);
        console.log(`  Multiple Navs Inside: ${menuInfo.hasMultipleNavs}`);
        
        console.log('\n🔍 ISSUE 2: Career Dropdown Positioning Diagnosis');
        console.log('==================================================');
        
        // Look for Career Services text in Hebrew
        const careerText = 'שירותי קריירה';
        const careerElements = await page.$$(`text=${careerText}`);
        
        if (careerElements.length === 0) {
            console.log('❌ Career Services button not found');
        } else {
            console.log(`✅ Found ${careerElements.length} Career Services elements`);
            
            // Test the first one
            const careerButton = careerElements[0];
            const buttonBox = await careerButton.boundingBox();
            console.log(`Button position: x=${buttonBox.x}, y=${buttonBox.y}`);
            
            // Click and check dropdown
            await careerButton.click();
            await page.waitForTimeout(500);
            
            // Look for dropdown
            const dropdown = await page.$('.dropdown-list');
            if (dropdown) {
                const dropdownBox = await dropdown.boundingBox();
                console.log(`Dropdown position: x=${dropdownBox.x}, y=${dropdownBox.y}`);
                
                const horizontalGap = Math.abs(dropdownBox.x - buttonBox.x);
                const verticalGap = dropdownBox.y - (buttonBox.y + buttonBox.height);
                
                console.log(`Gap Analysis: horizontal=${horizontalGap}px, vertical=${verticalGap}px`);
                
                if (horizontalGap > 100) console.log('⚠️  Horizontal misalignment detected');
                if (verticalGap > 20) console.log('⚠️  Vertical gap too large');
            } else {
                console.log('❌ Dropdown not found after click');
            }
        }
        
        // Take screenshot
        await page.screenshot({ 
            path: '/Users/michaelmishayev/Desktop/newCode/hebrew-menu-diagnosis.png',
            fullPage: true 
        });
        console.log('\n📸 Screenshot saved: hebrew-menu-diagnosis.png');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        await browser.close();
    }
})();
