# AI Studio Admin Access Documentation
**CONFIDENTIAL - DO NOT COMMIT TO GIT**

Last Updated: September 11, 2025
Created for: AI Assistant Access to Admin Systems

## Overview
This document contains sensitive credentials and API tokens for accessing and modifying data in the AI Studio platform. The system uses a dual-admin architecture with both a custom HTML admin and Directus CMS.

## System Architecture

### Two Admin Systems (Same Database)
1. **Custom HTML Admin**: `/content-admin-comprehensive.html`
2. **Directus CMS Admin**: `https://attractive-determination-production.up.railway.app/admin`

Both systems read/write to the same PostgreSQL database hosted on Railway.

## Directus API Access

### API Token (DO NOT SHARE)
```
Token: s-0INy5QF9c2AbomLUxy_S-ZxJ70DYVE
User: api user
Role: apiBot (with Administrator parent role)
```

### API Endpoints
- **Base URL**: `https://attractive-determination-production.up.railway.app`
- **REST API**: `https://attractive-determination-production.up.railway.app/items/{collection}`
- **GraphQL**: `https://attractive-determination-production.up.railway.app/graphql`
- **Admin Panel**: `https://attractive-determination-production.up.railway.app/admin`

### Admin Login Credentials
- **Email**: qabankimonline@gmail.com
- **Password**: AizekMikhaelSuccess2025

## How to Modify Data

### 1. Reading Data (GET)
```javascript
// Get all courses
const response = await fetch('https://attractive-determination-production.up.railway.app/items/courses', {
    headers: {
        'Authorization': 'Bearer s-0INy5QF9c2AbomLUxy_S-ZxJ70DYVE'
    }
});
const data = await response.json();
console.log(data.data); // Array of courses
```

### 2. Creating New Items (POST)
```javascript
// Create a new course
const response = await fetch('https://attractive-determination-production.up.railway.app/items/courses', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer s-0INy5QF9c2AbomLUxy_S-ZxJ70DYVE',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        title: 'New AI Course',
        description: 'Learn advanced AI techniques',
        price: 299.99,
        duration: '8 weeks',
        lessons: '24',
        category: 'Technology',
        rating: '5.0',
        visible: true
    })
});
const newCourse = await response.json();
console.log('Created course with ID:', newCourse.data.id);
```

### 3. Updating Existing Items (PATCH)
```javascript
// Update course with ID 1
const response = await fetch('https://attractive-determination-production.up.railway.app/items/courses/1', {
    method: 'PATCH',
    headers: {
        'Authorization': 'Bearer s-0INy5QF9c2AbomLUxy_S-ZxJ70DYVE',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        title: 'Updated Course Title',
        price: 399.99
    })
});
const updatedCourse = await response.json();
```

### 4. Deleting Items (DELETE)
```javascript
// Delete course with ID 1
const response = await fetch('https://attractive-determination-production.up.railway.app/items/courses/1', {
    method: 'DELETE',
    headers: {
        'Authorization': 'Bearer s-0INy5QF9c2AbomLUxy_S-ZxJ70DYVE'
    }
});
```

## Available Collections (Tables)

All collections support CRUD operations with the API token:

1. **home_pages** - Landing page content (123 fields!)
2. **courses** - Course catalog
3. **teachers** - Instructor profiles
4. **blog_posts** - Blog articles
5. **about_pages** - About page content
6. **career_center_pages** - Career center content
7. **career_orientation_pages** - Career orientation content
8. **contact_pages** - Contact information
9. **faqs** - Frequently asked questions
10. **pricing_plans** - Pricing tiers
11. **job_postings** - Job listings
12. **career_resources** - Downloadable resources

## Multi-Language Support

### Filtering by Language
```javascript
// Get Russian content
const response = await fetch('https://attractive-determination-production.up.railway.app/items/about_pages?filter[locale][_eq]=ru', {
    headers: {
        'Authorization': 'Bearer s-0INy5QF9c2AbomLUxy_S-ZxJ70DYVE'
    }
});

// Supported locales: en, ru, he
```

## GraphQL Queries

```javascript
// GraphQL query example
const query = `
    query {
        courses {
            id
            title
            description
            price
            duration
        }
        home_pages {
            hero_title
            hero_subtitle
            hero_description
        }
    }
`;

const response = await fetch('https://attractive-determination-production.up.railway.app/graphql', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer s-0INy5QF9c2AbomLUxy_S-ZxJ70DYVE',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query })
});
```

## Testing API Access

A test file is available at `/test-api-token.js` that verifies:
- Read access to all collections
- Create/Update/Delete permissions
- User authentication status

Run with: `node test-api-token.js`

## Express API (Alternative)

The original Express API is still running and accessible:
- **Base URL**: `https://aistudio555jamstack-production.up.railway.app/api`
- **No authentication required** (public read access)

Example endpoints:
- `/api/courses` - Get all courses
- `/api/home-page` - Get home page content
- `/api/teachers` - Get teachers

## Important Security Notes

1. **NEVER commit this file to Git** - It's in .gitignore
2. **Token has full admin access** - Can read, create, update, and delete all data
3. **Both admin systems modify the same database** - Changes in one appear in the other
4. **API token doesn't expire** - Static token for programmatic access

## Quick Reference for Common Tasks

### Update Home Page Hero Text
```javascript
// Get current home page
const getResponse = await fetch('https://attractive-determination-production.up.railway.app/items/home_pages?limit=1', {
    headers: { 'Authorization': 'Bearer s-0INy5QF9c2AbomLUxy_S-ZxJ70DYVE' }
});
const data = await getResponse.json();
const homePageId = data.data[0].id;

// Update hero text
await fetch(`https://attractive-determination-production.up.railway.app/items/home_pages/${homePageId}`, {
    method: 'PATCH',
    headers: {
        'Authorization': 'Bearer s-0INy5QF9c2AbomLUxy_S-ZxJ70DYVE',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        hero_title: 'New Hero Title',
        hero_subtitle: 'New Subtitle',
        hero_description: 'New Description'
    })
});
```

### Add New Teacher
```javascript
await fetch('https://attractive-determination-production.up.railway.app/items/teachers', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer s-0INy5QF9c2AbomLUxy_S-ZxJ70DYVE',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        name: 'Dr. Jane Smith',
        role: 'Senior AI Instructor',
        bio: 'Expert in machine learning with 10+ years experience',
        linkedin: 'https://linkedin.com/in/janesmith',
        order: 1
    })
});
```

### Update Course Price
```javascript
await fetch('https://attractive-determination-production.up.railway.app/items/courses/5', {
    method: 'PATCH',
    headers: {
        'Authorization': 'Bearer s-0INy5QF9c2AbomLUxy_S-ZxJ70DYVE',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        price: 199.99,
        visible: true
    })
});
```

## Troubleshooting

### If API returns "Unauthorized"
- Token may have been revoked - check Directus admin panel
- Ensure Bearer prefix in Authorization header

### If changes don't appear
- Check both admin panels - data should sync
- Clear browser cache
- Verify the item ID exists

### If can't connect
- Check Railway service status
- Verify Directus container is running
- Test with direct URL in browser

## Contact & Support

- **Railway Dashboard**: Check service status
- **Directus Logs**: Available in Railway dashboard
- **Database**: PostgreSQL on Railway
- **Frontend**: Static files served from `/dist/`

---

**REMEMBER: This file contains sensitive credentials. Keep it secure and never share publicly.**
