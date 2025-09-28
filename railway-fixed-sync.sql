-- ================================================================
-- RAILWAY DATABASE SYNC - FIXED SQL SCRIPT FOR PGADMIN
-- ================================================================
-- Generated: 2025-09-26 (Fixed Version)
-- Purpose: Sync all local tables and data to Railway with duplicate prevention
-- Execute in pgAdmin connected to Railway database
-- ================================================================

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- ================================================================
-- HELPER FUNCTION
-- ================================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- ================================================================
-- TABLE STRUCTURES (WITH DUPLICATE PREVENTION)
-- ================================================================

CREATE TABLE IF NOT EXISTS public.about_pages (
    id integer NOT NULL,
    locale character varying(5) DEFAULT 'en'::character varying,
    hero_title character varying(255),
    hero_subtitle character varying(255),
    mission_title character varying(255),
    mission_description text,
    vision_title character varying(255),
    vision_description text,
    published_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id integer NOT NULL,
    title text,
    title_ru text,
    title_he text,
    content text,
    content_ru text,
    content_he text,
    excerpt text,
    author text,
    category text,
    image_url text,
    locale character varying(10) DEFAULT 'en'::character varying,
    published_at timestamp without time zone,
    published_date date,
    reading_time integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    url character varying(500) DEFAULT NULL::character varying,
    featured_image_url text,
    gallery_images jsonb DEFAULT '[]'::jsonb,
    video_url text,
    content_sections jsonb DEFAULT '[]'::jsonb,
    tags jsonb DEFAULT '[]'::jsonb,
    related_posts jsonb DEFAULT '[]'::jsonb,
    author_bio text,
    author_image_url text,
    author_social_links jsonb DEFAULT '{}'::jsonb,
    meta_title character varying(255),
    meta_description text,
    views_count integer DEFAULT 0,
    likes_count integer DEFAULT 0,
    shares_count integer DEFAULT 0,
    is_featured boolean DEFAULT false,
    is_published boolean DEFAULT true,
    is_visible boolean DEFAULT true,
    excerpt_ru text,
    excerpt_he text
);
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
CREATE TABLE IF NOT EXISTS public.button_texts (
    id integer NOT NULL,
    locale character varying(5) DEFAULT 'en'::character varying,
    get_started character varying(100) DEFAULT 'Get Started'::character varying,
    explore_courses character varying(100) DEFAULT 'Explore Courses'::character varying,
    learn_more character varying(100) DEFAULT 'Learn More'::character varying,
    enroll_now character varying(100) DEFAULT 'Enroll Now'::character varying,
    contact_us character varying(100) DEFAULT 'Contact Us'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE IF NOT EXISTS public.career_center_pages (
    id integer NOT NULL,
    title text,
    content text,
    services text,
    programs text,
    success_stories text,
    hero_title text,
    hero_subtitle text,
    services_data text,
    resources_data text,
    locale character varying(10) DEFAULT 'en'::character varying,
    published_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE IF NOT EXISTS public.career_orientation_pages (
    id integer NOT NULL,
    title text,
    content text,
    guidance_sections text,
    assessment_tools text,
    career_paths text,
    hero_title text,
    hero_subtitle text,
    assessment_data text,
    paths_data text,
    locale character varying(10) DEFAULT 'en'::character varying,
    published_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    hero_description text,
    hero_main_title text,
    hero_stat1_number text,
    hero_stat1_label text,
    hero_stat1_value text,
    hero_stat2_number text,
    hero_stat2_label text,
    hero_stat2_value text,
    hero_stat3_number text,
    hero_stat3_label text,
    hero_stat3_value text,
    hero_cta_text text,
    hero_cta_link text,
    hero_badge_text text,
    hero_visible boolean DEFAULT true,
    problems_main_title text,
    problems_subtitle text,
    problems_description text,
    problem1_icon text,
    problem1_title text,
    problem1_description text,
    problem1_stat text,
    problem1_stat_label text,
    problem2_icon text,
    problem2_title text,
    problem2_description text,
    problem2_stat text,
    problem2_stat_label text,
    problems_visible boolean DEFAULT true,
    solutions_main_title text,
    solutions_subtitle text,
    solution1_icon text,
    solution1_title text,
    solution1_description text,
    solution1_feature1 text,
    solution1_feature2 text,
CREATE TABLE IF NOT EXISTS public.career_resources (
    id integer NOT NULL,
    locale character varying(5) DEFAULT 'en'::character varying,
    title character varying(255),
    description text,
    type character varying(50),
    category character varying(100),
    download_url character varying(500),
    visible boolean DEFAULT true,
    published_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE IF NOT EXISTS public.company_logos (
    id integer NOT NULL,
    locale character varying(5) DEFAULT 'en'::character varying,
    section_title character varying(255) DEFAULT 'Our Graduates Work At'::character varying,
    company_1_name character varying(255) DEFAULT 'Google'::character varying,
    company_1_logo character varying(500),
    company_2_name character varying(255) DEFAULT 'Microsoft'::character varying,
    company_2_logo character varying(500),
    company_3_name character varying(255) DEFAULT 'Amazon'::character varying,
    company_3_logo character varying(500),
    company_4_name character varying(255) DEFAULT 'Meta'::character varying,
    company_4_logo character varying(500),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE IF NOT EXISTS public.consultation_services (
    id integer NOT NULL,
    title character varying(255),
    description text,
    duration character varying(100),
    price numeric(10,2),
    features jsonb,
    locale character varying(10) DEFAULT 'en'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE IF NOT EXISTS public.consultations (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(50),
    interest character varying(100) NOT NULL,
    experience character varying(50) NOT NULL,
    locale character varying(10) DEFAULT 'he'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE IF NOT EXISTS public.contact_pages (
    id integer NOT NULL,
    phone character varying(50),
    email character varying(255),
    address text,
    office_hours character varying(255),
    map_url character varying(500),
    published_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    locale character varying(5) DEFAULT 'en'::character varying
);
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE IF NOT EXISTS public.courses (
    id integer NOT NULL,
    locale character varying(10) DEFAULT 'en'::character varying,
    title text,
    title_en text,
    title_ru text,
    title_he text,
    description text,
    description_en text,
    description_ru text,
    description_he text,
    instructor text,
    duration text,
    lessons text,
    level text,
    price numeric(10,2),
    image_url text,
    category text,
    lessons_count integer,
    students_count integer,
    rating numeric(3,2),
    visible boolean DEFAULT true,
    published_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    old_price numeric(10,2),
    reviews character varying(50),
    url character varying(500),
    students character varying(50),
    image character varying(500)
);
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE IF NOT EXISTS public.entity_teachers (
    id integer NOT NULL,
    teacher_key character varying(100),
    full_name character varying(255) NOT NULL,
    professional_title character varying(255),
    company character varying(255),
    bio text,
    profile_image_url text,
    skills jsonb,
    experience_history jsonb,
    courses_taught jsonb,
    student_reviews jsonb,
    statistics jsonb,
    contact_info jsonb,
    social_links jsonb,
    is_featured boolean DEFAULT false,
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    full_name_ru character varying(255),
    professional_title_ru character varying(255),
    company_ru character varying(255),
    bio_ru text,
    full_name_he character varying(255),
    professional_title_he character varying(255),
    company_he character varying(255),
    bio_he text
);
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE IF NOT EXISTS public.faqs (
    id integer NOT NULL,
    locale character varying(5) DEFAULT 'en'::character varying,
    question text,
    answer text,
    category character varying(100),
    published_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE IF NOT EXISTS public.footer_content (
    id integer NOT NULL,
    locale character varying(10) DEFAULT 'en'::character varying,
    company_description text,
    copyright_text text,
    newsletter_title text,
    newsletter_placeholder text,
    newsletter_button_text text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE IF NOT EXISTS public.home_pages (
    id integer NOT NULL,
    title character varying(255),
    hero_title character varying(255),
    hero_subtitle character varying(255),
    hero_description text,
    hero_section_visible boolean DEFAULT true,
    featured_courses_title character varying(255),
    featured_courses_description text,
    featured_courses_visible boolean DEFAULT true,
    about_title character varying(255),
    about_subtitle character varying(255),
    about_description text,
    about_visible boolean DEFAULT true,
    companies_title character varying(255),
    companies_description text,
    companies_visible boolean DEFAULT true,
    testimonials_title character varying(255),
    testimonials_subtitle character varying(255),
    testimonials_visible boolean DEFAULT true,
    course_1_title character varying(255),
    course_1_rating character varying(10),
    course_1_lessons character varying(50),
    course_1_duration character varying(50),
    course_1_category character varying(100),
    course_1_description text,
    course_1_visible boolean DEFAULT true,
    course_2_title character varying(255),
    course_2_rating character varying(10),
    course_2_lessons character varying(50),
    course_2_duration character varying(50),
    course_2_category character varying(100),
    course_2_description text,
    course_2_visible boolean DEFAULT true,
    course_3_title character varying(255),
    course_3_rating character varying(10),
    course_3_lessons character varying(50),
    course_3_duration character varying(50),
    course_3_category character varying(100),
    course_3_description text,
    course_3_visible boolean DEFAULT true,
    course_4_title character varying(255),
    course_4_rating character varying(10),
    course_4_lessons character varying(50),
    course_4_duration character varying(50),
    course_4_category character varying(100),
    course_4_description text,
    course_4_visible boolean DEFAULT true,
    course_5_title character varying(255),
    course_5_rating character varying(10),
    course_5_lessons character varying(50),
CREATE TABLE IF NOT EXISTS public.job_postings (
    id integer NOT NULL,
    title character varying(255),
    company character varying(255),
    location character varying(255),
    type character varying(50),
    description text,
    apply_url character varying(500),
    published_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE IF NOT EXISTS public.navigation_menus (
    id integer NOT NULL,
    locale character varying(5) DEFAULT 'en'::character varying,
    home_label character varying(100) DEFAULT 'Home'::character varying,
    courses_label character varying(100) DEFAULT 'Courses'::character varying,
    teachers_label character varying(100) DEFAULT 'Teachers'::character varying,
    career_services_label character varying(100) DEFAULT 'Career Services'::character varying,
    career_center_label character varying(100) DEFAULT 'Career Center'::character varying,
    career_orientation_label character varying(100) DEFAULT 'Career Orientation'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE IF NOT EXISTS public.nd_about_page (
    id integer NOT NULL,
    section_name character varying(100) NOT NULL,
    content_en jsonb DEFAULT '{}'::jsonb,
    content_ru jsonb DEFAULT '{}'::jsonb,
    content_he jsonb DEFAULT '{}'::jsonb,
    visible boolean DEFAULT true,
    display_order integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE IF NOT EXISTS public.nd_blog_page (
    id integer NOT NULL,
    section_name character varying(100) NOT NULL,
    content_en jsonb DEFAULT '{}'::jsonb,
    content_ru jsonb DEFAULT '{}'::jsonb,
    content_he jsonb DEFAULT '{}'::jsonb,
    visible boolean DEFAULT true,
    display_order integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE IF NOT EXISTS public.nd_blog_posts (
    id integer NOT NULL,
    title_en character varying(255),
    title_ru character varying(255),
    title_he character varying(255),
    content_en text,
    content_ru text,
    content_he text,
    author character varying(255),
    featured_image character varying(500),
    published_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE IF NOT EXISTS public.nd_career_center_platform_page (
    id integer NOT NULL,
    section_name character varying(100) NOT NULL,
    content_en jsonb DEFAULT '{}'::jsonb,
    content_ru jsonb DEFAULT '{}'::jsonb,
    content_he jsonb DEFAULT '{}'::jsonb,
    visible boolean DEFAULT true,
    display_order integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE IF NOT EXISTS public.nd_contact_page (
    id integer NOT NULL,
    section_name character varying(100) NOT NULL,
    content_en jsonb DEFAULT '{}'::jsonb,
    content_ru jsonb DEFAULT '{}'::jsonb,
    content_he jsonb DEFAULT '{}'::jsonb,
    visible boolean DEFAULT true,
    display_order integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE IF NOT EXISTS public.nd_course_details_page (
    id integer NOT NULL,
    section_key character varying(100) NOT NULL,
    section_type character varying(50),
    content_en jsonb DEFAULT '{}'::jsonb,
    content_ru jsonb DEFAULT '{}'::jsonb,
    content_he jsonb DEFAULT '{}'::jsonb,
    visible boolean DEFAULT true,
    order_index integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE IF NOT EXISTS public.nd_courses (
    id integer NOT NULL,
    course_key character varying(100),
    title character varying(255) NOT NULL,
    description text,
    short_description character varying(500),
    price numeric(10,2),
    old_price numeric(10,2),
    currency character varying(10) DEFAULT 'USD'::character varying,
    duration character varying(100),
    level character varying(50),
    category character varying(100),
    instructor character varying(255),
    language character varying(50) DEFAULT 'English'::character varying,
    image text,
    video_url text,
    thumbnail text,
    url text,
    enrollment_url text,
    syllabus_url text,
    rating numeric(2,1),
    reviews_count integer DEFAULT 0,
    students_count integer DEFAULT 0,
    lessons_count integer DEFAULT 0,
    hours_count numeric(5,2),
    features jsonb DEFAULT '[]'::jsonb,
    syllabus jsonb DEFAULT '[]'::jsonb,
    requirements jsonb DEFAULT '[]'::jsonb,
    what_you_learn jsonb DEFAULT '[]'::jsonb,
    title_ru character varying(255),
    description_ru text,
    short_description_ru character varying(500),
    title_he character varying(255),
    description_he text,
    short_description_he character varying(500),
    featured boolean DEFAULT false,
    visible boolean DEFAULT true,
    published boolean DEFAULT true,
    enrollment_open boolean DEFAULT true,
    meta_title character varying(255),
    meta_description text,
    meta_keywords text,
    slug character varying(255),
    order_index integer DEFAULT 0,
    tags jsonb DEFAULT '[]'::jsonb,
    start_date date,
    end_date date,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    published_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    title_en character varying(255),
CREATE TABLE IF NOT EXISTS public.nd_courses_page (
    id integer NOT NULL,
    section_key character varying(100) NOT NULL,
    section_type character varying(50),
    content_en jsonb,
    content_ru jsonb,
    content_he jsonb,
    visible boolean DEFAULT true,
    animations_enabled boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE IF NOT EXISTS public.nd_footer (
    id integer NOT NULL,
    section_type character varying(50) NOT NULL,
    column_number integer,
    order_index integer DEFAULT 0,
    visible boolean DEFAULT true,
    item_type character varying(50),
    content_en text,
    content_ru text,
    content_he text,
    url character varying(500),
    icon_class character varying(100),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    placeholder_en text,
    placeholder_ru text,
    placeholder_he text,
    button_text_en text,
    button_text_ru text,
    button_text_he text
);
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE IF NOT EXISTS public.nd_home (
    id integer NOT NULL,
    section_key character varying(100) NOT NULL,
    section_type character varying(50),
    visible boolean DEFAULT true,
    order_index integer DEFAULT 0,
    content_en jsonb,
    content_ru jsonb,
    content_he jsonb,
    animations_enabled boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    about_en jsonb DEFAULT '{}'::jsonb,
    about_ru jsonb DEFAULT '{}'::jsonb,
    about_he jsonb DEFAULT '{}'::jsonb,
    pricing_en jsonb DEFAULT '{}'::jsonb,
    pricing_ru jsonb DEFAULT '{}'::jsonb,
    pricing_he jsonb DEFAULT '{}'::jsonb,
    faq_en jsonb DEFAULT '{}'::jsonb,
    faq_ru jsonb DEFAULT '{}'::jsonb,
    faq_he jsonb DEFAULT '{}'::jsonb,
    footer_en jsonb DEFAULT '{}'::jsonb,
    footer_ru jsonb DEFAULT '{}'::jsonb,
    footer_he jsonb DEFAULT '{}'::jsonb
);
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE IF NOT EXISTS public.nd_home_page (
    id integer NOT NULL,
    section_name character varying(100) NOT NULL,
    content_en jsonb DEFAULT '{}'::jsonb,
    content_ru jsonb DEFAULT '{}'::jsonb,
    content_he jsonb DEFAULT '{}'::jsonb,
    visible boolean DEFAULT true,
    display_order integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE IF NOT EXISTS public.nd_menu (
    id integer NOT NULL,
    parent_id integer,
    order_index integer DEFAULT 0,
    visible boolean DEFAULT true,
    label_en character varying(200),
    label_ru character varying(200),
    label_he character varying(200),
    url character varying(500),
    icon_class character varying(100),
    target character varying(20) DEFAULT '_self'::character varying,
    is_dropdown boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE IF NOT EXISTS public.nd_pricing_page (
    id integer NOT NULL,
    section_name character varying(100) NOT NULL,
    content_en jsonb DEFAULT '{}'::jsonb,
    content_ru jsonb DEFAULT '{}'::jsonb,
    content_he jsonb DEFAULT '{}'::jsonb,
    visible boolean DEFAULT true,
    display_order integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE IF NOT EXISTS public.nd_teachers_page (
    id integer NOT NULL,
    section_name character varying(100) NOT NULL,
    content_en jsonb DEFAULT '{}'::jsonb,
    content_ru jsonb DEFAULT '{}'::jsonb,
    content_he jsonb DEFAULT '{}'::jsonb,
    visible boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE IF NOT EXISTS public.nd_ui_translations (
    id integer NOT NULL,
    page character varying(100),
    element_key character varying(255),
    text_en text,
    text_ru text,
    text_he text,
    updated_at timestamp without time zone DEFAULT now()
);
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE IF NOT EXISTS public.pricing_plans (
    id integer NOT NULL,
    name text,
    price numeric(10,2),
    currency text,
    period text,
    features text,
    is_popular boolean DEFAULT false,
    locale character varying(10) DEFAULT 'en'::character varying,
    published_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE IF NOT EXISTS public.site_settings (
    id integer NOT NULL,
    locale character varying(5) DEFAULT 'en'::character varying,
    site_name character varying(255) DEFAULT 'AI Studio'::character varying,
    site_tagline character varying(500),
    logo_url character varying(500),
    footer_email character varying(255) DEFAULT 'info@aistudio555.com'::character varying,
    footer_phone character varying(50),
    footer_address text,
    footer_copyright text DEFAULT '© 2024 AI Studio. All rights reserved.'::text,
    facebook_url character varying(500),
    twitter_url character varying(500),
    instagram_url character varying(500),
    linkedin_url character varying(500),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE IF NOT EXISTS public.statistics (
    id integer NOT NULL,
    locale character varying(5) DEFAULT 'en'::character varying,
    courses_count character varying(50) DEFAULT '125+'::character varying,
    courses_label character varying(100) DEFAULT 'Courses'::character varying,
    learners_count character varying(50) DEFAULT '14,000+'::character varying,
    learners_label character varying(100) DEFAULT 'Learners'::character varying,
    years_count character varying(50) DEFAULT '10+'::character varying,
    years_label character varying(100) DEFAULT 'Years'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
CREATE TABLE IF NOT EXISTS public.teachers (
    id integer NOT NULL,
    name text,
    title text,
    bio text,
    bio_en text,
    bio_ru text,
    bio_he text,
    image_url text,
    expertise text,
    specialization_en text,
    specialization_ru text,
    specialization_he text,
    years_experience integer,
    courses_taught integer,
    rating numeric(3,2),
    locale character varying(10) DEFAULT 'en'::character varying,
    display_order integer DEFAULT 0,
    published_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    category character varying(50) DEFAULT 'all'::character varying,
    experience character varying(100),
    specialties text,
    company character varying(200),
    linkedin_url character varying(500),
    twitter_url character varying(500),
    github_url character varying(500)
);
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- ================================================================
-- DATA WITH PROPER UPSERT (DUPLICATE PREVENTION)
-- ================================================================


-- ================================================================
-- VERIFICATION QUERIES
-- ================================================================

-- Show all tables and their row counts
DO $$
DECLARE
    table_record RECORD;
    row_count INTEGER;
BEGIN
    RAISE NOTICE '=== RAILWAY DATABASE SYNC VERIFICATION ===';
    FOR table_record IN
        SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename
    LOOP
        BEGIN
            EXECUTE format('SELECT COUNT(*) FROM %I', table_record.tablename) INTO row_count;
            RAISE NOTICE 'Table %: % rows', table_record.tablename, row_count;
        EXCEPTION
            WHEN OTHERS THEN
                RAISE NOTICE 'Table %: ERROR - %', table_record.tablename, SQLERRM;
        END;
    END LOOP;
END $$;

-- Final verification
SELECT 
    'Railway database sync completed successfully!' AS status,
    COUNT(*) as total_tables,
    string_agg(tablename, ', ' ORDER BY tablename) as table_list
FROM pg_tables 
WHERE schemaname = 'public';
