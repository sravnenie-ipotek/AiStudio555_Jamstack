/**
 * Universal Mobile Navigation Fix
 * Solves all mobile navigation issues across the entire site
 *
 * Fixes:
 * 1. Double hamburger menu issue
 * 2. Missing close (X) button
 * 3. Missing language selector in mobile menu
 * 4. Navigation options not working
 * 5. Menu not closing properly
 */

(function() {
    'use strict';

    console.log('🔧 Universal Mobile Navigation Fix v1.0 - Initializing...');

    // Configuration
    const CONFIG = {
        MOBILE_BREAKPOINT: 991,
        DEBUG: true
    };

    // State management
    let isMenuOpen = false;
    let currentLanguage = detectLanguage();

    // Detect current language from URL
    function detectLanguage() {
        const path = window.location.pathname;
        if (path.includes('/he/')) return 'he';
        if (path.includes('/ru/')) return 'ru';
        if (path.includes('/en/')) return 'en';
        return 'en'; // default
    }

    // Debug logging
    function debug(message, ...args) {
        if (CONFIG.DEBUG) {
            console.log(`📱 [Mobile Nav] ${message}`, ...args);
        }
    }

    // Main initialization function
    function initMobileNavigation() {
        debug('Initializing mobile navigation system');

        // Prevent multiple initializations
        if (window.mobileNavInitialized) {
            debug('Mobile navigation already initialized, skipping');
            return;
        }
        window.mobileNavInitialized = true;

        // Step 1: Remove duplicate hamburger buttons
        removeDuplicateHamburgers();

        // Step 2: Ensure single, proper navigation structure
        ensureSingleNavigation();

        // Step 3: Create enhanced mobile menu with close button
        enhanceMobileMenu();

        // Step 4: Add language selector to mobile menu
        addLanguageSelectorToMobileMenu();

        // Step 5: Initialize event handlers
        initializeEventHandlers();

        // Step 6: Ensure menu starts closed
        ensureMenuClosed();

        debug('Mobile navigation system initialized successfully');
    }

    // Remove all duplicate hamburger buttons except the one we'll use
    function removeDuplicateHamburgers() {
        debug('Removing duplicate hamburger buttons');

        const hamburgers = document.querySelectorAll('.menu-button, .w-nav-button');
        debug(`Found ${hamburgers.length} hamburger buttons`);

        // Remove all existing hamburgers - we'll create our own
        hamburgers.forEach((hamburger, index) => {
            debug(`Removing hamburger button ${index + 1}`);
            hamburger.remove();
        });

        debug('All existing hamburger buttons removed');
    }

    // Ensure we have only one navigation structure
    function ensureSingleNavigation() {
        debug('Ensuring single navigation structure');

        const navbars = document.querySelectorAll('.navbar, .w-nav');
        debug(`Found ${navbars.length} navigation elements`);

        // If multiple navbars exist, keep only the first one
        if (navbars.length > 1) {
            for (let i = 1; i < navbars.length; i++) {
                debug(`Removing duplicate navbar ${i + 1}`);
                navbars[i].remove();
            }
        }

        // Ensure we have a navigation container
        let mainNav = document.querySelector('.navbar, .w-nav');
        if (!mainNav) {
            debug('No navigation found, checking for shared menu container');
            const sharedContainer = document.getElementById('shared-menu-container');
            if (sharedContainer) {
                debug('Found shared menu container, will be populated by shared-menu-component.js');
                return;
            }
        }

        debug('Navigation structure verified');
    }

    // Create enhanced mobile menu with proper close button
    function enhanceMobileMenu() {
        debug('Creating enhanced mobile menu');

        // Wait for navigation to be ready (either existing or injected)
        setTimeout(() => {
            const nav = document.querySelector('.navbar, .w-nav');
            if (!nav) {
                debug('⚠️ No navigation found, retrying...');
                setTimeout(enhanceMobileMenu, 500);
                return;
            }

            // Create our custom hamburger/close button
            createCustomMenuButton(nav);

            // Enhance mobile menu overlay
            createMobileMenuOverlay(nav);

            debug('Enhanced mobile menu created');
        }, 100);
    }

    // Create custom hamburger/close button
    function createCustomMenuButton(nav) {
        debug('Creating custom menu button');

        // Remove any existing menu buttons
        const existingButtons = nav.querySelectorAll('.w-nav-button, .menu-button');
        existingButtons.forEach(btn => btn.remove());

        // Check if our custom button already exists
        if (document.querySelector('.mobile-menu-button')) {
            debug('Custom menu button already exists, skipping creation');
            return;
        }

        // Create new menu button container
        const menuButton = document.createElement('div');
        menuButton.className = 'mobile-menu-button';
        menuButton.setAttribute('role', 'button');
        menuButton.setAttribute('aria-label', 'Toggle mobile menu');
        menuButton.setAttribute('tabindex', '0');

        // Create hamburger/close icon
        const icon = document.createElement('div');
        icon.className = 'mobile-menu-icon';
        icon.innerHTML = `
            <span class="hamburger-line line-1"></span>
            <span class="hamburger-line line-2"></span>
            <span class="hamburger-line line-3"></span>
        `;

        menuButton.appendChild(icon);

        // Style the button
        menuButton.style.cssText = `
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            z-index: 10001 !important;
            width: 40px !important;
            height: 40px !important;
            display: none !important;
            align-items: center !important;
            justify-content: center !important;
            background: rgba(0, 0, 0, 0.1) !important;
            border: none !important;
            border-radius: 8px !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
        `;

        // Style the icon lines
        const lines = icon.querySelectorAll('.hamburger-line');
        lines.forEach((line, index) => {
            line.style.cssText = `
                display: block !important;
                width: 24px !important;
                height: 2px !important;
                background: white !important;
                border-radius: 1px !important;
                transition: all 0.3s ease !important;
                transform-origin: center !important;
                position: absolute !important;
                left: 50% !important;
                transform: translateX(-50%) !important;
            `;

            // Position each line
            if (index === 0) line.style.top = '12px';
            if (index === 1) line.style.top = '19px';
            if (index === 2) line.style.top = '26px';
        });

        // Icon container positioning
        icon.style.cssText = `
            position: relative !important;
            width: 24px !important;
            height: 24px !important;
        `;

        // Show on mobile only
        const mediaQuery = window.matchMedia(`(max-width: ${CONFIG.MOBILE_BREAKPOINT}px)`);
        function updateButtonVisibility() {
            if (mediaQuery.matches) {
                menuButton.style.display = 'flex';
            } else {
                menuButton.style.display = 'none';
                // Ensure menu is closed on desktop
                if (isMenuOpen) {
                    closeMobileMenu();
                }
            }
        }

        mediaQuery.addListener(updateButtonVisibility);
        updateButtonVisibility();

        // Add click handler
        menuButton.addEventListener('click', toggleMobileMenu);

        // Add keyboard support
        menuButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMobileMenu();
            }
        });

        // Append to navigation
        nav.appendChild(menuButton);

        debug('Custom menu button created and added');
    }

    // Create mobile menu overlay
    function createMobileMenuOverlay(nav) {
        debug('Creating mobile menu overlay');

        // Remove existing overlay
        const existingOverlay = document.querySelector('.mobile-menu-overlay, .w-nav-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }

        // Create new overlay
        const overlay = document.createElement('div');
        overlay.className = 'mobile-menu-overlay';
        overlay.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            background: rgba(0, 0, 0, 0.8) !important;
            z-index: 9999 !important;
            display: none !important;
            opacity: 0 !important;
            transition: opacity 0.3s ease !important;
        `;

        // Close menu when overlay is clicked
        overlay.addEventListener('click', closeMobileMenu);

        // Add to body
        document.body.appendChild(overlay);

        debug('Mobile menu overlay created');
    }

    // Add language selector to mobile menu
    function addLanguageSelectorToMobileMenu() {
        debug('Adding language selector to mobile menu');

        // Wait for menu to be ready
        setTimeout(() => {
            const menu = document.querySelector('.w-nav-menu, .nav-menu');
            if (!menu) {
                debug('⚠️ No mobile menu found, retrying...');
                setTimeout(addLanguageSelectorToMobileMenu, 500);
                return;
            }

            // Remove existing mobile language selector if any
            const existingSelector = menu.querySelector('.mobile-language-selector');
            if (existingSelector) {
                existingSelector.remove();
            }

            // Create language selector for mobile menu
            const languageSection = document.createElement('div');
            languageSection.className = 'mobile-language-selector';
            languageSection.style.cssText = `
                padding: 20px !important;
                border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
                margin-top: auto !important;
                background: rgba(0, 0, 0, 0.2) !important;
            `;

            // Create language selector
            const languageSelect = document.createElement('select');
            languageSelect.className = 'mobile-language-select';
            languageSelect.style.cssText = `
                width: 100% !important;
                padding: 12px 16px !important;
                background: rgba(255, 255, 255, 0.1) !important;
                color: white !important;
                border: 1px solid rgba(255, 255, 255, 0.3) !important;
                border-radius: 8px !important;
                font-size: 16px !important;
                cursor: pointer !important;
                appearance: none !important;
                -webkit-appearance: none !important;
                -moz-appearance: none !important;
            `;

            // Add language options
            const languages = [
                { value: 'en', text: '🇬🇧 English', label: 'English' },
                { value: 'ru', text: '🇷🇺 Русский', label: 'Russian' },
                { value: 'he', text: '🇮🇱 עברית', label: 'Hebrew' }
            ];

            languages.forEach(lang => {
                const option = document.createElement('option');
                option.value = lang.value;
                option.textContent = lang.text;
                option.style.cssText = `
                    background: #05051a !important;
                    color: white !important;
                `;
                if (lang.value === currentLanguage) {
                    option.selected = true;
                }
                languageSelect.appendChild(option);
            });

            // Add change handler
            languageSelect.addEventListener('change', (e) => {
                const selectedLang = e.target.value;
                if (selectedLang !== currentLanguage) {
                    switchLanguage(selectedLang);
                }
            });

            languageSection.appendChild(languageSelect);

            // Add to mobile menu (make it the last item)
            menu.appendChild(languageSection);

            debug('Language selector added to mobile menu');
        }, 200);
    }

    // Switch language function
    function switchLanguage(newLang) {
        debug(`Switching language from ${currentLanguage} to ${newLang}`);

        const currentPath = window.location.pathname;
        const pathParts = currentPath.split('/').filter(p => p);

        // Remove current language from path
        if (['en', 'ru', 'he'].includes(pathParts[0])) {
            pathParts.shift();
        }

        // Get current page
        const currentPage = pathParts.join('/') || 'home.html';

        // Build new URL
        let newUrl;
        if (newLang === 'en') {
            newUrl = `/${currentPage}`;
        } else {
            newUrl = `/${newLang}/${currentPage}`;
        }

        debug(`Navigating to: ${newUrl}`);
        window.location.href = newUrl;
    }

    // Initialize all event handlers
    function initializeEventHandlers() {
        debug('Initializing event handlers');

        // Escape key to close menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isMenuOpen) {
                closeMobileMenu();
            }
        });

        // Close menu when navigation links are clicked (on mobile)
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= CONFIG.MOBILE_BREAKPOINT && isMenuOpen) {
                const navLink = e.target.closest('.nav-link, .dropdown-menu-text-link-block');
                if (navLink) {
                    // Close menu after a short delay to allow navigation
                    setTimeout(closeMobileMenu, 100);
                }
            }
        });

        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth > CONFIG.MOBILE_BREAKPOINT && isMenuOpen) {
                    closeMobileMenu();
                }
            }, 250);
        });

        debug('Event handlers initialized');
    }

    // Toggle mobile menu
    function toggleMobileMenu() {
        debug(`Toggling mobile menu (currently ${isMenuOpen ? 'open' : 'closed'})`);

        if (isMenuOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    // Open mobile menu
    function openMobileMenu() {
        debug('Opening mobile menu');

        isMenuOpen = true;

        // Get elements
        const menu = document.querySelector('.w-nav-menu, .nav-menu');
        const overlay = document.querySelector('.mobile-menu-overlay');
        const menuButton = document.querySelector('.mobile-menu-button');

        if (!menu) {
            debug('⚠️ No menu found to open');
            return;
        }

        // Add open classes
        document.body.classList.add('w--nav-menu-open', 'mobile-menu-open');
        document.documentElement.classList.add('w--nav-menu-open');

        // Show and style menu
        menu.style.cssText = `
            display: block !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            background: rgba(5, 5, 26, 0.98) !important;
            backdrop-filter: blur(20px) !important;
            padding: 80px 20px 20px !important;
            z-index: 10000 !important;
            overflow-y: auto !important;
            opacity: 1 !important;
            visibility: visible !important;
            transform: translateX(0) !important;
        `;

        // Style menu items
        const navLinks = menu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.style.cssText = `
                display: block !important;
                padding: 15px 20px !important;
                color: white !important;
                font-size: 18px !important;
                text-align: center !important;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
                text-decoration: none !important;
                margin: 0 !important;
            `;
        });

        // Style dropdowns in mobile
        const dropdowns = menu.querySelectorAll('.menu-dropdown-wrapper');
        dropdowns.forEach(dropdown => {
            dropdown.style.width = '100%';

            const dropdownList = dropdown.querySelector('.dropdown-list');
            if (dropdownList) {
                dropdownList.style.cssText = `
                    position: static !important;
                    display: block !important;
                    background: transparent !important;
                    border: none !important;
                    padding: 0 !important;
                    opacity: 1 !important;
                    visibility: visible !important;
                    transform: none !important;
                `;

                const dropdownLinks = dropdownList.querySelectorAll('.dropdown-menu-text-link-block');
                dropdownLinks.forEach(link => {
                    link.style.cssText = `
                        display: block !important;
                        padding: 10px 30px !important;
                        color: rgba(255, 255, 255, 0.8) !important;
                        font-size: 16px !important;
                        text-align: center !important;
                        border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
                    `;
                });
            }
        });

        // Don't show overlay - it interferes with hamburger button clicks
        // if (overlay) {
        //     overlay.style.display = 'block';
        //     setTimeout(() => {
        //         overlay.style.opacity = '1';
        //     }, 10);
        // }

        // Hide any Webflow overlay that might interfere
        const webflowOverlay = document.querySelector('.w-nav-overlay');
        if (webflowOverlay) {
            webflowOverlay.style.display = 'none !important';
            debug('Hidden Webflow overlay that was interfering with menu');
        }

        // Transform hamburger to X
        if (menuButton) {
            const lines = menuButton.querySelectorAll('.hamburger-line');
            if (lines.length >= 3) {
                lines[0].style.transform = 'translateX(-50%) rotate(45deg) translateY(7px)';
                lines[1].style.opacity = '0';
                lines[2].style.transform = 'translateX(-50%) rotate(-45deg) translateY(-7px)';
            }
        }

        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        debug('Mobile menu opened');
    }

    // Close mobile menu
    function closeMobileMenu() {
        debug('Closing mobile menu');

        isMenuOpen = false;

        // Get elements
        const menu = document.querySelector('.w-nav-menu, .nav-menu');
        const overlay = document.querySelector('.mobile-menu-overlay');
        const menuButton = document.querySelector('.mobile-menu-button');

        // Remove open classes
        document.body.classList.remove('w--nav-menu-open', 'mobile-menu-open');
        document.documentElement.classList.remove('w--nav-menu-open');

        // Hide menu
        if (menu && window.innerWidth <= CONFIG.MOBILE_BREAKPOINT) {
            menu.style.cssText = `
                display: none !important;
                opacity: 0 !important;
                visibility: hidden !important;
                transform: translateX(-100%) !important;
            `;
        }

        // Don't manipulate overlay
        // if (overlay) {
        //     overlay.style.opacity = '0';
        //     setTimeout(() => {
        //         overlay.style.display = 'none';
        //     }, 300);
        // }

        // Transform X back to hamburger
        if (menuButton) {
            const lines = menuButton.querySelectorAll('.hamburger-line');
            if (lines.length >= 3) {
                lines[0].style.transform = 'translateX(-50%)';
                lines[1].style.opacity = '1';
                lines[2].style.transform = 'translateX(-50%)';
            }
        }

        // Restore body scroll
        document.body.style.overflow = '';

        debug('Mobile menu closed');
    }

    // Ensure menu starts in closed state
    function ensureMenuClosed() {
        debug('Ensuring menu starts closed');

        isMenuOpen = false;

        // Force close state
        if (window.innerWidth <= CONFIG.MOBILE_BREAKPOINT) {
            closeMobileMenu();
        }

        debug('Menu ensured closed');
    }

    // Expose global functions for debugging
    window.mobileNavDebug = {
        open: openMobileMenu,
        close: closeMobileMenu,
        toggle: toggleMobileMenu,
        reinit: initMobileNavigation
    };

    // Initialize when DOM is ready
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    // Start initialization
    ready(() => {
        debug('DOM ready, starting initialization');

        // Initialize immediately
        initMobileNavigation();

        // Also initialize after other scripts have run
        setTimeout(initMobileNavigation, 500);

        // Final safety initialization
        setTimeout(initMobileNavigation, 1500);

        debug('Universal Mobile Navigation Fix initialized');
    });

})();