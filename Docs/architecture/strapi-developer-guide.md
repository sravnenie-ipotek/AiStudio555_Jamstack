# Strapi Developer Guide - AI Studio JAMstack Platform

## 📚 Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Quick Start](#quick-start)
4. [Development Workflow](#development-workflow)
5. [Content Types & API](#content-types--api)
6. [Common Tasks](#common-tasks)
7. [Debugging & Troubleshooting](#debugging--troubleshooting)
8. [Production Deployment](#production-deployment)
9. [Security & Best Practices](#security--best-practices)

---

## Overview

### What is Strapi in Our Project?
Strapi serves as the **Headless CMS** for our AI Studio e-learning platform. It manages:
- Lead capture forms
- Course content (future)
- User authentication (future)
- Multi-language content (EN/RU/HE)
- Dynamic content API endpoints

### Current Implementation Status
- ✅ Strapi Cloud deployed
- ✅ Basic API structure
- ⏳ Lead content type (needs setup)
- ⏳ API permissions (needs configuration)
- ❌ Course management (future)
- ❌ User authentication (future)

---

## Architecture

### System Components
```
┌─────────────────────────────────────────┐
│         STATIC SITES (GitHub Pages)      │
│  /en/ → English | /ru/ → Russian | /he/ → Hebrew │
└────────────────┬────────────────────────┘
                 │ API Calls
                 ↓
┌─────────────────────────────────────────┐
│         STRAPI CLOUD (CMS)               │
│  URL: aistudio555-7dd54e37f0-*.strapiapp.com │
│  • Content Management                    │
│  • Lead Collection                       │
│  • API Endpoints                         │
└─────────────────────────────────────────┘
```

### Key URLs
- **Production CMS**: `https://aistudio555-7dd54e37f0-sublime-basket-82bd4586b5.strapiapp.com`
- **Admin Panel**: `/admin`
- **API Base**: `/api`
- **Local Development**: `http://localhost:1337`

### Directory Structure
```
/strapi/
├── config/           # Configuration files
│   ├── database.ts   # Database connection
│   ├── server.ts     # Server settings
│   └── plugins.ts    # Plugin configuration
├── src/
│   ├── api/         # API endpoints & content types
│   │   └── lead/    # Lead collection endpoint
│   ├── components/  # Reusable field groups
│   └── index.ts     # Bootstrap & lifecycle hooks
├── public/          # Static assets
└── .strapi-cloud.json # Cloud deployment config
```

---

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Strapi Cloud account (FREE tier)

### Local Development Setup
```bash
# 1. Navigate to Strapi directory
cd strapi/

# 2. Install dependencies
npm install

# 3. Set environment variables
cp .env.example .env
# Edit .env with your database credentials

# 4. Start development server
npm run develop
# Admin: http://localhost:1337/admin
```

### First-Time Admin Setup
1. Visit `http://localhost:1337/admin`
2. Create admin account
3. Configure content types
4. Set API permissions

---

## Development Workflow

### Creating Content Types

#### Via Admin UI (Recommended for beginners)
1. Go to **Content-Type Builder**
2. Click **Create new collection type**
3. Define fields and relationships
4. Save and restart server

#### Via Code (For version control)
```javascript
// src/api/lead/content-types/lead/schema.json
{
  "kind": "collectionType",
  "collectionName": "leads",
  "info": {
    "singularName": "lead",
    "pluralName": "leads",
    "displayName": "Lead"
  },
  "attributes": {
    "name": {
      "type": "string",
      "required": true
    },
    "email": {
      "type": "email",
      "required": true,
      "unique": true
    },
    "phone": {
      "type": "string"
    },
    "message": {
      "type": "richtext"
    },
    "language": {
      "type": "enumeration",
      "enum": ["en", "ru", "he"]
    },
    "source": {
      "type": "string"
    }
  }
}
```

### API Endpoints

#### Default REST Endpoints
```javascript
// Automatically generated for each content type
GET    /api/leads       // Get all leads
GET    /api/leads/:id   // Get single lead
POST   /api/leads       // Create lead
PUT    /api/leads/:id   // Update lead
DELETE /api/leads/:id   // Delete lead
```

#### Custom Controllers
```javascript
// src/api/lead/controllers/lead.js
module.exports = {
  async customAction(ctx) {
    try {
      // Custom business logic
      const data = await strapi.service('api::lead.lead').customMethod();
      ctx.body = data;
    } catch (err) {
      ctx.throw(500, err);
    }
  }
};
```

### Frontend Integration

#### Form Submission Example
```javascript
// In your static HTML/JS files
async function submitLead(formData) {
  const response = await fetch('https://your-strapi.strapiapp.com/api/leads', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      data: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        language: document.documentElement.lang,
        source: window.location.pathname
      }
    })
  });
  
  if (!response.ok) {
    throw new Error('Submission failed');
  }
  
  return response.json();
}
```

---

## Content Types & API

### Current Content Types

#### Lead (To be implemented)
- **Purpose**: Capture form submissions
- **Fields**: name, email, phone, message, language, source
- **Permissions**: Public create, Admin read/update/delete

### Future Content Types

#### Course
```javascript
{
  "attributes": {
    "title": { "type": "string", "required": true },
    "description": { "type": "richtext" },
    "price": { "type": "decimal" },
    "duration": { "type": "integer" },
    "instructor": { "type": "relation", "relation": "manyToOne" },
    "lessons": { "type": "relation", "relation": "oneToMany" },
    "thumbnail": { "type": "media" }
  }
}
```

#### User Extensions
```javascript
// Extend built-in User model
{
  "attributes": {
    "courses": { "type": "relation", "relation": "manyToMany" },
    "progress": { "type": "json" },
    "subscription": { "type": "enumeration", "enum": ["free", "pro", "enterprise"] }
  }
}
```

---

## Common Tasks

### 1. Setting API Permissions
```bash
# Via Admin Panel
Settings → Roles → Public → Permissions
□ Lead
  ☑ create  # Allow form submissions
  ☑ find    # Optional: public listing
  ☐ findOne # Keep private
  ☐ update  # Keep private
  ☐ delete  # Keep private
```

### 2. Database Migrations
```javascript
// database/migrations/create-leads-table.js
module.exports = {
  async up(knex) {
    await knex.schema.createTable('leads', table => {
      table.increments('id');
      table.string('name');
      table.string('email');
      table.timestamps();
    });
  },
  async down(knex) {
    await knex.schema.dropTable('leads');
  }
};
```

### 3. Environment Configuration
```bash
# .env file structure
HOST=0.0.0.0
PORT=1337
APP_KEYS=random-key-1,random-key-2
API_TOKEN_SALT=random-salt
ADMIN_JWT_SECRET=random-secret
JWT_SECRET=random-jwt
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=strapi
```

### 4. Multi-language Setup
```javascript
// config/plugins.js
module.exports = {
  i18n: {
    enabled: true,
    config: {
      defaultLocale: 'en',
      locales: ['en', 'ru', 'he']
    }
  }
};
```

---

## Debugging & Troubleshooting

### Common Issues & Solutions

#### 1. SSL Certificate Error (Strapi Cloud)
```bash
# Problem: ERR_SSL_VERSION_OR_CIPHER_MISMATCH
# Solution: Wait 15-20 minutes for SSL propagation
# Workaround: Use HTTP temporarily
curl http://your-project.strapiapp.com/api/leads
```

#### 2. Database Connection Failed
```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Test connection
psql -h localhost -U strapi -d strapi

# Common fix
DATABASE_HOST=localhost  # For local
DATABASE_HOST=postgres   # For Docker
```

#### 3. Build Errors
```bash
# TypeScript errors
npm run build -- --debug

# Clean build
rm -rf dist/ .cache/
npm run build

# Missing dependencies
npm install
npm audit fix
```

#### 4. API Returns 403 Forbidden
```javascript
// Check permissions
// Admin → Settings → Roles → Public
// Ensure 'find' and 'create' are checked for your content type

// Check token if using authenticated endpoints
headers: {
  'Authorization': `Bearer ${token}`
}
```

### Debug Commands
```bash
# View logs
npm run develop -- --debug

# Interactive console
npm run strapi console

# Database inspection
npm run strapi db:query "SELECT * FROM leads"

# Clear cache
rm -rf .cache/ .tmp/
```

---

## Production Deployment

### Strapi Cloud Deployment
```bash
# Deploy to Strapi Cloud
cd strapi/
npx @strapi/strapi deploy

# Force redeploy
npx @strapi/strapi deploy --force
```

### Environment Variables (Production)
```javascript
// Use Strapi Cloud dashboard to set:
DATABASE_URL=postgres://user:pass@host:5432/db
NODE_ENV=production
STRAPI_ADMIN_CLIENT_URL=https://your-site.com
STRAPI_ADMIN_CLIENT_PREVIEW_SECRET=secret-key
```

### Performance Optimization
```javascript
// config/server.js
module.exports = {
  host: '0.0.0.0',
  port: process.env.PORT || 1337,
  app: {
    keys: process.env.APP_KEYS.split(','),
  },
  webhooks: {
    populateRelations: false, // Disable auto-population
  },
};
```

---

## Security & Best Practices

### Security Checklist
- [ ] Never commit `.env` files
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting
- [ ] Configure CORS properly
- [ ] Use HTTPS in production
- [ ] Implement role-based access
- [ ] Sanitize user inputs
- [ ] Regular security updates

### API Security
```javascript
// config/middlewares.js
module.exports = [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'script-src': ["'self'", "'unsafe-inline'"],
          'img-src': ["'self'", 'data:', 'blob:', 'https:'],
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
```

### Rate Limiting
```javascript
// Install koa-ratelimit
npm install koa-ratelimit

// config/middlewares.js
const ratelimit = require('koa-ratelimit');

module.exports = [
  // ... other middlewares
  {
    resolve: './src/middlewares/ratelimit',
    config: {
      interval: { min: 1 },
      max: 100, // 100 requests per minute
    },
  },
];
```

---

## Useful Commands Reference

```bash
# Development
npm run develop          # Start with hot-reload
npm run build           # Build for production
npm run start           # Start production server

# Strapi CLI
npm run strapi generate  # Generate new API
npm run strapi console   # Interactive console
npm run strapi admin:reset-user-password  # Reset admin password

# Database
npm run strapi db:seed   # Run seeders
npm run strapi db:query  # Execute SQL

# Deployment
npx @strapi/strapi deploy  # Deploy to Strapi Cloud
```

---

## Getting Help

### Resources
- **Strapi Documentation**: https://docs.strapi.io
- **Project Repo**: https://github.com/sravnenie-ipotek/AiStudio555_Jamstack
- **Strapi Cloud Dashboard**: https://cloud.strapi.io
- **Community Forum**: https://forum.strapi.io

### Common File Locations
- **API Token**: `webflow-strapi-integration.js:19`
- **Build Script**: `scripts/build-jamstack.js`
- **Commands**: `Docs/architecture/commands.md`
- **This Guide**: `Docs/architecture/strapi-developer-guide.md`

### Contact & Support
- Check `CLAUDE.md` for AI assistant instructions
- Review `commands.md` for operational commands
- Submit issues to GitHub repository

---

**Last Updated**: September 7, 2025  
**Strapi Version**: 5.x  
**Deployment**: Strapi Cloud FREE Tier  
**Status**: Production Ready (pending content type setup)