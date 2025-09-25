/**
 * Career Center Page Integration
 * Following the dual-system architecture from WorkingLogic.md
 * System 2: Dynamic content only (removes data-i18n after updating)
 */

(function() {
    'use strict';

    // Configuration
    const API_BASE_URL = window.location.hostname === 'localhost'
        ? 'http://localhost:1337'
        : 'https://aistudio555jamstack-production.up.railway.app';

    // Get current language from localStorage or default to 'en'
    function getCurrentLocale() {
        return localStorage.getItem('selectedLanguage') || 'en';
    }

    // Main function to load career center content
    async function loadCareerCenterContent() {
        try {
            console.log('🚀 [Career Center Integration] Loading dynamic content...');

            const locale = getCurrentLocale();

            // Use the nd_career_center_platform_page endpoint
            const response = await fetch(`${API_BASE_URL}/api/nd/career-center-platform-page?locale=${locale}`);

            if (!response.ok) {
                console.warn('⚠️ Career center endpoint not available, page will use static content');
                return;
            }

            const result = await response.json();

            if (result.success && result.data && result.data.sections) {
                console.log('✅ [Career Center] Dynamic content loaded');
                populateDynamicContent(result.data.sections);
            }

        } catch (error) {
            console.error('❌ [Career Center Integration] Error:', error);
        }
    }

    // Populate dynamic content and remove data-i18n to prevent conflicts
    function populateDynamicContent(sections) {
        console.log('🔄 [Career Center] Populating dynamic content...');

        // Note: We only handle truly dynamic content here
        // Static UI translations are handled by unified-language-manager.js

        // If there are any dynamic testimonials or job listings in the future,
        // they would be handled here

        // For now, the page uses static content with data-i18n attributes
        // which are handled by the unified language manager

        console.log('✅ [Career Center] Dynamic content processing complete');
    }

    // Utility function to safely update text and remove data-i18n
    function updateDynamicContent(selector, text) {
        if (!text) return;

        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            if (element) {
                element.textContent = text;
                // Remove data-i18n to prevent translation system from overwriting
                element.removeAttribute('data-i18n');

                // Ensure visibility
                if (element.style.opacity === '0') {
                    element.style.opacity = '1';
                }
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadCareerCenterContent);
    } else {
        loadCareerCenterContent();
    }

    // Listen for language changes
    window.addEventListener('languageChanged', function(e) {
        console.log('🔄 [Career Center] Language changed to:', e.detail.locale);
        loadCareerCenterContent();
    });

    // Expose for debugging
    window.reloadCareerCenterContent = loadCareerCenterContent;

})();