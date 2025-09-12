#!/bin/bash

# AI Studio Local Development Startup Script
# Starts all services needed for local development

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Functions
print_header() {
    echo -e "\n${CYAN}${BOLD}═══════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}${BOLD}  $1${NC}"
    echo -e "${CYAN}${BOLD}═══════════════════════════════════════════════════════${NC}\n"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if running from project root
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_header "🚀 AI Studio Local Development Environment"

# Step 1: Check Docker
print_info "Checking Docker status..."
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker Desktop."
    exit 1
fi
print_success "Docker is running"

# Step 2: Start PostgreSQL and pgAdmin
print_info "Starting PostgreSQL and pgAdmin containers..."
docker compose up -d

# Wait for PostgreSQL to be ready
print_info "Waiting for PostgreSQL to be ready..."
MAX_ATTEMPTS=30
ATTEMPT=0
while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    if docker exec aistudio_postgres_local pg_isready -U aistudio_user > /dev/null 2>&1; then
        print_success "PostgreSQL is ready"
        break
    fi
    ATTEMPT=$((ATTEMPT + 1))
    sleep 1
    echo -n "."
done

if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
    print_error "PostgreSQL failed to start"
    exit 1
fi

# Step 3: Check if database has data
print_info "Checking database content..."
TABLE_COUNT=$(docker exec aistudio_postgres_local psql -U aistudio_user -d aistudio_db -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null | tr -d ' ')

if [ -z "$TABLE_COUNT" ] || [ "$TABLE_COUNT" -eq "0" ]; then
    print_warning "Database is empty. Would you like to import production data? (y/n)"
    read -r IMPORT_DATA
    if [ "$IMPORT_DATA" = "y" ] || [ "$IMPORT_DATA" = "Y" ]; then
        print_info "Running production data sync..."
        node scripts/sync-production-data.js
    else
        print_warning "Continuing with empty database. You can import data later with: npm run sync:production"
    fi
else
    print_success "Database has $TABLE_COUNT tables"
fi

# Step 4: Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_info "Installing dependencies..."
    npm install
fi

# Step 5: Create necessary directories
mkdir -p backups
mkdir -p logs

# Step 6: Start the application servers
print_header "Starting Application Servers"

# Kill any existing processes on our ports
print_info "Checking for processes on ports 3000 and 3005..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3005 | xargs kill -9 2>/dev/null || true

# Start API server
print_info "Starting API server on port 3000..."
NODE_ENV=development node server.local.js > logs/api.log 2>&1 &
API_PID=$!
echo $API_PID > .api.pid
print_success "API server started (PID: $API_PID)"

# Start frontend server
print_info "Starting frontend server on port 3005..."
python3 -m http.server 3005 > logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > .frontend.pid
print_success "Frontend server started (PID: $FRONTEND_PID)"

# Wait a moment for servers to start
sleep 2

# Step 7: Display access information
print_header "🎉 Local Environment Ready!"

echo -e "${BOLD}Access URLs:${NC}"
echo -e "  ${GREEN}Frontend:${NC}      http://localhost:3005"
echo -e "  ${GREEN}API Server:${NC}    http://localhost:3000"
echo -e "  ${GREEN}Admin Panel:${NC}   http://localhost:3000/content-admin-comprehensive.html"
echo -e "  ${GREEN}pgAdmin:${NC}       http://localhost:5050"
echo -e "  ${GREEN}Health Check:${NC}  http://localhost:3000/health"

echo -e "\n${BOLD}Database Credentials:${NC}"
echo -e "  Host:     localhost"
echo -e "  Port:     5432"
echo -e "  Database: aistudio_db"
echo -e "  Username: aistudio_user"
echo -e "  Password: aistudio_dev_password_2024"

echo -e "\n${BOLD}pgAdmin Credentials:${NC}"
echo -e "  Email:    admin@aistudio555.com"
echo -e "  Password: admin_password_2024"

echo -e "\n${BOLD}Useful Commands:${NC}"
echo -e "  ${CYAN}View API logs:${NC}      tail -f logs/api.log"
echo -e "  ${CYAN}View frontend logs:${NC} tail -f logs/frontend.log"
echo -e "  ${CYAN}View Docker logs:${NC}   docker compose logs -f"
echo -e "  ${CYAN}Stop all services:${NC}  npm run stop:local"
echo -e "  ${CYAN}Import prod data:${NC}   npm run sync:production"

echo -e "\n${YELLOW}Press Ctrl+C to stop all services${NC}"

# Trap Ctrl+C and cleanup
cleanup() {
    echo -e "\n${YELLOW}Stopping services...${NC}"
    
    # Kill API server
    if [ -f .api.pid ]; then
        kill $(cat .api.pid) 2>/dev/null || true
        rm .api.pid
    fi
    
    # Kill frontend server
    if [ -f .frontend.pid ]; then
        kill $(cat .frontend.pid) 2>/dev/null || true
        rm .frontend.pid
    fi
    
    # Ask about Docker containers
    echo -e "${YELLOW}Stop Docker containers? (y/n)${NC}"
    read -r STOP_DOCKER
    if [ "$STOP_DOCKER" = "y" ] || [ "$STOP_DOCKER" = "Y" ]; then
        docker compose down
        print_success "Docker containers stopped"
    fi
    
    print_success "All services stopped"
    exit 0
}

trap cleanup INT

# Keep script running and show logs
tail -f logs/api.log logs/frontend.log 2>/dev/null