/**
 * Shared Payment/Pricing Component
 * Provides a reusable pricing table component with monthly/yearly tabs
 */

class SharedPaymentComponent {
  constructor(targetSelector, options = {}) {
    this.targetSelector = targetSelector;
    this.options = {
      apiUrl: options.apiUrl || 'https://aistudio555jamstack-production.up.railway.app/api',
      plans: options.plans || [
        { name: 'Basic', monthlyPrice: '$29', yearlyPrice: '$290', features: [true, true, true, false, false, false, false] },
        { name: 'Professional', monthlyPrice: '$49', yearlyPrice: '$490', features: [true, true, true, true, true, true, false], featured: true },
        { name: 'Enterprise', monthlyPrice: '$99', yearlyPrice: '$990', features: [true, true, true, true, true, true, true] }
      ],
      ...options
    };
  }

  async loadComponent() {
    try {
      // Fetch the HTML template
      const templatePath = this.options.templatePath || 'backups/newDesign/shared/components/paymentComponnent/payment-component.html';
      console.log('Loading template from:', templatePath);
      const response = await fetch(templatePath);
      if (!response.ok) {
        throw new Error(`Failed to load payment component template: ${response.status}`);
      }

      const html = await response.text();
      console.log('Template loaded, length:', html.length);

      // Insert into target element
      const targetElement = document.querySelector(this.targetSelector);
      if (!targetElement) {
        console.error(`Target element not found: ${this.targetSelector}`);
        return;
      }

      // Clear and insert HTML
      targetElement.innerHTML = '';
      targetElement.innerHTML = html;
      console.log('Template inserted into DOM');

      // Ensure visibility
      targetElement.style.opacity = '1';
      targetElement.style.visibility = 'visible';
      targetElement.style.display = 'block';

      // Wait a moment for DOM to update
      setTimeout(() => {
        // Initialize the component
        this.initializeTabs();
        this.populatePlanData();
        this.attachEventListeners();
        this.fixGridLayout();
        this.ensureVisibility();
        console.log('Component initialized with', this.options.plans.length, 'plans');
      }, 100);

    } catch (error) {
      console.error('Error loading payment component:', error);
    }
  }

  initializeTabs() {
    // Manual tab switching implementation
    const tabLinks = document.querySelectorAll(`${this.targetSelector} .pricing-plan-tab-link`);
    const tabPanes = document.querySelectorAll(`${this.targetSelector} .pricing-plan-tab-pane`);

    console.log('Initializing tabs:', tabLinks.length, 'links,', tabPanes.length, 'panes');

    tabLinks.forEach((link, index) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();

        // Update all links
        tabLinks.forEach((l) => l.classList.remove('w--current'));
        link.classList.add('w--current');

        // Update tab panes
        tabPanes.forEach((p) => {
          p.style.display = 'none';
          p.classList.remove('w--tab-active');
        });

        if (tabPanes[index]) {
          tabPanes[index].style.display = 'block';
          tabPanes[index].classList.add('w--tab-active');
        }
      });
    });
  }

  populatePlanData() {
    const plans = this.options.plans;

    // First, remove the w-dyn-empty divs as we're populating data
    const emptyDivs = document.querySelectorAll(`${this.targetSelector} .w-dyn-empty`);
    emptyDivs.forEach(div => div.style.display = 'none');
    console.log('Hidden', emptyDivs.length, 'empty divs');

    // Update monthly plans
    const monthlyCards = document.querySelectorAll(`${this.targetSelector} [data-w-tab="Tab 1"] .pricing-plan-featured-card-wrap`);
    console.log('Found', monthlyCards.length, 'monthly cards');
    this.updatePlanCards(monthlyCards, plans, 'monthly');

    // Update yearly plans
    const yearlyCards = document.querySelectorAll(`${this.targetSelector} [data-w-tab="Tab 2"] .pricing-plan-featured-card-wrap`);
    console.log('Found', yearlyCards.length, 'yearly cards');
    this.updatePlanCards(yearlyCards, plans, 'yearly');

    // Debug: Check what elements we have
    const allCards = document.querySelectorAll(`${this.targetSelector} .pricing-plan-featured-card-wrap`);
    console.log('Total cards found:', allCards.length);
    allCards.forEach((card, i) => {
      console.log(`Card ${i}:`, card.className, 'Has collection item:', !!card.querySelector('.pricing-plan-featured-collection-item'));
    });
  }

  updatePlanCards(cards, plans, period) {
    cards.forEach((card, index) => {
      if (index < plans.length) {
        const plan = plans[index];

        // Find the collection item within the card
        const collectionItem = card.querySelector('.pricing-plan-featured-collection-item');
        if (!collectionItem) {
          console.warn('No collection item found in card', index);
          return;
        }

        // Make the collection item visible
        collectionItem.style.display = 'block';

        // Also make the parent collection visible
        const collectionList = card.querySelector('.pricing-plan-featured-collection-list');
        if (collectionList) {
          collectionList.style.display = 'block';
        }

        // Update plan name
        const nameElement = collectionItem.querySelector('.pricing-plan-name');
        if (nameElement) {
          nameElement.textContent = plan.name;
          nameElement.style.fontSize = '24px';
          nameElement.style.fontWeight = 'bold';
        }

        // Update price
        const priceElement = collectionItem.querySelector('.pricing-plan-price');
        if (priceElement) {
          priceElement.textContent = period === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
          priceElement.style.fontSize = '36px';
          priceElement.style.fontWeight = 'bold';
        }

        // Update features checkmarks
        const featureIcons = collectionItem.querySelectorAll('.featured-icon-wrapper .featured-icon');
        featureIcons.forEach((icon, featureIndex) => {
          if (plan.features && plan.features[featureIndex]) {
            icon.src = 'images/Pricing-Plan-Featured-Icon.svg';
            icon.alt = 'Included';
            icon.style.opacity = '1';
            icon.style.display = 'block';
          } else {
            icon.src = 'images/Pricing-Plan-Cross-Icon.svg';
            icon.alt = 'Not included';
            icon.style.opacity = '0.5';
            icon.style.display = 'block';
          }
        });

        // Add featured styling if needed
        if (plan.featured) {
          card.classList.add('bg');
        }
      }
    });
  }

  attachEventListeners() {
    // Handle CTA button clicks
    const ctaButtons = document.querySelectorAll(`${this.targetSelector} .primary-button.pricing`);
    ctaButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        // Trigger contact modal if available
        if (window.openContactModal) {
          window.openContactModal();
        } else {
          // Fallback to navigation
          window.location.href = 'contact-us.html';
        }
      });
    });
  }

  fixGridLayout() {
    // CSS handles most of the layout now
    console.log('Grid layout fixed via CSS');
  }

  ensureVisibility() {
    // Ensure all elements are visible
    const wrapper = document.querySelector(`${this.targetSelector} .pricing-plan-wrapper`);
    if (wrapper) {
      wrapper.style.opacity = '1';
      wrapper.style.visibility = 'visible';
      wrapper.style.display = 'block';
    }

    // Ensure pricing grid is visible
    const grid = document.querySelector(`${this.targetSelector} .pricing-plan-grid`);
    if (grid) {
      grid.style.opacity = '1';
      grid.style.visibility = 'visible';
    }

    // Ensure all collection items are visible
    const collectionItems = document.querySelectorAll(`${this.targetSelector} .pricing-plan-featured-collection-item`);
    collectionItems.forEach(item => {
      item.style.display = 'flex';
      item.style.opacity = '1';
      item.style.visibility = 'visible';
    });

    // Force redraw for better compatibility
    const content = document.querySelector(`${this.targetSelector} .pricing-plan-content`);
    if (content) {
      content.style.display = 'none';
      content.offsetHeight; // Force reflow
      content.style.display = 'block';
    }

    console.log('Visibility ensured for all components');
  }

  // Method to dynamically update pricing from API
  async loadPricingFromAPI() {
    try {
      const response = await fetch(`${this.options.apiUrl}/nd/pricing-page`);
      if (response.ok) {
        const data = await response.json();
        if (data.plans) {
          this.options.plans = data.plans;
          this.populatePlanData();
        }
      }
    } catch (error) {
      console.error('Error loading pricing from API:', error);
    }
  }

  // Static method for easy initialization
  static init(selector, options) {
    const component = new SharedPaymentComponent(selector, options);
    component.loadComponent();
    return component;
  }
}

// Auto-initialize if data attribute is present
document.addEventListener('DOMContentLoaded', () => {
  const autoInitElements = document.querySelectorAll('[data-payment-component="auto"]');
  autoInitElements.forEach(element => {
    SharedPaymentComponent.init(`#${element.id}`, {
      templatePath: element.dataset.templatePath
    });
  });
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SharedPaymentComponent;
}