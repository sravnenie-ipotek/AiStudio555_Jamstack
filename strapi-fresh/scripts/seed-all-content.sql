
-- Seed All Content Types
-- Generated: 2025-09-08T09:42:27.694Z

-- Courses
INSERT INTO courses (title, description, price, duration, lessons, category, level, rating, visible, featured, curriculum, created_at, updated_at, published_at)
VALUES ('Complete React Development', 'Master React.js from basics to advanced concepts including Redux, Hooks, and Next.js', 199, '12 Weeks', 48, 'Web Development', 'intermediate', 4.9, 1, 1, '[{"title":"Introduction to React","duration":"45 min"},{"title":"JSX and Components","duration":"60 min"},{"title":"State and Props","duration":"90 min"},{"title":"React Hooks","duration":"120 min"},{"title":"Redux Fundamentals","duration":"90 min"}]', datetime('now'), datetime('now'), datetime('now'));

INSERT INTO courses (title, description, price, duration, lessons, category, level, rating, visible, featured, curriculum, created_at, updated_at, published_at)
VALUES ('Python for Data Science', 'Learn Python programming with focus on data analysis, machine learning, and AI', 249, '10 Weeks', 40, 'Data Science', 'beginner', 4.8, 1, 1, '[]', datetime('now'), datetime('now'), datetime('now'));

INSERT INTO courses (title, description, price, duration, lessons, category, level, rating, visible, featured, curriculum, created_at, updated_at, published_at)
VALUES ('Full Stack JavaScript', 'Become a full stack developer with Node.js, Express, MongoDB, and React', 299, '16 Weeks', 64, 'Web Development', 'advanced', 4.95, 1, 1, '[]', datetime('now'), datetime('now'), datetime('now'));

INSERT INTO courses (title, description, price, duration, lessons, category, level, rating, visible, featured, curriculum, created_at, updated_at, published_at)
VALUES ('UI/UX Design Masterclass', 'Learn modern design principles, Figma, and user experience best practices', 179, '8 Weeks', 32, 'Design', 'beginner', 4.7, 1, 0, '[]', datetime('now'), datetime('now'), datetime('now'));

INSERT INTO courses (title, description, price, duration, lessons, category, level, rating, visible, featured, curriculum, created_at, updated_at, published_at)
VALUES ('Mobile App Development', 'Build native mobile apps with React Native for iOS and Android', 229, '12 Weeks', 48, 'Mobile Development', 'intermediate', 4.85, 1, 0, '[]', datetime('now'), datetime('now'), datetime('now'));

INSERT INTO courses (title, description, price, duration, lessons, category, level, rating, visible, featured, curriculum, created_at, updated_at, published_at)
VALUES ('Cloud Computing with AWS', 'Master AWS services and cloud architecture for scalable applications', 279, '10 Weeks', 40, 'Cloud & DevOps', 'intermediate', 4.9, 1, 0, '[]', datetime('now'), datetime('now'), datetime('now'));

-- About Page
INSERT INTO about_pages (hero_title, hero_subtitle, mission_title, mission_description, vision_title, vision_description, values, created_at, updated_at, published_at)
VALUES ('About AI Studio', 'Transforming careers through expert-led online education', 'Our Mission', 'To democratize access to high-quality technical education and empower individuals to build successful careers in technology.', 'Our Vision', 'To become the leading online platform for professional development, helping millions achieve their career goals through innovative learning experiences.', '[{"icon":"🎯","title":"Excellence","description":"We strive for excellence in everything we do"},{"icon":"🤝","title":"Community","description":"Building a supportive learning community"},{"icon":"💡","title":"Innovation","description":"Constantly innovating our teaching methods"},{"icon":"🌍","title":"Accessibility","description":"Making education accessible to everyone"}]', datetime('now'), datetime('now'), datetime('now'));

-- Contact Page
INSERT INTO contact_pages (phone, email, address, office_hours, map_url, created_at, updated_at, published_at)
VALUES ('+1 (555) 123-4567', 'hello@aistudio.com', '123 Learning Street, Tech Valley, CA 94025', 'Monday - Friday: 9:00 AM - 6:00 PM PST', 'https://maps.google.com', datetime('now'), datetime('now'), datetime('now'));

-- Blog Posts
INSERT INTO blog_posts (title, slug, excerpt, content, author, category, published_at, created_at, updated_at)
VALUES ('The Future of AI in Education', 'future-ai-education', 'Exploring how artificial intelligence is revolutionizing the way we learn and teach.', '<p>Artificial Intelligence is transforming education in unprecedented ways...</p>
                <p>From personalized learning paths to intelligent tutoring systems, AI is making education more accessible and effective.</p>
                <h2>Key Benefits</h2>
                <ul>
                  <li>Personalized learning experiences</li>
                  <li>24/7 availability of AI tutors</li>
                  <li>Adaptive assessments</li>
                  <li>Predictive analytics for student success</li>
                </ul>', 'Dr. Sarah Johnson', 'Technology', datetime('now'), datetime('now'), datetime('now'));

INSERT INTO blog_posts (title, slug, excerpt, content, author, category, published_at, created_at, updated_at)
VALUES ('10 Tips for Learning to Code', 'tips-learning-code', 'Essential tips and strategies for beginners starting their coding journey.', '<p>Learning to code can be challenging but rewarding. Here are our top tips...</p>', 'Mike Chen', 'Programming', datetime('now'), datetime('now'), datetime('now'));

INSERT INTO blog_posts (title, slug, excerpt, content, author, category, published_at, created_at, updated_at)
VALUES ('Remote Work Best Practices', 'remote-work-practices', 'How to stay productive and maintain work-life balance while working from home.', '<p>Remote work has become the new normal. Here''s how to excel...</p>', 'Lisa Anderson', 'Career', datetime('now'), datetime('now'), datetime('now'));

-- Pricing Plans
INSERT INTO pricing_plans (name, price, period, description, features, featured, cta_text, "order", created_at, updated_at, published_at)
VALUES ('Basic', 29, 'month', 'Perfect for getting started', '[{"text":"Access to 5 courses","included":true},{"text":"Basic support","included":true},{"text":"Community access","included":true},{"text":"Certificates","included":false},{"text":"1-on-1 mentoring","included":false}]', 0, 'Start Free Trial', 1, datetime('now'), datetime('now'), datetime('now'));

INSERT INTO pricing_plans (name, price, period, description, features, featured, cta_text, "order", created_at, updated_at, published_at)
VALUES ('Professional', 79, 'month', 'Most popular choice for professionals', '[{"text":"Unlimited course access","included":true},{"text":"Priority support","included":true},{"text":"Community access","included":true},{"text":"Certificates","included":true},{"text":"1-on-1 mentoring (2 hours/month)","included":true}]', 1, 'Get Started', 2, datetime('now'), datetime('now'), datetime('now'));

INSERT INTO pricing_plans (name, price, period, description, features, featured, cta_text, "order", created_at, updated_at, published_at)
VALUES ('Enterprise', 199, 'month', 'For teams and organizations', '[{"text":"Everything in Professional","included":true},{"text":"Dedicated account manager","included":true},{"text":"Custom learning paths","included":true},{"text":"Team analytics","included":true},{"text":"Unlimited mentoring","included":true}]', 0, 'Contact Sales', 3, datetime('now'), datetime('now'), datetime('now'));

-- Teachers
INSERT INTO teachers (name, role, bio, expertise, linkedin, twitter, "order", created_at, updated_at, published_at)
VALUES ('Dr. Sarah Johnson', 'Head of Data Science', 'PhD in Computer Science from MIT. 15+ years of experience in machine learning and AI.', '["Python","Machine Learning","Deep Learning","TensorFlow"]', 'https://linkedin.com/in/sarahjohnson', 'https://twitter.com/sarahjohnson', 1, datetime('now'), datetime('now'), datetime('now'));

INSERT INTO teachers (name, role, bio, expertise, linkedin, twitter, "order", created_at, updated_at, published_at)
VALUES ('Mike Chen', 'Senior Web Developer', 'Full stack developer with 10+ years building scalable web applications.', '["JavaScript","React","Node.js","MongoDB"]', 'https://linkedin.com/in/mikechen', '', 2, datetime('now'), datetime('now'), datetime('now'));

INSERT INTO teachers (name, role, bio, expertise, linkedin, twitter, "order", created_at, updated_at, published_at)
VALUES ('Lisa Anderson', 'UX Design Lead', 'Award-winning designer with expertise in user experience and interface design.', '["Figma","UI/UX","Design Systems","User Research"]', 'https://linkedin.com/in/lisaanderson', '', 3, datetime('now'), datetime('now'), datetime('now'));

INSERT INTO teachers (name, role, bio, expertise, linkedin, twitter, "order", created_at, updated_at, published_at)
VALUES ('David Kumar', 'Cloud Architecture Expert', 'AWS certified solutions architect with extensive DevOps experience.', '["AWS","Docker","Kubernetes","CI/CD"]', 'https://linkedin.com/in/davidkumar', '', 4, datetime('now'), datetime('now'), datetime('now'));

-- Job Postings
INSERT INTO job_postings (title, company, location, type, description, requirements, apply_url, created_at, updated_at, published_at)
VALUES ('Senior React Developer', 'TechCorp Inc.', 'San Francisco, CA (Remote)', 'Full-time', '<p>We are looking for an experienced React developer to join our team...</p>', '["5+ years React experience","Redux/MobX","TypeScript","Testing"]', 'https://techcorp.com/careers/react-dev', datetime('now'), datetime('now'), datetime('now'));

INSERT INTO job_postings (title, company, location, type, description, requirements, apply_url, created_at, updated_at, published_at)
VALUES ('Data Scientist', 'DataViz Solutions', 'New York, NY', 'Full-time', '<p>Join our data science team to work on cutting-edge ML projects...</p>', '["Python","Machine Learning","SQL","Statistics"]', 'https://dataviz.com/careers/data-scientist', datetime('now'), datetime('now'), datetime('now'));

INSERT INTO job_postings (title, company, location, type, description, requirements, apply_url, created_at, updated_at, published_at)
VALUES ('UX Designer', 'DesignHub', 'Remote', 'Contract', '<p>We need a talented UX designer for a 6-month project...</p>', '["Figma","User Research","Prototyping","Design Systems"]', 'https://designhub.com/careers/ux', datetime('now'), datetime('now'), datetime('now'));

-- Career Resources
INSERT INTO career_resources (title, description, type, download_url, created_at, updated_at, published_at)
VALUES ('Resume Template Pack', 'Professional resume templates optimized for tech roles', 'Template', '/resources/resume-templates.pdf', datetime('now'), datetime('now'), datetime('now'));

INSERT INTO career_resources (title, description, type, download_url, created_at, updated_at, published_at)
VALUES ('Interview Preparation Guide', 'Complete guide to ace technical interviews', 'Guide', '/resources/interview-guide.pdf', datetime('now'), datetime('now'), datetime('now'));

INSERT INTO career_resources (title, description, type, download_url, created_at, updated_at, published_at)
VALUES ('Salary Negotiation Handbook', 'Learn how to negotiate your worth', 'Handbook', '/resources/salary-negotiation.pdf', datetime('now'), datetime('now'), datetime('now'));

