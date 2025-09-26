// TEMPORARY ADMIN ENDPOINTS - ADD TO server.js

// Import at top of server.js if not already imported
const fs = require('fs');

// Add these endpoints after existing API routes in server.js:

// List all tables endpoint
app.get('/admin/list-tables', async (req, res) => {
  try {
    console.log('📊 Admin: Listing all tables...');

    const tables = await queryDatabase(`
      SELECT table_name,
             (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
      FROM information_schema.tables t
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    const tablesWithCounts = [];
    for (const table of tables) {
      try {
        const count = await queryDatabase(`SELECT COUNT(*) as count FROM ${table.table_name}`);
        tablesWithCounts.push({
          name: table.table_name,
          rows: parseInt(count[0].count),
          columns: parseInt(table.column_count)
        });
      } catch (e) {
        tablesWithCounts.push({
          name: table.table_name,
          rows: 'error',
          columns: parseInt(table.column_count)
        });
      }
    }

    res.json({
      success: true,
      count: tables.length,
      tables: tablesWithCounts
    });
  } catch (error) {
    console.error('❌ List tables error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Drop all tables endpoint
app.post('/admin/drop-all-tables', async (req, res) => {
  try {
    console.log('🗑️ Admin: Dropping all tables...');

    const tables = await queryDatabase(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    const results = [];
    for (const table of tables) {
      try {
        await queryDatabase(`DROP TABLE IF EXISTS ${table.table_name} CASCADE`);
        results.push({ table: table.table_name, status: 'dropped' });
      } catch (error) {
        results.push({ table: table.table_name, status: 'error', error: error.message });
      }
    }

    // Verify
    const remaining = await queryDatabase(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `);

    res.json({
      success: true,
      droppedTables: tables.length,
      remainingTables: remaining.length,
      results: results
    });
  } catch (error) {
    console.error('❌ Drop tables error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Restore backup endpoint
app.post('/admin/restore-backup', async (req, res) => {
  try {
    console.log('📦 Admin: Restoring backup...');

    const backupFile = 'local_postgres_backup_20250926_103929.sql';

    if (!fs.existsSync(backupFile)) {
      return res.status(404).json({
        success: false,
        error: `Backup file not found: ${backupFile}`
      });
    }

    const backupContent = fs.readFileSync(backupFile, 'utf8');
    const statements = backupContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt && !stmt.startsWith('--') && stmt !== '');

    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      try {
        await queryDatabase(statement);
        successCount++;
      } catch (error) {
        errorCount++;
        if (!error.message.includes('already exists')) {
          errors.push({ statement: i, error: error.message });
        }
      }
    }

    res.json({
      success: true,
      totalStatements: statements.length,
      successCount: successCount,
      errorCount: errorCount,
      errors: errors
    });
  } catch (error) {
    console.error('❌ Restore backup error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});