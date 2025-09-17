# NewDesign Home.html Content Migration Plan

**Date:** September 16, 2025
**Source:** `/Users/michaelmishayev/Desktop/newCode/backups/newDesign/home.html`
**Target:** NewDesign Database via API `http://localhost:1337/api/nd/home-page`

## Executive Summary

**Analysis Results:**
- **Total sections found in home.html:** 12
- **Sections already in database:** 15
- **Missing sections:** 2 (course_categories, track)
- **Sections with content mismatches:** 4
- **Critical missing content items:** 8

**Priority Actions Required:**
1. Create 2 missing sections in database
2. Update 4 sections with content mismatches
3. Add visual elements (images, video) to hero section
4. Remove hardcoded content from HTML

## Phase 1: Critical Priority Migrations

### 1.1 Create Course Categories Section
**Status:** COMPLETELY MISSING from database
**Impact:** HIGH - Course categories section is not managed by admin

**Action Required:**
```sql
-- Add course_categories section to nd_home table
ALTER TABLE nd_home ADD COLUMN course_categories_visible BOOLEAN DEFAULT true;
ALTER TABLE nd_home ADD COLUMN course_categories_content_en TEXT;
ALTER TABLE nd_home ADD COLUMN course_categories_content_ru TEXT;
ALTER TABLE nd_home ADD COLUMN course_categories_content_he TEXT;
```

**Content to migrate:**
```json
{
  "title": "Browse Our Tech Course Categories.",
  "subtitle": "Course Categories",
  "description": "Dive into a world of learning with diverse and extensive range of tech courses designed to cater to every interest.",
  "button_text": "Discover Courses",
  "button_url": "courses.html",
  "categories": []
}
```

**Admin Panel Update Required:**
- Add course_categories section to admin-nd.html
- Add form fields for title, subtitle, description, button
- Add dynamic category management (add/edit/delete categories)

### 1.2 Update Hero Section Content
**Status:** MAJOR CONTENT MISMATCH
**Impact:** HIGH - Hero content is completely different

**Current Database Content:**
```json
{
  "title": "Welcome to AI Studio New Design22",
  "subtitle": "Modern Learning Platform",
  "description": "Experience the next generation of online education"
}
```

**Required HTML Content:**
```json
{
  "title": "Unlock Potential With Proven Courses.",
  "subtitle": "Expert-Led Learning",
  "description": "Here you can elevate your tech career with expert-led courses. whether you're just starting out or aiming to advance your skills, our hands-on, practical training is designed.",
  "buttons": [
    {
      "text": "get in touch",
      "url": "contact-us.html",
      "style": "primary"
    },
    {
      "text": "Check Out Courses",
      "url": "courses.html",
      "style": "secondary"
    }
  ]
}
```

**Migration Command:**
```bash
curl -X PUT "http://localhost:1337/api/nd/home-page/hero" \
  -H "Content-Type: application/json" \
  -d '{
    "content_en": {
      "title": "Unlock Potential With Proven Courses.",
      "subtitle": "Expert-Led Learning",
      "description": "Here you can elevate your tech career with expert-led courses. whether you're just starting out or aiming to advance your skills, our hands-on, practical training is designed.",
      "buttons": [
        {"text": "get in touch", "url": "contact-us.html", "style": "primary"},
        {"text": "Check Out Courses", "url": "courses.html", "style": "secondary"}
      ]
    },
    "visible": true
  }'
```

### 1.3 Add Visual Elements to Hero Section
**Status:** MISSING banner images and video
**Impact:** HIGH - Visual elements not manageable

**Schema Changes Required:**
```sql
-- Add visual element fields to hero section
-- These will be stored in the JSON content fields
```

**Content to add:**
```json
{
  "banner_images": [
    "images/Banner-Man-Img1_1Banner-Man-Img1.png",
    "images/Banner-Man-Img2_1Banner-Man-Img2.png",
    "images/Banner-Card-Shape1.png",
    "images/Banner-Card1.png",
    "images/Banner-Card-Shape2.png",
    "images/Banner-Card2.png"
  ],
  "video": {
    "poster": "https://cdn.prod.website-files.com/66ebc1dba0dd85605c7bf556%2F66ebe94e35c435b688d514c7_Video-poster-00001.jpg",
    "sources": [
      "https://cdn.prod.website-files.com/66ebc1dba0dd85605c7bf556%2F66ebe94e35c435b688d514c7_Video-transcode.mp4",
      "https://cdn.prod.website-files.com/66ebc1dba0dd85605c7bf556%2F66ebe94e35c435b688d514c7_Video-transcode.webm"
    ]
  }
}
```

**Admin Panel Update Required:**
- Add image upload/URL fields for banner images
- Add video poster and source URL fields

## Phase 2: High Priority Migrations

### 2.1 Update About Section Content
**Status:** PARTIAL CONTENT MISMATCH
**Impact:** HIGH - About section titles differ

**Migration Required:**
```bash
curl -X PUT "http://localhost:1337/api/nd/home-page/about" \
  -H "Content-Type: application/json" \
  -d '{
    "content_en": {
      "title": "Your Learning Journey With Our Experts.",
      "main_title": "Get To Know Your Pathway To Mastery.",
      "subtitle": "Meet Your Mentor",
      "description": "With over a decade of experience in the tech industry, mentor has dedicated their career to empowering learners.",
      "mentor_name": "Mrs. Sarah Johnson",
      "extended_description": "She has received prestigious honors \"Top Educator\" award and the \"Teaching Excellence\" award.",
      "counters": [
        {"label": "Total Courses Taught", "value": "100", "suffix": "+"},
        {"label": "Total Happy Learners", "value": "500", "suffix": "K+"},
        {"label": "Years Of Experience", "value": "10", "suffix": "+"}
      ]
    }
  }'
```

### 2.2 Create Track/Ticker Section
**Status:** COMPLETELY MISSING
**Impact:** MEDIUM - Animated visual element

**Schema Changes Required:**
```sql
ALTER TABLE nd_home ADD COLUMN track_visible BOOLEAN DEFAULT true;
ALTER TABLE nd_home ADD COLUMN track_content_en TEXT;
ALTER TABLE nd_home ADD COLUMN track_content_ru TEXT;
ALTER TABLE nd_home ADD COLUMN track_content_he TEXT;
```

**Content to migrate:**
```json
{
  "items": ["Start Learning", "Browse Courses"],
  "animation_enabled": true,
  "speed": "normal"
}
```

### 2.3 Remove Hardcoded FAQ Content
**Status:** HARDCODED content in HTML
**Impact:** HIGH - FAQ content not manageable

**HTML Changes Required:**
- Remove hardcoded FAQ section from home.html
- Update home.html to load FAQ content from database API
- Verify database FAQ content is complete (it is)

**File to update:** `/Users/michaelmishayev/Desktop/newCode/backups/newDesign/home.html`
- Remove lines with hardcoded FAQ questions and answers
- Add JavaScript to load FAQ content dynamically

## Phase 3: Medium Priority Updates

### 3.1 Update Course Section Titles
```bash
curl -X PUT "http://localhost:1337/api/nd/home-page/courses" \
  -H "Content-Type: application/json" \
  -d '{
    "content_en": {
      "title": "Enhance Your Skills With Curated Courses.",
      "subtitle": "Featured Courses"
    }
  }'
```

### 3.2 Sync Why Choose Us Features
**Status:** Feature content exists but with differences

**Current Database Features:**
- "Innovative Teaching Methods Here."
- "Certified Professional In Your Needs."
- "Expert Instructor Of Industry."

**HTML Features:** Same titles, minor description differences

**Action:** Verify current database content is adequate or update with HTML versions.

## Implementation Steps

### Step 1: Database Schema Updates
Execute the SQL commands to add missing columns for new sections.

### Step 2: API Endpoint Updates
Ensure server.js handles the new sections:
- course_categories
- track

### Step 3: Admin Panel Updates
Update admin-nd.html to include:
- Course categories management section
- Track/ticker content management
- Visual elements for hero section
- Enhanced form fields

### Step 4: Content Migration
Execute the migration commands to update content.

### Step 5: HTML Integration Updates
Update home.html to:
- Remove hardcoded content
- Load all content from database APIs
- Support new sections (course_categories, track)

### Step 6: Testing
Test all sections load correctly from database in both admin and frontend.

## Database Schema Summary

**New Sections to Create:**
1. `course_categories` - Course category listings
2. `track` - Animated ticker content

**Existing Sections to Update:**
1. `hero` - Add visual elements (images, video)
2. `about` - Update titles and descriptions
3. `courses` - Update section titles

**Admin Panel Enhancements Needed:**
1. Course categories management interface
2. Track content management
3. Visual elements management for hero
4. Enhanced search functionality for new content

## Success Criteria

✅ **Complete Migration Success when:**
1. All 12 HTML sections have corresponding database entries
2. Admin panel can manage all content without hardcoded elements
3. Home.html loads 100% dynamically from database
4. Content matches between HTML design and database content
5. All visual elements (images, video) are manageable through admin

**Estimated Time:** 4-6 hours for complete migration
**Risk Level:** LOW - Non-destructive additions and updates
**Rollback Plan:** Restore from current database backup if needed