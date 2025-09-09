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

    // 11. Insert Career Orientation Pages for all languages
    console.log('📋 Seeding Career Orientation Pages...');
    const careerOrientationPages = [
      {
        locale: 'en',
        title: 'Career Orientation Program',
        subtitle: 'Find Your Perfect Tech Career Path',
        description: 'Our comprehensive career orientation program helps you discover the perfect technology career path aligned with your interests, skills, and goals.',
        heroTitle: 'Find Your Path in Tech',
        heroSubtitle: 'Discover Your Perfect Career Match',
        heroDescription: 'Our AI-powered career orientation helps you identify the right technology career path based on your skills, interests, and market demand.'
      },
      {
        locale: 'ru',
        title: 'Программа карьерной ориентации',
        subtitle: 'Найдите свой идеальный путь в технологиях',
        description: 'Наша комплексная программа карьерной ориентации поможет вам найти идеальный карьерный путь в технологиях, соответствующий вашим интересам, навыкам и целям.',
        heroTitle: 'Найдите свой путь в IT',
        heroSubtitle: 'Откройте идеальное карьерное соответствие',
        heroDescription: 'Наша карьерная ориентация на основе ИИ помогает определить правильный технологический карьерный путь на основе ваших навыков, интересов и рыночного спроса.'
      },
      {
        locale: 'he',
        title: 'תוכנית הכוונה מקצועית',
        subtitle: 'מצא את מסלול הקריירה המושלם שלך בטכנולוגיה',
        description: 'תוכנית ההכוונה המקצועית המקיפה שלנו עוזרת לך לגלות את מסלול הקריירה הטכנולוגי המושלם המתאים לתחומי העניין, הכישורים והמטרות שלך.',
        heroTitle: 'מצא את הדרך שלך בהייטק',
        heroSubtitle: 'גלה את ההתאמה הקריירה המושלמת שלך',
        heroDescription: 'ההכוונה המקצועית המבוססת על AI שלנו עוזרת לך לזהות את מסלול הקריירה הטכנולוגי הנכון על בסיס הכישורים, תחומי העניין והביקוש בשוק.'
      }
    ];

    for (const page of careerOrientationPages) {
      // Check if page exists for this locale
      const existing = await client.query(
        'SELECT id FROM career_orientation_pages WHERE locale = $1 LIMIT 1',
        [page.locale]
      );
      
      if (existing.rows.length > 0) {
        // Update existing
        await client.query(`
          UPDATE career_orientation_pages 
          SET title = $2, subtitle = $3, description = $4, 
              hero_title = $5, hero_subtitle = $6, hero_description = $7,
              updated_at = NOW()
          WHERE locale = $1
        `, [page.locale, page.title, page.subtitle, page.description, page.heroTitle, page.heroSubtitle, page.heroDescription]);
      } else {
        // Insert new
        await client.query(`
          INSERT INTO career_orientation_pages (locale, title, subtitle, description, hero_title, hero_subtitle, hero_description, published_at, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW(), NOW())
        `, [page.locale, page.title, page.subtitle, page.description, page.heroTitle, page.heroSubtitle, page.heroDescription]);
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