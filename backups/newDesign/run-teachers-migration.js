const { Client } = require('pg');
const { createTeachersTable } = require('./migrations/create-teachers-table.js');

// Database configuration - Use exact same pattern as main server
let dbConfig;

console.log('Environment Variables Check:');
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);

if (process.env.DATABASE_URL) {
  // PostgreSQL (Railway in production OR local Docker)
  const isLocal = process.env.DATABASE_URL.includes('localhost') || process.env.NODE_ENV === 'development';
  dbConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: isLocal ? false : { rejectUnauthorized: false }
  };
  console.log('🐘 Using PostgreSQL database via DATABASE_URL');
} else {
  // No fallback - PostgreSQL required
  console.error('❌ DATABASE_URL is required for teachers migration!');
  console.error('💡 This requires the same DATABASE_URL as the main server');
  process.exit(1);
}

async function runTeachersMigration() {
  console.log('🚀 Starting Teachers Table Migration...');

  const client = new Client(dbConfig);

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Run the migration
    await createTeachersTable(client);

    console.log('🎉 Teachers table migration completed successfully!');

    // Verify the migration
    const result = await client.query('SELECT COUNT(*) FROM entity_teachers');
    console.log(`📊 Teachers count: ${result.rows[0].count}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

runTeachersMigration();