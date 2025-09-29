#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

/**
 * Report Generator Utility
 * Aggregates all test results and generates comprehensive reports
 */

class ReportGenerator {
  constructor() {
    this.reportsDir = path.join(__dirname, '..', 'reports');
    this.screenshotsDir = path.join(__dirname, '..', 'screenshots');
  }

  async generate() {
    console.log(chalk.cyan('📊 Generating comprehensive test report...\n'));

    try {
      // Collect all JSON reports
      const jsonReports = await this.collectJSONReports();

      // Analyze results
      const analysis = this.analyzeResults(jsonReports);

      // Generate dashboard
      await this.generateDashboard(analysis);

      // Generate detailed report
      await this.generateDetailedReport(analysis);

      // Generate issue tracker
      await this.generateIssueTracker(analysis);

      console.log(chalk.green('\n✅ Reports generated successfully!'));
      console.log(chalk.white(`📁 Reports available in: ${this.reportsDir}`));

    } catch (error) {
      console.error(chalk.red('❌ Error generating reports:'), error);
      process.exit(1);
    }
  }

  async collectJSONReports() {
    const jsonDir = path.join(this.reportsDir, 'json');
    const reports = [];

    if (await fs.pathExists(jsonDir)) {
      const files = await fs.readdir(jsonDir);

      for (const file of files) {
        if (file.endsWith('.json')) {
          const data = await fs.readJson(path.join(jsonDir, file));
          reports.push(data);
        }
      }
    }

    return reports;
  }

  analyzeResults(reports) {
    const analysis = {
      totalPages: new Set(),
      totalViewports: new Set(),
      issuesByPage: {},
      issuesByViewport: {},
      commonIssues: {},
      criticalPages: [],
      performanceMetrics: {},
      recommendations: []
    };

    reports.forEach(report => {
      analysis.totalPages.add(report.page);
      analysis.totalViewports.add(report.viewport.name);

      // Aggregate issues by page
      if (!analysis.issuesByPage[report.page]) {
        analysis.issuesByPage[report.page] = [];
      }
      analysis.issuesByPage[report.page].push(...(report.issues || []));

      // Aggregate issues by viewport
      if (!analysis.issuesByViewport[report.viewport.name]) {
        analysis.issuesByViewport[report.viewport.name] = [];
      }
      analysis.issuesByViewport[report.viewport.name].push(...(report.issues || []));

      // Track common issues
      (report.issues || []).forEach(issue => {
        const issueType = issue.type || issue.message;
        if (!analysis.commonIssues[issueType]) {
          analysis.commonIssues[issueType] = 0;
        }
        analysis.commonIssues[issueType]++;
      });

      // Identify critical pages
      if (report.issues && report.issues.length > 5) {
        analysis.criticalPages.push({
          page: report.page,
          viewport: report.viewport.name,
          issueCount: report.issues.length
        });
      }
    });

    // Generate recommendations
    analysis.recommendations = this.generateRecommendations(analysis);

    return analysis;
  }

  generateRecommendations(analysis) {
    const recommendations = [];

    // Check for horizontal scroll issues
    if (analysis.commonIssues['horizontal-scroll']) {
      recommendations.push({
        priority: 'HIGH',
        issue: 'Horizontal Scrolling',
        recommendation: 'Review CSS overflow properties and ensure all elements fit within viewport width',
        affectedCount: analysis.commonIssues['horizontal-scroll']
      });
    }

    // Check for mobile menu issues
    if (analysis.commonIssues['mobile-menu']) {
      recommendations.push({
        priority: 'HIGH',
        issue: 'Mobile Menu Problems',
        recommendation: 'Verify mobile menu JavaScript functionality and CSS display properties',
        affectedCount: analysis.commonIssues['mobile-menu']
      });
    }

    // Check for touch target issues
    if (analysis.commonIssues['touch-targets']) {
      recommendations.push({
        priority: 'MEDIUM',
        issue: 'Small Touch Targets',
        recommendation: 'Increase size of interactive elements to minimum 44x44px for mobile devices',
        affectedCount: analysis.commonIssues['touch-targets']
      });
    }

    // Check for text overflow
    if (analysis.commonIssues['text-overflow']) {
      recommendations.push({
        priority: 'LOW',
        issue: 'Text Overflow',
        recommendation: 'Add text-overflow: ellipsis or word-break properties to prevent text overflow',
        affectedCount: analysis.commonIssues['text-overflow']
      });
    }

    return recommendations;
  }

  async generateDashboard(analysis) {
    const dashboard = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Responsiveness Testing Dashboard</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }
    .dashboard {
      max-width: 1400px;
      margin: 0 auto;
    }
    .header {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 20px;
      padding: 40px;
      margin-bottom: 30px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    .header h1 {
      font-size: 3em;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 10px;
    }
    .header p {
      color: #666;
      font-size: 1.2em;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .card {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 15px;
      padding: 25px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
    }
    .card h2 {
      font-size: 1.5em;
      margin-bottom: 20px;
      color: #333;
    }
    .metric {
      font-size: 3em;
      font-weight: bold;
      background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .metric.warning {
      background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
    }
    .metric.error {
      background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
    }
    .list {
      list-style: none;
    }
    .list li {
      padding: 10px;
      border-bottom: 1px solid #e5e5e5;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.85em;
      font-weight: 600;
    }
    .badge.high {
      background: #fee2e2;
      color: #991b1b;
    }
    .badge.medium {
      background: #fed7aa;
      color: #9a3412;
    }
    .badge.low {
      background: #dbeafe;
      color: #1e3a8a;
    }
    .chart {
      margin-top: 20px;
    }
    .bar {
      height: 30px;
      background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
      border-radius: 5px;
      margin-bottom: 10px;
      position: relative;
    }
    .bar-label {
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
      color: white;
      font-weight: 600;
      font-size: 0.9em;
    }
  </style>
</head>
<body>
  <div class="dashboard">
    <div class="header">
      <h1>📱 Responsiveness Testing Dashboard</h1>
      <p>AI Studio - Comprehensive Testing Results</p>
      <p style="margin-top: 10px; font-size: 0.9em; color: #999;">
        Generated: ${new Date().toLocaleString()}
      </p>
    </div>

    <div class="grid">
      <div class="card">
        <h2>📊 Coverage</h2>
        <div class="metric">${analysis.totalPages.size}</div>
        <p>Pages Tested</p>
        <div class="metric" style="font-size: 2em; margin-top: 20px;">
          ${analysis.totalViewports.size}
        </div>
        <p>Viewports Tested</p>
      </div>

      <div class="card">
        <h2>⚠️ Issues Found</h2>
        <div class="metric ${Object.keys(analysis.commonIssues).length > 5 ? 'error' : 'warning'}">
          ${Object.keys(analysis.commonIssues).length}
        </div>
        <p>Unique Issue Types</p>
        <div class="metric" style="font-size: 2em; margin-top: 20px;">
          ${Object.values(analysis.commonIssues).reduce((a, b) => a + b, 0)}
        </div>
        <p>Total Issues</p>
      </div>

      <div class="card">
        <h2>🎯 Critical Pages</h2>
        <ul class="list">
          ${analysis.criticalPages.slice(0, 5).map(page => `
            <li>
              <span>${page.page} - ${page.viewport}</span>
              <span class="badge high">${page.issueCount} issues</span>
            </li>
          `).join('')}
        </ul>
      </div>
    </div>

    <div class="card">
      <h2>💡 Recommendations</h2>
      <ul class="list">
        ${analysis.recommendations.map(rec => `
          <li>
            <div>
              <strong>${rec.issue}</strong>
              <p style="color: #666; font-size: 0.9em; margin-top: 5px;">
                ${rec.recommendation}
              </p>
            </div>
            <span class="badge ${rec.priority.toLowerCase()}">
              ${rec.priority}
            </span>
          </li>
        `).join('')}
      </ul>
    </div>

    <div class="card">
      <h2>📈 Issue Distribution</h2>
      <div class="chart">
        ${Object.entries(analysis.commonIssues).map(([issue, count]) => {
          const maxCount = Math.max(...Object.values(analysis.commonIssues));
          const width = (count / maxCount) * 100;
          return `
            <div class="bar" style="width: ${width}%">
              <span class="bar-label">${issue} (${count})</span>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  </div>
</body>
</html>
    `;

    await fs.writeFile(path.join(this.reportsDir, 'dashboard.html'), dashboard);
    console.log(chalk.green('✓ Dashboard generated: reports/dashboard.html'));
  }

  async generateDetailedReport(analysis) {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        pagesTestedTestedViewports: analysis.totalViewports.size,
        totalIssues: Object.values(analysis.commonIssues).reduce((a, b) => a + b, 0),
        criticalPages: analysis.criticalPages.length
      },
      details: {
        issuesByPage: analysis.issuesByPage,
        issuesByViewport: analysis.issuesByViewport,
        commonIssues: analysis.commonIssues,
        recommendations: analysis.recommendations
      }
    };

    await fs.writeJson(
      path.join(this.reportsDir, 'detailed-report.json'),
      report,
      { spaces: 2 }
    );

    console.log(chalk.green('✓ Detailed report generated: reports/detailed-report.json'));
  }

  async generateIssueTracker(analysis) {
    let csv = 'Page,Viewport,Issue Type,Description,Priority\n';

    Object.entries(analysis.issuesByPage).forEach(([page, issues]) => {
      issues.forEach(issue => {
        const priority = this.calculatePriority(issue);
        csv += `"${page}","${issue.viewport || 'N/A'}","${issue.type || 'General'}","${issue.message || issue.toString()}","${priority}"\n`;
      });
    });

    await fs.writeFile(path.join(this.reportsDir, 'issues.csv'), csv);
    console.log(chalk.green('✓ Issue tracker generated: reports/issues.csv'));
  }

  calculatePriority(issue) {
    if (issue.type === 'horizontal-scroll' || issue.type === 'not-visible') {
      return 'HIGH';
    }
    if (issue.type === 'touch-targets' || issue.type === 'mobile-menu') {
      return 'MEDIUM';
    }
    return 'LOW';
  }
}

// Run the generator
if (require.main === module) {
  const generator = new ReportGenerator();
  generator.generate();
}

module.exports = ReportGenerator;