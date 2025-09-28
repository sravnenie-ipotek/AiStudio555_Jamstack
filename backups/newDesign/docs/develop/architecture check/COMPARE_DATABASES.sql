-- ================================================================
-- DATABASE COMPARISON QUERIES
-- ================================================================
-- Run these queries in both LOCAL and RAILWAY databases
-- Then compare the results to see differences
-- ================================================================

-- ================================================================
-- QUERY 1: DATABASE OVERVIEW
-- ================================================================

SELECT
    'DATABASE OVERVIEW' as section,
    current_database() as database_name,
    pg_database_size(current_database()) / 1024 / 1024 as size_mb,
    NOW() as checked_at;

-- ================================================================
-- QUERY 2: TABLE COUNT AND LIST
-- ================================================================

SELECT
    'TABLES' as section,
    COUNT(*) as table_count,
    string_agg(table_name, ', ' ORDER BY table_name) as table_list
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE';

-- ================================================================
-- QUERY 3: DETAILED TABLE INFORMATION
-- ================================================================

WITH table_info AS (
    SELECT
        t.table_name,
        COUNT(c.column_name) as column_count
    FROM information_schema.tables t
    LEFT JOIN information_schema.columns c
        ON t.table_name = c.table_name
        AND t.table_schema = c.table_schema
    WHERE t.table_schema = 'public'
    AND t.table_type = 'BASE TABLE'
    GROUP BY t.table_name
),
record_counts AS (
    SELECT 'about_pages' as table_name, COUNT(*) as record_count FROM about_pages
    UNION ALL
    SELECT 'blog_posts', COUNT(*) FROM blog_posts
    UNION ALL
    SELECT 'button_texts', COUNT(*) FROM button_texts
    UNION ALL
    SELECT 'career_center_pages', COUNT(*) FROM career_center_pages
    UNION ALL
    SELECT 'career_orientation_pages', COUNT(*) FROM career_orientation_pages
    UNION ALL
    SELECT 'career_resources', COUNT(*) FROM career_resources
    UNION ALL
    SELECT 'company_logos', COUNT(*) FROM company_logos
    UNION ALL
    SELECT 'consultation_services', COUNT(*) FROM consultation_services
    UNION ALL
    SELECT 'consultations', COUNT(*) FROM consultations
    UNION ALL
    SELECT 'contact_pages', COUNT(*) FROM contact_pages
    UNION ALL
    SELECT 'courses', COUNT(*) FROM courses
    UNION ALL
    SELECT 'entity_teachers', COUNT(*) FROM entity_teachers
    UNION ALL
    SELECT 'faqs', COUNT(*) FROM faqs
    UNION ALL
    SELECT 'footer_content', COUNT(*) FROM footer_content
    UNION ALL
    SELECT 'home_pages', COUNT(*) FROM home_pages
    UNION ALL
    SELECT 'job_postings', COUNT(*) FROM job_postings
    UNION ALL
    SELECT 'navigation_menus', COUNT(*) FROM navigation_menus
    UNION ALL
    SELECT 'nd_about_page', COUNT(*) FROM nd_about_page
    UNION ALL
    SELECT 'nd_blog_page', COUNT(*) FROM nd_blog_page
    UNION ALL
    SELECT 'nd_blog_posts', COUNT(*) FROM nd_blog_posts
    UNION ALL
    SELECT 'nd_career_center_platform_page', COUNT(*) FROM nd_career_center_platform_page
    UNION ALL
    SELECT 'nd_contact_page', COUNT(*) FROM nd_contact_page
    UNION ALL
    SELECT 'nd_course_details_page', COUNT(*) FROM nd_course_details_page
    UNION ALL
    SELECT 'nd_courses', COUNT(*) FROM nd_courses
    UNION ALL
    SELECT 'nd_courses_page', COUNT(*) FROM nd_courses_page
    UNION ALL
    SELECT 'nd_footer', COUNT(*) FROM nd_footer
    UNION ALL
    SELECT 'nd_home', COUNT(*) FROM nd_home
    UNION ALL
    SELECT 'nd_home_page', COUNT(*) FROM nd_home_page
    UNION ALL
    SELECT 'nd_menu', COUNT(*) FROM nd_menu
    UNION ALL
    SELECT 'nd_pricing_page', COUNT(*) FROM nd_pricing_page
    UNION ALL
    SELECT 'nd_teachers_page', COUNT(*) FROM nd_teachers_page
    UNION ALL
    SELECT 'nd_ui_translations', COUNT(*) FROM nd_ui_translations
    UNION ALL
    SELECT 'pricing_plans', COUNT(*) FROM pricing_plans
    UNION ALL
    SELECT 'site_settings', COUNT(*) FROM site_settings
    UNION ALL
    SELECT 'statistics', COUNT(*) FROM statistics
    UNION ALL
    SELECT 'teachers', COUNT(*) FROM teachers
)
SELECT
    ti.table_name,
    ti.column_count,
    COALESCE(rc.record_count, 0) as record_count
FROM table_info ti
LEFT JOIN record_counts rc ON ti.table_name = rc.table_name
ORDER BY ti.table_name;

-- ================================================================
-- QUERY 4: RECORD COUNT SUMMARY
-- ================================================================

SELECT
    'RECORD TOTALS' as section,
    SUM(record_count) as total_records,
    COUNT(*) as tables_with_data
FROM (
    SELECT COUNT(*) as record_count FROM about_pages
    UNION ALL SELECT COUNT(*) FROM blog_posts
    UNION ALL SELECT COUNT(*) FROM button_texts
    UNION ALL SELECT COUNT(*) FROM career_center_pages
    UNION ALL SELECT COUNT(*) FROM career_orientation_pages
    UNION ALL SELECT COUNT(*) FROM career_resources
    UNION ALL SELECT COUNT(*) FROM company_logos
    UNION ALL SELECT COUNT(*) FROM consultation_services
    UNION ALL SELECT COUNT(*) FROM consultations
    UNION ALL SELECT COUNT(*) FROM contact_pages
    UNION ALL SELECT COUNT(*) FROM courses
    UNION ALL SELECT COUNT(*) FROM entity_teachers
    UNION ALL SELECT COUNT(*) FROM faqs
    UNION ALL SELECT COUNT(*) FROM footer_content
    UNION ALL SELECT COUNT(*) FROM home_pages
    UNION ALL SELECT COUNT(*) FROM job_postings
    UNION ALL SELECT COUNT(*) FROM navigation_menus
    UNION ALL SELECT COUNT(*) FROM nd_about_page
    UNION ALL SELECT COUNT(*) FROM nd_blog_page
    UNION ALL SELECT COUNT(*) FROM nd_blog_posts
    UNION ALL SELECT COUNT(*) FROM nd_career_center_platform_page
    UNION ALL SELECT COUNT(*) FROM nd_contact_page
    UNION ALL SELECT COUNT(*) FROM nd_course_details_page
    UNION ALL SELECT COUNT(*) FROM nd_courses
    UNION ALL SELECT COUNT(*) FROM nd_courses_page
    UNION ALL SELECT COUNT(*) FROM nd_footer
    UNION ALL SELECT COUNT(*) FROM nd_home
    UNION ALL SELECT COUNT(*) FROM nd_home_page
    UNION ALL SELECT COUNT(*) FROM nd_menu
    UNION ALL SELECT COUNT(*) FROM nd_pricing_page
    UNION ALL SELECT COUNT(*) FROM nd_teachers_page
    UNION ALL SELECT COUNT(*) FROM nd_ui_translations
    UNION ALL SELECT COUNT(*) FROM pricing_plans
    UNION ALL SELECT COUNT(*) FROM site_settings
    UNION ALL SELECT COUNT(*) FROM statistics
    UNION ALL SELECT COUNT(*) FROM teachers
) as counts
WHERE record_count > 0;

-- ================================================================
-- QUERY 5: KEY TABLES CHECK
-- ================================================================

SELECT 'KEY TABLES CHECK' as section;

SELECT
    'blog_posts' as table_name,
    COUNT(*) as records,
    COUNT(DISTINCT locale) as locales,
    COUNT(CASE WHEN title_ru IS NOT NULL THEN 1 END) as has_russian,
    COUNT(CASE WHEN title_he IS NOT NULL THEN 1 END) as has_hebrew
FROM blog_posts;

SELECT
    'nd_courses' as table_name,
    COUNT(*) as records,
    COUNT(CASE WHEN visible = true THEN 1 END) as visible_count,
    COUNT(CASE WHEN title_ru IS NOT NULL THEN 1 END) as has_russian,
    COUNT(CASE WHEN title_he IS NOT NULL THEN 1 END) as has_hebrew
FROM nd_courses;

SELECT
    'nd_home' as table_name,
    COUNT(*) as records,
    COUNT(CASE WHEN content_en IS NOT NULL THEN 1 END) as has_english,
    COUNT(CASE WHEN content_ru IS NOT NULL THEN 1 END) as has_russian,
    COUNT(CASE WHEN content_he IS NOT NULL THEN 1 END) as has_hebrew
FROM nd_home;

SELECT
    'nd_menu' as table_name,
    COUNT(*) as records,
    COUNT(CASE WHEN visible = true THEN 1 END) as visible_count,
    COUNT(CASE WHEN parent_id IS NULL THEN 1 END) as root_items,
    COUNT(CASE WHEN parent_id IS NOT NULL THEN 1 END) as child_items
FROM nd_menu;

-- ================================================================
-- QUERY 6: SAMPLE DATA FROM KEY TABLES
-- ================================================================

SELECT 'SAMPLE DATA' as section;

-- Sample blog posts
SELECT
    id,
    title,
    locale,
    CASE
        WHEN title_ru IS NOT NULL THEN '✓'
        ELSE '✗'
    END as has_ru,
    CASE
        WHEN title_he IS NOT NULL THEN '✓'
        ELSE '✗'
    END as has_he,
    created_at::date as created
FROM blog_posts
ORDER BY id
LIMIT 5;

-- Sample courses
SELECT
    id,
    title,
    price,
    visible,
    created_at::date as created
FROM nd_courses
ORDER BY id
LIMIT 5;

-- ================================================================
-- QUERY 7: COLUMN STRUCTURE CHECK
-- ================================================================

SELECT
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'blog_posts'
AND table_schema = 'public'
ORDER BY ordinal_position
LIMIT 10;

-- ================================================================
-- RESULTS TO COMPARE:
-- ================================================================
-- Run all these queries on BOTH databases and compare:
-- 1. Total table count
-- 2. Table names list
-- 3. Record counts per table
-- 4. Total record count
-- 5. Column structure for key tables
-- 6. Sample data
-- ================================================================