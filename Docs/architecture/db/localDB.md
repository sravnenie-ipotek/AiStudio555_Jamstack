# Local Database Setup

## Overview
The local development environment uses PostgreSQL (same as production) to ensure testing accuracy and consistency. This setup creates an exact copy of the Railway production database locally.

## Database Configuration

### Production Database
- **Host**: Railway PostgreSQL Cloud
- **Connection**: `postgresql://postgres:KwMSyqCsZozDwIGEBrHOeVXnLAfTRjbk@autorack.proxy.rlwy.net:29884/railway`
- **Provider**: Railway Platform

### Local Database
- **Type**: PostgreSQL 16 (Homebrew installation)
- **Port**: 5432 (default PostgreSQL port)
- **Database Name**: `aistudio_db`
- **Username**: `postgres`
- **Password**: `postgres`
- **Connection String**: `postgresql://postgres:postgres@localhost:5432/aistudio_db`

## Setup Instructions

### Prerequisites
- PostgreSQL 16 installed via Homebrew
- PostgreSQL service running (`brew services start postgresql@16`)
- Node.js and npm installed

### Initial Setup (First Time)

1. **Copy Production Data to Local**
   ```bash
   ./use-existing-postgres.sh
   ```
   This script will:
   - Connect to Railway production database
   - Create `aistudio_db` in local PostgreSQL
   - Dump all production data
   - Import data to local database
   - Create `.env` file with local connection

2. **Start the Application**
   ```bash
   npm start
   ```

### Daily Usage (After Computer Restart)

```bash
./start-after-restart.sh
```

This script automatically:
- Checks if PostgreSQL is running
- Verifies database exists
- Starts the Express server

## Database Structure

### Core Tables
- `home_pages` - Homepage content (multi-language)
- `courses` - Course catalog
- `teachers` - Instructor profiles
- `blog_posts` - Blog articles
- `about_pages` - About page content
- `contact_pages` - Contact information
- `career_center_pages` - Career center content
- `career_orientation_pages` - Career guidance content
- `pricing_plans` - Pricing information
- `job_postings` - Job listings

### Footer System Tables
- `footer_content` - Footer content with XSS protection
- `footer_navigation_menus` - Navigation menu structure
- `footer_social_links` - Social media links
- `footer_newsletter_config` - Newsletter configuration
- `footer_audit_log` - Audit trail for changes

### Multi-Language Support
- Supported locales: `en`, `ru`, `he`
- Automatic fallback: ru/he ’ en if translation missing
- RTL support for Hebrew

## Environment Variables

Create `.env` file in project root:
```env
# Local PostgreSQL Configuration
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/aistudio_db
NODE_ENV=development
PORT=3000
```

## Scripts Reference

### Migration Scripts
- `use-existing-postgres.sh` - Initial setup, copies production data
- `start-after-restart.sh` - Daily startup script
- `sync-production-to-local.sh` - Alternative sync method (Docker)

### Database Commands
```bash
# Check if PostgreSQL is running
pg_isready -h localhost -p 5432

# List all databases
psql -U postgres -l

# Connect to database
psql -U postgres -d aistudio_db

# List all tables
psql -U postgres -d aistudio_db -c "\dt"

# Count records in tables
psql -U postgres -d aistudio_db -c "
  SELECT 'courses' as table, COUNT(*) FROM courses
  UNION ALL SELECT 'teachers', COUNT(*) FROM teachers
  UNION ALL SELECT 'blog_posts', COUNT(*) FROM blog_posts;
"
```

## PostgreSQL Service Management

### Homebrew Services
```bash
# Start PostgreSQL
brew services start postgresql@16

# Stop PostgreSQL
brew services stop postgresql@16

# Restart PostgreSQL
brew services restart postgresql@16

# Check service status
brew services list | grep postgres
```

### Auto-Start Configuration
PostgreSQL is configured to auto-start on system boot via:
`~/Library/LaunchAgents/homebrew.mxcl.postgresql@16.plist`

## Troubleshooting

### Port Already in Use
If port 5432 is occupied:
1. Check what's using it: `lsof -i :5432`
2. Either stop the service or use Docker with port 5433

### Database Connection Failed
1. Verify PostgreSQL is running: `pg_isready`
2. Check `.env` file exists with correct `DATABASE_URL`
3. Verify database exists: `psql -U postgres -l | grep aistudio_db`

### Permission Denied
If you get permission errors:
```bash
# Grant permissions
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE aistudio_db TO postgres;"
```

### Data Out of Sync
To refresh local data from production:
```bash
# Re-run the migration
./use-existing-postgres.sh
```

## Security Notes

- **Local Only**: The local database is only accessible from localhost
- **No SSL**: Local connections don't require SSL (unlike production)
- **Default Credentials**: Using default postgres/postgres for local development
- **Production Data**: Contains real production data - handle with care
- **No Public Access**: Ensure PostgreSQL is not exposed to network

## Performance Optimization

### Indexes
All necessary indexes are created during migration:
- Locale-based indexes for multi-language queries
- Visibility flags for content filtering
- Timestamp indexes for ordering

### Connection Pooling
The Express server uses single connections per request. For production-like testing, consider implementing connection pooling.

## Backup and Restore

### Create Backup
```bash
pg_dump -U postgres aistudio_db > backup_$(date +%Y%m%d).sql
```

### Restore Backup
```bash
psql -U postgres -d aistudio_db < backup_20240101.sql
```

### Backup Location
Backups are stored in `/backups` directory with timestamp.

## pgAdmin Connection

To connect pgAdmin to local database:

1. Click "Add New Server"
2. General Tab:
   - Name: `Local AI Studio`
3. Connection Tab:
   - Host: `localhost`
   - Port: `5432`
   - Database: `aistudio_db`
   - Username: `postgres`
   - Password: `postgres`
4. Save

## Testing with Local Database

The local database allows you to:
- Test with real production data
- Verify migrations before deploying
- Debug production issues locally
- Test multi-language content
- Validate data integrity

## Important Files

- `/use-existing-postgres.sh` - Main migration script
- `/start-after-restart.sh` - Startup script
- `/.env` - Environment configuration
- `/server.js` - Express server with database connection
- `/backups/` - Database backup directory

## Differences from Production

| Aspect | Production | Local |
|--------|------------|-------|
| Database | Railway PostgreSQL | Local PostgreSQL 16 |
| SSL | Required | Not required |
| Port | Railway assigned | 5432 |
| Host | autorack.proxy.rlwy.net | localhost |
| Auto-scaling | Yes | No |
| Backups | Automatic | Manual |

## Next Steps

1. Run initial setup: `./use-existing-postgres.sh`
2. Start development: `npm start`
3. Access admin panel: http://localhost:3000/admin
4. Make changes and test with production data
5. Deploy to Railway when ready