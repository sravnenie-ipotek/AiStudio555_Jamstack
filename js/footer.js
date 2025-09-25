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
            ? 'http://localhost:1337'
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

            const response = await fetch(`${this.API_BASE_URL}/api/nd/footer?locale=${this.currentLocale}`);
            const data = await response.json();

            if (data.success && data.data) {
                this.footerData = data.data;
                console.log('✅ [SharedFooter] Footer data loaded successfully', this.footerData);

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
            // Update contact information from database
            await this.updateContactInfo();

            // Update social media links from database
            await this.updateSocialMedia();

            // Update menu columns from database
            await this.updateMenuColumns();

            // Update copyright from database
            await this.updateCopyright();

            // Update newsletter content from database
            await this.updateNewsletterContent();

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
     * Update contact information from nd_footer API
     */
    async updateContactInfo() {
        // Contact information is not available in nd_footer API
        // This method is kept for compatibility but does nothing
        console.log('📝 [SharedFooter] Contact info not available in nd_footer API structure');
        return;
    }

    /**
     * Update social media links from nd_footer API
     */
    async updateSocialMedia() {
        if (!this.footerData || !this.footerData.social) return;

        const socialData = this.footerData.social;
        const socialLinks = document.querySelectorAll('.footer-social-media-link');

        // Update social media links from the social array
        socialData.forEach((social, index) => {
            if (social.url && socialLinks[index]) {
                socialLinks[index].href = social.url;
                console.log(`🔗 [SharedFooter] Updated ${social.name} link: ${social.url}`);
            }
        });
    }

    /**
     * Update menu columns - use predefined site structure instead of database
     */
    async updateMenuColumns() {
        const menuGrid = document.querySelector('.footer-menu-grid');

        if (!menuGrid) {
            console.warn('⚠️ [SharedFooter] Footer menu grid not found');
            return;
        }

        // Clear existing menu columns
        menuGrid.innerHTML = '';

        // Use actual site menu structure instead of database
        const siteMenuColumns = this.getSiteMenuStructure();

        siteMenuColumns.forEach((column, index) => {
            const menuColumn = this.createMenuColumn(column, index);
            menuGrid.appendChild(menuColumn);
        });

        console.log('✅ [SharedFooter] Menu columns updated with actual site structure');
    }

    /**
     * Get the actual site menu structure
     */
    getSiteMenuStructure() {
        return [
            {
                heading: this.getLocalizedText('Menu', 'Меню', 'תפריט'),
                items: [
                    { content: this.getLocalizedText('Home', 'Главная', 'בית'), url: 'home.html' },
                    { content: this.getLocalizedText('Courses', 'Курсы', 'קורסים'), url: 'courses.html' },
                    { content: this.getLocalizedText('Pricing', 'Цены', 'מחירים'), url: 'pricing.html' },
                    { content: this.getLocalizedText('Blog', 'Блог', 'בלוג'), url: 'blog.html' },
                    { content: this.getLocalizedText('Teachers', 'Преподаватели', 'מורים'), url: 'teachers.html' },
                    { content: this.getLocalizedText('Career Orientation', 'Профориентация', 'הכוונה מקצועית'), url: 'career-orientation.html' },
                    { content: this.getLocalizedText('Career Center', 'Центр Карьеры', 'מרכז קריירה'), url: 'career-center.html' }
                ]
            },
            {
                heading: this.getLocalizedText('Utility Pages', 'Служебные страницы', 'דפי שירות'),
                items: [
                    { content: this.getLocalizedText('404 Not Found', '404 Не найдено', '404 לא נמצא'), url: '404.html' },
                    { content: this.getLocalizedText('Password Protected', 'Защищено паролем', 'מוגן סיסמה'), url: '401.html' },
                    { content: this.getLocalizedText('Changelog', 'История изменений', 'יומן שינויים'), url: 'template-pages/changelog.html' },
                    { content: this.getLocalizedText('License', 'Лицензия', 'רישיון'), url: 'template-pages/license.html' },
                    { content: this.getLocalizedText('Style Guide', 'Руководство по стилю', 'מדריך עיצוב'), url: 'template-pages/style-guide.html' }
                ]
            },
            {
                heading: this.getLocalizedText('Authentication', 'Аутентификация', 'אימות'),
                items: [
                    { content: this.getLocalizedText('Sign Up', 'Регистрация', 'הרשמה'), url: 'authentication-pages/sign-up.html' },
                    { content: this.getLocalizedText('Sign In', 'Вход', 'התחברות'), url: 'authentication-pages/sign-in.html' },
                    { content: this.getLocalizedText('Forgot Password', 'Забыли пароль', 'שכחתי סיסמה'), url: 'authentication-pages/forgot-password.html' },
                    { content: this.getLocalizedText('Reset Password', 'Сброс пароля', 'איפוס סיסמה'), url: 'authentication-pages/reset-password.html' }
                ]
            }
        ];
    }

    /**
     * Get localized text based on current locale
     */
    getLocalizedText(en, ru, he) {
        switch(this.currentLocale) {
            case 'ru': return ru;
            case 'he': return he;
            default: return en;
        }
    }

    /**
     * Create a menu column element
     */
    createMenuColumn(column, index) {
        const menuColumn = document.createElement('div');
        menuColumn.className = 'footer-menu-single';

        // Create column title
        const titleWrapper = document.createElement('div');
        titleWrapper.className = 'footer-menu-title-wrapper';

        const title = document.createElement('h4');
        title.className = 'footer-menu-title';
        title.textContent = column.heading;

        const titleLine = document.createElement('div');
        titleLine.className = 'footer-menu-title-line';

        titleWrapper.appendChild(title);
        titleWrapper.appendChild(titleLine);

        // Create menu list
        const listWrapper = document.createElement('div');
        listWrapper.className = 'footer-menu-list-wrapper';

        const list = document.createElement('ul');
        list.setAttribute('role', 'list');
        list.className = 'footer-menu-list';

        // Add menu items
        column.items.forEach(item => {
            const listItem = document.createElement('li');
            listItem.className = 'footer-menu-list-item';

            const link = document.createElement('a');
            link.className = 'footer-menu-text-link';
            link.href = item.url;
            link.textContent = item.content;

            if (item.url && (item.url.startsWith('http') || item.url.includes('://'))) {
                link.target = '_blank';
            }

            listItem.appendChild(link);
            list.appendChild(listItem);
        });

        listWrapper.appendChild(list);
        menuColumn.appendChild(titleWrapper);
        menuColumn.appendChild(listWrapper);

        // Note: Contact details removed as they're not in the nd_footer API structure

        return menuColumn;
    }

    // Contact section methods removed - not available in nd_footer API structure

    /**
     * Update copyright from nd_footer API
     */
    async updateCopyright() {
        if (!this.footerData || !this.footerData.copyright) return;

        const copyrightElement = document.querySelector('[data-i18n="footer.content.copyright"]');
        if (copyrightElement) {
            copyrightElement.innerHTML = this.footerData.copyright;
            copyrightElement.removeAttribute('data-i18n');
            console.log('✅ [SharedFooter] Copyright updated from database');
        }
    }

    /**
     * Update newsletter content from nd_footer API
     */
    async updateNewsletterContent() {
        if (!this.footerData || !this.footerData.newsletter) return;

        const newsletter = this.footerData.newsletter;

        // Update newsletter placeholder
        if (newsletter.placeholder) {
            const inputElement = document.querySelector('[data-i18n-placeholder="footer.content.newsletter.placeholder"]');
            if (inputElement) {
                inputElement.placeholder = newsletter.placeholder;
                inputElement.removeAttribute('data-i18n-placeholder');
            }
        }

        // Update submit button text
        if (newsletter.button_text) {
            const submitElement = document.querySelector('[data-i18n-value="footer.content.newsletter.submit"]');
            if (submitElement) {
                submitElement.value = newsletter.button_text;
                submitElement.removeAttribute('data-i18n-value');
            }
        }

        console.log('✅ [SharedFooter] Newsletter content updated from database');
    }

    /**
     * Remove data-i18n attributes from dynamic content (DUAL-SYSTEM compliance)
     */
    removeDynamicDataI18n() {
        const dynamicSelectors = [
            '[data-i18n="footer.content.contact_email"]',
            '[data-i18n="footer.content.phone"]',
            '[data-i18n="footer.content.address"]',
            '[data-i18n="footer.content.copyright"]',
            '[data-i18n="footer.content.newsletter.label"]',
            '[data-i18n="footer.content.newsletter.success"]',
            '[data-i18n="footer.content.newsletter.error"]'
        ];

        const dynamicAttributes = [
            '[data-i18n-placeholder="footer.content.newsletter.placeholder"]',
            '[data-i18n-value="footer.content.newsletter.submit"]'
        ];

        // Remove data-i18n attributes
        dynamicSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element.hasAttribute('data-i18n')) {
                    console.log(`🔄 [DUAL-SYSTEM] Removing data-i18n from: ${element.getAttribute('data-i18n')}`);
                    element.removeAttribute('data-i18n');
                }
            });
        });

        // Remove data-i18n-* attributes
        dynamicAttributes.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element.hasAttribute('data-i18n-placeholder')) {
                    console.log(`🔄 [DUAL-SYSTEM] Removing data-i18n-placeholder from element`);
                    element.removeAttribute('data-i18n-placeholder');
                }
                if (element.hasAttribute('data-i18n-value')) {
                    console.log(`🔄 [DUAL-SYSTEM] Removing data-i18n-value from element`);
                    element.removeAttribute('data-i18n-value');
                }
            });
        });

        console.log('✅ [DUAL-SYSTEM] Removed data-i18n attributes from all database-driven content');
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