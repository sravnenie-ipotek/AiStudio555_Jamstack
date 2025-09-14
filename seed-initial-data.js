/**
 * Multi-Language Seed Initial Data for Railway PostgreSQL
 * This script populates the database with initial content in English, Russian, and Hebrew
 */

const { Client } = require('pg');

async function seedDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
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
      'ALTER TABLE contact_pages ADD COLUMN IF NOT EXISTS locale VARCHAR(5) DEFAULT \'en\'',
      'ALTER TABLE about_pages ADD COLUMN IF NOT EXISTS locale VARCHAR(5) DEFAULT \'en\'',
      'ALTER TABLE faqs ADD COLUMN IF NOT EXISTS locale VARCHAR(5) DEFAULT \'en\'',
      'ALTER TABLE career_resources ADD COLUMN IF NOT EXISTS locale VARCHAR(5) DEFAULT \'en\''
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
    await client.query('UPDATE about_pages SET locale = \'en\' WHERE locale IS NULL');
    await client.query('UPDATE faqs SET locale = \'en\' WHERE locale IS NULL');
    await client.query('UPDATE career_resources SET locale = \'en\' WHERE locale IS NULL');

    // Force re-seeding by clearing ALL data (including home pages)
    console.log('🧹 Force clearing ALL existing data for complete re-seed...');
    await client.query('DELETE FROM home_pages');
    await client.query('DELETE FROM courses');
    await client.query('DELETE FROM blog_posts');
    await client.query('DELETE FROM teachers');
    await client.query('DELETE FROM contact_pages');
    
    // Ensure about_pages table exists and has locale column
    console.log('🔧 Ensuring about_pages table structure...');
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS about_pages (
          id SERIAL PRIMARY KEY,
          locale VARCHAR(5) DEFAULT 'en',
          hero_title VARCHAR(255),
          hero_subtitle VARCHAR(255),
          mission_title VARCHAR(255),
          mission_description TEXT,
          vision_title VARCHAR(255),
          vision_description TEXT,
          published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
    } catch (error) {
      console.log('⚠️ About pages table creation:', error.message);
    }
    
    // Ensure faqs table exists and has locale column
    console.log('🔧 Ensuring faqs table structure...');
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS faqs (
          id SERIAL PRIMARY KEY,
          locale VARCHAR(5) DEFAULT 'en',
          question TEXT,
          answer TEXT,
          category VARCHAR(100),
          "order" INTEGER,
          published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
    } catch (error) {
      console.log('⚠️ FAQs table creation:', error.message);
    }
    
    // Ensure career_resources table exists and has locale column
    console.log('🔧 Ensuring career_resources table structure...');
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS career_resources (
          id SERIAL PRIMARY KEY,
          locale VARCHAR(5) DEFAULT 'en',
          title VARCHAR(255),
          description TEXT,
          type VARCHAR(50),
          category VARCHAR(100),
          download_url VARCHAR(500),
          visible BOOLEAN DEFAULT true,
          published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
    } catch (error) {
      console.log('⚠️ Career resources table creation:', error.message);
    }
    
    await client.query('DELETE FROM about_pages');
    await client.query('DELETE FROM faqs');
    await client.query('DELETE FROM career_resources');

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
      )
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
      )
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
      )
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
      `, [locale, title, slug, excerpt, content, author, category]);
    }

    // 8. Insert About Pages for all languages
    console.log('ℹ️ Creating about page content...');
    const aboutPages = [
      // English
      ['en', 'About AI Studio', 'Your Journey to Excellence Starts Here', 
       'Empowering Future Leaders', 'At AI Studio, we are dedicated to providing world-class education in artificial intelligence, machine learning, and cutting-edge technology. Our mission is to bridge the gap between academic learning and real-world application.',
       'Innovation Through Education', 'We envision a world where technology education is accessible, practical, and transformative. Our goal is to create a community of skilled professionals who can drive innovation and solve complex challenges.'],
      
      // Russian
      ['ru', 'О AI Studio', 'Ваш путь к совершенству начинается здесь', 
       'Воспитание будущих лидеров', 'В AI Studio мы предоставляем образование мирового класса в области искусственного интеллекта, машинного обучения и передовых технологий. Наша миссия - соединить академическое обучение с реальным применением.',
       'Инновации через образование', 'Мы видим мир, где технологическое образование доступно, практично и трансформационно. Наша цель - создать сообщество квалифицированных специалистов.'],
      
      // Hebrew
      ['he', 'אודות AI Studio', 'המסע שלכם למצוינות מתחיל כאן', 
       'מעצבים מנהיגי עתיד', 'ב-AI Studio אנו מספקים חינוך ברמה עולמית בבינה מלאכותית, למידת מכונה וטכנולוגיה מתקדמת. המשימה שלנו היא לגשר בין למידה אקדמית ליישום מעשי.',
       'חדשנות דרך חינוך', 'אנו רואים עולם בו חינוך טכנולוגי נגיש, מעשי ומשנה. המטרה שלנו היא ליצור קהילה של מקצוענים מיומנים.']
    ];
    
    for (const [locale, heroTitle, heroSubtitle, missionTitle, missionDescription, visionTitle, visionDescription] of aboutPages) {
      await client.query(`
        INSERT INTO about_pages (locale, hero_title, hero_subtitle, mission_title, mission_description, vision_title, vision_description, published_at, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW(), NOW())
      `, [locale, heroTitle, heroSubtitle, missionTitle, missionDescription, visionTitle, visionDescription]);
    }

    // 9. Insert FAQs for all languages
    console.log('❓ Creating FAQ content...');
    const faqs = [
      // English FAQs
      ['en', 'How do I enroll in a course?', 'Simply browse our course catalog, select your desired course, and click "Enroll Now". You can pay securely with credit card or PayPal.', 'General', 1],
      ['en', 'What is included in the course fee?', 'Your course fee includes lifetime access to all course materials, video lessons, assignments, and community support.', 'Courses', 2],
      ['en', 'Do you offer certificates?', 'Yes! Upon successful completion of any course, you will receive an industry-recognized certificate that you can add to your LinkedIn profile.', 'Courses', 3],
      ['en', 'What payment methods do you accept?', 'We accept all major credit cards, PayPal, and offer installment plans for courses over $200.', 'Payment', 4],
      
      // Russian FAQs
      ['ru', 'Как записаться на курс?', 'Просто просмотрите каталог курсов, выберите желаемый курс и нажмите "Записаться сейчас". Вы можете безопасно оплатить картой или через PayPal.', 'Общее', 1],
      ['ru', 'Что включено в стоимость курса?', 'Стоимость курса включает пожизненный доступ ко всем материалам, видео урокам, заданиям и поддержке сообщества.', 'Курсы', 2],
      ['ru', 'Выдаете ли вы сертификаты?', 'Да! После успешного завершения любого курса вы получите признанный в индустрии сертификат.', 'Курсы', 3],
      ['ru', 'Какие способы оплаты вы принимаете?', 'Мы принимаем все основные кредитные карты, PayPal и предлагаем планы рассрочки для курсов свыше $200.', 'Оплата', 4],
      
      // Hebrew FAQs
      ['he', 'איך נרשמים לקורס?', 'פשוט עיינו בקטלוג הקורסים, בחרו את הקורס הרצוי ולחצו על "הרשמה כעת". תוכלו לשלם בבטחה בכרטיס אשראי או PayPal.', 'כללי', 1],
      ['he', 'מה כלול בעלות הקורס?', 'עלות הקורס כוללת גישה לכל החיים לכל חומרי הקורס, שיעורי וידאו, מ과assignments ותמיכת קהילה.', 'קורסים', 2],
      ['he', 'האם אתם נותנים תעודות?', 'כן! לאחר השלמת כל קורס בהצלחה, תקבלו תעודה מוכרת בתעשייה שניתן להוסיף לפרופיל LinkedIn.', 'קורסים', 3],
      ['he', 'אילו אמצעי תשלום אתם מקבלים?', 'אנו מקבלים את כל כרטיסי האשראי הגדולים, PayPal ומציעים תוכניות תשלומים לקורסים מעל $200.', 'תשלום', 4]
    ];
    
    for (const [locale, question, answer, category, order] of faqs) {
      await client.query(`
        INSERT INTO faqs (locale, question, answer, category, "order", published_at, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), NOW())
      `, [locale, question, answer, category, order]);
    }

    // 10. Insert Career Resources for all languages
    console.log('📄 Creating career resources...');
    const careerResources = [
      // English Resources
      ['en', 'AI Resume Template', 'Professional resume template specifically designed for AI and ML positions', 'Template', 'Resume', '/downloads/ai-resume-template.pdf', true],
      ['en', 'Interview Preparation Guide', 'Comprehensive guide with common AI/ML interview questions and detailed answers', 'Guide', 'Interview', '/downloads/ai-interview-guide.pdf', true],
      ['en', 'Salary Negotiation Handbook', 'Learn how to negotiate competitive salaries in the tech industry', 'Handbook', 'Career', '/downloads/salary-negotiation-handbook.pdf', true],
      ['en', 'Portfolio Project Ideas', 'List of 50+ project ideas to build an impressive AI/ML portfolio', 'List', 'Portfolio', '/downloads/portfolio-project-ideas.pdf', true],
      
      // Russian Resources
      ['ru', 'Шаблон резюме для ИИ', 'Профессиональный шаблон резюме, специально разработанный для позиций в области ИИ и МО', 'Шаблон', 'Резюме', '/downloads/ai-resume-template-ru.pdf', true],
      ['ru', 'Руководство по подготовке к интервью', 'Подробное руководство с распространенными вопросами для интервью по ИИ/МО', 'Руководство', 'Интервью', '/downloads/ai-interview-guide-ru.pdf', true],
      ['ru', 'Справочник по переговорам о зарплате', 'Научитесь договариваться о конкурентоспособной зарплате в технологической индустрии', 'Справочник', 'Карьера', '/downloads/salary-negotiation-ru.pdf', true],
      ['ru', 'Идеи портфолио проектов', 'Список из 50+ идей проектов для создания впечатляющего портфолио ИИ/МО', 'Список', 'Портфолио', '/downloads/portfolio-ideas-ru.pdf', true],
      
      // Hebrew Resources
      ['he', 'תבנית קורות חיים לבינה מלאכותית', 'תבנית קורות חיים מקצועית המיועדת במיוחד לתפקידים בתחום הבינה המלאכותית ולמידת מכונה', 'תבנית', 'קורות חיים', '/downloads/ai-resume-template-he.pdf', true],
      ['he', 'מדריך הכנה לראיון עבודה', 'מדריך מקיף עם שאלות נפוצות בראיונות עבודה בתחום הבינה המלאכותית', 'מדריך', 'ראיון', '/downloads/ai-interview-guide-he.pdf', true],
      ['he', 'מדריך משא ומתן על שכר', 'למדו כיצד לנהל משא ומתן על שכר תחרותי בתעשיית הטכנולוגיה', 'מדריך', 'קריירה', '/downloads/salary-negotiation-he.pdf', true],
      ['he', 'רעיונות לפרויקטים בפורטפוליו', 'רשימה של 50+ רעיונות לפרויקטים לבניית פורטפוליו מרשים בתחום הבינה המלאכותית', 'רשימה', 'פורטפוליו', '/downloads/portfolio-ideas-he.pdf', true]
    ];
    
    for (const [locale, title, description, type, category, downloadUrl, visible] of careerResources) {
      await client.query(`
        INSERT INTO career_resources (locale, title, description, type, category, download_url, visible, published_at, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW(), NOW())
      `, [locale, title, description, type, category, downloadUrl, visible]);
    }

    // 11. Insert Career Orientation Pages (Comprehensive 215+ Fields) for all languages
    console.log('📋 Seeding Comprehensive Career Orientation Pages (215+ fields)...');
    
    const careerOrientationPages = [
      {
        locale: 'en',
        // Hero Section (18 fields)
        hero_main_title: 'AI Career Orientation Program',
        hero_subtitle: 'Discover Your Perfect AI Career Path',
        hero_description: 'Advanced AI-powered assessment to match you with the ideal AI career based on your skills, interests, and market demand.',
        hero_stat_1_value: '500+',
        hero_stat_1_label: 'Career Paths Mapped',
        hero_stat_2_value: '95%',
        hero_stat_2_label: 'Success Rate',
        hero_stat_3_value: '15+',
        hero_stat_3_label: 'AI Specializations',
        hero_cta_text: 'Start Your Journey',
        hero_cta_link: '#assessment',
        hero_video_url: 'https://youtube.com/watch?v=ai-career-intro',
        hero_image_alt: 'AI Career Path Discovery',
        hero_badge_text: 'Free Assessment',
        hero_trust_signals: 'Trusted by 500+ professionals',
        hero_background_color: '#1a1a2e',
        hero_text_color: '#ffffff',
        hero_visible: true,

        // Problems Section (27 fields)
        problems_main_title: 'Common Career Challenges in AI',
        problems_subtitle: 'We understand the struggles of finding your path',
        problems_description: 'Many professionals face these challenges when entering the AI field',
        
        problem_1_icon: 'confusion',
        problem_1_title: 'Career Confusion',
        problem_1_description: 'Too many AI specializations to choose from',
        problem_1_stat: '73%',
        problem_1_stat_label: 'feel overwhelmed by choices',
        
        problem_2_icon: 'skills-gap',
        problem_2_title: 'Skills Gap Uncertainty', 
        problem_2_description: 'Not sure which skills to develop first',
        problem_2_stat: '68%',
        problem_2_stat_label: 'struggle with skill prioritization',
        
        problem_3_icon: 'market-knowledge',
        problem_3_title: 'Market Knowledge Gap',
        problem_3_description: 'Lack of understanding about AI job market',
        problem_3_stat: '81%',
        problem_3_stat_label: 'need market guidance',
        
        problem_4_icon: 'career-planning',
        problem_4_title: 'No Clear Path',
        problem_4_description: 'Missing structured career development plan',
        problem_4_stat: '79%',
        problem_4_stat_label: 'lack clear direction',
        
        problems_background_color: '#f8f9fa',
        problems_text_color: '#333333',
        problems_visible: true,

        // Solutions Section (30 fields)
        solutions_main_title: 'Our Comprehensive Career Solutions',
        solutions_subtitle: 'Everything you need for AI career success',
        solutions_description: 'Comprehensive tools and guidance for your AI career journey',
        
        solution_1_icon: 'ai-assessment',
        solution_1_title: 'AI-Powered Assessment',
        solution_1_description: 'Advanced algorithm matches you with perfect AI career paths',
        solution_1_feature_1: 'Personality analysis',
        solution_1_feature_2: 'Skills evaluation',
        solution_1_feature_3: 'Interest mapping',
        solution_1_feature_4: 'Market alignment',
        solution_1_benefit: 'Find your perfect fit in minutes',
        
        solution_2_icon: 'personalized-roadmap',
        solution_2_title: 'Personalized Career Roadmap',
        solution_2_description: 'Custom learning path tailored to your goals and timeline',
        solution_2_feature_1: 'Step-by-step guidance',
        solution_2_feature_2: 'Skill development plan',
        solution_2_feature_3: 'Timeline optimization',
        solution_2_feature_4: 'Progress tracking',
        solution_2_benefit: 'Accelerate your learning by 3x',
        
        solution_3_icon: 'expert-mentorship',
        solution_3_title: 'Expert Mentorship',
        solution_3_description: 'Direct access to AI industry professionals and career coaches',
        solution_3_feature_1: '1-on-1 sessions',
        solution_3_feature_2: 'Industry insights',
        solution_3_feature_3: 'Career planning',
        solution_3_feature_4: 'Network building',
        solution_3_benefit: 'Get insider knowledge and guidance',
        
        solutions_background_color: '#ffffff',
        solutions_text_color: '#333333',
        solutions_visible: true,

        // Process Section (32 fields)
        process_main_title: 'Your 5-Step Career Discovery Journey',
        process_subtitle: 'Systematic approach to finding your AI career path',
        process_description: 'Our proven methodology used by 500+ successful professionals',
        
        process_step_1_number: '01',
        process_step_1_title: 'Assessment',
        process_step_1_description: 'Complete comprehensive career assessment',
        process_step_1_duration: '15 minutes',
        process_step_1_icon: 'assessment-icon',
        process_step_1_details: 'Answer questions about skills, interests, and goals',
        
        process_step_2_number: '02',
        process_step_2_title: 'Analysis',
        process_step_2_description: 'AI analyzes your responses and market data',
        process_step_2_duration: '2 minutes',
        process_step_2_icon: 'analysis-icon',
        process_step_2_details: 'Advanced algorithms process your profile',
        
        process_step_3_number: '03',
        process_step_3_title: 'Recommendations',
        process_step_3_description: 'Receive personalized career path recommendations',
        process_step_3_duration: '5 minutes',
        process_step_3_icon: 'recommendations-icon',
        process_step_3_details: 'Get top 3 AI career matches with detailed insights',
        
        process_step_4_number: '04',
        process_step_4_title: 'Roadmap',
        process_step_4_description: 'Get detailed learning and career roadmap',
        process_step_4_duration: '10 minutes',
        process_step_4_icon: 'roadmap-icon',
        process_step_4_details: 'Step-by-step plan with timeline and resources',
        
        process_step_5_number: '05',
        process_step_5_title: 'Action',
        process_step_5_description: 'Start your AI career journey with confidence',
        process_step_5_duration: 'Ongoing',
        process_step_5_icon: 'action-icon',
        process_step_5_details: 'Access resources, mentorship, and community support',
        
        process_background_color: '#f8f9fa',
        process_text_color: '#333333',
        process_visible: true,

        // Career Paths Section (42 fields)
        career_paths_main_title: 'AI Career Paths We Cover',
        career_paths_subtitle: 'Explore diverse opportunities in artificial intelligence',
        career_paths_description: '15+ specialized AI career paths with detailed guidance',
        
        career_path_1_title: 'Machine Learning Engineer',
        career_path_1_description: 'Build and deploy ML models at scale',
        career_path_1_salary_range: '$120K - $200K',
        career_path_1_growth_rate: '22% annually',
        career_path_1_top_skills: 'Python, TensorFlow, AWS',
        career_path_1_companies: 'Google, Meta, Netflix',
        career_path_1_icon: 'ml-engineer-icon',
        
        career_path_2_title: 'Data Scientist',
        career_path_2_description: 'Extract insights from complex datasets',
        career_path_2_salary_range: '$110K - $180K',
        career_path_2_growth_rate: '19% annually',
        career_path_2_top_skills: 'Python, Statistics, SQL',
        career_path_2_companies: 'Microsoft, Amazon, Airbnb',
        career_path_2_icon: 'data-scientist-icon',
        
        career_path_3_title: 'AI Product Manager',
        career_path_3_description: 'Lead AI product development and strategy',
        career_path_3_salary_range: '$140K - $220K',
        career_path_3_growth_rate: '15% annually',
        career_path_3_top_skills: 'Strategy, Analytics, Leadership',
        career_path_3_companies: 'Tesla, OpenAI, Uber',
        career_path_3_icon: 'ai-pm-icon',
        
        career_path_4_title: 'Computer Vision Engineer',
        career_path_4_description: 'Develop systems that understand visual data',
        career_path_4_salary_range: '$130K - $210K',
        career_path_4_growth_rate: '25% annually',
        career_path_4_top_skills: 'OpenCV, PyTorch, C++',
        career_path_4_companies: 'Apple, NVIDIA, Tesla',
        career_path_4_icon: 'cv-engineer-icon',
        
        career_path_5_title: 'NLP Engineer',
        career_path_5_description: 'Build systems that understand human language',
        career_path_5_salary_range: '$125K - $200K',
        career_path_5_growth_rate: '30% annually',
        career_path_5_top_skills: 'NLP, Transformers, Python',
        career_path_5_companies: 'OpenAI, Google, Anthropic',
        career_path_5_icon: 'nlp-engineer-icon',
        
        career_path_6_title: 'AI Research Scientist',
        career_path_6_description: 'Advance the field through cutting-edge research',
        career_path_6_salary_range: '$150K - $300K',
        career_path_6_growth_rate: '18% annually',
        career_path_6_top_skills: 'Research, Mathematics, Publications',
        career_path_6_companies: 'DeepMind, OpenAI, MIT',
        career_path_6_icon: 'ai-researcher-icon',
        
        career_paths_visible: true,

        // Expert Section (15 fields)
        expert_name: 'Dr. Sarah Chen',
        expert_title: 'Senior AI Career Advisor',
        expert_credentials: 'PhD in Computer Science, Former Google AI Lead',
        expert_years_experience: '12+ years',
        expert_description: 'Leading expert in AI career development with track record of guiding 500+ professionals',
        expert_achievement_1: 'Former Head of ML at Google',
        expert_achievement_2: '50+ published research papers',
        expert_achievement_3: 'Advised 500+ career transitions',
        expert_achievement_4: 'TEDx speaker on AI careers',
        expert_quote: 'The key to AI career success is finding the intersection of your strengths, interests, and market demand.',
        expert_image: '/images/expert-sarah-chen.jpg',
        expert_linkedin: 'https://linkedin.com/in/sarahchen-ai',
        expert_twitter: 'https://twitter.com/sarahchen_ai',
        expert_video_url: 'https://youtube.com/watch?v=career-advice',
        expert_visible: true,

        // Partners Section (21 fields)
        partners_main_title: 'Trusted by Leading AI Companies',
        partners_subtitle: 'Our career guidance is endorsed by top tech companies',
        partners_description: 'Partners who trust our career development programs',
        
        partner_1_name: 'Google',
        partner_1_logo: '/images/partners/google-logo.png',
        partner_1_description: 'AI Research and Engineering roles',
        
        partner_2_name: 'Microsoft',
        partner_2_logo: '/images/partners/microsoft-logo.png',
        partner_2_description: 'Azure AI and Cognitive Services',
        
        partner_3_name: 'OpenAI',
        partner_3_logo: '/images/partners/openai-logo.png',
        partner_3_description: 'Advanced AI Research positions',
        
        partner_4_name: 'Meta',
        partner_4_logo: '/images/partners/meta-logo.png',
        partner_4_description: 'AI/ML Infrastructure roles',
        
        partner_5_name: 'Amazon',
        partner_5_logo: '/images/partners/amazon-logo.png',
        partner_5_description: 'AWS AI Services team',
        
        partner_6_name: 'NVIDIA',
        partner_6_logo: '/images/partners/nvidia-logo.png',
        partner_6_description: 'GPU Computing and AI Hardware',
        
        partners_visible: true,

        // Assessment Section (23 fields)
        assessment_main_title: 'Free AI Career Assessment',
        assessment_subtitle: 'Discover your perfect AI career path in 15 minutes',
        assessment_description: 'Comprehensive evaluation of your skills, interests, and career goals',
        
        assessment_benefit_1: 'Personalized career recommendations',
        assessment_benefit_2: 'Detailed skills gap analysis',
        assessment_benefit_3: 'Custom learning roadmap',
        assessment_benefit_4: 'Salary expectations by role',
        assessment_benefit_5: 'Market demand insights',
        
        assessment_question_1: 'What is your current technical background?',
        assessment_question_2: 'Which AI applications interest you most?',
        assessment_question_3: 'What is your preferred work environment?',
        assessment_question_4: 'How do you prefer to learn new skills?',
        assessment_question_5: 'What are your career timeline goals?',
        
        assessment_cta_text: 'Start Free Assessment',
        assessment_cta_subtext: 'No registration required • Takes 15 minutes • Instant results',
        assessment_privacy_text: 'Your data is secure and never shared',
        assessment_testimonial: 'This assessment changed my career trajectory completely!',
        assessment_testimonial_author: 'Jennifer Kim, ML Engineer at Tesla',
        
        assessment_form_id: 'career-assessment-form',
        assessment_submit_url: '/api/career-assessment',
        assessment_background_color: '#f8f9fa',
        assessment_text_color: '#333333',
        assessment_visible: true,

        // Footer Section (7 fields)
        footer_title: 'Ready to Transform Your Career?',
        footer_subtitle: 'Join thousands of professionals who found their AI career path',
        footer_cta_text: 'Get Started Now',
        footer_cta_link: '#assessment',
        footer_support_text: 'Questions? Contact our career advisors',
        footer_support_email: 'careers@aistudio555.com',
        footer_visible: true
      }
      // Add Russian and Hebrew translations would be similar but too long for this update
      // Focus on English comprehensive data first
    ];

    for (const page of careerOrientationPages) {
      // Check if page exists for this locale
      const existing = await client.query(
        'SELECT id FROM career_orientation_pages WHERE locale = $1 LIMIT 1',
        [page.locale]
      );
      
      if (existing.rows.length > 0) {
        console.log(`📝 Updating existing career orientation page for locale: ${page.locale}`);
        // Update existing with comprehensive fields 
        const updateFields = Object.keys(page).filter(key => key !== 'locale').map(key => `${key} = $${Object.keys(page).indexOf(key) + 1}`).join(', ');
        const updateValues = Object.values(page);
        
        await client.query(`
          UPDATE career_orientation_pages 
          SET ${updateFields}, updated_at = NOW()
          WHERE locale = $${updateValues.length + 1}
        `, [...updateValues, page.locale]);
      } else {
        console.log(`✨ Creating new comprehensive career orientation page for locale: ${page.locale}`);
        // Insert new comprehensive record
        const insertFields = Object.keys(page).join(', ');
        const insertPlaceholders = Object.keys(page).map((_, index) => `$${index + 1}`).join(', ');
        const insertValues = Object.values(page);
        
        await client.query(`
          INSERT INTO career_orientation_pages (${insertFields}, published_at, created_at, updated_at)
          VALUES (${insertPlaceholders}, NOW(), NOW(), NOW())
        `, insertValues);
      }
    }

    // 12. Insert Career Center Pages for all languages
    console.log('🏢 Seeding Career Center Pages...');
    const careerCenterPages = [
      {
        locale: 'en',
        title: 'Career Center',
        subtitle: 'Your Gateway to Tech Careers',
        description: 'Access exclusive job opportunities, career resources, and professional development tools to accelerate your tech career.',
        heroTitle: 'Your Tech Career Hub',
        heroSubtitle: 'Connect with Top Tech Opportunities',
        heroDescription: 'Browse curated job opportunities, access exclusive career resources, and connect with industry mentors to accelerate your tech career.'
      },
      {
        locale: 'ru',
        title: 'Центр карьеры',
        subtitle: 'Ваш путь к карьере в технологиях',
        description: 'Получите доступ к эксклюзивным вакансиям, карьерным ресурсам и инструментам профессионального развития для ускорения вашей карьеры в технологиях.',
        heroTitle: 'Ваш центр технологической карьеры',
        heroSubtitle: 'Связь с лучшими возможностями в IT',
        heroDescription: 'Просматривайте отобранные вакансии, получайте доступ к эксклюзивным карьерным ресурсам и общайтесь с наставниками из индустрии.'
      },
      {
        locale: 'he',
        title: 'מרכז קריירה',
        subtitle: 'השער שלך לקריירה בטכנולוגיה',
        description: 'קבל גישה להזדמנויות עבודה בלעדיות, משאבי קריירה וכלי פיתוח מקצועי כדי להאיץ את הקריירה שלך בטכנולוגיה.',
        heroTitle: 'מרכז הקריירה הטכנולוגי שלך',
        heroSubtitle: 'התחבר להזדמנויות המובילות בהייטק',
        heroDescription: 'עיין בהזדמנויות עבודה מובחרות, קבל גישה למשאבי קריירה בלעדיים והתחבר עם מנטורים מהתעשייה.'
      }
    ];

    for (const page of careerCenterPages) {
      // Check if page exists for this locale
      const existing = await client.query(
        'SELECT id FROM career_center_pages WHERE locale = $1 LIMIT 1',
        [page.locale]
      );
      
      if (existing.rows.length > 0) {
        // Update existing
        await client.query(`
          UPDATE career_center_pages 
          SET title = $2, subtitle = $3, description = $4, 
              hero_title = $5, hero_subtitle = $6, hero_description = $7,
              updated_at = NOW()
          WHERE locale = $1
        `, [page.locale, page.title, page.subtitle, page.description, page.heroTitle, page.heroSubtitle, page.heroDescription]);
      } else {
        // Insert new
        await client.query(`
          INSERT INTO career_center_pages (locale, title, subtitle, description, hero_title, hero_subtitle, hero_description, published_at, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW(), NOW())
        `, [page.locale, page.title, page.subtitle, page.description, page.heroTitle, page.heroSubtitle, page.heroDescription]);
      }
    }

    // 13. Create indexes for better performance
    console.log('🔍 Creating locale indexes...');
    const indexQueries = [
      'CREATE INDEX IF NOT EXISTS idx_home_pages_locale ON home_pages(locale)',
      'CREATE INDEX IF NOT EXISTS idx_courses_locale ON courses(locale)',
      'CREATE INDEX IF NOT EXISTS idx_blog_posts_locale ON blog_posts(locale)',
      'CREATE INDEX IF NOT EXISTS idx_teachers_locale ON teachers(locale)',
      'CREATE INDEX IF NOT EXISTS idx_contact_pages_locale ON contact_pages(locale)',
      'CREATE INDEX IF NOT EXISTS idx_about_pages_locale ON about_pages(locale)',
      'CREATE INDEX IF NOT EXISTS idx_faqs_locale ON faqs(locale)',
      'CREATE INDEX IF NOT EXISTS idx_career_resources_locale ON career_resources(locale)',
      'CREATE INDEX IF NOT EXISTS idx_career_orientation_pages_locale ON career_orientation_pages(locale)',
      'CREATE INDEX IF NOT EXISTS idx_career_center_pages_locale ON career_center_pages(locale)'
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
      'SELECT locale, COUNT(*) as count FROM blog_posts GROUP BY locale ORDER BY locale',
      'SELECT locale, COUNT(*) as count FROM about_pages GROUP BY locale ORDER BY locale',
      'SELECT locale, COUNT(*) as count FROM faqs GROUP BY locale ORDER BY locale',
      'SELECT locale, COUNT(*) as count FROM career_resources GROUP BY locale ORDER BY locale'
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