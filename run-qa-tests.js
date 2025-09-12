#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'http://localhost:3005';
const TEST_SUITES = {
  'smoke': {
    name: 'Quick Smoke Tests',
    duration: '2-3 minutes',
    tests: [
      'tests/responsive-quick.spec.js',
    ]
  },
  'comprehensive': {
    name: 'Comprehensive System Tests',
    duration: '5-8 minutes',  
    tests: [
      'tests/comprehensive-system.spec.js',
    ]
  },
  'console': {
    name: 'Console Error Detection',
    duration: '3-5 minutes',
    tests: [
      'tests/console-errors.spec.js',
    ]
  },
  'typography': {
    name: 'Font and Typography',
    duration: '2-3 minutes',
    tests: [
      'tests/font-typography.spec.js',
    ]
  },
  'languages': {
    name: 'Multi-Language Support',
    duration: '3-4 minutes',
    tests: [
      'tests/language-switching.spec.js',
    ]
  },
  'accessibility': {
    name: 'Accessibility (WCAG 2.1)',
    duration: '4-6 minutes',
    tests: [
      'tests/accessibility.spec.js',
    ]
  },
  'performance': {
    name: 'Performance & Core Web Vitals',
    duration: '5-7 minutes',
    tests: [
      'tests/performance.spec.js',
    ]
  },
  'all': {
    name: 'Complete Test Suite',
    duration: '15-20 minutes',
    tests: [
      'tests/comprehensive-system.spec.js',
      'tests/console-errors.spec.js', 
      'tests/font-typography.spec.js',
      'tests/language-switching.spec.js',
      'tests/accessibility.spec.js',
      'tests/performance.spec.js',
      'tests/responsive-quick.spec.js',
    ]
  }
};

// Colors for output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

function printHeader() {
  console.log('\n' + '='.repeat(80));
  console.log(colorize('🎯 AI STUDIO E-LEARNING PLATFORM - QA AUTOMATION SUITE', 'bold'));
  console.log('='.repeat(80));
  console.log('🌐 Testing multi-language e-learning platform');
  console.log('🔍 100% system coverage with specialized test suites');
  console.log('⚡ Performance, accessibility, and functionality validation');
  console.log('='.repeat(80) + '\n');
}

function printUsage() {
  console.log(colorize('📋 Available Test Suites:', 'bold'));
  console.log();
  
  Object.entries(TEST_SUITES).forEach(([key, suite]) => {
    const emoji = getEmojiForSuite(key);
    console.log(`${emoji} ${colorize(key.padEnd(15), 'cyan')} ${suite.name} ${colorize(`(${suite.duration})`, 'yellow')}`);
  });
  
  console.log('\n' + colorize('Usage:', 'bold'));
  console.log('  node run-qa-tests.js [suite] [options]');
  console.log('  npm run test:qa:[suite]');
  console.log('');
  console.log(colorize('Examples:', 'bold'));
  console.log('  node run-qa-tests.js smoke          # Quick validation');
  console.log('  node run-qa-tests.js comprehensive  # Full system test');
  console.log('  node run-qa-tests.js all            # Complete test suite');
  console.log('  node run-qa-tests.js all --debug    # With browser UI');
  console.log('  node run-qa-tests.js all --parallel # Parallel execution');
  console.log('');
  console.log(colorize('Options:', 'bold'));
  console.log('  --debug      Run with browser UI visible');
  console.log('  --parallel   Run tests in parallel');
  console.log('  --reporter   Specify reporter (html, list, json)');
  console.log('  --help       Show this help message');
}

function getEmojiForSuite(suite) {
  const emojis = {
    smoke: '🚀',
    comprehensive: '🎯', 
    console: '🚨',
    typography: '🔤',
    languages: '🌐',
    accessibility: '♿',
    performance: '⚡',
    all: '🏆'
  };
  return emojis[suite] || '🔍';
}

function checkPrerequisites() {
  console.log(colorize('🔍 Checking Prerequisites...', 'blue'));
  
  // Check if server is running
  try {
    execSync(`curl -s --connect-timeout 5 ${BASE_URL} > /dev/null`, { stdio: 'ignore' });
    console.log(`✅ Development server running at ${BASE_URL}`);
  } catch (error) {
    console.log(`❌ Development server not accessible at ${BASE_URL}`);
    console.log('   Please start the server with: python3 -m http.server 3005');
    process.exit(1);
  }
  
  // Check Playwright installation
  try {
    execSync('npx playwright --version', { stdio: 'ignore' });
    console.log('✅ Playwright installed');
  } catch (error) {
    console.log('❌ Playwright not found');
    console.log('   Please install with: npm install @playwright/test');
    process.exit(1);
  }
  
  // Check test files exist
  const testDir = path.join(__dirname, 'tests');
  if (!fs.existsSync(testDir)) {
    console.log('❌ Tests directory not found');
    process.exit(1);
  }
  console.log('✅ Test files found');
  console.log();
}

function runTestSuite(suiteName, options = {}) {
  const suite = TEST_SUITES[suiteName];
  if (!suite) {
    console.log(colorize(`❌ Unknown test suite: ${suiteName}`, 'red'));
    printUsage();
    process.exit(1);
  }
  
  console.log(colorize(`🎯 Running: ${suite.name}`, 'bold'));
  console.log(colorize(`⏱️  Estimated duration: ${suite.duration}`, 'yellow'));
  console.log(colorize(`📊 Coverage: ${suite.tests.length} test file${suite.tests.length > 1 ? 's' : ''}`, 'blue'));
  console.log();
  
  const startTime = Date.now();
  let totalPassed = 0;
  let totalFailed = 0;
  let results = [];
  
  for (const testFile of suite.tests) {
    console.log(colorize(`▶️  Running: ${testFile}`, 'cyan'));
    
    const testStartTime = Date.now();
    let command = `npx playwright test ${testFile}`;
    
    // Add options
    if (options.debug) {
      command += ' --debug --headed';
    }
    if (options.parallel && suite.tests.length > 1) {
      command += ' --workers=4';
    }
    if (options.reporter) {
      command += ` --reporter=${options.reporter}`;
    }
    
    try {
      const output = execSync(command, { 
        encoding: 'utf8',
        stdio: 'pipe',
        maxBuffer: 1024 * 1024 * 10 // 10MB buffer
      });
      
      const testDuration = Date.now() - testStartTime;
      
      // Parse Playwright output for pass/fail counts
      const passedMatch = output.match(/(\d+) passed/);
      const failedMatch = output.match(/(\d+) failed/);
      
      const passed = passedMatch ? parseInt(passedMatch[1]) : 0;
      const failed = failedMatch ? parseInt(failedMatch[1]) : 0;
      
      totalPassed += passed;
      totalFailed += failed;
      
      results.push({
        name: testFile,
        passed,
        failed,
        duration: testDuration,
        status: failed === 0 ? 'PASS' : 'FAIL'
      });
      
      const status = failed === 0 ? 
        colorize('✅ PASS', 'green') : 
        colorize('❌ FAIL', 'red');
      
      console.log(`   ${status} (${passed} passed, ${failed} failed) - ${Math.round(testDuration/1000)}s`);
      
    } catch (error) {
      const testDuration = Date.now() - testStartTime;
      totalFailed += 1;
      
      results.push({
        name: testFile,
        passed: 0,
        failed: 1,
        duration: testDuration,
        status: 'ERROR',
        error: error.message
      });
      
      console.log(`   ${colorize('❌ ERROR', 'red')} - ${Math.round(testDuration/1000)}s`);
      console.log(`   ${error.message.split('\n')[0]}`);
    }
    
    console.log();
  }
  
  // Generate summary
  const totalDuration = Date.now() - startTime;
  const totalTests = totalPassed + totalFailed;
  const successRate = totalTests === 0 ? 0 : Math.round((totalPassed / totalTests) * 100);
  
  console.log('='.repeat(80));
  console.log(colorize('📊 TEST SUITE SUMMARY', 'bold'));
  console.log('='.repeat(80));
  console.log(`Suite: ${suite.name}`);
  console.log(`Duration: ${Math.round(totalDuration/1000)}s (estimated: ${suite.duration})`);
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Passed: ${colorize(totalPassed.toString(), 'green')}`);
  console.log(`Failed: ${colorize(totalFailed.toString(), totalFailed > 0 ? 'red' : 'green')}`);
  console.log(`Success Rate: ${colorize(successRate + '%', successRate >= 90 ? 'green' : successRate >= 70 ? 'yellow' : 'red')}`);
  
  // Detailed results
  if (results.length > 1) {
    console.log('\n' + colorize('📋 Detailed Results:', 'bold'));
    results.forEach(result => {
      const statusColor = result.status === 'PASS' ? 'green' : 'red';
      const duration = Math.round(result.duration / 1000);
      console.log(`   ${colorize(result.status, statusColor)} ${result.name} (${duration}s)`);
      if (result.error) {
        console.log(`      Error: ${result.error.substring(0, 100)}`);
      }
    });
  }
  
  // Recommendations
  console.log('\n' + colorize('💡 Recommendations:', 'bold'));
  if (successRate === 100) {
    console.log('   🎉 Excellent! All tests passed. System is functioning well.');
  } else if (successRate >= 90) {
    console.log('   ✅ Good job! Minor issues detected. Review failed tests.');
  } else if (successRate >= 70) {
    console.log('   ⚠️  Several issues detected. Please address failing tests.');
  } else {
    console.log('   🚨 Major issues detected. System needs attention before deployment.');
  }
  
  if (totalFailed > 0) {
    console.log('   📝 Review test-results/html-report/index.html for detailed analysis');
    console.log('   🔍 Check console output above for specific error details');
  }
  
  console.log('='.repeat(80));
  
  // Exit with appropriate code
  process.exit(totalFailed === 0 ? 0 : 1);
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.length === 0) {
    printHeader();
    printUsage();
    process.exit(0);
  }
  
  const suiteName = args[0];
  const options = {
    debug: args.includes('--debug'),
    parallel: args.includes('--parallel'),
    reporter: args.find(arg => arg.startsWith('--reporter='))?.split('=')[1],
  };
  
  printHeader();
  checkPrerequisites();
  runTestSuite(suiteName, options);
}

// Handle process interruption
process.on('SIGINT', () => {
  console.log('\n' + colorize('🛑 Test execution interrupted by user', 'yellow'));
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('\n' + colorize('🛑 Test execution terminated', 'yellow'));
  process.exit(1);
});

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { TEST_SUITES, runTestSuite };