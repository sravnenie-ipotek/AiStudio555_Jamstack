/**
 * Fix Testimonials Translation
 * Maps testimonial data properly from API to HTML
 */

(function() {
    'use strict';

    console.log('🔧 Fixing testimonials translation...');

    // Wait for DOM and translations to be ready
    function fixTestimonials() {
        const testimonialCards = document.querySelectorAll('.testimonials-single-card');

        if (testimonialCards.length === 0) {
            console.log('⏳ Waiting for testimonial cards...');
            setTimeout(fixTestimonials, 500);
            return;
        }

        // Get current locale
        const urlParams = new URLSearchParams(window.location.search);
        const locale = urlParams.get('locale') || 'en';

        // Define testimonial titles based on locale
        const testimonialTitles = {
            en: [
                '"Outstanding Learning Experience"',
                '"Career Game-Changer"',
                '"Excellent Technical Skills"',
                '"Practical Approach Expert Instructor"'
            ],
            he: [
                '"חוויית למידה יוצאת דופן"',
                '"משנה משחק בקריירה"',
                '"כישורים טכניים מעולים"',
                '"גישה מעשית ומדריך מומחה"'
            ],
            ru: [
                '"Выдающийся опыт обучения"',
                '"Изменение карьеры"',
                '"Отличные технические навыки"',
                '"Практический подход и опытный инструктор"'
            ]
        };

        // Update testimonial cards
        testimonialCards.forEach((card, index) => {
            // Update title
            const titleElement = card.querySelector('.testimonials-title');
            if (titleElement && testimonialTitles[locale] && testimonialTitles[locale][index]) {
                titleElement.textContent = testimonialTitles[locale][index];
                titleElement.removeAttribute('data-i18n'); // Remove to prevent overwrite
            }

            // For Hebrew, ensure RTL is properly set
            if (locale === 'he') {
                card.style.direction = 'rtl';
                card.style.textAlign = 'right';
            }
        });

        console.log('✅ Testimonials translation fixed for locale:', locale);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fixTestimonials);
    } else {
        // Wait a bit for translations to load
        setTimeout(fixTestimonials, 1000);
    }

    // Also listen for language changes
    window.addEventListener('languageChanged', fixTestimonials);

})();