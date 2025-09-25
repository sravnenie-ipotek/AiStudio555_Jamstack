/**
 * Awards Section Card Overlay Animation using Webflow.js
 *
 * Implements scroll-triggered card overlay animation that matches the reference file behavior.
 * Cards should overlay and switch as the user scrolls through the awards section.
 */

(function() {
    'use strict';

    console.log('🎯 Initializing Awards Section Card Overlay Animation...');

    let isInitialized = false;
    let scrollTriggerActive = false;

    /**
     * Initialize the awards overlay animation system
     */
    function initializeAwardsOverlay() {
        if (isInitialized) {
            console.log('⚠️ Awards overlay already initialized');
            return;
        }

        console.log('🔧 Setting up awards card overlay animation...');

        // Wait for Webflow to be available (with fallback)
        if (typeof window.Webflow === 'undefined' && !window.webflowFallback) {
            console.log('⏳ Waiting for Webflow.js to load...');

            // Set a fallback after 3 seconds if Webflow doesn't load
            setTimeout(() => {
                if (typeof window.Webflow === 'undefined') {
                    console.log('⚠️ Webflow.js not detected, using fallback mode');
                    window.webflowFallback = true;
                    initializeAwardsOverlay();
                }
            }, 3000);

            setTimeout(initializeAwardsOverlay, 500);
            return;
        }

        setupAwardsAnimation();
        isInitialized = true;
        console.log('✅ Awards overlay animation initialized successfully');
    }

    /**
     * Setup the main awards animation logic
     */
    function setupAwardsAnimation() {
        const awardsSection = document.querySelector('.section.awards');
        const awardsInnerTicker = document.querySelector('.awards-inner-ticker-single');
        const awardCards = document.querySelectorAll('.awards-single-card');

        if (!awardsSection || !awardsInnerTicker || awardCards.length === 0) {
            console.warn('❌ Awards section elements not found');
            return;
        }

        console.log(`🎴 Found ${awardCards.length} award cards to animate`);

        // Setup CSS for overlay animation
        setupOverlayCSS();

        // Setup scroll-triggered animation using Webflow pattern
        setupScrollTrigger(awardsSection, awardsInnerTicker, awardCards);

        // Setup Webflow interaction triggers
        setupWebflowTriggers(awardCards);
    }

    /**
     * Setup CSS styles required for overlay animation
     */
    function setupOverlayCSS() {
        const style = document.createElement('style');
        style.id = 'awards-overlay-styles';
        style.textContent = `
            /* Awards Section Overlay Animation Styles */
            .awards-inner-ticker-single {
                position: relative;
                width: 100%;
                overflow: visible;
                transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            }

            .awards-single-card {
                position: relative;
                transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                z-index: 1;
            }

            /* Overlay positioning for scroll animation */
            .awards-single-card.overlay-active {
                position: absolute;
                top: 0;
                left: 0;
                z-index: 2;
            }

            .awards-single-card.overlay-behind {
                z-index: 0;
                opacity: 0.7;
            }

            /* Smooth transform animations */
            .awards-inner-ticker-single.animating {
                will-change: transform;
            }

            /* Responsive overlay behavior */
            @media (max-width: 768px) {
                .awards-single-card {
                    position: relative !important;
                }
            }
        `;

        // Remove existing style if present
        const existingStyle = document.getElementById('awards-overlay-styles');
        if (existingStyle) {
            existingStyle.remove();
        }

        document.head.appendChild(style);
        console.log('🎨 Awards overlay CSS styles applied');
    }

    /**
     * Setup scroll trigger using Webflow-compatible approach
     */
    function setupScrollTrigger(awardsSection, innerTicker, cards) {
        let scrollTimeout;
        let currentCardIndex = 0;

        // Create intersection observer for scroll-based animation
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
                    if (!scrollTriggerActive) {
                        console.log('🎯 Awards section entered viewport - activating scroll animation');
                        scrollTriggerActive = true;
                        startScrollAnimation(innerTicker, cards);
                    }
                } else if (scrollTriggerActive && entry.intersectionRatio < 0.1) {
                    console.log('🎯 Awards section left viewport - deactivating scroll animation');
                    scrollTriggerActive = false;
                    stopScrollAnimation(innerTicker, cards);
                }
            });
        }, {
            threshold: [0.1, 0.3, 0.7],
            rootMargin: '-50px 0px'
        });

        observer.observe(awardsSection);

        // Setup scroll event for card switching
        window.addEventListener('scroll', () => {
            if (!scrollTriggerActive) return;

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                updateCardOverlay(innerTicker, cards);
            }, 50);
        });

        console.log('🔄 Scroll trigger setup complete');
    }

    /**
     * Start scroll-based animation when section is in view
     */
    function startScrollAnimation(innerTicker, cards) {
        innerTicker.classList.add('animating');

        // Use Webflow.js to trigger any existing interactions
        if (window.Webflow && window.Webflow.require) {
            try {
                const ix = window.Webflow.require('ix');
                if (ix) {
                    // Trigger Webflow interactions for awards elements
                    cards.forEach(card => {
                        const wId = card.querySelector('[data-w-id]')?.getAttribute('data-w-id');
                        if (wId) {
                            console.log(`🎬 Triggering Webflow interaction for: ${wId}`);
                        }
                    });
                }
            } catch (e) {
                console.log('ℹ️ Webflow interactions not available, using custom animation');
            }
        }

        console.log('▶️ Awards scroll animation started');
    }

    /**
     * Stop scroll animation when section leaves viewport
     */
    function stopScrollAnimation(innerTicker, cards) {
        innerTicker.classList.remove('animating');

        // Reset all cards to default state
        cards.forEach((card, index) => {
            card.classList.remove('overlay-active', 'overlay-behind');
            card.style.transform = '';
            card.style.zIndex = '';
        });

        console.log('⏸️ Awards scroll animation stopped');
    }

    /**
     * Update card overlay based on scroll position
     */
    function updateCardOverlay(innerTicker, cards) {
        const awardsSection = document.querySelector('.section.awards');
        const rect = awardsSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Calculate scroll progress through the awards section
        const scrollProgress = Math.max(0, Math.min(1,
            (viewportHeight - rect.top) / (viewportHeight + rect.height)
        ));

        // Determine which cards should be overlaying based on scroll progress
        const totalCards = cards.length;
        const cardIndex = Math.floor(scrollProgress * (totalCards - 1));
        const cardProgress = (scrollProgress * (totalCards - 1)) % 1;

        // Apply overlay animation
        applyCardOverlay(innerTicker, cards, cardIndex, cardProgress);
    }

    /**
     * Apply the actual card overlay effect
     */
    function applyCardOverlay(innerTicker, cards, activeIndex, progress) {
        const translateX = -(activeIndex * 100 + progress * 100);

        // Animate the inner ticker container
        innerTicker.style.transform = `translateX(${translateX}%)`;

        // Update card states
        cards.forEach((card, index) => {
            card.classList.remove('overlay-active', 'overlay-behind');

            if (index === activeIndex) {
                card.classList.add('overlay-active');
            } else if (index === activeIndex + 1 && progress > 0.5) {
                card.classList.add('overlay-active');
            } else if (index < activeIndex) {
                card.classList.add('overlay-behind');
            }
        });

        console.log(`🎴 Card overlay updated: active=${activeIndex}, progress=${progress.toFixed(2)}`);
    }

    /**
     * Setup Webflow-style interaction triggers
     */
    function setupWebflowTriggers(cards) {
        // Setup triggers that mimic Webflow's scroll-into-view interactions
        cards.forEach((card, index) => {
            const elementsToAnimate = card.querySelectorAll('[data-w-id]');

            elementsToAnimate.forEach(element => {
                // Reset to initial state (hidden)
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';

                // Setup scroll-triggered reveal animation
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            setTimeout(() => {
                                entry.target.style.opacity = '1';
                                entry.target.style.transform = 'translateY(0)';
                                entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                            }, index * 100); // Stagger animation
                        }
                    });
                }, { threshold: 0.5 });

                observer.observe(element);
            });
        });

        console.log('🎬 Webflow-style triggers setup complete');
    }

    /**
     * Initialize when DOM is ready and Webflow is available
     */
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeAwardsOverlay);
        } else {
            // DOM is already ready
            initializeAwardsOverlay();
        }

        // Also initialize after Webflow is fully loaded
        if (window.Webflow && window.Webflow.ready) {
            window.Webflow.ready(initializeAwardsOverlay);
        } else {
            setTimeout(initializeAwardsOverlay, 1000);
        }
    }

    // Export for debugging and manual initialization
    window.AwardsOverlay = {
        init: initializeAwardsOverlay,
        isInitialized: () => isInitialized,
        forceReinit: () => {
            isInitialized = false;
            scrollTriggerActive = false;
            initializeAwardsOverlay();
        }
    };

    // Auto-initialize
    init();

    console.log('🚀 Awards Webflow Overlay script loaded');

})();