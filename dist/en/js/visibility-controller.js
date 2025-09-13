/**
 * VISIBILITY CONTROLLER
 * Handles all section visibility based on API settings
 * Works across all pages: Home, Career Orientation, etc.
 */

(function() {
    'use strict';
    
    console.log('🎯 Visibility Controller Loaded');
    
    // Configuration for API endpoints
    const API_BASE = window.location.hostname === 'localhost' 
        ? 'http://localhost:3000'
        : 'https://aistudio555jamstack-production.up.railway.app';
    
    /**
     * Apply visibility settings to sections
     */
    function applyVisibility(data, pageType) {
        console.log(`Applying visibility for ${pageType}`, data);
        
        switch(pageType) {
            case 'home':
                applyHomePageVisibility(data);
                break;
            case 'career-orientation':
                applyCareerOrientationVisibility(data);
                break;
            case 'courses':
                applyCoursesVisibility(data);
                break;
            default:
                console.log(`No visibility handler for ${pageType}`);
        }
    }
    
    /**
     * Home Page Visibility Handler
     */
    function applyHomePageVisibility(data) {
        const attrs = data?.attributes || {};
        
        // Hero Section
        if (attrs.heroSectionVisible === false) {
            hideSection(['hero', 'hero-section', 'banner', 'main-banner']);
        }
        
        // Featured Courses Section
        if (attrs.featuredCoursesVisible === false) {
            hideSection(['featured-courses', 'courses-section', 'courses']);
        }
        
        // About Section
        if (attrs.aboutVisible === false) {
            hideSection(['about', 'about-section', 'about-us']);
        }
        
        // Companies Section
        if (attrs.companiesVisible === false) {
            hideSection(['companies', 'partners', 'logos', 'companies-section']);
        }
        
        // Testimonials Section
        if (attrs.testimonialsVisible === false) {
            hideSection(['testimonials', 'reviews', 'testimonials-section']);
        }
        
        // Individual Courses (if using featured courses)
        for (let i = 1; i <= 6; i++) {
            if (attrs[`course_${i}_visible`] === false) {
                hideElement(`course-${i}`);
            }
        }
        
        // Individual Testimonials
        for (let i = 1; i <= 4; i++) {
            if (attrs[`testimonial_${i}_visible`] === false) {
                hideElement(`testimonial-${i}`);
            }
        }
    }
    
    /**
     * Career Orientation Page Visibility Handler
     */
    function applyCareerOrientationVisibility(data) {
        const attrs = data?.attributes || {};
        
        const sections = {
            heroVisible: ['hero', 'hero-section', 'career-hero'],
            problemsVisible: ['problems', 'problems-section', 'challenges'],
            solutionsVisible: ['solutions', 'solutions-section', 'benefits'],
            processVisible: ['process', 'process-section', 'steps'],
            careerPathsVisible: ['career-paths', 'paths-section', 'careers'],
            expertVisible: ['expert', 'expert-section', 'mentor'],
            partnersVisible: ['partners', 'partners-section', 'companies'],
            assessmentVisible: ['assessment', 'assessment-section', 'quiz'],
            footerVisible: ['footer-cta', 'cta-section', 'call-to-action']
        };
        
        Object.entries(sections).forEach(([field, selectors]) => {
            if (attrs[field] === false) {
                hideSection(selectors);
            }
        });
    }
    
    /**
     * Courses Page Visibility Handler
     */
    function applyCoursesVisibility(data) {
        const courses = data || [];
        
        courses.forEach(course => {
            if (course.attributes?.visible === false) {
                // Hide course by ID or data attribute
                hideElement(`course-${course.id}`);
                hideByDataAttribute('course-id', course.id);
            }
        });
    }
    
    /**
     * Hide section by multiple possible selectors
     */
    function hideSection(selectors) {
        selectors.forEach(selector => {
            // Try by class
            const byClass = document.getElementsByClassName(selector);
            Array.from(byClass).forEach(el => {
                el.style.display = 'none';
                el.setAttribute('data-visibility-hidden', 'true');
            });
            
            // Try by ID
            const byId = document.getElementById(selector);
            if (byId) {
                byId.style.display = 'none';
                byId.setAttribute('data-visibility-hidden', 'true');
            }
            
            // Try by data attribute
            const byData = document.querySelectorAll(`[data-section="${selector}"]`);
            byData.forEach(el => {
                el.style.display = 'none';
                el.setAttribute('data-visibility-hidden', 'true');
            });
        });
    }
    
    /**
     * Hide single element by ID
     */
    function hideElement(id) {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = 'none';
            element.setAttribute('data-visibility-hidden', 'true');
        }
    }
    
    /**
     * Hide elements by data attribute
     */
    function hideByDataAttribute(attr, value) {
        const elements = document.querySelectorAll(`[data-${attr}="${value}"]`);
        elements.forEach(el => {
            el.style.display = 'none';
            el.setAttribute('data-visibility-hidden', 'true');
        });
    }
    
    /**
     * Detect current page type
     */
    function detectPageType() {
        const path = window.location.pathname.toLowerCase();
        
        if (path === '/' || path.includes('home') || path.includes('index')) {
            return 'home';
        } else if (path.includes('career-orientation')) {
            return 'career-orientation';
        } else if (path.includes('courses')) {
            return 'courses';
        } else if (path.includes('career-center')) {
            return 'career-center';
        }
        
        return 'unknown';
    }
    
    /**
     * Fetch visibility data and apply
     */
    async function initVisibility() {
        const pageType = detectPageType();
        console.log(`Page type detected: ${pageType}`);
        
        if (pageType === 'unknown') {
            console.log('Page type not supported for visibility control');
            return;
        }
        
        let endpoint;
        switch(pageType) {
            case 'home':
                endpoint = '/api/home-page';
                break;
            case 'career-orientation':
                endpoint = '/api/career-orientation-page';
                break;
            case 'courses':
                endpoint = '/api/courses';
                break;
            default:
                return;
        }
        
        try {
            const response = await fetch(`${API_BASE}${endpoint}`);
            const json = await response.json();
            
            if (pageType === 'courses') {
                applyVisibility(json.data, pageType);
            } else {
                applyVisibility(json.data, pageType);
            }
            
            console.log('✅ Visibility settings applied');
        } catch (error) {
            console.error('Error loading visibility settings:', error);
        }
    }
    
    /**
     * Show visibility status in console (for debugging)
     */
    window.checkVisibility = function() {
        const hidden = document.querySelectorAll('[data-visibility-hidden="true"]');
        console.log(`🔍 Hidden sections: ${hidden.length}`);
        hidden.forEach(el => {
            console.log(`- ${el.id || el.className}`);
        });
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initVisibility);
    } else {
        initVisibility();
    }
    
    // Export for use in other scripts
    window.VisibilityController = {
        apply: applyVisibility,
        init: initVisibility,
        detectPageType: detectPageType
    };
})();