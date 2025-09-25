CREATE TABLE sqlite_sequence(name,seq);
CREATE TABLE home_pages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                locale TEXT DEFAULT 'en',
                title TEXT,
                heroTitle TEXT,
                heroSubtitle TEXT,
                heroDescription TEXT,
                heroSectionVisible BOOLEAN,
                featuredCoursesTitle TEXT,
                featuredCoursesDescription TEXT,
                featuredCoursesVisible BOOLEAN,
                aboutTitle TEXT,
                aboutSubtitle TEXT,
                aboutDescription TEXT,
                aboutVisible BOOLEAN,
                companiesTitle TEXT,
                companiesDescription TEXT,
                companiesVisible BOOLEAN,
                testimonialsTitle TEXT,
                testimonialsSubtitle TEXT,
                testimonialsVisible BOOLEAN,
                courses TEXT,
                testimonials TEXT,
                published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
CREATE TABLE courses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                locale TEXT DEFAULT 'en',
                title TEXT NOT NULL,
                description TEXT,
                price DECIMAL(10,2),
                duration TEXT,
                lessons TEXT,
                category TEXT,
                rating DECIMAL(3,1),
                visible BOOLEAN DEFAULT true,
                published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
CREATE TABLE teachers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    title TEXT,
    bio TEXT,
    image_url TEXT,
    expertise TEXT,
    locale TEXT DEFAULT 'en',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    published_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    excerpt TEXT,
    image_url TEXT,
    author TEXT,
    locale TEXT DEFAULT 'en',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    published_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE about_pages (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, content TEXT, mission TEXT, vision TEXT, company_values TEXT, locale TEXT DEFAULT 'en', created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, published_at DATETIME DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE contact_pages (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, address TEXT, phone TEXT, email TEXT, office_hours TEXT, locale TEXT DEFAULT 'en', created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE faqs (id INTEGER PRIMARY KEY AUTOINCREMENT, question TEXT NOT NULL, answer TEXT NOT NULL, category TEXT, order_index INTEGER DEFAULT 0, locale TEXT DEFAULT 'en', created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, published_at DATETIME DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE career_resources (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, description TEXT, resource_type TEXT, resource_url TEXT, locale TEXT DEFAULT 'en', created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, published_at DATETIME DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE career_center_pages (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, content TEXT, services TEXT, programs TEXT, success_stories TEXT, locale TEXT DEFAULT 'en', created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, published_at DATETIME DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE career_orientation_pages (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, content TEXT, guidance_sections TEXT, assessment_tools TEXT, career_paths TEXT, locale TEXT DEFAULT 'en', created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, published_at DATETIME DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE pricing_plans (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, price DECIMAL(10,2), currency TEXT DEFAULT 'USD', features TEXT, recommended BOOLEAN DEFAULT 0, locale TEXT DEFAULT 'en', created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE job_postings (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, company TEXT, description TEXT, requirements TEXT, location TEXT, salary_range TEXT, application_url TEXT, locale TEXT DEFAULT 'en', created_at DATETIME DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, published_at DATETIME DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE footer_content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
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
    newsletter_enabled BOOLEAN DEFAULT 1,
    newsletter_title VARCHAR(255) DEFAULT 'Subscribe to Newsletter',
    newsletter_subtitle TEXT DEFAULT 'Get the latest courses and updates delivered to your inbox',
    newsletter_placeholder VARCHAR(255) DEFAULT 'Enter email to subscribe',
    newsletter_button_text VARCHAR(100) DEFAULT 'Subscribe',
    newsletter_success_message TEXT DEFAULT 'Thank you for subscribing!',
    newsletter_error_message TEXT DEFAULT 'Something went wrong. Please try again.',
    
    -- Feature Flags
    show_social_links BOOLEAN DEFAULT 1,
    show_newsletter BOOLEAN DEFAULT 1,
    show_contact_info BOOLEAN DEFAULT 1,
    show_navigation BOOLEAN DEFAULT 1,
    show_company_info BOOLEAN DEFAULT 1,
    
    -- Metadata
    version INTEGER DEFAULT 1,
    published BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    
    -- SQLite constraints
    CONSTRAINT chk_valid_locale CHECK (locale IN ('en', 'ru', 'he')),
    CONSTRAINT chk_contact_email_valid CHECK (
        contact_email IS NULL OR 
        contact_email LIKE '%@%.%' AND 
        LENGTH(contact_email) <= 255 AND
        contact_email NOT LIKE '%@localhost%' AND
        contact_email NOT LIKE '%@example.%' AND
        contact_email NOT LIKE '%.local' AND
        contact_email NOT LIKE '%@test%'
    ),
    CONSTRAINT chk_support_email_valid CHECK (
        support_email IS NULL OR 
        support_email LIKE '%@%.%' AND 
        LENGTH(support_email) <= 255 AND
        support_email NOT LIKE '%@localhost%' AND
        support_email NOT LIKE '%@example.%'
    ),
    CONSTRAINT chk_sales_email_valid CHECK (
        sales_email IS NULL OR 
        sales_email LIKE '%@%.%' AND 
        LENGTH(sales_email) <= 255 AND
        sales_email NOT LIKE '%@localhost%' AND
        sales_email NOT LIKE '%@example.%'
    ),
    CONSTRAINT chk_company_logo_url_valid CHECK (
        company_logo_url IS NULL OR 
        (company_logo_url NOT LIKE 'javascript:%' AND
         company_logo_url NOT LIKE 'data:%' AND
         company_logo_url NOT LIKE 'vbscript:%' AND
         company_logo_url NOT LIKE 'file:%' AND
         LENGTH(company_logo_url) <= 500)
    ),
    CONSTRAINT chk_privacy_policy_url_valid CHECK (
        privacy_policy_url IS NULL OR 
        (privacy_policy_url NOT LIKE 'javascript:%' AND
         privacy_policy_url NOT LIKE 'data:%' AND
         LENGTH(privacy_policy_url) <= 500)
    ),
    CONSTRAINT chk_terms_of_service_url_valid CHECK (
        terms_of_service_url IS NULL OR 
        (terms_of_service_url NOT LIKE 'javascript:%' AND
         terms_of_service_url NOT LIKE 'data:%' AND
         LENGTH(terms_of_service_url) <= 500)
    ),
    CONSTRAINT chk_cookie_policy_url_valid CHECK (
        cookie_policy_url IS NULL OR 
        (cookie_policy_url NOT LIKE 'javascript:%' AND
         cookie_policy_url NOT LIKE 'data:%' AND
         LENGTH(cookie_policy_url) <= 500)
    ),
    CONSTRAINT chk_company_description_length CHECK (LENGTH(company_description) <= 5000),
    CONSTRAINT chk_copyright_text_length CHECK (LENGTH(copyright_text) <= 1000),
    CONSTRAINT chk_newsletter_subtitle_length CHECK (LENGTH(newsletter_subtitle) <= 1000)
);
CREATE UNIQUE INDEX idx_unique_locale_published 
ON footer_content (locale) 
WHERE published = 1;
CREATE TABLE footer_navigation_menus (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    locale VARCHAR(5) NOT NULL DEFAULT 'en',
    menu_type VARCHAR(50) NOT NULL,
    menu_title VARCHAR(100),
    display_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT 1,
    
    -- Menu items stored as JSON text (SQLite doesn't have JSONB)
    menu_items TEXT DEFAULT '[]',
    
    -- Metadata
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT fk_nav_footer_content FOREIGN KEY (locale) 
        REFERENCES footer_content(locale) ON DELETE CASCADE,
    CONSTRAINT chk_nav_valid_locale CHECK (locale IN ('en', 'ru', 'he')),
    CONSTRAINT chk_menu_type_valid CHECK (
        menu_type IN ('main', 'courses', 'company', 'support', 'utility', 'legal', 'footer')
    ),
    CONSTRAINT unique_locale_menu UNIQUE(locale, menu_type)
);
CREATE TABLE footer_social_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    locale VARCHAR(5) NOT NULL DEFAULT 'en',
    platform VARCHAR(50) NOT NULL,
    
    -- Social Media Details
    url VARCHAR(500),
    icon_class VARCHAR(100),
    icon_svg TEXT,
    display_text VARCHAR(100),
    tooltip VARCHAR(255),
    display_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT 1,
    opens_new_tab BOOLEAN DEFAULT 1,
    
    -- Analytics
    tracking_code VARCHAR(255),
    
    -- Metadata
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT fk_social_footer_content FOREIGN KEY (locale) 
        REFERENCES footer_content(locale) ON DELETE CASCADE,
    CONSTRAINT chk_social_valid_locale CHECK (locale IN ('en', 'ru', 'he')),
    CONSTRAINT chk_platform_valid CHECK (
        platform IN ('facebook', 'twitter', 'linkedin', 'instagram', 'youtube', 'telegram', 'whatsapp', 'tiktok', 'github')
    ),
    CONSTRAINT chk_social_url_valid CHECK (
        url IS NULL OR 
        (url NOT LIKE 'javascript:%' AND
         url NOT LIKE 'data:%' AND
         url NOT LIKE 'vbscript:%' AND
         url NOT LIKE 'file:%' AND
         LENGTH(url) <= 500)
    ),
    CONSTRAINT unique_locale_platform UNIQUE(locale, platform)
);
CREATE TABLE footer_newsletter_config (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    locale VARCHAR(5) NOT NULL DEFAULT 'en',
    
    -- Email Service Configuration
    service_provider VARCHAR(50) DEFAULT 'emailjs',
    api_endpoint VARCHAR(500),
    api_key_encrypted TEXT,
    list_id VARCHAR(100),
    template_id VARCHAR(100),
    
    -- Form Configuration (JSON text in SQLite)
    form_fields TEXT DEFAULT '[]',
    
    -- GDPR & Compliance
    gdpr_consent_required BOOLEAN DEFAULT 1,
    gdpr_consent_text TEXT DEFAULT 'I agree to receive marketing emails and accept the privacy policy',
    double_opt_in BOOLEAN DEFAULT 0,
    
    -- Rate Limiting
    max_submissions_per_ip INTEGER DEFAULT 5,
    rate_limit_window_minutes INTEGER DEFAULT 60,
    
    -- Metadata
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT fk_newsletter_footer_content FOREIGN KEY (locale) 
        REFERENCES footer_content(locale) ON DELETE CASCADE,
    CONSTRAINT chk_newsletter_valid_locale CHECK (locale IN ('en', 'ru', 'he')),
    CONSTRAINT unique_newsletter_locale UNIQUE(locale)
);
CREATE TABLE footer_audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    table_name VARCHAR(50) NOT NULL,
    record_id INTEGER NOT NULL,
    action VARCHAR(20) NOT NULL,
    locale VARCHAR(5),
    
    -- Change details (JSON text in SQLite)
    old_values TEXT,
    new_values TEXT,
    changed_fields TEXT,
    
    -- User information
    user_id VARCHAR(100),
    user_email VARCHAR(255),
    user_ip VARCHAR(45),
    user_agent TEXT,
    
    -- Timestamp
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_valid_table_name CHECK (
        table_name IN ('footer_content', 'footer_navigation_menus', 'footer_social_links', 'footer_newsletter_config')
    )
);
CREATE INDEX idx_footer_content_locale ON footer_content(locale);
CREATE INDEX idx_footer_content_published ON footer_content(published);
CREATE INDEX idx_footer_content_locale_published 
    ON footer_content(locale, published) WHERE published = 1;
CREATE INDEX idx_footer_nav_locale ON footer_navigation_menus(locale);
CREATE INDEX idx_footer_nav_visible ON footer_navigation_menus(is_visible);
CREATE INDEX idx_footer_nav_locale_type_visible 
    ON footer_navigation_menus(locale, menu_type, is_visible) WHERE is_visible = 1;
CREATE INDEX idx_footer_social_locale ON footer_social_links(locale);
CREATE INDEX idx_footer_social_visible ON footer_social_links(is_visible);
CREATE INDEX idx_footer_social_locale_order 
    ON footer_social_links(locale, display_order) WHERE is_visible = 1;
CREATE INDEX idx_footer_newsletter_locale ON footer_newsletter_config(locale);
CREATE INDEX idx_footer_audit_created ON footer_audit_log(created_at DESC);
CREATE INDEX idx_footer_audit_table ON footer_audit_log(table_name, record_id);
CREATE TRIGGER update_footer_content_updated_at
    AFTER UPDATE ON footer_content
BEGIN
    UPDATE footer_content SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
CREATE TRIGGER update_footer_nav_updated_at
    AFTER UPDATE ON footer_navigation_menus
BEGIN
    UPDATE footer_navigation_menus SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
CREATE TRIGGER update_footer_social_updated_at
    AFTER UPDATE ON footer_social_links
BEGIN
    UPDATE footer_social_links SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
CREATE TRIGGER update_footer_newsletter_updated_at
    AFTER UPDATE ON footer_newsletter_config
BEGIN
    UPDATE footer_newsletter_config SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
CREATE TRIGGER audit_footer_content_changes
    AFTER INSERT ON footer_content
BEGIN
    INSERT INTO footer_audit_log (
        table_name, record_id, action, locale,
        old_values, new_values, changed_fields,
        user_id, created_at
    ) VALUES (
        'footer_content', NEW.id, 'INSERT', NEW.locale,
        NULL, 
        json_object(
            'id', NEW.id, 'locale', NEW.locale, 'company_name', NEW.company_name,
            'published', NEW.published, 'version', NEW.version
        ),
        NULL, 'system', CURRENT_TIMESTAMP
    );
END;
CREATE TRIGGER audit_footer_content_updates
    AFTER UPDATE ON footer_content
BEGIN
    INSERT INTO footer_audit_log (
        table_name, record_id, action, locale,
        old_values, new_values, changed_fields,
        user_id, created_at
    ) VALUES (
        'footer_content', NEW.id, 'UPDATE', NEW.locale,
        json_object(
            'id', OLD.id, 'locale', OLD.locale, 'company_name', OLD.company_name,
            'published', OLD.published, 'version', OLD.version
        ),
        json_object(
            'id', NEW.id, 'locale', NEW.locale, 'company_name', NEW.company_name,
            'published', NEW.published, 'version', NEW.version
        ),
        'updated_fields', NEW.updated_by, CURRENT_TIMESTAMP
    );
END;
CREATE TRIGGER audit_footer_content_deletes
    AFTER DELETE ON footer_content
BEGIN
    INSERT INTO footer_audit_log (
        table_name, record_id, action, locale,
        old_values, new_values, changed_fields,
        user_id, created_at
    ) VALUES (
        'footer_content', OLD.id, 'DELETE', OLD.locale,
        json_object(
            'id', OLD.id, 'locale', OLD.locale, 'company_name', OLD.company_name,
            'published', OLD.published, 'version', OLD.version
        ),
        NULL, NULL, 'system', CURRENT_TIMESTAMP
    );
END;
CREATE TRIGGER audit_footer_nav_changes
    AFTER INSERT ON footer_navigation_menus
BEGIN
    INSERT INTO footer_audit_log (
        table_name, record_id, action, locale,
        old_values, new_values, changed_fields,
        user_id, created_at
    ) VALUES (
        'footer_navigation_menus', NEW.id, 'INSERT', NEW.locale,
        NULL,
        json_object('id', NEW.id, 'locale', NEW.locale, 'menu_type', NEW.menu_type),
        NULL, 'system', CURRENT_TIMESTAMP
    );
END;
