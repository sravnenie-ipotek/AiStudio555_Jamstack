#!/usr/bin/env node

/**
 * Production Data Sync Script
 * Exports data from Railway production database and imports to local Docker PostgreSQL
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise(resolve => rl.question(query, resolve));

class ProductionDataSync {
  constructor() {
    this.prodDbUrl = process.env.PROD_DATABASE_URL;
    this.localDbUrl = process.env.DATABASE_URL;
    this.backupDir = path.join(__dirname, '..', 'backups');
    this.timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    this.backupFile = path.join(this.backupDir, `production_backup_${this.timestamp}.sql`);
  }

  async run() {
    try {
      console.log(`\n${colors.bright}🚀 AI Studio Production Data Sync Tool${colors.reset}\n`);
      
      // Check prerequisites
      await this.checkPrerequisites();
      
      // Confirm action
      const confirm = await this.confirmAction();
      if (!confirm) {
        log.warning('Operation cancelled by user');
        process.exit(0);
      }

      // Execute sync steps
      await this.createBackupDirectory();
      await this.exportProductionData();
      await this.startDockerContainers();
      await this.waitForDatabase();
      await this.importToLocalDatabase();
      await this.verifyImport();
      await this.displayAccessInfo();

      log.success(`\n${colors.bright}Production data successfully synced to local environment!${colors.reset}`);
      
    } catch (error) {
      log.error(`Failed: ${error.message}`);
      process.exit(1);
    } finally {
      rl.close();
    }
  }

  async checkPrerequisites() {
    log.step('Checking prerequisites...');
    
    // Check Docker
    try {
      execSync('docker --version', { stdio: 'ignore' });
      log.success('Docker is installed');
    } catch {
      throw new Error('Docker is not installed. Please install Docker Desktop first.');
    }

    // Check Docker Compose
    try {
      execSync('docker compose version', { stdio: 'ignore' });
      log.success('Docker Compose is installed');
    } catch {
      throw new Error('Docker Compose is not installed.');
    }

    // Check pg_dump
    try {
      execSync('pg_dump --version', { stdio: 'ignore' });
      log.success('PostgreSQL client tools installed');
    } catch {
      log.warning('pg_dump not found. Installing via brew...');
      try {
        execSync('brew install postgresql', { stdio: 'inherit' });
      } catch {
        throw new Error('Failed to install PostgreSQL tools. Please install manually: brew install postgresql');
      }
    }

    // Check production database URL
    if (!this.prodDbUrl) {
      throw new Error('Production database URL not found in .env.local');
    }
    log.success('Production database URL configured');
  }

  async confirmAction() {
    log.warning('\nThis will:');
    console.log('  1. Export all data from production Railway database');
    console.log('  2. Start local Docker PostgreSQL container');
    console.log('  3. Import all production data to local database');
    console.log('  4. Overwrite any existing local database data');
    
    const answer = await question(`\n${colors.yellow}Continue? (yes/no): ${colors.reset}`);
    return answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y';
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

  async exportProductionData() {
    log.step('Exporting production database...');
    log.info('This may take a few minutes depending on database size...');
    
    try {
      // Extract connection details from production URL
      const prodUrl = new URL(this.prodDbUrl);
      
      const pgDumpCmd = `PGPASSWORD="${prodUrl.password}" pg_dump \\
        -h ${prodUrl.hostname} \\
        -p ${prodUrl.port} \\
        -U ${prodUrl.username} \\
        -d ${prodUrl.pathname.slice(1)} \\
        --no-owner \\
        --no-privileges \\
        --no-acl \\
        --if-exists \\
        --clean \\
        --verbose \\
        -f "${this.backupFile}"`;
      
      execSync(pgDumpCmd, { 
        stdio: ['ignore', 'inherit', 'inherit'],
        shell: true 
      });
      
      const fileSize = (fs.statSync(this.backupFile).size / 1024 / 1024).toFixed(2);
      log.success(`Production data exported (${fileSize} MB): ${this.backupFile}`);
      
    } catch (error) {
      throw new Error(`Failed to export production data: ${error.message}`);
    }
  }

  async startDockerContainers() {
    log.step('Starting Docker containers...');
    
    try {
      // Stop existing containers if running
      log.info('Stopping existing containers...');
      execSync('docker compose down', { stdio: 'ignore' });
      
      // Start fresh containers
      log.info('Starting PostgreSQL and pgAdmin containers...');
      execSync('docker compose up -d', { stdio: 'inherit' });
      
      log.success('Docker containers started');
      
    } catch (error) {
      throw new Error(`Failed to start Docker containers: ${error.message}`);
    }
  }

  async waitForDatabase() {
    log.step('Waiting for database to be ready...');
    
    const maxAttempts = 30;
    let attempts = 0;
    
    while (attempts < maxAttempts) {
      try {
        execSync('docker exec aistudio_postgres_local pg_isready -U aistudio_user', { 
          stdio: 'ignore' 
        });
        log.success('Database is ready');
        return;
      } catch {
        attempts++;
        process.stdout.write('.');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    throw new Error('Database failed to start within 30 seconds');
  }

  async importToLocalDatabase() {
    log.step('Importing data to local database...');
    log.info('This may take a few minutes...');
    
    try {
      // Copy backup file to container
      execSync(`docker cp "${this.backupFile}" aistudio_postgres_local:/tmp/backup.sql`, {
        stdio: 'inherit'
      });
      
      // Import data
      execSync(`docker exec -i aistudio_postgres_local psql -U aistudio_user -d aistudio_db -f /tmp/backup.sql`, {
        stdio: ['ignore', 'ignore', 'inherit']
      });
      
      log.success('Data imported successfully');
      
      // Clean up temp file in container
      execSync('docker exec aistudio_postgres_local rm /tmp/backup.sql', {
        stdio: 'ignore'
      });
      
    } catch (error) {
      throw new Error(`Failed to import data: ${error.message}`);
    }
  }

  async verifyImport() {
    log.step('Verifying data import...');
    
    try {
      // Check table count
      const tableCountCmd = `docker exec aistudio_postgres_local psql -U aistudio_user -d aistudio_db -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';"`;
      const tableCount = execSync(tableCountCmd, { encoding: 'utf8' }).trim();
      
      // Check some key tables
      const tables = ['courses', 'teachers', 'pages', 'blogs'];
      for (const table of tables) {
        try {
          const countCmd = `docker exec aistudio_postgres_local psql -U aistudio_user -d aistudio_db -t -c "SELECT COUNT(*) FROM ${table};"`;
          const count = execSync(countCmd, { encoding: 'utf8' }).trim();
          log.success(`Table '${table}': ${count} records`);
        } catch {
          log.warning(`Table '${table}' not found`);
        }
      }
      
      log.success(`Verification complete: ${tableCount} tables found`);
      
    } catch (error) {
      log.warning(`Could not verify all data: ${error.message}`);
    }
  }

  async displayAccessInfo() {
    console.log(`\n${colors.bright}📋 Local Environment Access Information${colors.reset}\n`);
    
    console.log(`${colors.cyan}Database:${colors.reset}`);
    console.log(`  Host:     localhost`);
    console.log(`  Port:     5432`);
    console.log(`  Database: aistudio_db`);
    console.log(`  Username: aistudio_user`);
    console.log(`  Password: aistudio_dev_password_2024`);
    
    console.log(`\n${colors.cyan}pgAdmin:${colors.reset}`);
    console.log(`  URL:      http://localhost:5050`);
    console.log(`  Email:    admin@aistudio555.com`);
    console.log(`  Password: admin_password_2024`);
    
    console.log(`\n${colors.cyan}Application:${colors.reset}`);
    console.log(`  API:      http://localhost:3000`);
    console.log(`  Admin:    http://localhost:3000/content-admin-comprehensive.html`);
    console.log(`  Frontend: http://localhost:3005`);
    
    console.log(`\n${colors.cyan}Quick Start Commands:${colors.reset}`);
    console.log(`  Start servers:  ${colors.bright}npm run dev:local${colors.reset}`);
    console.log(`  View logs:      ${colors.bright}docker compose logs -f${colors.reset}`);
    console.log(`  Stop all:       ${colors.bright}docker compose down${colors.reset}`);
    console.log(`  Reset data:     ${colors.bright}npm run sync:production${colors.reset}`);
  }
}

// Run the sync
const sync = new ProductionDataSync();
sync.run();