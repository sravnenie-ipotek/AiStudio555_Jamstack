/**
 * Simple Awards Card Switching Animation
 *
 * Much simpler approach: just slide cards horizontally based on scroll position
 */

(function() {
    'use strict';

    console.log('🎯 Starting Simple Awards Animation...');

    let isActive = false;

    function initSimpleAnimation() {
        const awardsSection = document.querySelector('.section.awards');
        const cardsContainer = document.querySelector('.awards-inner-ticker-single');
        const cards = document.querySelectorAll('.awards-single-card');

        if (!awardsSection || !cardsContainer || cards.length === 0) {
            console.log('❌ Awards elements not found');
            return;
        }

        // Check if page is RTL
        const isRTL = document.documentElement.getAttribute('dir') === 'rtl' ||
                      document.body.getAttribute('dir') === 'rtl' ||
                      document.documentElement.lang === 'he';

        console.log(`🎴 Found ${cards.length} cards to animate`);
        console.log(`🌐 RTL mode: ${isRTL ? 'enabled' : 'disabled'}`);

        // Setup simple CSS - override existing Webflow styles with RTL support and NARROWER cards
        const style = document.createElement('style');
        style.id = 'simple-awards-styles';
        style.textContent = `
            /* Container adjustments for narrower design */
            .section.awards {
                padding-left: 5%;
                padding-right: 5%;
            }

            .section.awards .awards-inner-ticker-wrapper {
                overflow: hidden !important;
                max-width: 650px !important; /* Narrower container width */
                width: 100% !important;
                margin: 0 auto !important; /* Center the container */
                direction: ${isRTL ? 'rtl' : 'ltr'} !important;
            }

            .section.awards .awards-inner-ticker-single {
                display: flex !important;
                flex-direction: ${isRTL ? 'row-reverse' : 'row'} !important;
                width: ${cards.length * 100}% !important;
                transition: transform 0.3s ease !important;
                will-change: transform !important;
                overflow: visible !important;
            }

            .section.awards .awards-single-card {
                flex: 0 0 ${100 / cards.length}% !important;
                width: ${100 / cards.length}% !important;
                min-width: ${100 / cards.length}% !important;
                max-width: ${100 / cards.length}% !important;
                position: relative !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: center !important;
                text-align: center !important;
                opacity: 1 !important;
                visibility: visible !important;
                min-height: 380px !important;
                padding: 35px 30px !important;
                box-sizing: border-box !important;
            }

            /* Icon sizing for narrower cards */
            .section.awards .awards-icon {
                width: 80px !important;
                height: 80px !important;
                margin-bottom: 24px !important;
            }

            /* Text sizing for narrower cards */
            .section.awards .awards-single-card h3 {
                font-size: 22px !important;
                line-height: 1.3 !important;
                margin-bottom: 16px !important;
                padding: 0 10px !important;
            }

            .section.awards .awards-single-card p {
                font-size: 14px !important;
                line-height: 1.5 !important;
                padding: 0 10px !important;
            }

            /* RTL specific adjustments */
            ${isRTL ? `
            .section.awards .awards-inner-ticker-single {
                transform-origin: right center !important;
            }

            .section.awards .awards-single-card {
                text-align: right !important;
            }
            ` : ''}

            /* Tablet adjustments */
            @media screen and (max-width: 991px) {
                .section.awards .awards-inner-ticker-wrapper {
                    max-width: 500px !important;
                }

                .section.awards .awards-single-card {
                    min-height: 350px !important;
                    padding: 30px 25px !important;
                }

                .section.awards .awards-icon {
                    width: 70px !important;
                    height: 70px !important;
                }

                .section.awards .awards-single-card h3 {
                    font-size: 20px !important;
                }
            }

            /* Mobile adjustments */
            @media screen and (max-width: 767px) {
                .section.awards {
                    padding-left: 20px;
                    padding-right: 20px;
                }

                .section.awards .awards-inner-ticker-wrapper {
                    max-width: 100% !important;
                }

                .section.awards .awards-single-card {
                    min-height: 320px !important;
                }
            }

            /* Mobile small adjustments */
            @media screen and (max-width: 479px) {
                .section.awards .awards-single-card {
                    min-height: 280px !important;
                    padding: 25px 20px !important;
                }

                .section.awards .awards-icon {
                    width: 60px !important;
                    height: 60px !important;
                    margin-bottom: 20px !important;
                }

                .section.awards .awards-single-card h3 {
                    font-size: 18px !important;
                    margin-bottom: 12px !important;
                }

                .section.awards .awards-single-card p {
                    font-size: 13px !important;
                }
            }
        `;
        document.head.appendChild(style);

        // Simple scroll handler
        function handleScroll() {
            if (!isActive) return;

            const rect = awardsSection.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Improved progress calculation - more responsive
            let progress = 0;
            if (rect.top <= windowHeight && rect.bottom >= 0) {
                // Section is in viewport
                const sectionHeight = rect.height;
                const visibleTop = Math.max(0, windowHeight - rect.top);
                const visibleHeight = Math.min(sectionHeight, visibleTop, rect.bottom);
                progress = Math.max(0, Math.min(1, visibleTop / sectionHeight));
            }

            // Calculate which card to show (0 to cards.length-1)
            const cardIndex = Math.floor(progress * cards.length);
            const clampedIndex = Math.max(0, Math.min(cardIndex, cards.length - 1));

            // Transform calculation - adjust for RTL
            const translateX = isRTL ?
                (clampedIndex * (100 / cards.length)) : // RTL: slide right (positive values)
                -(clampedIndex * (100 / cards.length)); // LTR: slide left (negative values)

            cardsContainer.style.transform = `translateX(${translateX}%)`;

            // console.log(`Card ${clampedIndex + 1}/${cards.length} (progress: ${progress.toFixed(2)}, translateX: ${translateX}%)`);
        }

        // Intersection observer to activate/deactivate
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isActive = entry.isIntersecting;
                console.log(`Awards section ${isActive ? 'active' : 'inactive'}`);
            });
        }, { threshold: 0.1 });

        observer.observe(awardsSection);

        // Throttled scroll listener
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(handleScroll, 16);
        });

        console.log('✅ Simple animation setup complete');
    }

    // Initialize when ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSimpleAnimation);
    } else {
        initSimpleAnimation();
    }

    // Export for manual control
    window.SimpleAwards = {
        init: initSimpleAnimation
    };

})();