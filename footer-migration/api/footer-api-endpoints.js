/**
 * FOOTER API ENDPOINTS
 * 
 * This file contains all the API endpoints for footer management.
 * Add these routes to your main server.js file or include as a module.
 * 
 * Endpoints:
 * - GET /api/footer-content - Get footer content for a locale
 * - POST /api/footer-content - Update footer content (admin)
 * - GET /api/footer-navigation - Get footer navigation menus
 * - POST /api/footer-navigation - Update footer navigation (admin)
 * - GET /api/footer-social - Get social links
 * - POST /api/footer-social - Update social links (admin)
 * - GET /api/footer-newsletter - Get newsletter configuration
 * - POST /api/footer-newsletter - Update newsletter config (admin)
 */

const express = require('express');
const { Pool } = require('pg');

// Cache configuration
const cache = new Map();
const CACHE_TTL = 3600000; // 1 hour in milliseconds
const CACHE_PREFIX = 'footer:';

/**
 * Cache utility functions
 */
function getCacheKey(type, locale, preview = false) {
  return `${CACHE_PREFIX}${type}:${locale}:${preview ? 'preview' : 'published'}`;
}

function setCache(key, data) {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
}

function getCache(key) {
  const cached = cache.get(key);
  if (!cached) return null;
  
  // Check if cache is expired
  if (Date.now() - cached.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  
  return cached.data;
}

function clearCache(pattern = null) {
  if (pattern) {
    // Clear cache entries matching pattern
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        cache.delete(key);
      }
    }
  } else {
    // Clear all cache
    cache.clear();
  }
}

/**
 * Initialize footer API routes
 */
function initFooterAPI(app, pool) {
  
  // ============================================================================
  // GET /api/footer-content - Get complete footer content
  // ============================================================================
  app.get('/api/footer-content', async (req, res) => {
    try {
      const locale = req.query.locale || 'en';
      const preview = req.query.preview === 'true';
      const cacheKey = getCacheKey('complete', locale, preview);
      
      // Check cache first
      let cachedResult = getCache(cacheKey);
      if (cachedResult && !preview) {
        return res.json(cachedResult);
      }
      
      console.log(`🦶 Fetching footer content (locale: ${locale}, preview: ${preview})`);
      
      // Get main footer content
      const contentQuery = `
        SELECT * FROM footer_content 
        WHERE locale = $1 OR locale = 'en'
        ORDER BY locale = $1 DESC, created_at DESC 
        LIMIT 1
      `;
      const contentResult = await pool.query(contentQuery, [locale]);
      
      if (contentResult.rows.length === 0) {
        return res.status(404).json({ 
          error: 'Footer content not found',
          locale,
          hint: 'Run footer migration script to populate data'
        });
      }
      
      const content = contentResult.rows[0];
      
      // Get navigation menus
      const navQuery = `
        SELECT menu_type, menu_title, menu_items, display_order, is_visible
        FROM footer_navigation_menus 
        WHERE (locale = $1 OR locale = 'en') AND is_visible = true
        ORDER BY locale = $1 DESC, display_order ASC
      `;
      const navResult = await pool.query(navQuery, [locale]);
      
      // Group navigation by menu type
      const navigation = {};
      const seenMenuTypes = new Set();
      
      for (const nav of navResult.rows) {
        if (!seenMenuTypes.has(nav.menu_type)) {
          navigation[nav.menu_type] = {
            title: nav.menu_title,
            items: nav.menu_items || [],
            order: nav.display_order
          };
          seenMenuTypes.add(nav.menu_type);
        }
      }
      
      // Get social links
      const socialQuery = `
        SELECT platform, url, icon_class, display_text, tooltip, display_order
        FROM footer_social_links 
        WHERE (locale = $1 OR locale = 'en') AND is_visible = true
        ORDER BY locale = $1 DESC, display_order ASC
      `;
      const socialResult = await pool.query(socialQuery, [locale]);
      
      // Group social links
      const social = {};
      const seenPlatforms = new Set();
      
      for (const link of socialResult.rows) {
        if (!seenPlatforms.has(link.platform)) {
          social[link.platform] = {
            url: link.url,
            icon: link.icon_class,
            text: link.display_text,
            tooltip: link.tooltip
          };
          seenPlatforms.add(link.platform);
        }
      }
      
      // Get newsletter config
      const newsletterQuery = `
        SELECT service_provider, form_fields, gdpr_consent_required, gdpr_consent_text
        FROM footer_newsletter_config 
        WHERE locale = $1 OR locale = 'en'
        ORDER BY locale = $1 DESC
        LIMIT 1
      `;
      const newsletterResult = await pool.query(newsletterQuery, [locale]);
      const newsletter = newsletterResult.rows[0] || {};
      
      // Construct response
      const response = {
        locale,
        version: content.version || 1,
        last_updated: content.updated_at,
        
        // Company information
        company: {
          name: content.company_name,
          description: content.company_description,
          logo_url: content.company_logo_url,
          tagline: content.company_tagline
        },
        
        // Contact information
        contact: {
          email: content.contact_email,
          phone: content.contact_phone,
          address: content.contact_address,
          support_email: content.support_email,
          sales_email: content.sales_email
        },
        
        // Navigation menus
        navigation,
        
        // Social links
        social,
        
        // Newsletter configuration
        newsletter: {
          enabled: content.newsletter_enabled,
          title: content.newsletter_title,
          subtitle: content.newsletter_subtitle,
          placeholder: content.newsletter_placeholder,
          button_text: content.newsletter_button_text,
          success_message: content.newsletter_success_message,
          error_message: content.newsletter_error_message,
          form_fields: newsletter.form_fields || [],
          gdpr_required: newsletter.gdpr_consent_required,
          gdpr_text: newsletter.gdpr_consent_text
        },
        
        // Legal information
        legal: {
          copyright: content.copyright_text,
          privacy_policy_url: content.privacy_policy_url,
          terms_of_service_url: content.terms_of_service_url,
          cookie_policy_url: content.cookie_policy_url
        },
        
        // Display settings
        settings: {
          show_social_links: content.show_social_links,
          show_newsletter: content.show_newsletter,
          show_contact_info: content.show_contact_info,
          show_navigation: content.show_navigation,
          show_company_info: content.show_company_info
        }
      };
      
      // Cache the response (except for preview mode)
      if (!preview) {
        setCache(cacheKey, response);
      }
      
      // Set cache headers
      res.set({
        'Cache-Control': preview ? 'no-cache' : 'public, max-age=3600',
        'ETag': `"${content.version}-${content.updated_at}"`
      });
      
      res.json(response);
      
    } catch (error) {
      console.error('❌ Error fetching footer content:', error);
      res.status(500).json({ 
        error: 'Failed to fetch footer content',
        message: error.message,
        locale: req.query.locale || 'en'
      });
    }
  });
  
  // ============================================================================
  // POST /api/footer-content - Update footer content (Admin only)
  // ============================================================================
  app.post('/api/footer-content', async (req, res) => {
    try {
      const { locale = 'en', ...updates } = req.body;
      
      console.log(`💾 Updating footer content (locale: ${locale})`);
      
      // Validate required fields
      if (!updates || Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'No updates provided' });
      }
      
      // Build dynamic update query
      const allowedFields = [
        'company_name', 'company_description', 'company_logo_url', 'company_tagline',
        'contact_email', 'contact_phone', 'contact_address', 'support_email', 'sales_email',
        'copyright_text', 'privacy_policy_url', 'terms_of_service_url', 'cookie_policy_url',
        'newsletter_enabled', 'newsletter_title', 'newsletter_subtitle', 'newsletter_placeholder',
        'newsletter_button_text', 'newsletter_success_message', 'newsletter_error_message',
        'show_social_links', 'show_newsletter', 'show_contact_info', 'show_navigation', 'show_company_info'
      ];
      
      const updateFields = [];
      const values = [locale];
      let paramIndex = 2;
      
      for (const [field, value] of Object.entries(updates)) {
        if (allowedFields.includes(field)) {
          updateFields.push(`${field} = $${paramIndex}`);
          values.push(value);
          paramIndex++;
        }
      }
      
      if (updateFields.length === 0) {
        return res.status(400).json({ error: 'No valid fields to update' });
      }
      
      // Add metadata fields
      updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
      updateFields.push(`updated_by = $${paramIndex}`);
      updateFields.push(`version = version + 1`);
      values.push(req.user?.email || 'admin');
      
      const query = `
        UPDATE footer_content 
        SET ${updateFields.join(', ')}
        WHERE locale = $1
        RETURNING *
      `;
      
      const result = await pool.query(query, values);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Footer content not found for locale' });
      }
      
      // Clear cache for this locale
      clearCache(locale);
      
      // Log the update
      await pool.query(`
        INSERT INTO footer_audit_log (
          table_name, record_id, action, locale, new_values, user_email
        ) VALUES ('footer_content', $1, 'UPDATE', $2, $3, $4)
      `, [
        result.rows[0].id,
        locale,
        JSON.stringify(updates),
        req.user?.email || 'admin'
      ]);
      
      res.json({
        success: true,
        data: result.rows[0],
        message: 'Footer content updated successfully'
      });
      
    } catch (error) {
      console.error('❌ Error updating footer content:', error);
      res.status(500).json({ 
        error: 'Failed to update footer content',
        message: error.message 
      });
    }
  });
  
  // ============================================================================
  // GET /api/footer-navigation - Get navigation menus only
  // ============================================================================
  app.get('/api/footer-navigation', async (req, res) => {
    try {
      const locale = req.query.locale || 'en';
      const menuType = req.query.menu_type;
      const cacheKey = getCacheKey('navigation', locale);
      
      let cachedResult = getCache(cacheKey);
      if (cachedResult) {
        const result = menuType ? 
          { [menuType]: cachedResult[menuType] } : 
          cachedResult;
        return res.json(result);
      }
      
      console.log(`📋 Fetching footer navigation (locale: ${locale})`);
      
      let query = `
        SELECT menu_type, menu_title, menu_items, display_order
        FROM footer_navigation_menus 
        WHERE (locale = $1 OR locale = 'en') AND is_visible = true
      `;
      const queryParams = [locale];
      
      if (menuType) {
        query += ' AND menu_type = $2';
        queryParams.push(menuType);
      }
      
      query += ' ORDER BY locale = $1 DESC, display_order ASC';
      
      const result = await pool.query(query, queryParams);
      
      const navigation = {};
      const seenMenuTypes = new Set();
      
      for (const nav of result.rows) {
        if (!seenMenuTypes.has(nav.menu_type)) {
          navigation[nav.menu_type] = {
            title: nav.menu_title,
            items: nav.menu_items || [],
            order: nav.display_order
          };
          seenMenuTypes.add(nav.menu_type);
        }
      }
      
      if (!menuType) {
        setCache(cacheKey, navigation);
      }
      
      const response = menuType ? 
        { [menuType]: navigation[menuType] } : 
        navigation;
        
      res.json(response);
      
    } catch (error) {
      console.error('❌ Error fetching footer navigation:', error);
      res.status(500).json({ 
        error: 'Failed to fetch footer navigation',
        message: error.message 
      });
    }
  });
  
  // ============================================================================
  // GET /api/footer-social - Get social links only
  // ============================================================================
  app.get('/api/footer-social', async (req, res) => {
    try {
      const locale = req.query.locale || 'en';
      const cacheKey = getCacheKey('social', locale);
      
      let cachedResult = getCache(cacheKey);
      if (cachedResult) {
        return res.json(cachedResult);
      }
      
      console.log(`📱 Fetching footer social links (locale: ${locale})`);
      
      const result = await pool.query(`
        SELECT platform, url, icon_class, display_text, tooltip, display_order
        FROM footer_social_links 
        WHERE (locale = $1 OR locale = 'en') AND is_visible = true
        ORDER BY locale = $1 DESC, display_order ASC
      `, [locale]);
      
      const social = {};
      const seenPlatforms = new Set();
      
      for (const link of result.rows) {
        if (!seenPlatforms.has(link.platform)) {
          social[link.platform] = {
            url: link.url,
            icon: link.icon_class,
            text: link.display_text,
            tooltip: link.tooltip,
            order: link.display_order
          };
          seenPlatforms.add(link.platform);
        }
      }
      
      setCache(cacheKey, social);
      res.json(social);
      
    } catch (error) {
      console.error('❌ Error fetching footer social links:', error);
      res.status(500).json({ 
        error: 'Failed to fetch footer social links',
        message: error.message 
      });
    }
  });
  
  // ============================================================================
  // GET /api/footer-health - Health check for footer API
  // ============================================================================
  app.get('/api/footer-health', async (req, res) => {
    try {
      const checks = {
        database: false,
        cache: false,
        tables: {}
      };
      
      // Test database connection
      try {
        await pool.query('SELECT 1');
        checks.database = true;
      } catch (error) {
        checks.database_error = error.message;
      }
      
      // Test cache
      try {
        const testKey = 'test:' + Date.now();
        setCache(testKey, 'test');
        const cached = getCache(testKey);
        checks.cache = cached === 'test';
        cache.delete(testKey);
      } catch (error) {
        checks.cache_error = error.message;
      }
      
      // Test footer tables
      const tables = ['footer_content', 'footer_navigation_menus', 'footer_social_links', 'footer_newsletter_config'];
      
      for (const table of tables) {
        try {
          const result = await pool.query(`SELECT COUNT(*) as count FROM ${table}`);
          checks.tables[table] = parseInt(result.rows[0].count);
        } catch (error) {
          checks.tables[table] = `Error: ${error.message}`;
        }
      }
      
      const allHealthy = checks.database && checks.cache && 
        Object.values(checks.tables).every(v => typeof v === 'number');
      
      res.status(allHealthy ? 200 : 503).json({
        status: allHealthy ? 'healthy' : 'unhealthy',
        timestamp: new Date().toISOString(),
        checks,
        cache_size: cache.size
      });
      
    } catch (error) {
      res.status(500).json({
        status: 'error',
        error: error.message
      });
    }
  });
  
  console.log('✅ Footer API endpoints initialized');
}

// Export the initialization function
module.exports = initFooterAPI;