# API-Based Translation System - Complete Implementation Guide

## =Ë Table of Contents
1. [Executive Summary](#executive-summary)
2. [Architecture Overview](#architecture-overview)
3. [Why This Approach](#why-this-approach)
4. [Database Structure - NewDesign (nd_) Tables](#database-structure---newdesign-nd_-tables)
5. [API Implementation](#api-implementation)
6. [Frontend Integration](#frontend-integration)
7. [Admin Panel Workflow](#admin-panel-workflow)
8. [Step-by-Step Implementation](#step-by-step-implementation)
9. [Testing & Verification](#testing--verification)
10. [Troubleshooting Guide](#troubleshooting-guide)
11. [Migration from Other Systems](#migration-from-other-systems)
12. [Performance Optimization](#performance-optimization)
13. [Best Practices](#best-practices)

---

## <¯ Executive Summary

This document describes the **API-based translation system** used in the AI Studio project, specifically implemented in courses.html and other dynamic pages. This approach is **superior to attribute-based systems** because it:

-  **Single source of truth** - Database stores all translations
-  **Admin-friendly** - Content managers can add translations without code changes
-  **Scalable** - Add languages without touching frontend
-  **Maintainable** - No HTML attribute management needed
-  **Dynamic** - Real-time updates without deployment

### Key Principle
**"The backend owns translations, the frontend just displays them"**

###   CRITICAL: NewDesign Table Convention
**ALL tables MUST use the `nd_` prefix** (NewDesign convention):
-  CORRECT: `nd_courses`, `nd_workshops`, `nd_teachers`
- L WRONG: `courses`, `workshops`, `teachers` (legacy tables)

---

## <× Architecture Overview

### System Flow
```
User Request ’ Frontend JS ’ API with locale ’ Database Query ’ Localized Response ’ DOM Update
     “              “             “                 “                    “              “
  ?locale=ru   Get locale    /api/courses    SELECT from nd_      Return Russian     Display
               from URL      ?locale=ru        tables only           data          content
```

### Components

#### 1. Database Layer (PostgreSQL) - NewDesign Tables Only
```sql
--   IMPORTANT: All tables MUST use nd_ prefix for NewDesign
-- Multi-language support built into schema
CREATE TABLE nd_courses (  --  CORRECT: nd_ prefix
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),        -- English title (default)
    title_ru VARCHAR(255),     -- Russian title
    title_he VARCHAR(255),     -- Hebrew title
    description TEXT,          -- English description
    description_ru TEXT,       -- Russian description
    description_he TEXT,       -- Hebrew description
    -- ... other fields
);

-- L NEVER use legacy tables without nd_ prefix
-- Wrong: CREATE TABLE courses (...);
```

#### 2. API Layer (Express.js)
```javascript
// Smart locale handling with fallback
app.get('/api/courses', async (req, res) => {
    const locale = req.query.locale || 'en';

    //   CRITICAL: Always query nd_ tables, NOT legacy tables
    const query = `
        SELECT
            id,
            COALESCE(
                CASE
                    WHEN $1 = 'ru' THEN title_ru
                    WHEN $1 = 'he' THEN title_he
                    ELSE NULL
                END,
                title
            ) as title,
            -- Same pattern for all translatable fields
        FROM nd_courses  --  Using nd_ table
        WHERE visible = true
    `;
});
```

#### 3. Frontend Layer (JavaScript)
```javascript
// Simple fetch with locale
async function loadContent() {
    const locale = new URLSearchParams(window.location.search).get('locale') || 'en';
    const response = await fetch(`${API_URL}/api/courses?locale=${locale}`);
    const data = await response.json();
    renderContent(data);
}
```

---

## =€ Why This Approach

### Comparison with Attribute-Based Systems

| Feature | API-Based (Current) | Attribute-Based (data-i18n) |
|---------|-------------------|---------------------------|
| **New Content** |  Automatic via admin | L Requires HTML updates |
| **Missing Translations** |  Falls back to English | L Shows attribute path |
| **Admin Panel** |  Full integration | L No integration |
| **Maintenance** |  Database only | L HTML + JS files |
| **Performance** |  One API call | L Multiple lookups |
| **SEO** |  Server-side ready | L Client-side only |
| **Scale New Language** |  Add DB column | L Update all HTML |

### Real-World Benefits
1. **Marketing Team**: Can update Russian course titles without developer
2. **Content Team**: Sees changes immediately after admin save
3. **Development**: No deployment needed for translation updates
4. **QA**: Can test translations in admin preview mode

---

## =Ä Database Structure - NewDesign (nd_) Tables

###   CRITICAL NAMING CONVENTION
**ALL tables in the NewDesign system MUST use the `nd_` prefix**

This distinguishes them from legacy tables and ensures:
- Clear separation between old and new systems
- Consistent API endpoints (`/api/nd/...`)
- Easier migration tracking
- No conflicts with legacy code

### Required Schema Pattern

#### For Dynamic Content (Courses, Blogs, Teachers)
```sql
--  CORRECT: Using nd_ prefix
CREATE TABLE nd_courses (
    -- Identification
    id SERIAL PRIMARY KEY,
    course_key VARCHAR(100) UNIQUE,

    -- Multi-language fields (repeat pattern for each translatable field)
    title VARCHAR(255),          -- English (default)
    title_ru VARCHAR(255),       -- Russian
    title_he VARCHAR(255),       -- Hebrew

    description TEXT,
    description_ru TEXT,
    description_he TEXT,

    -- Non-translatable fields (same for all languages)
    price DECIMAL(10,2),
    duration VARCHAR(50),
    rating DECIMAL(2,1),
    image VARCHAR(500),

    -- Control fields
    visible BOOLEAN DEFAULT true,
    published BOOLEAN DEFAULT true,
    order_index INTEGER,

    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

--  MORE EXAMPLES of nd_ tables:
CREATE TABLE nd_teachers (...);
CREATE TABLE nd_workshops (...);
CREATE TABLE nd_blog_posts (...);
CREATE TABLE nd_testimonials (...);

-- L NEVER create tables without nd_ prefix in new system
```

#### For Static UI Translations
```sql
--  CORRECT: Using nd_ prefix for UI translations too
CREATE TABLE nd_ui_translations (
    id SERIAL PRIMARY KEY,
    page VARCHAR(100),           -- 'courses', 'home', etc.
    element_key VARCHAR(255),    -- 'nav.home', 'button.signup'
    text_en TEXT,                -- English text
    text_ru TEXT,                -- Russian text
    text_he TEXT,                -- Hebrew text
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Database Design Rules
1. **Table Prefix**: ALL tables MUST start with `nd_`
2. **Naming Convention**: `field` (English), `field_ru` (Russian), `field_he` (Hebrew)
3. **NULL Handling**: NULL translations fall back to English via COALESCE
4. **Required Fields**: At minimum need English version
5. **Index Strategy**: Index on visible, published, and locale-specific queries

### Complete List of NewDesign Tables
```sql
-- Page content tables (all with nd_ prefix)
nd_home                  -- Homepage sections
nd_courses              -- Course catalog
nd_teachers             -- Teacher profiles
nd_pricing_page         -- Pricing page content
nd_about_page           -- About page content
nd_blog_posts           -- Blog articles
nd_contact_page         -- Contact page
nd_career_center_pages  -- Career center
nd_career_orientation_pages -- Career orientation

-- System tables (all with nd_ prefix)
nd_menu                 -- Navigation menu
nd_footer               -- Footer content
nd_settings             -- Global settings
nd_ui_translations      -- UI text translations

-- Entity tables (all with nd_ prefix)
nd_testimonials         -- Student testimonials
nd_faqs                 -- Frequently asked questions
nd_features             -- Feature listings
```

---

## = API Implementation

### Core API Endpoint Pattern
```javascript
// server.js - Complete implementation
app.get('/api/courses', async (req, res) => {
    try {
        // 1. Extract locale with fallback
        const locale = req.query.locale || req.headers['accept-language']?.split(',')[0] || 'en';

        // 2. Validate locale
        const supportedLocales = ['en', 'ru', 'he'];
        const validLocale = supportedLocales.includes(locale) ? locale : 'en';

        // 3.   CRITICAL: Query from nd_courses, NOT courses table
        const query = `
            SELECT
                id,
                course_key,
                COALESCE(
                    CASE
                        WHEN $1 = 'ru' THEN title_ru
                        WHEN $1 = 'he' THEN title_he
                        ELSE NULL
                    END,
                    title
                ) as title,
                COALESCE(
                    CASE
                        WHEN $1 = 'ru' THEN description_ru
                        WHEN $1 = 'he' THEN description_he
                        ELSE NULL
                    END,
                    description
                ) as description,
                price,
                duration,
                lessons_count as lessons,
                rating,
                image,
                category,
                instructor
            FROM nd_courses  --  Using nd_ table, NOT legacy table
            WHERE visible = true AND published = true
            ORDER BY order_index ASC, id DESC
        `;

        // 4. Execute query
        const courses = await db.query(query, [validLocale]);

        // 5. Get UI translations for this page (also from nd_ table)
        const uiQuery = `
            SELECT element_key,
                   CASE
                       WHEN $1 = 'ru' THEN text_ru
                       WHEN $1 = 'he' THEN text_he
                       ELSE text_en
                   END as text
            FROM nd_ui_translations  --  Using nd_ table
            WHERE page = 'courses'
        `;
        const uiTranslations = await db.query(uiQuery, [validLocale]);

        // 6. Transform UI translations to object
        const ui = {};
        uiTranslations.forEach(row => {
            ui[row.element_key] = row.text;
        });

        // 7. Return complete localized response
        res.json({
            success: true,
            locale: validLocale,
            data: {
                courses: courses.rows,
                ui: ui,  // Include UI translations
                meta: {
                    total: courses.rowCount,
                    locale: validLocale,
                    timestamp: new Date().toISOString()
                }
            }
        });

    } catch (error) {
        console.error('L API Error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch courses',
            locale: 'en',
            data: { courses: [], ui: {} }
        });
    }
});

//  CORRECT: NewDesign specific endpoint
app.get('/api/nd/courses', async (req, res) => {
    // Same logic but explicitly for nd_ tables
});

// L AVOID: Don't create endpoints that might use legacy tables
```

### Helper Functions
```javascript
// Reusable locale detection
function getLocale(req) {
    return req.query.locale ||
           req.cookies?.locale ||
           req.headers['accept-language']?.split(',')[0]?.substring(0, 2) ||
           'en';
}

// Locale validation
function validateLocale(locale) {
    const supported = ['en', 'ru', 'he'];
    return supported.includes(locale) ? locale : 'en';
}

// Database query wrapper ensuring nd_ tables
async function queryNdTable(tableName, locale, conditions = {}) {
    //   CRITICAL: Ensure table has nd_ prefix
    if (!tableName.startsWith('nd_')) {
        throw new Error(`Table ${tableName} must use nd_ prefix for NewDesign`);
    }

    const validLocale = validateLocale(locale);
    // Build dynamic query based on table schema
    // ... implementation
}
```

---

## =» Frontend Integration

### Complete Frontend Implementation
```javascript
// nd-courses-integration.js - Full implementation
class CoursesPageManager {
    constructor() {
        this.API_BASE_URL = this.getApiUrl();
        this.currentLocale = this.getLocale();
        this.cache = new Map();
        this.init();
    }

    // Determine API URL based on environment
    getApiUrl() {
        if (window.location.hostname === 'localhost') {
            // Check if local server is running
            return 'http://localhost:3000';  // Fallback to local
        }
        return 'https://aistudio555jamstack-production.up.railway.app';
    }

    // Get locale from URL
    getLocale() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('locale') ||
               urlParams.get('lang') ||
               localStorage.getItem('preferred_locale') ||
               'en';
    }

    // Initialize page
    async init() {
        console.log('=€ Initializing Courses Page');
        console.log('< Locale:', this.currentLocale);
        console.log('= API URL:', this.API_BASE_URL);
        console.log('=Ê Using nd_courses table (NewDesign)');

        try {
            // Load all content with locale
            await this.loadPageContent();

            // Setup language switcher
            this.setupLanguageSwitcher();

            // Setup category filters
            this.setupCategoryFilters();

        } catch (error) {
            console.error('L Initialization failed:', error);
            this.showError();
        }
    }

    // Main content loading
    async loadPageContent() {
        // Check cache first
        const cacheKey = `nd_courses_${this.currentLocale}`; // Note: nd_ prefix in cache key
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < 5 * 60 * 1000) { // 5 min cache
                console.log('=æ Using cached data from nd_courses');
                this.renderContent(cached.data);
                return;
            }
        }

        // Fetch from API (which queries nd_courses table)
        const response = await fetch(`${this.API_BASE_URL}/api/courses?locale=${this.currentLocale}`);

        if (!response.ok) {
            throw new Error(`API returned ${response.status}`);
        }

        const result = await response.json();

        // Cache the response
        this.cache.set(cacheKey, {
            data: result.data,
            timestamp: Date.now()
        });

        // Render content
        this.renderContent(result.data);
    }

    // Render all content
    renderContent(data) {
        // Render courses from nd_courses table
        this.renderCourses(data.courses || []);

        // Update UI text from nd_ui_translations
        this.updateUITranslations(data.ui || {});

        // Update page direction for Hebrew
        if (this.currentLocale === 'he') {
            document.documentElement.dir = 'rtl';
            document.body.classList.add('rtl');
        }
    }

    // Render course cards
    renderCourses(courses) {
        const container = document.querySelector('.featured-courses-collection-list');
        if (!container) return;

        // Clear existing content
        container.innerHTML = '';

        // Generate cards
        courses.forEach(course => {
            const card = this.createCourseCard(course);
            container.appendChild(card);
        });

        console.log(` Rendered ${courses.length} courses from nd_courses table`);
    }

    // Create individual course card
    createCourseCard(course) {
        const card = document.createElement('div');
        card.className = 'course-card';

        card.innerHTML = `
            <div class="course-card-image-wrapper">
                <img src="${course.image || 'images/placeholder.jpg'}"
                     alt="${course.title}"
                     class="course-card-image"
                     loading="lazy">
                <div class="course-category-badge">${course.category}</div>
            </div>
            <div class="course-card-content">
                <h3 class="course-title">${course.title}</h3>
                <p class="course-description">${course.description}</p>
                <div class="course-meta">
                    <span class="course-instructor">${course.instructor}</span>
                    <span class="course-duration">${course.duration}</span>
                </div>
                <div class="course-footer">
                    <span class="course-price">$${course.price}</span>
                    <div class="course-rating">
                        <span class="rating-value">${course.rating}</span>
                        <span class="rating-stars"></span>
                    </div>
                </div>
                <a href="detail_courses.html?id=${course.id}&locale=${this.currentLocale}"
                   class="course-link">
                    ${this.getLocalizedText('View Details', 'ui.view_details')}
                </a>
            </div>
        `;

        return card;
    }

    // Update static UI translations
    updateUITranslations(translations) {
        // Update navigation
        this.updateElementText('.nav-home', translations['nav.home']);
        this.updateElementText('.nav-courses', translations['nav.courses']);
        this.updateElementText('.nav-about', translations['nav.about']);

        // Update buttons
        this.updateElementText('.btn-signup', translations['button.signup']);
        this.updateElementText('.btn-learn-more', translations['button.learn_more']);

        // Update headings
        this.updateElementText('.page-title', translations['page.title']);
        this.updateElementText('.page-subtitle', translations['page.subtitle']);

        // Update filter tabs
        this.updateElementText('[data-category="all"]', translations['filter.all']);
        this.updateElementText('[data-category="web"]', translations['filter.web']);
        this.updateElementText('[data-category="mobile"]', translations['filter.mobile']);
    }

    // Helper to update element text
    updateElementText(selector, text) {
        if (!text) return;
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = text;
        }
    }

    // Get localized text with fallback
    getLocalizedText(defaultText, key) {
        // This would check translations object
        return defaultText;  // Simplified for example
    }

    // Setup language switcher
    setupLanguageSwitcher() {
        const switcher = document.querySelector('.language-switcher');
        if (!switcher) return;

        // Update active state
        switcher.querySelectorAll('.lang-pill').forEach(pill => {
            const lang = pill.dataset.lang;
            if (lang === this.currentLocale) {
                pill.classList.add('active');
            } else {
                pill.classList.remove('active');
            }

            // Add click handler
            pill.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchLanguage(lang);
            });
        });
    }

    // Switch language
    switchLanguage(locale) {
        // Update URL without reload
        const url = new URL(window.location);
        url.searchParams.set('locale', locale);
        window.history.pushState({}, '', url);

        // Store preference
        localStorage.setItem('preferred_locale', locale);

        // Update current locale
        this.currentLocale = locale;

        // Reload content
        this.init();
    }

    // Setup category filters
    setupCategoryFilters() {
        const filters = document.querySelectorAll('[data-category]');
        filters.forEach(filter => {
            filter.addEventListener('click', (e) => {
                e.preventDefault();
                this.filterByCategory(filter.dataset.category);
            });
        });
    }

    // Filter courses by category
    filterByCategory(category) {
        const cards = document.querySelectorAll('.course-card');
        cards.forEach(card => {
            const cardCategory = card.querySelector('.course-category-badge')?.textContent;
            if (category === 'all' || cardCategory === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Error handling
    showError() {
        const container = document.querySelector('.featured-courses-collection-list');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <p>Unable to load courses. Please try again later.</p>
                    <button onclick="location.reload()">Retry</button>
                </div>
            `;
        }
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    window.coursesManager = new CoursesPageManager();
});
```

---

## =h=¼ Admin Panel Workflow

### How Content Managers Add Translations

#### Step 1: Access Admin Panel
```
http://localhost:3000/admin-nd.html  <!-- Note: admin-nd for NewDesign -->
```

#### Step 2: Add Course with Translations (to nd_courses table)
```javascript
// Admin panel form structure
<form id="courseForm">
    <h3>Add New Course (nd_courses table)</h3>

    <!-- English (Default) -->
    <input name="title" placeholder="Course Title (English)" required>
    <textarea name="description" placeholder="Description (English)" required></textarea>

    <!-- Russian Translation -->
    <input name="title_ru" placeholder="0720=85 :C@A0 (Russian)">
    <textarea name="description_ru" placeholder="?8A0=85 (Russian)"></textarea>

    <!-- Hebrew Translation -->
    <input name="title_he" placeholder="ÛÕêèê ÔçÕèá (Hebrew)" dir="rtl">
    <textarea name="description_he" placeholder="êÙÐÕè (Hebrew)" dir="rtl"></textarea>

    <!-- Common fields -->
    <input name="price" type="number" placeholder="Price">
    <select name="category">
        <option>Web Development</option>
        <option>Mobile Development</option>
        <option>Data Science</option>
    </select>
</form>
```

#### Step 3: Save to Database (nd_courses table)
```javascript
// Admin panel save handler
async function saveCourse(formData) {
    const response = await fetch('/api/admin/nd/courses', {  // Note: /nd/ in path
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: formData.title,
            title_ru: formData.title_ru || null,  // NULL if not provided
            title_he: formData.title_he || null,
            description: formData.description,
            description_ru: formData.description_ru || null,
            description_he: formData.description_he || null,
            // ... other fields
        })
    });

    if (response.ok) {
        alert('Course saved to nd_courses table with translations!');
        // Translations immediately available on frontend
    }
}
```

#### Step 4: Instant Availability
- No deployment needed
- No HTML file changes
- No data-i18n attributes to add
- Frontend automatically shows translations based on ?locale parameter
- All stored in nd_courses table (NewDesign system)

---

## =Ý Step-by-Step Implementation

### For New Pages (e.g., workshops.html)

#### Step 1: Create Database Table (with nd_ prefix)
```sql
--  CORRECT: Using nd_ prefix for new table
CREATE TABLE nd_workshops (
    id SERIAL PRIMARY KEY,
    workshop_key VARCHAR(100) UNIQUE,

    -- Translatable fields
    title VARCHAR(255),
    title_ru VARCHAR(255),
    title_he VARCHAR(255),
    description TEXT,
    description_ru TEXT,
    description_he TEXT,

    -- Common fields
    date DATE,
    duration VARCHAR(50),
    price DECIMAL(10,2),
    max_participants INTEGER,

    -- Control
    visible BOOLEAN DEFAULT true,
    published BOOLEAN DEFAULT true,

    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- L WRONG: CREATE TABLE workshops (...);  -- Missing nd_ prefix
```

#### Step 2: Create API Endpoint
```javascript
// server.js
app.get('/api/workshops', async (req, res) => {
    const locale = getLocale(req);

    //  Query from nd_workshops table
    const query = `
        SELECT
            id,
            COALESCE(
                CASE
                    WHEN $1 = 'ru' THEN title_ru
                    WHEN $1 = 'he' THEN title_he
                    ELSE NULL
                END,
                title
            ) as title,
            COALESCE(
                CASE
                    WHEN $1 = 'ru' THEN description_ru
                    WHEN $1 = 'he' THEN description_he
                    ELSE NULL
                END,
                description
            ) as description,
            date,
            duration,
            price,
            max_participants
        FROM nd_workshops  --  Using nd_ table
        WHERE visible = true AND published = true
        ORDER BY date ASC
    `;

    const workshops = await db.query(query, [locale]);

    res.json({
        success: true,
        locale: locale,
        data: workshops.rows
    });
});

// Alternative: Explicit nd endpoint
app.get('/api/nd/workshops', async (req, res) => {
    // Same logic, explicitly for nd_ tables
});
```

#### Step 3: Create Frontend Integration
```javascript
// nd-workshops-integration.js
document.addEventListener('DOMContentLoaded', async () => {
    const locale = new URLSearchParams(window.location.search).get('locale') || 'en';

    console.log('Loading workshops from nd_workshops table...');
    const response = await fetch(`/api/workshops?locale=${locale}`);
    const result = await response.json();

    const container = document.querySelector('.workshops-list');

    result.data.forEach(workshop => {
        const card = `
            <div class="workshop-card">
                <h3>${workshop.title}</h3>
                <p>${workshop.description}</p>
                <div class="workshop-meta">
                    <span>${workshop.date}</span>
                    <span>${workshop.duration}</span>
                    <span>$${workshop.price}</span>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
});
```

#### Step 4: Add to Admin Panel
```javascript
// Add workshops section to admin (for nd_workshops table)
{
    name: 'Workshops (nd_workshops)',
    endpoint: '/api/nd/workshops',
    tableName: 'nd_workshops',  // Explicit table name
    fields: [
        { name: 'title', type: 'text', translatable: true },
        { name: 'description', type: 'textarea', translatable: true },
        { name: 'date', type: 'date', translatable: false },
        { name: 'price', type: 'number', translatable: false }
    ]
}
```

---

## >ê Testing & Verification

### Manual Testing Checklist
```bash
# 1. Test English (default) - from nd_courses
curl http://localhost:3000/api/courses
# Should return English content from nd_courses table

# 2. Test Russian - from nd_courses
curl http://localhost:3000/api/courses?locale=ru
# Should return Russian titles/descriptions from nd_courses table

# 3. Test Hebrew - from nd_courses
curl http://localhost:3000/api/courses?locale=he
# Should return Hebrew content from nd_courses table

# 4. Test fallback (unsupported locale)
curl http://localhost:3000/api/courses?locale=fr
# Should return English (fallback) from nd_courses table

# 5. Verify we're using nd_ tables
psql -c "SELECT table_name FROM information_schema.tables WHERE table_name LIKE 'nd_%'"
# Should list all nd_ tables

# 6. Check if legacy tables are being used (should not be)
psql -c "SELECT * FROM courses LIMIT 1"  # Should not be used
psql -c "SELECT * FROM nd_courses LIMIT 1"  # Should be used
```

### Automated Testing
```javascript
// test-nd-translations.js
const axios = require('axios');
const assert = require('assert');

async function testNdTranslations() {
    const tests = [
        {
            name: 'English returns English from nd_courses',
            locale: 'en',
            expectedField: 'title',
            expectedPattern: /^[A-Za-z\s]+$/  // English characters
        },
        {
            name: 'Russian returns Russian from nd_courses',
            locale: 'ru',
            expectedField: 'title',
            expectedPattern: /[-/0-O]/  // Cyrillic characters
        },
        {
            name: 'Hebrew returns Hebrew from nd_courses',
            locale: 'he',
            expectedField: 'title',
            expectedPattern: /[\u0590-\u05FF]/  // Hebrew characters
        }
    ];

    for (const test of tests) {
        const response = await axios.get(`http://localhost:3000/api/courses?locale=${test.locale}`);
        const firstCourse = response.data.data.courses[0];

        assert(test.expectedPattern.test(firstCourse.title),
               `${test.name} failed: ${firstCourse.title}`);

        console.log(` ${test.name} passed`);
    }

    // Verify we're using nd_ tables
    console.log(' All translations from nd_courses table verified');
}

testNdTranslations().catch(console.error);
```

### Browser Console Verification
```javascript
// Run in browser console to verify nd_ tables
async function verifyNdTranslations() {
    const locales = ['en', 'ru', 'he'];
    const results = {};

    for (const locale of locales) {
        const response = await fetch(`/api/courses?locale=${locale}`);
        const data = await response.json();

        results[locale] = {
            success: data.success,
            coursesCount: data.data.courses?.length || 0,
            firstTitle: data.data.courses?.[0]?.title || 'N/A',
            hasTranslation: locale === 'en' || /[-/0-O]/.test(data.data.courses?.[0]?.title) || /[\u0590-\u05FF]/.test(data.data.courses?.[0]?.title)
        };
    }

    console.table(results);
    console.log('Data source: nd_courses table (NewDesign)');
}

verifyNdTranslations();
```

---

## =' Troubleshooting Guide

### Issue 1: No Russian/Hebrew Content Showing
```javascript
// Diagnosis
console.log('Current URL:', window.location.href);
console.log('Locale param:', new URLSearchParams(window.location.search).get('locale'));

// Check API response
fetch('/api/courses?locale=ru')
    .then(r => r.json())
    .then(d => console.log('API Response:', d));

// Solutions:
// 1. Verify locale is passed in URL: ?locale=ru
// 2. Check nd_courses has translations: SELECT title_ru FROM nd_courses;
// 3. Ensure API queries nd_courses, NOT courses table
// 4. Verify frontend passes locale to API call
```

### Issue 2: Always Shows English
```sql
-- Check if translations exist in nd_courses (NOT courses)
SELECT
    title,
    title_ru,
    title_he
FROM nd_courses  --  Check nd_ table
WHERE title_ru IS NOT NULL
   OR title_he IS NOT NULL;

-- If empty, add translations to nd_courses:
UPDATE nd_courses
SET title_ru = '0AB5@-:;0AA React 8 Redux'
WHERE id = 1;
```

### Issue 3: API Returns 500 Error
```javascript
// Check server logs
// Common issues:

// 1. Using wrong table (courses instead of nd_courses)
// Solution: Update API to use nd_courses
// FROM courses ’ FROM nd_courses

// 2. Column doesn't exist
// Solution: Ensure nd_courses schema matches query
ALTER TABLE nd_courses ADD COLUMN title_ru VARCHAR(255);

// 3. Database connection failed
// Solution: Check DATABASE_URL environment variable

// 4. Invalid SQL syntax
// Solution: Test query directly in psql
```

### Issue 4: Admin Changes Don't Appear
```javascript
// Clear frontend cache
localStorage.clear();
sessionStorage.clear();

// Force reload without cache
location.reload(true);

// Check nd_courses directly
// psql> SELECT * FROM nd_courses WHERE id = 1;

// Verify admin saves to nd_courses, not courses
// Check admin endpoint: should be /api/admin/nd/courses
```

### Issue 5: Mixed Languages on Page
```javascript
// This happens when some content from API, some hardcoded

// Solution: Ensure ALL text comes from API
// Wrong:
<h1>Welcome to Courses</h1>  // Hardcoded

// Right:
<h1 class="page-title"></h1>  // Populated from API

// In JavaScript:
document.querySelector('.page-title').textContent = data.ui['page.title'];
```

### Issue 6: Using Legacy Tables Instead of nd_ Tables
```sql
-- Check which tables are being queried
-- In PostgreSQL logs or add logging to API:

-- L WRONG: Query using legacy table
SELECT * FROM courses WHERE locale = 'ru';

--  CORRECT: Query using nd_ table
SELECT * FROM nd_courses WHERE visible = true;

-- Fix: Update all queries to use nd_ tables
-- Search and replace in server.js:
-- FROM courses ’ FROM nd_courses
-- FROM teachers ’ FROM nd_teachers
-- etc.
```

---

## = Migration from Other Systems

### From Legacy Tables to nd_ Tables
```sql
-- Migrate data from legacy courses to nd_courses
INSERT INTO nd_courses (title, description, price, category, visible)
SELECT title, description, price, category, visible
FROM courses
WHERE locale = 'en';  -- Get English versions

-- Add Russian translations
UPDATE nd_courses nc
SET title_ru = (
    SELECT title FROM courses c
    WHERE c.locale = 'ru'
    AND c.course_key = nc.course_key  -- Match by key if available
);

-- Add Hebrew translations
UPDATE nd_courses nc
SET title_he = (
    SELECT title FROM courses c
    WHERE c.locale = 'he'
    AND c.course_key = nc.course_key
);
```

### From data-i18n Attribute System
```javascript
// Step 1: Extract all translations
const translations = {};
document.querySelectorAll('[data-i18n]').forEach(el => {
    translations[el.dataset.i18n] = {
        en: el.textContent,
        ru: '', // To be filled
        he: ''  // To be filled
    };
});
console.log(JSON.stringify(translations, null, 2));

// Step 2: Import to nd_ui_translations (not ui_translations)
Object.entries(translations).forEach(([key, texts]) => {
    db.query(`
        INSERT INTO nd_ui_translations (page, element_key, text_en, text_ru, text_he)
        VALUES ('courses', $1, $2, $3, $4)
    `, [key, texts.en, texts.ru, texts.he]);
});

// Step 3: Remove data-i18n attributes from HTML
// Step 4: Implement API-based system as shown above
```

### From Static Files
```javascript
// If translations in JSON files:
// en.json: {"welcome": "Welcome"}
// ru.json: {"welcome": ">1@> ?>60;>20BL"}

// Import script to nd_ tables:
const en = require('./en.json');
const ru = require('./ru.json');
const he = require('./he.json');

Object.keys(en).forEach(key => {
    db.query(`
        INSERT INTO nd_ui_translations (element_key, text_en, text_ru, text_he)
        VALUES ($1, $2, $3, $4)
    `, [key, en[key], ru[key], he[key]]);
});
```

---

## ¡ Performance Optimization

### 1. Database Optimization
```sql
-- Index for locale queries on nd_ tables
CREATE INDEX idx_nd_courses_locale ON nd_courses(visible, published);
CREATE INDEX idx_nd_teachers_locale ON nd_teachers(is_active);

-- Materialized view for frequently accessed nd_courses translations
CREATE MATERIALIZED VIEW mv_nd_courses_translations AS
SELECT
    id,
    title, title_ru, title_he,
    description, description_ru, description_he,
    price, category
FROM nd_courses
WHERE visible = true AND published = true;

-- Refresh periodically
REFRESH MATERIALIZED VIEW mv_nd_courses_translations;
```

### 2. API Caching
```javascript
// Redis caching layer for nd_ tables
const redis = require('redis');
const client = redis.createClient();

app.get('/api/courses', async (req, res) => {
    const locale = getLocale(req);
    const cacheKey = `nd_courses:${locale}`;  // Note nd_ prefix

    // Check cache
    const cached = await client.get(cacheKey);
    if (cached) {
        return res.json(JSON.parse(cached));
    }

    // Fetch from nd_courses table
    const data = await fetchFromNdCourses(locale);

    // Cache for 5 minutes
    await client.setex(cacheKey, 300, JSON.stringify(data));

    res.json(data);
});
```

### 3. Frontend Optimization
```javascript
// Service Worker for offline support
self.addEventListener('fetch', event => {
    if (event.request.url.includes('/api/courses')) {
        event.respondWith(
            caches.match(event.request)
                .then(response => response || fetch(event.request))
        );
    }
});

// Lazy loading for images
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            observer.unobserve(img);
        }
    });
});

document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});
```

### 4. CDN Strategy
```javascript
// Serve static UI translations from CDN
const UI_TRANSLATIONS_CDN = 'https://cdn.aistudio.com/nd-translations';  // Note nd- prefix

async function loadUITranslations(locale) {
    const response = await fetch(`${UI_TRANSLATIONS_CDN}/${locale}.json`);
    return response.json();
}
```

---

##  Best Practices

### 1. Database Design
-  **DO**: Always use nd_ prefix for NewDesign tables
-  **DO**: Use NULL for missing translations (enables fallback)
-  **DO**: Add indexes on locale-related queries
-  **DO**: Use COALESCE for automatic fallback
- L **DON'T**: Create tables without nd_ prefix
- L **DON'T**: Mix legacy and nd_ tables in same query
- L **DON'T**: Store all languages in JSON field
- L **DON'T**: Create separate tables per language

### 2. API Design
-  **DO**: Accept locale as query parameter
-  **DO**: Return locale in response for verification
-  **DO**: Include UI translations with content
-  **DO**: Query only from nd_ tables
- L **DON'T**: Require separate calls for UI and content
- L **DON'T**: Use POST for read operations
- L **DON'T**: Mix queries between legacy and nd_ tables

### 3. Frontend Implementation
-  **DO**: Get locale from URL parameter
-  **DO**: Cache responses appropriately
-  **DO**: Handle errors gracefully
-  **DO**: Log which table data comes from (nd_courses)
- L **DON'T**: Hardcode any text in HTML
- L **DON'T**: Mix translation systems
- L **DON'T**: Assume legacy table structure

### 4. Admin Panel
-  **DO**: Show all language fields together
-  **DO**: Allow partial translations
-  **DO**: Provide preview per language
-  **DO**: Clearly indicate nd_ tables in UI
- L **DON'T**: Require all languages to save
- L **DON'T**: Hide translation fields
- L **DON'T**: Mix legacy and nd_ table management

### 5. Testing
-  **DO**: Test all supported locales
-  **DO**: Test fallback behavior
-  **DO**: Test with missing translations
-  **DO**: Verify data comes from nd_ tables
- L **DON'T**: Only test default language
- L **DON'T**: Assume translations exist
- L **DON'T**: Test against legacy tables

---

## =Ê Monitoring & Analytics

### Track Translation Usage
```javascript
// Add analytics for nd_ tables
app.get('/api/courses', async (req, res) => {
    const locale = getLocale(req);

    // Track usage
    await db.query(`
        INSERT INTO nd_translation_analytics (endpoint, locale, table_name, timestamp)
        VALUES ('courses', $1, 'nd_courses', NOW())
    `, [locale]);

    // ... rest of endpoint
});

// Analytics query
SELECT
    locale,
    table_name,
    COUNT(*) as requests,
    DATE(timestamp) as date
FROM nd_translation_analytics
WHERE table_name LIKE 'nd_%'  -- Only nd_ tables
GROUP BY locale, table_name, DATE(timestamp)
ORDER BY date DESC;
```

---

## <¯ Summary

### Why This Approach Wins

1. **Simplicity**: One API call gets everything from nd_ tables
2. **Maintainability**: Database-only changes in nd_ tables
3. **Scalability**: Add languages without code changes
4. **Admin-Friendly**: Content managers can add/edit translations
5. **Performance**: Efficient caching strategies
6. **Reliability**: Automatic fallback to English
7. **Organization**: Clear separation with nd_ prefix

### Key Success Factors

1. **Table Naming**: ALWAYS use nd_ prefix for NewDesign tables
2. **Database Schema**: Consistent pattern (field, field_ru, field_he)
3. **API Logic**: COALESCE for automatic fallback
4. **Frontend**: Simple fetch with locale parameter
5. **Admin Panel**: All languages in one form
6. **Testing**: Verify all locales work with nd_ tables

### Final Architecture
```
Admin Panel ’ nd_ Database Tables ’ API with Locale ’ Frontend Display
     “               “                    “                  “
Add Content    Store in nd_         Smart Query        Show Right
               tables only          with Fallback        Language
```

### Critical Rules
1. **ALWAYS use nd_ prefix** for NewDesign tables
2. **NEVER query legacy tables** (courses, teachers, etc.)
3. **ALWAYS check table names** in SQL queries
4. **DOCUMENT which tables** are being used

### Remember
**"The backend owns the translations in nd_ tables, the frontend just displays them"**

This approach eliminates the complexity of maintaining HTML attributes, JavaScript translation files, and manual updates. Everything flows from the nd_ database tables through the API to the frontend automatically.

---

## =Ú Quick Reference

### Add New Language (e.g., Spanish)
```sql
-- 1. Add columns to nd_ tables (NOT legacy tables)
ALTER TABLE nd_courses ADD COLUMN title_es VARCHAR(255);
ALTER TABLE nd_courses ADD COLUMN description_es TEXT;

-- 2. Update API query
WHEN $1 = 'es' THEN title_es

-- 3. Add to supported locales
const supportedLocales = ['en', 'ru', 'he', 'es'];

-- Done! No frontend changes needed
```

### Check Translation Coverage in nd_ Tables
```sql
-- Check coverage in nd_courses (NOT courses)
SELECT
    'nd_courses' as table_name,
    COUNT(*) as total_records,
    COUNT(title_ru) as russian_translations,
    COUNT(title_he) as hebrew_translations,
    ROUND(COUNT(title_ru)::numeric / COUNT(*)::numeric * 100, 2) as russian_coverage,
    ROUND(COUNT(title_he)::numeric / COUNT(*)::numeric * 100, 2) as hebrew_coverage
FROM nd_courses
WHERE visible = true;

-- Check all nd_ tables
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name LIKE 'nd_%'
ORDER BY table_name;
```

### Debug API Response
```javascript
// Browser console - verify nd_ table usage
fetch('/api/courses?locale=ru')
    .then(r => r.json())
    .then(d => {
        console.log('Success:', d.success);
        console.log('Locale:', d.locale);
        console.log('Courses from nd_courses:', d.data.courses);
        console.log('First course title:', d.data.courses[0]?.title);
        console.log('UI translations from nd_ui_translations:', d.data.ui);
        console.log('Data source: nd_courses table (NewDesign)');
    });
```

### Verify Correct Table Usage
```bash
# Check server logs for table names
grep -E "FROM (courses|nd_courses)" server.js

# Should see:
# FROM nd_courses 
# NOT FROM courses L

# Database query log
tail -f /var/log/postgresql/postgresql.log | grep -E "(courses|nd_courses)"
```

---

*Document Version: 1.1*
*Last Updated: September 2025*
*System: AI Studio Translation System - NewDesign (nd_) Tables*
*Approach: API-Based with nd_ Database Tables Only*
*Critical: ALL tables MUST use nd_ prefix for NewDesign system*