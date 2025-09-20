-- Fix nd_courses table for proper multi-column translation support
-- Date: 2025-09-20

-- Step 1: Add missing translation columns to nd_courses
ALTER TABLE nd_courses
ADD COLUMN IF NOT EXISTS description_ru TEXT,
ADD COLUMN IF NOT EXISTS description_he TEXT,
ADD COLUMN IF NOT EXISTS short_description_ru TEXT,
ADD COLUMN IF NOT EXISTS short_description_he TEXT;

-- Step 2: Fix corrupted data - Russian text in English field for course ID 2
UPDATE nd_courses
SET
    title_ru = title,  -- Move Russian title to correct column
    title = 'React & Redux Masterclass',  -- Set proper English title
    description_ru = description,  -- Move Russian description to correct column
    description = 'Master React.js and Redux for building scalable single-page applications. Learn component architecture, state management, hooks, and best practices for production-ready React apps. Includes real-world projects and deployment strategies.'
WHERE id = 2;

-- Step 3: Fix course ID 3 if needed
UPDATE nd_courses
SET
    title_ru = 'Разработка Backend на Node.js',
    description_ru = 'Станьте экспертом по backend с Node.js, Express и MongoDB. Научитесь создавать RESTful API, обрабатывать аутентификацию, внедрять лучшие практики безопасности и развертывать масштабируемые серверные приложения.'
WHERE id = 3 AND title = 'Node.js Backend Development';

-- Step 4: Add Hebrew translations for existing courses
UPDATE nd_courses
SET
    title_he = 'מאסטר-קלאס React ו-Redux',
    description_he = 'למדו React.js ו-Redux לבניית אפליקציות חד-עמודיות ניתנות להרחבה. למדו ארכיטקטורת רכיבים, ניהול מצב, hooks ושיטות מומלצות לאפליקציות React מוכנות לייצור.'
WHERE id = 2;

UPDATE nd_courses
SET
    title_he = 'פיתוח Backend עם Node.js',
    description_he = 'הפכו למומחי backend עם Node.js, Express ו-MongoDB. למדו לבנות RESTful APIs, לטפל באימות, ליישם שיטות אבטחה מומלצות ולפרוס אפליקציות שרת ניתנות להרחבה.'
WHERE id = 3;

UPDATE nd_courses
SET
    title_he = 'Python למדע הנתונים',
    description_he = 'שחררו את הכוח של Python לניתוח נתונים ולמידת מכונה. שלטו ב-pandas, NumPy, matplotlib ו-scikit-learn לניתוח נתונים, יצירת ויזואליזציות ובניית מודלים ניבויים.'
WHERE id = 4 AND title = 'Python for Data Science';

-- Step 5: Verify the changes
SELECT
    id,
    title,
    title_ru,
    title_he,
    CASE
        WHEN title_ru IS NOT NULL THEN '✅'
        ELSE '❌'
    END as has_russian,
    CASE
        WHEN title_he IS NOT NULL THEN '✅'
        ELSE '❌'
    END as has_hebrew
FROM nd_courses
ORDER BY id;

-- Step 6: Update default values for new courses
ALTER TABLE nd_courses
ALTER COLUMN title_ru SET DEFAULT NULL,
ALTER COLUMN title_he SET DEFAULT NULL,
ALTER COLUMN description_ru SET DEFAULT NULL,
ALTER COLUMN description_he SET DEFAULT NULL;

-- Done! The nd_courses table now has proper multi-column translation support