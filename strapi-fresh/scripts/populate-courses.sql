-- Populate Courses with correct schema
DELETE FROM courses WHERE document_id LIKE 'course-%';

INSERT INTO courses (document_id, title, description, price, duration, lessons, category, rating, visible, created_at, updated_at, published_at, created_by_id, updated_by_id)
VALUES 
('course-1', 'Complete React Development', 'Master React.js from basics to advanced concepts including Redux, Hooks, and Next.js', 199, '12 Weeks', 48, 'Web Development', 4.9, 1, datetime('now'), datetime('now'), datetime('now'), 1, 1),
('course-2', 'Python for Data Science', 'Learn Python programming with focus on data analysis, machine learning, and AI', 249, '10 Weeks', 40, 'Data Science', 4.8, 1, datetime('now'), datetime('now'), datetime('now'), 1, 1),
('course-3', 'Full Stack JavaScript', 'Become a full stack developer with Node.js, Express, MongoDB, and React', 299, '16 Weeks', 64, 'Web Development', 4.95, 1, datetime('now'), datetime('now'), datetime('now'), 1, 1),
('course-4', 'UI/UX Design Masterclass', 'Learn modern design principles, Figma, and user experience best practices', 179, '8 Weeks', 32, 'Design', 4.7, 1, datetime('now'), datetime('now'), datetime('now'), 1, 1),
('course-5', 'Mobile App Development', 'Build native mobile apps with React Native for iOS and Android', 229, '12 Weeks', 48, 'Mobile Development', 4.85, 1, datetime('now'), datetime('now'), datetime('now'), 1, 1),
('course-6', 'Cloud Computing with AWS', 'Master AWS services and cloud architecture for scalable applications', 279, '10 Weeks', 40, 'Cloud & DevOps', 4.9, 1, datetime('now'), datetime('now'), datetime('now'), 1, 1);

SELECT 'Added ' || COUNT(*) || ' courses' FROM courses WHERE document_id LIKE 'course-%';