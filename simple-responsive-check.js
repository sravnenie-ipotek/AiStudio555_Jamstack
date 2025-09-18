const { chromium } = require('playwright');

const baseUrl = 'http://localhost:3005/backups/newDesign';
const pages = [
  'home.html',
  'courses.html',
  'pricing.html',
  'blog.html',
  'teachers.html',
  'career-orientation.html',
  'career-center.html',
  'about-us.html',
  'contact-us.html'
];

const viewports = [
  { name: 'Mobile-iPhone', width: 390, height: 844 },
  { name: 'Tablet-iPad', width: 768, height: 1024 },
  { name: 'Desktop-HD', width: 1366, height: 768 },
  { name: 'Desktop-FHD', width: 1920, height: 1080 }
];

async function checkPage(browser, pageFile, viewport) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height }
  });

  const page = await context.newPage();

  try {
    await page.goto(`${baseUrl}/${pageFile}`, {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    await page.waitForTimeout(1000);

    // Check for horizontal scrolling
    const scrollData = await page.evaluate(() => {
      const docElement = document.documentElement;
      const scrollWidth = docElement.scrollWidth;
      const clientWidth = docElement.clientWidth;

      return {
        hasHorizontalScroll: scrollWidth > clientWidth,
        overflow: scrollWidth - clientWidth
      };
    });

    return {
      success: true,
      ...scrollData
    };

  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  } finally {
    await context.close();
  }
}

async function runCheck() {
  console.log('Starting responsive check for NewDesign pages...\n');

  const browser = await chromium.launch({ headless: true });
  const issues = [];

  for (const pageFile of pages) {
    console.log(`Checking ${pageFile}:`);

    for (const viewport of viewports) {
      const result = await checkPage(browser, pageFile, viewport);

      if (!result.success) {
        console.log(`  ❌ ${viewport.name}: Error - ${result.error}`);
        issues.push({ page: pageFile, viewport: viewport.name, issue: 'Error loading page' });
      } else if (result.hasHorizontalScroll) {
        console.log(`  ❌ ${viewport.name}: Horizontal scroll detected (${result.overflow}px overflow)`);
        issues.push({ page: pageFile, viewport: viewport.name, issue: `Horizontal scroll: ${result.overflow}px` });
      } else {
        console.log(`  ✅ ${viewport.name}: OK`);
      }
    }
    console.log('');
  }

  await browser.close();

  // Summary
  console.log('='.repeat(60));
  console.log('SUMMARY OF RESPONSIVE ISSUES');
  console.log('='.repeat(60));

  if (issues.length === 0) {
    console.log('✅ No responsive issues found!');
  } else {
    console.log(`Found ${issues.length} issues:\n`);

    // Group by page
    const issuesByPage = {};
    issues.forEach(issue => {
      if (!issuesByPage[issue.page]) {
        issuesByPage[issue.page] = [];
      }
      issuesByPage[issue.page].push(issue);
    });

    for (const [page, pageIssues] of Object.entries(issuesByPage)) {
      console.log(`\n${page}:`);
      pageIssues.forEach(issue => {
        console.log(`  - ${issue.viewport}: ${issue.issue}`);
      });
    }
  }

  console.log('\n' + '='.repeat(60));
}

runCheck().catch(console.error);