/**
 * Hebrew Dropdown Positioning Fix
 *
 * Fixes the About Us dropdown positioning in Hebrew RTL layout
 * This runs after page load to override any CSS positioning issues
 */

(function() {
    'use strict';

    function applyHebrewDropdownFix() {
        console.log('🔧 Applying Hebrew dropdown positioning fix...');

        // Target all dropdown elements
        const dropdowns = document.querySelectorAll('.dropdown-column-wrapper-3');

        dropdowns.forEach(dropdown => {
            // Apply positioning fixes with maximum priority
            dropdown.style.setProperty('left', '50%', 'important');
            dropdown.style.setProperty('right', 'auto', 'important');
            dropdown.style.setProperty('transform', 'translateX(-50%)', 'important');
            dropdown.style.setProperty('margin-left', '0', 'important');
            dropdown.style.setProperty('margin-right', '0', 'important');

            console.log('✅ Applied Hebrew dropdown positioning fix to:', dropdown);
        });

        // Apply RTL text direction to dropdown content
        const dropdownContent = document.querySelectorAll('.dropdown-pd');
        dropdownContent.forEach(content => {
            content.style.setProperty('direction', 'rtl', 'important');
            content.style.setProperty('text-align', 'right', 'important');
        });

        // Apply RTL to dropdown items
        const dropdownItems = document.querySelectorAll('.dropdown-menu-text-link-block');
        dropdownItems.forEach(item => {
            item.style.setProperty('direction', 'rtl', 'important');
            item.style.setProperty('text-align', 'right', 'important');
        });

        console.log(`🎯 Hebrew dropdown fix applied to ${dropdowns.length} dropdowns`);
    }

    function init() {
        // Check if we're on a Hebrew page
        const isHebrewPage = document.documentElement.lang === 'he' ||
                           document.documentElement.getAttribute('lang') === 'he';

        if (!isHebrewPage) {
            return;
        }

        // Apply fix immediately if DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', applyHebrewDropdownFix);
        } else {
            applyHebrewDropdownFix();
        }

        // Also apply fix after a short delay to catch any dynamic elements
        setTimeout(applyHebrewDropdownFix, 500);

        // Apply fix when hovering over dropdown (in case of dynamic positioning)
        document.addEventListener('mouseenter', function(e) {
            if (e.target.closest('.menu-dropdown-wrapper')) {
                setTimeout(applyHebrewDropdownFix, 50);
            }
        }, true);
    }

    // Initialize the fix
    init();
})();