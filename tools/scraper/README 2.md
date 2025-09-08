# TeachMeSkills.by Site Structure Scraper & Implementation

## What We've Built

A complete Playwright-based scraping solution to extract and mimic the site hierarchy of TeachMeSkills.by for your JAMstack e-learning platform.

## Files Created

### 1. Scraping Tools
- **crawl-structure.ts** - Advanced crawler with section detection (had issues with the target site)
- **simple-crawl.ts** - Simplified crawler that successfully extracted basic structure
- **enhanced-crawl.ts** - Enhanced version for detailed section analysis

### 2. Output Data
- **structure/hierarchy.json** - Site navigation structure
- **structure/simple-site-structure.json** - Successfully scraped page hierarchy
- **structure/implementation-guide.md** - Auto-generated implementation guide

### 3. Implementation Files
- **IMPLEMENTATION_PLAN.md** - Complete guide to implement TeachMeSkills structure
- **section-renderer.js** - JavaScript class to dynamically render sections

## Quick Start

### Run the Scraper

```bash
# Install dependencies (already done)
npm install

# Run simple crawler (works best)
npx tsx simple-crawl.ts https://teachmeskills.by 2

# Run enhanced crawler for specific pages
npx tsx enhanced-crawl.ts
```

### Use the Section Renderer

Add to your HTML pages:

```html
<!-- In your index.html -->
<div id="dynamic-sections"></div>

<script src="tools/scraper/section-renderer.js"></script>
<script>
  // Auto-renders homepage sections based on TeachMeSkills structure
</script>
```

Or use programmatically:

```javascript
const renderer = new SectionRenderer();
const html = await renderer.renderPage(HOMEPAGE_SECTIONS);
document.getElementById('content').innerHTML = html;
```

## Key Findings from TeachMeSkills.by

### Site Structure
```
/ (Homepage)
├── /kursy (Courses catalog)
├── /teachers (Instructor profiles)
├── /blog (Blog posts)
├── /career-center (Career services)
└── /proforientation (Career orientation)
```

### Common Page Sections (in order)
1. Hero Banner
2. Course Grid/Showcase
3. Features/Benefits
4. Statistics
5. Process Steps
6. Testimonials
7. Instructors Preview
8. Call-to-Action
9. Footer

## Implementation Guide

### Step 1: Update Your Homepage

Your `index.html` should follow this section order:
1. Hero with strong value proposition
2. Featured courses (8 courses, 2 rows)
3. Why choose us (4 features)
4. Success metrics (students, courses, employment rate)
5. Learning process (4 steps)
6. Student testimonials
7. Meet instructors preview
8. Strong CTA section
9. Comprehensive footer

### Step 2: Create Missing Pages

You need to create:
- `teachers.html` - Instructor profiles page
- `career-center.html` - Career services page

### Step 3: Update Strapi Content Types

Add these fields to your Course content type:
- `featured` (boolean) - for homepage display
- `category` (enum) - Frontend, Backend, Mobile, QA, Design
- `enrollment_open` (boolean)

### Step 4: Integrate the Section Renderer

Copy `section-renderer.js` to your main project and include it in your pages:

```javascript
// In your pages
<script src="/js/section-renderer.js"></script>
```

## Customization

### Modify Section Order

Edit the section arrays in `section-renderer.js`:

```javascript
const HOMEPAGE_SECTIONS = [
  { type: 'hero_banner', props: { /* your props */ } },
  // Add or reorder sections here
];
```

### Style Matching

Add these CSS classes to match TeachMeSkills style:

```css
.course-grid { 
  display: grid; 
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
  gap: 2rem; 
}

.hero-banner {
  min-height: 60vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stats-section {
  background: #f7fafc;
  padding: 4rem 0;
}
```

## Testing

1. **Check scraped data**: Review `structure/simple-site-structure.json`
2. **Test section rendering**: Open `test-render.html` in browser
3. **Verify API connections**: Check console for Strapi API calls
4. **Mobile responsiveness**: Test on different screen sizes

## Troubleshooting

### If crawler fails:
- The site may have anti-scraping measures
- Try reducing depth: `npx tsx simple-crawl.ts [url] 1`
- Use the simplified crawler instead of advanced

### If sections don't render:
- Check Strapi API token in `section-renderer.js`
- Verify Strapi is running on `localhost:1337`
- Check browser console for errors

## Next Steps

1. ✅ Run the scraper to get site structure
2. ✅ Review the generated `IMPLEMENTATION_PLAN.md`
3. 🔄 Implement section order in your `index.html`
4. 🔄 Create missing pages (`teachers.html`, `career-center.html`)
5. 🔄 Update Strapi content types
6. 🔄 Style sections to match your brand
7. 🔄 Test with real Strapi data

## Support Files

- **package.json** - Node dependencies
- **tsconfig.json** - TypeScript configuration
- **structure/** - All scraped data outputs

---

The scraping is complete and you now have everything needed to mimic TeachMeSkills.by's structure in your platform!