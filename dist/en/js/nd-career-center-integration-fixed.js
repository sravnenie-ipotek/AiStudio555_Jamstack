/**
 * CAREER CENTER PAGE DATABASE INTEGRATION - DUAL SYSTEM ARCHITECTURE
 * System 2: Dynamic Content Only (following WorkingLogic.md perfectly)
 *
 * PURPOSE: Handles ONLY truly dynamic content from admin panel/database
 * UI TRANSLATIONS: Handled by unified-language-manager.js (System 1)
 *
 * CRITICAL COMPLIANCE WITH WorkingLogic.md:
 * - NO UI element updates (titles, subtitles, buttons)
 * - ONLY dynamic content that changes via admin panel
 * - Removes data-i18n attributes after updating to prevent conflicts
 * - Graceful API failure handling
 *
 * Based on career-orientation.html - the PERFECT implementation example
 */

(function() {
    'use strict';

    // Configuration
    const API_BASE_URL = window.location.hostname === 'localhost'
        ? 'http://localhost:3000'
        : 'https://aistudio555jamstack-production.up.railway.app';

    // Get current language - sync with unified-language-manager
    function getCurrentLocale() {
        // Use the same key as unified-language-manager
        const preferredLocale = localStorage.getItem('preferred_locale');
        if (preferredLocale) return preferredLocale;

        // Fallback to window.languageManager
        if (window.languageManager && window.languageManager.currentLocale) {
            return window.languageManager.currentLocale;
        }

        // Check URL params
        const urlParams = new URLSearchParams(window.location.search);
        const locale = urlParams.get('locale');
        if (locale && ['en', 'ru', 'he'].includes(locale)) {
            return locale;
        }

        return 'en';
    }

    // Main function to load dynamic content ONLY
    async function loadCareerCenterDynamicContent() {
        try {
            console.log('📊 [System 2] Career Center - Loading DYNAMIC content only...');

            const locale = getCurrentLocale();
            console.log('🌍 [System 2] Current locale:', locale);

            // Try to fetch dynamic content
            const response = await fetch(`${API_BASE_URL}/api/nd/career-center-platform-page?locale=${locale}`);

            if (!response.ok) {
                console.log('ℹ️ [System 2] Career Center API not available - UI translations handled by System 1');
                // This is NOT an error - System 1 handles UI translations
                return;
            }

            const result = await response.json();

            if (result.success && result.data && result.data.sections) {
                console.log('✅ [System 2] Dynamic content received, processing ONLY truly dynamic elements...');
                processDynamicContent(result.data.sections);
            } else {
                console.log('ℹ️ [System 2] No dynamic content - page uses System 1 translations only');
            }

        } catch (error) {
            // Graceful failure - System 1 will handle UI translations
            console.log('ℹ️ [System 2] API unavailable, System 1 handling all translations:', error.message);
        }
    }

    // Process ONLY truly dynamic content (testimonials, job listings, etc.)
    function processDynamicContent(sections) {
        console.log('🔧 [System 2] Processing ONLY dynamic content (non-UI elements)...');

        // IMPORTANT: Based on WorkingLogic.md compliance rules:
        // We should NOT update any UI elements (titles, subtitles, descriptions)
        // Those are handled by System 1 (unified-language-manager)

        // Example: If there are dynamic testimonials from database
        if (sections.testimonials && sections.testimonials.items) {
            console.log('📝 [System 2] Found dynamic testimonials');
            populateDynamicTestimonials(sections.testimonials.items);
        }

        // Example: If there are job listings or success stories from database
        if (sections.success_stories) {
            console.log('📝 [System 2] Found success stories');
            populateDynamicSuccessStories(sections.success_stories);
        }

        // Example: If there are real-time statistics
        if (sections.statistics) {
            console.log('📝 [System 2] Found dynamic statistics');
            populateDynamicStatistics(sections.statistics);
        }

        console.log('✅ [System 2] Dynamic content processing complete');
    }

    // Populate dynamic testimonials (System 2 content)
    function populateDynamicTestimonials(testimonials) {
        if (!testimonials || !Array.isArray(testimonials)) return;

        console.log(`🔄 [System 2] Populating ${testimonials.length} dynamic testimonials`);

        testimonials.forEach((testimonial, index) => {
            // Look for elements with data-field attributes (dynamic content markers)
            const textElement = document.querySelector(`[data-field="testimonial-${index + 1}-text"]`);
            const authorElement = document.querySelector(`[data-field="testimonial-${index + 1}-author"]`);
            const roleElement = document.querySelector(`[data-field="testimonial-${index + 1}-role"]`);

            if (textElement && testimonial.text) {
                textElement.textContent = testimonial.text;
                // CRITICAL: Remove data-i18n to prevent System 1 interference
                textElement.removeAttribute('data-i18n');
            }

            if (authorElement && testimonial.author) {
                authorElement.textContent = testimonial.author;
                authorElement.removeAttribute('data-i18n');
            }

            if (roleElement && testimonial.role) {
                roleElement.textContent = testimonial.role;
                roleElement.removeAttribute('data-i18n');
            }
        });
    }

    // Populate dynamic success stories
    function populateDynamicSuccessStories(stories) {
        console.log('📊 [System 2] Populating success stories...');
        // Implementation for success stories if they exist
    }

    // Populate dynamic statistics
    function populateDynamicStatistics(statistics) {
        console.log('📊 [System 2] Populating statistics...');
        // Implementation for real-time statistics if they exist
    }

    // Initialize with proper timing to avoid conflicts
    function initializeSystem2() {
        // Wait for System 1 (unified-language-manager) to complete first
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                // Give System 1 time to initialize
                setTimeout(loadCareerCenterDynamicContent, 2000);
            });
        } else {
            // DOM already loaded, still wait for System 1
            setTimeout(loadCareerCenterDynamicContent, 2000);
        }
    }

    // Listen for language changes
    window.addEventListener('languageChanged', function(e) {
        console.log('🔄 [System 2] Language changed to:', e.detail.locale);
        // Wait for System 1 to complete its updates
        setTimeout(() => {
            console.log('🔄 [System 2] Reloading dynamic content after language change...');
            loadCareerCenterDynamicContent();
        }, 2000);
    });

    // Initialize System 2
    initializeSystem2();

    // Expose for debugging only
    window.debugCareerCenterSystem2 = {
        reload: loadCareerCenterDynamicContent,
        getCurrentLocale: getCurrentLocale
    };

})();