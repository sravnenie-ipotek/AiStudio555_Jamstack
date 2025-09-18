/**
 * Migration: Create Teachers Table
 * Following Single Table Design Philosophy - ALL teacher data in one comprehensive table
 * Date: 2025-01-17
 */

const fs = require('fs').promises;
const path = require('path');

async function createTeachersTable(client) {
  console.log('🏗️ Creating teachers table following Single Table Design Philosophy...');

  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS entity_teachers (
        -- Core Fields
        id SERIAL PRIMARY KEY,
        teacher_key VARCHAR(100) UNIQUE,

        -- Main Profile Data
        full_name VARCHAR(255) NOT NULL,
        professional_title VARCHAR(255) NOT NULL,
        bio TEXT,
        short_bio VARCHAR(500),
        company VARCHAR(255),

        -- LinkedIn-Style Professional Data
        years_experience INTEGER DEFAULT 0,
        students_taught INTEGER DEFAULT 0,
        courses_count INTEGER DEFAULT 0,
        rating DECIMAL(3, 2) DEFAULT 0.0,

        -- Complex Data (JSONB for nested structures)
        skills JSONB DEFAULT '[]',                    -- ["Machine Learning", "Python", ...]
        experience_history JSONB DEFAULT '[]',        -- [{"title": "...", "company": "...", "duration": "...", "description": "..."}]
        courses_taught JSONB DEFAULT '[]',            -- [{"title": "...", "description": "...", "students": 150, "rating": 4.9}]
        student_reviews JSONB DEFAULT '[]',           -- [{"text": "...", "author": "...", "rating": 5, "stars": "★★★★★"}]
        achievements JSONB DEFAULT '[]',              -- Professional achievements and certifications
        education JSONB DEFAULT '[]',                 -- Educational background

        -- Media & Links
        profile_image_url TEXT,
        background_image_url TEXT,
        resume_url TEXT,
        linkedin_url TEXT,
        github_url TEXT,
        portfolio_url TEXT,

        -- Contact Information
        email VARCHAR(255),
        phone VARCHAR(50),
        office_hours TEXT,
        availability_status VARCHAR(100) DEFAULT 'Available',

        -- Teaching Specializations
        primary_expertise VARCHAR(255),
        teaching_philosophy TEXT,
        preferred_teaching_methods JSONB DEFAULT '[]',
        languages_spoken JSONB DEFAULT '["English"]',

        -- Multi-language Support (Following system pattern)
        full_name_ru VARCHAR(255),
        professional_title_ru VARCHAR(255),
        bio_ru TEXT,
        short_bio_ru VARCHAR(500),
        full_name_he VARCHAR(255),
        professional_title_he VARCHAR(255),
        bio_he TEXT,
        short_bio_he VARCHAR(500),

        -- Social Proof & Statistics
        total_views INTEGER DEFAULT 0,
        profile_completeness INTEGER DEFAULT 0,        -- Percentage of profile completion
        response_rate INTEGER DEFAULT 100,             -- Response rate for student inquiries
        average_session_rating DECIMAL(3, 2) DEFAULT 0.0,

        -- Status Flags (Following system pattern)
        is_featured BOOLEAN DEFAULT false,             -- Featured on teachers page
        is_visible BOOLEAN DEFAULT true,               -- Visible to public
        is_published BOOLEAN DEFAULT true,             -- Profile published
        is_active BOOLEAN DEFAULT true,                -- Currently active teacher
        accepts_new_students BOOLEAN DEFAULT true,     -- Accepting new students
        is_premium_instructor BOOLEAN DEFAULT false,   -- Premium tier instructor

        -- Scheduling & Availability
        timezone VARCHAR(100) DEFAULT 'UTC',
        weekly_schedule JSONB DEFAULT '{}',            -- Weekly availability schedule
        booking_calendar_url TEXT,                     -- External calendar integration

        -- Performance Metrics
        completion_rate DECIMAL(5, 2) DEFAULT 100.0,  -- Course completion rate for students
        satisfaction_score DECIMAL(3, 2) DEFAULT 5.0, -- Overall satisfaction score

        -- SEO & Discovery
        seo_keywords JSONB DEFAULT '[]',               -- Keywords for search optimization
        category_tags JSONB DEFAULT '[]',              -- Categories/subjects taught

        -- System Metadata
        admin_notes TEXT,                              -- Internal admin notes
        last_login TIMESTAMP,                          -- Last system login
        profile_created_by VARCHAR(255),               -- Admin who created profile

        -- Timestamps (Following system pattern)
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Create the table
  await client.query(createTableSQL);
  console.log('✅ Teachers table created successfully!');

  // Create indexes for better performance
  console.log('🏗️ Creating indexes...');

  const indexes = [
    'CREATE INDEX IF NOT EXISTS idx_teachers_teacher_key ON entity_teachers(teacher_key);',
    'CREATE INDEX IF NOT EXISTS idx_teachers_featured ON entity_teachers(is_featured) WHERE is_featured = true;',
    'CREATE INDEX IF NOT EXISTS idx_teachers_visible ON entity_teachers(is_visible) WHERE is_visible = true;',
    'CREATE INDEX IF NOT EXISTS idx_teachers_active ON entity_teachers(is_active) WHERE is_active = true;',
    'CREATE INDEX IF NOT EXISTS idx_teachers_rating ON entity_teachers(rating) WHERE rating > 0;',
    'CREATE INDEX IF NOT EXISTS idx_teachers_experience ON entity_teachers(years_experience);',
    'CREATE INDEX IF NOT EXISTS idx_teachers_search ON entity_teachers USING gin(to_tsvector(\'english\', full_name || \' \' || professional_title || \' \' || COALESCE(bio, \'\')));',
    'CREATE INDEX IF NOT EXISTS idx_teachers_skills ON entity_teachers USING gin(skills);',
    'CREATE INDEX IF NOT EXISTS idx_teachers_categories ON entity_teachers USING gin(category_tags);'
  ];

  for (const indexSQL of indexes) {
    await client.query(indexSQL);
  }

  console.log('✅ Indexes created successfully!');

  // Insert sample data matching our LinkedIn-style profiles
  console.log('📊 Inserting sample teacher data...');

  const sampleTeachers = [
    {
      teacher_key: 'sarah-chen-ai-ml',
      full_name: 'Sarah Chen',
      professional_title: 'AI & Machine Learning Instructor',
      bio: `Passionate AI instructor with 8+ years of commercial development experience at leading tech companies including Google AI and Meta. I specialize in making complex machine learning concepts accessible through hands-on, practical projects.

My teaching philosophy centers on learning by doing. I believe that students learn best when they can immediately apply theoretical concepts to real-world problems. This approach has helped me successfully mentor over 300 students in AI fundamentals, many of whom have gone on to secure positions at top tech companies.

As Co-founder and AI Lead at TechEd Solutions, I develop cutting-edge AI curricula and lead educational initiatives that bridge the gap between academic theory and industry practice. My courses emphasize practical skills in neural networks, natural language processing, and AI ethics.`,
      short_bio: 'Co-founder & AI Lead at TechEd Solutions. 8+ years of commercial AI development experience. Expert in teaching complex machine learning concepts through practical, hands-on projects. Mentored 300+ students.',
      company: 'TechEd Solutions',
      years_experience: 8,
      students_taught: 300,
      courses_count: 12,
      rating: 4.9,
      skills: JSON.stringify(['Machine Learning', 'Deep Learning', 'Neural Networks', 'Python', 'TensorFlow', 'PyTorch', 'Natural Language Processing', 'Computer Vision', 'AI Ethics', 'Data Science', 'Curriculum Development', 'Technical Mentoring']),
      experience_history: JSON.stringify([
        {
          title: 'Co-founder & AI Lead',
          company: 'TechEd Solutions',
          duration: '2020 - Present • 4 years',
          description: 'Leading AI education initiatives and curriculum development for enterprise clients. Built comprehensive training programs that have educated over 1,000 professionals in AI fundamentals. Developed proprietary teaching methodologies that improve learning outcomes by 40%.'
        },
        {
          title: 'Senior AI Engineer',
          company: 'Google AI',
          duration: '2018 - 2020 • 2 years',
          description: 'Developed large-scale machine learning systems for natural language processing applications. Led cross-functional teams in implementing AI ethics frameworks. Mentored junior engineers and contributed to Google\'s internal AI education programs.'
        },
        {
          title: 'Machine Learning Engineer',
          company: 'Meta',
          duration: '2016 - 2018 • 2 years',
          description: 'Built recommendation systems serving millions of users. Specialized in deep learning architectures for computer vision and natural language understanding. Published research on improving model interpretability and fairness.'
        }
      ]),
      courses_taught: JSON.stringify([
        {
          title: 'Machine Learning Fundamentals',
          description: 'Comprehensive introduction to ML concepts, algorithms, and practical applications. Covers supervised and unsupervised learning, model evaluation, and real-world case studies.',
          students: 150,
          rating: 4.9
        },
        {
          title: 'Deep Learning with Neural Networks',
          description: 'Advanced course covering neural network architectures, backpropagation, CNNs, RNNs, and modern deep learning frameworks like TensorFlow and PyTorch.',
          students: 120,
          rating: 4.8
        },
        {
          title: 'AI Ethics and Responsible AI',
          description: 'Critical examination of ethical considerations in AI development, including bias detection, fairness metrics, and responsible deployment practices.',
          students: 80,
          rating: 5.0
        }
      ]),
      student_reviews: JSON.stringify([
        {
          text: 'Sarah\'s teaching style is exceptional. She breaks down complex AI concepts into digestible pieces and provides real-world examples that make everything click. The hands-on projects were incredibly valuable for building my portfolio.',
          author: 'Alex Thompson, Software Engineer at Microsoft',
          rating: 5,
          stars: '★★★★★'
        },
        {
          text: 'I transitioned from finance to AI thanks to Sarah\'s courses. Her patient mentoring and practical approach gave me the confidence to pursue a career in machine learning. Now I\'m working as an ML engineer at a startup!',
          author: 'Maria Garcia, ML Engineer at TechFlow',
          rating: 5,
          stars: '★★★★★'
        },
        {
          text: 'The AI Ethics course was eye-opening. Sarah\'s deep industry experience combined with her thoughtful approach to responsible AI development is exactly what the tech industry needs. Highly recommended!',
          author: 'David Kim, Product Manager at Meta',
          rating: 5,
          stars: '★★★★★'
        }
      ]),
      profile_image_url: 'images/CTA-Section-Bg.jpg',
      primary_expertise: 'Artificial Intelligence & Machine Learning',
      teaching_philosophy: 'Learning by doing - students learn best when they can immediately apply theoretical concepts to real-world problems.',
      category_tags: JSON.stringify(['AI & Machine Learning', 'Data Science', 'Python Programming']),
      is_featured: true,
      is_visible: true,
      is_published: true,
      is_active: true
    },
    {
      teacher_key: 'mike-johnson-fullstack',
      full_name: 'Mike Johnson',
      professional_title: 'Full-Stack Development Instructor',
      bio: `Frontend Lead at WebCraft Studios with 10+ years of commercial development experience. I specialize in teaching modern JavaScript, React, and full-stack development through real-world projects and industry best practices.

My teaching approach focuses on practical, hands-on learning with immediate real-world application. I believe in building projects that students can proudly showcase in their portfolios while mastering the fundamentals of web development.

Having worked with startups and Fortune 500 companies, I bring valuable industry insights into the classroom, helping students understand not just how to code, but how to think like professional developers and work effectively in development teams.`,
      short_bio: 'Frontend Lead at WebCraft Studios. 10+ years of commercial development experience. Specializes in teaching modern JavaScript, React, and full-stack development through real-world projects.',
      company: 'WebCraft Studios',
      years_experience: 10,
      students_taught: 450,
      courses_count: 15,
      rating: 4.8,
      skills: JSON.stringify(['JavaScript', 'React', 'Node.js', 'Full-Stack Development', 'HTML/CSS', 'Redux', 'Express.js', 'MongoDB', 'REST APIs', 'Git', 'Agile Development', 'Code Review']),
      profile_image_url: 'images/Course-Categories-Content-Bg.jpg',
      primary_expertise: 'Full-Stack Web Development',
      category_tags: JSON.stringify(['Web Development', 'JavaScript', 'React']),
      is_featured: true,
      is_visible: true,
      is_published: true
    },
    {
      teacher_key: 'emily-rodriguez-career',
      full_name: 'Emily Rodriguez',
      professional_title: 'Career Transition Coach',
      bio: `Software Engineer & Career Mentor with 7+ years of commercial development experience. I specialize in guiding career changers through structured learning paths and practical skill development for successful tech transitions.

My unique background in both technical development and career coaching allows me to provide comprehensive guidance that addresses both the technical and professional aspects of entering the tech industry. I understand the challenges career changers face because I've been there myself.

Through personalized mentoring and structured learning programs, I've helped over 200 professionals successfully transition into tech careers, with an 85% job placement rate within 6 months of program completion.`,
      short_bio: 'Software Engineer & Career Mentor. 7+ years of commercial development experience. Expert in guiding career changers through structured learning paths for successful tech transitions.',
      company: 'Independent Mentor',
      years_experience: 7,
      students_taught: 200,
      courses_count: 8,
      rating: 4.9,
      skills: JSON.stringify(['Career Coaching', 'Technical Mentoring', 'Interview Preparation', 'Resume Review', 'Portfolio Development', 'Networking Strategies', 'Salary Negotiation', 'Professional Development']),
      profile_image_url: 'images/About-Me-Image.jpg',
      primary_expertise: 'Career Development & Technical Mentoring',
      category_tags: JSON.stringify(['Career Development', 'Mentoring', 'Professional Skills']),
      is_featured: true,
      is_visible: true,
      is_published: true
    },
    {
      teacher_key: 'david-park-data-science',
      full_name: 'David Park',
      professional_title: 'Data Science Instructor',
      bio: `Senior Data Scientist & Educator with 9+ years of commercial analytics experience. I'm passionate about teaching data science fundamentals through interactive workshops and real business case studies.

My approach combines statistical rigor with practical application, ensuring students not only understand the mathematics behind data science but also know how to apply these concepts to solve real business problems. I've worked across various industries including finance, healthcare, and e-commerce.

As a data science educator, I focus on building strong foundations in statistics, programming, and data visualization while emphasizing the importance of data ethics and responsible analytics practices in today's data-driven world.`,
      short_bio: 'Senior Data Scientist & Educator. 9+ years of commercial analytics experience. Passionate about teaching data science fundamentals through interactive workshops and real business case studies.',
      company: 'DataFlow Analytics',
      years_experience: 9,
      students_taught: 275,
      courses_count: 10,
      rating: 4.7,
      skills: JSON.stringify(['Data Science', 'Python', 'R', 'SQL', 'Machine Learning', 'Statistics', 'Data Visualization', 'Pandas', 'Scikit-learn', 'Tableau', 'Business Intelligence', 'Statistical Analysis']),
      profile_image_url: 'images/About-Us-Image.png',
      primary_expertise: 'Data Science & Analytics',
      category_tags: JSON.stringify(['Data Science', 'Analytics', 'Statistics']),
      is_featured: true,
      is_visible: true,
      is_published: true
    }
  ];

  for (const teacher of sampleTeachers) {
    await client.query(`
      INSERT INTO entity_teachers (
        teacher_key, full_name, professional_title, bio, short_bio, company,
        years_experience, students_taught, courses_count, rating, skills,
        experience_history, courses_taught, student_reviews, profile_image_url,
        primary_expertise, category_tags, is_featured, is_visible, is_published, is_active
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21
      ) ON CONFLICT (teacher_key) DO NOTHING
    `, [
      teacher.teacher_key, teacher.full_name, teacher.professional_title, teacher.bio, teacher.short_bio, teacher.company,
      teacher.years_experience, teacher.students_taught, teacher.courses_count, teacher.rating, teacher.skills,
      teacher.experience_history, teacher.courses_taught, teacher.student_reviews, teacher.profile_image_url,
      teacher.primary_expertise, teacher.category_tags, teacher.is_featured, teacher.is_visible, teacher.is_published, teacher.is_active || true
    ]);
  }

  console.log('✅ Sample teacher data inserted successfully!');
  console.log('🎯 Teachers table implementation complete!');
}

module.exports = { createTeachersTable };