# Shared Teacher Card Component

A standardized, reusable teacher card component for displaying instructor profiles across the AI Studio platform. This component follows the WorkingLogic.md dual-system architecture and provides full multi-language support.

## Features

- 🌍 **Multi-language Support**: EN/RU/HE with automatic RTL for Hebrew
- 🎨 **Professional Design**: Gradient backgrounds, hover effects, and smooth animations
- 📊 **Statistics Display**: Rating, years of experience, courses taught, students count
- 🏷️ **Skills Tags**: Dynamic skill badges for each teacher
- 📱 **Fully Responsive**: Adapts to all screen sizes
- ♿ **Accessibility Compliant**: ARIA labels and keyboard navigation
- 🔄 **Dual-System Architecture**: Integrates with unified language manager
- 📸 **Smart Photo Handling**: Professional photos with fallback avatars

## Installation

### Method 1: Direct HTML Inclusion

```html
<!-- In the <head> section -->
<link rel="stylesheet" href="shared/components/teacher-card/teacher-card.css">

<!-- Before closing </body> -->
<script src="js/unified-language-manager.js"></script>
<script src="shared/components/teacher-card/teacher-card.js"></script>
```

### Method 2: Dynamic Loading

```javascript
// Dynamically load the teacher card component
function loadTeacherCardComponent() {
    // Load CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'shared/components/teacher-card/teacher-card.css';
    document.head.appendChild(link);

    // Load JS
    const script = document.createElement('script');
    script.src = 'shared/components/teacher-card/teacher-card.js';
    document.body.appendChild(script);
}
```

## Usage

### Basic Usage (Auto-initialization)

The component automatically initializes when the DOM is ready and looks for a container with class `.main-blog-collection-list`:

```html
<!-- Container for teacher cards -->
<div class="main-blog-collection-list">
    <!-- Teacher cards will be rendered here -->
</div>
```

### Manual Initialization

```javascript
// Create and initialize the component manually
const teacherCard = new SharedTeacherCard();
await teacherCard.init();

// Render cards to a specific container
teacherCard.renderCards('.custom-container');
```

### API Integration

The component automatically fetches teacher data from the API endpoint:
- **Local**: `http://localhost:3000/api/nd/teachers`
- **Production**: `https://aistudio555jamstack-production.up.railway.app/api/nd/teachers`

### Language Switching

The component automatically detects language changes and updates content:

```javascript
// Language is detected from (in order of priority):
// 1. UnifiedLanguageManager.currentLocale
// 2. URL parameter: ?locale=ru
// 3. localStorage: preferred_locale
// 4. Default: 'en'

// To manually switch language:
window.sharedTeacherCard.handleLanguageChange('ru');
```

## Component Structure

### Files

```
shared/components/teacher-card/
├── teacher-card.js      # Main JavaScript component
├── teacher-card.css     # Styling and responsive design
├── teacher-card.html    # HTML template reference
└── README.md           # Documentation
```

### HTML Structure

```html
<div class="shared-teacher-card" data-teacher-id="15">
    <div class="teacher-card-header">
        <span class="teacher-badge">AI EXPERT</span>
        <img class="teacher-avatar" src="..." alt="...">
        <h3 class="teacher-name">Dr. Sarah Chen</h3>
        <div class="teacher-title">Senior ML Engineer</div>
        <div class="teacher-company">Google</div>
    </div>

    <div class="teacher-skills">
        <span class="teacher-skill-tag">Machine Learning</span>
        <span class="teacher-skill-tag">Python</span>
    </div>

    <div class="teacher-stats">
        <div class="teacher-stat">
            <span class="stat-value">4.9</span>
            <div class="stat-label">⭐</div>
        </div>
        <!-- More stats... -->
    </div>

    <div class="teacher-bio">
        <p class="teacher-bio-text">Expert in machine learning...</p>
    </div>

    <div class="teacher-card-footer">
        <a href="teacher-detail.html?id=15" class="teacher-view-btn">
            <span>View Profile</span>
            <span class="btn-arrow">→</span>
        </a>
    </div>
</div>
```

## API Data Structure

The component expects teacher data in this format:

```javascript
{
    id: 15,
    teacher_key: "dr_sarah_chen",
    full_name: "Dr. Sarah Chen",
    full_name_ru: "Д-р Сара Чен",
    full_name_he: "ד\"ר שרה צ'ן",
    professional_title: "Senior ML Engineer",
    professional_title_ru: "Старший инженер машинного обучения",
    professional_title_he: "מהנדסת למידת מכונה בכירה",
    company: "Google",
    company_ru: "Google",
    company_he: "גוגל",
    bio: "Expert in machine learning...",
    bio_ru: "Эксперт по машинному обучению...",
    bio_he: "מומחית בלמידת מכונה...",
    profile_image_url: "https://...",
    skills: ["Machine Learning", "Python", "TensorFlow"],
    statistics: {
        rating: 4.9,
        years_experience: 8,
        students_taught: 500
    },
    courses_taught: [
        { name: "ML Fundamentals", rating: 4.9 }
    ]
}
```

## Customization

### CSS Variables

You can customize the component appearance using CSS variables:

```css
.shared-teacher-card {
    --teacher-card-bg: linear-gradient(135deg, #050f2c 0%, #0a1940 100%);
    --teacher-card-border: rgba(102, 126, 234, 0.2);
    --teacher-card-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    --teacher-accent: #667eea;
    --teacher-text-primary: #ffffff;
    --teacher-text-secondary: #a0aec0;
}
```

### Custom Styling

Override default styles in your own CSS:

```css
/* Custom card height */
.shared-teacher-card {
    height: 600px;
}

/* Custom badge color */
.teacher-badge {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
}

/* Custom hover effect */
.shared-teacher-card:hover {
    transform: translateY(-12px) scale(1.02);
}
```

## Translation Keys

The component uses these translation keys:

```javascript
{
    "teacher.card.badge": "AI EXPERT",
    "teacher.card.years": "YEARS",
    "teacher.card.courses": "COURSES",
    "teacher.card.students": "STUDENTS",
    "teacher.card.viewProfile": "View Profile",
    "teacher.loading": "Loading teachers...",
    "teacher.error": "Unable to load teachers",
    "teacher.noTeachers": "No teachers available"
}
```

## Events

The component dispatches and listens to these events:

```javascript
// Listen for language changes
window.addEventListener('languageChanged', (event) => {
    console.log('Language changed to:', event.detail.locale);
});

// Analytics events (if gtag is available)
// Automatically tracks: teacher_card_click
```

## Public Methods

```javascript
// Get component instance
const teacherCard = window.sharedTeacherCard;

// Refresh teachers
await teacherCard.refresh();

// Change language
await teacherCard.handleLanguageChange('ru');

// Show loading state
teacherCard.showLoading('.container');

// Show error state
teacherCard.showError('.container');

// Show no teachers message
teacherCard.showNoTeachers('.container');

// Destroy component
teacherCard.destroy();
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- **Lazy Loading**: Images load on demand
- **Optimized Rendering**: Batch DOM updates
- **Cached API Calls**: Reduces server requests
- **CSS Animations**: Hardware-accelerated transitions

## Accessibility

- ARIA labels for screen readers
- Keyboard navigation support
- Focus indicators
- Semantic HTML structure
- Color contrast compliant

## Troubleshooting

### Cards not appearing

1. Check console for errors
2. Verify API endpoint is accessible
3. Ensure container element exists
4. Check if unified-language-manager.js is loaded

### Wrong language displayed

1. Check locale parameter in URL
2. Verify localStorage preferred_locale
3. Check API response includes localized fields

### Images not loading

1. Check profile_image_url in API response
2. Verify fallback avatar service is accessible
3. Check browser console for CORS errors

## License

Copyright © 2024 AI Studio. All rights reserved.