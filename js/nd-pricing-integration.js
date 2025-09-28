// ND Pricing Page Integration
// Connects pricing.html to nd_pricing_page database table

(async function() {
    console.log('🚀 Initializing ND Pricing Integration...');

    // API Configuration
    const API_BASE = window.location.hostname === 'localhost'
        ? 'http://localhost:3000/api/nd'
        : 'https://aistudio555jamstack-production.up.railway.app/api/nd';

    // Load pricing data from database
    async function loadPricingContent() {
        try {
            console.log('📊 Fetching pricing data from database...');

            // Get current locale from URL parameter or localStorage
            const urlParams = new URLSearchParams(window.location.search);
            const urlLocale = urlParams.get('locale');
            const savedLocale = localStorage.getItem('preferred_locale');
            const currentLocale = urlLocale || savedLocale || 'en';

            console.log('🌍 Loading pricing content for locale:', currentLocale);

            // Apply RTL if Hebrew
            const htmlElement = document.documentElement;
            if (currentLocale === 'he') {
                htmlElement.setAttribute('dir', 'rtl');
                htmlElement.setAttribute('lang', 'he');
                console.log('✅ Applied RTL layout for Hebrew');
            } else {
                htmlElement.setAttribute('dir', 'ltr');
                htmlElement.setAttribute('lang', currentLocale);
            }

            const response = await fetch(`${API_BASE}/pricing-page?locale=${currentLocale}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ Pricing data received:', result);

            if (result.success && result.data) {
                const sections = result.data.attributes?.sections || {};

                // Update Hero Section WITH admin data
                if (sections.hero) {
                    // Update hero title
                    const heroTitle = document.querySelector('.banner-heading, [data-i18n="pricing.hero.title"]');
                    if (heroTitle && sections.hero.title) {
                        heroTitle.textContent = sections.hero.title;
                        heroTitle.removeAttribute('data-i18n'); // Prevent translation override
                    }

                    // Update hero subtitle
                    const heroSubtitle = document.querySelector('.banner-subtitle, [data-i18n="pricing.hero.subtitle"]');
                    if (heroSubtitle && sections.hero.subtitle) {
                        heroSubtitle.textContent = sections.hero.subtitle;
                        heroSubtitle.removeAttribute('data-i18n'); // Prevent translation override
                    }

                    if (sections.hero.visible === false) {
                        // Hide hero section if visibility is off
                        const heroSection = document.querySelector('.section.inner-banner');
                        if (heroSection) {
                            heroSection.style.display = 'none';
                            console.log('🔒 Hero section hidden (visibility off)');
                        }
                    }
                    // No longer calling updateHeroSection - UI handled by language manager
                }

                // Update pricing period texts for current locale
                updatePricingPeriodTexts();

                // Track section now handled by unified-language-manager.js
                // No longer calling updateTrackSection

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

                // Update CTA Section WITH admin data
                if (sections.cta) {
                    // Update CTA title
                    const ctaTitle = document.querySelector('[data-i18n="pricing.cta.title"]');
                    if (ctaTitle && sections.cta.title) {
                        ctaTitle.textContent = sections.cta.title;
                        ctaTitle.removeAttribute('data-i18n');
                    }

                    // Update CTA description
                    const ctaDescription = document.querySelector('[data-i18n="pricing.cta.description"]');
                    if (ctaDescription && sections.cta.description) {
                        ctaDescription.textContent = sections.cta.description;
                        ctaDescription.removeAttribute('data-i18n');
                    }

                    // Update CTA button text
                    const ctaButton = document.querySelector('[data-i18n="pricing.cta.button_text"]');
                    if (ctaButton && sections.cta.button_text) {
                        ctaButton.textContent = sections.cta.button_text;
                        ctaButton.removeAttribute('data-i18n');
                    }

                    if (sections.cta.visible === false) {
                        // Hide CTA section if visibility is off
                        const ctaSection = document.querySelector('.section.cta');
                        if (ctaSection) {
                            ctaSection.style.display = 'none';
                            console.log('🔒 CTA section hidden (visibility off)');
                        }
                    }
                    // No longer calling updateCTASection - UI handled by language manager
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






    // Update Plans Section
    function updatePlansSection(plansData) {
        console.log('💰 Updating pricing plans...');

        if (!plansData.plans || !Array.isArray(plansData.plans)) {
            console.warn('⚠️ No plans array found');
            return;
        }


        // NOTE: Feature lists are now handled by System 1 (unified-language-manager.js)
        // via data-i18n attributes. System 2 only handles dynamic pricing data.

        // Update individual plan cards in BOTH monthly and yearly tabs
        const monthlyPlanCards = document.querySelectorAll('.pricing-plan-tab-pane[data-w-tab="Tab 1"] .pricing-plan-featured-collection-item');
        const yearlyPlanCards = document.querySelectorAll('.pricing-plan-tab-pane[data-w-tab="Tab 2"] .pricing-plan-featured-collection-item');

        // Update Monthly tab cards
        plansData.plans.forEach((plan, index) => {
            if (monthlyPlanCards[index]) {
                updatePlanCard(monthlyPlanCards[index], plan, 'monthly');
            }
        });

        // Update Yearly tab cards
        plansData.plans.forEach((plan, index) => {
            if (yearlyPlanCards[index]) {
                updatePlanCard(yearlyPlanCards[index], plan, 'yearly');
            }
        });

        console.log(`✅ Updated ${plansData.plans.length} pricing plans`);
    }



    // Update individual plan card
    function updatePlanCard(cardElement, planData, tabType = null) {
        // Get current locale for translations
        const currentLocale = localStorage.getItem('preferred_locale') || 'en';

        // Translation texts for pricing
        const pricingTexts = {
            en: {
                perMonth: 'Per Month',
                perYearly: 'Per Year',
                buttonText: 'Get Started'
            },
            ru: {
                perMonth: 'В месяц',
                perYearly: 'В год',
                buttonText: 'Начать'
            },
            he: {
                perMonth: 'לחודש',
                perYearly: 'לשנה',
                buttonText: 'התחל עכשיו'
            }
        };

        const texts = pricingTexts[currentLocale] || pricingTexts.en;

        // Update plan name
        const nameElement = cardElement.querySelector('.pricing-plan-name');
        if (nameElement && planData.name) {
            nameElement.textContent = planData.name;
        }

        // Update plan price based on active tab
        const priceElement = cardElement.querySelector('.pricing-plan-price');
        const periodElement = cardElement.querySelector('.pricing-pack-text');

        if (priceElement) {
            // Determine if this is yearly tab based on parameter or active tab
            let isYearlyTab = false;
            if (tabType) {
                isYearlyTab = tabType === 'yearly';
            } else {
                // Fallback: check which tab is active
                const activeTab = document.querySelector('.pricing-plan-tab-link.w--current');
                isYearlyTab = activeTab && activeTab.getAttribute('data-w-tab') === 'Tab 2';
            }

            if (isYearlyTab && planData.yearly_price) {
                priceElement.textContent = planData.yearly_price.replace(/\/.*$/, '');
                if (periodElement) {
                    periodElement.textContent = texts.perYearly;
                }
            } else if (planData.monthly_price) {
                priceElement.textContent = planData.monthly_price.replace(/\/.*$/, '');
                if (periodElement) {
                    periodElement.textContent = texts.perMonth;
                }
            } else if (planData.price) {
                // Fallback to legacy price
                priceElement.textContent = planData.price;
                if (periodElement && planData.price_period) {
                    // Try to translate common price periods
                    const period = planData.price_period.replace('/', '').trim().toLowerCase();
                    if (period.includes('month')) {
                        periodElement.textContent = texts.perMonth;
                    } else if (period.includes('year')) {
                        periodElement.textContent = texts.perYearly;
                    } else {
                        periodElement.textContent = planData.price_period.replace('/', '').trim();
                    }
                }
            }
        }

        // Update button text with translation fallback
        const buttonElements = cardElement.querySelectorAll('.primary-button-text-block');
        if (buttonElements.length > 0) {
            const buttonText = planData.button_text || texts.buttonText;
            buttonElements.forEach(btn => {
                btn.textContent = buttonText;
            });
        }

        console.log(`✅ Updated plan: ${planData.name} (locale: ${currentLocale})`);
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

                    // Update period text for current locale
                    updatePricingPeriodTexts();

                    // Reload full content to ensure everything is properly translated
                    loadPricingContent();
                }, 100);
            });
        });
    }

    // Update pricing period texts based on current tab and locale
    function updatePricingPeriodTexts() {
        const currentLocale = localStorage.getItem('preferred_locale') || 'en';

        const pricingTexts = {
            en: {
                perMonth: 'Per Month',
                perYearly: 'Per Year'
            },
            ru: {
                perMonth: 'В месяц',
                perYearly: 'В год'
            },
            he: {
                perMonth: 'לחודש',
                perYearly: 'לשנה'
            }
        };

        const texts = pricingTexts[currentLocale] || pricingTexts.en;

        // Check which tab is currently active
        const activeTab = document.querySelector('.pricing-plan-tab-link.w--current');
        const isYearlyTab = activeTab && activeTab.getAttribute('data-w-tab') === 'Tab 2';

        // Update all pricing period elements
        const monthlyPeriodElements = document.querySelectorAll('.pricing-plan-tab-pane[data-w-tab="Tab 1"] .pricing-pack-text');
        const yearlyPeriodElements = document.querySelectorAll('.pricing-plan-tab-pane[data-w-tab="Tab 2"] .pricing-pack-text');

        // Update monthly tab period texts
        monthlyPeriodElements.forEach(element => {
            element.textContent = texts.perMonth;
            element.removeAttribute('data-i18n'); // Prevent overwrite by language manager
        });

        // Update yearly tab period texts
        yearlyPeriodElements.forEach(element => {
            element.textContent = texts.perYearly;
            element.removeAttribute('data-i18n'); // Prevent overwrite by language manager
        });

        console.log(`✅ Updated pricing periods for locale: ${currentLocale}, active tab: ${isYearlyTab ? 'Yearly' : 'Monthly'}`);
    }

    // Add event listener for language changes
    // DUAL-SYSTEM: Coordinate with unified-language-manager on language changes
    window.addEventListener('languageChanged', (event) => {
        console.log('🌍 [DUAL-SYSTEM] Language changed to:', event.detail.locale);
        // Wait longer to ensure unified-language-manager completes first
        setTimeout(() => {
            console.log('🔄 [DUAL-SYSTEM] Reloading pricing data after language manager...');

            // Apply RTL if Hebrew
            const htmlElement = document.documentElement;
            if (event.detail.locale === 'he') {
                htmlElement.setAttribute('dir', 'rtl');
                htmlElement.setAttribute('lang', 'he');
                console.log('✅ Applied RTL layout for Hebrew');
            } else {
                htmlElement.setAttribute('dir', 'ltr');
                htmlElement.setAttribute('lang', event.detail.locale);
            }

            // Update pricing period texts immediately
            updatePricingPeriodTexts();

            // Track section now handled by unified-language-manager.js
            // No longer calling updateTrackSection

            // Reload full content (respects data-i18n protection)
            loadPricingContent();
        }, 800);
    });

    // Initialize
    if (isPricingPage()) {
        // DUAL-SYSTEM: Wait for unified-language-manager to complete first
        const initializeAfterLanguageManager = async () => {
            // Wait for language manager to be ready
            if (window.languageManager) {
                console.log('🔄 [DUAL-SYSTEM] Waiting for language manager to complete...');
                // Additional delay to ensure language manager finishes
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            loadPricingContent();
            setupTabListeners();
        };

        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeAfterLanguageManager);
        } else {
            // DOM is already loaded
            initializeAfterLanguageManager();
        }
    } else {
        console.log('ℹ️ Not on pricing page, skipping initialization');
    }

})();