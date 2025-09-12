-- ============================================================================
-- FOOTER MIGRATION ROLLBACK SCRIPT
-- Version: 1.0.0
-- Date: 2024
-- Description: Safely rolls back footer migration changes
-- ============================================================================

-- WARNING: This script will remove all footer tables and data!
-- Make sure you have proper backups before running this script.

-- ============================================================================
-- SAFETY CHECKS
-- ============================================================================

-- Check if we're in production (adjust this condition based on your setup)
DO $$
DECLARE
    is_production BOOLEAN := FALSE;
BEGIN
    -- Detect if this is production environment
    SELECT CASE 
        WHEN current_database() ILIKE '%prod%' OR 
             current_database() ILIKE '%production%' OR
             current_setting('server_version') ILIKE '%railway%'
        THEN TRUE 
        ELSE FALSE 
    END INTO is_production;
    
    IF is_production THEN
        RAISE EXCEPTION 'ROLLBACK BLOCKED: This appears to be a production environment. Please review and modify this script before proceeding.';
    END IF;
    
    RAISE NOTICE 'Environment check passed. Proceeding with rollback...';
END $$;

-- ============================================================================
-- PRE-ROLLBACK BACKUP
-- ============================================================================

-- Create backup tables with current timestamp
DO $$
DECLARE
    backup_suffix TEXT := '_backup_' || to_char(now(), 'YYYYMMDD_HH24MISS');
    table_name TEXT;
    backup_table TEXT;
    row_count INTEGER;
BEGIN
    RAISE NOTICE 'Creating backup tables before rollback...';
    
    -- List of footer tables to backup
    FOR table_name IN 
        SELECT unnest(ARRAY['footer_content', 'footer_navigation_menus', 'footer_social_links', 'footer_newsletter_config', 'footer_audit_log'])
    LOOP
        -- Check if table exists
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = table_name AND table_schema = 'public') THEN
            backup_table := table_name || backup_suffix;
            
            -- Create backup table
            EXECUTE format('CREATE TABLE %I AS SELECT * FROM %I', backup_table, table_name);
            
            -- Get row count
            EXECUTE format('SELECT COUNT(*) FROM %I', backup_table) INTO row_count;
            
            RAISE NOTICE 'Created backup table: % (% rows)', backup_table, row_count;
        ELSE
            RAISE NOTICE 'Table % does not exist, skipping backup', table_name;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Backup completed successfully!';
END $$;

-- ============================================================================
-- ROLLBACK EXECUTION LOG
-- ============================================================================

-- Create rollback log table
CREATE TABLE IF NOT EXISTS rollback_execution_log (
    id SERIAL PRIMARY KEY,
    rollback_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    rollback_type VARCHAR(100),
    table_name VARCHAR(100),
    action VARCHAR(50),
    rows_affected INTEGER,
    success BOOLEAN,
    error_message TEXT,
    executed_by VARCHAR(100)
);

-- ============================================================================
-- STEP 1: DISABLE TRIGGERS AND CONSTRAINTS
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE 'Disabling triggers and constraints...';
    
    -- Disable all triggers temporarily
    SET session_replication_role = replica;
    
    INSERT INTO rollback_execution_log (rollback_type, action, success) 
    VALUES ('footer_migration_rollback', 'disable_triggers', TRUE);
    
    RAISE NOTICE 'Triggers and constraints disabled.';
END $$;

-- ============================================================================
-- STEP 2: DROP FOOTER AUDIT TRIGGERS
-- ============================================================================

DO $$
DECLARE
    trigger_name TEXT;
BEGIN
    RAISE NOTICE 'Dropping footer audit triggers...';
    
    -- Drop audit triggers
    FOR trigger_name IN 
        SELECT trigger_name 
        FROM information_schema.triggers 
        WHERE trigger_name ILIKE '%footer%audit%'
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS %I ON %I CASCADE', 
            trigger_name, 
            (SELECT event_object_table FROM information_schema.triggers WHERE trigger_name = trigger_name LIMIT 1)
        );
        RAISE NOTICE 'Dropped trigger: %', trigger_name;
    END LOOP;
    
    INSERT INTO rollback_execution_log (rollback_type, action, success) 
    VALUES ('footer_migration_rollback', 'drop_triggers', TRUE);
    
EXCEPTION WHEN OTHERS THEN
    INSERT INTO rollback_execution_log (rollback_type, action, success, error_message) 
    VALUES ('footer_migration_rollback', 'drop_triggers', FALSE, SQLERRM);
    RAISE WARNING 'Error dropping triggers: %', SQLERRM;
END $$;

-- ============================================================================
-- STEP 3: DROP FOOTER FUNCTIONS
-- ============================================================================

DO $$
DECLARE
    function_name TEXT;
BEGIN
    RAISE NOTICE 'Dropping footer-related functions...';
    
    -- Drop footer functions
    DROP FUNCTION IF EXISTS update_footer_updated_at() CASCADE;
    DROP FUNCTION IF EXISTS audit_footer_changes() CASCADE;
    
    RAISE NOTICE 'Footer functions dropped.';
    
    INSERT INTO rollback_execution_log (rollback_type, action, success) 
    VALUES ('footer_migration_rollback', 'drop_functions', TRUE);
    
EXCEPTION WHEN OTHERS THEN
    INSERT INTO rollback_execution_log (rollback_type, action, success, error_message) 
    VALUES ('footer_migration_rollback', 'drop_functions', FALSE, SQLERRM);
    RAISE WARNING 'Error dropping functions: %', SQLERRM;
END $$;

-- ============================================================================
-- STEP 4: DROP FOOTER TABLES
-- ============================================================================

DO $$
DECLARE
    table_name TEXT;
    row_count INTEGER;
BEGIN
    RAISE NOTICE 'Dropping footer tables...';
    
    -- List of footer tables to drop (in dependency order)
    FOR table_name IN 
        SELECT unnest(ARRAY['footer_audit_log', 'footer_newsletter_config', 'footer_social_links', 'footer_navigation_menus', 'footer_content'])
    LOOP
        -- Check if table exists and get row count
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = table_name AND table_schema = 'public') THEN
            EXECUTE format('SELECT COUNT(*) FROM %I', table_name) INTO row_count;
            
            -- Drop the table
            EXECUTE format('DROP TABLE IF EXISTS %I CASCADE', table_name);
            
            RAISE NOTICE 'Dropped table: % (had % rows)', table_name, row_count;
            
            INSERT INTO rollback_execution_log (rollback_type, table_name, action, rows_affected, success) 
            VALUES ('footer_migration_rollback', table_name, 'drop_table', row_count, TRUE);
        ELSE
            RAISE NOTICE 'Table % does not exist, skipping', table_name;
            
            INSERT INTO rollback_execution_log (rollback_type, table_name, action, success) 
            VALUES ('footer_migration_rollback', table_name, 'table_not_found', TRUE);
        END IF;
    END LOOP;
    
EXCEPTION WHEN OTHERS THEN
    INSERT INTO rollback_execution_log (rollback_type, table_name, action, success, error_message) 
    VALUES ('footer_migration_rollback', table_name, 'drop_table_error', FALSE, SQLERRM);
    RAISE WARNING 'Error dropping table %: %', table_name, SQLERRM;
END $$;

-- ============================================================================
-- STEP 5: CLEAN UP SEQUENCES
-- ============================================================================

DO $$
DECLARE
    sequence_name TEXT;
BEGIN
    RAISE NOTICE 'Cleaning up footer-related sequences...';
    
    -- Drop sequences if they exist
    FOR sequence_name IN 
        SELECT sequence_name 
        FROM information_schema.sequences 
        WHERE sequence_name ILIKE '%footer%'
    LOOP
        EXECUTE format('DROP SEQUENCE IF EXISTS %I CASCADE', sequence_name);
        RAISE NOTICE 'Dropped sequence: %', sequence_name;
    END LOOP;
    
    INSERT INTO rollback_execution_log (rollback_type, action, success) 
    VALUES ('footer_migration_rollback', 'drop_sequences', TRUE);
    
EXCEPTION WHEN OTHERS THEN
    INSERT INTO rollback_execution_log (rollback_type, action, success, error_message) 
    VALUES ('footer_migration_rollback', 'drop_sequences', FALSE, SQLERRM);
    RAISE WARNING 'Error dropping sequences: %', SQLERRM;
END $$;

-- ============================================================================
-- STEP 6: REMOVE FOOTER-RELATED INDEXES
-- ============================================================================

DO $$
DECLARE
    index_name TEXT;
BEGIN
    RAISE NOTICE 'Removing footer-related indexes...';
    
    -- Drop indexes that start with 'idx_footer'
    FOR index_name IN 
        SELECT indexname 
        FROM pg_indexes 
        WHERE indexname ILIKE 'idx_footer%'
    LOOP
        EXECUTE format('DROP INDEX IF EXISTS %I CASCADE', index_name);
        RAISE NOTICE 'Dropped index: %', index_name;
    END LOOP;
    
    INSERT INTO rollback_execution_log (rollback_type, action, success) 
    VALUES ('footer_migration_rollback', 'drop_indexes', TRUE);
    
EXCEPTION WHEN OTHERS THEN
    INSERT INTO rollback_execution_log (rollback_type, action, success, error_message) 
    VALUES ('footer_migration_rollback', 'drop_indexes', FALSE, SQLERRM);
    RAISE WARNING 'Error dropping indexes: %', SQLERRM;
END $$;

-- ============================================================================
-- STEP 7: RESTORE ORIGINAL STATE (OPTIONAL)
-- ============================================================================

-- Note: This section would restore footer data to original tables if needed
-- Uncomment and modify based on your original schema

/*
DO $$
BEGIN
    RAISE NOTICE 'Restoring original footer fields to career_orientation_page...';
    
    -- Example: If you need to restore footer fields to original tables
    -- ALTER TABLE career_orientation_page ADD COLUMN IF NOT EXISTS footer_company_name VARCHAR(255);
    -- ALTER TABLE career_orientation_page ADD COLUMN IF NOT EXISTS footer_company_description TEXT;
    -- ... add other footer fields as needed
    
    -- Restore data from backup if available
    -- INSERT INTO career_orientation_page (footer_field1, footer_field2, ...)
    -- SELECT field1, field2, ... FROM footer_content_backup_[timestamp];
    
    RAISE NOTICE 'Original state restoration completed (if applicable)';
    
EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Error during state restoration: %', SQLERRM;
END $$;
*/

-- ============================================================================
-- STEP 8: RE-ENABLE TRIGGERS AND CONSTRAINTS
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE 'Re-enabling triggers and constraints...';
    
    -- Re-enable all triggers
    SET session_replication_role = DEFAULT;
    
    INSERT INTO rollback_execution_log (rollback_type, action, success) 
    VALUES ('footer_migration_rollback', 'enable_triggers', TRUE);
    
    RAISE NOTICE 'Triggers and constraints re-enabled.';
END $$;

-- ============================================================================
-- STEP 9: CLEAN UP CACHE/TEMP DATA
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE 'Cleaning up temporary data...';
    
    -- Clear any cached footer data (if your app uses database-level caching)
    -- Example: DELETE FROM cache_table WHERE cache_key ILIKE '%footer%';
    
    -- Reset any footer-related configuration
    -- Example: UPDATE system_config SET value = 'false' WHERE key = 'enable_dynamic_footer';
    
    INSERT INTO rollback_execution_log (rollback_type, action, success) 
    VALUES ('footer_migration_rollback', 'cleanup', TRUE);
    
    RAISE NOTICE 'Cleanup completed.';
    
EXCEPTION WHEN OTHERS THEN
    INSERT INTO rollback_execution_log (rollback_type, action, success, error_message) 
    VALUES ('footer_migration_rollback', 'cleanup', FALSE, SQLERRM);
    RAISE WARNING 'Error during cleanup: %', SQLERRM;
END $$;

-- ============================================================================
-- ROLLBACK SUMMARY
-- ============================================================================

DO $$
DECLARE
    total_actions INTEGER;
    successful_actions INTEGER;
    failed_actions INTEGER;
    backup_tables TEXT[];
    backup_table TEXT;
BEGIN
    -- Get rollback statistics
    SELECT 
        COUNT(*),
        SUM(CASE WHEN success THEN 1 ELSE 0 END),
        SUM(CASE WHEN NOT success THEN 1 ELSE 0 END)
    INTO total_actions, successful_actions, failed_actions
    FROM rollback_execution_log 
    WHERE rollback_type = 'footer_migration_rollback'
    AND rollback_date >= (SELECT MAX(rollback_date) FROM rollback_execution_log) - INTERVAL '1 hour';
    
    -- Get list of backup tables created
    SELECT array_agg(table_name) INTO backup_tables
    FROM information_schema.tables 
    WHERE table_name ILIKE '%footer%backup%';
    
    RAISE NOTICE '';
    RAISE NOTICE '============================================================================';
    RAISE NOTICE '                    FOOTER MIGRATION ROLLBACK COMPLETED';
    RAISE NOTICE '============================================================================';
    RAISE NOTICE 'Rollback Date: %', CURRENT_TIMESTAMP;
    RAISE NOTICE 'Total Actions: %', total_actions;
    RAISE NOTICE 'Successful Actions: %', successful_actions;
    RAISE NOTICE 'Failed Actions: %', failed_actions;
    RAISE NOTICE '';
    
    IF backup_tables IS NOT NULL THEN
        RAISE NOTICE 'Backup Tables Created:';
        FOREACH backup_table IN ARRAY backup_tables LOOP
            RAISE NOTICE '  - %', backup_table;
        END LOOP;
        RAISE NOTICE '';
        RAISE NOTICE 'Note: Backup tables contain your footer data and can be used for recovery if needed.';
        RAISE NOTICE 'Consider dropping backup tables after confirming the rollback was successful.';
    ELSE
        RAISE NOTICE 'No backup tables were created (footer tables may not have existed).';
    END IF;
    
    IF failed_actions > 0 THEN
        RAISE NOTICE '';
        RAISE NOTICE 'WARNING: % actions failed during rollback. Check rollback_execution_log table for details.', failed_actions;
        RAISE NOTICE 'Query: SELECT * FROM rollback_execution_log WHERE success = FALSE ORDER BY rollback_date DESC;';
    END IF;
    
    RAISE NOTICE '';
    RAISE NOTICE 'Next Steps:';
    RAISE NOTICE '1. Verify your application works correctly without footer migration';
    RAISE NOTICE '2. Remove footer-related API endpoints from your server code';
    RAISE NOTICE '3. Remove footer-loader.js from your frontend';
    RAISE NOTICE '4. Remove footer admin panel integration';
    RAISE NOTICE '5. Clean up backup tables when no longer needed';
    RAISE NOTICE '';
    RAISE NOTICE 'Rollback completed successfully!';
    RAISE NOTICE '============================================================================';
END $$;

-- ============================================================================
-- POST-ROLLBACK VERIFICATION
-- ============================================================================

-- Verify no footer tables remain
DO $$
DECLARE
    remaining_tables INTEGER;
    table_list TEXT;
BEGIN
    SELECT COUNT(*), string_agg(table_name, ', ')
    INTO remaining_tables, table_list
    FROM information_schema.tables 
    WHERE table_name ILIKE '%footer%' 
    AND table_name NOT ILIKE '%backup%'
    AND table_schema = 'public';
    
    IF remaining_tables > 0 THEN
        RAISE WARNING 'Warning: % footer-related tables still exist: %', remaining_tables, table_list;
        RAISE NOTICE 'You may need to manually review and remove these tables.';
    ELSE
        RAISE NOTICE 'Verification passed: No footer tables remain in the database.';
    END IF;
END $$;

-- Final success message
SELECT 'Footer migration rollback completed successfully!' as rollback_status;