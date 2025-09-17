#!/bin/bash

# ONE COMMAND TO RULE THEM ALL
# This script makes your local environment EXACTLY like production

echo "🚀 STARTING LOCAL ENVIRONMENT (PRODUCTION CLONE)"
echo "================================================"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "🐳 Starting Docker Desktop..."
    open -a Docker
    echo "⏳ Waiting for Docker to start (15 seconds)..."
    sleep 15
fi

# Run the sync script
./sync-production-to-local.sh

# Start the server
echo ""
echo "🌐 Starting Express server with PostgreSQL..."
npm start