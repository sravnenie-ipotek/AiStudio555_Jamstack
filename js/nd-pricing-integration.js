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

            // Get current locale from URL parameter or localStorage
            const urlParams = new URLSearchParams(window.location.search);
            const urlLocale = urlParams.get('locale');
            const savedLocale = localStorage.getItem('preferred_locale');
            const currentLocale = urlLocale || savedLocale || 'en';

            console.log('🌍 Loading pricing content for locale:', currentLocale);

            const response = await fetch(`${API_BASE}/pricing-page?locale=${currentLocale}`);
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
                        updateHeroSection(sections.hero, currentLocale);
                    }
                } else {
                    // If no hero data, use default English texts
                    updateHeroSection({}, currentLocale);
                }

                // Always update feature lists for translations
                updateFeatureLists();

                // Update pricing period texts for current locale
                updatePricingPeriodTexts();

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
    function updateHeroSection(hero, locale) {
        console.log('🎯 Updating hero section for locale:', locale);

        // Default English translations
        const defaultTexts = {
            en: {
                heroTitle: 'Pricing Plan',
                subtitle: 'Affordable Plans',
                mainTitle: 'Invest in Future with Subscription Plans.'
            },
            ru: {
                heroTitle: 'Тарифные планы',
                subtitle: 'Доступные планы',
                mainTitle: 'Инвестируйте в будущее с планами подписки.'
            },
            he: {
                heroTitle: 'תוכנית תמחור',
                subtitle: 'תוכניות זולות',
                mainTitle: 'השקיעו בעתיד עם תוכניות מנוי.'
            }
        };

        const texts = defaultTexts[locale] || defaultTexts.en;

        // Update title in the hero/banner area
        const heroTitle = document.querySelector('.inner-banner-title');
        if (heroTitle) {
            heroTitle.textContent = hero.title || texts.heroTitle;
            console.log('✅ Updated hero title:', hero.title || texts.heroTitle);
        }

        // Update the section subtitle that says "Affordable Plans"
        const sectionSubtitle = document.querySelector('.section-subtitle');
        if (sectionSubtitle) {
            sectionSubtitle.textContent = hero.subtitle || texts.subtitle;
            console.log('✅ Updated section subtitle:', hero.subtitle || texts.subtitle);
        }

        // Update the main section title that says "Invest in Future..."
        const sectionTitle = document.querySelector('.section-title');
        if (sectionTitle) {
            sectionTitle.textContent = hero.description || texts.mainTitle;
            console.log('✅ Updated section title:', hero.description || texts.mainTitle);
        }
    }

    // Update Plans Section
    function updatePlansSection(plansData) {
        console.log('💰 Updating pricing plans...');

        if (!plansData.plans || !Array.isArray(plansData.plans)) {
            console.warn('⚠️ No plans array found');
            return;
        }

        // Update tab labels (Monthly/Yearly)
        updateTabLabels();

        // Update static feature lists
        updateFeatureLists();

        // NOTE: Feature list on the left is now handled by updateFeatureLists()
        // which provides proper translations. We no longer overwrite with API features
        // to prevent English features from overriding translated text.

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

    // Update tab labels (Monthly/Yearly)
    function updateTabLabels() {
        const currentLocale = localStorage.getItem('preferred_locale') || 'en';

        const tabTexts = {
            en: {
                monthly: 'Monthly',
                yearly: 'Yearly'
            },
            ru: {
                monthly: 'Ежемесячно',
                yearly: 'Ежегодно'
            },
            he: {
                monthly: 'חודשי',
                yearly: 'שנתי'
            }
        };

        const texts = tabTexts[currentLocale] || tabTexts.en;

        // Update Monthly tab
        const monthlyTab = document.querySelector('.pricing-plan-tab-link[data-w-tab="Tab 1"] div');
        if (monthlyTab) {
            monthlyTab.textContent = texts.monthly;
        }

        // Update Yearly tab
        const yearlyTab = document.querySelector('.pricing-plan-tab-link[data-w-tab="Tab 2"] div');
        if (yearlyTab) {
            yearlyTab.textContent = texts.yearly;
        }

        console.log(`✅ Updated tab labels for locale: ${currentLocale}`);
    }

    // Update static feature lists in both tabs
    function updateFeatureLists() {
        const currentLocale = localStorage.getItem('preferred_locale') || 'en';

        const featureTexts = {
            en: [
                'Access All Courses',
                'Community Support',
                'Course Materials',
                'Hands-On Projects',
                'Career Support',
                'Support Sessions',
                'Access to Webinars'
            ],
            ru: [
                'Доступ ко всем курсам',
                'Поддержка сообщества',
                'Материалы курса',
                'Практические проекты',
                'Карьерная поддержка',
                'Сессии поддержки',
                'Доступ к вебинарам'
            ],
            he: [
                'גישה לכל הקורסים',
                'תמיכת קהילה',
                'חומרי קורס',
                'פרויקטים מעשיים',
                'תמיכה בקריירה',
                'סשיוני תמיכה',
                'גישה לוובינרים'
            ]
        };

        const texts = featureTexts[currentLocale] || featureTexts.en;

        // Update feature lists in BOTH Monthly and Yearly tabs separately
        // Monthly tab features
        const monthlyFeatures = document.querySelectorAll('.pricing-plan-tab-pane[data-w-tab="Tab 1"] .pricing-plan-featured-name');
        monthlyFeatures.forEach((element, index) => {
            if (index < texts.length) {
                element.textContent = texts[index];
                console.log(`✅ Updated Monthly feature ${index + 1}: ${texts[index]}`);
            }
        });

        // Yearly tab features
        const yearlyFeatures = document.querySelectorAll('.pricing-plan-tab-pane[data-w-tab="Tab 2"] .pricing-plan-featured-name');
        yearlyFeatures.forEach((element, index) => {
            if (index < texts.length) {
                element.textContent = texts[index];
                console.log(`✅ Updated Yearly feature ${index + 1}: ${texts[index]}`);
            }
        });

        console.log(`✅ Updated ${monthlyFeatures.length + yearlyFeatures.length} feature elements for locale: ${currentLocale}`);
        console.log(`   Monthly features: ${monthlyFeatures.length}, Yearly features: ${yearlyFeatures.length}`);
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

                    // Update period text for current locale
                    updatePricingPeriodTexts();

                    // Update feature lists
                    updateFeatureLists();

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
        });

        // Update yearly tab period texts
        yearlyPeriodElements.forEach(element => {
            element.textContent = texts.perYearly;
        });

        console.log(`✅ Updated pricing periods for locale: ${currentLocale}, active tab: ${isYearlyTab ? 'Yearly' : 'Monthly'}`);
    }

    // Add event listener for language changes
    window.addEventListener('languageChanged', (event) => {
        console.log('🌍 Language changed to:', event.detail.locale);
        // Small delay to ensure localStorage is updated
        setTimeout(() => {
            console.log('🔄 Reloading pricing content with new language...');

            // Update pricing period texts immediately
            updatePricingPeriodTexts();

            // Update feature lists
            updateFeatureLists();

            // Reload full content
            loadPricingContent();
        }, 100);
    });

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