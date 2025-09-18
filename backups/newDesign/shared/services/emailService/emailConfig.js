// Email Service Configuration
// Extracted from AI Studio legacy system

const EMAIL_CONFIG = {
  // EmailJS Configuration
  EMAILJS: {
    PUBLIC_KEY: 'TgAbmI0ROiUaACG34',
    SERVICE_ID: 'service_kw2tzof',
    TEMPLATE_ID: 'template_ux5c6f5',
    CDN_URL: 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js'
  },

  // WhatsApp Configuration
  WHATSAPP: {
    NUMBER: '972544345287',
    BASE_URL: 'https://wa.me/'
  },

  // Form Validation Rules
  VALIDATION: {
    NAME: {
      MIN_LENGTH: 2,
      MAX_LENGTH: 50,
      REQUIRED: true
    },
    PHONE: {
      PATTERN: /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/,
      REQUIRED: true
    },
    MESSAGE: {
      MIN_LENGTH: 10,
      MAX_LENGTH: 500,
      REQUIRED: true
    }
  },

  // Email Template Parameters Mapping
  TEMPLATE_MAPPING: {
    name: 'fullName',
    email: 'phoneNumber', // Phone number goes to email field for template compatibility
    message: 'message',
    title: () => 'New Contact Form Submission',
    timestamp: () => new Date().toLocaleString()
  },

  // Service Settings
  SETTINGS: {
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // ms
    TIMEOUT: 10000, // ms
    AUTO_WHATSAPP_FALLBACK: true,
    DEBUG_MODE: process.env.NODE_ENV === 'development'
  }
};

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EMAIL_CONFIG;
}

if (typeof window !== 'undefined') {
  window.EMAIL_CONFIG = EMAIL_CONFIG;
}