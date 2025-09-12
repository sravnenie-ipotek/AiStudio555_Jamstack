#!/usr/bin/env node

/**
 * SIMPLE TEST: Update single Russian UI field to test database connection and column names
 */

const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:Thinkpad123@junction.proxy.rlwy.net:48608/railway',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function testSingleFieldUpdate() {
  try {
    console.log('🔄 Testing single field update...');
    
    // Test updating just one field
    const query = `
      UPDATE home_pages 
      SET navHome = 'Главная' 
      WHERE locale = 'ru'
    `;
    
    const result = await pool.query(query);
    console.log('✅ Update result:', result.rowCount, 'rows affected');
    
    // Verify the change
    const verifyQuery = `SELECT navHome FROM home_pages WHERE locale = 'ru'`;
    const verifyResult = await pool.query(verifyQuery);
    
    if (verifyResult.rows.length > 0) {
      console.log('🔍 Verification - navHome:', verifyResult.rows[0].navhome);
    } else {
      console.log('⚠️ No Russian record found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

testSingleFieldUpdate();