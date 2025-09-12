#!/usr/bin/env node

/**
 * FOOTER MIGRATION APPLICATION ROLLBACK SCRIPT
 * 
 * This script handles the application-level rollback of footer migration.
 * It removes footer-related code changes and restores original functionality.
 * 
 * Usage: node rollback-footer-scripts.js [--confirm]
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

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

class FooterMigrationRollback {
  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
    
    this.confirmed = process.argv.includes('--confirm');
    this.backupDir = path.join(__dirname, '..', 'backups');
    this.timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    
    this.rollbackActions = [];
  }

  async run() {
    try {
      console.log(`\n${colors.bright}🔄 Footer Migration Rollback Tool${colors.reset}\n`);
      
      if (!this.confirmed) {
        log.warning('This script will rollback footer migration changes.');
        log.warning('This includes removing:');
        console.log('  - Footer API endpoints from server.js');
        console.log('  - Footer loader JavaScript from HTML files');
        console.log('  - Footer admin panel integration');
        console.log('  - Footer-related database changes');
        console.log('  - Footer migration files');
        console.log('\nTo proceed, run: node rollback-footer-scripts.js --confirm');
        process.exit(0);
      }
      
      log.step('Starting footer migration rollback...');
      
      // Create backup
      await this.createApplicationBackup();
      
      // Rollback application changes
      await this.rollbackServerChanges();
      await this.rollbackFrontendChanges();
      await this.rollbackAdminPanelChanges();
      
      // Rollback database (optional - ask user)
      await this.askDatabaseRollback();
      
      // Clean up migration files
      await this.cleanupMigrationFiles();
      
      // Generate rollback report
      await this.generateRollbackReport();
      
      log.success(`\n${colors.bright}Footer migration rollback completed successfully!${colors.reset}`);
      
    } catch (error) {
      log.error(`Rollback failed: ${error.message}`);
      console.error(error);
      process.exit(1);
    } finally {
      await this.pool.end();
    }
  }

  async createApplicationBackup() {
    log.step('Creating application backup...');
    
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
    
    const backupFile = path.join(this.backupDir, `app_backup_before_rollback_${this.timestamp}.json`);
    
    const filesToBackup = [
      'server.js',
      'server.local.js',
      'package.json',
      'content-admin-comprehensive.html'
    ];
    
    const backup = {
      timestamp: new Date().toISOString(),
      files: {}
    };
    
    for (const file of filesToBackup) {
      const fullPath = path.join(process.cwd(), file);
      if (fs.existsSync(fullPath)) {
        backup.files[file] = {
          content: fs.readFileSync(fullPath, 'utf8'),
          stat: fs.statSync(fullPath)
        };
        log.info(`Backed up: ${file}`);
      }
    }
    
    fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));
    log.success(`Application backup created: ${backupFile}`);
    
    this.rollbackActions.push({
      action: 'create_backup',
      file: backupFile,
      status: 'completed'
    });
  }

  async rollbackServerChanges() {
    log.step('Rolling back server changes...');
    
    const serverFiles = ['server.js', 'server.local.js'];
    
    for (const serverFile of serverFiles) {
      const serverPath = path.join(process.cwd(), serverFile);
      
      if (!fs.existsSync(serverPath)) {
        log.warning(`Server file not found: ${serverFile}`);
        continue;
      }
      
      let serverContent = fs.readFileSync(serverPath, 'utf8');
      let modified = false;
      
      // Remove footer API endpoints
      const footerApiPatterns = [
        /\/\/ Footer API endpoints[\s\S]*?(?=\/\/|app\.)/g,
        /app\.get\(['"]\/api\/footer[\s\S]*?}\);/g,
        /app\.post\(['"]\/api\/footer[\s\S]*?}\);/g,
        /\/\/ Initialize footer API[\s\S]*?\n/g,
        /initFooterAPI\(app, pool\);[\s\S]*?\n/g,
        /const initFooterAPI = require[\s\S]*?\n/g
      ];
      
      footerApiPatterns.forEach(pattern => {
        if (pattern.test(serverContent)) {
          serverContent = serverContent.replace(pattern, '');
          modified = true;
        }
      });
      
      // Remove footer-related imports/requires
      const footerImports = [
        /const.*footer.*require.*\n/gi,
        /import.*footer.*from.*\n/gi
      ];
      
      footerImports.forEach(pattern => {
        if (pattern.test(serverContent)) {
          serverContent = serverContent.replace(pattern, '');
          modified = true;
        }
      });
      
      if (modified) {
        fs.writeFileSync(serverPath, serverContent);
        log.success(`Removed footer API from: ${serverFile}`);
        
        this.rollbackActions.push({
          action: 'remove_footer_api',
          file: serverFile,
          status: 'completed'
        });
      } else {
        log.info(`No footer API found in: ${serverFile}`);
      }
    }
  }

  async rollbackFrontendChanges() {
    log.step('Rolling back frontend changes...');
    
    // Find all HTML files
    const htmlFiles = this.findHtmlFiles(process.cwd());
    
    for (const htmlFile of htmlFiles) {
      try {
        let content = fs.readFileSync(htmlFile, 'utf8');
        let modified = false;
        
        // Remove footer loader script references
        const footerScriptPatterns = [
          /<script[^>]*footer-loader\.js[^>]*><\/script>/gi,
          /<script[^>]*>[\s\S]*?FooterLoader[\s\S]*?<\/script>/gi,
          /<!-- Footer Loader -->[\s\S]*?<!-- End Footer Loader -->/gi
        ];
        
        footerScriptPatterns.forEach(pattern => {
          if (pattern.test(content)) {
            content = content.replace(pattern, '');
            modified = true;
          }
        });
        
        // Remove footer configuration
        const footerConfigPatterns = [
          /window\.ENABLE_DYNAMIC_FOOTER[\s\S]*?;\n/gi,
          /<script[^>]*>[\s\S]*?ENABLE_DYNAMIC_FOOTER[\s\S]*?<\/script>/gi
        ];
        
        footerConfigPatterns.forEach(pattern => {
          if (pattern.test(content)) {
            content = content.replace(pattern, '');
            modified = true;
          }
        });
        
        if (modified) {
          fs.writeFileSync(htmlFile, content);
          log.success(`Removed footer loader from: ${path.relative(process.cwd(), htmlFile)}`);
          
          this.rollbackActions.push({
            action: 'remove_footer_loader',
            file: path.relative(process.cwd(), htmlFile),
            status: 'completed'
          });
        }
        
      } catch (error) {
        log.error(`Failed to process ${htmlFile}: ${error.message}`);
        
        this.rollbackActions.push({
          action: 'remove_footer_loader',
          file: path.relative(process.cwd(), htmlFile),
          status: 'failed',
          error: error.message
        });
      }
    }
  }

  async rollbackAdminPanelChanges() {
    log.step('Rolling back admin panel changes...');
    
    const adminPanelPath = path.join(process.cwd(), 'content-admin-comprehensive.html');
    
    if (!fs.existsSync(adminPanelPath)) {
      log.warning('Admin panel file not found, skipping...');
      return;
    }
    
    let content = fs.readFileSync(adminPanelPath, 'utf8');
    let modified = false;
    
    // Remove footer admin panel integration
    const footerAdminPatterns = [
      /<script[^>]*footer-admin-panel\.js[^>]*><\/script>/gi,
      /<!-- Footer Admin Panel -->[\s\S]*?<!-- End Footer Admin Panel -->/gi,
      /<div[^>]*footer-admin-section[\s\S]*?<\/div>/gi,
      /<script[^>]*>[\s\S]*?FooterAdminPanel[\s\S]*?<\/script>/gi
    ];
    
    footerAdminPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        content = content.replace(pattern, '');
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(adminPanelPath, content);
      log.success('Removed footer admin panel integration');
      
      this.rollbackActions.push({
        action: 'remove_footer_admin',
        file: 'content-admin-comprehensive.html',
        status: 'completed'
      });
    } else {
      log.info('No footer admin panel integration found');
    }
  }

  async askDatabaseRollback() {
    log.step('Database rollback options...');
    
    try {
      // Check if footer tables exist
      const result = await this.pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name LIKE 'footer_%'
      `);
      
      if (result.rows.length === 0) {
        log.info('No footer tables found in database');
        return;
      }
      
      log.warning(`Found ${result.rows.length} footer tables in database:`);
      result.rows.forEach(row => {
        console.log(`  - ${row.table_name}`);
      });
      
      console.log('\nTo rollback database changes, run:');
      console.log(`${colors.cyan}psql $DATABASE_URL -f footer-migration/rollback/rollback-footer-migration.sql${colors.reset}`);
      console.log('\nThis will:');
      console.log('  - Create backup tables');
      console.log('  - Drop all footer tables');
      console.log('  - Remove footer-related functions and triggers');
      console.log('  - Generate rollback report');
      
      this.rollbackActions.push({
        action: 'database_rollback_instructions',
        status: 'pending'
      });
      
    } catch (error) {
      log.warning(`Could not check database: ${error.message}`);
      
      this.rollbackActions.push({
        action: 'database_check',
        status: 'failed',
        error: error.message
      });
    }
  }

  async cleanupMigrationFiles() {
    log.step('Cleaning up migration files...');
    
    const migrationDir = path.join(process.cwd(), 'footer-migration');
    
    if (!fs.existsSync(migrationDir)) {
      log.info('Footer migration directory not found, skipping cleanup');
      return;
    }
    
    try {
      // Create archive of migration files before deletion
      const archiveName = `footer-migration-archive-${this.timestamp}.tar`;
      const archivePath = path.join(this.backupDir, archiveName);
      
      // Simple directory archival (basic implementation)
      const { execSync } = require('child_process');
      try {
        execSync(`tar -cf "${archivePath}" -C "${process.cwd()}" footer-migration`, { stdio: 'ignore' });
        log.success(`Archived migration files: ${archiveName}`);
      } catch (error) {
        log.warning('Could not create archive, copying important files to backup...');
        
        // Manual backup of important files
        const importantFiles = [
          'footer-migration/sql/01-create-footer-tables.sql',
          'footer-migration/sql/02-insert-default-data.sql',
          'footer-migration/scripts/migrate-existing-footer-data.js',
          'footer-migration/rollback/rollback-footer-migration.sql'
        ];
        
        for (const file of importantFiles) {
          const sourcePath = path.join(process.cwd(), file);
          if (fs.existsSync(sourcePath)) {
            const backupPath = path.join(this.backupDir, path.basename(file));
            fs.copyFileSync(sourcePath, backupPath);
            log.info(`Backed up: ${path.basename(file)}`);
          }
        }
      }
      
      // Remove footer-migration directory (optional, ask user)
      console.log('\nFooter migration files have been backed up.');
      console.log('You can manually remove the footer-migration directory when ready:');
      console.log(`${colors.cyan}rm -rf footer-migration${colors.reset}`);
      
      this.rollbackActions.push({
        action: 'archive_migration_files',
        status: 'completed'
      });
      
    } catch (error) {
      log.error(`Error during cleanup: ${error.message}`);
      
      this.rollbackActions.push({
        action: 'cleanup_migration_files',
        status: 'failed',
        error: error.message
      });
    }
  }

  async generateRollbackReport() {
    log.step('Generating rollback report...');
    
    const report = {
      rollback_date: new Date().toISOString(),
      rollback_version: '1.0.0',
      summary: {
        total_actions: this.rollbackActions.length,
        completed_actions: this.rollbackActions.filter(a => a.status === 'completed').length,
        failed_actions: this.rollbackActions.filter(a => a.status === 'failed').length,
        pending_actions: this.rollbackActions.filter(a => a.status === 'pending').length
      },
      actions: this.rollbackActions,
      next_steps: [
        'Test your application to ensure it works correctly',
        'Run database rollback script if needed',
        'Remove footer-migration directory when ready',
        'Update documentation to reflect rollback',
        'Monitor application for any issues'
      ],
      restoration_instructions: {
        database: 'Run: psql $DATABASE_URL -f footer-migration/rollback/rollback-footer-migration.sql',
        application: `Restore from backup: ${this.backupDir}/app_backup_before_rollback_${this.timestamp}.json`,
        files: 'Backed up files are available in the backups directory'
      }
    };
    
    const reportFile = path.join(this.backupDir, `footer_rollback_report_${this.timestamp}.json`);
    fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    
    log.success(`Rollback report generated: ${reportFile}`);
    
    // Display summary
    console.log('\n' + '='.repeat(60));
    console.log(`${colors.bright}FOOTER MIGRATION ROLLBACK SUMMARY${colors.reset}`);
    console.log('='.repeat(60));
    console.log(`Total Actions: ${report.summary.total_actions}`);
    console.log(`Completed: ${colors.green}${report.summary.completed_actions}${colors.reset}`);
    console.log(`Failed: ${colors.red}${report.summary.failed_actions}${colors.reset}`);
    console.log(`Pending: ${colors.yellow}${report.summary.pending_actions}${colors.reset}`);
    console.log('\nNext Steps:');
    report.next_steps.forEach((step, i) => {
      console.log(`${i + 1}. ${step}`);
    });
    console.log('='.repeat(60));
  }

  findHtmlFiles(dir, htmlFiles = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory() && !['node_modules', '.git', 'backups', 'logs'].includes(entry.name)) {
        this.findHtmlFiles(fullPath, htmlFiles);
      } else if (entry.isFile() && entry.name.endsWith('.html')) {
        htmlFiles.push(fullPath);
      }
    }
    
    return htmlFiles;
  }
}

// Run rollback
const rollback = new FooterMigrationRollback();
rollback.run();