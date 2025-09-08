/**
 * UNIFIED RAILWAY SERVER
 * All-in-one deployment: Frontend + Custom APIs + PostgreSQL
 * Works around Strapi v5 API bug by using custom Live APIs
 * Database: Railway PostgreSQL (no external dependencies!)
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const { Client } = require('pg');
const { migrate } = require('./migrate-to-railway');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Serve images from root for all language paths
app.use('/en/images', express.static(path.join(__dirname, 'images')));
app.use('/he/images', express.static(path.join(__dirname, 'images')));
app.use('/ru/images', express.static(path.join(__dirname, 'images')));

// Database configuration
let dbConfig;

// Log environment for debugging
console.log('Environment Variables Check:');
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);

if (process.env.DATABASE_URL) {
  // Railway PostgreSQL (production)
  dbConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  };
  console.log('🐘 Using Railway PostgreSQL database');
  console.log('🔗 Database URL pattern:', process.env.DATABASE_URL.substring(0, 30) + '...');
} else {
  // Local development fallback
  const sqlite3 = require('sqlite3').verbose();
  console.log('📦 Using local SQLite for development');
  console.log('⚠️  No DATABASE_URL found - using SQLite fallback');
}

// PostgreSQL query helper
async function queryDatabase(query, params = []) {
  if (!process.env.DATABASE_URL) {
    // SQLite fallback for local development
    const sqlite3 = require('sqlite3').verbose();
    const db = new sqlite3.Database(path.join(__dirname, 'strapi-fresh/.tmp/data.db'));
    
    return new Promise((resolve, reject) => {
      db.all(query, params, (err, rows) => {
        db.close();
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
  
  // Railway PostgreSQL
  const client = new Client(dbConfig);
  try {
    await client.connect();
    const result = await client.query(query, params);
    return result.rows;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Run migration on startup (if DATABASE_URL exists)
async function initializeDatabase() {
  if (process.env.DATABASE_URL) {
    console.log('🔄 Checking database migration...');
    try {
      await migrate();
      console.log('✅ Database ready');
    } catch (error) {
      console.error('⚠️  Migration error (may already be migrated):', error.message);
    }
  }
}

// Initialize database on startup
initializeDatabase();

// ==================== LIVE API ENDPOINTS ====================

// HOME PAGE - ALL 123 fields
app.get('/api/home-page', async (req, res) => {
  try {
    const data = await queryDatabase(
      'SELECT * FROM home_pages WHERE published_at IS NOT NULL LIMIT 1'
    );
    
    if (data.length === 0) {
      return res.json({ error: 'No home page data found' });
    }
    
    const homeData = data[0];
    res.json({
      data: {
        id: homeData.id,
        attributes: {
          // Hero Section
          title: homeData.title,
          heroTitle: homeData.hero_title,
          heroSubtitle: homeData.hero_subtitle,
          heroDescription: homeData.hero_description,
          heroSectionVisible: Boolean(homeData.hero_section_visible),
          
          // Featured Courses Section
          featuredCoursesTitle: homeData.featured_courses_title,
          featuredCoursesDescription: homeData.featured_courses_description,
          featuredCoursesVisible: Boolean(homeData.featured_courses_visible),
          
          // About Section
          aboutTitle: homeData.about_title,
          aboutSubtitle: homeData.about_subtitle,
          aboutDescription: homeData.about_description,
          aboutVisible: Boolean(homeData.about_visible),
          
          // Companies Section
          companiesTitle: homeData.companies_title,
          companiesDescription: homeData.companies_description,
          companiesVisible: Boolean(homeData.companies_visible),
          
          // Testimonials Section
          testimonialsTitle: homeData.testimonials_title,
          testimonialsSubtitle: homeData.testimonials_subtitle,
          testimonialsVisible: Boolean(homeData.testimonials_visible),
          
          // Individual Courses (6 courses)
          courses: [
            {
              title: homeData.course_1_title,
              rating: homeData.course_1_rating,
              lessons: homeData.course_1_lessons,
              duration: homeData.course_1_duration,
              category: homeData.course_1_category,
              description: homeData.course_1_description,
              visible: Boolean(homeData.course_1_visible)
            },
            {
              title: homeData.course_2_title,
              rating: homeData.course_2_rating,
              lessons: homeData.course_2_lessons,
              duration: homeData.course_2_duration,
              category: homeData.course_2_category,
              visible: Boolean(homeData.course_2_visible)
            },
            {
              title: homeData.course_3_title,
              rating: homeData.course_3_rating,
              lessons: homeData.course_3_lessons,
              duration: homeData.course_3_duration,
              category: homeData.course_3_category,
              visible: Boolean(homeData.course_3_visible)
            },
            {
              title: homeData.course_4_title,
              rating: homeData.course_4_rating,
              lessons: homeData.course_4_lessons,
              duration: homeData.course_4_duration,
              category: homeData.course_4_category,
              visible: Boolean(homeData.course_4_visible)
            },
            {
              title: homeData.course_5_title,
              rating: homeData.course_5_rating,
              lessons: homeData.course_5_lessons,
              duration: homeData.course_5_duration,
              category: homeData.course_5_category,
              visible: Boolean(homeData.course_5_visible)
            },
            {
              title: homeData.course_6_title,
              rating: homeData.course_6_rating,
              lessons: homeData.course_6_lessons,
              duration: homeData.course_6_duration,
              category: homeData.course_6_category,
              visible: Boolean(homeData.course_6_visible)
            }
          ],
          
          // Individual Testimonials (4 testimonials)
          testimonials: [
            {
              text: homeData.testimonial_1_text,
              author: homeData.testimonial_1_author,
              rating: homeData.testimonial_1_rating,
              visible: Boolean(homeData.testimonial_1_visible)
            },
            {
              text: homeData.testimonial_2_text,
              author: homeData.testimonial_2_author,
              rating: homeData.testimonial_2_rating,
              visible: Boolean(homeData.testimonial_2_visible)
            },
            {
              text: homeData.testimonial_3_text,
              author: homeData.testimonial_3_author,
              rating: homeData.testimonial_3_rating,
              visible: Boolean(homeData.testimonial_3_visible)
            },
            {
              text: homeData.testimonial_4_text,
              author: homeData.testimonial_4_author,
              rating: homeData.testimonial_4_rating,
              visible: Boolean(homeData.testimonial_4_visible)
            }
          ]
        }
      }
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

// COURSES
app.get('/api/courses', async (req, res) => {
  try {
    const data = await queryDatabase(
      'SELECT * FROM courses WHERE published_at IS NOT NULL AND visible = 1 ORDER BY id DESC'
    );
    
    res.json({
      data: data.map(course => ({
        id: course.id,
        attributes: {
          title: course.title,
          description: course.description,
          price: course.price,
          duration: course.duration,
          lessons: course.lessons,
          category: course.category,
          rating: course.rating,
          visible: Boolean(course.visible)
        }
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

// BLOG POSTS
app.get('/api/blog-posts', async (req, res) => {
  try {
    const data = await queryDatabase(
      'SELECT * FROM blog_posts WHERE published_at IS NOT NULL ORDER BY created_at DESC'
    );
    
    res.json({
      data: data.map(post => ({
        id: post.id,
        attributes: {
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          author: post.author,
          category: post.category,
          publishedAt: post.published_at
        }
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

// TEACHERS
app.get('/api/teachers', async (req, res) => {
  try {
    const data = await queryDatabase(
      'SELECT * FROM teachers WHERE published_at IS NOT NULL ORDER BY "order" ASC'
    );
    
    res.json({
      data: data.map(teacher => ({
        id: teacher.id,
        attributes: {
          name: teacher.name,
          role: teacher.role,
          bio: teacher.bio,
          linkedin: teacher.linkedin,
          twitter: teacher.twitter,
          order: teacher.order
        }
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

// FAQs
app.get('/api/faqs', async (req, res) => {
  try {
    // Return empty array for now as FAQs table doesn't exist yet
    res.json({
      data: []
    });
  } catch (error) {
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

// ==================== CRUD OPERATIONS ====================

// UPDATE HOME PAGE
app.put('/api/home-page/:id', async (req, res) => {
  const updates = req.body;
  const updateFields = [];
  
  // Build UPDATE query dynamically
  Object.keys(updates).forEach(key => {
    const dbField = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    updateFields.push(`${dbField} = '${updates[key]}'`);
  });
  
  if (updateFields.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }
  
  try {
    const query = `UPDATE home_pages SET ${updateFields.join(', ')} WHERE id = ${req.params.id}`;
    await queryDatabase(query);
    
    res.json({
      success: true,
      message: 'Home page updated successfully',
      updatedFields: Object.keys(updates)
    });
  } catch (error) {
    res.status(500).json({ error: 'Update failed', details: error.message });
  }
});

// CREATE COURSE
app.post('/api/courses', async (req, res) => {
  const { title, description, price, duration, lessons, category, rating, visible } = req.body;
  
  try {
    const query = `
      INSERT INTO courses (title, description, price, duration, lessons, category, rating, visible, published_at, created_at, updated_at)
      VALUES ('${title}', '${description}', ${price}, '${duration}', '${lessons}', '${category}', '${rating}', ${visible ? 1 : 0}, datetime('now'), datetime('now'), datetime('now'))
    `;
    
    await queryDatabase(query);
    res.json({ success: true, message: 'Course created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Create failed', details: error.message });
  }
});

// UPDATE COURSE
app.put('/api/courses/:id', async (req, res) => {
  const updates = req.body;
  const updateFields = [];
  
  Object.keys(updates).forEach(key => {
    if (typeof updates[key] === 'boolean') {
      updateFields.push(`${key} = ${updates[key] ? 1 : 0}`);
    } else if (typeof updates[key] === 'number') {
      updateFields.push(`${key} = ${updates[key]}`);
    } else {
      updateFields.push(`${key} = '${updates[key]}'`);
    }
  });
  
  try {
    const query = `UPDATE courses SET ${updateFields.join(', ')}, updated_at = datetime('now') WHERE id = ${req.params.id}`;
    await queryDatabase(query);
    
    res.json({ success: true, message: 'Course updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Update failed', details: error.message });
  }
});

// DELETE COURSE
app.delete('/api/courses/:id', async (req, res) => {
  try {
    await queryDatabase(`DELETE FROM courses WHERE id = ${req.params.id}`);
    res.json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Delete failed', details: error.message });
  }
});

// ==================== STATIC FILE SERVING ====================

// Serve admin panel
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'content-admin-comprehensive.html'));
});

// Serve main website
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve static assets for language routes
app.use('/en/js', express.static(path.join(__dirname, 'dist/en/js')));
app.use('/en/css', express.static(path.join(__dirname, 'dist/en/css')));
app.use('/en/images', express.static(path.join(__dirname, 'dist/en/images')));
app.use('/en/fonts', express.static(path.join(__dirname, 'dist/en/fonts')));

app.use('/he/js', express.static(path.join(__dirname, 'dist/he/js')));
app.use('/he/css', express.static(path.join(__dirname, 'dist/he/css')));
app.use('/he/images', express.static(path.join(__dirname, 'dist/he/images')));
app.use('/he/fonts', express.static(path.join(__dirname, 'dist/he/fonts')));

app.use('/ru/js', express.static(path.join(__dirname, 'dist/ru/js')));
app.use('/ru/css', express.static(path.join(__dirname, 'dist/ru/css')));
app.use('/ru/images', express.static(path.join(__dirname, 'dist/ru/images')));
app.use('/ru/fonts', express.static(path.join(__dirname, 'dist/ru/fonts')));

// Serve language-specific routes
app.get('/en', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/en/index.html'));
});

app.get('/he', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/he/index.html'));
});

app.get('/ru', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/ru/index.html'));
});

// Catch-all for language subpages
app.get('/en/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/en/index.html'));
});

app.get('/he/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/he/index.html'));
});

app.get('/ru/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/ru/index.html'));
});

// Serve strapi integration files from root and language paths
app.get('/strapi-home-integration.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'strapi-home-integration.js'));
});

app.get('/strapi-visibility-integration.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'strapi-visibility-integration.js'));
});

app.get('/strapi-content-loader.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'strapi-content-loader.js'));
});

// Also serve from language paths with correct content-type
app.get('/en/strapi-home-integration.js', (req, res) => {
  res.type('application/javascript');
  res.sendFile(path.join(__dirname, 'strapi-home-integration.js'));
});

app.get('/en/strapi-visibility-integration.js', (req, res) => {
  res.type('application/javascript');
  res.sendFile(path.join(__dirname, 'strapi-visibility-integration.js'));
});

app.get('/en/strapi-content-loader.js', (req, res) => {
  res.type('application/javascript');
  res.sendFile(path.join(__dirname, 'strapi-content-loader.js'));
});

app.get('/he/strapi-home-integration.js', (req, res) => {
  res.type('application/javascript');
  res.sendFile(path.join(__dirname, 'strapi-home-integration.js'));
});

app.get('/he/strapi-visibility-integration.js', (req, res) => {
  res.type('application/javascript');
  res.sendFile(path.join(__dirname, 'strapi-visibility-integration.js'));
});

app.get('/he/strapi-content-loader.js', (req, res) => {
  res.type('application/javascript');
  res.sendFile(path.join(__dirname, 'strapi-content-loader.js'));
});

app.get('/ru/strapi-home-integration.js', (req, res) => {
  res.type('application/javascript');
  res.sendFile(path.join(__dirname, 'strapi-home-integration.js'));
});

app.get('/ru/strapi-visibility-integration.js', (req, res) => {
  res.type('application/javascript');
  res.sendFile(path.join(__dirname, 'strapi-visibility-integration.js'));
});

app.get('/ru/strapi-content-loader.js', (req, res) => {
  res.type('application/javascript');
  res.sendFile(path.join(__dirname, 'strapi-content-loader.js'));
});

// Add /api/home-page-live endpoint (alias for /api/home-page)
app.get('/api/home-page-live', async (req, res) => {
  // Use the same logic as /api/home-page
  try {
    const data = await queryDatabase(
      'SELECT * FROM home_pages WHERE published_at IS NOT NULL LIMIT 1'
    );
    
    if (data.length === 0) {
      return res.json({ error: 'No home page data found' });
    }
    
    const homeData = data[0];
    res.json({
      data: {
        id: homeData.id,
        heroTitle: homeData.hero_title,
        heroSubtitle: homeData.hero_subtitle,
        heroDescription: homeData.hero_description,
        heroSectionVisible: Boolean(homeData.hero_section_visible),
        featuredCoursesTitle: homeData.featured_courses_title,
        featuredCoursesDescription: homeData.featured_courses_description,
        featuredCoursesVisible: Boolean(homeData.featured_courses_visible),
        aboutTitle: homeData.about_title,
        aboutSubtitle: homeData.about_subtitle,
        aboutDescription: homeData.about_description,
        aboutVisible: Boolean(homeData.about_visible),
        companiesTitle: homeData.companies_title,
        companiesDescription: homeData.companies_description,
        companiesVisible: Boolean(homeData.companies_visible),
        testimonialsTitle: homeData.testimonials_title,
        testimonialsSubtitle: homeData.testimonials_subtitle,
        testimonialsVisible: Boolean(homeData.testimonials_visible),
        courses: [
          {
            title: homeData.course_1_title,
            rating: homeData.course_1_rating,
            lessons: homeData.course_1_lessons,
            duration: homeData.course_1_duration,
            category: homeData.course_1_category,
            description: homeData.course_1_description,
            visible: Boolean(homeData.course_1_visible)
          },
          {
            title: homeData.course_2_title,
            rating: homeData.course_2_rating,
            lessons: homeData.course_2_lessons,
            duration: homeData.course_2_duration,
            category: homeData.course_2_category,
            visible: Boolean(homeData.course_2_visible)
          },
          {
            title: homeData.course_3_title,
            rating: homeData.course_3_rating,
            lessons: homeData.course_3_lessons,
            duration: homeData.course_3_duration,
            category: homeData.course_3_category,
            visible: Boolean(homeData.course_3_visible)
          },
          {
            title: homeData.course_4_title,
            rating: homeData.course_4_rating,
            lessons: homeData.course_4_lessons,
            duration: homeData.course_4_duration,
            category: homeData.course_4_category,
            visible: Boolean(homeData.course_4_visible)
          },
          {
            title: homeData.course_5_title,
            rating: homeData.course_5_rating,
            lessons: homeData.course_5_lessons,
            duration: homeData.course_5_duration,
            category: homeData.course_5_category,
            visible: Boolean(homeData.course_5_visible)
          },
          {
            title: homeData.course_6_title,
            rating: homeData.course_6_rating,
            lessons: homeData.course_6_lessons,
            duration: homeData.course_6_duration,
            category: homeData.course_6_category,
            visible: Boolean(homeData.course_6_visible)
          }
        ],
        testimonials: [
          {
            text: homeData.testimonial_1_text,
            author: homeData.testimonial_1_author,
            rating: homeData.testimonial_1_rating,
            visible: Boolean(homeData.testimonial_1_visible)
          },
          {
            text: homeData.testimonial_2_text,
            author: homeData.testimonial_2_author,
            rating: homeData.testimonial_2_rating,
            visible: Boolean(homeData.testimonial_2_visible)
          },
          {
            text: homeData.testimonial_3_text,
            author: homeData.testimonial_3_author,
            rating: homeData.testimonial_3_rating,
            visible: Boolean(homeData.testimonial_3_visible)
          },
          {
            text: homeData.testimonial_4_text,
            author: homeData.testimonial_4_author,
            rating: homeData.testimonial_4_rating,
            visible: Boolean(homeData.testimonial_4_visible)
          }
        ]
      }
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

// API Status endpoint
app.get('/api/status', async (req, res) => {
  try {
    const courses = await queryDatabase('SELECT COUNT(*) as count FROM courses WHERE published_at IS NOT NULL');
    const blogs = await queryDatabase('SELECT COUNT(*) as count FROM blog_posts WHERE published_at IS NOT NULL');
    const teachers = await queryDatabase('SELECT COUNT(*) as count FROM teachers WHERE published_at IS NOT NULL');
    const homePage = await queryDatabase('SELECT COUNT(*) as count FROM home_pages WHERE published_at IS NOT NULL');
    
    res.json({
      status: '✅ Operational',
      database: process.env.DATABASE_URL ? '🐘 Railway PostgreSQL' : '📦 SQLite (Local)',
      timestamp: new Date().toISOString(),
      content: {
        homePages: homePage[0]?.count || 0,
        courses: courses[0]?.count || 0,
        blogPosts: blogs[0]?.count || 0,
        teachers: teachers[0]?.count || 0
      },
      deployment: {
        platform: '🚂 Railway',
        environment: process.env.NODE_ENV || 'development',
        port: PORT,
        architecture: 'All-in-one (Frontend + APIs + Database)'
      },
      note: 'Custom Live API workaround for Strapi v5 bug (404 errors)'
    });
  } catch (error) {
    res.status(500).json({ 
      status: '❌ Error', 
      message: error.message,
      tip: 'If database error, PostgreSQL addon may need to be added in Railway dashboard'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║   🚀 AI STUDIO - RAILWAY ALL-IN-ONE        ║
╠════════════════════════════════════════════╣
║   Server: http://localhost:${PORT}          ║
║   Admin:  http://localhost:${PORT}/admin    ║
║   API:    http://localhost:${PORT}/api      ║
╠════════════════════════════════════════════╣
║   Database: ${process.env.DATABASE_URL ? '🐘 Railway PostgreSQL' : '📦 SQLite (Local)'}
║   Environment: ${process.env.NODE_ENV || 'development'}
╠════════════════════════════════════════════╣
║   ✅ Everything in Railway:                ║
║   • Frontend (Static HTML)                 ║
║   • Custom Live APIs                       ║
║   • PostgreSQL Database                    ║
║   • No external dependencies!              ║
╠════════════════════════════════════════════╣
║   Note: Using custom Live API due to       ║
║   Strapi v5 critical bug (404 errors)      ║
╚════════════════════════════════════════════╝
  `);
  
  console.log('📊 Available endpoints:');
  console.log(`   GET  /api/home-page`);
  console.log(`   GET  /api/courses`);
  console.log(`   GET  /api/blog-posts`);
  console.log(`   GET  /api/teachers`);
  console.log(`   GET  /api/status`);
  console.log(`   POST /api/courses`);
  console.log(`   PUT  /api/courses/:id`);
  console.log(`   PUT  /api/home-page/:id`);
  console.log(`   DELETE /api/courses/:id`);
});