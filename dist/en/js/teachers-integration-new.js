/**
 * Teachers Page Integration
 * Simplified integration that leverages the SharedTeacherCard component
 * The SharedTeacherCard component handles all the heavy lifting
 */

(function() {
    'use strict';

    console.log('📚 [TeachersIntegration] Initializing teachers page integration...');

    // The SharedTeacherCard component auto-initializes and handles everything
    // This file is kept for backward compatibility and additional page-specific logic

    // Add any page-specific functionality here
    document.addEventListener('DOMContentLoaded', () => {
        console.log('✅ [TeachersIntegration] Teachers page ready');

        // Add page-specific event listeners or customizations
        // Example: Add filter buttons if needed
        setupFilterButtons();
        setupSearchFunctionality();
    });

    // Example: Setup filter buttons (if you add them to the page)
    function setupFilterButtons() {
        const filterButtons = document.querySelectorAll('.teacher-filter-btn');

        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const filterType = button.dataset.filter;

                console.log(`🔍 [TeachersIntegration] Filter by: ${filterType}`);

                // You can add filtering logic here
                // For now, the SharedTeacherCard handles all rendering
            });
        });
    }

    // Example: Setup search functionality
    function setupSearchFunctionality() {
        const searchInput = document.querySelector('.teacher-search-input');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                console.log(`🔍 [TeachersIntegration] Searching for: ${searchTerm}`);

                // Filter teacher cards based on search
                const cards = document.querySelectorAll('.shared-teacher-card');

                cards.forEach(card => {
                    const name = card.querySelector('.teacher-name')?.textContent.toLowerCase();
                    const title = card.querySelector('.teacher-title')?.textContent.toLowerCase();
                    const skills = Array.from(card.querySelectorAll('.teacher-skill-tag'))
                        .map(tag => tag.textContent.toLowerCase())
                        .join(' ');

                    const searchContent = `${name} ${title} ${skills}`;

                    if (searchContent.includes(searchTerm)) {
                        card.closest('.teacher-card-wrapper').style.display = '';
                    } else {
                        card.closest('.teacher-card-wrapper').style.display = 'none';
                    }
                });
            });
        }
    }

    // Example: Add custom analytics
    window.addEventListener('load', () => {
        // Track page view
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_title: 'Teachers',
                page_path: '/teachers.html'
            });
        }
    });

    console.log('✅ [TeachersIntegration] Integration complete');

})();