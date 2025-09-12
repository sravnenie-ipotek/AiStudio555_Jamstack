# 🚀 AI Studio Local Development Environment

Complete guide for setting up and running the AI Studio platform locally with Docker PostgreSQL and production data sync.

## 📋 Prerequisites

1. **Docker Desktop** - [Download here](https://www.docker.com/products/docker-desktop/)
2. **Node.js 18+** - [Download here](https://nodejs.org/)
3. **Python 3** - For serving static files
4. **PostgreSQL client tools** - Install with: `brew install postgresql`

## 🎯 Quick Start (One Command Setup)

```bash
# Clone the repository (if needed)
git clone git@github.com:sravnenie-ipotek/AiStudio555_Jamstack.git
cd AiStudio555_Jamstack

# Install dependencies
npm install

# Start everything with production data
npm run start:local
```

This single command will:
- ✅ Start Docker PostgreSQL container
- ✅ Start pgAdmin for database management
- ✅ Check and import production data if needed
- ✅ Start the API server on port 3000
- ✅ Start the frontend server on port 3005
- ✅ Open the admin panel

## 📦 Manual Setup Steps

### 1. Start Docker Containers

```bash
# Start PostgreSQL and pgAdmin
npm run docker:up

# Verify containers are running
docker ps

# View logs if needed
npm run docker:logs
```

### 2. Import Production Data

```bash
# Sync all production data to local database
npm run sync:production
```

This will:
- Export complete production database from Railway
- Create timestamped backup in `backups/` directory
- Import all data into local Docker PostgreSQL
- Verify the import was successful

### 3. Start Development Servers

```bash
# Option 1: Start everything with one command
npm run dev:local

# Option 2: Start servers individually
node server.local.js        # API server on port 3000
python3 -m http.server 3005  # Frontend on port 3005
```

## 🌐 Access URLs

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3005 | Main website |
| **API Server** | http://localhost:3000 | REST API endpoints |
| **Admin Panel** | http://localhost:3000/content-admin-comprehensive.html | Content management |
| **pgAdmin** | http://localhost:5050 | Database management GUI |
| **Health Check** | http://localhost:3000/health | API health status |
| **Dev Info** | http://localhost:3000/api/dev-info | Database statistics |

## 🔑 Credentials

### PostgreSQL Database
- **Host:** localhost
- **Port:** 5432
- **Database:** aistudio_db
- **Username:** aistudio_user
- **Password:** aistudio_dev_password_2024

### pgAdmin
- **Email:** admin@aistudio555.com
- **Password:** admin_password_2024

## 🛠️ Available Commands

### Docker Management
```bash
npm run docker:up       # Start containers
npm run docker:down     # Stop containers
npm run docker:logs     # View container logs
npm run docker:reset    # Reset everything (DELETES DATA!)
```

### Database Operations
```bash
npm run sync:production  # Import production data
npm run db:psql         # Open PostgreSQL CLI
npm run db:backup       # Backup current database
```

### Development
```bash
npm run start:local     # Start everything (recommended)
npm run dev:local       # Start API + Frontend
npm run stop:local     # Stop all local services
```

## 📂 Project Structure

```
.
├── docker-compose.yml           # Docker configuration
├── .env.local                  # Local environment variables
├── server.local.js             # Local API server
├── scripts/
│   ├── start-local.sh         # Startup script
│   └── sync-production-data.js # Data sync script
├── backups/                    # Database backups
└── logs/                       # Application logs
```

## 🔍 Testing the Setup

### 1. Verify Database Connection
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "healthy",
  "environment": "local",
  "database": "connected"
}
```

### 2. Check API Endpoints
```bash
# Get courses
curl http://localhost:3000/api/courses

# Get teachers
curl http://localhost:3000/api/teachers

# Get home page content
curl http://localhost:3000/api/home-page
```

### 3. Access Admin Panel
Open http://localhost:3000/content-admin-comprehensive.html

You should see:
- Green "LOCAL ENVIRONMENT" indicator in top-right
- All content fields populated with production data
- Ability to edit and save content locally

## 🐛 Troubleshooting

### Docker Issues

**Problem:** Docker containers won't start
```bash
# Reset Docker completely
npm run docker:reset

# Check Docker daemon
docker info

# Restart Docker Desktop app
```

**Problem:** Port already in use
```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Find and kill process on port 5432
lsof -ti:5432 | xargs kill -9
```

### Database Issues

**Problem:** Cannot connect to database
```bash
# Check if container is running
docker ps | grep postgres

# Check database logs
docker logs aistudio_postgres_local

# Restart container
docker restart aistudio_postgres_local
```

**Problem:** Empty database / No data
```bash
# Re-import production data
npm run sync:production

# Verify tables exist
npm run db:psql
\dt  # List all tables
SELECT COUNT(*) FROM courses;  # Check data
\q   # Exit
```

### API Server Issues

**Problem:** API returns 500 errors
```bash
# Check server logs
tail -f logs/api.log

# Verify environment variables
cat .env.local

# Restart server
npm run stop:local
npm run dev:local
```

## 📊 Database Schema

The local database mirrors production with these main tables:

| Table | Description |
|-------|-------------|
| `courses` | Course catalog with multi-language support |
| `teachers` | Instructor profiles |
| `blogs` | Blog posts and articles |
| `pages` | Dynamic page content (home, career pages) |
| `content_en/ru/he` | Localized content tables |

## 🔄 Daily Workflow

### Morning Setup
```bash
# 1. Start Docker containers
npm run docker:up

# 2. Start development servers
npm run dev:local

# 3. Open browser tabs
open http://localhost:3005  # Frontend
open http://localhost:3000/content-admin-comprehensive.html  # Admin
```

### During Development
```bash
# View API logs
tail -f logs/api.log

# Test API changes
curl http://localhost:3000/api/courses

# Access database directly
npm run db:psql
```

### End of Day
```bash
# Stop servers but keep database
npm run stop:local

# Or stop everything including Docker
npm run docker:down
```

## 🔄 Syncing with Production

### Get Latest Production Data
```bash
# This overwrites local data with production
npm run sync:production
```

### Backup Local Changes
```bash
# Manual backup before sync
docker exec aistudio_postgres_local pg_dump -U aistudio_user aistudio_db > backups/local_backup_$(date +%Y%m%d).sql
```

## 🚀 Advanced Usage

### Custom Environment Variables
Edit `.env.local` to customize:
- Database connections
- API ports
- Feature flags
- Logging levels

### Direct Database Access
```bash
# PostgreSQL CLI
npm run db:psql

# pgAdmin GUI
open http://localhost:5050
# Add server: localhost:5432, user: aistudio_user
```

### Production Mode Testing
```bash
# Build and serve production files
npm run build
npm run preview
# Visit http://localhost:8000
```

## 📝 Notes

- **Data Persistence:** Database data persists in Docker volumes between restarts
- **Backups:** Production syncs create timestamped backups in `backups/`
- **Logs:** API and frontend logs are saved in `logs/`
- **Hot Reload:** Changes to server.local.js require restart
- **CORS:** Local environment allows all origins for development

## 🆘 Getting Help

1. Check logs: `tail -f logs/*.log`
2. Verify Docker: `docker compose ps`
3. Check health: `curl http://localhost:3000/health`
4. Review this guide
5. Check `CLAUDE.md` for project-specific notes

## 🎉 Success Indicators

You know your local environment is working when:
- ✅ http://localhost:3000/health returns "healthy"
- ✅ Admin panel shows "LOCAL ENVIRONMENT" badge
- ✅ API endpoints return data
- ✅ Frontend displays course content
- ✅ pgAdmin can connect to database
- ✅ No errors in logs

---

**Happy coding! 🚀**