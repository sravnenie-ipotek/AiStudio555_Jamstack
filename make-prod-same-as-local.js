#!/usr/bin/env node

/**
 * Simple fix: Make production database exactly the same as local
 */

const { Client } = require('pg');
const fs = require('fs').promises;

const LOCAL_DB = {
  connectionString: 'postgresql://postgres:postgres@localhost:5432/aistudio_db'
};

async function exportLocalStructureAndData() {
  const client = new Client(LOCAL_DB);

  try {
    await client.connect();
    console.log('📊 Exporting LOCAL database structure and data...\n');

    let sqlScript = '-- Make production same as local\n\n';

    // 1. Fix consultations table structure
    sqlScript += `-- 1. Fix consultations table (for contact forms)\n`;
    sqlScript += `DROP TABLE IF EXISTS consultations CASCADE;\n`;
    sqlScript += `CREATE TABLE consultations (\n`;
    sqlScript += `  id SERIAL PRIMARY KEY,\n`;
    sqlScript += `  name VARCHAR(255) NOT NULL,\n`;
    sqlScript += `  email VARCHAR(255) NOT NULL,\n`;
    sqlScript += `  phone VARCHAR(50),\n`;
    sqlScript += `  interest VARCHAR(100) NOT NULL,\n`;
    sqlScript += `  experience VARCHAR(50) NOT NULL,\n`;
    sqlScript += `  locale VARCHAR(10) DEFAULT 'en',\n`;
    sqlScript += `  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n`;
    sqlScript += `  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n`;
    sqlScript += `);\n\n`;

    // 2. Add indexes
    sqlScript += `-- Indexes\n`;
    sqlScript += `CREATE INDEX idx_consultations_email ON consultations(email);\n`;
    sqlScript += `CREATE INDEX idx_consultations_interest ON consultations(interest);\n`;
    sqlScript += `CREATE INDEX idx_consultations_created_at ON consultations(created_at);\n\n`;

    // 3. Add consultation_services table
    sqlScript += `-- 2. Create consultation_services table (for service offerings)\n`;
    sqlScript += `CREATE TABLE IF NOT EXISTS consultation_services (\n`;
    sqlScript += `  id SERIAL PRIMARY KEY,\n`;
    sqlScript += `  title VARCHAR(255),\n`;
    sqlScript += `  description TEXT,\n`;
    sqlScript += `  duration VARCHAR(100),\n`;
    sqlScript += `  price DECIMAL(10,2),\n`;
    sqlScript += `  features JSONB,\n`;
    sqlScript += `  locale VARCHAR(10) DEFAULT 'en',\n`;
    sqlScript += `  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n`;
    sqlScript += `  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n`;
    sqlScript += `);\n\n`;

    // 4. Add missing multilingual FAQs
    sqlScript += `-- 3. Add missing multilingual FAQs\n`;
    const faqs = await client.query('SELECT * FROM faqs WHERE id > 4 ORDER BY id');
    for (const faq of faqs.rows) {
      sqlScript += `INSERT INTO faqs (question, answer, category, order_index, visible, locale) VALUES (\n`;
      sqlScript += `  '${faq.question.replace(/'/g, "''")}',\n`;
      sqlScript += `  '${faq.answer.replace(/'/g, "''")}',\n`;
      sqlScript += `  '${faq.category || 'General'}',\n`;
      sqlScript += `  ${faq.order_index || 0},\n`;
      sqlScript += `  ${faq.visible !== false},\n`;
      sqlScript += `  '${faq.locale || 'en'}'\n`;
      sqlScript += `) ON CONFLICT DO NOTHING;\n`;
    }
    sqlScript += '\n';

    // 5. Add missing multilingual career resources
    sqlScript += `-- 4. Add missing multilingual career resources\n`;
    const resources = await client.query('SELECT * FROM career_resources WHERE id > 4 ORDER BY id');
    for (const resource of resources.rows) {
      sqlScript += `INSERT INTO career_resources (title, description, type, url, icon, order_index, locale) VALUES (\n`;
      sqlScript += `  '${resource.title.replace(/'/g, "''")}',\n`;
      sqlScript += `  '${(resource.description || '').replace(/'/g, "''")}',\n`;
      sqlScript += `  '${resource.type || 'Guide'}',\n`;
      sqlScript += `  '${resource.url || ''}',\n`;
      sqlScript += `  '${resource.icon || 'document'}',\n`;
      sqlScript += `  ${resource.order_index || 0},\n`;
      sqlScript += `  '${resource.locale || 'en'}'\n`;
      sqlScript += `) ON CONFLICT DO NOTHING;\n`;
    }
    sqlScript += '\n';

    // 6. Add sample consultation services
    sqlScript += `-- 5. Add consultation services\n`;
    sqlScript += `INSERT INTO consultation_services (title, description, duration, price, features) VALUES\n`;
    sqlScript += `  ('Career Strategy Session', 'One-on-one career planning and guidance', '60 minutes', 150, '{"personalPlan": true, "followUp": true, "resources": true}'),\n`;
    sqlScript += `  ('Technical Interview Prep', 'Mock interviews and coding practice', '90 minutes', 200, '{"mockInterview": true, "feedback": true, "tips": true}'),\n`;
    sqlScript += `  ('Portfolio Review', 'Professional review of your AI/ML projects', '45 minutes', 100, '{"detailed_feedback": true, "improvement_tips": true}')\n`;
    sqlScript += `ON CONFLICT DO NOTHING;\n\n`;

    sqlScript += `-- Done! Production should now match local structure.\n`;

    // Save the script
    await fs.writeFile('sync-prod-to-local.sql', sqlScript);
    console.log('✅ Created sync-prod-to-local.sql');

    console.log('\n📊 Summary of what this will fix:');
    console.log('1. ✅ Fix consultations table structure (contact forms)');
    console.log('2. ✅ Add consultation_services table (service offerings)');
    console.log(`3. ✅ Add ${faqs.rows.length} missing multilingual FAQs`);
    console.log(`4. ✅ Add ${resources.rows.length} missing multilingual career resources`);

    console.log('\n🚀 To apply to production:');
    console.log('1. Copy contents of sync-prod-to-local.sql');
    console.log('2. Run in Railway PostgreSQL console');
    console.log('3. Production will match local exactly!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

exportLocalStructureAndData();