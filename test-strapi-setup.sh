#!/bin/bash

echo "🔍 STRAPI CMS SETUP VERIFICATION"
echo "================================"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Docker
echo -n "1. Docker installed: "
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✅ $(docker --version)${NC}"
else
    echo -e "${RED}❌ Not found${NC}"
    exit 1
fi

# Check Docker Compose
echo -n "2. Docker Compose installed: "
if command -v docker-compose &> /dev/null; then
    echo -e "${GREEN}✅ $(docker-compose --version)${NC}"
else
    echo -e "${RED}❌ Not found${NC}"
    exit 1
fi

# Check project files
echo -n "3. Docker configuration: "
if [ -f "docker-compose.yml" ] && [ -f "Dockerfile" ]; then
    echo -e "${GREEN}✅ Found${NC}"
else
    echo -e "${RED}❌ Missing files${NC}"
    exit 1
fi

# Check Strapi project
echo -n "4. Strapi project structure: "
if [ -d "strapi-cms" ] && [ -f "strapi-cms/package.json" ]; then
    echo -e "${GREEN}✅ Found${NC}"
else
    echo -e "${RED}❌ Missing${NC}"
    exit 1
fi

# Check environment file
echo -n "5. Environment configuration: "
if [ -f ".env" ]; then
    echo -e "${GREEN}✅ Found${NC}"
else
    echo -e "${YELLOW}⚠️ Not found - using defaults${NC}"
fi

# Check Playwright tests
echo -n "6. E2E tests: "
if [ -f "playwright.config.js" ] && [ -d "tests/e2e" ]; then
    TEST_COUNT=$(ls tests/e2e/*.spec.js 2>/dev/null | wc -l)
    echo -e "${GREEN}✅ ${TEST_COUNT} test files${NC}"
else
    echo -e "${RED}❌ Not found${NC}"
fi

echo ""
echo "📋 QUICK START COMMANDS:"
echo "------------------------"
echo -e "${GREEN}# Start all services:${NC}"
echo "  ./start-strapi.sh"
echo ""
echo -e "${GREEN}# Run E2E tests:${NC}"
echo "  npx playwright test"
echo ""
echo -e "${GREEN}# View logs:${NC}"
echo "  docker-compose logs -f"
echo ""
echo -e "${GREEN}# Stop services:${NC}"
echo "  docker-compose down"
echo ""
echo "🌐 SERVICE URLS:"
echo "----------------"
echo "  Strapi Admin: http://localhost:1337/admin"
echo "  Strapi API:   http://localhost:1337/api"
echo "  LibreTranslate: http://localhost:5000"
echo ""
echo -e "${GREEN}✅ Setup verification complete!${NC}"
echo ""
echo "📚 Documentation:"
echo "  - Implementation: Docs/todo/strapiStrategyDev-IMPLEMENTATION.md"
echo "  - Admin Guide: Docs/todo/sliceForAdmin.md"
echo "  - Original Plan: Docs/todo/strapiStrategyDev.md"