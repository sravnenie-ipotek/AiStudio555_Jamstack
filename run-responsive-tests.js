#!/usr/bin/env node

const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

// Configuration
const BASE_URL = 'http://localhost:3005';
const TEST_PAGES = ['home.html', 'courses.html', 'teachers.html', 'career-center.html', 'career-orientation.html'];

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Check if server is running
function checkServer(url) {
  return new Promise((resolve) => {
    const urlParts = new URL(url);
    const options = {
      hostname: urlParts.hostname,
      port: urlParts.port,
      path: '/',
      method: 'HEAD',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      resolve(res.statusCode === 200);
    });

    req.on('error', () => resolve(false));
    req.on('timeout', () => resolve(false));
    req.end();
  });
}

// Start Python server
function startPythonServer() {
  return new Promise((resolve, reject) => {
    log('🚀 Starting Python HTTP server on port 3005...', 'blue');
    
    const server = spawn('python3', ['-m', 'http.server', '3005'], {
      stdio: 'pipe',
      detached: false
    });

    let serverReady = false;

    server.stdout.on('data', (data) => {
      const output = data.toString();
      log(`Server: ${output.trim()}`, 'cyan');
      if (output.includes('Serving HTTP') && !serverReady) {
        serverReady = true;
        setTimeout(() => resolve(server), 2000); // Give server time to fully start
      }
    });

    server.stderr.on('data', (data) => {
      log(`Server error: ${data.toString().trim()}`, 'red');
    });

    server.on('error', (error) => {
      reject(error);
    });

    // Timeout after 10 seconds
    setTimeout(() => {
      if (!serverReady) {
        reject(new Error('Server failed to start within 10 seconds'));
      }
    }, 10000);
  });
}

// Check if pages exist
async function checkPages() {
  log('📄 Checking if test pages exist...', 'blue');
  
  const missingPages = [];
  
  for (const page of TEST_PAGES) {
    const pagePath = path.join(__dirname, page);
    if (!fs.existsSync(pagePath)) {
      missingPages.push(page);
    } else {
      log(`✅ Found: ${page}`, 'green');
    }
  }
  
  if (missingPages.length > 0) {
    log(`❌ Missing pages: ${missingPages.join(', ')}`, 'red');
    log('⚠️  Tests will fail for missing pages', 'yellow');
  }
  
  return missingPages;
}

// Run Playwright tests
function runPlaywrightTests() {
  return new Promise((resolve, reject) => {
    log('🎭 Running Playwright responsive tests...', 'blue');
    
    const testProcess = spawn('npx', ['playwright', 'test', '--reporter=list'], {
      stdio: 'inherit'
    });

    testProcess.on('close', (code) => {
      if (code === 0) {
        log('✅ All tests completed successfully!', 'green');
        resolve();
      } else {
        log(`❌ Tests failed with exit code ${code}`, 'red');
        resolve(); // Don't reject, we still want to see results
      }
    });

    testProcess.on('error', (error) => {
      log(`Test execution error: ${error.message}`, 'red');
      reject(error);
    });
  });
}

// Generate test report
function generateReport() {
  log('📊 Generating test report...', 'blue');
  
  const reportPath = path.join(__dirname, 'test-results', 'html-report', 'index.html');
  const screenshotsDir = path.join(__dirname, 'test-results', 'screenshots');
  
  if (fs.existsSync(reportPath)) {
    log(`📈 HTML report available at: file://${reportPath}`, 'green');
  }
  
  if (fs.existsSync(screenshotsDir)) {
    const screenshots = fs.readdirSync(screenshotsDir).filter(file => file.endsWith('.png'));
    log(`📸 Generated ${screenshots.length} screenshots in: ${screenshotsDir}`, 'green');
    
    // Log first few screenshot names as examples
    if (screenshots.length > 0) {
      log('📷 Sample screenshots:', 'cyan');
      screenshots.slice(0, 5).forEach(screenshot => {
        log(`   • ${screenshot}`, 'cyan');
      });
      if (screenshots.length > 5) {
        log(`   ... and ${screenshots.length - 5} more`, 'cyan');
      }
    }
  }
}

// Main execution
async function main() {
  try {
    log('🎯 Starting Responsive Testing Suite', 'blue');
    log('=' .repeat(50), 'blue');
    
    // Check if pages exist
    await checkPages();
    
    // Check if server is already running
    const serverRunning = await checkServer(BASE_URL);
    let server = null;
    
    if (!serverRunning) {
      // Start Python server
      server = await startPythonServer();
      
      // Wait a bit more and check again
      await new Promise(resolve => setTimeout(resolve, 2000));
      const serverNowRunning = await checkServer(BASE_URL);
      
      if (!serverNowRunning) {
        throw new Error('Failed to start server or server not responding');
      }
      
      log('✅ Server is running and responding', 'green');
    } else {
      log('✅ Server already running', 'green');
    }
    
    // Run tests
    await runPlaywrightTests();
    
    // Generate report
    generateReport();
    
    log('=' .repeat(50), 'blue');
    log('🎉 Responsive testing complete!', 'green');
    
    // Clean up
    if (server) {
      log('🧹 Stopping test server...', 'yellow');
      server.kill('SIGTERM');
    }
    
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  log('\n🛑 Testing interrupted by user', 'yellow');
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('\n🛑 Testing terminated', 'yellow');
  process.exit(0);
});

// Run the main function
main();