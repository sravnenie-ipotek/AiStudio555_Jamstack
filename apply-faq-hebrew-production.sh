#!/bin/bash

# Script to apply Hebrew FAQ updates to Railway Production Database
# WARNING: This will update the production database!

echo "🚀 Hebrew FAQ Content Update for PRODUCTION Database"
echo "===================================================="
echo "⚠️  WARNING: This will update the PRODUCTION database on Railway!"
echo ""

# Production database configuration (from localDB.md)
PROD_DB_URL="postgresql://postgres:KwMSyqCsZozDwIGEBrHOeVXnLAfTRjbk@autorack.proxy.rlwy.net:29884/railway"

# Prompt for confirmation
read -p "Are you sure you want to update the PRODUCTION database? (type 'yes' to confirm): " confirmation

if [ "$confirmation" != "yes" ]; then
    echo "❌ Update cancelled."
    exit 0
fi

echo ""
echo "📝 Applying Hebrew FAQ content updates to production..."

# Apply the SQL update to production
psql "$PROD_DB_URL" -f update-faq-hebrew-content.sql

if [ $? -eq 0 ]; then
    echo "✅ Hebrew FAQ content successfully updated in PRODUCTION database!"

    # Show updated content
    echo ""
    echo "📊 Verifying updated content in production..."
    psql "$PROD_DB_URL" -c "
    SELECT
        'FAQ Title' as field, faq_title as value
    FROM home_pages
    WHERE locale = 'he'
    LIMIT 1;
    "

    echo ""
    echo "🎉 Production database update complete!"
    echo "📌 Live site: https://aistudio555jamstack-production.up.railway.app"
    echo "📌 API endpoint: https://aistudio555jamstack-production.up.railway.app/api/home-page?locale=he"
    echo ""
    echo "⚠️  Please verify the changes on the live site!"
else
    echo "❌ Failed to update Hebrew FAQ content in production"
    exit 1
fi