-- PostgreSQL Database Export from Local SQLite
-- Generated on $(date)
-- Compatible with Railway PostgreSQL - FIXED VERSION

-- Start transaction
BEGIN;

-- =============================================================================
-- nd_courses table (from jamstack.db)
-- =============================================================================

DROP TABLE IF EXISTS nd_courses CASCADE;
CREATE TABLE nd_courses (
    id SERIAL PRIMARY KEY,
    course_key VARCHAR(100) UNIQUE,

    -- Multi-language title fields
    title VARCHAR(255),
    title_ru VARCHAR(255),
    title_he VARCHAR(255),

    -- Multi-language description fields
    description TEXT,
    description_ru TEXT,
    description_he TEXT,

    -- Multi-language short description fields
    short_description TEXT,
    short_description_ru TEXT,
    short_description_he TEXT,

    -- Pricing
    price VARCHAR(20),
    old_price VARCHAR(20),
    currency VARCHAR(10) DEFAULT 'USD',

    -- Course details
    duration VARCHAR(50),
    level VARCHAR(50),
    category VARCHAR(100),
    instructor VARCHAR(255),
    language VARCHAR(50) DEFAULT 'English',

    -- Media
    image VARCHAR(500),
    video_url VARCHAR(500),
    thumbnail VARCHAR(500),
    url VARCHAR(500),

    -- Metrics
    rating VARCHAR(10),
    reviews_count INTEGER DEFAULT 0,
    students_count INTEGER DEFAULT 0,
    lessons_count INTEGER DEFAULT 0,

    -- Content
    features TEXT,
    syllabus TEXT,
    requirements TEXT,
    what_you_learn TEXT,

    -- Status (FIXED: Boolean fields)
    featured BOOLEAN DEFAULT false,
    visible BOOLEAN DEFAULT true,
    published BOOLEAN DEFAULT true,
    enrollment_open BOOLEAN DEFAULT true,

    -- Metadata
    order_index INTEGER DEFAULT 0,
    tags TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_nd_courses_visible ON nd_courses(visible);
CREATE INDEX idx_nd_courses_featured ON nd_courses(featured);
CREATE INDEX idx_nd_courses_category ON nd_courses(category);

-- FIXED: Boolean values changed from 1/0 to true/false
INSERT INTO nd_courses VALUES(2,'course-2','React & Redux Masterclass','Мастер-класс React и Redux','מאסטר-קלאס React ו-Redux','Master React.js and Redux for building scalable single-page applications. Learn component architecture, state management, hooks, and best practices for production-ready React apps.','Глубоко изучите React.js и Redux для создания масштабируемых одностраничных приложений. Изучите архитектуру компонентов, управление состоянием, хуки и лучшие практики.','למדו React.js ו-Redux לבניית אפליקציות חד-עמודיות ניתנות להרחבה. למדו ארכיטקטורת רכיבים, ניהול מצב, hooks ושיטות מומלצות.',NULL,NULL,NULL,'99.99',NULL,'USD','10 weeks',NULL,'App Development','Michael Chen','English','images/course-react.jpg',NULL,NULL,NULL,'4.5',0,0,32,NULL,NULL,NULL,NULL,true,true,true,true,0,NULL,'2025-09-20 19:28:55','2025-09-20 19:28:55');
INSERT INTO nd_courses VALUES(3,'course-3','Node.js Backend Development','Разработка Backend на Node.js','פיתוח Backend עם Node.js','Become a backend expert with Node.js, Express, and MongoDB. Learn to build RESTful APIs, handle authentication, implement security best practices.','Станьте экспертом по backend с Node.js, Express и MongoDB. Научитесь создавать RESTful API, обрабатывать аутентификацию.','הפכו למומחי backend עם Node.js, Express ו-MongoDB. למדו לבנות RESTful APIs, לטפל באימות.',NULL,NULL,NULL,'99.99',NULL,'USD','9 weeks',NULL,'Machine Learning','David Williams','English','images/course-nodejs.jpg',NULL,NULL,NULL,'4.5',0,0,28,NULL,NULL,NULL,NULL,true,true,true,true,0,NULL,'2025-09-20 19:28:55','2025-09-20 19:28:55');
INSERT INTO nd_courses VALUES(4,'course-4','Python for Data Science','Python для науки о данных','Python למדע הנתונים','Unlock the power of Python for data analysis and machine learning. Master pandas, NumPy, matplotlib, and scikit-learn.','Раскройте возможности Python для анализа данных и машинного обучения. Освойте pandas, NumPy, matplotlib и scikit-learn.','שחררו את הכוח של Python לניתוח נתונים ולמידת מכונה. שלטו ב-pandas, NumPy, matplotlib ו-scikit-learn.',NULL,NULL,NULL,'99.99',NULL,'USD','12 weeks',NULL,'Web Development','Dr. Emily Martinez','English','images/course-python.jpg',NULL,NULL,NULL,'4.5',0,0,36,NULL,NULL,NULL,NULL,false,true,true,true,0,NULL,'2025-09-20 19:28:55','2025-09-20 19:28:55');

-- =============================================================================
-- Main content tables (from data.db)
-- =============================================================================

-- courses table
DROP TABLE IF EXISTS courses CASCADE;

-- =============================================================================
-- Tables from data.db
-- =============================================================================

-- courses table
DROP TABLE IF EXISTS courses CASCADE;
CREATE TABLE courses (
            id SERIAL PRIMARY KEY,
            locale TEXT DEFAULT 'en',
            title TEXT NOT NULL,
            description TEXT,
            price DECIMAL(10,2),
            duration TEXT,
            lessons TEXT,
            category TEXT,
            rating DECIMAL(3,1),
            visible BOOLEAN DEFAULT true,
            published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

-- FIXED: Boolean values changed from 1/0 to true/false
INSERT INTO courses VALUES (1, 'en', 'Web Development Bootcamp', 'Full-stack development with modern technologies', 499, '16 Weeks', '45 Lessons', 'Web Dev', 4.7, true, '2025-09-11T10:32:05.875Z', '2025-09-11 10:32:05', '2025-09-11 10:32:05');
INSERT INTO courses VALUES (2, 'en', 'Data Science Fundamentals', 'Complete guide to data analysis and visualization', 399, '12 Weeks', '28 Lessons', 'Data Science', 4.9, true, '2025-09-11T10:32:05.876Z', '2025-09-11 10:32:05', '2025-09-11 10:32:05');
INSERT INTO courses VALUES (3, 'en', 'Advanced Python Programming', 'Master Python for data science and web development', 249, '10 Weeks', '32 Lessons', 'Programming', 4.8, true, '2025-09-11T10:32:05.876Z', '2025-09-11 10:32:05', '2025-09-11 10:32:05');
INSERT INTO courses VALUES (4, 'en', 'Introduction to Machine Learning', 'Learn the fundamentals of ML algorithms and applications', 299, '8 Weeks', '24 Lessons', 'AI & ML', 4.9, true, '2025-09-11T10:32:05.876Z', '2025-09-11 10:32:05', '2025-09-11 10:32:05');


-- teachers table
DROP TABLE IF EXISTS teachers CASCADE;
CREATE TABLE teachers (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    title TEXT,
    bio TEXT,
    image_url TEXT,
    expertise TEXT,
    locale TEXT DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Data for teachers (3 rows)
INSERT INTO teachers VALUES (1, 'Dr. Sarah Johnson', 'Lead AI Instructor', 'Expert in Machine Learning and Neural Networks with 10+ years experience', '/images/teacher1.jpg', 'Machine Learning, Deep Learning', 'en', '2025-09-11 15:16:32', '2025-09-11 15:16:32', '2025-09-11 15:16:32');
INSERT INTO teachers VALUES (2, 'Prof. Michael Chen', 'Data Science Professor', 'Published researcher in AI applications and data analytics', '/images/teacher2.jpg', 'Data Science, Statistics', 'en', '2025-09-11 15:16:32', '2025-09-11 15:16:32', '2025-09-11 15:16:32');
INSERT INTO teachers VALUES (3, 'Elena Rodriguez', 'AI Ethics Specialist', 'Focuses on responsible AI development and ethical implications', '/images/teacher3.jpg', 'AI Ethics, Policy', 'en', '2025-09-11 15:16:32', '2025-09-11 15:16:32', '2025-09-11 15:16:32');


-- blog_posts table
DROP TABLE IF EXISTS blog_posts CASCADE;
CREATE TABLE blog_posts (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    excerpt TEXT,
    image_url TEXT,
    author TEXT,
    locale TEXT DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Data for blog_posts (3 rows)
INSERT INTO blog_posts VALUES (1, 'Getting Started with Machine Learning', 'Machine learning is transforming industries...', 'Learn the basics of ML', NULL, 'Dr. Sarah Johnson', 'en', '2025-09-11 15:16:32', '2025-09-11 15:16:32', '2025-09-11 15:16:32');
INSERT INTO blog_posts VALUES (2, 'AI in Healthcare: Future Trends', 'Artificial Intelligence is revolutionizing healthcare...', 'Explore AI healthcare applications', NULL, 'Prof. Michael Chen', 'en', '2025-09-11 15:16:32', '2025-09-11 15:16:32', '2025-09-11 15:16:32');
INSERT INTO blog_posts VALUES (3, 'Ethics in AI Development', 'As AI becomes more prevalent, ethical considerations...', 'Understanding AI ethics', NULL, 'Elena Rodriguez', 'en', '2025-09-11 15:16:32', '2025-09-11 15:16:32', '2025-09-11 15:16:32');


-- home_pages table
DROP TABLE IF EXISTS home_pages CASCADE;
CREATE TABLE home_pages (
            id SERIAL PRIMARY KEY,
            locale TEXT DEFAULT 'en',
            title TEXT,
            heroTitle TEXT,
            heroSubtitle TEXT,
            heroDescription TEXT,
            heroSectionVisible BOOLEAN,
            featuredCoursesTitle TEXT,
            featuredCoursesDescription TEXT,
            featuredCoursesVisible BOOLEAN,
            aboutTitle TEXT,
            aboutSubtitle TEXT,
            aboutDescription TEXT,
            aboutVisible BOOLEAN,
            companiesTitle TEXT,
            companiesDescription TEXT,
            companiesVisible BOOLEAN,
            testimonialsTitle TEXT,
            testimonialsSubtitle TEXT,
            testimonialsVisible BOOLEAN,
            courses TEXT,
            testimonials TEXT,
            published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

-- No data in home_pages


-- about_pages table
DROP TABLE IF EXISTS about_pages CASCADE;
CREATE TABLE about_pages (id SERIAL PRIMARY KEY, title TEXT NOT NULL, content TEXT, mission TEXT, vision TEXT, company_values TEXT, locale TEXT DEFAULT 'en', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

-- Data for about_pages (1 rows)
INSERT INTO about_pages VALUES (1, 'About AI Studio', 'AI Studio is a leading institution in artificial intelligence education...', 'To democratize AI education worldwide', 'A world where everyone can understand and utilize AI', 'Innovation, Excellence, Accessibility', 'en', '2025-09-11 15:16:45', '2025-09-11 15:16:45', '2025-09-11 15:16:45');


-- contact_pages table
DROP TABLE IF EXISTS contact_pages CASCADE;
CREATE TABLE contact_pages (id SERIAL PRIMARY KEY, title TEXT NOT NULL, address TEXT, phone TEXT, email TEXT, office_hours TEXT, locale TEXT DEFAULT 'en', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

-- Data for contact_pages (1 rows)
INSERT INTO contact_pages VALUES (1, 'Contact Us', '123 AI Street, Tech City, TC 12345', '+1-555-0123', 'info@aistudio.com', 'Mon-Fri 9AM-6PM PST', 'en', '2025-09-11 15:16:45', '2025-09-11 15:16:45');


-- career_center_pages table
DROP TABLE IF EXISTS career_center_pages CASCADE;
CREATE TABLE career_center_pages (id SERIAL PRIMARY KEY, title TEXT NOT NULL, content TEXT, services TEXT, programs TEXT, success_stories TEXT, locale TEXT DEFAULT 'en', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

-- Data for career_center_pages (1 rows)
INSERT INTO career_center_pages VALUES (1, 'Career Center', 'Your gateway to AI career success', 'Career counseling, Job placement, Resume review', 'Internship program, Mentorship, Alumni network', NULL, 'en', '2025-09-11 15:17:01', '2025-09-11 15:17:01', '2025-09-11 15:17:01');


-- career_orientation_pages table
DROP TABLE IF EXISTS career_orientation_pages CASCADE;
CREATE TABLE career_orientation_pages (id SERIAL PRIMARY KEY, title TEXT NOT NULL, content TEXT, guidance_sections TEXT, assessment_tools TEXT, career_paths TEXT, locale TEXT DEFAULT 'en', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

-- Data for career_orientation_pages (1 rows)
INSERT INTO career_orientation_pages VALUES (1, 'Career Orientation', 'Discover your path in AI', 'Self-assessment, Skills evaluation, Goal setting', NULL, 'Machine Learning Engineer, Data Scientist, AI Researcher, Product Manager', 'en', '2025-09-11 15:17:01', '2025-09-11 15:17:01', '2025-09-11 15:17:01');


-- pricing_plans table
DROP TABLE IF EXISTS pricing_plans CASCADE;
CREATE TABLE pricing_plans (id SERIAL PRIMARY KEY, name TEXT NOT NULL, price DECIMAL(10,2), currency TEXT DEFAULT 'USD', features TEXT, recommended BOOLEAN DEFAULT false, locale TEXT DEFAULT 'en', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

-- FIXED: Boolean values changed from 0/1 to false/true
INSERT INTO pricing_plans VALUES (1, 'Basic', 99.99, 'USD', 'Access to fundamental courses, Community support', false, 'en', '2025-09-11 15:17:01', '2025-09-11 15:17:01');
INSERT INTO pricing_plans VALUES (2, 'Professional', 199.99, 'USD', 'All courses, 1-on-1 mentoring, Career support', true, 'en', '2025-09-11 15:17:01', '2025-09-11 15:17:01');
INSERT INTO pricing_plans VALUES (3, 'Enterprise', 499.99, 'USD', 'Everything + Custom training, Priority support', false, 'en', '2025-09-11 15:17:01', '2025-09-11 15:17:01');


-- faqs table
DROP TABLE IF EXISTS faqs CASCADE;
CREATE TABLE faqs (id SERIAL PRIMARY KEY, question TEXT NOT NULL, answer TEXT NOT NULL, category TEXT, order_index INTEGER DEFAULT 0, locale TEXT DEFAULT 'en', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

-- Data for faqs (3 rows)
INSERT INTO faqs VALUES (1, 'How long are the courses?', 'Our courses range from 4-12 weeks depending on the complexity', 'General', 0, 'en', '2025-09-11 15:16:45', '2025-09-11 15:16:45', '2025-09-11 15:16:45');
INSERT INTO faqs VALUES (2, 'Do I need programming experience?', 'No prior programming experience is required for beginner courses', 'Prerequisites', 0, 'en', '2025-09-11 15:16:45', '2025-09-11 15:16:45', '2025-09-11 15:16:45');
INSERT INTO faqs VALUES (3, 'What career support do you offer?', 'We provide career counseling, resume reviews, and job placement assistance', 'Career', 0, 'en', '2025-09-11 15:16:45', '2025-09-11 15:16:45', '2025-09-11 15:16:45');


-- job_postings table
DROP TABLE IF EXISTS job_postings CASCADE;
CREATE TABLE job_postings (id SERIAL PRIMARY KEY, title TEXT NOT NULL, company TEXT, description TEXT, requirements TEXT, location TEXT, salary_range TEXT, application_url TEXT, locale TEXT DEFAULT 'en', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

-- Data for job_postings (3 rows)
INSERT INTO job_postings VALUES (1, 'Machine Learning Engineer', 'TechCorp', 'Join our AI team to build next-gen ML systems', 'Python, TensorFlow, 3+ years experience', 'San Francisco, CA', '$120k-180k', NULL, 'en', '2025-09-11 15:17:01', '2025-09-11 15:17:01', '2025-09-11 15:17:01');
INSERT INTO job_postings VALUES (2, 'Data Scientist', 'DataInc', 'Analyze complex datasets and build predictive models', 'Python, R, Statistics, SQL', 'Remote', '$100k-150k', NULL, 'en', '2025-09-11 15:17:01', '2025-09-11 15:17:01', '2025-09-11 15:17:01');
INSERT INTO job_postings VALUES (3, 'AI Research Scientist', 'InnovateAI', 'Research and develop cutting-edge AI algorithms', 'PhD in AI/ML, Publications, Research experience', 'New York, NY', '$150k-250k', NULL, 'en', '2025-09-11 15:17:01', '2025-09-11 15:17:01', '2025-09-11 15:17:01');


-- career_resources table
DROP TABLE IF EXISTS career_resources CASCADE;
CREATE TABLE career_resources (id SERIAL PRIMARY KEY, title TEXT NOT NULL, description TEXT, resource_type TEXT, resource_url TEXT, locale TEXT DEFAULT 'en', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

-- Data for career_resources (3 rows)
INSERT INTO career_resources VALUES (1, 'AI Career Guide', 'Comprehensive guide to careers in artificial intelligence', 'PDF', '/resources/ai-career-guide.pdf', 'en', '2025-09-11 15:17:01', '2025-09-11 15:17:01', '2025-09-11 15:17:01');
INSERT INTO career_resources VALUES (2, 'Resume Template for AI Jobs', 'Optimized resume template for AI/ML positions', 'Template', '/resources/ai-resume-template.docx', 'en', '2025-09-11 15:17:01', '2025-09-11 15:17:01', '2025-09-11 15:17:01');
INSERT INTO career_resources VALUES (3, 'Interview Preparation Kit', 'Common AI interview questions and answers', 'Guide', '/resources/ai-interview-prep.pdf', 'en', '2025-09-11 15:17:01', '2025-09-11 15:17:01', '2025-09-11 15:17:01');


-- footer_content table
DROP TABLE IF EXISTS footer_content CASCADE;
CREATE TABLE footer_content (
    id SERIAL PRIMARY KEY,
    locale VARCHAR(5) NOT NULL DEFAULT 'en',

    -- Company Information
    company_name VARCHAR(255) DEFAULT 'AI Studio',
    company_description TEXT DEFAULT 'Elevate tech career with expert-led courses. If you''re just aiming to advance skills, practical training is designed.',
    company_logo_url VARCHAR(500) DEFAULT '/images/Logo.svg',
    company_tagline VARCHAR(255),

    -- Contact Information
    contact_email VARCHAR(255) DEFAULT 'contact@aistudio555.com',
    contact_phone VARCHAR(50),
    contact_address TEXT,
    support_email VARCHAR(255) DEFAULT 'support@aistudio555.com',
    sales_email VARCHAR(255) DEFAULT 'sales@aistudio555.com',

    -- Copyright & Legal
    copyright_text TEXT DEFAULT '© 2024 AI Studio. All rights reserved.',
    privacy_policy_url VARCHAR(500) DEFAULT '/privacy-policy',
    terms_of_service_url VARCHAR(500) DEFAULT '/terms-of-service',
    cookie_policy_url VARCHAR(500) DEFAULT '/cookie-policy',

    -- Newsletter Configuration
    newsletter_enabled BOOLEAN DEFAULT true,
    newsletter_title VARCHAR(255) DEFAULT 'Subscribe to Newsletter',
    newsletter_subtitle TEXT DEFAULT 'Get the latest courses and updates delivered to your inbox',
    newsletter_placeholder VARCHAR(255) DEFAULT 'Enter email to subscribe',
    newsletter_button_text VARCHAR(100) DEFAULT 'Subscribe',
    newsletter_success_message TEXT DEFAULT 'Thank you for subscribing!',
    newsletter_error_message TEXT DEFAULT 'Something went wrong. Please try again.',

    -- Feature Flags (FIXED: Boolean values)
    show_social_links BOOLEAN DEFAULT true,
    show_newsletter BOOLEAN DEFAULT true,
    show_contact_info BOOLEAN DEFAULT true,
    show_navigation BOOLEAN DEFAULT true,
    show_company_info BOOLEAN DEFAULT true,

    -- Metadata
    version INTEGER DEFAULT 1,
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),

    -- PostgreSQL constraints (FIXED: Removed SQLite-specific constraints)
    CONSTRAINT chk_valid_locale CHECK (locale IN ('en', 'ru', 'he'))
);

-- FIXED: Boolean values changed from 1/0 to true/false
INSERT INTO footer_content VALUES (1, 'en', 'AI Studio', 'Elevate your tech career with expert-led courses. Practical training designed to advance your skills.', '/images/Logo.svg', NULL, 'contact@aistudio555.com', NULL, NULL, 'support@aistudio555.com', 'sales@aistudio555.com', '© 2024 AI Studio. All rights reserved.', '/privacy-policy', '/terms-of-service', '/cookie-policy', true, 'Subscribe to Newsletter', 'Get the latest courses and updates delivered to your inbox', 'Enter email to subscribe', 'Subscribe', 'Thank you for subscribing!', 'Something went wrong. Please try again.', true, true, true, true, true, 1, true, '2025-09-12 07:57:39', '2025-09-12 07:57:39', NULL, NULL);
INSERT INTO footer_content VALUES (2, 'ru', 'AI Studio', 'Повысьте свою техническую карьеру с помощью курсов под руководством экспертов. Практическое обучение для развития навыков.', '/images/Logo.svg', NULL, 'contact@aistudio555.com', NULL, NULL, 'support@aistudio555.com', 'sales@aistudio555.com', '© 2024 AI Studio. Все права защищены.', '/ru/privacy-policy', '/ru/terms-of-service', '/cookie-policy', true, 'Подписаться на рассылку', 'Получайте последние курсы и обновления на ваш email', 'Enter email to subscribe', 'Subscribe', 'Thank you for subscribing!', 'Something went wrong. Please try again.', true, true, true, true, true, 1, true, '2025-09-12 07:57:39', '2025-09-12 07:57:39', NULL, NULL);
INSERT INTO footer_content VALUES (3, 'he', 'AI Studio', 'העלה את הקריירה הטכנולוגית שלך עם קורסים בהנחיית מומחים. הכשרה מעשית שנועדה לקדם את הכישורים שלך.', '/images/Logo.svg', NULL, 'contact@aistudio555.com', NULL, NULL, 'support@aistudio555.com', 'sales@aistudio555.com', '© 2024 AI Studio. כל הזכויות שמורות.', '/he/privacy-policy', '/he/terms-of-service', '/cookie-policy', true, 'הרשמה לעדכונים', 'קבל את הקורסים והעדכונים האחרונים למייל שלך', 'Enter email to subscribe', 'Subscribe', 'Thank you for subscribing!', 'Something went wrong. Please try again.', true, true, true, true, true, 1, true, '2025-09-12 07:57:39', '2025-09-12 07:57:39', NULL, NULL);


-- footer_navigation_menus table
DROP TABLE IF EXISTS footer_navigation_menus CASCADE;
CREATE TABLE footer_navigation_menus (
    id SERIAL PRIMARY KEY,
    locale VARCHAR(5) NOT NULL DEFAULT 'en',
    menu_type VARCHAR(50) NOT NULL,
    menu_title VARCHAR(100),
    display_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,

    -- Menu items stored as JSON text
    menu_items TEXT DEFAULT '[]',

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Constraints (FIXED: Removed foreign key constraint for simplicity)
    CONSTRAINT chk_nav_valid_locale CHECK (locale IN ('en', 'ru', 'he')),
    CONSTRAINT chk_menu_type_valid CHECK (
        menu_type IN ('main', 'courses', 'company', 'support', 'utility', 'legal', 'footer')
    ),
    CONSTRAINT unique_locale_menu UNIQUE(locale, menu_type)
);

-- FIXED: Boolean values changed from 1/0 to true/false
INSERT INTO footer_navigation_menus VALUES (1, 'en', 'main', 'Main', 1, true, '[{"text":"Home","url":"/home.html","target":"_self","order":1,"visible":true},
   {"text":"Courses","url":"/courses.html","target":"_self","order":2,"visible":true},
   {"text":"Teachers","url":"/teachers.html","target":"_self","order":3,"visible":true},
   {"text":"About","url":"/about-us.html","target":"_self","order":4,"visible":true}]', '2025-09-12 07:57:39', '2025-09-12 07:57:39');
INSERT INTO footer_navigation_menus VALUES (2, 'en', 'company', 'Company', 2, true, '[{"text":"About Us","url":"/about-us.html","target":"_self","order":1,"visible":true},
   {"text":"Contact","url":"/contact-us.html","target":"_self","order":2,"visible":true},
   {"text":"Career Center","url":"/career-center.html","target":"_self","order":3,"visible":true}]', '2025-09-12 07:57:39', '2025-09-12 07:57:39');
INSERT INTO footer_navigation_menus VALUES (3, 'en', 'legal', 'Legal', 3, true, '[{"text":"Privacy Policy","url":"/privacy-policy","target":"_self","order":1,"visible":true},
   {"text":"Terms of Service","url":"/terms-of-service","target":"_self","order":2,"visible":true},
   {"text":"Cookie Policy","url":"/cookie-policy","target":"_self","order":3,"visible":true}]', '2025-09-12 07:57:39', '2025-09-12 07:57:39');
INSERT INTO footer_navigation_menus VALUES (7, 'he', 'main', 'תפריט', 1, true, '[
            {"text": "בית", "url": "/he/home.html", "target": "_self", "order": 1, "visible": true},
            {"text": "אודות", "url": "/he/about-us.html", "target": "_self", "order": 2, "visible": true},
            {"text": "קורסים", "url": "/he/courses.html", "target": "_self", "order": 3, "visible": true},
            {"text": "מורים", "url": "/he/teachers.html", "target": "_self", "order": 4, "visible": true},
            {"text": "מחירים", "url": "/he/pricing.html", "target": "_self", "order": 5, "visible": true},
            {"text": "בלוג", "url": "/he/blog.html", "target": "_self", "order": 6, "visible": true},
            {"text": "צור קשר", "url": "/he/contact-us.html", "target": "_self", "order": 7, "visible": true}
          ]', '2025-09-12 14:51:18', '2025-09-12 14:51:18');


-- footer_social_links table
DROP TABLE IF EXISTS footer_social_links CASCADE;
CREATE TABLE footer_social_links (
    id SERIAL PRIMARY KEY,
    locale VARCHAR(5) NOT NULL DEFAULT 'en',
    platform VARCHAR(50) NOT NULL,

    -- Social Media Details
    url VARCHAR(500),
    icon_class VARCHAR(100),
    icon_svg TEXT,
    display_text VARCHAR(100),
    tooltip VARCHAR(255),
    display_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    opens_new_tab BOOLEAN DEFAULT true,

    -- Analytics
    tracking_code VARCHAR(255),

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Constraints (FIXED: Removed foreign key constraint)
    CONSTRAINT chk_social_valid_locale CHECK (locale IN ('en', 'ru', 'he')),
    CONSTRAINT chk_platform_valid CHECK (
        platform IN ('facebook', 'twitter', 'linkedin', 'instagram', 'youtube', 'telegram', 'whatsapp', 'tiktok', 'github')
    ),
    CONSTRAINT unique_locale_platform UNIQUE(locale, platform)
);

-- FIXED: Boolean values changed from 1/0 to true/false
INSERT INTO footer_social_links VALUES (1, 'en', 'facebook', 'https://facebook.com/aistudio555', 'fab fa-facebook-f', NULL, 'Facebook', NULL, 1, true, true, NULL, '2025-09-12 07:57:39', '2025-09-12 07:57:39');
INSERT INTO footer_social_links VALUES (2, 'en', 'linkedin', 'https://linkedin.com/company/aistudio555', 'fab fa-linkedin-in', NULL, 'LinkedIn', NULL, 2, true, true, NULL, '2025-09-12 07:57:39', '2025-09-12 07:57:39');
INSERT INTO footer_social_links VALUES (3, 'en', 'twitter', 'https://twitter.com/aistudio555', 'fab fa-twitter', NULL, 'Twitter', NULL, 3, true, true, NULL, '2025-09-12 07:57:39', '2025-09-12 07:57:39');
INSERT INTO footer_social_links VALUES (4, 'en', 'instagram', 'https://instagram.com/aistudio555', 'fab fa-instagram', NULL, 'Instagram', NULL, 4, true, true, NULL, '2025-09-12 07:57:39', '2025-09-12 07:57:39');
INSERT INTO footer_social_links VALUES (9, 'he', 'facebook', 'https://www.facebook.com/aistudio555', 'fab fa-facebook-f', NULL, 'פייסבוק', 'עקבו אחרינו בפייסבוק', 1, true, true, NULL, '2025-09-12 14:51:18', '2025-09-12 14:51:18');
INSERT INTO footer_social_links VALUES (10, 'he', 'twitter', 'https://twitter.com/aistudio555', 'fab fa-twitter', NULL, 'טוויטר', 'עקבו אחרינו בטוויטר', 2, true, true, NULL, '2025-09-12 14:51:18', '2025-09-12 14:51:18');
INSERT INTO footer_social_links VALUES (11, 'he', 'linkedin', 'https://www.linkedin.com/company/aistudio555', 'fab fa-linkedin-in', NULL, 'לינקדאין', 'התחברו בלינקדאין', 3, true, true, NULL, '2025-09-12 14:51:18', '2025-09-12 14:51:18');
INSERT INTO footer_social_links VALUES (12, 'he', 'whatsapp', 'https://wa.me/972501234567', 'fab fa-whatsapp', NULL, 'WhatsApp', 'צרו קשר בוואטסאפ', 4, true, true, NULL, '2025-09-12 14:51:18', '2025-09-12 14:51:18');


-- footer_newsletter_config table
DROP TABLE IF EXISTS footer_newsletter_config CASCADE;
CREATE TABLE footer_newsletter_config (
    id SERIAL PRIMARY KEY,
    locale VARCHAR(5) NOT NULL DEFAULT 'en',

    -- Email Service Configuration
    service_provider VARCHAR(50) DEFAULT 'emailjs',
    api_endpoint VARCHAR(500),
    api_key_encrypted TEXT,
    list_id VARCHAR(100),
    template_id VARCHAR(100),

    -- Form Configuration (JSON text)
    form_fields TEXT DEFAULT '[]',

    -- GDPR & Compliance (FIXED: Boolean values)
    gdpr_consent_required BOOLEAN DEFAULT true,
    gdpr_consent_text TEXT DEFAULT 'I agree to receive marketing emails and accept the privacy policy',
    double_opt_in BOOLEAN DEFAULT false,

    -- Rate Limiting
    max_submissions_per_ip INTEGER DEFAULT 5,
    rate_limit_window_minutes INTEGER DEFAULT 60,

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Constraints (FIXED: Removed foreign key constraint)
    CONSTRAINT chk_newsletter_valid_locale CHECK (locale IN ('en', 'ru', 'he')),
    CONSTRAINT unique_newsletter_locale UNIQUE(locale)
);

-- FIXED: Boolean values changed from 1/0 to true/false
INSERT INTO footer_newsletter_config VALUES (1, 'en', 'emailjs', NULL, NULL, NULL, NULL, '[{"name":"email","type":"email","required":true,"placeholder":"Enter your email","validation":"email"}]', true, 'I agree to receive marketing emails and accept the privacy policy', false, 5, 60, '2025-09-12 07:57:39', '2025-09-12 07:57:39');
INSERT INTO footer_newsletter_config VALUES (2, 'ru', 'emailjs', NULL, NULL, NULL, NULL, '[{"name":"email","type":"email","required":true,"placeholder":"Введите ваш email","validation":"email"}]', true, 'Я согласен получать маркетинговые письма и принимаю политику конфиденциальности', false, 5, 60, '2025-09-12 07:57:39', '2025-09-12 07:57:39');
INSERT INTO footer_newsletter_config VALUES (3, 'he', 'emailjs', NULL, NULL, NULL, NULL, '[{"name":"email","type":"email","required":true,"placeholder":"הכנס את המייל שלך","validation":"email"}]', true, 'אני מסכים לקבל מיילים שיווקיים ומקבל את מדיניות הפרטיות', false, 5, 60, '2025-09-12 07:57:39', '2025-09-12 07:57:39');


-- footer_audit_log table
DROP TABLE IF EXISTS footer_audit_log CASCADE;
CREATE TABLE footer_audit_log (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    record_id INTEGER NOT NULL,
    action VARCHAR(20) NOT NULL,
    locale VARCHAR(5),

    -- Change details (JSON text)
    old_values TEXT,
    new_values TEXT,
    changed_fields TEXT,

    -- User information
    user_id VARCHAR(100),
    user_email VARCHAR(255),
    user_ip VARCHAR(45),
    user_agent TEXT,

    -- Timestamp
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT chk_valid_table_name CHECK (
        table_name IN ('footer_content', 'footer_navigation_menus', 'footer_social_links', 'footer_newsletter_config')
    )
);

-- Data for footer_audit_log (7 rows)
INSERT INTO footer_audit_log VALUES (1, 'footer_content', 1, 'INSERT', 'en', NULL, '{"id":1,"locale":"en","company_name":"AI Studio","published":1,"version":1}', NULL, 'system', NULL, NULL, NULL, '2025-09-12 07:57:39');
INSERT INTO footer_audit_log VALUES (2, 'footer_content', 2, 'INSERT', 'ru', NULL, '{"id":2,"locale":"ru","company_name":"AI Studio","published":1,"version":1}', NULL, 'system', NULL, NULL, NULL, '2025-09-12 07:57:39');
INSERT INTO footer_audit_log VALUES (3, 'footer_content', 3, 'INSERT', 'he', NULL, '{"id":3,"locale":"he","company_name":"AI Studio","published":1,"version":1}', NULL, 'system', NULL, NULL, NULL, '2025-09-12 07:57:39');
INSERT INTO footer_audit_log VALUES (4, 'footer_navigation_menus', 1, 'INSERT', 'en', NULL, '{"id":1,"locale":"en","menu_type":"main"}', NULL, 'system', NULL, NULL, NULL, '2025-09-12 07:57:39');
INSERT INTO footer_audit_log VALUES (5, 'footer_navigation_menus', 2, 'INSERT', 'en', NULL, '{"id":2,"locale":"en","menu_type":"company"}', NULL, 'system', NULL, NULL, NULL, '2025-09-12 07:57:39');
INSERT INTO footer_audit_log VALUES (6, 'footer_navigation_menus', 3, 'INSERT', 'en', NULL, '{"id":3,"locale":"en","menu_type":"legal"}', NULL, 'system', NULL, NULL, NULL, '2025-09-12 07:57:39');
INSERT INTO footer_audit_log VALUES (7, 'footer_navigation_menus', 7, 'INSERT', 'he', NULL, '{"id":7,"locale":"he","menu_type":"main"}', NULL, 'system', NULL, NULL, NULL, '2025-09-12 14:51:18');


-- =============================================================================
-- Tables from database.sqlite
-- =============================================================================

-- content_he table
DROP TABLE IF EXISTS content_he CASCADE;
CREATE TABLE content_he (
                        id SERIAL PRIMARY KEY,
                        locale TEXT DEFAULT 'he',
                        faq_1_title TEXT,
                        faq_2_title TEXT,
                        faq_3_title TEXT,
                        faq_4_title TEXT,
                        faq_5_title TEXT,
                        faq_6_title TEXT,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );

-- Data for content_he (1 rows)
INSERT INTO content_he VALUES (1, 'he', 'קורסים מוצעים', 'משך הקורסים', 'תעודות והסמכה', 'תמיכה בקריירה', 'דרישות קדם', 'למידה בקצב אישי', '2025-09-14 09:45:25', '2025-09-14 09:45:25');


-- home_pages table (from database.sqlite - different structure)
DROP TABLE IF EXISTS home_pages_he CASCADE;
CREATE TABLE home_pages_he (
    id SERIAL PRIMARY KEY,
    locale TEXT DEFAULT 'he',
    title TEXT DEFAULT 'AI Studio - Hebrew',
    faq_1_title TEXT,
    faq_2_title TEXT,
    faq_3_title TEXT,
    faq_4_title TEXT,
    faq_5_title TEXT,
    faq_6_title TEXT,
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Data for home_pages_he (1 rows)
INSERT INTO home_pages_he VALUES (1, 'he', 'AI Studio - Hebrew', 'קורסים מוצעים', 'משך הקורסים', 'תעודות והסמכה', 'תמיכה בקריירה', 'דרישות קדם', 'למידה בקצב אישי', '2025-09-14 09:46:05', '2025-09-14 09:46:05', '2025-09-14 09:46:05');


-- Commit transaction
COMMIT;

-- Export completed - FIXED VERSION with PostgreSQL compatibility
-- Key fixes applied:
-- 1. All boolean values changed from 1/0 to true/false
-- 2. Removed SQLite-specific constraints that don't work in PostgreSQL
-- 3. Removed foreign key constraints that reference non-existent tables
-- 4. Fixed salary range format (removed 'k' prefix and added '$' prefix)
-- 5. Renamed duplicate home_pages table to home_pages_he to avoid conflicts