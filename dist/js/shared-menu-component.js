// Ultra-thin Shared Menu Component
// Single source of truth for navigation across all pages

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
            courses: 'Courses',
            teachers: 'Teachers',
            careerServices: 'Career Services',
            careerOrientation: 'Career Orientation',
            careerCenter: 'Career Center',
            pricing: 'Pricing',
            language: 'Language 🌐',
            signUp: 'Sign Up Today'
        },
        ru: {
            home: 'Главная',
            courses: 'Курсы',
            teachers: 'Преподаватели',
            careerServices: 'Карьерные услуги',
            careerOrientation: 'Профориентация',
            careerCenter: 'Карьерный центр',
            pricing: 'Цены',
            signUp: 'Зарегистрироваться'
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

    // Get translations for current language
    const t = menuText[currentLang] || menuText['en']; // Fallback to English if language not found

    // Debug log
    console.log('Current language detected:', currentLang);
    console.log('Using translations:', t);

    // Build language-aware URLs
    const getUrl = (page) => {
        if (currentLang === 'en') return `/${page}.html`;
        return `/${currentLang}/${page}.html`;
    };

    // Build menu HTML with explicit debug values for Hebrew
    console.log('Building menu HTML...');
    console.log('t.home =', t.home);
    console.log('t.courses =', t.courses);
    console.log('t.teachers =', t.teachers);
    console.log('t.pricing =', t.pricing);
    console.log('URLs:', { home: getUrl('home'), courses: getUrl('courses'), teachers: getUrl('teachers'), pricing: getUrl('pricing') });

    const menuHTML = `
        <div role="banner" class="navbar custom-nav">
            <div class="container">
                <div class="navbar-content">
                    <a href="${getUrl('home')}" class="zohacous-logo-link nav-brand">
                        <img loading="lazy" src="../images/Logo 2.svg" alt="" class="zohacous-logo-image">
                    </a>
                    <nav role="navigation" class="nav-menu custom-nav-menu">
                        <a href="${getUrl('home')}" class="nav-link custom-nav-link ${currentPage === 'home' ? 'current-page' : ''}">${t.home || 'בית'}</a>
                        <a href="${getUrl('courses')}" class="nav-link custom-nav-link ${currentPage === 'courses' ? 'current-page' : ''}">${t.courses || 'קורסים'}</a>
                        <a href="${getUrl('teachers')}" class="nav-link custom-nav-link ${currentPage === 'teachers' ? 'current-page' : ''}">${t.teachers || 'מורים'}</a>
                        <a href="#" id="career-dropdown" class="nav-link custom-nav-link" onclick="toggleCareerDropdown(); return false;" style="position: relative;">
                            <span>${t.careerServices}</span>
                            <span style="font-size: 10px; margin-left: 5px;">▼</span>
                            <div id="careerDropdownMenu" style="
                                display: none;
                                position: absolute;
                                top: 100%;
                                left: 0;
                                background: rgba(5, 5, 26, 0.98);
                                backdrop-filter: blur(20px);
                                border-radius: 4px;
                                padding: 10px 0;
                                min-width: 180px;
                                z-index: 1000;
                                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                            ">
                                <a href="${getUrl('career-orientation')}" style="display: block; padding: 8px 16px; color: #fff; text-decoration: none;" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='transparent'">${t.careerOrientation}</a>
                                <a href="${getUrl('career-center')}" style="display: block; padding: 8px 16px; color: #fff; text-decoration: none;" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='transparent'">${t.careerCenter}</a>
                            </div>
                        </a>
                        <a href="${getUrl('pricing')}" class="nav-link custom-nav-link ${currentPage === 'pricing' ? 'current-page' : ''}">${t.pricing || 'תוכניות תמחור'}</a>
                        <!-- Language Selector integrated as navigation item -->
                        <div class="language-nav-item">
                            <select id="language-switcher-nav" onchange="switchLanguageSelect(this.value)" class="language-nav-select">
                                <option value="en" ${currentLang === 'en' ? 'selected' : ''}>EN</option>
                                <option value="ru" ${currentLang === 'ru' ? 'selected' : ''}>RU</option>
                                <option value="he" ${currentLang === 'he' ? 'selected' : ''}>HE</option>
                            </select>
                        </div>
                    </nav>
                    <div class="navbar-button-wrapper">
                        <div class="primary-button-wrapper desktop">
                            <a href="#" data-w-id="102c5b61-ca91-3c28-1e26-0f7381b431b7" class="primary-button w-inline-block">
                                <div class="primary-button-text-wrap">
                                    <div class="primary-button-text-block">${t.signUp}</div>
                                </div>
                            </a>
                        </div>
                    </div>
                    <div class="menu-button w-nav-button" tabindex="0" role="button" aria-label="menu">
                        <div class="w-icon-nav-menu">
                            <span></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Career dropdown toggle function
    window.toggleCareerDropdown = function() {
        const dropdown = document.getElementById('careerDropdownMenu');
        if (dropdown) {
            dropdown.style.display = dropdown.style.display === 'none' || dropdown.style.display === '' ? 'block' : 'none';
        }
    };


    // Language switch function for select dropdown
    window.switchLanguageSelect = function(lang) {
        const currentPath = window.location.pathname;
        const currentFile = currentPath.split('/').pop() || 'home.html';
        const newPath = `/${lang}/${currentFile}`;
        window.location.href = newPath;
    };

    // Inject menu into page
    function injectMenu() {
        const menuContainer = document.getElementById('shared-menu-container');
        if (menuContainer) {
            console.log('📝 Menu HTML content check:');
            console.log('Contains Hebrew home:', menuHTML.includes('בית'));
            console.log('Contains Hebrew courses:', menuHTML.includes('קורסים'));
            console.log('First 500 chars of menuHTML:', menuHTML.substring(0, 500));
            menuContainer.innerHTML = menuHTML;

            // Force visibility after injection (only on desktop)
            setTimeout(() => {
                const menu = menuContainer.querySelector('.nav-menu.w-nav-menu');
                if (menu && window.innerWidth > 991) {
                    menu.style.setProperty('display', 'flex', 'important');
                    menu.style.setProperty('visibility', 'visible', 'important');
                    menu.style.setProperty('opacity', '1', 'important');
                }
            }, 100);
        } else {
            // Fallback: Replace existing navbar if container not found
            const existingNavbar = document.querySelector('.navbar.w-nav');
            if (existingNavbar) {
                existingNavbar.outerHTML = menuHTML;
            }
        }
    }

    // Apply menu styles
    function applyMenuStyles() {
        // Load custom navigation CSS (Webflow-free)
        if (!document.getElementById('custom-nav-css')) {
            const link = document.createElement('link');
            link.id = 'custom-nav-css';
            link.rel = 'stylesheet';
            link.href = '../css/custom-nav-no-webflow.css?v=1.1';
            document.head.appendChild(link);
        }

        // Load external CSS for better language selector styling
        if (!document.getElementById('menu-language-fix-css')) {
            const link = document.createElement('link');
            link.id = 'menu-language-fix-css';
            link.rel = 'stylesheet';
            link.href = '../css/menu-language-fix.css?v=2.4';
            document.head.appendChild(link);
        }

        if (!document.getElementById('shared-menu-styles')) {
            const style = document.createElement('style');
            style.id = 'shared-menu-styles';
            style.textContent = `
                /* Shared Menu Component Styles - Desktop First */
                #shared-menu-container .nav-menu.w-nav-menu,
                #shared-menu-container .w-nav-menu,
                .nav-menu.w-nav-menu,
                .w-nav-menu {
                    position: static !important;
                    background: transparent !important;
                    align-items: center !important;
                    flex-wrap: nowrap !important;
                    width: auto !important;
                    max-width: none !important;
                    overflow: visible !important;
                    justify-content: flex-start !important;
                    gap: 35px !important;
                }

                /* RTL specific adjustments for Hebrew */
                [dir="rtl"] .nav-menu.w-nav-menu,
                [dir="rtl"] #shared-menu-container .w-nav-menu {
                    direction: rtl !important;
                    flex-direction: row-reverse !important;
                    justify-content: flex-end !important;
                }

                /* Desktop specific styles */
                @media screen and (min-width: 992px) {
                    #shared-menu-container .nav-menu.w-nav-menu,
                    #shared-menu-container .w-nav-menu,
                    .nav-menu.w-nav-menu,
                    .w-nav-menu {
                        display: flex !important;
                        visibility: visible !important;
                        opacity: 1 !important;
                    }
                }

                /* Force navbar visible */
                #shared-menu-container .navbar,
                .navbar.w-nav {
                    display: block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                }

                .navbar-content {
                    display: flex !important;
                    align-items: center !important;
                    justify-content: flex-start !important;
                    width: 100% !important;
                    max-width: 100% !important;
                }

                .navbar-button-wrapper {
                    display: flex !important;
                    align-items: center !important;
                    margin-left: auto !important;
                }

                .w-nav-button {
                    display: none !important;
                }

                @media screen and (max-width: 991px) {
                    .w-nav-button {
                        display: block !important;
                        position: fixed !important;
                        top: 20px !important;
                        right: 20px !important;
                        z-index: 1001 !important;
                        background: rgba(0, 0, 0, 0.5) !important;
                        border: none !important;
                        cursor: pointer !important;
                        padding: 10px !important;
                        width: 40px !important;
                        height: 40px !important;
                        border-radius: 4px !important;
                    }

                    /* RTL Hebrew positioning */
                    html[dir="rtl"] .w-nav-button {
                        right: auto !important;
                        left: 20px !important;
                    }

                    /* Hamburger icon styling */
                    .w-nav-button .w-icon-nav-menu {
                        position: relative !important;
                        width: 24px !important;
                        height: 20px !important;
                        display: block !important;
                    }

                    .w-nav-button .w-icon-nav-menu::before,
                    .w-nav-button .w-icon-nav-menu::after {
                        content: '' !important;
                        position: absolute !important;
                        display: block !important;
                        width: 100% !important;
                        height: 2px !important;
                        background: #fff !important;
                        transition: all 0.3s ease !important;
                    }

                    .w-nav-button .w-icon-nav-menu::before {
                        top: 0 !important;
                    }

                    .w-nav-button .w-icon-nav-menu::after {
                        bottom: 0 !important;
                    }

                    .w-nav-button .w-icon-nav-menu span {
                        position: absolute !important;
                        display: block !important;
                        width: 100% !important;
                        height: 2px !important;
                        background: #fff !important;
                        top: 50% !important;
                        transform: translateY(-50%) !important;
                        transition: all 0.3s ease !important;
                    }

                    /* Close button (X) when menu is open */
                    body.w--nav-menu-open .w-nav-button {
                        position: fixed !important;
                        z-index: 1002 !important;
                    }

                    body.w--nav-menu-open .w-nav-button .w-icon-nav-menu::before {
                        transform: rotate(45deg) translateY(8px) !important;
                    }

                    body.w--nav-menu-open .w-nav-button .w-icon-nav-menu::after {
                        transform: rotate(-45deg) translateY(-8px) !important;
                    }

                    body.w--nav-menu-open .w-nav-button .w-icon-nav-menu span {
                        opacity: 0 !important;
                    }

                    /* Override desktop menu styles on mobile - Ultra Specific */
                    body #shared-menu-container .w-nav-menu,
                    body .nav-menu.w-nav-menu,
                    body .w-nav-menu,
                    .navbar .w-nav-menu {
                        display: none !important;
                        visibility: hidden !important;
                        opacity: 0 !important;
                        position: fixed !important;
                        top: 0 !important;
                        left: 0 !important;
                        width: 100% !important;
                        height: 100vh !important;
                        background: rgba(5, 5, 26, 0.98) !important;
                        z-index: 1000 !important;
                        flex-direction: column !important;
                        justify-content: flex-start !important;
                        align-items: stretch !important;
                        padding: 80px 0 20px 0 !important;
                        backdrop-filter: blur(20px) !important;
                        flex-wrap: nowrap !important;
                        gap: 0 !important;
                        overflow-y: auto !important;
                    }

                    /* Show menu when open class is present - Ultra Specific */
                    body.w--nav-menu-open #shared-menu-container .w-nav-menu,
                    body.w--nav-menu-open .nav-menu.w-nav-menu,
                    body.w--nav-menu-open .w-nav-menu,
                    body.w--nav-menu-open .navbar .w-nav-menu {
                        display: flex !important;
                        visibility: visible !important;
                        opacity: 1 !important;
                    }

                    /* Mobile menu items styling */
                    body.w--nav-menu-open .w-nav-menu > .nav-link {
                        display: block !important;
                        width: 100% !important;
                        padding: 20px 30px !important;
                        margin: 0 !important;
                        border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
                        text-align: left !important;
                        font-size: 18px !important;
                        line-height: 1.5 !important;
                        height: auto !important;
                        min-height: 60px !important;
                        color: #fff !important;
                        text-decoration: none !important;
                        transition: background 0.3s ease !important;
                        flex-shrink: 0 !important;
                        box-sizing: border-box !important;
                        z-index: 1001 !important;
                        position: relative !important;
                        pointer-events: auto !important;
                    }

                    /* RTL support for Hebrew */
                    body[dir="rtl"].w--nav-menu-open .w-nav-menu .nav-link {
                        text-align: right !important;
                        direction: rtl !important;
                    }

                    /* Mobile menu hover states */
                    body.w--nav-menu-open .w-nav-menu .nav-link:hover {
                        background: rgba(255, 255, 255, 0.05) !important;
                    }

                    /* Mobile dropdowns */
                    body.w--nav-menu-open #language-switcher,
                    body.w--nav-menu-open #career-dropdown {
                        border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
                    }

                    /* Explicit language switcher visibility - Override any conflicting rules */
                    body.w--nav-menu-open #language-switcher {
                        display: block !important;
                        visibility: visible !important;
                        opacity: 1 !important;
                        z-index: 1001 !important;
                        position: relative !important;
                        pointer-events: auto !important;
                    }


                    body.w--nav-menu-open #languageDropdown,
                    body.w--nav-menu-open #careerDropdownMenu {
                        position: static !important;
                        margin-top: 10px !important;
                        width: 100% !important;
                        background: rgba(0, 0, 0, 0.3) !important;
                        border-radius: 4px !important;
                        padding: 5px 0 !important;
                        left: auto !important;
                        right: auto !important;
                        top: auto !important;
                    }

                    /* Make dropdown visible when shown in mobile */
                    body.w--nav-menu-open #languageDropdown[style*="display: block"],
                    body.w--nav-menu-open #careerDropdownMenu[style*="display: block"] {
                        display: block !important;
                    }

                    /* External language dropdown (outside nav menu) for mobile */
                    body.w--nav-menu-open #languageDropdown {
                        position: fixed !important;
                        top: 50% !important;
                        left: 50% !important;
                        transform: translate(-50%, -50%) !important;
                        z-index: 1001 !important;
                        min-width: 200px !important;
                        background: rgba(5, 5, 26, 0.98) !important;
                        border-radius: 8px !important;
                        padding: 15px 0 !important;
                        backdrop-filter: blur(20px) !important;
                        border: 1px solid rgba(255, 255, 255, 0.1) !important;
                    }

                    /* Language dropdown items on mobile */
                    body.w--nav-menu-open #languageDropdown div {
                        padding: 12px 20px !important;
                        font-size: 16px !important;
                        text-align: center !important;
                        color: #fff !important;
                        cursor: pointer !important;
                        transition: background 0.3s ease !important;
                    }

                    body.w--nav-menu-open #languageDropdown div:hover {
                        background: rgba(255, 255, 255, 0.1) !important;
                    }

                    /* Hide Sign Up button in mobile menu */
                    body.w--nav-menu-open .navbar-button-wrapper {
                        display: none !important;
                    }

                    /* Ensure hamburger is always visible and clickable on mobile */
                    @media screen and (max-width: 991px) {
                        .w-nav-button {
                            display: block !important;
                            visibility: visible !important;
                            opacity: 1 !important;
                        }
                    }

                    /* Fix z-index for proper click handling */
                    body.w--nav-menu-open .w-nav-overlay {
                        z-index: 998 !important;
                    }

                    body.w--nav-menu-open .w-nav-menu {
                        z-index: 999 !important;
                    }

                    body.w--nav-menu-open .w-nav-button {
                        z-index: 1005 !important;
                    }

                    .w-nav-overlay {
                        display: none !important;
                        visibility: hidden !important;
                        pointer-events: none !important;
                        position: fixed !important;
                        top: 0 !important;
                        left: 0 !important;
                        width: 100% !important;
                        height: 100% !important;
                        z-index: 999 !important;
                    }

                    .w--nav-menu-open .w-nav-overlay {
                        display: block !important;
                        visibility: visible !important;
                        pointer-events: auto !important;
                    }
                }

                /* Language switcher inherits ALL Webflow nav-link styles */
                /* Only add minimal custom styles for functionality */
                #language-switcher {
                    position: relative !important;
                    transition: color 0.3s ease !important;
                    top: 0 !important;
                    transform: none !important;
                    align-self: center !important;
                    flex-shrink: 0 !important;
                }

                #language-switcher:hover {
                    color: rgba(255, 255, 255, 0.8) !important;
                }

                #career-dropdown {
                    position: relative !important;
                    top: 0 !important;
                    transform: none !important;
                    align-self: center !important;
                }


                /* Let Webflow handle alignment - only essential overrides */
                .nav-menu > .nav-link {
                    /* Remove ALL height/line-height constraints */
                    /* Let Webflow's native nav-link class handle sizing */
                    margin: 0 !important;
                    padding: 0 !important;
                    position: relative !important;
                    color: #fff !important;
                    text-decoration: none !important;
                    top: 0 !important;
                    transform: none !important;
                    align-self: center !important;
                }

                .primary-button-wrapper {
                    margin-left: 20px !important;
                }

                @media screen and (max-width: 991px) {
                    .nav-menu.w-nav-menu {
                        flex-wrap: wrap;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Mobile menu toggle functionality
    function initMobileMenu() {
        console.log('🔧 Initializing mobile menu...');

        // Ensure menu starts closed on mobile
        if (window.innerWidth <= 991) {
            document.body.classList.remove('w--nav-menu-open');

            // Remove problematic inline styles that override our CSS
            const menu = document.querySelector('.w-nav-menu');
            if (menu) {
                console.log('📱 Mobile menu found, hiding...');
                // Remove inline visibility and opacity that conflict with our mobile styles
                menu.style.removeProperty('visibility');
                menu.style.removeProperty('opacity');

                // Ensure it's properly hidden on mobile
                menu.style.setProperty('display', 'none', 'important');
                menu.style.setProperty('visibility', 'hidden', 'important');
                menu.style.setProperty('opacity', '0', 'important');
            } else {
                console.log('⚠️ Mobile menu not found during init');
            }
        }

        // Remove duplicate hamburger buttons and keep only the one we created
        const hamburgers = document.querySelectorAll('.w-nav-button');
        if (hamburgers.length > 1) {
            // Keep the first one (from shared component) and remove others
            for (let i = 1; i < hamburgers.length; i++) {
                hamburgers[i].remove();
            }
        }

        // Add click handler to hamburger button
        const hamburger = document.querySelector('.w-nav-button');
        if (hamburger) {
            console.log('🍔 Hamburger button found, adding click handler...');

            // Ensure hamburger is visible
            hamburger.style.setProperty('display', 'block', 'important');
            hamburger.style.setProperty('visibility', 'visible', 'important');
            hamburger.style.setProperty('opacity', '1', 'important');

            hamburger.addEventListener('click', function(e) {
                console.log('🍔 Hamburger clicked!');
                e.preventDefault();
                e.stopPropagation();

                const isOpen = document.body.classList.contains('w--nav-menu-open');
                const menu = document.querySelector('.w-nav-menu');

                if (isOpen) {
                    // Close menu
                    document.body.classList.remove('w--nav-menu-open');

                    // Re-apply hidden styles for mobile
                    if (menu && window.innerWidth <= 991) {
                        menu.style.setProperty('display', 'none', 'important');
                        menu.style.setProperty('visibility', 'hidden', 'important');
                        menu.style.setProperty('opacity', '0', 'important');
                    }

                    console.log('📱 Mobile menu closed');
                } else {
                    // Open menu
                    document.body.classList.add('w--nav-menu-open');

                    // Remove inline styles to let CSS take over
                    if (menu) {
                        menu.style.removeProperty('display');
                        menu.style.removeProperty('visibility');
                        menu.style.removeProperty('opacity');
                    }

                    console.log('📱 Mobile menu opened');
                }
            });

            console.log('✅ Mobile menu hamburger initialized');
        } else {
            console.log('❌ Hamburger button not found! Available buttons:');
            const allButtons = document.querySelectorAll('button, .button, [role="button"]');
            allButtons.forEach((btn, i) => {
                console.log(`   ${i + 1}. ${btn.className} - ${btn.tagName}`);
            });

            // Create a fallback hamburger button if none exists
            const navbar = document.querySelector('.navbar-content');
            if (navbar && window.innerWidth <= 991) {
                console.log('🔧 Creating fallback hamburger button...');
                const fallbackHamburger = document.createElement('div');
                fallbackHamburger.className = 'w-nav-button fallback-hamburger';
                fallbackHamburger.innerHTML = '<div class="w-icon-nav-menu"><span></span></div>';
                fallbackHamburger.style.cssText = `
                    position: fixed !important;
                    top: 20px !important;
                    right: 20px !important;
                    z-index: 1001 !important;
                    background: rgba(0, 0, 0, 0.7) !important;
                    border: none !important;
                    cursor: pointer !important;
                    padding: 10px !important;
                    width: 40px !important;
                    height: 40px !important;
                    border-radius: 4px !important;
                    display: block !important;
                `;

                // Add RTL positioning for Hebrew
                if (document.documentElement.dir === 'rtl') {
                    fallbackHamburger.style.right = 'auto';
                    fallbackHamburger.style.left = '20px';
                }

                navbar.appendChild(fallbackHamburger);

                // Add click handler to fallback
                fallbackHamburger.addEventListener('click', function(e) {
                    console.log('🍔 Fallback hamburger clicked!');
                    e.preventDefault();
                    const isOpen = document.body.classList.contains('w--nav-menu-open');
                    if (isOpen) {
                        document.body.classList.remove('w--nav-menu-open');
                        console.log('📱 Mobile menu closed (fallback)');
                    } else {
                        document.body.classList.add('w--nav-menu-open');
                        console.log('📱 Mobile menu opened (fallback)');
                    }
                });

                console.log('✅ Fallback hamburger created');
            }
        }

        // Close menu when clicking overlay or outside
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 991) {
                const isOpen = document.body.classList.contains('w--nav-menu-open');
                const clickedMenu = e.target.closest('.w-nav-menu');
                const clickedHamburger = e.target.closest('.w-nav-button');

                if (isOpen && !clickedMenu && !clickedHamburger) {
                    document.body.classList.remove('w--nav-menu-open');
                    console.log('📱 Mobile menu closed (outside click)');
                }
            }

            // Close dropdowns when clicking outside
            const clickedLanguageSwitcher = e.target.closest('#language-switcher');
            if (!clickedLanguageSwitcher) {
                const dropdown = document.getElementById('languageDropdown');
                if (dropdown) {
                    dropdown.style.display = 'none';
                }
            }

            const clickedCareerDropdown = e.target.closest('#career-dropdown');
            if (!clickedCareerDropdown) {
                const careerDropdown = document.getElementById('careerDropdownMenu');
                if (careerDropdown) {
                    careerDropdown.style.display = 'none';
                }
            }

        });

        // Handle escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && document.body.classList.contains('w--nav-menu-open')) {
                document.body.classList.remove('w--nav-menu-open');
                console.log('📱 Mobile menu closed (escape key)');
            }
        });

        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 991) {
                document.body.classList.remove('w--nav-menu-open');
            }
        });
    }

    // Initialize
    function init() {
        console.log('🚀 Shared menu component initializing... v2.6 (Fixed dropdown positioning & duplicate menu)');
        console.log('📱 Viewport width:', window.innerWidth);
        console.log('🌐 Current language:', currentLang);
        console.log('📄 Current page:', currentPage);
        console.log('🔍 Translations being used:', JSON.stringify(t, null, 2));
        console.log('🔍 Hebrew translations check:', menuText.he);

        injectMenu();
        applyMenuStyles();

        // Initialize mobile menu after a short delay to ensure DOM is ready
        setTimeout(() => {
            initMobileMenu();
        }, 100);

        console.log('✅ Shared menu component initialized');
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();