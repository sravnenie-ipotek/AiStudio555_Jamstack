// Manual Mobile Menu Implementation - Webflow Replacement
// Since Webflow.ready never initializes, we'll handle mobile menu manually

(function() {
    'use strict';

    console.log('🔧 Manual Mobile Menu: Initializing...');

    function initMobileMenu() {
        const navbar = document.querySelector('.navbar, .w-nav');
        const menuButton = document.querySelector('.menu-button, .w-nav-button');
        const navMenu = document.querySelector('.nav-menu, .w-nav-menu');

        if (!navbar || !menuButton || !navMenu) {
            console.log('❌ Manual Mobile Menu: Required elements not found');
            return;
        }

        console.log('✅ Manual Mobile Menu: Elements found, setting up...');

        // Create mobile menu styles
        const style = document.createElement('style');
        style.textContent = `
            /* Manual Mobile Menu Styles */
            @media (max-width: 991px) {
                .w-nav-menu {
                    display: none !important;
                    position: fixed !important;
                    top: 0 !important;
                    right: -100% !important;
                    bottom: 0 !important;
                    width: 85% !important;
                    max-width: 360px !important;
                    background: #05051a !important;
                    z-index: 9999 !important;
                    padding: 80px 20px 20px !important;
                    overflow-y: auto !important;
                    transition: right 0.3s ease !important;
                    opacity: 1 !important;
                    visibility: visible !important;
                    flex-direction: column !important;
                    align-items: flex-start !important;
                    gap: 0 !important;
                }

                .w-nav-menu.manual-open {
                    display: flex !important;
                    right: 0 !important;
                }

                .w-nav-menu .nav-link,
                .w-nav-menu .w-nav-link {
                    display: block !important;
                    padding: 15px 0 !important;
                    color: white !important;
                    text-decoration: none !important;
                    font-size: 18px !important;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
                    width: 100% !important;
                }

                .w-nav-menu .nav-link:hover,
                .w-nav-menu .w-nav-link:hover {
                    color: #ffd659 !important;
                }

                .w-nav-menu .w-dropdown {
                    display: block !important;
                    margin: 15px 0 !important;
                    width: 100% !important;
                }

                .w-nav-menu .w-dropdown-toggle {
                    display: flex !important;
                    justify-content: space-between !important;
                    align-items: center !important;
                    padding: 15px 0 !important;
                    color: white !important;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
                    width: 100% !important;
                }

                .w-nav-menu .w-dropdown-list {
                    position: relative !important;
                    background: rgba(255, 255, 255, 0.1) !important;
                    padding: 10px !important;
                    margin-top: 10px !important;
                    border-radius: 8px !important;
                }

                /* Hamburger animation */
                .w-nav-button.manual-open .hamburger-line:nth-child(1) {
                    transform: rotate(45deg) translate(5px, 5px) !important;
                }

                .w-nav-button.manual-open .hamburger-line:nth-child(2) {
                    opacity: 0 !important;
                }

                .w-nav-button.manual-open .hamburger-line:nth-child(3) {
                    transform: rotate(-45deg) translate(7px, -6px) !important;
                }

                .hamburger-line {
                    display: block !important;
                    width: 24px !important;
                    height: 2px !important;
                    background-color: #ffffff !important;
                    margin: 3px 0 !important;
                    border-radius: 1px !important;
                    transition: all 0.3s ease !important;
                }

                /* Overlay */
                body.manual-menu-open {
                    overflow: hidden !important;
                }

                .manual-menu-overlay {
                    position: fixed !important;
                    top: 0 !important;
                    left: 0 !important;
                    right: 0 !important;
                    bottom: 0 !important;
                    background: rgba(0, 0, 0, 0.5) !important;
                    z-index: 9998 !important;
                    opacity: 0 !important;
                    visibility: hidden !important;
                    transition: all 0.3s ease !important;
                }

                .manual-menu-overlay.active {
                    opacity: 1 !important;
                    visibility: visible !important;
                }
            }

            @media (min-width: 992px) {
                .w-nav-menu {
                    display: flex !important;
                    position: relative !important;
                    right: auto !important;
                }
            }
        `;
        document.head.appendChild(style);

        // Add hamburger icon if missing
        if (!menuButton.querySelector('.hamburger-line')) {
            menuButton.innerHTML = `
                <div class="hamburger-icon">
                    <span class="hamburger-line"></span>
                    <span class="hamburger-line"></span>
                    <span class="hamburger-line"></span>
                </div>
            `;
        }

        // Create overlay
        let overlay = document.querySelector('.manual-menu-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'manual-menu-overlay';
            document.body.appendChild(overlay);
        }

        // Menu state
        let isOpen = false;

        function openMenu() {
            isOpen = true;
            navMenu.classList.add('manual-open');
            menuButton.classList.add('manual-open');
            overlay.classList.add('active');
            document.body.classList.add('manual-menu-open');
            console.log('📱 Manual Mobile Menu: Opened');
        }

        function closeMenu() {
            isOpen = false;
            navMenu.classList.remove('manual-open');
            menuButton.classList.remove('manual-open');
            overlay.classList.remove('active');
            document.body.classList.remove('manual-menu-open');
            console.log('📱 Manual Mobile Menu: Closed');
        }

        function toggleMenu() {
            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        }

        // Button click handler
        menuButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMenu();
        });

        // Overlay click to close
        overlay.addEventListener('click', closeMenu);

        // Close on window resize to desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth > 991 && isOpen) {
                closeMenu();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isOpen) {
                closeMenu();
            }
        });

        console.log('✅ Manual Mobile Menu: Setup complete!');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileMenu);
    } else {
        initMobileMenu();
    }

    // Also try after a short delay
    setTimeout(initMobileMenu, 1000);

})();