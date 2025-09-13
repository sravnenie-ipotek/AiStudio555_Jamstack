const { chromium } = require('playwright');

async function checkHebrewTranslations() {
  console.log('🔍 CHECKING HEBREW TRANSLATIONS');
  console.log('='.repeat(60));
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newContext().then(ctx => ctx.newPage());
  
  // Check Hebrew homepage
  const url = 'https://www.aistudio555.com/he/home.html';
  console.log(`\n📄 Checking: ${url}`);
  
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000); // Wait for translations
    
    // Check specific elements
    console.log('\n🔎 Checking Hero Section:');
    
    // Check for "Expert-Led Learning" which should be translated
    const expertLedText = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      for (const el of elements) {
        if (el.innerText && el.innerText.includes('Expert-Led Learning')) {
          return {
            found: true,
            text: el.innerText,
            className: el.className,
            tagName: el.tagName
          };
        }
      }
      return { found: false };
    });
    
    if (expertLedText.found) {
      console.log(`❌ FOUND UNTRANSLATED: "Expert-Led Learning"`);
      console.log(`   Element: ${expertLedText.tagName}.${expertLedText.className}`);
      console.log(`   Should be: "למידה בהובלת מומחים"`);
    }
    
    // Check navigation
    console.log('\n🔎 Checking Navigation:');
    const navItems = await page.evaluate(() => {
      const nav = document.querySelector('nav, .navigation, .navbar');
      if (!nav) return [];
      const links = nav.querySelectorAll('a');
      return Array.from(links).map(a => a.innerText.trim()).filter(t => t);
    });
    
    console.log(`   Found: ${navItems.join(', ')}`);
    const englishNav = navItems.filter(item => 
      ['Home', 'Courses', 'Teachers', 'Blog', 'Career Center', 'Pricing'].includes(item)
    );
    if (englishNav.length > 0) {
      console.log(`   ❌ English navigation items: ${englishNav.join(', ')}`);
    }
    
    // Check buttons
    console.log('\n🔎 Checking Buttons:');
    const buttons = await page.evaluate(() => {
      const btns = document.querySelectorAll('button, .button, .btn, a[class*="button"]');
      return Array.from(btns).map(b => b.innerText.trim()).filter(t => t && t.length < 50);
    });
    
    console.log(`   Found: ${buttons.slice(0, 5).join(', ')}...`);
    const englishButtons = buttons.filter(text => 
      ['Sign Up Today', 'Learn More', 'Get Started', 'View All Courses', 'Enroll Now'].includes(text)
    );
    if (englishButtons.length > 0) {
      console.log(`   ❌ English buttons: ${englishButtons.join(', ')}`);
    }
    
    // Check hero title and subtitle
    console.log('\n🔎 Checking Hero Content:');
    const heroContent = await page.evaluate(() => {
      const hero = document.querySelector('.hero-section, .hero, [class*="hero"]');
      if (!hero) return null;
      
      const title = hero.querySelector('h1, .hero-title, [class*="title"]');
      const subtitle = hero.querySelector('h2, .hero-subtitle, [class*="subtitle"], [class*="description"]');
      
      return {
        title: title ? title.innerText : null,
        subtitle: subtitle ? subtitle.innerText : null,
        fullText: hero.innerText.substring(0, 500)
      };
    });
    
    if (heroContent) {
      console.log(`   Title: ${heroContent.title || 'Not found'}`);
      console.log(`   Subtitle: ${heroContent.subtitle || 'Not found'}`);
      
      if (heroContent.fullText.includes('Master AI and Technology')) {
        console.log('   ❌ Found English: "Master AI and Technology"');
      }
      if (heroContent.fullText.includes('Expert-Led Learning')) {
        console.log('   ❌ Found English: "Expert-Led Learning"');
      }
    }
    
    // Take screenshot
    await page.screenshot({ 
      path: 'hebrew-homepage-check.png',
      fullPage: false 
    });
    console.log('\n📸 Screenshot saved: hebrew-homepage-check.png');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
  
  await browser.close();
}

checkHebrewTranslations().catch(console.error);