-- Direct Database Population for All Content Types
-- Run: sqlite3 .tmp/data.db < scripts/direct-db-populate.sql

-- Create Courses
INSERT INTO courses (document_id, title, description, price, duration, lessons, category, level, rating, visible, featured, created_at, updated_at, published_at, created_by_id, updated_by_id)
VALUES 
('course-1', 'Complete React Development', 'Master React.js from basics to advanced concepts', 199, '12 Weeks', 48, 'Web Development', 'intermediate', 4.9, 1, 1, datetime('now'), datetime('now'), datetime('now'), 1, 1),
('course-2', 'Python for Data Science', 'Learn Python with focus on data analysis and ML', 249, '10 Weeks', 40, 'Data Science', 'beginner', 4.8, 1, 1, datetime('now'), datetime('now'), datetime('now'), 1, 1),
('course-3', 'Full Stack JavaScript', 'Become a full stack developer with Node.js', 299, '16 Weeks', 64, 'Web Development', 'advanced', 4.95, 1, 1, datetime('now'), datetime('now'), datetime('now'), 1, 1),
('course-4', 'UI/UX Design Masterclass', 'Learn modern design principles and Figma', 179, '8 Weeks', 32, 'Design', 'beginner', 4.7, 1, 0, datetime('now'), datetime('now'), datetime('now'), 1, 1),
('course-5', 'Mobile App Development', 'Build native apps with React Native', 229, '12 Weeks', 48, 'Mobile', 'intermediate', 4.85, 1, 0, datetime('now'), datetime('now'), datetime('now'), 1, 1),
('course-6', 'Cloud Computing with AWS', 'Master AWS services and cloud architecture', 279, '10 Weeks', 40, 'Cloud', 'intermediate', 4.9, 1, 0, datetime('now'), datetime('now'), datetime('now'), 1, 1);

-- Create Blog Posts
INSERT INTO blog_posts (document_id, title, slug, excerpt, content, author, category, created_at, updated_at, published_at, created_by_id, updated_by_id)
VALUES
('blog-1', 'The Future of AI in Education', 'future-ai-education', 'Exploring how AI is revolutionizing education', '<p>AI is transforming education in unprecedented ways...</p>', 'Dr. Sarah Johnson', 'Technology', datetime('now'), datetime('now'), datetime('now'), 1, 1),
('blog-2', '10 Tips for Learning to Code', 'tips-learning-code', 'Essential tips for coding beginners', '<p>Learning to code can be challenging but rewarding...</p>', 'Mike Chen', 'Programming', datetime('now'), datetime('now'), datetime('now'), 1, 1),
('blog-3', 'Remote Work Best Practices', 'remote-work-practices', 'How to excel in remote work', '<p>Remote work has become the new normal...</p>', 'Lisa Anderson', 'Career', datetime('now'), datetime('now'), datetime('now'), 1, 1);

-- Create Teachers
INSERT INTO teachers (document_id, name, role, bio, linkedin, twitter, "order", created_at, updated_at, published_at, created_by_id, updated_by_id)
VALUES
('teacher-1', 'Dr. Sarah Johnson', 'Head of Data Science', 'PhD in Computer Science from MIT with 15+ years experience', 'https://linkedin.com/in/sarahjohnson', 'https://twitter.com/sarahjohnson', 1, datetime('now'), datetime('now'), datetime('now'), 1, 1),
('teacher-2', 'Mike Chen', 'Senior Web Developer', 'Full stack developer with 10+ years experience', 'https://linkedin.com/in/mikechen', '', 2, datetime('now'), datetime('now'), datetime('now'), 1, 1),
('teacher-3', 'Lisa Anderson', 'UX Design Lead', 'Award-winning designer with expertise in UX/UI', 'https://linkedin.com/in/lisaanderson', '', 3, datetime('now'), datetime('now'), datetime('now'), 1, 1),
('teacher-4', 'David Kumar', 'Cloud Architecture Expert', 'AWS certified solutions architect', 'https://linkedin.com/in/davidkumar', '', 4, datetime('now'), datetime('now'), datetime('now'), 1, 1);

-- Create Pricing Plans
INSERT INTO pricing_plans (document_id, name, price, period, description, featured, cta_text, "order", created_at, updated_at, published_at, created_by_id, updated_by_id)
VALUES
('plan-1', 'Basic', 29, 'month', 'Perfect for getting started', 0, 'Start Free Trial', 1, datetime('now'), datetime('now'), datetime('now'), 1, 1),
('plan-2', 'Professional', 79, 'month', 'Most popular for serious learners', 1, 'Get Started', 2, datetime('now'), datetime('now'), datetime('now'), 1, 1),
('plan-3', 'Enterprise', 199, 'month', 'For teams and organizations', 0, 'Contact Sales', 3, datetime('now'), datetime('now'), datetime('now'), 1, 1);

-- Create Job Postings
INSERT INTO job_postings (document_id, title, company, location, type, description, apply_url, created_at, updated_at, published_at, created_by_id, updated_by_id)
VALUES
('job-1', 'Senior React Developer', 'TechCorp Inc.', 'San Francisco, CA (Remote)', 'Full-time', 'Looking for experienced React developer', 'https://techcorp.com/careers', datetime('now'), datetime('now'), datetime('now'), 1, 1),
('job-2', 'Data Scientist', 'DataViz Solutions', 'New York, NY', 'Full-time', 'Join our data science team', 'https://dataviz.com/careers', datetime('now'), datetime('now'), datetime('now'), 1, 1),
('job-3', 'UX Designer', 'DesignHub', 'Remote', 'Contract', 'Need talented UX designer for 6-month project', 'https://designhub.com/careers', datetime('now'), datetime('now'), datetime('now'), 1, 1);

-- Create Career Resources
INSERT INTO career_resources (document_id, title, description, type, download_url, created_at, updated_at, published_at, created_by_id, updated_by_id)
VALUES
('resource-1', 'Resume Template Pack', 'Professional resume templates for tech roles', 'Template', '/resources/resume.pdf', datetime('now'), datetime('now'), datetime('now'), 1, 1),
('resource-2', 'Interview Preparation Guide', 'Complete guide to ace technical interviews', 'Guide', '/resources/interview.pdf', datetime('now'), datetime('now'), datetime('now'), 1, 1),
('resource-3', 'Salary Negotiation Handbook', 'Learn how to negotiate your worth', 'Handbook', '/resources/salary.pdf', datetime('now'), datetime('now'), datetime('now'), 1, 1);

-- Update About Page (if not exists, insert)
INSERT OR REPLACE INTO about_pages (id, document_id, hero_title, hero_subtitle, mission_title, mission_description, vision_title, vision_description, created_at, updated_at, published_at, created_by_id, updated_by_id)
VALUES
(1, 'about-page', 'About AI Studio', 'Transforming careers through education', 'Our Mission', 'To democratize access to high-quality technical education', 'Our Vision', 'To become the leading online learning platform', datetime('now'), datetime('now'), datetime('now'), 1, 1);

-- Update Contact Page (if not exists, insert)
INSERT OR REPLACE INTO contact_pages (id, document_id, phone, email, address, office_hours, map_url, created_at, updated_at, published_at, created_by_id, updated_by_id)
VALUES
(1, 'contact-page', '+1 (555) 123-4567', 'hello@aistudio.com', '123 Learning Street, Tech Valley, CA 94025', 'Monday - Friday: 9:00 AM - 6:00 PM PST', 'https://maps.google.com', datetime('now'), datetime('now'), datetime('now'), 1, 1);

-- Display summary
SELECT 'Content Added:' as Status;
SELECT 'Courses: ' || COUNT(*) FROM courses WHERE published_at IS NOT NULL;
SELECT 'Blog Posts: ' || COUNT(*) FROM blog_posts WHERE published_at IS NOT NULL;
SELECT 'Teachers: ' || COUNT(*) FROM teachers WHERE published_at IS NOT NULL;
SELECT 'Pricing Plans: ' || COUNT(*) FROM pricing_plans WHERE published_at IS NOT NULL;
SELECT 'Job Postings: ' || COUNT(*) FROM job_postings WHERE published_at IS NOT NULL;
SELECT 'Career Resources: ' || COUNT(*) FROM career_resources WHERE published_at IS NOT NULL;