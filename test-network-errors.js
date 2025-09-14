/**
 * Network Error Test - Find 404 errors specifically
 */

const { chromium } = require('playwright');

async function testNetworkErrors() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // Capture network requests and responses
  const failedRequests = [];
  const allRequests = [];

  page.on('response', async response => {
    const request = response.request();
    allRequests.push({
      url: request.url(),
      status: response.status(),
      method: request.method()
    });

    if (!response.ok()) {
      failedRequests.push({
        url: request.url(),
        status: response.status(),
        statusText: response.statusText(),
        method: request.method()
      });
    }
  });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('❌ Console Error:', msg.text());
    }
  });

  try {
    console.log('🔍 Loading page and monitoring network requests...');
    await page.goto('http://localhost:3005/en/home.html');
    await page.waitForTimeout(5000); // Wait for all resources to load

    console.log(`\n📊 Network Summary:`);
    console.log(`   • Total requests: ${allRequests.length}`);
    console.log(`   • Failed requests: ${failedRequests.length}`);

    if (failedRequests.length > 0) {
      console.log('\n❌ Failed requests:');
      failedRequests.forEach((req, i) => {
        console.log(`   ${i + 1}. ${req.status} ${req.statusText}`);
        console.log(`      URL: ${req.url}`);
        console.log(`      Method: ${req.method}`);
        console.log('');
      });
    } else {
      console.log('\n✅ All network requests successful!');
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await browser.close();
  }
}

testNetworkErrors().catch(console.error);