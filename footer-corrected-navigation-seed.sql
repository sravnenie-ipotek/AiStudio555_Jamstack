-- ============================================================================
-- CORRECTED FOOTER NAVIGATION - MATCHES TOP MENU EXACTLY
-- Version: 1.0.0
-- Date: 2024
-- Description: Updates footer navigation to match top menu structure ONLY
-- ============================================================================

-- Clean existing incorrect navigation data
DELETE FROM footer_navigation_menus WHERE menu_type IN ('main', 'courses', 'support', 'utility');

-- ============================================================================
-- INSERT CORRECTED NAVIGATION MENUS - TOP NAV STRUCTURE ONLY
-- ============================================================================

-- English - Main Navigation (Matches top nav exactly)
INSERT INTO footer_navigation_menus (locale, menu_type, menu_title, display_order, is_visible, menu_items) VALUES (
    'en',
    'main',
    'Menu',
    1,
    true,
    '[
        {"text": "Home", "url": "home.html", "target": "_self", "order": 1, "visible": true},
        {"text": "Courses", "url": "courses.html", "target": "_self", "order": 2, "visible": true},
        {"text": "Teachers", "url": "teachers.html", "target": "_self", "order": 3, "visible": true},
        {"text": "Pricing", "url": "pricing.html", "target": "_self", "order": 4, "visible": true}
    ]'
);

-- English - Career Services (Matches dropdown in top nav)
INSERT INTO footer_navigation_menus (locale, menu_type, menu_title, display_order, is_visible, menu_items) VALUES (
    'en',
    'career_services',
    'Career Services',
    2,
    true,
    '[
        {"text": "Career Orientation", "url": "career-orientation.html", "target": "_self", "order": 1, "visible": true},
        {"text": "Career Center", "url": "career-center.html", "target": "_self", "order": 2, "visible": true}
    ]'
);

-- Russian - Main Navigation (Matches top nav exactly)
INSERT INTO footer_navigation_menus (locale, menu_type, menu_title, display_order, is_visible, menu_items) VALUES (
    'ru',
    'main',
    'Меню',
    1,
    true,
    '[
        {"text": "Главная", "url": "home.html", "target": "_self", "order": 1, "visible": true},
        {"text": "Курсы", "url": "courses.html", "target": "_self", "order": 2, "visible": true},
        {"text": "Преподаватели", "url": "teachers.html", "target": "_self", "order": 3, "visible": true},
        {"text": "Цены", "url": "pricing.html", "target": "_self", "order": 4, "visible": true}
    ]'
);

-- Russian - Career Services (Matches dropdown in top nav)
INSERT INTO footer_navigation_menus (locale, menu_type, menu_title, display_order, is_visible, menu_items) VALUES (
    'ru',
    'career_services',
    'Карьерные Услуги',
    2,
    true,
    '[
        {"text": "Карьерная Ориентация", "url": "career-orientation.html", "target": "_self", "order": 1, "visible": true},
        {"text": "Карьерный Центр", "url": "career-center.html", "target": "_self", "order": 2, "visible": true}
    ]'
);

-- Hebrew - Main Navigation (Matches top nav exactly)
INSERT INTO footer_navigation_menus (locale, menu_type, menu_title, display_order, is_visible, menu_items) VALUES (
    'he',
    'main',
    'תפריט',
    1,
    true,
    '[
        {"text": "בית", "url": "home.html", "target": "_self", "order": 1, "visible": true},
        {"text": "קורסים", "url": "courses.html", "target": "_self", "order": 2, "visible": true},
        {"text": "מורים", "url": "teachers.html", "target": "_self", "order": 3, "visible": true},
        {"text": "תמחור", "url": "pricing.html", "target": "_self", "order": 4, "visible": true}
    ]'
);

-- Hebrew - Career Services (Matches dropdown in top nav)
INSERT INTO footer_navigation_menus (locale, menu_type, menu_title, display_order, is_visible, menu_items) VALUES (
    'he',
    'career_services',
    'שירותי קריירה',
    2,
    true,
    '[
        {"text": "כיוון קריירה", "url": "career-orientation.html", "target": "_self", "order": 1, "visible": true},
        {"text": "מרכז קריירה", "url": "career-center.html", "target": "_self", "order": 2, "visible": true}
    ]'
);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
DO $$
DECLARE
    nav_count INT;
    main_menus INT;
    career_menus INT;
BEGIN
    SELECT COUNT(*) INTO nav_count FROM footer_navigation_menus;
    SELECT COUNT(*) INTO main_menus FROM footer_navigation_menus WHERE menu_type = 'main';
    SELECT COUNT(*) INTO career_menus FROM footer_navigation_menus WHERE menu_type = 'career_services';

    RAISE NOTICE '🎯 CORRECTED NAVIGATION DATA INSERTED SUCCESSFULLY!';
    RAISE NOTICE '📊 Total navigation records: %', nav_count;
    RAISE NOTICE '🏠 Main menu records (should be 3): %', main_menus;
    RAISE NOTICE '💼 Career services records (should be 3): %', career_menus;
    RAISE NOTICE '';
    RAISE NOTICE '✅ Footer navigation now matches top navigation exactly!';
    RAISE NOTICE '🚀 Ready for frontend integration...';
END $$;

-- ============================================================================
-- VALIDATION QUERIES - RUN TO VERIFY CORRECTNESS
-- ============================================================================

-- Verify English navigation structure
SELECT
    'en' as locale,
    menu_type,
    menu_title,
    jsonb_array_length(menu_items::jsonb) as item_count,
    menu_items::jsonb
FROM footer_navigation_menus
WHERE locale = 'en'
ORDER BY display_order;

-- Verify all locales have the same structure
SELECT
    locale,
    COUNT(CASE WHEN menu_type = 'main' THEN 1 END) as main_menus,
    COUNT(CASE WHEN menu_type = 'career_services' THEN 1 END) as career_menus,
    COUNT(*) as total_menus
FROM footer_navigation_menus
GROUP BY locale
ORDER BY locale;