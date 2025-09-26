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
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: about_pages; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.about_pages OWNER TO postgres;

--
-- Name: about_pages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.about_pages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.about_pages_id_seq OWNER TO postgres;

--
-- Name: about_pages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.about_pages_id_seq OWNED BY public.about_pages.id;


--
-- Name: blog_posts; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.blog_posts OWNER TO postgres;

--
-- Name: blog_posts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.blog_posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.blog_posts_id_seq OWNER TO postgres;

--
-- Name: blog_posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.blog_posts_id_seq OWNED BY public.blog_posts.id;


--
-- Name: button_texts; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.button_texts OWNER TO postgres;

--
-- Name: button_texts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.button_texts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.button_texts_id_seq OWNER TO postgres;

--
-- Name: button_texts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.button_texts_id_seq OWNED BY public.button_texts.id;


--
-- Name: career_center_pages; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.career_center_pages OWNER TO postgres;

--
-- Name: career_center_pages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.career_center_pages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.career_center_pages_id_seq OWNER TO postgres;

--
-- Name: career_center_pages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.career_center_pages_id_seq OWNED BY public.career_center_pages.id;


--
-- Name: career_orientation_pages; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.career_orientation_pages OWNER TO postgres;

--
-- Name: career_orientation_pages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.career_orientation_pages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.career_orientation_pages_id_seq OWNER TO postgres;

--
-- Name: career_orientation_pages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.career_orientation_pages_id_seq OWNED BY public.career_orientation_pages.id;


--
-- Name: career_resources; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.career_resources OWNER TO postgres;

--
-- Name: career_resources_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.career_resources_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.career_resources_id_seq OWNER TO postgres;

--
-- Name: career_resources_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.career_resources_id_seq OWNED BY public.career_resources.id;


--
-- Name: company_logos; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.company_logos OWNER TO postgres;

--
-- Name: company_logos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.company_logos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.company_logos_id_seq OWNER TO postgres;

--
-- Name: company_logos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.company_logos_id_seq OWNED BY public.company_logos.id;


--
-- Name: consultation_services; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.consultation_services OWNER TO postgres;

--
-- Name: consultation_services_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.consultation_services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.consultation_services_id_seq OWNER TO postgres;

--
-- Name: consultation_services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.consultation_services_id_seq OWNED BY public.consultation_services.id;


--
-- Name: consultations; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.consultations OWNER TO postgres;

--
-- Name: consultations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.consultations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.consultations_id_seq OWNER TO postgres;

--
-- Name: consultations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.consultations_id_seq OWNED BY public.consultations.id;


--
-- Name: contact_pages; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.contact_pages OWNER TO postgres;

--
-- Name: contact_pages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contact_pages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contact_pages_id_seq OWNER TO postgres;

--
-- Name: contact_pages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contact_pages_id_seq OWNED BY public.contact_pages.id;


--
-- Name: courses; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.courses OWNER TO postgres;

--
-- Name: courses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.courses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.courses_id_seq OWNER TO postgres;

--
-- Name: courses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.courses_id_seq OWNED BY public.courses.id;


--
-- Name: entity_teachers; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.entity_teachers OWNER TO postgres;

--
-- Name: entity_teachers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.entity_teachers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.entity_teachers_id_seq OWNER TO postgres;

--
-- Name: entity_teachers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.entity_teachers_id_seq OWNED BY public.entity_teachers.id;


--
-- Name: faqs; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.faqs OWNER TO postgres;

--
-- Name: faqs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.faqs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.faqs_id_seq OWNER TO postgres;

--
-- Name: faqs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.faqs_id_seq OWNED BY public.faqs.id;


--
-- Name: footer_content; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.footer_content OWNER TO postgres;

--
-- Name: footer_content_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.footer_content_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.footer_content_id_seq OWNER TO postgres;

--
-- Name: footer_content_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.footer_content_id_seq OWNED BY public.footer_content.id;


--
-- Name: home_pages; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.home_pages OWNER TO postgres;

--
-- Name: home_pages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.home_pages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.home_pages_id_seq OWNER TO postgres;

--
-- Name: home_pages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.home_pages_id_seq OWNED BY public.home_pages.id;


--
-- Name: job_postings; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.job_postings OWNER TO postgres;

--
-- Name: job_postings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.job_postings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.job_postings_id_seq OWNER TO postgres;

--
-- Name: job_postings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.job_postings_id_seq OWNED BY public.job_postings.id;


--
-- Name: navigation_menus; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.navigation_menus OWNER TO postgres;

--
-- Name: navigation_menus_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.navigation_menus_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.navigation_menus_id_seq OWNER TO postgres;

--
-- Name: navigation_menus_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.navigation_menus_id_seq OWNED BY public.navigation_menus.id;


--
-- Name: nd_about_page; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.nd_about_page OWNER TO postgres;

--
-- Name: nd_about_page_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.nd_about_page_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nd_about_page_id_seq OWNER TO postgres;

--
-- Name: nd_about_page_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.nd_about_page_id_seq OWNED BY public.nd_about_page.id;


--
-- Name: nd_blog_page; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.nd_blog_page OWNER TO postgres;

--
-- Name: nd_blog_page_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.nd_blog_page_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nd_blog_page_id_seq OWNER TO postgres;

--
-- Name: nd_blog_page_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.nd_blog_page_id_seq OWNED BY public.nd_blog_page.id;


--
-- Name: nd_blog_posts; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.nd_blog_posts OWNER TO postgres;

--
-- Name: nd_blog_posts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.nd_blog_posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nd_blog_posts_id_seq OWNER TO postgres;

--
-- Name: nd_blog_posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.nd_blog_posts_id_seq OWNED BY public.nd_blog_posts.id;


--
-- Name: nd_career_center_platform_page; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.nd_career_center_platform_page OWNER TO postgres;

--
-- Name: nd_career_center_platform_page_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.nd_career_center_platform_page_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nd_career_center_platform_page_id_seq OWNER TO postgres;

--
-- Name: nd_career_center_platform_page_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.nd_career_center_platform_page_id_seq OWNED BY public.nd_career_center_platform_page.id;


--
-- Name: nd_contact_page; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.nd_contact_page OWNER TO postgres;

--
-- Name: nd_contact_page_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.nd_contact_page_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nd_contact_page_id_seq OWNER TO postgres;

--
-- Name: nd_contact_page_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.nd_contact_page_id_seq OWNED BY public.nd_contact_page.id;


--
-- Name: nd_course_details_page; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.nd_course_details_page OWNER TO postgres;

--
-- Name: TABLE nd_course_details_page; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.nd_course_details_page IS 'Stores UI translations for the Course Details page - actual course content comes from nd_courses table';


--
-- Name: nd_course_details_page_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.nd_course_details_page_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nd_course_details_page_id_seq OWNER TO postgres;

--
-- Name: nd_course_details_page_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.nd_course_details_page_id_seq OWNED BY public.nd_course_details_page.id;


--
-- Name: nd_courses; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.nd_courses OWNER TO postgres;

--
-- Name: nd_courses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.nd_courses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nd_courses_id_seq OWNER TO postgres;

--
-- Name: nd_courses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.nd_courses_id_seq OWNED BY public.nd_courses.id;


--
-- Name: nd_courses_page; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.nd_courses_page OWNER TO postgres;

--
-- Name: nd_courses_page_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.nd_courses_page_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nd_courses_page_id_seq OWNER TO postgres;

--
-- Name: nd_courses_page_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.nd_courses_page_id_seq OWNED BY public.nd_courses_page.id;


--
-- Name: nd_footer; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.nd_footer OWNER TO postgres;

--
-- Name: nd_footer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.nd_footer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nd_footer_id_seq OWNER TO postgres;

--
-- Name: nd_footer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.nd_footer_id_seq OWNED BY public.nd_footer.id;


--
-- Name: nd_home; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.nd_home OWNER TO postgres;

--
-- Name: nd_home_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.nd_home_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nd_home_id_seq OWNER TO postgres;

--
-- Name: nd_home_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.nd_home_id_seq OWNED BY public.nd_home.id;


--
-- Name: nd_home_page; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.nd_home_page OWNER TO postgres;

--
-- Name: nd_home_page_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.nd_home_page_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nd_home_page_id_seq OWNER TO postgres;

--
-- Name: nd_home_page_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.nd_home_page_id_seq OWNED BY public.nd_home_page.id;


--
-- Name: nd_menu; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.nd_menu OWNER TO postgres;

--
-- Name: nd_menu_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.nd_menu_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nd_menu_id_seq OWNER TO postgres;

--
-- Name: nd_menu_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.nd_menu_id_seq OWNED BY public.nd_menu.id;


--
-- Name: nd_pricing_page; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.nd_pricing_page OWNER TO postgres;

--
-- Name: nd_pricing_page_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.nd_pricing_page_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nd_pricing_page_id_seq OWNER TO postgres;

--
-- Name: nd_pricing_page_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.nd_pricing_page_id_seq OWNED BY public.nd_pricing_page.id;


--
-- Name: nd_teachers_page; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.nd_teachers_page OWNER TO postgres;

--
-- Name: nd_teachers_page_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.nd_teachers_page_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nd_teachers_page_id_seq OWNER TO postgres;

--
-- Name: nd_teachers_page_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.nd_teachers_page_id_seq OWNED BY public.nd_teachers_page.id;


--
-- Name: nd_ui_translations; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.nd_ui_translations OWNER TO postgres;

--
-- Name: nd_ui_translations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.nd_ui_translations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nd_ui_translations_id_seq OWNER TO postgres;

--
-- Name: nd_ui_translations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.nd_ui_translations_id_seq OWNED BY public.nd_ui_translations.id;


--
-- Name: pricing_plans; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.pricing_plans OWNER TO postgres;

--
-- Name: pricing_plans_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pricing_plans_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pricing_plans_id_seq OWNER TO postgres;

--
-- Name: pricing_plans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pricing_plans_id_seq OWNED BY public.pricing_plans.id;


--
-- Name: site_settings; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.site_settings OWNER TO postgres;

--
-- Name: site_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.site_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.site_settings_id_seq OWNER TO postgres;

--
-- Name: site_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.site_settings_id_seq OWNED BY public.site_settings.id;


--
-- Name: statistics; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.statistics OWNER TO postgres;

--
-- Name: statistics_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.statistics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.statistics_id_seq OWNER TO postgres;

--
-- Name: statistics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.statistics_id_seq OWNED BY public.statistics.id;


--
-- Name: teachers; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.teachers OWNER TO postgres;

--
-- Name: teachers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.teachers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.teachers_id_seq OWNER TO postgres;

--
-- Name: teachers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.teachers_id_seq OWNED BY public.teachers.id;


--
-- Name: about_pages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.about_pages ALTER COLUMN id SET DEFAULT nextval('public.about_pages_id_seq'::regclass);


--
-- Name: blog_posts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blog_posts ALTER COLUMN id SET DEFAULT nextval('public.blog_posts_id_seq'::regclass);


--
-- Name: button_texts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.button_texts ALTER COLUMN id SET DEFAULT nextval('public.button_texts_id_seq'::regclass);


--
-- Name: career_center_pages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.career_center_pages ALTER COLUMN id SET DEFAULT nextval('public.career_center_pages_id_seq'::regclass);


--
-- Name: career_orientation_pages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.career_orientation_pages ALTER COLUMN id SET DEFAULT nextval('public.career_orientation_pages_id_seq'::regclass);


--
-- Name: career_resources id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.career_resources ALTER COLUMN id SET DEFAULT nextval('public.career_resources_id_seq'::regclass);


--
-- Name: company_logos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_logos ALTER COLUMN id SET DEFAULT nextval('public.company_logos_id_seq'::regclass);


--
-- Name: consultation_services id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consultation_services ALTER COLUMN id SET DEFAULT nextval('public.consultation_services_id_seq'::regclass);


--
-- Name: consultations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consultations ALTER COLUMN id SET DEFAULT nextval('public.consultations_id_seq'::regclass);


--
-- Name: contact_pages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_pages ALTER COLUMN id SET DEFAULT nextval('public.contact_pages_id_seq'::regclass);


--
-- Name: courses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses ALTER COLUMN id SET DEFAULT nextval('public.courses_id_seq'::regclass);


--
-- Name: entity_teachers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.entity_teachers ALTER COLUMN id SET DEFAULT nextval('public.entity_teachers_id_seq'::regclass);


--
-- Name: faqs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faqs ALTER COLUMN id SET DEFAULT nextval('public.faqs_id_seq'::regclass);


--
-- Name: footer_content id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.footer_content ALTER COLUMN id SET DEFAULT nextval('public.footer_content_id_seq'::regclass);


--
-- Name: home_pages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.home_pages ALTER COLUMN id SET DEFAULT nextval('public.home_pages_id_seq'::regclass);


--
-- Name: job_postings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_postings ALTER COLUMN id SET DEFAULT nextval('public.job_postings_id_seq'::regclass);


--
-- Name: navigation_menus id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.navigation_menus ALTER COLUMN id SET DEFAULT nextval('public.navigation_menus_id_seq'::regclass);


--
-- Name: nd_about_page id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nd_about_page ALTER COLUMN id SET DEFAULT nextval('public.nd_about_page_id_seq'::regclass);


--
-- Name: nd_blog_page id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nd_blog_page ALTER COLUMN id SET DEFAULT nextval('public.nd_blog_page_id_seq'::regclass);


--
-- Name: nd_blog_posts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nd_blog_posts ALTER COLUMN id SET DEFAULT nextval('public.nd_blog_posts_id_seq'::regclass);


--
-- Name: nd_career_center_platform_page id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nd_career_center_platform_page ALTER COLUMN id SET DEFAULT nextval('public.nd_career_center_platform_page_id_seq'::regclass);


--
-- Name: nd_contact_page id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nd_contact_page ALTER COLUMN id SET DEFAULT nextval('public.nd_contact_page_id_seq'::regclass);


--
-- Name: nd_course_details_page id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nd_course_details_page ALTER COLUMN id SET DEFAULT nextval('public.nd_course_details_page_id_seq'::regclass);


--
-- Name: nd_courses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nd_courses ALTER COLUMN id SET DEFAULT nextval('public.nd_courses_id_seq'::regclass);


--
-- Name: nd_courses_page id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nd_courses_page ALTER COLUMN id SET DEFAULT nextval('public.nd_courses_page_id_seq'::regclass);


--
-- Name: nd_footer id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nd_footer ALTER COLUMN id SET DEFAULT nextval('public.nd_footer_id_seq'::regclass);


--
-- Name: nd_home id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nd_home ALTER COLUMN id SET DEFAULT nextval('public.nd_home_id_seq'::regclass);


--
-- Name: nd_home_page id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nd_home_page ALTER COLUMN id SET DEFAULT nextval('public.nd_home_page_id_seq'::regclass);


--
-- Name: nd_menu id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nd_menu ALTER COLUMN id SET DEFAULT nextval('public.nd_menu_id_seq'::regclass);


--
-- Name: nd_pricing_page id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nd_pricing_page ALTER COLUMN id SET DEFAULT nextval('public.nd_pricing_page_id_seq'::regclass);


--
-- Name: nd_teachers_page id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nd_teachers_page ALTER COLUMN id SET DEFAULT nextval('public.nd_teachers_page_id_seq'::regclass);


--
-- Name: nd_ui_translations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nd_ui_translations ALTER COLUMN id SET DEFAULT nextval('public.nd_ui_translations_id_seq'::regclass);


--
-- Name: pricing_plans id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pricing_plans ALTER COLUMN id SET DEFAULT nextval('public.pricing_plans_id_seq'::regclass);


--
-- Name: site_settings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.site_settings ALTER COLUMN id SET DEFAULT nextval('public.site_settings_id_seq'::regclass);


--
-- Name: statistics id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.statistics ALTER COLUMN id SET DEFAULT nextval('public.statistics_id_seq'::regclass);


--
-- Name: teachers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teachers ALTER COLUMN id SET DEFAULT nextval('public.teachers_id_seq'::regclass);


--
-- Data for Name: about_pages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.about_pages (id, locale, hero_title, hero_subtitle, mission_title, mission_description, vision_title, vision_description, published_at, created_at, updated_at) FROM stdin;
1	en	About Us	About Me Name - Expert Mentor in Technology	My Story as Mentor	Dive into our expertly curated selection of featured courses, designed to equip you with the skills and knowledge needed to excel.	Values That Drive Me	Dive into our expertly curated selection of featured courses, designed to equip you with the skills and knowledge needed to excel.	2025-09-18 08:48:56.346992	2025-09-15 01:56:43.265974	2025-09-18 08:48:56.346992
2	ru	О Нас	Обо Мне - Эксперт-Наставник в Технологиях	Моя История как Наставника	Погрузитесь в наш экспертно подобранный выбор рекомендуемых курсов, разработанных, чтобы вооружить вас навыками и знаниями, необходимыми для совершенства.	Ценности, Которые Движут Мной	Погрузитесь в наш экспертно подобранный выбор рекомендуемых курсов, разработанных, чтобы вооружить вас навыками и знаниями, необходимыми для совершенства.	2025-09-18 08:48:56.348885	2025-09-15 01:56:43.266599	2025-09-18 08:48:56.348885
3	he	אודותינו	אודותי - מנטור מומחה בטכנולוגיה	הסיפור שלי כמנטור	הצטרפו לקורסים שנבחרו בקפידה על ידי מומחים, המיועדים לצייד אתכם בכישורים ובידע הדרושים להצטיינות.	הערכים שמניעים אותי	הצטרפו לקורסים שנבחרו בקפידה על ידי מומחים, המיועדים לצייד אתכם בכישורים ובידע הדרושים להצטיינות.	2025-09-18 08:48:56.349738	2025-09-15 01:56:43.266785	2025-09-18 08:48:56.349738
\.


--
-- Data for Name: blog_posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.blog_posts (id, title, title_ru, title_he, content, content_ru, content_he, excerpt, author, category, image_url, locale, published_at, published_date, reading_time, created_at, updated_at, url, featured_image_url, gallery_images, video_url, content_sections, tags, related_posts, author_bio, author_image_url, author_social_links, meta_title, meta_description, views_count, likes_count, shares_count, is_featured, is_published, is_visible, excerpt_ru, excerpt_he) FROM stdin;
1	Getting Started with Machine Learning	Начало работы с машинным обучением	התחלה עם למידת מכונה	Machine learning is transforming industries...	Машинное обучение меняет отрасли и создает новые возможности для решения сложных проблем. Эта статья поможет вам понять основы ML и начать свой путь в этой захватывающей области технологий.	למידת מכונה משנה תעשיות ויוצרת הזדמנויות חדשות לפתרון בעיות מורכבות. מאמר זה יעזור לך להבין את היסודות של ML ולהתחיל את הדרך שלך בתחום הטכנולוגיה המרתק הזה.	Learn the basics of ML	Dr. Sarah Johnson	\N	\N	en	2025-09-11 15:16:32	\N	\N	2025-09-15 11:40:22.532486	2025-09-18 10:24:12.864872	https://blog.aistudio555.com/getting-started-machine-learning	\N	[]	\N	[]	[]	[]	\N	\N	{}	\N	\N	5	0	0	f	t	t	Изучите основы машинного обучения	למד את היסודות של למידת מכונה
6	ИИ в здравоохранении: будущие тренды	\N	\N	Искусственный интеллект революционизирует здравоохранение на наших глазах. От диагностики заболеваний с помощью компьютерного зрения до персонализированной медицины на основе генетических данных, ИИ открывает невероятные возможности для улучшения качества медицинской помощи. Мы рассмотрим текущие применения, успешные кейсы и будущие перспективы ИИ в медицине.	\N	\N	Исследуйте революционные применения ИИ в медицине	Профессор Майкл Чен	Здравоохранение	\N	ru	2025-09-21 16:46:09.071143	\N	7	2025-09-21 16:46:09.071143	2025-09-21 16:46:09.071143	\N	https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400	[]	\N	[]	[]	[]	\N	\N	{}	\N	\N	0	0	0	t	t	t	\N	\N
7	Этика в разработке искусственного интеллекта	\N	\N	По мере того как ИИ становится все более распространенным в нашей жизни, этические соображения приобретают критическое значение. Мы должны учитывать вопросы справедливости алгоритмов, прозрачности принятия решений, защиты конфиденциальности и ответственности при разработке ИИ-систем. Это руководство исследует ключевые этические принципы, реальные примеры проблем и лучшие практики для создания ответственного ИИ.	\N	\N	Важные этические вопросы в эпоху ИИ	Елена Родригез	Этика ИИ	\N	ru	2025-09-21 16:46:09.07182	\N	6	2025-09-21 16:46:09.07182	2025-09-21 16:46:09.07182	\N	https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=600&h=400	[]	\N	[]	[]	[]	\N	\N	{}	\N	\N	0	0	0	f	t	t	\N	\N
8	Глубокое обучение для начинающих	\N	\N	Глубокое обучение - это подраздел машинного обучения, использующий многослойные нейронные сети для решения сложных задач. От распознавания изображений до обработки естественного языка, глубокое обучение лежит в основе многих современных ИИ-приложений. В этом руководстве мы разберем основы архитектуры нейронных сетей, популярные фреймворки и практические примеры.	\N	\N	Погрузитесь в мир нейронных сетей	Александр Петров	Глубокое обучение	\N	ru	2025-09-21 16:46:09.07217	\N	8	2025-09-21 16:46:09.07217	2025-09-21 16:46:09.07217	\N	https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&h=400	[]	\N	[]	[]	[]	\N	\N	{}	\N	\N	0	0	0	t	t	t	\N	\N
9	Обработка естественного языка с Python	\N	\N	Обработка естественного языка (NLP) позволяет компьютерам понимать, интерпретировать и генерировать человеческий язык. С помощью Python и современных библиотек вы можете создавать чат-ботов, системы анализа тональности, переводчики и многое другое. Мы рассмотрим основные техники NLP, популярные библиотеки и реальные применения.	\N	\N	Научите компьютеры понимать человеческий язык	Мария Иванова	NLP	\N	ru	2025-09-21 16:46:09.072595	\N	10	2025-09-21 16:46:09.072595	2025-09-21 16:46:09.072595	\N	https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=600&h=400	[]	\N	[]	[]	[]	\N	\N	{}	\N	\N	0	0	0	f	t	t	\N	\N
15	רשתות נוירוניות קונבולוציוניות לראייה ממוחשבת	\N	\N	רשתות נוירוניות קונבולוציוניות (CNNs) הן הארכיטקטורה המובילה למשימות ראייה ממוחשבת. מזיהוי פנים ועד נהיגה אוטונומית, CNNs מאפשרות למחשבים "לראות" ולהבין תמונות ברמת דיוק מדהימה. נחקור את המבנה של CNNs, שכבות שונות, ונראה כיצד לבנות מודלים לסיווג תמונות.	\N	\N	הבינו כיצד CNNs מהפכות את תחום עיבוד התמונה	יוסף לוי	ראייה ממוחשבת	\N	he	2025-09-21 16:59:31.470182	\N	9	2025-09-21 16:59:31.470182	2025-09-21 16:59:31.470182	\N	https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400	[]	\N	[]	["#computer_vision", "#CNN"]	[]	\N	\N	{}	\N	\N	0	0	0	t	t	t	\N	\N
17	למידת חיזוק: איך מכונות לומדות מניסיון	\N	\N	למידת חיזוק היא גישה ללמידת מכונה שבה סוכן לומד על ידי אינטראקציה עם הסביבה וקבלת משוב. מרובוטיקה ועד משחקי מחשב, למידת חיזוק מאפשרת למכונות ללמוד אסטרטגיות מורכבות. נכיר את המושגים הבסיסיים, אלגוריתמים חשובים כמו Q-Learning ודוגמאות מעשיות.	\N	\N	הבינו את העקרונות של למידת חיזוק ויישומיה	דוד שמעוני	למידת חיזוק	\N	he	2025-09-21 16:59:31.471071	\N	8	2025-09-21 16:59:31.471071	2025-09-21 16:59:31.471071	\N	https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400	[]	\N	[]	[]	[]	\N	\N	{}	\N	\N	1	0	0	f	t	t	\N	\N
16	בינה מלאכותית גנרטיבית: יצירת תוכן עם AI	\N	\N	בינה מלאכותית גנרטיבית משנה את הדרך שבה אנו יוצרים תוכן. ממודלי שפה כמו GPT ועד יצירת תמונות עם DALL-E ו-Stable Diffusion, AI יכול כעת ליצור תוכן מקורי ומרשים. נלמד על הטכנולוגיות מאחורי מודלים גנרטיביים, היישומים שלהם והאתגרים האתיים שהם מציבים.	\N	\N	גלו כיצד מודלי AI יוצרים טקסט, תמונות ומוזיקה	רחל כהן	AI גנרטיבי	\N	he	2025-09-21 16:59:31.47062	\N	7	2025-09-21 16:59:31.47062	2025-09-21 16:59:31.47062	\N	https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400	[]	\N	[]	["#generative_AI", "#יצירתיות"]	[]	\N	\N	{}	\N	\N	3	0	0	t	t	t	\N	\N
10	התחלה עם למידת מכונה	\N	\N	למידת מכונה היא תחום מרתק של בינה מלאכותית המאפשר למחשבים ללמוד מנתונים. במדריך זה נסקור את המושגים הבסיסיים, האלגוריתמים החשובים והיישומים המעשיים של למידת מכונה. תלמדו על למידה מונחית (supervised learning), למידה לא מונחית (unsupervised learning) ולמידת חיזוק (reinforcement learning), וכיצד להתחיל ליישם טכניקות אלה בפרויקטים אמיתיים.	\N	\N	למדו את היסודות של למידת מכונה והתחילו את המסע שלכם בעולם הבינה המלאכותית	ד"ר שרה ג'ונסון	למידת מכונה	\N	he	2025-09-21 16:59:31.466726	\N	5	2025-09-21 16:59:31.466726	2025-09-21 16:59:31.466726	\N	https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=400	[]	\N	[]	[]	[]	\N	\N	{}	\N	\N	2	0	0	t	t	t	\N	\N
11	בינה מלאכותית ברפואה: מגמות עתידיות	\N	\N	הבינה המלאכותית מחוללת מהפכה בתחום הבריאות לנגד עינינו. מאבחון מחלות באמצעות ראייה ממוחשבת ועד רפואה מותאמת אישית המבוססת על נתונים גנטיים, ה-AI פותח אפשרויות מדהימות לשיפור איכות הטיפול הרפואי. נסקור יישומים נוכחיים, מקרי הצלחה ופרספקטיבות עתידיות של AI ברפואה.	\N	\N	חקרו את היישומים המהפכניים של AI ברפואה המודרנית	פרופ' מיכאל חן	בריאות	\N	he	2025-09-21 16:59:31.468229	\N	7	2025-09-21 16:59:31.468229	2025-09-21 16:59:31.468229	\N	https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400	[]	\N	[]	["#רפואה_דיגיטלית", "#healthtech"]	[]	\N	\N	{}	\N	\N	0	0	0	t	t	t	\N	\N
12	אתיקה בפיתוח בינה מלאכותית	\N	\N	ככל שהבינה המלאכותית הופכת נפוצה יותר בחיינו, שיקולים אתיים מקבלים חשיבות קריטית. עלינו להתחשב בנושאי הוגנות אלגוריתמית, שקיפות בקבלת החלטות, הגנת פרטיות ואחריות בעת פיתוח מערכות AI. מדריך זה חוקר עקרונות אתיים מרכזיים, דוגמאות אמיתיות לבעיות ושיטות מומלצות ליצירת AI אחראי.	\N	\N	שאלות אתיות חשובות בעידן הבינה המלאכותית	אלנה רודריגז	אתיקה ב-AI	\N	he	2025-09-21 16:59:31.468926	\N	6	2025-09-21 16:59:31.468926	2025-09-21 16:59:31.468926	\N	https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=600&h=400	[]	\N	[]	["#אתיקה", "#AI_אחראי"]	[]	\N	\N	{}	\N	\N	0	0	0	f	t	t	\N	\N
13	למידה עמוקה למתחילים	\N	\N	למידה עמוקה היא תת-תחום של למידת מכונה המשתמש ברשתות נוירוניות רב-שכבתיות לפתרון בעיות מורכבות. מזיהוי תמונות ועד עיבוד שפה טבעית, למידה עמוקה נמצאת בבסיס יישומי AI מודרניים רבים. במדריך זה נפרק את היסודות של ארכיטקטורת רשתות נוירוניות, frameworks פופולריים ודוגמאות מעשיות.	\N	\N	צללו לעולם הרשתות הנוירוניות והלמידה העמוקה	אלכסנדר פטרוב	למידה עמוקה	\N	he	2025-09-21 16:59:31.469346	\N	8	2025-09-21 16:59:31.469346	2025-09-21 16:59:31.469346	\N	https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&h=400	[]	\N	[]	["#למידה_חישובית", "#AI"]	[]	\N	\N	{}	\N	\N	0	0	0	t	t	t	\N	\N
14	עיבוד שפה טבעית עם Python	\N	\N	עיבוד שפה טבעית (NLP) מאפשר למחשבים להבין, לפרש ולייצר שפה אנושית. בעזרת Python וספריות מודרניות, תוכלו ליצור צ'אטבוטים, מערכות ניתוח סנטימנט, מתרגמים ועוד. נסקור טכניקות NLP בסיסיות, ספריות פופולריות ויישומים בעולם האמיתי.	\N	\N	למדו מחשבים להבין שפה אנושית עם כלי NLP מתקדמים	מריה איבנובה	NLP	\N	he	2025-09-21 16:59:31.46981	\N	10	2025-09-21 16:59:31.46981	2025-09-21 16:59:31.46981	\N	https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=600&h=400	[]	\N	[]	["#עיבוד_שפה", "#NLP"]	[]	\N	\N	{}	\N	\N	0	0	0	f	t	t	\N	\N
3	Ethics in AI Development2	Этика в разработке ИИ	אתיקה בפיתוח בינה מלאכותית	As AI becomes more prevalent, ethical considerations... qdadsas dads asd asd asd 	По мере того как ИИ становится все более распространенным, этические соображения становятся критически важными. Разработчики должны учитывать влияние своих решений на общество, обеспечивая справедливость, прозрачность и ответственность в системах ИИ.	ככל שהבינה המלאכותית הופכת נפוצה יותר, שיקולים אתיים הופכים קריטיים. מפתחים חייבים לשקול את השפעת החלטותיהם על החברה, להבטיח הוגנות, שקיפות ואחריות במערכות בינה מלאכותית.	Understanding AI ethics	Elena Rodriguez	Programming	\N	en	2025-09-11 06:16:00	\N	4	2025-09-15 11:40:22.533036	2025-09-18 13:26:01.225468	https://blog.aistudio555.com/ethics-in-ai-development		[]	https://www.youtube.com/watch?v=SItyvIMLac8&t=10233s	\N	["#ai", "devops"]	[]			{}	\N		41	0	0	f	t	t	Понимание этики ИИ	הבנת אתיקה של בינה מלאכותית
4	🎉 New Blog Post from Admin Test	\N	\N	This is a test post created through the admin API to verify that new blog posts appear on the blog page. The integration between admin and frontend should now be working correctly!	\N	\N	This is a test post created through the admin API to verify that new blog posts appear on the blog page. The integration between admin and frontend should now be working correctly!...	Admin Test User	Testing	\N	en	2025-09-21 11:39:16.953	\N	1	2025-09-21 14:39:16.958484	2025-09-21 14:39:16.958484	\N	https://via.placeholder.com/600x400/28a745/FFFFFF?text=Admin+Test+Post	[]	\N	[]	[]	[]	\N	\N	{}	\N	\N	10	0	0	t	t	t	\N	\N
2	AI in Healthcare: Future Trends	ИИ в здравоохранении: будущие тенденции	בינה מלאכותית ברפואה: טרנדים עתידיים	Artificial Intelligence is revolutionizing healthcare...	Искусственный интеллект революционизирует здравоохранение, открывая новые возможности для диагностики, лечения и профилактики заболеваний. От точной диагностики до персонализированной медицины - ИИ меняет способы оказания медицинской помощи.	בינה מלאכותית מחוללת מהפכה ברפואה, פותחת הזדמנויות חדשות לאבחון, טיפול ומניעת מחלות. מאבחון מדויק ועד רפואה מותאמת אישית - הבינה המלאכותית משנה את דרכי מתן הטיפול הרפואי.	Explore AI healthcare applications	Prof. Michael Chen	\N	\N	en	2025-09-11 15:16:32	\N	\N	2025-09-15 11:40:22.53279	2025-09-18 10:24:23.365308	https://blog.aistudio555.com/ai-healthcare-future-trends	\N	[]	\N	[]	[]	[]	\N	\N	{}	\N	\N	14	0	0	f	t	t	Изучите применение ИИ в здравоохранении	חקור יישומי בינה מלאכותית ברפואה
5	Начало работы с машинным обучением	\N	\N	Машинное обучение - это захватывающая область искусственного интеллекта, которая позволяет компьютерам учиться на данных. В этом руководстве мы рассмотрим основные концепции, алгоритмы и практические применения машинного обучения. Вы узнаете о supervised learning, unsupervised learning и reinforcement learning, а также о том, как начать применять эти техники в реальных проектах.	\N	\N	Изучите основы машинного обучения и начните свой путь в ИИ	Доктор Сара Джонсон	Машинное обучение	\N	ru	2025-09-21 16:46:09.069966	\N	5	2025-09-21 16:46:09.069966	2025-09-21 16:46:09.069966	\N	https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=400	[]	\N	[]	[]	[]	\N	\N	{}	\N	\N	1	0	0	f	t	t	\N	\N
\.


--
-- Data for Name: button_texts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.button_texts (id, locale, get_started, explore_courses, learn_more, enroll_now, contact_us, created_at) FROM stdin;
1	en	Get Started	Explore Courses	Learn More	Enroll Now	Contact Us	2025-09-15 01:25:55.270218
\.


--
-- Data for Name: career_center_pages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.career_center_pages (id, title, content, services, programs, success_stories, hero_title, hero_subtitle, services_data, resources_data, locale, published_at, created_at, updated_at) FROM stdin;
1	Career Center	Your gateway to AI career success	Career counseling, Job placement, Resume review	Internship program, Mentorship, Alumni network	\N	\N	\N	\N	\N	en	2025-09-11 15:17:01	2025-09-15 11:40:22.53598	2025-09-15 11:40:22.53598
\.


--
-- Data for Name: career_orientation_pages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.career_orientation_pages (id, title, content, guidance_sections, assessment_tools, career_paths, hero_title, hero_subtitle, assessment_data, paths_data, locale, published_at, created_at, updated_at, hero_description, hero_main_title, hero_stat1_number, hero_stat1_label, hero_stat1_value, hero_stat2_number, hero_stat2_label, hero_stat2_value, hero_stat3_number, hero_stat3_label, hero_stat3_value, hero_cta_text, hero_cta_link, hero_badge_text, hero_visible, problems_main_title, problems_subtitle, problems_description, problem1_icon, problem1_title, problem1_description, problem1_stat, problem1_stat_label, problem2_icon, problem2_title, problem2_description, problem2_stat, problem2_stat_label, problems_visible, solutions_main_title, solutions_subtitle, solution1_icon, solution1_title, solution1_description, solution1_feature1, solution1_feature2, solution1_feature3, solution1_feature4, solution1_benefit, solutions_visible, process_main_title, process_subtitle, process_title, process_step1_title, process_step1_description, process_step1_duration, process_step2_title, process_step2_description, process_step2_duration, process_step3_title, process_step3_description, process_step3_duration, process_visible, career_paths_main_title, career_paths_subtitle, career_path1_title, career_path1_description, career_path1_salary_range, career_path1_growth_rate, career_path1_top_skills, career_paths_visible, expert_name, expert_title, expert_credentials, expert_background, expert_description, expert_quote, expert_linkedin, expert_twitter, expert_visible, partners_main_title, partners_subtitle, partners_title, partner1_name, partner1_description, partner2_name, partner2_description, partner3_name, partner3_description, partners_visible, assessment_main_title, assessment_subtitle, assessment_description, assessment_visible, cta_main_title, cta_subtitle, cta_description, cta_button_text, cta_button_link, cta_visible, challenges_title, challenge1_title, challenge1_description, challenge2_title, challenge2_description, challenge3_title, challenge3_description, challenge4_title, challenge4_description, solution2_icon, solution2_title, solution2_description, process_step4_title, process_step4_description, process_step4_duration, process_step5_title, process_step5_description, process_step5_duration, career_path2_title, career_path2_description, career_path2_salary_range, career_path2_growth_rate, career_path3_title, career_path3_description, expert_achievements, assessment_questions, resources_main_title, resources_subtitle, resources, resources_visible, success_stories_main_title, success_stories_subtitle, success_stories, success_stories_visible, meta_title, meta_description, meta_keywords, og_title, og_description, og_image, subtitle, solutions_description, outcomes_main_title, outcomes_subtitle, outcomes_description, outcome1_text, outcome2_text, outcome3_text, outcome4_text, expert_stat1_number, expert_stat1_label, expert_stat2_number, expert_stat2_label, cta_privacy_text) FROM stdin;
2	\N	\N	\N	\N	\N	Career Orientation	Professional Career Guidance	\N	\N	en	\N	2025-09-16 11:40:16.530967	2025-09-16 11:40:16.530967	Feeling lost in choosing your profession? Don't know how to transition to technology? We're here to help you find the right direction and build a successful career.	Find Your Perfect Career in the Technology World	\N	People We've Guided	500+	\N	Success Rate	95%	\N	Specialization Areas	15+	Start Now	\N	\N	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	Our Process	4 Simple Steps to a New Career	\N	Personal Assessment	Complete a detailed questionnaire to identify skills, interests and personal values	30 minutes	Professional Consultation	Personal meeting with a career expert to analyze results and build an action plan	60 minutes	Learning Plan	Receive recommendations for tailored courses and personalized learning path	30 minutes	t	Popular Career Paths	Discover the possibilities in technology	\N	\N	\N	\N	\N	t	Julia Petrova	Career Guidance Expert	M.A. in Organizational Psychology	8+ years of career consulting experience	Julia has extensive experience in human resources and career counseling. She helps people find the right professional direction and achieve their career goals. Julia specializes in guiding people interested in transitioning to technology and high-tech.	\N	\N	\N	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	\N	\N	t	Ready for Change?	Take One Step Forward	Join our professional consulting process and find the perfect career for you	Start Now	\N	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	\N	\N	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
3	en	\N	\N	\N	\N	Профориентация	Откройте свой идеальный карьерный путь в ИИ	\N	\N	ru	\N	2025-09-16 11:40:16.531707	2025-09-25 11:11:21.040491	Передовая оценка на основе ИИ поможет найти идеальную карьеру в области искусственного интеллекта	Программа профориентации ИИ	500+	Career Paths	500+	15+	AI Specializations	15+	95%	Success Rate	95%	Get Started	#		f	Common Career Challenges													f	Our Solutions										f	Ваш путь карьерного открытия в 5 шагов	Системный подход к поиску карьерного пути в ИИ	\N	Оценка	Пройдите комплексную оценку карьеры	15 минут	Анализ	ИИ анализирует ваши ответы и рыночные данные	2 минуты	Рекомендации	Получите персональные рекомендации карьерного пути	5 минут	f	Career Paths							f	Sarah Chen	Career Specialist		8+ лет опыта карьерного консультирования					f	Our Partners		\N							f	Бесплатная оценка карьеры в ИИ	Откройте свой идеальный карьерный путь в ИИ за 15 минут		f						f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	\N	\N	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
1	en	\N	\N	\N	\N	כיוון קריירה		\N	\N	he	\N	2025-09-16 11:40:16.528395	2025-09-25 11:14:21.597131		🧪 TEST Hebrew תבחן	500+	Career Paths	500+	15+	AI Specializations	15+	95%	Success Rate	95%	Get Started	#		f	Common Career Challenges													f	Our Solutions										f	Our Process		\N	🧪 TEST Step שלב									f	Career Paths							f	Sarah Chen	Career Specialist		8+ שנות ניסיון בייעוץ קריירה					f	Our Partners		\N							f				f						f	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	t	\N	\N	\N	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: career_resources; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.career_resources (id, locale, title, description, type, category, download_url, visible, published_at, created_at, updated_at) FROM stdin;
1	en	AI Resume Template	Professional resume template specifically designed for AI and ML positions	Template	Resume	/downloads/ai-resume-template.pdf	t	2025-09-15 01:56:43.269115	2025-09-15 01:56:43.269115	2025-09-15 01:56:43.269115
2	en	Interview Preparation Guide	Comprehensive guide with common AI/ML interview questions and detailed answers	Guide	Interview	/downloads/ai-interview-guide.pdf	t	2025-09-15 01:56:43.269381	2025-09-15 01:56:43.269381	2025-09-15 01:56:43.269381
3	en	Salary Negotiation Handbook	Learn how to negotiate competitive salaries in the tech industry	Handbook	Career	/downloads/salary-negotiation-handbook.pdf	t	2025-09-15 01:56:43.269518	2025-09-15 01:56:43.269518	2025-09-15 01:56:43.269518
4	en	Portfolio Project Ideas	List of 50+ project ideas to build an impressive AI/ML portfolio	List	Portfolio	/downloads/portfolio-project-ideas.pdf	t	2025-09-15 01:56:43.269659	2025-09-15 01:56:43.269659	2025-09-15 01:56:43.269659
5	ru	Шаблон резюме для ИИ	Профессиональный шаблон резюме, специально разработанный для позиций в области ИИ и МО	Шаблон	Резюме	/downloads/ai-resume-template-ru.pdf	t	2025-09-15 01:56:43.269796	2025-09-15 01:56:43.269796	2025-09-15 01:56:43.269796
6	ru	Руководство по подготовке к интервью	Подробное руководство с распространенными вопросами для интервью по ИИ/МО	Руководство	Интервью	/downloads/ai-interview-guide-ru.pdf	t	2025-09-15 01:56:43.26994	2025-09-15 01:56:43.26994	2025-09-15 01:56:43.26994
7	ru	Справочник по переговорам о зарплате	Научитесь договариваться о конкурентоспособной зарплате в технологической индустрии	Справочник	Карьера	/downloads/salary-negotiation-ru.pdf	t	2025-09-15 01:56:43.27008	2025-09-15 01:56:43.27008	2025-09-15 01:56:43.27008
8	ru	Идеи портфолио проектов	Список из 50+ идей проектов для создания впечатляющего портфолио ИИ/МО	Список	Портфолио	/downloads/portfolio-ideas-ru.pdf	t	2025-09-15 01:56:43.270369	2025-09-15 01:56:43.270369	2025-09-15 01:56:43.270369
9	he	תבנית קורות חיים לבינה מלאכותית	תבנית קורות חיים מקצועית המיועדת במיוחד לתפקידים בתחום הבינה המלאכותית ולמידת מכונה	תבנית	קורות חיים	/downloads/ai-resume-template-he.pdf	t	2025-09-15 01:56:43.270514	2025-09-15 01:56:43.270514	2025-09-15 01:56:43.270514
10	he	מדריך הכנה לראיון עבודה	מדריך מקיף עם שאלות נפוצות בראיונות עבודה בתחום הבינה המלאכותית	מדריך	ראיון	/downloads/ai-interview-guide-he.pdf	t	2025-09-15 01:56:43.270659	2025-09-15 01:56:43.270659	2025-09-15 01:56:43.270659
11	he	מדריך משא ומתן על שכר	למדו כיצד לנהל משא ומתן על שכר תחרותי בתעשיית הטכנולוגיה	מדריך	קריירה	/downloads/salary-negotiation-he.pdf	t	2025-09-15 01:56:43.270803	2025-09-15 01:56:43.270803	2025-09-15 01:56:43.270803
12	he	רעיונות לפרויקטים בפורטפוליו	רשימה של 50+ רעיונות לפרויקטים לבניית פורטפוליו מרשים בתחום הבינה המלאכותית	רשימה	פורטפוליו	/downloads/portfolio-ideas-he.pdf	t	2025-09-15 01:56:43.270959	2025-09-15 01:56:43.270959	2025-09-15 01:56:43.270959
\.


--
-- Data for Name: company_logos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.company_logos (id, locale, section_title, company_1_name, company_1_logo, company_2_name, company_2_logo, company_3_name, company_3_logo, company_4_name, company_4_logo, created_at) FROM stdin;
1	en	Our Graduates Work At	Google	\N	Microsoft	\N	Amazon	\N	Meta	\N	2025-09-15 01:25:55.27335
\.


--
-- Data for Name: consultation_services; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.consultation_services (id, title, description, duration, price, features, locale, created_at, updated_at) FROM stdin;
1	Career Strategy Session	One-on-one career planning and guidance	60 minutes	150.00	{"followUp": true, "resources": true, "personalPlan": true}	en	2025-09-15 17:58:05.057697	2025-09-15 17:58:05.057697
2	Technical Interview Prep	Mock interviews and coding practice	90 minutes	200.00	{"tips": true, "feedback": true, "mockInterview": true}	en	2025-09-15 17:58:05.057697	2025-09-15 17:58:05.057697
3	Portfolio Review	Professional review of your AI/ML projects	45 minutes	100.00	{"improvement_tips": true, "detailed_feedback": true}	en	2025-09-15 17:58:05.057697	2025-09-15 17:58:05.057697
\.


--
-- Data for Name: consultations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.consultations (id, name, email, phone, interest, experience, locale, created_at, updated_at) FROM stdin;
1	משה כהן	test@example.com	052-123-4567	ai-ml	beginner	he	2025-09-15 08:57:54.522573	2025-09-15 08:57:54.522573
2	Test User	test@example.com	123-456-7890	ai-ml	beginner	he	2025-09-15 11:02:16.701695	2025-09-15 11:02:16.701695
3	דוד כהן	david.test@example.com	050-123-4567	ai-ml	beginner	he	2025-09-15 11:02:59.472432	2025-09-15 11:02:59.472432
4	fgfg	sfsdf@asdad.com	0876687676	data-science	some	he	2025-09-15 11:10:44.776662	2025-09-15 11:10:44.776662
5	sadasd	dsd@asdasd.dsd	0766876876	data-science	some	he	2025-09-15 11:17:05.649515	2025-09-15 11:17:05.649515
6	ss	adas@sdsd.com	as	data-science	some	he	2025-09-15 11:21:57.50456	2025-09-15 11:21:57.50456
7	aaa	adsa@adasd.co	098098098	data-science	intermediate	he	2025-09-15 11:22:34.394521	2025-09-15 11:22:34.394521
8	sdad	asdfsd@sadasd.com	23213123	data-science	some	he	2025-09-15 11:32:07.311934	2025-09-15 11:32:07.311934
9	asdad	asdad@asdads.com	13123123	data-science	intermediate	he	2025-09-15 11:34:55.139292	2025-09-15 11:34:55.139292
10	asd	asd@asdasd.com	09890870978	data-science	some	he	2025-09-15 11:39:41.108658	2025-09-15 11:39:41.108658
\.


--
-- Data for Name: contact_pages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contact_pages (id, phone, email, address, office_hours, map_url, published_at, created_at, updated_at, locale) FROM stdin;
1	(000) 123 456 7890	zohacous@email.com	1234 Valencia, Suite, SF, CA	Mon-Fri 9AM-6PM		2025-09-18 08:48:56.351543	2025-09-15 01:56:43.261448	2025-09-18 08:48:56.351543	en
2	(000) 123 456 7890	zohacous@email.com	1234 Valencia, Suite, SF, CA	Пн-Пт 9:00-18:00		2025-09-18 08:48:56.353366	2025-09-15 01:56:43.261938	2025-09-18 08:48:56.353366	ru
3	(000) 123 456 7890	zohacous@email.com	1234 Valencia, Suite, SF, CA	א-ה 9:00-18:00		2025-09-18 08:48:56.353989	2025-09-15 01:56:43.262108	2025-09-18 08:48:56.353989	he
\.


--
-- Data for Name: courses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.courses (id, locale, title, title_en, title_ru, title_he, description, description_en, description_ru, description_he, instructor, duration, lessons, level, price, image_url, category, lessons_count, students_count, rating, visible, published_at, created_at, updated_at, old_price, reviews, url, students, image) FROM stdin;
11	en	React & Redux Masterclass	\N	\N	\N	Master React.js and Redux to build scalable single-page applications.	\N	\N	\N	\N	8 weeks	45	\N	299.99	\N	Web Development	\N	\N	4.80	t	2025-09-25 13:51:12.289852	2025-09-25 13:51:12.289852	2025-09-25 13:51:12.289852	\N	\N	\N	\N	\N
12	en	Python for Data Science	\N	\N	\N	Unlock the power of Python for data analysis and machine learning.	\N	\N	\N	\N	12 weeks	52	\N	199.99	\N	Data Science	\N	\N	4.70	t	2025-09-25 13:51:12.292524	2025-09-25 13:51:12.292524	2025-09-25 13:51:12.292524	\N	\N	\N	\N	\N
13	en	Machine Learning Fundamentals	\N	\N	\N	Learn machine learning and AI fundamentals from scratch.	\N	\N	\N	\N	14 weeks	48	\N	349.99	\N	Machine Learning	\N	\N	4.60	t	2025-09-25 13:51:12.293047	2025-09-25 13:51:12.293047	2025-09-25 13:51:12.293047	\N	\N	\N	\N	\N
14	en	Mobile App Development	\N	\N	\N	Build cross-platform mobile applications with React Native.	\N	\N	\N	\N	16 weeks	60	\N	329.99	\N	App Development	\N	\N	4.80	t	2025-09-25 13:51:12.293568	2025-09-25 13:51:12.293568	2025-09-25 13:51:12.293568	\N	\N	\N	\N	\N
15	en	Cloud Computing with AWS	\N	\N	\N	Master AWS, Azure, and Google Cloud Platform.	\N	\N	\N	\N	6 weeks	30	\N	279.99	\N	Cloud Computing	\N	\N	4.50	t	2025-09-25 13:51:12.293975	2025-09-25 13:51:12.293975	2025-09-25 13:51:12.293975	\N	\N	\N	\N	\N
16	en	DevOps Fundamentals	\N	\N	\N	Learn CI/CD, containerization, and automation.	\N	\N	\N	\N	8 weeks	35	\N	259.99	\N	DevOps	\N	\N	4.40	t	2025-09-25 13:51:12.294691	2025-09-25 13:51:12.294691	2025-09-25 13:51:12.294691	\N	\N	\N	\N	\N
\.


--
-- Data for Name: entity_teachers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.entity_teachers (id, teacher_key, full_name, professional_title, company, bio, profile_image_url, skills, experience_history, courses_taught, student_reviews, statistics, contact_info, social_links, is_featured, display_order, is_active, created_at, updated_at, full_name_ru, professional_title_ru, company_ru, bio_ru, full_name_he, professional_title_he, company_he, bio_he) FROM stdin;
2	mike-johnson	Mike Johnson	Full-Stack Development Expert	WebCraft Studios	Frontend Lead at WebCraft Studios with 10+ years of commercial development experience. Specializes in teaching modern JavaScript, React, and full-stack development.	images/Course-Categories-Content-Bg.jpg	["JavaScript", "React", "Node.js", "TypeScript", "Full-Stack Development", "Web Performance"]	[{"title": "Frontend Lead", "company": "WebCraft Studios", "duration": "2019 - Present", "description": "Leading frontend development team and mentoring junior developers"}, {"title": "Senior Frontend Developer", "company": "Digital Agency Pro", "duration": "2016 - 2019", "description": "Built complex web applications using modern JavaScript frameworks"}]	[{"title": "Modern JavaScript Mastery", "rating": 4.7, "students": 420, "description": "Complete guide to ES6+ and modern JavaScript development"}, {"title": "React Development Bootcamp", "rating": 4.9, "students": 380, "description": "Build real-world applications with React and Redux"}]	[{"text": "Mike's practical approach to teaching React is outstanding. Real projects make all the difference.", "stars": "★★★★★", "author": "John D."}, {"text": "Finally understood JavaScript thanks to Mike's clear explanations.", "stars": "★★★★☆", "author": "Lisa P."}]	{"rating": 4.8, "courses_count": 15, "students_taught": 800, "years_experience": 10}	{"email": "mike@webcraft.studios", "phone": "+1-555-0124"}	{"github": "https://github.com/mikejohnson", "twitter": "https://twitter.com/mikejohnson_dev", "linkedin": "https://linkedin.com/in/mike-johnson-dev"}	t	2	t	2025-09-17 16:16:43.111845+03	2025-09-22 11:39:14.244377+03	Майк Джонсон	Эксперт по Full-Stack разработке	WebCraft Studio	Руководитель Frontend-разработки в WebCraft Studio с более чем 10-летним опытом коммерческой разработки.	מייק ג׳ונסון	מומחה פיתוח Full-Stack	WebCraft Studio	ראש צוות Frontend ב-WebCraft Studio עם ניסיון של 10+ שנים בפיתוח מסחרי.
4	david-park	David Park	Data Science Instructor	DataLearn Academy	Senior Data Scientist & Educator with 9+ years of commercial analytics experience. Passionate about teaching data science fundamentals through interactive workshops.	images/About-Us-Image.png	["Data Science", "Python", "R", "Machine Learning", "Statistics", "Data Visualization", "SQL"]	[{"title": "Senior Data Scientist", "company": "DataLearn Academy", "duration": "2020 - Present", "description": "Leading data science education and curriculum development"}, {"title": "Data Analyst", "company": "Analytics Pro", "duration": "2015 - 2020", "description": "Business analytics and data-driven decision making"}]	[{"title": "Data Science Fundamentals", "rating": 4.7, "students": 320, "description": "Complete introduction to data science with Python"}, {"title": "Advanced Analytics Workshop", "rating": 4.8, "students": 180, "description": "Advanced statistical analysis and machine learning"}]	[{"text": "David makes data science accessible and fun. Great real-world examples!", "stars": "★★★★☆", "author": "Sarah L."}, {"text": "Excellent instructor with deep knowledge and practical experience.", "stars": "★★★★★", "author": "Tom W."}]	{"rating": 4.75, "courses_count": 10, "students_taught": 500, "years_experience": 9}	{"email": "david@datalearn.academy", "phone": "+1-555-0126"}	{"github": "https://github.com/davidpark", "linkedin": "https://linkedin.com/in/david-park-data"}	t	4	t	2025-09-17 16:16:43.111845+03	2025-09-22 11:39:14.246083+03	Дэвид Парк	Преподаватель Data Science	DataLearn Academy	Старший специалист по данным и педагог с более чем 9-летним опытом коммерческой аналитики.	דיוויד פארק	מדריך מדע נתונים	DataLearn Academy	מדען נתונים בכיר ומחנך עם ניסיון של 9+ שנים באנליטיקה מסחרית.
10		ראג''''פטל	ארכיטקט פתרונות ענן ב-AWS	AWS	ארכיטקט פתרונות ענן ב-AWS המסייע לארגונים לעבור לענן. מומחה בארכיטקטורות serverless, תזמור containers ואסטרטגיות multi-cloud.	https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face	["AWS", "Serverless", "Multi-Cloud"]	[{"company": "AWS", "duration": "5 years", "position": "ארכיטקט פתרונות ענן ב-AWS", "description": "9+ שנות ניסיון"}, {"company": "Tech Industry", "duration": "3+ years", "position": "Software Developer", "description": "Real-world development experience before transitioning to teaching"}]	[{"name": "Introduction to AI & Machine Learning", "rating": 4.9, "students": 500, "course_id": "course_1", "completion_rate": 90}, {"name": "Advanced Web Development", "rating": 4.8, "students": 350, "course_id": "course_2", "completion_rate": 93}, {"name": "Data Science Fundamentals", "rating": 4.7, "students": 420, "course_id": "course_3", "completion_rate": 89}]	{"distribution": {"1": 0, "2": 0, "3": 4, "4": 10, "5": 35}, "total_reviews": 51, "average_rating": 4.8, "recent_reviews": [{"date": "2025-09-14T19:33:02.987Z", "rating": 5, "comment": "Excellent instructor with deep knowledge", "student": "Anonymous"}, {"date": "2025-09-07T19:33:02.987Z", "rating": 5, "comment": "Clear explanations and great support", "student": "Anonymous"}]}	{"rating": 4.8, "courses_count": 3, "response_time": "< 24 hours", "completion_rate": 95, "students_taught": 514, "years_experience": 5}	{"email": "@aistudio.com", "phone": "+1 (555) 123-4567"}	{"github": "https://github.com/", "twitter": "https://twitter.com/rajpatel", "linkedin": "https://linkedin.com/in/raj-patel"}	t	999	t	2025-09-21 22:33:02.995315+03	2025-09-21 22:33:02.995315+03	ראג''''פטל	ארכיטקט פתרונות ענן ב-AWS	AWS	ארכיטקט פתרונות ענן ב-AWS המסייע לארגונים לעבור לענן. מומחה בארכיטקטורות serverless, תזמור containers ואסטרטגיות multi-cloud.	ראג''''פטל	ארכיטקט פתרונות ענן ב-AWS	AWS	ארכיטקט פתרונות ענן ב-AWS המסייע לארגונים לעבור לענן. מומחה בארכיטקטורות serverless, תזמור containers ואסטרטגיות multi-cloud.
16	dr_michael_rodriguez	Dr. Michael Rodriguez	AI Research Scientist	OpenAI	Leading AI researcher focused on large language models and AGI safety. Published author with 50+ papers in top-tier conferences including NeurIPS and ICML.	https://lh3.googleusercontent.com/pw/ABLVV85rT9wGE7KHjDcG_XrZvHzHd8pF9Q3kJmLwN4xS8vYrR2fGHgQpWxB3E9sKt7JnMhYsUv6LxCzA4wRqE8nF=w400-h400-c	["Artificial Intelligence", "Large Language Models", "Research", "Python", "PyTorch"]	[{"company": "OpenAI", "duration": "10 years", "position": "AI Research Scientist", "description": "10+ years of commercial experience"}, {"company": "Tech Industry", "duration": "3+ years", "position": "Software Developer", "description": "Real-world development experience before transitioning to teaching"}]	[{"name": "Introduction to AI & Machine Learning", "rating": 4.9, "students": 500, "course_id": "course_1", "completion_rate": 90}, {"name": "Advanced Web Development", "rating": 4.8, "students": 350, "course_id": "course_2", "completion_rate": 91}, {"name": "Data Science Fundamentals", "rating": 4.7, "students": 420, "course_id": "course_3", "completion_rate": 91}]	{"distribution": {"1": 0, "2": 0, "3": 2, "4": 6, "5": 22}, "total_reviews": 32, "average_rating": 4.8, "recent_reviews": [{"date": "2025-09-14T19:33:03.013Z", "rating": 5, "comment": "Excellent instructor with deep knowledge", "student": "Anonymous"}, {"date": "2025-09-07T19:33:03.013Z", "rating": 5, "comment": "Clear explanations and great support", "student": "Anonymous"}]}	{"rating": 4.8, "courses_count": 3, "response_time": "< 24 hours", "completion_rate": 95, "students_taught": 338, "years_experience": 10}	{"email": "dr_michael_rodriguez@aistudio.com", "phone": "+1 (555) 123-4567"}	{"github": "https://github.com/mrodriguez", "twitter": null, "linkedin": "https://linkedin.com/in/michael-rodriguez-ai"}	t	2	t	2025-09-21 22:33:03.014054+03	2025-09-22 11:39:14.248065+03	Д-р Майкл Родригес	Научный сотрудник по ИИ	OpenAI	Научный сотрудник в OpenAI с 10+ годами опыта в передовых исследованиях ИИ.	ד"ר מייקל רודריגז	חוקר AI	OpenAI	חוקר ב-OpenAI עם ניסיון של 10+ שנים במחקר AI מתקדם.
18	david_kim	David Kim	Computer Vision Engineer	Tesla	Computer vision specialist working on autonomous driving systems at Tesla. Expert in real-time image processing, object detection, and deep learning for automotive applications.	https://lh3.googleusercontent.com/pw/ABLVV83nT9wGE7KHjDcG_XrZvHzHd8pF9Q3kJmLwN4xS8vYrR2fGHgQpWxB3E9sKt7JnMhYsUv6LxCzA4wRqE8nF=w400-h400-c	["Computer Vision", "Autonomous Driving", "Deep Learning", "C++", "Python"]	[{"company": "Tesla", "duration": "6 years", "position": "Computer Vision Engineer", "description": "6+ years of commercial experience"}, {"company": "Tech Industry", "duration": "3+ years", "position": "Software Developer", "description": "Real-world development experience before transitioning to teaching"}]	[{"name": "Introduction to AI & Machine Learning", "rating": 4.9, "students": 500, "course_id": "course_1", "completion_rate": 93}, {"name": "Advanced Web Development", "rating": 4.8, "students": 350, "course_id": "course_2", "completion_rate": 88}, {"name": "Data Science Fundamentals", "rating": 4.7, "students": 420, "course_id": "course_3", "completion_rate": 94}]	{"distribution": {"1": 0, "2": 0, "3": 3, "4": 8, "5": 30}, "total_reviews": 44, "average_rating": 4.8, "recent_reviews": [{"date": "2025-09-14T19:33:03.014Z", "rating": 5, "comment": "Excellent instructor with deep knowledge", "student": "Anonymous"}, {"date": "2025-09-07T19:33:03.014Z", "rating": 5, "comment": "Clear explanations and great support", "student": "Anonymous"}]}	{"rating": 4.8, "courses_count": 3, "response_time": "< 24 hours", "completion_rate": 95, "students_taught": 518, "years_experience": 6}	{"email": "david_kim@aistudio.com", "phone": "+1 (555) 123-4567"}	{"github": "https://github.com/davidkim", "twitter": null, "linkedin": "https://linkedin.com/in/david-kim-cv"}	t	4	t	2025-09-21 22:33:03.015278+03	2025-09-22 11:39:14.248829+03	Дэвид Ким	Архитектор блокчейн	Blockchain Ventures	Архитектор блокчейн с 6+ годами опыта в разработке децентрализованных приложений.	דיוויד קים	ארכיטקט בלוקצ׳יין	Blockchain Ventures	ארכיטקט בלוקצ׳יין עם ניסיון של 6+ שנים בפיתוח אפליקציות מבוזרות.
19	anna_kowalski	Anna Kowalski	Senior Software Engineer	Microsoft	Full-stack engineer with expertise in cloud-native applications and microservices architecture. Leads development of enterprise-scale solutions at Microsoft Azure.	https://lh3.googleusercontent.com/pw/ABLVV82oT9wGE7KHjDcG_XrZvHzHd8pF9Q3kJmLwN4xS8vYrR2fGHgQpWxB3E9sKt7JnMhYsUv6LxCzA4wRqE8nF=w400-h400-c	["Software Engineering", "Cloud Architecture", "Microservices", ".NET", "Azure"]	[{"company": "Microsoft", "duration": "7 years", "position": "Senior Software Engineer", "description": "7+ years of commercial experience"}, {"company": "Tech Industry", "duration": "3+ years", "position": "Software Developer", "description": "Real-world development experience before transitioning to teaching"}]	[{"name": "Introduction to AI & Machine Learning", "rating": 4.9, "students": 500, "course_id": "course_1", "completion_rate": 90}, {"name": "Advanced Web Development", "rating": 4.8, "students": 350, "course_id": "course_2", "completion_rate": 86}, {"name": "Data Science Fundamentals", "rating": 4.7, "students": 420, "course_id": "course_3", "completion_rate": 85}]	{"distribution": {"1": 0, "2": 0, "3": 3, "4": 9, "5": 31}, "total_reviews": 45, "average_rating": 4.8, "recent_reviews": [{"date": "2025-09-14T19:33:03.015Z", "rating": 5, "comment": "Excellent instructor with deep knowledge", "student": "Anonymous"}, {"date": "2025-09-07T19:33:03.015Z", "rating": 5, "comment": "Clear explanations and great support", "student": "Anonymous"}]}	{"rating": 4.8, "courses_count": 3, "response_time": "< 24 hours", "completion_rate": 95, "students_taught": 177, "years_experience": 7}	{"email": "anna_kowalski@aistudio.com", "phone": "+1 (555) 123-4567"}	{"github": "https://github.com/akowalski", "twitter": null, "linkedin": "https://linkedin.com/in/anna-kowalski"}	f	5	t	2025-09-21 22:33:03.015903+03	2025-09-22 11:39:14.249349+03	Анна Ковальски	Эксперт по DevOps	Netflix	Эксперт по DevOps в Netflix с 9+ годами опыта в автоматизации инфраструктуры.	אנה קובלסקי	מומחית DevOps	נטפליקס	מומחית DevOps בנטפליקס עם ניסיון של 9+ שנים באוטומציה של תשתיות.
20	dr_james_wilson	Dr. James Wilson	Principal Data Scientist	Amazon	Data science expert with 9+ years of experience in e-commerce analytics and machine learning. Leads data science initiatives for Amazon's recommendation and personalization systems.	https://lh3.googleusercontent.com/pw/ABLVV81pT9wGE7KHjDcG_XrZvHzHd8pF9Q3kJmLwN4xS8vYrR2fGHgQpWxB3E9sKt7JnMhYsUv6LxCzA4wRqE8nF=w400-h400-c	["Data Science", "Analytics", "Machine Learning", "Statistics", "SQL", "Python"]	[{"company": "Amazon", "duration": "9 years", "position": "Principal Data Scientist", "description": "9+ years of commercial experience"}, {"company": "Tech Industry", "duration": "3+ years", "position": "Software Developer", "description": "Real-world development experience before transitioning to teaching"}]	[{"name": "Introduction to AI & Machine Learning", "rating": 4.9, "students": 500, "course_id": "course_1", "completion_rate": 89}, {"name": "Advanced Web Development", "rating": 4.8, "students": 350, "course_id": "course_2", "completion_rate": 93}, {"name": "Data Science Fundamentals", "rating": 4.7, "students": 420, "course_id": "course_3", "completion_rate": 91}]	{"distribution": {"1": 0, "2": 0, "3": 2, "4": 6, "5": 23}, "total_reviews": 34, "average_rating": 4.8, "recent_reviews": [{"date": "2025-09-14T19:33:03.016Z", "rating": 5, "comment": "Excellent instructor with deep knowledge", "student": "Anonymous"}, {"date": "2025-09-07T19:33:03.016Z", "rating": 5, "comment": "Clear explanations and great support", "student": "Anonymous"}]}	{"rating": 4.8, "courses_count": 3, "response_time": "< 24 hours", "completion_rate": 95, "students_taught": 454, "years_experience": 9}	{"email": "dr_james_wilson@aistudio.com", "phone": "+1 (555) 123-4567"}	{"github": "https://github.com/jwilson", "twitter": null, "linkedin": "https://linkedin.com/in/james-wilson-ds"}	f	6	t	2025-09-21 22:33:03.01629+03	2025-09-22 11:39:14.249835+03	Д-р Джеймс Уилсон	Директор по ИИ	IBM Watson	Директор по ИИ в IBM Watson с 15+ годами опыта в корпоративных решениях ИИ.	ד"ר ג׳יימס וילסון	מנהל AI	IBM Watson	מנהל AI ב-IBM Watson עם ניסיון של 15+ שנים בפתרונות AI ארגוניים.
22	alex_thompson	Alex Thompson	Senior Backend Engineer	Slack	Backend engineering specialist with 11+ years of experience in distributed systems and real-time messaging platforms. Architect of Slack's core messaging infrastructure.	https://lh3.googleusercontent.com/pw/ABLVV87rT9wGE7KHjDcG_XrZvHzHd8pF9Q3kJmLwN4xS8vYrR2fGHgQpWxB3E9sKt7JnMhYsUv6LxCzA4wRqE8nF=w400-h400-c	["Backend Engineering", "Distributed Systems", "Real-time Systems", "Go", "Kubernetes"]	[{"company": "Slack", "duration": "11 years", "position": "Senior Backend Engineer", "description": "11+ years of commercial experience"}, {"company": "Tech Industry", "duration": "3+ years", "position": "Software Developer", "description": "Real-world development experience before transitioning to teaching"}]	[{"name": "Introduction to AI & Machine Learning", "rating": 4.9, "students": 500, "course_id": "course_1", "completion_rate": 86}, {"name": "Advanced Web Development", "rating": 4.8, "students": 350, "course_id": "course_2", "completion_rate": 86}, {"name": "Data Science Fundamentals", "rating": 4.7, "students": 420, "course_id": "course_3", "completion_rate": 88}]	{"distribution": {"1": 0, "2": 0, "3": 5, "4": 13, "5": 45}, "total_reviews": 65, "average_rating": 4.8, "recent_reviews": [{"date": "2025-09-14T19:33:03.016Z", "rating": 5, "comment": "Excellent instructor with deep knowledge", "student": "Anonymous"}, {"date": "2025-09-07T19:33:03.016Z", "rating": 5, "comment": "Clear explanations and great support", "student": "Anonymous"}]}	{"rating": 4.8, "courses_count": 3, "response_time": "< 24 hours", "completion_rate": 95, "students_taught": 249, "years_experience": 11}	{"email": "alex_thompson@aistudio.com", "phone": "+1 (555) 123-4567"}	{"github": "https://github.com/athompson", "twitter": null, "linkedin": "https://linkedin.com/in/alex-thompson-backend"}	f	8	t	2025-09-21 22:33:03.017123+03	2025-09-22 11:39:14.250712+03	Алекс Томпсон	Лид фронтенд-разработчик	Airbnb	Лид фронтенд-разработчик в Airbnb с 8+ годами опыта в создании масштабируемых интерфейсов.	אלכס תומפסון	ראש צוות Frontend	Airbnb	ראש צוות Frontend ב-Airbnb עם ניסיון של 8+ שנים ביצירת ממשקי משתמש.
23	lisa_zhang	Lisa Zhang	DevOps Architect	Twitter	DevOps expert with 8+ years of experience in cloud infrastructure and CI/CD pipelines. Designed and implemented Twitter's global deployment infrastructure serving billions of requests.	https://lh3.googleusercontent.com/pw/ABLVV86sT9wGE7KHjDcG_XrZvHzHd8pF9Q3kJmLwN4xS8vYrR2fGHgQpWxB3E9sKt7JnMhYsUv6LxCzA4wRqE8nF=w400-h400-c	["DevOps", "Cloud Infrastructure", "CI/CD", "Docker", "Kubernetes", "AWS"]	[{"company": "Twitter", "duration": "8 years", "position": "DevOps Architect", "description": "8+ years of commercial experience"}, {"company": "Tech Industry", "duration": "3+ years", "position": "Software Developer", "description": "Real-world development experience before transitioning to teaching"}]	[{"name": "Introduction to AI & Machine Learning", "rating": 4.9, "students": 500, "course_id": "course_1", "completion_rate": 94}, {"name": "Advanced Web Development", "rating": 4.8, "students": 350, "course_id": "course_2", "completion_rate": 91}, {"name": "Data Science Fundamentals", "rating": 4.7, "students": 420, "course_id": "course_3", "completion_rate": 87}]	{"distribution": {"1": 0, "2": 0, "3": 5, "4": 13, "5": 46}, "total_reviews": 67, "average_rating": 4.8, "recent_reviews": [{"date": "2025-09-14T19:33:03.017Z", "rating": 5, "comment": "Excellent instructor with deep knowledge", "student": "Anonymous"}, {"date": "2025-09-07T19:33:03.017Z", "rating": 5, "comment": "Clear explanations and great support", "student": "Anonymous"}]}	{"rating": 4.8, "courses_count": 3, "response_time": "< 24 hours", "completion_rate": 95, "students_taught": 361, "years_experience": 8}	{"email": "lisa_zhang@aistudio.com", "phone": "+1 (555) 123-4567"}	{"github": "https://github.com/lzhang", "twitter": null, "linkedin": "https://linkedin.com/in/lisa-zhang-devops"}	f	9	t	2025-09-21 22:33:03.017479+03	2025-09-22 11:39:14.251125+03	Лиза Браун	Архитектор облачных решений	AWS	Архитектор облачных решений в AWS с 11+ годами опыта.	ליסה בראון	ארכיטקט פתרונות ענן	AWS	ארכיטקט פתרונות ענן ב-AWS עם ניסיון של 11+ שנים.
24	robert_johnson	Robert Johnson	UX Design Lead	Apple	UX design leader with 7+ years of experience creating intuitive user experiences for consumer products. Led design teams for major Apple product launches including iOS and macOS features.	https://lh3.googleusercontent.com/pw/ABLVV85tT9wGE7KHjDcG_XrZvHzHd8pF9Q3kJmLwN4xS8vYrR2fGHgQpWxB3E9sKt7JnMhYsUv6LxCzA4wRqE8nF=w400-h400-c	["UX Design", "User Research", "Prototyping", "Design Systems", "iOS Design"]	[{"company": "Apple", "duration": "7 years", "position": "UX Design Lead", "description": "7+ years of commercial experience"}, {"company": "Tech Industry", "duration": "3+ years", "position": "Software Developer", "description": "Real-world development experience before transitioning to teaching"}]	[{"name": "Introduction to AI & Machine Learning", "rating": 4.9, "students": 500, "course_id": "course_1", "completion_rate": 89}, {"name": "Advanced Web Development", "rating": 4.8, "students": 350, "course_id": "course_2", "completion_rate": 94}, {"name": "Data Science Fundamentals", "rating": 4.7, "students": 420, "course_id": "course_3", "completion_rate": 86}]	{"distribution": {"1": 0, "2": 0, "3": 2, "4": 5, "5": 17}, "total_reviews": 25, "average_rating": 4.8, "recent_reviews": [{"date": "2025-09-14T19:33:03.017Z", "rating": 5, "comment": "Excellent instructor with deep knowledge", "student": "Anonymous"}, {"date": "2025-09-07T19:33:03.017Z", "rating": 5, "comment": "Clear explanations and great support", "student": "Anonymous"}]}	{"rating": 4.8, "courses_count": 3, "response_time": "< 24 hours", "completion_rate": 95, "students_taught": 531, "years_experience": 7}	{"email": "robert_johnson@aistudio.com", "phone": "+1 (555) 123-4567"}	{"github": "https://github.com/rjohnson", "twitter": null, "linkedin": "https://linkedin.com/in/robert-johnson-ux"}	f	10	t	2025-09-21 22:33:03.017889+03	2025-09-22 11:39:14.251544+03	Роберт Джонсон	Менеджер продукта ИИ	Tesla	Менеджер продукта ИИ в Tesla с 7+ годами опыта.	רוברט ג׳ונסון	מנהל מוצר AI	טסלה	מנהל מוצר AI בטסלה עם ניסיון של 7+ שנים.
27	jennifer_wu	Jennifer Wu	Technical Program Manager	GitHub	Technical program manager with 8+ years of experience leading cross-functional engineering initiatives. Manages large-scale platform development projects at GitHub serving 100+ million developers.	https://lh3.googleusercontent.com/pw/ABLVV82wT9wGE7KHjDcG_XrZvHzHd8pF9Q3kJmLwN4xS8vYrR2fGHgQpWxB3E9sKt7JnMhYsUv6LxCzA4wRqE8nF=w400-h400-c	["Program Management", "Cross-functional Leadership", "Platform Development", "Agile"]	[{"company": "GitHub", "duration": "8 years", "position": "Technical Program Manager", "description": "8+ years of commercial experience"}, {"company": "Tech Industry", "duration": "3+ years", "position": "Software Developer", "description": "Real-world development experience before transitioning to teaching"}]	[{"name": "Introduction to AI & Machine Learning", "rating": 4.9, "students": 500, "course_id": "course_1", "completion_rate": 86}, {"name": "Advanced Web Development", "rating": 4.8, "students": 350, "course_id": "course_2", "completion_rate": 88}, {"name": "Data Science Fundamentals", "rating": 4.7, "students": 420, "course_id": "course_3", "completion_rate": 88}]	{"distribution": {"1": 0, "2": 0, "3": 3, "4": 8, "5": 30}, "total_reviews": 44, "average_rating": 4.8, "recent_reviews": [{"date": "2025-09-14T19:33:03.018Z", "rating": 5, "comment": "Excellent instructor with deep knowledge", "student": "Anonymous"}, {"date": "2025-09-07T19:33:03.018Z", "rating": 5, "comment": "Clear explanations and great support", "student": "Anonymous"}]}	{"rating": 4.8, "courses_count": 3, "response_time": "< 24 hours", "completion_rate": 95, "students_taught": 299, "years_experience": 8}	{"email": "jennifer_wu@aistudio.com", "phone": "+1 (555) 123-4567"}	{"github": "https://github.com/jwu", "twitter": null, "linkedin": "https://linkedin.com/in/jennifer-wu-tpm"}	f	13	t	2025-09-21 22:33:03.019121+03	2025-09-21 22:33:03.019121+03	Jennifer Wu	Technical Program Manager	GitHub	Technical program manager with 8+ years of experience leading cross-functional engineering initiatives. Manages large-scale platform development projects at GitHub serving 100+ million developers.	Jennifer Wu	Technical Program Manager	GitHub	Technical program manager with 8+ years of experience leading cross-functional engineering initiatives. Manages large-scale platform development projects at GitHub serving 100+ million developers.
28	marcus_brown	Marcus Brown	Product Manager	Salesforce	Product management expert with 10+ years of experience in enterprise software and CRM platforms. Leads product strategy for Salesforce's core CRM features used by millions of businesses.	https://lh3.googleusercontent.com/pw/ABLVV81xT9wGE7KHjDcG_XrZvHzHd8pF9Q3kJmLwN4xS8vYrR2fGHgQpWxB3E9sKt7JnMhYsUv6LxCzA4wRqE8nF=w400-h400-c	["Product Management", "Enterprise Software", "CRM", "Strategy", "User Research"]	[{"company": "Salesforce", "duration": "10 years", "position": "Product Manager", "description": "10+ years of commercial experience"}, {"company": "Tech Industry", "duration": "3+ years", "position": "Software Developer", "description": "Real-world development experience before transitioning to teaching"}]	[{"name": "Introduction to AI & Machine Learning", "rating": 4.9, "students": 500, "course_id": "course_1", "completion_rate": 90}, {"name": "Advanced Web Development", "rating": 4.8, "students": 350, "course_id": "course_2", "completion_rate": 90}, {"name": "Data Science Fundamentals", "rating": 4.7, "students": 420, "course_id": "course_3", "completion_rate": 87}]	{"distribution": {"1": 0, "2": 0, "3": 3, "4": 7, "5": 26}, "total_reviews": 38, "average_rating": 4.8, "recent_reviews": [{"date": "2025-09-14T19:33:03.019Z", "rating": 5, "comment": "Excellent instructor with deep knowledge", "student": "Anonymous"}, {"date": "2025-09-07T19:33:03.019Z", "rating": 5, "comment": "Clear explanations and great support", "student": "Anonymous"}]}	{"rating": 4.8, "courses_count": 3, "response_time": "< 24 hours", "completion_rate": 95, "students_taught": 266, "years_experience": 10}	{"email": "marcus_brown@aistudio.com", "phone": "+1 (555) 123-4567"}	{"github": "https://github.com/mbrown", "twitter": null, "linkedin": "https://linkedin.com/in/marcus-brown-pm"}	f	14	t	2025-09-21 22:33:03.019455+03	2025-09-21 22:33:03.019455+03	Marcus Brown	Product Manager	Salesforce	Product management expert with 10+ years of experience in enterprise software and CRM platforms. Leads product strategy for Salesforce's core CRM features used by millions of businesses.	Marcus Brown	Product Manager	Salesforce	Product management expert with 10+ years of experience in enterprise software and CRM platforms. Leads product strategy for Salesforce's core CRM features used by millions of businesses.
26	raj_patel	Raj Patel	Engineering Manager	AWS	Engineering leader with 9+ years of experience managing high-performing technical teams. Oversees cloud infrastructure services at AWS serving millions of customers globally.	https://lh3.googleusercontent.com/pw/ABLVV83vT9wGE7KHjDcG_XrZvHzHd8pF9Q3kJmLwN4xS8vYrR2fGHgQpWxB3E9sKt7JnMhYsUv6LxCzA4wRqE8nF=w400-h400-c	["Engineering Management", "Team Leadership", "Cloud Services", "Agile", "Strategy"]	[{"company": "AWS", "duration": "9 years", "position": "Engineering Manager", "description": "9+ years of commercial experience"}, {"company": "Tech Industry", "duration": "3+ years", "position": "Software Developer", "description": "Real-world development experience before transitioning to teaching"}]	[{"name": "Introduction to AI & Machine Learning", "rating": 4.9, "students": 500, "course_id": "course_1", "completion_rate": 88}, {"name": "Advanced Web Development", "rating": 4.8, "students": 350, "course_id": "course_2", "completion_rate": 93}, {"name": "Data Science Fundamentals", "rating": 4.7, "students": 420, "course_id": "course_3", "completion_rate": 91}]	{"distribution": {"1": 0, "2": 0, "3": 3, "4": 9, "5": 34}, "total_reviews": 49, "average_rating": 4.8, "recent_reviews": [{"date": "2025-09-14T19:33:03.018Z", "rating": 5, "comment": "Excellent instructor with deep knowledge", "student": "Anonymous"}, {"date": "2025-09-07T19:33:03.018Z", "rating": 5, "comment": "Clear explanations and great support", "student": "Anonymous"}]}	{"rating": 4.8, "courses_count": 3, "response_time": "< 24 hours", "completion_rate": 95, "students_taught": 227, "years_experience": 9}	{"email": "raj_patel@aistudio.com", "phone": "+1 (555) 123-4567"}	{"github": "https://github.com/rpatel", "twitter": null, "linkedin": "https://linkedin.com/in/raj-patel-manager"}	f	12	t	2025-09-21 22:33:03.018767+03	2025-09-22 11:39:14.252323+03	Томас Андерсон	Инженер по глубокому обучению	NVIDIA	Инженер по глубокому обучению в NVIDIA с 9+ годами опыта.	תומס אנדרסון	מהנדס למידה עמוקה	NVIDIA	מהנדס למידה עמוקה ב-NVIDIA עם ניסיון של 9+ שנים.
29	sarah_kim	Sarah Kim	Senior Product Manager	Airbnb	Senior product manager with 7+ years of experience in marketplace platforms and user experience optimization. Drives product innovation for Airbnb's host and guest experiences.	https://lh3.googleusercontent.com/pw/ABLVV80yT9wGE7KHjDcG_XrZvHzHd8pF9Q3kJmLwN4xS8vYrR2fGHgQpWxB3E9sKt7JnMhYsUv6LxCzA4wRqE8nF=w400-h400-c	["Product Management", "Marketplace Platforms", "User Experience", "Growth", "Analytics"]	[{"company": "Airbnb", "duration": "7 years", "position": "Senior Product Manager", "description": "7+ years of commercial experience"}, {"company": "Tech Industry", "duration": "3+ years", "position": "Software Developer", "description": "Real-world development experience before transitioning to teaching"}]	[{"name": "Introduction to AI & Machine Learning", "rating": 4.9, "students": 500, "course_id": "course_1", "completion_rate": 87}, {"name": "Advanced Web Development", "rating": 4.8, "students": 350, "course_id": "course_2", "completion_rate": 90}, {"name": "Data Science Fundamentals", "rating": 4.7, "students": 420, "course_id": "course_3", "completion_rate": 93}]	{"distribution": {"1": 0, "2": 0, "3": 3, "4": 9, "5": 33}, "total_reviews": 48, "average_rating": 4.8, "recent_reviews": [{"date": "2025-09-14T19:33:03.019Z", "rating": 5, "comment": "Excellent instructor with deep knowledge", "student": "Anonymous"}, {"date": "2025-09-07T19:33:03.019Z", "rating": 5, "comment": "Clear explanations and great support", "student": "Anonymous"}]}	{"rating": 4.8, "courses_count": 3, "response_time": "< 24 hours", "completion_rate": 95, "students_taught": 183, "years_experience": 7}	{"email": "sarah_kim@aistudio.com", "phone": "+1 (555) 123-4567"}	{"github": "https://github.com/skim", "twitter": null, "linkedin": "https://linkedin.com/in/sarah-kim-pm"}	f	15	t	2025-09-21 22:33:03.019775+03	2025-09-21 22:33:03.019775+03	Sarah Kim	Senior Product Manager	Airbnb	Senior product manager with 7+ years of experience in marketplace platforms and user experience optimization. Drives product innovation for Airbnb's host and guest experiences.	Sarah Kim	Senior Product Manager	Airbnb	Senior product manager with 7+ years of experience in marketplace platforms and user experience optimization. Drives product innovation for Airbnb's host and guest experiences.
30	emma_davis	Emma Davis	Principal Designer	Adobe	Principal designer with 9+ years of experience in creative software and design tools. Leads design vision for Adobe Creative Suite features used by millions of creative professionals worldwide.	https://lh3.googleusercontent.com/pw/ABLVV87zT9wGE7KHjDcG_XrZvHzHd8pF9Q3kJmLwN4xS8vYrR2fGHgQpWxB3E9sKt7JnMhYsUv6LxCzA4wRqE8nF=w400-h400-c	["Design Leadership", "Creative Software", "Design Systems", "User Experience", "Visual Design"]	[{"company": "Adobe", "duration": "9 years", "position": "Principal Designer", "description": "9+ years of commercial experience"}, {"company": "Tech Industry", "duration": "3+ years", "position": "Software Developer", "description": "Real-world development experience before transitioning to teaching"}]	[{"name": "Introduction to AI & Machine Learning", "rating": 4.9, "students": 500, "course_id": "course_1", "completion_rate": 88}, {"name": "Advanced Web Development", "rating": 4.8, "students": 350, "course_id": "course_2", "completion_rate": 86}, {"name": "Data Science Fundamentals", "rating": 4.7, "students": 420, "course_id": "course_3", "completion_rate": 88}]	{"distribution": {"1": 0, "2": 0, "3": 4, "4": 11, "5": 39}, "total_reviews": 56, "average_rating": 4.8, "recent_reviews": [{"date": "2025-09-14T19:33:03.020Z", "rating": 5, "comment": "Excellent instructor with deep knowledge", "student": "Anonymous"}, {"date": "2025-09-07T19:33:03.020Z", "rating": 5, "comment": "Clear explanations and great support", "student": "Anonymous"}]}	{"rating": 4.8, "courses_count": 3, "response_time": "< 24 hours", "completion_rate": 95, "students_taught": 112, "years_experience": 9}	{"email": "emma_davis@aistudio.com", "phone": "+1 (555) 123-4567"}	{"github": "https://github.com/edavis", "twitter": null, "linkedin": "https://linkedin.com/in/emma-davis-design"}	f	16	t	2025-09-21 22:33:03.020513+03	2025-09-21 22:33:03.020513+03	Emma Davis	Principal Designer	Adobe	Principal designer with 9+ years of experience in creative software and design tools. Leads design vision for Adobe Creative Suite features used by millions of creative professionals worldwide.	Emma Davis	Principal Designer	Adobe	Principal designer with 9+ years of experience in creative software and design tools. Leads design vision for Adobe Creative Suite features used by millions of creative professionals worldwide.
1	sarah-chen	Sarah Chen	AI & Machine Learning Expert	TechEd Solutions	Co-founder & AI Lead at TechEd Solutions with 8+ years of commercial AI development experience. Expert in teaching complex machine learning concepts through practical, hands-on projects.	images/CTA-Section-Bg.jpg	["Machine Learning", "Deep Learning", "Python", "TensorFlow", "AI Ethics", "Data Science"]	[{"title": "AI Lead", "company": "TechEd Solutions", "duration": "2020 - Present", "description": "Leading AI development team and educational initiatives"}, {"title": "Senior ML Engineer", "company": "DataCorp Inc", "duration": "2018 - 2020", "description": "Developed machine learning models for production systems"}]	[{"title": "Complete Machine Learning Course", "rating": 4.8, "students": 350, "description": "Comprehensive ML course covering theory and practice"}, {"title": "Deep Learning Fundamentals", "rating": 4.9, "students": 220, "description": "Introduction to neural networks and deep learning"}]	[{"text": "Sarah's teaching style is exceptional. Complex concepts become easy to understand.", "stars": "★★★★★", "author": "Alex M."}, {"text": "Best AI instructor I've ever had. Practical examples are incredibly valuable.", "stars": "★★★★★", "author": "Maria K."}]	{"rating": 4.8, "courses_count": 12, "students_taught": 570, "years_experience": 8}	{"email": "sarah@teched.solutions", "phone": "+1-555-0123"}	{"github": "https://github.com/sarahchen", "twitter": "https://twitter.com/sarahchen_ai", "linkedin": "https://linkedin.com/in/sarah-chen-ai"}	t	1	t	2025-09-17 16:16:43.111845+03	2025-09-22 11:39:14.240212+03	Сара Чен	Эксперт по ИИ и машинному обучению	TechEd Solutions	Соучредитель и руководитель отдела ИИ в TechEd Solutions с более чем 8-летним опытом коммерческой разработки ИИ. Эксперт в обучении сложным концепциям машинного обучения через практические проекты.	שרה צ׳ן	מומחית AI ולמידת מכונה	TechEd Solutions	שותפה מייסדת ומובילת AI ב-TechEd Solutions עם ניסיון של 8+ שנים בפיתוח AI מסחרי. מומחית בהוראת מושגים מורכבים של למידת מכונה דרך פרויקטים מעשיים.
3	emily-rodriguez	Emily Rodriguez	Career Transition Coach	CareerPath Pro	Software Engineer & Career Mentor with 7+ years of commercial development experience. Expert in guiding career changers through structured learning paths.	images/About-Me-Image.jpg	["Career Coaching", "Software Development", "Mentoring", "Project Management", "Technical Leadership"]	[{"title": "Senior Career Coach", "company": "CareerPath Pro", "duration": "2021 - Present", "description": "Helping professionals transition into tech careers"}, {"title": "Software Engineer", "company": "TechStart Inc", "duration": "2017 - 2021", "description": "Full-stack development and team leadership"}]	[{"title": "Career Change Bootcamp", "rating": 4.9, "students": 250, "description": "Complete guide to transitioning into tech careers"}, {"title": "Professional Development Workshop", "rating": 4.8, "students": 180, "description": "Skills and strategies for career advancement"}]	[{"text": "Emily helped me successfully transition from marketing to software development. Incredible mentor!", "stars": "★★★★★", "author": "David R."}, {"text": "The career guidance and practical advice were exactly what I needed.", "stars": "★★★★★", "author": "Rachel T."}]	{"rating": 4.85, "courses_count": 8, "students_taught": 430, "years_experience": 7}	{"email": "emily@careerpath.pro", "phone": "+1-555-0125"}	{"twitter": "https://twitter.com/emily_career_coach", "linkedin": "https://linkedin.com/in/emily-rodriguez-coach"}	t	3	t	2025-09-17 16:16:43.111845+03	2025-09-22 11:39:14.245123+03	Эмили Родригес	Коуч по смене карьеры	CareerPath Pro	Сертифицированный коуч с 7+ годами опыта помощи профессионалам в переходе в технологическую индустрию. Специализируется на карьерных стратегиях для ИИ и науки о данных.	אמילי רודריגז	מאמנת מעבר קריירה	CareerPath Pro	מאמנת מוסמכת עם ניסיון של 7+ שנים בסיוע למקצוענים במעבר לתעשיית הטכנולוגיה. מתמחה באסטרטגיות קריירה ל-AI ומדע נתונים.
5	_	אנה קובלסקי	מהנדסת NLP במיקרוסופט	Microsoft	מהנדסת NLP מובילה במיקרוסופט העובדת על Azure Cognitive Services. מומחית בארכיטקטורות טרנספורמר, מודלים רב-לשוניים ו-AI שיחתי.	https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face	["Transformers", "BERT", "Conversational AI"]	[{"company": "Microsoft", "duration": "5 years", "position": "מהנדסת NLP במיקרוסופט", "description": "7+ שנות ניסיון"}, {"company": "Tech Industry", "duration": "3+ years", "position": "Software Developer", "description": "Real-world development experience before transitioning to teaching"}]	[{"name": "Introduction to AI & Machine Learning", "rating": 4.9, "students": 500, "course_id": "course_1", "completion_rate": 91}, {"name": "Advanced Web Development", "rating": 4.8, "students": 350, "course_id": "course_2", "completion_rate": 87}, {"name": "Data Science Fundamentals", "rating": 4.7, "students": 420, "course_id": "course_3", "completion_rate": 92}]	{"distribution": {"1": 0, "2": 0, "3": 2, "4": 6, "5": 21}, "total_reviews": 31, "average_rating": 4.8, "recent_reviews": [{"date": "2025-09-14T19:33:02.959Z", "rating": 5, "comment": "Excellent instructor with deep knowledge", "student": "Anonymous"}, {"date": "2025-09-07T19:33:02.959Z", "rating": 5, "comment": "Clear explanations and great support", "student": "Anonymous"}]}	{"rating": 4.8, "courses_count": 3, "response_time": "< 24 hours", "completion_rate": 95, "students_taught": 201, "years_experience": 5}	{"email": "_@aistudio.com", "phone": "+1 (555) 123-4567"}	{"github": "https://github.com/_", "twitter": "https://twitter.com/annakowalski", "linkedin": "https://linkedin.com/in/anna-kowalski"}	t	999	t	2025-09-21 22:33:02.961852+03	2025-09-22 11:39:14.246633+03	Линда Джексон	Руководитель по науке о данных	Amazon	Руководитель по науке о данных в Amazon с 15+ годами опыта в аналитике и машинном обучении. Руководит командой из 20+ специалистов по данным.	לינדה ג׳קסון	ראש מדע נתונים	אמזון	ראש מדע נתונים באמזון עם ניסיון של 15+ שנים באנליטיקה ולמידת מכונה. מנהלת צוות של 20+ מומחי נתונים.
15	dr_sarah_chen	Dr. Sarah Chen	Senior ML Engineer	Google	Expert in machine learning and deep neural networks with 8+ years of experience in production ML systems. Specializes in computer vision and natural language processing applications at Google.	https://lh3.googleusercontent.com/pw/ABLVV86TN2wGE7KHjDcG_XrZvHzHd8pF9Q3kJmLwN4xS8vYrR2fGHgQpWxB3E9sKt7JnMhYsUv6LxCzA4wRqE8nF=w400-h400-c	["Machine Learning", "Deep Learning", "Neural Networks", "Python", "TensorFlow", "Computer Vision"]	[{"company": "Google", "duration": "8 years", "position": "Senior ML Engineer", "description": "8+ years of commercial experience"}, {"company": "Tech Industry", "duration": "3+ years", "position": "Software Developer", "description": "Real-world development experience before transitioning to teaching"}]	[{"name": "Introduction to AI & Machine Learning", "rating": 4.9, "students": 500, "course_id": "course_1", "completion_rate": 87}, {"name": "Advanced Web Development", "rating": 4.8, "students": 350, "course_id": "course_2", "completion_rate": 88}, {"name": "Data Science Fundamentals", "rating": 4.7, "students": 420, "course_id": "course_3", "completion_rate": 85}]	{"distribution": {"1": 0, "2": 0, "3": 4, "4": 10, "5": 37}, "total_reviews": 53, "average_rating": 4.8, "recent_reviews": [{"date": "2025-09-14T19:33:03.010Z", "rating": 5, "comment": "Excellent instructor with deep knowledge", "student": "Anonymous"}, {"date": "2025-09-07T19:33:03.010Z", "rating": 5, "comment": "Clear explanations and great support", "student": "Anonymous"}]}	{"rating": 4.8, "courses_count": 3, "response_time": "< 24 hours", "completion_rate": 95, "students_taught": 300, "years_experience": 8}	{"email": "dr_sarah_chen@aistudio.com", "phone": "+1 (555) 123-4567"}	{"github": "https://github.com/sarahchen", "twitter": null, "linkedin": "https://linkedin.com/in/sarah-chen-ml"}	t	1	t	2025-09-21 22:33:03.01331+03	2025-09-22 11:39:14.2474+03	Д-р Сара Чен	Старший инженер машинного обучения	Google	Старший инженер по машинному обучению в Google с 8+ годами опыта в разработке масштабируемых решений ИИ.	ד"ר שרה צ׳ן	מהנדסת למידת מכונה בכירה	גוגל	מהנדסת למידת מכונה בכירה בגוגל עם ניסיון של 8+ שנים בפיתוח פתרונות AI בקנה מידה גדול.
17	dr_elena_petrov	Dr. Elena Petrov	Head of Data Science	Meta	Data science leader with 12+ years experience building ML systems at scale. Leads a team of 30+ data scientists working on recommendation systems and user engagement.	https://lh3.googleusercontent.com/pw/ABLVV84mT9wGE7KHjDcG_XrZvHzHd8pF9Q3kJmLwN4xS8vYrR2fGHgQpWxB3E9sKt7JnMhYsUv6LxCzA4wRqE8nF=w400-h400-c	["Data Science", "Machine Learning", "Recommendation Systems", "Leadership", "Scale"]	[{"company": "Meta", "duration": "12 years", "position": "Head of Data Science", "description": "12+ years of commercial experience"}, {"company": "Tech Industry", "duration": "3+ years", "position": "Software Developer", "description": "Real-world development experience before transitioning to teaching"}]	[{"name": "Introduction to AI & Machine Learning", "rating": 4.9, "students": 500, "course_id": "course_1", "completion_rate": 87}, {"name": "Advanced Web Development", "rating": 4.8, "students": 350, "course_id": "course_2", "completion_rate": 85}, {"name": "Data Science Fundamentals", "rating": 4.7, "students": 420, "course_id": "course_3", "completion_rate": 91}]	{"distribution": {"1": 0, "2": 0, "3": 1, "4": 4, "5": 15}, "total_reviews": 22, "average_rating": 4.8, "recent_reviews": [{"date": "2025-09-14T19:33:03.014Z", "rating": 5, "comment": "Excellent instructor with deep knowledge", "student": "Anonymous"}, {"date": "2025-09-07T19:33:03.014Z", "rating": 5, "comment": "Clear explanations and great support", "student": "Anonymous"}]}	{"rating": 4.8, "courses_count": 3, "response_time": "< 24 hours", "completion_rate": 95, "students_taught": 509, "years_experience": 12}	{"email": "dr_elena_petrov@aistudio.com", "phone": "+1 (555) 123-4567"}	{"github": "https://github.com/epetrov", "twitter": null, "linkedin": "https://linkedin.com/in/elena-petrov"}	t	3	t	2025-09-21 22:33:03.01455+03	2025-09-22 11:39:14.248395+03	Д-р Елена Петров	Главный специалист по данным	Microsoft	Главный специалист по данным в Microsoft с 12+ годами опыта в аналитике больших данных.	ד"ר אלנה פטרוב	ראש מדע נתונים	מיקרוסופט	ראש מדע נתונים במיקרוסופט עם ניסיון של 12+ שנים באנליטיקה של נתונים גדולים.
21	maria_santos	Maria Santos	Data Analytics Lead	Stripe	Analytics leader specializing in financial data and fraud detection systems. Builds data-driven solutions for payment processing and risk management at Stripe.	https://lh3.googleusercontent.com/pw/ABLVV80qT9wGE7KHjDcG_XrZvHzHd8pF9Q3kJmLwN4xS8vYrR2fGHgQpWxB3E9sKt7JnMhYsUv6LxCzA4wRqE8nF=w400-h400-c	["Data Analytics", "Financial Data", "Fraud Detection", "SQL", "Python", "Tableau"]	[{"company": "Stripe", "duration": "5 years", "position": "Data Analytics Lead", "description": "5+ years of commercial experience"}, {"company": "Tech Industry", "duration": "3+ years", "position": "Software Developer", "description": "Real-world development experience before transitioning to teaching"}]	[{"name": "Introduction to AI & Machine Learning", "rating": 4.9, "students": 500, "course_id": "course_1", "completion_rate": 91}, {"name": "Advanced Web Development", "rating": 4.8, "students": 350, "course_id": "course_2", "completion_rate": 93}, {"name": "Data Science Fundamentals", "rating": 4.7, "students": 420, "course_id": "course_3", "completion_rate": 92}]	{"distribution": {"1": 0, "2": 0, "3": 4, "4": 11, "5": 41}, "total_reviews": 59, "average_rating": 4.8, "recent_reviews": [{"date": "2025-09-14T19:33:03.016Z", "rating": 5, "comment": "Excellent instructor with deep knowledge", "student": "Anonymous"}, {"date": "2025-09-07T19:33:03.016Z", "rating": 5, "comment": "Clear explanations and great support", "student": "Anonymous"}]}	{"rating": 4.8, "courses_count": 3, "response_time": "< 24 hours", "completion_rate": 95, "students_taught": 180, "years_experience": 5}	{"email": "maria_santos@aistudio.com", "phone": "+1 (555) 123-4567"}	{"github": "https://github.com/msantos", "twitter": null, "linkedin": "https://linkedin.com/in/maria-santos-analytics"}	f	7	t	2025-09-21 22:33:03.01669+03	2025-09-22 11:39:14.250265+03	Мария Сантос	Эксперт по кибербезопасности	Cisco	Эксперт по кибербезопасности в Cisco с 10+ годами опыта в защите корпоративных сетей.	מריה סנטוס	מומחית אבטחת סייבר	סיסקו	מומחית אבטחת סייבר בסיסקו עם ניסיון של 10+ שנים בהגנה על רשתות ארגוניות.
25	sofia_andersson	Sofia Andersson	Product Designer	Spotify	Product designer with 6+ years of experience in digital product design and user interface development. Designs engaging music discovery experiences for Spotify's 400+ million users.	https://lh3.googleusercontent.com/pw/ABLVV84uT9wGE7KHjDcG_XrZvHzHd8pF9Q3kJmLwN4xS8vYrR2fGHgQpWxB3E9sKt7JnMhYsUv6LxCzA4wRqE8nF=w400-h400-c	["Product Design", "UI Design", "User Interface", "Design Systems", "Prototyping"]	[{"company": "Spotify", "duration": "6 years", "position": "Product Designer", "description": "6+ years of commercial experience"}, {"company": "Tech Industry", "duration": "3+ years", "position": "Software Developer", "description": "Real-world development experience before transitioning to teaching"}]	[{"name": "Introduction to AI & Machine Learning", "rating": 4.9, "students": 500, "course_id": "course_1", "completion_rate": 93}, {"name": "Advanced Web Development", "rating": 4.8, "students": 350, "course_id": "course_2", "completion_rate": 85}, {"name": "Data Science Fundamentals", "rating": 4.7, "students": 420, "course_id": "course_3", "completion_rate": 93}]	{"distribution": {"1": 0, "2": 0, "3": 3, "4": 8, "5": 28}, "total_reviews": 41, "average_rating": 4.8, "recent_reviews": [{"date": "2025-09-14T19:33:03.018Z", "rating": 5, "comment": "Excellent instructor with deep knowledge", "student": "Anonymous"}, {"date": "2025-09-07T19:33:03.018Z", "rating": 5, "comment": "Clear explanations and great support", "student": "Anonymous"}]}	{"rating": 4.8, "courses_count": 3, "response_time": "< 24 hours", "completion_rate": 95, "students_taught": 398, "years_experience": 6}	{"email": "sofia_andersson@aistudio.com", "phone": "+1 (555) 123-4567"}	{"github": "https://github.com/sandersson", "twitter": null, "linkedin": "https://linkedin.com/in/sofia-andersson-design"}	f	11	t	2025-09-21 22:33:03.0184+03	2025-09-22 11:39:14.251819+03	Софи Мартин	Исследователь UX	Spotify	Исследователь UX в Spotify с 6+ годами опыта.	סופי מרטין	חוקרת UX	ספוטיפיי	חוקרת UX בספוטיפיי עם ניסיון של 6+ שנים.
\.


--
-- Data for Name: faqs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.faqs (id, locale, question, answer, category, "order", published_at, created_at, updated_at) FROM stdin;
1	en	How do I enroll in a course?	Simply browse our course catalog, select your desired course, and click "Enroll Now". You can pay securely with credit card or PayPal.	General	1	2025-09-15 01:56:43.266957	2025-09-15 01:56:43.266957	2025-09-15 01:56:43.266957
2	en	What is included in the course fee?	Your course fee includes lifetime access to all course materials, video lessons, assignments, and community support.	Courses	2	2025-09-15 01:56:43.267264	2025-09-15 01:56:43.267264	2025-09-15 01:56:43.267264
3	en	Do you offer certificates?	Yes! Upon successful completion of any course, you will receive an industry-recognized certificate that you can add to your LinkedIn profile.	Courses	3	2025-09-15 01:56:43.267441	2025-09-15 01:56:43.267441	2025-09-15 01:56:43.267441
4	en	What payment methods do you accept?	We accept all major credit cards, PayPal, and offer installment plans for courses over $200.	Payment	4	2025-09-15 01:56:43.267625	2025-09-15 01:56:43.267625	2025-09-15 01:56:43.267625
5	ru	Как записаться на курс?	Просто просмотрите каталог курсов, выберите желаемый курс и нажмите "Записаться сейчас". Вы можете безопасно оплатить картой или через PayPal.	Общее	1	2025-09-15 01:56:43.26782	2025-09-15 01:56:43.26782	2025-09-15 01:56:43.26782
6	ru	Что включено в стоимость курса?	Стоимость курса включает пожизненный доступ ко всем материалам, видео урокам, заданиям и поддержке сообщества.	Курсы	2	2025-09-15 01:56:43.267973	2025-09-15 01:56:43.267973	2025-09-15 01:56:43.267973
7	ru	Выдаете ли вы сертификаты?	Да! После успешного завершения любого курса вы получите признанный в индустрии сертификат.	Курсы	3	2025-09-15 01:56:43.268125	2025-09-15 01:56:43.268125	2025-09-15 01:56:43.268125
8	ru	Какие способы оплаты вы принимаете?	Мы принимаем все основные кредитные карты, PayPal и предлагаем планы рассрочки для курсов свыше $200.	Оплата	4	2025-09-15 01:56:43.268289	2025-09-15 01:56:43.268289	2025-09-15 01:56:43.268289
9	he	איך נרשמים לקורס?	פשוט עיינו בקטלוג הקורסים, בחרו את הקורס הרצוי ולחצו על "הרשמה כעת". תוכלו לשלם בבטחה בכרטיס אשראי או PayPal.	כללי	1	2025-09-15 01:56:43.268461	2025-09-15 01:56:43.268461	2025-09-15 01:56:43.268461
10	he	מה כלול בעלות הקורס?	עלות הקורס כוללת גישה לכל החיים לכל חומרי הקורס, שיעורי וידאו, מ과assignments ותמיכת קהילה.	קורסים	2	2025-09-15 01:56:43.268613	2025-09-15 01:56:43.268613	2025-09-15 01:56:43.268613
11	he	האם אתם נותנים תעודות?	כן! לאחר השלמת כל קורס בהצלחה, תקבלו תעודה מוכרת בתעשייה שניתן להוסיף לפרופיל LinkedIn.	קורסים	3	2025-09-15 01:56:43.268762	2025-09-15 01:56:43.268762	2025-09-15 01:56:43.268762
12	he	אילו אמצעי תשלום אתם מקבלים?	אנו מקבלים את כל כרטיסי האשראי הגדולים, PayPal ומציעים תוכניות תשלומים לקורסים מעל $200.	תשלום	4	2025-09-15 01:56:43.268908	2025-09-15 01:56:43.268908	2025-09-15 01:56:43.268908
\.


--
-- Data for Name: footer_content; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.footer_content (id, locale, company_description, copyright_text, newsletter_title, newsletter_placeholder, newsletter_button_text, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: home_pages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.home_pages (id, title, hero_title, hero_subtitle, hero_description, hero_section_visible, featured_courses_title, featured_courses_description, featured_courses_visible, about_title, about_subtitle, about_description, about_visible, companies_title, companies_description, companies_visible, testimonials_title, testimonials_subtitle, testimonials_visible, course_1_title, course_1_rating, course_1_lessons, course_1_duration, course_1_category, course_1_description, course_1_visible, course_2_title, course_2_rating, course_2_lessons, course_2_duration, course_2_category, course_2_description, course_2_visible, course_3_title, course_3_rating, course_3_lessons, course_3_duration, course_3_category, course_3_description, course_3_visible, course_4_title, course_4_rating, course_4_lessons, course_4_duration, course_4_category, course_4_description, course_4_visible, course_5_title, course_5_rating, course_5_lessons, course_5_duration, course_5_category, course_5_description, course_5_visible, course_6_title, course_6_rating, course_6_lessons, course_6_duration, course_6_category, course_6_description, course_6_visible, testimonial_1_text, testimonial_1_author, testimonial_1_rating, testimonial_1_visible, testimonial_2_text, testimonial_2_author, testimonial_2_rating, testimonial_2_visible, testimonial_3_text, testimonial_3_author, testimonial_3_rating, testimonial_3_visible, testimonial_4_text, testimonial_4_author, testimonial_4_rating, testimonial_4_visible, published_at, created_at, updated_at, locale, practice_description, feature_1_title, feature_1_description, feature_2_title, feature_2_description, feature_3_title, feature_3_description, feature_4_title, feature_4_description, feature_5_title, feature_5_description, feature_6_title, feature_6_description) FROM stdin;
1	AI Studio - Expert-Led Online Learning Platform	Test Title	Test Subtitle	Join thousands of students learning cutting-edge technology from industry experts11	t	Featured Courses	Explore our most popular courses designed by industry experts	t	About AI Studio	50+ Courses, 10,000+ Learners	We provide world-class education in AI, Machine Learning, and modern technology	t	Trusted by Leading Companies	Our graduates work at top technology companies worldwide	t	Student Success Stories	Hear from our successful graduates	t	Introduction to Machine Learning	4.9	24 Lessons	8 Weeks	AI & ML	\N	t	Advanced Python Programming	4.8	32 Lessons	10 Weeks	Programming	\N	t	Data Science Fundamentals	4.9	28 Lessons	12 Weeks	Data Science	\N	t	Web Development Bootcamp	4.7	45 Lessons	16 Weeks	Web Dev	\N	t	Cloud Computing Essentials	4.8	20 Lessons	6 Weeks	Cloud	\N	t	Cybersecurity Basics	4.9	18 Lessons	8 Weeks	Security	\N	t	This course changed my life! I went from zero coding experience to landing a job at a tech company.	Sarah Johnson	5.0	t	The instructors are amazing and the content is always up-to-date with industry standards.	Michael Chen	5.0	t	Best investment I ever made in my career. The practical projects really prepared me for real work.	Emma Davis	5.0	t	The community support and mentorship made all the difference in my learning journey.	Alex Rodriguez	5.0	t	2025-09-15 01:56:43.256413	2025-09-15 01:56:43.256413	2025-09-19 12:13:58.544658	en	We provide structured knowledge that's in demand in today's job market. No fluff in our teaching - only hands-on experience and real-world projects.	Problem Solving	Develop algorithmic thinking through coding challenges	Code Quality	Write clean, maintainable, and scalable code	Version Control	Master Git and collaborative development workflows	Testing & QA	Ensure code quality with automated testing	Deployment	Deploy applications to cloud platforms	Soft Skills	Communication and teamwork for tech professionals
2	AI Studio - Платформа онлайн-обучения от экспертов	ТЕСТ СОХРАНЕНИЯ 1757967412602	Трансформируйте карьеру с курсами от экспертов	Присоединяйтесь к тысячам студентов, изучающих передовые технологии	t	Популярные курсы	Изучите наши самые популярные курсы от экспертов индустрии	t	О AI Studio	50+ Courses, 10,000+ Learners	Мы предоставляем образование мирового класса в области ИИ и машинного обучения	t	Нам доверяют ведущие компании	Наши выпускники работают в топовых технологических компаниях	t	Истории успеха студентов	Отзывы наших выпускников	t	Введение в машинное обучение	4.9	24 урока	8 недель	ИИ и МО	\N	t	Продвинутое программирование на Python	4.8	32 урока	10 недель	Программирование	\N	t	Основы науки о данных	4.9	28 уроков	12 недель	Data Science	\N	t	Буткемп веб-разработки	4.7	45 уроков	16 недель	Веб-разработка	\N	t	Основы облачных вычислений	4.8	20 уроков	6 недель	Облако	\N	t	Основы кибербезопасности	4.9	18 уроков	8 недель	Безопасность	\N	t	Этот курс изменил мою жизнь! Я прошел путь от нуля до работы в технологической компании.	Сара Джонсон	5.0	t	Преподаватели потрясающие, а контент всегда соответствует стандартам индустрии.	Михаил Чен	5.0	t	Лучшая инвестиция в мою карьеру. Практические проекты действительно подготовили меня.	Эмма Дэвис	5.0	t	Поддержка сообщества и менторство сделали всю разницу в моем обучении.	Алекс Родригес	5.0	t	2025-09-15 01:56:43.256862	2025-09-15 01:56:43.256862	2025-09-15 23:16:52.61721	ru	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
3	AI Studio - פלטפורמת למידה מקוונת בהובלת מומחים	שלטו ב-AI וטכנולוגיה	שנו את הקריירה שלכם עם קורסים מומחים	הצטרפו לאלפי סטודנטים הלומדים טכנולוגיה מתקדמת	t	קורסים מומלצים	חקרו את הקורסים הפופולריים ביותר שלנו מאת מומחי התעשייה	t	אודות AI Studio	הדרך שלכם להצלחה	אנו מספקים חינוך ברמה עולמית ב-AI ולמידת מכונה	t	חברות מובילות סומכות עלינו	הבוגרים שלנו עובדים בחברות הטכנולוגיה המובילות	t	סיפורי הצלחה של סטודנטים	שמעו מהבוגרים המצליחים שלנו	t	מבוא ללמידת מכונה	4.9	24 שיעורים	8 שבועות	AI ו-ML	\N	t	תכנות Python מתקדם	4.8	32 שיעורים	10 שבועות	תכנות	\N	t	יסודות מדע הנתונים	4.9	28 שיעורים	12 שבועות	מדע נתונים	\N	t	בוטקמפ פיתוח אתרים	4.7	45 שיעורים	16 שבועות	פיתוח ווב	\N	t	יסודות מחשוב ענן	4.8	20 שיעורים	6 שבועות	ענן	\N	t	יסודות אבטחת סייבר	4.9	18 שיעורים	8 שבועות	אבטחה	\N	t	הקורס הזה שינה את חיי! עברתי מאפס ניסיון בתכנות לעבודה בחברת טכנולוגיה.	שרה ג׳ונסון	5.0	t	המדריכים מדהימים והתוכן תמיד מעודכן לסטנדרטים של התעשייה.	מייקל צ׳ן	5.0	t	ההשקעה הטובה ביותר שעשיתי בקריירה שלי. הפרויקטים המעשיים באמת הכינו אותי.	אמה דייוויס	5.0	t	התמיכה של הקהילה והחניכה עשו את כל ההבדל במסע הלמידה שלי.	אלכס רודריגז	5.0	t	2025-09-15 01:56:43.257616	2025-09-15 01:56:43.257616	2025-09-16 12:57:44.661902	he	אנו מספקים ידע מובנה שנדרש בשוק העבודה של היום. ללא תכנים מיותרים בהוראה שלנו - רק ניסיון מעשי ופרויקטים אמיתיים.	פתרון בעיות	פיתוח חשיבה אלגוריתמית באמצעות אתגרי קוד	איכות קוד	כתיבת קוד נקי, ניתן לתחזוקה וניתן להרחבה	בקרת גרסאות	שליטה ב-Git ובתהליכי עבודה שיתופיים	בדיקות ובקרת איכות	הבטחת איכות הקוד עם בדיקות אוטומטיות	פריסה	פריסת יישומים לפלטפורמות ענן	כישורים רכים	תקשורת ועבודת צוות למקצועני טכנולוגיה
\.


--
-- Data for Name: job_postings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.job_postings (id, title, company, location, type, description, apply_url, published_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: navigation_menus; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.navigation_menus (id, locale, home_label, courses_label, teachers_label, career_services_label, career_center_label, career_orientation_label, created_at) FROM stdin;
1	en	Home	Courses	Teachers	Career Services	Career Center	Career Orientation	2025-09-15 01:25:55.263261
\.


--
-- Data for Name: nd_about_page; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nd_about_page (id, section_name, content_en, content_ru, content_he, visible, display_order, created_at, updated_at) FROM stdin;
2	mission	{"title": "Mission Title", "subtitle": "Mission Subtitle", "description": "Content for Mission section"}	{"title": "Mission Title", "subtitle": "Mission Subtitle", "description": "Content for Mission section"}	{"title": "Mission Title", "subtitle": "Mission Subtitle", "description": "Content for Mission section"}	t	2	2025-09-16 23:29:29.702524	2025-09-16 23:29:29.702524
3	vision	{"title": "Vision Title", "subtitle": "Vision Subtitle", "description": "Content for Vision section"}	{"title": "Vision Title", "subtitle": "Vision Subtitle", "description": "Content for Vision section"}	{"title": "Vision Title", "subtitle": "Vision Subtitle", "description": "Content for Vision section"}	t	3	2025-09-16 23:29:29.702887	2025-09-16 23:29:29.702887
4	values	{"title": "Values Title", "subtitle": "Values Subtitle", "description": "Content for Values section"}	{"title": "Values Title", "subtitle": "Values Subtitle", "description": "Content for Values section"}	{"title": "Values Title", "subtitle": "Values Subtitle", "description": "Content for Values section"}	t	4	2025-09-16 23:29:29.703096	2025-09-16 23:29:29.703096
5	team	{"title": "Team Title", "subtitle": "Team Subtitle", "description": "Content for Team section"}	{"title": "Team Title", "subtitle": "Team Subtitle", "description": "Content for Team section"}	{"title": "Team Title", "subtitle": "Team Subtitle", "description": "Content for Team section"}	t	5	2025-09-16 23:29:29.703293	2025-09-16 23:29:29.703293
6	history	{"title": "History Title", "subtitle": "History Subtitle", "description": "Content for History section"}	{"title": "History Title", "subtitle": "History Subtitle", "description": "Content for History section"}	{"title": "History Title", "subtitle": "History Subtitle", "description": "Content for History section"}	t	6	2025-09-16 23:29:29.703481	2025-09-16 23:29:29.703481
7	achievements	{"title": "Achievements Title", "subtitle": "Achievements Subtitle", "description": "Content for Achievements section"}	{"title": "Achievements Title", "subtitle": "Achievements Subtitle", "description": "Content for Achievements section"}	{"title": "Achievements Title", "subtitle": "Achievements Subtitle", "description": "Content for Achievements section"}	t	7	2025-09-16 23:29:29.703739	2025-09-16 23:29:29.703739
8	partners	{"title": "Partners Title", "subtitle": "Partners Subtitle", "description": "Content for Partners section"}	{"title": "Partners Title", "subtitle": "Partners Subtitle", "description": "Content for Partners section"}	{"title": "Partners Title", "subtitle": "Partners Subtitle", "description": "Content for Partners section"}	t	8	2025-09-16 23:29:29.703992	2025-09-16 23:29:29.703992
1	hero	{"title": "Your Learning Journey With Our Experts.", "counters": [{"label": "Total Courses Taught", "value": "100", "suffix": "+"}, {"label": "Total Happy Learners", "value": "500", "suffix": "+"}, {"label": "Years Of Experience", "value": "10", "suffix": "+"}], "subtitle": "Meet Your Mentor", "button_url": "courses.html", "main_title": "Get To Know Your Pathway To Mastery.", "button_text": "Discover Courses", "description": "With over a decade of experience in the tech industry, mentor has dedicated their career to empowering learners.", "mentor_name": "Mrs. Sarah Johnson", "extended_description": "Providing hands-on, real-world training and mentorship, i aim to bridge gap between theoretical knowledge & practical application, ensuring that every student can confidently apply their skills."}	{"title": "Your Learning Journey With Our Experts.", "subtitle": "About Us", "button_text": "Learn More", "description": "At AI Studio, we believe in transforming education through innovative technology and expert instruction. Our platform brings together world-class educators and cutting-edge learning methods to create an unparalleled educational experience."}	{"title": "Your Learning Journey With Our Experts.", "subtitle": "About Us", "button_text": "Learn More", "description": "At AI Studio, we believe in transforming education through innovative technology and expert instruction. Our platform brings together world-class educators and cutting-edge learning methods to create an unparalleled educational experience."}	t	1	2025-09-16 23:29:29.701711	2025-09-17 09:05:09.587124
\.


--
-- Data for Name: nd_blog_page; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nd_blog_page (id, section_name, content_en, content_ru, content_he, visible, display_order, created_at, updated_at) FROM stdin;
2	featured_posts	{"title": "Featured Posts Title", "subtitle": "Featured Posts Subtitle", "description": "Content for Featured Posts section"}	{"title": "Featured Posts Title", "subtitle": "Featured Posts Subtitle", "description": "Content for Featured Posts section"}	{"title": "Featured Posts Title", "subtitle": "Featured Posts Subtitle", "description": "Content for Featured Posts section"}	t	2	2025-09-16 23:29:29.711356	2025-09-16 23:29:29.711356
3	categories	{"title": "Categories Title", "subtitle": "Categories Subtitle", "description": "Content for Categories section"}	{"title": "Categories Title", "subtitle": "Categories Subtitle", "description": "Content for Categories section"}	{"title": "Categories Title", "subtitle": "Categories Subtitle", "description": "Content for Categories section"}	t	3	2025-09-16 23:29:29.711637	2025-09-16 23:29:29.711637
4	recent_posts	{"title": "Recent Posts Title", "subtitle": "Recent Posts Subtitle", "description": "Content for Recent Posts section"}	{"title": "Recent Posts Title", "subtitle": "Recent Posts Subtitle", "description": "Content for Recent Posts section"}	{"title": "Recent Posts Title", "subtitle": "Recent Posts Subtitle", "description": "Content for Recent Posts section"}	t	4	2025-09-16 23:29:29.711827	2025-09-16 23:29:29.711827
5	newsletter	{"title": "Newsletter Title", "subtitle": "Newsletter Subtitle", "description": "Content for Newsletter section"}	{"title": "Newsletter Title", "subtitle": "Newsletter Subtitle", "description": "Content for Newsletter section"}	{"title": "Newsletter Title", "subtitle": "Newsletter Subtitle", "description": "Content for Newsletter section"}	t	5	2025-09-16 23:29:29.712003	2025-09-16 23:29:29.712003
1	hero	{"title": "Blog", "breadcrumb_home": "Home", "breadcrumb_current": "Blog"}	{"title": "Блог", "breadcrumb_home": "Главная", "breadcrumb_current": "Блог"}	{"title": "בלוג", "breadcrumb_home": "בית", "breadcrumb_current": "בלוג"}	t	1	2025-09-16 23:29:29.710878	2025-09-21 13:53:15.790742
7	main_content	{"loading_text": "Loading blog posts...", "section_title": "News & Articles", "section_subtitle": "Your Learning Journey with our experts.", "section_description": "Zohacous, we believe in a structured yet flexible approach to mentorship designed to help you achieve your goals at every step."}	{"loading_text": "Загрузка статей блога...", "section_title": "Новости и Статьи", "section_subtitle": "Ваш путь обучения с нашими экспертами.", "section_description": "В Zohacous мы верим в структурированный, но гибкий подход к наставничеству, разработанный для достижения ваших целей на каждом этапе."}	{"loading_text": "טוען פוסטים בבלוג...", "section_title": "חדשות ומאמרים", "section_subtitle": "מסע הלמידה שלך עם המומחים שלנו.", "section_description": "ב-Zohacous, אנו מאמינים בגישה מובנית אך גמישה להדרכה המיועדת לעזור לך להשיג את המטרות שלך בכל שלב."}	t	1	2025-09-21 13:17:45.920418	2025-09-21 13:53:15.796987
8	navigation	{"items": [{"text": "Home"}, {"text": "Courses"}, {"text": "Teachers"}, {"text": "Blog"}, {"text": "About Us"}, {}, {"text": "Pricing"}], "career": {"center": "Career Center", "orientation": "Career Orientation"}}	{"items": [{"text": "Главная"}, {"text": "Курсы"}, {"text": "Преподаватели"}, {"text": "Блог"}, {"text": "О нас"}, {}, {"text": "Цены"}], "career": {"center": "Карьерный Центр", "orientation": "Карьерная Ориентация"}}	{"items": [{"text": "בית"}, {"text": "קורסים"}, {"text": "מורים"}, {"text": "בלוג"}, {"text": "אודותינו"}, {}, {"text": "מחירים"}], "career": {"center": "מרכז קריירה", "orientation": "הכוונה מקצועית"}}	t	1	2025-09-21 13:17:45.930674	2025-09-21 13:55:01.344601
12	track_section	{"track_tags": ["Start Learning", "Browse Courses"]}	{"track_tags": ["Начать Обучение", "Просмотр Курсов"]}	{"track_tags": ["התחל ללמוד", "עיין בקורסים"]}	t	3	2025-09-21 14:31:36.490336	2025-09-21 14:31:36.490336
13	cta_section	{"title": "Discover A World Of Learning Opportunities.", "subtitle": "Start Learning Today", "description": "Don't wait to transform career and unlock your full potential. join our community of passionate learners and gain access to a wide range of courses.", "button_contact": "get in touch", "button_courses": "Check Out Courses"}	{"title": "Откройте Мир Возможностей Обучения.", "subtitle": "Начните Обучение Сегодня", "description": "Не ждите, чтобы изменить карьеру и раскрыть свой полный потенциал. Присоединяйтесь к нашему сообществу увлеченных учеников и получите доступ к широкому спектру курсов.", "button_contact": "связаться с нами", "button_courses": "Посмотреть Курсы"}	{"title": "גלה עולם של הזדמנויות למידה.", "subtitle": "התחל ללמוד היום", "description": "אל תחכה כדי לשנות קריירה ולפתוח את מלא הפוטנציאל שלך. הצטרף לקהילה שלנו של לומדים נלהבים וקבל גישה למגוון רחב של קורסים.", "button_contact": "צור קשר", "button_courses": "עיין בקורסים"}	t	4	2025-09-21 14:31:52.40766	2025-09-21 14:31:52.40766
\.


--
-- Data for Name: nd_blog_posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nd_blog_posts (id, title_en, title_ru, title_he, content_en, content_ru, content_he, author, featured_image, published_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: nd_career_center_platform_page; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nd_career_center_platform_page (id, section_name, content_en, content_ru, content_he, visible, display_order, created_at, updated_at) FROM stdin;
3	opportunities	{}	{}	{}	t	3	2025-09-17 14:38:44.220118	2025-09-25 09:35:14.782214
4	resources	{}	{}	{}	t	4	2025-09-17 14:38:44.220554	2025-09-25 09:35:14.787256
2	features	{}	{}	{"content": {"subtitle": "כל מה שאתם צריכים להצלחה מקצועית"}}	t	2	2025-09-17 14:38:44.219579	2025-09-25 09:35:53.337249
1	hero	{}	{}	{"title": "פלטפורמת קריירה", "subtitle": "השער שלכם להצלחה מקצועית", "main_title": "האיצו את הקריירה שלכם עם הפלטפורמה המקיפה שלנו", "description": "קבלו גישה לכלים מתקדמים, הנחייה מקצועית ומשאבים מותאמים אישית כדי לשנות את המסע המקצועי שלכם. הפלטפורמה שלנו מחברת אתכם להזדמנויות ולכישורים שחשובים."}	t	1	2025-09-17 14:38:44.218091	2025-09-26 08:33:56.415247
5	testimonials	{}	{}	{}	t	5	2025-09-17 14:38:44.221246	2025-09-25 09:35:14.79174
6	cta	{}	{}	{"title": "מוכנים להאיץ את הקריירה שלכם?", "description": "הצטרפו לאלפי מקצוענים שמקדמים את הקריירה שלהם עם הפלטפורמה המקיפה שלנו. התחילו את המסע שלכם היום ופתחו את המלוא הפוטנציאל שלכם."}	t	6	2025-09-17 14:38:44.222527	2025-09-26 08:34:09.40386
\.


--
-- Data for Name: nd_contact_page; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nd_contact_page (id, section_name, content_en, content_ru, content_he, visible, display_order, created_at, updated_at) FROM stdin;
1	hero	{"title": "Hero Title", "subtitle": "Hero Subtitle", "description": "Content for Hero section"}	{"title": "Hero Title", "subtitle": "Hero Subtitle", "description": "Content for Hero section"}	{"title": "Hero Title", "subtitle": "Hero Subtitle", "description": "Content for Hero section"}	t	1	2025-09-16 23:29:29.714915	2025-09-16 23:29:29.714915
2	contact_info	{"title": "Contact Info Title", "subtitle": "Contact Info Subtitle", "description": "Content for Contact Info section"}	{"title": "Contact Info Title", "subtitle": "Contact Info Subtitle", "description": "Content for Contact Info section"}	{"title": "Contact Info Title", "subtitle": "Contact Info Subtitle", "description": "Content for Contact Info section"}	t	2	2025-09-16 23:29:29.715363	2025-09-16 23:29:29.715363
3	office_locations	{"title": "Office Locations Title", "subtitle": "Office Locations Subtitle", "description": "Content for Office Locations section"}	{"title": "Office Locations Title", "subtitle": "Office Locations Subtitle", "description": "Content for Office Locations section"}	{"title": "Office Locations Title", "subtitle": "Office Locations Subtitle", "description": "Content for Office Locations section"}	t	3	2025-09-16 23:29:29.715558	2025-09-16 23:29:29.715558
4	contact_form	{"title": "Contact Form Title", "subtitle": "Contact Form Subtitle", "description": "Content for Contact Form section"}	{"title": "Contact Form Title", "subtitle": "Contact Form Subtitle", "description": "Content for Contact Form section"}	{"title": "Contact Form Title", "subtitle": "Contact Form Subtitle", "description": "Content for Contact Form section"}	t	4	2025-09-16 23:29:29.715754	2025-09-16 23:29:29.715754
5	map	{"title": "Map Title", "subtitle": "Map Subtitle", "description": "Content for Map section"}	{"title": "Map Title", "subtitle": "Map Subtitle", "description": "Content for Map section"}	{"title": "Map Title", "subtitle": "Map Subtitle", "description": "Content for Map section"}	t	5	2025-09-16 23:29:29.715949	2025-09-16 23:29:29.715949
6	business_hours	{"title": "Business Hours Title", "subtitle": "Business Hours Subtitle", "description": "Content for Business Hours section"}	{"title": "Business Hours Title", "subtitle": "Business Hours Subtitle", "description": "Content for Business Hours section"}	{"title": "Business Hours Title", "subtitle": "Business Hours Subtitle", "description": "Content for Business Hours section"}	t	6	2025-09-16 23:29:29.716184	2025-09-16 23:29:29.716184
7	social_links	{"title": "Social Links Title", "subtitle": "Social Links Subtitle", "description": "Content for Social Links section"}	{"title": "Social Links Title", "subtitle": "Social Links Subtitle", "description": "Content for Social Links section"}	{"title": "Social Links Title", "subtitle": "Social Links Subtitle", "description": "Content for Social Links section"}	t	7	2025-09-16 23:29:29.716403	2025-09-16 23:29:29.716403
\.


--
-- Data for Name: nd_course_details_page; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nd_course_details_page (id, section_key, section_type, content_en, content_ru, content_he, visible, order_index, created_at, updated_at) FROM stdin;
1	navigation	navigation	{"content": {"blog": "Blog", "home": "Home", "pages": "Pages", "career": {"center": "Career Center", "orientation": "Career Orientation"}, "courses": "Courses", "pricing": "Pricing", "sign_in": "Sign in", "sign_up": "Sign up", "about_us": "About Us", "teachers": "Teachers", "contact_us": "Contact Us"}}	{"content": {"blog": "Блог", "home": "Главная", "pages": "Страницы", "career": {"center": "Карьерный центр", "orientation": "Профориентация"}, "courses": "Курсы", "pricing": "Цены", "sign_in": "Войти", "sign_up": "Регистрация", "about_us": "О нас", "teachers": "Преподаватели", "contact_us": "Контакты"}}	{"content": {"blog": "בלוג", "home": "בית", "pages": "דפים", "career": {"center": "מרכז קריירה", "orientation": "הכוונה תעסוקתית"}, "courses": "קורסים", "pricing": "מחירים", "sign_in": "התחבר", "sign_up": "הרשמה", "about_us": "אודותינו", "teachers": "מורים", "contact_us": "צור קשר"}}	t	1	2025-09-21 12:12:14.508849	2025-09-21 12:12:14.508849
2	course_overview	section	{"title": "Course Overview", "subtitle": "What you will learn"}	{"title": "Обзор курса", "subtitle": "Что вы изучите"}	{"title": "סקירת הקורס", "subtitle": "מה תלמד"}	t	2	2025-09-21 12:12:14.508849	2025-09-21 12:12:14.508849
3	what_you_learn	section	{"title": "What You'll Learn", "subtitle": "Key learning outcomes"}	{"title": "Что вы изучите", "subtitle": "Основные результаты обучения"}	{"title": "מה תלמד", "subtitle": "תוצאות למידה מרכזיות"}	t	3	2025-09-21 12:12:14.508849	2025-09-21 12:12:14.508849
4	course_curriculum	section	{"title": "Course Curriculum", "lesson": "Lesson", "duration": "Duration", "subtitle": "Detailed course content"}	{"title": "Программа курса", "lesson": "Урок", "duration": "Продолжительность", "subtitle": "Подробное содержание курса"}	{"title": "תכנית הלימודים", "lesson": "שיעור", "duration": "משך", "subtitle": "תוכן מפורט של הקורס"}	t	4	2025-09-21 12:12:14.508849	2025-09-21 12:12:14.508849
5	requirements	section	{"title": "Requirements", "subtitle": "What you need to get started"}	{"title": "Требования", "subtitle": "Что нужно для начала"}	{"title": "דרישות", "subtitle": "מה נדרש כדי להתחיל"}	t	5	2025-09-21 12:12:14.508849	2025-09-21 12:12:14.508849
6	course_features	section	{"title": "Course Features", "subtitle": "What's included"}	{"title": "Особенности курса", "subtitle": "Что включено"}	{"title": "תכונות הקורס", "subtitle": "מה כלול"}	t	6	2025-09-21 12:12:14.508849	2025-09-21 12:12:14.508849
7	course_info	sidebar	{"free": "Free", "level": "Level", "price": "Price", "lessons": "Lessons", "discount": "Discount", "language": "Language", "students": "Students", "old_price": "Original Price", "certificate": "Certificate"}	{"free": "Бесплатно", "level": "Уровень", "price": "Цена", "lessons": "Уроков", "discount": "Скидка", "language": "Язык", "students": "Студентов", "old_price": "Исходная цена", "certificate": "Сертификат"}	{"free": "חינם", "level": "רמה", "price": "מחיר", "lessons": "שיעורים", "discount": "הנחה", "language": "שפה", "students": "סטודנטים", "old_price": "מחיר מקורי", "certificate": "תעודה"}	t	7	2025-09-21 12:12:14.508849	2025-09-21 12:12:14.508849
8	instructor	sidebar	{"title": "About the Instructor", "rating": "Rating", "courses": "Courses", "reviews": "Reviews", "students": "Students", "view_profile": "View Profile"}	{"title": "О преподавателе", "rating": "Рейтинг", "courses": "Курсов", "reviews": "Отзывов", "students": "Студентов", "view_profile": "Посмотреть профиль"}	{"title": "אודות המדריך", "rating": "דירוג", "courses": "קורסים", "reviews": "ביקורות", "students": "סטודנטים", "view_profile": "צפה בפרופיל"}	t	8	2025-09-21 12:12:14.508849	2025-09-21 12:12:14.508849
9	cta	section	{"title": "Start Your Learning Journey Today", "description": "Join thousands of students already learning with us", "browse_courses": "Browse Courses", "ready_to_start": "Ready to Start?", "start_learning": "Start Learning"}	{"title": "Начните свое обучение сегодня", "description": "Присоединяйтесь к тысячам студентов, уже обучающихся у нас", "browse_courses": "Просмотреть курсы", "ready_to_start": "Готовы начать?", "start_learning": "Начать обучение"}	{"title": "התחל את מסע הלמידה שלך היום", "description": "הצטרף לאלפי סטודנטים שכבר לומדים איתנו", "browse_courses": "עיין בקורסים", "ready_to_start": "מוכנים להתחיל?", "start_learning": "התחל ללמוד"}	t	9	2025-09-21 12:12:14.508849	2025-09-21 12:12:14.508849
10	ui_elements	ui	{"labels": {"filter": "Filter", "search": "Search", "loading": "Loading...", "sort_by": "Sort by", "show_all": "Show All", "no_results": "No results found"}, "buttons": {"contact_us": "Contact Us", "enroll_now": "Enroll Now", "learn_more": "Learn More", "add_to_cart": "Add to Cart", "get_started": "Get Started", "view_details": "View Details", "sign_up_today": "Sign Up Today", "watch_preview": "Watch Preview", "download_syllabus": "Download Syllabus"}, "messages": {"coming_soon": "Coming Soon", "course_added": "Course added to cart", "error_loading": "Error loading course details", "enrollment_success": "Successfully enrolled in course"}}	{"labels": {"filter": "Фильтр", "search": "Поиск", "loading": "Загрузка...", "sort_by": "Сортировать по", "show_all": "Показать все", "no_results": "Результаты не найдены"}, "buttons": {"contact_us": "Связаться с нами", "enroll_now": "Записаться сейчас", "learn_more": "Узнать больше", "add_to_cart": "Добавить в корзину", "get_started": "Начать", "view_details": "Подробнее", "sign_up_today": "Записаться сегодня", "watch_preview": "Смотреть превью", "download_syllabus": "Скачать программу"}, "messages": {"coming_soon": "Скоро", "course_added": "Курс добавлен в корзину", "error_loading": "Ошибка загрузки деталей курса", "enrollment_success": "Успешно записаны на курс"}}	{"labels": {"filter": "סינון", "search": "חיפוש", "loading": "טוען...", "sort_by": "מיין לפי", "show_all": "הצג הכל", "no_results": "לא נמצאו תוצאות"}, "buttons": {"contact_us": "צור קשר", "enroll_now": "הירשם עכשיו", "learn_more": "למד עוד", "add_to_cart": "הוסף לעגלה", "get_started": "התחל", "view_details": "צפה בפרטים", "sign_up_today": "הירשם היום", "watch_preview": "צפה בתצוגה מקדימה", "download_syllabus": "הורד סילבוס"}, "messages": {"coming_soon": "בקרוב", "course_added": "הקורס נוסף לעגלה", "error_loading": "שגיאה בטעינת פרטי הקורס", "enrollment_success": "נרשמת בהצלחה לקורס"}}	t	10	2025-09-21 12:12:14.508849	2025-09-21 12:12:14.508849
11	footer	footer	{"contact": "Contact", "copyright": "© 2024 AI Studio. All rights reserved.", "privacy_policy": "Privacy Policy", "terms_of_service": "Terms of Service"}	{"contact": "Контакты", "copyright": "© 2024 Студия ИИ. Все права защищены.", "privacy_policy": "Политика конфиденциальности", "terms_of_service": "Условия использования"}	{"contact": "צור קשר", "copyright": "© 2024 סטודיו AI. כל הזכויות שמורות.", "privacy_policy": "מדיניות פרטיות", "terms_of_service": "תנאי שימוש"}	t	11	2025-09-21 12:12:14.508849	2025-09-21 12:12:14.508849
\.


--
-- Data for Name: nd_courses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nd_courses (id, course_key, title, description, short_description, price, old_price, currency, duration, level, category, instructor, language, image, video_url, thumbnail, url, enrollment_url, syllabus_url, rating, reviews_count, students_count, lessons_count, hours_count, features, syllabus, requirements, what_you_learn, title_ru, description_ru, short_description_ru, title_he, description_he, short_description_he, featured, visible, published, enrollment_open, meta_title, meta_description, meta_keywords, slug, order_index, tags, start_date, end_date, created_at, updated_at, published_at, title_en, description_en, instructor_bio) FROM stdin;
4	course-4	Python for Data Science	Unlock the power of Python for data analysis and machine learning. Master pandas, NumPy, matplotlib, and scikit-learn.	Analyze data and build ML models with Python	99.99	149.99	USD	12 weeks	Intermediate	Web Development	Dr. Emily Martinez	English	images/course-python.jpg		\N	detail_courses.html?id=4	\N	\N	4.5	100	1	36	\N	[]	[]	[]	[]	Python для науки о данных	Раскройте возможности Python для анализа данных и машинного обучения. Освойте pandas, NumPy, matplotlib и scikit-learn.	Анализируйте данные и создавайте ML-модели с Python	Python למדע הנתונים	שחררו את הכוח של Python לניתוח נתונים ולמידת מכונה. שלטו ב-pandas, NumPy, matplotlib ו-scikit-learn.	נתח נתונים ובנה מודלי ML עם Python	f	t	t	t	\N	\N	\N	\N	3	[]	\N	\N	2025-09-16 23:12:28.239838	2025-09-20 22:32:27.875021	2025-09-16 23:12:28.239838	Python for Data Science	Unlock the power of Python for data analysis and machine learning. Master pandas, NumPy, matplotlib, and scikit-learn to analyze data, create visualizations, and build predictive models.	\N
3	course-3	Node.js Backend Development	Become a backend expert with Node.js, Express, and MongoDB. Learn to build RESTful APIs, handle authentication, implement security best practices.	Create robust backend systems with Node.js and Express	99.99	149.99	USD	9 weeks	Intermediate	Machine Learning	David Williams	English	images/course-nodejs.jpg		\N	detail_courses.html?id=3	\N	\N	4.5	100	1	28	\N	[]	[]	[]	[]	Разработка Backend на Node.js	Станьте экспертом по backend с Node.js, Express и MongoDB. Научитесь создавать RESTful API, обрабатывать аутентификацию.	Создавайте надежные backend-системы с Node.js и Express	פיתוח Backend עם Node.js	הפכו למומחי backend עם Node.js, Express ו-MongoDB. למדו לבנות RESTful APIs, לטפל באימות.	צור מערכות backend איתנות עם Node.js ו-Express	t	t	t	t	\N	\N	\N	\N	2	[]	\N	\N	2025-09-16 23:12:28.239306	2025-09-25 16:15:13.440349	2025-09-16 23:12:28.239306	Node.js Backend Development	Become a backend expert with Node.js, Express, and MongoDB. Learn to build RESTful APIs, handle authentication, implement security best practices, and deploy scalable server applications.	Hebrew instructor bio: מומחה מנוסה עם שנים של מומחיות בתעשייה ותשוקה להוראה
2	course-2	React & Redux Masterclass	Master React.js and Redux for building scalable single-page applications. Learn component architecture, state management, hooks, and best practices for production-ready React apps.	Создавайте мощные веб-приложения с React и Redux	99.99	149.99	USD	10 weeks	Intermediate	App Development	Michael Chen	English	images/course-react.jpg		\N	http://localhost:3000/backups/newDesign/detail_courses.html?id=2	\N	\N	4.5	100	1	32	\N	""	[]	""	[]	Мастер-класс React и Redux	Глубоко изучите React.js и Redux для создания масштабируемых одностраничных приложений. Изучите архитектуру компонентов, управление состоянием, хуки и лучшие практики.	Создавайте мощные веб-приложения с React и Redux	מאסטר-קלאס React ו-Redux	למדו React.js ו-Redux לבניית אפליקציות חד-עמודיות ניתנות להרחבה. למדו ארכיטקטורת רכיבים, ניהול מצב, hooks ושיטות מומלצות.	בנה אפליקציות רשת עוצמתיות עם React ו-Redux	t	t	t	t	\N	\N	\N	\N	1	[]	\N	\N	2025-09-16 23:12:28.238712	2025-09-20 22:32:27.847229	2025-09-16 23:12:28.238712	React & Redux Masterclass	Deep dive into React.js and Redux for building scalable single-page applications. Learn component architecture, state management, hooks, and best practices for production-ready React applications.	\N
\.


--
-- Data for Name: nd_courses_page; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nd_courses_page (id, section_key, section_type, content_en, content_ru, content_he, visible, animations_enabled, created_at, updated_at) FROM stdin;
1	hero	hero	{"title": "Our Courses", "subtitle": "Explore Our Learning Programs", "description": "Choose from our comprehensive range of courses designed to help you master new skills"}	{"title": "Наши Курсы", "subtitle": "Изучите Наши Учебные Программы", "description": "Выберите из нашего широкого спектра курсов, разработанных чтобы помочь вам освоить новые навыки"}	{"title": "הקורסים שלנו", "subtitle": "חקור את תוכניות הלמידה שלנו", "description": "בחר מתוך מגוון רחב של קורсים שנועדו לעזור לך לשלוט במיומנויות חדשות"}	t	t	2025-09-21 10:32:33.921749	2025-09-21 10:32:33.921749
4	cart	cart	{"content": {"title": "Your Cart", "remove": "Remove", "checkout": "Continue to Checkout", "quantity": "Quantity", "subtotal": "Subtotal", "empty_message": "Your cart is empty"}}	{"content": {"title": "Ваша Корзина", "remove": "Удалить", "checkout": "Продолжить к оформлению", "quantity": "Количество", "subtotal": "Промежуточный итог", "empty_message": "Ваша корзина пуста"}}	{"content": {"title": "העגלה שלך", "remove": "הסר", "checkout": "המשך לתשלום", "quantity": "כמות", "subtotal": "סכום ביניים", "empty_message": "העגלה שלך ריקה"}}	t	t	2025-09-21 10:32:33.921749	2025-09-21 10:32:33.921749
5	cta_bottom	cta	{"content": {"title": "Discover A World Of Learning Opportunities", "subtitle": "Start Learning Today", "description": "Don't wait to transform your career and unlock your full potential"}}	{"content": {"title": "Откройте Мир Возможностей для Обучения", "subtitle": "Начните Обучение Сегодня", "description": "Не ждите, чтобы изменить свою карьеру и раскрыть свой полный потенциал"}}	{"content": {"title": "גלה עולם של הזדמנויות למידה", "subtitle": "התחל ללמוד היום", "description": "אל תחכה לשנות את הקריירה שלך ולפתוח את הפוטנציאל המלא שלך"}}	t	t	2025-09-21 10:32:33.921749	2025-09-21 10:32:33.921749
6	misc	misc	{"content": {"error": "Failed to load courses", "loading": "Loading courses...", "no_items": "No items found"}}	{"content": {"error": "Не удалось загрузить курсы", "loading": "Загрузка курсов...", "no_items": "Товары не найдены"}}	{"content": {"error": "נכשל בטעינת קורסים", "loading": "טוען קורסים...", "no_items": "לא נמצאו פריטים"}}	t	t	2025-09-21 10:32:33.921749	2025-09-21 10:32:33.921749
7	navigation	navigation	{"content": {"blog": "Blog", "home": "Home", "courses": "Courses", "pricing": "Pricing", "about_us": "About Us", "teachers": "Teachers", "career_center": "Career Center", "career_orientation": "Career Orientation"}}	{"content": {"blog": "Блог", "home": "Главная", "courses": "Курсы", "pricing": "Цены", "about_us": "О нас", "teachers": "Преподаватели", "career_center": "Центр Карьеры", "career_orientation": "Профориентация"}}	{"content": {"blog": "בלוג", "home": "בית", "courses": "קורסים", "pricing": "תמחור", "about_us": "אודותינו", "teachers": "מורים", "career_center": "מרכז קריירה", "career_orientation": "הכוונה מקצועית"}}	t	t	2025-09-21 10:32:33.921749	2025-09-21 10:32:33.921749
3	ui_elements	ui	{"content": {"labels": {"level": "Level", "price": "Price", "rating": "Rating", "duration": "Duration", "students": "Students Enrolled", "instructor": "Instructor"}, "buttons": {"get_in_touch": "Get In Touch", "sign_up_today": "Sign Up Today", "browse_courses": "Browse Courses", "course_details": "Course Details", "start_learning": "Start Learning", "check_out_courses": "Check Out Courses"}, "messages": {"error": "Error loading courses", "loading": "Loading courses...", "no_courses_found": "😔 No courses found in this category"}}}	{"content": {"labels": {"level": "Уровень", "price": "Цена", "rating": "Рейтинг", "duration": "Продолжительность", "students": "Студентов записано", "instructor": "Инструктор"}, "buttons": {"get_in_touch": "Связаться", "sign_up_today": "Записаться сегодня", "browse_courses": "Просмотр курсов", "course_details": "Детали курса", "start_learning": "Начать обучение", "check_out_courses": "Посмотреть курсы"}, "messages": {"error": "Ошибка загрузки курсов", "loading": "Загрузка курсов...", "no_courses_found": "😔 Курсы в этой категории не найдены"}}}	{"content": {"labels": {"level": "רמה", "price": "מחיר", "rating": "דירוג", "duration": "משך", "students": "תלמידים נרשמו", "instructor": "מדריך"}, "buttons": {"get_in_touch": "צור קשר", "sign_up_today": "הירשם היום", "browse_courses": "עיון בקורסים", "course_details": "פרטי הקורס", "start_learning": "התחל ללמוד", "check_out_courses": "בדוק קורסים"}, "messages": {"error": "שגיאה בטעינת קורסים", "loading": "טוען קורסים...", "no_courses_found": "😔 לא נמצאו קורסים בקטגוריה זו"}}}	t	t	2025-09-21 10:32:33.921749	2025-09-23 15:51:44.29297
2	featured_courses	courses	{"content": {"title": "Featured Courses", "filters": {"all": "All", "cloud": "Cloud Computing", "web_dev": "Web Development", "mobile_dev": "Mobile Development", "data_science": "Data Science", "machine_learning": "Machine Learning"}, "subtitle": "Our Most Popular Programs", "description": "Dive into our expertly curated selection of featured courses, designed to equip you with the skills and knowledge needed to excel."}}	{"content": {"title": "Рекомендуемые Курсы", "filters": {"all": "Все", "cloud": "Облачные вычисления", "web_dev": "Веб-разработка", "mobile_dev": "Мобильная разработка", "data_science": "Наука о данных", "machine_learning": "Машинное обучение"}, "subtitle": "Наши Самые Популярные Программы", "description": "Погрузитесь в наш экспертно отобранный выбор рекомендуемых курсов, разработанных для оснащения вас навыками и знаниями, необходимыми для достижения успеха."}}	{"content": {"title": "קורסים מומלצים", "filters": {"all": "הכל", "cloud": "מחשוב ענן", "web_dev": "פיתוח אתרים", "mobile_dev": "פיתוח נייד", "data_science": "מדע הנתונים", "machine_learning": "למידת מכונה"}, "subtitle": "התוכניות הפופולריות ביותר שלנו", "description": "צללו לתוך הבחירה המאופיינת מקצועית של הקורסים המומלצים שלנו, שנועדו לצייד אתכם בכישורים ובידע הנדרשים להצלחה."}}	t	t	2025-09-21 10:32:33.921749	2025-09-21 12:57:38.923506
\.


--
-- Data for Name: nd_footer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nd_footer (id, section_type, column_number, order_index, visible, item_type, content_en, content_ru, content_he, url, icon_class, created_at, updated_at, placeholder_en, placeholder_ru, placeholder_he, button_text_en, button_text_ru, button_text_he) FROM stdin;
1	column	1	1	t	heading	Company	Компания	חברה	\N	\N	2025-09-16 17:22:56.940881	2025-09-16 17:22:56.940881	\N	\N	\N	\N	\N	\N
2	column	1	2	t	link	About Us	О нас	אודותינו	/nd/about.html	\N	2025-09-16 17:22:56.941755	2025-09-16 17:22:56.941755	\N	\N	\N	\N	\N	\N
3	column	1	3	t	link	Our Team	Наша команда	הצוות שלנו	/nd/team.html	\N	2025-09-16 17:22:56.942231	2025-09-16 17:22:56.942231	\N	\N	\N	\N	\N	\N
4	column	1	4	t	link	Careers	Карьера	קריירה	/nd/careers.html	\N	2025-09-16 17:22:56.942689	2025-09-16 17:22:56.942689	\N	\N	\N	\N	\N	\N
5	column	2	1	t	heading	Resources	Ресурсы	משאבים	\N	\N	2025-09-16 17:22:56.943265	2025-09-16 17:22:56.943265	\N	\N	\N	\N	\N	\N
6	column	2	2	t	link	Blog	Блог	בלוג	/nd/blog.html	\N	2025-09-16 17:22:56.943694	2025-09-16 17:22:56.943694	\N	\N	\N	\N	\N	\N
7	column	2	3	t	link	Documentation	Документация	תיעוד	/nd/docs.html	\N	2025-09-16 17:22:56.944147	2025-09-16 17:22:56.944147	\N	\N	\N	\N	\N	\N
8	column	2	4	t	link	FAQ	FAQ	שאלות נפוצות	/nd/faq.html	\N	2025-09-16 17:22:56.944831	2025-09-16 17:22:56.944831	\N	\N	\N	\N	\N	\N
9	column	3	1	t	heading	Support	Поддержка	תמיכה	\N	\N	2025-09-16 17:22:56.94528	2025-09-16 17:22:56.94528	\N	\N	\N	\N	\N	\N
10	column	3	2	t	link	Contact Us	Связаться с нами	צור קשר	/nd/contact.html	\N	2025-09-16 17:22:56.945681	2025-09-16 17:22:56.945681	\N	\N	\N	\N	\N	\N
11	column	3	3	t	link	Help Center	Центр помощи	מרכז עזרה	/nd/help.html	\N	2025-09-16 17:22:56.945959	2025-09-16 17:22:56.945959	\N	\N	\N	\N	\N	\N
12	column	3	4	t	link	Terms of Service	Условия использования	תנאי שימוש	/nd/terms.html	\N	2025-09-16 17:22:56.94638	2025-09-16 17:22:56.94638	\N	\N	\N	\N	\N	\N
13	column	4	1	t	heading	Connect	Связь	התחבר	\N	\N	2025-09-16 17:22:56.946622	2025-09-16 17:22:56.946622	\N	\N	\N	\N	\N	\N
14	column	4	2	t	text	Follow us on social media	Следите за нами в соцсетях	עקבו אחרינו ברשתות החברתיות	\N	\N	2025-09-16 17:22:56.946892	2025-09-16 17:22:56.946892	\N	\N	\N	\N	\N	\N
15	social	\N	1	t	social_icon	Facebook	Facebook	פייסבוק	https://facebook.com/aistudio	fab fa-facebook	2025-09-16 17:22:56.947122	2025-09-16 17:22:56.947122	\N	\N	\N	\N	\N	\N
16	social	\N	2	t	social_icon	Twitter	Twitter	טוויטר	https://twitter.com/aistudio	fab fa-twitter	2025-09-16 17:22:56.947333	2025-09-16 17:22:56.947333	\N	\N	\N	\N	\N	\N
17	social	\N	3	t	social_icon	LinkedIn	LinkedIn	לינקדאין	https://linkedin.com/company/aistudio	fab fa-linkedin	2025-09-16 17:22:56.947524	2025-09-16 17:22:56.947524	\N	\N	\N	\N	\N	\N
18	social	\N	4	t	social_icon	Instagram	Instagram	אינסטגרם	https://instagram.com/aistudio	fab fa-instagram	2025-09-16 17:22:56.947777	2025-09-16 17:22:56.947777	\N	\N	\N	\N	\N	\N
19	copyright	\N	1	t	text	© 2025 AI Studio. All rights reserved.	© 2025 AI Studio. Все права защищены.	© 2025 AI Studio. כל הזכויות שמורות.	\N	\N	2025-09-16 17:22:56.94804	2025-09-16 17:22:56.94804	\N	\N	\N	\N	\N	\N
20	newsletter	\N	1	t	input	\N	\N	\N	\N	\N	2025-09-16 17:22:56.948332	2025-09-16 17:22:56.948332	Enter your email	Введите ваш email	הכנס את האימייל שלך	Subscribe	Подписаться	הרשם
\.


--
-- Data for Name: nd_home; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nd_home (id, section_key, section_type, visible, order_index, content_en, content_ru, content_he, animations_enabled, created_at, updated_at, about_en, about_ru, about_he, pricing_en, pricing_ru, pricing_he, faq_en, faq_ru, faq_he, footer_en, footer_ru, footer_he) FROM stdin;
34	featured_courses	featured	t	0	{"type": "featured", "content": {"type": "featured", "content": {"title": "Featured Courses", "subtitle": "Popular Picks", "description": "Explore our most popular courses designed by industry experts"}, "visible": true, "animations_enabled": true}, "visible": true, "animations_enabled": true}	{"type": "featured", "content": {"type": "featured", "content": {"title": "Улучшите Свои Навыки с Отобранными Курсами", "subtitle": "Популярные Курсы", "description": "Погрузитесь в наш экспертно отобранный выбор популярных курсов, разработанных для того, чтобы вооружить вас навыками, необходимыми для достижения успеха"}, "visible": true, "animations_enabled": true}, "visible": true, "animations_enabled": true}	{"type": "featured", "content": {"type": "featured", "content": {"title": "קורסים מומלצים", "subtitle": "בחירות פופולריות", "description": "חקרו את הקורסים הפופולריים ביותר שלנו מאת מומחי התעשייה"}, "visible": true, "animations_enabled": true}, "visible": true, "animations_enabled": true}	t	2025-09-18 22:20:04.196746	2025-09-22 15:04:43.335254	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}
43	contact	contact	t	0	{"type": "contact", "content": {"type": "contact", "content": {"form": {"error": "Sorry, there was an error sending your message. Please try again.", "success": "Message sent successfully! We'll get back to you soon.", "name_label": "Your Name *", "message_label": "Your Message *"}, "title": "Get In Touch", "content": {"title": "Get In Touch", "description": "Let us know how we can help you on your learning journey", "error_message": "Sorry, there was an error sending your message. Please try again.", "success_message": "Message sent successfully! We'll get back to you soon."}, "description": "Let us know how we can help you on your learning journey"}, "visible": true, "animations_enabled": true}, "visible": true, "animations_enabled": true}	{"type": "contact", "content": {"type": "contact", "content": {"form": {"error": "Извините, произошла ошибка при отправке вашего сообщения. Пожалуйста, попробуйте снова.", "success": "Сообщение отправлено успешно! Мы скоро свяжемся с вами.", "name_label": "Ваше Имя *", "message_label": "Ваше Сообщение *"}, "title": "Связаться с Нами", "content": {"title": "Свяжитесь с нами", "description": "Расскажите, как мы можем помочь вам в вашем учебном путешествии", "error_message": "Извините, при отправке сообщения произошла ошибка. Пожалуйста, попробуйте еще раз.", "success_message": "Сообщение успешно отправлено! Мы скоро с вами свяжемся."}, "description": "Дайте нам знать, как мы можем помочь вам в вашем учебном путешествии"}, "visible": true, "animations_enabled": true}, "visible": true, "animations_enabled": true}	{"type": "contact", "content": {"type": "contact", "content": {"form": {"error": "מצטערים, הייתה שגיאה בשליחת ההודעה שלך. אנא נסה שוב.", "success": "ההודעה נשלחה בהצלחה! נחזור אליך בקרוב.", "name_label": "השם שלך *", "message_label": "ההודעה שלך *"}, "title": "יצירת קשר", "content": {"title": "צור קשר", "description": "ספר לנו כיצד נוכל לעזור לך במסע הלמידה שלך", "error_message": "מצטערים, אירעה שגיאה בשליחת ההודעה. אנא נסה שוב.", "success_message": "ההודעה נשלחה בהצלחה! ניצור איתך קשר בקרוב."}, "description": "הודע לנו כיצד נוכל לעזור לך במסע הלמידה שלך"}, "visible": true, "animations_enabled": true}, "visible": true, "animations_enabled": true}	t	2025-09-19 08:22:32.5846	2025-09-22 15:04:43.398691	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}
53	ui_elements	ui_elements	t	0	{"type": "ui_elements", "content": {"type": "ui_elements", "content": {"buttons": {"get_in_touch": "Get In Touch", "sign_up_today": "Sign Up Today", "browse_courses": "Browse Courses", "course_details": "Course Details", "start_learning": "Start Learning", "check_out_courses": "Check Out Courses"}}, "visible": true, "animations_enabled": true}, "visible": true, "animations_enabled": true}	{"type": "ui_elements", "content": {"type": "ui_elements", "content": {"buttons": {"get_in_touch": "Связаться", "sign_up_today": "Записаться Сегодня", "browse_courses": "Просмотреть Курсы", "course_details": "Детали Курса", "start_learning": "Начать Обучение", "check_out_courses": "Посмотреть Курсы"}}, "visible": true, "animations_enabled": true}, "visible": true, "animations_enabled": true}	{"type": "ui_elements", "content": {"type": "ui_elements", "content": {"buttons": {"get_in_touch": "צור קשר", "sign_up_today": "הרשמה היום", "browse_courses": "עיין בקורסים", "course_details": "פרטי הקורס", "start_learning": "התחל ללמוד", "check_out_courses": "בדוק קורסים"}}, "visible": true, "animations_enabled": true}, "visible": true, "animations_enabled": true}	t	2025-09-19 08:34:35.927272	2025-09-22 15:04:43.370766	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}
31	navigation	navigation	t	0	{"items": [{"text": "Home"}, {"text": "Courses"}, {"text": "Teachers"}, {"text": "Blog"}, {"text": "About Us"}, {"text": "Contact"}, {"text": "Pricing"}]}	{"items": [{"text": "Главная"}, {"text": "Курсы"}, {"text": "Преподаватели"}, {"text": "Блог"}, {"text": "О нас"}, {"text": "Контакты"}, {"text": "Цены"}]}	{"items": [{"text": "בית"}, {"text": "קורסים"}, {"text": "מרצים"}, {"text": "בלוג"}, {"text": "אודותינו"}, {"text": "צור קשר"}, {"text": "תמחור"}]}	t	2025-09-18 22:20:04.19365	2025-09-24 10:38:47.909207	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}
30	hero	hero	t	0	{"type": "hero", "content": {"type": "hero", "content": {"title": "Master AI & Technology", "subtitle": "Transform Your Career with Expert-Led Courses", "expert_led": "Expert-Led Learning", "description": "Join thousands of students learning cutting-edge technology from industry experts11", "button_primary": "Sign Up Today", "button_secondary": "Learn More"}, "visible": true, "animations_enabled": true}, "visible": true, "animations_enabled": true}	{"type": "hero", "content": {"type": "hero", "content": {"title": "Студия ИИ", "subtitle": "Платформа Онлайн Обучения", "cta_text_1": "Начать Обучение", "cta_text_2": "Смотреть Курсы", "description": "Откройте для себя будущее образования с нашими передовыми курсами по ИИ и машинному обучению", "welcome_text": "Добро пожаловать в", "button_primary": "Начать Обучение", "hero_image_alt": "Студия ИИ Герой", "button_secondary": "Смотреть Курсы"}, "visible": true, "animations_enabled": true}, "visible": true, "animations_enabled": true}	{"type": "hero", "content": {"type": "hero", "content": {"title": "שלטו ב-AI וטכנולוגיה", "subtitle": "שנו את הקריירה שלכם עם קורסים מומחים", "expert_led": "למידה עם מומחים", "description": "הצטרפו לאלפי סטודנטים הלומדים טכנולוגיה מתקדמת", "button_primary": "הרשם היום", "button_secondary": "למד עוד"}, "visible": true, "animations_enabled": true}, "visible": true, "animations_enabled": true}	t	2025-09-18 22:20:04.192453	2025-09-22 15:04:43.438425	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}
35	about	about	t	0	{"type": "about", "content": {"type": "about", "content": {"title": "About AI Studio", "subtitle": "50+ Courses, 10,000+ Learners", "description": "We provide world-class education in AI, Machine Learning, and modern technology"}, "visible": true, "animations_enabled": true}, "visible": true, "animations_enabled": true}	{"type": "about", "content": {"type": "about", "content": {"title": "О Студии ИИ", "subtitle": "50+ курсов, 10,000+ учащихся", "description": "Мы предоставляем образование мирового класса в области ИИ и машинного обучения"}, "visible": true, "animations_enabled": true}, "visible": true, "animations_enabled": true}	{"type": "about", "content": {"type": "about", "content": {"title": "אודות AI Studio", "subtitle": "50+ קורסים, 10,000+ לומדים", "description": "אנו מספקים חינוך ברמה עולמית ב-AI ולמידת מכונה"}, "visible": true, "animations_enabled": true}, "visible": true, "animations_enabled": true}	t	2025-09-18 22:20:04.197981	2025-09-22 15:04:43.508142	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}
37	blog	blog	t	0	{"type": "blog", "content": {"type": "blog", "content": {"title": "Your Learning Journey With Our Experts", "subtitle": "News & Articles", "description": "We believe in a structured yet flexible approach to mentorship"}, "visible": true, "animations_enabled": true}, "visible": true, "animations_enabled": true}	{"type": "blog", "content": {"type": "blog", "content": {"title": "Ваше учебное путешествие с нашими экспертами", "subtitle": "Новости и статьи", "categories": ["Веб-Дизайн", "Программирование", "Машинное Обучение", "Облачные Технологии", "Карьера", "Индустрия"], "description": "Мы верим в структурированный, но гибкий подход к наставничеству"}, "visible": true, "animations_enabled": true}, "visible": true, "animations_enabled": true}	{"type": "blog", "content": {"type": "blog", "content": {"title": "מסע הלמידה שלך עם המומחים שלנו", "subtitle": "חדשות ומאמרים", "description": "אנו מאמינים בגישה מובנית אך גמישה לחניכה"}, "visible": true, "animations_enabled": true}, "visible": true, "animations_enabled": true}	t	2025-09-18 22:20:04.199166	2025-09-22 15:04:43.534811	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}
32	stats	statistics	t	0	{"type": "statistics", "content": {"type": "statistics", "content": {"stats": [{"label": "Total Courses Taught", "value": "120", "number": "120+"}, {"label": "Total Happy Learners", "value": "15000", "number": "15,000+"}, {"label": "Years Of Experience", "value": "10", "number": "10+"}, {"label": "Certifications", "value": "25", "number": "25+"}], "title": "Get To Know Your Pathway To Mastery", "mentor": {"bio": "Providing hands-on, real-world training and mentorship, I aim to bridge gap between theoretical knowledge & practical application", "name": "Mrs. Sarah Johnson", "title": "Expert Mentor In Technology", "number": "30+", "description": "With over a decade of experience in the tech industry, our mentor has dedicated their career to empowering students"}, "students": {"title": "Students", "number": "15,000+"}, "subtitle": "Meet Your Mentor", "value_courses": {"title": "Value Courses", "number": "50+"}, "active_courses": {"title": "Active Courses", "number": "120+"}}, "visible": true, "animations_enabled": true}, "visible": true, "animations_enabled": true}	{"type": "statistics", "content": {"type": "statistics", "content": {"stats": [{"label": "Всего Курсов Проведено", "value": "120", "number": "120+"}, {"label": "Всего Довольных Учеников", "value": "15000", "number": "15,000+"}, {"label": "Лет Опыта", "value": "10", "number": "10+"}, {"label": "Сертификаций", "value": "25", "number": "25+"}], "title": "Знакомьтесь с Вашим Путем к Мастерству", "mentor": {"bio": "Предоставляя практическое обучение и наставничество в реальном мире, я стремлюсь преодолеть разрыв между теоретическими знаниями и практическими навыками", "name": "Мистер Сара Джонсон", "title": "Эксперт-наставник в технологиях", "number": "30+", "description": "С более чем десятилетним опытом в технологической индустрии, наш ментор посвятил свою карьеру развитию студентов"}, "students": {"title": "Студенты", "number": "15,000+"}, "subtitle": "Встречайте Вашего Наставника", "value_courses": {"title": "Ценные курсы", "number": "50+"}, "active_courses": {"title": "Активные курсы", "number": "120+"}}, "visible": true, "animations_enabled": true}, "visible": true, "animations_enabled": true}	{"type": "statistics", "content": {"type": "statistics", "content": {"stats": [{"label": "סה״כ קורסים שנלמדו", "value": "120", "number": "120+"}, {"label": "סה״כ לומדים מרוצים", "value": "15000", "number": "15,000+"}, {"label": "שנות ניסיון", "value": "10", "number": "10+"}, {"label": "הסמכות", "value": "25", "number": "25+"}], "title": "הכירו את הדרך שלכם למומחיות", "mentor": {"bio": "מספקת הכשרה מעשית וחניכה בעולם האמיתי, אני שואפת לגשר על הפער בין ידע תיאורטי ליישום מעשי", "name": "גב׳ שרה ג׳ונסון", "title": "מנטורית מומחית בטכנולוגיה", "number": "30+", "description": "עם יותר מעשור של ניסיון בתעשיית הטכנולוגיה, המנטור שלנו הקדיש את הקריירה שלו להעצמת סטודנטים"}, "students": {"title": "סטודנטים", "number": "15,000+"}, "subtitle": "פגשו את המנטור שלכם", "value_courses": {"title": "קורסים יקרי ערך", "number": "50+"}, "active_courses": {"title": "קורסים פעילים", "number": "120+"}}, "visible": true, "animations_enabled": true}, "visible": true, "animations_enabled": true}	t	2025-09-18 22:20:04.194281	2025-09-22 15:04:43.579348	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}
39	companies	companies	t	0	{"type": "companies", "content": {"type": "companies", "content": {"title": "Trusted by Leading Companies", "description": "Our graduates work at top technology companies worldwide"}, "visible": true, "animations_enabled": true}, "visible": true, "animations_enabled": true}	{"type": "companies", "content": {"type": "companies", "content": {"title": "Нам доверяют ведущие компании", "description": "Наши выпускники работают в топовых технологических компаниях"}, "visible": true, "animations_enabled": true}, "visible": true, "animations_enabled": true}	{"type": "companies", "content": {"type": "companies", "content": {"title": "חברות מובילות סומכות עלינו", "description": "הבוגרים שלנו עובדים בחברות הטכנולוגיה המובילות"}, "visible": true, "animations_enabled": true}, "visible": true, "animations_enabled": true}	t	2025-09-18 22:20:04.200312	2025-09-22 15:04:43.482978	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}
41	footer	footer	t	0	{"type": "footer", "content": {"type": "footer", "content": {"links": {"license": "License", "pricing": "Pricing", "sign_in": "Sign In", "sign_up": "Sign Up", "about_us": "About Us", "changelog": "Changelog", "contact_us": "Contact Us", "blog_single": "Blog Single", "style_guide": "Style Guide", "404_not_found": "404 Not Found", "course_single": "Course Single", "pricing_single": "Pricing Single", "reset_password": "Reset Password", "forgot_password": "Forgot Password", "password_protected": "Password Protected"}, "menus": [null, null, null, {"items": [{"href": "/signup", "text": "Sign Up"}, {"href": "/signin", "text": "Sign In"}], "title": "Account"}], "copyright": "Powered by Zohacous", "licensing": "Licensing", "newsletter": {"error": "Oops! Something went wrong while submitting the form.", "label": "Subscribe to Newsletter", "button": "Subscribe", "success": "Thank you for subscribing!", "placeholder": "Enter your email"}, "powered_by": "Powered by", "description": "Empowering learners worldwide with cutting-edge technology education.", "designed_by": "Designed by", "copyright_prefix": "© Copyright"}, "visible": true, "animations_enabled": true}, "visible": true, "animations_enabled": true}	{"type": "footer", "content": {"type": "footer", "content": {"menus": [null, null, null, {"items": [{"href": "/signup", "text": "Регистрация"}, {"href": "/signin", "text": "Войти"}], "title": "Аккаунт"}], "company": {"zohacous": "Zohacous"}, "content": {"email": "zohacous@email.com", "links": {"courses": "Курсы", "license": "Лицензия", "pricing": "Цены", "sign_in": "Вход", "sign_up": "Регистрация", "about_us": "О Нас", "changelog": "История Изменений", "contact_us": "Контакты", "blog_single": "Статья Блога", "style_guide": "Руководство по Стилю", "404_not_found": "404 Страница Не Найдена", "course_single": "Страница Курса", "pricing_single": "Детали Цен", "reset_password": "Сбросить Пароль", "forgot_password": "Забыли Пароль", "password_protected": "Защищено Паролем"}, "menus": [{"title": "Меню"}, {"title": "Контакты"}, {"title": "Служебные Страницы"}], "phone": "+7 (495) 123-45-67", "address": "1234 Валенсия, Офис, СФ, КА", "licensing": "Лицензирование", "newsletter": {"error": "Упс! Что-то пошло не так при отправке формы.", "label": "Подписаться на Рассылку", "button": "Подписаться", "success": "Спасибо! Ваша заявка получена!", "placeholder": "Введите ваш email"}, "powered_by": "Работает на", "description": "Расширяем возможности учащихся по всему миру с помощью передового технологического образования.", "designed_by": "Разработано", "contact_email": "info@aistudio555.com", "contact_prefix": "Контакты:", "copyright_prefix": "© Авторские права"}, "copyright": "Работает на Zohacous", "newsletter": {"error": "Упс! Что-то пошло не так при отправке формы.", "label": "Подписаться на рассылку", "button": "Подписаться", "success": "Спасибо за подписку!", "placeholder": "Введите ваш email"}}, "visible": true, "animations_enabled": true}, "visible": true, "animations_enabled": true}	{"type": "footer", "content": {"type": "footer", "content": {"links": {"license": "רישיון", "pricing": "מחירים", "sign_in": "כניסה", "sign_up": "הרשמה", "about_us": "אודותינו", "changelog": "יומן שינויים", "contact_us": "צור קשר", "blog_single": "מאמר בלוג", "style_guide": "מדריך סגנון", "404_not_found": "404 הדף לא נמצא", "course_single": "דף קורס", "pricing_single": "פרטי מחירים", "reset_password": "איפוס סיסמה", "forgot_password": "שכחת סיסמה", "password_protected": "מוגן בסיסמה"}, "menus": [null, null, null, {"items": [{"href": "/signup", "text": "הרשמה"}, {"href": "/signin", "text": "התחברות"}], "title": "חשבון"}], "copyright": "מופעל על ידי Zohacous", "licensing": "רישוי", "newsletter": {"error": "אופס! משהו השתבש בשליחת הטופס.", "label": "הירשם לניוזלטר", "button": "הירשם", "success": "תודה על ההרשמה!", "placeholder": "הזן את האימייל שלך"}, "powered_by": "מופעל על ידי", "description": "מעצימים לומדים ברחבי העולם עם חינוך טכנולוגי מתקדם.", "designed_by": "עוצב על ידי", "copyright_prefix": "© זכויות יוצרים"}, "visible": true, "animations_enabled": true}, "visible": true, "animations_enabled": true}	t	2025-09-18 22:20:04.201469	2025-09-22 15:04:43.647691	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}
33	course_categories	categories	t	0	{"type": "categories", "content": {"type": "categories", "content": {"items": [{"name": "Web Design", "description": "Master modern web design principles"}, {"name": "Python Programming", "description": "Learn Python from basics to advanced"}, {"name": "Digital Marketing", "description": "Digital marketing strategies and tools"}, {"name": "Business Development", "description": "Grow your business effectively"}, {"name": "App Development", "description": "Build mobile applications"}, {"name": "Machine Learning", "description": "Implement deep learning solutions"}], "title": "Course Categories", "subtitle": "Explore Our Programs", "description": "Choose from our wide range of professional courses"}, "visible": true, "animations_enabled": true}, "visible": true, "animations_enabled": true}	{"type": "categories", "content": {"type": "categories", "content": {"items": [{"name": "Веб-дизайн", "description": "Освойте современные принципы веб-дизайна"}, {"name": "Программирование Python", "description": "Изучите Python от основ до продвинутого уровня"}, {"name": "Цифровой маркетинг", "description": "Стратегии и инструменты цифрового маркетинга"}, {"name": "Развитие бизнеса", "description": "Эффективное развитие вашего бизнеса"}, {"name": "Разработка приложений", "description": "Создавайте мобильные приложения"}, {"name": "Машинное обучение", "description": "Внедряйте решения глубокого обучения"}], "title": "Категории курсов", "subtitle": "Изучите наши программы", "description": "Выберите из широкого спектра профессиональных курсов"}, "visible": true, "animations_enabled": true}, "visible": true, "animations_enabled": true}	{"type": "categories", "content": {"type": "categories", "content": {"items": [{"name": "עיצוב אתרים", "description": "שלוט בעקרונות עיצוב אתרים מודרניים"}, {"name": "תכנות Python", "description": "למד Python מהבסיס ועד מתקדם"}, {"name": "שיווק דיגיטלי", "description": "אסטרטגיות וכלים לשיווק דיגיטלי"}, {"name": "פיתוח עסקי", "description": "פתח את העסק שלך ביעילות"}, {"name": "פיתוח אפליקציות", "description": "בנה אפליקציות מובייל"}, {"name": "למידת מכונה", "description": "יישם פתרונות למידה עמוקה"}], "title": "קטגוריות קורסים", "subtitle": "חקור את התוכניות שלנו", "description": "בחר ממגוון רחב של קורסים מקצועיים"}, "visible": true, "animations_enabled": true}, "visible": true, "animations_enabled": true}	t	2025-09-18 22:20:04.195014	2025-09-22 15:04:43.597528	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}
45	courses	courses	t	0	{"type": "courses", "content": {"type": "courses", "content": {"title": "Enhance Your Skills With Curated Courses", "subtitle": "Featured Courses", "description": "Dive into our expertly curated selection of featured courses, designed to equip you with the skills you need to succeed"}, "visible": true, "animations_enabled": true}, "visible": true, "animations_enabled": true}	{"type": "courses", "content": {"type": "courses", "content": {"content": {"filters": {"all": "Все", "data_science": "Наука о данных", "app_development": "Разработка приложений", "cloud_computing": "Облачные вычисления", "web_development": "Веб-разработка", "machine_learning": "Машинное обучение"}}}, "visible": true, "animations_enabled": true}, "visible": true, "animations_enabled": true}	{"type": "courses", "content": {"type": "courses", "content": {"title": "שפר את הכישורים שלך עם קורסים נבחרים", "subtitle": "קורסים מומלצים", "description": "צלול לתוך המבחר המומחה שלנו של קורסים מומלצים, שתוכננו כדי לצייד אותך עם הכישורים שאתה צריך כדי להצליח"}, "visible": true, "animations_enabled": true}, "visible": true, "animations_enabled": true}	t	2025-09-19 08:24:46.433839	2025-09-22 15:04:43.694015	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}
54	faq_answers	faq_answers	t	0	{"type": "faq_answers", "content": {"type": "faq_answers", "content": {"answer_default": "Zohacous offers a wide range of tech courses, including Web Development, App Development, Machine Learning, Cloud Computing and more"}, "visible": true, "animations_enabled": true}, "visible": true, "animations_enabled": true}	{"type": "faq_answers", "content": {"type": "faq_answers", "content": {"content": {"0": "Zohacous предлагает широкий спектр технических курсов, включая веб-разработку, разработку приложений, машинное обучение, облачные вычисления, анализ данных, кибербезопасность и многое другое. Наши курсы разработаны для всех уровней, от начинающих до продвинутых.", "1": "Просто выберите курс, который вас интересует, и нажмите \\"Записаться\\". Вы получите мгновенный доступ ко всем материалам курса и можете начать обучение в своем собственном темпе.", "2": "Большинство наших курсов для начинающих не требуют предварительных знаний. Для продвинутых курсов мы рекомендуем базовое понимание программирования. Каждый курс содержит список предварительных требований в описании.", "3": "Мы регулярно добавляем новые курсы, чтобы идти в ногу с последними технологиями и тенденциями отрасли. Новые курсы добавляются ежемесячно на основе отзывов студентов и требований рынка.", "4": "Мы постоянно обновляем нашу платформу новыми курсами каждый месяц, основываясь на последних тенденциях в технологиях и потребностях наших студентов."}}, "visible": true, "animations_enabled": true}, "visible": true, "animations_enabled": true}	{"type": "faq_answers", "content": {"type": "faq_answers", "content": {"answer_default": "Zohacous מציעה מגוון רחב של קורסי טכנולוגיה, כולל פיתוח אתרים, פיתוח אפליקציות, למידת מכונה, מחשוב ענן ועוד"}, "visible": true, "animations_enabled": true}, "visible": true, "animations_enabled": true}	t	2025-09-19 08:34:35.928895	2025-09-22 15:04:43.672157	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}
55	ui	ui	t	0	{"type": "ui", "content": {"buttons": {"back_to_blog": "Back to Blog"}}}	{"type": "ui", "content": {"buttons": {"back_to_blog": "Назад к блогу"}}}	{"type": "ui", "content": {"labels": {"level": "רמה", "price": "מחיר", "rating": "דירוג", "lessons": "שיעורים", "reviews": "ביקורות", "duration": "שבועות", "language": "שפה", "students": "סטודנטים", "filter_all": "הכל", "filter_app_development": "פיתוח אפליקציות", "filter_cloud_computing": "מחשוב ענן", "filter_web_development": "פיתוח אתרים", "filter_machine_learning": "למידת מכונה"}, "buttons": {"submit": "שלח", "join_now": "הצטרף עכשיו", "view_all": "ראה הכל", "read_more": "קרא עוד", "subscribe": "הרשם", "contact_us": "צור קשר", "enroll_now": "הרשם עכשיו", "learn_more": "למד עוד", "get_started": "התחל", "back_to_blog": "חזור לבלוג", "sign_up_today": "הרשם היום", "course_details": "פרטי הקורס", "start_learning": "התחל ללמוד", "explore_courses": "חקור קורסים", "uncover_all_courses": "ראה את כל הקורסים"}}}	t	2025-09-19 08:43:32.583471	2025-09-24 23:25:44.935417	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}
48	process	process	t	0	{"type": "process", "content": {"help": {"link": "Drop a line here about what you're looking for"}, "steps": [{"title": "Choose Your Plan First", "number": "Process #01", "details": "Select the plan that best fits your learning needs & budget. We offer monthly plans", "description": "Select the plan that best fits your learning needs & budget"}, {"title": "Access All Courses", "number": "Process #02", "description": "Dive into any course at your own pace, explore new topics, and take advantage of our resources"}, {"title": "Learn And Grow", "number": "Process #03", "description": "Apply your knowledge through hands-on projects and real-world applications"}], "title": "Your Learning Journey With Our Experts", "subtitle": "Detailed Process", "description": "At Zohacous, we believe in a structured yet flexible approach to mentorship designed to help you achieve your goals"}, "visible": true, "animations_enabled": true}	{"type": "process", "content": {"help": {"link": "Напишите здесь о том, что вы ищете"}, "steps": [{"title": "Сначала Выберите Свой План", "number": "Процесс #01", "details": "Выберите план, который лучше всего соответствует вашим потребностям в обучении и бюджету. Мы предлагаем месячные планы"}, {"title": "Доступ ко Всем Курсам", "number": "Процесс #02", "description": "Погрузитесь в любой курс в своем темпе, изучайте новые темы и воспользуйтесь нашими ресурсами"}, {"title": "Учитесь и Растите", "number": "Процесс #03", "description": "Применяйте свои знания через практические проекты и приложения в реальном мире"}], "title": "Ваше Учебное Путешествие с Нашими Экспертами", "subtitle": "Детальный Процесс", "description": "В Zohacous мы верим в структурированный, но гибкий подход к наставничеству, разработанный, чтобы помочь вам достичь ваших целей"}, "visible": true, "animations_enabled": true}	{"type": "process", "content": {"help": {"link": "כתוב כאן על מה שאתה מחפש"}, "steps": [{"title": "בחר את התוכנית שלך תחילה", "number": "תהליך #01", "details": "בחר את התוכנית שמתאימה ביותר לצרכי הלמידה והתקציב שלך. אנו מציעים תוכניות חודשיות"}, {"title": "גישה לכל הקורסים", "number": "תהליך #02", "description": "צלול לכל קורס בקצב שלך, חקור נושאים חדשים ונצל את המשאבים שלנו"}, {"title": "למד וגדל", "number": "תהליך #03", "description": "יישם את הידע שלך דרך פרויקטים מעשיים ויישומים בעולם האמיתי"}], "title": "מסע הלמידה שלך עם המומחים שלנו", "subtitle": "תהליך מפורט", "description": "ב-Zohacous, אנו מאמינים בגישה מובנית אך גמישה לחניכה שנועדה לעזור לך להשיג את המטרות שלך"}, "visible": true, "animations_enabled": true}	t	2025-09-19 08:24:46.438658	2025-09-22 15:36:27.012308	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}
36	testimonials	testimonials	t	0	{"type": "testimonials", "content": {"title": "Your Learning Journey With Our Experts", "description": "At Zohacous, we believe in a structured yet flexible approach to mentorship designed to help you achieve your goals at every step."}, "visible": true, "animations_enabled": true}	{"type": "testimonials", "content": {"title": "Ваш путь обучения с нашими экспертами", "description": "В Zohacous мы верим в структурированный, но гибкий подход к наставничеству, разработанный для достижения ваших целей на каждом этапе."}, "visible": true, "animations_enabled": true}	{"type": "testimonials", "content": {"title": "מסע הלמידה שלך עם המומחים שלנו", "description": "ב-Zohacous, אנו מאמינים בגישה מובנית אך גמישה לחניכה המיועדת לעזור לך להשיג את המטרות שלך בכל שלב."}, "visible": true, "animations_enabled": true}	t	2025-09-18 22:20:04.198688	2025-09-22 15:36:27.027493	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}
52	testimonials_meta	testimonials_meta	t	0	{"type": "testimonials_meta", "content": {"type": "testimonials_meta", "content": {"title": "Your Learning Journey With Our Experts", "description": "At Zohacous, we believe in a structured yet flexible approach to mentorship designed to help you achieve your goals"}, "visible": true, "animations_enabled": true}, "visible": true, "animations_enabled": true}	{"type": "testimonials_meta", "content": {"type": "testimonials_meta", "content": {"title": "Ваше Учебное Путешествие с Нашими Экспертами", "description": "В Zohacous мы верим в структурированный, но гибкий подход к наставничеству, разработанный, чтобы помочь вам достичь ваших целей"}, "visible": true, "animations_enabled": true}, "visible": true, "animations_enabled": true}	{"type": "testimonials_meta", "content": {"type": "testimonials_meta", "content": {"title": "מסע הלמידה שלך עם המומחים שלנו", "description": "ב-Zohacous, אנו מאמינים בגישה מובנית אך גמישה לחניכה שנועדה לעזור לך להשיג את המטרות שלך"}, "visible": true, "animations_enabled": true}, "visible": true, "animations_enabled": true}	t	2025-09-19 08:34:35.923935	2025-09-22 15:04:43.555873	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}
44	cta_bottom	call_to_action	t	0	{"type": "call_to_action", "content": {"title": "Discover A World Of Learning Opportunities", "description": "Don't wait to transform your career and unlock your full potential. Join our community of learners today and elevate your tech career with expert-led courses."}, "visible": true, "animations_enabled": true}	{"type": "call_to_action", "content": {"title": "Откройте Мир Возможностей Для Обучения", "description": "Не ждите, чтобы трансформировать свою карьеру и раскрыть свой полный потенциал. Присоединяйтесь к нашему сообществу учащихся сегодня и повысьте свою техническую карьеру с курсами под руководством экспертов."}, "visible": true, "animations_enabled": true}	{"type": "call_to_action", "content": {"title": "גלה עולם של הזדמנויות למידה", "description": "אל תחכה לשנות את הקריירה שלך ולפתוח את הפוטנציאל המלא שלך. הצטרף לקהילת הלומדים שלנו היום והעלה את הקריירה הטכנולוגית שלך עם קורסים בהנחיית מומחים."}, "visible": true, "animations_enabled": true}	t	2025-09-19 08:22:32.585271	2025-09-22 15:36:27.034101	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}
56	cart	cart	t	0	{"type": "cart", "content": {"type": "cart", "content": {"title": "Your Cart", "errors": {"quantity_not_available": "Product is not available in this quantity."}, "subtotal": "Subtotal", "hang_tight": "Hang tight...", "cart_is_empty": "Your cart is empty", "no_items_found": "No items found.", "continue_to_checkout": "Continue to Checkout", "quantity_not_available": "Quantity not available"}, "visible": true, "animations_enabled": true}, "visible": true, "animations_enabled": true}	{"type": "cart", "content": {"type": "cart", "content": {"title": "Ваша корзина", "errors": {"quantity_not_available": "Товар недоступен в таком количестве."}, "subtotal": "Промежуточный Итог", "hang_tight": "Подождите...", "cart_is_empty": "Ваша корзина пуста", "no_items_found": "Товары не найдены.", "continue_to_checkout": "Перейти к Оформлению", "quantity_not_available": "Количество недоступно"}, "visible": true, "animations_enabled": true}, "visible": true, "animations_enabled": true}	{"type": "cart", "content": {"type": "cart", "content": {"title": "העגלה שלך", "errors": {"quantity_not_available": "המוצר אינו זמין בכמות זו."}, "subtotal": "סכום ביניים", "hang_tight": "רגע...", "cart_is_empty": "העגלה שלך ריקה", "no_items_found": "לא נמצאו פריטים.", "continue_to_checkout": "המשך לתשלום", "quantity_not_available": "הכמות לא זמינה"}, "visible": true, "animations_enabled": true}, "visible": true, "animations_enabled": true}	t	2025-09-19 08:43:32.586649	2025-09-22 15:04:43.783161	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}
40	misc	miscellaneous	t	0	{"type": "miscellaneous", "content": {"type": "miscellaneous", "content": {"content": {"no_items": "No items found", "explore_plans": "Explore Plans Features"}}, "visible": true, "animations_enabled": true}, "visible": true, "animations_enabled": true}	{"type": "miscellaneous", "content": {"type": "miscellaneous", "content": {"content": {"no_items": "Ничего не найдено", "explore_plans": "Изучить планы и функции"}}, "visible": true, "animations_enabled": true}, "visible": true, "animations_enabled": true}	{"type": "miscellaneous", "content": {"type": "miscellaneous", "content": {"content": {"no_items": "לא נמצאו פריטים", "explore_plans": "חקור תוכניות ותכונות"}}, "visible": true, "animations_enabled": true}, "visible": true, "animations_enabled": true}	t	2025-09-18 22:20:04.200887	2025-09-23 15:06:45.585045	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}
47	pricing	pricing	t	0	{"type": "pricing", "content": {"plans": [{"name": "Monthly Plan", "price": "$29", "period": "Per Month"}, {"name": "Annual Plan", "price": "$299", "period": "Per Year"}], "title": "Invest in Future with Subscription Plans", "features": {"support": "24/7 Support", "certificate": "Certificate of Completion", "career_support": "Career Support", "webinar_access": "Webinar Access", "course_materials": "Course Materials", "support_sessions": "Support Sessions", "unlimited_access": "Unlimited Access", "community_support": "Community Support", "hands_on_projects": "Hands-on Projects"}, "subtitle": "Affordable Plans", "description": "Dive into a world of learning with diverse and extensive range of tech courses designed to cater to every skill level"}, "visible": true, "animations_enabled": true}	{"type": "pricing", "content": {"plans": [{"name": "Месячный План", "price": "$29", "period": "в месяц"}, {"name": "Годовой План", "price": "$299", "period": "в год"}], "title": "Инвестируйте в Будущее с Планами Подписки", "features": {"support": "Поддержка 24/7", "certificate": "Сертификат об Окончании", "career_support": "Карьерная Поддержка", "webinar_access": "Доступ к Вебинарам", "course_materials": "Учебные Материалы", "support_sessions": "Сессии Поддержки", "unlimited_access": "Неограниченный Доступ", "community_support": "Поддержка Сообщества", "hands_on_projects": "Практические Проекты"}, "subtitle": "Доступные Планы", "description": "Погрузитесь в мир обучения с разнообразным спектром технических курсов"}, "visible": true, "animations_enabled": true}	{"type": "pricing", "content": {"plans": [{"name": "תוכנית חודשית", "price": "$29", "period": "לחודש"}, {"name": "תוכנית שנתית", "price": "$299", "period": "לשנה"}], "title": "השקיעו בעתיד עם תוכניות מנוי", "features": {"support": "תמיכה 24/7", "certificate": "תעודת סיום", "career_support": "תמיכת קריירה", "webinar_access": "גישה לוובינרים", "course_materials": "חומרי לימוד", "support_sessions": "מפגשי תמיכה", "unlimited_access": "גישה בלתי מוגבלת", "community_support": "תמיכת קהילה", "hands_on_projects": "פרויקטים מעשיים"}, "subtitle": "תוכניות במחיר סביר", "description": "צללו לעולם של למידה עם מגוון רחב ומקיף של קורסי טכנולוגיה המיועדים לכל רמת מיומנות"}, "visible": true, "animations_enabled": true}	t	2025-09-19 08:24:46.438004	2025-09-22 15:36:26.988235	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}
38	cta	call_to_action	t	0	{"type": "call_to_action", "content": {"type": "call_to_action", "content": {"title": "Ready to Transform Your Career?", "subtitle": "Start Learning Today", "button_text": "Get Started", "description": "Join thousands of successful students who have transformed their careers"}, "visible": true, "animations_enabled": true}, "visible": true, "animations_enabled": true}	{"type": "call_to_action", "content": {"type": "call_to_action", "content": {"content": {"title": "Откройте Мир Возможностей Обучения", "subtitle": "Начните учиться сегодня", "description": "Не ждите, чтобы трансформировать карьеру и раскрыть свой полный потенциал. Присоединяйтесь к нашему сообществу увлеченных учеников и получите доступ к широкому спектру курсов."}}, "visible": true, "animations_enabled": true}, "visible": true, "animations_enabled": true}	{"type": "call_to_action", "content": {"type": "call_to_action", "content": {"title": "מוכנים לשנות את הקריירה שלכם?", "subtitle": "התחילו ללמוד היום", "button_text": "התחל עכשיו", "description": "הצטרפו לאלפי סטודנטים מצליחים ששינו את הקריירה שלהם"}, "visible": true, "animations_enabled": true}, "visible": true, "animations_enabled": true}	t	2025-09-18 22:20:04.199611	2025-09-22 15:04:43.814838	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}
50	faq	faq	t	0	{"type": "faq", "content": {"items": [{"answer": "Zohacous offers a wide range of tech courses, including Web Development, App Development, Machine Learning, Cloud Computing, Digital Marketing, and Business Development. Each course is designed by industry experts.", "question": "What types of courses does Zohacous offer?"}, {"answer": "Getting started is easy! Simply browse our course catalog, select the course that interests you, click \\"Enroll Now\\", and create your account. You'll have immediate access to all course materials.", "question": "How do I get started with a course?"}, {"answer": "Prerequisites vary by course. Beginner courses require no prior experience, while advanced courses may require foundational knowledge. Each course page clearly lists any prerequisites.", "question": "Are there any prerequisites for enrolling in courses?"}, {"answer": "Yes! Our platform is fully responsive and optimized for mobile devices. You can learn on-the-go using your smartphone or tablet through any web browser.", "question": "Can I access the courses on mobile devices?"}, {"answer": "We add new courses monthly to keep our content fresh and aligned with industry trends. Subscribe to our newsletter to stay updated on new course launches.", "question": "How often are new courses added to the platform?"}, {"answer": "Yes, you receive a certificate of completion for every course you finish. These certificates can be shared on LinkedIn and added to your professional portfolio.", "question": "Do you offer certificates upon course completion?"}], "title": "Your Questions Answered Here", "cta_text": "Still don't find out what you are looking for ??", "subtitle": "FAQ", "description": "Find answers to the most common questions about our courses and platform"}, "visible": true, "animations_enabled": true}	{"type": "faq", "content": {"items": [{"answer": "Мы предлагаем широкий спектр курсов, включая веб-разработку, разработку приложений, машинное обучение, облачные вычисления и науку о данных.", "question": "Какие типы курсов предлагает Zohacous?"}, {"answer": "Просто выберите курс, зарегистрируйтесь и начните учиться в своем темпе с нашими экспертными инструкторами.", "question": "Как начать обучение на курсе?"}, {"answer": "Большинство наших курсов подходят для начинающих, но некоторые продвинутые курсы могут требовать базовых знаний.", "question": "Есть ли предварительные требования для записи на курсы?"}, {"answer": "Мы регулярно добавляем новые курсы каждый месяц, чтобы идти в ногу с последними технологическими тенденциями.", "question": "Как часто добавляются новые курсы на платформу?"}, {"answer": "Да, все наши курсы предоставляют сертификаты об окончании после успешного завершения.", "question": "Предлагаете ли вы сертификаты по завершении?"}], "title": "Ответы на Ваши Вопросы", "cta_text": "Все еще не нашли то, что искали?", "subtitle": "Часто задаваемые вопросы", "description": "Найдите ответы на самые распространенные вопросы о наших курсах и платформе"}, "visible": true, "animations_enabled": true}	{"type": "faq", "content": {"items": [{"answer": "Zohacous מציע מגוון רחב של קורסי טכנולוגיה, כולל פיתוח אתרים, פיתוח אפליקציות, למידת מכונה, מחשוב ענן, שיווק דיגיטלי ופיתוח עסקי. כל קורס מעוצב על ידי מומחים בתעשייה.", "question": "אילו סוגי קורסים מציע Zohacous?"}, {"answer": "להתחיל זה קל! פשוט עיין בקטלוג הקורסים שלנו, בחר את הקורס שמעניין אותך, לחץ על \\"הרשם עכשיו\\", וצור את החשבון שלך. תקבל גישה מיידית לכל חומרי הקורס.", "question": "איך מתחילים עם קורס?"}, {"answer": "דרישות הקדם משתנות לפי קורס. קורסים למתחילים לא דורשים ניסיון קודם, בעוד שקורסים מתקדמים עשויים לדרוש ידע בסיסי. כל דף קורס מפרט בבירור את דרישות הקדם.", "question": "האם יש דרישות קדם להרשמה לקורסים?"}, {"answer": "כן! הפלטפורמה שלנו רספונסיבית לחלוטין ומותאמת למכשירים ניידים. אתה יכול ללמוד תוך כדי תנועה באמצעות הסמארטפון או הטאבלט שלך דרך כל דפדפן אינטרנט.", "question": "האם אני יכול לגשת לקורסים במכשירים ניידים?"}, {"answer": "אנו מוסיפים קורסים חדשים מדי חודש כדי לשמור על התוכן שלנו רענן ומעודכן עם מגמות התעשייה. הירשם לניוזלטר שלנו כדי להישאר מעודכן על השקות קורסים חדשים.", "question": "באיזו תדירות נוספים קורסים חדשים לפלטפורמה?"}, {"answer": "כן, אתה מקבל תעודת סיום עבור כל קורס שאתה מסיים. ניתן לשתף תעודות אלו בלינקדאין ולהוסיף אותן לתיק העבודות המקצועי שלך.", "question": "האם אתם מציעים תעודות בסיום הקורס?"}], "title": "התשובות לשאלות שלך", "cta_text": "עדיין לא מצאת את מה שחיפשת?", "subtitle": "שאלות נפוצות", "description": "מצא תשובות לשאלות הנפוצות ביותר על הקורסים והפלטפורמה שלנו"}, "visible": true, "animations_enabled": true}	t	2025-09-19 08:24:46.44107	2025-09-22 15:36:27.001217	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}
46	features	features	t	0	{"type": "features", "content": {"type": "features", "content": {"items": [{"title": "Cutting-Edge Teaching Techniques", "description": "Utilizes cutting-edge teaching techniques & tools to deliver engaging, interactive & effective learning"}, {"title": "Certified Professional In Your Needs", "description": "Numerous industry certifications from leading organizations ensuring quality guidance"}, {"title": "Expert Instructor Of Industry", "description": "Providing hands-on, real-world training and mentorship, bridging gap between theoretical knowledge and practical application"}], "title": "What Makes Zohacous Your Best Choice", "subtitle": "Meet Your Mentor", "description": "We offer a wide range of courses, including Web Development, App Development, Machine Learning, Cloud Computing and more"}, "visible": true, "animations_enabled": true}, "visible": true, "animations_enabled": true}	{"type": "features", "content": {"type": "features", "content": {"items": [{"title": "Передовые методы обучения", "description": "Использует передовые методы и инструменты обучения для проведения увлекательного и эффективного обучения"}, {"title": "Сертифицированный профессионал", "description": "Многочисленные отраслевые сертификаты от ведущих организаций, обеспечивающие качественное руководство"}, {"title": "Эксперт-инструктор отрасли", "description": "Предоставление практического обучения и наставничества, устранение разрыва между теорией и практикой"}], "title": "Почему выбирают нас", "subtitle": "Наши преимущества", "description": "Передовое образование для вашего успеха", "feature_1_title": "Экспертные преподаватели", "feature_2_title": "Гибкое обучение", "feature_3_title": "Практические проекты", "feature_4_title": "Сертификация", "feature_5_title": "Поддержка карьеры", "feature_6_title": "Сообщество", "feature_1_description": "Учитесь у лидеров индустрии с многолетним опытом", "feature_2_description": "Учитесь в своем темпе с доступом 24/7", "feature_3_description": "Применяйте знания в реальных проектах", "feature_4_description": "Получите признанные сертификаты", "feature_5_description": "Помощь в трудоустройстве и развитии карьеры", "feature_6_description": "Присоединяйтесь к активному сообществу учащихся"}, "visible": true, "animations_enabled": true}, "visible": true, "animations_enabled": true}	{"type": "features", "content": {"type": "features", "content": {"items": [{"title": "טכניקות הוראה חדשניות", "description": "משתמש בטכניקות וכלי הוראה חדשניים כדי לספק למידה מרתקת ואפקטיבית"}, {"title": "מקצוען מוסמך לצרכיך", "description": "הסמכות רבות בתעשייה מארגונים מובילים המבטיחות הדרכה איכותית"}, {"title": "מדריך מומחה בתעשייה", "description": "מספק הכשרה מעשית וחניכה בעולם האמיתי, מגשר על הפער בין ידע תיאורטי ליישום מעשי"}], "title": "מה הופך את Zohacous לבחירה הטובה ביותר שלך", "subtitle": "הכר את המנטור שלך", "description": "אנו מציעים מגוון רחב של קורסים, כולל פיתוח אתרים, פיתוח אפליקציות, למידת מכונה, מחשוב ענן ועוד"}, "visible": true, "animations_enabled": true}, "visible": true, "animations_enabled": true}	t	2025-09-19 08:24:46.43668	2025-09-22 15:04:43.831908	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}
42	testimonials_data	testimonials_data	t	0	{"content": {"0": {"name": "Olivia Martinez", "text": "The flexibility of the subscription plans allowed me to learn at my own pace. The quality of the content is unmatched. The flexibility of the subscription plans allowed me to learn at my own pace.", "course_taken": "Machine Learning Engineer"}, "1": {"name": "David Kim", "text": "I have mastered web development and am now freelancing successfully. The projects were particularly helpful in building my portfolio. I have mastered web development and am now freelancing successfully.", "course_taken": "Freelance Web Developer"}, "2": {"name": "Michael Bennett", "text": "She provided me with the knowledge and confidence to switch careers. The comprehensive curriculum covered everything I needed to succeed. She provided me with the knowledge and confidence.", "course_taken": "Full-Stack Developer"}, "3": {"name": "Emily Turner", "text": "The courses are top-notch practical approach and expert instructor made learning engaging and effective. It transformed my career. The hand on projects and personalized mentorship.", "course_taken": "Software Developer"}}}	{"content": {"0": {"name": "Оливия Мартинес", "text": "Гибкость планов подписки позволила мне учиться в своем собственном темпе. Качество контента не имеет себе равных. Гибкость планов подписки позволила мне учиться в своем собственном темпе.", "course_taken": "Инженер машинного обучения"}, "1": {"name": "Дэвид Ким", "text": "Я освоил веб-разработку и теперь успешно работаю фрилансером. Проекты были особенно полезны для создания моего портфолио. Я освоил веб-разработку и теперь успешно работаю фрилансером.", "course_taken": "Фриланс веб-разработчик"}, "2": {"name": "Майкл Беннетт", "text": "Она дала мне знания и уверенность для смены карьеры. Комплексная учебная программа охватывала все, что мне нужно для успеха. Она дала мне знания и уверенность.", "course_taken": "Full-Stack разработчик"}, "3": {"name": "Эмили Тернер", "text": "Курсы высшего уровня, практический подход и опытный инструктор сделали обучение увлекательным и эффективным. Это изменило мою карьеру. Практические проекты и персонализированное наставничество.", "course_taken": "Разработчик программного обеспечения"}}}	{"content": {"0": {"name": "אוליביה מרטינז", "text": "הגמישות של תוכניות המנוי אפשרה לי ללמוד בקצב שלי. איכות התוכן היא ללא תחרות. הגמישות של תוכניות המנוי אפשרה לי ללמוד בקצב שלי.", "course_taken": "מהנדסת למידת מכונה"}, "1": {"name": "דייוויד קים", "text": "שלטתי בפיתוח אתרים וכעת עובד כפרילנסר בהצלחה. הפרויקטים היו מועילים במיוחד לבניית הפורטפוליו שלי. שלטתי בפיתוח אתרים וכעת עובד כפרילנסר בהצלחה.", "course_taken": "מפתח אתרים פרילנסר"}, "2": {"name": "מייקל בנט", "text": "היא סיפקה לי את הידע והביטחון לעבור קריירה. תוכנית הלימודים המקיפה כיסתה את כל מה שאני צריך כדי להצליח. היא סיפקה לי את הידע והביטחון.", "course_taken": "מפתח Full-Stack"}, "3": {"name": "אמילי טרנר", "text": "הקורסים ברמה הגבוהה ביותר, הגישה המעשית והמדריך המומחה הפכו את הלמידה למרתקת ויעילה. זה שינה את הקריירה שלי. הפרויקטים המעשיים והחניכה האישית.", "course_taken": "מפתחת תוכנה"}, "4": {"name": "טארק אחמד", "text": "Zohacous נתן לי את הכיוון שהייתי צריך כדי להאיץ את הקריירה שלי. המנטורים המומחים תמיד היו זמינים להדריך אותי.", "course_taken": "מעצב גרפי"}, "5": {"name": "שרה ג״מיל", "text": "אני לא יכול להמליץ מספיק על Zohacous. הקורס היה מובנה היטב, והחניכה הייתה בדיוק מה שהייתי צריך.", "course_taken": "יזמת מתחילה"}, "6": {"name": "נדיה חאן", "text": "תוכנית Zohacous הייתה בדיוק מה שחיפשתי. היא נתנה לי את ההזדמנות ללמוד ממומחים בתעשייה.", "course_taken": "מפתחת תוכנה"}}}	t	2025-09-19 08:22:32.581705	2025-09-24 09:59:53.028331	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}
49	awards	awards	t	0	{"content": {"items": [{"title": "Online Mentorship Award", "description": "Recognized for excellence in online mentorship and student support"}, {"title": "Class Mentorship Program", "description": "Best-in-class mentorship program for technology professionals"}, {"title": "Remote Learning Excellence", "description": "Leading the way in remote learning methodologies"}, {"title": "Technology Training Leader", "description": "Award-winning technology training programs"}], "title": "Awards That Define Our Excellence.", "description": "Dive into a world of learning with diverse & extensive range of tech courses designed to cater to every interest."}}	{"content": {"items": [{"title": "Награда за онлайн-наставничество", "description": "Признание за excellence в онлайн-наставничестве и поддержке студентов"}, {"title": "Программа наставничества в классе", "description": "Лучшая программа наставничества для технических специалистов"}, {"title": "Совершенство дистанционного обучения", "description": "Ведущие методологии дистанционного обучения"}, {"title": "Лидер технического обучения", "description": "Награждённые программы технического обучения"}], "title": "Награды, определяющие наше совершенство.", "description": "Погрузитесь в мир обучения с разнообразным и обширным ассортиментом технических курсов, предназначенных для каждого интереса."}}	{"content": {"items": [{"title": "פרס חונכות מקוונת", "description": "הוכרה למצוינות בחונכות מקוונת ותמיכת סטודנטים"}, {"title": "תוכנית חונכות כיתתית", "description": "תוכנית החונכות הטובה ביותר לאנשי מקצוע בתחום הטכנולוגיה"}, {"title": "מצוינות בלמידה מרחוק", "description": "מובילים את הדרך במתודולוגיות למידה מרחוק"}, {"title": "מנהיג הכשרה טכנולוגית", "description": "תוכניות הכשרה טכנולוגיות עטורות פרסים"}], "title": "פרסים המגדירים את המצוינות שלנו.", "description": "צלול לתוך עולם של למידה עם מגוון נרחב של קורסי טכנולוgiה המיועדים לענות על כל עניין."}}	t	2025-09-19 08:24:46.440225	2025-09-24 10:45:25.452356	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}	{}
\.


--
-- Data for Name: nd_home_page; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nd_home_page (id, section_name, content_en, content_ru, content_he, visible, display_order, created_at, updated_at) FROM stdin;
1	hero	{"title": "Hero Title", "subtitle": "Hero Subtitle", "description": "Content for Hero section"}	{"title": "Hero Title", "subtitle": "Hero Subtitle", "description": "Content for Hero section"}	{"title": "Hero Title", "subtitle": "Hero Subtitle", "description": "Content for Hero section"}	t	1	2025-09-16 23:29:29.679955	2025-09-16 23:29:29.679955
2	course_categories	{"title": "Course Categories Title", "subtitle": "Course Categories Subtitle", "description": "Content for Course Categories section"}	{"title": "Course Categories Title", "subtitle": "Course Categories Subtitle", "description": "Content for Course Categories section"}	{"title": "Course Categories Title", "subtitle": "Course Categories Subtitle", "description": "Content for Course Categories section"}	t	2	2025-09-16 23:29:29.682728	2025-09-16 23:29:29.682728
3	about	{"title": "About Us Title", "subtitle": "About Us Subtitle", "description": "Content for About Us section"}	{"title": "About Us Title", "subtitle": "About Us Subtitle", "description": "Content for About Us section"}	{"title": "About Us Title", "subtitle": "About Us Subtitle", "description": "Content for About Us section"}	t	3	2025-09-16 23:29:29.683355	2025-09-16 23:29:29.683355
4	featured_courses	{"title": "Featured Courses Title", "subtitle": "Featured Courses Subtitle", "description": "Content for Featured Courses section"}	{"title": "Featured Courses Title", "subtitle": "Featured Courses Subtitle", "description": "Content for Featured Courses section"}	{"title": "Featured Courses Title", "subtitle": "Featured Courses Subtitle", "description": "Content for Featured Courses section"}	t	4	2025-09-16 23:29:29.683822	2025-09-16 23:29:29.683822
5	why_choose	{"title": "Why Choose Us Title", "subtitle": "Why Choose Us Subtitle", "description": "Content for Why Choose Us section"}	{"title": "Why Choose Us Title", "subtitle": "Why Choose Us Subtitle", "description": "Content for Why Choose Us section"}	{"title": "Why Choose Us Title", "subtitle": "Why Choose Us Subtitle", "description": "Content for Why Choose Us section"}	t	5	2025-09-16 23:29:29.68428	2025-09-16 23:29:29.68428
6	pricing_preview	{"title": "Pricing Preview Title", "subtitle": "Pricing Preview Subtitle", "description": "Content for Pricing Preview section"}	{"title": "Pricing Preview Title", "subtitle": "Pricing Preview Subtitle", "description": "Content for Pricing Preview section"}	{"title": "Pricing Preview Title", "subtitle": "Pricing Preview Subtitle", "description": "Content for Pricing Preview section"}	t	6	2025-09-16 23:29:29.684781	2025-09-16 23:29:29.684781
7	process	{"title": "Process Steps Title", "subtitle": "Process Steps Subtitle", "description": "Content for Process Steps section"}	{"title": "Process Steps Title", "subtitle": "Process Steps Subtitle", "description": "Content for Process Steps section"}	{"title": "Process Steps Title", "subtitle": "Process Steps Subtitle", "description": "Content for Process Steps section"}	t	7	2025-09-16 23:29:29.685732	2025-09-16 23:29:29.685732
9	testimonials	{"title": "Testimonials Title", "subtitle": "Testimonials Subtitle", "description": "Content for Testimonials section"}	{"title": "Testimonials Title", "subtitle": "Testimonials Subtitle", "description": "Content for Testimonials section"}	{"title": "Testimonials Title", "subtitle": "Testimonials Subtitle", "description": "Content for Testimonials section"}	t	9	2025-09-16 23:29:29.687094	2025-09-16 23:29:29.687094
10	faq	{"title": "FAQ Title", "subtitle": "FAQ Subtitle", "description": "Content for FAQ section"}	{"title": "FAQ Title", "subtitle": "FAQ Subtitle", "description": "Content for FAQ section"}	{"title": "FAQ Title", "subtitle": "FAQ Subtitle", "description": "Content for FAQ section"}	t	10	2025-09-16 23:29:29.688285	2025-09-16 23:29:29.688285
11	blog_preview	{"title": "Blog Preview Title", "subtitle": "Blog Preview Subtitle", "description": "Content for Blog Preview section"}	{"title": "Blog Preview Title", "subtitle": "Blog Preview Subtitle", "description": "Content for Blog Preview section"}	{"title": "Blog Preview Title", "subtitle": "Blog Preview Subtitle", "description": "Content for Blog Preview section"}	t	11	2025-09-16 23:29:29.688951	2025-09-16 23:29:29.688951
12	track	{"title": "Track Ticker Title", "subtitle": "Track Ticker Subtitle", "description": "Content for Track Ticker section"}	{"title": "Track Ticker Title", "subtitle": "Track Ticker Subtitle", "description": "Content for Track Ticker section"}	{"title": "Track Ticker Title", "subtitle": "Track Ticker Subtitle", "description": "Content for Track Ticker section"}	t	12	2025-09-16 23:29:29.689554	2025-09-16 23:29:29.689554
13	cta	{"title": "Call to Action Title", "subtitle": "Call to Action Subtitle", "description": "Content for Call to Action section"}	{"title": "Call to Action Title", "subtitle": "Call to Action Subtitle", "description": "Content for Call to Action section"}	{"title": "Call to Action Title", "subtitle": "Call to Action Subtitle", "description": "Content for Call to Action section"}	t	13	2025-09-16 23:29:29.69028	2025-09-16 23:29:29.69028
8	awards	{"items": [{"icon": "🏆", "year": "2024", "title": "Best Online Learning Platform", "description": "Awarded by EdTech Innovation Awards for outstanding online education delivery"}, {"icon": "🥇", "year": "2023", "title": "Excellence in AI Education", "description": "Recognized for pioneering AI and machine learning curriculum"}, {"icon": "⭐", "year": "2023", "title": "Top Student Satisfaction", "description": "98% student satisfaction rate across all courses"}, {"icon": "💡", "year": "2022", "title": "Innovation in Teaching", "description": "Revolutionary approach to hands-on technical education"}], "title": "Awards That Define Our Excellence.", "subtitle": "Recognition of our commitment to quality education"}	{"items": [{"icon": "🏆", "year": "2024", "title": "Лучшая платформа онлайн-обучения", "description": "Награждена EdTech Innovation Awards за выдающееся онлайн-образование"}, {"icon": "🥇", "year": "2023", "title": "Превосходство в обучении ИИ", "description": "Признание за новаторскую учебную программу по ИИ и машинному обучению"}, {"icon": "⭐", "year": "2023", "title": "Высшая удовлетворенность студентов", "description": "98% удовлетворенность студентов по всем курсам"}, {"icon": "💡", "year": "2022", "title": "Инновации в преподавании", "description": "Революционный подход к практическому техническому образованию"}], "title": "Награды, определяющие наше превосходство.", "subtitle": "Признание нашей приверженности качественному образованию"}	{"items": [{"icon": "🏆", "year": "2024", "title": "פלטפורמת הלמידה המקוונת הטובה ביותר", "description": "זכתה בפרס EdTech Innovation Awards על חינוך מקוון יוצא דופן"}, {"icon": "🥇", "year": "2023", "title": "מצוינות בחינוך AI", "description": "הוכרה על תוכנית לימודים חלוצית ב-AI ולמידת מכונה"}, {"icon": "⭐", "year": "2023", "title": "שביעות רצון גבוהה של סטודנטים", "description": "98% שביעות רצון של סטודנטים בכל הקורסים"}, {"icon": "💡", "year": "2022", "title": "חדשנות בהוראה", "description": "גישה מהפכנית לחינוך טכני מעשי"}], "title": "פרסים שמגדירים את המצוינות שלנו.", "subtitle": "הכרה במחויבות שלנו לחינוך איכותי"}	t	8	2025-09-16 23:29:29.686229	2025-09-16 23:29:29.726231
\.


--
-- Data for Name: nd_menu; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nd_menu (id, parent_id, order_index, visible, label_en, label_ru, label_he, url, icon_class, target, is_dropdown, created_at, updated_at) FROM stdin;
7	\N	1	t	Home	Главная	בית	/nd/index.html	\N	_self	f	2025-09-16 17:22:56.937274	2025-09-16 17:22:56.937274
8	\N	2	t	Courses	Курсы	קורסים	/nd/courses.html	\N	_self	f	2025-09-16 17:22:56.937992	2025-09-16 17:22:56.937992
9	\N	3	t	Pricing	Цены	תמחור	/nd/pricing.html	\N	_self	f	2025-09-16 17:22:56.938539	2025-09-16 17:22:56.938539
10	\N	4	t	About Us	О нас	אודותינו	/nd/about.html	\N	_self	f	2025-09-16 17:22:56.939035	2025-09-16 17:22:56.939035
11	\N	5	t	Blog	Блог	בלוג	/nd/blog.html	\N	_self	f	2025-09-16 17:22:56.939466	2025-09-16 17:22:56.939466
12	\N	6	t	Contact	Контакты	צור קשר	/nd/contact.html	\N	_self	f	2025-09-16 17:22:56.940343	2025-09-16 17:22:56.940343
\.


--
-- Data for Name: nd_pricing_page; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nd_pricing_page (id, section_name, content_en, content_ru, content_he, visible, display_order, created_at, updated_at) FROM stdin;
1	hero	{"title": "Choose Your Learning Path", "visible": true, "subtitle": "Flexible Plans for Every Journey", "description": "Select the perfect plan to accelerate your AI and technology career"}	{"title": "Выберите свой путь обучения", "visible": true, "subtitle": "Гибкие планы для каждого пути", "description": "Выберите идеальный план для ускорения вашей карьеры в AI и технологиях"}	{"title": "בחר את מסלול הלמידה שלך", "visible": true, "subtitle": "תוכניות גמישות לכל מסע", "description": "בחר את התוכנית המושלמת להאצת הקריירה שלך ב-AI וטכנולוגיה"}	t	1	2025-09-16 23:29:29.719996	2025-09-21 16:33:31.476485
3	features_comparison	{"title": "Features Comparison Title", "visible": true, "subtitle": "Features Comparison Subtitle", "description": "Content for Features Comparison section"}	{"title": "Features Comparison Title", "subtitle": "Features Comparison Subtitle", "description": "Content for Features Comparison section"}	{"title": "Features Comparison Title", "subtitle": "Features Comparison Subtitle", "description": "Content for Features Comparison section"}	t	3	2025-09-16 23:29:29.720802	2025-09-17 09:45:25.918494
4	faqs	{"title": "FAQs Title", "visible": true, "subtitle": "FAQs Subtitle", "description": "Content for FAQs section\\nqweqwe\\nweqewqew"}	{"title": "FAQs Title", "subtitle": "FAQs Subtitle", "description": "Content for FAQs section"}	{"title": "FAQs Title", "subtitle": "FAQs Subtitle", "description": "Content for FAQs section"}	t	4	2025-09-16 23:29:29.721259	2025-09-17 09:45:25.928392
5	testimonials	{"title": "Testimonials Title", "visible": true, "subtitle": "Testimonials Subtitle", "description": "Content for Testimonials section"}	{"title": "Testimonials Title", "subtitle": "Testimonials Subtitle", "description": "Content for Testimonials section"}	{"title": "Testimonials Title", "subtitle": "Testimonials Subtitle", "description": "Content for Testimonials section"}	t	5	2025-09-16 23:29:29.721488	2025-09-17 09:45:25.937738
7	misc	{"content": {"explore_plans": "Explore Plans Features"}}	{"content": {"explore_plans": "Изучить возможности планов"}}	{"content": {"explore_plans": "גלה את תכונות החבילות"}}	t	0	2025-09-23 21:25:13.392099	2025-09-23 21:25:13.392099
6	cta	\N	{"title": "Готовы начать свой путь в ИИ?", "visible": true, "subtitle": "Присоединяйтесь к тысячам успешных выпускников", "button_text": "Начать пробную версию", "description": "Не ждите, чтобы трансформировать свою карьеру. Присоединяйтесь к нашему сообществу и получите доступ к курсам мирового класса.", "button_secondary_text": "Посмотреть курсы"}	\N	t	6	2025-09-16 23:29:29.721682	2025-09-24 23:52:51.830305
2	plans	{"plans": [{"name": "Basic Plan", "price": "$99/month", "featured": false, "features": ["Access to 50+ courses", "Community forum access", "Course completion certificates", "Basic support (48h response)", "Monthly webinars", "Downloadable resources"], "button_url": "#", "button_text": "Get Started", "description": "Perfect for beginners starting their AI journey", "price_period": "/month"}, {"name": "Pro Plan", "price": "100", "featured": true, "features": ["Access to ALL courses", "Priority community support", "Professional certificates", "Priority support (12h response)", "1-on-1 monthly mentoring", "Hands-on projects", "Career coaching", "Job placement assistance"], "button_url": "#", "button_text": "Get Started", "description": "For professionals serious about AI mastery", "price_period": "/month"}, {"name": "Enterprise", "price": "", "featured": false, "features": ["Everything in Pro", "Unlimited team members", "Custom learning paths", "Dedicated account manager", "Priority 24/7 support", "Private workshops", "API access", "Analytics dashboard"], "button_url": "#", "button_text": "Get Started", "description": "Tailored solutions for teams and organizations", "price_period": "/month"}], "content": {"plans": {"annual": {"period": "Annual"}, "monthly": {"period": "Monthly"}}}, "visible": true, "description": "Dive into a world of learning with diverse and extensive range of tech courses designed to cater to every interest."}	{"plans": {"annual": {"name": "Годовой", "period": "В год"}, "monthly": {"name": "Ежемесячно", "period": "В месяц"}}}	{"plans": {"annual": {"name": "שנתי", "period": "לשנה"}, "monthly": {"name": "חודשי", "period": "לחודש"}}}	t	2	2025-09-16 23:29:29.720426	2025-09-24 11:08:17.514013
\.


--
-- Data for Name: nd_teachers_page; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nd_teachers_page (id, section_name, content_en, content_ru, content_he, visible, created_at, updated_at) FROM stdin;
3	become_instructor	{"title": "Discover A World Of Learning Opportunities.", "subtitle": "Start Learning Today", "description": "Don't wait to transform career and unlock your full potential. join our community of passionate learners and gain access to a wide range of courses.", "man_image_1": "images/CTA-Man-Image1.png", "man_image_2": "images/CTA-Man-Image2_1CTA-Man-Image2.png", "primary_link": "contact-us.html", "primary_button": "get in touch", "secondary_link": "courses.html", "secondary_button": "Check Out Courses"}	{}	{}	t	2025-09-17 11:28:17.745345	2025-09-17 11:28:17.745345
4	stats	{"items": [{"text": "Start Learning"}, {"text": "Browse Courses"}, {"text": "Start Learning"}, {"text": "Browse Courses"}, {"text": "Start Learning"}]}	{}	{}	t	2025-09-17 11:28:17.745839	2025-09-17 11:28:17.745839
2	instructor_grid	{"title": "Expert Instructors Dedicated to Your Success", "subtitle": "Meet Our Team", "description": "Learn from industry professionals with years of real-world experience who are passionate about sharing their knowledge and helping you achieve your career goals.", "instructors": [{"id": 1, "bio": "Senior AI Engineer with 8+ years of experience in machine learning and deep learning. Former Google AI researcher specializing in neural networks, NLP, and AI ethics. Passionate about making AI accessible through education.", "name": "Sarah Chen", "image": "images/CTA-Section-Bg.jpg", "expertise": "AI & Machine Learning", "specialties": ["Neural Networks", "NLP", "AI Ethics"], "extended_bio": "Explore how artificial intelligence is revolutionizing education through personalized learning paths, intelligent tutoring systems, and adaptive assessments that cater to individual student needs.", "profile_link": "#", "experience_years": "8+", "former_companies": ["Google AI", "DeepMind"]}, {"id": 2, "bio": "Lead Full-Stack Developer with 10+ years building scalable applications. Former senior developer at Netflix and Spotify. Expert in React, Node.js, Python, and cloud architecture. Mentored 200+ developers worldwide.", "name": "Mike Johnson", "image": "images/Course-Categories-Content-Bg.jpg", "expertise": "Web Development", "specialties": ["React", "Node.js", "Python", "Cloud Architecture"], "extended_bio": "Stay ahead of the curve with the latest web development trends, from serverless architecture and edge computing to WebAssembly and progressive web applications.", "profile_link": "#", "experience_years": "10+", "former_companies": ["Netflix", "Spotify"]}, {"id": 3, "bio": "Career Transition Coach with 12+ years helping professionals enter tech. Former tech recruiter turned mentor. Successfully guided 500+ career changers into their dream roles at top companies like Apple, Microsoft, and startups.", "name": "Emily Rodriguez", "image": "images/About-Me-Image.jpg", "expertise": "Career Development", "specialties": ["Career Coaching", "Tech Recruiting", "Portfolio Building"], "extended_bio": "A comprehensive guide for career changers looking to break into the tech industry, covering skill development, portfolio building, and networking strategies.", "profile_link": "#", "experience_years": "12+", "former_companies": ["Apple", "Microsoft"]}, {"id": 4, "bio": "PhD in Computer Science from Stanford. Senior Data Scientist with 9+ years at Uber and Airbnb. Expert in predictive modeling, big data systems, and ML infrastructure. Published researcher with 20+ papers in top ML conferences.", "name": "David Park", "image": "images/About-Us-Image.png", "education": "PhD Computer Science, Stanford", "expertise": "Data Science", "specialties": ["Predictive Modeling", "Big Data", "ML Infrastructure"], "extended_bio": "Demystifying machine learning with practical examples and a clear roadmap for beginners to start their journey in data science and artificial intelligence.", "profile_link": "#", "experience_years": "9+", "former_companies": ["Uber", "Airbnb"]}]}	{"title": "Опытные Инструкторы, Посвятившие Себя Вашему Успеху", "subtitle": "Познакомьтесь с Нашей Командой", "description": "Учитесь у профессионалов отрасли с многолетним реальным опытом, которые страстно желают делиться своими знаниями и помогать вам достичь ваших карьерных целей.", "instructors": [{"id": 1, "bio": "Старший инженер ИИ с 8+ летним опытом в машинном обучении и глубоком обучении. Бывший исследователь Google AI, специализирующийся на нейронных сетях, НЛП и этике ИИ.", "name": "Сара Чен", "image": "images/CTA-Section-Bg.jpg", "expertise": "ИИ и Машинное Обучение"}, {"id": 2, "bio": "Ведущий Full-Stack разработчик с 10+ летним опытом создания масштабируемых приложений. Бывший старший разработчик в Netflix и Spotify.", "name": "Майк Джонсон", "image": "images/Course-Categories-Content-Bg.jpg", "expertise": "Веб-Разработка"}, {"id": 3, "bio": "Карьерный коуч с 12+ летним опытом помощи профессионалам войти в технологии. Бывший рекрутер в сфере технологий, ставший ментором.", "name": "Эмили Родригес", "image": "images/About-Me-Image.jpg", "expertise": "Развитие Карьеры"}, {"id": 4, "bio": "PhD в области компьютерных наук из Стэнфорда. Старший специалист по данным с 9+ летним опытом в Uber и Airbnb.", "name": "Дэвид Парк", "image": "images/About-Us-Image.png", "expertise": "Наука о Данных"}]}	{"title": "מדריכים מומחים המוקדשים להצלחתכם", "subtitle": "הכירו את הצוות שלנו", "description": "למדו מאנשי מקצוע בתעשייה עם שנים של ניסיון בעולם האמיתי שנלהבים לחלוק את הידע שלהם ולעזור לכם להשיג את המטרות הקריירה שלכם.", "instructors": [{"id": 1, "bio": "מהנדסת בינה מלאכותית בכירה עם 8+ שנות ניסיון בלמידת מכונה ולמידה עמוקה. חוקרת לשעבר ב-Google AI המתמחה ברשתות עצביות, עיבוד שפות טבעיות ואתיקה של בינה מלאכותית.", "name": "שרה צ'ן", "image": "images/CTA-Section-Bg.jpg", "expertise": "בינה מלאכותית ולמידת מכונה"}, {"id": 2, "bio": "מפתח Full-Stack מוביל עם 10+ שנות ניסיון בבניית יישומים ניתנים להרחבה. מפתח בכיר לשעבר ב-Netflix ו-Spotify.", "name": "מייק ג'ונסון", "image": "images/Course-Categories-Content-Bg.jpg", "expertise": "פיתוח אתרים"}, {"id": 3, "bio": "מאמנת מעבר קריירה עם 12+ שנות ניסיון בעזרה לאנשי מקצוע להיכנס לטכנולוגיה. מגייסת טכנולוגיה לשעבר שהפכה למנטורית.", "name": "אמילי רודריגז", "image": "images/About-Me-Image.jpg", "expertise": "פיתוח קריירה"}, {"id": 4, "bio": "דוקטור במדעי המחשב מסטנפורד. מדען נתונים בכיר עם 9+ שנות ניסיון ב-Uber ו-Airbnb.", "name": "דיויד פארק", "image": "images/About-Us-Image.png", "expertise": "מדעי הנתונים"}]}	t	2025-09-17 11:28:17.744784	2025-09-18 08:48:56.342416
1	hero	{"title": "Our Teachers", "subtitle": "Meet Our Team", "description": "Expert Instructors Dedicated to Your Success", "breadcrumb_home": "Home", "breadcrumb_current": "Teachers"}	{"title": "Наши Преподаватели", "subtitle": "Познакомьтесь с Нашей Командой", "description": "Опытные Инструкторы, Посвятившие Себя Вашему Успеху", "breadcrumb_home": "Главная", "breadcrumb_current": "Преподаватели"}	{"title": "המורים שלנו", "subtitle": "הכירו את הצוות שלנו", "description": "מדריכים מומחים המוקדשים להצלחתכם", "breadcrumb_home": "בית", "breadcrumb_current": "מורים"}	t	2025-09-17 11:28:17.74259	2025-09-18 08:48:56.341067
7	stats_banner	{"items": [{"text": "Start Learning"}, {"text": "Browse Courses"}, {"text": "Start Learning"}, {"text": "Browse Courses"}, {"text": "Start Learning"}]}	{"items": [{"text": "Начните Учиться"}, {"text": "Просмотр Курсов"}, {"text": "Начните Учиться"}, {"text": "Просмотр Курсов"}, {"text": "Начните Учиться"}]}	{"items": [{"text": "התחילו ללמוד"}, {"text": "עיינו בקורסים"}, {"text": "התחילו ללמוד"}, {"text": "עיינו בקורסים"}, {"text": "התחילו ללמוד"}]}	t	2025-09-18 08:47:14.029509	2025-09-18 08:48:56.343335
8	cta_section	{"title": "Discover A World Of Learning Opportunities.", "subtitle": "Start Learning Today", "description": "Don't wait to transform career and unlock your full potential. join our community of passionate learners and gain access to a wide range of courses.", "man_image_1": "images/CTA-Man-Image1.png", "man_image_2": "images/CTA-Man-Image2_1CTA-Man-Image2.png", "primary_link": "contact-us.html", "primary_button": "get in touch", "secondary_link": "courses.html", "secondary_button": "Check Out Courses"}	{"title": "Откройте Мир Возможностей Для Обучения.", "subtitle": "Начните Учиться Сегодня", "description": "Не ждите, чтобы изменить карьеру и раскрыть свой полный потенциал. Присоединяйтесь к нашему сообществу увлеченных учеников и получите доступ к широкому спектру курсов.", "primary_link": "contact-us.html", "primary_button": "связаться с нами", "secondary_link": "courses.html", "secondary_button": "Посмотреть Курсы"}	{"title": "גלו עולם של הזדמנויות למידה.", "subtitle": "התחילו ללמוד היום", "description": "אל תחכו כדי לשנות קריירה ולפתוח את הפוטנציאל המלא שלכם. הצטרפו לקהילה שלנו של לומדים נלהבים וקבלו גישה למגוון רחב של קורסים.", "primary_link": "contact-us.html", "primary_button": "צרו קשר", "secondary_link": "courses.html", "secondary_button": "ראו קורסים"}	t	2025-09-18 08:47:14.030855	2025-09-18 08:48:56.343707
\.


--
-- Data for Name: nd_ui_translations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nd_ui_translations (id, page, element_key, text_en, text_ru, text_he, updated_at) FROM stdin;
1	courses	nav.home	Home	Главная	בית	2025-09-19 11:56:00.340265
2	courses	nav.courses	Courses	Курсы	קורסים	2025-09-19 11:56:00.34124
3	courses	nav.pricing	Pricing	Цены	תמחור	2025-09-19 11:56:00.341632
4	courses	nav.blog	Blog	Блог	בלוג	2025-09-19 11:56:00.341886
5	courses	nav.teachers	Teachers	Преподаватели	מורים	2025-09-19 11:56:00.342173
6	courses	nav.about	About Us	О нас	אודותינו	2025-09-19 11:56:00.34244
7	courses	page.title	Courses	Курсы	קורסים	2025-09-19 11:56:00.342789
8	courses	section.subtitle	Featured Courses	Рекомендуемые курсы	קורסים מומלצים	2025-09-19 11:56:00.343139
9	courses	section.title	Enhance Your Skills With Curated Courses.	Развивайте навыки с подобранными курсами.	שפר את כישוריך עם קורסים מובחרים.	2025-09-19 11:56:00.343538
10	courses	section.description	Dive into our expertly curated selection of featured courses, designed to equip you with the skills and knowledge needed to excel.	Погрузитесь в нашу тщательно подобранную коллекцию курсов, разработанных для того, чтобы дать вам навыки и знания, необходимые для успеха.	צלול לתוך מבחר הקורסים שנבחרו בקפידה, שנועדו לצייד אותך בכישורים ובידע הדרושים להצליח.	2025-09-19 11:56:00.343928
11	courses	filter.all	All	Все	הכל	2025-09-19 11:56:00.344261
12	courses	filter.web_development	Web Development	Веб-разработка	פיתוח אינטרנט	2025-09-19 11:56:00.344613
13	courses	filter.app_development	App Development	Разработка приложений	פיתוח אפליקציות	2025-09-19 11:56:00.344859
14	courses	filter.machine_learning	Machine Learning	Машинное обучение	למידת מכונה	2025-09-19 11:56:00.345092
15	courses	filter.cloud_computing	Cloud Computing	Облачные вычисления	מחשוב ענן	2025-09-19 11:56:00.345391
16	courses	button.sign_up	Sign Up Today	Записаться сегодня	הרשם היום	2025-09-19 11:56:00.345786
17	courses	button.course_details	Course Details	Подробнее о курсе	פרטי הקורס	2025-09-19 11:56:00.346001
18	courses	breadcrumb.home	Home	Главная	בית	2025-09-19 11:56:00.34616
19	courses	breadcrumb.courses	Courses	Курсы	קורסים	2025-09-19 11:56:00.346326
20	courses	course.lessons	Lessons	Уроки	שיעורים	2025-09-19 11:56:00.346524
21	courses	course.weeks	weeks	недель	שבועות	2025-09-19 11:56:00.346891
22	courses	course.rating	Rating	Рейтинг	דירוג	2025-09-19 11:56:00.34715
23	courses	cart.your_cart	Your Cart	Ваша корзина	העגלה שלך	2025-09-19 11:56:00.347387
24	courses	cart.no_items	No items found.	Товары не найдены.	לא נמצאו פריטים.	2025-09-19 11:56:00.347615
25	courses	cart.subtotal	Subtotal	Промежуточный итог	סכום ביניים	2025-09-19 11:56:00.347852
26	courses	cart.checkout	Continue to Checkout	Перейти к оформлению	המשך לתשלום	2025-09-19 11:56:00.348072
27	global	nav.career_services	Career Services	Карьерные Услуги	שירותי קריירה	2025-09-25 13:36:42.780824
28	global	nav.career_center	Career Center	Центр Карьеры	מרכז קריירה	2025-09-25 13:36:42.784815
29	global	nav.career_orientation	Career Orientation	Профориентация	התמחות מקצועית	2025-09-25 13:36:42.785492
\.


--
-- Data for Name: pricing_plans; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pricing_plans (id, name, price, currency, period, features, is_popular, locale, published_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: site_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.site_settings (id, locale, site_name, site_tagline, logo_url, footer_email, footer_phone, footer_address, footer_copyright, facebook_url, twitter_url, instagram_url, linkedin_url, created_at) FROM stdin;
1	en	AI Studio	\N	\N	info@aistudio555.com	\N	\N	© 2024 AI Studio. All rights reserved.	\N	\N	\N	\N	2025-09-15 01:25:55.259692
\.


--
-- Data for Name: statistics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.statistics (id, locale, courses_count, courses_label, learners_count, learners_label, years_count, years_label, created_at) FROM stdin;
1	en	125+	Courses	14,000+	Learners	10+	Years	2025-09-15 01:25:55.266819
\.


--
-- Data for Name: teachers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teachers (id, name, title, bio, bio_en, bio_ru, bio_he, image_url, expertise, specialization_en, specialization_ru, specialization_he, years_experience, courses_taught, rating, locale, display_order, published_at, created_at, updated_at, category, experience, specialties, company, linkedin_url, twitter_url, github_url) FROM stdin;
4	אנה קובלסקי	מהנדסת NLP במיקרוסופט	מהנדסת NLP מובילה במיקרוסופט העובדת על Azure Cognitive Services. מומחית בארכיטקטורות טרנספורמר, מודלים רב-לשוניים ו-AI שיחתי.	\N	\N	\N	https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face	\N	\N	\N	\N	\N	\N	\N	he	0	2025-09-15 18:06:17.981042	2025-09-15 18:06:17.981042	2025-09-15 18:06:17.981042	deep-learning	7+ שנות ניסיון	Transformers,BERT,Conversational AI	Microsoft	https://linkedin.com/in/anna-kowalski	https://twitter.com/annakowalski	\N
5	ג''יימס וילסון	מדען נתונים ראשי באמזון	מדען נתונים ראשי באמזון המוביל אנליטיקת לקוחות ומודלי חיזוי. מומחה במידול סטטיסטי, ניתוח סדרות זמן ובינה עסקית.	\N	\N	\N	https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face	\N	\N	\N	\N	\N	\N	\N	he	0	2025-09-15 18:06:17.982082	2025-09-15 18:06:17.982082	2025-09-15 18:06:17.982082	data-science	9+ שנות ניסיון	Statistical Modeling,Time Series,Forecasting	Amazon	https://linkedin.com/in/james-wilson	https://twitter.com/jameswilson	\N
6	מריה סנטוס	מנהלת אנליטיקת נתונים בסטרייפ	מנהלת אנליטיקת נתונים בסטרייפ המתמקדת באנליטיקת תשלומים וזיהוי הונאות. מומחית בהנדסת פיצ''רים, פריסת מודלים ואנליטיקה בזמן אמת.	\N	\N	\N	https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face	\N	\N	\N	\N	\N	\N	\N	he	0	2025-09-15 18:06:17.983491	2025-09-15 18:06:17.983491	2025-09-15 18:06:17.983491	data-science	5+ שנות ניסיון	Fraud Detection,Real-time Analytics,SQL	Stripe	https://linkedin.com/in/maria-santos	https://twitter.com/mariasantos	\N
7	אלכס תומפסון	מהנדס Backend בכיר בסלאק	מהנדס backend בכיר בסלאק הבונה תשתית הודעות ניתנת להרחבה. מומחה בפריימוורקים של Python, ארכיטקטורת מיקרו-שירותים ועיצוב API.	\N	\N	\N	https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=face	\N	\N	\N	\N	\N	\N	\N	he	0	2025-09-15 18:06:17.983961	2025-09-15 18:06:17.983961	2025-09-15 18:06:17.983961	python	11+ שנות ניסיון	Django,FastAPI,Microservices	Slack	https://linkedin.com/in/alex-thompson	https://twitter.com/alexthompson	\N
8	רוברט ג''ונסון	ראש Full Stack באפל	ראש צוות full stack באפל העובד על כלי מפתחים ופלטפורמות web. מומחה ב-React, Node.js ופרקטיקות פיתוח web מודרניות.	\N	\N	\N	https://images.unsplash.com/photo-1556157382-97eda2d62296?w=300&h=300&fit=crop&crop=face	\N	\N	\N	\N	\N	\N	\N	he	0	2025-09-15 18:06:17.984368	2025-09-15 18:06:17.984368	2025-09-15 18:06:17.984368	web-development	7+ שנות ניסיון	React,Node.js,TypeScript	Apple	https://linkedin.com/in/robert-johnson	https://twitter.com/robertjohnson	\N
9	ראג''''פטל	ארכיטקט פתרונות ענן ב-AWS	ארכיטקט פתרונות ענן ב-AWS המסייע לארגונים לעבור לענן. מומחה בארכיטקטורות serverless, תזמור containers ואסטרטגיות multi-cloud.	\N	\N	\N	https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face	\N	\N	\N	\N	\N	\N	\N	he	0	2025-09-15 18:06:17.984873	2025-09-15 18:06:17.984873	2025-09-15 18:06:17.984873	cloud-computing	9+ שנות ניסיון	AWS,Serverless,Multi-Cloud	AWS	https://linkedin.com/in/raj-patel	https://twitter.com/rajpatel	\N
10	ג''ניפר וו	ראש DevOps בגיטהאב	ראש DevOps בגיטהאב הבונה תשתית CI/CD למיליוני מפתחים. מומחית ב-Kubernetes, Docker ו-Infrastructure as Code.	\N	\N	\N	https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=face	\N	\N	\N	\N	\N	\N	\N	he	0	2025-09-15 18:06:17.985921	2025-09-15 18:06:17.985921	2025-09-15 18:06:17.985921	devops	8+ שנות ניסיון	Kubernetes,CI/CD,Infrastructure as Code	GitHub	https://linkedin.com/in/jennifer-wu	https://twitter.com/jenniferwu	\N
11	מרקוס בראון	מנהל BI בסיילספורס	מנהל בינה עסקית בסיילספורס המוביל יוזמות ויזואליזציה ואנליטיקה. מומחה ב-Tableau, Power BI ודיווח להנהלה.	\N	\N	\N	https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=300&h=300&fit=crop&crop=face	\N	\N	\N	\N	\N	\N	\N	he	0	2025-09-15 18:06:17.986361	2025-09-15 18:06:17.986361	2025-09-15 18:06:17.986361	business-intelligence	10+ שנות ניסיון	Tableau,Power BI,Executive Reporting	Salesforce	https://linkedin.com/in/marcus-brown	https://twitter.com/marcusbrown	\N
12	שרה קים	מנהלת מוצר בכירה ב-Airbnb	מנהלת מוצר בכירה ב-Airbnb המובילה מוצרי חוויית מארחים. מומחית באסטרטגיית מוצר, מחקר משתמשים ומתודולוגיות פיתוח אג''ייל.	\N	\N	\N	https://images.unsplash.com/photo-1507101105822-7472b28e22ac?w=300&h=300&fit=crop&crop=face	\N	\N	\N	\N	\N	\N	\N	he	0	2025-09-15 18:06:17.986748	2025-09-15 18:06:17.986748	2025-09-15 18:06:17.986748	product-management	7+ שנות ניסיון	Product Strategy,User Research,Agile	Airbnb	https://linkedin.com/in/sarah-kim	https://twitter.com/sarahkim	\N
13	אמה דייויס	מעצבת ראשית באדובי	מעצבת ראשית באדובי המובילה את חוויית המשתמש של Creative Cloud. מומחית בעיצוב ממוקד משתמש, פרוטוטייפינג ומערכות עיצוב.	\N	\N	\N	https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=300&h=300&fit=crop&crop=face	\N	\N	\N	\N	\N	\N	\N	he	0	2025-09-15 18:06:17.987331	2025-09-15 18:06:17.987331	2025-09-15 18:06:17.987331	ux-ui-design	9+ שנות ניסיון	User Experience,Design Systems,Prototyping	Adobe	https://linkedin.com/in/emma-davis	https://twitter.com/emmadavis	\N
30	Dr. Sarah Chen	Senior ML Engineer	Expert in machine learning and deep neural networks with 8+ years of experience in production ML systems. Specializes in computer vision and natural language processing applications at Google.	\N	\N	\N	https://lh3.googleusercontent.com/pw/ABLVV86TN2wGE7KHjDcG_XrZvHzHd8pF9Q3kJmLwN4xS8vYrR2fGHgQpWxB3E9sKt7JnMhYsUv6LxCzA4wRqE8nF=w400-h400-c	\N	\N	\N	\N	8	\N	\N	en	1	2024-01-01 00:00:00	2025-09-16 11:19:05.066378	2025-09-16 11:19:05.066378	machine-learning	8+ years of commercial experience	Machine Learning, Deep Learning, Neural Networks, Python, TensorFlow, Computer Vision	Google	https://linkedin.com/in/sarah-chen-ml	\N	https://github.com/sarahchen
31	Dr. Michael Rodriguez	AI Research Scientist	Leading AI researcher focused on large language models and AGI safety. Published author with 50+ papers in top-tier conferences including NeurIPS and ICML.	\N	\N	\N	https://lh3.googleusercontent.com/pw/ABLVV85rT9wGE7KHjDcG_XrZvHzHd8pF9Q3kJmLwN4xS8vYrR2fGHgQpWxB3E9sKt7JnMhYsUv6LxCzA4wRqE8nF=w400-h400-c	\N	\N	\N	\N	10	\N	\N	en	2	2024-01-01 00:00:00	2025-09-16 11:19:05.133746	2025-09-16 11:19:05.133746	machine-learning	10+ years of commercial experience	Artificial Intelligence, Large Language Models, Research, Python, PyTorch	OpenAI	https://linkedin.com/in/michael-rodriguez-ai	\N	https://github.com/mrodriguez
32	Dr. Elena Petrov	Head of Data Science	Data science leader with 12+ years experience building ML systems at scale. Leads a team of 30+ data scientists working on recommendation systems and user engagement.	\N	\N	\N	https://lh3.googleusercontent.com/pw/ABLVV84mT9wGE7KHjDcG_XrZvHzHd8pF9Q3kJmLwN4xS8vYrR2fGHgQpWxB3E9sKt7JnMhYsUv6LxCzA4wRqE8nF=w400-h400-c	\N	\N	\N	\N	12	\N	\N	en	3	2024-01-01 00:00:00	2025-09-16 11:19:05.134281	2025-09-16 11:19:05.134281	machine-learning	12+ years of commercial experience	Data Science, Machine Learning, Recommendation Systems, Leadership, Scale	Meta	https://linkedin.com/in/elena-petrov	\N	https://github.com/epetrov
33	David Kim	Computer Vision Engineer	Computer vision specialist working on autonomous driving systems at Tesla. Expert in real-time image processing, object detection, and deep learning for automotive applications.	\N	\N	\N	https://lh3.googleusercontent.com/pw/ABLVV83nT9wGE7KHjDcG_XrZvHzHd8pF9Q3kJmLwN4xS8vYrR2fGHgQpWxB3E9sKt7JnMhYsUv6LxCzA4wRqE8nF=w400-h400-c	\N	\N	\N	\N	6	\N	\N	en	4	2024-01-01 00:00:00	2025-09-16 11:19:05.134787	2025-09-16 11:19:05.134787	development	6+ years of commercial experience	Computer Vision, Autonomous Driving, Deep Learning, C++, Python	Tesla	https://linkedin.com/in/david-kim-cv	\N	https://github.com/davidkim
34	Anna Kowalski	Senior Software Engineer	Full-stack engineer with expertise in cloud-native applications and microservices architecture. Leads development of enterprise-scale solutions at Microsoft Azure.	\N	\N	\N	https://lh3.googleusercontent.com/pw/ABLVV82oT9wGE7KHjDcG_XrZvHzHd8pF9Q3kJmLwN4xS8vYrR2fGHgQpWxB3E9sKt7JnMhYsUv6LxCzA4wRqE8nF=w400-h400-c	\N	\N	\N	\N	7	\N	\N	en	5	2024-01-01 00:00:00	2025-09-16 11:19:05.135133	2025-09-16 11:19:05.135133	development	7+ years of commercial experience	Software Engineering, Cloud Architecture, Microservices, .NET, Azure	Microsoft	https://linkedin.com/in/anna-kowalski	\N	https://github.com/akowalski
35	Dr. James Wilson	Principal Data Scientist	Data science expert with 9+ years of experience in e-commerce analytics and machine learning. Leads data science initiatives for Amazon's recommendation and personalization systems.	\N	\N	\N	https://lh3.googleusercontent.com/pw/ABLVV81pT9wGE7KHjDcG_XrZvHzHd8pF9Q3kJmLwN4xS8vYrR2fGHgQpWxB3E9sKt7JnMhYsUv6LxCzA4wRqE8nF=w400-h400-c	\N	\N	\N	\N	9	\N	\N	en	6	2024-01-01 00:00:00	2025-09-16 11:19:05.135569	2025-09-16 11:19:05.135569	data-analytics	9+ years of commercial experience	Data Science, Analytics, Machine Learning, Statistics, SQL, Python	Amazon	https://linkedin.com/in/james-wilson-ds	\N	https://github.com/jwilson
36	Maria Santos	Data Analytics Lead	Analytics leader specializing in financial data and fraud detection systems. Builds data-driven solutions for payment processing and risk management at Stripe.	\N	\N	\N	https://lh3.googleusercontent.com/pw/ABLVV80qT9wGE7KHjDcG_XrZvHzHd8pF9Q3kJmLwN4xS8vYrR2fGHgQpWxB3E9sKt7JnMhYsUv6LxCzA4wRqE8nF=w400-h400-c	\N	\N	\N	\N	5	\N	\N	en	7	2024-01-01 00:00:00	2025-09-16 11:19:05.135894	2025-09-16 11:19:05.135894	data-analytics	5+ years of commercial experience	Data Analytics, Financial Data, Fraud Detection, SQL, Python, Tableau	Stripe	https://linkedin.com/in/maria-santos-analytics	\N	https://github.com/msantos
37	Alex Thompson	Senior Backend Engineer	Backend engineering specialist with 11+ years of experience in distributed systems and real-time messaging platforms. Architect of Slack's core messaging infrastructure.	\N	\N	\N	https://lh3.googleusercontent.com/pw/ABLVV87rT9wGE7KHjDcG_XrZvHzHd8pF9Q3kJmLwN4xS8vYrR2fGHgQpWxB3E9sKt7JnMhYsUv6LxCzA4wRqE8nF=w400-h400-c	\N	\N	\N	\N	11	\N	\N	en	8	2024-01-01 00:00:00	2025-09-16 11:19:05.136406	2025-09-16 11:19:05.136406	cloud-devops	11+ years of commercial experience	Backend Engineering, Distributed Systems, Real-time Systems, Go, Kubernetes	Slack	https://linkedin.com/in/alex-thompson-backend	\N	https://github.com/athompson
38	Lisa Zhang	DevOps Architect	DevOps expert with 8+ years of experience in cloud infrastructure and CI/CD pipelines. Designed and implemented Twitter's global deployment infrastructure serving billions of requests.	\N	\N	\N	https://lh3.googleusercontent.com/pw/ABLVV86sT9wGE7KHjDcG_XrZvHzHd8pF9Q3kJmLwN4xS8vYrR2fGHgQpWxB3E9sKt7JnMhYsUv6LxCzA4wRqE8nF=w400-h400-c	\N	\N	\N	\N	8	\N	\N	en	9	2024-01-01 00:00:00	2025-09-16 11:19:05.136836	2025-09-16 11:19:05.136836	cloud-devops	8+ years of commercial experience	DevOps, Cloud Infrastructure, CI/CD, Docker, Kubernetes, AWS	Twitter	https://linkedin.com/in/lisa-zhang-devops	\N	https://github.com/lzhang
39	Robert Johnson	UX Design Lead	UX design leader with 7+ years of experience creating intuitive user experiences for consumer products. Led design teams for major Apple product launches including iOS and macOS features.	\N	\N	\N	https://lh3.googleusercontent.com/pw/ABLVV85tT9wGE7KHjDcG_XrZvHzHd8pF9Q3kJmLwN4xS8vYrR2fGHgQpWxB3E9sKt7JnMhYsUv6LxCzA4wRqE8nF=w400-h400-c	\N	\N	\N	\N	7	\N	\N	en	10	2024-01-01 00:00:00	2025-09-16 11:19:05.137243	2025-09-16 11:19:05.137243	design	7+ years of commercial experience	UX Design, User Research, Prototyping, Design Systems, iOS Design	Apple	https://linkedin.com/in/robert-johnson-ux	\N	https://github.com/rjohnson
40	Sofia Andersson	Product Designer	Product designer with 6+ years of experience in digital product design and user interface development. Designs engaging music discovery experiences for Spotify's 400+ million users.	\N	\N	\N	https://lh3.googleusercontent.com/pw/ABLVV84uT9wGE7KHjDcG_XrZvHzHd8pF9Q3kJmLwN4xS8vYrR2fGHgQpWxB3E9sKt7JnMhYsUv6LxCzA4wRqE8nF=w400-h400-c	\N	\N	\N	\N	6	\N	\N	en	11	2024-01-01 00:00:00	2025-09-16 11:19:05.137619	2025-09-16 11:19:05.137619	design	6+ years of commercial experience	Product Design, UI Design, User Interface, Design Systems, Prototyping	Spotify	https://linkedin.com/in/sofia-andersson-design	\N	https://github.com/sandersson
41	Raj Patel	Engineering Manager	Engineering leader with 9+ years of experience managing high-performing technical teams. Oversees cloud infrastructure services at AWS serving millions of customers globally.	\N	\N	\N	https://lh3.googleusercontent.com/pw/ABLVV83vT9wGE7KHjDcG_XrZvHzHd8pF9Q3kJmLwN4xS8vYrR2fGHgQpWxB3E9sKt7JnMhYsUv6LxCzA4wRqE8nF=w400-h400-c	\N	\N	\N	\N	9	\N	\N	en	12	2024-01-01 00:00:00	2025-09-16 11:19:05.137984	2025-09-16 11:19:05.137984	management	9+ years of commercial experience	Engineering Management, Team Leadership, Cloud Services, Agile, Strategy	AWS	https://linkedin.com/in/raj-patel-manager	\N	https://github.com/rpatel
42	Jennifer Wu	Technical Program Manager	Technical program manager with 8+ years of experience leading cross-functional engineering initiatives. Manages large-scale platform development projects at GitHub serving 100+ million developers.	\N	\N	\N	https://lh3.googleusercontent.com/pw/ABLVV82wT9wGE7KHjDcG_XrZvHzHd8pF9Q3kJmLwN4xS8vYrR2fGHgQpWxB3E9sKt7JnMhYsUv6LxCzA4wRqE8nF=w400-h400-c	\N	\N	\N	\N	8	\N	\N	en	13	2024-01-01 00:00:00	2025-09-16 11:19:05.13825	2025-09-16 11:19:05.13825	management	8+ years of commercial experience	Program Management, Cross-functional Leadership, Platform Development, Agile	GitHub	https://linkedin.com/in/jennifer-wu-tpm	\N	https://github.com/jwu
43	Marcus Brown	Product Manager	Product management expert with 10+ years of experience in enterprise software and CRM platforms. Leads product strategy for Salesforce's core CRM features used by millions of businesses.	\N	\N	\N	https://lh3.googleusercontent.com/pw/ABLVV81xT9wGE7KHjDcG_XrZvHzHd8pF9Q3kJmLwN4xS8vYrR2fGHgQpWxB3E9sKt7JnMhYsUv6LxCzA4wRqE8nF=w400-h400-c	\N	\N	\N	\N	10	\N	\N	en	14	2024-01-01 00:00:00	2025-09-16 11:19:05.162125	2025-09-16 11:19:05.162125	management	10+ years of commercial experience	Product Management, Enterprise Software, CRM, Strategy, User Research	Salesforce	https://linkedin.com/in/marcus-brown-pm	\N	https://github.com/mbrown
44	Sarah Kim	Senior Product Manager	Senior product manager with 7+ years of experience in marketplace platforms and user experience optimization. Drives product innovation for Airbnb's host and guest experiences.	\N	\N	\N	https://lh3.googleusercontent.com/pw/ABLVV80yT9wGE7KHjDcG_XrZvHzHd8pF9Q3kJmLwN4xS8vYrR2fGHgQpWxB3E9sKt7JnMhYsUv6LxCzA4wRqE8nF=w400-h400-c	\N	\N	\N	\N	7	\N	\N	en	15	2024-01-01 00:00:00	2025-09-16 11:19:05.162758	2025-09-16 11:19:05.162758	management	7+ years of commercial experience	Product Management, Marketplace Platforms, User Experience, Growth, Analytics	Airbnb	https://linkedin.com/in/sarah-kim-pm	\N	https://github.com/skim
45	Emma Davis	Principal Designer	Principal designer with 9+ years of experience in creative software and design tools. Leads design vision for Adobe Creative Suite features used by millions of creative professionals worldwide.	\N	\N	\N	https://lh3.googleusercontent.com/pw/ABLVV87zT9wGE7KHjDcG_XrZvHzHd8pF9Q3kJmLwN4xS8vYrR2fGHgQpWxB3E9sKt7JnMhYsUv6LxCzA4wRqE8nF=w400-h400-c	\N	\N	\N	\N	9	\N	\N	en	16	2024-01-01 00:00:00	2025-09-16 11:19:05.163083	2025-09-16 11:19:05.163083	design	9+ years of commercial experience	Design Leadership, Creative Software, Design Systems, User Experience, Visual Design	Adobe	https://linkedin.com/in/emma-davis-design	\N	https://github.com/edavis
\.


--
-- Name: about_pages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.about_pages_id_seq', 3, true);


--
-- Name: blog_posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.blog_posts_id_seq', 2, true);


--
-- Name: button_texts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.button_texts_id_seq', 1, true);


--
-- Name: career_center_pages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.career_center_pages_id_seq', 1, false);


--
-- Name: career_orientation_pages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.career_orientation_pages_id_seq', 3, true);


--
-- Name: career_resources_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.career_resources_id_seq', 12, true);


--
-- Name: company_logos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.company_logos_id_seq', 1, true);


--
-- Name: consultation_services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.consultation_services_id_seq', 3, true);


--
-- Name: consultations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.consultations_id_seq', 10, true);


--
-- Name: contact_pages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contact_pages_id_seq', 3, true);


--
-- Name: courses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.courses_id_seq', 16, true);


--
-- Name: entity_teachers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.entity_teachers_id_seq', 30, true);


--
-- Name: faqs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.faqs_id_seq', 12, true);


--
-- Name: footer_content_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.footer_content_id_seq', 1, false);


--
-- Name: home_pages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.home_pages_id_seq', 3, true);


--
-- Name: job_postings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.job_postings_id_seq', 1, false);


--
-- Name: navigation_menus_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.navigation_menus_id_seq', 1, true);


--
-- Name: nd_about_page_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.nd_about_page_id_seq', 9, true);


--
-- Name: nd_blog_page_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.nd_blog_page_id_seq', 13, true);


--
-- Name: nd_blog_posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.nd_blog_posts_id_seq', 1, false);


--
-- Name: nd_career_center_platform_page_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.nd_career_center_platform_page_id_seq', 6, true);


--
-- Name: nd_contact_page_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.nd_contact_page_id_seq', 7, true);


--
-- Name: nd_course_details_page_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.nd_course_details_page_id_seq', 11, true);


--
-- Name: nd_courses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.nd_courses_id_seq', 11, true);


--
-- Name: nd_courses_page_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.nd_courses_page_id_seq', 7, true);


--
-- Name: nd_footer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.nd_footer_id_seq', 20, true);


--
-- Name: nd_home_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.nd_home_id_seq', 108, true);


--
-- Name: nd_home_page_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.nd_home_page_id_seq', 14, true);


--
-- Name: nd_menu_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.nd_menu_id_seq', 12, true);


--
-- Name: nd_pricing_page_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.nd_pricing_page_id_seq', 7, true);


--
-- Name: nd_teachers_page_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.nd_teachers_page_id_seq', 12, true);


--
-- Name: nd_ui_translations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.nd_ui_translations_id_seq', 29, true);


--
-- Name: pricing_plans_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pricing_plans_id_seq', 1, false);


--
-- Name: site_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.site_settings_id_seq', 1, true);


--
-- Name: statistics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.statistics_id_seq', 1, true);


--
-- Name: teachers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.teachers_id_seq', 45, true);


--
-- Name: about_pages about_pages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.about_pages
    ADD CONSTRAINT about_pages_pkey PRIMARY KEY (id);


--
-- Name: blog_posts blog_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_pkey PRIMARY KEY (id);


--
-- Name: button_texts button_texts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.button_texts
    ADD CONSTRAINT button_texts_pkey PRIMARY KEY (id);


--
-- Name: career_center_pages career_center_pages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.career_center_pages
    ADD CONSTRAINT career_center_pages_pkey PRIMARY KEY (id);


--
-- Name: career_orientation_pages career_orientation_pages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.career_orientation_pages
    ADD CONSTRAINT career_orientation_pages_pkey PRIMARY KEY (id);


--
-- Name: career_resources career_resources_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.career_resources
    ADD CONSTRAINT career_resources_pkey PRIMARY KEY (id);


--
-- Name: company_logos company_logos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_logos
    ADD CONSTRAINT company_logos_pkey PRIMARY KEY (id);


--
-- Name: consultation_services consultation_services_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consultation_services
    ADD CONSTRAINT consultation_services_pkey PRIMARY KEY (id);


--
-- Name: consultations consultations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consultations
    ADD CONSTRAINT consultations_pkey PRIMARY KEY (id);


--
-- Name: contact_pages contact_pages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_pages
    ADD CONSTRAINT contact_pages_pkey PRIMARY KEY (id);


--
-- Name: courses courses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.courses
    ADD CONSTRAINT courses_pkey PRIMARY KEY (id);


--
-- Name: entity_teachers entity_teachers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.entity_teachers
    ADD CONSTRAINT entity_teachers_pkey PRIMARY KEY (id);


--
-- Name: entity_teachers entity_teachers_teacher_key_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.entity_teachers
    ADD CONSTRAINT entity_teachers_teacher_key_key UNIQUE (teacher_key);


--
-- Name: faqs faqs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faqs
    ADD CONSTRAINT faqs_pkey PRIMARY KEY (id);


--
-- Name: footer_content footer_content_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.footer_content
    ADD CONSTRAINT footer_content_pkey PRIMARY KEY (id);


--
-- Name: home_pages home_pages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.home_pages
    ADD CONSTRAINT home_pages_pkey PRIMARY KEY (id);


--
-- Name: job_postings job_postings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_postings
    ADD CONSTRAINT job_postings_pkey PRIMARY KEY (id);


--
-- Name: navigation_menus navigation_menus_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.navigation_menus
    ADD CONSTRAINT navigation_menus_pkey PRIMARY KEY (id);


--
-- Name: nd_about_page nd_about_page_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nd_about_page
    ADD CONSTRAINT nd_about_page_pkey PRIMARY KEY (id);


--
-- Name: nd_about_page nd_about_page_section_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nd_about_page
    ADD CONSTRAINT nd_about_page_section_name_key UNIQUE (section_name);


--
-- Name: nd_blog_page nd_blog_page_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nd_blog_page
    ADD CONSTRAINT nd_blog_page_pkey PRIMARY KEY (id);


--
-- Name: nd_blog_page nd_blog_page_section_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nd_blog_page
    ADD CONSTRAINT nd_blog_page_section_name_key UNIQUE (section_name);


--
-- Name: nd_blog_posts nd_blog_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nd_blog_posts
    ADD CONSTRAINT nd_blog_posts_pkey PRIMARY KEY (id);


--
-- Name: nd_career_center_platform_page nd_career_center_platform_page_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nd_career_center_platform_page
    ADD CONSTRAINT nd_career_center_platform_page_pkey PRIMARY KEY (id);


--
-- Name: nd_career_center_platform_page nd_career_center_platform_page_section_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nd_career_center_platform_page
    ADD CONSTRAINT nd_career_center_platform_page_section_name_key UNIQUE (section_name);


--
-- Name: nd_contact_page nd_contact_page_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nd_contact_page
    ADD CONSTRAINT nd_contact_page_pkey PRIMARY KEY (id);


--
-- Name: nd_contact_page nd_contact_page_section_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nd_contact_page
    ADD CONSTRAINT nd_contact_page_section_name_key UNIQUE (section_name);


--
-- Name: nd_course_details_page nd_course_details_page_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nd_course_details_page
    ADD CONSTRAINT nd_course_details_page_pkey PRIMARY KEY (id);


--
-- Name: nd_course_details_page nd_course_details_page_section_key_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nd_course_details_page
    ADD CONSTRAINT nd_course_details_page_section_key_key UNIQUE (section_key);


--
-- Name: nd_courses nd_courses_course_key_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nd_courses
    ADD CONSTRAINT nd_courses_course_key_key UNIQUE (course_key);


--
-- Name: nd_courses_page nd_courses_page_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nd_courses_page
    ADD CONSTRAINT nd_courses_page_pkey PRIMARY KEY (id);


--
-- Name: nd_courses_page nd_courses_page_section_key_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nd_courses_page
    ADD CONSTRAINT nd_courses_page_section_key_key UNIQUE (section_key);


--
-- Name: nd_courses nd_courses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nd_courses
    ADD CONSTRAINT nd_courses_pkey PRIMARY KEY (id);


--
-- Name: nd_footer nd_footer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nd_footer
    ADD CONSTRAINT nd_footer_pkey PRIMARY KEY (id);


--
-- Name: nd_home_page nd_home_page_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nd_home_page
    ADD CONSTRAINT nd_home_page_pkey PRIMARY KEY (id);


--
-- Name: nd_home_page nd_home_page_section_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nd_home_page
    ADD CONSTRAINT nd_home_page_section_name_key UNIQUE (section_name);


--
-- Name: nd_home nd_home_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nd_home
    ADD CONSTRAINT nd_home_pkey PRIMARY KEY (id);


--
-- Name: nd_home nd_home_section_key_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nd_home
    ADD CONSTRAINT nd_home_section_key_key UNIQUE (section_key);


--
-- Name: nd_menu nd_menu_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nd_menu
    ADD CONSTRAINT nd_menu_pkey PRIMARY KEY (id);


--
-- Name: nd_pricing_page nd_pricing_page_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nd_pricing_page
    ADD CONSTRAINT nd_pricing_page_pkey PRIMARY KEY (id);


--
-- Name: nd_pricing_page nd_pricing_page_section_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nd_pricing_page
    ADD CONSTRAINT nd_pricing_page_section_name_key UNIQUE (section_name);


--
-- Name: nd_teachers_page nd_teachers_page_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nd_teachers_page
    ADD CONSTRAINT nd_teachers_page_pkey PRIMARY KEY (id);


--
-- Name: nd_teachers_page nd_teachers_page_section_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nd_teachers_page
    ADD CONSTRAINT nd_teachers_page_section_name_key UNIQUE (section_name);


--
-- Name: nd_ui_translations nd_ui_translations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nd_ui_translations
    ADD CONSTRAINT nd_ui_translations_pkey PRIMARY KEY (id);


--
-- Name: pricing_plans pricing_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pricing_plans
    ADD CONSTRAINT pricing_plans_pkey PRIMARY KEY (id);


--
-- Name: site_settings site_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.site_settings
    ADD CONSTRAINT site_settings_pkey PRIMARY KEY (id);


--
-- Name: statistics statistics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.statistics
    ADD CONSTRAINT statistics_pkey PRIMARY KEY (id);


--
-- Name: teachers teachers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_pkey PRIMARY KEY (id);


--
-- Name: idx_blog_posts_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_blog_posts_category ON public.blog_posts USING btree (category);


--
-- Name: idx_blog_posts_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_blog_posts_created_at ON public.blog_posts USING btree (created_at DESC);


--
-- Name: idx_blog_posts_featured; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_blog_posts_featured ON public.blog_posts USING btree (is_featured, is_visible);


--
-- Name: idx_blog_posts_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_blog_posts_id ON public.blog_posts USING btree (id);


--
-- Name: idx_blog_posts_locale_published; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_blog_posts_locale_published ON public.blog_posts USING btree (locale, is_published);


--
-- Name: idx_consultations_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_consultations_created_at ON public.consultations USING btree (created_at);


--
-- Name: idx_consultations_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_consultations_email ON public.consultations USING btree (email);


--
-- Name: idx_consultations_interest; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_consultations_interest ON public.consultations USING btree (interest);


--
-- Name: idx_nd_about_page_order; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_nd_about_page_order ON public.nd_about_page USING btree (display_order);


--
-- Name: idx_nd_about_page_visible; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_nd_about_page_visible ON public.nd_about_page USING btree (visible);


--
-- Name: idx_nd_blog_page_order; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_nd_blog_page_order ON public.nd_blog_page USING btree (display_order);


--
-- Name: idx_nd_blog_page_visible; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_nd_blog_page_visible ON public.nd_blog_page USING btree (visible);


--
-- Name: idx_nd_career_center_platform_page_order; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_nd_career_center_platform_page_order ON public.nd_career_center_platform_page USING btree (display_order);


--
-- Name: idx_nd_career_center_platform_page_visible; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_nd_career_center_platform_page_visible ON public.nd_career_center_platform_page USING btree (visible);


--
-- Name: idx_nd_contact_page_order; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_nd_contact_page_order ON public.nd_contact_page USING btree (display_order);


--
-- Name: idx_nd_contact_page_visible; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_nd_contact_page_visible ON public.nd_contact_page USING btree (visible);


--
-- Name: idx_nd_course_details_page_section_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_nd_course_details_page_section_key ON public.nd_course_details_page USING btree (section_key);


--
-- Name: idx_nd_course_details_page_visible; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_nd_course_details_page_visible ON public.nd_course_details_page USING btree (visible);


--
-- Name: idx_nd_courses_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_nd_courses_category ON public.nd_courses USING btree (category);


--
-- Name: idx_nd_courses_featured; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_nd_courses_featured ON public.nd_courses USING btree (featured);


--
-- Name: idx_nd_courses_order; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_nd_courses_order ON public.nd_courses USING btree (order_index);


--
-- Name: idx_nd_courses_published; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_nd_courses_published ON public.nd_courses USING btree (published_at);


--
-- Name: idx_nd_courses_slug; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_nd_courses_slug ON public.nd_courses USING btree (slug);


--
-- Name: idx_nd_courses_visible; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_nd_courses_visible ON public.nd_courses USING btree (visible);


--
-- Name: idx_nd_home_order; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_nd_home_order ON public.nd_home USING btree (order_index);


--
-- Name: idx_nd_home_page_order; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_nd_home_page_order ON public.nd_home_page USING btree (display_order);


--
-- Name: idx_nd_home_page_visible; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_nd_home_page_visible ON public.nd_home_page USING btree (visible);


--
-- Name: idx_nd_home_visible; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_nd_home_visible ON public.nd_home USING btree (visible);


--
-- Name: idx_nd_pricing_page_order; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_nd_pricing_page_order ON public.nd_pricing_page USING btree (display_order);


--
-- Name: idx_nd_pricing_page_visible; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_nd_pricing_page_visible ON public.nd_pricing_page USING btree (visible);


--
-- Name: idx_teachers_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_teachers_category ON public.teachers USING btree (category);


--
-- Name: idx_teachers_display_order; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_teachers_display_order ON public.teachers USING btree (display_order);


--
-- Name: nd_course_details_page update_nd_course_details_page_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_nd_course_details_page_updated_at BEFORE UPDATE ON public.nd_course_details_page FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: nd_menu nd_menu_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nd_menu
    ADD CONSTRAINT nd_menu_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.nd_menu(id) ON DELETE CASCADE;


--
-- Name: TABLE nd_course_details_page; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.nd_course_details_page TO PUBLIC;


--
-- Name: SEQUENCE nd_course_details_page_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.nd_course_details_page_id_seq TO PUBLIC;


--
-- PostgreSQL database dump complete
--

