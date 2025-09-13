const { chromium } = require('playwright');

(async () => {
  console.log('🚀 PLAYWRIGHT RUSSIAN TRANSLATION VERIFICATION');
  console.log('='.repeat(60));
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Test pages
  const pages = [
    { name: 'Homepage', url: 'https://www.aistudio555.com/ru/home.html' },
    { name: 'Courses', url: 'https://www.aistudio555.com/ru/courses.html' },
    { name: 'Teachers', url: 'https://www.aistudio555.com/ru/teachers.html' },
    { name: 'Career Center', url: 'https://www.aistudio555.com/ru/career-center.html' },
    { name: 'Blog', url: 'https://www.aistudio555.com/ru/blog.html' }
  ];
  
  // Expected Russian translations
  const expectedTranslations = {
    'nav a[href*="home"]': ['Главная', 'Home'],
    'nav a[href*="courses"]': ['Курсы', 'Courses'],
    'nav a[href*="teachers"]': ['Преподаватели', 'Teachers'],
    'nav a[href*="blog"]': ['Блог', 'Blog'],
    'nav a[href*="career"]': ['Карьерный центр', 'Career Center'],
    '.button-primary, .btn-primary, a.button': ['Записаться сегодня', 'Узнать больше', 'Начать', 'Sign Up Today', 'Learn More', 'Get Started'],
  };
  
  for (const testPage of pages) {
    console.log(`\n📄 Testing: ${testPage.name}`);
    console.log(`   URL: ${testPage.url}`);
    
    try {
      await page.goto(testPage.url, { waitUntil: 'networkidle', timeout: 30000 });
      
      // Wait for potential translations to load
      await page.waitForTimeout(2000);
      
      // Check navigation items
      console.log('   Navigation:');
      const navTexts = await page.evaluate(() => {
        const navItems = document.querySelectorAll('nav a, .nav-link, .navigation a');
        return Array.from(navItems).map(el => el.textContent.trim()).filter(t => t.length > 0);
      });
      
      const hasRussianNav = navTexts.some(text => 
        ['Главная', 'Курсы', 'Преподаватели', 'Блог', 'Карьерный центр', 'О нас', 'Контакты'].includes(text)
      );
      
      console.log(`     ${hasRussianNav ? '✅' : '❌'} Navigation: ${navTexts.slice(0, 5).join(', ')}${navTexts.length > 5 ? '...' : ''}`);
      
      // Check buttons
      console.log('   Buttons:');
      const buttonTexts = await page.evaluate(() => {
        const buttons = document.querySelectorAll('button, .button, .btn, a.button-primary, [class*="button"]');
        return Array.from(buttons).map(el => el.textContent.trim()).filter(t => t.length > 0 && t.length < 50);
      });
      
      const hasRussianButtons = buttonTexts.some(text => 
        ['Записаться сегодня', 'Узнать больше', 'Начать', 'Посмотреть все курсы', 'Записаться сейчас'].includes(text)
      );
      
      console.log(`     ${hasRussianButtons ? '✅' : '❌'} Buttons: ${buttonTexts.slice(0, 3).join(', ')}${buttonTexts.length > 3 ? '...' : ''}`);
      
      // Check form labels if present
      const formLabels = await page.evaluate(() => {
        const labels = document.querySelectorAll('label, .form-label, [class*="label"]');
        return Array.from(labels).map(el => el.textContent.trim()).filter(t => t.length > 0 && t.length < 30);
      });
      
      if (formLabels.length > 0) {
        const hasRussianForms = formLabels.some(text => 
          ['Имя', 'Электронная почта', 'Телефон', 'Сообщение', 'Email'].includes(text)
        );
        console.log(`     ${hasRussianForms ? '✅' : '❌'} Forms: ${formLabels.slice(0, 3).join(', ')}${formLabels.length > 3 ? '...' : ''}`);
      }
      
      // Check page title
      const pageTitle = await page.title();
      console.log(`   Page Title: ${pageTitle}`);
      
      // Take screenshot for evidence
      await page.screenshot({ 
        path: `russian-test-${testPage.name.toLowerCase().replace(' ', '-')}.png`,
        fullPage: false 
      });
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('Screenshots saved for manual verification');
  console.log('Check the .png files to visually confirm Russian translations');
  
  await browser.close();
})();