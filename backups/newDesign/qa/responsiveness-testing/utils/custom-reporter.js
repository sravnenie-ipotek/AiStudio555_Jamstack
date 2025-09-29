// Custom Reporter for Responsiveness Tests
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

class ResponsivenessReporter {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      duration: 0,
      totalTests: 0,
      passed: 0,
      failed: 0,
      warnings: 0,
      pages: {},
      viewports: {},
      issues: [],
      criticalIssues: []
    };

    this.startTime = Date.now();
  }

  onBegin(config, suite) {
    this.results.totalTests = suite.allTests().length;
    console.log(chalk.cyan('\n📱 Starting Responsiveness Tests...'));
    console.log(chalk.gray(`Testing ${this.results.totalTests} scenarios\n`));
  }

  onTestBegin(test) {
    // Extract page and viewport info from test title
    const match = test.title.match(/(\w+).*?(\d+)x(\d+)/);
    if (match) {
      const page = match[1];
      const viewport = `${match[2]}x${match[3]}`;

      if (!this.results.pages[page]) {
        this.results.pages[page] = { passed: 0, failed: 0, warnings: 0 };
      }

      if (!this.results.viewports[viewport]) {
        this.results.viewports[viewport] = { passed: 0, failed: 0 };
      }
    }
  }

  onTestEnd(test, result) {
    const match = test.title.match(/(\w+).*?(\d+)x(\d+)/);
    if (match) {
      const page = match[1];
      const viewport = `${match[2]}x${match[3]}`;

      if (result.status === 'passed') {
        this.results.passed++;
        if (this.results.pages[page]) this.results.pages[page].passed++;
        if (this.results.viewports[viewport]) this.results.viewports[viewport].passed++;
        console.log(chalk.green(`✓ ${test.title}`));
      } else if (result.status === 'failed') {
        this.results.failed++;
        if (this.results.pages[page]) this.results.pages[page].failed++;
        if (this.results.viewports[viewport]) this.results.viewports[viewport].failed++;
        console.log(chalk.red(`✗ ${test.title}`));

        // Log error details
        if (result.error) {
          this.results.issues.push({
            test: test.title,
            page,
            viewport,
            error: result.error.message,
            stack: result.error.stack
          });

          // Check if it's a critical issue
          if (result.error.message.includes('horizontal scroll') ||
              result.error.message.includes('not visible') ||
              result.error.message.includes('overflow')) {
            this.results.criticalIssues.push({
              test: test.title,
              issue: result.error.message
            });
          }
        }
      } else if (result.status === 'skipped') {
        console.log(chalk.yellow(`⊘ ${test.title}`));
      }
    }
  }

  async onEnd() {
    this.results.duration = Date.now() - this.startTime;

    // Print summary
    console.log(chalk.cyan('\n═══════════════════════════════════════'));
    console.log(chalk.cyan('          TEST SUMMARY'));
    console.log(chalk.cyan('═══════════════════════════════════════\n'));

    console.log(chalk.white('Overall Results:'));
    console.log(chalk.green(`  ✓ Passed: ${this.results.passed}`));
    console.log(chalk.red(`  ✗ Failed: ${this.results.failed}`));
    console.log(chalk.gray(`  ⏱  Duration: ${(this.results.duration / 1000).toFixed(2)}s\n`));

    // Page summary
    console.log(chalk.white('By Page:'));
    Object.entries(this.results.pages).forEach(([page, stats]) => {
      const status = stats.failed === 0 ? chalk.green('✓') : chalk.red('✗');
      console.log(`  ${status} ${page}: ${stats.passed} passed, ${stats.failed} failed`);
    });

    // Viewport summary
    console.log(chalk.white('\nBy Viewport:'));
    Object.entries(this.results.viewports).forEach(([viewport, stats]) => {
      const status = stats.failed === 0 ? chalk.green('✓') : chalk.red('✗');
      console.log(`  ${status} ${viewport}: ${stats.passed} passed, ${stats.failed} failed`);
    });

    // Critical issues
    if (this.results.criticalIssues.length > 0) {
      console.log(chalk.red('\n⚠️  Critical Issues:'));
      this.results.criticalIssues.forEach(issue => {
        console.log(chalk.red(`  • ${issue.test}`));
        console.log(chalk.gray(`    ${issue.issue}`));
      });
    }

    // Save detailed report
    const reportPath = path.join('reports', 'responsiveness-report.json');
    await fs.ensureDir(path.dirname(reportPath));
    await fs.writeJson(reportPath, this.results, { spaces: 2 });

    console.log(chalk.cyan(`\n📊 Detailed report saved to: ${reportPath}`));

    // Generate HTML summary
    await this.generateHTMLReport();
  }

  async generateHTMLReport() {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Responsiveness Test Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      border-radius: 10px;
      margin-bottom: 30px;
    }
    .header h1 {
      font-size: 2.5em;
      margin-bottom: 10px;
    }
    .header .date {
      opacity: 0.9;
    }
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .summary-card {
      background: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      text-align: center;
    }
    .summary-card h3 {
      font-size: 2em;
      margin-bottom: 5px;
    }
    .summary-card.passed h3 { color: #10b981; }
    .summary-card.failed h3 { color: #ef4444; }
    .summary-card.warning h3 { color: #f59e0b; }
    .summary-card p {
      color: #666;
      text-transform: uppercase;
      font-size: 0.9em;
      font-weight: 600;
    }
    .section {
      background: white;
      padding: 25px;
      border-radius: 10px;
      margin-bottom: 20px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .section h2 {
      margin-bottom: 20px;
      color: #333;
      border-bottom: 2px solid #e5e5e5;
      padding-bottom: 10px;
    }
    .table {
      width: 100%;
      border-collapse: collapse;
    }
    .table th {
      background: #f8f8f8;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      color: #666;
      border-bottom: 2px solid #e5e5e5;
    }
    .table td {
      padding: 12px;
      border-bottom: 1px solid #e5e5e5;
    }
    .table tr:hover {
      background: #f8f8f8;
    }
    .status-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.85em;
      font-weight: 600;
    }
    .status-badge.passed {
      background: #d4edda;
      color: #155724;
    }
    .status-badge.failed {
      background: #f8d7da;
      color: #721c24;
    }
    .issue {
      background: #fff5f5;
      border-left: 4px solid #ef4444;
      padding: 15px;
      margin-bottom: 10px;
      border-radius: 4px;
    }
    .issue h4 {
      color: #ef4444;
      margin-bottom: 5px;
    }
    .issue p {
      color: #666;
      font-size: 0.95em;
    }
    .progress-bar {
      width: 100%;
      height: 30px;
      background: #e5e5e5;
      border-radius: 15px;
      overflow: hidden;
      margin-top: 10px;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: 0.9em;
    }
    .footer {
      text-align: center;
      color: #666;
      margin-top: 40px;
      padding: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📱 Responsiveness Test Report</h1>
      <p class="date">Generated: ${new Date(this.results.timestamp).toLocaleString()}</p>
    </div>

    <div class="summary">
      <div class="summary-card passed">
        <h3>${this.results.passed}</h3>
        <p>Passed</p>
      </div>
      <div class="summary-card failed">
        <h3>${this.results.failed}</h3>
        <p>Failed</p>
      </div>
      <div class="summary-card warning">
        <h3>${this.results.totalTests}</h3>
        <p>Total Tests</p>
      </div>
      <div class="summary-card">
        <h3>${(this.results.duration / 1000).toFixed(1)}s</h3>
        <p>Duration</p>
      </div>
    </div>

    <div class="section">
      <h2>Success Rate</h2>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${(this.results.passed / this.results.totalTests * 100).toFixed(1)}%">
          ${(this.results.passed / this.results.totalTests * 100).toFixed(1)}%
        </div>
      </div>
    </div>

    <div class="section">
      <h2>Results by Page</h2>
      <table class="table">
        <thead>
          <tr>
            <th>Page</th>
            <th>Passed</th>
            <th>Failed</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${Object.entries(this.results.pages).map(([page, stats]) => `
            <tr>
              <td>${page}</td>
              <td>${stats.passed}</td>
              <td>${stats.failed}</td>
              <td>
                <span class="status-badge ${stats.failed === 0 ? 'passed' : 'failed'}">
                  ${stats.failed === 0 ? 'PASS' : 'FAIL'}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="section">
      <h2>Results by Viewport</h2>
      <table class="table">
        <thead>
          <tr>
            <th>Viewport</th>
            <th>Passed</th>
            <th>Failed</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${Object.entries(this.results.viewports).map(([viewport, stats]) => `
            <tr>
              <td>${viewport}</td>
              <td>${stats.passed}</td>
              <td>${stats.failed}</td>
              <td>
                <span class="status-badge ${stats.failed === 0 ? 'passed' : 'failed'}">
                  ${stats.failed === 0 ? 'PASS' : 'FAIL'}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    ${this.results.criticalIssues.length > 0 ? `
      <div class="section">
        <h2>⚠️ Critical Issues</h2>
        ${this.results.criticalIssues.map(issue => `
          <div class="issue">
            <h4>${issue.test}</h4>
            <p>${issue.issue}</p>
          </div>
        `).join('')}
      </div>
    ` : ''}

    <div class="footer">
      <p>AI Studio QA - Automated Responsiveness Testing</p>
    </div>
  </div>
</body>
</html>
    `;

    const htmlPath = path.join('reports', 'responsiveness-report.html');
    await fs.writeFile(htmlPath, html);
    console.log(chalk.green(`📄 HTML report generated: ${htmlPath}`));
  }
}

module.exports = ResponsivenessReporter;