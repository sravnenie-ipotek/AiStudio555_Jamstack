-- Migration: Comprehensive expansion of career pages with all content fields
-- This migration adds all the missing fields to match the actual page content

-- First, add all missing columns to career_orientation_pages
ALTER TABLE career_orientation_pages 
ADD COLUMN IF NOT EXISTS hero_stat1_number VARCHAR(20) DEFAULT '500+',
ADD COLUMN IF NOT EXISTS hero_stat1_label VARCHAR(100) DEFAULT 'Career Paths Mapped',
ADD COLUMN IF NOT EXISTS hero_stat2_number VARCHAR(20) DEFAULT '15+',
ADD COLUMN IF NOT EXISTS hero_stat2_label VARCHAR(100) DEFAULT 'AI Specializations',
ADD COLUMN IF NOT EXISTS hero_stat3_number VARCHAR(20) DEFAULT '95%',
ADD COLUMN IF NOT EXISTS hero_stat3_label VARCHAR(100) DEFAULT 'Success Rate',

-- Challenges Section
ADD COLUMN IF NOT EXISTS challenges_title VARCHAR(255) DEFAULT 'Common Career Challenges',
ADD COLUMN IF NOT EXISTS challenge1_title VARCHAR(255) DEFAULT 'Overwhelmed by AI/ML Career Options',
ADD COLUMN IF NOT EXISTS challenge1_description TEXT,
ADD COLUMN IF NOT EXISTS challenge2_title VARCHAR(255) DEFAULT 'Uncertain About Required Skills',
ADD COLUMN IF NOT EXISTS challenge2_description TEXT,
ADD COLUMN IF NOT EXISTS challenge3_title VARCHAR(255) DEFAULT 'Fear of Choosing Wrong Specialization',
ADD COLUMN IF NOT EXISTS challenge3_description TEXT,
ADD COLUMN IF NOT EXISTS challenge4_title VARCHAR(255) DEFAULT 'Unclear Career Translation',
ADD COLUMN IF NOT EXISTS challenge4_description TEXT,

-- Solution Process Section
ADD COLUMN IF NOT EXISTS process_title VARCHAR(255) DEFAULT 'Our 5-Step Career Orientation Process',
ADD COLUMN IF NOT EXISTS process_step1_title VARCHAR(255) DEFAULT 'Submit Application',
ADD COLUMN IF NOT EXISTS process_step1_description TEXT,
ADD COLUMN IF NOT EXISTS process_step2_title VARCHAR(255) DEFAULT 'Discovery Call',
ADD COLUMN IF NOT EXISTS process_step2_description TEXT,
ADD COLUMN IF NOT EXISTS process_step3_title VARCHAR(255) DEFAULT 'Skills Assessment',
ADD COLUMN IF NOT EXISTS process_step3_description TEXT,
ADD COLUMN IF NOT EXISTS process_step4_title VARCHAR(255) DEFAULT 'Career Roadmap',
ADD COLUMN IF NOT EXISTS process_step4_description TEXT,
ADD COLUMN IF NOT EXISTS process_step5_title VARCHAR(255) DEFAULT 'Implementation Support',
ADD COLUMN IF NOT EXISTS process_step5_description TEXT,

-- Expert Profile Section
ADD COLUMN IF NOT EXISTS expert_name VARCHAR(255) DEFAULT 'Sarah Chen',
ADD COLUMN IF NOT EXISTS expert_title VARCHAR(255) DEFAULT 'AI Career Guidance Specialist',
ADD COLUMN IF NOT EXISTS expert_background VARCHAR(255) DEFAULT 'Former Google ML Engineer',
ADD COLUMN IF NOT EXISTS expert_description TEXT,
ADD COLUMN IF NOT EXISTS expert_achievements TEXT,

-- Partner Companies Section
ADD COLUMN IF NOT EXISTS partners_title VARCHAR(255) DEFAULT 'Our Partner Companies',
ADD COLUMN IF NOT EXISTS partner_companies JSONB DEFAULT '["Google", "Microsoft", "Meta", "Amazon", "Apple", "OpenAI", "Tesla", "Stripe"]'::jsonb;

-- Add all missing columns to career_center_pages
ALTER TABLE career_center_pages 
ADD COLUMN IF NOT EXISTS hero_stat1_number VARCHAR(20) DEFAULT '92%',
ADD COLUMN IF NOT EXISTS hero_stat1_label VARCHAR(100) DEFAULT 'Job Placement Rate',
ADD COLUMN IF NOT EXISTS hero_stat2_number VARCHAR(20) DEFAULT '$85K',
ADD COLUMN IF NOT EXISTS hero_stat2_label VARCHAR(100) DEFAULT 'Average Starting Salary',
ADD COLUMN IF NOT EXISTS hero_stat3_number VARCHAR(20) DEFAULT '3.2x',
ADD COLUMN IF NOT EXISTS hero_stat3_label VARCHAR(100) DEFAULT 'Salary Increase',

-- Core Services Section
ADD COLUMN IF NOT EXISTS services_title VARCHAR(255) DEFAULT 'Our Career Services',
ADD COLUMN IF NOT EXISTS service1_title VARCHAR(255) DEFAULT 'Career Consultation',
ADD COLUMN IF NOT EXISTS service1_description TEXT,
ADD COLUMN IF NOT EXISTS service2_title VARCHAR(255) DEFAULT 'Resume & Portfolio Analysis',
ADD COLUMN IF NOT EXISTS service2_description TEXT,
ADD COLUMN IF NOT EXISTS service3_title VARCHAR(255) DEFAULT 'Job Placement Assistance',
ADD COLUMN IF NOT EXISTS service3_description TEXT,

-- Why Choose AI Studio Section
ADD COLUMN IF NOT EXISTS advantages_title VARCHAR(255) DEFAULT 'Why Choose AI Studio',
ADD COLUMN IF NOT EXISTS advantage1_title VARCHAR(255) DEFAULT 'AI-Optimized Resume Creation',
ADD COLUMN IF NOT EXISTS advantage1_description TEXT,
ADD COLUMN IF NOT EXISTS advantage2_title VARCHAR(255) DEFAULT 'Compelling Cover Letters',
ADD COLUMN IF NOT EXISTS advantage2_description TEXT,
ADD COLUMN IF NOT EXISTS advantage3_title VARCHAR(255) DEFAULT 'LinkedIn Profile Optimization',
ADD COLUMN IF NOT EXISTS advantage3_description TEXT,
ADD COLUMN IF NOT EXISTS advantage4_title VARCHAR(255) DEFAULT 'Strategic Job Search',
ADD COLUMN IF NOT EXISTS advantage4_description TEXT,
ADD COLUMN IF NOT EXISTS advantage5_title VARCHAR(255) DEFAULT 'Interview Preparation',
ADD COLUMN IF NOT EXISTS advantage5_description TEXT,
ADD COLUMN IF NOT EXISTS advantage6_title VARCHAR(255) DEFAULT 'Soft Skills Development',
ADD COLUMN IF NOT EXISTS advantage6_description TEXT,

-- Job Search Package Section
ADD COLUMN IF NOT EXISTS package_title VARCHAR(255) DEFAULT 'Job Search Success Package',
ADD COLUMN IF NOT EXISTS package_price VARCHAR(50) DEFAULT '$497',
ADD COLUMN IF NOT EXISTS package_description TEXT,
ADD COLUMN IF NOT EXISTS package_benefits JSONB DEFAULT '[]'::jsonb,

-- Career Development Resources Section
ADD COLUMN IF NOT EXISTS resources_title VARCHAR(255) DEFAULT 'Career Development Resources',
ADD COLUMN IF NOT EXISTS resources JSONB DEFAULT '[]'::jsonb,

-- Success Metrics
ADD COLUMN IF NOT EXISTS metrics_title VARCHAR(255) DEFAULT 'Our Success Metrics',
ADD COLUMN IF NOT EXISTS metric1_number VARCHAR(20) DEFAULT '92%',
ADD COLUMN IF NOT EXISTS metric1_label VARCHAR(100) DEFAULT 'Job Placement Rate',
ADD COLUMN IF NOT EXISTS metric2_number VARCHAR(20) DEFAULT '150+',
ADD COLUMN IF NOT EXISTS metric2_label VARCHAR(100) DEFAULT 'Partner Companies',
ADD COLUMN IF NOT EXISTS metric3_number VARCHAR(20) DEFAULT '$85K',
ADD COLUMN IF NOT EXISTS metric3_label VARCHAR(100) DEFAULT 'Average Salary',
ADD COLUMN IF NOT EXISTS metric4_number VARCHAR(20) DEFAULT '3.2x',
ADD COLUMN IF NOT EXISTS metric4_label VARCHAR(100) DEFAULT 'Salary Increase Multiplier';

-- Create career_paths table for career orientation specializations
CREATE TABLE IF NOT EXISTS career_paths (
    id SERIAL PRIMARY KEY,
    locale VARCHAR(5) DEFAULT 'en',
    career_orientation_page_id INTEGER REFERENCES career_orientation_pages(id),
    title VARCHAR(255) NOT NULL,
    average_salary VARCHAR(50),
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create testimonials table for career center
CREATE TABLE IF NOT EXISTS career_testimonials (
    id SERIAL PRIMARY KEY,
    locale VARCHAR(5) DEFAULT 'en',
    career_center_page_id INTEGER REFERENCES career_center_pages(id),
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255),
    company VARCHAR(255),
    testimonial TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default career paths for English
INSERT INTO career_paths (locale, title, average_salary, description) VALUES
('en', 'Machine Learning Engineer', '$130,000/year', 'Design and implement ML algorithms and systems'),
('en', 'Data Scientist', '$120,000/year', 'Analyze complex data to drive business decisions'),
('en', 'AI Research Scientist', '$150,000/year', 'Conduct cutting-edge research in artificial intelligence'),
('en', 'Computer Vision Specialist', '$135,000/year', 'Develop systems that can interpret and understand visual information'),
('en', 'NLP Engineer', '$125,000/year', 'Build systems that understand and process human language'),
('en', 'MLOps Engineer', '$140,000/year', 'Manage ML model deployment and infrastructure'),
('en', 'AI Product Manager', '$145,000/year', 'Lead AI product strategy and development'),
('en', 'Robotics Engineer', '$110,000/year', 'Design and develop robotic systems and applications')
ON CONFLICT DO NOTHING;

-- Insert Russian career paths
INSERT INTO career_paths (locale, title, average_salary, description) VALUES
('ru', 'Инженер машинного обучения', '$130,000/год', 'Разработка и внедрение алгоритмов и систем машинного обучения'),
('ru', 'Специалист по данным', '$120,000/год', 'Анализ сложных данных для принятия бизнес-решений'),
('ru', 'Исследователь ИИ', '$150,000/год', 'Проведение передовых исследований в области искусственного интеллекта'),
('ru', 'Специалист по компьютерному зрению', '$135,000/год', 'Разработка систем интерпретации визуальной информации'),
('ru', 'Инженер НЛП', '$125,000/год', 'Создание систем понимания и обработки человеческого языка'),
('ru', 'Инженер MLOps', '$140,000/год', 'Управление развертыванием моделей машинного обучения и инфраструктурой'),
('ru', 'Продакт-менеджер ИИ', '$145,000/год', 'Руководство стратегией и разработкой продуктов ИИ'),
('ru', 'Инженер-робототехник', '$110,000/год', 'Проектирование и разработка робототехнических систем')
ON CONFLICT DO NOTHING;

-- Insert Hebrew career paths
INSERT INTO career_paths (locale, title, average_salary, description) VALUES
('he', 'מהנדס למידת מכונה', '$130,000/שנה', 'עיצוב ויישום של אלגוריתמי למידת מכונה ומערכות'),
('he', 'מדען נתונים', '$120,000/שנה', 'ניתוח נתונים מורכבים לקבלת החלטות עסקיות'),
('he', 'חוקר בינה מלאכותית', '$150,000/שנה', 'מחקר חדשני בתחום הבינה המלאכותית'),
('he', 'מומחה ראייה ממוחשבת', '$135,000/שנה', 'פיתוח מערכות הבנה ופירוש מידע ויזואלי'),
('he', 'מהנדס עיבוד שפה טבעית', '$125,000/שנה', 'בניית מערכות להבנה ועיבוד שפה אנושית'),
('he', 'מהנדס MLOps', '$140,000/שנה', 'ניהול פריסת מודלים של למידת מכונה ותשתיות'),
('he', 'מנהל מוצר AI', '$145,000/שנה', 'הובלת אסטרטגיה ופיתוח מוצרי בינה מלאכותית'),
('he', 'מהנדס רובוטיקה', '$110,000/שנה', 'עיצוב ופיתוח מערכות רובוטיות ויישומים')
ON CONFLICT DO NOTHING;

-- Insert default testimonials for English
INSERT INTO career_testimonials (locale, name, role, company, testimonial) VALUES
('en', 'Alex Johnson', 'ML Engineer', 'Google', 'AI Studio helped me transition from software engineering to machine learning. The personalized guidance was invaluable.'),
('en', 'Sarah Kim', 'Data Scientist', 'Meta', 'The career roadmap they provided was exactly what I needed to break into data science at a top tech company.'),
('en', 'David Chen', 'AI Research Scientist', 'OpenAI', 'Their expert guidance helped me land my dream role in AI research. Highly recommended for anyone serious about AI careers.'),
('en', 'Maria Rodriguez', 'Computer Vision Engineer', 'Tesla', 'The interview preparation and technical guidance were spot-on. I got multiple offers after working with AI Studio.'),
('en', 'James Wilson', 'NLP Engineer', 'Microsoft', 'They helped me identify the right specialization and provided a clear path to get there. Worth every penny.'),
('en', 'Lisa Zhang', 'MLOps Engineer', 'Amazon', 'The hands-on approach and industry insights made all the difference in my career transition.')
ON CONFLICT DO NOTHING;

-- Update existing English records with comprehensive content
UPDATE career_orientation_pages SET
    hero_stat1_number = '500+',
    hero_stat1_label = 'Career Paths Mapped',
    hero_stat2_number = '15+',
    hero_stat2_label = 'AI Specializations',
    hero_stat3_number = '95%',
    hero_stat3_label = 'Success Rate',
    challenges_title = 'Common Career Challenges in AI/ML',
    challenge1_title = 'Overwhelmed by AI/ML Career Options',
    challenge1_description = 'With dozens of AI specializations emerging, it''s easy to feel lost about which path aligns with your skills and interests.',
    challenge2_title = 'Uncertain About Required Skills',
    challenge2_description = 'AI roles have rapidly evolving skill requirements, making it difficult to know what to learn and in what order.',
    challenge3_title = 'Fear of Choosing Wrong Specialization',
    challenge3_description = 'The pressure to pick the "perfect" AI career path can be paralyzing, especially with limited industry exposure.',
    challenge4_title = 'Unclear Career Translation',
    challenge4_description = 'Professionals struggle to understand how their existing skills translate to AI roles and what gaps need filling.',
    process_title = 'Our 5-Step Career Orientation Process',
    process_step1_title = 'Submit Application',
    process_step1_description = 'Complete our comprehensive career assessment to understand your background, goals, and preferences.',
    process_step2_title = 'Discovery Call',
    process_step2_description = 'Meet with our AI career specialist to discuss your aspirations and current situation.',
    process_step3_title = 'Skills Assessment',
    process_step3_description = 'Evaluate your technical abilities and identify strengths that align with AI career paths.',
    process_step4_title = 'Career Roadmap',
    process_step4_description = 'Receive a personalized roadmap with specific steps, timelines, and resources.',
    process_step5_title = 'Implementation Support',
    process_step5_description = 'Get ongoing guidance and support as you execute your career transition plan.',
    expert_name = 'Sarah Chen',
    expert_title = 'AI Career Guidance Specialist',
    expert_background = 'Former Google ML Engineer',
    expert_description = 'With 8+ years in AI/ML roles at top tech companies, Sarah specializes in helping professionals navigate successful career transitions into artificial intelligence.',
    expert_achievements = 'Led ML teams at Google, published 15+ AI research papers, guided 500+ career transitions',
    partners_title = 'Our Partner Companies'
WHERE locale = 'en';

-- Update existing English career center records
UPDATE career_center_pages SET
    hero_stat1_number = '92%',
    hero_stat1_label = 'Job Placement Rate',
    hero_stat2_number = '$85K',
    hero_stat2_label = 'Average Starting Salary',
    hero_stat3_number = '3.2x',
    hero_stat3_label = 'Salary Increase',
    services_title = 'Our Career Services',
    service1_title = 'Career Consultation',
    service1_description = 'One-on-one sessions with AI career experts to identify your ideal career path and create a personalized action plan.',
    service2_title = 'Resume & Portfolio Analysis',
    service2_description = 'Professional review and optimization of your resume and portfolio to stand out to AI/ML hiring managers.',
    service3_title = 'Job Placement Assistance',
    service3_description = 'Direct connections with our partner companies and exclusive access to hidden job opportunities in AI.',
    advantages_title = 'Why Choose AI Studio Career Center',
    advantage1_title = 'AI-Optimized Resume Creation',
    advantage1_description = 'Resumes tailored specifically for AI/ML roles with industry-specific keywords and formatting.',
    advantage2_title = 'Compelling Cover Letters',
    advantage2_description = 'Personalized cover letters that highlight your unique value proposition for AI positions.',
    advantage3_title = 'LinkedIn Profile Optimization',
    advantage3_description = 'Professional LinkedIn profiles that attract recruiters and showcase your AI expertise.',
    advantage4_title = 'Strategic Job Search',
    advantage4_description = 'Targeted approach to finding and applying for AI roles that match your skills and goals.',
    advantage5_title = 'Interview Preparation',
    advantage5_description = 'Comprehensive preparation for technical and behavioral interviews at top AI companies.',
    advantage6_title = 'Soft Skills Development',
    advantage6_description = 'Communication, leadership, and collaboration skills essential for AI leadership roles.',
    package_title = 'Job Search Success Package',
    package_price = '$497',
    package_description = 'Everything you need to land your dream AI job, including personalized consultation, resume optimization, and interview prep.',
    resources_title = 'Career Development Resources',
    metrics_title = 'Our Success Metrics'
WHERE locale = 'en';

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_career_paths_locale ON career_paths(locale);
CREATE INDEX IF NOT EXISTS idx_career_paths_page_id ON career_paths(career_orientation_page_id);
CREATE INDEX IF NOT EXISTS idx_career_testimonials_locale ON career_testimonials(locale);
CREATE INDEX IF NOT EXISTS idx_career_testimonials_page_id ON career_testimonials(career_center_page_id);

-- Verification queries
SELECT 'Career Orientation Pages' as table_name, locale, COUNT(*) as count FROM career_orientation_pages GROUP BY locale;
SELECT 'Career Center Pages' as table_name, locale, COUNT(*) as count FROM career_center_pages GROUP BY locale;
SELECT 'Career Paths' as table_name, locale, COUNT(*) as count FROM career_paths GROUP BY locale;
SELECT 'Career Testimonials' as table_name, locale, COUNT(*) as count FROM career_testimonials GROUP BY locale;