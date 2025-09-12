const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'strapi-fresh', '.tmp', 'data.db');
console.log(`📍 Checking database schema: ${dbPath}`);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error connecting to database:', err);
    process.exit(1);
  }
  console.log('✅ Connected to SQLite database');
});

// Check table schema
db.all("PRAGMA table_info(teachers)", (err, columns) => {
  if (err) {
    console.error('❌ Error getting table info:', err);
    db.close();
    process.exit(1);
  }

  console.log('\n📋 Current teachers table schema:');
  columns.forEach(column => {
    console.log(`   - ${column.name}: ${column.type} ${column.notnull ? 'NOT NULL' : ''} ${column.pk ? '(PRIMARY KEY)' : ''}`);
  });

  // Check current data
  db.all("SELECT * FROM teachers", (err, rows) => {
    if (err) {
      console.error('❌ Error selecting data:', err);
    } else {
      console.log(`\n📊 Current teachers count: ${rows.length}`);
      if (rows.length > 0) {
        console.log('📝 Sample data:');
        rows.forEach((row, index) => {
          console.log(`   ${index + 1}. ${JSON.stringify(row)}`);
        });
      }
    }

    db.close();
  });
});