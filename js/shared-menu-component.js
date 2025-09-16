// Ultra-thin Shared Menu Component v2.9
// Single source of truth for navigation across all pages
// WEBFLOW COMPATIBLE VERSION
// v2.9: Aggressive Hebrew positioning fix + compact layout for Russian overflow

(function() {
    'use strict';

    // Detect current language and page
    const currentPath = window.location.pathname;
    let currentLang = 'en';
    console.log('Current path:', currentPath);

    if (currentPath.includes('/he/')) currentLang = 'he';
    else if (currentPath.includes('/ru/')) currentLang = 'ru';
    else if (currentPath.includes('/en/')) currentLang = 'en';

    // Get current page name for active state
    const currentPage = currentPath.split('/').pop().replace('.html', '') || 'home';

    // Menu translations
    const menuText = {
        en: {
            home: 'Home',
            courses: 'View All Courses',
            teachers: 'Teachers',
            careerServices: 'Career Services',
            careerOrientation: 'Career Orientation',
            careerCenter: 'Career Center',
            pricing: 'Pricing Plans',
            signUp: 'Sign Up Today'
        },
        ru: {
            home: 'Главная',
            courses: 'Все курсы',
            teachers: 'Преподаватели',
            careerServices: 'Карьерные услуги',
            careerOrientation: 'Карьерная ориентация',
            careerCenter: 'Карьерный центр',
            pricing: 'Планы ценообразования',
            signUp: 'Зарегистрироваться сегодня'
        },
        he: {
            home: 'בית',
            courses: 'קורסים',
            teachers: 'מורים',
            careerServices: 'שירותי קריירה',
            careerOrientation: 'כיוון קריירה',
            careerCenter: 'מרכז קריירה',
            pricing: 'תוכניות תמחור',
            signUp: 'הרשמו היום'
        }
    };

    // Get current language translations
    const t = menuText[currentLang] || menuText.en;

    // URL builder based on current language
    function getUrl(page) {
        if (currentLang === 'en') {
            return page + '.html';
        }
        // For Hebrew and Russian pages, check if we're already in a language directory
        if (currentPath.includes('/' + currentLang + '/')) {
            // We're already in a language directory, use relative paths
            return page + '.html';
        }
        return '/' + currentLang + '/' + page + '.html';
    }

    console.log('Current language detected:', currentLang);
    console.log('Using translations:', t);
    console.log('Building menu HTML...');
    console.log('t.home =', t.home);
    console.log('t.courses =', t.courses);
    console.log('t.teachers =', t.teachers);
    console.log('t.pricing =', t.pricing);

    const urls = {
        home: getUrl('home'),
        courses: getUrl('courses'),
        teachers: getUrl('teachers'),
        pricing: getUrl('pricing')
    };

    console.log('URLs:', urls);

    // Wait for DOM to be ready
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    // Inject navigation if missing, or update existing navigation elements
    function updateNavigation() {
        console.log('🚀 Shared menu component initializing... v2.6.5 (Consistent Button Styling)');
        console.log('📱 Viewport width:', window.innerWidth);
        console.log('🌐 Current language:', currentLang);
        console.log('📄 Current page:', currentPage);

        // Check if navigation exists
        const existingNavbar = document.querySelector('.navbar, .w-nav, nav');
        const menuContainer = document.getElementById('shared-menu-container');

        console.log('🔍 Navigation check:');
        console.log('  - existingNavbar:', existingNavbar);
        console.log('  - menuContainer:', menuContainer);
        console.log('  - condition (!existingNavbar && menuContainer):', (!existingNavbar && menuContainer));

        if (!existingNavbar && menuContainer) {
            console.log('📝 Navigation not found, injecting menu structure...');
            injectCompleteNavigation(menuContainer);
        } else {
            console.log('🔄 Navigation found, updating existing elements...');
            updateExistingNavigation();
        }

        console.log('✅ Shared menu component initialized');
    }

    // Inject complete navigation structure
    function injectCompleteNavigation(container) {
        const navigationHTML = `
        <style>
            /* Hide desktop language selector on mobile */
            @media (max-width: 991px) {
                .language-selector.desktop-only {
                    display: none !important;
                }
            }
            /* Show desktop language selector on desktop */
            @media (min-width: 992px) {
                .language-selector.desktop-only {
                    display: block !important;
                }
            }

            /* Mobile-specific layout - button beneath hamburger */
            @media (max-width: 767px) {
                .navbar-content {
                    display: flex !important;
                    flex-direction: row !important;
                    justify-content: space-between !important;
                    align-items: flex-start !important;
                    flex-wrap: wrap !important;
                }

                /* Position hamburger menu at top right */
                .w-nav-button {
                    order: 1 !important;
                    margin-left: auto !important;
                    margin-bottom: 10px !important;
                }

                /* Position Sign Up button beneath hamburger */
                .navbar-button-wrapper.mobile-top {
                    order: 2 !important;
                    position: absolute !important;
                    top: 60px !important;
                    right: 20px !important;
                    width: auto !important;
                    display: block !important;
                    z-index: 1000 !important;
                }

                .navbar-button-wrapper.mobile-top .primary-button {
                    display: block !important;
                    width: auto !important;
                    text-align: center !important;
                    padding: 8px 16px !important;
                    border-radius: 6px !important;
                    font-size: 14px !important;
                    white-space: nowrap !important;
                }

                /* Hide logo on mobile */
                .nav-brand {
                    display: none !important;
                }

                /* Hide desktop button on mobile */
                .navbar-button-wrapper:not(.mobile-top) {
                    display: none !important;
                }
            }

            /* Hebrew RTL Support */
            html[dir="rtl"] .navbar-content,
            body.rtl .navbar-content,
            [lang="he"] .navbar-content {
                direction: rtl !important;
            }

            @media (max-width: 767px) {
                html[dir="rtl"] .navbar-content,
                body.rtl .navbar-content,
                [lang="he"] .navbar-content {
                    align-items: flex-end !important;
                }

                html[dir="rtl"] .navbar-button-wrapper.mobile-top,
                body.rtl .navbar-button-wrapper.mobile-top,
                [lang="he"] .navbar-button-wrapper.mobile-top {
                    text-align: right !important;
                    direction: rtl !important;
                }

                html[dir="rtl"] .navbar-button-wrapper.mobile-top .primary-button,
                body.rtl .navbar-button-wrapper.mobile-top .primary-button,
                [lang="he"] .navbar-button-wrapper.mobile-top .primary-button {
                    text-align: center !important;
                    direction: rtl !important;
                }
            }

            /* Desktop layout */
            @media (min-width: 768px) {
                .navbar-button-wrapper.mobile-top {
                    display: none !important;
                }

                .navbar-content {
                    flex-direction: row !important;
                }
            }
        </style>
        <div role="banner" class="navbar w-nav" ${currentLang === 'he' ? 'dir="rtl" lang="he"' : ''}>
            <div class="container">
                <div class="navbar-content" ${currentLang === 'he' ? 'dir="rtl"' : ''}>
                    <!-- Mobile Sign Up Button (Shows above logo on mobile) -->
                    <div class="navbar-button-wrapper mobile-top">
                        <a href="#" class="primary-button w-button" onclick="window.showModal(); return false;" style="background: linear-gradient(135deg, rgb(0, 128, 255), rgb(0, 198, 255)) !important; color: rgb(255, 255, 255) !important; border: none !important;">${t.signUp}</a>
                    </div>

                    <a href="${urls.home}" class="nav-brand">
                        <img loading="lazy" src="../images/logoNew.png" alt="" class="logo-image">
                    </a>

                    <!-- Mobile Menu Button will be handled by universal-mobile-navigation-fix.js -->

                    <!-- Desktop Navigation -->
                    <nav class="nav-menu w-nav-menu">
                        <a href="${urls.home}" class="nav-link home-link ${currentPage === 'home' ? 'w--current' : ''}">${t.home}</a>
                        <a href="${urls.courses}" class="nav-link ${currentPage === 'courses' ? 'w--current' : ''}">${t.courses}</a>
                        <a href="${urls.teachers}" class="nav-link ${currentPage === 'teachers' ? 'w--current' : ''}">${t.teachers}</a>

                        <div class="menu-dropdown-wrapper w-dropdown">
                            <div class="dropdown-toggle w-dropdown-toggle">
                                <div class="dropdown-toggle-text-block">${t.careerServices}</div>
                                <div class="dropdown-toggle-arrow-2">▼</div>
                            </div>
                            <nav class="dropdown-list w-dropdown-list">
                                <a href="${getUrl('career-orientation')}" class="dropdown-menu-text-link-block w-inline-block">
                                    <div>${t.careerOrientation}</div>
                                </a>
                                <a href="${getUrl('career-center')}" class="dropdown-menu-text-link-block w-inline-block">
                                    <div>${t.careerCenter}</div>
                                </a>
                            </nav>
                        </div>

                        <a href="${urls.pricing}" class="nav-link ${currentPage === 'pricing' ? 'w--current' : ''}">${t.pricing}</a>
                    </nav>

                    <!-- Language Selector - Desktop Only -->
                    <div class="language-selector desktop-only" style="display: none !important;">
                        <select class="language-nav-select" style="background: transparent !important; border: none !important; color: rgba(255, 255, 255, 0.9) !important; padding: 8px 12px !important; border-radius: 6px !important; cursor: pointer !important; outline: none !important; appearance: none !important; -webkit-appearance: none !important; -moz-appearance: none !important;">
                            <option value="en" ${currentLang === 'en' ? 'selected' : ''} style="background: #05051a !important; color: white !important;">🇬🇧 English</option>
                            <option value="ru" ${currentLang === 'ru' ? 'selected' : ''} style="background: #05051a !important; color: white !important;">🇷🇺 Русский</option>
                            <option value="he" ${currentLang === 'he' ? 'selected' : ''} style="background: #05051a !important; color: white !important;">🇮🇱 עברית</option>
                        </select>
                    </div>

                    <!-- Sign Up Button (Always Last for All Languages) -->
                    <div class="navbar-button-wrapper">
                        <a href="#" class="primary-button w-button" onclick="window.showModal(); return false;" style="background: linear-gradient(135deg, rgb(0, 128, 255), rgb(0, 198, 255)) !important; color: rgb(255, 255, 255) !important; border: none !important;">${t.signUp}</a>
                    </div>
                </div>
            </div>
            <!-- Mobile Menu Overlay -->
            <div class="w-nav-overlay"></div>
        </div>`;

        container.innerHTML = navigationHTML;

        // Initialize dropdown functionality
        initDropdownFunctionality();

        // Mobile menu functionality disabled - handled by universal-mobile-navigation-fix.js
        // initMobileMenuFunctionality();

        console.log('✅ Complete navigation injected');
    }

    // Update existing navigation elements
    function updateExistingNavigation() {
        // Update navigation links
        const homeLinks = document.querySelectorAll('a[href*="home.html"], .home-link, .nav-link[href*="home"]');
        homeLinks.forEach(link => {
            link.href = urls.home;
            // Only update text if it's not the brand logo link
            if (!link.classList.contains('nav-brand') && !link.querySelector('img')) {
                link.textContent = t.home;
            }
            if (currentPage === 'home') {
                link.classList.add('w--current');
            }
        });

        const coursesLinks = document.querySelectorAll('a[href*="courses.html"]');
        coursesLinks.forEach(link => {
            link.href = urls.courses;
            if (link.textContent.trim() !== t.courses) {
                link.textContent = t.courses;
            }
            if (currentPage === 'courses') {
                link.classList.add('w--current');
            }
        });

        const teachersLinks = document.querySelectorAll('a[href*="teachers.html"]');
        teachersLinks.forEach(link => {
            link.href = urls.teachers;
            if (link.textContent.trim() !== t.teachers) {
                link.textContent = t.teachers;
            }
            if (currentPage === 'teachers') {
                link.classList.add('w--current');
            }
        });

        // Update career dropdown links - but preserve existing Hebrew text
        const careerOrientationLinks = document.querySelectorAll('a[href*="career-orientation.html"]');
        careerOrientationLinks.forEach(link => {
            link.href = getUrl('career-orientation');
            const currentText = link.textContent.trim();
            console.log(`🎯 Career Orientation Link: "${currentText}" → "${t.careerOrientation}"`);

            // Check if text is already correct Hebrew (preserve it)
            const isCorrectHebrew = currentText === 'כיוון קריירה' && currentLang === 'he';

            if (!isCorrectHebrew && currentText !== t.careerOrientation) {
                link.textContent = t.careerOrientation;
                // Also update any child divs that might contain the text
                const childDiv = link.querySelector('div');
                if (childDiv) {
                    childDiv.textContent = t.careerOrientation;
                    console.log(`📝 Updated child div for career orientation`);
                }
            } else if (isCorrectHebrew) {
                console.log(`✅ Preserving correct Hebrew text: "${currentText}"`);
            }
        });

        const careerCenterLinks = document.querySelectorAll('a[href*="career-center.html"]');
        careerCenterLinks.forEach(link => {
            link.href = getUrl('career-center');
            const currentText = link.textContent.trim();
            console.log(`🎯 Career Center Link: "${currentText}" → "${t.careerCenter}"`);

            // Check if text is already correct Hebrew (preserve it)
            const isCorrectHebrew = currentText === 'מרכז קריירה' && currentLang === 'he';

            if (!isCorrectHebrew && currentText !== t.careerCenter) {
                link.textContent = t.careerCenter;
                // Also update any child divs that might contain the text
                const childDiv = link.querySelector('div');
                if (childDiv) {
                    childDiv.textContent = t.careerCenter;
                    console.log(`📝 Updated child div for career center`);
                }
            } else if (isCorrectHebrew) {
                console.log(`✅ Preserving correct Hebrew text: "${currentText}"`);
            }
        });

        // Update pricing links
        const pricingLinks = document.querySelectorAll('a[href*="pricing.html"]');
        pricingLinks.forEach(link => {
            link.href = urls.pricing;
            if (link.textContent.trim() !== t.pricing) {
                link.textContent = t.pricing;
            }
            if (currentPage === 'pricing') {
                link.classList.add('w--current');
            }
        });

        // Update dropdown toggle text
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        dropdownToggles.forEach(toggle => {
            if (toggle.textContent.trim() !== t.careerServices + ' ▼') {
                toggle.innerHTML = `<div class="dropdown-toggle-text-block">${t.careerServices}</div><div class="dropdown-toggle-arrow-2">▼</div>`;
            }
        });

        // Update sign up buttons and add popup functionality
        const signUpButtons = document.querySelectorAll('.nav-link.signup, .signup-button, .cta-button, .primary-button');
        signUpButtons.forEach(button => {
            if (button.textContent.trim() !== t.signUp) {
                button.textContent = t.signUp;
            }
            // Add popup functionality
            button.onclick = function(e) {
                e.preventDefault();
                if (typeof window.showModal === 'function') {
                    window.showModal();
                }
                return false;
            };
            button.href = '#';

            // Force consistent button styling for sign up buttons in navbar
            if (button.classList.contains('primary-button') && button.closest('.navbar, .navbar-button-wrapper')) {
                button.style.cssText = `
                    background: linear-gradient(135deg, rgb(0, 128, 255), rgb(0, 198, 255)) !important;
                    color: rgb(255, 255, 255) !important;
                    border: none !important;
                `;
            }
        });

        // Replace old language selector with new one that has flags
        const oldLanguageSelectors = document.querySelectorAll('.language-nav-select, .language-selector select');
        oldLanguageSelectors.forEach(oldSelector => {
            const parent = oldSelector.parentElement;
            if (parent) {
                // Create new language selector with flags
                const newSelectorHTML = `
                    <select class="language-nav-select" style="background: transparent !important; border: none !important; color: rgba(255, 255, 255, 0.9) !important; padding: 8px 12px !important; border-radius: 6px !important; cursor: pointer !important; outline: none !important; appearance: none !important; -webkit-appearance: none !important; -moz-appearance: none !important;">
                        <option value="en" ${currentLang === 'en' ? 'selected' : ''} style="background: #05051a !important; color: white !important;">🇬🇧 English</option>
                        <option value="ru" ${currentLang === 'ru' ? 'selected' : ''} style="background: #05051a !important; color: white !important;">🇷🇺 Русский</option>
                        <option value="he" ${currentLang === 'he' ? 'selected' : ''} style="background: #05051a !important; color: white !important;">🇮🇱 עברית</option>
                    </select>
                `;

                // Replace old selector
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = newSelectorHTML;
                const newSelector = tempDiv.firstElementChild;

                // Copy event listeners
                newSelector.addEventListener('change', function(e) {
                    const selectedLang = e.target.value;
                    const currentPage = window.location.pathname.split('/').pop() || 'home.html';
                    window.location.href = `/${selectedLang}/${currentPage}`;
                });

                parent.replaceChild(newSelector, oldSelector);
                console.log('✅ Replaced language selector with flag version');

                // For Hebrew, aggressively move language selector to the end
                if (currentLang === 'he') {
                    setTimeout(() => {
                        const navbar = document.querySelector('.navbar-content, .w-nav-menu');
                        const langSelectorContainer = newSelector.closest('.language-selector, .language-nav-wrapper, div');

                        if (navbar && langSelectorContainer) {
                            // Force move to absolute end
                            navbar.appendChild(langSelectorContainer);

                            // Also apply CSS to ensure it stays last
                            langSelectorContainer.style.order = '999';
                            langSelectorContainer.style.marginLeft = 'auto';
                            langSelectorContainer.style.marginRight = '0';

                            console.log('📍 Aggressively moved language selector to end for Hebrew');
                        }
                    }, 100);
                }
            }
        });

        // Update career dropdown position fix
        const careerDropdowns = document.querySelectorAll('.dropdown, .menu-dropdown-wrapper');
        careerDropdowns.forEach(dropdown => {
            dropdown.style.position = 'relative';
        });
    }

    // Initialize dropdown functionality for injected navigation
    function initDropdownFunctionality() {
        const dropdowns = document.querySelectorAll('.menu-dropdown-wrapper');
        dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            const list = dropdown.querySelector('.dropdown-list');

            if (toggle && list) {
                // Click functionality
                toggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    list.classList.toggle('w--open');
                });

                // Hover functionality
                dropdown.addEventListener('mouseenter', function() {
                    list.classList.add('w--open');
                });

                dropdown.addEventListener('mouseleave', function() {
                    list.classList.remove('w--open');
                });
            }
        });
    }

    // Initialize mobile menu functionality
    function initMobileMenuFunctionality() {
        // Ensure menu starts closed
        const body = document.body;
        const html = document.documentElement;
        body.classList.remove('w--nav-menu-open');
        html.classList.remove('w--nav-menu-open');

        // AGGRESSIVE MOBILE MENU HIDING - Force styles directly
        const menu = document.querySelector('.w-nav-menu');
        if (menu && window.innerWidth <= 991) {
            menu.style.setProperty('display', 'none', 'important');
            menu.style.setProperty('visibility', 'hidden', 'important');
            menu.style.setProperty('opacity', '0', 'important');
            menu.style.setProperty('transform', 'translateX(-100%)', 'important');
            menu.style.setProperty('left', '-9999px', 'important');
            menu.style.setProperty('top', '-9999px', 'important');
            console.log('📱 Menu forcefully hidden with inline styles');
        }

        console.log('📱 Menu initialized in closed state');

        // Add global toggle function
        window.toggleMobileMenu = function() {
            if (body.classList.contains('w--nav-menu-open')) {
                // Close menu
                body.classList.remove('w--nav-menu-open');
                html.classList.remove('w--nav-menu-open');
                console.log('📱 Mobile menu closed');
            } else {
                // Open menu
                body.classList.add('w--nav-menu-open');
                html.classList.add('w--nav-menu-open');
                console.log('📱 Mobile menu opened');
            }
        };

        // Force close menu function
        window.closeMobileMenu = function() {
            body.classList.remove('w--nav-menu-open');
            html.classList.remove('w--nav-menu-open');

            // Force hide with inline styles
            const menu = document.querySelector('.w-nav-menu');
            if (menu && window.innerWidth <= 991) {
                menu.style.setProperty('display', 'none', 'important');
                menu.style.setProperty('visibility', 'hidden', 'important');
                menu.style.setProperty('opacity', '0', 'important');
                menu.style.setProperty('transform', 'translateX(-100%)', 'important');
                menu.style.setProperty('left', '-9999px', 'important');
                menu.style.setProperty('top', '-9999px', 'important');
            }

            console.log('📱 Mobile menu force closed');
        };

        // Wait a bit for other scripts to finish, then attach the click handler
        setTimeout(() => {
            // Ensure menu is still closed after other scripts run
            body.classList.remove('w--nav-menu-open');
            html.classList.remove('w--nav-menu-open');

            // Force hide menu again after other scripts
            const menu = document.querySelector('.w-nav-menu');
            if (menu && window.innerWidth <= 991) {
                menu.style.setProperty('display', 'none', 'important');
                menu.style.setProperty('visibility', 'hidden', 'important');
                menu.style.setProperty('opacity', '0', 'important');
                menu.style.setProperty('transform', 'translateX(-100%)', 'important');
                menu.style.setProperty('left', '-9999px', 'important');
                menu.style.setProperty('top', '-9999px', 'important');
                console.log('📱 Menu forcefully hidden again after scripts');
            }

            const hamburgerButton = document.querySelector('.w-nav-button');
            if (hamburgerButton) {
                // Remove any existing event listeners by cloning the node
                const newButton = hamburgerButton.cloneNode(true);
                hamburgerButton.parentNode.replaceChild(newButton, hamburgerButton);

                // Add our click handler
                newButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('📱 Hamburger button clicked!');
                    window.toggleMobileMenu();
                });

                console.log('✅ Mobile menu button click handler attached');
            }

            // Close menu when overlay is clicked
            const overlay = document.querySelector('.w-nav-overlay');
            if (overlay) {
                overlay.addEventListener('click', function() {
                    window.closeMobileMenu();
                });
            }

            // Close menu when nav links are clicked (on mobile)
            const navLinks = document.querySelectorAll('.w-nav-menu .nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    if (window.innerWidth <= 991) {
                        setTimeout(() => {
                            window.closeMobileMenu();
                        }, 100);
                    }
                });
            });

            // Add escape key to close menu
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && body.classList.contains('w--nav-menu-open')) {
                    window.closeMobileMenu();
                }
            });

        }, 500); // Wait 500ms for other scripts to finish

        console.log('✅ Mobile menu functionality initialized');
    }

    // Language selector functionality
    function initLanguageSelector() {
        const languageSelectors = document.querySelectorAll('.language-nav-select, .language-selector select');

        languageSelectors.forEach(selector => {
            // Set current language as selected
            const currentOption = selector.querySelector(`option[value="${currentLang}"]`);
            if (currentOption) {
                selector.value = currentLang;
            }

            // Add change event listener
            selector.addEventListener('change', function() {
                const selectedLang = this.value;
                if (selectedLang !== currentLang) {
                    // Get current page name
                    const pageName = currentPage || 'home';

                    // Build new URL
                    let newUrl;
                    if (selectedLang === 'en') {
                        newUrl = `/${pageName}.html`;
                    } else {
                        newUrl = `/${selectedLang}/${pageName}.html`;
                    }

                    // Navigate to new language
                    window.location.href = newUrl;
                }
            });
        });
    }

    // Remove duplicate menus that might exist
    function removeDuplicateMenus() {
        console.log('🧹 Checking for duplicate menus...');

        const navbars = document.querySelectorAll('.navbar');
        if (navbars.length > 1) {
            console.log(`⚠️ Found ${navbars.length} navbar elements, removing duplicates...`);

            // Keep the first one, remove the rest
            for (let i = 1; i < navbars.length; i++) {
                navbars[i].remove();
                console.log(`🗑️ Removed duplicate navbar ${i + 1}`);
            }
        }

        const navMenus = document.querySelectorAll('.nav-menu');
        if (navMenus.length > 1) {
            console.log(`⚠️ Found ${navMenus.length} nav-menu elements, removing duplicates...`);

            // Keep the first one, remove the rest
            for (let i = 1; i < navMenus.length; i++) {
                navMenus[i].remove();
                console.log(`🗑️ Removed duplicate nav-menu ${i + 1}`);
            }
        }
    }

    // Initialize everything
    ready(function() {
        console.log('🟢 DOM ready, initializing shared menu...');
        console.log('Current path:', currentPath);
        console.log('Current language:', currentLang);
        console.log('Menu container exists:', !!document.getElementById('shared-menu-container'));
        console.log('Existing navbar:', !!document.querySelector('.navbar, .w-nav, nav'));

        // Initialize immediately - don't wait for other scripts
        console.log('🚀 Starting menu initialization immediately...');
        removeDuplicateMenus();
        updateNavigation();
        initLanguageSelector();

        // Also run after a small delay to catch any late-loaded elements
        setTimeout(() => {
            console.log('🔄 Running secondary menu initialization...');
            removeDuplicateMenus();
            updateNavigation();
            initLanguageSelector();

            // Force close any menu that might have been opened by other scripts
            const body = document.body;
            const html = document.documentElement;
            body.classList.remove('w--nav-menu-open');
            html.classList.remove('w--nav-menu-open');

            // Force hide with inline styles
            const menu = document.querySelector('.w-nav-menu');
            if (menu && window.innerWidth <= 991) {
                menu.style.setProperty('display', 'none', 'important');
                menu.style.setProperty('visibility', 'hidden', 'important');
                menu.style.setProperty('opacity', '0', 'important');
                menu.style.setProperty('transform', 'translateX(-100%)', 'important');
                menu.style.setProperty('left', '-9999px', 'important');
                menu.style.setProperty('top', '-9999px', 'important');
            }

            console.log('🔒 Ensured mobile menu is closed after all initialization');
        }, 200);

        // Additional safety check after all scripts should be done
        setTimeout(() => {
            const body = document.body;
            const html = document.documentElement;
            body.classList.remove('w--nav-menu-open');
            html.classList.remove('w--nav-menu-open');

            // Final force hide
            const menu = document.querySelector('.w-nav-menu');
            if (menu && window.innerWidth <= 991) {
                menu.style.setProperty('display', 'none', 'important');
                menu.style.setProperty('visibility', 'hidden', 'important');
                menu.style.setProperty('opacity', '0', 'important');
                menu.style.setProperty('transform', 'translateX(-100%)', 'important');
                menu.style.setProperty('left', '-9999px', 'important');
                menu.style.setProperty('top', '-9999px', 'important');
            }

            console.log('🔒 Final safety check - mobile menu forced closed');
        }, 1000);
    });

})();