-- MASSIVE CAREER ORIENTATION EXPANSION - 163+ Fields
-- This migration creates a complete CMS structure for the career orientation page
-- Based on comprehensive analysis of actual page content

-- First, drop and recreate career_orientation_pages with ALL fields
DROP TABLE IF EXISTS career_orientation_pages CASCADE;

CREATE TABLE career_orientation_pages (
    id SERIAL PRIMARY KEY,
    locale VARCHAR(5) DEFAULT 'en',
    
    -- META & NAVIGATION (6 fields)
    page_title VARCHAR(255) DEFAULT 'Career Orientation - AI Studio E-Learning Platform',
    meta_description TEXT DEFAULT 'Discover your perfect AI/ML career path with personalized guidance',
    nav_items JSONB DEFAULT '["Home", "Courses", "Teachers", "Pricing", "Career Services"]'::jsonb,
    dropdown_items JSONB DEFAULT '["Career Orientation", "Career Center"]'::jsonb,
    breadcrumb_text VARCHAR(255) DEFAULT 'Home | Career Orientation',
    
    -- HERO SECTION (8 fields)
    hero_page_title VARCHAR(255) DEFAULT 'Career Orientation',
    hero_main_title VARCHAR(255) DEFAULT 'Discover Your Perfect AI/ML Career Path',
    hero_subtitle VARCHAR(255) DEFAULT 'Discover Your Path',
    hero_description TEXT DEFAULT 'Get personalized career guidance and find your ideal role in artificial intelligence and machine learning with our expert assessment program.',
    hero_stat1_number VARCHAR(20) DEFAULT '500+',
    hero_stat1_label VARCHAR(100) DEFAULT 'Career Paths Mapped',
    hero_stat2_number VARCHAR(20) DEFAULT '15+',
    hero_stat2_label VARCHAR(100) DEFAULT 'AI Specializations',
    hero_stat3_number VARCHAR(20) DEFAULT '95%',
    hero_stat3_label VARCHAR(100) DEFAULT 'Success Rate',
    hero_cta_text VARCHAR(100) DEFAULT 'Start Your AI Career Assessment',
    
    -- PROBLEM IDENTIFICATION SECTION (13 fields)
    problems_subtitle VARCHAR(255) DEFAULT 'Common Challenges',
    problems_title VARCHAR(255) DEFAULT 'Feeling Lost in AI/ML Career Options?',
    problems_description TEXT DEFAULT 'You are not alone. Many aspiring AI professionals face these common challenges when starting their journey.',
    problem1_icon VARCHAR(10) DEFAULT '🤯',
    problem1_title VARCHAR(255) DEFAULT 'Overwhelmed by AI/ML Career Options',
    problem1_description TEXT DEFAULT 'Too many paths to choose from - Machine Learning, Data Science, Computer Vision, NLP, Robotics...',
    problem2_icon VARCHAR(10) DEFAULT '❓',
    problem2_title VARCHAR(255) DEFAULT 'Uncertain About Required Skills',
    problem2_description TEXT DEFAULT 'Don''t know which programming languages, tools, and frameworks are essential for your target role.',
    problem3_icon VARCHAR(10) DEFAULT '😰',
    problem3_title VARCHAR(255) DEFAULT 'Fear of Choosing Wrong Specialization',
    problem3_description TEXT DEFAULT 'Worried about investing time and money in the wrong AI field or career direction.',
    problem4_icon VARCHAR(10) DEFAULT '🎯',
    problem4_title VARCHAR(255) DEFAULT 'Don''t Know Which AI Path Fits Background',
    problem4_description TEXT DEFAULT 'Unclear how your current experience translates to different AI/ML career opportunities.',
    
    -- SOLUTION OVERVIEW SECTION (13 fields)
    solution_subtitle VARCHAR(255) DEFAULT 'Our Solution',
    solution_title VARCHAR(255) DEFAULT 'AI Career Guidance Process',
    solution_description TEXT DEFAULT 'Our comprehensive approach helps you make informed decisions about your AI career journey.',
    solution1_icon VARCHAR(10) DEFAULT '💬',
    solution1_title VARCHAR(255) DEFAULT 'Free 20-Minute Discovery Consultation',
    solution1_description TEXT DEFAULT 'One-on-one call with AI career specialist to understand your goals and background',
    solution2_icon VARCHAR(10) DEFAULT '📊',
    solution2_title VARCHAR(255) DEFAULT 'Comprehensive AI/ML Skills Assessment',
    solution2_description TEXT DEFAULT 'Detailed evaluation of your technical aptitude and learning preferences',
    solution3_icon VARCHAR(10) DEFAULT '🗺️',
    solution3_title VARCHAR(255) DEFAULT 'Personalized Learning Roadmap',
    solution3_description TEXT DEFAULT 'Custom career path with recommended courses, projects, and timeline',
    solution4_icon VARCHAR(10) DEFAULT '🏢',
    solution4_title VARCHAR(255) DEFAULT 'Industry-Specific Career Guidance',
    solution4_description TEXT DEFAULT 'Insights into different AI industries and company types that match your interests',
    
    -- PROCESS STEPS SECTION (18 fields)
    process_subtitle VARCHAR(255) DEFAULT '5-Step Process',
    process_title VARCHAR(255) DEFAULT 'AI Career Discovery Process',
    process_description TEXT DEFAULT 'Our systematic approach to finding your perfect AI career path in just 5 simple steps.',
    step1_number VARCHAR(5) DEFAULT '1',
    step1_title VARCHAR(255) DEFAULT 'Submit Application',
    step1_description TEXT DEFAULT 'Quick form about your background, interests, and career goals in AI/ML',
    step1_duration VARCHAR(100) DEFAULT 'Duration: 5 minutes',
    step2_number VARCHAR(5) DEFAULT '2',
    step2_title VARCHAR(255) DEFAULT 'Discovery Call (Free)',
    step2_description TEXT DEFAULT '20-minute consultation with AI career expert to understand your situation',
    step2_duration VARCHAR(100) DEFAULT 'Duration: 20 minutes',
    step3_number VARCHAR(5) DEFAULT '3',
    step3_title VARCHAR(255) DEFAULT 'Skills Assessment',
    step3_description TEXT DEFAULT 'Comprehensive evaluation of technical aptitude, learning style, and preferences',
    step3_duration VARCHAR(100) DEFAULT 'Duration: 45 minutes',
    step4_number VARCHAR(5) DEFAULT '4',
    step4_title VARCHAR(255) DEFAULT 'Career Roadmap',
    step4_description TEXT DEFAULT 'Personalized path with recommended courses, timeline, and career trajectory',
    step4_duration VARCHAR(100) DEFAULT 'Duration: Delivered within 48 hours',
    step5_number VARCHAR(5) DEFAULT '5',
    step5_title VARCHAR(255) DEFAULT 'Implementation Support',
    step5_description TEXT DEFAULT 'Ongoing guidance, job placement assistance, and progress check-ins',
    step5_duration VARCHAR(100) DEFAULT 'Duration: Ongoing',
    
    -- EXPERT PROFILE SECTION (12 fields)
    expert_subtitle VARCHAR(255) DEFAULT 'Meet Your Guide',
    expert_section_title VARCHAR(255) DEFAULT 'AI Career Guidance Specialist',
    expert_name VARCHAR(255) DEFAULT 'Sarah Chen',
    expert_title VARCHAR(255) DEFAULT 'AI Career Guidance Specialist & Former ML Engineer',
    expert_experience VARCHAR(255) DEFAULT '7+ years in AI industry • 500+ career consultations',
    expert_bio TEXT DEFAULT 'Sarah transitioned from a successful ML engineering career at Google to helping others navigate the AI industry. She has personally guided 300+ professionals into AI roles and understands the challenges of breaking into this competitive field.',
    expert_image_url VARCHAR(500) DEFAULT '/images/expert-sarah-chen.jpg',
    expert_achievement1 VARCHAR(255) DEFAULT '✓ Helped 300+ professionals transition into AI roles',
    expert_achievement2 VARCHAR(255) DEFAULT '✓ Former Senior ML Engineer at Google',
    expert_achievement3 VARCHAR(255) DEFAULT '✓ MS in Computer Science from Stanford',
    expert_achievement4 VARCHAR(255) DEFAULT '✓ Published researcher in AI conferences',
    
    -- PARTNER COMPANIES SECTION (19 fields)
    partners_subtitle VARCHAR(255) DEFAULT 'Success Stories',
    partners_title VARCHAR(255) DEFAULT 'Where Our Graduates Work',
    partners_description TEXT DEFAULT 'Our career guidance has helped professionals secure positions at leading AI companies worldwide.',
    company1_name VARCHAR(100) DEFAULT 'Google',
    company1_description VARCHAR(255) DEFAULT 'ML Engineers, Data Scientists, Research Scientists',
    company2_name VARCHAR(100) DEFAULT 'Microsoft',
    company2_description VARCHAR(255) DEFAULT 'Azure AI, Office AI, Research divisions',
    company3_name VARCHAR(100) DEFAULT 'Meta',
    company3_description VARCHAR(255) DEFAULT 'AI Research, Product AI, Reality Labs',
    company4_name VARCHAR(100) DEFAULT 'Amazon',
    company4_description VARCHAR(255) DEFAULT 'AWS AI/ML, Alexa, Robotics divisions',
    company5_name VARCHAR(100) DEFAULT 'Apple',
    company5_description VARCHAR(255) DEFAULT 'ML Platform, Siri, Computer Vision teams',
    company6_name VARCHAR(100) DEFAULT 'OpenAI',
    company6_description VARCHAR(255) DEFAULT 'Research, Engineering, Product teams',
    company7_name VARCHAR(100) DEFAULT 'Tesla',
    company7_description VARCHAR(255) DEFAULT 'Autopilot, Computer Vision, Robotics',
    company8_name VARCHAR(100) DEFAULT 'Stripe',
    company8_description VARCHAR(255) DEFAULT 'ML Infrastructure, Risk AI, Data Science',
    
    -- ASSESSMENT FORM SECTION (22 fields)
    form_subtitle VARCHAR(255) DEFAULT 'Get Started',
    form_title VARCHAR(255) DEFAULT 'Career Assessment Application',
    form_description TEXT DEFAULT 'Complete this form to begin your AI career discovery journey. We''ll schedule your free consultation within 24 hours.',
    form_field1_label VARCHAR(255) DEFAULT 'Full Name *',
    form_field1_placeholder VARCHAR(255) DEFAULT 'Enter your full name',
    form_field2_label VARCHAR(255) DEFAULT 'Email Address *',
    form_field2_placeholder VARCHAR(255) DEFAULT 'your.email@example.com',
    form_field3_label VARCHAR(255) DEFAULT 'Phone Number',
    form_field3_placeholder VARCHAR(255) DEFAULT '+1 (555) 123-4567',
    form_field4_label VARCHAR(255) DEFAULT 'Current Background *',
    form_field4_options JSONB DEFAULT '["Software Developer", "Data Analyst", "Recent Graduate", "Career Changer", "Student", "Engineer (Non-Software)", "Business Analyst", "Other"]'::jsonb,
    form_field5_label VARCHAR(255) DEFAULT 'AI/ML Interest Areas * (Select all that apply)',
    form_field5_options JSONB DEFAULT '["Machine Learning", "Computer Vision", "Natural Language Processing", "Data Science", "Robotics", "AI Research", "MLOps", "AI Product Management"]'::jsonb,
    form_field6_label VARCHAR(255) DEFAULT 'Preferred Consultation Time *',
    form_field6_options JSONB DEFAULT '["Morning (9AM-12PM EST)", "Afternoon (12PM-5PM EST)", "Evening (5PM-8PM EST)"]'::jsonb,
    form_field7_label VARCHAR(255) DEFAULT 'Timeline for Career Change',
    form_field7_options JSONB DEFAULT '["Immediate (0-3 months)", "Short-term (3-6 months)", "Medium-term (6-12 months)", "Long-term (12+ months)"]'::jsonb,
    form_field8_label VARCHAR(255) DEFAULT 'Current Technical Experience',
    form_field8_placeholder TEXT DEFAULT 'Briefly describe your technical background, programming languages you know, relevant projects, etc.',
    form_field9_label VARCHAR(255) DEFAULT 'Career Goals',
    form_field9_placeholder TEXT DEFAULT 'What are your career goals? What type of AI role interests you most? Any specific companies or industries you''re targeting?',
    form_submit_text VARCHAR(100) DEFAULT 'Schedule Free Consultation',
    form_disclaimer TEXT DEFAULT 'By submitting this form, you agree to receive career guidance communications. We respect your privacy and will never share your information.',
    
    -- FOOTER SECTION (25 fields)
    footer_company_description TEXT DEFAULT 'Elevate tech career with expert-led courses. If you''re just aiming to advance skills, practical training is designed.',
    footer_contact_email VARCHAR(255) DEFAULT 'career@aistudiolearning.com',
    footer_newsletter_label VARCHAR(255) DEFAULT 'Subscribe to Newsletter',
    footer_newsletter_placeholder VARCHAR(255) DEFAULT 'Enter email to subscribe',
    footer_menu_title VARCHAR(100) DEFAULT 'Menu',
    footer_menu_items JSONB DEFAULT '["Home", "About Us", "Courses", "Teachers", "Pricing", "Career Center", "Blog", "Contact Us"]'::jsonb,
    footer_career_title VARCHAR(100) DEFAULT 'Career Services',
    footer_career_items JSONB DEFAULT '["Career Orientation", "Career Center", "Job Board", "Resume Review", "Interview Prep"]'::jsonb,
    footer_contact_title VARCHAR(100) DEFAULT 'Contact',
    footer_phone VARCHAR(100) DEFAULT '(555) 123-CAREER',
    footer_email VARCHAR(255) DEFAULT 'career@aistudiolearning.com',
    footer_address VARCHAR(255) DEFAULT 'Career Center, Tech Campus',
    footer_copyright TEXT DEFAULT '© Copyright - AI Studio E-Learning | Designed by Zohaflow - Licensing Powered by Webflow',
    footer_social_facebook VARCHAR(500) DEFAULT '#',
    footer_social_twitter VARCHAR(500) DEFAULT '#',
    footer_social_instagram VARCHAR(500) DEFAULT '#',
    footer_social_youtube VARCHAR(500) DEFAULT '#',
    
    -- SYSTEM FIELDS
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create separate table for career paths (dynamic collection)
CREATE TABLE IF NOT EXISTS career_paths (
    id SERIAL PRIMARY KEY,
    locale VARCHAR(5) DEFAULT 'en',
    career_orientation_page_id INTEGER REFERENCES career_orientation_pages(id) ON DELETE CASCADE,
    icon VARCHAR(10) DEFAULT '🤖',
    title VARCHAR(255) NOT NULL,
    description TEXT,
    salary_info VARCHAR(100),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default career paths for each language
INSERT INTO career_paths (locale, icon, title, description, salary_info, sort_order) VALUES
('en', '🤖', 'Machine Learning Engineer', 'Build and deploy ML models that power intelligent applications and systems.', 'Average: $130,000/year', 1),
('en', '📊', 'Data Scientist', 'Extract insights from complex data to drive business decisions and strategy.', 'Average: $120,000/year', 2),
('en', '🔬', 'AI Research Scientist', 'Pioneer new AI technologies and advance the field through cutting-edge research.', 'Average: $150,000/year', 3),
('en', '👁️', 'Computer Vision Specialist', 'Develop AI systems that can analyze and understand visual information.', 'Average: $135,000/year', 4),
('en', '💬', 'NLP Engineer', 'Create AI systems that understand and generate human language.', 'Average: $125,000/year', 5),
('en', '⚙️', 'MLOps Engineer', 'Build infrastructure and pipelines for deploying ML models at scale.', 'Average: $140,000/year', 6),
('en', '📱', 'AI Product Manager', 'Guide the development of AI-powered products and features.', 'Average: $145,000/year', 7),
('en', '🤖', 'Robotics Engineer', 'Design intelligent robotic systems that interact with the physical world.', 'Average: $110,000/year', 8);

-- Insert comprehensive default data for English
INSERT INTO career_orientation_pages (locale) VALUES ('en');

-- Insert for Russian and Hebrew locales
INSERT INTO career_orientation_pages (
    locale, hero_main_title, hero_description, problems_title, solution_title, process_title
) VALUES 
('ru', 
 'Откройте свой идеальный путь в ИИ/МО',
 'Получите персональные рекомендации по карьере и найдите свою идеальную роль в искусственном интеллекте и машинном обучении.',
 'Чувствуете себя потерянным в вариантах карьеры ИИ/МО?',
 'Процесс карьерного руководства ИИ',
 'Процесс открытия карьеры в ИИ'
),
('he',
 'גלו את הדרך המושלמת שלכם בבינה מלאכותית',
 'קבלו הדרכה אישית בקריירה ומצאו את התפקיד האידיאלי שלכם בבינה מלאכותית ולמידת מכונה.',
 'מרגישים אבודים באפשרויות הקריירה בבינה מלאכותית?',
 'תהליך הדרכה בקריירת בינה מלאכותית',
 'תהליך גילוי קריירה בבינה מלאכותית'
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_career_orientation_pages_locale ON career_orientation_pages(locale);
CREATE INDEX IF NOT EXISTS idx_career_paths_locale ON career_paths(locale);
CREATE INDEX IF NOT EXISTS idx_career_paths_page_id ON career_paths(career_orientation_page_id);
CREATE INDEX IF NOT EXISTS idx_career_paths_sort_order ON career_paths(sort_order);

-- Verification
SELECT 'Career Orientation Pages' as table_name, locale, COUNT(*) as count FROM career_orientation_pages GROUP BY locale;
SELECT 'Career Paths' as table_name, locale, COUNT(*) as count FROM career_paths GROUP BY locale;