/**
 * Shared Popup Component
 * A reusable contact form popup modal
 */

class ContactPopup {
  constructor() {
    this.popup = null;
    this.form = null;
    this.isInitialized = false;
    this.isSubmitting = false;

    // Bind methods
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleOverlayClick = this.handleOverlayClick.bind(this);
    this.handleEscapeKey = this.handleEscapeKey.bind(this);
  }

  /**
   * Initialize the popup component
   */
  init() {
    if (this.isInitialized) return;

    this.createPopupHTML();
    this.bindEvents();
    this.isInitialized = true;
  }

  /**
   * Create and inject popup HTML into the document
   */
  createPopupHTML() {
    // Check if popup already exists
    if (document.getElementById('contactPopup')) return;

    const popupHTML = `
      <!-- Contact Form Popup Modal -->
      <div id="contactPopup" class="popup-overlay">
        <div class="popup-container">
          <!-- Close Button -->
          <button class="popup-close" aria-label="Close popup">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>

          <!-- Popup Content -->
          <div class="popup-content">
            <!-- Header Section -->
            <div class="popup-header">
              <h2 class="popup-title" data-i18n="contact.content.title">Get In Touch</h2>
              <p class="popup-subtitle" data-i18n="contact.content.description">Let us know how we can help you on your learning journey</p>
            </div>

            <!-- Contact Form -->
            <form id="contactForm" class="contact-form">
              <!-- Name Field -->
              <div class="form-field">
                <label for="contactName" class="form-label">Your Name *</label>
                <input
                  type="text"
                  id="contactName"
                  name="name"
                  class="form-input"
                  placeholder="Enter Your Name"
                  required
                >
              </div>

              <!-- Email Field -->
              <div class="form-field">
                <label for="contactEmail" class="form-label">Email Address *</label>
                <input
                  type="email"
                  id="contactEmail"
                  name="email"
                  class="form-input"
                  placeholder="Ex. emailaddress@email.com"
                  required
                >
              </div>

              <!-- Subject Field -->
              <div class="form-field">
                <label for="contactSubject" class="form-label">Subject *</label>
                <input
                  type="text"
                  id="contactSubject"
                  name="subject"
                  class="form-input"
                  placeholder="Ex. Want Consultation"
                  required
                >
              </div>

              <!-- Message Field -->
              <div class="form-field">
                <label for="contactMessage" class="form-label">Your Message *</label>
                <textarea
                  id="contactMessage"
                  name="message"
                  class="form-textarea"
                  placeholder="Write what you want to share with us..."
                  rows="5"
                  required
                ></textarea>
              </div>

              <!-- Submit Button -->
              <div class="form-submit-wrapper">
                <button type="submit" class="primary-button form-submit-button">
                  <div class="primary-button-text-wrap">
                    <div class="primary-button-text-block" data-i18n="contact.content.submit_button">Send Message</div>
                    <div class="primary-button-text-block is-text-absolute" data-i18n="contact.content.submit_button">Send Message</div>
                  </div>
                </button>
              </div>

              <!-- Loading State -->
              <div id="formLoading" class="form-loading" style="display: none;">
                <div class="loading-spinner"></div>
                <span data-i18n="contact.content.sending_message">Sending message...</span>
              </div>

              <!-- Success Message -->
              <div id="formSuccess" class="form-message form-success" style="display: none;">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span data-i18n="contact.content.success_message">Message sent successfully! We'll get back to you soon.</span>
              </div>

              <!-- Error Message -->
              <div id="formError" class="form-message form-error" style="display: none;">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="#EF4444" stroke-width="2"/>
                  <path d="M10 6V10M10 14H10.01" stroke="#EF4444" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span data-i18n="contact.content.error_message">Sorry, there was an error sending your message. Please try again.</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;

    // Inject into document body
    document.body.insertAdjacentHTML('beforeend', popupHTML);

    // Get references
    this.popup = document.getElementById('contactPopup');
    this.form = document.getElementById('contactForm');
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    if (!this.popup || !this.form) return;

    // Close button
    const closeButton = this.popup.querySelector('.popup-close');
    if (closeButton) {
      closeButton.addEventListener('click', this.close);
    }

    // Overlay click to close
    this.popup.addEventListener('click', this.handleOverlayClick);

    // Form submission
    this.form.addEventListener('submit', this.handleSubmit);

    // Escape key to close
    document.addEventListener('keydown', this.handleEscapeKey);
  }

  /**
   * Open the popup
   */
  open() {
    if (!this.isInitialized) {
      this.init();
    }

    if (this.popup) {
      this.popup.classList.add('active');
      document.body.style.overflow = 'hidden';

      // Focus on first input
      const firstInput = this.popup.querySelector('#contactName');
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 300);
      }

      // Trigger custom event
      window.dispatchEvent(new CustomEvent('popupOpened', { detail: { popup: this } }));
    }
  }

  /**
   * Close the popup
   */
  close() {
    if (this.popup) {
      this.popup.classList.remove('active');
      document.body.style.overflow = '';

      // Reset form if not submitting
      if (!this.isSubmitting) {
        this.resetForm();
      }

      // Trigger custom event
      window.dispatchEvent(new CustomEvent('popupClosed', { detail: { popup: this } }));
    }
  }

  /**
   * Handle overlay click to close
   */
  handleOverlayClick(event) {
    if (event.target === this.popup) {
      this.close();
    }
  }

  /**
   * Handle escape key to close
   */
  handleEscapeKey(event) {
    if (event.key === 'Escape' && this.popup?.classList.contains('active')) {
      this.close();
    }
  }

  /**
   * Handle form submission
   */
  async handleSubmit(event) {
    event.preventDefault();

    if (this.isSubmitting) return;

    const formData = new FormData(this.form);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message')
    };

    // Validate data
    if (!this.validateFormData(data)) {
      this.showError('Please fill in all required fields.');
      return;
    }

    this.isSubmitting = true;
    this.showLoading();

    try {
      // Simulate form submission (replace with actual service later)
      await this.submitForm(data);
      this.showSuccess();

      // Close popup after delay
      setTimeout(() => {
        this.close();
      }, 2000);

    } catch (error) {
      console.error('Form submission error:', error);
      this.showError('Sorry, there was an error sending your message. Please try again.');
    } finally {
      this.isSubmitting = false;
      this.hideLoading();
    }
  }

  /**
   * Validate form data
   */
  validateFormData(data) {
    return data.name?.trim() &&
           data.email?.trim() &&
           data.subject?.trim() &&
           data.message?.trim() &&
           this.isValidEmail(data.email);
  }

  /**
   * Validate email format
   */
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Submit form data using EmailJS service
   */
  async submitForm(data) {
    try {
      // Check if email service is available
      if (!window.emailService) {
        throw new Error('Email service not available. Please ensure emailService.js is loaded.');
      }

      // Transform popup form data to email service format
      const emailData = {
        fullName: data.name,
        phoneNumber: data.email, // Email goes to phoneNumber field for contact purposes
        message: `Subject: ${data.subject}\n\n${data.message}`
      };

      console.log('Sending email with transformed data:', emailData);

      // Send email using the existing email service
      const result = await window.emailService.sendContactEmail(emailData);

      if (result.success) {
        console.log('Email sent successfully:', result);

        // Trigger custom event with form data
        window.dispatchEvent(new CustomEvent('formSubmitted', {
          detail: {
            data,
            emailResult: result,
            popup: this
          }
        }));

        return result;
      } else {
        throw new Error(result.message || 'Failed to send email');
      }

    } catch (error) {
      console.error('Email submission error:', error);

      // If email fails, offer WhatsApp fallback
      if (window.emailService && window.emailService.openWhatsApp) {
        console.log('Email failed, WhatsApp fallback available');

        // Store the data for potential WhatsApp fallback
        this.lastFormData = {
          fullName: data.name,
          phoneNumber: data.email,
          message: `Subject: ${data.subject}\n\n${data.message}`
        };
      }

      throw error;
    }
  }

  /**
   * Show loading state
   */
  showLoading() {
    this.hideMessages();
    const loading = this.popup?.querySelector('#formLoading');
    if (loading) loading.style.display = 'flex';
  }

  /**
   * Hide loading state
   */
  hideLoading() {
    const loading = this.popup?.querySelector('#formLoading');
    if (loading) loading.style.display = 'none';
  }

  /**
   * Show success message
   */
  showSuccess() {
    this.hideMessages();
    const success = this.popup?.querySelector('#formSuccess');
    if (success) success.style.display = 'flex';
  }

  /**
   * Show error message
   */
  showError(message) {
    this.hideMessages();
    const error = this.popup?.querySelector('#formError');
    if (error) {
      const messageSpan = error.querySelector('span');
      if (messageSpan) {
        messageSpan.textContent = message;

        // Add WhatsApp fallback if available and we have form data
        if (this.lastFormData && window.emailService && window.emailService.openWhatsApp) {
          messageSpan.innerHTML = `
            ${message}<br><br>
            <button class="whatsapp-fallback-btn" onclick="window.ContactPopup.useWhatsAppFallback()" style="
              background: #25d366;
              color: white;
              border: none;
              border-radius: 8px;
              padding: 8px 16px;
              cursor: pointer;
              font-size: 12px;
              margin-top: 8px;
            ">
              📱 Send via WhatsApp Instead
            </button>
          `;
        }
      }
      error.style.display = 'flex';
    }
  }

  /**
   * Hide all messages
   */
  hideMessages() {
    const messages = this.popup?.querySelectorAll('.form-message, .form-loading');
    messages?.forEach(msg => msg.style.display = 'none');
  }

  /**
   * Reset form
   */
  resetForm() {
    if (this.form) {
      this.form.reset();
      this.hideMessages();
      this.lastFormData = null; // Clear stored form data
    }
  }

  /**
   * Use WhatsApp fallback when email fails
   */
  useWhatsAppFallback() {
    if (this.lastFormData && window.emailService && window.emailService.openWhatsApp) {
      window.emailService.openWhatsApp(this.lastFormData);
      this.showSuccess();

      // Update success message for WhatsApp
      const success = this.popup?.querySelector('#formSuccess span');
      if (success) {
        success.textContent = 'WhatsApp opened! Please send the pre-filled message.';
      }

      // Close popup after delay
      setTimeout(() => {
        this.close();
      }, 3000);
    }
  }

  /**
   * Destroy the popup
   */
  destroy() {
    if (this.popup) {
      this.popup.remove();
    }
    document.removeEventListener('keydown', this.handleEscapeKey);
    this.isInitialized = false;
  }
}

// Create global instance
window.ContactPopup = new ContactPopup();

// Auto-initialize on DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.ContactPopup.init();
  });
} else {
  window.ContactPopup.init();
}

// Helper function for easy access
window.openContactPopup = () => window.ContactPopup.open();
window.closeContactPopup = () => window.ContactPopup.close();