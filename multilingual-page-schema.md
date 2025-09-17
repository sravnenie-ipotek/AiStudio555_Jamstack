# Multilingual Page-Based Database Schema
## Each Table Supports EN, RU, HE Languages

### Executive Summary
**Total Tables Needed: 25 tables**
- Each table handles ALL 3 languages internally
- No separate tables per language
- Clean, simple, scalable

---

## 📄 MULTILINGUAL TABLE STRUCTURE

### Standard Structure for ALL Page Tables:
```sql
CREATE TABLE nd_[page_name]_page (
    id SERIAL PRIMARY KEY,
    section_name VARCHAR(100),      -- 'hero', 'features', 'awards', etc.
    content_en JSONB,               -- English content
    content_ru JSONB,               -- Russian content
    content_he JSONB,               -- Hebrew content
    visible BOOLEAN DEFAULT true,
    display_order INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(section_name)
);
```

---

## 🏠 EXAMPLE: nd_home_page Table

```sql
CREATE TABLE nd_home_page (
    id SERIAL PRIMARY KEY,
    section_name VARCHAR(100),
    content_en JSONB,
    content_ru JSONB,
    content_he JSONB,
    visible BOOLEAN DEFAULT true,
    display_order INTEGER,
    UNIQUE(section_name)
);

-- Sample data for hero section
INSERT INTO nd_home_page (section_name, content_en, content_ru, content_he, display_order) VALUES
('hero',
    '{"title": "Welcome to AI Studio", "subtitle": "Learn AI Today"}',
    '{"title": "Добро пожаловать в AI Studio", "subtitle": "Изучайте ИИ сегодня"}',
    '{"title": "ברוכים הבאים ל-AI Studio", "subtitle": "למדו AI היום"}',
    1
);

-- Sample data for awards section
INSERT INTO nd_home_page (section_name, content_en, content_ru, content_he, display_order) VALUES
('awards',
    '{
        "title": "Awards That Define Our Excellence.",
        "subtitle": "Recognition of our commitment",
        "items": [
            {"year": "2024", "title": "Best Online Platform", "description": "Awarded for innovation"},
            {"year": "2023", "title": "Top Education Provider", "description": "Excellence in teaching"}
        ]
    }',
    '{
        "title": "Награды, определяющие наше превосходство.",
        "subtitle": "Признание нашей приверженности",
        "items": [
            {"year": "2024", "title": "Лучшая онлайн платформа", "description": "Награда за инновации"},
            {"year": "2023", "title": "Лучший образовательный провайдер", "description": "Превосходство в обучении"}
        ]
    }',
    '{
        "title": "פרסים שמגדירים את המצוינות שלנו.",
        "subtitle": "הכרה במחויבות שלנו",
        "items": [
            {"year": "2024", "title": "הפלטפורמה המקוונת הטובה ביותר", "description": "פרס על חדשנות"},
            {"year": "2023", "title": "ספק החינוך המוביל", "description": "מצוינות בהוראה"}
        ]
    }',
    8
);
```

---

## 📊 HOW TO QUERY BY LANGUAGE

### Get all content for English:
```sql
SELECT section_name, content_en as content, visible, display_order
FROM nd_home_page
WHERE visible = true
ORDER BY display_order;
```

### Get all content for Russian:
```sql
SELECT section_name, content_ru as content, visible, display_order
FROM nd_home_page
WHERE visible = true
ORDER BY display_order;
```

### Get all content for Hebrew:
```sql
SELECT section_name, content_he as content, visible, display_order
FROM nd_home_page
WHERE visible = true
ORDER BY display_order;
```

### Dynamic language selection (API example):
```javascript
// API endpoint: GET /api/nd/home-page?locale=ru
const locale = req.query.locale || 'en';
const contentField = `content_${locale}`;

const query = `
    SELECT
        section_name,
        ${contentField} as content,
        visible,
        display_order
    FROM nd_home_page
    WHERE visible = true
    ORDER BY display_order
`;
```

---

## 📝 COMPLETE TABLE LIST (All Multilingual)

### Page Content Tables (18):
```sql
1.  nd_home_page          -- Landing page sections
2.  nd_about_page         -- About us sections
3.  nd_courses_page       -- Courses listing page
4.  nd_blog_page          -- Blog listing page
5.  nd_contact_page       -- Contact page sections
6.  nd_pricing_page       -- Pricing plans page
7.  nd_career_center_page -- Career center sections
8.  nd_career_orientation_page -- Career guidance
9.  nd_teachers_page      -- Instructors page
10. nd_checkout_page      -- Checkout flow
11. nd_order_confirmation_page -- Order success
12. nd_404_page           -- Not found page
13. nd_401_page           -- Unauthorized page
14. nd_detail_course_page -- Course detail template
15. nd_detail_blog_page   -- Blog post template
16. nd_detail_product_page -- Product template
17. nd_detail_category_page -- Category template
18. nd_paypal_checkout_page -- PayPal page
```

### Shared Data Tables (4):
```sql
19. nd_courses -- Actual course data
    - title_en, title_ru, title_he
    - description_en, description_ru, description_he
    - price, instructor, image, etc.

20. nd_blog_posts -- Blog post data
    - title_en, title_ru, title_he
    - content_en, content_ru, content_he
    - author, published_at, etc.

21. nd_users -- User accounts
    - email, name, preferred_language

22. nd_media -- Media library
    - url, alt_text_en, alt_text_ru, alt_text_he
```

### System Tables (3):
```sql
23. nd_navigation -- Menu items per language
    - items_en, items_ru, items_he

24. nd_footer -- Footer content per language
    - content_en, content_ru, content_he

25. nd_settings -- Global settings
    - key, value_en, value_ru, value_he
```

---

## 🎨 ADMIN PANEL HANDLING

### Language Switcher in Admin:
```javascript
// Admin saves all 3 languages at once
async function saveHomeContent() {
    const data = {
        section_name: 'hero',
        content_en: getFormData('en'),
        content_ru: getFormData('ru'),
        content_he: getFormData('he'),
        visible: true,
        display_order: 1
    };

    await fetch('/api/nd/home-page/hero', {
        method: 'PUT',
        body: JSON.stringify(data)
    });
}
```

### Admin Interface:
```html
<!-- Language tabs in admin -->
<div class="language-tabs">
    <button onclick="switchLang('en')">English</button>
    <button onclick="switchLang('ru')">Русский</button>
    <button onclick="switchLang('he')">עברית</button>
</div>

<!-- Same form, different language content -->
<div id="content-en" class="lang-content">
    <input type="text" id="title_en" placeholder="Title (English)">
    <textarea id="description_en" placeholder="Description (English)"></textarea>
</div>

<div id="content-ru" class="lang-content" style="display:none">
    <input type="text" id="title_ru" placeholder="Заголовок (Русский)">
    <textarea id="description_ru" placeholder="Описание (Русский)"></textarea>
</div>

<div id="content-he" class="lang-content" style="display:none">
    <input type="text" id="title_he" placeholder="כותרת (עברית)">
    <textarea id="description_he" placeholder="תיאור (עברית)"></textarea>
</div>
```

---

## ✅ BENEFITS OF THIS APPROACH

1. **Single Table Per Page** - Clean and simple
2. **All Languages Together** - Easy to manage translations
3. **Fallback Support** - If RU/HE is empty, use EN
4. **Consistent Structure** - All tables follow same pattern
5. **Easy Queries** - Just select the right content_xx field
6. **Admin Friendly** - Switch languages in same interface
7. **No Duplication** - Settings like visibility apply to all languages
8. **Performance** - One query gets all language versions
9. **Maintainable** - Add new language = add new column
10. **Backup Friendly** - One table has all translations

---

## 🔄 FALLBACK LOGIC

```sql
-- Get content with fallback to English if translation missing
SELECT
    section_name,
    COALESCE(
        NULLIF(content_ru, '{}'),  -- Use Russian if not empty
        content_en                  -- Fallback to English
    ) as content,
    visible,
    display_order
FROM nd_home_page
WHERE visible = true
ORDER BY display_order;
```

---

## 📊 DATABASE SIZE COMPARISON

### Old Approach (Separate Tables):
- 18 pages × 3 languages = 54 page tables
- Plus shared tables = 70+ tables total

### New Approach (Multilingual Columns):
- 18 page tables (each handles 3 languages)
- Plus shared tables = 25 tables total

**Result: 64% fewer tables, same functionality!**

---

## 🚀 IMPLEMENTATION EXAMPLE

### Creating a new page table:
```sql
CREATE TABLE nd_about_page (
    id SERIAL PRIMARY KEY,
    section_name VARCHAR(100) UNIQUE,
    content_en JSONB DEFAULT '{}',
    content_ru JSONB DEFAULT '{}',
    content_he JSONB DEFAULT '{}',
    visible BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX idx_about_visible ON nd_about_page(visible);
CREATE INDEX idx_about_order ON nd_about_page(display_order);
```

### Updating content for all languages:
```sql
UPDATE nd_home_page
SET
    content_en = '{"title": "New English Title"}',
    content_ru = '{"title": "Новый русский заголовок"}',
    content_he = '{"title": "כותרת חדשה בעברית"}',
    updated_at = NOW()
WHERE section_name = 'hero';
```

---

## CONCLUSION

**This multilingual page-based approach is the BEST solution:**
- ✅ 25 tables handle all 3 languages
- ✅ Clean, simple structure
- ✅ Easy to query and manage
- ✅ Admin panel can edit all languages
- ✅ Fallback support built-in
- ✅ Scalable (easy to add 4th language)

**Current Status:**
- ✅ nd_home_page exists (needs content_ru, content_he columns)
- ✅ System already supports locale parameter
- ⚠️ Need to migrate existing content to new schema
- ❌ Need to create remaining 23 tables

**Migration time: 1-2 weeks maximum!**

---

*Created: September 16, 2025*
*Multilingual Page-Based Architecture*