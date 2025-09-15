-- Migration: Add FAQ JSON columns to pages tables
-- This adds JSON columns to store FAQ items as structured data

-- Add faq_items column to home_pages table
ALTER TABLE home_pages
ADD COLUMN IF NOT EXISTS faq_items JSON;

-- Add faq_items column to courses table (for course-specific FAQs)
ALTER TABLE courses
ADD COLUMN IF NOT EXISTS faq_items JSON;

-- Add faq_items column to career_orientation_pages table
ALTER TABLE career_orientation_pages
ADD COLUMN IF NOT EXISTS faq_items JSON;

-- Add faq_items column to career_center_pages table (if exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'career_center_pages') THEN
        ALTER TABLE career_center_pages ADD COLUMN IF NOT EXISTS faq_items JSON;
    END IF;
END $$;

-- Update existing FAQ data to JSON format (for home_pages)
-- This preserves existing FAQ titles and answers if they exist
UPDATE home_pages
SET faq_items = json_build_array(
    json_build_object(
        'title', COALESCE(faq_1_title, 'What courses do you offer?'),
        'answer', COALESCE(faq_1_answer, 'We offer comprehensive courses in AI, Machine Learning, Data Science, and Web Development.')
    ),
    json_build_object(
        'title', COALESCE(faq_2_title, 'How long are the courses?'),
        'answer', COALESCE(faq_2_answer, 'Our courses typically range from 8 to 12 weeks, with flexible scheduling options.')
    ),
    json_build_object(
        'title', COALESCE(faq_3_title, 'Do you provide certificates?'),
        'answer', COALESCE(faq_3_answer, 'Yes, all students receive a verified certificate upon successful completion.')
    ),
    json_build_object(
        'title', COALESCE(faq_4_title, 'Is career support included?'),
        'answer', COALESCE(faq_4_answer, 'Absolutely! We provide career guidance, resume reviews, and job placement assistance.')
    ),
    json_build_object(
        'title', COALESCE(faq_5_title, 'What are the prerequisites?'),
        'answer', COALESCE(faq_5_answer, 'Basic computer skills are required. Programming experience is helpful but not mandatory.')
    ),
    json_build_object(
        'title', COALESCE(faq_6_title, 'Can I learn at my own pace?'),
        'answer', COALESCE(faq_6_answer, 'Yes, we offer both self-paced and instructor-led options to suit your schedule.')
    )
)
WHERE faq_items IS NULL
  AND (faq_1_title IS NOT NULL OR faq_2_title IS NOT NULL OR faq_3_title IS NOT NULL);

-- Add Hebrew FAQ data for Hebrew locale pages
UPDATE home_pages
SET faq_items = json_build_array(
    json_build_object(
        'title', 'קורסים מוצעים',
        'answer', 'אנו מציעים קורסים מקיפים ב-AI, למידת מכונה, מדע הנתונים ופיתוח אתרים.'
    ),
    json_build_object(
        'title', 'משך הקורסים',
        'answer', 'הקורסים שלנו נמשכים בדרך כלל בין 8 ל-12 שבועות, עם אפשרויות תזמון גמישות.'
    ),
    json_build_object(
        'title', 'תעודות והסמכה',
        'answer', 'כן, כל הסטודנטים מקבלים תעודה מאומתת עם השלמה מוצלחת.'
    ),
    json_build_object(
        'title', 'תמיכה בקריירה',
        'answer', 'בהחלט! אנו מספקים הדרכה קריירה, ביקורות קורות חיים וסיוע בהשמה.'
    ),
    json_build_object(
        'title', 'דרישות קדם',
        'answer', 'נדרשות מיומנויות מחשב בסיסיות. ניסיון בתכנות מועיל אך לא חובה.'
    ),
    json_build_object(
        'title', 'למידה בקצב אישי',
        'answer', 'כן, אנו מציעים אפשרויות ללמידה עצמית וגם עם מדריך כדי להתאים ללוח הזמנים שלך.'
    )
)
WHERE locale = 'he' AND faq_items IS NULL;

-- Add Russian FAQ data for Russian locale pages
UPDATE home_pages
SET faq_items = json_build_array(
    json_build_object(
        'title', 'Какие курсы вы предлагаете?',
        'answer', 'Мы предлагаем комплексные курсы по ИИ, машинному обучению, науке о данных и веб-разработке.'
    ),
    json_build_object(
        'title', 'Какова продолжительность курсов?',
        'answer', 'Наши курсы обычно длятся от 8 до 12 недель с гибким расписанием.'
    ),
    json_build_object(
        'title', 'Выдаете ли вы сертификаты?',
        'answer', 'Да, все студенты получают подтвержденный сертификат после успешного завершения.'
    ),
    json_build_object(
        'title', 'Включена ли поддержка карьеры?',
        'answer', 'Конечно! Мы предоставляем карьерное руководство, проверку резюме и помощь в трудоустройстве.'
    ),
    json_build_object(
        'title', 'Каковы предварительные требования?',
        'answer', 'Требуются базовые навыки работы с компьютером. Опыт программирования полезен, но не обязателен.'
    ),
    json_build_object(
        'title', 'Могу ли я учиться в своем темпе?',
        'answer', 'Да, мы предлагаем варианты самостоятельного обучения и с преподавателем.'
    )
)
WHERE locale = 'ru' AND faq_items IS NULL;

-- Create index for better JSON query performance (PostgreSQL)
-- Note: SQLite doesn't support JSON indexes, so this will be skipped there
DO $$
BEGIN
    IF current_database() != 'test.db' THEN
        CREATE INDEX IF NOT EXISTS idx_home_pages_faq_items ON home_pages USING GIN ((faq_items::jsonb));
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        -- Ignore if not PostgreSQL
        NULL;
END $$;

-- Add comment for documentation
COMMENT ON COLUMN home_pages.faq_items IS 'JSON array of FAQ objects with title and answer fields';