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

                // Update Track section
                updateTrackSection();

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

    // Global function to enhance any API response with navigation data
    window.enhanceApiDataWithNavigation = function(apiData, navigationData) {
        if (!apiData || !navigationData) return apiData;

        // Merge navigation data into the API response
        const enhanced = { ...apiData };
        if (navigationData.navigation) enhanced.navigation = navigationData.navigation;
        if (navigationData.ui_elements) enhanced.ui_elements = navigationData.ui_elements;
        if (navigationData.footer) enhanced.footer = navigationData.footer;

        console.log('🔗 Enhanced API data with navigation');
        return enhanced;
    };

    // Load navigation data for translations (shared across all pages)
    async function loadNavigationData() {
        try {
            console.log('🧭 Fetching navigation data for translations...');

            // Get current locale
            const urlParams = new URLSearchParams(window.location.search);
            const urlLocale = urlParams.get('locale');
            const savedLocale = localStorage.getItem('preferred_locale');
            const currentLocale = urlLocale || savedLocale || 'en';

            // Fetch navigation data from home-page API
            const response = await fetch(`${API_BASE}/home-page?locale=${currentLocale}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ Navigation data received for translations');

            if (result.success && result.data) {
                // Directly inject navigation data into LanguageManager's data cache
                if (window.languageManager && window.languageManager.contentCache) {
                    console.log('🔄 Injecting navigation data into LanguageManager cache...');

                    // Ensure contentCache has current locale
                    if (!window.languageManager.contentCache[currentLocale]) {
                        window.languageManager.contentCache[currentLocale] = {};
                    }

                    // Inject navigation data
                    window.languageManager.contentCache[currentLocale].navigation = result.data.navigation;
                    window.languageManager.contentCache[currentLocale].ui_elements = result.data.ui_elements;
                    window.languageManager.contentCache[currentLocale].footer = result.data.footer;

                    console.log('✅ Navigation data injected into cache');
                }

                // Also make it available globally
                window.globalTranslationData = {
                    navigation: result.data.navigation,
                    ui_elements: result.data.ui_elements,
                    footer: result.data.footer,
                    locale: currentLocale
                };

                // Direct translation of navigation elements (bypassing LanguageManager)
                directlyUpdateNavigationElements(result.data, currentLocale);

                console.log('🔄 Navigation translation data ready');
            }

        } catch (error) {
            console.error('❌ Error loading navigation data:', error);
        }
    }

    // Setup fetch interceptor to inject navigation data into API responses
    function setupFetchInterceptor(navigationData) {
        if (window.fetchInterceptorSetup) return; // Already setup
        window.fetchInterceptorSetup = true;

        const originalFetch = window.fetch;
        window.fetch = async function(...args) {
            const response = await originalFetch.apply(this, args);

            // Only intercept API calls that might need navigation data
            const url = args[0];
            if (typeof url === 'string' && url.includes('/api/nd/') &&
                (url.includes('pricing-page') || url.includes('teachers-page') || url.includes('career'))) {

                // Clone the response to read it
                const clonedResponse = response.clone();
                try {
                    const data = await clonedResponse.json();

                    // Enhance with navigation data
                    if (data.success && data.data && navigationData) {
                        console.log('🔗 Intercepting API call:', url);
                        const enhanced = window.enhanceApiDataWithNavigation(data.data, navigationData);

                        // Return a new response with enhanced data
                        return new Response(JSON.stringify({
                            ...data,
                            data: enhanced
                        }), {
                            status: response.status,
                            statusText: response.statusText,
                            headers: response.headers
                        });
                    }
                } catch (e) {
                    console.log('Failed to enhance response:', e);
                }
            }

            return response;
        };

        console.log('🕸️ Fetch interceptor setup complete');
    }

    // Directly update navigation elements with translations
    function directlyUpdateNavigationElements(apiData, locale) {
        console.log('🎯 Directly updating navigation elements...');

        try {
            const navigation = apiData.navigation?.content?.content;
            if (!navigation) {
                console.warn('⚠️ No navigation data found in API response');
                return;
            }

            // Update Career Orientation
            const careerOrientationElements = document.querySelectorAll('[data-i18n="navigation.content.career.orientation"]');
            careerOrientationElements.forEach(element => {
                if (navigation.career_orientation) {
                    element.textContent = navigation.career_orientation;
                    console.log(`✅ Updated Career Orientation: "${navigation.career_orientation}"`);
                }
            });

            // Update Career Center
            const careerCenterElements = document.querySelectorAll('[data-i18n="navigation.content.career.center"]');
            careerCenterElements.forEach(element => {
                if (navigation.career_center) {
                    element.textContent = navigation.career_center;
                    console.log(`✅ Updated Career Center: "${navigation.career_center}"`);
                }
            });

            // Update Sign Up Today buttons
            const signUpButtons = apiData.ui_elements?.content?.content?.buttons?.sign_up_today;
            if (signUpButtons) {
                const signUpElements = document.querySelectorAll('[data-i18n="ui_elements.content.content.buttons.sign_up_today"]');
                signUpElements.forEach(element => {
                    element.textContent = signUpButtons;
                    console.log(`✅ Updated Sign Up Today: "${signUpButtons}"`);
                });
            }

            // Update other common navigation elements
            const navigationMappings = {
                '[data-i18n*="navigation"][data-i18n*="home"]': navigation.home,
                '[data-i18n*="navigation"][data-i18n*="courses"]': navigation.courses,
                '[data-i18n*="navigation"][data-i18n*="pricing"]': navigation.pricing,
                '[data-i18n*="navigation"][data-i18n*="teachers"]': navigation.teachers,
                '[data-i18n*="navigation"][data-i18n*="blog"]': navigation.blog,
                '[data-i18n*="navigation"][data-i18n*="about"]': navigation.about_us,
                '[data-i18n*="navigation"][data-i18n*="contact"]': navigation.contact
            };

            Object.entries(navigationMappings).forEach(([selector, translation]) => {
                if (translation) {
                    const elements = document.querySelectorAll(selector);
                    elements.forEach(element => {
                        element.textContent = translation;
                        console.log(`✅ Updated navigation: "${translation}"`);
                    });
                }
            });

            console.log('🎯 Direct navigation update complete');

        } catch (error) {
            console.error('❌ Error in direct navigation update:', error);
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
                subtitle: 'תוכניות במחירים נגישים',
                mainTitle: 'השקיעו בעתיד עם תוכניות מנוי.'
            }
        };

        const texts = defaultTexts[locale] || defaultTexts.en;

        // DUAL-SYSTEM: Hero title may be handled by unified-language-manager
        const heroTitle = document.querySelector('.inner-banner-title');
        if (heroTitle && !heroTitle.hasAttribute('data-i18n')) {
            heroTitle.textContent = hero.title || texts.heroTitle;
            console.log('✅ Updated hero title:', hero.title || texts.heroTitle);
        } else if (heroTitle) {
            console.log('🔄 [DUAL-SYSTEM] Skipping hero title - handled by language manager');
        }

        // DUAL-SYSTEM: Section subtitle may be handled by unified-language-manager
        const sectionSubtitle = document.querySelector('.section-subtitle');
        if (sectionSubtitle && !sectionSubtitle.hasAttribute('data-i18n')) {
            sectionSubtitle.textContent = hero.subtitle || texts.subtitle;
            console.log('✅ Updated section subtitle:', hero.subtitle || texts.subtitle);
        } else if (sectionSubtitle) {
            console.log('🔄 [DUAL-SYSTEM] Skipping section subtitle - handled by language manager');
        }

        // DUAL-SYSTEM: Section title may be handled by unified-language-manager
        const sectionTitle = document.querySelector('.section-title');
        if (sectionTitle && !sectionTitle.hasAttribute('data-i18n')) {
            sectionTitle.textContent = hero.description || texts.mainTitle;
            console.log('✅ Updated section title:', hero.description || texts.mainTitle);
        } else if (sectionTitle) {
            console.log('🔄 [DUAL-SYSTEM] Skipping section title - handled by language manager');
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

    // Update Track Section
    function updateTrackSection() {
        const currentLocale = localStorage.getItem('preferred_locale') || 'en';

        const trackTexts = {
            en: {
                startLearning: 'Start Learning',
                browseCourses: 'Browse Courses'
            },
            ru: {
                startLearning: 'Начать обучение',
                browseCourses: 'Просмотреть курсы'
            },
            he: {
                startLearning: 'התחל ללמוד',
                browseCourses: 'עיין בקורסים'
            }
        };

        const texts = trackTexts[currentLocale] || trackTexts.en;

        // Update all Start Learning elements
        const startLearningElements = document.querySelectorAll('[data-i18n="pricing.content.track.start_learning"]');
        startLearningElements.forEach(element => {
            element.textContent = texts.startLearning;
        });

        // Update all Browse Courses elements
        const browseCoursesElements = document.querySelectorAll('[data-i18n="pricing.content.track.browse_courses"]');
        browseCoursesElements.forEach(element => {
            element.textContent = texts.browseCourses;
        });

        console.log(`✅ Updated Track section for locale: ${currentLocale}`);
    }

    // Update CTA Section
    function updateCTASection(cta) {
        console.log('📢 Updating CTA section...');

        // Get current locale
        const currentLocale = localStorage.getItem('preferred_locale') || 'en';

        // Default translations for CTA
        const ctaDefaults = {
            en: {
                subtitle: 'Start Learning Today',
                title: 'Discover A World Of Learning Opportunities.',
                description: "Don't wait to transform career and unlock your full potential. join our community of passionate learners and gain access to a wide range of courses.",
                button1: 'Get in Touch',
                button2: 'Check Out Courses'
            },
            ru: {
                subtitle: 'Начните учиться сегодня',
                title: 'Откройте мир возможностей обучения.',
                description: 'Не ждите, чтобы преобразовать карьеру и раскрыть свой полный потенциал. Присоединяйтесь к нашему сообществу увлеченных учеников.',
                button1: 'Связаться с нами',
                button2: 'Посмотреть курсы'
            },
            he: {
                subtitle: 'התחל ללמוד היום',
                title: 'גלה עולם של הזדמנויות למידה.',
                description: 'אל תחכה כדי לשנות את הקריירה שלך ולפתוח את מלוא הפוטנציאל שלך. הצטרף לקהילת הלומדים הנלהבים שלנו.',
                button1: 'צור קשר',
                button2: 'צפה בקורסים'
            }
        };

        const defaults = ctaDefaults[currentLocale] || ctaDefaults.en;

        // Update CTA subtitle
        const ctaSubtitle = document.querySelector('.section.cta .section-subtitle');
        if (ctaSubtitle) {
            ctaSubtitle.textContent = cta.subtitle || defaults.subtitle;
            console.log('✅ Updated CTA subtitle:', cta.subtitle || defaults.subtitle);
        }

        // Update CTA title
        const ctaTitle = document.querySelector('.cta-title');
        if (ctaTitle) {
            ctaTitle.textContent = cta.title || defaults.title;
            console.log('✅ Updated CTA title:', cta.title || defaults.title);
        }

        // Update CTA description
        const ctaDescription = document.querySelector('.cta-description-text');
        if (ctaDescription) {
            ctaDescription.textContent = cta.description || defaults.description;
            console.log('✅ Updated CTA description');
        }

        // Update buttons with proper translations
        const ctaButtons = document.querySelectorAll('.cta-button-wrapper .primary-button');
        if (ctaButtons.length >= 2) {
            // First button (Get in Touch)
            const button1Texts = ctaButtons[0].querySelectorAll('.primary-button-text-block');
            button1Texts.forEach(text => {
                text.textContent = defaults.button1;
            });

            // Second button (Check Out Courses)
            const button2Texts = ctaButtons[1].querySelectorAll('.primary-button-text-block');
            button2Texts.forEach(text => {
                text.textContent = defaults.button2;
            });

            console.log('✅ Updated CTA buttons for locale:', currentLocale);
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

            // Update feature lists
            updateFeatureLists();

            // Update Track section
            updateTrackSection();

            // Reload full content (respects data-i18n protection)
            loadNavigationData(); // Refresh navigation translations
            loadPricingContent();
        }, 500);
    });

    // Initialize
    if (isPricingPage()) {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', async () => {
                await loadNavigationData(); // Load navigation for translations first
                loadPricingContent();
                setupTabListeners();
            });
        } else {
            // DOM is already loaded
            (async () => {
                await loadNavigationData(); // Load navigation for translations first
                loadPricingContent();
                setupTabListeners();
            })();
        }
    } else {
        console.log('ℹ️ Not on pricing page, skipping initialization');
    }

})();