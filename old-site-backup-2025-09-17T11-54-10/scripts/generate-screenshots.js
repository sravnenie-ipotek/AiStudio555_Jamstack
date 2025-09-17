#!/usr/bin/env node

/**
 * Screenshot Generation Script
 * Captures screenshots of HTML elements for visual content mapping
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const writeFile = promisify(fs.writeFile);

// Configuration
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3005';
const SCREENSHOT_DIR = path.join(__dirname, '../screenshots');
const SCREENSHOT_MAP_FILE = path.join(__dirname, '../screenshot-map.json');

// Ensure screenshot directory exists
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

class ScreenshotGenerator {
  constructor() {
    this.browser = null;
    this.page = null;
    this.screenshotMap = this.loadScreenshotMap();
  }

  loadScreenshotMap() {
    if (fs.existsSync(SCREENSHOT_MAP_FILE)) {
      return JSON.parse(fs.readFileSync(SCREENSHOT_MAP_FILE, 'utf8'));
    }
    return {};
  }

  saveScreenshotMap() {
    fs.writeFileSync(SCREENSHOT_MAP_FILE, JSON.stringify(this.screenshotMap, null, 2));
  }

  async initialize() {
    console.log('🚀 Launching browser...');
    this.browser = await puppeteer.launch({
      headless: 'new',
      defaultViewport: {
        width: 1920,
        height: 1080
      },
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    this.page = await this.browser.newPage();
    
    // Set up console logging from the page
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error('Browser console error:', msg.text());
      }
    });
    
    // Handle page errors
    this.page.on('pageerror', error => {
      console.error('Page error:', error.message);
    });
  }

  async capturePageScreenshots(pageName, pageUrl) {
    console.log(`\n📄 Processing ${pageName}...`);
    console.log(`   URL: ${pageUrl}`);
    
    try {
      // Navigate to the page
      await this.page.goto(pageUrl, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });
      
      // Wait for content to load
      await this.page.waitForTimeout(2000);
      
      // Get all sections to capture
      const sections = await this.page.evaluate(() => {
        const sectionElements = document.querySelectorAll('section');
        const sections = [];
        
        sectionElements.forEach((section, index) => {
          const id = section.id || `section-${index}`;
          const classes = section.className;
          const rect = section.getBoundingClientRect();
          
          if (rect.height > 0) {
            sections.push({
              selector: section.id ? `#${section.id}` : `.${classes.split(' ').join('.')}`,
              id: id,
              classes: classes,
              dimensions: {
                width: rect.width,
                height: rect.height
              }
            });
          }
        });
        
        return sections;
      });
      
      console.log(`   Found ${sections.length} sections to capture`);
      
      // Capture screenshots for each section
      const screenshots = [];
      for (const section of sections) {
        try {
          const filename = `${pageName}-${section.id}.png`;
          const filepath = path.join(SCREENSHOT_DIR, filename);
          
          // Find the element
          const element = await this.page.$(section.selector);
          if (!element) {
            console.warn(`   ⚠️  Could not find element: ${section.selector}`);
            continue;
          }
          
          // Scroll to element to ensure it's in view
          await this.page.evaluate(selector => {
            const el = document.querySelector(selector);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, section.selector);
          
          await this.page.waitForTimeout(500);
          
          // Capture screenshot
          await element.screenshot({
            path: filepath,
            type: 'png'
          });
          
          // Store metadata
          const screenshotInfo = {
            filename,
            filepath,
            selector: section.selector,
            sectionId: section.id,
            dimensions: section.dimensions,
            capturedAt: new Date().toISOString()
          };
          
          screenshots.push(screenshotInfo);
          console.log(`   ✓ Captured: ${section.id}`);
          
        } catch (error) {
          console.error(`   ✗ Failed to capture ${section.id}:`, error.message);
        }
      }
      
      // Also capture full page screenshot
      const fullPageFilename = `${pageName}-full.png`;
      const fullPagePath = path.join(SCREENSHOT_DIR, fullPageFilename);
      await this.page.screenshot({
        path: fullPagePath,
        fullPage: true
      });
      
      screenshots.push({
        filename: fullPageFilename,
        filepath: fullPagePath,
        selector: 'body',
        sectionId: 'full-page',
        capturedAt: new Date().toISOString()
      });
      
      console.log(`   ✓ Captured full page screenshot`);
      
      // Update screenshot map
      this.screenshotMap[pageName] = {
        url: pageUrl,
        screenshots,
        lastUpdated: new Date().toISOString()
      };
      
      return screenshots;
      
    } catch (error) {
      console.error(`   ✗ Error processing ${pageName}:`, error.message);
      throw error;
    }
  }

  async captureAllPages() {
    const pages = [
      { name: 'home', url: `${FRONTEND_URL}/home.html` },
      { name: 'courses', url: `${FRONTEND_URL}/courses.html` },
      { name: 'about', url: `${FRONTEND_URL}/about.html` },
      { name: 'contact', url: `${FRONTEND_URL}/contact.html` },
      { name: 'detail-courses', url: `${FRONTEND_URL}/detail_courses.html` }
    ];
    
    console.log('📸 Starting screenshot generation...');
    console.log(`📁 Output directory: ${SCREENSHOT_DIR}`);
    
    for (const page of pages) {
      try {
        await this.capturePageScreenshots(page.name, page.url);
      } catch (error) {
        console.error(`Failed to process ${page.name}:`, error);
      }
    }
    
    // Save the screenshot map
    this.saveScreenshotMap();
    console.log(`\n📝 Screenshot map saved to: ${SCREENSHOT_MAP_FILE}`);
  }

  async captureSpecificElement(pageName, selector) {
    const pageUrl = this.getPageUrl(pageName);
    
    console.log(`📸 Capturing specific element...`);
    console.log(`   Page: ${pageName}`);
    console.log(`   Selector: ${selector}`);
    
    try {
      await this.page.goto(pageUrl, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });
      
      await this.page.waitForTimeout(2000);
      
      // Wait for the specific element
      await this.page.waitForSelector(selector, { timeout: 5000 });
      
      const element = await this.page.$(selector);
      if (!element) {
        throw new Error(`Element not found: ${selector}`);
      }
      
      // Generate filename
      const timestamp = Date.now();
      const filename = `${pageName}-custom-${timestamp}.png`;
      const filepath = path.join(SCREENSHOT_DIR, filename);
      
      // Capture screenshot
      await element.screenshot({
        path: filepath,
        type: 'png'
      });
      
      console.log(`   ✓ Screenshot saved: ${filepath}`);
      
      return {
        filename,
        filepath,
        selector,
        pageName,
        capturedAt: new Date().toISOString()
      };
      
    } catch (error) {
      console.error(`   ✗ Error capturing element:`, error.message);
      throw error;
    }
  }

  getPageUrl(pageName) {
    const pageMap = {
      'home': 'home.html',
      'courses': 'courses.html',
      'about': 'about.html',
      'contact': 'contact.html',
      'detail-courses': 'detail_courses.html'
    };
    
    const pagePath = pageMap[pageName] || `${pageName}.html`;
    return `${FRONTEND_URL}/${pagePath}`;
  }

  async cleanup() {
    if (this.browser) {
      console.log('🧹 Closing browser...');
      await this.browser.close();
    }
  }

  async generateVisualMap() {
    // Generate an HTML file that displays all screenshots with their selectors
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Visual Content Map</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f5f5;
      padding: 20px;
    }
    .container { max-width: 1400px; margin: 0 auto; }
    h1 {
      color: #333;
      margin-bottom: 30px;
      padding-bottom: 10px;
      border-bottom: 2px solid #007bff;
    }
    .page-section {
      background: white;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .page-title {
      color: #007bff;
      margin-bottom: 20px;
      font-size: 24px;
    }
    .screenshots-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    .screenshot-card {
      border: 1px solid #ddd;
      border-radius: 4px;
      overflow: hidden;
      transition: transform 0.2s;
    }
    .screenshot-card:hover { transform: translateY(-2px); }
    .screenshot-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
      background: #f0f0f0;
    }
    .screenshot-info {
      padding: 10px;
      background: #fafafa;
    }
    .screenshot-selector {
      font-family: 'Courier New', monospace;
      font-size: 12px;
      color: #666;
      word-break: break-all;
    }
    .screenshot-id {
      font-weight: bold;
      color: #333;
      margin-bottom: 5px;
    }
    .last-updated {
      text-align: center;
      color: #666;
      margin-top: 30px;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📸 Visual Content Map</h1>
    ${Object.entries(this.screenshotMap).map(([pageName, pageData]) => `
      <div class="page-section">
        <h2 class="page-title">📄 ${pageName}</h2>
        <div class="screenshots-grid">
          ${pageData.screenshots.map(screenshot => `
            <div class="screenshot-card">
              <img src="../screenshots/${screenshot.filename}" 
                   alt="${screenshot.sectionId}" 
                   class="screenshot-image"
                   onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 300 200\"%3E%3Crect fill=\"%23f0f0f0\" width=\"300\" height=\"200\"/%3E%3Ctext x=\"50%25\" y=\"50%25\" text-anchor=\"middle\" dy=\".3em\" fill=\"%23999\" font-family=\"sans-serif\" font-size=\"14\"%3ENo Preview%3C/text%3E%3C/svg%3E'">
              <div class="screenshot-info">
                <div class="screenshot-id">${screenshot.sectionId}</div>
                <div class="screenshot-selector">${screenshot.selector}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('')}
    <div class="last-updated">
      Last updated: ${new Date().toLocaleString()}
    </div>
  </div>
</body>
</html>
    `;
    
    const visualMapPath = path.join(SCREENSHOT_DIR, 'visual-map.html');
    await writeFile(visualMapPath, htmlContent);
    console.log(`\n🗺️  Visual map generated: ${visualMapPath}`);
  }
}

// Main execution
async function main() {
  const generator = new ScreenshotGenerator();
  
  // Parse command line arguments
  const args = process.argv.slice(2);
  const pageArg = args.find(arg => arg.startsWith('--page='));
  const selectorArg = args.find(arg => arg.startsWith('--selector='));
  
  try {
    await generator.initialize();
    
    if (pageArg && selectorArg) {
      // Capture specific element
      const pageName = pageArg.split('=')[1];
      const selector = selectorArg.split('=')[1];
      await generator.captureSpecificElement(pageName, selector);
    } else {
      // Capture all pages
      await generator.captureAllPages();
      await generator.generateVisualMap();
    }
    
    console.log('\n✅ Screenshot generation complete!');
    
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  } finally {
    await generator.cleanup();
  }
}

// Export for use in other scripts
module.exports = ScreenshotGenerator;

// Run if executed directly
if (require.main === module) {
  main();
}