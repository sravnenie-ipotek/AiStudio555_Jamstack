/**
 * SECURE ADMIN PANEL FIXES
 * 
 * Fixes: XSS vulnerabilities, CSRF attacks, race conditions in admin panel
 * Enhanced admin panel with comprehensive security measures
 */

// CSRF Token Manager
class CSRFManager {
  constructor() {
    this.token = null;
    this.refreshInterval = null;
  }
  
  async initialize() {
    await this.refreshToken();
    
    // Auto-refresh token every 30 minutes
    this.refreshInterval = setInterval(() => {
      this.refreshToken();
    }, 30 * 60 * 1000);
  }
  
  async refreshToken() {
    try {
      const response = await fetch('/api/csrf-token', {
        method: 'GET',
        credentials: 'same-origin'
      });
      
      if (response.ok) {
        const data = await response.json();
        this.token = data.token;
        console.log('🔒 CSRF token refreshed');
      }
    } catch (error) {
      console.error('Failed to refresh CSRF token:', error);
    }
  }
  
  getToken() {
    return this.token;
  }
  
  addToHeaders(headers = {}) {
    if (this.token) {
      headers['X-CSRF-Token'] = this.token;
    }
    return headers;
  }
  
  destroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
    this.token = null;
  }
}

// Secure HTML Builder (prevents XSS)
class SecureHTMLBuilder {
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
    
    // Create temporary element for parsing
    const temp = document.createElement('div');
    temp.innerHTML = str;
    
    // Remove dangerous elements and attributes
    const dangerousElements = temp.querySelectorAll('script, iframe, object, embed, form');
    dangerousElements.forEach(el => el.remove());
    
    const dangerousAttrs = ['onclick', 'onerror', 'onload', 'onmouseover', 'onfocus', 'onblur', 'onkeydown'];
    const allElements = temp.querySelectorAll('*');
    
    allElements.forEach(el => {
      dangerousAttrs.forEach(attr => {
        if (el.hasAttribute(attr)) {
          el.removeAttribute(attr);
        }
      });
    });
    
    return temp.innerHTML;
  }
  
  static buildMenuHTML(menu) {
    const menuTitle = this.escapeHTML(menu.title || menu.menu_type);
    const menuId = `menu-${this.escapeHTML(menu.menu_type)}`;
    
    return `
      <div class="menu-section" data-menu-type="${this.escapeHTML(menu.menu_type)}">
        <div class="menu-header">
          <h4>${menuTitle}</h4>
          <button type="button" class="btn-toggle" data-target="${menuId}">Toggle</button>
        </div>
        <div id="${menuId}" class="menu-items">
          ${this.buildMenuItemsHTML(menu.items || [])}
        </div>
        <button type="button" class="btn-add-item" data-menu-type="${this.escapeHTML(menu.menu_type)}">
          Add Item
        </button>
      </div>
    `;
  }
  
  static buildMenuItemsHTML(items) {
    if (!Array.isArray(items)) return '';
    
    return items.map((item, index) => `
      <div class="menu-item" data-index="${index}">
        <div class="menu-item-controls">
          <input type="text" class="item-text" value="${this.escapeHTML(item.text || '')}" placeholder="Link text" />
          <input type="url" class="item-url" value="${this.escapeHTML(item.url || '')}" placeholder="URL" />
          <select class="item-target">
            <option value="_self" ${item.target === '_self' ? 'selected' : ''}>Same window</option>
            <option value="_blank" ${item.target === '_blank' ? 'selected' : ''}>New window</option>
          </select>
          <input type="number" class="item-order" value="${parseInt(item.order) || 0}" min="0" max="100" />
          <label>
            <input type="checkbox" class="item-visible" ${item.visible !== false ? 'checked' : ''} />
            Visible
          </label>
          <button type="button" class="btn-remove-item" data-index="${index}">Remove</button>
        </div>
      </div>
    `).join('');
  }
  
  static buildSocialLinkHTML(social, index) {
    return `
      <div class="social-item" data-index="${index}">
        <div class="social-controls">
          <select class="social-platform">
            <option value="facebook" ${social.platform === 'facebook' ? 'selected' : ''}>Facebook</option>
            <option value="twitter" ${social.platform === 'twitter' ? 'selected' : ''}>Twitter</option>
            <option value="linkedin" ${social.platform === 'linkedin' ? 'selected' : ''}>LinkedIn</option>
            <option value="instagram" ${social.platform === 'instagram' ? 'selected' : ''}>Instagram</option>
            <option value="youtube" ${social.platform === 'youtube' ? 'selected' : ''}>YouTube</option>
          </select>
          <input type="url" class="social-url" value="${this.escapeHTML(social.url || '')}" placeholder="URL" />
          <input type="text" class="social-icon" value="${this.escapeHTML(social.icon || '')}" placeholder="Icon class" />
          <input type="text" class="social-text" value="${this.escapeHTML(social.text || '')}" placeholder="Display text" />
          <input type="number" class="social-order" value="${parseInt(social.order) || 0}" min="0" max="100" />
          <label>
            <input type="checkbox" class="social-visible" ${social.visible !== false ? 'checked' : ''} />
            Visible
          </label>
          <button type="button" class="btn-remove-social" data-index="${index}">Remove</button>
        </div>
      </div>
    `;
  }
}

// Auto-save Manager with conflict resolution
class AutoSaveManager {
  constructor(saveCallback, options = {}) {
    this.saveCallback = saveCallback;
    this.options = {
      delay: options.delay || 2000,
      maxRetries: options.maxRetries || 3,
      conflictResolution: options.conflictResolution || 'user_wins'
    };
    
    this.saveTimeout = null;
    this.isSaving = false;
    this.pendingSave = false;
    this.lastSavedData = null;
    this.saveVersion = 0;
  }
  
  scheduleSave(data) {
    // Clear existing timeout
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    
    // If currently saving, mark as pending
    if (this.isSaving) {
      this.pendingSave = true;
      return;
    }
    
    // Schedule new save
    this.saveTimeout = setTimeout(async () => {
      await this.executeSave(data);
    }, this.options.delay);
  }
  
  async executeSave(data) {
    if (this.isSaving) return;
    
    this.isSaving = true;
    this.pendingSave = false;
    
    try {
      console.log('💾 Auto-saving data...');
      
      const saveResult = await this.saveCallback(data, {
        version: this.saveVersion++,
        autoSave: true
      });
      
      if (saveResult.success) {
        this.lastSavedData = data;
        console.log('✅ Auto-save completed');
        
        // Show success indicator
        this.showSaveIndicator('success');
      } else {
        throw new Error(saveResult.message || 'Save failed');
      }
      
    } catch (error) {
      console.error('❌ Auto-save failed:', error);
      this.showSaveIndicator('error');
      
      // Handle conflicts
      if (error.message.includes('conflict') || error.message.includes('version')) {
        await this.handleSaveConflict(data, error);
      }
      
    } finally {
      this.isSaving = false;
      
      // Process pending save if any
      if (this.pendingSave) {
        this.scheduleSave(data);
      }
    }
  }
  
  async handleSaveConflict(localData, error) {
    console.warn('⚠️ Save conflict detected, resolving...');
    
    try {
      // Fetch latest server data
      const response = await fetch('/api/footer-content?locale=' + encodeURIComponent(localData.locale));
      const serverData = await response.json();
      
      if (this.options.conflictResolution === 'user_wins') {
        // User's local changes take precedence
        console.log('🔄 Retrying save with user data precedence');
        await this.saveCallback(localData, { forceOverwrite: true });
        
      } else if (this.options.conflictResolution === 'server_wins') {
        // Server data takes precedence, reload form
        console.log('🔄 Loading server data to resolve conflict');
        window.footerAdmin.loadFormData(serverData);
        
      } else {
        // Show conflict resolution UI
        this.showConflictDialog(localData, serverData);
      }
      
    } catch (conflictError) {
      console.error('❌ Conflict resolution failed:', conflictError);
      this.showSaveIndicator('conflict');
    }
  }
  
  showSaveIndicator(status) {
    const indicator = document.querySelector('.save-indicator') || this.createSaveIndicator();
    
    indicator.className = `save-indicator ${status}`;
    indicator.textContent = {
      success: '✅ Saved',
      error: '❌ Save failed',
      saving: '💾 Saving...',
      conflict: '⚠️ Conflict'
    }[status] || status;
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      if (indicator.className.includes(status)) {
        indicator.style.opacity = '0';
      }
    }, 3000);
  }
  
  createSaveIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'save-indicator';
    indicator.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 10px 15px;
      border-radius: 4px;
      font-weight: bold;
      z-index: 1000;
      transition: opacity 0.3s ease;
    `;
    document.body.appendChild(indicator);
    return indicator;
  }
  
  showConflictDialog(localData, serverData) {
    const dialog = document.createElement('div');
    dialog.className = 'conflict-dialog';
    dialog.innerHTML = `
      <div class="dialog-overlay"></div>
      <div class="dialog-content">
        <h3>Save Conflict Detected</h3>
        <p>The footer content has been modified by another user. How would you like to proceed?</p>
        <div class="dialog-buttons">
          <button type="button" class="btn-use-local">Keep My Changes</button>
          <button type="button" class="btn-use-server">Use Server Version</button>
          <button type="button" class="btn-merge">Show Differences</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(dialog);
    
    // Handle dialog actions
    dialog.querySelector('.btn-use-local').onclick = async () => {
      await this.saveCallback(localData, { forceOverwrite: true });
      document.body.removeChild(dialog);
    };
    
    dialog.querySelector('.btn-use-server').onclick = () => {
      window.footerAdmin.loadFormData(serverData);
      document.body.removeChild(dialog);
    };
    
    dialog.querySelector('.btn-merge').onclick = () => {
      this.showMergeInterface(localData, serverData);
      document.body.removeChild(dialog);
    };
  }
  
  destroy() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
      this.saveTimeout = null;
    }
    this.isSaving = false;
    this.pendingSave = false;
  }
}

// Secure API Client
class SecureAPIClient {
  constructor(csrfManager) {
    this.csrf = csrfManager;
    this.requestQueue = new Map();
  }
  
  async secureRequest(url, options = {}) {
    const requestId = `${options.method || 'GET'}-${url}-${Date.now()}`;
    
    // Prevent duplicate requests
    if (this.requestQueue.has(requestId)) {
      return this.requestQueue.get(requestId);
    }
    
    const requestPromise = this.executeRequest(url, options);
    this.requestQueue.set(requestId, requestPromise);
    
    try {
      const result = await requestPromise;
      return result;
    } finally {
      this.requestQueue.delete(requestId);
    }
  }
  
  async executeRequest(url, options = {}) {
    const {
      method = 'GET',
      body,
      headers = {},
      credentials = 'same-origin',
      timeout = 30000,
      ...otherOptions
    } = options;
    
    // Add CSRF token for state-changing requests
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase())) {
      this.csrf.addToHeaders(headers);
    }
    
    // Set default headers
    if (body && typeof body === 'object') {
      headers['Content-Type'] = 'application/json';
    }
    
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        method,
        headers,
        body: typeof body === 'object' ? JSON.stringify(body) : body,
        credentials,
        signal: controller.signal,
        ...otherOptions
      });
      
      clearTimeout(timeoutId);
      
      // Handle HTTP errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      // Parse response
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
      
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      
      throw error;
    }
  }
  
  async get(url, options = {}) {
    return this.secureRequest(url, { ...options, method: 'GET' });
  }
  
  async post(url, body, options = {}) {
    return this.secureRequest(url, { ...options, method: 'POST', body });
  }
  
  async put(url, body, options = {}) {
    return this.secureRequest(url, { ...options, method: 'PUT', body });
  }
  
  async delete(url, options = {}) {
    return this.secureRequest(url, { ...options, method: 'DELETE' });
  }
}

// Enhanced Footer Admin with all security fixes
class SecureFooterAdmin {
  constructor() {
    this.csrf = new CSRFManager();
    this.api = new SecureAPIClient(this.csrf);
    this.htmlBuilder = SecureHTMLBuilder;
    this.autoSave = null;
    this.currentLocale = 'en';
    this.formData = {};
    this.isLoading = false;
    
    // Bind methods
    this.init = this.init.bind(this);
    this.saveData = this.saveData.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
  }
  
  async init() {
    try {
      console.log('🔧 Initializing secure footer admin...');
      
      // Initialize CSRF protection
      await this.csrf.initialize();
      
      // Set up auto-save
      this.autoSave = new AutoSaveManager(this.saveData, {
        delay: 3000, // 3 second delay
        conflictResolution: 'user_wins'
      });
      
      // Load initial data
      await this.loadFooterData('en');
      
      // Set up event listeners
      this.setupEventListeners();
      
      // Initialize UI components
      this.initializeUI();
      
      console.log('✅ Secure footer admin initialized');
      
    } catch (error) {
      console.error('❌ Admin initialization failed:', error);
      this.showError('Failed to initialize admin panel: ' + error.message);
    }
  }
  
  async loadFooterData(locale) {
    if (this.isLoading) return;
    
    this.isLoading = true;
    this.showLoading('Loading footer data...');
    
    try {
      const data = await this.api.get(`/api/footer-content?locale=${encodeURIComponent(locale)}&preview=true`);
      
      this.formData = data;
      this.currentLocale = locale;
      
      this.populateForm(data);
      console.log(`📦 Loaded footer data for ${locale}`);
      
    } catch (error) {
      console.error(`❌ Failed to load data for ${locale}:`, error);
      this.showError(`Failed to load footer data: ${error.message}`);
      
    } finally {
      this.isLoading = false;
      this.hideLoading();
    }
  }
  
  populateForm(data) {
    // Company information
    this.setFieldValue('company-name', data.company?.name);
    this.setFieldValue('company-description', data.company?.description);
    this.setFieldValue('company-logo', data.company?.logo_url);
    
    // Contact information
    this.setFieldValue('contact-email', data.contact?.email);
    this.setFieldValue('support-email', data.contact?.support_email);
    this.setFieldValue('sales-email', data.contact?.sales_email);
    
    // Newsletter settings
    this.setCheckboxValue('newsletter-enabled', data.newsletter?.enabled);
    this.setFieldValue('newsletter-title', data.newsletter?.title);
    this.setFieldValue('newsletter-subtitle', data.newsletter?.subtitle);
    
    // Navigation menus
    this.populateNavigationMenus(data.navigation);
    
    // Social links
    this.populateSocialLinks(data.social);
    
    // Legal information
    this.setFieldValue('copyright-text', data.legal?.copyright);
    this.setFieldValue('privacy-policy-url', data.legal?.privacy_policy_url);
    this.setFieldValue('terms-url', data.legal?.terms_of_service_url);
  }
  
  populateNavigationMenus(navigation) {
    const container = document.getElementById('navigation-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    Object.entries(navigation || {}).forEach(([menuType, menu]) => {
      const menuHTML = this.htmlBuilder.buildMenuHTML({
        menu_type: menuType,
        title: menu.title,
        items: menu.items
      });
      
      container.insertAdjacentHTML('beforeend', menuHTML);
    });
  }
  
  populateSocialLinks(social) {
    const container = document.getElementById('social-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    Object.entries(social || {}).forEach(([platform, link], index) => {
      const linkHTML = this.htmlBuilder.buildSocialLinkHTML({
        platform,
        ...link
      }, index);
      
      container.insertAdjacentHTML('beforeend', linkHTML);
    });
  }
  
  setupEventListeners() {
    // Form change handlers with debouncing
    const form = document.getElementById('footer-admin-form');
    if (form) {
      form.addEventListener('input', this.debounce(this.handleFormChange, 1000));
      form.addEventListener('change', this.handleFormChange);
    }
    
    // Save button
    const saveBtn = document.getElementById('save-footer');
    if (saveBtn) {
      saveBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        await this.saveData(this.collectFormData(), { manual: true });
      });
    }
    
    // Locale selector
    const localeSelect = document.getElementById('locale-select');
    if (localeSelect) {
      localeSelect.addEventListener('change', async (e) => {
        await this.loadFooterData(e.target.value);
      });
    }
    
    // Add menu item buttons
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-add-item')) {
        this.addMenuItem(e.target.dataset.menuType);
      } else if (e.target.classList.contains('btn-remove-item')) {
        this.removeMenuItem(e.target);
      } else if (e.target.classList.contains('btn-add-social')) {
        this.addSocialLink();
      } else if (e.target.classList.contains('btn-remove-social')) {
        this.removeSocialLink(e.target);
      }
    });
    
    // Preview button
    const previewBtn = document.getElementById('preview-footer');
    if (previewBtn) {
      previewBtn.addEventListener('click', () => {
        this.openPreview();
      });
    }
  }
  
  handleFormChange(e) {
    const formData = this.collectFormData();
    
    // Schedule auto-save
    this.autoSave.scheduleSave(formData);
    
    // Mark form as dirty
    this.markFormDirty(true);
  }
  
  collectFormData() {
    return {
      locale: this.currentLocale,
      company_name: this.getFieldValue('company-name'),
      company_description: this.getFieldValue('company-description'),
      company_logo_url: this.getFieldValue('company-logo'),
      contact_email: this.getFieldValue('contact-email'),
      support_email: this.getFieldValue('support-email'),
      sales_email: this.getFieldValue('sales-email'),
      newsletter_enabled: this.getCheckboxValue('newsletter-enabled'),
      newsletter_title: this.getFieldValue('newsletter-title'),
      newsletter_subtitle: this.getFieldValue('newsletter-subtitle'),
      copyright_text: this.getFieldValue('copyright-text'),
      privacy_policy_url: this.getFieldValue('privacy-policy-url'),
      terms_of_service_url: this.getFieldValue('terms-url'),
      // Add navigation and social data
      ...this.collectNavigationData(),
      ...this.collectSocialData()
    };
  }
  
  async saveData(data, options = {}) {
    try {
      this.showLoading('Saving footer data...');
      
      const response = await this.api.post('/api/footer-content', data);
      
      if (response.success) {
        console.log('✅ Footer data saved successfully');
        this.markFormDirty(false);
        
        if (options.manual) {
          this.showSuccess('Footer data saved successfully');
        }
        
        return { success: true };
      } else {
        throw new Error(response.message || 'Save failed');
      }
      
    } catch (error) {
      console.error('❌ Save failed:', error);
      
      if (options.manual) {
        this.showError('Save failed: ' + error.message);
      }
      
      throw error;
      
    } finally {
      this.hideLoading();
    }
  }
  
  // Utility methods
  setFieldValue(fieldId, value) {
    const field = document.getElementById(fieldId);
    if (field) {
      field.value = value || '';
    }
  }
  
  getFieldValue(fieldId) {
    const field = document.getElementById(fieldId);
    return field ? field.value.trim() : '';
  }
  
  setCheckboxValue(fieldId, checked) {
    const field = document.getElementById(fieldId);
    if (field && field.type === 'checkbox') {
      field.checked = Boolean(checked);
    }
  }
  
  getCheckboxValue(fieldId) {
    const field = document.getElementById(fieldId);
    return field && field.type === 'checkbox' ? field.checked : false;
  }
  
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  showLoading(message) {
    const indicator = document.querySelector('.loading-indicator') || this.createLoadingIndicator();
    indicator.textContent = message;
    indicator.style.display = 'block';
  }
  
  hideLoading() {
    const indicator = document.querySelector('.loading-indicator');
    if (indicator) {
      indicator.style.display = 'none';
    }
  }
  
  showSuccess(message) {
    this.showNotification(message, 'success');
  }
  
  showError(message) {
    this.showNotification(message, 'error');
  }
  
  showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 4px;
      color: white;
      font-weight: bold;
      z-index: 1001;
      background-color: ${type === 'error' ? '#dc3545' : '#28a745'};
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  }
  
  markFormDirty(dirty) {
    const form = document.getElementById('footer-admin-form');
    if (form) {
      if (dirty) {
        form.classList.add('dirty');
      } else {
        form.classList.remove('dirty');
      }
    }
  }
  
  openPreview() {
    const previewUrl = `/home.html?preview=true&locale=${this.currentLocale}`;
    window.open(previewUrl, '_blank');
  }
  
  destroy() {
    if (this.autoSave) {
      this.autoSave.destroy();
    }
    
    if (this.csrf) {
      this.csrf.destroy();
    }
  }
}

// Initialize when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.footerAdmin = new SecureFooterAdmin();
    window.footerAdmin.init();
  });
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SecureFooterAdmin,
    CSRFManager,
    SecureHTMLBuilder,
    AutoSaveManager,
    SecureAPIClient
  };
}