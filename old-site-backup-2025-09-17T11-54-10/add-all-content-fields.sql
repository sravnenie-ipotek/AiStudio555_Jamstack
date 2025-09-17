-- SQL Script to add all content fields to home_pages table
-- This makes ALL content on the home page manageable through Strapi

-- Add Featured Courses Section fields
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS featured_courses_title TEXT DEFAULT 'Most Popular IT Courses To Advance Your Career.';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS featured_courses_description TEXT DEFAULT 'Dive into our expertly curated selection of featured courses, designed to equip you with the skills and knowledge needed to excel.';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS featured_courses_visible BOOLEAN DEFAULT 1;

-- Add About Section fields  
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS about_title TEXT DEFAULT 'About Us';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS about_subtitle TEXT DEFAULT 'Why Choose Us';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS about_description TEXT DEFAULT 'We are dedicated to providing exceptional education and training.';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS about_achievement_text TEXT DEFAULT 'She has received prestigious honors "Top Educator" award and the "Teaching Excellence" award.';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS about_visible BOOLEAN DEFAULT 1;

-- Add Testimonials Section fields
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS testimonials_title TEXT DEFAULT 'What Our Students Say';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS testimonials_subtitle TEXT DEFAULT 'Real Success Stories';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS testimonials_visible BOOLEAN DEFAULT 1;

-- Add Graduate Companies Section fields
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS companies_title TEXT DEFAULT 'Our Graduates Work At';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS companies_subtitle TEXT DEFAULT 'Career Success';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS companies_description TEXT DEFAULT 'Join alumni at the world''s leading technology companies';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS companies_visible BOOLEAN DEFAULT 1;

-- Add Individual Course fields (6 featured courses)
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS course1_title TEXT DEFAULT 'Full-Stack Web Development';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS course1_instructor TEXT DEFAULT 'Michael Johnson';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS course1_duration TEXT DEFAULT '16 Weeks';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS course1_price TEXT DEFAULT '$1,999';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS course1_rating TEXT DEFAULT '4.9';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS course1_visible BOOLEAN DEFAULT 1;

ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS course2_title TEXT DEFAULT 'Data Science & Machine Learning';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS course2_instructor TEXT DEFAULT 'Sarah Chen';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS course2_duration TEXT DEFAULT '20 Weeks';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS course2_price TEXT DEFAULT '$2,499';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS course2_rating TEXT DEFAULT '5.0';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS course2_visible BOOLEAN DEFAULT 1;

ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS course3_title TEXT DEFAULT 'Cloud Computing & DevOps';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS course3_instructor TEXT DEFAULT 'David Kumar';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS course3_duration TEXT DEFAULT '12 Weeks';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS course3_price TEXT DEFAULT '$1,799';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS course3_rating TEXT DEFAULT '4.8';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS course3_visible BOOLEAN DEFAULT 1;

ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS course4_title TEXT DEFAULT 'Cybersecurity Fundamentals';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS course4_instructor TEXT DEFAULT 'Alex Rodriguez';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS course4_duration TEXT DEFAULT '14 Weeks';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS course4_price TEXT DEFAULT '$1,899';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS course4_rating TEXT DEFAULT '4.9';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS course4_visible BOOLEAN DEFAULT 1;

ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS course5_title TEXT DEFAULT 'Mobile App Development';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS course5_instructor TEXT DEFAULT 'Emma Wilson';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS course5_duration TEXT DEFAULT '18 Weeks';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS course5_price TEXT DEFAULT '$2,199';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS course5_rating TEXT DEFAULT '4.7';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS course5_visible BOOLEAN DEFAULT 1;

ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS course6_title TEXT DEFAULT 'UI/UX Design Masterclass';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS course6_instructor TEXT DEFAULT 'Jessica Park';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS course6_duration TEXT DEFAULT '10 Weeks';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS course6_price TEXT DEFAULT '$1,599';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS course6_rating TEXT DEFAULT '4.8';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS course6_visible BOOLEAN DEFAULT 1;

-- Add Testimonial fields (5 testimonials)
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS testimonial1_text TEXT DEFAULT 'This course completely transformed my career. The instructors are world-class!';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS testimonial1_author TEXT DEFAULT 'John Smith';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS testimonial1_role TEXT DEFAULT 'Software Engineer at Google';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS testimonial1_visible BOOLEAN DEFAULT 1;

ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS testimonial2_text TEXT DEFAULT 'Best investment I ever made. Landed my dream job within 3 months of graduating.';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS testimonial2_author TEXT DEFAULT 'Maria Garcia';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS testimonial2_role TEXT DEFAULT 'Data Scientist at Meta';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS testimonial2_visible BOOLEAN DEFAULT 1;

ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS testimonial3_text TEXT DEFAULT 'The practical approach and real-world projects made all the difference.';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS testimonial3_author TEXT DEFAULT 'David Lee';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS testimonial3_role TEXT DEFAULT 'DevOps Engineer at Amazon';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS testimonial3_visible BOOLEAN DEFAULT 1;

ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS testimonial4_text TEXT DEFAULT 'Excellent curriculum and amazing support from the career services team.';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS testimonial4_author TEXT DEFAULT 'Sarah Johnson';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS testimonial4_role TEXT DEFAULT 'Product Manager at Microsoft';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS testimonial4_visible BOOLEAN DEFAULT 1;

ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS testimonial5_text TEXT DEFAULT 'Life-changing experience. The skills I learned are directly applicable to my work.';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS testimonial5_author TEXT DEFAULT 'Robert Chen';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS testimonial5_role TEXT DEFAULT 'Full Stack Developer at Apple';
ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS testimonial5_visible BOOLEAN DEFAULT 1;

-- Update the existing record with all new fields
UPDATE home_pages SET updated_at = CURRENT_TIMESTAMP WHERE id = 1;