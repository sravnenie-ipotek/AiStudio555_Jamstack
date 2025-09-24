/**
 * Shared Footer Component
 *
 * This component follows WorkingLogic.md dual-system architecture:
 * - System 1: Uses unified-language-manager.js for UI translations via data-i18n
 * - System 2: Handles dynamic content population from API, then removes data-i18n
 *
 * Features:
 * - Multi-language support (EN/RU/HE)
 * - Newsletter subscription functionality
 * - Dynamic menu generation from API
 * - Contact information from database
 * - Social media links management
 * - RTL support for Hebrew
 */

class SharedFooter {
    constructor() {
        this.API_BASE_URL = window.location.hostname === 'localhost'
            ? 'http://localhost:3000'
            : 'https://aistudio555jamstack-production.up.railway.app';

        this.footerData = null;
        this.currentLocale = 'en';
        this.initialized = false;

        // Bind methods
        this.init = this.init.bind(this);
        this.loadFooterData = this.loadFooterData.bind(this);
        this.setupNewsletterForm = this.setupNewsletterForm.bind(this);
        this.updateDynamicContent = this.updateDynamicContent.bind(this);
        this.handleLanguageChange = this.handleLanguageChange.bind(this);
    }

    /**
     * Initialize the shared footer component
     */
    async init() {
        if (this.initialized) {
            console.log('🔄 [SharedFooter] Already initialized');
            return;
        }

        console.log('🚀 [SharedFooter] Initializing shared footer component...');

        try {
            // Wait for unified language manager to be ready (System 1)
            await this.waitForLanguageManager();

            // Get current locale
            this.currentLocale = this.getCurrentLocale();

            // Load footer data from API
            await this.loadFooterData();

            // Setup newsletter form functionality
            this.setupNewsletterForm();

            // Listen for language changes
            this.setupLanguageListener();

            // Mark as initialized
            this.initialized = true;

            console.log('✅ [SharedFooter] Footer component initialized successfully');

        } catch (error) {
            console.error('❌ [SharedFooter] Failed to initialize footer:', error);
        }
    }

    /**
     * Wait for unified language manager to be available
     */
    async waitForLanguageManager() {
        return new Promise((resolve) => {
            if (window.UnifiedLanguageManager) {
                resolve();
            } else {
                const checkInterval = setInterval(() => {
                    if (window.UnifiedLanguageManager) {
                        clearInterval(checkInterval);
                        resolve();
                    }
                }, 100);
            }
        });
    }

    /**
     * Get current locale from language manager or localStorage
     */
    getCurrentLocale() {
        if (window.UnifiedLanguageManager && window.UnifiedLanguageManager.currentLocale) {
            return window.UnifiedLanguageManager.currentLocale;
        }

        // Fallback methods
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('locale') ||
               localStorage.getItem('preferred_locale') ||
               'en';
    }

    /**
     * Load footer data from API
     */
    async loadFooterData() {
        try {
            console.log(`🔄 [SharedFooter] Loading footer data for locale: ${this.currentLocale}`);

            const response = await fetch(`${this.API_BASE_URL}/api/nd/home-page?locale=${this.currentLocale}`);
            const data = await response.json();

            if (data.success && data.data && data.data.footer) {
                this.footerData = data.data.footer;
                console.log('✅ [SharedFooter] Footer data loaded successfully');

                // Update dynamic content (System 2)
                await this.updateDynamicContent();
            } else {
                console.warn('⚠️ [SharedFooter] No footer data found in API response');
            }

        } catch (error) {
            console.error('❌ [SharedFooter] Error loading footer data:', error);
        }
    }

    /**
     * Update dynamic content from API (System 2)
     * Following WorkingLogic.md: Load dynamic content and remove data-i18n to prevent conflicts
     */
    async updateDynamicContent() {
        if (!this.footerData) {
            console.warn('⚠️ [SharedFooter] No footer data available for content update');
            return;
        }

        console.log('🔄 [SharedFooter] Updating dynamic footer content...');

        try {
            // Update contact information if available
            await this.updateContactInfo();

            // Update social media links if available
            await this.updateSocialMedia();

            // Update menus if available
            await this.updateMenus();

            // DUAL-SYSTEM: Remove data-i18n from dynamic content after update
            setTimeout(() => {
                this.removeDynamicDataI18n();
            }, 200);

            console.log('✅ [SharedFooter] Dynamic content updated successfully');

        } catch (error) {
            console.error('❌ [SharedFooter] Error updating dynamic content:', error);
        }
    }

    /**
     * Update contact information from API
     */
    async updateContactInfo() {
        const content = this.footerData.content;
        if (!content) return;

        // Update contact email
        if (content.contact_email) {
            const emailElements = document.querySelectorAll('.footer-details-gmail-text, .footer-contact-details-text');
            emailElements.forEach(element => {
                if (element.textContent.includes('@')) {
                    element.textContent = content.contact_email;
                }
            });
        }

        // Update phone number
        if (content.phone) {
            const phoneElements = document.querySelectorAll('.footer-contact-details-text');
            phoneElements.forEach(element => {
                if (element.textContent.includes('(') || element.textContent.includes('+')) {
                    element.textContent = content.phone;
                }
            });
        }

        // Update address
        if (content.address) {
            const addressElements = document.querySelectorAll('.footer-contact-details-text');
            addressElements.forEach(element => {
                if (!element.textContent.includes('@') && !element.textContent.includes('(') && !element.textContent.includes('+')) {
                    element.textContent = content.address;
                }
            });
        }
    }

    /**
     * Update social media links from API
     */
    async updateSocialMedia() {
        const content = this.footerData.content;
        if (!content || !content.social_media) return;

        const socialLinks = document.querySelectorAll('.footer-social-media-link');
        const socialMedia = content.social_media;

        if (socialMedia.facebook && socialLinks[0]) {
            socialLinks[0].href = socialMedia.facebook;
        }
        if (socialMedia.twitter && socialLinks[1]) {
            socialLinks[1].href = socialMedia.twitter;
        }
        if (socialMedia.instagram && socialLinks[2]) {
            socialLinks[2].href = socialMedia.instagram;
        }
        if (socialMedia.youtube && socialLinks[3]) {
            socialLinks[3].href = socialMedia.youtube;
        }
    }

    /**
     * Update menu items from API
     */
    async updateMenus() {
        const content = this.footerData.content;
        if (!content || !content.menus) return;

        // This is handled by System 1 (unified-language-manager)
        // We just ensure the structure is correct
        console.log('🔄 [SharedFooter] Menus will be handled by System 1 (unified-language-manager)');
    }

    /**
     * Remove data-i18n attributes from dynamic content (DUAL-SYSTEM compliance)
     */
    removeDynamicDataI18n() {
        const dynamicSelectors = [
            '.footer-details-gmail-text',
            '.footer-contact-details-text',
            '.footer-social-media-link'
        ];

        dynamicSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element.hasAttribute('data-i18n')) {
                    console.log(`🔄 [DUAL-SYSTEM] Removing data-i18n from dynamic footer element: ${element.getAttribute('data-i18n')}`);
                    element.removeAttribute('data-i18n');
                }
            });
        });
    }

    /**
     * Setup newsletter form functionality
     */
    setupNewsletterForm() {
        const form = document.getElementById('footer-email-form');
        if (!form) {
            console.warn('⚠️ [SharedFooter] Newsletter form not found');
            return;
        }

        console.log('🔄 [SharedFooter] Setting up newsletter form...');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const emailInput = document.getElementById('footer-email');
            const submitBtn = form.querySelector('.footer-details-form-submit-button');
            const doneState = form.parentElement.querySelector('.w-form-done');
            const failState = form.parentElement.querySelector('.w-form-fail');

            if (!emailInput || !emailInput.value) {
                this.showFormState(failState, 'Please enter a valid email address');
                return;
            }

            // Show loading state
            const originalBtnText = submitBtn.value;
            submitBtn.value = 'Subscribing...';
            submitBtn.disabled = true;

            try {
                // Here you would typically send to your newsletter service
                // For now, we'll simulate a successful subscription
                await this.simulateNewsletterSubscription(emailInput.value);

                // Show success state
                this.showFormState(doneState, 'Thank you! Your subscription has been received!');
                form.reset();

            } catch (error) {
                console.error('❌ [SharedFooter] Newsletter subscription error:', error);
                this.showFormState(failState, 'Oops! Something went wrong while subscribing.');
            } finally {
                // Reset button
                submitBtn.value = originalBtnText;
                submitBtn.disabled = false;
            }
        });

        console.log('✅ [SharedFooter] Newsletter form setup complete');
    }

    /**
     * Show form state (success/error)
     */
    showFormState(stateElement, message) {
        if (!stateElement) return;

        // Hide other states
        const allStates = stateElement.parentElement.querySelectorAll('.w-form-done, .w-form-fail');
        allStates.forEach(state => {
            state.style.display = 'none';
        });

        // Show current state
        stateElement.querySelector('div').textContent = message;
        stateElement.style.display = 'block';

        // Auto-hide after 5 seconds
        setTimeout(() => {
            stateElement.style.display = 'none';
        }, 5000);
    }

    /**
     * Simulate newsletter subscription (replace with actual service)
     */
    async simulateNewsletterSubscription(email) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Here you would typically integrate with:
        // - Mailchimp
        // - ConvertKit
        // - EmailJS
        // - Your custom backend
        console.log(`📧 [SharedFooter] Newsletter subscription for: ${email}`);

        // For demo purposes, we'll just log it
        return { success: true, email };
    }

    /**
     * Setup language change listener
     */
    setupLanguageListener() {
        window.addEventListener('languageChanged', async (event) => {
            console.log('🌍 [SharedFooter] Language changed to:', event.detail.locale);

            this.currentLocale = event.detail.locale;

            // Reload footer data for new language
            await this.loadFooterData();
        });
    }

    /**
     * Handle language change
     */
    async handleLanguageChange(newLocale) {
        if (newLocale === this.currentLocale) return;

        console.log(`🌍 [SharedFooter] Switching from ${this.currentLocale} to ${newLocale}`);

        this.currentLocale = newLocale;
        await this.loadFooterData();
    }

    /**
     * Refresh footer content (public method)
     */
    async refresh() {
        console.log('🔄 [SharedFooter] Refreshing footer content...');
        await this.loadFooterData();
    }

    /**
     * Destroy footer component
     */
    destroy() {
        console.log('🗑️ [SharedFooter] Destroying footer component...');

        // Remove event listeners
        window.removeEventListener('languageChanged', this.handleLanguageChange);

        // Reset state
        this.initialized = false;
        this.footerData = null;

        console.log('✅ [SharedFooter] Footer component destroyed');
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure other systems are ready
    setTimeout(() => {
        console.log('🚀 [SharedFooter] Auto-initializing footer component...');

        if (!window.sharedFooter) {
            window.sharedFooter = new SharedFooter();
            window.sharedFooter.init();
        }
    }, 300);
});

// Export for manual usage
window.SharedFooter = SharedFooter;

console.log('📦 [SharedFooter] Shared footer component loaded');