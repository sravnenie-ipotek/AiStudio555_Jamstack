/**
 * Complete Live API endpoint that reads ALL home page content from Strapi database
 * This version manages EVERY piece of content on the home page
 */

const http = require('http');
const { exec } = require('child_process');
const path = require('path');

const PORT = 3333;
const DB_PATH = path.join(__dirname, 'strapi-fresh/.tmp/data.db');

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
      course_1_title, course_1_rating, course_1_lessons, course_1_duration, course_1_category, course_1_visible,
      -- Course 2
      course_2_title, course_2_rating, course_2_lessons, course_2_duration, course_2_category, course_2_visible,
      -- Course 3
      course_3_title, course_3_rating, course_3_lessons, course_3_duration, course_3_category, course_3_visible,
      -- Course 4
      course_4_title, course_4_rating, course_4_lessons, course_4_duration, course_4_category, course_4_visible,
      -- Course 5
      course_5_title, course_5_rating, course_5_lessons, course_5_duration, course_5_category, course_5_visible,
      -- Course 6
      course_6_title, course_6_rating, course_6_lessons, course_6_duration, course_6_category, course_6_visible,
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
      FROM home_pages WHERE published_at IS NOT NULL ORDER BY id DESC LIMIT 1`;
    
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
                title: row.course_1_title,
                rating: row.course_1_rating,
                lessons: row.course_1_lessons,
                duration: row.course_1_duration,
                category: row.course_1_category,
                visible: Boolean(row.course_1_visible)
              },
              {
                title: row.course_2_title,
                rating: row.course_2_rating,
                lessons: row.course_2_lessons,
                duration: row.course_2_duration,
                category: row.course_2_category,
                visible: Boolean(row.course_2_visible)
              },
              {
                title: row.course_3_title,
                rating: row.course_3_rating,
                lessons: row.course_3_lessons,
                duration: row.course_3_duration,
                category: row.course_3_category,
                visible: Boolean(row.course_3_visible)
              },
              {
                title: row.course_4_title,
                rating: row.course_4_rating,
                lessons: row.course_4_lessons,
                duration: row.course_4_duration,
                category: row.course_4_category,
                visible: Boolean(row.course_4_visible)
              },
              {
                title: row.course_5_title,
                rating: row.course_5_rating,
                lessons: row.course_5_lessons,
                duration: row.course_5_duration,
                category: row.course_5_category,
                visible: Boolean(row.course_5_visible)
              },
              {
                title: row.course_6_title,
                rating: row.course_6_rating,
                lessons: row.course_6_lessons,
                duration: row.course_6_duration,
                category: row.course_6_category,
                visible: Boolean(row.course_6_visible)
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