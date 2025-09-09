-- Multi-Language Quick Implementation
-- Step 1: Add locale support to all tables

ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS locale VARCHAR(5) DEFAULT 'en';
ALTER TABLE courses ADD COLUMN IF NOT EXISTS locale VARCHAR(5) DEFAULT 'en';
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS locale VARCHAR(5) DEFAULT 'en';
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS locale VARCHAR(5) DEFAULT 'en';
ALTER TABLE contact_pages ADD COLUMN IF NOT EXISTS locale VARCHAR(5) DEFAULT 'en';

-- Step 2: Update existing records to English
UPDATE home_pages SET locale = 'en' WHERE locale IS NULL;
UPDATE courses SET locale = 'en' WHERE locale IS NULL;
UPDATE blog_posts SET locale = 'en' WHERE locale IS NULL;
UPDATE teachers SET locale = 'en' WHERE locale IS NULL;
UPDATE contact_pages SET locale = 'en' WHERE locale IS NULL;

-- Step 3: Create Russian translations for home page
INSERT INTO home_pages (
  locale, title, 
  hero_title, hero_subtitle, hero_description, hero_section_visible,
  featured_courses_title, featured_courses_description, featured_courses_visible,
  about_title, about_subtitle, about_description, about_visible,
  companies_title, companies_description, companies_visible,
  testimonials_title, testimonials_subtitle, testimonials_visible,
  course_1_title, course_1_rating, course_1_lessons, course_1_duration, course_1_category, course_1_visible,
  course_2_title, course_2_rating, course_2_lessons, course_2_duration, course_2_category, course_2_visible,
  course_3_title, course_3_rating, course_3_lessons, course_3_duration, course_3_category, course_3_visible,
  course_4_title, course_4_rating, course_4_lessons, course_4_duration, course_4_category, course_4_visible,
  course_5_title, course_5_rating, course_5_lessons, course_5_duration, course_5_category, course_5_visible,
  course_6_title, course_6_rating, course_6_lessons, course_6_duration, course_6_category, course_6_visible,
  testimonial_1_text, testimonial_1_author, testimonial_1_rating, testimonial_1_visible,
  testimonial_2_text, testimonial_2_author, testimonial_2_rating, testimonial_2_visible,
  testimonial_3_text, testimonial_3_author, testimonial_3_rating, testimonial_3_visible,
  testimonial_4_text, testimonial_4_author, testimonial_4_rating, testimonial_4_visible,
  published_at, created_at, updated_at
) VALUES (
  'ru', 'AI Studio - Платформа онлайн-обучения от экспертов',
  'Освойте ИИ и технологии', 'Трансформируйте карьеру с курсами от экспертов', 'Присоединяйтесь к тысячам студентов, изучающих передовые технологии', true,
  'Популярные курсы', 'Изучите наши самые популярные курсы от экспертов индустрии', true,
  'О AI Studio', 'Ваш путь к успеху', 'Мы предоставляем образование мирового класса в области ИИ и машинного обучения', true,
  'Нам доверяют ведущие компании', 'Наши выпускники работают в топовых технологических компаниях', true,
  'Истории успеха студентов', 'Отзывы наших выпускников', true,
  'Введение в машинное обучение', '4.9', '24 урока', '8 недель', 'ИИ и МО', true,
  'Продвинутое программирование на Python', '4.8', '32 урока', '10 недель', 'Программирование', true,
  'Основы науки о данных', '4.9', '28 уроков', '12 недель', 'Data Science', true,
  'Буткемп веб-разработки', '4.7', '45 уроков', '16 недель', 'Веб-разработка', true,
  'Основы облачных вычислений', '4.8', '20 уроков', '6 недель', 'Облако', true,
  'Основы кибербезопасности', '4.9', '18 уроков', '8 недель', 'Безопасность', true,
  'Этот курс изменил мою жизнь! Я прошел путь от нуля до работы в технологической компании.', 'Сара Джонсон', '5.0', true,
  'Преподаватели потрясающие, а контент всегда соответствует стандартам индустрии.', 'Михаил Чен', '5.0', true,
  'Лучшая инвестиция в мою карьеру. Практические проекты действительно подготовили меня.', 'Эмма Дэвис', '5.0', true,
  'Поддержка сообщества и менторство сделали всю разницу в моем обучении.', 'Алекс Родригес', '5.0', true,
  NOW(), NOW(), NOW()
);

-- Step 4: Create Hebrew translations for home page
INSERT INTO home_pages (
  locale, title,
  hero_title, hero_subtitle, hero_description, hero_section_visible,
  featured_courses_title, featured_courses_description, featured_courses_visible,
  about_title, about_subtitle, about_description, about_visible,
  companies_title, companies_description, companies_visible,
  testimonials_title, testimonials_subtitle, testimonials_visible,
  course_1_title, course_1_rating, course_1_lessons, course_1_duration, course_1_category, course_1_visible,
  course_2_title, course_2_rating, course_2_lessons, course_2_duration, course_2_category, course_2_visible,
  course_3_title, course_3_rating, course_3_lessons, course_3_duration, course_3_category, course_3_visible,
  course_4_title, course_4_rating, course_4_lessons, course_4_duration, course_4_category, course_4_visible,
  course_5_title, course_5_rating, course_5_lessons, course_5_duration, course_5_category, course_5_visible,
  course_6_title, course_6_rating, course_6_lessons, course_6_duration, course_6_category, course_6_visible,
  testimonial_1_text, testimonial_1_author, testimonial_1_rating, testimonial_1_visible,
  testimonial_2_text, testimonial_2_author, testimonial_2_rating, testimonial_2_visible,
  testimonial_3_text, testimonial_3_author, testimonial_3_rating, testimonial_3_visible,
  testimonial_4_text, testimonial_4_author, testimonial_4_rating, testimonial_4_visible,
  published_at, created_at, updated_at
) VALUES (
  'he', 'AI Studio - פלטפורמת למידה מקוונת בהובלת מומחים',
  'שלטו ב-AI וטכנולוגיה', 'שנו את הקריירה שלכם עם קורסים מומחים', 'הצטרפו לאלפי סטודנטים הלומדים טכנולוגיה מתקדמת', true,
  'קורסים מומלצים', 'חקרו את הקורסים הפופולריים ביותר שלנו מאת מומחי התעשייה', true,
  'אודות AI Studio', 'הדרך שלכם להצלחה', 'אנו מספקים חינוך ברמה עולמית ב-AI ולמידת מכונה', true,
  'חברות מובילות סומכות עלינו', 'הבוגרים שלנו עובדים בחברות הטכנולוגיה המובילות', true,
  'סיפורי הצלחה של סטודנטים', 'שמעו מהבוגרים המצליחים שלנו', true,
  'מבוא ללמידת מכונה', '4.9', '24 שיעורים', '8 שבועות', 'AI ו-ML', true,
  'תכנות Python מתקדם', '4.8', '32 שיעורים', '10 שבועות', 'תכנות', true,
  'יסודות מדע הנתונים', '4.9', '28 שיעורים', '12 שבועות', 'מדע נתונים', true,
  'בוטקמפ פיתוח אתרים', '4.7', '45 שיעורים', '16 שבועות', 'פיתוח ווב', true,
  'יסודות מחשוב ענן', '4.8', '20 שיעורים', '6 שבועות', 'ענן', true,
  'יסודות אבטחת סייבר', '4.9', '18 שיעורים', '8 שבועות', 'אבטחה', true,
  'הקורס הזה שינה את חיי! עברתי מאפס ניסיון בתכנות לעבודה בחברת טכנולוגיה.', 'שרה ג׳ונסון', '5.0', true,
  'המדריכים מדהימים והתוכן תמיד מעודכן לסטנדרטים של התעשייה.', 'מייקל צ׳ן', '5.0', true,
  'ההשקעה הטובה ביותר שעשיתי בקריירה שלי. הפרויקטים המעשיים באמת הכינו אותי.', 'אמה דייוויס', '5.0', true,
  'התמיכה של הקהילה והחניכה עשו את כל ההבדל במסע הלמידה שלי.', 'אלכס רודריגז', '5.0', true,
  NOW(), NOW(), NOW()
);

-- Step 5: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_home_pages_locale ON home_pages(locale);
CREATE INDEX IF NOT EXISTS idx_courses_locale ON courses(locale);
CREATE INDEX IF NOT EXISTS idx_blog_posts_locale ON blog_posts(locale);
CREATE INDEX IF NOT EXISTS idx_teachers_locale ON teachers(locale);
CREATE INDEX IF NOT EXISTS idx_contact_pages_locale ON contact_pages(locale);

-- Step 6: Add Russian courses
INSERT INTO courses (locale, title, description, price, duration, lessons, category, rating, visible, published_at, created_at, updated_at)
VALUES 
  ('ru', 'Введение в машинное обучение', 'Изучите основы алгоритмов МО и их применение', 299, '8 недель', '24 урока', 'ИИ и МО', '4.9', true, NOW(), NOW(), NOW()),
  ('ru', 'Продвинутое программирование на Python', 'Освойте Python для data science и веб-разработки', 249, '10 недель', '32 урока', 'Программирование', '4.8', true, NOW(), NOW(), NOW()),
  ('ru', 'Основы науки о данных', 'Полное руководство по анализу данных и визуализации', 399, '12 недель', '28 уроков', 'Data Science', '4.9', true, NOW(), NOW(), NOW()),
  ('ru', 'Буткемп веб-разработки', 'Full-stack разработка с современными технологиями', 499, '16 недель', '45 уроков', 'Веб-разработка', '4.7', true, NOW(), NOW(), NOW());

-- Step 7: Add Hebrew courses
INSERT INTO courses (locale, title, description, price, duration, lessons, category, rating, visible, published_at, created_at, updated_at)
VALUES 
  ('he', 'מבוא ללמידת מכונה', 'למדו את היסודות של אלגוריתמי ML ויישומים', 299, '8 שבועות', '24 שיעורים', 'AI ו-ML', '4.9', true, NOW(), NOW(), NOW()),
  ('he', 'תכנות Python מתקדם', 'שלטו ב-Python למדע נתונים ופיתוח אתרים', 249, '10 שבועות', '32 שיעורים', 'תכנות', '4.8', true, NOW(), NOW(), NOW()),
  ('he', 'יסודות מדע הנתונים', 'מדריך מלא לניתוח נתונים והדמיה', 399, '12 שבועות', '28 שיעורים', 'מדע נתונים', '4.9', true, NOW(), NOW(), NOW()),
  ('he', 'בוטקמפ פיתוח אתרים', 'פיתוח Full-stack עם טכנולוגיות מודרניות', 499, '16 שבועות', '45 שיעורים', 'פיתוח ווב', '4.7', true, NOW(), NOW(), NOW());

-- Step 8: Add contact pages for other languages
INSERT INTO contact_pages (locale, phone, email, address, office_hours, map_url, published_at, created_at, updated_at)
VALUES 
  ('ru', '+7 (495) 123-45-67', 'info@aistudio555.ru', 'ул. Технологическая 123, Москва, 101000', 'Понедельник-Пятница: 9:00 - 18:00', 'https://maps.google.com/?q=Moscow', NOW(), NOW(), NOW()),
  ('he', '+972-3-123-4567', 'info@aistudio555.co.il', 'רחוב הטכנולוגיה 123, תל אביב', 'ראשון-חמישי: 9:00 - 18:00', 'https://maps.google.com/?q=Tel+Aviv', NOW(), NOW(), NOW());

-- Step 9: Verify data
SELECT locale, COUNT(*) as count FROM home_pages GROUP BY locale;
SELECT locale, COUNT(*) as count FROM courses GROUP BY locale;
SELECT locale, COUNT(*) as count FROM contact_pages GROUP BY locale;