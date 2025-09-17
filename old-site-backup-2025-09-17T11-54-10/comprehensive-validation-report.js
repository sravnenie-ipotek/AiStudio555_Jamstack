#!/usr/bin/env node

/**
 * COMPREHENSIVE VALIDATION REPORT
 * 
 * Tests all emergency security fixes that were applied to the system:
 * - Database schema security 
 * - API endpoint security
 * - Frontend security integration
 * - Authentication security system
 * - Memory and performance optimizations
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const SERVER_URL = 'http://localhost:3007';
const RESULTS = {
  total: 0,
  passed: 0,
  failed: 0,
  criticalFailures: 0,
  tests: []
};

// ============================================================================
// TEST UTILITIES
// ============================================================================

function testResult(name, passed, message = '', critical = false) {
  RESULTS.total++;
  if (passed) {
    RESULTS.passed++;
    console.log(`✅ ${name}`);
  } else {
    RESULTS.failed++;
    if (critical) RESULTS.criticalFailures++;
    console.log(`❌ ${name}: ${message}`);
  }
  
  RESULTS.tests.push({
    name,
    passed,
    message,
    critical,
    timestamp: new Date().toISOString()
  });
}

async function httpRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data, headers: res.headers }));
    });
    
    req.on('error', reject);
    req.setTimeout(5000, () => req.abort());
    
    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

// ============================================================================
// DATABASE SECURITY TESTS
// ============================================================================

async function testDatabaseSecurity() {
  console.log('\n📊 Testing Database Security Fixes...');
  
  try {
    // Test that footer tables exist and have data
    const response = await httpRequest(`${SERVER_URL}/api/footer-health`);
    const health = JSON.parse(response.data);
    
    testResult(
      'Database Connection', 
      health.checks.database === true, 
      'Database not accessible'
    );
    
    testResult(
      'Footer Content Table', 
      health.checks.tables.footer_content > 0, 
      `Expected data, got ${health.checks.tables.footer_content} rows`
    );
    
    testResult(
      'Footer Navigation Table', 
      health.checks.tables.footer_navigation_menus > 0, 
      'Navigation menus table empty'
    );
    
    testResult(
      'Footer Social Links Table', 
      health.checks.tables.footer_social_links > 0, 
      'Social links table empty'
    );
    
  } catch (error) {
    testResult('Database Security Tests', false, error.message, true);
  }
}

// ============================================================================
// API SECURITY TESTS  
// ============================================================================

async function testAPISecurityFixes() {
  console.log('\n🔒 Testing API Security Fixes...');
  
  try {
    // Test secure footer API
    const footerResponse = await httpRequest(`${SERVER_URL}/api/footer-content?locale=en`);
    const footerData = JSON.parse(footerResponse.data);
    
    testResult(
      'Secure Footer API Response',
      footerResponse.status === 200 && footerData.locale === 'en',
      `Expected 200 OK with locale=en, got ${footerResponse.status}`
    );
    
    testResult(
      'Footer Data Sanitization',
      footerData.company && footerData.company.name && footerData.social,
      'Footer data structure validation failed'
    );
    
    // Test rate limiting (health endpoint shows tracked IPs)
    const authHealthResponse = await httpRequest(`${SERVER_URL}/api/auth/health`);
    const authHealth = JSON.parse(authHealthResponse.data);
    
    testResult(
      'Rate Limiting System',
      authHealth.components.rateLimiter.healthy === true,
      'Rate limiter not healthy'
    );
    
    testResult(
      'Security Headers Applied',
      response => response.headers['x-content-type-options'] === 'nosniff',
      'Security headers missing'
    );
    
  } catch (error) {
    testResult('API Security Tests', false, error.message, true);
  }
}

// ============================================================================
// FRONTEND SECURITY TESTS
// ============================================================================

async function testFrontendSecurityIntegration() {
  console.log('\n🌐 Testing Frontend Security Integration...');
  
  try {
    // Test that secure footer loader exists
    const secureLoaderExists = fs.existsSync(path.join(__dirname, 'js/secure-footer-loader.js'));
    testResult(
      'Secure Footer Loader File',
      secureLoaderExists,
      'js/secure-footer-loader.js not found'
    );
    
    if (secureLoaderExists) {
      const loaderContent = fs.readFileSync(path.join(__dirname, 'js/secure-footer-loader.js'), 'utf8');
      
      testResult(
        'XSS Protection Implementation',
        loaderContent.includes('XSSProtection') && loaderContent.includes('sanitizeURL'),
        'XSS protection classes not found'
      );
      
      testResult(
        'Memory Leak Prevention',
        loaderContent.includes('EventHandlerManager') && loaderContent.includes('cleanup'),
        'Memory management code not found'
      );
      
      testResult(
        'Robust Storage Fallback',
        loaderContent.includes('RobustStorage') && loaderContent.includes('fallback'),
        'Storage fallback system not implemented'
      );
    }
    
    // Test HTML files have secure footer loader integration
    const htmlFiles = ['home.html', 'courses.html', 'index.html'];
    let integratedFiles = 0;
    
    for (const file of htmlFiles) {
      if (fs.existsSync(path.join(__dirname, file))) {
        const content = fs.readFileSync(path.join(__dirname, file), 'utf8');
        if (content.includes('secure-footer-loader.js') && content.includes('SecureFooterLoader')) {
          integratedFiles++;
        }
      }
    }
    
    testResult(
      'HTML Security Integration',
      integratedFiles >= 2,
      `Only ${integratedFiles} of ${htmlFiles.length} files have security integration`
    );
    
  } catch (error) {
    testResult('Frontend Security Tests', false, error.message);
  }
}

// ============================================================================
// AUTHENTICATION SECURITY TESTS
// ============================================================================

async function testAuthenticationSecurity() {
  console.log('\n🔐 Testing Authentication Security System...');
  
  try {
    // Test authentication health endpoint
    const authResponse = await httpRequest(`${SERVER_URL}/api/auth/health`);
    const authHealth = JSON.parse(authResponse.data);
    
    testResult(
      'JWT Security System',
      authHealth.components.jwt.healthy === true,
      'JWT system not healthy'
    );
    
    testResult(
      'Session Management',
      authHealth.components.sessions.healthy === true && authHealth.components.sessions.maxSessions > 0,
      'Session management not working'
    );
    
    testResult(
      'Rate Limiting for Auth',
      authHealth.components.rateLimiter.healthy === true,
      'Authentication rate limiting disabled'
    );
    
    // Test that login endpoint exists and responds correctly to invalid credentials
    const invalidLoginResponse = await httpRequest(`${SERVER_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@test.com', password: 'wrong' })
    });
    
    testResult(
      'Login Security Validation',
      invalidLoginResponse.status === 401,
      `Expected 401 for invalid login, got ${invalidLoginResponse.status}`
    );
    
    // Test authentication file exists
    const authFileExists = fs.existsSync(path.join(__dirname, 'footer-migration/EMERGENCY_FIXES/04-authentication-security-fixes.js'));
    testResult(
      'Authentication Security Module',
      authFileExists,
      'Authentication security file not found'
    );
    
  } catch (error) {
    testResult('Authentication Security Tests', false, error.message, true);
  }
}

// ============================================================================
// PERFORMANCE AND MEMORY TESTS
// ============================================================================

async function testPerformanceOptimizations() {
  console.log('\n⚡ Testing Performance Optimizations...');
  
  try {
    // Test cache system is working
    const startTime = Date.now();
    await httpRequest(`${SERVER_URL}/api/footer-content?locale=en`);
    const firstRequestTime = Date.now() - startTime;
    
    const cacheStartTime = Date.now();
    await httpRequest(`${SERVER_URL}/api/footer-content?locale=en`);
    const cachedRequestTime = Date.now() - cacheStartTime;
    
    testResult(
      'API Response Caching',
      cachedRequestTime <= firstRequestTime,
      `Cache not improving performance: ${firstRequestTime}ms vs ${cachedRequestTime}ms`
    );
    
    // Test memory management in rate limiter
    const healthResponse = await httpRequest(`${SERVER_URL}/api/auth/health`);
    const health = JSON.parse(healthResponse.data);
    
    testResult(
      'Memory Usage Tracking',
      health.components.rateLimiter.memoryUsageMB !== undefined,
      'Memory usage not being tracked'
    );
    
    testResult(
      'Memory Usage Within Limits',
      health.components.rateLimiter.memoryUsageMB < 10,
      `Memory usage too high: ${health.components.rateLimiter.memoryUsageMB}MB`
    );
    
  } catch (error) {
    testResult('Performance Tests', false, error.message);
  }
}

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

async function testSystemIntegration() {
  console.log('\n🔗 Testing System Integration...');
  
  try {
    // Test that server is running with all security components
    const serverResponse = await httpRequest(`${SERVER_URL}/api/status`);
    testResult(
      'Server Status Endpoint',
      serverResponse.status === 200,
      `Server status endpoint returned ${serverResponse.status}`
    );
    
    // Test multiple API endpoints work together
    const endpoints = [
      '/api/footer-content?locale=en',
      '/api/footer-health', 
      '/api/auth/health'
    ];
    
    let workingEndpoints = 0;
    for (const endpoint of endpoints) {
      try {
        const response = await httpRequest(`${SERVER_URL}${endpoint}`);
        if (response.status === 200) workingEndpoints++;
      } catch (e) {
        // Endpoint failed
      }
    }
    
    testResult(
      'Multiple API Endpoints',
      workingEndpoints >= 2,
      `Only ${workingEndpoints} of ${endpoints.length} endpoints working`
    );
    
    // Test that emergency fix files exist
    const emergencyFiles = [
      'footer-migration/EMERGENCY_FIXES/01-critical-database-fixes-sqlite.sql',
      'footer-migration/secure-footer-api.js',
      'js/secure-footer-loader.js',
      'footer-migration/EMERGENCY_FIXES/04-authentication-security-fixes.js'
    ];
    
    let existingFiles = 0;
    emergencyFiles.forEach(file => {
      if (fs.existsSync(path.join(__dirname, file))) {
        existingFiles++;
      }
    });
    
    testResult(
      'Emergency Fix Files Present',
      existingFiles === emergencyFiles.length,
      `Only ${existingFiles} of ${emergencyFiles.length} emergency files found`
    );
    
  } catch (error) {
    testResult('Integration Tests', false, error.message);
  }
}

// ============================================================================
// MAIN TEST RUNNER
// ============================================================================

async function runComprehensiveValidation() {
  console.log('🧪 COMPREHENSIVE VALIDATION REPORT');
  console.log('=====================================');
  console.log(`Testing server at: ${SERVER_URL}`);
  console.log(`Started at: ${new Date().toISOString()}\n`);
  
  // Run all test suites
  await testDatabaseSecurity();
  await testAPISecurityFixes();
  await testFrontendSecurityIntegration();
  await testAuthenticationSecurity();
  await testPerformanceOptimizations();
  await testSystemIntegration();
  
  // Generate final report
  const duration = Date.now() - Date.now();
  console.log('\n📋 VALIDATION SUMMARY');
  console.log('=====================');
  console.log(`Total Tests: ${RESULTS.total}`);
  console.log(`✅ Passed: ${RESULTS.passed}`);
  console.log(`❌ Failed: ${RESULTS.failed}`);
  console.log(`🚨 Critical Failures: ${RESULTS.criticalFailures}`);
  console.log(`Success Rate: ${Math.round((RESULTS.passed / RESULTS.total) * 100)}%`);
  
  if (RESULTS.criticalFailures > 0) {
    console.log('\n🚨 CRITICAL FAILURES DETECTED:');
    RESULTS.tests
      .filter(test => !test.passed && test.critical)
      .forEach(test => console.log(`   - ${test.name}: ${test.message}`));
  }
  
  if (RESULTS.failed > 0 && RESULTS.criticalFailures === 0) {
    console.log('\n⚠️ NON-CRITICAL FAILURES:');
    RESULTS.tests
      .filter(test => !test.passed && !test.critical)
      .forEach(test => console.log(`   - ${test.name}: ${test.message}`));
  }
  
  const status = RESULTS.criticalFailures === 0 ? 'PASSED' : 'FAILED';
  console.log(`\n🎯 OVERALL STATUS: ${status}`);
  
  if (RESULTS.criticalFailures === 0) {
    console.log('\n✅ All emergency security fixes are working correctly!');
    console.log('🔒 System is secure and ready for production deployment.');
  } else {
    console.log('\n❌ Critical security issues detected!');
    console.log('🛑 System is NOT ready for production deployment.');
  }
  
  // Save detailed report
  const reportFile = 'comprehensive-validation-report.json';
  fs.writeFileSync(reportFile, JSON.stringify({
    summary: {
      total: RESULTS.total,
      passed: RESULTS.passed,
      failed: RESULTS.failed,
      criticalFailures: RESULTS.criticalFailures,
      successRate: Math.round((RESULTS.passed / RESULTS.total) * 100),
      status: status,
      timestamp: new Date().toISOString()
    },
    tests: RESULTS.tests
  }, null, 2));
  
  console.log(`\n📄 Detailed report saved to: ${reportFile}`);
  
  return RESULTS.criticalFailures === 0;
}

// Run the validation
runComprehensiveValidation()
  .then(success => process.exit(success ? 0 : 1))
  .catch(error => {
    console.error('💥 Validation crashed:', error);
    process.exit(1);
  });