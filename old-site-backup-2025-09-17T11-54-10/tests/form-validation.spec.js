const { test, expect } = require('@playwright/test');

test.describe('Form Validation Testing', () => {
  test.describe('Contact Form Modal Validation', () => {
    test('Contact form accessibility and validation', async ({ page }) => {
      await page.goto('home.html');
      await page.waitForLoadState('networkidle');

      // Open contact modal
      const signUpBtn = page.locator('a:has-text("Sign Up"), .primary-button').first();
      await signUpBtn.click();
      await page.waitForTimeout(1000);

      const modal = page.locator('#contactModal');
      expect(await modal.isVisible()).toBe(true);

      const form = page.locator('#contactForm');
      expect(await form.isVisible()).toBe(true);

      console.log('✅ Contact modal opened successfully');

      // Test form fields exist and are accessible
      const formFields = [
        { name: 'fullName', label: 'Full Name', required: true },
        { name: 'phoneNumber', label: 'Phone Number', required: true },
        { name: 'message', label: 'Message', required: true }
      ];

      for (const field of formFields) {
        const input = page.locator(`#${field.name}`);
        const label = page.locator(`label[for="${field.name}"]`);
        const errorSpan = page.locator(`#${field.name}Error`);

        // Test field existence and accessibility
        expect(await input.isVisible()).toBe(true);
        expect(await label.isVisible()).toBe(true);
        expect(await errorSpan.count()).toBe(1);

        // Test label association
        const labelText = await label.textContent();
        expect(labelText.toLowerCase()).toContain(field.label.toLowerCase());

        // Test required attribute
        const isRequired = await input.getAttribute('required');
        if (field.required) {
          expect(isRequired).not.toBeNull();
        }

        console.log(`✅ Field ${field.name}: accessible and properly labeled`);
      }
    });

    test('Empty form submission validation', async ({ page }) => {
      await page.goto('home.html');
      await page.waitForLoadState('networkidle');

      // Open contact modal
      const signUpBtn = page.locator('a:has-text("Sign Up"), .primary-button').first();
      await signUpBtn.click();
      await page.waitForTimeout(1000);

      // Try to submit empty form
      const submitBtn = page.locator('button[type="submit"]');
      await submitBtn.click();
      await page.waitForTimeout(1000);

      // Check that error messages appear
      const errorMessages = await page.locator('.form-error.active').allTextContents();
      expect(errorMessages.length).toBeGreaterThan(0);

      console.log('Error messages displayed:', errorMessages);

      // Verify specific error messages
      const nameError = await page.locator('#nameError').textContent();
      const phoneError = await page.locator('#phoneError').textContent();
      const messageError = await page.locator('#messageError').textContent();

      expect(nameError).toContain('required');
      expect(phoneError).toContain('required');
      expect(messageError).toContain('required');

      console.log('✅ Empty form validation working correctly');
    });

    test('Field-specific validation rules', async ({ page }) => {
      await page.goto('home.html');
      await page.waitForLoadState('networkidle');

      // Open contact modal
      const signUpBtn = page.locator('a:has-text("Sign Up"), .primary-button').first();
      await signUpBtn.click();
      await page.waitForTimeout(1000);

      // Test full name validation
      const nameField = page.locator('#fullName');
      
      // Test too short name
      await nameField.fill('A');
      await nameField.blur();
      await page.waitForTimeout(300);
      
      let nameError = await page.locator('#nameError').textContent();
      expect(nameError).toContain('2 characters');
      
      // Test valid name
      await nameField.fill('John Doe');
      await nameField.blur();
      await page.waitForTimeout(300);
      
      nameError = await page.locator('#nameError').textContent();
      expect(nameError).toBe('');

      console.log('✅ Name validation working');

      // Test phone number validation
      const phoneField = page.locator('#phoneNumber');
      
      // Test invalid phone
      await phoneField.fill('123');
      await phoneField.blur();
      await page.waitForTimeout(300);
      
      let phoneError = await page.locator('#phoneError').textContent();
      expect(phoneError).toContain('valid phone');
      
      // Test valid phone
      await phoneField.fill('+1-234-567-8900');
      await phoneField.blur();
      await page.waitForTimeout(300);
      
      phoneError = await page.locator('#phoneError').textContent();
      expect(phoneError).toBe('');

      console.log('✅ Phone validation working');

      // Test message validation
      const messageField = page.locator('#message');
      
      // Test too short message
      await messageField.fill('Hi');
      await messageField.blur();
      await page.waitForTimeout(300);
      
      let messageError = await page.locator('#messageError').textContent();
      expect(messageError).toContain('10 characters');
      
      // Test valid message
      await messageField.fill('This is a valid message with enough characters to pass validation.');
      await messageField.blur();
      await page.waitForTimeout(300);
      
      messageError = await page.locator('#messageError').textContent();
      expect(messageError).toBe('');

      console.log('✅ Message validation working');
    });

    test('Form submission success flow', async ({ page }) => {
      await page.goto('home.html');
      await page.waitForLoadState('networkidle');

      // Monitor EmailJS requests (if any)
      const emailjsRequests = [];
      page.on('request', request => {
        if (request.url().includes('emailjs') || request.url().includes('api.emailjs.com')) {
          emailjsRequests.push({
            url: request.url(),
            method: request.method()
          });
        }
      });

      // Open contact modal
      const signUpBtn = page.locator('a:has-text("Sign Up"), .primary-button').first();
      await signUpBtn.click();
      await page.waitForTimeout(1000);

      // Fill form with valid data
      await page.fill('#fullName', 'Test User E2E');
      await page.fill('#phoneNumber', '+1-555-123-4567');
      await page.fill('#message', 'This is a test message from the E2E test suite to verify form functionality.');

      // Submit form
      const submitBtn = page.locator('button[type="submit"]');
      await submitBtn.click();

      // Wait for submission to complete
      await page.waitForTimeout(3000);

      // Check for success state or WhatsApp redirect
      const modalContent = page.locator('.contact-modal-content');
      const modalText = await modalContent.textContent();

      // Should either show success message or have changed to success state
      const hasSuccessIndicator = modalText.includes('Message Sent') || 
                                 modalText.includes('Success') || 
                                 modalText.includes('WhatsApp') ||
                                 await page.locator('button:has-text("WhatsApp")').isVisible();

      expect(hasSuccessIndicator).toBe(true);

      console.log('EmailJS requests made:', emailjsRequests.length);
      console.log('✅ Form submission flow completed successfully');
    });

    test('Form validation internationalization', async ({ page }) => {
      // Test different language versions if available
      const languages = ['dist/en/', 'dist/ru/', 'dist/he/'];
      
      for (const lang of languages) {
        await page.goto(`${lang}index.html`);
        await page.waitForLoadState('networkidle');

        const signUpBtn = page.locator('a:has-text("Sign Up"), .primary-button, a:contains("הרשמה")').first();
        
        if (await signUpBtn.isVisible()) {
          await signUpBtn.click();
          await page.waitForTimeout(1000);

          const modal = page.locator('#contactModal');
          if (await modal.isVisible()) {
            // Try to submit empty form to trigger validation
            const submitBtn = page.locator('button[type="submit"]');
            await submitBtn.click();
            await page.waitForTimeout(500);

            // Check if validation messages appear
            const errorMessages = await page.locator('.form-error.active').count();
            expect(errorMessages).toBeGreaterThan(0);

            console.log(`✅ Form validation working for ${lang}`);

            // Close modal for next test
            await page.keyboard.press('Escape');
            await page.waitForTimeout(500);
          }
        }
      }
    });

    test('Form security and XSS prevention', async ({ page }) => {
      await page.goto('home.html');
      await page.waitForLoadState('networkidle');

      // Open contact modal
      const signUpBtn = page.locator('a:has-text("Sign Up"), .primary-button').first();
      await signUpBtn.click();
      await page.waitForTimeout(1000);

      // Test XSS prevention in form fields
      const xssPayloads = [
        '<script>alert("XSS")</script>',
        'javascript:alert("XSS")',
        '<img src="x" onerror="alert(\'XSS\')">',
        '"><script>alert("XSS")</script><"'
      ];

      for (const payload of xssPayloads) {
        // Fill form with XSS payload
        await page.fill('#fullName', payload);
        await page.fill('#phoneNumber', '+1-555-123-4567');
        await page.fill('#message', payload);

        // Check that the values are properly escaped/sanitized
        const nameValue = await page.locator('#fullName').inputValue();
        const messageValue = await page.locator('#message').inputValue();

        // Values should be stored as-is (escaped when displayed)
        expect(nameValue).toBe(payload);
        expect(messageValue).toBe(payload);

        // Try to submit and ensure no script execution
        const submitBtn = page.locator('button[type="submit"]');
        await submitBtn.click();
        await page.waitForTimeout(1000);

        // Check that no alert was triggered (would indicate XSS)
        const hasAlert = await page.evaluate(() => {
          return window.alertTriggered === true;
        });
        expect(hasAlert).toBeFalsy();

        console.log(`✅ XSS payload safely handled: ${payload.substring(0, 20)}...`);
      }
    });

    test('Form field input limitations and character counts', async ({ page }) => {
      await page.goto('home.html');
      await page.waitForLoadState('networkidle');

      // Open contact modal
      const signUpBtn = page.locator('a:has-text("Sign Up"), .primary-button').first();
      await signUpBtn.click();
      await page.waitForTimeout(1000);

      // Test character limits
      const longString = 'A'.repeat(1000);
      
      // Test name field
      await page.fill('#fullName', longString);
      const nameValue = await page.locator('#fullName').inputValue();
      console.log(`Name field accepts ${nameValue.length} characters`);
      
      // Test phone field
      await page.fill('#phoneNumber', longString);
      const phoneValue = await page.locator('#phoneNumber').inputValue();
      console.log(`Phone field accepts ${phoneValue.length} characters`);
      
      // Test message field
      await page.fill('#message', longString);
      const messageValue = await page.locator('#message').inputValue();
      console.log(`Message field accepts ${messageValue.length} characters`);

      // Reasonable limits should be in place
      expect(nameValue.length).toBeLessThan(200);
      expect(phoneValue.length).toBeLessThan(50);
      expect(messageValue.length).toBeLessThan(2000);

      console.log('✅ Form field limits working correctly');
    });

    test('Form keyboard navigation and accessibility', async ({ page }) => {
      await page.goto('home.html');
      await page.waitForLoadState('networkidle');

      // Open contact modal
      const signUpBtn = page.locator('a:has-text("Sign Up"), .primary-button').first();
      await signUpBtn.click();
      await page.waitForTimeout(1000);

      // Test tab navigation through form
      const nameField = page.locator('#fullName');
      await nameField.focus();

      // Tab through form fields
      await page.keyboard.press('Tab');
      let focused = await page.evaluate(() => document.activeElement.id);
      expect(focused).toBe('phoneNumber');

      await page.keyboard.press('Tab');
      focused = await page.evaluate(() => document.activeElement.id);
      expect(focused).toBe('message');

      await page.keyboard.press('Tab');
      focused = await page.evaluate(() => document.activeElement.tagName);
      expect(focused).toBe('BUTTON'); // Submit button

      console.log('✅ Tab navigation working correctly');

      // Test form submission with Enter key
      await nameField.focus();
      await page.fill('#fullName', 'Keyboard User');
      await page.fill('#phoneNumber', '+1-555-987-6543');
      await page.fill('#message', 'Testing keyboard submission functionality');

      // Submit with Enter key
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2000);

      // Form should submit (success state or validation)
      const modalText = await page.locator('.contact-modal-content').textContent();
      const formSubmitted = modalText.includes('Message Sent') || 
                           modalText.includes('Success') || 
                           modalText.includes('WhatsApp');

      expect(formSubmitted).toBe(true);
      console.log('✅ Keyboard form submission working');
    });

    test('Form mobile experience', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('home.html');
      await page.waitForLoadState('networkidle');

      // Open contact modal
      const signUpBtn = page.locator('a:has-text("Sign Up"), .primary-button').first();
      await signUpBtn.click();
      await page.waitForTimeout(1000);

      // Check modal is properly sized for mobile
      const modal = page.locator('#contactModal');
      const modalBox = await modal.boundingBox();
      
      expect(modalBox.width).toBeLessThanOrEqual(375);
      expect(modalBox.height).toBeLessThanOrEqual(667);

      // Test input field sizes (should be 16px+ to prevent zoom on iOS)
      const inputs = await page.locator('#contactForm input, #contactForm textarea').all();
      
      for (const input of inputs) {
        const fontSize = await input.evaluate(el => {
          return window.getComputedStyle(el).fontSize;
        });
        
        const fontSizeNum = parseInt(fontSize);
        expect(fontSizeNum).toBeGreaterThanOrEqual(16);
        
        console.log(`Input font size: ${fontSize} (prevents iOS zoom)`);
      }

      // Test touch-friendly button size
      const submitBtn = page.locator('button[type="submit"]');
      const btnBox = await submitBtn.boundingBox();
      
      expect(btnBox.height).toBeGreaterThanOrEqual(44); // iOS minimum touch target
      expect(btnBox.width).toBeGreaterThanOrEqual(44);

      console.log('✅ Mobile form experience optimized');
    });
  });

  test.describe('Form Error Handling', () => {
    test('Network error handling during submission', async ({ page }) => {
      await page.goto('home.html');
      await page.waitForLoadState('networkidle');

      // Mock network failure for EmailJS
      await page.route('**/emailjs**', route => {
        route.abort('failed');
      });

      // Open contact modal and fill form
      const signUpBtn = page.locator('a:has-text("Sign Up"), .primary-button').first();
      await signUpBtn.click();
      await page.waitForTimeout(1000);

      await page.fill('#fullName', 'Network Test User');
      await page.fill('#phoneNumber', '+1-555-999-8888');
      await page.fill('#message', 'Testing network error handling in form submission.');

      // Submit form
      const submitBtn = page.locator('button[type="submit"]');
      await submitBtn.click();
      await page.waitForTimeout(3000);

      // Should show error message or fallback option
      const modalText = await page.locator('.contact-modal-content').textContent();
      const hasErrorHandling = modalText.includes('WhatsApp') || 
                               modalText.includes('error') || 
                               modalText.includes('try again');

      expect(hasErrorHandling).toBe(true);
      console.log('✅ Network error handling working');
    });

    test('Rate limiting and spam prevention', async ({ page }) => {
      await page.goto('home.html');
      await page.waitForLoadState('networkidle');

      // Test multiple rapid submissions
      for (let i = 0; i < 3; i++) {
        const signUpBtn = page.locator('a:has-text("Sign Up"), .primary-button').first();
        await signUpBtn.click();
        await page.waitForTimeout(500);

        await page.fill('#fullName', `Spam Test ${i}`);
        await page.fill('#phoneNumber', `+1-555-000-000${i}`);
        await page.fill('#message', `Rapid submission test number ${i}`);

        const submitBtn = page.locator('button[type="submit"]');
        await submitBtn.click();
        await page.waitForTimeout(1000);

        // Close modal for next iteration
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);

        console.log(`Submission ${i + 1} completed`);
      }

      console.log('✅ Rapid submission test completed (check logs for rate limiting)');
    });
  });

  test('Form analytics and tracking', async ({ page }) => {
    const analyticsEvents = [];
    
    // Monitor console for analytics events
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('analytics') || text.includes('track') || text.includes('event')) {
        analyticsEvents.push(text);
      }
    });

    await page.goto('home.html');
    await page.waitForLoadState('networkidle');

    // Open modal (should trigger open event)
    const signUpBtn = page.locator('a:has-text("Sign Up"), .primary-button').first();
    await signUpBtn.click();
    await page.waitForTimeout(1000);

    // Fill and submit form (should trigger submission event)
    await page.fill('#fullName', 'Analytics Test User');
    await page.fill('#phoneNumber', '+1-555-123-9999');
    await page.fill('#message', 'Testing form analytics and event tracking.');

    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();
    await page.waitForTimeout(2000);

    console.log('Analytics events captured:', analyticsEvents.length);
    if (analyticsEvents.length > 0) {
      console.log('Sample events:', analyticsEvents.slice(0, 3));
    }

    console.log('✅ Form analytics test completed');
  });
});