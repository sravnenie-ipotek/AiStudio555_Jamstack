/**
 * Shared Course Categories Card Component JavaScript
 * Based on original course-categories-single structure
 * Provides utility functions for creating and managing category cards
 */

class SharedCategoryCard {
  constructor() {
    this.template = null;
  }

  /**
   * Create a category card with provided data
   * @param {Object} data - Card data
   * @param {string} data.linkUrl - URL for the card link
   * @param {string} data.iconUrl - URL for the icon image
   * @param {string} data.iconAlt - Alt text for icon
   * @param {string} data.title - Card title
   * @param {string} data.description - Card description
   * @param {string} data.i18nTitle - i18n key for title
   * @param {string} data.i18nDesc - i18n key for description
   * @returns {HTMLElement} - Card element
   */
  createCard(data) {
    const cardLink = document.createElement('a');
    cardLink.href = data.linkUrl || '#';
    cardLink.className = 'course-categories-single w-inline-block';

    cardLink.innerHTML = `
      <div class="course-categories-hover-in-shape"></div>
      <div class="course-categories-typography">
        <div class="course-categories-icon-wrapper">
          <img src="${data.iconUrl}" alt="${data.iconAlt || data.title}" class="course-categories-icon" />
        </div>
        <h4 class="course-categories-name" ${data.i18nTitle ? `data-i18n="${data.i18nTitle}"` : ''}>${data.title}</h4>
        <p class="course-categories-description-text" ${data.i18nDesc ? `data-i18n="${data.i18nDesc}"` : ''}>${data.description}</p>
      </div>
    `;

    return cardLink;
  }

  /**
   * Create multiple cards from an array of data
   * @param {Array} cardsData - Array of card data objects
   * @returns {HTMLElement} - Container with all cards
   */
  createCardGroup(cardsData) {
    const container = document.createElement('div');
    container.className = 'course-categories-collection-list';

    cardsData.forEach((cardData, index) => {
      const card = this.createCard(cardData);
      card.style.animationDelay = `${(index + 1) * 0.1}s`;
      container.appendChild(card);
    });

    return container;
  }

  /**
   * Replace existing cards with shared card component
   * @param {string} containerSelector - Selector for the container element
   * @param {Array} cardsData - Array of card data
   */
  replaceCards(containerSelector, cardsData) {
    const container = document.querySelector(containerSelector);
    if (!container) {
      console.error('Container not found:', containerSelector);
      return;
    }

    // Clear existing content
    container.innerHTML = '';

    // Create and append new cards
    const cardGroup = this.createCardGroup(cardsData);
    container.appendChild(cardGroup);
  }

  /**
   * Initialize cards on page load
   * @param {Object} config - Configuration object
   */
  initialize(config = {}) {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initialize(config));
      return;
    }

    // Default configuration
    const defaultConfig = {
      containerSelector: '.course-categories-collection-list',
      animateOnScroll: true,
      ...config
    };

    // Apply animations on scroll if enabled
    if (defaultConfig.animateOnScroll) {
      this.initScrollAnimations();
    }
  }

  /**
   * Initialize scroll animations for cards
   */
  initScrollAnimations() {
    const cards = document.querySelectorAll('.course-categories-single');

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

      cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(card);
      });
    }
  }

  /**
   * Add enhanced hover effects to cards
   */
  addHoverEffects() {
    const cards = document.querySelectorAll('.course-categories-single');

    cards.forEach(card => {
      card.addEventListener('mouseenter', (e) => {
        const hoverShape = e.currentTarget.querySelector('.course-categories-hover-in-shape');
        if (hoverShape) {
          hoverShape.style.opacity = '0.15';
          hoverShape.style.transform = 'scale(2)';
        }
      });

      card.addEventListener('mouseleave', (e) => {
        const hoverShape = e.currentTarget.querySelector('.course-categories-hover-in-shape');
        if (hoverShape) {
          hoverShape.style.opacity = '0';
          hoverShape.style.transform = 'scale(1)';
        }
      });
    });
  }

  /**
   * Filter cards by category
   * @param {string} category - Category to filter by
   */
  filterByCategory(category) {
    const cards = document.querySelectorAll('.course-categories-single');

    cards.forEach(card => {
      if (category === 'all' || card.dataset.category === category) {
        card.style.display = 'block';
        card.style.opacity = '1';
      } else {
        card.style.opacity = '0';
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SharedCategoryCard;
}

// Create global instance for direct browser use
window.SharedCategoryCard = SharedCategoryCard;