# Screen to Database Table Mapping

**Last Updated:** September 12, 2025  
**Status:** ✅ Russian Translations Active | UI System Fixed

## Main Pages → Tables

| Screen | Table | API Endpoint | Status |
|--------|-------|--------------|---------|
| Home | `home_pages` | `/api/home-page` | ✅ Active |
| Courses List | `courses` | `/api/courses` | ✅ Active |
| Course Detail | `courses` | `/api/courses/:id` | ✅ Active |
| Teachers | `teachers` | `/api/teachers` | ✅ Active |
| Blog | `blog_posts` | `/api/blog-posts` | ✅ Active |
| Career Center | `career_center_pages` | `/api/career-center-page` | ✅ Active |
| Career Orientation | `career_orientation_pages` | `/api/career-orientation-page` | ✅ Active |
| About Us | `about_pages` | `/api/about-page` | ⚠️ Limited |
| Contact | `contact_pages` | `/api/contact-page` | ⚠️ Limited |
| Pricing | ❌ NO TABLE | - | Static HTML |
| Checkout | ❌ NO TABLE | - | Not Implemented |

## Career System → Tables

| Screen | Table | Purpose |
|--------|-------|---------|
| Career Assessment Form | `career_orientation_assessment_responses` | Store user submissions |
| Career Resources | `career_resources` | Career content/articles |
| Job Postings | `job_postings` | Job listings |

## Admin Pages → Tables

| Screen | Table | Purpose |
|--------|-------|---------|
| Admin Panel | `admin_users`, `admin_roles`, `admin_permissions` | Admin auth |
| Content Admin | All content tables | Edit content |
| User Login/Signup | `up_users`, `up_roles`, `up_permissions` | User auth |

## Global Components → Tables

| Component | Table | Used On | Status |
|-----------|-------|---------|---------|
| Navigation | `home_pages` (UI fields) | All pages | ✅ Active |
| Footer | `home_pages` (footer fields) | All pages | ⚠️ Needs Implementation |
| Site Settings | `site_settings` | All pages | ⚠️ Limited |
| Statistics | `home_pages` (stats fields) | Home | ✅ Active |
| Button Texts | `home_pages` (btn fields) | All pages | ✅ Active |
| Company Logos | `company_logos` | Home | ⚠️ Static |
| Page Meta/SEO | `page_meta` | All pages | ⚠️ Limited |
| FAQs | `faqs` | Multiple pages | ❌ Not Active |

## UI Translation System (✅ FIXED September 2025)

### Navigation Fields (`home_pages` table)
All fields use **snake_case** naming (PostgreSQL convention):

| UI Element | Database Column | Russian Translation | Status |
|------------|-----------------|-------------------|---------|
| Home | `nav_home` | Главная | ✅ Active |
| Courses | `nav_courses` | Курсы | ✅ Active |
| Teachers | `nav_teachers` | Преподаватели | ✅ Active |
| Blog | `nav_blog` | Блог | ✅ Active |
| Career Center | `nav_career_center` | Карьерный центр | ✅ Active |
| About Us | `nav_about` | О нас | ✅ Active |
| Contact | `nav_contact` | Контакты | ✅ Active |
| Pricing | `nav_pricing` | Цены | ✅ Active |

### Button Translations (`home_pages` table)

| Button | Database Column | Russian Translation | Status |
|--------|-----------------|-------------------|---------|
| Sign Up Today | `btn_sign_up_today` | Записаться сегодня | ✅ Active |
| Learn More | `btn_learn_more` | Узнать больше | ✅ Active |
| View All Courses | `btn_view_all_courses` | Посмотреть все курсы | ✅ Active |
| Get Started | `btn_get_started` | Начать | ✅ Active |
| Contact Us | `btn_contact_us` | Связаться с нами | ✅ Active |
| Enroll Now | `btn_enroll_now` | Записаться сейчас | ✅ Active |

### Form Labels (`home_pages` table)

| Label | Database Column | Russian Translation | Status |
|-------|-----------------|-------------------|---------|
| Email | `form_label_email` | Электронная почта | ✅ Active |
| Name | `form_label_name` | Имя | ✅ Active |
| Phone | `form_label_phone` | Телефон | ✅ Active |
| Message | `form_label_message` | Сообщение | ✅ Active |
| Submit | `form_btn_submit` | Отправить | ✅ Active |

### Statistics Labels (`home_pages` table)

| Stat | Database Column | Russian Translation | Status |
|------|-----------------|-------------------|---------|
| Courses | `stats_courses_label` | Курсы | ✅ Active |
| Learners | `stats_learners_label` | Студенты | ✅ Active |
| Years | `stats_years_label` | Лет опыта | ✅ Active |
| Success Rate | `stats_success_rate_label` | Успеха | ✅ Active |

## Footer Component (⚠️ NEEDS IMPLEMENTATION)

### Recommended Footer Fields for `home_pages` table:

| Section | Recommended Column | Russian Translation | Status |
|---------|-------------------|-------------------|---------|
| **Company Info** |
| Footer Title | `footer_company_title` | О компании | ❌ Not Implemented |
| Footer Description | `footer_company_desc` | Описание | ❌ Not Implemented |
| Copyright | `footer_copyright` | © 2025 AI Studio. Все права защищены | ❌ Not Implemented |
| **Quick Links** |
| Quick Links Title | `footer_links_title` | Быстрые ссылки | ❌ Not Implemented |
| Privacy Policy | `footer_privacy` | Политика конфиденциальности | ❌ Not Implemented |
| Terms of Service | `footer_terms` | Условия использования | ❌ Not Implemented |
| **Contact Info** |
| Contact Title | `footer_contact_title` | Контакты | ❌ Not Implemented |
| Address | `footer_address` | Адрес | ❌ Not Implemented |
| Phone | `footer_phone` | Телефон | ❌ Not Implemented |
| Email | `footer_email` | Email | ❌ Not Implemented |
| **Social Media** |
| Social Title | `footer_social_title` | Мы в соцсетях | ❌ Not Implemented |
| Facebook URL | `footer_facebook_url` | URL | ❌ Not Implemented |
| Instagram URL | `footer_instagram_url` | URL | ❌ Not Implemented |
| LinkedIn URL | `footer_linkedin_url` | URL | ❌ Not Implemented |
| **Newsletter** |
| Newsletter Title | `footer_newsletter_title` | Подписка на новости | ❌ Not Implemented |
| Newsletter Text | `footer_newsletter_text` | Получайте последние новости | ❌ Not Implemented |
| Subscribe Button | `footer_btn_subscribe` | Подписаться | ❌ Not Implemented |

## Multi-Language Support

All content tables have `locale` field supporting:
- `en` - English (Default)
- `ru` - Russian (✅ Fully Active)
- `he` - Hebrew (⚠️ Partial)

## Static Pages (No Database)

- 404.html
- 401.html
- authentication-pages/* (uses `up_users` for auth logic)

## Technical Implementation Details

### Database Column Naming Convention
**CRITICAL:** PostgreSQL converts unquoted identifiers to lowercase.
- ✅ Correct: `nav_home` (snake_case, unquoted)
- ❌ Wrong: `navHome` (camelCase gets converted to `navhome`)
- ❌ Wrong: `"navHome"` (quoted preserves case but causes mismatches)

### API Endpoints for UI Translations
- **Get translations:** `GET /api/home-page?locale=ru`
- **Force update:** `POST /api/force-russian-ui` (requires token)
- **Migration:** `POST /api/migrate-ui` (legacy, replaced by force-russian-ui)

### Frontend Integration
- **Script:** `js/ui-translator.js` - Loads translations from API
- **Integration:** `js/webflow-strapi-integration.js` - Main API communication
- **Locale Detection:** Automatic from URL path (`/ru/`, `/en/`, `/he/`)

### Translation Loading Flow
1. Page loads → Detects locale from URL
2. ui-translator.js → Fetches from `/api/home-page?locale=ru`
3. API returns → 65+ translated UI fields
4. JavaScript → Updates DOM elements with translations

### Current System Status (September 2025)
- ✅ **Navigation:** All 8 items translated to Russian
- ✅ **Buttons:** 13 primary buttons translated
- ✅ **Forms:** All labels and placeholders translated
- ✅ **Statistics:** All stat labels translated
- ✅ **Messages:** System messages translated
- ❌ **Footer:** Not yet implemented in database
- ⚠️ **Hebrew:** Partial implementation only

---

## ⚠️ MISSING TABLES

1. **Pricing Page** - No `pricing_pages` table (static HTML only)
2. **Checkout Page** - No `checkout_pages` or `orders` table
3. **Payment System** - No payment/transaction tables
4. **Student Dashboard** - No student progress/enrollment tables
5. **Course Content** - No lessons/modules/videos tables
6. **Testimonials** - Embedded in pages, no separate `testimonials` table
7. **Newsletter** - No `newsletter_subscribers` table
8. **Analytics** - No user tracking/analytics tables
9. **Footer Content** - No dedicated footer fields in `home_pages` table

---

## Testing & Verification

### Manual Testing
```bash
# Check Russian API response
curl "https://aistudio555jamstack-production.up.railway.app/api/home-page?locale=ru" | jq .

# Verify specific fields
curl -s [API_URL]/api/home-page?locale=ru | python3 -c "
import json, sys
data = json.load(sys.stdin)
attrs = data['data']['attributes']
print(f'navHome: {attrs.get(\"navHome\")}')  # Should be: Главная
print(f'btnSignUpToday: {attrs.get(\"btnSignUpToday\")}')  # Should be: Записаться сегодня
"
```

### Playwright Testing
```javascript
// test-russian-playwright.js
const pages = [
  'https://www.aistudio555.com/ru/home.html',
  'https://www.aistudio555.com/ru/courses.html',
  'https://www.aistudio555.com/ru/teachers.html'
];
// Check for Russian navigation: Главная, Курсы, Преподаватели
```

### Visual Verification
- Screenshots saved as: `russian-test-*.png`
- Check navigation bar for Russian text
- Verify buttons show Russian labels
- Confirm language selector shows "Русский"

---

## Footer Implementation Guide

### Step 1: Add Footer Columns to Database
```sql
-- Add footer columns to home_pages table
ALTER TABLE home_pages 
ADD COLUMN footer_company_title VARCHAR(255),
ADD COLUMN footer_company_desc TEXT,
ADD COLUMN footer_copyright VARCHAR(500),
ADD COLUMN footer_links_title VARCHAR(255),
ADD COLUMN footer_privacy VARCHAR(255),
ADD COLUMN footer_terms VARCHAR(255),
ADD COLUMN footer_contact_title VARCHAR(255),
ADD COLUMN footer_address TEXT,
ADD COLUMN footer_phone VARCHAR(50),
ADD COLUMN footer_email VARCHAR(255),
ADD COLUMN footer_social_title VARCHAR(255),
ADD COLUMN footer_facebook_url VARCHAR(500),
ADD COLUMN footer_instagram_url VARCHAR(500),
ADD COLUMN footer_linkedin_url VARCHAR(500),
ADD COLUMN footer_newsletter_title VARCHAR(255),
ADD COLUMN footer_newsletter_text TEXT,
ADD COLUMN footer_btn_subscribe VARCHAR(255);
```

### Step 2: Update API Response (server.js)
```javascript
// Add to /api/home-page endpoint response
footerCompanyTitle: homeData.footer_company_title || 'About AI Studio',
footerCompanyDesc: homeData.footer_company_desc || 'Leading online education platform',
footerCopyright: homeData.footer_copyright || '© 2025 AI Studio. All rights reserved',
// ... etc for all footer fields
```

### Step 3: Update Force Russian UI Endpoint
```javascript
// Add to russianUI object in /api/force-russian-ui
"footer_company_title": "О компании",
"footer_company_desc": "Ведущая платформа онлайн-образования",
"footer_copyright": "© 2025 AI Studio. Все права защищены",
// ... etc for all footer translations
```

### Step 4: Update Frontend (ui-translator.js)
```javascript
// Add footer element selectors and translations
updateFooterTranslations(data) {
  this.updateText('.footer-company-title', data.footerCompanyTitle);
  this.updateText('.footer-copyright', data.footerCopyright);
  // ... etc
}
```

---

## Quick Reference

### Test URLs
- **API (Russian):** https://aistudio555jamstack-production.up.railway.app/api/home-page?locale=ru
- **Homepage (Russian):** https://www.aistudio555.com/ru/home.html
- **Admin Panel:** https://aistudio555jamstack-production.up.railway.app/content-admin-comprehensive.html

### Key Files
- **Server:** `/server.js` (lines 4584-4771 for Russian UI)
- **Frontend:** `/js/ui-translator.js` (translation loader)
- **Integration:** `/js/webflow-strapi-integration.js` (API communication)

### Database Info
- **Production:** Railway PostgreSQL
- **Table:** `home_pages`
- **Locale Field:** `locale` ('en', 'ru', 'he')
- **UI Fields:** 65+ snake_case columns (nav_*, btn_*, form_*, stats_*)
