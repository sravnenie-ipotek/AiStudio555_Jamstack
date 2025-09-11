// ==================== NEW API ENDPOINTS FOR MISSING CONTENT ====================

// 1. SITE SETTINGS API
// Get site settings
app.get('/api/site-settings', async (req, res) => {
  try {
    const locale = getLocale(req);
    const query = `
      SELECT * FROM site_settings 
      WHERE locale = $1 
      ORDER BY id DESC LIMIT 1
    `;
    
    const result = await executeQuery(query, [locale]);
    
    if (result.rows.length === 0) {
      // Fallback to English if locale not found
      const fallbackResult = await executeQuery(query, ['en']);
      res.json(fallbackResult.rows[0] || {});
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error fetching site settings:', error);
    res.status(500).json({ error: 'Failed to fetch site settings' });
  }
});

// Update site settings
app.put('/api/site-settings', async (req, res) => {
  try {
    const locale = getLocale(req);
    const data = req.body;
    
    // Check if record exists
    const checkQuery = 'SELECT id FROM site_settings WHERE locale = $1';
    const existing = await executeQuery(checkQuery, [locale]);
    
    if (existing.rows.length > 0) {
      // Update existing
      const fields = Object.keys(data).filter(key => key !== 'id');
      const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
      const values = [existing.rows[0].id, ...fields.map(field => data[field])];
      
      const updateQuery = `
        UPDATE site_settings 
        SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $1 
        RETURNING *
      `;
      
      const result = await executeQuery(updateQuery, values);
      res.json(result.rows[0]);
    } else {
      // Insert new
      const fields = ['locale', ...Object.keys(data)];
      const values = [locale, ...Object.values(data)];
      const placeholders = fields.map((_, index) => `$${index + 1}`).join(', ');
      
      const insertQuery = `
        INSERT INTO site_settings (${fields.join(', ')}) 
        VALUES (${placeholders}) 
        RETURNING *
      `;
      
      const result = await executeQuery(insertQuery, values);
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error updating site settings:', error);
    res.status(500).json({ error: 'Failed to update site settings' });
  }
});

// 2. NAVIGATION MENU API
// Get navigation menu
app.get('/api/navigation-menu', async (req, res) => {
  try {
    const locale = getLocale(req);
    const menuType = req.query.type || 'main';
    
    const query = `
      SELECT * FROM navigation_menus 
      WHERE locale = $1 AND menu_type = $2 
      ORDER BY id DESC LIMIT 1
    `;
    
    const result = await executeQuery(query, [locale, menuType]);
    
    if (result.rows.length === 0) {
      // Fallback to English if locale not found
      const fallbackResult = await executeQuery(query, ['en', menuType]);
      res.json(fallbackResult.rows[0] || {});
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error fetching navigation menu:', error);
    res.status(500).json({ error: 'Failed to fetch navigation menu' });
  }
});

// Update navigation menu
app.put('/api/navigation-menu', async (req, res) => {
  try {
    const locale = getLocale(req);
    const menuType = req.body.menu_type || 'main';
    const data = req.body;
    
    // Check if record exists
    const checkQuery = 'SELECT id FROM navigation_menus WHERE locale = $1 AND menu_type = $2';
    const existing = await executeQuery(checkQuery, [locale, menuType]);
    
    if (existing.rows.length > 0) {
      // Update existing
      const fields = Object.keys(data).filter(key => key !== 'id');
      const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
      const values = [existing.rows[0].id, ...fields.map(field => data[field])];
      
      const updateQuery = `
        UPDATE navigation_menus 
        SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $1 
        RETURNING *
      `;
      
      const result = await executeQuery(updateQuery, values);
      res.json(result.rows[0]);
    } else {
      // Insert new
      const fields = ['locale', 'menu_type', ...Object.keys(data).filter(key => key !== 'menu_type')];
      const values = [locale, menuType, ...Object.keys(data).filter(key => key !== 'menu_type').map(field => data[field])];
      const placeholders = fields.map((_, index) => `$${index + 1}`).join(', ');
      
      const insertQuery = `
        INSERT INTO navigation_menus (${fields.join(', ')}) 
        VALUES (${placeholders}) 
        RETURNING *
      `;
      
      const result = await executeQuery(insertQuery, values);
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error updating navigation menu:', error);
    res.status(500).json({ error: 'Failed to update navigation menu' });
  }
});

// 3. STATISTICS API
// Get statistics
app.get('/api/statistics', async (req, res) => {
  try {
    const locale = getLocale(req);
    const query = `
      SELECT * FROM statistics 
      WHERE locale = $1 
      ORDER BY id DESC LIMIT 1
    `;
    
    const result = await executeQuery(query, [locale]);
    
    if (result.rows.length === 0) {
      // Fallback to English if locale not found
      const fallbackResult = await executeQuery(query, ['en']);
      res.json(fallbackResult.rows[0] || {});
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Update statistics
app.put('/api/statistics', async (req, res) => {
  try {
    const locale = getLocale(req);
    const data = req.body;
    
    // Check if record exists
    const checkQuery = 'SELECT id FROM statistics WHERE locale = $1';
    const existing = await executeQuery(checkQuery, [locale]);
    
    if (existing.rows.length > 0) {
      // Update existing
      const fields = Object.keys(data).filter(key => key !== 'id');
      const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
      const values = [existing.rows[0].id, ...fields.map(field => data[field])];
      
      const updateQuery = `
        UPDATE statistics 
        SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $1 
        RETURNING *
      `;
      
      const result = await executeQuery(updateQuery, values);
      res.json(result.rows[0]);
    } else {
      // Insert new
      const fields = ['locale', ...Object.keys(data)];
      const values = [locale, ...Object.values(data)];
      const placeholders = fields.map((_, index) => `$${index + 1}`).join(', ');
      
      const insertQuery = `
        INSERT INTO statistics (${fields.join(', ')}) 
        VALUES (${placeholders}) 
        RETURNING *
      `;
      
      const result = await executeQuery(insertQuery, values);
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error updating statistics:', error);
    res.status(500).json({ error: 'Failed to update statistics' });
  }
});

// 4. BUTTON TEXTS API
// Get button texts
app.get('/api/button-texts', async (req, res) => {
  try {
    const locale = getLocale(req);
    const query = `
      SELECT * FROM button_texts 
      WHERE locale = $1 
      ORDER BY id DESC LIMIT 1
    `;
    
    const result = await executeQuery(query, [locale]);
    
    if (result.rows.length === 0) {
      // Fallback to English if locale not found
      const fallbackResult = await executeQuery(query, ['en']);
      res.json(fallbackResult.rows[0] || {});
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error fetching button texts:', error);
    res.status(500).json({ error: 'Failed to fetch button texts' });
  }
});

// Update button texts
app.put('/api/button-texts', async (req, res) => {
  try {
    const locale = getLocale(req);
    const data = req.body;
    
    // Check if record exists
    const checkQuery = 'SELECT id FROM button_texts WHERE locale = $1';
    const existing = await executeQuery(checkQuery, [locale]);
    
    if (existing.rows.length > 0) {
      // Update existing
      const fields = Object.keys(data).filter(key => key !== 'id');
      const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
      const values = [existing.rows[0].id, ...fields.map(field => data[field])];
      
      const updateQuery = `
        UPDATE button_texts 
        SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $1 
        RETURNING *
      `;
      
      const result = await executeQuery(updateQuery, values);
      res.json(result.rows[0]);
    } else {
      // Insert new
      const fields = ['locale', ...Object.keys(data)];
      const values = [locale, ...Object.values(data)];
      const placeholders = fields.map((_, index) => `$${index + 1}`).join(', ');
      
      const insertQuery = `
        INSERT INTO button_texts (${fields.join(', ')}) 
        VALUES (${placeholders}) 
        RETURNING *
      `;
      
      const result = await executeQuery(insertQuery, values);
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error updating button texts:', error);
    res.status(500).json({ error: 'Failed to update button texts' });
  }
});

// 5. COMPANY LOGOS API
// Get company logos
app.get('/api/company-logos', async (req, res) => {
  try {
    const locale = getLocale(req);
    const query = `
      SELECT * FROM company_logos 
      WHERE locale = $1 
      ORDER BY id DESC LIMIT 1
    `;
    
    const result = await executeQuery(query, [locale]);
    
    if (result.rows.length === 0) {
      // Fallback to English if locale not found
      const fallbackResult = await executeQuery(query, ['en']);
      res.json(fallbackResult.rows[0] || {});
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error fetching company logos:', error);
    res.status(500).json({ error: 'Failed to fetch company logos' });
  }
});

// Update company logos
app.put('/api/company-logos', async (req, res) => {
  try {
    const locale = getLocale(req);
    const data = req.body;
    
    // Check if record exists
    const checkQuery = 'SELECT id FROM company_logos WHERE locale = $1';
    const existing = await executeQuery(checkQuery, [locale]);
    
    if (existing.rows.length > 0) {
      // Update existing
      const fields = Object.keys(data).filter(key => key !== 'id');
      const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
      const values = [existing.rows[0].id, ...fields.map(field => data[field])];
      
      const updateQuery = `
        UPDATE company_logos 
        SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $1 
        RETURNING *
      `;
      
      const result = await executeQuery(updateQuery, values);
      res.json(result.rows[0]);
    } else {
      // Insert new
      const fields = ['locale', ...Object.keys(data)];
      const values = [locale, ...Object.values(data)];
      const placeholders = fields.map((_, index) => `$${index + 1}`).join(', ');
      
      const insertQuery = `
        INSERT INTO company_logos (${fields.join(', ')}) 
        VALUES (${placeholders}) 
        RETURNING *
      `;
      
      const result = await executeQuery(insertQuery, values);
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error updating company logos:', error);
    res.status(500).json({ error: 'Failed to update company logos' });
  }
});

// 6. PAGE META API
// Get page meta data
app.get('/api/page-meta/:slug', async (req, res) => {
  try {
    const locale = getLocale(req);
    const { slug } = req.params;
    
    const query = `
      SELECT * FROM page_meta 
      WHERE locale = $1 AND page_slug = $2 
      ORDER BY id DESC LIMIT 1
    `;
    
    const result = await executeQuery(query, [locale, slug]);
    
    if (result.rows.length === 0) {
      // Fallback to English if locale not found
      const fallbackResult = await executeQuery(query, ['en', slug]);
      res.json(fallbackResult.rows[0] || {});
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error fetching page meta:', error);
    res.status(500).json({ error: 'Failed to fetch page meta' });
  }
});

// Update page meta data
app.put('/api/page-meta/:slug', async (req, res) => {
  try {
    const locale = getLocale(req);
    const { slug } = req.params;
    const data = req.body;
    
    // Check if record exists
    const checkQuery = 'SELECT id FROM page_meta WHERE locale = $1 AND page_slug = $2';
    const existing = await executeQuery(checkQuery, [locale, slug]);
    
    if (existing.rows.length > 0) {
      // Update existing
      const fields = Object.keys(data).filter(key => key !== 'id');
      const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
      const values = [existing.rows[0].id, ...fields.map(field => data[field])];
      
      const updateQuery = `
        UPDATE page_meta 
        SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
        WHERE id = $1 
        RETURNING *
      `;
      
      const result = await executeQuery(updateQuery, values);
      res.json(result.rows[0]);
    } else {
      // Insert new
      const fields = ['locale', 'page_slug', ...Object.keys(data)];
      const values = [locale, slug, ...Object.values(data)];
      const placeholders = fields.map((_, index) => `$${index + 1}`).join(', ');
      
      const insertQuery = `
        INSERT INTO page_meta (${fields.join(', ')}) 
        VALUES (${placeholders}) 
        RETURNING *
      `;
      
      const result = await executeQuery(insertQuery, values);
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error('Error updating page meta:', error);
    res.status(500).json({ error: 'Failed to update page meta' });
  }
});

// 7. COMBINED GLOBAL CONTENT API (for easier frontend integration)
// Get all global content at once
app.get('/api/global-content', async (req, res) => {
  try {
    const locale = getLocale(req);
    
    // Get all global content in parallel
    const [siteSettings, navigationMenu, statistics, buttonTexts, companyLogos] = await Promise.all([
      executeQuery('SELECT * FROM site_settings WHERE locale = $1 ORDER BY id DESC LIMIT 1', [locale]),
      executeQuery('SELECT * FROM navigation_menus WHERE locale = $1 ORDER BY id DESC LIMIT 1', [locale]),
      executeQuery('SELECT * FROM statistics WHERE locale = $1 ORDER BY id DESC LIMIT 1', [locale]),
      executeQuery('SELECT * FROM button_texts WHERE locale = $1 ORDER BY id DESC LIMIT 1', [locale]),
      executeQuery('SELECT * FROM company_logos WHERE locale = $1 ORDER BY id DESC LIMIT 1', [locale])
    ]);
    
    // Fallback to English if any content is missing
    const fallbackPromises = [];
    if (siteSettings.rows.length === 0) fallbackPromises.push(executeQuery('SELECT * FROM site_settings WHERE locale = \'en\' ORDER BY id DESC LIMIT 1'));
    if (navigationMenu.rows.length === 0) fallbackPromises.push(executeQuery('SELECT * FROM navigation_menus WHERE locale = \'en\' ORDER BY id DESC LIMIT 1'));
    if (statistics.rows.length === 0) fallbackPromises.push(executeQuery('SELECT * FROM statistics WHERE locale = \'en\' ORDER BY id DESC LIMIT 1'));
    if (buttonTexts.rows.length === 0) fallbackPromises.push(executeQuery('SELECT * FROM button_texts WHERE locale = \'en\' ORDER BY id DESC LIMIT 1'));
    if (companyLogos.rows.length === 0) fallbackPromises.push(executeQuery('SELECT * FROM company_logos WHERE locale = \'en\' ORDER BY id DESC LIMIT 1'));
    
    const fallbacks = await Promise.all(fallbackPromises);
    let fallbackIndex = 0;
    
    res.json({
      siteSettings: siteSettings.rows[0] || (fallbacks[fallbackIndex++]?.rows[0] || {}),
      navigationMenu: navigationMenu.rows[0] || (fallbacks[fallbackIndex++]?.rows[0] || {}),
      statistics: statistics.rows[0] || (fallbacks[fallbackIndex++]?.rows[0] || {}),
      buttonTexts: buttonTexts.rows[0] || (fallbacks[fallbackIndex++]?.rows[0] || {}),
      companyLogos: companyLogos.rows[0] || (fallbacks[fallbackIndex++]?.rows[0] || {}),
      locale: locale
    });
  } catch (error) {
    console.error('Error fetching global content:', error);
    res.status(500).json({ error: 'Failed to fetch global content' });
  }
});

// 8. MIGRATION ENDPOINT FOR NEW FIELDS
// Run the missing fields migration
app.post('/api/run-missing-fields-migration', async (req, res) => {
  try {
    console.log('🔄 Running missing fields migration...');
    const { addMissingFields } = require('./add-missing-fields-migration');
    await addMissingFields();
    
    res.json({ 
      success: true, 
      message: 'Missing fields migration completed successfully!',
      note: 'New tables created: site_settings, navigation_menus, statistics, button_texts, company_logos, page_meta'
    });
  } catch (error) {
    console.error('Migration failed:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Migration failed', 
      details: error.message 
    });
  }
});
