#!/bin/bash

# Local Database Import Script
# This script imports production dump to local Docker PostgreSQL

echo "🚀 Starting local database import..."

# Local database configuration (matching docker-compose.yml)
LOCAL_DB_HOST="localhost"
LOCAL_DB_PORT="5433"
LOCAL_DB_NAME="aistudio_db"
LOCAL_DB_USER="aistudio_user"
LOCAL_DB_PASSWORD="aistudio_dev_password_2024"

# Check if backup file exists
if [ -z "$1" ]; then
    BACKUP_FILE="backups/latest_production_dump.sql"
    echo "📂 No backup file specified, using latest: $BACKUP_FILE"
else
    BACKUP_FILE="$1"
fi

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Backup file not found: $BACKUP_FILE"
    echo "💡 Run ./scripts/dump-production-db.sh first to create a backup"
    exit 1
fi

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
until PGPASSWORD=$LOCAL_DB_PASSWORD psql -h $LOCAL_DB_HOST -p $LOCAL_DB_PORT -U $LOCAL_DB_USER -d postgres -c '\q' 2>/dev/null; do
    echo "   PostgreSQL is unavailable - sleeping"
    sleep 2
done

echo "✅ PostgreSQL is ready!"

# Drop existing database and recreate
echo "🗑️  Dropping existing database..."
PGPASSWORD=$LOCAL_DB_PASSWORD psql -h $LOCAL_DB_HOST -p $LOCAL_DB_PORT -U $LOCAL_DB_USER -d postgres <<EOF
DROP DATABASE IF EXISTS $LOCAL_DB_NAME;
CREATE DATABASE $LOCAL_DB_NAME;
EOF

# Import the backup
echo "📥 Importing backup to local database..."
PGPASSWORD=$LOCAL_DB_PASSWORD psql -h $LOCAL_DB_HOST -p $LOCAL_DB_PORT -U $LOCAL_DB_USER -d $LOCAL_DB_NAME < "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Database imported successfully!"

    # Show table count
    TABLE_COUNT=$(PGPASSWORD=$LOCAL_DB_PASSWORD psql -h $LOCAL_DB_HOST -p $LOCAL_DB_PORT -U $LOCAL_DB_USER -d $LOCAL_DB_NAME -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")
    echo "📊 Tables imported: $TABLE_COUNT"

    # Show sample data counts
    echo "📈 Sample data counts:"
    PGPASSWORD=$LOCAL_DB_PASSWORD psql -h $LOCAL_DB_HOST -p $LOCAL_DB_PORT -U $LOCAL_DB_USER -d $LOCAL_DB_NAME <<EOF
SELECT 'courses' as table_name, COUNT(*) as count FROM courses
UNION ALL
SELECT 'teachers', COUNT(*) FROM teachers
UNION ALL
SELECT 'blog_posts', COUNT(*) FROM blog_posts
UNION ALL
SELECT 'home_pages', COUNT(*) FROM home_pages;
EOF
else
    echo "❌ Failed to import database"
    exit 1
fi

echo "✨ Local database import completed!"
echo "🔗 Connection string: postgresql://$LOCAL_DB_USER:$LOCAL_DB_PASSWORD@$LOCAL_DB_HOST:$LOCAL_DB_PORT/$LOCAL_DB_NAME"