-- Add Hebrew and Russian translations for pricing features in home page
-- These translations will appear in the mobile pricing table view

-- Update pricing section in nd_home table with Hebrew translations
UPDATE nd_home
SET content_he = jsonb_set(
    COALESCE(content_he, '{}'),
    '{content,features}',
    '{
        "community_support": "תמיכת קהילה",
        "course_materials": "חומרי קורס",
        "hands_on_projects": "פרויקטים מעשיים",
        "career_support": "תמיכה בקריירה",
        "support_sessions": "מפגשי תמיכה",
        "access_to_webinars": "גישה לוובינרים"
    }'::jsonb,
    true
)
WHERE section_key = 'pricing';

-- Update Russian translations if needed
UPDATE nd_home
SET content_ru = jsonb_set(
    COALESCE(content_ru, '{}'),
    '{content,features}',
    '{
        "community_support": "Поддержка сообщества",
        "course_materials": "Материалы курса",
        "hands_on_projects": "Практические проекты",
        "career_support": "Карьерная поддержка",
        "support_sessions": "Сессии поддержки",
        "access_to_webinars": "Доступ к вебинарам"
    }'::jsonb,
    true
)
WHERE section_key = 'pricing';

-- Add plan names translations
UPDATE nd_home
SET content_he = jsonb_set(
    COALESCE(content_he, '{}'),
    '{content,plans}',
    '{
        "basic": {
            "name": "תוכנית בסיסית",
            "price": "₪99",
            "period": "לחודש"
        },
        "pro": {
            "name": "תוכנית מקצועית",
            "price": "₪199",
            "period": "לחודש"
        },
        "enterprise": {
            "name": "תוכנית ארגונית",
            "price": "₪399",
            "period": "לחודש"
        }
    }'::jsonb,
    true
)
WHERE section_key = 'pricing';

UPDATE nd_home
SET content_ru = jsonb_set(
    COALESCE(content_ru, '{}'),
    '{content,plans}',
    '{
        "basic": {
            "name": "Базовый план",
            "price": "₽2999",
            "period": "в месяц"
        },
        "pro": {
            "name": "Профессиональный план",
            "price": "₽5999",
            "period": "в месяц"
        },
        "enterprise": {
            "name": "Корпоративный план",
            "price": "₽11999",
            "period": "в месяц"
        }
    }'::jsonb,
    true
)
WHERE section_key = 'pricing';

-- Also add the "Access All Courses" translation that appears in the first feature
UPDATE nd_home
SET content_he = jsonb_set(
    COALESCE(content_he, '{}'),
    '{content,content,steps,0,title}',
    '"גישה לכל הקורסים"'::jsonb,
    true
)
WHERE section_key = 'process';

UPDATE nd_home
SET content_ru = jsonb_set(
    COALESCE(content_ru, '{}'),
    '{content,content,steps,0,title}',
    '"Доступ ко всем курсам"'::jsonb,
    true
)
WHERE section_key = 'process';

-- Add monthly/yearly period translations
UPDATE nd_home
SET content_he = jsonb_set(
    COALESCE(content_he, '{}'),
    '{content,plans,monthly}',
    '{
        "name": "חודשי",
        "period": "לחודש"
    }'::jsonb,
    true
)
WHERE section_key = 'pricing';

UPDATE nd_home
SET content_he = jsonb_set(
    COALESCE(content_he, '{}'),
    '{content,plans,annual}',
    '{
        "name": "שנתי",
        "period": "לשנה"
    }'::jsonb,
    true
)
WHERE section_key = 'pricing';

UPDATE nd_home
SET content_ru = jsonb_set(
    COALESCE(content_ru, '{}'),
    '{content,plans,monthly}',
    '{
        "name": "Ежемесячно",
        "period": "в месяц"
    }'::jsonb,
    true
)
WHERE section_key = 'pricing';

UPDATE nd_home
SET content_ru = jsonb_set(
    COALESCE(content_ru, '{}'),
    '{content,plans,annual}',
    '{
        "name": "Ежегодно",
        "period": "в год"
    }'::jsonb,
    true
)
WHERE section_key = 'pricing';

-- Add UI button translations
UPDATE nd_home
SET content_he = jsonb_set(
    COALESCE(content_he, '{}'),
    '{content,ui,buttons}',
    '{
        "choose_plan": "בחר תוכנית",
        "get_started": "התחל עכשיו",
        "learn_more": "למד עוד"
    }'::jsonb,
    true
)
WHERE section_key = 'pricing';

UPDATE nd_home
SET content_ru = jsonb_set(
    COALESCE(content_ru, '{}'),
    '{content,ui,buttons}',
    '{
        "choose_plan": "Выбрать план",
        "get_started": "Начать",
        "learn_more": "Узнать больше"
    }'::jsonb,
    true
)
WHERE section_key = 'pricing';

SELECT 'Pricing translations added successfully!' as status;