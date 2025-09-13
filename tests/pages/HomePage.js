/**
 * Home Page Object Model
 */

const BasePage = require('./BasePage');

class HomePage extends BasePage {
  constructor(page) {
    super(page);
    this.path = '/home.html';
  }

  // Page elements
  get heroSection() {
    return this.page.locator('.hero-section, .hero');
  }

  get heroTitle() {
    return this.page.locator('.hero h1, .hero-title');
  }

  get heroSubtitle() {
    return this.page.locator('.hero h2, .hero-subtitle, .hero p');
  }

  get ctaButton() {
    return this.page.locator('.hero .primary-button, .hero .cta-button').first();
  }

  get featuredCourses() {
    return this.page.locator('.featured-courses, .courses-section');
  }

  get courseCards() {
    return this.page.locator('.course-card');
  }

  get testimonialSection() {
    return this.page.locator('.testimonials, .testimonial-section');
  }

  get testimonialCards() {
    return this.page.locator('.testimonial-card, .testimonial');
  }

  get statsSection() {
    return this.page.locator('.stats, .statistics, .numbers');
  }

  get statItems() {
    return this.page.locator('.stat-item, .stat');
  }

  // Actions
  async navigateToHome() {
    await this.navigate(this.path);
  }

  async clickHeroCTA() {
    await this.ctaButton.click();
    await this.page.waitForTimeout(500);
  }

  async getCourseCount() {
    return await this.courseCards.count();
  }

  async getTestimonialCount() {
    return await this.testimonialCards.count();
  }

  async scrollToFeaturedCourses() {
    await this.featuredCourses.scrollIntoViewIfNeeded();
  }

  async scrollToTestimonials() {
    await this.testimonialSection.scrollIntoViewIfNeeded();
  }

  async getStats() {
    const stats = [];
    const items = await this.statItems.all();
    
    for (const item of items) {
      const text = await item.textContent();
      stats.push(text);
    }
    
    return stats;
  }

  // Validations
  async validateHeroSection() {
    const issues = [];
    
    // Check hero visibility
    if (!await this.heroSection.isVisible()) {
      issues.push('Hero section not visible');
    }
    
    // Check hero title
    const titleText = await this.heroTitle.textContent();
    if (!titleText || titleText.length < 10) {
      issues.push('Hero title missing or too short');
    }
    
    // Check CTA button
    if (!await this.ctaButton.isVisible()) {
      issues.push('Hero CTA button not visible');
    }
    
    return issues;
  }

  async validateFeaturedCourses() {
    const issues = [];
    
    // Check section visibility
    if (!await this.featuredCourses.isVisible()) {
      issues.push('Featured courses section not visible');
    }
    
    // Check course cards
    const courseCount = await this.getCourseCount();
    if (courseCount === 0) {
      issues.push('No course cards found');
    } else if (courseCount < 3) {
      issues.push(`Only ${courseCount} course cards found (expected at least 3)`);
    }
    
    return issues;
  }

  async validateTestimonials() {
    const issues = [];
    
    // Check section visibility
    await this.scrollToTestimonials();
    if (!await this.testimonialSection.isVisible()) {
      issues.push('Testimonial section not visible');
    }
    
    // Check testimonial cards
    const testimonialCount = await this.getTestimonialCount();
    if (testimonialCount === 0) {
      issues.push('No testimonials found');
    }
    
    return issues;
  }

  async validatePageLoad() {
    const issues = [];
    
    // Check hero section loads
    const heroIssues = await this.validateHeroSection();
    issues.push(...heroIssues);
    
    // Check featured courses load
    const courseIssues = await this.validateFeaturedCourses();
    issues.push(...courseIssues);
    
    // Check page speed
    const performance = await this.checkPageSpeed();
    if (performance.totalLoadTime > 5000) {
      issues.push(`Page load time too slow: ${performance.totalLoadTime}ms`);
    }
    
    // Check console errors
    const consoleErrors = await this.checkConsoleErrors();
    if (consoleErrors.length > 0) {
      issues.push(`Console errors: ${consoleErrors.join(', ')}`);
    }
    
    return issues;
  }
}

module.exports = HomePage;