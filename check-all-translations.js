const { chromium } = require('playwright');

// Define text that should be translated for each language
const EXPECTED_TRANSLATIONS = {
  en: {
    // Navigation
    home: 'Home',
    courses: 'Courses',
    teachers: 'Teachers',
    blog: 'Blog',
    careerCenter: 'Career Center',
    pricing: 'Pricing',
    
    // Hero Section
    expertLed: 'Expert-Led Learning',
    heroTitle: 'Master AI and Technology',
    heroSubtitle: 'Here you can elevate your tech career',
    
    // Buttons
    signUpToday: 'Sign Up Today',
    learnMore: 'Learn More',
    getStarted: 'Get Started',
    viewAllCourses: 'View All Courses',
    enrollNow: 'Enroll Now'
  },
  ru: {
    // Navigation
    home: 'Главная',
    courses: 'Курсы',
    teachers: 'Преподаватели',
    blog: 'Блог',
    careerCenter: 'Карьерный центр',
    pricing: 'Цены',
    
    // Hero Section
    expertLed: 'Обучение с экспертами',
    heroTitle: 'Освойте ИИ и технологии',
    heroSubtitle: 'Здесь вы можете продвинуть свою IT-карьеру',
    
    // Buttons
    signUpToday: 'Записаться сегодня',
    learnMore: 'Узнать больше',
    getStarted: 'Начать',
    viewAllCourses: 'Посмотреть все курсы',
    enrollNow: 'Записаться сейчас'
  },
  he: {
    // Navigation
    home: 'בית',
    courses: 'קורסים',
    teachers: 'מורים',
    blog: 'בלוג',
    careerCenter: 'מרכז קריירה',
    pricing: 'מחירים',
    
    // Hero Section
    expertLed: 'למידה בהובלת מומחים',
    heroTitle: 'שלטו ב-AI וטכנולוגיה',
    heroSubtitle: 'כאן תוכלו לקדם את הקריירה הטכנולוגית שלכם',
    
    // Buttons
    signUpToday: 'הירשמו היום',
    learnMore: 'למידע נוסף',
    getStarted: 'התחילו',
    viewAllCourses: 'צפו בכל הקורסים',
    enrollNow: 'הירשמו עכשיו'
  }
};

async function checkPageTranslations(page, url, language) {
  console.log(`\n📄 Checking: ${url} (${language})`);
  console.log('='.repeat(60));
  
  const issues = [];
  
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000); // Wait for translations to load
    
    // Get all text content
    const pageContent = await page.evaluate(() => document.body.innerText);
    
    // Check for English text that shouldn't be there
    if (language !== 'en') {
      const englishPhrases = [
        'Expert-Led Learning',
        'Master AI and Technology',
        'Sign Up Today',
        'Learn More',
        'Get Started',
        'View All Courses',
        'Enroll Now',
        'Career Center',
        'Featured Courses',
        'About Us',
        'Contact Us',
        'Subscribe to Newsletter',
        'Full Name',
        'Email Address',
        'Phone Number',
        'Send Message',
        'All rights reserved',
        'Privacy Policy',
        'Terms of Service'
      ];
      
      for (const phrase of englishPhrases) {
        if (pageContent.includes(phrase)) {
          issues.push(`❌ Found English text: "${phrase}"`);
        }
      }
    }
    
    // Check for expected translations
    const expected = EXPECTED_TRANSLATIONS[language];
    
    // Check navigation
    const navText = await page.evaluate(() => {
      const nav = document.querySelector('nav, .navigation, .navbar');
      return nav ? nav.innerText : '';
    });
    
    if (language === 'ru' && navText.includes('Home')) {
      issues.push('❌ Navigation not translated (found "Home" instead of "Главная")');
    }
    if (language === 'he' && navText.includes('Home')) {
      issues.push('❌ Navigation not translated (found "Home" instead of "בית")');
    }
    
    // Check hero section
    const heroText = await page.evaluate(() => {
      const hero = document.querySelector('.hero-section, .hero, [class*="hero"]');
      return hero ? hero.innerText : '';
    });
    
    if (heroText) {
      if (language === 'ru' && heroText.includes('Expert-Led Learning')) {
        issues.push('❌ Hero subtitle not translated: "Expert-Led Learning"');
      }
      if (language === 'he' && heroText.includes('Expert-Led Learning')) {
        issues.push('❌ Hero subtitle not translated: "Expert-Led Learning"');
      }
    }
    
    // Check buttons
    const buttonTexts = await page.evaluate(() => {
      const buttons = document.querySelectorAll('button, .button, .btn, a.button-primary');
      return Array.from(buttons).map(b => b.innerText.trim());
    });
    
    if (language !== 'en') {
      const englishButtons = buttonTexts.filter(text => 
        ['Sign Up Today', 'Learn More', 'Get Started', 'View All Courses', 'Enroll Now'].includes(text)
      );
      if (englishButtons.length > 0) {
        issues.push(`❌ Untranslated buttons: ${englishButtons.join(', ')}`);
      }
    }
    
    // Check form labels
    const formLabels = await page.evaluate(() => {
      const labels = document.querySelectorAll('label, .form-label, input[placeholder]');
      const texts = [];
      labels.forEach(el => {
        if (el.innerText) texts.push(el.innerText.trim());
        if (el.placeholder) texts.push(el.placeholder);
      });
      return texts;
    });
    
    if (language !== 'en') {
      const englishForms = formLabels.filter(text => 
        ['Full Name', 'Email Address', 'Phone Number', 'Message', 'Subscribe'].some(eng => text.includes(eng))
      );
      if (englishForms.length > 0) {
        issues.push(`❌ Untranslated form labels: ${englishForms.slice(0, 3).join(', ')}...`);
      }
    }
    
    // Check footer
    const footerText = await page.evaluate(() => {
      const footer = document.querySelector('footer, .footer');
      return footer ? footer.innerText : '';
    });
    
    if (language !== 'en' && footerText) {
      if (footerText.includes('All rights reserved')) {
        issues.push('❌ Footer copyright not translated');
      }
      if (footerText.includes('Privacy Policy')) {
        issues.push('❌ Footer links not translated');
      }
    }
    
    // Take screenshot for evidence
    await page.screenshot({ 
      path: `translation-check-${language}-${url.split('/').pop().replace('.html', '')}.png`,
      fullPage: false 
    });
    
  } catch (error) {
    issues.push(`⚠️ Error loading page: ${error.message}`);
  }
  
  // Report findings
  if (issues.length === 0) {
    console.log('✅ All translations appear correct');
  } else {
    console.log('Issues found:');
    issues.forEach(issue => console.log(`  ${issue}`));
  }
  
  return issues;
}

async function checkAllTranslations() {
  console.log('🔍 COMPREHENSIVE TRANSLATION CHECK');
  console.log('Checking all pages in all languages for untranslated text');
  console.log('='.repeat(60));
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const allIssues = {};
  
  // Define all pages to check
  const pages = [
    'home.html',
    'courses.html',
    'teachers.html',
    'career-center.html',
    'blog.html',
    'pricing.html',
    'career-orientation.html',
    'detail_courses.html'
  ];
  
  const languages = ['en', 'ru', 'he'];
  
  for (const lang of languages) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🌐 CHECKING ${lang.toUpperCase()} PAGES`);
    console.log('='.repeat(60));
    
    allIssues[lang] = {};
    
    for (const pageName of pages) {
      const url = lang === 'en' 
        ? `https://www.aistudio555.com/${pageName}`
        : `https://www.aistudio555.com/${lang}/${pageName}`;
      
      const issues = await checkPageTranslations(page, url, lang);
      if (issues.length > 0) {
        allIssues[lang][pageName] = issues;
      }
    }
  }
  
  // Summary report
  console.log('\n' + '='.repeat(60));
  console.log('📊 TRANSLATION CHECK SUMMARY');
  console.log('='.repeat(60));
  
  let totalIssues = 0;
  
  for (const [lang, pages] of Object.entries(allIssues)) {
    const langIssues = Object.values(pages).flat().length;
    totalIssues += langIssues;
    
    if (langIssues > 0) {
      console.log(`\n${lang.toUpperCase()}: ${langIssues} issues found`);
      for (const [page, issues] of Object.entries(pages)) {
        if (issues.length > 0) {
          console.log(`  ${page}: ${issues.length} issues`);
        }
      }
    } else {
      console.log(`\n${lang.toUpperCase()}: ✅ No issues found`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`TOTAL ISSUES: ${totalIssues}`);
  
  if (totalIssues > 0) {
    console.log('\n🔧 RECOMMENDED FIXES:');
    console.log('1. Add missing translation fields to database');
    console.log('2. Update API to return all translation fields');
    console.log('3. Ensure ui-translator.js handles all elements');
    console.log('4. Add Hebrew translations for all UI elements');
  }
  
  await browser.close();
  
  return allIssues;
}

// Run the check
checkAllTranslations().catch(console.error);