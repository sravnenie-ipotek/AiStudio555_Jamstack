#!/bin/bash

# Production Database Dump Script
# This script connects to Railway production database and dumps all data

echo "🔄 Starting production database dump..."

# Railway production database connection string
# You'll need to get this from Railway dashboard
PRODUCTION_DB_URL="postgresql://postgres:YOUR_PASSWORD@YOUR_HOST.railway.app:PORT/railway"

# Create backups directory if it doesn't exist
mkdir -p backups

# Generate timestamp for backup file
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="backups/production_dump_${TIMESTAMP}.sql"

# Dump production database
echo "📦 Dumping production database..."
pg_dump "$PRODUCTION_DB_URL" \
    --verbose \
    --no-owner \
    --no-privileges \
    --schema=public \
    --file="$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Database dumped successfully to: $BACKUP_FILE"

    # Create a symlink to latest backup
    ln -sf "production_dump_${TIMESTAMP}.sql" "backups/latest_production_dump.sql"
    echo "📌 Latest backup symlink created: backups/latest_production_dump.sql"

    # Show file size
    SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo "📊 Backup size: $SIZE"
else
    echo "❌ Failed to dump production database"
    exit 1
fi

echo "✨ Production dump completed!"