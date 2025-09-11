/**
 * ADD MISSING FIELDS MIGRATION SCRIPT
 * Adds all missing database fields to make EVERYTHING on the website editable from the admin panel
 * 
 * New Tables:
 * - site_settings: Site name, logo, footer info, social media, copyright
 * - navigation_menus: Menu items, dropdown items, URLs
 * - statistics: Homepage stats (courses count, learners count, years)
 * - button_texts: All button texts and CTAs
 * - company_logos: Partner company logos section
 * - page_meta: Meta descriptions, titles, SEO data
 */

const { Client } = require('pg');

async function addMissingFields() {
  console.log('🚀 Adding Missing Fields to Database...');
  
  // Check if we have DATABASE_URL from Railway
  if (!process.env.DATABASE_URL) {
    console.log('⚠️  DATABASE_URL not found. Using local SQLite for now.');
    return;
  }

  // Connect to PostgreSQL
  const pgClient = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await pgClient.connect();
    console.log('✅ Connected to Railway PostgreSQL');

    // Create new tables for missing content
    await createNewTables(pgClient);
    
    // Add missing fields to existing tables
    await addFieldsToExistingTables(pgClient);
    
    // Seed with initial data
    await seedNewTables(pgClient);
    
    console.log('✅ Missing fields migration complete!');
  } catch (error) {
    console.error('❌ Migration error:', error);
  } finally {
    await pgClient.end();
  }
}

async function createNewTables(pgClient) {
  console.log('📊 Creating new tables for missing content...');

  // 1. Site Settings Table
  await pgClient.query(`
    CREATE TABLE IF NOT EXISTS site_settings (
      id SERIAL PRIMARY KEY,
      locale VARCHAR(5) DEFAULT 'en',
      site_name VARCHAR(255) DEFAULT 'AI Studio',
      site_tagline VARCHAR(500),
      logo_url VARCHAR(500),
      logo_alt_text VARCHAR(255),
      favicon_url VARCHAR(500),
      primary_color VARCHAR(7) DEFAULT '#007aff',
      secondary_color VARCHAR(7) DEFAULT '#667eea',
      
      -- Footer Information
      footer_email VARCHAR(255),
      footer_phone VARCHAR(50),
      footer_address TEXT,
      footer_copyright TEXT,
      
      -- Social Media Links
      facebook_url VARCHAR(500),
      twitter_url VARCHAR(500),
      instagram_url VARCHAR(500),
      linkedin_url VARCHAR(500),
      youtube_url VARCHAR(500),
      telegram_url VARCHAR(500),
      whatsapp_number VARCHAR(50),
      
      -- SEO Settings
      meta_description TEXT,
      meta_keywords TEXT,
      google_analytics_id VARCHAR(100),
      facebook_pixel_id VARCHAR(100),
      
      published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 2. Navigation Menu Table
  await pgClient.query(`
    CREATE TABLE IF NOT EXISTS navigation_menus (
      id SERIAL PRIMARY KEY,
      locale VARCHAR(5) DEFAULT 'en',
      menu_type VARCHAR(50) DEFAULT 'main', -- main, footer, mobile
      
      -- Main Navigation Items
      home_label VARCHAR(100) DEFAULT 'Home',
      home_url VARCHAR(255) DEFAULT '/home.html',
      about_label VARCHAR(100) DEFAULT 'About',
      about_url VARCHAR(255) DEFAULT '/about-us.html',
      courses_label VARCHAR(100) DEFAULT 'Courses',
      courses_url VARCHAR(255) DEFAULT '/courses.html',
      teachers_label VARCHAR(100) DEFAULT 'Teachers',
      teachers_url VARCHAR(255) DEFAULT '/teachers.html',
      pricing_label VARCHAR(100) DEFAULT 'Pricing',
      pricing_url VARCHAR(255) DEFAULT '/pricing.html',
      contact_label VARCHAR(100) DEFAULT 'Contact',
      contact_url VARCHAR(255) DEFAULT '/contact-us.html',
      blog_label VARCHAR(100) DEFAULT 'Blog',
      blog_url VARCHAR(255) DEFAULT '/blog.html',
      
      -- Career Services Dropdown
      career_services_label VARCHAR(100) DEFAULT 'Career Services',
      career_center_label VARCHAR(100) DEFAULT 'Career Center',
      career_center_url VARCHAR(255) DEFAULT '/career-center.html',
      career_orientation_label VARCHAR(100) DEFAULT 'Career Orientation',
      career_orientation_url VARCHAR(255) DEFAULT '/career-orientation.html',
      job_board_label VARCHAR(100) DEFAULT 'Job Board',
      job_board_url VARCHAR(255) DEFAULT '/jobs.html',
      
      -- Mobile Menu
      menu_toggle_label VARCHAR(50) DEFAULT 'Menu',
      
      published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 3. Statistics Table
  await pgClient.query(`
    CREATE TABLE IF NOT EXISTS statistics (
      id SERIAL PRIMARY KEY,
      locale VARCHAR(5) DEFAULT 'en',
      
      -- Homepage Statistics
      courses_count VARCHAR(50) DEFAULT '125+',
      courses_label VARCHAR(100) DEFAULT 'Courses',
      learners_count VARCHAR(50) DEFAULT '14,000+',
      learners_label VARCHAR(100) DEFAULT 'Learners',
      years_count VARCHAR(50) DEFAULT '10+',
      years_label VARCHAR(100) DEFAULT 'Years',
      
      -- Additional Stats
      instructors_count VARCHAR(50),
      instructors_label VARCHAR(100) DEFAULT 'Expert Instructors',
      certificates_count VARCHAR(50),
      certificates_label VARCHAR(100) DEFAULT 'Certificates Issued',
      success_rate VARCHAR(50),
      success_rate_label VARCHAR(100) DEFAULT 'Success Rate',
      
      -- Stats Section Title
      stats_section_title VARCHAR(255) DEFAULT 'Our Impact',
      stats_section_subtitle VARCHAR(500) DEFAULT 'Trusted by thousands of learners worldwide',
      stats_visible BOOLEAN DEFAULT true,
      
      published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 4. Button Texts Table
  await pgClient.query(`
    CREATE TABLE IF NOT EXISTS button_texts (
      id SERIAL PRIMARY KEY,
      locale VARCHAR(5) DEFAULT 'en',
      
      -- Homepage Buttons
      hero_primary_button TEXT DEFAULT 'Get Started',
      hero_secondary_button TEXT DEFAULT 'Explore Courses',
      courses_view_all_button TEXT DEFAULT 'View All Courses',
      about_learn_more_button TEXT DEFAULT 'Learn More',
      testimonials_read_more_button TEXT DEFAULT 'Read More Reviews',
      
      -- Course Buttons
      course_enroll_button TEXT DEFAULT 'Enroll Now',
      course_learn_more_button TEXT DEFAULT 'Learn More',
      course_preview_button TEXT DEFAULT 'Preview',
      course_wishlist_button TEXT DEFAULT 'Add to Wishlist',
      
      -- Contact & Form Buttons
      contact_send_button TEXT DEFAULT 'Send Message',
      contact_call_button TEXT DEFAULT 'Call Now',
      newsletter_subscribe_button TEXT DEFAULT 'Subscribe',
      
      -- Career Buttons
      apply_now_button TEXT DEFAULT 'Apply Now',
      download_resume_button TEXT DEFAULT 'Download Resume Template',
      schedule_consultation_button TEXT DEFAULT 'Schedule Consultation',
      
      -- Navigation Buttons
      back_button TEXT DEFAULT 'Back',
      next_button TEXT DEFAULT 'Next',
      continue_button TEXT DEFAULT 'Continue',
      submit_button TEXT DEFAULT 'Submit',
      cancel_button TEXT DEFAULT 'Cancel',
      
      published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 5. Company Logos Table
  await pgClient.query(`
    CREATE TABLE IF NOT EXISTS company_logos (
      id SERIAL PRIMARY KEY,
      locale VARCHAR(5) DEFAULT 'en',
      
      -- Section Info
      section_title VARCHAR(255) DEFAULT 'Trusted by Leading Companies',
      section_subtitle VARCHAR(500) DEFAULT 'Our graduates work at top companies worldwide',
      section_visible BOOLEAN DEFAULT true,
      
      -- Company 1
      company_1_name VARCHAR(255),
      company_1_logo_url VARCHAR(500),
      company_1_website_url VARCHAR(500),
      company_1_visible BOOLEAN DEFAULT true,
      
      -- Company 2
      company_2_name VARCHAR(255),
      company_2_logo_url VARCHAR(500),
      company_2_website_url VARCHAR(500),
      company_2_visible BOOLEAN DEFAULT true,
      
      -- Company 3
      company_3_name VARCHAR(255),
      company_3_logo_url VARCHAR(500),
      company_3_website_url VARCHAR(500),
      company_3_visible BOOLEAN DEFAULT true,
      
      -- Company 4
      company_4_name VARCHAR(255),
      company_4_logo_url VARCHAR(500),
      company_4_website_url VARCHAR(500),
      company_4_visible BOOLEAN DEFAULT true,
      
      -- Company 5
      company_5_name VARCHAR(255),
      company_5_logo_url VARCHAR(500),
      company_5_website_url VARCHAR(500),
      company_5_visible BOOLEAN DEFAULT true,
      
      -- Company 6
      company_6_name VARCHAR(255),
      company_6_logo_url VARCHAR(500),
      company_6_website_url VARCHAR(500),
      company_6_visible BOOLEAN DEFAULT true,
      
      -- Company 7
      company_7_name VARCHAR(255),
      company_7_logo_url VARCHAR(500),
      company_7_website_url VARCHAR(500),
      company_7_visible BOOLEAN DEFAULT true,
      
      -- Company 8
      company_8_name VARCHAR(255),
      company_8_logo_url VARCHAR(500),
      company_8_website_url VARCHAR(500),
      company_8_visible BOOLEAN DEFAULT true,
      
      published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 6. Page Meta Data Table (SEO for each page)
  await pgClient.query(`
    CREATE TABLE IF NOT EXISTS page_meta (
      id SERIAL PRIMARY KEY,
      locale VARCHAR(5) DEFAULT 'en',
      page_slug VARCHAR(100), -- home, about, courses, etc.
      
      -- SEO Fields
      meta_title VARCHAR(255),
      meta_description TEXT,
      meta_keywords TEXT,
      og_title VARCHAR(255),
      og_description TEXT,
      og_image VARCHAR(500),
      og_url VARCHAR(500),
      canonical_url VARCHAR(500),
      
      -- Schema.org structured data
      schema_org_data TEXT, -- JSON string
      
      published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('✅ New tables created successfully');
}

async function addFieldsToExistingTables(pgClient) {
  console.log('📊 Adding fields to existing tables...');

  // Add fields to home_pages table
  const homePageFields = [
    'ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS locale VARCHAR(5) DEFAULT \'en\'',
    
    // Button texts in hero section
    'ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS hero_primary_button_text VARCHAR(255) DEFAULT \'Get Started\'',
    'ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS hero_secondary_button_text VARCHAR(255) DEFAULT \'Explore Courses\'',
    
    // Statistics section
    'ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS stats_section_visible BOOLEAN DEFAULT true',
    'ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS stats_courses_count VARCHAR(50) DEFAULT \'125+\'',
    'ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS stats_learners_count VARCHAR(50) DEFAULT \'14,000+\'',
    'ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS stats_years_count VARCHAR(50) DEFAULT \'10+\'',
    
    // Course section button
    'ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS courses_button_text VARCHAR(255) DEFAULT \'View All Courses\'',
    
    // About section button  
    'ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS about_button_text VARCHAR(255) DEFAULT \'Learn More About Us\'',
    
    // Company logos section
    'ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS companies_section_title VARCHAR(255) DEFAULT \'Trusted by Leading Companies\'',
    'ALTER TABLE home_pages ADD COLUMN IF NOT EXISTS companies_section_subtitle VARCHAR(500) DEFAULT \'Our graduates work at top companies worldwide\''
  ];

  for (const sql of homePageFields) {
    try {
      await pgClient.query(sql);
    } catch (error) {
      console.log(`Field might already exist: ${error.message}`);
    }
  }

  // Add fields to courses table
  const courseFields = [
    'ALTER TABLE courses ADD COLUMN IF NOT EXISTS locale VARCHAR(5) DEFAULT \'en\'',
    'ALTER TABLE courses ADD COLUMN IF NOT EXISTS image_url VARCHAR(500)',
    'ALTER TABLE courses ADD COLUMN IF NOT EXISTS instructor VARCHAR(255)',
    'ALTER TABLE courses ADD COLUMN IF NOT EXISTS level VARCHAR(50) DEFAULT \'Beginner\'',
    'ALTER TABLE courses ADD COLUMN IF NOT EXISTS language VARCHAR(50) DEFAULT \'English\'',
    'ALTER TABLE courses ADD COLUMN IF NOT EXISTS enrollment_count INTEGER DEFAULT 0',
    'ALTER TABLE courses ADD COLUMN IF NOT EXISTS certificate_included BOOLEAN DEFAULT true',
    'ALTER TABLE courses ADD COLUMN IF NOT EXISTS course_url VARCHAR(500)',
    'ALTER TABLE courses ADD COLUMN IF NOT EXISTS preview_url VARCHAR(500)'
  ];

  for (const sql of courseFields) {
    try {
      await pgClient.query(sql);
    } catch (error) {
      console.log(`Field might already exist: ${error.message}`);
    }
  }

  // Add fields to teachers table
  const teacherFields = [
    'ALTER TABLE teachers ADD COLUMN IF NOT EXISTS locale VARCHAR(5) DEFAULT \'en\'',
    'ALTER TABLE teachers ADD COLUMN IF NOT EXISTS image_url VARCHAR(500)',
    'ALTER TABLE teachers ADD COLUMN IF NOT EXISTS specialization VARCHAR(255)',
    'ALTER TABLE teachers ADD COLUMN IF NOT EXISTS experience_years INTEGER',
    'ALTER TABLE teachers ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 5.0',
    'ALTER TABLE teachers ADD COLUMN IF NOT EXISTS students_count INTEGER DEFAULT 0',
    'ALTER TABLE teachers ADD COLUMN IF NOT EXISTS courses_count INTEGER DEFAULT 0'
  ];

  for (const sql of teacherFields) {
    try {
      await pgClient.query(sql);
    } catch (error) {
      console.log(`Field might already exist: ${error.message}`);
    }
  }

  console.log('✅ Fields added to existing tables');
}

async function seedNewTables(pgClient) {
  console.log('🌱 Seeding new tables with initial data...');

  // Seed site_settings for each language
  const languages = ['en', 'ru', 'he'];
  
  for (const locale of languages) {
    // Site Settings
    await pgClient.query(`
      INSERT INTO site_settings (
        locale, site_name, site_tagline, logo_url, 
        footer_email, footer_phone, footer_copyright,
        meta_description
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT DO NOTHING
    `, [
      locale,
      locale === 'en' ? 'AI Studio' : locale === 'ru' ? 'AI Студия' : 'סטודיו בינה מלאכותית',
      locale === 'en' ? 'Master AI with Expert-Led Courses' : 
      locale === 'ru' ? 'Овладейте ИИ с курсами от экспертов' : 
      'למד בינה מלאכותית עם קורסים מומחים',
      'https://uploads-ssl.webflow.com/logo.png',
      'info@aistudio555.com',
      '+1 (555) 123-4567',
      locale === 'en' ? '© 2024 AI Studio. All rights reserved.' : 
      locale === 'ru' ? '© 2024 AI Студия. Все права защищены.' : 
      '© 2024 סטודיו בינה מלאכותית. כל הזכויות שמורות.',
      locale === 'en' ? 'Learn AI with expert-led courses, hands-on projects, and career support.' :
      locale === 'ru' ? 'Изучайте ИИ с курсами от экспертов, практическими проектами и поддержкой карьеры.' :
      'למד בינה מלאכותית עם קורסים מומחים, פרויקטים מעשיים ותמיכה בקריירה.'
    ]);

    // Navigation Menu
    await pgClient.query(`
      INSERT INTO navigation_menus (locale) VALUES ($1)
      ON CONFLICT DO NOTHING
    `, [locale]);

    // Statistics
    await pgClient.query(`
      INSERT INTO statistics (
        locale, courses_count, learners_count, years_count,
        courses_label, learners_label, years_label,
        stats_section_title, stats_section_subtitle
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT DO NOTHING
    `, [
      locale,
      '125+',
      '14,000+', 
      '10+',
      locale === 'en' ? 'Courses' : locale === 'ru' ? 'Курсы' : 'קורסים',
      locale === 'en' ? 'Learners' : locale === 'ru' ? 'Учеников' : 'לומדים',
      locale === 'en' ? 'Years' : locale === 'ru' ? 'Лет' : 'שנים',
      locale === 'en' ? 'Our Impact' : locale === 'ru' ? 'Наше влияние' : 'ההשפעה שלנו',
      locale === 'en' ? 'Trusted by thousands of learners worldwide' : 
      locale === 'ru' ? 'Доверие тысяч студентов по всему миру' : 
      'נבחר על ידי אלפי לומדים ברחבי העולם'
    ]);

    // Button Texts
    await pgClient.query(`
      INSERT INTO button_texts (locale) VALUES ($1)
      ON CONFLICT DO NOTHING
    `, [locale]);

    // Company Logos
    await pgClient.query(`
      INSERT INTO company_logos (
        locale, section_title, section_subtitle,
        company_1_name, company_1_logo_url,
        company_2_name, company_2_logo_url,
        company_3_name, company_3_logo_url,
        company_4_name, company_4_logo_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT DO NOTHING
    `, [
      locale,
      locale === 'en' ? 'Trusted by Leading Companies' : 
      locale === 'ru' ? 'Доверие ведущих компаний' : 
      'נבחר על ידי חברות מובילות',
      locale === 'en' ? 'Our graduates work at top companies worldwide' :
      locale === 'ru' ? 'Наши выпускники работают в ведущих компаниях мира' :
      'הבוגרים שלנו עובדים בחברות הטובות בעולם',
      'Google',
      'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
      'Microsoft', 
      'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
      'Amazon',
      'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
      'Meta',
      'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg'
    ]);
  }

  console.log('✅ Initial data seeded successfully');
}

// Export for use in server.js
module.exports = { addMissingFields };

// Run if called directly
if (require.main === module) {
  addMissingFields();
}