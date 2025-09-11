-- Add language identifiers to home_pages table
-- This will help distinguish between language versions in admin

-- Add locale field if it doesn't exist
ALTER TABLE home_pages 
ADD COLUMN IF NOT EXISTS locale VARCHAR(5) DEFAULT 'en';

-- Add display_name field for admin interface
ALTER TABLE home_pages 
ADD COLUMN IF NOT EXISTS display_name VARCHAR(255);

-- Update existing entries with proper language identifiers
UPDATE home_pages 
SET 
    locale = 'en',
    display_name = '🇬🇧 EN - Home Page (English)'
WHERE id = 1;

UPDATE home_pages 
SET 
    locale = 'ru',
    display_name = '🇷🇺 RU - Главная страница (Русский)'
WHERE id = 2;

UPDATE home_pages 
SET 
    locale = 'he',
    display_name = '🇮🇱 HE - דף הבית (עברית)'
WHERE id = 3;

-- If there are no entries yet, insert them with proper identifiers
INSERT INTO home_pages (id, locale, display_name, title, hero_title, hero_subtitle, hero_description)
VALUES 
    (1, 'en', '🇬🇧 EN - Home Page (English)', 'AI Studio - Expert-Led Online Learning Platform', 'Master Technology', 'Transform Your Career', 'Join thousands of students learning cutting-edge technology from industry experts')
ON CONFLICT (id) DO UPDATE 
SET 
    locale = EXCLUDED.locale,
    display_name = EXCLUDED.display_name;

INSERT INTO home_pages (id, locale, display_name, title, hero_title, hero_subtitle, hero_description)
VALUES 
    (2, 'ru', '🇷🇺 RU - Главная страница (Русский)', 'AI Studio - Платформа онлайн-обучения от экспертов', 'Освойте технологии', 'Трансформируйте карьеру', 'Присоединяйтесь к тысячам студентов, изучающих передовые технологии')
ON CONFLICT (id) DO UPDATE 
SET 
    locale = EXCLUDED.locale,
    display_name = EXCLUDED.display_name;

INSERT INTO home_pages (id, locale, display_name, title, hero_title, hero_subtitle, hero_description)
VALUES 
    (3, 'he', '🇮🇱 HE - דף הבית (עברית)', 'AI Studio - פלטפורמת למידה מקוונת', 'לשלוט בטכנולוגיה', 'לשנות את הקריירה', 'הצטרפו לאלפי סטודנטים הלומדים טכנולוגיה מתקדמת')
ON CONFLICT (id) DO UPDATE 
SET 
    locale = EXCLUDED.locale,
    display_name = EXCLUDED.display_name;

-- Add index on locale for faster queries
CREATE INDEX IF NOT EXISTS idx_home_pages_locale ON home_pages(locale);