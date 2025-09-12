#!/usr/bin/env node

/**
 * FOOTER DATA MIGRATION SCRIPT
 * 
 * This script extracts footer data from existing tables and migrates it to the new
 * dedicated footer tables structure.
 * 
 * Data Sources:
 * - Career orientation pages (26 footer fields)
 * - Career center pages (basic footer fields)
 * - Pages table (generic footer fields)
 * - Hard-coded HTML footer content
 * 
 * Target Tables:
 * - footer_content
 * - footer_navigation_menus
 * - footer_social_links
 * - footer_newsletter_config
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  step: (msg) => console.log(`\n${colors.cyan}▶${colors.reset} ${colors.bright}${msg}${colors.reset}`)
};

class FooterDataMigration {
  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
    
    this.migratedData = {
      content: [],
      navigation: [],
      social: [],
      newsletter: []
    };
    
    this.backupDir = path.join(__dirname, '..', 'backups');
    this.timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
  }

  async run() {
    try {
      console.log(`\n${colors.bright}🔄 Footer Data Migration Tool${colors.reset}\n`);
      
      // Create backup directory
      await this.createBackupDirectory();
      
      // Backup existing footer data
      await this.backupExistingData();
      
      // Check if new footer tables exist
      await this.checkFooterTables();
      
      // Extract footer data from existing tables
      await this.extractFromCareerOrientation();
      await this.extractFromCareerCenter();
      await this.extractFromPages();
      await this.extractFromHTML();
      
      // Migrate to new tables
      await this.migrateToFooterTables();
      
      // Verify migration
      await this.verifyMigration();
      
      // Generate migration report
      await this.generateReport();
      
      log.success(`\n${colors.bright}Footer data migration completed successfully!${colors.reset}`);
      
    } catch (error) {
      log.error(`Migration failed: ${error.message}`);
      console.error(error);
      process.exit(1);
    } finally {
      await this.pool.end();
    }
  }

  async createBackupDirectory() {
    log.step('Creating backup directory...');
    
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
      log.success(`Created backup directory: ${this.backupDir}`);
    } else {
      log.info(`Backup directory exists: ${this.backupDir}`);
    }
  }

  async backupExistingData() {
    log.step('Backing up existing footer data...');
    
    try {
      const queries = [
        'SELECT * FROM career_orientation_page',
        'SELECT * FROM career_center_page',
        'SELECT * FROM pages WHERE page_type IN (\'home\', \'about\')',
      ];
      
      const backupData = {};
      
      for (const query of queries) {
        try {
          const result = await this.pool.query(query);
          const tableName = query.split(' FROM ')[1].split(' ')[0];
          backupData[tableName] = result.rows;
          log.info(`Backed up ${result.rows.length} records from ${tableName}`);
        } catch (err) {
          log.warning(`Table not found or error: ${err.message}`);
          backupData[query] = [];
        }
      }
      
      const backupFile = path.join(this.backupDir, `footer_data_backup_${this.timestamp}.json`);
      fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));
      log.success(`Backup saved: ${backupFile}`);
      
    } catch (error) {
      log.warning(`Backup failed: ${error.message}`);
    }
  }

  async checkFooterTables() {
    log.step('Checking footer tables...');
    
    try {
      const result = await this.pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name LIKE 'footer_%'
      `);
      
      const expectedTables = ['footer_content', 'footer_navigation_menus', 'footer_social_links', 'footer_newsletter_config'];
      const existingTables = result.rows.map(r => r.table_name);
      
      for (const table of expectedTables) {
        if (existingTables.includes(table)) {
          log.success(`Table exists: ${table}`);
        } else {
          throw new Error(`Required table missing: ${table}. Please run 01-create-footer-tables.sql first.`);
        }
      }
      
    } catch (error) {
      throw new Error(`Footer tables check failed: ${error.message}`);
    }
  }

  async extractFromCareerOrientation() {
    log.step('Extracting footer data from career orientation pages...');
    
    try {
      const result = await this.pool.query(`
        SELECT 
          locale,
          footer_company_name,
          footer_company_description,
          footer_company_logo,
          footer_company_address,
          footer_company_phone,
          footer_company_email,
          footer_quick_links_title,
          footer_quick_link_1_label,
          footer_quick_link_1_url,
          footer_quick_link_2_label,
          footer_quick_link_2_url,
          footer_quick_link_3_label,
          footer_quick_link_3_url,
          footer_social_media_title,
          footer_facebook_url,
          footer_twitter_url,
          footer_linkedin_url,
          footer_instagram_url,
          footer_youtube_url,
          footer_github_url,
          footer_newsletter_enabled,
          footer_newsletter_title,
          footer_newsletter_description,
          footer_copyright_text
        FROM career_orientation_page
        WHERE footer_section_visible = true
      `);
      
      for (const row of result.rows) {
        // Extract content data
        this.migratedData.content.push({
          locale: row.locale || 'en',
          company_name: row.footer_company_name,
          company_description: row.footer_company_description,
          company_logo_url: row.footer_company_logo,
          contact_email: row.footer_company_email,
          contact_phone: row.footer_company_phone,
          contact_address: row.footer_company_address,
          copyright_text: row.footer_copyright_text,
          newsletter_enabled: row.footer_newsletter_enabled,
          newsletter_title: row.footer_newsletter_title,
          newsletter_subtitle: row.footer_newsletter_description,
          source: 'career_orientation'
        });
        
        // Extract navigation data
        if (row.footer_quick_link_1_label && row.footer_quick_link_1_url) {
          const quickLinks = [];
          
          if (row.footer_quick_link_1_label) quickLinks.push({
            text: row.footer_quick_link_1_label,
            url: row.footer_quick_link_1_url,
            order: 1,
            visible: true
          });
          
          if (row.footer_quick_link_2_label) quickLinks.push({
            text: row.footer_quick_link_2_label,
            url: row.footer_quick_link_2_url,
            order: 2,
            visible: true
          });
          
          if (row.footer_quick_link_3_label) quickLinks.push({
            text: row.footer_quick_link_3_label,
            url: row.footer_quick_link_3_url,
            order: 3,
            visible: true
          });
          
          if (quickLinks.length > 0) {
            this.migratedData.navigation.push({
              locale: row.locale || 'en',
              menu_type: 'quick_links',
              menu_title: row.footer_quick_links_title || 'Quick Links',
              menu_items: quickLinks,
              source: 'career_orientation'
            });
          }
        }
        
        // Extract social links
        const socialLinks = [];
        if (row.footer_facebook_url) socialLinks.push({
          platform: 'facebook',
          url: row.footer_facebook_url,
          locale: row.locale || 'en'
        });
        if (row.footer_twitter_url) socialLinks.push({
          platform: 'twitter',
          url: row.footer_twitter_url,
          locale: row.locale || 'en'
        });
        if (row.footer_linkedin_url) socialLinks.push({
          platform: 'linkedin',
          url: row.footer_linkedin_url,
          locale: row.locale || 'en'
        });
        if (row.footer_instagram_url) socialLinks.push({
          platform: 'instagram',
          url: row.footer_instagram_url,
          locale: row.locale || 'en'
        });
        if (row.footer_youtube_url) socialLinks.push({
          platform: 'youtube',
          url: row.footer_youtube_url,
          locale: row.locale || 'en'
        });
        if (row.footer_github_url) socialLinks.push({
          platform: 'github',
          url: row.footer_github_url,
          locale: row.locale || 'en'
        });
        
        this.migratedData.social.push(...socialLinks);
      }
      
      log.success(`Extracted data from ${result.rows.length} career orientation records`);
      
    } catch (error) {
      log.warning(`Career orientation extraction failed: ${error.message}`);
    }
  }

  async extractFromCareerCenter() {
    log.step('Extracting footer data from career center pages...');
    
    try {
      const result = await this.pool.query(`
        SELECT 
          locale,
          footer_email,
          footer_phone,
          footer_address,
          footer_copyright
        FROM career_center_page
      `);
      
      for (const row of result.rows) {
        this.migratedData.content.push({
          locale: row.locale || 'en',
          contact_email: row.footer_email,
          contact_phone: row.footer_phone,
          contact_address: row.footer_address,
          copyright_text: row.footer_copyright,
          source: 'career_center'
        });
      }
      
      log.success(`Extracted data from ${result.rows.length} career center records`);
      
    } catch (error) {
      log.warning(`Career center extraction failed: ${error.message}`);
    }
  }

  async extractFromPages() {
    log.step('Extracting footer data from pages table...');
    
    try {
      const result = await this.pool.query(`
        SELECT 
          locale,
          page_type,
          footer_email,
          footer_phone,
          footer_address,
          footer_copyright
        FROM pages
        WHERE footer_email IS NOT NULL OR footer_copyright IS NOT NULL
      `);
      
      for (const row of result.rows) {
        this.migratedData.content.push({
          locale: row.locale || 'en',
          contact_email: row.footer_email,
          contact_phone: row.footer_phone,
          contact_address: row.footer_address,
          copyright_text: row.footer_copyright,
          source: `pages_${row.page_type}`
        });
      }
      
      log.success(`Extracted data from ${result.rows.length} page records`);
      
    } catch (error) {
      log.warning(`Pages extraction failed: ${error.message}`);
    }
  }

  async extractFromHTML() {
    log.step('Extracting footer data from HTML files...');
    
    try {
      // Standard navigation items found in HTML
      const standardNavigation = {
        main: [
          { text: 'Home', url: '/home.html', order: 1 },
          { text: 'About Us', url: '/about-us.html', order: 2 },
          { text: 'Courses', url: '/courses.html', order: 3 },
          { text: 'Teachers', url: '/teachers.html', order: 4 },
          { text: 'Pricing', url: '/pricing.html', order: 5 },
          { text: 'Career Center', url: '/career-center.html', order: 6 },
          { text: 'Career Orientation', url: '/career-orientation.html', order: 7 },
          { text: 'Blog', url: '/blog.html', order: 8 },
          { text: 'Contact Us', url: '/contact-us.html', order: 9 }
        ],
        utility: [
          { text: '404 Not Found', url: '/404.html', order: 1 },
          { text: 'Password Protected', url: '/401.html', order: 2 },
          { text: 'Style Guide', url: '/style-guide.html', order: 3 },
          { text: 'Licenses', url: '/licenses.html', order: 4 }
        ]
      };
      
      // Add standard navigation for each locale
      const locales = ['en', 'ru', 'he'];
      const localeNavigation = {
        en: standardNavigation,
        ru: {
          main: [
            { text: 'Главная', url: '/ru/home.html', order: 1 },
            { text: 'О нас', url: '/ru/about-us.html', order: 2 },
            { text: 'Курсы', url: '/ru/courses.html', order: 3 },
            { text: 'Преподаватели', url: '/ru/teachers.html', order: 4 },
            { text: 'Цены', url: '/ru/pricing.html', order: 5 },
            { text: 'Карьерный центр', url: '/ru/career-center.html', order: 6 },
            { text: 'Блог', url: '/ru/blog.html', order: 7 },
            { text: 'Контакты', url: '/ru/contact-us.html', order: 8 }
          ]
        },
        he: {
          main: [
            { text: 'בית', url: '/he/home.html', order: 1 },
            { text: 'אודות', url: '/he/about-us.html', order: 2 },
            { text: 'קורסים', url: '/he/courses.html', order: 3 },
            { text: 'מורים', url: '/he/teachers.html', order: 4 },
            { text: 'מחירים', url: '/he/pricing.html', order: 5 },
            { text: 'מרכז קריירה', url: '/he/career-center.html', order: 6 },
            { text: 'בלוג', url: '/he/blog.html', order: 7 },
            { text: 'צור קשר', url: '/he/contact-us.html', order: 8 }
          ]
        }
      };
      
      for (const locale of locales) {
        const nav = localeNavigation[locale] || localeNavigation.en;
        
        for (const [menuType, items] of Object.entries(nav)) {
          this.migratedData.navigation.push({
            locale,
            menu_type: menuType,
            menu_title: menuType === 'main' ? (locale === 'ru' ? 'Меню' : locale === 'he' ? 'תפריט' : 'Menu') : 
                       menuType === 'utility' ? (locale === 'ru' ? 'Служебные' : locale === 'he' ? 'עמודי עזר' : 'Utility Pages') : 
                       menuType.charAt(0).toUpperCase() + menuType.slice(1),
            menu_items: items.map(item => ({ ...item, visible: true })),
            source: 'html_extraction'
          });
        }
      }
      
      log.success('Extracted navigation from HTML structure');
      
    } catch (error) {
      log.warning(`HTML extraction failed: ${error.message}`);
    }
  }

  async migrateToFooterTables() {
    log.step('Migrating data to footer tables...');
    
    try {
      // Clear existing data
      await this.pool.query('DELETE FROM footer_content WHERE created_by = $1', ['migration']);
      await this.pool.query('DELETE FROM footer_navigation_menus WHERE locale IN (SELECT DISTINCT locale FROM footer_content WHERE created_by = $1)', ['migration']);
      await this.pool.query('DELETE FROM footer_social_links WHERE locale IN (SELECT DISTINCT locale FROM footer_content WHERE created_by = $1)', ['migration']);
      
      // Consolidate and deduplicate content data
      const contentMap = new Map();
      for (const content of this.migratedData.content) {
        const key = content.locale;
        if (!contentMap.has(key)) {
          contentMap.set(key, { locale: content.locale });
        }
        const existing = contentMap.get(key);
        
        // Merge data, preferring non-null values
        Object.keys(content).forEach(field => {
          if (content[field] && !existing[field]) {
            existing[field] = content[field];
          }
        });
      }
      
      // Insert consolidated content
      for (const [locale, content] of contentMap.entries()) {
        await this.pool.query(`
          INSERT INTO footer_content (
            locale, company_name, company_description, company_logo_url,
            contact_email, contact_phone, contact_address, copyright_text,
            newsletter_enabled, newsletter_title, newsletter_subtitle,
            created_by, updated_by
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
          ON CONFLICT (locale) DO UPDATE SET
            company_name = COALESCE(EXCLUDED.company_name, footer_content.company_name),
            company_description = COALESCE(EXCLUDED.company_description, footer_content.company_description),
            company_logo_url = COALESCE(EXCLUDED.company_logo_url, footer_content.company_logo_url),
            contact_email = COALESCE(EXCLUDED.contact_email, footer_content.contact_email),
            contact_phone = COALESCE(EXCLUDED.contact_phone, footer_content.contact_phone),
            contact_address = COALESCE(EXCLUDED.contact_address, footer_content.contact_address),
            copyright_text = COALESCE(EXCLUDED.copyright_text, footer_content.copyright_text),
            newsletter_enabled = COALESCE(EXCLUDED.newsletter_enabled, footer_content.newsletter_enabled),
            newsletter_title = COALESCE(EXCLUDED.newsletter_title, footer_content.newsletter_title),
            newsletter_subtitle = COALESCE(EXCLUDED.newsletter_subtitle, footer_content.newsletter_subtitle),
            updated_by = EXCLUDED.updated_by,
            updated_at = CURRENT_TIMESTAMP
        `, [
          locale,
          content.company_name,
          content.company_description,
          content.company_logo_url,
          content.contact_email,
          content.contact_phone,
          content.contact_address,
          content.copyright_text,
          content.newsletter_enabled,
          content.newsletter_title,
          content.newsletter_subtitle,
          'migration',
          'migration'
        ]);
      }
      
      log.success(`Migrated ${contentMap.size} footer content records`);
      
      // Insert navigation menus
      let navCount = 0;
      for (const nav of this.migratedData.navigation) {
        try {
          await this.pool.query(`
            INSERT INTO footer_navigation_menus (locale, menu_type, menu_title, menu_items)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (locale, menu_type) DO UPDATE SET
              menu_title = EXCLUDED.menu_title,
              menu_items = EXCLUDED.menu_items,
              updated_at = CURRENT_TIMESTAMP
          `, [nav.locale, nav.menu_type, nav.menu_title, JSON.stringify(nav.menu_items)]);
          navCount++;
        } catch (error) {
          log.warning(`Failed to insert navigation menu: ${error.message}`);
        }
      }
      
      log.success(`Migrated ${navCount} navigation menu records`);
      
      // Insert social links
      let socialCount = 0;
      for (const social of this.migratedData.social) {
        try {
          await this.pool.query(`
            INSERT INTO footer_social_links (
              locale, platform, url, icon_class, display_text, 
              tooltip, display_order, is_visible
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (locale, platform) DO UPDATE SET
              url = EXCLUDED.url,
              updated_at = CURRENT_TIMESTAMP
          `, [
            social.locale,
            social.platform,
            social.url,
            `fab fa-${social.platform}`,
            social.platform.charAt(0).toUpperCase() + social.platform.slice(1),
            `Follow us on ${social.platform.charAt(0).toUpperCase() + social.platform.slice(1)}`,
            socialCount % 10,
            true
          ]);
          socialCount++;
        } catch (error) {
          log.warning(`Failed to insert social link: ${error.message}`);
        }
      }
      
      log.success(`Migrated ${socialCount} social link records`);
      
    } catch (error) {
      throw new Error(`Migration to footer tables failed: ${error.message}`);
    }
  }

  async verifyMigration() {
    log.step('Verifying migration...');
    
    try {
      const results = await Promise.all([
        this.pool.query('SELECT COUNT(*) as count FROM footer_content'),
        this.pool.query('SELECT COUNT(*) as count FROM footer_navigation_menus'),
        this.pool.query('SELECT COUNT(*) as count FROM footer_social_links'),
        this.pool.query('SELECT COUNT(*) as count FROM footer_newsletter_config')
      ]);
      
      const [content, nav, social, newsletter] = results.map(r => parseInt(r.rows[0].count));
      
      log.success(`Verification results:`);
      log.info(`  Footer content: ${content} records`);
      log.info(`  Navigation menus: ${nav} records`);
      log.info(`  Social links: ${social} records`);
      log.info(`  Newsletter configs: ${newsletter} records`);
      
      if (content === 0) {
        throw new Error('No footer content records found after migration!');
      }
      
    } catch (error) {
      throw new Error(`Migration verification failed: ${error.message}`);
    }
  }

  async generateReport() {
    log.step('Generating migration report...');
    
    try {
      const reportData = {
        migration_date: new Date().toISOString(),
        summary: {
          content_sources: this.migratedData.content.map(c => c.source),
          navigation_sources: this.migratedData.navigation.map(n => n.source),
          social_sources: this.migratedData.social.map(s => s.locale),
          total_records_migrated: {
            content: this.migratedData.content.length,
            navigation: this.migratedData.navigation.length,
            social: this.migratedData.social.length
          }
        },
        next_steps: [
          'Run API tests to ensure footer endpoints work',
          'Update frontend to use dynamic footer loader',
          'Test footer functionality on all pages',
          'Monitor performance impact',
          'Clean up old footer fields after validation'
        ]
      };
      
      const reportFile = path.join(this.backupDir, `footer_migration_report_${this.timestamp}.json`);
      fs.writeFileSync(reportFile, JSON.stringify(reportData, null, 2));
      log.success(`Migration report saved: ${reportFile}`);
      
    } catch (error) {
      log.warning(`Report generation failed: ${error.message}`);
    }
  }
}

// Run migration
const migration = new FooterDataMigration();
migration.run();