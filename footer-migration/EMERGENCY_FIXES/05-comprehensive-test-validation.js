/**
 * COMPREHENSIVE TEST VALIDATION SUITE
 * 
 * Real tests for all emergency fixes applied to the footer migration system.
 * Tests actual implementations, not simulations, to ensure all critical bugs are resolved.
 * 
 * This suite tests:
 * - Database schema integrity and constraints
 * - API security fixes and vulnerability patches  
 * - Frontend XSS prevention and security measures
 * - Authentication and JWT security improvements
 * - Memory leak prevention and performance fixes
 */

const assert = require('assert');
const { Pool } = require('pg');
const crypto = require('crypto');
const fs = require('fs').promises;

// Import the fixed components
const { 
  SecureJWTManager, 
  AdvancedRateLimiter, 
  SecureSessionManager,
  PasswordSecurity,
  createSecureAuthMiddleware 
} = require('./04-authentication-security-fixes');

// Test configuration
const TEST_CONFIG = {
  // Use test database to avoid affecting production
  DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://test:test@localhost:5432/footer_test',
  
  // Test API endpoints
  API_BASE_URL: process.env.TEST_API_URL || 'http://localhost:3001',
  
  // Test timeout
  TEST_TIMEOUT: 30000,
  
  // Verbose logging
  VERBOSE: process.env.TEST_VERBOSE === 'true'
};

// ============================================================================
// TEST SUITE CLASS
// ============================================================================

class ComprehensiveTestSuite {
  constructor() {
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      criticalFailures: 0,
      startTime: Date.now(),
      tests: []
    };
    
    this.dbPool = null;
    this.testDb = null;
  }
  
  async initialize() {
    console.log('🧪 Initializing comprehensive test suite...');
    
    try {
      // Initialize test database connection
      this.dbPool = new Pool({
        connectionString: TEST_CONFIG.DATABASE_URL,
        max: 5,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });
      
      // Test database connection
      await this.dbPool.query('SELECT 1');
      console.log('✅ Test database connection established');
      
    } catch (error) {
      console.error('❌ Failed to initialize test database:', error.message);
      console.log('⚠️ Some tests will be skipped');
    }
  }
  
  async runAllTests() {
    console.log('\n🚀 Starting comprehensive test validation...\n');
    
    const testSuites = [
      () => this.testDatabaseSchemaIntegrity(),
      () => this.testAPISecurityFixes(), 
      () => this.testFrontendSecurityFixes(),
      () => this.testAuthenticationSecurity(),
      () => this.testMemoryLeakPrevention(),
      () => this.testPerformanceOptimizations(),
      () => this.testRealWorldScenarios()
    ];
    
    for (const testSuite of testSuites) {
      try {
        await testSuite();
      } catch (error) {
        console.error('❌ Test suite crashed:', error.message);
        this.results.criticalFailures++;
      }
    }
    
    return this.generateReport();
  }
  
  // ============================================================================
  // DATABASE SCHEMA INTEGRITY TESTS
  // ============================================================================
  
  async testDatabaseSchemaIntegrity() {
    console.log('📊 Testing database schema integrity fixes...');
    
    if (!this.dbPool) {
      this.skipTest('Database Schema Tests', 'No database connection');
      return;
    }
    
    await this.testForeignKeyConstraints();
    await this.testUniqueConstraintLogic();
    await this.testAuditTriggerFix();
    await this.testJSONBValidation();
    await this.testEmailURLValidation();
  }
  
  async testForeignKeyConstraints() {
    const testName = 'Foreign Key Constraints';
    
    try {
      // Test that foreign key constraints were added correctly
      const constraintQuery = `
        SELECT 
          tc.constraint_name,
          tc.table_name,
          kcu.column_name,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu 
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage ccu 
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_name IN ('footer_navigation_menus', 'footer_social_links', 'footer_newsletter_config')
      `;
      
      const result = await this.dbPool.query(constraintQuery);
      
      // Should have at least 3 foreign key constraints
      assert(result.rows.length >= 3, 'Missing foreign key constraints');
      
      // Test that orphaned records are prevented
      try {
        await this.dbPool.query(`
          INSERT INTO footer_navigation_menus (locale, menu_type, menu_items) 
          VALUES ('nonexistent', 'test', '[]')
        `);
        
        // Should not reach here - foreign key should prevent insertion
        assert.fail('Foreign key constraint not working - orphaned record allowed');
        
      } catch (fkError) {
        // This is expected - foreign key constraint should prevent the insertion
        assert(fkError.code === '23503', 'Expected foreign key violation error');
      }
      
      this.passTest(testName, 'Foreign key constraints working correctly');
      
    } catch (error) {
      this.failTest(testName, `Foreign key constraint test failed: ${error.message}`, true);
    }
  }
  
  async testUniqueConstraintLogic() {
    const testName = 'Fixed Unique Constraint Logic';
    
    try {
      // Test the new partial unique index for published content
      const indexQuery = `
        SELECT indexname, indexdef 
        FROM pg_indexes 
        WHERE tablename = 'footer_content' 
          AND indexdef LIKE '%WHERE published = true%'
      `;
      
      const result = await this.dbPool.query(indexQuery);
      assert(result.rows.length >= 1, 'Partial unique index not found');
      
      // Test that multiple unpublished versions are allowed
      await this.dbPool.query(`
        INSERT INTO footer_content (locale, published, company_name) 
        VALUES ('en', false, 'Test 1'), ('en', false, 'Test 2')
      `);
      
      // Test that only one published version per locale is allowed
      await this.dbPool.query(`
        INSERT INTO footer_content (locale, published, company_name) 
        VALUES ('test_locale', true, 'Published 1')
      `);
      
      try {
        await this.dbPool.query(`
          INSERT INTO footer_content (locale, published, company_name) 
          VALUES ('test_locale', true, 'Published 2')
        `);
        
        assert.fail('Unique constraint not working - multiple published versions allowed');
        
      } catch (uniqueError) {
        assert(uniqueError.code === '23505', 'Expected unique constraint violation');
      }
      
      this.passTest(testName, 'Unique constraint logic fixed correctly');
      
    } catch (error) {
      this.failTest(testName, `Unique constraint test failed: ${error.message}`, true);
    }
  }
  
  async testAuditTriggerFix() {
    const testName = 'Audit Trigger Return Value Fix';
    
    try {
      // Insert test record
      const insertResult = await this.dbPool.query(`
        INSERT INTO footer_content (locale, company_name) 
        VALUES ('audit_test', 'Test Company')
        RETURNING id
      `);
      
      const testId = insertResult.rows[0].id;
      
      // Update the record
      await this.dbPool.query(`
        UPDATE footer_content 
        SET company_name = 'Updated Company' 
        WHERE id = $1
      `, [testId]);
      
      // Check audit log
      const auditResult = await this.dbPool.query(`
        SELECT action, old_values, new_values 
        FROM footer_audit_log 
        WHERE table_name = 'footer_content' AND record_id = $1
        ORDER BY created_at DESC
        LIMIT 2
      `, [testId]);
      
      assert(auditResult.rows.length >= 2, 'Audit records not created');
      assert(auditResult.rows[0].action === 'UPDATE', 'Audit UPDATE not recorded');
      assert(auditResult.rows[1].action === 'INSERT', 'Audit INSERT not recorded');
      
      // Test DELETE operation (the original bug)
      await this.dbPool.query(`DELETE FROM footer_content WHERE id = $1`, [testId]);
      
      const deleteAudit = await this.dbPool.query(`
        SELECT action, old_values 
        FROM footer_audit_log 
        WHERE table_name = 'footer_content' AND record_id = $1 AND action = 'DELETE'
        LIMIT 1
      `, [testId]);
      
      assert(deleteAudit.rows.length === 1, 'DELETE audit not recorded');
      assert(deleteAudit.rows[0].old_values !== null, 'DELETE audit missing old_values');
      
      this.passTest(testName, 'Audit trigger return value fixed');
      
    } catch (error) {
      this.failTest(testName, `Audit trigger test failed: ${error.message}`, true);
    }
  }
  
  async testJSONBValidation() {
    const testName = 'JSONB Structure Validation';
    
    try {
      // Test menu items validation
      try {
        await this.dbPool.query(`
          INSERT INTO footer_navigation_menus (locale, menu_type, menu_items) 
          VALUES ('en', 'test', 'invalid json')
        `);
        
        assert.fail('JSONB validation not working - invalid JSON allowed');
        
      } catch (jsonError) {
        assert(jsonError.code === '22P02' || jsonError.code === '23514', 'Expected JSON validation error');
      }
      
      // Test that valid menu items work
      await this.dbPool.query(`
        INSERT INTO footer_navigation_menus (locale, menu_type, menu_items) 
        VALUES ('en', 'valid_test', $1)
      `, [JSON.stringify([{
        text: 'Home',
        url: '/home',
        target: '_self',
        order: 1,
        visible: true
      }])]);
      
      this.passTest(testName, 'JSONB validation working correctly');
      
    } catch (error) {
      this.failTest(testName, `JSONB validation test failed: ${error.message}`, true);
    }
  }
  
  async testEmailURLValidation() {
    const testName = 'Email and URL Validation Constraints';
    
    try {
      // Test invalid email rejection
      try {
        await this.dbPool.query(`
          INSERT INTO footer_content (locale, contact_email) 
          VALUES ('test', 'invalid-email')
        `);
        
        assert.fail('Email validation not working - invalid email allowed');
        
      } catch (emailError) {
        assert(emailError.code === '23514', 'Expected check constraint violation for email');
      }
      
      // Test dangerous URL rejection  
      try {
        await this.dbPool.query(`
          INSERT INTO footer_content (locale, company_logo_url) 
          VALUES ('test', 'javascript:alert(1)')
        `);
        
        assert.fail('URL validation not working - dangerous URL allowed');
        
      } catch (urlError) {
        assert(urlError.code === '23514', 'Expected check constraint violation for URL');
      }
      
      // Test that valid data works
      await this.dbPool.query(`
        INSERT INTO footer_content (locale, contact_email, company_logo_url) 
        VALUES ('valid_test', 'test@example.com', 'https://example.com/logo.png')
      `);
      
      this.passTest(testName, 'Email and URL validation working correctly');
      
    } catch (error) {
      this.failTest(testName, `Email/URL validation test failed: ${error.message}`, true);
    }
  }
  
  // ============================================================================
  // API SECURITY FIXES TESTS
  // ============================================================================
  
  async testAPISecurityFixes() {
    console.log('🛡️ Testing API security fixes...');
    
    await this.testSecureCache();
    await this.testRateLimiterMemoryManagement();
    await this.testErrorResponseSanitization();
  }
  
  async testSecureCache() {
    const testName = 'Secure Cache with Size Limits';
    
    try {
      // Import and test the SecureCache class from the API fixes
      const SecureCacheCode = await fs.readFile(
        '/Users/michaelmishayev/Desktop/newCode/footer-migration/EMERGENCY_FIXES/02-api-security-fixes.js',
        'utf8'
      );
      
      // Safely evaluate the SecureCache class
      const cacheMatch = SecureCacheCode.match(/class SecureCache \{[\s\S]*?\n\}/);
      assert(cacheMatch, 'SecureCache class not found in API fixes');
      
      // Test cache size limits by creating cache with small limits
      const { SecureCache } = require('./02-api-security-fixes');
      const cache = new SecureCache({ maxSize: 3, ttl: 1000 });
      
      // Add items up to limit
      await cache.set('item1', 'data1');
      await cache.set('item2', 'data2'); 
      await cache.set('item3', 'data3');
      
      // Adding 4th item should trigger eviction
      await cache.set('item4', 'data4');
      
      // Check that cache size is maintained
      const stats = cache.getStats();
      assert(stats.size <= 3, 'Cache size limit not enforced');
      
      // Test TTL expiration
      await new Promise(resolve => setTimeout(resolve, 1100));
      const expiredItem = await cache.get('item1');
      assert(expiredItem === null, 'TTL expiration not working');
      
      cache.destroy();
      this.passTest(testName, 'Secure cache working with size limits and TTL');
      
    } catch (error) {
      this.failTest(testName, `Secure cache test failed: ${error.message}`, true);
    }
  }
  
  async testRateLimiterMemoryManagement() {
    const testName = 'Rate Limiter Memory Management';
    
    try {
      const { ManagedRateLimiter } = require('./02-api-security-fixes');
      const limiter = new ManagedRateLimiter({
        windowMs: 1000,
        maxAttempts: 3,
        maxIPs: 10
      });
      
      // Test basic rate limiting
      assert(limiter.isAllowed('192.168.1.1'), 'First request should be allowed');
      assert(limiter.isAllowed('192.168.1.1'), 'Second request should be allowed');
      assert(limiter.isAllowed('192.168.1.1'), 'Third request should be allowed');
      assert(!limiter.isAllowed('192.168.1.1'), 'Fourth request should be blocked');
      
      // Test memory limits by adding many IPs
      for (let i = 0; i < 20; i++) {
        limiter.isAllowed(`192.168.1.${i}`);
      }
      
      const stats = limiter.getStats();
      assert(stats.activeIPs <= stats.maxIPs, 'Memory limit not enforced');
      
      limiter.destroy();
      this.passTest(testName, 'Rate limiter memory management working');
      
    } catch (error) {
      this.failTest(testName, `Rate limiter test failed: ${error.message}`, true);
    }
  }
  
  async testErrorResponseSanitization() {
    const testName = 'Error Response Sanitization';
    
    try {
      const { SecureErrorHandler } = require('./02-api-security-fixes');
      
      // Test that sensitive information is removed
      const sensitiveError = new Error('Database connection failed: postgresql://user:password@localhost:5432/db');
      const sanitized = SecureErrorHandler.sanitizeError(sensitiveError, true);
      
      assert(!JSON.stringify(sanitized).includes('password'), 'Password not sanitized from error');
      assert(sanitized.error === 'Internal server error', 'Error message not sanitized for production');
      
      // Test database error mapping
      const dbError = new Error('Duplicate key violation');
      dbError.code = '23505';
      const mapped = SecureErrorHandler.handleDatabaseError(dbError);
      
      assert(mapped.error === 'This record already exists', 'Database error not properly mapped');
      
      this.passTest(testName, 'Error response sanitization working correctly');
      
    } catch (error) {
      this.failTest(testName, `Error sanitization test failed: ${error.message}`, true);
    }
  }
  
  // ============================================================================
  // FRONTEND SECURITY FIXES TESTS  
  // ============================================================================
  
  async testFrontendSecurityFixes() {
    console.log('🌐 Testing frontend security fixes...');
    
    await this.testXSSProtection();
    await this.testRobustStorage();
    await this.testEventHandlerManagement();
    await this.testAtomicLoadingManager();
  }
  
  async testXSSProtection() {
    const testName = 'XSS Protection System';
    
    try {
      const { XSSProtection } = require('./03-frontend-security-fixes');
      
      // Test HTML escaping
      const dangerous = '<script>alert("xss")</script>';
      const escaped = XSSProtection.escapeHTML(dangerous);
      assert(!escaped.includes('<script>'), 'Script tag not escaped');
      assert(escaped.includes('&lt;script&gt;'), 'HTML not properly escaped');
      
      // Test URL sanitization
      const dangerousURL = 'javascript:alert(1)';
      const sanitizedURL = XSSProtection.sanitizeURL(dangerousURL);
      assert(sanitizedURL === '', 'Dangerous URL not blocked');
      
      const safeURL = 'https://example.com/page';
      const validURL = XSSProtection.sanitizeURL(safeURL);
      assert(validURL === safeURL, 'Safe URL incorrectly blocked');
      
      // Test HTML sanitization
      const maliciousHTML = '<img src=x onerror=alert(1)>';
      const sanitized = XSSProtection.sanitizeHTML(maliciousHTML);
      assert(!sanitized.includes('onerror'), 'Event handler not removed');
      
      // Test safe element creation
      const element = XSSProtection.createSafeElement('a', {
        href: 'https://example.com',
        target: '_blank'
      }, 'Click me');
      
      assert(element.tagName === 'A', 'Element not created correctly');
      assert(element.getAttribute('rel') === 'noopener noreferrer', 'Security attributes not added');
      
      this.passTest(testName, 'XSS protection working correctly');
      
    } catch (error) {
      this.failTest(testName, `XSS protection test failed: ${error.message}`, true);
    }
  }
  
  async testRobustStorage() {
    const testName = 'Robust Storage with Fallbacks';
    
    try {
      const { RobustStorage } = require('./03-frontend-security-fixes');
      
      // Create storage instance
      const storage = new RobustStorage('test_', {
        ttl: 1000,
        maxItems: 5
      });
      
      // Test storage capabilities detection
      const capabilities = storage.testStorageCapabilities();
      assert(capabilities.memory === true, 'Memory fallback not available');
      
      // Test basic storage operations
      await storage.setItem('test1', { data: 'value1' });
      const retrieved = await storage.getItem('test1');
      assert(retrieved.data === 'value1', 'Storage retrieval failed');
      
      // Test item limit enforcement
      for (let i = 0; i < 10; i++) {
        await storage.setItem(`item${i}`, { data: `value${i}` });
      }
      
      const stats = storage.getStats();
      assert(stats.memoryItems <= 5, 'Item limit not enforced');
      
      // Test TTL expiration
      await storage.setItem('expire_test', { data: 'will_expire' }, 100);
      await new Promise(resolve => setTimeout(resolve, 150));
      
      const expired = await storage.getItem('expire_test');
      assert(expired === null, 'TTL expiration not working');
      
      storage.destroy();
      this.passTest(testName, 'Robust storage working with fallbacks and limits');
      
    } catch (error) {
      this.failTest(testName, `Robust storage test failed: ${error.message}`, true);
    }
  }
  
  async testEventHandlerManagement() {
    const testName = 'Memory-Safe Event Handler Management';
    
    try {
      const { EventHandlerManager } = require('./03-frontend-security-fixes');
      
      // Mock DOM element for testing
      const mockElement = {
        addEventListener: () => {},
        removeEventListener: () => {},
        listeners: []
      };
      
      const manager = new EventHandlerManager();
      
      // Test handler registration
      const handlerId = manager.addHandler(mockElement, 'click', () => {});
      assert(typeof handlerId === 'string', 'Handler ID not returned');
      
      const stats = manager.getStats();
      assert(stats.totalHandlers === 1, 'Handler not tracked');
      
      // Test handler removal
      const removed = manager.removeHandler(handlerId);
      assert(removed === true, 'Handler removal failed');
      
      const statsAfter = manager.getStats();
      assert(statsAfter.totalHandlers === 0, 'Handler not removed from tracking');
      
      // Test cleanup
      manager.addHandler(mockElement, 'click', () => {});
      manager.addHandler(mockElement, 'mouseover', () => {});
      
      const cleanedCount = manager.cleanup();
      assert(cleanedCount === 2, 'Cleanup count incorrect');
      
      this.passTest(testName, 'Event handler management working correctly');
      
    } catch (error) {
      this.failTest(testName, `Event handler test failed: ${error.message}`, true);
    }
  }
  
  async testAtomicLoadingManager() {
    const testName = 'Race-Condition-Free Loading Manager';
    
    try {
      const { AtomicLoadingManager } = require('./03-frontend-security-fixes');
      
      const manager = new AtomicLoadingManager();
      
      // Test basic loading
      const result = await manager.load('test-key', async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return { data: 'loaded' };
      });
      
      assert(result.data === 'loaded', 'Loading failed');
      
      // Test concurrent loading of same key (should not duplicate)
      const promises = [];
      for (let i = 0; i < 5; i++) {
        promises.push(manager.load('concurrent-key', async () => {
          await new Promise(resolve => setTimeout(resolve, 50));
          return { loadId: Math.random() };
        }));
      }
      
      const results = await Promise.all(promises);
      
      // All results should be identical (same load operation)
      assert(results.every(r => r.loadId === results[0].loadId), 'Concurrent loading not atomic');
      
      // Test retry mechanism
      let attempts = 0;
      const retryResult = await manager.load('retry-key', async () => {
        attempts++;
        if (attempts < 2) {
          throw new Error('Temporary failure');
        }
        return { attempts };
      }, { retries: 3 });
      
      assert(retryResult.attempts === 2, 'Retry mechanism not working');
      
      manager.cleanup();
      this.passTest(testName, 'Atomic loading manager working correctly');
      
    } catch (error) {
      this.failTest(testName, `Atomic loading test failed: ${error.message}`, true);
    }
  }
  
  // ============================================================================
  // AUTHENTICATION SECURITY TESTS
  // ============================================================================
  
  async testAuthenticationSecurity() {
    console.log('🔐 Testing authentication security fixes...');
    
    await this.testJWTSecretPersistence();
    await this.testAdvancedRateLimiting(); 
    await this.testSessionSecurity();
    await this.testPasswordSecurity();
  }
  
  async testJWTSecretPersistence() {
    const testName = 'JWT Secret Persistence and Rotation';
    
    try {
      const jwtManager = new SecureJWTManager({
        secretPath: '/tmp/test-jwt-secret.json'
      });
      
      await jwtManager.initializeSecret();
      
      // Test token signing and verification
      const payload = { userId: 'test123', email: 'test@example.com' };
      const token = jwtManager.signToken(payload);
      
      assert(typeof token === 'string', 'Token not generated');
      
      const decoded = jwtManager.verifyToken(token);
      assert(decoded.userId === 'test123', 'Token verification failed');
      
      // Test secret persistence
      const stats = jwtManager.getStats();
      assert(stats.hasCurrentSecret === true, 'Secret not persisted');
      
      // Test that secret file was created
      try {
        await fs.access('/tmp/test-jwt-secret.json');
      } catch (error) {
        assert.fail('JWT secret file not created');
      }
      
      await jwtManager.cleanup();
      
      // Clean up test file
      await fs.unlink('/tmp/test-jwt-secret.json').catch(() => {});
      
      this.passTest(testName, 'JWT secret persistence working correctly');
      
    } catch (error) {
      this.failTest(testName, `JWT secret test failed: ${error.message}`, true);
    }
  }
  
  async testAdvancedRateLimiting() {
    const testName = 'Advanced Rate Limiting with Memory Management';
    
    try {
      const limiter = new AdvancedRateLimiter({
        windowMs: 1000,
        maxRequests: 3,
        maxIPs: 5
      });
      
      // Test sliding window
      const ip = '192.168.1.100';
      assert(limiter.isAllowed(ip, 'test'), 'First request failed');
      assert(limiter.isAllowed(ip, 'test'), 'Second request failed');
      assert(limiter.isAllowed(ip, 'test'), 'Third request failed');
      assert(!limiter.isAllowed(ip, 'test'), 'Fourth request should be blocked');
      
      // Test memory management
      for (let i = 0; i < 10; i++) {
        limiter.isAllowed(`192.168.2.${i}`, 'test');
      }
      
      const stats = limiter.getStats();
      assert(stats.trackedIPs <= stats.maxIPs, 'IP limit not enforced');
      
      // Test progressive blocking
      for (let i = 0; i < 20; i++) {
        limiter.isAllowed(ip, 'test');
      }
      
      assert(limiter.isBlocked(ip), 'Progressive blocking not working');
      
      limiter.cleanup();
      this.passTest(testName, 'Advanced rate limiting working correctly');
      
    } catch (error) {
      this.failTest(testName, `Rate limiting test failed: ${error.message}`, true);
    }
  }
  
  async testSessionSecurity() {
    const testName = 'Secure Session Management';
    
    try {
      const sessionManager = new SecureSessionManager({
        sessionTTL: 5000, // 5 seconds for testing
        maxSessions: 3
      });
      
      // Test session creation
      const sessionData = await sessionManager.createSession('user123', {
        email: 'test@example.com',
        ipAddress: '192.168.1.1'
      });
      
      assert(sessionData.id, 'Session ID not generated');
      assert(sessionData.csrfToken, 'CSRF token not generated');
      
      // Test session retrieval
      const retrieved = await sessionManager.getSession(sessionData.id);
      assert(retrieved.userId === 'user123', 'Session retrieval failed');
      
      // Test CSRF validation
      const validCSRF = sessionManager.validateCSRFToken(sessionData.id, sessionData.csrfToken);
      assert(validCSRF === true, 'CSRF validation failed');
      
      const invalidCSRF = sessionManager.validateCSRFToken(sessionData.id, 'invalid');
      assert(invalidCSRF === false, 'Invalid CSRF not rejected');
      
      // Test session limit
      await sessionManager.createSession('user2', {});
      await sessionManager.createSession('user3', {});
      await sessionManager.createSession('user4', {}); // Should evict oldest
      
      const stats = sessionManager.getStats();
      assert(stats.activeSessions <= 3, 'Session limit not enforced');
      
      // Test session expiration
      await new Promise(resolve => setTimeout(resolve, 6000));
      const expired = await sessionManager.getSession(sessionData.id);
      assert(expired === null, 'Session expiration not working');
      
      await sessionManager.cleanup();
      this.passTest(testName, 'Session security working correctly');
      
    } catch (error) {
      this.failTest(testName, `Session security test failed: ${error.message}`, true);
    }
  }
  
  async testPasswordSecurity() {
    const testName = 'Password Security and Validation';
    
    try {
      // Test weak password rejection
      const weakPassword = '123456';
      const weakValidation = PasswordSecurity.validatePassword(weakPassword);
      assert(!weakValidation.valid, 'Weak password not rejected');
      assert(weakValidation.strength === 'Very Weak', 'Weak password strength incorrect');
      
      // Test strong password acceptance
      const strongPassword = 'MyStr0ng!P@ssw0rd2024';
      const strongValidation = PasswordSecurity.validatePassword(strongPassword);
      assert(strongValidation.valid, 'Strong password rejected');
      assert(['Good', 'Strong'].includes(strongValidation.strength), 'Strong password strength incorrect');
      
      // Test password hashing
      const hashResult = await PasswordSecurity.hashPassword(strongPassword);
      assert(hashResult.hash, 'Password hash not generated');
      assert(hashResult.strength, 'Password strength not recorded');
      
      // Test password verification
      const verified = await PasswordSecurity.verifyPassword(strongPassword, hashResult.hash);
      assert(verified === true, 'Password verification failed');
      
      const wrongPassword = await PasswordSecurity.verifyPassword('wrong', hashResult.hash);
      assert(wrongPassword === false, 'Wrong password not rejected');
      
      this.passTest(testName, 'Password security working correctly');
      
    } catch (error) {
      this.failTest(testName, `Password security test failed: ${error.message}`, true);
    }
  }
  
  // ============================================================================
  // MEMORY LEAK PREVENTION TESTS
  // ============================================================================
  
  async testMemoryLeakPrevention() {
    console.log('🧠 Testing memory leak prevention...');
    
    await this.testCacheMemoryManagement();
    await this.testEventHandlerCleanup();
    await this.testRateLimiterCleanup();
  }
  
  async testCacheMemoryManagement() {
    const testName = 'Cache Memory Management';
    
    try {
      const { SecureCache } = require('./02-api-security-fixes');
      
      // Test cache with very small limits
      const cache = new SecureCache({
        maxSize: 2,
        cleanupInterval: 100,
        ttl: 200
      });
      
      // Fill cache beyond limit
      await cache.set('item1', 'data1');
      await cache.set('item2', 'data2');
      await cache.set('item3', 'data3'); // Should trigger eviction
      
      const stats = cache.getStats();
      assert(stats.size <= 2, 'Cache size not limited');
      
      // Test cleanup timer
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const cleanedStats = cache.getStats();
      assert(cleanedStats.size === 0, 'TTL cleanup not working');
      
      cache.destroy();
      this.passTest(testName, 'Cache memory management working');
      
    } catch (error) {
      this.failTest(testName, `Cache memory test failed: ${error.message}`, true);
    }
  }
  
  async testEventHandlerCleanup() {
    const testName = 'Event Handler Memory Cleanup';
    
    try {
      const { EventHandlerManager } = require('./03-frontend-security-fixes');
      
      const manager = new EventHandlerManager();
      const mockElements = [];
      
      // Create multiple mock elements with handlers
      for (let i = 0; i < 5; i++) {
        const element = {
          addEventListener: () => {},
          removeEventListener: () => {}
        };
        mockElements.push(element);
        
        manager.addHandler(element, 'click', () => {});
        manager.addHandler(element, 'mouseover', () => {});
      }
      
      let stats = manager.getStats();
      assert(stats.totalHandlers === 10, 'Handlers not tracked correctly');
      
      // Test element-specific cleanup
      const removed = manager.removeElementHandlers(mockElements[0]);
      assert(removed === 2, 'Element handler removal failed');
      
      stats = manager.getStats();
      assert(stats.totalHandlers === 8, 'Handler count not updated');
      
      // Test full cleanup
      const cleanedCount = manager.cleanup();
      assert(cleanedCount === 8, 'Full cleanup count incorrect');
      
      stats = manager.getStats();
      assert(stats.totalHandlers === 0, 'Handlers not fully cleaned');
      
      this.passTest(testName, 'Event handler cleanup working correctly');
      
    } catch (error) {
      this.failTest(testName, `Event handler cleanup test failed: ${error.message}`, true);
    }
  }
  
  async testRateLimiterCleanup() {
    const testName = 'Rate Limiter Memory Cleanup';
    
    try {
      const limiter = new AdvancedRateLimiter({
        windowMs: 100,
        cleanupInterval: 50,
        maxIPs: 100
      });
      
      // Generate many IP requests
      for (let i = 0; i < 50; i++) {
        limiter.isAllowed(`192.168.1.${i}`, 'test');
      }
      
      let stats = limiter.getStats();
      assert(stats.trackedIPs === 50, 'IP tracking not working');
      
      // Wait for cleanup cycle
      await new Promise(resolve => setTimeout(resolve, 200));
      
      stats = limiter.getStats();
      assert(stats.trackedIPs < 50, 'Cleanup not reducing tracked IPs');
      
      limiter.cleanup();
      
      stats = limiter.getStats();
      assert(stats.trackedIPs === 0, 'Final cleanup not working');
      
      this.passTest(testName, 'Rate limiter cleanup working correctly');
      
    } catch (error) {
      this.failTest(testName, `Rate limiter cleanup test failed: ${error.message}`, true);
    }
  }
  
  // ============================================================================
  // PERFORMANCE OPTIMIZATION TESTS
  // ============================================================================
  
  async testPerformanceOptimizations() {
    console.log('⚡ Testing performance optimizations...');
    
    await this.testAtomicOperations();
    await this.testConcurrentLoadHandling();
    await this.testIndexPerformance();
  }
  
  async testAtomicOperations() {
    const testName = 'Atomic Operations Performance';
    
    try {
      const { AtomicLoadingManager } = require('./03-frontend-security-fixes');
      
      const manager = new AtomicLoadingManager();
      const startTime = Date.now();
      
      // Test concurrent atomic operations
      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(manager.load('atomic-test', async () => {
          await new Promise(resolve => setTimeout(resolve, 50));
          return { timestamp: Date.now() };
        }));
      }
      
      const results = await Promise.all(promises);
      const endTime = Date.now();
      
      // All results should be identical (atomic)
      const firstTimestamp = results[0].timestamp;
      assert(results.every(r => r.timestamp === firstTimestamp), 'Operations not atomic');
      
      // Should be much faster than 10 * 50ms due to deduplication
      const elapsed = endTime - startTime;
      assert(elapsed < 200, `Atomic operations too slow: ${elapsed}ms`);
      
      manager.cleanup();
      this.passTest(testName, `Atomic operations working efficiently (${elapsed}ms)`);
      
    } catch (error) {
      this.failTest(testName, `Atomic operations test failed: ${error.message}`, false);
    }
  }
  
  async testConcurrentLoadHandling() {
    const testName = 'Concurrent Load Handling';
    
    try {
      const { SecureCache } = require('./02-api-security-fixes');
      
      const cache = new SecureCache({
        maxSize: 100,
        ttl: 5000
      });
      
      const startTime = Date.now();
      
      // Test concurrent cache operations
      const promises = [];
      for (let i = 0; i < 50; i++) {
        promises.push(cache.setAtomic(`key-${i}`, async () => {
          await new Promise(resolve => setTimeout(resolve, 10));
          return { id: i, data: `value-${i}` };
        }));
      }
      
      await Promise.all(promises);
      const endTime = Date.now();
      
      const elapsed = endTime - startTime;
      assert(elapsed < 1000, `Concurrent operations too slow: ${elapsed}ms`);
      
      // Verify all data was stored correctly
      const stats = cache.getStats();
      assert(stats.size === 50, 'Not all concurrent operations completed');
      
      cache.destroy();
      this.passTest(testName, `Concurrent loading efficient (${elapsed}ms)`);
      
    } catch (error) {
      this.failTest(testName, `Concurrent loading test failed: ${error.message}`, false);
    }
  }
  
  async testIndexPerformance() {
    const testName = 'Database Index Performance';
    
    if (!this.dbPool) {
      this.skipTest(testName, 'No database connection');
      return;
    }
    
    try {
      // Test that performance indexes were created
      const indexQuery = `
        SELECT indexname, indexdef 
        FROM pg_indexes 
        WHERE schemaname = 'public' 
          AND tablename LIKE 'footer_%'
          AND indexdef LIKE '%locale%'
      `;
      
      const result = await this.dbPool.query(indexQuery);
      assert(result.rows.length >= 3, 'Performance indexes not created');
      
      // Test query performance with EXPLAIN
      const explainQuery = `
        EXPLAIN (FORMAT JSON) 
        SELECT * FROM footer_content 
        WHERE locale = 'en' AND published = true
      `;
      
      const explainResult = await this.dbPool.query(explainQuery);
      const plan = explainResult.rows[0]['QUERY PLAN'];
      
      // Should use index scan, not sequential scan
      const planText = JSON.stringify(plan);
      assert(!planText.includes('Seq Scan'), 'Query not using index');
      
      this.passTest(testName, 'Database indexes improving query performance');
      
    } catch (error) {
      this.failTest(testName, `Index performance test failed: ${error.message}`, false);
    }
  }
  
  // ============================================================================
  // REAL-WORLD SCENARIO TESTS
  // ============================================================================
  
  async testRealWorldScenarios() {
    console.log('🌍 Testing real-world scenarios...');
    
    await this.testHighTrafficScenario();
    await this.testAttackSimulation();
    await this.testFailureRecovery();
  }
  
  async testHighTrafficScenario() {
    const testName = 'High Traffic Load Handling';
    
    try {
      const limiter = new AdvancedRateLimiter({
        windowMs: 1000,
        maxRequests: 100,
        maxIPs: 1000
      });
      
      const { SecureCache } = require('./02-api-security-fixes');
      const cache = new SecureCache({
        maxSize: 1000,
        ttl: 5000
      });
      
      const startTime = Date.now();
      
      // Simulate high traffic from many IPs
      const promises = [];
      for (let ip = 1; ip <= 100; ip++) {
        for (let req = 1; req <= 50; req++) {
          const ipAddress = `192.168.${Math.floor(ip/254)}.${ip%254}`;
          promises.push(
            Promise.resolve().then(async () => {
              const allowed = limiter.isAllowed(ipAddress, 'api');
              if (allowed) {
                await cache.setAtomic(`data-${ip}-${req}`, async () => {
                  return { ip: ipAddress, request: req };
                });
              }
              return allowed;
            })
          );
        }
      }
      
      const results = await Promise.all(promises);
      const endTime = Date.now();
      
      const allowedRequests = results.filter(r => r).length;
      const elapsed = endTime - startTime;
      
      assert(allowedRequests > 0, 'No requests processed');
      assert(elapsed < 10000, 'High traffic handling too slow');
      
      const limiterStats = limiter.getStats();
      const cacheStats = cache.getStats();
      
      assert(limiterStats.trackedIPs <= limiterStats.maxIPs, 'Rate limiter memory not managed');
      assert(cacheStats.size <= cacheStats.maxSize, 'Cache memory not managed');
      
      limiter.cleanup();
      cache.destroy();
      
      this.passTest(testName, `Handled ${allowedRequests} requests in ${elapsed}ms`);
      
    } catch (error) {
      this.failTest(testName, `High traffic test failed: ${error.message}`, false);
    }
  }
  
  async testAttackSimulation() {
    const testName = 'Security Attack Simulation';
    
    try {
      const { XSSProtection } = require('./03-frontend-security-fixes');
      const limiter = new AdvancedRateLimiter({
        windowMs: 1000,
        maxRequests: 10
      });
      
      // Simulate XSS attacks
      const xssPayloads = [
        '<script>alert("xss")</script>',
        '<img src=x onerror=alert(1)>',
        'javascript:alert(document.cookie)',
        '<iframe src="javascript:alert(1)"></iframe>',
        '<svg onload=alert(1)>'
      ];
      
      for (const payload of xssPayloads) {
        const sanitized = XSSProtection.sanitizeHTML(payload);
        assert(!sanitized.includes('alert'), `XSS payload not blocked: ${payload}`);
        assert(!sanitized.includes('javascript:'), `Dangerous protocol not blocked: ${payload}`);
      }
      
      // Simulate rate limiting attack
      const attackIP = '10.0.0.1';
      let blockedCount = 0;
      
      // Make many rapid requests
      for (let i = 0; i < 50; i++) {
        const allowed = limiter.isAllowed(attackIP, 'attack');
        if (!allowed) blockedCount++;
      }
      
      assert(blockedCount > 30, 'Rate limiting not blocking attack');
      assert(limiter.isBlocked(attackIP), 'Attacker IP not blocked');
      
      limiter.cleanup();
      this.passTest(testName, `Blocked ${blockedCount}/50 attack requests`);
      
    } catch (error) {
      this.failTest(testName, `Attack simulation failed: ${error.message}`, true);
    }
  }
  
  async testFailureRecovery() {
    const testName = 'System Failure Recovery';
    
    try {
      const { AtomicLoadingManager } = require('./03-frontend-security-fixes');
      const { RobustStorage } = require('./03-frontend-security-fixes');
      
      const manager = new AtomicLoadingManager();
      const storage = new RobustStorage('recovery_test_', {
        maxItems: 10
      });
      
      // Test recovery from loading failures
      let attempts = 0;
      try {
        await manager.load('failure-test', async () => {
          attempts++;
          if (attempts < 3) {
            throw new Error('Simulated failure');
          }
          return { recovered: true, attempts };
        }, { retries: 5, retryDelay: 10 });
      } catch (error) {
        assert.fail('Retry mechanism not working');
      }
      
      assert(attempts === 3, 'Retry count incorrect');
      
      // Test storage fallback capability
      const testData = { test: 'fallback_data' };
      
      // Should still work even if localStorage is not available
      await storage.setItem('fallback_test', testData);
      const retrieved = await storage.getItem('fallback_test');
      
      assert(retrieved.test === 'fallback_data', 'Storage fallback failed');
      
      manager.cleanup();
      storage.destroy();
      
      this.passTest(testName, 'System recovery mechanisms working correctly');
      
    } catch (error) {
      this.failTest(testName, `Failure recovery test failed: ${error.message}`, true);
    }
  }
  
  // ============================================================================
  // TEST UTILITIES
  // ============================================================================
  
  passTest(name, message) {
    this.results.total++;
    this.results.passed++;
    this.results.tests.push({
      name,
      status: 'PASSED',
      message,
      duration: 0
    });
    
    if (TEST_CONFIG.VERBOSE) {
      console.log(`✅ ${name}: ${message}`);
    }
  }
  
  failTest(name, message, critical = false) {
    this.results.total++;
    this.results.failed++;
    
    if (critical) {
      this.results.criticalFailures++;
    }
    
    this.results.tests.push({
      name,
      status: critical ? 'CRITICAL_FAILED' : 'FAILED',
      message,
      duration: 0
    });
    
    console.log(`❌ ${name}: ${message}`);
  }
  
  skipTest(name, reason) {
    this.results.total++;
    this.results.skipped++;
    this.results.tests.push({
      name,
      status: 'SKIPPED',
      message: reason,
      duration: 0
    });
    
    if (TEST_CONFIG.VERBOSE) {
      console.log(`⏭️ ${name}: ${reason}`);
    }
  }
  
  generateReport() {
    const duration = Date.now() - this.results.startTime;
    const passRate = (this.results.passed / this.results.total * 100).toFixed(1);
    
    console.log('\n' + '='.repeat(80));
    console.log('🧪 COMPREHENSIVE TEST VALIDATION RESULTS');
    console.log('='.repeat(80));
    
    console.log(`
📊 Test Summary:
   Total Tests: ${this.results.total}
   ✅ Passed: ${this.results.passed}
   ❌ Failed: ${this.results.failed}
   ⏭️ Skipped: ${this.results.skipped}
   🚨 Critical Failures: ${this.results.criticalFailures}
   
📈 Statistics:
   Pass Rate: ${passRate}%
   Duration: ${duration}ms
   Status: ${this.results.criticalFailures === 0 ? '✅ READY FOR DEPLOYMENT' : '🚫 DEPLOYMENT BLOCKED'}`);
    
    if (this.results.failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results.tests
        .filter(t => t.status.includes('FAILED'))
        .forEach(test => {
          const indicator = test.status === 'CRITICAL_FAILED' ? '🚨' : '❌';
          console.log(`   ${indicator} ${test.name}: ${test.message}`);
        });
    }
    
    if (this.results.criticalFailures > 0) {
      console.log('\n🚫 DEPLOYMENT DECISION: BLOCKED');
      console.log('Critical bugs found that must be fixed before deployment.');
    } else {
      console.log('\n✅ DEPLOYMENT DECISION: APPROVED');
      console.log('All critical security fixes validated and working correctly.');
    }
    
    console.log('\n' + '='.repeat(80));
    
    return {
      passed: this.results.criticalFailures === 0,
      summary: this.results,
      duration
    };
  }
  
  async cleanup() {
    if (this.dbPool) {
      await this.dbPool.end();
    }
  }
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function runTests() {
  const suite = new ComprehensiveTestSuite();
  
  try {
    await suite.initialize();
    const results = await suite.runAllTests();
    
    return results;
    
  } catch (error) {
    console.error('🚨 Test suite crashed:', error);
    return { passed: false, error: error.message };
    
  } finally {
    await suite.cleanup();
  }
}

// Export for module usage
module.exports = {
  ComprehensiveTestSuite,
  runTests,
  TEST_CONFIG
};

// Run tests if executed directly
if (require.main === module) {
  runTests().then(results => {
    process.exit(results.passed ? 0 : 1);
  }).catch(error => {
    console.error('Test execution failed:', error);
    process.exit(1);
  });
}