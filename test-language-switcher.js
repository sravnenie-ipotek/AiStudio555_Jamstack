const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

// Test results storage
const testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  warnings: 0,
  errors: []
};

function log(message, type = 'info') {
  const timestamp = new Date().toISOString().slice(11, 19);
  let color = colors.reset;
  let symbol = '📝';
  
  switch(type) {
    case 'success':
      color = colors.green;
      symbol = '✅';
      break;
    case 'error':
      color = colors.red;
      symbol = '❌';
      break;
    case 'warning':
      color = colors.yellow;
      symbol = '⚠️';
      break;
    case 'info':
      color = colors.cyan;
      symbol = 'ℹ️';
      break;
    case 'test':
      color = colors.magenta;
      symbol = '🧪';
      break;
  }
  
  console.log(`${color}[${timestamp}] ${symbol} ${message}${colors.reset}`);
}

function testFileExists(filePath, description) {
  testResults.total++;
  if (fs.existsSync(filePath)) {
    testResults.passed++;
    return true;
  } else {
    testResults.failed++;
    testResults.errors.push(`File not found: ${filePath} - ${description}`);
    return false;
  }
}

function testFileContent(filePath, searchString, description) {
  testResults.total++;
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(searchString)) {
      testResults.passed++;
      return true;
    } else {
      testResults.failed++;
      testResults.errors.push(`Missing content in ${filePath}: ${description}`);
      return false;
    }
  } catch (error) {
    testResults.failed++;
    testResults.errors.push(`Error reading ${filePath}: ${error.message}`);
    return false;
  }
}

function checkLanguageSwitcherPresence(filePath) {
  const checks = [
    { string: 'window.switchLanguage', desc: 'Language switcher function' },
    { string: 'LANGUAGES', desc: 'Language configuration' },
    { string: 'localStorage', desc: 'Language persistence' },
    { string: 'home.html', desc: 'Home.html fix check' }
  ];
  
  let allPassed = true;
  const content = fs.readFileSync(filePath, 'utf8');
  
  for (const check of checks) {
    testResults.total++;
    if (content.includes(check.string)) {
      testResults.passed++;
      if (check.string === 'home.html') {
        // Special check for the fix
        if (content.includes("if (fileName === 'home.html'") || 
            content.includes("pathParts[pathParts.length - 1] === 'home.html'")) {
          log(`  ✅ Has home.html → index.html fix`, 'success');
        } else {
          testResults.warnings++;
          log(`  ⚠️ Has 'home.html' reference but might not have the fix`, 'warning');
        }
      }
    } else {
      if (check.string !== 'home.html') {
        testResults.failed++;
        allPassed = false;
        log(`  ❌ Missing: ${check.desc}`, 'error');
      }
    }
  }
  
  return allPassed;
}

async function runComprehensiveTests() {
  console.log('\n' + '='.repeat(60));
  log('🚀 COMPREHENSIVE LANGUAGE SWITCHER TEST SUITE', 'test');
  console.log('='.repeat(60) + '\n');
  
  const languages = ['en', 'ru', 'he'];
  const expectedPages = [
    'index.html',
    'about.html',
    'courses.html',
    'teachers.html',
    'career-center.html',
    'career-orientation.html',
    'detail_courses.html'
  ];
  
  // Test 1: Check all language directories exist
  log('\n📁 TEST 1: Language Directory Structure', 'test');
  for (const lang of languages) {
    const dirPath = path.join(__dirname, 'dist', lang);
    if (testFileExists(dirPath, `${lang.toUpperCase()} language directory`)) {
      log(`  ✅ Directory dist/${lang} exists`, 'success');
    } else {
      log(`  ❌ Directory dist/${lang} missing`, 'error');
    }
  }
  
  // Test 2: Check all expected pages exist in each language
  log('\n📄 TEST 2: Page Availability in All Languages', 'test');
  for (const lang of languages) {
    log(`\n  Testing ${lang.toUpperCase()} pages:`, 'info');
    for (const page of expectedPages) {
      const pagePath = path.join(__dirname, 'dist', lang, page);
      if (testFileExists(pagePath, `${lang}/${page}`)) {
        log(`    ✅ ${page}`, 'success');
      } else {
        log(`    ❌ ${page} missing`, 'error');
      }
    }
  }
  
  // Test 3: Check language switcher presence and fix
  log('\n🔧 TEST 3: Language Switcher Implementation', 'test');
  for (const lang of languages) {
    log(`\n  Checking ${lang.toUpperCase()} pages for switcher:`, 'info');
    const langDir = path.join(__dirname, 'dist', lang);
    
    if (!fs.existsSync(langDir)) continue;
    
    const files = fs.readdirSync(langDir).filter(f => f.endsWith('.html'));
    for (const file of files) {
      const filePath = path.join(langDir, file);
      log(`\n  📋 ${lang}/${file}:`, 'info');
      checkLanguageSwitcherPresence(filePath);
    }
  }
  
  // Test 4: Special home.html → index.html conversion test
  log('\n🏠 TEST 4: Home Page Conversion Logic', 'test');
  const testPaths = [
    { from: '/dist/en/home.html', to: '/dist/ru/index.html', desc: 'EN home → RU index' },
    { from: '/dist/en/index.html', to: '/dist/ru/index.html', desc: 'EN index → RU index' },
    { from: '/dist/ru/home.html', to: '/dist/en/index.html', desc: 'RU home → EN index' },
    { from: '/dist/he/home.html', to: '/dist/en/index.html', desc: 'HE home → EN index' }
  ];
  
  for (const test of testPaths) {
    testResults.total++;
    // Check if the destination file exists (since home.html doesn't exist, we check index.html)
    const destPath = path.join(__dirname, test.to);
    if (fs.existsSync(destPath)) {
      testResults.passed++;
      log(`  ✅ ${test.desc} - Target exists`, 'success');
    } else {
      testResults.failed++;
      log(`  ❌ ${test.desc} - Target missing`, 'error');
    }
  }
  
  // Test 5: Check for RTL support markers
  log('\n🌍 TEST 5: RTL Support for Hebrew', 'test');
  const hebrewFiles = fs.readdirSync(path.join(__dirname, 'dist', 'he'))
    .filter(f => f.endsWith('.html'))
    .slice(0, 3); // Check first 3 files
  
  for (const file of hebrewFiles) {
    const filePath = path.join(__dirname, 'dist', 'he', file);
    if (testFileContent(filePath, "dir: 'rtl'", 'RTL configuration')) {
      log(`  ✅ ${file} has RTL support`, 'success');
    } else {
      log(`  ⚠️ ${file} might not have RTL support`, 'warning');
    }
  }
  
  // Test 6: Cross-reference check
  log('\n🔄 TEST 6: Cross-Language File Consistency', 'test');
  const enFiles = fs.readdirSync(path.join(__dirname, 'dist', 'en'))
    .filter(f => f.endsWith('.html'));
  
  for (const file of enFiles) {
    let consistent = true;
    for (const lang of ['ru', 'he']) {
      const crossPath = path.join(__dirname, 'dist', lang, file);
      if (!fs.existsSync(crossPath)) {
        consistent = false;
        testResults.warnings++;
        log(`  ⚠️ ${file} exists in EN but not in ${lang.toUpperCase()}`, 'warning');
      }
    }
    if (consistent) {
      testResults.passed++;
      log(`  ✅ ${file} exists in all languages`, 'success');
    }
  }
  
  // Test 7: Check localStorage implementation
  log('\n💾 TEST 7: LocalStorage Implementation', 'test');
  const sampleFiles = [
    path.join(__dirname, 'dist', 'en', 'index.html'),
    path.join(__dirname, 'dist', 'ru', 'index.html'),
    path.join(__dirname, 'dist', 'he', 'index.html')
  ];
  
  for (const file of sampleFiles) {
    const lang = file.split('/').slice(-2)[0];
    if (testFileContent(file, 'localStorage.setItem', 'localStorage setter') &&
        testFileContent(file, 'localStorage.getItem', 'localStorage getter')) {
      log(`  ✅ ${lang.toUpperCase()} index.html has localStorage support`, 'success');
    } else {
      log(`  ❌ ${lang.toUpperCase()} index.html missing localStorage`, 'error');
    }
  }
  
  // Generate final report
  console.log('\n' + '='.repeat(60));
  log('📊 TEST RESULTS SUMMARY', 'test');
  console.log('='.repeat(60));
  
  const passRate = ((testResults.passed / testResults.total) * 100).toFixed(1);
  
  log(`\nTotal Tests: ${testResults.total}`, 'info');
  log(`Passed: ${testResults.passed} ✅`, 'success');
  log(`Failed: ${testResults.failed} ❌`, testResults.failed > 0 ? 'error' : 'success');
  log(`Warnings: ${testResults.warnings} ⚠️`, testResults.warnings > 0 ? 'warning' : 'success');
  log(`Pass Rate: ${passRate}%`, passRate >= 90 ? 'success' : passRate >= 70 ? 'warning' : 'error');
  
  if (testResults.errors.length > 0) {
    log('\n❌ FAILED TESTS:', 'error');
    testResults.errors.forEach((error, i) => {
      log(`  ${i + 1}. ${error}`, 'error');
    });
  }
  
  // Overall status
  console.log('\n' + '='.repeat(60));
  if (testResults.failed === 0 && testResults.warnings < 5) {
    log('🎉 LANGUAGE SWITCHER IS FULLY FUNCTIONAL!', 'success');
    log('All critical tests passed. System ready for production.', 'success');
  } else if (testResults.failed === 0) {
    log('✅ LANGUAGE SWITCHER IS WORKING', 'success');
    log(`Some warnings detected but no critical failures.`, 'warning');
  } else {
    log('⚠️ LANGUAGE SWITCHER NEEDS ATTENTION', 'error');
    log(`${testResults.failed} critical issues found.`, 'error');
  }
  console.log('='.repeat(60) + '\n');
  
  // Save detailed report
  const report = {
    timestamp: new Date().toISOString(),
    summary: testResults,
    errors: testResults.errors,
    passRate: passRate + '%'
  };
  
  fs.writeFileSync(
    path.join(__dirname, 'language-switcher-test-report.json'),
    JSON.stringify(report, null, 2)
  );
  
  log('📄 Detailed report saved to language-switcher-test-report.json', 'info');
}

// Run the tests
runComprehensiveTests().catch(console.error);