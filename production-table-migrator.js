/**
 * PRODUCTION TABLE MIGRATOR
 * A safe migration system that works through Railway deployment
 * Creates missing nd_* tables without data loss
 */

const express = require('express');

// Add this migration endpoint to server.js
const migrationEndpoint = `

// ==================== SAFE MIGRATION ENDPOINT ====================
app.get('/api/migrate-nd-tables', async (req, res) => {
  try {
    console.log('🔄 Starting safe migration for nd_* tables...');

    const results = {
      existingTables: [],
      createdTables: [],
      errors: [],
      totalTables: 0
    };

    // 1. Check existing tables
    const existingTables = await queryDatabase(\`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name LIKE 'nd_%'
      ORDER BY table_name
    \`);

    results.existingTables = existingTables.map(row => row.table_name);
    console.log('Existing nd_* tables:', results.existingTables);

    // 2. Define required tables and their creation queries
    const tableDefinitions = {
      'nd_home': \`
        CREATE TABLE IF NOT EXISTS nd_home (
          id SERIAL PRIMARY KEY,
          section_key VARCHAR(100) UNIQUE NOT NULL,
          section_name VARCHAR(255),
          content_en JSONB DEFAULT '{}',
          content_ru JSONB DEFAULT '{}',
          content_he JSONB DEFAULT '{}',
          visible BOOLEAN DEFAULT true,
          animations_enabled BOOLEAN DEFAULT true,
          order_index INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      \`,

      'nd_courses_page': \`
        CREATE TABLE IF NOT EXISTS nd_courses_page (
          id SERIAL PRIMARY KEY,
          section_key VARCHAR(100) UNIQUE NOT NULL,
          section_name VARCHAR(255),
          content_en JSONB DEFAULT '{}',
          content_ru JSONB DEFAULT '{}',
          content_he JSONB DEFAULT '{}',
          visible BOOLEAN DEFAULT true,
          animations_enabled BOOLEAN DEFAULT true,
          order_index INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      \`,

      'nd_course_details_page': \`
        CREATE TABLE IF NOT EXISTS nd_course_details_page (
          id SERIAL PRIMARY KEY,
          section_key VARCHAR(100) UNIQUE NOT NULL,
          section_name VARCHAR(255),
          content_en JSONB DEFAULT '{}',
          content_ru JSONB DEFAULT '{}',
          content_he JSONB DEFAULT '{}',
          visible BOOLEAN DEFAULT true,
          order_index INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      \`,

      'nd_menu': \`
        CREATE TABLE IF NOT EXISTS nd_menu (
          id SERIAL PRIMARY KEY,
          parent_id INTEGER,
          label_en VARCHAR(255),
          label_ru VARCHAR(255),
          label_he VARCHAR(255),
          url VARCHAR(500),
          order_index INTEGER DEFAULT 0,
          visible BOOLEAN DEFAULT true,
          target VARCHAR(20) DEFAULT '_self',
          is_dropdown BOOLEAN DEFAULT false,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      \`,

      'nd_footer': \`
        CREATE TABLE IF NOT EXISTS nd_footer (
          id SERIAL PRIMARY KEY,
          section_type VARCHAR(50),
          column_number INTEGER DEFAULT 1,
          item_type VARCHAR(50),
          content_en TEXT,
          content_ru TEXT,
          content_he TEXT,
          url VARCHAR(500),
          order_index INTEGER DEFAULT 0,
          visible BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      \`,

      'nd_pricing_page': \`
        CREATE TABLE IF NOT EXISTS nd_pricing_page (
          id SERIAL PRIMARY KEY,
          section_name VARCHAR(100) UNIQUE NOT NULL,
          content_en JSONB DEFAULT '{}',
          content_ru JSONB DEFAULT '{}',
          content_he JSONB DEFAULT '{}',
          visible BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      \`,

      'nd_teachers_page': \`
        CREATE TABLE IF NOT EXISTS nd_teachers_page (
          id SERIAL PRIMARY KEY,
          section_name VARCHAR(100) UNIQUE NOT NULL,
          content_en JSONB DEFAULT '{}',
          content_ru JSONB DEFAULT '{}',
          content_he JSONB DEFAULT '{}',
          visible BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      \`,

      'nd_career_center_platform_page': \`
        CREATE TABLE IF NOT EXISTS nd_career_center_platform_page (
          id SERIAL PRIMARY KEY,
          section_name VARCHAR(100) UNIQUE NOT NULL,
          content_en JSONB DEFAULT '{}',
          content_ru JSONB DEFAULT '{}',
          content_he JSONB DEFAULT '{}',
          visible BOOLEAN DEFAULT true,
          display_order INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      \`
    };

    // 3. Create missing tables
    for (const [tableName, createQuery] of Object.entries(tableDefinitions)) {
      try {
        await queryDatabase(createQuery);
        results.createdTables.push(tableName);
        console.log(\`✅ Created/verified table: \${tableName}\`);
      } catch (error) {
        console.error(\`❌ Error creating \${tableName}:\`, error.message);
        results.errors.push(\`\${tableName}: \${error.message}\`);
      }
    }

    // 4. Add essential sample data for immediate functionality
    console.log('📝 Adding essential sample data...');

    // nd_home sample data
    try {
      await queryDatabase(\`
        INSERT INTO nd_home (section_key, section_name, content_en, content_ru, content_he)
        VALUES
        ('hero', 'Hero Section',
         '{"title": "Unlock Potential With Proven Courses", "subtitle": "Expert-Led AI & Machine Learning Training"}',
         '{"title": "Раскройте потенциал с проверенными курсами", "subtitle": "Обучение ИИ и машинному обучению под руководством экспертов"}',
         '{"title": "פתח פוטנציאל עם קורסים מוכחים", "subtitle": "הכשרת AI ולמידת מכונה בהנחיית מומחים"}'
        )
        ON CONFLICT (section_key) DO NOTHING
      \`);
    } catch (error) {
      console.log('Sample data insert (expected if exists):', error.message);
    }

    // Final verification
    const finalTables = await queryDatabase(\`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name LIKE 'nd_%'
      ORDER BY table_name
    \`);

    results.totalTables = finalTables.length;

    console.log('🎉 Migration completed successfully!');
    console.log('Final nd_* tables:', finalTables.map(row => row.table_name));

    res.json({
      success: true,
      message: 'Migration completed successfully',
      results: {
        existingTables: results.existingTables,
        createdTables: results.createdTables,
        totalTablesAfter: results.totalTables,
        errors: results.errors
      },
      finalTables: finalTables.map(row => row.table_name)
    });

  } catch (error) {
    console.error('❌ Migration failed:', error);
    res.status(500).json({
      success: false,
      error: 'Migration failed',
      message: error.message
    });
  }
});

`;

console.log('PRODUCTION TABLE MIGRATOR');
console.log('=========================');
console.log('');
console.log('This endpoint should be added to server.js:');
console.log(migrationEndpoint);
console.log('');
console.log('Once deployed, access: https://aistudio555jamstack-production.up.railway.app/api/migrate-nd-tables');
console.log('');
console.log('The migration will:');
console.log('1. ✅ Check existing tables');
console.log('2. ✅ Create missing nd_* tables safely (IF NOT EXISTS)');
console.log('3. ✅ Add essential sample data');
console.log('4. ✅ Verify final state');
console.log('5. ✅ Return detailed results');

module.exports = migrationEndpoint;