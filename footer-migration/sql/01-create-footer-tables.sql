-- ============================================================================
-- FOOTER MIGRATION: CREATE TABLES
-- Version: 1.0.0
-- Date: 2024
-- Description: Creates dedicated footer tables for centralized footer management
-- ============================================================================

-- Drop existing tables if they exist (for clean installation)
DROP TABLE IF EXISTS footer_content CASCADE;
DROP TABLE IF EXISTS footer_navigation_menus CASCADE;
DROP TABLE IF EXISTS footer_social_links CASCADE;
DROP TABLE IF EXISTS footer_newsletter_config CASCADE;
DROP TABLE IF EXISTS footer_audit_log CASCADE;

-- ============================================================================
-- 1. MAIN FOOTER CONTENT TABLE
-- ============================================================================
CREATE TABLE footer_content (
    id SERIAL PRIMARY KEY,
    locale VARCHAR(5) NOT NULL DEFAULT 'en',
    
    -- Company Information
    company_name VARCHAR(255) DEFAULT 'AI Studio',
    company_description TEXT DEFAULT 'Elevate tech career with expert-led courses. If you''re just aiming to advance skills, practical training is designed.',
    company_logo_url VARCHAR(500) DEFAULT '/images/Logo.svg',
    company_tagline VARCHAR(255),
    
    -- Contact Information
    contact_email VARCHAR(255) DEFAULT 'contact@aistudio555.com',
    contact_phone VARCHAR(50),
    contact_address TEXT,
    support_email VARCHAR(255) DEFAULT 'support@aistudio555.com',
    sales_email VARCHAR(255) DEFAULT 'sales@aistudio555.com',
    
    -- Copyright & Legal
    copyright_text TEXT DEFAULT '© 2024 AI Studio. All rights reserved.',
    privacy_policy_url VARCHAR(500) DEFAULT '/privacy-policy',
    terms_of_service_url VARCHAR(500) DEFAULT '/terms-of-service',
    cookie_policy_url VARCHAR(500) DEFAULT '/cookie-policy',
    
    -- Newsletter Configuration
    newsletter_enabled BOOLEAN DEFAULT true,
    newsletter_title VARCHAR(255) DEFAULT 'Subscribe to Newsletter',
    newsletter_subtitle TEXT DEFAULT 'Get the latest courses and updates delivered to your inbox',
    newsletter_placeholder VARCHAR(255) DEFAULT 'Enter email to subscribe',
    newsletter_button_text VARCHAR(100) DEFAULT 'Subscribe',
    newsletter_success_message TEXT DEFAULT 'Thank you for subscribing!',
    newsletter_error_message TEXT DEFAULT 'Something went wrong. Please try again.',
    
    -- Feature Flags
    show_social_links BOOLEAN DEFAULT true,
    show_newsletter BOOLEAN DEFAULT true,
    show_contact_info BOOLEAN DEFAULT true,
    show_navigation BOOLEAN DEFAULT true,
    show_company_info BOOLEAN DEFAULT true,
    
    -- Metadata
    version INT DEFAULT 1,
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    
    -- Unique constraint on locale
    CONSTRAINT unique_locale UNIQUE(locale)
);

-- ============================================================================
-- 2. FOOTER NAVIGATION MENUS TABLE
-- ============================================================================
CREATE TABLE footer_navigation_menus (
    id SERIAL PRIMARY KEY,
    locale VARCHAR(5) NOT NULL DEFAULT 'en',
    menu_type VARCHAR(50) NOT NULL, -- 'main', 'courses', 'company', 'support', 'utility'
    menu_title VARCHAR(100),
    display_order INT DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    
    -- Menu items stored as JSONB for flexibility
    menu_items JSONB DEFAULT '[]'::jsonb,
    /* Example structure:
    [
        {
            "text": "Home",
            "url": "/home.html",
            "target": "_self",
            "icon": "home",
            "order": 1,
            "visible": true
        },
        {
            "text": "About Us",
            "url": "/about.html",
            "target": "_self",
            "order": 2,
            "visible": true
        }
    ]
    */
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Composite unique constraint
    CONSTRAINT unique_locale_menu UNIQUE(locale, menu_type)
);

-- ============================================================================
-- 3. FOOTER SOCIAL LINKS TABLE
-- ============================================================================
CREATE TABLE footer_social_links (
    id SERIAL PRIMARY KEY,
    locale VARCHAR(5) NOT NULL DEFAULT 'en',
    platform VARCHAR(50) NOT NULL, -- 'facebook', 'twitter', 'linkedin', etc.
    
    -- Social Media Details
    url VARCHAR(500),
    icon_class VARCHAR(100), -- Font Awesome or custom icon class
    icon_svg TEXT, -- Optional SVG icon
    display_text VARCHAR(100),
    tooltip VARCHAR(255),
    display_order INT DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    opens_new_tab BOOLEAN DEFAULT true,
    
    -- Analytics
    tracking_code VARCHAR(255), -- For UTM or analytics tracking
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Composite unique constraint
    CONSTRAINT unique_locale_platform UNIQUE(locale, platform)
);

-- ============================================================================
-- 4. FOOTER NEWSLETTER CONFIGURATION TABLE
-- ============================================================================
CREATE TABLE footer_newsletter_config (
    id SERIAL PRIMARY KEY,
    locale VARCHAR(5) NOT NULL DEFAULT 'en',
    
    -- Email Service Configuration
    service_provider VARCHAR(50) DEFAULT 'emailjs', -- 'emailjs', 'mailchimp', 'sendgrid'
    api_endpoint VARCHAR(500),
    api_key_encrypted TEXT, -- Encrypted API key
    list_id VARCHAR(100),
    template_id VARCHAR(100),
    
    -- Form Configuration
    form_fields JSONB DEFAULT '[]'::jsonb,
    /* Example structure:
    [
        {
            "name": "email",
            "type": "email",
            "required": true,
            "placeholder": "Enter your email",
            "validation": "email"
        },
        {
            "name": "name",
            "type": "text",
            "required": false,
            "placeholder": "Your name (optional)"
        }
    ]
    */
    
    -- GDPR & Compliance
    gdpr_consent_required BOOLEAN DEFAULT true,
    gdpr_consent_text TEXT DEFAULT 'I agree to receive marketing emails and accept the privacy policy',
    double_opt_in BOOLEAN DEFAULT false,
    
    -- Rate Limiting
    max_submissions_per_ip INT DEFAULT 5,
    rate_limit_window_minutes INT DEFAULT 60,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_newsletter_locale UNIQUE(locale)
);

-- ============================================================================
-- 5. FOOTER AUDIT LOG TABLE (For tracking changes)
-- ============================================================================
CREATE TABLE footer_audit_log (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    record_id INT NOT NULL,
    action VARCHAR(20) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    locale VARCHAR(5),
    
    -- Change details
    old_values JSONB,
    new_values JSONB,
    changed_fields TEXT[],
    
    -- User information
    user_id VARCHAR(100),
    user_email VARCHAR(255),
    user_ip VARCHAR(45),
    user_agent TEXT,
    
    -- Timestamp
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX idx_footer_content_locale ON footer_content(locale);
CREATE INDEX idx_footer_content_published ON footer_content(published);
CREATE INDEX idx_footer_nav_locale ON footer_navigation_menus(locale);
CREATE INDEX idx_footer_nav_visible ON footer_navigation_menus(is_visible);
CREATE INDEX idx_footer_social_locale ON footer_social_links(locale);
CREATE INDEX idx_footer_social_visible ON footer_social_links(is_visible);
CREATE INDEX idx_footer_newsletter_locale ON footer_newsletter_config(locale);
CREATE INDEX idx_footer_audit_created ON footer_audit_log(created_at DESC);
CREATE INDEX idx_footer_audit_table ON footer_audit_log(table_name, record_id);

-- ============================================================================
-- TRIGGERS FOR AUTOMATIC TIMESTAMP UPDATES
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_footer_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables
CREATE TRIGGER update_footer_content_updated_at
    BEFORE UPDATE ON footer_content
    FOR EACH ROW
    EXECUTE FUNCTION update_footer_updated_at();

CREATE TRIGGER update_footer_nav_updated_at
    BEFORE UPDATE ON footer_navigation_menus
    FOR EACH ROW
    EXECUTE FUNCTION update_footer_updated_at();

CREATE TRIGGER update_footer_social_updated_at
    BEFORE UPDATE ON footer_social_links
    FOR EACH ROW
    EXECUTE FUNCTION update_footer_updated_at();

CREATE TRIGGER update_footer_newsletter_updated_at
    BEFORE UPDATE ON footer_newsletter_config
    FOR EACH ROW
    EXECUTE FUNCTION update_footer_updated_at();

-- ============================================================================
-- AUDIT TRIGGER FUNCTION
-- ============================================================================
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
        
        -- Find changed fields
        SELECT array_agg(key) INTO changed_fields
        FROM jsonb_each(old_json) o
        FULL OUTER JOIN jsonb_each(new_json) n USING (key)
        WHERE o.value IS DISTINCT FROM n.value;
    END IF;
    
    -- Insert audit record
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
        current_setting('app.current_user', true),
        CURRENT_TIMESTAMP
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers to main tables
CREATE TRIGGER audit_footer_content_changes
    AFTER INSERT OR UPDATE OR DELETE ON footer_content
    FOR EACH ROW
    EXECUTE FUNCTION audit_footer_changes();

CREATE TRIGGER audit_footer_nav_changes
    AFTER INSERT OR UPDATE OR DELETE ON footer_navigation_menus
    FOR EACH ROW
    EXECUTE FUNCTION audit_footer_changes();

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================
COMMENT ON TABLE footer_content IS 'Main footer content configuration for all locales';
COMMENT ON TABLE footer_navigation_menus IS 'Footer navigation menu configurations';
COMMENT ON TABLE footer_social_links IS 'Social media links for footer';
COMMENT ON TABLE footer_newsletter_config IS 'Newsletter service configuration for footer';
COMMENT ON TABLE footer_audit_log IS 'Audit trail for all footer-related changes';

COMMENT ON COLUMN footer_content.locale IS 'Language locale (en, ru, he)';
COMMENT ON COLUMN footer_navigation_menus.menu_type IS 'Type of menu: main, courses, company, support, utility';
COMMENT ON COLUMN footer_social_links.platform IS 'Social media platform identifier';
COMMENT ON COLUMN footer_newsletter_config.service_provider IS 'Email service provider: emailjs, mailchimp, sendgrid';

-- ============================================================================
-- GRANT PERMISSIONS (Adjust based on your user roles)
-- ============================================================================
-- GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_user;
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO app_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_user;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================
DO $$
BEGIN
    RAISE NOTICE 'Footer tables created successfully!';
    RAISE NOTICE 'Tables created: footer_content, footer_navigation_menus, footer_social_links, footer_newsletter_config, footer_audit_log';
    RAISE NOTICE 'Next step: Run 02-insert-default-data.sql to populate with default content';
END $$;