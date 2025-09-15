// Contact Form Modal System
(function() {
  'use strict';

  // Create modal HTML structure with Hebrew support
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
            <h2 class="contact-modal-title">שלטו ב-AI וטכנולוגיה</h2>
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
                placeholder="Enter your name"
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
                placeholder="Enter your phone"
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
                placeholder="Enter your message"
                required
              ></textarea>
              <span class="form-error" id="messageError"></span>
            </div>

            <button type="submit" class="form-submit-btn">
              <span class="btn-text">Submit</span>
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
        <svg class="toast-icon error-icon" style="display:none;" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 0C4.5 0 0 4.5 0 10s4.5 10 10 10 10-4.5 10-10S15.5 0 10 0zm5 13.59L13.59 15 10 11.41 6.41 15 5 13.59 8.59 10 5 6.41 6.41 5 10 8.59 13.59 5 15 6.41 11.41 10 15 13.59z" fill="currentColor"/>
        </svg>
        <svg class="toast-icon success-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
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
      
      .toast.error .toast-content {
        background: linear-gradient(135deg, #f56565 0%, #c53030 100%);
        box-shadow: 0 10px 40px rgba(245, 101, 101, 0.4);
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

  // Global variables for modal system
  let modalInitialized = false;
  
  // Initialize modal system
  function initContactModal() {
    // Skip if already initialized
    if (modalInitialized) return;
    
    // Initialize EmailJS with your public key - wait for it to be ready
    if (typeof emailjs !== 'undefined') {
      console.log('EmailJS object found:', emailjs);
      try {
        // Method 1: Direct string (most reliable)
        emailjs.init('TgAbmI0ROiUaACG34');
        console.log('EmailJS initialized with direct string method');
        window.emailJSReady = true;
      } catch (e) {
        console.error('Direct string init failed:', e);
        // Method 2: Object with publicKey (for newer versions)
        try {
          emailjs.init({
            publicKey: 'TgAbmI0ROiUaACG34',
          });
          console.log('EmailJS initialized with object method');
          window.emailJSReady = true;
        } catch (e2) {
          console.error('All EmailJS init methods failed:', e2);
          // Method 3: Try the init method from older versions
          try {
            if (emailjs.init && typeof emailjs.init === 'function') {
              emailjs.init('user_TgAbmI0ROiUaACG34'); // Try with user_ prefix
              console.log('EmailJS initialized with user_ prefix');
              window.emailJSReady = true;
            } else {
              throw new Error('No valid init method found');
            }
          } catch (e3) {
            console.error('Final EmailJS init attempt failed:', e3);
            window.emailJSReady = false;
          }
        }
      }
    } else {
      console.error('EmailJS library not loaded - check if script is included');
      console.log('Current script tags:', Array.from(document.querySelectorAll('script[src*="emailjs"]')).map(s => s.src));
      window.emailJSReady = false;
    }

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
    
    modalInitialized = true;

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

    // Show toast notification with proper icons
    function showToast(message, type = 'success') {
      const toastMessage = toast.querySelector('.toast-message');
      const errorIcon = toast.querySelector('.error-icon');
      const successIcon = toast.querySelector('.success-icon');

      toastMessage.textContent = message;
      toast.classList.remove('success', 'error');
      toast.classList.add('active', type);

      // Show appropriate icon
      if (type === 'error') {
        errorIcon.style.display = 'block';
        successIcon.style.display = 'none';
      } else {
        errorIcon.style.display = 'none';
        successIcon.style.display = 'block';
      }

      // Error messages stay longer
      const duration = type === 'error' ? 4000 : 3000;

      setTimeout(() => {
        toast.classList.remove('active');
      }, duration);
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

    // Form submission handler with consultation API integration
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

      // Prepare consultation data for API
      const consultationData = {
        name: fullName,
        email: 'not-provided@example.com', // Default email since form doesn't have email field
        phone: phoneNumber,
        interest: 'general', // Default interest
        experience: 'unknown', // Default experience
        message: message // Include message in API data
      };

      try {
        // Send to consultation API first (same as consultation form)
        const apiUrl = window.location.hostname === 'localhost'
          ? 'http://localhost:3000/api/consultations'
          : 'https://aistudio555jamstack-production.up.railway.app/api/consultations';

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(consultationData)
        });

        if (response.ok) {
          console.log('Consultation submitted to database successfully');

          // Try to send email notification via EmailJS
          try {
            if (typeof emailjs !== 'undefined' && window.emailJSReady) {
              const templateParams = {
                to_name: 'AI Studio Team',
                from_name: fullName,
                from_email: phoneNumber, // Using phone as email field
                phone: phoneNumber,
                message: `New contact form submission from ${fullName}\n\nPhone: ${phoneNumber}\n\nMessage: ${message}`
              };

              await emailjs.send('service_t2uqbxs', 'template_consultation', templateParams, 'YOUR_USER_ID');
              console.log('Email notification sent successfully');
            }
          } catch (emailError) {
            console.error('EmailJS error (non-critical):', emailError);
          }

          // Always show error toaster as requested
          showToast('Mail NOT SENT', 'error');

          // Reset form
          form.reset();

          // Don't close modal immediately - let user see the error message
          setTimeout(() => {
            // Optionally show WhatsApp option
            showSuccessWithWhatsApp(fullName, phoneNumber, message);
          }, 2000);

        } else {
          throw new Error('Failed to save consultation');
        }

      } catch (error) {
        console.error('Form submission error:', error);

        // Show error toaster
        showToast('Mail NOT SENT', 'error');

        // Still provide WhatsApp fallback option
        setTimeout(() => {
          showSuccessWithWhatsApp(fullName, phoneNumber, message);
        }, 2000);
      } finally {
        // Reset loading state
        submitBtn.classList.remove('loading');
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
      }
    });
    
    // Function to open WhatsApp
    function openWhatsApp(fullName, phoneNumber, message) {
      const whatsappMessage = encodeURIComponent(
        `🎓 *New Contact from AI Studio*\n\n` +
        `👤 *Name:* ${fullName}\n` +
        `📱 *Phone:* ${phoneNumber}\n` +
        `💬 *Message:* ${message}\n\n` +
        `📅 *Date:* ${new Date().toLocaleString()}`
      );
      
      const whatsappNumber = '972544345287';
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
      window.open(whatsappUrl, '_blank');
    }
    
    // Function to show success with WhatsApp option
    function showSuccessWithWhatsApp(fullName, phoneNumber, message) {
      // Update modal content to show success message
      const modalContent = document.querySelector('.contact-modal-content');
      modalContent.innerHTML = `
        <button class="contact-modal-close" aria-label="Close modal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div style="text-align: center; padding: 40px 20px;">
          <div style="width: 80px; height: 80px; margin: 0 auto 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>
          
          <h2 style="font-size: 28px; color: #ffffff; margin-bottom: 12px; font-weight: 700;">Message Sent!</h2>
          <p style="color: rgba(255,255,255,0.7); margin-bottom: 32px; font-size: 16px;">
            We've received your message and will respond soon.
          </p>
          
          <button onclick="window.openWhatsApp('${fullName}', '${phoneNumber}', '${message}')" 
                  style="background: #25D366; color: white; border: none; padding: 14px 32px; border-radius: 50px; font-size: 16px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 10px; transition: transform 0.2s;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.5 15.5c-.951.951-2.05 1.696-3.268 2.214-1.258.536-2.594.807-3.972.807-1.378 0-2.714-.271-3.972-.807-1.218-.518-2.317-1.263-3.268-2.214-.951-.951-1.696-2.05-2.214-3.268C.271 14.714 0 13.378 0 12s.271-2.714.807-3.972c.518-1.218 1.263-2.317 2.214-3.268.951-.951 2.05-1.696 3.268-2.214C7.286.271 8.622 0 10 0s2.714.271 3.972.807c1.218.518 2.317 1.263 3.268 2.214.951.951 1.696 2.05 2.214 3.268.536 1.258.807 2.594.807 3.972s-.271 2.714-.807 3.972c-.518 1.218-1.263 2.317-2.214 3.268z"/>
            </svg>
            Also Contact via WhatsApp
          </button>
          
          <p style="color: rgba(255,255,255,0.5); margin-top: 20px; font-size: 14px;">
            Or call us directly: +972-54-434-5287
          </p>
        </div>
      `;
      
      // Re-attach close button handler
      const newCloseBtn = modalContent.querySelector('.contact-modal-close');
      if (newCloseBtn) {
        newCloseBtn.addEventListener('click', hideModal);
      }
      
      // Make openWhatsApp function available globally for the button
      window.openWhatsApp = openWhatsApp;
      
      // Show success toast
      showToast('Message sent successfully!');
    }

    // Close modal handlers
    closeBtn.addEventListener('click', hideModal);
    overlay.addEventListener('click', hideModal);
    
    // ESC key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        hideModal();
      }
    });
    
    // Function to reset modal back to form view
    function resetModalToForm() {
      const modalContent = document.querySelector('.contact-modal-content');
      if (modalContent && !document.getElementById('contactForm')) {
        // Restore original form HTML
        modalContent.innerHTML = `
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
        `;
        
        // Re-initialize form after restoring HTML
        setTimeout(() => {
          initContactModal();
        }, 100);
      }
    }
  }

  // Global functions that need to be accessible
  window.showModal = function() {
    // Initialize modal if not already done
    if (!modalInitialized) {
      initContactModal();
    }
    
    const modal = document.getElementById('contactModal');
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };
  
  window.hideModal = function() {
    const modal = document.getElementById('contactModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };
  
  window.resetModalToForm = function() {
    const modalContent = document.querySelector('.contact-modal-content');
    if (modalContent && !document.getElementById('contactForm')) {
      // Restore original form HTML
      modalContent.innerHTML = `
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
      `;
      
      // Re-bind form events
      modalInitialized = false;
      initContactModal();
    }
  };
  
  // Initialize when both DOM and EmailJS are ready
  function waitForEmailJS(attempts = 0) {
    console.log(`Waiting for EmailJS, attempt ${attempts + 1}/50, emailjs available: ${typeof emailjs !== 'undefined'}`);
    
    if (typeof emailjs !== 'undefined') {
      console.log('EmailJS library found, initializing modal');
      initContactModal();
    } else if (attempts < 50) { // Max 5 seconds wait
      // Wait a bit more for EmailJS to load
      setTimeout(() => waitForEmailJS(attempts + 1), 100);
    } else {
      // Try to load EmailJS manually if it's not available
      console.warn('EmailJS not loaded after 5 seconds, attempting manual load...');
      loadEmailJSManually().then(() => {
        console.log('Manual EmailJS load successful');
        initContactModal();
      }).catch(error => {
        console.error('Manual EmailJS load failed:', error);
        console.log('Available global objects:', Object.keys(window).filter(key => key.toLowerCase().includes('email')));
        initContactModal();
      });
    }
  }
  
  // Function to manually load EmailJS if needed
  function loadEmailJSManually() {
    return new Promise((resolve, reject) => {
      if (typeof emailjs !== 'undefined') {
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
      script.type = 'text/javascript';
      
      script.onload = () => {
        console.log('EmailJS manually loaded');
        // Give it a moment to initialize
        setTimeout(() => {
          if (typeof emailjs !== 'undefined') {
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
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForEmailJS);
  } else {
    waitForEmailJS();
  }
  
  // Global click handler for Sign Up buttons - OUTSIDE init function
  document.addEventListener('click', function(e) {
    // Check if click is on a sign up/sign in button or its children
    const target = e.target.closest('a, .primary-button');
    
    if (target && target.tagName === 'A') {
      const href = target.getAttribute('href') || '';
      const text = target.textContent || '';
      
      // Exclude navigation buttons that should work normally
      if (href.includes('courses.html') || 
          text.includes('Uncover All Courses') ||
          text.includes('View All Courses') ||
          text.includes('Browse Courses')) {
        // Let these buttons navigate normally
        return;
      }
      
      // Check if it's a sign up/sign in link
      if (href.includes('sign-up') ||
          href.includes('sign-in') ||
          href.includes('authentication-pages') ||
          target.classList.contains('primary-button') ||
          text.includes('Sign Up') ||
          text.includes('Sign In') ||
          text.includes('Get Started') ||
          text.includes('הרשמו היום') || // Hebrew: Sign up today
          text.includes('הרשמה') || // Hebrew: Registration
          text.includes('התחילו היום')) { // Hebrew: Start today
        
        e.preventDefault();
        e.stopPropagation();
        
        // Initialize modal if not already done
        if (!modalInitialized) {
          initContactModal();
        }
        
        // Reset modal to form view if needed
        window.resetModalToForm();
        
        // Show the modal
        window.showModal();
        
        return false;
      }
    }
  }, true); // Use capture phase to intercept before other handlers
})();