-- Multi-language Admin Panel Support Migration
-- Creates Russian and Hebrew records in home_pages table
-- Maintains backward compatibility with English (id=1)

-- Check if Russian record exists, if not create it
INSERT INTO home_pages (
    id,
    locale,
    title,
    hero_title,
    hero_subtitle,
    hero_description,
    hero_section_visible,
    featured_courses_visible,
    about_visible,
    companies_visible,
    testimonials_visible,
    published_at,
    created_at,
    updated_at
)
SELECT
    2 as id,
    'ru' as locale,
    'AI Studio - Платформа онлайн-обучения' as title,
    'Добро пожаловать в AI Studio' as hero_title,
    'Платформа онлайн-обучения' as hero_subtitle,
    'Изучайте новейшие технологии с экспертами индустрии' as hero_description,
    true as hero_section_visible,
    true as featured_courses_visible,
    true as about_visible,
    true as companies_visible,
    true as testimonials_visible,
    NOW() as published_at,
    NOW() as created_at,
    NOW() as updated_at
WHERE NOT EXISTS (
    SELECT 1 FROM home_pages WHERE id = 2
);

-- Check if Hebrew record exists, if not create it
INSERT INTO home_pages (
    id,
    locale,
    title,
    hero_title,
    hero_subtitle,
    hero_description,
    hero_section_visible,
    featured_courses_visible,
    about_visible,
    companies_visible,
    testimonials_visible,
    published_at,
    created_at,
    updated_at
)
SELECT
    3 as id,
    'he' as locale,
    'AI Studio - פלטפורמת למידה מקוונת' as title,
    'ברוכים הבאים ל-AI Studio' as hero_title,
    'פלטפורמת למידה מקוונת' as hero_subtitle,
    'למדו את הטכנולוגיות החדשות ביותר עם מומחי התעשייה' as hero_description,
    true as hero_section_visible,
    true as featured_courses_visible,
    true as about_visible,
    true as companies_visible,
    true as testimonials_visible,
    NOW() as published_at,
    NOW() as created_at,
    NOW() as updated_at
WHERE NOT EXISTS (
    SELECT 1 FROM home_pages WHERE id = 3
);

-- Ensure English record has locale set
UPDATE home_pages
SET locale = 'en'
WHERE id = 1 AND (locale IS NULL OR locale = '');

-- Add index for faster locale lookups
CREATE INDEX IF NOT EXISTS idx_home_pages_locale ON home_pages(locale);

-- Verify all three language records exist
SELECT id, locale, title, hero_title
FROM home_pages
WHERE id IN (1, 2, 3)
ORDER BY id;