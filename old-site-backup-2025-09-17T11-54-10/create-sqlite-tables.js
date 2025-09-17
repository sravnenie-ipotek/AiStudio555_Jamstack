/**
 * CREATE SQLITE TABLES FOR LOCAL DEVELOPMENT
 * Creates the missing tables in local SQLite for testing
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// SQLite database path (same as used in server.js)
const SQLITE_PATH = path.join(__dirname, 'strapi-fresh/.tmp/data.db');

async function createSQLiteTables() {
  console.log('🚀 Creating missing tables in local SQLite...');
  
  const db = new sqlite3.Database(SQLITE_PATH);

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create site_settings table
      db.run(`
        CREATE TABLE IF NOT EXISTS site_settings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          locale TEXT DEFAULT 'en',
          site_name TEXT,
          site_tagline TEXT,
          logo_url TEXT,
          logo_alt_text TEXT,
          favicon_url TEXT,
          primary_color TEXT DEFAULT '#007aff',
          secondary_color TEXT DEFAULT '#667eea',
          
          -- Footer Information
          footer_email TEXT,
          footer_phone TEXT,
          footer_address TEXT,
          footer_copyright TEXT,
          
          -- Social Media Links
          facebook_url TEXT,
          twitter_url TEXT,
          instagram_url TEXT,
          linkedin_url TEXT,
          youtube_url TEXT,
          telegram_url TEXT,
          whatsapp_number TEXT,
          
          -- SEO Settings
          meta_description TEXT,
          meta_keywords TEXT,
          google_analytics_id TEXT,
          facebook_pixel_id TEXT,
          
          published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create navigation_menus table
      db.run(`
        CREATE TABLE IF NOT EXISTS navigation_menus (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          locale TEXT DEFAULT 'en',
          menu_type TEXT DEFAULT 'main',
          
          -- Main Navigation Items
          home_label TEXT DEFAULT 'Home',
          home_url TEXT DEFAULT '/home.html',
          about_label TEXT DEFAULT 'About',
          about_url TEXT DEFAULT '/about-us.html',
          courses_label TEXT DEFAULT 'Courses',
          courses_url TEXT DEFAULT '/courses.html',
          teachers_label TEXT DEFAULT 'Teachers',
          teachers_url TEXT DEFAULT '/teachers.html',
          pricing_label TEXT DEFAULT 'Pricing',
          pricing_url TEXT DEFAULT '/pricing.html',
          contact_label TEXT DEFAULT 'Contact',
          contact_url TEXT DEFAULT '/contact-us.html',
          blog_label TEXT DEFAULT 'Blog',
          blog_url TEXT DEFAULT '/blog.html',
          
          -- Career Services Dropdown
          career_services_label TEXT DEFAULT 'Career Services',
          career_center_label TEXT DEFAULT 'Career Center',
          career_center_url TEXT DEFAULT '/career-center.html',
          career_orientation_label TEXT DEFAULT 'Career Orientation',
          career_orientation_url TEXT DEFAULT '/career-orientation.html',
          job_board_label TEXT DEFAULT 'Job Board',
          job_board_url TEXT DEFAULT '/jobs.html',
          
          -- Mobile Menu
          menu_toggle_label TEXT DEFAULT 'Menu',
          
          published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create statistics table
      db.run(`
        CREATE TABLE IF NOT EXISTS statistics (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          locale TEXT DEFAULT 'en',
          
          -- Homepage Statistics
          courses_count TEXT DEFAULT '125+',
          courses_label TEXT DEFAULT 'Courses',
          learners_count TEXT DEFAULT '14,000+',
          learners_label TEXT DEFAULT 'Learners',
          years_count TEXT DEFAULT '10+',
          years_label TEXT DEFAULT 'Years',
          
          -- Additional Stats
          instructors_count TEXT,
          instructors_label TEXT DEFAULT 'Expert Instructors',
          certificates_count TEXT,
          certificates_label TEXT DEFAULT 'Certificates Issued',
          success_rate TEXT,
          success_rate_label TEXT DEFAULT 'Success Rate',
          
          -- Stats Section Title
          stats_section_title TEXT DEFAULT 'Our Impact',
          stats_section_subtitle TEXT DEFAULT 'Trusted by thousands of learners worldwide',
          stats_visible INTEGER DEFAULT 1,
          
          published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create button_texts table
      db.run(`
        CREATE TABLE IF NOT EXISTS button_texts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          locale TEXT DEFAULT 'en',
          
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
          
          published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create company_logos table
      db.run(`
        CREATE TABLE IF NOT EXISTS company_logos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          locale TEXT DEFAULT 'en',
          
          -- Section Info
          section_title TEXT DEFAULT 'Trusted by Leading Companies',
          section_subtitle TEXT DEFAULT 'Our graduates work at top companies worldwide',
          section_visible INTEGER DEFAULT 1,
          
          -- Company 1-8
          company_1_name TEXT,
          company_1_logo_url TEXT,
          company_1_website_url TEXT,
          company_1_visible INTEGER DEFAULT 1,
          
          company_2_name TEXT,
          company_2_logo_url TEXT,
          company_2_website_url TEXT,
          company_2_visible INTEGER DEFAULT 1,
          
          company_3_name TEXT,
          company_3_logo_url TEXT,
          company_3_website_url TEXT,
          company_3_visible INTEGER DEFAULT 1,
          
          company_4_name TEXT,
          company_4_logo_url TEXT,
          company_4_website_url TEXT,
          company_4_visible INTEGER DEFAULT 1,
          
          company_5_name TEXT,
          company_5_logo_url TEXT,
          company_5_website_url TEXT,
          company_5_visible INTEGER DEFAULT 1,
          
          company_6_name TEXT,
          company_6_logo_url TEXT,
          company_6_website_url TEXT,
          company_6_visible INTEGER DEFAULT 1,
          
          company_7_name TEXT,
          company_7_logo_url TEXT,
          company_7_website_url TEXT,
          company_7_visible INTEGER DEFAULT 1,
          
          company_8_name TEXT,
          company_8_logo_url TEXT,
          company_8_website_url TEXT,
          company_8_visible INTEGER DEFAULT 1,
          
          published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create page_meta table
      db.run(`
        CREATE TABLE IF NOT EXISTS page_meta (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          locale TEXT DEFAULT 'en',
          page_slug TEXT,
          
          -- SEO Fields
          meta_title TEXT,
          meta_description TEXT,
          meta_keywords TEXT,
          og_title TEXT,
          og_description TEXT,
          og_image TEXT,
          og_url TEXT,
          canonical_url TEXT,
          
          -- Schema.org structured data
          schema_org_data TEXT,
          
          published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, function(err) {
        if (err) {
          console.error('❌ Error creating tables:', err);
          reject(err);
        } else {
          console.log('✅ SQLite tables created successfully');
          
          // Seed with some initial data
          seedSQLiteData(db, resolve, reject);
        }
      });
    });
  });
}

function seedSQLiteData(db, resolve, reject) {
  console.log('🌱 Seeding SQLite tables with initial data...');
  
  // Seed site_settings
  db.run(`
    INSERT OR IGNORE INTO site_settings (
      locale, site_name, site_tagline, logo_url, 
      footer_email, footer_phone, footer_copyright,
      meta_description
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    'en',
    'AI Studio',
    'Master AI with Expert-Led Courses',
    'https://uploads-ssl.webflow.com/logo.png',
    'info@aistudio555.com',
    '+1 (555) 123-4567',
    '© 2024 AI Studio. All rights reserved.',
    'Learn AI with expert-led courses, hands-on projects, and career support.'
  ]);

  // Seed navigation_menus
  db.run(`
    INSERT OR IGNORE INTO navigation_menus (locale) VALUES (?)
  `, ['en']);

  // Seed statistics
  db.run(`
    INSERT OR IGNORE INTO statistics (
      locale, courses_count, learners_count, years_count,
      courses_label, learners_label, years_label,
      stats_section_title, stats_section_subtitle
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    'en',
    '125+',
    '14,000+', 
    '10+',
    'Courses',
    'Learners',
    'Years',
    'Our Impact',
    'Trusted by thousands of learners worldwide'
  ]);

  // Seed button_texts
  db.run(`
    INSERT OR IGNORE INTO button_texts (locale) VALUES (?)
  `, ['en']);

  // Seed company_logos
  db.run(`
    INSERT OR IGNORE INTO company_logos (
      locale, section_title, section_subtitle,
      company_1_name, company_1_logo_url,
      company_2_name, company_2_logo_url,
      company_3_name, company_3_logo_url,
      company_4_name, company_4_logo_url
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    'en',
    'Trusted by Leading Companies',
    'Our graduates work at top companies worldwide',
    'Google',
    'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    'Microsoft', 
    'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    'Amazon',
    'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    'Meta',
    'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg'
  ], function(err) {
    if (err) {
      console.error('❌ Error seeding data:', err);
      reject(err);
    } else {
      console.log('✅ SQLite tables seeded with initial data');
      db.close();
      resolve();
    }
  });
}

// Run if called directly
if (require.main === module) {
  createSQLiteTables()
    .then(() => {
      console.log('🎉 SQLite setup complete!');
      process.exit(0);
    })
    .catch(err => {
      console.error('❌ SQLite setup failed:', err);
      process.exit(1);
    });
}

module.exports = { createSQLiteTables };