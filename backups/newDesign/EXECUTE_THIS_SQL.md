# 🚨 URGENT: Create nd_courses_page Table on Railway

## The Problem
The courses.html page is not fully translating because the `nd_courses_page` table doesn't exist in the Railway database.

## The Solution
Execute the SQL script `production-create-nd-courses-page.sql` on the Railway PostgreSQL database.

## Option 1: Using Railway Dashboard (Easiest)
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Select your project
3. Click on the PostgreSQL plugin
4. Click "Connect" → "Query"
5. Copy and paste the contents of `production-create-nd-courses-page.sql`
6. Click "Run Query"

## Option 2: Using Railway CLI
```bash
# Install Railway CLI if not installed
npm install -g @railway/cli

# Login to Railway
railway login

# Link to your project
railway link

# Execute the SQL
railway run psql < production-create-nd-courses-page.sql
```

## Option 3: Using Direct Connection
```bash
# Get your DATABASE_URL from Railway
railway variables

# Run psql with the DATABASE_URL
psql "YOUR_DATABASE_URL_HERE" < production-create-nd-courses-page.sql
```

## Testing After Creation

### 1. Test the API endpoint:
```bash
curl "http://localhost:1337/api/nd/courses-page?locale=ru"
```

### 2. Test in browser:
- Open http://localhost:3005/backups/newDesign/courses.html
- Switch to Russian using language selector
- All UI elements should now be translated

### 3. Check specific translations:
```bash
# Test Russian button translations
curl -s "http://localhost:1337/api/nd/courses-page?locale=ru" | grep "Детали Курса"

# Test Hebrew translations
curl -s "http://localhost:1337/api/nd/courses-page?locale=he" | grep "פרטי הקורס"
```

## What This Fixes
✅ "Course Details" buttons will translate to "Детали Курса" in Russian
✅ "Sign Up Today" buttons will translate to "Записаться Сегодня"
✅ Navigation menu will translate properly
✅ All 62 data-i18n elements on courses.html will work
✅ Language switching from home.html will carry over to courses.html

## Files Changed
- ✅ `/server.js` - Added `/api/nd/courses-page` endpoint (lines 8196-8316)
- ✅ `/js/language-manager.js` - Updated to use new endpoint (line 255)
- ✅ `/docs/db.md` - Documented new table architecture
- ⏳ **Railway Database** - Needs `nd_courses_page` table created

## Architecture
The system now properly separates:
- **nd_courses_page**: UI translations (buttons, labels, navigation)
- **nd_courses**: Actual course data (React Course, Python Course, etc.)

This follows the same pattern as other pages (nd_pricing_page, nd_about_page, etc.)