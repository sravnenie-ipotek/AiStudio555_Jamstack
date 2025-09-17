# =4 Strapi v5 Critical API Bug Documentation

## Executive Summary
Strapi v5 has a **CRITICAL BUG** where all API endpoints return 404 errors despite correct configuration, proper content types, and appropriate permissions. This forced us to build a complete custom API layer bypassing Strapi's broken endpoints.

## Bug Details

### Environment
- **Strapi Version**: v5.23.2
- **Database**: SQLite (development) / PostgreSQL (production)
- **Node Version**: v18+
- **Operating System**: macOS (confirmed), likely affects all OS

### Problem Description
All Strapi API endpoints (`/api/*`) return 404 "Not Found" errors even when:
-  Content types are properly created and published
-  Permissions are correctly configured (Public access enabled)
-  Data exists in the database
-  Admin panel shows all content correctly
-  Database contains valid records with `published_at` timestamps

### Expected Behavior
```
GET http://localhost:1337/api/courses
’ Should return: JSON array of courses
```

### Actual Behavior
```
GET http://localhost:1337/api/courses
’ Returns: 404 Not Found
```

## Root Cause Analysis

### Investigation Results
1. **Database is fine**: Direct SQLite queries show all data exists
2. **Admin panel works**: Strapi admin at `/admin` functions correctly
3. **Content types valid**: All schemas properly configured
4. **Permissions correct**: Public access enabled for all operations
5. **Routes missing**: API routes are not being registered by Strapi

### Suspected Issues
- Route registration failure in Strapi v5 core
- Middleware conflict preventing API routes
- Content-type builder not generating routes
- Possible bug in `@strapi/plugin-content-manager`

## Impact

### Development Impact
- **Cannot use Strapi's REST API** at all
- **Cannot use GraphQL plugin** (depends on REST)
- **Cannot use documentation plugin** (no endpoints to document)
- **Forced to build custom API layer** (1000+ lines of code)

### Architecture Impact
Had to create parallel API infrastructure:
1. `strapi-live-api-all-content.js` - Read operations (500+ lines)
2. `strapi-live-api-crud.js` - CRUD operations (1000+ lines)
3. Direct database queries bypassing Strapi ORM
4. Custom response formatting to match Strapi structure

## Workaround Solution

### Custom Live API Architecture
```javascript
// Instead of Strapi's broken endpoints:
GET http://localhost:1337/api/courses L

// We built custom APIs:
GET http://localhost:3334/api/courses 
```

### Implementation Details
- Direct SQLite/PostgreSQL queries
- Custom CORS handling
- Manual JWT implementation
- Response formatting to match Strapi's expected structure
- Complete CRUD operations for 10+ content types

## Attempts to Fix

### What We Tried
1.  Reinstalled Strapi multiple times
2.  Created fresh projects from scratch
3.  Manually set all permissions
4.  Checked route configuration
5.  Reviewed middleware stack
6.  Updated all dependencies
7.  Tried different Node versions
8.  Tested on different machines

### What Didn't Work
- Strapi's official troubleshooting guide
- Community solutions from forums
- Rebuilding admin panel
- Clearing cache and .tmp folders
- Fresh database migrations

## Business Impact

### Time Lost
- **2+ weeks** debugging Strapi APIs
- **1 week** building custom API layer
- **Ongoing maintenance** of parallel system

### Technical Debt
- Maintaining custom API layer
- Cannot use Strapi ecosystem plugins
- Complex deployment architecture
- Additional testing requirements

## Recommendations

### Short Term
1. **Use custom Live API** for production
2. **Deploy to Railway** (simpler than Strapi Cloud)
3. **Document all custom endpoints**
4. **Add authentication layer**

### Long Term
1. **Monitor Strapi v5 updates** for fixes
2. **Consider migrating to Strapi v6** when stable
3. **Evaluate alternatives** (Directus, Payload CMS)
4. **Plan migration strategy** back to official APIs when fixed

## Code Evidence

### Working Database Query
```sql
SELECT * FROM courses WHERE published_at IS NOT NULL;
-- Returns: 6 valid course records
```

### Broken Strapi API
```javascript
fetch('http://localhost:1337/api/courses')
// Returns: 404 Not Found
```

### Our Working Solution
```javascript
fetch('http://localhost:3334/api/courses')
// Returns: Proper JSON with all courses
```

## Conclusion

This is a **CRITICAL BLOCKING BUG** in Strapi v5 that makes the CMS unusable for its primary purpose - serving content via APIs. We've built a complete workaround, but this adds significant complexity and maintenance burden.

**Bottom Line**: Strapi v5's API layer is fundamentally broken in our environment, forcing us to essentially rebuild what Strapi should provide out of the box.

---

**Last Updated**: September 2025
**Severity**: CRITICAL
**Status**: UNRESOLVED (Workaround in place)
**Affected Versions**: v5.23.2 (possibly all v5.x)