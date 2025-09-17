# EmailService for NewDesign Project

## 📧 Overview
Professional email service extracted from the AI Studio legacy system, now integrated into the NewDesign project. Uses EmailJS for reliable email delivery with WhatsApp fallback.

## 🔧 Configuration
### API Keys and Settings
- **EmailJS Public Key**: `TgAbmI0ROiUaACG34`
- **Service ID**: `service_kw2tzof`
- **Template ID**: `template_ux5c6f5`
- **WhatsApp Number**: `+972-54-434-5287`

## 📁 Files Structure
```
shared/services/emailService/
├── emailService.js     # Main EmailService class
├── emailConfig.js      # Configuration constants
├── test-email-service.html # Comprehensive test suite
└── README.md          # This documentation
```

## 🚀 Usage

### Basic Usage
```javascript
// Initialize service
await window.emailService.init();

// Send contact email
const result = await window.emailService.sendContactEmail({
  fullName: 'John Doe',
  phoneNumber: '+1-234-567-8900',
  message: 'Hello, I am interested in your courses.'
});

if (result.success) {
  console.log('Email sent successfully!');
} else {
  console.error('Email failed:', result.message);
}
```

### WhatsApp Integration
```javascript
// Open WhatsApp with pre-filled message
window.emailService.openWhatsApp({
  fullName: 'John Doe',
  phoneNumber: '+1-234-567-8900',
  message: 'Hello from AI Studio!'
});
```

### Service Status
```javascript
// Check service status
const status = window.emailService.getStatus();
console.log('Service initialized:', status.isInitialized);
console.log('EmailJS loaded:', status.isEmailJSLoaded);
```

## 🧪 Testing

### Test Page
Access the comprehensive test suite at:
```
http://localhost:3005/backups/newDesign/shared/services/emailService/test-email-service.html
```

### Test Functions
- **Service Status**: Check initialization and configuration
- **EmailJS Library**: Verify EmailJS library loading
- **Send Test Email**: Send actual test emails
- **WhatsApp Integration**: Test WhatsApp message generation
- **Full Integration**: Complete system test

### Manual Testing
```javascript
// Send test email
const testResult = await window.emailService.sendTestEmail();
console.log('Test result:', testResult);
```

## 🔧 Integration Steps

### 1. Include Required Scripts
```html
<!-- EmailJS Library -->
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>

<!-- Email Service -->
<script src="./shared/services/emailConfig.js"></script>
<script src="./shared/services/emailService.js"></script>
```

### 2. Initialize Service
```javascript
// Auto-initializes on DOM ready, or manually:
await window.emailService.init();
```

### 3. Use in Forms
```javascript
document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    fullName: document.getElementById('name').value,
    phoneNumber: document.getElementById('phone').value,
    message: document.getElementById('message').value
  };

  const result = await window.emailService.sendContactEmail(formData);

  if (result.success) {
    // Show success message
    alert('Message sent successfully!');
  } else {
    // Show error and offer WhatsApp fallback
    alert('Email failed. Try WhatsApp?');
    window.emailService.openWhatsApp(formData);
  }
});
```

## ⚙️ Configuration Options

### Email Template Parameters
The service maps form data to EmailJS template parameters:
```javascript
{
  name: formData.fullName,
  email: formData.phoneNumber,  // Phone goes to email field
  message: formData.message,
  title: 'New Contact Form Submission',
  timestamp: new Date().toLocaleString()
}
```

### Validation Rules
```javascript
// From emailConfig.js
VALIDATION: {
  NAME: { MIN_LENGTH: 2, MAX_LENGTH: 50, REQUIRED: true },
  PHONE: { PATTERN: /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/, REQUIRED: true },
  MESSAGE: { MIN_LENGTH: 10, MAX_LENGTH: 500, REQUIRED: true }
}
```

## 🛡️ Error Handling

### Automatic Fallbacks
1. **EmailJS Library Loading**: Auto-loads if not available
2. **Multiple Init Methods**: Tries 3 different EmailJS init methods
3. **WhatsApp Fallback**: Always available if email fails
4. **Retry Logic**: Built-in retry for failed requests

### Error Response Format
```javascript
{
  success: false,
  error: ErrorObject,
  message: "Human-readable error message"
}
```

## 📱 WhatsApp Integration

### Message Format
```
🎓 *New Contact from AI Studio*

👤 *Name:* John Doe
📱 *Phone:* +1-234-567-8900
💬 *Message:* Hello, I am interested...

📅 *Date:* 9/17/2025, 12:05:00 PM
```

### WhatsApp URL
```
https://wa.me/972544345287?text=<encoded_message>
```

## 🔍 Troubleshooting

### Common Issues
1. **EmailJS Not Loading**: Check network connectivity and CDN access
2. **CORS Errors**: Ensure domain is configured in EmailJS dashboard
3. **Template Not Found**: Verify template ID `template_ux5c6f5` exists
4. **Service Blocked**: Check EmailJS service status and quotas

### Debug Information
```javascript
// Enable debug mode
EMAIL_CONFIG.SETTINGS.DEBUG_MODE = true;

// Check detailed status
console.log('Service Status:', window.emailService.getStatus());
console.log('EmailJS Available:', typeof emailjs !== 'undefined');
console.log('Config Loaded:', typeof EMAIL_CONFIG !== 'undefined');
```

## 📊 Test Results
The service has been successfully extracted and configured with:
- ✅ EmailJS configuration preserved
- ✅ API keys and credentials copied
- ✅ WhatsApp integration functional
- ✅ Error handling and fallbacks implemented
- ✅ Comprehensive test suite available

## 🔗 Related Files
- Original source: `/old-project/dist/js/contact-form-modal.js`
- Current JS integration: `/js/contact-form-modal.js`
- Test page: `test-email-service.html`

## 💡 Usage Notes
- Service auto-initializes on page load
- All API keys are preserved from production system
- WhatsApp number points to active AI Studio support
- Template is configured and tested with live EmailJS account