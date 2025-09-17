// EmailJS Service for Contact Forms
// Configuration from AI Studio legacy system

class EmailService {
  constructor() {
    this.config = {
      publicKey: 'TgAbmI0ROiUaACG34',
      serviceId: 'service_kw2tzof',
      templateId: 'template_ux5c6f5',
      whatsappNumber: '972544345287'
    };

    this.isInitialized = false;
    this.isEmailJSLoaded = false;
  }

  // Initialize EmailJS
  async init() {
    if (this.isInitialized) return true;

    try {
      // Check if EmailJS is available
      if (typeof emailjs === 'undefined') {
        console.log('EmailJS not found, loading manually...');
        await this.loadEmailJS();
      }

      // Initialize EmailJS with multiple fallback methods
      await this.initializeEmailJS();

      this.isInitialized = true;
      console.log('EmailJS initialized successfully');
      return true;
    } catch (error) {
      console.error('EmailJS initialization failed:', error);
      this.isInitialized = false;
      return false;
    }
  }

  // Load EmailJS library manually if needed
  loadEmailJS() {
    return new Promise((resolve, reject) => {
      if (typeof emailjs !== 'undefined') {
        this.isEmailJSLoaded = true;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
      script.type = 'text/javascript';

      script.onload = () => {
        console.log('EmailJS loaded manually');
        setTimeout(() => {
          if (typeof emailjs !== 'undefined') {
            this.isEmailJSLoaded = true;
            resolve();
          } else {
            reject(new Error('EmailJS still not available after manual load'));
          }
        }, 100);
      };

      script.onerror = () => {
        reject(new Error('Failed to load EmailJS script'));
      };

      document.head.appendChild(script);
    });
  }

  // Initialize EmailJS with multiple methods
  async initializeEmailJS() {
    if (!this.isEmailJSLoaded && typeof emailjs === 'undefined') {
      throw new Error('EmailJS library not loaded');
    }

    // Method 1: Direct string (most reliable)
    try {
      emailjs.init(this.config.publicKey);
      console.log('EmailJS initialized with direct string method');
      return;
    } catch (e) {
      console.warn('Direct string init failed:', e);
    }

    // Method 2: Object with publicKey (newer versions)
    try {
      emailjs.init({ publicKey: this.config.publicKey });
      console.log('EmailJS initialized with object method');
      return;
    } catch (e) {
      console.warn('Object method init failed:', e);
    }

    // Method 3: Legacy user_ prefix
    try {
      emailjs.init('user_' + this.config.publicKey);
      console.log('EmailJS initialized with user_ prefix');
      return;
    } catch (e) {
      console.warn('User prefix method failed:', e);
      throw new Error('All EmailJS initialization methods failed');
    }
  }

  // Send email with contact form data
  async sendContactEmail(formData) {
    const { fullName, phoneNumber, message } = formData;

    // Validate input
    if (!fullName || !phoneNumber || !message) {
      throw new Error('Missing required fields: fullName, phoneNumber, message');
    }

    // Initialize if not already done
    if (!this.isInitialized) {
      const initialized = await this.init();
      if (!initialized) {
        throw new Error('Failed to initialize EmailJS service');
      }
    }

    // Prepare template parameters
    const templateParams = {
      name: fullName,
      email: phoneNumber, // Phone goes in email field for template compatibility
      message: message,
      title: 'New Contact Form Submission',
      timestamp: new Date().toLocaleString()
    };

    try {
      console.log('Sending email with params:', templateParams);

      const response = await emailjs.send(
        this.config.serviceId,
        this.config.templateId,
        templateParams
      );

      console.log('Email sent successfully:', response);

      return {
        success: true,
        response: response,
        message: 'Email sent successfully!'
      };

    } catch (error) {
      console.error('Email sending failed:', error);

      return {
        success: false,
        error: error,
        message: error.text || error.message || 'Failed to send email'
      };
    }
  }

  // Generate WhatsApp message
  generateWhatsAppMessage(formData) {
    const { fullName, phoneNumber, message } = formData;

    return encodeURIComponent(
      `🎓 *New Contact from AI Studio*\n\n` +
      `👤 *Name:* ${fullName}\n` +
      `📱 *Phone:* ${phoneNumber}\n` +
      `💬 *Message:* ${message}\n\n` +
      `📅 *Date:* ${new Date().toLocaleString()}`
    );
  }

  // Open WhatsApp with pre-filled message
  openWhatsApp(formData) {
    const whatsappMessage = this.generateWhatsAppMessage(formData);
    const whatsappUrl = `https://wa.me/${this.config.whatsappNumber}?text=${whatsappMessage}`;
    window.open(whatsappUrl, '_blank');
  }

  // Send test email
  async sendTestEmail(toEmail = 'test@example.com') {
    const testData = {
      fullName: 'Test User',
      phoneNumber: '+1-234-567-8900',
      message: 'This is a test email from the EmailService.'
    };

    try {
      const result = await this.sendContactEmail(testData);

      if (result.success) {
        console.log('✅ Test email sent successfully');
        return {
          success: true,
          message: 'Test email sent successfully',
          details: result
        };
      } else {
        console.error('❌ Test email failed:', result.message);
        return {
          success: false,
          message: 'Test email failed: ' + result.message,
          error: result.error
        };
      }
    } catch (error) {
      console.error('❌ Test email error:', error);
      return {
        success: false,
        message: 'Test email error: ' + error.message,
        error: error
      };
    }
  }

  // Get service status
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      isEmailJSLoaded: this.isEmailJSLoaded,
      emailJSAvailable: typeof emailjs !== 'undefined',
      config: {
        publicKey: this.config.publicKey.substring(0, 8) + '...',
        serviceId: this.config.serviceId,
        templateId: this.config.templateId,
        whatsappNumber: this.config.whatsappNumber
      }
    };
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EmailService;
}

// Global instance for browser use
window.EmailService = EmailService;
window.emailService = new EmailService();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.emailService.init().catch(console.error);
  });
} else {
  // DOM already ready, initialize immediately
  window.emailService.init().catch(console.error);
}