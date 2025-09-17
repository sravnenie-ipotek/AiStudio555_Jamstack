# AI Studio Infrastructure - Custom Live API Architecture

## Overview
Due to a critical bug in Strapi v5 where all API endpoints return 404 errors, we've implemented a custom Live API architecture that bypasses Strapi entirely while maintaining the same data structure and functionality.

## Current Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     RAILWAY PLATFORM                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────┐     │
│  │            UNIFIED NODE.JS SERVER                   │     │
│  │              (server.js - Port 3000)                │     │
│  ├────────────────────────────────────────────────────┤     │
│  │                                                     │     │
│  │  1. Static File Server                             │     │
│  │     ├── index.html (Homepage)                      │     │
│  │     ├── courses.html                               │     │
│  │     ├── admin panel (content-admin-comprehensive)  │     │
│  │     └── All CSS/JS/Images                          │     │
│  │                                                     │     │
│  │  2. Custom Live API Endpoints                      │     │
│  │     ├── GET  /api/home-page (123 fields!)          │     │
│  │     ├── GET  /api/courses                          │     │
│  │     ├── GET  /api/blog-posts                       │     │
│  │     ├── GET  /api/teachers                         │     │
│  │     ├── POST /api/courses                          │     │
│  │     ├── PUT  /api/courses/:id                      │     │
│  │     ├── PUT  /api/home-page/:id                    │     │
│  │     └── DELETE /api/courses/:id                    │     │
│  │                                                     │     │
│  └────────────────────────────────────────────────────┘     │
│                              │                               │
│                              ▼                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │           POSTGRESQL DATABASE                       │     │
│  │         (Railway Managed - Port 5432)               │     │
│  ├────────────────────────────────────────────────────┤     │
│  │  Tables:                                            │     │
│  │  • home_pages (123 columns!)                        │     │
│  │  • courses                                          │     │
│  │  • blog_posts                                       │     │
│  │  • teachers                                         │     │
│  │  • pricing_plans                                    │     │
│  │  • job_postings                                     │     │
│  │  • career_resources                                 │     │
│  │  • about_pages                                      │     │
│  │  • contact_pages                                    │     │
│  │  • faqs                                             │     │
│  └────────────────────────────────────────────────────┘     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Why This Architecture?

### The Problem: Strapi v5 Critical Bug
- **Issue**: All Strapi `/api/*` endpoints return 404 errors
- **Impact**: Cannot use Strapi's REST API, GraphQL, or any plugins
- **Root Cause**: Route registration failure in Strapi v5 core
- **Documentation**: `/Docs/architecture/strapi/PROBLEM/bugInStrapi.md`

### Our Solution: Custom Live API
Instead of fixing Strapi (which we couldn't), we built a complete replacement API layer that:
1. Reads directly from the database
2. Maintains Strapi's data structure
3. Provides the same endpoints
4. Works with our existing frontend

## Key Components

### 1. server.js (Main Server)
**Location**: `/server.js`
**Purpose**: Unified server for Railway deployment
**Features**:
- Serves static HTML/CSS/JS files
- Handles all API requests
- Manages database connections
- Auto-migrates data on startup

```javascript
// Key configuration
const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL; // Railway PostgreSQL

// Serves both frontend and API
app.use(express.static('.')); // Static files
app.get('/api/*', handleApiRequest); // API endpoints
```

### 2. migrate-to-railway.js (Database Migration)
**Location**: `/migrate-to-railway.js`
**Purpose**: Migrates SQLite data to PostgreSQL
**Features**:
- Creates all necessary tables
- Preserves all 123 home page fields
- Runs automatically on deployment
- Handles data type conversions

### 3. Database Schema
**Home Page Table** (123 fields):
- Hero section fields (5)
- Featured courses section (3)
- About section (4)
- Companies section (3)
- Testimonials section (3)
- 6 complete courses (7 fields each = 42)
- 4 testimonials (4 fields each = 16)
- Metadata fields

### 4. Frontend Integration
**Key Files**:
- `strapi-home-integration.js` - Fetches content every 5 seconds
- `content-admin-comprehensive.html` - Admin panel for content management
- All HTML pages use fetch() to get data from `/api/*`

## Environment Variables

```bash
# Automatically set by Railway
DATABASE_URL=postgresql://user:pass@host:5432/railway
PORT=3000
NODE_ENV=production

# Our configuration
CORS_ORIGIN=*
API_MODE=live
```

## API Endpoints

### Read Operations
```
GET /api/home-page      # Complete home page data (123 fields)
GET /api/courses        # All courses
GET /api/blog-posts     # Blog content
GET /api/teachers       # Instructor profiles
GET /api/pricing-plans  # Pricing tiers
GET /api/faqs          # Frequently asked questions
GET /api/status        # System health check
```

### Write Operations
```
POST   /api/courses      # Create new course
PUT    /api/courses/:id  # Update course
DELETE /api/courses/:id  # Delete course
PUT    /api/home-page/1  # Update home page content
```

## Database Connection Flow

```javascript
// Local Development (SQLite)
if (!process.env.DATABASE_URL) {
  const sqlite3 = require('sqlite3');
  const db = new sqlite3.Database('./strapi-fresh/.tmp/data.db');
}

// Production (Railway PostgreSQL)
else {
  const { Client } = require('pg');
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
}
```

## Deployment Process

1. **Code Push to GitHub**
   ```bash
   git add .
   git commit -m "Update"
   git push origin main
   ```

2. **Railway Auto-Deploy**
   - Detects push to main branch
   - Runs `npm install`
   - Executes migration script (postinstall)
   - Starts server with `npm start`

3. **Migration on First Deploy**
   - Creates PostgreSQL tables
   - Copies data from SQLite
   - Sets up indexes

## File Structure

```
/
├── server.js                    # Main unified server
├── migrate-to-railway.js        # Database migration script
├── package.json                 # Dependencies & scripts
├── nixpacks.toml               # Railway build config
├── railway.toml                # Railway deployment config
│
├── /Docs/architecture/strapi/
│   ├── PROBLEM/bugInStrapi.md  # Bug documentation
│   └── alternativeToStrapi/    # This architecture
│
├── strapi-home-integration.js   # Frontend content loader
├── content-admin-comprehensive.html # Admin panel
│
└── strapi-fresh/
    └── .tmp/data.db            # Local SQLite database
```

## How It Works

### Request Flow
1. User visits `https://app.railway.app`
2. Railway serves static HTML from `server.js`
3. HTML loads `strapi-home-integration.js`
4. JavaScript fetches from `/api/home-page`
5. Server queries PostgreSQL database
6. Returns JSON data
7. JavaScript updates DOM

### Data Flow
```
Browser → Fetch API → Express Server → PostgreSQL → JSON Response → DOM Update
```

## Advantages of This Architecture

1. **No External Dependencies**
   - Everything runs in Railway
   - No Strapi Cloud needed
   - No external APIs

2. **Better Performance**
   - Direct database queries
   - No Strapi overhead
   - Optimized for our needs

3. **Full Control**
   - Custom endpoints
   - Tailored responses
   - Easy debugging

4. **Cost Effective**
   - Single Railway deployment
   - One PostgreSQL database
   - No Strapi licensing

## Limitations

1. **No Strapi Admin Panel**
   - Built custom admin interface
   - Less feature-rich than Strapi

2. **Manual API Development**
   - Each endpoint coded manually
   - No automatic CRUD generation

3. **No Plugin Ecosystem**
   - Can't use Strapi plugins
   - Build features from scratch

## Maintenance Guide

### Adding New Content Type
1. Add table to migration script
2. Create API endpoint in server.js
3. Update admin panel if needed
4. Deploy to Railway

### Updating Content
- Use admin panel at `/admin`
- Direct database updates via Railway dashboard
- API calls from frontend

### Debugging
```bash
# Check deployment logs
railway logs

# Test API locally
curl http://localhost:3000/api/status

# Connect to production database
railway run psql $DATABASE_URL
```

## Future Improvements

1. **Authentication**
   - Add JWT tokens
   - User management
   - Role-based access

2. **Caching**
   - Redis for API responses
   - Static asset CDN
   - Database query optimization

3. **Monitoring**
   - Error tracking (Sentry)
   - Performance monitoring
   - Uptime checks

## Conclusion

This architecture completely replaces Strapi's broken API layer with a custom, lightweight solution. While it requires more manual development, it provides:
- Complete control over the API
- Better performance
- Lower costs
- Simpler deployment

The trade-off is worth it given Strapi v5's critical bug that makes it unusable for API delivery.

---

**Last Updated**: September 2025
**Status**: Production Ready
**Deployment**: Railway (All-in-one)
**Database**: PostgreSQL (Railway managed)