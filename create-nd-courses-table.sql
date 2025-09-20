-- Create nd_courses table for NewDesign project
-- Date: 2025-09-20

-- Drop table if exists for clean start
DROP TABLE IF EXISTS nd_courses;

-- Create the nd_courses table with translation columns
CREATE TABLE nd_courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
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

    -- Status
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

-- Insert test data with proper translations
INSERT INTO nd_courses (
    id, course_key, title, title_ru, title_he,
    description, description_ru, description_he,
    price, duration, category, instructor,
    image, rating, featured, visible, lessons_count
) VALUES
(2, 'course-2',
    'React & Redux Masterclass',
    'Мастер-класс React и Redux',
    'מאסטר-קלאס React ו-Redux',
    'Master React.js and Redux for building scalable single-page applications. Learn component architecture, state management, hooks, and best practices for production-ready React apps.',
    'Глубоко изучите React.js и Redux для создания масштабируемых одностраничных приложений. Изучите архитектуру компонентов, управление состоянием, хуки и лучшие практики.',
    'למדו React.js ו-Redux לבניית אפליקציות חד-עמודיות ניתנות להרחבה. למדו ארכיטקטורת רכיבים, ניהול מצב, hooks ושיטות מומלצות.',
    '99.99', '10 weeks', 'App Development', 'Michael Chen',
    'images/course-react.jpg', '4.5', true, true, 32
),
(3, 'course-3',
    'Node.js Backend Development',
    'Разработка Backend на Node.js',
    'פיתוח Backend עם Node.js',
    'Become a backend expert with Node.js, Express, and MongoDB. Learn to build RESTful APIs, handle authentication, implement security best practices.',
    'Станьте экспертом по backend с Node.js, Express и MongoDB. Научитесь создавать RESTful API, обрабатывать аутентификацию.',
    'הפכו למומחי backend עם Node.js, Express ו-MongoDB. למדו לבנות RESTful APIs, לטפל באימות.',
    '99.99', '9 weeks', 'Machine Learning', 'David Williams',
    'images/course-nodejs.jpg', '4.5', true, true, 28
),
(4, 'course-4',
    'Python for Data Science',
    'Python для науки о данных',
    'Python למדע הנתונים',
    'Unlock the power of Python for data analysis and machine learning. Master pandas, NumPy, matplotlib, and scikit-learn.',
    'Раскройте возможности Python для анализа данных и машинного обучения. Освойте pandas, NumPy, matplotlib и scikit-learn.',
    'שחררו את הכוח של Python לניתוח נתונים ולמידת מכונה. שלטו ב-pandas, NumPy, matplotlib ו-scikit-learn.',
    '99.99', '12 weeks', 'Web Development', 'Dr. Emily Martinez',
    'images/course-python.jpg', '4.5', false, true, 36
);

-- Create indexes for performance
CREATE INDEX idx_nd_courses_visible ON nd_courses(visible);
CREATE INDEX idx_nd_courses_featured ON nd_courses(featured);
CREATE INDEX idx_nd_courses_category ON nd_courses(category);

-- Verify the data
SELECT
    id,
    title,
    CASE WHEN title_ru IS NOT NULL THEN '✅' ELSE '❌' END as has_ru,
    CASE WHEN title_he IS NOT NULL THEN '✅' ELSE '❌' END as has_he,
    category,
    featured
FROM nd_courses;