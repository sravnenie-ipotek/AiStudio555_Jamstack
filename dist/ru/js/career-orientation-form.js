/**
 * CAREER ORIENTATION FORM SUBMISSION HANDLER
 * Integrates with EmailService for career consultation requests
 */

(function() {
    'use strict';

    // Initialize form submission handler when DOM is ready
    function initCareerOrientationForm() {
        console.log('🎯 Initializing career orientation form...');

        const form = document.querySelector('.contact-us-form');
        if (!form) {
            console.log('❌ Career orientation form not found');
            return;
        }

        // Add form submission handler
        form.addEventListener('submit', handleFormSubmission);
        console.log('✅ Career orientation form handler attached');
    }

    // Handle form submission
    async function handleFormSubmission(event) {
        event.preventDefault();
        console.log('📤 Career orientation form submitted');

        const form = event.target;
        const submitButton = form.querySelector('.contact-us-form-submit-button');

        // Disable submit button and show loading state
        const originalButtonText = submitButton.value;
        submitButton.disabled = true;
        submitButton.value = 'Sending...';

        try {
            // Extract form data
            const formData = extractFormData(form);
            console.log('📋 Form data extracted:', formData);

            // Validate required fields
            if (!validateFormData(formData)) {
                throw new Error('Please fill in all required fields');
            }

            // Check if EmailService is available
            if (typeof window.emailService === 'undefined') {
                console.log('⚠️ EmailService not available, initializing...');
                if (typeof EmailService !== 'undefined') {
                    window.emailService = new EmailService();
                    await window.emailService.init();
                } else {
                    throw new Error('Email service not loaded');
                }
            }

            // Prepare email data for EmailService (adapting to its expected format)
            const emailData = {
                fullName: formData.name,
                phoneNumber: formData.phone || formData.email, // Use phone if available, fallback to email
                message: createCareerConsultationMessage(formData)
            };

            // Send email using EmailService
            const result = await window.emailService.sendContactEmail(emailData);

            if (result.success) {
                console.log('✅ Career consultation request sent successfully');
                showSuccessMessage(form);
                form.reset();

                // Also open WhatsApp as backup/additional touchpoint
                window.emailService.openWhatsApp(emailData);
            } else {
                throw new Error(result.message || 'Failed to send consultation request');
            }

        } catch (error) {
            console.error('❌ Error sending career consultation request:', error);
            showErrorMessage(form, error.message);
        } finally {
            // Restore submit button
            submitButton.disabled = false;
            submitButton.value = originalButtonText;
        }
    }

    // Extract form data from form elements
    function extractFormData(form) {
        const formData = new FormData(form);
        return {
            name: formData.get('name')?.trim() || '',
            email: formData.get('email')?.trim() || '',
            phone: formData.get('phone')?.trim() || '',
            careerStage: formData.get('career-stage') || '',
            message: formData.get('message')?.trim() || ''
        };
    }

    // Validate required form fields
    function validateFormData(data) {
        const requiredFields = ['name', 'email', 'careerStage', 'message'];

        for (const field of requiredFields) {
            if (!data[field]) {
                console.error(`❌ Missing required field: ${field}`);
                return false;
            }
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            console.error('❌ Invalid email format');
            return false;
        }

        return true;
    }

    // Create formatted message for career consultation
    function createCareerConsultationMessage(data) {
        return `🎓 *New Career Consultation Request*

👤 *Name:* ${data.name}
📧 *Email:* ${data.email}
📱 *Phone:* ${data.phone || 'Not provided'}
🎯 *Career Stage:* ${data.careerStage}

💬 *Career Goals & Message:*
${data.message}

📅 *Submitted:* ${new Date().toLocaleString()}

---
This request was submitted through the Career Orientation page on AI Studio.`;
    }

    // Show success message
    function showSuccessMessage(form) {
        // Create success message element
        const successDiv = document.createElement('div');
        successDiv.className = 'form-success-message';
        successDiv.style.cssText = `
            background: #22c55e;
            color: white;
            padding: 16px;
            border-radius: 8px;
            margin-top: 16px;
            text-align: center;
            font-weight: 500;
        `;
        successDiv.innerHTML = `
            ✅ Career consultation request sent successfully!<br>
            We'll contact you within 24 hours to schedule your session.
        `;

        // Remove any existing messages
        const existingMessage = form.parentNode.querySelector('.form-success-message, .form-error-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Add success message after form
        form.parentNode.appendChild(successDiv);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 5000);
    }

    // Show error message
    function showErrorMessage(form, errorMessage) {
        // Create error message element
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error-message';
        errorDiv.style.cssText = `
            background: #ef4444;
            color: white;
            padding: 16px;
            border-radius: 8px;
            margin-top: 16px;
            text-align: center;
            font-weight: 500;
        `;
        errorDiv.innerHTML = `
            ❌ Error: ${errorMessage}<br>
            Please try again or contact us directly.
        `;

        // Remove any existing messages
        const existingMessage = form.parentNode.querySelector('.form-success-message, .form-error-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Add error message after form
        form.parentNode.appendChild(errorDiv);

        // Auto-remove after 7 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 7000);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCareerOrientationForm);
    } else {
        initCareerOrientationForm();
    }

    // Expose function globally for debugging
    window.initCareerOrientationForm = initCareerOrientationForm;

})();