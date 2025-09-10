#!/usr/bin/env node

/**
 * 🚀 QUICK RESPONSIVE TEST - Fast validation without Puppeteer
 * Uses fetch and DOM parsing for rapid responsive checks
 */

const http = require('http');
const https = require('https');
const fs = require('fs').promises;
const path = require('path');

// Test configurations
const QUICK_DEVICES = {
  'Mobile': { width: 375, height: 667 },
  'Tablet': { width: 768, height: 1024 },
  'Desktop': { width: 1920, height: 1080 }
};

const CRITICAL_BREAKPOINTS = [320, 768, 1024, 1920];

class QuickResponsiveTest {
  constructor(url) {
    this.url = url;
    this.results = {
      timestamp: new Date().toISOString(),
      url: url,
      tests: [],
      score: 100,
      issues: []
    };
  }

  async fetchHTML() {
    return new Promise((resolve, reject) => {
      const client = this.url.startsWith('https') ? https : http;
      
      client.get(this.url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(data));
      }).on('error', reject);
    });
  }

  analyzeHTML(html) {
    console.log('\n🔍 Analyzing HTML for responsive issues...\n');
    
    // Check viewport meta
    if (!html.includes('viewport')) {
      this.results.issues.push({
        severity: 'CRITICAL',
        issue: 'Missing viewport meta tag',
        fix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1">'
      });
      this.results.score -= 30;
    }
    
    // Check for responsive images
    const imgCount = (html.match(/<img/g) || []).length;
    const srcsetCount = (html.match(/srcset=/g) || []).length;
    if (imgCount > 0 && srcsetCount === 0) {
      this.results.issues.push({
        severity: 'HIGH',
        issue: `No responsive images found (${imgCount} images, 0 with srcset)`,
        fix: 'Add srcset attributes for responsive images'
      });
      this.results.score -= 15;
    }
    
    // Check for fixed widths
    const fixedWidthCount = (html.match(/width:\s*\d+px/g) || []).length;
    if (fixedWidthCount > 10) {
      this.results.issues.push({
        severity: 'MEDIUM',
        issue: `${fixedWidthCount} fixed pixel widths found`,
        fix: 'Use relative units (%, rem, vw) instead of px for widths'
      });
      this.results.score -= 10;
    }
    
    // Check for media queries
    const mediaQueryCount = (html.match(/@media/g) || []).length;
    if (mediaQueryCount < 3) {
      this.results.issues.push({
        severity: 'HIGH',
        issue: `Only ${mediaQueryCount} media queries found`,
        fix: 'Add more breakpoint-specific styles'
      });
      this.results.score -= 20;
    }
    
    // Check for mobile menu
    const hasMobileMenu = html.includes('hamburger') || html.includes('menu-toggle') || 
                         html.includes('mobile-menu') || html.includes('burger');
    if (!hasMobileMenu) {
      this.results.issues.push({
        severity: 'MEDIUM',
        issue: 'No mobile menu implementation detected',
        fix: 'Add hamburger menu for mobile navigation'
      });
      this.results.score -= 10;
    }
    
    // Check for flex/grid usage
    const hasModernLayout = html.includes('display: flex') || html.includes('display:flex') ||
                           html.includes('display: grid') || html.includes('display:grid');
    if (!hasModernLayout) {
      this.results.issues.push({
        severity: 'LOW',
        issue: 'No modern layout systems detected (flex/grid)',
        fix: 'Consider using Flexbox or CSS Grid for responsive layouts'
      });
      this.results.score -= 5;
    }
    
    // Check font sizes
    const smallFontCount = (html.match(/font-size:\s*(1[0-3]|[0-9])px/g) || []).length;
    if (smallFontCount > 0) {
      this.results.issues.push({
        severity: 'MEDIUM',
        issue: `${smallFontCount} instances of small font sizes (<14px)`,
        fix: 'Minimum font size should be 14px on mobile, 16px preferred'
      });
      this.results.score -= 8;
    }
    
    // Check for overflow issues
    const overflowHidden = (html.match(/overflow:\s*hidden/g) || []).length;
    const overflowScroll = (html.match(/overflow:\s*scroll/g) || []).length;
    const overflowAuto = (html.match(/overflow:\s*auto/g) || []).length;
    
    this.results.tests.push({
      name: 'Overflow Handling',
      hidden: overflowHidden,
      scroll: overflowScroll,
      auto: overflowAuto,
      status: overflowAuto > overflowHidden ? 'GOOD' : 'CHECK'
    });
    
    // Check tables
    const tableCount = (html.match(/<table/g) || []).length;
    const responsiveTableCount = (html.match(/table-responsive|responsive-table|overflow-x/g) || []).length;
    if (tableCount > 0 && responsiveTableCount === 0) {
      this.results.issues.push({
        severity: 'HIGH',
        issue: `${tableCount} tables without responsive wrapper`,
        fix: 'Wrap tables in scrollable containers for mobile'
      });
      this.results.score -= 12;
    }
    
    return this.results;
  }

  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📱 QUICK RESPONSIVE TEST REPORT');
    console.log('='.repeat(60));
    console.log(`URL: ${this.url}`);
    console.log(`Score: ${Math.max(0, this.results.score)}/100`);
    console.log(`Time: ${new Date().toLocaleString()}`);
    
    if (this.results.issues.length > 0) {
      console.log('\n🚨 ISSUES FOUND:');
      console.log('-'.repeat(60));
      
      // Group by severity
      const critical = this.results.issues.filter(i => i.severity === 'CRITICAL');
      const high = this.results.issues.filter(i => i.severity === 'HIGH');
      const medium = this.results.issues.filter(i => i.severity === 'MEDIUM');
      const low = this.results.issues.filter(i => i.severity === 'LOW');
      
      if (critical.length > 0) {
        console.log('\n🔴 CRITICAL:');
        critical.forEach(issue => {
          console.log(`  ❌ ${issue.issue}`);
          console.log(`     Fix: ${issue.fix}`);
        });
      }
      
      if (high.length > 0) {
        console.log('\n🟠 HIGH:');
        high.forEach(issue => {
          console.log(`  ⚠️  ${issue.issue}`);
          console.log(`     Fix: ${issue.fix}`);
        });
      }
      
      if (medium.length > 0) {
        console.log('\n🟡 MEDIUM:');
        medium.forEach(issue => {
          console.log(`  ⚡ ${issue.issue}`);
          console.log(`     Fix: ${issue.fix}`);
        });
      }
      
      if (low.length > 0) {
        console.log('\n🟢 LOW:');
        low.forEach(issue => {
          console.log(`  💡 ${issue.issue}`);
          console.log(`     Fix: ${issue.fix}`);
        });
      }
    } else {
      console.log('\n✅ No major responsive issues detected!');
    }
    
    console.log('\n📊 RESPONSIVE CHECKLIST:');
    console.log('-'.repeat(60));
    const checklist = [
      { name: 'Viewport Meta Tag', status: !this.results.issues.find(i => i.issue.includes('viewport')) },
      { name: 'Responsive Images', status: !this.results.issues.find(i => i.issue.includes('responsive images')) },
      { name: 'Media Queries', status: !this.results.issues.find(i => i.issue.includes('media queries')) },
      { name: 'Mobile Navigation', status: !this.results.issues.find(i => i.issue.includes('mobile menu')) },
      { name: 'Flexible Layouts', status: !this.results.issues.find(i => i.issue.includes('fixed pixel')) },
      { name: 'Readable Fonts', status: !this.results.issues.find(i => i.issue.includes('font sizes')) },
      { name: 'Responsive Tables', status: !this.results.issues.find(i => i.issue.includes('tables')) }
    ];
    
    checklist.forEach(item => {
      console.log(`  ${item.status ? '✅' : '❌'} ${item.name}`);
    });
    
    console.log('\n🎯 RECOMMENDATIONS:');
    console.log('-'.repeat(60));
    
    if (this.results.score >= 90) {
      console.log('  🏆 Excellent responsive design! Minor tweaks only.');
    } else if (this.results.score >= 70) {
      console.log('  ✅ Good foundation, but needs improvements.');
      console.log('  📍 Focus on critical and high-priority issues first.');
    } else if (this.results.score >= 50) {
      console.log('  ⚠️  Significant responsive issues detected.');
      console.log('  📍 Prioritize viewport meta and mobile navigation.');
    } else {
      console.log('  🚨 Major responsive problems found!');
      console.log('  📍 Site may be unusable on mobile devices.');
      console.log('  📍 Start with viewport meta tag and media queries.');
    }
    
    console.log('\n💡 NEXT STEPS:');
    console.log('-'.repeat(60));
    console.log('  1. Fix all CRITICAL issues immediately');
    console.log('  2. Address HIGH priority issues');
    console.log('  3. Run full test: npm run test:responsive');
    console.log('  4. Test on real devices');
    
    console.log('\n' + '='.repeat(60));
    console.log('📄 Full report saved to: responsive-quick-report.json');
    console.log('='.repeat(60) + '\n');
  }

  async saveReport() {
    const report = {
      ...this.results,
      recommendation: this.results.score >= 70 ? 'PASS' : 'NEEDS_WORK',
      grade: this.results.score >= 90 ? 'A' : 
             this.results.score >= 80 ? 'B' :
             this.results.score >= 70 ? 'C' :
             this.results.score >= 60 ? 'D' : 'F'
    };
    
    await fs.writeFile('responsive-quick-report.json', JSON.stringify(report, null, 2));
  }

  async run() {
    try {
      console.log('\n🚀 Starting Quick Responsive Test...');
      console.log(`🔗 Testing: ${this.url}`);
      
      const html = await this.fetchHTML();
      console.log(`📄 Fetched ${html.length} bytes of HTML`);
      
      this.analyzeHTML(html);
      this.generateReport();
      await this.saveReport();
      
      return this.results.score >= 70;
    } catch (error) {
      console.error('❌ Test failed:', error.message);
      return false;
    }
  }
}

// CLI execution
if (require.main === module) {
  const url = process.argv[2] || 'http://localhost:9090';
  const tester = new QuickResponsiveTest(url);
  
  tester.run().then(passed => {
    process.exit(passed ? 0 : 1);
  });
}

module.exports = QuickResponsiveTest;