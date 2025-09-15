// Universal Menu Fix - Applied to ALL pages for consistent navigation
// This script ensures menu visibility and adds language switcher to all pages

(function() {
    'use strict';

    // Force menu visibility immediately and aggressively
    function forceMenuVisible() {
        const navMenu = document.querySelector('.nav-menu.w-nav-menu');
        if (navMenu) {
            // Use the most aggressive approach
            navMenu.style.setProperty('display', 'flex', 'important');
            navMenu.style.setProperty('visibility', 'visible', 'important');
            navMenu.style.setProperty('opacity', '1', 'important');
            navMenu.style.setProperty('position', 'static', 'important');
            navMenu.style.setProperty('transform', 'none', 'important');
            navMenu.style.setProperty('left', 'auto', 'important');
            navMenu.style.setProperty('right', 'auto', 'important');
            navMenu.style.setProperty('top', 'auto', 'important');
            navMenu.style.setProperty('bottom', 'auto', 'important');
            navMenu.style.setProperty('width', 'auto', 'important');
            navMenu.style.setProperty('height', 'auto', 'important');
            navMenu.style.setProperty('max-width', 'none', 'important');
            navMenu.style.setProperty('max-height', 'none', 'important');
            navMenu.style.setProperty('overflow', 'visible', 'important');
            navMenu.style.setProperty('background', 'transparent', 'important');
            navMenu.style.setProperty('z-index', 'auto', 'important');
            navMenu.style.setProperty('pointer-events', 'auto', 'important');
            navMenu.style.setProperty('clip', 'auto', 'important');
            navMenu.style.setProperty('clip-path', 'none', 'important');

            // Also remove any classes that might hide it
            navMenu.classList.remove('w--nav-menu-closed');
            navMenu.classList.add('w--nav-menu-open');
        }

        // Force hamburger button to hide
        const hamburger = document.querySelector('.w-nav-button');
        if (hamburger) {
            hamburger.style.setProperty('display', 'none', 'important');
        }
    }

    // Add inline language switcher
    function addInlineLanguageSwitcher() {
        // Check if switcher already exists
        if (document.getElementById('language-switcher')) {
            return;
        }

        // Detect current language from URL
        const currentPath = window.location.pathname;
        let currentLang = 'en';
        if (currentPath.includes('/he/')) currentLang = 'he';
        else if (currentPath.includes('/ru/')) currentLang = 'ru';
        else if (currentPath.includes('/en/')) currentLang = 'en';

        // Create language switcher HTML
        const switcherHTML = `
            <div id="language-switcher" style="
                display: inline-flex;
                align-items: center;
                margin-left: 30px;
                margin-right: 20px;
                background: transparent;
                padding: 0;
                order: 999;
                position: relative;
            ">
                <select id="languageSelect" onchange="switchLanguage(this.value)" style="
                    background: transparent;
                    color: #fff;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    padding: 8px 12px;
                    border-radius: 4px;
                    font-size: 14px;
                    cursor: pointer;
                    outline: none;
                    transition: all 0.3s ease;
                " onmouseover="this.style.borderColor='rgba(255, 255, 255, 0.6)'"
                   onmouseout="this.style.borderColor='rgba(255, 255, 255, 0.3)'">
                    <option value="en" ${currentLang === 'en' ? 'selected' : ''}>English</option>
                    <option value="ru" ${currentLang === 'ru' ? 'selected' : ''}>Русский</option>
                    <option value="he" ${currentLang === 'he' ? 'selected' : ''}>עברית</option>
                </select>
            </div>
        `;

        // Define the switch language function globally
        window.switchLanguage = function(lang) {
            const currentPath = window.location.pathname;
            const currentFile = currentPath.split('/').pop() || 'home.html';

            // Build the new path
            let newPath = '';
            const pathParts = currentPath.split('/');
            const isInLangDir = pathParts.some(part => ['en', 'ru', 'he'].includes(part));

            if (isInLangDir) {
                // Replace language in path
                newPath = currentPath.replace(/\/(en|ru|he)\//, `/${lang}/`);
            } else {
                // Add language to path
                newPath = `/${lang}/${currentFile}`;
            }

            // Navigate to new language version
            window.location.href = newPath;
        };

        // Insert switcher into nav menu
        const navMenu = document.querySelector('.nav-menu.w-nav-menu');
        if (navMenu) {
            // Find mobile button wrapper if it exists
            const mobileButtonWrapper = navMenu.querySelector('.mobile-button-wrapper');

            if (mobileButtonWrapper) {
                // Insert before mobile button wrapper
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = switcherHTML;
                const switcher = tempDiv.firstElementChild;
                navMenu.insertBefore(switcher, mobileButtonWrapper);
            } else {
                // Append to nav menu
                navMenu.insertAdjacentHTML('beforeend', switcherHTML);
            }
        }
    }

    // Apply responsive styles
    function addResponsiveStyles() {
        if (!document.getElementById('universal-menu-responsive-styles')) {
            const style = document.createElement('style');
            style.id = 'universal-menu-responsive-styles';
            style.textContent = `
                /* Force menu visibility on ALL screen sizes */
                .nav-menu.w-nav-menu,
                .w-nav-menu {
                    display: flex !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                    position: static !important;
                    transform: none !important;
                    background: transparent !important;
                    pointer-events: auto !important;
                    left: auto !important;
                    right: auto !important;
                    top: auto !important;
                    bottom: auto !important;
                    width: auto !important;
                    height: auto !important;
                    max-width: none !important;
                    max-height: none !important;
                    overflow: visible !important;
                    z-index: auto !important;
                    clip: auto !important;
                    clip-path: none !important;
                }

                /* Override any inline styles */
                .w-nav-menu[style] {
                    display: flex !important;
                }

                .w-nav-menu[style*="display: none"],
                .w-nav-menu[style*="display:none"] {
                    display: flex !important;
                }

                /* Force navigation links visible */
                .w-nav-menu .nav-link,
                .nav-menu .nav-link {
                    display: inline-block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                }

                /* Hide hamburger button */
                .w-nav-button {
                    display: none !important;
                }

                /* Language switcher styles */
                #language-switcher {
                    display: inline-flex !important;
                    margin-left: 30px !important;
                    margin-right: 20px !important;
                    flex-shrink: 0 !important;
                }

                /* Desktop specific */
                @media screen and (min-width: 992px) {
                    .nav-menu.w-nav-menu {
                        grid-column-gap: 50px !important;
                        justify-content: flex-start !important;
                        align-items: center !important;
                    }
                }

                /* Mobile adjustments */
                @media screen and (max-width: 991px) {
                    .nav-menu.w-nav-menu {
                        position: relative !important;
                    }

                    #languageSelect {
                        min-width: 100px !important;
                    }
                }

                @media screen and (max-width: 479px) {
                    .nav-menu.w-nav-menu {
                        flex-wrap: wrap !important;
                    }

                    #language-switcher {
                        margin-left: 10px !important;
                    }

                    #languageSelect {
                        padding: 6px 10px !important;
                        font-size: 13px !important;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Initialize everything
    function initUniversalMenu() {
        forceMenuVisible();
        addInlineLanguageSwitcher();
        addResponsiveStyles();
    }

    // Run on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUniversalMenu);
    } else {
        initUniversalMenu();
    }

    // Also run immediately
    initUniversalMenu();

    // Re-apply on window load for safety
    window.addEventListener('load', initUniversalMenu);

    // Monitor for dynamic changes (less aggressive)
    let observerTimeout;
    const observer = new MutationObserver(() => {
        clearTimeout(observerTimeout);
        observerTimeout = setTimeout(() => {
            const navMenu = document.querySelector('.nav-menu.w-nav-menu');
            if (navMenu) {
                // Force visible if hidden
                const computed = window.getComputedStyle(navMenu);
                if (computed.display === 'none') {
                    forceMenuVisible();
                }
                // Add switcher if missing
                if (!document.getElementById('language-switcher')) {
                    addInlineLanguageSwitcher();
                }
            }
        }, 50);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Also check and fix visibility periodically (less aggressive)
    setInterval(() => {
        const navMenu = document.querySelector('.nav-menu.w-nav-menu');
        if (navMenu) {
            const computed = window.getComputedStyle(navMenu);
            if (computed.display === 'none' || computed.visibility === 'hidden') {
                forceMenuVisible();
            }
        }
    }, 500);
})();