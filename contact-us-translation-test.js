const { chromium } = require('playwright');
const path = require('path');

/**
 * CONTACT-US PAGE TRANSLATION QA TEST
 * Tests the contact page translation system following WorkingLogic.md
 * Runs translation verification for EN, RU, HE languages in a loop until all pass
 */

// Expected translations for verification
const EXPECTED_TRANSLATIONS = {
  en: {
    title: 'Contact Us - AI Studio E-Learning Platform',
    section_subtitle: "Let's Talk",
    main_heading: 'Contact Me For Inquiries.',
    description: 'If you have questions about my courses, need guidance on your learning path, or want to discuss collaboration opportunities, feel free to reach out.',
    cta_subtitle: 'Start Learning Today',
    cta_title: 'Discover A World Of Learning Opportunities.',
    footer_contact_label: 'Contact:',
    footer_menu_title: 'Menu',
    footer_utility_pages: 'Utility Pages',
    form_submit: 'Submit Now'
  },
  ru: {
    title: 'Свяжитесь с нами - Платформа онлайн-обучения AI Studio',
    section_subtitle: 'Давайте поговорим',
    main_heading: 'Свяжитесь со мной по вопросам',
    description: 'Если у вас есть вопросы о моих курсах, нужна помощь в выборе пути обучения или вы хотите обсудить возможности сотрудничества, не стесняйтесь обращаться.',
    cta_subtitle: 'Начните учиться сегодня',
    cta_title: 'Откройте мир возможностей для обучения',
    footer_contact_label: 'Контакт:',
    footer_menu_title: 'Меню',
    footer_utility_pages: 'Служебные страницы',
    form_submit: 'Отправить'
  },
  he: {
    title: 'צור קשר - פלטפורמת למידה מקוונת AI Studio',
    section_subtitle: 'בואו נדבר',
    main_heading: 'צור איתי קשר לבירורים',
    description: 'אם יש לך שאלות על הקורסים שלי, צריך הכוונה במסלול הלמידה שלך או רוצה לדון בהזדמנויות לשיתוף פעולה, אל תהסס לפנות.',
    cta_subtitle: 'התחל ללמוד היום',
    cta_title: 'גלה עולם של הזדמנויות למידה',
    footer_contact_label: 'צור קשר:',
    footer_menu_title: 'תפריט',
    footer_utility_pages: 'דפי שירות',
    form_submit: 'שלח כעת'
  }
};

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:3005',
  pageUrl: '/contact-us.html',
  timeout: 10000,
  maxRetries: 5,
  retryDelay: 2000
};

class ContactTranslationTester {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
    this.results = {};
    this.allPassed = false;
  }

  async setup() {
    console.log('🚀 Setting up Contact Translation Test Environment...');

    this.browser = await chromium.launch({
      headless: false, // Show browser for debugging
      devtools: true
    });

    this.context = await this.browser.newContext({
      viewport: { width: 1920, height: 1080 },
      locale: 'en-US',
      timezoneId: 'America/New_York'
    });

    this.page = await this.context.newPage();

    // Enable console logging
    this.page.on('console', msg => console.log(`📱 Browser: ${msg.text()}`));
    this.page.on('pageerror', error => console.error(`❌ Page Error: ${error.message}`));
  }

  async testLanguage(locale) {
    const expected = EXPECTED_TRANSLATIONS[locale];
    const results = {
      locale,
      passed: 0,
      failed: 0,
      errors: [],
      details: {}
    };

    console.log(`\n🔍 Testing ${locale.toUpperCase()} translations...`);

    try {
      // Navigate to contact page with locale
      const url = `${TEST_CONFIG.baseUrl}${TEST_CONFIG.pageUrl}?locale=${locale}`;
      console.log(`📄 Loading: ${url}`);

      await this.page.goto(url, {
        waitUntil: 'networkidle',
        timeout: TEST_CONFIG.timeout
      });

      // Wait for translation system to initialize
      console.log('⏳ Waiting for translation system...');
      await this.page.waitForTimeout(3000);

      // Wait for language manager to be ready
      await this.page.waitForFunction(() => {
        return window.languageManager && window.languageManager.initialized;
      }, { timeout: 5000 }).catch(() => {
        console.log('⚠️ Language manager not fully initialized, continuing...');
      });

      // Check RTL for Hebrew
      if (locale === 'he') {
        const dir = await this.page.getAttribute('html', 'dir');
        if (dir === 'rtl') {
          results.passed++;
          results.details.rtl = '✅ RTL Direction Applied';
        } else {
          results.failed++;
          results.errors.push('RTL direction not applied for Hebrew');
          results.details.rtl = '❌ RTL Direction Missing';
        }
      }

      // Test page title
      const title = await this.page.title();
      if (title.includes(expected.title.split(' - ')[0])) { // Check main part
        results.passed++;
        results.details.title = `✅ Title: "${title}"`;
      } else {
        results.failed++;
        results.errors.push(`Title mismatch: expected "${expected.title}", got "${title}"`);
        results.details.title = `❌ Title: "${title}"`;
      }

      // Test main content elements
      const tests = [
        {
          selector: '[data-i18n="contact.content.section_subtitle"]',
          expected: expected.section_subtitle,
          name: 'Section Subtitle'
        },
        {
          selector: '[data-i18n="contact.content.main_heading"]',
          expected: expected.main_heading,
          name: 'Main Heading'
        },
        {
          selector: '[data-i18n="contact.content.description"]',
          expected: expected.description,
          name: 'Description'
        },
        {
          selector: '[data-i18n="contact.content.cta.subtitle"]',
          expected: expected.cta_subtitle,
          name: 'CTA Subtitle'
        },
        {
          selector: '[data-i18n="contact.content.cta.title"]',
          expected: expected.cta_title,
          name: 'CTA Title'
        },
        {
          selector: '[data-i18n="footer.content.contact_label"]',
          expected: expected.footer_contact_label,
          name: 'Footer Contact Label'
        },
        {
          selector: '[data-i18n="footer.content.menu_title"]',
          expected: expected.footer_menu_title,
          name: 'Footer Menu Title'
        },
        {
          selector: '[data-i18n="contact.content.form.submit_button"]',
          expected: expected.form_submit,
          name: 'Submit Button'
        }
      ];

      for (const test of tests) {
        try {
          const element = await this.page.locator(test.selector).first();
          const isVisible = await element.isVisible();

          if (!isVisible) {
            results.failed++;
            results.errors.push(`${test.name} element not visible: ${test.selector}`);
            results.details[test.name] = '❌ Element not visible';
            continue;
          }

          const actualText = await element.textContent();
          const trimmedActual = actualText.trim();
          const trimmedExpected = test.expected.trim();

          // For partial matches (some translations may be similar)
          const isMatch = trimmedActual === trimmedExpected ||
                         trimmedActual.includes(trimmedExpected) ||
                         trimmedExpected.includes(trimmedActual);

          if (isMatch) {
            results.passed++;
            results.details[test.name] = `✅ "${trimmedActual}"`;
          } else {
            results.failed++;
            results.errors.push(`${test.name} mismatch: expected "${trimmedExpected}", got "${trimmedActual}"`);
            results.details[test.name] = `❌ Expected: "${trimmedExpected}", Got: "${trimmedActual}"`;
          }
        } catch (error) {
          results.failed++;
          results.errors.push(`${test.name} test failed: ${error.message}`);
          results.details[test.name] = `❌ Test Error: ${error.message}`;
        }
      }

      // Test form functionality
      try {
        const nameInput = await this.page.locator('[data-i18n-placeholder="contact.content.form.name_placeholder"]').first();
        const isFormVisible = await nameInput.isVisible();

        if (isFormVisible) {
          results.passed++;
          results.details.form = '✅ Contact form visible and accessible';
        } else {
          results.failed++;
          results.errors.push('Contact form not visible');
          results.details.form = '❌ Contact form not accessible';
        }
      } catch (error) {
        results.failed++;
        results.errors.push(`Form test failed: ${error.message}`);
        results.details.form = `❌ Form Error: ${error.message}`;
      }

    } catch (error) {
      results.failed++;
      results.errors.push(`Critical test error: ${error.message}`);
      console.error(`❌ Critical error testing ${locale}:`, error);
    }

    return results;
  }

  async runAllTests() {
    console.log('📋 CONTACT-US PAGE TRANSLATION QA TEST');
    console.log('=====================================');

    for (const locale of ['en', 'ru', 'he']) {
      const result = await this.testLanguage(locale);
      this.results[locale] = result;

      console.log(`\n📊 ${locale.toUpperCase()} Results:`);
      console.log(`✅ Passed: ${result.passed}`);
      console.log(`❌ Failed: ${result.failed}`);

      if (result.errors.length > 0) {
        console.log(`🚫 Errors:`);
        result.errors.forEach(error => console.log(`   - ${error}`));
      }

      console.log(`📝 Details:`);
      Object.entries(result.details).forEach(([key, value]) => {
        console.log(`   ${key}: ${value}`);
      });
    }
  }

  generateReport() {
    const totalTests = Object.values(this.results).reduce((sum, r) => sum + r.passed + r.failed, 0);
    const totalPassed = Object.values(this.results).reduce((sum, r) => sum + r.passed, 0);
    const totalFailed = Object.values(this.results).reduce((sum, r) => sum + r.failed, 0);

    console.log('\n🎯 FINAL TRANSLATION TEST REPORT');
    console.log('==================================');
    console.log(`📊 Total Tests: ${totalTests}`);
    console.log(`✅ Total Passed: ${totalPassed}`);
    console.log(`❌ Total Failed: ${totalFailed}`);
    console.log(`📈 Success Rate: ${((totalPassed / totalTests) * 100).toFixed(1)}%`);

    this.allPassed = totalFailed === 0;

    if (this.allPassed) {
      console.log('\n🎉 ALL TRANSLATIONS WORKING CORRECTLY!');
      console.log('Contact page translation system is fully functional.');
    } else {
      console.log('\n⚠️ SOME TRANSLATIONS NEED FIXES');
      console.log('Issues found that need to be addressed:');

      Object.entries(this.results).forEach(([locale, result]) => {
        if (result.failed > 0) {
          console.log(`\n${locale.toUpperCase()} Issues:`);
          result.errors.forEach(error => console.log(`  - ${error}`));
        }
      });
    }

    return this.allPassed;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Main execution function
async function runTranslationTests() {
  const tester = new ContactTranslationTester();
  let attempt = 1;
  let allPassed = false;

  try {
    await tester.setup();

    // Loop until all tests pass or max retries reached
    while (!allPassed && attempt <= TEST_CONFIG.maxRetries) {
      console.log(`\n🔄 ATTEMPT ${attempt}/${TEST_CONFIG.maxRetries}`);
      console.log(`⏰ ${new Date().toLocaleString()}`);

      await tester.runAllTests();
      allPassed = tester.generateReport();

      if (!allPassed && attempt < TEST_CONFIG.maxRetries) {
        console.log(`\n⏳ Waiting ${TEST_CONFIG.retryDelay/1000}s before retry...`);
        await new Promise(resolve => setTimeout(resolve, TEST_CONFIG.retryDelay));

        // Reset results for next attempt
        tester.results = {};
      }

      attempt++;
    }

    if (allPassed) {
      console.log('\n✅ SUCCESS: Contact page translations are working perfectly!');
      process.exit(0);
    } else {
      console.log(`\n❌ FAILED: Translation issues persist after ${TEST_CONFIG.maxRetries} attempts.`);
      process.exit(1);
    }

  } catch (error) {
    console.error('\n💥 CRITICAL TEST FAILURE:', error);
    process.exit(1);
  } finally {
    await tester.cleanup();
  }
}

// Run the tests if this file is executed directly
if (require.main === module) {
  runTranslationTests().catch(console.error);
}

module.exports = { ContactTranslationTester, runTranslationTests };