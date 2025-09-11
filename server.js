/**
 * UNIFIED RAILWAY SERVER
 * All-in-one deployment: Frontend + Custom APIs + PostgreSQL
 * Works around Strapi v5 API bug by using custom Live APIs
 * Database: Railway PostgreSQL (no external dependencies!)
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
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
      
      // Run career orientation migration using simpler approach
      try {
        const migrationPath = path.join(__dirname, 'run-migration-manually.js');
        if (fs.existsSync(migrationPath)) {
          console.log('🔄 Running career orientation migration...');
          const { runMigration } = require('./run-migration-manually');
          await runMigration();
          console.log('✅ Career orientation migration complete');
        }
      } catch (migrationError) {
        console.log('⚠️  Career orientation migration warning:', migrationError.message);
      }
      
      // Check if database has data
      const homeCount = await queryDatabase('SELECT COUNT(*) as count FROM home_pages');
      if (homeCount[0].count === 0 || homeCount[0].count === '0') {
        console.log('📝 Database is empty, seeding initial data...');
        const { seedDatabase } = require('./seed-initial-data');
        await seedDatabase();
        console.log('✅ Initial data seeded successfully!');
      } else {
        console.log('📊 Database already has data');
      }
    } catch (error) {
      console.error('⚠️  Migration error (may already be migrated):', error.message);
    }
  }
}

// Initialize database on startup
initializeDatabase();

// ==================== MULTI-LANGUAGE HELPERS ====================

// Helper function to get locale from request
function getLocale(req) {
  // Priority: 1. Query param, 2. Path param, 3. Header, 4. Default
  const locale = req.query.locale || 
                 req.params.locale || 
                 req.headers['accept-language']?.split('-')[0] || 
                 'en';
  
  const validLocales = ['en', 'ru', 'he'];
  return validLocales.includes(locale) ? locale : 'en';
}

// Helper function for locale fallback queries
async function queryWithFallback(query, params) {
  let result = await queryDatabase(query, params);
  
  // If no result and not English, fallback to English
  if ((!result || result.length === 0) && params[0] !== 'en') {
    const fallbackParams = ['en', ...params.slice(1)];
    result = await queryDatabase(query, fallbackParams);
  }
  
  return result;
}

// ==================== LIVE API ENDPOINTS ====================

// HOME PAGE - ALL 123 fields (with locale support)
app.get('/api/home-page', async (req, res) => {
  try {
    const locale = getLocale(req);
    console.log(`🌍 Fetching home page for locale: ${locale}`);
    
    const data = await queryWithFallback(
      'SELECT * FROM home_pages WHERE locale = $1 AND published_at IS NOT NULL LIMIT 1',
      [locale]
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

// COURSES (with locale support)
app.get('/api/courses', async (req, res) => {
  try {
    const locale = getLocale(req);
    console.log(`🌍 Fetching courses for locale: ${locale}`);
    
    const data = await queryWithFallback(
      'SELECT * FROM courses WHERE locale = $1 AND published_at IS NOT NULL AND visible = true ORDER BY id DESC',
      [locale]
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

// COURSES PAGE (alias for /api/courses with page-specific format)
app.get('/api/courses-page', async (req, res) => {
  try {
    const locale = getLocale(req);
    console.log(`🌍 Fetching courses page for locale: ${locale}`);
    
    const data = await queryWithFallback(
      'SELECT * FROM courses WHERE locale = $1 AND published_at IS NOT NULL AND visible = true ORDER BY id DESC',
      [locale]
    );
    
    res.json({
      data: {
        id: 1,
        attributes: {
          courses: data.map(course => ({
            id: course.id,
            title: course.title,
            description: course.description,
            price: course.price,
            duration: course.duration,
            lessons: course.lessons,
            category: course.category,
            rating: course.rating,
            visible: Boolean(course.visible)
          }))
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

// BLOG POSTS (with locale support)
app.get('/api/blog-posts', async (req, res) => {
  try {
    const locale = getLocale(req);
    console.log(`🌍 Fetching blog posts for locale: ${locale}`);
    
    const data = await queryWithFallback(
      'SELECT * FROM blog_posts WHERE locale = $1 AND published_at IS NOT NULL ORDER BY created_at DESC',
      [locale]
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

// TEACHERS (with locale support)
app.get('/api/teachers', async (req, res) => {
  try {
    const locale = getLocale(req);
    console.log(`🌍 Fetching teachers for locale: ${locale}`);
    
    const data = await queryWithFallback(
      'SELECT * FROM teachers WHERE locale = $1 AND published_at IS NOT NULL ORDER BY "order" ASC',
      [locale]
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

// FAQs (with locale support)
app.get('/api/faqs', async (req, res) => {
  try {
    const locale = getLocale(req);
    console.log(`🌍 Fetching FAQs for locale: ${locale}`);
    
    const data = await queryWithFallback(
      'SELECT * FROM faqs WHERE locale = $1 AND published_at IS NOT NULL ORDER BY "order" ASC',
      [locale]
    );
    
    res.json({
      data: data.map(faq => ({
        id: faq.id,
        attributes: {
          question: faq.question,
          answer: faq.answer,
          category: faq.category,
          order: faq.order
        }
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

// ABOUT PAGE (with locale support)
app.get('/api/about-page', async (req, res) => {
  try {
    const locale = getLocale(req);
    console.log(`🌍 Fetching about page for locale: ${locale}`);
    
    const data = await queryWithFallback(
      'SELECT * FROM about_pages WHERE locale = $1 AND published_at IS NOT NULL LIMIT 1',
      [locale]
    );
    
    if (data.length === 0) {
      return res.json({
        data: {
          id: 1,
          attributes: {
            heroTitle: '',
            heroSubtitle: '',
            missionTitle: '',
            missionDescription: '',
            visionTitle: '',
            visionDescription: ''
          }
        }
      });
    }
    
    const about = data[0];
    res.json({
      data: {
        id: about.id,
        attributes: {
          heroTitle: about.hero_title || '',
          heroSubtitle: about.hero_subtitle || '',
          missionTitle: about.mission_title || '',
          missionDescription: about.mission_description || '',
          visionTitle: about.vision_title || '',
          visionDescription: about.vision_description || ''
        }
      }
    });
  } catch (error) {
    console.error('About page error:', error);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

// CAREER RESOURCES (with locale support)
app.get('/api/career-resources', async (req, res) => {
  try {
    const locale = getLocale(req);
    console.log(`🌍 Fetching career resources for locale: ${locale}`);
    
    const data = await queryWithFallback(
      'SELECT * FROM career_resources WHERE locale = $1 AND published_at IS NOT NULL ORDER BY created_at DESC',
      [locale]
    );
    
    res.json({
      data: data.map(resource => ({
        id: resource.id,
        attributes: {
          title: resource.title,
          description: resource.description,
          type: resource.type,
          downloadUrl: resource.download_url,
          category: resource.category,
          visible: Boolean(resource.visible)
        }
      }))
    });
  } catch (error) {
    console.error('Career resources error:', error);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

// CAREER ORIENTATION - Frontend endpoint (what the website expects)
app.get('/api/career-orientation', async (req, res) => {
  try {
    const locale = getLocale(req);
    console.log(`🌍 Fetching career orientation for website, locale: ${locale}`);
    
    // Get data from the database
    const result = await queryWithFallback(
      'SELECT * FROM career_orientation_pages WHERE locale = $1 LIMIT 1',
      [locale]
    );
    
    if (result && result.length > 0) {
      const data = result[0];
      
      // Return in the format the frontend expects
      res.json({
        hero: {
          title: data.hero_main_title || data.hero_title || 'Career Path',
          subtitle: data.hero_subtitle || 'Find Your Path',
          description: data.hero_description || '',
          stats: [
            {
              number: data.hero_stat1_value || data.hero_stat1_number || '500+',
              label: data.hero_stat1_label || 'Career Paths Mapped'
            },
            {
              number: data.hero_stat2_value || data.hero_stat2_number || '15+',
              label: data.hero_stat2_label || 'AI Specializations'
            },
            {
              number: data.hero_stat3_value || data.hero_stat3_number || '95%',
              label: data.hero_stat3_label || 'Success Rate'
            }
          ]
        },
        problems: {
          title: data.problems_main_title || 'Common Career Challenges',
          subtitle: data.problems_subtitle || '',
          items: [
            {
              icon: data.problem1_icon || '',
              title: data.problem1_title || '',
              description: data.problem1_description || '',
              stat: data.problem1_stat || '',
              statLabel: data.problem1_stat_label || ''
            },
            {
              icon: data.problem2_icon || '',
              title: data.problem2_title || '',
              description: data.problem2_description || '',
              stat: data.problem2_stat || '',
              statLabel: data.problem2_stat_label || ''
            }
          ]
        },
        solutions: {
          title: data.solutions_main_title || 'Our Solutions',
          subtitle: data.solutions_subtitle || '',
          items: [
            {
              icon: data.solution1_icon || '',
              title: data.solution1_title || '',
              description: data.solution1_description || '',
              features: [
                data.solution1_feature1 || '',
                data.solution1_feature2 || '',
                data.solution1_feature3 || '',
                data.solution1_feature4 || ''
              ].filter(f => f),
              benefit: data.solution1_benefit || ''
            }
          ]
        },
        process: {
          title: data.process_main_title || data.process_title || 'Our Process',
          subtitle: data.process_subtitle || '',
          steps: [
            {
              title: data.process_step1_title || '',
              description: data.process_step1_description || '',
              duration: data.process_step1_duration || ''
            },
            {
              title: data.process_step2_title || '',
              description: data.process_step2_description || '',
              duration: data.process_step2_duration || ''
            },
            {
              title: data.process_step3_title || '',
              description: data.process_step3_description || '',
              duration: data.process_step3_duration || ''
            }
          ].filter(s => s.title)
        },
        careerPaths: {
          title: data.career_paths_main_title || 'Career Paths',
          subtitle: data.career_paths_subtitle || '',
          paths: [
            {
              title: data.career_path1_title || '',
              description: data.career_path1_description || '',
              salaryRange: data.career_path1_salary_range || '',
              growthRate: data.career_path1_growth_rate || '',
              topSkills: data.career_path1_top_skills || ''
            }
          ].filter(p => p.title)
        },
        expert: {
          name: data.expert_name || '',
          title: data.expert_title || '',
          credentials: data.expert_credentials || '',
          description: data.expert_description || '',
          quote: data.expert_quote || ''
        },
        partners: {
          title: data.partners_main_title || data.partners_title || 'Our Partners',
          subtitle: data.partners_subtitle || '',
          items: [
            {
              name: data.partner1_name || '',
              description: data.partner1_description || ''
            },
            {
              name: data.partner2_name || '',
              description: data.partner2_description || ''
            },
            {
              name: data.partner3_name || '',
              description: data.partner3_description || ''
            }
          ].filter(p => p.name)
        }
      });
    } else {
      // Return default data if no database entry
      res.json({
        hero: {
          title: 'Career Path',
          subtitle: 'Find Your Path in AI',
          description: 'Discover your ideal career in artificial intelligence',
          stats: [
            { number: '500+', label: 'Career Paths' },
            { number: '15+', label: 'Specializations' },
            { number: '95%', label: 'Success Rate' }
          ]
        }
      });
    }
  } catch (error) {
    console.error('Error fetching career orientation:', error);
    res.status(500).json({ error: 'Failed to fetch career orientation data' });
  }
});

// CAREER CENTER - Frontend endpoint (what the website expects)
app.get('/api/career-center', async (req, res) => {
  try {
    const locale = getLocale(req);
    console.log(`🌍 Fetching career center for website, locale: ${locale}`);
    
    // Get data from the database
    const result = await queryWithFallback(
      'SELECT * FROM career_center_pages WHERE locale = $1 LIMIT 1',
      [locale]
    );
    
    if (result && result.length > 0) {
      const data = result[0];
      
      // Return in the format the frontend expects
      res.json({
        hero: {
          title: data.hero_main_title || data.hero_title || 'Career Center',
          subtitle: data.hero_subtitle || 'Your Career Success Hub',
          description: data.hero_description || '',
          stats: [
            {
              number: data.hero_stat1_value || data.hero_stat1_number || '92%',
              label: data.hero_stat1_label || 'Job Placement Rate'
            },
            {
              number: data.hero_stat2_value || data.hero_stat2_number || '$85K',
              label: data.hero_stat2_label || 'Average Starting Salary'
            },
            {
              number: data.hero_stat3_value || data.hero_stat3_number || '200+',
              label: data.hero_stat3_label || 'Partner Companies'
            }
          ]
        },
        services: {
          title: data.services_main_title || data.services_title || 'Career Services',
          subtitle: data.services_subtitle || '',
          items: [
            {
              icon: data.service1_icon || '',
              title: data.service1_title || '',
              description: data.service1_description || ''
            },
            {
              icon: data.service2_icon || '',
              title: data.service2_title || '',
              description: data.service2_description || ''
            },
            {
              icon: data.service3_icon || '',
              title: data.service3_title || '',
              description: data.service3_description || ''
            }
          ].filter(s => s.title)
        },
        advantages: {
          title: data.advantages_main_title || data.advantages_title || 'Why Choose Us',
          items: [
            {
              title: data.advantage1_title || '',
              description: data.advantage1_description || ''
            },
            {
              title: data.advantage2_title || '',
              description: data.advantage2_description || ''
            },
            {
              title: data.advantage3_title || '',
              description: data.advantage3_description || ''
            }
          ].filter(a => a.title)
        },
        metrics: {
          title: data.metrics_title || 'Our Impact',
          items: [
            {
              number: data.metric1_number || '',
              label: data.metric1_label || ''
            },
            {
              number: data.metric2_number || '',
              label: data.metric2_label || ''
            },
            {
              number: data.metric3_number || '',
              label: data.metric3_label || ''
            },
            {
              number: data.metric4_number || '',
              label: data.metric4_label || ''
            }
          ].filter(m => m.number)
        }
      });
    } else {
      // Return default data if no database entry
      res.json({
        hero: {
          title: 'Career Center',
          subtitle: 'Your Career Success Hub',
          description: 'Professional career services for tech professionals',
          stats: [
            { number: '92%', label: 'Job Placement' },
            { number: '$85K', label: 'Avg Salary' },
            { number: '200+', label: 'Companies' }
          ]
        }
      });
    }
  } catch (error) {
    console.error('Error fetching career center:', error);
    res.status(500).json({ error: 'Failed to fetch career center data' });
  }
});

// CAREER ORIENTATION PAGE (comprehensive 215+ fields with locale support)
app.get('/api/career-orientation-page', async (req, res) => {
  try {
    const locale = getLocale(req);
    console.log(`🌍 Fetching career orientation page (215+ fields) for locale: ${locale}`);
    
    const pageData = await queryWithFallback(
      'SELECT * FROM career_orientation_pages WHERE locale = $1 AND published_at IS NOT NULL LIMIT 1',
      [locale]
    );
    
    if (pageData.length === 0) {
      return res.json({
        data: {
          id: 1,
          attributes: {
            // Hero Section (18 fields)
            heroMainTitle: 'AI Career Orientation Program',
            heroSubtitle: 'Discover Your Perfect AI Career Path',
            heroDescription: 'Advanced AI-powered assessment to match you with the ideal AI career',
            heroStat1Value: '500+',
            heroStat1Label: 'Career Paths Mapped',
            heroStat2Value: '95%', 
            heroStat2Label: 'Success Rate',
            heroStat3Value: '15+',
            heroStat3Label: 'AI Specializations',
            heroCtaText: 'Start Your Journey',
            heroCtaLink: '#assessment',
            heroVideoUrl: '',
            heroImageAlt: 'AI Career Path Discovery',
            heroBadgeText: 'Free Assessment',
            heroTrustSignals: 'Trusted by 500+ professionals',
            heroVisible: true,
            
            // Problems Section (27 fields)
            problemsMainTitle: 'Common Career Challenges in AI',
            problemsSubtitle: 'We understand the struggles of finding your path',
            problemsDescription: 'Many professionals face these challenges when entering AI',
            
            problem1Icon: 'confusion',
            problem1Title: 'Career Confusion',
            problem1Description: 'Too many AI specializations to choose from',
            problem1Stat: '73%',
            problem1StatLabel: 'feel overwhelmed by choices',
            
            problem2Icon: 'skills-gap',
            problem2Title: 'Skills Gap Uncertainty',
            problem2Description: 'Not sure which skills to develop first',
            problem2Stat: '68%', 
            problem2StatLabel: 'struggle with skill prioritization',
            
            problem3Icon: 'market-knowledge',
            problem3Title: 'Market Knowledge Gap',
            problem3Description: 'Lack of understanding about AI job market',
            problem3Stat: '81%',
            problem3StatLabel: 'need market guidance',
            
            problem4Icon: 'career-planning',
            problem4Title: 'No Clear Path',
            problem4Description: 'Missing structured career development plan',
            problem4Stat: '79%',
            problem4StatLabel: 'lack clear direction',
            
            problemsVisible: true,
            
            // Solutions Section (30 fields)
            solutionsMainTitle: 'Our Comprehensive Career Solutions',
            solutionsSubtitle: 'Everything you need for AI career success',
            solutionsDescription: 'Comprehensive tools and guidance for your AI career journey',
            
            solution1Icon: 'ai-assessment',
            solution1Title: 'AI-Powered Assessment',
            solution1Description: 'Advanced algorithm matches you with perfect AI career paths',
            solution1Feature1: 'Personality analysis',
            solution1Feature2: 'Skills evaluation', 
            solution1Feature3: 'Interest mapping',
            solution1Feature4: 'Market alignment',
            solution1Benefit: 'Find your perfect fit in minutes',
            
            solution2Icon: 'personalized-roadmap',
            solution2Title: 'Personalized Career Roadmap',
            solution2Description: 'Custom learning path tailored to your goals and timeline',
            solution2Feature1: 'Step-by-step guidance',
            solution2Feature2: 'Skill development plan',
            solution2Feature3: 'Timeline optimization',
            solution2Feature4: 'Progress tracking',
            solution2Benefit: 'Accelerate your learning by 3x',
            
            solution3Icon: 'expert-mentorship',
            solution3Title: 'Expert Mentorship',
            solution3Description: 'Direct access to AI industry professionals and career coaches',
            solution3Feature1: '1-on-1 sessions',
            solution3Feature2: 'Industry insights',
            solution3Feature3: 'Career planning',
            solution3Feature4: 'Network building',
            solution3Benefit: 'Get insider knowledge and guidance',
            
            solutionsVisible: true,
            
            // Process Section (32 fields)
            processMainTitle: 'Your 5-Step Career Discovery Journey',
            processSubtitle: 'Systematic approach to finding your AI career path',
            processDescription: 'Our proven methodology used by 500+ successful professionals',
            
            processStep1Number: '01',
            processStep1Title: 'Assessment',
            processStep1Description: 'Complete comprehensive career assessment',
            processStep1Duration: '15 minutes',
            processStep1Icon: 'assessment-icon',
            processStep1Details: 'Answer questions about skills, interests, and goals',
            
            processStep2Number: '02',
            processStep2Title: 'Analysis',
            processStep2Description: 'AI analyzes your responses and market data',
            processStep2Duration: '2 minutes',
            processStep2Icon: 'analysis-icon',
            processStep2Details: 'Advanced algorithms process your profile',
            
            processStep3Number: '03',
            processStep3Title: 'Recommendations',
            processStep3Description: 'Receive personalized career path recommendations',
            processStep3Duration: '5 minutes',
            processStep3Icon: 'recommendations-icon',
            processStep3Details: 'Get top 3 AI career matches with detailed insights',
            
            processStep4Number: '04',
            processStep4Title: 'Roadmap',
            processStep4Description: 'Get detailed learning and career roadmap',
            processStep4Duration: '10 minutes',
            processStep4Icon: 'roadmap-icon',
            processStep4Details: 'Step-by-step plan with timeline and resources',
            
            processStep5Number: '05',
            processStep5Title: 'Action',
            processStep5Description: 'Start your AI career journey with confidence',
            processStep5Duration: 'Ongoing',
            processStep5Icon: 'action-icon',
            processStep5Details: 'Access resources, mentorship, and community support',
            
            processVisible: true,
            
            // Career Paths Section (42 fields)
            careerPathsMainTitle: 'AI Career Paths We Cover',
            careerPathsSubtitle: 'Explore diverse opportunities in artificial intelligence',
            careerPathsDescription: '15+ specialized AI career paths with detailed guidance',
            
            careerPath1Title: 'Machine Learning Engineer',
            careerPath1Description: 'Build and deploy ML models at scale',
            careerPath1SalaryRange: '$120K - $200K',
            careerPath1GrowthRate: '22% annually',
            careerPath1TopSkills: 'Python, TensorFlow, AWS',
            careerPath1Companies: 'Google, Meta, Netflix',
            careerPath1Icon: 'ml-engineer-icon',
            
            careerPath2Title: 'Data Scientist',
            careerPath2Description: 'Extract insights from complex datasets',
            careerPath2SalaryRange: '$110K - $180K',
            careerPath2GrowthRate: '19% annually',
            careerPath2TopSkills: 'Python, Statistics, SQL',
            careerPath2Companies: 'Microsoft, Amazon, Airbnb',
            careerPath2Icon: 'data-scientist-icon',
            
            careerPath3Title: 'AI Product Manager',
            careerPath3Description: 'Lead AI product development and strategy',
            careerPath3SalaryRange: '$140K - $220K',
            careerPath3GrowthRate: '15% annually',
            careerPath3TopSkills: 'Strategy, Analytics, Leadership',
            careerPath3Companies: 'Tesla, OpenAI, Uber',
            careerPath3Icon: 'ai-pm-icon',
            
            careerPath4Title: 'Computer Vision Engineer',
            careerPath4Description: 'Develop systems that understand visual data',
            careerPath4SalaryRange: '$130K - $210K',
            careerPath4GrowthRate: '25% annually',
            careerPath4TopSkills: 'OpenCV, PyTorch, C++',
            careerPath4Companies: 'Apple, NVIDIA, Tesla',
            careerPath4Icon: 'cv-engineer-icon',
            
            careerPath5Title: 'NLP Engineer', 
            careerPath5Description: 'Build systems that understand human language',
            careerPath5SalaryRange: '$125K - $200K',
            careerPath5GrowthRate: '30% annually',
            careerPath5TopSkills: 'NLP, Transformers, Python',
            careerPath5Companies: 'OpenAI, Google, Anthropic',
            careerPath5Icon: 'nlp-engineer-icon',
            
            careerPath6Title: 'AI Research Scientist',
            careerPath6Description: 'Advance the field through cutting-edge research',
            careerPath6SalaryRange: '$150K - $300K',
            careerPath6GrowthRate: '18% annually',
            careerPath6TopSkills: 'Research, Mathematics, Publications',
            careerPath6Companies: 'DeepMind, OpenAI, MIT',
            careerPath6Icon: 'ai-researcher-icon',
            
            careerPathsVisible: true,
            
            // Expert Section (15 fields)
            expertName: 'Dr. Sarah Chen',
            expertTitle: 'Senior AI Career Advisor',
            expertCredentials: 'PhD in Computer Science, Former Google AI Lead',
            expertYearsExperience: '12+ years',
            expertDescription: 'Leading expert in AI career development with track record of guiding 500+ professionals',
            expertAchievement1: 'Former Head of ML at Google',
            expertAchievement2: '50+ published research papers',
            expertAchievement3: 'Advised 500+ career transitions',
            expertAchievement4: 'TEDx speaker on AI careers',
            expertQuote: 'The key to AI career success is finding the intersection of your strengths, interests, and market demand.',
            expertImage: '/images/expert-sarah-chen.jpg',
            expertLinkedin: 'https://linkedin.com/in/sarahchen-ai',
            expertTwitter: 'https://twitter.com/sarahchen_ai',
            expertVideoUrl: 'https://youtube.com/watch?v=career-advice',
            expertVisible: true,
            
            // Partners Section (21 fields)
            partnersMainTitle: 'Trusted by Leading AI Companies',
            partnersSubtitle: 'Our career guidance is endorsed by top tech companies',
            partnersDescription: 'Partners who trust our career development programs',
            
            partner1Name: 'Google',
            partner1Logo: '/images/partners/google-logo.png',
            partner1Description: 'AI Research and Engineering roles',
            
            partner2Name: 'Microsoft',
            partner2Logo: '/images/partners/microsoft-logo.png',
            partner2Description: 'Azure AI and Cognitive Services',
            
            partner3Name: 'OpenAI',
            partner3Logo: '/images/partners/openai-logo.png',
            partner3Description: 'Advanced AI Research positions',
            
            partner4Name: 'Meta',
            partner4Logo: '/images/partners/meta-logo.png',
            partner4Description: 'AI/ML Infrastructure roles',
            
            partner5Name: 'Amazon',
            partner5Logo: '/images/partners/amazon-logo.png',
            partner5Description: 'AWS AI Services team',
            
            partner6Name: 'NVIDIA',
            partner6Logo: '/images/partners/nvidia-logo.png',
            partner6Description: 'GPU Computing and AI Hardware',
            
            partnersVisible: true,
            
            // Assessment Section (23 fields)
            assessmentMainTitle: 'Free AI Career Assessment',
            assessmentSubtitle: 'Discover your perfect AI career path in 15 minutes',
            assessmentDescription: 'Comprehensive evaluation of your skills, interests, and career goals',
            
            assessmentBenefit1: 'Personalized career recommendations',
            assessmentBenefit2: 'Detailed skills gap analysis',
            assessmentBenefit3: 'Custom learning roadmap',
            assessmentBenefit4: 'Salary expectations by role',
            assessmentBenefit5: 'Market demand insights',
            
            assessmentQuestion1: 'What is your current technical background?',
            assessmentQuestion2: 'Which AI applications interest you most?',
            assessmentQuestion3: 'What is your preferred work environment?',
            assessmentQuestion4: 'How do you prefer to learn new skills?',
            assessmentQuestion5: 'What are your career timeline goals?',
            
            assessmentCtaText: 'Start Free Assessment',
            assessmentCtaSubtext: 'No registration required • Takes 15 minutes • Instant results',
            assessmentPrivacyText: 'Your data is secure and never shared',
            assessmentTestimonial: 'This assessment changed my career trajectory completely!',
            assessmentTestimonialAuthor: 'Jennifer Kim, ML Engineer at Tesla',
            
            assessmentFormId: 'career-assessment-form',
            assessmentSubmitUrl: '/api/career-assessment',
            assessmentVisible: true,
            
            // Footer Section (7 fields)
            footerTitle: 'Ready to Transform Your Career?',
            footerSubtitle: 'Join thousands of professionals who found their AI career path',
            footerCtaText: 'Get Started Now',
            footerCtaLink: '#assessment',
            footerSupportText: 'Questions? Contact our career advisors',
            footerSupportEmail: 'careers@aistudio555.com',
            footerVisible: true
          }
        }
      });
    }
    
    const page = pageData[0];
    res.json({
      data: {
        id: page.id,
        attributes: {
          // Hero Section (18 fields)
          heroMainTitle: page.hero_main_title || 'AI Career Orientation Program',
          heroSubtitle: page.hero_subtitle || 'Discover Your Perfect AI Career Path',
          heroDescription: page.hero_description || 'Advanced AI-powered assessment to match you with the ideal AI career',
          heroStat1Value: page.hero_stat_1_value || '500+',
          heroStat1Label: page.hero_stat_1_label || 'Career Paths Mapped',
          heroStat2Value: page.hero_stat_2_value || '95%',
          heroStat2Label: page.hero_stat_2_label || 'Success Rate',
          heroStat3Value: page.hero_stat_3_value || '15+',
          heroStat3Label: page.hero_stat_3_label || 'AI Specializations',
          heroCtaText: page.hero_cta_text || 'Start Your Journey',
          heroCtaLink: page.hero_cta_link || '#assessment',
          heroVideoUrl: page.hero_video_url || '',
          heroImageAlt: page.hero_image_alt || 'AI Career Path Discovery',
          heroBadgeText: page.hero_badge_text || 'Free Assessment',
          heroTrustSignals: page.hero_trust_signals || 'Trusted by 500+ professionals',
          heroBackgroundColor: page.hero_background_color || '#1a1a2e',
          heroTextColor: page.hero_text_color || '#ffffff',
          heroVisible: Boolean(page.hero_visible),

          // Problems Section (27 fields)
          problemsMainTitle: page.problems_main_title || 'Common Career Challenges in AI',
          problemsSubtitle: page.problems_subtitle || 'We understand the struggles of finding your path',
          problemsDescription: page.problems_description || 'Many professionals face these challenges when entering AI',
          
          problem1Icon: page.problem_1_icon || 'confusion',
          problem1Title: page.problem_1_title || 'Career Confusion',
          problem1Description: page.problem_1_description || 'Too many AI specializations to choose from',
          problem1Stat: page.problem_1_stat || '73%',
          problem1StatLabel: page.problem_1_stat_label || 'feel overwhelmed by choices',
          
          problem2Icon: page.problem_2_icon || 'skills-gap',
          problem2Title: page.problem_2_title || 'Skills Gap Uncertainty',
          problem2Description: page.problem_2_description || 'Not sure which skills to develop first',
          problem2Stat: page.problem_2_stat || '68%',
          problem2StatLabel: page.problem_2_stat_label || 'struggle with skill prioritization',
          
          problem3Icon: page.problem_3_icon || 'market-knowledge',
          problem3Title: page.problem_3_title || 'Market Knowledge Gap',
          problem3Description: page.problem_3_description || 'Lack of understanding about AI job market',
          problem3Stat: page.problem_3_stat || '81%',
          problem3StatLabel: page.problem_3_stat_label || 'need market guidance',
          
          problem4Icon: page.problem_4_icon || 'career-planning',
          problem4Title: page.problem_4_title || 'No Clear Path',
          problem4Description: page.problem_4_description || 'Missing structured career development plan',
          problem4Stat: page.problem_4_stat || '79%',
          problem4StatLabel: page.problem_4_stat_label || 'lack clear direction',
          
          problemsBackgroundColor: page.problems_background_color || '#f8f9fa',
          problemsTextColor: page.problems_text_color || '#333333',
          problemsVisible: Boolean(page.problems_visible),

          // Solutions Section (30 fields)
          solutionsMainTitle: page.solutions_main_title || 'Our Comprehensive Career Solutions',
          solutionsSubtitle: page.solutions_subtitle || 'Everything you need for AI career success',
          solutionsDescription: page.solutions_description || 'Comprehensive tools and guidance for your AI career journey',
          
          solution1Icon: page.solution_1_icon || 'ai-assessment',
          solution1Title: page.solution_1_title || 'AI-Powered Assessment',
          solution1Description: page.solution_1_description || 'Advanced algorithm matches you with perfect AI career paths',
          solution1Feature1: page.solution_1_feature_1 || 'Personality analysis',
          solution1Feature2: page.solution_1_feature_2 || 'Skills evaluation',
          solution1Feature3: page.solution_1_feature_3 || 'Interest mapping',
          solution1Feature4: page.solution_1_feature_4 || 'Market alignment',
          solution1Benefit: page.solution_1_benefit || 'Find your perfect fit in minutes',
          
          solution2Icon: page.solution_2_icon || 'personalized-roadmap',
          solution2Title: page.solution_2_title || 'Personalized Career Roadmap',
          solution2Description: page.solution_2_description || 'Custom learning path tailored to your goals and timeline',
          solution2Feature1: page.solution_2_feature_1 || 'Step-by-step guidance',
          solution2Feature2: page.solution_2_feature_2 || 'Skill development plan',
          solution2Feature3: page.solution_2_feature_3 || 'Timeline optimization',
          solution2Feature4: page.solution_2_feature_4 || 'Progress tracking',
          solution2Benefit: page.solution_2_benefit || 'Accelerate your learning by 3x',
          
          solution3Icon: page.solution_3_icon || 'expert-mentorship',
          solution3Title: page.solution_3_title || 'Expert Mentorship',
          solution3Description: page.solution_3_description || 'Direct access to AI industry professionals and career coaches',
          solution3Feature1: page.solution_3_feature_1 || '1-on-1 sessions',
          solution3Feature2: page.solution_3_feature_2 || 'Industry insights',
          solution3Feature3: page.solution_3_feature_3 || 'Career planning',
          solution3Feature4: page.solution_3_feature_4 || 'Network building',
          solution3Benefit: page.solution_3_benefit || 'Get insider knowledge and guidance',
          
          solutionsBackgroundColor: page.solutions_background_color || '#ffffff',
          solutionsTextColor: page.solutions_text_color || '#333333',
          solutionsVisible: Boolean(page.solutions_visible),

          // Process Section (32 fields)
          processMainTitle: page.process_main_title || 'Your 5-Step Career Discovery Journey',
          processSubtitle: page.process_subtitle || 'Systematic approach to finding your AI career path',
          processDescription: page.process_description || 'Our proven methodology used by 500+ successful professionals',
          
          processStep1Number: page.process_step_1_number || '01',
          processStep1Title: page.process_step_1_title || 'Assessment',
          processStep1Description: page.process_step_1_description || 'Complete comprehensive career assessment',
          processStep1Duration: page.process_step_1_duration || '15 minutes',
          processStep1Icon: page.process_step_1_icon || 'assessment-icon',
          processStep1Details: page.process_step_1_details || 'Answer questions about skills, interests, and goals',
          
          processStep2Number: page.process_step_2_number || '02',
          processStep2Title: page.process_step_2_title || 'Analysis',
          processStep2Description: page.process_step_2_description || 'AI analyzes your responses and market data',
          processStep2Duration: page.process_step_2_duration || '2 minutes',
          processStep2Icon: page.process_step_2_icon || 'analysis-icon',
          processStep2Details: page.process_step_2_details || 'Advanced algorithms process your profile',
          
          processStep3Number: page.process_step_3_number || '03',
          processStep3Title: page.process_step_3_title || 'Recommendations',
          processStep3Description: page.process_step_3_description || 'Receive personalized career path recommendations',
          processStep3Duration: page.process_step_3_duration || '5 minutes',
          processStep3Icon: page.process_step_3_icon || 'recommendations-icon',
          processStep3Details: page.process_step_3_details || 'Get top 3 AI career matches with detailed insights',
          
          processStep4Number: page.process_step_4_number || '04',
          processStep4Title: page.process_step_4_title || 'Roadmap',
          processStep4Description: page.process_step_4_description || 'Get detailed learning and career roadmap',
          processStep4Duration: page.process_step_4_duration || '10 minutes',
          processStep4Icon: page.process_step_4_icon || 'roadmap-icon',
          processStep4Details: page.process_step_4_details || 'Step-by-step plan with timeline and resources',
          
          processStep5Number: page.process_step_5_number || '05',
          processStep5Title: page.process_step_5_title || 'Action',
          processStep5Description: page.process_step_5_description || 'Start your AI career journey with confidence',
          processStep5Duration: page.process_step_5_duration || 'Ongoing',
          processStep5Icon: page.process_step_5_icon || 'action-icon',
          processStep5Details: page.process_step_5_details || 'Access resources, mentorship, and community support',
          
          processBackgroundColor: page.process_background_color || '#f8f9fa',
          processTextColor: page.process_text_color || '#333333',
          processVisible: Boolean(page.process_visible),

          // Career Paths Section (42 fields)
          careerPathsMainTitle: page.career_paths_main_title || 'AI Career Paths We Cover',
          careerPathsSubtitle: page.career_paths_subtitle || 'Explore diverse opportunities in artificial intelligence',
          careerPathsDescription: page.career_paths_description || '15+ specialized AI career paths with detailed guidance',
          
          careerPath1Title: page.career_path_1_title || 'Machine Learning Engineer',
          careerPath1Description: page.career_path_1_description || 'Build and deploy ML models at scale',
          careerPath1SalaryRange: page.career_path_1_salary_range || '$120K - $200K',
          careerPath1GrowthRate: page.career_path_1_growth_rate || '22% annually',
          careerPath1TopSkills: page.career_path_1_top_skills || 'Python, TensorFlow, AWS',
          careerPath1Companies: page.career_path_1_companies || 'Google, Meta, Netflix',
          careerPath1Icon: page.career_path_1_icon || 'ml-engineer-icon',
          
          careerPath2Title: page.career_path_2_title || 'Data Scientist',
          careerPath2Description: page.career_path_2_description || 'Extract insights from complex datasets',
          careerPath2SalaryRange: page.career_path_2_salary_range || '$110K - $180K',
          careerPath2GrowthRate: page.career_path_2_growth_rate || '19% annually',
          careerPath2TopSkills: page.career_path_2_top_skills || 'Python, Statistics, SQL',
          careerPath2Companies: page.career_path_2_companies || 'Microsoft, Amazon, Airbnb',
          careerPath2Icon: page.career_path_2_icon || 'data-scientist-icon',
          
          careerPath3Title: page.career_path_3_title || 'AI Product Manager',
          careerPath3Description: page.career_path_3_description || 'Lead AI product development and strategy',
          careerPath3SalaryRange: page.career_path_3_salary_range || '$140K - $220K',
          careerPath3GrowthRate: page.career_path_3_growth_rate || '15% annually',
          careerPath3TopSkills: page.career_path_3_top_skills || 'Strategy, Analytics, Leadership',
          careerPath3Companies: page.career_path_3_companies || 'Tesla, OpenAI, Uber',
          careerPath3Icon: page.career_path_3_icon || 'ai-pm-icon',
          
          careerPath4Title: page.career_path_4_title || 'Computer Vision Engineer',
          careerPath4Description: page.career_path_4_description || 'Develop systems that understand visual data',
          careerPath4SalaryRange: page.career_path_4_salary_range || '$130K - $210K',
          careerPath4GrowthRate: page.career_path_4_growth_rate || '25% annually',
          careerPath4TopSkills: page.career_path_4_top_skills || 'OpenCV, PyTorch, C++',
          careerPath4Companies: page.career_path_4_companies || 'Apple, NVIDIA, Tesla',
          careerPath4Icon: page.career_path_4_icon || 'cv-engineer-icon',
          
          careerPath5Title: page.career_path_5_title || 'NLP Engineer',
          careerPath5Description: page.career_path_5_description || 'Build systems that understand human language',
          careerPath5SalaryRange: page.career_path_5_salary_range || '$125K - $200K',
          careerPath5GrowthRate: page.career_path_5_growth_rate || '30% annually',
          careerPath5TopSkills: page.career_path_5_top_skills || 'NLP, Transformers, Python',
          careerPath5Companies: page.career_path_5_companies || 'OpenAI, Google, Anthropic',
          careerPath5Icon: page.career_path_5_icon || 'nlp-engineer-icon',
          
          careerPath6Title: page.career_path_6_title || 'AI Research Scientist',
          careerPath6Description: page.career_path_6_description || 'Advance the field through cutting-edge research',
          careerPath6SalaryRange: page.career_path_6_salary_range || '$150K - $300K',
          careerPath6GrowthRate: page.career_path_6_growth_rate || '18% annually',
          careerPath6TopSkills: page.career_path_6_top_skills || 'Research, Mathematics, Publications',
          careerPath6Companies: page.career_path_6_companies || 'DeepMind, OpenAI, MIT',
          careerPath6Icon: page.career_path_6_icon || 'ai-researcher-icon',
          
          careerPathsVisible: Boolean(page.career_paths_visible),

          // Expert Section (15 fields)
          expertName: page.expert_name || 'Dr. Sarah Chen',
          expertTitle: page.expert_title || 'Senior AI Career Advisor',
          expertCredentials: page.expert_credentials || 'PhD in Computer Science, Former Google AI Lead',
          expertYearsExperience: page.expert_years_experience || '12+ years',
          expertDescription: page.expert_description || 'Leading expert in AI career development with track record of guiding 500+ professionals',
          expertAchievement1: page.expert_achievement_1 || 'Former Head of ML at Google',
          expertAchievement2: page.expert_achievement_2 || '50+ published research papers',
          expertAchievement3: page.expert_achievement_3 || 'Advised 500+ career transitions',
          expertAchievement4: page.expert_achievement_4 || 'TEDx speaker on AI careers',
          expertQuote: page.expert_quote || 'The key to AI career success is finding the intersection of your strengths, interests, and market demand.',
          expertImage: page.expert_image || '/images/expert-sarah-chen.jpg',
          expertLinkedin: page.expert_linkedin || 'https://linkedin.com/in/sarahchen-ai',
          expertTwitter: page.expert_twitter || 'https://twitter.com/sarahchen_ai',
          expertVideoUrl: page.expert_video_url || 'https://youtube.com/watch?v=career-advice',
          expertVisible: Boolean(page.expert_visible),

          // Partners Section (21 fields)
          partnersMainTitle: page.partners_main_title || 'Trusted by Leading AI Companies',
          partnersSubtitle: page.partners_subtitle || 'Our career guidance is endorsed by top tech companies',
          partnersDescription: page.partners_description || 'Partners who trust our career development programs',
          
          partner1Name: page.partner_1_name || 'Google',
          partner1Logo: page.partner_1_logo || '/images/partners/google-logo.png',
          partner1Description: page.partner_1_description || 'AI Research and Engineering roles',
          
          partner2Name: page.partner_2_name || 'Microsoft',
          partner2Logo: page.partner_2_logo || '/images/partners/microsoft-logo.png',
          partner2Description: page.partner_2_description || 'Azure AI and Cognitive Services',
          
          partner3Name: page.partner_3_name || 'OpenAI',
          partner3Logo: page.partner_3_logo || '/images/partners/openai-logo.png',
          partner3Description: page.partner_3_description || 'Advanced AI Research positions',
          
          partner4Name: page.partner_4_name || 'Meta',
          partner4Logo: page.partner_4_logo || '/images/partners/meta-logo.png',
          partner4Description: page.partner_4_description || 'AI/ML Infrastructure roles',
          
          partner5Name: page.partner_5_name || 'Amazon',
          partner5Logo: page.partner_5_logo || '/images/partners/amazon-logo.png',
          partner5Description: page.partner_5_description || 'AWS AI Services team',
          
          partner6Name: page.partner_6_name || 'NVIDIA',
          partner6Logo: page.partner_6_logo || '/images/partners/nvidia-logo.png',
          partner6Description: page.partner_6_description || 'GPU Computing and AI Hardware',
          
          partnersVisible: Boolean(page.partners_visible),

          // Assessment Section (23 fields)
          assessmentMainTitle: page.assessment_main_title || 'Free AI Career Assessment',
          assessmentSubtitle: page.assessment_subtitle || 'Discover your perfect AI career path in 15 minutes',
          assessmentDescription: page.assessment_description || 'Comprehensive evaluation of your skills, interests, and career goals',
          
          assessmentBenefit1: page.assessment_benefit_1 || 'Personalized career recommendations',
          assessmentBenefit2: page.assessment_benefit_2 || 'Detailed skills gap analysis',
          assessmentBenefit3: page.assessment_benefit_3 || 'Custom learning roadmap',
          assessmentBenefit4: page.assessment_benefit_4 || 'Salary expectations by role',
          assessmentBenefit5: page.assessment_benefit_5 || 'Market demand insights',
          
          assessmentQuestion1: page.assessment_question_1 || 'What is your current technical background?',
          assessmentQuestion2: page.assessment_question_2 || 'Which AI applications interest you most?',
          assessmentQuestion3: page.assessment_question_3 || 'What is your preferred work environment?',
          assessmentQuestion4: page.assessment_question_4 || 'How do you prefer to learn new skills?',
          assessmentQuestion5: page.assessment_question_5 || 'What are your career timeline goals?',
          
          assessmentCtaText: page.assessment_cta_text || 'Start Free Assessment',
          assessmentCtaSubtext: page.assessment_cta_subtext || 'No registration required • Takes 15 minutes • Instant results',
          assessmentPrivacyText: page.assessment_privacy_text || 'Your data is secure and never shared',
          assessmentTestimonial: page.assessment_testimonial || 'This assessment changed my career trajectory completely!',
          assessmentTestimonialAuthor: page.assessment_testimonial_author || 'Jennifer Kim, ML Engineer at Tesla',
          
          assessmentFormId: page.assessment_form_id || 'career-assessment-form',
          assessmentSubmitUrl: page.assessment_submit_url || '/api/career-assessment',
          assessmentBackgroundColor: page.assessment_background_color || '#f8f9fa',
          assessmentTextColor: page.assessment_text_color || '#333333',
          assessmentVisible: Boolean(page.assessment_visible),

          // Footer Section (7 fields)
          footerTitle: page.footer_title || 'Ready to Transform Your Career?',
          footerSubtitle: page.footer_subtitle || 'Join thousands of professionals who found their AI career path',
          footerCtaText: page.footer_cta_text || 'Get Started Now',
          footerCtaLink: page.footer_cta_link || '#assessment',
          footerSupportText: page.footer_support_text || 'Questions? Contact our career advisors',
          footerSupportEmail: page.footer_support_email || 'careers@aistudio555.com',
          footerVisible: Boolean(page.footer_visible)
        }
      }
    });
  } catch (error) {
    console.error('Career orientation page error:', error);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

// CAREER CENTER PAGE (comprehensive with locale support)
app.get('/api/career-center-page', async (req, res) => {
  try {
    const locale = getLocale(req);
    console.log(`🌍 Fetching career center page for locale: ${locale}`);
    
    // Get main page data
    const pageData = await queryWithFallback(
      'SELECT * FROM career_center_pages WHERE locale = $1 AND published_at IS NOT NULL LIMIT 1',
      [locale]
    );
    
    // Get testimonials (handle missing table gracefully)
    let testimonials = [];
    try {
      testimonials = await queryWithFallback(
        'SELECT * FROM career_testimonials WHERE locale = $1 ORDER BY sort_order, id',
        [locale]
      );
    } catch (testimonialError) {
      console.warn('Career testimonials table not found, using empty array:', testimonialError.message);
      testimonials = [];
    }
    
    if (pageData.length === 0) {
      return res.json({
        data: {
          id: 1,
          attributes: {
            title: '',
            subtitle: '',
            description: '',
            heroTitle: '',
            heroSubtitle: '',
            heroDescription: '',
            heroStats: [],
            services: [],
            advantages: [],
            package: {},
            testimonials: testimonials || [],
            resources: [],
            metrics: []
          }
        }
      });
    }
    
    const page = pageData[0];
    res.json({
      data: {
        id: page.id,
        attributes: {
          title: page.title || '',
          subtitle: page.subtitle || '',
          description: page.description || '',
          heroTitle: page.hero_title || '',
          heroSubtitle: page.hero_subtitle || '',
          heroDescription: page.hero_description || '',
          heroStats: [
            { number: page.hero_stat1_number || '92%', label: page.hero_stat1_label || 'Job Placement Rate' },
            { number: page.hero_stat2_number || '$85K', label: page.hero_stat2_label || 'Average Starting Salary' },
            { number: page.hero_stat3_number || '3.2x', label: page.hero_stat3_label || 'Salary Increase' }
          ],
          services: [
            { title: page.service1_title || '', description: page.service1_description || '' },
            { title: page.service2_title || '', description: page.service2_description || '' },
            { title: page.service3_title || '', description: page.service3_description || '' }
          ].filter(s => s.title),
          advantages: [
            { title: page.advantage1_title || '', description: page.advantage1_description || '' },
            { title: page.advantage2_title || '', description: page.advantage2_description || '' },
            { title: page.advantage3_title || '', description: page.advantage3_description || '' },
            { title: page.advantage4_title || '', description: page.advantage4_description || '' },
            { title: page.advantage5_title || '', description: page.advantage5_description || '' },
            { title: page.advantage6_title || '', description: page.advantage6_description || '' }
          ].filter(a => a.title),
          package: {
            title: page.package_title || '',
            price: page.package_price || '',
            description: page.package_description || '',
            benefits: page.package_benefits || []
          },
          testimonials: testimonials || [],
          resources: page.resources || [],
          metrics: [
            { number: page.metric1_number || '92%', label: page.metric1_label || 'Job Placement Rate' },
            { number: page.metric2_number || '150+', label: page.metric2_label || 'Partner Companies' },
            { number: page.metric3_number || '$85K', label: page.metric3_label || 'Average Salary' },
            { number: page.metric4_number || '3.2x', label: page.metric4_label || 'Salary Increase Multiplier' }
          ]
        }
      }
    });
  } catch (error) {
    console.error('Career center page error:', error);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

// CAREER ASSESSMENT SUBMISSION ENDPOINT
app.post('/api/career-assessment', async (req, res) => {
  try {
    const {
      // Personal Information
      fullName, email, phone, linkedinProfile,
      
      // Technical Background  
      technicalBackground, currentRole, yearsExperience, programmingLanguages,
      educationLevel, fieldOfStudy, certifications,
      
      // AI Interests & Goals
      aiApplicationsInterest, preferredWorkEnvironment, careerTimelineGoals,
      learningPreference, salaryExpectations, geographicPreference,
      
      // Skills Assessment
      currentSkills, desiredSkills, biggestChallenges,
      
      // Additional Information
      additionalInfo, referralSource, marketingConsent
    } = req.body;

    // Validate required fields
    if (!fullName || !email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Full name and email are required fields' 
      });
    }

    // Insert assessment response into database
    await queryDatabase(`
      INSERT INTO career_orientation_assessment_responses (
        full_name, email, phone, linkedin_profile,
        technical_background, current_role, years_experience, programming_languages,
        education_level, field_of_study, certifications,
        ai_applications_interest, preferred_work_environment, career_timeline_goals,
        learning_preference, salary_expectations, geographic_preference,
        current_skills, desired_skills, biggest_challenges,
        additional_info, referral_source, marketing_consent,
        submission_date, ip_address, user_agent
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, CURRENT_TIMESTAMP, $24, $25
      )
    `, [
      fullName, email, phone || null, linkedinProfile || null,
      technicalBackground || null, currentRole || null, yearsExperience || null, 
      Array.isArray(programmingLanguages) ? programmingLanguages.join(',') : programmingLanguages || null,
      educationLevel || null, fieldOfStudy || null, certifications || null,
      Array.isArray(aiApplicationsInterest) ? aiApplicationsInterest.join(',') : aiApplicationsInterest || null,
      preferredWorkEnvironment || null, careerTimelineGoals || null,
      learningPreference || null, salaryExpectations || null, geographicPreference || null,
      Array.isArray(currentSkills) ? currentSkills.join(',') : currentSkills || null,
      Array.isArray(desiredSkills) ? desiredSkills.join(',') : desiredSkills || null,
      biggestChallenges || null, additionalInfo || null, referralSource || null,
      Boolean(marketingConsent), 
      req.ip || req.connection.remoteAddress || 'unknown',
      req.get('User-Agent') || 'unknown'
    ]);

    // Generate basic AI recommendations (simplified for now)
    const recommendations = generateCareerRecommendations({
      technicalBackground, aiApplicationsInterest, yearsExperience,
      currentSkills, preferredWorkEnvironment, salaryExpectations
    });

    res.json({
      success: true,
      message: 'Career assessment submitted successfully!',
      data: {
        submissionId: Date.now(), // Simple ID for now
        personalizedRecommendations: recommendations,
        nextSteps: [
          'Review your personalized career paths below',
          'Download your custom learning roadmap',
          'Schedule a free consultation with our AI career advisor',
          'Join our AI Career Community for ongoing support'
        ],
        consultationBookingUrl: '/book-consultation',
        roadmapDownloadUrl: `/api/career-roadmap/${Date.now()}`
      }
    });

  } catch (error) {
    console.error('Career assessment submission error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Assessment submission failed', 
      details: error.message 
    });
  }
});

// Helper function to generate basic career recommendations
function generateCareerRecommendations(profile) {
  const {
    technicalBackground, aiApplicationsInterest, yearsExperience,
    currentSkills, preferredWorkEnvironment, salaryExpectations
  } = profile;

  const recommendations = [];
  
  // Basic recommendation logic (can be enhanced with actual AI)
  if (technicalBackground === 'software-engineering' || currentSkills?.includes('Python')) {
    recommendations.push({
      role: 'Machine Learning Engineer',
      matchScore: 85,
      salaryRange: '$120K - $200K',
      growthRate: '22% annually',
      requiredSkills: ['Python', 'TensorFlow', 'AWS', 'MLOps'],
      learningPath: 'ML Engineering Bootcamp → Cloud Platforms → Production ML Systems',
      topCompanies: ['Google', 'Meta', 'Netflix', 'Uber'],
      description: 'Build and deploy machine learning models at scale in production environments.'
    });
  }
  
  if (aiApplicationsInterest?.includes('data-analysis') || currentSkills?.includes('Statistics')) {
    recommendations.push({
      role: 'Data Scientist',
      matchScore: 78,
      salaryRange: '$110K - $180K',
      growthRate: '19% annually', 
      requiredSkills: ['Python', 'R', 'Statistics', 'SQL', 'Visualization'],
      learningPath: 'Statistics Foundation → Data Analysis Tools → Machine Learning → Business Intelligence',
      topCompanies: ['Microsoft', 'Amazon', 'Airbnb', 'LinkedIn'],
      description: 'Extract insights from complex datasets to drive business decisions.'
    });
  }

  if (preferredWorkEnvironment === 'research' || currentSkills?.includes('Research')) {
    recommendations.push({
      role: 'AI Research Scientist',
      matchScore: 72,
      salaryRange: '$150K - $300K',
      growthRate: '18% annually',
      requiredSkills: ['Research Methodology', 'Mathematics', 'Publications', 'Deep Learning'],
      learningPath: 'Advanced Mathematics → Research Methods → Paper Publishing → Conference Presentations',
      topCompanies: ['DeepMind', 'OpenAI', 'MIT', 'Stanford AI Lab'],
      description: 'Advance the field of AI through cutting-edge research and publications.'
    });
  }

  // Default recommendation if no specific matches
  if (recommendations.length === 0) {
    recommendations.push({
      role: 'AI Product Manager',
      matchScore: 65,
      salaryRange: '$140K - $220K', 
      growthRate: '15% annually',
      requiredSkills: ['Strategy', 'Analytics', 'Leadership', 'Technical Communication'],
      learningPath: 'AI Fundamentals → Product Strategy → Technical Leadership → Market Analysis',
      topCompanies: ['Tesla', 'OpenAI', 'Uber', 'Stripe'],
      description: 'Lead AI product development and strategy across cross-functional teams.'
    });
  }

  return recommendations;
}

// UPDATE CAREER ORIENTATION PAGE (comprehensive)
app.put('/api/career-orientation-page', async (req, res) => {
  try {
    const locale = getLocale(req);
    const { data } = req.body;
    
    // First, ensure all columns exist (migration handles this gracefully)
    // Migration runs on server startup, but we'll ensure the table exists
    try {
      await queryWithFallback(`
        CREATE TABLE IF NOT EXISTS career_orientation_pages (
          id SERIAL PRIMARY KEY,
          locale VARCHAR(10) NOT NULL DEFAULT 'en',
          title TEXT,
          subtitle TEXT,
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);
    } catch (tableError) {
      // Table likely already exists
    }
    
    // Check if record exists
    const existing = await queryWithFallback(
      'SELECT id FROM career_orientation_pages WHERE locale = $1 LIMIT 1',
      [locale]
    );
    
    // Build the update/insert data from admin panel fields
    const updateData = {
      title: data.title || 'Career Orientation',
      subtitle: data.subtitle || 'Find Your Path',
      description: data.description || '',
      
      // Hero Section - Map from admin panel field names
      hero_main_title: data.heroMainTitle || data.heroTitle || '',
      hero_subtitle: data.heroSubtitle || '',
      hero_description: data.heroDescription || '',
      hero_stat1_number: data.heroStat1Value || '500+',
      hero_stat1_label: data.heroStat1Label || 'Career Paths',
      hero_stat1_value: data.heroStat1Value || '500+',
      hero_stat2_number: data.heroStat2Value || '15+',
      hero_stat2_label: data.heroStat2Label || 'AI Specializations',
      hero_stat2_value: data.heroStat2Value || '15+',
      hero_stat3_number: data.heroStat3Value || '95%',
      hero_stat3_label: data.heroStat3Label || 'Success Rate',
      hero_stat3_value: data.heroStat3Value || '95%',
      hero_cta_text: data.heroCtaText || 'Get Started',
      hero_cta_link: data.heroCtaLink || '#',
      hero_badge_text: data.heroBadgeText || '',
      hero_visible: data.heroVisible === true || data.heroVisible === 'on',
      
      // Problems Section
      problems_main_title: data.problemsMainTitle || 'Common Career Challenges',
      problems_subtitle: data.problemsSubtitle || '',
      problems_description: data.problemsDescription || '',
      problem1_icon: data.problem1Icon || '',
      problem1_title: data.problem1Title || '',
      problem1_description: data.problem1Description || '',
      problem1_stat: data.problem1Stat || '',
      problem1_stat_label: data.problem1StatLabel || '',
      problem2_icon: data.problem2Icon || '',
      problem2_title: data.problem2Title || '',
      problem2_description: data.problem2Description || '',
      problem2_stat: data.problem2Stat || '',
      problem2_stat_label: data.problem2StatLabel || '',
      problems_visible: data.problemsVisible === true || data.problemsVisible === 'on',
      
      // Solutions Section
      solutions_main_title: data.solutionsMainTitle || 'Our Solutions',
      solutions_subtitle: data.solutionsSubtitle || '',
      solution1_icon: data.solution1Icon || '',
      solution1_title: data.solution1Title || '',
      solution1_description: data.solution1Description || '',
      solution1_feature1: data.solution1Feature1 || '',
      solution1_feature2: data.solution1Feature2 || '',
      solution1_feature3: data.solution1Feature3 || '',
      solution1_feature4: data.solution1Feature4 || '',
      solution1_benefit: data.solution1Benefit || '',
      solutions_visible: data.solutionsVisible === true || data.solutionsVisible === 'on',
      
      // Process Section
      process_main_title: data.processMainTitle || 'Our Process',
      process_subtitle: data.processSubtitle || '',
      process_step1_title: data.processStep1Title || '',
      process_step1_description: data.processStep1Description || '',
      process_step1_duration: data.processStep1Duration || '',
      process_step2_title: data.processStep2Title || '',
      process_step2_description: data.processStep2Description || '',
      process_step2_duration: data.processStep2Duration || '',
      process_step3_title: data.processStep3Title || '',
      process_step3_description: data.processStep3Description || '',
      process_step3_duration: data.processStep3Duration || '',
      process_visible: data.processVisible === true || data.processVisible === 'on',
      
      // Career Paths Section
      career_paths_main_title: data.careerPathsMainTitle || 'Career Paths',
      career_paths_subtitle: data.careerPathsSubtitle || '',
      career_path1_title: data.careerPath1Title || '',
      career_path1_description: data.careerPath1Description || '',
      career_path1_salary_range: data.careerPath1SalaryRange || '',
      career_path1_growth_rate: data.careerPath1GrowthRate || '',
      career_path1_top_skills: data.careerPath1TopSkills || '',
      career_paths_visible: data.careerPathsVisible === true || data.careerPathsVisible === 'on',
      
      // Expert Section
      expert_name: data.expertName || 'Sarah Chen',
      expert_title: data.expertTitle || 'Career Specialist',
      expert_credentials: data.expertCredentials || '',
      expert_description: data.expertDescription || '',
      expert_quote: data.expertQuote || '',
      expert_linkedin: data.expertLinkedin || '',
      expert_twitter: data.expertTwitter || '',
      expert_visible: data.expertVisible === true || data.expertVisible === 'on',
      
      // Partners Section
      partners_main_title: data.partnersMainTitle || 'Our Partners',
      partners_subtitle: data.partnersSubtitle || '',
      partner1_name: data.partner1Name || '',
      partner1_description: data.partner1Description || '',
      partner2_name: data.partner2Name || '',
      partner2_description: data.partner2Description || '',
      partner3_name: data.partner3Name || '',
      partner3_description: data.partner3Description || '',
      partners_visible: data.partnersVisible === true || data.partnersVisible === 'on',
      
      // Assessment Section
      assessment_main_title: data.assessmentMainTitle || '',
      assessment_subtitle: data.assessmentSubtitle || '',
      assessment_description: data.assessmentDescription || '',
      assessment_visible: data.assessmentVisible === true || data.assessmentVisible === 'on',
      
      // CTA Section
      cta_main_title: data.ctaMainTitle || '',
      cta_subtitle: data.ctaSubtitle || '',
      cta_description: data.ctaDescription || '',
      cta_button_text: data.ctaButtonText || '',
      cta_button_link: data.ctaButtonLink || '',
      cta_visible: data.ctaVisible === true || data.ctaVisible === 'on'
    };
    
    if (existing.length > 0) {
      // Update existing - use JSON to store all data flexibly
      const columns = Object.keys(updateData).map((key, index) => `${key} = $${index + 1}`).join(', ');
      const values = Object.values(updateData);
      values.push(locale); // Add locale as last parameter
      
      await queryWithFallback(
        `UPDATE career_orientation_pages 
         SET ${columns}, updated_at = CURRENT_TIMESTAMP
         WHERE locale = $${values.length}`,
        values
      );
    } else {
      // Insert new record
      const columns = Object.keys(updateData).join(', ');
      const placeholders = Object.keys(updateData).map((_, index) => `$${index + 2}`).join(', ');
      const values = [locale, ...Object.values(updateData)];
      
      await queryWithFallback(
        `INSERT INTO career_orientation_pages 
         (locale, ${columns}, created_at, updated_at)
         VALUES ($1, ${placeholders}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        values
      );
    }
    
    res.json({ success: true, message: 'Career orientation page updated successfully' });
  } catch (error) {
    console.error('Error updating career orientation page:', error);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

// UPDATE CAREER CENTER PAGE (comprehensive)
app.put('/api/career-center-page', async (req, res) => {
  try {
    const locale = getLocale(req);
    const { data } = req.body;
    
    // Check if record exists
    const existing = await queryWithFallback(
      'SELECT id FROM career_center_pages WHERE locale = $1 LIMIT 1',
      [locale]
    );
    
    if (existing.length > 0) {
      // Update existing - comprehensive fields
      await queryWithFallback(
        `UPDATE career_center_pages 
         SET title = $1, subtitle = $2, description = $3, 
             hero_title = $4, hero_subtitle = $5, hero_description = $6,
             hero_stat1_number = $7, hero_stat1_label = $8,
             hero_stat2_number = $9, hero_stat2_label = $10,
             hero_stat3_number = $11, hero_stat3_label = $12,
             services_title = $13,
             service1_title = $14, service1_description = $15,
             service2_title = $16, service2_description = $17,
             service3_title = $18, service3_description = $19,
             advantages_title = $20,
             advantage1_title = $21, advantage1_description = $22,
             advantage2_title = $23, advantage2_description = $24,
             advantage3_title = $25, advantage3_description = $26,
             advantage4_title = $27, advantage4_description = $28,
             advantage5_title = $29, advantage5_description = $30,
             advantage6_title = $31, advantage6_description = $32,
             package_title = $33, package_price = $34, package_description = $35,
             resources_title = $36, metrics_title = $37,
             metric1_number = $38, metric1_label = $39,
             metric2_number = $40, metric2_label = $41,
             metric3_number = $42, metric3_label = $43,
             metric4_number = $44, metric4_label = $45,
             updated_at = CURRENT_TIMESTAMP
         WHERE locale = $46`,
        [
          data.title || '', data.subtitle || '', data.description || '',
          data.heroTitle || '', data.heroSubtitle || '', data.heroDescription || '',
          (data.heroStats && data.heroStats[0]) ? data.heroStats[0].number : '92%',
          (data.heroStats && data.heroStats[0]) ? data.heroStats[0].label : 'Job Placement Rate',
          (data.heroStats && data.heroStats[1]) ? data.heroStats[1].number : '$85K',
          (data.heroStats && data.heroStats[1]) ? data.heroStats[1].label : 'Average Starting Salary',
          (data.heroStats && data.heroStats[2]) ? data.heroStats[2].number : '3.2x',
          (data.heroStats && data.heroStats[2]) ? data.heroStats[2].label : 'Salary Increase',
          data.servicesTitle || 'Our Career Services',
          (data.services && data.services[0]) ? data.services[0].title : '',
          (data.services && data.services[0]) ? data.services[0].description : '',
          (data.services && data.services[1]) ? data.services[1].title : '',
          (data.services && data.services[1]) ? data.services[1].description : '',
          (data.services && data.services[2]) ? data.services[2].title : '',
          (data.services && data.services[2]) ? data.services[2].description : '',
          data.advantagesTitle || 'Why Choose AI Studio',
          (data.advantages && data.advantages[0]) ? data.advantages[0].title : '',
          (data.advantages && data.advantages[0]) ? data.advantages[0].description : '',
          (data.advantages && data.advantages[1]) ? data.advantages[1].title : '',
          (data.advantages && data.advantages[1]) ? data.advantages[1].description : '',
          (data.advantages && data.advantages[2]) ? data.advantages[2].title : '',
          (data.advantages && data.advantages[2]) ? data.advantages[2].description : '',
          (data.advantages && data.advantages[3]) ? data.advantages[3].title : '',
          (data.advantages && data.advantages[3]) ? data.advantages[3].description : '',
          (data.advantages && data.advantages[4]) ? data.advantages[4].title : '',
          (data.advantages && data.advantages[4]) ? data.advantages[4].description : '',
          (data.advantages && data.advantages[5]) ? data.advantages[5].title : '',
          (data.advantages && data.advantages[5]) ? data.advantages[5].description : '',
          (data.package && data.package.title) || 'Job Search Success Package',
          (data.package && data.package.price) || '$497',
          (data.package && data.package.description) || '',
          data.resourcesTitle || 'Career Development Resources',
          data.metricsTitle || 'Our Success Metrics',
          (data.metrics && data.metrics[0]) ? data.metrics[0].number : '92%',
          (data.metrics && data.metrics[0]) ? data.metrics[0].label : 'Job Placement Rate',
          (data.metrics && data.metrics[1]) ? data.metrics[1].number : '150+',
          (data.metrics && data.metrics[1]) ? data.metrics[1].label : 'Partner Companies',
          (data.metrics && data.metrics[2]) ? data.metrics[2].number : '$85K',
          (data.metrics && data.metrics[2]) ? data.metrics[2].label : 'Average Salary',
          (data.metrics && data.metrics[3]) ? data.metrics[3].number : '3.2x',
          (data.metrics && data.metrics[3]) ? data.metrics[3].label : 'Salary Increase Multiplier',
          locale
        ]
      );
    } else {
      // Insert new record with basic fields
      await queryWithFallback(
        `INSERT INTO career_center_pages 
         (locale, title, subtitle, description, hero_title, hero_subtitle, hero_description, published_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)`,
        [locale, data.title || '', data.subtitle || '', data.description || '',
         data.heroTitle || '', data.heroSubtitle || '', data.heroDescription || '']
      );
    }
    
    res.json({ success: true, message: 'Career center page updated successfully' });
  } catch (error) {
    console.error('Error updating career center page:', error);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

// GET CONTACT PAGE (with locale support)
app.get('/api/contact-page', async (req, res) => {
  try {
    const locale = getLocale(req);
    console.log(`🌍 Fetching contact page for locale: ${locale}`);
    
    const result = await queryWithFallback(
      'SELECT * FROM contact_pages WHERE locale = $1 LIMIT 1',
      [locale]
    );
    
    if (!result || result.length === 0) {
      return res.json({
        data: {
          id: 1,
          attributes: {
            phone: '',
            email: '',
            address: '',
            officeHours: '',
            mapUrl: ''
          }
        }
      });
    }
    
    const contact = result[0];
    res.json({
      data: {
        id: contact.id,
        attributes: {
          phone: contact.phone || '',
          email: contact.email || '',
          address: contact.address || '',
          officeHours: contact.office_hours || '',
          mapUrl: contact.map_url || ''
        }
      }
    });
  } catch (error) {
    console.error('Contact page error:', error);
    res.status(500).json({ error: 'Database error', details: error.message });
  }
});

// ==================== CRUD OPERATIONS ====================

// UPDATE HOME PAGE
app.put('/api/home-page/:id', async (req, res) => {
  const updates = req.body;
  const updateFields = [];
  const values = [];
  
  // Build UPDATE query dynamically with proper escaping
  Object.keys(updates).forEach(key => {
    const dbField = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    let value = updates[key];
    
    // Handle different data types properly
    if (value === null || value === undefined) {
      value = '';
    } else if (typeof value === 'boolean') {
      value = value ? 1 : 0;
    } else if (typeof value === 'object') {
      value = JSON.stringify(value);
    } else {
      // Escape single quotes to prevent SQL injection
      value = String(value).replace(/'/g, "''");
    }
    
    updateFields.push(`${dbField} = '${value}'`);
  });
  
  if (updateFields.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }
  
  try {
    const query = `UPDATE home_pages SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ${req.params.id}`;
    await queryDatabase(query);
    
    res.json({
      success: true,
      message: 'Home page updated successfully',
      updatedFields: Object.keys(updates)
    });
  } catch (error) {
    console.error('Update error:', error);
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
app.use('/en/js', express.static(path.join(__dirname, 'js')));
app.use('/en/css', express.static(path.join(__dirname, 'css')));
app.use('/en/images', express.static(path.join(__dirname, 'images')));
app.use('/en/fonts', express.static(path.join(__dirname, 'fonts')));

app.use('/he/js', express.static(path.join(__dirname, 'js')));
app.use('/he/css', express.static(path.join(__dirname, 'css')));
app.use('/he/images', express.static(path.join(__dirname, 'images')));
app.use('/he/fonts', express.static(path.join(__dirname, 'fonts')));

app.use('/ru/js', express.static(path.join(__dirname, 'js')));
app.use('/ru/css', express.static(path.join(__dirname, 'css')));
app.use('/ru/images', express.static(path.join(__dirname, 'images')));
app.use('/ru/fonts', express.static(path.join(__dirname, 'fonts')));

// Serve strapi integration files from root and language paths (MUST BE BEFORE catch-all routes)
app.get('/strapi-home-integration.js', (req, res) => {
  res.type('application/javascript');
  res.sendFile(path.join(__dirname, 'strapi-home-integration.js'));
});

app.get('/strapi-visibility-integration.js', (req, res) => {
  res.type('application/javascript');
  res.sendFile(path.join(__dirname, 'strapi-visibility-integration.js'));
});

app.get('/strapi-content-loader.js', (req, res) => {
  res.type('application/javascript');
  res.sendFile(path.join(__dirname, 'strapi-content-loader.js'));
});

// Language-specific JavaScript files (MUST BE BEFORE catch-all routes)
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

// Redirect home.html to index.html for all languages and dist paths
app.get(['/dist/en/home.html', '/en/home.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/en/index.html'));
});

app.get(['/dist/ru/home.html', '/ru/home.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/ru/index.html'));
});

app.get(['/dist/he/home.html', '/he/home.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/he/index.html'));
});

// Also handle index.html requests with dist prefix
app.get('/dist/en/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/en/index.html'));
});

app.get('/dist/ru/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/ru/index.html'));
});

app.get('/dist/he/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/he/index.html'));
});

// Serve specific HTML pages for each language (MUST BE BEFORE catch-all routes)
app.get('/en/courses.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/en/courses.html'));
});

app.get('/en/teachers.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/en/teachers.html'));
});

app.get('/he/courses.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/he/courses.html'));
});

app.get('/he/teachers.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/he/teachers.html'));
});

app.get('/ru/courses.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/ru/courses.html'));
});

app.get('/ru/teachers.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/ru/teachers.html'));
});

// Serve blog pages
app.get('/blog.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'blog.html'));
});

app.get('/en/blog.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'blog.html'));
});

app.get('/ru/blog.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'blog.html'));
});

app.get('/he/blog.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'blog.html'));
});

app.get('/dist/en/blog.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'blog.html'));
});

app.get('/dist/ru/blog.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'blog.html'));
});

app.get('/dist/he/blog.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'blog.html'));
});

// Serve all pages with /dist prefix (for compatibility)
app.get('/dist/en/courses.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/en/courses.html'));
});

app.get('/dist/en/teachers.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/en/teachers.html'));
});

app.get('/dist/en/career-center.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/en/career-center.html'));
});

app.get('/dist/en/career-orientation.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/en/career-orientation.html'));
});

app.get('/dist/ru/courses.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/ru/courses.html'));
});

app.get('/dist/ru/teachers.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/ru/teachers.html'));
});

app.get('/dist/ru/career-center.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/ru/career-center.html'));
});

app.get('/dist/ru/career-orientation.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/ru/career-orientation.html'));
});

app.get('/dist/he/courses.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/he/courses.html'));
});

app.get('/dist/he/teachers.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/he/teachers.html'));
});

app.get('/dist/he/career-center.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/he/career-center.html'));
});

app.get('/dist/he/career-orientation.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/he/career-orientation.html'));
});

// Also handle other common pages
app.get('/en/about.html', (req, res) => {
  const filePath = path.join(__dirname, 'dist/en/about.html');
  if (require('fs').existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.sendFile(path.join(__dirname, 'dist/en/index.html'));
  }
});

app.get('/he/about.html', (req, res) => {
  const filePath = path.join(__dirname, 'dist/he/about.html');
  if (require('fs').existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.sendFile(path.join(__dirname, 'dist/he/index.html'));
  }
});

app.get('/ru/about.html', (req, res) => {
  const filePath = path.join(__dirname, 'dist/ru/about.html');
  if (require('fs').existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.sendFile(path.join(__dirname, 'dist/ru/index.html'));
  }
});

// Handle pages that exist only in root directory (not in dist folders)
// These pages are the same for all languages
const rootPages = [
  'career-center.html',
  'career-orientation.html', 
  'blog.html',
  'about-us.html',
  'contact-us.html',
  'pricing.html',
  'checkout.html',
  'detail_blog.html',
  'detail_courses.html',
  'detail_course-categories.html',
  'order-confirmation.html'
];

// Create routes for each root page in each language
rootPages.forEach(page => {
  ['en', 'ru', 'he'].forEach(lang => {
    app.get(`/${lang}/${page}`, (req, res) => {
      const filePath = path.join(__dirname, page);
      if (require('fs').existsSync(filePath)) {
        res.sendFile(filePath);
      } else {
        // Fallback to language index if page doesn't exist
        res.sendFile(path.join(__dirname, `dist/${lang}/index.html`));
      }
    });
  });
});

// Catch-all for language subpages (MUST BE AFTER specific routes)
app.get('/en/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/en/index.html'));
});

app.get('/he/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/he/index.html'));
});

app.get('/ru/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/ru/index.html'));
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

// Manual seed endpoint (temporary - for initial setup)
app.get('/api/seed-database', async (req, res) => {
  try {
    console.log('📝 Force seeding database...');
    const { seedDatabase } = require('./seed-initial-data');
    await seedDatabase();
    res.json({ 
      success: true, 
      message: 'Database force-seeded successfully! All tables updated with locale columns.',
      note: 'Refresh the admin panel to see the data'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      tip: 'Check server logs for details'
    });
  }
});

// Reset database endpoint (for fixing schema issues)
app.get('/api/reset-database', async (req, res) => {
  try {
    console.log('🔄 Resetting database schema...');
    const { seedDatabase } = require('./seed-initial-data');
    await seedDatabase();
    res.json({ 
      success: true, 
      message: 'Database schema reset and seeded successfully!',
      note: 'All tables now have proper locale columns'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      tip: 'Check server logs for details'
    });
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

// MANUAL MIGRATION ENDPOINT
app.get('/api/run-migration', async (req, res) => {
  try {
    console.log('🔧 Running manual migration for career_orientation_pages...');
    
    // Use queryDatabase instead of queryWithFallback for Railway
    const query = process.env.DATABASE_URL ? queryDatabase : queryWithFallback;
    
    // Create table if not exists
    await query(`
      CREATE TABLE IF NOT EXISTS career_orientation_pages (
        id SERIAL PRIMARY KEY,
        locale VARCHAR(10) NOT NULL DEFAULT 'en',
        title TEXT,
        subtitle TEXT,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);
    
    // List of all columns needed
    const columns = [
      'hero_title TEXT',
      'hero_subtitle TEXT',
      'hero_description TEXT',
      'hero_main_title TEXT',
      'hero_stat1_number TEXT',
      'hero_stat1_label TEXT',
      'hero_stat1_value TEXT',
      'hero_stat2_number TEXT',
      'hero_stat2_label TEXT',
      'hero_stat2_value TEXT',
      'hero_stat3_number TEXT',
      'hero_stat3_label TEXT',
      'hero_stat3_value TEXT',
      'hero_cta_text TEXT',
      'hero_cta_link TEXT',
      'hero_badge_text TEXT',
      'hero_visible BOOLEAN DEFAULT true',
      'problems_main_title TEXT',
      'problems_subtitle TEXT',
      'problems_description TEXT',
      'problem1_icon TEXT',
      'problem1_title TEXT',
      'problem1_description TEXT',
      'problem1_stat TEXT',
      'problem1_stat_label TEXT',
      'problem2_icon TEXT',
      'problem2_title TEXT',
      'problem2_description TEXT',
      'problem2_stat TEXT',
      'problem2_stat_label TEXT',
      'problems_visible BOOLEAN DEFAULT true',
      'challenges_title TEXT',
      'challenge1_title TEXT',
      'challenge1_description TEXT',
      'challenge2_title TEXT',
      'challenge2_description TEXT',
      'challenge3_title TEXT',
      'challenge3_description TEXT',
      'challenge4_title TEXT',
      'challenge4_description TEXT',
      'solutions_main_title TEXT',
      'solutions_subtitle TEXT',
      'solution1_icon TEXT',
      'solution1_title TEXT',
      'solution1_description TEXT',
      'solution1_feature1 TEXT',
      'solution1_feature2 TEXT',
      'solution1_feature3 TEXT',
      'solution1_feature4 TEXT',
      'solution1_benefit TEXT',
      'solution2_icon TEXT',
      'solution2_title TEXT',
      'solution2_description TEXT',
      'solutions_visible BOOLEAN DEFAULT true',
      'process_main_title TEXT',
      'process_subtitle TEXT',
      'process_title TEXT',
      'process_step1_title TEXT',
      'process_step1_description TEXT',
      'process_step1_duration TEXT',
      'process_step2_title TEXT',
      'process_step2_description TEXT',
      'process_step2_duration TEXT',
      'process_step3_title TEXT',
      'process_step3_description TEXT',
      'process_step3_duration TEXT',
      'process_step4_title TEXT',
      'process_step4_description TEXT',
      'process_step4_duration TEXT',
      'process_step5_title TEXT',
      'process_step5_description TEXT',
      'process_step5_duration TEXT',
      'process_visible BOOLEAN DEFAULT true',
      'career_paths_main_title TEXT',
      'career_paths_subtitle TEXT',
      'career_path1_title TEXT',
      'career_path1_description TEXT',
      'career_path1_salary_range TEXT',
      'career_path1_growth_rate TEXT',
      'career_path1_top_skills TEXT',
      'career_path2_title TEXT',
      'career_path2_description TEXT',
      'career_path2_salary_range TEXT',
      'career_path2_growth_rate TEXT',
      'career_path3_title TEXT',
      'career_path3_description TEXT',
      'career_paths_visible BOOLEAN DEFAULT true',
      'expert_name TEXT',
      'expert_title TEXT',
      'expert_credentials TEXT',
      'expert_background TEXT',
      'expert_description TEXT',
      'expert_quote TEXT',
      'expert_linkedin TEXT',
      'expert_twitter TEXT',
      'expert_achievements TEXT',
      'expert_visible BOOLEAN DEFAULT true',
      'partners_main_title TEXT',
      'partners_subtitle TEXT',
      'partners_title TEXT',
      'partner1_name TEXT',
      'partner1_description TEXT',
      'partner2_name TEXT',
      'partner2_description TEXT',
      'partner3_name TEXT',
      'partner3_description TEXT',
      'partners_visible BOOLEAN DEFAULT true',
      'assessment_main_title TEXT',
      'assessment_subtitle TEXT',
      'assessment_description TEXT',
      'assessment_questions JSON',
      'assessment_visible BOOLEAN DEFAULT true',
      'resources_main_title TEXT',
      'resources_subtitle TEXT',
      'resources JSON',
      'resources_visible BOOLEAN DEFAULT true',
      'success_stories_main_title TEXT',
      'success_stories_subtitle TEXT',
      'success_stories JSON',
      'success_stories_visible BOOLEAN DEFAULT true',
      'cta_main_title TEXT',
      'cta_subtitle TEXT',
      'cta_description TEXT',
      'cta_button_text TEXT',
      'cta_button_link TEXT',
      'cta_visible BOOLEAN DEFAULT true',
      'meta_title TEXT',
      'meta_description TEXT',
      'meta_keywords TEXT',
      'og_title TEXT',
      'og_description TEXT',
      'og_image TEXT'
    ];
    
    let addedColumns = 0;
    let existingColumns = 0;
    
    for (const columnDef of columns) {
      const [columnName] = columnDef.split(' ');
      try {
        await query(`ALTER TABLE career_orientation_pages ADD COLUMN IF NOT EXISTS ${columnDef}`);
        addedColumns++;
      } catch (err) {
        if (err.message.includes('already exists')) {
          existingColumns++;
        } else {
          console.error(`Error adding column ${columnName}:`, err.message);
        }
      }
    }
    
    // Check if we need to insert default data
    let needsDefaultData = true;
    try {
      const existing = await query(
        'SELECT COUNT(*) as count FROM career_orientation_pages WHERE locale = $1',
        ['en']
      );
      
      if (existing && existing.length > 0 && (existing[0].count > 0 || existing[0].count === '1')) {
        needsDefaultData = false;
      }
    } catch (err) {
      console.log('Count query error:', err.message);
    }
    
    if (needsDefaultData) {
      await query(
        `INSERT INTO career_orientation_pages (locale, title, hero_main_title)
         VALUES ($1, $2, $3)`,
        ['en', 'Career Orientation', 'Discover Your Tech Career Path']
      );
      console.log('✅ Added default content');
    }
    
    res.json({
      success: true,
      message: 'Migration completed successfully',
      addedColumns,
      existingColumns,
      totalColumns: columns.length
    });
    
  } catch (error) {
    console.error('Migration failed:', error);
    res.status(500).json({
      error: 'Migration failed',
      details: error.message
    });
  }
});

// ==================== NEW API ENDPOINTS FOR MISSING CONTENT ====================

// 1. SITE SETTINGS API
// Get site settings
app.get('/api/site-settings', async (req, res) => {
  try {
    const locale = getLocale(req);
    const query = `
      SELECT * FROM site_settings 
      WHERE locale = $1 
      ORDER BY id DESC LIMIT 1
    `;
    
    const result = await queryDatabase(query, [locale]);
    
    if (result.length === 0) {
      // Fallback to English if locale not found
      const fallbackResult = await queryDatabase(query, ['en']);
      res.json(fallbackResult[0] || {});
    } else {
      res.json(result[0]);
    }
  } catch (error) {
    console.error('Error fetching site settings:', error);
    res.status(500).json({ error: 'Failed to fetch site settings' });
  }
});

// Update site settings
app.put('/api/site-settings', async (req, res) => {
  try {
    const locale = getLocale(req);
    const data = req.body;
    
    // Check if record exists
    const checkQuery = 'SELECT id FROM site_settings WHERE locale = $1';
    const existing = await queryDatabase(checkQuery, [locale]);
    
    if (existing.length > 0) {
      // Update existing
      const fields = Object.keys(data).filter(key => key !== 'id');
      const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
      const values = [existing[0].id, ...fields.map(field => data[field])];
      
      const updateQuery = `
        UPDATE site_settings 
        SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $1 
        RETURNING *
      `;
      
      const result = await queryDatabase(updateQuery, values);
      res.json(result[0]);
    } else {
      // Insert new
      const fields = ['locale', ...Object.keys(data)];
      const values = [locale, ...Object.values(data)];
      const placeholders = fields.map((_, index) => `$${index + 1}`).join(', ');
      
      const insertQuery = `
        INSERT INTO site_settings (${fields.join(', ')}) 
        VALUES (${placeholders}) 
        RETURNING *
      `;
      
      const result = await queryDatabase(insertQuery, values);
      res.json(result[0]);
    }
  } catch (error) {
    console.error('Error updating site settings:', error);
    res.status(500).json({ error: 'Failed to update site settings' });
  }
});

// 2. NAVIGATION MENU API
// Get navigation menu
app.get('/api/navigation-menu', async (req, res) => {
  try {
    const locale = getLocale(req);
    const menuType = req.query.type || 'main';
    
    const query = `
      SELECT * FROM navigation_menus 
      WHERE locale = $1 AND menu_type = $2 
      ORDER BY id DESC LIMIT 1
    `;
    
    const result = await queryDatabase(query, [locale, menuType]);
    
    if (result.length === 0) {
      // Fallback to English if locale not found
      const fallbackResult = await queryDatabase(query, ['en', menuType]);
      res.json(fallbackResult[0] || {});
    } else {
      res.json(result[0]);
    }
  } catch (error) {
    console.error('Error fetching navigation menu:', error);
    res.status(500).json({ error: 'Failed to fetch navigation menu' });
  }
});

// Update navigation menu
app.put('/api/navigation-menu', async (req, res) => {
  try {
    const locale = getLocale(req);
    const menuType = req.body.menu_type || 'main';
    const data = req.body;
    
    // Check if record exists
    const checkQuery = 'SELECT id FROM navigation_menus WHERE locale = $1 AND menu_type = $2';
    const existing = await queryDatabase(checkQuery, [locale, menuType]);
    
    if (existing.length > 0) {
      // Update existing
      const fields = Object.keys(data).filter(key => key !== 'id');
      const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
      const values = [existing[0].id, ...fields.map(field => data[field])];
      
      const updateQuery = `
        UPDATE navigation_menus 
        SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $1 
        RETURNING *
      `;
      
      const result = await queryDatabase(updateQuery, values);
      res.json(result[0]);
    } else {
      // Insert new
      const fields = ['locale', 'menu_type', ...Object.keys(data).filter(key => key !== 'menu_type')];
      const values = [locale, menuType, ...Object.keys(data).filter(key => key !== 'menu_type').map(field => data[field])];
      const placeholders = fields.map((_, index) => `$${index + 1}`).join(', ');
      
      const insertQuery = `
        INSERT INTO navigation_menus (${fields.join(', ')}) 
        VALUES (${placeholders}) 
        RETURNING *
      `;
      
      const result = await queryDatabase(insertQuery, values);
      res.json(result[0]);
    }
  } catch (error) {
    console.error('Error updating navigation menu:', error);
    res.status(500).json({ error: 'Failed to update navigation menu' });
  }
});

// 3. STATISTICS API
// Get statistics
app.get('/api/statistics', async (req, res) => {
  try {
    const locale = getLocale(req);
    const query = `
      SELECT * FROM statistics 
      WHERE locale = $1 
      ORDER BY id DESC LIMIT 1
    `;
    
    const result = await queryDatabase(query, [locale]);
    
    if (result.length === 0) {
      // Fallback to English if locale not found
      const fallbackResult = await queryDatabase(query, ['en']);
      res.json(fallbackResult[0] || {});
    } else {
      res.json(result[0]);
    }
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Update statistics
app.put('/api/statistics', async (req, res) => {
  try {
    const locale = getLocale(req);
    const data = req.body;
    
    // Check if record exists
    const checkQuery = 'SELECT id FROM statistics WHERE locale = $1';
    const existing = await queryDatabase(checkQuery, [locale]);
    
    if (existing.length > 0) {
      // Update existing
      const fields = Object.keys(data).filter(key => key !== 'id');
      const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
      const values = [existing[0].id, ...fields.map(field => data[field])];
      
      const updateQuery = `
        UPDATE statistics 
        SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $1 
        RETURNING *
      `;
      
      const result = await queryDatabase(updateQuery, values);
      res.json(result[0]);
    } else {
      // Insert new
      const fields = ['locale', ...Object.keys(data)];
      const values = [locale, ...Object.values(data)];
      const placeholders = fields.map((_, index) => `$${index + 1}`).join(', ');
      
      const insertQuery = `
        INSERT INTO statistics (${fields.join(', ')}) 
        VALUES (${placeholders}) 
        RETURNING *
      `;
      
      const result = await queryDatabase(insertQuery, values);
      res.json(result[0]);
    }
  } catch (error) {
    console.error('Error updating statistics:', error);
    res.status(500).json({ error: 'Failed to update statistics' });
  }
});

// 4. BUTTON TEXTS API
// Get button texts
app.get('/api/button-texts', async (req, res) => {
  try {
    const locale = getLocale(req);
    const query = `
      SELECT * FROM button_texts 
      WHERE locale = $1 
      ORDER BY id DESC LIMIT 1
    `;
    
    const result = await queryDatabase(query, [locale]);
    
    if (result.length === 0) {
      // Fallback to English if locale not found
      const fallbackResult = await queryDatabase(query, ['en']);
      res.json(fallbackResult[0] || {});
    } else {
      res.json(result[0]);
    }
  } catch (error) {
    console.error('Error fetching button texts:', error);
    res.status(500).json({ error: 'Failed to fetch button texts' });
  }
});

// Update button texts
app.put('/api/button-texts', async (req, res) => {
  try {
    const locale = getLocale(req);
    const data = req.body;
    
    // Check if record exists
    const checkQuery = 'SELECT id FROM button_texts WHERE locale = $1';
    const existing = await queryDatabase(checkQuery, [locale]);
    
    if (existing.length > 0) {
      // Update existing
      const fields = Object.keys(data).filter(key => key !== 'id');
      const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
      const values = [existing[0].id, ...fields.map(field => data[field])];
      
      const updateQuery = `
        UPDATE button_texts 
        SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $1 
        RETURNING *
      `;
      
      const result = await queryDatabase(updateQuery, values);
      res.json(result[0]);
    } else {
      // Insert new
      const fields = ['locale', ...Object.keys(data)];
      const values = [locale, ...Object.values(data)];
      const placeholders = fields.map((_, index) => `$${index + 1}`).join(', ');
      
      const insertQuery = `
        INSERT INTO button_texts (${fields.join(', ')}) 
        VALUES (${placeholders}) 
        RETURNING *
      `;
      
      const result = await queryDatabase(insertQuery, values);
      res.json(result[0]);
    }
  } catch (error) {
    console.error('Error updating button texts:', error);
    res.status(500).json({ error: 'Failed to update button texts' });
  }
});

// 5. COMPANY LOGOS API
// Get company logos
app.get('/api/company-logos', async (req, res) => {
  try {
    const locale = getLocale(req);
    const query = `
      SELECT * FROM company_logos 
      WHERE locale = $1 
      ORDER BY id DESC LIMIT 1
    `;
    
    const result = await queryDatabase(query, [locale]);
    
    if (result.length === 0) {
      // Fallback to English if locale not found
      const fallbackResult = await queryDatabase(query, ['en']);
      res.json(fallbackResult[0] || {});
    } else {
      res.json(result[0]);
    }
  } catch (error) {
    console.error('Error fetching company logos:', error);
    res.status(500).json({ error: 'Failed to fetch company logos' });
  }
});

// Update company logos
app.put('/api/company-logos', async (req, res) => {
  try {
    const locale = getLocale(req);
    const data = req.body;
    
    // Check if record exists
    const checkQuery = 'SELECT id FROM company_logos WHERE locale = $1';
    const existing = await queryDatabase(checkQuery, [locale]);
    
    if (existing.length > 0) {
      // Update existing
      const fields = Object.keys(data).filter(key => key !== 'id');
      const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
      const values = [existing[0].id, ...fields.map(field => data[field])];
      
      const updateQuery = `
        UPDATE company_logos 
        SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $1 
        RETURNING *
      `;
      
      const result = await queryDatabase(updateQuery, values);
      res.json(result[0]);
    } else {
      // Insert new
      const fields = ['locale', ...Object.keys(data)];
      const values = [locale, ...Object.values(data)];
      const placeholders = fields.map((_, index) => `$${index + 1}`).join(', ');
      
      const insertQuery = `
        INSERT INTO company_logos (${fields.join(', ')}) 
        VALUES (${placeholders}) 
        RETURNING *
      `;
      
      const result = await queryDatabase(insertQuery, values);
      res.json(result[0]);
    }
  } catch (error) {
    console.error('Error updating company logos:', error);
    res.status(500).json({ error: 'Failed to update company logos' });
  }
});

// 6. PAGE META API
// Get page meta data
app.get('/api/page-meta/:slug', async (req, res) => {
  try {
    const locale = getLocale(req);
    const { slug } = req.params;
    
    const query = `
      SELECT * FROM page_meta 
      WHERE locale = $1 AND page_slug = $2 
      ORDER BY id DESC LIMIT 1
    `;
    
    const result = await queryDatabase(query, [locale, slug]);
    
    if (result.length === 0) {
      // Fallback to English if locale not found
      const fallbackResult = await queryDatabase(query, ['en', slug]);
      res.json(fallbackResult[0] || {});
    } else {
      res.json(result[0]);
    }
  } catch (error) {
    console.error('Error fetching page meta:', error);
    res.status(500).json({ error: 'Failed to fetch page meta' });
  }
});

// Update page meta data
app.put('/api/page-meta/:slug', async (req, res) => {
  try {
    const locale = getLocale(req);
    const { slug } = req.params;
    const data = req.body;
    
    // Check if record exists
    const checkQuery = 'SELECT id FROM page_meta WHERE locale = $1 AND page_slug = $2';
    const existing = await queryDatabase(checkQuery, [locale, slug]);
    
    if (existing.length > 0) {
      // Update existing
      const fields = Object.keys(data).filter(key => key !== 'id');
      const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
      const values = [existing[0].id, ...fields.map(field => data[field])];
      
      const updateQuery = `
        UPDATE page_meta 
        SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $1 
        RETURNING *
      `;
      
      const result = await queryDatabase(updateQuery, values);
      res.json(result[0]);
    } else {
      // Insert new
      const fields = ['locale', 'page_slug', ...Object.keys(data)];
      const values = [locale, slug, ...Object.values(data)];
      const placeholders = fields.map((_, index) => `$${index + 1}`).join(', ');
      
      const insertQuery = `
        INSERT INTO page_meta (${fields.join(', ')}) 
        VALUES (${placeholders}) 
        RETURNING *
      `;
      
      const result = await queryDatabase(insertQuery, values);
      res.json(result[0]);
    }
  } catch (error) {
    console.error('Error updating page meta:', error);
    res.status(500).json({ error: 'Failed to update page meta' });
  }
});

// 7. COMBINED GLOBAL CONTENT API (for easier frontend integration)
// Get all global content at once
app.get('/api/global-content', async (req, res) => {
  try {
    const locale = getLocale(req);
    
    // Get all global content in parallel
    const [siteSettings, navigationMenu, statistics, buttonTexts, companyLogos] = await Promise.all([
      queryDatabase('SELECT * FROM site_settings WHERE locale = $1 ORDER BY id DESC LIMIT 1', [locale]),
      queryDatabase('SELECT * FROM navigation_menus WHERE locale = $1 ORDER BY id DESC LIMIT 1', [locale]),
      queryDatabase('SELECT * FROM statistics WHERE locale = $1 ORDER BY id DESC LIMIT 1', [locale]),
      queryDatabase('SELECT * FROM button_texts WHERE locale = $1 ORDER BY id DESC LIMIT 1', [locale]),
      queryDatabase('SELECT * FROM company_logos WHERE locale = $1 ORDER BY id DESC LIMIT 1', [locale])
    ]);
    
    // Fallback to English if any content is missing
    const fallbackPromises = [];
    if (siteSettings.length === 0) fallbackPromises.push(queryDatabase('SELECT * FROM site_settings WHERE locale = \'en\' ORDER BY id DESC LIMIT 1'));
    if (navigationMenu.length === 0) fallbackPromises.push(queryDatabase('SELECT * FROM navigation_menus WHERE locale = \'en\' ORDER BY id DESC LIMIT 1'));
    if (statistics.length === 0) fallbackPromises.push(queryDatabase('SELECT * FROM statistics WHERE locale = \'en\' ORDER BY id DESC LIMIT 1'));
    if (buttonTexts.length === 0) fallbackPromises.push(queryDatabase('SELECT * FROM button_texts WHERE locale = \'en\' ORDER BY id DESC LIMIT 1'));
    if (companyLogos.length === 0) fallbackPromises.push(queryDatabase('SELECT * FROM company_logos WHERE locale = \'en\' ORDER BY id DESC LIMIT 1'));
    
    const fallbacks = await Promise.all(fallbackPromises);
    let fallbackIndex = 0;
    
    res.json({
      siteSettings: siteSettings[0] || (fallbacks[fallbackIndex++]?.[0] || {}),
      navigationMenu: navigationMenu[0] || (fallbacks[fallbackIndex++]?.[0] || {}),
      statistics: statistics[0] || (fallbacks[fallbackIndex++]?.[0] || {}),
      buttonTexts: buttonTexts[0] || (fallbacks[fallbackIndex++]?.[0] || {}),
      companyLogos: companyLogos[0] || (fallbacks[fallbackIndex++]?.[0] || {}),
      locale: locale
    });
  } catch (error) {
    console.error('Error fetching global content:', error);
    res.status(500).json({ error: 'Failed to fetch global content' });
  }
});

// 8. MIGRATION ENDPOINT FOR NEW FIELDS
// Run the missing fields migration
app.post('/api/run-missing-fields-migration', async (req, res) => {
  try {
    console.log('🔄 Running missing fields migration...');
    
    // Inline migration code - create essential tables
    const createTableQueries = [
      // 1. Site Settings
      `CREATE TABLE IF NOT EXISTS site_settings (
        id SERIAL PRIMARY KEY,
        locale VARCHAR(5) DEFAULT 'en',
        site_name VARCHAR(255) DEFAULT 'AI Studio',
        site_tagline VARCHAR(500),
        logo_url VARCHAR(500),
        footer_email VARCHAR(255) DEFAULT 'info@aistudio555.com',
        footer_phone VARCHAR(50),
        footer_address TEXT,
        footer_copyright TEXT DEFAULT '© 2024 AI Studio. All rights reserved.',
        facebook_url VARCHAR(500),
        twitter_url VARCHAR(500),
        instagram_url VARCHAR(500),
        linkedin_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // 2. Navigation Menu
      `CREATE TABLE IF NOT EXISTS navigation_menus (
        id SERIAL PRIMARY KEY,
        locale VARCHAR(5) DEFAULT 'en',
        home_label VARCHAR(100) DEFAULT 'Home',
        courses_label VARCHAR(100) DEFAULT 'Courses',
        teachers_label VARCHAR(100) DEFAULT 'Teachers',
        career_services_label VARCHAR(100) DEFAULT 'Career Services',
        career_center_label VARCHAR(100) DEFAULT 'Career Center',
        career_orientation_label VARCHAR(100) DEFAULT 'Career Orientation',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // 3. Statistics  
      `CREATE TABLE IF NOT EXISTS statistics (
        id SERIAL PRIMARY KEY,
        locale VARCHAR(5) DEFAULT 'en',
        courses_count VARCHAR(50) DEFAULT '125+',
        courses_label VARCHAR(100) DEFAULT 'Courses',
        learners_count VARCHAR(50) DEFAULT '14,000+',
        learners_label VARCHAR(100) DEFAULT 'Learners',
        years_count VARCHAR(50) DEFAULT '10+',
        years_label VARCHAR(100) DEFAULT 'Years',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // 4. Button Texts
      `CREATE TABLE IF NOT EXISTS button_texts (
        id SERIAL PRIMARY KEY,
        locale VARCHAR(5) DEFAULT 'en',
        get_started VARCHAR(100) DEFAULT 'Get Started',
        explore_courses VARCHAR(100) DEFAULT 'Explore Courses',
        learn_more VARCHAR(100) DEFAULT 'Learn More',
        enroll_now VARCHAR(100) DEFAULT 'Enroll Now',
        contact_us VARCHAR(100) DEFAULT 'Contact Us',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // 5. Company Logos
      `CREATE TABLE IF NOT EXISTS company_logos (
        id SERIAL PRIMARY KEY,
        locale VARCHAR(5) DEFAULT 'en',
        section_title VARCHAR(255) DEFAULT 'Our Graduates Work At',
        company_1_name VARCHAR(255) DEFAULT 'Google',
        company_1_logo VARCHAR(500),
        company_2_name VARCHAR(255) DEFAULT 'Microsoft',
        company_2_logo VARCHAR(500),
        company_3_name VARCHAR(255) DEFAULT 'Amazon',
        company_3_logo VARCHAR(500),
        company_4_name VARCHAR(255) DEFAULT 'Meta',
        company_4_logo VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`
    ];
    
    // Execute all queries
    for (const query of createTableQueries) {
      await queryDatabase(query, []);
    }
    
    // Seed initial data for English
    const seedQueries = [
      "INSERT INTO site_settings (locale, site_name) VALUES ('en', 'AI Studio') ON CONFLICT DO NOTHING",
      "INSERT INTO navigation_menus (locale) VALUES ('en') ON CONFLICT DO NOTHING", 
      "INSERT INTO statistics (locale) VALUES ('en') ON CONFLICT DO NOTHING",
      "INSERT INTO button_texts (locale) VALUES ('en') ON CONFLICT DO NOTHING",
      "INSERT INTO company_logos (locale) VALUES ('en') ON CONFLICT DO NOTHING"
    ];
    
    for (const query of seedQueries) {
      try {
        await queryDatabase(query, []);
      } catch (error) {
        console.log('Seeding query failed (may already exist):', error.message);
      }
    }
    
    res.json({ 
      success: true, 
      message: 'Missing fields migration completed successfully!',
      note: 'New tables created: site_settings, navigation_menus, statistics, button_texts, company_logos'
    });
  } catch (error) {
    console.error('Migration failed:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Migration failed', 
      details: error.message 
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