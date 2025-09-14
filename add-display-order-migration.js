/**
 * PRODUCTION MIGRATION: Add display_order column to teachers table
 * Specifically for Railway PostgreSQL production database
 */

const { Client } = require('pg');

async function addDisplayOrderColumn() {
  console.log('🚀 Starting display_order column migration for production...');

  // Check if we have DATABASE_URL from Railway
  if (!process.env.DATABASE_URL) {
    console.log('⚠️  DATABASE_URL not found. This is for production Railway only.');
    return;
  }

  // Connect to PostgreSQL
  const pgClient = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes('localhost') || process.env.DATABASE_URL.includes('127.0.0.1') ? false : { rejectUnauthorized: false }
  });

  try {
    await pgClient.connect();
    console.log('✅ Connected to Railway PostgreSQL');

    // Check if display_order column already exists
    const columnCheck = await pgClient.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'teachers'
      AND column_name = 'display_order';
    `);

    if (columnCheck.rows.length > 0) {
      console.log('✅ display_order column already exists in production!');

      // Test the teachers API query to make sure it works
      const testQuery = `
        SELECT id, name, display_order
        FROM teachers
        WHERE locale = $1 AND published_at IS NOT NULL
        ORDER BY display_order ASC, id ASC
        LIMIT 3;
      `;

      const testResult = await pgClient.query(testQuery, ['he']);
      console.log(`🧪 Test query successful! Found ${testResult.rows.length} Hebrew teachers.`);

      return;
    }

    console.log('🔧 Adding display_order column to teachers table...');

    // Add the display_order column
    await pgClient.query(`
      ALTER TABLE teachers
      ADD COLUMN display_order INTEGER DEFAULT 0;
    `);

    console.log('✅ display_order column added successfully!');

    // Copy values from existing "order" column if it exists
    const orderColumnCheck = await pgClient.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'teachers'
      AND column_name = 'order';
    `);

    if (orderColumnCheck.rows.length > 0) {
      console.log('📋 Copying values from existing "order" column...');
      await pgClient.query(`
        UPDATE teachers
        SET display_order = COALESCE("order", 0)
        WHERE display_order = 0;
      `);
      console.log('✅ Values copied from "order" to "display_order"');
    }

    // Create index for better performance
    await pgClient.query(`
      CREATE INDEX IF NOT EXISTS idx_teachers_display_order
      ON teachers(display_order);
    `);

    console.log('⚡ Index created on display_order column');

    // Add other missing columns if they don't exist
    const missingColumns = [
      { name: 'locale', type: 'VARCHAR(5)', default: "'en'" },
      { name: 'image_url', type: 'VARCHAR(500)', default: 'NULL' },
      { name: 'company', type: 'VARCHAR(255)', default: 'NULL' },
      { name: 'experience_years', type: 'INTEGER', default: 'NULL' },
      { name: 'categories', type: 'TEXT', default: 'NULL' },
      { name: 'specializations', type: 'TEXT', default: 'NULL' }
    ];

    for (const column of missingColumns) {
      const columnExists = await pgClient.query(`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'teachers'
        AND column_name = $1;
      `, [column.name]);

      if (columnExists.rows.length === 0) {
        console.log(`📝 Adding missing column: ${column.name}`);
        await pgClient.query(`
          ALTER TABLE teachers
          ADD COLUMN ${column.name} ${column.type} DEFAULT ${column.default};
        `);
      }
    }

    // Test the teachers API query
    console.log('\n🧪 Testing teachers API query...');
    const testQuery = `
      SELECT id, name, display_order, locale
      FROM teachers
      WHERE locale = $1 AND published_at IS NOT NULL
      ORDER BY display_order ASC, id ASC
      LIMIT 5;
    `;

    const testResult = await pgClient.query(testQuery, ['he']);
    console.log(`✅ Test successful! Found ${testResult.rows.length} Hebrew teachers.`);

    if (testResult.rows.length > 0) {
      console.log('\nSample data:');
      testResult.rows.forEach((teacher, index) => {
        console.log(`  ${index + 1}. ${teacher.name} (display_order: ${teacher.display_order}, locale: ${teacher.locale})`);
      });
    }

    console.log('\n🎉 Production migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration error:', error);
    throw error;
  } finally {
    await pgClient.end();
  }
}

// Export for use in server.js or other scripts
module.exports = { addDisplayOrderColumn };

// Run if called directly
if (require.main === module) {
  addDisplayOrderColumn()
    .then(() => {
      console.log('\n✅ Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Migration failed:', error.message);
      process.exit(1);
    });
}