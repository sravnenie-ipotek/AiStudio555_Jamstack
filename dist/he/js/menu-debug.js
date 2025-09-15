// Menu Debug Script
// This script helps diagnose issues with the menu content

(function() {
    'use strict';

    console.log('🔍 Menu Debug Script Starting...');

    // Wait for page to fully load
    window.addEventListener('DOMContentLoaded', function() {
        setTimeout(function() {
            console.log('🔍 Checking menu state...');

            // Check if shared menu container exists
            const menuContainer = document.getElementById('shared-menu-container');
            if (menuContainer) {
                console.log('✅ Menu container found');
                console.log('📦 Container innerHTML length:', menuContainer.innerHTML.length);
                console.log('📦 Container has content:', menuContainer.innerHTML.trim() !== '');

                // Check for nav menu
                const navMenu = menuContainer.querySelector('.nav-menu');
                if (navMenu) {
                    console.log('✅ Nav menu found');

                    // Check for nav links
                    const navLinks = navMenu.querySelectorAll('.nav-link');
                    console.log('🔗 Nav links found:', navLinks.length);

                    navLinks.forEach((link, index) => {
                        console.log(`   Link ${index + 1}: "${link.textContent.trim()}" (visible: ${link.offsetParent !== null})`);
                    });

                    // Check visibility
                    const menuStyles = window.getComputedStyle(navMenu);
                    console.log('🎨 Menu styles:');
                    console.log('   Display:', menuStyles.display);
                    console.log('   Visibility:', menuStyles.visibility);
                    console.log('   Opacity:', menuStyles.opacity);
                    console.log('   Position:', menuStyles.position);
                    console.log('   Z-index:', menuStyles.zIndex);
                } else {
                    console.log('❌ Nav menu not found in container');
                }

                // Check if navbar exists
                const navbar = menuContainer.querySelector('.navbar');
                if (navbar) {
                    console.log('✅ Navbar found');
                    const navbarStyles = window.getComputedStyle(navbar);
                    console.log('🎨 Navbar visibility:', navbarStyles.display, navbarStyles.visibility);
                } else {
                    console.log('❌ Navbar not found');
                }

            } else {
                console.log('❌ Menu container not found');
            }

            // Check for any nav-link elements on the page
            const allNavLinks = document.querySelectorAll('.nav-link');
            console.log('📊 Total nav-links on page:', allNavLinks.length);

            if (allNavLinks.length > 0) {
                console.log('📋 All nav-link content:');
                allNavLinks.forEach((link, index) => {
                    const parent = link.closest('#shared-menu-container') ? 'in shared menu' : 'outside shared menu';
                    console.log(`   ${index + 1}. "${link.textContent.trim()}" (${parent})`);
                });
            }

            // Check if any JavaScript errors occurred
            console.log('🔍 Checking for menu-related elements...');
            console.log('   .w-nav-menu exists:', document.querySelector('.w-nav-menu') !== null);
            console.log('   .nav-menu exists:', document.querySelector('.nav-menu') !== null);
            console.log('   .navbar exists:', document.querySelector('.navbar') !== null);

        }, 3000); // Wait 3 seconds after page load to ensure everything is initialized
    });

})();