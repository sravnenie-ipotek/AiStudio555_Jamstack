-- AI Studio Local PostgreSQL Database Schema
-- Production Replica for Local Development
-- Generated: 2025-09-12

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================================
-- CORE CONTENT TABLES
-- ============================================================================

-- Home Pages Table
CREATE TABLE home_pages (
    id SERIAL PRIMARY KEY,
    locale TEXT DEFAULT 'en',
    title TEXT,
    hero_title TEXT,
    hero_subtitle TEXT,
    hero_description TEXT,
    hero_section_visible BOOLEAN DEFAULT true,
    featured_courses_title TEXT,
    featured_courses_description TEXT,
    featured_courses_visible BOOLEAN DEFAULT true,
    about_title TEXT,
    about_subtitle TEXT,
    about_description TEXT,
    about_visible BOOLEAN DEFAULT true,
    companies_title TEXT,
    companies_description TEXT,
    companies_visible BOOLEAN DEFAULT true,
    testimonials_title TEXT,
    testimonials_subtitle TEXT,
    testimonials_visible BOOLEAN DEFAULT true,
    courses JSONB,
    testimonials JSONB,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Courses Table
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    locale TEXT DEFAULT 'en',
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    duration TEXT,
    lessons TEXT,
    category TEXT,
    rating DECIMAL(3,1),
    visible BOOLEAN DEFAULT true,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Teachers Table
CREATE TABLE teachers (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT,
    bio TEXT,
    image_url TEXT,
    expertise TEXT,
    locale TEXT DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Blog Posts Table
CREATE TABLE blog_posts (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    excerpt TEXT,
    image_url TEXT,
    author TEXT,
    locale TEXT DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- About Pages Table
CREATE TABLE about_pages (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    mission TEXT,
    vision TEXT,
    company_values TEXT,
    locale TEXT DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Contact Pages Table
CREATE TABLE contact_pages (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    email TEXT,
    office_hours TEXT,
    locale TEXT DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- FAQs Table
CREATE TABLE faqs (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT,
    order_index INTEGER DEFAULT 0,
    locale TEXT DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Career Resources Table
CREATE TABLE career_resources (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    resource_type TEXT,
    resource_url TEXT,
    locale TEXT DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Career Center Pages Table
CREATE TABLE career_center_pages (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    services TEXT,
    programs TEXT,
    success_stories TEXT,
    locale TEXT DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Career Orientation Pages Table
CREATE TABLE career_orientation_pages (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    guidance_sections TEXT,
    assessment_tools TEXT,
    career_paths TEXT,
    locale TEXT DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Pricing Plans Table
CREATE TABLE pricing_plans (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    price DECIMAL(10,2),
    currency TEXT DEFAULT 'USD',
    features TEXT,
    recommended BOOLEAN DEFAULT false,
    locale TEXT DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Job Postings Table
CREATE TABLE job_postings (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT,
    description TEXT,
    requirements TEXT,
    location TEXT,
    salary_range TEXT,
    application_url TEXT,
    locale TEXT DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- SECURE FOOTER SYSTEM TABLES (Production Security Features)
-- ============================================================================

-- Footer Content Table with XSS Protection
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
    newsletter_signup_text TEXT DEFAULT 'Stay updated with our latest courses and career insights',
    newsletter_placeholder TEXT DEFAULT 'Enter your email address',
    newsletter_button_text TEXT DEFAULT 'Subscribe',
    newsletter_success_message TEXT DEFAULT 'Thank you for subscribing!',
    newsletter_error_message TEXT DEFAULT 'Please enter a valid email address.',
    
    -- Meta Information
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Security Constraints
    CONSTRAINT chk_contact_email_valid CHECK (
        contact_email IS NULL OR 
        (contact_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' AND 
         LENGTH(contact_email) <= 255 AND
         contact_email NOT LIKE '%@localhost%')
    ),
    CONSTRAINT chk_support_email_valid CHECK (
        support_email IS NULL OR 
        (support_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' AND 
         LENGTH(support_email) <= 255 AND
         support_email NOT LIKE '%@localhost%')
    ),
    CONSTRAINT chk_sales_email_valid CHECK (
        sales_email IS NULL OR 
        (sales_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' AND 
         LENGTH(sales_email) <= 255 AND
         sales_email NOT LIKE '%@localhost%')
    ),
    CONSTRAINT chk_url_safe CHECK (
        (company_logo_url IS NULL OR 
         (company_logo_url NOT LIKE '%javascript:%' AND 
          company_logo_url NOT LIKE '%data:text/html%' AND
          company_logo_url NOT LIKE '%<script%' AND
          LENGTH(company_logo_url) <= 500))
        AND
        (privacy_policy_url IS NULL OR 
         (privacy_policy_url NOT LIKE '%javascript:%' AND 
          privacy_policy_url NOT LIKE '%data:text/html%' AND
          privacy_policy_url NOT LIKE '%<script%' AND
          LENGTH(privacy_policy_url) <= 500))
    ),
    CONSTRAINT chk_locale_valid CHECK (locale IN ('en', 'ru', 'he'))
);

-- Footer Navigation Menus Table
CREATE TABLE footer_navigation_menus (
    id SERIAL PRIMARY KEY,
    footer_content_id INTEGER REFERENCES footer_content(id) ON DELETE CASCADE,
    locale VARCHAR(5) NOT NULL DEFAULT 'en',
    menu_type VARCHAR(50) NOT NULL, -- 'main', 'secondary', 'legal', etc.
    title VARCHAR(255) NOT NULL,
    items JSONB NOT NULL DEFAULT '[]',
    display_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Security constraints
    CONSTRAINT chk_menu_type_safe CHECK (
        menu_type ~ '^[a-zA-Z0-9_-]+$' AND 
        LENGTH(menu_type) <= 50
    ),
    CONSTRAINT chk_locale_valid_nav CHECK (locale IN ('en', 'ru', 'he'))
);

-- Footer Social Links Table
CREATE TABLE footer_social_links (
    id SERIAL PRIMARY KEY,
    footer_content_id INTEGER REFERENCES footer_content(id) ON DELETE CASCADE,
    locale VARCHAR(5) NOT NULL DEFAULT 'en',
    platform VARCHAR(50) NOT NULL,
    url VARCHAR(500) NOT NULL,
    icon_class VARCHAR(100),
    display_text VARCHAR(100),
    display_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Security constraints
    CONSTRAINT chk_social_url_safe CHECK (
        url NOT LIKE '%javascript:%' AND 
        url NOT LIKE '%data:text/html%' AND
        url NOT LIKE '%<script%' AND
        LENGTH(url) <= 500 AND
        url ~ '^https?://'
    ),
    CONSTRAINT chk_platform_safe CHECK (
        platform ~ '^[a-zA-Z0-9_-]+$' AND 
        LENGTH(platform) <= 50
    ),
    CONSTRAINT chk_locale_valid_social CHECK (locale IN ('en', 'ru', 'he'))
);

-- Footer Newsletter Configuration Table
CREATE TABLE footer_newsletter_config (
    id SERIAL PRIMARY KEY,
    footer_content_id INTEGER REFERENCES footer_content(id) ON DELETE CASCADE,
    locale VARCHAR(5) NOT NULL DEFAULT 'en',
    api_endpoint VARCHAR(500),
    api_key_placeholder VARCHAR(100) DEFAULT '[ENCRYPTED_KEY]',
    provider VARCHAR(50) DEFAULT 'emailjs',
    service_config JSONB DEFAULT '{}',
    rate_limit_requests INTEGER DEFAULT 5,
    rate_limit_window_minutes INTEGER DEFAULT 60,
    double_opt_in BOOLEAN DEFAULT true,
    gdpr_compliant BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Security constraints
    CONSTRAINT chk_api_endpoint_safe CHECK (
        api_endpoint IS NULL OR 
        (api_endpoint ~ '^https://' AND 
         api_endpoint NOT LIKE '%javascript:%' AND
         api_endpoint NOT LIKE '%<script%' AND
         LENGTH(api_endpoint) <= 500)
    ),
    CONSTRAINT chk_provider_safe CHECK (
        provider ~ '^[a-zA-Z0-9_-]+$' AND 
        LENGTH(provider) <= 50
    ),
    CONSTRAINT chk_locale_valid_newsletter CHECK (locale IN ('en', 'ru', 'he'))
);

-- Footer Audit Log Table
CREATE TABLE footer_audit_log (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    record_id INTEGER NOT NULL,
    action VARCHAR(20) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    old_values JSONB,
    new_values JSONB,
    user_id INTEGER,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Security constraints
    CONSTRAINT chk_action_valid CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    CONSTRAINT chk_table_name_safe CHECK (
        table_name ~ '^[a-zA-Z0-9_]+$' AND 
        LENGTH(table_name) <= 100
    )
);

-- ============================================================================
-- PERFORMANCE INDEXES
-- ============================================================================

-- Core content indexes
CREATE INDEX idx_home_pages_locale ON home_pages(locale);
CREATE INDEX idx_courses_locale ON courses(locale);
CREATE INDEX idx_courses_visible ON courses(visible);
CREATE INDEX idx_teachers_locale ON teachers(locale);
CREATE INDEX idx_blog_posts_locale ON blog_posts(locale);
CREATE INDEX idx_about_pages_locale ON about_pages(locale);

-- Footer system indexes
CREATE INDEX idx_footer_content_locale ON footer_content(locale);
CREATE INDEX idx_footer_content_published ON footer_content(published);
CREATE INDEX idx_footer_content_locale_published ON footer_content(locale, published);

CREATE INDEX idx_footer_nav_locale ON footer_navigation_menus(locale);
CREATE INDEX idx_footer_nav_visible ON footer_navigation_menus(is_visible);
CREATE INDEX idx_footer_nav_locale_type_visible ON footer_navigation_menus(locale, menu_type, is_visible);

CREATE INDEX idx_footer_social_locale ON footer_social_links(locale);
CREATE INDEX idx_footer_social_visible ON footer_social_links(is_visible);
CREATE INDEX idx_footer_social_locale_order ON footer_social_links(locale, display_order);

CREATE INDEX idx_footer_newsletter_locale ON footer_newsletter_config(locale);
CREATE INDEX idx_footer_audit_created ON footer_audit_log(created_at DESC);
CREATE INDEX idx_footer_audit_table ON footer_audit_log(table_name, record_id);

-- ============================================================================
-- TRIGGER FUNCTIONS FOR UPDATED_AT TIMESTAMPS
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to all tables
CREATE TRIGGER update_home_pages_updated_at BEFORE UPDATE ON home_pages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON teachers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_about_pages_updated_at BEFORE UPDATE ON about_pages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contact_pages_updated_at BEFORE UPDATE ON contact_pages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_footer_content_updated_at BEFORE UPDATE ON footer_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_footer_navigation_menus_updated_at BEFORE UPDATE ON footer_navigation_menus FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_footer_social_links_updated_at BEFORE UPDATE ON footer_social_links FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_footer_newsletter_config_updated_at BEFORE UPDATE ON footer_newsletter_config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- AUDIT TRIGGER FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION footer_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO footer_audit_log(table_name, record_id, action, old_values)
        VALUES(TG_TABLE_NAME, OLD.id, TG_OP, row_to_json(OLD));
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO footer_audit_log(table_name, record_id, action, old_values, new_values)
        VALUES(TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(OLD), row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO footer_audit_log(table_name, record_id, action, new_values)
        VALUES(TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(NEW));
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers to footer tables
CREATE TRIGGER footer_content_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON footer_content
    FOR EACH ROW EXECUTE FUNCTION footer_audit_trigger();

CREATE TRIGGER footer_navigation_menus_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON footer_navigation_menus
    FOR EACH ROW EXECUTE FUNCTION footer_audit_trigger();

CREATE TRIGGER footer_social_links_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON footer_social_links
    FOR EACH ROW EXECUTE FUNCTION footer_audit_trigger();

CREATE TRIGGER footer_newsletter_config_audit_trigger
    AFTER INSERT OR UPDATE OR DELETE ON footer_newsletter_config
    FOR EACH ROW EXECUTE FUNCTION footer_audit_trigger();

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE 'AI Studio PostgreSQL database schema initialized successfully!';
    RAISE NOTICE 'Tables created: %, Footer system: %, Security: %, Performance: %', 
        'All core tables', 'Complete', 'XSS protection enabled', 'Indexes created';
END $$;