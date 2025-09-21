# Unified Translation Strategy for Courses.html

## ✅ Implementation Summary

The courses.html page now uses the **SAME translation system** as home.html to prevent confusion and race conditions.

## 🏗️ Architecture (Unified Approach)

```
All Pages → Single Language Manager → Express API → PostgreSQL Database
    ↓              ↓                      ↓              ↓
data-i18n    Auto-detects page      Port 3000     nd_*_page tables
```

## 📁 Single Translation System

### Core File: `/backups/newDesign/js/language-manager.js`

This is the **ONLY** language manager used across ALL pages:
- **Line 13**: API base URL - `http://localhost:3000`
- **Line 229-247**: Page detection logic
- **Line 253-260**: Endpoint mapping for each page

```javascript
// Unified endpoint mapping
const endpoints = {
    'home': `/api/nd/home-page?locale=${locale}`,
    'courses': `/api/nd/courses-page?locale=${locale}`,
    'teachers': `/api/nd/teachers-page?locale=${locale}`,
    'blog': `/api/nd/blog?locale=${locale}`,
    'career-center': `/api/nd/career-center-platform-page?locale=${locale}`,
    'career-orientation': `/api/nd/career-orientation-page?locale=${locale}`
};
```

## 🗄️ Database Tables

### For Courses Page:

1. **`nd_courses_page`** - UI translations and page content
   - Structure identical to nd_home:
     ```sql
     CREATE TABLE nd_courses_page (
         id SERIAL PRIMARY KEY,
         section_key VARCHAR(100) UNIQUE NOT NULL,
         section_type VARCHAR(50),
         content_en JSONB,
         content_ru JSONB,
         content_he JSONB,
         visible BOOLEAN DEFAULT true,
         animations_enabled BOOLEAN DEFAULT true,
         created_at TIMESTAMP DEFAULT NOW(),
         updated_at TIMESTAMP DEFAULT NOW()
     );
     ```

2. **`nd_courses`** - Actual course data (separate from UI translations)
   - Contains course details: title, description, price, etc.

### Current Sections in nd_courses_page:
1. **hero** - Page hero section (title, subtitle, description)
2. **featured_courses** - Section titles and labels
3. **ui_elements** - Buttons, filters, UI text
4. **cart** - Shopping cart text
5. **cta_bottom** - Bottom call-to-action
6. **misc** - Miscellaneous text
7. **navigation** - Navigation menu items

## 🔄 Translation Flow (Identical to home.html)

### 1. Page Load Detection
```javascript
getCurrentPageName() {
    const path = window.location.pathname;
    if (path.includes('courses')) return 'courses';
    // ... other page checks
}
```

### 2. API Endpoint Selection
```javascript
loadPageContent(locale) {
    const pageName = this.getCurrentPageName(); // Returns 'courses'
    const endpoint = this.getAPIEndpoint(pageName, locale);
    // Results in: /api/nd/courses-page?locale=ru
}
```

### 3. Content Update
```javascript
updatePageContent(data, locale) {
    // Updates all elements with data-i18n attributes
    // Same logic as home.html
}
```

## 🏷️ Data-i18n Attributes in courses.html

Currently **62 data-i18n attributes** are present:

```html
<!-- Hero Section -->
<h1 data-i18n="hero.title">Our Courses</h1>
<p data-i18n="hero.subtitle">Explore Our Curriculum</p>

<!-- Course Filters -->
<button data-i18n="filters.all">All</button>
<button data-i18n="filters.web_development">Web Development</button>

<!-- UI Elements -->
<button data-i18n="buttons.course_details">Course Details</button>
<button data-i18n="buttons.add_to_cart">Add to Cart</button>

<!-- Navigation -->
<a data-i18n="navigation.content.home">Home</a>
<a data-i18n="navigation.content.courses">Courses</a>
```

## 🚫 Removed Components (Preventing Race Conditions)

The following were REMOVED from courses.html to prevent conflicts:
1. ❌ `js/mobile-language-manager.js` - Removed
2. ❌ `js/enhanced-language-manager.js` - Removed
3. ❌ `js/nd-home-integration.js` - Removed (was home-specific)

Only kept:
✅ `js/language-manager.js` - Single unified manager

## 🔧 Server-Side Implementation

### API Endpoint: `/api/nd/courses-page`
Located in server.js (lines 8196-8316)

```javascript
app.get('/api/nd/courses-page', async (req, res) => {
    const { locale = 'en', preview = false } = req.query;

    const query = `
        SELECT
            section_key,
            section_type,
            visible,
            COALESCE(content_${locale}, content_en) as content,
            animations_enabled
        FROM nd_courses_page
        ${!preview ? 'WHERE visible = true' : ''}
        ORDER BY section_key
    `;

    // Returns structured JSON like home-page endpoint
});
```

## 💾 Caching & Performance

Same caching strategy as home.html:
- In-memory cache per session
- Cache persists during page navigation
- LocalStorage for language preference
- Cache busting with version parameters

## 🌐 Language Support

- **en** - English (default)
- **ru** - Russian (fully translated)
- **he** - Hebrew (with RTL support)

## 📊 Translation Coverage

### Courses.html Coverage:
- **Total data-i18n attributes**: 62
- **Sections covered**: 7
- **Languages**: 3 (en, ru, he)

### Coverage by Section:
1. **Hero**: 3 fields (100%)
2. **Featured Courses**: Labels and titles (100%)
3. **UI Elements**: All buttons and controls (100%)
4. **Cart**: Cart-related text (100%)
5. **CTA Bottom**: Call-to-action text (100%)
6. **Misc**: Additional text (100%)
7. **Navigation**: Menu items (100%)

## 🔀 Fallback Chain (Same as home.html)

1. **Database Level**: `COALESCE(content_${locale}, content_en)`
2. **API Level**: Returns English if locale not found
3. **Frontend Level**: Falls back to 'en' on error

## 🐛 Key Differences from Old System

### Before (Multiple Managers):
- Different language managers for different pages
- Race conditions between managers
- Confusion about which endpoint to use
- Inconsistent translation behavior

### After (Unified System):
- ONE language-manager.js for ALL pages
- Automatic page detection
- Consistent endpoint mapping
- No race conditions
- Same behavior across all pages

## 📝 Testing URLs

**⚠️ IMPORTANT: We are working on the NewDesign project in `/backups/newDesign/`**

```bash
# Correct URLs for NewDesign project:

# English
http://localhost:3005/backups/newDesign/courses.html

# Russian
http://localhost:3005/backups/newDesign/courses.html?locale=ru

# Hebrew (RTL)
http://localhost:3005/backups/newDesign/courses.html?locale=he

# API Testing
curl http://localhost:3000/api/nd/courses-page?locale=ru
```

**Note**: The root level `/courses.html` is OLD. We work exclusively in `/backups/newDesign/`

## ✅ Verification Checklist

1. ✅ Single language-manager.js loaded
2. ✅ Correct API endpoint used (/api/nd/courses-page)
3. ✅ Page detection working (returns 'courses')
4. ✅ 62 data-i18n attributes present
5. ✅ Database table nd_courses_page populated
6. ✅ Russian translations working
7. ✅ Language persistence via localStorage
8. ✅ No console errors
9. ✅ No race conditions

## 🎯 Summary

The courses.html page now uses the **EXACT SAME** translation system as home.html:
- Same language-manager.js file
- Same translation flow
- Same caching strategy
- Same fallback mechanisms
- Same API structure

This ensures **consistency** and **prevents race conditions** across the entire application.