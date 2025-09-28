--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (Homebrew)
-- Dumped by pg_dump version 16.9 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: about_pages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.about_pages (
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


--
-- Name: about_pages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.about_pages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: about_pages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.about_pages_id_seq OWNED BY public.about_pages.id;


--
-- Name: blog_posts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blog_posts (
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


--
-- Name: blog_posts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.blog_posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: blog_posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.blog_posts_id_seq OWNED BY public.blog_posts.id;


--
-- Name: button_texts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.button_texts (
    id integer NOT NULL,
    locale character varying(5) DEFAULT 'en'::character varying,
    get_started character varying(100) DEFAULT 'Get Started'::character varying,
    explore_courses character varying(100) DEFAULT 'Explore Courses'::character varying,
    learn_more character varying(100) DEFAULT 'Learn More'::character varying,
    enroll_now character varying(100) DEFAULT 'Enroll Now'::character varying,
    contact_us character varying(100) DEFAULT 'Contact Us'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: button_texts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.button_texts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: button_texts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.button_texts_id_seq OWNED BY public.button_texts.id;


--
-- Name: career_center_pages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.career_center_pages (
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


--
-- Name: career_center_pages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.career_center_pages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: career_center_pages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.career_center_pages_id_seq OWNED BY public.career_center_pages.id;


--
-- Name: career_orientation_pages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.career_orientation_pages (
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
    solution1_feature3 text,
    solution1_feature4 text,
    solution1_benefit text,
    solutions_visible boolean DEFAULT true,
    process_main_title text,
    process_subtitle text,
    process_title text,
    process_step1_title text,
    process_step1_description text,
    process_step1_duration text,
    process_step2_title text,
    process_step2_description text,
    process_step2_duration text,
    process_step3_title text,
    process_step3_description text,
    process_step3_duration text,
    process_visible boolean DEFAULT true,
    career_paths_main_title text,
    career_paths_subtitle text,
    career_path1_title text,
    career_path1_description text,
    career_path1_salary_range text,
    career_path1_growth_rate text,
    career_path1_top_skills text,
    career_paths_visible boolean DEFAULT true,
    expert_name text,
    expert_title text,
    expert_credentials text,
    expert_background text,
    expert_description text,
    expert_quote text,
    expert_linkedin text,
    expert_twitter text,
    expert_visible boolean DEFAULT true,
    partners_main_title text,
    partners_subtitle text,
    partners_title text,
    partner1_name text,
    partner1_description text,
    partner2_name text,
    partner2_description text,
    partner3_name text,
    partner3_description text,
    partners_visible boolean DEFAULT true,
    assessment_main_title text,
    assessment_subtitle text,
    assessment_description text,
    assessment_visible boolean DEFAULT true,
    cta_main_title text,
    cta_subtitle text,
    cta_description text,
    cta_button_text text,
    cta_button_link text,
    cta_visible boolean DEFAULT true,
    challenges_title text,
    challenge1_title text,
    challenge1_description text,
    challenge2_title text,
    challenge2_description text,
    challenge3_title text,
    challenge3_description text,
    challenge4_title text,
    challenge4_description text,
    solution2_icon text,
    solution2_title text,
    solution2_description text,
    process_step4_title text,
    process_step4_description text,
    process_step4_duration text,
    process_step5_title text,
    process_step5_description text,
    process_step5_duration text,
    career_path2_title text,
    career_path2_description text,
    career_path2_salary_range text,
    career_path2_growth_rate text,
    career_path3_title text,
    career_path3_description text,
    expert_achievements text,
    assessment_questions json,
    resources_main_title text,
    resources_subtitle text,
    resources json,
    resources_visible boolean DEFAULT true,
    success_stories_main_title text,
    success_stories_subtitle text,
    success_stories json,
    success_stories_visible boolean DEFAULT true,
    meta_title text,
    meta_description text,
    meta_keywords text,
    og_title text,
    og_description text,
    og_image text,
    subtitle text,
    solutions_description text,
    outcomes_main_title text,
    outcomes_subtitle text,
    outcomes_description text,
    outcome1_text text,
    outcome2_text text,
    outcome3_text text,
    outcome4_text text,
    expert_stat1_number text,
    expert_stat1_label text,
    expert_stat2_number text,
    expert_stat2_label text,
    cta_privacy_text text
);


--
-- Name: career_orientation_pages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.career_orientation_pages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: career_orientation_pages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.career_orientation_pages_id_seq OWNED BY public.career_orientation_pages.id;


--
-- Name: career_resources; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.career_resources (
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


--
-- Name: career_resources_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.career_resources_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: career_resources_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.career_resources_id_seq OWNED BY public.career_resources.id;


--
-- Name: company_logos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.company_logos (
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


--
-- Name: company_logos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.company_logos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: company_logos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.company_logos_id_seq OWNED BY public.company_logos.id;


--
-- Name: consultation_services; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.consultation_services (
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


--
-- Name: consultation_services_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.consultation_services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: consultation_services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.consultation_services_id_seq OWNED BY public.consultation_services.id;


--
-- Name: consultations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.consultations (
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


--
-- Name: consultations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.consultations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: consultations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.consultations_id_seq OWNED BY public.consultations.id;


--
-- Name: contact_pages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.contact_pages (
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


--
-- Name: contact_pages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.contact_pages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: contact_pages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.contact_pages_id_seq OWNED BY public.contact_pages.id;


--
-- Name: courses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.courses (
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


--
-- Name: courses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.courses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: courses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.courses_id_seq OWNED BY public.courses.id;


--
-- Name: entity_teachers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.entity_teachers (
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


--
-- Name: entity_teachers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.entity_teachers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: entity_teachers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.entity_teachers_id_seq OWNED BY public.entity_teachers.id;


--
-- Name: faqs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.faqs (
    id integer NOT NULL,
    locale character varying(5) DEFAULT 'en'::character varying,
    question text,
    answer text,
    category character varying(100),
    "order" integer,
    published_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: faqs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.faqs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: faqs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.faqs_id_seq OWNED BY public.faqs.id;


--
-- Name: footer_content; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.footer_content (
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


--
-- Name: footer_content_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.footer_content_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: footer_content_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.footer_content_id_seq OWNED BY public.footer_content.id;


--
-- Name: home_pages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.home_pages (
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
    course_5_duration character varying(50),
    course_5_category character varying(100),
    course_5_description text,
    course_5_visible boolean DEFAULT true,
    course_6_title character varying(255),
    course_6_rating character varying(10),
    course_6_lessons character varying(50),
    course_6_duration character varying(50),
    course_6_category character varying(100),
    course_6_description text,
    course_6_visible boolean DEFAULT true,
    testimonial_1_text text,
    testimonial_1_author character varying(255),
    testimonial_1_rating character varying(10),
    testimonial_1_visible boolean DEFAULT true,
    testimonial_2_text text,
    testimonial_2_author character varying(255),
    testimonial_2_rating character varying(10),
    testimonial_2_visible boolean DEFAULT true,
    testimonial_3_text text,
    testimonial_3_author character varying(255),
    testimonial_3_rating character varying(10),
    testimonial_3_visible boolean DEFAULT true,
    testimonial_4_text text,
    testimonial_4_author character varying(255),
    testimonial_4_rating character varying(10),
    testimonial_4_visible boolean DEFAULT true,
    published_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    locale character varying(5) DEFAULT 'en'::character varying,
    practice_description text,
    feature_1_title character varying(255),
    feature_1_description text,
    feature_2_title character varying(255),
    feature_2_description text,
    feature_3_title character varying(255),
    feature_3_description text,
    feature_4_title character varying(255),
    feature_4_description text,
    feature_5_title character varying(255),
    feature_5_description text,
    feature_6_title character varying(255),
    feature_6_description text
);


--
-- Name: home_pages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.home_pages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: home_pages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.home_pages_id_seq OWNED BY public.home_pages.id;


--
-- Name: job_postings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.job_postings (
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


--
-- Name: job_postings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.job_postings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: job_postings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.job_postings_id_seq OWNED BY public.job_postings.id;


--
-- Name: navigation_menus; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.navigation_menus (
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


--
-- Name: navigation_menus_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.navigation_menus_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: navigation_menus_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.navigation_menus_id_seq OWNED BY public.navigation_menus.id;


--
-- Name: nd_about_page; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.nd_about_page (
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


--
-- Name: nd_about_page_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.nd_about_page_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: nd_about_page_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.nd_about_page_id_seq OWNED BY public.nd_about_page.id;


--
-- Name: nd_blog_page; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.nd_blog_page (
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


--
-- Name: nd_blog_page_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.nd_blog_page_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: nd_blog_page_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.nd_blog_page_id_seq OWNED BY public.nd_blog_page.id;


--
-- Name: nd_blog_posts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.nd_blog_posts (
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


--
-- Name: nd_blog_posts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.nd_blog_posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: nd_blog_posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.nd_blog_posts_id_seq OWNED BY public.nd_blog_posts.id;


--
-- Name: nd_career_center_platform_page; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.nd_career_center_platform_page (
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


--
-- Name: nd_career_center_platform_page_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.nd_career_center_platform_page_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: nd_career_center_platform_page_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.nd_career_center_platform_page_id_seq OWNED BY public.nd_career_center_platform_page.id;


--
-- Name: nd_contact_page; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.nd_contact_page (
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


--
-- Name: nd_contact_page_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.nd_contact_page_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: nd_contact_page_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.nd_contact_page_id_seq OWNED BY public.nd_contact_page.id;


--
-- Name: nd_course_details_page; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.nd_course_details_page (
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


--
-- Name: TABLE nd_course_details_page; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.nd_course_details_page IS 'Stores UI translations for the Course Details page - actual course content comes from nd_courses table';


--
-- Name: nd_course_details_page_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.nd_course_details_page_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: nd_course_details_page_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.nd_course_details_page_id_seq OWNED BY public.nd_course_details_page.id;


--
-- Name: nd_courses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.nd_courses (
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
    description_en text,
    instructor_bio text
);


--
-- Name: nd_courses_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.nd_courses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: nd_courses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.nd_courses_id_seq OWNED BY public.nd_courses.id;


--
-- Name: nd_courses_page; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.nd_courses_page (
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


--
-- Name: nd_courses_page_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.nd_courses_page_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: nd_courses_page_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.nd_courses_page_id_seq OWNED BY public.nd_courses_page.id;


--
-- Name: nd_footer; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.nd_footer (
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


--
-- Name: nd_footer_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.nd_footer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: nd_footer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.nd_footer_id_seq OWNED BY public.nd_footer.id;


--
-- Name: nd_home; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.nd_home (
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


--
-- Name: nd_home_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.nd_home_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: nd_home_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.nd_home_id_seq OWNED BY public.nd_home.id;


--
-- Name: nd_home_page; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.nd_home_page (
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


--
-- Name: nd_home_page_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.nd_home_page_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: nd_home_page_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.nd_home_page_id_seq OWNED BY public.nd_home_page.id;


--
-- Name: nd_menu; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.nd_menu (
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


--
-- Name: nd_menu_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.nd_menu_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: nd_menu_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.nd_menu_id_seq OWNED BY public.nd_menu.id;


--
-- Name: nd_pricing_page; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.nd_pricing_page (
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


--
-- Name: nd_pricing_page_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.nd_pricing_page_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: nd_pricing_page_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.nd_pricing_page_id_seq OWNED BY public.nd_pricing_page.id;


--
-- Name: nd_teachers_page; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.nd_teachers_page (
    id integer NOT NULL,
    section_name character varying(100) NOT NULL,
    content_en jsonb DEFAULT '{}'::jsonb,
    content_ru jsonb DEFAULT '{}'::jsonb,
    content_he jsonb DEFAULT '{}'::jsonb,
    visible boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: nd_teachers_page_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.nd_teachers_page_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: nd_teachers_page_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.nd_teachers_page_id_seq OWNED BY public.nd_teachers_page.id;


--
-- Name: nd_ui_translations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.nd_ui_translations (
    id integer NOT NULL,
    page character varying(100),
    element_key character varying(255),
    text_en text,
    text_ru text,
    text_he text,
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: nd_ui_translations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.nd_ui_translations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: nd_ui_translations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.nd_ui_translations_id_seq OWNED BY public.nd_ui_translations.id;


--
-- Name: pricing_plans; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pricing_plans (
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


--
-- Name: pricing_plans_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.pricing_plans_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pricing_plans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pricing_plans_id_seq OWNED BY public.pricing_plans.id;


--
-- Name: site_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.site_settings (
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


--
-- Name: site_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.site_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: site_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.site_settings_id_seq OWNED BY public.site_settings.id;


--
-- Name: statistics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.statistics (
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


--
-- Name: statistics_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.statistics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: statistics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.statistics_id_seq OWNED BY public.statistics.id;


--
-- Name: teachers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.teachers (
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


--
-- Name: teachers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.teachers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: teachers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.teachers_id_seq OWNED BY public.teachers.id;


--
-- Name: about_pages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.about_pages ALTER COLUMN id SET DEFAULT nextval('public.about_pages_id_seq'::regclass);


--
-- Name: blog_posts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_posts ALTER COLUMN id SET DEFAULT nextval('public.blog_posts_id_seq'::regclass);


--
-- Name: button_texts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.button_texts ALTER COLUMN id SET DEFAULT nextval('public.button_texts_id_seq'::regclass);


--
-- Name: career_center_pages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_center_pages ALTER COLUMN id SET DEFAULT nextval('public.career_center_pages_id_seq'::regclass);


--
-- Name: career_orientation_pages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_orientation_pages ALTER COLUMN id SET DEFAULT nextval('public.career_orientation_pages_id_seq'::regclass);


--
-- Name: career_resources id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_resources ALTER COLUMN id SET DEFAULT nextval('public.career_resources_id_seq'::regclass);


--
-- Name: company_logos id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.company_logos ALTER COLUMN id SET DEFAULT nextval('public.company_logos_id_seq'::regclass);


--
-- Name: consultation_services id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.consultation_services ALTER COLUMN id SET DEFAULT nextval('public.consultation_services_id_seq'::regclass);


--
-- Name: consultations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.consultations ALTER COLUMN id SET DEFAULT nextval('public.consultations_id_seq'::regclass);


--
-- Name: contact_pages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_pages ALTER COLUMN id SET DEFAULT nextval('public.contact_pages_id_seq'::regclass);


--
-- Name: courses id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courses ALTER COLUMN id SET DEFAULT nextval('public.courses_id_seq'::regclass);


--
-- Name: entity_teachers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entity_teachers ALTER COLUMN id SET DEFAULT nextval('public.entity_teachers_id_seq'::regclass);


--
-- Name: faqs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faqs ALTER COLUMN id SET DEFAULT nextval('public.faqs_id_seq'::regclass);


--
-- Name: footer_content id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.footer_content ALTER COLUMN id SET DEFAULT nextval('public.footer_content_id_seq'::regclass);


--
-- Name: home_pages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.home_pages ALTER COLUMN id SET DEFAULT nextval('public.home_pages_id_seq'::regclass);


--
-- Name: job_postings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_postings ALTER COLUMN id SET DEFAULT nextval('public.job_postings_id_seq'::regclass);


--
-- Name: navigation_menus id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.navigation_menus ALTER COLUMN id SET DEFAULT nextval('public.navigation_menus_id_seq'::regclass);


--
-- Name: nd_about_page id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nd_about_page ALTER COLUMN id SET DEFAULT nextval('public.nd_about_page_id_seq'::regclass);


--
-- Name: nd_blog_page id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nd_blog_page ALTER COLUMN id SET DEFAULT nextval('public.nd_blog_page_id_seq'::regclass);


--
-- Name: nd_blog_posts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nd_blog_posts ALTER COLUMN id SET DEFAULT nextval('public.nd_blog_posts_id_seq'::regclass);


--
-- Name: nd_career_center_platform_page id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nd_career_center_platform_page ALTER COLUMN id SET DEFAULT nextval('public.nd_career_center_platform_page_id_seq'::regclass);


--
-- Name: nd_contact_page id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nd_contact_page ALTER COLUMN id SET DEFAULT nextval('public.nd_contact_page_id_seq'::regclass);


--
-- Name: nd_course_details_page id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nd_course_details_page ALTER COLUMN id SET DEFAULT nextval('public.nd_course_details_page_id_seq'::regclass);


--
-- Name: nd_courses id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nd_courses ALTER COLUMN id SET DEFAULT nextval('public.nd_courses_id_seq'::regclass);


--
-- Name: nd_courses_page id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nd_courses_page ALTER COLUMN id SET DEFAULT nextval('public.nd_courses_page_id_seq'::regclass);


--
-- Name: nd_footer id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nd_footer ALTER COLUMN id SET DEFAULT nextval('public.nd_footer_id_seq'::regclass);


--
-- Name: nd_home id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nd_home ALTER COLUMN id SET DEFAULT nextval('public.nd_home_id_seq'::regclass);


--
-- Name: nd_home_page id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nd_home_page ALTER COLUMN id SET DEFAULT nextval('public.nd_home_page_id_seq'::regclass);


--
-- Name: nd_menu id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nd_menu ALTER COLUMN id SET DEFAULT nextval('public.nd_menu_id_seq'::regclass);


--
-- Name: nd_pricing_page id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nd_pricing_page ALTER COLUMN id SET DEFAULT nextval('public.nd_pricing_page_id_seq'::regclass);


--
-- Name: nd_teachers_page id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nd_teachers_page ALTER COLUMN id SET DEFAULT nextval('public.nd_teachers_page_id_seq'::regclass);


--
-- Name: nd_ui_translations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nd_ui_translations ALTER COLUMN id SET DEFAULT nextval('public.nd_ui_translations_id_seq'::regclass);


--
-- Name: pricing_plans id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pricing_plans ALTER COLUMN id SET DEFAULT nextval('public.pricing_plans_id_seq'::regclass);


--
-- Name: site_settings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_settings ALTER COLUMN id SET DEFAULT nextval('public.site_settings_id_seq'::regclass);


--
-- Name: statistics id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.statistics ALTER COLUMN id SET DEFAULT nextval('public.statistics_id_seq'::regclass);


--
-- Name: teachers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teachers ALTER COLUMN id SET DEFAULT nextval('public.teachers_id_seq'::regclass);


--
-- Name: about_pages about_pages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.about_pages
    ADD CONSTRAINT about_pages_pkey PRIMARY KEY (id);


--
-- Name: blog_posts blog_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_pkey PRIMARY KEY (id);


--
-- Name: button_texts button_texts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.button_texts
    ADD CONSTRAINT button_texts_pkey PRIMARY KEY (id);


--
-- Name: career_center_pages career_center_pages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_center_pages
    ADD CONSTRAINT career_center_pages_pkey PRIMARY KEY (id);


--
-- Name: career_orientation_pages career_orientation_pages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_orientation_pages
    ADD CONSTRAINT career_orientation_pages_pkey PRIMARY KEY (id);


--
-- Name: career_resources career_resources_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.career_resources
    ADD CONSTRAINT career_resources_pkey PRIMARY KEY (id);


--
-- Name: company_logos company_logos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.company_logos
    ADD CONSTRAINT company_logos_pkey PRIMARY KEY (id);


--
-- Name: consultation_services consultation_services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.consultation_services
    ADD CONSTRAINT consultation_services_pkey PRIMARY KEY (id);


--
-- Name: consultations consultations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.consultations
    ADD CONSTRAINT consultations_pkey PRIMARY KEY (id);


--
-- Name: contact_pages contact_pages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.contact_pages
    ADD CONSTRAINT contact_pages_pkey PRIMARY KEY (id);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: entity_teachers entity_teachers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entity_teachers
    ADD CONSTRAINT entity_teachers_pkey PRIMARY KEY (id);


--
-- Name: entity_teachers entity_teachers_teacher_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entity_teachers
    ADD CONSTRAINT entity_teachers_teacher_key_key UNIQUE (teacher_key);


--
-- Name: faqs faqs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.faqs
    ADD CONSTRAINT faqs_pkey PRIMARY KEY (id);


--
-- Name: footer_content footer_content_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.footer_content
    ADD CONSTRAINT footer_content_pkey PRIMARY KEY (id);


--
-- Name: home_pages home_pages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.home_pages
    ADD CONSTRAINT home_pages_pkey PRIMARY KEY (id);


--
-- Name: job_postings job_postings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.job_postings
    ADD CONSTRAINT job_postings_pkey PRIMARY KEY (id);


--
-- Name: navigation_menus navigation_menus_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.navigation_menus
    ADD CONSTRAINT navigation_menus_pkey PRIMARY KEY (id);


--
-- Name: nd_about_page nd_about_page_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nd_about_page
    ADD CONSTRAINT nd_about_page_pkey PRIMARY KEY (id);


--
-- Name: nd_about_page nd_about_page_section_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nd_about_page
    ADD CONSTRAINT nd_about_page_section_name_key UNIQUE (section_name);


--
-- Name: nd_blog_page nd_blog_page_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nd_blog_page
    ADD CONSTRAINT nd_blog_page_pkey PRIMARY KEY (id);


--
-- Name: nd_blog_page nd_blog_page_section_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nd_blog_page
    ADD CONSTRAINT nd_blog_page_section_name_key UNIQUE (section_name);


--
-- Name: nd_blog_posts nd_blog_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nd_blog_posts
    ADD CONSTRAINT nd_blog_posts_pkey PRIMARY KEY (id);


--
-- Name: nd_career_center_platform_page nd_career_center_platform_page_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nd_career_center_platform_page
    ADD CONSTRAINT nd_career_center_platform_page_pkey PRIMARY KEY (id);


--
-- Name: nd_career_center_platform_page nd_career_center_platform_page_section_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nd_career_center_platform_page
    ADD CONSTRAINT nd_career_center_platform_page_section_name_key UNIQUE (section_name);


--
-- Name: nd_contact_page nd_contact_page_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nd_contact_page
    ADD CONSTRAINT nd_contact_page_pkey PRIMARY KEY (id);


--
-- Name: nd_contact_page nd_contact_page_section_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nd_contact_page
    ADD CONSTRAINT nd_contact_page_section_name_key UNIQUE (section_name);


--
-- Name: nd_course_details_page nd_course_details_page_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nd_course_details_page
    ADD CONSTRAINT nd_course_details_page_pkey PRIMARY KEY (id);


--
-- Name: nd_course_details_page nd_course_details_page_section_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nd_course_details_page
    ADD CONSTRAINT nd_course_details_page_section_key_key UNIQUE (section_key);


--
-- Name: nd_courses nd_courses_course_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nd_courses
    ADD CONSTRAINT nd_courses_course_key_key UNIQUE (course_key);


--
-- Name: nd_courses_page nd_courses_page_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nd_courses_page
    ADD CONSTRAINT nd_courses_page_pkey PRIMARY KEY (id);


--
-- Name: nd_courses_page nd_courses_page_section_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nd_courses_page
    ADD CONSTRAINT nd_courses_page_section_key_key UNIQUE (section_key);


--
-- Name: nd_courses nd_courses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nd_courses
    ADD CONSTRAINT nd_courses_pkey PRIMARY KEY (id);


--
-- Name: nd_footer nd_footer_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nd_footer
    ADD CONSTRAINT nd_footer_pkey PRIMARY KEY (id);


--
-- Name: nd_home_page nd_home_page_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nd_home_page
    ADD CONSTRAINT nd_home_page_pkey PRIMARY KEY (id);


--
-- Name: nd_home_page nd_home_page_section_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nd_home_page
    ADD CONSTRAINT nd_home_page_section_name_key UNIQUE (section_name);


--
-- Name: nd_home nd_home_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nd_home
    ADD CONSTRAINT nd_home_pkey PRIMARY KEY (id);


--
-- Name: nd_home nd_home_section_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nd_home
    ADD CONSTRAINT nd_home_section_key_key UNIQUE (section_key);


--
-- Name: nd_menu nd_menu_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nd_menu
    ADD CONSTRAINT nd_menu_pkey PRIMARY KEY (id);


--
-- Name: nd_pricing_page nd_pricing_page_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nd_pricing_page
    ADD CONSTRAINT nd_pricing_page_pkey PRIMARY KEY (id);


--
-- Name: nd_pricing_page nd_pricing_page_section_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nd_pricing_page
    ADD CONSTRAINT nd_pricing_page_section_name_key UNIQUE (section_name);


--
-- Name: nd_teachers_page nd_teachers_page_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nd_teachers_page
    ADD CONSTRAINT nd_teachers_page_pkey PRIMARY KEY (id);


--
-- Name: nd_teachers_page nd_teachers_page_section_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nd_teachers_page
    ADD CONSTRAINT nd_teachers_page_section_name_key UNIQUE (section_name);


--
-- Name: nd_ui_translations nd_ui_translations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nd_ui_translations
    ADD CONSTRAINT nd_ui_translations_pkey PRIMARY KEY (id);


--
-- Name: pricing_plans pricing_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pricing_plans
    ADD CONSTRAINT pricing_plans_pkey PRIMARY KEY (id);


--
-- Name: site_settings site_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_settings
    ADD CONSTRAINT site_settings_pkey PRIMARY KEY (id);


--
-- Name: statistics statistics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.statistics
    ADD CONSTRAINT statistics_pkey PRIMARY KEY (id);


--
-- Name: teachers teachers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_pkey PRIMARY KEY (id);


--
-- Name: idx_blog_posts_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_blog_posts_category ON public.blog_posts USING btree (category);


--
-- Name: idx_blog_posts_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_blog_posts_created_at ON public.blog_posts USING btree (created_at DESC);


--
-- Name: idx_blog_posts_featured; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_blog_posts_featured ON public.blog_posts USING btree (is_featured, is_visible);


--
-- Name: idx_blog_posts_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_blog_posts_id ON public.blog_posts USING btree (id);


--
-- Name: idx_blog_posts_locale_published; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_blog_posts_locale_published ON public.blog_posts USING btree (locale, is_published);


--
-- Name: idx_consultations_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_consultations_created_at ON public.consultations USING btree (created_at);


--
-- Name: idx_consultations_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_consultations_email ON public.consultations USING btree (email);


--
-- Name: idx_consultations_interest; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_consultations_interest ON public.consultations USING btree (interest);


--
-- Name: idx_nd_about_page_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_nd_about_page_order ON public.nd_about_page USING btree (display_order);


--
-- Name: idx_nd_about_page_visible; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_nd_about_page_visible ON public.nd_about_page USING btree (visible);


--
-- Name: idx_nd_blog_page_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_nd_blog_page_order ON public.nd_blog_page USING btree (display_order);


--
-- Name: idx_nd_blog_page_visible; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_nd_blog_page_visible ON public.nd_blog_page USING btree (visible);


--
-- Name: idx_nd_career_center_platform_page_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_nd_career_center_platform_page_order ON public.nd_career_center_platform_page USING btree (display_order);


--
-- Name: idx_nd_career_center_platform_page_visible; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_nd_career_center_platform_page_visible ON public.nd_career_center_platform_page USING btree (visible);


--
-- Name: idx_nd_contact_page_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_nd_contact_page_order ON public.nd_contact_page USING btree (display_order);


--
-- Name: idx_nd_contact_page_visible; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_nd_contact_page_visible ON public.nd_contact_page USING btree (visible);


--
-- Name: idx_nd_course_details_page_section_key; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_nd_course_details_page_section_key ON public.nd_course_details_page USING btree (section_key);


--
-- Name: idx_nd_course_details_page_visible; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_nd_course_details_page_visible ON public.nd_course_details_page USING btree (visible);


--
-- Name: idx_nd_courses_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_nd_courses_category ON public.nd_courses USING btree (category);


--
-- Name: idx_nd_courses_featured; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_nd_courses_featured ON public.nd_courses USING btree (featured);


--
-- Name: idx_nd_courses_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_nd_courses_order ON public.nd_courses USING btree (order_index);


--
-- Name: idx_nd_courses_published; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_nd_courses_published ON public.nd_courses USING btree (published_at);


--
-- Name: idx_nd_courses_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_nd_courses_slug ON public.nd_courses USING btree (slug);


--
-- Name: idx_nd_courses_visible; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_nd_courses_visible ON public.nd_courses USING btree (visible);


--
-- Name: idx_nd_home_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_nd_home_order ON public.nd_home USING btree (order_index);


--
-- Name: idx_nd_home_page_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_nd_home_page_order ON public.nd_home_page USING btree (display_order);


--
-- Name: idx_nd_home_page_visible; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_nd_home_page_visible ON public.nd_home_page USING btree (visible);


--
-- Name: idx_nd_home_visible; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_nd_home_visible ON public.nd_home USING btree (visible);


--
-- Name: idx_nd_pricing_page_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_nd_pricing_page_order ON public.nd_pricing_page USING btree (display_order);


--
-- Name: idx_nd_pricing_page_visible; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_nd_pricing_page_visible ON public.nd_pricing_page USING btree (visible);


--
-- Name: idx_teachers_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_teachers_category ON public.teachers USING btree (category);


--
-- Name: idx_teachers_display_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_teachers_display_order ON public.teachers USING btree (display_order);


--
-- Name: nd_course_details_page update_nd_course_details_page_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_nd_course_details_page_updated_at BEFORE UPDATE ON public.nd_course_details_page FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: nd_menu nd_menu_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nd_menu
    ADD CONSTRAINT nd_menu_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.nd_menu(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

