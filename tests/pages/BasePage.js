/**
 * Base Page Object Model
 * Contains common functionality for all pages
 */

class BasePage {
  constructor(page) {
    this.page = page;
    this.baseURL = process.env.BASE_URL || 'http://localhost:3005';
  }

  // Navigation methods
  async navigate(path = '') {
    await this.page.goto(`${this.baseURL}${path}`);
    await this.page.waitForLoadState('networkidle');
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');
  }

  // Common elements
  get header() {
    return this.page.locator('header, .navbar');
  }

  get footer() {
    return this.page.locator('footer');
  }

  get hamburgerMenu() {
    return this.page.locator('.w-nav-button, .menu-button, .hamburger').first();
  }

  get mobileMenu() {
    return this.page.locator('.w-nav-overlay, .mobile-menu, .w-nav-menu');
  }

  get signUpButton() {
    return this.page.locator('.primary-button, .sign-up-button, [href*="contact"]').first();
  }

  get languageSelector() {
    return this.page.locator('#language-switcher select');
  }

  // Common actions
  async clickHamburgerMenu() {
    await this.hamburgerMenu.click();
    await this.page.waitForTimeout(500);
  }

  async isMobileMenuOpen() {
    return await this.mobileMenu.isVisible();
  }

  async closeMobileMenu() {
    if (await this.isMobileMenuOpen()) {
      await this.page.locator('body').click({ position: { x: 0, y: 0 } });
      await this.page.waitForTimeout(500);
    }
  }

  async selectLanguage(language) {
    await this.languageSelector.selectOption(language);
    await this.page.waitForLoadState('networkidle');
  }

  async getViewportSize() {
    return this.page.viewportSize();
  }

  async isMobile() {
    const viewport = await this.getViewportSize();
    return viewport.width < 768;
  }

  async isTablet() {
    const viewport = await this.getViewportSize();
    return viewport.width >= 768 && viewport.width < 1024;
  }

  async isDesktop() {
    const viewport = await this.getViewportSize();
    return viewport.width >= 1024;
  }

  // Validation methods
  async checkNoHorizontalScroll() {
    const bodyWidth = await this.page.evaluate(() => document.body.scrollWidth);
    const windowWidth = await this.page.evaluate(() => window.innerWidth);
    return bodyWidth <= windowWidth + 1;
  }

  async checkTouchTargetSizes() {
    const elements = await this.page.$$('a, button, input, select, textarea, [role="button"]');
    const issues = [];
    
    for (const element of elements.slice(0, 20)) {
      if (await element.isVisible()) {
        const box = await element.boundingBox();
        if (box && (box.width < 44 || box.height < 44)) {
          const text = await element.textContent().catch(() => '');
          issues.push({
            element: text || 'Unknown element',
            width: box.width,
            height: box.height
          });
        }
      }
    }
    
    return issues;
  }

  async checkPageSpeed() {
    const startTime = Date.now();
    await this.page.reload();
    await this.page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    const metrics = await this.page.evaluate(() => {
      const perf = performance.getEntriesByType('navigation')[0];
      return {
        loadTime: perf.loadEventEnd - perf.fetchStart,
        domReady: perf.domContentLoadedEventEnd - perf.fetchStart,
        ttfb: perf.responseStart - perf.fetchStart
      };
    });
    
    return {
      ...metrics,
      totalLoadTime: loadTime
    };
  }

  async checkBrokenLinks() {
    const links = await this.page.$$eval('a[href]', links =>
      links.map(link => ({
        href: link.href,
        text: link.textContent
      })).filter(link => 
        !link.href.includes('mailto:') && 
        !link.href.includes('tel:') && 
        !link.href.includes('#') &&
        !link.href.includes('javascript:')
      )
    );
    
    const brokenLinks = [];
    for (const link of links.slice(0, 10)) {
      try {
        const response = await this.page.request.get(link.href);
        if (response.status() >= 400) {
          brokenLinks.push({
            url: link.href,
            text: link.text,
            status: response.status()
          });
        }
      } catch (error) {
        brokenLinks.push({
          url: link.href,
          text: link.text,
          error: error.message
        });
      }
    }
    
    return brokenLinks;
  }

  async checkConsoleErrors() {
    const errors = [];
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await this.page.reload();
    await this.page.waitForLoadState('networkidle');
    
    return errors;
  }

  async takeScreenshot(name) {
    await this.page.screenshot({
      path: `test-results/screenshots/${name}.png`,
      fullPage: true
    });
  }

  async scrollToElement(selector) {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  async waitForElement(selector, timeout = 5000) {
    await this.page.waitForSelector(selector, { timeout });
  }

  async elementExists(selector) {
    return await this.page.$(selector) !== null;
  }

  async getElementText(selector) {
    return await this.page.textContent(selector);
  }

  async getElementCount(selector) {
    return await this.page.locator(selector).count();
  }
}

module.exports = BasePage;