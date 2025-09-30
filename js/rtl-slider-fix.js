/**
 * RTL Slider Fix for Career Orientation Page
 * Disconnects Webflow slider and implements custom RTL-aware navigation
 *
 * Problem: Webflow sliders break in RTL (Hebrew) because arrow directions get confused
 * Solution: Override Webflow behavior with custom RTL-intelligent slider logic
 */

(function() {
    'use strict';

    // Configuration
    const SLIDER_CONFIG = {
        selector: '.detailed-process-slider',
        slideSelector: '.detailed-process-slide',
        leftArrowSelector: '.detailed-process-slider-left-arrow',
        rightArrowSelector: '.detailed-process-slider-right-arrow',
        navDotsSelector: '.detailed-process-slide-nav',
        transitionDuration: 300,
        autoPlay: false,
        autoPlayInterval: 5000
    };

    let sliderInstance = null;

    /**
     * Detect if current page is in RTL mode
     */
    function isRTLMode() {
        // Check URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const locale = urlParams.get('locale');
        if (locale === 'he') return true;

        // Check localStorage
        const savedLocale = localStorage.getItem('preferred_locale');
        if (savedLocale === 'he') return true;

        // Check HTML dir attribute
        const htmlDir = document.documentElement.getAttribute('dir');
        if (htmlDir === 'rtl') return true;

        // Check document language
        const docLang = document.documentElement.getAttribute('lang');
        if (docLang === 'he') return true;

        return false;
    }

    /**
     * Custom Slider Class - RTL Intelligent
     */
    class RTLSlider {
        constructor(container, config) {
            this.container = container;
            this.config = config;
            this.slides = container.querySelectorAll(config.slideSelector);
            this.leftArrow = container.querySelector(config.leftArrowSelector);
            this.rightArrow = container.querySelector(config.rightArrowSelector);
            this.navDots = container.querySelector(config.navDotsSelector);

            this.currentIndex = 0;
            this.totalSlides = this.slides.length;
            this.isRTL = isRTLMode();
            this.isTransitioning = false;
            this.autoPlayTimer = null;

            console.log(`[RTL-Slider] Initializing: RTL=${this.isRTL}, Slides=${this.totalSlides}`);

            this.init();
        }

        init() {
            if (this.totalSlides <= 1) {
                console.log('[RTL-Slider] Not enough slides for navigation');
                return;
            }

            // Disconnect Webflow slider events
            this.disconnectWebflow();

            // Setup custom navigation
            this.setupNavigation();

            // Create navigation dots
            this.setupNavigationDots();

            // Setup keyboard navigation
            this.setupKeyboardNavigation();

            // Initialize first slide
            this.goToSlide(0, false);

            // Start autoplay if enabled
            if (this.config.autoPlay) {
                this.startAutoPlay();
            }

            console.log('[RTL-Slider] Initialization complete');
        }

        /**
         * Disconnect Webflow's slider functionality
         */
        disconnectWebflow() {
            console.log('[RTL-Slider] Disconnecting Webflow slider events...');

            // Remove all Webflow event listeners by cloning elements
            if (this.leftArrow) {
                const newLeftArrow = this.leftArrow.cloneNode(true);
                this.leftArrow.parentNode.replaceChild(newLeftArrow, this.leftArrow);
                this.leftArrow = newLeftArrow;
            }

            if (this.rightArrow) {
                const newRightArrow = this.rightArrow.cloneNode(true);
                this.rightArrow.parentNode.replaceChild(newRightArrow, this.rightArrow);
                this.rightArrow = newRightArrow;
            }

            // Disable Webflow slider completely
            const sliderMask = this.container.querySelector('.w-slider-mask');
            if (sliderMask) {
                // Remove Webflow's transform styles
                sliderMask.style.transform = '';
                sliderMask.style.transition = '';

                // Prevent Webflow from interfering
                this.container.classList.remove('w-slider');
                this.container.setAttribute('data-webflow-disabled', 'true');
            }

            console.log('[RTL-Slider] Webflow slider disconnected');
        }

        /**
         * Setup arrow navigation with RTL intelligence
         */
        setupNavigation() {
            if (!this.leftArrow || !this.rightArrow) {
                console.warn('[RTL-Slider] Navigation arrows not found');
                return;
            }

            // In RTL mode, visual logic is reversed
            if (this.isRTL) {
                // RTL: Right arrow = Previous slide (makes visual sense)
                this.rightArrow.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.previousSlide();
                });

                // RTL: Left arrow = Next slide (makes visual sense)
                this.leftArrow.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.nextSlide();
                });

                console.log('[RTL-Slider] RTL navigation: Right=Previous, Left=Next');
            } else {
                // LTR: Standard logic
                this.leftArrow.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.previousSlide();
                });

                this.rightArrow.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.nextSlide();
                });

                console.log('[RTL-Slider] LTR navigation: Left=Previous, Right=Next');
            }

            // Visual feedback for arrows
            this.updateArrowStates();
        }

        /**
         * Create and setup navigation dots
         */
        setupNavigationDots() {
            if (!this.navDots) return;

            // Clear existing dots
            this.navDots.innerHTML = '';

            // Create dots for each slide
            for (let i = 0; i < this.totalSlides; i++) {
                const dot = document.createElement('div');
                dot.className = 'w-slider-dot';
                dot.setAttribute('data-slide', i);
                dot.addEventListener('click', () => this.goToSlide(i));
                this.navDots.appendChild(dot);
            }

            this.updateNavigationDots();
            console.log(`[RTL-Slider] Created ${this.totalSlides} navigation dots`);
        }

        /**
         * Setup keyboard navigation
         */
        setupKeyboardNavigation() {
            // Only add keyboard listeners when slider is in focus
            this.container.setAttribute('tabindex', '0');

            this.container.addEventListener('keydown', (e) => {
                if (this.isTransitioning) return;

                switch (e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        // In RTL: Left arrow = Next slide
                        this.isRTL ? this.nextSlide() : this.previousSlide();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        // In RTL: Right arrow = Previous slide
                        this.isRTL ? this.previousSlide() : this.nextSlide();
                        break;
                    case 'Home':
                        e.preventDefault();
                        this.goToSlide(0);
                        break;
                    case 'End':
                        e.preventDefault();
                        this.goToSlide(this.totalSlides - 1);
                        break;
                }
            });

            console.log('[RTL-Slider] Keyboard navigation enabled');
        }

        /**
         * Navigate to next slide
         */
        nextSlide() {
            if (this.isTransitioning) return;

            const nextIndex = (this.currentIndex + 1) % this.totalSlides;
            this.goToSlide(nextIndex);

            // Reset autoplay
            if (this.config.autoPlay) {
                this.resetAutoPlay();
            }
        }

        /**
         * Navigate to previous slide
         */
        previousSlide() {
            if (this.isTransitioning) return;

            const prevIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
            this.goToSlide(prevIndex);

            // Reset autoplay
            if (this.config.autoPlay) {
                this.resetAutoPlay();
            }
        }

        /**
         * Navigate to specific slide
         */
        goToSlide(index, animate = true) {
            if (index === this.currentIndex || this.isTransitioning) return;

            const previousIndex = this.currentIndex;
            this.currentIndex = index;

            console.log(`[RTL-Slider] Going to slide ${index} (was ${previousIndex})`);

            if (animate) {
                this.animateToSlide(index, previousIndex);
            } else {
                this.showSlide(index);
                this.updateUIElements();
            }
        }

        /**
         * Animate slide transition
         */
        animateToSlide(newIndex, oldIndex) {
            this.isTransitioning = true;

            // Hide old slide
            this.slides[oldIndex].style.transition = `opacity ${this.config.transitionDuration}ms ease-in-out`;
            this.slides[oldIndex].style.opacity = '0';

            setTimeout(() => {
                // Show new slide
                this.showSlide(newIndex);
                this.slides[newIndex].style.transition = `opacity ${this.config.transitionDuration}ms ease-in-out`;
                this.slides[newIndex].style.opacity = '1';

                setTimeout(() => {
                    this.isTransitioning = false;
                    this.updateUIElements();

                    // Clean up transitions
                    this.slides.forEach(slide => {
                        slide.style.transition = '';
                    });
                }, this.config.transitionDuration);
            }, 50);
        }

        /**
         * Show specific slide (no animation)
         */
        showSlide(index) {
            this.slides.forEach((slide, i) => {
                if (i === index) {
                    slide.style.display = 'block';
                    slide.style.opacity = '1';
                    slide.classList.add('w-slide-active');
                } else {
                    slide.style.display = 'none';
                    slide.style.opacity = '0';
                    slide.classList.remove('w-slide-active');
                }
            });
        }

        /**
         * Update all UI elements (arrows, dots, etc.)
         */
        updateUIElements() {
            this.updateNavigationDots();
            this.updateArrowStates();
        }

        /**
         * Update navigation dots
         */
        updateNavigationDots() {
            if (!this.navDots) return;

            const dots = this.navDots.querySelectorAll('.w-slider-dot');
            dots.forEach((dot, i) => {
                if (i === this.currentIndex) {
                    dot.classList.add('w-active');
                } else {
                    dot.classList.remove('w-active');
                }
            });
        }

        /**
         * Update arrow states (disabled/enabled)
         */
        updateArrowStates() {
            if (!this.leftArrow || !this.rightArrow) return;

            // For infinite loop, arrows are always enabled
            // For linear navigation, disable at ends
            const isFirstSlide = this.currentIndex === 0;
            const isLastSlide = this.currentIndex === this.totalSlides - 1;

            // Remove previous states
            [this.leftArrow, this.rightArrow].forEach(arrow => {
                arrow.classList.remove('w-disabled');
                arrow.style.opacity = '1';
                arrow.style.pointerEvents = 'auto';
            });

            // Apply disabled states for linear navigation if desired
            // Currently using infinite loop, so arrows are always enabled
        }

        /**
         * Start autoplay
         */
        startAutoPlay() {
            if (this.autoPlayTimer) return;

            this.autoPlayTimer = setInterval(() => {
                this.nextSlide();
            }, this.config.autoPlayInterval);

            console.log('[RTL-Slider] Autoplay started');
        }

        /**
         * Stop autoplay
         */
        stopAutoPlay() {
            if (this.autoPlayTimer) {
                clearInterval(this.autoPlayTimer);
                this.autoPlayTimer = null;
                console.log('[RTL-Slider] Autoplay stopped');
            }
        }

        /**
         * Reset autoplay timer
         */
        resetAutoPlay() {
            this.stopAutoPlay();
            this.startAutoPlay();
        }

        /**
         * Pause autoplay on hover
         */
        setupAutoPlayPause() {
            if (!this.config.autoPlay) return;

            this.container.addEventListener('mouseenter', () => {
                this.stopAutoPlay();
            });

            this.container.addEventListener('mouseleave', () => {
                this.startAutoPlay();
            });
        }

        /**
         * Reinitialize slider (useful after dynamic content updates)
         */
        reinitialize() {
            console.log('[RTL-Slider] Reinitializing slider after content update...');

            // Re-detect slides
            this.slides = this.container.querySelectorAll(this.config.slideSelector);
            this.totalSlides = this.slides.length;

            console.log(`[RTL-Slider] Redetected ${this.totalSlides} slides`);

            // Recreate navigation dots for new slide count
            if (this.navDots) {
                this.setupNavigationDots();
            }

            // Reset to first slide
            this.currentIndex = 0;
            this.goToSlide(0, false);

            // Update UI
            this.updateUIElements();

            console.log('[RTL-Slider] Reinitializa​tion complete');
        }

        /**
         * Update slides after dynamic content loading
         */
        updateDynamicContent() {
            console.log('[RTL-Slider] Updating slider for dynamic content...');

            // Wait for images to load
            const images = this.container.querySelectorAll('img');
            let loadedImages = 0;

            if (images.length === 0) {
                this.reinitialize();
                return;
            }

            images.forEach(img => {
                if (img.complete) {
                    loadedImages++;
                } else {
                    img.onload = img.onerror = () => {
                        loadedImages++;
                        if (loadedImages === images.length) {
                            this.reinitialize();
                        }
                    };
                }
            });

            // Fallback if all images are already loaded
            if (loadedImages === images.length) {
                this.reinitialize();
            }
        }

        /**
         * Destroy slider instance
         */
        destroy() {
            this.stopAutoPlay();
            // Remove event listeners would go here
            console.log('[RTL-Slider] Slider destroyed');
        }
    }

    /**
     * Initialize RTL slider when DOM is ready
     */
    function initRTLSlider() {
        // Only initialize for Hebrew (RTL) pages or if explicitly needed
        const shouldInitialize = isRTLMode() || document.querySelector('[data-force-custom-slider]');

        if (!shouldInitialize) {
            console.log('[RTL-Slider] Not in RTL mode, using default Webflow slider');
            return;
        }

        const sliderContainer = document.querySelector(SLIDER_CONFIG.selector);

        if (!sliderContainer) {
            console.warn('[RTL-Slider] Slider container not found');
            return;
        }

        // Initialize custom slider
        sliderInstance = new RTLSlider(sliderContainer, SLIDER_CONFIG);

        console.log('[RTL-Slider] Custom RTL slider initialized');
    }

    /**
     * Wait for DOM and initialize
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initRTLSlider);
    } else {
        // DOM is already ready
        initRTLSlider();
    }

    // Also initialize after a short delay to ensure all scripts are loaded
    setTimeout(initRTLSlider, 1000);

    // Export for debugging and dynamic content integration
    window.RTLSlider = {
        instance: () => sliderInstance,
        reinit: initRTLSlider,
        reinitialize: () => sliderInstance ? sliderInstance.reinitialize() : null,
        updateDynamicContent: () => sliderInstance ? sliderInstance.updateDynamicContent() : null,
        config: SLIDER_CONFIG
    };

})();