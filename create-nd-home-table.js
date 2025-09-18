const { Pool } = require('pg');
require('dotenv').config();

// Create the nd_home table in Railway PostgreSQL database

// Check if we're on Railway (production) or local
const isProduction = process.env.DATABASE_URL && process.env.DATABASE_URL.includes('railway');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

async function createNdHomeTable() {
  const client = await pool.connect();

  try {
    console.log('🚀 Creating nd_home table...');

    // Create the table
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

    console.log('✅ Table created successfully');

    // Insert default sections
    const sections = [
      {
        section_key: 'hero',
        section_type: 'hero',
        order_index: 1,
        content_en: {
          title: 'Master AI & Machine Learning',
          subtitle: 'Transform Your Career with Expert-Led Training',
          description: 'Join thousands of professionals advancing their careers through our comprehensive AI courses.',
          cta_primary: 'Start Learning Today',
          cta_secondary: 'View Courses',
          background_image: '/backups/newDesign/images/hero-bg.jpg'
        }
      },
      {
        section_key: 'features',
        section_type: 'features',
        order_index: 2,
        content_en: {
          title: 'Why Choose AI Studio',
          subtitle: 'Everything You Need to Succeed',
          features: [
            {
              icon: '🎓',
              title: 'Expert Instructors',
              description: 'Learn from industry professionals with real-world experience'
            },
            {
              icon: '💻',
              title: 'Hands-On Projects',
              description: 'Build real AI applications and add them to your portfolio'
            },
            {
              icon: '🏆',
              title: 'Career Support',
              description: 'Get job placement assistance and career guidance'
            },
            {
              icon: '⚡',
              title: 'Flexible Learning',
              description: 'Study at your own pace with lifetime access to courses'
            }
          ]
        }
      },
      {
        section_key: 'courses',
        section_type: 'courses',
        order_index: 3,
        content_en: {
          title: 'Featured Courses',
          subtitle: 'Start Your AI Journey Today',
          view_all_text: 'View All Courses',
          view_all_link: '/courses.html'
        }
      },
      {
        section_key: 'testimonials',
        section_type: 'testimonials',
        order_index: 4,
        content_en: {
          title: 'What Our Students Say',
          subtitle: 'Success Stories from Our Community',
          testimonials: [
            {
              name: 'Sarah Chen',
              role: 'Data Scientist at Google',
              image: '/images/testimonial1.jpg',
              quote: 'AI Studio completely transformed my career. The practical approach and expert mentorship helped me land my dream job.',
              rating: 5
            },
            {
              name: 'Michael Roberts',
              role: 'ML Engineer at Microsoft',
              image: '/images/testimonial2.jpg',
              quote: 'The hands-on projects and real-world applications made all the difference. I was job-ready from day one.',
              rating: 5
            },
            {
              name: 'Elena Volkov',
              role: 'AI Researcher at Meta',
              image: '/images/testimonial3.jpg',
              quote: 'Best investment in my career. The curriculum is cutting-edge and the community support is amazing.',
              rating: 5
            }
          ]
        }
      },
      {
        section_key: 'cta',
        section_type: 'cta',
        order_index: 5,
        content_en: {
          title: 'Ready to Start Your AI Journey?',
          subtitle: 'Join thousands of successful graduates',
          cta_text: 'Enroll Now',
          features: [
            '30-Day Money Back Guarantee',
            'Lifetime Access to Content',
            'Certificate of Completion',
            'Job Placement Support'
          ]
        }
      },
      {
        section_key: 'stats',
        section_type: 'stats',
        order_index: 6,
        content_en: {
          title: 'Our Impact in Numbers',
          stats: [
            { value: '10,000+', label: 'Students Trained' },
            { value: '95%', label: 'Job Placement Rate' },
            { value: '50+', label: 'Expert Instructors' },
            { value: '4.9/5', label: 'Average Rating' }
          ]
        }
      }
    ];

    // Insert all sections
    for (const section of sections) {
      await client.query(
        `INSERT INTO nd_home (
          section_key, section_type, visible, content_en, content_ru, content_he,
          animations_enabled, order_index
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (section_key) DO UPDATE SET
          content_en = EXCLUDED.content_en,
          updated_at = CURRENT_TIMESTAMP`,
        [
          section.section_key,
          section.section_type,
          true,
          JSON.stringify(section.content_en),
          JSON.stringify(section.content_ru || section.content_en),
          JSON.stringify(section.content_he || section.content_en),
          true,
          section.order_index
        ]
      );
    }

    console.log('✅ Default sections inserted successfully');

    // Create index for better performance
    await client.query('CREATE INDEX IF NOT EXISTS idx_nd_home_visible ON nd_home(visible)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_nd_home_order ON nd_home(order_index)');

    console.log('✅ Indexes created successfully');

    // Verify the data
    const result = await client.query('SELECT COUNT(*) FROM nd_home');
    console.log(`✅ Total sections in nd_home table: ${result.rows[0].count}`);

  } catch (error) {
    console.error('❌ Error creating table:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run if executed directly
if (require.main === module) {
  createNdHomeTable()
    .then(() => {
      console.log('✅ Migration completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    });
}

module.exports = createNdHomeTable;