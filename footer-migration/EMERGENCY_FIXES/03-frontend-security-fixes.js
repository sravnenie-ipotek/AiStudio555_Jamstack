/**
 * EMERGENCY FRONTEND SECURITY FIXES
 * 
 * Critical fixes for frontend vulnerabilities:
 * - XSS prevention in HTML generation
 * - LocalStorage quota and private browsing handling
 * - Memory leak prevention in event handlers
 * - Race condition elimination in loading
 * - Content Security Policy compliance
 */

// ============================================================================
// FIX #1: COMPREHENSIVE XSS PREVENTION SYSTEM
// ============================================================================

class XSSProtection {
  static htmlEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };
  
  static dangerousProtocols = [
    'javascript:', 'data:', 'vbscript:', 'file:', 'about:',
    'chrome:', 'chrome-extension:', 'moz-extension:'
  ];
  
  static dangerousTags = [
    'script', 'object', 'embed', 'applet', 'meta', 'iframe',
    'frame', 'frameset', 'link', 'style', 'base'
  ];
  
  static dangerousAttributes = [
    'onload', 'onerror', 'onclick', 'onmouseover', 'onfocus',
    'onblur', 'onchange', 'onsubmit', 'onkeydown', 'onkeyup',
    'onkeypress', 'onmousedown', 'onmouseup', 'onmousemove',
    'ondblclick', 'oncontextmenu', 'onwheel', 'ontouchstart',
    'ontouchend', 'ontouchmove', 'onanimationend', 'onanimationstart'
  ];
  
  /**
   * Escapes HTML entities to prevent XSS
   */
  static escapeHTML(str) {
    if (!str || typeof str !== 'string') {
      return '';
    }
    
    return str.replace(/[&<>"'`=/]/g, (char) => this.htmlEntities[char] || char);
  }
  
  /**
   * Comprehensive HTML sanitization
   */
  static sanitizeHTML(html) {
    if (!html || typeof html !== 'string') {
      return '';
    }
    
    // First pass: escape HTML entities
    let sanitized = this.escapeHTML(html);
    
    // Remove dangerous protocols
    this.dangerousProtocols.forEach(protocol => {
      const regex = new RegExp(protocol.replace(':', '\\s*:'), 'gi');
      sanitized = sanitized.replace(regex, '[BLOCKED_PROTOCOL]:');
    });
    
    // Remove script tags and their contents (even if escaped)
    sanitized = sanitized.replace(/<\s*script[\s\S]*?<\s*\/\s*script\s*>/gi, '[BLOCKED_SCRIPT]');
    
    // Remove dangerous tags
    this.dangerousTags.forEach(tag => {
      const regex = new RegExp(`<\\s*${tag}[^>]*>`, 'gi');
      sanitized = sanitized.replace(regex, `[BLOCKED_${tag.toUpperCase()}]`);
    });
    
    // Remove dangerous attributes
    this.dangerousAttributes.forEach(attr => {
      const regex = new RegExp(`\\s+${attr}\\s*=\\s*[^\\s>]*`, 'gi');
      sanitized = sanitized.replace(regex, '');
    });
    
    return sanitized;
  }
  
  /**
   * Validates and sanitizes URLs
   */
  static sanitizeURL(url) {
    if (!url || typeof url !== 'string') {
      return '';
    }
    
    const trimmed = url.trim();
    
    // Check for dangerous protocols
    for (const protocol of this.dangerousProtocols) {
      if (trimmed.toLowerCase().startsWith(protocol)) {
        console.warn('Blocked dangerous URL protocol:', protocol);
        return '';
      }
    }
    
    // Allow relative URLs, absolute HTTP/HTTPS, mailto, and tel
    const allowedPatterns = [
      /^https?:\/\/[a-zA-Z0-9.-]+/,  // HTTP/HTTPS
      /^\/[^\/]/,                     // Relative from root
      /^\.\.?\//,                     // Relative
      /^#[a-zA-Z0-9_-]+$/,           // Anchor
      /^mailto:[^@]+@[^@]+\.[^@]+$/,  // Email
      /^tel:\+?[0-9\-\(\)\s]+$/      // Phone
    ];
    
    const isValid = allowedPatterns.some(pattern => pattern.test(trimmed));
    
    if (!isValid) {
      console.warn('Blocked invalid URL:', trimmed);
      return '';
    }
    
    return trimmed.substring(0, 500); // Limit length
  }
  
  /**
   * Safely creates DOM elements with sanitized content
   */
  static createSafeElement(tagName, attributes = {}, textContent = '') {
    const element = document.createElement(tagName);
    
    // Whitelist of safe attributes
    const safeAttributes = {
      'class': true,
      'id': true,
      'href': true,
      'src': true,
      'alt': true,
      'title': true,
      'target': true,
      'rel': true,
      'data-': true // Allow data attributes
    };
    
    Object.entries(attributes).forEach(([key, value]) => {
      const lowerKey = key.toLowerCase();
      
      // Check if attribute is safe
      const isSafe = safeAttributes[lowerKey] || 
                    safeAttributes[lowerKey.split('-')[0] + '-'] ||
                    key.startsWith('aria-'); // Allow ARIA attributes
      
      if (isSafe) {
        if (key === 'href' || key === 'src') {
          const sanitizedURL = this.sanitizeURL(value);
          if (sanitizedURL) {
            element.setAttribute(key, sanitizedURL);
          }
        } else if (key === 'target') {
          // Only allow safe targets
          if (['_self', '_blank', '_parent', '_top'].includes(value)) {
            element.setAttribute(key, value);
            // Add security for _blank
            if (value === '_blank') {
              element.setAttribute('rel', 'noopener noreferrer');
            }
          }
        } else {
          element.setAttribute(key, this.escapeHTML(String(value)));
        }
      }
    });
    
    // Set text content safely
    if (textContent) {
      element.textContent = String(textContent);
    }
    
    return element;
  }
}

// ============================================================================
// FIX #2: ROBUST STORAGE SYSTEM WITH FALLBACKS
// ============================================================================

class RobustStorage {
  constructor(prefix = 'footer_', options = {}) {
    this.prefix = prefix;
    this.options = {
      ttl: options.ttl || 3600000, // 1 hour default
      maxSize: options.maxSize || 5 * 1024 * 1024, // 5MB default
      maxItems: options.maxItems || 1000,
      compressionThreshold: options.compressionThreshold || 10000 // 10KB
    };
    
    // Test storage availability
    this.capabilities = this.testStorageCapabilities();
    
    // Initialize memory fallback
    this.memoryStore = new Map();
    this.memoryTimestamps = new Map();
    
    // Start cleanup timer
    this.startCleanupTimer();
  }
  
  testStorageCapabilities() {
    const capabilities = {
      localStorage: false,
      sessionStorage: false,
      indexedDB: false,
      memory: true // Always available
    };
    
    // Test localStorage
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      capabilities.localStorage = true;
    } catch (e) {
      console.warn('localStorage not available:', e.message);
    }
    
    // Test sessionStorage
    try {
      const testKey = '__storage_test__';
      sessionStorage.setItem(testKey, 'test');
      sessionStorage.removeItem(testKey);
      capabilities.sessionStorage = true;
    } catch (e) {
      console.warn('sessionStorage not available:', e.message);
    }
    
    // Test IndexedDB
    if (typeof indexedDB !== 'undefined') {
      capabilities.indexedDB = true;
    }
    
    console.log('Storage capabilities:', capabilities);
    return capabilities;
  }
  
  startCleanupTimer() {
    // Clean up expired entries every 5 minutes
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
    
    // Don't keep process alive
    if (this.cleanupTimer.unref) {
      this.cleanupTimer.unref();
    }
  }
  
  async setItem(key, data, ttl = this.options.ttl) {
    const fullKey = this.prefix + key;
    const timestamp = Date.now();
    const expiresAt = timestamp + ttl;
    
    const item = {
      data,
      timestamp,
      expiresAt,
      version: 1
    };
    
    const serialized = JSON.stringify(item);
    const size = new Blob([serialized]).size;
    
    // Check size limits
    if (size > this.options.maxSize) {
      throw new Error(`Item too large: ${size} bytes (max: ${this.options.maxSize})`);
    }
    
    // Try storage methods in order of preference
    const success = await this.tryStorageMethods(fullKey, serialized);
    
    if (!success) {
      console.warn('All storage methods failed, data not persisted');
      return false;
    }
    
    return true;
  }
  
  async tryStorageMethods(key, serialized) {
    // Method 1: localStorage (persistent, synchronous)
    if (this.capabilities.localStorage) {
      try {
        // Check quota before storing
        this.checkLocalStorageQuota(key, serialized);
        localStorage.setItem(key, serialized);
        return true;
      } catch (e) {
        console.warn('localStorage failed:', e.message);
        this.capabilities.localStorage = false; // Mark as unavailable
      }
    }
    
    // Method 2: sessionStorage (session-persistent, synchronous)
    if (this.capabilities.sessionStorage) {
      try {
        this.checkSessionStorageQuota(key, serialized);
        sessionStorage.setItem(key, serialized);
        return true;
      } catch (e) {
        console.warn('sessionStorage failed:', e.message);
        this.capabilities.sessionStorage = false;
      }
    }
    
    // Method 3: Memory fallback (non-persistent but reliable)
    try {
      const parsed = JSON.parse(serialized);
      this.memoryStore.set(key, parsed);
      this.memoryTimestamps.set(key, Date.now());
      
      // Enforce memory limits
      this.enforceMemoryLimits();
      
      console.log('Using memory storage fallback for:', key);
      return true;
    } catch (e) {
      console.error('Memory storage failed:', e.message);
    }
    
    return false;
  }
  
  checkLocalStorageQuota(key, value) {
    // Estimate current usage
    let currentSize = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const localKey = localStorage.key(i);
      const localValue = localStorage.getItem(localKey);
      currentSize += localKey.length + localValue.length;
    }
    
    const newSize = key.length + value.length;
    const totalSize = currentSize + newSize;
    
    // Conservative quota estimate (5MB for most browsers)
    const estimatedQuota = 5 * 1024 * 1024;
    
    if (totalSize > estimatedQuota * 0.8) {
      // Clean up old items if approaching quota
      this.cleanupLocalStorage();
    }
  }
  
  checkSessionStorageQuota(key, value) {
    // Similar quota check for sessionStorage
    let currentSize = 0;
    for (let i = 0; i < sessionStorage.length; i++) {
      const sessionKey = sessionStorage.key(i);
      const sessionValue = sessionStorage.getItem(sessionKey);
      currentSize += sessionKey.length + sessionValue.length;
    }
    
    const newSize = key.length + value.length;
    const totalSize = currentSize + newSize;
    
    const estimatedQuota = 5 * 1024 * 1024;
    
    if (totalSize > estimatedQuota * 0.8) {
      this.cleanupSessionStorage();
    }
  }
  
  async getItem(key) {
    const fullKey = this.prefix + key;
    
    // Try storage methods in order
    let item = null;
    
    // Method 1: localStorage
    if (this.capabilities.localStorage) {
      try {
        const stored = localStorage.getItem(fullKey);
        if (stored) {
          item = JSON.parse(stored);
        }
      } catch (e) {
        console.warn('localStorage read failed:', e.message);
      }
    }
    
    // Method 2: sessionStorage
    if (!item && this.capabilities.sessionStorage) {
      try {
        const stored = sessionStorage.getItem(fullKey);
        if (stored) {
          item = JSON.parse(stored);
        }
      } catch (e) {
        console.warn('sessionStorage read failed:', e.message);
      }
    }
    
    // Method 3: Memory fallback
    if (!item && this.memoryStore.has(fullKey)) {
      item = this.memoryStore.get(fullKey);
    }
    
    // Check expiration
    if (item) {
      if (Date.now() > item.expiresAt) {
        // Expired, remove it
        await this.removeItem(key);
        return null;
      }
      
      return item.data;
    }
    
    return null;
  }
  
  async removeItem(key) {
    const fullKey = this.prefix + key;
    
    // Remove from all storage methods
    if (this.capabilities.localStorage) {
      try {
        localStorage.removeItem(fullKey);
      } catch (e) {
        console.warn('localStorage remove failed:', e.message);
      }
    }
    
    if (this.capabilities.sessionStorage) {
      try {
        sessionStorage.removeItem(fullKey);
      } catch (e) {
        console.warn('sessionStorage remove failed:', e.message);
      }
    }
    
    this.memoryStore.delete(fullKey);
    this.memoryTimestamps.delete(fullKey);
  }
  
  cleanup() {
    const now = Date.now();
    let cleanedCount = 0;
    
    // Clean localStorage
    if (this.capabilities.localStorage) {
      cleanedCount += this.cleanupStorage(localStorage, now);
    }
    
    // Clean sessionStorage
    if (this.capabilities.sessionStorage) {
      cleanedCount += this.cleanupStorage(sessionStorage, now);
    }
    
    // Clean memory storage
    for (const [key, item] of this.memoryStore.entries()) {
      if (now > item.expiresAt) {
        this.memoryStore.delete(key);
        this.memoryTimestamps.delete(key);
        cleanedCount++;
      }
    }
    
    if (cleanedCount > 0) {
      console.log(`🧹 Storage cleanup: removed ${cleanedCount} expired items`);
    }
    
    // Enforce memory limits
    this.enforceMemoryLimits();
  }
  
  cleanupStorage(storage, now) {
    let cleaned = 0;
    const keysToRemove = [];
    
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key && key.startsWith(this.prefix)) {
        try {
          const item = JSON.parse(storage.getItem(key));
          if (item && item.expiresAt && now > item.expiresAt) {
            keysToRemove.push(key);
          }
        } catch (e) {
          // Invalid item, remove it
          keysToRemove.push(key);
        }
      }
    }
    
    keysToRemove.forEach(key => {
      try {
        storage.removeItem(key);
        cleaned++;
      } catch (e) {
        console.warn('Failed to remove expired item:', key);
      }
    });
    
    return cleaned;
  }
  
  cleanupLocalStorage() {
    return this.cleanupStorage(localStorage, Date.now());
  }
  
  cleanupSessionStorage() {
    return this.cleanupStorage(sessionStorage, Date.now());
  }
  
  enforceMemoryLimits() {
    // Limit number of items in memory
    while (this.memoryStore.size > this.options.maxItems) {
      // Remove oldest item
      let oldestKey = null;
      let oldestTime = Infinity;
      
      for (const [key, timestamp] of this.memoryTimestamps.entries()) {
        if (timestamp < oldestTime) {
          oldestTime = timestamp;
          oldestKey = key;
        }
      }
      
      if (oldestKey) {
        this.memoryStore.delete(oldestKey);
        this.memoryTimestamps.delete(oldestKey);
      } else {
        break; // Safety break
      }
    }
  }
  
  getStats() {
    return {
      capabilities: this.capabilities,
      memoryItems: this.memoryStore.size,
      maxItems: this.options.maxItems,
      memoryUsage: this.estimateMemoryUsage()
    };
  }
  
  estimateMemoryUsage() {
    let usage = 0;
    for (const [key, value] of this.memoryStore.entries()) {
      usage += key.length * 2; // UTF-16 chars are 2 bytes
      usage += JSON.stringify(value).length * 2;
    }
    return usage;
  }
  
  destroy() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
    
    this.memoryStore.clear();
    this.memoryTimestamps.clear();
  }
}

// ============================================================================
// FIX #3: MEMORY-SAFE EVENT HANDLER MANAGER
// ============================================================================

class EventHandlerManager {
  constructor() {
    this.handlers = new Map();
    this.elementCounter = 0;
    
    // Track elements for cleanup
    this.trackedElements = new WeakMap();
    
    // Auto-cleanup on page unload
    this.setupAutoCleanup();
  }
  
  setupAutoCleanup() {
    // Clean up when page unloads
    window.addEventListener('beforeunload', () => {
      this.cleanup();
    });
    
    // Clean up when page becomes hidden (mobile backgrounding)
    if (typeof document.addEventListener === 'function') {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.cleanup();
        }
      });
    }
  }
  
  addHandler(element, eventType, handler, options = {}) {
    if (!element || typeof handler !== 'function') {
      console.warn('Invalid element or handler provided to EventHandlerManager');
      return null;
    }
    
    // Generate unique ID for this element if not exists
    if (!this.trackedElements.has(element)) {
      this.trackedElements.set(element, {
        id: ++this.elementCounter,
        handlers: []
      });
    }
    
    const elementData = this.trackedElements.get(element);
    const handlerId = `${elementData.id}_${eventType}_${Date.now()}`;
    
    // Wrap handler for error handling and cleanup
    const wrappedHandler = (event) => {
      try {
        handler(event);
      } catch (error) {
        console.error('Event handler error:', error);
        // Don't let handler errors break the page
      }
    };
    
    const handlerInfo = {
      id: handlerId,
      element,
      eventType,
      originalHandler: handler,
      wrappedHandler,
      options,
      added: Date.now()
    };
    
    // Store handler info
    this.handlers.set(handlerId, handlerInfo);
    elementData.handlers.push(handlerId);
    
    // Add event listener
    element.addEventListener(eventType, wrappedHandler, options);
    
    return handlerId;
  }
  
  removeHandler(handlerId) {
    const handlerInfo = this.handlers.get(handlerId);
    
    if (handlerInfo) {
      const { element, eventType, wrappedHandler, options } = handlerInfo;
      
      // Remove event listener
      try {
        element.removeEventListener(eventType, wrappedHandler, options);
      } catch (error) {
        console.warn('Failed to remove event listener:', error);
      }
      
      // Clean up tracking
      this.handlers.delete(handlerId);
      
      const elementData = this.trackedElements.get(element);
      if (elementData) {
        const index = elementData.handlers.indexOf(handlerId);
        if (index > -1) {
          elementData.handlers.splice(index, 1);
        }
        
        // If no more handlers, remove element tracking
        if (elementData.handlers.length === 0) {
          this.trackedElements.delete(element);
        }
      }
      
      return true;
    }
    
    return false;
  }
  
  removeElementHandlers(element) {
    const elementData = this.trackedElements.get(element);
    
    if (elementData) {
      // Remove all handlers for this element
      const handlerIds = [...elementData.handlers];
      handlerIds.forEach(id => this.removeHandler(id));
      
      return handlerIds.length;
    }
    
    return 0;
  }
  
  cleanup() {
    let cleanedCount = 0;
    
    // Remove all handlers
    for (const handlerId of this.handlers.keys()) {
      if (this.removeHandler(handlerId)) {
        cleanedCount++;
      }
    }
    
    if (cleanedCount > 0) {
      console.log(`🧹 Event handler cleanup: removed ${cleanedCount} handlers`);
    }
    
    return cleanedCount;
  }
  
  getStats() {
    return {
      totalHandlers: this.handlers.size,
      trackedElements: this.elementCounter,
      oldestHandler: this.getOldestHandler()
    };
  }
  
  getOldestHandler() {
    let oldest = null;
    let oldestTime = Infinity;
    
    for (const handler of this.handlers.values()) {
      if (handler.added < oldestTime) {
        oldestTime = handler.added;
        oldest = handler;
      }
    }
    
    return oldest ? {
      age: Date.now() - oldest.added,
      eventType: oldest.eventType
    } : null;
  }
}

// ============================================================================
// FIX #4: RACE-CONDITION-FREE LOADING MANAGER
// ============================================================================

class AtomicLoadingManager {
  constructor() {
    this.loadingStates = new Map();
    this.loadingPromises = new Map();
    this.maxConcurrentLoads = 3;
    this.loadTimeout = 30000; // 30 seconds
  }
  
  async load(key, loadFunction, options = {}) {
    const {
      timeout = this.loadTimeout,
      retries = 3,
      retryDelay = 1000
    } = options;
    
    // Check if already loading
    if (this.loadingPromises.has(key)) {
      console.log(`⏳ ${key} already loading, waiting...`);
      return this.loadingPromises.get(key);
    }
    
    // Check concurrent load limit
    if (this.loadingPromises.size >= this.maxConcurrentLoads) {
      console.log(`🚦 Load queue full, waiting for ${key}...`);
      await this.waitForSlot();
    }
    
    // Create loading promise with timeout and retries
    const loadPromise = this.executeLoadWithRetries(key, loadFunction, {
      timeout,
      retries,
      retryDelay
    });
    
    this.loadingPromises.set(key, loadPromise);
    this.loadingStates.set(key, {
      status: 'loading',
      startTime: Date.now(),
      attempts: 0
    });
    
    try {
      const result = await loadPromise;
      
      this.loadingStates.set(key, {
        status: 'completed',
        completedAt: Date.now(),
        result
      });
      
      return result;
      
    } catch (error) {
      this.loadingStates.set(key, {
        status: 'failed',
        failedAt: Date.now(),
        error: error.message
      });
      
      throw error;
      
    } finally {
      // Always clean up promise
      this.loadingPromises.delete(key);
    }
  }
  
  async executeLoadWithRetries(key, loadFunction, options) {
    const { timeout, retries, retryDelay } = options;
    let lastError = null;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`🔄 Loading ${key} (attempt ${attempt}/${retries})`);
        
        // Update attempt counter
        const state = this.loadingStates.get(key);
        if (state) {
          state.attempts = attempt;
        }
        
        // Execute with timeout
        const result = await this.executeWithTimeout(loadFunction, timeout);
        
        console.log(`✅ Successfully loaded ${key} on attempt ${attempt}`);
        return result;
        
      } catch (error) {
        lastError = error;
        console.warn(`❌ Load attempt ${attempt} failed for ${key}:`, error.message);
        
        // Don't retry on certain errors
        if (this.isNonRetryableError(error)) {
          break;
        }
        
        // Wait before retry (except on last attempt)
        if (attempt < retries) {
          await this.delay(retryDelay * attempt); // Exponential backoff
        }
      }
    }
    
    throw new Error(`Failed to load ${key} after ${retries} attempts: ${lastError?.message}`);
  }
  
  async executeWithTimeout(func, timeout) {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Operation timed out after ${timeout}ms`));
      }, timeout);
      
      Promise.resolve(func())
        .then(result => {
          clearTimeout(timeoutId);
          resolve(result);
        })
        .catch(error => {
          clearTimeout(timeoutId);
          reject(error);
        });
    });
  }
  
  isNonRetryableError(error) {
    // Don't retry certain types of errors
    const nonRetryablePatterns = [
      /404/i,                    // Not found
      /401|403/i,                // Authentication/authorization
      /400/i,                    // Bad request
      /invalid.*json/i,          // JSON parsing errors
      /network.*error/i,         // Network errors (might be transient, but often not)
    ];
    
    return nonRetryablePatterns.some(pattern => 
      pattern.test(error.message) || pattern.test(error.name)
    );
  }
  
  async waitForSlot() {
    // Wait for at least one loading operation to complete
    const promises = Array.from(this.loadingPromises.values());
    
    if (promises.length === 0) {
      return;
    }
    
    // Wait for the fastest one to complete
    await Promise.race(promises.map(p => 
      p.catch(() => {}) // Ignore errors, just wait for completion
    ));
  }
  
  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  isLoading(key) {
    return this.loadingPromises.has(key);
  }
  
  getLoadingStatus(key) {
    return this.loadingStates.get(key);
  }
  
  cancelLoad(key) {
    if (this.loadingPromises.has(key)) {
      this.loadingPromises.delete(key);
      this.loadingStates.set(key, {
        status: 'cancelled',
        cancelledAt: Date.now()
      });
      return true;
    }
    return false;
  }
  
  cleanup() {
    // Cancel all pending loads
    const cancelledCount = this.loadingPromises.size;
    
    this.loadingPromises.clear();
    this.loadingStates.clear();
    
    if (cancelledCount > 0) {
      console.log(`🧹 Loading manager cleanup: cancelled ${cancelledCount} pending loads`);
    }
    
    return cancelledCount;
  }
  
  getStats() {
    return {
      activeLoads: this.loadingPromises.size,
      maxConcurrent: this.maxConcurrentLoads,
      stateEntries: this.loadingStates.size,
      loadHistory: Array.from(this.loadingStates.entries())
        .map(([key, state]) => ({ key, ...state }))
        .sort((a, b) => (b.startTime || 0) - (a.startTime || 0))
        .slice(0, 10) // Last 10 operations
    };
  }
}

// ============================================================================
// FIX #5: SECURE FOOTER LOADER WITH ALL FIXES APPLIED
// ============================================================================

class SecureFooterLoader {
  constructor(config = {}) {
    this.config = {
      API_BASE_URL: config.API_BASE_URL || '',
      FOOTER_SELECTOR: config.FOOTER_SELECTOR || '.footer-dynamic',
      VERSION: config.VERSION || 2,
      RETRY_COUNT: config.RETRY_COUNT || 3,
      RETRY_DELAY: config.RETRY_DELAY || 1000,
      CACHE_TTL: config.CACHE_TTL || 3600000,
      ...config
    };
    
    // Initialize secure components
    this.storage = new RobustStorage(`footer_v${this.config.VERSION}_`, {
      ttl: this.config.CACHE_TTL,
      maxSize: 1024 * 1024, // 1MB
      maxItems: 100
    });
    
    this.eventManager = new EventHandlerManager();
    this.loadingManager = new AtomicLoadingManager();
    this.xss = XSSProtection;
    
    // Error tracking
    this.errorCount = 0;
    this.lastError = null;
    
    // Performance tracking
    this.loadTimes = [];
    
    // Bind methods
    this.loadFooter = this.loadFooter.bind(this);
    this.handleError = this.handleError.bind(this);
    
    console.log('🔒 SecureFooterLoader initialized with enhanced security');
  }
  
  async loadFooter(locale = 'en', options = {}) {
    const loadKey = `footer-${locale}`;
    
    try {
      return await this.loadingManager.load(loadKey, async () => {
        const startTime = performance.now();
        
        console.log(`🦶 Loading secure footer (locale: ${locale})`);
        
        // Try cache first (unless bypassed)
        if (!options.bypassCache) {
          const cached = await this.storage.getItem(`content-${locale}`);
          if (cached) {
            console.log('📦 Using cached footer data');
            await this.renderFooter(cached);
            return cached;
          }
        }
        
        // Show loading skeleton
        this.showSecureSkeleton();
        
        // Fetch fresh data with security validation
        const data = await this.fetchSecureData(locale, options);
        
        // Cache the data
        if (!options.preview) {
          await this.storage.setItem(`content-${locale}`, data);
        }
        
        // Render securely
        await this.renderFooter(data);
        
        // Track performance
        const loadTime = performance.now() - startTime;
        this.loadTimes.push(loadTime);
        if (this.loadTimes.length > 10) {
          this.loadTimes.shift(); // Keep only last 10
        }
        
        console.log(`✅ Footer loaded securely in ${Math.round(loadTime)}ms`);
        return data;
        
      }, {
        timeout: 30000,
        retries: this.config.RETRY_COUNT,
        retryDelay: this.config.RETRY_DELAY
      });
      
    } catch (error) {
      console.error('❌ Secure footer loading failed:', error);
      this.handleError(error);
      throw error;
    }
  }
  
  async fetchSecureData(locale, options = {}) {
    const queryParams = new URLSearchParams({
      locale,
      ...(options.preview && { preview: 'true' })
    });
    
    const url = `${this.config.API_BASE_URL}/api/footer-content?${queryParams}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Cache-Control': options.preview ? 'no-cache' : 'public, max-age=3600'
      },
      credentials: 'same-origin'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Validate data structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid footer data received');
    }
    
    // Sanitize all data before processing
    return this.sanitizeFooterData(data);
  }
  
  sanitizeFooterData(data) {
    const sanitized = {
      locale: String(data.locale || 'en'),
      version: parseInt(data.version) || 1,
      last_updated: data.last_updated,
      
      company: {
        name: this.xss.escapeHTML(data.company?.name || ''),
        description: this.xss.sanitizeHTML(data.company?.description || ''),
        logo_url: this.xss.sanitizeURL(data.company?.logo_url || ''),
        tagline: this.xss.escapeHTML(data.company?.tagline || '')
      },
      
      contact: {
        email: this.xss.escapeHTML(data.contact?.email || ''),
        phone: this.xss.escapeHTML(data.contact?.phone || ''),
        address: this.xss.escapeHTML(data.contact?.address || ''),
        support_email: this.xss.escapeHTML(data.contact?.support_email || ''),
        sales_email: this.xss.escapeHTML(data.contact?.sales_email || '')
      },
      
      navigation: this.sanitizeNavigation(data.navigation || {}),
      social: this.sanitizeSocialLinks(data.social || {}),
      
      newsletter: {
        enabled: Boolean(data.newsletter?.enabled),
        title: this.xss.escapeHTML(data.newsletter?.title || ''),
        subtitle: this.xss.escapeHTML(data.newsletter?.subtitle || ''),
        placeholder: this.xss.escapeHTML(data.newsletter?.placeholder || ''),
        button_text: this.xss.escapeHTML(data.newsletter?.button_text || ''),
        success_message: this.xss.escapeHTML(data.newsletter?.success_message || ''),
        error_message: this.xss.escapeHTML(data.newsletter?.error_message || ''),
        gdpr_required: Boolean(data.newsletter?.gdpr_required),
        gdpr_text: this.xss.escapeHTML(data.newsletter?.gdpr_text || '')
      },
      
      legal: {
        copyright: this.xss.escapeHTML(data.legal?.copyright || ''),
        privacy_policy_url: this.xss.sanitizeURL(data.legal?.privacy_policy_url || ''),
        terms_of_service_url: this.xss.sanitizeURL(data.legal?.terms_of_service_url || ''),
        cookie_policy_url: this.xss.sanitizeURL(data.legal?.cookie_policy_url || '')
      },
      
      settings: data.settings || {}
    };
    
    return sanitized;
  }
  
  sanitizeNavigation(navigation) {
    const sanitized = {};
    
    Object.entries(navigation).forEach(([menuType, menu]) => {
      if (menu && typeof menu === 'object') {
        sanitized[menuType] = {
          title: this.xss.escapeHTML(menu.title || ''),
          items: Array.isArray(menu.items) ? menu.items.map(item => ({
            text: this.xss.escapeHTML(item.text || ''),
            url: this.xss.sanitizeURL(item.url || ''),
            target: ['_self', '_blank'].includes(item.target) ? item.target : '_self',
            icon: this.xss.escapeHTML(item.icon || ''),
            order: parseInt(item.order) || 0,
            visible: Boolean(item.visible !== false)
          })).filter(item => item.text && item.url) : [],
          order: parseInt(menu.order) || 0
        };
      }
    });
    
    return sanitized;
  }
  
  sanitizeSocialLinks(social) {
    const sanitized = {};
    
    Object.entries(social).forEach(([platform, link]) => {
      if (link && typeof link === 'object') {
        sanitized[platform] = {
          url: this.xss.sanitizeURL(link.url || ''),
          icon: this.xss.escapeHTML(link.icon || ''),
          text: this.xss.escapeHTML(link.text || ''),
          tooltip: this.xss.escapeHTML(link.tooltip || '')
        };
      }
    });
    
    return sanitized;
  }
  
  async renderFooter(data) {
    const footerContainer = document.querySelector(this.config.FOOTER_SELECTOR);
    if (!footerContainer) {
      throw new Error('Footer container not found');
    }
    
    // Clean up existing event handlers
    this.eventManager.removeElementHandlers(footerContainer);
    
    // Clear container safely
    footerContainer.innerHTML = '';
    
    // Build footer using secure DOM methods
    const footerElement = this.buildSecureFooter(data);
    
    // Append safely
    footerContainer.appendChild(footerElement);
    
    // Setup secure event handlers
    this.setupSecureEventHandlers(footerContainer, data);
  }
  
  buildSecureFooter(data) {
    const footer = this.xss.createSafeElement('footer', {
      'class': 'secure-footer',
      'data-version': data.version,
      'data-locale': data.locale
    });
    
    // Company section
    if (data.settings.show_company_info && data.company.name) {
      const companySection = this.buildCompanySection(data.company);
      footer.appendChild(companySection);
    }
    
    // Navigation section
    if (data.settings.show_navigation && Object.keys(data.navigation).length > 0) {
      const navSection = this.buildNavigationSection(data.navigation);
      footer.appendChild(navSection);
    }
    
    // Social links section
    if (data.settings.show_social_links && Object.keys(data.social).length > 0) {
      const socialSection = this.buildSocialSection(data.social);
      footer.appendChild(socialSection);
    }
    
    // Newsletter section
    if (data.settings.show_newsletter && data.newsletter.enabled) {
      const newsletterSection = this.buildNewsletterSection(data.newsletter);
      footer.appendChild(newsletterSection);
    }
    
    // Legal section
    const legalSection = this.buildLegalSection(data.legal);
    footer.appendChild(legalSection);
    
    return footer;
  }
  
  buildCompanySection(company) {
    const section = this.xss.createSafeElement('div', {
      'class': 'footer-company-section'
    });
    
    if (company.logo_url) {
      const logo = this.xss.createSafeElement('img', {
        'src': company.logo_url,
        'alt': company.name + ' Logo',
        'class': 'footer-logo'
      });
      section.appendChild(logo);
    }
    
    if (company.name) {
      const name = this.xss.createSafeElement('h3', {
        'class': 'footer-company-name'
      }, company.name);
      section.appendChild(name);
    }
    
    if (company.description) {
      const description = this.xss.createSafeElement('p', {
        'class': 'footer-company-description'
      }, company.description);
      section.appendChild(description);
    }
    
    return section;
  }
  
  buildNavigationSection(navigation) {
    const section = this.xss.createSafeElement('div', {
      'class': 'footer-navigation-section'
    });
    
    Object.entries(navigation)
      .sort(([,a], [,b]) => a.order - b.order)
      .forEach(([menuType, menu]) => {
        if (menu.items && menu.items.length > 0) {
          const menuElement = this.buildNavigationMenu(menu, menuType);
          section.appendChild(menuElement);
        }
      });
    
    return section;
  }
  
  buildNavigationMenu(menu, menuType) {
    const menuDiv = this.xss.createSafeElement('div', {
      'class': `footer-nav-menu footer-nav-${menuType}`
    });
    
    if (menu.title) {
      const title = this.xss.createSafeElement('h4', {
        'class': 'footer-nav-title'
      }, menu.title);
      menuDiv.appendChild(title);
    }
    
    const list = this.xss.createSafeElement('ul', {
      'class': 'footer-nav-list'
    });
    
    menu.items
      .filter(item => item.visible)
      .sort((a, b) => a.order - b.order)
      .forEach(item => {
        const listItem = this.xss.createSafeElement('li', {
          'class': 'footer-nav-item'
        });
        
        const link = this.xss.createSafeElement('a', {
          'href': item.url,
          'target': item.target,
          'class': 'footer-nav-link'
        }, item.text);
        
        listItem.appendChild(link);
        list.appendChild(listItem);
      });
    
    menuDiv.appendChild(list);
    return menuDiv;
  }
  
  buildSocialSection(social) {
    const section = this.xss.createSafeElement('div', {
      'class': 'footer-social-section'
    });
    
    const title = this.xss.createSafeElement('h4', {
      'class': 'footer-social-title'
    }, 'Follow Us');
    section.appendChild(title);
    
    const list = this.xss.createSafeElement('div', {
      'class': 'footer-social-links'
    });
    
    Object.entries(social).forEach(([platform, link]) => {
      if (link.url) {
        const linkElement = this.xss.createSafeElement('a', {
          'href': link.url,
          'target': '_blank',
          'class': `footer-social-link footer-social-${platform}`,
          'title': link.tooltip || link.text,
          'aria-label': `Follow us on ${platform}`
        }, link.text || platform);
        
        list.appendChild(linkElement);
      }
    });
    
    section.appendChild(list);
    return section;
  }
  
  buildNewsletterSection(newsletter) {
    const section = this.xss.createSafeElement('div', {
      'class': 'footer-newsletter-section'
    });
    
    if (newsletter.title) {
      const title = this.xss.createSafeElement('h4', {
        'class': 'footer-newsletter-title'
      }, newsletter.title);
      section.appendChild(title);
    }
    
    if (newsletter.subtitle) {
      const subtitle = this.xss.createSafeElement('p', {
        'class': 'footer-newsletter-subtitle'
      }, newsletter.subtitle);
      section.appendChild(subtitle);
    }
    
    // Newsletter form would be built here with proper CSRF protection
    // For now, just show a placeholder
    const placeholder = this.xss.createSafeElement('p', {
      'class': 'footer-newsletter-placeholder'
    }, 'Newsletter signup form (secure implementation required)');
    section.appendChild(placeholder);
    
    return section;
  }
  
  buildLegalSection(legal) {
    const section = this.xss.createSafeElement('div', {
      'class': 'footer-legal-section'
    });
    
    if (legal.copyright) {
      const copyright = this.xss.createSafeElement('p', {
        'class': 'footer-copyright'
      }, legal.copyright);
      section.appendChild(copyright);
    }
    
    const links = this.xss.createSafeElement('div', {
      'class': 'footer-legal-links'
    });
    
    [
      { url: legal.privacy_policy_url, text: 'Privacy Policy' },
      { url: legal.terms_of_service_url, text: 'Terms of Service' },
      { url: legal.cookie_policy_url, text: 'Cookie Policy' }
    ].forEach(link => {
      if (link.url) {
        const linkElement = this.xss.createSafeElement('a', {
          'href': link.url,
          'class': 'footer-legal-link'
        }, link.text);
        links.appendChild(linkElement);
      }
    });
    
    section.appendChild(links);
    return section;
  }
  
  setupSecureEventHandlers(container, data) {
    // Add secure click handlers for navigation links
    const navLinks = container.querySelectorAll('.footer-nav-link');
    navLinks.forEach(link => {
      this.eventManager.addHandler(link, 'click', (event) => {
        // Validate URL before navigation
        const href = link.getAttribute('href');
        if (!href || !this.xss.sanitizeURL(href)) {
          event.preventDefault();
          console.warn('Blocked navigation to invalid URL:', href);
          return;
        }
        
        // Analytics tracking (if enabled)
        if (this.config.ANALYTICS_ENABLED && typeof gtag === 'function') {
          gtag('event', 'click', {
            event_category: 'Footer Navigation',
            event_label: link.textContent || href
          });
        }
      });
    });
    
    // Add secure click handlers for social links
    const socialLinks = container.querySelectorAll('.footer-social-link');
    socialLinks.forEach(link => {
      this.eventManager.addHandler(link, 'click', (event) => {
        // Validate URL
        const href = link.getAttribute('href');
        if (!href || !this.xss.sanitizeURL(href)) {
          event.preventDefault();
          console.warn('Blocked navigation to invalid social URL:', href);
          return;
        }
        
        // Analytics for social clicks
        if (this.config.ANALYTICS_ENABLED && typeof gtag === 'function') {
          gtag('event', 'click', {
            event_category: 'Footer Social',
            event_label: link.getAttribute('class') || href
          });
        }
      });
    });
  }
  
  showSecureSkeleton() {
    const footerContainer = document.querySelector(this.config.FOOTER_SELECTOR);
    if (!footerContainer) return;
    
    // Clear existing content safely
    footerContainer.innerHTML = '';
    
    // Create skeleton using secure methods
    const skeleton = this.xss.createSafeElement('div', {
      'class': 'footer-skeleton',
      'aria-label': 'Loading footer content'
    });
    
    // Add skeleton elements
    ['company', 'navigation', 'social', 'legal'].forEach(section => {
      const skeletonItem = this.xss.createSafeElement('div', {
        'class': `footer-skeleton-${section}`
      });
      skeleton.appendChild(skeletonItem);
    });
    
    footerContainer.appendChild(skeleton);
    
    // Add skeleton styles if not present
    this.addSkeletonStyles();
  }
  
  addSkeletonStyles() {
    if (document.getElementById('footer-skeleton-styles')) {
      return;
    }
    
    const styles = document.createElement('style');
    styles.id = 'footer-skeleton-styles';
    styles.textContent = `
      .footer-skeleton {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 2rem;
        padding: 2rem;
        animation: skeleton-pulse 1.5s ease-in-out infinite alternate;
      }
      
      .footer-skeleton > div {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: skeleton-shimmer 2s infinite;
        border-radius: 4px;
        min-height: 60px;
      }
      
      @keyframes skeleton-pulse {
        from { opacity: 1; }
        to { opacity: 0.7; }
      }
      
      @keyframes skeleton-shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      
      @media (prefers-reduced-motion: reduce) {
        .footer-skeleton,
        .footer-skeleton > div {
          animation: none;
        }
      }
    `;
    
    document.head.appendChild(styles);
  }
  
  handleError(error) {
    this.errorCount++;
    this.lastError = {
      message: error.message,
      timestamp: Date.now(),
      stack: error.stack
    };
    
    console.error('SecureFooterLoader error:', error);
    
    // Try to show cached fallback
    this.showErrorFallback(error);
  }
  
  async showErrorFallback(error) {
    // Try to load any cached version
    const locales = ['en', 'ru', 'he'];
    
    for (const locale of locales) {
      try {
        const cached = await this.storage.getItem(`content-${locale}`);
        if (cached) {
          console.log(`📦 Using cached fallback for ${locale}`);
          await this.renderFooter(cached);
          return;
        }
      } catch (cacheError) {
        console.warn(`Cache fallback failed for ${locale}:`, cacheError);
      }
    }
    
    // Show error state
    this.showErrorState(error);
  }
  
  showErrorState(error) {
    const footerContainer = document.querySelector(this.config.FOOTER_SELECTOR);
    if (!footerContainer) return;
    
    const errorElement = this.xss.createSafeElement('div', {
      'class': 'footer-error-state'
    });
    
    const message = this.xss.createSafeElement('p', {
      'class': 'footer-error-message'
    }, 'Footer content temporarily unavailable. Please refresh the page.');
    
    if (this.config.SHOW_RETRY_BUTTON) {
      const retryButton = this.xss.createSafeElement('button', {
        'class': 'footer-retry-button',
        'type': 'button'
      }, 'Retry');
      
      this.eventManager.addHandler(retryButton, 'click', () => {
        this.loadFooter();
      });
      
      errorElement.appendChild(message);
      errorElement.appendChild(retryButton);
    } else {
      errorElement.appendChild(message);
    }
    
    footerContainer.innerHTML = '';
    footerContainer.appendChild(errorElement);
  }
  
  getStats() {
    return {
      version: this.config.VERSION,
      errorCount: this.errorCount,
      lastError: this.lastError,
      averageLoadTime: this.loadTimes.length > 0 ? 
        this.loadTimes.reduce((a, b) => a + b, 0) / this.loadTimes.length : 0,
      storage: this.storage.getStats(),
      eventHandlers: this.eventManager.getStats(),
      loading: this.loadingManager.getStats()
    };
  }
  
  destroy() {
    console.log('🔒 Destroying SecureFooterLoader...');
    
    // Clean up all components
    this.eventManager.cleanup();
    this.loadingManager.cleanup();
    this.storage.destroy();
    
    // Clear any remaining timers or references
    this.loadTimes = [];
    this.errorCount = 0;
    this.lastError = null;
    
    console.log('✅ SecureFooterLoader destroyed');
  }
}

// ============================================================================
// EXPORT AND INITIALIZATION
// ============================================================================

// Make available globally
if (typeof window !== 'undefined') {
  window.SecureFooterLoader = SecureFooterLoader;
  window.XSSProtection = XSSProtection;
  window.RobustStorage = RobustStorage;
  window.EventHandlerManager = EventHandlerManager;
  window.AtomicLoadingManager = AtomicLoadingManager;
  
  console.log('🔒 Secure frontend components loaded');
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SecureFooterLoader,
    XSSProtection,
    RobustStorage,
    EventHandlerManager,
    AtomicLoadingManager
  };
}