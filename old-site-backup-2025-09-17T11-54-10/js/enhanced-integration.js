/**
 * Enhanced Integration for AI Studio
 * Hybrid approach: Static translations + Dynamic API content
 * Works for both local and production environments
 */

class EnhancedIntegration {
    constructor() {
        // Environment detection
        this.isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

        // Detect API endpoint based on current port
        const currentPort = window.location.port;
        if (currentPort === '3005') {
            // Frontend on Python server (3005), API on Express (1337)
            this.API_BASE = 'http://localhost:3000/api';
        } else if (currentPort === '4005') {
            // Legacy port - still use 1337
            this.API_BASE = 'http://localhost:3000/api';
        } else if (this.isLocal) {
            // Default local setup
            this.API_BASE = 'http://localhost:3000/api';
        } else {
            // Production
            this.API_BASE = 'https://aistudio555jamstack-production.up.railway.app/api';
        }

        // Language detection
        this.currentLanguage = this.detectLanguage();

        // Load translations config
        this.loadTranslationsConfig();

        console.log('🚀 Enhanced Integration initialized');
        console.log(`📍 Environment: ${this.isLocal ? 'LOCAL' : 'PRODUCTION'}`);
        console.log(`🌍 Language: ${this.currentLanguage}`);
        console.log(`🔗 API: ${this.API_BASE}`);
    }

    detectLanguage() {
        // Check URL path for language folder
        const pathParts = window.location.pathname.split('/').filter(p => p);
        const pathLang = pathParts.find(part => ['en', 'ru', 'he'].includes(part));

        if (pathLang) {
            localStorage.setItem('preferredLanguage', pathLang);
            return pathLang;
        }

        // Check localStorage
        const storedLang = localStorage.getItem('preferredLanguage');
        if (storedLang && ['en', 'ru', 'he'].includes(storedLang)) {
            return storedLang;
        }

        // Default to English
        return 'en';
    }

    loadTranslationsConfig() {
        // Load the translations configuration
        const script = document.createElement('script');
        script.src = '/js/translations-config.js';
        script.onload = () => {
            console.log('✅ Translations config loaded');
            this.applyStaticTranslations();
        };
        document.head.appendChild(script);
    }

    applyStaticTranslations() {
        // Apply static translations as fallback only
        const lang = this.currentLanguage;

        // Mark elements as having static translations (will be overridden by API)
        const bannerSubtitle = document.querySelector('.banner-subtitle');
        const bannerHeading = document.querySelector('.banner-heading');
        const bannerDescription = document.querySelector('.banner-description-text');

        if (typeof TRANSLATIONS !== 'undefined') {
            // Apply banner translations ONLY as placeholder
            // These will be overridden by API content when available
            if (bannerSubtitle) {
                bannerSubtitle.setAttribute('data-static-translation', 'true');
                bannerSubtitle.textContent = TRANSLATIONS.banner.subtitle[lang] || TRANSLATIONS.banner.subtitle.en;
            }
            if (bannerHeading) {
                bannerHeading.setAttribute('data-static-translation', 'true');
                bannerHeading.textContent = TRANSLATIONS.banner.title[lang] || TRANSLATIONS.banner.title.en;
            }
            if (bannerDescription) {
                bannerDescription.setAttribute('data-static-translation', 'true');
                bannerDescription.textContent = TRANSLATIONS.banner.description[lang] || TRANSLATIONS.banner.description.en;
            }

            // Apply navigation translations (keep these as they're not from database)
            this.applyNavigationTranslations(lang);

            // Apply button translations
            this.applyButtonTranslations(lang);

            console.log(`⚠️ Static translations applied as FALLBACK for ${lang} (will be overridden by API)`);
        }
    }

    applyNavigationTranslations(lang) {
        // Skip navigation translation for Hebrew pages - they already have correct Hebrew text
        if (lang === 'he') {
            console.log('📌 Skipping navigation translation - Hebrew page already has correct Hebrew text');
            return;
        }

        // Navigation links
        const navMappings = {
            'Home': TRANSLATIONS.nav.home[lang],
            'Courses': TRANSLATIONS.nav.courses[lang],
            'Teachers': TRANSLATIONS.nav.teachers[lang],
            'Career Services': TRANSLATIONS.nav.careerServices[lang],
            'Career Orientation': TRANSLATIONS.nav.careerOrientation[lang],
            'Career Center': TRANSLATIONS.nav.careerCenter[lang],
            'Pricing': TRANSLATIONS.nav.pricing[lang],
            'Blog': TRANSLATIONS.nav.blog ? TRANSLATIONS.nav.blog[lang] : 'Blog'
        };

        // Update nav links
        document.querySelectorAll('.nav-link, .dropdown-toggle-text-block, .dropdown-menu-text-link-block div').forEach(link => {
            const text = link.textContent.trim();
            if (navMappings[text]) {
                link.textContent = navMappings[text];
            }
        });
    }

    applyButtonTranslations(lang) {
        // Sign Up buttons
        document.querySelectorAll('.primary-button-text-block').forEach(button => {
            if (button.textContent.includes('Sign Up')) {
                button.textContent = TRANSLATIONS.buttons.signUpToday[lang] || TRANSLATIONS.buttons.signUpToday.en;
            }
        });
    }

    async initialize() {
        try {
            // Apply static translations first (immediate)
            this.applyStaticTranslations();

            // Then try to load dynamic content from API
            const apiAvailable = await this.checkAPIStatus();

            if (apiAvailable) {
                await this.loadDynamicContent();
            } else {
                console.log('⚠️ API not available, using static translations only');
            }

            // Set up language switcher
            this.setupLanguageSwitcher();

            return true;
        } catch (error) {
            console.error('❌ Integration error:', error);
            return false;
        }
    }

    async checkAPIStatus() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

            const response = await fetch(`${this.API_BASE}/status`, {
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                console.log('✅ API is available');
                return true;
            }
        } catch (error) {
            console.log('⚠️ API check failed:', error.message);
        }
        return false;
    }

    async loadDynamicContent() {
        const currentPath = window.location.pathname;
        const pageName = currentPath.split('/').pop()?.replace('.html', '') || 'home';

        console.log(`🔄 Loading dynamic content for: ${pageName}`);

        try {
            switch (pageName) {
                case 'home':
                case 'index':
                    await this.loadHomeContent();
                    break;
                case 'courses':
                    await this.loadCoursesContent();
                    break;
                case 'teachers':
                    await this.loadTeachersContent();
                    break;
                default:
                    console.log(`ℹ️ No dynamic loader for: ${pageName}`);
            }
        } catch (error) {
            console.error('❌ Failed to load dynamic content:', error);
        }
    }

    async loadHomeContent() {
        try {
            let response = await fetch(`${this.API_BASE}/home-page?locale=${this.currentLanguage}`);

            if (!response.ok) {
                // Try fallback without locale parameter
                console.log('⚠️ Locale-specific API failed, trying fallback...');
                response = await fetch(`${this.API_BASE}/home-page`);

                if (!response.ok) {
                    throw new Error('Both API endpoints failed');
                }
            }

            const data = await response.json();

            if (data.data && data.data.attributes) {
                const attributes = data.data.attributes;

                // Update hero section with correct API structure
                if (attributes.heroTitle || attributes.heroSubtitle || attributes.heroDescription) {
                    this.updateHomeHero({
                        title: attributes.heroTitle,
                        subtitle: attributes.heroSubtitle || attributes.heroExpertLed,
                        description: attributes.heroDescription
                    });
                }

                // Update practice section
                this.updatePracticeSection(attributes);

                // Update learning features
                this.updateLearningFeatures(attributes);
            }

            // Load FAQ content dynamically
            await this.loadFAQContent();

            // Load button texts dynamically
            await this.loadButtonTexts();

            // Load footer content dynamically
            await this.loadFooterContent();

            console.log('✅ Dynamic home content loaded');
        } catch (error) {
            console.log('⚠️ Using static content for home page');
        }
    }

    updateHomeHero(heroData) {
        if (!heroData) return;

        // Update with correct selectors
        const bannerSubtitle = document.querySelector('.banner-subtitle');
        const bannerHeading = document.querySelector('.banner-heading, h1.banner-heading');
        const bannerDescription = document.querySelector('.banner-description-text, p.banner-description-text');

        // Priority: Always use API content when available
        if (bannerSubtitle && heroData.subtitle) {
            bannerSubtitle.textContent = heroData.subtitle;
            console.log(`📝 Updated subtitle from API: "${heroData.subtitle}"`);
        }

        if (bannerHeading && heroData.title) {
            bannerHeading.textContent = heroData.title;
            console.log(`📝 Updated title from API: "${heroData.title}"`);
        }

        if (bannerDescription && heroData.description) {
            bannerDescription.textContent = heroData.description;
            console.log(`📝 Updated description from API: "${heroData.description}"`);
        }

        console.log('✅ Hero section updated from API (overriding static translations)');
    }

    updatePracticeSection(attributes) {
        if (!attributes.practiceDescription) return;

        // Find the practice section description element
        const practiceDescElement = document.querySelector('.section-description-text.why-choose-us');

        if (practiceDescElement) {
            practiceDescElement.textContent = attributes.practiceDescription;
            console.log('✅ Practice section updated from API');
        }
    }

    updateLearningFeatures(attributes) {
        // Array of feature data
        const features = [
            { title: attributes.feature1Title, description: attributes.feature1Description },
            { title: attributes.feature2Title, description: attributes.feature2Description },
            { title: attributes.feature3Title, description: attributes.feature3Description },
            { title: attributes.feature4Title, description: attributes.feature4Description },
            { title: attributes.feature5Title, description: attributes.feature5Description },
            { title: attributes.feature6Title, description: attributes.feature6Description }
        ];

        // Update each feature
        features.forEach((feature, index) => {
            if (feature.title && feature.description) {
                // Find title and description elements for this feature
                const titleElements = document.querySelectorAll('.course-categories-single-title');
                const descElements = document.querySelectorAll('.course-categories-single-description');

                if (titleElements[index] && descElements[index]) {
                    titleElements[index].textContent = feature.title;
                    descElements[index].textContent = feature.description;
                }
            }
        });

        console.log('✅ Learning features updated from API');
    }

    async loadFAQContent() {
        try {
            const response = await fetch(`${this.API_BASE}/faqs?locale=${this.currentLanguage}`);

            if (!response.ok) {
                console.log('⚠️ FAQ API not available');
                return;
            }

            const data = await response.json();

            if (data.data && data.data.length > 0) {
                // Find the FAQ accordion container
                const faqContainer = document.querySelector('.faq-accordion-wrapper.w-tab-menu');

                if (!faqContainer) {
                    console.log('⚠️ FAQ container not found');
                    return;
                }

                // Clear existing static FAQs
                faqContainer.innerHTML = '';

                // Add dynamic FAQs
                data.data.forEach((faq, index) => {
                    const faqItem = document.createElement('a');
                    faqItem.setAttribute('data-w-tab', `Tab ${index + 1}`);
                    faqItem.className = index === 0 ? 'single-faq-accordion-wrap w-inline-block w-tab-link w--current' : 'single-faq-accordion-wrap w-inline-block w-tab-link';

                    faqItem.innerHTML = `
                        <div class="faq-accordion-question-wrap">
                            <h3 class="faq-question">Q: ${faq.attributes.question}</h3>
                            <div class="faq-icon-wrapper">
                                <img src="images/Faq-Icon.svg" loading="lazy" alt="" class="faq-icon">
                            </div>
                        </div>
                        <div class="faq-accordion-answer-wrap">
                            <p class="faq-answer">${faq.attributes.answer}</p>
                        </div>
                    `;

                    faqContainer.appendChild(faqItem);
                });

                console.log(`✅ Loaded ${data.data.length} FAQs from API`);
            }
        } catch (error) {
            console.error('❌ Failed to load FAQs:', error);
        }
    }

    async loadButtonTexts() {
        try {
            const response = await fetch(`${this.API_BASE}/button-texts?locale=${this.currentLanguage}`);

            if (!response.ok) {
                console.log('⚠️ Button texts API not available');
                return;
            }

            const data = await response.json();

            if (data.data && data.data.attributes) {
                const buttons = data.data.attributes;

                // Update "Get Started" buttons
                if (buttons.get_started) {
                    document.querySelectorAll('.primary-button-text-block').forEach(btn => {
                        if (btn.textContent.toLowerCase().includes('get') && btn.textContent.toLowerCase().includes('start')) {
                            btn.textContent = buttons.get_started;
                        }
                    });
                }

                // Update "Learn More" buttons
                if (buttons.learn_more) {
                    document.querySelectorAll('.primary-button-text-block, .secondary-button-text-block').forEach(btn => {
                        if (btn.textContent.toLowerCase().includes('learn') && btn.textContent.toLowerCase().includes('more')) {
                            btn.textContent = buttons.learn_more;
                        }
                    });
                }

                // Update "Enroll Now" buttons
                if (buttons.enroll_now) {
                    document.querySelectorAll('.primary-button-text-block').forEach(btn => {
                        if (btn.textContent.toLowerCase().includes('enroll') || btn.textContent.toLowerCase().includes('sign up')) {
                            btn.textContent = buttons.enroll_now;
                        }
                    });
                }

                // Update "Contact Us" buttons
                if (buttons.contact_us) {
                    document.querySelectorAll('.primary-button-text-block').forEach(btn => {
                        if (btn.textContent.toLowerCase().includes('contact') || btn.textContent.toLowerCase().includes('touch')) {
                            btn.textContent = buttons.contact_us;
                        }
                    });
                }

                console.log('✅ Button texts updated from API');
            }
        } catch (error) {
            console.error('❌ Failed to load button texts:', error);
        }
    }

    async loadFooterContent() {
        try {
            const response = await fetch(`${this.API_BASE}/site-settings?locale=${this.currentLanguage}`);

            if (!response.ok) {
                console.log('⚠️ Site settings API not available');
                return;
            }

            const data = await response.json();

            if (data) {
                // Update footer email
                if (data.footer_email) {
                    const emailElement = document.querySelector('.footer-contact-details-text');
                    if (emailElement && emailElement.textContent.includes('@')) {
                        emailElement.textContent = data.footer_email;
                    }
                }

                // Update footer copyright
                if (data.footer_copyright) {
                    const copyrightElement = document.querySelector('.footer-information-text');
                    if (copyrightElement) {
                        // Keep the design and links, just update the main copyright text
                        const currentText = copyrightElement.innerHTML;
                        const updatedText = currentText.replace(
                            /© Copyright - .*? \|/,
                            `${data.footer_copyright} |`
                        );
                        copyrightElement.innerHTML = updatedText;
                    }
                }

                // Update site name in footer links if available
                if (data.site_name) {
                    const siteNameLinks = document.querySelectorAll('.footer-information-text-link');
                    siteNameLinks.forEach(link => {
                        if (link.textContent.includes('Zohacous')) {
                            link.textContent = data.site_name;
                        }
                    });
                }

                console.log('✅ Footer content updated from API');
            }
        } catch (error) {
            console.error('❌ Failed to load footer content:', error);
        }
    }

    async loadCoursesContent() {
        try {
            const response = await fetch(`${this.API_BASE}/courses?locale=${this.currentLanguage}`);
            if (!response.ok) throw new Error('Failed to fetch courses');

            const data = await response.json();

            if (data.data && data.data.length > 0) {
                this.updateCoursesGrid(data.data);
                console.log(`✅ Loaded ${data.data.length} courses from API`);
            }
        } catch (error) {
            console.log('⚠️ Using static courses content');
        }
    }

    async loadTeachersContent() {
        try {
            const response = await fetch(`${this.API_BASE}/teachers?locale=${this.currentLanguage}`);
            if (!response.ok) throw new Error('Failed to fetch teachers');

            const data = await response.json();

            if (data.data && data.data.length > 0) {
                this.updateTeachersGrid(data.data);
                console.log(`✅ Loaded ${data.data.length} teachers from API`);
            }
        } catch (error) {
            console.log('⚠️ Using static teachers content');
        }
    }

    updateCoursesGrid(courses) {
        // Implementation for updating courses grid
        console.log('📚 Updating courses grid...');
    }

    updateTeachersGrid(teachers) {
        // Implementation for updating teachers grid
        console.log('👨‍🏫 Updating teachers grid...');
    }

    setupLanguageSwitcher() {
        // Listen for language change events
        document.addEventListener('languageChanged', (event) => {
            const newLang = event.detail.locale;
            console.log(`🌐 Language changed to: ${newLang}`);

            // Update current language
            this.currentLanguage = newLang;

            // Reapply translations
            this.applyStaticTranslations();

            // Reload dynamic content if API is available
            this.loadDynamicContent();
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.enhancedIntegration = new EnhancedIntegration();
        window.enhancedIntegration.initialize();
    });
} else {
    window.enhancedIntegration = new EnhancedIntegration();
    window.enhancedIntegration.initialize();
}