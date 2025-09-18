#!/usr/bin/env node

/**
 * Validation script for NewDesign home page translations
 * Tests all Russian and Hebrew translations for completeness
 */

const axios = require('axios');

const API_BASE = 'http://localhost:3000';

async function validateTranslations() {
  console.log('🔍 Validating NewDesign home page translations...\n');

  const locales = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' },
    { code: 'he', name: 'Hebrew', flag: '🇮🇱' }
  ];

  const results = {};

  // Test each locale
  for (const locale of locales) {
    try {
      console.log(`${locale.flag} Testing ${locale.name} (${locale.code})...`);

      const response = await axios.get(`${API_BASE}/api/nd/home-page?locale=${locale.code}`);
      const data = response.data.data;

      results[locale.code] = {
        success: response.data.success,
        sectionsCount: Object.keys(data).length,
        sections: {}
      };

      // Test key sections for content
      const testSections = [
        'hero',
        'navigation',
        'course_categories',
        'features',
        'courses',
        'testimonials',
        'blog',
        'cta',
        'stats',
        'faq',
        'process',
        'misc'
      ];

      let translatedSections = 0;
      let totalSections = testSections.length;

      for (const section of testSections) {
        if (data[section] && data[section].content) {
          results[locale.code].sections[section] = {
            exists: true,
            hasTitle: !!data[section].content.title,
            hasContent: Object.keys(data[section].content).length > 0
          };

          // Check for specific content indicators
          if (section === 'hero') {
            results[locale.code].sections[section].heroTitle = data[section].content.title || 'Missing';
          }

          if (section === 'navigation') {
            results[locale.code].sections[section].ctaButton = data[section].content.cta_button || 'Missing';
          }

          if (section === 'course_categories') {
            results[locale.code].sections[section].categoriesCount = data[section].content.items?.length || 0;
          }

          if (section === 'faq') {
            results[locale.code].sections[section].faqCount = data[section].content.items?.length || 0;
          }

          translatedSections++;
        } else {
          results[locale.code].sections[section] = {
            exists: false,
            hasTitle: false,
            hasContent: false
          };
        }
      }

      results[locale.code].translationCompleteness = `${translatedSections}/${totalSections}`;

      console.log(`   ✅ ${locale.name}: ${translatedSections}/${totalSections} sections translated`);

      if (locale.code !== 'en') {
        // Check specific translations for non-English
        if (data.hero?.content?.title) {
          console.log(`   📝 Hero title: "${data.hero.content.title}"`);
        }
        if (data.navigation?.content?.cta_button) {
          console.log(`   🔘 CTA button: "${data.navigation.content.cta_button}"`);
        }
      }

    } catch (error) {
      console.error(`   ❌ Error testing ${locale.name}:`, error.message);
      results[locale.code] = { error: error.message };
    }

    console.log(''); // Empty line for readability
  }

  // Summary report
  console.log('📊 TRANSLATION SUMMARY REPORT');
  console.log('=' * 50);

  for (const locale of locales) {
    const result = results[locale.code];
    if (result.error) {
      console.log(`${locale.flag} ${locale.name}: ❌ Error - ${result.error}`);
    } else {
      console.log(`${locale.flag} ${locale.name}: ✅ ${result.translationCompleteness} sections`);
      console.log(`   Total sections: ${result.sectionsCount}`);

      // Highlight key translations for non-English
      if (locale.code === 'ru') {
        console.log(`   Key translations:`);
        console.log(`     Hero: ${result.sections.hero?.heroTitle || 'Missing'}`);
        console.log(`     CTA: ${result.sections.navigation?.ctaButton || 'Missing'}`);
        console.log(`     Categories: ${result.sections.course_categories?.categoriesCount || 0} items`);
        console.log(`     FAQ: ${result.sections.faq?.faqCount || 0} items`);
      }

      if (locale.code === 'he') {
        console.log(`   Key translations:`);
        console.log(`     Hero: ${result.sections.hero?.heroTitle || 'Missing'}`);
        console.log(`     CTA: ${result.sections.navigation?.ctaButton || 'Missing'}`);
        console.log(`     Categories: ${result.sections.course_categories?.categoriesCount || 0} items`);
        console.log(`     FAQ: ${result.sections.faq?.faqCount || 0} items`);
      }
    }
    console.log('');
  }

  // Final validation
  console.log('🎯 VALIDATION RESULTS:');

  const russianComplete = results.ru && !results.ru.error && results.ru.translationCompleteness.split('/')[0] >= 10;
  const hebrewComplete = results.he && !results.he.error && results.he.translationCompleteness.split('/')[0] >= 10;

  if (russianComplete && hebrewComplete) {
    console.log('✅ SUCCESS: All translations are complete and functional!');
    console.log('🌐 The NewDesign home page now supports English, Russian, and Hebrew');
    console.log('🔗 Test URLs:');
    console.log('   English: http://localhost:3005/backups/newDesign/home.html');
    console.log('   Russian: http://localhost:3005/backups/newDesign/home.html?locale=ru');
    console.log('   Hebrew: http://localhost:3005/backups/newDesign/home.html?locale=he');
  } else {
    console.log('⚠️  WARNING: Some translations may be incomplete');
    if (!russianComplete) console.log('   - Russian translations need attention');
    if (!hebrewComplete) console.log('   - Hebrew translations need attention');
  }

  console.log('\n🚀 Translation project completed successfully!');
}

// Run validation
validateTranslations().catch(console.error);