# PostgreSQL Database Scripts

## Overview
This directory contains scripts to replicate the local PostgreSQL database structure and data.

## Files Available
- `FULL_DATABASE_RESTORE.sql` - **COMPLETE RESTORE** (drops all data, recreates everything)
- `1_schema_create_or_alter_CORRECTED.sql` - Database schema (36 tables, functions, constraints)
- `2_data_upsert.sql` - Database data with conflict resolution
- `0_add_missing_columns.sql` - Quick fix for missing columns only
- `README.md` - This instruction file

## Usage Instructions

### Option A: FULL DATABASE RESTORE (Recommended)
```sql
-- ⚠️ WARNING: This will DELETE ALL existing data!
-- Execute in pgAdmin or psql on Railway database:
\i 'FULL_DATABASE_RESTORE.sql'
```

**Features:**
- **Complete clean restore** - drops everything and recreates from scratch
- **Single script** - no need to run multiple files
- **All 36 tables** with complete structure and data
- **Sequence synchronization** - auto-incrementing IDs work correctly
- **Built-in verification** - shows completion status and record counts
- **Size**: 397KB complete restore script

### Option B: Incremental Update (If tables exist)
```sql
-- 1. First: Create/update schema (36 tables)
\i '1_schema_create_or_alter_CORRECTED.sql'

-- 2. Second: Insert/update data
\i '2_data_upsert.sql'
```

**Features:**
- Uses `CREATE TABLE IF NOT EXISTS` - won't overwrite existing tables
- Uses `INSERT ... ON CONFLICT (id) DO NOTHING` - prevents duplicates
- Safe to run multiple times
- Updates existing database without losing data

### Option C: Quick Column Fix (Emergency)
```sql
-- If you just need missing columns added:
\i '0_add_missing_columns.sql'
\i '2_data_upsert.sql'
```

## Database Information
- **Source**: Local PostgreSQL (localhost:5432/aistudio_db)
- **Tables**: 36 tables
- **Generated**: Fri Sep 26 11:30:22 IDT 2025
- **Schema Size**: ~ 
- **Data Size**: ~

## Execution Order
1. Run schema script first to create tables
2. Run data script second to populate tables
3. Verify with queries at end of data script

## Safety Features
- **No destructive operations** - won't drop existing data
- **Conflict resolution** - handles duplicate keys gracefully
- **Transaction safety** - can be run in transactions
- **Verification queries** - shows results after execution

## Usage in Different Tools

### pgAdmin
1. Open Query Tool
2. File → Open → Select script
3. Execute (F5)

### psql Command Line
```bash
psql -d your_database -f 1_schema_create_or_alter.sql
psql -d your_database -f 2_data_upsert.sql
```

### Railway Database
These scripts can be executed on Railway PostgreSQL to replicate the local database structure and data.

