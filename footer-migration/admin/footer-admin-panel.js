/**
 * FOOTER ADMIN PANEL INTEGRATION
 * 
 * Adds footer management capabilities to the existing content-admin-comprehensive.html
 * This script should be included in the admin panel to enable footer editing.
 * 
 * Features:
 * - Multi-language footer editing
 * - Real-time preview
 * - Social media management
 * - Navigation menu editor
 * - Newsletter configuration
 * - Validation and error handling
 */

(function() {
  'use strict';

  // Configuration
  const FOOTER_ADMIN_CONFIG = {
    API_BASE_URL: window.location.origin,
    SUPPORTED_LOCALES: ['en', 'ru', 'he'],
    LOCALE_NAMES: {
      'en': 'English',
      'ru': 'Русский',
      'he': 'עברית'
    },
    AUTO_SAVE_DELAY: 2000, // 2 seconds
    MAX_RETRIES: 3
  };

  class FooterAdminPanel {
    constructor() {
      this.currentLocale = 'en';
      this.footerData = {};
      this.isDirty = false;
      this.autoSaveTimeout = null;
      this.retryCount = 0;
      
      this.init();
    }

    async init() {
      console.log('🔧 Initializing Footer Admin Panel');
      
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.initializeUI());
      } else {
        this.initializeUI();
      }
    }

    async initializeUI() {
      try {
        // Add footer management section to admin panel
        await this.injectFooterSection();
        
        // Load footer data for all locales
        await this.loadAllFooterData();
        
        // Setup event handlers
        this.setupEventHandlers();
        
        // Initialize form
        this.renderFooterForm();
        
        console.log('✅ Footer Admin Panel initialized successfully');
        
      } catch (error) {
        console.error('❌ Failed to initialize Footer Admin Panel:', error);
        this.showError('Failed to initialize footer admin panel: ' + error.message);
      }
    }

    async injectFooterSection() {
      // Find the admin panel container
      const container = document.querySelector('.admin-container') || 
                       document.querySelector('.content-admin-container') || 
                       document.querySelector('main') || 
                       document.body;

      if (!container) {
        throw new Error('Admin panel container not found');
      }

      // Create footer management section
      const footerSection = document.createElement('div');
      footerSection.className = 'admin-section footer-admin-section';
      footerSection.innerHTML = `
        <div class="section-header">
          <h2 class="section-title">
            <i class="fas fa-shoe-prints"></i>
            Footer Management
          </h2>
          <div class="section-controls">
            <select id="footer-locale-selector" class="locale-selector">
              ${FOOTER_ADMIN_CONFIG.SUPPORTED_LOCALES.map(locale => `
                <option value="${locale}" ${locale === 'en' ? 'selected' : ''}>
                  ${FOOTER_ADMIN_CONFIG.LOCALE_NAMES[locale]} (${locale.toUpperCase()})
                </option>
              `).join('')}
            </select>
            <button id="footer-preview-btn" class="btn btn-secondary" type="button">
              <i class="fas fa-eye"></i> Preview
            </button>
            <button id="footer-save-btn" class="btn btn-primary" type="button">
              <i class="fas fa-save"></i> Save Changes
            </button>
            <button id="footer-reset-btn" class="btn btn-warning" type="button">
              <i class="fas fa-undo"></i> Reset
            </button>
          </div>
        </div>

        <div class="footer-admin-content">
          <div class="loading-overlay" id="footer-loading">
            <div class="spinner"></div>
            <p>Loading footer data...</p>
          </div>

          <div class="footer-form-container" id="footer-form-container" style="display: none;">
            <form id="footer-admin-form">
              <!-- Company Information Tab -->
              <div class="admin-tabs">
                <div class="tab-buttons">
                  <button type="button" class="tab-btn active" data-tab="company">Company Info</button>
                  <button type="button" class="tab-btn" data-tab="navigation">Navigation</button>
                  <button type="button" class="tab-btn" data-tab="social">Social Media</button>
                  <button type="button" class="tab-btn" data-tab="newsletter">Newsletter</button>
                  <button type="button" class="tab-btn" data-tab="legal">Legal & Copyright</button>
                  <button type="button" class="tab-btn" data-tab="settings">Display Settings</button>
                </div>

                <!-- Company Info Tab -->
                <div class="tab-content active" data-tab-content="company">
                  <div class="form-grid">
                    <div class="form-group">
                      <label for="company_name">Company Name</label>
                      <input type="text" id="company_name" name="company_name" class="form-control">
                    </div>
                    <div class="form-group">
                      <label for="company_tagline">Company Tagline</label>
                      <input type="text" id="company_tagline" name="company_tagline" class="form-control">
                    </div>
                    <div class="form-group full-width">
                      <label for="company_description">Company Description</label>
                      <textarea id="company_description" name="company_description" rows="3" class="form-control"></textarea>
                    </div>
                    <div class="form-group">
                      <label for="company_logo_url">Logo URL</label>
                      <input type="url" id="company_logo_url" name="company_logo_url" class="form-control">
                    </div>
                    <div class="form-group">
                      <label for="contact_email">Contact Email</label>
                      <input type="email" id="contact_email" name="contact_email" class="form-control">
                    </div>
                    <div class="form-group">
                      <label for="contact_phone">Contact Phone</label>
                      <input type="tel" id="contact_phone" name="contact_phone" class="form-control">
                    </div>
                    <div class="form-group full-width">
                      <label for="contact_address">Contact Address</label>
                      <textarea id="contact_address" name="contact_address" rows="2" class="form-control"></textarea>
                    </div>
                  </div>
                </div>

                <!-- Navigation Tab -->
                <div class="tab-content" data-tab-content="navigation">
                  <div class="navigation-editor">
                    <div class="form-group">
                      <label>Footer Navigation Menus</label>
                      <div id="navigation-menus-container">
                        <!-- Navigation menus will be loaded here -->
                      </div>
                      <button type="button" class="btn btn-outline-primary" id="add-navigation-menu">
                        <i class="fas fa-plus"></i> Add Menu Section
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Social Media Tab -->
                <div class="tab-content" data-tab-content="social">
                  <div class="social-editor">
                    <div class="form-group">
                      <label>Social Media Links</label>
                      <div id="social-links-container">
                        <!-- Social links will be loaded here -->
                      </div>
                      <button type="button" class="btn btn-outline-primary" id="add-social-link">
                        <i class="fas fa-plus"></i> Add Social Link
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Newsletter Tab -->
                <div class="tab-content" data-tab-content="newsletter">
                  <div class="form-grid">
                    <div class="form-group">
                      <label class="checkbox-label">
                        <input type="checkbox" id="newsletter_enabled" name="newsletter_enabled">
                        Enable Newsletter Subscription
                      </label>
                    </div>
                    <div class="form-group">
                      <label for="newsletter_title">Newsletter Title</label>
                      <input type="text" id="newsletter_title" name="newsletter_title" class="form-control">
                    </div>
                    <div class="form-group full-width">
                      <label for="newsletter_subtitle">Newsletter Subtitle</label>
                      <textarea id="newsletter_subtitle" name="newsletter_subtitle" rows="2" class="form-control"></textarea>
                    </div>
                    <div class="form-group">
                      <label for="newsletter_placeholder">Input Placeholder</label>
                      <input type="text" id="newsletter_placeholder" name="newsletter_placeholder" class="form-control">
                    </div>
                    <div class="form-group">
                      <label for="newsletter_button_text">Button Text</label>
                      <input type="text" id="newsletter_button_text" name="newsletter_button_text" class="form-control">
                    </div>
                    <div class="form-group full-width">
                      <label for="newsletter_success_message">Success Message</label>
                      <textarea id="newsletter_success_message" name="newsletter_success_message" rows="2" class="form-control"></textarea>
                    </div>
                    <div class="form-group full-width">
                      <label for="newsletter_error_message">Error Message</label>
                      <textarea id="newsletter_error_message" name="newsletter_error_message" rows="2" class="form-control"></textarea>
                    </div>
                  </div>
                </div>

                <!-- Legal Tab -->
                <div class="tab-content" data-tab-content="legal">
                  <div class="form-grid">
                    <div class="form-group full-width">
                      <label for="copyright_text">Copyright Text</label>
                      <textarea id="copyright_text" name="copyright_text" rows="2" class="form-control"></textarea>
                    </div>
                    <div class="form-group">
                      <label for="privacy_policy_url">Privacy Policy URL</label>
                      <input type="url" id="privacy_policy_url" name="privacy_policy_url" class="form-control">
                    </div>
                    <div class="form-group">
                      <label for="terms_of_service_url">Terms of Service URL</label>
                      <input type="url" id="terms_of_service_url" name="terms_of_service_url" class="form-control">
                    </div>
                    <div class="form-group">
                      <label for="cookie_policy_url">Cookie Policy URL</label>
                      <input type="url" id="cookie_policy_url" name="cookie_policy_url" class="form-control">
                    </div>
                  </div>
                </div>

                <!-- Display Settings Tab -->
                <div class="tab-content" data-tab-content="settings">
                  <div class="form-grid">
                    <div class="form-group">
                      <label class="checkbox-label">
                        <input type="checkbox" id="show_company_info" name="show_company_info">
                        Show Company Information
                      </label>
                    </div>
                    <div class="form-group">
                      <label class="checkbox-label">
                        <input type="checkbox" id="show_navigation" name="show_navigation">
                        Show Navigation Menus
                      </label>
                    </div>
                    <div class="form-group">
                      <label class="checkbox-label">
                        <input type="checkbox" id="show_social_links" name="show_social_links">
                        Show Social Media Links
                      </label>
                    </div>
                    <div class="form-group">
                      <label class="checkbox-label">
                        <input type="checkbox" id="show_newsletter" name="show_newsletter">
                        Show Newsletter Signup
                      </label>
                    </div>
                    <div class="form-group">
                      <label class="checkbox-label">
                        <input type="checkbox" id="show_contact_info" name="show_contact_info">
                        Show Contact Information
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <!-- Footer Preview -->
          <div class="footer-preview-container" id="footer-preview-container" style="display: none;">
            <div class="preview-header">
              <h3>Footer Preview</h3>
              <button type="button" class="btn btn-secondary" id="close-preview">Close Preview</button>
            </div>
            <div class="preview-content" id="footer-preview-content">
              <!-- Preview will be loaded here -->
            </div>
          </div>

          <!-- Success/Error Messages -->
          <div class="alert-container" id="footer-alert-container"></div>
        </div>

        <style>
          .footer-admin-section {
            margin: 2rem 0;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            overflow: hidden;
          }
          
          .section-header {
            background: #f8f9fa;
            padding: 1rem 1.5rem;
            border-bottom: 1px solid #e9ecef;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .section-title {
            margin: 0;
            color: #333;
            font-size: 1.5rem;
          }
          
          .section-controls {
            display: flex;
            gap: 0.5rem;
            align-items: center;
          }
          
          .locale-selector {
            padding: 0.5rem;
            border: 1px solid #ccc;
            border-radius: 4px;
            background: white;
          }
          
          .footer-admin-content {
            position: relative;
          }
          
          .loading-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255,255,255,0.9);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 1000;
          }
          
          .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #007bff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .admin-tabs {
            padding: 1.5rem;
          }
          
          .tab-buttons {
            display: flex;
            border-bottom: 1px solid #e9ecef;
            margin-bottom: 1.5rem;
          }
          
          .tab-btn {
            background: none;
            border: none;
            padding: 1rem 1.5rem;
            cursor: pointer;
            border-bottom: 3px solid transparent;
            transition: all 0.2s ease;
          }
          
          .tab-btn:hover {
            background: #f8f9fa;
          }
          
          .tab-btn.active {
            border-bottom-color: #007bff;
            color: #007bff;
            font-weight: 600;
          }
          
          .tab-content {
            display: none;
          }
          
          .tab-content.active {
            display: block;
          }
          
          .form-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1rem;
          }
          
          .form-group {
            margin-bottom: 1rem;
          }
          
          .form-group.full-width {
            grid-column: 1 / -1;
          }
          
          .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: #333;
          }
          
          .checkbox-label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            cursor: pointer;
          }
          
          .form-control {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 1rem;
          }
          
          .form-control:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
          }
          
          .btn {
            padding: 0.75rem 1rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1rem;
            transition: all 0.2s ease;
          }
          
          .btn-primary {
            background: #007bff;
            color: white;
          }
          
          .btn-primary:hover {
            background: #0056b3;
          }
          
          .btn-secondary {
            background: #6c757d;
            color: white;
          }
          
          .btn-secondary:hover {
            background: #545b62;
          }
          
          .btn-warning {
            background: #ffc107;
            color: #212529;
          }
          
          .btn-warning:hover {
            background: #e0a800;
          }
          
          .btn-outline-primary {
            background: transparent;
            color: #007bff;
            border: 1px solid #007bff;
          }
          
          .btn-outline-primary:hover {
            background: #007bff;
            color: white;
          }
          
          .alert {
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 4px;
            position: relative;
          }
          
          .alert-success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
          }
          
          .alert-danger {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
          }
          
          .footer-preview-container {
            background: #f8f9fa;
            border-top: 1px solid #e9ecef;
          }
          
          .preview-header {
            padding: 1rem 1.5rem;
            border-bottom: 1px solid #e9ecef;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .preview-content {
            padding: 2rem;
            background: white;
            margin: 1rem;
            border-radius: 4px;
            box-shadow: inset 0 0 10px rgba(0,0,0,0.1);
          }
          
          .menu-editor, .social-editor {
            border: 1px solid #e9ecef;
            border-radius: 4px;
            padding: 1rem;
            background: #f8f9fa;
          }
          
          .menu-item, .social-item {
            display: flex;
            gap: 1rem;
            align-items: center;
            margin-bottom: 1rem;
            padding: 1rem;
            background: white;
            border-radius: 4px;
            border: 1px solid #e9ecef;
          }
          
          .remove-item-btn {
            background: #dc3545;
            color: white;
            border: none;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.875rem;
          }
          
          .remove-item-btn:hover {
            background: #c82333;
          }
        </style>
      `;

      // Insert footer section after existing content or at the end
      const existingSections = container.querySelectorAll('.admin-section');
      if (existingSections.length > 0) {
        existingSections[existingSections.length - 1].insertAdjacentElement('afterend', footerSection);
      } else {
        container.appendChild(footerSection);
      }
    }

    setupEventHandlers() {
      // Locale selector
      const localeSelector = document.getElementById('footer-locale-selector');
      if (localeSelector) {
        localeSelector.addEventListener('change', (e) => {
          this.switchLocale(e.target.value);
        });
      }

      // Tab navigation
      document.addEventListener('click', (e) => {
        if (e.target.classList.contains('tab-btn')) {
          this.switchTab(e.target.dataset.tab);
        }
      });

      // Save button
      const saveBtn = document.getElementById('footer-save-btn');
      if (saveBtn) {
        saveBtn.addEventListener('click', () => this.saveFooterData());
      }

      // Preview button
      const previewBtn = document.getElementById('footer-preview-btn');
      if (previewBtn) {
        previewBtn.addEventListener('click', () => this.showPreview());
      }

      // Reset button
      const resetBtn = document.getElementById('footer-reset-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => this.resetForm());
      }

      // Close preview
      const closePreviewBtn = document.getElementById('close-preview');
      if (closePreviewBtn) {
        closePreviewBtn.addEventListener('click', () => this.hidePreview());
      }

      // Form change detection for auto-save
      const form = document.getElementById('footer-admin-form');
      if (form) {
        form.addEventListener('input', () => this.onFormChange());
        form.addEventListener('change', () => this.onFormChange());
      }

      // Add navigation menu button
      const addNavBtn = document.getElementById('add-navigation-menu');
      if (addNavBtn) {
        addNavBtn.addEventListener('click', () => this.addNavigationMenu());
      }

      // Add social link button
      const addSocialBtn = document.getElementById('add-social-link');
      if (addSocialBtn) {
        addSocialBtn.addEventListener('click', () => this.addSocialLink());
      }
    }

    async loadAllFooterData() {
      try {
        this.showLoading(true);

        // Load data for all locales
        for (const locale of FOOTER_ADMIN_CONFIG.SUPPORTED_LOCALES) {
          try {
            const response = await fetch(`${FOOTER_ADMIN_CONFIG.API_BASE_URL}/api/footer-content?locale=${locale}`);
            if (response.ok) {
              this.footerData[locale] = await response.json();
            } else {
              console.warn(`Failed to load footer data for ${locale}:`, response.statusText);
              // Use default data structure
              this.footerData[locale] = this.getDefaultFooterData();
            }
          } catch (error) {
            console.warn(`Error loading footer data for ${locale}:`, error);
            this.footerData[locale] = this.getDefaultFooterData();
          }
        }

        this.showLoading(false);

      } catch (error) {
        this.showLoading(false);
        throw error;
      }
    }

    getDefaultFooterData() {
      return {
        locale: this.currentLocale,
        company: { name: '', description: '', logo_url: '', tagline: '' },
        contact: { email: '', phone: '', address: '' },
        navigation: {},
        social: {},
        newsletter: { enabled: false, title: '', subtitle: '', placeholder: '', button_text: '' },
        legal: { copyright: '', privacy_policy_url: '', terms_of_service_url: '' },
        settings: { show_company_info: true, show_navigation: true, show_social_links: true, show_newsletter: true, show_contact_info: true }
      };
    }

    renderFooterForm() {
      const data = this.footerData[this.currentLocale] || this.getDefaultFooterData();

      // Populate form fields
      this.populateField('company_name', data.company?.name);
      this.populateField('company_tagline', data.company?.tagline);
      this.populateField('company_description', data.company?.description);
      this.populateField('company_logo_url', data.company?.logo_url);
      this.populateField('contact_email', data.contact?.email);
      this.populateField('contact_phone', data.contact?.phone);
      this.populateField('contact_address', data.contact?.address);

      // Newsletter fields
      this.populateField('newsletter_enabled', data.newsletter?.enabled, 'checkbox');
      this.populateField('newsletter_title', data.newsletter?.title);
      this.populateField('newsletter_subtitle', data.newsletter?.subtitle);
      this.populateField('newsletter_placeholder', data.newsletter?.placeholder);
      this.populateField('newsletter_button_text', data.newsletter?.button_text);
      this.populateField('newsletter_success_message', data.newsletter?.success_message);
      this.populateField('newsletter_error_message', data.newsletter?.error_message);

      // Legal fields
      this.populateField('copyright_text', data.legal?.copyright);
      this.populateField('privacy_policy_url', data.legal?.privacy_policy_url);
      this.populateField('terms_of_service_url', data.legal?.terms_of_service_url);
      this.populateField('cookie_policy_url', data.legal?.cookie_policy_url);

      // Display settings
      this.populateField('show_company_info', data.settings?.show_company_info, 'checkbox');
      this.populateField('show_navigation', data.settings?.show_navigation, 'checkbox');
      this.populateField('show_social_links', data.settings?.show_social_links, 'checkbox');
      this.populateField('show_newsletter', data.settings?.show_newsletter, 'checkbox');
      this.populateField('show_contact_info', data.settings?.show_contact_info, 'checkbox');

      // Render navigation menus
      this.renderNavigationMenus(data.navigation || {});

      // Render social links
      this.renderSocialLinks(data.social || {});
    }

    populateField(fieldId, value, type = 'text') {
      const field = document.getElementById(fieldId);
      if (!field) return;

      if (type === 'checkbox') {
        field.checked = Boolean(value);
      } else {
        field.value = value || '';
      }
    }

    renderNavigationMenus(navigation) {
      const container = document.getElementById('navigation-menus-container');
      if (!container) return;

      container.innerHTML = '';

      Object.entries(navigation).forEach(([menuType, menu]) => {
        const menuEditor = this.createNavigationMenuEditor(menuType, menu);
        container.appendChild(menuEditor);
      });
    }

    createNavigationMenuEditor(menuType, menu) {
      const menuDiv = document.createElement('div');
      menuDiv.className = 'menu-editor';
      menuDiv.dataset.menuType = menuType;
      
      menuDiv.innerHTML = `
        <div class="menu-header">
          <h4>${menu.title || menuType}</h4>
          <button type="button" class="remove-item-btn" onclick="this.closest('.menu-editor').remove()">Remove</button>
        </div>
        <div class="form-group">
          <label>Menu Title</label>
          <input type="text" class="form-control menu-title" value="${menu.title || ''}" placeholder="Menu Title">
        </div>
        <div class="menu-items" data-menu-type="${menuType}">
          ${(menu.items || []).map((item, index) => this.createMenuItemHTML(item, index)).join('')}
        </div>
        <button type="button" class="btn btn-outline-primary add-menu-item">Add Menu Item</button>
      `;

      // Add event listener for adding menu items
      menuDiv.querySelector('.add-menu-item').addEventListener('click', () => {
        const itemsContainer = menuDiv.querySelector('.menu-items');
        const itemIndex = itemsContainer.children.length;
        const newItem = document.createElement('div');
        newItem.innerHTML = this.createMenuItemHTML({ text: '', url: '', visible: true }, itemIndex);
        itemsContainer.appendChild(newItem);
      });

      return menuDiv;
    }

    createMenuItemHTML(item, index) {
      return `
        <div class="menu-item" data-index="${index}">
          <input type="text" class="form-control" placeholder="Link Text" value="${item.text || ''}" data-field="text">
          <input type="url" class="form-control" placeholder="URL" value="${item.url || ''}" data-field="url">
          <label class="checkbox-label">
            <input type="checkbox" ${item.visible !== false ? 'checked' : ''} data-field="visible">
            Visible
          </label>
          <button type="button" class="remove-item-btn" onclick="this.parentElement.remove()">Remove</button>
        </div>
      `;
    }

    renderSocialLinks(social) {
      const container = document.getElementById('social-links-container');
      if (!container) return;

      container.innerHTML = '';

      Object.entries(social).forEach(([platform, link]) => {
        const linkEditor = this.createSocialLinkEditor(platform, link);
        container.appendChild(linkEditor);
      });
    }

    createSocialLinkEditor(platform, link) {
      const linkDiv = document.createElement('div');
      linkDiv.className = 'social-item';
      linkDiv.dataset.platform = platform;
      
      linkDiv.innerHTML = `
        <input type="text" class="form-control" placeholder="Platform" value="${platform}" data-field="platform">
        <input type="url" class="form-control" placeholder="URL" value="${link.url || ''}" data-field="url">
        <input type="text" class="form-control" placeholder="Icon Class" value="${link.icon || ''}" data-field="icon">
        <input type="text" class="form-control" placeholder="Display Text" value="${link.text || ''}" data-field="text">
        <button type="button" class="remove-item-btn" onclick="this.parentElement.remove()">Remove</button>
      `;

      return linkDiv;
    }

    addNavigationMenu() {
      const container = document.getElementById('navigation-menus-container');
      if (!container) return;

      const menuType = prompt('Enter menu type (e.g., "main", "secondary", "utility"):');
      if (!menuType) return;

      const menu = {
        title: menuType.charAt(0).toUpperCase() + menuType.slice(1),
        items: []
      };

      const menuEditor = this.createNavigationMenuEditor(menuType, menu);
      container.appendChild(menuEditor);

      this.onFormChange();
    }

    addSocialLink() {
      const container = document.getElementById('social-links-container');
      if (!container) return;

      const platform = prompt('Enter social platform (e.g., "facebook", "twitter"):');
      if (!platform) return;

      const link = {
        url: '',
        icon: `fab fa-${platform}`,
        text: platform.charAt(0).toUpperCase() + platform.slice(1)
      };

      const linkEditor = this.createSocialLinkEditor(platform, link);
      container.appendChild(linkEditor);

      this.onFormChange();
    }

    switchLocale(locale) {
      if (this.currentLocale === locale) return;

      // Save current locale data if dirty
      if (this.isDirty) {
        this.saveFormDataToMemory();
      }

      this.currentLocale = locale;
      this.renderFooterForm();
    }

    switchTab(tabName) {
      // Update tab buttons
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
      });

      // Update tab contents
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.dataset.tabContent === tabName);
      });
    }

    onFormChange() {
      this.isDirty = true;
      
      // Clear existing timeout
      if (this.autoSaveTimeout) {
        clearTimeout(this.autoSaveTimeout);
      }

      // Set new timeout for auto-save
      this.autoSaveTimeout = setTimeout(() => {
        this.saveFormDataToMemory();
      }, FOOTER_ADMIN_CONFIG.AUTO_SAVE_DELAY);
    }

    saveFormDataToMemory() {
      const formData = this.collectFormData();
      if (!this.footerData[this.currentLocale]) {
        this.footerData[this.currentLocale] = {};
      }
      
      // Merge form data with existing data
      this.footerData[this.currentLocale] = {
        ...this.footerData[this.currentLocale],
        ...formData
      };
      
      this.isDirty = false;
    }

    collectFormData() {
      const form = document.getElementById('footer-admin-form');
      if (!form) return {};

      const formData = new FormData(form);
      const data = {};

      // Collect basic form fields
      for (const [key, value] of formData.entries()) {
        if (key.includes('_')) {
          const [section, field] = key.split('_', 2);
          if (!data[section]) data[section] = {};
          data[section][field] = value;
        } else {
          data[key] = value;
        }
      }

      // Collect checkbox values
      form.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        const name = checkbox.name;
        if (name.includes('_')) {
          const [section, field] = name.split('_', 2);
          if (!data[section]) data[section] = {};
          data[section][field] = checkbox.checked;
        } else {
          data[name] = checkbox.checked;
        }
      });

      // Collect navigation menus
      const navigation = {};
      document.querySelectorAll('.menu-editor').forEach(menuEditor => {
        const menuType = menuEditor.dataset.menuType;
        const title = menuEditor.querySelector('.menu-title').value;
        const items = [];
        
        menuEditor.querySelectorAll('.menu-item').forEach(itemDiv => {
          const item = {};
          itemDiv.querySelectorAll('[data-field]').forEach(field => {
            const fieldName = field.dataset.field;
            if (field.type === 'checkbox') {
              item[fieldName] = field.checked;
            } else {
              item[fieldName] = field.value;
            }
          });
          if (item.text || item.url) {
            items.push(item);
          }
        });
        
        if (title || items.length > 0) {
          navigation[menuType] = { title, items };
        }
      });
      
      if (Object.keys(navigation).length > 0) {
        data.navigation = navigation;
      }

      // Collect social links
      const social = {};
      document.querySelectorAll('.social-item').forEach(linkDiv => {
        const platform = linkDiv.querySelector('[data-field="platform"]').value;
        if (!platform) return;
        
        social[platform] = {};
        linkDiv.querySelectorAll('[data-field]').forEach(field => {
          const fieldName = field.dataset.field;
          if (fieldName !== 'platform') {
            social[platform][fieldName] = field.value;
          }
        });
      });
      
      if (Object.keys(social).length > 0) {
        data.social = social;
      }

      return data;
    }

    async saveFooterData() {
      try {
        this.showLoading(true, 'Saving footer data...');

        // Collect form data
        this.saveFormDataToMemory();
        const data = this.footerData[this.currentLocale];

        // Flatten the data structure for API
        const apiData = {
          locale: this.currentLocale,
          // Company fields
          company_name: data.company?.name,
          company_description: data.company?.description,
          company_logo_url: data.company?.logo_url,
          company_tagline: data.company?.tagline,
          // Contact fields
          contact_email: data.contact?.email,
          contact_phone: data.contact?.phone,
          contact_address: data.contact?.address,
          // Newsletter fields
          newsletter_enabled: data.newsletter?.enabled,
          newsletter_title: data.newsletter?.title,
          newsletter_subtitle: data.newsletter?.subtitle,
          newsletter_placeholder: data.newsletter?.placeholder,
          newsletter_button_text: data.newsletter?.button_text,
          newsletter_success_message: data.newsletter?.success_message,
          newsletter_error_message: data.newsletter?.error_message,
          // Legal fields
          copyright_text: data.legal?.copyright,
          privacy_policy_url: data.legal?.privacy_policy_url,
          terms_of_service_url: data.legal?.terms_of_service_url,
          cookie_policy_url: data.legal?.cookie_policy_url,
          // Display settings
          show_company_info: data.settings?.show_company_info,
          show_navigation: data.settings?.show_navigation,
          show_social_links: data.settings?.show_social_links,
          show_newsletter: data.settings?.show_newsletter,
          show_contact_info: data.settings?.show_contact_info
        };

        const response = await fetch(`${FOOTER_ADMIN_CONFIG.API_BASE_URL}/api/footer-content`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(apiData)
        });

        if (!response.ok) {
          throw new Error(`Save failed: ${response.statusText}`);
        }

        const result = await response.json();
        
        this.showLoading(false);
        this.showSuccess('Footer data saved successfully!');
        this.isDirty = false;
        this.retryCount = 0;

      } catch (error) {
        this.showLoading(false);
        console.error('Save error:', error);
        
        if (this.retryCount < FOOTER_ADMIN_CONFIG.MAX_RETRIES) {
          this.retryCount++;
          this.showError(`Save failed. Retrying... (${this.retryCount}/${FOOTER_ADMIN_CONFIG.MAX_RETRIES})`);
          setTimeout(() => this.saveFooterData(), 1000);
        } else {
          this.showError('Failed to save footer data: ' + error.message);
          this.retryCount = 0;
        }
      }
    }

    async showPreview() {
      try {
        this.saveFormDataToMemory();
        const data = this.footerData[this.currentLocale];

        const previewContainer = document.getElementById('footer-preview-container');
        const previewContent = document.getElementById('footer-preview-content');
        
        if (!previewContainer || !previewContent) return;

        // Show preview container
        previewContainer.style.display = 'block';

        // Generate preview HTML (simplified version)
        const previewHTML = `
          <div class="footer-preview" style="background: #f8f9fa; padding: 2rem; border-radius: 8px;">
            <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
              ${data.settings?.show_company_info ? `
                <div>
                  <h4>${data.company?.name || 'Company Name'}</h4>
                  <p>${data.company?.description || 'Company description...'}</p>
                  <p><strong>Email:</strong> ${data.contact?.email || 'email@company.com'}</p>
                  ${data.contact?.phone ? `<p><strong>Phone:</strong> ${data.contact.phone}</p>` : ''}
                </div>
              ` : ''}
              
              ${data.settings?.show_navigation && data.navigation ? `
                <div>
                  ${Object.entries(data.navigation).map(([type, menu]) => `
                    <div style="margin-bottom: 1rem;">
                      <h5>${menu.title || type}</h5>
                      <ul style="list-style: none; padding: 0;">
                        ${(menu.items || []).filter(item => item.visible !== false).map(item => 
                          `<li style="margin-bottom: 0.25rem;"><a href="${item.url || '#'}" style="color: #007bff; text-decoration: none;">${item.text || 'Menu Item'}</a></li>`
                        ).join('')}
                      </ul>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
              
              ${data.settings?.show_newsletter && data.newsletter?.enabled ? `
                <div>
                  <h5>${data.newsletter.title || 'Newsletter'}</h5>
                  <p>${data.newsletter.subtitle || 'Subscribe to our newsletter'}</p>
                  <div style="display: flex; gap: 0.5rem;">
                    <input type="email" placeholder="${data.newsletter.placeholder || 'Enter email'}" style="flex: 1; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px;">
                    <button style="padding: 0.5rem 1rem; background: #007bff; color: white; border: none; border-radius: 4px;">${data.newsletter.button_text || 'Subscribe'}</button>
                  </div>
                </div>
              ` : ''}
            </div>
            
            ${data.settings?.show_social_links && data.social && Object.keys(data.social).length > 0 ? `
              <div style="border-top: 1px solid #e9ecef; padding-top: 1rem;">
                <div style="display: flex; gap: 1rem; align-items: center;">
                  <span>Follow us:</span>
                  ${Object.entries(data.social).map(([platform, link]) => 
                    `<a href="${link.url || '#'}" style="color: #007bff; text-decoration: none;">${link.text || platform}</a>`
                  ).join('')}
                </div>
              </div>
            ` : ''}
            
            <div style="border-top: 1px solid #e9ecef; padding-top: 1rem; text-align: center; font-size: 0.875rem; color: #666;">
              ${data.legal?.copyright || '© 2024 Company Name. All rights reserved.'}
            </div>
          </div>
        `;

        previewContent.innerHTML = previewHTML;

      } catch (error) {
        console.error('Preview error:', error);
        this.showError('Failed to generate preview: ' + error.message);
      }
    }

    hidePreview() {
      const previewContainer = document.getElementById('footer-preview-container');
      if (previewContainer) {
        previewContainer.style.display = 'none';
      }
    }

    resetForm() {
      if (confirm('Are you sure you want to reset the form? All unsaved changes will be lost.')) {
        this.loadAllFooterData().then(() => {
          this.renderFooterForm();
          this.isDirty = false;
          this.showSuccess('Form reset successfully');
        });
      }
    }

    showLoading(show, message = 'Loading...') {
      const overlay = document.getElementById('footer-loading');
      const container = document.getElementById('footer-form-container');
      
      if (!overlay || !container) return;

      if (show) {
        overlay.style.display = 'flex';
        overlay.querySelector('p').textContent = message;
        container.style.display = 'none';
      } else {
        overlay.style.display = 'none';
        container.style.display = 'block';
      }
    }

    showSuccess(message) {
      this.showAlert(message, 'success');
    }

    showError(message) {
      this.showAlert(message, 'danger');
    }

    showAlert(message, type) {
      const container = document.getElementById('footer-alert-container');
      if (!container) return;

      const alert = document.createElement('div');
      alert.className = `alert alert-${type}`;
      alert.textContent = message;
      
      // Clear existing alerts
      container.innerHTML = '';
      container.appendChild(alert);

      // Auto-remove after 5 seconds
      setTimeout(() => {
        if (alert.parentElement) {
          alert.remove();
        }
      }, 5000);
    }
  }

  // Initialize footer admin panel
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new FooterAdminPanel();
    });
  } else {
    new FooterAdminPanel();
  }

  // Expose globally for debugging
  window.FooterAdminPanel = FooterAdminPanel;

})();