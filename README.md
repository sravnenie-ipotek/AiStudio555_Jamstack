# AI Studio E-Learning Platform

> A static web application with custom backend API and multi-language support

**Live Site**: https://www.aistudio555.com  
**Repository**: https://github.com/sravnenie-ipotek/AiStudio555_Jamstack  
**Deployment**: Railway ($5/month)

---

## 🚨 Critical Note: This is NOT a Standard Website

This project is a **static HTML website with custom backend**, not a typical CMS-based application. Understanding this distinction is crucial for working with the codebase.

### Why This Matters

The site uses **Webflow.js** for interactive UI components (mobile menus, dropdowns, sliders), but it was **NOT built with Webflow's visual editor**. This creates unique challenges:

1. **Webflow.js Initialization Issues**: Webflow's JavaScript sometimes fails to initialize properly, causing mobile navigation to break
2. **Manual Menu Fallbacks**: We've implemented custom mobile menu systems when Webflow.js fails (`manual-mobile-menu.js`)
3. **CSS Override Complexity**: Webflow's inline styles require `!important` overrides for customization
4. **Animation Conflicts**: Webflow animations (like `transform: translate3d()`) can hide content unintentionally

**Bottom Line**: If you encounter mobile menu issues, dropdown problems, or hidden content, it's likely a Webflow.js conflict. Check the console for initialization errors and review our custom CSS overrides.

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Translation System](#-translation-system)
- [Database Structure](#-database-structure)
- [Admin Panel](#-admin-panel)
- [Webflow.js Challenges](#-webflowjs-challenges)
- [Development Workflow](#-development-workflow)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Project Overview

**AI Studio** is a multi-language e-learning platform built as a JAMstack application with:

- **Frontend**: Static HTML/CSS/JS served via Python HTTP server or Railway
- **Backend**: Custom Express.js API (100% custom - NO third-party CMS)
- **Database**: Railway PostgreSQL (cloud-hosted)
- **Languages**: English (EN), Russian (RU), Hebrew (HE) with RTL support
- **Admin**: Custom HTML-based content management panel

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | HTML5, CSS3, Vanilla JS | Static pages with interactive elements |
| UI Framework | Webflow.js | Mobile menus, dropdowns, animations |
| Backend | Express.js (Node.js) | Custom RESTful API server |
| Database | PostgreSQL 14+ | Content storage with JSONB fields |
| Hosting | Railway | $5/month cloud hosting |
| Languages | EN, RU, HE | Multi-language content delivery |

### Key Features

- ✅ **Multi-language Support**: EN/RU/HE with automatic fallback to English
- ✅ **Custom Admin Panel**: Single interface for all content management
- ✅ **Static Image System**: Pre-generated course and teacher images
- ✅ **Mobile-First Design**: Responsive layouts with custom menu systems
- ✅ **Preview Mode**: Test content before publishing
- ✅ **RTL Support**: Proper right-to-left layout for Hebrew

---

## 🏗️ Architecture

### Three-Layer Architecture

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Static HTML)                    │
│  - HTML pages (home.html, courses.html, etc.)               │
│  - Webflow.js for UI components                             │
│  - Unified Language Manager for translations                │
│  - Port: 3005 (dev) / 8000 (production preview)            │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│              CUSTOM API (Express.js Server)                  │
│  - 100% custom backend (NO third-party CMS)                 │
│  - RESTful endpoints for content delivery                   │
│  - Port: 3000 (local) / Railway-assigned (production)      │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│            DATABASE (Railway PostgreSQL)                     │
│  - 30+ active tables with nd_ prefix                        │
│  - JSONB columns for multi-language content                │
│  - Automatic language fallback system                       │
└─────────────────────────────────────────────────────────────┘
\`\`\`

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v16+ and npm
- **Python 3** (for HTTP server)
- **PostgreSQL** (Railway provides cloud instance)
- **Git** for version control

### Installation

\`\`\`bash
# 1. Clone the repository
git clone git@github.com:sravnenie-ipotek/AiStudio555_Jamstack.git
cd AiStudio555_Jamstack

# 2. Install Node.js dependencies
npm install

# 3. Start the custom API server
npm start
# Server runs on http://localhost:3000

# 4. In a new terminal, start the frontend server
python3 -m http.server 3005
# Frontend available at http://localhost:3005
\`\`\`

### Quick Access URLs

| Service | Local Development | Production |
|---------|-------------------|------------|
| Homepage | http://localhost:3005/home.html | https://www.aistudio555.com/home.html |
| Admin Panel | http://localhost:3005/content-admin-comprehensive.html | https://aistudio555jamstack-production.up.railway.app/content-admin-comprehensive.html |
| API Health | http://localhost:3000/api/courses | https://aistudio555jamstack-production.up.railway.app/api/courses |

---

## 🌍 Translation System

### Dual-System Architecture

The translation system uses **two separate systems** that work together without conflicts:

#### System 1: UI Translation (Unified Language Manager)

**Handles**: Static UI text, buttons, labels, navigation  
**File**: \`js/unified-language-manager.js\`

**Example**:
\`\`\`html
<!-- HTML -->
<h2 data-i18n="hero.content.title">Welcome to AI Studio</h2>

<!-- API Request -->
GET /api/nd/home-page?locale=ru

<!-- Result: Title changes to Russian -->
\`\`\`

#### System 2: Dynamic Content (Integration Files)

**Handles**: Database-driven content (courses, testimonials, teachers)  
**Files**: \`js/nd-*-integration.js\`

**Example**:
\`\`\`javascript
// nd-courses-integration.js
element.textContent = course.title_ru; // Update with Russian title
element.removeAttribute('data-i18n');  // CRITICAL: Prevent System 1 overwrite
\`\`\`

### Conflict Prevention Rule

> **NEVER** have both systems targeting the same element. Integration files must remove \`data-i18n\` attributes after updating content.

### Supported Languages

- **English (EN)**: Default language, fallback for missing translations
- **Russian (RU)**: Cyrillic text, left-to-right layout
- **Hebrew (HE)**: Hebrew text, **right-to-left (RTL)** layout

### Complete Translation Documentation

For detailed implementation guide, see:  
📄 **[\`/backups/newDesign/docs/develop/translationLogics/WorkingLogic.md\`](backups/newDesign/docs/develop/translationLogics/WorkingLogic.md)**

This 1,154-line document covers:
- Step-by-step implementation for any page
- Database structure patterns
- API endpoint mapping
- Debugging common issues
- SQL templates for translations
- Compliance checklist

---

## 🗄️ Database Structure

### Overview

- **Total Tables**: 30+ active tables
- **Naming Convention**: \`nd_\` prefix for isolation
- **Storage**: JSONB columns for flexible content structure
- **Languages**: Separate columns (\`content_en\`, \`content_ru\`, \`content_he\`)
- **Fallback**: Automatic fallback to English if translation missing

### Table Categories

#### 1. Page Content Tables
Store UI translations and page sections.

**Format**: \`nd_[pagename]_page\`

**Examples**:
- \`nd_home\` - Home page sections (hero, features, testimonials)
- \`nd_courses_page\` - Courses page UI (titles, labels, buttons)
- \`nd_pricing_page\` - Pricing page content
- \`nd_teachers_page\` - Teachers page sections

**Structure**:
\`\`\`sql
CREATE TABLE nd_[pagename]_page (
    id SERIAL PRIMARY KEY,
    section_key VARCHAR(100) UNIQUE NOT NULL,
    section_type VARCHAR(50),
    content_en JSONB,  -- English content
    content_ru JSONB,  -- Russian translations
    content_he JSONB,  -- Hebrew translations
    visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

#### 2. Entity Data Tables
Store actual content records (courses, teachers, blog posts).

**Examples**:
- \`nd_courses\` - Course catalog (3+ active courses)
- \`teachers\` / \`entity_teachers\` - Teacher profiles (16 profiles)
- \`blog_posts\` - Blog articles

### Screen-to-Table Mapping

| Screen | Page Table | Entity Table | API Endpoint |
|--------|-----------|--------------|--------------|
| \`home.html\` | \`nd_home\` | - | \`/api/nd/home-page\` |
| \`courses.html\` | \`nd_courses_page\` | \`nd_courses\` | \`/api/nd/courses-page\`, \`/api/nd/courses\` |
| \`teachers.html\` | \`nd_teachers_page\` | \`teachers\` | \`/api/nd/teachers-page\`, \`/api/teachers\` |
| \`pricing.html\` | \`nd_pricing_page\` | - | \`/api/nd/pricing-page\` |

### API Endpoint Patterns

\`\`\`bash
# Page Content (UI translations)
GET /api/nd/[pagename]-page?locale={en|ru|he}

# Entity Data (courses, teachers, etc.)
GET /api/nd/[entityname]?locale={en|ru|he}

# Admin Updates
PUT /api/nd/[pagename]-page/:section
\`\`\`

### Complete Database Documentation

For full database schema, table structures, and SQL templates, see:  
📄 **[\`/backups/newDesign/docs/db.md\`](backups/newDesign/docs/db.md)**

This 519-line document covers:
- All 30+ table definitions
- Complete screen-to-table mapping
- Static image system documentation
- Admin panel architecture
- API endpoint reference

---

## 🎛️ Admin Panel

### Overview

The admin panel is a **centralized content management system** built entirely with custom HTML/CSS/JS. There is NO WordPress, NO Strapi, NO Contentful - just a custom interface.

**Access**:
- **Local**: http://localhost:3005/content-admin-comprehensive.html
- **Production**: https://aistudio555jamstack-production.up.railway.app/content-admin-comprehensive.html

### Two Admin Systems

#### 1. Comprehensive Admin (\`content-admin-comprehensive.html\`)
- **215+ editable content fields**
- **Live preview functionality** (\`?preview=true\`)
- **Multi-language content editing**
- **Direct database updates via API**

#### 2. Modal-Based Admin (\`admin-nd.html\`)
- **Tab-based interface** (Home, Courses, Teachers, Pricing, etc.)
- **Modal editing system**
- **Auto-save functionality** (saves every 30 seconds)
- **Quick Actions** for inline edits
- **Preview mode** for unpublished changes

---

## 🚨 Webflow.js Challenges

### Common Issues

#### 1. Mobile Menu Not Opening

**Root Cause**: Webflow.js not initializing properly

**Solution**: Manual mobile menu implementation
\`\`\`javascript
// See: js/manual-mobile-menu.js
document.querySelector('.w-nav-button').addEventListener('click', () => {
  document.querySelector('.w-nav-overlay').classList.add('nav-open');
});
\`\`\`

#### 2. Button Text Invisible

**Root Cause**: Webflow animations positioning text off-screen
\`\`\`css
/* Webflow's inline style */
transform: translate3d(0, 250%, 0); /* Text pushed 250% down */
\`\`\`

**Solution**: CSS override
\`\`\`css
.primary-button-wrapper.mobile .primary-button-text-block:not(.is-text-absolute) {
  transform: none !important;
  opacity: 1 !important;
  visibility: visible !important;
}
\`\`\`

#### 3. Duplicate Button Text

**Solution**: Hide the duplicate element
\`\`\`css
.primary-button-wrapper.mobile .primary-button-text-block.is-text-absolute {
  display: none !important;
}
\`\`\`

---

## 💻 Development Workflow

### Local Development Setup

\`\`\`bash
# Terminal 1: Start Custom API Server
npm start

# Terminal 2: Start Frontend Server
python3 -m http.server 3005
\`\`\`

### Development URLs

| Service | URL |
|---------|-----|
| Homepage | http://localhost:3005/home.html |
| Admin Panel | http://localhost:3005/content-admin-comprehensive.html |
| API Health | http://localhost:3000/api/courses |

---

## 🚀 Deployment

### Railway Deployment

Production URLs:
- **Website**: https://www.aistudio555.com
- **API**: https://aistudio555jamstack-production.up.railway.app

**Automatic Deployment**:
\`\`\`bash
git push origin main
# Railway automatically deploys
\`\`\`

---

## 🐛 Troubleshooting

### Mobile Menu Not Working

\`\`\`javascript
// Check Webflow initialization
console.log(window.Webflow);
console.log(window.Webflow.ready);
\`\`\`

### Translations Not Showing

\`\`\`bash
# Test API
curl "http://localhost:3000/api/nd/home-page?locale=ru" | jq '.'
\`\`\`

### Port Already in Use

\`\`\`bash
lsof -i :3000
kill -9 <PID>
\`\`\`

---

## 📚 Additional Resources

### Project Documentation

| File | Description | Lines |
|------|-------------|-------|
| \`CLAUDE.md\` | Project overview and guidelines | ~600 |
| \`backups/newDesign/docs/develop/translationLogics/WorkingLogic.md\` | Translation system guide | 1,154 |
| \`backups/newDesign/docs/db.md\` | Database documentation | 519 |

### Key Concepts

1. **NOT a Webflow Site** - Uses Webflow.js but NOT built with editor
2. **NOT CMS-Based** - 100% custom Express.js backend
3. **Dual Translation System** - Two systems that never overlap
4. **Static + Dynamic Hybrid** - HTML is static, content is dynamic

---

**Last Updated**: September 30, 2025  
**Version**: 2.0  
**Status**: Production (Active Development)
