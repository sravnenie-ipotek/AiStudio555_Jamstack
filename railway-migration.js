// Simple migration script that will run on Railway production
// This creates the nd_home table and inserts default data

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function runMigration() {
  console.log('🚀 Running Railway production migration...');

  try {
    // Create nd_home table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS nd_home (
        id SERIAL PRIMARY KEY,
        section_key VARCHAR(100) UNIQUE NOT NULL,
        section_type VARCHAR(50) NOT NULL,
        visible BOOLEAN DEFAULT true,
        content_en JSONB,
        content_ru JSONB,
        content_he JSONB,
        animations_enabled BOOLEAN DEFAULT true,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ nd_home table created');

    // Insert basic sections
    const sections = [
      { key: 'hero', type: 'hero', order: 1, content: { title: 'Master AI & Machine Learning', subtitle: 'Transform Your Career' } },
      { key: 'features', type: 'features', order: 2, content: { title: 'Why Choose AI Studio' } },
      { key: 'courses', type: 'courses', order: 3, content: { title: 'Featured Courses' } }
    ];

    for (const s of sections) {
      await pool.query(
        `INSERT INTO nd_home (section_key, section_type, content_en, content_ru, content_he, order_index)
         VALUES ($1, $2, $3, $3, $3, $4)
         ON CONFLICT (section_key) DO NOTHING`,
        [s.key, s.type, JSON.stringify(s.content), s.order]
      );
    }

    console.log('✅ Default sections inserted');

    // Create nd_courses table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS nd_courses (
        id SERIAL PRIMARY KEY,
        course_key VARCHAR(100) UNIQUE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2),
        duration VARCHAR(50),
        category VARCHAR(100),
        lessons_count INTEGER DEFAULT 0,
        rating DECIMAL(3, 2) DEFAULT 5.0,
        reviews_count INTEGER DEFAULT 100,
        url VARCHAR(500),
        featured BOOLEAN DEFAULT true,
        visible BOOLEAN DEFAULT true,
        published BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert sample courses
    const courses = [
      {
        key: 'react-redux',
        title: 'React & Redux Masterclass',
        description: 'Master React and Redux development',
        category: 'App Development',
        price: 99.99,
        duration: '10 weeks',
        lessons_count: 32,
        url: 'detail_courses.html?id=1'
      },
      {
        key: 'nodejs-backend',
        title: 'Node.js Backend Development',
        description: 'Backend development with Node.js',
        category: 'Machine Learning',
        price: 89.99,
        duration: '9 weeks',
        lessons_count: 28,
        url: 'detail_courses.html?id=2'
      },
      {
        key: 'python-data-science',
        title: 'Python for Data Science',
        description: 'Learn Python for data analysis',
        category: 'Machine Learning',
        price: 79.99,
        duration: '12 weeks',
        lessons_count: 36,
        url: 'detail_courses.html?id=3'
      }
    ];

    for (const course of courses) {
      await pool.query(
        `INSERT INTO nd_courses (course_key, title, description, category, price, duration, lessons_count, url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (course_key) DO NOTHING`,
        [course.key, course.title, course.description, course.category, course.price, course.duration, course.lessons_count, course.url]
      );
    }

    console.log('✅ Sample courses inserted');
    console.log('🎉 Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await pool.end();
  }
}

runMigration();