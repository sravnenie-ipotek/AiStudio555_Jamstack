-- Migration to fix career_orientation_pages table schema
-- Adds all missing columns needed by the admin panel

-- First, check if table exists and create if not
CREATE TABLE IF NOT EXISTS career_orientation_pages (
    id SERIAL PRIMARY KEY,
    locale VARCHAR(10) NOT NULL DEFAULT 'en',
    title TEXT,
    subtitle TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add all missing columns (safe to run multiple times - IF NOT EXISTS)
ALTER TABLE career_orientation_pages 
ADD COLUMN IF NOT EXISTS hero_title TEXT,
ADD COLUMN IF NOT EXISTS hero_subtitle TEXT,
ADD COLUMN IF NOT EXISTS hero_description TEXT,
ADD COLUMN IF NOT EXISTS hero_main_title TEXT,
ADD COLUMN IF NOT EXISTS hero_stat1_number TEXT,
ADD COLUMN IF NOT EXISTS hero_stat1_label TEXT,
ADD COLUMN IF NOT EXISTS hero_stat1_value TEXT,
ADD COLUMN IF NOT EXISTS hero_stat2_number TEXT,
ADD COLUMN IF NOT EXISTS hero_stat2_label TEXT,
ADD COLUMN IF NOT EXISTS hero_stat2_value TEXT,
ADD COLUMN IF NOT EXISTS hero_stat3_number TEXT,
ADD COLUMN IF NOT EXISTS hero_stat3_label TEXT,
ADD COLUMN IF NOT EXISTS hero_stat3_value TEXT,
ADD COLUMN IF NOT EXISTS hero_cta_text TEXT,
ADD COLUMN IF NOT EXISTS hero_cta_link TEXT,
ADD COLUMN IF NOT EXISTS hero_badge_text TEXT,
ADD COLUMN IF NOT EXISTS hero_visible BOOLEAN DEFAULT true;

-- Problems Section columns
ALTER TABLE career_orientation_pages
ADD COLUMN IF NOT EXISTS problems_main_title TEXT,
ADD COLUMN IF NOT EXISTS problems_subtitle TEXT,
ADD COLUMN IF NOT EXISTS problems_description TEXT,
ADD COLUMN IF NOT EXISTS problem1_icon TEXT,
ADD COLUMN IF NOT EXISTS problem1_title TEXT,
ADD COLUMN IF NOT EXISTS problem1_description TEXT,
ADD COLUMN IF NOT EXISTS problem1_stat TEXT,
ADD COLUMN IF NOT EXISTS problem1_stat_label TEXT,
ADD COLUMN IF NOT EXISTS problem2_icon TEXT,
ADD COLUMN IF NOT EXISTS problem2_title TEXT,
ADD COLUMN IF NOT EXISTS problem2_description TEXT,
ADD COLUMN IF NOT EXISTS problem2_stat TEXT,
ADD COLUMN IF NOT EXISTS problem2_stat_label TEXT,
ADD COLUMN IF NOT EXISTS problems_visible BOOLEAN DEFAULT true;

-- Challenges Section (legacy support)
ALTER TABLE career_orientation_pages
ADD COLUMN IF NOT EXISTS challenges_title TEXT,
ADD COLUMN IF NOT EXISTS challenge1_title TEXT,
ADD COLUMN IF NOT EXISTS challenge1_description TEXT,
ADD COLUMN IF NOT EXISTS challenge2_title TEXT,
ADD COLUMN IF NOT EXISTS challenge2_description TEXT,
ADD COLUMN IF NOT EXISTS challenge3_title TEXT,
ADD COLUMN IF NOT EXISTS challenge3_description TEXT,
ADD COLUMN IF NOT EXISTS challenge4_title TEXT,
ADD COLUMN IF NOT EXISTS challenge4_description TEXT;

-- Solutions Section columns
ALTER TABLE career_orientation_pages
ADD COLUMN IF NOT EXISTS solutions_main_title TEXT,
ADD COLUMN IF NOT EXISTS solutions_subtitle TEXT,
ADD COLUMN IF NOT EXISTS solution1_icon TEXT,
ADD COLUMN IF NOT EXISTS solution1_title TEXT,
ADD COLUMN IF NOT EXISTS solution1_description TEXT,
ADD COLUMN IF NOT EXISTS solution1_feature1 TEXT,
ADD COLUMN IF NOT EXISTS solution1_feature2 TEXT,
ADD COLUMN IF NOT EXISTS solution1_feature3 TEXT,
ADD COLUMN IF NOT EXISTS solution1_feature4 TEXT,
ADD COLUMN IF NOT EXISTS solution1_benefit TEXT,
ADD COLUMN IF NOT EXISTS solution2_icon TEXT,
ADD COLUMN IF NOT EXISTS solution2_title TEXT,
ADD COLUMN IF NOT EXISTS solution2_description TEXT,
ADD COLUMN IF NOT EXISTS solutions_visible BOOLEAN DEFAULT true;

-- Process Section columns
ALTER TABLE career_orientation_pages
ADD COLUMN IF NOT EXISTS process_title TEXT,
ADD COLUMN IF NOT EXISTS process_main_title TEXT,
ADD COLUMN IF NOT EXISTS process_subtitle TEXT,
ADD COLUMN IF NOT EXISTS process_step1_title TEXT,
ADD COLUMN IF NOT EXISTS process_step1_description TEXT,
ADD COLUMN IF NOT EXISTS process_step1_duration TEXT,
ADD COLUMN IF NOT EXISTS process_step2_title TEXT,
ADD COLUMN IF NOT EXISTS process_step2_description TEXT,
ADD COLUMN IF NOT EXISTS process_step2_duration TEXT,
ADD COLUMN IF NOT EXISTS process_step3_title TEXT,
ADD COLUMN IF NOT EXISTS process_step3_description TEXT,
ADD COLUMN IF NOT EXISTS process_step3_duration TEXT,
ADD COLUMN IF NOT EXISTS process_step4_title TEXT,
ADD COLUMN IF NOT EXISTS process_step4_description TEXT,
ADD COLUMN IF NOT EXISTS process_step4_duration TEXT,
ADD COLUMN IF NOT EXISTS process_step5_title TEXT,
ADD COLUMN IF NOT EXISTS process_step5_description TEXT,
ADD COLUMN IF NOT EXISTS process_step5_duration TEXT,
ADD COLUMN IF NOT EXISTS process_visible BOOLEAN DEFAULT true;

-- Career Paths Section columns  
ALTER TABLE career_orientation_pages
ADD COLUMN IF NOT EXISTS career_paths_main_title TEXT,
ADD COLUMN IF NOT EXISTS career_paths_subtitle TEXT,
ADD COLUMN IF NOT EXISTS career_path1_title TEXT,
ADD COLUMN IF NOT EXISTS career_path1_description TEXT,
ADD COLUMN IF NOT EXISTS career_path1_salary_range TEXT,
ADD COLUMN IF NOT EXISTS career_path1_growth_rate TEXT,
ADD COLUMN IF NOT EXISTS career_path1_top_skills TEXT,
ADD COLUMN IF NOT EXISTS career_path2_title TEXT,
ADD COLUMN IF NOT EXISTS career_path2_description TEXT,
ADD COLUMN IF NOT EXISTS career_path2_salary_range TEXT,
ADD COLUMN IF NOT EXISTS career_path2_growth_rate TEXT,
ADD COLUMN IF NOT EXISTS career_path3_title TEXT,
ADD COLUMN IF NOT EXISTS career_path3_description TEXT,
ADD COLUMN IF NOT EXISTS career_paths_visible BOOLEAN DEFAULT true;

-- Expert Section columns
ALTER TABLE career_orientation_pages
ADD COLUMN IF NOT EXISTS expert_name TEXT,
ADD COLUMN IF NOT EXISTS expert_title TEXT,
ADD COLUMN IF NOT EXISTS expert_credentials TEXT,
ADD COLUMN IF NOT EXISTS expert_background TEXT,
ADD COLUMN IF NOT EXISTS expert_description TEXT,
ADD COLUMN IF NOT EXISTS expert_quote TEXT,
ADD COLUMN IF NOT EXISTS expert_linkedin TEXT,
ADD COLUMN IF NOT EXISTS expert_twitter TEXT,
ADD COLUMN IF NOT EXISTS expert_achievements TEXT,
ADD COLUMN IF NOT EXISTS expert_visible BOOLEAN DEFAULT true;

-- Partners Section columns
ALTER TABLE career_orientation_pages
ADD COLUMN IF NOT EXISTS partners_title TEXT,
ADD COLUMN IF NOT EXISTS partners_main_title TEXT,
ADD COLUMN IF NOT EXISTS partners_subtitle TEXT,
ADD COLUMN IF NOT EXISTS partner1_name TEXT,
ADD COLUMN IF NOT EXISTS partner1_description TEXT,
ADD COLUMN IF NOT EXISTS partner2_name TEXT,
ADD COLUMN IF NOT EXISTS partner2_description TEXT,
ADD COLUMN IF NOT EXISTS partner3_name TEXT,
ADD COLUMN IF NOT EXISTS partner3_description TEXT,
ADD COLUMN IF NOT EXISTS partners_visible BOOLEAN DEFAULT true;

-- Assessment Section columns
ALTER TABLE career_orientation_pages
ADD COLUMN IF NOT EXISTS assessment_main_title TEXT,
ADD COLUMN IF NOT EXISTS assessment_subtitle TEXT,
ADD COLUMN IF NOT EXISTS assessment_description TEXT,
ADD COLUMN IF NOT EXISTS assessment_questions JSON,
ADD COLUMN IF NOT EXISTS assessment_visible BOOLEAN DEFAULT true;

-- Resources Section columns
ALTER TABLE career_orientation_pages
ADD COLUMN IF NOT EXISTS resources_main_title TEXT,
ADD COLUMN IF NOT EXISTS resources_subtitle TEXT,
ADD COLUMN IF NOT EXISTS resources JSON,
ADD COLUMN IF NOT EXISTS resources_visible BOOLEAN DEFAULT true;

-- Success Stories Section columns
ALTER TABLE career_orientation_pages
ADD COLUMN IF NOT EXISTS success_stories_main_title TEXT,
ADD COLUMN IF NOT EXISTS success_stories_subtitle TEXT,
ADD COLUMN IF NOT EXISTS success_stories JSON,
ADD COLUMN IF NOT EXISTS success_stories_visible BOOLEAN DEFAULT true;

-- CTA Section columns
ALTER TABLE career_orientation_pages
ADD COLUMN IF NOT EXISTS cta_main_title TEXT,
ADD COLUMN IF NOT EXISTS cta_subtitle TEXT,
ADD COLUMN IF NOT EXISTS cta_description TEXT,
ADD COLUMN IF NOT EXISTS cta_button_text TEXT,
ADD COLUMN IF NOT EXISTS cta_button_link TEXT,
ADD COLUMN IF NOT EXISTS cta_visible BOOLEAN DEFAULT true;

-- Meta/SEO columns
ALTER TABLE career_orientation_pages
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS meta_keywords TEXT,
ADD COLUMN IF NOT EXISTS og_title TEXT,
ADD COLUMN IF NOT EXISTS og_description TEXT,
ADD COLUMN IF NOT EXISTS og_image TEXT;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_career_orientation_locale ON career_orientation_pages(locale);
CREATE INDEX IF NOT EXISTS idx_career_orientation_updated ON career_orientation_pages(updated_at);

-- Insert default row if table is empty
INSERT INTO career_orientation_pages (locale, title, subtitle, hero_main_title)
SELECT 'en', 'Career Orientation', 'Find Your Path', 'Discover Your Tech Career Path'
WHERE NOT EXISTS (SELECT 1 FROM career_orientation_pages WHERE locale = 'en');

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_career_orientation_updated_at ON career_orientation_pages;

CREATE TRIGGER update_career_orientation_updated_at 
BEFORE UPDATE ON career_orientation_pages
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Success message
SELECT 'Migration completed: Added all missing columns to career_orientation_pages table' as status;