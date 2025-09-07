#!/bin/bash

# Strapi Cloud Setup Script
# Run this from the root project directory to deploy Strapi to cloud

echo "🚀 Setting up Strapi Cloud deployment..."

# Navigate to strapi directory
cd strapi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found in strapi/ directory"
    exit 1
fi

# Check if Strapi CLI is installed globally
if ! command -v strapi &> /dev/null; then
    echo "📦 Installing Strapi CLI globally..."
    npm install -g @strapi/strapi@latest
fi

echo "✅ Strapi CLI installed"

# Deploy to Strapi Cloud
echo "🌐 Deploying to Strapi Cloud..."
echo "   Follow the prompts to:"
echo "   1. Choose project name (e.g., 'ai-studio-cms')"
echo "   2. Select region closest to your users"  
echo "   3. Choose plan (start with Free)"

npx @strapi/strapi deploy

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Visit your admin panel to create API token"
echo "   2. Add content types (Course, Lead)"
echo "   3. Configure i18n for EN/RU/HE languages"
echo "   4. Update your .env files with production URLs"
echo ""
echo "🔗 Your URLs will be:"
echo "   Admin: https://your-project.strapiapp.com/admin"
echo "   API: https://your-project.strapiapp.com/api"
echo ""