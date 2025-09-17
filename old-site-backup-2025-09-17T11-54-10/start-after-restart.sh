#!/bin/bash

# Quick start script after computer restart
# PostgreSQL auto-starts, so just need to start the app

echo "🚀 Starting AI Studio after restart..."
echo "======================================"
echo ""

# Check if PostgreSQL is running
echo "✅ Checking PostgreSQL status..."
if pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
    echo "✅ PostgreSQL is running!"
else
    echo "⚠️  PostgreSQL is not running. Starting it..."
    brew services start postgresql@16
    sleep 3
fi

# Check if database exists
echo "📊 Checking if aistudio_db exists..."
if psql -U postgres -lqt | cut -d \| -f 1 | grep -qw aistudio_db; then
    echo "✅ Database 'aistudio_db' exists with production data!"
else
    echo "⚠️  Database not found. Running initial setup..."
    ./use-existing-postgres.sh
fi

# Start the application
echo ""
echo "🌐 Starting Express server..."
echo "======================================"
npm start