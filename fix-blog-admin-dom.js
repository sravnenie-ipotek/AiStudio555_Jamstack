const { chromium } = require('playwright');

async function fixBlogAdminDOM() {
    console.log('🔧 Fixing BlogAdmin DOM Structure...');
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 1000
    });
    
    const page = await browser.newPage();
    
    try {
        await page.goto('http://localhost:3000/admin-nd.html');
        await page.waitForTimeout(3000);
        
        console.log('1️⃣ Fix DOM structure by moving sections to correct parent...');
        await page.evaluate(() => {
            // Find the main container for content sections
            const containers = document.querySelectorAll('.container, .admin-card');
            let targetContainer = null;
            
            // Find the container that already has proper content sections
            for (const container of containers) {
                const homeSection = container.querySelector('#home');
                if (homeSection) {
                    targetContainer = container;
                    break;
                }
            }
            
            if (!targetContainer) {
                console.log('❌ Could not find target container');
                return false;
            }
            
            console.log('✅ Found target container');
            
            // Move misplaced sections to the correct parent
            const sectionsToMove = ['blog', 'blogNew', 'blogAdmin'];
            let moved = 0;
            
            sectionsToMove.forEach(sectionId => {
                const section = document.getElementById(sectionId);
                if (section && section.parentElement.id === 'teachers') {
                    console.log(`Moving ${sectionId} to correct parent`);
                    targetContainer.appendChild(section);
                    moved++;
                }
            });
            
            console.log(`✅ Moved ${moved} sections to correct parent`);
            return true;
        });
        
        console.log('2️⃣ Click BlogAdmin tab...');
        await page.locator('button[data-tab="blogAdmin"]').click();
        await page.waitForTimeout(2000);
        
        console.log('3️⃣ Check if BlogAdmin is now visible...');
        const isVisible = await page.locator('#blogAdmin').isVisible();
        console.log('BlogAdmin visible after DOM fix:', isVisible);
        
        if (isVisible) {
            console.log('✅ SUCCESS! BlogAdmin is now visible!');
            
            // Check table content
            const tableRows = await page.locator('#blogAdmin-table-body tr').count();
            console.log('Table rows visible:', tableRows);
            
            if (tableRows > 0) {
                const firstRowText = await page.locator('#blogAdmin-table-body tr').first().textContent();
                console.log('First row content:', firstRowText?.substring(0, 100));
            }
        } else {
            console.log('❌ BlogAdmin still not visible');
            
            // Additional debugging
            const debugInfo = await page.evaluate(() => {
                const blogAdmin = document.getElementById('blogAdmin');
                if (!blogAdmin) return null;
                
                const rect = blogAdmin.getBoundingClientRect();
                return {
                    parentId: blogAdmin.parentElement?.id,
                    rect: { width: rect.width, height: rect.height },
                    display: window.getComputedStyle(blogAdmin).display,
                    hasActive: blogAdmin.classList.contains('active')
                };
            });
            console.log('Debug info after fix:', debugInfo);
        }
        
        console.log('4️⃣ Take screenshot...');
        await page.screenshot({ 
            path: '/Users/michaelmishayev/Desktop/newCode/fixed-blogadmin.png',
            fullPage: true 
        });
        
        console.log('✅ DOM fix attempt completed!');
        
    } catch (error) {
        console.error('❌ Fix failed:', error);
    } finally {
        await browser.close();
    }
}

fixBlogAdminDOM().catch(console.error);
