/**
 * Career Center Page Integration
 * Following the dual-system architecture from WorkingLogic.md
 * System 2: Dynamic content only (removes data-i18n after updating)
 */

(function() {
    'use strict';

    // Configuration
    const API_BASE_URL = window.location.hostname === 'localhost'
        ? 'http://localhost:3000'
        : 'https://aistudio555jamstack-production.up.railway.app';

    // Get current language from localStorage or default to 'en'
    function getCurrentLocale() {
        // Check unified-language-manager's key first
        const preferredLocale = localStorage.getItem('preferred_locale');
        if (preferredLocale) return preferredLocale;

        // Check window.languageManager as fallback
        if (window.languageManager && window.languageManager.currentLocale) {
            return window.languageManager.currentLocale;
        }

        // Default to 'en'
        return 'en';
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
            console.log('📦 [Career Center] API Response:', result);

            if (result.success && result.data && result.data.sections) {
                console.log('✅ [Career Center] Dynamic content loaded');
                console.log('📦 [Career Center] Sections received:', Object.keys(result.data.sections));
                populateDynamicContent(result.data.sections);
            } else {
                console.warn('⚠️ [Career Center] Invalid API response structure:', result);
            }

        } catch (error) {
            console.error('❌ [Career Center Integration] Error:', error);
        }
    }

    // Populate dynamic content and remove data-i18n to prevent conflicts
    function populateDynamicContent(sections) {
        console.log('🔄 [Career Center] Populating dynamic content...');
        console.log('📦 [Career Center] Full sections object:', JSON.stringify(sections, null, 2));

        // DUAL-SYSTEM COORDINATION: This handles dynamic content that overrides static translations
        // We populate content from nd_career_center_platform_page which has complete Hebrew translations

        // Hero section - note: API returns properties directly on hero object
        if (sections.hero) {
            console.log('🏆 [Career Center] Hero section found:', sections.hero);
            // Main hero content (overrides unified-language-manager translations)
            updateDynamicContent('[data-i18n="hero.content.title"]', sections.hero.title || sections.hero.content?.title);
            updateDynamicContent('[data-i18n="hero.content.subtitle"]', sections.hero.subtitle || sections.hero.content?.subtitle);
            updateDynamicContent('[data-i18n="hero.content.main_title"]', sections.hero.main_title || sections.hero.content?.main_title);
            updateDynamicContent('[data-i18n="hero.content.description"]', sections.hero.description || sections.hero.content?.description);

            // Update stats if available
            if (sections.hero.stats || sections.hero.content?.stats) {
                const stats = sections.hero.stats || sections.hero.content?.stats;
                stats.forEach((stat, index) => {
                    updateDynamicContent(`[data-i18n="hero.content.stats.${index}.number"]`, stat.number);
                    updateDynamicContent(`[data-i18n="hero.content.stats.${index}.label"]`, stat.label);
                });
            }
        } else {
            console.warn('⚠️ [Career Center] No hero section in API response');
        }

        // CTA section - properties directly on cta object
        if (sections.cta) {
            console.log('🎯 [Career Center] CTA section found:', sections.cta);
            updateDynamicContent('[data-i18n="cta.content.title"]', sections.cta.title);
            updateDynamicContent('[data-i18n="cta.content.description"]', sections.cta.description);
        } else {
            console.warn('⚠️ [Career Center] No CTA section in API response');
        }

        // Features section
        if (sections.features) {
            const features = sections.features.content || sections.features;
            console.log('🎯 [Career Center] Features section found:', features);
            updateDynamicContent('[data-i18n="features.content.title"]', features.title);
            updateDynamicContent('[data-i18n="features.content.subtitle"]', features.subtitle);
            updateDynamicContent('[data-i18n="features.content.description"]', features.description);

            // Update feature items if available
            if (features.items) {
                features.items.forEach((item, index) => {
                    updateDynamicContent(`[data-i18n="features.content.items.${index}.title"]`, item.title);
                    updateDynamicContent(`[data-i18n="features.content.items.${index}.description"]`, item.description);
                });
            }
        }

        // Opportunities section
        if (sections.opportunities) {
            const opportunities = sections.opportunities.content || sections.opportunities;
            if (opportunities.title || opportunities.subtitle) {
                updateDynamicContent('[data-i18n="opportunities.content.title"]', opportunities.title);
                updateDynamicContent('[data-i18n="opportunities.content.subtitle"]', opportunities.subtitle);
                updateDynamicContent('[data-i18n="opportunities.content.description"]', opportunities.description);
            }
        }

        // Resources section
        if (sections.resources) {
            const resources = sections.resources.content || sections.resources;
            if (resources.title || resources.subtitle) {
                updateDynamicContent('[data-i18n="resources.content.title"]', resources.title);
                updateDynamicContent('[data-i18n="resources.content.subtitle"]', resources.subtitle);
                updateDynamicContent('[data-i18n="resources.content.description"]', resources.description);
            }
        }

        // Testimonials section
        if (sections.testimonials) {
            const testimonials = sections.testimonials.content || sections.testimonials;
            if (testimonials.title || testimonials.subtitle) {
                updateDynamicContent('[data-i18n="testimonials.content.title"]', testimonials.title);
                updateDynamicContent('[data-i18n="testimonials.content.subtitle"]', testimonials.subtitle);
                updateDynamicContent('[data-i18n="testimonials.content.description"]', testimonials.description);

                if (testimonials.items) {
                    testimonials.items.forEach((item, index) => {
                        updateDynamicContent(`[data-i18n="testimonials.content.items.${index}.text"]`, item.text);
                        updateDynamicContent(`[data-i18n="testimonials.content.items.${index}.author"]`, item.author);
                        updateDynamicContent(`[data-i18n="testimonials.content.items.${index}.role"]`, item.role);
                    });
                }
            }
        }

        console.log('✅ [Career Center] Dynamic content processing complete');
    }

    // Utility function to safely update text and remove data-i18n
    function updateDynamicContent(selector, text) {
        if (!text) {
            console.warn(`⚠️ [Career Center] No text provided for selector: ${selector}`);
            return;
        }

        const elements = document.querySelectorAll(selector);
        console.log(`📝 [Career Center] Updating ${elements.length} elements with selector "${selector}" to: "${text.substring(0, 50)}..."`);

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

    // Initialize when DOM is ready - with delay to run AFTER unified-language-manager
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            // Wait for unified-language-manager to finish first
            setTimeout(loadCareerCenterContent, 1000);
        });
    } else {
        // If DOM is already loaded, still wait a bit for unified-language-manager
        setTimeout(loadCareerCenterContent, 1000);
    }

    // Listen for language changes
    window.addEventListener('languageChanged', function(e) {
        console.log('🔄 [Career Center] Language changed to:', e.detail.locale);
        // Wait for unified-language-manager to finish updating first
        setTimeout(() => {
            console.log('🔄 [Career Center] Loading content after language change delay...');
            loadCareerCenterContent();
        }, 1500);
    });

    // Expose for debugging
    window.reloadCareerCenterContent = loadCareerCenterContent;

})();