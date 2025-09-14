#!/bin/bash

# Deploy Hebrew FAQ Content to Railway Production Database
# This script applies the FAQ migration to the production environment

echo "🚀 Hebrew FAQ Content Deployment to Railway Production"
echo "======================================================"
echo ""

# Production database URL from localDB.md
PROD_DB_URL="postgresql://postgres:KwMSyqCsZozDwIGEBrHOeVXnLAfTRjbk@autorack.proxy.rlwy.net:29884/railway"

echo "⚠️  PRODUCTION DEPLOYMENT"
echo "This will update the live production database on Railway!"
echo ""

# Safety check
read -p "Type 'DEPLOY' to confirm production deployment: " confirmation

if [ "$confirmation" != "DEPLOY" ]; then
    echo "❌ Deployment cancelled."
    exit 0
fi

echo ""
echo "📝 Applying Hebrew FAQ migration to production..."

# Apply the comprehensive migration script
psql "$PROD_DB_URL" -f migrate-and-update-faq-hebrew.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Hebrew FAQ content successfully deployed to production!"
    echo ""

    # Verify deployment
    echo "📊 Verifying production deployment..."
    psql "$PROD_DB_URL" -c "
    SELECT
        locale,
        LEFT(faq_title, 20) as faq_title,
        LEFT(faq_1_title, 30) as faq_1_title,
        LEFT(faq_1_answer, 50) as faq_1_answer_preview
    FROM home_pages
    WHERE locale IN ('he', 'en')
    ORDER BY locale;
    "

    echo ""
    echo "🎉 Production deployment complete!"
    echo ""
    echo "📌 Live URLs to verify:"
    echo "   - Website: https://www.aistudio555.com/he/index.html"
    echo "   - API: https://aistudio555jamstack-production.up.railway.app/api/home-page?locale=he"
    echo ""
    echo "✅ Please verify the FAQ section on the live Hebrew site!"
else
    echo "❌ Failed to deploy to production"
    exit 1
fi