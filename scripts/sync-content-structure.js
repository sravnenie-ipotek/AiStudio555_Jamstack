#!/usr/bin/env node

/**
 * Content Structure Sync Script
 * Syncs HTML structure to Strapi CMS
 */

const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Import content map configuration
const contentMap = require('../content-map.config');

// Strapi configuration
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:3000';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || '6ba76f584778637fd308f48aac27461c1aca7f088c963d614ad2e73bb7f3f9a646ad9e38cf12e5bd8f7e6f8e0ad2f014ea90ee088bb8a3c3c84a40f9fb0c592e5c8b05e8d25c09f4a9c0b685b2c90bacd5e604fbe4e1b01e0a6e32c76e7e93b1f21e5e47dcad5e80a6b0cf967e2a38b74f5edd19e92f5c0e6d387e1c16e5ce59';

class ContentStructureSync {
  constructor() {
    this.screenshotDir = path.join(__dirname, '../screenshots');
    this.strapiConfigDir = path.join(__dirname, '../strapi-fresh/config/sync');
    
    // Create directories if they don't exist
    this.ensureDirectoryExists(this.screenshotDir);
    this.ensureDirectoryExists(this.strapiConfigDir);
  }

  ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  async syncAll() {
    console.log('🔄 Starting content structure sync...');
    console.log(`📍 Strapi URL: ${STRAPI_URL}`);
    
    for (const [pageName, pageConfig] of Object.entries(contentMap.pages)) {
      console.log(`\n📄 Processing ${pageName} page...`);
      
      try {
        // 1. Analyze HTML structure
        const structure = await this.analyzeHTML(pageConfig.path);
        console.log(`  ✓ Analyzed HTML structure`);
        
        // 2. Extract current content from HTML
        const content = await this.extractContent(pageConfig.path, pageConfig.sections);
        console.log(`  ✓ Extracted content from HTML`);
        
        // 3. Save structure configuration
        await this.saveStructureConfig(pageName, structure);
        console.log(`  ✓ Saved structure configuration`);
        
        // 4. Initialize Strapi content if needed
        await this.initializeStrapiContent(pageName, pageConfig, content);
        console.log(`  ✓ Initialized Strapi content`);
        
      } catch (error) {
        console.error(`  ✗ Error processing ${pageName}:`, error.message);
      }
    }
    
    console.log('\n✨ Sync complete!');
  }

  async analyzeHTML(filePath) {
    const html = fs.readFileSync(filePath, 'utf8');
    const $ = cheerio.load(html);
    const structure = { 
      sections: [],
      timestamp: new Date().toISOString(),
      htmlSize: html.length
    };
    
    // Find all major sections
    $('section').each((index, section) => {
      const $section = $(section);
      const classes = $section.attr('class') || '';
      const id = $section.attr('id') || `section-${index}`;
      
      const sectionData = {
        index,
        id,
        classes: classes.split(' ').filter(Boolean),
        hasContent: $section.text().trim().length > 0,
        childElements: {
          headings: $section.find('h1, h2, h3, h4').length,
          paragraphs: $section.find('p').length,
          buttons: $section.find('a.primary-button, button').length,
          images: $section.find('img').length,
          forms: $section.find('form').length
        }
      };
      
      structure.sections.push(sectionData);
    });
    
    return structure;
  }

  async extractContent(filePath, sections) {
    const html = fs.readFileSync(filePath, 'utf8');
    const $ = cheerio.load(html);
    const content = {};
    
    if (!sections) return content;
    
    for (const section of sections) {
      content[section.id] = {};
      const $section = $(section.selector);
      
      if ($section.length === 0) {
        console.warn(`  ⚠️  Section not found: ${section.selector}`);
        continue;
      }
      
      for (const field of section.fields || []) {
        try {
          if (field.type === 'relation') {
            // Skip relation fields as they'll be handled separately
            continue;
          } else if (field.type === 'array') {
            // Handle array fields
            const items = [];
            $section.find(field.selector).each((i, el) => {
              const item = {};
              for (const [key, subSelector] of Object.entries(field.fields || {})) {
                if (subSelector.startsWith('@')) {
                  item[key] = $(el).attr(subSelector.slice(1));
                } else {
                  item[key] = $(el).find(subSelector).text().trim();
                }
              }
              items.push(item);
            });
            content[section.id][field.name] = items;
          } else if (field.type === 'object') {
            // Handle object fields
            const obj = {};
            for (const [key, subField] of Object.entries(field.fields || {})) {
              if (subField.selector.startsWith('@')) {
                obj[key] = $section.find(field.selector).attr(subField.selector.slice(1));
              } else {
                obj[key] = $section.find(subField.selector).text().trim();
              }
            }
            content[section.id][field.name] = obj;
          } else {
            // Handle simple text fields
            const $field = $section.find(field.selector);
            if ($field.length > 0) {
              content[section.id][field.name] = $field.first().text().trim();
            } else if (field.defaultValue) {
              content[section.id][field.name] = field.defaultValue;
            }
          }
        } catch (error) {
          console.warn(`  ⚠️  Error extracting field ${field.name}:`, error.message);
        }
      }
    }
    
    return content;
  }

  async saveStructureConfig(pageName, structure) {
    const configPath = path.join(this.strapiConfigDir, `${pageName}-structure.json`);
    const config = {
      page: pageName,
      lastSync: new Date().toISOString(),
      htmlVersion: this.getGitCommitHash(),
      structure: structure
    };
    
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  }

  async initializeStrapiContent(pageName, pageConfig, content) {
    try {
      // Check if content already exists
      const existingContent = await this.getStrapiContent(pageConfig.strapiType);
      
      if (!existingContent) {
        // Create initial content
        console.log(`  📝 Creating initial content for ${pageName}`);
        await this.createStrapiContent(pageConfig.strapiType, content);
      } else {
        console.log(`  ✓ Content already exists for ${pageName}`);
      }
    } catch (error) {
      console.warn(`  ⚠️  Could not connect to Strapi:`, error.message);
      console.log(`  💡 Make sure Strapi is running at ${STRAPI_URL}`);
    }
  }

  async getStrapiContent(contentType) {
    try {
      const endpoint = contentType.replace('api::', '').replace('.', '/');
      const response = await axios.get(
        `${STRAPI_URL}/api/${endpoint}`,
        {
          headers: {
            'Authorization': `Bearer ${STRAPI_API_TOKEN}`
          }
        }
      );
      return response.data.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async createStrapiContent(contentType, content) {
    try {
      const endpoint = contentType.replace('api::', '').replace('.', '/');
      const response = await axios.post(
        `${STRAPI_URL}/api/${endpoint}`,
        {
          data: this.transformContentForStrapi(content)
        },
        {
          headers: {
            'Authorization': `Bearer ${STRAPI_API_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating Strapi content:', error.response?.data || error.message);
      throw error;
    }
  }

  transformContentForStrapi(content) {
    // Transform the extracted content to match Strapi's expected format
    const transformed = {};
    
    for (const [sectionId, sectionContent] of Object.entries(content)) {
      // Convert section IDs to match Strapi component names
      const strapiFieldName = this.sectionIdToFieldName(sectionId);
      transformed[strapiFieldName] = sectionContent;
    }
    
    return transformed;
  }

  sectionIdToFieldName(sectionId) {
    // Convert kebab-case to camelCase
    return sectionId.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  }

  getGitCommitHash() {
    try {
      const { execSync } = require('child_process');
      return execSync('git rev-parse HEAD').toString().trim();
    } catch (error) {
      return 'unknown';
    }
  }
}

// Export for use in other scripts
module.exports = ContentStructureSync;

// Run if executed directly
if (require.main === module) {
  const sync = new ContentStructureSync();
  sync.syncAll().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}