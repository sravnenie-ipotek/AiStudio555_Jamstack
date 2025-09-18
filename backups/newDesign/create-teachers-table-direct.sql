-- Create teachers table directly for testing
CREATE TABLE IF NOT EXISTS entity_teachers (
    id SERIAL PRIMARY KEY,
    teacher_key VARCHAR(100) UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    professional_title VARCHAR(255),
    company VARCHAR(255),
    bio TEXT,
    profile_image_url TEXT,
    skills JSONB,
    experience_history JSONB,
    courses_taught JSONB,
    student_reviews JSONB,
    statistics JSONB,
    contact_info JSONB,
    social_links JSONB,
    is_featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample teachers data
INSERT INTO entity_teachers (
    teacher_key, full_name, professional_title, company, bio, profile_image_url,
    skills, experience_history, courses_taught, student_reviews, statistics,
    contact_info, social_links, is_featured, display_order, is_active
) VALUES
(
    'sarah-chen',
    'Sarah Chen',
    'AI & Machine Learning Expert',
    'TechEd Solutions',
    'Co-founder & AI Lead at TechEd Solutions with 8+ years of commercial AI development experience. Expert in teaching complex machine learning concepts through practical, hands-on projects.',
    'images/CTA-Section-Bg.jpg',
    '["Machine Learning", "Deep Learning", "Python", "TensorFlow", "AI Ethics", "Data Science"]'::jsonb,
    '[
        {
            "title": "AI Lead",
            "company": "TechEd Solutions",
            "duration": "2020 - Present",
            "description": "Leading AI development team and educational initiatives"
        },
        {
            "title": "Senior ML Engineer",
            "company": "DataCorp Inc",
            "duration": "2018 - 2020",
            "description": "Developed machine learning models for production systems"
        }
    ]'::jsonb,
    '[
        {
            "title": "Complete Machine Learning Course",
            "description": "Comprehensive ML course covering theory and practice",
            "students": 350,
            "rating": 4.8
        },
        {
            "title": "Deep Learning Fundamentals",
            "description": "Introduction to neural networks and deep learning",
            "students": 220,
            "rating": 4.9
        }
    ]'::jsonb,
    '[
        {
            "author": "Alex M.",
            "text": "Sarah''s teaching style is exceptional. Complex concepts become easy to understand.",
            "stars": "★★★★★"
        },
        {
            "author": "Maria K.",
            "text": "Best AI instructor I''ve ever had. Practical examples are incredibly valuable.",
            "stars": "★★★★★"
        }
    ]'::jsonb,
    '{
        "years_experience": 8,
        "students_taught": 570,
        "courses_count": 12,
        "rating": 4.8
    }'::jsonb,
    '{
        "email": "sarah@teched.solutions",
        "phone": "+1-555-0123"
    }'::jsonb,
    '{
        "linkedin": "https://linkedin.com/in/sarah-chen-ai",
        "twitter": "https://twitter.com/sarahchen_ai",
        "github": "https://github.com/sarahchen"
    }'::jsonb,
    true, 1, true
),
(
    'mike-johnson',
    'Mike Johnson',
    'Full-Stack Development Expert',
    'WebCraft Studios',
    'Frontend Lead at WebCraft Studios with 10+ years of commercial development experience. Specializes in teaching modern JavaScript, React, and full-stack development.',
    'images/Course-Categories-Content-Bg.jpg',
    '["JavaScript", "React", "Node.js", "TypeScript", "Full-Stack Development", "Web Performance"]'::jsonb,
    '[
        {
            "title": "Frontend Lead",
            "company": "WebCraft Studios",
            "duration": "2019 - Present",
            "description": "Leading frontend development team and mentoring junior developers"
        },
        {
            "title": "Senior Frontend Developer",
            "company": "Digital Agency Pro",
            "duration": "2016 - 2019",
            "description": "Built complex web applications using modern JavaScript frameworks"
        }
    ]'::jsonb,
    '[
        {
            "title": "Modern JavaScript Mastery",
            "description": "Complete guide to ES6+ and modern JavaScript development",
            "students": 420,
            "rating": 4.7
        },
        {
            "title": "React Development Bootcamp",
            "description": "Build real-world applications with React and Redux",
            "students": 380,
            "rating": 4.9
        }
    ]'::jsonb,
    '[
        {
            "author": "John D.",
            "text": "Mike''s practical approach to teaching React is outstanding. Real projects make all the difference.",
            "stars": "★★★★★"
        },
        {
            "author": "Lisa P.",
            "text": "Finally understood JavaScript thanks to Mike''s clear explanations.",
            "stars": "★★★★☆"
        }
    ]'::jsonb,
    '{
        "years_experience": 10,
        "students_taught": 800,
        "courses_count": 15,
        "rating": 4.8
    }'::jsonb,
    '{
        "email": "mike@webcraft.studios",
        "phone": "+1-555-0124"
    }'::jsonb,
    '{
        "linkedin": "https://linkedin.com/in/mike-johnson-dev",
        "twitter": "https://twitter.com/mikejohnson_dev",
        "github": "https://github.com/mikejohnson"
    }'::jsonb,
    true, 2, true
),
(
    'emily-rodriguez',
    'Emily Rodriguez',
    'Career Transition Coach',
    'CareerPath Pro',
    'Software Engineer & Career Mentor with 7+ years of commercial development experience. Expert in guiding career changers through structured learning paths.',
    'images/About-Me-Image.jpg',
    '["Career Coaching", "Software Development", "Mentoring", "Project Management", "Technical Leadership"]'::jsonb,
    '[
        {
            "title": "Senior Career Coach",
            "company": "CareerPath Pro",
            "duration": "2021 - Present",
            "description": "Helping professionals transition into tech careers"
        },
        {
            "title": "Software Engineer",
            "company": "TechStart Inc",
            "duration": "2017 - 2021",
            "description": "Full-stack development and team leadership"
        }
    ]'::jsonb,
    '[
        {
            "title": "Career Change Bootcamp",
            "description": "Complete guide to transitioning into tech careers",
            "students": 250,
            "rating": 4.9
        },
        {
            "title": "Professional Development Workshop",
            "description": "Skills and strategies for career advancement",
            "students": 180,
            "rating": 4.8
        }
    ]'::jsonb,
    '[
        {
            "author": "David R.",
            "text": "Emily helped me successfully transition from marketing to software development. Incredible mentor!",
            "stars": "★★★★★"
        },
        {
            "author": "Rachel T.",
            "text": "The career guidance and practical advice were exactly what I needed.",
            "stars": "★★★★★"
        }
    ]'::jsonb,
    '{
        "years_experience": 7,
        "students_taught": 430,
        "courses_count": 8,
        "rating": 4.85
    }'::jsonb,
    '{
        "email": "emily@careerpath.pro",
        "phone": "+1-555-0125"
    }'::jsonb,
    '{
        "linkedin": "https://linkedin.com/in/emily-rodriguez-coach",
        "twitter": "https://twitter.com/emily_career_coach"
    }'::jsonb,
    true, 3, true
),
(
    'david-park',
    'David Park',
    'Data Science Instructor',
    'DataLearn Academy',
    'Senior Data Scientist & Educator with 9+ years of commercial analytics experience. Passionate about teaching data science fundamentals through interactive workshops.',
    'images/About-Us-Image.png',
    '["Data Science", "Python", "R", "Machine Learning", "Statistics", "Data Visualization", "SQL"]'::jsonb,
    '[
        {
            "title": "Senior Data Scientist",
            "company": "DataLearn Academy",
            "duration": "2020 - Present",
            "description": "Leading data science education and curriculum development"
        },
        {
            "title": "Data Analyst",
            "company": "Analytics Pro",
            "duration": "2015 - 2020",
            "description": "Business analytics and data-driven decision making"
        }
    ]'::jsonb,
    '[
        {
            "title": "Data Science Fundamentals",
            "description": "Complete introduction to data science with Python",
            "students": 320,
            "rating": 4.7
        },
        {
            "title": "Advanced Analytics Workshop",
            "description": "Advanced statistical analysis and machine learning",
            "students": 180,
            "rating": 4.8
        }
    ]'::jsonb,
    '[
        {
            "author": "Sarah L.",
            "text": "David makes data science accessible and fun. Great real-world examples!",
            "stars": "★★★★☆"
        },
        {
            "author": "Tom W.",
            "text": "Excellent instructor with deep knowledge and practical experience.",
            "stars": "★★★★★"
        }
    ]'::jsonb,
    '{
        "years_experience": 9,
        "students_taught": 500,
        "courses_count": 10,
        "rating": 4.75
    }'::jsonb,
    '{
        "email": "david@datalearn.academy",
        "phone": "+1-555-0126"
    }'::jsonb,
    '{
        "linkedin": "https://linkedin.com/in/david-park-data",
        "github": "https://github.com/davidpark"
    }'::jsonb,
    true, 4, true
);