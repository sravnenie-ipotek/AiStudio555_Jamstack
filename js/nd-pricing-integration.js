// ND Pricing Page Integration
// Connects pricing.html to nd_pricing_page database table

(async function() {
    console.log('🚀 Initializing ND Pricing Integration...');

    // API Configuration
    const API_BASE = window.location.hostname === 'localhost'
        ? 'http://localhost:1337/api/nd'
        : 'https://aistudio555jamstack-production.up.railway.app/api/nd';

    // Load pricing data from database
    async function loadPricingContent() {
        try {
            console.log('📊 Fetching pricing data from database...');

            const response = await fetch(`${API_BASE}/pricing-page?locale=en`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ Pricing data received:', result);

            if (result.success && result.data) {
                const sections = result.data.attributes?.sections || {};

                // Update Hero Section
                if (sections.hero) {
                    if (sections.hero.visible === false) {
                        // Hide hero section if visibility is off
                        const heroSection = document.querySelector('.section.inner-banner');
                        if (heroSection) {
                            heroSection.style.display = 'none';
                            console.log('🔒 Hero section hidden (visibility off)');
                        }
                    } else {
                        updateHeroSection(sections.hero);
                    }
                }

                // Update Plans Section
                if (sections.plans) {
                    if (sections.plans.visible === false) {
                        // Hide plans section if visibility is off
                        const plansSection = document.querySelector('.section.pricing-plan');
                        if (plansSection) {
                            plansSection.style.display = 'none';
                            console.log('🔒 Plans section hidden (visibility off)');
                        }
                    } else {
                        updatePlansSection(sections.plans);

                        // Update the pricing description text
                        const pricingDescText = document.querySelector('.pricing-plan-description-text');
                        if (pricingDescText && sections.plans.description) {
                            pricingDescText.textContent = sections.plans.description;
                            console.log('✅ Updated plans description:', sections.plans.description);
                        }
                    }
                }

                // Update CTA Section
                if (sections.cta) {
                    if (sections.cta.visible === false) {
                        // Hide CTA section if visibility is off
                        const ctaSection = document.querySelector('.section.cta');
                        if (ctaSection) {
                            ctaSection.style.display = 'none';
                            console.log('🔒 CTA section hidden (visibility off)');
                        }
                    } else {
                        updateCTASection(sections.cta);
                    }
                }

                // Update other sections if they exist
                if (sections.features_comparison) {
                    console.log('Features comparison data available:', sections.features_comparison);
                }

                if (sections.faqs) {
                    console.log('FAQs data available:', sections.faqs);
                }

                if (sections.testimonials) {
                    console.log('Testimonials data available:', sections.testimonials);
                }

            } else {
                console.warn('⚠️ No pricing data found in response');
            }

        } catch (error) {
            console.error('❌ Error loading pricing content:', error);
            // Keep static content as fallback
        }
    }

    // Update Hero Section
    function updateHeroSection(hero) {
        console.log('🎯 Updating hero section...');

        // Update title in the hero/banner area
        const heroTitle = document.querySelector('.inner-banner-title');
        if (heroTitle && hero.title) {
            heroTitle.textContent = hero.title;
            console.log('✅ Updated hero title:', hero.title);
        }

        // Update subtitle if exists (currently not in the static HTML)
        // We'll update the section that has "Affordable Plans" and main title
        const sectionSubtitle = document.querySelector('.section-subtitle');
        if (sectionSubtitle && hero.subtitle) {
            // Update the subtitle that currently says "Affordable Plans"
            sectionSubtitle.textContent = hero.subtitle;
            console.log('✅ Updated hero subtitle:', hero.subtitle);
        }

        // Also update the main section title that currently says "Invest in Future..."
        const sectionTitle = document.querySelector('.section-title');
        if (sectionTitle && hero.subtitle) {
            sectionTitle.textContent = hero.subtitle;
            console.log('✅ Updated section title with subtitle:', hero.subtitle);
        }
    }

    // Update Plans Section
    function updatePlansSection(plansData) {
        console.log('💰 Updating pricing plans...');

        if (!plansData.plans || !Array.isArray(plansData.plans)) {
            console.warn('⚠️ No plans array found');
            return;
        }

        // Update the features list on the left side
        const featuresContainer = document.querySelector('.pricing-plan-featured-wrapper');
        if (featuresContainer && plansData.plans.length > 0) {
            // Get features from the first plan (or combine from all plans)
            const allFeatures = new Set();
            plansData.plans.forEach(plan => {
                if (plan.features && Array.isArray(plan.features)) {
                    plan.features.forEach(feature => allFeatures.add(feature));
                }
            });

            // Update the feature list
            const featureElements = featuresContainer.querySelectorAll('.pricing-plan-featured-name');
            const featuresArray = Array.from(allFeatures);

            featureElements.forEach((element, index) => {
                if (index < featuresArray.length) {
                    element.textContent = featuresArray[index];
                    console.log(`✅ Updated feature ${index + 1}: ${featuresArray[index]}`);
                }
            });
        }

        // Update individual plan cards
        const planCards = document.querySelectorAll('.pricing-plan-featured-collection-item');

        plansData.plans.forEach((plan, index) => {
            if (planCards[index]) {
                updatePlanCard(planCards[index], plan);
            }
        });

        console.log(`✅ Updated ${plansData.plans.length} pricing plans`);
    }

    // Update individual plan card
    function updatePlanCard(cardElement, planData) {
        // Update plan name
        const nameElement = cardElement.querySelector('.pricing-plan-name');
        if (nameElement && planData.name) {
            nameElement.textContent = planData.name;
        }

        // Update plan price based on active tab
        const priceElement = cardElement.querySelector('.pricing-plan-price');
        const periodElement = cardElement.querySelector('.pricing-pack-text');

        if (priceElement) {
            // Check which tab is active
            const activeTab = document.querySelector('.pricing-plan-tab-link.w--current');
            const isYearlyTab = activeTab && activeTab.textContent.includes('Yearly');

            if (isYearlyTab && planData.yearly_price) {
                priceElement.textContent = planData.yearly_price.replace(/\/.*$/, '');
                if (periodElement) {
                    periodElement.textContent = 'Per Yearly';
                }
            } else if (planData.monthly_price) {
                priceElement.textContent = planData.monthly_price.replace(/\/.*$/, '');
                if (periodElement) {
                    periodElement.textContent = 'Per Month';
                }
            } else if (planData.price) {
                // Fallback to legacy price
                priceElement.textContent = planData.price;
                if (periodElement && planData.price_period) {
                    periodElement.textContent = planData.price_period.replace('/', '').trim();
                }
            }
        }

        // Update button text if different
        const buttonText = cardElement.querySelector('.primary-button-text-block');
        if (buttonText && planData.button_text) {
            const buttons = cardElement.querySelectorAll('.primary-button-text-block');
            buttons.forEach(btn => {
                btn.textContent = planData.button_text;
            });
        }

        console.log(`✅ Updated plan: ${planData.name}`);
    }

    // Update CTA Section
    function updateCTASection(cta) {
        console.log('📢 Updating CTA section...');

        // Update CTA title
        const ctaTitle = document.querySelector('.cta-title');
        if (ctaTitle && cta.title) {
            ctaTitle.textContent = cta.title;
            console.log('✅ Updated CTA title:', cta.title);
        }

        // Update CTA description
        const ctaDescription = document.querySelector('.cta-description-text');
        if (ctaDescription && cta.description) {
            ctaDescription.textContent = cta.description;
            console.log('✅ Updated CTA description');
        }

        // Update button text if provided
        if (cta.button_text) {
            const ctaButtons = document.querySelectorAll('.cta-button-wrapper .primary-button-text-block');
            if (ctaButtons.length > 0) {
                // Update first button (get in touch)
                ctaButtons[0].textContent = cta.button_text;
                if (ctaButtons[1]) {
                    ctaButtons[1].textContent = cta.button_text;
                }
                console.log('✅ Updated CTA button text:', cta.button_text);
            }
        }
    }

    // Check if we're on the pricing page
    function isPricingPage() {
        const currentPath = window.location.pathname;
        return currentPath.includes('pricing.html');
    }

    // Add tab change listeners for monthly/yearly switching
    function setupTabListeners() {
        const tabLinks = document.querySelectorAll('.pricing-plan-tab-link');
        tabLinks.forEach(tab => {
            tab.addEventListener('click', () => {
                setTimeout(() => {
                    // Re-update pricing after tab switch
                    console.log('🔄 Tab changed, updating pricing display...');
                    loadPricingContent();
                }, 100);
            });
        });
    }

    // Initialize
    if (isPricingPage()) {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                loadPricingContent();
                setupTabListeners();
            });
        } else {
            // DOM is already loaded
            loadPricingContent();
            setupTabListeners();
        }
    } else {
        console.log('ℹ️ Not on pricing page, skipping initialization');
    }

})();