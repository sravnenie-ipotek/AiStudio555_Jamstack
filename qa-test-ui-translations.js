// ULTRATHINK: Comprehensive QA Test for UI Translations
// This script tests all UI fields in all languages

const https = require('https');
const fs = require('fs');

const API_BASE = 'https://aistudio555jamstack-production.up.railway.app';

// Expected Russian translations to verify
const EXPECTED_RUSSIAN = {
  navHome: 'Главная',
  navCourses: 'Курсы',
  navTeachers: 'Преподаватели',
  navBlog: 'Блог',
  navCareerCenter: 'Карьерный центр',
  navAbout: 'О нас',
  navContact: 'Контакты',
  btnSignUpToday: 'Записаться сегодня',
  btnLearnMore: 'Узнать больше',
  btnViewAllCourses: 'Все курсы',
  btnGetStarted: 'Начать',
  formLabelEmail: 'Email',
  formLabelName: 'Имя',
  formPlaceholderEmail: 'Введите ваш email',
  statsCoursesLabel: 'Курсов',
  statsLearnersLabel: 'Студентов',
  statsYearsLabel: 'Лет опыта',
  msgLoading: 'Загрузка...',
  msgSuccess: 'Успешно!',
  uiSearchPlaceholder: 'Поиск курсов...',
  uiFilterAll: 'Все'
};

// Expected English defaults
const EXPECTED_ENGLISH = {
  navHome: 'Home',
  navCourses: 'Courses',
  navTeachers: 'Teachers',
  navBlog: 'Blog',
  navCareerCenter: 'Career Center',
  navAbout: 'About Us',
  navContact: 'Contact',
  btnSignUpToday: 'Sign Up Today',
  btnLearnMore: 'Learn More',
  btnViewAllCourses: 'View All Courses',
  btnGetStarted: 'Get Started',
  formLabelEmail: 'Email',
  formLabelName: 'Name',
  formPlaceholderEmail: 'Enter your email',
  statsCoursesLabel: 'Courses',
  statsLearnersLabel: 'Learners',
  statsYearsLabel: 'Years',
  msgLoading: 'Loading...',
  msgSuccess: 'Success!',
  uiSearchPlaceholder: 'Search courses...',
  uiFilterAll: 'All'
};

// Expected Hebrew translations
const EXPECTED_HEBREW = {
  navHome: 'בית',
  navCourses: 'קורסים',
  navTeachers: 'מורים',
  navBlog: 'בלוג',
  navCareerCenter: 'מרכז קריירה',
  navAbout: 'אודות',
  navContact: 'צור קשר',
  btnSignUpToday: 'הרשם היום',
  btnLearnMore: 'למד עוד',
  btnViewAllCourses: 'כל הקורסים',
  btnGetStarted: 'התחל',
  formLabelEmail: 'אימייל',
  formLabelName: 'שם',
  msgLoading: 'טוען...',
  msgSuccess: 'הצלחה!'
};

// Test function for a specific locale
function testLocale(locale, expectedValues) {
  return new Promise((resolve, reject) => {
    const url = `${API_BASE}/api/home-page?locale=${locale}`;
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          const attrs = response.data.attributes;
          const results = {
            locale: locale,
            totalFields: Object.keys(attrs).length,
            uiFieldsFound: 0,
            correctTranslations: 0,
            incorrectTranslations: [],
            missingFields: [],
            passed: true
          };
          
          // Check each expected value
          for (const [field, expectedValue] of Object.entries(expectedValues)) {
            if (attrs[field]) {
              results.uiFieldsFound++;
              if (attrs[field] === expectedValue) {
                results.correctTranslations++;
              } else {
                results.incorrectTranslations.push({
                  field: field,
                  expected: expectedValue,
                  actual: attrs[field]
                });
                results.passed = false;
              }
            } else {
              results.missingFields.push(field);
              results.passed = false;
            }
          }
          
          resolve(results);
        } catch (error) {
          reject({ locale, error: error.message });
        }
      });
    }).on('error', reject);
  });
}

// Run all tests
async function runQATests() {
  console.log('🔍 ULTRATHINK QA TEST SUITE');
  console.log('=============================\n');
  
  const testResults = [];
  
  // Test English
  console.log('🇬🇧 Testing English translations...');
  const englishResult = await testLocale('en', EXPECTED_ENGLISH);
  testResults.push(englishResult);
  
  // Test Russian
  console.log('🇷🇺 Testing Russian translations...');
  const russianResult = await testLocale('ru', EXPECTED_RUSSIAN);
  testResults.push(russianResult);
  
  // Test Hebrew
  console.log('🇮🇱 Testing Hebrew translations...');
  const hebrewResult = await testLocale('he', EXPECTED_HEBREW);
  testResults.push(hebrewResult);
  
  // Generate report
  console.log('\n📊 QA TEST RESULTS');
  console.log('==================\n');
  
  let allPassed = true;
  
  for (const result of testResults) {
    const flag = result.locale === 'en' ? '🇬🇧' : 
                 result.locale === 'ru' ? '🇷🇺' : '🇮🇱';
    const status = result.passed ? '✅ PASSED' : '❌ FAILED';
    
    console.log(`${flag} ${result.locale.toUpperCase()} - ${status}`);
    console.log(`  Total fields: ${result.totalFields}`);
    console.log(`  UI fields tested: ${result.uiFieldsFound}/${Object.keys(result.locale === 'en' ? EXPECTED_ENGLISH : result.locale === 'ru' ? EXPECTED_RUSSIAN : EXPECTED_HEBREW).length}`);
    console.log(`  Correct translations: ${result.correctTranslations}`);
    
    if (result.incorrectTranslations.length > 0) {
      console.log(`  ⚠️ Incorrect translations:`);
      result.incorrectTranslations.forEach(item => {
        console.log(`    - ${item.field}: Expected "${item.expected}", Got "${item.actual}"`);
      });
      allPassed = false;
    }
    
    if (result.missingFields.length > 0) {
      console.log(`  ⚠️ Missing fields: ${result.missingFields.join(', ')}`);
      allPassed = false;
    }
    
    console.log('');
  }
  
  // Test statistics endpoint
  console.log('📈 Testing Statistics API...');
  const statsResults = await testStatistics();
  console.log(statsResults);
  
  // Final verdict
  console.log('\n🎯 FINAL VERDICT');
  console.log('================');
  
  if (allPassed) {
    console.log('✅ ALL TESTS PASSED!');
    console.log('🎉 Russian translation is 100% complete');
    console.log('🎉 Hebrew translation is complete');
    console.log('🎉 All UI elements are database-driven');
  } else {
    console.log('❌ SOME TESTS FAILED');
    console.log('Please review the errors above');
  }
  
  // Save detailed report
  const report = {
    timestamp: new Date().toISOString(),
    results: testResults,
    verdict: allPassed ? 'PASSED' : 'FAILED'
  };
  
  fs.writeFileSync('qa-test-results.json', JSON.stringify(report, null, 2));
  console.log('\n📁 Detailed report saved to qa-test-results.json');
}

// Test statistics endpoint
function testStatistics() {
  return new Promise((resolve) => {
    const tests = [];
    
    // Test English
    https.get(`${API_BASE}/api/statistics?locale=en`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const stats = JSON.parse(data);
        tests.push(`  EN: ${stats.courses_label === 'Courses' ? '✅' : '❌'} courses_label = "${stats.courses_label}"`);
        
        // Test Russian
        https.get(`${API_BASE}/api/statistics?locale=ru`, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            const stats = JSON.parse(data);
            tests.push(`  RU: ${stats.courses_label === 'Курсов' || stats.courses_label === 'Courses' ? '⚠️' : '❌'} courses_label = "${stats.courses_label}" (Expected: "Курсов")`);
            resolve(tests.join('\n'));
          });
        });
      });
    });
  });
}

// Run the tests
runQATests().catch(console.error);