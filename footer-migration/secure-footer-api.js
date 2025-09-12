/**
 * SECURE FOOTER API MODULE
 * 
 * Integrates all emergency security fixes into the main server
 * SQLite-compatible version of the comprehensive security fixes
 */

// ============================================================================
// SECURE CACHE IMPLEMENTATION (SQLite compatible)
// ============================================================================

class SecureCache {
  constructor(options = {}) {
    this.cache = new Map();
    this.maxSize = options.maxSize || 1000;
    this.ttl = options.ttl || 3600000; // 1 hour
    this.prefix = options.prefix || 'footer:';
    this.cleanupInterval = options.cleanupInterval || 60000; // 1 minute
    
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
    
    // Emergency cleanup if cache is still too large
    while (this.cache.size > this.maxSize) {
      this.evictLRU();
      cleaned++;
    }
    
    if (cleaned > 0) {
      console.log(`🧹 Footer cache cleanup: removed ${cleaned} expired entries`);
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
// MANAGED RATE LIMITER (Memory-safe)
// ============================================================================

class ManagedRateLimiter {
  constructor(options = {}) {
    this.windowMs = options.windowMs || 15 * 60 * 1000; // 15 minutes
    this.maxAttempts = options.maxAttempts || 100;
    this.maxIPs = options.maxIPs || 10000;
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
  
  isAllowed(ip, endpoint = 'default') {
    const now = Date.now();
    const key = `${ip}:${endpoint}`;
    const ipData = this.attempts.get(key);
    
    if (!ipData) {
      // First request from this IP
      this.attempts.set(key, {
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
    for (const [key, data] of this.attempts.entries()) {
      if (now - data.lastAccess > this.windowMs * 2) {
        this.attempts.delete(key);
        cleaned++;
      }
    }
    
    // Emergency cleanup if too many IPs
    if (this.attempts.size > this.maxIPs) {
      const sortedEntries = Array.from(this.attempts.entries())
        .sort(([, a], [, b]) => a.lastAccess - b.lastAccess);
      
      const toRemove = this.attempts.size - this.maxIPs;
      for (let i = 0; i < toRemove; i++) {
        this.attempts.delete(sortedEntries[i][0]);
        cleaned++;
      }
    }
    
    if (cleaned > 0) {
      console.log(`🚦 Rate limiter cleanup: removed ${cleaned} entries`);
    }
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
// SECURE ERROR HANDLER
// ============================================================================

class SecureErrorHandler {
  static sanitizeError(error, isProduction = process.env.NODE_ENV === 'production') {
    const baseError = {
      error: 'Internal server error',
      timestamp: new Date().toISOString(),
      requestId: this.generateRequestId()
    };
    
    if (!isProduction) {
      baseError.details = {
        message: this.sanitizeMessage(error.message),
        type: error.name
      };
    }
    
    // Log full error details server-side for debugging
    console.error('Footer API Error:', {
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
      .replace(/DETAIL:\s+.*/gi, 'DETAIL: [REDACTED]')
      .replace(/HINT:\s+.*/gi, 'HINT: [REDACTED]');
    
    return sanitized.length > 200 ? sanitized.substring(0, 200) + '...' : sanitized;
  }
  
  static generateRequestId() {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }
}

// ============================================================================
// DATA SANITIZATION UTILITIES
// ============================================================================

function sanitizeText(text, maxLength = 1000) {
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
}

function sanitizeURL(url) {
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
}

function sanitizeEmail(email) {
  if (!email || typeof email !== 'string') return '';
  
  // Basic email validation
  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return '';
  }
  
  return email.toLowerCase().substring(0, 255);
}

// ============================================================================
// SECURE FOOTER API ENDPOINTS
// ============================================================================

function initializeSecureFooterAPI(app, queryDatabase) {
  // Initialize secure components
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
  
  // Apply rate limiting middleware
  app.use('/api/footer*', (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    
    if (!rateLimiter.isAllowed(clientIP, 'footer')) {
      return res.status(429).json({
        error: 'Too many requests',
        message: 'Please try again later',
        retryAfter: 900 // 15 minutes
      });
    }
    
    next();
  });
  
  // ============================================================================
  // GET /api/footer-content - Secure footer data endpoint
  // ============================================================================
  app.get('/api/footer-content', async (req, res) => {
    try {
      const locale = req.query.locale || 'en';
      const preview = req.query.preview === 'true';
      const cacheKey = `complete:${locale}:${preview ? 'preview' : 'published'}`;
      
      // Use atomic cache operations to prevent race conditions
      const footerData = await secureCache.setAtomic(cacheKey, async () => {
        console.log(`🦶 Fetching secure footer content (locale: ${locale}, preview: ${preview})`);
        
        // Get main footer content with locale fallback
        let contentQuery, contentParams;
        
        if (process.env.DATABASE_URL) {
          // PostgreSQL version
          contentQuery = `
            SELECT * FROM footer_content 
            WHERE locale = $1 OR locale = 'en'
            ORDER BY locale = $1 DESC, created_at DESC 
            LIMIT 1
          `;
          contentParams = [locale];
        } else {
          // SQLite version  
          contentQuery = `
            SELECT * FROM footer_content 
            WHERE locale = ? OR locale = 'en'
            ORDER BY CASE WHEN locale = ? THEN 0 ELSE 1 END, created_at DESC 
            LIMIT 1
          `;
          contentParams = [locale, locale];
        }
        
        const contentResult = await queryDatabase(contentQuery, contentParams);
        
        if (contentResult.length === 0) {
          throw new Error(`Footer content not found for locale: ${locale}`);
        }
        
        const content = contentResult[0];
        
        // Get navigation menus with locale fallback
        let navQuery, navParams;
        
        if (process.env.DATABASE_URL) {
          navQuery = `
            SELECT menu_type, menu_title, menu_items, display_order, is_visible
            FROM footer_navigation_menus 
            WHERE (locale = $1 OR locale = 'en') AND is_visible = true
            ORDER BY locale = $1 DESC, display_order ASC
          `;
          navParams = [locale];
        } else {
          navQuery = `
            SELECT menu_type, menu_title, menu_items, display_order, is_visible
            FROM footer_navigation_menus 
            WHERE (locale = ? OR locale = 'en') AND is_visible = 1
            ORDER BY CASE WHEN locale = ? THEN 0 ELSE 1 END, display_order ASC
          `;
          navParams = [locale, locale];
        }
        
        const navResult = await queryDatabase(navQuery, navParams);
        
        // Process navigation safely
        const navigation = {};
        const seenMenuTypes = new Set();
        
        for (const nav of navResult) {
          if (!seenMenuTypes.has(nav.menu_type)) {
            // Parse and sanitize menu items
            let menuItems = [];
            try {
              menuItems = JSON.parse(nav.menu_items || '[]');
              menuItems = menuItems.map(item => ({
                text: sanitizeText(String(item.text || ''), 100),
                url: sanitizeURL(String(item.url || '')),
                target: ['_self', '_blank'].includes(item.target) ? item.target : '_self',
                icon: sanitizeText(String(item.icon || ''), 50),
                order: parseInt(item.order) || 0,
                visible: Boolean(item.visible !== false)
              })).filter(item => item.text && item.url);
            } catch (error) {
              console.warn(`Invalid menu items for ${nav.menu_type}:`, error);
              menuItems = [];
            }
            
            navigation[nav.menu_type] = {
              title: sanitizeText(String(nav.menu_title || ''), 100),
              items: menuItems,
              order: nav.display_order || 0
            };
            seenMenuTypes.add(nav.menu_type);
          }
        }
        
        // Get social links with locale fallback
        let socialQuery, socialParams;
        
        if (process.env.DATABASE_URL) {
          socialQuery = `
            SELECT platform, url, icon_class, display_text, tooltip, display_order
            FROM footer_social_links 
            WHERE (locale = $1 OR locale = 'en') AND is_visible = true
            ORDER BY locale = $1 DESC, display_order ASC
          `;
          socialParams = [locale];
        } else {
          socialQuery = `
            SELECT platform, url, icon_class, display_text, tooltip, display_order
            FROM footer_social_links 
            WHERE (locale = ? OR locale = 'en') AND is_visible = 1
            ORDER BY CASE WHEN locale = ? THEN 0 ELSE 1 END, display_order ASC
          `;
          socialParams = [locale, locale];
        }
        
        const socialResult = await queryDatabase(socialQuery, socialParams);
        
        // Process social links safely
        const social = {};
        const seenPlatforms = new Set();
        
        for (const link of socialResult) {
          if (!seenPlatforms.has(link.platform)) {
            social[link.platform] = {
              url: sanitizeURL(link.url),
              icon: sanitizeText(String(link.icon_class || ''), 100),
              text: sanitizeText(String(link.display_text || ''), 100),
              tooltip: sanitizeText(String(link.tooltip || ''), 200)
            };
            seenPlatforms.add(link.platform);
          }
        }
        
        // Get newsletter config
        let newsletterQuery, newsletterParams;
        
        if (process.env.DATABASE_URL) {
          newsletterQuery = `
            SELECT service_provider, form_fields, gdpr_consent_required, gdpr_consent_text
            FROM footer_newsletter_config 
            WHERE locale = $1 OR locale = 'en'
            ORDER BY locale = $1 DESC
            LIMIT 1
          `;
          newsletterParams = [locale];
        } else {
          newsletterQuery = `
            SELECT service_provider, form_fields, gdpr_consent_required, gdpr_consent_text
            FROM footer_newsletter_config 
            WHERE locale = ? OR locale = 'en'
            ORDER BY CASE WHEN locale = ? THEN 0 ELSE 1 END
            LIMIT 1
          `;
          newsletterParams = [locale, locale];
        }
        
        const newsletterResult = await queryDatabase(newsletterQuery, newsletterParams);
        const newsletter = newsletterResult[0] || {};
        
        // Construct secure response with sanitized data
        return {
          locale,
          version: content.version || 1,
          last_updated: content.updated_at,
          
          // Company information (sanitized)
          company: {
            name: sanitizeText(content.company_name),
            description: sanitizeText(content.company_description, 5000),
            logo_url: sanitizeURL(content.company_logo_url),
            tagline: sanitizeText(content.company_tagline)
          },
          
          // Contact information (sanitized)
          contact: {
            email: sanitizeEmail(content.contact_email),
            phone: sanitizeText(content.contact_phone),
            address: sanitizeText(content.contact_address),
            support_email: sanitizeEmail(content.support_email),
            sales_email: sanitizeEmail(content.sales_email)
          },
          
          // Navigation menus (already sanitized above)
          navigation,
          
          // Social links (already sanitized above)
          social,
          
          // Newsletter configuration (sanitized)
          newsletter: {
            enabled: Boolean(content.newsletter_enabled),
            title: sanitizeText(content.newsletter_title),
            subtitle: sanitizeText(content.newsletter_subtitle, 1000),
            placeholder: sanitizeText(content.newsletter_placeholder),
            button_text: sanitizeText(content.newsletter_button_text),
            success_message: sanitizeText(content.newsletter_success_message),
            error_message: sanitizeText(content.newsletter_error_message),
            form_fields: [],
            gdpr_required: Boolean(newsletter.gdpr_consent_required),
            gdpr_text: sanitizeText(newsletter.gdpr_consent_text)
          },
          
          // Legal information (sanitized)
          legal: {
            copyright: sanitizeText(content.copyright_text, 1000),
            privacy_policy_url: sanitizeURL(content.privacy_policy_url),
            terms_of_service_url: sanitizeURL(content.terms_of_service_url),
            cookie_policy_url: sanitizeURL(content.cookie_policy_url)
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
      const sanitizedError = SecureErrorHandler.sanitizeError(error);
      res.status(error.statusCode || 500).json(sanitizedError);
    }
  });
  
  // ============================================================================
  // GET /api/footer-health - Health check endpoint
  // ============================================================================
  app.get('/api/footer-health', async (req, res) => {
    try {
      const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '2.0.0-secure',
        checks: {
          database: false,
          cache: false,
          rateLimiter: false,
          tables: {}
        },
        performance: {
          cache: secureCache.getStats()
        }
      };
      
      // Test database connection
      try {
        await queryDatabase('SELECT 1', []);
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
      
      // Test footer tables
      const tables = ['footer_content', 'footer_navigation_menus', 'footer_social_links', 'footer_newsletter_config'];
      
      for (const table of tables) {
        try {
          const query = `SELECT COUNT(*) as count FROM ${table}`;
          const result = await queryDatabase(query, []);
          health.checks.tables[table] = parseInt(result[0].count);
        } catch (error) {
          health.checks.tables[table] = `Error: ${SecureErrorHandler.sanitizeMessage(error.message)}`;
        }
      }
      
      const allHealthy = health.checks.database && health.checks.cache &&
        Object.values(health.checks.tables).every(v => typeof v === 'number');
      
      health.status = allHealthy ? 'healthy' : 'degraded';
      
      res.status(allHealthy ? 200 : 503).json(health);
      
    } catch (error) {
      res.status(500).json(SecureErrorHandler.sanitizeError(error));
    }
  });
  
  // Cleanup on server shutdown
  process.on('SIGINT', () => {
    console.log('🛑 Shutting down secure footer API...');
    secureCache.destroy();
    rateLimiter.destroy();
  });
  
  process.on('SIGTERM', () => {
    console.log('🛑 Shutting down secure footer API...');
    secureCache.destroy();
    rateLimiter.destroy();
  });
  
  console.log('✅ Secure footer API endpoints initialized');
  console.log('🔒 Security features: rate limiting, secure caching, input validation, error sanitization');
  console.log('📊 Health monitoring available at /api/footer-health');
}

module.exports = { initializeSecureFooterAPI };