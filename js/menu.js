/**
 * Shared Menu Component JavaScript
 * Handles navigation menu functionality including dropdowns and mobile menu
 */

class SharedMenu {
  constructor() {
    this.isInitialized = false;
    this.currentPage = '';
    this.mobileMenuOpen = false;
    this.activeDropdown = null;

    // Bind methods
    this.init = this.init.bind(this);
    this.handleMobileToggle = this.handleMobileToggle.bind(this);
    this.handleDropdownToggle = this.handleDropdownToggle.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.setActivePage = this.setActivePage.bind(this);
  }

  /**
   * Initialize the menu component
   */
  init() {
    console.log('SharedMenu: init() called');
    if (this.isInitialized) {
      console.log('SharedMenu: Already initialized, skipping');
      return;
    }

    console.log('SharedMenu: Starting initialization...');
    this.createMenuHTML();
    this.detectCurrentPage();
    this.bindEvents();
    this.isInitialized = true;

    console.log('Shared menu initialized');
  }

  /**
   * Create and inject menu HTML into the document
   */
  createMenuHTML() {
    console.log('SharedMenu: createMenuHTML() called');

    // Check if menu already exists
    const existingNavbar = document.querySelector('.navbar');
    if (existingNavbar) {
      console.log('SharedMenu: Existing navbar found, skipping injection:', existingNavbar);
      return;
    }

    console.log('SharedMenu: No existing navbar found, proceeding with injection');

    // Get the menu HTML from the template
    const menuHTML = this.getMenuHTML();

    // Create a wrapper div
    const menuWrapper = document.createElement('div');
    menuWrapper.innerHTML = menuHTML;

    // Smart injection logic to handle different page structures
    let targetElement;
    let insertionPoint;

    // Priority 1: Look for .page-wrapper
    const pageWrapper = document.querySelector('.page-wrapper');
    if (pageWrapper) {
      targetElement = pageWrapper;
      insertionPoint = targetElement.firstChild;
    } else {
      // Priority 2: Look for main content containers
      const contentSelectors = [
        'main',
        '.main-content',
        'section:first-of-type',
        '.section:first-of-type',
        '.banner'
      ];

      let contentElement = null;
      for (const selector of contentSelectors) {
        contentElement = document.querySelector(selector);
        if (contentElement) break;
      }

      if (contentElement) {
        // Insert before the main content element
        targetElement = contentElement.parentNode;
        insertionPoint = contentElement;
      } else {
        // Fallback: Use body and insert at the beginning
        targetElement = document.body;
        insertionPoint = targetElement.firstChild;
      }
    }

    // Inject the menu
    if (insertionPoint) {
      targetElement.insertBefore(menuWrapper.firstElementChild, insertionPoint);
    } else {
      targetElement.appendChild(menuWrapper.firstElementChild);
    }

    // Set up navbar references
    this.navbar = document.querySelector('.navbar');
    this.mobileMenuButton = document.querySelector('.menu-button');
    this.navMenu = document.querySelector('.nav-menu');
    this.dropdowns = document.querySelectorAll('.menu-dropdown-wrapper');

    console.log('Menu injected successfully into:', targetElement.tagName, targetElement.className || '(no class)');
  }

  /**
   * Get the correct image path based on current page location
   */
  getImagePath(imageName) {
    const currentPath = window.location.pathname;

    // Check if we're in a subdirectory (like tests, dist/en, etc.)
    if (currentPath.includes('/tests/') ||
        currentPath.includes('/dist/') ||
        currentPath.includes('/authentication-pages/') ||
        currentPath.includes('/template-pages/')) {
      return `../images/${imageName}`;
    }

    // Default path for root level pages
    return `images/${imageName}`;
  }

  /**
   * Get the menu HTML template - EXACT COPY from popup-demo.html
   */
  getMenuHTML() {
    console.log('SharedMenu: getMenuHTML() called');
    const imagePath = this.getImagePath('Logo.svg');
    console.log('SharedMenu: Image path resolved to:', imagePath);

    // Simple test version first - if this works, we know the template string is the issue
    const simpleHTML = '<div class="navbar w-nav"><div class="container">TEST MENU</div></div>';
    console.log('SharedMenu: Returning simple HTML for testing');
    return simpleHTML;

    // Original complex template (temporarily disabled for debugging)
    /*
    return `
    <div data-w-id="102c5b61-ca91-3c28-1e26-0f7381b431a4" data-animation="default" data-collapse="medium" data-duration="400" data-easing="ease" data-easing2="ease" role="banner" class="navbar w-nav">
      <div class="container">
        <div class="navbar-content">
          <a href="index.html" class="zohacous-logo-link w-nav-brand"><img loading="lazy" src="${this.getImagePath('Logo.svg')}" alt="" class="zohacous-logo-image"></a>
          <nav role="navigation" class="nav-menu w-nav-menu">
            <a href="home.html" class="nav-link w-nav-link">Home</a>
            <a href="courses.html" class="nav-link w-nav-link">Courses</a>
            <a href="pricing.html" class="nav-link w-nav-link">Pricing</a>
            <a href="blog.html" class="nav-link w-nav-link">Blog</a>
            <a href="teachers.html" class="nav-link w-nav-link">Teachers</a>
            <div data-delay="0" data-hover="true" data-w-id="9a224b60-f557-150b-8062-e4bbef078cfb" class="menu-dropdown-wrapper w-dropdown">
              <div class="dropdown-toggle w-dropdown-toggle">
                <div class="dropdown-toggle-text-block">About Us</div>
                <div class="dropdown-toggle-arrow-2"></div>
              </div>
              <nav class="dropdown-column-wrapper-3 w-dropdown-list" style="width: auto; min-width: auto;">
                <div class="dropdown-pd" style="padding: 20px 30px;">
                  <div class="dropdown-singel-wrapper">
                    <div class="dropdown-menu-wrapper">
                      <a href="career-orientation.html" class="dropdown-menu-text-link-block w-inline-block">
                        <div>Career Orientation</div>
                      </a>
                      <a href="career-center.html" class="dropdown-menu-text-link-block mb0 w-inline-block">
                        <div>Career Center</div>
                      </a>
                    </div>
                  </div>
                </div>
              </nav>
            </div>
            <div data-delay="0" data-hover="true" data-w-id="9a224b60-f557-150b-8062-e4bbef078cfa" class="menu-dropdown-wrapper w-dropdown">
              <div class="dropdown-toggle w-dropdown-toggle">
                <div class="dropdown-toggle-text-block">Pages</div>
                <div class="dropdown-toggle-arrow-2"></div>
              </div>
              <nav class="dropdown-column-wrapper-3 w-dropdown-list">
                <div class="dropdown-pd pd-60px">
                  <div class="w-layout-grid dropdown-grid">
                    <div id="w-node-_9a224b60-f557-150b-8062-e4bbef078d03-81b431a4" class="dropdown-singel-wrapper">
                      <div class="dropdown-title-wrapper">
                        <h3 class="dropdown-title">Menu</h3>
                      </div>
                      <div class="dropdown-menu-wrapper">
                        <a href="home.html" class="dropdown-menu-text-link-block w-inline-block">
                          <div>Home </div>
                        </a>
                        <a href="about-us.html" class="dropdown-menu-text-link-block w-inline-block">
                          <div>About us</div>
                        </a>
                        <a href="courses.html" class="dropdown-menu-text-link-block w-inline-block">
                          <div>Courses</div>
                        </a>
                        <a href="https://zohacous.webflow.io/courses/html-css-bootstrap-build-responsive-websites" class="dropdown-menu-text-link-block w-inline-block">
                          <div>Courses Single</div>
                          <div class="dropdown-menu-cms-single">
                            <div class="dropdown-menu-cms-line"></div>
                            <div class="dropdown-menu-cms">CMS</div>
                          </div>
                        </a>
                        <a href="pricing.html" class="dropdown-menu-text-link-block w-inline-block">
                          <div>Pricing</div>
                        </a>
                        <a href="https://zohacous.webflow.io/product/premium-plan" class="dropdown-menu-text-link-block w-inline-block">
                          <div>Pricing Single</div>
                          <div class="dropdown-menu-cms-single">
                            <div class="dropdown-menu-cms-line"></div>
                            <div class="dropdown-menu-cms">CMS</div>
                          </div>
                        </a>
                        <a href="contact-us.html" class="dropdown-menu-text-link-block mb0 w-inline-block">
                          <div>Contact Us</div>
                        </a>
                      </div>
                    </div>
                    <div id="w-node-_9a224b60-f557-150b-8062-e4bbef078d2f-81b431a4" class="dropdown-singel-wrapper">
                      <div class="dropdown-title-wrapper">
                        <h3 class="dropdown-title">Pages</h3>
                      </div>
                      <div class="dropdown-menu-wrapper">
                        <a href="blog.html" class="dropdown-menu-text-link-block w-inline-block">
                          <div>Blogs </div>
                        </a>
                        <a href="https://zohacous.webflow.io/blog/future-of-web-app-develop-trends-to-watch-in-2024" class="dropdown-menu-text-link-block w-inline-block">
                          <div>Blog details</div>
                          <div class="dropdown-menu-cms-single">
                            <div class="dropdown-menu-cms-line"></div>
                            <div class="dropdown-menu-cms">CMS</div>
                          </div>
                        </a>
                        <a href="authentication-pages/sign-in.html" class="dropdown-menu-text-link-block w-inline-block">
                          <div>Sign in</div>
                        </a>
                        <a href="authentication-pages/sign-up.html" class="dropdown-menu-text-link-block w-inline-block">
                          <div>Sign up</div>
                        </a>
                        <a href="authentication-pages/forgot-password.html" class="dropdown-menu-text-link-block w-inline-block">
                          <div>Forget password</div>
                        </a>
                        <a href="authentication-pages/reset-password.html" class="dropdown-menu-text-link-block w-inline-block">
                          <div>Reset password</div>
                        </a>
                      </div>
                    </div>
                    <div id="w-node-_9a224b60-f557-150b-8062-e4bbef078d57-81b431a4" class="dropdown-singel-wrapper">
                      <div class="dropdown-title-wrapper">
                        <h3 class="dropdown-title">Utility Pages</h3>
                      </div>
                      <div class="dropdown-menu-wrapper">
                        <a href="template-pages/style-guide.html" class="dropdown-menu-text-link-block w-inline-block">
                          <div>Style Guide</div>
                        </a>
                        <a href="404.html" class="dropdown-menu-text-link-block w-inline-block">
                          <div>404 Not Found</div>
                        </a>
                        <a href="401.html" class="dropdown-menu-text-link-block w-inline-block">
                          <div>Password Protected</div>
                        </a>
                        <a href="template-pages/license.html" class="dropdown-menu-text-link-block w-inline-block">
                          <div>Licenses</div>
                        </a>
                        <a href="template-pages/changelog.html" class="dropdown-menu-text-link-block w-inline-block">
                          <div>Changelog</div>
                        </a>
                      </div>
                      <div class="more-temple-wrapper">
                        <a href="https://webflow.com/templates/designers/zohaflow" target="_blank" class="more-temple-text-link">More Templates Form Us</a>
                        <div class="more-temple-text-link-boder"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </nav>
            </div>
            <div class="primary-button-wrapper mobile">
              <a href="#" data-w-id="ad8568d4-5ed1-5674-8ae7-1a7ad93cff72" class="primary-button w-inline-block" onclick="openContactPopup(); return false;">
                <div class="primary-button-text-wrap">
                  <div class="primary-button-text-block">Sign Up Today</div>
                  <div class="primary-button-text-block is-text-absolute">Sign Up Today</div>
                </div>
              </a>
            </div>

            <!-- Mobile Language Switchers -->
            <div class="mobile-language-switchers">
              <!-- Mobile Language Pills -->
              <div class="mobile-lang-pills">
                <a href="#" class="mobile-lang-pill active" onclick="setActivePill(this)">EN</a>
                <a href="#" class="mobile-lang-pill" onclick="setActivePill(this)">RU</a>
                <a href="#" class="mobile-lang-pill" onclick="setActivePill(this)">HE</a>
              </div>
            </div>
          </nav>
          <div class="navbar-button-wrapper">
            <div class="lang-pills">
              <a href="#" class="lang-pill active" onclick="setActivePill(this)">EN</a>
              <a href="#" class="lang-pill" onclick="setActivePill(this)">RU</a>
              <a href="#" class="lang-pill" onclick="setActivePill(this)">HE</a>
            </div>
            <div data-open-product="" data-wf-cart-type="rightSidebar" data-wf-cart-query="" data-wf-page-link-href-prefix="" class="w-commerce-commercecartwrapper navbar-cart" data-node-type="commerce-cart-wrapper">
              <a class="w-commerce-commercecartopenlink navbar-cart-button w-inline-block" role="button" aria-haspopup="dialog" aria-label="Open cart" data-node-type="commerce-cart-open-link" href="#"><img loading="lazy" src="${this.getImagePath('Navbar-Cart-Icon.svg')}" alt="" class="navbar-cart-icon">
                <div class="w-commerce-commercecartopenlinkcount cart-quantity">0</div>
              </a>
              <div style="display:none" class="w-commerce-commercecartcontainerwrapper w-commerce-commercecartcontainerwrapper--cartType-rightSidebar cart-wrapper" data-node-type="commerce-cart-container-wrapper">
                <div data-node-type="commerce-cart-container" role="dialog" class="w-commerce-commercecartcontainer cart-container">
                  <div class="w-commerce-commercecartheader cart-header">
                    <h4 class="w-commerce-commercecartheading cart-header-title">Your Cart</h4>
                    <a class="w-commerce-commercecartcloselink cart-close-button w-inline-block" role="button" aria-label="Close cart" data-node-type="commerce-cart-close-link"><img loading="lazy" src="${this.getImagePath('Cart-Close-Icon.svg')}" alt="" class="cart-close"></a>
                  </div>
                  <div class="w-commerce-commercecartformwrapper">
                    <form style="display:none" class="w-commerce-commercecartform" data-node-type="commerce-cart-form">
                      <script type="text/x-wf-template" id="wf-template-022ff995-969a-6767-1e11-b2a08cb61438"></script>
                      <div class="w-commerce-commercecartlist cart-list" data-wf-collection="database.commerceOrder.userItems" data-wf-template-id="wf-template-022ff995-969a-6767-1e11-b2a08cb61438"></div>
                      <div class="w-commerce-commercecartfooter cart-footer">
                        <div aria-live="polite" aria-atomic="true" class="w-commerce-commercecartlineitem">
                          <div class="cart-footer-title">Subtotal</div>
                          <div class="w-commerce-commercecartordervalue cart-footer-price"></div>
                        </div>
                        <div>
                          <a href="checkout.html" value="Continue to Checkout" class="w-commerce-commercecartcheckoutbutton cart-footer-button" data-loading-text="Hang Tight..." data-node-type="cart-checkout-button">Continue to Checkout</a>
                        </div>
                      </div>
                    </form>
                    <div class="w-commerce-commercecartemptystate">
                      <div aria-label="This cart is empty" aria-live="polite">No items found.</div>
                    </div>
                    <div aria-live="assertive" style="display:none" data-node-type="commerce-cart-error" class="w-commerce-commercecarterrorstate">
                      <div class="w-cart-error-msg" data-w-cart-quantity-error="Product is not available in this quantity." data-w-cart-general-error="Something went wrong when adding this item to the cart." data-w-cart-checkout-error="Checkout is disabled on this site." data-w-cart-cart_order_min-error="The order minimum was not met. Add more items to your cart to continue." data-w-cart-subscription_error-error="Before you purchase, please use your email invite to verify your address so we can send order updates.">Product is not available in this quantity.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="primary-button-wrapper desktop">
              <a href="#" data-w-id="102c5b61-ca91-3c28-1e26-0f7381b431b7" class="primary-button w-inline-block" onclick="openContactPopup(); return false;">
                <div class="primary-button-text-wrap">
                  <div class="primary-button-text-block">Sign Up Today</div>
                  <div class="primary-button-text-block is-text-absolute">Sign Up Today</div>
                </div>
              </a>
            </div>
            <div class="menu-button w-nav-button">
              <div class="hamburger-icon">
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    `;
    */
  }

  /**
   * Detect current page and set active states
   */
  detectCurrentPage() {
    const pathname = window.location.pathname;
    const page = pathname.split('/').pop().replace('.html', '') || 'index';

    // Map common page names
    const pageMap = {
      'index': 'home',
      '': 'home'
    };

    this.currentPage = pageMap[page] || page;
    this.setActivePage(this.currentPage);
  }

  /**
   * Set active page highlighting
   */
  setActivePage(page) {
    // Remove all current classes
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.classList.remove('w--current', 'active');
    });

    // Find and activate current page link
    const activeLink = Array.from(navLinks).find(link => {
      const href = link.getAttribute('href');
      const linkPage = href ? href.replace('.html', '').split('/').pop() : '';
      return linkPage === page || (page === 'home' && (linkPage === 'index' || linkPage === ''));
    });

    if (activeLink) {
      activeLink.classList.add('w--current', 'active');
    }

    this.currentPage = page;
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    if (!this.navbar) return;

    // Mobile menu toggle
    if (this.mobileMenuButton) {
      this.mobileMenuButton.addEventListener('click', this.handleMobileToggle);
    }

    // Dropdown toggles
    this.dropdowns.forEach(dropdown => {
      const toggle = dropdown.querySelector('.dropdown-toggle');
      if (toggle) {
        // Desktop hover
        dropdown.addEventListener('mouseenter', () => this.showDropdown(dropdown));
        dropdown.addEventListener('mouseleave', () => this.hideDropdown(dropdown));

        // Mobile click (only on mobile)
        toggle.addEventListener('click', (e) => {
          if (window.innerWidth <= 991) {
            e.preventDefault();
            e.stopPropagation();
            this.handleDropdownToggle(dropdown);
          }
        });
      }
    });

    // Click outside to close
    document.addEventListener('click', this.handleClickOutside);

    // Window resize handler
    window.addEventListener('resize', this.handleResize);
  }

  /**
   * Handle mobile menu toggle
   */
  handleMobileToggle(e) {
    e.preventDefault();
    e.stopPropagation();

    this.mobileMenuOpen = !this.mobileMenuOpen;

    if (this.mobileMenuOpen) {
      this.navMenu.classList.add('w--open');
      this.mobileMenuButton.classList.add('w--open');
      this.navbar.classList.add('w--open');
      document.body.style.overflow = 'hidden';
    } else {
      this.navMenu.classList.remove('w--open');
      this.mobileMenuButton.classList.remove('w--open');
      this.navbar.classList.remove('w--open');
      document.body.style.overflow = '';
    }
  }

  /**
   * Handle dropdown toggle (mobile)
   */
  handleDropdownToggle(dropdown) {
    const isOpen = dropdown.classList.contains('w--open');

    // Close all dropdowns
    this.dropdowns.forEach(d => d.classList.remove('w--open'));

    // Toggle current dropdown
    if (!isOpen) {
      dropdown.classList.add('w--open');
      this.activeDropdown = dropdown;
    } else {
      this.activeDropdown = null;
    }
  }

  /**
   * Show dropdown (desktop)
   */
  showDropdown(dropdown) {
    if (window.innerWidth > 991) {
      dropdown.classList.add('w--open');
    }
  }

  /**
   * Hide dropdown (desktop)
   */
  hideDropdown(dropdown) {
    if (window.innerWidth > 991) {
      dropdown.classList.remove('w--open');
    }
  }

  /**
   * Handle click outside
   */
  handleClickOutside(e) {
    if (!this.navbar) return;

    // Close mobile menu if clicking outside
    if (this.mobileMenuOpen && !this.navbar.contains(e.target)) {
      this.handleMobileToggle({ preventDefault: () => {}, stopPropagation: () => {} });
    }

    // Close dropdowns on mobile
    if (window.innerWidth <= 991 && this.activeDropdown && !this.activeDropdown.contains(e.target)) {
      this.activeDropdown.classList.remove('w--open');
      this.activeDropdown = null;
    }
  }

  /**
   * Handle window resize
   */
  handleResize() {
    if (window.innerWidth > 991) {
      // Reset mobile states on desktop
      this.mobileMenuOpen = false;
      this.navMenu.classList.remove('w--open');
      this.mobileMenuButton.classList.remove('w--open');
      this.navbar.classList.remove('w--open');
      document.body.style.overflow = '';

      // Close mobile dropdowns
      this.dropdowns.forEach(d => d.classList.remove('w--open'));
      this.activeDropdown = null;
    }
  }

  /**
   * Public API methods
   */
  getCurrentPage() {
    return this.currentPage;
  }

  highlightNavItem(page) {
    this.setActivePage(page);
  }

  updateCartQuantity(count) {
    const cartQuantity = document.querySelector('.cart-quantity');
    if (cartQuantity) {
      cartQuantity.textContent = count;
    }
  }
}

// Export for global usage
if (typeof window !== 'undefined') {
  window.SharedMenu = SharedMenu;
}

// Required functions for menu functionality
if (typeof window !== 'undefined') {
  // Language switcher function
  window.setActivePill = function(element) {
    // Handle both desktop and mobile language pills
    const isDesktop = element.classList.contains('lang-pill');
    const isMobile = element.classList.contains('mobile-lang-pill');

    if (isDesktop) {
      // Desktop language pills
      element.parentNode.querySelectorAll('.lang-pill').forEach(pill => {
        pill.classList.remove('active');
      });
      element.classList.add('active');

      // Sync with mobile pills
      const lang = element.textContent;
      document.querySelectorAll('.mobile-lang-pill').forEach(pill => {
        pill.classList.remove('active');
        if (pill.textContent === lang) {
          pill.classList.add('active');
        }
      });
    } else if (isMobile) {
      // Mobile language pills
      element.parentNode.querySelectorAll('.mobile-lang-pill').forEach(pill => {
        pill.classList.remove('active');
      });
      element.classList.add('active');

      // Sync with desktop pills
      const lang = element.textContent;
      document.querySelectorAll('.lang-pill').forEach(pill => {
        pill.classList.remove('active');
        if (pill.textContent === lang) {
          pill.classList.add('active');
        }
      });
    }

    // You could add language switching logic here
    const lang = element.textContent;
    console.log('Language switched to:', lang);
  };

  // Contact popup function (fallback if popup.js not loaded)
  window.openContactPopup = function() {
    // Try to use the ContactPopup component if available
    if (window.ContactPopup && window.ContactPopup.open) {
      window.ContactPopup.open();
    } else {
      // Fallback alert
      console.warn('ContactPopup component not loaded');
      alert('Contact popup functionality requires the popup component to be loaded.');
    }
  };
}

// Auto-initialize if needed
document.addEventListener('DOMContentLoaded', function() {
  console.log('SharedMenu: DOMContentLoaded fired');
  if (typeof window !== 'undefined' && !window.sharedMenuInstance) {
    console.log('SharedMenu: Creating new instance');
    window.sharedMenuInstance = new SharedMenu();
    window.sharedMenuInstance.init();
  } else {
    console.log('SharedMenu: Instance already exists or window undefined');
  }
});