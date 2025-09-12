/**
 * EMERGENCY API SECURITY FIXES
 * 
 * Critical fixes for API endpoints addressing:
 * - Memory leaks in cache system
 * - Race conditions in cache updates  
 * - XSS vulnerabilities in error responses
 * - Missing input validation
 * - Authentication weaknesses
 */

const express = require('express');
const { Pool } = require('pg');
const rateLimit = require('express-rate-limit');
const { requireAuth, requireAdmin, securityHeaders } = require('../security-patches/auth-middleware');
const { validateLocale, validateFooterContent, createValidationMiddleware } = require('../security-patches/input-validator');

// ============================================================================
// FIX #1: SECURE CACHE WITH SIZE LIMITS AND ATOMIC OPERATIONS
// ============================================================================

class SecureCache {
  constructor(options = {}) {
    this.cache = new Map();
    this.maxSize = options.maxSize || 1000; // Maximum cache entries
    this.ttl = options.ttl || 3600000; // 1 hour TTL
    this.prefix = options.prefix || 'footer:';
    this.cleanupInterval = options.cleanupInterval || 60000; // 1 minute cleanup
    
    // Track access for LRU eviction
    this.accessOrder = new Map();
    this.accessCounter = 0;
    
    // Atomic operation tracking
    this.operationLocks = new Map();
    
    // Start cleanup timer
    this.startCleanupTimer();
  }
  
  startCleanupTimer() {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.cleanupInterval);
    
    // Ensure cleanup timer doesn't keep process alive
    if (this.cleanupTimer.unref) {
      this.cleanupTimer.unref();
    }
  }
  
  async get(key) {
    const fullKey = this.prefix + key;
    const entry = this.cache.get(fullKey);
    
    if (!entry) {
      return null;
    }
    
    // Check if expired
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(fullKey);
      this.accessOrder.delete(fullKey);
      return null;
    }
    
    // Update access tracking for LRU
    this.accessOrder.set(fullKey, ++this.accessCounter);
    
    return entry.data;
  }
  
  async set(key, data) {
    const fullKey = this.prefix + key;
    
    // Check size limit before adding
    if (this.cache.size >= this.maxSize && !this.cache.has(fullKey)) {
      this.evictLRU();
    }
    
    // Store with timestamp and access tracking
    this.cache.set(fullKey, {
      data,
      timestamp: Date.now()
    });
    
    this.accessOrder.set(fullKey, ++this.accessCounter);
  }
  
  async setAtomic(key, dataProvider) {
    const fullKey = this.prefix + key;
    
    // Check if operation is already in progress
    if (this.operationLocks.has(fullKey)) {
      // Wait for existing operation to complete
      return this.operationLocks.get(fullKey);
    }
    
    // Create operation promise
    const operationPromise = this.executeAtomicSet(fullKey, dataProvider);
    this.operationLocks.set(fullKey, operationPromise);
    
    try {
      const result = await operationPromise;
      return result;
    } finally {
      this.operationLocks.delete(fullKey);
    }
  }
  
  async executeAtomicSet(fullKey, dataProvider) {
    try {
      // Check cache first (double-check locking pattern)
      const existing = this.cache.get(fullKey);
      if (existing && (Date.now() - existing.timestamp <= this.ttl)) {
        return existing.data;
      }
      
      // Generate new data
      const data = await dataProvider();
      
      // Store atomically
      await this.set(fullKey.replace(this.prefix, ''), data);
      
      return data;
    } catch (error) {
      console.error(`Atomic cache operation failed for ${fullKey}:`, error);
      throw error;
    }
  }
  
  evictLRU() {
    // Find least recently used entry
    let oldestKey = null;
    let oldestAccess = Infinity;
    
    for (const [key, accessTime] of this.accessOrder.entries()) {
      if (accessTime < oldestAccess) {
        oldestAccess = accessTime;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.accessOrder.delete(oldestKey);
    }
  }
  
  cleanup() {
    const now = Date.now();
    let cleaned = 0;
    
    // Clean expired entries
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.ttl) {
        this.cache.delete(key);
        this.accessOrder.delete(key);
        cleaned++;
      }
    }
    
    // Log cleanup stats
    if (cleaned > 0) {
      console.log(`🧹 Cache cleanup: removed ${cleaned} expired entries, ${this.cache.size} remaining`);
    }
    
    // Emergency cleanup if cache is still too large
    while (this.cache.size > this.maxSize) {
      this.evictLRU();
      cleaned++;
    }
    
    if (cleaned > 0) {
      console.log(`📊 Cache stats: size=${this.cache.size}/${this.maxSize}, operations=${this.operationLocks.size}`);
    }
  }
  
  clear() {
    this.cache.clear();
    this.accessOrder.clear();
    this.operationLocks.clear();
    this.accessCounter = 0;
  }
  
  destroy() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    this.clear();
  }
  
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      activeOperations: this.operationLocks.size,
      accessCounter: this.accessCounter
    };
  }
}

// ============================================================================
// FIX #2: ENHANCED RATE LIMITING WITH MEMORY MANAGEMENT  
// ============================================================================

class ManagedRateLimiter {
  constructor(options = {}) {
    this.windowMs = options.windowMs || 15 * 60 * 1000; // 15 minutes
    this.maxAttempts = options.maxAttempts || 100;
    this.maxIPs = options.maxIPs || 10000; // Maximum IPs to track
    this.cleanupInterval = options.cleanupInterval || 5 * 60 * 1000; // 5 minutes
    
    this.attempts = new Map();
    this.startCleanupTimer();
  }
  
  startCleanupTimer() {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.cleanupInterval);
    
    if (this.cleanupTimer.unref) {
      this.cleanupTimer.unref();
    }
  }
  
  isAllowed(ip) {
    const now = Date.now();
    const ipData = this.attempts.get(ip);
    
    if (!ipData) {
      // First request from this IP
      this.attempts.set(ip, {
        count: 1,
        windowStart: now,
        lastAccess: now
      });
      return true;
    }
    
    // Reset window if expired
    if (now - ipData.windowStart >= this.windowMs) {
      ipData.count = 1;
      ipData.windowStart = now;
      ipData.lastAccess = now;
      return true;
    }
    
    // Update last access time
    ipData.lastAccess = now;
    
    // Check if limit exceeded
    if (ipData.count >= this.maxAttempts) {
      return false;
    }
    
    // Increment counter
    ipData.count++;
    return true;
  }
  
  cleanup() {
    const now = Date.now();
    let cleaned = 0;
    
    // Remove expired entries
    for (const [ip, data] of this.attempts.entries()) {
      if (now - data.lastAccess > this.windowMs * 2) {
        this.attempts.delete(ip);
        cleaned++;
      }
    }
    
    // Emergency cleanup if too many IPs
    if (this.attempts.size > this.maxIPs) {
      // Sort by last access time and remove oldest
      const sortedEntries = Array.from(this.attempts.entries())
        .sort(([, a], [, b]) => a.lastAccess - b.lastAccess);
      
      const toRemove = this.attempts.size - this.maxIPs;
      for (let i = 0; i < toRemove; i++) {
        this.attempts.delete(sortedEntries[i][0]);
        cleaned++;
      }
    }
    
    if (cleaned > 0) {
      console.log(`🚦 Rate limiter cleanup: removed ${cleaned} entries, ${this.attempts.size} active IPs`);
    }
  }
  
  getStats() {
    return {
      activeIPs: this.attempts.size,
      maxIPs: this.maxIPs,
      windowMs: this.windowMs,
      maxAttempts: this.maxAttempts
    };
  }
  
  destroy() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    this.attempts.clear();
  }
}

// ============================================================================
// FIX #3: SECURE ERROR RESPONSE HANDLER
// ============================================================================

class SecureErrorHandler {
  static sanitizeError(error, isProduction = process.env.NODE_ENV === 'production') {
    const baseError = {
      error: 'Internal server error',
      timestamp: new Date().toISOString(),
      requestId: this.generateRequestId()
    };
    
    if (!isProduction) {
      // In development, include more details but still sanitize
      baseError.details = {
        message: this.sanitizeMessage(error.message),
        type: error.name,
        // Don't include stack trace or sensitive info
      };
    }
    
    // Log full error details server-side for debugging
    console.error('API Error:', {
      message: error.message,
      stack: error.stack,
      requestId: baseError.requestId,
      timestamp: baseError.timestamp
    });
    
    return baseError;
  }
  
  static sanitizeMessage(message) {
    if (!message) return 'Unknown error';
    
    // Remove sensitive information patterns
    const sanitized = message
      .replace(/password[=:]\s*\S+/gi, 'password=[REDACTED]')
      .replace(/token[=:]\s*\S+/gi, 'token=[REDACTED]')
      .replace(/key[=:]\s*\S+/gi, 'key=[REDACTED]')
      .replace(/secret[=:]\s*\S+/gi, 'secret=[REDACTED]')
      .replace(/connection string[=:]\s*\S+/gi, 'connection string=[REDACTED]')
      .replace(/postgresql:\/\/[^\s]+/gi, 'postgresql://[REDACTED]')
      .replace(/DETAIL:\s+.*/gi, 'DETAIL: [REDACTED]')
      .replace(/HINT:\s+.*/gi, 'HINT: [REDACTED]');
    
    // Limit message length
    return sanitized.length > 200 ? sanitized.substring(0, 200) + '...' : sanitized;
  }
  
  static generateRequestId() {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }
  
  static handleDatabaseError(error) {
    // Map common database errors to user-friendly messages
    const errorMappings = {
      '23505': 'This record already exists',
      '23503': 'Referenced record does not exist',  
      '23502': 'Required field is missing',
      '22001': 'Text field is too long',
      '22003': 'Number is out of valid range',
      '42703': 'Invalid field name',
      '42P01': 'Database table not found'
    };
    
    if (error.code && errorMappings[error.code]) {
      return {
        error: errorMappings[error.code],
        code: error.code,
        timestamp: new Date().toISOString()
      };
    }
    
    return this.sanitizeError(error);
  }
}

// ============================================================================
// FIX #4: ENHANCED FOOTER API WITH ALL SECURITY FIXES
// ============================================================================

function initSecureFooterAPI(app, pool) {
  // Initialize secure cache and rate limiter
  const secureCache = new SecureCache({
    maxSize: 1000,
    ttl: 3600000, // 1 hour
    prefix: 'footer:',
    cleanupInterval: 60000 // 1 minute
  });
  
  const rateLimiter = new ManagedRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxAttempts: 100,
    maxIPs: 10000
  });
  
  // Apply security headers to all footer API routes
  app.use('/api/footer*', securityHeaders);
  
  // Apply rate limiting middleware
  app.use('/api/footer*', (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    
    if (!rateLimiter.isAllowed(clientIP)) {
      return res.status(429).json({
        error: 'Too many requests',
        message: 'Please try again later',
        retryAfter: Math.ceil(rateLimiter.windowMs / 1000)
      });
    }
    
    next();
  });
  
  // ============================================================================
  // SECURE GET /api/footer-content
  // ============================================================================
  app.get('/api/footer-content', async (req, res) => {
    try {
      // Validate and sanitize input
      const localeValidation = validateLocale(req.query.locale);
      if (!localeValidation.isValid) {
        return res.status(400).json({
          error: 'Invalid locale',
          message: localeValidation.error
        });
      }
      
      const locale = localeValidation.sanitized;
      const preview = req.query.preview === 'true';
      const cacheKey = `complete:${locale}:${preview ? 'preview' : 'published'}`;
      
      // Use atomic cache operations to prevent race conditions
      const footerData = await secureCache.setAtomic(cacheKey, async () => {
        console.log(`🦶 Fetching footer content (locale: ${locale}, preview: ${preview})`);
        
        // Get main footer content with proper error handling
        const contentQuery = `
          SELECT * FROM footer_content 
          WHERE locale = $1 OR locale = 'en'
          ORDER BY locale = $1 DESC, created_at DESC 
          LIMIT 1
        `;
        const contentResult = await pool.query(contentQuery, [locale]);
        
        if (contentResult.rows.length === 0) {
          throw new Error(`Footer content not found for locale: ${locale}`);
        }
        
        const content = contentResult.rows[0];
        
        // Get navigation menus with error handling
        const navQuery = `
          SELECT menu_type, menu_title, menu_items, display_order, is_visible
          FROM footer_navigation_menus 
          WHERE (locale = $1 OR locale = 'en') AND is_visible = true
          ORDER BY locale = $1 DESC, display_order ASC
        `;
        const navResult = await pool.query(navQuery, [locale]);
        
        // Process navigation safely
        const navigation = {};
        const seenMenuTypes = new Set();
        
        for (const nav of navResult.rows) {
          if (!seenMenuTypes.has(nav.menu_type)) {
            // Validate menu items structure
            let menuItems = [];
            try {
              menuItems = Array.isArray(nav.menu_items) ? nav.menu_items : [];
              // Sanitize menu items
              menuItems = menuItems.map(item => ({
                text: String(item.text || '').substring(0, 100),
                url: this.sanitizeURL(String(item.url || '')),
                target: ['_self', '_blank'].includes(item.target) ? item.target : '_self',
                icon: String(item.icon || '').substring(0, 50),
                order: parseInt(item.order) || 0,
                visible: Boolean(item.visible !== false)
              })).filter(item => item.text && item.url);
            } catch (error) {
              console.warn(`Invalid menu items for ${nav.menu_type}:`, error);
              menuItems = [];
            }
            
            navigation[nav.menu_type] = {
              title: String(nav.menu_title || '').substring(0, 100),
              items: menuItems,
              order: nav.display_order || 0
            };
            seenMenuTypes.add(nav.menu_type);
          }
        }
        
        // Get social links with error handling
        const socialQuery = `
          SELECT platform, url, icon_class, display_text, tooltip, display_order
          FROM footer_social_links 
          WHERE (locale = $1 OR locale = 'en') AND is_visible = true
          ORDER BY locale = $1 DESC, display_order ASC
        `;
        const socialResult = await pool.query(socialQuery, [locale]);
        
        // Process social links safely
        const social = {};
        const seenPlatforms = new Set();
        
        for (const link of socialResult.rows) {
          if (!seenPlatforms.has(link.platform)) {
            social[link.platform] = {
              url: this.sanitizeURL(link.url),
              icon: String(link.icon_class || '').substring(0, 100),
              text: String(link.display_text || '').substring(0, 100),
              tooltip: String(link.tooltip || '').substring(0, 200)
            };
            seenPlatforms.add(link.platform);
          }
        }
        
        // Get newsletter config
        const newsletterQuery = `
          SELECT service_provider, form_fields, gdpr_consent_required, gdpr_consent_text
          FROM footer_newsletter_config 
          WHERE locale = $1 OR locale = 'en'
          ORDER BY locale = $1 DESC
          LIMIT 1
        `;
        const newsletterResult = await pool.query(newsletterQuery, [locale]);
        const newsletter = newsletterResult.rows[0] || {};
        
        // Construct secure response
        return {
          locale,
          version: content.version || 1,
          last_updated: content.updated_at,
          
          // Company information (sanitized)
          company: {
            name: this.sanitizeText(content.company_name),
            description: this.sanitizeText(content.company_description),
            logo_url: this.sanitizeURL(content.company_logo_url),
            tagline: this.sanitizeText(content.company_tagline)
          },
          
          // Contact information (sanitized)
          contact: {
            email: this.sanitizeEmail(content.contact_email),
            phone: this.sanitizeText(content.contact_phone),
            address: this.sanitizeText(content.contact_address),
            support_email: this.sanitizeEmail(content.support_email),
            sales_email: this.sanitizeEmail(content.sales_email)
          },
          
          // Navigation menus (already sanitized above)
          navigation,
          
          // Social links (already sanitized above)
          social,
          
          // Newsletter configuration (sanitized)
          newsletter: {
            enabled: Boolean(content.newsletter_enabled),
            title: this.sanitizeText(content.newsletter_title),
            subtitle: this.sanitizeText(content.newsletter_subtitle),
            placeholder: this.sanitizeText(content.newsletter_placeholder),
            button_text: this.sanitizeText(content.newsletter_button_text),
            success_message: this.sanitizeText(content.newsletter_success_message),
            error_message: this.sanitizeText(content.newsletter_error_message),
            form_fields: newsletter.form_fields || [],
            gdpr_required: Boolean(newsletter.gdpr_consent_required),
            gdpr_text: this.sanitizeText(newsletter.gdpr_consent_text)
          },
          
          // Legal information (sanitized)
          legal: {
            copyright: this.sanitizeText(content.copyright_text),
            privacy_policy_url: this.sanitizeURL(content.privacy_policy_url),
            terms_of_service_url: this.sanitizeURL(content.terms_of_service_url),
            cookie_policy_url: this.sanitizeURL(content.cookie_policy_url)
          },
          
          // Display settings
          settings: {
            show_social_links: Boolean(content.show_social_links),
            show_newsletter: Boolean(content.show_newsletter),
            show_contact_info: Boolean(content.show_contact_info),
            show_navigation: Boolean(content.show_navigation),
            show_company_info: Boolean(content.show_company_info)
          }
        };
      });
      
      // Set secure cache headers
      res.set({
        'Cache-Control': preview ? 'no-cache, no-store, must-revalidate' : 'public, max-age=3600, s-maxage=1800',
        'ETag': `"${footerData.version}-${new Date(footerData.last_updated).getTime()}"`,
        'Vary': 'Accept-Language'
      });
      
      res.json(footerData);
      
    } catch (error) {
      const sanitizedError = SecureErrorHandler.handleDatabaseError(error);
      res.status(error.statusCode || 500).json(sanitizedError);
    }
  });
  
  // ============================================================================
  // SECURE POST /api/footer-content (Admin only)
  // ============================================================================
  app.post('/api/footer-content', 
    requireAuth, 
    requireAdmin, 
    createValidationMiddleware(validateFooterContent),
    async (req, res) => {
      try {
        const { locale = 'en', ...updates } = req.body;
        
        console.log(`💾 Updating footer content (locale: ${locale}, user: ${req.user?.email})`);
        
        // Validate required fields
        if (!updates || Object.keys(updates).length === 0) {
          return res.status(400).json({ 
            error: 'No updates provided',
            message: 'Request body must contain at least one field to update'
          });
        }
        
        // Use database transaction for consistency
        const client = await pool.connect();
        
        try {
          await client.query('BEGIN');
          
          // Build secure parameterized update query
          const allowedFields = [
            'company_name', 'company_description', 'company_logo_url', 'company_tagline',
            'contact_email', 'contact_phone', 'contact_address', 'support_email', 'sales_email',
            'copyright_text', 'privacy_policy_url', 'terms_of_service_url', 'cookie_policy_url',
            'newsletter_enabled', 'newsletter_title', 'newsletter_subtitle', 'newsletter_placeholder',
            'newsletter_button_text', 'newsletter_success_message', 'newsletter_error_message',
            'show_social_links', 'show_newsletter', 'show_contact_info', 'show_navigation', 'show_company_info'
          ];
          
          const updateFields = [];
          const values = [locale];
          let paramIndex = 2;
          
          // Use whitelist validation to prevent SQL injection
          for (const [field, value] of Object.entries(updates)) {
            if (allowedFields.includes(field)) {
              updateFields.push(`${field} = $${paramIndex}`);
              values.push(value);
              paramIndex++;
            }
          }
          
          if (updateFields.length === 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ 
              error: 'No valid fields to update',
              allowedFields 
            });
          }
          
          // Add metadata fields
          updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
          updateFields.push(`updated_by = $${paramIndex}`);
          updateFields.push(`version = version + 1`);
          values.push(req.user?.email || 'admin');
          
          const query = `
            UPDATE footer_content 
            SET ${updateFields.join(', ')}
            WHERE locale = $1 AND published = true
            RETURNING *
          `;
          
          const result = await client.query(query, values);
          
          if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ 
              error: 'Footer content not found',
              message: `No published content found for locale: ${locale}`
            });
          }
          
          await client.query('COMMIT');
          
          // Clear cache atomically
          secureCache.clear(); // Clear all cache to ensure consistency
          
          res.json({
            success: true,
            data: result.rows[0],
            message: 'Footer content updated successfully'
          });
          
        } catch (queryError) {
          await client.query('ROLLBACK');
          throw queryError;
        } finally {
          client.release();
        }
        
      } catch (error) {
        const sanitizedError = SecureErrorHandler.handleDatabaseError(error);
        res.status(error.statusCode || 500).json(sanitizedError);
      }
    }
  );
  
  // ============================================================================
  // SYSTEM HEALTH AND MONITORING ENDPOINTS
  // ============================================================================
  app.get('/api/footer-health', async (req, res) => {
    try {
      const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '2.0.0',
        checks: {
          database: false,
          cache: false,
          rateLimiter: false,
          tables: {}
        },
        performance: {
          cache: secureCache.getStats(),
          rateLimiter: rateLimiter.getStats()
        }
      };
      
      // Test database connection
      try {
        await pool.query('SELECT 1');
        health.checks.database = true;
      } catch (error) {
        health.checks.database_error = SecureErrorHandler.sanitizeMessage(error.message);
      }
      
      // Test cache
      try {
        const testKey = 'health:' + Date.now();
        await secureCache.set(testKey, 'test');
        const cached = await secureCache.get(testKey);
        health.checks.cache = cached === 'test';
      } catch (error) {
        health.checks.cache_error = SecureErrorHandler.sanitizeMessage(error.message);
      }
      
      // Test rate limiter
      try {
        const testIP = '127.0.0.1';
        health.checks.rateLimiter = rateLimiter.isAllowed(testIP);
      } catch (error) {
        health.checks.rateLimiter_error = SecureErrorHandler.sanitizeMessage(error.message);
      }
      
      // Test footer tables
      const tables = ['footer_content', 'footer_navigation_menus', 'footer_social_links', 'footer_newsletter_config'];
      
      for (const table of tables) {
        try {
          const result = await pool.query(`SELECT COUNT(*) as count FROM ${table}`);
          health.checks.tables[table] = parseInt(result.rows[0].count);
        } catch (error) {
          health.checks.tables[table] = `Error: ${SecureErrorHandler.sanitizeMessage(error.message)}`;
        }
      }
      
      const allHealthy = health.checks.database && health.checks.cache && health.checks.rateLimiter &&
        Object.values(health.checks.tables).every(v => typeof v === 'number');
      
      health.status = allHealthy ? 'healthy' : 'degraded';
      
      res.status(allHealthy ? 200 : 503).json(health);
      
    } catch (error) {
      res.status(500).json(SecureErrorHandler.sanitizeError(error));
    }
  });
  
  // ============================================================================
  // UTILITY METHODS FOR SANITIZATION
  // ============================================================================
  
  // Add sanitization methods to the module context
  this.sanitizeText = function(text, maxLength = 1000) {
    if (!text || typeof text !== 'string') return '';
    
    return text
      .replace(/[<>\"'&]/g, (match) => ({
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '&': '&amp;'
      })[match])
      .substring(0, maxLength);
  };
  
  this.sanitizeURL = function(url) {
    if (!url || typeof url !== 'string') return '';
    
    // Remove dangerous protocols
    if (url.match(/^(javascript|data|vbscript|file):/i)) {
      return '';
    }
    
    // Validate URL format
    if (!url.match(/^(https?:\/\/|\/|#)/)) {
      return '';
    }
    
    return url.substring(0, 500);
  };
  
  this.sanitizeEmail = function(email) {
    if (!email || typeof email !== 'string') return '';
    
    // Basic email validation
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return '';
    }
    
    return email.toLowerCase().substring(0, 255);
  };
  
  // ============================================================================
  // CLEANUP ON SERVER SHUTDOWN
  // ============================================================================
  process.on('SIGINT', () => {
    console.log('🛑 Shutting down footer API...');
    secureCache.destroy();
    rateLimiter.destroy();
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('🛑 Shutting down footer API...');
    secureCache.destroy();
    rateLimiter.destroy();
    process.exit(0);
  });
  
  console.log('✅ Secure footer API endpoints initialized with enhanced security');
  console.log('🔒 Security features: rate limiting, secure caching, input validation, error sanitization');
  console.log('📊 Monitoring available at /api/footer-health');
}

// Export the secure initialization function
module.exports = initSecureFooterAPI;