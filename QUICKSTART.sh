#!/bin/bash

# AI Studio Quick Start - One Command Setup
# This script sets up everything needed for local development

echo "🚀 AI Studio Local Development - Quick Start"
echo "==========================================="
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ Node.js/npm is not installed. Please install from: https://nodejs.org/"
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop."
    exit 1
fi

echo "✅ Prerequisites check passed"
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start everything
echo "🎯 Starting local environment..."
echo ""
npm run start:local

echo ""
echo "✨ Setup complete! Your local environment is ready."
echo ""
echo "📌 Quick Reference:"
echo "  Frontend:    http://localhost:3005"
echo "  Admin Panel: http://localhost:3000/content-admin-comprehensive.html"
echo "  API:         http://localhost:3000"
echo "  pgAdmin:     http://localhost:5050"
echo ""
echo "💡 To stop all services, press Ctrl+C"