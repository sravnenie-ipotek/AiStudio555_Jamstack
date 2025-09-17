/**
 * CAREER ORIENTATION PAGE DATABASE INTEGRATION
 * Fetches ALL content from nd_career_orientation_page table and populates the new logical career center flow
 * Handles all 7 sections: hero, introduction, services, process, testimonials, contact-form, final-cta
 * CRITICAL: No hardcoded content should remain in career-orientation.html
 */

(function() {
    'use strict';

    // Configuration
    const API_BASE_URL = window.location.hostname === 'localhost'
        ? 'http://localhost:1337'
        : 'https://aistudio555jamstack-production.up.railway.app';

    // Get current language from URL or default to 'en'
    function getCurrentLocale() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('locale') || 'en';
    }

    // Main function to load page data
    async function loadCareerOrientationData() {
        try {
            console.log('📊 Loading career orientation page data from database...');

            const locale = getCurrentLocale();
            const response = await fetch(`${API_BASE_URL}/api/nd/career-orientation-page?locale=${locale}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch career orientation data: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Career orientation page data loaded:', data);

            // Populate the page with data
            if (data.success && data.data) {
                populateCareerOrientationPage(data.data);
            } else {
                console.warn('⚠️ No career orientation page data found in database');
                // Don't show anything if no data (per user requirement)
            }

        } catch (error) {
            console.error('❌ Error loading career orientation page data:', error);
            // Don't show anything if API fails (per user requirement)
        }
    }

    // Populate all sections of the page
    function populateCareerOrientationPage(data) {
        console.log('🔧 Populating career orientation page with new logical structure...');

        // 1. Hero Section (Inner Banner)
        if (data.title) {
            populateHeroSection(data);
        }

        // 2. Introduction Section (About-us layout with stats)
        populateIntroductionSection(data);

        // 3. Services Section (Core values grid with 6 service cards)
        populateServicesSection(data);

        // 4. Process Section (Detailed process slider with 4 steps)
        populateProcessSection(data);

        // 5. Testimonials Section (Success stories with 2 testimonials)
        populateTestimonialsSection(data);

        // 6. Contact Form Section (Contact us form with career-specific fields)
        populateContactFormSection(data);

        // 7. Final CTA Section (CTA with dual buttons)
        populateFinalCTASection(data);
    }

    // 1. Populate Hero Section (Inner Banner)
    function populateHeroSection(data) {
        console.log('🏆 Updating hero section...');

        if (data.title) {
            updateTextContent('[data-section="hero"] [data-field="title"]', data.title);
        }

        console.log('✅ Hero section updated');
    }

    // 2. Populate Introduction Section (About-us layout with stats)
    function populateIntroductionSection(data) {
        console.log('📖 Updating introduction section...');

        // Introduction content
        if (data['intro-subtitle']) {
            updateTextContent('[data-section="introduction"] [data-field="intro-subtitle"]', data['intro-subtitle']);
        }

        if (data['intro-title']) {
            updateTextContent('[data-section="introduction"] [data-field="intro-title"]', data['intro-title']);
        }

        if (data['intro-description']) {
            updateTextContent('[data-section="introduction"] [data-field="intro-description"]', data['intro-description']);
        }

        if (data['intro-image']) {
            updateImageSrc('[data-section="introduction"] [data-field="intro-image"]', data['intro-image'], data['intro-title'] || 'Career Orientation');
        }

        // Statistics
        if (data['stat-1-number']) {
            updateTextContent('[data-section="introduction"] [data-field="stat-1-number"]', data['stat-1-number']);
        }
        if (data['stat-1-label']) {
            updateTextContent('[data-section="introduction"] [data-field="stat-1-label"]', data['stat-1-label']);
        }

        if (data['stat-2-number']) {
            updateTextContent('[data-section="introduction"] [data-field="stat-2-number"]', data['stat-2-number']);
        }
        if (data['stat-2-label']) {
            updateTextContent('[data-section="introduction"] [data-field="stat-2-label"]', data['stat-2-label']);
        }

        if (data['stat-3-number']) {
            updateTextContent('[data-section="introduction"] [data-field="stat-3-number"]', data['stat-3-number']);
        }
        if (data['stat-3-label']) {
            updateTextContent('[data-section="introduction"] [data-field="stat-3-label"]', data['stat-3-label']);
        }

        console.log('✅ Introduction section updated');
    }

    // 3. Populate Services Section (Core values grid with 6 service cards)
    function populateServicesSection(data) {
        console.log('🛠️ Updating services section...');

        // Services section header
        if (data['services-subtitle']) {
            updateTextContent('[data-section="services"] [data-field="services-subtitle"]', data['services-subtitle']);
        }

        if (data['services-title']) {
            updateTextContent('[data-section="services"] [data-field="services-title"]', data['services-title']);
        }

        if (data['services-description']) {
            updateTextContent('[data-section="services"] [data-field="services-description"]', data['services-description']);
        }

        // Service cards (1-6)
        for (let i = 1; i <= 6; i++) {
            if (data[`service-${i}-icon`]) {
                updateImageSrc(`[data-section="services"] [data-field="service-${i}-icon"]`, data[`service-${i}-icon`], `Service ${i} Icon`);
            }

            if (data[`service-${i}-title`]) {
                updateTextContent(`[data-section="services"] [data-field="service-${i}-title"]`, data[`service-${i}-title`]);
            }

            if (data[`service-${i}-description`]) {
                updateTextContent(`[data-section="services"] [data-field="service-${i}-description"]`, data[`service-${i}-description`]);
            }
        }

        console.log('✅ Services section updated');
    }

    // 4. Populate Process Section (Detailed process slider with 4 steps)
    function populateProcessSection(data) {
        console.log('⚙️ Updating process section...');

        // Process section header
        if (data['process-subtitle']) {
            updateTextContent('[data-section="process"] [data-field="process-subtitle"]', data['process-subtitle']);
        }

        if (data['process-title']) {
            updateTextContent('[data-section="process"] [data-field="process-title"]', data['process-title']);
        }

        if (data['process-description']) {
            updateTextContent('[data-section="process"] [data-field="process-description"]', data['process-description']);
        }

        // Process steps (1-4)
        for (let i = 1; i <= 4; i++) {
            if (data[`process-${i}-image`]) {
                updateImageSrc(`[data-section="process"] [data-field="process-${i}-image"]`, data[`process-${i}-image`], `Process Step ${i}`);
            }

            if (data[`process-${i}-number`]) {
                updateTextContent(`[data-section="process"] [data-field="process-${i}-number"]`, data[`process-${i}-number`]);
            }

            if (data[`process-${i}-title`]) {
                updateTextContent(`[data-section="process"] [data-field="process-${i}-title"]`, data[`process-${i}-title`]);
            }

            if (data[`process-${i}-description`]) {
                updateTextContent(`[data-section="process"] [data-field="process-${i}-description"]`, data[`process-${i}-description`]);
            }
        }

        console.log('✅ Process section updated');
    }

    // 5. Populate Testimonials Section (Success stories with 2 testimonials)
    function populateTestimonialsSection(data) {
        console.log('💬 Updating testimonials section...');

        // Testimonials section header
        if (data['testimonials-subtitle']) {
            updateTextContent('[data-section="testimonials"] [data-field="testimonials-subtitle"]', data['testimonials-subtitle']);
        }

        if (data['testimonials-title']) {
            updateTextContent('[data-section="testimonials"] [data-field="testimonials-title"]', data['testimonials-title']);
        }

        if (data['testimonials-description']) {
            updateTextContent('[data-section="testimonials"] [data-field="testimonials-description"]', data['testimonials-description']);
        }

        // Testimonials (1-2)
        for (let i = 1; i <= 2; i++) {
            if (data[`testimonial-${i}-title`]) {
                updateTextContent(`[data-section="testimonials"] [data-field="testimonial-${i}-title"]`, data[`testimonial-${i}-title`]);
            }

            if (data[`testimonial-${i}-text`]) {
                updateTextContent(`[data-section="testimonials"] [data-field="testimonial-${i}-text"]`, data[`testimonial-${i}-text`]);
            }

            if (data[`testimonial-${i}-author`]) {
                updateTextContent(`[data-section="testimonials"] [data-field="testimonial-${i}-author"]`, data[`testimonial-${i}-author`]);
            }

            if (data[`testimonial-${i}-role`]) {
                updateTextContent(`[data-section="testimonials"] [data-field="testimonial-${i}-role"]`, data[`testimonial-${i}-role`]);
            }
        }

        console.log('✅ Testimonials section updated');
    }

    // 6. Populate Contact Form Section (Contact us form with career-specific fields)
    function populateContactFormSection(data) {
        console.log('📞 Updating contact form section...');

        // Contact form section header
        if (data['contact-subtitle']) {
            updateTextContent('[data-section="contact-form"] [data-field="contact-subtitle"]', data['contact-subtitle']);
        }

        if (data['contact-title']) {
            updateTextContent('[data-section="contact-form"] [data-field="contact-title"]', data['contact-title']);
        }

        if (data['contact-description']) {
            updateTextContent('[data-section="contact-form"] [data-field="contact-description"]', data['contact-description']);
        }

        // Contact details
        if (data['contact-email']) {
            updateTextContent('[data-section="contact-form"] [data-field="contact-email"]', data['contact-email']);
        }

        if (data['contact-phone']) {
            updateTextContent('[data-section="contact-form"] [data-field="contact-phone"]', data['contact-phone']);
        }

        if (data['contact-hours']) {
            updateTextContent('[data-section="contact-form"] [data-field="contact-hours"]', data['contact-hours']);
        }

        console.log('✅ Contact form section updated');
    }

    // 7. Populate Final CTA Section (CTA with dual buttons)
    function populateFinalCTASection(data) {
        console.log('🎯 Updating final CTA section...');

        if (data['final-cta-subtitle']) {
            updateTextContent('[data-section="final-cta"] [data-field="final-cta-subtitle"]', data['final-cta-subtitle']);
        }

        if (data['final-cta-title']) {
            updateTextContent('[data-section="final-cta"] [data-field="final-cta-title"]', data['final-cta-title']);
        }

        if (data['final-cta-description']) {
            updateTextContent('[data-section="final-cta"] [data-field="final-cta-description"]', data['final-cta-description']);
        }

        // Update button text content (not href - these are handled by contact modal)
        if (data['final-cta-primary-button']) {
            const primaryButton = document.querySelector('[data-section="final-cta"] [data-field="final-cta-primary-button"]');
            if (primaryButton) {
                const textBlock = primaryButton.querySelector('.primary-button-text-block');
                if (textBlock) {
                    textBlock.textContent = data['final-cta-primary-button'];
                } else {
                    primaryButton.textContent = data['final-cta-primary-button'];
                }
            }
        }

        if (data['final-cta-secondary-button']) {
            const secondaryButton = document.querySelector('[data-section="final-cta"] [data-field="final-cta-secondary-button"]');
            if (secondaryButton) {
                const textBlock = secondaryButton.querySelector('.primary-button-text-block');
                if (textBlock) {
                    textBlock.textContent = data['final-cta-secondary-button'];
                } else {
                    secondaryButton.textContent = data['final-cta-secondary-button'];
                }
            }
        }

        console.log('✅ Final CTA section updated');
    }

    // Utility function to safely update text content
    function updateTextContent(selector, text) {
        if (!text) return;

        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            if (element) {
                element.textContent = text;
                // Remove opacity:0 to ensure content is visible
                if (element.style.opacity === '0') {
                    element.style.opacity = '1';
                }
            }
        });
    }

    // Utility function to safely update image src and alt
    function updateImageSrc(selector, src, alt) {
        if (!src) return;

        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            if (element && element.tagName === 'IMG') {
                element.src = src;
                if (alt) {
                    element.alt = alt;
                }
                // Remove opacity:0 to ensure image is visible
                if (element.style.opacity === '0') {
                    element.style.opacity = '1';
                }
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadCareerOrientationData);
    } else {
        loadCareerOrientationData();
    }

    // Expose function globally for debugging
    window.reloadCareerOrientationData = loadCareerOrientationData;

})();