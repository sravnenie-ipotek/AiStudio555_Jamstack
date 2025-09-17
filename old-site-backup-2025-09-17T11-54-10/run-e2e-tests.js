#!/usr/bin/env node

/**
 * Comprehensive E2E Test Runner for AI Studio E-Learning Platform
 * 
 * Usage:
 *   node run-e2e-tests.js [suite] [options]
 * 
 * Test Suites:
 *   all          - Run all test suites (default)
 *   smoke        - Quick smoke tests for critical functionality
 *   multilang    - Multi-language and localization tests
 *   accessibility - WCAG compliance and accessibility tests
 *   performance  - Performance and Core Web Vitals tests
 *   visual       - Visual regression tests
 *   forms        - Form validation and interaction tests
 *   api          - API response and integration tests
 *   seo          - SEO meta tags and optimization tests
 *   privacy      - Cookie and data privacy compliance tests
 * 
 * Options:
 *   --browser    - Specify browser: chromium, firefox, safari, all (default: chromium)
 *   --headed     - Run tests in headed mode
 *   --debug      - Enable debug mode with detailed output
 *   --parallel   - Run tests in parallel
 *   --workers    - Number of workers (default: 4)
 *   --timeout    - Test timeout in seconds (default: 60)
 *   --retry      - Number of retries for failed tests (default: 0)
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Test suite configurations
const testSuites = {
  smoke: {
    name: 'Smoke Tests',
    description: 'Critical functionality and quick health checks',
    tests: [
      'tests/console-errors.spec.js',
      'tests/form-validation.spec.js',
      'tests/api-testing.spec.js'
    ],
    timeout: 30,
    projects: ['chromium-desktop']
  },
  
  multilang: {
    name: 'Multi-Language Tests',
    description: 'Localization, RTL support, and language switching',
    tests: [
      'tests/multi-language.spec.js',
      'tests/typography.spec.js'
    ],
    timeout: 45,
    projects: ['chromium-desktop', 'firefox-desktop']
  },
  
  accessibility: {
    name: 'Accessibility Tests',
    description: 'WCAG compliance, keyboard navigation, screen reader support',
    tests: [
      'tests/accessibility.spec.js',
      'tests/typography.spec.js'
    ],
    timeout: 60,
    projects: ['chromium-desktop', 'mobile-chrome']
  },
  
  performance: {
    name: 'Performance Tests',
    description: 'Core Web Vitals, loading times, resource optimization',
    tests: [
      'tests/performance.spec.js'
    ],
    timeout: 90,
    projects: ['performance-testing', 'mobile-chrome']
  },
  
  visual: {
    name: 'Visual Regression Tests',
    description: 'Cross-browser visual consistency and UI components',
    tests: [
      'tests/visual-regression.spec.js'
    ],
    timeout: 120,
    projects: ['visual-regression']
  },
  
  forms: {
    name: 'Form Validation Tests',
    description: 'Contact forms, validation, user input handling',
    tests: [
      'tests/form-validation.spec.js'
    ],
    timeout: 45,
    projects: ['chromium-desktop', 'mobile-chrome', 'mobile-safari']
  },
  
  api: {
    name: 'API Integration Tests',
    description: 'API responses, data structure, error handling',
    tests: [
      'tests/api-testing.spec.js'
    ],
    timeout: 60,
    projects: ['api-testing']
  },
  
  seo: {
    name: 'SEO Optimization Tests',
    description: 'Meta tags, structured data, social media optimization',
    tests: [
      'tests/seo-testing.spec.js'
    ],
    timeout: 45,
    projects: ['chromium-desktop']
  },
  
  privacy: {
    name: 'Privacy Compliance Tests',
    description: 'Cookie consent, data storage, GDPR compliance',
    tests: [
      'tests/storage-testing.spec.js'
    ],
    timeout: 45,
    projects: ['chromium-desktop', 'firefox-desktop']
  },
  
  all: {
    name: 'Complete Test Suite',
    description: 'All E2E tests for comprehensive platform validation',
    tests: [
      'tests/multi-language.spec.js',
      'tests/console-errors.spec.js',
      'tests/typography.spec.js',
      'tests/accessibility.spec.js',
      'tests/performance.spec.js',
      'tests/visual-regression.spec.js',
      'tests/form-validation.spec.js',
      'tests/api-testing.spec.js',
      'tests/seo-testing.spec.js',
      'tests/storage-testing.spec.js'
    ],
    timeout: 180,
    projects: ['chromium-desktop', 'firefox-desktop', 'mobile-chrome']
  }
};

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    suite: 'all',
    browser: 'chromium',
    headed: false,
    debug: false,
    parallel: false,
    workers: 4,
    timeout: 60,
    retry: 0,
    help: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--headed') {
      options.headed = true;
    } else if (arg === '--debug') {
      options.debug = true;
    } else if (arg === '--parallel') {
      options.parallel = true;
    } else if (arg.startsWith('--browser=')) {
      options.browser = arg.split('=')[1];
    } else if (arg.startsWith('--workers=')) {
      options.workers = parseInt(arg.split('=')[1]);
    } else if (arg.startsWith('--timeout=')) {
      options.timeout = parseInt(arg.split('=')[1]);
    } else if (arg.startsWith('--retry=')) {
      options.retry = parseInt(arg.split('=')[1]);
    } else if (arg === '--browser' && i + 1 < args.length) {
      options.browser = args[++i];
    } else if (arg === '--workers' && i + 1 < args.length) {
      options.workers = parseInt(args[++i]);
    } else if (arg === '--timeout' && i + 1 < args.length) {
      options.timeout = parseInt(args[++i]);
    } else if (arg === '--retry' && i + 1 < args.length) {
      options.retry = parseInt(args[++i]);
    } else if (!arg.startsWith('-')) {
      options.suite = arg;
    }
  }

  return options;
}

// Display help information
function showHelp() {
  console.log(`
🧪 AI Studio E-Learning Platform E2E Test Runner

Usage: node run-e2e-tests.js [suite] [options]

📋 Available Test Suites:
`);

  Object.entries(testSuites).forEach(([key, suite]) => {
    console.log(`   ${key.padEnd(12)} - ${suite.description}`);
  });

  console.log(`
🔧 Options:
   --browser     Browser to use: chromium, firefox, safari, all (default: chromium)
   --headed      Run tests with browser UI visible
   --debug       Enable detailed debug output
   --parallel    Run tests in parallel
   --workers N   Number of parallel workers (default: 4)
   --timeout N   Test timeout in seconds (default: 60)
   --retry N     Number of retries for failed tests (default: 0)
   --help, -h    Show this help message

📖 Examples:
   node run-e2e-tests.js smoke                    # Quick smoke tests
   node run-e2e-tests.js accessibility --headed   # Accessibility tests with UI
   node run-e2e-tests.js all --parallel          # All tests in parallel
   node run-e2e-tests.js forms --browser=firefox  # Form tests in Firefox
   node run-e2e-tests.js --debug                 # All tests with debug output
`);
}

// Run Playwright tests
async function runTests(options) {
  const suite = testSuites[options.suite];
  
  if (!suite) {
    console.error(`❌ Unknown test suite: ${options.suite}`);
    console.log('Available suites:', Object.keys(testSuites).join(', '));
    process.exit(1);
  }

  console.log(`🚀 Running ${suite.name}`);
  console.log(`📝 ${suite.description}`);
  console.log(`🧪 Tests: ${suite.tests.length}`);
  console.log(`⏱️  Timeout: ${options.timeout}s`);
  console.log(`🔄 Retries: ${options.retry}`);
  console.log(`👥 Workers: ${options.workers}`);
  console.log('');

  // Build Playwright command
  const playwrightArgs = [
    'test',
    ...suite.tests,
    `--timeout=${options.timeout * 1000}`,
    `--retries=${options.retry}`,
    `--workers=${options.workers}`
  ];

  // Add browser projects
  if (options.browser === 'all') {
    // Use all projects defined in suite
    suite.projects.forEach(project => {
      playwrightArgs.push(`--project=${project}`);
    });
  } else {
    // Use specific browser
    const browserProject = suite.projects.find(p => p.includes(options.browser)) || 
                          suite.projects[0];
    playwrightArgs.push(`--project=${browserProject}`);
  }

  // Add additional options
  if (options.headed) {
    playwrightArgs.push('--headed');
  }

  if (options.debug) {
    playwrightArgs.push('--debug');
  }

  if (options.parallel) {
    process.env.PARALLEL = 'true';
  }

  // Set environment variables
  process.env.WORKERS = options.workers.toString();

  console.log(`🔧 Command: npx playwright ${playwrightArgs.join(' ')}`);
  console.log('');

  // Execute tests
  return new Promise((resolve, reject) => {
    const child = spawn('npx', ['playwright', ...playwrightArgs], {
      stdio: 'inherit',
      env: { ...process.env }
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log('');
        console.log('✅ Tests completed successfully!');
        console.log('');
        console.log('📊 View detailed results:');
        console.log('   HTML Report: test-results/html-report/index.html');
        console.log('   JSON Results: test-results/results.json');
        console.log('   Screenshots: test-results/screenshots/');
        resolve();
      } else {
        console.log('');
        console.log(`❌ Tests failed with exit code ${code}`);
        reject(new Error(`Tests failed with exit code ${code}`));
      }
    });

    child.on('error', (error) => {
      console.error('❌ Failed to start tests:', error.message);
      reject(error);
    });
  });
}

// Check prerequisites
function checkPrerequisites() {
  const errors = [];

  // Check if Playwright is installed
  try {
    require('@playwright/test');
  } catch (error) {
    errors.push('Playwright is not installed. Run: npm install @playwright/test');
  }

  // Check if test files exist
  const testDir = path.join(__dirname, 'tests');
  if (!fs.existsSync(testDir)) {
    errors.push('Tests directory not found');
  }

  // Check critical files
  const criticalFiles = [
    'playwright.config.js',
    'package.json'
  ];

  criticalFiles.forEach(file => {
    if (!fs.existsSync(path.join(__dirname, file))) {
      errors.push(`Required file missing: ${file}`);
    }
  });

  if (errors.length > 0) {
    console.error('❌ Prerequisites check failed:');
    errors.forEach(error => console.error(`   - ${error}`));
    process.exit(1);
  }
}

// Main execution
async function main() {
  const options = parseArgs();

  if (options.help) {
    showHelp();
    return;
  }

  console.log('🔍 Checking prerequisites...');
  checkPrerequisites();

  console.log('🎯 AI Studio E-Learning Platform E2E Testing');
  console.log('══════════════════════════════════════════════');

  try {
    await runTests(options);
  } catch (error) {
    console.error('💥 Test execution failed:', error.message);
    process.exit(1);
  }
}

// Handle unhandled errors
process.on('unhandledRejection', (error) => {
  console.error('💥 Unhandled error:', error);
  process.exit(1);
});

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { testSuites, runTests, parseArgs };