-- Add all course fields for 6 courses
ALTER TABLE home_pages ADD COLUMN course1_title TEXT DEFAULT 'Complete React Development Course';
ALTER TABLE home_pages ADD COLUMN course1_rating TEXT DEFAULT '4.9';
ALTER TABLE home_pages ADD COLUMN course1_lessons TEXT DEFAULT '48 Lessons';
ALTER TABLE home_pages ADD COLUMN course1_duration TEXT DEFAULT '12 Weeks';
ALTER TABLE home_pages ADD COLUMN course1_category TEXT DEFAULT 'Web Dev';
ALTER TABLE home_pages ADD COLUMN course1_visible BOOLEAN DEFAULT 1;

ALTER TABLE home_pages ADD COLUMN course2_title TEXT DEFAULT 'Python for Data Science & AI';
ALTER TABLE home_pages ADD COLUMN course2_rating TEXT DEFAULT '5.0';
ALTER TABLE home_pages ADD COLUMN course2_lessons TEXT DEFAULT '60 Lessons';
ALTER TABLE home_pages ADD COLUMN course2_duration TEXT DEFAULT '16 Weeks';
ALTER TABLE home_pages ADD COLUMN course2_category TEXT DEFAULT 'Data Science';
ALTER TABLE home_pages ADD COLUMN course2_visible BOOLEAN DEFAULT 1;

ALTER TABLE home_pages ADD COLUMN course3_title TEXT DEFAULT 'Mobile App Development';
ALTER TABLE home_pages ADD COLUMN course3_rating TEXT DEFAULT '4.8';
ALTER TABLE home_pages ADD COLUMN course3_lessons TEXT DEFAULT '52 Lessons';
ALTER TABLE home_pages ADD COLUMN course3_duration TEXT DEFAULT '14 Weeks';
ALTER TABLE home_pages ADD COLUMN course3_category TEXT DEFAULT 'Mobile';
ALTER TABLE home_pages ADD COLUMN course3_visible BOOLEAN DEFAULT 1;

ALTER TABLE home_pages ADD COLUMN course4_title TEXT DEFAULT 'Cloud Computing & DevOps';
ALTER TABLE home_pages ADD COLUMN course4_rating TEXT DEFAULT '4.7';
ALTER TABLE home_pages ADD COLUMN course4_lessons TEXT DEFAULT '44 Lessons';
ALTER TABLE home_pages ADD COLUMN course4_duration TEXT DEFAULT '10 Weeks';
ALTER TABLE home_pages ADD COLUMN course4_category TEXT DEFAULT 'Cloud';
ALTER TABLE home_pages ADD COLUMN course4_visible BOOLEAN DEFAULT 1;

ALTER TABLE home_pages ADD COLUMN course5_title TEXT DEFAULT 'Machine Learning Fundamentals';
ALTER TABLE home_pages ADD COLUMN course5_rating TEXT DEFAULT '4.9';
ALTER TABLE home_pages ADD COLUMN course5_lessons TEXT DEFAULT '56 Lessons';
ALTER TABLE home_pages ADD COLUMN course5_duration TEXT DEFAULT '18 Weeks';
ALTER TABLE home_pages ADD COLUMN course5_category TEXT DEFAULT 'AI/ML';
ALTER TABLE home_pages ADD COLUMN course5_visible BOOLEAN DEFAULT 1;

ALTER TABLE home_pages ADD COLUMN course6_title TEXT DEFAULT 'DevOps Engineering';
ALTER TABLE home_pages ADD COLUMN course6_rating TEXT DEFAULT '4.8';
ALTER TABLE home_pages ADD COLUMN course6_lessons TEXT DEFAULT '50 Lessons';
ALTER TABLE home_pages ADD COLUMN course6_duration TEXT DEFAULT '12 Weeks';
ALTER TABLE home_pages ADD COLUMN course6_category TEXT DEFAULT 'DevOps';
ALTER TABLE home_pages ADD COLUMN course6_visible BOOLEAN DEFAULT 1;

-- Add testimonial fields for 4 testimonials
ALTER TABLE home_pages ADD COLUMN testimonial1_text TEXT DEFAULT 'Completed the Android Development course. It was very convenient that it was held online. The material is presented clearly and structured. Practice-oriented approach helped me land a job immediately after graduation.';
ALTER TABLE home_pages ADD COLUMN testimonial1_author TEXT DEFAULT 'Vyacheslav';
ALTER TABLE home_pages ADD COLUMN testimonial1_rating TEXT DEFAULT '5.0';
ALTER TABLE home_pages ADD COLUMN testimonial1_visible BOOLEAN DEFAULT 1;

ALTER TABLE home_pages ADD COLUMN testimonial2_text TEXT DEFAULT 'Finished Data Science training. Instructor Maxim Stepanovich is excellent. Great presentation of complex topics, always ready to help with questions. The course gave me practical skills I use daily at work.';
ALTER TABLE home_pages ADD COLUMN testimonial2_author TEXT DEFAULT 'Alexander';
ALTER TABLE home_pages ADD COLUMN testimonial2_rating TEXT DEFAULT '5.0';
ALTER TABLE home_pages ADD COLUMN testimonial2_visible BOOLEAN DEFAULT 1;

ALTER TABLE home_pages ADD COLUMN testimonial3_text TEXT DEFAULT 'Completed JavaScript automation course and I''m very satisfied! The material is presented clearly and comprehensively. Real-world projects helped me build an impressive portfolio that helped me get hired.';
ALTER TABLE home_pages ADD COLUMN testimonial3_author TEXT DEFAULT 'Igor Truhanovich';
ALTER TABLE home_pages ADD COLUMN testimonial3_rating TEXT DEFAULT '5.0';
ALTER TABLE home_pages ADD COLUMN testimonial3_visible BOOLEAN DEFAULT 1;

ALTER TABLE home_pages ADD COLUMN testimonial4_text TEXT DEFAULT 'The UX/UI Design course exceeded my expectations! From zero knowledge to landing my dream job in just 5 months. The instructors are industry professionals who really care about your success.';
ALTER TABLE home_pages ADD COLUMN testimonial4_author TEXT DEFAULT 'Maria Petrova';
ALTER TABLE home_pages ADD COLUMN testimonial4_rating TEXT DEFAULT '5.0';
ALTER TABLE home_pages ADD COLUMN testimonial4_visible BOOLEAN DEFAULT 1;

-- Add testimonials section fields
ALTER TABLE home_pages ADD COLUMN testimonials_title TEXT DEFAULT 'Alumni Reviews';
ALTER TABLE home_pages ADD COLUMN testimonials_subtitle TEXT DEFAULT 'Real feedback from our graduates who have successfully transformed their careers through our courses.';
ALTER TABLE home_pages ADD COLUMN testimonials_visible BOOLEAN DEFAULT 1;

-- Update timestamp
UPDATE home_pages SET updated_at = CURRENT_TIMESTAMP WHERE id = 1;