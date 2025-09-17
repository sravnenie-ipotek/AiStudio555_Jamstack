// Production Migration Runner for Railway
// This script runs the career pages migration on the production database
// Run this in Railway's console or add it to your deployment process

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  // Use DATABASE_URL from environment (Railway provides this)
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.error('❌ DATABASE_URL not found. Are you running this on Railway?');
    process.exit(1);
  }

  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false // Railway requires SSL
    }
  });

  try {
    console.log('📦 Connecting to production database...');
    await client.connect();
    
    // Read the migration file
    const migrationPath = path.join(__dirname, 'migrations', '003-add-career-pages.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('🚀 Running career pages migration...');
    
    // Execute the migration
    await client.query(migrationSQL);
    
    console.log('✅ Migration completed successfully!');
    
    // Verify the tables were created
    const verifyQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('career_orientation_pages', 'career_center_pages')
    `;
    
    const result = await client.query(verifyQuery);
    console.log('📊 Created tables:', result.rows.map(r => r.table_name).join(', '));
    
    // Check data was inserted
    const countQuery = `
      SELECT 
        (SELECT COUNT(*) FROM career_orientation_pages) as orientation_count,
        (SELECT COUNT(*) FROM career_center_pages) as center_count
    `;
    
    const counts = await client.query(countQuery);
    console.log('📈 Data inserted:');
    console.log(`   - Career Orientation Pages: ${counts.rows[0].orientation_count} records`);
    console.log(`   - Career Center Pages: ${counts.rows[0].center_count} records`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    if (error.detail) {
      console.error('Details:', error.detail);
    }
    process.exit(1);
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

// Run the migration
console.log('🏁 Starting production migration for Career Pages...');
runMigration()
  .then(() => {
    console.log('🎉 All done! Career pages are now available.');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Unexpected error:', error);
    process.exit(1);
  });