/**
 * Course Details Component
 * Shared component for course details page functionality
 */

(function() {
    'use strict';

    console.log('📚 Course Details Component loaded');

    // Component initialization
    function initCourseDetailsComponent() {
        // Add smooth scrolling to curriculum sections
        const curriculumItems = document.querySelectorAll('.course-lesson-item');
        curriculumItems.forEach(item => {
            item.addEventListener('click', function(e) {
                if (this.classList.contains('expandable')) {
                    this.classList.toggle('expanded');
                }
            });
        });

        // Add hover effects to buttons
        const enrollButtons = document.querySelectorAll('.course-enroll-button');
        enrollButtons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
            });
            button.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });

        // Initialize tooltips
        initTooltips();

        // Initialize video preview if exists
        initVideoPreview();
    }

    // Initialize tooltips for course features
    function initTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', function(e) {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = this.getAttribute('data-tooltip');
                document.body.appendChild(tooltip);

                const rect = this.getBoundingClientRect();
                tooltip.style.position = 'fixed';
                tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
                tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
                tooltip.style.zIndex = '9999';

                this._tooltip = tooltip;
            });

            element.addEventListener('mouseleave', function() {
                if (this._tooltip) {
                    this._tooltip.remove();
                    this._tooltip = null;
                }
            });
        });
    }

    // Initialize video preview functionality
    function initVideoPreview() {
        const previewButton = document.querySelector('.course-preview-button');
        if (previewButton) {
            previewButton.addEventListener('click', function(e) {
                e.preventDefault();
                // Video preview logic would go here
                console.log('Video preview clicked');
            });
        }
    }

    // Helper function to format currency
    function formatCurrency(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }

    // Helper function to format date
    function formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    }

    // Expose component API
    window.CourseDetailsComponent = {
        init: initCourseDetailsComponent,
        formatCurrency: formatCurrency,
        formatDate: formatDate
    };

    // Auto-initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCourseDetailsComponent);
    } else {
        initCourseDetailsComponent();
    }

})();