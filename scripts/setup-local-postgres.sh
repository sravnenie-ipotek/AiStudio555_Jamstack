#!/bin/bash

# Complete Setup Script for Local PostgreSQL with Production Data

echo "🚀 AI Studio Local PostgreSQL Setup"
echo "===================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check Docker installation
echo -e "${YELLOW}Step 1: Checking Docker installation...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker Desktop first.${NC}"
    echo "   Visit: https://www.docker.com/products/docker-desktop"
    exit 1
fi
echo -e "${GREEN}✅ Docker is installed${NC}"

# Step 2: Stop existing containers
echo -e "${YELLOW}Step 2: Stopping existing containers...${NC}"
docker-compose down 2>/dev/null || true

# Step 3: Start PostgreSQL container
echo -e "${YELLOW}Step 3: Starting PostgreSQL container...${NC}"
docker-compose up -d postgres

# Wait for PostgreSQL to be ready
echo -e "${YELLOW}Step 4: Waiting for PostgreSQL to be ready...${NC}"
sleep 5
until docker exec aistudio_postgres_local pg_isready -U aistudio_user -d aistudio_db 2>/dev/null; do
    echo "   PostgreSQL is starting up..."
    sleep 2
done
echo -e "${GREEN}✅ PostgreSQL is ready!${NC}"

# Step 5: Initialize database schema
echo -e "${YELLOW}Step 5: Initializing database schema...${NC}"
if [ -f "Docs/localEnv/init-db.sql" ]; then
    docker exec -i aistudio_postgres_local psql -U aistudio_user -d aistudio_db < Docs/localEnv/init-db.sql
    echo -e "${GREEN}✅ Database schema initialized${NC}"
else
    echo -e "${YELLOW}⚠️  No init-db.sql found, skipping schema initialization${NC}"
fi

# Step 6: Copy .env.local to .env
echo -e "${YELLOW}Step 6: Setting up environment variables...${NC}"
if [ -f ".env.local" ]; then
    cp .env.local .env
    echo -e "${GREEN}✅ Environment variables configured${NC}"
else
    echo -e "${RED}❌ .env.local not found${NC}"
fi

# Step 7: Start PgAdmin (optional)
echo -e "${YELLOW}Step 7: Starting PgAdmin...${NC}"
docker-compose up -d pgadmin
echo -e "${GREEN}✅ PgAdmin started${NC}"

# Display connection information
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 Local PostgreSQL Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "📊 Database Connection:"
echo "   Host: localhost"
echo "   Port: 5433"
echo "   Database: aistudio_db"
echo "   Username: aistudio_user"
echo "   Password: aistudio_dev_password_2024"
echo ""
echo "🔗 Connection String:"
echo "   postgresql://aistudio_user:aistudio_dev_password_2024@localhost:5433/aistudio_db"
echo ""
echo "🖥️  PgAdmin Interface:"
echo "   URL: http://localhost:5050"
echo "   Email: admin@aistudio555.com"
echo "   Password: admin_password_2024"
echo ""
echo "📝 Next Steps:"
echo "   1. To dump production data:    ./scripts/dump-production-db.sh"
echo "   2. To import production data:  ./scripts/import-to-local-db.sh"
echo "   3. To start the API server:    npm start"
echo "   4. To access admin panel:      http://localhost:3000/admin"
echo ""
echo -e "${YELLOW}💡 Tip: Make sure to update PROD_DATABASE_URL in .env.local with your Railway credentials${NC}"