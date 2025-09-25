/**
 * CONTACT US PAGE DATABASE INTEGRATION
 * Fetches ALL content from contact_pages table and populates the page
 * CRITICAL: No hardcoded content should remain in contact-us.html
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
        const urlPath = window.location.pathname;

        // Check if we're in a language subdirectory
        if (urlPath.includes('/en/')) return 'en';
        if (urlPath.includes('/ru/')) return 'ru';
        if (urlPath.includes('/he/')) return 'he';

        return urlParams.get('locale') || 'en';
    }

    // Main function to load contact page data
    async function loadContactPageData() {
        try {
            console.log('🔄 Loading contact page data from database...');

            const locale = getCurrentLocale();
            const response = await fetch(`${API_BASE_URL}/api/contact-page?locale=${locale}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch contact page data: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Contact page data loaded:', data);

            // Populate the page with data
            if (data.data) {
                populateContactPage(data.data);
            } else {
                console.warn('⚠️ No contact page data found in database');
            }

        } catch (error) {
            console.error('❌ Error loading contact page data:', error);
            console.log('⚠️ Using static content as fallback');
        }
    }

    // Populate all sections of the contact page
    function populateContactPage(data) {
        console.log('📝 Populating contact page sections:', Object.keys(data));

        // 1. Hero Section
        if (data.hero && data.hero.content) {
            populateHeroSection(data.hero.content);
        }

        // 2. Contact Info Section
        if (data.contact_info && data.contact_info.content) {
            populateContactInfoSection(data.contact_info.content);
        }

        // 3. Contact Form Section
        if (data.contact_form && data.contact_form.content) {
            populateContactFormSection(data.contact_form.content);
        }

        // 4. Office Locations Section
        if (data.locations && data.locations.content) {
            populateLocationsSection(data.locations.content);
        }

        // 5. Map Section
        if (data.map && data.map.content) {
            populateMapSection(data.map.content);
        }

        // 6. FAQ Section
        if (data.faq && data.faq.content) {
            populateFAQSection(data.faq.content);
        }

        // 7. CTA Section
        if (data.cta && data.cta.content) {
            populateCTASection(data.cta.content);
        }
    }

    // Populate Hero Section
    function populateHeroSection(heroData) {
        console.log('🎯 Updating contact hero section with:', heroData);

        // Update page title
        if (heroData.title) {
            updateTextContent('.banner-heading', heroData.title);
            // Also update document title
            document.title = heroData.title + ' - AI Studio';
        }

        // Update subtitle
        if (heroData.subtitle) {
            updateTextContent('.banner-subtitle', heroData.subtitle);
        }

        // Update description
        if (heroData.description) {
            updateTextContent('.banner-description-text', heroData.description);
        }

        // Update breadcrumb
        if (heroData.breadcrumb) {
            updateTextContent('.breadcrumb-current', heroData.breadcrumb);
        }

        console.log('✅ Contact hero section updated');
    }

    // Populate Contact Info Section
    function populateContactInfoSection(contactData) {
        console.log('📞 Updating contact info section...');

        // Update section title
        if (contactData.title) {
            updateTextContent('.contact-info .section-title', contactData.title);
        }

        // Update section subtitle
        if (contactData.subtitle) {
            updateTextContent('.contact-info .section-subtitle', contactData.subtitle);
        }

        // Update section description
        if (contactData.description) {
            updateTextContent('.contact-info .section-description-text', contactData.description);
        }

        // Update contact details
        if (contactData.phone) {
            updateTextContent('.contact-phone', contactData.phone);
            updateTextContent('[data-contact="phone"]', contactData.phone);
            // Update phone links
            const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
            phoneLinks.forEach(link => {
                link.href = `tel:${contactData.phone.replace(/[^\d+]/g, '')}`;
                link.textContent = contactData.phone;
            });
        }

        if (contactData.email) {
            updateTextContent('.contact-email', contactData.email);
            updateTextContent('[data-contact="email"]', contactData.email);
            // Update email links
            const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
            emailLinks.forEach(link => {
                link.href = `mailto:${contactData.email}`;
                link.textContent = contactData.email;
            });
        }

        if (contactData.address) {
            updateTextContent('.contact-address', contactData.address);
            updateTextContent('[data-contact="address"]', contactData.address);
        }

        // Update business hours
        if (contactData.business_hours) {
            updateTextContent('.business-hours', contactData.business_hours);
            updateTextContent('[data-contact="hours"]', contactData.business_hours);
        }

        // Update social media links
        if (contactData.social_media) {
            updateSocialMediaLinks(contactData.social_media);
        }

        console.log('✅ Contact info section updated');
    }

    // Update Social Media Links
    function updateSocialMediaLinks(socialData) {
        // Update individual social media links
        if (socialData.facebook) {
            const facebookLinks = document.querySelectorAll('a[href*="facebook"], [data-social="facebook"]');
            facebookLinks.forEach(link => {
                link.href = socialData.facebook;
            });
        }

        if (socialData.twitter) {
            const twitterLinks = document.querySelectorAll('a[href*="twitter"], [data-social="twitter"]');
            twitterLinks.forEach(link => {
                link.href = socialData.twitter;
            });
        }

        if (socialData.linkedin) {
            const linkedinLinks = document.querySelectorAll('a[href*="linkedin"], [data-social="linkedin"]');
            linkedinLinks.forEach(link => {
                link.href = socialData.linkedin;
            });
        }

        if (socialData.instagram) {
            const instagramLinks = document.querySelectorAll('a[href*="instagram"], [data-social="instagram"]');
            instagramLinks.forEach(link => {
                link.href = socialData.instagram;
            });
        }

        if (socialData.youtube) {
            const youtubeLinks = document.querySelectorAll('a[href*="youtube"], [data-social="youtube"]');
            youtubeLinks.forEach(link => {
                link.href = socialData.youtube;
            });
        }

        if (socialData.whatsapp) {
            const whatsappLinks = document.querySelectorAll('a[href*="whatsapp"], [data-social="whatsapp"]');
            whatsappLinks.forEach(link => {
                link.href = `https://wa.me/${socialData.whatsapp.replace(/[^\d]/g, '')}`;
            });
        }
    }

    // Populate Contact Form Section
    function populateContactFormSection(formData) {
        console.log('📝 Updating contact form section...');

        // Update form title
        if (formData.title) {
            updateTextContent('.contact-form .section-title', formData.title);
        }

        // Update form subtitle
        if (formData.subtitle) {
            updateTextContent('.contact-form .section-subtitle', formData.subtitle);
        }

        // Update form description
        if (formData.description) {
            updateTextContent('.contact-form .section-description-text', formData.description);
        }

        // Update form field labels
        if (formData.field_labels) {
            const labels = formData.field_labels;

            if (labels.name) {
                updateTextContent('label[for="name"], .form-label.name', labels.name);
                updateAttribute('input[name="name"], #name', 'placeholder', labels.name);
            }

            if (labels.email) {
                updateTextContent('label[for="email"], .form-label.email', labels.email);
                updateAttribute('input[name="email"], #email', 'placeholder', labels.email);
            }

            if (labels.phone) {
                updateTextContent('label[for="phone"], .form-label.phone', labels.phone);
                updateAttribute('input[name="phone"], #phone', 'placeholder', labels.phone);
            }

            if (labels.subject) {
                updateTextContent('label[for="subject"], .form-label.subject', labels.subject);
                updateAttribute('input[name="subject"], #subject', 'placeholder', labels.subject);
            }

            if (labels.message) {
                updateTextContent('label[for="message"], .form-label.message', labels.message);
                updateAttribute('textarea[name="message"], #message', 'placeholder', labels.message);
            }
        }

        // Update submit button text
        if (formData.submit_button_text) {
            updateTextContent('.contact-form button[type="submit"]', formData.submit_button_text);
            updateTextContent('.contact-form .submit-button', formData.submit_button_text);
            updateTextContent('.contact-form .primary-button-text-block', formData.submit_button_text);
        }

        // Update form success message
        if (formData.success_message) {
            updateTextContent('.form-success-message', formData.success_message);
        }

        // Update form error message
        if (formData.error_message) {
            updateTextContent('.form-error-message', formData.error_message);
        }

        console.log('✅ Contact form section updated');
    }

    // Populate Office Locations Section
    function populateLocationsSection(locationsData) {
        console.log('🏢 Updating office locations section...');

        // Update section title
        if (locationsData.title) {
            updateTextContent('.locations-section .section-title', locationsData.title);
        }

        // Update section subtitle
        if (locationsData.subtitle) {
            updateTextContent('.locations-section .section-subtitle', locationsData.subtitle);
        }

        // Update office locations
        if (locationsData.offices && Array.isArray(locationsData.offices)) {
            const locationsContainer = document.querySelector('.locations-grid') ||
                                     document.querySelector('.offices-list');

            if (locationsContainer) {
                // Clear existing locations
                locationsContainer.innerHTML = '';

                // Create location items
                locationsData.offices.forEach((office, index) => {
                    const locationItem = createLocationItem(office, index);
                    locationsContainer.appendChild(locationItem);
                });
            }
        }

        console.log('✅ Office locations section updated');
    }

    // Create Location Item
    function createLocationItem(office, index) {
        const locationItem = document.createElement('div');
        locationItem.className = 'location-item';

        locationItem.innerHTML = `
            <div class="location-card">
                <div class="location-header">
                    <h3 class="location-name">${office.name}</h3>
                    ${office.type ? `<div class="location-type">${office.type}</div>` : ''}
                </div>

                <div class="location-details">
                    ${office.address ? `
                    <div class="location-address">
                        <div class="location-icon">📍</div>
                        <div class="location-text">${office.address}</div>
                    </div>
                    ` : ''}

                    ${office.phone ? `
                    <div class="location-phone">
                        <div class="location-icon">📞</div>
                        <a href="tel:${office.phone.replace(/[^\d+]/g, '')}" class="location-text">${office.phone}</a>
                    </div>
                    ` : ''}

                    ${office.email ? `
                    <div class="location-email">
                        <div class="location-icon">📧</div>
                        <a href="mailto:${office.email}" class="location-text">${office.email}</a>
                    </div>
                    ` : ''}

                    ${office.hours ? `
                    <div class="location-hours">
                        <div class="location-icon">🕒</div>
                        <div class="location-text">${office.hours}</div>
                    </div>
                    ` : ''}
                </div>

                ${office.description ? `
                <div class="location-description">${office.description}</div>
                ` : ''}
            </div>
        `;

        return locationItem;
    }

    // Populate Map Section
    function populateMapSection(mapData) {
        console.log('🗺️ Updating map section...');

        // Update map title
        if (mapData.title) {
            updateTextContent('.map-section .section-title', mapData.title);
        }

        // Update map embed URL
        if (mapData.embed_url) {
            const mapIframes = document.querySelectorAll('.map-embed iframe, .google-map iframe');
            mapIframes.forEach(iframe => {
                iframe.src = mapData.embed_url;
            });
        }

        // Update map coordinates for custom maps
        if (mapData.latitude && mapData.longitude) {
            // Store coordinates for custom map implementations
            window.mapCoordinates = {
                lat: mapData.latitude,
                lng: mapData.longitude
            };
        }

        console.log('✅ Map section updated');
    }

    // Populate FAQ Section
    function populateFAQSection(faqData) {
        console.log('❓ Updating FAQ section...');

        // Find FAQ section
        const faqSection = document.querySelector('.faq-section') ||
                         document.querySelector('[data-section="faq"]');

        if (faqSection && faqData) {
            // Update FAQ title
            if (faqData.title) {
                updateTextContent('.faq-section .section-title', faqData.title);
            }

            // Update FAQ subtitle
            if (faqData.subtitle) {
                updateTextContent('.faq-section .section-subtitle', faqData.subtitle);
            }

            // Update FAQ items
            if (faqData.items && Array.isArray(faqData.items)) {
                console.log(`📝 ${faqData.items.length} FAQ items available`);

                const faqContainer = faqSection.querySelector('.faq-list') ||
                                   faqSection.querySelector('.accordion-list');

                if (faqContainer) {
                    // Clear existing FAQs
                    faqContainer.innerHTML = '';

                    // Create FAQ items
                    faqData.items.forEach((faq, index) => {
                        const faqItem = createFAQItem(faq, index);
                        faqContainer.appendChild(faqItem);
                    });
                }
            }
        }

        console.log('✅ FAQ section updated');
    }

    // Create FAQ Item
    function createFAQItem(faq, index) {
        const faqItem = document.createElement('div');
        faqItem.className = 'faq-item accordion-item';

        faqItem.innerHTML = `
            <div class="faq-question accordion-header" data-faq-toggle="${index}">
                <h3 class="faq-question-text">${faq.question}</h3>
                <div class="faq-icon">+</div>
            </div>
            <div class="faq-answer accordion-content" data-faq-content="${index}">
                <div class="faq-answer-text">${faq.answer}</div>
            </div>
        `;

        // Add click handler for accordion functionality
        const questionElement = faqItem.querySelector('.faq-question');
        const answerElement = faqItem.querySelector('.faq-answer');
        const iconElement = faqItem.querySelector('.faq-icon');

        questionElement.addEventListener('click', () => {
            const isOpen = answerElement.style.display === 'block';

            // Close all other FAQs
            document.querySelectorAll('.faq-answer').forEach(el => {
                el.style.display = 'none';
            });
            document.querySelectorAll('.faq-icon').forEach(el => {
                el.textContent = '+';
            });

            // Toggle current FAQ
            if (!isOpen) {
                answerElement.style.display = 'block';
                iconElement.textContent = '−';
            }
        });

        return faqItem;
    }

    // Populate CTA Section
    function populateCTASection(ctaData) {
        console.log('📢 Updating CTA section...');

        // Find CTA section
        const ctaSection = document.querySelector('.cta-section') ||
                          document.querySelector('[data-section="cta"]');

        if (ctaSection && ctaData) {
            // Update CTA title
            if (ctaData.title) {
                updateTextContent('.cta-section .section-title', ctaData.title);
            }

            // Update CTA description
            if (ctaData.description) {
                updateTextContent('.cta-section .section-description-text', ctaData.description);
            }

            // Update CTA button
            if (ctaData.button_text) {
                const ctaButton = ctaSection.querySelector('.primary-button');
                if (ctaButton) {
                    const buttonTexts = ctaButton.querySelectorAll('.primary-button-text-block');
                    buttonTexts.forEach(el => {
                        el.textContent = ctaData.button_text;
                    });
                    if (ctaData.button_link) {
                        ctaButton.href = ctaData.button_link;
                    }
                }
            }
        }

        console.log('✅ CTA section updated');
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

    // Utility function to safely update element attributes
    function updateAttribute(selector, attribute, value) {
        if (!value) return;

        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            if (element) {
                element.setAttribute(attribute, value);
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadContactPageData);
    } else {
        loadContactPageData();
    }

    // Expose function globally for debugging
    window.reloadContactPageData = loadContactPageData;

})();