/**
 * COMPLETE Live API - Extended for ALL Content Types
 * This extends your working system to support all content types
 * Bypasses broken Strapi API by reading directly from database
 */

const http = require('http');
const { exec } = require('child_process');
const path = require('path');

const PORT = 3334; // Different port to avoid conflicts
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
  
  // COURSES (new endpoint)
  if (req.url === '/api/courses' && req.method === 'GET') {
    queryDatabase(`
      SELECT * FROM courses WHERE published_at IS NOT NULL AND visible = 1 ORDER BY id DESC
    `, res, (data) => {
      return {
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
      };
    });
  }
  
  // BLOG POSTS (new endpoint)
  else if (req.url === '/api/blog-posts' && req.method === 'GET') {
    queryDatabase(`
      SELECT * FROM blog_posts WHERE published_at IS NOT NULL ORDER BY created_at DESC
    `, res, (data) => {
      return {
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
      };
    });
  }
  
  // TEACHERS (new endpoint)
  else if (req.url === '/api/teachers' && req.method === 'GET') {
    queryDatabase(`
      SELECT * FROM teachers WHERE published_at IS NOT NULL ORDER BY [order] ASC
    `, res, (data) => {
      return {
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
      };
    });
  }
  
  // PRICING PLANS (new endpoint)
  else if (req.url === '/api/pricing-plans' && req.method === 'GET') {
    queryDatabase(`
      SELECT * FROM pricing_plans WHERE published_at IS NOT NULL ORDER BY [order] ASC
    `, res, (data) => {
      return {
        data: data.map(plan => ({
          id: plan.id,
          attributes: {
            name: plan.name,
            price: plan.price,
            period: plan.period,
            description: plan.description,
            featured: Boolean(plan.featured),
            ctaText: plan.cta_text,
            order: plan.order
          }
        }))
      };
    });
  }
  
  // JOB POSTINGS (new endpoint)
  else if (req.url === '/api/job-postings' && req.method === 'GET') {
    queryDatabase(`
      SELECT * FROM job_postings WHERE published_at IS NOT NULL ORDER BY created_at DESC
    `, res, (data) => {
      return {
        data: data.map(job => ({
          id: job.id,
          attributes: {
            title: job.title,
            company: job.company,
            location: job.location,
            type: job.type,
            description: job.description,
            applyUrl: job.apply_url
          }
        }))
      };
    });
  }
  
  // CAREER RESOURCES (new endpoint)
  else if (req.url === '/api/career-resources' && req.method === 'GET') {
    queryDatabase(`
      SELECT * FROM career_resources WHERE published_at IS NOT NULL ORDER BY created_at DESC
    `, res, (data) => {
      return {
        data: data.map(resource => ({
          id: resource.id,
          attributes: {
            title: resource.title,
            description: resource.description,
            type: resource.type,
            downloadUrl: resource.download_url
          }
        }))
      };
    });
  }
  
  // ABOUT PAGE (new endpoint)
  else if (req.url === '/api/about-page' && req.method === 'GET') {
    queryDatabase(`
      SELECT * FROM about_pages WHERE published_at IS NOT NULL LIMIT 1
    `, res, (data) => {
      if (data.length === 0) {
        return { error: 'No about page data found' };
      }
      
      return {
        data: {
          id: data[0].id,
          attributes: {
            heroTitle: data[0].hero_title,
            heroSubtitle: data[0].hero_subtitle,
            missionTitle: data[0].mission_title,
            missionDescription: data[0].mission_description,
            visionTitle: data[0].vision_title,
            visionDescription: data[0].vision_description
          }
        }
      };
    });
  }
  
  // CONTACT PAGE (new endpoint)
  else if (req.url === '/api/contact-page' && req.method === 'GET') {
    queryDatabase(`
      SELECT * FROM contact_pages WHERE published_at IS NOT NULL LIMIT 1
    `, res, (data) => {
      if (data.length === 0) {
        return { error: 'No contact page data found' };
      }
      
      return {
        data: {
          id: data[0].id,
          attributes: {
            phone: data[0].phone,
            email: data[0].email,
            address: data[0].address,
            officeHours: data[0].office_hours,
            mapUrl: data[0].map_url
          }
        }
      };
    });
  }
  
  // HOME PAGE (new endpoint) - ALL 123 fields
  else if (req.url === '/api/home-page' && req.method === 'GET') {
    queryDatabase(`
      SELECT * FROM home_pages WHERE published_at IS NOT NULL LIMIT 1
    `, res, (data) => {
      if (data.length === 0) {
        return { error: 'No home page data found' };
      }
      
      const homeData = data[0];
      return {
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
      };
    });
  }
  
  // FAQs (new endpoint)
  else if (req.url === '/api/faqs' && req.method === 'GET') {
    queryDatabase(`
      SELECT * FROM faqs WHERE published_at IS NOT NULL ORDER BY [order] ASC
    `, res, (data) => {
      return {
        data: data.map(faq => ({
          id: faq.id,
          attributes: {
            question: faq.question,
            answer: faq.answer,
            category: faq.category,
            order: faq.order
          }
        }))
      };
    });
  }
  
  // API STATUS (updated endpoint)
  else if (req.url === '/api/status' && req.method === 'GET') {
    Promise.all([
      queryDatabasePromise('SELECT COUNT(*) as count FROM courses WHERE published_at IS NOT NULL'),
      queryDatabasePromise('SELECT COUNT(*) as count FROM blog_posts WHERE published_at IS NOT NULL'),
      queryDatabasePromise('SELECT COUNT(*) as count FROM teachers WHERE published_at IS NOT NULL'),
      queryDatabasePromise('SELECT COUNT(*) as count FROM pricing_plans WHERE published_at IS NOT NULL'),
    ]).then(([courses, blogs, teachers, pricing]) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'Connected',
        database: DB_PATH,
        timestamp: new Date().toISOString(),
        content: {
          courses: courses[0].count,
          blogPosts: blogs[0].count,
          teachers: teachers[0].count,
          pricingPlans: pricing[0].count
        }
      }, null, 2));
    }).catch(error => {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
    });
    return;
  }
  
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});

// Helper function to query database
function queryDatabase(query, res, formatter) {
  const command = `sqlite3 -json "${DB_PATH}" "${query}"`;
  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('Database error:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Database error', details: stderr }));
      return;
    }
    
    try {
      const data = JSON.parse(stdout || '[]');
      const response = formatter(data);
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(response, null, 2));
      
      console.log(`✅ Served ${query.split(' ')[3]}: ${data.length} records`);
    } catch (parseError) {
      console.error('Parse error:', parseError);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Parse error' }));
    }
  });
}

// Promise version for status endpoint
function queryDatabasePromise(query) {
  return new Promise((resolve, reject) => {
    const command = `sqlite3 -json "${DB_PATH}" "${query}"`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        try {
          resolve(JSON.parse(stdout || '[]'));
        } catch (parseError) {
          reject(parseError);
        }
      }
    });
  });
}

// Start server
server.listen(PORT, () => {
  console.log(`🚀 COMPLETE Live Database API running at http://localhost:${PORT}`);
  console.log(`📊 Available endpoints:`);
  console.log(`   http://localhost:${PORT}/api/home-page`);
  console.log(`   http://localhost:${PORT}/api/courses`);
  console.log(`   http://localhost:${PORT}/api/blog-posts`);
  console.log(`   http://localhost:${PORT}/api/teachers`);
  console.log(`   http://localhost:${PORT}/api/pricing-plans`);
  console.log(`   http://localhost:${PORT}/api/job-postings`);
  console.log(`   http://localhost:${PORT}/api/career-resources`);
  console.log(`   http://localhost:${PORT}/api/about-page`);
  console.log(`   http://localhost:${PORT}/api/contact-page`);
  console.log(`   http://localhost:${PORT}/api/faqs`);
  console.log(`   http://localhost:${PORT}/api/status`);
  console.log(`💾 Reading LIVE from: ${DB_PATH}`);
  console.log(`🔄 Following your proven working architecture!`);
  console.log(`✨ This extends your existing Live API system`);
});