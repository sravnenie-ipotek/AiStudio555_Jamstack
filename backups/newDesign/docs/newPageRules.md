# =€ NEW PAGE CREATION GUIDELINES
## AI Studio NewDesign - Page-Based Database Architecture

> **  CRITICAL WARNING**: Follow these guidelines EXACTLY to prevent database inconsistencies, integration bugs, and admin panel failures. Every step is mandatory.

---

## <¯ OVERVIEW

When creating a new page in the AI Studio NewDesign system, you MUST create all components to ensure the content manager can edit ALL content through the admin panel. No hardcoded content is allowed.

### =Ë Required Components Checklist
For each new page, you MUST create:
- [ ] Database table (`nd_[pagename]_page`)
- [ ] API endpoint in server.js (`/api/nd/[pagename]-page`)
- [ ] Integration JavaScript file (`js/nd-[pagename]-integration.js`)
- [ ] Admin panel section (in admin-nd.html)
- [ ] HTML page with data attributes (no hardcoded content)
- [ ] Test the complete integration

---

## =Ê STEP 1: DATABASE TABLE CREATION

### 1.1 Table Naming Convention
```sql
-- MANDATORY FORMAT: nd_[pagename]_page
-- Examples:
nd_blog_page           CORRECT
nd_teachers_page       CORRECT
nd_career_center_page  CORRECT

-- WRONG FORMATS:
blog_page            L Missing nd_ prefix
nd_blog              L Missing _page suffix
nd-blog-page         L Using hyphens instead of underscores
```

### 1.2 Standard Table Structure
```sql
CREATE TABLE IF NOT EXISTS nd_[pagename]_page (
    id SERIAL PRIMARY KEY,
    section_name VARCHAR(100) UNIQUE NOT NULL,
    content_en JSONB DEFAULT '{}'::jsonb,
    content_ru JSONB DEFAULT '{}'::jsonb,
    content_he JSONB DEFAULT '{}'::jsonb,
    visible BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- MANDATORY INDEXES
CREATE INDEX IF NOT EXISTS idx_nd_[pagename]_page_visible
    ON nd_[pagename]_page (visible);
CREATE INDEX IF NOT EXISTS idx_nd_[pagename]_page_order
    ON nd_[pagename]_page (display_order);
```

### 1.3 Section Structure Rules

#### Hero Section (MANDATORY)
```sql
INSERT INTO nd_[pagename]_page (section_name, content_en, display_order) VALUES
('hero', '{
    "title": "Page Title Here",
    "subtitle": "Page Subtitle",
    "description": "Page description text",
    "buttons": [
        {"text": "Primary CTA", "url": "#", "style": "primary"},
        {"text": "Secondary CTA", "url": "#", "style": "secondary"}
    ],
    "background_image": "images/hero-bg.jpg",
    "visible": true
}', 1);
```

#### Common Section Types
```sql
-- Content Grid Section
INSERT INTO nd_[pagename]_page (section_name, content_en, display_order) VALUES
('content_grid', '{
    "title": "Section Title",
    "subtitle": "Section Subtitle",
    "items": [
        {
            "title": "Item Title",
            "description": "Item description",
            "icon": "images/icon.svg",
            "url": "#"
        }
    ]
}', 2);

-- Testimonials Section
INSERT INTO nd_[pagename]_page (section_name, content_en, display_order) VALUES
('testimonials', '{
    "title": "What Our Users Say",
    "items": [
        {
            "name": "John Doe",
            "role": "CEO, Company",
            "content": "Testimonial content here",
            "image": "images/testimonial.jpg",
            "rating": 5
        }
    ]
}', 3);

-- FAQ Section
INSERT INTO nd_[pagename]_page (section_name, content_en, display_order) VALUES
('faq', '{
    "title": "Frequently Asked Questions",
    "items": [
        {
            "question": "Question here?",
            "answer": "Answer here"
        }
    ]
}', 4);

-- CTA Section
INSERT INTO nd_[pagename]_page (section_name, content_en, display_order) VALUES
('cta', '{
    "title": "Ready to Get Started?",
    "description": "Description text",
    "button_text": "Get Started",
    "button_url": "/contact",
    "background_color": "#667eea"
}', 5);
```

---

## = STEP 2: API ENDPOINT CREATION

### 2.1 Server.js Endpoint Template
```javascript
// Add to server.js (around line 7500)
app.get('/api/nd/[pagename]-page', async (req, res) => {
    console.log('=Ä [PAGENAME] Page API called');

    try {
        const { locale = 'en', preview = false } = req.query;

        console.log(`< Locale: ${locale}, Preview: ${preview}`);

        // Validate locale
        const validLocales = ['en', 'ru', 'he'];
        const currentLocale = validLocales.includes(locale) ? locale : 'en';

        // Build query
        const query = `
            SELECT
                section_name,
                content_${currentLocale} as content,
                visible,
                display_order
            FROM nd_[pagename]_page
            WHERE visible = true
            ORDER BY display_order ASC
        `;

        const result = await queryDatabase(query);
        console.log(` Found ${result.rows.length} sections for [pagename] page`);

        // Organize data by section
        const sections = {};
        result.rows.forEach(row => {
            sections[row.section_name] = {
                ...row.content,
                visible: row.visible,
                display_order: row.display_order
            };
        });

        // Structure response
        const pageData = {
            data: {
                sections: sections,
                meta: {
                    locale: currentLocale,
                    preview: preview === 'true',
                    sections_count: result.rows.length,
                    last_updated: new Date().toISOString()
                }
            },
            success: true
        };

        console.log(`=Ê [PAGENAME] page data structured:`, Object.keys(sections));

        res.json(pageData);

    } catch (error) {
        console.error('L Error fetching [pagename] page data:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch [pagename] page data',
            details: error.message
        });
    }
});

// UPDATE Endpoint (for admin panel)
app.put('/api/nd/[pagename]-page/:section', async (req, res) => {
    console.log('=Ý Updating [pagename] page section:', req.params.section);

    try {
        const { section } = req.params;
        const { content_en, content_ru, content_he, visible } = req.body;

        const query = `
            UPDATE nd_[pagename]_page
            SET
                content_en = $1,
                content_ru = $2,
                content_he = $3,
                visible = $4,
                updated_at = now()
            WHERE section_name = $5
            RETURNING *
        `;

        const result = await queryDatabase(query, [
            JSON.stringify(content_en || {}),
            JSON.stringify(content_ru || {}),
            JSON.stringify(content_he || {}),
            visible !== undefined ? visible : true,
            section
        ]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Section not found'
            });
        }

        res.json({
            success: true,
            data: result.rows[0],
            message: `[PAGENAME] ${section} section updated successfully`
        });

    } catch (error) {
        console.error('L Error updating [pagename] section:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update section',
            details: error.message
        });
    }
});
```

---

## <­ STEP 3: INTEGRATION JAVASCRIPT FILE

### 3.1 File Naming Convention
```
js/nd-[pagename]-integration.js

Examples:
js/nd-blog-integration.js          CORRECT
js/nd-teachers-integration.js      CORRECT
js/nd-career-center-integration.js  CORRECT
```

### 3.2 Integration Script Template
```javascript
/**
 * [PAGENAME] PAGE DATABASE INTEGRATION
 * Fetches ALL content from nd_[pagename]_page table and populates the page
 * CRITICAL: No hardcoded content should remain in [pagename].html
 */

(function() {
    'use strict';

    // Configuration
    const API_BASE_URL = window.location.hostname === 'localhost'
        ? 'http://localhost:3000'
        : 'https://aistudio555jamstack-production.up.railway.app';

    // Get current language from URL or default to 'en'
    function getCurrentLocale() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('locale') || 'en';
    }

    // Main function to load page data
    async function load[PageName]Data() {
        try {
            console.log('= Loading [pagename] page data from database...');

            const locale = getCurrentLocale();
            const response = await fetch(`${API_BASE_URL}/api/nd/[pagename]-page?locale=${locale}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch [pagename] data: ${response.status}`);
            }

            const data = await response.json();
            console.log(' [PageName] page data loaded:', data);

            // Populate the page with data
            if (data.success && data.data && data.data.sections) {
                populate[PageName]Page(data.data.sections);
            } else {
                console.warn('  No [pagename] page data found in database');
                // Don't show anything if no data (per user requirement)
            }

        } catch (error) {
            console.error('L Error loading [pagename] page data:', error);
            // Don't show anything if API fails (per user requirement)
        }
    }

    // Populate all sections of the page
    function populate[PageName]Page(sections) {
        console.log('=Ý Populating [pagename] page sections:', Object.keys(sections));

        // 1. Hero Section
        if (sections.hero) {
            populateHeroSection(sections.hero);
        }

        // 2. Content Grid Section
        if (sections.content_grid) {
            populateContentGridSection(sections.content_grid);
        }

        // 3. Testimonials Section
        if (sections.testimonials) {
            populateTestimonialsSection(sections.testimonials);
        }

        // 4. FAQ Section
        if (sections.faq) {
            populateFAQSection(sections.faq);
        }

        // 5. CTA Section
        if (sections.cta) {
            populateCTASection(sections.cta);
        }
    }

    // Populate Hero Section
    function populateHeroSection(heroData) {
        console.log('<¯ Updating hero section...');

        if (heroData.title) {
            updateTextContent('[data-section="hero"] [data-field="title"]', heroData.title);
        }

        if (heroData.subtitle) {
            updateTextContent('[data-section="hero"] [data-field="subtitle"]', heroData.subtitle);
        }

        if (heroData.description) {
            updateTextContent('[data-section="hero"] [data-field="description"]', heroData.description);
        }

        // Update buttons
        if (heroData.buttons && Array.isArray(heroData.buttons)) {
            const primaryButton = document.querySelector('[data-section="hero"] [data-field="primary-button"]');
            if (primaryButton && heroData.buttons[0]) {
                const buttonText = primaryButton.querySelectorAll('.button-text, .primary-button-text-block');
                buttonText.forEach(el => {
                    el.textContent = heroData.buttons[0].text;
                });
                if (heroData.buttons[0].url) {
                    primaryButton.href = heroData.buttons[0].url;
                }
            }

            const secondaryButton = document.querySelector('[data-section="hero"] [data-field="secondary-button"]');
            if (secondaryButton && heroData.buttons[1]) {
                const buttonText = secondaryButton.querySelectorAll('.button-text, .primary-button-text-block');
                buttonText.forEach(el => {
                    el.textContent = heroData.buttons[1].text;
                });
                if (heroData.buttons[1].url) {
                    secondaryButton.href = heroData.buttons[1].url;
                }
            }
        }

        console.log(' Hero section updated');
    }

    // Utility function to safely update text content
    function updateTextContent(selector, text) {
        if (!text) return;

        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            if (element) {
                element.textContent = text;
                // Remove opacity:0 to ensure content is visible
                if (element.style.opacity === '0') {
                    element.style.opacity = '1';
                }
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', load[PageName]Data);
    } else {
        load[PageName]Data();
    }

    // Expose function globally for debugging
    window.reload[PageName]Data = load[PageName]Data;

})();
```

---

## < STEP 4: HTML PAGE PREPARATION

### 4.1 Data Attributes System
```html
<!-- Hero Section Example -->
<section class="section hero" data-section="hero">
    <div class="container">
        <div class="hero-content">
            <!-- Use data-field attributes for database content -->
            <h1 data-field="title">Default Title (will be replaced)</h1>
            <p data-field="subtitle">Default subtitle</p>
            <p data-field="description">Default description</p>

            <!-- Buttons with data-field attributes -->
            <div class="buttons">
                <a href="#" data-field="primary-button" class="btn btn-primary">
                    <span class="button-text">Default Text</span>
                </a>
                <a href="#" data-field="secondary-button" class="btn btn-secondary">
                    <span class="button-text">Default Text</span>
                </a>
            </div>
        </div>
    </div>
</section>

<!-- Content Grid Section Example -->
<section class="section content-grid" data-section="content-grid">
    <div class="container">
        <h2 data-field="title">Default Grid Title</h2>
        <p data-field="subtitle">Default Grid Subtitle</p>

        <!-- Container for dynamic items -->
        <div class="grid-container" data-field="items-container">
            <!-- Items will be populated by JavaScript -->
        </div>
    </div>
</section>
```

### 4.2 Integration Script Include
```html
<!-- Add before closing </body> tag -->
<script src="js/nd-[pagename]-integration.js" type="text/javascript"></script>
```

---

## ™ STEP 5: ADMIN PANEL INTEGRATION

### 5.1 Admin Panel Section Template
```javascript
// Add to admin-nd.html in the pages configuration
const pages = {
    // ... existing pages ...
    '[pagename]': {
        title: '[Page Name]',
        apiEndpoint: '/api/nd/[pagename]-page',
        sections: [
            {
                key: 'hero',
                title: 'Hero Section',
                fields: [
                    { name: 'title', type: 'text', label: 'Title' },
                    { name: 'subtitle', type: 'text', label: 'Subtitle' },
                    { name: 'description', type: 'textarea', label: 'Description' },
                    {
                        name: 'buttons',
                        type: 'array',
                        label: 'Buttons',
                        fields: [
                            { name: 'text', type: 'text', label: 'Button Text' },
                            { name: 'url', type: 'text', label: 'Button URL' },
                            { name: 'style', type: 'select', label: 'Style', options: ['primary', 'secondary'] }
                        ]
                    }
                ]
            }
            // Add more sections as needed
        ]
    }
};
```

---

## >ê STEP 6: TESTING AND VALIDATION

### 6.1 Complete Testing Script Template
```javascript
// test-[pagename]-complete.js
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL ||
        'postgresql://postgres:T%40r%40Flex000@localhost:5432/aistudio_db'
});

async function testPageIntegration() {
    console.log('>ê Testing [pagename] page complete integration...');

    try {
        // 1. Test database table exists
        const tableCheck = await pool.query(`
            SELECT table_name FROM information_schema.tables
            WHERE table_name = 'nd_[pagename]_page'
        `);

        if (tableCheck.rows.length === 0) {
            throw new Error('L Table nd_[pagename]_page does not exist');
        }
        console.log(' Database table exists');

        // 2. Test data exists
        const dataCheck = await pool.query(`
            SELECT COUNT(*) as count FROM nd_[pagename]_page WHERE visible = true
        `);

        if (parseInt(dataCheck.rows[0].count) === 0) {
            throw new Error('L No visible sections found in table');
        }
        console.log(` Found ${dataCheck.rows[0].count} sections in database`);

        // 3. Test API endpoint
        const apiResponse = await fetch('http://localhost:3000/api/nd/[pagename]-page');
        if (!apiResponse.ok) {
            throw new Error(`L API endpoint failed: ${apiResponse.status}`);
        }

        const apiData = await apiResponse.json();
        if (!apiData.success) {
            throw new Error('L API returned success: false');
        }
        console.log(' API endpoint working');

        console.log('\n<‰ All tests passed! [PageName] page integration is complete.');
        return true;

    } catch (error) {
        console.error('\nL Integration test failed:', error.message);
        return false;
    } finally {
        await pool.end();
    }
}

// Run tests
testPageIntegration()
    .then(success => process.exit(success ? 0 : 1))
    .catch(error => {
        console.error('Test execution failed:', error);
        process.exit(1);
    });
```

---

## =¨ COMMON MISTAKES TO AVOID

### L Database Mistakes
1. **Wrong table name format** - Must be `nd_[pagename]_page`
2. **Missing indexes** - Always create visible and display_order indexes
3. **Incorrect JSONB structure** - Always use proper JSON in content fields
4. **Missing multilingual columns** - Must have content_en, content_ru, content_he
5. **No default sections** - Always insert at least a hero section

### L API Mistakes
1. **Inconsistent endpoint naming** - Must be `/api/nd/[pagename]-page`
2. **Missing error handling** - Always wrap in try-catch
3. **No locale validation** - Always validate and default to 'en'
4. **Missing UPDATE endpoint** - Admin panel needs PUT endpoint

### L Integration Script Mistakes
1. **Wrong file naming** - Must be `nd-[pagename]-integration.js`
2. **Hardcoded API URLs** - Always use dynamic localhost/production detection
3. **No error handling** - Always handle API failures gracefully
4. **Missing data-field selectors** - Must match HTML data attributes exactly
5. **Not removing opacity:0** - Content might be invisible due to animations

### L HTML Mistakes
1. **Missing data-section attributes** - Required for section identification
2. **Missing data-field attributes** - Required for field population
3. **Hardcoded content** - All content must come from database
4. **Missing integration script** - Page won't work without the JS file

### L Admin Panel Mistakes
1. **Missing page configuration** - Page won't appear in admin
2. **Incorrect field types** - Use appropriate input types (text, textarea, array)
3. **Missing section keys** - Must match database section_name exactly
4. **Missing API endpoints** - Admin needs both GET and PUT endpoints

---

## <¯ SUCCESS CHECKLIST

Before considering a new page complete, verify ALL items:

### Database 
- [ ] Table `nd_[pagename]_page` created with correct structure
- [ ] Required indexes created (visible, display_order)
- [ ] Default sections inserted (at minimum: hero)
- [ ] All three language columns present (content_en, content_ru, content_he)

### API 
- [ ] GET `/api/nd/[pagename]-page` endpoint added to server.js
- [ ] PUT `/api/nd/[pagename]-page/:section` endpoint added for admin
- [ ] Locale parameter handling works (en/ru/he)
- [ ] Error handling implemented

### Integration 
- [ ] File `js/nd-[pagename]-integration.js` created
- [ ] All sections have population functions
- [ ] Data-field selectors work correctly
- [ ] Error handling prevents page breaking

### HTML 
- [ ] All content elements have data-section and data-field attributes
- [ ] No hardcoded content remains
- [ ] Integration script included correctly
- [ ] Page displays database content (not default text)

### Admin Panel 
- [ ] Page appears in admin navigation
- [ ] All sections editable
- [ ] Field types appropriate for content
- [ ] Changes save successfully
- [ ] Changes appear on frontend immediately

### Testing 
- [ ] Complete integration test passes
- [ ] Manual frontend testing complete
- [ ] Admin panel functionality verified
- [ ] Multilingual support tested
- [ ] No console errors

---

## =Þ TROUBLESHOOTING

### Database Connection Issues
```bash
# Test database connection
node -e "
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: 'postgresql://postgres:T%40r%40Flex000@localhost:5432/aistudio_db'
});
pool.query('SELECT NOW()').then(() => {
    console.log(' Database connected');
    pool.end();
}).catch(console.error);
"
```

### API Endpoint Issues
```bash
# Test API endpoint manually
curl -X GET "http://localhost:3000/api/nd/[pagename]-page" -H "Content-Type: application/json"
```

### Frontend Integration Issues
```javascript
// Debug integration script in browser console
console.log('= Debug: API_BASE_URL:', API_BASE_URL);
fetch(`${API_BASE_URL}/api/nd/[pagename]-page`)
    .then(response => response.json())
    .then(data => console.log('= Debug: API response:', data));
```

---

## <¯ CURRENT PAGE STATUS ANALYSIS

###  IMPLEMENTED PAGES
- **Home**: nd_home + nd-home-integration.js + API 
- **Pricing**: nd_pricing_page + nd-pricing-integration.js + API 
- **About**: nd_about_page + API 

###   PARTIALLY IMPLEMENTED PAGES
- **Courses**: nd_courses_page table exists, needs integration.js
- **Blog**: nd_blog_page table exists, needs integration.js
- **Teachers**: nd_teachers_page table exists, needs integration.js

### L MISSING PAGES (Need Complete Implementation)
- **Career Center**: Needs nd_career_center_page table + full implementation
- **Career Orientation**: Needs nd_career_orientation_page table + full implementation

### =Ê MENU PAGES REQUIREMENTS

Based on menu analysis:
1. **Home**  Complete
2. **Courses**   Needs integration script
3. **Pricing**  Complete
4. **Blog**   Needs integration script
5. **Teachers**   Needs integration script
6. **About Us** dropdown:
   - **Career Orientation** L Complete implementation needed
   - **Career Center** L Complete implementation needed

---

**  CRITICAL RULE**: Every page MUST follow this exact pattern. No exceptions. No shortcuts. When admin panel changes appear immediately on frontend, integration is correct.

---

*Document Version: 1.0*
*Created: September 2025*
*Architecture: NewDesign Page-Based Database System*
*Compliance: MANDATORY for all new pages*
*  FOLLOW EXACTLY TO PREVENT BUGS*