#!/bin/bash

# Script to apply Hebrew FAQ updates to local PostgreSQL database
# Uses local database configuration from localDB.md

echo "🔵 Starting Hebrew FAQ Content Update for Local Database"
echo "=================================================="

# Local database configuration
DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="aistudio_db"
DB_USER="postgres"
DB_PASS="postgres"

# Check if PostgreSQL is running
echo "🔍 Checking PostgreSQL status..."
if ! pg_isready -h $DB_HOST -p $DB_PORT > /dev/null 2>&1; then
    echo "❌ PostgreSQL is not running. Starting it now..."
    brew services start postgresql@16
    sleep 3
fi

# Verify database exists
echo "🔍 Verifying database exists..."
if ! psql -U $DB_USER -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
    echo "❌ Database $DB_NAME does not exist"
    echo "📝 Please run ./use-existing-postgres.sh first to set up the local database"
    exit 1
fi

# Apply the SQL update
echo "📝 Applying Hebrew FAQ content updates..."
PGPASSWORD=$DB_PASS psql -U $DB_USER -h $DB_HOST -p $DB_PORT -d $DB_NAME -f update-faq-hebrew-content.sql

if [ $? -eq 0 ]; then
    echo "✅ Hebrew FAQ content successfully updated in local database!"

    # Show updated content
    echo ""
    echo "📊 Verifying updated content..."
    PGPASSWORD=$DB_PASS psql -U $DB_USER -h $DB_HOST -p $DB_PORT -d $DB_NAME -c "
    SELECT
        'FAQ Title' as field, faq_title as value
    FROM home_pages
    WHERE locale = 'he'
    UNION ALL
    SELECT 'FAQ 1', faq_1_title FROM home_pages WHERE locale = 'he'
    UNION ALL
    SELECT 'FAQ 2', faq_2_title FROM home_pages WHERE locale = 'he'
    UNION ALL
    SELECT 'FAQ 3', faq_3_title FROM home_pages WHERE locale = 'he'
    UNION ALL
    SELECT 'FAQ 4', faq_4_title FROM home_pages WHERE locale = 'he'
    UNION ALL
    SELECT 'FAQ 5', faq_5_title FROM home_pages WHERE locale = 'he'
    UNION ALL
    SELECT 'FAQ 6', faq_6_title FROM home_pages WHERE locale = 'he';
    "

    echo ""
    echo "🎉 Local database update complete!"
    echo "📌 Access the site at: http://localhost:3005/he/index.html"
    echo "📌 Or via API: http://localhost:3000/api/home-page?locale=he"
else
    echo "❌ Failed to update Hebrew FAQ content"
    exit 1
fi