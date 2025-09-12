/**
 * FRONTEND SECURITY FIXES AND IMPROVEMENTS
 * 
 * Fixes: XSS vulnerabilities, localStorage failures, memory leaks, race conditions
 * Enhanced footer loader with security and reliability improvements
 */

// HTML Sanitization for frontend (lightweight version)
class FrontendSanitizer {
  static escapeHTML(str) {
    if (!str || typeof str !== 'string') {
      return '';
    }
    
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
  
  static sanitizeHTML(str) {
    if (!str || typeof str !== 'string') {
      return '';
    }
    
    // Create a temporary div to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = str;
    
    // Remove script tags and event handlers
    const scripts = tempDiv.querySelectorAll('script');
    scripts.forEach(script => script.remove());
    
    // Remove dangerous attributes
    const dangerousAttrs = ['onclick', 'onerror', 'onload', 'onmouseover', 'onfocus', 'onblur'];
    const allElements = tempDiv.querySelectorAll('*');
    
    allElements.forEach(el => {
      dangerousAttrs.forEach(attr => {
        if (el.hasAttribute(attr)) {
          el.removeAttribute(attr);
        }
      });
      
      // Sanitize href attributes
      if (el.hasAttribute('href')) {
        const href = el.getAttribute('href');
        if (href && !href.match(/^(https?:\/\/|\/|#)/)) {
          el.removeAttribute('href');
        }
      }
    });
    
    return tempDiv.innerHTML;
  }
}

// Enhanced Cache Manager with fallback mechanisms
class SecureCache {
  constructor(prefix, ttl = 3600000) {
    this.prefix = prefix;
    this.ttl = ttl;
    this.memoryCache = new Map();
    this.isLocalStorageAvailable = this.testLocalStorage();
    
    // Set up memory cache cleanup
    this.setupMemoryCacheCleanup();
  }
  
  testLocalStorage() {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, 'test');
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      console.warn('localStorage not available, using memory cache fallback');
      return false;
    }
  }
  
  setupMemoryCacheCleanup() {
    setInterval(() => {
      const now = Date.now();
      let cleaned = 0;
      
      for (const [key, value] of this.memoryCache.entries()) {
        if (now - value.timestamp > this.ttl) {
          this.memoryCache.delete(key);
          cleaned++;
        }
      }
      
      if (cleaned > 0) {
        console.log(`🧹 Cleaned ${cleaned} expired cache entries from memory`);
      }
    }, 300000); // Clean every 5 minutes
  }
  
  set(key, data, version = 1) {
    const cacheData = {
      data,
      timestamp: Date.now(),
      version
    };
    
    const cacheKey = this.prefix + key;
    
    // Try localStorage first
    if (this.isLocalStorageAvailable) {
      try {
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
        return;
      } catch (error) {
        console.warn('localStorage.setItem failed:', error);
        this.isLocalStorageAvailable = false;
      }
    }
    
    // Fallback to memory cache
    this.memoryCache.set(key, cacheData);
  }
  
  get(key, currentVersion = 1) {
    const cacheKey = this.prefix + key;
    
    // Try localStorage first
    if (this.isLocalStorageAvailable) {
      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          
          if (this.isValidCache(parsed, currentVersion)) {
            return parsed.data;
          }
          
          // Clean expired/invalid cache
          localStorage.removeItem(cacheKey);
        }
      } catch (error) {
        console.warn('localStorage.getItem failed:', error);
        this.isLocalStorageAvailable = false;
      }
    }
    
    // Try memory cache
    const cached = this.memoryCache.get(key);
    if (cached && this.isValidCache(cached, currentVersion)) {
      return cached.data;
    }
    
    // Clean expired memory cache
    if (cached) {
      this.memoryCache.delete(key);
    }
    
    return null;
  }
  
  isValidCache(cached, currentVersion) {
    if (!cached || !cached.timestamp) {
      return false;
    }
    
    const isExpired = Date.now() - cached.timestamp > this.ttl;
    const isVersionMismatch = cached.version !== currentVersion;
    
    return !isExpired && !isVersionMismatch;
  }
  
  clear() {
    // Clear localStorage entries
    if (this.isLocalStorageAvailable) {
      try {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(this.prefix)) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
      } catch (error) {
        console.warn('localStorage clear failed:', error);
      }
    }
    
    // Clear memory cache
    this.memoryCache.clear();
  }
}

// Event Handler Manager to prevent memory leaks
class EventHandlerManager {
  constructor() {
    this.handlers = new Map();
  }
  
  addHandler(element, eventType, handler, options = {}) {
    const key = this.getElementKey(element);
    
    if (!this.handlers.has(key)) {
      this.handlers.set(key, []);
    }
    
    const handlerInfo = {
      element,
      eventType,
      handler,
      options
    };
    
    this.handlers.get(key).push(handlerInfo);
    element.addEventListener(eventType, handler, options);
    
    return handlerInfo;
  }
  
  removeHandlers(element) {
    const key = this.getElementKey(element);
    const handlers = this.handlers.get(key);
    
    if (handlers) {
      handlers.forEach(({ element, eventType, handler, options }) => {
        element.removeEventListener(eventType, handler, options);
      });
      
      this.handlers.delete(key);
    }
  }
  
  removeAllHandlers() {
    for (const handlers of this.handlers.values()) {
      handlers.forEach(({ element, eventType, handler, options }) => {
        element.removeEventListener(eventType, handler, options);
      });
    }
    
    this.handlers.clear();
  }
  
  getElementKey(element) {
    // Create a unique key for the element
    if (!element._handlerKey) {
      element._handlerKey = 'elem_' + Math.random().toString(36).substr(2, 9);
    }
    return element._handlerKey;
  }
}

// Atomic Loading Manager to prevent race conditions
class AtomicLoader {
  constructor() {
    this.loadingStates = new Map();
  }
  
  async executeWithLock(key, asyncFunction) {
    if (this.loadingStates.has(key)) {
      // Already loading, wait for completion
      return this.loadingStates.get(key);
    }
    
    const promise = this.executeFunction(key, asyncFunction);
    this.loadingStates.set(key, promise);
    
    try {
      const result = await promise;
      this.loadingStates.delete(key);
      return result;
    } catch (error) {
      this.loadingStates.delete(key);
      throw error;
    }
  }
  
  async executeFunction(key, asyncFunction) {
    try {
      return await asyncFunction();
    } catch (error) {
      console.error(`Atomic loader error for key ${key}:`, error);
      throw error;
    }
  }
  
  isLoading(key) {
    return this.loadingStates.has(key);
  }
  
  clearLock(key) {
    this.loadingStates.delete(key);
  }
}

// Enhanced Footer Loader with all security fixes
class SecureFooterLoader {
  constructor(config = {}) {
    this.config = {
      API_BASE_URL: config.API_BASE_URL || '',
      FOOTER_SELECTOR: config.FOOTER_SELECTOR || '.footer-dynamic',
      CACHE_TTL: config.CACHE_TTL || 3600000,
      VERSION: config.VERSION || 1,
      RETRY_COUNT: config.RETRY_COUNT || 3,
      RETRY_DELAY: config.RETRY_DELAY || 1000,
      ...config
    };
    
    // Initialize secure components
    this.cache = new SecureCache('footer:', this.config.CACHE_TTL);
    this.eventManager = new EventHandlerManager();
    this.atomicLoader = new AtomicLoader();
    this.sanitizer = FrontendSanitizer;
    
    // Bind methods to preserve context
    this.loadFooter = this.loadFooter.bind(this);
    this.handleError = this.handleError.bind(this);
  }
  
  async loadFooter(locale = 'en', options = {}) {
    const loadKey = `footer-${locale}`;
    
    return this.atomicLoader.executeWithLock(loadKey, async () => {
      try {
        console.log(`🦶 Loading footer (locale: ${locale})`);
        
        // Try cache first
        const cached = this.cache.get(locale, this.config.VERSION);
        if (cached && !options.skipCache) {
          console.log('📦 Using cached footer data');
          this.renderFooter(cached);
          return;
        }
        
        // Show skeleton while loading
        this.showSkeleton();
        
        // Fetch fresh data with retry logic
        const data = await this.fetchWithRetry(`${this.config.API_BASE_URL}/api/footer-content`, {
          locale,
          ...options
        });
        
        // Cache the data
        if (!options.preview) {
          this.cache.set(locale, data, this.config.VERSION);
        }
        
        // Render footer
        this.renderFooter(data);
        console.log('✅ Footer loaded successfully');
        
      } catch (error) {
        console.error('❌ Footer loading failed:', error);
        this.handleError(error);
      }
    });
  }
  
  async fetchWithRetry(url, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;
    
    for (let attempt = 1; attempt <= this.config.RETRY_COUNT; attempt++) {
      try {
        const response = await fetch(fullUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'same-origin'
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
        
      } catch (error) {
        console.warn(`Fetch attempt ${attempt} failed:`, error);
        
        if (attempt === this.config.RETRY_COUNT) {
          throw error;
        }
        
        // Wait before retry with exponential backoff
        await new Promise(resolve => 
          setTimeout(resolve, this.config.RETRY_DELAY * Math.pow(2, attempt - 1))
        );
      }
    }
  }
  
  renderFooter(data) {
    const footerContainer = document.querySelector(this.config.FOOTER_SELECTOR);
    if (!footerContainer) {
      console.warn('Footer container not found');
      return;
    }
    
    // Clear existing content and event handlers
    this.cleanup();
    
    // Generate secure HTML
    const footerHTML = this.generateFooterHTML(data);
    footerContainer.innerHTML = footerHTML;
    
    // Setup event handlers
    this.setupEventHandlers(footerContainer);
  }
  
  generateFooterHTML(data) {
    // All HTML content is sanitized to prevent XSS
    const companyName = this.sanitizer.escapeHTML(data.company?.name || '');
    const companyDescription = this.sanitizer.sanitizeHTML(data.company?.description || '');
    const copyrightText = this.sanitizer.escapeHTML(data.legal?.copyright || '');
    
    return `
      <div class="footer-content">
        <div class="footer-company">
          <h3>${companyName}</h3>
          <p>${companyDescription}</p>
        </div>
        <div class="footer-copyright">
          <p>${copyrightText}</p>
        </div>
      </div>
    `;
  }
  
  setupEventHandlers(container) {
    const links = container.querySelectorAll('a[href]');
    
    links.forEach(link => {
      const clickHandler = (e) => {
        // Validate URL before navigation
        const href = link.getAttribute('href');
        if (href && !this.isValidURL(href)) {
          e.preventDefault();
          console.warn('Invalid URL blocked:', href);
        }
        
        // Analytics tracking (if enabled)
        if (this.config.ANALYTICS_ENABLED && window.gtag) {
          window.gtag('event', 'click', {
            event_category: 'Footer',
            event_label: link.textContent || href
          });
        }
      };
      
      this.eventManager.addHandler(link, 'click', clickHandler);
    });
  }
  
  isValidURL(url) {
    // Basic URL validation
    if (!url || typeof url !== 'string') {
      return false;
    }
    
    // Allow relative URLs and safe protocols
    return url.match(/^(https?:\/\/|\/|#|mailto:)/i);
  }
  
  showSkeleton() {
    const footerContainer = document.querySelector(this.config.FOOTER_SELECTOR);
    if (!footerContainer) return;
    
    footerContainer.innerHTML = `
      <div class="footer-skeleton">
        <div class="skeleton-item skeleton-company"></div>
        <div class="skeleton-item skeleton-nav"></div>
        <div class="skeleton-item skeleton-social"></div>
      </div>
    `;
    
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
        display: flex;
        gap: 2rem;
        padding: 2rem;
        animate: skeleton-pulse 1.5s ease-in-out infinite;
      }
      
      .skeleton-item {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: skeleton-loading 1.5s infinite;
        border-radius: 4px;
      }
      
      .skeleton-company { width: 200px; height: 80px; }
      .skeleton-nav { width: 300px; height: 60px; }
      .skeleton-social { width: 150px; height: 40px; }
      
      @keyframes skeleton-loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `;
    
    document.head.appendChild(styles);
  }
  
  handleError(error) {
    console.error('Footer error:', error);
    
    // Try to show cached fallback
    const cachedData = this.cache.get('en', this.config.VERSION);
    if (cachedData) {
      console.log('📦 Falling back to cached data');
      this.renderFooter(cachedData);
      return;
    }
    
    // Show error state
    const footerContainer = document.querySelector(this.config.FOOTER_SELECTOR);
    if (footerContainer) {
      footerContainer.innerHTML = `
        <div class="footer-error">
          <p>Footer temporarily unavailable. Please refresh the page.</p>
        </div>
      `;
    }
  }
  
  cleanup() {
    // Remove all event handlers to prevent memory leaks
    this.eventManager.removeAllHandlers();
    
    // Clear any existing intervals or timeouts
    if (this.retryTimeout) {
      clearTimeout(this.retryTimeout);
      this.retryTimeout = null;
    }
  }
  
  destroy() {
    this.cleanup();
    this.cache.clear();
    this.atomicLoader = null;
  }
}

// Export for use in footer loader
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SecureFooterLoader,
    FrontendSanitizer,
    SecureCache,
    EventHandlerManager,
    AtomicLoader
  };
} else if (typeof window !== 'undefined') {
  window.SecureFooterLoader = SecureFooterLoader;
  window.FrontendSanitizer = FrontendSanitizer;
}