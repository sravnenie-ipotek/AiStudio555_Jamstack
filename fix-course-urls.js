const { Pool } = require('pg');
require('dotenv').config();

// Fix course URLs in the nd_courses table

const isProduction = process.env.DATABASE_URL && process.env.DATABASE_URL.includes('railway');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

async function fixCourseUrls() {
  const client = await pool.connect();

  try {
    console.log('🔧 Fixing course URLs in nd_courses table...');

    // Update all course URLs to use relative paths
    const updateQuery = `
      UPDATE nd_courses
      SET url = CASE
        WHEN url LIKE '%/backups/newDesign/detail_courses.html%'
          THEN REPLACE(url, '/backups/newDesign/detail_courses.html', 'detail_courses.html')
        WHEN url LIKE '%detail_courses.html%'
          THEN url
        WHEN url IS NULL OR url = '' OR url = '#' OR url = 'about:blank#'
          THEN CONCAT('detail_courses.html?id=', id)
        ELSE url
      END,
      updated_at = CURRENT_TIMESTAMP
      WHERE url IS NULL
         OR url = ''
         OR url = '#'
         OR url = 'about:blank#'
         OR url LIKE '%/backups/newDesign/%'
    `;

    const result = await client.query(updateQuery);
    console.log(`✅ Updated ${result.rowCount} course URLs`);

    // Verify the update
    const checkQuery = `
      SELECT id, course_key, title, url
      FROM nd_courses
      ORDER BY id
      LIMIT 5
    `;

    const checkResult = await client.query(checkQuery);
    console.log('\n📋 Sample updated URLs:');
    checkResult.rows.forEach(row => {
      console.log(`  Course ${row.id} (${row.title}): ${row.url}`);
    });

  } catch (error) {
    console.error('❌ Error fixing URLs:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run if executed directly
if (require.main === module) {
  fixCourseUrls()
    .then(() => {
      console.log('\n✅ URL fix completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ URL fix failed:', error);
      process.exit(1);
    });
}

module.exports = fixCourseUrls;