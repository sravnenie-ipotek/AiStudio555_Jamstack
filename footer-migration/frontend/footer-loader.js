/**
 * FOOTER LOADER MODULE
 * 
 * Dynamically loads footer content from API and replaces static footer.
 * Features:
 * - Progressive enhancement (falls back to static footer)
 * - Caching for performance
 * - Multi-language support
 * - Skeleton loading state
 * - Newsletter form integration
 * - Error handling with fallback
 */

(function() {
  'use strict';

  // Configuration
  const FOOTER_CONFIG = {
    API_BASE_URL: window.location.origin,
    API_TIMEOUT: 2000,
    CACHE_DURATION: 30 * 60 * 1000, // 30 minutes
    CACHE_KEY_PREFIX: 'footer_cache_',
    DEBUG: window.location.hostname === 'localhost',
    FEATURE_FLAG: window.ENABLE_DYNAMIC_FOOTER !== false // Default to true
  };

  // Cache utility
  const FooterCache = {
    get(key) {
      try {
        const item = localStorage.getItem(FOOTER_CONFIG.CACHE_KEY_PREFIX + key);
        if (!item) return null;
        
        const parsed = JSON.parse(item);
        if (Date.now() > parsed.expiry) {
          this.remove(key);
          return null;
        }
        
        return parsed.data;
      } catch (error) {
        console.warn('Footer cache get error:', error);
        return null;
      }
    },
    
    set(key, data, duration = FOOTER_CONFIG.CACHE_DURATION) {
      try {
        const item = {
          data: data,
          expiry: Date.now() + duration
        };
        localStorage.setItem(FOOTER_CONFIG.CACHE_KEY_PREFIX + key, JSON.stringify(item));
      } catch (error) {
        console.warn('Footer cache set error:', error);
      }
    },
    
    remove(key) {
      try {
        localStorage.removeItem(FOOTER_CONFIG.CACHE_KEY_PREFIX + key);
      } catch (error) {
        console.warn('Footer cache remove error:', error);
      }
    },
    
    clear() {
      try {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith(FOOTER_CONFIG.CACHE_KEY_PREFIX)) {
            localStorage.removeItem(key);
          }
        });
      } catch (error) {
        console.warn('Footer cache clear error:', error);
      }
    }
  };

  // Main Footer Loader Class
  class FooterLoader {
    constructor() {
      this.footerElement = null;
      this.locale = this.detectLocale();
      this.isLoading = false;
      this.retryCount = 0;
      this.maxRetries = 2;
      
      // Bind methods
      this.handleError = this.handleError.bind(this);
      this.attachEventHandlers = this.attachEventHandlers.bind(this);
    }
    
    // Initialize footer loading
    async init() {
      if (!FOOTER_CONFIG.FEATURE_FLAG) {
        this.log('Dynamic footer disabled by feature flag');
        return;
      }
      
      this.footerElement = this.findFooterElement();
      if (!this.footerElement) {
        this.log('Footer element not found');
        return;
      }
      
      this.log(`Initializing footer loader (locale: ${this.locale})`);
      
      try {
        await this.loadFooter();
      } catch (error) {
        this.handleError(error);
      }
    }
    
    // Find footer element in DOM
    findFooterElement() {
      // Try multiple selectors to find footer
      const selectors = [
        'footer.footer',
        '.footer',
        'footer.section.footer',
        'footer',
        '[data-footer]'
      ];
      
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
          this.log(`Found footer element: ${selector}`);
          return element;
        }
      }
      
      return null;
    }
    
    // Detect current page locale
    detectLocale() {
      // Try multiple methods to detect locale
      
      // 1. From URL path
      const pathSegments = window.location.pathname.split('/').filter(Boolean);
      if (pathSegments.length > 0) {
        const possibleLocale = pathSegments[0];
        if (['en', 'ru', 'he'].includes(possibleLocale)) {
          return possibleLocale;
        }
      }
      
      // 2. From HTML lang attribute
      const htmlLang = document.documentElement.lang;
      if (htmlLang && ['en', 'ru', 'he'].includes(htmlLang)) {
        return htmlLang;
      }
      
      // 3. From meta tag
      const metaLang = document.querySelector('meta[name="language"]');
      if (metaLang && ['en', 'ru', 'he'].includes(metaLang.content)) {
        return metaLang.content;
      }
      
      // 4. From browser language (first preference)
      const browserLang = navigator.language.substring(0, 2);
      if (['ru', 'he'].includes(browserLang)) {
        return browserLang;
      }
      
      // 5. Default to English
      return 'en';
    }
    
    // Main footer loading function
    async loadFooter() {
      if (this.isLoading) return;
      
      this.isLoading = true;
      this.showSkeleton();
      
      try {
        // Try to get from cache first
        const cacheKey = `content_${this.locale}`;
        let footerData = FooterCache.get(cacheKey);
        
        if (!footerData) {
          // Fetch from API
          footerData = await this.fetchFromAPI();
          
          // Cache the result
          FooterCache.set(cacheKey, footerData);
        } else {
          this.log('Using cached footer data');
        }
        
        // Render footer
        await this.renderFooter(footerData);
        
        // Attach event handlers
        this.attachEventHandlers();
        
        // Hide skeleton
        this.hideSkeleton();
        
        this.log('Footer loaded successfully');
        
      } catch (error) {
        this.handleError(error);
      } finally {
        this.isLoading = false;
      }
    }
    
    // Fetch footer data from API
    async fetchFromAPI() {
      const url = `${FOOTER_CONFIG.API_BASE_URL}/api/footer-content?locale=${this.locale}`;
      
      this.log(`Fetching footer data: ${url}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), FOOTER_CONFIG.API_TIMEOUT);
      
      try {
        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'max-age=3600'
          }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid API response format');
        }
        
        return data;
        
      } catch (error) {
        clearTimeout(timeoutId);
        
        if (error.name === 'AbortError') {
          throw new Error('API request timeout');
        }
        
        throw error;
      }
    }
    
    // Show loading skeleton
    showSkeleton() {
      if (!this.footerElement) return;
      
      const skeleton = document.createElement('div');
      skeleton.className = 'footer-skeleton';
      skeleton.innerHTML = `
        <div class="footer-skeleton-content">
          <div class="skeleton-nav">
            <div class="skeleton-item"></div>
            <div class="skeleton-item"></div>
            <div class="skeleton-item"></div>
          </div>
          <div class="skeleton-social">
            <div class="skeleton-social-item"></div>
            <div class="skeleton-social-item"></div>
            <div class="skeleton-social-item"></div>
          </div>
          <div class="skeleton-form">
            <div class="skeleton-input"></div>
            <div class="skeleton-button"></div>
          </div>
        </div>
        <style>
          .footer-skeleton { opacity: 0.6; }
          .footer-skeleton-content { 
            display: flex; 
            justify-content: space-between; 
            align-items: center;
            padding: 20px 0;
          }
          .skeleton-nav { display: flex; gap: 20px; }
          .skeleton-item { 
            width: 80px; 
            height: 20px; 
            background: linear-gradient(90deg, #f0f0f0 25%, transparent 37%, #f0f0f0 63%);
            background-size: 400% 100%;
            animation: skeleton-loading 1.5s ease-in-out infinite;
            border-radius: 4px;
          }
          .skeleton-social { display: flex; gap: 10px; }
          .skeleton-social-item { 
            width: 40px; 
            height: 40px; 
            background: linear-gradient(90deg, #f0f0f0 25%, transparent 37%, #f0f0f0 63%);
            background-size: 400% 100%;
            animation: skeleton-loading 1.5s ease-in-out infinite;
            border-radius: 50%;
          }
          .skeleton-form { display: flex; gap: 10px; align-items: center; }
          .skeleton-input { 
            width: 200px; 
            height: 40px; 
            background: linear-gradient(90deg, #f0f0f0 25%, transparent 37%, #f0f0f0 63%);
            background-size: 400% 100%;
            animation: skeleton-loading 1.5s ease-in-out infinite;
            border-radius: 4px;
          }
          .skeleton-button { 
            width: 100px; 
            height: 40px; 
            background: linear-gradient(90deg, #f0f0f0 25%, transparent 37%, #f0f0f0 63%);
            background-size: 400% 100%;
            animation: skeleton-loading 1.5s ease-in-out infinite;
            border-radius: 4px;
          }
          @keyframes skeleton-loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
          @media (max-width: 768px) {
            .footer-skeleton-content { flex-direction: column; gap: 20px; }
          }
        </style>
      `;
      
      // Store original content
      this.originalFooterContent = this.footerElement.innerHTML;
      
      // Replace with skeleton
      this.footerElement.innerHTML = '';
      this.footerElement.appendChild(skeleton);
    }
    
    // Hide loading skeleton
    hideSkeleton() {
      const skeleton = this.footerElement?.querySelector('.footer-skeleton');
      if (skeleton) {
        skeleton.remove();
      }
    }
    
    // Render footer with data
    async renderFooter(data) {
      if (!this.footerElement || !data) return;
      
      const isRTL = this.locale === 'he';
      
      // Build footer HTML
      const footerHTML = `
        <div class="container">
          <div class="footer-content">
            <div class="footer-top-content" ${isRTL ? 'dir="rtl"' : ''}>
              
              <!-- Company Info Section -->
              ${data.settings?.show_company_info ? `
              <div class="footer-details-content">
                <a href="${this.getHomeUrl()}" class="footer-logo-link w-inline-block">
                  <img loading="lazy" src="${data.company?.logo_url || '/images/Logo.svg'}" alt="${data.company?.name || 'AI Studio'}" class="footer-logo-image">
                </a>
                <div class="footer-description-text-wrapper">
                  <p class="footer-description-text">${data.company?.description || ''}</p>
                </div>
                ${data.settings?.show_social_links ? this.renderSocialLinks(data.social) : ''}
                ${data.settings?.show_contact_info ? `
                <div class="footer-details-gmail">Contact: <span class="footer-details-gmail-text">${data.contact?.email || ''}</span></div>
                ` : ''}
                ${data.settings?.show_newsletter && data.newsletter?.enabled ? this.renderNewsletterForm(data.newsletter) : ''}
              </div>
              ` : ''}
              
              <!-- Navigation Section -->
              ${data.settings?.show_navigation ? this.renderNavigation(data.navigation) : ''}
              
            </div>
            
            <!-- Copyright Section -->
            <div class="footer-bottom" ${isRTL ? 'dir="rtl"' : ''}>
              <div class="footer-copyright">
                <p>${data.legal?.copyright || ''}</p>
              </div>
            </div>
            
          </div>
        </div>
      `;
      
      // Replace footer content
      this.footerElement.innerHTML = footerHTML;
      
      // Apply RTL styling if needed
      if (isRTL) {
        this.footerElement.style.direction = 'rtl';
        this.footerElement.style.textAlign = 'right';
      }
    }
    
    // Render social links
    renderSocialLinks(social) {
      if (!social || Object.keys(social).length === 0) return '';
      
      const socialHTML = Object.entries(social)
        .filter(([platform, data]) => data?.url)
        .map(([platform, data]) => `
          <a href="${data.url}" target="_blank" class="footer-social-media-link w-inline-block" 
             title="${data.tooltip || ''}" rel="noopener noreferrer">
            <div class="footer-social-media-icon">
              <i class="${data.icon || 'fab fa-' + platform}" aria-hidden="true"></i>
            </div>
            <div class="footer-social-media-circel"></div>
          </a>
        `)
        .join('');
      
      return `
        <div class="footer-social-media-wrapper">
          ${socialHTML}
        </div>
      `;
    }
    
    // Render navigation menus
    renderNavigation(navigation) {
      if (!navigation || Object.keys(navigation).length === 0) return '';
      
      const menuHTML = Object.entries(navigation)
        .sort(([,a], [,b]) => (a.order || 0) - (b.order || 0))
        .map(([menuType, menu]) => `
          <div class="footer-menu-single">
            <div class="footer-menu-title-wrapper">
              <h4 class="footer-menu-title">${menu.title || ''}</h4>
              <div class="footer-menu-title-line"></div>
            </div>
            <div class="footer-menu-list-wrapper">
              <ul role="list" class="footer-menu-list">
                ${menu.items?.filter(item => item.visible !== false)
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map(item => `
                    <li class="footer-menu-list-item">
                      <a href="${item.url || '#'}" 
                         class="footer-menu-text-link ${item.highlight ? 'highlighted' : ''}"
                         ${item.target ? `target="${item.target}"` : ''}
                         ${item.target === '_blank' ? 'rel="noopener noreferrer"' : ''}>
                        ${item.text || ''}
                      </a>
                    </li>
                  `).join('') || ''}
              </ul>
            </div>
          </div>
        `).join('');
      
      return `
        <div class="footer-menu-wrapper">
          <div class="w-layout-grid footer-menu-grid">
            ${menuHTML}
          </div>
        </div>
      `;
    }
    
    // Render newsletter form
    renderNewsletterForm(newsletter) {
      if (!newsletter?.enabled) return '';
      
      return `
        <div class="footer-details-form-wrapper">
          <div class="footer-details-form-block w-form">
            <form id="footer-newsletter-form" name="newsletter-form" data-name="Newsletter Form" method="post" class="footer-details-form">
              <label for="footer-email" class="footer-details-form-text">${newsletter.title || 'Subscribe to Newsletter'}</label>
              ${newsletter.subtitle ? `<p class="footer-newsletter-subtitle">${newsletter.subtitle}</p>` : ''}
              <div class="footer-details-form-single">
                <input class="footer-details-form-input-field w-input" 
                       maxlength="256" 
                       name="email" 
                       data-name="Email" 
                       placeholder="${newsletter.placeholder || 'Enter email to subscribe'}" 
                       type="email" 
                       id="footer-email" 
                       required="">
                <input type="submit" 
                       data-wait="Please wait..." 
                       class="footer-details-form-submit-button w-button" 
                       value="${newsletter.button_text || 'Subscribe'}">
              </div>
              ${newsletter.gdpr_required ? `
              <div class="footer-gdpr-consent">
                <label>
                  <input type="checkbox" name="gdpr_consent" required>
                  <span class="footer-gdpr-text">${newsletter.gdpr_text || 'I agree to receive marketing emails'}</span>
                </label>
              </div>
              ` : ''}
            </form>
            <div class="w-form-done" style="display: none;">
              <div>${newsletter.success_message || 'Thank you! Your submission has been received!'}</div>
            </div>
            <div class="w-form-fail" style="display: none;">
              <div>${newsletter.error_message || 'Oops! Something went wrong while submitting the form.'}</div>
            </div>
          </div>
        </div>
      `;
    }
    
    // Attach event handlers
    attachEventHandlers() {
      // Newsletter form handler
      const newsletterForm = this.footerElement?.querySelector('#footer-newsletter-form');
      if (newsletterForm) {
        newsletterForm.addEventListener('submit', this.handleNewsletterSubmit.bind(this));
      }
      
      // Re-initialize Webflow interactions if available
      if (window.Webflow) {
        try {
          window.Webflow.destroy();
          window.Webflow.ready();
          window.Webflow.require('ix2').init();
        } catch (error) {
          this.log('Webflow re-initialization failed:', error);
        }
      }
      
      // Track footer interactions
      this.trackFooterAnalytics();
    }
    
    // Handle newsletter form submission
    async handleNewsletterSubmit(event) {
      event.preventDefault();
      
      const form = event.target;
      const formData = new FormData(form);
      const email = formData.get('email');
      
      if (!email) return;
      
      // Show loading state
      const submitButton = form.querySelector('input[type="submit"]');
      const originalText = submitButton.value;
      submitButton.value = submitButton.dataset.wait || 'Please wait...';
      submitButton.disabled = true;
      
      try {
        // Use existing contact form modal system if available
        if (window.EmailJS && window.EmailJS.send) {
          await window.EmailJS.send('service_t2uqbxs', 'template_l1zowlh', {
            email: email,
            message: 'Newsletter subscription request'
          });
        } else {
          // Fallback API call
          await fetch('/api/newsletter/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
          });
        }
        
        // Show success message
        form.style.display = 'none';
        form.nextElementSibling.style.display = 'block';
        
      } catch (error) {
        console.error('Newsletter subscription failed:', error);
        
        // Show error message
        form.style.display = 'none';
        form.parentElement.querySelector('.w-form-fail').style.display = 'block';
        
      } finally {
        // Reset button
        submitButton.value = originalText;
        submitButton.disabled = false;
      }
    }
    
    // Track footer analytics
    trackFooterAnalytics() {
      // Track footer view
      if (typeof gtag !== 'undefined') {
        gtag('event', 'footer_dynamic_load', {
          event_category: 'Footer',
          event_label: this.locale
        });
      }
      
      // Track footer link clicks
      const footerLinks = this.footerElement?.querySelectorAll('a[href]');
      footerLinks?.forEach(link => {
        link.addEventListener('click', () => {
          if (typeof gtag !== 'undefined') {
            gtag('event', 'footer_link_click', {
              event_category: 'Footer',
              event_label: link.href,
              value: this.locale
            });
          }
        });
      });
    }
    
    // Get home URL based on locale
    getHomeUrl() {
      const baseUrls = {
        'en': '/home.html',
        'ru': '/ru/home.html',
        'he': '/he/home.html'
      };
      
      return baseUrls[this.locale] || '/home.html';
    }
    
    // Error handling
    handleError(error) {
      this.log('Footer loading error:', error);
      
      // Hide skeleton
      this.hideSkeleton();
      
      // Restore original content if available
      if (this.originalFooterContent && this.footerElement) {
        this.footerElement.innerHTML = this.originalFooterContent;
        this.log('Restored static footer content');
      }
      
      // Try retry if not exceeded max attempts
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        this.log(`Retrying footer load (attempt ${this.retryCount + 1}/${this.maxRetries + 1})`);
        
        setTimeout(() => {
          this.loadFooter();
        }, 1000 * this.retryCount); // Exponential backoff
      } else {
        this.log('Max retries exceeded, keeping static footer');
        
        // Track error
        if (typeof gtag !== 'undefined') {
          gtag('event', 'footer_load_error', {
            event_category: 'Footer',
            event_label: error.message,
            value: this.locale
          });
        }
      }
    }
    
    // Logging utility
    log(...args) {
      if (FOOTER_CONFIG.DEBUG) {
        console.log('[FooterLoader]', ...args);
      }
    }
  }

  // Initialize footer loader when DOM is ready
  function initFooterLoader() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        const loader = new FooterLoader();
        loader.init();
      });
    } else {
      const loader = new FooterLoader();
      loader.init();
    }
  }

  // Auto-initialize if not disabled
  if (FOOTER_CONFIG.FEATURE_FLAG !== false) {
    initFooterLoader();
  }

  // Expose FooterLoader globally for manual control
  window.FooterLoader = FooterLoader;
  window.FooterCache = FooterCache;

})();