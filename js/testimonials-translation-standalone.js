/**
 * Standalone Testimonials Translation Fix
 * This is a simplified, aggressive version that forces Hebrew translations
 */

(function() {
    'use strict';

    console.log('🚀 STANDALONE: Testimonials Hebrew Translation Fix Loading...');

    // Check if we're on a Hebrew page
    const isHebrewPage = window.location.pathname.includes('/he/');

    if (!isHebrewPage) {
        console.log('⏭️ Not a Hebrew page, skipping testimonials fix');
        return;
    }

    console.log('🎯 Hebrew page detected, will translate testimonials');

    // Hebrew translations for testimonials
    const hebrewTitles = [
        '"איכות התוכן ללא תחרות"',           // "Quality of the Content is Unmatched"
        '"הפרויקטים היו מועילים במיוחד"',    // "Projects Were Particularly Helpful"
        '"תוכנית הלימודים כיסתה הכל"',       // "Curriculum Covered Everything"
        '"גישה מעשית ומדריך מומחה"',         // "Practical Approach Expert Instructor"
        '"משנה משחק בקריירה שלי"',           // "A Game Changer for My Career"
        '"ממליץ בחום על זוהקוס!"',           // "Highly Recommend Zohacous!"
        '"מסע הדרכה יוצא דופן"'              // "An Exceptional Mentorship Journey"
    ];

    function forceHebrewTranslations() {
        console.log('🔧 FORCE: Applying Hebrew testimonial translations...');

        const titleElements = document.querySelectorAll('.testimonials-title');
        console.log(`📊 Found ${titleElements.length} testimonial titles`);

        titleElements.forEach((element, index) => {
            if (element && hebrewTitles[index]) {
                const oldText = element.textContent;
                element.textContent = hebrewTitles[index];
                element.removeAttribute('data-i18n'); // Prevent overwrites
                console.log(`✅ Title ${index + 1}: "${oldText}" → "${hebrewTitles[index]}"`);
            }
        });

        // Apply RTL styling
        const testimonialCards = document.querySelectorAll('.testimonials-single-card');
        testimonialCards.forEach(card => {
            card.style.direction = 'rtl';
            card.style.textAlign = 'right';
        });

        console.log('🎉 Hebrew testimonials translation completed!');
    }

    // Try multiple times at different intervals
    function attemptFix(attemptNumber) {
        console.log(`🔄 Translation attempt #${attemptNumber}`);

        const titles = document.querySelectorAll('.testimonials-title');
        if (titles.length === 0) {
            console.log('⏳ No testimonials found yet, waiting...');
            if (attemptNumber < 10) {
                setTimeout(() => attemptFix(attemptNumber + 1), 1000);
            }
            return;
        }

        forceHebrewTranslations();

        // Verify after 2 seconds
        setTimeout(() => {
            const firstTitle = document.querySelector('.testimonials-title');
            if (firstTitle) {
                const text = firstTitle.textContent.trim();
                console.log('🧪 Verification check - First title:', text);
                if (text.includes('Practical Approach') || text.includes('Quality of the Content')) {
                    console.log('⚠️ Still in English! Trying again...');
                    forceHebrewTranslations();
                }
            }
        }, 2000);
    }

    // Start immediately and retry
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => attemptFix(1));
    } else {
        attemptFix(1);
    }

    // Also set up periodic checks
    let checkCount = 0;
    const maxChecks = 20;

    const periodicCheck = setInterval(() => {
        checkCount++;

        const firstTitle = document.querySelector('.testimonials-title');
        if (firstTitle && firstTitle.textContent.includes('Practical Approach')) {
            console.log(`🔁 Periodic check #${checkCount}: English detected, fixing...`);
            forceHebrewTranslations();
        }

        if (checkCount >= maxChecks) {
            clearInterval(periodicCheck);
            console.log('🏁 Periodic checks completed');
        }
    }, 2000);

})();