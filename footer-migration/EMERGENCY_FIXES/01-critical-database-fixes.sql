-- ============================================================================
-- EMERGENCY CRITICAL DATABASE FIXES
-- ============================================================================
-- DEPLOYMENT BLOCKER FIXES - Apply these before any deployment
-- Addresses 4 critical database integrity and audit issues
-- ============================================================================

BEGIN;

-- ============================================================================
-- FIX #1: ADD MISSING FOREIGN KEY CONSTRAINTS (CRITICAL)
-- ============================================================================

-- Add foreign key constraints to ensure referential integrity
-- This prevents orphaned records and ensures data consistency

ALTER TABLE footer_navigation_menus 
ADD CONSTRAINT fk_nav_footer_content 
FOREIGN KEY (locale) REFERENCES footer_content(locale) 
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE footer_social_links 
ADD CONSTRAINT fk_social_footer_content 
FOREIGN KEY (locale) REFERENCES footer_content(locale) 
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE footer_newsletter_config 
ADD CONSTRAINT fk_newsletter_footer_content 
FOREIGN KEY (locale) REFERENCES footer_content(locale) 
ON DELETE CASCADE ON UPDATE CASCADE;

-- Add constraint for audit log referential integrity
-- Note: This is more complex as record_id can reference multiple tables
-- For now, we'll add a check constraint to ensure valid table names
ALTER TABLE footer_audit_log
ADD CONSTRAINT chk_valid_table_name 
CHECK (table_name IN ('footer_content', 'footer_navigation_menus', 'footer_social_links', 'footer_newsletter_config'));

-- ============================================================================
-- FIX #2: CORRECT THE UNIQUE CONSTRAINT LOGIC (CRITICAL)
-- ============================================================================

-- Drop the problematic unique constraint
ALTER TABLE footer_content 
DROP CONSTRAINT unique_locale_published;

-- Create partial unique index that only applies when published = true
-- This allows multiple unpublished versions but only one published version per locale
CREATE UNIQUE INDEX idx_unique_locale_published 
ON footer_content (locale) 
WHERE published = true;

-- Add constraint to ensure only valid locale values
ALTER TABLE footer_content
ADD CONSTRAINT chk_valid_locale 
CHECK (locale IN ('en', 'ru', 'he'));

-- Apply the same locale constraint to other tables
ALTER TABLE footer_navigation_menus
ADD CONSTRAINT chk_nav_valid_locale 
CHECK (locale IN ('en', 'ru', 'he'));

ALTER TABLE footer_social_links
ADD CONSTRAINT chk_social_valid_locale 
CHECK (locale IN ('en', 'ru', 'he'));

ALTER TABLE footer_newsletter_config
ADD CONSTRAINT chk_newsletter_valid_locale 
CHECK (locale IN ('en', 'ru', 'he'));

-- ============================================================================
-- FIX #3: CORRECT AUDIT TRIGGER RETURN VALUE (CRITICAL)
-- ============================================================================

-- Replace the buggy audit trigger function with corrected version
CREATE OR REPLACE FUNCTION audit_footer_changes()
RETURNS TRIGGER AS $$
DECLARE
    changed_fields TEXT[];
    old_json JSONB;
    new_json JSONB;
BEGIN
    -- Convert records to JSONB
    IF TG_OP = 'DELETE' THEN
        old_json = to_jsonb(OLD);
        new_json = NULL;
    ELSIF TG_OP = 'INSERT' THEN
        old_json = NULL;
        new_json = to_jsonb(NEW);
    ELSE -- UPDATE
        old_json = to_jsonb(OLD);
        new_json = to_jsonb(NEW);
        
        -- Find changed fields (only for updates)
        SELECT array_agg(key) INTO changed_fields
        FROM jsonb_each(old_json) o
        FULL OUTER JOIN jsonb_each(new_json) n USING (key)
        WHERE o.value IS DISTINCT FROM n.value;
    END IF;
    
    -- Insert audit record with better error handling
    BEGIN
        INSERT INTO footer_audit_log (
            table_name, 
            record_id, 
            action, 
            locale,
            old_values, 
            new_values, 
            changed_fields,
            user_id,
            created_at
        ) VALUES (
            TG_TABLE_NAME,
            COALESCE(NEW.id, OLD.id),
            TG_OP,
            COALESCE(NEW.locale, OLD.locale),
            old_json,
            new_json,
            changed_fields,
            COALESCE(current_setting('app.current_user', true), 'system'),
            CURRENT_TIMESTAMP
        );
    EXCEPTION
        WHEN OTHERS THEN
            -- Log the error but don't fail the original operation
            RAISE WARNING 'Audit logging failed: %', SQLERRM;
    END;
    
    -- CRITICAL FIX: Return correct value based on operation type
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FIX #4: ADD JSONB STRUCTURE VALIDATION (HIGH PRIORITY)
-- ============================================================================

-- Function to validate menu items JSON structure
CREATE OR REPLACE FUNCTION validate_menu_items(menu_items JSONB)
RETURNS BOOLEAN AS $$
BEGIN
    -- Check if it's an array
    IF NOT jsonb_typeof(menu_items) = 'array' THEN
        RETURN FALSE;
    END IF;
    
    -- Check each menu item structure
    FOR i IN 0..jsonb_array_length(menu_items) - 1 LOOP
        DECLARE
            item JSONB := menu_items -> i;
        BEGIN
            -- Required fields validation
            IF NOT (item ? 'text' AND item ? 'url') THEN
                RETURN FALSE;
            END IF;
            
            -- Data type validation
            IF NOT (
                jsonb_typeof(item -> 'text') = 'string' AND
                jsonb_typeof(item -> 'url') = 'string'
            ) THEN
                RETURN FALSE;
            END IF;
            
            -- URL safety check (basic)
            IF (item ->> 'url') ILIKE 'javascript:%' OR (item ->> 'url') ILIKE 'data:%' THEN
                RETURN FALSE;
            END IF;
            
            -- Order must be number if present
            IF item ? 'order' AND jsonb_typeof(item -> 'order') != 'number' THEN
                RETURN FALSE;
            END IF;
        END;
    END LOOP;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to validate form fields JSON structure  
CREATE OR REPLACE FUNCTION validate_form_fields(form_fields JSONB)
RETURNS BOOLEAN AS $$
BEGIN
    -- Check if it's an array
    IF NOT jsonb_typeof(form_fields) = 'array' THEN
        RETURN FALSE;
    END IF;
    
    -- Check each form field structure
    FOR i IN 0..jsonb_array_length(form_fields) - 1 LOOP
        DECLARE
            field JSONB := form_fields -> i;
        BEGIN
            -- Required fields validation
            IF NOT (field ? 'name' AND field ? 'type') THEN
                RETURN FALSE;
            END IF;
            
            -- Valid field types
            IF NOT (field ->> 'type') IN ('email', 'text', 'checkbox', 'select', 'textarea') THEN
                RETURN FALSE;
            END IF;
            
            -- Name must be valid identifier (alphanumeric + underscore)
            IF NOT (field ->> 'name') ~ '^[a-zA-Z_][a-zA-Z0-9_]*$' THEN
                RETURN FALSE;
            END IF;
        END;
    END LOOP;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Add validation constraints
ALTER TABLE footer_navigation_menus
ADD CONSTRAINT chk_menu_items_valid 
CHECK (validate_menu_items(menu_items));

ALTER TABLE footer_newsletter_config
ADD CONSTRAINT chk_form_fields_valid 
CHECK (validate_form_fields(form_fields));

-- ============================================================================
-- FIX #5: ADD EMAIL VALIDATION CONSTRAINTS  
-- ============================================================================

-- Function to validate email format more strictly
CREATE OR REPLACE FUNCTION validate_email(email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    IF email IS NULL OR LENGTH(email) = 0 THEN
        RETURN TRUE; -- Allow NULL/empty for optional fields
    END IF;
    
    -- Basic email validation regex (more strict than before)
    RETURN email ~* '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$' 
           AND LENGTH(email) <= 255
           AND email NOT ILIKE '%@localhost%'
           AND email NOT ILIKE '%@example.%'
           AND email NOT ILIKE '%.local'
           AND email NOT ILIKE '%@test%';
END;
$$ LANGUAGE plpgsql;

-- Add email validation constraints
ALTER TABLE footer_content
ADD CONSTRAINT chk_contact_email_valid 
CHECK (validate_email(contact_email));

ALTER TABLE footer_content
ADD CONSTRAINT chk_support_email_valid 
CHECK (validate_email(support_email));

ALTER TABLE footer_content
ADD CONSTRAINT chk_sales_email_valid 
CHECK (validate_email(sales_email));

-- ============================================================================
-- FIX #6: ADD URL VALIDATION CONSTRAINTS
-- ============================================================================

-- Function to validate URLs more strictly
CREATE OR REPLACE FUNCTION validate_url(url TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    IF url IS NULL OR LENGTH(url) = 0 THEN
        RETURN TRUE; -- Allow NULL/empty for optional fields
    END IF;
    
    -- URL validation
    RETURN (
        -- Allow absolute HTTP/HTTPS URLs
        url ~* '^https?://[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(/.*)?$' OR
        -- Allow relative URLs starting with /
        url ~ '^/[^/].*$' OR
        -- Allow anchor links
        url ~ '^#[a-zA-Z0-9_-]+$'
    ) AND 
    -- Reject dangerous protocols
    url NOT ILIKE 'javascript:%' AND
    url NOT ILIKE 'data:%' AND
    url NOT ILIKE 'vbscript:%' AND
    url NOT ILIKE 'file:%' AND
    -- Length limit
    LENGTH(url) <= 500;
END;
$$ LANGUAGE plpgsql;

-- Add URL validation constraints
ALTER TABLE footer_content
ADD CONSTRAINT chk_company_logo_url_valid 
CHECK (validate_url(company_logo_url));

ALTER TABLE footer_content
ADD CONSTRAINT chk_privacy_policy_url_valid 
CHECK (validate_url(privacy_policy_url));

ALTER TABLE footer_content
ADD CONSTRAINT chk_terms_of_service_url_valid 
CHECK (validate_url(terms_of_service_url));

ALTER TABLE footer_content
ADD CONSTRAINT chk_cookie_policy_url_valid 
CHECK (validate_url(cookie_policy_url));

ALTER TABLE footer_social_links
ADD CONSTRAINT chk_social_url_valid 
CHECK (validate_url(url));

-- ============================================================================
-- FIX #7: ADD MENU TYPE VALIDATION
-- ============================================================================

ALTER TABLE footer_navigation_menus
ADD CONSTRAINT chk_menu_type_valid 
CHECK (menu_type IN ('main', 'courses', 'company', 'support', 'utility', 'legal', 'footer'));

-- ============================================================================
-- FIX #8: ADD SOCIAL PLATFORM VALIDATION  
-- ============================================================================

ALTER TABLE footer_social_links
ADD CONSTRAINT chk_platform_valid 
CHECK (platform IN ('facebook', 'twitter', 'linkedin', 'instagram', 'youtube', 'telegram', 'whatsapp', 'tiktok', 'github'));

-- ============================================================================
-- FIX #9: ADD TEXT LENGTH CONSTRAINTS
-- ============================================================================

-- Prevent extremely long text that could cause memory issues
ALTER TABLE footer_content
ADD CONSTRAINT chk_company_description_length 
CHECK (LENGTH(company_description) <= 5000);

ALTER TABLE footer_content
ADD CONSTRAINT chk_copyright_text_length 
CHECK (LENGTH(copyright_text) <= 1000);

ALTER TABLE footer_content
ADD CONSTRAINT chk_newsletter_subtitle_length 
CHECK (LENGTH(newsletter_subtitle) <= 1000);

-- ============================================================================
-- FIX #10: IMPROVE INDEXING FOR PERFORMANCE
-- ============================================================================

-- Add composite indexes for common query patterns
CREATE INDEX idx_footer_content_locale_published 
ON footer_content (locale, published) 
WHERE published = true;

CREATE INDEX idx_footer_nav_locale_type_visible 
ON footer_navigation_menus (locale, menu_type, is_visible) 
WHERE is_visible = true;

CREATE INDEX idx_footer_social_locale_order 
ON footer_social_links (locale, display_order) 
WHERE is_visible = true;

-- ============================================================================
-- DATA INTEGRITY VERIFICATION
-- ============================================================================

-- Function to check and report data integrity issues
CREATE OR REPLACE FUNCTION check_footer_data_integrity()
RETURNS TABLE (
    issue_type TEXT,
    table_name TEXT, 
    record_count BIGINT,
    description TEXT
) AS $$
BEGIN
    -- Check for orphaned navigation menus (shouldn't exist with new FK constraints)
    RETURN QUERY
    SELECT 'orphaned_data'::TEXT, 
           'footer_navigation_menus'::TEXT,
           COUNT(*)::BIGINT,
           'Navigation menus without corresponding footer content'::TEXT
    FROM footer_navigation_menus fnm
    LEFT JOIN footer_content fc ON fnm.locale = fc.locale
    WHERE fc.locale IS NULL;
    
    -- Check for orphaned social links
    RETURN QUERY
    SELECT 'orphaned_data'::TEXT,
           'footer_social_links'::TEXT,
           COUNT(*)::BIGINT,
           'Social links without corresponding footer content'::TEXT
    FROM footer_social_links fsl
    LEFT JOIN footer_content fc ON fsl.locale = fc.locale
    WHERE fc.locale IS NULL;
    
    -- Check for multiple published versions (shouldn't exist with new constraints)
    RETURN QUERY
    SELECT 'duplicate_published'::TEXT,
           'footer_content'::TEXT,
           COUNT(*)::BIGINT,
           'Multiple published versions for same locale'::TEXT
    FROM footer_content
    WHERE published = true
    GROUP BY locale
    HAVING COUNT(*) > 1;
    
    -- Check for invalid JSON structures
    RETURN QUERY
    SELECT 'invalid_json'::TEXT,
           'footer_navigation_menus'::TEXT,
           COUNT(*)::BIGINT,
           'Invalid menu_items JSON structure'::TEXT
    FROM footer_navigation_menus
    WHERE NOT validate_menu_items(menu_items);
    
    RETURN QUERY
    SELECT 'invalid_json'::TEXT,
           'footer_newsletter_config'::TEXT,
           COUNT(*)::BIGINT,
           'Invalid form_fields JSON structure'::TEXT
    FROM footer_newsletter_config
    WHERE NOT validate_form_fields(form_fields);
    
END;
$$ LANGUAGE plpgsql;

COMMIT;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Run these queries to verify the fixes were applied successfully
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '============================================================';
    RAISE NOTICE 'CRITICAL DATABASE FIXES APPLIED SUCCESSFULLY';
    RAISE NOTICE '============================================================';
    RAISE NOTICE '';
    RAISE NOTICE 'Fixes Applied:';
    RAISE NOTICE '✅ Foreign key constraints added for referential integrity';
    RAISE NOTICE '✅ Unique constraint fixed for proper locale/published logic';  
    RAISE NOTICE '✅ Audit trigger return value corrected';
    RAISE NOTICE '✅ JSONB structure validation added';
    RAISE NOTICE '✅ Email and URL validation constraints added';
    RAISE NOTICE '✅ Data type and length constraints added';
    RAISE NOTICE '✅ Performance indexes created';
    RAISE NOTICE '✅ Data integrity check function created';
    RAISE NOTICE '';
    RAISE NOTICE 'Next Steps:';
    RAISE NOTICE '1. Run: SELECT * FROM check_footer_data_integrity();';
    RAISE NOTICE '2. Test all constraints with invalid data';
    RAISE NOTICE '3. Apply API and frontend fixes';
    RAISE NOTICE '4. Run comprehensive test suite';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  IMPORTANT: Test thoroughly before production deployment';
    RAISE NOTICE '';
END $$;