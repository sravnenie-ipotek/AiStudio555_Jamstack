#!/bin/bash

# Complete Production to Local Sync Script
# This creates an EXACT copy of production database locally

echo "🔄 PRODUCTION TO LOCAL SYNC"
echo "============================"
echo ""

# Production Railway database URL from .env.local
PROD_DB_URL="postgresql://postgres:KwMSyqCsZozDwIGEBrHOeVXnLAfTRjbk@autorack.proxy.rlwy.net:29884/railway"

# Local PostgreSQL settings (Docker)
LOCAL_DB_URL="postgresql://aistudio_user:aistudio_dev_password_2024@localhost:5433/aistudio_db"

echo "📋 This script will:"
echo "   1. Start local PostgreSQL in Docker"
echo "   2. Copy ALL data from Railway production"
echo "   3. Configure your app to use local PostgreSQL"
echo ""
echo "Press Enter to continue..."
read

# Step 1: Start Docker PostgreSQL
echo ""
echo "🐳 Step 1: Starting Docker PostgreSQL..."
docker-compose down 2>/dev/null
docker-compose up -d postgres

# Wait for PostgreSQL
echo "⏳ Waiting for PostgreSQL to start..."
sleep 5
until docker exec aistudio-postgres pg_isready -U aistudio_user 2>/dev/null; do
    sleep 2
done
echo "✅ PostgreSQL is running!"

# Step 2: Direct copy from production to local
echo ""
echo "📥 Step 2: Copying production database to local..."
echo "   Source: Railway Production"
echo "   Target: Local PostgreSQL"

# Create backup directory
mkdir -p backups

# Dump from production
echo "📦 Dumping production data..."
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="backups/prod_backup_${TIMESTAMP}.sql"

pg_dump "$PROD_DB_URL" \
    --no-owner \
    --no-privileges \
    --no-acl \
    --if-exists \
    --clean \
    --create \
    --file="$BACKUP_FILE"

if [ $? -ne 0 ]; then
    echo "❌ Failed to dump production database"
    echo "   Make sure pg_dump is installed: brew install postgresql"
    exit 1
fi

echo "✅ Production data dumped!"

# Step 3: Import to local
echo ""
echo "📤 Step 3: Importing to local PostgreSQL..."

# Drop and recreate database
docker exec aistudio-postgres psql -U aistudio_user -d postgres -c "DROP DATABASE IF EXISTS aistudio_db;"
docker exec aistudio-postgres psql -U aistudio_user -d postgres -c "CREATE DATABASE aistudio_db;"

# Import the backup
docker exec -i aistudio-postgres psql -U aistudio_user -d aistudio_db < "$BACKUP_FILE"

echo "✅ Data imported to local PostgreSQL!"

# Step 4: Verify the import
echo ""
echo "📊 Step 4: Verifying data..."
docker exec aistudio-postgres psql -U aistudio_user -d aistudio_db -c "
SELECT
    'courses' as table, COUNT(*) as records FROM courses
UNION ALL SELECT 'teachers', COUNT(*) FROM teachers
UNION ALL SELECT 'blog_posts', COUNT(*) FROM blog_posts
UNION ALL SELECT 'home_pages', COUNT(*) FROM home_pages
UNION ALL SELECT 'footer_content', COUNT(*) FROM footer_content;
"

# Step 5: Create/update .env file
echo ""
echo "⚙️  Step 5: Configuring environment..."
cat > .env << EOF
# Local PostgreSQL (exact copy of production)
DATABASE_URL=postgresql://aistudio_user:aistudio_dev_password_2024@localhost:5433/aistudio_db
NODE_ENV=development
PORT=3000
EOF

echo "✅ Environment configured!"

# Final message
echo ""
echo "========================================="
echo "✨ SYNC COMPLETE! Your local environment"
echo "   is now an EXACT copy of production!"
echo "========================================="
echo ""
echo "📊 Local PostgreSQL is running with production data"
echo "🔗 Connection: $LOCAL_DB_URL"
echo ""
echo "🚀 To start your app:"
echo "   npm start"
echo ""
echo "🔧 To access:"
echo "   Admin Panel: http://localhost:3000/admin"
echo "   PgAdmin:     http://localhost:5050"
echo ""
echo "💡 Your app will now use LOCAL PostgreSQL instead of SQLite!"