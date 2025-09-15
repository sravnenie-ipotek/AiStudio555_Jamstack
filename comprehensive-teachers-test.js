const puppeteer = require('puppeteer');

async function testTeachersPage() {
    console.log('🧪 COMPREHENSIVE TEACHERS PAGE TEST');
    console.log('=====================================');
    
    const browser = await puppeteer.launch({ 
        headless: false, 
        defaultViewport: { width: 1400, height: 900 } 
    });
    const page = await browser.newPage();
    
    try {
        console.log('📍 Navigating to teachers page...');
        await page.goto('http://localhost:3005/teachers.html', { 
            waitUntil: 'networkidle0',
            timeout: 10000 
        });
        
        await page.waitForSelector('.teacher-card', { timeout: 10000 });
        await page.waitForTimeout(3000);
        
        // TEST 1: Count all teacher cards
        console.log('\n🔍 TEST 1: Teacher Cards Count');
        const totalTeachers = await page.evaluate(() => {
            return document.querySelectorAll('.teacher-card').length;
        });
        console.log('Found ' + totalTeachers + ' teacher cards');
        const countPass = totalTeachers === 16;
        console.log('Expected: 16 | Actual: ' + totalTeachers + ' | Result: ' + (countPass ? 'PASS' : 'FAIL'));
        
        // TEST 2: Test category filtering
        console.log('\n🏷️ TEST 2: Category Filtering');
        
        const categories = ['frontend', 'java', 'python', 'javascript', 'mobile', 'devops', 'qa', 'design', 'management'];
        const expected = [2, 2, 2, 1, 1, 2, 1, 3, 2];
        let categoryPasses = 0;
        
        for (let i = 0; i < categories.length; i++) {
            const cat = categories[i];
            const exp = expected[i];
            
            console.log('\n  Testing ' + cat + ' category...');
            
            // Click category tab
            await page.click('[data-category="' + cat + '"]');
            await page.waitForTimeout(800);
            
            const visibleCount = await page.evaluate(() => {
                const cards = Array.from(document.querySelectorAll('.teacher-card'));
                return cards.filter(card => {
                    const style = window.getComputedStyle(card);
                    return style.display !== 'none' && style.opacity !== '0';
                }).length;
            });
            
            const catPass = visibleCount === exp;
            if (catPass) categoryPasses++;
            
            console.log('    Expected: ' + exp + ' | Actual: ' + visibleCount + ' | Result: ' + (catPass ? 'PASS' : 'FAIL'));
        }
        
        // TEST 3: All tab
        console.log('\n🌐 TEST 3: "All" Tab Functionality');
        await page.click('[data-category="all"]');
        await page.waitForTimeout(800);
        
        const allVisible = await page.evaluate(() => {
            const cards = Array.from(document.querySelectorAll('.teacher-card'));
            return cards.filter(card => {
                const style = window.getComputedStyle(card);
                return style.display !== 'none' && style.opacity !== '0';
            }).length;
        });
        
        const allTabPass = allVisible === 16;
        console.log('Expected: 16 | Actual: ' + allVisible + ' | Result: ' + (allTabPass ? 'PASS' : 'FAIL'));
        
        // TEST 4: Design elements
        console.log('\n🎨 TEST 4: Design Elements');
        
        const designCheck = await page.evaluate(() => {
            const results = {};
            
            // Check tabs container
            const tabs = document.querySelector('.teacher-tabs');
            if (tabs) {
                const style = window.getComputedStyle(tabs);
                results.horizontalScroll = style.overflowX === 'auto' || style.overflowX === 'scroll';
            }
            
            // Check background
            const section = document.querySelector('.teachers-section, .teacher-grid-section');
            if (section) {
                const bg = window.getComputedStyle(section).backgroundColor;
                results.darkBg = bg.includes('5, 5, 26') || bg.includes('rgb(5, 5, 26)');
            }
            
            // Check active tab color
            const activeTab = document.querySelector('.teacher-tab.active');
            if (activeTab) {
                const color = window.getComputedStyle(activeTab).color;
                results.yellowAccent = color.includes('251, 220, 12') || color.includes('#fbdc0c');
            }
            
            return results;
        });
        
        console.log('  Horizontal Scrollable Tabs: ' + (designCheck.horizontalScroll ? 'PASS' : 'FAIL'));
        console.log('  Dark Background: ' + (designCheck.darkBg ? 'PASS' : 'FAIL'));
        console.log('  Yellow Accent: ' + (designCheck.yellowAccent ? 'PASS' : 'FAIL'));
        
        // Screenshot
        console.log('\n📸 Taking final screenshot...');
        await page.screenshot({ 
            path: '/Users/michaelmishayev/Desktop/newCode/teachers-comprehensive-final.png',
            fullPage: true 
        });
        
        // Final verdict
        console.log('\n🏆 FINAL VERDICT');
        console.log('=================');
        
        const totalPasses = (countPass ? 1 : 0) + categoryPasses + (allTabPass ? 1 : 0) + 
                          (designCheck.horizontalScroll ? 1 : 0) + (designCheck.darkBg ? 1 : 0) + 
                          (designCheck.yellowAccent ? 1 : 0);
        const totalTests = 1 + categories.length + 1 + 3;
        
        console.log('Tests passed: ' + totalPasses + '/' + totalTests);
        
        if (totalPasses === totalTests) {
            console.log('🎉 OVERALL RESULT: PASS');
            console.log('✅ Teachers page fully matches TeachMeSkills.by functionality!');
        } else {
            console.log('⚠️ OVERALL RESULT: FAIL');
            console.log('Some tests failed - check results above');
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        await browser.close();
    }
}

testTeachersPage().catch(console.error);
