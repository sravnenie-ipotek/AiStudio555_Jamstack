/**
 * Seed Initial Data for Railway PostgreSQL
 * This script populates the database with initial content
 */

const { Client } = require('pg');

async function seedDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('🔗 Connected to PostgreSQL');

    // 1. Insert initial home page data
    console.log('📝 Creating home page content...');
    await client.query(`
      INSERT INTO home_pages (
        id, title, 
        hero_title, hero_subtitle, hero_description, hero_section_visible,
        featured_courses_title, featured_courses_description, featured_courses_visible,
        about_title, about_subtitle, about_description, about_visible,
        companies_title, companies_description, companies_visible,
        testimonials_title, testimonials_subtitle, testimonials_visible,
        course_1_title, course_1_rating, course_1_lessons, course_1_duration, course_1_category, course_1_visible,
        course_2_title, course_2_rating, course_2_lessons, course_2_duration, course_2_category, course_2_visible,
        course_3_title, course_3_rating, course_3_lessons, course_3_duration, course_3_category, course_3_visible,
        course_4_title, course_4_rating, course_4_lessons, course_4_duration, course_4_category, course_4_visible,
        course_5_title, course_5_rating, course_5_lessons, course_5_duration, course_5_category, course_5_visible,
        course_6_title, course_6_rating, course_6_lessons, course_6_duration, course_6_category, course_6_visible,
        testimonial_1_text, testimonial_1_author, testimonial_1_rating, testimonial_1_visible,
        testimonial_2_text, testimonial_2_author, testimonial_2_rating, testimonial_2_visible,
        testimonial_3_text, testimonial_3_author, testimonial_3_rating, testimonial_3_visible,
        testimonial_4_text, testimonial_4_author, testimonial_4_rating, testimonial_4_visible,
        published_at, created_at, updated_at
      ) VALUES (
        1, 'AI Studio - Expert-Led Online Learning Platform',
        'Master AI & Technology', 'Transform Your Career with Expert-Led Courses', 'Join thousands of students learning cutting-edge technology from industry experts', true,
        'Featured Courses', 'Explore our most popular courses designed by industry experts', true,
        'About AI Studio', 'Your Path to Success', 'We provide world-class education in AI, Machine Learning, and modern technology', true,
        'Trusted by Leading Companies', 'Our graduates work at top technology companies worldwide', true,
        'Student Success Stories', 'Hear from our successful graduates', true,
        'Introduction to Machine Learning', '4.9', '24 Lessons', '8 Weeks', 'AI & ML', true,
        'Advanced Python Programming', '4.8', '32 Lessons', '10 Weeks', 'Programming', true,
        'Data Science Fundamentals', '4.9', '28 Lessons', '12 Weeks', 'Data Science', true,
        'Web Development Bootcamp', '4.7', '45 Lessons', '16 Weeks', 'Web Dev', true,
        'Cloud Computing Essentials', '4.8', '20 Lessons', '6 Weeks', 'Cloud', true,
        'Cybersecurity Basics', '4.9', '18 Lessons', '8 Weeks', 'Security', true,
        'This course changed my life! I went from zero coding experience to landing a job at a tech company.', 'Sarah Johnson', '5.0', true,
        'The instructors are amazing and the content is always up-to-date with industry standards.', 'Michael Chen', '5.0', true,
        'Best investment I ever made in my career. The practical projects really prepared me for real work.', 'Emma Davis', '5.0', true,
        'The community support and mentorship made all the difference in my learning journey.', 'Alex Rodriguez', '5.0', true,
        NOW(), NOW(), NOW()
      ) ON CONFLICT (id) DO UPDATE SET
        updated_at = NOW()
    `);

    // 2. Insert sample courses
    console.log('📚 Creating sample courses...');
    const courses = [
      ['Introduction to Machine Learning', 'Learn the fundamentals of ML algorithms and applications', 299, '8 Weeks', '24 Lessons', 'AI & ML', '4.9', true],
      ['Advanced Python Programming', 'Master Python for data science and web development', 249, '10 Weeks', '32 Lessons', 'Programming', '4.8', true],
      ['Data Science Fundamentals', 'Complete guide to data analysis and visualization', 399, '12 Weeks', '28 Lessons', 'Data Science', '4.9', true],
      ['Web Development Bootcamp', 'Full-stack development with modern technologies', 499, '16 Weeks', '45 Lessons', 'Web Dev', '4.7', true]
    ];

    for (let i = 0; i < courses.length; i++) {
      const [title, description, price, duration, lessons, category, rating, visible] = courses[i];
      await client.query(`
        INSERT INTO courses (title, description, price, duration, lessons, category, rating, visible, published_at, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW(), NOW())
        ON CONFLICT DO NOTHING
      `, [title, description, price, duration, lessons, category, rating, visible]);
    }

    // 3. Insert sample blog posts
    console.log('📰 Creating sample blog posts...');
    const blogPosts = [
      ['Getting Started with AI', 'getting-started-ai', 'A comprehensive guide for beginners', 'Learn the basics of artificial intelligence...', 'AI Studio Team', 'Technology'],
      ['Top 10 Python Libraries', 'top-python-libraries', 'Essential tools for data science', 'Discover the most important Python libraries...', 'Dr. Smith', 'Programming'],
      ['Future of Machine Learning', 'future-of-ml', 'Trends and predictions for 2025', 'Explore what the future holds for ML...', 'Prof. Johnson', 'AI & ML']
    ];

    for (const [title, slug, excerpt, content, author, category] of blogPosts) {
      await client.query(`
        INSERT INTO blog_posts (title, slug, excerpt, content, author, category, published_at, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW(), NOW())
        ON CONFLICT DO NOTHING
      `, [title, slug, excerpt, content, author, category]);
    }

    // 4. Insert sample teachers
    console.log('👨‍🏫 Creating sample teachers...');
    const teachers = [
      ['Dr. Sarah Smith', 'Lead AI Instructor', 'PhD in Machine Learning with 10+ years of experience', 'https://linkedin.com/in/sarah', 'https://twitter.com/sarah', 1],
      ['Prof. John Davis', 'Senior Data Scientist', 'Expert in Python and data analysis', 'https://linkedin.com/in/john', 'https://twitter.com/john', 2],
      ['Emma Wilson', 'Web Development Expert', 'Full-stack developer and educator', 'https://linkedin.com/in/emma', 'https://twitter.com/emma', 3]
    ];

    for (const [name, role, bio, linkedin, twitter, order] of teachers) {
      await client.query(`
        INSERT INTO teachers (name, role, bio, linkedin, twitter, "order", published_at, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW(), NOW())
        ON CONFLICT DO NOTHING
      `, [name, role, bio, linkedin, twitter, order]);
    }

    // 5. Insert contact page data
    console.log('📞 Creating contact page...');
    await client.query(`
      INSERT INTO contact_pages (id, phone, email, address, office_hours, map_url, published_at, created_at, updated_at)
      VALUES (1, '+1 (555) 123-4567', 'info@aistudio555.com', '123 Tech Street, Silicon Valley, CA 94025', 'Monday-Friday: 9:00 AM - 6:00 PM', 'https://maps.google.com/?q=Silicon+Valley', NOW(), NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET
        updated_at = NOW()
    `);

    console.log('✅ Database seeded successfully!');
    
  } catch (error) {
    console.error('❌ Seeding error:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Run if called directly
if (require.main === module) {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is required');
    console.log('Usage: DATABASE_URL=postgresql://... node seed-initial-data.js');
    process.exit(1);
  }
  
  seedDatabase().catch(console.error);
}

module.exports = { seedDatabase };