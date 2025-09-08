#!/usr/bin/env node
'use strict';

/**
 * Frontend-Strapi Sync Script
 * Automatically detects HTML changes and updates Strapi sections
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

const STRAPI_BASE_URL = 'http://localhost:1337';
const FRONTEND_PATH = '../frontend'; // Adjust to your frontend path

/**
 * Extract section info from HTML/JSX files
 */
function extractSectionsFromFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const sections = [];
  
  // Regex to find data-strapi-section attributes
  const sectionRegex = /data-strapi-section="([^"]+)"[^>]*data-strapi-page="([^"]+)"[^>]*data-strapi-name="([^"]+)"[^>]*data-strapi-order="([^"]+)"/g;
  
  let match;
  while ((match = sectionRegex.exec(content)) !== null) {
    sections.push({
      sectionId: match[1],
      pageName: match[2],
      sectionName: match[3],
      order: parseInt(match[4]),
      sourceFile: filePath
    });
  }
  
  return sections;
}

/**
 * Sync sections to Strapi
 */
async function syncSectionToStrapi(section) {
  try {
    // Check if section exists
    const existingResponse = await axios.get(
      `${STRAPI_BASE_URL}/api/page-sections?filters[sectionId][$eq]=${section.sectionId}`
    );
    
    if (existingResponse.data.data.length === 0) {
      // Create new section
      console.log(`🆕 Creating new section: ${section.sectionName}`);
      
      await axios.post(`${STRAPI_BASE_URL}/api/page-sections`, {
        data: {
          ...section,
          heading: `New ${section.sectionName}`,
          content: 'Content needed - please update',
          isVisible: true,
          metadata: {
            autoCreated: true,
            createdAt: new Date().toISOString(),
            sourceFile: section.sourceFile
          }
        }
      });
      
      console.log(`✅ Created section: ${section.sectionName}`);
    } else {
      // Update existing section metadata
      const existing = existingResponse.data.data[0];
      
      await axios.put(`${STRAPI_BASE_URL}/api/page-sections/${existing.id}`, {
        data: {
          order: section.order,
          metadata: {
            ...existing.attributes.metadata,
            lastSync: new Date().toISOString(),
            sourceFile: section.sourceFile
          }
        }
      });
      
      console.log(`🔄 Updated section: ${section.sectionName}`);
    }
  } catch (error) {
    console.error(`❌ Error syncing section ${section.sectionName}:`, error.message);
  }
}

/**
 * Main sync function
 */
async function syncFrontendToStrapi() {
  console.log('🔄 Starting frontend-to-Strapi sync...');
  
  if (!fs.existsSync(FRONTEND_PATH)) {
    console.error(`❌ Frontend path not found: ${FRONTEND_PATH}`);
    return;
  }
  
  // Scan all component files
  const componentFiles = [];
  
  function scanDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        scanDirectory(filePath);
      } else if (file.match(/\.(jsx?|tsx?|vue)$/)) {
        componentFiles.push(filePath);
      }
    }
  }
  
  try {
    scanDirectory(FRONTEND_PATH);
    
    // Extract sections from all files
    const allSections = [];
    for (const file of componentFiles) {
      const sections = extractSectionsFromFile(file);
      allSections.push(...sections);
    }
    
    console.log(`📊 Found ${allSections.length} sections in ${componentFiles.length} files`);
    
    // Sync each section
    for (const section of allSections) {
      await syncSectionToStrapi(section);
    }
    
    console.log('✅ Sync completed successfully!');
    
  } catch (error) {
    console.error('❌ Sync failed:', error.message);
  }
}

// Run if called directly
if (require.main === module) {
  syncFrontendToStrapi();
}

module.exports = { syncFrontendToStrapi };