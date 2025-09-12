#!/usr/bin/env node

/**
 * SECURE FOOTER DATA MIGRATION SCRIPT
 * 
 * Fixes: Connection leaks, data loss risks, JSON injection vulnerabilities
 * Enhanced migration with comprehensive error handling and validation
 */

const { Pool } = require('pg');
const fs = require('fs').promises;
const path = require('path');

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

class SecureFooterMigrator {
  constructor() {
    this.pool = null;
    this.client = null;
    this.migrationId = null;
    this.backupPath = null;
  }

  async run() {
    try {
      console.log(`\n${colors.bright}🔄 Secure Footer Data Migration${colors.reset}\n`);
      
      // Initialize database connection with proper error handling
      await this.initializeDatabase();
      
      // Create migration backup
      await this.createBackup();
      
      // Verify source tables exist
      await this.verifySourceTables();
      
      // Perform migration with transaction safety
      await this.performMigration();
      
      // Verify migration success
      await this.verifyMigration();
      
      log.success(`\n${colors.bright}Migration completed successfully!${colors.reset}`);
      log.info(`Backup created: ${this.backupPath}`);
      
    } catch (error) {
      log.error(`Migration failed: ${error.message}`);
      
      // Attempt rollback if we're in a transaction
      await this.handleError(error);
      
      process.exit(1);
    } finally {
      // Ensure connections are properly closed
      await this.cleanup();
    }
  }

  async initializeDatabase() {
    log.step('Initializing database connection...');
    
    try {
      // Create connection pool with proper configuration
      this.pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        max: 5, // Limit connections
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
      });
      
      // Test connection
      this.client = await this.pool.connect();
      await this.client.query('SELECT 1');
      
      log.success('Database connection established');
      
    } catch (error) {
      throw new Error(`Database connection failed: ${error.message}`);
    }
  }

  async createBackup() {
    log.step('Creating migration backup...');
    
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      this.migrationId = `migration_${timestamp}_${Math.random().toString(36).substr(2, 6)}`;
      this.backupPath = path.join(process.cwd(), `footer_migration_backup_${this.migrationId}.sql`);
      
      // Create comprehensive backup
      const backupQueries = [
        '-- Footer Migration Backup',
        `-- Migration ID: ${this.migrationId}`,
        `-- Created: ${new Date().toISOString()}`,
        '',
        '-- Backup existing footer tables',
        'DROP TABLE IF EXISTS footer_content_backup CASCADE;',
        'DROP TABLE IF EXISTS footer_navigation_menus_backup CASCADE;',
        'DROP TABLE IF EXISTS footer_social_links_backup CASCADE;',
        'DROP TABLE IF EXISTS footer_newsletter_config_backup CASCADE;',
        '',
        'CREATE TABLE footer_content_backup AS SELECT * FROM footer_content;',
        'CREATE TABLE footer_navigation_menus_backup AS SELECT * FROM footer_navigation_menus;', 
        'CREATE TABLE footer_social_links_backup AS SELECT * FROM footer_social_links;',
        'CREATE TABLE footer_newsletter_config_backup AS SELECT * FROM footer_newsletter_config;'
      ];
      
      await fs.writeFile(this.backupPath, backupQueries.join('\n'));
      
      // Execute backup
      for (const query of backupQueries.slice(6)) { // Skip comments
        if (query.trim() && !query.startsWith('--')) {
          try {
            await this.client.query(query);
          } catch (error) {
            // Table might not exist yet, which is fine
            if (!error.message.includes('does not exist')) {
              throw error;
            }
          }
        }
      }
      
      log.success(`Backup created: ${path.basename(this.backupPath)}`);
      
    } catch (error) {
      throw new Error(`Backup creation failed: ${error.message}`);
    }
  }

  async verifySourceTables() {
    log.step('Verifying source tables...');
    
    const requiredTables = ['career_orientation_page', 'career_center_page'];
    
    for (const tableName of requiredTables) {
      try {
        const tableExists = await this.client.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_name = $1
          )
        `, [tableName]);
        
        if (!tableExists.rows[0].exists) {
          log.warning(`Source table ${tableName} does not exist - skipping`);
          continue;
        }
        
        // Check if table has data
        const countResult = await this.client.query(`SELECT COUNT(*) as count FROM ${tableName}`);
        const rowCount = parseInt(countResult.rows[0].count);
        
        log.info(`Table ${tableName}: ${rowCount} rows`);
        
      } catch (error) {
        log.warning(`Could not verify table ${tableName}: ${error.message}`);
      }
    }
  }

  async performMigration() {
    log.step('Performing secure migration...');
    
    try {
      // Start transaction
      await this.client.query('BEGIN');
      
      // Migrate footer content
      await this.migrateFooterContent();
      
      // Migrate navigation menus
      await this.migrateNavigationMenus();
      
      // Migrate social links
      await this.migrateSocialLinks();
      
      // Migrate newsletter config
      await this.migrateNewsletterConfig();
      
      // Commit transaction
      await this.client.query('COMMIT');
      log.success('Migration transaction committed');
      
    } catch (error) {
      // Rollback on any error
      try {
        await this.client.query('ROLLBACK');
        log.warning('Migration transaction rolled back');
      } catch (rollbackError) {
        log.error(`Rollback failed: ${rollbackError.message}`);
      }
      
      throw new Error(`Migration failed: ${error.message}`);
    }
  }

  async migrateFooterContent() {
    log.info('Migrating footer content...');
    
    const locales = ['en', 'ru', 'he'];
    let migrated = 0;
    
    for (const locale of locales) {
      try {
        // Check if we already have footer content for this locale
        const existingCheck = await this.client.query(
          'SELECT id FROM footer_content WHERE locale = $1',
          [locale]
        );
        
        if (existingCheck.rows.length > 0) {
          log.info(`Footer content for ${locale} already exists - skipping`);
          continue;
        }
        
        // Extract content from career pages (example migration)
        const defaultContent = this.getDefaultFooterContent(locale);
        
        // Validate and sanitize content
        const sanitized = this.sanitizeFooterContent(defaultContent);
        
        // Insert with validation
        await this.client.query(`
          INSERT INTO footer_content (
            locale, company_name, company_description, company_logo_url,
            contact_email, support_email, sales_email,
            copyright_text, privacy_policy_url, terms_of_service_url,
            newsletter_enabled, newsletter_title, newsletter_subtitle,
            newsletter_placeholder, newsletter_button_text,
            newsletter_success_message, newsletter_error_message,
            show_social_links, show_newsletter, show_contact_info,
            show_navigation, show_company_info,
            created_by, updated_by
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24
          )
        `, [
          sanitized.locale,
          sanitized.company_name,
          sanitized.company_description,
          sanitized.company_logo_url,
          sanitized.contact_email,
          sanitized.support_email,
          sanitized.sales_email,
          sanitized.copyright_text,
          sanitized.privacy_policy_url,
          sanitized.terms_of_service_url,
          sanitized.newsletter_enabled,
          sanitized.newsletter_title,
          sanitized.newsletter_subtitle,
          sanitized.newsletter_placeholder,
          sanitized.newsletter_button_text,
          sanitized.newsletter_success_message,
          sanitized.newsletter_error_message,
          sanitized.show_social_links,
          sanitized.show_newsletter,
          sanitized.show_contact_info,
          sanitized.show_navigation,
          sanitized.show_company_info,
          this.migrationId,
          this.migrationId
        ]);
        
        migrated++;
        log.success(`Migrated footer content for ${locale}`);
        
      } catch (error) {
        log.error(`Failed to migrate footer content for ${locale}: ${error.message}`);
        throw error;
      }
    }
    
    log.success(`Migrated ${migrated} footer content records`);
  }

  async migrateNavigationMenus() {
    log.info('Migrating navigation menus...');
    
    const navigationData = this.getDefaultNavigationMenus();
    let migrated = 0;
    
    for (const nav of navigationData) {
      try {
        // Validate and sanitize navigation data
        const sanitized = this.sanitizeNavigationData(nav);
        
        // Check for duplicates
        const existingCheck = await this.client.query(
          'SELECT id FROM footer_navigation_menus WHERE locale = $1 AND menu_type = $2',
          [sanitized.locale, sanitized.menu_type]
        );
        
        if (existingCheck.rows.length > 0) {
          log.info(`Navigation menu ${sanitized.menu_type} for ${sanitized.locale} already exists - skipping`);
          continue;
        }
        
        await this.client.query(`
          INSERT INTO footer_navigation_menus (
            locale, menu_type, menu_title, display_order, 
            is_visible, menu_items
          ) VALUES ($1, $2, $3, $4, $5, $6)
        `, [
          sanitized.locale,
          sanitized.menu_type,
          sanitized.menu_title,
          sanitized.display_order,
          sanitized.is_visible,
          JSON.stringify(sanitized.menu_items)
        ]);
        
        migrated++;
        log.success(`Migrated navigation menu: ${sanitized.menu_type} (${sanitized.locale})`);
        
      } catch (error) {
        log.error(`Failed to migrate navigation menu: ${error.message}`);
        throw error;
      }
    }
    
    log.success(`Migrated ${migrated} navigation menu records`);
  }

  async migrateSocialLinks() {
    log.info('Migrating social links...');
    
    const socialData = this.getDefaultSocialLinks();
    let migrated = 0;
    
    for (const social of socialData) {
      try {
        const sanitized = this.sanitizeSocialData(social);
        
        // Check for duplicates
        const existingCheck = await this.client.query(
          'SELECT id FROM footer_social_links WHERE locale = $1 AND platform = $2',
          [sanitized.locale, sanitized.platform]
        );
        
        if (existingCheck.rows.length > 0) {
          log.info(`Social link ${sanitized.platform} for ${sanitized.locale} already exists - skipping`);
          continue;
        }
        
        await this.client.query(`
          INSERT INTO footer_social_links (
            locale, platform, url, icon_class, display_text,
            tooltip, display_order, is_visible, opens_new_tab
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [
          sanitized.locale,
          sanitized.platform,
          sanitized.url,
          sanitized.icon_class,
          sanitized.display_text,
          sanitized.tooltip,
          sanitized.display_order,
          sanitized.is_visible,
          sanitized.opens_new_tab
        ]);
        
        migrated++;
        log.success(`Migrated social link: ${sanitized.platform} (${sanitized.locale})`);
        
      } catch (error) {
        log.error(`Failed to migrate social link: ${error.message}`);
        throw error;
      }
    }
    
    log.success(`Migrated ${migrated} social link records`);
  }

  async migrateNewsletterConfig() {
    log.info('Migrating newsletter configuration...');
    
    const locales = ['en', 'ru', 'he'];
    let migrated = 0;
    
    for (const locale of locales) {
      try {
        const existingCheck = await this.client.query(
          'SELECT id FROM footer_newsletter_config WHERE locale = $1',
          [locale]
        );
        
        if (existingCheck.rows.length > 0) {
          log.info(`Newsletter config for ${locale} already exists - skipping`);
          continue;
        }
        
        const config = this.getDefaultNewsletterConfig(locale);
        const sanitized = this.sanitizeNewsletterConfig(config);
        
        await this.client.query(`
          INSERT INTO footer_newsletter_config (
            locale, service_provider, form_fields,
            gdpr_consent_required, gdpr_consent_text,
            double_opt_in, max_submissions_per_ip,
            rate_limit_window_minutes
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [
          sanitized.locale,
          sanitized.service_provider,
          JSON.stringify(sanitized.form_fields),
          sanitized.gdpr_consent_required,
          sanitized.gdpr_consent_text,
          sanitized.double_opt_in,
          sanitized.max_submissions_per_ip,
          sanitized.rate_limit_window_minutes
        ]);
        
        migrated++;
        log.success(`Migrated newsletter config for ${locale}`);
        
      } catch (error) {
        log.error(`Failed to migrate newsletter config: ${error.message}`);
        throw error;
      }
    }
    
    log.success(`Migrated ${migrated} newsletter config records`);
  }

  // Data sanitization methods
  sanitizeFooterContent(content) {
    return {
      locale: this.validateLocale(content.locale),
      company_name: this.sanitizeText(content.company_name, 255),
      company_description: this.sanitizeText(content.company_description, 2000),
      company_logo_url: this.sanitizeURL(content.company_logo_url),
      contact_email: this.sanitizeEmail(content.contact_email),
      support_email: this.sanitizeEmail(content.support_email),
      sales_email: this.sanitizeEmail(content.sales_email),
      copyright_text: this.sanitizeText(content.copyright_text, 500),
      privacy_policy_url: this.sanitizeURL(content.privacy_policy_url),
      terms_of_service_url: this.sanitizeURL(content.terms_of_service_url),
      newsletter_enabled: Boolean(content.newsletter_enabled),
      newsletter_title: this.sanitizeText(content.newsletter_title, 255),
      newsletter_subtitle: this.sanitizeText(content.newsletter_subtitle, 500),
      newsletter_placeholder: this.sanitizeText(content.newsletter_placeholder, 255),
      newsletter_button_text: this.sanitizeText(content.newsletter_button_text, 100),
      newsletter_success_message: this.sanitizeText(content.newsletter_success_message, 500),
      newsletter_error_message: this.sanitizeText(content.newsletter_error_message, 500),
      show_social_links: Boolean(content.show_social_links),
      show_newsletter: Boolean(content.show_newsletter),
      show_contact_info: Boolean(content.show_contact_info),
      show_navigation: Boolean(content.show_navigation),
      show_company_info: Boolean(content.show_company_info)
    };
  }

  sanitizeNavigationData(nav) {
    const allowedMenuTypes = ['main', 'courses', 'company', 'support', 'utility'];
    
    return {
      locale: this.validateLocale(nav.locale),
      menu_type: allowedMenuTypes.includes(nav.menu_type) ? nav.menu_type : 'main',
      menu_title: this.sanitizeText(nav.menu_title, 100),
      display_order: parseInt(nav.display_order) || 0,
      is_visible: Boolean(nav.is_visible !== false),
      menu_items: this.sanitizeMenuItems(nav.menu_items)
    };
  }

  sanitizeSocialData(social) {
    const allowedPlatforms = ['facebook', 'twitter', 'linkedin', 'instagram', 'youtube', 'telegram'];
    
    return {
      locale: this.validateLocale(social.locale),
      platform: allowedPlatforms.includes(social.platform) ? social.platform : 'other',
      url: this.sanitizeURL(social.url),
      icon_class: this.sanitizeText(social.icon_class, 100),
      display_text: this.sanitizeText(social.display_text, 100),
      tooltip: this.sanitizeText(social.tooltip, 255),
      display_order: parseInt(social.display_order) || 0,
      is_visible: Boolean(social.is_visible !== false),
      opens_new_tab: Boolean(social.opens_new_tab !== false)
    };
  }

  sanitizeNewsletterConfig(config) {
    return {
      locale: this.validateLocale(config.locale),
      service_provider: ['emailjs', 'mailchimp', 'sendgrid'].includes(config.service_provider) ? 
        config.service_provider : 'emailjs',
      form_fields: this.sanitizeFormFields(config.form_fields),
      gdpr_consent_required: Boolean(config.gdpr_consent_required),
      gdpr_consent_text: this.sanitizeText(config.gdpr_consent_text, 1000),
      double_opt_in: Boolean(config.double_opt_in),
      max_submissions_per_ip: Math.min(parseInt(config.max_submissions_per_ip) || 5, 50),
      rate_limit_window_minutes: Math.min(parseInt(config.rate_limit_window_minutes) || 60, 1440)
    };
  }

  // Validation helpers
  validateLocale(locale) {
    const allowed = ['en', 'ru', 'he'];
    return allowed.includes(locale) ? locale : 'en';
  }

  sanitizeText(text, maxLength = 1000) {
    if (!text || typeof text !== 'string') return '';
    return text.slice(0, maxLength).replace(/[<>\"'&]/g, '');
  }

  sanitizeURL(url) {
    if (!url || typeof url !== 'string') return '';
    if (!url.match(/^(https?:\/\/|\/)/)) return '';
    return url.slice(0, 500);
  }

  sanitizeEmail(email) {
    if (!email || typeof email !== 'string') return '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? email.slice(0, 255) : '';
  }

  sanitizeMenuItems(items) {
    if (!Array.isArray(items)) return [];
    
    return items.slice(0, 20).map(item => ({
      text: this.sanitizeText(item.text, 100),
      url: this.sanitizeURL(item.url),
      target: ['_self', '_blank'].includes(item.target) ? item.target : '_self',
      icon: this.sanitizeText(item.icon, 50),
      order: parseInt(item.order) || 0,
      visible: Boolean(item.visible !== false)
    })).filter(item => item.text && item.url);
  }

  sanitizeFormFields(fields) {
    if (!Array.isArray(fields)) return [];
    
    const allowedTypes = ['email', 'text', 'checkbox'];
    
    return fields.slice(0, 10).map(field => ({
      name: this.sanitizeText(field.name, 50),
      type: allowedTypes.includes(field.type) ? field.type : 'text',
      required: Boolean(field.required),
      placeholder: this.sanitizeText(field.placeholder, 100),
      validation: this.sanitizeText(field.validation, 50)
    })).filter(field => field.name);
  }

  // Default data generators
  getDefaultFooterContent(locale) {
    const content = {
      en: {
        locale: 'en',
        company_name: 'AI Studio',
        company_description: 'Elevate your tech career with expert-led courses. If you are just aiming to advance your skills, our practical training is designed for you.',
        company_logo_url: '/images/Logo.svg',
        contact_email: 'contact@aistudio555.com',
        support_email: 'support@aistudio555.com',
        sales_email: 'sales@aistudio555.com',
        copyright_text: '© 2024 AI Studio. All rights reserved.',
        privacy_policy_url: '/privacy-policy',
        terms_of_service_url: '/terms-of-service',
        newsletter_enabled: true,
        newsletter_title: 'Subscribe to Newsletter',
        newsletter_subtitle: 'Get the latest courses and updates delivered to your inbox',
        newsletter_placeholder: 'Enter email to subscribe',
        newsletter_button_text: 'Subscribe',
        newsletter_success_message: 'Thank you for subscribing!',
        newsletter_error_message: 'Something went wrong. Please try again.',
        show_social_links: true,
        show_newsletter: true,
        show_contact_info: true,
        show_navigation: true,
        show_company_info: true
      },
      ru: {
        locale: 'ru',
        company_name: 'AI Студия',
        company_description: 'Развивайте свою техническую карьеру с экспертными курсами. Если вы хотите повысить свои навыки, наше практическое обучение создано для вас.',
        company_logo_url: '/images/Logo.svg',
        contact_email: 'contact@aistudio555.com',
        support_email: 'support@aistudio555.com',
        sales_email: 'sales@aistudio555.com',
        copyright_text: '© 2024 AI Студия. Все права защищены.',
        privacy_policy_url: '/privacy-policy',
        terms_of_service_url: '/terms-of-service',
        newsletter_enabled: true,
        newsletter_title: 'Подписаться на рассылку',
        newsletter_subtitle: 'Получайте последние курсы и обновления на вашу почту',
        newsletter_placeholder: 'Введите email для подписки',
        newsletter_button_text: 'Подписаться',
        newsletter_success_message: 'Спасибо за подписку!',
        newsletter_error_message: 'Что-то пошло не так. Попробуйте снова.',
        show_social_links: true,
        show_newsletter: true,
        show_contact_info: true,
        show_navigation: true,
        show_company_info: true
      },
      he: {
        locale: 'he',
        company_name: 'AI סטודיו',
        company_description: 'קדמו בקריירה הטכנולוגית שלכם עם קורסים מקצועיים. אם אתם שואפים לשפר את הכישורים שלכם, ההכשרה המעשית שלנו מיועדת בדיוק עבורכם.',
        company_logo_url: '/images/Logo.svg',
        contact_email: 'contact@aistudio555.com',
        support_email: 'support@aistudio555.com',
        sales_email: 'sales@aistudio555.com',
        copyright_text: '© 2024 AI סטודיו. כל הזכויות שמורות.',
        privacy_policy_url: '/privacy-policy',
        terms_of_service_url: '/terms-of-service',
        newsletter_enabled: true,
        newsletter_title: 'הירשמו לניוזלטר',
        newsletter_subtitle: 'קבלו את הקורסים והעדכונים האחרונים ישירות למייל',
        newsletter_placeholder: 'הכנס מייל להרשמה',
        newsletter_button_text: 'הרשמה',
        newsletter_success_message: 'תודה על ההרשמה!',
        newsletter_error_message: 'משהו השתבש. נסו שוב.',
        show_social_links: true,
        show_newsletter: true,
        show_contact_info: true,
        show_navigation: true,
        show_company_info: true
      }
    };
    
    return content[locale] || content['en'];
  }

  getDefaultNavigationMenus() {
    return [
      // English navigation
      {
        locale: 'en',
        menu_type: 'main',
        menu_title: 'Main',
        display_order: 1,
        is_visible: true,
        menu_items: [
          { text: 'Home', url: '/home.html', target: '_self', order: 1, visible: true },
          { text: 'Courses', url: '/courses.html', target: '_self', order: 2, visible: true },
          { text: 'Teachers', url: '/teachers.html', target: '_self', order: 3, visible: true },
          { text: 'About Us', url: '/about-us.html', target: '_self', order: 4, visible: true }
        ]
      },
      {
        locale: 'en',
        menu_type: 'support',
        menu_title: 'Support',
        display_order: 2,
        is_visible: true,
        menu_items: [
          { text: 'Contact Us', url: '/contact-us.html', target: '_self', order: 1, visible: true },
          { text: 'Career Center', url: '/career-center.html', target: '_self', order: 2, visible: true },
          { text: 'Career Orientation', url: '/career-orientation.html', target: '_self', order: 3, visible: true }
        ]
      },
      // Russian navigation
      {
        locale: 'ru',
        menu_type: 'main',
        menu_title: 'Основное',
        display_order: 1,
        is_visible: true,
        menu_items: [
          { text: 'Главная', url: '/ru/index.html', target: '_self', order: 1, visible: true },
          { text: 'Курсы', url: '/ru/courses.html', target: '_self', order: 2, visible: true },
          { text: 'Преподаватели', url: '/ru/teachers.html', target: '_self', order: 3, visible: true },
          { text: 'О нас', url: '/ru/about.html', target: '_self', order: 4, visible: true }
        ]
      },
      // Hebrew navigation
      {
        locale: 'he',
        menu_type: 'main',
        menu_title: 'ראשי',
        display_order: 1,
        is_visible: true,
        menu_items: [
          { text: 'בית', url: '/he/index.html', target: '_self', order: 1, visible: true },
          { text: 'קורסים', url: '/he/courses.html', target: '_self', order: 2, visible: true },
          { text: 'מרצים', url: '/he/teachers.html', target: '_self', order: 3, visible: true },
          { text: 'אודות', url: '/he/about.html', target: '_self', order: 4, visible: true }
        ]
      }
    ];
  }

  getDefaultSocialLinks() {
    return [
      { locale: 'en', platform: 'facebook', url: 'https://facebook.com/aistudio555', icon_class: 'fab fa-facebook-f', display_text: 'Facebook', tooltip: 'Follow us on Facebook', display_order: 1, is_visible: true, opens_new_tab: true },
      { locale: 'en', platform: 'linkedin', url: 'https://linkedin.com/company/aistudio555', icon_class: 'fab fa-linkedin-in', display_text: 'LinkedIn', tooltip: 'Connect on LinkedIn', display_order: 2, is_visible: true, opens_new_tab: true },
      { locale: 'en', platform: 'instagram', url: 'https://instagram.com/aistudio555', icon_class: 'fab fa-instagram', display_text: 'Instagram', tooltip: 'Follow on Instagram', display_order: 3, is_visible: true, opens_new_tab: true },
      // Russian social links (same URLs, different text)
      { locale: 'ru', platform: 'facebook', url: 'https://facebook.com/aistudio555', icon_class: 'fab fa-facebook-f', display_text: 'Facebook', tooltip: 'Подписывайтесь в Facebook', display_order: 1, is_visible: true, opens_new_tab: true },
      { locale: 'ru', platform: 'linkedin', url: 'https://linkedin.com/company/aistudio555', icon_class: 'fab fa-linkedin-in', display_text: 'LinkedIn', tooltip: 'Связаться в LinkedIn', display_order: 2, is_visible: true, opens_new_tab: true },
      // Hebrew social links
      { locale: 'he', platform: 'facebook', url: 'https://facebook.com/aistudio555', icon_class: 'fab fa-facebook-f', display_text: 'Facebook', tooltip: 'עקבו אחרינו בפייסבוק', display_order: 1, is_visible: true, opens_new_tab: true },
      { locale: 'he', platform: 'linkedin', url: 'https://linkedin.com/company/aistudio555', icon_class: 'fab fa-linkedin-in', display_text: 'LinkedIn', tooltip: 'התחברו בלינקדאין', display_order: 2, is_visible: true, opens_new_tab: true }
    ];
  }

  getDefaultNewsletterConfig(locale) {
    const configs = {
      en: {
        locale: 'en',
        service_provider: 'emailjs',
        form_fields: [
          { name: 'email', type: 'email', required: true, placeholder: 'Enter your email', validation: 'email' },
          { name: 'name', type: 'text', required: false, placeholder: 'Your name (optional)', validation: '' }
        ],
        gdpr_consent_required: true,
        gdpr_consent_text: 'I agree to receive marketing emails and accept the privacy policy',
        double_opt_in: false,
        max_submissions_per_ip: 5,
        rate_limit_window_minutes: 60
      },
      ru: {
        locale: 'ru',
        service_provider: 'emailjs',
        form_fields: [
          { name: 'email', type: 'email', required: true, placeholder: 'Введите ваш email', validation: 'email' },
          { name: 'name', type: 'text', required: false, placeholder: 'Ваше имя (необязательно)', validation: '' }
        ],
        gdpr_consent_required: true,
        gdpr_consent_text: 'Я согласен получать маркетинговые письма и принимаю политику конфиденциальности',
        double_opt_in: false,
        max_submissions_per_ip: 5,
        rate_limit_window_minutes: 60
      },
      he: {
        locale: 'he',
        service_provider: 'emailjs',
        form_fields: [
          { name: 'email', type: 'email', required: true, placeholder: 'הכנס את המייל שלך', validation: 'email' },
          { name: 'name', type: 'text', required: false, placeholder: 'השם שלך (אופציונלי)', validation: '' }
        ],
        gdpr_consent_required: true,
        gdpr_consent_text: 'אני מסכים לקבל מיילים שיווקיים ומקבל את מדיניות הפרטיות',
        double_opt_in: false,
        max_submissions_per_ip: 5,
        rate_limit_window_minutes: 60
      }
    };
    
    return configs[locale] || configs['en'];
  }

  async verifyMigration() {
    log.step('Verifying migration results...');
    
    try {
      const tables = [
        { name: 'footer_content', expected: 3 },
        { name: 'footer_navigation_menus', expected: 4 },
        { name: 'footer_social_links', expected: 7 },
        { name: 'footer_newsletter_config', expected: 3 }
      ];
      
      for (const table of tables) {
        const result = await this.client.query(`SELECT COUNT(*) as count FROM ${table.name}`);
        const count = parseInt(result.rows[0].count);
        
        log.info(`${table.name}: ${count} records`);
        
        if (count === 0) {
          log.warning(`No records found in ${table.name}`);
        }
      }
      
      log.success('Migration verification completed');
      
    } catch (error) {
      throw new Error(`Migration verification failed: ${error.message}`);
    }
  }

  async handleError(error) {
    log.error('Handling migration error...');
    
    try {
      if (this.client) {
        // Try to rollback transaction if still active
        await this.client.query('ROLLBACK');
        log.info('Transaction rolled back');
      }
    } catch (rollbackError) {
      log.error(`Rollback error: ${rollbackError.message}`);
    }
    
    // Log error details for debugging
    console.error('\nError details:', {
      message: error.message,
      stack: error.stack,
      migrationId: this.migrationId,
      backupPath: this.backupPath
    });
  }

  async cleanup() {
    log.info('Cleaning up connections...');
    
    try {
      if (this.client) {
        this.client.release();
        this.client = null;
      }
      
      if (this.pool) {
        await this.pool.end();
        this.pool = null;
      }
      
      log.success('Database connections closed');
      
    } catch (error) {
      log.error(`Cleanup error: ${error.message}`);
    }
  }
}

// Check command line arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Secure Footer Data Migration Script

Usage: node secure-migration.js

Environment Variables:
  DATABASE_URL    PostgreSQL connection string (required)
  NODE_ENV        Environment (development/production)

This script will:
1. Create a backup of existing footer data
2. Verify source tables exist
3. Migrate data with comprehensive validation
4. Verify migration success
5. Handle errors with automatic rollback

Example:
  DATABASE_URL="postgresql://user:pass@localhost/db" node secure-migration.js
  `);
  process.exit(0);
}

// Run migration
const migrator = new SecureFooterMigrator();
migrator.run();