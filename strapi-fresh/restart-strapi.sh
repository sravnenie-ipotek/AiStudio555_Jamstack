#!/bin/bash

echo "🔄 Complete Strapi Restart Script"
echo "================================="
echo ""
echo "This will:"
echo "1. Kill any running Strapi processes"
echo "2. Clear cache"
echo "3. Rebuild"
echo "4. Start fresh"
echo ""

# Kill any running node processes on port 1337
echo "🛑 Stopping Strapi..."
lsof -ti:1337 | xargs kill -9 2>/dev/null || true
sleep 2

# Clear all caches
echo "🧹 Clearing cache..."
rm -rf .cache .strapi dist/src/api 2>/dev/null || true

# Rebuild
echo "🔨 Building Strapi..."
npm run build

# Start in development mode
echo "🚀 Starting Strapi..."
echo ""
echo "✅ Strapi will start now. After it's fully loaded:"
echo "1. Visit http://localhost:1337/admin"
echo "2. The content types should appear in the sidebar"
echo "3. You should see the courses you added"
echo ""

npm run develop