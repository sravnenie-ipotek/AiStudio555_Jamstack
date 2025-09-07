# =Ä STRAPI MIGRATION MVP - COMPLETE IMPLEMENTATION STRATEGY

## =  PROJECT OVERVIEW

**Goal:** Migrate static Webflow site to Strapi CMS with multi-language support, approval workflow, and visual content management

**Budget:** $5/month  
**Timeline:** 5 weeks  
**Languages:** English, Russian, Hebrew (RTL)  
**Architecture:** Section-Based Content Structure  

---

## <◊ INFRASTRUCTURE SETUP

### **Hosting Architecture**
```
Frontend (HTML/CSS/JS) í Vercel (Free)
Backend (Strapi) í Railway ($5/month)
Database (PostgreSQL) í Railway (Included)
Images í Cloudinary (Free tier)
Email í Resend (Free - 3000/month)
```

---

# =≈ **PHASE 1: FOUNDATION (Week 1)**
**Goal:** Basic Strapi setup with database and authentication

## Day 1-2: Environment Setup

### 1.1 Initialize Strapi Project
```bash
# Create new Strapi project
npx create-strapi-app@latest strapi-backend --quickstart --no-run

# Install required dependencies
cd strapi-backend
npm install @strapi/provider-upload-cloudinary
npm install @strapi/provider-email-nodemailer  
npm install @strapi/plugin-i18n
npm install koa-helmet
npm install koa-ratelimit
```

### 1.2 Create Environment Configuration
```bash
# .env.example (CRITICAL - Don't forget any!)
NODE_ENV=development
HOST=0.0.0.0
PORT=1337
APP_KEYS=toBeGenerated1,toBeGenerated2,toBeGenerated3,toBeGenerated4
API_TOKEN_SALT=toBeGenerated
ADMIN_JWT_SECRET=toBeGenerated
TRANSFER_TOKEN_SALT=toBeGenerated
JWT_SECRET=toBeGenerated

# Database (Railway will provide)
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=strapi
DATABASE_SSL=false

# Cloudinary (get from dashboard)
CLOUDINARY_NAME=your-cloud-name
CLOUDINARY_KEY=your-api-key
CLOUDINARY_SECRET=your-api-secret

# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=noreply@yoursite.com
EMAIL_REPLY_TO=support@yoursite.com

# Frontend URLs (for CORS)
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:1337

# Security
RATE_LIMIT_INTERVAL=60000
RATE_LIMIT_MAX=100
```

### 1.3 Configure Strapi Core
```javascript
// config/server.js
module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});

// config/admin.js
module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  // Multi-language admin panel
  languages: ['en', 'ru', 'he'],
});

// config/database.js
module.exports = ({ env }) => {
  const client = env('DATABASE_CLIENT', 'postgres');
  
  const connections = {
    postgres: {
      connection: {
        connectionString: env('DATABASE_URL'),
        host: env('DATABASE_HOST', 'localhost'),
        port: env.int('DATABASE_PORT', 5432),
        database: env('DATABASE_NAME', 'strapi'),
        user: env('DATABASE_USERNAME', 'strapi'),
        password: env('DATABASE_PASSWORD', 'strapi'),
        ssl: env.bool('DATABASE_SSL', false) && {
          rejectUnauthorized: false
        },
      },
      pool: { min: 0, max: 5 },
    },
  };
  
  return {
    connection: {
      client,
      ...connections[client],
      acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 60000),
    },
  };
};
```

### 1.4 Security & Middleware Setup
```javascript
// config/middlewares.js
module.exports = [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'res.cloudinary.com'],
          'media-src': ["'self'", 'data:', 'blob:', 'res.cloudinary.com'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      headers: '*',
      origin: (ctx) => {
        const allowedOrigins = [
          process.env.FRONTEND_URL,
          'https://yoursite.com',
          'https://www.yoursite.com',
          'http://localhost:3000',
          'http://localhost:3001',
        ];
        
        const origin = ctx.request.header.origin;
        if (allowedOrigins.includes(origin)) {
          return origin;
        }
        return allowedOrigins[0];
      },
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];

// src/middlewares/rate-limit.js
const rateLimit = require('koa-ratelimit');
const Redis = require('ioredis');

module.exports = (config, { strapi }) => {
  const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
  });
  
  return rateLimit({
    driver: 'redis',
    db: redis,
    duration: config.duration || 60000, // 1 minute
    max: config.max || 100,
    id: (ctx) => ctx.ip,
    throw: true,
    errorMessage: 'Too many requests, please try again later.',
  });
};
```

## Day 3-4: Content Structure & Models

### 1.5 Create Content Types
```javascript
// CRITICAL CONTENT TYPES FOR SECTION-BASED ARCHITECTURE

// 1. Pages Collection (api/page/content-types/page/schema.json)
{
  "kind": "collectionType",
  "collectionName": "pages",
  "info": {
    "singularName": "page",
    "pluralName": "pages",
    "displayName": "Pages",
    "description": "Main website pages"
  },
  "attributes": {
    "pageName": {
      "type": "string",
      "required": true
    },
    "slug": {
      "type": "uid",
      "targetField": "pageName",
      "required": true
    },
    "htmlFile": {
      "type": "string",
      "required": true
    },
    "isPageActive": {
      "type": "boolean",
      "default": true
    },
    "metaTitle": {
      "type": "string",
      "maxLength": 60
    },
    "metaDescription": {
      "type": "string",
      "maxLength": 160
    },
    "sections": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::page-section.page-section",
      "mappedBy": "parentPage"
    },
    "lastApprovedBy": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "admin::user"
    },
    "lastApprovedAt": {
      "type": "datetime"
    }
  }
}

// 2. Page Sections Collection (api/page-section/content-types/page-section/schema.json)
{
  "kind": "collectionType",
  "collectionName": "page_sections",
  "info": {
    "singularName": "page-section",
    "pluralName": "page-sections",
    "displayName": "Page Sections",
    "description": "Individual page sections with content"
  },
  "attributes": {
    "sectionIdentifier": {
      "type": "string",
      "required": true,
      "unique": false
    },
    "sectionName": {
      "type": "json",
      "required": true,
      // Will contain: { en: "Hero Banner", ru: ";02=K9 10==5@", he: "—–‡Ë Ë–ÈŸ" }
    },
    "parentPage": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::page.page",
      "inversedBy": "sections"
    },
    "displayOrder": {
      "type": "integer",
      "default": 0
    },
    "isVisible": {
      "type": "boolean",
      "default": true
    },
    "content": {
      "type": "json"
      // Will contain all text fields
    },
    "media": {
      "type": "json"
      // Will contain image references
    },
    "liveVersion": {
      "type": "json"
    },
    "draftVersion": {
      "type": "json"  
    },
    "approvalStatus": {
      "type": "enumeration",
      "enum": ["draft", "pending_approval", "approved", "rejected", "live"],
      "default": "draft"
    },
    "hasPendingChanges": {
      "type": "boolean",
      "default": false
    },
    "lastEditedBy": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "admin::user"
    },
    "lastEditedAt": {
      "type": "datetime"
    },
    "screenshots": {
      "type": "json"
      // { thumbnail: "url", fullPage: "url", highlighted: "url" }
    },
    "visualGuide": {
      "type": "json"
      // { en: "Look for...", ru: "0948B5...", he: "◊‰È..." }
    },
    "colorCode": {
      "type": "string",
      "default": "#4945FF"
    },
    "iconIdentifier": {
      "type": "string",
      "default": "=ƒ"
    }
  }
}

// 3. Approval Requests Collection (api/approval-request/content-types/approval-request/schema.json)
{
  "kind": "collectionType",
  "collectionName": "approval_requests",
  "info": {
    "singularName": "approval-request",
    "pluralName": "approval-requests",
    "displayName": "Approval Requests"
  },
  "attributes": {
    "contentType": {
      "type": "string",
      "required": true
    },
    "contentId": {
      "type": "integer",
      "required": true
    },
    "requestedBy": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "admin::user"
    },
    "requestedAt": {
      "type": "datetime",
      "required": true
    },
    "changesSummary": {
      "type": "text"
    },
    "previousContent": {
      "type": "json"
    },
    "proposedContent": {
      "type": "json"
    },
    "status": {
      "type": "enumeration",
      "enum": ["pending", "approved", "rejected"],
      "default": "pending"
    },
    "reviewedBy": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "admin::user"
    },
    "reviewedAt": {
      "type": "datetime"
    },
    "reviewComments": {
      "type": "text"
    },
    "previewUrl": {
      "type": "string"
    }
  }
}

// 4. Global Settings Single Type (api/global-setting/content-types/global-setting/schema.json)
{
  "kind": "singleType",
  "collectionName": "global_settings",
  "info": {
    "singularName": "global-setting",
    "pluralName": "global-settings",
    "displayName": "Global Settings"
  },
  "attributes": {
    "siteName": {
      "type": "string"
    },
    "logo": {
      "type": "media",
      "allowedTypes": ["images"]
    },
    "favicon": {
      "type": "media",
      "allowedTypes": ["images"]
    },
    "primaryColor": {
      "type": "string"
    },
    "mainNavigation": {
      "type": "json"
    },
    "footerContent": {
      "type": "json"
    },
    "socialLinks": {
      "type": "json"
    }
  }
}
```

## Day 5: User Roles & Permissions

### 1.6 Configure User Hierarchy
```javascript
// Create roles via Strapi Admin Panel:

// 1. Super Admin (Built-in)
// Full access to everything

// 2. Content Manager Role
{
  name: "Content Manager",
  description: "Can edit content but needs approval",
  permissions: {
    // Page Sections
    "api::page-section": {
      create: true,
      read: true,
      update: true,  // Will be intercepted by lifecycle
      delete: false
    },
    // Approval Requests
    "api::approval-request": {
      create: true,
      read: { own: true },  // Only see own requests
      update: false,
      delete: false
    },
    // Media Library
    "plugin::upload": {
      read: true,
      create: true,
      update: true,
      delete: false
    },
    // Admin Panel Access
    "admin::marketplace": { read: false },
    "admin::settings": { read: false },
    "admin::users": { read: false }
  }
}

// 3. Content Viewer Role
{
  name: "Content Viewer",
  description: "Read-only access",
  permissions: {
    "api::page": { read: true },
    "api::page-section": { read: true },
    "plugin::upload": { read: true }
  }
}
```

---

# =≈ **PHASE 2: CORE FEATURES (Week 2)**
**Goal:** Implement approval workflow, version history, and safety features

## Day 6-7: Approval Workflow

### 2.1 Lifecycle Hooks for Approval System
```javascript
// src/api/page-section/content-types/page-section/lifecycles.js
module.exports = {
  async beforeUpdate(event) {
    const { params, state } = event;
    
    // Get current user
    const userId = state.user?.id;
    if (!userId) return;
    
    const user = await strapi.entityService.findOne('admin::user', userId, {
      populate: ['roles']
    });
    
    const isSuperAdmin = user.roles.some(role => 
      role.code === 'strapi-super-admin' || role.name === 'Super Admin'
    );
    
    if (!isSuperAdmin) {
      // Content Manager is editing - save to draft
      const currentData = await strapi.entityService.findOne(
        'api::page-section.page-section',
        params.where.id
      );
      
      // Save current as draft
      params.data = {
        ...params.data,
        draftVersion: params.data,
        hasPendingChanges: true,
        approvalStatus: 'pending_approval',
        lastEditedBy: userId,
        lastEditedAt: new Date()
      };
      
      // Don't update live version
      delete params.data.liveVersion;
      delete params.data.content;
      
      // Create approval request
      await strapi.entityService.create('api::approval-request.approval-request', {
        data: {
          contentType: 'page-section',
          contentId: params.where.id,
          requestedBy: userId,
          requestedAt: new Date(),
          changesSummary: generateChangeSummary(currentData, params.data),
          previousContent: currentData.content,
          proposedContent: params.data.draftVersion,
          status: 'pending',
          previewUrl: `/preview/section/${params.where.id}`
        }
      });
      
      // Send email notification
      await strapi.plugins['email'].services.email.send({
        to: process.env.SUPERADMIN_EMAIL,
        subject: 'Content Approval Required',
        html: `
          <h2>Approval Request</h2>
          <p>${user.email} has requested approval for changes to ${currentData.sectionName?.en || 'a section'}</p>
          <p><a href="${process.env.ADMIN_URL}/admin/content-manager/collectionType/api::approval-request.approval-request">View Request</a></p>
        `
      });
    } else {
      // SuperAdmin editing - apply directly
      params.data = {
        ...params.data,
        liveVersion: params.data,
        content: params.data,
        approvalStatus: 'live',
        hasPendingChanges: false
      };
    }
  }
};

function generateChangeSummary(oldData, newData) {
  const changes = [];
  
  // Check each field
  if (oldData.content?.title !== newData.draftVersion?.content?.title) {
    changes.push(`Title changed from "${oldData.content?.title}" to "${newData.draftVersion?.content?.title}"`);
  }
  
  // Add more field checks...
  
  return changes.join(', ') || 'Content updated';
}
```

### 2.2 Password Reset System
```javascript
// config/plugins.js
module.exports = ({ env }) => ({
  email: {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: 'smtp.resend.com',
        port: 465,
        secure: true,
        auth: {
          user: 'resend',
          pass: env('RESEND_API_KEY'),
        },
      },
      settings: {
        defaultFrom: env('EMAIL_FROM'),
        defaultReplyTo: env('EMAIL_REPLY_TO'),
      },
    },
  },
  
  // Custom password reset without DB access
  'users-permissions': {
    config: {
      jwt: {
        expiresIn: '7d',
      },
      forgotPassword: {
        emailTemplate: {
          subject: 'Reset password',
          text: `
            Hello <%= user.username %>,
            Click this link to reset your password: <%= url %>
            This link expires in 2 hours.
          `,
          html: `
            <h1>Password Reset</h1>
            <p>Hello <%= user.username %>,</p>
            <p>Click the link below to reset your password:</p>
            <a href="<%= url %>">Reset Password</a>
            <p>This link expires in 2 hours.</p>
          `,
        },
      },
    },
  },
});
```

## Day 8: Version History & Content Locking

### 2.3 Version History System
```javascript
// src/api/page-section/services/version-history.js
module.exports = {
  async saveVersion(sectionId, content, userId) {
    const MAX_VERSIONS = 30;
    
    // Get current versions
    const section = await strapi.entityService.findOne(
      'api::page-section.page-section',
      sectionId,
      { populate: ['versions'] }
    );
    
    const versions = section.versions || [];
    
    // Add new version
    versions.push({
      content,
      savedBy: userId,
      savedAt: new Date(),
      version: versions.length + 1
    });
    
    // Keep only last 30 versions
    if (versions.length > MAX_VERSIONS) {
      versions.shift();
    }
    
    // Update section
    await strapi.entityService.update(
      'api::page-section.page-section',
      sectionId,
      { data: { versions } }
    );
  },
  
  async restoreVersion(sectionId, versionNumber) {
    const section = await strapi.entityService.findOne(
      'api::page-section.page-section',
      sectionId
    );
    
    const version = section.versions.find(v => v.version === versionNumber);
    
    if (!version) {
      throw new Error('Version not found');
    }
    
    // Restore version
    await strapi.entityService.update(
      'api::page-section.page-section',
      sectionId,
      {
        data: {
          content: version.content,
          liveVersion: version.content,
          approvalStatus: 'live'
        }
      }
    );
    
    return version;
  }
};
```

### 2.4 Content Locking Mechanism
```javascript
// src/api/page-section/services/content-lock.js
const locks = new Map();

module.exports = {
  async acquireLock(sectionId, userId, userName) {
    const existingLock = locks.get(sectionId);
    
    // Check if already locked by another user
    if (existingLock && existingLock.userId !== userId) {
      const lockAge = Date.now() - existingLock.timestamp;
      
      // Auto-release after 30 minutes
      if (lockAge > 30 * 60 * 1000) {
        locks.delete(sectionId);
      } else {
        return {
          success: false,
          lockedBy: existingLock.userName,
          lockedAt: existingLock.timestamp
        };
      }
    }
    
    // Acquire lock
    locks.set(sectionId, {
      userId,
      userName,
      timestamp: Date.now()
    });
    
    return { success: true };
  },
  
  releaseLock(sectionId, userId) {
    const lock = locks.get(sectionId);
    
    if (lock && lock.userId === userId) {
      locks.delete(sectionId);
      return true;
    }
    
    return false;
  },
  
  forceRelease(sectionId) {
    // For SuperAdmin only
    locks.delete(sectionId);
    return true;
  }
};
```

## Day 9-10: Validation & Safety

### 2.5 Validation Rules
```javascript
// src/api/page-section/content-types/page-section/validators.js
module.exports = {
  validateContent(content) {
    const errors = [];
    
    // Title validation
    if (content.title) {
      if (content.title.length < 5) {
        errors.push('Title must be at least 5 characters');
      }
      if (content.title.length > 60) {
        errors.push('Title must be less than 60 characters');
      }
      if (content.title === content.title.toUpperCase()) {
        errors.push('Title should not be all caps');
      }
    }
    
    // URL validation
    if (content.buttonUrl) {
      if (!content.buttonUrl.startsWith('/') && !content.buttonUrl.startsWith('http')) {
        errors.push('URL must start with / or http');
      }
      if (content.buttonUrl.includes(' ')) {
        errors.push('URL cannot contain spaces');
      }
    }
    
    // Image validation happens via Cloudinary
    
    return errors;
  }
};

// Use in lifecycle
module.exports = {
  async beforeCreate(event) {
    const { params } = event;
    const errors = validateContent(params.data.content);
    
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }
  },
  
  async beforeUpdate(event) {
    const { params } = event;
    const errors = validateContent(params.data.content || params.data.draftVersion?.content);
    
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }
  }
};
```

### 2.6 Backup System
```javascript
// scripts/backup.js
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

async function backupDatabase() {
  const timestamp = new Date().toISOString().split('T')[0];
  const backupFile = `backup-${timestamp}.sql`;
  
  // Create backup
  exec(
    `pg_dump ${process.env.DATABASE_URL} > ${backupFile}`,
    async (error) => {
      if (error) {
        console.error('Backup failed:', error);
        return;
      }
      
      // Upload to cloud storage (GitHub Actions artifacts for free)
      // Or Cloudinary as base64 if small enough
      
      console.log('Backup completed:', backupFile);
      
      // Clean old backups (keep last 7)
      const backups = fs.readdirSync('.')
        .filter(f => f.startsWith('backup-'))
        .sort()
        .reverse();
      
      if (backups.length > 7) {
        backups.slice(7).forEach(f => fs.unlinkSync(f));
      }
    }
  );
}

// Run daily via cron or Railway scheduled job
backupDatabase();

// Restore function
async function restoreDatabase(backupFile) {
  exec(
    `psql ${process.env.DATABASE_URL} < ${backupFile}`,
    (error) => {
      if (error) {
        console.error('Restore failed:', error);
        return;
      }
      console.log('Restore completed');
    }
  );
}
```

---

# =≈ **PHASE 3: MULTI-LANGUAGE & UI (Week 3)**
**Goal:** Implement Russian, Hebrew, English support with visual navigation

## Day 11-12: Multi-Language Setup

### 3.1 Language Configuration
```javascript
// config/i18n.js
module.exports = {
  locales: ['en', 'ru', 'he'],
  defaultLocale: 'en',
  
  // Admin panel translations
  adminTranslations: {
    en: {
      'page.sections': 'Page Sections',
      'approval.pending': 'Pending Approval',
      'content.save': 'Save',
      'content.publish': 'Publish'
    },
    ru: {
      'page.sections': '!5:F88 AB@0=8FK',
      'approval.pending': '68405B >4>1@5=8O',
      'content.save': '!>E@0=8BL',
      'content.publish': '?C1;8:>20BL'
    },
    he: {
      'page.sections': '◊‹ÁŸ ‚ﬁ’”',
      'approval.pending': 'ﬁﬁÍŸﬂ ‹–ŸÈ’Ë',
      'content.save': 'Èﬁ’Ë',
      'content.publish': '‰Ë·›'
    }
  }
};

// Hebrew RTL Support CSS
// public/admin/rtl.css
[dir="rtl"] {
  direction: rtl;
  text-align: right;
}

[dir="rtl"] .navigation {
  flex-direction: row-reverse;
}

[dir="rtl"] .form-label {
  text-align: right;
}

[dir="rtl"] .button-group {
  flex-direction: row-reverse;
}
```

### 3.2 Content Translation Structure
```javascript
// Each section stores multi-language content
const sectionContent = {
  content: {
    title: {
      en: "Unlock Potential With Proven Courses",
      ru: " 0A:@>9B5 ?>B5=F80; A ?@>25@5==K<8 :C@A0<8",
      he: "‰Í◊ ‰’ÿ‡ÊŸ–‹ ‚› Á’Ë·Ÿ› ﬁ’€◊Ÿ›"
    },
    subtitle: {
      en: "Expert-Led Learning",
      ru: "1CG5=85 >B M:A?5@B>2",
      he: "‹ﬁŸ”‘ —‘‡◊ŸŸÍ ﬁ’ﬁ◊Ÿ›"
    },
    buttonText: {
      en: "Get Started",
      ru: "0G0BL",
      he: "‘Í◊‹"
    }
  }
};

// API endpoint to get content in specific language
module.exports = {
  async find(ctx) {
    const { locale = 'en' } = ctx.query;
    
    const sections = await strapi.entityService.findMany(
      'api::page-section.page-section',
      {
        filters: ctx.query.filters,
        populate: '*'
      }
    );
    
    // Return content in requested language
    return sections.map(section => ({
      ...section,
      content: Object.entries(section.content).reduce((acc, [key, value]) => {
        acc[key] = value[locale] || value.en || value;
        return acc;
      }, {})
    }));
  }
};
```

## Day 13-14: Visual Navigation System

### 3.3 Screenshot Generation
```javascript
// scripts/generate-screenshots.js
const puppeteer = require('puppeteer');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

async function generateSectionScreenshots() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Get all pages
  const pages = await strapi.entityService.findMany('api::page.page');
  
  for (const pageData of pages) {
    await page.goto(`${process.env.FRONTEND_URL}/${pageData.htmlFile}`);
    
    // Full page screenshot
    const fullPageScreenshot = await page.screenshot({
      fullPage: true,
      encoding: 'base64'
    });
    
    // Upload to Cloudinary
    const fullPageResult = await cloudinary.uploader.upload(
      `data:image/png;base64,${fullPageScreenshot}`,
      {
        folder: 'strapi-screenshots',
        public_id: `${pageData.slug}-full`
      }
    );
    
    // Get sections on this page
    const sections = await page.$$('[data-section]');
    
    for (const section of sections) {
      const sectionId = await section.evaluate(el => el.dataset.section);
      
      // Highlight section
      await section.evaluate(el => {
        el.style.outline = '3px solid red';
        el.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
        el.scrollIntoView({ block: 'center' });
      });
      
      // Take screenshot
      const box = await section.boundingBox();
      const screenshot = await page.screenshot({
        clip: box,
        encoding: 'base64'
      });
      
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(
        `data:image/png;base64,${screenshot}`,
        {
          folder: 'strapi-screenshots',
          public_id: `${pageData.slug}-${sectionId}`
        }
      );
      
      // Update section with screenshot URLs
      await strapi.entityService.update(
        'api::page-section.page-section',
        sectionId,
        {
          data: {
            screenshots: {
              thumbnail: result.secure_url,
              fullPage: fullPageResult.secure_url,
              highlighted: result.secure_url
            }
          }
        }
      );
      
      // Remove highlight
      await section.evaluate(el => {
        el.style.outline = '';
        el.style.backgroundColor = '';
      });
    }
  }
  
  await browser.close();
}

// Run on deploy or schedule
generateSectionScreenshots();
```

### 3.4 Visual Admin Components
```javascript
// src/plugins/visual-editor/admin/src/components/SectionPicker.js
import React, { useState } from 'react';
import { Box, Grid, Card, Typography, Badge } from '@strapi/design-system';

const SectionPicker = ({ sections, onSelect }) => {
  const [locale, setLocale] = useState(localStorage.getItem('locale') || 'en');
  
  const translations = {
    en: {
      selectSection: 'Select section to edit:',
      location: 'Location on page:',
      visible: 'Visible',
      hidden: 'Hidden'
    },
    ru: {
      selectSection: 'K15@8B5 A5:F8N 4;O @540:B8@>20=8O:',
      location: ' 0A?>;>65=85 =0 AB@0=8F5:',
      visible: '848<>',
      hidden: '!:@KB>'
    },
    he: {
      selectSection: '—◊Ë ◊‹Á ‹‚ËŸ€‘:',
      location: 'ﬁŸÁ’› —‚ﬁ’”:',
      visible: '“‹’Ÿ',
      hidden: 'ﬁ’·ÍË'
    }
  };
  
  const t = translations[locale];
  
  return (
    <Box dir={locale === 'he' ? 'rtl' : 'ltr'}>
      <Typography variant="beta">{t.selectSection}</Typography>
      
      <Grid gap={4}>
        {sections.map(section => (
          <Card
            key={section.id}
            style={{
              cursor: 'pointer',
              border: `2px solid ${section.colorCode}`,
              opacity: section.isVisible ? 1 : 0.5
            }}
            onClick={() => onSelect(section)}
          >
            <img
              src={section.screenshots?.highlighted}
              alt={section.sectionName?.[locale]}
              style={{ width: '100%', height: '150px', objectFit: 'cover' }}
            />
            
            <Box padding={2}>
              <Typography variant="omega" fontWeight="bold">
                {section.iconIdentifier} {section.sectionName?.[locale]}
              </Typography>
              
              <Typography variant="pi" color="neutral600">
                {t.location} {section.visualGuide?.[locale]}
              </Typography>
              
              <Badge backgroundColor={section.isVisible ? 'success' : 'neutral'}>
                {section.isVisible ? t.visible : t.hidden}
              </Badge>
            </Box>
          </Card>
        ))}
      </Grid>
    </Box>
  );
};

export default SectionPicker;
```

---

# =≈ **PHASE 4: INTEGRATION & DEPLOYMENT (Week 4)**
**Goal:** Connect Webflow frontend with Strapi backend

## Day 15-16: Frontend Integration

### 4.1 Webflow Integration Script
```javascript
// webflow-strapi-integration.js (Enhanced)
(function() {
  'use strict';
  
  // Configuration
  const STRAPI_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:1337' 
    : 'https://your-app.railway.app';
  
  const API_TOKEN = 'your-public-api-token'; // Read-only token
  
  // Detect user language
  const userLang = navigator.language.split('-')[0];
  const supportedLangs = ['en', 'ru', 'he'];
  const locale = supportedLangs.includes(userLang) ? userLang : 'en';
  
  // Set RTL for Hebrew
  if (locale === 'he') {
    document.documentElement.dir = 'rtl';
  }
  
  // Helper functions
  async function fetchStrapi(endpoint) {
    try {
      const response = await fetch(`${STRAPI_URL}/api${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Strapi fetch error:', error);
      // Use fallback content
      return null;
    }
  }
  
  // Load page sections
  async function loadPageSections() {
    const pagePath = window.location.pathname;
    const pageSlug = pagePath.replace('/', '').replace('.html', '') || 'home';
    
    // Fetch page data
    const response = await fetchStrapi(
      `/pages?filters[slug][$eq]=${pageSlug}&populate[sections][populate]=*&locale=${locale}`
    );
    
    if (!response || !response.data || response.data.length === 0) {
      console.warn('No Strapi data for page:', pageSlug);
      return;
    }
    
    const page = response.data[0];
    
    // Hide page if not active
    if (!page.attributes.isPageActive) {
      document.body.style.display = 'none';
      document.body.innerHTML = '<h1>Page not available</h1>';
      return;
    }
    
    // Process sections
    page.attributes.sections.data.forEach(section => {
      const attrs = section.attributes;
      
      // Find section element
      const sectionEl = document.querySelector(`[data-section="${attrs.sectionIdentifier}"]`);
      if (!sectionEl) {
        console.warn('Section not found:', attrs.sectionIdentifier);
        return;
      }
      
      // Hide/show section
      if (!attrs.isVisible) {
        sectionEl.style.display = 'none';
        return;
      }
      
      // Update content
      const content = attrs.liveVersion || attrs.content || {};
      
      // Update text fields
      Object.keys(content).forEach(field => {
        const element = sectionEl.querySelector(`[data-strapi-field="${field}"]`);
        if (element) {
          // Get translated content
          const value = content[field]?.[locale] || content[field] || '';
          
          if (element.tagName === 'IMG') {
            element.src = value;
            element.alt = content[`${field}Alt`]?.[locale] || '';
          } else if (element.tagName === 'A') {
            element.href = value;
            element.textContent = content[`${field}Text`]?.[locale] || '';
          } else {
            element.innerHTML = value;
          }
        }
      });
      
      // Update images from media field
      if (attrs.media) {
        Object.keys(attrs.media).forEach(mediaKey => {
          const imgEl = sectionEl.querySelector(`[data-strapi-media="${mediaKey}"]`);
          if (imgEl && attrs.media[mediaKey]) {
            imgEl.src = `${STRAPI_URL}${attrs.media[mediaKey]}`;
          }
        });
      }
    });
    
    // Update meta tags
    if (page.attributes.metaTitle) {
      document.title = page.attributes.metaTitle[locale] || page.attributes.metaTitle;
    }
    
    if (page.attributes.metaDescription) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.content = page.attributes.metaDescription[locale] || page.attributes.metaDescription;
      }
    }
    
    // Trigger Webflow refresh
    if (window.Webflow) {
      window.Webflow.destroy();
      window.Webflow.ready();
      window.Webflow.require('ix2').init();
    }
  }
  
  // Auto-discovery for new sections
  function autoRegisterSections() {
    const sections = document.querySelectorAll('[data-section]');
    const pagePath = window.location.pathname;
    const pageSlug = pagePath.replace('/', '').replace('.html', '') || 'home';
    
    sections.forEach(async (section) => {
      const sectionId = section.dataset.section;
      
      // Check if section exists in Strapi
      const response = await fetchStrapi(
        `/page-sections?filters[sectionIdentifier][$eq]=${sectionId}&filters[parentPage][slug][$eq]=${pageSlug}`
      );
      
      if (!response || response.data.length === 0) {
        // Register new section
        console.log('New section detected:', sectionId);
        
        // Extract initial content
        const content = {};
        section.querySelectorAll('[data-strapi-field]').forEach(el => {
          const field = el.dataset.strapiField;
          content[field] = el.textContent || el.src || el.href;
        });
        
        // Send to Strapi (requires write permissions)
        // This would be done by developer, not in production
        console.log('Section needs registration:', {
          sectionIdentifier: sectionId,
          parentPage: pageSlug,
          content
        });
      }
    });
  }
  
  // Fallback system
  function useFallbackContent() {
    console.warn('Using fallback content');
    // Content stays as-is in HTML
  }
  
  // Initialize
  document.addEventListener('DOMContentLoaded', async () => {
    try {
      await loadPageSections();
      
      // Only in development
      if (window.location.hostname === 'localhost') {
        autoRegisterSections();
      }
    } catch (error) {
      console.error('Failed to load Strapi content:', error);
      useFallbackContent();
    }
  });
  
  // Real-time updates (optional)
  if (window.EventSource) {
    const eventSource = new EventSource(`${STRAPI_URL}/content-updates`);
    
    eventSource.onmessage = function(event) {
      const data = JSON.parse(event.data);
      if (data.type === 'content-update') {
        loadPageSections();
      }
    };
  }
})();
```

### 4.2 Cloudinary Configuration
```javascript
// config/plugins.js (Cloudinary setup)
module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
      actionOptions: {
        upload: {
          folder: 'strapi-media',
          transformation: [
            { width: 2000, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' }
          ]
        },
        uploadStream: {
          folder: 'strapi-media'
        },
        delete: {}
      }
    }
  }
});
```

## Day 17-18: Deployment Setup

### 4.3 Vercel Configuration (Frontend)
```json
// vercel.json
{
  "version": 2,
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://your-app.railway.app/api/:path*"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    },
    {
      "source": "/(.*)\\.(jpg|jpeg|png|gif|ico|svg)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 4.4 Railway Configuration (Backend)
```json
// railway.json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run build"
  },
  "deploy": {
    "startCommand": "npm run start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}

// package.json scripts
{
  "scripts": {
    "develop": "strapi develop",
    "start": "strapi start",
    "build": "strapi build",
    "strapi": "strapi",
    "seed": "node scripts/seed.js",
    "backup": "node scripts/backup.js"
  }
}
```

### 4.5 Environment Variables Setup
```bash
# Railway Environment Variables (Set in Dashboard)
NODE_ENV=production
DATABASE_URL=${{Postgres.DATABASE_URL}}
APP_KEYS=generate-4-random-base64-keys
API_TOKEN_SALT=generate-random-string
ADMIN_JWT_SECRET=generate-random-string
TRANSFER_TOKEN_SALT=generate-random-string
JWT_SECRET=generate-random-string

# Cloudinary
CLOUDINARY_NAME=your-cloud-name
CLOUDINARY_KEY=your-api-key
CLOUDINARY_SECRET=your-api-secret

# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=noreply@yoursite.com
EMAIL_REPLY_TO=support@yoursite.com
SUPERADMIN_EMAIL=admin@yoursite.com

# Frontend URLs
FRONTEND_URL=https://yoursite.vercel.app
ADMIN_URL=https://your-app.railway.app

# Security
RATE_LIMIT_INTERVAL=60000
RATE_LIMIT_MAX=100

# Webhook Secrets
WEBHOOK_SECRET=generate-random-string
```

---

# =≈ **PHASE 5: TESTING & LAUNCH (Week 5)**
**Goal:** Test everything and go live

## Day 19: Testing

### 5.1 Testing Checklist
```javascript
// tests/setup-tests.js
const testScenarios = {
  // Authentication Tests
  authentication: [
    'SuperAdmin can login',
    'Content Manager can login',
    'Password reset works',
    'Session timeout after 30 minutes',
    'Wrong password shows error'
  ],
  
  // Content Management Tests
  contentManagement: [
    'Content Manager can edit section',
    'Changes go to draft, not live',
    'Approval request is created',
    'SuperAdmin receives notification',
    'SuperAdmin can approve/reject',
    'Approved content goes live',
    'Rejected content stays draft'
  ],
  
  // Multi-language Tests
  multiLanguage: [
    'Russian interface works',
    'Hebrew RTL displays correctly',
    'Content shows in correct language',
    'Language switcher works',
    'Fallback to English works'
  ],
  
  // Visual Navigation Tests
  visualNavigation: [
    'Screenshots display correctly',
    'Click on preview to edit',
    'Visual guides show',
    'Section highlighting works'
  ],
  
  // Integration Tests
  integration: [
    'Webflow loads Strapi content',
    'Images from Cloudinary load',
    'CORS allows frontend',
    'Fallback content works',
    'Cache updates on publish'
  ],
  
  // Safety Tests
  safety: [
    'Version history saves',
    'Rollback works',
    'Content locking prevents conflicts',
    'Validation prevents bad data',
    'Rate limiting blocks attacks',
    'Backup runs daily'
  ],
  
  // Performance Tests
  performance: [
    'Page loads under 2 seconds',
    'API responds under 500ms',
    'Images optimized by Cloudinary',
    'Can handle 100 concurrent users'
  ]
};
```

### 5.2 Load Testing
```javascript
// tests/load-test.js
const loadtest = require('loadtest');

const options = {
  url: 'https://your-app.railway.app/api/page-sections',
  maxRequests: 1000,
  concurrency: 100,
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  }
};

loadtest.loadTest(options, (error, result) => {
  if (error) {
    console.error('Load test failed:', error);
    return;
  }
  
  console.log('Load test results:', {
    totalRequests: result.totalRequests,
    totalErrors: result.totalErrors,
    rps: result.rps,
    meanLatency: result.meanLatencyMs,
    maxLatency: result.maxLatencyMs
  });
  
  // Pass criteria
  if (result.meanLatencyMs > 500) {
    console.error('FAIL: Mean latency too high');
  }
  
  if (result.totalErrors > 10) {
    console.error('FAIL: Too many errors');
  }
});
```

## Day 20-21: Launch

### 5.3 Pre-Launch Checklist
```markdown
## 48 Hours Before Launch
- [ ] All environment variables set in production
- [ ] Database backup tested and working
- [ ] SuperAdmin account created
- [ ] Test accounts created for Content Managers
- [ ] All API endpoints tested
- [ ] Frontend-backend connection verified
- [ ] Email system tested (password reset)
- [ ] Cloudinary connected and working
- [ ] SSL certificates active

## 24 Hours Before Launch
- [ ] Load testing completed
- [ ] Security scan completed (npm audit)
- [ ] All content migrated to Strapi
- [ ] Screenshots generated for all sections
- [ ] Translations verified (RU, HE, EN)
- [ ] Mobile responsiveness tested
- [ ] Backup created

## Launch Day
- [ ] Switch DNS to production
- [ ] Monitor error logs
- [ ] Test all critical paths
- [ ] Verify analytics tracking
- [ ] Check uptime monitoring
- [ ] Send login credentials to managers
- [ ] Document any issues
```

### 5.4 Post-Launch Monitoring
```javascript
// monitoring/health-check.js
const checks = {
  async checkHealth() {
    const results = {
      api: false,
      database: false,
      email: false,
      storage: false
    };
    
    // Check API
    try {
      const response = await fetch(`${STRAPI_URL}/api/pages`);
      results.api = response.ok;
    } catch (error) {
      console.error('API check failed:', error);
    }
    
    // Check database
    try {
      const dbCheck = await strapi.db.connection.raw('SELECT 1');
      results.database = true;
    } catch (error) {
      console.error('Database check failed:', error);
    }
    
    // Check email
    try {
      await strapi.plugins['email'].services.email.send({
        to: 'test@example.com',
        subject: 'Test',
        text: 'Test'
      });
      results.email = true;
    } catch (error) {
      // Email test expected to fail for invalid address
      results.email = error.message.includes('Invalid');
    }
    
    // Check Cloudinary
    try {
      const cloudinary = require('cloudinary').v2;
      await cloudinary.api.ping();
      results.storage = true;
    } catch (error) {
      console.error('Storage check failed:', error);
    }
    
    return results;
  }
};
```

---

# <ò **EMERGENCY PROCEDURES**

## Critical Issues and Solutions

### Issue 1: Site is down
```bash
# 1. Check Railway status
https://railway.app/project/YOUR_PROJECT/deployments

# 2. Restart service
railway restart

# 3. Check logs
railway logs --tail 100

# 4. If database issue, restore backup
psql $DATABASE_URL < backup-latest.sql
```

### Issue 2: Content not updating
```javascript
// 1. Check approval status
// Strapi Admin í Content Manager í Page Sections í Check status

// 2. Clear cache
await strapi.cache.clear();

// 3. Check CORS
// Verify frontend domain is allowed

// 4. Force refresh
window.location.reload(true);
```

### Issue 3: Images not loading
```bash
# 1. Check Cloudinary quota
# Dashboard í Usage

# 2. Verify environment variables
echo $CLOUDINARY_NAME

# 3. Check upload settings
# Strapi Admin í Settings í Media Library
```

### Issue 4: Can't login
```javascript
// 1. Reset password via email
// Click "Forgot password"

// 2. SuperAdmin reset via CLI
npm run strapi admin:reset-user-password -- email@example.com

// 3. Create new SuperAdmin (emergency)
npm run strapi admin:create-user -- --firstname=Admin --lastname=User --email=newadmin@example.com --password=SecurePassword123
```

---

# =  **SUCCESS METRICS**

## MVP Success Criteria
-  All 26 pages migrated to Strapi
-  3 languages working (EN, RU, HE)
-  Approval workflow functional
-  Visual navigation with screenshots
-  Password reset without DB access
-  Daily backups running
-  Page load under 2 seconds
-  Zero data loss
-  Content managers can edit without help
-  Total cost under $10/month

---

# =Ä **GO-LIVE COMMAND**

```bash
# Final deployment sequence
git add .
git commit -m "=Ä Launch MVP"
git push origin main

# Deploy frontend
vercel --prod

# Deploy backend
railway up

# Run migrations
railway run npm run strapi migration:run

# Generate screenshots
railway run node scripts/generate-screenshots.js

# Create first backup
railway run node scripts/backup.js

# Health check
curl https://your-app.railway.app/api/health

echo "<â MVP LAUNCHED!"
```

---

# =› **HANDOVER DOCUMENTATION**

## For Content Managers
- Admin URL: https://your-app.railway.app/admin
- Default language: Based on browser
- Password reset: Click "Forgot password"
- Help documentation: /docs/content-manager-guide.pdf
- Support: support@yoursite.com

## For SuperAdmin
- Full access to all content
- Approve/reject changes in Approval Queue
- Emergency procedures documented above
- Backup access via Railway dashboard
- Can reset any user's password

## For Developers
- Repository: github.com/yourcompany/strapi-backend
- Railway dashboard: railway.app/project/xxxxx
- Vercel dashboard: vercel.com/yourcompany
- Cloudinary: cloudinary.com/console
- Monitoring: uptimerobot.com

---

**THIS DOCUMENT CONTAINS EVERYTHING NEEDED FOR MVP LAUNCH!** =Ä

Total implementation time: **5 weeks**
Total monthly cost: **$5**
No compromises on user experience! (