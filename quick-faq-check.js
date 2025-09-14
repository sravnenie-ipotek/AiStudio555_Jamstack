const { chromium } = require('playwright');

async function quickFAQCheck() {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto('http://localhost:3005/he/courses.html', { waitUntil: 'networkidle' });

    // Check if FAQ title is visible
    const faqTitle = await page.locator('h2:has-text("שאלות נפוצות")').first();
    const isVisible = await faqTitle.isVisible();

    console.log(`FAQ title visible: ${isVisible ? '✅ YES' : '❌ NO'}`);

    // Check if FAQ question is visible
    const faqQuestion = await page.locator('text="האם אוכל להתחיל ללמוד מאפס"').first();
    const questionVisible = await faqQuestion.count() > 0;

    console.log(`FAQ question found: ${questionVisible ? '✅ YES' : '❌ NO'}`);

    await browser.close();
}

quickFAQCheck().catch(console.error);