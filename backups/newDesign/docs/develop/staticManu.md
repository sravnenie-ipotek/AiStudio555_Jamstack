# Static Mobile Menu Implementation Guide

## =ñ Complete Guide to Webflow Mobile Menu Integration

This document provides a comprehensive guide for implementing mobile navigation menus that work correctly with Webflow's native JavaScript behavior, based on debugging and fixing the courses.html mobile menu issue.

---

## =¨ Critical Understanding: How Webflow Mobile Menus Work

### The Core Problem We Solved

**Issue**: Mobile menu appeared to work but was positioned off-screen (`right: 750px` instead of `right: 0`)

**Root Cause**: CSS selectors targeting wrong classes - we used custom classes instead of Webflow's native class system

**Solution**: Target Webflow's `w--open` class that gets dynamically added to the hamburger button

---

## <¯ The Working CSS Pattern

### 1. Hide Menu by Default (Mobile Only)

```css
@media (max-width: 991px) {
  /* Hide menu by default on mobile - slide panel from right */
  .nav-menu, .w-nav-menu {
    display: none !important;
    position: fixed;
    top: 0;
    right: -100%;          /* Start off-screen */
    bottom: 0;
    left: auto;
    width: 85%;
    max-width: 360px;
    background: #05051a;   /* Dark background */
    z-index: 999;
    padding: 80px 20px 20px;
    overflow-y: auto;
    transition: right 0.3s ease;  /* Smooth slide animation */
    visibility: visible !important;
    opacity: 1 !important;
  }
}
```

### 2. Show Menu When Webflow Adds `w--open` Class

```css
/* PRIMARY SOLUTION: Target Webflow's w--open class on hamburger button */
.w-nav-button.w--open ~ .navbar-button-wrapper .w-nav-menu,
.w-nav-button.w--open + * .w-nav-menu,
.navbar.w-nav .w-nav-button.w--open ~ * .w-nav-menu,
.w--open ~ * .w-nav-menu {
  display: block !important;
  right: 0 !important;           /* Slide to visible position */
  opacity: 1 !important;
  transform: translateY(0px) !important;
}

/* ALTERNATIVE SOLUTION: Using :has() selector (modern browsers) */
.navbar:has(.w-nav-button.w--open) .w-nav-menu {
  display: block !important;
  right: 0 !important;
  opacity: 1 !important;
  transform: translateY(0px) !important;
}
```

### 3. Hamburger Animation (Visual Feedback)

```css
.hamburger-line {
  display: block !important;
  width: 24px !important;
  height: 2px !important;
  background-color: #ffffff !important;
  margin: 0 !important;
  border-radius: 1px !important;
  transition: all 0.3s ease !important;
  position: relative !important;
}

/* Animate to X shape when opened */
.menu-button.w--open .hamburger-line:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px) !important;
}
.menu-button.w--open .hamburger-line:nth-child(2) {
  opacity: 0 !important;
}
.menu-button.w--open .hamburger-line:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px) !important;
}
```

---

## = Debugging Techniques We Used

### 1. Class Observation Script

Create a debugging script to watch Webflow's class changes:

```javascript
// File: test-webflow-classes.js
const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newContext({
    viewport: { width: 375, height: 667 }
  }).then(ctx => ctx.newPage());

  await page.goto('http://localhost:3005/courses.html');

  // Set up mutation observer to watch class changes
  await page.evaluate(() => {
    const hamburger = document.querySelector('.w-nav-button');
    const menu = document.querySelector('.w-nav-menu');

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const target = mutation.target;
          console.log(`<¯ Classes changed: ${target.className}`);
        }
      });
    });

    if (hamburger) observer.observe(hamburger, { attributes: true });
    if (menu) observer.observe(menu, { attributes: true });
  });

  // Click and observe
  await page.click('.w-nav-button');
  await page.waitForTimeout(2000);
})();
```

### 2. CSS State Analysis Script

```javascript
// File: test-mobile-click-debug.js
const mobileMenu = await page.$('.w-nav-menu');
const menuStyles = await mobileMenu.evaluate(el => {
  const computed = window.getComputedStyle(el);
  const rect = el.getBoundingClientRect();
  return {
    display: computed.display,
    transform: computed.transform,
    opacity: computed.opacity,
    position: computed.position,
    right: rect.right,    // This revealed the 750px issue!
    width: rect.width,
    height: rect.height
  };
});

console.log('= Menu positioning:', menuStyles);
```

---

##   Common Pitfalls and Solutions

### 1. L Don't Target Custom Classes

```css
/* WRONG - Custom classes that don't exist */
.nav-menu.nav-open .nav-link {
  display: block;
}

.mobile-menu-open .w-nav-menu {
  transform: translateX(0);
}
```

### 2.  Target Webflow's Native Classes

```css
/* CORRECT - Target Webflow's actual class system */
.w-nav-button.w--open ~ * .w-nav-menu {
  display: block !important;
  right: 0 !important;
}
```

### 3. L Fighting Webflow's Positioning

```css
/* WRONG - Conflicts with Webflow's inline styles */
.w-nav-menu {
  transform: translateX(-100%);
}
.w-nav-menu.open {
  transform: translateX(0);
}
```

### 4.  Work With Webflow's System

```css
/* CORRECT - Override with specificity and !important */
.w-nav-button.w--open ~ * .w-nav-menu {
  right: 0 !important;
  transform: translateY(0px) !important;
}
```

---

## <¨ Complete Mobile Menu CSS Template

```css
/* ===== MOBILE MENU IMPLEMENTATION ===== */
@media (max-width: 991px) {
  /* STEP 1: Hide menu by default on mobile */
  .nav-menu, .w-nav-menu {
    display: none !important;
    position: fixed;
    top: 0;
    right: -100%;
    bottom: 0;
    left: auto;
    width: 85%;
    max-width: 360px;
    background: #05051a;
    z-index: 999;
    padding: 80px 20px 20px;
    overflow-y: auto;
    transition: right 0.3s ease;
    visibility: visible !important;
    opacity: 1 !important;
  }

  /* STEP 2: Show menu when Webflow adds w--open class */
  .w-nav-button.w--open ~ .navbar-button-wrapper .w-nav-menu,
  .w-nav-button.w--open + * .w-nav-menu,
  .navbar.w-nav .w-nav-button.w--open ~ * .w-nav-menu,
  .w--open ~ * .w-nav-menu {
    display: block !important;
    right: 0 !important;
    opacity: 1 !important;
    transform: translateY(0px) !important;
  }

  /* STEP 3: Alternative modern browser solution */
  .navbar:has(.w-nav-button.w--open) .w-nav-menu {
    display: block !important;
    right: 0 !important;
    opacity: 1 !important;
    transform: translateY(0px) !important;
  }

  /* STEP 4: Style mobile menu items */
  .nav-menu .nav-link,
  .w-nav-menu .w-nav-link {
    display: block !important;
    padding: 15px 0 !important;
    color: #ffffff !important;
    text-decoration: none !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
    font-size: 16px !important;
    transition: color 0.3s ease !important;
  }

  .nav-menu .nav-link:hover,
  .w-nav-menu .w-nav-link:hover {
    color: #ffd659 !important;
  }

  /* STEP 5: Mobile language switchers */
  .mobile-language-switchers {
    display: flex !important;
    gap: 10px;
    margin: 20px 0;
    justify-content: center;
  }

  .mobile-lang-pill {
    padding: 8px 16px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    color: #ffffff;
    text-decoration: none;
    font-size: 14px;
    transition: all 0.3s ease;
  }

  .mobile-lang-pill:hover,
  .mobile-lang-pill.active {
    background: #ffd659;
    color: #05051a;
  }

  /* STEP 6: Hamburger button styling */
  .menu-button, .w-nav-button {
    display: flex !important;
    background: transparent !important;
    border: none !important;
    cursor: pointer !important;
    padding: 10px !important;
    z-index: 1000 !important;
    align-items: center !important;
    justify-content: center !important;
  }

  /* STEP 7: Hamburger icon animation */
  .hamburger-icon {
    width: 24px !important;
    height: 18px !important;
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important;
  }

  .hamburger-line {
    display: block !important;
    width: 24px !important;
    height: 2px !important;
    background-color: #ffffff !important;
    border-radius: 1px !important;
    transition: all 0.3s ease !important;
  }

  /* Animate to X when opened */
  .menu-button.w--open .hamburger-line:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px) !important;
  }
  .menu-button.w--open .hamburger-line:nth-child(2) {
    opacity: 0 !important;
  }
  .menu-button.w--open .hamburger-line:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -6px) !important;
  }

  .menu-button:hover .hamburger-line {
    background-color: #ffd659 !important;
  }
}

/* ===== DESKTOP OVERRIDES ===== */
@media (min-width: 992px) {
  .menu-button, .w-nav-button {
    display: none !important;
  }

  .mobile-language-switchers,
  .primary-button-wrapper.mobile {
    display: none !important;
  }

  .nav-menu, .w-nav-menu {
    display: flex !important;
    align-items: center !important;
  }
}
```

---

## =' Implementation Steps for New Screens

### Step 1: HTML Structure

Ensure your HTML has the correct Webflow structure:

```html
<div class="navbar w-nav">
  <!-- Desktop navigation -->
  <nav role="navigation" class="nav-menu w-nav-menu">
    <a href="home.html" class="nav-link w-nav-link">Home</a>
    <a href="courses.html" class="nav-link w-nav-link">Courses</a>
    <!-- More nav items -->
  </nav>

  <!-- Mobile hamburger button -->
  <div class="menu-button w-nav-button">
    <div class="hamburger-icon">
      <div class="hamburger-line"></div>
      <div class="hamburger-line"></div>
      <div class="hamburger-line"></div>
    </div>
  </div>
</div>
```

### Step 2: Include Webflow Script

```html
<script src="https://d3e54v103j8qbb.cloudfront.net/js/webflow.js" type="text/javascript"></script>
```

### Step 3: Add the CSS Template

Copy the complete CSS template above into your `<style>` section or external CSS file.

### Step 4: Test on Mobile

Use the debugging scripts to verify:
1. Hamburger button gets `w--open` class when clicked
2. Menu slides in from right (`right: 0`)
3. Menu items are visible and clickable
4. Animations work smoothly

---

## >ê Testing Checklist

### Manual Testing

- [ ] Mobile menu hidden by default
- [ ] Hamburger button visible on mobile
- [ ] Click hamburger ’ menu slides in from right
- [ ] Menu items visible and clickable
- [ ] Language switchers work (if applicable)
- [ ] Action buttons work (if applicable)
- [ ] Click hamburger again ’ menu slides out
- [ ] Hamburger animates to X shape when open

### Automated Testing

```javascript
// Quick Playwright test
const hamburger = await page.$('.w-nav-button');
await hamburger.click();

const menu = await page.$('.w-nav-menu');
const isVisible = await menu.isVisible();
console.log(`Menu visible: ${isVisible}`); // Should be true
```

---

## =€ Key Success Factors

### 1. **Work WITH Webflow, Not Against It**
- Target `w--open` class that Webflow adds automatically
- Use CSS combinators to find menu relative to hamburger button
- Override with `!important` for specificity

### 2. **Use Multiple Selector Strategies**
```css
/* Covers different HTML structures */
.w-nav-button.w--open ~ .navbar-button-wrapper .w-nav-menu,
.w-nav-button.w--open + * .w-nav-menu,
.navbar.w-nav .w-nav-button.w--open ~ * .w-nav-menu,
.w--open ~ * .w-nav-menu,
.navbar:has(.w-nav-button.w--open) .w-nav-menu {
  /* Show menu styles */
}
```

### 3. **Debug First, Implement Second**
- Always use browser dev tools to inspect actual classes
- Create debugging scripts to watch class changes
- Test positioning values (especially `right` property)
- Verify on real mobile devices

### 4. **Fallback Strategies**
- Include both sibling combinator (`~`) and `:has()` selectors
- Test on multiple browsers
- Provide visual feedback (hamburger animation)

---

## =Ê Problem Timeline (Our Experience)

1. **Initial Issue**: "Mobile menu doesn't open after click"
2. **First Investigation**: Menu was opening but positioned off-screen (`right: 750px`)
3. **Root Cause Discovery**: Targeting wrong CSS classes (`.nav-open` vs `.w--open`)
4. **Solution Development**: Multiple CSS selector strategies
5. **Testing & Validation**: Playwright scripts confirmed success
6. **Final Result**:  Mobile menu works perfectly

---

## =¡ Pro Tips

### Performance
- Use `transform` for animations, not `left/right` changes
- Include `will-change: transform` for better performance
- Minimize repaints with `transform3d(0,0,0)`

### Accessibility
- Include `aria-expanded` attributes
- Ensure keyboard navigation works
- Test with screen readers

### Cross-Browser
- Test on iOS Safari (different Webflow behavior)
- Verify on older Android browsers
- Include vendor prefixes for animations

### Maintenance
- Document which Webflow classes you're targeting
- Test after Webflow updates
- Keep debugging scripts for future issues

---

**Remember**: Webflow's mobile menu system is powerful but requires working WITH its native JavaScript behavior, not against it. Always target the classes that Webflow actually uses (`w--open`) rather than inventing your own class system.