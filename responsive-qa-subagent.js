#!/usr/bin/env node

/**
 * 🎨 RESPONSIVE QA SUBAGENT - World-Class Responsive Design Tester
 * 
 * This subagent is a perfectionist QA engineer and designer who:
 * - Tests across ALL device sizes and orientations
 * - Checks for visual breakages, overflow, and layout issues
 * - Validates touch targets, readability, and accessibility
 * - Performs stress tests with dynamic content
 * - Generates comprehensive responsive reports
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Comprehensive device configurations
const DEVICES = {
  // Mobile Devices
  'iPhone SE': { width: 375, height: 667, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  'iPhone 12 Pro': { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
  'iPhone 14 Pro Max': { width: 430, height: 932, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
  'Samsung Galaxy S21': { width: 384, height: 854, deviceScaleFactor: 2.5, isMobile: true, hasTouch: true },
  'Pixel 5': { width: 393, height: 851, deviceScaleFactor: 2.75, isMobile: true, hasTouch: true },
  
  // Tablets
  'iPad Mini': { width: 768, height: 1024, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  'iPad Air': { width: 820, height: 1180, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  'iPad Pro 11"': { width: 834, height: 1194, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  'iPad Pro 12.9"': { width: 1024, height: 1366, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  'Surface Pro 7': { width: 912, height: 1368, deviceScaleFactor: 2, isMobile: false, hasTouch: true },
  
  // Laptops
  'MacBook Air': { width: 1280, height: 800, deviceScaleFactor: 2, isMobile: false, hasTouch: false },
  'MacBook Pro 14"': { width: 1512, height: 982, deviceScaleFactor: 2, isMobile: false, hasTouch: false },
  'MacBook Pro 16"': { width: 1728, height: 1117, deviceScaleFactor: 2, isMobile: false, hasTouch: false },
  'Dell XPS 13': { width: 1920, height: 1080, deviceScaleFactor: 1.5, isMobile: false, hasTouch: false },
  
  // Desktop
  'Desktop HD': { width: 1920, height: 1080, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
  'Desktop QHD': { width: 2560, height: 1440, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
  'Desktop 4K': { width: 3840, height: 2160, deviceScaleFactor: 1.5, isMobile: false, hasTouch: false },
  
  // Edge Cases
  'Galaxy Fold (closed)': { width: 280, height: 653, deviceScaleFactor: 2.5, isMobile: true, hasTouch: true },
  'Galaxy Fold (open)': { width: 717, height: 512, deviceScaleFactor: 2.5, isMobile: true, hasTouch: true },
  'Ultra-wide Monitor': { width: 3440, height: 1440, deviceScaleFactor: 1, isMobile: false, hasTouch: false }
};

// Critical breakpoints to test
const BREAKPOINTS = [320, 375, 414, 480, 640, 768, 1024, 1280, 1440, 1920, 2560, 3840];

// Test scenarios
const TEST_SCENARIOS = {
  navigation: {
    name: 'Navigation & Menu',
    tests: [
      'Mobile hamburger menu functionality',
      'Desktop navigation visibility',
      'Dropdown menu overflow',
      'Active state indicators',
      'Touch target sizes (min 44x44px)',
      'Keyboard navigation support'
    ]
  },
  content: {
    name: 'Content Layout',
    tests: [
      'Text readability (font size min 16px mobile)',
      'Image scaling and aspect ratios',
      'Content overflow and wrapping',
      'Column layouts at breakpoints',
      'Card grid responsiveness',
      'Form field sizing'
    ]
  },
  interactive: {
    name: 'Interactive Elements',
    tests: [
      'Button tap targets',
      'Modal/popup responsive behavior',
      'Slider/carousel touch support',
      'Video player responsiveness',
      'Table scrolling on mobile',
      'Tab component behavior'
    ]
  },
  performance: {
    name: 'Performance',
    tests: [
      'Image loading optimization',
      'Font loading (FOIT/FOUT)',
      'JavaScript execution on low-end devices',
      'CSS animation performance',
      'Scroll performance',
      'Touch response latency'
    ]
  },
  accessibility: {
    name: 'Accessibility',
    tests: [
      'Focus indicators visibility',
      'Color contrast ratios',
      'Zoom support (up to 200%)',
      'Screen reader landmarks',
      'ARIA labels on interactive elements',
      'Keyboard-only navigation'
    ]
  }
};

class ResponsiveQASubagent {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.browser = null;
    this.results = {
      timestamp: new Date().toISOString(),
      url: baseUrl,
      totalTests: 0,
      passed: 0,
      failed: 0,
      warnings: 0,
      critical: [],
      issues: [],
      deviceResults: {},
      breakpointResults: {},
      screenshots: []
    };
  }

  log(message, type = 'info') {
    const prefix = {
      info: `${colors.cyan}ℹ️`,
      success: `${colors.green}✅`,
      warning: `${colors.yellow}⚠️`,
      error: `${colors.red}❌`,
      test: `${colors.magenta}🧪`,
      critical: `${colors.bright}${colors.red}🚨`
    };
    
    console.log(`${prefix[type] || prefix.info} ${message}${colors.reset}`);
  }

  async initialize() {
    this.log('🚀 Initializing Responsive QA Subagent...', 'info');
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    // Create screenshots directory
    await fs.mkdir('responsive-qa-screenshots', { recursive: true });
  }

  async testDevice(deviceName, viewport) {
    this.log(`Testing ${deviceName} (${viewport.width}x${viewport.height})`, 'test');
    
    const page = await this.browser.newPage();
    await page.setViewport(viewport);
    
    const deviceResults = {
      device: deviceName,
      viewport: `${viewport.width}x${viewport.height}`,
      issues: [],
      score: 100
    };

    try {
      await page.goto(this.baseUrl, { waitUntil: 'networkidle2' });
      
      // Take screenshot
      const screenshotPath = `responsive-qa-screenshots/${deviceName.replace(/[^a-z0-9]/gi, '_')}.png`;
      await page.screenshot({ path: screenshotPath, fullPage: true });
      this.results.screenshots.push(screenshotPath);
      
      // Run comprehensive tests
      const tests = [
        this.checkOverflow(page),
        this.checkTextReadability(page, viewport),
        this.checkTouchTargets(page, viewport),
        this.checkImages(page),
        this.checkNavigation(page, viewport),
        this.checkForms(page, viewport),
        this.checkModals(page),
        this.checkTables(page, viewport),
        this.checkZIndex(page),
        this.checkViewportMeta(page),
        this.checkHorizontalScroll(page),
        this.checkFontSizes(page, viewport),
        this.checkColorContrast(page),
        this.checkFlexboxIssues(page),
        this.checkGridIssues(page)
      ];

      const testResults = await Promise.all(tests);
      
      testResults.forEach(result => {
        if (result.issues.length > 0) {
          deviceResults.issues.push(...result.issues);
          deviceResults.score -= result.severity * result.issues.length;
        }
      });

      // Performance check
      const metrics = await page.metrics();
      if (metrics.TaskDuration > 1000) {
        deviceResults.issues.push({
          type: 'performance',
          severity: 'warning',
          message: `High task duration: ${metrics.TaskDuration}ms`
        });
      }

    } catch (error) {
      deviceResults.issues.push({
        type: 'critical',
        severity: 'error',
        message: `Failed to test: ${error.message}`
      });
      deviceResults.score = 0;
    } finally {
      await page.close();
    }

    this.results.deviceResults[deviceName] = deviceResults;
    return deviceResults;
  }

  async checkOverflow(page) {
    const overflowElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      const issues = [];
      const viewportWidth = window.innerWidth;
      
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.right > viewportWidth) {
          issues.push({
            element: el.tagName,
            class: el.className,
            overflow: rect.right - viewportWidth
          });
        }
      });
      
      return issues;
    });

    return {
      name: 'Overflow Check',
      issues: overflowElements.map(el => ({
        type: 'overflow',
        severity: 'high',
        message: `${el.element} overflows by ${el.overflow}px`
      })),
      severity: 5
    };
  }

  async checkTextReadability(page, viewport) {
    const readabilityIssues = await page.evaluate((isMobile) => {
      const issues = [];
      const minFontSize = isMobile ? 14 : 12;
      const texts = document.querySelectorAll('p, span, div, a, button, li');
      
      texts.forEach(el => {
        const styles = window.getComputedStyle(el);
        const fontSize = parseFloat(styles.fontSize);
        
        if (fontSize < minFontSize && el.textContent.trim().length > 0) {
          issues.push({
            element: el.tagName,
            fontSize: fontSize,
            text: el.textContent.substring(0, 50)
          });
        }
      });
      
      return issues;
    }, viewport.isMobile);

    return {
      name: 'Text Readability',
      issues: readabilityIssues.map(issue => ({
        type: 'readability',
        severity: 'medium',
        message: `Font too small (${issue.fontSize}px): "${issue.text}..."`
      })),
      severity: 3
    };
  }

  async checkTouchTargets(page, viewport) {
    if (!viewport.hasTouch) return { name: 'Touch Targets', issues: [], severity: 0 };

    const touchIssues = await page.evaluate(() => {
      const minSize = 44; // Apple's HIG recommendation
      const issues = [];
      const clickables = document.querySelectorAll('a, button, input, select, textarea, [onclick]');
      
      clickables.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.width < minSize || rect.height < minSize) {
          issues.push({
            element: el.tagName,
            size: `${rect.width}x${rect.height}`,
            text: el.textContent || el.value || 'No text'
          });
        }
      });
      
      return issues;
    });

    return {
      name: 'Touch Targets',
      issues: touchIssues.map(issue => ({
        type: 'touch-target',
        severity: 'high',
        message: `Touch target too small (${issue.size}): ${issue.text}`
      })),
      severity: 4
    };
  }

  async checkImages(page) {
    const imageIssues = await page.evaluate(() => {
      const issues = [];
      const images = document.querySelectorAll('img');
      
      images.forEach(img => {
        // Check for responsive images
        if (!img.srcset && !img.sizes) {
          issues.push({
            src: img.src,
            issue: 'No responsive images (srcset/sizes)'
          });
        }
        
        // Check aspect ratio
        const naturalRatio = img.naturalWidth / img.naturalHeight;
        const displayRatio = img.width / img.height;
        if (Math.abs(naturalRatio - displayRatio) > 0.1) {
          issues.push({
            src: img.src,
            issue: `Aspect ratio distortion: ${naturalRatio.toFixed(2)} → ${displayRatio.toFixed(2)}`
          });
        }
        
        // Check for missing alt text
        if (!img.alt) {
          issues.push({
            src: img.src,
            issue: 'Missing alt text'
          });
        }
      });
      
      return issues;
    });

    return {
      name: 'Image Optimization',
      issues: imageIssues.map(issue => ({
        type: 'image',
        severity: 'medium',
        message: `Image issue: ${issue.issue}`
      })),
      severity: 2
    };
  }

  async checkNavigation(page, viewport) {
    const navIssues = await page.evaluate((isMobile) => {
      const issues = [];
      const nav = document.querySelector('nav, .navbar, .navigation, header');
      
      if (nav) {
        const rect = nav.getBoundingClientRect();
        
        // Check if navigation is visible
        if (rect.height === 0) {
          issues.push('Navigation not visible');
        }
        
        // Check for hamburger menu on mobile
        if (isMobile) {
          const hamburger = nav.querySelector('.hamburger, .menu-toggle, .burger, [class*="menu-btn"]');
          if (!hamburger) {
            issues.push('No mobile menu toggle found');
          }
        }
        
        // Check dropdown menus
        const dropdowns = nav.querySelectorAll('.dropdown, [class*="dropdown"]');
        dropdowns.forEach(dropdown => {
          const dropdownRect = dropdown.getBoundingClientRect();
          if (dropdownRect.right > window.innerWidth) {
            issues.push('Dropdown menu extends beyond viewport');
          }
        });
      } else {
        issues.push('No navigation element found');
      }
      
      return issues;
    }, viewport.isMobile);

    return {
      name: 'Navigation',
      issues: navIssues.map(issue => ({
        type: 'navigation',
        severity: 'high',
        message: issue
      })),
      severity: 5
    };
  }

  async checkForms(page, viewport) {
    const formIssues = await page.evaluate((isMobile) => {
      const issues = [];
      const inputs = document.querySelectorAll('input, textarea, select');
      
      inputs.forEach(input => {
        const rect = input.getBoundingClientRect();
        const styles = window.getComputedStyle(input);
        
        // Check input height for touch
        if (isMobile && rect.height < 38) {
          issues.push({
            type: input.type || 'text',
            height: rect.height,
            issue: 'Input too small for touch'
          });
        }
        
        // Check font size
        const fontSize = parseFloat(styles.fontSize);
        if (fontSize < 16 && isMobile) {
          issues.push({
            type: input.type || 'text',
            fontSize: fontSize,
            issue: 'Font size too small (causes zoom on iOS)'
          });
        }
        
        // Check for labels
        const id = input.id;
        if (id) {
          const label = document.querySelector(`label[for="${id}"]`);
          if (!label && input.type !== 'submit' && input.type !== 'button') {
            issues.push({
              type: input.type || 'text',
              issue: 'Missing label'
            });
          }
        }
      });
      
      return issues;
    }, viewport.isMobile);

    return {
      name: 'Forms',
      issues: formIssues.map(issue => ({
        type: 'form',
        severity: 'medium',
        message: `Form issue: ${issue.issue}`
      })),
      severity: 3
    };
  }

  async checkModals(page) {
    const modalIssues = await page.evaluate(() => {
      const issues = [];
      const modals = document.querySelectorAll('.modal, [class*="modal"], .popup, [class*="popup"]');
      
      modals.forEach(modal => {
        const styles = window.getComputedStyle(modal);
        
        // Check if modal is responsive
        if (styles.position === 'fixed') {
          const width = parseFloat(styles.width);
          if (width > window.innerWidth) {
            issues.push('Modal wider than viewport');
          }
        }
        
        // Check for close button
        const closeBtn = modal.querySelector('.close, [class*="close"], button[aria-label*="close"]');
        if (!closeBtn) {
          issues.push('Modal missing close button');
        }
      });
      
      return issues;
    });

    return {
      name: 'Modals',
      issues: modalIssues.map(issue => ({
        type: 'modal',
        severity: 'medium',
        message: issue
      })),
      severity: 3
    };
  }

  async checkTables(page, viewport) {
    if (!viewport.isMobile) return { name: 'Tables', issues: [], severity: 0 };

    const tableIssues = await page.evaluate(() => {
      const issues = [];
      const tables = document.querySelectorAll('table');
      
      tables.forEach(table => {
        const rect = table.getBoundingClientRect();
        const wrapper = table.closest('.table-wrapper, .table-responsive');
        
        if (rect.width > window.innerWidth && !wrapper) {
          issues.push('Table not wrapped for horizontal scroll');
        }
        
        // Check if table is responsive
        const styles = window.getComputedStyle(table);
        if (styles.display !== 'block' && rect.width > window.innerWidth) {
          issues.push('Table needs responsive treatment');
        }
      });
      
      return issues;
    });

    return {
      name: 'Tables',
      issues: tableIssues.map(issue => ({
        type: 'table',
        severity: 'high',
        message: issue
      })),
      severity: 4
    };
  }

  async checkZIndex(page) {
    const zIndexIssues = await page.evaluate(() => {
      const issues = [];
      const elements = document.querySelectorAll('*');
      const zIndexMap = new Map();
      
      elements.forEach(el => {
        const styles = window.getComputedStyle(el);
        const zIndex = parseInt(styles.zIndex);
        
        if (!isNaN(zIndex) && zIndex > 0) {
          if (zIndex > 9999) {
            issues.push({
              element: el.tagName,
              zIndex: zIndex,
              issue: 'Extremely high z-index'
            });
          }
          
          // Check for z-index conflicts
          const rect = el.getBoundingClientRect();
          const key = `${Math.round(rect.top)}-${Math.round(rect.left)}`;
          
          if (zIndexMap.has(key)) {
            const existing = zIndexMap.get(key);
            if (Math.abs(existing - zIndex) < 10) {
              issues.push({
                element: el.tagName,
                zIndex: zIndex,
                issue: 'Potential z-index conflict'
              });
            }
          } else {
            zIndexMap.set(key, zIndex);
          }
        }
      });
      
      return issues;
    });

    return {
      name: 'Z-Index',
      issues: zIndexIssues.map(issue => ({
        type: 'z-index',
        severity: 'low',
        message: `${issue.issue}: ${issue.element} (z-index: ${issue.zIndex})`
      })),
      severity: 1
    };
  }

  async checkViewportMeta(page) {
    const viewportIssues = await page.evaluate(() => {
      const issues = [];
      const viewport = document.querySelector('meta[name="viewport"]');
      
      if (!viewport) {
        issues.push('Missing viewport meta tag');
      } else {
        const content = viewport.getAttribute('content');
        if (!content.includes('width=device-width')) {
          issues.push('Viewport missing width=device-width');
        }
        if (content.includes('maximum-scale=1') || content.includes('user-scalable=no')) {
          issues.push('Viewport prevents user zoom (accessibility issue)');
        }
      }
      
      return issues;
    });

    return {
      name: 'Viewport Meta',
      issues: viewportIssues.map(issue => ({
        type: 'viewport',
        severity: 'high',
        message: issue
      })),
      severity: 5
    };
  }

  async checkHorizontalScroll(page) {
    const scrollIssues = await page.evaluate(() => {
      const hasHorizontalScroll = document.documentElement.scrollWidth > window.innerWidth;
      
      if (hasHorizontalScroll) {
        return [{
          scrollWidth: document.documentElement.scrollWidth,
          viewportWidth: window.innerWidth,
          overflow: document.documentElement.scrollWidth - window.innerWidth
        }];
      }
      
      return [];
    });

    return {
      name: 'Horizontal Scroll',
      issues: scrollIssues.map(issue => ({
        type: 'scroll',
        severity: 'critical',
        message: `Horizontal scroll detected: ${issue.overflow}px overflow`
      })),
      severity: 10
    };
  }

  async checkFontSizes(page, viewport) {
    const fontIssues = await page.evaluate(() => {
      const issues = [];
      const elements = document.querySelectorAll('*');
      const fontSizes = new Map();
      
      elements.forEach(el => {
        if (el.textContent.trim().length > 0) {
          const styles = window.getComputedStyle(el);
          const fontSize = styles.fontSize;
          
          if (!fontSizes.has(fontSize)) {
            fontSizes.set(fontSize, 0);
          }
          fontSizes.set(fontSize, fontSizes.get(fontSize) + 1);
        }
      });
      
      // Check for too many font sizes (design inconsistency)
      if (fontSizes.size > 10) {
        issues.push(`Too many font sizes: ${fontSizes.size} different sizes found`);
      }
      
      return issues;
    });

    return {
      name: 'Font Consistency',
      issues: fontIssues.map(issue => ({
        type: 'typography',
        severity: 'low',
        message: issue
      })),
      severity: 1
    };
  }

  async checkColorContrast(page) {
    // Simplified contrast check - in production, use axe-core or similar
    const contrastIssues = await page.evaluate(() => {
      const issues = [];
      const texts = document.querySelectorAll('p, span, div, a, button, h1, h2, h3, h4, h5, h6');
      
      const getContrast = (rgb1, rgb2) => {
        const getLuminance = (r, g, b) => {
          const [rs, gs, bs] = [r, g, b].map(c => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
          });
          return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
        };
        
        const l1 = getLuminance(...rgb1);
        const l2 = getLuminance(...rgb2);
        return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      };
      
      // Sample check - would need proper implementation
      let lowContrastCount = 0;
      texts.forEach(el => {
        const styles = window.getComputedStyle(el);
        const color = styles.color;
        const bgColor = styles.backgroundColor;
        
        // Parse RGB values (simplified)
        const colorMatch = color.match(/\d+/g);
        const bgMatch = bgColor.match(/\d+/g);
        
        if (colorMatch && bgMatch) {
          const contrast = getContrast(
            colorMatch.map(Number),
            bgMatch.map(Number)
          );
          
          if (contrast < 4.5) {
            lowContrastCount++;
          }
        }
      });
      
      if (lowContrastCount > 0) {
        issues.push(`${lowContrastCount} elements with potential contrast issues`);
      }
      
      return issues;
    });

    return {
      name: 'Color Contrast',
      issues: contrastIssues.map(issue => ({
        type: 'accessibility',
        severity: 'medium',
        message: issue
      })),
      severity: 3
    };
  }

  async checkFlexboxIssues(page) {
    const flexIssues = await page.evaluate(() => {
      const issues = [];
      const flexContainers = document.querySelectorAll('[style*="display: flex"], [style*="display:flex"]');
      
      flexContainers.forEach(container => {
        const styles = window.getComputedStyle(container);
        
        // Check for common flexbox issues
        if (styles.flexWrap === 'nowrap') {
          const children = container.children;
          let totalWidth = 0;
          
          for (let child of children) {
            totalWidth += child.getBoundingClientRect().width;
          }
          
          if (totalWidth > container.getBoundingClientRect().width) {
            issues.push('Flex container overflow (consider flex-wrap)');
          }
        }
      });
      
      return issues;
    });

    return {
      name: 'Flexbox Layout',
      issues: flexIssues.map(issue => ({
        type: 'layout',
        severity: 'medium',
        message: issue
      })),
      severity: 3
    };
  }

  async checkGridIssues(page) {
    const gridIssues = await page.evaluate(() => {
      const issues = [];
      const gridContainers = document.querySelectorAll('[style*="display: grid"], [style*="display:grid"]');
      
      gridContainers.forEach(container => {
        const styles = window.getComputedStyle(container);
        const gridTemplate = styles.gridTemplateColumns;
        
        // Check for fixed pixel values in grid
        if (gridTemplate && gridTemplate.includes('px') && !gridTemplate.includes('minmax')) {
          issues.push('Grid using fixed pixel values (not responsive)');
        }
      });
      
      return issues;
    });

    return {
      name: 'Grid Layout',
      issues: gridIssues.map(issue => ({
        type: 'layout',
        severity: 'medium',
        message: issue
      })),
      severity: 3
    };
  }

  async testBreakpoint(width) {
    this.log(`Testing breakpoint: ${width}px`, 'test');
    
    const page = await this.browser.newPage();
    await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
    
    const breakpointResults = {
      width: width,
      issues: [],
      transitions: []
    };

    try {
      await page.goto(this.baseUrl, { waitUntil: 'networkidle2' });
      
      // Check for layout jumps
      const layoutMetrics = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const positions = [];
        
        elements.forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            positions.push({
              tag: el.tagName,
              class: el.className,
              top: rect.top,
              left: rect.left
            });
          }
        });
        
        return positions;
      });
      
      // Test ±1px to detect breakpoint issues
      await page.setViewport({ width: width - 1, height: 900, deviceScaleFactor: 1 });
      await page.waitForTimeout(100);
      
      const layoutMetricsBefore = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const positions = [];
        
        elements.forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            positions.push({
              tag: el.tagName,
              class: el.className,
              top: rect.top,
              left: rect.left
            });
          }
        });
        
        return positions;
      });
      
      // Compare layouts
      let layoutChanges = 0;
      layoutMetrics.forEach((metric, index) => {
        if (layoutMetricsBefore[index]) {
          const diff = Math.abs(metric.top - layoutMetricsBefore[index].top) + 
                      Math.abs(metric.left - layoutMetricsBefore[index].left);
          if (diff > 100) {
            layoutChanges++;
          }
        }
      });
      
      if (layoutChanges > 5) {
        breakpointResults.issues.push({
          type: 'breakpoint',
          severity: 'medium',
          message: `Unstable breakpoint at ${width}px: ${layoutChanges} elements jump`
        });
      }
      
    } catch (error) {
      breakpointResults.issues.push({
        type: 'error',
        severity: 'high',
        message: `Breakpoint test failed: ${error.message}`
      });
    } finally {
      await page.close();
    }

    this.results.breakpointResults[width] = breakpointResults;
    return breakpointResults;
  }

  async runComprehensiveTest() {
    await this.initialize();
    
    this.log('=' .repeat(60), 'info');
    this.log('🎨 RESPONSIVE QA TEST SUITE', 'info');
    this.log('Testing URL: ' + this.baseUrl, 'info');
    this.log('=' .repeat(60), 'info');
    
    // Test all devices
    this.log('\n📱 TESTING DEVICES', 'info');
    for (const [deviceName, viewport] of Object.entries(DEVICES)) {
      const result = await this.testDevice(deviceName, viewport);
      
      if (result.score < 50) {
        this.results.critical.push(`${deviceName}: Critical issues found`);
        this.log(`${deviceName}: CRITICAL ISSUES`, 'critical');
      } else if (result.score < 80) {
        this.log(`${deviceName}: Issues found`, 'warning');
      } else {
        this.log(`${deviceName}: Passed`, 'success');
      }
      
      this.results.totalTests++;
      if (result.score >= 80) {
        this.results.passed++;
      } else if (result.score >= 50) {
        this.results.warnings++;
      } else {
        this.results.failed++;
      }
    }
    
    // Test critical breakpoints
    this.log('\n🔍 TESTING BREAKPOINTS', 'info');
    for (const breakpoint of BREAKPOINTS) {
      await this.testBreakpoint(breakpoint);
    }
    
    await this.generateReport();
    await this.cleanup();
    
    return this.results;
  }

  async generateReport() {
    this.log('\n📊 GENERATING REPORT', 'info');
    
    // Calculate overall score
    const totalDevices = Object.keys(DEVICES).length;
    const avgScore = Object.values(this.results.deviceResults)
      .reduce((sum, device) => sum + device.score, 0) / totalDevices;
    
    this.results.overallScore = avgScore;
    
    // Categorize issues
    const issuesByType = {};
    Object.values(this.results.deviceResults).forEach(device => {
      device.issues.forEach(issue => {
        if (!issuesByType[issue.type]) {
          issuesByType[issue.type] = [];
        }
        issuesByType[issue.type].push({
          device: device.device,
          ...issue
        });
      });
    });
    
    this.results.issuesByType = issuesByType;
    
    // Generate HTML report
    const htmlReport = this.generateHTMLReport();
    await fs.writeFile('responsive-qa-report.html', htmlReport);
    
    // Generate JSON report
    await fs.writeFile('responsive-qa-report.json', JSON.stringify(this.results, null, 2));
    
    // Console summary
    console.log('\n' + '=' .repeat(60));
    this.log('📋 TEST SUMMARY', 'info');
    console.log('=' .repeat(60));
    
    console.log(`Overall Score: ${avgScore.toFixed(1)}/100`);
    console.log(`Devices Tested: ${totalDevices}`);
    console.log(`Passed: ${this.results.passed}`);
    console.log(`Warnings: ${this.results.warnings}`);
    console.log(`Failed: ${this.results.failed}`);
    
    if (this.results.critical.length > 0) {
      this.log('\n🚨 CRITICAL ISSUES:', 'critical');
      this.results.critical.forEach(issue => {
        console.log(`  - ${issue}`);
      });
    }
    
    console.log('\n📊 Issues by Type:');
    Object.entries(issuesByType).forEach(([type, issues]) => {
      console.log(`  ${type}: ${issues.length} issues`);
    });
    
    this.log('\n✅ Reports generated:', 'success');
    console.log('  - responsive-qa-report.html (visual report)');
    console.log('  - responsive-qa-report.json (data export)');
    console.log('  - responsive-qa-screenshots/ (device screenshots)');
  }

  generateHTMLReport() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Responsive QA Report - ${this.baseUrl}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f7; color: #333; line-height: 1.6; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center; }
        .container { max-width: 1400px; margin: 0 auto; padding: 40px 20px; }
        .score-card { background: white; border-radius: 20px; padding: 30px; margin-bottom: 30px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
        .score-circle { width: 200px; height: 200px; margin: 0 auto; position: relative; }
        .score-value { font-size: 48px; font-weight: bold; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }
        .device-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin: 30px 0; }
        .device-card { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .device-card h3 { margin-bottom: 15px; color: #667eea; }
        .issue { background: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 10px 0; border-radius: 4px; }
        .issue.critical { background: #f8d7da; border-color: #dc3545; }
        .issue.success { background: #d4edda; border-color: #28a745; }
        .screenshots { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 30px 0; }
        .screenshot { border-radius: 8px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .screenshot img { width: 100%; height: auto; display: block; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0; }
        .stat-card { background: white; padding: 20px; border-radius: 12px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .stat-value { font-size: 36px; font-weight: bold; color: #667eea; }
        .stat-label { color: #666; margin-top: 5px; }
        .issue-category { margin: 30px 0; }
        .issue-category h3 { color: #333; margin-bottom: 15px; border-bottom: 2px solid #667eea; padding-bottom: 10px; }
        .progress-bar { height: 30px; background: #e9ecef; border-radius: 15px; overflow: hidden; margin: 20px 0; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #667eea, #764ba2); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎨 Responsive QA Report</h1>
        <p>${this.baseUrl}</p>
        <p>Generated: ${new Date().toLocaleString()}</p>
    </div>
    
    <div class="container">
        <div class="score-card">
            <h2>Overall Responsive Score</h2>
            <div class="score-circle">
                <div class="score-value">${this.results.overallScore.toFixed(0)}/100</div>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${this.results.overallScore}%">
                    ${this.results.overallScore.toFixed(0)}%
                </div>
            </div>
        </div>
        
        <div class="stats">
            <div class="stat-card">
                <div class="stat-value">${Object.keys(DEVICES).length}</div>
                <div class="stat-label">Devices Tested</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${this.results.passed}</div>
                <div class="stat-label">Passed</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${this.results.warnings}</div>
                <div class="stat-label">Warnings</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${this.results.failed}</div>
                <div class="stat-label">Failed</div>
            </div>
        </div>
        
        ${this.results.critical.length > 0 ? `
        <div class="issue-category">
            <h3>🚨 Critical Issues</h3>
            ${this.results.critical.map(issue => `
                <div class="issue critical">${issue}</div>
            `).join('')}
        </div>
        ` : ''}
        
        <div class="issue-category">
            <h3>📱 Device Results</h3>
            <div class="device-grid">
                ${Object.entries(this.results.deviceResults).map(([device, result]) => `
                    <div class="device-card">
                        <h3>${device}</h3>
                        <p><strong>Viewport:</strong> ${result.viewport}</p>
                        <p><strong>Score:</strong> ${result.score}/100</p>
                        ${result.issues.length > 0 ? `
                            <h4>Issues:</h4>
                            ${result.issues.slice(0, 3).map(issue => `
                                <div class="issue ${issue.severity === 'critical' ? 'critical' : ''}">
                                    ${issue.message}
                                </div>
                            `).join('')}
                            ${result.issues.length > 3 ? `<p>...and ${result.issues.length - 3} more</p>` : ''}
                        ` : '<div class="issue success">✅ No issues found</div>'}
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="issue-category">
            <h3>📊 Issues by Type</h3>
            ${Object.entries(this.results.issuesByType || {}).map(([type, issues]) => `
                <div>
                    <h4>${type} (${issues.length} issues)</h4>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${Math.min(100, issues.length * 10)}%; background: ${issues.length > 10 ? '#dc3545' : issues.length > 5 ? '#ffc107' : '#28a745'}">
                            ${issues.length} issues
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="issue-category">
            <h3>📸 Device Screenshots</h3>
            <p>Screenshots saved in: responsive-qa-screenshots/</p>
            <div class="screenshots">
                ${this.results.screenshots.slice(0, 6).map(screenshot => `
                    <div class="screenshot">
                        <img src="${screenshot}" alt="${screenshot}" />
                    </div>
                `).join('')}
            </div>
        </div>
    </div>
</body>
</html>`;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// CLI Usage
if (require.main === module) {
  const url = process.argv[2] || 'http://localhost:9090';
  
  console.log('\n🎨 Responsive QA Subagent - World-Class Testing\n');
  
  const tester = new ResponsiveQASubagent(url);
  tester.runComprehensiveTest()
    .then(results => {
      if (results.overallScore >= 90) {
        console.log('\n🏆 EXCELLENT! Your site is highly responsive!');
      } else if (results.overallScore >= 70) {
        console.log('\n✅ GOOD! Some improvements needed.');
      } else if (results.overallScore >= 50) {
        console.log('\n⚠️  NEEDS WORK! Several responsive issues found.');
      } else {
        console.log('\n🚨 CRITICAL! Major responsive issues detected!');
      }
      
      process.exit(results.failed > 0 ? 1 : 0);
    })
    .catch(error => {
      console.error('❌ Test failed:', error);
      process.exit(1);
    });
}

module.exports = ResponsiveQASubagent;