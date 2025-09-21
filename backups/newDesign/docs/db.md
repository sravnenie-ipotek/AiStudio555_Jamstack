# Database Schema Documentation
## AI Studio Multilingual Page-Based Architecture (NewDesign)

### 🌍 Overview
- **Total Tables**: 30+ active tables
- **Languages Supported**: English (EN), Russian (RU), Hebrew (HE)
- **Architecture**: Page-based with JSONB content storage + Entity-based data tables
- **Prefix**: All tables use `nd_` prefix for isolation
- **Fallback**: Automatic fallback to English if translation missing
- **Admin System**: Centralized admin panel with modal-based editing (admin-nd.html)

### 🔑 Key Architecture Principles
1. **Separation of Concerns**:
   - **Page Tables** (nd_*_page): Store UI text, buttons, labels, headers
   - **Entity Tables** (nd_courses, teachers): Store actual content data

2. **Translation System**:
   - Each page table has `content_en`, `content_ru`, `content_he` columns
   - API automatically serves based on `?locale=` parameter
   - Frontend uses `data-i18n` attributes to map translations

3. **Example: Courses Page**:
   - `nd_courses_page`: Stores "Course Details" button text, "Featured Courses" title
   - `nd_courses`: Stores actual course data (React Course, Python Course, etc.)
   - Both work together to render the complete page

### 📁 Project Structure
- **NewDesign Pages**: `/backups/newDesign/` directory (home.html, courses.html, etc.)
- **Admin Panel**: `/admin-nd.html` - SINGLE source for ALL content management
- **Detail Pages**: View-only pages for displaying content (`detail_courses.html`, etc.)
- **API Server**: Express.js on port 1337 (local) / Railway auto-assigned (production)

---

## 🗂️ Database Tables Overview

### Table Categories
1. **Page Content Tables** - Store page-specific content and translations
   - `nd_home` - Home page sections (hero, features, testimonials, etc.)
   - `nd_courses_page` - Courses page UI translations and content
   - `nd_pricing_page` - Pricing page content
   - `nd_about_page` - About page content
   - `nd_contact_page` - Contact page content
   - `nd_teachers_page` - Teachers page sections
   - `nd_career_center_platform_page` - Career center page content

2. **Entity Data Tables** - Store actual data records
   - `nd_courses` - Course catalog data
   - `teachers` / `entity_teachers` - Teacher profiles
   - `blog_posts` - Blog articles
   - `nd_pricing_plans` - Pricing plan details

3. **System Tables** - Navigation, footer, settings
   - `nd_menu` - Navigation menu items
   - `nd_footer` - Footer content
   - `nd_settings` - System configuration

4. **Legacy Tables** - Old project tables still in use
   - `courses` - Old course data
   - `home_pages` - Old home page content
   - Various content_* tables

---

## 📊 Complete Screen-to-Table Mapping

### 1. HOME PAGE ✅ ACTIVE
**Screen**: `/backups/newDesign/home.html`
**Table**: `nd_home`
**API**: `/api/nd/home-page`
**Records**: 11 sections
```sql
CREATE TABLE nd_home (
    id SERIAL PRIMARY KEY,
    section_key VARCHAR(100) UNIQUE,
    section_type VARCHAR(50),
    content_en JSONB,
    content_ru JSONB,
    content_he JSONB,
    visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```
**Sections**:
- `hero` - Hero banner
- `features` - Feature grid
- `courses` - Course carousel (refs `nd_courses`)
- `testimonials` - Student testimonials
- `blog` - Blog posts (refs `blog_posts`)
- `cta_1` - Call-to-action
- `faq` - FAQs (stays in home)
- `navigation` - Nav menu
- `process` - Process steps
- `awards` - Awards section
- `misc` - Miscellaneous

### 2. COURSES PAGE ✅ ACTIVE + STATIC IMAGES
**Screen**: `/backups/newDesign/courses.html`
**Tables**:
- `nd_courses_page` - Page content and translations
- `nd_courses` - Course entity data
**API**:
- `/api/nd/courses-page` - Page content and UI translations
- `/api/nd/courses` - Course data
**Integration**: `js/nd-courses-integration.js`, `js/course-card-component.js`
**Records**: 7 page sections, 3 active courses

**⚡ STATIC IMAGE SYSTEM**:
- **Problem Solved**: Dynamic image generation creating new pictures each load
- **Solution**: 12 pre-generated static course images with frontend override
- **Files**:
  - `images/course-react.jpg` through `images/course-analytics.jpg`
  - `generate-course-images-alternative.html` - Canvas-based generator
  - `js/course-card-component.js` - Enhanced with static mapping

**Static Image Mapping**:
```javascript
const staticImages = {
    "React & Redux Masterclass": "images/course-react.jpg",
    "Node.js Backend Development": "images/course-nodejs.jpg",
    "Python for Data Science": "images/course-python.jpg",
    // ... 9 more mappings
};
```

### 3. TEACHERS PAGE ✅ ACTIVE + STATIC PROFILE IMAGES
**Screen**: `/backups/newDesign/teachers.html`
**Tables**:
- `teachers` - Legacy teacher data
- `entity_teachers` - New universal teacher data
- `nd_teachers_page` - Page content sections
**API**: `/api/teachers`, `/api/nd/teachers`
**Integration**: `js/teachers-integration.js`
**Records**: 16 teachers

**⚡ NEW: STATIC TEACHER PROFILE IMAGES**:
- **Implementation**: Professional abstract images without faces
- **Solution**: 16 pre-generated teacher profile images
- **Files**:
  - `images/teacher-30-dr.-sarah-chen.jpg` through `images/teacher-45-emma-davis.jpg`
  - `generate-teacher-images.html` - Canvas-based profile generator
  - `js/teachers-integration.js` - Static image mapping

**Teacher Image Mapping**:
```javascript
const staticImages = {
    30: "images/teacher-30-dr.-sarah-chen.jpg",      // Dr. Sarah Chen
    31: "images/teacher-31-dr.-michael-rodriguez.jpg", // Dr. Michael Rodriguez
    // ... 14 more mappings
};
```

### 4. PRICING PAGE ✅ ACTIVE
**Screen**: `/backups/newDesign/pricing.html`
**Table**: `nd_pricing_page`
**API**: `/api/nd/pricing-page`
**Integration**: `js/pricing-integration.js`
**Records**: 6 sections
**Sections**:
- `hero` - Pricing hero
- `plans` - Pricing tiers (Basic $29, Pro $79, Enterprise Custom)
- `features_comparison` - Feature matrix
- `faqs` - Pricing FAQs
- `testimonials` - Customer quotes
- `cta` - Sign up CTA

### 5. ABOUT PAGE ✅ ACTIVE
**Screen**: `/backups/newDesign/about-us.html`
**Table**: `nd_about_page`
**API**: `/api/nd/about-page`
**Records**: 8 sections
**Content**: Company story, mission, values, team

### 6. BLOG PAGE ✅ ACTIVE
**Screen**: `/backups/newDesign/blog.html`
**Table**: `blog_posts` (no nd_ prefix)
**API**: `/api/blog-posts`
**Integration**: Dynamic blog listing
**Detail Page**: `detail_blog.html?id=X`

### 7. CONTACT PAGE ✅ ACTIVE
**Screen**: `/backups/newDesign/contact-us.html`
**Table**: `nd_contact_page`
**Sections**:
- Contact info
- Office locations
- Contact form config
- Map embed
- Business hours
- Social links

### 8. CAREER CENTER PAGE ✅ ACTIVE
**Screen**: `/backups/newDesign/career-center.html`
**Table**: `career_center_pages`
**API**: `/api/career-center-page`
**Sections**:
- Hero section
- Career paths
- Resources
- Job board preview
- Assessment CTA
- Success stories

### 9. CAREER ORIENTATION PAGE ✅ ACTIVE
**Screen**: `/backups/newDesign/career-orientation.html`
**Table**: `career_orientation_pages`
**API**: `/api/career-orientation-page`
**Sections**:
- Hero section
- 4-step process
- Benefits
- Consultation form
- Testimonials

### 10. CHECKOUT PAGE ✅ EXISTS
**Screen**: `/backups/newDesign/checkout.html`
**Table**: `nd_checkout_page` (planned)
**Features**: Form fields, payment methods, order summary

### 11. ORDER CONFIRMATION PAGE ✅ EXISTS
**Screen**: `/backups/newDesign/order-confirmation.html`
**Table**: `nd_order_confirmation_page` (planned)
**Content**: Success message, order details, next steps

### 12. ERROR PAGES ✅ EXIST
**401 Page**: `/backups/newDesign/401.html`
**404 Page**: `/backups/newDesign/404.html`
**Tables**: `nd_401_page`, `nd_404_page` (planned)

### 13. DETAIL PAGES (View-Only) ✅ ACTIVE
**Course Detail**: `/backups/newDesign/detail_courses.html?id=X`
**Teacher Detail**: `/backups/newDesign/detail_teacher.html?id=X`
**Blog Detail**: `/backups/newDesign/detail_blog.html?id=X`
**Product Detail**: `/backups/newDesign/detail_product.html?id=X`
**Category Detail**: `/backups/newDesign/detail_category.html?id=X`

**Important**: Detail pages are VIEW-ONLY. All editing happens in admin panel.

---

## 🎛️ Admin Panel Architecture

### Centralized Admin System
**URL**: `http://localhost:1337/admin-nd.html`
**Philosophy**: Single interface for ALL content management

### Admin Panel Structure
```
admin-nd.html (THE ONLY MANAGEMENT INTERFACE)
├── Home Tab         # Homepage sections
├── Courses Tab      # Course management with modal editing
├── Teachers Tab     # Teacher profiles
├── Pricing Tab      # Pricing plans
├── Blog Tab         # Blog articles
├── Navigation Tab   # Menu items
├── Footer Tab       # Footer content
└── Settings Tab     # System config
```

### Course Management Workflow (Example)
1. **List View**: Shows all courses with Quick Actions
2. **Quick Actions**: Inline edit price, category, visibility
3. **Edit Modal**: Click "Edit Details" → Opens comprehensive modal
4. **Auto-save**: Changes save every 30 seconds
5. **Preview**: Opens `detail_courses.html?id=X&preview=true` in new tab
6. **Publish**: Toggle visibility in admin panel

### Modal Edit System Pattern
```javascript
function showEditModal(entityType, entityId) {
    const modal = document.getElementById(`${entityType}Form`);
    modal.style.display = 'block'; // Stay in admin panel
    loadEntityData(entityId);
    startAutoSave(entityId);
}
```

---

## 🗄️ Entity Data Tables

### `nd_courses_page` ✅ ACTIVE
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
**Sections**:
- `hero` - Page hero banner
- `featured_courses` - Course filter tabs and titles
- `ui_elements` - Buttons and labels
- `cart` - Shopping cart UI text
- `cta_bottom` - Bottom call-to-action
- `misc` - Miscellaneous UI text
- `navigation` - Navigation menu items

### `nd_courses` ✅ ACTIVE
```sql
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
```

### `teachers` ✅ ACTIVE
```sql
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

### `entity_teachers` ✅ NEW UNIVERSAL TABLE
```sql
CREATE TABLE entity_teachers (
    id SERIAL PRIMARY KEY,
    teacher_key VARCHAR(100) UNIQUE,
    full_name VARCHAR(255),
    professional_title VARCHAR(255),
    company VARCHAR(255),
    bio TEXT,
    profile_image_url VARCHAR(500),
    skills JSONB,
    experience_history JSONB,
    courses_taught JSONB,
    student_reviews JSONB,
    statistics JSONB,
    contact_info JSONB,
    social_links JSONB,
    is_featured BOOLEAN DEFAULT false,
    display_order INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### `blog_posts` ✅ ACTIVE
```sql
CREATE TABLE blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    title_ru VARCHAR(255),
    title_he VARCHAR(255),
    content TEXT,
    author VARCHAR(255),
    featured_image VARCHAR(500),
    slug VARCHAR(255),
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔧 System Tables

### `nd_menu` ✅ ACTIVE
- Navigation menu items
- API: `/api/nd/menu`

### `nd_footer` ✅ ACTIVE
- Footer sections and links
- API: `/api/nd/footer`
- Records: 20 items

### `nd_settings` ⚠️ PLANNED
- Global system settings
- API: `/api/nd/settings`

---

## 🔄 API Endpoints Summary

### Page Content APIs
- `GET /api/nd/home-page?locale={en|ru|he}`
- `GET /api/nd/pricing-page?locale={en|ru|he}`
- `GET /api/nd/about-page?locale={en|ru|he}`
- `GET /api/nd/teachers-page?locale={en|ru|he}`
- `GET /api/career-center-page?locale={en|ru|he}`
- `GET /api/career-orientation-page?locale={en|ru|he}`

### Entity Data APIs
- `GET /api/featured-courses` - Featured courses with categories
- `GET /api/nd/courses` - All courses
- `GET /api/teachers` - Teacher listings
- `GET /api/nd/teachers` - New universal teacher API
- `GET /api/blog-posts` - Blog articles

### Admin APIs
- `PUT /api/nd/home-page/:section`
- `PUT /api/nd/pricing-page/:section`
- `PUT /api/nd/teachers-page/:section`
- `POST /api/courses` - Create course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

---

## 📈 Recent Implementations

### ✅ Static Course Image System (September 2025)
- **Files Created**: 12 course images + generators
- **Problem Solved**: Dynamic generation on each page load
- **Integration**: Frontend JavaScript override

### ✅ Static Teacher Profile Images (September 2025)
- **Files Created**: 16 teacher profile images (no faces)
- **Design**: Professional abstract images
- **Integration**: `js/teachers-integration.js`

### ✅ Shared Component System
- **Course Cards**: `js/course-card-component.js`
- **Uniform Styling**: `css/uniform-card-styles.css`
- **Template System**: Reusable card templates

### ✅ Admin Panel Enhancements
- Modal-based editing
- Auto-save functionality
- Preview mode integration
- Quick Actions for inline edits

---

## 🚀 Implementation Status

### ✅ Completed
- 9 active page screens with database integration
- Static image systems for courses and teachers
- Centralized admin panel with modal editing
- Multi-language support with fallback
- Preview mode for unpublished changes

### ⚠️ In Progress
- Full multilingual API integration
- User authentication system
- Media management table

### ❌ Planned
- Checkout page database
- Order confirmation database
- Error page databases
- Global settings management

---

## 🔒 Security Notes

1. **SQL Injection**: All queries use parameterized statements
2. **XSS Protection**: JSONB content escaped on render
3. **CORS**: Configured for specific origins
4. **No Authentication**: Currently open (development phase)
5. **Static Images**: No file upload vulnerabilities

---

## 📊 Database Statistics

| Entity | Table | Records | Status |
|--------|-------|---------|--------|
| Home Page | `nd_home` | 11 sections | ✅ Active |
| Courses | `nd_courses` | 3+ courses | ✅ Active |
| Teachers | `teachers` | 16 profiles | ✅ Active |
| Blog Posts | `blog_posts` | Varies | ✅ Active |
| Pricing | `nd_pricing_page` | 6 sections | ✅ Active |
| About | `nd_about_page` | 8 sections | ✅ Active |
| Footer | `nd_footer` | 20 items | ✅ Active |

---

## 🎨 Key Architecture Principles

1. **Single Admin Source**: ALL content management in `admin-nd.html`
2. **View-Only Details**: Detail pages only display, never edit
3. **Static Images**: Frontend overrides for consistent imagery
4. **Modal Editing**: Comprehensive editing without page navigation
5. **Auto-Save**: Changes persist every 30 seconds
6. **Preview Mode**: Test changes before publishing
7. **Language Fallback**: Missing translations use English

---

*Last Updated: September 17, 2025*
*Database: PostgreSQL 14+ on Railway Cloud*
*Architecture: Centralized Admin + View-Only Details + Static Images*
*Status: Production Ready with Active Development*