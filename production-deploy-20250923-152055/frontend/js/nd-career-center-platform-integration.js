/**
 * CAREER CENTER PLATFORM PAGE DATABASE INTEGRATION
 * Fetches ALL content from nd_career_center_platform_page table and populates the page
 * CRITICAL: No hardcoded content should remain in career-center-platform.html
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

    // Main function to load page data
    async function loadCareerCenterPlatformData() {
        try {
            console.log('🚀 Loading career center platform page data from database...');

            const locale = getCurrentLocale();
            const response = await fetch(`${API_BASE_URL}/api/nd/career-center-platform-page?locale=${locale}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch career center platform data: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ Career Center Platform page data loaded:', data);

            // Populate the page with data
            if (data.success && data.data && data.data.sections) {
                populateCareerCenterPlatformPage(data.data.sections);
            } else {
                console.warn('⚠️ No career center platform page data found in database');
            }

        } catch (error) {
            console.error('❌ Error loading career center platform page data:', error);
        }
    }

    // Populate all sections of the page
    function populateCareerCenterPlatformPage(sections) {
        console.log('🔧 Populating career center platform page sections:', Object.keys(sections));

        // 1. Hero Section
        if (sections.hero) {
            populateHeroSection(sections.hero);
        }

        // 2. Features Section
        if (sections.features) {
            populateFeaturesSection(sections.features);
        }

        // 3. Opportunities Section
        if (sections.opportunities) {
            populateOpportunitiesSection(sections.opportunities);
        }

        // 4. Resources Section
        if (sections.resources) {
            populateResourcesSection(sections.resources);
        }

        // 5. Testimonials Section
        if (sections.testimonials) {
            populateTestimonialsSection(sections.testimonials);
        }

        // 6. CTA Section
        if (sections.cta) {
            populateCTASection(sections.cta);
        }
    }

    // Populate Hero Section
    function populateHeroSection(heroData) {
        console.log('📍 Updating hero section...');

        if (heroData.title) {
            updateTextContent('[data-section="hero"] [data-field="title"]', heroData.title);
        }

        if (heroData.subtitle) {
            updateTextContent('[data-section="hero"] [data-field="subtitle"]', heroData.subtitle);
        }

        if (heroData.description) {
            updateTextContent('[data-section="hero"] [data-field="description"]', heroData.description);
        }

        // Update buttons
        if (heroData.buttons && Array.isArray(heroData.buttons)) {
            const primaryButton = document.querySelector('[data-section="hero"] [data-field="primary-button"]');
            if (primaryButton && heroData.buttons[0]) {
                const buttonText = primaryButton.querySelectorAll('.button-text, .primary-button-text-block');
                buttonText.forEach(el => {
                    el.textContent = heroData.buttons[0].text;
                });
                if (heroData.buttons[0].url) {
                    primaryButton.href = heroData.buttons[0].url;
                }
            }

            const secondaryButton = document.querySelector('[data-section="hero"] [data-field="secondary-button"]');
            if (secondaryButton && heroData.buttons[1]) {
                const buttonText = secondaryButton.querySelectorAll('.button-text, .primary-button-text-block');
                buttonText.forEach(el => {
                    el.textContent = heroData.buttons[1].text;
                });
                if (heroData.buttons[1].url) {
                    secondaryButton.href = heroData.buttons[1].url;
                }
            }
        }

        // Update background image if specified
        if (heroData.background_image) {
            const heroSection = document.querySelector('[data-section="hero"]');
            if (heroSection) {
                heroSection.style.backgroundImage = `url(${heroData.background_image})`;
            }
        }

        console.log('✅ Hero section updated');
    }

    // Populate Features Section
    function populateFeaturesSection(featuresData) {
        console.log('📍 Updating features section...');

        if (featuresData.title) {
            updateTextContent('[data-section="features"] [data-field="title"]', featuresData.title);
        }

        if (featuresData.subtitle) {
            updateTextContent('[data-section="features"] [data-field="subtitle"]', featuresData.subtitle);
        }

        // Populate feature items
        if (featuresData.items && Array.isArray(featuresData.items)) {
            const container = document.querySelector('[data-section="features"] [data-field="items-container"]');
            if (container) {
                container.innerHTML = '';
                featuresData.items.forEach(item => {
                    const featureCard = createFeatureCard(item);
                    container.appendChild(featureCard);
                });
            }
        }

        console.log('✅ Features section updated');
    }

    // Populate Opportunities Section
    function populateOpportunitiesSection(opportunitiesData) {
        console.log('📍 Updating opportunities section...');

        if (opportunitiesData.title) {
            updateTextContent('[data-section="opportunities"] [data-field="title"]', opportunitiesData.title);
        }

        if (opportunitiesData.subtitle) {
            updateTextContent('[data-section="opportunities"] [data-field="subtitle"]', opportunitiesData.subtitle);
        }

        if (opportunitiesData.description) {
            updateTextContent('[data-section="opportunities"] [data-field="description"]', opportunitiesData.description);
        }

        // Populate categories
        if (opportunitiesData.categories && Array.isArray(opportunitiesData.categories)) {
            const container = document.querySelector('[data-section="opportunities"] [data-field="categories-container"]');
            if (container) {
                container.innerHTML = '';
                opportunitiesData.categories.forEach(category => {
                    const categoryCard = createCategoryCard(category);
                    container.appendChild(categoryCard);
                });
            }
        }

        // Update button
        if (opportunitiesData.button) {
            const button = document.querySelector('[data-section="opportunities"] [data-field="button"]');
            if (button) {
                button.textContent = opportunitiesData.button.text;
                button.href = opportunitiesData.button.url;
            }
        }

        console.log('✅ Opportunities section updated');
    }

    // Populate Resources Section
    function populateResourcesSection(resourcesData) {
        console.log('📍 Updating resources section...');

        if (resourcesData.title) {
            updateTextContent('[data-section="resources"] [data-field="title"]', resourcesData.title);
        }

        if (resourcesData.subtitle) {
            updateTextContent('[data-section="resources"] [data-field="subtitle"]', resourcesData.subtitle);
        }

        // Populate resource items
        if (resourcesData.items && Array.isArray(resourcesData.items)) {
            const container = document.querySelector('[data-section="resources"] [data-field="items-container"]');
            if (container) {
                container.innerHTML = '';
                resourcesData.items.forEach(item => {
                    const resourceCard = createResourceCard(item);
                    container.appendChild(resourceCard);
                });
            }
        }

        console.log('✅ Resources section updated');
    }

    // Populate Testimonials Section
    function populateTestimonialsSection(testimonialsData) {
        console.log('📍 Updating testimonials section...');

        if (testimonialsData.title) {
            updateTextContent('[data-section="testimonials"] [data-field="title"]', testimonialsData.title);
        }

        if (testimonialsData.subtitle) {
            updateTextContent('[data-section="testimonials"] [data-field="subtitle"]', testimonialsData.subtitle);
        }

        // Populate testimonial items
        if (testimonialsData.items && Array.isArray(testimonialsData.items)) {
            const container = document.querySelector('[data-section="testimonials"] [data-field="items-container"]');
            if (container) {
                container.innerHTML = '';
                testimonialsData.items.forEach(item => {
                    const testimonialCard = createTestimonialCard(item);
                    container.appendChild(testimonialCard);
                });
            }
        }

        console.log('✅ Testimonials section updated');
    }

    // Populate CTA Section
    function populateCTASection(ctaData) {
        console.log('📍 Updating CTA section...');

        if (ctaData.title) {
            updateTextContent('[data-section="cta"] [data-field="title"]', ctaData.title);
        }

        if (ctaData.description) {
            updateTextContent('[data-section="cta"] [data-field="description"]', ctaData.description);
        }

        // Update button
        if (ctaData.button_text) {
            const button = document.querySelector('[data-section="cta"] [data-field="button"]');
            if (button) {
                button.textContent = ctaData.button_text;
                if (ctaData.button_url) {
                    button.href = ctaData.button_url;
                }
            }
        }

        // Update background color
        if (ctaData.background_color) {
            const ctaSection = document.querySelector('[data-section="cta"]');
            if (ctaSection) {
                ctaSection.style.backgroundColor = ctaData.background_color;
            }
        }

        // Populate stats
        if (ctaData.stats && Array.isArray(ctaData.stats)) {
            const container = document.querySelector('[data-section="cta"] [data-field="stats-container"]');
            if (container) {
                container.innerHTML = '';
                ctaData.stats.forEach(stat => {
                    const statItem = createStatItem(stat);
                    container.appendChild(statItem);
                });
            }
        }

        console.log('✅ CTA section updated');
    }

    // Helper function to create feature card
    function createFeatureCard(item) {
        const card = document.createElement('div');
        card.className = 'feature-card';
        card.innerHTML = `
            ${item.icon ? `<img src="${item.icon}" alt="${item.title}" class="feature-icon">` : ''}
            <h3 class="feature-title">${item.title || ''}</h3>
            <p class="feature-description">${item.description || ''}</p>
            ${item.url ? `<a href="${item.url}" class="feature-link">Learn More →</a>` : ''}
        `;
        return card;
    }

    // Helper function to create category card
    function createCategoryCard(category) {
        const card = document.createElement('div');
        card.className = 'category-card';
        card.innerHTML = `
            ${category.icon ? `<img src="${category.icon}" alt="${category.name}" class="category-icon">` : ''}
            <h3 class="category-name">${category.name || ''}</h3>
            <span class="category-count">${category.count || 0} positions</span>
        `;
        return card;
    }

    // Helper function to create resource card
    function createResourceCard(item) {
        const card = document.createElement('div');
        card.className = 'resource-card';
        card.innerHTML = `
            <span class="resource-type">${item.type || ''}</span>
            <h3 class="resource-title">${item.title || ''}</h3>
            <p class="resource-description">${item.description || ''}</p>
            <a href="${item.url || '#'}" class="resource-link">Access Resource →</a>
        `;
        return card;
    }

    // Helper function to create testimonial card
    function createTestimonialCard(item) {
        const card = document.createElement('div');
        card.className = 'testimonial-card';

        // Generate star rating
        let stars = '';
        if (item.rating) {
            for (let i = 0; i < 5; i++) {
                stars += i < item.rating ? '★' : '☆';
            }
        }

        card.innerHTML = `
            ${item.rating ? `<div class="testimonial-rating">${stars}</div>` : ''}
            <p class="testimonial-content">"${item.content || ''}"</p>
            <div class="testimonial-author">
                ${item.image ? `<img src="${item.image}" alt="${item.name}" class="testimonial-image">` : ''}
                <div class="testimonial-info">
                    <h4 class="testimonial-name">${item.name || ''}</h4>
                    <p class="testimonial-role">${item.role || ''}</p>
                </div>
            </div>
        `;
        return card;
    }

    // Helper function to create stat item
    function createStatItem(stat) {
        const item = document.createElement('div');
        item.className = 'stat-item';
        item.innerHTML = `
            <div class="stat-number">${stat.number || ''}</div>
            <div class="stat-label">${stat.label || ''}</div>
        `;
        return item;
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

    // Load navigation data for translations (shared across all pages)
    async function loadNavigationData() {
        try {
            console.log('🧭 [Career Center] Fetching navigation data for translations...');

            // Get current locale
            const currentLocale = getCurrentLocale();

            // Fetch navigation data from home-page API
            const response = await fetch(`${API_BASE_URL}/api/nd/home-page?locale=${currentLocale}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ [Career Center] Navigation data received for translations');

            if (result.success && result.data) {
                // Direct translation of navigation elements
                directlyUpdateNavigationElements(result.data, currentLocale);
                console.log('🔄 [Career Center] Navigation translation data ready');
            }

        } catch (error) {
            console.error('❌ [Career Center] Error loading navigation data:', error);
        }
    }

    // Directly update navigation elements with translations
    function directlyUpdateNavigationElements(apiData, locale) {
        console.log('🎯 [Career Center] Directly updating navigation elements...');

        try {
            const navigation = apiData.navigation?.content?.content;
            if (!navigation) {
                console.warn('⚠️ [Career Center] No navigation data found in API response');
                return;
            }

            // Update Career Orientation
            const careerOrientationElements = document.querySelectorAll('[data-i18n="navigation.content.career.orientation"]');
            careerOrientationElements.forEach(element => {
                if (navigation.career_orientation) {
                    element.textContent = navigation.career_orientation;
                    console.log(`✅ [Career Center] Updated Career Orientation: "${navigation.career_orientation}"`);
                }
            });

            // Update Career Center
            const careerCenterElements = document.querySelectorAll('[data-i18n="navigation.content.career.center"]');
            careerCenterElements.forEach(element => {
                if (navigation.career_center) {
                    element.textContent = navigation.career_center;
                    console.log(`✅ [Career Center] Updated Career Center: "${navigation.career_center}"`);
                }
            });

            // Update Sign Up Today buttons
            const signUpButtons = apiData.ui_elements?.content?.content?.buttons?.sign_up_today;
            if (signUpButtons) {
                const signUpElements = document.querySelectorAll('[data-i18n="ui_elements.content.content.buttons.sign_up_today"]');
                signUpElements.forEach(element => {
                    element.textContent = signUpButtons;
                    console.log(`✅ [Career Center] Updated Sign Up Today: "${signUpButtons}"`);
                });
            }

            console.log('🎯 [Career Center] Direct navigation update complete');

        } catch (error) {
            console.error('❌ [Career Center] Error in direct navigation update:', error);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', async () => {
            await loadNavigationData(); // Load navigation for translations first
            loadCareerCenterPlatformData();
        });
    } else {
        (async () => {
            await loadNavigationData(); // Load navigation for translations first
            loadCareerCenterPlatformData();
        })();
    }

    // Expose function globally for debugging
    window.reloadCareerCenterPlatformData = loadCareerCenterPlatformData;

})();