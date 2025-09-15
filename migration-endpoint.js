/**
 * Add this endpoint to server.js to run migrations remotely
 * This is safer than direct database access
 */

// Add this route to your server.js
/*
app.post('/api/admin/migrate-faq-json', async (req, res) => {
  try {
    console.log('🚀 FAQ JSON Migration requested');

    // Read migration file
    const migrationPath = path.join(__dirname, 'migrations', '008-add-faq-json-columns.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    console.log('📝 Running FAQ JSON migration...');

    // Execute migration
    await queryDatabase(migrationSQL);

    console.log('✅ Migration completed successfully!');

    // Verify the migration worked
    let verificationResults = {};

    try {
      // Check if faq_items column was added (PostgreSQL)
      const columnCheck = await queryDatabase(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'home_pages'
        AND column_name = 'faq_items'
      `);

      verificationResults.columnAdded = columnCheck.length > 0;

      if (columnCheck.length > 0) {
        console.log('✅ faq_items column added to home_pages table');
      }

      // Check if any FAQ data was migrated
      const faqData = await queryDatabase(`
        SELECT id, locale, faq_items
        FROM home_pages
        WHERE faq_items IS NOT NULL
        LIMIT 3
      `);

      verificationResults.dataCount = faqData.length;
      verificationResults.samples = faqData.map(row => ({
        id: row.id,
        locale: row.locale,
        itemCount: row.faq_items ? (typeof row.faq_items === 'string' ? JSON.parse(row.faq_items).length : row.faq_items.length) : 0
      }));

    } catch (verifyError) {
      console.log('⚠️ Verification warning:', verifyError.message);
      verificationResults.verificationError = verifyError.message;
    }

    res.json({
      success: true,
      message: 'FAQ JSON migration completed successfully',
      verification: verificationResults
    });

  } catch (error) {
    console.error('❌ Migration failed:', error.message);

    // Check if it's because the column already exists
    if (error.message.includes('already exists') || error.message.includes('duplicate column')) {
      console.log('ℹ️  Migration may have already been applied');

      res.json({
        success: true,
        message: 'Migration appears to already be applied',
        alreadyApplied: true,
        error: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Migration failed',
        error: error.message
      });
    }
  }
});
*/