/**
 * Fix Testimonials Translation - DUAL SYSTEM ARCHITECTURE (System 2)
 * Maps testimonial data properly from API to HTML
 *
 * DUAL SYSTEM ARCHITECTURE - System 2: Dynamic Content Population
 * UI TRANSLATIONS: Handled by unified-language-manager.js (System 1)
 * CRITICAL: Removes data-i18n attributes after updating to prevent conflicts
 */

(function() {
    'use strict';

    console.log('🔧 Fixing testimonials translation...');
    console.log('🌐 Current URL path:', window.location.pathname);
    console.log('📍 Script loaded at:', new Date().toLocaleTimeString());

    // Wait for DOM and translations to be ready
    function fixTestimonials() {
        const testimonialCards = document.querySelectorAll('.testimonials-single-card');

        if (testimonialCards.length === 0) {
            console.log('⏳ Waiting for testimonial cards...');
            console.log('🔍 DOM ready state:', document.readyState);
            console.log('🔍 Testimonials section exists:', !!document.querySelector('.testimonials'));
            setTimeout(fixTestimonials, 500);
            return;
        }

        console.log(`📊 Found ${testimonialCards.length} testimonial cards to process`);

        // Get current locale from URL path or parameters
        let locale = 'en';
        const path = window.location.pathname;
        const urlParams = new URLSearchParams(window.location.search);

        if (path.includes('/he/')) {
            locale = 'he';
        } else if (path.includes('/ru/')) {
            locale = 'ru';
        } else if (urlParams.get('locale')) {
            locale = urlParams.get('locale');
        }

        // Define testimonial title mappings based on English content
        const testimonialTitleMappings = {
            '"Quality of the Content is Unmatched"': {
                he: '"איכות התוכן ללא תחרות"',
                ru: '"Качество контента не имеет равных"'
            },
            '"Projects Were Particularly Helpful"': {
                he: '"הפרויקטים היו מועילים במיוחד"',
                ru: '"Проекты были особенно полезными"'
            },
            '"Curriculum Covered Everything"': {
                he: '"תוכנית הלימודים כיסתה הכל"',
                ru: '"Учебная программа охватывала все"'
            },
            '"Practical Approach Expert Instructor"': {
                he: '"גישה מעשית ומדריך מומחה"',
                ru: '"Практический подход и опытный инструктор"'
            },
            '"A Game Changer for My Career"': {
                he: '"משנה משחק בקריירה שלי"',
                ru: '"Переломный момент в моей карьере"'
            },
            '"Highly Recommend Zohacous!"': {
                he: '"ממליץ בחום על זוהקוס!"',
                ru: '"Горячо рекомендую Zohacous!"'
            },
            '"An Exceptional Mentorship Journey"': {
                he: '"מסע הדרכה יוצא דופן"',
                ru: '"Исключительный путь наставничества"'
            }
        };

        // Update testimonial cards by matching English content
        testimonialCards.forEach((card, index) => {
            const titleElement = card.querySelector('.testimonials-title');
            if (titleElement) {
                const currentTitle = titleElement.textContent.trim();
                console.log(`🔍 Card ${index + 1}: Current title = "${currentTitle}"`);
                console.log(`🔍 Card ${index + 1}: Locale = "${locale}"`);

                if (locale !== 'en') {
                    const translation = testimonialTitleMappings[currentTitle];
                    console.log(`🔍 Card ${index + 1}: Translation found =`, !!translation);

                    if (translation && translation[locale]) {
                        console.log(`🔄 Translating "${currentTitle}" to "${translation[locale]}"`);
                        titleElement.textContent = translation[locale];
                        titleElement.removeAttribute('data-i18n'); // DUAL SYSTEM: Prevent language manager conflicts
                        console.log(`✅ Card ${index + 1}: Translation completed`);
                    } else {
                        console.log(`⚠️ Card ${index + 1}: No translation available for "${currentTitle}" in locale "${locale}"`);
                    }
                } else {
                    console.log(`🔍 Card ${index + 1}: English locale - no translation needed`);
                }
            } else {
                console.log(`⚠️ Card ${index + 1}: No title element found`);
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
        document.addEventListener('DOMContentLoaded', () => {
            // Wait for other scripts to potentially load content
            setTimeout(fixTestimonials, 1500);
        });
    } else {
        // Wait a bit for translations and other scripts to load
        setTimeout(fixTestimonials, 1500);
    }

    // Also listen for language changes
    window.addEventListener('languageChanged', () => {
        setTimeout(fixTestimonials, 100);
    });

    // Aggressive monitoring and fixing approach
    let fixCount = 0;
    let lastKnownTitles = {};

    function aggressiveFix() {
        const path = window.location.pathname;
        // Run on ALL language pages, not just Hebrew
        if (!path.includes('/he/') && !path.includes('/ru/') && !path.includes('/en/')) {
            return; // Only run on language-specific pages
        }

        const testimonialCards = document.querySelectorAll('.testimonials-single-card');
        let needsFix = false;

        // Get current locale from URL path
        let currentLocale = 'en';
        if (path.includes('/he/')) {
            currentLocale = 'he';
        } else if (path.includes('/ru/')) {
            currentLocale = 'ru';
        }

        testimonialCards.forEach((card, index) => {
            const titleElement = card.querySelector('.testimonials-title');
            if (titleElement) {
                const currentTitle = titleElement.textContent.trim();

                // Check if this title is in English and needs translation
                const englishTitles = [
                    '"Quality of the Content is Unmatched"',
                    '"Projects Were Particularly Helpful"',
                    '"Curriculum Covered Everything"',
                    '"Practical Approach Expert Instructor"',
                    '"A Game Changer for My Career"',
                    '"Highly Recommend Zohacous!"',
                    '"An Exceptional Mentorship Journey"'
                ];

                // Check if we're on a non-English page and title is still in English
                if (currentLocale !== 'en' && englishTitles.includes(currentTitle)) {
                    needsFix = true;
                    console.log(`🚨 Found English title on ${currentLocale} page: "${currentTitle}"`);
                }

                // Also check if we're showing wrong language content
                const isHebrewText = /[\u0590-\u05FF]/.test(currentTitle);
                const isRussianText = /[А-я]/.test(currentTitle);

                if ((currentLocale === 'he' && isRussianText) || (currentLocale === 'ru' && isHebrewText)) {
                    needsFix = true;
                    console.log(`🚨 Wrong language detected on ${currentLocale} page: "${currentTitle}"`);
                }
            }
        });

        if (needsFix) {
            fixCount++;
            console.log(`🔧 Running testimonials fix (attempt #${fixCount})`);
            fixTestimonials();
        }

        // Continue monitoring
        if (fixCount < 20) { // Prevent infinite loops
            setTimeout(aggressiveFix, 500); // Check every 500ms
        }
    }

    // Start aggressive monitoring immediately
    aggressiveFix();

    // Also set up a less frequent background check
    setInterval(() => {
        if (fixCount < 20) {
            aggressiveFix();
        }
    }, 3000); // Check every 3 seconds

})();