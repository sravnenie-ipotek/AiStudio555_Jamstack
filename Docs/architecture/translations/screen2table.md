# Screen to Database Table Mapping

**Last Updated:** September 15, 2025 ⚡ ULTRATHINK COMPLETE
**Status:** ✅ Russian Translations Active | UI System Fixed | Complete Schema Analysis | 🚨 MAJOR DISCOVERY: Enterprise Footer System + Authentication

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
| Pricing | `pricing_plans` | `/api/pricing-plans` | ✅ Active |
| Checkout | ❌ NO TABLE | - | Not Implemented |
| Footer Content | `footer_content` | `/api/footer-content` | ✅ Active |
| Admin Panel | `admin_users`, `admin_roles`, `admin_permissions` | `/api/auth/*` | ✅ Active |

## Career System → Tables

| Screen | Table | Purpose |
|--------|-------|---------|
| Career Assessment Form | `career_orientation_assessment_responses` | Store user submissions |
| Career Resources | `career_resources` | Career content/articles |
| Career Paths | `career_paths` | Career path definitions |
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
- **Main Script:** `js/webflow-strapi-integration.js` - Primary API communication and content loading
- **Secondary Script:** `js/strapi-integration.js` - UI translations and page content
- **UI Translator:** `js/ui-translator.js` - Specialized translation loader
- **Locale Detection:** Automatic from URL path (`/ru/`, `/en/`, `/he/`)
- **Content Loading:** Dynamic by page type (home, courses, teachers, career, blog)
- **API Base:** Auto-detects localhost vs production environment

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

## 🆕 ADDITIONAL TABLES DISCOVERED (September 2025)

**Analysis of server.js revealed additional API endpoints and table mappings:**

| Table | API Endpoint | Purpose | Status |
|-------|--------------|---------|---------|
| `site_settings` | `/api/site-settings` | Global site configuration | ✅ Active |
| `navigation_menu` | `/api/navigation-menu` | Navigation items | ✅ Active |
| `statistics` | `/api/statistics` | Global stats display | ✅ Active |
| `button_texts` | `/api/button-texts` | Button text management | ✅ Active |
| `company_logos` | `/api/company-logos` | Company logo grid | ✅ Active |
| `page_meta` | `/api/page-meta/:slug` | SEO metadata by page | ✅ Active |
| `courses_page` | `/api/courses-page` | Courses page content | ✅ Active |
| `global_content` | `/api/global-content` | Cross-page content | ✅ Active |
| `pricing_plans` | `/api/pricing-plans` | Pricing table data | ✅ Active |

## 🏢 ENTERPRISE FOOTER SYSTEM DISCOVERED

**Deep analysis revealed sophisticated footer architecture with 5 specialized tables:**

| Table | API Endpoint | Purpose | Status |
|-------|--------------|---------|---------|
| `footer_content` | `/api/footer-content` | Main footer content sections | ✅ Active |
| `footer_navigation_menus` | `/api/footer-navigation-menus` | Footer navigation links | ✅ Active |
| `footer_social_links` | `/api/footer-social-links` | Social media links | ✅ Active |
| `footer_newsletter_config` | `/api/footer-newsletter-config` | Newsletter subscription | ✅ Active |
| `footer_audit_log` | Internal | Footer changes audit trail | ✅ Active |

**Footer Features:**
- Multi-level caching system with performance monitoring
- XSS protection and input sanitization
- Real-time content updates across 111 HTML files
- Audit logging for content changes
- Master footer loader (`js/master-footer-loader.js`) with automatic fallback

## 🔐 AUTHENTICATION SYSTEM DISCOVERED

**Comprehensive auth system with enterprise-grade security:**

| Component | Tables | API Endpoints | Features |
|-----------|--------|--------------|------------|
| **Admin Panel** | `admin_users`, `admin_roles`, `admin_permissions` | `/api/auth/admin/*` | JWT tokens, role-based access |
| **User System** | `up_users`, `up_roles`, `up_permissions` | `/api/auth/local/*` | Registration, login, password reset |
| **Sessions** | `sessions`, `user_sessions` | `/api/auth/session/*` | Session management, timeout |
| **Security** | `security_logs`, `rate_limits` | `/api/auth/security/*` | Rate limiting, audit trails |

**Auth Endpoints Discovered:**
- `POST /api/auth/local` - User login
- `POST /api/auth/local/register` - User registration
- `POST /api/auth/forgot-password` - Password reset
- `POST /api/auth/reset-password` - Password reset confirmation
- `POST /api/auth/change-password` - Password change
- `GET /api/auth/email-confirmation` - Email verification
- `POST /api/auth/send-email-confirmation` - Resend verification

## ⚠️ MISSING TABLES

1. **Checkout Page** - No `checkout_pages` or `orders` table
2. **Payment System** - No payment/transaction tables
3. **Student Dashboard** - No student progress/enrollment tables
4. **Course Content** - No lessons/modules/videos tables
5. **Newsletter** - No `newsletter_subscribers` table
6. **Analytics** - No user tracking/analytics tables
7. **Testimonials** - Still embedded in `home_pages`, no separate table

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

---

## 📊 ULTRATHINK ANALYSIS SUMMARY (September 15, 2025) ⚡

### Database Schema Overview - **ENTERPRISE SCALE DISCOVERED**
- **Core Content Tables:** 15+ active tables with full API integration
- **Enterprise Footer System:** 5 specialized footer tables with audit logging
- **Authentication System:** 8+ auth tables (admin/user roles, sessions, security)
- **Primary Content:** `home_pages` (massive table with 200+ fields)
- **Specialized Content:** `career_orientation_pages` (163+ fields), `career_center_pages`
- **Dynamic Content:** `courses`, `teachers`, `blog_posts`
- **Global Management:** `site_settings`, `navigation_menu`, `statistics`, `button_texts`
- **Total Tables:** 25+ tables (originally thought to be 15+)

### API Endpoints - **50+ DISCOVERED**
- **Total Active Endpoints:** 50+ REST API endpoints (originally estimated 40+)
- **Content Retrieval:** GET endpoints for all major content types
- **Content Management:** PUT/POST endpoints for admin operations
- **Authentication Endpoints:** 7+ auth endpoints with JWT and session management
- **Footer System:** 4+ specialized footer API endpoints
- **Multilingual Support:** `?locale=` parameter on all endpoints
- **Special Functions:** Translation management, database migration, health checks, security audit

### Frontend Integration - **ENTERPRISE FEATURES**
- **Architecture:** JAMstack - Static HTML + Custom Express API
- **Integration Scripts:** 3 main JavaScript files + master footer loader
- **Footer System:** Master footer loader with multi-level caching across 111 HTML files
- **Locale Detection:** Automatic from URL path structure
- **Content Loading:** Dynamic by page type with fallback handling
- **Translation System:** Real-time UI element translation based on database content
- **Security:** XSS protection, input sanitization, rate limiting

### Key Ultrathink Discoveries
1. **Enterprise-Grade Footer System** - 5 specialized tables with sophisticated caching
2. **Comprehensive Authentication** - Admin panel, user roles, sessions, security logging
3. **Performance Monitoring** - Built-in caching and performance tracking systems
4. **Security Architecture** - XSS protection, audit trails, rate limiting
5. **Massive Scale** - 25+ tables, 50+ API endpoints, 111 HTML files integrated
6. **Production-Ready Enterprise System** - Railway deployment with enterprise features

### Missing Components (Confirmed after deep analysis)
- Student enrollment/progress tracking
- E-commerce/payment processing
- Course content delivery (lessons/videos)
- Newsletter management (footer config exists but not implemented)
- Advanced analytics (basic audit logging exists)

### Architecture Classification: **ENTERPRISE JAMSTACK**
This ultrathink analysis reveals the system is not just a "sophisticated custom JAMstack implementation" but a **full enterprise-grade platform** with:
- Multi-tier authentication and authorization
- Enterprise footer management system
- Comprehensive audit logging and security
- Performance monitoring and caching systems
- Production-ready scaling capabilities

**Total System Complexity:** Much higher than initially assessed - this is enterprise-level architecture masquerading as a simple JAMstack site.
