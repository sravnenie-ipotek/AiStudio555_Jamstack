-- ============================================================================
-- URGENT FOOTER FIX - REMOVE UNAUTHORIZED MENU ITEMS
-- Removes all footer links that don't exist in top navigation
-- ============================================================================

-- Step 1: Delete ALL existing footer navigation data
DELETE FROM footer_navigation_menus;

-- Step 2: Insert ONLY top navigation items (no extras)
-- English - ONLY Main Menu (matches top nav exactly)
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

-- English - Career Services (from top nav dropdown)
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

-- Russian - ONLY Main Menu (matches top nav exactly)
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

-- Russian - Career Services (from top nav dropdown)
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

-- Hebrew - ONLY Main Menu (matches top nav exactly)
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

-- Hebrew - Career Services (from top nav dropdown)
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
-- VERIFICATION - ENSURE ONLY CORRECT ITEMS
-- ============================================================================

DO $$
DECLARE
    total_records INT;
    main_menus INT;
    career_menus INT;
BEGIN
    SELECT COUNT(*) INTO total_records FROM footer_navigation_menus;
    SELECT COUNT(*) INTO main_menus FROM footer_navigation_menus WHERE menu_type = 'main';
    SELECT COUNT(*) INTO career_menus FROM footer_navigation_menus WHERE menu_type = 'career_services';

    RAISE NOTICE '🚨 URGENT FOOTER FIX APPLIED!';
    RAISE NOTICE '📊 Total navigation records: % (should be 6)', total_records;
    RAISE NOTICE '🏠 Main menu records: % (should be 3 - en/ru/he)', main_menus;
    RAISE NOTICE '💼 Career services records: % (should be 3 - en/ru/he)', career_menus;
    RAISE NOTICE '';

    IF total_records = 6 AND main_menus = 3 AND career_menus = 3 THEN
        RAISE NOTICE '✅ SUCCESS: Footer navigation cleaned up correctly!';
        RAISE NOTICE '✅ REMOVED: About Us, Blog, Contact Us, Course Single, Pricing Single';
        RAISE NOTICE '✅ REMOVED: 404, Password Protected, Changelog, License, Style Guide';
        RAISE NOTICE '✅ REMOVED: Sign Up, Sign In, Forgot Password, Reset Password, התחברות';
        RAISE NOTICE '✅ KEPT: Only Home, Courses, Teachers, Pricing + Career Services';
    ELSE
        RAISE NOTICE '❌ ERROR: Unexpected record counts!';
    END IF;

    RAISE NOTICE '';
    RAISE NOTICE '🔄 Next: Clear browser cache and test footer loading';
END $$;

-- Show final navigation structure for verification
SELECT
    locale,
    menu_type,
    menu_title,
    jsonb_array_length(menu_items::jsonb) as item_count,
    menu_items::jsonb
FROM footer_navigation_menus
ORDER BY locale, display_order;