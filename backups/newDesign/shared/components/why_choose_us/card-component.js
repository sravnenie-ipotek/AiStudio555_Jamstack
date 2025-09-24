/**
 * Shared Why Choose Us Card Component JavaScript
 * Based on original why-choose-us-single structure
 * Provides utility functions for creating and managing feature cards
 */

class WhyChooseUsCard {
  constructor() {
    this.cardsData = [];
  }

  /**
   * Initialize the component with card data
   * @param {Array} data - Array of card data objects
   */
  init(data) {
    this.cardsData = data || [
      {
        iconUrl: 'images/Why-Choose-Us-Icon1.svg',
        iconAlt: 'Innovative Teaching',
        title: 'Innovative Teaching Methods Here.',
        description: 'Utilizes cutting-edge teaching techniques & tools deliver engaging interactive & effective learning.',
        i18nTitle: 'features.content.items.0.title',
        i18nDesc: 'features.content.items.0.description'
      },
      {
        iconUrl: 'images/Why-Choose-Us-Icon2.svg',
        iconAlt: 'Certified Professional',
        title: 'Certified Professional In Your Needs.',
        description: 'Numerous industry certification from leading organizations ensuring that the guidance.',
        i18nTitle: 'features.content.items.1.title',
        i18nDesc: 'features.content.items.1.description'
      },
      {
        iconUrl: 'images/Why-Choose-Us-Icon3.svg',
        iconAlt: 'Expert Instructor',
        title: 'Expert Instructor Of Industry.',
        description: 'Providing hands-on, real-world training and mentorship to bridge the gap between theory and practice.',
        i18nTitle: 'features.content.items.2.title',
        i18nDesc: 'features.content.items.2.description'
      }
    ];
  }

  /**
   * Create a single card HTML
   * @param {Object} cardData - Card data object
   * @returns {string} - HTML string for the card
   */
  createCard(cardData) {
    return `
      <div class="why-choose-us-single">
        <div class="why-choose-us-icon-wrapper">
          <img src="${cardData.iconUrl}" loading="lazy" alt="${cardData.iconAlt || ''}" class="why-choose-us-icon">
        </div>
        <div class="why-choose-us-slider-typography">
          <h4 class="why-choose-us-slider-card-name" data-i18n="${cardData.i18nTitle}">${cardData.title}</h4>
          <div class="why-choose-us-card-line"></div>
          <p class="why-choose-us-description-text" data-i18n="${cardData.i18nDesc}">${cardData.description}</p>
        </div>
      </div>
    `;
  }

  /**
   * Create slide wrapper for card
   * @param {Object} cardData - Card data object
   * @param {number} index - Card index
   * @returns {string} - HTML string for the slide
   */
  createSlide(cardData, index) {
    return `
      <div data-w-id="${this.generateId()}" class="why-choose-us-slide w-slide">
        ${this.createCard(cardData)}
      </div>
    `;
  }

  /**
   * Generate a unique ID for webflow compatibility
   * @returns {string} - Unique ID
   */
  generateId() {
    return 'wcu-' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Render all cards into the slider mask
   * @param {string} containerSelector - CSS selector for the container
   */
  render(containerSelector = '.why-choose-us-slider-mask') {
    const container = document.querySelector(containerSelector);
    if (!container) {
      console.error('Container not found:', containerSelector);
      return;
    }

    // Clear existing content
    container.innerHTML = '';

    // Add all slides
    this.cardsData.forEach((cardData, index) => {
      const slideHTML = this.createSlide(cardData, index);
      container.insertAdjacentHTML('beforeend', slideHTML);
    });

    // Reinitialize animations if needed
    this.initAnimations();
  }

  /**
   * Initialize scroll animations for cards
   */
  initAnimations() {
    const cards = document.querySelectorAll('.why-choose-us-single');

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1
      });

      cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
      });
    }
  }

  /**
   * Update card data and re-render
   * @param {Array} newData - New card data
   */
  update(newData) {
    this.cardsData = newData;
    this.render();
  }

  /**
   * Load CSS file dynamically
   * @param {string} cssPath - Path to CSS file
   */
  loadStyles(cssPath = '/backups/newDesign/shared/components/why_choose_us/card-styles.css') {
    if (!document.querySelector(`link[href="${cssPath}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cssPath;
      document.head.appendChild(link);
    }
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = WhyChooseUsCard;
}

// Create global instance for direct browser use
window.WhyChooseUsCard = WhyChooseUsCard;