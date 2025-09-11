// Contact Form Modal System
(function() {
  'use strict';

  // Create modal HTML structure
  const modalHTML = `
    <div id="contactModal" class="contact-modal">
      <div class="contact-modal-overlay"></div>
      <div class="contact-modal-container">
        <div class="contact-modal-content">
          <button class="contact-modal-close" aria-label="Close modal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          
          <div class="contact-modal-header">
            <h2 class="contact-modal-title">Get Started Today</h2>
            <p class="contact-modal-subtitle">Fill out the form and we'll contact you via WhatsApp</p>
          </div>
          
          <form id="contactForm" class="contact-form">
            <div class="form-group">
              <label for="fullName" class="form-label">Full Name</label>
              <input 
                type="text" 
                id="fullName" 
                name="fullName" 
                class="form-input" 
                placeholder="Enter your full name"
                required
              />
              <span class="form-error" id="nameError"></span>
            </div>
            
            <div class="form-group">
              <label for="phoneNumber" class="form-label">Phone Number</label>
              <input 
                type="tel" 
                id="phoneNumber" 
                name="phoneNumber" 
                class="form-input" 
                placeholder="+1 234 567 8900"
                required
              />
              <span class="form-error" id="phoneError"></span>
            </div>
            
            <div class="form-group">
              <label for="message" class="form-label">Message</label>
              <textarea 
                id="message" 
                name="message" 
                class="form-textarea" 
                rows="4" 
                placeholder="Tell us about your learning goals..."
                required
              ></textarea>
              <span class="form-error" id="messageError"></span>
            </div>
            
            <button type="submit" class="form-submit-btn">
              <span class="btn-text">Send Message</span>
              <span class="btn-loader" style="display: none;">
                <svg class="spinner" width="20" height="20" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="50" stroke-dashoffset="10">
                    <animateTransform attributeName="transform" type="rotate" from="0 10 10" to="360 10 10" dur="1s" repeatCount="indefinite"/>
                  </circle>
                </svg>
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
    
    <div id="toast" class="toast">
      <div class="toast-content">
        <svg class="toast-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 0C4.5 0 0 4.5 0 10s4.5 10 10 10 10-4.5 10-10S15.5 0 10 0zm-1 15l-5-5 1.5-1.5L9 12l7-7 1.5 1.5L9 15z" fill="currentColor"/>
        </svg>
        <span class="toast-message">Message sent successfully!</span>
      </div>
    </div>
  `;

  // Create styles
  const styles = `
    <style>
      /* Modal Styles */
      .contact-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        display: none;
        animation: fadeIn 0.3s ease;
      }
      
      .contact-modal.active {
        display: block;
      }
      
      .contact-modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(5, 5, 26, 0.8);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
      }
      
      .contact-modal-container {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }
      
      .contact-modal-content {
        position: relative;
        width: 100%;
        max-width: 480px;
        background: linear-gradient(135deg, rgba(13, 13, 46, 0.95) 0%, rgba(5, 5, 26, 0.95) 100%);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 24px;
        padding: 40px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        animation: slideUp 0.4s ease;
        overflow: hidden;
      }
      
      .contact-modal-content::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
        animation: shimmer 3s infinite;
      }
      
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      
      .contact-modal-close {
        position: absolute;
        top: 20px;
        right: 20px;
        width: 36px;
        height: 36px;
        border: none;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 50%;
        color: rgba(255, 255, 255, 0.6);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        z-index: 1;
      }
      
      .contact-modal-close:hover {
        background: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.9);
        transform: rotate(90deg);
      }
      
      .contact-modal-header {
        margin-bottom: 32px;
        text-align: center;
      }
      
      .contact-modal-title {
        font-size: 28px;
        font-weight: 700;
        color: #ffffff;
        margin: 0 0 8px 0;
        font-family: "Plus Jakarta Sans", sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      .contact-modal-subtitle {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.6);
        margin: 0;
        font-family: "Plus Jakarta Sans", sans-serif;
      }
      
      /* Form Styles */
      .contact-form {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }
      
      .form-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      
      .form-label {
        font-size: 14px;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.9);
        font-family: "Plus Jakarta Sans", sans-serif;
      }
      
      .form-input,
      .form-textarea {
        width: 100%;
        padding: 12px 16px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        color: #ffffff;
        font-size: 14px;
        font-family: "Plus Jakarta Sans", sans-serif;
        transition: all 0.3s ease;
        outline: none;
      }
      
      .form-input::placeholder,
      .form-textarea::placeholder {
        color: rgba(255, 255, 255, 0.4);
      }
      
      .form-input:focus,
      .form-textarea:focus {
        background: rgba(255, 255, 255, 0.08);
        border-color: #667eea;
        box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
      }
      
      .form-textarea {
        resize: vertical;
        min-height: 100px;
      }
      
      .form-error {
        font-size: 12px;
        color: #ff6b6b;
        display: none;
      }
      
      .form-error.active {
        display: block;
      }
      
      .form-submit-btn {
        width: 100%;
        padding: 14px 24px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        border-radius: 12px;
        color: #ffffff;
        font-size: 16px;
        font-weight: 600;
        font-family: "Plus Jakarta Sans", sans-serif;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }
      
      .form-submit-btn::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.5s;
      }
      
      .form-submit-btn:hover::before {
        left: 100%;
      }
      
      .form-submit-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
      }
      
      .form-submit-btn:active {
        transform: translateY(0);
      }
      
      .form-submit-btn.loading {
        pointer-events: none;
        opacity: 0.8;
      }
      
      .spinner {
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      
      /* Toast Styles */
      .toast {
        position: fixed;
        bottom: -100px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10001;
        transition: bottom 0.4s ease;
      }
      
      .toast.active {
        bottom: 30px;
      }
      
      .toast-content {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px 24px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 50px;
        box-shadow: 0 10px 40px rgba(102, 126, 234, 0.4);
        color: #ffffff;
        font-size: 14px;
        font-weight: 500;
        font-family: "Plus Jakarta Sans", sans-serif;
        animation: slideUp 0.4s ease;
      }
      
      .toast-icon {
        flex-shrink: 0;
      }
      
      /* Animations */
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      /* Responsive Design */
      @media (max-width: 640px) {
        .contact-modal-content {
          padding: 30px 20px;
          border-radius: 20px;
        }
        
        .contact-modal-title {
          font-size: 24px;
        }
        
        .form-input,
        .form-textarea {
          padding: 10px 14px;
          font-size: 16px; /* Prevent zoom on iOS */
        }
        
        .form-submit-btn {
          padding: 12px 20px;
          font-size: 14px;
        }
      }
      
      /* RTL Support for Hebrew */
      html[dir="rtl"] .contact-modal-content {
        text-align: right;
      }
      
      html[dir="rtl"] .contact-modal-close {
        left: 20px;
        right: auto;
      }
      
      html[dir="rtl"] .contact-form {
        direction: rtl;
      }
    </style>
  `;

  // Initialize modal system
  function initContactModal() {
    // Add HTML and styles to page
    if (!document.getElementById('contactModal')) {
      document.head.insertAdjacentHTML('beforeend', styles);
      document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    const modal = document.getElementById('contactModal');
    const form = document.getElementById('contactForm');
    const toast = document.getElementById('toast');
    const closeBtn = document.querySelector('.contact-modal-close');
    const overlay = document.querySelector('.contact-modal-overlay');

    // Form validation patterns
    const validators = {
      fullName: (value) => {
        if (!value.trim()) return 'Full name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        return '';
      },
      phoneNumber: (value) => {
        if (!value.trim()) return 'Phone number is required';
        const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
        if (!phoneRegex.test(value)) return 'Please enter a valid phone number';
        return '';
      },
      message: (value) => {
        if (!value.trim()) return 'Message is required';
        if (value.trim().length < 10) return 'Message must be at least 10 characters';
        return '';
      }
    };

    // Show modal function
    function showModal() {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      // Reset form
      form.reset();
      clearErrors();
    }

    // Hide modal function
    function hideModal() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }

    // Show toast notification
    function showToast(message) {
      const toastMessage = toast.querySelector('.toast-message');
      toastMessage.textContent = message;
      toast.classList.add('active');
      
      setTimeout(() => {
        toast.classList.remove('active');
      }, 3000);
    }

    // Clear error messages
    function clearErrors() {
      document.querySelectorAll('.form-error').forEach(error => {
        error.textContent = '';
        error.classList.remove('active');
      });
    }

    // Validate field
    function validateField(field) {
      const errorElement = document.getElementById(field.name + 'Error');
      if (!errorElement) return true; // Skip if error element doesn't exist
      
      const validator = validators[field.name];
      if (!validator) return true; // Skip if no validator exists
      
      const errorMessage = validator(field.value);
      
      if (errorMessage) {
        errorElement.textContent = errorMessage;
        errorElement.classList.add('active');
        field.style.borderColor = '#ff6b6b';
        return false;
      } else {
        errorElement.textContent = '';
        errorElement.classList.remove('active');
        field.style.borderColor = '';
        return true;
      }
    }

    // Real-time validation
    if (form.fullName) form.fullName.addEventListener('blur', () => validateField(form.fullName));
    if (form.phoneNumber) form.phoneNumber.addEventListener('blur', () => validateField(form.phoneNumber));
    if (form.message) form.message.addEventListener('blur', () => validateField(form.message));

    // Form submission
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Validate all fields
      const isNameValid = validateField(form.fullName);
      const isPhoneValid = validateField(form.phoneNumber);
      const isMessageValid = validateField(form.message);
      
      if (!isNameValid || !isPhoneValid || !isMessageValid) {
        return;
      }
      
      // Get form data
      const fullName = form.fullName.value.trim();
      const phoneNumber = form.phoneNumber.value.trim();
      const message = form.message.value.trim();
      
      // Show loading state
      const submitBtn = form.querySelector('.form-submit-btn');
      const btnText = submitBtn.querySelector('.btn-text');
      const btnLoader = submitBtn.querySelector('.btn-loader');
      
      submitBtn.classList.add('loading');
      btnText.style.display = 'none';
      btnLoader.style.display = 'inline-flex';
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Format message for WhatsApp
      const whatsappMessage = encodeURIComponent(
        `🎓 *New Contact from AI Studio*\n\n` +
        `👤 *Name:* ${fullName}\n` +
        `📱 *Phone:* ${phoneNumber}\n` +
        `💬 *Message:* ${message}\n\n` +
        `📅 *Date:* ${new Date().toLocaleString()}`
      );
      
      // WhatsApp URL (works on both mobile and desktop)
      const whatsappNumber = '972544345287'; // Remove + for WhatsApp URL
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
      
      // Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank');
      
      // Reset loading state
      submitBtn.classList.remove('loading');
      btnText.style.display = 'inline';
      btnLoader.style.display = 'none';
      
      // Show success toast
      showToast('Message sent successfully! Opening WhatsApp...');
      
      // Close modal after delay
      setTimeout(() => {
        hideModal();
      }, 1500);
    });

    // Close modal handlers
    closeBtn.addEventListener('click', hideModal);
    overlay.addEventListener('click', hideModal);
    
    // ESC key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        hideModal();
      }
    });

    // Intercept all "Sign Up Today" button clicks
    document.addEventListener('click', (e) => {
      const target = e.target.closest('a[href*="sign-up.html"], a[href*="sign-in.html"]');
      
      if (target && (
        target.textContent.includes('Sign Up') || 
        target.textContent.includes('Sign In') ||
        target.querySelector('.primary-button-text-block')
      )) {
        e.preventDefault();
        showModal();
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactModal);
  } else {
    initContactModal();
  }
})();