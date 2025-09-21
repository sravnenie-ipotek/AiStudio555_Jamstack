/**
 * Language Switching Test for AI Studio
 * Tests language switching functionality across home, courses, and teachers pages
 */

const puppeteer = require('puppeteer');
const fs = require('fs');

async function testLanguageSwitching() {
    console.log('🔵 Starting Language Switching Test Suite...\n');
    
    const browser = await puppeteer.launch({ 
        headless: false,
        defaultViewport: { width: 1200, height: 800 }
    });
    
    const results = {
        timestamp: new Date().toISOString(),
        tests: {},
        summary: {
            passed: 0,
            failed: 0,
            issues: []
        }
    };
    
    try {
        // Test 1: Home page language switching
        console.log('📝 Test 1: Home page language switching');
        results.tests.homePage = await testPageLanguageSwitching(browser, 'home.html');
        
        // Test 2: Courses page language switching
        console.log('📝 Test 2: Courses page language switching');
        results.tests.coursesPage = await testPageLanguageSwitching(browser, 'courses.html');
        
        // Test 3: Teachers page language switching
        console.log('📝 Test 3: Teachers page language switching');
        results.tests.teachersPage = await testPageLanguageSwitching(browser, 'teachers.html');
        
        // Test 4: Navigation persistence across pages
        console.log('📝 Test 4: Navigation persistence across pages');
        results.tests.navigationPersistence = await testNavigationPersistence(browser);
        
        // Calculate summary
        Object.values(results.tests).forEach(test => {
            if (test.passed) results.summary.passed++;
            else results.summary.failed++;
            if (test.issues && test.issues.length > 0) {
                results.summary.issues.push(...test.issues);
            }
        });
        
        // Generate report
        generateReport(results);
        
    } catch (error) {
        console.error('❌ Test suite failed:', error);
        results.summary.issues.push('Test suite failed: ' + error.message);
    } finally {
        await browser.close();
    }
    
    return results;
}

async function testPageLanguageSwitching(browser, pageUrl) {
    const page = await browser.newPage();
    const test = {
        url: pageUrl,
        passed: false,
        issues: [],
        details: {}
    };
    
    try {
        console.log('  📄 Testing ' + pageUrl + '...');
        
        // Navigate to page
        await page.goto('http://localhost:3005/backups/newDesign/' + pageUrl, { 
            waitUntil: 'networkidle0',
            timeout: 10000 
        });
        
        // Wait for page to fully load
        await page.waitForTimeout(2000);
        
        // Check if language pills exist
        const langPills = await page.$$('.lang-pill');
        const mobileLangPills = await page.$$('.mobile-lang-pill');
        
        if (langPills.length === 0 && mobileLangPills.length === 0) {
            test.issues.push('❌ No language pills found on page');
            console.log('    ❌ No language pills found on ' + pageUrl);
            return test;
        }
        
        console.log('    ✅ Found ' + langPills.length + ' desktop pills, ' + mobileLangPills.length + ' mobile pills');
        
        // Check if language manager is loaded
        const hasLanguageManager = await page.evaluate(() => {
            return typeof window.languageManager !== 'undefined';
        });
        
        if (!hasLanguageManager) {
            test.issues.push('❌ Language manager not loaded');
            console.log('    ❌ Language manager not loaded on ' + pageUrl);
        } else {
            console.log('    ✅ Language manager loaded');
        }
        
        // Test English to Russian switching
        console.log('    🔄 Testing EN → RU switch...');
        const ruTest = await testLanguageSwitch(page, 'RU');
        test.details.ruSwitch = ruTest;
        
        if (!ruTest.success) {
            test.issues.push('❌ EN → RU switch failed: ' + ruTest.error);
        } else {
            console.log('    ✅ EN → RU switch successful');
        }
        
        // Test Russian to Hebrew switching
        console.log('    🔄 Testing RU → HE switch...');
        const heTest = await testLanguageSwitch(page, 'HE');
        test.details.heSwitch = heTest;
        
        if (!heTest.success) {
            test.issues.push('❌ RU → HE switch failed: ' + heTest.error);
        } else {
            console.log('    ✅ RU → HE switch successful');
        }
        
        // Test Hebrew to English switching
        console.log('    🔄 Testing HE → EN switch...');
        const enTest = await testLanguageSwitch(page, 'EN');
        test.details.enSwitch = enTest;
        
        if (!enTest.success) {
            test.issues.push('❌ HE → EN switch failed: ' + enTest.error);
        } else {
            console.log('    ✅ HE → EN switch successful');
        }
        
        test.passed = test.issues.length === 0;
        
    } catch (error) {
        test.issues.push('❌ Page test failed: ' + error.message);
        console.log('    ❌ Error testing ' + pageUrl + ': ' + error.message);
    } finally {
        await page.close();
    }
    
    return test;
}

async function testLanguageSwitch(page, targetLang) {
    try {
        // Find the language pill
        const pills = await page.$$('.lang-pill, .mobile-lang-pill');
        let targetPill = null;
        
        for (let p of pills) {
            const text = await page.evaluate(el => el.textContent, p);
            if (text.trim() === targetLang) {
                targetPill = p;
                break;
            }
        }
        
        if (!targetPill) {
            return { success: false, error: targetLang + ' pill not found' };
        }
        
        await targetPill.click();
        
        // Wait for any transitions/loading
        await page.waitForTimeout(1000);
        
        // Check if pill is now active
        const isActive = await page.evaluate((lang) => {
            const pills = document.querySelectorAll('.lang-pill, .mobile-lang-pill');
            for (let pill of pills) {
                if (pill.textContent.trim() === lang && pill.classList.contains('active')) {
                    return true;
                }
            }
            return false;
        }, targetLang);
        
        if (!isActive) {
            return { success: false, error: targetLang + ' pill not marked as active' };
        }
        
        return { success: true };
        
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function testNavigationPersistence(browser) {
    const page = await browser.newPage();
    const test = {
        passed: false,
        issues: [],
        details: {}
    };
    
    try {
        console.log('  🔗 Testing navigation persistence...');
        
        // Start on home page
        await page.goto('http://localhost:3005/backups/newDesign/home.html', { waitUntil: 'networkidle0' });
        await page.waitForTimeout(2000);
        
        // Find and click Russian pill
        const pills = await page.$$('.lang-pill, .mobile-lang-pill');
        let ruPill = null;
        
        for (let p of pills) {
            const text = await page.evaluate(el => el.textContent, p);
            if (text.trim() === 'RU') {
                ruPill = p;
                break;
            }
        }
        
        if (ruPill) {
            await ruPill.click();
            await page.waitForTimeout(1000);
            console.log('    🔄 Switched to Russian on home page');
        }
        
        // Navigate to courses page
        console.log('    🔗 Navigating to courses page...');
        await page.click('a[href="courses.html"]');
        await page.waitForTimeout(3000);
        
        // Check if Russian is still active
        const isRuActiveOnCourses = await page.evaluate(() => {
            const ruPill = [...document.querySelectorAll('.lang-pill, .mobile-lang-pill')]
                .find(pill => pill.textContent.trim() === 'RU');
            return ruPill && ruPill.classList.contains('active');
        });
        
        if (!isRuActiveOnCourses) {
            test.issues.push('❌ Russian language not persisted on courses page');
        } else {
            console.log('    ✅ Russian persisted on courses page');
        }
        
        // Navigate to teachers page
        console.log('    🔗 Navigating to teachers page...');
        await page.click('a[href="teachers.html"]');
        await page.waitForTimeout(3000);
        
        // Check if teachers page has pills
        const hasTeachersPills = await page.evaluate(() => {
            return document.querySelectorAll('.lang-pill, .mobile-lang-pill').length > 0;
        });
        
        if (!hasTeachersPills) {
            test.issues.push('❌ Teachers page missing language pills');
            console.log('    ❌ Teachers page missing language pills');
        } else {
            console.log('    ✅ Teachers page has language pills');
        }
        
        test.passed = test.issues.length === 0;
        
    } catch (error) {
        test.issues.push('❌ Navigation persistence test failed: ' + error.message);
    } finally {
        await page.close();
    }
    
    return test;
}

function generateReport(results) {
    console.log('\n📊 LANGUAGE SWITCHING TEST REPORT');
    console.log('==================================');
    console.log('Timestamp: ' + results.timestamp);
    console.log('Total Tests: ' + (results.summary.passed + results.summary.failed));
    console.log('Passed: ' + results.summary.passed);
    console.log('Failed: ' + results.summary.failed + '\n');
    
    // Detailed results
    Object.entries(results.tests).forEach(([testName, test]) => {
        console.log((test.passed ? '✅' : '❌') + ' ' + testName + ':');
        if (test.issues && test.issues.length > 0) {
            test.issues.forEach(issue => console.log('   ' + issue));
        }
        console.log('');
    });
    
    // Overall issues
    if (results.summary.issues.length > 0) {
        console.log('🚨 CRITICAL ISSUES FOUND:');
        results.summary.issues.forEach(issue => console.log('   ' + issue));
    }
    
    // Save report to file
    fs.writeFileSync('language-switching-test-report.json', JSON.stringify(results, null, 2));
    console.log('📄 Full report saved to: language-switching-test-report.json');
    
    return results;
}

// Run the test
if (require.main === module) {
    testLanguageSwitching().then(results => {
        process.exit(results.summary.failed === 0 ? 0 : 1);
    }).catch(error => {
        console.error('Test suite crashed:', error);
        process.exit(1);
    });
}

module.exports = { testLanguageSwitching };
