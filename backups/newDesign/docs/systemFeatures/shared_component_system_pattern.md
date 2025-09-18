# Shared Component System - Universal Pattern

## 🚨 ARCHITECTURE: Zero-Static-Content Shared Component System ✅

**PATTERN STATUS**: Successfully implemented for courses, ready for replication

**BENEFITS**:
- **Zero Static Content**: 100% database-driven content
- **Shared Components**: Reusable across all entity types
- **Admin Integration**: Real-time CRUD operations
- **Consistent Design**: Identical styling and behavior
- **Easy Maintenance**: Update component = update all pages

---

## 🎛️ Generic Admin Logic Pattern

### Admin Interface Architecture

The admin interface implements a universal pattern for any entity management:

#### 1. Tab-Based Navigation System
```javascript
// Universal tab switching logic (works for any entity)
document.querySelectorAll('[data-tab]').forEach(button => {
    button.addEventListener('click', (e) => {
        const tabName = e.target.dataset.tab;
        showTab(tabName);
        loadTabContent(tabName); // Loads entity-specific content
    });
});
```

#### 2. Entity List Management (`#entitiesList`)
- **Dynamic Loading**: Entities fetched from API on tab activation
- **Real-time Updates**: Changes reflect immediately without page refresh
- **Quick Actions**: Inline editing for common properties
- **Preview Integration**: Direct links to entity detail pages

#### 3. Universal Quick Actions Implementation
```javascript
// Generic toggle functionality (visibility, featured, published, etc.)
async function toggleEntityProperty(entityId, property, value, entityType) {
    const response = await fetch(`${API_BASE}/${entityType}/${entityId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [property]: value })
    });

    if (response.ok) {
        updateEntityCardProperty(entityId, property, value);
        showToast(`✅ ${property} updated`);
    }
}

// Universal inline editing setup
function setupInlineEditing(entityType) {
    // Price/value editing
    document.querySelectorAll(`.${entityType}-price-input`).forEach(input => {
        input.addEventListener('blur', async (e) => {
            const entityId = e.target.dataset.entityId;
            const newValue = parseFloat(e.target.value) || 0;
            await updateEntityProperty(entityId, 'price', newValue, entityType);
        });
    });

    // Category dropdown
    document.querySelectorAll(`.${entityType}-category-select`).forEach(select => {
        select.addEventListener('change', async (e) => {
            const entityId = e.target.dataset.entityId;
            const newCategory = e.target.value;
            await updateEntityProperty(entityId, 'category', newCategory, entityType);
        });
    });
}
```

### Universal Modal Edit System

#### Generic Modal Structure:
```javascript
const UNIVERSAL_MODAL_TABS = {
    'basic-info': {
        title: 'Basic Information',
        fields: ['title', 'description', 'short_description', 'price']
    },
    'details': {
        title: 'Entity Details',
        fields: ['duration', 'level', 'category', 'features']
    },
    'content': {
        title: 'Content Management',
        component: 'ContentManager' // courses=lessons, blogs=sections, products=specs
    },
    'author': {
        title: 'Author/Creator Info',
        fields: ['author', 'author_bio', 'author_image']
    },
    'media': {
        title: 'Media & Images',
        fields: ['image', 'video_url', 'thumbnail', 'gallery']
    }
};
```

#### Universal Auto-Save Implementation:
```javascript
class UniversalEditModal {
    constructor(entityType, entityId = null) {
        this.entityType = entityType;
        this.entityId = entityId;
        this.entityData = null;
        this.autoSaveInterval = null;
        this.hasUnsavedChanges = false;
    }

    startAutoSave() {
        this.autoSaveInterval = setInterval(() => {
            if (this.hasUnsavedChanges) {
                this.saveEntityData();
                console.log(`🔄 Auto-saved ${this.entityType} data`);
            }
        }, 30000); // Every 30 seconds
    }

    async saveEntityData() {
        const method = this.entityId ? 'PUT' : 'POST';
        const url = this.entityId
            ? `${API_BASE}/${this.entityType}/${this.entityId}`
            : `${API_BASE}/${this.entityType}`;

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.getFormData())
        });

        if (response.ok) {
            this.hasUnsavedChanges = false;
            showToast(`✅ ${this.entityType} saved successfully`);
        }
    }
}
```

---

## 🧩 Universal Shared Component Architecture

### Generic Component System Structure

For ANY entity type, create this structure:

```
shared/components/[entity]-details-page/
├── [entity]-details-template.html    # Clean HTML structure (NO static content)
├── [entity]-details-styles.css       # Complete responsive styling
└── [entity]-details-component.js     # Database integration & population logic
```

### Universal Component Integration Pattern

#### 1. Generic Template Structure
```html
<!-- CRITICAL: NO HARDCODED CONTENT -->
<div class="entity-details-hero-section">
  <div class="entity-details-hero-content">
    <div class="entity-details-breadcrumbs">
      <a href="[entities].html">[Entities]</a> > <span class="entity-breadcrumb-title"></span>
    </div>
    <h1 class="entity-details-hero-title"></h1>  <!-- Empty, populated by JS -->
    <p class="entity-details-hero-description"></p>  <!-- Empty, populated by JS -->

    <div class="entity-details-hero-meta">
      <span class="entity-rating-stars"></span>  <!-- Dynamic rating -->
      <span class="entity-author"></span>        <!-- From database -->
      <span class="entity-date"></span>          <!-- From database -->
    </div>
  </div>
</div>

<div class="entity-details-content-section">
  <div class="entity-details-main-content">
    <!-- Entity Overview -->
    <div class="entity-overview-section">
      <h2>Overview</h2>
      <p class="entity-full-description"></p>
    </div>

    <!-- Dynamic Content Sections -->
    <div class="entity-content-section">
      <h2>Content</h2>
      <div class="entity-content-container">
        <!-- Populated from database -->
      </div>
    </div>

    <!-- Features/Benefits -->
    <div class="entity-features-section">
      <h2>Features</h2>
      <div class="entity-features-list">
        <!-- Populated from database -->
      </div>
    </div>
  </div>

  <div class="entity-details-sidebar">
    <!-- Entity Info Card -->
    <div class="entity-info-card">
      <div class="entity-price">
        <span class="entity-current-price"></span>
        <span class="entity-old-price"></span>
      </div>

      <div class="entity-stats">
        <div class="entity-stat-item">
          <span class="entity-views-count"></span> Views
        </div>
        <div class="entity-stat-item">
          Level: <span class="entity-level"></span>
        </div>
      </div>

      <div class="entity-category-tag">
        <span class="entity-category"></span>
      </div>

      <button class="entity-action-button">
        <span>Take Action</span>
      </button>
    </div>

    <!-- Author Info -->
    <div class="entity-author-card">
      <h3>About the Author</h3>
      <div class="author-info">
        <img class="author-image" src="" alt="" />
        <div class="author-details">
          <h4 class="author-name"></h4>
          <p class="author-bio"></p>
        </div>
      </div>
    </div>
  </div>
</div>
```

#### 2. Universal JavaScript Component
```javascript
class UniversalDetailsComponent {
    constructor(entityType, apiNamespace = 'api') {
        this.entityType = entityType; // 'courses', 'blogs', 'products', etc.
        this.apiNamespace = apiNamespace; // 'api', 'api/nd', etc.
        this.entityData = null;
        this.entityId = null;
        this.previewMode = false;
        this.API_BASE = window.location.hostname === 'localhost'
            ? 'http://localhost:1337'
            : 'https://aistudio555jamstack-production.up.railway.app';
    }

    async init() {
        console.log(`📦 Loading ${this.entityType} Details Component...`);

        // Extract entity ID from URL
        const params = this.getUrlParams();
        this.entityId = params.id;
        this.previewMode = params.preview === 'true';

        if (!this.entityId) {
            this.showError(`No ${this.entityType} ID provided in URL`);
            return;
        }

        // Load and populate ALL content from database
        await this.loadEntityData();
    }

    getUrlParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            id: params.get('id'),
            preview: params.get('preview')
        };
    }

    async fetchEntityData(entityId, preview = false) {
        try {
            const url = `${this.API_BASE}/${this.apiNamespace}/${this.entityType}/${entityId}${preview ? '?preview=true' : ''}`;
            console.log(`📡 Fetching ${this.entityType}:`, url);

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch ${this.entityType}: ${response.status}`);
            }

            const data = await response.json();
            console.log(`✅ ${this.entityType} data received:`, data);

            // Handle wrapped API response format
            return data.data || data;
        } catch (error) {
            console.error(`❌ Error fetching ${this.entityType}:`, error);
            throw error;
        }
    }

    async loadEntityData() {
        try {
            this.showLoading(true);

            this.entityData = await this.fetchEntityData(this.entityId, this.previewMode);

            if (!this.entityData) {
                throw new Error(`No ${this.entityType} data received`);
            }

            await this.populatePageContent();
            this.setupEventHandlers();

            console.log(`✅ ${this.entityType} details page populated successfully`);

        } catch (error) {
            console.error(`❌ Error loading ${this.entityType} data:`, error);
            this.showError(`Failed to load ${this.entityType} details. Please try again.`);
        } finally {
            this.showLoading(false);
        }
    }

    async populatePageContent() {
        const entity = this.entityData;

        // Page title
        document.title = `${entity.title || this.entityType} - AI Studio`;

        // Hero section - ALL from database
        this.setText('.entity-details-hero-title', entity.title);
        this.setText('.entity-details-hero-description', entity.short_description || entity.description);
        this.setText('.entity-author', entity.author || entity.instructor || 'Author');
        this.setText('.entity-date', entity.created_at || entity.published_at);

        // Content sections - ALL from database
        this.setText('.entity-full-description', entity.description);
        await this.populateEntityContent(entity);
        await this.populateEntityFeatures(entity);

        // Sidebar - ALL from database
        this.populateEntityPricing(entity);
        this.populateEntityStats(entity);
        this.populateEntityAuthor(entity);
        this.setEntityCategoryColor(entity.category);
    }

    // Generic content population methods
    async populateEntityContent(entity) {
        const container = document.querySelector('.entity-content-container');
        if (!container) return;

        // Handle different content types
        let contentItems = [];

        if (entity.lessons) { // For courses
            contentItems = this.parseContentArray(entity.lessons);
        } else if (entity.sections) { // For blogs
            contentItems = this.parseContentArray(entity.sections);
        } else if (entity.specifications) { // For products
            contentItems = this.parseContentArray(entity.specifications);
        }

        if (contentItems.length > 0) {
            container.innerHTML = contentItems.map((item, index) =>
                `<div class="entity-content-item">
                    <div class="entity-content-number">${index + 1}</div>
                    <div class="entity-content-details">
                        <div class="entity-content-title">${item.title || item}</div>
                        ${item.description ? `<div class="entity-content-description">${item.description}</div>` : ''}
                    </div>
                    <div class="entity-content-meta">${item.duration || item.pages || ''}</div>
                </div>`
            ).join('');
        } else {
            container.innerHTML = `<div class="entity-content-item">Content will be available soon</div>`;
        }
    }

    parseContentArray(content) {
        if (!content) return [];

        try {
            return typeof content === 'string' ? JSON.parse(content) : content;
        } catch (e) {
            console.warn('Could not parse content:', e);
            return typeof content === 'string'
                ? content.split(',').map(item => ({ title: item.trim() }))
                : [];
        }
    }

    // Universal utility methods
    setText(selector, text) {
        const element = document.querySelector(selector);
        if (element && text) {
            element.textContent = text;
        }
    }

    setImage(selector, src, alt = '') {
        const element = document.querySelector(selector);
        if (element && src) {
            element.src = src;
            element.alt = alt;
        }
    }

    showLoading(show) {
        let loader = document.querySelector('.entity-loading-overlay');

        if (show && !loader) {
            loader = document.createElement('div');
            loader.className = 'entity-loading-overlay';
            loader.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(255, 255, 255, 0.9); display: flex;
                align-items: center; justify-content: center; z-index: 9999;
                font-size: 18px; color: #041d63;
            `;
            loader.textContent = `Loading ${this.entityType} details...`;
            document.body.appendChild(loader);
        } else if (!show && loader) {
            loader.remove();
        }
    }

    showError(message) {
        console.error(`❌ ${this.entityType} Error:`, message);
        // Implement error display UI
    }
}
```

---

## 🔄 Implementation Guide for Any Entity

### Step 1: Create Entity Shared Component
```bash
# Replace [entity] with your entity type (blogs, products, events, etc.)
mkdir -p shared/components/[entity]-details-page/

# Create the three core files
touch shared/components/[entity]-details-page/[entity]-details-template.html
touch shared/components/[entity]-details-page/[entity]-details-styles.css
touch shared/components/[entity]-details-page/[entity]-details-component.js
```

### Step 2: Implement Entity-Specific Component
```javascript
// In [entity]-details-component.js
class [Entity]DetailsComponent extends UniversalDetailsComponent {
    constructor() {
        super('[entities]', 'api/namespace'); // e.g. 'blogs', 'api/content'
    }

    // Override specific methods if needed
    async populateEntityContent(entity) {
        // Entity-specific content population
        if (entity.sections) { // For blogs
            await this.populateBlogSections(entity);
        } else if (entity.specifications) { // For products
            await this.populateProductSpecs(entity);
        }
        // ... etc
    }
}

// Auto-initialize
function init[Entity]DetailsComponent() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            const component = new [Entity]DetailsComponent();
            component.init();
        });
    } else {
        const component = new [Entity]DetailsComponent();
        component.init();
    }
}

init[Entity]DetailsComponent();
```

### Step 3: Create Detail Page
```html
<!-- detail_[entities].html -->
<!DOCTYPE html>
<html>
<head>
    <title>[Entity] Details</title>
    <!-- Include shared component styles -->
    <link href="shared/components/[entity]-details-page/[entity]-details-styles.css" rel="stylesheet">
</head>
<body>
    <!-- Include shared template content -->
    <!-- Copy content from [entity]-details-template.html -->

    <!-- Include shared component script -->
    <script src="shared/components/[entity]-details-page/[entity]-details-component.js"></script>
</body>
</html>
```

### Step 4: Database Schema
```sql
-- Universal table pattern for any entity
CREATE TABLE [entity_table] (
    -- Core Fields
    id SERIAL PRIMARY KEY,
    [entity]_key VARCHAR(100) UNIQUE,

    -- Main Content
    title VARCHAR(255) NOT NULL,
    description TEXT,
    short_description VARCHAR(500),

    -- Complex/Nested Data (JSONB)
    content JSONB DEFAULT '[]',      -- sections/lessons/specs
    features JSONB DEFAULT '[]',     -- features/benefits
    metadata JSONB DEFAULT '{}',     -- additional properties

    -- Media
    image TEXT,
    video_url TEXT,
    thumbnail TEXT,

    -- Author/Creator
    author VARCHAR(255),
    author_bio TEXT,
    author_image TEXT,

    -- Pricing (if applicable)
    price DECIMAL(10,2) DEFAULT 0,
    old_price DECIMAL(10,2),

    -- Stats
    views_count INTEGER DEFAULT 0,
    rating DECIMAL(2,1),

    -- Status Flags
    is_featured BOOLEAN DEFAULT false,
    is_visible BOOLEAN DEFAULT true,
    is_published BOOLEAN DEFAULT true,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Step 5: API Endpoints
```javascript
// Universal API pattern
app.get('/api/[namespace]/[entities]', async (req, res) => {
    // List all entities
    const entities = await db.query('SELECT * FROM [entity_table] WHERE is_visible = true');
    res.json({ success: true, data: entities });
});

app.get('/api/[namespace]/[entities]/:id', async (req, res) => {
    // Get single entity with ALL details
    const entity = await db.query('SELECT * FROM [entity_table] WHERE id = $1', [req.params.id]);
    res.json({ success: true, data: entity[0] });
});

app.post('/api/[namespace]/[entities]', async (req, res) => {
    // Create new entity
    // Implementation...
});

app.put('/api/[namespace]/[entities]/:id', async (req, res) => {
    // Update entity
    // Implementation...
});

app.delete('/api/[namespace]/[entities]/:id', async (req, res) => {
    // Delete entity
    // Implementation...
});
```

### Step 6: Admin Integration
```javascript
// Add to admin panel
function load[Entities]Tab() {
    fetch(`${API_BASE}/[namespace]/[entities]`)
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('[entities]List');
            container.innerHTML = data.data.map(entity => `
                <div class="[entity]-card">
                    <h4>${entity.title}</h4>
                    <div class="quick-actions">
                        <button onclick="toggle[Entity]Visibility(${entity.id}, !${entity.is_visible})">
                            ${entity.is_visible ? '👁️' : '🙈'}
                        </button>
                        <button onclick="open[Entity]EditModal(${entity.id})">✏️ Edit</button>
                        <button onclick="preview[Entity](${entity.id})">👀 Preview</button>
                    </div>
                </div>
            `).join('');
        });
}
```

---

## 🧪 Universal Testing Pattern

### Playwright Test Template
```javascript
const { test, expect } = require('@playwright/test');

// Universal test for any entity type
async function testEntityDetailsPage(page, entityType, entityId) {
    await page.goto(`http://localhost:3005/detail_${entityType}.html?id=${entityId}`);

    // Verify shared component loaded
    await expect(page.locator('.entity-details-hero-section')).toBeVisible();

    // Verify content populated from database
    const title = await page.locator('.entity-details-hero-title').textContent();
    expect(title).toBeTruthy();
    expect(title).not.toBe('');

    // Verify NO static content remains
    const staticContent = await page.locator('text="hardcoded text"').count();
    expect(staticContent).toBe(0);

    console.log(`✅ ${entityType} ID ${entityId}: All tests passed`);
}

test('Entity details pages work correctly', async ({ page }) => {
    // Test different entity types
    await testEntityDetailsPage(page, 'courses', 2);
    await testEntityDetailsPage(page, 'blogs', 1);
    await testEntityDetailsPage(page, 'products', 3);
});
```

---

## 🎯 Critical Implementation Rules

### Rule 1: NEVER Use Static Content
```html
<!-- ❌ NEVER DO THIS -->
<h1>Learn Web Development</h1>
<p>Master HTML, CSS, and JavaScript</p>

<!-- ✅ ALWAYS DO THIS -->
<h1 class="entity-details-hero-title"></h1>
<p class="entity-details-hero-description"></p>
```

### Rule 2: Database-First Population
```javascript
// ❌ NEVER hardcode
const items = ['Item 1', 'Item 2', 'Item 3'];

// ✅ ALWAYS fetch from database
const items = entity.content
    ? this.parseContentArray(entity.content)
    : ['Default fallback if no content'];
```

### Rule 3: Universal CSS Classes
```css
/* Use generic classes that work for any entity */
.entity-details-hero-section { /* styles */ }
.entity-details-hero-title { /* styles */ }
.entity-content-container { /* styles */ }
.entity-info-card { /* styles */ }

/* NOT entity-specific classes like */
.course-details-hero-section { /* too specific */ }
```

### Rule 4: Consistent URL Pattern
```
detail_[entities].html?id={entity_id}

Examples:
- detail_courses.html?id=2
- detail_blogs.html?id=5
- detail_products.html?id=8
- detail_events.html?id=12
```

---

## 📋 Implementation Checklist

For each new entity type, ensure:

- [ ] ✅ Shared component directory created
- [ ] ✅ Template HTML with zero static content
- [ ] ✅ Complete responsive CSS styling
- [ ] ✅ JavaScript component with database integration
- [ ] ✅ Single database table with all fields
- [ ] ✅ RESTful API endpoints implemented
- [ ] ✅ Admin panel integration added
- [ ] ✅ Quick Actions for inline editing
- [ ] ✅ Modal edit system with auto-save
- [ ] ✅ Preview functionality working
- [ ] ✅ Playwright tests passing
- [ ] ✅ Zero static content verified

---

*This universal pattern ensures consistent, maintainable, and scalable entity management across the entire system.*