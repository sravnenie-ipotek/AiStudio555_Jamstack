# Shared Course Categories Card Component

A responsive, reusable card component for displaying course categories with icons, titles, and descriptions. Based on the course-categories section design from the home page.

## Files

- `card-template.html` - HTML template with placeholders for course category cards
- `card-styles.css` - Complete responsive CSS styles matching original design
- `card-component.js` - JavaScript utility class for dynamic card creation
- `example.html` - Working example implementation

## Features

- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ RTL support
- ✅ Hover animations with gradient shape effect
- ✅ Exact match to original Webflow design
- ✅ i18n/translation support
- ✅ Scroll animations
- ✅ Link-based cards for navigation

## Usage

### Method 1: Static HTML

1. Include the CSS in your `<head>`:
```html
<link rel="stylesheet" href="/backups/newDesign/shared/components/card_home/card-styles.css">
```

2. Copy the HTML template and replace placeholders:
```html
<a href="courses.html?category=web-development" class="course-categories-single w-inline-block">
  <div class="course-categories-hover-in-shape"></div>
  <div class="course-categories-typography">
    <div class="course-categories-icon-wrapper">
      <img src="images/Core-Values-Icon1.svg" alt="Web Development" class="course-categories-icon" />
    </div>
    <h4 class="course-categories-name" data-i18n="course_categories.content.items.0.name">
      Web Development
    </h4>
    <p class="course-categories-description-text" data-i18n="course_categories.content.items.0.description">
      Build Dynamic Websites
    </p>
  </div>
</a>
```

3. Wrap multiple cards in a container:
```html
<div class="course-categories-collection-list">
  <!-- Card 1 -->
  <a href="#" class="course-categories-single w-inline-block">...</a>
  <!-- Card 2 -->
  <a href="#" class="course-categories-single w-inline-block">...</a>
  <!-- Card 3 -->
  <a href="#" class="course-categories-single w-inline-block">...</a>
</div>
```

### Method 2: Dynamic JavaScript

1. Include CSS and JS:
```html
<link rel="stylesheet" href="/backups/newDesign/shared/components/card_home/card-styles.css">
<script src="/backups/newDesign/shared/components/card_home/card-component.js"></script>
```

2. Create cards dynamically:
```javascript
const cardManager = new SharedCategoryCard();

const cardsData = [
  {
    linkUrl: 'courses.html?category=web-development',
    iconUrl: 'images/Core-Values-Icon1.svg',
    iconAlt: 'Web Development',
    title: 'Web Development',
    description: 'Build Dynamic Websites',
    i18nTitle: 'course_categories.content.items.0.name',
    i18nDesc: 'course_categories.content.items.0.description'
  },
  {
    linkUrl: 'courses.html?category=mobile-development',
    iconUrl: 'images/Core-Values-Icon3.svg',
    iconAlt: 'App Development',
    title: 'App Development',
    description: 'Create Mobile Apps',
    i18nTitle: 'course_categories.content.items.4.name',
    i18nDesc: 'course_categories.content.items.4.description'
  },
  {
    linkUrl: 'courses.html?category=data-science',
    iconUrl: 'images/Core-Values-Icon2.svg',
    iconAlt: 'Data Science',
    title: 'Data Science',
    description: 'Analyze Big Data',
    i18nTitle: 'course_categories.content.items.1.name',
    i18nDesc: 'course_categories.content.items.1.description'
  }
];

// Replace existing cards
cardManager.replaceCards('.course-categories-wrapper', cardsData);

// Or create new card group
const cardGroup = cardManager.createCardGroup(cardsData);
document.querySelector('.container').appendChild(cardGroup);
```

## Exact Original Dimensions

Based on `aizeks-groovy-site.webflow.css`:

- **Card padding**: 45px top/bottom
- **Background**: #04193f
- **Icon wrapper**: 120x120px (desktop), 90x90px (tablet), 80x80px (mobile)
- **Icon size**: 60px max (desktop), 45px (tablet), 40px (mobile)
- **Title**: 22px font, 700 weight
- **Description**: 16px font
- **Hover effect**: Gradient shape animation

## Responsive Breakpoints

- **Desktop (1280px+)**: Full size with enhanced typography
- **Tablet (768px - 991px)**: Reduced icon and padding
- **Mobile (480px - 767px)**: Compact design with smaller icons
- **Small Mobile (< 480px)**: Single column, minimal spacing

## RTL Support

Cards automatically adapt for RTL languages when `dir="rtl"` is set:

```html
<div dir="rtl">
  <a href="#" class="course-categories-single">...</a>
</div>
```

## Customization

### CSS Variables (add to your stylesheet)

```css
:root {
  --card-bg: #04193f;
  --card-hover-bg: #052451;
  --card-icon-bg: rgba(255, 255, 255, 0.05);
  --card-icon-hover-bg: rgba(255, 255, 255, 0.1);
  --card-title-color: #ffffff;
  --card-title-hover: #667eea;
  --card-description-color: rgba(255, 255, 255, 0.8);
}
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

- Semantic HTML with proper link structure
- Proper heading hierarchy (h4)
- Alt text for icons
- Focus states for keyboard navigation
- Smooth animations that respect prefers-reduced-motion

## Performance

- Lazy loading ready for images
- CSS animations use transform for GPU acceleration
- IntersectionObserver for scroll animations
- Minimal JavaScript footprint

## Migration from Existing Cards

To replace existing course category cards:

1. Keep the outer container structure
2. Replace inner card HTML with shared component
3. Include the shared CSS file
4. Remove old card-specific styles
5. Test responsiveness and hover effects

## Example Implementation

See `example.html` for a complete working example with multiple card layouts.