# Database Migrations

This folder contains SQL migration scripts for the AI Studio platform.

## Migration Files

- `001-add-multilang-support.sql` - Adds multi-language support (locale columns) to all content tables and inserts Russian and Hebrew translations
- `002-seed-contact-data.sql` - Seeds contact page data

## How to Run Migrations

### Local Development

```bash
# Connect to local PostgreSQL Docker container
psql postgresql://postgres:postgres@localhost:5432/strapi < migrations/001-add-multilang-support.sql
psql postgresql://postgres:postgres@localhost:5432/strapi < migrations/002-seed-contact-data.sql
```

### Production (Railway)

⚠️ **IMPORTANT**: Always backup the database before running migrations!

```bash
# First, create a backup
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d-%H%M%S).sql

# Then run migrations
psql $DATABASE_URL < migrations/001-add-multilang-support.sql
psql $DATABASE_URL < migrations/002-seed-contact-data.sql
```

## Migration Notes

### 001-add-multilang-support.sql
- Adds `locale` column to tables: home_pages, courses, blog_posts, teachers, contact_pages
- Sets default locale to 'en' for existing records
- Inserts complete Russian (ru) and Hebrew (he) translations
- Creates indexes for performance optimization
- Safe to run multiple times (uses IF NOT EXISTS clauses)

### 002-seed-contact-data.sql
- Inserts/updates contact information
- Uses ON CONFLICT to handle existing data safely
- Can be run multiple times without issues

## Verification

After running migrations, verify success:

```sql
-- Check locale support
SELECT locale, COUNT(*) FROM home_pages GROUP BY locale;
SELECT locale, COUNT(*) FROM courses GROUP BY locale;

-- Test API with locale
curl 'http://localhost:3000/api/home-page?locale=ru'
curl 'http://localhost:3000/api/home-page?locale=he'
```