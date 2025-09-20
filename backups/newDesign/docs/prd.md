# AI Studio E-Learning Platform - Product Requirements Document (PRD)

## 1. Executive Summary

### Product Overview
AI Studio is a comprehensive e-learning platform specializing in AI and technology education, built using a modern JAMstack architecture with a **100% custom backend**. The platform delivers high-quality online courses, career guidance, and professional development services through a multi-language web application.

### Key Differentiators
- **Custom-Built CMS**: Unlike typical JAMstack implementations, AI Studio uses no third-party CMS (no Strapi, Contentful, or WordPress)
- **Multi-Language Native**: Built-in support for English, Russian, and Hebrew with automatic fallback
- **Career-Focused**: Integrated career orientation and placement services alongside educational content
- **Enterprise-Grade Admin**: Comprehensive content management with 415+ editable fields

### Target Markets
- **Primary**: Russian-speaking professionals seeking AI/tech career transitions
- **Secondary**: Hebrew-speaking tech professionals in Israel
- **Tertiary**: English-speaking global audience interested in AI education

## 2. System Architecture

### 2.1 Technology Stack

#### Frontend
- **Framework**: Pure HTML/CSS/JavaScript (no React/Vue/Angular)
- **Styling**: Webflow-generated CSS with custom enhancements
- **Server**: Python HTTP server (development) / Express static serving (production)
- **Languages**: Multi-language static builds in `/dist/en/`, `/dist/ru/`, `/dist/he/`

#### Backend
- **Server**: Custom Express.js API server
- **Database**: PostgreSQL on Railway Cloud
- **Hosting**: Railway Platform ($5/month)
- **Environment**: Auto-detection of Railway vs local development

#### Infrastructure
```
Frontend (Static HTML) Т Custom Express API Т Railway PostgreSQL
Port 3005/8000        Т Port 1337 (local)   Т Railway Cloud
                        Railway auto-assigns in production
```

### 2.2 Database Architecture

#### Hybrid Schema Design
1. **Page Content Tables** (`nd_` prefix): Store structured page sections with multi-language JSONB
2. **Entity Tables**: Store actual data records (courses, teachers, blogs)
3. **Configuration Tables**: Site settings, navigation, footer content

#### Multi-Language Strategy
- **Storage**: Separate columns for each language (`content_en`, `content_ru`, `content_he`)
- **Fallback**: Automatic cascade: requested_locale Т English Т empty
- **RTL Support**: Automatic for Hebrew content

## 3. Content Management System

### 3.1 Admin Panel Overview

The admin panel (`content-admin-comprehensive.html`) is a single-page application providing complete content control over the entire platform.

#### Access Points
- **Local**: `http://localhost:1337/content-admin-comprehensive.html`
- **Production**: `https://aistudio555jamstack-production.up.railway.app/content-admin-comprehensive.html`

### 3.2 Admin Panel Architecture

#### Core Features
- **415+ Editable Fields**: Comprehensive content control
- **12 Main Sections**: Each with dedicated management interface
- **Multi-Language Support**: Switch between EN/RU/HE with flag buttons
- **Live Preview**: Test changes with `?preview=true` parameter
- **Auto-Save**: Optional 30-second auto-save functionality
- **Toast Notifications**: Real-time feedback for all operations

#### Section Breakdown

##### <а Home Page (123 Fields)
**Subsections:**
- Hero Section: Title, subtitle, description, CTA buttons
- Featured Courses: 6 complete course cards with all details
- Testimonials: Student reviews and ratings
- Statistics: Platform metrics and achievements
- Company Logos: Partner organizations
- FAQ Section: Common questions and answers
- Navigation: Menu items and structure

**Key Fields:**
- `pageTitle`: SEO page title
- `hero_title`, `hero_subtitle`, `hero_description`: Main banner content
- `course_1` through `course_6`: Individual course details
- `testimonial_1` through `testimonial_3`: Student reviews
- `stat_1_number`, `stat_1_label`: Platform statistics

##### =Џ Courses Management (30+ Fields)
**Features:**
- Course catalog management
- Individual course creation/editing
- Category assignment
- Pricing configuration
- Rating and review management
- Featured course selection
- Instructor assignment
- Multi-language titles and descriptions

**Course Object Structure:**
```json
{
  "title": "Course Title",
  "title_ru": "0720=85 :C@A0",
  "title_he": "йЁ ‘з’иб",
  "description": "Course description",
  "price": 299.99,
  "instructor": "John Doe",
  "category": "AI & Machine Learning",
  "rating": 4.8,
  "lessons_count": 24,
  "duration": "6 weeks",
  "featured": true,
  "visible": true
}
```

##### =h<л Teachers/Instructors (25+ Fields)
**LinkedIn-Style Profiles Include:**
- Professional headline and bio
- Years of experience
- Student count metrics
- Skills array (JSONB)
- Work history (JSONB)
- Educational background (JSONB)
- Student reviews (JSONB)
- Social media links
- Availability status
- Premium instructor badge

##### >н Career Orientation (50+ Fields)
**Specialized Sections:**
- Career assessment questionnaire
- 4-step guidance process
- Skills evaluation tools
- Industry recommendations
- Personalized career paths
- Consultation booking
- Success stories
- Resource library

##### <ѓ Career Center (40+ Fields)
**Service Categories:**
- Resume building assistance
- Interview preparation
- Job placement services
- Industry connections
- Mentorship programs
- Skill gap analysis
- Career transition planning
- Networking opportunities

##### =Ё Blog Management (15+ Fields)
**Blog Features:**
- Article creation and editing
- Category and tag management
- Featured post selection
- Author profiles
- Reading time calculation
- View/like/share counters
- Related posts linking
- SEO optimization fields

### 3.3 Content Editing Workflow

#### Standard Workflow
1. **Access Admin Panel**: Navigate to admin URL
2. **Select Section**: Click tab for desired content area
3. **Edit Fields**: Modify content in form fields
4. **Preview Changes**: Use preview mode to test
5. **Save Changes**: Click save button for section
6. **Verify on Frontend**: Check live site for updates

#### Language Management
1. **Switch Language**: Click flag button (<ъ<ш/<ч<ъ/<о<с)
2. **Edit Localized Content**: Fields update to show selected language
3. **Save Per Language**: Each language saves independently
4. **Fallback Testing**: Verify English fallback for missing translations

#### Bulk Operations
- **Save All Sections**: Global save button for all changes
- **Load All Content**: Refresh all sections from database
- **Export/Import**: JSON backup and restoration capability

### 3.4 Field Types and Validation

#### Input Types
1. **Text Fields**: Single-line content (titles, names)
2. **Textareas**: Multi-line content (descriptions, bios)
3. **Number Inputs**: Numeric values (prices, ratings, counts)
4. **Checkboxes**: Boolean flags (visible, featured, published)
5. **Select Dropdowns**: Predefined options (categories, statuses)
6. **JSON Fields**: Complex data (arrays, objects)

#### Validation Rules
- **Required Fields**: Marked with asterisk (*)
- **Format Validation**: Email, URL, phone number formats
- **Length Limits**: Character counts for SEO fields
- **Type Checking**: Numeric fields accept only numbers
- **Dependency Rules**: Related fields validate together

## 4. API Specification

### 4.1 Core Content APIs

#### Home Page API
```
GET /api/nd/home-page?locale={en|ru|he}
Response: Complete home page content with all sections

PUT /api/nd/home-page/{section_key}
Body: Section-specific content update
Sections: hero, features, courses, testimonials, blog, cta_1, faq, etc.
```

#### Courses API
```
GET /api/nd/courses
Query: ?category={category}&featured={true|false}&limit={n}
Response: Array of course objects with full details

POST /api/nd/courses
Body: Complete course object
Response: Created course with ID

PUT /api/nd/courses/{id}
Body: Updated course fields
Response: Updated course object

DELETE /api/nd/courses/{id}
Response: Success/error status
```

#### Teachers API
```
GET /api/nd/teachers
Query: ?featured={true|false}&category={category}
Response: Array of teacher profiles

GET /api/nd/teachers/{id}
Response: Complete teacher profile with all details
```

#### Blog API
```
GET /api/blog-posts
Query: ?page={n}&limit={n}&category={category}&search={query}
Response: Paginated blog posts with metadata

GET /api/blog-posts/{id}
Response: Complete blog post with related content
```

### 4.2 Authentication & Security

#### Current State
- **Development Phase**: No authentication required
- **CORS**: Enabled for all origins
- **Rate Limiting**: Basic rate limiting on auth endpoints

#### Planned Security
```javascript
// Future authentication middleware
POST /api/auth/login
Body: { email, password }
Response: { token, user, permissions }

// Protected endpoints will require:
Headers: { Authorization: "Bearer {token}" }
```

## 5. Frontend Components

### 5.1 Shared Component System

#### Uniform Card Component
**Location**: `/shared/components/`
**Implementation**: Auto-applied via JavaScript

**Features:**
- Fixed dimensions: 600px height (desktop)
- Consistent image height: 260px
- Responsive breakpoints:
  - Desktop: 600px height
  - Tablet: 580px height
  - Mobile: 560px height
- Auto-truncation for long content
- Hover animations

**Usage:**
```html
<div class="uniform-card">
  <img class="uniform-card-image" src="...">
  <div class="uniform-card-content">
    <h3 class="uniform-card-title">Title</h3>
    <p class="uniform-card-description">Description</p>
  </div>
</div>
```

### 5.2 Contact Form Modal

**Purpose**: Convert "Sign Up Today" clicks to leads

**Features:**
- Intercepts all signup buttons
- Opens modal instead of navigation
- EmailJS integration for lead capture
- WhatsApp fallback option
- Auto-retry for library loading
- Phone number masking

**Configuration:**
```javascript
EmailJS Service ID: service_t2uqbxs
Template ID: template_contact
Public Key: [configured in EmailJS]
```

### 5.3 Career Services Dropdown

**Universal Dark Theme:**
```css
.dropdown-list {
  background: rgba(5, 5, 26, 0.98) !important;
  backdrop-filter: blur(20px) !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}
```

## 6. Multi-Language Implementation

### 6.1 URL Structure
```
/dist/en/home.html     Т English version
/dist/ru/home.html     Т Russian version
/dist/he/home.html     Т Hebrew version (RTL)
```

### 6.2 Language Detection
```javascript
// Automatic language detection
const userLang = navigator.language.substring(0, 2);
const supportedLangs = ['en', 'ru', 'he'];
const activeLang = supportedLangs.includes(userLang) ? userLang : 'en';
```

### 6.3 RTL Support
```css
/* Automatic RTL for Hebrew */
html[lang="he"] {
  direction: rtl;
  text-align: right;
}
```

## 7. Deployment & Operations

### 7.1 Development Environment

#### Setup Commands
```bash
# Install dependencies
npm install

# Start API server
npm start  # Port 1337

# Start frontend server
python3 -m http.server 3005

# Run development (concurrent)
npm run dev
```

#### Environment Variables
```env
DATABASE_URL=postgresql://user:pass@host:port/db
PORT=1337
NODE_ENV=development
```

### 7.2 Production Deployment

#### Railway Platform
- **Auto-Deploy**: From GitHub main branch
- **Database**: Managed PostgreSQL instance
- **Environment**: Auto-detected by server.js
- **SSL**: Automatic HTTPS provisioning

#### Build Process
```bash
# Build static files
npm run build

# Preview production
npm run preview
```

### 7.3 Database Management

#### Migration System
```javascript
// Automatic migration on Railway
if (process.env.RAILWAY_ENVIRONMENT) {
  await runMigrations();
}
```

#### Backup Strategy
- **Daily Backups**: Railway automatic backups
- **Export Tool**: Admin panel JSON export
- **Version Control**: Schema in migrations/

## 8. Performance Optimization

### 8.1 Frontend Performance
- **Static Generation**: Pre-built HTML pages
- **CDN Ready**: Static assets cacheable
- **Lazy Loading**: Images load on scroll
- **Minification**: CSS/JS minified in production

### 8.2 Backend Performance
- **Database Indexes**: On frequently queried fields
- **JSONB Queries**: Optimized for PostgreSQL
- **Connection Pooling**: Managed by pg client
- **Response Caching**: Client-side caching headers

### 8.3 Monitoring
- **Railway Metrics**: CPU, memory, request metrics
- **Error Tracking**: Console logging to Railway
- **Uptime Monitoring**: Railway health checks

## 9. Content Strategy

### 9.1 Content Guidelines
- **Human-Centered Language**: Benefits over features
- **Simplified Processes**: Maximum 4 steps
- **Minimal Forms**: Name + phone for leads
- **Mobile-First**: All designs mobile-responsive
- **Visual Hierarchy**: Clear content structure

### 9.2 SEO Strategy
- **Meta Tags**: Page-specific SEO fields
- **Structured Data**: JSON-LD for courses
- **Sitemap**: Auto-generated XML sitemap
- **URL Structure**: Clean, semantic URLs

## 10. Future Enhancements

### 10.1 Planned Features
- [ ] User authentication system
- [ ] Student dashboard
- [ ] Course progress tracking
- [ ] Payment integration
- [ ] Email marketing automation
- [ ] Advanced analytics dashboard
- [ ] AI-powered content recommendations
- [ ] Live chat support
- [ ] Mobile app (React Native)

### 10.2 Technical Improvements
- [ ] GraphQL API layer
- [ ] Redis caching layer
- [ ] WebSocket real-time updates
- [ ] Microservices architecture
- [ ] Kubernetes deployment
- [ ] CI/CD pipeline enhancement
- [ ] Automated testing suite
- [ ] Performance monitoring (APM)

## 11. Success Metrics

### 11.1 Business KPIs
- **Course Enrollments**: Target 500/month
- **Conversion Rate**: >3% visitor to enrollment
- **Student Satisfaction**: >4.5/5.0 rating
- **Course Completion**: >70% completion rate
- **Revenue Growth**: 20% MoM

### 11.2 Technical KPIs
- **Page Load Time**: <2 seconds
- **API Response Time**: <200ms average
- **Uptime**: >99.9% availability
- **Error Rate**: <0.1% of requests
- **Database Query Time**: <50ms average

## 12. Risk Mitigation

### 12.1 Technical Risks
- **Database Failure**: Railway automatic backups + manual exports
- **API Downtime**: Static content fallback
- **Performance Issues**: Horizontal scaling on Railway
- **Security Breach**: Regular security audits

### 12.2 Business Risks
- **Content Quality**: Editorial review process
- **Language Accuracy**: Professional translators
- **Market Competition**: Unique career focus
- **Scaling Challenges**: Modular architecture

## Appendix A: Database Schema Summary

### Core Tables
1. **nd_home**: Home page sections (11 sections)
2. **nd_pricing_page**: Pricing page content (6 sections)
3. **nd_about_page**: About page content (8 sections)
4. **nd_courses**: Course catalog with multi-language
5. **entity_teachers**: Teacher profiles (LinkedIn-style)
6. **blog_posts**: Blog articles with engagement metrics
7. **nd_menu**: Navigation structure
8. **nd_footer**: Footer content (20 items)

### Configuration Tables
- **site_settings**: Global configuration
- **button_texts**: UI text translations
- **statistics**: Platform metrics
- **company_logos**: Partner logos
- **faqs**: Frequently asked questions

## Appendix B: API Endpoint Summary

### Content Endpoints (60+ total)
- Home Page: 6 endpoints
- Courses: 8 endpoints
- Teachers: 7 endpoints
- Blog: 6 endpoints
- Career: 8 endpoints
- Settings: 5 endpoints
- Navigation: 4 endpoints
- Authentication: 4 endpoints
- Migration: 12+ endpoints

## Appendix C: Admin Panel Field Mapping

### Total Fields: 415+
- Home Page: 123 fields
- Career Orientation: 50+ fields
- Career Center: 40+ fields
- About Us: 35+ fields
- Courses: 30+ fields
- Teachers: 25+ fields
- Contact: 25+ fields
- Pricing: 20+ fields
- Footer: 20+ fields
- Course Detail: 15+ fields
- Blog: 15+ fields
- Blog Detail: 12+ fields

---

## Document Information
- **Version**: 1.0.0
- **Last Updated**: December 2024
- **Author**: AI Studio Development Team
- **Status**: Active Development
- **Next Review**: January 2025

## Contact Information
- **Project Repository**: `git@github.com:sravnenie-ipotek/AiStudio555_Jamstack.git`
- **Production URL**: https://www.aistudio555.com
- **Admin Panel**: https://aistudio555jamstack-production.up.railway.app/content-admin-comprehensive.html
- **API Documentation**: Available at `/api/docs` endpoint