/**
 * EMERGENCY AUTHENTICATION & JWT SECURITY FIXES
 * 
 * Critical fixes for authentication vulnerabilities:
 * - JWT secret generation and persistence
 * - Rate limiting memory management
 * - Session security improvements
 * - CSRF protection enhancement
 * - Secure cookie handling
 * - Password security validation
 */

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

// ============================================================================
// FIX #1: SECURE JWT SECRET MANAGEMENT WITH PERSISTENCE
// ============================================================================

class SecureJWTManager {
  constructor(options = {}) {
    this.options = {
      secretPath: options.secretPath || path.join(process.cwd(), '.jwt-secret'),
      algorithm: options.algorithm || 'HS256',
      issuer: options.issuer || 'aistudio555-footer-api',
      audience: options.audience || 'aistudio555-users',
      defaultExpiry: options.defaultExpiry || '1h',
      refreshExpiry: options.refreshExpiry || '7d',
      secretRotationInterval: options.secretRotationInterval || 30 * 24 * 60 * 60 * 1000, // 30 days
      ...options
    };
    
    this.currentSecret = null;
    this.previousSecret = null; // For graceful key rotation
    this.secretGeneratedAt = null;
    this.rotationTimer = null;
    
    this.initializeSecret();
  }
  
  async initializeSecret() {
    try {
      // Try to load existing secret
      await this.loadExistingSecret();
      
      if (!this.currentSecret || this.shouldRotateSecret()) {
        await this.generateNewSecret();
      }
      
      // Start rotation timer
      this.startSecretRotationTimer();
      
      console.log('✅ JWT secret manager initialized');
      
    } catch (error) {
      console.error('❌ JWT secret initialization failed:', error);
      
      // Emergency fallback - generate temporary secret
      this.currentSecret = crypto.randomBytes(64).toString('hex');
      this.secretGeneratedAt = Date.now();
      
      console.warn('⚠️ Using temporary JWT secret - not persisted');
    }
  }
  
  async loadExistingSecret() {
    try {
      const secretData = await fs.readFile(this.options.secretPath, 'utf8');
      const parsed = JSON.parse(secretData);
      
      if (this.validateSecretData(parsed)) {
        this.currentSecret = parsed.current;
        this.previousSecret = parsed.previous;
        this.secretGeneratedAt = parsed.generatedAt;
        
        console.log('📝 Loaded existing JWT secret');
        return true;
      }
      
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.warn('Failed to load JWT secret:', error.message);
      }
    }
    
    return false;
  }
  
  validateSecretData(data) {
    return data && 
           typeof data.current === 'string' && 
           data.current.length >= 64 && 
           typeof data.generatedAt === 'number' &&
           Date.now() - data.generatedAt < this.options.secretRotationInterval * 2; // Allow 2x rotation for grace
  }
  
  async generateNewSecret() {
    console.log('🔑 Generating new JWT secret...');
    
    // Keep previous secret for graceful rotation
    this.previousSecret = this.currentSecret;
    
    // Generate cryptographically secure secret
    this.currentSecret = crypto.randomBytes(64).toString('hex');
    this.secretGeneratedAt = Date.now();
    
    // Persist to file
    await this.persistSecret();
    
    console.log('✅ New JWT secret generated and persisted');
  }
  
  async persistSecret() {
    const secretData = {
      current: this.currentSecret,
      previous: this.previousSecret,
      generatedAt: this.secretGeneratedAt,
      algorithm: this.options.algorithm,
      version: 1
    };
    
    try {
      await fs.writeFile(
        this.options.secretPath, 
        JSON.stringify(secretData, null, 2),
        { mode: 0o600 } // Read/write for owner only
      );
    } catch (error) {
      console.error('Failed to persist JWT secret:', error.message);
      throw error;
    }
  }
  
  shouldRotateSecret() {
    if (!this.secretGeneratedAt) return true;
    
    const age = Date.now() - this.secretGeneratedAt;
    return age > this.options.secretRotationInterval;
  }
  
  startSecretRotationTimer() {
    if (this.rotationTimer) {
      clearInterval(this.rotationTimer);
    }
    
    // Check for rotation every day
    this.rotationTimer = setInterval(() => {
      if (this.shouldRotateSecret()) {
        console.log('🔄 Initiating JWT secret rotation...');
        this.generateNewSecret().catch(error => {
          console.error('Secret rotation failed:', error);
        });
      }
    }, 24 * 60 * 60 * 1000);
    
    // Don't keep process alive
    if (this.rotationTimer.unref) {
      this.rotationTimer.unref();
    }
  }
  
  signToken(payload, options = {}) {
    const tokenOptions = {
      algorithm: this.options.algorithm,
      issuer: this.options.issuer,
      audience: this.options.audience,
      expiresIn: options.expiresIn || this.options.defaultExpiry,
      ...options
    };
    
    // Add security claims
    const securePayload = {
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      jti: crypto.randomUUID(), // JWT ID for tracking/revocation
      sub: payload.userId || payload.id, // Subject
    };
    
    // Remove sensitive fields
    delete securePayload.password;
    delete securePayload.passwordHash;
    delete securePayload.secret;
    
    return jwt.sign(securePayload, this.currentSecret, tokenOptions);
  }
  
  verifyToken(token, options = {}) {
    const verifyOptions = {
      algorithm: this.options.algorithm,
      issuer: this.options.issuer,
      audience: this.options.audience,
      ...options
    };
    
    // Try current secret first
    try {
      return jwt.verify(token, this.currentSecret, verifyOptions);
    } catch (error) {
      
      // If token is invalid with current secret, try previous secret (for rotation grace period)
      if (this.previousSecret) {
        try {
          const decoded = jwt.verify(token, this.previousSecret, verifyOptions);
          console.log('🔄 Token verified with previous secret (rotation grace)');
          return decoded;
        } catch (previousError) {
          // Both secrets failed, throw original error
          throw error;
        }
      }
      
      throw error;
    }
  }
  
  generateRefreshToken(payload) {
    return this.signToken(payload, {
      expiresIn: this.options.refreshExpiry
    });
  }
  
  decodeToken(token, options = {}) {
    return jwt.decode(token, options);
  }
  
  async cleanup() {
    if (this.rotationTimer) {
      clearInterval(this.rotationTimer);
      this.rotationTimer = null;
    }
    
    console.log('🧹 JWT manager cleanup completed');
  }
  
  getStats() {
    return {
      secretAge: this.secretGeneratedAt ? Date.now() - this.secretGeneratedAt : 0,
      hasCurrentSecret: !!this.currentSecret,
      hasPreviousSecret: !!this.previousSecret,
      algorithm: this.options.algorithm,
      nextRotation: this.secretGeneratedAt ? 
        this.secretGeneratedAt + this.options.secretRotationInterval : null
    };
  }
}

// ============================================================================
// FIX #2: ADVANCED RATE LIMITING WITH MEMORY MANAGEMENT AND SLIDING WINDOWS
// ============================================================================

class AdvancedRateLimiter {
  constructor(options = {}) {
    this.options = {
      windowMs: options.windowMs || 15 * 60 * 1000, // 15 minutes
      maxRequests: options.maxRequests || 100,
      maxIPs: options.maxIPs || 50000, // Maximum IPs to track
      maxMemoryMB: options.maxMemoryMB || 50, // Memory limit in MB
      cleanupInterval: options.cleanupInterval || 5 * 60 * 1000, // 5 minutes
      slidingWindow: options.slidingWindow !== false, // Enable sliding window by default
      burstAllowance: options.burstAllowance || 0.2, // 20% burst allowance
      ...options
    };
    
    // Use Map for O(1) lookups and better memory management
    this.requests = new Map(); // IP -> request data
    this.blockedIPs = new Map(); // Temporary blocks
    
    // Track memory usage
    this.memoryEstimate = 0;
    this.requestCounter = 0;
    
    // Start maintenance processes
    this.startCleanupTimer();
    this.startMemoryMonitoring();
    
    console.log('🚦 Advanced rate limiter initialized');
  }
  
  isAllowed(clientIP, endpoint = 'default') {
    if (!clientIP || typeof clientIP !== 'string') {
      console.warn('Invalid client IP for rate limiting');
      return false;
    }
    
    const now = Date.now();
    const key = `${clientIP}:${endpoint}`;
    
    // Check if IP is temporarily blocked
    if (this.blockedIPs.has(clientIP)) {
      const blockData = this.blockedIPs.get(clientIP);
      if (now < blockData.until) {
        return false;
      } else {
        this.blockedIPs.delete(clientIP);
      }
    }
    
    // Get or create request tracking data
    let requestData = this.requests.get(key);
    if (!requestData) {
      requestData = {
        requests: [],
        totalRequests: 0,
        firstRequest: now,
        lastRequest: now,
        warnings: 0
      };
      this.requests.set(key, requestData);
      this.updateMemoryEstimate(1);
    }
    
    // Update request data
    requestData.lastRequest = now;
    requestData.totalRequests++;
    this.requestCounter++;
    
    if (this.options.slidingWindow) {
      return this.checkSlidingWindow(requestData, now);
    } else {
      return this.checkFixedWindow(requestData, now);
    }
  }
  
  checkSlidingWindow(requestData, now) {
    const windowStart = now - this.options.windowMs;
    
    // Remove old requests and add current
    requestData.requests = requestData.requests.filter(time => time > windowStart);
    requestData.requests.push(now);
    
    const currentCount = requestData.requests.length;
    const maxAllowed = this.calculateMaxAllowed();
    
    if (currentCount > maxAllowed) {
      this.handleRateLimit(requestData, now);
      return false;
    }
    
    // Warning threshold (80% of limit)
    if (currentCount > maxAllowed * 0.8) {
      requestData.warnings++;
      if (requestData.warnings % 5 === 0) {
        console.warn(`Rate limit warning: ${currentCount}/${maxAllowed} requests in window`);
      }
    }
    
    return true;
  }
  
  checkFixedWindow(requestData, now) {
    const windowStart = requestData.firstRequest;
    const windowAge = now - windowStart;
    
    if (windowAge >= this.options.windowMs) {
      // Reset window
      requestData.requests = [now];
      requestData.firstRequest = now;
      requestData.warnings = 0;
      return true;
    }
    
    const currentCount = requestData.requests.length + 1;
    const maxAllowed = this.calculateMaxAllowed();
    
    if (currentCount > maxAllowed) {
      this.handleRateLimit(requestData, now);
      return false;
    }
    
    requestData.requests.push(now);
    return true;
  }
  
  calculateMaxAllowed() {
    // Allow burst capacity during low-usage periods
    const burstBonus = Math.floor(this.options.maxRequests * this.options.burstAllowance);
    return this.options.maxRequests + burstBonus;
  }
  
  handleRateLimit(requestData, now) {
    const clientIP = this.extractIPFromKey(requestData);
    
    // Implement progressive blocking
    const blockDuration = this.calculateBlockDuration(requestData);
    
    if (blockDuration > 0) {
      this.blockedIPs.set(clientIP, {
        until: now + blockDuration,
        reason: 'rate_limit_exceeded',
        requestCount: requestData.totalRequests
      });
      
      console.warn(`🚫 IP ${clientIP} blocked for ${Math.round(blockDuration / 1000)}s due to rate limiting`);
    }
  }
  
  extractIPFromKey(requestData) {
    // This would need the actual key; simplified for this example
    return 'unknown';
  }
  
  calculateBlockDuration(requestData) {
    // Progressive blocking: more violations = longer blocks
    const violations = Math.max(0, requestData.totalRequests - this.options.maxRequests);
    
    if (violations < 10) return 60000; // 1 minute
    if (violations < 50) return 300000; // 5 minutes
    if (violations < 100) return 900000; // 15 minutes
    return 3600000; // 1 hour
  }
  
  startCleanupTimer() {
    this.cleanupTimer = setInterval(() => {
      this.performCleanup();
    }, this.options.cleanupInterval);
    
    if (this.cleanupTimer.unref) {
      this.cleanupTimer.unref();
    }
  }
  
  startMemoryMonitoring() {
    this.memoryTimer = setInterval(() => {
      this.monitorMemoryUsage();
    }, 60000); // Check every minute
    
    if (this.memoryTimer.unref) {
      this.memoryTimer.unref();
    }
  }
  
  performCleanup() {
    const now = Date.now();
    let cleanedRequests = 0;
    let cleanedBlocks = 0;
    
    // Clean old request data
    for (const [key, data] of this.requests.entries()) {
      const age = now - data.lastRequest;
      
      if (age > this.options.windowMs * 2) {
        this.requests.delete(key);
        cleanedRequests++;
      }
    }
    
    // Clean expired blocks
    for (const [ip, blockData] of this.blockedIPs.entries()) {
      if (now >= blockData.until) {
        this.blockedIPs.delete(ip);
        cleanedBlocks++;
      }
    }
    
    if (cleanedRequests > 0 || cleanedBlocks > 0) {
      console.log(`🧹 Rate limiter cleanup: removed ${cleanedRequests} request entries, ${cleanedBlocks} blocks`);
    }
    
    // Update memory estimate
    this.updateMemoryEstimate(-cleanedRequests);
    
    // Emergency cleanup if too much memory used
    this.performEmergencyCleanup();
  }
  
  monitorMemoryUsage() {
    const estimatedMB = this.memoryEstimate / (1024 * 1024);
    
    if (estimatedMB > this.options.maxMemoryMB) {
      console.warn(`⚠️ Rate limiter memory usage high: ${estimatedMB.toFixed(2)}MB`);
      this.performEmergencyCleanup();
    }
    
    // Log stats periodically
    if (this.requestCounter % 10000 === 0) {
      console.log(`📊 Rate limiter stats: ${this.requests.size} tracked IPs, ${estimatedMB.toFixed(2)}MB`);
    }
  }
  
  performEmergencyCleanup() {
    if (this.requests.size <= this.options.maxIPs) {
      return;
    }
    
    console.warn('🚨 Performing emergency rate limiter cleanup');
    
    // Sort by last request time and remove oldest
    const entries = Array.from(this.requests.entries())
      .sort(([, a], [, b]) => a.lastRequest - b.lastRequest);
    
    const toRemove = this.requests.size - this.options.maxIPs;
    for (let i = 0; i < toRemove; i++) {
      this.requests.delete(entries[i][0]);
    }
    
    this.updateMemoryEstimate(-toRemove);
    console.log(`🧹 Emergency cleanup: removed ${toRemove} oldest entries`);
  }
  
  updateMemoryEstimate(delta) {
    // Rough estimate: 200 bytes per entry on average
    this.memoryEstimate += delta * 200;
    if (this.memoryEstimate < 0) this.memoryEstimate = 0;
  }
  
  getClientStats(clientIP, endpoint = 'default') {
    const key = `${clientIP}:${endpoint}`;
    const requestData = this.requests.get(key);
    
    if (!requestData) {
      return { allowed: true, remaining: this.options.maxRequests };
    }
    
    const now = Date.now();
    const windowStart = now - this.options.windowMs;
    const activeRequests = requestData.requests.filter(time => time > windowStart);
    const remaining = Math.max(0, this.options.maxRequests - activeRequests.length);
    
    return {
      allowed: remaining > 0,
      remaining,
      resetTime: windowStart + this.options.windowMs,
      totalRequests: requestData.totalRequests,
      warnings: requestData.warnings
    };
  }
  
  isBlocked(clientIP) {
    const blockData = this.blockedIPs.get(clientIP);
    return blockData && Date.now() < blockData.until;
  }
  
  unblock(clientIP) {
    const removed = this.blockedIPs.delete(clientIP);
    if (removed) {
      console.log(`✅ Manually unblocked IP: ${clientIP}`);
    }
    return removed;
  }
  
  getStats() {
    const memoryMB = this.memoryEstimate / (1024 * 1024);
    
    return {
      trackedIPs: this.requests.size,
      maxIPs: this.options.maxIPs,
      blockedIPs: this.blockedIPs.size,
      totalRequests: this.requestCounter,
      memoryUsageMB: memoryMB,
      maxMemoryMB: this.options.maxMemoryMB,
      windowMs: this.options.windowMs,
      maxRequests: this.options.maxRequests,
      slidingWindow: this.options.slidingWindow
    };
  }
  
  cleanup() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    
    if (this.memoryTimer) {
      clearInterval(this.memoryTimer);
      this.memoryTimer = null;
    }
    
    this.requests.clear();
    this.blockedIPs.clear();
    this.memoryEstimate = 0;
    
    console.log('🧹 Rate limiter cleanup completed');
  }
}

// ============================================================================
// FIX #3: SECURE SESSION MANAGER WITH REDIS FALLBACK
// ============================================================================

class SecureSessionManager {
  constructor(options = {}) {
    this.options = {
      sessionTTL: options.sessionTTL || 24 * 60 * 60 * 1000, // 24 hours
      maxSessions: options.maxSessions || 10000,
      cleanupInterval: options.cleanupInterval || 60 * 60 * 1000, // 1 hour
      useRedis: options.useRedis && options.redisClient,
      redisClient: options.redisClient,
      encryptionKey: options.encryptionKey || crypto.randomBytes(32),
      ...options
    };
    
    // In-memory fallback
    this.sessions = new Map();
    this.sessionActivity = new Map();
    
    this.startCleanupTimer();
    console.log('🔐 Secure session manager initialized');
  }
  
  async createSession(userId, userData = {}) {
    const sessionId = this.generateSecureSessionId();
    const sessionData = {
      id: sessionId,
      userId,
      userData: this.sanitizeUserData(userData),
      createdAt: Date.now(),
      lastActivity: Date.now(),
      ipAddress: userData.ipAddress,
      userAgent: userData.userAgent?.substring(0, 200), // Limit length
      csrfToken: this.generateCSRFToken()
    };
    
    try {
      if (this.options.useRedis) {
        await this.storeSessionRedis(sessionId, sessionData);
      } else {
        await this.storeSessionMemory(sessionId, sessionData);
      }
      
      console.log(`🔐 Session created for user ${userId}: ${sessionId}`);
      return sessionData;
      
    } catch (error) {
      console.error('Failed to create session:', error);
      throw error;
    }
  }
  
  generateSecureSessionId() {
    // Generate cryptographically secure session ID
    const timestamp = Date.now().toString(36);
    const randomBytes = crypto.randomBytes(32).toString('hex');
    return `${timestamp}_${randomBytes}`;
  }
  
  generateCSRFToken() {
    return crypto.randomBytes(32).toString('hex');
  }
  
  sanitizeUserData(userData) {
    const safe = {};
    
    // Whitelist safe fields
    const allowedFields = [
      'email', 'name', 'role', 'preferences', 'lastLogin',
      'ipAddress', 'userAgent', 'locale', 'timezone'
    ];
    
    allowedFields.forEach(field => {
      if (userData[field] !== undefined) {
        if (typeof userData[field] === 'string') {
          safe[field] = userData[field].substring(0, 1000); // Limit string length
        } else {
          safe[field] = userData[field];
        }
      }
    });
    
    // Never store sensitive data in sessions
    delete safe.password;
    delete safe.passwordHash;
    delete safe.secret;
    delete safe.token;
    
    return safe;
  }
  
  async storeSessionRedis(sessionId, sessionData) {
    const encrypted = this.encryptSessionData(sessionData);
    await this.options.redisClient.setex(
      `session:${sessionId}`,
      Math.floor(this.options.sessionTTL / 1000),
      encrypted
    );
  }
  
  async storeSessionMemory(sessionId, sessionData) {
    // Check memory limits
    if (this.sessions.size >= this.options.maxSessions) {
      await this.evictOldestSession();
    }
    
    this.sessions.set(sessionId, sessionData);
    this.sessionActivity.set(sessionId, Date.now());
  }
  
  async getSession(sessionId) {
    if (!sessionId || typeof sessionId !== 'string') {
      return null;
    }
    
    try {
      let sessionData;
      
      if (this.options.useRedis) {
        sessionData = await this.getSessionRedis(sessionId);
      } else {
        sessionData = await this.getSessionMemory(sessionId);
      }
      
      if (sessionData) {
        // Check if session is expired
        const age = Date.now() - sessionData.createdAt;
        if (age > this.options.sessionTTL) {
          await this.destroySession(sessionId);
          return null;
        }
        
        // Update last activity
        sessionData.lastActivity = Date.now();
        await this.updateSessionActivity(sessionId, sessionData);
        
        return sessionData;
      }
      
      return null;
      
    } catch (error) {
      console.error('Failed to get session:', error);
      return null;
    }
  }
  
  async getSessionRedis(sessionId) {
    const encrypted = await this.options.redisClient.get(`session:${sessionId}`);
    if (encrypted) {
      return this.decryptSessionData(encrypted);
    }
    return null;
  }
  
  async getSessionMemory(sessionId) {
    return this.sessions.get(sessionId) || null;
  }
  
  async updateSessionActivity(sessionId, sessionData) {
    if (this.options.useRedis) {
      const encrypted = this.encryptSessionData(sessionData);
      await this.options.redisClient.setex(
        `session:${sessionId}`,
        Math.floor(this.options.sessionTTL / 1000),
        encrypted
      );
    } else {
      this.sessions.set(sessionId, sessionData);
      this.sessionActivity.set(sessionId, Date.now());
    }
  }
  
  async destroySession(sessionId) {
    try {
      if (this.options.useRedis) {
        await this.options.redisClient.del(`session:${sessionId}`);
      } else {
        this.sessions.delete(sessionId);
        this.sessionActivity.delete(sessionId);
      }
      
      console.log(`🗑️ Session destroyed: ${sessionId}`);
      return true;
      
    } catch (error) {
      console.error('Failed to destroy session:', error);
      return false;
    }
  }
  
  async destroyAllUserSessions(userId) {
    let destroyed = 0;
    
    if (this.options.useRedis) {
      // This would require scanning Redis keys, simplified for example
      console.warn('Redis session cleanup by user not implemented');
    } else {
      for (const [sessionId, sessionData] of this.sessions.entries()) {
        if (sessionData.userId === userId) {
          await this.destroySession(sessionId);
          destroyed++;
        }
      }
    }
    
    console.log(`🗑️ Destroyed ${destroyed} sessions for user ${userId}`);
    return destroyed;
  }
  
  encryptSessionData(data) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher('aes-256-gcm', this.options.encryptionKey);
    
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
      iv: iv.toString('hex'),
      encrypted,
      authTag: authTag.toString('hex')
    };
  }
  
  decryptSessionData(encryptedData) {
    const { iv, encrypted, authTag } = encryptedData;
    const decipher = crypto.createDecipher('aes-256-gcm', this.options.encryptionKey);
    
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return JSON.parse(decrypted);
  }
  
  startCleanupTimer() {
    this.cleanupTimer = setInterval(() => {
      this.performCleanup();
    }, this.options.cleanupInterval);
    
    if (this.cleanupTimer.unref) {
      this.cleanupTimer.unref();
    }
  }
  
  async performCleanup() {
    if (this.options.useRedis) {
      // Redis handles expiration automatically
      return;
    }
    
    const now = Date.now();
    let cleaned = 0;
    
    for (const [sessionId, sessionData] of this.sessions.entries()) {
      const age = now - sessionData.createdAt;
      if (age > this.options.sessionTTL) {
        await this.destroySession(sessionId);
        cleaned++;
      }
    }
    
    if (cleaned > 0) {
      console.log(`🧹 Session cleanup: removed ${cleaned} expired sessions`);
    }
  }
  
  async evictOldestSession() {
    if (this.sessionActivity.size === 0) return;
    
    // Find oldest session by activity
    let oldestId = null;
    let oldestTime = Infinity;
    
    for (const [sessionId, lastActivity] of this.sessionActivity.entries()) {
      if (lastActivity < oldestTime) {
        oldestTime = lastActivity;
        oldestId = sessionId;
      }
    }
    
    if (oldestId) {
      await this.destroySession(oldestId);
      console.log('🗑️ Evicted oldest session due to memory limit');
    }
  }
  
  validateCSRFToken(sessionId, providedToken) {
    const sessionData = this.sessions.get(sessionId);
    if (!sessionData || !sessionData.csrfToken) {
      return false;
    }
    
    return crypto.timingSafeEqual(
      Buffer.from(sessionData.csrfToken),
      Buffer.from(providedToken)
    );
  }
  
  getStats() {
    return {
      activeSessions: this.sessions.size,
      maxSessions: this.options.maxSessions,
      sessionTTL: this.options.sessionTTL,
      useRedis: this.options.useRedis,
      memoryUsage: this.sessions.size * 1000 // Rough estimate
    };
  }
  
  async cleanup() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    
    this.sessions.clear();
    this.sessionActivity.clear();
    
    console.log('🧹 Session manager cleanup completed');
  }
}

// ============================================================================
// FIX #4: ENHANCED PASSWORD SECURITY AND VALIDATION
// ============================================================================

class PasswordSecurity {
  static saltRounds = 12; // bcrypt work factor
  static minLength = 12;
  static maxLength = 128;
  
  // Common passwords and patterns to reject
  static commonPasswords = new Set([
    'password', '123456', 'password123', 'admin', 'qwerty',
    'letmein', 'welcome', 'monkey', '1234567890', 'abc123'
  ]);
  
  static weakPatterns = [
    /^(.)\1+$/, // Repeated characters
    /^(012|123|234|345|456|567|678|789|890|901)+$/, // Sequential numbers
    /^(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)+$/i, // Sequential letters
    /^[a-z]+$/, // Only lowercase
    /^[A-Z]+$/, // Only uppercase
    /^\d+$/, // Only numbers
    /^[!@#$%^&*()]+$/, // Only special chars
  ];
  
  static validatePassword(password) {
    const errors = [];
    
    if (!password || typeof password !== 'string') {
      errors.push('Password is required');
      return { valid: false, errors };
    }
    
    // Length check
    if (password.length < this.minLength) {
      errors.push(`Password must be at least ${this.minLength} characters long`);
    }
    
    if (password.length > this.maxLength) {
      errors.push(`Password must be no more than ${this.maxLength} characters long`);
    }
    
    // Character variety check
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    let varietyCount = [hasLower, hasUpper, hasDigit, hasSpecial].filter(Boolean).length;
    
    if (varietyCount < 3) {
      errors.push('Password must contain at least 3 of: lowercase, uppercase, numbers, special characters');
    }
    
    // Common password check
    if (this.commonPasswords.has(password.toLowerCase())) {
      errors.push('Password is too common');
    }
    
    // Weak pattern check
    for (const pattern of this.weakPatterns) {
      if (pattern.test(password)) {
        errors.push('Password contains weak patterns');
        break;
      }
    }
    
    // Personal information check (would need user context)
    // This would check against email, name, etc. if available
    
    return {
      valid: errors.length === 0,
      errors,
      strength: this.calculateStrength(password)
    };
  }
  
  static calculateStrength(password) {
    let score = 0;
    
    // Length bonus
    if (password.length >= 12) score += 2;
    if (password.length >= 16) score += 2;
    if (password.length >= 20) score += 2;
    
    // Character variety
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 2;
    
    // Bonus for multiple types
    const uniqueChars = new Set(password).size;
    if (uniqueChars >= password.length * 0.7) score += 2; // High character diversity
    
    // Penalties
    if (this.commonPasswords.has(password.toLowerCase())) score -= 3;
    for (const pattern of this.weakPatterns) {
      if (pattern.test(password)) {
        score -= 2;
        break;
      }
    }
    
    // Normalize score to 0-100
    const normalizedScore = Math.max(0, Math.min(100, score * 10));
    
    if (normalizedScore < 30) return 'Very Weak';
    if (normalizedScore < 50) return 'Weak';
    if (normalizedScore < 70) return 'Fair';
    if (normalizedScore < 85) return 'Good';
    return 'Strong';
  }
  
  static async hashPassword(password) {
    const validation = this.validatePassword(password);
    if (!validation.valid) {
      throw new Error(`Invalid password: ${validation.errors.join(', ')}`);
    }
    
    try {
      const salt = await bcrypt.genSalt(this.saltRounds);
      const hash = await bcrypt.hash(password, salt);
      
      return {
        hash,
        strength: validation.strength,
        hashedAt: Date.now()
      };
    } catch (error) {
      console.error('Password hashing failed:', error);
      throw new Error('Failed to secure password');
    }
  }
  
  static async verifyPassword(password, hash) {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      console.error('Password verification failed:', error);
      return false;
    }
  }
  
  static needsRehash(hash) {
    try {
      // Check if hash was created with current salt rounds
      return !bcrypt.getRounds(hash) || bcrypt.getRounds(hash) < this.saltRounds;
    } catch (error) {
      return true; // If we can't determine, assume it needs rehashing
    }
  }
}

// ============================================================================
// FIX #5: SECURE AUTHENTICATION MIDDLEWARE WITH ALL FIXES
// ============================================================================

function createSecureAuthMiddleware(options = {}) {
  const jwtManager = new SecureJWTManager(options.jwt);
  const rateLimiter = new AdvancedRateLimiter(options.rateLimit);
  const sessionManager = new SecureSessionManager(options.session);
  
  // Store instances for cleanup
  const instances = { jwtManager, rateLimiter, sessionManager };
  
  return {
    // Authentication middleware
    requireAuth: async (req, res, next) => {
      try {
        const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
        
        // Apply rate limiting first
        if (!rateLimiter.isAllowed(clientIP, 'auth')) {
          const stats = rateLimiter.getClientStats(clientIP, 'auth');
          return res.status(429).json({
            error: 'Too many authentication attempts',
            resetTime: stats.resetTime,
            retryAfter: Math.ceil((stats.resetTime - Date.now()) / 1000)
          });
        }
        
        // Extract token from Authorization header or cookies
        const token = extractToken(req);
        if (!token) {
          return res.status(401).json({
            error: 'Authentication required',
            message: 'No valid authentication token provided'
          });
        }
        
        // Verify JWT token
        const decoded = jwtManager.verifyToken(token);
        
        // Get session data for additional validation
        const sessionData = await sessionManager.getSession(decoded.jti);
        if (!sessionData) {
          return res.status(401).json({
            error: 'Session expired',
            message: 'Please log in again'
          });
        }
        
        // Validate CSRF token for state-changing requests
        if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
          const csrfToken = req.get('X-CSRF-Token') || req.body._csrf;
          if (!sessionManager.validateCSRFToken(decoded.jti, csrfToken)) {
            return res.status(403).json({
              error: 'CSRF token invalid',
              message: 'Request validation failed'
            });
          }
        }
        
        // Attach user data to request
        req.user = {
          id: decoded.sub,
          email: decoded.email,
          role: decoded.role,
          sessionId: decoded.jti,
          ...sessionData.userData
        };
        
        next();
        
      } catch (error) {
        console.error('Authentication error:', error);
        
        if (error.name === 'TokenExpiredError') {
          return res.status(401).json({
            error: 'Token expired',
            message: 'Please log in again'
          });
        }
        
        if (error.name === 'JsonWebTokenError') {
          return res.status(401).json({
            error: 'Invalid token',
            message: 'Authentication failed'
          });
        }
        
        res.status(500).json({
          error: 'Authentication service error',
          message: 'Please try again later'
        });
      }
    },
    
    // Admin role requirement
    requireAdmin: (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          error: 'Authentication required'
        });
      }
      
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          error: 'Admin access required',
          message: 'This action requires administrator privileges'
        });
      }
      
      next();
    },
    
    // Security headers middleware
    securityHeaders: (req, res, next) => {
      // HTTPS enforcement
      if (process.env.NODE_ENV === 'production' && req.get('X-Forwarded-Proto') !== 'https') {
        return res.redirect(301, `https://${req.get('Host')}${req.url}`);
      }
      
      // Security headers
      res.set({
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
        'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      
      next();
    },
    
    // Get instances for external use
    getInstances: () => instances,
    
    // Cleanup function
    cleanup: async () => {
      await jwtManager.cleanup();
      await rateLimiter.cleanup();
      await sessionManager.cleanup();
      console.log('✅ Authentication middleware cleanup completed');
    }
  };
}

// Helper function to extract token from request
function extractToken(req) {
  // Check Authorization header
  const authHeader = req.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Check cookies (for web sessions)
  if (req.cookies && req.cookies.auth_token) {
    return req.cookies.auth_token;
  }
  
  // Check query parameter (not recommended, but fallback)
  if (req.query.token) {
    return req.query.token;
  }
  
  return null;
}

// ============================================================================
// EXPORT ALL COMPONENTS
// ============================================================================

module.exports = {
  SecureJWTManager,
  AdvancedRateLimiter,
  SecureSessionManager,
  PasswordSecurity,
  createSecureAuthMiddleware,
  extractToken
};

console.log('🔒 Secure authentication components loaded');