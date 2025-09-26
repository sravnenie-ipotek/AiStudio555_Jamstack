# AI Studio E-Learning Platform - Command Reference

## Quick Start Commands

### 1. Start Development Environment
```bash
# Install dependencies
npm install

# Start backend API server (port 3000)
npm start

# Start frontend dev server (port 3005) - in separate terminal
python3 -m http.server 3005

# Or run both concurrently
npm run dev
```

### 2. Production Preview
```bash
# Build for production
npm run build

# Preview production build
python3 -m http.server 8000 --directory dist
```

## Server Commands

### Backend Server
```bash
# Start Express API server
node server.js                    # Direct start with logs
npm start                         # Using npm script
PORT=3001 node server.js         # Custom port

# Database operations
npm run migrate                   # Run database migrations
node migrate-to-railway.js        # Migrate SQLite to PostgreSQL
```

### Frontend Server
```bash
# Development server
python3 -m http.server 3005       # Main development server
python3 -m http.server 8000       # Alternative port

# Production server
python3 -m http.server 8000 --directory dist
```

## Testing Commands

### Playwright Tests
```bash
# Run all tests
npx playwright test

# Run specific test suites
npx playwright test tests/responsive.spec.js
npx playwright test tests/responsive-quick.spec.js
npx playwright test tests/translation.spec.js

# Debug mode
npx playwright test --debug

# With headed browser
npx playwright test --headed

# Specific browser
npx playwright test --browser=chromium
```

### API Testing
```bash
# Test API endpoints locally
curl http://localhost:3000/api/courses
curl "http://localhost:3000/api/home-page?locale=ru"
curl "http://localhost:3000/api/home-page?preview=true"

# Test production API
curl https://aistudio555jamstack-production.up.railway.app/api/courses
```

### Navigation Testing
```bash
# Test production navigation consistency
node test-production-navigation.js
```

## Development URLs

### Local Development
```
Frontend:          http://localhost:3005
API Server:        http://localhost:3000
Admin Panel:       http://localhost:3005/admin-nd.html
Home Page:         http://localhost:3005/home.html
Courses:           http://localhost:3005/courses.html
Teachers:          http://localhost:3005/teachers.html
Career Center:     http://localhost:3005/career-center.html
Blog:              http://localhost:3005/blog.html

# Language versions
English:           http://localhost:3005/dist/en/home.html
Russian:           http://localhost:3005/dist/ru/home.html
Hebrew:            http://localhost:3005/dist/he/home.html

# Test pages
Translations Test: http://localhost:3005/test-translations.html
Live Translations: http://localhost:3005/test-live-translations.html
```

### Production URLs
```
Website:           https://www.aistudio555.com/home.html
API Server:        https://aistudio555jamstack-production.up.railway.app
Admin Panel:       https://aistudio555jamstack-production.up.railway.app/admin-nd.html
```

## Git Commands

### Repository Management
```bash
# Clone repository
git clone git@github.com:sravnenie-ipotek/AiStudio555_Jamstack.git

# Check status
git status

# Create new branch
git checkout -b feature/new-feature

# Add and commit changes
git add .
git commit -m "Description of changes"

# Push to remote
git push origin feature/new-feature

# Deploy to production (auto-deploys from main)
git checkout main
git merge feature/new-feature
git push origin main
```

## Database Commands

### Local Development
```bash
# View SQLite database (if using local SQLite)
sqlite3 database.db

# Common SQLite commands
.tables                          # List all tables
.schema nd_home                  # Show table structure
SELECT * FROM nd_home LIMIT 1;   # Sample data
.exit                           # Exit SQLite
```

### Railway PostgreSQL
```bash
# Connect to Railway database
railway run psql

# Common PostgreSQL commands
\dt                             # List all tables
\d nd_home                      # Show table structure
SELECT * FROM nd_home LIMIT 1;  # Sample data
\q                              # Exit PostgreSQL
```

## Build & Deployment Commands

### Build Process
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Clean build
rm -rf dist/
npm run build
```

### Railway Deployment
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link to project
railway link

# Deploy manually
railway up

# View logs
railway logs

# Open Railway dashboard
railway open
```

## Utility Commands

### Port Management
```bash
# Find process using port 3000
lsof -i :3000

# Kill process on port 3000
kill -9 $(lsof -t -i:3000)

# Check all Node processes
ps aux | grep node
```

### File Management
```bash
# Find all integration files
find . -name "*integration*.js"

# Search for specific content
grep -r "data-i18n" --include="*.html"

# Count lines of code
find . -name "*.js" | xargs wc -l
```

### Performance Analysis
```bash
# Check bundle size
du -sh dist/

# Analyze file sizes
ls -lah dist/js/

# Monitor server performance
top
htop
```

## Environment Variables

### Required Variables
```bash
# Local development (.env file)
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
PORT=3000
NODE_ENV=development

# Railway (auto-configured)
DATABASE_URL=<Railway provides>
PORT=<Railway assigns>
NODE_ENV=production
```

### Setting Variables
```bash
# For single command
PORT=3001 node server.js

# Export for session
export PORT=3001
export NODE_ENV=development

# Using .env file
echo "PORT=3001" >> .env
echo "NODE_ENV=development" >> .env
```

## Debugging Commands

### Console Debugging
```bash
# Start with debug output
DEBUG=* node server.js

# Node inspector
node --inspect server.js

# Chrome DevTools
# Open chrome://inspect after running with --inspect
```

### Log Viewing
```bash
# View server logs
tail -f server.log

# View last 100 lines
tail -n 100 server.log

# Search logs
grep "ERROR" server.log
```

## Common Workflows

### Add New Translation
```bash
# 1. Add data-i18n attribute to HTML element
# 2. Update database via admin panel or API
# 3. Test translation switching
curl "http://localhost:3000/api/nd/home-page?locale=ru"
```

### Update Content
```bash
# 1. Open admin panel
open http://localhost:3005/admin-nd.html

# 2. Edit content and save
# 3. Preview changes
open "http://localhost:3005/home.html?preview=true"
```

### Deploy Changes
```bash
# 1. Test locally
npm run dev

# 2. Run tests
npx playwright test

# 3. Commit and push
git add .
git commit -m "Update: description"
git push origin main

# 4. Verify deployment (auto-deploys)
open https://www.aistudio555.com
```

## Troubleshooting Commands

### Clear Cache
```bash
# Clear npm cache
npm cache clean --force

# Clear browser cache (Mac)
# Chrome: Cmd+Shift+Delete

# Restart services
npm restart
```

### Check Service Status
```bash
# Check if server is running
curl http://localhost:3000/health

# Check Railway status
railway status

# View Railway logs
railway logs --tail
```

### Database Issues
```bash
# Reset database (CAUTION!)
node migrate-to-railway.js --reset

# Backup database
pg_dump $DATABASE_URL > backup.sql

# Restore database
psql $DATABASE_URL < backup.sql
```

## Package.json Scripts Reference

```json
"scripts": {
  "start": "node server.js",
  "dev": "concurrently \"npm run server\" \"npm run frontend\"",
  "server": "nodemon server.js",
  "frontend": "python3 -m http.server 3005",
  "build": "node scripts/build.js",
  "migrate": "node migrate-to-railway.js",
  "test": "playwright test",
  "test:quick": "playwright test tests/responsive-quick.spec.js"
}
```

---

*Last Updated: January 2025*