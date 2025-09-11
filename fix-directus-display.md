# Directus Display Issue - Solution Guide

## The Problem
Directus shows all three language versions as "ДОМ" without any way to distinguish between English, Russian, and Hebrew versions.

## Why This Happens
1. Directus is using the `title` field which contains "ДОМ" for all entries
2. Directus doesn't know about our `locale` or `display_name` fields
3. The Directus admin interface needs configuration to show additional identifying fields

## Solutions

### Solution 1: Use Our Custom Admin Interface (RECOMMENDED)
**URL:** https://aistudio555jamstack-production.up.railway.app/admin-language-manager.html

This custom interface:
- Shows clear language flags (🇬🇧 🇷🇺 🇮🇱)
- Has language labels (EN, RU, HE)
- Provides better UX for multi-language content

### Solution 2: Configure Directus Display
To fix the Directus display, you need to:

1. **Access Directus Settings**
   - Go to Settings → Data Model → home_pages
   - Configure the collection display template

2. **Change Display Template**
   - Set display template to show multiple fields
   - Example: `{{id}} - {{locale}} - {{title}}`
   - This would show: "1 - en - Home Page"

3. **Add Locale Column to List View**
   - In collection settings, add `locale` to visible columns
   - This adds a column showing en/ru/he

### Solution 3: Update Database Titles
We can update the actual title field to include language indicators:

```sql
UPDATE home_pages SET title = '🇬🇧 EN - ' || title WHERE id = 1;
UPDATE home_pages SET title = '🇷🇺 RU - ' || title WHERE id = 2;
UPDATE home_pages SET title = '🇮🇱 HE - ' || title WHERE id = 3;
```

### Solution 4: Use Our Comprehensive Admin
**URL:** https://aistudio555jamstack-production.up.railway.app/content-admin-comprehensive.html

This admin interface:
- Has separate tabs for each language
- Shows field counts per section
- Provides comprehensive editing

## Current Workaround
Since Directus configuration requires admin access to the Directus system itself (not just the database), and we're using Directus as a headless CMS, the best approach is:

1. **For Quick Identification**: Remember the order
   - First ДОМ = English (ID: 1)
   - Second ДОМ = Russian (ID: 2)
   - Third ДОМ = Hebrew (ID: 3)

2. **For Better UX**: Use our custom admin interfaces instead of Directus

## The Real Solution
The Directus interface at `attractive-determination-production.up.railway.app` needs to be configured from within Directus's admin settings, which requires:
- Directus super admin access
- Access to the Directus configuration panel
- Modification of the collection display settings

Since this is a hosted Directus instance, you would need to:
1. Log in as a Directus administrator
2. Go to Settings (gear icon)
3. Navigate to Data Model
4. Edit the home_pages collection
5. Change the display template or add visible columns