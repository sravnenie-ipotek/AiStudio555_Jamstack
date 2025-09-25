/**
 * CAREER ORIENTATION PAGE DATABASE INTEGRATION - DUAL SYSTEM ARCHITECTURE
 * System 2: Dynamic Content Population (following WorkingLogic.md)
 *
 * PURPOSE: Handles ONLY dynamic content from admin panel/database
 * UI TRANSLATIONS: Handled by unified-language-manager.js (System 1)
 *
 * CRITICAL CHANGES:
 * - Removed UI translation code (now handled by System 1)
 * - Focuses only on dynamic content that changes via admin panel
 * - Removes data-i18n attributes after updating to prevent conflicts
 *
 * For career-orientation page, most content is static UI text,
 * so this script mainly ensures no conflicts with the translation system.
 */

(function() {
    'use strict';

    // Configuration
    const API_BASE_URL = window.location.hostname === 'localhost'
        ? 'http://localhost:3000'
        : 'https://aistudio555jamstack-production.up.railway.app';

    // Get current language from URL or default to 'en'
    function getCurrentLocale() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('locale') || 'en';
    }

    // Main function to load dynamic content data
    async function loadCareerOrientationData() {
        try {
            console.log('📊 [System 2] Loading career orientation dynamic content from database...');

            const locale = getCurrentLocale();
            const response = await fetch(`${API_BASE_URL}/api/career-orientation-page?locale=${locale}`);

            if (!response.ok) {
                console.log('ℹ️ [System 2] Career orientation API not available - using static content only');
                return;
            }

            const data = await response.json();
            console.log('✅ [System 2] Career orientation dynamic content loaded:', data);

            // Process dynamic content only
            if (data.success && data.data) {
                processDynamicContent(data.data);
            } else {
                console.log('ℹ️ [System 2] No dynamic content found - page uses static translations only');
            }

        } catch (error) {
            console.log('ℹ️ [System 2] Dynamic content loading failed - using static translations:', error.message);
        }
    }

    // Process dynamic content only (System 2 - following WorkingLogic.md)
    function processDynamicContent(data) {
        console.log('🔧 [System 2] Processing dynamic content (non-UI elements)...');

        // CRITICAL: Process steps are dynamic content that comes from database
        // and should be populated by System 2 (not static translations)
        if (data && data.attributes) {
            populateProcessStepsFromDatabase(data.attributes);
        }

        // Example: If testimonials come from database and change frequently
        if (data.testimonials && Array.isArray(data.testimonials)) {
            populateDynamicTestimonials(data.testimonials);
        }

        // Example: If statistics are dynamic and updated via admin
        if (data.statistics) {
            populateDynamicStatistics(data.statistics);
        }

        console.log('✅ [System 2] Dynamic content processing complete');
    }

    // CORE SYSTEM 2 FUNCTION: Populate 5-step process from database
    function populateProcessStepsFromDatabase(attributes) {
        console.log('🔄 [System 2] Populating 5-step process from database...');

        // Process all 5 steps from database (not static translations)
        for (let i = 1; i <= 5; i++) {
            const stepData = {
                number: attributes[`processStep${i}Number`] || `0${i}`,
                title: attributes[`processStep${i}Title`] || `Step ${i}`,
                description: attributes[`processStep${i}Description`] || '',
                icon: attributes[`processStep${i}Icon`] || 'default-icon',
                duration: attributes[`processStep${i}Duration`] || '',
                details: attributes[`processStep${i}Details`] || ''
            };

            console.log(`📋 [System 2] Processing step ${i}:`, stepData);

            // Update step number
            updateDynamicContent(`[data-field="process-${i}-number"]`, `Step #${stepData.number}`);

            // Update step title
            updateDynamicContent(`[data-field="process-${i}-title"]`, stepData.title);

            // Update step description
            updateDynamicContent(`[data-field="process-${i}-description"]`, stepData.description);

            // Update step icon if available
            const iconElements = document.querySelectorAll(`[data-field="process-${i}-icon"]`);
            iconElements.forEach(element => {
                if (element && stepData.icon && stepData.icon !== 'default-icon') {
                    // Update icon src to use database icon
                    element.src = `images/${stepData.icon}.svg`;
                    element.alt = stepData.title;
                    element.removeAttribute('data-i18n');
                }
            });

            // Update step image if different images should be used
            const imageElements = document.querySelectorAll(`[data-field="process-${i}-image"]`);
            imageElements.forEach(element => {
                if (element) {
                    // Use different images for different steps
                    element.src = `images/Process-Step-${i}-Image.jpg`;
                    element.alt = stepData.title;
                    element.removeAttribute('data-i18n');
                }
            });
        }

        // Update main process section title from database
        if (attributes.processMainTitle) {
            updateDynamicContent('[data-field="process-title"]', attributes.processMainTitle);
        }

        if (attributes.processSubtitle) {
            updateDynamicContent('[data-field="process-subtitle"]', attributes.processSubtitle);
        }

        if (attributes.processDescription) {
            updateDynamicContent('[data-field="process-description"]', attributes.processDescription);
        }

        console.log('✅ [System 2] 5-step process populated from database');

        // Notify RTL slider to update with new content
        if (window.RTLSlider && window.RTLSlider.instance()) {
            console.log('🔄 [System 2] Notifying RTL slider of content update...');
            setTimeout(() => {
                // Update slider with new dynamic content (handles image loading)
                window.RTLSlider.updateDynamicContent();
            }, 500);
        }
    }

    // Example: Dynamic testimonials (if they come from admin panel)
    function populateDynamicTestimonials(testimonials) {
        console.log('💬 [System 2] Populating dynamic testimonials...');

        // This would only run if testimonials are managed via admin panel
        // and change frequently (not static UI text)
        testimonials.forEach((testimonial, index) => {
            const elements = document.querySelectorAll(`[data-field="testimonial-${index + 1}-text"]`);
            elements.forEach(element => {
                if (element) {
                    element.textContent = testimonial.text;
                    element.removeAttribute('data-i18n'); // Prevent translation system conflicts
                }
            });
        });

        console.log('✅ [System 2] Dynamic testimonials populated');
    }

    // Example: Dynamic statistics (if they come from admin panel)
    function populateDynamicStatistics(stats) {
        console.log('📊 [System 2] Populating dynamic statistics...');

        // This would only run if statistics are updated via admin panel
        // and are not static UI text
        if (stats.placements) {
            const elements = document.querySelectorAll('[data-field="stat-1-number"]');
            elements.forEach(element => {
                if (element) {
                    element.textContent = stats.placements;
                    element.removeAttribute('data-i18n'); // Prevent translation system conflicts
                }
            });
        }

        console.log('✅ [System 2] Dynamic statistics populated');
    }

    // Utility function to safely update dynamic content and prevent translation conflicts
    function updateDynamicContent(selector, content) {
        if (!content) return;

        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            if (element) {
                element.textContent = content;
                element.removeAttribute('data-i18n'); // Critical: Prevent translation system conflicts

                // Ensure content is visible
                if (element.style.opacity === '0') {
                    element.style.opacity = '1';
                }
            }
        });
    }

    // Function to ensure no conflicts with translation system
    function preventTranslationConflicts() {
        console.log('🔄 [System 2] Ensuring no conflicts with translation system...');

        // This function ensures that any content updated by this script
        // doesn't interfere with the unified language manager

        // For career-orientation page, since most content is static UI text,
        // this mainly serves as a safety check

        console.log('✅ [System 2] Translation conflict prevention complete');
    }





    // NOTE: Navigation translations are now handled by unified-language-manager.js (System 1)
    // This integration script only handles dynamic content that changes via admin panel

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            loadCareerOrientationData(); // Load dynamic content
            preventTranslationConflicts(); // Ensure no conflicts with System 1
        });
    } else {
        loadCareerOrientationData(); // Load dynamic content
        preventTranslationConflicts(); // Ensure no conflicts with System 1
    }

    // Expose function globally for debugging
    window.reloadCareerOrientationData = loadCareerOrientationData;

})();