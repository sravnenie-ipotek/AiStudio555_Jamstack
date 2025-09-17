const { Client } = require('pg');

// Load environment variables
require('dotenv').config();

// Use the same connection logic as server.js
let dbConfig;
if (process.env.DATABASE_URL) {
  const isLocal = process.env.DATABASE_URL.includes('localhost') || process.env.NODE_ENV === 'development';
  dbConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: isLocal ? false : { rejectUnauthorized: false }
  };
}

async function createTeachersTable() {
  try {
    console.log('🏗️  Creating nd_teachers_page table...');

    // Create table with same structure as other nd_ tables
    const client = new Client(dbConfig);
    await client.connect();

    await client.query(`
      CREATE TABLE IF NOT EXISTS nd_teachers_page (
        id SERIAL PRIMARY KEY,
        section_name VARCHAR(100) UNIQUE NOT NULL,
        content_en JSONB DEFAULT '{}',
        content_ru JSONB DEFAULT '{}',
        content_he JSONB DEFAULT '{}',
        visible BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('✅ Table created successfully');

    // Insert initial sections based on teachers.html structure
    const sections = [
      {
        section_name: 'hero',
        content_en: {
          title: 'Our Teachers',
          subtitle: 'Meet Our Team',
          description: 'Expert Instructors Dedicated to Your Success',
          breadcrumb_home: 'Home',
          breadcrumb_current: 'Teachers'
        }
      },
      {
        section_name: 'instructor_grid',
        content_en: {
          subtitle: 'Meet Our Team',
          title: 'Expert Instructors Dedicated to Your Success',
          description: 'Learn from industry professionals with years of real-world experience who are passionate about sharing their knowledge and helping you achieve your career goals.',
          instructors: [
            {
              id: 1,
              name: 'Sarah Chen',
              expertise: 'AI & Machine Learning',
              bio: 'Explore how artificial intelligence is revolutionizing education through personalized learning paths, intelligent tutoring systems, and adaptive assessments that cater to individual student needs.',
              image: 'images/CTA-Section-Bg.jpg',
              profile_link: '#'
            },
            {
              id: 2,
              name: 'Mike Johnson',
              expertise: 'Web Development',
              bio: 'Stay ahead of the curve with the latest web development trends, from serverless architecture and edge computing to WebAssembly and progressive web applications.',
              image: 'images/Course-Categories-Content-Bg.jpg',
              profile_link: '#'
            },
            {
              id: 3,
              name: 'Emily Rodriguez',
              expertise: 'Career Development',
              bio: 'A comprehensive guide for career changers looking to break into the tech industry, covering skill development, portfolio building, and networking strategies.',
              image: 'images/About-Me-Image.jpg',
              profile_link: '#'
            },
            {
              id: 4,
              name: 'David Park',
              expertise: 'Data Science',
              bio: 'Demystifying machine learning with practical examples and a clear roadmap for beginners to start their journey in data science and artificial intelligence.',
              image: 'images/About-Us-Image.png',
              profile_link: '#'
            }
          ]
        }
      },
      {
        section_name: 'become_instructor',
        content_en: {
          subtitle: 'Start Learning Today',
          title: 'Discover A World Of Learning Opportunities.',
          description: "Don't wait to transform career and unlock your full potential. join our community of passionate learners and gain access to a wide range of courses.",
          primary_button: 'get in touch',
          secondary_button: 'Check Out Courses',
          primary_link: 'contact-us.html',
          secondary_link: 'courses.html',
          man_image_1: 'images/CTA-Man-Image1.png',
          man_image_2: 'images/CTA-Man-Image2_1CTA-Man-Image2.png'
        }
      },
      {
        section_name: 'stats',
        content_en: {
          items: [
            { text: 'Start Learning' },
            { text: 'Browse Courses' },
            { text: 'Start Learning' },
            { text: 'Browse Courses' },
            { text: 'Start Learning' }
          ]
        }
      }
    ];

    console.log('📊 Inserting initial sections...');

    for (const section of sections) {
      await client.query(`
        INSERT INTO nd_teachers_page (section_name, content_en, content_ru, content_he, visible)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (section_name) DO UPDATE SET
          content_en = EXCLUDED.content_en,
          updated_at = NOW()
      `, [
        section.section_name,
        JSON.stringify(section.content_en),
        JSON.stringify({}),
        JSON.stringify({}),
        true
      ]);
    }

    console.log('✅ Initial data inserted successfully');

    // Verify the data
    const result = await client.query('SELECT section_name, visible FROM nd_teachers_page ORDER BY section_name');
    console.log('📋 Created sections:', result.rows);

  } catch (error) {
    console.error('❌ Error creating teachers table:', error);
  } finally {
    await client.end();
  }
}

createTeachersTable();