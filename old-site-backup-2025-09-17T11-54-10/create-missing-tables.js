/**
 * CREATE MISSING DATABASE TABLES
 * Fixes critical QA issues by creating all missing tables for comprehensive admin system
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// SQLite database path (same as used in server.js)
const SQLITE_PATH = path.join(__dirname, 'strapi-fresh/.tmp/data.db');

async function createMissingTables() {
  console.log('🔧 FIXING QA ISSUES: Creating missing database tables...');
  
  const db = new sqlite3.Database(SQLITE_PATH);

  return new Promise((resolve, reject) => {
    db.serialize(() => {
      
      // 1. Create teachers table
      console.log('📚 Creating teachers table...');
      db.run(`
        CREATE TABLE IF NOT EXISTS teachers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          locale TEXT DEFAULT 'en',
          
          -- Basic Info
          name TEXT,
          title TEXT,
          bio TEXT,
          image_url TEXT,
          email TEXT,
          phone TEXT,
          
          -- Professional Details
          specialization TEXT,
          years_experience INTEGER,
          education TEXT,
          certifications TEXT,
          
          -- Social Links
          linkedin_url TEXT,
          twitter_url TEXT,
          website_url TEXT,
          
          -- Display Settings
          featured INTEGER DEFAULT 0,
          display_order INTEGER DEFAULT 0,
          visible INTEGER DEFAULT 1,
          
          published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 2. Create blog_posts table
      console.log('📝 Creating blog_posts table...');
      db.run(`
        CREATE TABLE IF NOT EXISTS blog_posts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          locale TEXT DEFAULT 'en',
          
          -- Content
          title TEXT,
          slug TEXT,
          excerpt TEXT,
          content TEXT,
          featured_image TEXT,
          
          -- Meta
          author_name TEXT,
          author_image TEXT,
          category TEXT,
          tags TEXT,
          
          -- SEO
          meta_title TEXT,
          meta_description TEXT,
          
          -- Display
          featured INTEGER DEFAULT 0,
          published INTEGER DEFAULT 1,
          reading_time INTEGER,
          
          published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 3. Create about_pages table
      console.log('ℹ️ Creating about_pages table...');
      db.run(`
        CREATE TABLE IF NOT EXISTS about_pages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          locale TEXT DEFAULT 'en',
          
          -- Hero Section
          hero_title TEXT DEFAULT 'About AI Studio',
          hero_subtitle TEXT,
          hero_description TEXT,
          hero_image TEXT,
          
          -- Company Story
          story_title TEXT DEFAULT 'Our Story',
          story_content TEXT,
          
          -- Mission & Vision
          mission_title TEXT DEFAULT 'Our Mission',
          mission_content TEXT,
          vision_title TEXT DEFAULT 'Our Vision',
          vision_content TEXT,
          
          -- Values
          values_title TEXT DEFAULT 'Our Values',
          value_1_title TEXT,
          value_1_description TEXT,
          value_2_title TEXT,
          value_2_description TEXT,
          value_3_title TEXT,
          value_3_description TEXT,
          
          -- Team Section
          team_title TEXT DEFAULT 'Meet Our Team',
          team_description TEXT,
          
          -- Stats/Achievements
          stats_title TEXT DEFAULT 'Our Achievements',
          stat_1_number TEXT,
          stat_1_label TEXT,
          stat_2_number TEXT,
          stat_2_label TEXT,
          stat_3_number TEXT,
          stat_3_label TEXT,
          
          published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 4. Create contact_pages table
      console.log('📞 Creating contact_pages table...');
      db.run(`
        CREATE TABLE IF NOT EXISTS contact_pages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          locale TEXT DEFAULT 'en',
          
          -- Page Content
          page_title TEXT DEFAULT 'Contact Us',
          hero_title TEXT DEFAULT 'Get in Touch',
          hero_description TEXT,
          
          -- Contact Information
          office_address TEXT,
          office_phone TEXT,
          office_email TEXT,
          office_hours TEXT,
          
          -- Contact Form
          form_title TEXT DEFAULT 'Send us a message',
          form_description TEXT,
          
          -- Map & Location
          map_embed_url TEXT,
          map_title TEXT DEFAULT 'Find Our Office',
          
          -- Additional Info
          support_email TEXT,
          sales_email TEXT,
          emergency_phone TEXT,
          
          -- Social Media
          facebook_url TEXT,
          instagram_url TEXT,
          linkedin_url TEXT,
          twitter_url TEXT,
          
          published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 5. Create faqs table
      console.log('❓ Creating faqs table...');
      db.run(`
        CREATE TABLE IF NOT EXISTS faqs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          locale TEXT DEFAULT 'en',
          
          -- FAQ Content
          question TEXT,
          answer TEXT,
          
          -- Organization
          category TEXT DEFAULT 'general',
          display_order INTEGER DEFAULT 0,
          
          -- Display
          featured INTEGER DEFAULT 0,
          visible INTEGER DEFAULT 1,
          
          published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 6. Create career_resources table
      console.log('📄 Creating career_resources table...');
      db.run(`
        CREATE TABLE IF NOT EXISTS career_resources (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          locale TEXT DEFAULT 'en',
          
          -- Resource Info
          title TEXT,
          description TEXT,
          resource_type TEXT, -- 'document', 'video', 'article', 'template'
          
          -- Content
          content TEXT,
          download_url TEXT,
          external_url TEXT,
          
          -- Meta
          category TEXT,
          tags TEXT,
          difficulty_level TEXT, -- 'beginner', 'intermediate', 'advanced'
          
          -- Display
          featured INTEGER DEFAULT 0,
          display_order INTEGER DEFAULT 0,
          visible INTEGER DEFAULT 1,
          
          published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 7. Create career_center_pages table
      console.log('🎯 Creating career_center_pages table...');
      db.run(`
        CREATE TABLE IF NOT EXISTS career_center_pages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          locale TEXT DEFAULT 'en',
          
          -- Hero Section
          hero_title TEXT DEFAULT 'Career Center',
          hero_subtitle TEXT,
          hero_description TEXT,
          hero_image TEXT,
          
          -- Services Section
          services_title TEXT DEFAULT 'Our Services',
          services_description TEXT,
          
          -- Service 1
          service_1_title TEXT DEFAULT 'Career Consultation',
          service_1_description TEXT,
          service_1_icon TEXT,
          
          -- Service 2
          service_2_title TEXT DEFAULT 'Resume Review',
          service_2_description TEXT,
          service_2_icon TEXT,
          
          -- Service 3
          service_3_title TEXT DEFAULT 'Interview Preparation',
          service_3_description TEXT,
          service_3_icon TEXT,
          
          -- CTA Section
          cta_title TEXT DEFAULT 'Ready to Start?',
          cta_description TEXT,
          cta_button_text TEXT DEFAULT 'Schedule Consultation',
          cta_button_url TEXT,
          
          -- Contact Info
          consultation_phone TEXT,
          consultation_email TEXT,
          booking_url TEXT,
          
          published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 8. Create career_orientation_pages table
      console.log('🧭 Creating career_orientation_pages table...');
      db.run(`
        CREATE TABLE IF NOT EXISTS career_orientation_pages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          locale TEXT DEFAULT 'en',
          
          -- Hero Section
          hero_title TEXT DEFAULT 'Career Orientation',
          hero_subtitle TEXT,
          hero_description TEXT,
          hero_image TEXT,
          
          -- Introduction
          intro_title TEXT DEFAULT 'Find Your Path',
          intro_content TEXT,
          
          -- Career Paths
          paths_title TEXT DEFAULT 'Career Paths',
          
          -- Path 1: AI/ML
          path_1_title TEXT DEFAULT 'AI & Machine Learning',
          path_1_description TEXT,
          path_1_skills TEXT,
          path_1_salary_range TEXT,
          path_1_job_titles TEXT,
          
          -- Path 2: Data Science
          path_2_title TEXT DEFAULT 'Data Science',
          path_2_description TEXT,
          path_2_skills TEXT,
          path_2_salary_range TEXT,
          path_2_job_titles TEXT,
          
          -- Path 3: Software Development
          path_3_title TEXT DEFAULT 'Software Development',
          path_3_description TEXT,
          path_3_skills TEXT,
          path_3_salary_range TEXT,
          path_3_job_titles TEXT,
          
          -- Assessment Section
          assessment_title TEXT DEFAULT 'Career Assessment',
          assessment_description TEXT,
          assessment_button_text TEXT DEFAULT 'Take Assessment',
          assessment_url TEXT,
          
          -- Resources
          resources_title TEXT DEFAULT 'Career Resources',
          resources_description TEXT,
          
          published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      console.log('🌱 Seeding tables with sample data...');
      
      // Seed teachers table
      db.run(`
        INSERT OR IGNORE INTO teachers (
          name, title, bio, specialization, years_experience
        ) VALUES (?, ?, ?, ?, ?)
      `, [
        'Dr. Sarah Johnson',
        'AI Research Scientist',
        'Leading expert in machine learning with 10+ years experience at top tech companies.',
        'Machine Learning & AI',
        10
      ]);

      // Seed about_pages table
      db.run(`
        INSERT OR IGNORE INTO about_pages (
          hero_title, hero_description, story_content, mission_content
        ) VALUES (?, ?, ?, ?)
      `, [
        'About AI Studio',
        'We are passionate about making AI education accessible to everyone.',
        'Founded in 2020, AI Studio has been at the forefront of AI education.',
        'To democratize AI education and empower the next generation of AI professionals.'
      ]);

      // Seed contact_pages table
      db.run(`
        INSERT OR IGNORE INTO contact_pages (
          office_address, office_phone, office_email, office_hours
        ) VALUES (?, ?, ?, ?)
      `, [
        '123 Tech Street, Innovation City, IC 12345',
        '+1 (555) 123-4567',
        'info@aistudio555.com',
        'Mon-Fri: 9AM-6PM PST'
      ]);

      // Seed faqs table
      db.run(`
        INSERT OR IGNORE INTO faqs (
          question, answer, category
        ) VALUES (?, ?, ?)
      `, [
        'What is AI Studio?',
        'AI Studio is a comprehensive platform for learning artificial intelligence and machine learning.',
        'general'
      ]);

      // 9. Create pricing_plans table  
      console.log('💰 Creating pricing_plans table...');
      db.run(`
        CREATE TABLE IF NOT EXISTS pricing_plans (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          locale TEXT DEFAULT 'en',
          
          -- Page Content
          page_title TEXT DEFAULT 'Pricing Plans',
          hero_title TEXT DEFAULT 'Choose Your Plan',
          hero_description TEXT,
          
          -- Plan 1 - Basic
          plan_1_name TEXT DEFAULT 'Basic',
          plan_1_price TEXT DEFAULT '$99',
          plan_1_duration TEXT DEFAULT '/month',
          plan_1_description TEXT,
          plan_1_features TEXT,
          plan_1_popular INTEGER DEFAULT 0,
          plan_1_button_text TEXT DEFAULT 'Get Started',
          plan_1_button_url TEXT,
          
          -- Plan 2 - Premium  
          plan_2_name TEXT DEFAULT 'Premium',
          plan_2_price TEXT DEFAULT '$199',
          plan_2_duration TEXT DEFAULT '/month',
          plan_2_description TEXT,
          plan_2_features TEXT,
          plan_2_popular INTEGER DEFAULT 1,
          plan_2_button_text TEXT DEFAULT 'Get Started',
          plan_2_button_url TEXT,
          
          -- Plan 3 - Enterprise
          plan_3_name TEXT DEFAULT 'Enterprise',
          plan_3_price TEXT DEFAULT 'Custom',
          plan_3_duration TEXT DEFAULT '',
          plan_3_description TEXT,
          plan_3_features TEXT,
          plan_3_popular INTEGER DEFAULT 0,
          plan_3_button_text TEXT DEFAULT 'Contact Us',
          plan_3_button_url TEXT,
          
          -- Additional Info
          discount_text TEXT,
          guarantee_text TEXT DEFAULT '30-day money-back guarantee',
          faq_section_title TEXT DEFAULT 'Frequently Asked Questions',
          
          published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 10. Create job_postings table
      console.log('💼 Creating job_postings table...');
      db.run(`
        CREATE TABLE IF NOT EXISTS job_postings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          locale TEXT DEFAULT 'en',
          
          -- Job Info
          title TEXT,
          company TEXT DEFAULT 'AI Studio',
          department TEXT,
          location TEXT,
          job_type TEXT DEFAULT 'full-time', -- 'full-time', 'part-time', 'contract', 'remote'
          salary_range TEXT,
          
          -- Description
          description TEXT,
          requirements TEXT,
          benefits TEXT,
          
          -- Application
          apply_url TEXT,
          apply_email TEXT,
          application_deadline DATE,
          
          -- Meta
          experience_level TEXT, -- 'entry', 'mid', 'senior', 'executive'
          skills_required TEXT,
          remote_work INTEGER DEFAULT 0,
          
          -- Display
          featured INTEGER DEFAULT 0,
          urgent INTEGER DEFAULT 0,
          visible INTEGER DEFAULT 1,
          display_order INTEGER DEFAULT 0,
          
          published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      console.log('🌱 Seeding additional tables with sample data...');
      
      // Seed pricing_plans table
      db.run(`
        INSERT OR IGNORE INTO pricing_plans (
          plan_1_name, plan_1_price, plan_1_features,
          plan_2_name, plan_2_price, plan_2_features,
          plan_3_name, plan_3_price, plan_3_features
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        'Basic', '$99', 'Access to basic courses\nCertificate of completion\nEmail support',
        'Premium', '$199', 'Access to all courses\nPersonalized learning path\nPriority support\nJob placement assistance',
        'Enterprise', 'Custom', 'Custom training programs\nDedicated support manager\nOn-site training\nAdvanced analytics'
      ]);

      // Seed job_postings table
      db.run(`
        INSERT OR IGNORE INTO job_postings (
          title, department, location, description, requirements
        ) VALUES (?, ?, ?, ?, ?)
      `, [
        'AI Engineer',
        'Engineering',
        'Remote / San Francisco',
        'Join our team to build cutting-edge AI solutions that impact millions of users.',
        'BS/MS in Computer Science\n3+ years AI/ML experience\nPython, TensorFlow, PyTorch'
      ]);

      console.log('✅ All missing database tables created successfully!');
      db.close();
      resolve();
    });
  });
}

// Run if called directly
if (require.main === module) {
  createMissingTables()
    .then(() => {
      console.log('🎉 Database migration complete!');
      console.log('🔍 Ready for QA re-testing');
      process.exit(0);
    })
    .catch(err => {
      console.error('❌ Migration failed:', err);
      process.exit(1);
    });
}

module.exports = { createMissingTables };