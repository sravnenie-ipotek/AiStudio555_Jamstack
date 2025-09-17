# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚨 ACTIVE PROJECT: NewDesign (`/backups/newDesign`)

**⚠️ IMPORTANT: We are currently working EXCLUSIVELY on the NewDesign project located at:**
```
/Users/michaelmishayev/Desktop/newCode/backups/newDesign/
```

All development efforts should focus on this directory. The NewDesign version represents the latest iteration of the AI Studio platform with improved UI/UX patterns.

### Access URLs
- **Local Development**: http://localhost:3005/backups/newDesign/home.html
- **API Server**: http://localhost:1337

---

## Project Overview

This is an **AI Studio E-Learning Platform** using JAMstack architecture with a **100% Custom Backend**. The project consists of a static frontend (HTML/CSS/JS) that connects directly to a custom Express.js API for dynamic content management, user authentication, and course delivery.

**⚠️ IMPORTANT: This system uses NO third-party CMS. It's completely custom-built.**

## Architecture

### Three-Layer Architecture
```
Frontend (Static HTML) → Custom Express API → Railway PostgreSQL
Port 3005/8000        → Port 3000 (local)   → Railway Cloud
                         Railway auto-assigns port in production
```

### Key Components
- **Frontend**: Static HTML templates served via Python HTTP server
- **Custom API**: Express.js server with RESTful endpoints (port 3000 local, Railway-assigned in production)
- **Database**: Railway PostgreSQL cloud database (production)
- **Admin Panel**: Custom HTML-based content management interface
- **Integration Layer**: `js/webflow-strapi-integration.js` handles API communication

⚠️ **Note About File Naming**: Files with "strapi" in their names are misleadingly named legacy files. They actually connect to our custom API, not Strapi.

## Development Commands

### Start the System

```bash
# 1. Start Custom API Server
npm start  # Runs server.js on port 1337

# 2. Start Frontend Server (choose one)
python3 -m http.server 3005  # Development server
python3 -m http.server 8000 --directory dist  # Production preview
```

### Development Workflow

```bash
# Install dependencies
npm install

# Run development server
npm run dev  # Concurrent frontend + API development

# Build for production
npm run build  # Generates dist/ directory

# Preview production build
npm run preview  # Serves from dist/
```

### Database Operations

```bash
# Migration (automatic on Railway)
npm run migrate

# View server logs
node server.js  # Direct server start with logs
```

## API Configuration

### Production API URL
The custom API runs at: `https://aistudio555jamstack-production.up.railway.app`

### Local Development
- API Server: `http://localhost:3000` (unless PORT env var is set)
- Frontend Dev Server: `http://localhost:3005`

### Environment Configuration
The system automatically detects Railway environment variables:
- `DATABASE_URL`: Provided by Railway PostgreSQL
- `PORT`: Set by Railway (defaults to 1337)
- Auto-migration from SQLite to PostgreSQL on Railway

## Content Structure

### Page Templates
- `home.html` / `index.html` - Landing page with dynamic hero, courses, testimonials
- `courses.html` - Course catalog with dynamic course grid
- `teachers.html` - Instructor profiles
- `career-center.html` - Career services page
- `career-orientation.html` - Career guidance page
- Multi-language versions in `dist/en/`, `dist/ru/`, `dist/he/`

### Admin Panel
- `content-admin-comprehensive.html` - Custom content management interface
- 215+ editable content fields
- Live preview functionality with `?preview=true`
- Multi-language content editing

### Dynamic Content Integration Points
Pages that connect to Custom API:
- Course listings: `GET /api/courses`
- Teachers: `GET /api/teachers` 
- Blog posts: `GET /api/blog-posts`
- Career content: `GET /api/career-center-page`, `GET /api/career-orientation-page`  
- Home page: `GET /api/home-page`

## Database Schema

### Core Tables
- **courses**: Course catalog with multi-language support
- **teachers**: Instructor profiles
- **blogs**: Blog posts and articles
- **pages**: Dynamic page content (home, career pages)
- **content_en/ru/he**: Localized content tables

### Key Features
- Multi-language support (English, Russian, Hebrew)
- Automatic locale fallback (ru/he → en if not available)
- JSON-based flexible content structure
- Image URL storage (not file uploads)

## Frontend-Backend Communication

The frontend uses client-side JavaScript to communicate with the Custom API:

```javascript
// Get all courses
fetch('https://aistudio555jamstack-production.up.railway.app/api/courses')

// Get home page content
fetch('https://aistudio555jamstack-production.up.railway.app/api/home-page')

// Multi-language content (automatic fallback)
fetch('https://aistudio555jamstack-production.up.railway.app/api/home-page?locale=ru')

// Preview mode
fetch('https://aistudio555jamstack-production.up.railway.app/api/home-page?preview=true')
```

## File Organization

```
/
├── server.js              # Custom Express.js API server
├── migrate-to-railway.js  # Database migration script
├── content-admin-comprehensive.html  # Custom admin interface
├── home.html             # Main landing page
├── courses.html          # Course catalog page
├── teachers.html         # Teachers/instructors page
├── career-center.html    # Career services page
├── career-orientation.html # Career guidance page
├── dist/                 # Built static files for production
│   ├── en/              # English versions
│   ├── ru/              # Russian versions
│   └── he/              # Hebrew versions (RTL)
├── css/                  # Webflow styles + shared components
│   └── uniform-card-styles.css # Standardized card component styles
├── js/                   # Client-side scripts + shared components
│   ├── webflow-strapi-integration.js  # Main API integration (misleading name)
│   ├── strapi-integration.js          # Secondary integration (misleading name)
│   ├── contact-form-modal.js          # Contact form modal with EmailJS integration
│   └── uniform-card-generator.js      # Shared card component system
├── shared/               # Reusable components and templates
│   └── components/       # Shared UI components
│       ├── uniform-card-template.html     # Standardized card HTML template
│       ├── uniform-card-styles.css        # Card component CSS (copied to /css/)
│       └── uniform-card-generator.js      # Card component JS (copied to /js/)
├── images/               # Static assets
├── Docs/                 # Project documentation
│   └── architecture/     # System architecture docs
├── migrations/           # Database migration files
├── scripts/              # Build and utility scripts
└── package.json          # Node.js dependencies and scripts
```

## Important Implementation Notes

### Multi-language Support
- **Supported Languages**: English (en), Russian (ru), Hebrew (he)
- **RTL Support**: Hebrew pages automatically apply RTL styling
- **Fallback System**: Missing translations automatically fall back to English
- **URL Structure**: `/dist/en/`, `/dist/ru/`, `/dist/he/` for language versions

### Dist Directory Structure
- **Purpose**: Production-ready multi-language builds
- **Location**: `/dist/en/`, `/dist/ru/`, `/dist/he/`
- **Access**: `http://localhost:3005/dist/he/career-orientation.html` (development)
- **Content**: Optimized, localized versions of all pages
- **Usage**: The Hebrew version (`dist/he/career-orientation.html`) often contains superior UX patterns
- **Reference Pattern**: Use Hebrew versions as design templates for better UX

### Custom Admin Panel Features
- **215+ Content Fields**: Comprehensive content management
- **Live Preview**: `?preview=true` shows unsaved changes
- **Multi-language Editing**: Switch between language versions
- **Image Management**: URL-based image references
- **JSON Export/Import**: Content backup and restoration

### Content Delivery
- **Static Files**: Served via Python HTTP server or Railway
- **Dynamic Content**: Fetched via JavaScript API calls
- **Caching**: API responses cached client-side for performance
- **Preview Mode**: Live editing with immediate preview

### Security Considerations
- **No Authentication System**: Open API endpoints (development phase)
- **CORS Configuration**: Enabled for all origins in development
- **Railway Deployment**: Production environment with PostgreSQL
- **No File Uploads**: URL-based image/media references only

### Deployment Architecture
- **Railway Platform**: $5/month hosting with PostgreSQL
- **Environment Detection**: Automatic Railway vs local configuration
- **Database Migration**: Automatic SQLite → PostgreSQL on Railway
- **Static File Serving**: Built-in Express.js static file serving

## Critical Frontend Components

### Contact Form Modal System
- **File**: `js/contact-form-modal.js`
- **Purpose**: Handles "Sign Up Today" buttons to open modal instead of navigating
- **Integration**: EmailJS for sending leads + WhatsApp fallback
- **Key Features**:
  - Intercepts all "Sign Up Today" button clicks
  - Opens modal with contact form
  - Sends emails via EmailJS (service_id: service_t2uqbxs)
  - WhatsApp fallback if email fails
  - Auto-retry logic for EmailJS loading

### Career Services Dropdown
- **Styling**: Universal dark theme applied via CSS
- **Files**: All 54+ HTML pages must have consistent dropdown styling
- **CSS Classes**:
  ```css
  .dropdown-list {
    background: rgba(5, 5, 26, 0.98) !important;
    backdrop-filter: blur(20px) !important;
  }
  ```

### Career Orientation Page Design Patterns
- **File**: `career-orientation.html`
- **Design Philosophy**: Human-centered career guidance over technical AI/ML focus
- **Reference Version**: Use Hebrew version (`dist/he/career-orientation.html`) as design template
- **Key UX Patterns**:
  - Glass-morphism hero sections with backdrop-filter blur
  - 4-step career guidance process (not 5-step technical process)
  - Simple name+phone form instead of complex multi-field forms
  - Professional card-based layouts with hover animations
  - Mobile-first responsive design with CSS Grid
  - Phone number input masking for better UX
  - Immediate content visibility (no opacity:0 dependencies)

### UI/UX Enhancement Patterns
```css
/* Glass-morphism hero section */
.hero-value-proposition {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 40px;
}

/* Professional card design */
.challenge-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* Form enhancement patterns */
.form-field input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}
```

### Content Strategy Guidelines
- **Career Pages**: Use human-centered language, not technical jargon
- **Process Flows**: Simplify to 4 clear steps maximum
- **Forms**: Name + Phone only for lead generation forms
- **Visual Hierarchy**: Ensure content is visible without animation dependencies
- **Mobile-First**: All designs must work on mobile before desktop

### Shared Components System
- **Location**: `/shared/components/` directory for template storage
- **Implementation**: Files copied to `/css/` and `/js/` for HTTP server access
- **Uniform Cards**: Standardized card component ensuring identical dimensions
  - Fixed height: 600px (desktop), 580px (tablet), 560px (mobile)
  - Consistent image height: 260px across all cards
  - Auto-applied via JavaScript: `uniform-card-generator.js`
  - CSS-enforced uniformity: `uniform-card-styles.css`
- **Usage**: Include CSS + JS in `<head>` and let system auto-apply uniform sizing
- **Templates**: Reusable HTML templates with placeholder variables

### Path Issues in Subdirectories
- **Important**: Language versions in `/dist/en/`, `/dist/ru/`, `/dist/he/` need relative paths
- **Script References**: Use `../js/` for scripts from language subdirectories
- **Image References**: Check for proper path resolution
- **Shared Components**: Reference from `/css/` and `/js/` directories, not `/shared/`

## Testing and Validation

### Manual Testing URLs
- **Production Website**: https://www.aistudio555.com/home.html
- **Production Admin**: https://aistudio555jamstack-production.up.railway.app/content-admin-comprehensive.html
- **API Health Check**: https://aistudio555jamstack-production.up.railway.app/api/courses

### Development Testing
```bash
# Test API locally
curl http://localhost:3000/api/courses
curl http://localhost:3000/api/home-page

# Test with language parameters
curl "http://localhost:3000/api/home-page?locale=ru"
curl "http://localhost:3000/api/home-page?preview=true"
```

### Automated Testing
```bash
# Run Playwright tests for responsive design
npx playwright test tests/responsive.spec.js

# Quick responsive test
npx playwright test tests/responsive-quick.spec.js

# Test production navigation consistency
node test-production-navigation.js
```

### Critical Test Points
1. **Contact Form Modal**: "Sign Up Today" buttons must open modal, not navigate
2. **EmailJS Loading**: Check console for EmailJS initialization
3. **Career Dropdown**: Verify consistent dark theme across all pages
4. **Banner Images**: Check for 404s in `/en/images/`

## Git Repository

Remote: `git@github.com:sravnenie-ipotek/AiStudio555_Jamstack.git`
- **DO NOT push** without explicit user permission
- **Current branch**: Track feature development carefully
- **Production**: Auto-deploys from main branch to Railway
- **Database**: NEVER delete or reset without user approval

## Common Issues and Solutions

### EmailJS Not Loading
- **Symptom**: "EmailJS library not loaded" in console
- **Solution**: Scripts must be on separate lines in HTML, not concatenated
- **Fallback**: `contact-form-modal.js` has auto-retry and manual loading fallback

### Banner Image 404s
- **Issue**: File names with spaces vs hyphens mismatch
- **Example**: `Banner Man Img1.png` vs `Banner-Man-Img1.png`
- **Solution**: Copy files with correct hyphenated names

### Navigation Inconsistency
- **Issue**: Career Services dropdown styling varies between pages
- **Solution**: Apply universal CSS with `!important` flags
- **Verification**: Use `test-production-navigation.js`

### Script Path Issues
- **Issue**: Scripts fail to load in language subdirectories
- **Wrong**: `src="js/script.js"` in `/dist/en/page.html`
- **Correct**: `src="../js/script.js"` or `src="/js/script.js"`

### UI/UX Issues and Solutions
- **Hidden Content with Opacity:0**:
  - **Problem**: Content hidden with `opacity: 0` waiting for animations that may not load
  - **Solution**: Set `opacity: 1` on critical content elements to ensure immediate visibility
  - **Pattern**: Use `opacity: 1 !important` for content that must be visible

- **Poor Visual Hierarchy**:
  - **Problem**: Technical content overwhelms human-centered messaging
  - **Solution**: Lead with benefits, follow with features. Use Hebrew version patterns.
  - **Example**: "Find Your Perfect Career Path" not "AI-Powered Career Analysis"

- **Complex Forms**:
  - **Problem**: Multi-field forms reduce conversion rates
  - **Solution**: Simplify to name + phone for initial lead capture
  - **Enhancement**: Add input masking and focus states for better UX

- **Animation Dependencies**:
  - **Problem**: Content visibility depends on JavaScript animations loading
  - **Solution**: Ensure content is visible by default, enhance with animations
  - **Pattern**: Progressive enhancement, not animation-dependent visibility

## Key Differences from Standard JAMstack

1. **No Third-Party CMS**: Completely custom Express.js API
2. **No Build Process Required**: Direct HTML serving with API integration
3. **Custom Admin Interface**: HTML-based content management
4. **Railway Database**: Cloud PostgreSQL, not local containers
5. **Multi-language Static Files**: Pre-built language versions
6. **API-First Design**: All content dynamically loaded via JavaScript

---

**Remember**: This is a 100% custom system. All references to "Strapi" in file names are historical/misleading - the system uses a completely custom Express.js API.