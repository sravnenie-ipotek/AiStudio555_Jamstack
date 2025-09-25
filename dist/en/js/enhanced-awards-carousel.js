/**
 * Enhanced Awards Scroll Carousel
 *
 * Creates a smooth scroll-based carousel that:
 * - Moves cards as user scrolls through the awards section
 * - Shows each card progressively during scroll
 * - Allows normal scrolling to continue when last card appears
 * - Never gets "stuck" - always allows scroll progression
 */

(function() {
    'use strict';

    console.log('🎠 Enhanced Awards Carousel Loading...');

    let isInitialized = false;
    let scrollProgress = 0;
    let isCarouselActive = false;

    function initEnhancedCarousel() {
        if (isInitialized) return;

        const awardsSection = document.querySelector('.section.awards');
        const cardsContainer = document.querySelector('.awards-inner-ticker-single');
        const cards = document.querySelectorAll('.awards-single-card');

        if (!awardsSection || !cardsContainer || cards.length === 0) {
            console.log('❌ Awards elements not found - retrying in 1s...');
            setTimeout(initEnhancedCarousel, 1000);
            return;
        }

        isInitialized = true;
        console.log(`🎴 Initializing carousel with ${cards.length} cards`);

        // Detect RTL mode
        const isRTL = document.documentElement.getAttribute('dir') === 'rtl' ||
                      document.body.getAttribute('dir') === 'rtl' ||
                      document.documentElement.lang === 'he';

        console.log(`🌐 RTL mode: ${isRTL ? 'enabled' : 'disabled'}`);

        // Enhanced CSS with smoother animations and better responsiveness
        const style = document.createElement('style');
        style.id = 'enhanced-awards-carousel';
        style.textContent = `
            /* Enhanced container for smooth carousel */
            .section.awards {
                position: relative;
                padding: 40px 5% 60px 5% !important;
                overflow: hidden;
            }

            .section.awards .awards-content {
                margin-bottom: 0 !important;
                padding-bottom: 0 !important;
            }

            .section.awards .awards-content-flex {
                gap: 40px !important;
                align-items: flex-start !important;
                margin-bottom: 0 !important;
            }

            .section.awards .awards-content-card {
                margin-top: 0 !important;
                padding-top: 0 !important;
            }

            .section.awards .awards-inner-ticker-wrapper {
                max-width: 650px !important;
                width: 100% !important;
                margin: 0 auto !important;
                position: relative;
                overflow: hidden !important;
                border-radius: 20px;
                direction: ${isRTL ? 'rtl' : 'ltr'};
            }

            .section.awards .awards-inner-ticker-single {
                display: flex !important;
                flex-direction: ${isRTL ? 'row-reverse' : 'row'} !important;
                width: ${cards.length * 100}% !important;
                height: 100%;
                transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
                will-change: transform !important;
            }

            .section.awards .awards-single-card {
                flex: 0 0 ${100 / cards.length}% !important;
                width: ${100 / cards.length}% !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: center !important;
                text-align: center !important;
                min-height: 400px !important;
                padding: 40px 30px !important;
                box-sizing: border-box !important;
                position: relative;
                opacity: 1 !important;
                visibility: visible !important;
                background: rgba(255, 255, 255, 0.02);
                border-radius: 16px;
                margin: 0 5px;
                transition: all 0.3s ease;
            }

            /* Card hover effects */
            .section.awards .awards-single-card:hover {
                background: rgba(255, 255, 255, 0.05);
                transform: translateY(-5px);
            }

            /* Enhanced icon styling */
            .section.awards .awards-icon {
                width: 85px !important;
                height: 85px !important;
                margin-bottom: 28px !important;
                transition: transform 0.3s ease;
                filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
            }

            .section.awards .awards-single-card:hover .awards-icon {
                transform: scale(1.1);
            }

            /* Enhanced text styling */
            .section.awards .awards-single-card h3 {
                font-size: 24px !important;
                font-weight: 700 !important;
                line-height: 1.3 !important;
                margin-bottom: 18px !important;
                color: #ffffff;
                padding: 0 15px !important;
            }

            .section.awards .awards-single-card p {
                font-size: 15px !important;
                line-height: 1.6 !important;
                color: rgba(255, 255, 255, 0.85);
                padding: 0 15px !important;
                margin: 0;
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

            /* Progress indicator */
            .awards-progress {
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                gap: 8px;
                z-index: 10;
            }

            .awards-progress-dot {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transition: all 0.3s ease;
            }

            .awards-progress-dot.active {
                background: #ffffff;
                transform: scale(1.2);
            }

            /* Responsive adjustments */
            @media screen and (max-width: 991px) {
                .section.awards .awards-inner-ticker-wrapper {
                    max-width: 500px !important;
                }
                .section.awards .awards-single-card {
                    min-height: 380px !important;
                    padding: 35px 25px !important;
                }
                .section.awards .awards-icon {
                    width: 75px !important;
                    height: 75px !important;
                }
                .section.awards .awards-single-card h3 {
                    font-size: 22px !important;
                }
            }

            @media screen and (max-width: 767px) {
                .section.awards {
                    padding: 40px 20px 50px 20px !important;
                }
                .section.awards .awards-inner-ticker-wrapper {
                    max-width: 100% !important;
                }
                .section.awards .awards-single-card {
                    min-height: 350px !important;
                    padding: 30px 20px !important;
                }
            }

            @media screen and (max-width: 479px) {
                .section.awards .awards-single-card {
                    min-height: 320px !important;
                    padding: 25px 15px !important;
                }
                .section.awards .awards-icon {
                    width: 65px !important;
                    height: 65px !important;
                    margin-bottom: 24px !important;
                }
                .section.awards .awards-single-card h3 {
                    font-size: 20px !important;
                    margin-bottom: 15px !important;
                }
                .section.awards .awards-single-card p {
                    font-size: 14px !important;
                }
            }
        `;
        document.head.appendChild(style);

        // Add progress indicator
        const progressContainer = document.createElement('div');
        progressContainer.className = 'awards-progress';
        for (let i = 0; i < cards.length; i++) {
            const dot = document.createElement('div');
            dot.className = 'awards-progress-dot';
            progressContainer.appendChild(dot);
        }
        awardsSection.appendChild(progressContainer);

        // Enhanced scroll handler with smooth transitions
        function updateCarousel() {
            if (!isCarouselActive) return;

            const rect = awardsSection.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const sectionHeight = rect.height;

            // Calculate scroll progress through the section
            let progress = 0;

            if (rect.top <= windowHeight * 0.8 && rect.bottom >= windowHeight * 0.2) {
                // Section is significantly visible
                const sectionStart = windowHeight * 0.8 - rect.top;
                const progressRange = sectionHeight + (windowHeight * 0.6);
                progress = Math.max(0, Math.min(1, sectionStart / progressRange));
            } else if (rect.bottom < windowHeight * 0.2) {
                // Section has passed - set to 100%
                progress = 1;
            }

            // Update scroll progress
            scrollProgress = progress;

            // Calculate active card (0 to cards.length-1)
            const totalCards = cards.length;
            const cardProgress = progress * (totalCards - 1);
            const activeIndex = Math.round(cardProgress);
            const clampedIndex = Math.max(0, Math.min(activeIndex, totalCards - 1));

            // Smooth transform calculation
            const slideProgress = progress * (totalCards - 1);
            const translateX = isRTL ?
                (slideProgress * (100 / totalCards)) :
                -(slideProgress * (100 / totalCards));

            // Apply smooth transform
            cardsContainer.style.transform = `translateX(${translateX}%)`;

            // Update progress indicators
            const dots = progressContainer.querySelectorAll('.awards-progress-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === clampedIndex);
            });

            // Debug logging (comment out in production)
            if (Math.random() < 0.01) { // Log occasionally
                console.log(`🎠 Card ${clampedIndex + 1}/${totalCards} | Progress: ${(progress * 100).toFixed(1)}% | Transform: ${translateX.toFixed(1)}%`);
            }
        }

        // Intersection Observer for performance
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const wasActive = isCarouselActive;
                isCarouselActive = entry.isIntersecting;

                if (!wasActive && isCarouselActive) {
                    console.log('🎠 Carousel activated');
                } else if (wasActive && !isCarouselActive) {
                    console.log('🎠 Carousel deactivated');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '20% 0px 20% 0px'
        });

        observer.observe(awardsSection);

        // Optimized scroll listener with requestAnimationFrame
        let isScrolling = false;
        function handleScroll() {
            if (!isScrolling) {
                requestAnimationFrame(() => {
                    updateCarousel();
                    isScrolling = false;
                });
                isScrolling = true;
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true });

        // Initial update
        setTimeout(() => {
            updateCarousel();
            console.log('✅ Enhanced Awards Carousel initialized successfully');
        }, 100);

        // Return control object
        return {
            update: updateCarousel,
            getProgress: () => scrollProgress,
            isActive: () => isCarouselActive
        };
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEnhancedCarousel);
    } else {
        // Small delay to ensure other scripts are loaded
        setTimeout(initEnhancedCarousel, 500);
    }

    // Export for manual control
    window.EnhancedAwardsCarousel = {
        init: initEnhancedCarousel
    };

})();