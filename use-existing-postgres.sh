#!/bin/bash

# Use YOUR EXISTING PostgreSQL (already running on port 5432)
# No Docker needed!

echo "🐘 USING YOUR EXISTING POSTGRESQL"
echo "=================================="
echo ""

# Production Railway database URL
PROD_DB_URL="postgresql://postgres:KwMSyqCsZozDwIGEBrHOeVXnLAfTRjbk@autorack.proxy.rlwy.net:29884/railway"

# Your existing local PostgreSQL (port 5432)
LOCAL_DB_URL="postgresql://postgres:postgres@localhost:5432/aistudio_db"

echo "📋 This will:"
echo "   1. Create aistudio_db in your existing PostgreSQL"
echo "   2. Copy all production data to it"
echo "   3. Configure app to use it"
echo ""
echo "Press Enter to continue..."
read

# Step 1: Create database in your existing PostgreSQL
echo "📦 Creating database in your existing PostgreSQL..."
psql -U postgres -c "DROP DATABASE IF EXISTS aistudio_db;"
psql -U postgres -c "CREATE DATABASE aistudio_db;"

# Step 2: Copy production data
echo "📥 Copying production data..."
mkdir -p backups
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="backups/prod_${TIMESTAMP}.sql"

# Dump from Railway
pg_dump "$PROD_DB_URL" \
    --no-owner \
    --no-privileges \
    --no-acl \
    --file="$BACKUP_FILE"

# Import to your local PostgreSQL
psql -U postgres -d aistudio_db < "$BACKUP_FILE"

# Step 3: Create .env file
cat > .env << EOF
# Using YOUR existing PostgreSQL (not Docker)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/aistudio_db
NODE_ENV=development
PORT=3000
EOF

echo ""
echo "✅ DONE! Your existing PostgreSQL now has production data!"
echo ""
echo "🔗 Connection: postgresql://postgres:postgres@localhost:5432/aistudio_db"
echo ""
echo "🚀 Now just run:"
echo "   npm start"
echo ""
echo "📊 Admin Panel: http://localhost:3000/admin"