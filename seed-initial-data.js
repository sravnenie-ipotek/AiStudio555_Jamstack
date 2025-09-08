/**
 * Multi-Language Seed Initial Data for Railway PostgreSQL
 * This script populates the database with initial content in English, Russian, and Hebrew
 */

const { Client } = require('pg');

async function seedDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('🔗 Connected to PostgreSQL');

    // 0. Add locale columns if they don't exist
    console.log('📊 Adding locale support to tables...');
    
    const alterQueries = [
      'ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS locale VARCHAR(5) DEFAULT \'en\'',
      'ALTER TABLE courses ADD COLUMN IF NOT EXISTS locale VARCHAR(5) DEFAULT \'en\'',
      'ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS locale VARCHAR(5) DEFAULT \'en\'',
      'ALTER TABLE teachers ADD COLUMN IF NOT EXISTS locale VARCHAR(5) DEFAULT \'en\'',
      'ALTER TABLE contact_pages ADD COLUMN IF NOT EXISTS locale VARCHAR(5) DEFAULT \'en\''
    ];

    for (const query of alterQueries) {
      try {
        await client.query(query);
      } catch (error) {
        console.log(`⚠️  Column may already exist: ${error.message}`);
      }
    }

    // Update existing records to have 'en' locale
    await client.query('UPDATE home_pages SET locale = \'en\' WHERE locale IS NULL');
    await client.query('UPDATE courses SET locale = \'en\' WHERE locale IS NULL');
    await client.query('UPDATE blog_posts SET locale = \'en\' WHERE locale IS NULL');
    await client.query('UPDATE teachers SET locale = \'en\' WHERE locale IS NULL');
    await client.query('UPDATE contact_pages SET locale = \'en\' WHERE locale IS NULL');

    // Create unique constraints for locale columns
    console.log('🔒 Creating unique constraints for locale columns...');
    const constraintQueries = [
      'ALTER TABLE home_pages ADD CONSTRAINT IF NOT EXISTS unique_home_page_locale UNIQUE (locale)',
      'ALTER TABLE courses ADD CONSTRAINT IF NOT EXISTS unique_course_locale UNIQUE (locale)',
      'ALTER TABLE blog_posts ADD CONSTRAINT IF NOT EXISTS unique_blog_post_locale UNIQUE (locale)',
      'ALTER TABLE teachers ADD CONSTRAINT IF NOT EXISTS unique_teacher_locale UNIQUE (locale)',
      'ALTER TABLE contact_pages ADD CONSTRAINT IF NOT EXISTS unique_contact_page_locale UNIQUE (locale)'
    ];

    for (const query of constraintQueries) {
      try {
        await client.query(query);
      } catch (error) {
        console.log('⚠️ Constraint might already exist:', error.message);
      }
    }

    // 1. Insert English home page data
    console.log('🇬🇧 Creating English home page content...');
    await client.query(`
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
        'en', 'AI Studio - Expert-Led Online Learning Platform',
        'Master AI & Technology', 'Transform Your Career with Expert-Led Courses', 'Join thousands of students learning cutting-edge technology from industry experts', true,
        'Featured Courses', 'Explore our most popular courses designed by industry experts', true,
        'About AI Studio', 'Your Path to Success', 'We provide world-class education in AI, Machine Learning, and modern technology', true,
        'Trusted by Leading Companies', 'Our graduates work at top technology companies worldwide', true,
        'Student Success Stories', 'Hear from our successful graduates', true,
        'Introduction to Machine Learning', '4.9', '24 Lessons', '8 Weeks', 'AI & ML', true,
        'Advanced Python Programming', '4.8', '32 Lessons', '10 Weeks', 'Programming', true,
        'Data Science Fundamentals', '4.9', '28 Lessons', '12 Weeks', 'Data Science', true,
        'Web Development Bootcamp', '4.7', '45 Lessons', '16 Weeks', 'Web Dev', true,
        'Cloud Computing Essentials', '4.8', '20 Lessons', '6 Weeks', 'Cloud', true,
        'Cybersecurity Basics', '4.9', '18 Lessons', '8 Weeks', 'Security', true,
        'This course changed my life! I went from zero coding experience to landing a job at a tech company.', 'Sarah Johnson', '5.0', true,
        'The instructors are amazing and the content is always up-to-date with industry standards.', 'Michael Chen', '5.0', true,
        'Best investment I ever made in my career. The practical projects really prepared me for real work.', 'Emma Davis', '5.0', true,
        'The community support and mentorship made all the difference in my learning journey.', 'Alex Rodriguez', '5.0', true,
        NOW(), NOW(), NOW()
      ) ON CONFLICT (locale) DO UPDATE SET
        updated_at = NOW()
    `);

    // 2. Insert Russian home page data
    console.log('🇷🇺 Creating Russian home page content...');
    await client.query(`
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
      ) ON CONFLICT (locale) DO UPDATE SET
        updated_at = NOW()
    `);

    // 3. Insert Hebrew home page data
    console.log('🇮🇱 Creating Hebrew home page content...');
    await client.query(`
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
      ) ON CONFLICT (locale) DO UPDATE SET
        updated_at = NOW()
    `);

    // 4. Insert courses for all languages
    console.log('📚 Creating sample courses...');
    
    // English courses
    const englishCourses = [
      ['en', 'Introduction to Machine Learning', 'Learn the fundamentals of ML algorithms and applications', 299, '8 Weeks', '24 Lessons', 'AI & ML', '4.9', true],
      ['en', 'Advanced Python Programming', 'Master Python for data science and web development', 249, '10 Weeks', '32 Lessons', 'Programming', '4.8', true],
      ['en', 'Data Science Fundamentals', 'Complete guide to data analysis and visualization', 399, '12 Weeks', '28 Lessons', 'Data Science', '4.9', true],
      ['en', 'Web Development Bootcamp', 'Full-stack development with modern technologies', 499, '16 Weeks', '45 Lessons', 'Web Dev', '4.7', true]
    ];

    // Russian courses
    const russianCourses = [
      ['ru', 'Введение в машинное обучение', 'Изучите основы алгоритмов МО и их применение', 299, '8 недель', '24 урока', 'ИИ и МО', '4.9', true],
      ['ru', 'Продвинутое программирование на Python', 'Освойте Python для data science и веб-разработки', 249, '10 недель', '32 урока', 'Программирование', '4.8', true],
      ['ru', 'Основы науки о данных', 'Полное руководство по анализу данных и визуализации', 399, '12 недель', '28 уроков', 'Data Science', '4.9', true],
      ['ru', 'Буткемп веб-разработки', 'Full-stack разработка с современными технологиями', 499, '16 недель', '45 уроков', 'Веб-разработка', '4.7', true]
    ];

    // Hebrew courses
    const hebrewCourses = [
      ['he', 'מבוא ללמידת מכונה', 'למדו את היסודות של אלגוריתמי ML ויישומים', 299, '8 שבועות', '24 שיעורים', 'AI ו-ML', '4.9', true],
      ['he', 'תכנות Python מתקדם', 'שלטו ב-Python למדע נתונים ופיתוח אתרים', 249, '10 שבועות', '32 שיעורים', 'תכנות', '4.8', true],
      ['he', 'יסודות מדע הנתונים', 'מדריך מלא לניתוח נתונים והדמיה', 399, '12 שבועות', '28 שיעורים', 'מדע נתונים', '4.9', true],
      ['he', 'בוטקמפ פיתוח אתרים', 'פיתוח Full-stack עם טכנולוגיות מודרניות', 499, '16 שבועות', '45 שיעורים', 'פיתוח ווב', '4.7', true]
    ];

    const allCourses = [...englishCourses, ...russianCourses, ...hebrewCourses];

    for (const [locale, title, description, price, duration, lessons, category, rating, visible] of allCourses) {
      await client.query(`
        INSERT INTO courses (locale, title, description, price, duration, lessons, category, rating, visible, published_at, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW(), NOW())
        ON CONFLICT DO NOTHING
      `, [locale, title, description, price, duration, lessons, category, rating, visible]);
    }

    // 5. Insert contact pages for all languages
    console.log('📞 Creating contact pages...');
    const contactPages = [
      ['en', '+1 (555) 123-4567', 'info@aistudio555.com', '123 Tech Street, Silicon Valley, CA 94025', 'Monday-Friday: 9:00 AM - 6:00 PM', 'https://maps.google.com/?q=Silicon+Valley'],
      ['ru', '+7 (495) 123-45-67', 'info@aistudio555.ru', 'ул. Технологическая 123, Москва, 101000', 'Понедельник-Пятница: 9:00 - 18:00', 'https://maps.google.com/?q=Moscow'],
      ['he', '+972-3-123-4567', 'info@aistudio555.co.il', 'רחוב הטכנולוגיה 123, תל אביב', 'ראשון-חמישי: 9:00 - 18:00', 'https://maps.google.com/?q=Tel+Aviv']
    ];

    for (const [locale, phone, email, address, officeHours, mapUrl] of contactPages) {
      await client.query(`
        INSERT INTO contact_pages (locale, phone, email, address, office_hours, map_url, published_at, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW(), NOW())
        ON CONFLICT DO NOTHING
      `, [locale, phone, email, address, officeHours, mapUrl]);
    }

    // 6. Insert teachers for all languages
    console.log('👨‍🏫 Creating sample teachers...');
    const allTeachers = [
      // English
      ['en', 'Dr. Sarah Smith', 'Lead AI Instructor', 'PhD in Machine Learning with 10+ years of experience', 'https://linkedin.com/in/sarah', 'https://twitter.com/sarah', 1],
      ['en', 'Prof. John Davis', 'Senior Data Scientist', 'Expert in Python and data analysis', 'https://linkedin.com/in/john', 'https://twitter.com/john', 2],
      ['en', 'Emma Wilson', 'Web Development Expert', 'Full-stack developer and educator', 'https://linkedin.com/in/emma', 'https://twitter.com/emma', 3],
      // Russian  
      ['ru', 'Др. Сара Смит', 'Ведущий инструктор по ИИ', 'PhD в области машинного обучения с 10+ летним опытом', 'https://linkedin.com/in/sarah', 'https://twitter.com/sarah', 1],
      ['ru', 'Проф. Джон Дэвис', 'Старший специалист по данным', 'Эксперт по Python и анализу данных', 'https://linkedin.com/in/john', 'https://twitter.com/john', 2],
      ['ru', 'Эмма Уилсон', 'Эксперт веб-разработки', 'Full-stack разработчик и преподаватель', 'https://linkedin.com/in/emma', 'https://twitter.com/emma', 3],
      // Hebrew
      ['he', 'ד״ר שרה סמית', 'מדריכה ראשית ב-AI', 'דוקטור בלמידת מכונה עם 10+ שנות ניסיון', 'https://linkedin.com/in/sarah', 'https://twitter.com/sarah', 1],
      ['he', 'פרופ׳ ג׳ון דייוויס', 'מדען נתונים בכיר', 'מומחה ב-Python וניתוח נתונים', 'https://linkedin.com/in/john', 'https://twitter.com/john', 2],
      ['he', 'אמה ווילסון', 'מומחית פיתוח אתרים', 'מפתחת Full-stack ומחנכת', 'https://linkedin.com/in/emma', 'https://twitter.com/emma', 3]
    ];

    for (const [locale, name, role, bio, linkedin, twitter, order] of allTeachers) {
      await client.query(`
        INSERT INTO teachers (locale, name, role, bio, linkedin, twitter, "order", published_at, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW(), NOW())
        ON CONFLICT DO NOTHING
      `, [locale, name, role, bio, linkedin, twitter, order]);
    }

    // 7. Insert blog posts for all languages
    console.log('📰 Creating sample blog posts...');
    const allBlogPosts = [
      // English
      ['en', 'Getting Started with AI', 'getting-started-ai', 'A comprehensive guide for beginners', 'Learn the basics of artificial intelligence...', 'AI Studio Team', 'Technology'],
      ['en', 'Top 10 Python Libraries', 'top-python-libraries', 'Essential tools for data science', 'Discover the most important Python libraries...', 'Dr. Smith', 'Programming'],
      ['en', 'Future of Machine Learning', 'future-of-ml', 'Trends and predictions for 2025', 'Explore what the future holds for ML...', 'Prof. Johnson', 'AI & ML'],
      // Russian
      ['ru', 'Начало работы с ИИ', 'nachalo-raboty-s-ii', 'Полное руководство для начинающих', 'Изучите основы искусственного интеллекта...', 'Команда AI Studio', 'Технологии'],
      ['ru', 'Топ 10 библиотек Python', 'top-10-bibliotek-python', 'Необходимые инструменты для data science', 'Откройте важнейшие библиотеки Python...', 'Др. Смит', 'Программирование'],
      ['ru', 'Будущее машинного обучения', 'budushchee-mashinnogo-obucheniya', 'Тренды и прогнозы на 2025 год', 'Исследуйте будущее МО...', 'Проф. Джонсон', 'ИИ и МО'],
      // Hebrew
      ['he', 'תחילת העבודה עם AI', 'hatchalat-avoda-ai', 'מדריך מקיף למתחילים', 'למדו את יסודות הבינה המלאכותית...', 'צוות AI Studio', 'טכנולוגיה'],
      ['he', 'עשרת ספריות Python המובילות', 'eseret-sfariot-python', 'כלים חיוניים למדע הנתונים', 'גלו את ספריות Python החשובות ביותר...', 'ד״ר סמית', 'תכנות'],
      ['he', 'עתיד למידת המכונה', 'atid-lemidat-hamechona', 'מגמות ותחזיות ל-2025', 'חקרו מה העתיד צופן ללמידת מכונה...', 'פרופ׳ ג׳ונסון', 'AI ו-ML']
    ];

    for (const [locale, title, slug, excerpt, content, author, category] of allBlogPosts) {
      await client.query(`
        INSERT INTO blog_posts (locale, title, slug, excerpt, content, author, category, published_at, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW(), NOW())
        ON CONFLICT DO NOTHING
      `, [locale, title, slug, excerpt, content, author, category]);
    }

    // 8. Create indexes for better performance
    console.log('🔍 Creating locale indexes...');
    const indexQueries = [
      'CREATE INDEX IF NOT EXISTS idx_home_pages_locale ON home_pages(locale)',
      'CREATE INDEX IF NOT EXISTS idx_courses_locale ON courses(locale)',
      'CREATE INDEX IF NOT EXISTS idx_blog_posts_locale ON blog_posts(locale)',
      'CREATE INDEX IF NOT EXISTS idx_teachers_locale ON teachers(locale)',
      'CREATE INDEX IF NOT EXISTS idx_contact_pages_locale ON contact_pages(locale)'
    ];

    for (const query of indexQueries) {
      await client.query(query);
    }

    // 9. Verify seeding
    console.log('🔍 Verifying multi-language data...');
    const verifyQueries = [
      'SELECT locale, COUNT(*) as count FROM home_pages GROUP BY locale ORDER BY locale',
      'SELECT locale, COUNT(*) as count FROM courses GROUP BY locale ORDER BY locale',
      'SELECT locale, COUNT(*) as count FROM contact_pages GROUP BY locale ORDER BY locale',
      'SELECT locale, COUNT(*) as count FROM teachers GROUP BY locale ORDER BY locale',
      'SELECT locale, COUNT(*) as count FROM blog_posts GROUP BY locale ORDER BY locale'
    ];

    for (const query of verifyQueries) {
      const result = await client.query(query);
      console.log(`📊 ${query.split(' FROM ')[1].split(' GROUP')[0]}:`, result.rows);
    }

    console.log('✅ Multi-language database seeded successfully!');
    console.log('🌍 Available locales: English (en), Russian (ru), Hebrew (he)');
    
  } catch (error) {
    console.error('❌ Seeding error:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Run if called directly
if (require.main === module) {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is required');
    console.log('Usage: DATABASE_URL=postgresql://... node seed-initial-data.js');
    process.exit(1);
  }
  
  seedDatabase().catch(console.error);
}

module.exports = { seedDatabase };