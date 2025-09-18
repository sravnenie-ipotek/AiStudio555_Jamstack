#!/usr/bin/env node

const { Client } = require('pg');

async function createTeachersTable() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:OfnJnfJ3qCRCRcdXtGJUOEpJiUTOOUOL@autorack.proxy.rlwy.net:18455/railway'
  });

  try {
    await client.connect();
    console.log('🔗 Connected to production database');

    // Create nd_teachers_page table
    console.log('📚 Creating nd_teachers_page table...');

    await client.query(`
      CREATE TABLE IF NOT EXISTS nd_teachers_page (
        id SERIAL PRIMARY KEY,
        section_name VARCHAR(100) NOT NULL UNIQUE,
        content_en JSONB DEFAULT '{}',
        content_ru JSONB DEFAULT '{}',
        content_he JSONB DEFAULT '{}',
        visible BOOLEAN DEFAULT true,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table nd_teachers_page created');

    // Insert default sections
    const sections = [
      { name: 'hero', order: 1 },
      { name: 'instructor_grid', order: 2 },
      { name: 'stats_banner', order: 3 },
      { name: 'cta_section', order: 4 },
      { name: 'stats', order: 5 },
      { name: 'become_instructor', order: 6 }
    ];

    for (const section of sections) {
      await client.query(`
        INSERT INTO nd_teachers_page (section_name, display_order, visible)
        VALUES ($1, $2, true)
        ON CONFLICT (section_name) DO NOTHING
      `, [section.name, section.order]);
    }
    console.log('✅ Default sections inserted');

    // Create nd_teachers table for individual teacher profiles
    console.log('📚 Creating nd_teachers table...');

    await client.query(`
      CREATE TABLE IF NOT EXISTS nd_teachers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        title VARCHAR(255),
        expertise VARCHAR(255),
        image_url TEXT,
        bio TEXT,
        extended_bio TEXT,
        experience_years VARCHAR(50),
        specialties JSONB,
        achievements JSONB,
        social_links JSONB,
        blog_post_title VARCHAR(500),
        locale VARCHAR(10) DEFAULT 'en',
        visible BOOLEAN DEFAULT true,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table nd_teachers created');

    // Verify tables exist
    const tables = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('nd_teachers_page', 'nd_teachers')
    `);

    console.log('\n📊 Created tables:');
    tables.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });

    console.log('\n✅ Database schema created successfully!');

  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
  } finally {
    await client.end();
    console.log('🔌 Disconnected from database');
  }
}

createTeachersTable();