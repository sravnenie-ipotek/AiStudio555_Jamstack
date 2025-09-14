// Ultra-thin Shared Menu Component
// Single source of truth for navigation across all pages

(function() {
    'use strict';

    // Detect current language and page
    const currentPath = window.location.pathname;
    let currentLang = 'en';
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
            careerOrientation: 'Career Orientation',
            careerCenter: 'Career Center',
            pricing: 'תמחור',
            signUp: 'הרשמו היום'
        }
    };

    // Get translations for current language
    const t = menuText[currentLang];

    // Build menu HTML
    const menuHTML = `
        <div data-animation="default" data-collapse="medium" data-duration="400" data-easing="ease" data-easing2="ease" role="banner" class="navbar w-nav">
            <div class="container">
                <div class="navbar-content">
                    <a href="index.html" class="zohacous-logo-link w-nav-brand">
                        <img loading="lazy" src="../images/Logo.svg" alt="" class="zohacous-logo-image">
                    </a>
                    <nav role="navigation" class="nav-menu w-nav-menu">
                        <a href="home.html" class="nav-link w-nav-link ${currentPage === 'home' ? 'w--current' : ''}">${t.home}</a>
                        <a href="courses.html" class="nav-link w-nav-link ${currentPage === 'courses' ? 'w--current' : ''}">${t.courses}</a>
                        <a href="teachers.html" class="nav-link w-nav-link ${currentPage === 'teachers' ? 'w--current' : ''}">${t.teachers}</a>
                        <div data-delay="0" data-hover="true" class="menu-dropdown-wrapper w-dropdown">
                            <div class="dropdown-toggle w-dropdown-toggle">
                                <div class="dropdown-toggle-text-block">${t.careerServices}</div>
                                <div class="dropdown-toggle-arrow-2">▼</div>
                            </div>
                            <nav class="dropdown-list w-dropdown-list">
                                <a href="career-orientation.html" class="dropdown-menu-text-link-block w-inline-block">
                                    <div>${t.careerOrientation}</div>
                                </a>
                                <a href="career-center.html" class="dropdown-menu-text-link-block w-inline-block">
                                    <div>${t.careerCenter}</div>
                                </a>
                            </nav>
                        </div>
                        <a href="pricing.html" class="nav-link w-nav-link ${currentPage === 'pricing' ? 'w--current' : ''}">${t.pricing}</a>
                        <a href="#" id="language-switcher" class="nav-link w-nav-link" onclick="toggleLanguageDropdown(); return false;">
                            <span id="currentLanguage">${currentLang === 'en' ? 'EN 🌐' : currentLang === 'ru' ? 'RU 🌐' : 'HE 🌐'}</span>
                            <div id="languageDropdown" style="
                                display: none;
                                position: absolute;
                                top: 100%;
                                ${currentLang === 'he' ? 'left: 0' : 'right: 0'};
                                background: rgba(5, 5, 26, 0.98);
                                backdrop-filter: blur(20px);
                                border-radius: 4px;
                                padding: 10px 0;
                                min-width: 120px;
                                z-index: 1000;
                            ">
                                <div onclick="switchLanguage('en')" style="padding: 8px 16px; cursor: pointer; color: #fff; ${currentLang === 'en' ? 'background: rgba(255,255,255,0.1);' : ''}" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='${currentLang === 'en' ? 'rgba(255,255,255,0.1)' : 'transparent'}'">English</div>
                                <div onclick="switchLanguage('ru')" style="padding: 8px 16px; cursor: pointer; color: #fff; ${currentLang === 'ru' ? 'background: rgba(255,255,255,0.1);' : ''}" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='${currentLang === 'ru' ? 'rgba(255,255,255,0.1)' : 'transparent'}'">Русский</div>
                                <div onclick="switchLanguage('he')" style="padding: 8px 16px; cursor: pointer; color: #fff; ${currentLang === 'he' ? 'background: rgba(255,255,255,0.1);' : ''}" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='${currentLang === 'he' ? 'rgba(255,255,255,0.1)' : 'transparent'}'">עברית</div>
                            </div>
                        </a>
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

    // Language dropdown toggle function
    window.toggleLanguageDropdown = function() {
        const dropdown = document.getElementById('languageDropdown');
        if (dropdown) {
            dropdown.style.display = dropdown.style.display === 'none' || dropdown.style.display === '' ? 'block' : 'none';
        }
    };

    // Language switch function
    window.switchLanguage = function(lang) {
        const dropdown = document.getElementById('languageDropdown');
        if (dropdown) {
            dropdown.style.display = 'none';
        }
        const currentPath = window.location.pathname;
        const currentFile = currentPath.split('/').pop() || 'home.html';
        const newPath = `/${lang}/${currentFile}`;
        window.location.href = newPath;
    };

    // Inject menu into page
    function injectMenu() {
        const menuContainer = document.getElementById('shared-menu-container');
        if (menuContainer) {
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
        // Load external CSS for better language selector styling
        if (!document.getElementById('menu-language-fix-css')) {
            const link = document.createElement('link');
            link.id = 'menu-language-fix-css';
            link.rel = 'stylesheet';
            link.href = '../css/menu-language-fix.css';
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
                        position: absolute !important;
                        top: 20px !important;
                        right: 20px !important;
                        z-index: 1001 !important;
                        background: transparent !important;
                        border: none !important;
                        cursor: pointer !important;
                        padding: 10px !important;
                        width: 40px !important;
                        height: 40px !important;
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

                    /* Mobile menu items styling */
                    body.w--nav-menu-open .w-nav-menu > .nav-link,
                    body.w--nav-menu-open .w-nav-menu > .menu-dropdown-wrapper,
                    body.w--nav-menu-open .w-nav-menu > #language-switcher {
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
                    }

                    /* RTL support for Hebrew */
                    body[dir="rtl"].w--nav-menu-open .w-nav-menu .nav-link,
                    body[dir="rtl"].w--nav-menu-open .w-nav-menu .menu-dropdown-wrapper,
                    body[dir="rtl"].w--nav-menu-open .w-nav-menu #language-switcher {
                        text-align: right !important;
                        direction: rtl !important;
                    }

                    /* Mobile menu hover states */
                    body.w--nav-menu-open .w-nav-menu .nav-link:hover,
                    body.w--nav-menu-open .w-nav-menu .menu-dropdown-wrapper:hover {
                        background: rgba(255, 255, 255, 0.05) !important;
                    }

                    /* Mobile dropdown styling */
                    body.w--nav-menu-open .menu-dropdown-wrapper {
                        flex-direction: column !important;
                        align-items: stretch !important;
                    }

                    body.w--nav-menu-open .menu-dropdown-wrapper .dropdown-toggle {
                        display: flex !important;
                        justify-content: space-between !important;
                        align-items: center !important;
                        width: 100% !important;
                        padding: 0 !important;
                        height: auto !important;
                        background: transparent !important;
                        border: none !important;
                        cursor: pointer !important;
                    }

                    body.w--nav-menu-open .dropdown-toggle-text-block {
                        color: #fff !important;
                        font-size: 18px !important;
                    }

                    body.w--nav-menu-open .dropdown-toggle-arrow-2 {
                        color: #fff !important;
                        transition: transform 0.3s ease !important;
                    }

                    body.w--nav-menu-open .dropdown-list {
                        position: static !important;
                        display: block !important;
                        width: 100% !important;
                        background: rgba(0, 0, 0, 0.3) !important;
                        padding: 10px 0 !important;
                        margin-top: 10px !important;
                        max-height: none !important;
                        overflow: visible !important;
                    }

                    body.w--nav-menu-open .dropdown-list a {
                        display: block !important;
                        padding: 15px 45px !important;
                        color: rgba(255, 255, 255, 0.8) !important;
                        font-size: 16px !important;
                        border-bottom: none !important;
                    }

                    body.w--nav-menu-open .dropdown-list a:hover {
                        background: rgba(255, 255, 255, 0.05) !important;
                        color: #fff !important;
                    }

                    /* Mobile language switcher */
                    body.w--nav-menu-open #language-switcher {
                        border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
                    }

                    body.w--nav-menu-open #currentLanguage {
                        font-size: 18px !important;
                        color: #fff !important;
                    }

                    body.w--nav-menu-open #languageDropdown {
                        position: static !important;
                        margin-top: 10px !important;
                        width: 100% !important;
                        background: rgba(0, 0, 0, 0.3) !important;
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

                    /* Show menu when open class is present - Ultra Specific */
                    body.w--nav-menu-open #shared-menu-container .w-nav-menu,
                    body.w--nav-menu-open .nav-menu.w-nav-menu,
                    body.w--nav-menu-open .w-nav-menu,
                    .w--nav-menu-open .navbar .w-nav-menu {
                        display: flex !important;
                        visibility: visible !important;
                        opacity: 1 !important;
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
                }

                #language-switcher:hover {
                    color: rgba(255, 255, 255, 0.8) !important;
                }

                #currentLanguage {
                    /* Inherit all font properties from nav-link */
                    font-weight: 400 !important;
                    line-height: 20px !important;
                    height: 20px !important;
                    display: flex !important;
                    align-items: center !important;
                    transition: color 0.3s ease !important;
                }

                #currentLanguage:hover {
                    color: rgba(255, 255, 255, 0.8) !important;
                }

                /* Perfect menu item alignment */
                .nav-menu > .nav-link,
                .nav-menu > .menu-dropdown-wrapper,
                .nav-menu > #language-switcher {
                    margin: 0 !important;
                    padding: 0 !important;
                    position: relative !important;
                    display: inline-flex !important;
                    align-items: center !important;
                    height: 24px !important;
                    line-height: 24px !important;
                    font-size: 16px !important;
                    font-weight: 400 !important;
                    color: #fff !important;
                    text-decoration: none !important;
                    vertical-align: middle !important;
                }

                /* Dropdown specific alignment */
                .menu-dropdown-wrapper {
                    position: relative !important;
                }

                .menu-dropdown-wrapper .dropdown-toggle {
                    height: 24px !important;
                    line-height: 24px !important;
                    display: inline-flex !important;
                    align-items: center !important;
                    gap: 5px !important;
                }

                .dropdown-toggle-arrow-2 {
                    font-size: 10px !important;
                    line-height: 24px !important;
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
        // Ensure menu starts closed on mobile
        if (window.innerWidth <= 991) {
            document.body.classList.remove('w--nav-menu-open');

            // Remove problematic inline styles that override our CSS
            const menu = document.querySelector('.w-nav-menu');
            if (menu) {
                // Remove inline visibility and opacity that conflict with our mobile styles
                menu.style.removeProperty('visibility');
                menu.style.removeProperty('opacity');

                // Ensure it's properly hidden on mobile
                menu.style.setProperty('display', 'none', 'important');
                menu.style.setProperty('visibility', 'hidden', 'important');
                menu.style.setProperty('opacity', '0', 'important');
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
            hamburger.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                const isOpen = document.body.classList.contains('w--nav-menu-open');

                if (isOpen) {
                    // Close menu
                    document.body.classList.remove('w--nav-menu-open');
                    console.log('📱 Mobile menu closed');
                } else {
                    // Open menu
                    document.body.classList.add('w--nav-menu-open');
                    console.log('📱 Mobile menu opened');
                }
            });

            console.log('✅ Mobile menu hamburger initialized');
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

            // Close language dropdown when clicking outside
            const clickedLanguageSwitcher = e.target.closest('#language-switcher');
            if (!clickedLanguageSwitcher) {
                const dropdown = document.getElementById('languageDropdown');
                if (dropdown) {
                    dropdown.style.display = 'none';
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
        injectMenu();
        applyMenuStyles();

        // Initialize mobile menu after a short delay to ensure DOM is ready
        setTimeout(() => {
            initMobileMenu();
        }, 100);
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();