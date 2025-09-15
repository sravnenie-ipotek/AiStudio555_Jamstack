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
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
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
    cta_visible boolean DEFAULT true
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
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
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
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
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
-- PostgreSQL database dump complete
--

