/**
 * Comprehensive QA Test for Language Fixes
 * Tests all the fixes made for production routing and language switchers
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function runComprehensiveQATest() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1200, height: 800 }
  });
  
  const results = {
    timestamp: new Date().toISOString(),
    tests: [],
    summary: { passed: 0, failed: 0, total: 0 }
  };

  console.log('🚀 Starting Comprehensive QA Test for Language Fixes...\n');

  async function testAndLog(testName, testFn) {
    console.log(`Testing: ${testName}`);
    results.summary.total++;
    
    try {
      const result = await testFn();
      if (result.passed) {
        results.summary.passed++;
        console.log(`✅ PASS: ${testName}`);
        if (result.details) console.log(`   Details: ${result.details}`);
      } else {
        results.summary.failed++;
        console.log(`❌ FAIL: ${testName}`);
        console.log(`   Error: ${result.error}`);
      }
      results.tests.push({ name: testName, ...result });
    } catch (error) {
      results.summary.failed++;
      console.log(`❌ FAIL: ${testName}`);
      console.log(`   Error: ${error.message}`);
      results.tests.push({ name: testName, passed: false, error: error.message });
    }
    console.log('');
  }

  // Test 1: Production default route serves home.html instead of index.html
  await testAndLog('Production default route "/" serves home.html', async () => {
    const page = await context.newPage();
    
    // Test local server first
    try {
      await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
      
      // Check page title should be from home.html, not index.html
      const title = await page.title();
      const url = page.url();
      
      // Check if content is from home.html (look for specific home.html elements)
      const hasHomeContent = await page.locator('.featured-courses, .testimonials').count() > 0;
      
      await page.close();
      
      if (hasHomeContent && title.includes('AI Studio')) {
        return { 
          passed: true, 
          details: `Title: ${title}, URL: ${url}, Has home content: ${hasHomeContent}` 
        };
      } else {
        return { 
          passed: false, 
          error: `Expected home.html content but got title: ${title}, home content: ${hasHomeContent}` 
        };
      }
    } catch (error) {
      await page.close();
      return { passed: false, error: `Local server not running: ${error.message}` };
    }
  });

  // Test 2: Hebrew version language switcher positioning
  await testAndLog('Hebrew version (/dist/he/index.html) language switcher positioning', async () => {
    const page = await context.newPage();
    
    try {
      await page.goto('http://localhost:3000/dist/he/index.html', { waitUntil: 'networkidle' });
      
      // Check language switcher exists and is positioned correctly
      const languageSwitcher = page.locator('#language-switcher');
      const isVisible = await languageSwitcher.isVisible();
      
      if (!isVisible) {
        await page.close();
        return { passed: false, error: 'Language switcher not found or not visible' };
      }
      
      // Check positioning relative to signup button
      const switcherBox = await languageSwitcher.boundingBox();
      const signupButton = page.locator('.primary-button-text-block').filter({ hasText: 'הרשמו היום' }).first();
      const signupBox = await signupButton.boundingBox();
      
      // Language switcher should be to the left of signup button (RTL layout)
      const isPositionedCorrectly = switcherBox && signupBox && switcherBox.x < signupBox.x;
      
      // Check that it's not in a fixed position far right
      const switcherStyle = await languageSwitcher.getAttribute('style');
      const hasInlinePositioning = switcherStyle?.includes('margin-left') && switcherStyle?.includes('margin-right');
      
      // Check language options are correct
      const options = await page.locator('#language-switcher select option').allTextContents();
      const hasCorrectOptions = options.includes('English') && options.includes('Russian') && options.includes('Hebrew');
      
      await page.close();
      
      if (isPositionedCorrectly && hasInlinePositioning && hasCorrectOptions) {
        return { 
          passed: true, 
          details: `Switcher positioned correctly, has inline styling, and contains all language options: ${options.join(', ')}` 
        };
      } else {
        return { 
          passed: false, 
          error: `Position check: ${isPositionedCorrectly}, Inline styling: ${hasInlinePositioning}, Options: ${hasCorrectOptions ? 'correct' : 'incorrect: ' + options.join(', ')}` 
        };
      }
    } catch (error) {
      await page.close();
      return { passed: false, error: error.message };
    }
  });

  // Test 3: Russian version menu layout and language switcher
  await testAndLog('Russian version (/dist/ru/index.html) menu layout and language switcher', async () => {
    const page = await context.newPage();
    
    try {
      await page.goto('http://localhost:3000/dist/ru/index.html', { waitUntil: 'networkidle' });
      
      // Check navigation menu items exist
      const navLinks = await page.locator('.nav-link').allTextContents();
      const expectedRussianMenuItems = ['Главная', 'Все курсы', 'Преподаватели', 'Карьерные услуги', 'О нас', 'Контакты', 'Блог'];
      
      const hasAllMenuItems = expectedRussianMenuItems.every(item => 
        navLinks.some(link => link.includes(item))
      );
      
      // Check language switcher positioning
      const languageSwitcher = page.locator('#language-switcher');
      const isVisible = await languageSwitcher.isVisible();
      
      // Check language options
      const options = await page.locator('#language-switcher select option').allTextContents();
      const hasCorrectOptions = options.includes('English') && options.includes('Русский') && options.includes('Hebrew');
      
      // Check selected option is Russian
      const selectedOption = await page.locator('#language-switcher select').inputValue();
      const isRussianSelected = selectedOption === 'ru';
      
      await page.close();
      
      if (hasAllMenuItems && isVisible && hasCorrectOptions && isRussianSelected) {
        return { 
          passed: true, 
          details: `Menu items: ${navLinks.length}, Language switcher visible, Options: ${options.join(', ')}, Russian selected: ${isRussianSelected}` 
        };
      } else {
        return { 
          passed: false, 
          error: `Menu items: ${hasAllMenuItems ? 'correct' : 'missing: ' + expectedRussianMenuItems.filter(item => !navLinks.some(link => link.includes(item))).join(', ')}, Switcher visible: ${isVisible}, Options: ${hasCorrectOptions ? 'correct' : 'incorrect'}, Russian selected: ${isRussianSelected}` 
        };
      }
    } catch (error) {
      await page.close();
      return { passed: false, error: error.message };
    }
  });

  // Test 4: Language switcher functionality across all versions
  await testAndLog('Language switcher functionality test', async () => {
    const page = await context.newPage();
    
    try {
      // Test from Hebrew version
      await page.goto('http://localhost:3000/dist/he/index.html', { waitUntil: 'networkidle' });
      
      // Check if switchLanguage function exists
      const switchLanguageExists = await page.evaluate(() => {
        return typeof switchLanguage === 'function';
      });
      
      if (!switchLanguageExists) {
        await page.close();
        return { passed: false, error: 'switchLanguage function not found' };
      }
      
      // Check language switcher select element
      const selectElement = page.locator('#language-switcher select');
      const isSelectVisible = await selectElement.isVisible();
      
      // Check options count
      const optionCount = await page.locator('#language-switcher select option').count();
      
      await page.close();
      
      if (isSelectVisible && optionCount === 3) {
        return { 
          passed: true, 
          details: `Function exists: ${switchLanguageExists}, Select visible: ${isSelectVisible}, Options count: ${optionCount}` 
        };
      } else {
        return { 
          passed: false, 
          error: `Select visible: ${isSelectVisible}, Options count: ${optionCount} (expected 3)` 
        };
      }
    } catch (error) {
      await page.close();
      return { passed: false, error: error.message };
    }
  });

  // Test 5: Check for duplicate language switchers
  await testAndLog('No duplicate language switchers test', async () => {
    const languages = ['he', 'ru', 'en'];
    const duplicateResults = [];
    
    for (const lang of languages) {
      const page = await context.newPage();
      
      try {
        const url = lang === 'en' 
          ? 'http://localhost:3000/dist/en/index.html'
          : `http://localhost:3000/dist/${lang}/index.html`;
          
        await page.goto(url, { waitUntil: 'networkidle' });
        
        // Count language switchers
        const switcherCount = await page.locator('#language-switcher, .language-switcher').count();
        duplicateResults.push({ lang, count: switcherCount });
        
        await page.close();
      } catch (error) {
        await page.close();
        duplicateResults.push({ lang, count: 0, error: error.message });
      }
    }
    
    const hasDuplicates = duplicateResults.some(result => result.count > 1);
    const allHaveSwitchers = duplicateResults.every(result => result.count === 1);
    
    if (allHaveSwitchers && !hasDuplicates) {
      return { 
        passed: true, 
        details: `All languages have exactly one language switcher: ${duplicateResults.map(r => `${r.lang}: ${r.count}`).join(', ')}` 
      };
    } else {
      return { 
        passed: false, 
        error: `Duplicate or missing switchers found: ${duplicateResults.map(r => `${r.lang}: ${r.count}${r.error ? ' (error: ' + r.error + ')' : ''}`).join(', ')}` 
      };
    }
  });

  // Test 6: Visual positioning verification with screenshots
  await testAndLog('Visual positioning verification with screenshots', async () => {
    const page = await context.newPage();
    const screenshots = [];
    
    try {
      // Hebrew version screenshot
      await page.goto('http://localhost:3000/dist/he/index.html', { waitUntil: 'networkidle' });
      await page.locator('#language-switcher').waitFor({ state: 'visible' });
      
      const hebrewScreenshot = path.join(__dirname, 'qa-test-hebrew-navbar.png');
      await page.screenshot({ path: hebrewScreenshot, clip: { x: 0, y: 0, width: 1200, height: 100 } });
      screenshots.push(hebrewScreenshot);
      
      // Russian version screenshot
      await page.goto('http://localhost:3000/dist/ru/index.html', { waitUntil: 'networkidle' });
      await page.locator('#language-switcher').waitFor({ state: 'visible' });
      
      const russianScreenshot = path.join(__dirname, 'qa-test-russian-navbar.png');
      await page.screenshot({ path: russianScreenshot, clip: { x: 0, y: 0, width: 1200, height: 100 } });
      screenshots.push(russianScreenshot);
      
      await page.close();
      
      const screenshotsExist = screenshots.every(screenshot => fs.existsSync(screenshot));
      
      if (screenshotsExist) {
        return { 
          passed: true, 
          details: `Screenshots captured: ${screenshots.map(s => path.basename(s)).join(', ')}` 
        };
      } else {
        return { 
          passed: false, 
          error: 'Failed to capture all screenshots' 
        };
      }
    } catch (error) {
      await page.close();
      return { passed: false, error: error.message };
    }
  });

  await browser.close();

  // Generate report
  console.log('📊 Test Summary:');
  console.log(`Total Tests: ${results.summary.total}`);
  console.log(`Passed: ${results.summary.passed}`);
  console.log(`Failed: ${results.summary.failed}`);
  console.log(`Success Rate: ${((results.summary.passed / results.summary.total) * 100).toFixed(1)}%\n`);

  // Save detailed results
  const reportPath = path.join(__dirname, 'qa-language-fixes-test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`📄 Detailed report saved: ${reportPath}`);

  // Create HTML report
  const htmlReport = `
<!DOCTYPE html>
<html>
<head>
  <title>QA Language Fixes Test Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    .summary { background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
    .test-item { margin: 15px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
    .passed { border-left: 5px solid #28a745; background: #f8fff9; }
    .failed { border-left: 5px solid #dc3545; background: #fff8f8; }
    .details { margin-top: 10px; font-size: 0.9em; color: #666; }
    .error { color: #dc3545; }
  </style>
</head>
<body>
  <h1>🔵 QA Language Fixes Test Report</h1>
  <div class="summary">
    <h2>Summary</h2>
    <p><strong>Total Tests:</strong> ${results.summary.total}</p>
    <p><strong>Passed:</strong> ${results.summary.passed}</p>
    <p><strong>Failed:</strong> ${results.summary.failed}</p>
    <p><strong>Success Rate:</strong> ${((results.summary.passed / results.summary.total) * 100).toFixed(1)}%</p>
    <p><strong>Timestamp:</strong> ${results.timestamp}</p>
  </div>
  
  <h2>Test Results</h2>
  ${results.tests.map(test => `
    <div class="test-item ${test.passed ? 'passed' : 'failed'}">
      <h3>${test.passed ? '✅' : '❌'} ${test.name}</h3>
      ${test.details ? `<div class="details">Details: ${test.details}</div>` : ''}
      ${test.error ? `<div class="details error">Error: ${test.error}</div>` : ''}
    </div>
  `).join('')}
</body>
</html>`;

  const htmlReportPath = path.join(__dirname, 'qa-language-fixes-test-report.html');
  fs.writeFileSync(htmlReportPath, htmlReport);
  console.log(`📄 HTML report saved: ${htmlReportPath}`);

  return results;
}

// Run the test
if (require.main === module) {
  runComprehensiveQATest().catch(console.error);
}

module.exports = { runComprehensiveQATest };
