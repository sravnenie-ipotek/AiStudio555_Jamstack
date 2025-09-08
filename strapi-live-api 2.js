/**
 * Complete Live API endpoint that reads ALL home page content from Strapi database
 * This version manages EVERY piece of content on the home page
 */

const http = require('http');
const { exec } = require('child_process');
const path = require('path');

const PORT = 3333;
const DB_PATH = path.join(__dirname, 'strapi-fresh/strapi-fresh/strapi-new/.tmp/data.db');

// Create server
const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  if (req.url === '/api/home-page-live' && req.method === 'GET') {
    // Query ALL content fields from database
    const query = `SELECT 
      -- Basic fields
      id, document_id, title, 
      -- Hero Section
      hero_title, hero_subtitle, hero_section_visible,
      -- Featured Courses Section
      featured_courses_title, featured_courses_description, featured_courses_visible,
      -- About Section
      about_title, about_subtitle, about_visible,
      -- Companies Section
      companies_title, companies_description, companies_visible,
      -- Course 1
      course1_title, course1_rating, course1_lessons, course1_duration, course1_category, course1_visible,
      -- Course 2
      course2_title, course2_rating, course2_lessons, course2_duration, course2_category, course2_visible,
      -- Course 3
      course3_title, course3_rating, course3_lessons, course3_duration, course3_category, course3_visible,
      -- Course 4
      course4_title, course4_rating, course4_lessons, course4_duration, course4_category, course4_visible,
      -- Course 5
      course5_title, course5_rating, course5_lessons, course5_duration, course5_category, course5_visible,
      -- Course 6
      course6_title, course6_rating, course6_lessons, course6_duration, course6_category, course6_visible,
      -- Testimonial 1
      testimonial1_text, testimonial1_author, testimonial1_rating, testimonial1_visible,
      -- Testimonial 2
      testimonial2_text, testimonial2_author, testimonial2_rating, testimonial2_visible,
      -- Testimonial 3
      testimonial3_text, testimonial3_author, testimonial3_rating, testimonial3_visible,
      -- Testimonial 4
      testimonial4_text, testimonial4_author, testimonial4_rating, testimonial4_visible,
      -- Testimonials Section
      testimonials_title, testimonials_subtitle, testimonials_visible
      FROM home_pages WHERE id = 1`;
    
    const command = `sqlite3 -json "${DB_PATH}" "${query}"`;
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('Database error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Database error', details: stderr }));
        return;
      }
      
      try {
        const rows = JSON.parse(stdout || '[]');
        
        if (rows.length === 0) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'No data found' }));
          return;
        }
        
        const row = rows[0];
        
        // Format response with ALL content fields
        const response = {
          data: {
            id: row.id,
            documentId: row.document_id,
            title: row.title,
            
            // Hero Section
            heroTitle: row.hero_title,
            heroSubtitle: row.hero_subtitle,
            heroSectionVisible: Boolean(row.hero_section_visible),
            
            // Featured Courses Section
            featuredCoursesTitle: row.featured_courses_title,
            featuredCoursesDescription: row.featured_courses_description,
            featuredCoursesVisible: Boolean(row.featured_courses_visible),
            
            // About Section
            aboutTitle: row.about_title,
            aboutSubtitle: row.about_subtitle,
            aboutVisible: Boolean(row.about_visible),
            
            // Companies Section
            companiesTitle: row.companies_title,
            companiesDescription: row.companies_description,
            companiesVisible: Boolean(row.companies_visible),
            
            // Testimonials Section
            testimonialsTitle: row.testimonials_title,
            testimonialsSubtitle: row.testimonials_subtitle,
            testimonialsVisible: Boolean(row.testimonials_visible),
            
            // Individual Courses
            courses: [
              {
                title: row.course1_title,
                rating: row.course1_rating,
                lessons: row.course1_lessons,
                duration: row.course1_duration,
                category: row.course1_category,
                visible: Boolean(row.course1_visible)
              },
              {
                title: row.course2_title,
                rating: row.course2_rating,
                lessons: row.course2_lessons,
                duration: row.course2_duration,
                category: row.course2_category,
                visible: Boolean(row.course2_visible)
              },
              {
                title: row.course3_title,
                rating: row.course3_rating,
                lessons: row.course3_lessons,
                duration: row.course3_duration,
                category: row.course3_category,
                visible: Boolean(row.course3_visible)
              },
              {
                title: row.course4_title,
                rating: row.course4_rating,
                lessons: row.course4_lessons,
                duration: row.course4_duration,
                category: row.course4_category,
                visible: Boolean(row.course4_visible)
              },
              {
                title: row.course5_title,
                rating: row.course5_rating,
                lessons: row.course5_lessons,
                duration: row.course5_duration,
                category: row.course5_category,
                visible: Boolean(row.course5_visible)
              },
              {
                title: row.course6_title,
                rating: row.course6_rating,
                lessons: row.course6_lessons,
                duration: row.course6_duration,
                category: row.course6_category,
                visible: Boolean(row.course6_visible)
              }
            ],
            
            // Individual Testimonials
            testimonials: [
              {
                text: row.testimonial1_text,
                author: row.testimonial1_author,
                rating: row.testimonial1_rating,
                visible: Boolean(row.testimonial1_visible)
              },
              {
                text: row.testimonial2_text,
                author: row.testimonial2_author,
                rating: row.testimonial2_rating,
                visible: Boolean(row.testimonial2_visible)
              },
              {
                text: row.testimonial3_text,
                author: row.testimonial3_author,
                rating: row.testimonial3_rating,
                visible: Boolean(row.testimonial3_visible)
              },
              {
                text: row.testimonial4_text,
                author: row.testimonial4_author,
                rating: row.testimonial4_rating,
                visible: Boolean(row.testimonial4_visible)
              }
            ]
          },
          meta: {
            source: 'live-database',
            timestamp: new Date().toISOString(),
            totalFields: Object.keys(row).length
          }
        };
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response, null, 2));
        
        // Log visibility statuses for debugging
        console.log(`✅ Served complete home page data:`);
        console.log(`   Hero: ${row.hero_section_visible ? '✅ VISIBLE' : '❌ HIDDEN'}`);
        console.log(`   Courses: ${row.featured_courses_visible ? '✅ VISIBLE' : '❌ HIDDEN'}`);
        console.log(`   Companies: ${row.companies_visible ? '✅ VISIBLE' : '❌ HIDDEN'}`);
        console.log(`   About: ${row.about_visible ? '✅ VISIBLE' : '❌ HIDDEN'}`);
        console.log(`   Testimonials: ${row.testimonials_visible ? '✅ VISIBLE' : '❌ HIDDEN'}`);
        console.log(`   Total fields: ${Object.keys(row).length}`);
      } catch (parseError) {
        console.error('Parse error:', parseError);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Parse error' }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Complete Live Database API running at http://localhost:${PORT}`);
  console.log(`📊 Endpoint: http://localhost:${PORT}/api/home-page-live`);
  console.log(`💾 Reading LIVE from: ${DB_PATH}`);
  console.log(`🔄 This reads ALL home page content directly from Strapi's database!`);
  console.log(`✨ Changes in Strapi admin will be reflected IMMEDIATELY`);
  console.log(`📝 Managing: Hero, Courses (6), Testimonials (4), Companies, About sections`);
});