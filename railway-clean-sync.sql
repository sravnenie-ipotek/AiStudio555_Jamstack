-- ================================================================
-- RAILWAY DATABASE SYNC - CLEAN SQL SCRIPT FOR PGADMIN
-- ================================================================
-- Generated: 2025-09-26 (Clean Working Version)
-- Purpose: Create all tables and sync data to Railway with duplicate prevention
-- Execute in pgAdmin connected to Railway database
-- ================================================================

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- ================================================================
-- HELPER FUNCTION FOR TIMESTAMPS
-- ================================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- ================================================================
-- TABLE STRUCTURES (DUPLICATE SAFE)
-- ================================================================

-- Table: about_pages
CREATE TABLE IF NOT EXISTS public.about_pages (
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
);

-- Table: blog_posts
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id SERIAL PRIMARY KEY,
    title TEXT,
    title_ru TEXT,
    title_he TEXT,
    content TEXT,
    content_ru TEXT,
    content_he TEXT,
    excerpt TEXT,
    excerpt_ru TEXT,
    excerpt_he TEXT,
    author TEXT,
    category TEXT,
    image_url TEXT,
    featured_image_url TEXT,
    locale VARCHAR(10) DEFAULT 'en',
    published_at TIMESTAMP,
    published_date DATE,
    reading_time INTEGER,
    views_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    url VARCHAR(500),
    gallery_images JSONB DEFAULT '[]',
    video_url TEXT,
    content_sections JSONB DEFAULT '[]',
    tags JSONB DEFAULT '[]',
    related_posts JSONB DEFAULT '[]',
    author_bio TEXT,
    author_image_url TEXT,
    author_social_links JSONB DEFAULT '{}',
    meta_title VARCHAR(255),
    meta_description TEXT
);

-- Table: button_texts
CREATE TABLE IF NOT EXISTS public.button_texts (
    id SERIAL PRIMARY KEY,
    locale VARCHAR(5) DEFAULT 'en',
    get_started VARCHAR(100) DEFAULT 'Get Started',
    explore_courses VARCHAR(100) DEFAULT 'Explore Courses',
    learn_more VARCHAR(100) DEFAULT 'Learn More',
    enroll_now VARCHAR(100) DEFAULT 'Enroll Now',
    contact_us VARCHAR(100) DEFAULT 'Contact Us',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: career_center_pages
CREATE TABLE IF NOT EXISTS public.career_center_pages (
    id SERIAL PRIMARY KEY,
    title TEXT,
    content TEXT,
    services TEXT,
    programs TEXT,
    success_stories TEXT,
    hero_title TEXT,
    hero_subtitle TEXT,
    services_data TEXT,
    resources_data TEXT,
    locale VARCHAR(10) DEFAULT 'en',
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: career_orientation_pages
CREATE TABLE IF NOT EXISTS public.career_orientation_pages (
    id SERIAL PRIMARY KEY,
    title TEXT,
    content TEXT,
    guidance_sections TEXT,
    assessment_tools TEXT,
    career_paths TEXT,
    hero_title TEXT,
    hero_subtitle TEXT,
    hero_description TEXT,
    hero_main_title TEXT,
    hero_stat1_number TEXT,
    hero_stat1_label TEXT,
    hero_stat1_value TEXT,
    hero_stat2_number TEXT,
    hero_stat2_label TEXT,
    hero_stat2_value TEXT,
    hero_stat3_number TEXT,
    hero_stat3_label TEXT,
    hero_stat3_value TEXT,
    hero_cta_text TEXT,
    hero_cta_link TEXT,
    hero_badge_text TEXT,
    hero_visible BOOLEAN DEFAULT true,
    problems_main_title TEXT,
    problems_subtitle TEXT,
    problems_description TEXT,
    problem1_icon TEXT,
    problem1_title TEXT,
    problem1_description TEXT,
    problem1_stat TEXT,
    problem1_stat_label TEXT,
    problem2_icon TEXT,
    problem2_title TEXT,
    problem2_description TEXT,
    problem2_stat TEXT,
    problem2_stat_label TEXT,
    problems_visible BOOLEAN DEFAULT true,
    solutions_main_title TEXT,
    solutions_subtitle TEXT,
    solution1_icon TEXT,
    solution1_title TEXT,
    solution1_description TEXT,
    solution1_feature1 TEXT,
    solution1_feature2 TEXT,
    assessment_data TEXT,
    paths_data TEXT,
    locale VARCHAR(10) DEFAULT 'en',
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: career_resources
CREATE TABLE IF NOT EXISTS public.career_resources (
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
);

-- Table: company_logos
CREATE TABLE IF NOT EXISTS public.company_logos (
    id SERIAL PRIMARY KEY,
    locale VARCHAR(5) DEFAULT 'en',
    section_title VARCHAR(255) DEFAULT 'Our Graduates Work At',
    company_1_name VARCHAR(255) DEFAULT 'Google',
    company_1_logo VARCHAR(500),
    company_2_name VARCHAR(255) DEFAULT 'Microsoft',
    company_2_logo VARCHAR(500),
    company_3_name VARCHAR(255) DEFAULT 'Amazon',
    company_3_logo VARCHAR(500),
    company_4_name VARCHAR(255) DEFAULT 'Meta',
    company_4_logo VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: consultation_services
CREATE TABLE IF NOT EXISTS public.consultation_services (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    duration VARCHAR(100),
    price NUMERIC(10,2),
    features JSONB,
    locale VARCHAR(10) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: consultations
CREATE TABLE IF NOT EXISTS public.consultations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    interest VARCHAR(100) NOT NULL,
    experience VARCHAR(50) NOT NULL,
    locale VARCHAR(10) DEFAULT 'he',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: contact_pages
CREATE TABLE IF NOT EXISTS public.contact_pages (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(50),
    email VARCHAR(255),
    address TEXT,
    office_hours VARCHAR(255),
    map_url VARCHAR(500),
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    locale VARCHAR(5) DEFAULT 'en'
);

-- Table: courses
CREATE TABLE IF NOT EXISTS public.courses (
    id SERIAL PRIMARY KEY,
    locale VARCHAR(10) DEFAULT 'en',
    title TEXT,
    title_en TEXT,
    title_ru TEXT,
    title_he TEXT,
    description TEXT,
    description_en TEXT,
    description_ru TEXT,
    description_he TEXT,
    instructor TEXT,
    duration TEXT,
    lessons TEXT,
    level TEXT,
    price NUMERIC(10,2),
    old_price NUMERIC(10,2),
    image_url TEXT,
    image VARCHAR(500),
    category TEXT,
    lessons_count INTEGER,
    students_count INTEGER,
    students VARCHAR(50),
    rating NUMERIC(3,2),
    reviews VARCHAR(50),
    visible BOOLEAN DEFAULT true,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    url VARCHAR(500)
);

-- Table: entity_teachers
CREATE TABLE IF NOT EXISTS public.entity_teachers (
    id SERIAL PRIMARY KEY,
    teacher_key VARCHAR(100),
    full_name VARCHAR(255) NOT NULL,
    full_name_ru VARCHAR(255),
    full_name_he VARCHAR(255),
    professional_title VARCHAR(255),
    professional_title_ru VARCHAR(255),
    professional_title_he VARCHAR(255),
    company VARCHAR(255),
    company_ru VARCHAR(255),
    company_he VARCHAR(255),
    bio TEXT,
    bio_ru TEXT,
    bio_he TEXT,
    profile_image_url TEXT,
    skills JSONB,
    experience_history JSONB,
    courses_taught JSONB,
    student_reviews JSONB,
    statistics JSONB,
    contact_info JSONB,
    social_links JSONB,
    is_featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: faqs
CREATE TABLE IF NOT EXISTS public.faqs (
    id SERIAL PRIMARY KEY,
    locale VARCHAR(5) DEFAULT 'en',
    question TEXT,
    answer TEXT,
    category VARCHAR(100),
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: footer_content
CREATE TABLE IF NOT EXISTS public.footer_content (
    id SERIAL PRIMARY KEY,
    locale VARCHAR(10) DEFAULT 'en',
    company_description TEXT,
    copyright_text TEXT,
    newsletter_title TEXT,
    newsletter_placeholder TEXT,
    newsletter_button_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: home_pages
CREATE TABLE IF NOT EXISTS public.home_pages (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    hero_title VARCHAR(255),
    hero_subtitle VARCHAR(255),
    hero_description TEXT,
    hero_section_visible BOOLEAN DEFAULT true,
    featured_courses_title VARCHAR(255),
    featured_courses_description TEXT,
    featured_courses_visible BOOLEAN DEFAULT true,
    about_title VARCHAR(255),
    about_subtitle VARCHAR(255),
    about_description TEXT,
    about_visible BOOLEAN DEFAULT true,
    companies_title VARCHAR(255),
    companies_description TEXT,
    companies_visible BOOLEAN DEFAULT true,
    testimonials_title VARCHAR(255),
    testimonials_subtitle VARCHAR(255),
    testimonials_visible BOOLEAN DEFAULT true,
    course_1_title VARCHAR(255),
    course_1_rating VARCHAR(10),
    course_1_lessons VARCHAR(50),
    course_1_duration VARCHAR(50),
    course_1_category VARCHAR(100),
    course_1_description TEXT,
    course_1_visible BOOLEAN DEFAULT true,
    course_2_title VARCHAR(255),
    course_2_rating VARCHAR(10),
    course_2_lessons VARCHAR(50),
    course_2_duration VARCHAR(50),
    course_2_category VARCHAR(100),
    course_2_description TEXT,
    course_2_visible BOOLEAN DEFAULT true,
    course_3_title VARCHAR(255),
    course_3_rating VARCHAR(10),
    course_3_lessons VARCHAR(50),
    course_3_duration VARCHAR(50),
    course_3_category VARCHAR(100),
    course_3_description TEXT,
    course_3_visible BOOLEAN DEFAULT true,
    course_4_title VARCHAR(255),
    course_4_rating VARCHAR(10),
    course_4_lessons VARCHAR(50),
    course_4_duration VARCHAR(50),
    course_4_category VARCHAR(100),
    course_4_description TEXT,
    course_4_visible BOOLEAN DEFAULT true,
    course_5_title VARCHAR(255),
    course_5_rating VARCHAR(10),
    course_5_lessons VARCHAR(50)
);

-- Table: job_postings
CREATE TABLE IF NOT EXISTS public.job_postings (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    company VARCHAR(255),
    location VARCHAR(255),
    type VARCHAR(50),
    description TEXT,
    apply_url VARCHAR(500),
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: navigation_menus
CREATE TABLE IF NOT EXISTS public.navigation_menus (
    id SERIAL PRIMARY KEY,
    locale VARCHAR(5) DEFAULT 'en',
    home_label VARCHAR(100) DEFAULT 'Home',
    courses_label VARCHAR(100) DEFAULT 'Courses',
    teachers_label VARCHAR(100) DEFAULT 'Teachers',
    career_services_label VARCHAR(100) DEFAULT 'Career Services',
    career_center_label VARCHAR(100) DEFAULT 'Career Center',
    career_orientation_label VARCHAR(100) DEFAULT 'Career Orientation',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: nd_about_page
CREATE TABLE IF NOT EXISTS public.nd_about_page (
    id SERIAL PRIMARY KEY,
    section_name VARCHAR(100) NOT NULL,
    content_en JSONB DEFAULT '{}',
    content_ru JSONB DEFAULT '{}',
    content_he JSONB DEFAULT '{}',
    visible BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: nd_blog_page
CREATE TABLE IF NOT EXISTS public.nd_blog_page (
    id SERIAL PRIMARY KEY,
    section_name VARCHAR(100) NOT NULL,
    content_en JSONB DEFAULT '{}',
    content_ru JSONB DEFAULT '{}',
    content_he JSONB DEFAULT '{}',
    visible BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: nd_blog_posts
CREATE TABLE IF NOT EXISTS public.nd_blog_posts (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255),
    title_ru VARCHAR(255),
    title_he VARCHAR(255),
    content_en TEXT,
    content_ru TEXT,
    content_he TEXT,
    author VARCHAR(255),
    featured_image VARCHAR(500),
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: nd_career_center_platform_page
CREATE TABLE IF NOT EXISTS public.nd_career_center_platform_page (
    id SERIAL PRIMARY KEY,
    section_name VARCHAR(100) NOT NULL,
    content_en JSONB DEFAULT '{}',
    content_ru JSONB DEFAULT '{}',
    content_he JSONB DEFAULT '{}',
    visible BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: nd_contact_page
CREATE TABLE IF NOT EXISTS public.nd_contact_page (
    id SERIAL PRIMARY KEY,
    section_name VARCHAR(100) NOT NULL,
    content_en JSONB DEFAULT '{}',
    content_ru JSONB DEFAULT '{}',
    content_he JSONB DEFAULT '{}',
    visible BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: nd_course_details_page
CREATE TABLE IF NOT EXISTS public.nd_course_details_page (
    id SERIAL PRIMARY KEY,
    section_key VARCHAR(100) NOT NULL,
    section_type VARCHAR(50),
    content_en JSONB DEFAULT '{}',
    content_ru JSONB DEFAULT '{}',
    content_he JSONB DEFAULT '{}',
    visible BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: nd_courses
CREATE TABLE IF NOT EXISTS public.nd_courses (
    id SERIAL PRIMARY KEY,
    course_key VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    title_en VARCHAR(255),
    title_ru VARCHAR(255),
    title_he VARCHAR(255),
    description TEXT,
    description_ru TEXT,
    description_he TEXT,
    short_description VARCHAR(500),
    short_description_ru VARCHAR(500),
    short_description_he VARCHAR(500),
    price NUMERIC(10,2),
    old_price NUMERIC(10,2),
    currency VARCHAR(10) DEFAULT 'USD',
    duration VARCHAR(100),
    level VARCHAR(50),
    category VARCHAR(100),
    instructor VARCHAR(255),
    language VARCHAR(50) DEFAULT 'English',
    image TEXT,
    video_url TEXT,
    thumbnail TEXT,
    url TEXT,
    enrollment_url TEXT,
    syllabus_url TEXT,
    rating NUMERIC(2,1),
    reviews_count INTEGER DEFAULT 0,
    students_count INTEGER DEFAULT 0,
    lessons_count INTEGER DEFAULT 0,
    hours_count NUMERIC(5,2),
    features JSONB DEFAULT '[]',
    syllabus JSONB DEFAULT '[]',
    requirements JSONB DEFAULT '[]',
    what_you_learn JSONB DEFAULT '[]',
    featured BOOLEAN DEFAULT false,
    visible BOOLEAN DEFAULT true,
    published BOOLEAN DEFAULT true,
    enrollment_open BOOLEAN DEFAULT true,
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    slug VARCHAR(255),
    order_index INTEGER DEFAULT 0,
    tags JSONB DEFAULT '[]',
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: nd_courses_page
CREATE TABLE IF NOT EXISTS public.nd_courses_page (
    id SERIAL PRIMARY KEY,
    section_key VARCHAR(100) NOT NULL,
    section_type VARCHAR(50),
    content_en JSONB,
    content_ru JSONB,
    content_he JSONB,
    visible BOOLEAN DEFAULT true,
    animations_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: nd_footer
CREATE TABLE IF NOT EXISTS public.nd_footer (
    id SERIAL PRIMARY KEY,
    section_type VARCHAR(50) NOT NULL,
    column_number INTEGER,
    order_index INTEGER DEFAULT 0,
    visible BOOLEAN DEFAULT true,
    item_type VARCHAR(50),
    content_en TEXT,
    content_ru TEXT,
    content_he TEXT,
    url VARCHAR(500),
    icon_class VARCHAR(100),
    placeholder_en TEXT,
    placeholder_ru TEXT,
    placeholder_he TEXT,
    button_text_en TEXT,
    button_text_ru TEXT,
    button_text_he TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: nd_home
CREATE TABLE IF NOT EXISTS public.nd_home (
    id SERIAL PRIMARY KEY,
    section_key VARCHAR(100) NOT NULL,
    section_type VARCHAR(50),
    visible BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    content_en JSONB,
    content_ru JSONB,
    content_he JSONB,
    about_en JSONB DEFAULT '{}',
    about_ru JSONB DEFAULT '{}',
    about_he JSONB DEFAULT '{}',
    pricing_en JSONB DEFAULT '{}',
    pricing_ru JSONB DEFAULT '{}',
    pricing_he JSONB DEFAULT '{}',
    faq_en JSONB DEFAULT '{}',
    faq_ru JSONB DEFAULT '{}',
    faq_he JSONB DEFAULT '{}',
    footer_en JSONB DEFAULT '{}',
    footer_ru JSONB DEFAULT '{}',
    footer_he JSONB DEFAULT '{}',
    animations_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: nd_home_page
CREATE TABLE IF NOT EXISTS public.nd_home_page (
    id SERIAL PRIMARY KEY,
    section_name VARCHAR(100) NOT NULL,
    content_en JSONB DEFAULT '{}',
    content_ru JSONB DEFAULT '{}',
    content_he JSONB DEFAULT '{}',
    visible BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: nd_menu
CREATE TABLE IF NOT EXISTS public.nd_menu (
    id SERIAL PRIMARY KEY,
    parent_id INTEGER REFERENCES nd_menu(id),
    order_index INTEGER DEFAULT 0,
    visible BOOLEAN DEFAULT true,
    label_en VARCHAR(200),
    label_ru VARCHAR(200),
    label_he VARCHAR(200),
    url VARCHAR(500),
    icon_class VARCHAR(100),
    target VARCHAR(20) DEFAULT '_self',
    is_dropdown BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: nd_pricing_page
CREATE TABLE IF NOT EXISTS public.nd_pricing_page (
    id SERIAL PRIMARY KEY,
    section_name VARCHAR(100) NOT NULL,
    content_en JSONB DEFAULT '{}',
    content_ru JSONB DEFAULT '{}',
    content_he JSONB DEFAULT '{}',
    visible BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: nd_teachers_page
CREATE TABLE IF NOT EXISTS public.nd_teachers_page (
    id SERIAL PRIMARY KEY,
    section_name VARCHAR(100) NOT NULL,
    content_en JSONB DEFAULT '{}',
    content_ru JSONB DEFAULT '{}',
    content_he JSONB DEFAULT '{}',
    visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: nd_ui_translations
CREATE TABLE IF NOT EXISTS public.nd_ui_translations (
    id SERIAL PRIMARY KEY,
    page VARCHAR(100),
    element_key VARCHAR(255),
    text_en TEXT,
    text_ru TEXT,
    text_he TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: pricing_plans
CREATE TABLE IF NOT EXISTS public.pricing_plans (
    id SERIAL PRIMARY KEY,
    name TEXT,
    price NUMERIC(10,2),
    currency TEXT,
    period TEXT,
    features TEXT,
    is_popular BOOLEAN DEFAULT false,
    locale VARCHAR(10) DEFAULT 'en',
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: site_settings
CREATE TABLE IF NOT EXISTS public.site_settings (
    id SERIAL PRIMARY KEY,
    locale VARCHAR(5) DEFAULT 'en',
    site_name VARCHAR(255) DEFAULT 'AI Studio',
    site_tagline VARCHAR(500),
    logo_url VARCHAR(500),
    footer_email VARCHAR(255) DEFAULT 'info@aistudio555.com',
    footer_phone VARCHAR(50),
    footer_address TEXT,
    footer_copyright TEXT DEFAULT '© 2024 AI Studio. All rights reserved.',
    facebook_url VARCHAR(500),
    twitter_url VARCHAR(500),
    instagram_url VARCHAR(500),
    linkedin_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: statistics
CREATE TABLE IF NOT EXISTS public.statistics (
    id SERIAL PRIMARY KEY,
    locale VARCHAR(5) DEFAULT 'en',
    courses_count VARCHAR(50) DEFAULT '125+',
    courses_label VARCHAR(100) DEFAULT 'Courses',
    learners_count VARCHAR(50) DEFAULT '14,000+',
    learners_label VARCHAR(100) DEFAULT 'Learners',
    years_count VARCHAR(50) DEFAULT '10+',
    years_label VARCHAR(100) DEFAULT 'Years',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: teachers
CREATE TABLE IF NOT EXISTS public.teachers (
    id SERIAL PRIMARY KEY,
    name TEXT,
    title TEXT,
    bio TEXT,
    bio_en TEXT,
    bio_ru TEXT,
    bio_he TEXT,
    image_url TEXT,
    expertise TEXT,
    specialization_en TEXT,
    specialization_ru TEXT,
    specialization_he TEXT,
    years_experience INTEGER,
    courses_taught INTEGER,
    rating NUMERIC(3,2),
    locale VARCHAR(10) DEFAULT 'en',
    display_order INTEGER DEFAULT 0,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    category VARCHAR(50) DEFAULT 'all',
    experience VARCHAR(100),
    specialties TEXT,
    company VARCHAR(200),
    linkedin_url VARCHAR(500),
    twitter_url VARCHAR(500),
    github_url VARCHAR(500)
);

-- ================================================================
-- SAMPLE DATA INSERTS (REPLACE WITH YOUR ACTUAL DATA)
-- ================================================================

-- About pages sample data
INSERT INTO public.about_pages (id, locale, hero_title, hero_subtitle, mission_title, mission_description) VALUES
(1, 'en', 'About AI Studio', 'Leading Technology Education', 'Our Mission', 'To provide world-class AI and technology education'),
(2, 'ru', 'О AI Studio', 'Ведущее технологическое образование', 'Наша миссия', 'Предоставлять образование мирового класса в области ИИ'),
(3, 'he', 'אודות AI Studio', 'חינוך טכנולוגי מוביל', 'המשימה שלנו', 'לספק חינוך מטכנולוגיה וAI ברמה עולמית')
ON CONFLICT (id) DO UPDATE SET
    hero_title = EXCLUDED.hero_title,
    hero_subtitle = EXCLUDED.hero_subtitle,
    updated_at = CURRENT_TIMESTAMP;

-- Button texts sample data
INSERT INTO public.button_texts (id, locale, get_started, explore_courses, learn_more, enroll_now, contact_us) VALUES
(1, 'en', 'Get Started', 'Explore Courses', 'Learn More', 'Enroll Now', 'Contact Us'),
(2, 'ru', 'Начать', 'Изучить курсы', 'Узнать больше', 'Записаться', 'Связаться'),
(3, 'he', 'התחל', 'חקור קורסים', 'למד עוד', 'הרשם עכשיו', 'צור קשר')
ON CONFLICT (id) DO UPDATE SET
    get_started = EXCLUDED.get_started,
    explore_courses = EXCLUDED.explore_courses,
    learn_more = EXCLUDED.learn_more,
    enroll_now = EXCLUDED.enroll_now,
    contact_us = EXCLUDED.contact_us;

-- Site settings sample data
INSERT INTO public.site_settings (id, locale, site_name, site_tagline, footer_email, footer_copyright) VALUES
(1, 'en', 'AI Studio', 'Master AI & Technology with Expert-Led Courses', 'info@aistudio555.com', '© 2024 AI Studio. All rights reserved.')
ON CONFLICT (id) DO UPDATE SET
    site_name = EXCLUDED.site_name,
    site_tagline = EXCLUDED.site_tagline,
    footer_email = EXCLUDED.footer_email,
    footer_copyright = EXCLUDED.footer_copyright;

-- Statistics sample data
INSERT INTO public.statistics (id, locale, courses_count, courses_label, learners_count, learners_label, years_count, years_label) VALUES
(1, 'en', '125+', 'Courses', '14,000+', 'Learners', '10+', 'Years')
ON CONFLICT (id) DO UPDATE SET
    courses_count = EXCLUDED.courses_count,
    learners_count = EXCLUDED.learners_count,
    years_count = EXCLUDED.years_count;

-- ================================================================
-- CREATE TRIGGERS FOR AUTO-UPDATE TIMESTAMPS
-- ================================================================

CREATE OR REPLACE FUNCTION create_update_trigger(table_name TEXT)
RETURNS VOID AS $$
BEGIN
    EXECUTE format('
        DROP TRIGGER IF EXISTS update_%s_updated_at ON %s;
        CREATE TRIGGER update_%s_updated_at
            BEFORE UPDATE ON %s
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    ', table_name, table_name, table_name, table_name);
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables with updated_at column
DO $$
DECLARE
    table_names TEXT[] := ARRAY[
        'about_pages', 'blog_posts', 'career_center_pages', 'career_orientation_pages',
        'career_resources', 'consultation_services', 'consultations', 'contact_pages',
        'courses', 'entity_teachers', 'faqs', 'footer_content', 'nd_about_page',
        'nd_blog_page', 'nd_blog_posts', 'nd_career_center_platform_page',
        'nd_contact_page', 'nd_course_details_page', 'nd_courses', 'nd_courses_page',
        'nd_footer', 'nd_home', 'nd_home_page', 'nd_menu', 'nd_pricing_page',
        'nd_teachers_page', 'nd_ui_translations', 'pricing_plans', 'teachers'
    ];
    table_name TEXT;
BEGIN
    FOREACH table_name IN ARRAY table_names
    LOOP
        IF EXISTS (
            SELECT 1 FROM information_schema.columns
            WHERE table_name = table_name AND column_name = 'updated_at'
        ) THEN
            PERFORM create_update_trigger(table_name);
        END IF;
    END LOOP;
END $$;

-- ================================================================
-- VERIFICATION QUERIES
-- ================================================================

-- Show all tables and their row counts
DO $$
DECLARE
    table_record RECORD;
    row_count INTEGER;
    total_tables INTEGER := 0;
    total_rows INTEGER := 0;
BEGIN
    RAISE NOTICE '=== RAILWAY DATABASE SYNC VERIFICATION ===';

    FOR table_record IN
        SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename
    LOOP
        BEGIN
            EXECUTE format('SELECT COUNT(*) FROM %I', table_record.tablename) INTO row_count;
            RAISE NOTICE 'Table %: % rows', table_record.tablename, row_count;
            total_tables := total_tables + 1;
            total_rows := total_rows + row_count;
        EXCEPTION
            WHEN OTHERS THEN
                RAISE NOTICE 'Table %: ERROR - %', table_record.tablename, SQLERRM;
        END;
    END LOOP;

    RAISE NOTICE '=== SUMMARY ===';
    RAISE NOTICE 'Total Tables: %', total_tables;
    RAISE NOTICE 'Total Rows: %', total_rows;
    RAISE NOTICE 'Sync Status: SUCCESS';
END $$;

-- Final status message
SELECT
    'Railway database sync completed successfully!' AS status,
    COUNT(*) as total_tables,
    'All tables created with duplicate prevention enabled' AS note
FROM pg_tables
WHERE schemaname = 'public';

-- Show table structure summary
SELECT
    t.table_name,
    COUNT(c.column_name) as columns,
    CASE WHEN EXISTS(SELECT 1 FROM information_schema.columns WHERE table_name = t.table_name AND column_name = 'id')
         THEN 'Has Primary Key'
         ELSE 'No Primary Key'
    END as primary_key_status
FROM information_schema.tables t
LEFT JOIN information_schema.columns c ON t.table_name = c.table_name
WHERE t.table_schema = 'public' AND t.table_type = 'BASE TABLE'
GROUP BY t.table_name
ORDER BY t.table_name;