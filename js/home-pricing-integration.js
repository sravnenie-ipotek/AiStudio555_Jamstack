/**
 * HOME PAGE PRICING INTEGRATION
 * Populates pricing plan cards on home.html with database content
 * Handles Monthly/Yearly toggle functionality
 */

(function() {
    'use strict';

    console.log('💰 Home Pricing Integration Loading...');

    // API Configuration
    const API_BASE = window.location.hostname === 'localhost'
        ? 'http://localhost:3000'
        : 'https://aistudio555jamstack-production.up.railway.app';

    let pricingData = null;

    // Load pricing data from API
    async function loadPricingData() {
        try {
            const locale = localStorage.getItem('preferred_locale') || 'en';
            const response = await fetch(`${API_BASE}/api/nd/pricing-page?locale=${locale}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch pricing data: ${response.status}`);
            }

            const result = await response.json();
            console.log('💰 Pricing data loaded:', result);

            if (result.success && result.data && result.data.attributes) {
                pricingData = result.data.attributes.sections;
                populatePricingPlans();
            } else {
                console.warn('⚠️ No pricing data found, using defaults');
                createDefaultPricingData();
            }
        } catch (error) {
            console.error('❌ Error loading pricing data:', error);
            createDefaultPricingData();
        }
    }

    // Create default pricing data if API fails
    function createDefaultPricingData() {
        pricingData = {
            plans: {
                plans: [
                    {
                        name: "Pro Plan",
                        price: "$99",
                        annual_price: "$990",
                        price_period: "/month",
                        annual_period: "/year",
                        featured: true,
                        description: "Perfect for professionals and businesses",
                        features: [
                            "Access to all courses",
                            "Community forum access",
                            "Priority support",
                            "Monthly webinars",
                            "Course completion certificates",
                            "Downloadable resources"
                        ]
                    }
                ]
            }
        };
        populatePricingPlans();
    }

    // Populate pricing plan cards
    function populatePricingPlans() {
        if (!pricingData || !pricingData.plans) {
            console.warn('⚠️ No pricing plans data available');
            return;
        }

        const plans = pricingData.plans.plans || pricingData.plans || [];
        console.log('💳 Populating pricing plans:', plans.length, 'plans found');

        // Ensure plans is an array
        if (!Array.isArray(plans)) {
            console.error('❌ Plans is not an array:', plans);
            createDefaultPricingData();
            return;
        }

        // Find the featured plan (usually the first one)
        const featuredPlan = plans.find(plan => plan.featured) || plans[0];

        if (featuredPlan) {
            // Populate Monthly tab (Tab 1)
            populateTabContent('Tab 1', featuredPlan, 'monthly');

            // Populate Yearly tab (Tab 2)
            populateTabContent('Tab 2', featuredPlan, 'yearly');

            console.log('✅ Pricing plans populated successfully');
        }
    }

    // Populate specific tab content
    function populateTabContent(tabId, plan, period) {
        const tabPane = document.querySelector(`[data-w-tab="${tabId}"] .pricing-plan-featured-collection-item`);

        if (!tabPane) {
            console.warn(`⚠️ Tab pane not found for ${tabId}`);
            return;
        }

        // Get plan details based on period
        const price = period === 'yearly' ?
            (plan.annual_price || '$990') :
            (plan.price || '$99');
        const priceText = period === 'yearly' ?
            (plan.annual_period || '/year') :
            (plan.price_period || '/month');

        // Update plan name
        const nameElement = tabPane.querySelector('.pricing-plan-name');
        if (nameElement) {
            nameElement.textContent = plan.name || 'Pro Plan';
        }

        // Update plan price
        const priceElement = tabPane.querySelector('.pricing-plan-price');
        if (priceElement) {
            priceElement.textContent = price;
        }

        // Update price period text (already exists for yearly)
        const periodElement = tabPane.querySelector('.pricing-pack-text');
        if (periodElement && period === 'monthly') {
            periodElement.textContent = 'Per Monthly';
        }

        console.log(`✅ ${tabId} (${period}) populated: ${plan.name} - ${price}`);
    }

    // Initialize pricing integration
    function init() {
        console.log('🏠 Initializing Home Pricing Integration...');

        // Load pricing data
        loadPricingData();

        // Ensure Webflow tabs are working
        setupTabFunctionality();
    }

    // Setup tab functionality (backup for Webflow)
    function setupTabFunctionality() {
        const tabLinks = document.querySelectorAll('.pricing-plan-tab-link');
        const tabPanes = document.querySelectorAll('.pricing-plan-tab-pane');

        tabLinks.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();

                // Remove active classes from all tabs
                tabLinks.forEach(l => l.classList.remove('w--current'));
                tabPanes.forEach(p => p.classList.remove('w--tab-active'));

                // Add active class to clicked tab
                link.classList.add('w--current');

                // Show corresponding tab pane
                if (tabPanes[index]) {
                    tabPanes[index].classList.add('w--tab-active');
                }

                const tabType = index === 0 ? 'Monthly' : 'Yearly';
                console.log(`💰 Switched to ${tabType} pricing`);
            });
        });

        console.log('🔄 Tab functionality setup complete');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose for debugging
    window.HomePricing = {
        loadPricingData,
        populatePricingPlans,
        init
    };

    console.log('💰 Home Pricing Integration loaded');

})();