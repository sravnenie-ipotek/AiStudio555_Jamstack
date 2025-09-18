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
    if (this.isInitialized) return;

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
    // Check if menu already exists
    if (document.querySelector('.navbar')) return;

    // Get the menu HTML from the template
    const menuHTML = this.getMenuHTML();

    // Create a wrapper div
    const menuWrapper = document.createElement('div');
    menuWrapper.innerHTML = menuHTML;

    // Insert at the beginning of the page-wrapper or body
    const pageWrapper = document.querySelector('.page-wrapper');
    const targetElement = pageWrapper || document.body;

    if (pageWrapper) {
      targetElement.insertBefore(menuWrapper.firstElementChild, targetElement.firstChild);
    } else {
      targetElement.insertBefore(menuWrapper.firstElementChild, targetElement.firstChild);
    }

    // Set up navbar references
    this.navbar = document.querySelector('.navbar');
    this.mobileMenuButton = document.querySelector('.menu-button');
    this.navMenu = document.querySelector('.nav-menu');
    this.dropdowns = document.querySelectorAll('.menu-dropdown-wrapper');
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
   * Get the menu HTML template
   */
  getMenuHTML() {
    return `
<div role="banner" class="navbar custom-nav">
  <div class="container">
    <div class="navbar-content">
      <!-- Logo -->
      <a href="index.html" class="zohacous-logo-link nav-brand">
        <img loading="lazy" src="${this.getImagePath('Logo.svg')}" alt="AI Studio Logo" class="zohacous-logo-image">
      </a>

      <!-- Main Navigation -->
      <nav role="navigation" class="nav-menu custom-nav-menu">
        <!-- Primary Navigation Links -->
        <a href="home.html" class="nav-link">Home</a>
        <a href="courses.html" class="nav-link">Courses</a>
        <a href="pricing.html" class="nav-link">Pricing</a>
        <a href="blog.html" class="nav-link">Blog</a>
        <a href="teachers.html" class="nav-link">Teachers</a>

        <!-- About Us Dropdown -->
        <div class="menu-dropdown-wrapper custom-dropdown">
          <div class="dropdown-toggle custom-dropdown-toggle">
            <div class="dropdown-toggle-text-block">About Us</div>
            <div class="dropdown-toggle-arrow-2"></div>
          </div>
          <nav class="dropdown-column-wrapper-3 custom-dropdown-list" style="width: auto; min-width: auto;">
            <div class="dropdown-pd" style="padding: 20px 30px;">
              <div class="dropdown-singel-wrapper">
                <div class="dropdown-menu-wrapper">
                  <a href="career-orientation.html" class="dropdown-menu-text-link-block inline-block">
                    <div>Career Orientation</div>
                  </a>
                  <a href="career-center.html" class="dropdown-menu-text-link-block mb0 inline-block">
                    <div>Career Center</div>
                  </a>
                </div>
              </div>
            </div>
          </nav>
        </div>

        <!-- Pages Dropdown -->
        <div class="menu-dropdown-wrapper custom-dropdown">
          <div class="dropdown-toggle custom-dropdown-toggle">
            <div class="dropdown-toggle-text-block">Pages</div>
            <div class="dropdown-toggle-arrow-2"></div>
          </div>
          <nav class="dropdown-column-wrapper-3 custom-dropdown-list">
            <div class="dropdown-pd pd-60px">
              <div class="dropdown-grid grid grid-cols-3 gap-6">
                <!-- Menu Column -->
                <div class="dropdown-singel-wrapper">
                  <div class="dropdown-title-wrapper">
                    <h3 class="dropdown-title">Menu</h3>
                  </div>
                  <div class="dropdown-menu-wrapper">
                    <a href="home.html" class="dropdown-menu-text-link-block inline-block">
                      <div>Home</div>
                    </a>
                    <a href="about-us.html" class="dropdown-menu-text-link-block inline-block">
                      <div>About us</div>
                    </a>
                    <a href="courses.html" class="dropdown-menu-text-link-block inline-block">
                      <div>Courses</div>
                    </a>
                    <a href="pricing.html" class="dropdown-menu-text-link-block inline-block">
                      <div>Pricing</div>
                    </a>
                    <a href="contact-us.html" class="dropdown-menu-text-link-block mb0 inline-block">
                      <div>Contact Us</div>
                    </a>
                  </div>
                </div>

                <!-- Pages Column -->
                <div class="dropdown-singel-wrapper">
                  <div class="dropdown-title-wrapper">
                    <h3 class="dropdown-title">Pages</h3>
                  </div>
                  <div class="dropdown-menu-wrapper">
                    <a href="blog.html" class="dropdown-menu-text-link-block inline-block">
                      <div>Blogs</div>
                    </a>
                    <a href="authentication-pages/sign-in.html" class="dropdown-menu-text-link-block inline-block">
                      <div>Sign in</div>
                    </a>
                    <a href="authentication-pages/sign-up.html" class="dropdown-menu-text-link-block inline-block">
                      <div>Sign up</div>
                    </a>
                    <a href="authentication-pages/forgot-password.html" class="dropdown-menu-text-link-block inline-block">
                      <div>Forget password</div>
                    </a>
                    <a href="authentication-pages/reset-password.html" class="dropdown-menu-text-link-block inline-block">
                      <div>Reset password</div>
                    </a>
                  </div>
                </div>

                <!-- Utility Pages Column -->
                <div class="dropdown-singel-wrapper">
                  <div class="dropdown-title-wrapper">
                    <h3 class="dropdown-title">Utility Pages</h3>
                  </div>
                  <div class="dropdown-menu-wrapper">
                    <a href="template-pages/style-guide.html" class="dropdown-menu-text-link-block inline-block">
                      <div>Style Guide</div>
                    </a>
                    <a href="404.html" class="dropdown-menu-text-link-block inline-block">
                      <div>404 Not Found</div>
                    </a>
                    <a href="401.html" class="dropdown-menu-text-link-block inline-block">
                      <div>Password Protected</div>
                    </a>
                    <a href="template-pages/license.html" class="dropdown-menu-text-link-block inline-block">
                      <div>Licenses</div>
                    </a>
                    <a href="template-pages/changelog.html" class="dropdown-menu-text-link-block inline-block">
                      <div>Changelog</div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>

        <!-- Mobile Sign Up Button -->
        <div class="primary-button-wrapper mobile">
          <a href="#" class="primary-button inline-block" onclick="openContactPopup(); return false;">
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

      <!-- Right Side Controls -->
      <div class="navbar-button-wrapper">
        <!-- Language Switchers -->
        <div class="language-switchers">
          <!-- Variation 1: Minimal Dropdown -->
          <div class="lang-dropdown" onclick="toggleDropdown(this)">
            <div class="lang-dropdown-trigger">
              <svg class="globe-icon" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
              <span>English</span>
              <span class="dropdown-arrow">▼</span>
            </div>
            <div class="lang-dropdown-menu">
              <a href="#" class="lang-option active">English</a>
              <a href="#" class="lang-option">Русский</a>
              <a href="#" class="lang-option">עברית</a>
            </div>
          </div>

          <!-- Variation 2: Pill Toggle -->
          <div class="lang-pills">
            <a href="#" class="lang-pill active" onclick="setActivePill(this)">EN</a>
            <a href="#" class="lang-pill" onclick="setActivePill(this)">RU</a>
            <a href="#" class="lang-pill" onclick="setActivePill(this)">HE</a>
          </div>
        </div>

        <!-- Shopping Cart -->
        <div class="custom-cart-wrapper navbar-cart">
          <a class="custom-cart-open-link navbar-cart-button inline-block" role="button" aria-haspopup="dialog" aria-label="Open cart" href="#">
            <img loading="lazy" src="${this.getImagePath('Navbar-Cart-Icon.svg')}" alt="Shopping Cart" class="navbar-cart-icon">
            <div class="custom-cart-count cart-quantity">0</div>
          </a>
        </div>

        <!-- Desktop Sign Up Button -->
        <div class="primary-button-wrapper desktop">
          <a href="#" class="primary-button inline-block" onclick="openContactPopup(); return false;">
            <div class="primary-button-text-wrap">
              <div class="primary-button-text-block">Sign Up Today</div>
              <div class="primary-button-text-block is-text-absolute">Sign Up Today</div>
            </div>
          </a>
        </div>

        <!-- Mobile Menu Toggle -->
        <div class="menu-button custom-nav-button">
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
  }

  /**
   * Detect current page and set active states
   */
  detectCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'home.html';

    // Remove file extension and handle index
    this.currentPage = filename.replace('.html', '');
    if (this.currentPage === 'index' || this.currentPage === '') {
      this.currentPage = 'home';
    }

    this.setActivePage(this.currentPage);
  }

  /**
   * Set active page in navigation
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

    // Window resize
    window.addEventListener('resize', this.handleResize);

    // Intercept "Sign Up Today" buttons to open popup
    this.interceptSignUpButtons();
  }

  /**
   * Handle mobile menu toggle
   */
  handleMobileToggle(e) {
    e.preventDefault();
    this.mobileMenuOpen = !this.mobileMenuOpen;

    if (this.mobileMenuOpen) {
      this.navMenu.classList.add('w--open', 'active');
      this.mobileMenuButton.classList.add('w--open', 'active');
      document.body.style.overflow = 'hidden';
    } else {
      this.navMenu.classList.remove('w--open', 'active');
      this.mobileMenuButton.classList.remove('w--open', 'active');
      document.body.style.overflow = '';
    }
  }

  /**
   * Handle dropdown toggle for mobile
   */
  handleDropdownToggle(dropdown) {
    const isOpen = dropdown.classList.contains('w--open') || dropdown.classList.contains('active');

    // Close all other dropdowns
    this.dropdowns.forEach(d => {
      if (d !== dropdown) {
        d.classList.remove('w--open', 'active');
      }
    });

    // Toggle current dropdown
    if (isOpen) {
      dropdown.classList.remove('w--open', 'active');
      this.activeDropdown = null;
    } else {
      dropdown.classList.add('w--open', 'active');
      this.activeDropdown = dropdown;
    }
  }

  /**
   * Show dropdown on hover (desktop)
   */
  showDropdown(dropdown) {
    if (window.innerWidth > 991) {
      dropdown.classList.add('w--open', 'active');
      this.activeDropdown = dropdown;
    }
  }

  /**
   * Hide dropdown on hover leave (desktop)
   */
  hideDropdown(dropdown) {
    if (window.innerWidth > 991) {
      dropdown.classList.remove('w--open', 'active');
      if (this.activeDropdown === dropdown) {
        this.activeDropdown = null;
      }
    }
  }

  /**
   * Handle click outside to close mobile menu and dropdowns
   */
  handleClickOutside(e) {
    if (!this.navbar.contains(e.target)) {
      // Close mobile menu
      if (this.mobileMenuOpen) {
        this.mobileMenuOpen = false;
        this.navMenu.classList.remove('w--open', 'active');
        this.mobileMenuButton.classList.remove('w--open', 'active');
        document.body.style.overflow = '';
      }

      // Close dropdowns on mobile
      if (window.innerWidth <= 991) {
        this.dropdowns.forEach(dropdown => {
          dropdown.classList.remove('w--open', 'active');
        });
        this.activeDropdown = null;
      }
    }
  }

  /**
   * Handle window resize
   */
  handleResize() {
    if (window.innerWidth > 991) {
      // Desktop: close mobile menu if open
      if (this.mobileMenuOpen) {
        this.mobileMenuOpen = false;
        this.navMenu.classList.remove('w--open', 'active');
        this.mobileMenuButton.classList.remove('w--open', 'active');
        document.body.style.overflow = '';
      }
    } else {
      // Mobile: close all dropdowns
      this.dropdowns.forEach(dropdown => {
        dropdown.classList.remove('w--open', 'active');
      });
      this.activeDropdown = null;
    }
  }

  /**
   * Intercept "Sign Up Today" buttons to open contact popup
   */
  interceptSignUpButtons() {
    const signUpButtons = this.navbar.querySelectorAll('a[href="#"], a[href="authentication-pages/sign-up.html"]');

    signUpButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();

        // Check if contact popup is available
        if (typeof openContactPopup === 'function') {
          openContactPopup();
        } else if (window.ContactPopup && typeof window.ContactPopup.open === 'function') {
          window.ContactPopup.open();
        } else {
          // Fallback: redirect to contact page or sign up page
          console.warn('Contact popup not available, redirecting...');
          window.location.href = 'contact-us.html';
        }
      });
    });
  }

  /**
   * Update cart quantity
   */
  updateCartQuantity(count = 0) {
    const cartQuantity = this.navbar.querySelector('.cart-quantity');
    if (cartQuantity) {
      cartQuantity.textContent = count;
    }
  }

  /**
   * Highlight a navigation item
   */
  highlightNavItem(page) {
    this.setActivePage(page);
  }

  /**
   * Destroy the menu
   */
  destroy() {
    if (this.navbar) {
      this.navbar.remove();
    }

    // Remove event listeners
    document.removeEventListener('click', this.handleClickOutside);
    window.removeEventListener('resize', this.handleResize);

    this.isInitialized = false;
  }

  /**
   * Get current page
   */
  getCurrentPage() {
    return this.currentPage;
  }
}

// Create global instance
window.SharedMenu = new SharedMenu();

// Auto-initialize on DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.SharedMenu.init();
  });
} else {
  window.SharedMenu.init();
}

// Language Switcher Functions
window.toggleDropdown = function(element) {
  element.classList.toggle('active');

  // Close other dropdowns
  document.querySelectorAll('.lang-dropdown').forEach(dropdown => {
    if (dropdown !== element) {
      dropdown.classList.remove('active');
    }
  });
};

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

// Close dropdowns when clicking outside
document.addEventListener('click', function(event) {
  if (!event.target.closest('.lang-dropdown')) {
    document.querySelectorAll('.lang-dropdown').forEach(dropdown => {
      dropdown.classList.remove('active');
    });
  }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SharedMenu;
}