#!/bin/bash

# Sync updated language directories to dist for production
echo "🔄 Syncing language directories to dist..."

# Copy English files
echo "📂 Copying en/ to dist/en/"
rsync -av --exclude='*.backup' --exclude='*.bak' en/ dist/en/

# Copy Russian files
echo "📂 Copying ru/ to dist/ru/"
rsync -av --exclude='*.backup' --exclude='*.bak' ru/ dist/ru/

# Copy Hebrew files
echo "📂 Copying he/ to dist/he/"
rsync -av --exclude='*.backup' --exclude='*.bak' he/ dist/he/

# Ensure shared assets are in dist
echo "📂 Ensuring shared assets..."
[ ! -d "dist/js" ] && mkdir -p dist/js
[ ! -d "dist/css" ] && mkdir -p dist/css
[ ! -d "dist/images" ] && mkdir -p dist/images

# Copy shared JS files
cp -f js/shared-menu-component.js dist/js/ 2>/dev/null
cp -f js/language-preference-detector.js dist/js/ 2>/dev/null
cp -f js/webflow-strapi-integration.js dist/js/ 2>/dev/null
cp -f js/ui-translator.js dist/js/ 2>/dev/null

# Copy CSS files
rsync -av css/ dist/css/

# Copy images if not already there
rsync -av images/ dist/images/

echo "✅ Sync complete! Production dist/ now has updated navigation."