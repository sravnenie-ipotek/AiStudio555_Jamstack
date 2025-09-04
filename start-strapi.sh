#!/bin/bash

echo "🚀 Starting Strapi CMS with LibreTranslate..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Build and start containers
echo "🏗️ Building Docker images..."
docker-compose build

# Start the services
echo "▶️ Starting services..."
docker-compose up -d

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 10

# Check if services are running
echo "✅ Checking service status..."
docker-compose ps

# Show logs
echo "📋 Service URLs:"
echo "   - Strapi Admin: http://localhost:1337/admin"
echo "   - Strapi API: http://localhost:1337/api"
echo "   - LibreTranslate: http://localhost:5000"
echo "   - PostgreSQL: localhost:5432"
echo ""
echo "📝 Default credentials:"
echo "   - Database: strapi / strapi_password_2024"
echo ""
echo "🎯 Next steps:"
echo "   1. Access Strapi Admin at http://localhost:1337/admin"
echo "   2. Create your SuperAdmin account"
echo "   3. Configure content types if needed"
echo "   4. Import content from Webflow"
echo "   5. Set up content managers with limited permissions"
echo ""
echo "📚 To view logs: docker-compose logs -f"
echo "🛑 To stop: docker-compose down"
echo ""
echo "✅ Setup complete!"