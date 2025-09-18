// This script will be executed on Railway to create the nd_home table
// Run this via Railway's dashboard or Railway CLI

const { Pool } = require('pg');

// Use Railway's DATABASE_URL directly
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function migrate() {
  const client = await pool.connect();

  try {
    console.log('🚀 Creating nd_home table on Railway...');

    // Create table
    await client.query(`
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

    console.log('✅ Table created');

    // Insert initial data
    const sections = [
      {
        key: 'hero',
        type: 'hero',
        order: 1,
        content: {
          title: 'Master AI & Machine Learning',
          subtitle: 'Transform Your Career',
          description: 'Join our comprehensive AI courses',
          cta_primary: 'Start Learning',
          cta_secondary: 'View Courses'
        }
      },
      {
        key: 'features',
        type: 'features',
        order: 2,
        content: {
          title: 'Why Choose AI Studio',
          features: [
            { icon: '🎓', title: 'Expert Instructors', description: 'Learn from professionals' },
            { icon: '💻', title: 'Hands-On Projects', description: 'Build real applications' },
            { icon: '🏆', title: 'Career Support', description: 'Job placement assistance' },
            { icon: '⚡', title: 'Flexible Learning', description: 'Study at your pace' }
          ]
        }
      },
      {
        key: 'courses',
        type: 'courses',
        order: 3,
        content: {
          title: 'Featured Courses',
          subtitle: 'Start Your Journey',
          view_all_text: 'View All Courses'
        }
      },
      {
        key: 'testimonials',
        type: 'testimonials',
        order: 4,
        content: {
          title: 'Student Success',
          testimonials: []
        }
      },
      {
        key: 'cta',
        type: 'cta',
        order: 5,
        content: {
          title: 'Ready to Start?',
          cta_text: 'Enroll Now'
        }
      }
    ];

    for (const s of sections) {
      await client.query(
        `INSERT INTO nd_home (section_key, section_type, content_en, content_ru, content_he, order_index)
         VALUES ($1, $2, $3, $3, $3, $4)
         ON CONFLICT (section_key) DO NOTHING`,
        [s.key, s.type, JSON.stringify(s.content), s.order]
      );
    }

    console.log('✅ Data inserted');

    // Create indexes
    await client.query('CREATE INDEX IF NOT EXISTS idx_nd_home_visible ON nd_home(visible)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_nd_home_order ON nd_home(order_index)');

    console.log('✅ Migration complete!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch(console.error);