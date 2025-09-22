# < Translation System Implementation Guide
## Complete Working Logic for Multi-Language Support

**Document Created:** 2025-09-21
**Last Updated:** 2025-09-22
**Purpose:** Generic instruction guide for implementing translations on ANY page
**System:** Unified Language Manager with Railway PostgreSQL Database
**Database Reference:** See `/backups/newDesign/docs/db.md` for complete table structure

---

## <� Architecture Overview

### Translation Flow
```
User Clicks Language � Unified Language Manager � API Request � Database � JSON Response � DOM Update
     (RU/HE)         �  (language-manager.js)  � (?locale=ru) � (nd_tables) � (data.section) � (data-i18n)
```

### Key Components
1. **Frontend**: HTML with `data-i18n` attributes
2. **JavaScript**: Unified Language Manager (`/js/unified-language-manager.js`)
3. **API Server**: Express.js on port 1337 (local) / Railway auto-assigned (production)
4. **Database**: Railway PostgreSQL with `nd_` prefixed tables (see `/backups/newDesign/docs/db.md`)
5. **Admin Panel**: `admin-nd.html` (centralized admin system)

---

## 🗂️ Database Structure Overview

**Complete Reference**: See `/backups/newDesign/docs/db.md` for full database documentation

### Page-Based Architecture
The system uses **30+ active tables** with `nd_` prefix following this pattern:

1. **Page Content Tables** - Store UI translations and page sections
   - Format: `nd_[pagename]_page` (e.g., `nd_courses_page`, `nd_pricing_page`)
   - Columns: `content_en`, `content_ru`, `content_he` (JSONB)
   - Purpose: UI text, buttons, labels, headers

2. **Entity Data Tables** - Store actual content records
   - Format: `nd_[entityname]` (e.g., `nd_courses`, `nd_teachers`)
   - Purpose: Course data, teacher profiles, blog posts

3. **System Tables** - Global components
   - `nd_menu` - Navigation menu items
   - `nd_footer` - Footer content
   - `nd_settings` - System configuration

### API Endpoint Pattern
```
Page Content: /api/nd/[pagename]-page?locale={en|ru|he}
Entity Data:  /api/nd/[entityname]?locale={en|ru|he}
Admin APIs:   PUT /api/nd/[pagename]-page/:section
```

**Examples**:
- `/api/nd/home-page?locale=ru` → `nd_home` table
- `/api/nd/courses-page?locale=he` → `nd_courses_page` table
- `/api/nd/courses?locale=en` → `nd_courses` table
- `/api/nd/teachers-page?locale=ru` → `nd_teachers_page` table

---

## =� Step-by-Step Implementation Guide

### STEP 1: Analyze Current Page Translation Status

#### 1.1 Run Translation Audit
```bash
# Create audit script for any page (replace [PAGENAME] with actual page)
cat > audit-[PAGENAME].js << 'EOF'
const { chromium } = require('@playwright/test');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    // IMPORTANT: Replace [PAGENAME] with your actual page name
    await page.goto('http://localhost:3005/[PAGENAME].html');
    await page.waitForTimeout(1000);

    const coverage = await page.evaluate(() => {
        const allTextElements = Array.from(document.querySelectorAll('a, h1, h2, h3, h4, p, span, div, button'))
            .filter(el => {
                const text = el.textContent.trim();
                return text && text.length > 2 && !el.querySelector('*') && !/^[0-9]+$/.test(text);
            });

        const withI18n = allTextElements.filter(el => el.hasAttribute('data-i18n'));
        const withoutI18n = allTextElements.filter(el => !el.hasAttribute('data-i18n'));

        return {
            total: allTextElements.length,
            withI18n: withI18n.length,
            withoutI18n: withoutI18n.length,
            coverage: Math.round((withI18n.length / allTextElements.length) * 100),
            missingExamples: withoutI18n.slice(0, 20).map(el => ({
                text: el.textContent.trim().substring(0, 50),
                tagName: el.tagName.toLowerCase(),
                className: el.className
            }))
        };
    });

    console.log('=� Translation Coverage Analysis:');
    console.log(`  Total translatable elements: ${coverage.total}`);
    console.log(`  Elements WITH data-i18n: ${coverage.withI18n}`);
    console.log(`  Elements WITHOUT data-i18n: ${coverage.withoutI18n}`);
    console.log(`  Coverage: ${coverage.coverage}%\n`);

    console.log('=� Examples of Untranslated Elements:');
    coverage.missingExamples.forEach(el => {
        console.log(`  <${el.tagName}> "${el.text}" (class: ${el.className})`);
    });

    // Test language switch
    await page.click('.lang-pill:has-text("RU")');
    await page.waitForTimeout(2000);

    const russianCount = await page.evaluate(() => {
        const hasRussian = (text) => /[-/0-O]/.test(text);
        return Array.from(document.querySelectorAll('*')).filter(el => {
            const text = el.textContent.trim();
            return text && hasRussian(text) && !el.querySelector('*');
        }).length;
    });

    console.log(`\n Russian elements after switch: ${russianCount}`);

    await browser.close();
})();
EOF

# Run the audit (replace [PAGENAME] with actual page name)
node audit-[PAGENAME].js
```

#### 1.2 Identify Missing Elements
Look for patterns in the output:
- Navigation elements without data-i18n
- Section titles/subtitles
- Button text
- Form labels
- Footer content
- Dynamic content placeholders

---

### STEP 2: Check Database Structure

#### 2.1 Determine Which Table Your Page Uses

**Reference**: See `/backups/newDesign/docs/db.md` for complete Screen-to-Table mapping

```bash
# Check available nd_ tables for your page
curl -s "http://localhost:1337/api/nd/[endpoint]?locale=en" | jq 'keys'
```

**Complete Page-to-Endpoint Mapping** (from db.md):
- `home.html` → `/api/nd/home-page` → `nd_home` table
- `courses.html` → `/api/nd/courses-page` + `/api/nd/courses` → `nd_courses_page` + `nd_courses` tables
- `pricing.html` → `/api/nd/pricing-page` → `nd_pricing_page` table
- `teachers.html` → `/api/nd/teachers-page` + `/api/teachers` → `nd_teachers_page` + `teachers` tables
- `about-us.html` → `/api/nd/about-page` → `nd_about_page` table
- `blog.html` → `/api/blog-posts` → `blog_posts` table
- `contact-us.html` → `/api/nd/contact-page` → `nd_contact_page` table
- `career-center.html` → `/api/career-center-page` → `career_center_pages` table
- `career-orientation.html` → `/api/career-orientation-page` → `career_orientation_pages` table
- `detail_courses.html` → `/api/nd/course-details-page` → `nd_course_details_page` table

#### 2.2 Examine API Response Structure

```bash
# Get English version to see structure
curl -s "http://localhost:1337/api/nd/[endpoint]?locale=en" | jq '.' > api_structure_en.json

# Get Russian version to find missing translations
curl -s "http://localhost:1337/api/nd/[endpoint]?locale=ru" | jq '.' > api_structure_ru.json

# Compare to find missing sections
diff api_structure_en.json api_structure_ru.json
```

#### 2.3 Understand Data Structure Pattern
```javascript
// API Response Structure
{
  "data": {
    "section_name": {
      "visible": true,
      "type": "section_type",
      "content": {
        // Simple structure
        "title": "Text",
        "subtitle": "Text",

        // OR nested structure (common!)
        "content": {
          "title": "Text",
          "items": [...]
        }
      }
    }
  }
}
```

**� CRITICAL:** Many sections use double nesting: `section.content.content.field`

---

### STEP 3: Add Missing data-i18n Attributes

#### 3.1 Understand data-i18n Path Structure

```html
<!-- Pattern: section.content[.content].field -->

<!-- Simple structure -->
<h2 data-i18n="hero.content.title">Title Text</h2>

<!-- Nested structure (with double content) -->
<h2 data-i18n="awards.content.content.title">Awards Title</h2>

<!-- Array items -->
<p data-i18n="faq.content.content.items.0.question">First Question</p>
<p data-i18n="faq.content.content.items.0.answer">First Answer</p>

<!-- Object properties -->
<div data-i18n="pricing.content.features.community_support">Community Support</div>
```

#### 3.2 Common Patterns to Look For

```javascript
// Elements that commonly need data-i18n
const patternsToFind = [
  // Sections
  { selector: '.section-title', path: '[section].content.title' },
  { selector: '.section-subtitle', path: '[section].content.subtitle' },
  { selector: '.section-description-text', path: '[section].content.description' },

  // Buttons
  { selector: '.primary-button-text-block', path: 'ui.content.buttons.[action]' },
  { selector: '.cta-button', path: 'cta.content.button_text' },

  // Navigation
  { selector: '.nav-link', path: 'navigation.content.items.[index].text' },
  { selector: '.dropdown-link', path: 'navigation.content.career.[type]' },

  // Forms
  { selector: 'label', path: 'contact.content.form.[field]_label' },
  { selector: 'input[placeholder]', attribute: 'data-i18n-placeholder', path: 'contact.content.form.[field]_placeholder' },

  // Footer
  { selector: '.footer-menu-title', path: 'footer.content.menus.[index].title' },
  { selector: '.footer-link', path: 'footer.content.menus.[index].items.[index].text' },

  // Cards/Items
  { selector: '.card-title', path: '[section].content.items.[index].title' },
  { selector: '.card-description', path: '[section].content.items.[index].description' }
];
```

#### 3.3 Bulk Addition Strategy

```javascript
// Use MultiEdit for efficiency
const editsToApply = [
  {
    old_string: '<div class="section-subtitle">Affordable Plans</div>',
    new_string: '<div class="section-subtitle" data-i18n="pricing.content.subtitle">Affordable Plans</div>'
  },
  // Add all with replace_all: true for repeated elements
  {
    old_string: 'class="primary-button-text-block">Explore Features</div>',
    new_string: 'class="primary-button-text-block" data-i18n="misc.content.explore_plans">Explore Features</div>',
    replace_all: true
  }
];
```

---

### STEP 4: Fix Database Content

#### 4.1 Check What's Missing in Russian/Hebrew

```bash
# Find undefined translations
curl -s "http://localhost:1337/api/nd/[endpoint]?locale=ru" | grep -o '"[^"]*": null' | sort | uniq

# Test specific path
curl -s "http://localhost:1337/api/nd/[endpoint]?locale=ru" | jq '.data.section.content.field'
```

#### 4.2 Update Missing Translations via API

```bash
# Update section with proper structure
curl -X PUT "http://localhost:1337/api/nd/[endpoint]/[section]" \
  -H "Content-Type: application/json" \
  -d '{
    "content_ru": {
      "title": "03>;>2>: =0 @CAA:><",
      "subtitle": ">4703>;>2>:",
      "description": "?8A0=85",
      "items": [
        {"name": "-;5<5=B 1", "description": "?8A0=85 M;5<5=B0"}
      ]
    }
  }'

# For Hebrew (note: RTL language)
curl -X PUT "http://localhost:1337/api/nd/[endpoint]/[section]" \
  -H "Content-Type: application/json" \
  -d '{
    "content_he": {
      "title": "����� ������",
      "subtitle": "����� ����"
    }
  }'
```

#### 4.3 Common Missing Translations to Add

```javascript
// Russian translations commonly missing
const commonRussianTranslations = {
  // UI Labels
  "ui": {
    "labels": {
      "all": "A5",
      "search": ">8A:",
      "filter": "$8;LB@",
      "sort": "!>@B8@>2:0",
      "loading": "03@C7:0...",
      "error": "H81:0",
      "success": "#A?5H=>",
      "beginner": "0G8=0NI89",
      "intermediate": "!@54=89",
      "advanced": "@>428=CBK9"
    },
    "buttons": {
      "submit": "B?@028BL",
      "cancel": "B<5=0",
      "save": "!>E@0=8BL",
      "delete": "#40;8BL",
      "edit": " 540:B8@>20BL",
      "view": "@>A<>B@5BL",
      "download": "!:0G0BL",
      "upload": "03@C78BL",
      "next": "0;55",
      "previous": "0704",
      "learn_more": "#7=0BL 1>;LH5",
      "get_started": "0G0BL",
      "contact_us": "!2O70BLAO",
      "sign_up": " 538AB@0F8O",
      "sign_in": ">9B8"
    },
    "messages": {
      "no_items": "-;5<5=BK =5 =0945=K",
      "no_results": " 57C;LB0BK =5 =0945=K",
      "loading": "03@C7:0...",
      "error": "@>87>H;0 >H81:0",
      "success": "?5@0F8O 2K?>;=5=0 CA?5H=>"
    }
  },

  // Form Fields
  "forms": {
    "labels": {
      "name": "<O",
      "email": "-;5:B@>==0O ?>GB0",
      "phone": ""5;5D>=",
      "message": "!>>1I5=85",
      "subject": ""5<0",
      "company": "><?0=8O",
      "position": ">;6=>ABL"
    },
    "placeholders": {
      "enter_name": "2548B5 20H5 8<O",
      "enter_email": "2548B5 email",
      "enter_phone": "2548B5 B5;5D>=",
      "enter_message": "2548B5 A>>1I5=85"
    },
    "validation": {
      "required": "-B> ?>;5 >1O70B5;L=>",
      "invalid_email": "525@=K9 D>@<0B email",
      "invalid_phone": "525@=K9 D>@<0B B5;5D>=0"
    }
  },

  // Navigation
  "navigation": {
    "main": {
      "home": ";02=0O",
      "about": " =0A",
      "services": "#A;C38",
      "portfolio": ">@BD>;8>",
      "blog": ";>3",
      "contact": ">=B0:BK"
    },
    "footer": {
      "privacy": ">;8B8:0 :>=D845=F80;L=>AB8",
      "terms": "#A;>28O 8A?>;L7>20=8O",
      "sitemap": "0@B0 A09B0"
    }
  },

  // Common Sections
  "common": {
    "hero": {
      "welcome": ">1@> ?>60;>20BL",
      "learn_more": "#7=0BL 1>;LH5",
      "get_started": "0G0BL"
    },
    "features": {
      "title": "0H8 @58<CI5AB20",
      "subtitle": ">G5<C 2K18@0NB =0A"
    },
    "testimonials": {
      "title": "B7K2K :;85=B>2",
      "subtitle": "'B> 3>2>@OB > =0A"
    },
    "faq": {
      "title": "'0AB> 7040205<K5 2>?@>AK",
      "subtitle": "B25BK =0 ?>?C;O@=K5 2>?@>AK"
    },
    "cta": {
      "title": ">B>2K =0G0BL?",
      "subtitle": "!2O68B5AL A =0<8 A53>4=O",
      "button": "!2O70BLAO"
    }
  }
};
```

---

### STEP 5: Debug Common Issues

#### 5.1 Hebrew Shows Instead of Russian

**Problem:** Missing Russian translation causes fallback to Hebrew
**Solution:**
```bash
# Check what's in Hebrew but not Russian
curl -s "http://localhost:1337/api/nd/[endpoint]?locale=he" | jq '.data.section' > hebrew.json
curl -s "http://localhost:1337/api/nd/[endpoint]?locale=ru" | jq '.data.section' > russian.json
# If Russian returns null but Hebrew has content, add Russian translation
```

#### 5.2 "undefined" in Console

**Problem:** Wrong API path in data-i18n
**Debug Steps:**
```javascript
// In browser console
document.querySelectorAll('[data-i18n*="undefined"]').forEach(el => {
  console.log('Element:', el);
  console.log('Path:', el.getAttribute('data-i18n'));
});

// Check if path exists in API
fetch('http://localhost:1337/api/nd/[endpoint]?locale=ru')
  .then(r => r.json())
  .then(data => {
    // Navigate through the path
    console.log(data.data.section.content);
  });
```

#### 5.3 Double "content" Issue

**Pattern Recognition:**
```javascript
// WRONG (common mistake)
data-i18n="awards.content.title"

// CORRECT (many sections have double nesting)
data-i18n="awards.content.content.title"

// How to verify:
// Check API response - if you see this structure:
{
  "awards": {
    "content": {
      "content": {  // <- Double content!
        "title": "..."
      }
    }
  }
}
// Then you need: awards.content.content.title
```

#### 5.4 Dynamic Content Not Translating

**For Webflow Collections (courses, teachers, blog):**
```javascript
// These need different handling
// 1. Check if using w-dyn-bind
<div class="course-name w-dyn-bind-empty"></div>

// 2. These get data from different endpoints
// courses � /api/nd/courses
// teachers � /api/nd/teachers
// blog � /api/nd/blog-posts

// 3. May need separate translation logic in JavaScript
```

---

### STEP 6: Testing & Verification

#### 6.1 Quick Test Script

```javascript
// quick-test-[page].js
const { chromium } = require('@playwright/test');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto('http://localhost:3005/[yourpage].html');
    await page.waitForTimeout(2000);

    // Test each language
    for (const lang of ['RU', 'HE']) {
        await page.click(`.lang-pill:has-text("${lang}")`);
        await page.waitForTimeout(2000);

        const result = await page.evaluate((targetLang) => {
            const patterns = {
                'RU': /[-/0-O]/,
                'HE': /[\u0590-\u05FF]/
            };

            const hasLang = (text) => patterns[targetLang].test(text);

            return {
                total: Array.from(document.querySelectorAll('*'))
                    .filter(el => {
                        const text = el.textContent.trim();
                        return text && hasLang(text) && !el.querySelector('*');
                    }).length
            };
        }, lang);

        console.log(`${lang} elements: ${result.total}`);
    }

    await browser.close();
})();
```

#### 6.2 Comprehensive Validation

```bash
# 1. Check coverage percentage
node audit-[page].js | grep "Coverage:"

# 2. Check for undefined errors
# Open browser console and look for:
# "Found translation for X: undefined"

# 3. Verify critical elements
# - Navigation fully translated
# - Hero/CTA sections translated
# - Forms have translated labels
# - Footer fully translated
# - No Hebrew when Russian selected

# 4. Check database completeness
curl -s "http://localhost:1337/api/nd/[endpoint]?locale=ru" | \
  jq '[.. | select(type == "null")] | length'
# Should return 0 or very low number
```

---

### STEP 7: SQL Templates for Missing Translations

#### 7.1 For nd_home Table

```sql
-- Update specific section (most common approach)
UPDATE nd_home
SET content_ru = jsonb_set(
  COALESCE(content_ru, '{}'),
  '{section_name,content,field}',
  '"Translated Text"'::jsonb
)
WHERE section_key = 'section_name';

-- Add complex nested structure
UPDATE nd_home
SET content_ru = jsonb_set(
  COALESCE(content_ru, '{}'),
  '{items}',
  '[
    {"title": "03>;>2>: 1", "description": "?8A0=85 1"},
    {"title": "03>;>2>: 2", "description": "?8A0=85 2"}
  ]'::jsonb
)
WHERE section_key = 'section_name';
```

#### 7.2 For nd_courses Table

```sql
-- Update course translations
UPDATE nd_courses
SET
  name_ru = '0720=85 :C@A0',
  description_ru = '?8A0=85 :C@A0',
  content_ru = jsonb_build_object(
    'modules', jsonb_build_array(
      jsonb_build_object('title', '>4C;L 1', 'description', '?8A0=85 <>4C;O')
    ),
    'requirements', '"@51>20=8O : :C@AC',
    'outcomes', ' 57C;LB0BK >1CG5=8O'
  )
WHERE id = 1;
```

#### 7.3 For Other Tables

```sql
-- Generic pattern for any nd_ table
UPDATE nd_[table_name]
SET content = jsonb_set(
  content,
  '{ru}',  -- or '{locale,ru}' depending on structure
  '{
    "field1": "5@52>4 1",
    "field2": "5@52>4 2",
    "nested": {
      "subfield": ";>65==K9 ?5@52>4"
    }
  }'::jsonb
)
WHERE id = [record_id];
```

---

### STEP 8: Checklist for Each Page

#### Pre-Implementation
- [ ] Run audit script to get baseline coverage %
- [ ] Identify which API endpoint the page uses
- [ ] Check database for missing Russian/Hebrew content
- [ ] List all untranslated elements by priority

#### Implementation
- [ ] Add data-i18n attributes to all static text
- [ ] Fix any wrong API paths (double content issue)
- [ ] Update database with missing translations
- [ ] Handle dynamic content separately if needed

#### Validation
- [ ] Coverage reaches 85%+
- [ ] No "undefined" in console
- [ ] Russian shows Russian (not Hebrew)
- [ ] Hebrew shows Hebrew (with RTL)
- [ ] All navigation translated
- [ ] All buttons translated
- [ ] All forms translated
- [ ] Footer fully translated

#### Documentation
- [ ] Document any page-specific issues
- [ ] Note any custom JavaScript needed
- [ ] Record final coverage percentage
- [ ] List any remaining untranslated elements

---

## =� Critical Points to Remember

1. **Double Content Pattern**: Many sections use `section.content.content.field`
2. **Hebrew Fallback**: Missing Russian causes Hebrew to show
3. **Dynamic Content**: Courses/Teachers use different endpoints
4. **Replace All**: Use for repeated elements (buttons, labels)
5. **API Structure**: Always check actual API response structure
6. **Test Immediately**: Verify after each change
7. **Database Updates**: Use content_ru, content_he, not just content

---

## 🏗️ Table Structure Reference

### Standard Page Table Structure (from db.md)
```sql
CREATE TABLE nd_[pagename]_page (
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

### Entity Table Structure Examples
```sql
-- Courses table
CREATE TABLE nd_courses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    title_ru VARCHAR(255),
    title_he VARCHAR(255),
    description TEXT,
    price DECIMAL(10,2),
    instructor VARCHAR(255),
    image VARCHAR(500), -- Overridden by static images
    category VARCHAR(100),
    rating DECIMAL(2,1),
    visible BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Teachers table
CREATE TABLE teachers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    title VARCHAR(255),
    bio TEXT,
    image_url VARCHAR(500), -- Overridden by static images
    expertise VARCHAR(255),
    category VARCHAR(100),
    experience VARCHAR(255),
    specialties TEXT,
    company VARCHAR(255),
    linkedin_url VARCHAR(500),
    github_url VARCHAR(500),
    locale VARCHAR(5) DEFAULT 'en',
    published_at TIMESTAMP
);
```

### If Table Doesn't Exist - Create Following This Pattern:
1. **Check db.md** for existing table structure
2. **Follow naming convention**: `nd_[pagename]_page` for page content
3. **Use standard columns**: `content_en`, `content_ru`, `content_he` as JSONB
4. **Create sections**: Each page section gets a row with unique `section_key`
5. **Update API**: Add endpoint in server.js following `/api/nd/[pagename]-page` pattern

**Example Creation Script**:
```sql
-- If creating new page table (replace [PAGENAME] with actual name)
INSERT INTO nd_[PAGENAME]_page (section_key, section_type, content_en, content_ru, content_he, visible) VALUES
('hero', 'hero_section', '{"title": "Hero Title", "subtitle": "Hero Subtitle"}', NULL, NULL, true),
('features', 'features_section', '{"title": "Features", "items": []}', NULL, NULL, true),
('cta', 'cta_section', '{"title": "Call to Action", "button": "Get Started"}', NULL, NULL, true);
```

---

## =� Quick Reference Commands

```bash
# Check API structure
curl -s "http://localhost:1337/api/nd/[endpoint]?locale=ru" | jq '.'

# Find missing translations
curl -s "http://localhost:1337/api/nd/[endpoint]?locale=ru" | grep -o 'null' | wc -l

# Update section
curl -X PUT "http://localhost:1337/api/nd/[endpoint]/[section]" \
  -H "Content-Type: application/json" \
  -d '{"content_ru": {...}}'

# Test coverage
node audit-[page].js | grep "Coverage:"

# Check for errors
# Browser console: Look for "undefined" translations
```

---

## <� Target Metrics

- **Minimum Coverage**: 85%
- **Optimal Coverage**: 90-95%
- **Russian Elements**: 150+ for content pages
- **Console Errors**: 0 undefined translations
- **User Experience**: Seamless language switching

---

## 📋 Implementation Checklist for Any Page

### Essential Requirements
- [ ] **Include Unified Language Manager**: Add `<script src="js/unified-language-manager.js?v=3000"></script>` to page
- [ ] **Add Language Pills**: Include EN/RU/HE language switcher in navigation
- [ ] **Data-i18n Attributes**: Add `data-i18n` attributes to all translatable elements
- [ ] **Database Table**: Ensure table exists following `nd_[pagename]_page` pattern
- [ ] **API Endpoint**: Create `/api/nd/[pagename]-page` endpoint in server.js
- [ ] **Reference db.md**: Check complete database documentation for table structure

### Validation Checklist
- [ ] Translation coverage reaches 85%+
- [ ] No "undefined" translations in console
- [ ] Russian shows Russian text (not Hebrew)
- [ ] Hebrew shows Hebrew text with RTL
- [ ] All navigation items translated
- [ ] All buttons and forms translated
- [ ] Database has content_ru and content_he populated

### Database Reference
**See**: `/backups/newDesign/docs/db.md` for:
- Complete Screen-to-Table mapping
- Full API endpoint list
- Table creation scripts
- Entity relationship structure
- 30+ active table documentation

---

*Use this guide for ANY page in the system. The patterns are consistent across all pages.*
*All tables and endpoints follow the documented patterns in `/backups/newDesign/docs/db.md`*