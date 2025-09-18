# Shared Menu Component

## Overview

The Shared Menu Component is a **100% webflow-independent** navigation system for the AI Studio platform. It provides a complete navigation experience with responsive design, dropdown menus, language switching, and mobile-first interactions - all without requiring webflow.js.

## 🚀 Quick Start

```html
<!-- Include CSS -->
<link rel="stylesheet" href="shared/components/sharedMenu/menu.css">

<!-- Include JavaScript -->
<script src="shared/components/sharedMenu/menu.js"></script>

<!-- The menu will auto-initialize on page load -->
```

## 📁 File Structure

```
shared/components/sharedMenu/
├── menu.html          # HTML template (13.3 KB)
├── menu.css           # Complete styling system (16.6 KB)
├── menu.js            # JavaScript functionality (21.2 KB)
└── README.md          # This documentation
```

## 🛠️ Implementation Methods

### Method 1: JavaScript Auto-Integration (Recommended)

The component automatically injects itself into pages when `menu.js` is loaded:

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="shared/components/sharedMenu/menu.css">
</head>
<body>
  <div class="page-wrapper">
    <!-- Menu will be injected here automatically -->
    <main>Your content here</main>
  </div>

  <script src="shared/components/sharedMenu/menu.js"></script>
</body>
</html>
```

### Method 2: Manual HTML Inclusion

Copy the HTML from `menu.html` directly into your pages:

```html
<!-- Include the entire menu.html content -->
<div role="banner" class="navbar custom-nav">
  <!-- ... full menu structure ... -->
</div>
```

### Method 3: Server-Side Integration

For dynamic sites, include the menu server-side:

```php
<?php include 'shared/components/sharedMenu/menu.html'; ?>
```

```javascript
// Node.js/Express
app.get('/', (req, res) => {
  const menu = fs.readFileSync('shared/components/sharedMenu/menu.html', 'utf8');
  res.render('page', { menu });
});
```

## 🎯 Key Features

### ✅ Webflow Independence
- **Zero webflow.js dependencies**
- Custom event handlers replace webflow functionality
- CSS-only animations eliminate JavaScript dependencies
- No webflow-related console errors

### 📱 Mobile-First Design
- Responsive hamburger menu with CSS animation
- Touch-friendly interactions (44px minimum targets)
- Mobile language switcher with pills design
- Accordion-style dropdown behavior

### 🌐 Multi-Language Support
- Desktop language dropdown (English, Russian, Hebrew)
- Mobile language pills (EN, RU, HE)
- Automatic desktop-mobile synchronization
- RTL support for Hebrew

### 🎨 Professional Animations
- CSS hamburger → X transformation (0.3s)
- Smooth dropdown transitions with backdrop blur
- Hover effects with underline animations
- Button hover states with transform effects

## 🔧 Configuration

### Image Paths

The component automatically detects page location and adjusts image paths:

```javascript
// Automatic path detection
getImagePath(imageName) {
  const currentPath = window.location.pathname;

  if (currentPath.includes('/tests/') ||
      currentPath.includes('/dist/') ||
      currentPath.includes('/authentication-pages/')) {
    return `../images/${imageName}`;
  }

  return `images/${imageName}`;
}
```

### Custom Styling

Override default styles with CSS custom properties:

```css
:root {
  --nav-bg: #fff;
  --nav-text: #333;
  --primary-button: #ffd659;
  --primary-text: #05051a;
  --dropdown-bg: rgba(5, 5, 26, 0.98);
}
```

### JavaScript API

Access the menu programmatically:

```javascript
// Get menu instance
const menu = window.SharedMenu;

// Update cart quantity
menu.updateCartQuantity(3);

// Set active page
menu.setActivePage('courses');

// Get current page
const currentPage = menu.getCurrentPage();

// Destroy menu
menu.destroy();
```

## 🎯 Component Structure

### HTML Architecture

```html
<div class="navbar custom-nav">
  <div class="container">
    <div class="navbar-content">
      <!-- Logo -->
      <a href="index.html" class="nav-brand">
        <img src="images/Logo.svg" alt="AI Studio Logo">
      </a>

      <!-- Main Navigation -->
      <nav class="nav-menu custom-nav-menu">
        <!-- Primary Links -->
        <a href="home.html" class="nav-link">Home</a>
        <!-- ... more links ... -->

        <!-- Dropdowns -->
        <div class="menu-dropdown-wrapper custom-dropdown">
          <div class="dropdown-toggle custom-dropdown-toggle">
            <div class="dropdown-toggle-text-block">About Us</div>
            <div class="dropdown-toggle-arrow-2"></div>
          </div>
          <nav class="dropdown-column-wrapper-3 custom-dropdown-list">
            <!-- Dropdown content -->
          </nav>
        </div>

        <!-- Mobile Language Switchers -->
        <div class="mobile-language-switchers">
          <div class="mobile-lang-pills">
            <a href="#" class="mobile-lang-pill active">EN</a>
            <a href="#" class="mobile-lang-pill">RU</a>
            <a href="#" class="mobile-lang-pill">HE</a>
          </div>
        </div>
      </nav>

      <!-- Right Side Controls -->
      <div class="navbar-button-wrapper">
        <!-- Desktop Language Switchers -->
        <div class="language-switchers">
          <!-- Language dropdown and pills -->
        </div>

        <!-- Shopping Cart -->
        <div class="custom-cart-wrapper navbar-cart">
          <!-- Cart functionality -->
        </div>

        <!-- Desktop Sign Up Button -->
        <div class="primary-button-wrapper desktop">
          <!-- Desktop CTA button -->
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
```

### CSS Class System

#### Layout Classes
- `.navbar.custom-nav` - Main navbar container
- `.nav-menu.custom-nav-menu` - Navigation menu wrapper
- `.navbar-button-wrapper` - Right-side controls container

#### Navigation Classes
- `.nav-link` - Primary navigation links
- `.nav-link.active` / `.nav-link.w--current` - Active page indicator

#### Dropdown Classes
- `.menu-dropdown-wrapper.custom-dropdown` - Dropdown container
- `.dropdown-toggle.custom-dropdown-toggle` - Dropdown trigger
- `.dropdown-column-wrapper-3.custom-dropdown-list` - Dropdown content
- `.custom-dropdown.active` - Open dropdown state

#### Mobile Classes
- `.menu-button.custom-nav-button` - Mobile menu button
- `.hamburger-icon` - CSS hamburger container
- `.hamburger-line` - Individual hamburger lines
- `.custom-nav-button.active` - Open mobile menu state

#### Language Switcher Classes
- `.language-switchers` - Desktop language container
- `.lang-pill` / `.lang-pill.active` - Desktop language pills
- `.mobile-language-switchers` - Mobile language container
- `.mobile-lang-pill` / `.mobile-lang-pill.active` - Mobile language pills

#### Button Classes
- `.primary-button-wrapper.desktop` - Desktop CTA button
- `.primary-button-wrapper.mobile` - Mobile CTA button
- `.primary-button` - Button styling

## 📱 Responsive Breakpoints

```css
/* Desktop */
@media screen and (min-width: 992px) {
  .mobile-language-switchers { display: none; }
  .menu-button { display: none; }
  .primary-button-wrapper.mobile { display: none; }
}

/* Tablet & Mobile */
@media screen and (max-width: 991px) {
  .language-switchers { display: none; }
  .primary-button-wrapper.desktop { display: none; }
  .menu-button { display: flex; }

  /* Mobile menu styles */
  .nav-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }

  .custom-nav-menu.active {
    opacity: 1;
    visibility: visible;
  }
}

/* Mobile */
@media screen and (max-width: 767px) {
  .dropdown-grid { grid-template-columns: 1.2fr 1fr; }
}

/* Small Mobile */
@media screen and (max-width: 479px) {
  .dropdown-grid { grid-template-columns: 1fr; }
}
```

## 🎨 Styling Customization

### Button Styling

```css
.primary-button {
  background-color: #ffd659 !important;
  color: #05051a !important;
  border: 1px solid #ffd659 !important;
  border-radius: 8px !important;
  padding: 20px 30px !important;
  font-size: 16px !important;
  font-weight: 700 !important;
  transition: all 0.3s ease !important;
}

.primary-button:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 12px rgba(255, 214, 89, 0.4) !important;
}
```

### Dropdown Styling

```css
.dropdown-pd {
  background-color: rgba(5, 5, 26, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 15px;
  padding: 20px 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}
```

### Mobile Language Pills

```css
.mobile-lang-pill {
  padding: 10px 16px;
  border-radius: 20px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  min-width: 44px; /* Touch-friendly */
}

.mobile-lang-pill.active {
  background: #ffd659;
  color: #05051a;
  font-weight: 600;
}
```

## ⚡ JavaScript Events

### Menu Events

```javascript
// Menu initialization
document.addEventListener('DOMContentLoaded', () => {
  window.SharedMenu.init();
});

// Mobile menu toggle
menuButton.addEventListener('click', (e) => {
  e.preventDefault();
  handleMobileToggle();
});

// Dropdown interactions
dropdown.addEventListener('mouseenter', () => showDropdown());
dropdown.addEventListener('mouseleave', () => hideDropdown());
```

### Language Switching

```javascript
// Language pill click handler
function setActivePill(element) {
  const isDesktop = element.classList.contains('lang-pill');
  const isMobile = element.classList.contains('mobile-lang-pill');

  if (isDesktop) {
    // Update desktop pills and sync with mobile
    syncLanguage(element.textContent);
  } else if (isMobile) {
    // Update mobile pills and sync with desktop
    syncLanguage(element.textContent);
  }
}
```

### Custom Events

```javascript
// Listen for menu events
document.addEventListener('menu:opened', (e) => {
  console.log('Mobile menu opened');
});

document.addEventListener('language:changed', (e) => {
  console.log('Language changed to:', e.detail.language);
});
```

## 🔍 Debugging & Troubleshooting

### Common Issues

#### 1. Menu Not Appearing
```javascript
// Check if SharedMenu is loaded
console.log('SharedMenu loaded:', typeof window.SharedMenu);

// Force initialization
if (window.SharedMenu) {
  window.SharedMenu.init();
}
```

#### 2. Dropdown Not Working
```css
/* Ensure dropdown has proper z-index */
.menu-dropdown-wrapper {
  z-index: 900;
}

.custom-dropdown.active {
  z-index: 901;
}
```

#### 3. Mobile Menu Not Closing
```javascript
// Check event listeners
const menuButton = document.querySelector('.menu-button');
console.log('Menu button found:', !!menuButton);

// Manual close
const navMenu = document.querySelector('.nav-menu');
navMenu.classList.remove('w--open', 'active');
```

#### 4. Language Sync Issues
```javascript
// Check language pill elements
const desktopPills = document.querySelectorAll('.lang-pill');
const mobilePills = document.querySelectorAll('.mobile-lang-pill');
console.log('Desktop pills:', desktopPills.length);
console.log('Mobile pills:', mobilePills.length);
```

### Debug Mode

Enable debug logging:

```javascript
// Add to console
window.SharedMenu.debug = true;

// View menu state
console.log('Current page:', window.SharedMenu.getCurrentPage());
console.log('Mobile menu open:', window.SharedMenu.mobileMenuOpen);
```

## 🧪 Testing

### Manual Testing Checklist

#### Desktop (>991px)
- [ ] All navigation links work
- [ ] Dropdown menus open on hover
- [ ] Language dropdown functions
- [ ] Language pills sync correctly
- [ ] Cart icon displays
- [ ] Sign up button works
- [ ] Mobile menu button hidden

#### Tablet (768px - 991px)
- [ ] Mobile menu button visible
- [ ] Mobile menu opens/closes
- [ ] Dropdown accordions work
- [ ] Mobile language pills visible
- [ ] Desktop language switchers hidden
- [ ] Touch targets adequate (44px+)

#### Mobile (375px - 767px)
- [ ] Hamburger animation works
- [ ] Menu slides in/out smoothly
- [ ] Dropdowns expand properly
- [ ] Language pills touchable
- [ ] Separators between sections
- [ ] Content not cut off

### Automated Testing

```javascript
// Quick functionality test
async function testMenu() {
  const tests = [];

  // Test menu presence
  tests.push(!!document.querySelector('.navbar'));

  // Test mobile functionality
  if (window.innerWidth <= 991) {
    const menuButton = document.querySelector('.menu-button');
    const navMenu = document.querySelector('.nav-menu');

    menuButton?.click();
    await new Promise(resolve => setTimeout(resolve, 300));
    tests.push(navMenu?.classList.contains('active'));
  }

  // Test language switchers
  const mobilePills = document.querySelectorAll('.mobile-lang-pill');
  tests.push(mobilePills.length === 3);

  console.log('Tests passed:', tests.filter(Boolean).length, '/', tests.length);
}

testMenu();
```

## 🚀 Deployment

### Production Checklist

- [ ] Remove console.log statements
- [ ] Minify CSS and JavaScript
- [ ] Optimize images (Logo.svg, cart icons)
- [ ] Test on all target browsers
- [ ] Verify touch interactions on devices
- [ ] Check accessibility compliance
- [ ] Validate HTML structure
- [ ] Test without webflow.js

### CDN Integration

For production, consider hosting assets on CDN:

```html
<link rel="stylesheet" href="https://cdn.example.com/menu.min.css">
<script src="https://cdn.example.com/menu.min.js"></script>
```

### Performance Optimization

```css
/* Use will-change for animated elements */
.hamburger-line {
  will-change: transform, opacity;
}

.dropdown-column-wrapper-3 {
  will-change: opacity, visibility, max-height;
}

/* Preload critical resources */
.navbar {
  contain: layout style;
}
```

## 📝 Changelog

### v2.0.0 (Current)
- ✅ Complete webflow.js independence
- ✅ Mobile language switcher pills
- ✅ CSS hamburger animation
- ✅ Custom dropdown system
- ✅ Improved mobile responsiveness
- ✅ Desktop-mobile language sync
- ✅ Tailwind CSS integration support

### v1.0.0 (Legacy)
- Basic webflow-dependent menu
- Limited mobile functionality
- Lottie hamburger animation
- Basic dropdown system

## 🤝 Contributing

### Development Setup

1. Clone the repository
2. Navigate to the component directory
3. Make changes to HTML, CSS, or JS files
4. Test across all breakpoints
5. Update this documentation
6. Submit pull request

### Code Style

- Use 2-space indentation
- Follow BEM CSS methodology
- Add comments for complex logic
- Maintain IE11+ compatibility
- Keep mobile-first approach

## 📞 Support

For issues or questions:

1. Check this documentation
2. Review browser console for errors
3. Test in different viewports
4. Verify all files are loaded correctly
5. Check for conflicting CSS/JS

## 📄 License

This component is part of the AI Studio platform and follows the project's licensing terms.

---

**Made with ❤️ for the AI Studio Platform**
*Webflow-free, mobile-first, production-ready navigation*