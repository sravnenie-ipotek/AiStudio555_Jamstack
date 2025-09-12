#!/usr/bin/env node

/**
 * FOOTER API INTEGRATION SCRIPT
 * 
 * This script automatically integrates footer API endpoints into existing server files.
 * It modifies server.js and server.local.js to include footer API functionality.
 */

const fs = require('fs');
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

class FooterAPIIntegrator {
  constructor() {
    this.projectRoot = process.cwd();
    this.footerApiPath = './footer-migration/api/footer-api-endpoints';
  }

  async run() {
    try {
      console.log(`\n${colors.bright}🔌 Footer API Integration Tool${colors.reset}\n`);
      
      // Check if footer API file exists
      await this.verifyFooterAPI();
      
      // Integrate into server files
      await this.integrateIntoServer('server.js');
      await this.integrateIntoServer('server.local.js');
      
      // Update package.json scripts
      await this.updatePackageJson();
      
      log.success(`\n${colors.bright}Footer API integration completed successfully!${colors.reset}`);
      console.log('\nNext steps:');
      console.log('1. Test the footer API endpoints');
      console.log('2. Deploy footer loader to frontend');
      console.log('3. Add admin panel integration');
      console.log('4. Run the migration scripts');
      
    } catch (error) {
      log.error(`Integration failed: ${error.message}`);
      process.exit(1);
    }
  }

  async verifyFooterAPI() {
    log.step('Verifying footer API file...');
    
    const apiFilePath = path.join(this.projectRoot, this.footerApiPath + '.js');
    
    if (!fs.existsSync(apiFilePath)) {
      throw new Error(`Footer API file not found: ${apiFilePath}`);
    }
    
    log.success('Footer API file found');
  }

  async integrateIntoServer(serverFileName) {
    log.step(`Integrating footer API into ${serverFileName}...`);
    
    const serverPath = path.join(this.projectRoot, serverFileName);
    
    if (!fs.existsSync(serverPath)) {
      log.warning(`Server file not found: ${serverFileName}, skipping...`);
      return;
    }
    
    let serverContent = fs.readFileSync(serverPath, 'utf8');
    
    // Check if footer API is already integrated
    if (serverContent.includes('footer-api-endpoints') || serverContent.includes('initFooterAPI')) {
      log.info(`Footer API already integrated in ${serverFileName}`);
      return;
    }
    
    // Create backup
    const backupPath = serverPath + '.backup.' + new Date().toISOString().replace(/[:.]/g, '-');
    fs.writeFileSync(backupPath, serverContent);
    log.info(`Created backup: ${path.basename(backupPath)}`);
    
    // Find integration points
    const integrationPoints = this.findIntegrationPoints(serverContent);
    
    if (!integrationPoints.requireSection && !integrationPoints.initSection) {
      throw new Error(`Could not find suitable integration points in ${serverFileName}`);
    }
    
    // Add footer API require statement
    if (integrationPoints.requireSection) {
      const requireStatement = `\n// Footer API endpoints\nconst initFooterAPI = require('${this.footerApiPath}');\n`;
      serverContent = this.insertAtPosition(serverContent, integrationPoints.requireSection, requireStatement);
      log.success('Added footer API require statement');
    }
    
    // Add footer API initialization
    if (integrationPoints.initSection) {
      const initStatement = `\n// Initialize footer API endpoints\ninitFooterAPI(app, pool);\n`;
      serverContent = this.insertAtPosition(serverContent, integrationPoints.initSection, initStatement);
      log.success('Added footer API initialization');
    }
    
    // Write updated server file
    fs.writeFileSync(serverPath, serverContent);
    log.success(`Updated ${serverFileName}`);
  }

  findIntegrationPoints(serverContent) {
    const lines = serverContent.split('\n');
    let requireSection = -1;
    let initSection = -1;
    
    // Look for require statements section
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Find last require statement
      if (line.startsWith('const ') && line.includes('require(') && requireSection < i) {
        requireSection = i;
      }
      
      // Find app initialization section (after route definitions)
      if ((line.includes('app.listen') || line.includes('server.listen')) && initSection === -1) {
        // Look backward for a good insertion point
        for (let j = i - 1; j >= 0; j--) {
          if (lines[j].trim() === '' || lines[j].includes('// ') || lines[j].includes('app.use')) {
            initSection = j;
            break;
          }
        }
      }
    }
    
    // Alternative: find middleware section
    if (initSection === -1) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.includes('app.use(express.json') || line.includes('app.use(cors')) {
          initSection = i + 1;
          break;
        }
      }
    }
    
    // Alternative: find after pool creation
    if (initSection === -1) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.includes('new Pool') || line.includes('pool =')) {
          // Find next empty line or comment
          for (let j = i + 1; j < lines.length; j++) {
            if (lines[j].trim() === '' || lines[j].includes('//')) {
              initSection = j;
              break;
            }
          }
          break;
        }
      }
    }
    
    return { requireSection, initSection };
  }

  insertAtPosition(content, lineIndex, insertion) {
    const lines = content.split('\n');
    lines.splice(lineIndex + 1, 0, insertion.trim());
    return lines.join('\n');
  }

  async updatePackageJson() {
    log.step('Updating package.json scripts...');
    
    const packagePath = path.join(this.projectRoot, 'package.json');
    
    if (!fs.existsSync(packagePath)) {
      log.warning('package.json not found, skipping...');
      return;
    }
    
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    // Add footer-related scripts
    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }
    
    const footerScripts = {
      'footer:migrate': 'node footer-migration/scripts/migrate-existing-footer-data.js',
      'footer:rollback': 'node footer-migration/rollback/rollback-footer-scripts.js',
      'footer:test-api': 'curl http://localhost:3000/api/footer-health && curl http://localhost:3000/api/footer-content',
      'footer:install': 'psql $DATABASE_URL -f footer-migration/sql/01-create-footer-tables.sql && psql $DATABASE_URL -f footer-migration/sql/02-insert-default-data.sql'
    };
    
    let added = 0;
    for (const [script, command] of Object.entries(footerScripts)) {
      if (!packageJson.scripts[script]) {
        packageJson.scripts[script] = command;
        added++;
      }
    }
    
    if (added > 0) {
      fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
      log.success(`Added ${added} footer-related scripts to package.json`);
    } else {
      log.info('Footer scripts already present in package.json');
    }
  }
}

// Check command line arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Footer API Integration Script

Usage: node integrate-footer-api.js

This script will:
1. Verify footer API file exists
2. Integrate footer API into server.js and server.local.js
3. Add footer-related npm scripts
4. Create backups of modified files

Options:
  --help, -h    Show this help message

Example:
  node footer-migration/scripts/integrate-footer-api.js
  `);
  process.exit(0);
}

// Run integration
const integrator = new FooterAPIIntegrator();
integrator.run();