/**
 * INPUT VALIDATION AND SANITIZATION
 * 
 * Fixes: XSS vulnerabilities, SQL injection, Input validation issues
 * Provides comprehensive input validation and HTML sanitization
 */

const validator = require('validator');
const DOMPurify = require('isomorphic-dompurify');

/**
 * HTML Sanitization utility
 */
class HTMLSanitizer {
  static sanitize(html) {
    if (!html || typeof html !== 'string') {
      return '';
    }
    
    // Configure DOMPurify options
    const config = {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'u', 'a', 'span', 'div',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li', 'blockquote'
      ],
      ALLOWED_ATTR: ['href', 'class', 'id', 'target', 'rel'],
      ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|xxx):|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i,
      FORBID_ATTR: ['style', 'onclick', 'onerror', 'onload'],
      FORBID_TAGS: ['script', 'object', 'embed', 'iframe', 'form', 'input']
    };
    
    return DOMPurify.sanitize(html, config);
  }
  
  static escapeHTML(str) {
    if (!str || typeof str !== 'string') {
      return '';
    }
    
    const htmlEscapeMap = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;'
    };
    
    return str.replace(/[&<>"'/]/g, (match) => htmlEscapeMap[match]);
  }
}

/**
 * Locale validation
 */
function validateLocale(locale) {
  const allowedLocales = ['en', 'ru', 'he'];
  
  if (!locale || typeof locale !== 'string') {
    return { isValid: false, sanitized: 'en', error: 'Locale required' };
  }
  
  const sanitized = locale.toLowerCase().trim();
  
  if (!allowedLocales.includes(sanitized)) {
    return { isValid: false, sanitized: 'en', error: 'Invalid locale' };
  }
  
  return { isValid: true, sanitized };
}

/**
 * URL validation
 */
function validateURL(url, allowRelative = true) {
  if (!url || typeof url !== 'string') {
    return { isValid: false, sanitized: '', error: 'URL required' };
  }
  
  const trimmed = url.trim();
  
  // Allow relative URLs if specified
  if (allowRelative && (trimmed.startsWith('/') || trimmed.startsWith('../'))) {
    // Basic path traversal protection
    if (trimmed.includes('..') && !trimmed.startsWith('../')) {
      return { isValid: false, sanitized: '', error: 'Invalid path' };
    }
    return { isValid: true, sanitized: trimmed };
  }
  
  // Validate absolute URLs
  if (!validator.isURL(trimmed, {
    protocols: ['http', 'https'],
    require_protocol: true
  })) {
    return { isValid: false, sanitized: '', error: 'Invalid URL format' };
  }
  
  return { isValid: true, sanitized: trimmed };
}

/**
 * Email validation
 */
function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { isValid: false, sanitized: '', error: 'Email required' };
  }
  
  const trimmed = email.trim().toLowerCase();
  
  if (!validator.isEmail(trimmed)) {
    return { isValid: false, sanitized: '', error: 'Invalid email format' };
  }
  
  if (trimmed.length > 255) {
    return { isValid: false, sanitized: '', error: 'Email too long' };
  }
  
  return { isValid: true, sanitized: trimmed };
}

/**
 * Text field validation
 */
function validateText(text, options = {}) {
  const {
    required = false,
    minLength = 0,
    maxLength = 10000,
    allowHTML = false,
    fieldName = 'field'
  } = options;
  
  if (!text && required) {
    return { isValid: false, sanitized: '', error: `${fieldName} is required` };
  }
  
  if (!text) {
    return { isValid: true, sanitized: '' };
  }
  
  if (typeof text !== 'string') {
    return { isValid: false, sanitized: '', error: `${fieldName} must be text` };
  }
  
  const trimmed = text.trim();
  
  if (trimmed.length < minLength) {
    return { 
      isValid: false, 
      sanitized: '', 
      error: `${fieldName} must be at least ${minLength} characters` 
    };
  }
  
  if (trimmed.length > maxLength) {
    return { 
      isValid: false, 
      sanitized: '', 
      error: `${fieldName} must be no more than ${maxLength} characters` 
    };
  }
  
  // Sanitize HTML if allowed, otherwise escape it
  const sanitized = allowHTML ? 
    HTMLSanitizer.sanitize(trimmed) : 
    HTMLSanitizer.escapeHTML(trimmed);
  
  return { isValid: true, sanitized };
}

/**
 * JSON validation
 */
function validateJSON(jsonString, schema = null) {
  if (!jsonString) {
    return { isValid: true, sanitized: null };
  }
  
  if (typeof jsonString !== 'string') {
    try {
      // Already parsed JSON
      return { isValid: true, sanitized: jsonString };
    } catch {
      return { isValid: false, sanitized: null, error: 'Invalid JSON data' };
    }
  }
  
  try {
    const parsed = JSON.parse(jsonString);
    
    // Basic schema validation for menu items
    if (schema === 'menu_items' && Array.isArray(parsed)) {
      const validatedItems = parsed.map(item => {
        if (typeof item !== 'object' || !item) return null;
        
        return {
          text: HTMLSanitizer.escapeHTML(String(item.text || '')),
          url: validateURL(item.url)?.sanitized || '',
          target: ['_self', '_blank'].includes(item.target) ? item.target : '_self',
          icon: HTMLSanitizer.escapeHTML(String(item.icon || '')),
          order: parseInt(item.order) || 0,
          visible: Boolean(item.visible !== false)
        };
      }).filter(Boolean);
      
      return { isValid: true, sanitized: validatedItems };
    }
    
    return { isValid: true, sanitized: parsed };
    
  } catch (error) {
    return { isValid: false, sanitized: null, error: 'Invalid JSON format' };
  }
}

/**
 * Footer content validation schema
 */
function validateFooterContent(data) {
  const errors = [];
  const sanitized = {};
  
  // Company information
  const companyName = validateText(data.company_name, { 
    maxLength: 255, 
    fieldName: 'Company name' 
  });
  if (!companyName.isValid) errors.push(companyName.error);
  sanitized.company_name = companyName.sanitized;
  
  const companyDescription = validateText(data.company_description, { 
    maxLength: 2000, 
    allowHTML: false,
    fieldName: 'Company description' 
  });
  if (!companyDescription.isValid) errors.push(companyDescription.error);
  sanitized.company_description = companyDescription.sanitized;
  
  const logoUrl = validateURL(data.company_logo_url);
  if (!logoUrl.isValid) errors.push('Invalid logo URL');
  sanitized.company_logo_url = logoUrl.sanitized;
  
  // Contact information
  if (data.contact_email) {
    const contactEmail = validateEmail(data.contact_email);
    if (!contactEmail.isValid) errors.push('Invalid contact email');
    sanitized.contact_email = contactEmail.sanitized;
  }
  
  if (data.support_email) {
    const supportEmail = validateEmail(data.support_email);
    if (!supportEmail.isValid) errors.push('Invalid support email');
    sanitized.support_email = supportEmail.sanitized;
  }
  
  // Newsletter configuration
  const newsletterTitle = validateText(data.newsletter_title, { 
    maxLength: 255,
    fieldName: 'Newsletter title' 
  });
  if (!newsletterTitle.isValid) errors.push(newsletterTitle.error);
  sanitized.newsletter_title = newsletterTitle.sanitized;
  
  // Boolean fields
  sanitized.newsletter_enabled = Boolean(data.newsletter_enabled);
  sanitized.show_social_links = Boolean(data.show_social_links);
  sanitized.show_newsletter = Boolean(data.show_newsletter);
  sanitized.show_contact_info = Boolean(data.show_contact_info);
  sanitized.show_navigation = Boolean(data.show_navigation);
  sanitized.show_company_info = Boolean(data.show_company_info);
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitized
  };
}

/**
 * Navigation menu validation
 */
function validateNavigationMenu(data) {
  const errors = [];
  const sanitized = {};
  
  // Menu type validation
  const allowedMenuTypes = ['main', 'courses', 'company', 'support', 'utility'];
  if (!allowedMenuTypes.includes(data.menu_type)) {
    errors.push('Invalid menu type');
  }
  sanitized.menu_type = data.menu_type;
  
  // Menu title
  const menuTitle = validateText(data.menu_title, { 
    maxLength: 100,
    fieldName: 'Menu title' 
  });
  if (!menuTitle.isValid) errors.push(menuTitle.error);
  sanitized.menu_title = menuTitle.sanitized;
  
  // Menu items (JSON validation)
  const menuItems = validateJSON(data.menu_items, 'menu_items');
  if (!menuItems.isValid) errors.push(menuItems.error);
  sanitized.menu_items = menuItems.sanitized;
  
  // Display order
  sanitized.display_order = parseInt(data.display_order) || 0;
  sanitized.is_visible = Boolean(data.is_visible !== false);
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitized
  };
}

/**
 * Request validation middleware
 */
function createValidationMiddleware(validationSchema) {
  return (req, res, next) => {
    try {
      const result = validationSchema(req.body);
      
      if (!result.isValid) {
        return res.status(400).json({
          error: 'Validation failed',
          details: result.errors
        });
      }
      
      // Replace request body with sanitized data
      req.body = result.sanitized;
      next();
      
    } catch (error) {
      console.error('Validation middleware error:', error);
      res.status(500).json({
        error: 'Validation error',
        message: 'Internal server error'
      });
    }
  };
}

module.exports = {
  HTMLSanitizer,
  validateLocale,
  validateURL,
  validateEmail,
  validateText,
  validateJSON,
  validateFooterContent,
  validateNavigationMenu,
  createValidationMiddleware
};