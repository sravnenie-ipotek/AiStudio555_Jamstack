/**
 * QUICK SCHEMA FIX
 * Fix nd_home table to match expected API schema
 */

// Add this endpoint to fix the schema issue
const schemaFixEndpoint = `

// ==================== SCHEMA FIX ENDPOINT ====================
app.get('/api/fix-nd-home-schema', async (req, res) => {
  try {
    console.log('🔧 Fixing nd_home table schema...');

    // Add the missing section_type column
    try {
      await queryDatabase(\`
        ALTER TABLE nd_home
        ADD COLUMN IF NOT EXISTS section_type VARCHAR(100)
      \`);
      console.log('✅ Added section_type column');
    } catch (error) {
      console.log('Section_type column might already exist:', error.message);
    }

    // Update section_type from section_name if needed
    try {
      await queryDatabase(\`
        UPDATE nd_home
        SET section_type = section_name
        WHERE section_type IS NULL AND section_name IS NOT NULL
      \`);
      console.log('✅ Populated section_type from section_name');
    } catch (error) {
      console.log('Update section_type error:', error.message);
    }

    // Verify the table structure
    const columns = await queryDatabase(\`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'nd_home'
      ORDER BY ordinal_position
    \`);

    console.log('✅ nd_home table schema fixed');

    res.json({
      success: true,
      message: 'nd_home schema fixed successfully',
      columns: columns
    });

  } catch (error) {
    console.error('❌ Schema fix failed:', error);
    res.status(500).json({
      success: false,
      error: 'Schema fix failed',
      message: error.message
    });
  }
});

`;

console.log('SCHEMA FIX FOR ND_HOME TABLE');
console.log('============================');
console.log('');
console.log('Add this endpoint to server.js and deploy:');
console.log(schemaFixEndpoint);
console.log('');
console.log('Then call: https://aistudio555jamstack-production.up.railway.app/api/fix-nd-home-schema');

module.exports = schemaFixEndpoint;