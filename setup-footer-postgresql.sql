-- ============================================================================
-- FOOTER DATABASE SETUP FOR POSTGRESQL
-- Creates necessary footer tables and inserts default data
-- ============================================================================

-- Drop existing tables if they exist (be careful in production!)
DROP TABLE IF EXISTS footer_social_links CASCADE;
DROP TABLE IF EXISTS footer_navigation_menus CASCADE;
DROP TABLE IF EXISTS footer_content CASCADE;

-- Create footer_content table
CREATE TABLE footer_content (
    id SERIAL PRIMARY KEY,
    locale VARCHAR(10) NOT NULL DEFAULT 'en',
    company_name VARCHAR(255),
    company_description TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    contact_address VARCHAR(500),
    copyright_text VARCHAR(500),
    newsletter_title VARCHAR(255),
    newsletter_placeholder VARCHAR(255),
    newsletter_button_text VARCHAR(100),
    social_title VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create footer_navigation_menus table
CREATE TABLE footer_navigation_menus (
    id SERIAL PRIMARY KEY,
    locale VARCHAR(10) NOT NULL DEFAULT 'en',
    menu_type VARCHAR(50) NOT NULL,
    menu_title VARCHAR(255),
    display_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    menu_items JSONB, -- PostgreSQL JSON type
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create footer_social_links table
CREATE TABLE footer_social_links (
    id SERIAL PRIMARY KEY,
    locale VARCHAR(10) NOT NULL DEFAULT 'en',
    platform VARCHAR(50) NOT NULL,
    url TEXT,
    icon_class VARCHAR(100),
    display_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INSERT DEFAULT DATA - ONLY TOP NAVIGATION ITEMS
-- ============================================================================

-- English footer content
INSERT INTO footer_content (locale, company_name, company_description, contact_email, contact_phone, contact_address, copyright_text, newsletter_title, newsletter_placeholder, newsletter_button_text, social_title)
VALUES ('en', 'AI Studio', 'Elevate tech career with expert-led courses. if you''re just aiming to advance skills, practical training is designed.', 'zohacous@email.com', '(000) 012 3456 7890', '1234 Valencia, Suite, SF, CA', '© Copyright - AI Studio', 'Subscribe to Newsletter', 'Enter email to subscribe', 'Subscribe', 'Follow Us');

-- English navigation menus (ONLY TOP NAV ITEMS)
INSERT INTO footer_navigation_menus (locale, menu_type, menu_title, display_order, menu_items)
VALUES (
    'en',
    'main',
    'Menu',
    1,
    '[
        {"text": "Home", "url": "home.html", "target": "_self", "order": 1, "visible": true},
        {"text": "Courses", "url": "courses.html", "target": "_self", "order": 2, "visible": true},
        {"text": "Teachers", "url": "teachers.html", "target": "_self", "order": 3, "visible": true},
        {"text": "Pricing", "url": "pricing.html", "target": "_self", "order": 4, "visible": true}
    ]'::jsonb
);

INSERT INTO footer_navigation_menus (locale, menu_type, menu_title, display_order, menu_items)
VALUES (
    'en',
    'career_services',
    'Career Services',
    2,
    '[
        {"text": "Career Orientation", "url": "career-orientation.html", "target": "_self", "order": 1, "visible": true},
        {"text": "Career Center", "url": "career-center.html", "target": "_self", "order": 2, "visible": true}
    ]'::jsonb
);

-- Russian footer content
INSERT INTO footer_content (locale, company_name, company_description, contact_email, contact_phone, contact_address, copyright_text, newsletter_title, newsletter_placeholder, newsletter_button_text, social_title)
VALUES ('ru', 'AI Studio', 'Повысьте свою техническую карьеру с помощью курсов под руководством экспертов.', 'zohacous@email.com', '(000) 012 3456 7890', '1234 Valencia, Suite, SF, CA', '© Авторские права - AI Studio', 'Подпишитесь на рассылку', 'Введите email для подписки', 'Подписаться', 'Следите за нами');

-- Russian navigation menus
INSERT INTO footer_navigation_menus (locale, menu_type, menu_title, display_order, menu_items)
VALUES (
    'ru',
    'main',
    'Меню',
    1,
    '[
        {"text": "Главная", "url": "home.html", "target": "_self", "order": 1, "visible": true},
        {"text": "Курсы", "url": "courses.html", "target": "_self", "order": 2, "visible": true},
        {"text": "Преподаватели", "url": "teachers.html", "target": "_self", "order": 3, "visible": true},
        {"text": "Цены", "url": "pricing.html", "target": "_self", "order": 4, "visible": true}
    ]'::jsonb
);

INSERT INTO footer_navigation_menus (locale, menu_type, menu_title, display_order, menu_items)
VALUES (
    'ru',
    'career_services',
    'Карьерные Услуги',
    2,
    '[
        {"text": "Карьерная Ориентация", "url": "career-orientation.html", "target": "_self", "order": 1, "visible": true},
        {"text": "Карьерный Центр", "url": "career-center.html", "target": "_self", "order": 2, "visible": true}
    ]'::jsonb
);

-- Hebrew footer content
INSERT INTO footer_content (locale, company_name, company_description, contact_email, contact_phone, contact_address, copyright_text, newsletter_title, newsletter_placeholder, newsletter_button_text, social_title)
VALUES ('he', 'AI Studio', 'שפר את הקריירה הטכנולוגית שלך עם קורסים בהובלת מומחים.', 'zohacous@email.com', '(000) 012 3456 7890', '1234 Valencia, Suite, SF, CA', '© זכויות יוצרים - AI Studio', 'הירשם לניוזלטר', 'הזן אימייל להרשמה', 'הירשם', 'עקבו אחרינו');

-- Hebrew navigation menus
INSERT INTO footer_navigation_menus (locale, menu_type, menu_title, display_order, menu_items)
VALUES (
    'he',
    'main',
    'תפריט',
    1,
    '[
        {"text": "בית", "url": "home.html", "target": "_self", "order": 1, "visible": true},
        {"text": "קורסים", "url": "courses.html", "target": "_self", "order": 2, "visible": true},
        {"text": "מורים", "url": "teachers.html", "target": "_self", "order": 3, "visible": true},
        {"text": "תמחור", "url": "pricing.html", "target": "_self", "order": 4, "visible": true}
    ]'::jsonb
);

INSERT INTO footer_navigation_menus (locale, menu_type, menu_title, display_order, menu_items)
VALUES (
    'he',
    'career_services',
    'שירותי קריירה',
    2,
    '[
        {"text": "כיוון קריירה", "url": "career-orientation.html", "target": "_self", "order": 1, "visible": true},
        {"text": "מרכז קריירה", "url": "career-center.html", "target": "_self", "order": 2, "visible": true}
    ]'::jsonb
);

-- Social links (same for all languages)
INSERT INTO footer_social_links (locale, platform, url, icon_class, display_order)
VALUES
    ('en', 'facebook', 'https://www.facebook.com/', 'fab fa-facebook', 1),
    ('en', 'twitter', 'https://twitter.com/', 'fab fa-twitter', 2),
    ('en', 'instagram', 'https://www.instagram.com/', 'fab fa-instagram', 3),
    ('en', 'youtube', 'https://youtube.com/', 'fab fa-youtube', 4);

-- Create indexes for performance
CREATE INDEX idx_footer_content_locale ON footer_content(locale);
CREATE INDEX idx_footer_navigation_locale_type ON footer_navigation_menus(locale, menu_type);
CREATE INDEX idx_footer_social_locale ON footer_social_links(locale);

-- Verify the setup
DO $$
DECLARE
    content_count INT;
    nav_count INT;
    social_count INT;
BEGIN
    SELECT COUNT(*) INTO content_count FROM footer_content;
    SELECT COUNT(*) INTO nav_count FROM footer_navigation_menus;
    SELECT COUNT(*) INTO social_count FROM footer_social_links;

    RAISE NOTICE '✅ FOOTER DATABASE SETUP COMPLETE!';
    RAISE NOTICE '📊 Footer content records: %', content_count;
    RAISE NOTICE '📊 Footer navigation records: %', nav_count;
    RAISE NOTICE '📊 Footer social links records: %', social_count;
    RAISE NOTICE '';
    RAISE NOTICE '🚀 The footer should now load correctly!';
    RAISE NOTICE '✅ Only top navigation items will appear';
    RAISE NOTICE '✅ No unauthorized items (404, Sign Up, etc.)';
END $$;