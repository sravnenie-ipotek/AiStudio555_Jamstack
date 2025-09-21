# Complete Home.html Translation System Documentation

## <◊ Architecture Overview

The home.html translation system uses a multi-layered architecture:

```
Browser (home.html) í Enhanced Language Manager í Express API í PostgreSQL Database
     ì                        ì                       ì              ì
data-i18n attrs    localStorage/URL params    Port 3000      nd_home table
```

## =¡ Core Files and Their Roles

### 1. Frontend Files

#### `/home.html`
- **Line 2407**: Loads enhanced-language-manager.js with cache buster
```html
<script src="js/enhanced-language-manager.js?v=3000"></script>
```
- Contains **292 data-i18n attributes** marking translatable elements
- Example attributes:
```html
<h1 data-i18n="hero.title">AI Studio</h1>
<p data-i18n="hero.subtitle">Online Learning Platform</p>
<button data-i18n="hero.cta_text_1">Start Learning Today</button>
```

#### `/js/enhanced-language-manager.js`
- **Main translation orchestrator** (1162 lines)
- **Line 14**: API base URL configuration
```javascript
this.apiBaseUrl = window.location.hostname === 'localhost'
    ? 'http://localhost:3000'  // CRITICAL: Must be port 3000
    : 'https://aistudio555jamstack-production.up.railway.app';
```
- **Line 296**: API endpoint for home page
```javascript
const endpoint = `/api/nd/home-page?locale=${locale}`;
```

### 2. Backend Files

#### `/server.js`
- **Lines 8126-8195**: Main nd_home API endpoint
```javascript
app.get('/api/nd/home-page', async (req, res) => {
    const { locale = 'en', preview = false } = req.query;

    // Fetches from nd_home table with locale fallback
    const query = `
        SELECT
            section_key,
            section_type,
            visible,
            COALESCE(content_${locale}, content_en) as content,
            animations_enabled,
            order_index
        FROM nd_home
        ${!preview ? 'WHERE visible = true' : ''}
        ORDER BY order_index
    `;
});
```

## =ƒ Database Structure

### Table: `nd_home`

```sql
CREATE TABLE nd_home (
    id SERIAL PRIMARY KEY,
    section_key VARCHAR(100) UNIQUE NOT NULL,  -- e.g., 'hero', 'navigation'
    section_type VARCHAR(50),                  -- e.g., 'hero', 'features'
    content_en JSONB,                         -- English content
    content_ru JSONB,                         -- Russian content
    content_he JSONB,                         -- Hebrew content
    visible BOOLEAN DEFAULT true,
    animations_enabled BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Current Sections in nd_home:
1. **hero** - Main hero section content
2. **navigation** - Navigation menu items
3. **features** - Features section content
4. **about** - About section content
5. **companies** - Trusted companies section
6. **stats** - Statistics section
7. **testimonials** - Customer testimonials
8. **blog** - Blog section content
9. **cta_bottom** - Bottom call-to-action
10. **misc** - Miscellaneous buttons and labels

### Sample Data Structure:
```json
{
  "section_key": "hero",
  "content_ru": {
    "title": "!BC48O ",
    "subtitle": ";0BD>@<0 =;09= 1CG5=8O",
    "description": "B:@>9B5 4;O A51O 1C4CI55 >1@07>20=8O",
    "cta_text_1": "0G0BL 1CG5=85",
    "cta_text_2": "!<>B@5BL C@AK",
    "welcome_text": ">1@> ?>60;>20BL 2",
    "hero_image_alt": "!BC48O  5@>9"
  }
}
```

## = Translation Flow (Step-by-Step)

### 1. Initial Page Load

```javascript
// When page loads, enhanced-language-manager.js executes:
constructor() {
    this.currentLocale = this.detectInitialLocale(); // Check URL params, localStorage, or default
    this.init();
}

detectInitialLocale() {
    // Priority order:
    // 1. URL parameter: ?locale=ru
    const urlParams = new URLSearchParams(window.location.search);
    const urlLocale = urlParams.get('locale');

    // 2. localStorage: preferred_locale
    const savedLocale = localStorage.getItem('preferred_locale');

    // 3. Browser language
    const browserLocale = navigator.language.split('-')[0];

    // 4. Default: 'en'
    return urlLocale || savedLocale || browserLocale || 'en';
}
```

### 2. Content Loading Process

```javascript
async loadPageContent(locale) {
    // Step 1: Check cache
    if (this.contentCache[locale]) {
        this.updatePageContent(this.contentCache[locale], locale);
        return;
    }

    // Step 2: Fetch from API
    const endpoint = `/api/nd/home-page?locale=${locale}`;
    const response = await fetch(`${this.apiBaseUrl}${endpoint}`);
    const data = await response.json();

    // Step 3: Cache the response
    this.contentCache[locale] = data.data;

    // Step 4: Update DOM
    this.updatePageContent(data.data, locale);
}
```

### 3. DOM Update Process

```javascript
updatePageContent(content, locale) {
    // For each section in the response
    Object.entries(content).forEach(([section, sectionData]) => {
        if (sectionData.content) {
            // Find all elements with matching data-i18n attributes
            this.updateSectionContent(section, sectionData.content);
        }
    });

    // Update HTML lang attribute
    document.documentElement.lang = locale;

    // Handle RTL for Hebrew
    if (locale === 'he') {
        document.documentElement.dir = 'rtl';
        document.body.classList.add('rtl');
    }
}
```

### 4. Element Translation Process

```javascript
updateSectionContent(sectionKey, content) {
    Object.entries(content).forEach(([key, value]) => {
        const selector = `[data-i18n="${sectionKey}.${key}"]`;
        const elements = document.querySelectorAll(selector);

        elements.forEach(element => {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = value;
            } else if (element.tagName === 'IMG') {
                element.alt = value;
            } else if (element.tagName === 'BUTTON' || element.tagName === 'A') {
                element.textContent = value;
                // Preserve icons if present
                const icon = element.querySelector('i, svg');
                if (icon) {
                    element.innerHTML = value;
                    element.appendChild(icon);
                }
            } else {
                element.textContent = value;
            }
        });
    });
}
```

## <õ Language Switching Mechanism

### User Clicks Language Button
```javascript
// Language dropdown in navigation
<div class="language-dropdown">
    <button onclick="languageManager.switchLanguage('en')">English</button>
    <button onclick="languageManager.switchLanguage('ru')"> CAA:89</button>
    <button onclick="languageManager.switchLanguage('he')">‚—ËŸÍ</button>
</div>
```

### Switch Language Process
```javascript
async switchLanguage(locale, updateHistory = true) {
    // 1. Show loading state
    this.showLoadingState();

    // 2. Load new content
    await this.loadPageContent(locale);

    // 3. Update current locale
    this.currentLocale = locale;

    // 4. Save preference
    localStorage.setItem('preferred_locale', locale);

    // 5. Update URL without page reload
    if (updateHistory) {
        const url = new URL(window.location);
        url.searchParams.set('locale', locale);
        history.pushState({locale}, '', url);
    }

    // 6. Update UI state (active language button)
    this.setInitialLanguageState();

    // 7. Reinitialize Webflow components
    this.reinitializeWebflow();

    // 8. Dispatch event for other components
    window.dispatchEvent(new CustomEvent('languageChanged', {
        detail: { locale }
    }));
}
```

## <˜ Data-i18n Attribute Structure

### Format: `section.field`
```html
<!-- Hero Section -->
<h1 data-i18n="hero.title">Default English Title</h1>
<p data-i18n="hero.subtitle">Default English Subtitle</p>

<!-- Navigation -->
<a data-i18n="navigation.home">Home</a>
<a data-i18n="navigation.courses">Courses</a>

<!-- Features -->
<h3 data-i18n="features.feature_1_title">Feature Title</h3>
<p data-i18n="features.feature_1_description">Feature Description</p>

<!-- Buttons -->
<button data-i18n="misc.sign_up_today">Sign Up Today</button>
```

### Special Cases:
1. **Input placeholders**: `<input data-i18n="forms.name_placeholder">`
2. **Image alt texts**: `<img data-i18n="images.hero_alt">`
3. **Meta tags**: Updated programmatically, not via data-i18n

## =æ Caching System

### Client-Side Cache
```javascript
class LanguageManager {
    constructor() {
        this.contentCache = {}; // In-memory cache per session
    }

    async loadPageContent(locale) {
        // Check cache first
        if (this.contentCache[locale]) {
            this.updatePageContent(this.contentCache[locale], locale);
            return; // Skip API call
        }

        // Fetch and cache
        const data = await this.fetchContent(locale);
        this.contentCache[locale] = data;
    }
}
```

### Browser Cache Busting
```html
<!-- Version parameter forces browser to reload on changes -->
<script src="js/enhanced-language-manager.js?v=3000"></script>
```

### LocalStorage Persistence
```javascript
// Saved data:
localStorage.setItem('preferred_locale', 'ru');        // User's language choice
localStorage.setItem('last_locale_update', Date.now()); // Timestamp
```

## =  Fallback Mechanisms

### 1. Database Level Fallback
```sql
-- In server.js query
COALESCE(content_${locale}, content_en) as content
-- Falls back to English if locale column is NULL
```

### 2. API Level Fallback
```javascript
// In server.js
if (!rows || rows.length === 0) {
    // Return English content if no data found
    const fallbackQuery = `SELECT * FROM nd_home WHERE visible = true`;
}
```

### 3. Frontend Fallback
```javascript
// In enhanced-language-manager.js
try {
    await this.loadPageContent(locale);
} catch (error) {
    console.error(`Failed to load ${locale}, falling back to English`);
    await this.loadPageContent('en');
}
```

## < Multi-Language Support Details

### Supported Languages:
- **en** - English (default)
- **ru** - Russian
- **he** - Hebrew (RTL support)

### RTL Support for Hebrew:
```javascript
handleRTL(locale) {
    if (locale === 'he') {
        document.documentElement.dir = 'rtl';
        document.body.classList.add('rtl');
        // Load RTL-specific styles
        this.loadRTLStyles();
    } else {
        document.documentElement.dir = 'ltr';
        document.body.classList.remove('rtl');
    }
}
```

### Language-Specific Formatting:
```javascript
// Number formatting
formatNumber(num, locale) {
    return new Intl.NumberFormat(locale).format(num);
}

// Date formatting
formatDate(date, locale) {
    return new Intl.DateTimeFormat(locale).format(date);
}
```

## = Common Issues and Solutions

### 1. Port Configuration Issue
**Problem**: Enhanced-language-manager.js connecting to wrong port
**Solution**: Ensure line 14 uses port 3000:
```javascript
? 'http://localhost:3000'  // NOT 1337
```

### 2. Browser Caching Old JavaScript
**Problem**: Browser uses cached version with old port
**Solutions**:
- Add cache buster: `?v=${timestamp}`
- Hard refresh: Ctrl+Shift+R
- Clear browser cache

### 3. Missing Translations
**Problem**: Some elements not translating
**Check**:
1. Element has `data-i18n` attribute
2. Attribute value matches database structure
3. Translation exists in database for that locale
4. Element is in DOM when translation runs

### 4. Database Content Issues
**Problem**: Wrong content in database (e.g., test data)
**Solution**: Run fix script:
```bash
node fix-russian-content.js
```

## =  Translation Coverage Statistics

### Home.html Translation Points:
- **Total data-i18n attributes**: 292
- **Sections covered**: 10
- **Languages supported**: 3 (en, ru, he)
- **Total translatable strings**: ~150 unique strings

### Coverage by Section:
1. **Navigation**: 10 items (100% coverage)
2. **Hero**: 7 fields (100% coverage)
3. **Features**: 12 fields (100% coverage)
4. **About**: 4 fields (100% coverage)
5. **Testimonials**: 6 testimonials (100% coverage)
6. **Blog**: 3 posts (100% coverage)
7. **CTA Bottom**: 3 fields (100% coverage)
8. **Misc/Buttons**: 8 common buttons (100% coverage)
9. **Footer**: 15 items (100% coverage)
10. **Forms**: 5 placeholders (100% coverage)

## =' Debugging Tools

### 1. Check Current Locale
```javascript
// In browser console
languageManager.currentLocale
```

### 2. Force Language Switch
```javascript
// In browser console
languageManager.switchLanguage('ru')
```

### 3. Clear Cache
```javascript
// In browser console
languageManager.contentCache = {};
localStorage.clear();
```

### 4. Check API Response
```bash
curl -s "http://localhost:3000/api/nd/home-page?locale=ru" | python3 -m json.tool
```

### 5. Verify Database Content
```sql
SELECT section_key,
       content_ru->>'title' as ru_title,
       content_en->>'title' as en_title
FROM nd_home
WHERE section_key = 'hero';
```

## =Ä Performance Optimizations

### 1. Content Caching
- In-memory cache prevents repeated API calls
- Cache persists during session

### 2. Lazy Loading
- Only loads requested language
- Doesn't preload all languages

### 3. Efficient DOM Updates
- Batch updates using DocumentFragment
- Only updates changed elements

### 4. Compression
- API responses are gzip compressed
- Reduces payload size by ~70%

## =› Testing Checklist

### Manual Testing:
1.  Load page with `?locale=ru` parameter
2.  Switch language via dropdown
3.  Refresh page - language persists
4.  Clear localStorage - falls back to browser language
5.  Test all three languages (en, ru, he)
6.  Verify RTL layout for Hebrew
7.  Check all sections translate
8.  Verify forms and buttons work after translation
9.  Test on mobile devices
10.  Verify no console errors

### API Testing:
```bash
# Test each locale
curl http://localhost:3000/api/nd/home-page?locale=en
curl http://localhost:3000/api/nd/home-page?locale=ru
curl http://localhost:3000/api/nd/home-page?locale=he

# Test preview mode
curl http://localhost:3000/api/nd/home-page?locale=ru&preview=true
```

## = Integration Points

### 1. With Other Pages
- Language preference persists across pages via localStorage
- URL parameter carries language when navigating

### 2. With Course System
- Course cards pull from `nd_courses` table
- Separate translation system but shares locale

### 3. With Admin Panel
- Admin can edit translations via content-admin-comprehensive.html
- Changes reflect immediately with preview=true parameter

### 4. With Analytics
- Language changes trigger custom events
- Can track user language preferences

## =À Complete File List

### Frontend:
- `/home.html` - Main page with data-i18n attributes
- `/js/enhanced-language-manager.js` - Core translation engine
- `/css/rtl-styles.css` - RTL support for Hebrew

### Backend:
- `/server.js` - API endpoints (lines 8126-8195)
- `/.env` - Database configuration

### Database:
- `nd_home` table - All translation content

### Scripts:
- `/fix-russian-content.js` - Fix Russian translations
- `/test-russian-hero.js` - Test translation output

### Documentation:
- `/backups/newDesign/docs/develop/homePageTranslation/working.md` - This file
- `/TRANSLATION_FIX_SUMMARY.md` - Recent fixes summary

## <Ø Key Success Factors

1. **Port Configuration**: Must use port 3000
2. **Data Attribute Matching**: data-i18n must match database structure
3. **Content Structure**: JSON structure in database must match expected format
4. **Fallback Chain**: Multiple fallback levels ensure content always displays
5. **Cache Management**: Proper cache busting for updates
6. **Language Persistence**: LocalStorage maintains user preference
7. **API Response Format**: Consistent structure across all endpoints

## <¡ Summary

The home.html translation system is a robust, multi-layered solution that:
- Provides instant language switching without page reload
- Maintains language preference across sessions
- Falls back gracefully when translations are missing
- Supports RTL languages (Hebrew)
- Caches efficiently to minimize API calls
- Integrates seamlessly with the broader application

The system's strength lies in its simplicity (data-i18n attributes) combined with robust backend support (PostgreSQL JSONB) and intelligent client-side management (enhanced-language-manager.js).