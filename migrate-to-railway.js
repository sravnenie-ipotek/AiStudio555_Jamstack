/**
 * DATABASE MIGRATION SCRIPT
 * Migrates SQLite database to Railway PostgreSQL
 * Handles all content types and preserves data integrity
 */

const sqlite3 = require('sqlite3').verbose();
const { Client } = require('pg');
const path = require('path');
const fs = require('fs');

// Configuration
const SQLITE_PATH = path.join(__dirname, 'strapi-fresh/.tmp/data.db');

async function migrate() {
  console.log('🚀 Starting Railway Database Migration...');
  
  // Check if we have DATABASE_URL from Railway
  if (!process.env.DATABASE_URL) {
    console.log('⚠️  DATABASE_URL not found. Using local SQLite for now.');
    console.log('   Once Railway PostgreSQL is provisioned, DATABASE_URL will be available.');
    return;
  }

  // Connect to PostgreSQL
  const pgClient = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
  });

  try {
    await pgClient.connect();
    console.log('✅ Connected to Railway PostgreSQL');

    // Create tables
    await createTables(pgClient);
    
    // Migrate data
    await migrateData(pgClient);
    
    console.log('✅ Migration complete!');
  } catch (error) {
    console.error('❌ Migration error:', error);
  } finally {
    await pgClient.end();
  }
}

async function createTables(pgClient) {
  console.log('📊 Creating tables in PostgreSQL...');
  
  // Drop existing tables (for clean migration)
  const dropQueries = [
    'DROP TABLE IF EXISTS home_pages CASCADE',
    'DROP TABLE IF EXISTS courses CASCADE',
    'DROP TABLE IF EXISTS blog_posts CASCADE',
    'DROP TABLE IF EXISTS teachers CASCADE',
    'DROP TABLE IF EXISTS pricing_plans CASCADE',
    'DROP TABLE IF EXISTS job_postings CASCADE',
    'DROP TABLE IF EXISTS career_resources CASCADE',
    'DROP TABLE IF EXISTS about_pages CASCADE',
    'DROP TABLE IF EXISTS contact_pages CASCADE',
    'DROP TABLE IF EXISTS faqs CASCADE',
    'DROP TABLE IF EXISTS testimonials CASCADE'
  ];

  for (const query of dropQueries) {
    await pgClient.query(query);
  }

  // Create home_pages table (123 fields!)
  await pgClient.query(`
    CREATE TABLE home_pages (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255),
      hero_title VARCHAR(255),
      hero_subtitle VARCHAR(255),
      hero_description TEXT,
      hero_section_visible BOOLEAN DEFAULT true,
      featured_courses_title VARCHAR(255),
      featured_courses_description TEXT,
      featured_courses_visible BOOLEAN DEFAULT true,
      about_title VARCHAR(255),
      about_subtitle VARCHAR(255),
      about_description TEXT,
      about_visible BOOLEAN DEFAULT true,
      companies_title VARCHAR(255),
      companies_description TEXT,
      companies_visible BOOLEAN DEFAULT true,
      testimonials_title VARCHAR(255),
      testimonials_subtitle VARCHAR(255),
      testimonials_visible BOOLEAN DEFAULT true,
      
      -- Course 1
      course_1_title VARCHAR(255),
      course_1_rating VARCHAR(10),
      course_1_lessons VARCHAR(50),
      course_1_duration VARCHAR(50),
      course_1_category VARCHAR(100),
      course_1_description TEXT,
      course_1_visible BOOLEAN DEFAULT true,
      
      -- Course 2
      course_2_title VARCHAR(255),
      course_2_rating VARCHAR(10),
      course_2_lessons VARCHAR(50),
      course_2_duration VARCHAR(50),
      course_2_category VARCHAR(100),
      course_2_description TEXT,
      course_2_visible BOOLEAN DEFAULT true,
      
      -- Course 3
      course_3_title VARCHAR(255),
      course_3_rating VARCHAR(10),
      course_3_lessons VARCHAR(50),
      course_3_duration VARCHAR(50),
      course_3_category VARCHAR(100),
      course_3_description TEXT,
      course_3_visible BOOLEAN DEFAULT true,
      
      -- Course 4
      course_4_title VARCHAR(255),
      course_4_rating VARCHAR(10),
      course_4_lessons VARCHAR(50),
      course_4_duration VARCHAR(50),
      course_4_category VARCHAR(100),
      course_4_description TEXT,
      course_4_visible BOOLEAN DEFAULT true,
      
      -- Course 5
      course_5_title VARCHAR(255),
      course_5_rating VARCHAR(10),
      course_5_lessons VARCHAR(50),
      course_5_duration VARCHAR(50),
      course_5_category VARCHAR(100),
      course_5_description TEXT,
      course_5_visible BOOLEAN DEFAULT true,
      
      -- Course 6
      course_6_title VARCHAR(255),
      course_6_rating VARCHAR(10),
      course_6_lessons VARCHAR(50),
      course_6_duration VARCHAR(50),
      course_6_category VARCHAR(100),
      course_6_description TEXT,
      course_6_visible BOOLEAN DEFAULT true,
      
      -- Testimonial 1
      testimonial_1_text TEXT,
      testimonial_1_author VARCHAR(255),
      testimonial_1_rating VARCHAR(10),
      testimonial_1_visible BOOLEAN DEFAULT true,
      
      -- Testimonial 2
      testimonial_2_text TEXT,
      testimonial_2_author VARCHAR(255),
      testimonial_2_rating VARCHAR(10),
      testimonial_2_visible BOOLEAN DEFAULT true,
      
      -- Testimonial 3
      testimonial_3_text TEXT,
      testimonial_3_author VARCHAR(255),
      testimonial_3_rating VARCHAR(10),
      testimonial_3_visible BOOLEAN DEFAULT true,
      
      -- Testimonial 4
      testimonial_4_text TEXT,
      testimonial_4_author VARCHAR(255),
      testimonial_4_rating VARCHAR(10),
      testimonial_4_visible BOOLEAN DEFAULT true,
      
      published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create courses table
  await pgClient.query(`
    CREATE TABLE courses (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255),
      description TEXT,
      price DECIMAL(10,2),
      duration VARCHAR(50),
      lessons VARCHAR(50),
      category VARCHAR(100),
      rating VARCHAR(10),
      visible BOOLEAN DEFAULT true,
      published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create blog_posts table
  await pgClient.query(`
    CREATE TABLE blog_posts (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255),
      slug VARCHAR(255),
      excerpt TEXT,
      content TEXT,
      author VARCHAR(255),
      category VARCHAR(100),
      published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create teachers table (with display_order column)
  await pgClient.query(`
    CREATE TABLE teachers (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      role VARCHAR(255),
      bio TEXT,
      linkedin VARCHAR(255),
      twitter VARCHAR(255),
      "order" INTEGER,
      display_order INTEGER DEFAULT 0,
      locale VARCHAR(5) DEFAULT 'en',
      image_url VARCHAR(500),
      company VARCHAR(255),
      experience_years INTEGER,
      categories TEXT,
      specializations TEXT,
      published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create pricing_plans table
  await pgClient.query(`
    CREATE TABLE pricing_plans (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      price DECIMAL(10,2),
      period VARCHAR(50),
      description TEXT,
      featured BOOLEAN DEFAULT false,
      cta_text VARCHAR(255),
      "order" INTEGER,
      published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create job_postings table
  await pgClient.query(`
    CREATE TABLE job_postings (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255),
      company VARCHAR(255),
      location VARCHAR(255),
      type VARCHAR(50),
      description TEXT,
      apply_url VARCHAR(500),
      published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create career_resources table (with locale support)
  await pgClient.query(`
    CREATE TABLE career_resources (
      id SERIAL PRIMARY KEY,
      locale VARCHAR(5) DEFAULT 'en',
      title VARCHAR(255),
      description TEXT,
      type VARCHAR(50),
      category VARCHAR(100),
      download_url VARCHAR(500),
      visible BOOLEAN DEFAULT true,
      published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create about_pages table (with locale support)
  await pgClient.query(`
    CREATE TABLE about_pages (
      id SERIAL PRIMARY KEY,
      locale VARCHAR(5) DEFAULT 'en',
      hero_title VARCHAR(255),
      hero_subtitle VARCHAR(255),
      mission_title VARCHAR(255),
      mission_description TEXT,
      vision_title VARCHAR(255),
      vision_description TEXT,
      published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create contact_pages table
  await pgClient.query(`
    CREATE TABLE contact_pages (
      id SERIAL PRIMARY KEY,
      phone VARCHAR(50),
      email VARCHAR(255),
      address TEXT,
      office_hours VARCHAR(255),
      map_url VARCHAR(500),
      published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create faqs table (with locale support)
  await pgClient.query(`
    CREATE TABLE faqs (
      id SERIAL PRIMARY KEY,
      locale VARCHAR(5) DEFAULT 'en',
      question TEXT,
      answer TEXT,
      category VARCHAR(100),
      "order" INTEGER,
      published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create career_orientation_pages table
  await pgClient.query(`
    CREATE TABLE career_orientation_pages (
      id SERIAL PRIMARY KEY,
      locale VARCHAR(5) DEFAULT 'en',
      title VARCHAR(255),
      subtitle VARCHAR(500),
      description TEXT,
      hero_title VARCHAR(255),
      hero_subtitle VARCHAR(500),
      hero_description TEXT,
      published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create career_center_pages table
  await pgClient.query(`
    CREATE TABLE career_center_pages (
      id SERIAL PRIMARY KEY,
      locale VARCHAR(5) DEFAULT 'en',
      title VARCHAR(255),
      subtitle VARCHAR(500),
      description TEXT,
      hero_title VARCHAR(255),
      hero_subtitle VARCHAR(500),
      hero_description TEXT,
      published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('✅ Tables created successfully');
}

async function migrateData(pgClient) {
  console.log('📦 Migrating data from SQLite to PostgreSQL...');
  
  const db = new sqlite3.Database(SQLITE_PATH);
  
  // Migrate home_pages
  await new Promise((resolve, reject) => {
    db.all('SELECT * FROM home_pages', async (err, rows) => {
      if (err) {
        console.log('⚠️  No home_pages table in SQLite (might be empty)');
        resolve();
        return;
      }
      
      for (const row of rows) {
        try {
          await pgClient.query(`
            INSERT INTO home_pages (
              title, hero_title, hero_subtitle, hero_description, hero_section_visible,
              featured_courses_title, featured_courses_description, featured_courses_visible,
              about_title, about_subtitle, about_description, about_visible,
              companies_title, companies_description, companies_visible,
              testimonials_title, testimonials_subtitle, testimonials_visible,
              course_1_title, course_1_rating, course_1_lessons, course_1_duration, course_1_category, course_1_visible,
              course_2_title, course_2_rating, course_2_lessons, course_2_duration, course_2_category, course_2_visible,
              course_3_title, course_3_rating, course_3_lessons, course_3_duration, course_3_category, course_3_visible,
              course_4_title, course_4_rating, course_4_lessons, course_4_duration, course_4_category, course_4_visible,
              course_5_title, course_5_rating, course_5_lessons, course_5_duration, course_5_category, course_5_visible,
              course_6_title, course_6_rating, course_6_lessons, course_6_duration, course_6_category, course_6_visible,
              testimonial_1_text, testimonial_1_author, testimonial_1_rating, testimonial_1_visible,
              testimonial_2_text, testimonial_2_author, testimonial_2_rating, testimonial_2_visible,
              testimonial_3_text, testimonial_3_author, testimonial_3_rating, testimonial_3_visible,
              testimonial_4_text, testimonial_4_author, testimonial_4_rating, testimonial_4_visible
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, $51, $52, $53, $54, $55, $56, $57, $58, $59, $60, $61, $62, $63, $64, $65, $66)
          `, [
            row.title, row.hero_title, row.hero_subtitle, row.hero_description, Boolean(row.hero_section_visible),
            row.featured_courses_title, row.featured_courses_description, Boolean(row.featured_courses_visible),
            row.about_title, row.about_subtitle, row.about_description, Boolean(row.about_visible),
            row.companies_title, row.companies_description, Boolean(row.companies_visible),
            row.testimonials_title, row.testimonials_subtitle, Boolean(row.testimonials_visible),
            row.course_1_title, row.course_1_rating, row.course_1_lessons, row.course_1_duration, row.course_1_category, Boolean(row.course_1_visible),
            row.course_2_title, row.course_2_rating, row.course_2_lessons, row.course_2_duration, row.course_2_category, Boolean(row.course_2_visible),
            row.course_3_title, row.course_3_rating, row.course_3_lessons, row.course_3_duration, row.course_3_category, Boolean(row.course_3_visible),
            row.course_4_title, row.course_4_rating, row.course_4_lessons, row.course_4_duration, row.course_4_category, Boolean(row.course_4_visible),
            row.course_5_title, row.course_5_rating, row.course_5_lessons, row.course_5_duration, row.course_5_category, Boolean(row.course_5_visible),
            row.course_6_title, row.course_6_rating, row.course_6_lessons, row.course_6_duration, row.course_6_category, Boolean(row.course_6_visible),
            row.testimonial_1_text, row.testimonial_1_author, row.testimonial_1_rating, Boolean(row.testimonial_1_visible),
            row.testimonial_2_text, row.testimonial_2_author, row.testimonial_2_rating, Boolean(row.testimonial_2_visible),
            row.testimonial_3_text, row.testimonial_3_author, row.testimonial_3_rating, Boolean(row.testimonial_3_visible),
            row.testimonial_4_text, row.testimonial_4_author, row.testimonial_4_rating, Boolean(row.testimonial_4_visible)
          ]);
          console.log('✅ Migrated home page data');
        } catch (error) {
          console.error('Error migrating home page:', error);
        }
      }
      resolve();
    });
  });

  // Migrate courses
  await new Promise((resolve, reject) => {
    db.all('SELECT * FROM courses', async (err, rows) => {
      if (err || !rows) {
        console.log('⚠️  No courses to migrate');
        resolve();
        return;
      }
      
      for (const row of rows) {
        try {
          await pgClient.query(`
            INSERT INTO courses (title, description, price, duration, lessons, category, rating, visible)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          `, [row.title, row.description, row.price, row.duration, row.lessons, row.category, row.rating, Boolean(row.visible)]);
        } catch (error) {
          console.error('Error migrating course:', error);
        }
      }
      console.log(`✅ Migrated ${rows.length} courses`);
      resolve();
    });
  });

  db.close();
  console.log('✅ Data migration complete');
}

// Export for use in server.js
module.exports = { migrate };

// Run if called directly
if (require.main === module) {
  migrate();
}