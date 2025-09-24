/**
 * Pricing Table Component
 * Reusable pricing table component with translation support
 */

class PricingTableComponent {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.options = {
      title: options.title || 'Invest in Future with Subscription Plans',
      subtitle: options.subtitle || 'Affordable Plans',
      description: options.description || 'Dive into a world of learning with diverse and extensive range of tech courses designed to cater to every interest.',
      plans: options.plans || this.getDefaultPlans(),
      features: options.features || this.getDefaultFeatures(),
      locale: options.locale || this.getLocaleFromURL() || 'en',
      ...options
    };

    this.init();
  }

  /**
   * Get locale from URL parameters
   */
  getLocaleFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('locale');
  }

  /**
   * Default pricing plans
   */
  getDefaultPlans() {
    return {
      basic: {
        name: 'Basic',
        monthlyPrice: '$29',
        yearlyPrice: '$299',
        features: {
          access_all_courses: true,
          community_support: true,
          course_materials: true,
          hands_on_projects: false,
          career_support: false,
          support_sessions: false,
          webinar_access: false
        }
      },
      professional: {
        name: 'Professional',
        monthlyPrice: '$59',
        yearlyPrice: '$599',
        features: {
          access_all_courses: true,
          community_support: true,
          course_materials: true,
          hands_on_projects: true,
          career_support: true,
          support_sessions: false,
          webinar_access: false
        },
        highlighted: true
      },
      enterprise: {
        name: 'Enterprise',
        monthlyPrice: '$99',
        yearlyPrice: '$999',
        features: {
          access_all_courses: true,
          community_support: true,
          course_materials: true,
          hands_on_projects: true,
          career_support: true,
          support_sessions: true,
          webinar_access: true
        }
      }
    };
  }

  /**
   * Default features list
   */
  getDefaultFeatures() {
    return [
      { key: 'access_all_courses', label: 'Access All Courses' },
      { key: 'community_support', label: 'Community Support' },
      { key: 'course_materials', label: 'Course Materials' },
      { key: 'hands_on_projects', label: 'Hands-On Projects' },
      { key: 'career_support', label: 'Career Support' },
      { key: 'support_sessions', label: 'Support Sessions' },
      { key: 'webinar_access', label: 'Access to Webinars' }
    ];
  }

  /**
   * Initialize the component
   */
  async init() {
    if (!this.container) {
      console.error('Pricing table container not found');
      return;
    }

    // Load component template
    await this.loadTemplate();

    // Apply data bindings
    this.applyDataBindings();

    // Initialize tab functionality
    this.initTabs();

    // Apply translations if available
    if (window.languageManager) {
      this.applyTranslations();
    }
  }

  /**
   * Load the component template
   */
  async loadTemplate() {
    try {
      // Try to load from shared component directory
      const response = await fetch('/backups/newDesign/shared/components/card_home/pricing-table-component.html');
      const html = await response.text();
      this.container.innerHTML = html;
    } catch (error) {
      console.warn('Could not load template from file, using inline template');
      this.container.innerHTML = this.getInlineTemplate();
    }
  }

  /**
   * Apply data bindings to the template
   */
  applyDataBindings() {
    // Set title, subtitle, and description
    const titleElement = this.container.querySelector('[data-i18n="pricing.content.title"]');
    const subtitleElement = this.container.querySelector('[data-i18n="pricing.content.subtitle"]');
    const descriptionElement = this.container.querySelector('[data-i18n="pricing.content.description"]');

    if (titleElement) titleElement.textContent = this.options.title;
    if (subtitleElement) subtitleElement.textContent = this.options.subtitle;
    if (descriptionElement) descriptionElement.textContent = this.options.description;

    // Apply plan data
    this.applyPlanData();

    // Apply features
    this.applyFeatures();
  }

  /**
   * Apply plan data to cards
   */
  applyPlanData() {
    const plans = this.options.plans;

    // Monthly plans
    this.updatePlanCard('basic', plans.basic, 'monthly');
    this.updatePlanCard('professional', plans.professional, 'monthly');
    this.updatePlanCard('enterprise', plans.enterprise, 'monthly');

    // Yearly plans
    this.updatePlanCard('basic-yearly', plans.basic, 'yearly');
    this.updatePlanCard('professional-yearly', plans.professional, 'yearly');
    this.updatePlanCard('enterprise-yearly', plans.enterprise, 'yearly');
  }

  /**
   * Update individual plan card
   */
  updatePlanCard(planId, planData, period) {
    const card = this.container.querySelector(`[data-plan="${planId}"]`);
    if (!card) return;

    // Update name
    const nameElement = card.querySelector('.pricing-plan-name');
    if (nameElement) nameElement.textContent = planData.name;

    // Update price
    const priceElement = card.querySelector('.pricing-plan-price');
    if (priceElement) {
      priceElement.textContent = period === 'monthly' ? planData.monthlyPrice : planData.yearlyPrice;
    }

    // Update features checkmarks
    const featuresWrapper = card.querySelector('.pricing-plan-featured-wrapper');
    if (featuresWrapper) {
      const featureElements = featuresWrapper.querySelectorAll('.featured-icon');
      Object.keys(planData.features).forEach((feature, index) => {
        if (featureElements[index]) {
          const isIncluded = planData.features[feature];
          featureElements[index].src = isIncluded ?
            'images/Pricing-Plan-Check-Icon.svg' :
            'images/Pricing-Plan-Cross-Icon.svg';
        }
      });
    }

    // Apply highlighted class if needed
    if (planData.highlighted) {
      card.classList.add('bg');
    }
  }

  /**
   * Apply features to the features column
   */
  applyFeatures() {
    const featuresWrapper = this.container.querySelector('.pricing-plan-featured-name-wrapper .pricing-plan-featured-wrapper');
    if (!featuresWrapper) return;

    // Clear existing features
    featuresWrapper.innerHTML = '';

    // Add features
    this.options.features.forEach((feature, index) => {
      const bgClass = index % 2 === 1 ? 'bg-none' : '';
      const featureElement = document.createElement('div');
      featureElement.className = `pricing-plan-featured-single featured-name ${bgClass}`;
      featureElement.innerHTML = `
        <img loading="lazy" src="images/Pricing-Plan-Featured-Icon.svg" alt="" class="pricing-plan-featured-icon">
        <div class="pricing-plan-featured-name" data-i18n="pricing.content.features.${feature.key}">${feature.label}</div>
      `;
      featuresWrapper.appendChild(featureElement);
    });
  }

  /**
   * Initialize tab functionality
   */
  initTabs() {
    const tabLinks = this.container.querySelectorAll('.pricing-plan-tab-link');
    const tabPanes = this.container.querySelectorAll('.pricing-plan-tab-pane');

    tabLinks.forEach((link, index) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();

        // Remove active class from all tabs
        tabLinks.forEach(l => l.classList.remove('w--current'));
        tabPanes.forEach(p => p.classList.remove('w--tab-active'));

        // Add active class to clicked tab
        link.classList.add('w--current');
        if (tabPanes[index]) {
          tabPanes[index].classList.add('w--tab-active');
        }
      });
    });
  }

  /**
   * Apply translations using the language manager
   */
  applyTranslations() {
    // This will be handled by the unified language manager
    // The data-i18n attributes are already in place
    if (window.languageManager && window.languageManager.updatePageContent) {
      // Trigger translation update for this component
      const event = new CustomEvent('componentLoaded', {
        detail: { component: 'pricing-table' }
      });
      window.dispatchEvent(event);
    }
  }

  /**
   * Get inline template (fallback)
   */
  getInlineTemplate() {
    return `
      <div class="pricing-table-component-wrapper">
        <p>Pricing table component loading...</p>
      </div>
    `;
  }

  /**
   * Update component options
   */
  updateOptions(newOptions) {
    this.options = { ...this.options, ...newOptions };
    this.applyDataBindings();
  }

  /**
   * Destroy the component
   */
  destroy() {
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PricingTableComponent;
}

// Auto-initialize if container exists
document.addEventListener('DOMContentLoaded', () => {
  const autoInitContainers = document.querySelectorAll('[data-pricing-table-auto-init]');
  autoInitContainers.forEach(container => {
    const options = container.dataset.pricingTableOptions ?
      JSON.parse(container.dataset.pricingTableOptions) : {};
    new PricingTableComponent(container.id, options);
  });
});

// Make available globally
window.PricingTableComponent = PricingTableComponent;