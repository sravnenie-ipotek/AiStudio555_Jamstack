-- SQL script to add missing translations for courses.html
-- This adds the missing button translations and other UI elements

-- First, let's check the current structure
SELECT section_key,
       jsonb_pretty(content_ru->'buttons') as buttons_ru,
       jsonb_pretty(content_ru->'content') as content_ru
FROM nd_home
WHERE section_key IN ('ui_elements', 'misc', 'navigation')
LIMIT 5;

-- Add buttons section to an existing section (ui_elements or create new)
UPDATE nd_home
SET content_ru = jsonb_set(
    COALESCE(content_ru, '{}'::jsonb),
    '{buttons}',
    '{
        "sign_up_today": "Записаться Сегодня",
        "course_details": "Детали Курса",
        "start_learning": "Начать Обучение",
        "browse_courses": "Просмотреть Курсы",
        "get_in_touch": "Связаться",
        "check_out_courses": "Посмотреть Курсы"
    }'::jsonb,
    true
)
WHERE section_key = 'ui_elements';

-- Add the same for English (to ensure consistency)
UPDATE nd_home
SET content_en = jsonb_set(
    COALESCE(content_en, '{}'::jsonb),
    '{buttons}',
    '{
        "sign_up_today": "Sign Up Today",
        "course_details": "Course Details",
        "start_learning": "Start Learning",
        "browse_courses": "Browse Courses",
        "get_in_touch": "Get In Touch",
        "check_out_courses": "Check Out Courses"
    }'::jsonb,
    true
)
WHERE section_key = 'ui_elements';

-- Add the same for Hebrew
UPDATE nd_home
SET content_he = jsonb_set(
    COALESCE(content_he, '{}'::jsonb),
    '{buttons}',
    '{
        "sign_up_today": "הרשמה היום",
        "course_details": "פרטי הקורס",
        "start_learning": "התחל ללמוד",
        "browse_courses": "עיין בקורסים",
        "get_in_touch": "צור קשר",
        "check_out_courses": "בדוק קורסים"
    }'::jsonb,
    true
)
WHERE section_key = 'ui_elements';

-- Add navigation content structure to match what courses.html expects
UPDATE nd_home
SET content_ru = jsonb_set(
    COALESCE(content_ru, '{}'::jsonb),
    '{content}',
    '{
        "home": "Главная",
        "courses": "Курсы",
        "pricing": "Цены",
        "blog": "Блог",
        "teachers": "Преподаватели",
        "about_us": "О нас",
        "career_orientation": "Профориентация",
        "career_center": "Центр Карьеры"
    }'::jsonb,
    true
)
WHERE section_key = 'navigation';

-- Add content section for general UI elements
INSERT INTO nd_home (section_key, content_en, content_ru, content_he, visible, animations_enabled)
VALUES (
    'content',
    '{"no_items": "No items found"}'::jsonb,
    '{"no_items": "Товары не найдены"}'::jsonb,
    '{"no_items": "לא נמצאו פריטים"}'::jsonb,
    true,
    true
)
ON CONFLICT (section_key) DO UPDATE
SET content_ru = '{"no_items": "Товары не найдены"}'::jsonb;

-- Add courses_page section for page-specific content
INSERT INTO nd_home (section_key, content_en, content_ru, content_he, visible, animations_enabled)
VALUES (
    'courses_page',
    '{
        "content": {
            "title": "Courses"
        }
    }'::jsonb,
    '{
        "content": {
            "title": "Курсы"
        }
    }'::jsonb,
    '{
        "content": {
            "title": "קורסים"
        }
    }'::jsonb,
    true,
    true
)
ON CONFLICT (section_key) DO UPDATE
SET content_ru = '{
    "content": {
        "title": "Курсы"
    }
}'::jsonb;

-- Add CTA bottom section translations
INSERT INTO nd_home (section_key, content_en, content_ru, content_he, visible, animations_enabled)
VALUES (
    'cta_bottom',
    '{
        "content": {
            "subtitle": "Start Learning Today",
            "title": "Discover A World Of Learning Opportunities",
            "description": "Don''t wait to transform your career and unlock your full potential"
        }
    }'::jsonb,
    '{
        "content": {
            "subtitle": "Начните Обучение Сегодня",
            "title": "Откройте Мир Возможностей для Обучения",
            "description": "Не ждите, чтобы изменить свою карьеру и раскрыть свой полный потенциал"
        }
    }'::jsonb,
    '{
        "content": {
            "subtitle": "התחל ללמוד היום",
            "title": "גלה עולם של הזדמנויות למידה",
            "description": "אל תחכה לשנות את הקריירה שלך ולפתוח את הפוטנציאל המלא שלך"
        }
    }'::jsonb,
    true,
    true
)
ON CONFLICT (section_key) DO UPDATE
SET content_ru = '{
    "content": {
        "subtitle": "Начните Обучение Сегодня",
        "title": "Откройте Мир Возможностей для Обучения",
        "description": "Не ждите, чтобы изменить свою карьеру и раскрыть свой полный потенциал"
    }
}'::jsonb;

-- Verify the updates
SELECT section_key,
       jsonb_pretty(content_ru) as russian_content
FROM nd_home
WHERE section_key IN ('ui_elements', 'navigation', 'content', 'courses_page', 'cta_bottom', 'buttons')
ORDER BY section_key;