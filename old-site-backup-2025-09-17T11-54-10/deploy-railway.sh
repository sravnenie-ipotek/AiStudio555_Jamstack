#!/bin/bash

# Railway Deployment Script
# Deploys AI Studio with workaround for Strapi v5 API bug

echo "╔════════════════════════════════════════════╗"
echo "║   🚀 RAILWAY DEPLOYMENT SCRIPT             ║"
echo "╠════════════════════════════════════════════╣"
echo "║   AI Studio E-Learning Platform            ║"
echo "║   Using Custom Live API (Strapi bug fix)   ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Set Railway token
export RAILWAY_TOKEN=1404715b-c23d-40c9-9e45-7861ca2975a9

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Git operations
echo "📝 Committing changes..."
git add .
git commit -m "Deploy: AI Studio with custom Live API for Strapi v5 bug workaround"

# Push to GitHub
echo "🔄 Pushing to GitHub..."
git push origin main

# Deploy to Railway
echo "🚂 Deploying to Railway..."
railway up

# Get deployment URL
echo ""
echo "✅ Deployment complete!"
echo ""
echo "📌 Important URLs:"
echo "   Production: https://your-app.railway.app"
echo "   Admin Panel: https://your-app.railway.app/admin"
echo "   API Status: https://your-app.railway.app/api/status"
echo ""
echo "📊 Available API Endpoints:"
echo "   GET  /api/home-page"
echo "   GET  /api/courses"
echo "   GET  /api/blog-posts"
echo "   GET  /api/teachers"
echo "   POST /api/courses"
echo "   PUT  /api/courses/:id"
echo "   PUT  /api/home-page/:id"
echo ""
echo "⚠️  Note: Using custom Live API due to Strapi v5 critical bug"
echo "    All Strapi /api/* endpoints return 404 - bug documented in:"
echo "    /Docs/architecture/strapi/PROBLEM/bugInStrapi.md"