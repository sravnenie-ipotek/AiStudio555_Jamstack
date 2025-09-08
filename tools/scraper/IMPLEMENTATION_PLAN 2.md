# TeachMeSkills.by Site Structure Implementation Plan

## Overview
Based on our crawling and analysis of TeachMeSkills.by, here's the complete implementation plan to mimic their site hierarchy and structure in your JAMstack platform.

## Site Hierarchy

### Primary Navigation Structure
```
Home (/)
├── Courses (/kursy)
│   ├── Course Categories
│   └── Individual Course Pages
├── Teachers (/teachers)
│   └── Teacher Profiles
├── Blog (/blog)
│   └── Blog Posts
├── About School
│   ├── Career Center (/career-center)
│   └── Career Orientation (/proforientation)
└── Contact/Support
```

## Page-by-Page Implementation

### 1. Homepage (index.html)
Based on TeachMeSkills.by structure, implement these sections in order:

```javascript
const homeSections = [
  {
    type: "hero_banner",
    content: {
      headline: "IT Education Platform",
      subheadline: "Learn programming from scratch",
      cta: "View Courses"
    }
  },
  {
    type: "course_showcase",
    props: {
      featured: true,
      limit: 8,
      categories: ["Frontend", "Backend", "Mobile", "QA"]
    }
  },
  {
    type: "features_grid",
    items: [
      "Online Learning",
      "Career Support",
      "Practical Projects",
      "Industry Mentors"
    ]
  },
  {
    type: "statistics",
    numbers: {
      students: "5000+",
      courses: "20+",
      employment_rate: "85%",
      instructors: "50+"
    }
  },
  {
    type: "process_steps",
    steps: [
      "Choose Course",
      "Learn with Mentors",
      "Build Projects",
      "Get Hired"
    ]
  },
  {
    type: "testimonials",
    source: "strapi_api"
  },
  {
    type: "instructors_preview",
    limit: 4
  },
  {
    type: "cta_section",
    buttons: ["Start Learning", "Free Consultation"]
  },
  {
    type: "footer"
  }
];
```

### 2. Courses Page (courses.html)
Transform your existing courses.html to match this structure:

```javascript
const coursesPageStructure = {
  sections: [
    {
      type: "page_header",
      title: "Our Courses"
    },
    {
      type: "course_filters",
      filters: ["Category", "Duration", "Price", "Format"]
    },
    {
      type: "course_grid",
      layout: "3_columns",
      items_per_page: 12
    },
    {
      type: "load_more_button"
    }
  ]
};
```

### 3. New Pages to Create

#### Career Center Page (career-center.html)
```html
<!-- Create new file: career-center.html -->
Sections:
- Hero: "Career Support Services"
- Services Grid (Resume help, Interview prep, Job placement)
- Success Stories
- Partner Companies
- Career Resources
```

#### Teachers Page (teachers.html)
```html
<!-- Create new file: teachers.html -->
Sections:
- Hero: "Learn from Industry Experts"
- Teachers Grid (photo, name, specialty, bio)
- Teaching Philosophy
- Join as Instructor CTA
```

## Strapi Content Types Configuration

### 1. Extend Existing Content Types

```javascript
// Course content type additions
{
  "course": {
    // Existing fields...
    "category": "enum['Frontend', 'Backend', 'Mobile', 'QA', 'Design']",
    "format": "enum['Online', 'Offline', 'Hybrid']",
    "difficulty": "enum['Beginner', 'Intermediate', 'Advanced']",
    "featured": "boolean",
    "start_date": "date",
    "enrollment_open": "boolean"
  }
}
```

### 2. New Content Types Needed

```javascript
// Teacher/Instructor
{
  "instructor": {
    "name": "string",
    "bio": "richtext",
    "photo": "media",
    "specialty": "string",
    "experience_years": "number",
    "linkedin": "string",
    "courses": "relation:many-to-many"
  }
}

// Testimonial
{
  "testimonial": {
    "student_name": "string",
    "course": "relation",
    "rating": "number",
    "review": "text",
    "graduation_date": "date",
    "current_position": "string"
  }
}

// Career Success Story
{
  "success_story": {
    "student": "relation",
    "before_position": "string",
    "after_position": "string",
    "company": "string",
    "salary_increase": "number",
    "story": "richtext"
  }
}
```

## Integration Updates

### webflow-strapi-integration.js Modifications

```javascript
// Add these new API endpoints

// Fetch featured courses for homepage
async function getFeaturedCourses(limit = 8) {
  return await strapiRequest('/courses?filters[featured][$eq]=true&pagination[limit]=' + limit);
}

// Fetch instructors
async function getInstructors() {
  return await strapiRequest('/instructors?populate=*');
}

// Fetch testimonials
async function getTestimonials(limit = 6) {
  return await strapiRequest('/testimonials?populate=course&pagination[limit]=' + limit);
}

// Course filtering
async function filterCourses(filters) {
  const query = new URLSearchParams();
  if (filters.category) query.append('filters[category][$eq]', filters.category);
  if (filters.format) query.append('filters[format][$eq]', filters.format);
  if (filters.difficulty) query.append('filters[difficulty][$eq]', filters.difficulty);
  
  return await strapiRequest('/courses?' + query.toString());
}
```

## Section Components to Build

### 1. Course Card Component
```javascript
function renderCourseCard(course) {
  return `
    <div class="course-card">
      <img src="${course.thumbnail}" alt="${course.title}">
      <div class="course-content">
        <span class="category">${course.category}</span>
        <h3>${course.title}</h3>
        <p class="duration">${course.duration} weeks</p>
        <p class="price">$${course.price}</p>
        <a href="/detail_courses.html?id=${course.id}" class="btn">Learn More</a>
      </div>
    </div>
  `;
}
```

### 2. Instructor Card Component
```javascript
function renderInstructorCard(instructor) {
  return `
    <div class="instructor-card">
      <img src="${instructor.photo.url}" alt="${instructor.name}">
      <h4>${instructor.name}</h4>
      <p class="specialty">${instructor.specialty}</p>
      <p class="experience">${instructor.experience_years} years</p>
    </div>
  `;
}
```

## Route Mapping

Update your Python server or add URL rewriting:

```python
# URL mapping
routes = {
    '/': 'index.html',
    '/kursy': 'courses.html',
    '/courses': 'courses.html',  # English alias
    '/teachers': 'teachers.html',
    '/blog': 'blog.html',
    '/career-center': 'career-center.html',
    '/proforientation': 'orientation.html'
}
```

## Implementation Priority

1. **Phase 1 (Immediate)**
   - Update homepage sections order
   - Add course filtering to courses.html
   - Create teachers.html page

2. **Phase 2 (Next Sprint)**
   - Create career-center.html
   - Add testimonials section
   - Implement instructor profiles

3. **Phase 3 (Future)**
   - Blog functionality
   - Student dashboard
   - Course progress tracking

## CSS Classes to Match

Add these classes to your CSS for consistency:

```css
/* TeachMeSkills-inspired classes */
.course-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
.course-card { border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.instructor-card { text-align: center; padding: 1.5rem; }
.hero-section { min-height: 500px; display: flex; align-items: center; }
.stats-section { background: #f8f9fa; padding: 4rem 0; }
.testimonial-slider { padding: 3rem 0; }
```

## Testing Checklist

- [ ] Homepage loads with all sections
- [ ] Course grid displays from Strapi
- [ ] Filtering works on courses page
- [ ] Teacher profiles load correctly
- [ ] Navigation matches TeachMeSkills structure
- [ ] Mobile responsive design works
- [ ] Forms connect to Strapi
- [ ] Career center page displays
- [ ] Blog posts load (if implemented)

## Next Steps

1. Start with updating `index.html` to match the section order
2. Create `teachers.html` using the Webflow template style
3. Update `courses.html` with filtering functionality
4. Test Strapi API connections for new content types
5. Implement the career center page

This implementation will give you the same hierarchical structure and user flow as TeachMeSkills.by while maintaining your own branding and content.