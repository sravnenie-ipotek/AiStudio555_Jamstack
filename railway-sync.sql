-- RAILWAY DATABASE SYNC SCRIPT
-- Generated: 2025-09-26T08:13:09.297Z
-- Tables: 36

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;


-- ========================================
-- TABLE: about_pages
-- ========================================

      DO $$
      BEGIN
        CREATE TABLE IF NOT EXISTS about_pages (
  id INTEGER NOT NULL DEFAULT nextval('about_pages_id_seq'::regclass),
  locale VARCHAR(5),
  hero_title VARCHAR(255),
  hero_subtitle VARCHAR(255),
  mission_title VARCHAR(255),
  mission_description TEXT,
  vision_title VARCHAR(255),
  vision_description TEXT,
  published_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

        -- Create sequences if needed
        CREATE SEQUENCE IF NOT EXISTS about_pages_id_seq;
      END $$;
    

-- ========================================
-- TABLE: blog_posts
-- ========================================

      DO $$
      BEGIN
        CREATE TABLE IF NOT EXISTS blog_posts (
  id INTEGER NOT NULL DEFAULT nextval('blog_posts_id_seq'::regclass),
  title TEXT,
  title_ru TEXT,
  title_he TEXT,
  content TEXT,
  content_ru TEXT,
  content_he TEXT,
  excerpt TEXT,
  author TEXT,
  category TEXT,
  image_url TEXT,
  locale VARCHAR(10),
  published_at TIMESTAMP WITHOUT TIME ZONE,
  published_date DATE,
  reading_time INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  url VARCHAR(500),
  featured_image_url TEXT,
  gallery_images JSONB,
  video_url TEXT,
  content_sections JSONB,
  tags JSONB,
  related_posts JSONB,
  author_bio TEXT,
  author_image_url TEXT,
  author_social_links JSONB,
  meta_title VARCHAR(255),
  meta_description TEXT,
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  is_visible BOOLEAN DEFAULT true,
  excerpt_ru TEXT,
  excerpt_he TEXT,
  PRIMARY KEY (id)
);

        -- Create sequences if needed
        CREATE SEQUENCE IF NOT EXISTS blog_posts_id_seq;
      END $$;
    

-- ========================================
-- TABLE: button_texts
-- ========================================

      DO $$
      BEGIN
        CREATE TABLE IF NOT EXISTS button_texts (
  id INTEGER NOT NULL DEFAULT nextval('button_texts_id_seq'::regclass),
  locale VARCHAR(5),
  get_started VARCHAR(100),
  explore_courses VARCHAR(100),
  learn_more VARCHAR(100),
  enroll_now VARCHAR(100),
  contact_us VARCHAR(100),
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

        -- Create sequences if needed
        CREATE SEQUENCE IF NOT EXISTS button_texts_id_seq;
      END $$;
    

-- ========================================
-- TABLE: career_center_pages
-- ========================================

      DO $$
      BEGIN
        CREATE TABLE IF NOT EXISTS career_center_pages (
  id INTEGER NOT NULL DEFAULT nextval('career_center_pages_id_seq'::regclass),
  title TEXT,
  content TEXT,
  services TEXT,
  programs TEXT,
  success_stories TEXT,
  hero_title TEXT,
  hero_subtitle TEXT,
  services_data TEXT,
  resources_data TEXT,
  locale VARCHAR(10),
  published_at TIMESTAMP WITHOUT TIME ZONE,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

        -- Create sequences if needed
        CREATE SEQUENCE IF NOT EXISTS career_center_pages_id_seq;
      END $$;
    

-- ========================================
-- TABLE: career_orientation_pages
-- ========================================

      DO $$
      BEGIN
        CREATE TABLE IF NOT EXISTS career_orientation_pages (
  id INTEGER NOT NULL DEFAULT nextval('career_orientation_pages_id_seq'::regclass),
  title TEXT,
  content TEXT,
  guidance_sections TEXT,
  assessment_tools TEXT,
  career_paths TEXT,
  hero_title TEXT,
  hero_subtitle TEXT,
  assessment_data TEXT,
  paths_data TEXT,
  locale VARCHAR(10),
  published_at TIMESTAMP WITHOUT TIME ZONE,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
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
  solution1_feature3 TEXT,
  solution1_feature4 TEXT,
  solution1_benefit TEXT,
  solutions_visible BOOLEAN DEFAULT true,
  process_main_title TEXT,
  process_subtitle TEXT,
  process_title TEXT,
  process_step1_title TEXT,
  process_step1_description TEXT,
  process_step1_duration TEXT,
  process_step2_title TEXT,
  process_step2_description TEXT,
  process_step2_duration TEXT,
  process_step3_title TEXT,
  process_step3_description TEXT,
  process_step3_duration TEXT,
  process_visible BOOLEAN DEFAULT true,
  career_paths_main_title TEXT,
  career_paths_subtitle TEXT,
  career_path1_title TEXT,
  career_path1_description TEXT,
  career_path1_salary_range TEXT,
  career_path1_growth_rate TEXT,
  career_path1_top_skills TEXT,
  career_paths_visible BOOLEAN DEFAULT true,
  expert_name TEXT,
  expert_title TEXT,
  expert_credentials TEXT,
  expert_background TEXT,
  expert_description TEXT,
  expert_quote TEXT,
  expert_linkedin TEXT,
  expert_twitter TEXT,
  expert_visible BOOLEAN DEFAULT true,
  partners_main_title TEXT,
  partners_subtitle TEXT,
  partners_title TEXT,
  partner1_name TEXT,
  partner1_description TEXT,
  partner2_name TEXT,
  partner2_description TEXT,
  partner3_name TEXT,
  partner3_description TEXT,
  partners_visible BOOLEAN DEFAULT true,
  assessment_main_title TEXT,
  assessment_subtitle TEXT,
  assessment_description TEXT,
  assessment_visible BOOLEAN DEFAULT true,
  cta_main_title TEXT,
  cta_subtitle TEXT,
  cta_description TEXT,
  cta_button_text TEXT,
  cta_button_link TEXT,
  cta_visible BOOLEAN DEFAULT true,
  challenges_title TEXT,
  challenge1_title TEXT,
  challenge1_description TEXT,
  challenge2_title TEXT,
  challenge2_description TEXT,
  challenge3_title TEXT,
  challenge3_description TEXT,
  challenge4_title TEXT,
  challenge4_description TEXT,
  solution2_icon TEXT,
  solution2_title TEXT,
  solution2_description TEXT,
  process_step4_title TEXT,
  process_step4_description TEXT,
  process_step4_duration TEXT,
  process_step5_title TEXT,
  process_step5_description TEXT,
  process_step5_duration TEXT,
  career_path2_title TEXT,
  career_path2_description TEXT,
  career_path2_salary_range TEXT,
  career_path2_growth_rate TEXT,
  career_path3_title TEXT,
  career_path3_description TEXT,
  expert_achievements TEXT,
  assessment_questions JSON,
  resources_main_title TEXT,
  resources_subtitle TEXT,
  resources JSON,
  resources_visible BOOLEAN DEFAULT true,
  success_stories_main_title TEXT,
  success_stories_subtitle TEXT,
  success_stories JSON,
  success_stories_visible BOOLEAN DEFAULT true,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  subtitle TEXT,
  solutions_description TEXT,
  outcomes_main_title TEXT,
  outcomes_subtitle TEXT,
  outcomes_description TEXT,
  outcome1_text TEXT,
  outcome2_text TEXT,
  outcome3_text TEXT,
  outcome4_text TEXT,
  expert_stat1_number TEXT,
  expert_stat1_label TEXT,
  expert_stat2_number TEXT,
  expert_stat2_label TEXT,
  cta_privacy_text TEXT,
  PRIMARY KEY (id)
);

        -- Create sequences if needed
        CREATE SEQUENCE IF NOT EXISTS career_orientation_pages_id_seq;
      END $$;
    

-- ========================================
-- TABLE: career_resources
-- ========================================

      DO $$
      BEGIN
        CREATE TABLE IF NOT EXISTS career_resources (
  id INTEGER NOT NULL DEFAULT nextval('career_resources_id_seq'::regclass),
  locale VARCHAR(5),
  title VARCHAR(255),
  description TEXT,
  type VARCHAR(50),
  category VARCHAR(100),
  download_url VARCHAR(500),
  visible BOOLEAN DEFAULT true,
  published_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

        -- Create sequences if needed
        CREATE SEQUENCE IF NOT EXISTS career_resources_id_seq;
      END $$;
    

-- ========================================
-- TABLE: company_logos
-- ========================================

      DO $$
      BEGIN
        CREATE TABLE IF NOT EXISTS company_logos (
  id INTEGER NOT NULL DEFAULT nextval('company_logos_id_seq'::regclass),
  locale VARCHAR(5),
  section_title VARCHAR(255),
  company_1_name VARCHAR(255),
  company_1_logo VARCHAR(500),
  company_2_name VARCHAR(255),
  company_2_logo VARCHAR(500),
  company_3_name VARCHAR(255),
  company_3_logo VARCHAR(500),
  company_4_name VARCHAR(255),
  company_4_logo VARCHAR(500),
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

        -- Create sequences if needed
        CREATE SEQUENCE IF NOT EXISTS company_logos_id_seq;
      END $$;
    

-- ========================================
-- TABLE: consultation_services
-- ========================================

      DO $$
      BEGIN
        CREATE TABLE IF NOT EXISTS consultation_services (
  id INTEGER NOT NULL DEFAULT nextval('consultation_services_id_seq'::regclass),
  title VARCHAR(255),
  description TEXT,
  duration VARCHAR(100),
  price NUMERIC(10,2),
  features JSONB,
  locale VARCHAR(10),
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

        -- Create sequences if needed
        CREATE SEQUENCE IF NOT EXISTS consultation_services_id_seq;
      END $$;
    

-- ========================================
-- TABLE: consultations
-- ========================================

      DO $$
      BEGIN
        CREATE TABLE IF NOT EXISTS consultations (
  id INTEGER NOT NULL DEFAULT nextval('consultations_id_seq'::regclass),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  interest VARCHAR(100) NOT NULL,
  experience VARCHAR(50) NOT NULL,
  locale VARCHAR(10),
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

        -- Create sequences if needed
        CREATE SEQUENCE IF NOT EXISTS consultations_id_seq;
      END $$;
    

-- ========================================
-- TABLE: contact_pages
-- ========================================

      DO $$
      BEGIN
        CREATE TABLE IF NOT EXISTS contact_pages (
  id INTEGER NOT NULL DEFAULT nextval('contact_pages_id_seq'::regclass),
  phone VARCHAR(50),
  email VARCHAR(255),
  address TEXT,
  office_hours VARCHAR(255),
  map_url VARCHAR(500),
  published_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  locale VARCHAR(5),
  PRIMARY KEY (id)
);

        -- Create sequences if needed
        CREATE SEQUENCE IF NOT EXISTS contact_pages_id_seq;
      END $$;
    

-- ========================================
-- TABLE: courses
-- ========================================

      DO $$
      BEGIN
        CREATE TABLE IF NOT EXISTS courses (
  id INTEGER NOT NULL DEFAULT nextval('courses_id_seq'::regclass),
  locale VARCHAR(10),
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
  image_url TEXT,
  category TEXT,
  lessons_count INTEGER,
  students_count INTEGER,
  rating NUMERIC(3,2),
  visible BOOLEAN DEFAULT true,
  published_at TIMESTAMP WITHOUT TIME ZONE,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  old_price NUMERIC(10,2),
  reviews VARCHAR(50),
  url VARCHAR(500),
  students VARCHAR(50),
  image VARCHAR(500),
  PRIMARY KEY (id)
);

        -- Create sequences if needed
        CREATE SEQUENCE IF NOT EXISTS courses_id_seq;
      END $$;
    

-- ========================================
-- TABLE: entity_teachers
-- ========================================

      DO $$
      BEGIN
        CREATE TABLE IF NOT EXISTS entity_teachers (
  id INTEGER NOT NULL DEFAULT nextval('entity_teachers_id_seq'::regclass),
  teacher_key VARCHAR(100),
  full_name VARCHAR(255) NOT NULL,
  professional_title VARCHAR(255),
  company VARCHAR(255),
  bio TEXT,
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  full_name_ru VARCHAR(255),
  professional_title_ru VARCHAR(255),
  company_ru VARCHAR(255),
  bio_ru TEXT,
  full_name_he VARCHAR(255),
  professional_title_he VARCHAR(255),
  company_he VARCHAR(255),
  bio_he TEXT,
  PRIMARY KEY (id)
);

        -- Create sequences if needed
        CREATE SEQUENCE IF NOT EXISTS entity_teachers_id_seq;
      END $$;
    

-- ========================================
-- TABLE: faqs
-- ========================================

      DO $$
      BEGIN
        CREATE TABLE IF NOT EXISTS faqs (
  id INTEGER NOT NULL DEFAULT nextval('faqs_id_seq'::regclass),
  locale VARCHAR(5),
  question TEXT,
  answer TEXT,
  category VARCHAR(100),
  order INTEGER,
  published_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

        -- Create sequences if needed
        CREATE SEQUENCE IF NOT EXISTS faqs_id_seq;
      END $$;
    

-- ========================================
-- TABLE: footer_content
-- ========================================

      DO $$
      BEGIN
        CREATE TABLE IF NOT EXISTS footer_content (
  id INTEGER NOT NULL DEFAULT nextval('footer_content_id_seq'::regclass),
  locale VARCHAR(10),
  company_description TEXT,
  copyright_text TEXT,
  newsletter_title TEXT,
  newsletter_placeholder TEXT,
  newsletter_button_text TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

        -- Create sequences if needed
        CREATE SEQUENCE IF NOT EXISTS footer_content_id_seq;
      END $$;
    

-- ========================================
-- TABLE: home_pages
-- ========================================

      DO $$
      BEGIN
        CREATE TABLE IF NOT EXISTS home_pages (
  id INTEGER NOT NULL DEFAULT nextval('home_pages_id_seq'::regclass),
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
  course_5_lessons VARCHAR(50),
  course_5_duration VARCHAR(50),
  course_5_category VARCHAR(100),
  course_5_description TEXT,
  course_5_visible BOOLEAN DEFAULT true,
  course_6_title VARCHAR(255),
  course_6_rating VARCHAR(10),
  course_6_lessons VARCHAR(50),
  course_6_duration VARCHAR(50),
  course_6_category VARCHAR(100),
  course_6_description TEXT,
  course_6_visible BOOLEAN DEFAULT true,
  testimonial_1_text TEXT,
  testimonial_1_author VARCHAR(255),
  testimonial_1_rating VARCHAR(10),
  testimonial_1_visible BOOLEAN DEFAULT true,
  testimonial_2_text TEXT,
  testimonial_2_author VARCHAR(255),
  testimonial_2_rating VARCHAR(10),
  testimonial_2_visible BOOLEAN DEFAULT true,
  testimonial_3_text TEXT,
  testimonial_3_author VARCHAR(255),
  testimonial_3_rating VARCHAR(10),
  testimonial_3_visible BOOLEAN DEFAULT true,
  testimonial_4_text TEXT,
  testimonial_4_author VARCHAR(255),
  testimonial_4_rating VARCHAR(10),
  testimonial_4_visible BOOLEAN DEFAULT true,
  published_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  locale VARCHAR(5),
  practice_description TEXT,
  feature_1_title VARCHAR(255),
  feature_1_description TEXT,
  feature_2_title VARCHAR(255),
  feature_2_description TEXT,
  feature_3_title VARCHAR(255),
  feature_3_description TEXT,
  feature_4_title VARCHAR(255),
  feature_4_description TEXT,
  feature_5_title VARCHAR(255),
  feature_5_description TEXT,
  feature_6_title VARCHAR(255),
  feature_6_description TEXT,
  PRIMARY KEY (id)
);

        -- Create sequences if needed
        CREATE SEQUENCE IF NOT EXISTS home_pages_id_seq;
      END $$;
    

-- ========================================
-- TABLE: job_postings
-- ========================================

      DO $$
      BEGIN
        CREATE TABLE IF NOT EXISTS job_postings (
  id INTEGER NOT NULL DEFAULT nextval('job_postings_id_seq'::regclass),
  title VARCHAR(255),
  company VARCHAR(255),
  location VARCHAR(255),
  type VARCHAR(50),
  description TEXT,
  apply_url VARCHAR(500),
  published_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

        -- Create sequences if needed
        CREATE SEQUENCE IF NOT EXISTS job_postings_id_seq;
      END $$;
    

-- ========================================
-- TABLE: navigation_menus
-- ========================================

      DO $$
      BEGIN
        CREATE TABLE IF NOT EXISTS navigation_menus (
  id INTEGER NOT NULL DEFAULT nextval('navigation_menus_id_seq'::regclass),
  locale VARCHAR(5),
  home_label VARCHAR(100),
  courses_label VARCHAR(100),
  teachers_label VARCHAR(100),
  career_services_label VARCHAR(100),
  career_center_label VARCHAR(100),
  career_orientation_label VARCHAR(100),
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

        -- Create sequences if needed
        CREATE SEQUENCE IF NOT EXISTS navigation_menus_id_seq;
      END $$;
    

-- ========================================
-- TABLE: nd_about_page
-- ========================================

      DO $$
      BEGIN
        CREATE TABLE IF NOT EXISTS nd_about_page (
  id INTEGER NOT NULL DEFAULT nextval('nd_about_page_id_seq'::regclass),
  section_name VARCHAR(100) NOT NULL,
  content_en JSONB,
  content_ru JSONB,
  content_he JSONB,
  visible BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  PRIMARY KEY (id)
);

        -- Create sequences if needed
        CREATE SEQUENCE IF NOT EXISTS nd_about_page_id_seq;
      END $$;
    

-- ========================================
-- TABLE: nd_blog_page
-- ========================================

      DO $$
      BEGIN
        CREATE TABLE IF NOT EXISTS nd_blog_page (
  id INTEGER NOT NULL DEFAULT nextval('nd_blog_page_id_seq'::regclass),
  section_name VARCHAR(100) NOT NULL,
  content_en JSONB,
  content_ru JSONB,
  content_he JSONB,
  visible BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  PRIMARY KEY (id)
);

        -- Create sequences if needed
        CREATE SEQUENCE IF NOT EXISTS nd_blog_page_id_seq;
      END $$;
    

-- ========================================
-- TABLE: nd_blog_posts
-- ========================================

      DO $$
      BEGIN
        CREATE TABLE IF NOT EXISTS nd_blog_posts (
  id INTEGER NOT NULL DEFAULT nextval('nd_blog_posts_id_seq'::regclass),
  title_en VARCHAR(255),
  title_ru VARCHAR(255),
  title_he VARCHAR(255),
  content_en TEXT,
  content_ru TEXT,
  content_he TEXT,
  author VARCHAR(255),
  featured_image VARCHAR(500),
  published_at TIMESTAMP WITHOUT TIME ZONE,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  PRIMARY KEY (id)
);

        -- Create sequences if needed
        CREATE SEQUENCE IF NOT EXISTS nd_blog_posts_id_seq;
      END $$;
    

-- ========================================
-- TABLE: nd_career_center_platform_page
-- ========================================

      DO $$
      BEGIN
        CREATE TABLE IF NOT EXISTS nd_career_center_platform_page (
  id INTEGER NOT NULL DEFAULT nextval('nd_career_center_platform_page_id_seq'::regclass),
  section_name VARCHAR(100) NOT NULL,
  content_en JSONB,
  content_ru JSONB,
  content_he JSONB,
  visible BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  PRIMARY KEY (id)
);

        -- Create sequences if needed
        CREATE SEQUENCE IF NOT EXISTS nd_career_center_platform_page_id_seq;
      END $$;
    

-- ========================================
-- TABLE: nd_contact_page
-- ========================================

      DO $$
      BEGIN
        CREATE TABLE IF NOT EXISTS nd_contact_page (
  id INTEGER NOT NULL DEFAULT nextval('nd_contact_page_id_seq'::regclass),
  section_name VARCHAR(100) NOT NULL,
  content_en JSONB,
  content_ru JSONB,
  content_he JSONB,
  visible BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  PRIMARY KEY (id)
);

        -- Create sequences if needed
        CREATE SEQUENCE IF NOT EXISTS nd_contact_page_id_seq;
      END $$;
    

-- ========================================
-- TABLE: nd_course_details_page
-- ========================================

      DO $$
      BEGIN
        CREATE TABLE IF NOT EXISTS nd_course_details_page (
  id INTEGER NOT NULL DEFAULT nextval('nd_course_details_page_id_seq'::regclass),
  section_key VARCHAR(100) NOT NULL,
  section_type VARCHAR(50),
  content_en JSONB,
  content_ru JSONB,
  content_he JSONB,
  visible BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  PRIMARY KEY (id)
);

        -- Create sequences if needed
        CREATE SEQUENCE IF NOT EXISTS nd_course_details_page_id_seq;
      END $$;
    

-- ========================================
-- TABLE: nd_courses
-- ========================================

      DO $$
      BEGIN
        CREATE TABLE IF NOT EXISTS nd_courses (
  id INTEGER NOT NULL DEFAULT nextval('nd_courses_id_seq'::regclass),
  course_key VARCHAR(100),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  short_description VARCHAR(500),
  price NUMERIC(10,2),
  old_price NUMERIC(10,2),
  currency VARCHAR(10),
  duration VARCHAR(100),
  level VARCHAR(50),
  category VARCHAR(100),
  instructor VARCHAR(255),
  language VARCHAR(50),
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
  features JSONB,
  syllabus JSONB,
  requirements JSONB,
  what_you_learn JSONB,
  title_ru VARCHAR(255),
  description_ru TEXT,
  short_description_ru VARCHAR(500),
  title_he VARCHAR(255),
  description_he TEXT,
  short_description_he VARCHAR(500),
  featured BOOLEAN DEFAULT false,
  visible BOOLEAN DEFAULT true,
  published BOOLEAN DEFAULT true,
  enrollment_open BOOLEAN DEFAULT true,
  meta_title VARCHAR(255),
  meta_description TEXT,
  meta_keywords TEXT,
  slug VARCHAR(255),
  order_index INTEGER DEFAULT 0,
  tags JSONB,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  title_en VARCHAR(255),
  description_en TEXT,
  instructor_bio TEXT,
  PRIMARY KEY (id)
);

        -- Create sequences if needed
        CREATE SEQUENCE IF NOT EXISTS nd_courses_id_seq;
      END $$;
    

-- ========================================
-- TABLE: nd_courses_page
-- ========================================

      DO $$
      BEGIN
        CREATE TABLE IF NOT EXISTS nd_courses_page (
  id INTEGER NOT NULL DEFAULT nextval('nd_courses_page_id_seq'::regclass),
  section_key VARCHAR(100) NOT NULL,
  section_type VARCHAR(50),
  content_en JSONB,
  content_ru JSONB,
  content_he JSONB,
  visible BOOLEAN DEFAULT true,
  animations_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  PRIMARY KEY (id)
);

        -- Create sequences if needed
        CREATE SEQUENCE IF NOT EXISTS nd_courses_page_id_seq;
      END $$;
    

-- ========================================
-- TABLE: nd_footer
-- ========================================

      DO $$
      BEGIN
        CREATE TABLE IF NOT EXISTS nd_footer (
  id INTEGER NOT NULL DEFAULT nextval('nd_footer_id_seq'::regclass),
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
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  placeholder_en TEXT,
  placeholder_ru TEXT,
  placeholder_he TEXT,
  button_text_en TEXT,
  button_text_ru TEXT,
  button_text_he TEXT,
  PRIMARY KEY (id)
);

        -- Create sequences if needed
        CREATE SEQUENCE IF NOT EXISTS nd_footer_id_seq;
      END $$;
    

-- ========================================
-- TABLE: nd_home
-- ========================================

      DO $$
      BEGIN
        CREATE TABLE IF NOT EXISTS nd_home (
  id INTEGER NOT NULL DEFAULT nextval('nd_home_id_seq'::regclass),
  section_key VARCHAR(100) NOT NULL,
  section_type VARCHAR(50),
  visible BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  content_en JSONB,
  content_ru JSONB,
  content_he JSONB,
  animations_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  about_en JSONB,
  about_ru JSONB,
  about_he JSONB,
  pricing_en JSONB,
  pricing_ru JSONB,
  pricing_he JSONB,
  faq_en JSONB,
  faq_ru JSONB,
  faq_he JSONB,
  footer_en JSONB,
  footer_ru JSONB,
  footer_he JSONB,
  PRIMARY KEY (id)
);

        -- Create sequences if needed
        CREATE SEQUENCE IF NOT EXISTS nd_home_id_seq;
      END $$;
    

-- ========================================
-- TABLE: nd_home_page
-- ========================================

      DO $$
      BEGIN
        CREATE TABLE IF NOT EXISTS nd_home_page (
  id INTEGER NOT NULL DEFAULT nextval('nd_home_page_id_seq'::regclass),
  section_name VARCHAR(100) NOT NULL,
  content_en JSONB,
  content_ru JSONB,
  content_he JSONB,
  visible BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  PRIMARY KEY (id)
);

        -- Create sequences if needed
        CREATE SEQUENCE IF NOT EXISTS nd_home_page_id_seq;
      END $$;
    

-- ========================================
-- TABLE: nd_menu
-- ========================================

      DO $$
      BEGIN
        CREATE TABLE IF NOT EXISTS nd_menu (
  id INTEGER NOT NULL DEFAULT nextval('nd_menu_id_seq'::regclass),
  parent_id INTEGER,
  order_index INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  label_en VARCHAR(200),
  label_ru VARCHAR(200),
  label_he VARCHAR(200),
  url VARCHAR(500),
  icon_class VARCHAR(100),
  target VARCHAR(20),
  is_dropdown BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

        -- Create sequences if needed
        CREATE SEQUENCE IF NOT EXISTS nd_menu_id_seq;
      END $$;
    

-- ========================================
-- TABLE: nd_pricing_page
-- ========================================

      DO $$
      BEGIN
        CREATE TABLE IF NOT EXISTS nd_pricing_page (
  id INTEGER NOT NULL DEFAULT nextval('nd_pricing_page_id_seq'::regclass),
  section_name VARCHAR(100) NOT NULL,
  content_en JSONB,
  content_ru JSONB,
  content_he JSONB,
  visible BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  PRIMARY KEY (id)
);

        -- Create sequences if needed
        CREATE SEQUENCE IF NOT EXISTS nd_pricing_page_id_seq;
      END $$;
    

-- ========================================
-- TABLE: nd_teachers_page
-- ========================================

      DO $$
      BEGIN
        CREATE TABLE IF NOT EXISTS nd_teachers_page (
  id INTEGER NOT NULL DEFAULT nextval('nd_teachers_page_id_seq'::regclass),
  section_name VARCHAR(100) NOT NULL,
  content_en JSONB,
  content_ru JSONB,
  content_he JSONB,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  PRIMARY KEY (id)
);

        -- Create sequences if needed
        CREATE SEQUENCE IF NOT EXISTS nd_teachers_page_id_seq;
      END $$;
    

-- ========================================
-- TABLE: nd_ui_translations
-- ========================================

      DO $$
      BEGIN
        CREATE TABLE IF NOT EXISTS nd_ui_translations (
  id INTEGER NOT NULL DEFAULT nextval('nd_ui_translations_id_seq'::regclass),
  page VARCHAR(100),
  element_key VARCHAR(255),
  text_en TEXT,
  text_ru TEXT,
  text_he TEXT,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
  PRIMARY KEY (id)
);

        -- Create sequences if needed
        CREATE SEQUENCE IF NOT EXISTS nd_ui_translations_id_seq;
      END $$;
    

-- ========================================
-- TABLE: pricing_plans
-- ========================================

      DO $$
      BEGIN
        CREATE TABLE IF NOT EXISTS pricing_plans (
  id INTEGER NOT NULL DEFAULT nextval('pricing_plans_id_seq'::regclass),
  name TEXT,
  price NUMERIC(10,2),
  currency TEXT,
  period TEXT,
  features TEXT,
  is_popular BOOLEAN DEFAULT false,
  locale VARCHAR(10),
  published_at TIMESTAMP WITHOUT TIME ZONE,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

        -- Create sequences if needed
        CREATE SEQUENCE IF NOT EXISTS pricing_plans_id_seq;
      END $$;
    

-- ========================================
-- TABLE: site_settings
-- ========================================

      DO $$
      BEGIN
        CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER NOT NULL DEFAULT nextval('site_settings_id_seq'::regclass),
  locale VARCHAR(5),
  site_name VARCHAR(255),
  site_tagline VARCHAR(500),
  logo_url VARCHAR(500),
  footer_email VARCHAR(255),
  footer_phone VARCHAR(50),
  footer_address TEXT,
  footer_copyright TEXT,
  facebook_url VARCHAR(500),
  twitter_url VARCHAR(500),
  instagram_url VARCHAR(500),
  linkedin_url VARCHAR(500),
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

        -- Create sequences if needed
        CREATE SEQUENCE IF NOT EXISTS site_settings_id_seq;
      END $$;
    

-- ========================================
-- TABLE: statistics
-- ========================================

      DO $$
      BEGIN
        CREATE TABLE IF NOT EXISTS statistics (
  id INTEGER NOT NULL DEFAULT nextval('statistics_id_seq'::regclass),
  locale VARCHAR(5),
  courses_count VARCHAR(50),
  courses_label VARCHAR(100),
  learners_count VARCHAR(50),
  learners_label VARCHAR(100),
  years_count VARCHAR(50),
  years_label VARCHAR(100),
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

        -- Create sequences if needed
        CREATE SEQUENCE IF NOT EXISTS statistics_id_seq;
      END $$;
    

-- ========================================
-- TABLE: teachers
-- ========================================

      DO $$
      BEGIN
        CREATE TABLE IF NOT EXISTS teachers (
  id INTEGER NOT NULL DEFAULT nextval('teachers_id_seq'::regclass),
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
  locale VARCHAR(10),
  display_order INTEGER DEFAULT 0,
  published_at TIMESTAMP WITHOUT TIME ZONE,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  category VARCHAR(50),
  experience VARCHAR(100),
  specialties TEXT,
  company VARCHAR(200),
  linkedin_url VARCHAR(500),
  twitter_url VARCHAR(500),
  github_url VARCHAR(500),
  PRIMARY KEY (id)
);

        -- Create sequences if needed
        CREATE SEQUENCE IF NOT EXISTS teachers_id_seq;
      END $$;
    
