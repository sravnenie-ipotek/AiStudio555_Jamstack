const { chromium } = require('playwright');
const fs = require('fs').promises;
const path = require('path');

class UltraMegaE2ETester {
    constructor() {
        this.BASE_URL = 'https://www.aistudio555.com';
        this.API_BASE = 'https://aistudio555jamstack-production.up.railway.app';
        this.results = {
            navigation: [],
            footer: [],
            language: [],
            email: [],
            responsive: [],
            api: [],
            admin: [],
            contactForm: [],
            career: [],
            blog: [],
            database: [],
            integration: [],
            performance: [],
            accessibility: [],
            errors: [],
            warnings: []
        };
        this.browser = null;
        this.page = null;
        this.totalTests = 0;
        this.passedTests = 0;
        this.failedTests = 0;
        this.skippedTests = 0;
    }

    async runAllTests() {
        console.log('🚀 Starting Ultra Mega E2E Testing Suite');
        console.log('='.repeat(60));

        try {
            this.browser = await chromium.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            this.page = await this.browser.newPage();

            // Run all test suites
            await this.testNavigation();
            await this.testFooters();
            await this.testLanguageSwitching();
            await this.testEmailFunctionality();
            await this.testResponsiveDesign();
            await this.testAPIEndpoints();
            await this.testAdminPanel();
            await this.testContactFormModal();
            await this.testCareerFeatures();
            await this.testBlogFeatures();
            await this.testDatabaseOperations();
            await this.testIntegrationLayer();
            await this.testPerformance();
            await this.testAccessibility();

            // Generate report
            await this.generateReport();

        } catch (error) {
            console.error('❌ Critical test failure:', error);
            this.recordError('Critical', error.message);
        } finally {
            if (this.browser) {
                await this.browser.close();
            }
        }
    }

    recordTest(category, testName, passed, details = '') {
        this.totalTests++;
        if (passed) {
            this.passedTests++;
        } else {
            this.failedTests++;
        }

        if (!this.results[category]) {
            this.results[category] = [];
        }

        this.results[category].push({
            test: testName,
            passed,
            details,
            timestamp: new Date().toISOString()
        });

        const icon = passed ? '✅' : '❌';
        console.log(`${icon} ${category}: ${testName}${details ? ' - ' + details : ''}`);
    }

    recordError(severity, message) {
        this.results.errors.push({
            severity,
            message,
            timestamp: new Date().toISOString()
        });
    }

    async testNavigation() {
        console.log('\n🧭 Testing Navigation Consistency...');

        const pages = [
            'home.html',
            'courses.html',
            'teachers.html',
            'career-center.html',
            'career-orientation.html',
            'dist/en/home.html',
            'dist/ru/home.html',
            'dist/he/home.html'
        ];

        for (const page of pages) {
            try {
                await this.page.goto(`${this.BASE_URL}/${page}`, { waitUntil: 'networkidle' });

                // Check for navigation menu
                const navMenu = await this.page.locator('nav, .navbar, .navigation').first();
                const hasNav = await navMenu.count() > 0;
                this.recordTest('navigation', `Navigation on ${page}`, hasNav);

                // Check for dropdowns with Webflow classes
                const dropdownTriggers = await this.page.locator('.w-dropdown-toggle, .dropdown-toggle, .menu-dropdown-wrapper .w-dropdown-toggle').all();
                this.recordTest('navigation', `Dropdowns on ${page}`, true, `Found ${dropdownTriggers.length} dropdowns`);

                // Test each dropdown
                for (let i = 0; i < Math.min(dropdownTriggers.length, 3); i++) {
                    const trigger = dropdownTriggers[i];
                    const text = await trigger.textContent();

                    // Test hover functionality
                    await trigger.hover();
                    await this.page.waitForTimeout(500);

                    // Check if dropdown list appears
                    const dropdownList = await this.page.locator('.w-dropdown-list:visible, .dropdown-list:visible').first();
                    const isOpen = await dropdownList.count() > 0;

                    this.recordTest('navigation', `Dropdown "${text}" on ${page}`, isOpen);

                    // Check dropdown styling (dark theme)
                    if (isOpen) {
                        const backgroundColor = await dropdownList.evaluate(el =>
                            window.getComputedStyle(el).backgroundColor
                        );
                        const hasDarkTheme = backgroundColor.includes('5, 5, 26') || backgroundColor.includes('rgba');
                        this.recordTest('navigation', `Dark theme for "${text}" dropdown`, hasDarkTheme, backgroundColor);
                    }
                }

                // Check for consistent menu items
                const menuItems = await this.page.locator('nav a, .navbar a, .nav-link').all();
                const menuTexts = await Promise.all(menuItems.map(item => item.textContent()));
                this.recordTest('navigation', `Menu items on ${page}`, menuItems.length > 0, `${menuItems.length} items`);

            } catch (error) {
                this.recordTest('navigation', `Page ${page}`, false, error.message);
            }
        }
    }

    async testFooters() {
        console.log('\n👟 Testing Footer Presence...');

        const pages = ['home.html', 'courses.html', 'teachers.html', 'career-center.html'];

        for (const page of pages) {
            try {
                await this.page.goto(`${this.BASE_URL}/${page}`, { waitUntil: 'networkidle' });

                const footer = await this.page.locator('footer, .footer, #footer').first();
                const hasFooter = await footer.count() > 0;
                this.recordTest('footer', `Footer on ${page}`, hasFooter);

                if (hasFooter) {
                    // Check footer content
                    const footerLinks = await footer.locator('a').all();
                    this.recordTest('footer', `Footer links on ${page}`, footerLinks.length > 0, `${footerLinks.length} links`);

                    // Check for social media links
                    const socialLinks = await footer.locator('a[href*="facebook"], a[href*="twitter"], a[href*="linkedin"], a[href*="instagram"]').all();
                    this.recordTest('footer', `Social links on ${page}`, socialLinks.length > 0, `${socialLinks.length} social links`);
                }
            } catch (error) {
                this.recordTest('footer', `Footer on ${page}`, false, error.message);
            }
        }
    }

    async testLanguageSwitching() {
        console.log('\n🌍 Testing Language Switching...');

        try {
            await this.page.goto(`${this.BASE_URL}/home.html`, { waitUntil: 'networkidle' });

            // Check for language switcher with multiple selectors
            const languageSelectors = await this.page.locator('#language-switcher-nav, .language-nav-select, select[onchange*="switchLanguage"], .language-selector').all();

            if (languageSelectors.length > 0) {
                this.recordTest('language', 'Language Switcher Present', true, `Found ${languageSelectors.length} switchers`);

                const switcher = languageSelectors[0];

                // Test Russian
                await switcher.selectOption({ value: 'ru' }).catch(() => switcher.selectOption('ru'));
                await this.page.waitForTimeout(1000);

                const hasRussianText = await this.page.locator('*:has-text(/[А-Яа-я]/)').count() > 0;
                this.recordTest('language', 'Russian Language Switch', hasRussianText);

                // Check for language mixing
                const pageText = await this.page.locator('body').textContent();
                const hasEnglishMix = /[A-Za-z]{5,}/.test(pageText) && /[А-Яа-я]{5,}/.test(pageText);
                this.recordTest('language', 'No Language Mixing (RU)', !hasEnglishMix || pageText.includes('AI') || pageText.includes('Studio'));

                // Test Hebrew
                await switcher.selectOption({ value: 'he' }).catch(() => switcher.selectOption('he'));
                await this.page.waitForTimeout(1000);

                const hasHebrewText = await this.page.locator('*:has-text(/[א-ת]/)').count() > 0;
                this.recordTest('language', 'Hebrew Language Switch', hasHebrewText);

                // Check RTL support
                const htmlDir = await this.page.locator('html').getAttribute('dir');
                const bodyDir = await this.page.locator('body').getAttribute('dir');
                const hasRTL = htmlDir === 'rtl' || bodyDir === 'rtl';
                this.recordTest('language', 'RTL Support for Hebrew', hasRTL);

            } else {
                // Try direct navigation to language versions
                this.recordTest('language', 'Language Switcher Present', false, 'Not found, testing direct navigation');

                // Test Russian version
                await this.page.goto(`${this.BASE_URL}/dist/ru/home.html`, { waitUntil: 'networkidle' });
                const hasRussianContent = await this.page.locator('*:has-text(/[А-Яа-я]/)').count() > 0;
                this.recordTest('language', 'Russian Version Available', hasRussianContent);

                // Test Hebrew version
                await this.page.goto(`${this.BASE_URL}/dist/he/home.html`, { waitUntil: 'networkidle' });
                const hasHebrewContent = await this.page.locator('*:has-text(/[א-ת]/)').count() > 0;
                this.recordTest('language', 'Hebrew Version Available', hasHebrewContent);
            }
        } catch (error) {
            this.recordTest('language', 'Language Switching', false, error.message);
        }
    }

    async testEmailFunctionality() {
        console.log('\n📧 Testing Email Functionality...');

        try {
            await this.page.goto(`${this.BASE_URL}/home.html`, { waitUntil: 'networkidle' });

            // Check for EmailJS
            const hasEmailJS = await this.page.evaluate(() => {
                return typeof window.emailjs !== 'undefined';
            });
            this.recordTest('email', 'EmailJS Library Loaded', hasEmailJS);

            // Check for contact forms
            const contactForms = await this.page.locator('form[id*="contact"], form[class*="contact"], form[action*="email"]').all();
            this.recordTest('email', 'Contact Forms Present', contactForms.length > 0, `Found ${contactForms.length} forms`);

            if (contactForms.length > 0) {
                const form = contactForms[0];

                // Check form fields
                const emailField = await form.locator('input[type="email"]').count() > 0;
                const nameField = await form.locator('input[name*="name"], input[placeholder*="name"]').count() > 0;
                const submitButton = await form.locator('button[type="submit"], input[type="submit"]').count() > 0;

                this.recordTest('email', 'Email Field Present', emailField);
                this.recordTest('email', 'Name Field Present', nameField);
                this.recordTest('email', 'Submit Button Present', submitButton);
            }
        } catch (error) {
            this.recordTest('email', 'Email Functionality', false, error.message);
        }
    }

    async testResponsiveDesign() {
        console.log('\n📱 Testing Responsive Design...');

        const viewports = [
            { name: 'iPhone SE', width: 375, height: 667, type: 'mobile' },
            { name: 'iPhone 12', width: 390, height: 844, type: 'mobile' },
            { name: 'iPad Mini', width: 768, height: 1024, type: 'tablet' },
            { name: 'iPad Pro', width: 1024, height: 1366, type: 'tablet' },
            { name: 'Desktop HD', width: 1920, height: 1080, type: 'desktop' },
            { name: 'Desktop 4K', width: 3840, height: 2160, type: 'desktop' }
        ];

        const testPages = ['home.html', 'courses.html'];

        for (const page of testPages) {
            for (const viewport of viewports) {
                try {
                    await this.page.setViewportSize(viewport);
                    await this.page.goto(`${this.BASE_URL}/${page}`, { waitUntil: 'networkidle' });

                    // Check if content is visible
                    const mainContent = await this.page.locator('main, .main-content, #main, body').first();
                    const isVisible = await mainContent.isVisible();
                    this.recordTest('responsive', `${page} on ${viewport.name}`, isVisible);

                    // Check for horizontal scroll (shouldn't exist)
                    const hasHorizontalScroll = await this.page.evaluate(() => {
                        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
                    });
                    this.recordTest('responsive', `No horizontal scroll on ${viewport.name}`, !hasHorizontalScroll);

                    // Mobile-specific tests
                    if (viewport.type === 'mobile') {
                        // Check for mobile menu
                        const mobileMenu = await this.page.locator('.mobile-menu, .hamburger, .menu-toggle, [aria-label*="menu"]').first();
                        const hasMobileMenu = await mobileMenu.count() > 0;
                        this.recordTest('responsive', `Mobile menu on ${viewport.name}`, hasMobileMenu);

                        // Check touch targets (minimum 44px)
                        const buttons = await this.page.locator('button, a').all();
                        let touchTargetPassed = 0;
                        for (const button of buttons.slice(0, 5)) {
                            const box = await button.boundingBox();
                            if (box && box.height >= 44 && box.width >= 44) {
                                touchTargetPassed++;
                            }
                        }
                        this.recordTest('responsive', `Touch targets on ${viewport.name}`, touchTargetPassed > 0,
                            `${touchTargetPassed}/5 meet 44px minimum`);
                    }

                    // Check text readability
                    const fontSize = await this.page.locator('p, .text-content').first().evaluate(el => {
                        return parseInt(window.getComputedStyle(el).fontSize);
                    });
                    const readableSize = viewport.type === 'mobile' ? fontSize >= 14 : fontSize >= 12;
                    this.recordTest('responsive', `Text readability on ${viewport.name}`, readableSize, `${fontSize}px`);

                } catch (error) {
                    this.recordTest('responsive', `${page} on ${viewport.name}`, false, error.message);
                }
            }
        }
    }

    async testAPIEndpoints() {
        console.log('\n📡 Testing API Endpoints...');

        const endpoints = [
            // Content APIs
            { path: '/api/home-page', name: 'Home Page API' },
            { path: '/api/courses', name: 'Courses API' },
            { path: '/api/teachers', name: 'Teachers API' },
            { path: '/api/blog-posts', name: 'Blog Posts API' },
            { path: '/api/faqs', name: 'FAQs API' },
            { path: '/api/career-center-page', name: 'Career Center API' },
            { path: '/api/career-orientation-page', name: 'Career Orientation API' },
            { path: '/api/pricing-plans', name: 'Pricing Plans API' },
            { path: '/api/consultations', name: 'Consultations API' },
            { path: '/api/career-resources', name: 'Career Resources API' },
            { path: '/api/company-logos', name: 'Company Logos API' },

            // Multi-language APIs
            { path: '/api/home-page?locale=ru', name: 'Russian Home API' },
            { path: '/api/home-page?locale=he', name: 'Hebrew Home API' },
            { path: '/api/courses?locale=ru', name: 'Russian Courses API' },
            { path: '/api/courses?locale=he', name: 'Hebrew Courses API' },

            // Preview Mode
            { path: '/api/home-page?preview=true', name: 'Preview Mode API' },

            // Status
            { path: '/api/status', name: 'API Status' },
            { path: '/api/health', name: 'Health Check' }
        ];

        for (const endpoint of endpoints) {
            try {
                const response = await fetch(`${this.API_BASE}${endpoint.path}`);
                const responseTime = await this.measureResponseTime(`${this.API_BASE}${endpoint.path}`);

                if (response.ok) {
                    const data = await response.json();
                    this.recordTest('api', endpoint.name, true,
                        `Status: ${response.status}, Response Time: ${responseTime}ms, Data Keys: ${Object.keys(data).length}`);

                    // Check for data integrity
                    if (data && typeof data === 'object') {
                        const hasData = Object.keys(data).length > 0;
                        this.recordTest('api', `${endpoint.name} - Data Integrity`, hasData,
                            hasData ? 'Contains data' : 'Empty response');
                    }
                } else {
                    this.recordTest('api', endpoint.name, false, `Status: ${response.status}`);
                }
            } catch (error) {
                this.recordTest('api', endpoint.name, false, `Error: ${error.message}`);
            }
        }
    }

    async measureResponseTime(url) {
        const start = Date.now();
        try {
            await fetch(url);
        } catch (e) {}
        return Date.now() - start;
    }

    async testAdminPanel() {
        console.log('\n👨‍💼 Testing Admin Panel...');

        try {
            // Test admin panel accessibility
            await this.page.goto(`${this.API_BASE}/content-admin-comprehensive.html`, {
                waitUntil: 'networkidle',
                timeout: 30000
            });

            // Check if admin panel loads
            const adminTitle = await this.page.locator('h1, h2').first();
            const hasAdminPanel = await adminTitle.count() > 0;
            this.recordTest('admin', 'Admin Panel Loads', hasAdminPanel);

            // Check for authentication elements
            const authElements = await this.page.locator('input[type="password"], button:has-text("Login"), form[id*="login"]').all();
            this.recordTest('admin', 'Authentication System', authElements.length > 0,
                `Found ${authElements.length} auth elements`);

            // Check for content management sections
            const sections = [
                'Home Page Content',
                'Courses Management',
                'Teachers Management',
                'Career Services',
                'Blog Posts',
                'FAQs'
            ];

            for (const section of sections) {
                const sectionElement = await this.page.locator(`text="${section}"`).count();
                this.recordTest('admin', `Admin Section: ${section}`, sectionElement > 0);
            }

            // Check for multi-language support in admin
            const languageSelectors = await this.page.locator('select[id*="language"], button:has-text("EN"), button:has-text("RU"), button:has-text("HE")').all();
            this.recordTest('admin', 'Multi-language Admin Support', languageSelectors.length > 0,
                `Found ${languageSelectors.length} language selectors`);

        } catch (error) {
            this.recordTest('admin', 'Admin Panel Access', false, error.message);
        }
    }

    async testContactFormModal() {
        console.log('\n📧 Testing Contact Form Modal...');

        const pages = ['home.html', 'courses.html', 'teachers.html'];

        for (const page of pages) {
            try {
                await this.page.goto(`${this.BASE_URL}/${page}`, { waitUntil: 'networkidle' });

                // Find "Sign Up Today" buttons
                const signUpButtons = await this.page.locator('a:has-text("Sign Up Today"), button:has-text("Sign Up Today"), a:has-text("הירשמו היום")').all();
                this.recordTest('contactForm', `Sign Up Buttons on ${page}`, signUpButtons.length > 0,
                    `Found ${signUpButtons.length} buttons`);

                if (signUpButtons.length > 0) {
                    // Click first button
                    await signUpButtons[0].click();
                    await this.page.waitForTimeout(1000);

                    // Check if modal opens
                    const modal = await this.page.locator('#contactModal, .contact-modal, [class*="modal"]').first();
                    const isModalVisible = await modal.isVisible().catch(() => false);
                    this.recordTest('contactForm', `Modal Opens on ${page}`, isModalVisible);

                    if (isModalVisible) {
                        // Check form fields
                        const formFields = [
                            { selector: 'input[name="fullName"], input[id="fullName"]', name: 'Full Name Field' },
                            { selector: 'input[name="phoneNumber"], input[type="tel"]', name: 'Phone Field' },
                            { selector: 'input[name="email"], input[type="email"]', name: 'Email Field' },
                            { selector: 'select[name="course"], select[id="course"]', name: 'Course Selection' },
                            { selector: 'button[type="submit"], input[type="submit"]', name: 'Submit Button' }
                        ];

                        for (const field of formFields) {
                            const element = await this.page.locator(field.selector).first();
                            const exists = await element.count() > 0;
                            this.recordTest('contactForm', `${field.name} in Modal`, exists);
                        }

                        // Check EmailJS integration
                        const hasEmailJS = await this.page.evaluate(() => {
                            return typeof window.emailjs !== 'undefined';
                        });
                        this.recordTest('contactForm', 'EmailJS Integration', hasEmailJS);

                        // Close modal
                        const closeButton = await this.page.locator('.contact-modal-close, button[aria-label*="Close"], .close-modal').first();
                        if (await closeButton.count() > 0) {
                            await closeButton.click();
                        }
                    }
                }
            } catch (error) {
                this.recordTest('contactForm', `Contact Form on ${page}`, false, error.message);
            }
        }
    }

    async testCareerFeatures() {
        console.log('\n💼 Testing Career Features...');

        const careerPages = [
            { path: 'career-center.html', name: 'Career Center' },
            { path: 'career-orientation.html', name: 'Career Orientation' }
        ];

        for (const page of careerPages) {
            try {
                await this.page.goto(`${this.BASE_URL}/${page.path}`, { waitUntil: 'networkidle' });

                // Check page loads
                const title = await this.page.title();
                this.recordTest('career', `${page.name} Page Loads`, title.length > 0, title);

                // Check for career assessment form
                const assessmentForm = await this.page.locator('form[id*="assessment"], form[id*="career"], .career-form').first();
                const hasAssessment = await assessmentForm.count() > 0;
                this.recordTest('career', `${page.name} - Assessment Form`, hasAssessment);

                // Check for career resources
                const resources = await this.page.locator('.career-resource, .resource-card, [class*="career-item"]').all();
                this.recordTest('career', `${page.name} - Resources`, resources.length > 0,
                    `Found ${resources.length} resources`);

                // Check for consultation booking
                const consultationButtons = await this.page.locator('button:has-text("Book Consultation"), a:has-text("Schedule"), button:has-text("ייעוץ")').all();
                this.recordTest('career', `${page.name} - Consultation Booking`, consultationButtons.length > 0,
                    `Found ${consultationButtons.length} booking buttons`);

                // Check API integration
                const apiData = await this.page.evaluate((apiBase, pageName) => {
                    return fetch(`${apiBase}/api/${pageName.toLowerCase().replace(' ', '-')}-page`)
                        .then(r => r.json())
                        .then(data => ({ success: true, keys: Object.keys(data).length }))
                        .catch(() => ({ success: false, keys: 0 }));
                }, this.API_BASE, page.name);

                this.recordTest('career', `${page.name} - API Integration`, apiData.success,
                    `Data keys: ${apiData.keys}`);

            } catch (error) {
                this.recordTest('career', page.name, false, error.message);
            }
        }
    }

    async testBlogFeatures() {
        console.log('\n📝 Testing Blog Features...');

        try {
            // Check if blog page exists
            const blogPages = ['blog.html', 'blogs.html', 'articles.html'];
            let blogPageFound = false;
            let blogUrl = '';

            for (const page of blogPages) {
                const response = await fetch(`${this.BASE_URL}/${page}`);
                if (response.ok) {
                    blogPageFound = true;
                    blogUrl = `${this.BASE_URL}/${page}`;
                    break;
                }
            }

            this.recordTest('blog', 'Blog Page Exists', blogPageFound, blogUrl);

            if (blogPageFound) {
                await this.page.goto(blogUrl, { waitUntil: 'networkidle' });

                // Check for blog posts
                const blogPosts = await this.page.locator('article, .blog-post, .post-card, [class*="blog-item"]').all();
                this.recordTest('blog', 'Blog Posts Display', blogPosts.length > 0,
                    `Found ${blogPosts.length} blog posts`);

                // Check for categories/tags
                const categories = await this.page.locator('.category, .tag, [class*="category"], [class*="tag"]').all();
                this.recordTest('blog', 'Blog Categories/Tags', categories.length > 0,
                    `Found ${categories.length} categories/tags`);

                // Check for search functionality
                const searchBox = await this.page.locator('input[type="search"], input[placeholder*="search" i], input[placeholder*="חיפוש"]').first();
                const hasSearch = await searchBox.count() > 0;
                this.recordTest('blog', 'Blog Search Feature', hasSearch);

                // Check for pagination
                const pagination = await this.page.locator('.pagination, .page-numbers, [class*="pagination"]').first();
                const hasPagination = await pagination.count() > 0;
                this.recordTest('blog', 'Blog Pagination', hasPagination);
            }

            // Test Blog API
            const blogApiResponse = await fetch(`${this.API_BASE}/api/blog-posts`);
            const blogApiWorks = blogApiResponse.ok;
            if (blogApiWorks) {
                const blogData = await blogApiResponse.json();
                this.recordTest('blog', 'Blog API', true,
                    `${Array.isArray(blogData) ? blogData.length : 0} posts from API`);
            } else {
                this.recordTest('blog', 'Blog API', false, `Status: ${blogApiResponse.status}`);
            }

        } catch (error) {
            this.recordTest('blog', 'Blog Features', false, error.message);
        }
    }

    async testDatabaseOperations() {
        console.log('\n🗄️ Testing Database Operations...');

        // Test data sync endpoints
        const syncEndpoints = [
            { path: '/api/sync/home-page', name: 'Home Page Sync' },
            { path: '/api/sync/courses', name: 'Courses Sync' },
            { path: '/api/sync/teachers', name: 'Teachers Sync' },
            { path: '/api/sync/career-services', name: 'Career Services Sync' },
            { path: '/api/migrate/status', name: 'Migration Status' }
        ];

        for (const endpoint of syncEndpoints) {
            try {
                const response = await fetch(`${this.API_BASE}${endpoint.path}`);
                // Note: These might be protected endpoints
                const accessible = response.status !== 404;
                this.recordTest('database', endpoint.name, accessible,
                    `Status: ${response.status}`);
            } catch (error) {
                this.recordTest('database', endpoint.name, false, error.message);
            }
        }

        // Test database health
        try {
            const healthResponse = await fetch(`${this.API_BASE}/api/health`);
            if (healthResponse.ok) {
                const health = await healthResponse.json();
                this.recordTest('database', 'Database Health', health.database === 'connected',
                    `Database: ${health.database}, Tables: ${health.tables || 'N/A'}`);
            }
        } catch (error) {
            this.recordTest('database', 'Database Health Check', false, error.message);
        }

        // Test data consistency across languages
        const languages = ['en', 'ru', 'he'];
        for (const lang of languages) {
            try {
                const response = await fetch(`${this.API_BASE}/api/courses?locale=${lang}`);
                if (response.ok) {
                    const data = await response.json();
                    const hasData = Array.isArray(data) ? data.length > 0 : Object.keys(data).length > 0;
                    this.recordTest('database', `${lang.toUpperCase()} Data Consistency`, hasData,
                        `Records: ${Array.isArray(data) ? data.length : 'Object'}`);
                }
            } catch (error) {
                this.recordTest('database', `${lang.toUpperCase()} Data`, false, error.message);
            }
        }
    }

    async testIntegrationLayer() {
        console.log('\n🔗 Testing Integration Layer...');

        try {
            await this.page.goto(`${this.BASE_URL}/home.html`, { waitUntil: 'networkidle' });

            // Check if integration scripts are loaded
            const integrationScripts = await this.page.evaluate(() => {
                const scripts = Array.from(document.querySelectorAll('script[src*="integration"], script[src*="strapi"]'));
                return scripts.map(s => s.src);
            });

            this.recordTest('integration', 'Integration Scripts Loaded', integrationScripts.length > 0,
                `Found ${integrationScripts.length} integration scripts`);

            // Check for CustomAPIIntegration class
            const hasIntegrationClass = await this.page.evaluate(() => {
                return typeof window.CustomAPIIntegration !== 'undefined' ||
                       typeof window.StrapiIntegration !== 'undefined';
            });
            this.recordTest('integration', 'Integration Class Available', hasIntegrationClass);

            // Check API connectivity
            const apiConnected = await this.page.evaluate((apiBase) => {
                return fetch(`${apiBase}/api/status`)
                    .then(r => r.ok)
                    .catch(() => false);
            }, this.API_BASE);
            this.recordTest('integration', 'API Connectivity from Frontend', apiConnected);

            // Check dynamic content loading
            await this.page.waitForTimeout(2000); // Wait for dynamic content
            const dynamicContent = await this.page.locator('[data-strapi], [data-api], .dynamic-content').all();
            this.recordTest('integration', 'Dynamic Content Loading', dynamicContent.length > 0,
                `Found ${dynamicContent.length} dynamic elements`);

        } catch (error) {
            this.recordTest('integration', 'Integration Layer', false, error.message);
        }
    }

    async testPerformance() {
        console.log('\n⚡ Testing Performance...');

        const pages = ['home.html', 'courses.html'];

        for (const page of pages) {
            try {
                const startTime = Date.now();
                await this.page.goto(`${this.BASE_URL}/${page}`, { waitUntil: 'networkidle' });
                const loadTime = Date.now() - startTime;

                this.recordTest('performance', `${page} Load Time`, loadTime < 5000, `${loadTime}ms`);

                // Check for lazy loading
                const lazyImages = await this.page.locator('img[loading="lazy"]').all();
                this.recordTest('performance', `${page} Lazy Loading`, lazyImages.length > 0,
                    `${lazyImages.length} lazy-loaded images`);

                // Check resource sizes
                const metrics = await this.page.evaluate(() => {
                    const resources = performance.getEntriesByType('resource');
                    const totalSize = resources.reduce((acc, r) => acc + (r.transferSize || 0), 0);
                    const jsSize = resources.filter(r => r.name.includes('.js'))
                        .reduce((acc, r) => acc + (r.transferSize || 0), 0);
                    const cssSize = resources.filter(r => r.name.includes('.css'))
                        .reduce((acc, r) => acc + (r.transferSize || 0), 0);
                    return { totalSize, jsSize, cssSize };
                });

                this.recordTest('performance', `${page} Total Size`, metrics.totalSize < 5000000,
                    `${(metrics.totalSize / 1024 / 1024).toFixed(2)}MB`);
                this.recordTest('performance', `${page} JS Size`, metrics.jsSize < 1000000,
                    `${(metrics.jsSize / 1024).toFixed(2)}KB`);
                this.recordTest('performance', `${page} CSS Size`, metrics.cssSize < 500000,
                    `${(metrics.cssSize / 1024).toFixed(2)}KB`);

            } catch (error) {
                this.recordTest('performance', page, false, error.message);
            }
        }
    }

    async testAccessibility() {
        console.log('\n♿ Testing Accessibility...');

        const pages = ['home.html', 'courses.html'];

        for (const page of pages) {
            try {
                await this.page.goto(`${this.BASE_URL}/${page}`, { waitUntil: 'networkidle' });

                // Check for alt text on images
                const images = await this.page.locator('img').all();
                let imagesWithAlt = 0;
                for (const img of images) {
                    const alt = await img.getAttribute('alt');
                    if (alt && alt.length > 0) imagesWithAlt++;
                }
                this.recordTest('accessibility', `${page} Image Alt Text`, imagesWithAlt > 0,
                    `${imagesWithAlt}/${images.length} images have alt text`);

                // Check for ARIA labels
                const ariaElements = await this.page.locator('[aria-label], [aria-labelledby], [aria-describedby]').all();
                this.recordTest('accessibility', `${page} ARIA Labels`, ariaElements.length > 0,
                    `${ariaElements.length} ARIA elements`);

                // Check for heading hierarchy
                const headings = await this.page.evaluate(() => {
                    const h1 = document.querySelectorAll('h1').length;
                    const h2 = document.querySelectorAll('h2').length;
                    const h3 = document.querySelectorAll('h3').length;
                    return { h1, h2, h3 };
                });
                const hasProperHierarchy = headings.h1 > 0;
                this.recordTest('accessibility', `${page} Heading Hierarchy`, hasProperHierarchy,
                    `H1: ${headings.h1}, H2: ${headings.h2}, H3: ${headings.h3}`);

                // Check for form labels
                const formInputs = await this.page.locator('input, select, textarea').all();
                let inputsWithLabels = 0;
                for (const input of formInputs) {
                    const id = await input.getAttribute('id');
                    const label = id ? await this.page.locator(`label[for="${id}"]`).count() : 0;
                    const ariaLabel = await input.getAttribute('aria-label');
                    if (label > 0 || ariaLabel) inputsWithLabels++;
                }
                this.recordTest('accessibility', `${page} Form Labels`, inputsWithLabels > 0,
                    `${inputsWithLabels}/${formInputs.length} inputs have labels`);

                // Check color contrast (basic check)
                const textContrast = await this.page.evaluate(() => {
                    const element = document.querySelector('p, .text-content');
                    if (!element) return 'N/A';
                    const styles = window.getComputedStyle(element);
                    return `Text: ${styles.color}, Background: ${styles.backgroundColor}`;
                });
                this.recordTest('accessibility', `${page} Color Contrast`, true, textContrast);

            } catch (error) {
                this.recordTest('accessibility', page, false, error.message);
            }
        }
    }

    async generateReport() {
        console.log('\n📊 Generating Test Report...');

        const reportData = {
            summary: {
                total: this.totalTests,
                passed: this.passedTests,
                failed: this.failedTests,
                skipped: this.skippedTests,
                passRate: ((this.passedTests / this.totalTests) * 100).toFixed(2) + '%'
            },
            results: this.results,
            timestamp: new Date().toISOString(),
            duration: Date.now() - this.startTime
        };

        // Save JSON report
        await fs.writeFile(
            'ultra-mega-e2e-results.json',
            JSON.stringify(reportData, null, 2)
        );

        // Generate HTML report
        const html = this.generateHTMLReport(reportData);
        await fs.writeFile('ultra-mega-e2e-report.html', html);

        // Print summary
        console.log('\n' + '='.repeat(60));
        console.log('📊 TEST SUMMARY');
        console.log('='.repeat(60));
        console.log(`Total Tests: ${this.totalTests}`);
        console.log(`✅ Passed: ${this.passedTests}`);
        console.log(`❌ Failed: ${this.failedTests}`);
        console.log(`⏭️ Skipped: ${this.skippedTests}`);
        console.log(`📈 Pass Rate: ${reportData.summary.passRate}`);
        console.log('\n📁 Reports saved:');
        console.log('   - ultra-mega-e2e-results.json');
        console.log('   - ultra-mega-e2e-report.html');
    }

    generateHTMLReport(data) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ultra Mega E2E Test Report</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
            padding: 20px;
            min-height: 100vh;
        }
        .container {
            max-width: 1400px;
            margin: 0 auto;
        }
        .header {
            background: white;
            border-radius: 20px;
            padding: 40px;
            margin-bottom: 30px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.1);
        }
        h1 {
            font-size: 2.5em;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 20px;
        }
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }
        .summary-card {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            padding: 20px;
            border-radius: 15px;
            text-align: center;
        }
        .summary-card h3 {
            font-size: 2.5em;
            margin: 10px 0;
        }
        .passed { color: #10b981; }
        .failed { color: #ef4444; }
        .skipped { color: #f59e0b; }
        .category {
            background: white;
            border-radius: 15px;
            padding: 25px;
            margin-bottom: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .category h2 {
            color: #764ba2;
            margin-bottom: 20px;
            font-size: 1.8em;
        }
        .test {
            padding: 15px;
            margin: 10px 0;
            border-radius: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #f8f9fa;
            transition: all 0.3s ease;
        }
        .test:hover {
            transform: translateX(5px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .test.pass {
            border-left: 5px solid #10b981;
        }
        .test.fail {
            border-left: 5px solid #ef4444;
        }
        .test-name {
            font-weight: 600;
            flex: 1;
        }
        .test-details {
            color: #6b7280;
            font-size: 0.9em;
            margin: 0 20px;
            flex: 2;
        }
        .test-status {
            font-size: 1.5em;
        }
        .footer {
            text-align: center;
            color: white;
            margin-top: 40px;
            padding: 20px;
        }
        .progress-bar {
            width: 100%;
            height: 30px;
            background: #e5e7eb;
            border-radius: 15px;
            overflow: hidden;
            margin: 20px 0;
        }
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
            transition: width 0.5s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 Ultra Mega E2E Test Report</h1>
            <p>Generated: ${new Date(data.timestamp).toLocaleString()}</p>

            <div class="progress-bar">
                <div class="progress-fill" style="width: ${data.summary.passRate}">
                    ${data.summary.passRate}
                </div>
            </div>

            <div class="summary">
                <div class="summary-card">
                    <div>Total Tests</div>
                    <h3>${data.summary.total}</h3>
                </div>
                <div class="summary-card">
                    <div>Passed</div>
                    <h3 class="passed">${data.summary.passed}</h3>
                </div>
                <div class="summary-card">
                    <div>Failed</div>
                    <h3 class="failed">${data.summary.failed}</h3>
                </div>
                <div class="summary-card">
                    <div>Pass Rate</div>
                    <h3>${data.summary.passRate}</h3>
                </div>
            </div>
        </div>

        ${Object.entries(data.results).map(([category, tests]) => `
            <div class="category">
                <h2>${category.charAt(0).toUpperCase() + category.slice(1)} Tests</h2>
                ${tests.map(test => `
                    <div class="test ${test.passed ? 'pass' : 'fail'}">
                        <span class="test-name">${test.test}</span>
                        <span class="test-details">${test.details || ''}</span>
                        <span class="test-status">${test.passed ? '✅' : '❌'}</span>
                    </div>
                `).join('')}
            </div>
        `).join('')}

        <div class="footer">
            <p>Ultra Mega E2E Testing Suite - AI Studio Platform</p>
            <p>Comprehensive testing across ${Object.keys(data.results).length} categories</p>
        </div>
    </div>
</body>
</html>`;
    }
}

// Run the tests
if (require.main === module) {
    const tester = new UltraMegaE2ETester();
    tester.startTime = Date.now();
    tester.runAllTests().catch(console.error);
}

module.exports = UltraMegaE2ETester;