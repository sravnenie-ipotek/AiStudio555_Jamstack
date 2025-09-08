# 🚨 EMERGENCY FIX: Strapi Content Types Not Loading

## Problem
- ALL content types are returning 404 (including original home-page)
- API routes are not being registered
- Data exists in database but APIs don't work

## Root Cause
Content type definitions were added while Strapi was running, causing corruption in the content type registry.

## 🔧 COMPLETE FIX

### Step 1: Stop Everything
```bash
# Kill all Strapi processes
lsof -ti:1337 | xargs kill -9
```

### Step 2: Clean Reset
```bash
# Remove all cache and build artifacts
rm -rf .cache .strapi dist node_modules/.cache
rm -rf .tmp/data.db  # This will reset database but we have backups
```

### Step 3: Fresh Database
```bash
# Start fresh - Strapi will recreate the database
npm run develop
```

### Step 4: After Strapi Loads
1. Go to http://localhost:1337/admin
2. Create admin account if needed
3. Go to Content-Type Builder
4. You'll see all the content types we created
5. Click "Save" on each one to activate them
6. Set permissions: Settings > Roles > Public > Enable all APIs

### Step 5: Re-populate Data
```bash
# Run our population script again
sqlite3 .tmp/data.db < scripts/populate-courses.sql
```

## 📋 What Went Wrong
1. Added content types while Strapi was running
2. Strapi couldn't register new routes properly
3. Some schema definitions may have conflicts
4. Content type registry got corrupted

## 🎯 The Right Way
1. Always stop Strapi before adding content types
2. Add content types through admin UI OR files (not both)
3. Restart after any schema changes
4. Test APIs before adding content

## ⚡ Quick Command Sequence
```bash
lsof -ti:1337 | xargs kill -9
rm -rf .cache .strapi dist
npm run develop
# Wait for startup, then visit admin panel
```

This will give you a fresh, working Strapi instance!